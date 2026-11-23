/* ================= BASEMENTS AND BASILISKS 0.9 TEST BUILD: engine (no DOM) ================= */
let UID=1;
const rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const d20=()=>rnd(1,20);
let COLS=12,ROWS=11;const TICK=0.05;


/* ---------- square battle map ----------
  .  floor        #  wall (blocks movement + sight)     O  pillar / tree (blocks movement + sight)
  ,  difficult terrain (brush, rubble, shallows): slow to cross
  ~  deep water   _  chasm: both block movement but not sight
  c  clutter (crates, tables, kegs): blocks movement, not sight; gives no cover by itself
  k  cover square (barricade, low wall, the nook behind an arrow slit): walkable; whoever stands on it has +2 Armor against shots from 2+ squares away
  a  arrow slit: blocks movement, not sight
  ^  fire: burns anyone who enters or stands in it
  w  web: anyone but spiders who enters is stuck for 1.2s; fire burns webs away
  x  powder barrel: blocks movement; any fire, or any area attack that touches it, sets it off
  d  doorway (floor)    P  party deployment (floor)
*/
const BLOCK_MOVE='#O~_cxa',BLOCK_LOS='#O';
const COVER_SQ='k',COVER_ARMOR=2;
let MAP=null,DEPLOY=[],LANES=[];
function loadMap(rows,lanes){
  MAP=rows.map(r=>r.split(''));ROWS=MAP.length;COLS=MAP[0].length;DEPLOY=[];
  MAP.forEach((row,r)=>row.forEach((t,c)=>{if(t==='P'){DEPLOY.push({c,r});row[c]='.'}}));
  LANES=(lanes&&lanes.length)?lanes.map((l,idx)=>({idx,...l})):[{idx:0,id:'center',n:'Center',c0:0,c1:COLS-1,obj:'breach'}];
}
function mirrorMap(rows){return rows.map(r=>r.split('').reverse().join(''))}
function mirrorLanes(lanes,cols){
  if(!lanes||!lanes.length)return [];
  const w=cols||COLS;
  return lanes.slice().reverse().map((l,idx)=>({
    ...l,idx,
    c0:w-1-l.c1,c1:w-1-l.c0,
    n:l.n==='Left Flank'?'Right Flank':l.n==='Right Flank'?'Left Flank':l.n
  }));
}
function laneOfCol(c,lanes){
  const list=(lanes&&lanes.length)?lanes:LANES;
  if(!list||!list.length)return 0;
  for(let i=0;i<list.length;i++)if(c>=list[i].c0&&c<=list[i].c1)return i;
  let best=0,bd=99;
  for(let i=0;i<list.length;i++){
    const mid=(list[i].c0+list[i].c1)/2;
    const d=Math.abs(c-mid);
    if(d<bd){bd=d;best=i}
  }
  return best;
}
function laneOfUnit(u,lanes){
  if(!u||u.c==null)return 0;
  const cx=u.c+(szOf(u)-1)/2;
  return laneOfCol(cx,lanes);
}
function laneDeployCells(laneIdx,lanes){
  const list=(lanes&&lanes.length)?lanes:LANES;
  const L=list&&list[laneIdx];
  if(!L)return DEPLOY.slice();
  return DEPLOY.filter(h=>h.c>=L.c0&&h.c<=L.c1);
}
const inb=h=>h.c>=0&&h.c<COLS&&h.r>=0&&h.r<ROWS;
const tile=h=>MAP&&inb(h)?MAP[h.r][h.c]:'#';
const passable=h=>inb(h)&&!BLOCK_MOVE.includes(tile(h));
/* 0.20: Large units take a 2×2 footprint anchored at (c,r). Distance is measured between the nearest squares. */
const szOf=u=>(u&&u.sz)||1;
function hd(a,b){const as=szOf(a),bs=szOf(b);if(as===1&&bs===1)return Math.max(Math.abs(a.c-b.c),Math.abs(a.r-b.r));
  const dx=Math.max(0,b.c-(a.c+as-1),a.c-(b.c+bs-1)),dy=Math.max(0,b.r-(a.r+as-1),a.r-(b.r+bs-1));return Math.max(dx,dy)}
const covers=(u,h)=>h.c>=u.c&&h.c<u.c+szOf(u)&&h.r>=u.r&&h.r<u.r+szOf(u);
const fpCells=(h,s)=>{const o=[];for(let i=0;i<s;i++)for(let j=0;j<s;j++)o.push({c:h.c+i,r:h.r+j});return o};
const DIRS=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
function nbrs(h){return DIRS.map(([dc,dr])=>({c:h.c+dc,r:h.r+dr})).filter(inb)}
function walkNbrs(h){return DIRS.filter(([dc,dr])=>!(dc&&dr)||(passable({c:h.c+dc,r:h.r})&&passable({c:h.c,r:h.r+dr}))).map(([dc,dr])=>({c:h.c+dc,r:h.r+dr})).filter(passable)}
function losLine(a,b,ox,oy){const n=Math.max(1,Math.ceil(Math.hypot(b.c-a.c,b.r-a.r)*4));
  for(let i=1;i<n;i++){const t=i/n;const c=Math.round(a.c+(b.c-a.c)*t+ox),r=Math.round(a.r+(b.r-a.r)*t+oy);
    if((c===a.c&&r===a.r)||(c===b.c&&r===b.r))continue;if(BLOCK_LOS.includes(tile({c,r})))return false}return true}
function los(a,b){if(hd(a,b)<=1)return true;return losLine(a,b,.01,.013)||losLine(a,b,-.01,-.013)}
function lineHexes(a,b,L){const dx=b.c-a.c,dy=b.r-a.r;const m=Math.max(Math.abs(dx),Math.abs(dy))||1;const out=[];
  for(let i=1;i<=L;i++){const h={c:Math.round(a.c+dx/m*i),r:Math.round(a.r+dy/m*i)};if(!inb(h)||BLOCK_LOS.includes(tile(h)))break;out.push(h)}return out}
const onHigh=u=>false; // high ground is out of the game for now
const rngOf=u=>u.rng;
/* cover comes only from standing on a marked cover square, against any shot from 2 or more squares away */
const onCover=h=>false; // cover is out of the game for now: walls, chokepoints and sightlines do the work
function coverVal(src,t){return 0}
function hasCover(src,t){return coverVal(src,t)>0}
const key=h=>h.c+','+h.r;

