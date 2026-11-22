/* ================= 0.23 GAME SHELL UI =================
   Title, Intro, Pack Toggles, First Pick, Camp Shop (Boss Reminder + Whole-Shop Freeze),
   9-Row Constricting DAG Map (Curio, Single-Class Multiclass, Opt-In Quest Board, ? Mystery Events,
   Dungeon Hazards, Stationary & Wandering Miniboss), Tier II Specialization / Tier III ASI /
   Tier IV Epic Boon pickers, Tactical Deployment, Combat, and Results.
*/

const TIER_COL = { 1: '#d8d0bc', 2: '#7fd08f', 3: '#7fb4f0', 4: '#c49af0' };
let S = { enc: 'run', eTier: 1, party: [], sel: null, selE: null, speed: 1, sound: true };
let mapLayer = null, mapDirty = true;
let RUN = null, PHASE = 'title';
const SAVE_KEY = 'bb023.run', BEST_KEY = 'bb023.best';
const rom = ['', 'I', 'II', 'III', 'IV'];
const short = n => n.replace(/^(Sir|Sister|Brother) /, '').split(' ')[0];

/* ---------- Storage ---------- */
function saveRun() {
  if (!RUN) return;
  try { RUN.encSnap = ENC.run; RUN.phase = PHASE === 'combat' ? 'place' : PHASE; localStorage.setItem(SAVE_KEY, JSON.stringify(RUN)); } catch (e) {}
}
function loadRun() {
  try {
    const r = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null');
    if (r && r.v === '0.23' && !r.over) {
      r.team = r.team.filter(h => H[h.key]);
      RUN_UID = Math.max(1, ...r.team.map(h => h.uid + 1));
      if (r.adv) {
        if (!Array.isArray(r.adv.path)) r.adv.path = [];
        if (!r.adv.pos && r.adv.path.length) r.adv.path = [];
        if (r.adv.pos && r.adv.pos.r >= ADV.bossRow) { r.adv.pos = null; r.adv.path = []; }
        r.adv.itemPool = [...STANDARD_ITEM_KEYS];
      }
      if (Array.isArray(r.stash)) r.stash = r.stash.filter(k => ITEMS[k]);
      if (Array.isArray(r.team)) r.team.forEach(h => { if (Array.isArray(h.items)) h.items = h.items.filter(k => ITEMS[k]); });
      if (r.shop && Array.isArray(r.shop.items)) r.shop.items = r.shop.items.map(k => (k && ITEMS[k]) ? k : null);
      return r;
    }
  } catch (e) {}
  return null;
}
function clearRun() { try { localStorage.removeItem(SAVE_KEY); } catch (e) {} }
function getBest() { try { return JSON.parse(localStorage.getItem(BEST_KEY) || 'null'); } catch (e) { return null; } }
function setBest(o) { try { localStorage.setItem(BEST_KEY, JSON.stringify(o)); } catch (e) {} }
function save() { saveRun(); }
function dropOffBoard() { return false; }

/* ---------- Helpers ---------- */
function show(id) {
  closeModal(true);
  document.querySelectorAll('.screen,#combat').forEach(s => s.hidden = s.id !== id);
  PHASE = id === 'combat' ? 'combat' : id;
  window.scrollTo(0, 0);
}
let _toastT = 0;
function toast(t) {
  const el = $('toast'); el.textContent = t; el.hidden = false; el.style.opacity = 1;
  clearTimeout(_toastT);
  _toastT = setTimeout(() => { el.style.opacity = 0; setTimeout(() => el.hidden = true, 260); }, 2100);
}
const gold = n => `${n} <span class="coin"></span>`;
const goldHub = (n, { dark = false, sm = false, extra = '' } = {}) =>
  `<div class="gold-hub${dark ? ' dark' : ''}${sm ? ' sm' : ''}" title="Your spendable gold"><span class="coin coin-lg"></span><span class="gh-val"><b class="gh-num">${n}</b><span class="gh-lbl">GOLD</span></span>${extra}</div>`;
const piggyTxt = () => RUN.piggyBroken
  ? '<i class="pig broke" title="Piggy Bank broken: your next loss ends the run">Broken</i>'
  : `<i class="pig" title="Wins fill the Piggy Bank. Your first loss breaks it, pays out all saved gold, and lets you shop and retry.">${gold(RUN.piggy)}</i>`;

function openModal(html, after, forced) {
  const m = $('modal'); m.querySelector('.mbody').innerHTML = html; m.hidden = false;
  m.dataset.forced = forced ? '1' : ''; m.querySelector('.close').hidden = !!forced;
  paintCanvases(m); paintTokens(m); if (after) after(m);
}
function closeModal(force) { const m = $('modal'); if (m.dataset.forced && !force) return; m.dataset.forced = ''; m.hidden = true; }
const modalForced = () => !$('modal').hidden && $('modal').dataset.forced === '1';

function checkPendingPath() {
  if (!RUN || modalForced()) return;
  const h = RUN.team.find(x => x.tier >= 2 && !x.path);
  if (h) { pathModal(h); return; }
  const a = RUN.team.find(x => x.tier >= 3 && !x.asi);
  if (a) { asiModal(a); return; }
  const b = RUN.team.find(x => x.tier >= 4 && !x.boon);
  if (b) { boonModal(b); return; }
}

function asiModal(h, sel) {
  const d = H[h.key]; const st = heroStats(cfgOf({ ...h, tier: 2 }, RUN)); sel = sel || st.k;
  const opt = a => {
    const m = st.m[a], tag = st.w === a && st.k === a ? 'weapon · key' : st.w === a ? 'weapon' : st.k === a ? 'key' : '';
    return `<button class="asiopt${a === sel ? ' sel' : ''}" data-a="previewAsi" data-u="${h.uid}" data-p="${a}" style="--ac:${ATTR_COL[a]}"><i>${ATTR_S2[a]}</i><b>${sgn(m)} → ${sgn(m + 2)}</b>${tag ? `<u>${tag}</u>` : ''}<span class="small">${esc(attrTip(a, d, { ...st, m: { ...st.m, [a]: m + 2 } }))}</span></button>`;
  };
  openModal(`<div class="mpanel pathpanel"><div class="row" style="gap:12px;flex-wrap:nowrap">${iconSlot(h.key, 64)}<div><div class="lbl">${esc(d.name)} reaches Tier III</div><h2>Ability Score Improvement (+2)</h2></div></div>
    <p class="mute small">Choose one attribute modifier to raise permanently by +2.</p>
    <div class="asiopts">${ATTRS.map(opt).join('')}</div>
    <div class="row" style="justify-content:center"><button class="btn primary big" data-a="chooseAsi" data-u="${h.uid}" data-p="${sel}">+2 ${ATTR_N[sel]}</button></div></div>`, null, true);
}

function boonModal(h) {
  const d = H[h.key];
  if (!h._boonOffer || h._boonOffer.length < 3) h._boonOffer = rollEpicBoonOffer();
  const offer = h._boonOffer;
  openModal(`<div class="mpanel pathpanel"><div class="row" style="gap:12px;flex-wrap:nowrap">${iconSlot(h.key, 64)}<div><div class="lbl">${esc(d.name)} reaches Tier IV!</div><h2>Choose an Epic Boon (1 of 3)</h2></div></div>
    <p class="mute small">Tier IV champions draw 3 boons from the universal 9-card Epic Boon deck.</p>
    <div class="boonopts">${offer.map(bk => {
      const B0 = EPIC_BOONS[bk];
      return `<button class="boonopt" data-a="chooseBoon" data-u="${h.uid}" data-p="${bk}"><b>★ ${esc(B0.n)}</b><span>${glossarize(B0.x)}</span></button>`;
    }).join('')}</div></div>`, null, true);
}

function tokenCanvas(k, D, opts = {}) {
  const c = document.createElement('canvas'); const d = Math.min(2, window.devicePixelRatio || 1);
  c.width = c.height = Math.round(D * d); c.style.width = c.style.height = D + 'px';
  const g = c.getContext('2d'); g.scale(d, d);
  const C = typeof keyedCustomArt === 'function' ? keyedCustomArt(opts.form ? 'forms' : 'heroes', opts.form || k) : null;
  vellum(g, 0, 0, D, D, '#e6d6ad');
  if (C) { drawTokenCustom(g, C, D, !!opts.fullBody); return c; }
  const A = artFor(k), St = SET[k], a = A.an;
  const side = (a.y1 - (a.ht ?? a.y0)) * .34 / St.iz, cx = a.hx + St.ix * side, cy = (a.ht ?? a.y0) + side * .48 + St.iy * side;
  drawSrc(g, A, St, cx - side / 2, cy - side / 2, side, side, 0, 0, D, D);
  return c;
}
function paintTokens(root) { root.querySelectorAll('canvas[data-icon]').forEach(c => { const k = c.dataset.icon, D = +c.dataset.size || 48; const n = iconCanvas(k, D); c.replaceWith(n); n.dataset.k = k; n.className = c.className; }); }
const iconSlot = (k, D, cls = '') => `<canvas data-icon="${k}" data-size="${D}" class="${cls}" width="${D}" height="${D}" style="width:${D}px;height:${D}px"></canvas>`;
const roleStyle = (k, t) => `--tc:${TIER_INK[t || 1]};--rc:${ROLE_COL[H[k].role]}`;
const advLabel = () => { const n = RUN.adv && RUN.adv.node; return n ? `Act ${RUN.adv.act} · ${NODE[n.kind].n}` : `Act ${actOf(RUN)}`; };

/* ---------- Title & First Pick ---------- */
function renderTitle() {
  const r = loadRun(); $('contBtn').hidden = !r;
  if (r) $('contBtn').innerHTML = `Continue · Act ${r.adv ? r.adv.act : 1}, ${r.stats.won} wins`;
  const b = getBest();
  $('bestLine').textContent = b ? `Record: ${b.won} fights won${b.victory ? ' (Adventure cleared!)' : ''}${b.lead && H[b.lead] ? `, led by ${H[b.lead].name}` : ''}.` : 'Conquer Phandalin, White Plume Mountain, and The Hells!';
  const p = $('parade'); p.innerHTML = '';
  HERO_ORDER.forEach(k => { const c = iconCanvas(k, 52); c.title = `${H[k].name} — ${H[k].title}`; p.appendChild(c); });
  show('start');
}

function renderPick() {
  $('picks').innerHTML = RUN.firstPick.map(k => largeCard(k, 1, { cfg: { key: k, tier: 1 }, foot: `<div class="cfoot"><span class="note">${H[k].role} · free</span><button class="btn primary" data-a="pick" data-k="${k}">Recruit ${esc(H[k].name)}</button></div>` })).join('');
  paintCanvases($('picks')); show('pick');
}
function doPick(k) {
  freeHero(RUN, k);
  startAct(RUN);
  // v0.23 Camp Shop Flow Flip: startAct() refreshes shop and opens Camp Shop before map choice!
  renderShop(); show('shop'); saveRun();
}

const PACK_PREF_KEY = 'bb023.packs';
function loadEnabledPacks() {
  try {
    const arr = JSON.parse(localStorage.getItem(PACK_PREF_KEY) || 'null');
    if (Array.isArray(arr)) { const valid = arr.filter(k => PACKS[k]); if (valid.length) return new Set(valid); }
  } catch (e) {}
  return new Set(PACK_ORDER);
}
let ENABLED_PACKS = loadEnabledPacks();
function saveEnabledPacks() {
  try { localStorage.setItem(PACK_PREF_KEY, JSON.stringify(PACK_ORDER.filter(k => ENABLED_PACKS.has(k)))); } catch (e) {}
}

/* ---------- Pre-Run Pack Toggles ---------- */
function renderPacks() {
  const chosen = PACK_ORDER.filter(k => ENABLED_PACKS.has(k));
  const heroCount = chosen.reduce((sum, k) => sum + PACKS[k].heroes.length, 0);
  $('packLbl').textContent = 'Pre-run pack setup · 6 Packs · 24 Reworked Heroes';

  const ctrlHtml = `<div class="packsummary"><b>${chosen.length}</b> of ${PACK_ORDER.length} Packs enabled · <b>${heroCount}</b> Heroes · All <b>${STANDARD_ITEM_KEYS.length}</b> Shop Items + <b>${UNIQUE_ITEM_KEYS.length}</b> Curio Uniques</div>
    <div class="row">
      <button class="btn sm" data-a="packsAll">Enable all 6</button>
      <button class="btn sm" data-a="packsCore3">Starter 3</button>
      <button class="btn sm" data-a="packsNone">Clear</button>
      <button class="btn primary" data-a="confirmPacks" ${chosen.length ? '' : 'disabled'}>Start Adventure →</button>
    </div>`;
  if ($('packControls')) $('packControls').innerHTML = ctrlHtml;
  if ($('packControlsFoot')) {
    $('packControlsFoot').innerHTML = `<button class="btn primary big" data-a="confirmPacks" ${chosen.length ? '' : 'disabled'}>Start Adventure (${heroCount} Heroes in Shop Pool)</button>`;
  }

  $('packList').innerHTML = PACK_ORDER.map((k, idx) => {
    const P = PACKS[k];
    const on = ENABLED_PACKS.has(k);
    return `<div class="pack frame pack-toggle ${on ? 'on' : 'off'}">
      <div class="packtop">
        <span class="lbl">Pack ${idx + 1}</span>
        <button class="packpill ${on ? 'on' : 'off'}" data-a="togglePack" data-k="${k}" aria-pressed="${on}">${on ? '✓ Enabled' : 'Disabled'}</button>
      </div>
      <h3>${esc(P.n)}</h3>
      <p class="mute">${esc(P.x)}</p>
      <div class="packheroes">${P.heroes.map(h => `<button class="packhero" data-a="packHero" data-k="${h}" style="${roleStyle(h, 1)}" title="Inspect ${esc(H[h].name)}">${iconSlot(h, 64)}<b>${esc(H[h].name)}</b><span>${esc(H[h].role)} · ${esc(H[h].cls)}</span></button>`).join('')}</div>
      <button class="btn ${on ? '' : 'primary'}" data-a="togglePack" data-k="${k}">${on ? 'Disable this pack' : 'Enable this pack'}</button>
    </div>`;
  }).join('');
  paintCanvases($('packList')); paintTokens($('packList')); show('packs'); saveRun();
}

function togglePackKey(k) {
  if (!PACKS[k]) return;
  if (ENABLED_PACKS.has(k)) ENABLED_PACKS.delete(k); else ENABLED_PACKS.add(k);
  saveEnabledPacks(); renderPacks();
}

function confirmPacks() {
  const chosen = PACK_ORDER.filter(k => ENABLED_PACKS.has(k));
  if (!chosen.length) { toast('Enable at least 1 Pack to start!'); return; }
  startRunWithPacks(RUN, chosen);
  toast(`${chosen.length} pack${chosen.length === 1 ? '' : 's'} active (${RUN.adv.pool.length} heroes in shop pool)!`);
  renderPick(); saveRun();
}

/* ==========================================================================
   9-ROW CONSTRICTING NON-CROSSING DAG MAP
   ========================================================================== */
const nodeTitle = (n, isWanderer) => {
  if (isWanderer) return `⚑ Wandering Miniboss: ${RUN.adv.wanderer.name}`;
  if (n.kind === 'boss' && n.threat && ENC[n.threat]) return `Act Boss: ${ENC[n.threat].n}`;
  if (n.kind === 'miniboss' && n.label) return `Optional Miniboss: ${n.label}`;
  if (n.kind === 'multiclass' && n.mcClass) return `${n.label} (${n.mcClass} Multiclass)`;
  return NODE[n.kind].n;
};
const nodeTip = (n, isWanderer) => {
  if (isWanderer) return 'Pit Fiend Enforcer prowls this lane! Defeat it for +10g and a guaranteed Very Rare/Legendary relic, or route around it.';
  const haz = n.hazard && HAZARDS[n.hazard] ? ` Hazard: ${HAZARDS[n.hazard].n} — ${HAZARDS[n.hazard].x}` : '';
  if (n.kind === 'boss' && n.threat && ENC[n.threat]) return `${ENC[n.threat].note}`;
  if (n.kind === 'miniboss') return `Optional Act Miniboss! Grants +6g and guaranteed Rare/Very Rare loot.${haz}`;
  if (n.kind === 'multiclass' && n.mcClass) return `Single-Class Dip (${n.mcClass} · ${CLASS_KW[MULTICLASS[n.mcClass].kw].n}): ${MULTICLASS[n.mcClass].x} (or fallback +4g / +1 Attr).`;
  return ({
    fight: `Standard combat encounter from this Act’s pool.${haz}`,
    elite: `Dangerous Elite fight! Grants bonus gold and a Treasure draft.${haz}`,
    mystery: 'Mystery stop: Act choice event (55%), surprise ambush (20%), hidden treasure (15%), or wandering peddler (10%).',
    curio: 'Curio Merchant: 3 Unique Class-Keyword items (5g) filtered to your party’s keywords (+1 reroll for 2g).',
    train: 'Promote a hero +1 Tier for free, or drill +1 permanent attribute.',
    quest: 'Opt-In Quest Board: accept a hero’s personal Quest, accelerate an active Quest (+35%), or claim +4g bounty.',
    rest: 'Retrain any Tier II+ hero’s Specialization freely, reinforce Piggy Bank (+4g), or forage (+4g).',
    treasure: 'Choose one of three items (evaluated at +3 encounters rarity!).'
  }[n.kind] || '') + haz;
};

let _bossRead = null, _bossKey = '';
function bossReadCached() {
  const key = RUN.adv.act + '|' + (RUN.adv.actBoss || '') + '|' + RUN.team.map(h => h.key + h.tier + (h.path || '') + (h.boon || '') + (h.multiclass || '') + h.items.join('') + (h.questDone ? 'Q' : '') + JSON.stringify(h.train || {})).join(',');
  if (key !== _bossKey || !_bossRead) { _bossKey = key; try { _bossRead = bossRead(RUN, 3); } catch (e) { _bossRead = null; } }
  return _bossRead;
}

function renderMap() {
  const A = RUN.adv;
  if (!A.map || !A.map.length) startAct(RUN);
  const M = A.map;
  const actMod = currentActModule(RUN);
  const next = new Set(nextNodes(RUN));
  const W = 780, Hh = 740, y = r => Hh - 64 - r * ((Hh - 128) / ADV.bossRow), x = n => 64 + n.x * (W - 128);
  const visited = new Set((A.path || []).map(p => p.r + ',' + p.i));
  if (A.pos) visited.add(A.pos.r + ',' + A.pos.i);

  const lines = [];
  // Draw ALL explicit non-crossing DAG edges
  for (let r = 0; r < M.length - 1; r++) {
    M[r].forEach(a => {
      (a.next || []).forEach(j => {
        const b = M[r + 1][j];
        if (!b) return;
        const isCur = A.pos && A.pos.r === a.r && A.pos.i === a.i && next.has(b);
        const isVisited = visited.has(a.r + ',' + a.i) && visited.has(b.r + ',' + b.i);
        const cls = isCur ? 'nx' : isVisited ? 'on' : 'dag';
        lines.push(`<line x1="${x(a)}" y1="${y(a.r)}" x2="${x(b)}" y2="${y(b.r)}" class="${cls}"/>`);
      });
    });
  }

  const BR = bossReadCached();
  const Wn = A.wanderer && A.wanderer.alive ? A.wanderer : null;

  const nodes = M.flat().map(n => {
    const key = n.r + ',' + n.i, can = next.has(n), been = visited.has(key);
    const isCurPos = A.pos && A.pos.r === n.r && A.pos.i === n.i;
    const isWand = !!(Wn && Wn.r === n.r && Wn.i === n.i);
    let glyph = NODE[n.kind].g;
    let lbl = NODE[n.kind].n;
    if (n.kind === 'boss' && n.threat && ENC[n.threat]) lbl = ENC[n.threat].n.split(',')[0];
    else if (n.kind === 'miniboss' && n.label) lbl = n.label;
    else if (n.kind === 'multiclass' && n.label) lbl = n.label;
    if (isWand) { glyph = '⚑'; lbl = 'Pit Fiend!'; }
    const hazBadge = n.hazard && HAZARDS[n.hazard] ? `<span class="hazbadge" title="${esc(HAZARDS[n.hazard].n)}">${HAZARDS[n.hazard].g}</span>` : '';
    const bossTag = n.kind === 'boss' && BR ? `<span class="read r-${BR.label.toLowerCase()}">${BR.label}</span>` : '';
    return `<button class="mnode k-${n.kind}${can ? ' can' : ''}${been ? ' been' : ''}${isCurPos ? ' here' : ''}${isWand ? ' wanderer' : ''}${n.hazard ? ' has-haz' : ''}" style="left:${x(n)}px;top:${y(n.r)}px" ${can ? `data-a="node" data-r="${n.r}" data-i="${n.i}"` : 'disabled'} data-tn="${esc(nodeTitle(n, isWand))}" data-tip="${esc(nodeTip(n, isWand))}"><span class="g">${glyph}</span><span class="nl">${esc(lbl)}</span>${hazBadge}${bossTag}</button>`;
  }).join('');

  $('mapBoard').innerHTML = `<svg class="maplines" viewBox="0 0 ${W} ${Hh}" width="${W}" height="${Hh}">${lines.join('')}</svg>${nodes}`;
  $('mapHead').innerHTML = `<div><div class="lbl">Act ${A.act} of ${ADV.acts} · ${esc(actMod.sub)}</div><h2>${esc(actMod.name)}</h2></div>
    <div class="maphead-center">
      ${goldHub(RUN.gold)}
      <div class="hud-submeta"><span title="Piggy Bank (single free loss)">Piggy: ${piggyTxt()}</span><span>${RUN.stats.won} wins</span></div>
    </div>
    <div class="maphead-act"><button class="btn primary" data-a="openCampShop">Open Camp Shop</button></div>`;

  // Sidebar: only display accepted / completed quests (strict progressive disclosure!)
  const activeQs = RUN.team.filter(h => (h.questActive || h.questDone) && H[h.key].quest);
  const qsHtml = activeQs.length ? activeQs.map(h => {
    const q = H[h.key].quest;
    const pct = h.questDone ? 100 : Math.round(Math.min(1, (h.questProg || 0) / q.goal) * 100);
    return `<div class="quest" title="${esc(q.rewardName)}: ${esc(q.rewardDesc)}">${iconSlot(h.key, 30)}<div><b>${esc(H[h.key].name)}: ${esc(q.rewardName)}</b><div class="qbar"><i style="width:${pct}%"></i></div><span class="small mute">${h.questDone ? 'COMPLETE ★' : `${Math.round(h.questProg || 0)} / ${q.goal} · ${esc(q.label)}`}</span></div></div>`;
  }).join('') : `<div class="small mute">Visit a ❖ Quest Board to accept a hero’s personal Quest.</div>`;

  const bossKey = A.actBoss || M[ADV.bossRow][0].threat;
  const bossEnc = ENC[bossKey];
  const bossUnitKey = bossEnc && bossEnc.u && bossEnc.u[0] ? bossEnc.u[0][0] : 'nezznar';

  $('mapSide').innerHTML = `<div class="lbl">Your party (${RUN.team.length}/4)</div>
    <div class="mparty">${RUN.team.map(h => `<button data-a="card" data-u="${h.uid}" title="${esc(H[h.key].name)}">${iconSlot(h.key, 46)}<span>${rom[h.tier]}${h.multiclass ? '✧' : ''}${h.boon ? '★' : ''}</span></button>`).join('')}</div>
    <div class="lbl">Act ${A.act} Boss</div>
    <div class="bossrem-side"><img src="${portraitURL(bossUnitKey)}" alt=""><div><b>${esc(bossEnc ? bossEnc.n : bossKey)}</b>${BR ? ` <span class="read r-${BR.label.toLowerCase()}">${BR.label}</span>` : ''}<div class="small mute">${esc(bossEnc ? bossEnc.note : '')}</div></div></div>
    <div class="lbl">Active Quests</div>${qsHtml}
    ${Wn ? `<div class="warnbox"><b>⚑ Wandering Miniboss</b><br><span class="small">Pit Fiend Enforcer is patrolling Row ${Wn.r + 1}!</span></div>` : ''}`;

  paintCanvases($('advmap')); paintTokens($('advmap')); show('advmap'); A.stage = 'map'; saveRun();
  checkPendingPath();
}

function chooseNode(r, i) {
  const n = RUN.adv.map[r][i];
  if (!nextNodes(RUN).includes(n)) return;
  const k = enterNode(RUN, n);
  if (k === 'battle') { goPlacement(); return; }
  eventModal(k);
}

/* ==========================================================================
   MAP EVENT MODALS (Training, Quest Board, Campfire, Treasure, Curio, Multiclass, ? Mystery)
   ========================================================================== */
function finishEvent(msg) {
  if (msg) toast(msg);
  closeModal(true);
  clearNode(RUN);
  renderMap();
}

function eventModal(k, arg) {
  const on = RUN.team;

  if (k === 'train') {
    if (!arg) {
      const canProm = on.filter(h => h.tier < 4);
      openModal(`<div class="mpanel"><div class="lbl">Training grounds</div><h2>Promote or Drill</h2>
        <p class="mute small">Choose a hero to <b>promote +1 Tier for free</b> or drill for <b>+1 permanent attribute</b>.</p>
        ${canProm.length ? `<div class="lbl">Free Tier-Up (+1 Tier)</div><div class="evheroes">${canProm.map(h => `<button class="evhero" data-a="evPromote" data-u="${h.uid}">${iconSlot(h.key, 52)}<b>${esc(H[h.key].name)}</b><span class="small">Tier ${rom[h.tier]} → <b>${rom[h.tier + 1]}</b></span></button>`).join('')}</div>` : ''}
        <div class="lbl">Or Attribute Drill (+1 permanent stat)</div>
        <div class="evheroes">${on.map(h => `<button class="evhero" data-a="evTrainHero" data-u="${h.uid}">${iconSlot(h.key, 48)}<b>${esc(H[h.key].name)}</b><span class="small mute">Tier ${rom[h.tier]}</span></button>`).join('')}</div>
        <div class="row" style="justify-content:center"><button class="btn" data-a="evSkip">Move on</button></div></div>`, null, true);
      return;
    }
    const h = RUN.team.find(x => x.uid === arg);
    if (!h) { finishEvent(); return; }
    const st = heroStats(cfgOf(h, RUN)); const d = H[h.key];
    openModal(`<div class="mpanel pathpanel"><div class="row" style="gap:12px">${iconSlot(h.key, 56)}<div><div class="lbl">Attribute Drill</div><h2>${esc(d.name)}</h2></div></div>
      <div class="asiopts">${ATTRS.map(a => {
        const m = st.m[a], tag = st.w === a && st.k === a ? 'weapon · key' : st.w === a ? 'weapon' : st.k === a ? 'key' : '';
        return `<button class="asiopt" data-a="evTrain" data-u="${h.uid}" data-p="${a}" style="--ac:${ATTR_COL[a]}"><i>${ATTR_S2[a]}</i><b>${sgn(m)} → ${sgn(m + 1)}</b>${tag ? `<u>${tag}</u>` : ''}<span class="small">${esc(attrTip(a, d, { ...st, m: { ...st.m, [a]: m + 1 } }))}</span></button>`;
      }).join('')}</div>
      <div class="row" style="justify-content:center"><button class="btn" data-a="evTrainBack">Back</button></div></div>`, null, true);
    return;
  }

  if (k === 'quest') {
    // v0.23 Opt-In Quest Board: accept a hero's personal Quest OR accelerate an active Quest (+35%) OR take +4g bounty!
    const eligible = on.filter(h => !h.questDone && H[h.key].quest);
    openModal(`<div class="mpanel"><div class="lbl">❖ Quest Board (Opt-In)</div><h2>Accept or Advance a Personal Quest</h2>
      <p class="mute small">Accept a hero’s personal Quest to begin tracking it, boost an already-active Quest (+35%), or claim a +4g mercenary bounty.</p>
      <div class="evquests">${eligible.map(h => {
        const q = H[h.key].quest;
        const isAct = !!h.questActive;
        return `<button class="evquest" data-a="evQuestBoost" data-u="${h.uid}">${iconSlot(h.key, 48)}<span><b>${esc(H[h.key].name)} · ${esc(q.rewardName)}</b> <span class="qtag">${isAct ? 'ACTIVE · +35% BOOST' : 'ACCEPT QUEST'}</span><br><span class="small mute">${isAct ? `${Math.round(h.questProg || 0)}/${q.goal} — ` : ''}${esc(q.label)} → ${esc(q.rewardDesc)}</span></span></button>`;
      }).join('')}</div>
      <div class="row" style="justify-content:center;gap:10px;margin-top:8px"><button class="btn primary" data-a="evRest" data-p="gold">Take Bounty (+${gold(4)})</button></div></div>`, null, true);
    return;
  }

  if (k === 'rest') {
    const retrainable = on.filter(h => h.tier >= 2 && h.path && H[h.key].paths.length >= 2);
    openModal(`<div class="mpanel"><div class="lbl">♨ Campfire</div><h2>Rest, Forage, or Retrain</h2>
      <p class="mute small">Retrain any Tier II+ hero’s Specialization freely, reinforce your Piggy Bank, or forage for Gold.</p>
      ${retrainable.length ? `<div class="lbl">Retrain Tier II Specialization (Free)</div><div class="evheroes">${retrainable.map(h => {
        const curP = H[h.key].paths.find(p => p.k === h.path);
        const altP = H[h.key].paths.find(p => p.k !== h.path);
        if (!curP || !altP) return '';
        return `<button class="evhero" data-a="evRetrain" data-u="${h.uid}" data-p="${altP.k}">${iconSlot(h.key, 52)}<b>${esc(H[h.key].name)}</b><span class="small mute">${esc(curP.n)} → <b>${esc(altP.n)}</b></span></button>`;
      }).join('')}</div>` : ''}
      <div class="row" style="justify-content:center;gap:12px;margin-top:8px">
        ${!RUN.piggyBroken ? `<button class="btn big" data-a="evRest" data-p="piggy">Fill Piggy Bank (+4g saved)</button>` : ''}
        <button class="btn primary big" data-a="evRest" data-p="gold">Forage (+${gold(4)})</button>
      </div></div>`, null, true);
    return;
  }

  if (k === 'curio') {
    const C = RUN.adv.curio || rollCurioStock(RUN);
    RUN.adv.curio = C;
    openModal(`<div class="mpanel"><div class="modal-head-gold"><div><div class="lbl">⚖ Curio Merchant · Unique Class-Keyword Relics</div><h2>Curiosities for Your Party</h2></div>${goldHub(RUN.gold, { sm: true })}</div>
      <p class="mute small">Stocked with Unique Trigger &amp; Modifier relics matching your party’s Class Keywords (5g each).</p>
      <div class="evitems">${C.items.map((e, i) => {
        const it = ITEMS[e.key], R = RARITY[it.r];
        const dis = e.bought || RUN.gold < e.price || RUN.stash.length >= ECON.stash;
        const kwTag = it.cls ? `<span class="ckwtag" style="--kc:${R.col}">${esc(it.cls)} · ${esc(it.uKind || 'Unique')}</span>` : '';
        return `<button class="evitem${e.bought ? ' sold' : ''}" data-a="curioBuy" data-i="${i}" ${dis ? 'disabled' : ''}>${itemIcon(e.key, 48)}<span><b>${esc(it.n)}</b> ${kwTag} · <b style="color:${R.col}">${e.bought ? 'SOLD' : `${e.price}g`}</b><br><span class="small">${esc(itemText(e.key))}</span></span></button>`;
      }).join('')}</div>
      <div class="row" style="justify-content:center;gap:10px;margin-top:8px">
        ${!C.rerolled ? `<button class="btn gold" data-a="curioReroll" ${RUN.gold < ECON.curioReroll ? 'disabled' : ''}>Reroll Stock (${ECON.curioReroll}g)</button>` : ''}
        <button class="btn primary" data-a="evSkip">Leave Merchant</button>
      </div></div>`, null, true);
    return;
  }

  if (k === 'multiclass') {
    const n = RUN.adv.node;
    const cls = (n && n.mcClass) || MULTICLASS_KEYS[0];
    const M0 = MULTICLASS[cls];
    const elig = eligibleForMulticlass(RUN, cls);
    openModal(`<div class="mpanel"><div class="lbl">✧ Multiclass Shrine · ${esc(M0.node)}</div><h2>Dip into ${esc(cls)}</h2>
      <div class="mcpreview">${classKwPill(M0.kw, false)} <b>${esc(cls)} Dip:</b> ${glossarize(M0.x)}</div>
      <p class="mute small">Grants 1 hero (without a prior multiclass, whose base class isn’t ${esc(cls)}) this passive and unlocks ${esc(cls)} Curio items!</p>
      ${elig.length ? `<div class="evheroes">${elig.map(h => `<button class="evhero" data-a="evMulticlass" data-u="${h.uid}" data-p="${cls}">${iconSlot(h.key, 52)}<b>${esc(H[h.key].name)}</b><span class="small mute">${esc(H[h.key].cls)} + <b>${esc(cls)}</b></span></button>`).join('')}</div>`
        : `<p class="small mute" style="text-align:center">No hero in your party is eligible for ${esc(cls)} Multiclass — take a fallback reward below!</p>`}
      <div class="row" style="justify-content:center;gap:10px;margin-top:10px">
        <button class="btn" data-a="evRest" data-p="gold">Fallback: +${gold(4)}</button>
        <button class="btn" data-a="evMcAttr">Fallback: +1 Key Attribute to 1st Hero</button>
      </div></div>`, null, true);
    return;
  }

  if (k === 'mystery') {
    const M = RUN.adv.mystery;
    if (!M) { finishEvent(); return; }
    if (M.type === 'treasure') {
      RUN.adv._t = M.items;
      openModal(`<div class="mpanel"><div class="lbl">? Mystery · Hidden Cache</div><h2>${esc(M.title)}</h2>
        <div class="evitems">${M.items.map((it, i) => `<button class="evitem" data-a="evTake" data-i="${i}" data-p="treasure">${itemIcon(it, 48)}<span><b>${esc(ITEMS[it].n)}</b><br><span class="small">${esc(itemText(it))}</span></span></button>`).join('')}</div>
        <div class="row" style="justify-content:center"><button class="btn" data-a="evSkip">Leave it</button></div></div>`, null, true);
      return;
    }
    if (M.type === 'peddler') {
      openModal(`<div class="mpanel"><div class="modal-head-gold"><div><div class="lbl">? Mystery · Discount Peddler</div><h2>${esc(M.title)}</h2></div>${goldHub(RUN.gold, { sm: true })}</div>
        <div class="evitems">${M.items.map((e, i) => {
          const it = ITEMS[e.key], R = RARITY[it.r];
          const dis = e.bought || RUN.gold < e.price || RUN.stash.length >= ECON.stash;
          return `<button class="evitem${e.bought ? ' sold' : ''}" data-a="peddlerBuy" data-i="${i}" ${dis ? 'disabled' : ''}>${itemIcon(e.key, 48)}<span><b>${esc(it.n)}</b> · <b style="color:${R.col}">${e.bought ? 'SOLD' : `${e.price}g`}</b><br><span class="small">${esc(itemText(e.key))}</span></span></button>`;
        }).join('')}</div>
        <div class="row" style="justify-content:center"><button class="btn primary" data-a="evSkip">Move on</button></div></div>`, null, true);
      return;
    }
    const ev = M.event;
    const hasCost = (ev.choices || []).some(ch => ch.cost);
    openModal(`<div class="mpanel">${hasCost ? `<div class="modal-head-gold"><div><div class="lbl">? Mystery Event · ${esc(currentActModule(RUN).name)}</div><h2>${esc(ev.n)}</h2></div>${goldHub(RUN.gold, { sm: true })}</div>` : `<div class="lbl">? Mystery Event · ${esc(currentActModule(RUN).name)}</div><h2>${esc(ev.n)}</h2>`}
      <p style="line-height:1.5;margin:8px 0 14px">${esc(ev.body)}</p>
      <div class="evquests">${ev.choices.map((ch, i) => `<button class="evquest" data-a="mysteryChoice" data-i="${i}" ${ch.cost && RUN.gold < ch.cost ? 'disabled' : ''}><span><b>${esc(ch.label)}</b></span></button>`).join('')}</div></div>`, null, true);
    return;
  }

  if (k === 'treasure' || k === 'loot') {
    const T = k === 'loot' ? RUN.adv.loot : treasureOffer(RUN);
    RUN.adv._t = T;
    openModal(`<div class="mpanel"><div class="lbl">${k === 'loot' ? 'Spoils of Victory' : '◆ Treasure Cache'}</div><h2>Take one item</h2>
      <div class="evitems">${T.map((it, i) => `<button class="evitem" data-a="evTake" data-i="${i}" data-p="${k}">${itemIcon(it, 48)}<span><b>${esc(ITEMS[it].n)}</b> <small style="color:${RARITY[ITEMS[it].r].col}">(${RARITY[ITEMS[it].r].n})</small><br><span class="small">${esc(itemText(it))}</span></span></button>`).join('')}</div>
      <div class="row" style="justify-content:center"><button class="btn" data-a="evSkip" data-p="${k}">Leave it</button></div></div>`, null, true);
  }
}

/* ==========================================================================
   CAMP SHOP (Act Boss Reminder, Whole-Shop Freeze Only, Direct Equip/Drag)
   ========================================================================== */
let SHOP_SEL_ITEM = null;
const isFavMatch = (k, h) => {
  if (!k || !h) return false;
  const hooks = itemKwHooks(k);
  if (!hooks.length) return false;
  const hkw = heroKeywords(h);
  return hooks.some(x => hkw.includes(x));
};

function enterShop(alreadyOpen) {
  SHOP_SEL_ITEM = null;
  if (!alreadyOpen) {
    const fresh = openShop(RUN);
    if (!fresh) toast('Your frozen shop is waiting.');
  }
  renderShop(); show('shop'); saveRun();
}

function renderShop() {
  const R = RUN;
  if (SHOP_SEL_ITEM != null && !R.stash[SHOP_SEL_ITEM]) SHOP_SEL_ITEM = null;
  const actMod = currentActModule(R);
  $('shopStats').innerHTML = `<div class="stat"><b>${actOf(R)}</b><span>Act</span></div><div class="stat"><b>${R.stats.won}</b><span>Wins</span></div>${goldHub(R.gold)}<div class="stat"><b>${piggyTxt()}</b><span>Piggy Bank</span></div>`;

  // v0.23 Camp Shop Flow Flip: Act Boss Reminder banner (NO combat spoiler!) — except Piggy Bank Retry!
  if (R.adv && R.adv.retryPending && R.next) {
    const N = R.next;
    const foesHtml = N.foes.map(k => `<img src="${portraitURL(k)}" class="${E[k].elite || E[k].boss ? 'el' : ''}" alt="${esc(E[k].name)}" title="${esc(E[k].name)}">`).join('');
    $('nextFight').innerHTML = `<div><div class="lbl">Piggy Bank Retry (${Math.round((1 - Math.pow(CURVE.retry, R.retries || 1)) * 100)}% softer)</div><h3>Retry: ${esc(N.n)}${N.boss ? '<span class="bossb">BOSS</span>' : ''}</h3><div class="q">${esc(N.q)}</div><div class="foes">${foesHtml}</div></div>
      <div style="display:grid;gap:6px;justify-items:end"><button class="btn primary big" data-a="tobattle">Retry Battle →</button></div>`;
  } else {
    const bossKey = (R.adv && R.adv.actBoss) || 'nezznar';
    const bossEnc = ENC[bossKey] || ENC.nezznar;
    const bossUnit = bossEnc.u && bossEnc.u[0] ? bossEnc.u[0][0] : 'nezznar';
    $('nextFight').innerHTML = `<div class="row" style="gap:14px;align-items:center"><img src="${portraitURL(bossUnit)}" class="el" style="width:52px;height:52px;border-radius:50%;border:2px solid #d0a02a" alt=""><div><div class="lbl">Camp Shop · Act ${actOf(R)}: ${esc(actMod.name)}</div><h3>Act Boss Reminder: ${esc(bossEnc.n)}</h3><div class="q">${esc(bossEnc.note)}</div></div></div>
      <div style="display:grid;gap:6px;justify-items:end"><button class="btn primary big" data-a="toMap">Choose Next Path →</button></div>`;
  }

  const on = R.team;
  const selItemKey = SHOP_SEL_ITEM != null ? R.stash[SHOP_SEL_ITEM] : null;
  const tc = {}, kc = {};
  on.forEach(h => {
    tagsOf(h.key).forEach(t => tc[t] = (tc[t] || 0) + 1);
    heroKeywords(h).forEach(kwk => kc[kwk] = (kc[kwk] || 0) + 1);
    (h.items || []).forEach(ik => itemKwHooks(ik).forEach(kwk => kc[kwk] = (kc[kwk] || 0) + 1));
  });
  const partyTagSet = new Set(Object.keys(tc));
  const partyKwSet = new Set(Object.keys(kc));

  $('boardCount').textContent = `${on.length} of ${ECON.board}`;
  $('slots').innerHTML = on.map(h => partyChip(h, selItemKey)).join('') + Array.from({ length: Math.max(0, ECON.board - on.length) }, () => `<div class="pchip empty">Empty</div>`).join('');
  const partyKwHtml = Object.entries(kc).sort((a, b) => b[1] - a[1]).map(([kwk]) => classKwPill(kwk, false)).join('');
  const partyTagHtml = Object.entries(tc).sort((a, b) => b[1] - a[1]).map(([t, n]) => tagPill(t, n)).join('');
  $('partyTags').innerHTML = partyKwHtml + partyTagHtml;

  $('stashCount').textContent = `${R.stash.length} of ${ECON.stash}`;
  $('stash').innerHTML = R.stash.length
    ? R.stash.map((k, i) => `<span class="sitem${SHOP_SEL_ITEM === i ? ' sel' : ''}" draggable="true" data-stash-i="${i}" data-a="stashSelect" data-i="${i}" title="${esc(ITEMS[k].n)}: ${esc(itemText(k))}">${itemIcon(k, 38)}</span>`).join('')
    : `<span class="small mute">Empty</span>`;

  const actBox = $('shopStashAct');
  if (actBox) {
    if (selItemKey) {
      actBox.innerHTML = `<div class="stashact"><div><b>${esc(ITEMS[selItemKey].n)}</b><div class="small mute">${esc(itemText(selItemKey))}</div></div>
        <div class="row" style="gap:6px;margin-top:4px"><span class="small" style="color:#2d6a3a;font-weight:700">Click a hero below to equip</span>
        <button class="btn sm" data-a="sellItem" data-i="${SHOP_SEL_ITEM}">Sell ${itemRefund(R, selItemKey)}g</button>
        <button class="btn sm" data-a="stashClear">Cancel</button></div></div>`;
    } else {
      actBox.innerHTML = '';
    }
  }

  $('offers').innerHTML = R.shop.heroes.map((k, i) => heroOfferCard(k, i, partyTagSet, partyKwSet)).join('');
  $('itemOffers').innerHTML = R.shop.items.map((k, i) => itemOfferCard(k, i, partyKwSet)).join('');

  const sp = $('shopPurse');
  if (sp) sp.innerHTML = `<span class="coin"></span><b>${R.gold}</b><span class="sp-lbl">gold</span>`;
  const rp = rerollPrice(R);
  $('rerollBtn').innerHTML = `Reroll · ${gold(rp)}`; $('rerollBtn').disabled = R.gold < rp;
  $('freezeBtn').textContent = R.shop.frozen ? '❄ Shop Frozen' : 'Freeze Shop';
  $('freezeBtn').classList.toggle('primary', !!R.shop.frozen);
  const ho = heroTierOdds(encounterCount(R)).map(x => Math.round(x * 100));
  const io = itemRarityOdds(encounterCount(R)).map(x => Math.round(x * 100));
  $('shopNote').innerHTML = `Heroes: T1 ${ho[0]}% · T2 ${ho[1]}% · T3 ${ho[2]}% &nbsp;|&nbsp; Items: C ${io[0]}% · U ${io[1]}% · R ${io[2]}% · VR ${io[3]}% · L ${io[4]}%`;
  paintCanvases($('shop')); paintTokens($('shop'));
  document.querySelectorAll('#offers canvas[data-osplash]').forEach(c => drawSplash(c, c.dataset.osplash, 240, 200));
  checkPendingPath();
}

function heroOfferCard(k, i, partyTagSet, partyKwSet) {
  const kind = (RUN.shop.slotKind && RUN.shop.slotKind[i]) || (i === 2 ? 'upgrade' : 'recruit');
  if (!k) return `<div class="ho18 sold"><span class="small mute">${kind === 'upgrade' ? 'Upgrade slot · Sold' : 'Recruit slot · Sold'}</span></div>`;
  const d = H[k], o = heroOffer(RUN, k, i), ot = o.offerTier || 1;
  const can = !o.maxed && RUN.gold >= o.price;
  const slotBadge = o.upgrade ? `<span class="slotbadge upg">UPGRADE</span>` : `<span class="slotbadge rec">RECRUIT</span>`;
  const own = o.upgrade ? `<div class="ownline">Tier ${rom[o.offerTier]} copy · Upgrades Tier ${rom[o.upgrade.tier]} → <b>Tier ${rom[o.tier]}</b></div>` : (ot >= 2 ? `<div class="ownline">Pre-tiered <b>Tier ${rom[ot]}</b> recruit (pick Specialization)</div>` : '');
  const ckwHtml = (d.ckw || []).map(e => classKwPill(e.k, !!(partyKwSet && partyKwSet.has(e.k)), e.sub)).join('');
  const ckwLine = (d.ckw && d.ckw[0]) ? `<div class="hoab kwline"><b>${esc(CLASS_KW[d.ckw[0].k].n)}</b> ${esc(d.ckw[0].x)}</div>` : '';
  const tagHtml = tagsOf(k).map(t => {
    const D = TAGDEF[t]; if (!D) return '';
    const match = partyTagSet && partyTagSet.has(t);
    return `<span class="tag18${match ? ' syn' : ''}" style="--tc:${D.c}" data-tn="${esc(D.n)}${match ? ' (Party Match)' : ''}" data-tip="${esc(D.x)}">${match ? '★ ' : ''}${esc(D.n)}</span>`;
  }).join('');
  return `<div class="ho18${RUN.shop.frozen ? ' locked' : ''}${can ? '' : ' poor'}" style="--tc:${TIERCOL[ot]}" data-a="${o.maxed ? 'offerCard' : 'buyHero'}" data-i="${i}">
    <div class="hoart"><canvas data-osplash="${k}"></canvas>${slotBadge}<span class="hotier">${rom[ot]}</span>${o.sale ? `<span class="salebadge">−${o.sale}</span>` : ''}</div>
    <div class="hob"><div class="hon">${esc(d.name)}</div><div class="hoc">${esc(d.cls)} · ${esc(d.role)}</div><div class="hotags">${ckwHtml}${tagHtml}</div>${ckwLine}<div class="hoab"><b>${esc(d.abil.n)}</b> ${esc(abil1(k))}</div>${own}</div>
    <div class="hof"><b class="price">${o.maxed ? 'Max' : gold(o.price)}</b><button class="btn sm" data-a="offerCard" data-i="${i}">Card</button></div></div>`;
}

function partyChip(h, selItemKey) {
  const d = H[h.key], path = h.path ? d.paths.find(p => p.k === h.path) : null;
  const q = d.quest;
  const showQuest = q && (h.questActive || h.questDone);
  const qPct = showQuest ? (h.questDone ? 100 : Math.round(Math.min(1, (h.questProg || 0) / q.goal) * 100)) : 0;
  const maxS = slotsOf(h);
  let eqCls = '', favBadge = '';
  if (selItemKey) {
    const canEq = h.items.length < maxS && canCarry(h, selItemKey);
    const fav = canEq && isFavMatch(selItemKey, h);
    eqCls = fav ? ' can-equip fav-match' : canEq ? ' can-equip' : ' no-equip';
    if (fav) favBadge = `<span class="favpill">★ Synergy</span>`;
  }
  const itemsRow = `<div class="pitems">${Array.from({ length: maxS }, (_, j) => h.items[j]
    ? `<span class="pit" data-a="shopUnequip" data-u="${h.uid}" data-i="${j}" title="${esc(ITEMS[h.items[j]].n)}: click to unequip">${itemIcon(h.items[j], 22)}</span>`
    : `<span class="pit empty" title="Empty item slot"></span>`).join('')}</div>`;
  const questRow = showQuest ? `<div class="chipq${h.questDone ? ' done' : ''}" title="${esc(q.rewardName)}: ${esc(q.rewardDesc)}"><div class="cqbar"><i style="width:${qPct}%"></i></div><span>${h.questDone ? '★ Quest Done' : `${Math.round(h.questProg || 0)}/${q.goal}`}</span></div>` : '';
  const badges = `${h.multiclass ? `<span class="mcpill" title="Multiclass: ${esc(h.multiclass)}">✧ ${esc(h.multiclass)}</span>` : ''}${h.boon ? `<span class="boonpill" title="${esc(EPIC_BOONS[h.boon].n)}">★ Boon</span>` : ''}`;
  return `<div class="pchip${eqCls}" style="--tc:${TIERCOL[h.tier]}" data-drop-hero="${h.uid}" ${selItemKey ? `data-a="shopEquip" data-u="${h.uid}"` : ''}>
    <span data-a="${selItemKey ? 'shopEquip' : 'card'}" data-u="${h.uid}" title="${selItemKey ? 'Click to equip selected item' : 'View full card'}">${iconSlot(h.key, 42)}</span>
    <div style="min-width:0"><b>${esc(d.name)}</b> <span class="tb">${rom[h.tier]}</span>${badges}${favBadge}
      <div class="small mute">${path ? esc(path.n) : h.tier >= 2 ? `<button class="needpath" data-a="path" data-u="${h.uid}">Choose Spec</button>` : esc(d.cls)}</div>
      ${itemsRow}${questRow}
    </div>
    <button class="btn sm" data-a="sell" data-u="${h.uid}" ${RUN.team.length <= 1 ? 'disabled' : ''}>Sell ${heroValue(h.tier)}</button></div>`;
}

function itemOfferCard(k, i, partyKwSet) {
  if (!k) return `<div class="io18 sold"><span class="small mute">Sold</span></div>`;
  const it = ITEMS[k], R = RARITY[it.r], p = itemPrice(RUN, i);
  const kwMatches = itemKwHooks(k).filter(kwk => partyKwSet && partyKwSet.has(kwk)).map(kwk => CLASS_KW[kwk].n);
  const favLine = kwMatches.length ? `<div class="iofav kw">★ Synergy: ${esc(kwMatches.slice(0, 2).join(', '))}</div>` : '';
  return `<div class="io18${RUN.shop.frozen ? ' locked' : ''}${kwMatches.length ? ' hasfav' : ''}" data-a="buyItem" data-i="${i}" title="${esc(it.n)}: ${esc(itemText(k))}">${itemIcon(k, 36)}<div><div class="inm">${esc(it.n)}</div><div class="rar" style="color:${R.col}">${R.n} · ${gold(p)}</div><div class="small mute">${esc(itemStatsText(it))}</div>${favLine}</div></div>`;
}

function heroCardHtml(h, extra) {
  const cfg = cfgOf(h, RUN);
  const items = h.items.length ? `<div class="citems"><span class="lbl">Carrying (${h.items.length}/${slotsOf(h)})</span>${h.items.map(k => `<div>${itemIcon(k, 28)}<span><b>${esc(ITEMS[k].n)}</b> · ${glossarize(itemText(k))}</span></div>`).join('')}</div>` : '';
  return largeCard(h.key, h.tier, { cfg, heroObj: h, items, foot: extra || '' });
}
function heroCardModal(h, extra) { openModal(heroCardHtml(h, extra)); }

function pathModal(h, sel) {
  const d = H[h.key]; sel = sel || d.paths[0].k; const cfg = { ...cfgOf(h, RUN), path: sel };
  const opt = p => `<button class="pathopt${p.k === sel ? ' sel' : ''}" data-a="previewPath" data-u="${h.uid}" data-p="${p.k}"><b>${esc(p.n)}</b>
    <span class="ptags">${p.attr ? `<span class="grow" style="--ac:${ATTR_COL[p.attr]}">+1 ${ATTR_S2[p.attr]}</span>` : ''}${(p.tags || []).map(t => tagPill(t)).join('')}</span>
    <span>${glossarize(p.x)}</span></button>`;
  openModal(`<div class="mpanel pathpanel"><div class="row" style="gap:12px;flex-wrap:nowrap">${iconSlot(h.key, 64)}<div><div class="lbl">${esc(d.name)} reaches Tier II</div><h2>Choose ${esc(d.name)}’s Specialization</h2></div></div>
    <p class="mute small">Pick one Specialization (retrainable freely at any Campfire).</p>
    <div class="pathopts">${d.paths.map(opt).join('')}</div>
    <div class="pathprev">${largeCard(h.key, h.tier, { cfg, heroObj: h, previewPath: sel, compact: 1 })}</div>
    <div class="row" style="justify-content:center"><button class="btn primary big" data-a="choosePath" data-u="${h.uid}" data-p="${sel}">Choose ${esc(d.paths.find(p => p.k === sel).n)}</button></div></div>`, null, true);
}

function swapModal(i) {
  const k = RUN.shop.heroes[i], o = heroOffer(RUN, k, i);
  openModal(`<div class="mpanel"><div class="lbl">Party is full (4/4)</div><h2>Replace who with ${esc(H[k].name)} (Tier ${rom[o.tier]})?</h2>
    <p class="small mute">Replaced hero refunds full gold worth and returns their items to stash.</p>
    <div class="evheroes">${RUN.team.map(h => `<button class="evhero" data-a="swapBuy" data-i="${i}" data-u="${h.uid}">${iconSlot(h.key, 52)}<b>${esc(H[h.key].name)}</b><span class="small mute">Tier ${rom[h.tier]} · refunds ${heroValue(h.tier)}g</span></button>`).join('')}</div>
    <div class="row" style="justify-content:center"><button class="btn" data-a="closeModal">Cancel</button></div></div>`);
}

/* ---------- Placement & Combat ---------- */
let SEL_ITEM = null, BATTLE_FEED = [], INSPECT = null, _inspSig = '';
const MAP_TILE_INFO = [
  ['O', 'Pillar / Tree', 'Blocks move & sight'],
  ['c', 'Crates / Tables', 'Blocks move, not sight'],
  [',', 'Rough Terrain', 'Slows movement'],
  ['v', 'Tall Brush', 'Conceals units inside'],
  ['~', 'Deep Water', 'Blocks move, not sight'],
  ['_', 'Chasm', 'Pushed units fall in'],
  ['^', 'Fire', 'Burns units on tile'],
  ['w', 'Web', 'Roots units for 1.2s'],
  ['a', 'Arrow Slit', 'Blocks move, allows sight'],
  ['x', 'Powder Barrel', 'Explodes from fire/AoE']
];

const hasRightInspector = () => window.innerWidth >= 1020 && !!$('cCardSlot') && !$('combat').hidden;

function renderItemTray() {
  const pb = $('pbench'); if (!pb) return;
  if (B || !RUN.stash.length) { pb.hidden = true; return; }
  pb.hidden = false;
  pb.innerHTML = `<div class="pbench-head"><span class="lbl">Stash</span><span class="small mute">${RUN.stash.length}</span></div><div class="pbench-list">` + RUN.stash.map((k, i) =>
    `<button class="titem${SEL_ITEM === i ? ' sel' : ''}" data-a="trayItem" data-i="${i}" title="${esc(ITEMS[k].n)}: ${esc(itemText(k))}">${itemIcon(k, 26)}<span>${esc(ITEMS[k].n)}</span></button>`
  ).join('') + `</div>` + (SEL_ITEM != null ? `<div class="pbench-tip">Click hero to equip</div>` : '');
}

function defaultInspect() {
  if (!B) {
    const foes = setupUnits().filter(x => x.side === 'E').sort((a, b) => (b.boss ? 2 : b.elite ? 1 : 0) - (a.boss ? 2 : a.elite ? 1 : 0));
    if (foes.length) return { kind: 'enemy', idx: foes[0].idx };
    const hs = boardHeroes(RUN);
    return hs.length ? { kind: 'hero', key: hs[0].key } : null;
  }
  const foes = B.units.filter(x => x.side === 'E' && x.alive).sort((a, b) => (b.boss ? 2 : b.elite ? 1 : 0) - (a.boss ? 2 : a.elite ? 1 : 0));
  if (foes.length) return { kind: 'enemy', uid: foes[0].id };
  const hs = boardHeroes(RUN);
  return hs.length ? { kind: 'hero', key: hs[0].key } : null;
}

function goPlacement() {
  clearTimeout(_resTimer); _resTimer = 0;
  B = null; running = false; paused = false; FX = []; resultShown = false; SEL_ITEM = null; BATTLE_FEED = []; _inspSig = '';
  if (typeof HOVER_HERO !== 'undefined') HOVER_HERO = null;
  if (typeof HOVER_ENEMY !== 'undefined') HOVER_ENEMY = null;
  autoPlace(RUN); S.party = boardHeroes(RUN); S.sel = null; S.selE = null;
  loadMap(ENC.run.map); mapDirty = true; _setupKey = '';
  INSPECT = defaultInspect();
  $('result').hidden = true; show('combat'); renderCombatBar(); renderStrip(); renderInspector(); renderIntel();
  requestAnimationFrame(() => resize());
  const hazTxt = RUN.next && RUN.next.hazard && HAZARDS[RUN.next.hazard] ? ` Hazard: ${HAZARDS[RUN.next.hazard].n} (${HAZARDS[RUN.next.hazard].x})` : '';
  $('hint').hidden = false; $('hint').textContent = 'Drag heroes onto gold deploy squares, then begin.' + hazTxt;
  saveRun();
}

function renderCombatBar() {
  const N = RUN.next;
  const hazChip = N && N.hazard && HAZARDS[N.hazard] ? ` <span class="hazchip">${HAZARDS[N.hazard].g} ${esc(HAZARDS[N.hazard].n)}</span>` : '';
  $('cTitle').innerHTML = `${advLabel()} · ${esc(N.n)}${N.boss ? ' <span class="bossb">BOSS</span>' : ''}${hazChip}`;
  $('cSub').textContent = (ENC.run && ENC.run.note) || N.q || '';
  $('cStats').innerHTML = `${goldHub(RUN.gold, { dark: true, extra: '<span class="gh-loot" id="cGold" hidden></span>' })}<span class="cmeta"><span title="Piggy Bank">Piggy ${piggyTxt()}</span><span class="csep">·</span><span>Wins ${RUN.stats.won}</span></span>`;
  const sp = [0.5, 1, 2, 4].map(v => `<button class="btn${S.speed === v ? ' on' : ''}" data-a="spd" data-v="${v}">${v}×</button>`).join('');
  $('cCtl').innerHTML = B
    ? `<span class="ctimer" id="cTimer">⏱ ${B.time.toFixed(1)}s</span>${sp}<button class="btn" data-a="pause">${paused ? 'Resume' : 'Pause'}</button><button class="btn" data-a="sound">${S.sound ? 'Sound' : 'Muted'}</button><button class="btn" data-a="btext">${BTXT === 'all' ? 'All txt' : 'Key txt'}</button>`
    : `<button class="btn" data-a="autoplace">Auto place</button><button class="btn primary" data-a="begin-battle">Begin battle</button>`;
}

function startBattle() {
  clearTimeout(_resTimer); _resTimer = 0;
  if ($('pbench')) $('pbench').hidden = true;
  if (typeof HOVER_HERO !== 'undefined') HOVER_HERO = null;
  if (typeof HOVER_ENEMY !== 'undefined') HOVER_ENEMY = null;
  B = newBattle('run', partyCfg(RUN), 1);
  running = true; paused = false; resultShown = false; FX = []; simAcc = 0; BATTLE_FEED = []; _inspSig = '';
  // Carry over inspected hero, or map inspected setup enemy to live enemy unit
  if (!INSPECT) INSPECT = defaultInspect();
  else if (INSPECT.kind === 'enemy') {
    const liveE = B.units.filter(x => x.side === 'E');
    const match = (INSPECT.idx != null && liveE[INSPECT.idx]) || liveE.sort((a, b) => (b.boss ? 2 : b.elite ? 1 : 0) - (a.boss ? 2 : a.elite ? 1 : 0))[0];
    INSPECT = match ? { kind: 'enemy', uid: match.id } : defaultInspect();
  }
  $('hint').hidden = true; renderCombatBar(); renderStrip(); renderInspector(); renderIntel();
  requestAnimationFrame(() => resize());
}

function renderStrip() {
  const hs = boardHeroes(RUN);
  renderItemTray();
  $('strip').innerHTML = hs.map(h => {
    const st = heroStats(cfgOf(h, RUN));
    const shortName = H[h.key].name.replace(/^(Mother|Brother|Sister|Sir|Old)\s+/i, '').split(' ')[0];
    const active = INSPECT && INSPECT.kind === 'hero' && INSPECT.key === h.key ? ' active' : '';
    return `<button class="pc${active}" style="${roleStyle(h.key, h.tier)}" data-a="pcard" data-u="${h.uid}" data-key="${h.key}" data-hover-hero="${h.key}" title="${esc(H[h.key].name)} · Click to view Hero Card">
      ${iconSlot(h.key, 36)}
      <div class="pc-body">
        <div class="pc-top"><span class="pc-name-wrap"><span class="pn">${esc(shortName)}</span><i class="pc-tier">${rom[h.tier]}${h.questDone ? '★' : ''}</i></span></div>
        <div class="pbar"><i style="width:100%"></i><u style="left:100%;width:0"></u><s style="width:0"></s></div>
        <div class="pbar ch"><i style="width:0"></i></div>
        <div class="pc-sub"><span class="pc-hp">${st.maxHp}</span><span class="pc-tags"></span></div>
        ${!B ? `<div class="pitems">${Array.from({ length: slotsOf(h) }, (_, j) => h.items[j] ? `<span class="pit" data-a="trayOff" data-u="${h.uid}" data-i="${j}" title="${esc(ITEMS[h.items[j]].n)}: click to unequip">${itemIcon(h.items[j], 18)}</span>` : `<span class="pit empty"></span>`).join('')}</div>` : ''}
      </div>
    </button>`;
  }).join('');
  paintTokens($('strip')); paintCanvases($('strip')); updateStrip();
}

function renderInspectorPicks() {
  const box = $('inspPicks'); if (!box || !RUN) return;
  const hs = boardHeroes(RUN);
  const heroBtns = hs.map(h => {
    const on = INSPECT && INSPECT.kind === 'hero' && INSPECT.key === h.key ? ' on' : '';
    const dead = B && !B.units.some(x => x.side === 'P' && !x.minion && x.key === h.key && x.alive) ? ' dead' : '';
    return `<button class="ipick p${on}${dead}" data-a="inspHero" data-key="${h.key}" data-hover-hero="${h.key}" title="${esc(H[h.key].name)}">${iconSlot(h.key, 26)}</button>`;
  }).join('');

  let foeBtns = '';
  if (!B) {
    const seen = new Set();
    const list = setupUnits().filter(x => x.side === 'E').sort((a, b) => (b.boss ? 2 : b.elite ? 1 : 0) - (a.boss ? 2 : a.elite ? 1 : 0));
    const unique = list.filter(x => { if (seen.has(x.key)) return false; seen.add(x.key); return true; });
    foeBtns = unique.map(su => {
      const on = INSPECT && INSPECT.kind === 'enemy' && (INSPECT.idx === su.idx || (INSPECT.idx != null && setupUnits().find(x => x.side === 'E' && x.idx === INSPECT.idx)?.key === su.key)) ? ' on' : '';
      return `<button class="ipick e${su.boss ? ' boss' : ''}${on}" data-a="inspEnemy" data-idx="${su.idx}" data-hover-enemy="${su.idx}" title="${esc(su.name)}"><img src="${portraitURL(su.key)}" alt="" /></button>`;
    }).join('');
  } else {
    const seen = new Set();
    const list = B.units.filter(x => x.side === 'E').slice().sort((a, b) => (b.boss ? 2 : b.elite ? 1 : 0) - (a.boss ? 2 : a.elite ? 1 : 0) || (b.alive - a.alive));
    const unique = list.filter(x => { if (seen.has(x.key)) return false; seen.add(x.key); return true; });
    foeBtns = unique.map(u => {
      const on = INSPECT && INSPECT.kind === 'enemy' && INSPECT.uid === u.id ? ' on' : '';
      return `<button class="ipick e${u.boss ? ' boss' : ''}${on}${u.alive ? '' : ' dead'}" data-a="inspEnemy" data-uid="${u.id}" data-hover-uid="${u.id}" title="${esc(u.name)}"><img src="${portraitURL(u.key)}" alt="" /></button>`;
    }).join('');
  }
  box.innerHTML = `${heroBtns}<span class="ipick-sep"></span>${foeBtns}`;
  paintTokens(box);
}

function renderInspector() {
  const slot = $('cCardSlot'); if (!slot || !RUN) return;
  if (!INSPECT) INSPECT = defaultInspect();
  renderInspectorPicks();
  document.querySelectorAll('#strip .pc').forEach(el => {
    el.classList.toggle('active', !!(INSPECT && INSPECT.kind === 'hero' && INSPECT.key === el.dataset.key));
  });
  if (!INSPECT) {
    slot.innerHTML = `<div class="insp-empty small mute">Click any hero or enemy on the board to view their card.</div>`;
    _inspSig = '';
    return;
  }
  if (INSPECT.kind === 'hero') {
    const h = RUN.team.find(x => x.key === INSPECT.key);
    if (!h) { INSPECT = defaultInspect(); if (INSPECT) return renderInspector(); return; }
    const sig = `h:${h.key}:${h.tier}:${h.items.join(',')}:${B ? 1 : 0}`;
    if (sig !== _inspSig) {
      slot.innerHTML = `${B ? `<div class="insp-live" id="inspLive"></div>` : ''}<div class="insp-card-wrap">${heroCardHtml(h, '')}</div>`;
      paintCanvases(slot); paintTokens(slot);
      _inspSig = sig;
    }
    updateInspectorLive();
    return;
  }
  if (INSPECT.kind === 'enemy') {
    const en = B
      ? (B.units.find(x => x.id === INSPECT.uid) || B.units.find(x => x.side === 'E'))
      : previewEnemy(INSPECT.idx);
    if (!en) { INSPECT = defaultInspect(); if (INSPECT) return renderInspector(); return; }
    const sig = `e:${B ? en.id : INSPECT.idx}:${en.key}:${B ? 1 : 0}`;
    if (sig !== _inspSig) {
      slot.innerHTML = `${B ? `<div class="insp-live foe" id="inspLive"></div>` : ''}<div class="insp-ecard">${enemyCard(en, B)}</div>`;
      _inspSig = sig;
    }
    updateInspectorLive();
  }
}

function updateInspectorLive() {
  if (!B || !INSPECT) return;
  const el = $('inspLive'); if (!el) return;
  let u = null;
  if (INSPECT.kind === 'hero') u = B.units.find(x => x.side === 'P' && !x.minion && x.key === INSPECT.key);
  else if (INSPECT.kind === 'enemy') u = B.units.find(x => x.id === INSPECT.uid);
  if (!u) return;
  const hp = Math.max(0, Math.round(u.hp)), ward = Math.max(0, Math.round(u.ward || 0)), nec = Math.max(0, Math.round(u.nec || 0));
  const totalCap = Math.max(u.maxHp, hp + ward);
  const hpPct = (hp / totalCap) * 100, wardPct = Math.min(100 - hpPct, (ward / totalCap) * 100), necPct = Math.min(100, (nec / totalCap) * 100);
  const tags = u.alive && typeof unitStatusTags === 'function' ? unitStatusTags(u).slice(0, 4) : [];
  const statsTxt = u.side === 'P'
    ? `⚔ ${Math.round(u.stats.dmg || 0)}${(u.stats.heal || u.stats.ward) ? ` · ✚ ${Math.round((u.stats.heal || 0) + (u.stats.ward || 0))}` : ''} · Chg ${Math.round(u.charge || 0)}%`
    : `AC ${curAC(B, u)} · SR ${curSR(B, u)}${u.abil ? ` · Chg ${Math.round(u.charge || 0)}%` : ''}`;
  el.innerHTML = `<div class="il-top"><b>${u.alive ? `${hp}/${u.maxHp}${ward ? ` +${ward}⛨` : ''}` : 'FALLEN'}</b><span>${statsTxt}</span></div>
    <div class="pbar${u.side === 'E' ? ' foe' : ''}"><i style="width:${hpPct}%"></i><u style="left:${hpPct}%;width:${wardPct}%"></u><s style="width:${necPct}%"></s></div>
    ${tags.length ? `<div class="il-tags">${tags.map(([t, c]) => `<span class="mtag" style="--mc:${c}">${esc(t)}</span>`).join('')}</div>` : ''}`;
}

function renderIntel() {
  const box = $('cIntel'); if (!box) return;
  const N = RUN && RUN.next;
  const haz = N && N.hazard && HAZARDS[N.hazard] ? HAZARDS[N.hazard] : null;
  const hazHtml = haz ? `<div class="intel-haz"><b>${haz.g} ${esc(haz.n)}</b><span>${esc(haz.x)}</span></div>` : '';
  if (!B) {
    const waves = previewWaves();
    const waveHtml = waves.length ? `<div class="intel-sec"><div class="lbl">Reinforcements</div>${waves.map(w =>
      `<div class="intel-row"><b>${w.at}s</b><span>${w.u.map(([k]) => esc((E[k] && E[k].name) || k)).join(', ')}</span></div>`
    ).join('')}</div>` : '';
    const present = new Set();
    if (MAP) MAP.forEach(row => row.forEach(ch => present.add(ch)));
    const theme = (ENC[S.enc] && ENC[S.enc].theme) || 'dungeon';
    const tiles = MAP_TILE_INFO.filter(([ch]) => present.has(ch));
    const terrainHtml = tiles.length ? `<div class="intel-sec"><div class="lbl">Arena Terrain</div><div class="mleg compact">${tiles.map(([ch, n, desc]) =>
      `<div class="mleg-item" title="${esc(desc)}"><img src="${tileIcon(ch, theme)}" alt="" /><span><b>${esc(n)}</b> · ${esc(desc)}</span></div>`
    ).join('')}</div></div>` : '';
    box.innerHTML = `${hazHtml}${waveHtml}${terrainHtml}`;
    box.hidden = !(hazHtml || waveHtml || terrainHtml);
    return;
  }
  box.hidden = false;
  box.innerHTML = `${hazHtml}<div class="wing-subhead"><span class="lbl">Battle Log</span><span class="small mute">Key events</span></div><div class="feed" id="battleFeed"><div class="feed-empty small mute">Battle underway…</div></div>`;
  renderBattleFeed();
}

function pushBattleFeed(e, u) {
  if (!B) return;
  const t = `${B.time.toFixed(1)}s`;
  let item = null;
  if (e.k === 'roll') {
    const nat20 = e.nat === 20 && e.band === 2 && !/·/.test(e.name || '');
    const isP = e.side !== 'E';
    if (nat20) item = { t, col: '#ffdf6a', txt: `${u.name.split(' ')[0]} NAT 20 · ${e.name.split(' · ')[0]}` };
    else if (isP && e.band === 2 && !e.follow) item = { t, col: '#ffc23d', txt: `${u.name.split(' ')[0]} rolled ${e.nat} (High) · ${e.name.split(' · ')[0]}` };
    else if (isP && e.band === -1) item = { t, col: '#ff9c94', txt: `${u.name.split(' ')[0]} fizzled (${e.nat})` };
    else if (!isP && (u.boss || u.elite) && e.band >= 1) item = { t, col: '#ff8a7a', txt: `${u.name} cast ${e.name.split(' · ')[0]} (${e.nat})` };
  } else if (e.k === 'callout' && e.txt) {
    item = { t, col: e.col || '#ffd76a', txt: `${u ? u.name.split(' ')[0] + ': ' : ''}${e.txt}` };
  } else if (e.k === 'die' && u) {
    item = { t, col: u.side === 'P' ? '#ff6a6a' : '#8ef09e', txt: u.side === 'P' ? `${u.name} fell!` : `${u.name} defeated` };
  } else if (e.k === 'wave') {
    item = { t, col: '#ff9c94', txt: 'Reinforcements arrived!' };
  } else if (e.k === 'overtime' && e.lvl > 0) {
    item = { t, col: '#ffd76a', txt: e.lvl === 1 ? 'Overtime begins!' : `Overtime ×${e.lvl}` };
  } else if (e.k === 'boom') {
    item = { t, col: '#ffb04a', txt: 'Powder barrel detonated!' };
  }
  if (!item) return;
  BATTLE_FEED.unshift(item);
  if (BATTLE_FEED.length > 14) BATTLE_FEED.length = 14;
  renderBattleFeed();
}

function renderBattleFeed() {
  const el = $('battleFeed'); if (!el) return;
  if (!BATTLE_FEED.length) { el.innerHTML = `<div class="feed-empty small mute">Battle underway…</div>`; return; }
  el.innerHTML = BATTLE_FEED.map(f => `<div class="feed-row"><span class="feed-t">${f.t}</span><span class="feed-x" style="color:${f.col}">${esc(f.txt)}</span></div>`).join('');
}

function updateStrip() {
  if (PHASE !== 'combat') return;
  const cg = $('cGold'); if (cg) { const lg = B && B.gold ? Math.round(B.gold) : 0; cg.hidden = !lg; if (lg) cg.textContent = `+${lg}g`; }

  document.querySelectorAll('#strip .pc').forEach(el => {
    const u = B && B.units.find(x => x.side === 'P' && !x.minion && x.key === el.dataset.key);
    const bars = el.querySelectorAll('.pbar');
    if (!u) {
      bars[0].querySelector('i').style.width = '100%'; bars[0].querySelector('u').style.width = '0'; bars[0].querySelector('s').style.width = '0';
      return;
    }
    const hp = Math.max(0, u.hp), ward = Math.max(0, u.ward || 0), nec = Math.max(0, u.nec || 0);
    const totalCap = Math.max(u.maxHp, hp + ward);
    const hpPct = (hp / totalCap) * 100;
    const wardPct = Math.min(100 - hpPct, (ward / totalCap) * 100);
    const necPct = Math.min(100, (nec / totalCap) * 100);
    bars[0].querySelector('i').style.width = hpPct + '%';
    const wu = bars[0].querySelector('u'); wu.style.left = hpPct + '%'; wu.style.width = wardPct + '%';
    bars[0].querySelector('s').style.width = necPct + '%';
    const ci = bars[1].querySelector('i'); ci.style.width = (u.charge || 0) + '%'; ci.classList.toggle('full', u.charge >= 100);
    const hpEl = el.querySelector('.pc-hp');
    if (hpEl) hpEl.textContent = u.alive ? `${Math.round(hp)}${ward >= 1 ? `+${Math.round(ward)}` : ''}` : 'Fell';
    const tagsEl = el.querySelector('.pc-tags');
    if (tagsEl) {
      const list = [];
      if (u.alive) {
        const ct = tokenCounter(u); if (ct) list.push(ct);
        if (typeof unitStatusTags === 'function') unitStatusTags(u).forEach(t => { if (list.length < 1) list.push(t); });
      }
      const html = list.slice(0, 1).map(([t, c]) => `<span class="mtag" style="--mc:${c}">${esc(t)}</span>`).join('');
      if (tagsEl.dataset.h !== html) { tagsEl.innerHTML = html; tagsEl.dataset.h = html; }
    }
    el.classList.toggle('dead', !u.alive);
  });
  updateInspectorLive();
}
setInterval(updateStrip, 120);

function liveLine(key) {
  const u = B && B.units.find(x => x.side === 'P' && x.key === key); if (!u) return '';
  return `<div class="live">${u.alive ? `HP ${Math.max(0, Math.round(u.hp))}/${u.maxHp}${u.ward > 0 ? ` · Ward ${Math.round(u.ward)}` : ''} · Charge ${Math.round(u.charge)}%` : 'Fallen'} · dmg ${Math.round(u.stats.dmg)}${u.stats.heal ? `, heal ${Math.round(u.stats.heal)}` : ''}</div>`;
}
function renderSide() {
  if (S.sel) {
    const h = RUN.team.find(x => x.key === S.sel);
    if (h) {
      if (hasRightInspector()) { INSPECT = { kind: 'hero', key: h.key }; renderInspector(); }
      else if (B) heroCardModal(h, liveLine(h.key));
    }
    if (B) S.sel = null;
  }
  if (S.selE != null && S.selE !== false) {
    if (hasRightInspector()) {
      INSPECT = typeof S.selE === 'object' ? { kind: 'enemy', uid: S.selE.id } : { kind: 'enemy', idx: S.selE };
      renderInspector();
    } else {
      const en = typeof S.selE === 'object' ? S.selE : previewEnemy(S.selE);
      if (en) enemyCardModal(en);
    }
    S.selE = null;
  }
}
function previewEnemy(i) { const e = ENC[S.enc].u[i]; return e ? mkEnemy(e[0], e[1], e[2], 1, ENC[S.enc]) : null; }
function enemyCardModal(en) { enemyTip(null); openModal(`<div class="mpanel ecardwrap">${enemyCard(en, B)}</div>`); }
function enemyTip(en, ev) {
  const T = $('etip'); if (!en || !ev || matchMedia('(hover: none)').matches) { T.hidden = true; return; }
  T.innerHTML = enemyCard(en, B, true); T.hidden = false;
  const w = T.offsetWidth, h = T.offsetHeight;
  let x = ev.clientX + 16, y = ev.clientY + 12;
  if (x + w > innerWidth - 8) x = ev.clientX - w - 16;
  if (y + h > innerHeight - 8) y = innerHeight - h - 8;
  T.style.left = x + 'px'; T.style.top = Math.max(8, y) + 'px';
}

/* Live v0.23 power-fantasy counters drawn beneath hero tokens */
function tokenCounter(u) {
  if (!B) return null;
  if (u.zealotT > 0) return [`ZEALOT ${u.zealotT.toFixed(1)}s`, '#ffe9a0'];
  if (u.beast && u.beast.hp > 0) return [`PANTHER`, '#8fd0ff'];
  if (u.illusoryDouble > 0) return [`DOUBLE ×${u.illusoryDouble}`, '#c48fe6'];
  if (u.bearRage > 0) return [`RAGE ×${u.bearRage}`, '#ff6a4a'];
  if (u.kw && u.kw.metamagic && u.sorcery > 0) return ['SORC ' + '●'.repeat(u.sorcery) + '○'.repeat(Math.max(0, 4 - u.sorcery)), '#ff9c4a'];
  if (u.kw && u.kw.ki && u.ki > 0) return ['KI ' + '●'.repeat(u.ki) + '○'.repeat(Math.max(0, 4 - u.ki)), '#8fd8d8'];
  if (u.inspMote) return [`MOTE +2g`, '#ffd76a'];
  if (u.inspDie) return [`d${u.inspDie.sides} INSP`, '#ffd76a'];
  if (u.bonded) return [`BONDED`, '#9be38a'];
  const ev = curEvasion(B, u);
  if (ev >= 0.25) return [`EV ${Math.round(ev * 100)}%`, '#8fd0ff'];
  return null;
}

function showResult() {
  clearTimeout(_resTimer); _resTimer = 0;
  if (!B || !RUN || $('combat').hidden) return;
  const won = B.winner === 'P';
  const res = resolveNodeFight(RUN, won, B);
  RUN._res = res; running = false;
  const P = B.units.filter(u => u.side === 'P' && !u.minion);
  const rows = P.map(u => `<tr><td>${esc(H[u.key].name)} ${u.alive ? '' : '<span class="fell">fell</span>'}${highlights(u)}</td><td>${Math.round(u.stats.dmg)}</td><td>${Math.round(u.stats.heal + u.stats.ward)}</td><td>${Math.round(u.stats.taken)}</td></tr>`).join('');
  const madeTxt = res.made ? `<div class="small" style="text-align:center">Looted ${gold(res.made)} during the fight.</div>` : '';
  const actBonusTxt = res.actBonus ? ` (+${res.actBonus}g Act Clear)` : '';
  let msg;
  if (won) {
    msg = `+${gold(res.gold + res.made + (res.elite || 0) + (res.minibossGold || 0) + (res.actBonus || 0))}${actBonusTxt} · ${RUN.gold} gold · Piggy Bank ${RUN.piggyBroken ? 'broken' : `holds ${RUN.piggy}g`}`;
  } else if (!RUN.over) {
    msg = `Piggy Bank broke! Paid out +${gold(res.piggy)} — visit the Camp Shop and retry this fight!`;
  } else {
    msg = 'Second loss — the adventure ends here.';
  }
  const qTxt = (res.quests || []).map(o => {
    if (o.completed) return `<div class="qdone">★ Quest Complete! <b>${esc(H[o.h.key].name)}</b> unlocks <b>${esc(o.rewardName)}</b>: ${esc(o.rewardDesc)}</div>`;
    if (o.scaled) return `<div class="qdone">${esc(H[o.h.key].name)} · ${esc(o.scaled)}</div>`;
    return `<div class="small mute" style="text-align:center">${esc(H[o.h.key].name)} Quest: ${Math.round(o.prog)}/${o.goal} (${Math.round(o.progress * 100)}%)</div>`;
  }).join('');

  $('result').innerHTML = `<div class="rbox"><h2 class="${won ? 'win' : 'loss'}">${won ? (res.finished ? 'Adventure Conquered!' : res.actDone ? 'Act Boss Defeated!' : 'Fight Won') : B.timeout ? 'Out of Time' : 'Defeat'}</h2>
    <div class="reward">${msg}</div>${madeTxt}${qTxt}
    <p class="small mute" style="text-align:center">${advLabel()}: ${esc(RUN.next.n)}, in ${B.time.toFixed(1)}s.</p>
    <table class="rt"><tr><th>Hero</th><th>Damage</th><th>Heal / Ward</th><th>Taken</th></tr>${rows}</table>
    <div class="row" style="justify-content:center"><button class="btn primary big" data-a="afterFight">${RUN.over ? 'See run summary' : res.actDone ? `Advance to Act ${RUN.adv.act + 1}` : !won ? 'To Camp Shop & Retry' : 'To Camp Shop →'}</button></div></div>`;
  $('result').hidden = false; renderCombatBar();
  if (RUN.over) { recordBest(); clearRun(); } else saveRun();
}

function afterFight() {
  clearTimeout(_resTimer); _resTimer = 0;
  if (!RUN) return;
  if (!RUN.over && !RUN.adv.loot && !RUN._res) return;
  B = null; $('result').hidden = true;
  if (RUN.over) { RUN._res = null; renderOver(); return; }
  if (RUN.adv.loot) { eventModal('loot'); return; }
  const to = afterNodeFight(RUN, RUN._res || {});
  RUN._res = null;
  _bossKey = ''; _bossRead = null;
  if (to === 'over') renderOver();
  else if (to === 'shop') { renderShop(); show('shop'); saveRun(); }
  else renderMap();
}

function highlights(u) {
  const s = u.stats, c = [];
  if (s.actionSurges) c.push(`${s.actionSurges} Action Surge`);
  if (s.channelDivinities) c.push(`${s.channelDivinities} Channel Div.`);
  if (s.smites) c.push(`${s.smites} Smites`);
  if (s.arcaneRecoveries) c.push(`${s.arcaneRecoveries} Arcane Rec.`);
  if (s.bearRagePeak) c.push(`Rage ×${s.bearRagePeak}`);
  else if (s.zealotProcs) c.push(`${s.zealotProcs} Zealot Rage`);
  if (s.wildShapes) c.push(`${s.wildShapes} Wild Shape`);
  if (s.kiStrikes) c.push(`${s.kiStrikes} Ki Strikes`);
  if (s.metamagics) c.push(`${s.metamagics} Metamagic`);
  if (s.hexDeaths) c.push(`${s.hexDeaths} Hellfires`);
  if (s.sneaks) c.push(`${s.sneaks} Sneaks`);
  if (s.evades) c.push(`${s.evades} evades`);
  if (s.rootsApplied) c.push(`${s.rootsApplied} roots`);
  if (s.gold) c.push(`+${s.gold}g`);
  return c.length ? `<div class="hl">${c.slice(0, 3).map(x => `<span>${x}</span>`).join('')}</div>` : '';
}

function recordBest() {
  const b = getBest(), lead = RUN.team.slice().sort((a, c) => c.tier - a.tier)[0];
  if (!b || RUN.stats.won > b.won) setBest({ won: RUN.stats.won, victory: RUN.victory, lead: lead && lead.key, date: Date.now() });
}
function renderOver() {
  const R = RUN;
  $('overBox').innerHTML = `<div class="lbl">${R.victory ? 'Victory' : 'Run Ended'}</div><h1>${R.victory ? 'All Three Acts Conquered!' : 'Fallen in the Adventure'}</h1>
    <div><div class="bigscore">${R.stats.won}</div><div class="mute">fights won</div></div>
    <div class="overteam">${R.team.map(h => `<div>${iconSlot(h.key, 64)}<b>${esc(H[h.key].name)}</b><span class="mute">Tier ${rom[h.tier]}${h.path ? ' · ' + esc(H[h.key].paths.find(p => p.k === h.path).n) : ''}${h.multiclass ? ' · ' + esc(h.multiclass) : ''}${h.boon ? ' · ★' : ''}</span></div>`).join('')}</div>
    <p class="small mute">Gold earned ${R.stats.gold} · spent ${R.stats.spent} · rerolls ${R.stats.rerolls}</p>
    <div class="row" style="justify-content:center"><button class="btn primary big" data-a="newrun">New run</button><button class="btn" data-a="title">Title</button></div>`;
  paintTokens($('overBox')); show('over');
}

function changelogModal() { openModal(`<div class="mpanel" style="max-width:740px"><h2>What’s new in 0.23</h2><div class="changelog">${CHANGELOG_HTML}</div></div>`); }

/* ---------- Global Click & Keyboard Input ---------- */
document.addEventListener('click', e => {
  if (e.target === $('modal') && !modalForced()) { closeModal(); return; }
  const el = e.target.closest('[data-a]'); if (!el) return;
  const a = el.dataset.a;
  if (modalForced() && !el.closest('#modal')) return;
  const uid = +el.dataset.u, i = +el.dataset.i;
  const h = RUN && RUN.team.find(x => x.uid === uid);

  if (a === 'trayItem') { SEL_ITEM = SEL_ITEM === i ? null : i; renderItemTray(); return; }
  if (a === 'trayOff') { e.stopPropagation(); if (unequip(RUN, uid, i)) { SEL_ITEM = null; renderStrip(); renderInspector(); saveRun(); } return; }
  if (a === 'pcard' && SEL_ITEM != null && !B) {
    const hh = RUN.team.find(x => x.uid === uid);
    if (hh && hh.items.length >= slotsOf(hh)) { toast(`${H[hh.key].name} has no free item slot (${hh.items.length}/${slotsOf(hh)})`); return; }
    const k = RUN.stash[SEL_ITEM];
    if (!canCarry(hh, k)) { toast(`${ITEMS[k].n} is a ${ITEMS[k].t} weapon!`); return; }
    if (equip(RUN, uid, SEL_ITEM)) { toast(`${H[hh.key].name} equips ${ITEMS[k].n}`); SEL_ITEM = null; renderStrip(); renderInspector(); saveRun(); }
    return;
  }

  switch (a) {
    case 'newrun':
      clearTimeout(_resTimer); _resTimer = 0; B = null; running = false; resultShown = false;
      _bossKey = ''; _bossRead = null; _setupKey = ''; _thrKey = '';
      RUN = newAdventure(); clearRun(); show('intro'); break;
    case 'continue': {
      clearTimeout(_resTimer); _resTimer = 0; B = null; running = false; resultShown = false;
      _bossKey = ''; _bossRead = null; _setupKey = ''; _thrKey = '';
      RUN = loadRun(); if (!RUN) return renderTitle(); ENC.run = RUN.encSnap;
      if (RUN._res || RUN.adv.loot) { afterFight(); break; }
      const st = RUN.adv.stage;
      if (st === 'packs') renderPacks();
      else if (!RUN.team.length) { RUN.firstPick = (RUN.firstPick && RUN.firstPick.length) ? RUN.firstPick : firstPickFromPacks(RUN.adv.packs); renderPick(); }
      else if (st === 'shop') { renderShop(); show('shop'); }
      else if (st === 'battle' && ENC.run) goPlacement();
      else { RUN.adv.node = null; RUN.adv.stage = 'map'; renderMap(); }
      break;
    }
    case 'title': clearTimeout(_resTimer); _resTimer = 0; closeModal(true); if (RUN && !RUN.over) saveRun(); B = null; running = false; renderTitle(); break;
    case 'begin': renderPacks(); break;
    case 'togglePack': togglePackKey(el.dataset.k); break;
    case 'packsAll': ENABLED_PACKS = new Set(PACK_ORDER); saveEnabledPacks(); renderPacks(); break;
    case 'packsCore3': ENABLED_PACKS = new Set(PACK_ORDER.slice(0, 3)); saveEnabledPacks(); renderPacks(); break;
    case 'packsNone': ENABLED_PACKS = new Set(); saveEnabledPacks(); renderPacks(); break;
    case 'confirmPacks': confirmPacks(); break;
    case 'packHero': openModal(largeCard(el.dataset.k, 1, { cfg: { key: el.dataset.k, tier: 1 } })); break;
    case 'pick': doPick(el.dataset.k); break;
    case 'changelog': changelogModal(); break;
    case 'closeModal': closeModal(); break;
    case 'node': chooseNode(+el.dataset.r, +el.dataset.i); break;
    case 'openCampShop': renderShop(); show('shop'); break;
    case 'toMap':
      if (RUN.team.some(x => (x.tier >= 2 && !x.path) || (x.tier >= 3 && !x.asi) || (x.tier >= 4 && !x.boon))) { checkPendingPath(); return; }
      renderMap(); break;
    case 'evPromote': {
      const r = promoteHero(RUN, uid);
      if (r.ok) {
        closeModal(true); clearNode(RUN); renderMap();
        toast(`${H[r.hero.key].name} promoted to Tier ${rom[r.hero.tier]}!`);
        checkPendingPath();
      } else finishEvent();
      break;
    }
    case 'evTrainHero': eventModal('train', uid); break;
    case 'evTrainBack': eventModal('train'); break;
    case 'evTrain': if (h) { trainHero(RUN, uid, el.dataset.p); finishEvent(`${H[h.key].name}: +1 ${ATTR_N[el.dataset.p]}`); } else finishEvent(); break;
    case 'evRetrain': {
      if (h && retrainHeroPath(RUN, uid, el.dataset.p)) {
        const pn = H[h.key].paths.find(p => p.k === el.dataset.p).n;
        finishEvent(`${H[h.key].name} retrained to ${pn}!`);
      } else finishEvent();
      break;
    }
    case 'evQuestBoost': {
      const r = accelerateHeroQuest(RUN, uid);
      if (r) finishEvent(r.accepted ? `Accepted ${H[r.h.key].name}’s Quest: ${r.q.rewardName}!` : r.completed ? `★ Quest Complete! ${H[r.h.key].name} unlocks ${r.q.rewardName}!` : `${H[r.h.key].name} Quest boosted (+${r.boost})!`);
      else finishEvent();
      break;
    }
    case 'evRest': finishEvent(restAt(RUN, el.dataset.p)); break;
    case 'curioBuy': {
      const r = buyCurioItem(RUN, i);
      if (!r.ok) return toast(r.why);
      toast(`Bought ${ITEMS[r.item].n}!`);
      eventModal('curio'); saveRun();
      break;
    }
    case 'curioReroll': {
      const r = rerollCurio(RUN);
      if (!r.ok) return toast(r.why);
      toast('Curio stock rerolled!');
      eventModal('curio'); saveRun();
      break;
    }
    case 'evMulticlass': {
      if (applyMulticlass(RUN, uid, el.dataset.p)) finishEvent(`${H[h.key].name} gained ${el.dataset.p} Multiclass!`);
      else finishEvent();
      break;
    }
    case 'evMcAttr': {
      const h0 = RUN.team[0];
      if (h0) { const ka = H[h0.key].pair[1]; trainHero(RUN, h0.uid, ka); finishEvent(`${H[h0.key].name} gained +1 ${ATTR_N[ka]}!`); }
      else finishEvent();
      break;
    }
    case 'peddlerBuy': {
      const M = RUN.adv.mystery;
      const entry = M && M.items && M.items[i];
      if (!entry || entry.bought || RUN.gold < entry.price || RUN.stash.length >= ECON.stash) return toast('Cannot buy');
      RUN.gold -= entry.price; RUN.stats.spent += entry.price;
      entry.bought = true; RUN.stash.push(entry.key);
      toast(`Bought ${ITEMS[entry.key].n}!`);
      eventModal('mystery'); saveRun();
      break;
    }
    case 'mysteryChoice': {
      const M = RUN.adv.mystery;
      const ch = M && M.event && M.event.choices && M.event.choices[i];
      if (!ch) { finishEvent(); break; }
      if (ch.cost && RUN.gold < ch.cost) return toast('Not enough gold');
      if (ch.cost) { RUN.gold -= ch.cost; RUN.stats.spent += ch.cost; }
      if (ch.fight) {
        closeModal(true);
        buildEncounter(RUN, Math.random, { threat: ch.fight, bonusGold: ch.bonusGold || 0 });
        RUN.next.kind = 'fight';
        RUN.adv.stage = 'battle';
        goPlacement();
        break;
      }
      const out = ch.fx(RUN, Math.random);
      if (out && typeof out === 'object' && out.ambush) {
        closeModal(true);
        const actMod = currentActModule(RUN);
        buildEncounter(RUN, Math.random, { threat: pickFromBag(RUN, `${actMod.id}_norm`, actMod.pools.normal, Math.random) });
        RUN.next.kind = 'fight';
        RUN.adv.stage = 'battle';
        toast(out.msg || 'Ambush!');
        goPlacement();
        break;
      }
      const msg = (out && typeof out === 'object') ? out.msg : out;
      finishEvent(msg || 'Moved on.');
      checkPendingPath();
      break;
    }
    case 'evTake': {
      takeTreasure(RUN, RUN.adv._t[i]); toast(`${ITEMS[RUN.adv._t[i]].n} added to stash`);
      if (el.dataset.p === 'loot') { RUN.adv.loot = null; closeModal(true); afterFight(); }
      else finishEvent();
      break;
    }
    case 'evSkip': {
      if (el.dataset.p === 'loot') { RUN.adv.loot = null; closeModal(true); afterFight(); }
      else finishEvent();
      break;
    }
    case 'tobattle':
      if (RUN.team.some(x => (x.tier >= 2 && !x.path) || (x.tier >= 3 && !x.asi) || (x.tier >= 4 && !x.boon))) { checkPendingPath(); return; }
      goPlacement(); break;
    case 'autoplace': autoPlace(RUN, true); S.party = boardHeroes(RUN); _setupKey = ''; saveRun(); break;
    case 'begin-battle': startBattle(); break;
    case 'afterFight': afterFight(); break;
    case 'spd': S.speed = +el.dataset.v; renderCombatBar(); break;
    case 'pause': paused = !paused; renderCombatBar(); break;
    case 'sound': S.sound = !S.sound; renderCombatBar(); break;
    case 'btext': BTXT = BTXT === 'all' ? 'key' : 'all'; renderCombatBar(); break;
    case 'pcard':
      if (h) {
        if (hasRightInspector()) { INSPECT = { kind: 'hero', key: h.key }; renderInspector(); }
        else heroCardModal(h, liveLine(h.key));
      }
      break;
    case 'inspHero':
      if (el.dataset.key) { INSPECT = { kind: 'hero', key: el.dataset.key }; renderInspector(); }
      break;
    case 'inspEnemy':
      if (B && el.dataset.uid != null) { INSPECT = { kind: 'enemy', uid: +el.dataset.uid }; renderInspector(); }
      else if (el.dataset.idx != null) { INSPECT = { kind: 'enemy', idx: +el.dataset.idx }; renderInspector(); }
      break;
    case 'ecard': {
      let en = null;
      if (B && el.dataset.uid != null) en = B.units.find(x => x.id === +el.dataset.uid);
      else if (el.dataset.idx != null) en = previewEnemy(+el.dataset.idx);
      if (en) enemyCardModal(en);
      break;
    }
    case 'card': if (h) heroCardModal(h); break;
    case 'offerCard': {
      const k = RUN.shop.heroes[i]; if (!k) return;
      const o = heroOffer(RUN, k, i), own = ownedHero(RUN, k), t = o.tier;
      const cfg = own ? { ...cfgOf(own, RUN), tier: t } : { key: k, tier: t };
      openModal(largeCard(k, t, { cfg, heroObj: own, foot: `<div class="cfoot"><span class="note">${o.isNew ? `Recruit at Tier ${rom[t]}` : `Upgrade to Tier ${rom[t]}`}</span>${o.maxed ? '' : `<button class="btn primary" data-a="buyHero" data-i="${i}" ${RUN.gold < o.price ? 'disabled' : ''}>${o.isNew ? 'Recruit' : 'Upgrade'} · ${o.price} gold</button>`}</div>` }));
      break;
    }
    case 'buyHero': {
      if (e.target.closest('button') && e.target.closest('button') !== el) return;
      const r = buyHero(RUN, i);
      if (!r.ok && r.needSwap) { swapModal(i); break; }
      closeModal(); if (!r.ok) return toast(r.why);
      toast(r.isNew ? `${H[r.hero.key].name} joins at Tier ${rom[r.hero.tier]}!` : `${H[r.hero.key].name} upgraded to Tier ${rom[r.hero.tier]}!`);
      renderShop(); saveRun();
      break;
    }
    case 'swapBuy': {
      const r = buyHero(RUN, +el.dataset.i, uid); closeModal(); if (!r.ok) return toast(r.why);
      toast(`${H[r.hero.key].name} joins at Tier ${rom[r.hero.tier]}!`); renderShop(); saveRun(); break;
    }
    case 'buyItem': {
      if (e.target.closest('button') && e.target.closest('button') !== el) return;
      const r = buyItem(RUN, i); if (!r.ok) return toast(r.why);
      toast(`${ITEMS[r.item].n} added to stash`); renderShop(); saveRun(); break;
    }
    case 'stashSelect': SHOP_SEL_ITEM = SHOP_SEL_ITEM === i ? null : i; renderShop(); break;
    case 'stashClear': SHOP_SEL_ITEM = null; renderShop(); break;
    case 'shopEquip': {
      if (e.target.closest('button')) return;
      if (SHOP_SEL_ITEM == null || !h) break;
      const k = RUN.stash[SHOP_SEL_ITEM];
      if (!k) { SHOP_SEL_ITEM = null; renderShop(); break; }
      if (h.items.length >= slotsOf(h)) { toast(`${H[h.key].name} has no free item slot (${h.items.length}/${slotsOf(h)})`); break; }
      if (!canCarry(h, k)) { toast(`${ITEMS[k].n} is a ${ITEMS[k].t} weapon!`); break; }
      const fav = isFavMatch(k, h);
      if (equip(RUN, uid, SHOP_SEL_ITEM)) {
        SHOP_SEL_ITEM = null;
        toast(fav ? `★ Synergy! ${H[h.key].name} equips ${ITEMS[k].n}` : `${H[h.key].name} equips ${ITEMS[k].n}`);
        renderShop(); saveRun();
      }
      break;
    }
    case 'shopUnequip': {
      e.stopPropagation();
      if (unequip(RUN, uid, i)) { SHOP_SEL_ITEM = null; toast('Returned item to stash'); renderShop(); saveRun(); }
      else toast('Stash is full');
      break;
    }
    case 'sellItem': { const back = sellItem(RUN, i); SHOP_SEL_ITEM = null; closeModal(); toast(`Sold for ${back}g`); renderShop(); saveRun(); break; }
    case 'reroll': if (!reroll(RUN)) return toast('Not enough gold'); renderShop(); saveRun(); break;
    case 'freeze': toast(toggleFreeze(RUN) ? 'Whole shop frozen until next refresh' : 'Shop unfrozen'); renderShop(); saveRun(); break;
    case 'path': if (h) pathModal(h); break;
    case 'previewPath': if (h) pathModal(h, el.dataset.p); break;
    case 'previewAsi': if (h) asiModal(h, el.dataset.p); break;
    case 'chooseAsi': closeModal(true); if (h) { h.asi = el.dataset.p; toast(`${H[h.key].name}: +2 ${ATTR_N[h.asi]}`); } if (PHASE === 'shop') renderShop(); else renderMap(); saveRun(); checkPendingPath(); break;
    case 'choosePath': closeModal(true); if (h) { h.path = el.dataset.p; const pn = H[h.key].paths.find(p => p.k === h.path); toast(`${H[h.key].name}: ${pn ? pn.n : h.path}`); } if (PHASE === 'shop') renderShop(); else renderMap(); saveRun(); checkPendingPath(); break;
    case 'chooseBoon': closeModal(true); if (h && chooseHeroBoon(RUN, uid, el.dataset.p)) { delete h._boonOffer; toast(`★ ${H[h.key].name} gained ${EPIC_BOONS[h.boon].n}!`); } if (PHASE === 'shop') renderShop(); else renderMap(); saveRun(); checkPendingPath(); break;
    case 'sell': if (h) { openModal(`<div class="mpanel"><h2>Sell ${esc(H[h.key].name)}?</h2><p>Refunds full worth (${gold(heroValue(h.tier))}) and returns items to stash.</p><div class="row"><button class="btn primary" data-a="sellYes" data-u="${uid}">Sell for ${heroValue(h.tier)}g</button><button class="btn" data-a="closeModal">Keep</button></div></div>`); } break;
    case 'sellYes': { const back = sellHero(RUN, uid); closeModal(); toast(`Sold for ${back}g`); renderShop(); saveRun(); break; }
  }
});

/* Shop stash drag-and-drop onto party chips */
let _dragStashIdx = null;
document.addEventListener('dragstart', e => {
  const el = e.target.closest('.sitem[data-stash-i]');
  if (!el) return;
  _dragStashIdx = +el.dataset.stashI;
  SHOP_SEL_ITEM = _dragStashIdx;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', String(_dragStashIdx));
  setTimeout(() => renderShop(), 0);
});
document.addEventListener('dragend', () => { document.querySelectorAll('.pchip.ddover').forEach(x => x.classList.remove('ddover')); _dragStashIdx = null; });
document.addEventListener('dragover', e => { if (_dragStashIdx == null) return; const chip = e.target.closest('.pchip[data-drop-hero]'); if (!chip) return; e.preventDefault(); e.dataTransfer.dropEffect = 'move'; chip.classList.add('ddover'); });
document.addEventListener('dragleave', e => { const chip = e.target.closest('.pchip[data-drop-hero]'); if (chip) chip.classList.remove('ddover'); });
document.addEventListener('drop', e => {
  if (_dragStashIdx == null) return;
  const chip = e.target.closest('.pchip[data-drop-hero]');
  if (!chip) return;
  e.preventDefault(); chip.classList.remove('ddover');
  const idx = _dragStashIdx; _dragStashIdx = null;
  const uid = +chip.dataset.dropHero;
  const hh = RUN && RUN.team.find(x => x.uid === uid);
  const k = RUN && RUN.stash[idx];
  if (!hh || !k) return;
  if (hh.items.length >= slotsOf(hh)) { toast(`${H[hh.key].name} has no free item slot`); return; }
  if (!canCarry(hh, k)) { toast(`${ITEMS[k].n} is a ${ITEMS[k].t} weapon!`); return; }
  const fav = isFavMatch(k, hh);
  if (equip(RUN, uid, idx)) { SHOP_SEL_ITEM = null; toast(fav ? `★ Synergy! ${H[hh.key].name} equips ${ITEMS[k].n}` : `${H[hh.key].name} equips ${ITEMS[k].n}`); renderShop(); saveRun(); }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
  if (modalForced()) return;
  if (e.key === ' ' && PHASE === 'combat' && B && !B.over && !e.target.closest('input,textarea')) { e.preventDefault(); paused = !paused; renderCombatBar(); }
});
window.addEventListener('resize', () => { if (PHASE === 'combat') resize(); });
if (window.ResizeObserver) new ResizeObserver(() => { if (PHASE === 'combat') resize(); }).observe($('boardWrap'));

/* Side-wing & quick-pick hover linking: highlights matching unit token (and placement threat line) on the board */
const _wl = $('cWingLeft'), _wr = $('cWingRight');
if (_wl) {
  _wl.addEventListener('pointerover', e => { const c = e.target.closest('[data-hover-hero]'); if (c && typeof HOVER_HERO !== 'undefined') HOVER_HERO = c.dataset.hoverHero; });
  _wl.addEventListener('pointerout', e => { const c = e.target.closest('[data-hover-hero]'); if (c && !c.contains(e.relatedTarget) && typeof HOVER_HERO !== 'undefined') HOVER_HERO = null; });
  _wl.addEventListener('pointerleave', () => { if (typeof HOVER_HERO !== 'undefined') HOVER_HERO = null; });
}
if (_wr) {
  _wr.addEventListener('pointerover', e => {
    const ch = e.target.closest('[data-hover-hero]');
    if (ch && typeof HOVER_HERO !== 'undefined') { HOVER_HERO = ch.dataset.hoverHero; HOVER_ENEMY = null; return; }
    const ce = e.target.closest('[data-hover-uid],[data-hover-enemy]');
    if (ce && typeof HOVER_ENEMY !== 'undefined') { HOVER_HERO = null; HOVER_ENEMY = ce.dataset.hoverUid != null ? +ce.dataset.hoverUid : +ce.dataset.hoverEnemy; }
  });
  _wr.addEventListener('pointerout', e => {
    const c = e.target.closest('[data-hover-hero],[data-hover-uid],[data-hover-enemy]');
    if (c && !c.contains(e.relatedTarget)) { if (typeof HOVER_HERO !== 'undefined') HOVER_HERO = null; if (typeof HOVER_ENEMY !== 'undefined') HOVER_ENEMY = null; }
  });
  _wr.addEventListener('pointerleave', () => { if (typeof HOVER_HERO !== 'undefined') HOVER_HERO = null; if (typeof HOVER_ENEMY !== 'undefined') HOVER_ENEMY = null; });
}

function resize() {
  const wrap = $('boardWrap');
  view.pad = 10;
  const W = Math.max(260, wrap.clientWidth - 12), Hh = Math.max(240, (wrap.clientHeight || window.innerHeight - 12) - 12);
  view.T = Math.max(26, Math.min(144, Math.floor(Math.min((W - view.pad * 2) / COLS, (Hh - view.pad * 2) / ROWS))));
  view.R = view.T * .64;
  view.w = view.T * COLS + view.pad * 2; view.h = view.T * ROWS + view.pad * 2;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = view.w * dpr; canvas.height = view.h * dpr;
  canvas.style.width = view.w + 'px'; canvas.style.height = view.h + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0); mapDirty = true;
}

/* ---------- Boot ---------- */
glossaryInit();
HERO_ORDER.forEach(k => { PORTRAIT[k] = tokenCanvas(k, 96); });
renderTitle();
if (typeof initAssets === 'function') {
  initAssets(() => {
    HERO_ORDER.forEach(k => { PORTRAIT[k] = tokenCanvas(k, 96); });
    mapDirty = true;
    if (PHASE === 'start') renderTitle();
    else if (PHASE === 'pick' && RUN) renderPick();
    else if (PHASE === 'shop' && RUN) renderShop();
    else if (PHASE === 'advmap' && RUN) renderMap();
    else if (PHASE === 'packs' && RUN) renderPacks();
    else if (PHASE === 'combat') { renderStrip(); _inspSig = ''; renderInspector(); drawBoard(); }
  });
}
document.fonts && document.fonts.ready.then(() => { if (PHASE === 'combat') resize(); });
requestAnimationFrame(frame);
