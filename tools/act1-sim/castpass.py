"""Cast-rate pass: job-based charge + resized abilities (proposed values in P)."""
import random
import act1sim
from act1sim import *

P = {  # proposed T1 values; every number is a knob (rates, dice, values)
    "arthur":   dict(job="attack", c_atk=30, alert_cap=1, dodge=(0.5, 1.0, 1.5)),
    "wallaby":  dict(job="attack", c_atk=24, dagger=(1, 4, 1)),
    "lorcan":   dict(job="attack", c_atk=30, twin=(2.5, 3.0, 3.5)),
    "bram":     dict(job="hit", c_hit=15, heal=(2, 8, 2)),
    "dane":     dict(job="hit", c_hit=15),
    "zark":     dict(job="hit", c_hit=15, swing_die=8),
    "faelan":   dict(job="time", c_time=6.5, shield=(3, 10)),   # INT 16 makes it ~5s
    "rosalind": dict(job="time", c_time=5.0, insp=(1, 3)),
}
CHA_START = {"rosalind": 30, "dane": 20, "wallaby": 10}

def H(hid, tier=1):
    u = act1sim.HERO_FNS_BASE[hid](tier)
    p = P[hid]; u.job = p["job"]
    u.c_atk = p.get("c_atk", 1); u.c_hit = p.get("c_hit", 0)
    if "c_time" in p:
        intmod = {"faelan": 3}.get(hid, 0)
        u.c_time = p["c_time"] / (1 + 0.1 * intmod)
    u.charge = max(u.charge, CHA_START.get(hid, 0))
    if hid == "arthur":
        def cast(F, u):
            b = mid_band()
            if b == "fizzle": u.charge = 50; return
            w = {"low": p["dodge"][0], "high": p["dodge"][2], "crit": p["dodge"][2]}.get(b, p["dodge"][1]); u.dodge = w; u.dodged = 0
            def strike(F, u, b=b):
                tg = pick_target(F, u)
                if not tg: return
                n = u.tier + min(p["alert_cap"], u.dodged) + (2 if b == "crit" else 0)
                deal(F, u, tg, roll(n, 8, True) + 3 + u.ab_flat, "phys")
            u.pend.append([w, strike])
        u.ab = cast
    if hid == "wallaby":
        dn, dx, df = p["dagger"]
        def cast(F, u):
            b = mid_band()
            if b == "fizzle": u.charge = 50; return
            for _ in range({"low": 2, "high": 4}.get(b, 3)):
                cand = reachable(F, u, 3)
                if not cand: break
                tg = min(cand, key=lambda o: o.hp)
                deal(F, u, tg, roll(dn * u.tier, dx, b == "crit") + df + u.ab_flat, "phys")
        u.ab = cast
    if hid == "lorcan":
        lo, mid, hi = p["twin"]
        def cast(F, u):
            b = mid_band()
            if b == "fizzle": u.charge = 50; return
            u.twin = F.t + {"low": lo, "high": hi, "crit": hi}.get(b, mid)
        u.ab = cast
    if hid == "bram":
        hn, hx, hf = p["heal"]
        def cast(F, u):
            b = mid_band()
            if b == "fizzle": u.charge = 50; return
            inj = [a for a in F.allies(u) if a is not u and a.hp < a.maxhp]
            tgt = min(inj, key=lambda a: a.hp / a.maxhp) if inj else u
            amt = roll(hn * u.tier + (1 if b == "high" else 0), hx, b == "crit") + hf + u.ab_flat
            heal(tgt, amt)
            if tgt is not u: heal(u, amt // 2)
        u.ab = cast
    if hid == "faelan":
        sn, sx = p["shield"]
        def cast(F, u):
            b = mid_band()
            if b == "fizzle": u.charge = 50; return
            al = F.allies(u); hurt = [a for a in al if a.hp < a.maxhp]
            tg = min(hurt, key=lambda a: a.hp / a.maxhp) if hurt else next((a for a in al if a.row == "front"), u)
            n = (sn - 1 if b == "low" else sn) * u.tier + (1 if b == "high" else 0)
            w = roll(n, sx, b == "crit") + 3 + u.ab_flat
            if w > tg.ward: u.ab_out += w - tg.ward; tg.ward = w
        u.ab = cast
    if hid == "rosalind":
        dn, df = p["insp"]
        def cast(F, u):
            b = mid_band()
            if b == "fizzle": u.charge = 50; return
            al = [a for a in F.allies(u) if a is not u] or [u]
            al.sort(key=lambda a: (a.hasteT > 0, -a.dmg_done))
            for a in al[:(99 if b == "crit" else (2 if b == "high" else 1))]:
                a.haste = 0.15 + 0.05 * u.tier; a.hasteT = roll(dn, 4) + df
        u.ab = cast
    if hid == "zark":
        sd = p["swing_die"]
        def cast(F, u):
            b = max(mid_band(), mid_band(), key=lambda s: ["fizzle", "low", "mid", "high", "crit"].index(s))
            if b == "fizzle": u.charge = 50; return
            n = max(1, 2 * u.tier + {"low": -1, "high": 1}.get(b, 0))
            for o in [o for o in F.foes(u) if o.row == "front" or o is u.target][:3]:
                deal(F, u, o, roll(n, sd, b == "crit") + u.ab_flat, "phys")
            u.hp -= roll(u.tier, 6)
            u.charge = min(100, u.charge + u.c_hit)   # self-inflicted hit counts
        u.ab = cast
    return u

def enable():
    if not hasattr(act1sim, "HERO_FNS_BASE"):
        act1sim.HERO_FNS_BASE = dict(act1sim.HERO_FNS)
    act1sim.MODE["charge"] = "jobs"
    for hid in P:
        act1sim.HERO_FNS[hid] = (lambda h: (lambda t=1: H(h, t)))(hid)

def disable():
    act1sim.MODE["charge"] = "proto"
    if hasattr(act1sim, "HERO_FNS_BASE"):
        act1sim.HERO_FNS.update(act1sim.HERO_FNS_BASE)
