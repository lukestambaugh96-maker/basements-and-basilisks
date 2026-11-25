"""Act 1 encounters built from chassis/rank/affix, plus the runner."""
import random, statistics, sys
from act1sim import *

# ---------- elite and boss abilities ----------
def klarg_swing(F, u):
    t = pick_target(F, u)
    if not t: return
    b = mid_band()
    if b == "fizzle": u.charge = 50; return
    n = 4 if b in ("high", "crit") else 3
    deal(F, u, t, roll(n, 8, b == "crit") + 4, "phys")
    if b != "low": stun(F, u, t, 1.0)

def magic_missile(F, u):
    t = pick_target(F, u)
    if not t: return
    b = mid_band()
    if b == "fizzle": u.charge = 50; return
    darts = 2 if b == "low" else 3
    for _ in range(darts): deal(F, u, t, roll(1, 6, b == "crit") + 3, "magic")
    if b in ("high", "crit"): u.ward += roll(2, 10) + 2

def fireball(F, u, dice=6):
    hs = F.foes(u)
    if not hs: return
    b = mid_band()
    if b == "fizzle": u.charge = 50; return
    n = dice + {"low": -2, "high": 2}.get(b, 0)
    t = pick_target(F, u)
    hit = [t] + [h for h in hs if h is not t][:F.enc.get("clump", 1)]
    for h in hit: deal(F, u, h, roll(n, 6, b == "crit"), "magic")

def breath(F, u):
    hs = F.foes(u)
    if not hs: return
    b = mid_band()
    if b == "fizzle": u.charge = 50; return
    t = pick_target(F, u)
    hit = [t] + [h for h in hs if h is not t][:F.enc.get("clump", 1)]
    for h in hit:
        deal(F, u, h, roll(4, 6, b == "crit") + 6, "magic")
        h.poison += 5 if b in ("high", "crit") else 3

def web(F, u):
    hs = F.foes(u)
    b = mid_band()
    if b == "fizzle": u.charge = 50; return
    front = sorted(hs, key=lambda h: h.row != "front")[:2]
    for h in front:
        h.root = max(h.root, 3 if b == "high" else 2)
        deal(F, u, h, roll(2, 6, b == "crit") + 2, "magic")

def brutal_charge(F, u):
    hs = F.foes(u)
    if not hs: return
    b = mid_band()
    if b == "fizzle": u.charge = 50; return
    back = [h for h in hs if h.row == "back"] or hs
    t = back[-1]
    rear = getattr(F, "rear", None)
    if rear is not None and rear.alive: t = rear
    deal(F, u, t, roll(3 if b == "low" else 4, 8, b == "crit") + 4, "phys")
    if b != "low": stun(F, u, t, 1.5 if b == "high" else 1.0)
    u.target = t; u.grol_lock = t

# ---------- per-encounter hooks ----------
def poison_tick(F):
    if abs(F.t - round(F.t)) < DT / 2:
        for h in F.H:
            if h.alive and h.poison > 0:
                deal(F, None, h, h.poison, "magic"); h.poison = max(0, h.poison - 1)

def regen_tick(F):
    if abs(F.t - round(F.t)) < DT / 2:
        for e in F.E:
            if e.alive and "Regenerating" in e.tags: e.hp = min(e.maxhp, e.hp + random.randint(1, 4))

# ---------------- encounters ----------------
def enc_goblins(variant="intro"):
    if variant == "intro":
        # Rank 0 Swarmer: the chassis one rank down (−1 attack die, −1/3 HP), melee only
        es = [enemy("Goblin", "swarmer", hp_mult=0.65, atk=(1, 4, 2, 1.0, "phys", 1)),
              enemy("Goblin", "swarmer", hp_mult=0.65, atk=(1, 4, 2, 1.0, "phys", 1))]
    return es, {}

def enc_klarg():
    es = [enemy("Klarg", "brute", "elite", atk=(4, 6, 0, 1.6, "phys", 1), ab=klarg_swing,
                job="attack", per_atk=25),
          enemy("Ripper", "brute"),
          enemy("Goblin Archer", "shooter")]
    def reach(F, u, foes, rng):
        # narrow path: a short-range hero sent down it (strong only) can reach the archer
        if F.profile == "strong" and u.reach == 2: return foes
        return foes
    def prio(F, u, cand):
        if F.profile == "strong" and u.reach >= 2:
            a = [o for o in cand if o.name == "Goblin Archer"]
            if a: return a
        return cand
    return es, {"hero_priority": prio}

def enc_glasstaff():
    es = [enemy("Redbrand Ruffian", "bulwark", atk=(1, 8, 1, 1.6, "phys", 2)),
          enemy("Redbrand Ruffian", "bulwark", atk=(1, 8, 1, 1.6, "phys", 2)),
          enemy("Glasstaff", "shooter", "elite", affix="Warded", atk=(2, 10, 4, 1.4, "magic", 1),
                ab=magic_missile, ab_iv=6)]
    def reach(F, u, foes, rng):
        ruff = [o for o in foes if o.name.startswith("Redbrand")]
        g = [o for o in foes if o.name == "Glasstaff"]
        forward = F.profile == "strong"
        if u.reach <= 2:  # melee and short range: stuck at the bridge until it opens
            return ruff if ruff else g
        # range 3: only from a forward square; range 4 reaches from the back
        if u.reach >= 4 or forward: return ruff + g
        return ruff if ruff else g
    def prio(F, u, cand):
        if F.profile == "strong" and u.reach >= 3:
            g = [o for o in cand if o.name == "Glasstaff"]
            if g: return g
        return cand
    return es, {"reach": reach, "hero_priority": prio}

def enc_thundertree():
    vine = enemy("Vine Blight", "controller", "elite", tags={"Stunning"}, row="front")
    twigs = [enemy("Twig Blight", "swarmer") for _ in range(3)]
    needle = enemy("Needle Blight", "shooter", row="back")
    needle.reach = 3
    es = [vine] + twigs + [needle]
    cottage = set(map(id, [vine] + twigs))
    def start(F):
        hs = F.H
        if F.profile == "strong":
            # bait: put the sturdiest hero in the rearmost square
            bait = max(hs, key=lambda h: h.maxhp * (1 + h.ac / 20))
        else:
            back = [h for h in hs if h.row == "back"]
            bait = back[-1] if back else hs[-1]
        bait.pulled = True; bait.root = 1.5
        F.bait = bait
    def reach(F, u, foes, rng):
        inside = [o for o in foes if id(o) in cottage]
        out = [o for o in foes if id(o) not in cottage]
        if getattr(u, "pulled", False):
            tw = [o for o in inside if o.name == "Twig Blight"]
            return tw + [o for o in inside if o not in tw] or out
        if F.t < 3.5: return out if u.reach >= 3 else []
        tw = [o for o in inside if o.name == "Twig Blight"]
        if u.reach >= 3: return out + tw + [o for o in inside if o not in tw]
        return tw + [o for o in inside if o not in tw] + out
    def etarget(F, u, hs):
        if id(u) in cottage and F.bait.alive: return F.bait
        return None
    return es, {"start": start, "reach": reach, "enemy_target": etarget}

def enc_forge(skulls="elite+regular"):
    sk = []
    for i, kind in enumerate(skulls.split("+")):
        if kind == "elite":
            sk.append(enemy("Flameskull", "artillery", "elite", ab=fireball, ab_iv=9, tags={"area"}))
        else:
            sk.append(enemy("Flameskull (lesser)", "artillery", tags={"area"}))
    ghouls = [enemy("Ghoul", "brute", affix="Stunning") for _ in range(2)]
    es = ghouls + sk
    def start(F):
        # typical and bare stand on the Forge: bunched (clump 2) and +1 ability die
        if F.profile == "strong": F.enc["clump"] = 0
        else:
            F.enc["clump"] = 1
            for h in F.H: h.ab_flat += 3  # ~ +1 ability die
    return es, {"start": start, "clump": 1}

def enc_venomfang():
    v = enemy("Venomfang", "brute", "boss", atk=(4, 6, 0, 1.6, "phys", 1), ab=breath, ab_iv=10,
              tags={"boss", "Large"})
    v.ac, v.sr = 17, 14
    def start(F):
        F.enc["clump"] = 0 if F.profile == "strong" else 1
    def each(F):
        poison_tick(F)
        if not getattr(v, "turned", False) and v.hp < v.maxhp / 2:
            v.turned = True; v.charge = 100
            for h in F.H:
                if h.alive and h.row == "front": deal(F, v, h, roll(2, 6), "phys")
    return [v], {"start": start, "each": each, "clump": 1}

def enc_nezznar():
    n = enemy("Nezznar", "controller", "boss", ab=web, ab_iv=8, tags={"boss"})
    n.ac, n.sr = 14, 16; n.reach = 4
    sp = [enemy("Giant Spider", "brute") for _ in range(2)]
    def each(F):
        if not getattr(n, "turned", False) and n.hp < n.maxhp / 2:
            n.turned = True; n.dark_until = F.t + 6
    def reach(F, u, foes, rng):
        if getattr(n, "dark_until", -1) > F.t and u.reach >= 2:
            return [o for o in foes if o is not n]
        if u.root > 0 and u.reach <= 1:
            return [o for o in foes if o.row == "front"]
        return foes
    return sp + [n], {"each": each, "reach": reach}

def enc_grol():
    g = enemy("King Grol", "brute", "boss", atk=(4, 6, 0, 1.6, "phys", 1), ab=brutal_charge, ab_iv=10,
              tags={"boss"})
    g.ac, g.sr = 16, 12
    wolves = [enemy("Cragmaw Wolf", "swarmer", affix="Pack") for _ in range(2)]
    archer = enemy("Goblin Archer", "shooter")
    def each(F):
        if "enraged" not in g.tags and g.hp < g.maxhp / 2: g.tags.add("enraged")
    def etarget(F, u, hs):
        if u is g and getattr(g, "grol_lock", None) is not None and g.grol_lock.alive: return g.grol_lock
        return None
    def reach(F, u, foes, rng):
        # after his charge Grol stands in your back line: everyone can reach him
        return foes
    def start(F):
        if F.profile == "strong":  # a sturdy hero takes the rearmost square
            F.rear = max(F.H, key=lambda h: h.maxhp * (1 + h.ac / 20))
    return [g] + wolves + [archer], {"each": each, "enemy_target": etarget, "reach": reach, "start": start}

ENCOUNTERS = {"F2 Klarg": enc_klarg, "F3 Glasstaff": enc_glasstaff, "F4 Thundertree": enc_thundertree,
              "F5 Forge": enc_forge, "Boss Venomfang": enc_venomfang, "Boss Nezznar": enc_nezznar,
              "Boss King Grol": enc_grol}
ITEM_CE = {"F2 Klarg": 0.3, "F3 Glasstaff": 0.9, "F4 Thundertree": 2.0, "F5 Forge": 3.4,
           "Boss Venomfang": 4.6, "Boss Nezznar": 4.6, "Boss King Grol": 4.6}

POOL = list(HERO_FNS)
def draw_party(rng_seed):
    r = random.Random(rng_seed)
    return r.sample(POOL, 3)

def build_party(ids, profile, fight):
    boss = fight.startswith("Boss")
    hs = []
    for i, hid in enumerate(ids):
        tier = 2 if (boss and i == 0) else 1
        h = HERO_FNS[hid](tier); h.tier = tier
        ce = 0 if profile == "bare" else ITEM_CE[fight] + (1 if profile == "strong" else 0)
        apply_items(h, ce)
        hs.append(h)
    # sensible placement: melee in front; with no melee, the sturdiest ranged steps up
    if not any(h.row == "front" for h in hs):
        max(hs, key=lambda h: h.maxhp).row = "front"
    hs.sort(key=lambda h: h.row != "front")
    return hs

def run(fight, profile, n=200, **kw):
    res = []
    for i in range(n):
        random.seed(10_000 + i)
        ids = draw_party(i)
        if profile == "strong":
            # strong drafts a frontliner when one is offered: guarantee a melee hero
            pass
        if profile in ("typical", "strong") and not any(x in ("bram", "dane", "zark") for x in ids):
            ids = ids[:2] + [("bram", "dane", "zark")[i % 3]]
        hs = build_party(ids, profile, fight)
        es, enc = ENCOUNTERS[fight](**kw) if kw else ENCOUNTERS[fight]()
        out, F = run_fight(hs, es, enc, profile)
        hp_tot = sum(h.maxhp for h in hs)
        hp_left = sum(max(0, h.hp) for h in hs if h.alive)
        res.append(dict(win=out == "win", t=F.t, deaths=sum(not h.alive for h in hs),
                        lost=1 - hp_left / hp_tot, casts=sum(h.casts for h in hs) / 3,
                        tank_casts=min((h.casts for h in hs if h.row == "front"), default=0)))
    w = [r for r in res if r["win"]]
    return dict(fight=fight, profile=profile, win=sum(r["win"] for r in res) / n,
                t=statistics.median(r["t"] for r in res),
                lost=statistics.mean(r["lost"] for r in w) if w else 1.0,
                death_in_win=(sum(r["deaths"] > 0 for r in w) / len(w)) if w else None,
                casts=statistics.mean(r["casts"] for r in res))

def table(fights=None, n=200):
    fights = fights or list(ENCOUNTERS)
    print(f"{'fight':18} {'profile':8} {'win%':>5} {'med t':>6} {'HP lost (wins)':>15} {'wins w/ death':>14} {'casts/hero':>10}")
    for f in fights:
        for p in ("bare", "typical", "strong"):
            r = run(f, p, n)
            dw = "-" if r["death_in_win"] is None else f"{100*r['death_in_win']:.0f}%"
            print(f"{f:18} {p:8} {100*r['win']:5.0f} {r['t']:6.1f} {100*r['lost']:14.0f}% {dw:>14} {r['casts']:10.1f}")

if __name__ == "__main__":
    table(sys.argv[1:] or None)
