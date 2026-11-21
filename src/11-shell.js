/* ================= 0.22 GAME SHELL UI =================
   Title, Intro, Pack Draft, First Pick, Adventure Map (with Training Promote, Campfire Retraining,
   Quest Board Acceleration, Piggy Bank), Reworked Recruit/Upgrade Shop, Placement, Combat, and Results.
*/

const TIER_COL = { 1: '#d8d0bc', 2: '#7fd08f', 3: '#7fb4f0', 4: '#c49af0' };
let S = { enc: 'run', eTier: 1, party: [], sel: null, selE: null, speed: 1, sound: true };
let mapLayer = null, mapDirty = true;
let RUN = null, PHASE = 'title';
const SAVE_KEY = 'bb022.run', BEST_KEY = 'bb022.best';
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
    if (r && r.v === '0.22' && !r.over) {
      r.team = r.team.filter(h => H[h.key]);
      RUN_UID = Math.max(1, ...r.team.map(h => h.uid + 1));
      if (r.adv) {
        if (!Array.isArray(r.adv.path)) r.adv.path = [];
        // Sanitize stale prior-act trail from pre-fix saves where pos was reset without clearing path
        if (!r.adv.pos && r.adv.path.length) r.adv.path = [];
        if (r.adv.pos && r.adv.pos.r >= ADV.bossRow) { r.adv.pos = null; r.adv.path = []; }
      }
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
  if (a) asiModal(a);
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
  $('bestLine').textContent = b ? `Record: ${b.won} fights won${b.victory ? ' (Adventure cleared!)' : ''}${b.lead && H[b.lead] ? `, led by ${H[b.lead].name}` : ''}.` : 'Beat all 3 Act Bosses to conquer the adventure.';
  const p = $('parade'); p.innerHTML = '';
  HERO_ORDER.forEach(k => { const c = iconCanvas(k, 52); c.title = `${H[k].name} — ${H[k].title}`; p.appendChild(c); });
  show('start');
}

function renderPick() {
  $('picks').innerHTML = RUN.firstPick.map(k => largeCard(k, 1, { cfg: { key: k, tier: 1 }, foot: `<div class="cfoot"><span class="note">${H[k].role} · free</span><button class="btn primary" data-a="pick" data-k="${k}">Recruit ${esc(H[k].name)}</button></div>` })).join('');
  paintCanvases($('picks')); show('pick');
}
function doPick(k) { freeHero(RUN, k); startAct(RUN); renderMap(); }

const PACK_PREF_KEY = 'bb022.packs';
function loadEnabledPacks() {
  try {
    const arr = JSON.parse(localStorage.getItem(PACK_PREF_KEY) || 'null');
    if (Array.isArray(arr)) {
      const valid = arr.filter(k => PACKS[k]);
      if (valid.length) return new Set(valid);
    }
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
  const itemCount = chosen.filter(k => PACKS[k].item).length;
  $('packLbl').textContent = 'Pre-run pack setup · 6 Packs · 24 Heroes';

  const ctrlHtml = `<div class="packsummary"><b>${chosen.length}</b> of ${PACK_ORDER.length} Packs enabled · <b>${heroCount}</b> Heroes · <b>${itemCount}</b> Pack Items</div>
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
      ${P.item ? `<div class="packitem" title="${esc(itemText(P.item))}">${itemIcon(P.item, 36)}<span><b>${esc(ITEMS[P.item].n)}</b> <small class="mute">(Pack Item)</small><br><span class="small mute">${esc(itemText(P.item))}</span></span></div>` : ''}
      <button class="btn ${on ? '' : 'primary'}" data-a="togglePack" data-k="${k}">${on ? 'Disable this pack' : 'Enable this pack'}</button>
    </div>`;
  }).join('');
  paintCanvases($('packList')); paintTokens($('packList')); show('packs'); saveRun();
}

function togglePackKey(k) {
  if (!PACKS[k]) return;
  if (ENABLED_PACKS.has(k)) ENABLED_PACKS.delete(k);
  else ENABLED_PACKS.add(k);
  saveEnabledPacks();
  renderPacks();
}

function confirmPacks() {
  const chosen = PACK_ORDER.filter(k => ENABLED_PACKS.has(k));
  if (!chosen.length) { toast('Enable at least 1 Pack to start!'); return; }
  startRunWithPacks(RUN, chosen);
  toast(`${chosen.length} pack${chosen.length === 1 ? '' : 's'} active (${RUN.adv.pool.length} heroes in shop pool)!`);
  renderPick();
  saveRun();
}

/* ---------- Adventure Map ---------- */
const nodeTitle = n => n.threat ? `${NODE[n.kind].n}: ${THREATS[n.threat].n}` : NODE[n.kind].n;
const nodeTip = n => {
  if (n.threat) {
    const T = THREATS[n.threat];
    const fs = [...new Set(ENC[T.enc].u.map(u => u[0]))];
    const A = [...new Set(fs.flatMap(archOf))].map(a => EARCH[a].n);
    return `${T.q}.${A.length ? ' ' + A.join(', ') + '.' : ''}${n.kind === 'elite' ? ' Harder fight; pays +4 gold and a bonus item.' : ''}`;
  }
  return {
    train: 'Promote a hero +1 Tier for free, or give +1 permanent attribute.',
    quest: 'Accelerate one hero’s personal Quest (+35% progress toward their Signature Reward).',
    rest: 'Retrain a Tier II+ hero’s Path for free, reinforce your Piggy Bank (+4g), or forage (+6g).',
    treasure: 'Choose one of three items from your active pool.'
  }[n.kind] || '';
};

let _bossRead = null, _bossKey = '';
function bossReadCached() {
  const key = RUN.adv.act + '|' + RUN.team.map(h => h.key + h.tier + (h.path || '') + h.items.join('') + (h.questDone ? 'Q' : '') + JSON.stringify(h.train || {})).join(',');
  if (key !== _bossKey || !_bossRead) { _bossKey = key; try { _bossRead = bossRead(RUN, 3); } catch (e) { _bossRead = null; } }
  return _bossRead;
}

function renderMap() {
  const A = RUN.adv;
  if (!A.map || !A.map.length) startAct(RUN);
  if (!A.pos && A.path && A.path.length) A.path = [];
  const M = A.map;
  const next = new Set(nextNodes(RUN));
  const W = 760, Hh = 660, y = r => Hh - 50 - r * ((Hh - 110) / ADV.bossRow), x = n => 40 + n.x * (W - 80);
  const visited = new Set((A.path || []).map(p => p.r + ',' + p.i));
  if (A.pos) visited.add(A.pos.r + ',' + A.pos.i);
  const trail = [...(A.path || []), ...(A.pos ? [A.pos] : [])].map(p => M[p.r] && M[p.r][p.i]).filter(Boolean);
  const lines = [];
  trail.forEach((a, k) => { const b = trail[k + 1]; if (b) lines.push(`<line x1="${x(a)}" y1="${y(a.r)}" x2="${x(b)}" y2="${y(b.r)}" class="on"/>`); });
  const cur = trail[trail.length - 1];
  if (cur) [...next].forEach(b => lines.push(`<line x1="${x(cur)}" y1="${y(cur.r)}" x2="${x(b)}" y2="${y(b.r)}" class="nx"/>`));
  M.forEach((row, r) => { if (r < ADV.bossRow) lines.unshift(`<text x="${W - 14}" y="${y(r) + 4}" text-anchor="end" class="rowlbl">${r % 2 === 0 ? 'Choose a fight' : 'Choose a stop'}</text>`); });
  const BR = bossReadCached();
  const nodes = M.flat().map(n => {
    const key = n.r + ',' + n.i, can = next.has(n), been = visited.has(key);
    const lbl = n.threat ? THREATS[n.threat].n : NODE[n.kind].n;
    return `<button class="mnode k-${n.kind}${can ? ' can' : ''}${been ? ' been' : ''}" style="left:${x(n)}px;top:${y(n.r)}px" ${can ? `data-a="node" data-r="${n.r}" data-i="${n.i}"` : 'disabled'} data-tn="${esc(nodeTitle(n))}" data-tip="${esc(nodeTip(n))}"><span class="g">${NODE[n.kind].g}</span><span class="nl">${esc(lbl)}</span>${n.kind === 'boss' && BR ? `<span class="read r-${BR.label.toLowerCase()}">${BR.label}</span>` : ''}</button>`;
  }).join('');
  $('mapBoard').innerHTML = `<svg class="maplines" viewBox="0 0 ${W} ${Hh}" width="${W}" height="${Hh}">${lines.join('')}</svg>${nodes}`;
  $('mapHead').innerHTML = `<div><div class="lbl">Act ${A.act} of ${ADV.acts}</div><h2>${['The Forest Road', 'The Hill Country', 'The Old Keep'][A.act - 1] || 'The Road'}</h2></div>
    <div class="row" style="gap:16px;align-items:center"><span title="Piggy Bank (single free loss)">Piggy: ${piggyTxt()}</span><b class="goldbig">${gold(RUN.gold)}</b><span class="small mute">${RUN.stats.won} wins</span><button class="btn" data-a="mapShop">Party &amp; stash</button></div>`;

  // Show built-in personal Hero Quests in sidebar!
  const qs = RUN.team.map(h => {
    const q = H[h.key].quest; if (!q) return '';
    const pct = h.questDone ? 100 : Math.round(Math.min(1, (h.questProg || 0) / q.goal) * 100);
    return `<div class="quest" title="${esc(q.rewardName)}: ${esc(q.rewardDesc)}">${iconSlot(h.key, 30)}<div><b>${esc(H[h.key].name)}: ${esc(q.rewardName)}</b><div class="qbar"><i style="width:${pct}%"></i></div><span class="small mute">${h.questDone ? 'COMPLETE ★' : `${Math.round(h.questProg || 0)} / ${q.goal} · ${esc(q.label)}`}</span></div></div>`;
  }).join('');

  $('mapSide').innerHTML = `<div class="lbl">Your party (${RUN.team.length}/4)</div><div class="mparty">${RUN.team.map(h => `<button data-a="card" data-u="${h.uid}" title="${esc(H[h.key].name)}">${iconSlot(h.key, 46)}<span>${rom[h.tier]}${h.questDone ? '★' : ''}</span></button>`).join('')}</div>
    <div class="lbl">Enabled packs (${A.packs.length} · ${A.pool.length} heroes)</div><div class="small">${A.packs.map(k => esc(PACKS[k].n)).join(' · ')}</div>
    <div class="lbl">Hero quests</div>${qs}
    ${BR ? `<div class="lbl">Act boss</div><div class="small"><b>${esc(THREATS[M[ADV.bossRow][0].threat].n)}</b>: <span class="read r-${BR.label.toLowerCase()}">${BR.label}</span></div>` : ''}`;
  paintCanvases($('advmap')); paintTokens($('advmap')); show('advmap'); A.stage = 'map'; saveRun();
  checkPendingPath();
}

function chooseNode(r, i) {
  const n = RUN.adv.map[r][i];
  if (!nextNodes(RUN).includes(n)) return;
  RUN.adv.path = RUN.adv.path || [];
  if (RUN.adv.pos) RUN.adv.path.push({ ...RUN.adv.pos });
  const k = enterNode(RUN, n);
  if (k === 'fight') { enterShop(); return; }
  eventModal(k);
}

/* ---------- Map Events (Training Tier-Up / Stat Drill, Campfire Retrain, Quest Boost, Treasure) ---------- */
function finishEvent(msg) { if (msg) toast(msg); closeModal(true); clearNode(RUN); renderMap(); }

function eventModal(k, arg) {
  const on = RUN.team;
  if (k === 'train') {
    if (!arg) {
      const canProm = on.filter(h => h.tier < 4);
      openModal(`<div class="mpanel"><div class="lbl">Training grounds</div><h2>Promote or Drill</h2>
        <p class="mute small">Choose a hero to <b>promote +1 Tier for free</b> (no shop RNG!) or drill for <b>+1 permanent attribute</b>.</p>
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
    const active = on.filter(h => !h.questDone && H[h.key].quest);
    openModal(`<div class="mpanel"><div class="lbl">Quest board</div><h2>Accelerate a Hero Quest</h2>
      <p class="mute small">${active.length ? 'Advance one hero’s personal Quest by +35% toward their Signature Reward.' : 'All active Hero Quests are already complete!'}</p>
      <div class="evquests">${active.map(h => {
        const q = H[h.key].quest;
        return `<button class="evquest" data-a="evQuestBoost" data-u="${h.uid}">${iconSlot(h.key, 48)}<span><b>${esc(H[h.key].name)} · ${esc(q.rewardName)}</b><br><span class="small mute">${Math.round(h.questProg || 0)}/${q.goal} — ${esc(q.label)}</span></span></button>`;
      }).join('')}</div>
      <div class="row" style="justify-content:center"><button class="btn" data-a="evSkip">Move on</button></div></div>`, null, true);
    return;
  }

  if (k === 'rest') {
    const retrainable = on.filter(h => h.tier >= 2 && h.path && H[h.key].paths.length >= 2);
    openModal(`<div class="mpanel"><div class="lbl">Campfire</div><h2>Rest, Forage, or Retrain</h2>
      <p class="mute small">Retrain any Tier II+ hero’s Path for free to pivot cleanly into new Pack synergies, or stock up on Gold.</p>
      ${retrainable.length ? `<div class="lbl">Retrain Tier II Path (Free)</div><div class="evheroes">${retrainable.map(h => {
        const curP = H[h.key].paths.find(p => p.k === h.path);
        const altP = H[h.key].paths.find(p => p.k !== h.path);
        if (!curP || !altP) return '';
        return `<button class="evhero" data-a="evRetrain" data-u="${h.uid}" data-p="${altP.k}">${iconSlot(h.key, 52)}<b>${esc(H[h.key].name)}</b><span class="small mute">${esc(curP.n)} → <b>${esc(altP.n)}</b></span></button>`;
      }).join('')}</div>` : ''}
      <div class="row" style="justify-content:center;gap:12px;margin-top:8px">
        ${!RUN.piggyBroken ? `<button class="btn big" data-a="evRest" data-p="piggy">Fill Piggy Bank (+4g saved)</button>` : ''}
        <button class="btn primary big" data-a="evRest" data-p="gold">Forage (+${gold(6)})</button>
      </div></div>`, null, true);
    return;
  }

  if (k === 'treasure' || k === 'loot') {
    const T = k === 'loot' ? RUN.adv.loot : treasureOffer(RUN);
    RUN.adv._t = T;
    openModal(`<div class="mpanel"><div class="lbl">${k === 'loot' ? 'Spoils of the elite' : 'Treasure'}</div><h2>Take one item</h2>
      <div class="evitems">${T.map((it, i) => `<button class="evitem" data-a="evTake" data-i="${i}" data-p="${k}">${itemIcon(it, 48)}<span><b>${esc(ITEMS[it].n)}</b><br><span class="small">${esc(itemText(it))}</span></span></button>`).join('')}</div>
      <div class="row" style="justify-content:center"><button class="btn" data-a="evSkip" data-p="${k}">Leave it</button></div></div>`, null, true);
  }
}

/* ---------- Reworked Shop (2 Recruit + 1 Upgrade, Direct Equip/Drag, Favoured & Synergy Highlights) ---------- */
let SHOP_SEL_ITEM = null;
const isFavMatch = (k, h) => !!(k && h && (favFor(k, h.key) || (h.key === 'wallaby' && h.questDone && ITEMS[k + '@fav'])));

function enterShop() {
  SHOP_SEL_ITEM = null;
  if (!RUN.adv) buildEncounter(RUN);
  const fresh = openShop(RUN);
  renderShop(); show('shop'); saveRun();
  if (!fresh) toast('Your frozen shop is waiting.');
}

function renderShop() {
  const R = RUN;
  if (SHOP_SEL_ITEM != null && !R.stash[SHOP_SEL_ITEM]) SHOP_SEL_ITEM = null;
  $('shopStats').innerHTML = `<div class="stat"><b>${actOf(R)}</b><span>Act</span></div><div class="stat"><b>${R.stats.won}</b><span>Wins</span></div><div class="stat"><b>${piggyTxt()}</b><span>Piggy Bank</span></div><div class="stat"><b class="goldbig">${gold(R.gold)}</b><span>Gold</span></div>`;

  const N = R.next;
  const foesHtml = N.foes.map(k => `<img src="${portraitURL(k)}" class="${E[k].elite || E[k].boss ? 'el' : ''}" alt="${esc(E[k].name)}" title="${esc(E[k].name)}">`).join('');
  $('nextFight').innerHTML = `<div><div class="lbl">${advLabel()}${R.retries ? ` · Piggy Bank Retry (${Math.round((1 - Math.pow(CURVE.retry, R.retries)) * 100)}% softer)` : ''}</div><h3>${esc(N.n)}${N.boss ? '<span class="bossb">BOSS</span>' : ''}</h3><div class="q">${esc(N.q)}.</div><div class="foes">${foesHtml}</div></div>
    <div style="display:grid;gap:6px;justify-items:end"><span class="small" style="color:#cdb68a">Win: +${gold(ECON.winGold(R.depth))}</span><button class="btn primary big" data-a="tobattle">To battle</button></div>`;

  const on = R.team;
  const selItemKey = SHOP_SEL_ITEM != null ? R.stash[SHOP_SEL_ITEM] : null;
  // Mechanical tags & Class Keywords shown as readability cues (zero trait-counting bonuses)
  const tc = {}, kc = {};
  on.forEach(h => {
    tagsOf(h.key).forEach(t => tc[t] = (tc[t] || 0) + 1);
    classKwOf(h.key).forEach(kwk => kc[kwk] = (kc[kwk] || 0) + 1);
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

  const rp = rerollPrice(R);
  $('rerollBtn').innerHTML = `Reroll · ${gold(rp)}`; $('rerollBtn').disabled = R.gold < rp;
  $('freezeBtn').textContent = R.shop.frozen ? 'Frozen' : 'Freeze'; $('freezeBtn').classList.toggle('primary', !!R.shop.frozen);
  $('shopNote').innerHTML = `2 Recruit slots + 1 Upgrade slot · Act ${actOf(R)} recruits start at Tier ${actOf(R) === 1 ? 'I' : actOf(R) === 2 ? 'II' : 'II–III'} · Full sell refund`;
  paintCanvases($('shop')); paintTokens($('shop'));
  document.querySelectorAll('#offers canvas[data-osplash]').forEach(c => drawSplash(c, c.dataset.osplash, 240, 200));
  checkPendingPath();
}

function heroOfferCard(k, i, partyTagSet, partyKwSet) {
  const kind = (RUN.shop.slotKind && RUN.shop.slotKind[i]) || (i === 2 ? 'upgrade' : 'recruit');
  if (!k) return `<div class="ho18 sold"><span class="small mute">${kind === 'upgrade' ? 'Upgrade slot · Sold' : 'Recruit slot · Sold'}</span></div>`;
  const d = H[k], o = heroOffer(RUN, k, i), ot = o.offerTier || 1, lk = RUN.shop.lockH[i];
  const can = !o.maxed && RUN.gold >= o.price;
  const slotBadge = o.upgrade ? `<span class="slotbadge upg">UPGRADE</span>` : `<span class="slotbadge rec">RECRUIT</span>`;
  const own = o.upgrade ? `<div class="ownline">Tier ${rom[o.upgrade.tier]} → <b>Tier ${rom[o.tier]}</b></div>` : (ot >= 2 ? `<div class="ownline">Pre-tiered <b>Tier ${rom[ot]}</b> recruit (pick Path on buy)</div>` : '');
  const ckwHtml = (d.ckw || []).map(e => classKwPill(e.k, !!(partyKwSet && partyKwSet.has(e.k)), e.sub)).join('');
  const ckwLine = (d.ckw && d.ckw[0]) ? `<div class="hoab kwline"><b>${esc(CLASS_KW[d.ckw[0].k].n)}</b> ${esc(d.ckw[0].x)}</div>` : '';
  const tagHtml = tagsOf(k).map(t => {
    const D = TAGDEF[t]; if (!D) return '';
    const match = partyTagSet && partyTagSet.has(t);
    return `<span class="tag18${match ? ' syn' : ''}" style="--tc:${D.c}" data-tn="${esc(D.n)}${match ? ' (Party Match)' : ''}" data-tip="${esc(D.x)}${match ? ' Shares synergy tag with your current party.' : ''}">${match ? '★ ' : ''}${esc(D.n)}</span>`;
  }).join('');
  return `<div class="ho18${lk ? ' locked' : ''}${can ? '' : ' poor'}" style="--tc:${TIERCOL[ot]}" data-a="${o.maxed ? 'offerCard' : 'buyHero'}" data-i="${i}">
    <div class="hoart"><canvas data-osplash="${k}"></canvas>${slotBadge}<span class="hotier">${rom[ot]}</span>${o.sale ? `<span class="salebadge">−${o.sale}</span>` : ''}</div>
    <div class="hob"><div class="hon">${esc(d.name)}</div><div class="hoc">${esc(d.cls)} · ${esc(d.role)}</div><div class="hotags">${ckwHtml}${tagHtml}</div>${ckwLine}<div class="hoab"><b>${esc(d.abil.n)}</b> ${esc(abil1(k))}</div>${own}</div>
    <div class="hof"><b class="price">${o.maxed ? 'Max' : gold(o.price)}</b><span><button class="btn sm lockb${lk ? ' on' : ''}" data-a="lockH" data-i="${i}">${lk ? 'Kept' : 'Lock'}</button><button class="btn sm" data-a="offerCard" data-i="${i}">Card</button></span></div></div>`;
}

function partyChip(h, selItemKey) {
  const d = H[h.key], path = h.path ? d.paths.find(p => p.k === h.path) : null;
  const q = d.quest;
  const qPct = q ? (h.questDone ? 100 : Math.round(Math.min(1, (h.questProg || 0) / q.goal) * 100)) : 0;
  const maxS = slotsOf(h);
  let eqCls = '', favBadge = '';
  if (selItemKey) {
    const canEq = h.items.length < maxS && canCarry(h, selItemKey);
    const fav = canEq && isFavMatch(selItemKey, h);
    eqCls = fav ? ' can-equip fav-match' : canEq ? ' can-equip' : ' no-equip';
    if (fav) favBadge = `<span class="favpill">★ Favoured</span>`;
  }
  const itemsRow = `<div class="pitems">${Array.from({ length: maxS }, (_, j) => h.items[j]
    ? `<span class="pit" data-a="shopUnequip" data-u="${h.uid}" data-i="${j}" title="${esc(ITEMS[h.items[j]].n)}${isFavMatch(h.items[j], h) ? ' (★ Favoured!)' : ''}: click to unequip">${itemIcon(h.items[j], 22)}</span>`
    : `<span class="pit empty" title="Empty item slot"></span>`).join('')}</div>`;
  const questRow = q ? `<div class="chipq${h.questDone ? ' done' : ''}" title="${esc(q.rewardName)}: ${esc(q.rewardDesc)}"><div class="cqbar"><i style="width:${qPct}%"></i></div><span>${h.questDone ? '★ Quest Done' : `${Math.round(h.questProg || 0)}/${q.goal}`}</span></div>` : '';
  return `<div class="pchip${eqCls}" style="--tc:${TIERCOL[h.tier]}" data-drop-hero="${h.uid}" ${selItemKey ? `data-a="shopEquip" data-u="${h.uid}"` : ''}>
    <span data-a="${selItemKey ? 'shopEquip' : 'card'}" data-u="${h.uid}" title="${selItemKey ? 'Click to equip selected item' : 'View full card & Quest'}">${iconSlot(h.key, 42)}</span>
    <div style="min-width:0"><b>${esc(d.name)}</b> <span class="tb">${rom[h.tier]}</span>${favBadge}
      <div class="small mute">${path ? esc(path.n) : h.tier >= 2 ? `<button class="needpath" data-a="path" data-u="${h.uid}">Choose Path</button>` : esc(d.cls)}</div>
      ${itemsRow}${questRow}
    </div>
    <button class="btn sm" data-a="sell" data-u="${h.uid}" ${RUN.team.length <= 1 ? 'disabled' : ''}>Sell ${heroValue(h.tier)}</button></div>`;
}

function itemOfferCard(k, i, partyKwSet) {
  if (!k) return `<div class="io18 sold"><span class="small mute">Sold</span></div>`;
  const it = ITEMS[k], R = RARITY[it.r], p = itemPrice(RUN, i), lk = RUN.shop.lockI[i];
  const favNames = RUN.team.filter(h => isFavMatch(k, h)).map(h => short(H[h.key].name));
  const kwMatches = itemKwHooks(k).filter(kwk => partyKwSet && partyKwSet.has(kwk)).map(kwk => CLASS_KW[kwk].n);
  const favLine = favNames.length
    ? `<div class="iofav">★ Favoured: ${esc(favNames.join(', '))}</div>`
    : (kwMatches.length ? `<div class="iofav kw">★ Synergy: ${esc(kwMatches.slice(0, 2).join(', '))}</div>` : '');
  return `<div class="io18${lk ? ' locked' : ''}${(favNames.length || kwMatches.length) ? ' hasfav' : ''}" data-a="buyItem" data-i="${i}" title="${esc(it.n)}: ${esc(itemText(k))}">${itemIcon(k, 36)}<div><div class="inm">${esc(it.n)}</div><div class="rar" style="color:${R.col}">${R.n} · ${gold(p)}</div>${favLine}</div><button class="btn sm lockb${lk ? ' on' : ''}" data-a="lockI" data-i="${i}">${lk ? 'Kept' : 'Lock'}</button></div>`;
}

function heroCardModal(h, extra) {
  const cfg = cfgOf(h, RUN);
  const items = h.items.length ? `<div class="citems"><span class="lbl">Carrying (${h.items.length}/${slotsOf(h)})</span>${h.items.map(k => `<div>${itemIcon(k, 28)}<span><b>${esc(ITEMS[k].n)}</b> · ${glossarize(itemText(k))}</span></div>`).join('')}</div>` : '';
  openModal(largeCard(h.key, h.tier, { cfg, heroObj: h, items, foot: extra || '' }));
}

function pathModal(h, sel) {
  const d = H[h.key]; sel = sel || d.paths[0].k; const cfg = { ...cfgOf(h, RUN), path: sel };
  const opt = (p, idx) => `<button class="pathopt${p.k === sel ? ' sel' : ''}" data-a="previewPath" data-u="${h.uid}" data-p="${p.k}"><b>${idx === 0 ? 'Path 1 (Vertical): ' : 'Path 2 (Splash): '}${esc(p.n)}</b>
    <span class="ptags">${p.attr ? `<span class="grow" style="--ac:${ATTR_COL[p.attr]}">+1 ${ATTR_S2[p.attr]}</span>` : ''}${(p.tags || []).map(t => tagPill(t)).join('')}</span>
    <span>${glossarize(p.full || p.x)}</span>${p.t4x ? `<span class="small mute"><b>Tier IV:</b> ${glossarize(p.t4x)}</span>` : ''}</button>`;
  openModal(`<div class="mpanel pathpanel"><div class="row" style="gap:12px;flex-wrap:nowrap">${iconSlot(h.key, 64)}<div><div class="lbl">${esc(d.name)} reaches Tier II</div><h2>Choose ${esc(d.name)}’s Path</h2></div></div>
    <p class="mute small">Path 1 fuels ${esc(d.name)}’s own firework; Path 2 wires it into teammates. You can retrain freely at any Campfire.</p>
    <div class="pathopts">${d.paths.map(opt).join('')}</div>
    <div class="pathprev">${largeCard(h.key, h.tier, { cfg, heroObj: h, previewPath: sel, compact: 1 })}</div>
    <div class="row" style="justify-content:center"><button class="btn primary big" data-a="choosePath" data-u="${h.uid}" data-p="${sel}">Choose ${esc(d.paths.find(p => p.k === sel).n)}</button></div></div>`, null, true);
}

function swapModal(i) {
  const k = RUN.shop.heroes[i], o = heroOffer(RUN, k, i);
  openModal(`<div class="mpanel"><div class="lbl">Party is full (4/4)</div><h2>Replace who with ${esc(H[k].name)} (Tier ${rom[o.tier]})?</h2>
    <p class="small mute">Replaced hero refunds full gold worth (${gold(0).replace('0 ', '')}) and returns their items to stash.</p>
    <div class="evheroes">${RUN.team.map(h => `<button class="evhero" data-a="swapBuy" data-i="${i}" data-u="${h.uid}">${iconSlot(h.key, 52)}<b>${esc(H[h.key].name)}</b><span class="small mute">Tier ${rom[h.tier]} · refunds ${heroValue(h.tier)}g</span></button>`).join('')}</div>
    <div class="row" style="justify-content:center"><button class="btn" data-a="closeModal">Cancel</button></div></div>`);
}

/* ---------- Placement & Combat ---------- */
let SEL_ITEM = null;
function renderItemTray() {
  const pb = $('pbench'); if (!pb) return;
  if (B) { pb.hidden = true; return; }
  pb.hidden = false;
  if (!RUN.stash.length) { pb.innerHTML = `<span class="small mute">Item stash is empty — buy items in the shop or earn them from Treasure &amp; Elites.</span>`; return; }
  pb.innerHTML = `<span class="lbl" style="margin-right:8px">Equip items</span>` + RUN.stash.map((k, i) =>
    `<button class="titem${SEL_ITEM === i ? ' sel' : ''}" data-a="trayItem" data-i="${i}" title="${esc(ITEMS[k].n)}: ${esc(itemText(k))}">${itemIcon(k, 34)}<span>${esc(ITEMS[k].n)}</span></button>`
  ).join('') + (SEL_ITEM != null ? `<span class="small mute" style="margin-left:8px">Click a hero below to equip ${esc(ITEMS[RUN.stash[SEL_ITEM]].n)}</span>` : '');
}

function goPlacement() {
  clearTimeout(_resTimer); _resTimer = 0;
  B = null; running = false; paused = false; FX = []; resultShown = false; SEL_ITEM = null;
  autoPlace(RUN); S.party = boardHeroes(RUN); S.sel = null; S.selE = null;
  loadMap(ENC.run.map); mapDirty = true; _setupKey = '';
  $('result').hidden = true; show('combat'); renderCombatBar(); renderStrip();
  requestAnimationFrame(() => resize());
  $('hint').hidden = false; $('hint').textContent = 'Drag heroes onto gold deploy squares, equip items from the tray below, then begin.';
  saveRun();
}

function renderCombatBar() {
  const N = RUN.next;
  $('cTitle').innerHTML = `${advLabel()} · ${esc(N.n)}${N.boss ? ' <span class="bossb">BOSS</span>' : ''}`;
  $('cSub').textContent = N.q + '.';
  $('cStats').innerHTML = `<span title="Piggy Bank">Piggy: ${piggyTxt()}</span><span>${gold(RUN.gold)}</span><span id="cGold"></span><span>Wins ${RUN.stats.won}</span>`;
  const sp = [0.5, 1, 2, 4].map(v => `<button class="btn${S.speed === v ? ' on' : ''}" data-a="spd" data-v="${v}">${v}×</button>`).join('');
  $('cCtl').innerHTML = B
    ? `${sp}<button class="btn" data-a="pause">${paused ? 'Resume' : 'Pause'}</button><button class="btn" data-a="sound">${S.sound ? 'Sound on' : 'Sound off'}</button><button class="btn" data-a="btext">${BTXT === 'all' ? 'All text' : 'Key text'}</button>`
    : `<button class="btn" data-a="backshop">Back to shop</button><button class="btn" data-a="autoplace">Auto place</button><button class="btn primary" data-a="begin-battle">Begin battle</button>`;
}

function startBattle() {
  clearTimeout(_resTimer); _resTimer = 0;
  if ($('pbench')) $('pbench').hidden = true;
  B = newBattle('run', partyCfg(RUN), 1);
  running = true; paused = false; resultShown = false; FX = []; simAcc = 0;
  $('hint').hidden = true; renderCombatBar(); renderStrip();
}

function renderStrip() {
  const hs = boardHeroes(RUN);
  renderItemTray();
  $('strip').innerHTML = hs.map(h => `<button class="pc" style="${roleStyle(h.key, h.tier)}" data-a="pcard" data-u="${h.uid}" data-key="${h.key}">${iconSlot(h.key, 44)}<div style="min-width:0"><div class="pn">${esc(H[h.key].name)}<i>${rom[h.tier]}${h.questDone ? '★' : ''}</i></div><div class="pbar"><i style="width:100%"></i><u style="left:100%;width:0"></u><s style="width:0"></s></div><div class="pbar ch"><i style="width:0"></i></div>${!B ? `<div class="pitems">${Array.from({ length: slotsOf(h) }, (_, j) => h.items[j] ? `<span class="pit" data-a="trayOff" data-u="${h.uid}" data-i="${j}" title="${esc(ITEMS[h.items[j]].n)}: click to unequip">${itemIcon(h.items[j], 22)}</span>` : `<span class="pit empty"></span>`).join('')}</div>` : ''}</div></button>`).join('');
  paintTokens($('strip')); paintCanvases($('strip')); updateStrip();
}

function updateStrip() {
  if (PHASE !== 'combat') return;
  const cg = $('cGold'); if (cg) cg.innerHTML = B && B.gold ? `+${gold(B.gold)} looted` : '';
  document.querySelectorAll('#strip .pc').forEach(el => {
    const u = B && B.units.find(x => x.side === 'P' && x.key === el.dataset.key);
    const bars = el.querySelectorAll('.pbar');
    if (!u) { bars[0].querySelector('i').style.width = '100%'; bars[0].querySelector('u').style.width = '0'; bars[0].querySelector('s').style.width = '0'; return; }
    const hp = Math.max(0, u.hp), ward = Math.max(0, u.ward || 0), nec = Math.max(0, u.nec || 0);
    const totalCap = Math.max(u.maxHp, hp + ward);
    const hpPct = (hp / totalCap) * 100;
    const wardPct = Math.min(100 - hpPct, (ward / totalCap) * 100);
    const necPct = Math.min(100, (nec / totalCap) * 100);
    bars[0].querySelector('i').style.width = hpPct + '%';
    const wu = bars[0].querySelector('u'); wu.style.left = hpPct + '%'; wu.style.width = wardPct + '%';
    bars[0].querySelector('s').style.width = necPct + '%';
    const ci = bars[1].querySelector('i'); ci.style.width = (u.charge || 0) + '%'; ci.classList.toggle('full', u.charge >= 100);
    el.classList.toggle('dead', !u.alive);
  });
}
setInterval(updateStrip, 120);

function liveLine(key) {
  const u = B && B.units.find(x => x.side === 'P' && x.key === key); if (!u) return '';
  return `<div class="live">${u.alive ? `HP ${Math.max(0, Math.round(u.hp))}/${u.maxHp}${u.ward > 0 ? ` · Ward ${Math.round(u.ward)}` : ''} · Charge ${Math.round(u.charge)}%` : 'Fallen'} · dmg ${Math.round(u.stats.dmg)}${u.stats.heal ? `, heal ${Math.round(u.stats.heal)}` : ''}</div>`;
}
function renderSide() {
  if (S.sel && B) { const h = RUN.team.find(x => x.key === S.sel); if (h) heroCardModal(h, liveLine(h.key)); S.sel = null; }
  if (S.selE != null && S.selE !== false) { const en = typeof S.selE === 'object' ? S.selE : previewEnemy(S.selE); S.selE = null; if (en) enemyCardModal(en); }
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

/* Live v0.22 power-fantasy counters drawn beneath hero tokens on the battle map */
function tokenCounter(u) {
  if (!B) return null;
  if (u.zealotT > 0) return [`ZEALOT ${u.zealotT.toFixed(1)}s`, '#ffe9a0'];
  if (u.beast && u.beast.hp > 0) return [`PANTHER`, '#8fd0ff'];
  if (u.illusoryDouble > 0) return [`DOUBLE ×${u.illusoryDouble}`, '#c48fe6'];
  if (u.radiantSoulT > 0) return [`RADIANT`, '#ffe9a0'];
  if (u.alert > 0) return [`ALERT ×${u.alert}`, '#8fd0ff'];
  if (u.bearRage > 0) return [`BEAR ×${u.bearRage}`, '#ff6a4a'];
  if (u.f && u.f.sorceryBar) { const mx = u.f.draconicSurge && u.tier >= 4 ? 3 : 4; return ['SORC ' + '●'.repeat(u.sorcery || 0) + '○'.repeat(Math.max(0, mx - (u.sorcery || 0))), '#ff9c4a']; }
  if (u.kw && u.kw.ki && u.ki > 0) { const mx = kiCost(u); return ['KI ' + '●'.repeat(u.ki) + '○'.repeat(Math.max(0, mx - u.ki)), '#8fd8d8']; }
  if (u.afterimage > 0) return [`AFTER ×${u.afterimage}`, '#8fd8d8'];
  if (u.inspDie) return [`d${u.inspDie.sides} INSP`, '#ffd76a'];
  if (u.bonded) return [`BOND +d${u.bondDie || 4}`, '#ffe9a0'];
  if (u.clauses > 0) return [`CLAUSE ×${u.clauses}`, '#c48fe6'];
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
    msg = `+${gold(res.gold + res.made + (res.elite || 0) + (res.actBonus || 0))}${actBonusTxt} · ${RUN.gold} gold · Piggy Bank ${RUN.piggyBroken ? 'broken' : `holds ${RUN.piggy}g`}`;
  } else if (!RUN.over) {
    msg = `Piggy Bank broke! Paid out +${gold(res.piggy)} — visit the shop, adjust your party, and retry this fight!`;
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
    <div class="row" style="justify-content:center"><button class="btn primary big" data-a="afterFight">${RUN.over ? 'See run summary' : res.actDone ? `Begin Act ${RUN.adv.act + 1}` : !won ? 'To shop & retry' : 'Back to map'}</button></div></div>`;
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
  if (to === 'over') renderOver();
  else if (to === 'packs') renderPacks();
  else if (to === 'shop') enterShop();
  else { _bossKey = ''; _bossRead = null; renderMap(); }
}

function highlights(u) {
  const s = u.stats, c = [];
  if (s.actionSurges) c.push(`${s.actionSurges} Action Surge${s.actionSurges > 1 ? 's' : ''}`);
  if (s.channelDivinities) c.push(`${s.channelDivinities} Channel Div.`);
  if (s.smites) c.push(`${s.smites} Smites`);
  if (s.arcaneRecoveries) c.push(`${s.arcaneRecoveries} Arcane Rec.`);
  if (s.bearRagePeak) c.push(`Rage ×${s.bearRagePeak}`);
  else if (s.zealotProcs) c.push(`${s.zealotProcs} Zealot Rage`);
  if (s.wildShapes) c.push(`${s.wildShapes} Wild Shape`);
  if (s.kiStrikes) c.push(`${s.kiStrikes} Ki Abil.`);
  if (s.metamagics) c.push(`${s.metamagics} Metamagic`);
  if (s.pactBoons) c.push(`${s.pactBoons} Pact Boons`);
  if (s.sneaks) c.push(`${s.sneaks} Sneaks`);
  if (s.alertDodges) c.push(`${s.alertDodges} dodges`);
  if (s.rootsApplied) c.push(`${s.rootsApplied} roots`);
  if (s.inspPassed) c.push(`${s.inspPassed} passes`);
  if (s.gold) c.push(`+${s.gold}g`);
  return c.length ? `<div class="hl">${c.slice(0, 3).map(x => `<span>${x}</span>`).join('')}</div>` : '';
}

function recordBest() {
  const b = getBest(), lead = RUN.team.slice().sort((a, c) => c.tier - a.tier)[0];
  if (!b || RUN.stats.won > b.won) setBest({ won: RUN.stats.won, victory: RUN.victory, lead: lead && lead.key, date: Date.now() });
}
function renderOver() {
  const R = RUN;
  $('overBox').innerHTML = `<div class="lbl">${R.victory ? 'Victory' : 'Run Ended'}</div><h1>${R.victory ? 'All Three Acts Cleared!' : 'Fallen in the Adventure'}</h1>
    <div><div class="bigscore">${R.stats.won}</div><div class="mute">fights won</div></div>
    <div class="overteam">${R.team.map(h => `<div>${iconSlot(h.key, 64)}<b>${esc(H[h.key].name)}</b><span class="mute">Tier ${rom[h.tier]}${h.path ? ' · ' + esc(H[h.key].paths.find(p => p.k === h.path).n) : ''}${h.questDone ? ' · ★' : ''}</span></div>`).join('')}</div>
    <p class="small mute">Gold earned ${R.stats.gold} · spent ${R.stats.spent} · rerolls ${R.stats.rerolls}</p>
    <div class="row" style="justify-content:center"><button class="btn primary big" data-a="newrun">New run</button><button class="btn" data-a="title">Title</button></div>`;
  paintTokens($('overBox')); show('over');
}

function changelogModal() { openModal(`<div class="mpanel" style="max-width:720px"><h2>What’s new in 0.22</h2><div class="changelog">${CHANGELOG_HTML}</div></div>`); }

/* ---------- Global Click & Keyboard Input ---------- */
document.addEventListener('click', e => {
  if (e.target === $('modal') && !modalForced()) { closeModal(); return; }
  const el = e.target.closest('[data-a]'); if (!el) return;
  const a = el.dataset.a;
  if (modalForced() && !el.closest('#modal')) return;
  const uid = +el.dataset.u, i = +el.dataset.i;
  const h = RUN && RUN.team.find(x => x.uid === uid);

  if (a === 'trayItem') { SEL_ITEM = SEL_ITEM === i ? null : i; renderItemTray(); return; }
  if (a === 'trayOff') { e.stopPropagation(); if (unequip(RUN, uid, i)) { SEL_ITEM = null; renderStrip(); saveRun(); } return; }
  if (a === 'pcard' && SEL_ITEM != null && !B) {
    const hh = RUN.team.find(x => x.uid === uid);
    if (hh && hh.items.length >= slotsOf(hh)) { toast(`${H[hh.key].name} has no free item slot (${hh.items.length}/${slotsOf(hh)})`); return; }
    const k = RUN.stash[SEL_ITEM];
    if (!canCarry(hh, k)) { toast(`${ITEMS[k].n} is a ${ITEMS[k].t} weapon!`); return; }
    if (equip(RUN, uid, SEL_ITEM)) { toast(`${H[hh.key].name} equips ${ITEMS[k].n}`); SEL_ITEM = null; renderStrip(); saveRun(); }
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
      else if (st === 'map' || st === 'event') { RUN.adv.node = null; RUN.adv.stage = 'map'; renderMap(); }
      else if (RUN.phase === 'shop') { renderShop(); show('shop'); }
      else goPlacement();
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
    case 'mapShop': openModal(`<div class="mpanel"><div class="lbl">Your party</div><div class="evheroes">${RUN.team.map(x => `<button class="evhero" data-a="card" data-u="${x.uid}">${iconSlot(x.key, 56)}<b>${esc(H[x.key].name)}</b><span class="small mute">Tier ${rom[x.tier]}${x.questDone ? ' · ★' : ''}</span></button>`).join('')}</div><div class="lbl">Stash</div><div>${RUN.stash.map(k => `<span title="${esc(ITEMS[k].n)}: ${esc(itemText(k))}">${itemIcon(k, 40)}</span>`).join(' ') || '<span class="small mute">Empty</span>'}</div></div>`); break;
    case 'evPromote': {
      const r = promoteHero(RUN, uid);
      if (r.ok) {
        closeModal(true); clearNode(RUN); renderMap();
        toast(`${H[r.hero.key].name} promoted to Tier ${rom[r.hero.tier]}!`);
        checkPendingPath();
      } else {
        finishEvent();
      }
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
      if (r) finishEvent(r.completed ? `★ Quest Complete! ${H[r.h.key].name} unlocks ${r.q.rewardName}!` : `${H[r.h.key].name} Quest boosted (+${r.boost})!`);
      else finishEvent();
      break;
    }
    case 'evRest': finishEvent(restAt(RUN, el.dataset.p)); break;
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
    case 'tobattle': if (RUN.team.some(x => x.tier >= 2 && !x.path)) return toast('Choose a Tier II path first'); goPlacement(); break;
    case 'backshop': renderShop(); show('shop'); break;
    case 'autoplace': autoPlace(RUN, true); S.party = boardHeroes(RUN); _setupKey = ''; saveRun(); break;
    case 'begin-battle': startBattle(); break;
    case 'afterFight': afterFight(); break;
    case 'spd': S.speed = +el.dataset.v; renderCombatBar(); break;
    case 'pause': paused = !paused; renderCombatBar(); break;
    case 'sound': S.sound = !S.sound; renderCombatBar(); break;
    case 'btext': BTXT = BTXT === 'all' ? 'key' : 'all'; renderCombatBar(); break;
    case 'pcard': if (h) heroCardModal(h, liveLine(h.key)); break;
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
    case 'stashSelect': {
      SHOP_SEL_ITEM = SHOP_SEL_ITEM === i ? null : i;
      renderShop();
      break;
    }
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
        toast(fav ? `★ Favoured! ${H[h.key].name} equips ${ITEMS[k].n}` : `${H[h.key].name} equips ${ITEMS[k].n}`);
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
    case 'stashSell': {
      const k = RUN.stash[i]; if (!k) break;
      openModal(`<div class="mpanel"><div class="row" style="gap:10px">${itemIcon(k, 48)}<div><h2>${esc(ITEMS[k].n)}</h2><p class="small">${glossarize(itemText(k))}</p></div></div><p class="small mute">Click or drag items onto a hero in the Shop to equip them.</p><div class="row"><button class="btn" data-a="sellItem" data-i="${i}">Sell for ${itemRefund(RUN, k)}g</button><button class="btn" data-a="closeModal">Keep</button></div></div>`);
      break;
    }
    case 'sellItem': { const back = sellItem(RUN, i); SHOP_SEL_ITEM = null; closeModal(); toast(`Sold for ${back}g`); renderShop(); saveRun(); break; }
    case 'reroll': if (!reroll(RUN)) return toast('Not enough gold'); renderShop(); saveRun(); break;
    case 'lockH': toast(toggleLock(RUN, 'h', i) ? 'Locked for next shop' : 'Unlocked'); renderShop(); saveRun(); break;
    case 'lockI': toast(toggleLock(RUN, 'i', i) ? 'Locked for next shop' : 'Unlocked'); renderShop(); saveRun(); break;
    case 'freeze': toast(toggleFreeze(RUN) ? 'Shop frozen for next round' : 'Unfrozen'); renderShop(); saveRun(); break;
    case 'path': if (h) pathModal(h); break;
    case 'previewPath': if (h) pathModal(h, el.dataset.p); break;
    case 'previewAsi': if (h) asiModal(h, el.dataset.p); break;
    case 'chooseAsi': closeModal(true); if (h) { h.asi = el.dataset.p; toast(`${H[h.key].name}: +2 ${ATTR_N[h.asi]}`); } if (PHASE === 'shop') renderShop(); else renderMap(); saveRun(); checkPendingPath(); break;
    case 'choosePath': closeModal(true); if (h) { h.path = el.dataset.p; const pn = H[h.key].paths.find(p => p.k === h.path); toast(`${H[h.key].name}: ${pn ? pn.n : h.path}`); } if (PHASE === 'shop') renderShop(); else renderMap(); saveRun(); checkPendingPath(); break;
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
document.addEventListener('dragend', () => {
  document.querySelectorAll('.pchip.ddover').forEach(x => x.classList.remove('ddover'));
  _dragStashIdx = null;
});
document.addEventListener('dragover', e => {
  if (_dragStashIdx == null) return;
  const chip = e.target.closest('.pchip[data-drop-hero]');
  if (!chip) return;
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  chip.classList.add('ddover');
});
document.addEventListener('dragleave', e => {
  const chip = e.target.closest('.pchip[data-drop-hero]');
  if (chip) chip.classList.remove('ddover');
});
document.addEventListener('drop', e => {
  if (_dragStashIdx == null) return;
  const chip = e.target.closest('.pchip[data-drop-hero]');
  if (!chip) return;
  e.preventDefault();
  chip.classList.remove('ddover');
  const idx = _dragStashIdx; _dragStashIdx = null;
  const uid = +chip.dataset.dropHero;
  const hh = RUN && RUN.team.find(x => x.uid === uid);
  const k = RUN && RUN.stash[idx];
  if (!hh || !k) return;
  if (hh.items.length >= slotsOf(hh)) { toast(`${H[hh.key].name} has no free item slot`); return; }
  if (!canCarry(hh, k)) { toast(`${ITEMS[k].n} is a ${ITEMS[k].t} weapon!`); return; }
  const fav = isFavMatch(k, hh);
  if (equip(RUN, uid, idx)) {
    SHOP_SEL_ITEM = null;
    toast(fav ? `★ Favoured! ${H[hh.key].name} equips ${ITEMS[k].n}` : `${H[hh.key].name} equips ${ITEMS[k].n}`);
    renderShop(); saveRun();
  }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
  if (modalForced()) return;
  if (e.key === ' ' && PHASE === 'combat' && B && !B.over && !e.target.closest('input,textarea')) { e.preventDefault(); paused = !paused; renderCombatBar(); }
});
window.addEventListener('resize', () => { if (PHASE === 'combat') resize(); });
if (window.ResizeObserver) new ResizeObserver(() => { if (PHASE === 'combat') resize(); }).observe($('boardWrap'));

function resize() {
  const wrap = $('boardWrap');
  view.pad = 4;
  const W = Math.max(280, wrap.clientWidth - 4), Hh = Math.max(240, (wrap.clientHeight || window.innerHeight - 130) - 4);
  view.T = Math.max(26, Math.min(128, Math.floor(Math.min((W - view.pad * 2) / COLS, (Hh - view.pad * 2) / ROWS))));
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
    else if (PHASE === 'shop' && RUN) renderShop();
    else if (PHASE === 'advmap' && RUN) renderMap();
    else if (PHASE === 'packs' && RUN) renderPacks();
  });
}
document.fonts && document.fonts.ready.then(() => { if (PHASE === 'combat') resize(); });
requestAnimationFrame(frame);
