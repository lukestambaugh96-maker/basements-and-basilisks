/* ================= 0.9 board renderer (adapted from 0.8) ================= */
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const SQ3=Math.sqrt(3);
const BAND_COL={'-1':{stroke:'#c0504a',fill:'#2b1416',text:'#ff9c94',name:'Fumble'},0:{stroke:'#7d9cc0',fill:'#1b2533',text:'#d6e6f7',name:'Low'},1:{stroke:'#4fe08a',fill:'#123522',text:'#eafff1',name:'Mid'},2:{stroke:'#ffc23d',fill:'#4a2e05',text:'#fff3cf',name:'High'}};
const TYPE_COL={fire:'#ff7a3a',cold:'#8fd0ff',lightning:'#b7a6ff',thunder:'#9fb3ff',radiant:'#ffe27a',necrotic:'#9be38a',psychic:'#f08ad8',force:'#c8b8ff',slashing:'#e6e1d3',piercing:'#c6e39a',bludgeoning:'#d8b88a',acid:'#a8ff6a'};
const BANDC=['#4b5d6e','#3f8a62','#c4952c'];

let B=null,running=false,paused=false,simAcc=0,slowUntil=0,shake=0,FX=[],lastFrame=0,resultShown=false,_resTimer=0,drag=null,hoverHex=null;
const view={R:40,w:0,h:0,pad:8};
const canvas=$('board'),ctx=canvas.getContext('2d');
/* ---------- sound ---------- */
const SND={ctx:null,last:0,n:0,
  init(){try{if(!this.ctx){const A=window.AudioContext||window.webkitAudioContext;if(A)this.ctx=new A()}if(this.ctx&&this.ctx.state==='suspended')this.ctx.resume()}catch(e){}},
  ok(){if(!S.sound||!this.ctx)return false;const t=performance.now();if(t-this.last>90){this.last=t;this.n=0}return ++this.n<=4},
  tone(f,d=.08,type='triangle',v=.05,delay=0,slide=0){try{const t=this.ctx.currentTime+delay;const o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(40,f*slide),t+d);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+.006);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g).connect(this.ctx.destination);o.start(t);o.stop(t+d+.02)}catch(e){}},
  roll(band,streak,nat20,enemy){
    if(!this.ok())return;
    if(enemy){this.tone(band===2?180:140,.07,'square',.02);return}
    if(nat20){[523,659,784,1047,1319].forEach((f,i)=>this.tone(f,.16,'square',.05,i*.05));return}
    if(band===-1){this.tone(160,.25,'triangle',.06,0,.5);return}
    if(band===0){this.tone(330,.05,'triangle',.03);return}
    if(band===1){this.tone(523,.07,'triangle',.04);this.tone(784,.08,'triangle',.035,.04);return}
    const k=Math.pow(2,Math.min(24,(streak||1)-1)/12);[660,880,1100].forEach((f,i)=>this.tone(f*k,.11,'square',.04,i*.035));
  },
  boom(){if(!S.sound||!this.ctx)return;this.tone(70,.45,'sawtooth',.09,0,.35);this.tone(140,.3,'square',.05,.02,.4)},
  hit(big){if(!this.ok())return;this.tone(big?85:130,big?.2:.08,'sawtooth',big?.07:.035,0,.5)},
  /* filtered noise burst: the body of swishes, thuds and flames */
  noise(d=.12,v=.05,type='bandpass',f=1800,f2=0,q=1,delay=0){try{const c=this.ctx,t=c.currentTime+delay;if(!this.nb){const n=c.sampleRate*.6;this.nb=c.createBuffer(1,n,c.sampleRate);const a=this.nb.getChannelData(0);for(let i=0;i<n;i++)a[i]=Math.random()*2-1}
    const s=c.createBufferSource();s.buffer=this.nb;const fl=c.createBiquadFilter();fl.type=type;fl.Q.value=q;fl.frequency.setValueAtTime(f,t);if(f2)fl.frequency.exponentialRampToValueAtTime(f2,t+d);
    const g=c.createGain();g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+.008);g.gain.exponentialRampToValueAtTime(.0001,t+d);s.connect(fl);fl.connect(g);g.connect(c.destination);s.start(t);s.stop(t+d+.02)}catch(e){}},
  atk(kind,big){if(!this.ok())return;const v=big?1.5:1;
    switch(kind){
      case 'slash':this.noise(.11,.05*v,'bandpass',5200,1400,2);break;
      case 'blunt':this.tone(95,.13,'sine',.09*v,0,.55);this.noise(.06,.04*v,'lowpass',500);break;
      case 'pierce':this.noise(.05,.045*v,'highpass',3000);this.tone(900,.04,'triangle',.02*v,.01,.6);break;
      case 'arrow':this.noise(.1,.035*v,'bandpass',2600,5200,3);this.tone(170,.05,'triangle',.05*v,.09,.7);break;
      case 'fire':this.noise(.3,.06*v,'lowpass',2400,300,.7);this.tone(110,.22,'sawtooth',.03*v,0,.6);break;
      case 'cold':this.tone(1760,.16,'sine',.03*v,0,1.4);this.tone(2637,.12,'sine',.02*v,.03);this.noise(.1,.02*v,'highpass',6000);break;
      case 'lightning':this.tone(1400,.14,'square',.035*v,0,.12);this.noise(.12,.05*v,'highpass',3500);break;
      case 'thunder':this.tone(60,.4,'sawtooth',.08*v,0,.5);this.noise(.3,.05*v,'lowpass',400,120);break;
      case 'radiant':this.tone(1047,.22,'sine',.04*v);this.tone(1568,.26,'sine',.03*v,.04);this.tone(2093,.2,'sine',.02*v,.08);break;
      case 'necrotic':this.tone(98,.3,'sawtooth',.045*v,0,.7);this.tone(104,.3,'sawtooth',.035*v,0,.7);break;
      case 'poison':this.tone(300,.14,'triangle',.035*v,0,.6);this.noise(.12,.025*v,'bandpass',900,300,4);break;
      case 'heal':this.tone(660,.14,'sine',.03);this.tone(880,.16,'sine',.03,.07);this.tone(1320,.2,'sine',.02,.14);break;
      default:this.tone(700,.1,'triangle',.03*v,0,1.3);this.tone(1050,.1,'sine',.02*v,.03)}},
  click(){if(!S.sound||!this.ctx)return;this.noise(.04,.03,'highpass',2500);this.tone(240,.05,'triangle',.03,0,.7)},
};

/* ---------- layout ---------- */
function resize(){
  const wrap=$('boardWrap');const W=Math.max(280,wrap.clientWidth);
  view.T=Math.max(24,Math.min(92,Math.floor((W-view.pad*2)/COLS),Math.floor(((window.innerHeight||900)-150-view.pad*2)/ROWS)));view.R=view.T*.62;
  view.w=view.T*COLS+view.pad*2;view.h=view.T*ROWS+view.pad*2;
  const dpr=window.devicePixelRatio||1;canvas.width=view.w*dpr;canvas.height=view.h*dpr;canvas.style.width=view.w+'px';canvas.style.height=view.h+'px';ctx.setTransform(dpr,0,0,dpr,0,0);mapDirty=true;
}
function center(c,r){return {x:view.pad+(c+.5)*view.T,y:view.pad+(r+.5)*view.T}}
const ucenter=u=>{const k=(szOf(u)-1)/2;return center(u.c+k,u.r+k)};
function hexAt(px,py){const c=Math.floor((px-view.pad)/view.T),r=Math.floor((py-view.pad)/view.T);return inb({c,r})?{c,r}:null}

/* ---------- battle-map tiles ---------- */
const THEME={
  forest:{floor:'#4b5a33',floor2:'#55663a',grid:'rgba(20,30,10,.35)',wall:'#2a2a20',rough:'#6a7a3a',edge:'#7a8a4a'},
  cave:{floor:'#4a443d',floor2:'#544d44',grid:'rgba(0,0,0,.3)',wall:'#1c1916',rough:'#6a6258',edge:'#6e655a'},
  tavern:{floor:'#6a4a2c',floor2:'#74522f',grid:'rgba(30,15,5,.35)',wall:'#2a1d14',rough:'#8a6a44',edge:'#8a6040'},
  dungeon:{floor:'#4e4b47',floor2:'#58544f',grid:'rgba(0,0,0,.3)',wall:'#201e1e',rough:'#6e6a64',edge:'#706a62'},
  hells:{floor:'#362426',floor2:'#422a2c',grid:'rgba(255,120,60,.18)',wall:'#1a0f12',rough:'#5c2c24',edge:'#8f3824'},
};
const th=()=>THEME[(ENC[S.enc]||{}).theme]||THEME.dungeon;
function rng32(c,r,k=0){let h=(c*73856093)^(r*19349663)^(k*83492791);h=(h^(h>>>13))*1274126177;return ((h^(h>>>16))>>>0)/4294967296}
function drawTile(g,t,c,r,x,y,T,TH){
  const R=(k)=>rng32(c,r,k);
  const theme=(ENC[S.enc]||{}).theme||'dungeon';
  const floor=()=>{g.fillStyle=R(1)<.5?TH.floor:TH.floor2;g.fillRect(x,y,T,T);
    if(theme==='tavern'){g.strokeStyle='rgba(30,15,5,.35)';g.lineWidth=1;for(let i=1;i<3;i++){g.beginPath();g.moveTo(x,y+i*T/3);g.lineTo(x+T,y+i*T/3);g.stroke()}g.beginPath();g.moveTo(x+T*R(2),y);g.lineTo(x+T*R(2),y+T/3);g.stroke()}
    else if(theme==='dungeon'){g.strokeStyle='rgba(0,0,0,.18)';g.strokeRect(x+3,y+3,T-6,T-6)}
    else if(theme==='hells'){g.strokeStyle='rgba(255,95,40,.14)';g.lineWidth=1;g.beginPath();g.moveTo(x+T*R(3),y);g.lineTo(x+T*R(4),y+T*.6);g.lineTo(x+T*R(5),y+T);g.stroke()}
    else{g.fillStyle='rgba(0,0,0,.08)';for(let i=0;i<3;i++){g.beginPath();g.arc(x+T*R(10+i),y+T*R(20+i),T*.08,0,7);g.fill()}}};
  if(t==='#'){g.fillStyle=TH.wall;g.fillRect(x,y,T,T);g.fillStyle=theme==='hells'?'rgba(255,90,40,.08)':'rgba(255,255,255,.035)';for(let i=0;i<4;i++)g.fillRect(x+T*R(30+i)*.7,y+T*R(40+i)*.8,T*.3,T*.18);return}
  if(t==='~'){const gr=g.createLinearGradient(x,y,x,y+T);if(theme==='hells'){gr.addColorStop(0,'#241a32');gr.addColorStop(1,'#140d20')}else{gr.addColorStop(0,'#2a5a78');gr.addColorStop(1,'#1f4660')}g.fillStyle=gr;g.fillRect(x,y,T,T);g.strokeStyle=theme==='hells'?'rgba(190,140,255,.26)':'rgba(190,230,255,.28)';g.lineWidth=1.2;for(let i=0;i<2;i++){const yy=y+T*(.3+i*.38);g.beginPath();g.moveTo(x+T*.15,yy);g.quadraticCurveTo(x+T*.35,yy-T*.08,x+T*.5,yy);g.quadraticCurveTo(x+T*.65,yy+T*.08,x+T*.85,yy);g.stroke()}return}
  if(t==='_'){g.fillStyle=theme==='hells'?'#120506':'#060508';g.fillRect(x,y,T,T);if(theme==='hells'){g.fillStyle='rgba(255,80,20,.16)';g.fillRect(x+T*.15,y+T*.15,T*.7,T*.7)}return}
  floor();
  switch(t){
    case ',':{if(theme==='forest'){g.fillStyle='#2f4a22';for(let i=0;i<5;i++){const px=x+T*(.15+.7*R(50+i)),py=y+T*(.25+.65*R(60+i));g.beginPath();g.moveTo(px-T*.08,py);g.lineTo(px,py-T*.2);g.lineTo(px+T*.08,py);g.fill()}}
      else{for(let i=0;i<6;i++){g.fillStyle=i%2?TH.rough:'rgba(0,0,0,.35)';g.beginPath();g.ellipse(x+T*(.15+.7*R(50+i)),y+T*(.15+.7*R(60+i)),T*.09,T*.06,R(70+i)*3,0,7);g.fill()}}break}
    case 'O':{if(theme==='forest'){g.fillStyle='rgba(0,0,0,.35)';g.beginPath();g.ellipse(x+T*.56,y+T*.6,T*.46,T*.4,0,0,7);g.fill();
        [[.5,.45,.42,'#1f3a1a'],[.42,.38,.3,'#2c5226'],[.58,.36,.2,'#3a6a30']].forEach(([a,b2,rr,cl])=>{g.fillStyle=cl;g.beginPath();g.arc(x+T*a,y+T*b2,T*rr,0,7);g.fill()})}
      else{g.fillStyle='rgba(0,0,0,.4)';g.beginPath();g.arc(x+T*.55,y+T*.56,T*.38,0,7);g.fill();const gr=g.createRadialGradient(x+T*.4,y+T*.38,T*.05,x+T*.5,y+T*.5,T*.38);if(theme==='hells'){gr.addColorStop(0,'#6a3832');gr.addColorStop(1,'#241214')}else{gr.addColorStop(0,'#9a948a');gr.addColorStop(1,'#4a463f')}g.fillStyle=gr;g.beginPath();g.arc(x+T*.5,y+T*.5,T*.36,0,7);g.fill()}break}
    case 'c':{if(theme==='tavern'){g.fillStyle='rgba(0,0,0,.35)';g.fillRect(x+T*.14,y+T*.22,T*.78,T*.66);g.fillStyle='#8a5a30';g.fillRect(x+T*.1,y+T*.16,T*.78,T*.64);g.strokeStyle='#4a2e16';g.lineWidth=2;g.strokeRect(x+T*.1,y+T*.16,T*.78,T*.64);g.beginPath();g.moveTo(x+T*.1,y+T*.48);g.lineTo(x+T*.88,y+T*.48);g.stroke()}
      else if(theme==='forest'&&R(5)<.6){g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(x+T*.52,y+T*.58,T*.44,T*.26,.3,0,7);g.fill();g.fillStyle='#6a4a30';g.beginPath();g.ellipse(x+T*.5,y+T*.52,T*.42,T*.24,.3,0,7);g.fill();g.fillStyle='#4a3220';g.beginPath();g.arc(x+T*.2,y+T*.4,T*.12,0,7);g.fill()}
      else{g.fillStyle='rgba(0,0,0,.35)';g.fillRect(x+T*.16,y+T*.18,T*.74,T*.74);g.fillStyle=theme==='hells'?'#5a2a24':'#9a7040';g.fillRect(x+T*.12,y+T*.12,T*.72,T*.72);g.strokeStyle='#3a1e18';g.lineWidth=2;g.strokeRect(x+T*.12,y+T*.12,T*.72,T*.72);g.beginPath();g.moveTo(x+T*.12,y+T*.12);g.lineTo(x+T*.84,y+T*.84);g.moveTo(x+T*.84,y+T*.12);g.lineTo(x+T*.12,y+T*.84);g.stroke()}break}
    case 'k':{const up=r>=ROWS/2;const by=up?y+T*.06:y+T*.74;g.fillStyle='rgba(0,0,0,.35)';g.fillRect(x+T*.08,by+T*.05,T*.88,T*.2);g.fillStyle='#8f8672';g.fillRect(x+T*.05,by,T*.9,T*.2);g.strokeStyle='#4d4638';g.lineWidth=1.5;g.strokeRect(x+T*.05,by,T*.9,T*.2);[.35,.65].forEach(q=>{g.beginPath();g.moveTo(x+T*q,by);g.lineTo(x+T*q,by+T*.2);g.stroke()});
      g.fillStyle='rgba(150,205,255,.16)';g.fillRect(x,y,T,T);g.strokeStyle='rgba(170,215,255,.55)';g.lineWidth=1.5;g.setLineDash([4,3]);g.strokeRect(x+2,y+2,T-4,T-4);g.setLineDash([]);break}
    case 'h':{g.fillStyle='rgba(255,236,190,.2)';g.fillRect(x,y,T,T);g.fillStyle='rgba(255,255,240,.18)';g.fillRect(x,y,T,T*.12);g.fillStyle='rgba(0,0,0,.28)';g.fillRect(x,y+T*.86,T,T*.14);
      g.fillStyle='rgba(255,232,170,.75)';g.beginPath();g.moveTo(x+T*.78,y+T*.14);g.lineTo(x+T*.9,y+T*.34);g.lineTo(x+T*.66,y+T*.34);g.closePath();g.fill();break}
    case '^':{g.fillStyle=theme==='hells'?'rgba(220,65,15,.82)':'rgba(20,8,0,.6)';g.beginPath();g.arc(x+T/2,y+T/2,T*.42,0,7);g.fill();if(theme==='hells'){g.fillStyle='#ffb84a';g.beginPath();g.arc(x+T/2,y+T/2,T*.22,0,7);g.fill()}else if(theme==='dungeon'||theme==='cave'){g.strokeStyle='#8a6a3a';g.lineWidth=3;g.beginPath();g.arc(x+T/2,y+T/2,T*.36,0,7);g.stroke()}break}
    case 'v':{/* 0.15 tall brush: dense grass tufts */g.fillStyle='rgba(20,40,12,.35)';g.fillRect(x,y,T,T);
      for(let i=0;i<9;i++){const px=x+T*(.08+.84*R(80+i)),py=y+T*(.3+.65*R(90+i)),h=T*(.22+.18*R(100+i));g.fillStyle=i%3?'#2f5a22':'#4a7a30';
        g.beginPath();g.moveTo(px-T*.06,py);g.lineTo(px-T*.01,py-h);g.lineTo(px+T*.02,py-h*.9);g.lineTo(px+T*.06,py);g.fill()}break}
    case 'w':{g.strokeStyle='rgba(235,235,245,.6)';g.lineWidth=1;const cx=x+T/2,cy=y+T/2;for(let i=0;i<8;i++){const a=i/8*Math.PI*2+R(9);g.beginPath();g.moveTo(cx,cy);g.lineTo(cx+Math.cos(a)*T*.55,cy+Math.sin(a)*T*.55);g.stroke()}
      for(let k=1;k<=3;k++){g.beginPath();for(let i=0;i<=8;i++){const a=i/8*Math.PI*2+R(9);const px=cx+Math.cos(a)*T*.15*k,py=cy+Math.sin(a)*T*.15*k;i?g.lineTo(px,py):g.moveTo(px,py)}g.stroke()}break}
    case 'a':{g.fillStyle='#4a4642';g.fillRect(x,y,T,T);g.fillStyle='rgba(255,255,255,.06)';g.fillRect(x,y,T,T*.2);g.fillStyle='#0c0a0a';g.fillRect(x+T*.44,y+T*.12,T*.12,T*.76);g.fillRect(x+T*.3,y+T*.42,T*.4,T*.1);g.strokeStyle='#2a2622';g.lineWidth=1;g.strokeRect(x+.5,y+.5,T-1,T-1);break}
    case 'x':{g.fillStyle='rgba(0,0,0,.4)';g.beginPath();g.arc(x+T*.55,y+T*.56,T*.36,0,7);g.fill();g.fillStyle='#8a5a2a';g.beginPath();g.arc(x+T*.5,y+T*.5,T*.34,0,7);g.fill();g.strokeStyle='#3a2a1a';g.lineWidth=2;[.34,.22].forEach(rr=>{g.beginPath();g.arc(x+T*.5,y+T*.5,T*rr,0,7);g.stroke()});
      g.fillStyle='#c0302a';g.font=`900 ${Math.round(T*.3)}px 'Alegreya Sans',sans-serif`;g.textAlign='center';g.textBaseline='middle';g.fillText('!',x+T*.5,y+T*.52);break}
  }
}
function buildLayer(){
  const dpr=window.devicePixelRatio||1;const c=document.createElement('canvas');c.width=view.w*dpr;c.height=view.h*dpr;const g=c.getContext('2d');g.scale(dpr,dpr);
  const TH=th(),T=view.T;g.fillStyle=TH.wall;g.fillRect(0,0,view.w,view.h);
  const encObj=ENC[S.enc]||{};
  const customMap=typeof getCustomImage==='function'&&(getCustomImage('maps',encObj.threat||S.enc)||getCustomImage('maps',encObj.theme));
  if(customMap){
    g.drawImage(customMap,view.pad,view.pad,COLS*T,ROWS*T);
    // Keep non-floor tactical obstacles readable over custom map art
    for(let r=0;r<ROWS;r++)for(let cc=0;cc<COLS;cc++){const t=MAP[r][cc];if(t==='.'||t==='d')continue;const x=view.pad+cc*T,y=view.pad+r*T;g.save();g.globalAlpha=.68;drawTile(g,t,cc,r,x,y,T,TH);g.restore()}
  }else{
    for(let r=0;r<ROWS;r++)for(let cc=0;cc<COLS;cc++){const x=view.pad+cc*T,y=view.pad+r*T;drawTile(g,MAP[r][cc],cc,r,x,y,T,TH)}
  }
  // grid lines over walkable ground, like a battle mat
  g.strokeStyle=customMap?'rgba(255,244,210,.22)':TH.grid;g.lineWidth=1;
  for(let r=0;r<ROWS;r++)for(let cc=0;cc<COLS;cc++){const t=MAP[r][cc];if('#_~'.includes(t))continue;g.strokeRect(view.pad+cc*T+.5,view.pad+r*T+.5,T,T)}
  // wall edges, cliff edges, chasm lips
  for(let r=0;r<ROWS;r++)for(let cc=0;cc<COLS;cc++){const t=MAP[r][cc];const x=view.pad+cc*T,y=view.pad+r*T;
    [[0,-1,x,y,x+T,y],[0,1,x,y+T,x+T,y+T],[-1,0,x,y,x,y+T],[1,0,x+T,y,x+T,y+T]].forEach(([dc,dr,x1,y1,x2,y2])=>{const n=tile({c:cc+dc,r:r+dr});
      if(t==='#'&&n!=='#'&&inb({c:cc+dc,r:r+dr})){g.strokeStyle=TH.edge;g.lineWidth=3;g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke()}
      if(t==='h'&&n!=='h'&&n!=='#'&&inb({c:cc+dc,r:r+dr})){g.strokeStyle=dr>0||dc>0?'rgba(20,10,0,.75)':'rgba(255,236,190,.8)';g.lineWidth=3;g.setLineDash([]);g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();g.setLineDash([])}
      if(t==='_'&&n!=='_'&&n!=='#'&&inb({c:cc+dc,r:r+dr})){g.strokeStyle='rgba(0,0,0,.9)';g.lineWidth=4;g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke()}
      if(t==='d'&&n==='#'){g.strokeStyle='#8a6040';g.lineWidth=4;g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke()}
    })}
  // v0.24 Soft-Lane visual bands & crossover bridge guides
  if(typeof LANES!=='undefined'&&LANES&&LANES.length>1){
    LANES.forEach((L,idx)=>{
      const def=(typeof LANE_OBJ!=='undefined'&&LANE_OBJ[L.obj])||{col:'#d6a531'};
      const lx=view.pad+L.c0*T,lw=(L.c1-L.c0+1)*T;
      g.save();
      g.fillStyle=def.col;g.globalAlpha=.065;
      g.fillRect(lx,view.pad,lw,ROWS*T);
      g.globalAlpha=.34;g.strokeStyle=def.col;g.lineWidth=2;
      g.setLineDash([6,4]);
      g.strokeRect(lx+1,view.pad+1,lw-2,ROWS*T-2);
      g.setLineDash([]);
      g.restore();
    });
    // Subtle open-bridge arrows on rear (r=0..1) and backline (r=8..9) crossover rows
    g.save();
    g.fillStyle='rgba(255,235,175,.10)';
    g.fillRect(view.pad,view.pad,COLS*T,T*1.0);
    g.fillRect(view.pad,view.pad+(ROWS-1)*T,COLS*T,T*1.0);
    g.restore();
  }
  mapLayer=c;mapDirty=false;
}
function tileIcon(t,theme){const c=document.createElement('canvas');c.width=c.height=44;const g=c.getContext('2d');const prev=S.enc;
  const ek=Object.keys(ENC).find(k=>ENC[k].theme===theme)||prev;S.enc=ek;drawTile(g,t,3,7,0,0,44,THEME[theme]);if(t==='^')drawFlame(g,22,22,44,performance.now()/1000);if(t==='h'){g.strokeStyle='rgba(255,236,190,.6)';g.setLineDash([3,3]);g.lineWidth=2;g.strokeRect(1,1,42,42)}S.enc=prev;return c.toDataURL()}
function drawFlame(g,x,y,T,now){for(let i=0;i<3;i++){const f=Math.sin(now*9+i*2.1+x)*.5+.5;const h=T*(.34+.12*f);g.beginPath();g.moveTo(x-T*(.2-i*.1)-T*.08,y+T*.2);g.quadraticCurveTo(x-T*(.2-i*.1),y-h*.4,x-T*(.2-i*.1)+T*.02,y+T*.2-h);g.quadraticCurveTo(x-T*(.2-i*.1)+T*.12,y-h*.3,x-T*(.2-i*.1)+T*.12,y+T*.2);g.fillStyle=['#ff6a1a','#ffa02a','#ffe07a'][i];g.globalAlpha=.85;g.fill();g.globalAlpha=1}}

/* ---------- drawing helpers ---------- */
function hexPath(x,y,R){ctx.beginPath();for(let i=0;i<6;i++){const a=Math.PI/180*(60*i-90);const px=x+R*Math.cos(a),py=y+R*Math.sin(a);i?ctx.lineTo(px,py):ctx.moveTo(px,py)}ctx.closePath()}
function drawD20(x,y,s,col,num,glow,alpha=1){
  ctx.save();ctx.globalAlpha=alpha;
  const V=[];for(let i=0;i<6;i++){const a=Math.PI/180*(60*i-90);V.push([x+s*Math.cos(a),y+s*Math.sin(a)])}
  const T=[-90,30,150].map(a=>{a=a*Math.PI/180;return [x+s*.56*Math.cos(a),y+s*.56*Math.sin(a)]});
  if(glow){ctx.shadowColor=col.stroke;ctx.shadowBlur=glow}
  ctx.beginPath();V.forEach((v,i)=>i?ctx.lineTo(v[0],v[1]):ctx.moveTo(v[0],v[1]));ctx.closePath();ctx.fillStyle=col.fill;ctx.fill();
  ctx.shadowBlur=0;ctx.lineWidth=Math.max(2,s*.09);ctx.strokeStyle=col.stroke;ctx.stroke();
  ctx.lineWidth=Math.max(1,s*.04);ctx.globalAlpha=alpha*.55;ctx.beginPath();
  ctx.moveTo(T[0][0],T[0][1]);ctx.lineTo(T[1][0],T[1][1]);ctx.lineTo(T[2][0],T[2][1]);ctx.closePath();
  [[0,[0,5,1]],[1,[1,2,3]],[2,[3,4,5]]].forEach(([ti,vs])=>vs.forEach(vi=>{ctx.moveTo(T[ti][0],T[ti][1]);ctx.lineTo(V[vi][0],V[vi][1])}));
  ctx.stroke();ctx.globalAlpha=alpha;
  ctx.font=`800 ${Math.round(s*(String(num).length>1?.78:.9))}px 'Alegreya Sans', system-ui, sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.lineWidth=Math.max(3,s*.14);ctx.strokeStyle='rgba(0,0,0,.75)';ctx.strokeText(num,x,y+s*.08);ctx.fillStyle=col.text;ctx.fillText(num,x,y+s*.08);
  ctx.restore();
}
function initials(n){return n.replace(/^(Sir|Brother|Sister|Old) /,'').replace(/,.*/,'').split(' ').filter(Boolean).slice(0,2).map(w=>w[0]).join('')}

/* ---------- events -> effects ---------- */
let HOVER_HERO=null,HOVER_ENEMY=null;
const unitById=id=>B&&B.units.find(u=>u.id===id);
const LUNGE=.2;
function unitRad(u){const T=view.T;return T*(szOf(u)>1?.78:u.boss?.39:u.elite?.37:.355)}
function tokenYOff(u,ghost){if(ghost||!B||u.alive===false)return 0;return view.T*(szOf(u)>1?.095:.088)}
/* cellPos returns the tile/footprint center (with melee lunge); pos returns the visual portrait center */
function cellPos(u){let x=u.px??ucenter(u).x,y=u.py??ucenter(u).y;
  if(u.lunge){const t=(performance.now()/1000-u.lunge.t0)/LUNGE;if(t>=1)u.lunge=null;else{const k=Math.sin(Math.PI*t)*view.R*.45;x+=u.lunge.dx*k;y+=u.lunge.dy*k}}
  return {x,y}}
function pos(u){const cp=cellPos(u);return {x:cp.x,y:cp.y+tokenYOff(u,false)}}
const PHYS={slashing:'slash',bludgeoning:'blunt',piercing:'pierce'};
function attackFx(e,u,areaSrc){ // u: the target
  const a=e.sid!==undefined?unitById(e.sid):null;const p=pos(u);const col=TYPE_COL[e.ty]||'#e6e1d3';const big=e.v+e.w>=40;
  const phys=PHYS[e.ty];const melee=e.near&&a;
  if(a&&a!==u&&melee){const pa=ucenter(a);const dx=p.x-pa.x,dy=p.y-pa.y,d=Math.hypot(dx,dy)||1;a.lunge={t0:performance.now()/1000,dx:dx/d,dy:dy/d};
    const ang=Math.atan2(dy,dx);
    if(phys==='blunt'||!phys)addFx({k:'impact',x:p.x,y:p.y,col,dur:.28});
    else if(phys==='pierce')addFx({k:'thrust',x:p.x,y:p.y,ang,col,dur:.22});
    else addFx({k:'slash',x:p.x,y:p.y,ang,col,dur:.26,flip:Math.random()<.5});
    if(!phys)addFx({k:'ring',x:p.x,y:p.y,col,dur:.35,max:view.R*.9});
    SND.atk(phys||e.ty,big);return}
  // from range: an arrow or bolt for weapons, a spell effect by damage type
  const fromArea=a&&areaSrc.has(a.id);
  if(a&&a!==u&&!fromArea){const pa=pos(a);
    if(phys){addFx({k:'proj',x1:pa.x,y1:pa.y,x2:p.x,y2:p.y,col:'#efe6cf',dur:.16,arrow:1});SND.atk('arrow',big)}
    else if(e.ty==='lightning'){addFx({k:'zap',x1:pa.x,y1:pa.y,x2:p.x,y2:p.y,col,dur:.28,seed:Math.random()*99});SND.atk('lightning',big)}
    else if(e.ty==='radiant'){addFx({k:'pillar',x:p.x,y:p.y,col,dur:.45});SND.atk('radiant',big)}
    else{addFx({k:'proj',x1:pa.x,y1:pa.y,x2:p.x,y2:p.y,col,dur:.2});SND.atk(e.ty,big)}}
  else SND.atk(phys?'blunt':e.ty,big);
  addFx({k:'burst',x:p.x,y:p.y,col,dur:.3,n:phys?4:7,seed:Math.random()*99});}
function addFx(o){o.t0=performance.now()/1000;FX.push(o)}
/* 0.14: quieter battle text. By default only big moments get words; statuses show on the tokens. "All text" brings every word back. */
let BTXT='key';try{BTXT=localStorage.getItem('bb.btext')||'key'}catch(e){}
const KEY_STATUS=/^(EXECUTED|GETS BACK UP|FALLS|DEATH WARD|IMMUNE|RAISED|CLINGS TO THE EDGE|CALL THE BROOD|HURLED THROUGH HELL|MISTY ESCAPE|SHADOWSTEP)/;
const _said={};
function sayOK(id,txt,gap){if(BTXT==='all')return true;const now=performance.now()/1000,k=id+'|'+txt;if(_said[k]&&now-_said[k]<gap)return false;
  if(FX.some(f=>f.big&&now-f.t0<.9))return false;_said[k]=now;return true}
function handleEvents(){
  const evs=B.events;B.events=[];
  const nowS=performance.now()/1000;
  const areaSrc=new Set(evs.filter(e=>e.k==='area'&&e.shape!=='single').map(e=>e.id));
  for(const e of evs){
    const u=e.id!==undefined?unitById(e.id):null;if(!u&&e.k!=='terrain'&&e.k!=='boom'&&e.k!=='overtime'&&e.k!=='wave'&&e.k!=='lane')continue;
    if(typeof pushBattleFeed==='function')pushBattleFeed(e,u);
    if(e.k==='roll'){
      const enemy=e.side==='E';
      const nat20=e.nat===20&&e.band===2&&/·/.test(e.name)===false;
      const off=FX.filter(x=>x.k==='d20'&&x.id===e.id&&nowS-x.t0<x.dur).length;
      u._rollPulse={t0:nowS,band:e.band,nat20,enemy};
      addFx({k:'d20',id:e.id,num:e.nat,band:e.band,nat20,enemy,name:e.name,follow:e.follow,off,streak:e.streak||0,crit:e.crit,dur:enemy?.65:nat20?1.65:e.band===2?1.25:e.band===1?.95:.75,ex:e.ex,ndice:e.ndice,total:e.total,encore:e.encore,forced:e.forced,still:e.still});
      SND.roll(e.band,e.streak,nat20,enemy);
      const loud=BTXT==='all';
      if(loud&&e.again&&!enemy){const p=pos(u);addFx({k:'num',x:p.x,y:p.y+view.T*.78,txt:`+${e.again} FOLLOW-UP${e.again>1?'S':''}`,col:'#ffe7a8',size:10,dur:1,up:-8})}
      if(loud&&e.luck&&!enemy){const p=pos(u);addFx({k:'num',x:p.x,y:p.y+view.T*.78,txt:'STROKE OF LUCK',col:'#c48fe6',size:10,dur:1,up:-8})}
      {const p=pos(u);if(e.crit)addFx({k:'num',x:p.x,y:p.y+view.T*.55,txt:'CRIT!',col:'#ff8a5a',size:15,dur:1,up:-10});else if(loud&&e.sneak)addFx({k:'num',x:p.x,y:p.y+view.T*.55,txt:'SNEAK ATTACK',col:'#c48fe6',size:11,dur:1,up:-10});if(loud&&e.mode&&!enemy)addFx({k:'num',x:p.x+view.T*.55,y:p.y-view.T*.75,txt:e.mode==='adv'?'ADV':'DIS',col:e.mode==='adv'?'#9be38a':'#ff9c94',size:10,dur:.9,up:-6})}
      if(!enemy&&e.band===2){const p=pos(u);addFx({k:'ring',x:p.x,y:p.y,col:'#ffc23d',dur:.55,max:view.T*(nat20?1.4:.95)});for(let i=0;i<(nat20?24:10+Math.min(12,e.streak*2));i++)addFx({k:'spark',x:p.x,y:p.y,vx:(Math.random()-.5)*220,vy:-Math.random()*200-30,col:nat20?(i%2?'#ff5a3a':'#fff1b0'):'#ffd36a',dur:.65+Math.random()*.35})}
      if(!enemy&&nat20){shake=Math.max(shake,7);slowUntil=performance.now()+360}
      if(e.streak>=2)addFx({k:'streak',n:e.streak,dur:1.5});
    }else if(e.k==='dmg'){
      if(e.v+e.w<=0)continue;const p=pos(u);const tot=e.v+e.w;
      // Health-bar hit-weight cues: smooth ghost trail, heavy-hit shake/flash, rapid multi-hit stack glow
      const prevHp=Math.min(u.maxHp,Math.max(0,u.hp)+e.v);
      u._trailHp=Math.max(u._trailHp??prevHp,prevHp);
      u._trailHold=nowS+(e.dot?.14:.26);
      const bigFrac=tot/Math.max(1,u.maxHp);
      if(nowS-(u._hitT||0)<.72)u._hitCombo=Math.min(12,(u._hitCombo||0)+1);else u._hitCombo=1;
      u._hitT=nowS;
      if(bigFrac>=.14||tot>=42){
        u._bigHitT=nowS;u._bigHitFrac=Math.min(1,bigFrac);
        addFx({k:'ring',x:p.x,y:p.y,col:e.src==='P'?'#ffd07a':'#ff6a5a',dur:.36,max:view.T*.72});
      }
      // Show floating numbers only on substantial hits (or always in 'All text' mode) to keep the board clean
      if(BTXT==='all'||bigFrac>=.11||tot>=22||e.blk){
        addFx({k:'num',x:p.x+(Math.random()-.5)*view.R*.5,y:p.y-view.T*.45,txt:e.blk?'⛨'+tot:String(tot),col:e.dot?'#c8a070':e.blk?'#a8b8cc':e.src==='P'?'#ff9678':'#ff5454',size:e.blk?12:Math.min(30,13+tot/6),dur:.82});
      }
      if(e.src==='P'&&(bigFrac>=.18||tot>=45)){shake=Math.max(shake,Math.min(6,tot/28));SND.hit(true)}
      if(!e.dot)attackFx(e,u,areaSrc);
      u.flash=nowS;
    }else if(e.k==='heal'){const p=pos(u);if(e.v&&e.sid!==undefined){const h=unitById(e.sid);if(h&&h!==u){const ph=pos(h);addFx({k:'beam',x1:ph.x,y1:ph.y,x2:p.x,y2:p.y,col:'#86e07e',w:3,dur:.32})}for(let i=0;i<6;i++)addFx({k:'mote',x:p.x+(Math.random()-.5)*view.R*1.2,y:p.y+view.R*.4,col:'#a8f0a0',dur:.6+Math.random()*.3});SND.atk('heal')}if(e.v&&(BTXT==='all'||e.v>=14))addFx({k:'num',x:p.x,y:p.y-view.T*.42,txt:'+'+e.v,col:'#86e07e',size:14,dur:.85});if(e.w&&(BTXT==='all'||e.w>=14))addFx({k:'num',x:p.x+10,y:p.y-view.T*.25,txt:'+'+e.w,col:'#8fb4e6',size:12,dur:.85})}
    else if(e.k==='ward'){const p=pos(u);addFx({k:'ring',x:p.x,y:p.y,col:'#79b8ff',dur:.38,max:view.T*.6});if(BTXT==='all'||e.v>=14)addFx({k:'num',x:p.x,y:p.y-view.T*.3,txt:'⛨'+e.v,col:'#8fb4e6',size:12,dur:.75})}
    else if(e.k==='callout'){if(typeof noteCallout==='function')noteCallout(e);if(!sayOK(e.id,e.txt,8))continue;const p=u?pos(u):{x:view.w/2,y:view.h/3};addFx({k:'num',x:p.x,y:p.y-view.T*.95,txt:e.txt,col:e.col,size:Math.max(14,Math.round(view.T*.26)),dur:1.55,up:-18,big:1})}
    else if(e.k==='status'){if(BTXT!=='all'&&!KEY_STATUS.test(e.txt||''))continue;const p=pos(u);addFx({k:'num',x:p.x,y:p.y+view.T*.65,txt:e.txt,col:e.col,size:11,dur:1.0,up:-10})}
    else if(e.k==='area'){
      const tg=unitById(e.tid);const ty=e.ty||'force';const col=TYPE_COL[ty]||'#e0b45a';
      const pu=pos(u), pt=tg?pos(tg):pu;
      const shape=e.shape||'nova';
      const cx=shape==='nova'?pu.x:pt.x, cy=shape==='nova'?pu.y:pt.y;
      const radPx=view.T*((e.r||1)+.55);
      // Ground-layer spell footprint showing exact area & damage type
      addFx({k:'spellArea',ground:1,shape,ty,col,x1:pu.x,y1:pu.y,x2:pt.x,y2:pt.y,cx,cy,r:radPx,seed:Math.random()*99,dur:shape==='line'?.6:.75});
      // Elemental motes/sparks over the affected area
      const nP=shape==='line'?8:Math.min(14,Math.max(6,Math.round((e.r||1)*5)));
      for(let i=0;i<nP;i++){
        const a=Math.random()*Math.PI*2, d=Math.random()*radPx*.85;
        const sx=shape==='line'?pu.x+(pt.x-pu.x)*Math.random():cx+Math.cos(a)*d;
        const sy=shape==='line'?pu.y+(pt.y-pu.y)*Math.random():cy+Math.sin(a)*d;
        addFx({k:'spark',x:sx,y:sy,vx:(Math.random()-.5)*90,vy:-40-Math.random()*110,col,dur:.45+Math.random()*.3});
      }
      (e.ids||[]).forEach(id=>{const x=unitById(id);if(x&&shape!=='single'){const p=pos(x);addFx({k:'ring',x:p.x,y:p.y,col,dur:.38,max:view.T*.58})}});
    }
    else if(e.k==='beam'){const tg=unitById(e.tid);if(tg){const a=pos(u),b2=pos(tg);const ty=e.ty||'force';addFx({k:ty==='lightning'?'zap':'beam',x1:a.x,y1:a.y,x2:b2.x,y2:b2.y,col:TYPE_COL[ty]||'#fff',w:ty==='radiant'?6:4.5,dur:.32,seed:Math.random()*99})}}
    else if(e.k==='terrain'){mapDirty=true}
    else if(e.k==='miss'){const p=pos(u);addFx({k:'num',x:p.x,y:p.y-view.T*.25,txt:'DODGE',col:'#8fd0ff',size:12,dur:.75,up:-16})}
    else if(e.k==='boom'){const p=center(e.c,e.r);mapDirty=true;shake=Math.max(shake,10);SND.boom();addFx({k:'spellArea',ground:1,shape:'splash',ty:'fire',col:'#ff7a2a',cx:p.x,cy:p.y,x1:p.x,y1:p.y,x2:p.x,y2:p.y,r:view.T*1.8,seed:Math.random()*99,dur:.75});for(let i=0;i<24;i++)addFx({k:'spark',x:p.x,y:p.y,vx:(Math.random()-.5)*400,vy:-Math.random()*300,col:i%3?'#ff8a2a':'#ffe07a',dur:.6+Math.random()*.5});addFx({k:'num',x:p.x,y:p.y-view.T*.4,txt:'BOOM',col:'#ffb04a',size:20,dur:1})}
    else if(e.k==='leap'){u.leap=nowS}
    else if(e.k==='die'){const p=pos(u);addFx({k:'ring',x:p.x,y:p.y,col:u.side==='P'?'#c0504a':'#888',dur:.5,max:view.T*.7})}
    else if(e.k==='overtime'){if(e.lvl>0){addFx({k:'num',x:view.w/2,y:view.pad+view.T*1.1,txt:e.lvl===1?'OVERTIME: FASTER AND DEADLIER':'OVERTIME ×'+e.lvl,col:'#ffd76a',size:16,dur:1.8,up:-6});SND.tone&&S.sound&&SND.ctx&&SND.tone(220,.3,'square',.04,0,1.5)}}
    else if(e.k==='wave'){addFx({k:'num',x:view.w/2,y:view.pad+view.T*1.1,txt:'REINFORCEMENTS',col:'#ff9c94',size:16,dur:1.6,up:-6})}
    else if(e.k==='spawn'){const p=ucenter(u);u.px=p.x;u.py=p.y;addFx({k:'ring',x:p.x,y:p.y,col:'#9be38a',dur:.6,max:view.T*.75})}
    else if(e.k==='lane'){
      const L=LANES&&LANES[e.lane];
      const cx=L?view.pad+((L.c0+L.c1+1)/2)*view.T:view.w/2;
      const cy=view.pad+view.T*2.2;
      addFx({k:'num',x:cx,y:cy,txt:e.txt||'LANE EVENT',col:e.col||'#ffd76a',size:Math.max(14,Math.round(view.T*.24)),dur:1.85,up:-16,big:1});
      if(e.win){SND.roll(2,2,false,false)}
      else{SND.tone&&S.sound&&SND.ctx&&SND.tone(155,.28,'sawtooth',.045,0,.65)}
      if(typeof renderLaneHeaders==='function')renderLaneHeaders();
    }
  }
}

/* ---------- draw ---------- */
function drawBoard(now){
  if(mapDirty||!mapLayer)buildLayer();
  ctx.fillStyle='#0b0a0d';ctx.fillRect(0,0,view.w,view.h);ctx.drawImage(mapLayer,0,0,view.w,view.h);
  const T=view.T;
  for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++)if(MAP[r][c]==='^'){const p=center(c,r);ctx.save();ctx.shadowColor='#ff7a2a';ctx.shadowBlur=14;drawFlame(ctx,p.x,p.y,T,now);ctx.restore()}
  if(!B){
    ctx.save();
    DEPLOY.forEach(h=>{const x=view.pad+h.c*T,y=view.pad+h.r*T;ctx.fillStyle='rgba(224,180,90,.16)';ctx.fillRect(x+1,y+1,T-2,T-2);ctx.strokeStyle='rgba(224,180,90,.42)';ctx.strokeRect(x+2.5,y+2.5,T-5,T-5)});
    // v0.23 Spatial Targeting Preview: highlight closest ally for Rosalind, Toot & Brother Jamison during deployment!
    const partyList = (S && S.party) ? S.party.filter(h => h.c != null && h.r != null) : [];
    partyList.forEach(h => {
      const def = H[h.key];
      if (!def || def.targetMode !== 'closest_ally') return;
      const others = partyList.filter(o => o !== h).sort((a, c) => hd(a, h) - hd(c, h));
      const tgt = others[0];
      if (!tgt) return;
      const p1 = center(h.c, h.r), p2 = center(tgt.c, tgt.r);
      const col = h.key === 'jamison' ? '#9be38a' : '#ffd76a';
      ctx.save();
      ctx.strokeStyle = col;
      ctx.lineWidth = 2.5;
      ctx.setLineDash([6, 4]);
      ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
      ctx.setLineDash([]);
      ctx.beginPath(); ctx.arc(p2.x, p2.y, T * .44, 0, Math.PI * 2); ctx.stroke();
      const mx = (p1.x + p2.x) / 2, my = (p1.y + p2.y) / 2 - 8;
      const lbl = h.key === 'jamison' ? 'BOND' : h.key === 'toot' ? 'MOTE' : 'INSPIRE';
      ctx.font = `800 ${Math.max(9, Math.round(T * .18))}px 'Alegreya Sans',sans-serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(20,14,10,.78)'; ctx.fillRect(mx - 22, my - 7, 44, 14);
      ctx.fillStyle = col; ctx.fillText(lbl, mx, my);
      ctx.restore();
    });
    ctx.restore();
  }
  // reinforcements: marked squares with a countdown
  {const ws=B?(B.waves||[]).filter(w=>!w.done):previewWaves();ctx.save();ws.forEach(w=>{const left=B?Math.max(0,w.at-B.time):w.at;w.u.forEach(([k,c,r])=>{const p=center(c,r);ctx.setLineDash([5,4]);ctx.lineWidth=2;ctx.strokeStyle='rgba(255,120,110,.85)';ctx.fillStyle='rgba(120,20,20,.35)';ctx.beginPath();ctx.arc(p.x,p.y,T*.38,0,7);ctx.fill();ctx.stroke();ctx.setLineDash([]);
      ctx.font=`800 ${Math.max(10,Math.round(T*.26))}px 'Alegreya Sans',sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#ffd0c8';ctx.fillText(left.toFixed(0)+'s',p.x,p.y+1)})});ctx.restore()}
  if(hoverHex&&!B){const x=view.pad+hoverHex.c*T,y=view.pad+hoverHex.r*T;ctx.strokeStyle=isDeploy(hoverHex)?'#e0b45a':'rgba(200,80,70,.7)';ctx.lineWidth=2;ctx.strokeRect(x+1,y+1,T-2,T-2)}
}

/* Ground-layer spell animations: translucent area footprints + elemental motifs drawn beneath units */
function drawGroundFx(now){
  for(const f of FX){
    if(!f.ground||f.k!=='spellArea')continue;
    const t=Math.max(0,(now-f.t0)/f.dur);
    if(t>=1)continue;
    const fade=t<.18?t/.18:1-(t-.18)/.82;
    const grow=ease(Math.min(1,t*2.4));
    ctx.save();
    if(f.shape==='cone'){
      const ang=Math.atan2(f.y2-f.y1,f.x2-f.x1);
      const spread=.62; // ~35 deg half-angle
      const rad=f.r*grow;
      ctx.beginPath();ctx.moveTo(f.x1,f.y1);ctx.arc(f.x1,f.y1,rad,ang-spread,ang+spread);ctx.closePath();
      const gr=ctx.createRadialGradient(f.x1,f.y1,rad*.1,f.x1,f.y1,rad);
      gr.addColorStop(0,'rgba(255,255,255,.32)');gr.addColorStop(.55,f.col);gr.addColorStop(1,'rgba(0,0,0,0)');
      ctx.globalAlpha=fade*.42;ctx.fillStyle=gr;ctx.fill();
      ctx.globalAlpha=fade*.88;ctx.strokeStyle=f.col;ctx.lineWidth=2.5;ctx.stroke();
      // Sweeping directional lines inside cone
      ctx.globalAlpha=fade*.65;ctx.strokeStyle='#fff';ctx.lineWidth=1.4;
      for(let i=-2;i<=2;i++){
        const a=ang+i*spread*.38;
        ctx.beginPath();ctx.moveTo(f.x1+Math.cos(a)*rad*.2,f.y1+Math.sin(a)*rad*.2);ctx.lineTo(f.x1+Math.cos(a)*rad*.92,f.y1+Math.sin(a)*rad*.92);ctx.stroke();
      }
    }else if(f.shape==='line'){
      const dx=f.x2-f.x1,dy=f.y2-f.y1,L=Math.hypot(dx,dy)||view.T*2;
      const nx=-dy/L,ny=dx/L,hw=view.T*.44;
      const ex=f.x1+dx*grow,ey=f.y1+dy*grow;
      ctx.beginPath();
      ctx.moveTo(f.x1+nx*hw,f.y1+ny*hw);ctx.lineTo(ex+nx*hw,ey+ny*hw);
      ctx.lineTo(ex-nx*hw,ey-ny*hw);ctx.lineTo(f.x1-nx*hw,f.y1-ny*hw);ctx.closePath();
      ctx.globalAlpha=fade*.34;ctx.fillStyle=f.col;ctx.fill();
      ctx.globalAlpha=fade*.85;ctx.strokeStyle=f.col;ctx.lineWidth=2;ctx.stroke();
      // Core elemental bolt
      ctx.globalAlpha=fade*.9;ctx.strokeStyle='#fff';ctx.lineWidth=3*(1-t*.5);ctx.beginPath();
      if(f.ty==='lightning'||f.ty==='thunder'){
        ctx.moveTo(f.x1,f.y1);
        for(let i=1;i<7;i++){const j=Math.sin(f.seed+i*13.7+Math.floor(t*6)*4.1)*43758.5453;const o=((j-Math.floor(j))-.5)*hw*1.4;ctx.lineTo(f.x1+(ex-f.x1)*i/7+nx*o,f.y1+(ey-f.y1)*i/7+ny*o)}
        ctx.lineTo(ex,ey);
      }else{ctx.moveTo(f.x1,f.y1);ctx.lineTo(ex,ey)}
      ctx.stroke();
    }else{
      // Circular AoE footprint (splash / nova)
      const rad=f.r*(.45+.55*grow);
      const gr=ctx.createRadialGradient(f.cx,f.cy,rad*.08,f.cx,f.cy,rad);
      gr.addColorStop(0,'rgba(255,255,255,.26)');gr.addColorStop(.6,f.col);gr.addColorStop(1,'rgba(0,0,0,0)');
      ctx.beginPath();ctx.arc(f.cx,f.cy,rad,0,Math.PI*2);
      ctx.globalAlpha=fade*.38;ctx.fillStyle=gr;ctx.fill();
      ctx.globalAlpha=fade*.85;ctx.strokeStyle=f.col;ctx.lineWidth=2.5*(1-t*.3);ctx.stroke();
      // Elemental motif inside footprint so damage type reads at a glance
      ctx.globalAlpha=fade*.58;ctx.strokeStyle=f.col;ctx.lineWidth=1.6;
      if(f.ty==='radiant'){
        // Sunburst rays
        for(let i=0;i<8;i++){const a=i*Math.PI/4+t*.6;ctx.beginPath();ctx.moveTo(f.cx+Math.cos(a)*rad*.25,f.cy+Math.sin(a)*rad*.25);ctx.lineTo(f.cx+Math.cos(a)*rad*.95,f.cy+Math.sin(a)*rad*.95);ctx.stroke()}
      }else if(f.ty==='fire'){
        // Concentric heat ring + ember arcs
        ctx.beginPath();ctx.arc(f.cx,f.cy,rad*.62,0,Math.PI*2);ctx.setLineDash([8,6]);ctx.stroke();ctx.setLineDash([]);
      }else if(f.ty==='poison'){
        // Bubbling spore rings
        for(let i=0;i<5;i++){const a=f.seed+i*1.26;const d=rad*(.32+.38*((i*.37+t)%1));ctx.beginPath();ctx.arc(f.cx+Math.cos(a)*d,f.cy+Math.sin(a)*d,view.T*.12*(1-t*.4),0,Math.PI*2);ctx.stroke()}
      }else if(f.ty==='necrotic'){
        // Dark swirling curse runes/tendrils
        for(let i=0;i<6;i++){const a=i*Math.PI/3-t*1.6;ctx.beginPath();ctx.arc(f.cx,f.cy,rad*.72,a,a+.45);ctx.stroke()}
      }else if(f.ty==='cold'){
        // 6-point crystal star
        for(let i=0;i<6;i++){const a=i*Math.PI/3;ctx.beginPath();ctx.moveTo(f.cx,f.cy);ctx.lineTo(f.cx+Math.cos(a)*rad*.88,f.cy+Math.sin(a)*rad*.88);ctx.stroke()}
      }else if(f.ty==='thunder'||f.ty==='lightning'){
        // Double shockwave rings
        ctx.beginPath();ctx.arc(f.cx,f.cy,rad*.58,0,Math.PI*2);ctx.stroke();
      }else if(f.ty==='slashing'||f.ty==='piercing'||f.ty==='bludgeoning'){
        // Sweeping steel arc
        ctx.strokeStyle='#efe6d4';ctx.lineWidth=3;ctx.beginPath();ctx.arc(f.cx,f.cy,rad*.82,-1.2+t*2.4,.6+t*2.4);ctx.stroke();
      }else{
        // Force / psychic inner ripple
        ctx.beginPath();ctx.arc(f.cx,f.cy,rad*.6,0,Math.PI*2);ctx.stroke();
      }
    }
    ctx.restore();
  }
}

function unitStatusTags(u){
  const s=u.st;if(!s)return [];
  const tags=[];
  if(s.stun>0)tags.push(['STUN','#ffd27a']);if(s.root>0)tags.push(['ROOT','#c8b48a']);if(s.taunt>0)tags.push(['TAUNT','#e0b45a']);
  if(s.burn>=1)tags.push(['BURN '+Math.round(s.burn),'#ff7a3a']);if(s.frz>=5)tags.push(['FRZ '+Math.round(s.frz),'#8fd0ff']);if(s.poison>0)tags.push(['PSN '+s.poison.toFixed(0),'#9be38a']);
  if(s.chg>=1)tags.push(['CHG '+Math.round(s.chg),'#b7a6ff']);if(s.acid>0)tags.push(['AC −'+s.acid,'#a8ff6a']);if(s.acBT>0)tags.push(['AC +'+s.acB,'#a8b8cc']);if(s.acS>0)tags.push(['AC +'+s.acS,'#a8b8cc']);
  if(u.hidden)tags.push(['HIDDEN','#c48fe6']);if(u.raging>0)tags.unshift(['RAGE','#ff6a4a']);if(s.charm>0)tags.unshift(['CHARM','#ff9cd0']);
  if(s.fear>0)tags.push(['FEAR','#d0a0ff']);if(s.stag>0)tags.push(['STAG','#ffb27a']);if(s.exp>0)tags.push(['EXP','#ff9cd0']);
  if(s.mark)tags.push(['MARK','#9fd86a']);if(s.hex)tags.push(['HEX','#c48fe6']);if(s.cut)tags.push(['CUT','#ff9c94']);if(u.insp)tags.push(['INSP','#ffd76a']);
  return tags;
}

function drawUnitToken(u,now,ghost,dt=0){
  if(u._hide&&!ghost)return;
  const T=view.T;
  const cp=cellPos(u);
  const p={x:cp.x,y:cp.y+tokenYOff(u,ghost)};
  const rad=unitRad(u);
  const veil=typeof B!=='undefined'&&B&&u.alive&&typeof inBrush==='function'&&inBrush(u)&&B.time>=(u._shown||0);
  const deadA=(u.alive===false?.22:1)*(u.isDouble?.64:u.hidden?.45:veil?.6:1);
  ctx.save();ctx.globalAlpha=deadA*(ghost?.55:1);
  const isP=u.side==='P';const d=isP?H[u.key]:null;
  const ring1=u.isDouble?'#c48fe6':u.minion?'#5d9a52':isP?ROLE_COL[u.role||d.role]:'#c0504a';
  const hovered=!ghost&&!u.isDouble&&((isP&&HOVER_HERO&&HOVER_HERO===u.key)||(!isP&&HOVER_ENEMY!=null&&(B?HOVER_ENEMY===u.id:HOVER_ENEMY===u.idx)));
  // Highlight beacon when hovered from side wing roster
  if(hovered&&u.alive!==false){
    const pulse=.5+.5*Math.sin(now*8);
    ctx.save();ctx.globalAlpha=.92;
    const hcol=isP?'#ffe082':'#ff7a6b';
    ctx.shadowColor=hcol;ctx.shadowBlur=16;ctx.strokeStyle=hcol;ctx.lineWidth=3;
    ctx.beginPath();ctx.arc(p.x,p.y,rad+Math.max(5,T*.075)+pulse*2.5,0,Math.PI*2);ctx.stroke();
    ctx.restore();
  }
  // Subtle band-colored outer rim glow when a hero rolls their d20
  if(u._rollPulse&&now-u._rollPulse.t0<1.05&&!u._rollPulse.enemy){
    const pt=(now-u._rollPulse.t0)/1.05;
    const rc=u._rollPulse.nat20?'#ff8a2a':BAND_COL[u._rollPulse.band].stroke;
    ctx.save();ctx.globalAlpha=(1-pt)*.9;ctx.shadowColor=rc;ctx.shadowBlur=16;ctx.strokeStyle=rc;ctx.lineWidth=3.5;
    ctx.beginPath();ctx.arc(p.x,p.y,rad+4.5+pt*3.5,0,Math.PI*2);ctx.stroke();ctx.restore();
  }
  if(u.flash&&now-u.flash<.12){ctx.shadowColor='#fff';ctx.shadowBlur=16}
  if(u.isDouble&&u.alive!==false){ctx.shadowColor='#c48fe6';ctx.shadowBlur=12}
  const rimW=Math.max(2.2,T*.034);
  ctx.beginPath();ctx.arc(p.x,p.y,rad+rimW,0,Math.PI*2);ctx.fillStyle=ring1;ctx.fill();ctx.shadowBlur=0;
  {const img=portraitFor(u);ctx.save();ctx.beginPath();ctx.arc(p.x,p.y,rad,0,Math.PI*2);ctx.clip();if(u.alive===false)ctx.filter='grayscale(1)';ctx.drawImage(img,p.x-rad,p.y-rad,rad*2,rad*2);ctx.restore();
   if(u.flash&&now-u.flash<.12){ctx.beginPath();ctx.arc(p.x,p.y,rad,0,Math.PI*2);ctx.fillStyle='rgba(255,255,255,.42)';ctx.fill()}
   if(!isP){ctx.beginPath();ctx.arc(p.x,p.y,rad,0,Math.PI*2);ctx.fillStyle='rgba(120,20,20,.1)';ctx.fill()}
   if(u.isDouble){ctx.beginPath();ctx.arc(p.x,p.y,rad,0,Math.PI*2);ctx.fillStyle='rgba(176,120,230,.32)';ctx.fill();ctx.beginPath();ctx.arc(p.x,p.y,rad+rimW+2.2,0,Math.PI*2);ctx.strokeStyle='#e2c6ff';ctx.setLineDash([4,3]);ctx.lineWidth=1.4;ctx.stroke();ctx.setLineDash([])}
   else if(u.minion){ctx.beginPath();ctx.arc(p.x,p.y,rad,0,Math.PI*2);ctx.fillStyle='rgba(60,140,60,.25)';ctx.fill()}}
  if(isP&&!B&&u.tier>1){ctx.font=`800 ${Math.max(10,Math.round(T*.18))}px 'Alegreya Sans',sans-serif`;ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.85)';const tx='T'+u.tier;ctx.strokeText(tx,p.x+rad*.8,p.y-rad*.68);ctx.fillStyle=TIER_COL[u.tier];ctx.fillText(tx,p.x+rad*.8,p.y-rad*.68)}
  if(B&&u.alive!==false&&!u.isDouble){
    // Attack timer (thin outer arc) and Ability Charge (crisp gold arc) kept neatly inside cell bounds
    const iv=attackIv(B,u);const frac=Math.min(1,u.t/iv);
    const atkR=rad+rimW+1.2;
    ctx.beginPath();ctx.arc(p.x,p.y,atkR,-Math.PI/2,-Math.PI/2+Math.PI*2*frac);ctx.strokeStyle=isP?'rgba(236,228,208,.55)':'rgba(220,110,100,.5)';ctx.lineWidth=1.5;ctx.stroke();
    if(u.abil){const cf=u.charge/100;const chgR=atkR+Math.max(2.4,T*.034);ctx.beginPath();ctx.arc(p.x,p.y,chgR,-Math.PI/2,-Math.PI/2+Math.PI*2*cf);ctx.strokeStyle=cf>=1?'#fff1b0':isP?'#e0b45a':'#e07a5a';ctx.lineWidth=Math.max(2.2,T*.034);ctx.stroke()}
  }
  if(isP&&!u.isDouble&&u.key===S.sel){ctx.beginPath();ctx.arc(p.x,p.y,rad+Math.max(6,T*.09),0,Math.PI*2);ctx.strokeStyle='#e0b45a';ctx.setLineDash([4,3]);ctx.lineWidth=1.5;ctx.stroke();ctx.setLineDash([])}
  if(!isP&&S.selE===u.idx&&!B){ctx.beginPath();ctx.arc(p.x,p.y,rad+Math.max(6,T*.09),0,Math.PI*2);ctx.strokeStyle='#ff9c94';ctx.setLineDash([4,3]);ctx.lineWidth=1.5;ctx.stroke();ctx.setLineDash([])}
  ctx.restore();
}

function drawUnitBadges(units,now){
  const T=view.T;
  const fz=Math.max(8,Math.round(T*.13));
  for(const u of units){
    if(u._hide||u.alive===false)continue;
    const p=pos(u),rad=unitRad(u),isP=u.side==='P';
    ctx.save();
    // Power-fantasy counter pill + compact status badges tucked along lower portrait rim (stays inside unit's own tile)
    const pills=[];
    if(u.isDouble)pills.push(['ILLUSION','#e2c6ff']);
    const ct=isP&&!u.minion?tokenCounter(u):null;
    if(ct)pills.push(ct);
    const tags=u.isDouble?[]:unitStatusTags(u);
    for(const t of tags){if(pills.length<2)pills.push(t)}
    if(pills.length){
      ctx.font=`800 ${fz}px 'Alegreya Sans',sans-serif`;
      const ph=fz+4,gap=3;
      const widths=pills.map(pl=>ctx.measureText(pl[0]).width+7);
      const totW=widths.reduce((a,b)=>a+b,0)+(pills.length-1)*gap;
      let cx=p.x-totW/2;
      const py=Math.min(cellPos(u).y+T*(szOf(u)>1?1:.5)-ph*.62-2.5,p.y+rad*.72);
      pills.forEach((pl,i)=>{
        const w=widths[i],bx2=cx+w/2;
        ctx.fillStyle='rgba(14,10,18,.9)';
        ctx.beginPath();ctx.roundRect?ctx.roundRect(cx,py-ph/2,w,ph,3.5):ctx.rect(cx,py-ph/2,w,ph);ctx.fill();
        ctx.strokeStyle=pl[1];ctx.lineWidth=1.1;ctx.stroke();
        ctx.fillStyle=pl[1];ctx.textAlign='center';ctx.textBaseline='middle';
        ctx.fillText(pl[0],bx2,py+.5);
        cx+=w+gap;
      });
      ctx.textBaseline='alphabetic';
    }
    ctx.restore();
  }
}

function drawUnitHealthBars(units,now,dt=0){
  const T=view.T,R=view.R;
  const bars=[];
  for(const u of units){
    if(u._hide||u.alive===false||u.isDouble)continue;
    // Smooth trailing damage decay for visual hit-weight feedback
    if(u._trailHp===undefined)u._trailHp=u.hp;
    if(u.hp>u._trailHp)u._trailHp=u.hp;
    else if(now>(u._trailHold||0)&&u._trailHp>u.hp){u._trailHp=Math.max(u.hp,u._trailHp-u.maxHp*.52*Math.max(.016,dt))}

    const cp=cellPos(u);
    const isLarge=szOf(u)>1;
    const bw=Math.max(T*.88,R*1.38)*(isLarge?1.72:1);
    const bh=Math.max(isLarge?11:8,Math.round(T*(isLarge?.155:.135)));
    const bigHitAge=u._bigHitT?now-u._bigHitT:99;
    const hitShake=bigHitAge<.24?Math.sin(bigHitAge*58)*(1-bigHitAge/.24)*2.6:0;
    const recentMulti=(u._hitCombo||0)>=3&&now-(u._hitT||0)<.45;
    const bx=Math.max(3,Math.min(view.w-bw-3,cp.x-bw/2+hitShake));
    const cellTop=cp.y-T*(isLarge?1:.5);
    const by=Math.max(2,cellTop+1.5);
    bars.push({u,bx,by,bw,bh,bigHitAge,recentMulti});
  }

  // Light collision-resolution pass so even mid-leap/mid-move bars never overlap each other
  bars.sort((a,b)=>a.by-b.by||a.bx-b.bx);
  for(let i=0;i<bars.length;i++){
    const cur=bars[i];
    for(let j=0;j<i;j++){
      const prev=bars[j];
      const padY=prev.u.beast?7:3;
      if(cur.bx<prev.bx+prev.bw+2&&cur.bx+cur.bw+2>prev.bx&&cur.by<prev.by+prev.bh+padY&&cur.by+cur.bh+3>prev.by){
        cur.by=Math.min(view.h-cur.bh-3,prev.by+prev.bh+padY);
      }
    }
  }

  for(const b of bars){
    const {u,bx,by,bw,bh,bigHitAge,recentMulti}=b;
    const isP=u.side==='P';
    const curHp=Math.max(0,u.hp);
    const curWard=Math.max(0,u.ward||0);
    const curNec=Math.max(0,u.nec||0);
    const totalCap=Math.max(u.maxHp,curHp+curWard);
    const hpW=bw*(curHp/totalCap);
    const trailW=bw*(Math.min(totalCap,Math.max(curHp,u._trailHp||curHp))/totalCap);
    const wardW=bw*(curWard/totalCap);
    const necW=bw*(Math.min(totalCap,curNec)/totalCap);

    ctx.save();
    // Crisp dark frame + subtle shadow for effortless contrast over any tile or portrait rim
    ctx.shadowColor='rgba(0,0,0,.7)';ctx.shadowBlur=4;ctx.shadowOffsetY=1;
    ctx.fillStyle='rgba(8,6,12,.95)';ctx.fillRect(bx-1.5,by-1.5,bw+3,bh+3);
    ctx.shadowBlur=0;ctx.shadowOffsetY=0;
    ctx.strokeStyle=recentMulti?'rgba(255,180,84,.95)':isP?'rgba(236,228,208,.26)':'rgba(255,130,120,.26)';
    ctx.lineWidth=recentMulti?1.5:1;
    ctx.strokeRect(bx-1.5,by-1.5,bw+3,bh+3);

    // Trailing ghost damage bar
    if(trailW>hpW+.5){
      const flashWhite=bigHitAge<.12;
      ctx.fillStyle=flashWhite?'#ffffff':recentMulti?'#ffaa52':'#ffe59e';
      ctx.fillRect(bx+hpW,by,trailW-hpW,bh);
    }

    // Live HP fill + specular bevel
    if(hpW>0){
      ctx.fillStyle=isP?'#4ec2a2':'#d95542';
      ctx.fillRect(bx,by,hpW,bh);
      ctx.fillStyle='rgba(255,255,255,.24)';
      ctx.fillRect(bx,by,hpW,Math.max(2,bh*.28));
    }

    // Ward appends directly onto the right of HP
    if(wardW>0.5){
      const wx=bx+hpW,ww=Math.min(bw-hpW,wardW);
      ctx.fillStyle='#68b4ff';
      ctx.fillRect(wx,by,ww,bh);
      ctx.fillStyle='rgba(235,248,255,.45)';
      ctx.fillRect(wx,by,ww,Math.max(2,bh*.3));
      ctx.fillStyle='#e4f2ff';ctx.fillRect(wx-.5,by,1.5,bh);
    }

    // Necrosis rises from the LEFT edge as execution threshold
    if(necW>0.5){
      ctx.save();
      ctx.beginPath();ctx.rect(bx,by,necW,bh);ctx.clip();
      ctx.fillStyle='rgba(18,42,16,.86)';ctx.fillRect(bx,by,necW,bh);
      ctx.strokeStyle='rgba(142,240,108,.4)';ctx.lineWidth=1.2;
      for(let sx=-bh;sx<necW+bh;sx+=6){ctx.beginPath();ctx.moveTo(bx+sx,by+bh);ctx.lineTo(bx+sx+bh,by);ctx.stroke()}
      ctx.restore();
      ctx.fillStyle='#96f76e';ctx.fillRect(bx+necW-1.5,by-1,2.2,bh+2);
    }

    // Segmented HP tick marks (every 50 / 100 / 250 HP)
    const step=totalCap>1400?250:totalCap>550?100:50;
    ctx.fillStyle='rgba(10,8,14,.42)';
    for(let v=step;v<totalCap;v+=step){
      const tx=bx+bw*(v/totalCap);
      ctx.fillRect(tx,by,1,bh);
    }

    // Companion beast sub-bar tucked directly underneath HP bar (stays inside cell!)
    if(u.beast&&u.beast.hp>0){
      const byB=by+bh+2;
      ctx.fillStyle='#0b0a10';ctx.fillRect(bx-1,byB-1,bw+2,5);
      ctx.fillStyle='#9fd86a';ctx.fillRect(bx,byB,bw*Math.max(0,u.beast.hp/u.beast.max),3);
    }
    ctx.restore();
  }
}

function drawUnit(u,now,ghost,dt=0){drawUnitToken(u,now,ghost,dt)}
function lighten(hex){const n=parseInt(hex.slice(1),16);const r=Math.min(255,(n>>16)+40),g=Math.min(255,((n>>8)&255)+40),b=Math.min(255,(n&255)+40);return `rgb(${r},${g},${b})`}
const ease=t=>1-Math.pow(1-t,3);
function drawFx(now){
  const R=view.R,T=view.T;
  FX=FX.filter(f=>now-f.t0<f.dur);
  for(const f of FX){if(f.ground||f.k==='d20'||f.k==='streak')continue;const t=Math.max(0,(now-f.t0)/f.dur);
    if(f.k==='ring'){ctx.save();ctx.globalAlpha=(1-t)*(f.fill?.35:.9);ctx.beginPath();ctx.arc(f.x,f.y,f.max*ease(t),0,Math.PI*2);if(f.fill){ctx.fillStyle=f.col;ctx.fill()}ctx.globalAlpha=1-t;ctx.strokeStyle=f.col;ctx.lineWidth=3*(1-t)+1;ctx.stroke();ctx.restore()}
    else if(f.k==='beam'){ctx.save();ctx.globalAlpha=(1-t)*.68;ctx.strokeStyle=f.col;ctx.lineCap='round';ctx.lineWidth=f.w*(1-t*.45);ctx.beginPath();ctx.moveTo(f.x1,f.y1);ctx.lineTo(f.x2,f.y2);ctx.stroke();ctx.globalAlpha=(1-t);ctx.lineWidth=2;ctx.strokeStyle='#fff';ctx.stroke();ctx.restore()}
    else if(f.k==='slash'){ctx.save();ctx.translate(f.x,f.y);ctx.rotate(f.ang+(f.flip?-1:1)*.2);ctx.globalAlpha=t<.5?1:1-(t-.5)/.5;const a0=-1.1+ease(t)*2.2;ctx.lineCap='round';
      ctx.strokeStyle=f.col;ctx.lineWidth=R*.2;ctx.beginPath();ctx.arc(-R*.5,0,R*.95,(f.flip?-1:1)*(a0-.9),(f.flip?-1:1)*a0,f.flip);ctx.stroke();ctx.strokeStyle='#fff';ctx.lineWidth=R*.07;ctx.stroke();ctx.restore()}
    else if(f.k==='thrust'){ctx.save();ctx.translate(f.x,f.y);ctx.rotate(f.ang);ctx.globalAlpha=1-t;ctx.lineCap='round';ctx.strokeStyle='#fff';ctx.lineWidth=R*.12;const k=ease(t);ctx.beginPath();ctx.moveTo(-R*1.1+k*R*.5,0);ctx.lineTo(-R*.1+k*R*.5,0);ctx.stroke();
      ctx.strokeStyle=f.col;ctx.lineWidth=R*.05;[-.5,.5].forEach(s=>{ctx.beginPath();ctx.moveTo(R*.2,0);ctx.lineTo(R*(.5+k*.3),s*R*.5);ctx.stroke()});ctx.restore()}
    else if(f.k==='impact'){ctx.save();ctx.translate(f.x,f.y);ctx.globalAlpha=1-t;ctx.strokeStyle=f.col;ctx.lineWidth=R*.14;ctx.lineCap='round';const k=ease(t);for(let i=0;i<6;i++){const a=i*Math.PI/3+.3;ctx.beginPath();ctx.moveTo(Math.cos(a)*R*(.25+k*.3),Math.sin(a)*R*(.25+k*.3));ctx.lineTo(Math.cos(a)*R*(.5+k*.5),Math.sin(a)*R*(.5+k*.5));ctx.stroke()}ctx.restore()}
    else if(f.k==='proj'){const k=Math.min(1,t*1.15);const x=f.x1+(f.x2-f.x1)*k,y=f.y1+(f.y2-f.y1)*k;const ang=Math.atan2(f.y2-f.y1,f.x2-f.x1);ctx.save();ctx.globalAlpha=t>.85?(1-t)/.15:1;ctx.lineCap='round';
      if(f.arrow){ctx.translate(x,y);ctx.rotate(ang);ctx.strokeStyle=f.col;ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(-R*.75,0);ctx.lineTo(0,0);ctx.stroke();ctx.fillStyle='#fff';ctx.beginPath();ctx.moveTo(R*.14,0);ctx.lineTo(-R*.12,-R*.1);ctx.lineTo(-R*.12,R*.1);ctx.fill()}
      else{const tx=x-Math.cos(ang)*R*1.1,ty=y-Math.sin(ang)*R*1.1;const g2=ctx.createLinearGradient(tx,ty,x,y);g2.addColorStop(0,'rgba(255,255,255,0)');g2.addColorStop(1,f.col);ctx.strokeStyle=g2;ctx.lineWidth=R*.28;ctx.beginPath();ctx.moveTo(tx,ty);ctx.lineTo(x,y);ctx.stroke();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(x,y,R*.16,0,7);ctx.fill();ctx.fillStyle=f.col;ctx.globalAlpha*=.6;ctx.beginPath();ctx.arc(x,y,R*.3,0,7);ctx.fill()}
      ctx.restore()}
    else if(f.k==='zap'){ctx.save();ctx.globalAlpha=1-t;ctx.lineCap='round';ctx.lineJoin='round';const n=7;const dx=f.x2-f.x1,dy=f.y2-f.y1,L=Math.hypot(dx,dy)||1;const nx=-dy/L,ny=dx/L;ctx.beginPath();ctx.moveTo(f.x1,f.y1);
      for(let i=1;i<n;i++){const j=Math.sin(f.seed+i*12.9898+Math.floor(t*4)*3.1)*43758.5453;const o=((j-Math.floor(j))-.5)*R*.9;ctx.lineTo(f.x1+dx*i/n+nx*o,f.y1+dy*i/n+ny*o)}ctx.lineTo(f.x2,f.y2);ctx.strokeStyle=f.col;ctx.lineWidth=R*.22;ctx.stroke();ctx.strokeStyle='#fff';ctx.lineWidth=R*.08;ctx.stroke();ctx.restore()}
    else if(f.k==='pillar'){ctx.save();const a=t<.25?t/.25:1-(t-.25)/.75;ctx.globalAlpha=a*.75;const w=R*(.9-t*.4);const g2=ctx.createLinearGradient(0,f.y-R*5,0,f.y);g2.addColorStop(0,'rgba(255,255,255,0)');g2.addColorStop(1,f.col);ctx.fillStyle=g2;ctx.fillRect(f.x-w/2,f.y-R*5,w,R*5.3);ctx.globalAlpha=a;ctx.fillStyle='#fff';ctx.fillRect(f.x-w*.15,f.y-R*5,w*.3,R*5.3);ctx.restore()}
    else if(f.k==='burst'){ctx.save();ctx.globalAlpha=1-t;ctx.fillStyle=f.col;const k=ease(t);for(let i=0;i<f.n;i++){const a=f.seed+i*6.283/f.n;ctx.beginPath();ctx.arc(f.x+Math.cos(a)*R*(.2+k*.75),f.y+Math.sin(a)*R*(.2+k*.75),R*.09*(1-t*.6),0,7);ctx.fill()}ctx.restore()}
    else if(f.k==='mote'){ctx.save();ctx.globalAlpha=(1-t)*.9;ctx.fillStyle=f.col;const y=f.y-ease(t)*R*1.4;ctx.fillRect(f.x-1.5,y-5,3,10);ctx.fillRect(f.x-5,y-1.5,10,3);ctx.restore()}
    else if(f.k==='spark'){const dt=now-f.t0;ctx.save();ctx.globalAlpha=1-t;ctx.fillStyle=f.col;ctx.beginPath();ctx.arc(f.x+f.vx*dt,f.y+f.vy*dt+200*dt*dt,2.3,0,Math.PI*2);ctx.fill();ctx.restore()}
    else if(f.k==='num'){ctx.save();ctx.globalAlpha=t<.7?1:1-(t-.7)/.3;ctx.font=`800 ${Math.round(f.size)}px 'Alegreya Sans', sans-serif`;ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.85)';const y=f.y+(f.up??-24)*ease(t);ctx.strokeText(f.txt,f.x,y);ctx.fillStyle=f.col;ctx.fillText(f.txt,f.x,y);ctx.restore()}
  }
  // Compact inset D20 badges rendered cleanly INSIDE the character tokens
  for(const f of FX){if(f.k!=='d20')continue;const u=unitById(f.id);if(!u)continue;const t=Math.max(0,(now-f.t0)/f.dur);const p=pos(u);const cp=cellPos(u);
    const rad=unitRad(u);
    const col=f.enemy?{stroke:f.band===2?'#ff5a4a':'#a2585a',fill:'#24151a',text:f.band===2?'#ffb0a0':'#d8b0b0'}:f.nat20?{stroke:'#ff5a3a',fill:'#ffcf4a',text:'#3a1200'}:BAND_COL[f.band];
    const baseScale=f.enemy?.38:f.nat20?.54:f.band===2?.46:f.band===1?.42:.38;
    const pop=t<.16?.45+.7*ease(t/.16):t<.28?1.15-(t-.16)/.12*.15:1;
    const s=rad*baseScale*pop;
    const fo=f.off?(f.off%2?1:-1)*Math.min(rad*.52,Math.ceil(f.off/2)*s*1.25):0;
    const x=p.x+fo, y=p.y+rad*.28;
    const alpha=t>.75?1-(t-.75)/.25:1;
    if(!f.enemy&&f.band===2){
      ctx.save();ctx.globalAlpha=alpha*.5;ctx.translate(x,y);ctx.rotate(now*1.8);
      const rays=f.nat20?12:8;
      for(let i=0;i<rays;i++){ctx.rotate(Math.PI*2/rays);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(s*.22,-s*(f.nat20?2.1:1.65));ctx.lineTo(-s*.22,-s*(f.nat20?2.1:1.65));ctx.closePath();ctx.fillStyle=f.nat20?'rgba(255,120,60,.6)':'rgba(255,205,80,.48)';ctx.fill()}
      ctx.restore();
    }
    // Crisp dark backing disc so the inset d20 reads clearly over any portrait art
    ctx.save();ctx.globalAlpha=alpha*.72;ctx.fillStyle='#0c0a10';ctx.beginPath();ctx.arc(x,y,s*1.12,0,Math.PI*2);ctx.fill();ctx.restore();
    drawD20(x,y,s,col,f.num,f.enemy?0:f.nat20?24:f.band===2?14:6,alpha);
    if(!f.enemy&&(f.nat20||(f.band===2&&!f.follow)||BTXT==='all')){
      ctx.save();ctx.globalAlpha=alpha;ctx.textAlign='center';
      ctx.font=`800 ${Math.max(10,Math.round(T*(f.nat20?.21:.16)))}px 'Alegreya Sans', sans-serif`;
      ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.9)';
      const lbl=f.nat20?'NAT 20!':f.band===-1?'FIZZLE':f.name.split(' · ')[0];
      const ly=Math.max(14,cp.y-T*(szOf(u)>1?1:.5)-4);
      ctx.strokeText(lbl,p.x,ly);ctx.fillStyle=f.nat20?'#ffdf6a':col.stroke;ctx.fillText(lbl,p.x,ly);
      ctx.restore();
    }
  }
  // streak banner
  const st=FX.filter(f=>f.k==='streak').pop();
  if(st&&st.n>=2){const t=Math.max(0,(now-st.t0)/st.dur);const a=t>.7?1-(t-.7)/.3:1;const sc=1+.22*Math.max(0,1-t*6);ctx.save();ctx.globalAlpha=a;ctx.translate(view.w/2,view.pad+T*.8);ctx.scale(sc,sc);ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.font=`400 ${Math.round(R*(.46+Math.min(.3,st.n*.03)))}px 'IM Fell English SC', Georgia, serif`;ctx.shadowColor='#ffb020';ctx.shadowBlur=18+st.n*2;ctx.lineWidth=5;ctx.strokeStyle='rgba(30,15,0,.8)';const txt=`HIGH STREAK ×${st.n}`;ctx.strokeText(txt,0,0);ctx.fillStyle=st.n>=8?'#fff1b0':'#ffc23d';ctx.fillText(txt,0,0);ctx.restore()}
}
function drawHUD(){
  if(!B)return;
  const tEl=$('cTimer');
  if(tEl)tEl.textContent=`⏱ ${B.time.toFixed(1)}s`;
}
function frame(ts){
  if($('combat').hidden||!view.w){lastFrame=ts;requestAnimationFrame(frame);return}
  const now=ts/1000;const dt=Math.min(.05,(ts-(lastFrame||ts))/1000);lastFrame=ts;
  if(B&&running&&!paused&&!B.over){simAcc+=dt*S.speed*(performance.now()<slowUntil?.3:1);let n=0;while(simAcc>=TICK&&n<12){tick(B,TICK);simAcc-=TICK;n++;handleEvents();if(B.over)break}}
  if(B&&B.over&&!resultShown){resultShown=true;_resTimer=setTimeout(showResult,700)}
  // move units toward their hex
  const units=B?B.units:setupUnits();
  units.forEach(u=>{const c=ucenter(u);if(u.px===undefined||u._dragging){if(!u._dragging){u.px=c.x;u.py=c.y}}else{const k=u.leap&&now-u.leap<.3?.45:Math.min(1,dt*10);u.px+=(c.x-u.px)*k;u.py+=(c.y-u.py)*k}});
  ctx.save();if(shake>0){ctx.translate((Math.random()-.5)*shake,(Math.random()-.5)*shake);shake=Math.max(0,shake-dt*30)}
  drawBoard(now);
  drawAuras(units);drawGroundFx(now);drawLinks();if(B)drawIntent();else{if(typeof drawPreview==='function')drawPreview();drawThreat()}
  const sorted=units.slice().sort((a,b)=>(a.alive===false)-(b.alive===false)||(cellPos(a).y-cellPos(b).y));
  sorted.forEach(u=>drawUnitToken(u,now,false,dt));
  if(drag)drawUnitToken({...drag.u,px:drag.x,py:drag.y},now,true,dt);
  if(B){drawUnitBadges(sorted,now);drawUnitHealthBars(sorted,now,dt)}
  drawFx(now);drawHUD();
  ctx.restore();
  requestAnimationFrame(frame);
}
function drawAuras(units){const T=view.T;
  units.forEach(u=>{if(u.side!=='P'||u.alive===false)return;const r=u.key==='elena'&&u.f&&u.f.ballad?1:auraR(u);if(!r)return;
    const col=u.f.twilight||u.f.wardAura?'143,180,230':u.f.thunderAura?'183,166,255':'224,180,90';const x=view.pad+(u.c-r)*T,y=view.pad+(u.r-r)*T,w=(2*r+1)*T;
    ctx.save();ctx.fillStyle=`rgba(${col},.06)`;ctx.fillRect(x,y,w,w);ctx.strokeStyle=`rgba(${col},.5)`;ctx.setLineDash([5,4]);ctx.lineWidth=1.5;ctx.strokeRect(x+.5,y+.5,w-1,w-1);ctx.restore()})}
function drawLinks(){
  if(B&&B.time>4)return;const fade=B?Math.max(0,1-B.time/4):1;
  let L=[];
  if(B)L=(B.links||[]).filter(l=>l.s.alive&&l.x.alive).map(l=>({a:pos(l.s),c:pos(l.x),n:l.n}));
  else{const su=setupUnits();S.party.forEach(p=>{if(!p.blessTo||!H[p.key].bless)return;const a=su.find(x=>x.key===p.key&&x.side==='P'),c=su.find(x=>x.key===p.blessTo&&x.side==='P');if(a&&c)L.push({a:pos(a),c:pos(c),n:H[p.key].bless.n})})}
  ctx.save();ctx.globalAlpha=fade;L.forEach(l=>{ctx.strokeStyle='rgba(255,215,106,.75)';ctx.lineWidth=3;ctx.shadowColor='#ffd76a';ctx.shadowBlur=8;ctx.beginPath();ctx.moveTo(l.a.x,l.a.y);ctx.lineTo(l.c.x,l.c.y);ctx.stroke();ctx.shadowBlur=0;
    if(!B){const mx=(l.a.x+l.c.x)/2,my=(l.a.y+l.c.y)/2;ctx.font=`800 ${Math.max(9,Math.round(view.T*.2))}px 'Alegreya Sans',sans-serif`;ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.85)';ctx.strokeText(l.n,mx,my-4);ctx.fillStyle='#ffd76a';ctx.fillText(l.n,mx,my-4)}});ctx.restore()}
function drawIntent(){ctx.save();ctx.lineWidth=1.5;B.units.forEach(u=>{if(!u.alive||!u.target||!u.target.alive)return;const a=pos(u),b2=pos(u.target);
  ctx.strokeStyle=u.side==='P'?'rgba(236,228,208,.22)':'rgba(220,90,80,.18)';ctx.setLineDash(u.side==='P'?[6,5]:[2,5]);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b2.x,b2.y);ctx.stroke();
  if(u.side==='P'&&u.dest&&(u.dest.c!==u.c||u.dest.r!==u.r)){const d=center(u.dest.c,u.dest.r);ctx.setLineDash([]);ctx.strokeStyle='rgba(106,180,232,.5)';ctx.strokeRect(d.x-view.T*.18,d.y-view.T*.18,view.T*.36,view.T*.36)}});ctx.restore()}

/* 0.12: during placement, hovering a foe shows who it will go after first from where everyone stands */
let _thrKey='',_thr=null;
function previewThreats(){if(typeof partyCfg!=='function'||typeof RUN==='undefined'||!RUN)return null;const k=_setupKey;if(k===_thrKey&&_thr)return _thr;
  const uid=UID;let out={};try{const opts=typeof battleOpts==='function'?battleOpts(RUN):{};const b=newBattle(S.enc,partyCfg(RUN),ENC[S.enc].eTier||1,opts);const E0=b.units.filter(x=>x.side==='E');
    E0.forEach((e,i)=>{const t=pickTarget(b,e);if(t)out[i]=t.key})}catch(err){out={}}finally{UID=uid;loadMap(ENC[S.enc].map,ENC[S.enc].lanes)}
  _thrKey=k;_thr=out;return out}
function drawThreat(){if(drag)return;
  let i=-1;
  if(hoverHex){const su0=setupUnits().find(x=>x.side==='E'&&covers(x,hoverHex));if(su0)i=su0.idx}
  else if(HOVER_ENEMY!=null&&!B){i=HOVER_ENEMY}
  if(i<0)return;
  const T=previewThreats();if(!T||!T[i])return;const su=setupUnits();const e=su.find(x=>x.side==='E'&&x.idx===i),h=su.find(x=>x.side==='P'&&x.key===T[i]);if(!e||!h)return;
  const a=pos(e),c=pos(h);ctx.save();ctx.strokeStyle='rgba(220,70,60,.85)';ctx.lineWidth=2.5;ctx.setLineDash([7,5]);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(c.x,c.y);ctx.stroke();ctx.setLineDash([]);
  ctx.beginPath();ctx.arc(c.x,c.y,unitRad(h)+6,0,7);ctx.stroke();ctx.font=`800 ${Math.max(10,Math.round(view.T*.22))}px 'Alegreya Sans',sans-serif`;ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.85)';
  const txt='goes for '+H[h.key].name.split(' ')[0]+' first';ctx.strokeText(txt,c.x,c.y-unitRad(h)-12);ctx.fillStyle='#ffb0a0';ctx.fillText(txt,c.x,c.y-unitRad(h)-12);ctx.restore()}
let _setup=null,_setupKey='';
function setupUnits(){const k=S.enc+JSON.stringify(S.party);if(k!==_setupKey){const old=_setup||[];
  _setup=S.party.map(p=>{const o=old.find(x=>x.key===p.key&&x.side==='P')||{};const st=heroStats(p);return {key:p.key,side:'P',name:H[p.key].name,c:p.c,r:p.r,px:o.px,py:o.py,alive:true,tier:p.tier||1,sz:st.sz,f:st.f,cha:st.m.cha}});
  ENC[S.enc].u.forEach(([ek,c,r],i)=>{const d=E[ek];_setup.push({key:ek,side:'E',name:d.name,c,r,alive:true,elite:d.elite,boss:d.boss,sz:d.large?2:1,idx:i,f:{}})});settleLarge(_setup.filter(x=>x.side==='E'));_setupKey=k}return _setup}
const isDeploy=h=>DEPLOY.some(d=>d.c===h.c&&d.r===h.r);
function previewWaves(){return ENC[S.enc].waves||[]}
/* ---------- board input (placement) ---------- */
function evPos(e){const r=canvas.getBoundingClientRect();return {x:(e.clientX-r.left),y:(e.clientY-r.top)}}
canvas.addEventListener('pointerdown',e=>{
  SND.init();const p=evPos(e);const h=hexAt(p.x,p.y);if(!h)return;
  if(B){const u=B.units.find(x=>x.alive&&covers(x,h));if(u){if(u.side==='P'){S.sel=u.key;S.selE=null}else{S.selE=u;S.sel=null}renderSide()}return}
  const pp=S.party.find(x=>x.c===h.c&&x.r===h.r);
  if(pp){S.sel=pp.key;S.selE=null;renderSide();drag={key:pp.key,u:{key:pp.key,side:'P',name:H[pp.key].name,c:pp.c,r:pp.r,alive:true,tier:pp.tier||1,f:{}},x:p.x,y:p.y};canvas.setPointerCapture(e.pointerId);const su=setupUnits().find(x=>x.key===pp.key);if(su)su._hide=1;return}
  const su=setupUnits().find(x=>x.side==='E'&&covers(x,h));const en=su?su.idx:-1;if(en>=0){S.selE=en;S.sel=null;renderSide()}
});
canvas.addEventListener('pointermove',e=>{const p=evPos(e);hoverHex=hexAt(p.x,p.y);if(drag){drag.x=p.x;drag.y=p.y}});
canvas.addEventListener('pointerleave',()=>{hoverHex=null;if(typeof enemyTip==='function')enemyTip(null)});
/* 0.11: enemy cards: hover shows a short card, right-click (or click) opens the full one */
function enemyAt(h){if(!h)return null;if(B)return B.units.find(x=>x.alive&&x.side==='E'&&covers(x,h))||null;
  const su=setupUnits().find(x=>x.side==='E'&&covers(x,h));return su?previewEnemy(su.idx):null}
canvas.addEventListener('pointermove',e=>{if(drag||typeof enemyTip!=='function')return;const p=evPos(e);const en=enemyAt(hexAt(p.x,p.y));enemyTip(en,e)});
canvas.addEventListener('contextmenu',e=>{const p=evPos(e);const en=enemyAt(hexAt(p.x,p.y));if(en&&typeof enemyCardModal==='function'){e.preventDefault();enemyCardModal(en)}});
canvas.addEventListener('pointerup',e=>{
  if(!drag)return;const p=evPos(e);const h=hexAt(p.x,p.y);const me=S.party.find(x=>x.key===drag.key);
  if(!h&&typeof dropOffBoard==='function'&&dropOffBoard(drag.key,e)){setupUnits().forEach(x=>x._hide=0);drag=null;return}
  if(h&&isDeploy(h)&&me){
    const other=S.party.find(x=>x!==me&&x.c===h.c&&x.r===h.r);
    // v0.24 Choke Lane (maxHeroes: 1) clean swap UX
    const tgtLaneIdx=typeof laneOfCol==='function'?laneOfCol(h.c,LANES):0;
    const tgtLane=LANES&&LANES[tgtLaneIdx];
    const tgtDef=tgtLane&&typeof LANE_OBJ!=='undefined'&&LANE_OBJ[tgtLane.obj];
    if(other){
      other.c=me.c;other.r=me.r;
      me.c=h.c;me.r=h.r;
    }else if(tgtDef&&tgtDef.maxHeroes===1){
      const existing=S.party.find(x=>x!==me&&typeof laneOfCol==='function'&&laneOfCol(x.c,LANES)===tgtLaneIdx);
      if(existing){
        existing.c=me.c;existing.r=me.r;
        me.c=h.c;me.r=h.r;
        if(typeof toast==='function')toast(`${tgtLane.n} holds 1 hero — swapped with ${H[existing.key].name.split(' ')[0]}`);
      }else{
        me.c=h.c;me.r=h.r;
      }
    }else{
      me.c=h.c;me.r=h.r;
    }
    _setupKey='';_thrKey='';
    save();
    if(typeof renderLaneHeaders==='function')renderLaneHeaders();
  }
  setupUnits().forEach(x=>x._hide=0);drag=null;renderSide();
});

function renderLegend(){const L=[['#','Wall','Blocks movement and sight','dungeon'],['O','Pillar or tree','Blocks movement and sight','forest'],['c','Crates, tables, kegs','Block movement, not sight','cave'],[',','Difficult terrain','Slow to cross','forest'],['~','Deep water','Blocks movement, not sight','cave'],['_','Chasm','Blocks movement, not sight. Anything pushed in is gone','cave'],['^','Fire','Burns anyone standing in it','dungeon'],['w','Web','Stuck for 1.2s; fire burns it away','cave'],['a','Arrow slit','Blocks movement, not sight: a sightline through a wall','dungeon']];
  $('terrain').innerHTML=L.map(([t,n,x,thm])=>`<div class="tl"><img src="${tileIcon(t,thm)}" alt=""><div><b>${n}</b><span>${x}</span></div></div>`).join('')}

