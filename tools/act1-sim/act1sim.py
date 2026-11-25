"""Quick Act 1 encounter sim for B&B v0.25 (chassis/rank/affix enemies).

Same simplifications as the 24 Nov quick sim in the Balance Reference: no pathing,
targeting by fixed rules (front line first), terrain reduced to reach rules.
Rules used: linear resistance R/(R+20), min 1 damage, crits double dice,
Radiant ignores AC/SR, control reads SR at half, Last Stand only for Half-Orcs.
Hero kits and HP from claude/proto-0.25/heroes.js (T1; T2 doubles ability dice).
"""
import random, statistics, sys, json
from dataclasses import dataclass, field

K = 20
DT = 0.05
CUR = {'u': None}          # unit whose ability is resolving (for ability-share stats)
MODE = {'charge': 'proto'}  # 'proto' (time + hits) or 'jobs' (per job)

def roll(n, x, crit=False):
    n = max(0, int(n)) * (2 if crit else 1)
    return sum(random.randint(1, x) for _ in range(n))

def resist(R):
    R = max(0, R)
    return R / (R + K)

@dataclass
class U:
    name: str
    side: str
    hp: float
    ac: int
    sr: int
    atk: tuple            # (n, x, flat, interval, type, strikes)
    row: str = "front"   # front / back
    role: str = "dmg"
    pen: int = 0
    ab_iv: float = 0     # seconds of time-charge per cast (0 = none)
    ab: object = None
    charge: float = 0
    job: str = "time"    # time / attack / hit
    per_atk: float = 0   # charge per attack for attack-job enemies
    reach: int = 1       # 1 melee, 2 short, 3+ ranged
    tags: set = field(default_factory=set)
    def __post_init__(self):
        self.maxhp = self.hp; self.alive = True; self.ward = 0; self.stun = 0
        self.root = 0; self.dodge = 0; self.dodged = 0; self.atkT = self.atk[3] * 0.5
        self.taunt = None; self.tauntT = 0; self.lastStand = "halforc" in self.tags
        self.invuln = 0; self.target = None; self.poison = 0; self.haste = 0; self.hasteT = 0
        self.flat_bonus = 0; self.ab_flat = 0; self.tier = 1; self.casts = 0; self.pend = []
        self.dmg_done = 0; self.lockout = 0; self.untarget = 0; self.ab_out = 0
        self.c_atk = 1; self.c_hit = 0; self.c_time = None; self.alive_t = 0

class Fight:
    def __init__(self, heroes, enemies, enc, profile):
        self.H = heroes; self.E = enemies; self.enc = enc; self.t = 0; self.profile = profile
        self.log = []
    def foes(self, u): return [o for o in (self.E if u.side == "H" else self.H) if o.alive]
    def allies(self, u): return [o for o in (self.H if u.side == "H" else self.E) if o.alive]

def deal(F, src, t, raw, typ, attack=False):
    if not t.alive or raw <= 0: return 0
    if attack and t.dodge > 0:
        t.dodged += 1; return 0
    if t.invuln > 0: return 0
    if typ == "phys": R = t.ac - (src.pen if src else 0)
    elif typ == "magic": R = t.sr
    else: R = None
    amt = raw if R is None else max(1, round(raw * (1 - resist(R))))
    # frontliner / prototype hit charge
    if t.ab and MODE['charge'] == 'jobs' and t.side == 'H':
        if t.job == 'hit': t.charge = min(100, t.charge + t.c_hit)
    elif t.ab and (t.side == "H" or t.job == "hit"):  # prototype hit charge, once per hit
        t.charge = min(100, t.charge + 60 * raw / t.maxhp)
    if t.ward > 0:
        a = min(t.ward, amt); t.ward -= a; amt -= a
    if src:
        src.dmg_done += amt
        if CUR['u'] is src: src.ab_out += amt
    t.hp -= amt
    if t.hp <= 0:
        if t.lastStand:
            t.lastStand = False; t.hp = 1; t.invuln = 1.5
        else:
            t.alive = False
    return amt

def heal(t, amt):
    if t.alive:
        real = min(amt, t.maxhp - t.hp); t.hp += real
        if CUR['u'] is not None: CUR['u'].ab_out += real

def stun(F, src, t, dur):
    if not t.alive: return
    if "boss" in t.tags: dur *= 0.5
    dur *= 1 - resist(t.sr / 2)
    t.stun = max(t.stun, dur)

# ---------------- heroes (T1 kits from heroes.js, simplified) ----------------
def mid_band():
    r = random.randint(1, 20)
    if r == 1: return "fizzle"
    if r == 20: return "crit"
    return "low" if r <= 4 else ("high" if r >= 12 else "mid")

def H_bram(t=1):
    def cast(F, u):
        b = mid_band()
        if b == "fizzle": u.charge = 50; return
        inj = [a for a in F.allies(u) if a is not u and a.hp < a.maxhp]
        tgt = min(inj, key=lambda a: a.hp / a.maxhp) if inj else u
        n = 2 * u.tier + (1 if b == "high" else 0)
        amt = roll(n, 8, b == "crit") + 2 + u.ab_flat
        heal(tgt, amt)
        if tgt is not u: heal(u, amt // 2)
    return U("Bram", "H", 120 + 36 * (t - 1) + 24 * (t - 1), 17, 13, (1, 8, 2, 1.6, "phys", 1),
             role="tank", pen=2, ab_iv=8, ab=cast, job="hit")

def H_arthur(t=1):
    def cast(F, u):
        b = mid_band()
        if b == "fizzle": u.charge = 50; return
        w = {"low": 1, "high": 2}.get(b, 1.5)
        u.dodge = w; u.dodged = 0
        def strike(F, u, b=b):
            tg = pick_target(F, u)
            if not tg: return
            n = u.tier + min(3, u.dodged) + (2 if b == "crit" else 0)
            deal(F, u, tg, roll(n, 8, True) + 3 + u.ab_flat, "phys")
        u.pend.append([w, strike])
    u = U("Arthur", "H", 120 + 44 * (t - 1) + 16 * (t - 1), 16, 11, (1, 8, 3, 1.5, "phys", 1),
          role="dmg", pen=3, ab_iv=9, ab=cast, job="attack")
    u.charge = 25
    return u

def H_faelan(t=1):
    def cast(F, u):
        b = mid_band()
        if b == "fizzle": u.charge = 50; return
        al = F.allies(u)
        hurt = [a for a in al if a.hp < a.maxhp]
        tg = min(hurt, key=lambda a: a.hp / a.maxhp) if hurt else next((a for a in al if a.row == "front"), u)
        n = (3 if b == "low" else 4) * u.tier + (1 if b == "high" else 0)
        w = roll(n, 10, b == "crit") + 3 + u.ab_flat
        if w > tg.ward: u.ab_out += w - tg.ward; tg.ward = w
    return U("Faelan", "H", 96 + 28 * (t - 1) + 8 * (t - 1), 12, 15, (1, 4, 1, 1.7, "magic", 1),
             row="back", role="sup", ab_iv=7 / 1.3, ab=cast, reach=3)

def H_wallaby(t=1):
    def cast(F, u):
        b = mid_band()
        if b == "fizzle": u.charge = 50; return
        k = {"low": 2, "high": 4}.get(b, 3)
        for _ in range(k):
            cand = reachable(F, u, 3)
            if not cand: break
            tg = min(cand, key=lambda o: o.hp)
            deal(F, u, tg, roll(2 * u.tier, 4, b == "crit") + 3 + u.ab_flat, "phys")
    return U("Wallaby", "H", 104 + 36 * (t - 1) + 8 * (t - 1), 14, 12, (1, 4, 3, 1.2, "phys", 1),
             row="back", role="dmg", ab_iv=8, ab=cast, reach=2, job="attack")

def H_dane(t=1):
    def cast(F, u):
        b = mid_band()
        if b == "fizzle": u.charge = 50; return
        cand = F.foes(u)
        if not cand: return
        tg = max(cand, key=lambda o: o.atk[0] * (o.atk[1] + 1) / 2 * o.atk[5] / o.atk[3] + ("elite" in o.tags) * 3)
        dur = {"low": 2, "high": 4}.get(b, 3)
        if "boss" in tg.tags: dur *= 0.5
        tg.taunt = u; tg.tauntT = dur * (1 - resist(tg.sr / 2))
        deal(F, u, tg, roll(u.tier, 6, b == "crit"), "radiant")
    return U("Sir Dane", "H", 120 + 44 * (t - 1) + 16 * (t - 1), 18, 12, (1, 8, 3, 1.6, "phys", 1),
             role="tank", pen=3, ab_iv=8, ab=cast, job="hit")

def H_lorcan(t=1):
    def cast(F, u):
        b = mid_band()
        if b == "fizzle": u.charge = 50; return
        u.twin = F.t + {"low": 3, "high": 5}.get(b, 4)
    u = U("Lorcan", "H", 112 + 44 * (t - 1) + 8 * (t - 1), 14, 12, (1, 8, 3, 1.5, "phys", 1),
          row="back", role="dmg", ab_iv=9, ab=cast, reach=4, job="attack")
    u.twin = -1
    return u

def H_rosalind(t=1):
    def cast(F, u):
        b = mid_band()
        if b == "fizzle": u.charge = 50; return
        al = [a for a in F.allies(u) if a is not u] or [u]
        al.sort(key=lambda a: -a.dmg_done)
        k = 99 if b == "crit" else (2 if b == "high" else 1)
        for a in al[:k]:
            a.haste = 0.15 + 0.05 * u.tier; a.hasteT = roll(2, 4) + 4
    return U("Rosalind", "H", 104 + 36 * (t - 1) + 8 * (t - 1), 13, 14, (1, 8, 3, 1.8, "magic", 1),
             row="back", role="sup", ab_iv=6, ab=cast, reach=3)

def H_zark(t=1):
    def cast(F, u):
        b = max(mid_band(), mid_band(), key=lambda s: ["fizzle", "low", "mid", "high", "crit"].index(s))
        if b == "fizzle": u.charge = 50; return
        n = max(1, 2 * u.tier + {"low": -1, "high": 1}.get(b, 0))
        adj = [o for o in F.foes(u) if o.row == "front" or o is u.target][:3]
        for o in adj: deal(F, u, o, roll(n, 12, b == "crit") + u.ab_flat, "phys")
        u.hp -= roll(u.tier, 6)
    return U("Zark", "H", 136 + 52 * (t - 1) + 24 * (t - 1), 14, 11, (1, 12, 3, 2.0, "phys", 1),
             role="dmg", pen=3, ab_iv=8, ab=cast, job="hit", tags={"halforc"})

HERO_FNS = {"bram": H_bram, "arthur": H_arthur, "faelan": H_faelan, "wallaby": H_wallaby,
            "dane": H_dane, "lorcan": H_lorcan, "rosalind": H_rosalind, "zark": H_zark}

def apply_items(u, ce):
    """Common-item equivalents: damage heroes +1 flat per CE on attacks and casts;
    tanks +2 AC per CE (cap +6) then +12 HP; supports +1 ability flat and +8 HP."""
    if ce <= 0: return
    whole = int(ce); frac = ce - whole
    steps = whole + (1 if random.random() < frac else 0)
    for i in range(steps):
        if u.role == "dmg":
            u.flat_bonus += 1; u.ab_flat += 1
        elif u.role == "tank":
            if i < 3: u.ac += 2
            else: u.maxhp += 12; u.hp += 12
        else:
            u.ab_flat += 1; u.maxhp += 8; u.hp += 8

# ---------------- enemies: chassis × rank × affix ----------------
CHASSIS = {  # Rank 1 values from the Design Templates doc
    "brute":      dict(hp=130, ac=13, sr=10, atk=(2, 6, 3, 1.6, "phys", 2), reach=1, row="front"),
    "bulwark":    dict(hp=155, ac=17, sr=12, atk=(2, 8, 6, 1.6, "phys", 1), reach=1, row="front"),
    "swarmer":    dict(hp=55,  ac=12, sr=9,  atk=(2, 4, 3, 1.0, "phys", 1), reach=1, row="front"),
    "shooter":    dict(hp=50,  ac=12, sr=10, atk=(3, 10, 5, 1.4, "phys", 1), reach=4, row="back"),
    "diver":      dict(hp=75,  ac=13, sr=10, atk=(2, 8, 6, 1.2, "phys", 1), reach=1, row="front"),
    "artillery":  dict(hp=95,  ac=12, sr=16, atk=(5, 6, 0, 2.5, "magic", 1), reach=4, row="back"),
    "controller": dict(hp=95,  ac=13, sr=13, atk=(2, 8, 4, 2.0, "magic", 1), reach=3, row="back"),
}
# Rank 1 re-sized for a party of three (knob values only: HP, dice, flat)
CHASSIS3 = {
    # HP lowered ~10% after the cast-rate pass (24 Nov): heroes lost the time-based charge trickle
    "brute":      dict(hp=80,  ac=13, sr=10, atk=(2, 6, 0, 1.6, "phys", 2), reach=1, row="front"),
    "bulwark":    dict(hp=100, ac=17, sr=12, atk=(2, 8, 2, 1.6, "phys", 1), reach=1, row="front"),
    "swarmer":    dict(hp=35,  ac=12, sr=9,  atk=(2, 4, 1, 1.0, "phys", 1), reach=1, row="front"),
    "shooter":    dict(hp=30,  ac=12, sr=10, atk=(2, 10, 4, 1.4, "phys", 1), reach=4, row="back"),
    "diver":      dict(hp=50,  ac=13, sr=10, atk=(2, 8, 2, 1.2, "phys", 1), reach=1, row="front"),
    "artillery":  dict(hp=60,  ac=12, sr=16, atk=(4, 6, 0, 2.5, "magic", 1), reach=4, row="back"),
    "controller": dict(hp=60,  ac=13, sr=13, atk=(2, 8, 1, 2.0, "magic", 1), reach=3, row="back"),
}
CH = {"table": CHASSIS3}
def two_strike(atk):  # same dps, two hits
    n, x, flat, iv, typ, s = atk
    return (max(1, n // 2), x, flat // 2, iv, typ, 2) if s == 1 else atk

def enemy(name, chassis, rank="regular", affix=None, hp_mult=1.0, dmg_flat=0, ab=None, ab_iv=0,
          job="time", per_atk=0, row=None, tags=(), atk=None):
    c = CH["table"][chassis]
    hp = c["hp"] * {"regular": 1, "elite": 2.5, "boss": 7}[rank] * hp_mult
    ac, sr = c["ac"], c["sr"]
    a = list(atk or c["atk"])
    if affix == "Armored": ac += 4; hp *= 0.8
    if affix == "Warded": sr += 4; hp *= 0.8
    if affix in ("Stunning", "Explosive"): hp *= 0.85
    if affix in ("Pack", "Regenerating"): hp *= 0.8
    if affix in ("Poisonous", "Burning"): a[2] -= 1
    a[2] += dmg_flat
    u = U(name, "E", round(hp), ac, sr, tuple(a), row=row or c["row"], ab=ab, ab_iv=ab_iv,
          job=job, per_atk=per_atk, reach=c["reach"], tags=set(tags) | {rank, chassis} | ({affix} if affix else set()))
    return u

# ---------------- targeting ----------------
def reachable(F, u, rng=None):
    """Enemies a hero can hit right now, per the encounter's reach rules."""
    rng = rng or u.reach
    foes = [o for o in F.foes(u) if o.untarget <= 0 or rng <= 1]
    rule = F.enc.get("reach")
    if rule: foes = rule(F, u, foes, rng)
    if rng <= 2:
        front = [o for o in foes if o.row == "front"]
        if front: return front
    return foes

def pick_target(F, u):
    if u.side == "H":
        cand = reachable(F, u)
        if not cand: return None
        if u.target in cand: return u.target
        pri = F.enc.get("hero_priority")
        if pri: cand = pri(F, u, cand)
        u.target = cand[0]; return u.target
    # enemies
    if u.taunt is not None and u.tauntT > 0 and u.taunt.alive: return u.taunt
    hs = F.foes(u)
    if not hs: return None
    rule = F.enc.get("enemy_target")
    if rule:
        t = rule(F, u, hs)
        if t: return t
    if u.target in hs and u.target.row == "front": return u.target
    front = [h for h in hs if h.row == "front"]
    pool = front or hs
    # lanes: spread across the front line
    u.target = pool[sum(map(ord, u.name)) % len(pool)]  # stable across runs
    return u.target

# ---------------- main loop ----------------
def tick(F, u):
    for k in ("stun", "root", "dodge", "invuln", "tauntT", "hasteT", "untarget"):
        setattr(u, k, max(0, getattr(u, k) - DT))
    for p in list(u.pend):
        p[0] -= DT
        if p[0] <= 0:
            u.pend.remove(p); CUR['u'] = u; p[1](F, u); CUR['u'] = None
    if u.stun > 0: return
    if u.ab:
        if u.side == 'H' and MODE['charge'] == 'jobs':
            if u.job == 'time' and u.c_time: u.charge = min(100, u.charge + 100 / u.c_time * DT)
        elif u.job == "time" or u.side == "H":
            u.charge = min(100, u.charge + 100 / max(0.1, u.ab_iv) * DT) if u.ab_iv else u.charge
        if u.charge >= 100 and u.lockout <= 0:
            u.charge = 0; u.casts += 1; CUR['u'] = u; u.ab(F, u); CUR['u'] = None; u.lockout = 1
            return
    u.lockout = max(0, u.lockout - DT)
    if u.side == "E" and u.root > 0 and u.reach <= 1 and not F.enc.get("engaged", True):
        return
    t = pick_target(F, u)
    if not t: return
    iv = u.atk[3] / (1 + (u.haste if u.hasteT > 0 else 0))
    if "enraged" in u.tags: iv *= 0.7
    u.atkT -= DT
    if u.atkT <= 0:
        u.atkT = iv
        n, x, flat, _, typ, strikes = u.atk
        shots = 2 if getattr(u, "twin", -1) > F.t else 1
        for k in range(strikes * shots):
            if not t.alive: break
            raw = roll(n, x) + flat + u.flat_bonus
            if shots == 2 and k % 2 == 1: CUR['u'] = u
            deal(F, u, t, raw, typ, attack=True)
            CUR['u'] = None
            if "Stunning" in u.tags:
                u.hits = getattr(u, "hits", 0) + 1
                if u.hits % 3 == 0: stun(F, u, t, 0.5)
            if "area" in u.tags:
                others = [h for h in F.foes(u) if h is not t]
                for o in others[:F.enc.get("clump", 1)]:
                    deal(F, u, o, roll(n, x) + flat, typ)
        if u.side == "H" and u.ab:
            if MODE['charge'] == 'jobs':
                if u.job == 'attack': u.charge = min(100, u.charge + u.c_atk)
            else: u.charge = min(100, u.charge + 1)
        if u.job == "attack" and u.side == "E": u.charge = min(100, u.charge + u.per_atk)
    hook = F.enc.get("on_tick")

def run_fight(heroes, enemies, enc, profile, tmax=120):
    F = Fight(heroes, enemies, enc, profile)
    if enc.get("start"): enc["start"](F)
    while F.t < tmax:
        F.t += DT
        for u in F.H + F.E:
            if u.alive: u.alive_t += DT; tick(F, u)
        if enc.get("each"): enc["each"](F)
        if not any(e.alive for e in F.E): return "win", F
        if not any(h.alive for h in F.H): return "loss", F
    return "loss", F
