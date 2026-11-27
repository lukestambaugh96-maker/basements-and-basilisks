const fs=require('fs'),vm=require('vm');const T='/home/claude/testbench/';
const cfg={heroes:JSON.parse(fs.readFileSync(T+'config/heroes.config.json')),enemies:JSON.parse(fs.readFileSync(T+'config/enemies.config.json')),rules:JSON.parse(fs.readFileSync(T+'config/rules.config.json'))};
const ctx={console,Math,CFG:cfg};vm.createContext(ctx);vm.runInContext(['engine.js','behaviour.js','run.js'].map(f=>fs.readFileSync(T+f,'utf8')).join('\n')+'\nthis.G={HEROES,ENEMIES,ACT1,BOSSES,ITEM_LIST,ECON,RARITY_WEIGHTS,RARITY_PRICE,parseDice};',ctx);const G=ctx.G;
const AB={arthur:'Alert Strike: dodge 0.5/1/1.5s, then a crit strike of 4d8 per tier + STR (+1 die if he dodged)',
bram:'Cure Wounds: heal the closest hurt ally 3d8 per tier + WIS (High +1d8); Bram heals the same',
faelan:'Shield: Ward the lowest-% ally 3d10 per tier + INT (Low 2d10, High +1d10)',
wallaby:'Dagger Toss: 1/2/3 daggers of 1d4 per tier + DEX at the lowest-HP foes within 3',
dane:'Compelled Duel: taunt the deadliest foe within 3 for 2/3/4s; Ward himself 3d8 per tier + CHA (Low 2d8, High 4d8)',
lorcan:'Twin Shot: every attack fires twice for 2.5/3/3.5s',
juniper:'Entangle: Restrain foes within 2 for 1.5/2/2.5s, 1d6 per tier magic each; Ward herself 2d6 per foe per tier + WIS',
rosalind:'Inspiring Verse: top damage dealer attacks 55% faster (+5% per tier) for 1d4+3s (High: 2 allies; nat 20: party)',
zark:'Reckless Swing: 2d8 per tier to all adjacent foes (Low -1, High +1 die); 1d6 per tier to himself; Advantage',
naill:'Flurry of Blows: 2/3/4 strikes of 1d8 per tier + DEX',
nettle:'Hellfire Curse: 2d6 per tier + CHA magic; Burn 0/2/2 per tier (High +2)',
pillar:'Toss: throw an adjacent non-boss foe 2/3/3 squares, 7d6 per tier to it and foes beside it, stun 1s',
laurel:'Verdant Strike: 2d8 per tier + STR (Low -1, High +1 die); heal herself and adjacent allies for the damage dealt',
lumen:'Sunbeam: 9d4 per tier Radiant to every foe in a line (Low -1, High +1 die)',
jamison:'Emboldening Bond: 2/2/3 allies for 5s: +1d4 ability rolls, heal 1d8 per tier + CHA, Ward 2d8 per tier + CHA; Wards himself 1d8 per tier + CHA',
zoe:'Rummage: 1/1/2 supplies: potion or spare shield 4d6 per tier + INT, or whetstone (+2d6 per tier on 3 attacks)',
gilthrax:'Arcane Shield: Ward himself 2d10 per tier + CON (Low 1d10, High 3d10); taunt adjacent foes 0/1.5/2s',
velith:'Cloak of Darkness: leap to the lowest-HP foe within 4, crit strike 9d4 per tier + DEX, Poison 2 + 1 per tier (High twice); nat 20 executes below 25%',
cinder:'Scorching Ray: 2/3/4 rays of 2d8 per tier magic, spread over up to 3 foes',
gains:'Gilded Beam: 11d8 per tier + INT magic at the highest-HP foe; gilds it (gold on kill)',
corvin:"Dread Ambush: 1/2/3 strikes of 2d8 per tier + DEX; Marks the target (his swords strike it twice); starts fully charged",
saint:'Mirror Blessing: heal the lowest-% ally 1d8 per tier + WIS; summon their Double for 2/2/3s, which taunts foes off them 0/1.5/1.5s',
kaska:'Moonlit Pounce: leap to the farthest foe, 7d8 per tier + STR; heals the lowest-% ally half the damage; High: Restrain 1.5s'};
const heroes=Object.keys(G.HEROES).map(id=>{const d=G.HEROES[id],c=d.cfg,a=c.attack,p=G.parseDice(a.dice);
 return {id,name:c.name,job:c.benchJob,size:c.size,cls:c.class,charge:c.job,ctc:d.chargeToCast,sc:c.startCharge==='full'?d.chargeToCast:(c.startCharge||0),
  STR:c.stats.STR,DEX:c.stats.DEX,CON:c.stats.CON,INT:c.stats.INT,WIS:c.stats.WIS,CHA:c.stats.CHA,key:c.key,ac:c.ac,sr:c.sr,range:c.range,
  atk:a.name,an:p.n,ax:p.x,af:p.flat,astat:a.bonus||'',ahalf:!!a.halfBonus,aiv:a.interval,astr:a.strikes||1,atype:a.type==='magic'?'magic':a.type==='radiant'?'radiant':'physical',apt:!!a.perTier,ability:AB[id]||c.ability.name};});
const dice=s=>{const p=G.parseDice(s);return [p.n,p.x,p.flat]};
const enemies=Object.keys(G.ENEMIES).map(id=>{const c=cfg.enemies.enemies[id];const p=G.parseDice(c.attack.dice);const A=c.ability;let ab=['',null,null,null,'',''];
 if(A){const dm=A.damage?(A.damage.mid||A.damage.dice):(A.dart?A.dart.dice:null);const dd=dm?dice(dm):[null,null,null];
  const tgt=id==='glasstaff'?'3 darts (Low 2) at one hero; High: Wards himself 2d10+2':id==='flameskull'?'the densest clump':id==='venomfang'?'the densest clump; Poison 3 (High 5)':id==='nezznar'?A.heroes+' closest heroes; Restrained 2s (High 3s)':id==='grol'?'charges the rearmost hero; stun 1s (High 1.5s)':'his target; stun 1s (Low none)';
  ab=[A.name,...dd,A.chargePerAttack?('every '+Math.round(100/A.chargePerAttack)+' attacks'):('every '+A.castSeconds+'s'),tgt];}
 const boss=cfg.enemies.bosses.find(b=>b.id===id);
 return {id,name:c.name,rank:c.rank,chassis:c.chassis,affix:c.affix||'',active:c.rank==='Boss'?!(boss&&boss.active===false):'',hp:c.hp,ac:c.ac,sr:c.sr,range:c.range,an:p.n,ax:p.x,af:p.flat,aiv:c.attack.interval,astr:c.attack.strikes||1,atype:c.attack.type==='magic'?'magic':'physical',ab};});
const enc=[];cfg.enemies.encounters.forEach((e,i)=>e.enemies.forEach(([id])=>enc.push([i+1,e.name,id])));cfg.enemies.bosses.filter(b=>b.active!==false).forEach(b=>b.enemies.forEach(([id])=>enc.push(['Boss',b.name,id])));
const items=G.ITEM_LIST.map(it=>[it.name,it.rar,it.price,it.text]);
fs.writeFileSync('/home/claude/sheetgen/data.json',JSON.stringify({heroes,enemies,enc,items,econ:G.ECON,weights:G.RARITY_WEIGHTS,rules:cfg.rules},null,1));
console.log(heroes.length,enemies.length,enc.length,items.length);
