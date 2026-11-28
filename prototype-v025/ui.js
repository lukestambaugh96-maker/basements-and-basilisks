'use strict';
// Playable v0.25 Act 1 Prototype UI & 60fps Canvas Renderer.
// Drives tools/testbench/{engine.js,behaviour.js,run.js} directly with zero rules drift.

(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html !== undefined) n.innerHTML = html;
    return n;
  };
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const resistPct = r => Math.round(resist(r) * 100);
  const fmtMod = m => (m >= 0 ? '+' : '') + (Number.isInteger(m) ? m : m.toFixed(1));
  const portraitSrc = id => (window.PORTRAITS && (window.PORTRAITS[id] || window.PORTRAITS[id === 'laurel' ? 'mother_laurel' : ''])) || '';

  // Keyword auto-annotation for inline hover tooltips
  const KW_KEYS = Object.keys(GLOSSARY).sort((a, b) => b.length - a.length);
  const KW_REGEX = new RegExp(`\\b(${KW_KEYS.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`, 'g');
  function annotateKw(text) {
    return esc(text).replace(KW_REGEX, m => `<span class="kw" data-tip-kw="${esc(m)}">${m}</span>`);
  }
  function tipAttr(title, body) {
    return `data-tip-title="${esc(title)}" data-tip-body="${esc(body)}"`;
  }
  const STAT_ROLE = {
    STR: 'Adds to Strength weapon damage and physical armor penetration.',
    DEX: 'Adds to Dexterity weapon damage and Rogue/Ranger abilities.',
    CON: 'Adds +8 HP per tier for every +1 modifier (applied retroactively).',
    INT: 'Boosts caster time-charge speed by +10% per +1 modifier and powers Wizard abilities.',
    WIS: 'Powers Cleric, Druid, and Monk abilities and healing.',
    CHA: 'Grants +10 starting charge per +1 modifier (max +50) and powers Sorcerer, Bard, Warlock, and Paladin abilities.',
  };

  // Global floating custom tooltip
  let tipEl = null;
  function ensureTip() {
    if (!tipEl) {
      tipEl = el('div', 'custom-tip');
      tipEl.id = 'customTip';
      tipEl.hidden = true;
      document.body.appendChild(tipEl);
    }
    return tipEl;
  }
  function positionTip(x, y) {
    const t = ensureTip();
    const pad = 14;
    const rect = t.getBoundingClientRect();
    let left = x + pad;
    let top = y + pad;
    if (left + rect.width > window.innerWidth - 10) left = Math.max(10, x - rect.width - pad);
    if (top + rect.height > window.innerHeight - 10) top = Math.max(10, y - rect.height - pad);
    t.style.left = left + 'px';
    t.style.top = top + 'px';
  }
  document.addEventListener('pointerover', e => {
    const hit = e.target && e.target.closest ? e.target.closest('[data-tip-kw],[data-tip-title]') : null;
    if (!hit) return;
    const kw = hit.getAttribute('data-tip-kw');
    const title = kw || hit.getAttribute('data-tip-title');
    const body = kw ? GLOSSARY[kw] : hit.getAttribute('data-tip-body');
    if (!title || !body) return;
    const t = ensureTip();
    t.innerHTML = `<div class="custom-tip-title">${esc(title)}</div><div class="custom-tip-body">${esc(body)}</div>`;
    t.hidden = false;
    positionTip(e.clientX, e.clientY);
  });
  document.addEventListener('pointermove', e => {
    if (tipEl && !tipEl.hidden) positionTip(e.clientX, e.clientY);
  });
  document.addEventListener('pointerout', e => {
    const hit = e.target && e.target.closest ? e.target.closest('[data-tip-kw],[data-tip-title]') : null;
    if (!hit) return;
    const rel = e.relatedTarget && e.relatedTarget.closest ? e.relatedTarget.closest('[data-tip-kw],[data-tip-title]') : null;
    if (rel !== hit && tipEl) tipEl.hidden = true;
  });

  // Preload Image objects for crisp Canvas portrait tokens
  const IMG_CACHE = {};
  if (window.PORTRAITS) {
    for (const [k, src] of Object.entries(window.PORTRAITS)) {
      const im = new Image();
      im.src = src;
      IMG_CACHE[k] = im;
    }
  }
  function heroImg(id, u) {
    if (u && u.side === 'H') {
      if (id === 'kaska' && u.form && IMG_CACHE.kaska_form) return IMG_CACHE.kaska_form;
      if (id === 'arthur' && u.st && u.st.dodge > 0 && IMG_CACHE.arthur_form) return IMG_CACHE.arthur_form;
      if (id === 'pillar' && (u.rage2 > 0 || u.ward > 0) && IMG_CACHE.pillar_form) return IMG_CACHE.pillar_form;
    }
    return IMG_CACHE[id] || (id === 'laurel' ? IMG_CACHE.mother_laurel : null);
  }

  // ---------------- State ----------------
  const S = {
    screen: 'title', // title | starter | shop | deploy | fight | choice | campfire | victory | defeat
    seed: Math.floor(Math.random() * 900000) + 100000,
    run: null,
    starters: [],
    selectedStashIdx: -1,
    selectedDeployUid: null,
    draggingUid: null,
    inspectTarget: null, // { kind: 'hero'|'enemy'|'unit', data }
    modal: null, // { kind, ... }
    choices: [],
    choiceSub: null,
    fight: null,
    lastRes: null,
    speed: 1,
    paused: false,
    tickAcc: 0,
    lastFrame: 0,
    rafId: 0,
    visUnits: new Map(), // fid -> { x, y, lx, ly, flash }
    visFx: [], // projectiles / rings
    floaters: [],
    evCursor: 0,
    fxCursor: 0,
    toastTimer: 0,
  };

  function toast(msg) {
    let t = $('#toastEl');
    if (!t) { t = el('div', 'toast'); t.id = 'toastEl'; document.body.appendChild(t); }
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(S.toastTimer);
    S.toastTimer = setTimeout(() => { t.hidden = true; }, 2600);
  }

  // ---------------- Economy UI helpers (kept outside run.js so testbench stays untouched) ----------------
  function unequipItem(rec, idx) {
    const [ir] = rec.items.splice(idx, 1);
    if (ir) S.run.stash.push(ir);
    S.selectedStashIdx = -1;
    render();
  }
  function sellStashItem(idx) {
    const [ir] = S.run.stash.splice(idx, 1);
    if (!ir) return;
    const it = ITEMS[ir.id];
    const refund = Math.max(1, Math.floor((ir.paid || it.price) * ECON.sellBack));
    S.run.gold += refund;
    S.selectedStashIdx = -1;
    toast(`Sold ${it.name} for +${refund}g`);
    render();
  }
  function sellHeroRec(rec) {
    if (S.run.roster.length <= 1) return toast('Cannot sell your last hero!');
    const idx = S.run.roster.indexOf(rec);
    if (idx < 0) return;
    for (const ir of rec.items) S.run.stash.push(ir);
    S.run.roster.splice(idx, 1);
    const baseSpent = rec.spent || heroCost(rec.tier);
    const refund = Math.max(1, Math.floor(baseSpent * ECON.sellBack));
    S.run.gold += refund;
    if (onBoard(S.run).length === 0 && S.run.roster.length > 0) autoPlace(S.run, S.run.roster[0], false);
    toast(`Sold ${HEROES[rec.id].name} for +${refund}g`);
    render();
  }
  function toggleBoardBench(rec) {
    if (rec.pos) {
      if (onBoard(S.run).length <= 1) return toast('Keep at least 1 hero on the board.');
      if (onBench(S.run).length >= ECON.benchMax) return toast('Bench is full.');
      rec.pos = null;
    } else {
      if (onBoard(S.run).length >= ECON.boardMax) return toast(`Board is full (max ${ECON.boardMax}).`);
      autoPlace(S.run, rec, false);
    }
    render();
  }

  // ---------------- Flow ----------------
  function startNewRun(customSeed) {
    cancelFightLoop();
    const parsed = parseInt(customSeed, 10);
    S.seed = Number.isFinite(parsed) && parsed > 0 ? parsed : (Math.floor(Math.random() * 900000) + 100000);
    S.run = newRun(S.seed);
    S.starters = starterOffers();
    S.selectedStashIdx = -1;
    S.selectedDeployUid = null;
    S.modal = null;
    S.choiceSub = null;
    S.lastRes = null;
    S.screen = 'starter';
    render();
  }

  function pickStarter(id) {
    addHero(S.run, id, { spent: 0 });
    S.run.starter = id;
    enterShop(S.run);
    S.screen = 'shop';
    toast(`${HEROES[id].name} joins your party! Visit the shop before Fight 1.`);
    render();
  }

  function goToDeploy() {
    if (!onBoard(S.run).length) return toast('Place at least 1 hero on the board!');
    // Re-validate positions against this fight's terrain
    for (const r of onBoard(S.run)) {
      if (!cellOpenForHero(S.run, r.pos.x, r.pos.y)) {
        r.pos = null;
        autoPlace(S.run, r, false);
      }
    }
    S.selectedDeployUid = onBoard(S.run)[0] ? onBoard(S.run)[0].uid : null;
    S.inspectTarget = onBoard(S.run)[0] ? { kind: 'rec', data: onBoard(S.run)[0] } : null;
    S.screen = 'deploy';
    render();
    drawDeployCanvas();
  }

  function launchFight() {
    if (!onBoard(S.run).length) return toast('Place at least 1 hero on the board!');
    S.fight = startRunFight(S.run, { headless: false });
    S.visUnits.clear();
    for (const u of S.fight.units) {
      S.visUnits.set(u.fid, { x: u.x, y: u.y, lx: 0, ly: 0, flash: 0 });
    }
    S.visFx = [];
    S.floaters = [];
    S.evCursor = 0;
    S.fxCursor = 0;
    S.paused = false;
    S.tickAcc = 0;
    S.lastFrame = performance.now();
    S.inspectTarget = { kind: 'unit', data: S.fight.units.find(u => u.side === 'H') || S.fight.units[0] };
    S.screen = 'fight';
    render();
    S.rafId = requestAnimationFrame(fightLoop);
  }

  function cancelFightLoop() {
    if (S.rafId) { cancelAnimationFrame(S.rafId); S.rafId = 0; }
  }

  function finishLiveFight() {
    cancelFightLoop();
    const F = S.fight;
    const res = finishFight(S.run, F);
    S.lastRes = res;
    S.modal = { kind: 'autopsy', res };
    render();
    drawFightCanvas(0);
  }

  function proceedAfterAutopsy() {
    S.modal = null;
    const phase = S.run.phase;
    if (phase === 'rousing') {
      S.screen = 'victory';
    } else if (phase === 'defeat') {
      S.screen = 'defeat';
    } else if (phase === 'shop-retry') {
      enterShop(S.run);
      S.screen = 'shop';
      toast('Piggy Bank broke! Retry the fight after shopping.');
    } else if (phase === 'campfire') {
      S.screen = 'campfire';
    } else if (phase === 'choice') {
      S.choices = drawChoices(S.run);
      S.choiceSub = null;
      S.screen = 'choice';
    } else {
      enterShop(S.run);
      S.screen = 'shop';
    }
    render();
  }

  function openPathPicker(rec, onDone) {
    S.modal = { kind: 'path', rec, onDone };
    render();
  }

  // ---------------- Live Stats Helper ----------------
  function previewStats(rec) {
    const u = makeHeroUnit(rec);
    return {
      hp: u.maxHp,
      ac: u.ac,
      sr: u.sr,
      eva: u.eva,
      pierce: u.pierce,
      stats: u.stats,
      iv: atkIv(u),
      atkDice: `${(u.atk.n || 1) + (RULES.attackGrowth ? RULES.attackGrowth.extraDicePerTier * (u.tier - 1) : 0)}d${upDie(u.atk.x, u.dieUp)}`,
      flat: (u.atk.stat ? (u.atk.half ? Math.floor(u.m(u.atk.stat) / 2) : u.m(u.atk.stat)) : 0) + (u.atk.flat || 0) + (u.flat || 0),
      type: u.atk.type || 'phys',
      range: u.range,
      sc: Math.min(u.maxCharge, (u.sc || 0) + Math.min(RULES.charge.chaStartChargeMax, Math.max(0, RULES.charge.chaStartChargePerModifier * u.m('CHA')))),
      maxCharge: u.maxCharge,
      cr: u.cr,
      regen: u.regen,
    };
  }

  // ---------------- Hero Card HTML ----------------
  function heroCardHTML(id, opts = {}) {
    const def = HEROES[id];
    const card = HERO_CARDS[id] || {};
    const rec = opts.rec || { uid: 0, id, tier: 1, items: [], t2: null, mc: null, train: {} };
    const st = previewStats(rec);
    const clsColor = CLASS_COLORS[def.cls] || '#555';
    const hd = HIT_DIE[def.cls] || 8;
    const scoresHtml = STATS.map(k => {
      const val = st.stats[k];
      const m = mod(val);
      const isKey = k === def.key;
      const body = `${STAT_NAME[k]} ${val} (Modifier ${fmtMod(m)}). ${isKey ? 'Key stat for this hero’s d20 ability rolls. ' : ''}${STAT_ROLE[k]} Half-point modifiers round up or down at random.`;
      return `<span class="${isKey ? 'key' : ''}" ${tipAttr(`${STAT_NAME[k]} (${k})`, body)}>${k}<b>${val}</b>(${fmtMod(m)})</span>`;
    }).join('');
    const pathObj = rec.tier >= 2 && rec.t2 != null && card.paths && card.paths[rec.t2] ? card.paths[rec.t2] : null;
    const pathInfo = pathObj
      ? `<div class="hc-path-tag" ${tipAttr(`Path: ${pathObj.name}`, pathObj.text)}>Path: ${esc(pathObj.name)}</div>` : '';
    const mcDesc = rec.mc ? (MULTICLASS_INFO[rec.mc] || '') : '';
    const mcBox = rec.mc
      ? `<div class="mc-box"><b>✦ Multiclass — ${esc(rec.mc)}:</b> ${annotateKw(mcDesc)}</div>` : '';
    const evaChip = st.eva > 0
      ? ` · <span class="kw" data-tip-kw="Evasion">${Math.round(st.eva * 100)}% Eva</span>` : '';
    const hpTip = tipAttr(`Health: ${st.hp} HP`, `Base ${BASE_HP} + ${RULES.hp.hitDiceAtTier * rec.tier}d${hd} class Hit Dice + CON modifier (${fmtMod(mod(st.stats.CON))}) × ${RULES.hp.hitDiceAtTier * rec.tier}${rec.items.length ? ' + item HP' : ''}.`);
    const acTip = tipAttr(`Armor Class: ${st.ac} (${resistPct(st.ac)}%)`, `Reduces incoming physical damage by ${resistPct(st.ac)}% using AC / (AC + ${RESIST_K}). Radiant damage ignores AC.`);
    const srTip = tipAttr(`Spell Resistance: ${st.sr} (${resistPct(st.sr)}%)`, `Reduces incoming magic damage and enemy control durations by ${resistPct(st.sr)}% using SR / (SR + ${RESIST_K}). Radiant damage ignores SR.`);
    const atkName = (def.atk && def.atk.name) || 'Basic Attack';
    const atkTip = tipAttr(`${atkName} (${st.type})`, `Deals ${st.atkDice}${st.flat ? fmtMod(st.flat) : ''} ${st.type} damage every ${st.iv.toFixed(2)}s. Gains +1 weapon die per tier.`);
    const chgTip = tipAttr(`Ability Charge: ${st.maxCharge}`, `Starts fight with ${st.sc} charge (${def.job === 'hit' ? 'gains charge when hit' : def.job === 'attack' ? 'gains charge on basic attacks' : 'gains charge over time, faster with INT'}). Casts roll d20 + ${def.key} mod.`);
    const rngTip = tipAttr(`Attack Range: ${st.range}`, `Can target enemies up to ${st.range} square${st.range > 1 ? 's' : ''} away${st.range > 1 ? ' (requires line of sight)' : ' (melee)'}.`);

    return `
      <div class="hc-top">
        <div class="portrait">
          <img src="${portraitSrc(id)}" alt="${esc(def.name)}" />
          <span class="tier-pip">T${rec.tier}</span>
        </div>
        <div class="hc-title">
          <div class="hc-name">${esc(def.name)}</div>
          <div class="hc-meta">
            <span class="cls-tag" style="background:${clsColor}">${esc(def.cls)}</span>
            <span class="job-tag">${esc(def.cfg.benchJob || '')}</span>
            <span ${rngTip}>Range ${st.range}</span>${evaChip}
          </div>
        </div>
      </div>
      <div class="hc-stats">
        <div class="stat-cell" ${hpTip}><b>${st.hp}</b><span>HP</span></div>
        <div class="stat-cell" ${acTip}><b>${st.ac}</b><span>AC (${resistPct(st.ac)}%)</span></div>
        <div class="stat-cell" ${srTip}><b>${st.sr}</b><span>SR (${resistPct(st.sr)}%)</span></div>
        <div class="stat-cell" ${atkTip}><b>${st.atkDice}${st.flat ? fmtMod(st.flat) : ''}</b><span>${st.iv.toFixed(2)}s</span></div>
      </div>
      <div class="hc-scores">${scoresHtml}</div>
      <div class="hc-box"><b ${chgTip}>${esc(card.abilityName || 'Ability')} (${st.maxCharge} chg):</b> ${annotateKw(card.ability || '')}</div>
      <div class="hc-feat">${annotateKw(card.feature || '')}</div>
      ${pathInfo ? `<div class="row">${pathInfo}</div>` : ''}
      ${mcBox}
    `;
  }

  // ---------------- Render Screens ----------------
  function render() {
    if (tipEl) tipEl.hidden = true;
    const app = $('#app');
    app.innerHTML = '';

    if (S.screen === 'title') { renderTitle(app); return; }

    app.appendChild(renderTopbar());

    if (S.screen === 'starter') renderStarter(app);
    else if (S.screen === 'shop') renderShop(app);
    else if (S.screen === 'deploy' || S.screen === 'fight') renderBattleScreen(app);
    else if (S.screen === 'choice') renderChoiceScreen(app);
    else if (S.screen === 'campfire') renderCampfireScreen(app);
    else if (S.screen === 'victory' || S.screen === 'defeat') renderEndScreen(app);

    if (S.modal) renderModal(app);
  }

  function renderTitle(app) {
    const wrap = el('div', 'title-screen');
    const paradeIds = Object.keys(HEROES);
    wrap.innerHTML = `
      <div class="title-sub">Version 0.25 · Act 1 Playable Prototype · Lost Mine of Phandelver</div>
      <h1 class="title-h1">Basements <span class="amp">&amp;</span> Basilisks</h1>
      <p class="title-summary">
        Draft from 22 reworked D&amp;D heroes, build around 31 three-tier stat items, counter-position on 6&times;8 Phandelver battlefields, and clear Nezznar the Black Spider.
      </p>
      <div class="parade">
        ${paradeIds.map(id => `<div class="parade-chip" title="${esc(HEROES[id].name)} (${esc(HEROES[id].cls)})"><img src="${portraitSrc(id)}" alt="${esc(HEROES[id].name)}" /></div>`).join('')}
      </div>
      <div class="title-actions">
        <button class="btn primary lg" id="btnNewRun">Start New Act 1 Run</button>
        <input class="seed-input" id="seedInput" placeholder="Seed (optional)" value="" />
        <button class="btn lg" id="btnRules">v0.25 Rules</button>
      </div>
    `;
    app.appendChild(wrap);
    $('#btnNewRun', wrap).onclick = () => startNewRun($('#seedInput', wrap).value);
    $('#btnRules', wrap).onclick = () => { S.modal = { kind: 'rules' }; render(); };
  }

  function renderTopbar() {
    const run = S.run;
    const bar = el('header', 'topbar');
    const fightNum = Math.min(6, run.fight + 1);
    const enc = encOf(run);
    const interest = Math.floor(Math.min(run.gold, ECON.interestCap) / ECON.interestPer);
    const piggyCls = run.piggy.broken ? 'pill broken' : 'pill piggy';
    const piggyTxt = run.piggy.broken ? 'Piggy Broken' : `Piggy: ${run.piggy.amt}g (Free Loss)`;
    const goldTip = tipAttr(`Gold & Interest (+${interest}g)`, `After winning a fight, earn +1g interest for every ${ECON.interestPer}g you hold (counts up to ${ECON.interestCap}g for max +${ECON.interestCap / ECON.interestPer}g).`);
    const piggyTip = tipAttr('Piggy Bank (Safety Net)', run.piggy.broken ? 'Already broken! Your next defeat ends the run (can be mended at the Campfire).' : `Grows by +${ECON.piggyPerWin}g each win. On your first defeat, it breaks, pays out ${run.piggy.amt}g, and lets you shop and retry the fight.`);

    bar.innerHTML = `
      <div class="top-brand">
        <h2>Basements &amp; Basilisks</h2>
        <span class="ver">v0.25 · Seed #${S.seed}</span>
      </div>
      <div class="top-pills">
        <span class="pill">Fight ${fightNum}/6: ${esc(enc ? enc.name : 'Complete')}</span>
        <span class="pill gold" ${goldTip}>Gold: ${run.gold}g (+${interest}g int)</span>
        <span class="${piggyCls}" ${piggyTip}>${piggyTxt}</span>
        ${run.bargainElite ? '<span class="pill elite">Bargain: +1 Elite (2x Gold)</span>' : ''}
        <button class="btn sm" id="btnTopRules">Rules</button>
        <button class="btn sm" id="btnTopRestart">New Run</button>
      </div>
    `;
    $('#btnTopRules', bar).onclick = () => { S.modal = { kind: 'rules' }; render(); };
    $('#btnTopRestart', bar).onclick = () => { cancelFightLoop(); S.screen = 'title'; S.modal = null; render(); };
    return bar;
  }

  function renderStarter(app) {
    const wrap = el('section', 'starter-wrap');
    wrap.innerHTML = `
      <h2 class="serif" style="font-size:26px;color:#f7ebd2;">Choose Your Starting Hero</h2>
      <p class="muted" style="color:var(--ink-muted);margin:6px 0 0;">Joins for free. You start with ${ECON.start}g and visit Camp Shop #1 before Goblin Ambush.</p>
      <div class="starter-grid" id="starterGrid"></div>
    `;
    const grid = $('#starterGrid', wrap);
    for (const id of S.starters) {
      const card = el('div', 'hero-card');
      card.innerHTML = heroCardHTML(id) + `<button class="btn primary mt-8" data-pick="${id}">Choose ${esc(HEROES[id].name)}</button>`;
      $('[data-pick]', card).onclick = () => pickStarter(id);
      grid.appendChild(card);
    }
    app.appendChild(wrap);
  }

  function renderShop(app) {
    const run = S.run;
    const enc = encOf(run);
    const scout = el('div', 'scout-box');
    const enemyCounts = {};
    for (const e of enc.enemies) enemyCounts[e.id] = (enemyCounts[e.id] || 0) + 1;
    const terrTypes = [...new Set((enc.terrain || []).map(t => t[0]))];
    scout.innerHTML = `
      <div>
        <div class="small" style="color:var(--brass-hi);font-weight:700;text-transform:uppercase;letter-spacing:.08em;">
          Upcoming Encounter — Fight ${run.fight + 1}/6${run.fight === 5 ? ' (ACT 1 BOSS)' : ''}
        </div>
        <div class="serif" style="font-size:19px;color:#fff2d6;">${esc(enc.name)}</div>
        <div class="scout-enemies">
          ${Object.entries(enemyCounts).map(([eid, c]) => `<span class="enemy-pill ${ENEMIES[eid].rank === 'Boss' ? 'boss' : ''}">${c > 1 ? c + 'x ' : ''}${esc(ENEMIES[eid].name)}</span>`).join('')}
          ${terrTypes.map(t => `<span class="pill" style="font-size:11.5px;padding:2px 7px;">Terrain: ${esc(TERRAIN_INFO[t] ? TERRAIN_INFO[t].name : t)}</span>`).join('')}
        </div>
      </div>
      <div class="row">
        <button class="btn primary lg" id="btnDeployFight">Deploy &amp; Fight &rarr;</button>
      </div>
    `;
    $('#btnDeployFight', scout).onclick = goToDeploy;
    app.appendChild(scout);

    const grid = el('div', 'shop-grid');

    // Left column: Shop offers
    const left = el('div', 'vellum-panel');
    left.innerHTML = `
      <div class="sec-head">
        <span class="sec-label">Tavern Recruits (Hero Offers)</span>
        <div class="row">
          <button class="btn vellum-btn sm" id="btnReroll" ${run.gold < run.rerollCost ? 'disabled' : ''}>Reroll Shop (${run.rerollCost}g)</button>
        </div>
      </div>
      <div class="offer-row" id="heroOffers"></div>
      <div class="sec-head mt-12">
        <span class="sec-label">Quartermaster Wares (3-Tier Items)</span>
        <span class="small muted">Uncommon 8g · Rare 15g · Epic 24g</span>
      </div>
      <div class="offer-row" id="itemOffers"></div>
    `;
    $('#btnReroll', left).onclick = () => {
      if (reroll(run)) render();
      else toast('Not enough gold to reroll.');
    };

    const hRow = $('#heroOffers', left);
    for (const o of run.offers.heroes) {
      const def = HEROES[o.id];
      const price = offerPrice(run, o);
      const owned = run.roster.find(r => r.id === o.id);
      const isRankUp = owned && owned.tier < 2;
      const canBuy = !o.sold && run.gold >= price && canBuyHero(run, o.id);
      const c = el('div', `hero-card${o.sold ? ' sold' : ''}${isRankUp ? ' rankup' : ''}`);
      c.innerHTML = `
        ${isRankUp ? '<div class="rankup-banner">&uarr; Rank Up to Tier 2!</div>' : ''}
        ${heroCardHTML(o.id, { compact: true })}
        <div class="row between mt-8">
          <button class="btn vellum-btn sm" data-inspect>Inspect</button>
          <button class="btn ${isRankUp ? 'emerald' : 'primary'} sm" data-buy ${canBuy ? '' : 'disabled'}>
            ${o.sold ? 'Sold' : `Buy ${price}g`}${o.sale && !o.sold ? ' <span class="sale-badge">-25%</span>' : ''}
          </button>
        </div>
      `;
      $('[data-inspect]', c).onclick = () => { S.modal = { kind: 'hero', id: o.id }; render(); };
      $('[data-buy]', c).onclick = () => {
        const res = buyOffer(run, o);
        if (!res.ok) return toast(res.why);
        if (res.rankUp) {
          openPathPicker(res.rankUp, () => render());
        } else {
          toast(`Recruited ${def.name}!`);
          render();
        }
      };
      hRow.appendChild(c);
    }

    const iRow = $('#itemOffers', left);
    for (const o of run.offers.items) {
      const it = ITEMS[o.id];
      const price = offerPrice(run, o);
      const canBuy = !o.sold && run.gold >= price;
      const c = el('div', `item-card${o.sold ? ' sold' : ''}`);
      c.innerHTML = `
        <div>
          <div class="row between">
            <span class="rar-pill rar-${esc(it.rar)}">${esc(it.rar)}</span>
            ${o.sale && !o.sold ? '<span class="sale-badge">SALE -25%</span>' : ''}
          </div>
          <div class="serif mt-8" style="font-size:15px;font-weight:700;">${esc(it.name)}</div>
          <div class="small muted mt-8">${annotateKw(it.text)}</div>
        </div>
        <button class="btn primary sm mt-8" data-buy ${canBuy ? '' : 'disabled'}>${o.sold ? 'Sold' : `Buy ${price}g`}</button>
      `;
      $('[data-buy]', c).onclick = () => {
        const res = buyOffer(run, o);
        if (!res.ok) return toast(res.why);
        S.selectedStashIdx = run.stash.length - 1;
        toast(`Bought ${it.name} — click a hero on the right to equip!`);
        render();
      };
      iRow.appendChild(c);
    }

    // Right column: Stash & Party
    const right = el('div', 'vellum-panel');
    right.innerHTML = `
      <div class="sec-head">
        <span class="sec-label">Item Stash (${run.stash.length})</span>
        <span class="small muted">${S.selectedStashIdx >= 0 ? 'Click a hero below to equip!' : 'Click item to equip'}</span>
      </div>
      <div class="stash-list" id="stashList"></div>
      <div class="sec-head mt-12">
        <span class="sec-label">Your Party — Board ${onBoard(run).length}/${ECON.boardMax} · Bench ${onBench(run).length}/${ECON.benchMax}</span>
      </div>
      <div class="party-grid" id="partyGrid"></div>
    `;

    const stashList = $('#stashList', right);
    if (!run.stash.length) {
      stashList.innerHTML = '<span class="small muted">No items in stash. Buy wares on the left.</span>';
    } else {
      run.stash.forEach((ir, idx) => {
        const it = ITEMS[ir.id];
        const chip = el('div', `stash-chip${S.selectedStashIdx === idx ? ' selected' : ''}`);
        chip.setAttribute('data-tip-title', `${it.name} (${it.rar})`);
        chip.setAttribute('data-tip-body', `${it.text} Click to select, then click a hero to equip.`);
        chip.innerHTML = `<span class="rar-pill rar-${esc(it.rar)}">${esc(it.rar[0])}</span> <span>${esc(it.name)}</span> <button class="btn sm vellum-btn" style="padding:1px 5px;" data-sell ${tipAttr('Sell Item', `Sell for +${Math.max(1, Math.floor((ir.paid || it.price) * ECON.sellBack))}g (66% refund).`)}>&times;</button>`;
        chip.onclick = e => {
          if (e.target.closest('[data-sell]')) return;
          S.selectedStashIdx = S.selectedStashIdx === idx ? -1 : idx;
          render();
        };
        $('[data-sell]', chip).onclick = () => sellStashItem(idx);
        stashList.appendChild(chip);
      });
    }

    const pGrid = $('#partyGrid', right);
    const orderedRoster = [...onBoard(run), ...onBench(run)];
    for (const rec of orderedRoster) {
      const def = HEROES[rec.id];
      const st = previewStats(rec);
      const card = HERO_CARDS[rec.id] || {};
      const canEquipHere = S.selectedStashIdx >= 0 && rec.items.length < ECON.slots;
      const rc = el('div', `roster-card${rec.pos ? '' : ' bench'}${canEquipHere ? ' equip-target' : ''}`);
      const pathObj = rec.tier >= 2 && rec.t2 != null && card.paths ? card.paths[rec.t2] : null;

      rc.innerHTML = `
        <div class="hc-top">
          <div class="portrait sm">
            <img src="${portraitSrc(rec.id)}" alt="${esc(def.name)}" />
            <span class="tier-pip">T${rec.tier}</span>
          </div>
          <div class="hc-title">
            <div class="hc-name" style="font-size:14.5px;">${esc(def.name)}</div>
            <div class="small muted">${rec.pos ? `Board (${rec.pos.x + 1},${rec.pos.y + 1})` : 'Bench'} · ${st.hp} HP · AC ${st.ac} · SR ${st.sr}</div>
            ${pathObj ? `<div class="hc-path-tag" ${tipAttr(`Path: ${pathObj.name}`, pathObj.text)}>${esc(pathObj.name)}</div>` : ''}
            ${rec.mc ? `<div class="hc-path-tag" style="background:rgba(44,98,156,0.14);color:#1d4e85;" ${tipAttr(`Multiclass: ${rec.mc}`, MULTICLASS_INFO[rec.mc] || '')}>✦ ${esc(rec.mc)}</div>` : ''}
          </div>
        </div>
        <div class="item-slots" id="slots_${rec.uid}"></div>
        <div class="row between">
          <button class="btn vellum-btn sm" data-insp>Card</button>
          <div class="row" style="gap:4px;">
            <button class="btn vellum-btn sm" data-move>${rec.pos ? 'Bench' : 'Board'}</button>
            <button class="btn vellum-btn sm" data-sell ${tipAttr('Sell Hero', `Sell ${def.name} for +${Math.max(1, Math.floor((rec.spent || heroCost(rec.tier)) * ECON.sellBack))}g (equipped items return to stash).`)}>Sell</button>
          </div>
        </div>
      `;

      const slotsEl = $(`#slots_${rec.uid}`, rc);
      for (let i = 0; i < ECON.slots; i++) {
        const ir = rec.items[i];
        if (ir) {
          const it = ITEMS[ir.id];
          const sc = el('button', 'slot-chip', `${esc(it.name)} &times;`);
          sc.setAttribute('data-tip-title', `${it.name} (${it.rar})`);
          sc.setAttribute('data-tip-body', `${it.text} Click to unequip back to stash.`);
          sc.onclick = e => { e.stopPropagation(); unequipItem(rec, i); };
          slotsEl.appendChild(sc);
        } else {
          slotsEl.appendChild(el('span', 'slot-chip empty', 'Empty slot'));
        }
      }

      if (canEquipHere) {
        rc.onclick = e => {
          if (e.target.closest('button')) return;
          const ir = run.stash[S.selectedStashIdx];
          if (ir && equip(run, ir, rec)) {
            toast(`Equipped ${ITEMS[ir.id].name} on ${def.name}`);
            S.selectedStashIdx = -1;
            render();
          }
        };
      }
      $('[data-insp]', rc).onclick = () => { S.modal = { kind: 'hero', id: rec.id, rec }; render(); };
      $('[data-move]', rc).onclick = () => toggleBoardBench(rec);
      $('[data-sell]', rc).onclick = () => sellHeroRec(rec);
      pGrid.appendChild(rc);
    }

    grid.appendChild(left);
    grid.appendChild(right);
    app.appendChild(grid);
  }

  // ---------------- Deployment & Live Battle Screen ----------------
  function renderBattleScreen(app) {
    const isFight = S.screen === 'fight';
    const enc = (isFight && S.fight) ? S.fight.enc : encOf(S.run);
    const layout = el('div', 'battle-layout');

    const left = el('div', 'canvas-shell');
    const bar = el('div', 'battle-bar');
    if (!isFight) {
      bar.innerHTML = `
        <div>
          <div class="serif" style="font-size:18px;color:#f7ebd2;">Deploy Party — ${esc(enc.name)}</div>
          <div class="small" style="color:var(--ink-muted);">Click or drag heroes across columns 1–4. Click any enemy to scout its stats.</div>
        </div>
        <div class="row">
          <button class="btn" id="btnBackShop">&larr; Back to Shop</button>
          <button class="btn primary lg" id="btnStartFight">Start Fight!</button>
        </div>
      `;
      $('#btnBackShop', bar).onclick = () => { S.screen = 'shop'; render(); };
      $('#btnStartFight', bar).onclick = launchFight;
    } else {
      bar.innerHTML = `
        <div>
          <div class="serif" style="font-size:18px;color:#f7ebd2;">${esc(enc.name)} <span id="fightClock" class="small" style="color:var(--brass-hi);margin-left:8px;">${S.fight ? S.fight.t.toFixed(1) : '0.0'}s</span></div>
          <div class="small" style="color:var(--ink-muted);">Click any hero or enemy on the board to inspect live stats.</div>
        </div>
        <div class="row">
          <div class="speed-group">
            <button class="btn sm ${S.paused ? 'active' : ''}" id="btnPause">${S.paused ? 'Resume' : 'Pause'}</button>
            <button class="btn sm ${!S.paused && S.speed === 1 ? 'active' : ''}" data-spd="1">1&times;</button>
            <button class="btn sm ${!S.paused && S.speed === 2 ? 'active' : ''}" data-spd="2">2&times;</button>
            <button class="btn sm ${!S.paused && S.speed === 4 ? 'active' : ''}" data-spd="4">4&times;</button>
          </div>
          <button class="btn sm" id="btnSkip">Skip</button>
        </div>
      `;
      $('#btnPause', bar).onclick = () => { S.paused = !S.paused; render(); if (!S.paused && S.fight && !S.fight.over) drawFightCanvas(0); };
      bar.querySelectorAll('[data-spd]').forEach(b => {
        b.onclick = () => { S.paused = false; S.speed = Number(b.dataset.spd); render(); };
      });
      $('#btnSkip', bar).onclick = () => {
        if (!S.fight || S.fight.over) return;
        while (!S.fight.over) stepFight(S.fight);
        finishLiveFight();
      };
    }

    const canvas = el('canvas');
    canvas.id = 'battleCanvas';
    canvas.width = 880;
    canvas.height = 540;
    left.appendChild(bar);
    left.appendChild(canvas);

    if (isFight) {
      const logHead = el('div', 'sec-head mt-8', '<span class="sec-label" style="color:var(--brass-hi);">Combat Log</span>');
      const logBox = el('div', 'combat-log');
      logBox.id = 'combatLog';
      left.appendChild(logHead);
      left.appendChild(logBox);
    }

    // Right column: Inspector
    const right = el('aside', 'dark-panel');
    right.id = 'inspectorPane';
    right.innerHTML = renderInspectorHTML();

    layout.appendChild(left);
    layout.appendChild(right);
    app.appendChild(layout);

    bindCanvasEvents(canvas);
    if (!isFight) drawDeployCanvas();
    else { drawFightCanvas(0); syncCombatLog(); }
  }

  function renderInspectorHTML() {
    const it = S.inspectTarget;
    if (!it || !it.data) {
      return '<div class="sec-label">Unit Inspector</div><p class="small muted mt-8">Click any hero or enemy on the battlefield to inspect their stats, abilities, and live combat output.</p>';
    }
    if (it.kind === 'rec') {
      return `<div class="sec-label" style="margin-bottom:8px;">Hero Details</div><div class="hero-card">${heroCardHTML(it.data.id, { rec: it.data })}</div>`;
    }
    if (it.kind === 'enemy') {
      const e = ENEMIES[it.data.id];
      const sc = RULES.enemyScale || { damage: 1, attackSpeed: 0, hp: 1 };
      const hp = Math.round(e.hp * (sc.hp || 1));
      const iv = (e.atk.iv / (1 + (sc.attackSpeed || 0))).toFixed(2);
      return `
        <div class="sec-label" style="margin-bottom:8px;">Enemy Scout</div>
        <div class="hero-card">
          <div class="hc-name">${esc(e.name)}</div>
          <div class="hc-meta"><span class="cls-tag" style="background:${e.rank === 'Boss' ? '#9c6818' : '#8c2d24'}">${esc(e.rank)}</span><span>Range ${e.range || 1}</span></div>
          <div class="hc-stats">
            <div class="stat-cell"><b>${hp}</b><span>HP</span></div>
            <div class="stat-cell" ${tipAttr(`Armor Class: ${e.ac} (${resistPct(e.ac)}%)`, `Reduces incoming physical damage by ${resistPct(e.ac)}%. Radiant ignores AC.`)}><b>${e.ac}</b><span>AC (${resistPct(e.ac)}%)</span></div>
            <div class="stat-cell" ${tipAttr(`Spell Resistance: ${e.sr} (${resistPct(e.sr)}%)`, `Reduces incoming magic damage and control duration by ${resistPct(e.sr)}%. Radiant ignores SR.`)}><b>${e.sr}</b><span>SR (${resistPct(e.sr)}%)</span></div>
            <div class="stat-cell"><b>${e.atk.n}d${e.atk.x}${e.atk.flat ? '+' + e.atk.flat : ''}</b><span>${iv}s</span></div>
          </div>
          <div class="hc-box">${annotateKw(ENEMY_NOTES[it.data.id] || '')}</div>
          ${e.ab ? `<div class="hc-feat"><b>Ability:</b> ${esc(e.ab.name || 'Special')} (every ${e.ab.iv || '?'}s)</div>` : ''}
        </div>
      `;
    }
    if (it.kind === 'unit') {
      const u = it.data;
      const isHero = u.side === 'H';
      const stList = [];
      if (u.st.marked) stList.push("Hunter's Mark");
      if (u.st.hexed) stList.push('Hex');
      if (u.st.burnT > 0) stList.push(`Burn ${u.st.burn}`);
      if (u.st.poison > 0) stList.push(`Poison ${u.st.poison}`);
      if (u.st.stun > 0) stList.push(`Stun ${u.st.stun.toFixed(1)}s`);
      if (u.st.root > 0) stList.push(`Restrained ${u.st.root.toFixed(1)}s`);
      if (u.st.slowT > 0) stList.push(`Slow ${Math.round(u.st.slow * 100)}%`);
      if (u.st.bond > 0) stList.push('Bonded');
      if (u.rage2 > 0) stList.push(`Rage ${u.rage2}`);
      if (u.ki > 0) stList.push(`Ki ${u.ki}`);
      if (u.sp > 0) stList.push(`SP ${u.sp}`);
      if (u.formHp > 0) stList.push(`Wild Shape ${Math.ceil(u.formHp)}`);

      return `
        <div class="sec-label" style="margin-bottom:8px;">Live Combatant</div>
        <div class="hero-card">
          <div class="hc-top">
            ${isHero ? `<div class="portrait sm"><img src="${portraitSrc(u.id)}" alt="" /><span class="tier-pip">T${u.tier}</span></div>` : ''}
            <div class="hc-title">
              <div class="hc-name">${esc(u.name)}</div>
              <div class="small muted">${u.alive ? 'Alive' : 'Fallen'}${u.ward > 0 ? ` · Ward ${Math.ceil(u.ward)}` : ''}${u.formHp > 0 ? ` · Form ${Math.ceil(u.formHp)}` : ''}</div>
            </div>
          </div>
          <div class="hc-stats">
            <div class="stat-cell"><b>${Math.max(0, Math.ceil(u.hp))}/${u.maxHp}</b><span>HP</span></div>
            <div class="stat-cell" ${tipAttr(`Armor Class: ${u.ac} (${resistPct(u.ac)}%)`, `Reduces incoming physical damage by ${resistPct(u.ac)}%.`)}><b>${u.ac}</b><span>AC (${resistPct(u.ac)}%)</span></div>
            <div class="stat-cell" ${tipAttr(`Spell Resistance: ${u.sr} (${resistPct(u.sr)}%)`, `Reduces incoming magic damage and control duration by ${resistPct(u.sr)}%.`)}><b>${u.sr}</b><span>SR (${resistPct(u.sr)}%)</span></div>
            <div class="stat-cell"><b>${Math.floor(u.charge)}/${u.maxCharge}</b><span>Charge</span></div>
          </div>
          <div class="hc-box">
            <b>Damage:</b> ${Math.round(u.stat.dmg)} (Ab: ${Math.round(u.stat.abDmg)})<br/>
            <b>Healing:</b> ${Math.round(u.stat.heal)} · <b>Ward:</b> ${Math.round(u.stat.ward)}<br/>
            <b>Taken:</b> ${Math.round(u.stat.taken)}
          </div>
          ${stList.length ? `<div class="hc-feat">${stList.map(s => annotateKw(s)).join(' · ')}</div>` : ''}
          ${isHero && HERO_CARDS[u.id] ? `<div class="small muted">${annotateKw(HERO_CARDS[u.id].ability)}</div>` : ''}
        </div>
      `;
    }
    return '';
  }

  function refreshInspector() {
    const pane = $('#inspectorPane');
    if (pane) pane.innerHTML = renderInspectorHTML();
  }

  // ---------------- Canvas Geometry & Rendering ----------------
  const PAD_X = 28, PAD_Y = 26;
  function cellMetrics(canvas) {
    const cw = (canvas.width - PAD_X * 2) / COLS;
    const ch = (canvas.height - PAD_Y * 2) / ROWS;
    return { cw, ch, ox: PAD_X, oy: PAD_Y };
  }
  function cellCenter(canvas, gx, gy) {
    const m = cellMetrics(canvas);
    return { cx: m.ox + (gx + 0.5) * m.cw, cy: m.oy + (gy + 0.5) * m.ch };
  }
  function pointerToCell(canvas, e) {
    const rect = canvas.getBoundingClientRect();
    const px = (e.clientX - rect.left) * (canvas.width / rect.width);
    const py = (e.clientY - rect.top) * (canvas.height / rect.height);
    const m = cellMetrics(canvas);
    const gx = Math.floor((px - m.ox) / m.cw);
    const gy = Math.floor((py - m.oy) / m.ch);
    return inb(gx, gy) ? { x: gx, y: gy } : null;
  }

  function bindCanvasEvents(canvas) {
    canvas.onpointerdown = e => {
      const cell = pointerToCell(canvas, e);
      if (!cell) return;
      if (S.screen === 'deploy') {
        const enc = encOf(S.run);
        const heroAt = onBoard(S.run).find(r => r.pos && r.pos.x === cell.x && r.pos.y === cell.y);
        const enemyAt = enc.enemies.find(en => en.x === cell.x && en.y === cell.y);
        if (heroAt) {
          S.selectedDeployUid = heroAt.uid;
          S.draggingUid = heroAt.uid;
          S.inspectTarget = { kind: 'rec', data: heroAt };
          refreshInspector();
          drawDeployCanvas();
        } else if (enemyAt) {
          S.inspectTarget = { kind: 'enemy', data: enemyAt };
          refreshInspector();
          drawDeployCanvas();
        } else if (S.selectedDeployUid && cell.x <= 3 && cellOpenForHero(S.run, cell.x, cell.y)) {
          const rec = onBoard(S.run).find(r => r.uid === S.selectedDeployUid);
          if (rec) {
            rec.pos = { x: cell.x, y: cell.y };
            drawDeployCanvas();
          }
        }
      } else if (S.screen === 'fight' && S.fight) {
        const u = S.fight.units.find(o => o.alive && o.x === cell.x && o.y === cell.y);
        if (u) { S.inspectTarget = { kind: 'unit', data: u }; refreshInspector(); }
      }
    };

    canvas.onpointerup = e => {
      if (S.screen !== 'deploy' || !S.draggingUid) return;
      const cell = pointerToCell(canvas, e);
      const rec = onBoard(S.run).find(r => r.uid === S.draggingUid);
      S.draggingUid = null;
      if (!cell || !rec || cell.x > 3 || !cellOpenForHero(S.run, cell.x, cell.y)) return;
      const other = onBoard(S.run).find(r => r.uid !== rec.uid && r.pos && r.pos.x === cell.x && r.pos.y === cell.y);
      if (other) {
        const old = rec.pos;
        rec.pos = { x: cell.x, y: cell.y };
        other.pos = old;
      } else {
        rec.pos = { x: cell.x, y: cell.y };
      }
      drawDeployCanvas();
    };
  }

  function drawBoardBase(ctx, canvas, enc, fireTiles, deployHighlight) {
    const m = cellMetrics(canvas);
    ctx.fillStyle = '#1b1610';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle board frame
    ctx.strokeStyle = 'rgba(194,142,54,0.4)';
    ctx.lineWidth = 2;
    ctx.strokeRect(m.ox - 2, m.oy - 2, COLS * m.cw + 4, ROWS * m.ch + 4);

    // Build terrain map
    const terr = {};
    for (const [k, tx, ty] of (enc.terrain || [])) terr[`${tx},${ty}`] = k;

    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const px = m.ox + x * m.cw;
        const py = m.oy + y * m.ch;
        const isHeroZone = x <= 3;
        const alt = (x + y) % 2 === 0;
        ctx.fillStyle = isHeroZone
          ? (alt ? '#2c251c' : '#262018')
          : (alt ? '#291e1a' : '#231916');
        ctx.fillRect(px, py, m.cw, m.ch);

        if (deployHighlight && isHeroZone) {
          ctx.fillStyle = 'rgba(194, 142, 54, 0.06)';
          ctx.fillRect(px + 1, py + 1, m.cw - 2, m.ch - 2);
        }

        ctx.strokeStyle = 'rgba(255, 232, 185, 0.08)';
        ctx.lineWidth = 1;
        ctx.strokeRect(px, py, m.cw, m.ch);

        const tk = terr[`${x},${y}`];
        if (tk) drawTerrainTile(ctx, tk, px, py, m.cw, m.ch);

        if (fireTiles && fireTiles[y * COLS + x]) {
          ctx.fillStyle = 'rgba(235, 95, 25, 0.34)';
          ctx.fillRect(px + 3, py + 3, m.cw - 6, m.ch - 6);
          ctx.strokeStyle = 'rgba(255, 175, 65, 0.7)';
          ctx.lineWidth = 2;
          ctx.strokeRect(px + 4, py + 4, m.cw - 8, m.ch - 8);
        }
      }
    }

    // Center dividing line between hero side and enemy side
    ctx.strokeStyle = 'rgba(223, 168, 71, 0.35)';
    ctx.setLineDash([6, 4]);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(m.ox + 4 * m.cw, m.oy);
    ctx.lineTo(m.ox + 4 * m.cw, m.oy + ROWS * m.ch);
    ctx.stroke();
    ctx.setLineDash([]);

    // Column headers
    ctx.fillStyle = 'rgba(239, 229, 209, 0.45)';
    ctx.font = '700 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('HERO DEPLOYMENT (COLS 1-4)', m.ox + 2 * m.cw, m.oy - 8);
    ctx.fillText('ENEMIES (COLS 5-8)', m.ox + 6 * m.cw, m.oy - 8);
  }

  function drawTerrainTile(ctx, kind, px, py, cw, ch) {
    ctx.save();
    if (kind === 'rock' || kind === 'wall' || kind === 'gate') {
      ctx.fillStyle = kind === 'wall' ? '#4a433a' : '#574c40';
      ctx.fillRect(px + 5, py + 5, cw - 10, ch - 10);
      ctx.strokeStyle = '#756859';
      ctx.lineWidth = 2;
      ctx.strokeRect(px + 5, py + 5, cw - 10, ch - 10);
      ctx.fillStyle = '#c8baa4';
      ctx.font = '700 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(kind.toUpperCase(), px + cw / 2, py + ch / 2 + 4);
    } else if (kind === 'chasm') {
      ctx.fillStyle = '#090705';
      ctx.fillRect(px + 2, py + 2, cw - 4, ch - 4);
      ctx.strokeStyle = '#40342a';
      ctx.strokeRect(px + 4, py + 4, cw - 8, ch - 8);
      ctx.fillStyle = '#6e5e4e';
      ctx.font = '700 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('CHASM', px + cw / 2, py + ch / 2 + 4);
    } else if (kind === 'forge') {
      const g = ctx.createRadialGradient(px + cw / 2, py + ch / 2, 6, px + cw / 2, py + ch / 2, cw * 0.45);
      g.addColorStop(0, '#ffae42');
      g.addColorStop(0.5, '#b8421b');
      g.addColorStop(1, '#3b2419');
      ctx.fillStyle = g;
      ctx.fillRect(px + 4, py + 4, cw - 8, ch - 8);
      ctx.fillStyle = '#fff0cc';
      ctx.font = '700 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('FORGE', px + cw / 2, py + ch / 2 + 4);
    } else if (kind === 'web') {
      ctx.strokeStyle = 'rgba(230, 232, 240, 0.42)';
      ctx.lineWidth = 1.2;
      const cx = px + cw / 2, cy = py + ch / 2, r = Math.min(cw, ch) * 0.42;
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3;
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); ctx.stroke();
      }
      ctx.beginPath(); ctx.arc(cx, cy, r * 0.45, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx, cy, r * 0.8, 0, Math.PI * 2); ctx.stroke();
    } else if (kind === 'tower') {
      ctx.fillStyle = 'rgba(85, 130, 175, 0.25)';
      ctx.fillRect(px + 4, py + 4, cw - 8, ch - 8);
      ctx.strokeStyle = '#6da6d8';
      ctx.strokeRect(px + 4, py + 4, cw - 8, ch - 8);
      ctx.fillStyle = '#b9dcfa';
      ctx.font = '700 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('TOWER +1R', px + cw / 2, py + ch / 2 + 4);
    }
    ctx.restore();
  }

  function drawEnemyEmblem(ctx, id, cx, cy, r, rank) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = rank === 'Boss' ? '#3a1728' : rank === 'Elite' ? '#4a1d19' : '#351f1b';
    ctx.fill();
    ctx.strokeStyle = rank === 'Boss' ? '#f2be54' : rank === 'Elite' ? '#e36b44' : '#a8473c';
    ctx.lineWidth = rank === 'Boss' ? 3.5 : 2.5;
    ctx.stroke();

    // Crisp initials / icon emblem
    const icons = {
      goblin: 'G', goblin_archer: '➶', klarg: '⚒', ripper: '🐺',
      redbrand: '⚔', glasstaff: '✦', vine: '🌿', twig: 'T', needle: '↟',
      flameskull: '🔥', lesser_skull: '💀', ghoul: '☠', giant_spider: '🕷', nezznar: '🕷',
    };
    ctx.fillStyle = rank === 'Boss' ? '#ffe599' : '#f7dfd5';
    ctx.font = `700 ${Math.round(r * 0.85)}px Cinzel, Georgia, serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(icons[id] || id[0].toUpperCase(), cx, cy + 1);
    ctx.restore();
  }

  function drawUnitToken(ctx, opts) {
    const { cx, cy, r, side, id, name, tier, hp, maxHp, ward, formHp, charge, maxCharge, selected, unit } = opts;
    ctx.save();
    if (unit && unit.st && unit.st.stealth > 0) ctx.globalAlpha = 0.55;
    if (unit && unit.summon) ctx.globalAlpha = 0.78;

    // Selection halo
    if (selected) {
      ctx.beginPath();
      ctx.arc(cx, cy, r + 5, 0, Math.PI * 2);
      ctx.strokeStyle = '#f5cb69';
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    // Cast glow
    if (unit && unit.casting) {
      ctx.beginPath();
      ctx.arc(cx, cy, r + 4, 0, Math.PI * 2);
      ctx.strokeStyle = '#6ec8ff';
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    if (side === 'H') {
      const img = heroImg(id, unit);
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = '#241c14';
      ctx.fill();
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, r - 1, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(img, cx - r, cy - r, r * 2, r * 2);
        ctx.restore();
      }
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = tier >= 2 ? '#f2c155' : (unit && unit.summon ? '#80c8e8' : '#b89456');
      ctx.lineWidth = tier >= 2 ? 3.5 : 2.5;
      ctx.stroke();
    } else {
      const def = ENEMIES[id] || { rank: 'Regular' };
      drawEnemyEmblem(ctx, id, cx, cy, r, def.rank);
    }

    // Bars below token
    const bw = r * 2.15, bx = cx - bw / 2, by = cy + r + 4;
    ctx.fillStyle = '#0e0b08';
    ctx.fillRect(bx - 1, by - 1, bw + 2, 7);
    const hpFrac = Math.max(0, Math.min(1, hp / Math.max(1, maxHp)));
    ctx.fillStyle = side === 'H' ? '#3cb36d' : '#cc4135';
    ctx.fillRect(bx, by, bw * hpFrac, 5);

    if (ward > 0) {
      const wFrac = Math.min(1, ward / Math.max(1, maxHp));
      ctx.fillStyle = '#4ec7f2';
      ctx.fillRect(bx, by, bw * wFrac, 2.5);
    }
    if (formHp > 0) {
      const fFrac = Math.min(1, formHp / Math.max(1, maxHp));
      ctx.fillStyle = '#9be356';
      ctx.fillRect(bx, by - 3, bw * fFrac, 2.5);
    }

    // Charge bar
    if (maxCharge > 0 && charge !== undefined) {
      ctx.fillStyle = '#14100c';
      ctx.fillRect(bx, by + 6, bw, 3);
      ctx.fillStyle = '#e8ad38';
      ctx.fillRect(bx, by + 6, bw * Math.max(0, Math.min(1, charge / maxCharge)), 3);
    }

    // Name tag above token
    ctx.font = '700 10.5px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#f5ead6';
    const shortName = name.length > 12 ? name.split(' ')[0] : name;
    ctx.fillText(shortName + (tier >= 2 ? ' ★' : ''), cx, cy - r - 4);

    // Status badges (compact top-right pips)
    if (unit && unit.st) {
      const badges = [];
      if (unit.st.marked) badges.push(['M', '#3fb86c']);
      if (unit.st.hexed) badges.push(['H', '#a85cc8']);
      if (unit.st.burnT > 0) badges.push(['🔥', '#e86828']);
      if (unit.st.poison > 0) badges.push([`P${unit.st.poison}`, '#6eb838']);
      if (unit.st.stun > 0) badges.push(['⚡', '#ffd54f']);
      if (unit.st.root > 0) badges.push(['R', '#9e8b6b']);
      if (unit.st.bond > 0) badges.push(['B', '#68c2e8']);
      if (unit.rage2 > 0) badges.push([`R${unit.rage2}`, '#e04838']);
      if (unit.st.dark > 0) badges.push(['🌑', '#555']);
      badges.slice(0, 3).forEach(([txt, col], idx) => {
        const px = cx + r - 2, py = cy - r + 8 + idx * 12;
        ctx.fillStyle = col;
        ctx.fillRect(px - 8, py - 6, 18, 11);
        ctx.fillStyle = '#111';
        ctx.font = '800 9px sans-serif';
        ctx.fillText(txt, px + 1, py + 3);
      });
    }
    ctx.restore();
  }

  function drawDeployCanvas() {
    const canvas = $('#battleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const enc = encOf(S.run);
    drawBoardBase(ctx, canvas, enc, null, true);

    const m = cellMetrics(canvas);
    const r = Math.min(m.cw, m.ch) * 0.34;

    // Range preview for selected hero
    const sel = onBoard(S.run).find(x => x.uid === S.selectedDeployUid);
    if (sel && sel.pos) {
      const def = HEROES[sel.id];
      const rng = def.range;
      ctx.save();
      ctx.fillStyle = 'rgba(92, 184, 130, 0.12)';
      for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
          if (Math.max(Math.abs(x - sel.pos.x), Math.abs(y - sel.pos.y)) <= rng) {
            ctx.fillRect(m.ox + x * m.cw + 2, m.oy + y * m.ch + 2, m.cw - 4, m.ch - 4);
          }
        }
      }
      ctx.restore();
    }

    for (const rec of onBoard(S.run)) {
      if (!rec.pos) continue;
      const st = previewStats(rec);
      const { cx, cy } = cellCenter(canvas, rec.pos.x, rec.pos.y);
      drawUnitToken(ctx, {
        cx, cy, r, side: 'H', id: rec.id, name: HEROES[rec.id].name,
        tier: rec.tier, hp: st.hp, maxHp: st.hp, ward: 0, formHp: 0,
        charge: st.sc, maxCharge: st.maxCharge, selected: rec.uid === S.selectedDeployUid,
      });
    }

    const sc = RULES.enemyScale || { hp: 1 };
    for (const en of enc.enemies) {
      const e = ENEMIES[en.id];
      const hp = Math.round(e.hp * (sc.hp || 1));
      const { cx, cy } = cellCenter(canvas, en.x, en.y);
      drawUnitToken(ctx, {
        cx, cy, r, side: 'E', id: en.id, name: e.name, tier: 1,
        hp, maxHp: hp, ward: 0, formHp: 0, charge: 0, maxCharge: 100, selected: false,
      });
    }
  }

  // ---------------- Live Combat Loop ----------------
  function fightLoop(now) {
    if (S.screen !== 'fight' || !S.fight) return;
    const dtReal = Math.min(0.08, (now - S.lastFrame) / 1000);
    S.lastFrame = now;

    if (!S.paused && !S.fight.over) {
      S.tickAcc += dtReal * S.speed;
      while (S.tickAcc >= DT && !S.fight.over) {
        stepFight(S.fight);
        S.tickAcc -= DT;
        ingestFightEvents();
      }
      if (S.fight.over) {
        finishLiveFight();
        return;
      }
    }

    drawFightCanvas(dtReal);
    const clk = $('#fightClock');
    if (clk) clk.textContent = `${S.fight.t.toFixed(1)}s`;
    refreshInspector();
    S.rafId = requestAnimationFrame(fightLoop);
  }

  function ingestFightEvents() {
    const F = S.fight;
    while (S.evCursor < F.ev.length) {
      const e = F.ev[S.evCursor++];
      if (e.k === 'hit' && e.t) {
        if (e.s) {
          const vs = S.visUnits.get(e.s.fid);
          if (vs) {
            const dx = Math.sign(e.t.x - e.s.x), dy = Math.sign(e.t.y - e.s.y);
            vs.lx = dx * 10; vs.ly = dy * 10;
          }
          if (dist(e.s, e.t) > 1) {
            S.visFx.push({ kind: 'bolt', sx: e.s.x, sy: e.s.y, tx: e.t.x, ty: e.t.y, color: e.s.side === 'H' ? '#f5cb69' : '#e85d48', t: 0, dur: 0.24 });
          }
        }
        S.floaters.push({ x: e.t.x, y: e.t.y, text: `-${Math.round(e.v)}`, color: '#ffebe0', t: 0, dur: 0.85 });
      } else if (e.k === 'heal' && e.t) {
        S.floaters.push({ x: e.t.x, y: e.t.y, text: `+${Math.round(e.v)}`, color: '#6df09b', t: 0, dur: 0.85 });
      } else if (e.k === 'ward' && e.t) {
        S.floaters.push({ x: e.t.x, y: e.t.y, text: `🛡${Math.round(e.v)}`, color: '#6cd8ff', t: 0, dur: 0.85 });
      } else if ((e.k === 'dodge' || e.k === 'evade') && e.t) {
        S.floaters.push({ x: e.t.x, y: e.t.y, text: e.k === 'dodge' ? 'DODGE' : 'EVADE', color: '#c4dcff', t: 0, dur: 0.75 });
      } else if (e.k === 'd20' && e.u) {
        const col = e.nat === 20 ? '#ffe066' : e.nat === 1 ? '#ff6b6b' : '#e0d6c2';
        const lbl = e.nat === 20 ? 'NAT 20!' : e.nat === 1 ? 'FIZZLE!' : `d20:${e.nat}`;
        S.floaters.push({ x: e.u.x, y: e.u.y - 0.35, text: lbl, color: col, t: 0, dur: 1.05, big: e.nat === 20 || e.nat === 1 });
        S.visFx.push({ kind: 'ring', x: e.u.x, y: e.u.y, color: e.u.side === 'H' ? '#f5cb69' : '#e35d44', t: 0, dur: 0.38 });
        F.log.push(`[${(e.t0 || F.t).toFixed(1)}s] ${e.u.name} casts (${lbl}).`);
      }
    }
    while (S.fxCursor < F.fx.length) {
      const f = F.fx[S.fxCursor++];
      S.floaters.push({ x: f.x, y: f.y - 0.2, text: f.text, color: f.color || '#ffe399', t: 0, dur: 1.0, big: f.big });
    }
    syncCombatLog();
  }

  function syncCombatLog() {
    const box = $('#combatLog');
    if (!box || !S.fight) return;
    const lines = S.fight.log.length ? S.fight.log.slice(-40) : [`[0.0s] ${S.fight.enc.name} begins!`];
    if (box.childElementCount !== lines.length || (lines.length === 1 && box.textContent !== lines[0])) {
      box.innerHTML = lines.map(l => `<div>${esc(l)}</div>`).join('');
      box.scrollTop = box.scrollHeight;
    }
  }

  function drawFightCanvas(dtReal) {
    const canvas = $('#battleCanvas');
    if (!canvas || !S.fight) return;
    const ctx = canvas.getContext('2d');
    const F = S.fight;
    drawBoardBase(ctx, canvas, F.enc, F.fireTiles, false);

    const m = cellMetrics(canvas);
    const r = Math.min(m.cw, m.ch) * 0.34;
    const lerpK = Math.min(1, dtReal * 14);

    // Draw units
    for (const u of F.units) {
      if (!u.alive) continue;
      let v = S.visUnits.get(u.fid);
      if (!v) { v = { x: u.x, y: u.y, lx: 0, ly: 0 }; S.visUnits.set(u.fid, v); }
      v.x += (u.x - v.x) * lerpK;
      v.y += (u.y - v.y) * lerpK;
      v.lx *= Math.max(0, 1 - dtReal * 12);
      v.ly *= Math.max(0, 1 - dtReal * 12);

      const { cx, cy } = cellCenter(canvas, v.x, v.y);
      drawUnitToken(ctx, {
        cx: cx + v.lx, cy: cy + v.ly, r, side: u.side, id: u.id, name: u.name,
        tier: u.tier, hp: u.hp, maxHp: u.maxHp, ward: u.ward, formHp: u.formHp || 0,
        charge: u.charge, maxCharge: u.maxCharge,
        selected: S.inspectTarget && S.inspectTarget.kind === 'unit' && S.inspectTarget.data === u,
        unit: u,
      });
    }

    // Visual projectiles & cast rings
    for (let i = S.visFx.length - 1; i >= 0; i--) {
      const fx = S.visFx[i];
      fx.t += dtReal;
      if (fx.t >= fx.dur) { S.visFx.splice(i, 1); continue; }
      const p = fx.t / fx.dur;
      ctx.save();
      if (fx.kind === 'bolt') {
        const a = cellCenter(canvas, fx.sx, fx.sy);
        const b = cellCenter(canvas, fx.tx, fx.ty);
        const bx = a.cx + (b.cx - a.cx) * p;
        const by = a.cy + (b.cy - a.cy) * p;
        ctx.strokeStyle = fx.color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(a.cx + (b.cx - a.cx) * Math.max(0, p - 0.25), a.cy + (b.cy - a.cy) * Math.max(0, p - 0.25));
        ctx.lineTo(bx, by);
        ctx.stroke();
      } else if (fx.kind === 'ring') {
        const c = cellCenter(canvas, fx.x, fx.y);
        ctx.strokeStyle = fx.color;
        ctx.globalAlpha = 1 - p;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(c.cx, c.cy, r * (0.9 + p * 1.1), 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    }

    // Floating numbers
    for (let i = S.floaters.length - 1; i >= 0; i--) {
      const fl = S.floaters[i];
      fl.t += dtReal;
      if (fl.t >= fl.dur) { S.floaters.splice(i, 1); continue; }
      const p = fl.t / fl.dur;
      const c = cellCenter(canvas, fl.x, fl.y);
      ctx.save();
      ctx.globalAlpha = 1 - p * p;
      ctx.font = `800 ${fl.big ? 15 : 12.5}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillStyle = '#000';
      ctx.fillText(fl.text, c.cx + 1, c.cy - r * 0.5 - p * 34 + 1);
      ctx.fillStyle = fl.color;
      ctx.fillText(fl.text, c.cx, c.cy - r * 0.5 - p * 34);
      ctx.restore();
    }
  }

  // ---------------- Choice Cards Screen ----------------
  function renderChoiceScreen(app) {
    const run = S.run;
    const panel = el('section', 'vellum-panel');
    panel.style.maxWidth = '900px';
    panel.style.margin = '12px auto';

    if (S.choiceSub) {
      renderChoiceSubPicker(panel);
      app.appendChild(panel);
      return;
    }

    panel.innerHTML = `
      <h2 class="serif" style="font-size:22px;">Aftermath — Choose a Reward</h2>
      <p class="small muted">Pick one card before visiting the next Camp Shop.</p>
      <div class="choice-grid" id="choiceGrid"></div>
    `;
    const grid = $('#choiceGrid', panel);
    for (const c of S.choices) {
      const meta = CHOICE_META[c.id] || { icon: '★', desc: '' };
      const card = el('button', 'choice-card');
      card.innerHTML = `
        <div>
          <div class="choice-icon">${meta.icon}</div>
          <div class="choice-title mt-8">${esc(c.name)}</div>
          <p class="small muted mt-8">${esc(meta.desc)}</p>
        </div>
        <span class="btn primary sm">Select</span>
      `;
      card.onclick = () => handleChoiceCard(c);
      grid.appendChild(card);
    }
    app.appendChild(panel);
  }

  function handleChoiceCard(c) {
    const run = S.run;
    if (c.id === 'purse') {
      run.gold += ECON.purse;
      toast(`Gained +${ECON.purse} gold!`);
      enterShop(run); S.screen = 'shop'; render();
    } else if (c.id === 'freeitem') {
      const it = pick(ITEM_LIST.filter(i => i.rar === 'Uncommon'));
      run.stash.push({ id: it.id, wins: 0, paid: 0 });
      toast(`Found ${it.name} (${it.text})!`);
      enterShop(run); S.screen = 'shop'; render();
    } else if (c.id === 'bargain_elite') {
      run.bargainElite = true;
      toast('Bargain struck: +1 Elite next fight for DOUBLE gold!');
      enterShop(run); S.screen = 'shop'; render();
    } else if (c.id === 'bargain_more') {
      run.extraCard = true;
      toast('Patience: your next Choice will offer 3 cards.');
      enterShop(run); S.screen = 'shop'; render();
    } else if (c.id === 'training') {
      S.choiceSub = { kind: 'training' }; render();
    } else if (c.id === 'multiclass') {
      const eligible = run.roster.filter(r => !r.mc);
      if (!eligible.length) { toast('All heroes already have a Multiclass! +15g instead.'); run.gold += 15; enterShop(run); S.screen = 'shop'; render(); return; }
      S.choiceSub = { kind: 'multiclass', hero: null }; render();
    } else if (c.id === 'recruit') {
      if (run.roster.length >= ECON.boardMax + ECON.benchMax) { toast('Roster full! +15g instead.'); run.gold += 15; enterShop(run); S.screen = 'shop'; render(); return; }
      S.choiceSub = { kind: 'recruit', offers: shuffle(Object.keys(HEROES)).slice(0, 3) }; render();
    }
  }

  function renderChoiceSubPicker(panel) {
    const run = S.run;
    const sub = S.choiceSub;
    if (sub.kind === 'training') {
      panel.innerHTML = `<h2 class="serif">Training — Pick a Hero (+2 Key Stat)</h2><div class="choice-grid" id="subGrid"></div>`;
      const g = $('#subGrid', panel);
      for (const rec of run.roster) {
        const def = HEROES[rec.id];
        const b = el('button', 'choice-card');
        b.innerHTML = `<div class="hc-top"><div class="portrait sm"><img src="${portraitSrc(rec.id)}" /></div><div><div class="choice-title">${esc(def.name)}</div><div class="small muted">+2 ${def.key} (now ${previewStats(rec).stats[def.key]} &rarr; ${previewStats(rec).stats[def.key] + 2})</div></div></div>`;
        b.onclick = () => {
          rec.train[def.key] = (rec.train[def.key] || 0) + 2;
          toast(`${def.name} gained +2 ${def.key}!`);
          S.choiceSub = null; enterShop(run); S.screen = 'shop'; render();
        };
        g.appendChild(b);
      }
    } else if (sub.kind === 'multiclass') {
      if (!sub.hero) {
        panel.innerHTML = `<h2 class="serif">Multiclass Trainer — Choose Hero</h2><div class="choice-grid" id="subGrid"></div>`;
        const g = $('#subGrid', panel);
        for (const rec of run.roster.filter(r => !r.mc)) {
          const def = HEROES[rec.id];
          const b = el('button', 'choice-card');
          b.innerHTML = `<div class="hc-top"><div class="portrait sm"><img src="${portraitSrc(rec.id)}" /></div><div><div class="choice-title">${esc(def.name)}</div><div class="small muted">${esc(def.cls)}</div></div></div>`;
          b.onclick = () => { sub.hero = rec; render(); };
          g.appendChild(b);
        }
      } else {
        const rec = sub.hero;
        const opts = mcOptions(rec);
        panel.innerHTML = `<h2 class="serif">Multiclass for ${esc(HEROES[rec.id].name)} — Pick Feature</h2><p class="small muted mt-8">Each Multiclass grants a permanent secondary feature with its own combat trigger:</p><div class="choice-grid" id="subGrid"></div>`;
        const g = $('#subGrid', panel);
        for (const kw of opts) {
          const b = el('button', 'choice-card');
          const desc = MULTICLASS_INFO[kw] || '';
          b.innerHTML = `<div><div class="choice-title">✦ ${esc(kw)}</div><p class="small muted mt-8">${annotateKw(desc)}</p></div><span class="btn primary sm">Learn ${esc(kw)}</span>`;
          b.onclick = () => {
            rec.mc = kw;
            if (kw === 'Metamagic') rec.mcMeta = 'Quickened';
            toast(`${HEROES[rec.id].name} learned ${kw}!`);
            S.choiceSub = null; enterShop(run); S.screen = 'shop'; render();
          };
          g.appendChild(b);
        }
      }
    } else if (sub.kind === 'recruit') {
      panel.innerHTML = `<h2 class="serif">Free Recruit — Pick 1 of 3 Heroes</h2><div class="starter-grid" id="subGrid"></div>`;
      const g = $('#subGrid', panel);
      for (const id of sub.offers) {
        const c = el('div', 'hero-card');
        c.innerHTML = heroCardHTML(id, { compact: true }) + `<button class="btn primary sm mt-8" data-pick>Recruit ${esc(HEROES[id].name)}</button>`;
        $('[data-pick]', c).onclick = () => {
          addHero(run, id, { spent: 0 });
          toast(`${HEROES[id].name} joined your roster!`);
          S.choiceSub = null; enterShop(run); S.screen = 'shop'; render();
        };
        g.appendChild(c);
      }
    }
  }

  // ---------------- Campfire Screen ----------------
  function renderCampfireScreen(app) {
    const run = S.run;
    const panel = el('section', 'vellum-panel');
    panel.style.maxWidth = '920px';
    panel.style.margin = '12px auto';
    const t1Heroes = run.roster.filter(r => r.tier === 1);

    panel.innerHTML = `
      <div class="sec-label">Campfire Before the Act 1 Boss</div>
      <h2 class="serif mt-8" style="font-size:24px;">Rest Before Nezznar, the Black Spider</h2>
      <p class="small muted">Ahead waits Nezznar (Web every 6s on 3 heroes, Darkness at 50% HP) + 3 Giant Spiders on webbed ground. Choose one Campfire blessing:</p>
      <div class="choice-grid" id="campGrid"></div>
    `;
    const g = $('#campGrid', panel);

    // 1. Rank Up
    const c1 = el('div', 'choice-card');
    c1.innerHTML = `
      <div>
        <div class="choice-icon">⚔</div>
        <div class="choice-title mt-8">Rank Up a Hero to Tier 2</div>
        <p class="small muted mt-8">Promote any Tier 1 hero to Tier 2 and choose their specialization path.</p>
      </div>
      <div class="row" id="campRankBtns"></div>
    `;
    const rb = $('#campRankBtns', c1);
    if (!t1Heroes.length) {
      rb.innerHTML = '<span class="small muted">All heroes are already Tier 2.</span>';
    } else {
      for (const rec of t1Heroes) {
        const b = el('button', 'btn emerald sm', `Promote ${esc(HEROES[rec.id].name)}`);
        b.onclick = () => {
          rec.tier = 2;
          openPathPicker(rec, () => { enterShop(run); S.screen = 'shop'; render(); });
        };
        rb.appendChild(b);
      }
    }
    g.appendChild(c1);

    // 2. Campfire Ward
    const c2 = el('button', 'choice-card');
    c2.innerHTML = `
      <div>
        <div class="choice-icon">🛡</div>
        <div class="choice-title mt-8">Campfire Ward</div>
        <p class="small muted mt-8">Every hero begins the boss fight against Nezznar with a 4d10 + CON Ward.</p>
      </div>
      <span class="btn primary sm">Bless Party</span>
    `;
    c2.onclick = () => {
      run.campWard = true;
      toast('Party blessed with 4d10 + CON Ward for Nezznar!');
      enterShop(run); S.screen = 'shop'; render();
    };
    g.appendChild(c2);

    // 3. Mend Piggy Bank
    const c3 = el('button', 'choice-card');
    c3.disabled = !run.piggy.broken;
    c3.innerHTML = `
      <div>
        <div class="choice-icon">🐷</div>
        <div class="choice-title mt-8">Mend Piggy Bank</div>
        <p class="small muted mt-8">${run.piggy.broken ? 'Restore your broken Piggy Bank for another free loss safety net.' : 'Your Piggy Bank is still intact!'}</p>
      </div>
      <span class="btn primary sm">${run.piggy.broken ? 'Restore Free Loss' : 'Already Intact'}</span>
    `;
    if (run.piggy.broken) {
      c3.onclick = () => {
        run.piggy.broken = false;
        toast('Piggy Bank restored!');
        enterShop(run); S.screen = 'shop'; render();
      };
    }
    g.appendChild(c3);

    app.appendChild(panel);
  }

  // ---------------- End Screen ----------------
  function renderEndScreen(app) {
    const run = S.run;
    const won = S.screen === 'victory';
    const panel = el('section', 'vellum-panel');
    panel.style.maxWidth = '920px';
    panel.style.margin = '16px auto';
    panel.style.textAlign = 'center';
    panel.innerHTML = `
      <div class="sec-label">${won ? 'Act 1 Cleared — Rousing!' : 'Run Ended in Defeat'}</div>
      <h2 class="serif mt-8" style="font-size:30px;color:${won ? 'var(--emerald)' : 'var(--crimson)'};">
        ${won ? 'Nezznar, the Black Spider Falls!' : `Defeated at Fight ${run.fight + 1}: ${esc(encOf(run).name)}`}
      </h2>
      <p class="muted">Seed #${S.seed} · Final Gold: ${run.gold}g · Fights Played: ${run.history.length}</p>
      <div class="party-grid mt-12" style="text-align:left;" id="endParty"></div>
      <div class="row mt-12" style="justify-content:center;">
        <button class="btn primary lg" id="btnPlayAgain">Play Another Run</button>
        <button class="btn lg" id="btnReplaySeed">Replay Same Seed (#${S.seed})</button>
      </div>
    `;
    const pg = $('#endParty', panel);
    for (const rec of onBoard(run)) {
      const c = el('div', 'hero-card');
      c.innerHTML = heroCardHTML(rec.id, { rec, compact: true })
        + `<div class="item-slots">${rec.items.map(ir => `<span class="slot-chip">${esc(ITEMS[ir.id].name)}</span>`).join('') || '<span class="small muted">No items</span>'}</div>`;
      pg.appendChild(c);
    }
    $('#btnPlayAgain', panel).onclick = () => startNewRun();
    $('#btnReplaySeed', panel).onclick = () => startNewRun(S.seed);
    app.appendChild(panel);
  }

  // ---------------- Modals ----------------
  function renderModal(app) {
    const m = S.modal;
    const bg = el('div', 'modal-backdrop');
    const box = el('div', 'modal-box');

    if (m.kind === 'path') {
      const rec = m.rec;
      const def = HEROES[rec.id];
      const card = HERO_CARDS[rec.id];
      box.innerHTML = `
        <div class="sec-label">Tier 2 Rank-Up — Choose Specialization</div>
        <div class="hc-top mt-8">
          <div class="portrait"><img src="${portraitSrc(rec.id)}" /><span class="tier-pip">T2</span></div>
          <div>
            <h2 class="serif" style="font-size:22px;">${esc(def.name)} Reaches Tier 2!</h2>
            <div class="small muted">+1 weapon die, higher HP, and stronger Tier 2 ability scaling. Pick one permanent path:</div>
          </div>
        </div>
        <div class="choice-grid" id="pathGrid"></div>
      `;
      const g = $('#pathGrid', box);
      card.paths.forEach((p, idx) => {
        const c = el('button', 'choice-card');
        c.innerHTML = `
          <div>
            <div class="rar-pill rar-${idx === 0 ? 'Rare' : 'Epic'}">Path ${idx === 0 ? 'A' : 'B'}</div>
            <div class="choice-title mt-8">${esc(p.name)}</div>
            <p class="small mt-8" style="color:var(--ink);">${annotateKw(p.text)}</p>
          </div>
          <span class="btn emerald sm">Choose ${esc(p.name)}</span>
        `;
        c.onclick = () => {
          rec.t2 = idx;
          S.modal = null;
          toast(`${def.name} specialized in ${p.name}!`);
          if (m.onDone) m.onDone();
          else render();
        };
        g.appendChild(c);
      });
    } else if (m.kind === 'autopsy') {
      const res = m.res;
      const win = res.result === 'win';
      const maxVal = Math.max(1, ...res.heroes.map(h => Math.max(h.dmg, h.heal + h.ward, h.taken)));
      const goldLine = win
        ? `+${res.gold}g win · +${res.interest}g interest${res.combatGold ? ` · +${res.combatGold}g combat drops` : ''}${res.piggy ? ` · +${res.piggy}g piggy` : ''}`
        : (res.freeLoss ? `Piggy Bank broke! Paid out +${res.piggyPayout}g — retry after shopping.` : 'Second loss — your run has ended.');

      box.innerHTML = `
        <div class="row between">
          <div>
            <div class="sec-label">Fight ${res.fight + 1} Complete · ${res.t.toFixed(1)}s</div>
            <h2 class="serif" style="font-size:24px;color:${win ? 'var(--emerald)' : 'var(--crimson)'};">${win ? 'Victory!' : (res.freeLoss ? 'Defeat — Piggy Bank Saved You!' : 'Defeat')}</h2>
          </div>
          <span class="pill gold" style="background:#261e14;">${esc(goldLine)}</span>
        </div>
        <div class="mt-12">
          ${res.heroes.map(h => `
            <div class="autopsy-row">
              <div><b>${esc(h.name)}</b><div class="small muted">${h.alive ? `${Math.ceil(h.hp)}/${h.maxHp} HP` : `Fell to ${esc(h.killedBy || '?')}`}</div></div>
              <div>
                <div class="bar-track" ${tipAttr('Damage Breakdown', `Total ${Math.round(h.dmg)} damage (${Math.round(Math.max(0, h.dmg - h.abDmg))} basic attacks in red, ${Math.round(h.abDmg)} abilities in orange).`)}>
                  <div class="bar-dmg" style="width:${Math.round(100 * Math.max(0, h.dmg - h.abDmg) / maxVal)}%"></div>
                  <div class="bar-ab" style="width:${Math.round(100 * h.abDmg / maxVal)}%"></div>
                </div>
                <div class="bar-track" style="margin-top:3px;" ${tipAttr('Support Breakdown', `Healing: ${Math.round(h.heal)} (green) · Ward: ${Math.round(h.ward)} (blue).`)}>
                  <div class="bar-heal" style="width:${Math.round(100 * h.heal / maxVal)}%"></div>
                  <div class="bar-ward" style="width:${Math.round(100 * h.ward / maxVal)}%"></div>
                </div>
              </div>
              <div class="small" style="text-align:right;">
                <b>${Math.round(h.dmg)}</b> dmg · <b>${Math.round(h.heal + h.ward)}</b> sup<br/>
                <span class="muted">${Math.round(h.taken)} taken</span>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="row mt-12" style="justify-content:flex-end;">
          <button class="btn primary lg" id="btnContinue">Continue &rarr;</button>
        </div>
      `;
      $('#btnContinue', box).onclick = proceedAfterAutopsy;
    } else if (m.kind === 'hero') {
      box.innerHTML = `
        <div class="hero-card" style="box-shadow:none;border:none;padding:0;background:transparent;">${heroCardHTML(m.id, { rec: m.rec })}</div>
        <div class="sec-label mt-12">Tier 2 Specialization Paths</div>
        <div class="choice-grid">
          ${(HERO_CARDS[m.id].paths || []).map((p, i) => `
            <div class="item-card">
              <div class="rar-pill rar-${i === 0 ? 'Rare' : 'Epic'}">Path ${i === 0 ? 'A' : 'B'}</div>
              <div class="serif mt-8" style="font-weight:700;">${esc(p.name)}</div>
              <div class="small muted mt-8">${annotateKw(p.text)}</div>
            </div>
          `).join('')}
        </div>
        <div class="row mt-12" style="justify-content:flex-end;"><button class="btn vellum-btn" id="btnCloseM">Close</button></div>
      `;
      $('#btnCloseM', box).onclick = () => { S.modal = null; render(); };
      bg.onclick = e => { if (e.target === bg) { S.modal = null; render(); } };
    } else if (m.kind === 'rules') {
      box.innerHTML = `
        <h2 class="serif">Basements &amp; Basilisks v0.25 Rules</h2>
        <ul class="small" style="line-height:1.55;padding-left:18px;">
          <li><b>Act 1 Loop:</b> Pick 1 of 3 starters &rarr; Shop &rarr; 5 Phandelver Fights (with Choice Cards after Fights 1–4) &rarr; Campfire &rarr; Boss <b>Nezznar</b>.</li>
          <li><b>Tiers &amp; Growth:</b> Buying a 2nd copy of a hero ranks them up to <b>Tier 2</b> (+1 weapon die, higher HP, stronger ability, and a permanent Path A/B choice).</li>
          <li><b>Resistance &amp; Evasion:</b> AC reduces physical damage and SR reduces magic damage by <code>R / (R + 20)</code>. <b>Radiant</b> ignores both. <b>Evasion</b> (cap 50%) dodges attacks only; <b>Pierce</b> reduces enemy Evasion.</li>
          <li><b>Ability Rolls:</b> Every cast rolls <code>d20 + key modifier</code> (half-point modifiers round randomly on .5). Nat 1 = Fizzle (half charge back); Nat 20 = Crit (dice doubled).</li>
          <li><b>Conditions:</b> Hover any underlined keyword on a card to see its rules. <i>Restrained</i> stops movement, slows attacks 50%, and casts with Disadvantage. <i>Hunter's Mark</i> and <i>Hex</i> stay on the target until it dies. <i>Wild Shape</i> grants a bonus HP bar until depleted.</li>
          <li><b>Items &amp; Economy:</b> Uncommon (8g) · Rare (15g) · Epic (24g), 2 slots per hero, 66% sell-back. Win +20g, interest +1g per 5g saved (up to 20g). First loss breaks the Piggy Bank for a free retry; second loss ends the run.</li>
        </ul>
        <div class="row mt-12" style="justify-content:flex-end;"><button class="btn primary" id="btnCloseR">Got It</button></div>
      `;
      $('#btnCloseR', box).onclick = () => { S.modal = null; render(); };
      bg.onclick = e => { if (e.target === bg) { S.modal = null; render(); } };
    }

    bg.appendChild(box);
    app.appendChild(bg);
  }

  // Expose tiny debug handle & boot
  window.BB = { state: S, startNewRun };
  document.addEventListener('DOMContentLoaded', render);
  if (document.readyState !== 'loading') render();
})();
