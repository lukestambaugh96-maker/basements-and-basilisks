/* ================= 0.22 CORE CONSTANTS, DICE, ENEMIES & ENCOUNTERS ================= */
const CLASS={
  Cleric:{col:'#b8923a'},Rogue:{col:'#5a4a6a'},Fighter:{col:'#6e7684'},Wizard:{col:'#3a5a9a'},Bard:{col:'#a83a5a'},
};
const heroCol=d=>(CLASS[d.cls]||{col:'#555'}).col;
const ROLE_COL={Damage:'#8f1d14',Tank:'#3d5a78',Support:'#2d6a3a'};
const ATTRS=['str','dex','con','int','wis','cha'];
const ATTR_N={str:'Strength',dex:'Dexterity',con:'Constitution',int:'Intelligence',wis:'Wisdom',cha:'Charisma'};
const ATTR_S={str:'STR',dex:'DEX',con:'CON',int:'INT',wis:'WIS',cha:'CHA'};
const modOf=s=>Math.floor((s-10)/2);
const BAND_N=['Low','Mid','High','Natural 20'];

/* ---------- heroes ---------- */
const H={};
function hero(key,o){H[key]={key,...o}}

Object.assign(CLASS, {
  Paladin:{col:"#c4a03a"}, Ranger:{col:"#3c7a44"}, Druid:{col:"#4a7a3a"},
  Sorcerer:{col:"#b84424"}, Barbarian:{col:"#9e2c22"}, Monk:{col:"#3a7a84"}, Warlock:{col:"#6a3a8a"}
});

/* ---------- dice: change how the ability roll behaves ---------- */
const DICE={
  d20:{n:'Plain d20',x:'No change.'},
  swift:{n:'Swift Die',x:'Charges 25% faster. A natural 20 counts as a plain High roll.',good:'Heroes whose High is as good as their crit',bad:'Crit fishers'},
  heavy:{n:'Heavy Die',x:'Charges 30% slower. High and natural 20 rolls are 50% stronger.',good:'Slow, huge abilities',bad:'Fast casters, Inspire targets'},
  coin:{n:'Coin',x:'Every roll is Low or High, half each. Never Mid, never a fizzle, never a natural 20.',good:'Abilities with a weak Mid',bad:'Heroes with a good Mid'},
  glass:{n:'Glass Die',x:'High starts 4 lower, but every roll costs 8% of max HP.',good:'Tanks, healed carries',bad:'Fragile backliners'},
  cursed:{n:'Cursed Die',x:'1 to 3 all fizzle with no charge back. The roll after a fizzle is always a natural 20.',good:'Abilities with a game-winning crit',bad:'Heroes you need steady'},
};

/* ---------- enemies ---------- */
const E={
  goblin:{name:'Raider',arch:'swarm',hp:30,ac:14,sr:11,ft:30,rng:1,atk:{n:'Scimitar',d:[1,6],flat:3,kind:'phys',ty:'slashing',iv:1},role:'Swarm: quick blades in numbers'},
  archer:{name:'Raider Archer',arch:'archer',hp:22,ac:13,sr:11,ft:30,rng:6,atk:{n:'Shortbow',d:[1,6],flat:3,kind:'phys',ty:'piercing',iv:1.2},role:'Archer: shoots from behind the front line'},
  shaman:{name:'Hedge Shaman',arch:'shaman',hp:34,ac:12,sr:14,ft:30,rng:5,elite:1,atk:{n:'Hex Spark',d:[1,6],flat:2,kind:'magic',el:'fire',ty:'fire',iv:1.5},role:'Healer: mends the others',
    abil:{n:'Mend',self:1,cr:9,cut:[8,15],fx(b,u,P){const fr=friends(b,u);if(P===0){const t=fr.slice().sort((a,c)=>a.hp/a.maxHp-c.hp/c.maxHp)[0];heal(b,u,t,roll(2,6)+4);return}
      const ts=fr.filter(a=>P===3||hd(a,u)<=3);b.events.push({k:'area',id:u.id,shape:'nova',r:3,ty:'poison',ids:ts.map(x=>x.id)});ts.forEach(a=>heal(b,u,a,roll(P===3?4:P===2?3:2,6)+4))}}},
  wolf:{name:'Wolf',arch:'swarm',hp:32,ac:13,sr:10,ft:40,rng:1,atk:{n:'Bite',d:[2,4],flat:3,kind:'phys',ty:'piercing',iv:1},role:'Pack hunter: fast'},
  ripper:{name:'Dire Wolf',arch:'charger',hp:70,ac:14,sr:11,ft:40,rng:1,elite:1,atk:{n:'Savage Bite',d:[2,6],flat:4,kind:'phys',ty:'piercing',iv:1},role:'Charger: leaps at the back row and drags heroes down',
    abil:{n:'Drag Down',cr:8,cut:[8,15],fx(b,u,P){const t=u.target;if(!t||!t.alive||hd(t,u)>1)return;hit(b,u,t,roll([2,3,4,6][P],6),{kind:'phys',ty:'piercing',melee:1});stun(b,t,[.8,1.2,1.8,3][P])}}},
  hobgoblin:{name:'Shieldbearer',arch:'wall',hp:44,ac:18,sr:10,ft:30,rng:1,atk:{n:'Longsword',d:[1,8],flat:4,kind:'phys',ty:'slashing',iv:1.2},role:'Shield wall: heavy armor, weak against magic; allies next to it get +2 AC'},
  captain:{name:'Shield Captain',arch:'wall',hp:80,ac:19,sr:11,ft:30,rng:1,elite:1,atk:{n:'Greatsword',d:[2,6],flat:4,kind:'phys',ty:'slashing',iv:1.2},role:'Captain: armors the ranks',
    abil:{n:'Form Ranks',self:1,cr:7,cut:[8,15],fx(b,u,P){const ts=friends(b,u).filter(a=>hd(a,u)<=2);b.events.push({k:'area',id:u.id,shape:'nova',r:2,ty:'force',ids:ts.map(x=>x.id)});
      ts.forEach(a=>{acBuff(b,a,[2,2,3,4][P],[4,6,8,10][P]);if(P===3)addWard(b,a,15)})}}},
  zombie:{name:'Zombie',arch:'brute',hp:60,ac:11,sr:8,ft:20,rng:1,atk:{n:'Slam',d:[1,8],flat:4,kind:'phys',ty:'bludgeoning',iv:1.4},f:{undying:.5},role:'Meat shield: half the time gets back up, unless it dies to Holy damage or necrosis'},
  orc:{name:'Reaver',arch:'charger',hp:34,ac:13,sr:10,ft:40,rng:1,atk:{n:'Greataxe',d:[1,12],flat:3,kind:'phys',ty:'slashing',iv:1.2},role:'Charger: fast, fragile, hits hard, and leaps at the back row'},
  ogre:{name:'Ogre',arch:'brute',hp:120,ac:11,sr:9,ft:25,rng:1,elite:1,atk:{n:'Club',d:[2,8],flat:4,kind:'phys',ty:'bludgeoning',iv:1.6},f:{pushResist:.7},role:'Meat shield: slow, huge, swats heroes away; easy to hit, easy to blast',
    abil:{n:'Swat',cr:6,cut:[8,15],fx(b,u,P){const t=u.target;if(!t||!t.alive||hd(t,u)>1)return;hit(b,u,t,roll([2,3,4,6][P],8),{kind:'phys',ty:'bludgeoning',melee:1});push(b,u,t,[1,2,2,3][P],{aim:P>=2,stun:P===3?1.5:0})}}},
  chief:{name:'Warlord',arch:'charger',hp:75,ac:15,sr:11,ft:40,rng:1,elite:1,atk:{n:'Greataxe',d:[1,12],flat:4,kind:'phys',ty:'slashing',iv:1.1},f:{hasteAura:[3,25],pushResist:.4},role:'War chief: orcs within 3 squares attack 25% faster',
    abil:{n:'Axe-Biter',cr:7,cut:[8,15],fx(b,u,P){const t=u.target;if(!t||!t.alive||hd(t,u)>1)return;hit(b,u,t,roll([2,3,4,6][P],12),{kind:'phys',ty:'slashing',melee:1});if(P===3)friends(b,u).forEach(a=>giveCharge(b,a,40))}}},
  blight:{name:'Twig Blight',arch:'swarm',hp:12,ac:13,sr:7,ft:35,rng:1,atk:{n:'Claws',d:[1,4],flat:2,kind:'phys',ty:'piercing',iv:.9},role:'Swarm: weak alone, many together; dry wood with no spell resistance'},
  ashzombie:{name:'Ash Zombie',arch:'afflicter',hp:45,ac:11,sr:8,ft:20,rng:1,atk:{n:'Slam',d:[1,8],flat:3,kind:'phys',ty:'bludgeoning',iv:1.4},f:{undying:.5,deathPuff:3},role:'Meat shield: bursts into choking ash (poison) on heroes next to it when it falls'},
  skeleton:{name:'Skeleton Archer',arch:'archer',hp:26,ac:11,sr:16,ft:30,rng:5,atk:{n:'Shortbow',d:[1,6],flat:3,kind:'phys',ty:'piercing',iv:1.2},role:'Bowman: brittle bones (low AC) but magic slides off (high SR)'},
  glasstaff:{name:'Battle Mage',arch:'caster',hp:70,ac:12,sr:16,ft:30,rng:6,elite:1,atk:{n:'Magic Missile',d:[3,4],flat:1,kind:'magic',ty:'force',iv:1.5},role:'Controller: roots and lightning from the back',
    abil:{n:'Lightning Bolt',cr:7,cut:[8,15],fx(b,u,P){const t=u.target;if(!t||!t.alive)return;
      if(P===0){hit(b,u,t,roll(2,6),{kind:'magic',ty:'psychic'});t.st.root=Math.max(t.st.root,2);status(b,t,'HELD','#c8b8ff');return}
      const line=lineHexes(u,t,7);const ts=foes(b,u).filter(x=>x===t||line.some(h=>h.c===x.c&&h.r===x.r));b.events.push({k:'area',id:u.id,tid:t.id,shape:'line',ty:'lightning',ids:ts.map(x=>x.id)});
      ts.forEach(x=>{hit(b,u,x,roll([0,4,6,8][P],6),{kind:'magic',ty:'lightning'});if(P===3)stun(b,x,1.5)})}}},
  flameskull:{name:'Flameskull',arch:'caster',hp:65,ac:13,sr:17,ft:30,rng:6,elite:1,atk:{n:'Fire Ray',d:[2,6],flat:2,kind:'magic',el:'fire',ty:'fire',iv:1.4},f:{fireproof:1},role:'Artillery: fire that burns everyone standing together; magic barely touches it',
    abil:{n:'Fireball',cr:7,cut:[8,15],fx(b,u,P){const t=u.target;if(!t||!t.alive)return;const R=P===3?2:1;const ts=foes(b,u).filter(x=>hd(x,t)<=R);
      b.events.push({k:'area',id:u.id,tid:t.id,shape:'splash',r:R,ty:'fire',ids:ts.map(x=>x.id)});ts.forEach(x=>hit(b,u,x,roll([2,3,5,8][P],6),{kind:'magic',el:'fire',ty:'fire',area:1}))}}},
  owlbear:{name:'Owlbear',arch:'brute',hp:190,ac:16,sr:12,ft:40,rng:1,elite:1,atk:{n:'Beak and Claws',d:[1,8],flat:4,kind:'phys',ty:'slashing',iv:1.6,hits:2},f:{pushResist:.7,enrage:6},role:'Juggernaut: hits 15% harder every 6 seconds',
    abil:{n:'Rend',cr:6,cut:[8,15],fx(b,u,P){const t=u.target;if(!t||!t.alive||hd(t,u)>1)return;hit(b,u,t,roll([2,3,4,6][P],8),{kind:'phys',ty:'slashing',melee:1});if(P>=1)stun(b,t,[0,.8,1.2,2][P])}}},
  spider:{name:'Giant Spider',arch:'afflicter',hp:40,ac:14,sr:12,ft:35,rng:1,atk:{n:'Bite',d:[1,8],flat:3,kind:'phys',ty:'piercing',iv:1.1,onHit:[{t:'status',el:'poison',v:1.5}]},f:{pushResist:.4},role:'Brute: poisons, and walks through webs freely'},
  nezznar:{name:'Brood Mother',arch:['summoner','afflicter'],hp:150,ac:14,sr:15,ft:30,rng:6,boss:1,atk:{n:'Spider Staff',d:[2,6],flat:2,kind:'magic',ty:'necrotic',iv:1.4,nec:3},f:{pushResist:.5},role:'Boss: necrosis, webs and a brood of spiders. Takes half necrosis and never falls into the chasm.',
    abil:{n:'Web of Shadows',cr:7,cut:[8,15],fx(b,u,P){const t=u.target;
      if(P===3){status(b,u,'CALL THE BROOD','#c48fe6');spawn(b,'spider',u.c-1,u.r+1);spawn(b,'spider',u.c+1,u.r+1);return}
      if(!t||!t.alive)return;const ts=P>=1?foes(b,u).filter(x=>hd(x,t)<=1):[t];if(ts.length>1)b.events.push({k:'area',id:u.id,tid:t.id,shape:'splash',r:1,ty:'necrotic',ids:ts.map(x=>x.id)});
      ts.forEach(x=>{hit(b,u,x,roll([2,2,3][P],8),{kind:'magic',ty:'necrotic',nec:[6,8,12][P]});x.st.root=Math.max(x.st.root,[1.5,1.5,2][P])})}}},
  /* 0.14: a caster and a summoner, so every enemy archetype has a body */
  adept:{name:'Cult Adept',arch:'caster',hp:40,ac:12,sr:14,ft:30,rng:6,elite:1,atk:{n:'Fire Bolt',d:[1,10],kind:'magic',el:'fire',ty:'fire',iv:1.6},role:'Caster: hurls Fireballs at the biggest group of heroes',
    abil:{n:'Fireball',self:1,cr:6,cut:[8,15],fx(b,u,P){const hs=foes(b,u).filter(x=>!x.hidden&&hd(x,u)<=7);if(!hs.length)return;const R=P===3?2:1;
      const c=hs.slice().sort((a,z)=>hs.filter(y=>hd(y,z)<=R).length-hs.filter(y=>hd(y,a)<=R).length)[0];const ts=foes(b,u).filter(x=>hd(x,c)<=R);
      b.events.push({k:'area',id:u.id,tid:c.id,shape:'splash',r:R,ty:'fire',ids:ts.map(x=>x.id)});ts.forEach(x=>hit(b,u,x,roll([2,3,4,6][P],6),{kind:'magic',el:'fire',ty:'fire',area:1}))}}},
  conjurer:{name:'Conjurer',arch:'summoner',hp:45,ac:12,sr:14,ft:30,rng:5,elite:1,atk:{n:'Eldritch Bolt',d:[1,8],kind:'magic',ty:'force',iv:1.5},f:{summon:{k:'skeleton',n:2,every:8,first:5,cap:3,hp:.6}},role:'Summoner: raises two skeleton archers every 8 seconds (up to 3 at once)'},
  caller:{name:'Blight Caller',arch:'summoner',hp:40,ac:12,sr:12,ft:30,rng:5,elite:1,atk:{n:'Thorn Lash',d:[1,8],kind:'phys',ty:'piercing',iv:1.4},f:{summon:{k:'blight',n:2,every:6,first:3,cap:6}},role:'Summoner: grows two twig blights every 6 seconds (up to 6 at once)'},
  necromancer:{name:'Necromancer',arch:'afflicter',hp:64,ac:12,sr:15,ft:30,rng:6,elite:1,atk:{n:'Ray of Enfeeblement',d:[2,6],flat:2,kind:'magic',ty:'necrotic',iv:1.5,nec:3},role:'Necromancer: necrosis on your heroes; Ward soaks it',
    abil:{n:'Enervation',cr:7,cut:[8,15],fx(b,u,P){if(P===3){const dead=b.units.filter(x=>!x.alive&&x.key==='zombie');dead.forEach(z=>{z.alive=true;z.hp=Math.round(z.maxHp/2);z.nec=0;z.st=freshSt();b.events.push({k:'spawn',id:z.id});status(b,z,'RAISED','#9be38a')});if(dead.length)return}
      const t=u.target;if(!t||!t.alive)return;const ts=P>=2?[t,...friends(b,t).filter(a=>a!==t&&hd(a,t)<=1)]:[t];
      if(ts.length>1)b.events.push({k:'area',id:u.id,tid:t.id,shape:'splash',r:1,ty:'necrotic',ids:ts.map(x=>x.id)});
      ts.forEach(x=>hit(b,u,x,0,{kind:'magic',ty:'necrotic',nec:[10,16,16,16][P],noBonus:1}))}}},
};

/* ---------- encounters: four 0.8 maps, each testing a 0.9 rule ---------- */
/* 0.15: one woodland battlefield, 10×10, in a few tree layouts. Three lanes: an open centre and two flank paths through the trees
   that open behind each line. v is tall brush: walkable, and whoever stands in it can't be targeted from more than 2 squares away until they attack. */
const WOODS={
  A:["vv......vv", "v........v", ".vO....Ov.", ".vO....Ov.", "v.O....O.v", "v........v", "PPOPPPPOPP", "PPOPPPPOPP", "PP.PPPP.PP", ".PPPPPPPP."],
  B:["v........v", "vv......vv", ".vO....Ov.", "..O.O..O..", "v.O....O.v", "vv......vv", "PPOPPPPOPP", "PPOPOPPOPP", "PP.PPPP.PP", ".PPPPPPPP."],
  C:["vv.O..O.vv", "v........v", ".vO....Ov.", ".vO....Ov.", "..O.OO.O..", "v........v", "PPOPPPPOPP", "PPOPPPPOPP", "PP.PPPP.PP", ".PP.PP.PP."],
  S:["vv......vv", "v...w....v", ".vO..w.Ov.", ".vO.w..Ov.", "v.O....O.v", "v...w....v", "PPOPPPPOPP", "PPOPPPPOPP", "PP.PPPP.PP", ".PPPPPPPP."]
};
const ENC={
  ambush:{n:'Raiders',place:'The forest road',theme:'forest',
    q:'Baseline',note:'Raiders hold the centre, an archer pair and a shaman behind them, and one raider waits on the left flank.',
    map:WOODS.A,
    u:[['archer',3,1],['archer',6,1],['shaman',5,0],['goblin',3,4],['goblin',5,4],['goblin',6,4],['goblin',0,3]]},
  wolves:{n:'Wolf Pack',place:'The den',theme:'forest',
    q:'Needs a tank',sc:{dmg:1.2},note:'The pack holds the centre; two wolves prowl the flanks, and the Dire Wolf leaps over the front line at whoever stands at the back.',
    map:WOODS.B,
    u:[['wolf',3,4],['wolf',6,4],['ripper',5,2],['wolf',5,4],['wolf',9,2],['wolf',0,2]]},
  gate:{n:'The Shield Wall',place:'The fort gate',theme:'forest',
    q:'High AC',note:'Shieldbearers wear AC 18 and armour each other; archers shoot from behind them, one from the right flank. Penetration, Acid, Holy and magic (their SR is low) are the answers.',
    map:WOODS.A,
    u:[['hobgoblin',4,4],['hobgoblin',5,4],['captain',4,3],['archer',3,1],['archer',6,1],['archer',8,1]]},
  owlwell:{n:'The Necromancer',place:'The ruined watchtower',theme:'forest',
    q:'Enemy necrosis',sc:{dmg:.8},note:'Zombies get back up unless Holy damage or necrosis finishes them. The Necromancer lays necrosis from the back, and a Conjurer hides in the brush on the right flank, raising skeleton archers.',
    map:WOODS.B,
    u:[['necromancer',5,0],['conjurer',8,0],['zombie',3,3],['zombie',6,3],['zombie',4,4],['zombie',5,4]]},

  orcs:{n:'The War Band',place:'The hill camp',theme:'forest',sc:{hp:.8,dmg:.8},
    q:'Damage race',note:'Reavers leap over your front line at the back row, two more come down the flanks, and an ogre soaks in the middle; the Warlord makes every reaver near him attack 25% faster.',
    map:WOODS.C,
    u:[['orc',3,3],['orc',6,3],['ogre',4,3],['chief',5,1],['orc',9,2],['orc',0,2]]},
  reavers:{n:'Reavers',place:'The hill road',theme:'forest',sc:{hp:.9,dmg:.9},
    q:'Chargers',note:'Reavers leap over your front line at the back row, one from the right flank, while archers and a shaman stay behind. A Strength frontliner stops the leaps.',
    map:WOODS.C,
    u:[['orc',3,3],['orc',6,3],['shaman',4,1],['archer',6,1],['orc',8,2],['archer',1,1]]},
  blights:{n:'The Blight Swarm',place:'The overgrown village',theme:'forest',sc:{hp:1.25,dmg:1.25},
    q:'Swarm',note:'Blights pour down the centre, a Blight Caller at the back grows more, and ash zombies choke whoever stands beside them when they fall. More blights come from both flanks.',
    map:WOODS.C,
    u:[['blight',3,3],['blight',4,3],['blight',5,3],['blight',6,3],['ashzombie',4,2],['caller',5,0],['blight',9,4]],
    waves:[{at:9,u:[['blight',0,1],['blight',9,1],['blight',4,0],['blight',5,0]]}]},
  glasstaff:{n:'The Battle Mage',place:'The manor cellars',theme:'forest',
    q:'Kill the caster',note:'The Battle Mage blasts from behind shieldbearers, with skeleton archers beside him and one on the right flank. Skeletons shrug off magic (SR 16) but break easily (AC 11).',
    map:WOODS.A,
    u:[['glasstaff',5,0],['skeleton',3,1],['skeleton',6,1],['hobgoblin',4,3],['hobgoblin',5,3],['skeleton',9,1]]},
  forge:{n:'The Fire Cult',place:'The forge',theme:'forest',sc:{hp:.9,dmg:.8},
    q:'High SR, spread out',note:'A flameskull hurls fire at whoever stands together, behind ash zombies that choke the front line. Two Cult Adepts hide in the brush at the back of each flank.',
    map:WOODS.B,
    u:[['flameskull',5,1],['adept',0,0],['adept',9,0],['ashzombie',3,3],['ashzombie',5,3],['zombie',4,4]]},
  owlbear:{n:'The Owlbear',place:'The ruined keep',theme:'forest',
    q:'Attrition',note:'One huge beast that hits 15% harder every few seconds, with archers behind it and a raider on the right flank.',
    map:WOODS.A,
    u:[['owlbear',5,2],['archer',3,1],['archer',6,1],['goblin',4,4],['goblin',9,3]]},
  spider:{n:'The Brood Mother',place:'The spider temple',theme:'forest',sc:{hp:.8,dmg:.76},
    q:'Boss',note:'Webs root anyone but spiders. The Brood Mother lays necrosis and, on a natural 20, calls her brood; one spider lurks on the left flank.',
    map:WOODS.S,
    u:[['nezznar',5,0],['spider',3,2],['spider',6,2],['goblin',3,4],['skeleton',6,1],['spider',0,2]]},
};


const TUNE = {};
/* 0.15 woodland board range compression for enemies */
const RANGE15 = r => r >= 6 ? 5 : r >= 5 ? 4 : r >= 4 ? 3 : r;
Object.values(E).forEach(d => { if (d.rng) d.rng = RANGE15(d.rng); });
["ogre","owlbear","nezznar"].forEach(k => { if (E[k]) E[k].large = 1; });
