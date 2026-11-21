/* ================= placeholder portraits: drawn from ancestry + class ================= */
const PORTRAIT={};
(function(){
const hash=s=>{let h=7;for(const c of s)h=(h*31+c.charCodeAt(0))>>>0;return h};
const pick=(arr,k)=>arr[hash(k)%arr.length];
const SKIN={
  Human:['#e8c4a0','#d4a27c','#b07a52','#8a5a3a','#f0d2b4'],
  'Wood Elf':['#c8946a','#b5835c'],'Moon Elf':['#e8e2ec','#d8d4e8'],Elf:['#efd8bc','#e2c6a6'],
  Halfling:['#e6b88e','#d6a074'],Dwarf:['#d89a78','#c08060'],'Half-Orc':['#8fa66a','#7f9860'],Tiefling:['#c0524a','#9a4a7a','#b84040','#7a4a8a'],
};
const HAIR=['#2a1e16','#5a3a22','#8a5a2a','#c8a058','#d8d0c0','#7a2a1a','#1a1a24','#a8642a'];
function parse(title){
  const head=title.split(/ (Paladin|Barbarian|Druid|Cleric|Monk|Bard|Rogue|Fighter|Sorcerer|Wizard|Artificer|Warlock)/)[0];
  const a=/Half-Orc/.test(head)?'Half-Orc':/Wood Elf/.test(head)?'Wood Elf':/Moon Elf/.test(head)?'Moon Elf':/Elf|Drow/.test(head)?'Elf':['Halfling','Tiefling','Dwarf','Gnome','Dragonborn','Human'].find(x=>head.includes(x))||'Human';
  const c=['Paladin','Barbarian','Druid','Cleric','Monk','Bard','Rogue','Fighter','Sorcerer','Wizard','Artificer','Warlock'].find(x=>title.includes(x))||'Fighter';
  return {anc:a,cls:c};
}
const CLS_BODY={Paladin:'#9aa4b4',Barbarian:'#6a4a2e',Druid:'#4a6a3a',Cleric:'#e8e0cc',Monk:'#c87a2a',Bard:'#a83a4a',Rogue:'#2a2630',Fighter:'#7a808a',Sorcerer:'#8a2a2a',Wizard:'#2e4a8a',Artificer:'#7a5a3a',Warlock:'#3a2450'};

function P(size,draw){const c=document.createElement('canvas');c.width=c.height=size;const x=c.getContext('2d');x.scale(size/100,size/100);
  x.save();x.beginPath();x.arc(50,50,50,0,Math.PI*2);x.clip();draw(x);x.restore();return c}
const E=(x,cx,cy,rx,ry,fill,rot=0)=>{x.beginPath();x.ellipse(cx,cy,rx,ry,rot,0,Math.PI*2);x.fillStyle=fill;x.fill()};
const poly=(x,pts,fill,stroke,lw)=>{x.beginPath();pts.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.closePath();if(fill){x.fillStyle=fill;x.fill()}if(stroke){x.strokeStyle=stroke;x.lineWidth=lw||1.5;x.stroke()}};
const shade=(hex,k)=>{const n=parseInt(hex.slice(1),16);const f=v=>Math.max(0,Math.min(255,Math.round(v*k)));return `rgb(${f(n>>16)},${f((n>>8)&255)},${f(n&255)})`};
function bg(x,col){const g=x.createRadialGradient(50,35,5,50,50,60);g.addColorStop(0,shade(col,1.5));g.addColorStop(1,shade(col,.55));x.fillStyle=g;x.fillRect(0,0,100,100)}
function body(x,col,trim){x.beginPath();x.moveTo(8,100);x.quadraticCurveTo(12,74,50,72);x.quadraticCurveTo(88,74,92,100);x.closePath();x.fillStyle=col;x.fill();
  if(trim){x.beginPath();x.moveTo(36,74);x.lineTo(50,90);x.lineTo(64,74);x.strokeStyle=trim;x.lineWidth=3;x.stroke()}}
function eyes(x,col='#1a1410',glow,y=48,sp=8){[50-sp,50+sp].forEach(ex=>{if(glow){x.save();x.shadowColor=glow;x.shadowBlur=8;E(x,ex,y,3.2,2.4,glow);x.restore()}else{E(x,ex,y,3,2.4,'#f4efe6');E(x,ex,y+.3,1.7,1.9,col)}})}
function brows(x,y=43,col='#2a1e16'){x.strokeStyle=col;x.lineWidth=1.8;x.beginPath();x.moveTo(37,y);x.lineTo(46,y-1);x.moveTo(54,y-1);x.lineTo(63,y);x.stroke()}
function mouth(x,y=60,w=5){x.strokeStyle='rgba(60,20,20,.7)';x.lineWidth=1.6;x.beginPath();x.moveTo(50-w,y);x.quadraticCurveTo(50,y+2,50+w,y);x.stroke()}

function humanoid(x,o){
  const {skin,hair,anc,cls}=o;
  // things behind the head
  if(cls==='Cleric'){x.save();x.globalAlpha=.75;x.strokeStyle='#ffe27a';x.lineWidth=3;x.beginPath();x.arc(50,40,30,0,Math.PI*2);x.stroke();x.restore()}
  if(cls==='Sorcerer'){x.save();x.globalAlpha=.6;for(let i=0;i<7;i++){const a=i/7*Math.PI*2;E(x,50+Math.cos(a)*34,44+Math.sin(a)*30,3,5,'#ff8a3a',a)}x.restore()}
  if(cls==='Rogue'||cls==='Warlock'||(cls==='Cleric'))E(x,50,44,29,31,cls==='Cleric'?'#d8d0bc':cls==='Warlock'?'#2a1a3a':'#1e1c24');
  if(cls==='Barbarian'||cls==='Sorcerer'||cls==='Druid')E(x,50,42,27,27,hair);
  body(x,CLS_BODY[cls],cls==='Paladin'?'#e0b45a':cls==='Bard'?'#e8d27a':cls==='Cleric'?'#c8a040':null);
  if(cls==='Barbarian'){E(x,30,78,14,8,'#8a6a4a',-.3);E(x,70,78,14,8,'#8a6a4a',.3)} // fur mantle
  // neck + ears
  x.fillStyle=shade(skin,.85);x.fillRect(43,62,14,12);
  const pointy=/Elf|Tiefling/.test(anc);
  if(pointy){poly(x,[[28,47],[14,34],[30,54]],skin);poly(x,[[72,47],[86,34],[70,54]],skin)}
  else if(anc==='Halfling'){E(x,28,49,4,6,skin);E(x,72,49,4,6,skin)}
  else{E(x,28,49,3.5,5.5,skin);E(x,72,49,3.5,5.5,skin)}
  // head
  const hw=anc==='Halfling'||anc==='Dwarf'?23:anc==='Half-Orc'?23:21, hh=anc==='Half-Orc'?23:24;
  const g=x.createRadialGradient(46,42,4,50,48,26);g.addColorStop(0,shade(skin,1.08));g.addColorStop(1,shade(skin,.88));
  x.beginPath();x.ellipse(50,48,hw,hh,0,0,Math.PI*2);x.fillStyle=g;x.fill();
  if(anc==='Half-Orc'){x.fillStyle=shade(skin,.8);x.fillRect(34,56,32,10)}
  // hair (top cap) unless covered
  const covered=['Paladin','Fighter','Rogue','Warlock','Wizard','Cleric'].includes(cls);
  if(!covered){
    if(cls==='Monk'){E(x,50,30,9,6,hair)}
    else{x.beginPath();x.ellipse(50,38,hw+2,15,0,Math.PI,0);x.fillStyle=hair;x.fill();
      if(cls==='Bard'||cls==='Artificer'){poly(x,[[29,38],[32,52],[37,38]],hair);poly(x,[[71,38],[68,52],[63,38]],hair)}
      if(cls==='Barbarian'||cls==='Sorcerer'){for(let i=0;i<5;i++){poly(x,[[30+i*10,28],[35+i*10,14+(i%2)*5],[40+i*10,28]],hair)}}}
  }
  // face
  const tEyes=anc==='Tiefling';
  if(cls==='Warlock')eyes(x,null,'#c08aff');
  else if(cls==='Sorcerer')eyes(x,null,'#ffb04a');
  else if(tEyes)eyes(x,null,'#ffd25a');
  else eyes(x,pick(['#3a5a8a','#4a3a22','#3a6a4a','#6a4a2a'],skin+hair));
  if(cls!=='Warlock')brows(x,42,shade(hair,.8));
  if(anc==='Half-Orc'){poly(x,[[40,62],[42,54],[44,62]],'#f4ecd8');poly(x,[[56,62],[58,54],[60,62]],'#f4ecd8');mouth(x,62,9)}
  else if(cls!=='Rogue')mouth(x,59,anc==='Halfling'?6:4.5);
  E(x,50,53,2.2,2.6,shade(skin,.8)); // nose
  if(anc==='Halfling'){x.save();x.globalAlpha=.35;E(x,38,55,4,2.5,'#e06060');E(x,62,55,4,2.5,'#e06060');x.restore()}
  if(anc==='Dwarf'){const bc=shade(hair,.95);x.beginPath();x.moveTo(30,52);x.quadraticCurveTo(30,74,50,86);x.quadraticCurveTo(70,74,70,52);x.quadraticCurveTo(60,60,50,58);x.quadraticCurveTo(40,60,30,52);x.fillStyle=bc;x.fill();
    x.strokeStyle=shade(hair,.7);x.lineWidth=1.2;for(let i=0;i<4;i++){x.beginPath();x.moveTo(40+i*6.5,64);x.lineTo(42+i*5,80);x.stroke()}
    x.beginPath();x.ellipse(43,57,7,3,.2,0,7);x.ellipse(57,57,7,3,-.2,0,7);x.fillStyle=shade(hair,.85);x.fill()}
  // horns
  if(anc==='Tiefling'){const hc='#3a2a2a';x.lineCap='round';x.strokeStyle=hc;x.lineWidth=6;x.beginPath();x.moveTo(38,30);x.quadraticCurveTo(28,14,40,8);x.moveTo(62,30);x.quadraticCurveTo(72,14,60,8);x.stroke();x.strokeStyle='#5a4444';x.lineWidth=2;x.stroke()}
  // class headgear / features
  switch(cls){
    case 'Paladin':{x.beginPath();x.ellipse(50,40,hw+3,19,0,Math.PI,0);x.lineTo(50+hw+3,46);x.lineTo(50-hw-3,46);x.closePath();const mg=x.createLinearGradient(30,20,70,46);mg.addColorStop(0,'#e8eef6');mg.addColorStop(1,'#7a8698');x.fillStyle=mg;x.fill();
      x.fillStyle='#7a8698';x.fillRect(47.5,38,5,15);poly(x,[[50,22],[53,30],[50,34],[47,30]],'#e0b45a');
      if(o.crown){x.fillStyle='#e0b45a';x.fillRect(29,33,42,4)}if(anc==='Tiefling')0;break}
    case 'Fighter':{x.beginPath();x.ellipse(50,40,hw+3,19,0,Math.PI,0);x.lineTo(50+hw+3,44);x.lineTo(50-hw-3,44);x.closePath();x.fillStyle='#8a929c';x.fill();x.fillStyle='#5a626c';x.fillRect(28,40,44,4);
      x.beginPath();x.moveTo(50,22);x.quadraticCurveTo(70,4,82,16);x.quadraticCurveTo(66,12,52,26);x.fillStyle='#c0403a';x.fill();break}
    case 'Barbarian':{x.strokeStyle='#3a6a9a';x.lineWidth=2.5;x.beginPath();x.moveTo(36,52);x.lineTo(44,54);x.moveTo(36,56);x.lineTo(43,57);x.moveTo(64,52);x.lineTo(56,54);x.moveTo(64,56);x.lineTo(57,57);x.stroke();break}
    case 'Druid':{x.lineCap='round';x.strokeStyle='#8a6a42';x.lineWidth=3;x.beginPath();x.moveTo(36,28);x.lineTo(26,10);x.moveTo(30,18);x.lineTo(20,16);x.moveTo(64,28);x.lineTo(74,10);x.moveTo(70,18);x.lineTo(80,16);x.stroke();
      for(let i=0;i<6;i++)E(x,32+i*7.2,31+Math.abs(i-2.5)*1.2,4.5,2.6,i%2?'#5a9a4a':'#7ab85a',(i-2.5)*.3);break}
    case 'Cleric':{x.beginPath();x.ellipse(50,44,hw+4,hh+2,0,Math.PI*1.05,Math.PI*1.95);x.lineWidth=7;x.strokeStyle='#efe8d6';x.stroke();x.beginPath();x.arc(50,86,6,0,Math.PI*2);x.fillStyle='#e0b45a';x.fill();break}
    case 'Monk':{x.fillStyle='#c83a2a';x.fillRect(29,35,42,4.5);poly(x,[[70,36],[80,44],[77,47],[69,40]],'#c83a2a');break}
    case 'Bard':{x.beginPath();x.ellipse(47,30,22,9,-.18,0,Math.PI*2);x.fillStyle='#7a2a4a';x.fill();x.beginPath();x.moveTo(60,26);x.quadraticCurveTo(84,8,86,22);x.quadraticCurveTo(76,18,62,30);x.fillStyle='#e8d27a';x.fill();break}
    case 'Rogue':{x.beginPath();x.ellipse(50,44,hw+4,hh+3,0,Math.PI*1.02,Math.PI*1.98);x.lineWidth=8;x.strokeStyle='#2a2630';x.stroke();
      x.beginPath();x.moveTo(29,54);x.quadraticCurveTo(50,50,71,54);x.lineTo(68,68);x.quadraticCurveTo(50,74,32,68);x.closePath();x.fillStyle='#1a181e';x.fill();break}
    case 'Wizard':{poly(x,[[22,36],[78,36],[56,30],[64,0],[44,28]],'#2e4a8a');x.fillStyle='#e8d27a';[[52,22],[47,30],[58,14]].forEach(([a,b2])=>{x.beginPath();x.arc(a,b2,1.6,0,Math.PI*2);x.fill()});x.fillStyle='#1e3366';x.fillRect(22,33,56,4);
      if(anc!=='Halfling'){x.fillStyle='#d8d0c0'}break}
    case 'Warlock':{x.beginPath();x.ellipse(50,44,hw+5,hh+5,0,Math.PI*1.0,Math.PI*2.0);x.lineWidth=10;x.strokeStyle='#2a1a3a';x.stroke();x.save();x.globalAlpha=.45;E(x,50,40,hw,12,'#000');x.restore();eyes(x,null,'#c08aff');break}
    case 'Artificer':{x.fillStyle='#5a3a22';x.fillRect(28,33,44,4);[41,59].forEach(gx=>{x.beginPath();x.arc(gx,33,7,0,Math.PI*2);x.fillStyle='#b88a3a';x.fill();x.beginPath();x.arc(gx,33,4.5,0,Math.PI*2);x.fillStyle='#8fd0ff';x.fill()});break}
    case 'Sorcerer':{x.save();x.globalAlpha=.5;x.strokeStyle='#ff9a4a';x.lineWidth=1.4;x.beginPath();x.moveTo(36,58);x.lineTo(40,62);x.moveTo(64,58);x.lineTo(60,62);x.stroke();x.restore();break}
  }
}
function beast(x,o){ // wolves
  const fur=o.fur,dark=shade(fur,.7);
  poly(x,[[24,40],[30,8],[44,30]],dark);poly(x,[[76,40],[70,8],[56,30]],dark);poly(x,[[28,34],[31,16],[40,30]],'#d8a8a0');poly(x,[[72,34],[69,16],[60,30]],'#d8a8a0');
  E(x,50,46,26,24,fur);E(x,50,64,15,14,shade(fur,1.15));E(x,50,58,6,4.5,'#1a1414');
  x.strokeStyle='#1a1414';x.lineWidth=1.6;x.beginPath();x.moveTo(50,62);x.lineTo(50,68);x.moveTo(43,70);x.quadraticCurveTo(50,74,57,70);x.stroke();
  poly(x,[[44,70],[46,76],[48,71]],'#f4ecd8');poly(x,[[56,70],[54,76],[52,71]],'#f4ecd8');
  const ec=o.red?'#ff4a3a':'#ffcf4a';[38,62].forEach(ex=>{x.save();x.shadowColor=ec;x.shadowBlur=o.red?8:3;E(x,ex,44,4,3,ec);x.restore();E(x,ex,44,1.2,2.6,'#1a1410')});
  if(o.scar){x.strokeStyle='#c87070';x.lineWidth=2;x.beginPath();x.moveTo(58,34);x.lineTo(68,50);x.stroke()}
}
function goblinoid(x,o){
  const {skin,big}=o;
  if(o.hood)E(x,50,44,30,30,'#5a4028');
  body(x,o.body||'#5a4a30');
  poly(x,[[30,46],[2,30],[30,56]],skin);poly(x,[[70,46],[98,30],[70,56]],skin);poly(x,[[28,48],[10,36],[28,53]],shade(skin,.75));poly(x,[[72,48],[90,36],[72,53]],shade(skin,.75));
  E(x,50,48,big?24:21,big?24:21,skin);
  if(big){x.beginPath();x.ellipse(50,36,25,14,0,Math.PI,0);x.fillStyle=o.hair||'#5a3a1e';x.fill();for(let i=0;i<5;i++)poly(x,[[30+i*10,36],[34+i*10,26],[38+i*10,36]],o.hair||'#5a3a1e')}
  if(o.hood){x.beginPath();x.ellipse(50,44,25,27,0,Math.PI*1.05,Math.PI*1.95);x.lineWidth=7;x.strokeStyle='#5a4028';x.stroke()}
  [40,60].forEach(ex=>{E(x,ex,46,4.5,3.4,'#ffd84a');E(x,ex,46.5,1.4,2.8,'#1a1410')});
  x.strokeStyle=shade(skin,.6);x.lineWidth=2.5;x.beginPath();x.moveTo(33,40);x.lineTo(46,43);x.moveTo(67,40);x.lineTo(54,43);x.stroke();
  E(x,50,53,4,3,shade(skin,.8));
  x.beginPath();x.moveTo(38,60);x.quadraticCurveTo(50,67,62,60);x.lineTo(38,60);x.fillStyle='#2a1010';x.fill();
  for(let i=0;i<4;i++)poly(x,[[41+i*6,60],[43.5+i*6,64],[46+i*6,60]],'#f4ecd8');
  if(o.crown){poly(x,[[30,30],[34,16],[40,26],[50,12],[60,26],[66,16],[70,30]],'#9a9aa4','#5a5a64',1.5)}
}
function skull(x){body(x,'#3a3430');E(x,50,44,22,22,'#e6dcc6');x.fillStyle='#e6dcc6';x.fillRect(38,56,24,12);
  E(x,41,46,6,7,'#1a1410');E(x,59,46,6,7,'#1a1410');x.save();x.shadowColor='#7affc0';x.shadowBlur=6;E(x,41,47,1.6,1.6,'#9affd0');E(x,59,47,1.6,1.6,'#9affd0');x.restore();
  poly(x,[[50,52],[47,58],[53,58]],'#1a1410');x.strokeStyle='#1a1410';x.lineWidth=1.4;for(let i=0;i<5;i++){x.beginPath();x.moveTo(40+i*5,61);x.lineTo(40+i*5,68);x.stroke()}}
function spider(x,o){
  x.strokeStyle='#2a2028';x.lineWidth=4;x.lineCap='round';for(let s=-1;s<=1;s+=2)for(let i=0;i<4;i++){x.beginPath();x.moveTo(50,58);x.quadraticCurveTo(50+s*(22+i*4),30+i*12,50+s*(36+i*3),48+i*14);x.stroke()}
  E(x,50,74,20,16,'#1e1820');E(x,50,52,16,14,'#2a2230');
  [[44,48],[56,48],[40,53],[60,53],[46,43],[54,43],[47,55],[53,55]].forEach(([a,c])=>{x.save();x.shadowColor='#ff3a3a';x.shadowBlur=4;E(x,a,c,1.9,1.9,'#ff4a4a');x.restore()});
  poly(x,[[45,62],[43,70],[48,64]],'#d8d0c0');poly(x,[[55,62],[57,70],[52,64]],'#d8d0c0');
}
function drow(x){
  body(x,'#1e1428','#9a3ab8');E(x,50,40,27,30,'#e8e8f0');
  x.fillStyle='#5a4a66';x.fillRect(43,62,14,12);poly(x,[[28,47],[12,32],[30,54]],'#6a5a7a');poly(x,[[72,47],[88,32],[70,54]],'#6a5a7a');
  E(x,50,48,21,24,'#6a5a7a');x.beginPath();x.ellipse(50,38,23,15,0,Math.PI,0);x.fillStyle='#e8e8f0';x.fill();
  eyes(x,null,'#ff3a4a');brows(x,42,'#e8e8f0');mouth(x,59,4);E(x,50,53,2,2.4,'#5a4a66');
  x.save();x.translate(50,88);E(x,0,0,4,5,'#0a0a10');x.strokeStyle='#9a3ab8';x.lineWidth=1.3;for(let i=-1;i<=1;i+=2)for(let j=0;j<3;j++){x.beginPath();x.moveTo(0,0);x.lineTo(i*9,-5+j*5);x.stroke()}x.restore();
}
function construct(x){body(x,'#6a4a2a');x.fillStyle='#b8863a';x.beginPath();x.roundRect?x.roundRect(28,26,44,42,8):x.rect(28,26,44,42);x.fill();x.strokeStyle='#7a5420';x.lineWidth=2;x.stroke();
  x.save();x.shadowColor='#8fd0ff';x.shadowBlur=8;x.fillStyle='#8fd0ff';x.fillRect(36,42,28,5);x.restore();x.fillStyle='#7a5420';[33,67].forEach(a=>{x.beginPath();x.arc(a,31,2,0,Math.PI*2);x.fill()});
  x.fillStyle='#5a3a1a';for(let i=0;i<4;i++)x.fillRect(38+i*7,56,4,6)}
function human(x,o){humanoid(x,{anc:'Human',cls:o.cls,skin:o.skin,hair:o.hair})}

const ENEMY={
  goblin:x=>goblinoid(x,{skin:'#7aa04a',body:'#5a4a30'}),
  archer:x=>goblinoid(x,{skin:'#6a9a4a',hood:1,body:'#4a5a30'}),
  wolf:x=>beast(x,{fur:'#8a8a90'}),
  ripper:x=>beast(x,{fur:'#5a5458',red:1,scar:1}),
  ruffian:x=>{humanoid(x,{anc:'Human',cls:'Rogue',skin:'#d4a27c',hair:'#3a2a1a'});x.beginPath();x.moveTo(8,100);x.quadraticCurveTo(12,74,50,72);x.quadraticCurveTo(88,74,92,100);x.closePath();x.fillStyle='#a8262a';x.fill();x.beginPath();x.ellipse(50,44,25,27,0,Math.PI*1.02,Math.PI*1.98);x.lineWidth=8;x.strokeStyle='#a8262a';x.stroke()},
  skeleton:skull,
  bugbear:x=>goblinoid(x,{skin:'#b0804a',big:1,hair:'#6a4220',body:'#4a3420'}),
  klarg:x=>goblinoid(x,{skin:'#a8703a',big:1,hair:'#4a2a14',body:'#3a2a1a',crown:1}),
  glasstaff:x=>{humanoid(x,{anc:'Human',cls:'Wizard',skin:'#e8c4a0',hair:'#c8a058'});x.save();x.strokeStyle='#bfe8ff';x.lineWidth=3;x.shadowColor='#bfe8ff';x.shadowBlur=8;x.beginPath();x.moveTo(82,100);x.lineTo(86,52);x.stroke();poly(x,[[86,42],[91,52],[86,60],[81,52]],'rgba(200,240,255,.8)');x.restore();x.fillStyle='#a8262a';x.fillRect(22,33,56,4)},
  spider:spider,nezznar:drow,
  shaman:x=>{goblinoid(x,{skin:'#8a7ac0',hood:1,body:'#5a3a6a'});x.fillStyle='#ffe08a';x.beginPath();x.arc(80,24,7,0,7);x.fill()},
  orc:x=>goblinoid(x,{skin:'#7f9478',big:1,hair:'#2a2a2a',body:'#5a4636'}),
  chief:x=>goblinoid(x,{skin:'#70886a',big:1,hair:'#1e1e1e',body:'#6a2a22',crown:1}),
  ogre:x=>goblinoid(x,{skin:'#c9a878',big:1,hair:'#5a4630',body:'#6a5a44'}),
  hobgoblin:x=>goblinoid(x,{skin:'#c8683c',hair:'#2a1a14',body:'#4a4a52'}),
  captain:x=>goblinoid(x,{skin:'#c05a34',big:1,hair:'#2a1a14',body:'#3a3a48',crown:1}),
  zombie:x=>humanoid(x,{anc:'Human',cls:'Fighter',skin:'#8fa58a',hair:'#3a3a30'}),
  ashzombie:x=>humanoid(x,{anc:'Human',cls:'Fighter',skin:'#a8a49c',hair:'#55524c'}),
  necromancer:x=>humanoid(x,{anc:'Human',cls:'Wizard',skin:'#d8c4b0',hair:'#d8c4b0'}),
  adept:x=>humanoid(x,{anc:'Human',cls:'Sorcerer',skin:'#c89a78',hair:'#5a1a10'}),
  conjurer:x=>humanoid(x,{anc:'Human',cls:'Warlock',skin:'#b8b0a8',hair:'#2a2a30'}),
  caller:x=>humanoid(x,{anc:'Wood Elf',cls:'Druid',skin:'#8a9a6a',hair:'#3a4a20'}),
  flameskull:x=>{x.fillStyle='rgba(120,255,140,.55)';x.beginPath();x.moveTo(50,2);x.quadraticCurveTo(92,30,84,70);x.quadraticCurveTo(50,96,16,70);x.quadraticCurveTo(8,30,50,2);x.fill();skull(x)},
  owlbear:x=>{x.fillStyle='#6a4a2c';x.beginPath();x.ellipse(50,62,40,38,0,0,7);x.fill();x.fillStyle='#8a6a44';x.beginPath();x.ellipse(50,52,30,28,0,0,7);x.fill();
    [[36,46],[64,46]].forEach(([a,b])=>{x.fillStyle='#f4e8c8';x.beginPath();x.arc(a,b,11,0,7);x.fill();x.fillStyle='#e0a020';x.beginPath();x.arc(a,b,7,0,7);x.fill();x.fillStyle='#111';x.beginPath();x.arc(a,b,3.5,0,7);x.fill()});
    x.fillStyle='#d8b040';x.beginPath();x.moveTo(42,58);x.lineTo(58,58);x.lineTo(50,78);x.closePath();x.fill();x.fillStyle='#5a3a1e';[[22,24],[78,24]].forEach(([a,b])=>{x.beginPath();x.moveTo(a-8,b+14);x.lineTo(a,b-8);x.lineTo(a+8,b+14);x.closePath();x.fill()})},
  blight:x=>{x.strokeStyle='#6a5030';x.lineWidth=7;x.lineCap='round';[[50,96,50,40],[50,60,26,34],[50,56,76,30],[50,44,40,14],[50,44,62,12],[26,34,14,22],[76,30,88,20]].forEach(([a,b,c,d])=>{x.beginPath();x.moveTo(a,b);x.lineTo(c,d);x.stroke()});
    x.fillStyle='#4a7a34';[[14,20],[88,18],[40,12],[62,10]].forEach(([a,b])=>{x.beginPath();x.ellipse(a,b,7,4,.6,0,7);x.fill()});x.fillStyle='#ffd24a';[[44,50],[56,50]].forEach(([a,b])=>{x.beginPath();x.arc(a,b,3,0,7);x.fill()})},
};

/* ---------- hand-tuned hero portraits: background and personality ---------- */
const LOOK={
  tharra:{anc:'Dwarf',skin:'#d08a66',hair:'#9a4a22',body:'#b8b4a8',trim:'#e0b45a',bg:'#6a5528',bgfx:'sun',hairStyle:'none',beard:'braided',head:'warhelm',eyes:'stern',brows:'stern',mouth:'flat',extras:['scarBrow','holySymbol']},
  garrick:{anc:'Human',skin:'#c8946c',hair:'#8c8a86',body:'#6e7684',trim:'#a8aab0',bg:'#3a3f4a',bgfx:'road',hairStyle:'short',head:'none',eyes:'steady',brows:'flat',mouth:'smirk',extras:['stubble','scarCheek','crowsfeet','swordHilt','chainCollar']},
  shava:{anc:'Elf',skin:'#e2c6a6',hair:'#1a1a24',body:'#1e1c24',bg:'#2a1e36',bgfx:'shadow',hairStyle:'none',head:'hood',eyes:'narrow',brows:'stern',mouth:'none',extras:['mask','daggerHilt']},
  pip:{anc:'Halfling',skin:'#e8b88c',hair:'#6a4022',body:'#4a5a34',bg:'#4a6a3a',bgfx:'leaves',hairStyle:'curly',head:'featherCap',eyes:'wide',brows:'raised',mouth:'grin',extras:['freckles','bowString']},
  ilka:{anc:'Half-Orc',skin:'#8aa268',hair:'#2a2a20',body:'#6a5a44',trim:'#b88a3a',bg:'#4a4030',bgfx:'gears',hairStyle:'buzzBraid',head:'goggles',eyes:'steady',brows:'flat',mouth:'smirk',extras:['soot','toolStrap']},
  naivara:{anc:'Elf',skin:'#efd6b8',hair:'#e07a2a',body:'#2e4a8a',trim:'#e8d27a',bg:'#5a2a1a',bgfx:'sparks',hairStyle:'wild',head:'singedHat',eyes:'wide',brows:'raised',mouth:'grin',extras:['soot']},
  maelis:{anc:'Moon Elf',skin:'#e4e0ec',hair:'#dfe6f4',body:'#e8e0cc',trim:'#c8a040',bg:'#2a3a5a',bgfx:'moon',hairStyle:'long',head:'moonCirclet',eyes:'tired',brows:'worried',mouth:'smile',extras:[]},
  elena:{anc:'Human',skin:'#f0d0b0',hair:'#e8c058',body:'#a83a4a',trim:'#e8d27a',bg:'#7a2a3a',bgfx:'banner',hairStyle:'windswept',head:'featherCap',eyes:'bright',brows:'raised',mouth:'open',extras:['notes']},
  torvald:{anc:'Dwarf',skin:'#c88462',hair:'#1e1a18',body:'#5a4a3a',trim:'#8a6a3a',bg:'#4a3020',bgfx:'tavern',hairStyle:'bald',beard:'huge',head:'none',eyes:'small',brows:'heavy',mouth:'frown',extras:['brokenNose','earNotch','tankard']},
  kethra:{anc:'Tiefling',skin:'#7a4a8a',hair:'#141018',body:'#1e1a22',trim:'#6a9a5a',bg:'#1e2a1e',bgfx:'ghosts',hairStyle:'long',head:'none',horns:'curl',eyes:'glow',eyeCol:'#8aff8a',brows:'arched',mouth:'smirk',extras:['skullPendant']},
  oskar:{anc:'Gnome',skin:'#f0c8a0',hair:'#f4f0e8',body:'#3a5a8a',trim:'#9ac8ff',bg:'#24405a',bgfx:'ward',hairStyle:'tufts',head:'none',eyes:'wide',brows:'raised',mouth:'smile',extras:['spectacles','bigNose']},
  rhogar:{anc:'Dragonborn',skin:'#3a8a92',body:'#c8c0a8',trim:'#6ab4e8',bg:'#1e2e44',bgfx:'storm',eyeCol:'#bfe8ff',extras:['holySymbol']},
  lyra:{anc:'Elf',skin:'#f2dcc8',hair:'#c8b0e8',body:'#5a3a7a',trim:'#e8d27a',bg:'#3a2a4a',bgfx:'notes',hairStyle:'long',head:'flowers',eyes:'serene',brows:'soft',mouth:'smile',extras:['earring']},
  vessa:{anc:'Tiefling',skin:'#c04a42',hair:'#2a1a2a',body:'#2a2630',trim:'#b8862a',bg:'#3a1e2a',bgfx:'coins',hairStyle:'sideSweep',head:'none',horns:'small',eyes:'wink',brows:'arched',mouth:'grin',extras:['spectralHand','earring']},
  wren:{anc:'Human',skin:'#d8a47c',hair:'#3a2418',body:'#7a2a2a',trim:'#e8d27a',bg:'#2a3a5a',bgfx:'sea',hairStyle:'ponytail',head:'tricorne',eyes:'bright',brows:'raised',mouth:'grin',extras:['earring','rapierHilt']},
  morga:{anc:'Half-Orc',skin:'#7f9a5e',hair:'#b8401e',body:'#5a3a24',trim:'#ffb04a',bg:'#5a2410',bgfx:'forge',hairStyle:'topknot',head:'none',eyes:'steady',brows:'flat',mouth:'smile',extras:['soot','apron','holySymbol']},
};
function drawFace(x,L){
  const {anc,skin,hair}=L;const S=(k)=>shade(skin,k);
  // background details
  bg(x,L.bg);
  x.save();
  switch(L.bgfx){
    case 'sun':x.globalAlpha=.35;x.strokeStyle='#ffe27a';x.lineWidth=2;for(let i=0;i<12;i++){const a=i/12*Math.PI*2;x.beginPath();x.moveTo(50+Math.cos(a)*30,38+Math.sin(a)*30);x.lineTo(50+Math.cos(a)*48,38+Math.sin(a)*48);x.stroke()}break;
    case 'road':x.globalAlpha=.25;poly(x,[[40,100],[60,100],[54,60],[46,60]],'#c8b88a');break;
    case 'shadow':{const g=x.createRadialGradient(50,50,20,50,50,60);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.6)');x.fillStyle=g;x.fillRect(0,0,100,100);break}
    case 'leaves':x.globalAlpha=.45;[[12,20],[86,26],[14,64],[88,70],[24,8]].forEach(([a,c],i)=>E(x,a,c,6,3,i%2?'#7ab85a':'#5a9a4a',i));break;
    case 'gears':x.globalAlpha=.3;x.strokeStyle='#d8b070';x.lineWidth=3;[[16,22,9],[84,30,7]].forEach(([a,c,r])=>{x.beginPath();x.arc(a,c,r,0,7);x.stroke();for(let i=0;i<8;i++){const t=i/8*Math.PI*2;x.beginPath();x.moveTo(a+Math.cos(t)*r,c+Math.sin(t)*r);x.lineTo(a+Math.cos(t)*(r+4),c+Math.sin(t)*(r+4));x.stroke()}});break;
    case 'sparks':x.globalAlpha=.8;for(let i=0;i<14;i++){const a=(i*137)%100,c=(i*61)%60;E(x,a,c+4,1.4,1.4,i%2?'#ffd06a':'#ff7a3a')}break;
    case 'moon':x.globalAlpha=.55;E(x,80,20,10,10,'#e8ecff');E(x,85,17,9,9,L.bg);break;
    case 'banner':x.globalAlpha=.5;x.fillStyle='#e8d27a';x.fillRect(80,4,3,60);poly(x,[[83,6],[100,12],[83,22]],'#c83a3a');break;
    case 'tavern':x.globalAlpha=.25;for(let i=0;i<5;i++){x.fillStyle=i%2?'#7a5030':'#6a4428';x.fillRect(0,i*20,100,20)}break;
    case 'ghosts':x.globalAlpha=.25;[[18,30],[82,24],[80,62]].forEach(([a,c])=>{E(x,a,c,7,9,'#9affb0');E(x,a-2,c-2,1.3,1.6,'#1e2a1e');E(x,a+2,c-2,1.3,1.6,'#1e2a1e')});break;
    case 'ward':x.globalAlpha=.4;x.strokeStyle='#9ac8ff';x.lineWidth=2;x.beginPath();for(let i=0;i<6;i++){const a=i/6*Math.PI*2-Math.PI/2;const px=50+Math.cos(a)*44,py=50+Math.sin(a)*44;i?x.lineTo(px,py):x.moveTo(px,py)}x.closePath();x.stroke();break;
    case 'storm':x.globalAlpha=.7;x.strokeStyle='#bfe8ff';x.lineWidth=2;x.beginPath();x.moveTo(84,0);x.lineTo(76,20);x.lineTo(86,22);x.lineTo(74,46);x.stroke();x.globalAlpha=.3;E(x,20,14,16,8,'#8a9aaa');break;
    case 'notes':x.globalAlpha=.55;x.fillStyle='#e8d27a';x.font='900 14px serif';x.fillText('♪',8,30);x.fillText('♫',80,22);x.fillText('♪',84,66);break;
    case 'coins':x.globalAlpha=.6;[[14,24],[84,20],[88,60],[10,62]].forEach(([a,c])=>{E(x,a,c,4,4,'#e8c04a');E(x,a,c,2.4,2.4,'#b8902a')});break;
    case 'sea':x.globalAlpha=.3;x.strokeStyle='#bfe0ff';x.lineWidth=2;for(let i=0;i<3;i++){x.beginPath();x.moveTo(0,20+i*12);x.quadraticCurveTo(25,14+i*12,50,20+i*12);x.quadraticCurveTo(75,26+i*12,100,20+i*12);x.stroke()}break;
    case 'forge':{const g=x.createRadialGradient(50,100,5,50,100,70);g.addColorStop(0,'rgba(255,150,40,.75)');g.addColorStop(1,'rgba(255,90,20,0)');x.fillStyle=g;x.fillRect(0,0,100,100);break}
  }
  x.restore();
  if(anc==='Dragonborn')return dragonborn(x,L);
  // long hair and hoods behind the head
  if(['long','wild','windswept'].includes(L.hairStyle)){x.beginPath();x.moveTo(26,40);x.quadraticCurveTo(22,74,30,86);x.lineTo(70,86);x.quadraticCurveTo(78,74,74,40);x.closePath();x.fillStyle=hair;x.fill()}
  if(L.hairStyle==='wild'){for(let i=0;i<6;i++)poly(x,[[24+i*10,36],[20+i*11,16+(i%2)*6],[32+i*10,32]],hair)}
  if(L.head==='hood')E(x,50,44,30,32,'#1e1c24');
  // body
  body(x,L.body,L.trim);
  if((L.extras||[]).includes('apron')){poly(x,[[38,76],[62,76],[66,100],[34,100]],'#8a5a34');x.strokeStyle='#4a2a14';x.lineWidth=1.5;x.strokeRect(44,84,12,8)}
  if((L.extras||[]).includes('chainCollar')){x.fillStyle='#8a929c';for(let i=0;i<9;i++)E(x,32+i*4.5,76,2.6,2.2,'#9aa2ac')}
  if((L.extras||[]).includes('bowString')){x.strokeStyle='#d8c8a0';x.lineWidth=1.2;x.beginPath();x.moveTo(24,74);x.lineTo(70,100);x.stroke();x.strokeStyle='#7a5030';x.lineWidth=3;x.beginPath();x.arc(14,90,28,-1.2,.2);x.stroke()}
  if((L.extras||[]).includes('toolStrap')){x.strokeStyle='#3a2a1a';x.lineWidth=4;x.beginPath();x.moveTo(26,78);x.lineTo(72,100);x.stroke();['#b8b0a0','#c8a040'].forEach((c,i)=>{x.fillStyle=c;x.fillRect(40+i*10,84+i*4,3,8)})}
  if((L.extras||[]).includes('swordHilt')){x.fillStyle='#8a6a3a';x.fillRect(78,58,4,22);x.fillStyle='#c8c0b0';x.fillRect(73,78,14,3)}
  if((L.extras||[]).includes('rapierHilt')){x.strokeStyle='#e8d27a';x.lineWidth=2;x.beginPath();x.arc(82,72,6,0,Math.PI);x.stroke();x.fillStyle='#c8c0b0';x.fillRect(81,50,2,22)}
  if((L.extras||[]).includes('daggerHilt')){x.fillStyle='#3a3a44';x.fillRect(74,56,3,18);x.fillStyle='#8a8a9a';x.fillRect(70,72,11,2.5)}
  if((L.extras||[]).includes('skullPendant')){x.strokeStyle='#8a8a7a';x.lineWidth=1;x.beginPath();x.moveTo(42,74);x.lineTo(50,86);x.lineTo(58,74);x.stroke();E(x,50,88,4,4,'#e6dcc6');E(x,48.5,88,1,1.2,'#1a1410');E(x,51.5,88,1,1.2,'#1a1410')}
  if((L.extras||[]).includes('holySymbol')){x.save();x.shadowColor='#ffe27a';x.shadowBlur=6;E(x,50,88,5,5,'#e0b45a');x.restore();x.fillStyle='#fff3cf';x.fillRect(49,84,2,8);x.fillRect(46,87,8,2)}
  if((L.extras||[]).includes('tankard')){x.fillStyle='#7a7a82';x.fillRect(70,78,14,16);x.strokeStyle='#5a5a62';x.lineWidth=3;x.beginPath();x.arc(85,86,5,-1.4,1.4);x.stroke();E(x,77,78,7,2.5,'#f4ecd8')}
  // neck and ears
  x.fillStyle=S(.85);x.fillRect(43,62,14,12);
  if(/Elf|Tiefling/.test(anc)){poly(x,[[28,47],[13,33],[30,54]],skin);poly(x,[[72,47],[87,33],[70,54]],skin)}
  else if(anc==='Gnome'){poly(x,[[27,46],[16,38],[29,55]],skin);poly(x,[[73,46],[84,38],[71,55]],skin)}
  else{E(x,28,49,3.6,5.6,skin);E(x,72,49,3.6,5.6,skin)}
  if((L.extras||[]).includes('earNotch')){x.fillStyle=L.bg;x.beginPath();x.arc(73,46,1.6,0,7);x.fill()}
  // head
  const wide=['Dwarf','Halfling','Gnome','Half-Orc'].includes(anc);const hw=anc==='Gnome'?24:wide?23:21,hh=anc==='Gnome'?23:anc==='Half-Orc'?23:24;
  const g=x.createRadialGradient(46,42,4,50,48,26);g.addColorStop(0,S(1.08));g.addColorStop(1,S(.86));x.beginPath();x.ellipse(50,48,hw,hh,0,0,7);x.fillStyle=g;x.fill();
  if(anc==='Half-Orc'){x.fillStyle=S(.82);x.fillRect(33,56,34,10)}
  if(L.hairStyle==='bald'){x.save();x.globalAlpha=.35;E(x,43,32,7,3,'#fff',-.3);x.restore()}
  // eyes
  const ey=48,ec=L.eyeCol||'#3a2a1a';
  const eye=(ex,kind)=>{
    if(kind==='glow'){x.save();x.shadowColor=ec;x.shadowBlur=9;E(x,ex,ey,3.4,2.2,ec);x.restore();return}
    if(kind==='closed'||kind==='serene'){x.strokeStyle='#2a1e16';x.lineWidth=1.6;x.beginPath();x.arc(ex,ey-1,3,.2,Math.PI-.2);x.stroke();return}
    const ry=kind==='narrow'?1.2:kind==='tired'?1.8:kind==='wide'||kind==='bright'?2.9:kind==='small'?1.8:2.3;const rx=kind==='small'?2.4:3.1;
    E(x,ex,ey,rx,ry,'#f4efe6');E(x,ex,ey+.2,Math.min(1.8,rx*.6),Math.min(ry,1.9),ec);if(kind==='bright'||kind==='wide')E(x,ex+.8,ey-.8,.7,.7,'#fff');
    if(kind==='tired'){x.strokeStyle=S(.7);x.lineWidth=1.2;x.beginPath();x.moveTo(ex-3.5,ey-1.4);x.lineTo(ex+3.5,ey-1.4);x.stroke();x.beginPath();x.arc(ex,ey+3.4,2.6,.3,Math.PI-.3);x.stroke()}};
  if(L.eyes==='wink'){eye(42,'bright');x.strokeStyle='#2a1e16';x.lineWidth=1.8;x.beginPath();x.moveTo(55,48);x.quadraticCurveTo(58,45.5,61,48);x.stroke()}else{eye(42,L.eyes);eye(58,L.eyes)}
  // brows
  const bc=L.hairStyle==='bald'?(L.beard?hair:S(.6)):shade(hair,.85);x.strokeStyle=bc;x.lineWidth=L.brows==='heavy'?3.6:2;x.lineCap='round';x.beginPath();
  const B={stern:[[37,42],[46,44],[54,44],[63,42]],flat:[[37,42.5],[46,42.5],[54,42.5],[63,42.5]],raised:[[37,41],[46,39.5],[54,39.5],[63,41]],worried:[[37,41.5],[46,40],[54,40],[63,41.5]],heavy:[[36,41],[47,44.5],[53,44.5],[64,41]],arched:[[37,42],[42,39],[46,41],[54,41],[58,39],[63,42]],soft:[[38,41.5],[46,40.8],[54,40.8],[62,41.5]]}[L.brows||'flat'];
  if(B.length===6){x.moveTo(B[0][0],B[0][1]);x.quadraticCurveTo(B[1][0],B[1][1],B[2][0],B[2][1]);x.moveTo(B[3][0],B[3][1]);x.quadraticCurveTo(B[4][0],B[4][1],B[5][0],B[5][1])}else{x.moveTo(...B[0]);x.lineTo(...B[1]);x.moveTo(...B[2]);x.lineTo(...B[3])}x.stroke();
  // nose
  if((L.extras||[]).includes('bigNose'))E(x,50,54,4.6,4,S(.86));else if((L.extras||[]).includes('brokenNose')){poly(x,[[49,47],[53,52],[50,56],[47,55]],S(.8))}else E(x,50,53.5,2.2,2.6,S(.8));
  // face marks
  const ex=L.extras||[];
  if(ex.includes('freckles')){x.fillStyle='rgba(150,80,40,.55)';[[38,54],[41,56],[36,57],[62,54],[59,56],[64,57]].forEach(([a,c])=>{x.beginPath();x.arc(a,c,.9,0,7);x.fill()})}
  if(ex.includes('soot')){x.save();x.globalAlpha=.4;E(x,61,57,5,3,'#1a1410',.4);E(x,40,44,3,1.6,'#1a1410');x.restore()}
  if(ex.includes('stubble')){x.save();x.globalAlpha=.3;x.fillStyle='#4a4440';for(let i=0;i<40;i++){const a=36+((i*37)%28),c=56+((i*17)%13);x.fillRect(a,c,.8,.8)}x.restore()}
  if(ex.includes('scarCheek')){x.strokeStyle='#9a5a4a';x.lineWidth=1.4;x.beginPath();x.moveTo(60,49);x.lineTo(66,58);x.stroke();for(let i=0;i<3;i++){x.beginPath();x.moveTo(61+i*2,51+i*2.6);x.lineTo(63.5+i*2,50+i*2.6);x.stroke()}}
  if(ex.includes('scarBrow')){x.strokeStyle='#8a4a3a';x.lineWidth=1.4;x.beginPath();x.moveTo(40,38);x.lineTo(44,50);x.stroke()}
  if(ex.includes('crowsfeet')){x.strokeStyle=S(.72);x.lineWidth=.9;[[34,46],[34,49],[66,46],[66,49]].forEach(([a,c],i)=>{x.beginPath();x.moveTo(a,c);x.lineTo(a+(i<2?-3:3),c+(i%2?1.5:-1));x.stroke()})}
  // mouth
  x.strokeStyle='rgba(70,24,20,.85)';x.lineWidth=1.7;x.beginPath();
  switch(L.mouth){
    case 'grin':x.moveTo(42,59);x.quadraticCurveTo(50,67,58,59);x.closePath();x.fillStyle='#fff6ea';x.fill();x.stroke();break;
    case 'smile':x.moveTo(44,60);x.quadraticCurveTo(50,64,56,60);x.stroke();break;
    case 'smirk':x.moveTo(45,61);x.quadraticCurveTo(52,62,57,58);x.stroke();break;
    case 'frown':x.moveTo(44,63);x.quadraticCurveTo(50,59,56,63);x.stroke();break;
    case 'open':E(x,50,61,4,3.4,'#5a1a1a');break;
    case 'flat':x.moveTo(45,61);x.lineTo(55,61);x.stroke();break;
  }
  if(anc==='Half-Orc'){poly(x,[[40,63],[42,55],[44.5,63]],'#f4ecd8');poly(x,[[55.5,63],[58,55],[60,63]],'#f4ecd8')}
  // beards
  if(L.beard==='braided'){x.beginPath();x.moveTo(31,52);x.quadraticCurveTo(32,72,44,78);x.lineTo(56,78);x.quadraticCurveTo(68,72,69,52);x.quadraticCurveTo(60,62,50,61);x.quadraticCurveTo(40,62,31,52);x.fillStyle=hair;x.fill();
    [44,56].forEach(bx=>{x.fillStyle=hair;x.fillRect(bx-2.5,76,5,14);E(x,bx,91,3,2,'#c8a040')});x.beginPath();x.ellipse(43,57.5,7,2.8,.2,0,7);x.ellipse(57,57.5,7,2.8,-.2,0,7);x.fillStyle=shade(hair,.85);x.fill()}
  if(L.beard==='huge'){x.beginPath();x.moveTo(27,48);x.quadraticCurveTo(24,84,50,96);x.quadraticCurveTo(76,84,73,48);x.quadraticCurveTo(62,64,50,60);x.quadraticCurveTo(38,64,27,48);x.fillStyle=hair;x.fill();
    x.strokeStyle=shade(hair,1.6);x.lineWidth=1;for(let i=0;i<5;i++){x.beginPath();x.moveTo(36+i*7,66);x.lineTo(38+i*6,88);x.stroke()}E(x,43,58,7.5,3,shade(hair,1.2),.2);E(x,57,58,7.5,3,shade(hair,1.2),-.2);x.beginPath();x.moveTo(44,63);x.quadraticCurveTo(50,60,56,63);x.strokeStyle='rgba(60,20,20,.9)';x.lineWidth=1.6;x.stroke()}
  // front hair
  const cap=(w,h2)=>{x.beginPath();x.ellipse(50,38,hw+2,h2||15,0,Math.PI,0);x.fillStyle=hair;x.fill()};
  switch(L.hairStyle){
    case 'short':cap(15,13);x.fillStyle=hair;x.fillRect(27,36,4,10);x.fillRect(69,36,4,10);break;
    case 'curly':for(let i=0;i<7;i++)E(x,30+i*6.6,30+Math.abs(i-3)*1.6,6,6,i%2?hair:shade(hair,1.12));E(x,28,44,4,6,hair);E(x,72,44,4,6,hair);break;
    case 'wild':cap(16,16);for(let i=0;i<5;i++)poly(x,[[30+i*10,30],[34+i*10,18+(i%2)*4],[40+i*10,30]],hair);break;
    case 'buzzBraid':x.save();x.globalAlpha=.85;cap(13,11);x.restore();x.fillStyle=hair;x.fillRect(48,14,4,14);break;
    case 'long':cap(16,15);x.fillStyle=hair;x.fillRect(27,36,5,22);x.fillRect(68,36,5,22);break;
    case 'windswept':cap(16,15);poly(x,[[30,30],[8,20],[24,38]],hair);poly(x,[[40,26],[18,10],[34,30]],hair);x.fillStyle=hair;x.fillRect(68,36,5,18);break;
    case 'tufts':E(x,27,40,7,5,hair);E(x,73,40,7,5,hair);E(x,50,25,6,4,hair);break;
    case 'sideSweep':cap(16,14);poly(x,[[30,34],[56,30],[70,44],[64,36]],hair);break;
    case 'ponytail':cap(15,13);x.fillStyle=hair;x.beginPath();x.moveTo(70,34);x.quadraticCurveTo(86,40,80,66);x.lineTo(74,64);x.quadraticCurveTo(78,46,68,40);x.fill();break;
    case 'topknot':cap(14,12);E(x,50,22,7,6,hair);x.fillStyle='#c8a040';x.fillRect(46,26,8,3);break;
  }
  // horns
  if(L.horns==='curl'){x.lineCap='round';x.strokeStyle='#2a2028';x.lineWidth=6;x.beginPath();x.moveTo(36,30);x.quadraticCurveTo(22,24,26,10);x.quadraticCurveTo(30,4,36,10);x.moveTo(64,30);x.quadraticCurveTo(78,24,74,10);x.quadraticCurveTo(70,4,64,10);x.stroke()}
  if(L.horns==='small'){poly(x,[[38,30],[34,16],[43,28]],'#3a2a2a');poly(x,[[62,30],[66,16],[57,28]],'#3a2a2a')}
  // headgear
  switch(L.head){
    case 'warhelm':{x.beginPath();x.ellipse(50,39,hw+3,18,0,Math.PI,0);x.lineTo(50+hw+3,45);x.lineTo(50-hw-3,45);x.closePath();const mg=x.createLinearGradient(30,20,70,45);mg.addColorStop(0,'#e8ecf2');mg.addColorStop(1,'#7a8698');x.fillStyle=mg;x.fill();x.fillStyle='#5a6474';x.fillRect(27,41,46,4);
      x.save();x.shadowColor='#ffe27a';x.shadowBlur=6;E(x,50,30,5,5,'#e0b45a');x.restore();for(let i=0;i<8;i++){const a=i/8*Math.PI*2;x.strokeStyle='#e0b45a';x.lineWidth=1.4;x.beginPath();x.moveTo(50+Math.cos(a)*6,30+Math.sin(a)*6);x.lineTo(50+Math.cos(a)*9,30+Math.sin(a)*9);x.stroke()}break}
    case 'hood':x.beginPath();x.ellipse(50,44,hw+5,hh+4,0,Math.PI*1.02,Math.PI*1.98);x.lineWidth=9;x.strokeStyle='#1e1c24';x.stroke();x.save();x.globalAlpha=.35;E(x,50,39,hw,9,'#000');x.restore();break;
    case 'featherCap':x.beginPath();x.ellipse(47,30,21,8,-.15,0,7);x.fillStyle=L.anc==='Halfling'?'#3a5a2a':'#7a2a4a';x.fill();x.beginPath();x.moveTo(60,26);x.quadraticCurveTo(86,6,88,20);x.quadraticCurveTo(76,16,62,30);x.fillStyle=L.anc==='Halfling'?'#d8c8a0':'#e8d27a';x.fill();break;
    case 'tricorne':poly(x,[[20,34],[50,18],[80,34],[66,28],[50,24],[34,28]],'#1e1a22');x.beginPath();x.ellipse(50,30,26,8,0,0,7);x.fillStyle='#2a2430';x.fill();x.strokeStyle='#e8d27a';x.lineWidth=1.5;x.stroke();x.beginPath();x.moveTo(64,24);x.quadraticCurveTo(84,10,86,22);x.strokeStyle='#e8e0d0';x.lineWidth=3;x.stroke();break;
    case 'moonCirclet':x.strokeStyle='#c8d4f0';x.lineWidth=2;x.beginPath();x.ellipse(50,34,hw,5,0,Math.PI*.05,Math.PI*.95,true);x.stroke();x.save();x.shadowColor='#e8ecff';x.shadowBlur=6;E(x,50,29,4,4,'#e8ecff');E(x,52,28,3.4,3.4,shade(hair,.95));x.restore();break;
    case 'flowers':['#f08ad8','#ffe27a','#9ad8ff','#f08ad8','#ffe27a'].forEach((c,i)=>{E(x,32+i*9,31+Math.abs(i-2)*1.6,3.4,3.4,c);E(x,32+i*9,31+Math.abs(i-2)*1.6,1.2,1.2,'#fff')});break;
    case 'goggles':x.fillStyle='#4a3a2a';x.fillRect(27,32,46,4);[41,59].forEach(gx=>{E(x,gx,33,7,6,'#b8863a');E(x,gx,33,4.6,4,'#9ad8ff');E(x,gx+1.4,32,1.4,1.2,'#fff')});break;
    case 'singedHat':poly(x,[[22,36],[78,36],[58,28],[66,4],[44,26]],'#2e4a8a');x.fillStyle='#1e3366';x.fillRect(22,33,56,4);E(x,65,5,4,3,'#1a1410');x.save();x.globalAlpha=.5;E(x,69,-1,5,4,'#6a6a6a');E(x,74,-6,4,3,'#8a8a8a');x.restore();x.fillStyle='#e8d27a';[[52,22],[47,30]].forEach(([a,c])=>{x.beginPath();x.arc(a,c,1.5,0,7);x.fill()});break;
  }
  // front extras
  if(ex.includes('mask')){x.beginPath();x.moveTo(28,53);x.quadraticCurveTo(50,49,72,53);x.lineTo(69,68);x.quadraticCurveTo(50,75,31,68);x.closePath();x.fillStyle='#14121a';x.fill()}
  if(ex.includes('spectacles')){x.strokeStyle='#c8a040';x.lineWidth=1.8;x.beginPath();x.arc(42,48,5.4,0,7);x.moveTo(63.4,48);x.arc(58,48,5.4,0,7);x.moveTo(47.4,47);x.lineTo(52.6,47);x.stroke();x.save();x.globalAlpha=.2;E(x,42,48,5,5,'#bfe8ff');E(x,58,48,5,5,'#bfe8ff');x.restore()}
  if(ex.includes('earring')){x.strokeStyle='#e8c04a';x.lineWidth=1.6;x.beginPath();x.arc(/Elf|Tiefling/.test(anc)?30:28,56,2.4,0,7);x.stroke()}
  if(ex.includes('spectralHand')){x.save();x.globalAlpha=.7;x.shadowColor='#9affd0';x.shadowBlur=8;x.fillStyle='#9affd0';E(x,84,46,6,7,'#9affd0');[0,1,2,3].forEach(i=>x.fillRect(79+i*3,34,2,9));x.fillRect(89,42,6,2);x.restore()}
  if(ex.includes('notes')){x.fillStyle='#ffe27a';x.font='900 12px serif';x.fillText('♪',66,64);x.fillText('♫',72,56)}
}
function dragonborn(x,L){
  const s=L.skin,S=k=>shade(s,k);
  body(x,L.body,L.trim);if((L.extras||[]).includes('holySymbol')){x.save();x.shadowColor='#bfe8ff';x.shadowBlur=6;E(x,50,88,5,5,'#6ab4e8');x.restore();x.strokeStyle='#fff';x.lineWidth=1.6;x.beginPath();x.moveTo(51,83);x.lineTo(48,88);x.lineTo(52,88);x.lineTo(49,93);x.stroke()}
  x.fillStyle=S(.8);x.fillRect(41,60,18,14);
  // frill horns swept back
  x.lineCap='round';x.strokeStyle=S(.6);x.lineWidth=5;x.beginPath();x.moveTo(34,32);x.quadraticCurveTo(20,20,16,6);x.moveTo(66,32);x.quadraticCurveTo(80,20,84,6);x.stroke();
  x.lineWidth=3;x.beginPath();x.moveTo(30,42);x.lineTo(16,36);x.moveTo(70,42);x.lineTo(84,36);x.stroke();
  // skull and snout
  const g=x.createRadialGradient(46,38,4,50,46,28);g.addColorStop(0,S(1.12));g.addColorStop(1,S(.82));x.beginPath();x.ellipse(50,42,22,20,0,0,7);x.fillStyle=g;x.fill();
  x.beginPath();x.moveTo(34,48);x.quadraticCurveTo(36,70,50,72);x.quadraticCurveTo(64,70,66,48);x.closePath();x.fillStyle=S(.95);x.fill();
  // scales
  x.strokeStyle=S(.75);x.lineWidth=.9;for(let r=0;r<3;r++)for(let i=0;i<5;i++){x.beginPath();x.arc(38+i*6+(r%2)*3,30+r*5,2.6,0,Math.PI);x.stroke()}
  // brow ridges and eyes
  poly(x,[[32,40],[46,38],[46,42],[34,44]],S(.7));poly(x,[[68,40],[54,38],[54,42],[66,44]],S(.7));
  [40,60].forEach(ex=>{x.save();x.shadowColor=L.eyeCol;x.shadowBlur=8;E(x,ex,45,3.6,2.4,L.eyeCol);x.restore();E(x,ex,45,.9,2.2,'#0a1a2a')});
  // nostrils and jaw
  E(x,46,62,1.4,1,'#0a1a1a');E(x,54,62,1.4,1,'#0a1a1a');x.strokeStyle='rgba(10,20,20,.8)';x.lineWidth=1.5;x.beginPath();x.moveTo(40,66);x.quadraticCurveTo(50,70,60,66);x.stroke();
  poly(x,[[43,66],[44.5,70],[46,66.5]],'#f4ecd8');poly(x,[[57,66],[55.5,70],[54,66.5]],'#f4ecd8');
  // crackling lightning on the jaw
  x.strokeStyle='#bfe8ff';x.lineWidth=1.4;x.save();x.shadowColor='#bfe8ff';x.shadowBlur=6;x.beginPath();x.moveTo(64,62);x.lineTo(70,66);x.lineTo(67,68);x.lineTo(74,74);x.stroke();x.restore();
}

function heroPortrait(k){if(LOOK[k])return P(128,x=>drawFace(x,LOOK[k]));const d=H[k];const {anc,cls}=parse(d.title);
  const skin=pick(SKIN[anc],k),hair=anc==='Moon Elf'?pick(['#d8e0f0','#2a2a4a'],k):pick(HAIR,k+'h');
  return P(128,x=>{bg(x,heroCol(d));humanoid(x,{anc,cls,skin,hair,crown:/Crown/.test(d.title)})})}
window.portraitFor=function(u){
  const k=u.key;
  if(typeof keyedCustomArt==='function'){
    let fk=null, full=false;
    if(k==='dane'&&(u.sz>1||u.questDone)){fk='dane_form';full=true;}
    else if(k==='pillar'&&(u.sz>1||u.questDone)){fk='pillar_form';full=true;}
    else if(k==='arthur'&&u.questDone){fk='arthur_form';}
    else if(k==='jamison'&&u.questDone){fk='jamison_quest';}
    else if(k==='saint'&&u.questDone){fk='saint_quest';}
    else if(k==='kaska'&&u.beast&&u.beast.hp>0){fk='kaska_form';full=true;}
    if(fk&&keyedCustomArt('forms',fk)){
      if(!PORTRAIT[fk]&&typeof tokenCanvas==='function')PORTRAIT[fk]=tokenCanvas(k,full?144:128,{form:fk,fullBody:full});
      if(PORTRAIT[fk])return PORTRAIT[fk];
    }
    if(H[k]&&keyedCustomArt('heroes',k)){
      if(!PORTRAIT[k]&&typeof tokenCanvas==='function')PORTRAIT[k]=tokenCanvas(k,128);
      if(PORTRAIT[k])return PORTRAIT[k];
    }
  }
  if(!H[k]&&typeof getCustomImage==='function'){
    const custom=getCustomImage('enemies',k);
    if(custom)return custom;
  }
  if(PORTRAIT[k])return PORTRAIT[k];
  let c;
  if(H[k])c=heroPortrait(k);
  else if(k==='defender')c=P(128,x=>{bg(x,'#4f6a86');construct(x)});
  else if(ENEMY[k])c=P(128,x=>{bg(x,E_BG[k]||'#4a2224');ENEMY[k](x)});
  else c=P(128,x=>{bg(x,'#3a2224');goblinoid(x,{skin:'#7aa04a'})});
  return PORTRAIT[k]=c;
};
const E_BG={adept:'#4a1e10',conjurer:'#2a1e3a',caller:'#1e2a16',flameskull:'#12301a',necromancer:'#4a1a1e',owlbear:'#3a2a1a',blight:'#1e2a16',chief:'#4a2a1a',captain:'#3a2a2a',zombie:'#2a3028',ashzombie:'#34322e',nezznar:'#3a1a4a',klarg:'#5a2a1e',glasstaff:'#2a3a5a',skeleton:'#2a3030',spider:'#2a1a22'};
const URLS={};
window.portraitURL=function(k){
  if(typeof assetURL==='function'){
    const cu=assetURL(H[k]?'heroes':'enemies',k);
    if(cu)return cu;
  }
  if(!URLS[k])try{URLS[k]=portraitFor({key:k}).toDataURL()}catch(e){URLS[k]=''}return URLS[k]
};
window.heroLook=k=>{const p=parse(H[k].title);return p.anc+' '+p.cls};
})();

/* the rig placeholder, wrapped so its names stay private */
const drawFigure=(()=>{
/* placeholder figures for heroes with no art yet: the rig from source-0.9/rig/figure-rig-test.html */
/* ================= rig data ================= */
const BODIES={
 'm-avg':   {lab:'Masculine, average',short:'Masc. average',sh:58,ch:56,wa:44,hp:46,arm:15,fore:12,th:18,sn:13,hd:30,nk:13,tor:70,ua:40,fa:38,tl:50,sl:48},
 'm-large': {lab:'Masculine, large',  short:'Masc. large',  sh:92,ch:98,wa:102,hp:78,arm:27,fore:22,th:31,sn:23,hd:31,nk:25,tor:78,ua:40,fa:38,tl:40,sl:39},
 'm-svelte':{lab:'Masculine, svelte', short:'Masc. svelte', sh:52,ch:44,wa:32,hp:35,arm:11,fore:9,th:14,sn:10,hd:27,nk:9,tor:80,ua:47,fa:45,tl:62,sl:60},
 'f-avg':   {lab:'Feminine, average', short:'Fem. average', sh:46,ch:46,wa:32,hp:54,arm:12,fore:10,th:17,sn:12,hd:28,nk:10,tor:66,ua:38,fa:36,tl:50,sl:48},
 'f-large': {lab:'Feminine, large',   short:'Fem. large',   sh:72,ch:82,wa:76,hp:92,arm:23,fore:18,th:29,sn:21,hd:29,nk:19,tor:70,ua:38,fa:36,tl:41,sl:40},
 'f-svelte':{lab:'Feminine, svelte',  short:'Fem. svelte',  sh:42,ch:39,wa:26,hp:43,arm:9,fore:8, th:12,sn:9,hd:26,nk:8, tor:74,ua:45,fa:43,tl:62,sl:60},
};
/* angles in degrees: 0 points straight down, positive swings toward screen right */
const POSES={
 sword:{lab:'Sword & shield',armL:[-16,100],armR:[24,78],legL:[-14,-5],legR:[16,5],foreR:1,shield:1},
 bow:  {lab:'Bow',armL:[-82,-88],armR:[118,-80],legL:[-20,-10],legR:[18,8],foreR:1.15,quiver:1},
};
/* headpieces carry layering rules */
const HEADS={
 none:{lab:'None',hair:false,ears:false,face:false},
 hood:{lab:'Hood',hair:true,ears:true,face:'shadow'},
 helm:{lab:'Full helm',hair:true,ears:true,face:true},
};
const PIG=['#b5341f','#2c4f8f','#3f7f6b','#d6a531','#b07a35','#8e2a3b','#e9e1cf','#2a2420','#5d6e2f','#5a3d26','#6c7480','#4b3a6b','#c96f2d','#7d8a5a','#a9aeb3'];
const SKINS=['#f1d3b3','#e2b48c','#c68b5e','#9c6440','#6e442c','#4a2e20'];
const HAIRS=['#1f1a17','#4a2c1a','#8a4a22','#c9562a','#d8b46a','#d9d4c8'];
const METALS=['#a9aeb3','#8d939a','#c9a24a','#b0754a','#5d636b'];

let S={body:'m-avg',pose:'sword',shield:'heater',head:'none',hair:'short',beard:'long',symbol:'sun',place:'shield',cape:true,pauldron:false,
 col:{skin:'#d9a982',hair:'#c9562a',cloth:'#2c4f8f',cloak:'#2a2420',trim:'#b5341f',metal:'#a9aeb3',leather:'#6b4a2c',accent:'#d6a531'}};
let SIL=false;

/* ================= drawing helpers ================= */
const INK='#2a1c12';
const R=d=>d*Math.PI/180;
const dir=a=>[Math.sin(R(a)),Math.cos(R(a))];
const add=(p,d,l)=>[p[0]+d[0]*l,p[1]+d[1]*l];
const LX=-0.6,LY=-0.8;
function rgb(h){const n=parseInt(h.slice(1),16);return[n>>16,(n>>8)&255,n&255]}
function shade(h,k){const c=rgb(h).map(v=>Math.max(0,Math.min(255,Math.round(k>=1?v+(255-v)*(k-1)*1.4:v*k))));return`rgb(${c[0]},${c[1]},${c[2]})`}
const F=(c,k=1)=>SIL?INK:shade(c,k);
function path(g,pts){g.beginPath();pts.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath()}
function poly(g,pts,fill){path(g,pts);g.fillStyle=fill;g.fill()}
function ngon(g,p,r,n=6,rot=0){const pts=[];for(let i=0;i<n;i++){const a=rot+i/n*Math.PI*2;pts.push([p[0]+Math.cos(a)*r,p[1]+Math.sin(a)*r])}return pts}
/* a polygon with a dark base and a lit plane on the side facing the light (upper left) */
function faceted(g,pts,col,sx,lo=.8,hi=1.08,tilt=4){
  poly(g,pts,F(col,lo));if(SIL)return;
  let y0=Infinity,y1=-Infinity,x0=Infinity;pts.forEach(p=>{y0=Math.min(y0,p[1]);y1=Math.max(y1,p[1]);x0=Math.min(x0,p[0])});
  g.save();path(g,pts);g.clip();poly(g,[[x0-50,y0-5],[sx+tilt,y0-5],[sx-tilt,y1+5],[x0-50,y1+5]],F(col,hi));g.restore();
}
/* a limb segment: tapered quad split down its length into a lit and a shaded facet */
function seg(g,a,b,wa,wb,col,base=1){
  const dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy)||1,nx=-dy/L,ny=dx/L;
  const A1=[a[0]+nx*wa/2,a[1]+ny*wa/2],B1=[b[0]+nx*wb/2,b[1]+ny*wb/2],A2=[a[0]-nx*wa/2,a[1]-ny*wa/2],B2=[b[0]-nx*wb/2,b[1]-ny*wb/2];
  const lit=(nx*LX+ny*LY)>0;
  poly(g,[A1,B1,B2,A2],F(col,base*.8));
  poly(g,lit?[A1,B1,b,a]:[a,b,B2,A2],F(col,base*1.08));
}
function joint(g,p,r,col,base=1){poly(g,ngon(g,p,r,6,.3),F(col,base*.9))}

/* ================= symbols ================= */
function symbol(g,kind,x,y,s,col,bg){
  if(kind==='none'||SIL)return;g.save();const c=shade(col,1),b=bg;
  if(kind==='sun'){poly(g,ngon(g,[x,y],s*.42,10),c);for(let i=0;i<8;i++){const a=i/8*Math.PI*2,w=.2;poly(g,[[x+Math.cos(a-w)*s*.56,y+Math.sin(a-w)*s*.56],[x+Math.cos(a)*s*.98,y+Math.sin(a)*s*.98],[x+Math.cos(a+w)*s*.56,y+Math.sin(a+w)*s*.56]],c)}}
  if(kind==='moon'){path(g,ngon(g,[x,y],s*.8,14));g.clip();g.beginPath();g.rect(x-s,y-s,2*s,2*s);const q=ngon(g,[x+s*.36,y-s*.16],s*.68,14);q.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.fillStyle=c;g.fill('evenodd')}
  if(kind==='tree'){g.fillStyle=c;g.fillRect(x-s*.09,y+s*.2,s*.18,s*.7);[[-.75,.38],[-.4,.3],[-.05,.22]].forEach(([dy,w],i)=>poly(g,[[x,y+s*(dy-.32)],[x+s*w*2,y+s*(dy+.42)],[x-s*w*2,y+s*(dy+.42)]],c))}
  if(kind==='skull'){poly(g,ngon(g,[x,y-s*.15],s*.62,8,Math.PI/8),c);g.fillStyle=c;g.fillRect(x-s*.32,y+s*.3,s*.64,s*.38);g.fillStyle=b;
    poly(g,ngon(g,[x-s*.25,y-s*.12],s*.17,6),b);poly(g,ngon(g,[x+s*.25,y-s*.12],s*.17,6),b);poly(g,[[x,y+s*.12],[x-s*.08,y+s*.28],[x+s*.08,y+s*.28]],b);
    for(let i=-1;i<=1;i++)g.fillRect(x+i*s*.16-s*.025,y+s*.42,s*.05,s*.26)}
  if(kind==='star'){const pts=[];for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2?s*.4:s*.95;pts.push([x+Math.cos(a)*r,y+Math.sin(a)*r])}poly(g,pts,c)}
  if(kind==='hammer'){g.fillStyle=c;g.fillRect(x-s*.08,y-s*.35,s*.16,s*1.2);poly(g,[[x-s*.62,y-s*.75],[x+s*.62,y-s*.75],[x+s*.55,y-s*.3],[x-s*.55,y-s*.3]],c)}
  g.restore();
}

/* ================= the figure ================= */
const CX=145,GY=285,BOXW=280,BOXH=300;
function layout(sp){
  const B=BODIES[sp.body],P=POSES[sp.pose];
  const lv=a=>B.tl*Math.cos(R(a[0]))+B.sl*Math.cos(R(a[1]));
  const hipY=GY-5-Math.max(lv(P.legL),lv(P.legR)),shY=hipY-B.tor;
  const hw=B.hd*.8,hh=B.hd*1.1,hcy=shY-5-hh*.5;
  return{B,P,hipY,shY,hw,hh,hcy};
}
function drawFigure(g,sp){
  const {B,P,hipY,shY,hw,hh,hcy}=layout(sp),C=sp.col,H=HEADS[sp.head],cx=CX;
  const hasShield=!!P.shield,place=hasShield?sp.place:'tabard';
  const hairOn=!H.hair;

  // ground shadow
  g.fillStyle='rgba(42,28,18,.17)';g.beginPath();g.ellipse(cx,GY,Math.max(B.hp,B.sh)*.75+22,8,0,0,7);g.fill();

  // cape, behind everything
  if(sp.cape){
    const pts=[[cx-B.sh/2+3,shY+1],[cx+B.sh/2-3,shY+1],[cx+B.hp/2+8,hipY+18],[cx+B.hp/2+2,GY-30],[cx+6,GY-38],[cx-6,GY-22],[cx-24,GY-42],[cx-40,GY-30],[cx-66,GY-66],[cx-B.sh/2-16,hipY-6]];
    faceted(g,pts,C.cloak,cx-30,.72,.98,10);
  }
  // quiver, behind the body
  if(P.quiver){
    const a=[cx+B.sh*.22,shY-18],b=[cx+B.sh*.44+6,shY+44];
    seg(g,a,b,12,11,C.leather,.8);
    for(let i=0;i<3;i++){const p=[a[0]-4+i*4,a[1]-2];poly(g,[[p[0]-2.6,p[1]+2],[p[0]+2.6,p[1]+2],[p[0]+1.5,p[1]-8],[p[0]-1.5,p[1]-8]],F(C.accent,i%2?.85:1.05))}
  }
  // long hair hangs behind the shoulders
  if(hairOn&&sp.hair==='long')faceted(g,[[cx-hw/2-5,hcy-hh*.35],[cx+hw/2+5,hcy-hh*.35],[cx+hw/2+8,shY+20],[cx+hw*.1,shY+25],[cx-hw/2-8,shY+20]],C.hair,cx-4,.7,.9);

  // legs
  const hipL=[cx-B.hp/2+B.th/2+1,hipY],hipR=[cx+B.hp/2-B.th/2-1,hipY];
  const leg=(hip,a,s)=>{
    const k=add(hip,dir(a[0]),B.tl),an=add(k,dir(a[1]),B.sl);
    seg(g,hip,k,B.th,B.th*.84,C.leather);joint(g,k,B.th*.42,C.leather);
    seg(g,k,an,B.sn+1,B.sn*.85,C.leather);
    const bt=add(k,dir(a[1]),B.sl*.4);seg(g,bt,an,B.sn+4,B.sn+2,C.leather,.62);
    poly(g,[[an[0]-s*6,an[1]-4],[an[0]+s*5,an[1]-5],[an[0]+s*15,an[1]+5],[an[0]-s*7,an[1]+5]],F(C.leather,.5));
  };
  leg(hipL,P.legL,-1);leg(hipR,P.legR,1);

  // tunic skirt
  const bot=hipY+B.tl*.4;
  faceted(g,[[cx-B.hp/2-1,hipY-8],[cx+B.hp/2+1,hipY-8],[cx+B.hp/2+8,bot],[cx+B.hp*.15,bot+4],[cx-B.hp*.18,bot-2],[cx-B.hp/2-8,bot]],C.cloth,cx,.72,.98);
  // torso
  const t=B.tor;
  const torso=[[cx-B.sh/2,shY],[cx+B.sh/2,shY],[cx+B.ch/2,shY+t*.3],[cx+B.wa/2,shY+t*.66],[cx+B.hp/2,hipY],[cx-B.hp/2,hipY],[cx-B.wa/2,shY+t*.66],[cx-B.ch/2,shY+t*.3]];
  faceted(g,torso,C.cloth,cx+2,.8,1.06);
  if(!SIL)poly(g,[[cx-B.sh/2,shY],[cx+B.sh/2,shY],[cx+2,shY+t*.3]],F(C.cloth,1.16));
  // tabard
  if(place==='tabard'){
    faceted(g,[[cx-B.ch*.2,shY+3],[cx+B.ch*.2,shY+3],[cx+B.hp*.22,bot],[cx,bot+7],[cx-B.hp*.22,bot]],C.trim,cx,.82,1.05,2);
    symbol(g,sp.symbol,cx,shY+t*.4,B.ch*.1+7,C.accent,F(C.trim,.9));
  }
  // belt
  poly(g,[[cx-B.hp/2-1,hipY-12],[cx+B.hp/2+1,hipY-12],[cx+B.hp/2+2,hipY-4],[cx-B.hp/2-2,hipY-4]],F(C.leather,.6));
  poly(g,ngon(g,[cx,hipY-8],3.8,6),F(C.metal,1.1));
  // neck
  seg(g,[cx,shY+4],[cx,hcy+hh*.3],B.nk,B.nk*.9,C.skin,.92);
  // hood mantle sits over the shoulders
  if(sp.head==='hood')faceted(g,[[cx-hw/2-5,hcy+hh*.2],[cx+hw/2+5,hcy+hh*.2],[cx+B.sh/2+3,shY+9],[cx+B.sh*.25,shY+22],[cx,shY+17],[cx-B.sh*.25,shY+22],[cx-B.sh/2-3,shY+9]],C.cloak,cx,.78,1.02);

  // head
  if(!H.ears){
    poly(g,[[cx-hw/2+1,hcy-2],[cx-hw/2-4,hcy-1],[cx-hw/2-3,hcy+7],[cx-hw/2+1,hcy+6]],F(C.skin,.85));
    poly(g,[[cx+hw/2-1,hcy-2],[cx+hw/2+4,hcy-1],[cx+hw/2+3,hcy+7],[cx+hw/2-1,hcy+6]],F(C.skin,.72));
  }
  const covered=sp.head==='helm';
  const top=covered?[[cx-hw/2-2,hcy+hh*.5],[cx+hw/2+2,hcy+hh*.5]]:[[cx-hw/2-1,hcy+hh*.04],[cx-hw*.3,hcy+hh*.24],[cx+hw*.3,hcy+hh*.24],[cx+hw/2+1,hcy+hh*.04]];
  const beard=()=>{
    if(sp.beard==='short')faceted(g,[...top,[cx+hw*.4,hcy+hh*.62],[cx,hcy+hh*.76],[cx-hw*.4,hcy+hh*.62]].sort(()=>0),C.hair,cx,.82,1.05);
    if(sp.beard==='long')faceted(g,[...top,[cx+hw*.42,shY+6],[cx+hw*.12,shY+32],[cx-hw*.04,shY+25],[cx-hw*.2,shY+36],[cx-hw*.42,shY+6]],C.hair,cx,.82,1.05);
    if(sp.beard!=='none'&&sp.head==='none'&&!SIL){g.fillStyle=shade(C.hair,.45);g.fillRect(cx-3,hcy+hh*.3,6,1.6)}
  };
  if(sp.head==='none'){
    const hp=[[cx-hw/2,hcy-hh*.42],[cx-hw*.25,hcy-hh*.52],[cx+hw*.25,hcy-hh*.52],[cx+hw/2,hcy-hh*.42],[cx+hw/2+1,hcy+hh*.08],[cx+hw*.32,hcy+hh*.44],[cx,hcy+hh*.54],[cx-hw*.32,hcy+hh*.44],[cx-hw/2-1,hcy+hh*.08]];
    faceted(g,hp,C.skin,cx+2,.84,1.05,1);
    beard();
    if(!SIL){poly(g,[[cx+.5,hcy+2],[cx+3.5,hcy+9],[cx,hcy+9]],F(C.skin,.7));
      g.fillStyle='#1e1510';g.fillRect(cx-hw*.24-1.5,hcy+.5,3,2.6);g.fillRect(cx+hw*.2-1.5,hcy+.5,3,2.6);}
    // hair, front
    const cap=[[cx-hw/2-2,hcy+1],[cx-hw/2-2,hcy-hh*.4],[cx-hw*.2,hcy-hh*.62],[cx+hw*.3,hcy-hh*.58],[cx+hw/2+2,hcy-hh*.38],[cx+hw/2+2,hcy-2],[cx+hw*.38,hcy-hh*.24],[cx-hw*.05,hcy-hh*.32],[cx-hw*.4,hcy-hh*.18]];
    if(sp.hair==='short')faceted(g,cap,C.hair,cx-2,.82,1.08);
    if(sp.hair==='long'){faceted(g,cap,C.hair,cx-2,.82,1.08);
      poly(g,[[cx-hw/2-3,hcy-hh*.3],[cx-hw/2+3,hcy-hh*.3],[cx-hw/2+2,hcy+hh*.62],[cx-hw/2-5,hcy+hh*.72]],F(C.hair,1));
      poly(g,[[cx+hw/2+3,hcy-hh*.3],[cx+hw/2-3,hcy-hh*.3],[cx+hw/2-2,hcy+hh*.62],[cx+hw/2+5,hcy+hh*.72]],F(C.hair,.8));}
    if(sp.hair==='topknot'){faceted(g,[[cx-hw/2-1,hcy-hh*.2],[cx-hw*.25,hcy-hh*.56],[cx+hw*.25,hcy-hh*.56],[cx+hw/2+1,hcy-hh*.2],[cx+hw*.2,hcy-hh*.36],[cx-hw*.2,hcy-hh*.36]],C.hair,cx,.82,1.08);
      faceted(g,ngon(g,[cx+1,hcy-hh*.74],hh*.17,6,.4),C.hair,cx,.82,1.1,1);poly(g,[[cx-3,hcy-hh*.6],[cx+5,hcy-hh*.6],[cx+5,hcy-hh*.54],[cx-3,hcy-hh*.54]],F(C.trim,1))}
    if(sp.hair==='bald'&&!SIL)poly(g,[[cx-hw*.4,hcy-hh*.36],[cx-hw*.05,hcy-hh*.5],[cx-hw*.2,hcy-hh*.28]],F(C.skin,1.18));
  }
  if(sp.head==='hood'){
    faceted(g,[[cx-hw/2-6,hcy+hh*.55],[cx-hw/2-7,hcy-hh*.25],[cx-hw*.15,hcy-hh*.7],[cx+hw*.3,hcy-hh*.98],[cx+hw/2+6,hcy-hh*.3],[cx+hw/2+6,hcy+hh*.55]],C.cloak,cx,.8,1.04,3);
    poly(g,[[cx-hw*.4,hcy-hh*.32],[cx+hw*.36,hcy-hh*.36],[cx+hw*.42,hcy+hh*.3],[cx+hw*.1,hcy+hh*.52],[cx-hw*.3,hcy+hh*.48],[cx-hw*.45,hcy+hh*.25]],F(C.cloak,.32));
    beard();
    if(!SIL){g.fillStyle=shade(C.skin,1.05);g.fillRect(cx-hw*.24-1.4,hcy+1,2.8,1.8);g.fillRect(cx+hw*.18-1.4,hcy+1,2.8,1.8)}
  }
  if(sp.head==='helm'){
    beard();
    faceted(g,[[cx-hw/2-3,hcy+hh*.58],[cx-hw/2-4,hcy-hh*.3],[cx-hw*.28,hcy-hh*.6],[cx+hw*.28,hcy-hh*.6],[cx+hw/2+4,hcy-hh*.3],[cx+hw/2+3,hcy+hh*.58]],C.metal,cx+1,.74,1.1,1);
    if(!SIL){seg(g,[cx,hcy-hh*.6],[cx,hcy+hh*.52],2.4,2.4,C.metal,1.25);
      g.fillStyle='#17100b';g.fillRect(cx-hw*.44,hcy-1.5,hw*.38,2.8);g.fillRect(cx+hw*.06,hcy-1.5,hw*.38,2.8);
      for(let i=0;i<3;i++)for(let j=0;j<2;j++)g.fillRect(cx+hw*.14+i*3.2,hcy+hh*.2+j*3.4,1.4,1.4);}
    faceted(g,[[cx-3,hcy-hh*.58],[cx+3,hcy-hh*.6],[cx+14,hcy-hh*1.2],[cx+27,hcy-hh*1.02],[cx+31,hcy-hh*.8],[cx+12,hcy-hh*.82]],C.trim,cx+12,.82,1.08,6);
  }

  // arms
  const shL=[cx-B.sh/2+B.arm*.45,shY+B.arm*.45],shR=[cx+B.sh/2-B.arm*.45,shY+B.arm*.45];
  const arm=(sh,a,fm=1)=>{const el=add(sh,dir(a[0]),B.ua),h=add(el,dir(a[1]),B.fa*fm);
    seg(g,sh,el,B.arm,B.arm*.85,C.cloth);joint(g,el,B.arm*.42,C.cloth,.95);
    seg(g,el,h,B.fore,B.fore*.85,C.skin);seg(g,add(el,dir(a[1]),B.fa*fm*.55),h,B.fore+2.5,B.fore+1.5,C.leather,.75);return h};
  const hand=h=>faceted(g,ngon(g,h,B.fore*.55+1.5,6,.2),C.skin,h[0],.82,1.05,1);
  const pauldron=(sh,s)=>{if(!sp.pauldron)return;const a=B.arm;
    faceted(g,[[sh[0]-s*a*.7,sh[1]-a*.8],[sh[0]+s*a*.85,sh[1]-a*.5],[sh[0]+s*a*1.1,sh[1]+a*.75],[sh[0]-s*a*.15,sh[1]+a*.95],[sh[0]-s*a*.9,sh[1]+a*.2]],C.metal,sh[0],.76,1.12,2)};
  if(sp.pose==='sword'){
    const hL=arm(shL,P.armL);hand(hL);pauldron(shL,-1);
    // shield
    const w=44+B.sh*.12,h=w*1.22,x=hL[0]-3,y=hL[1]+2;
    let outer,inner;
    if(sp.shield==='heater'){const f=(k)=>[[x-w*k/2,y-h*k*.45],[x+w*k/2,y-h*k*.45],[x+w*k/2,y+h*k*.05],[x+w*k*.2,y+h*k*.4],[x,y+h*k*.55],[x-w*k*.2,y+h*k*.4],[x-w*k/2,y+h*k*.05]];outer=f(1);inner=f(.84)}
    else{outer=ngon(g,[x,y],w*.56,12,Math.PI/12);inner=ngon(g,[x,y],w*.47,12,Math.PI/12)}
    faceted(g,outer,C.metal,x,.7,1.05,6);faceted(g,inner,C.trim,x,.8,1.06,6);
    if(sp.symbol!=='none')symbol(g,sp.symbol,x,y-(sp.shield==='heater'?h*.04:0),w*.26,C.accent,F(C.trim,.85));
    else if(sp.shield==='round')faceted(g,ngon(g,[x,y],w*.11,6),C.metal,x,.8,1.15,1);
    const hR=arm(shR,P.armR);pauldron(shR,1);
    // sword
    const d=dir(150),n=[-d[1],d[0]];
    poly(g,ngon(g,add(hR,d,-11),3.6,6),F(C.metal,1));
    seg(g,add(hR,d,-9),add(hR,d,7),4.6,4.6,C.leather,.7);
    const gd=add(hR,d,8);seg(g,add(gd,n,-12),add(gd,n,12),4,4,C.metal,.95);
    const tipBase=add(hR,d,72);seg(g,add(hR,d,10),tipBase,7,5.5,C.metal,1.05);
    poly(g,[add(tipBase,n,2.75),add(tipBase,n,-2.75),add(hR,d,82)],F(C.metal,1.05));
    hand(hR);
  } else {
    const hL=arm(shL,P.armL);pauldron(shL,-1);
    const G=hL,pts=[];for(let i=-4;i<=4;i++){const t=i/4;pts.push([G[0]+20*t*t-1,G[1]+t*64])}
    for(let i=0;i<pts.length-1;i++){const wa=6.5-3.6*Math.abs((i-4)/4),wb=6.5-3.6*Math.abs((i-3)/4);seg(g,pts[i],pts[i+1],wa,wb,C.leather,1.18)}
    hand(G);
    const hR=arm(shR,P.armR,P.foreR);pauldron(shR,1);
    if(!SIL){g.strokeStyle='#e9e1cf';g.lineWidth=1.1;g.beginPath();g.moveTo(...pts[0]);g.lineTo(...hR);g.lineTo(...pts[8]);g.stroke()}
    const ux=G[0]-hR[0],uy=G[1]-hR[1],ul=Math.hypot(ux,uy),u=[ux/ul,uy/ul],tip=add(G,u,24);
    seg(g,hR,tip,2.2,2.2,C.leather,1.35);
    const nu=[-u[1],u[0]];poly(g,[add(tip,nu,3.4),add(tip,nu,-3.4),add(tip,u,9)],F(C.metal,1.05));
    const fb=add(hR,u,4);poly(g,[fb,add(add(fb,u,9),nu,4.5),add(fb,u,12)],F(C.accent,1.05));poly(g,[fb,add(add(fb,u,9),nu,-4.5),add(fb,u,12)],F(C.accent,.8));
    hand(hR);
  }
}



return drawFigure})();

/* ================= hero art registry =================
   Each file in heroes/ calls ART_REG(key, entry) with:
     image   : the approved image as a data URI (WebP, white background, as generated)
     framing : how the hero card and icon crop it {mode, tol, cz, cx, cy, iz, ix, iy}
     recipe  : the Character Art Generator recipe (settings and exact prompt)
     name    : display name, used for heroes that are not in data.js yet
     updated : date of the last change
   Files are written by tools/art_tool.py. */
const ART_DB={};
function ART_REG(key,entry){ART_DB[key]=entry}

