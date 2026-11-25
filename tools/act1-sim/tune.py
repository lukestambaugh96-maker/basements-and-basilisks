import random, statistics, sys
from encounters import *
def go(fight, enc_fn, profile, n=300):
    res=[]
    for i in range(n):
        random.seed(10_000+i); ids=draw_party(i)
        TANKS=["bram","dane","zark"]
        if profile in ("typical","strong") and not any(x in TANKS for x in ids):
            ids=ids[:2]+[TANKS[i%3]]
        hs=build_party(ids,profile,fight); es,enc=enc_fn()
        out,F=run_fight(hs,es,enc,profile)
        hp=sum(h.maxhp for h in hs); left=sum(max(0,h.hp) for h in hs if h.alive)
        res.append((out=="win",F.t,sum(not h.alive for h in hs),1-left/hp, min((h.casts for h in hs if h.row=="front"),default=0)))
    w=[r for r in res if r[0]]
    return (100*len(w)/n, statistics.median(r[1] for r in res), 100*statistics.mean(r[3] for r in w) if w else 100,
            100*sum(r[2]>0 for r in w)/len(w) if w else 0, statistics.mean(r[4] for r in res))
def show(label, fight, fn):
    out=[]
    for p in ("bare","typical","strong"):
        w,t,l,d,tc=go(fight,fn,p); out.append(f"{p[:4]} {w:3.0f}% {t:4.0f}s lost{l:3.0f}% dth{d:3.0f}% tank{tc:.1f}")
    print(f"{label:34} | "+" | ".join(out)); sys.stdout.flush()

def all_fights(fns=None):
    fns = fns or ENCOUNTERS
    for k, f in fns.items(): show(k, k, f)
