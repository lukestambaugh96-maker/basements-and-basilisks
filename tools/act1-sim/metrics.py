"""Per-hero cast metrics across the Act 1 fights (typical parties)."""
import random, statistics, sys
from final import *
import act1sim

TANKS = ("bram", "dane", "zark")
def parties(n, profile):
    for i in range(n):
        ids = draw_party(i)
        if profile in ("typical", "strong") and not any(x in TANKS for x in ids):
            ids = ids[:2] + [TANKS[i % 3]]
        yield i, ids

def hero_metrics(fights=("F2 Klarg", "F3 Glasstaff", "F4 Thundertree", "F5 Forge"), n=200, profile="typical", setup=None):
    agg = {}
    for f in fights:
        for i, ids in parties(n, profile):
            random.seed(30_000 + i)
            hs = build_party(ids, profile, f)
            if setup: setup(hs)
            es, enc = FINAL[f]()
            run_fight(hs, es, enc, profile)
            for h in hs:
                a = agg.setdefault(h.name, dict(casts=0, t=0, ab=0, dmg=0, n=0))
                a["casts"] += h.casts; a["t"] += h.alive_t; a["ab"] += h.ab_out; a["dmg"] += h.dmg_done; a["n"] += 1
    out = {}
    for k, a in sorted(agg.items()):
        out[k] = dict(casts=a["casts"] / a["n"], interval=a["t"] / max(1, a["casts"]),
                      ab=a["ab"] / a["n"], share=a["ab"] / max(1, a["dmg"]))
    return out

def castoff(fights=("F2 Klarg", "F3 Glasstaff", "F4 Thundertree", "F5 Forge"), n=200, setup=None):
    """Per hero: win rate of typical parties with them, ability on vs off."""
    res = {}
    for hid in HERO_FNS:
        on = off = cnt = 0
        for f in fights:
            for i, ids in parties(n, "typical"):
                if hid not in ids: continue
                for mode in (0, 1):
                    random.seed(40_000 + i)
                    hs = build_party(ids, "typical", f)
                    if setup: setup(hs)
                    if mode:
                        for h in hs:
                            if HERO_FNS[hid]().name == h.name: h.ab = None
                    es, enc = FINAL[f]()
                    out, F = run_fight(hs, es, enc, "typical")
                    if out == "win":
                        if mode: off += 1
                        else: on += 1
                cnt += 1
        res[hid] = (100 * on / cnt, 100 * off / cnt)
    return res

def report(setup=None, label=""):
    m = hero_metrics(setup=setup)
    c = castoff(setup=setup)
    print(f"--- {label}")
    print(f"{'hero':10} {'casts/fight':>11} {'sec/cast':>9} {'ability out':>11} {'share of dmg':>12} {'win on/off':>12}")
    for hid in HERO_FNS:
        name = HERO_FNS[hid]().name; r = m[name]; on, off = c[hid]
        print(f"{name:10} {r['casts']:11.1f} {r['interval']:9.1f} {r['ab']:11.0f} {100*r['share']:11.0f}% {on:5.0f}/{off:<5.0f}")
    print(f"average sec/cast: {statistics.mean(m[k]['interval'] for k in m):.1f}")

if __name__ == "__main__":
    report(label="cast-rate pass values (job charge)")
