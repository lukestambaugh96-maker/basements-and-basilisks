"""Final Act 1 drafts (party of three), as written up in the encounters doc.
Uses the cast-rate pass (job-based charge) from castpass.py."""
import castpass; castpass.enable()
from tune import *
import encounters as E

def klarg_swing2(F,u):
    t=pick_target(F,u)
    if not t: return
    b=mid_band()
    if b=="fizzle": u.charge=50; return
    deal(F,u,t,roll(3+(1 if b in("high","crit") else 0),8,b=="crit")+4,"phys")
    if b!="low": stun(F,u,t,1.0)

def magic_missile1(F,u):
    t=pick_target(F,u)
    if not t: return
    b=mid_band()
    if b=="fizzle": u.charge=50; return
    for _ in range(2 if b=="low" else 3): deal(F,u,t,roll(1,6,b=="crit")+1,"magic")
    if b in("high","crit"): u.ward+=roll(2,10)+2

def f2():
    es=[enemy("Klarg","brute","elite",hp_mult=130/200,atk=(4,6,0,1.6,"phys",1),ab=klarg_swing2,job="attack",per_atk=25),
        enemy("Ripper","brute"), enemy("Goblin Archer","shooter")]
    return es, enc_klarg()[1]
def f3():
    es,enc=enc_glasstaff()
    es=[enemy("Redbrand Ruffian","bulwark",atk=(1,8,0,1.6,"phys",2)), enemy("Redbrand Ruffian","bulwark",atk=(1,8,0,1.6,"phys",2)),
        enemy("Glasstaff","shooter","elite",affix="Warded",hp_mult=0.8,atk=(2,10,4,1.4,"magic",1),ab=magic_missile1,ab_iv=6)]
    return es,enc
def f4():
    vine=enemy("Vine Blight","controller","elite",hp_mult=0.8,row="front")
    tw=[enemy("Twig Blight","swarmer") for _ in range(4)]
    nd=enemy("Needle Blight","shooter",row="back",atk=(2,10,0,1.4,"phys",1)); nd.reach=3
    cottage=set(map(id,[vine]+tw))
    def start(F):
        hs=F.H
        bait=max(hs,key=lambda h:h.maxhp*(1+h.ac/20)) if F.profile=="strong" else ([h for h in hs if h.row=="back"] or hs)[-1]
        bait.pulled=True; bait.root=1.5; F.bait=bait
    def reach(F,u,foes,rng):
        inside=[o for o in foes if id(o) in cottage]; out=[o for o in foes if id(o) not in cottage]
        twl=[o for o in inside if o.name=="Twig Blight"]; rest=[o for o in inside if o not in twl]
        if getattr(u,"pulled",False): return twl+rest or out
        if F.t<3.5: return out if u.reach>=3 else []
        return (out+twl+rest) if u.reach>=3 else (twl+rest+out)
    def et(F,u,hs):
        if id(u) in cottage and F.bait.alive: return F.bait
    return [vine]+tw+[nd], {"start":start,"reach":reach,"enemy_target":et}
def f5():
    es,enc=enc_forge()
    sk=[enemy("Flameskull","artillery","elite",hp_mult=0.8,ab=lambda F,u:fireball(F,u,6),ab_iv=11,tags={"area"}),
        enemy("Flameskull (lesser)","artillery",tags={"area"})]
    gh=[enemy("Ghoul","brute",affix="Stunning") for _ in range(2)]
    return gh+sk,enc
def venom():
    es,enc=enc_venomfang(); v=es[0]; v.maxhp=v.hp=490; v.ab_iv=7; v.atk=(4,6,4,1.6,"phys",1); return es,enc
def nezz():
    es,enc=enc_nezznar(); n=[e for e in es if e.name=="Nezznar"][0]
    n.maxhp=n.hp=310; n.ab_iv=7; n.atk=(2,8,6,2.0,"magic",1)
    sp=[enemy("Giant Spider","brute") for _ in range(3)]
    return sp+[n],enc
def grol():
    es,enc=enc_grol(); g=es[0]; g.ab_iv=10; g.maxhp=g.hp=570
    return [g]+[e for e in es[1:] if e.name=="Cragmaw Wolf"],enc

FINAL={"F2 Klarg":f2,"F3 Glasstaff":f3,"F4 Thundertree":f4,"F5 Forge":f5,
       "Boss Venomfang":venom,"Boss Nezznar":nezz,"Boss King Grol":grol}
if __name__=="__main__":
    import tune
    for k,f in FINAL.items(): show(k,k,f)
