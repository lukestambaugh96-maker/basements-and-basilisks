'use strict';
// Three bot players for the encounter pass (25 Nov). Each plays a whole Act 1 run with the real shop, economy and choice cards.
//   bare      never buys anything beyond filling the 3 party slots (no items, no duplicates, no rerolls, no growth cards)
//   sensible  fills a balanced party (a frontliner and a damage dealer), ranks heroes up, buys items that fit whoever gets them
//   engine    picks a carry and builds around it: a buffer for it, rank-ups first, damage items and growth cards on it, rerolls to find copies
// Same seed = same starter and same first shop for every bot.

const BOT_DMG_JOBS = ['attacker', 'brawler', 'caster'];
const jobOf = id => HEROES[id].cfg.benchJob;
const isFront = id => jobOf(id) === 'frontline';
const isDmg = id => BOT_DMG_JOBS.includes(jobOf(id));
const isSupport = id => jobOf(id) === 'support';
const BRAWL_FRONT = ['laurel', 'bram', 'gilthrax', 'dane']; // sustain that feeds a melee brawl
const CARRY_BUFFERS = ['rosalind', 'jamison', 'zoe', 'faelan']; // supports that pay off one damage dealer

// How much an item is worth on this hero (rough, in "points"). Policy weights decide who gets it.
function itemValue(it, rec) {
  const def = HEROES[rec.id]; const job = jobOf(rec.id); const front = job === 'frontline'; const dmg = BOT_DMG_JOBS.includes(job);
  const melee = def.range <= 1; let v = 0;
  for (const k in (it.stats || {})) { const p = it.stats[k]; if (k === def.key || k === (def.atk.stat || '')) v += 2.5 * p; else if (k === 'CON') v += (front ? 1.5 : 0.8) * p; else v += 0.2 * p; }
  v += (it.ac || 0) * (front ? 3 : 1.2) + (it.sr || 0) * (front ? 2.5 : 1.2) + (it.hp || 0) * (front ? 0.2 : 0.1);
  v += (it.eva || 0) * (front || melee ? 35 : 15);
  const atkW = dmg ? 1 : 0.35;
  v += (it.as || 0) * 40 * atkW + (it.dieUp || 0) * 5 * atkW + (it.flat || 0) * 2 * atkW + (it.pierce || 0) * 28 * atkW;
  if (it.onHit) v += (6 + (it.onHit.burn ? 2 : 0)) * atkW;
  if (it.scale) v += 5 * atkW;
  if (it.rangedAs && !melee) v += it.rangedAs * 40 * atkW;
  if (it.meleeFlat && melee) v += 2 * atkW;
  const castW = def.job === 'time' ? 1.1 : (job === 'support' ? 0.9 : 0.35);
  v += ((it.sc || 0) / 10 + (it.cr || 0) * 30 + (it.rollB || 0) * 1.5 + (it.castDie || 0) * 1.5) * castW;
  if (it.potion) v += front ? 8 : 5;
  if (it.id === 'displacement' || it.id === 'ring_evasion') v += front ? 7 : 3;
  if (it.regen) v += (front ? 3 : 1.5) * it.regen;
  if (it.id === 'ioun_mastery') v += 4 * castW;
  if (it.arachnida) v += 5 * it.arachnida * atkW;
  if (it.cls && it.cls === def.cls) v += 3;
  return v;
}
function freeSlots(rec) { return ECON.slots - rec.items.length; }
// Best (recipient, value) for an item among board heroes with a free slot. weight(rec, it) scales value per policy.
function bestHolder(run, it, weight) {
  let best = null, bv = -1;
  for (const r of onBoard(run)) { if (freeSlots(r) <= 0) continue; const v = itemValue(it, r) * (weight ? weight(r, it) : 1); if (v > bv) { bv = v; best = r; } }
  return { rec: best, v: bv };
}
function equipStash(run, weight) {
  for (const ir of run.stash.slice()) { const { rec } = bestHolder(run, ITEMS[ir.id], weight); if (rec) equip(run, ir, rec); }
}
function heroOfferOk(run, h) { return !h.sold && !run.roster.find(r => r.id === h.id) && run.gold >= offerPrice(run, h) && run.roster.length < ECON.boardMax + ECON.benchMax; }
function dupOffer(run, h, pred) { const own = run.roster.find(r => r.id === h.id); return !h.sold && own && own.pos && own.tier < 2 && run.gold >= offerPrice(run, h) && (!pred || pred(own)); }

// ---------------- policies ----------------
const BOTS = {
  bare: {
    label: 'Never buys',
    shop(run) {
      let g = 0;
      while (run.roster.length < ECON.boardMax && g++ < 5) { const h = run.offers.heroes.find(h => heroOfferOk(run, h)); if (!h) break; buyOffer(run, h); }
    },
    choice(run, cards) { // takes nothing that grows the party
      const c = cards.find(c => c.id === 'purse') || cards.find(c => c.id === 'bargain_more');
      if (c && c.id === 'purse') run.gold += ECON.purse; else if (c) run.extraCard = true;
    },
    campfire(run) { run.campWard = true; },
  },

  sensible: {
    label: 'Buys sensibly',
    shop(run) {
      let g = 0, rerolls = 0;
      while (g++ < 25) {
        const o = run.offers; let bought = false;
        if (run.roster.length < ECON.boardMax) {
          const have = run.roster.map(r => r.id); const needFront = !have.some(isFront), needDmg = !have.some(isDmg);
          const fit = o.heroes.filter(h => heroOfferOk(run, h));
          const pickH = fit.find(h => needFront && isFront(h.id)) || fit.find(h => needDmg && isDmg(h.id)) || (!needFront && !needDmg ? fit[0] : null)
            || (run.roster.length === ECON.boardMax - 1 ? fit[0] : null);
          if (pickH) { buyOffer(run, pickH); bought = true; }
          else if (rerolls < 3 && run.gold - run.rerollCost >= 15 * (ECON.boardMax - run.roster.length)) { reroll(run); rerolls++; continue; }
          else if (fit[0]) { buyOffer(run, fit[0]); bought = true; }
        } else {
          const d = o.heroes.find(h => dupOffer(run, h)); // rank-ups are the biggest jump in power
          if (d) { const res = buyOffer(run, d); if (res.rankUp) res.rankUp.t2 = Math.floor(RNG() * 2); bought = true; }
          if (!bought) {
            let best = null, bv = 0;
            for (const io of o.items) { if (io.sold || run.gold < offerPrice(run, io)) continue; const { rec, v } = bestHolder(run, ITEMS[io.id]); const sc = v / Math.pow(offerPrice(run, io), 0.7); if (rec && sc > bv && v >= 3) { bv = sc; best = io; } }
            if (best) { buyOffer(run, best); bought = true; }
          }
          if (!bought && rerolls < 2 && run.gold >= run.rerollCost + 10 && onBoard(run).some(r => freeSlots(r) > 0 || r.tier < 2)) { reroll(run); rerolls++; continue; }
        }
        equipStash(run);
        if (!bought) break;
      }
      equipStash(run);
    },
    choice(run, cards) {
      const order = ['freeitem', 'classitem', 'training', 'purse', 'multiclass', 'bargain_more', 'recruit', 'bargain_elite'];
      const c = order.map(id => cards.find(c => c.id === id)).find(Boolean) || cards[0];
      applyCard(run, c, pickTrainee(run, r => isDmg(r.id) ? 2 : isFront(r.id) ? 1.5 : 1), null);
    },
    campfire(run) { const t1 = onBoard(run).filter(r => r.tier === 1); const r = t1.find(r => isFront(r.id)) || t1.find(r => isDmg(r.id)) || t1[0]; if (r) { r.tier = 2; r.t2 = Math.floor(RNG() * 2); } else run.campWard = true; },
  },

  engine: {
    label: 'Builds an engine',
    carry(run) { // the damage dealer everything is fed to
      const b = run.roster.filter(r => isDmg(r.id)); if (!b.length) return null;
      const melee = r => HEROES[r.id].range <= 1 ? 1 : 0;
      return b.sort((a, b2) => (b2.tier - a.tier) || (melee(b2) - melee(a)) || (b2.items.length - a.items.length) || (b2.spent - a.spent))[0];
    },
    shop(run) {
      const P = BOTS.engine; let g = 0, rerolls = 0;
      while (g++ < 30) {
        const o = run.offers; let bought = false; const carry = P.carry(run);
        if (run.roster.length < ECON.boardMax) {
          const have = run.roster.map(r => r.id); const fit = o.heroes.filter(h => heroOfferOk(run, h));
          const needFront = !have.some(isFront), needCarry = !carry; const needBuffer = false;
          const slotsLeft = ECON.boardMax - run.roster.length;
          let pickH = null;
          if (needCarry) pickH = fit.find(h => isDmg(h.id) && HEROES[h.id].range <= 1) || fit.find(h => isDmg(h.id) && jobOf(h.id) !== 'caster') || fit.find(h => isDmg(h.id));
          if (!pickH && needFront) pickH = fit.find(h => BRAWL_FRONT.includes(h.id)) || (rerolls >= 3 ? fit.find(h => isFront(h.id)) : null);
          if (!pickH && needBuffer && !needFront && !needCarry) pickH = fit.find(h => CARRY_BUFFERS.includes(h.id));
          if (!pickH && slotsLeft === 1 && !needFront && !needCarry && rerolls >= 4) pickH = fit[0];
          if (pickH) { buyOffer(run, pickH); bought = true; }
          else if (rerolls < 6 && run.gold - run.rerollCost >= 15 * slotsLeft) { reroll(run); rerolls++; continue; }
          else { const f = fit.find(h => (needFront ? isFront(h.id) : true)) || fit[0]; if (f) { buyOffer(run, f); bought = true; } }
        } else {
          const d = o.heroes.find(h => dupOffer(run, h, own => own === carry)) || o.heroes.find(h => dupOffer(run, h));
          if (d) { const res = buyOffer(run, d); if (res.rankUp) res.rankUp.t2 = Math.floor(RNG() * 2); bought = true; }
          if (!bought) {
            let best = null, bv = 0;
            for (const io of o.items) { if (io.sold || run.gold < offerPrice(run, io)) continue; const { rec, v } = bestHolder(run, ITEMS[io.id], P.weight(run)); const sc = v / Math.pow(offerPrice(run, io), 0.7); if (rec && v >= 4 && sc > bv) { bv = sc; best = io; } }
            if (best) { buyOffer(run, best); bought = true; }
          }
          // keep looking for the carry's copy while there's gold to spare
          if (!bought && carry && carry.tier < 2 && rerolls < 6 && run.gold >= run.rerollCost + 15) { reroll(run); rerolls++; continue; }
          if (!bought && rerolls < 3 && run.gold >= run.rerollCost + 12 && onBoard(run).some(r => freeSlots(r) > 0)) { reroll(run); rerolls++; continue; }
        }
        equipStash(run, P.weight(run));
        if (!bought) break;
      }
      equipStash(run, P.weight(run));
    },
    // Brawl engine: sustain/evasion on the front line, on-hit & attack-speed scaling on the carry.
    weight(run) { const carry = BOTS.engine.carry(run); return (r, it) => {
      const melee = HEROES[r.id].range <= 1; let w = r === carry ? 1.6 : isFront(r.id) ? 1.2 : 0.8;
      if ((it.onHit || it.arachnida) && r === carry) w *= 1.6; if (it.kw === 'Rage' && melee) w *= 2; if (it.id === 'bm_gauntlet' && r === carry) w *= 1.6;
      if (melee && it.stats && it.stats.STR) w *= 1.3; if ((it.eva || it.regen || it.hp >= 20) && isFront(r.id)) w *= 1.3; return w; }; },
    choice(run, cards) {
      const carry = BOTS.engine.carry(run);
      const order = ['multiclass', 'classitem', 'training', 'freeitem', 'purse', 'bargain_more', 'recruit', 'bargain_elite'];
      const c = order.map(id => cards.find(c => c.id === id)).find(Boolean) || cards[0];
      if (c.id === 'multiclass') { const f = onBoard(run).find(r => isFront(r.id) && !r.mc && HEROES[r.id].cls !== 'Barbarian');
        if (f) { f.mc = 'Rage'; return; } }
      applyCard(run, c, carry || pickTrainee(run, () => 1), carry);
    },
    campfire(run) { const carry = BOTS.engine.carry(run); const t1 = onBoard(run).filter(r => r.tier === 1); const r = (carry && carry.tier === 1 && carry.pos) ? carry : t1.find(r => isFront(r.id)) || t1[0]; if (r) { r.tier = 2; r.t2 = Math.floor(RNG() * 2); } else run.campWard = true; },
  },
};
function pickTrainee(run, w) { const b = onBoard(run); return b.sort((a, c) => w(c) - w(a))[0] || run.roster[0]; }
const DAMAGE_KW = ['Action Surge', "Hunter's Mark", 'Hex', 'Sneak Attack', 'Smite', 'Ki'];
function applyCard(run, c, trainee, carry) {
  if (c.id === 'purse') run.gold += ECON.purse;
  else if (c.id === 'training') { const r = trainee; r.train[HEROES[r.id].key] = (r.train[HEROES[r.id].key] || 0) + 2; }
  else if (c.id === 'freeitem') run.stash.push({ id: pick(ITEM_LIST.filter(i => i.rar === 'Uncommon')).id, wins: 0, paid: 0 });
  else if (c.id === 'recruit') { if (run.roster.length < ECON.boardMax + ECON.benchMax) addHero(run, pick(Object.keys(HEROES)), { bench: true, spent: 0 }); }
  else if (c.id === 'classitem') { const its = classItemOffers(run); const tgt = carry || trainee; const sc = x => itemValue(x, tgt) + (carry && x.kw === 'Rage' ? 8 : 0); const it = its.slice().sort((a, b) => sc(b) - sc(a))[0]; run.stash.push({ id: it.id, wins: 0, paid: 0 }); }
  else if (c.id === 'multiclass') {
    const r = carry && !carry.mc ? carry : run.roster.find(r => r.pos && !r.mc); if (r) { const opts = mcOptions(r); const melee = HEROES[r.id].range <= 1;
      const pref = carry ? opts.filter(k => DAMAGE_KW.includes(k) && (melee || k !== 'Smite')) : opts; r.mc = pick(pref.length ? pref : opts); if (r.mc === 'Metamagic') r.mcMeta = 'Quickened'; }
  }
  else if (c.id === 'bargain_elite') run.bargainElite = true;
  else if (c.id === 'bargain_more') run.extraCard = true;
}

function policyRun(seed, botId) {
  const P = BOTS[botId]; const run = newRun(seed);
  const starter = pick(Object.keys(HEROES)); addHero(run, starter, { spent: 0 }); run.starter = starter;
  const fights = []; let guard = 0; run.freeLossUsed = false;
  while (!run.over && guard++ < 12) {
    if (run.phase === 'starter' || run.phase === 'shop' || run.phase === 'shop-retry') { enterShop(run); if (run.fight > 0) P.shop(run); botPlaceAll(run); }
    if (PLACE.mode !== 'bot') placeForFight(run, seed * 16 + fights.length);
    const snap = snapFight(run, seed * 16 + fights.length);
    const F = startRunFight(run, { headless: true }); while (!F.over) stepFight(F);
    const res = finishFight(run, F); if (res.freeLoss) run.freeLossUsed = true; res.snap = snap;
    res.party = F.units.filter(u => u.side === 'H' && !u.summon).map(u => u.id + (u.tier > 1 ? '*' : ''));
    res.items = onBoard(run).reduce((a, r) => a + r.items.length, 0); res.t2 = onBoard(run).filter(r => r.tier > 1).length;
    fights.push(res);
    if (run.phase === 'rousing') { run.over = true; break; }
    if (run.phase === 'choice') { P.choice(run, drawChoices(run)); run.phase = 'shop'; }
    else if (run.phase === 'campfire') { P.campfire(run); run.phase = 'shop'; }
  }
  return { run, fights, starter };
}

// ---------------- fight snapshots and replays (for the item-off, cast-off and placement tests) ----------------
// A snapshot is the party exactly as it walks into a fight. Replays re-run that fight from one fixed seed,
// so the full build and each variant meet the same dice.
function snapFight(run, seed) {
  return { fight: run.fight, bossId: run.bossId, enc: encOf(run), seed, gold: run.gold, extraElite: run.bargainElite && run.fight < 5, campWard: run.fight === 5 && run.campWard,
    recs: JSON.parse(JSON.stringify(onBoard(run).map(r => { const c = Object.assign({}, r); return c; }))) };
}
function snapEnc(snap) { return snap.enc || (snap.fight < 5 ? ACT1[snap.fight] : BOSSES[snap.bossId]); }
// mod: { noItems, drop: [uid, itemIndex], noAbility: uid, pos: { uid: {x,y} } }
function replayFight(snap, mod = {}) {
  const recs = JSON.parse(JSON.stringify(snap.recs));
  for (const r of recs) {
    if (mod.noItems) r.items = [];
    if (mod.drop && mod.drop[0] === r.uid) r.items = r.items.filter((_, i) => i !== mod.drop[1]);
    if (mod.pos && mod.pos[r.uid]) r.pos = mod.pos[r.uid];
    if (mod.buff && mod.buff.uid === r.uid && mod.buff.kind === 'stat') { r.train = Object.assign({}, r.train); const k = mod.buff.stat === 'key' ? HEROES[r.id].key : mod.buff.stat; r.train[k] = (r.train[k] || 0) + mod.buff.v; }
  }
  seedRng(snap.seed);
  const units = recs.map(r => makeHeroUnit(r));
  if (mod.noAbility != null) for (const u of units) if (u.rec.uid === mod.noAbility) u.ab = null;
  // test buffs (bench `buffs`): attack speed, an extra die on each attack hit (the attack's own damage type), an extra die on each ability hit
  if (mod.buff) for (const u of units) if (u.rec.uid === mod.buff.uid) {
    if (mod.buff.kind === 'as') u.as += mod.buff.v;
    if (mod.buff.kind === 'atkDie') u.onHitItems.push({ n: 1, x: mod.buff.v, type: u.atk.type || 'phys' });
    if (mod.buff.kind === 'castDie') u.castDie = mod.buff.v;
  }
  const F = makeFight(snapEnc(snap), units, { headless: true, extraElite: snap.extraElite, campWard: snap.campWard, runGold: snap.gold });
  while (!F.over) stepFight(F);
  const hp = units.reduce((a, u) => a + Math.max(0, u.hp), 0), mx = units.reduce((a, u) => a + u.maxHp, 0);
  return { win: F.result === 'win', hpLost: 1 - hp / mx, t: F.t, dead: units.filter(u => !u.alive).map(u => u.rec.uid) };
}
// Formations. Supports both West-vs-East (cols 0-3) and South-vs-North (rows 5-7).
const FORMATIONS = ['bot', 'smart', 'swapped', 'tight', 'spread', 'wall', 'back', 'random'];
function formation(snap, kind, rng) {
  const enc = snapEnc(snap); const blocked = new Set((enc.terrain || []).filter(([k]) => ['wall', 'chasm', 'water', 'crates', 'forge', 'gate', 'rock'].includes(k)).map(([k, x, y]) => x + ',' + y));
  const towers = (enc.terrain || []).filter(([k]) => k === 'tower').map(([k, x, y]) => ({ x, y }));
  const used = new Set(); const out = {};
  const sn = !!(RULES.map && RULES.map.southNorth);
  const take = (r, cells) => {
    for (const c of cells) {
      const k = c.x + ',' + c.y;
      const inZone = sn ? (c.x >= 0 && c.x < COLS && c.y >= 5 && c.y < ROWS) : (c.x >= 0 && c.x <= 3 && c.y >= 0 && c.y < ROWS);
      if (inZone && !used.has(k) && !blocked.has(k)) { used.add(k); out[r.uid] = { x: c.x, y: c.y }; return; }
    }
  };
  const grid = (cols, rows) => { const a = []; if (sn) { for (const y of rows) for (const x of cols) a.push({ x, y }); } else { for (const x of cols) for (const y of rows) a.push({ x, y }); } return a; };
  const melee = r => HEROES[r.id].range <= 1, front = r => HEROES[r.id].cfg.benchJob === 'frontline';
  const recs = snap.recs.slice();
  if (kind === 'bot') { for (const r of recs) out[r.uid] = r.pos; return out; }
  if (sn) {
    const cMid = [3, 4, 2, 5, 1, 6, 0, 7];
    if (kind === 'random') { const all = grid([0, 1, 2, 3, 4, 5, 6, 7], [5, 6, 7]); for (const r of recs) { const sh = all.slice().sort(() => rng() - 0.5); take(r, sh); } return out; }
    if (kind === 'smart') {
      const order = recs.slice().sort((a, b) => (front(b) - front(a)) || (melee(b) - melee(a)));
      for (const r of order) { if (melee(r)) take(r, grid(front(r) ? [3, 4, 2, 5] : cMid, [5, 6, 7])); else take(r, towers.filter(t => t.y >= 5).concat(grid(cMid, [7, 6, 5]))); }
      return out;
    }
    if (kind === 'swapped') { for (const r of recs) take(r, grid(cMid, melee(r) ? [7, 6] : [5, 6])); return out; }
    if (kind === 'tight') { for (const r of recs) take(r, grid([3, 4, 2, 5], [5, 6, 7])); return out; }
    if (kind === 'spread') { const cols = [[0, 1], [7, 6], [3, 4]]; recs.forEach((r, i) => take(r, grid(cols[i % 3], melee(r) ? [5, 6] : [7, 6]).concat(grid([0, 7, 1, 6, 2, 5, 3, 4], [5, 6, 7])))); return out; }
    if (kind === 'wall') { for (const r of recs) take(r, grid(cMid, [5, 6])); return out; }
    if (kind === 'back') { for (const r of recs) take(r, grid(cMid, [7, 6])); return out; }
    return out;
  }
  if (kind === 'random') { const all = grid([0, 1, 2, 3], [0, 1, 2, 3, 4, 5]); for (const r of recs) { const sh = all.slice().sort(() => rng() - 0.5); take(r, sh); } return out; }
  if (kind === 'smart') { // frontliners first and central, other melee beside them, ranged behind (on a tower if the map has one)
    const order = recs.slice().sort((a, b) => (front(b) - front(a)) || (melee(b) - melee(a)));
    for (const r of order) { if (melee(r)) take(r, grid([3, 2], front(r) ? [2, 3, 1, 4] : [3, 2, 4, 1, 5, 0])); else take(r, towers.concat(grid([1, 0, 2], [2, 3, 1, 4, 0, 5]))); }
    return out;
  }
  if (kind === 'swapped') { for (const r of recs) take(r, grid(melee(r) ? [0, 1] : [3, 2], [2, 3, 1, 4, 0, 5])); return out; }
  if (kind === 'tight') { for (const r of recs) take(r, grid([2, 3, 1], [2, 3, 1, 4])); return out; }
  if (kind === 'spread') { const rows = [[0], [5], [2, 3]]; recs.forEach((r, i) => take(r, grid(melee(r) ? [3, 2] : [1, 0], rows[i % 3]).concat(grid([3, 2, 1, 0], [0, 5, 1, 4, 2, 3])))); return out; }
  if (kind === 'wall') { for (const r of recs) take(r, grid([3, 2], [2, 3, 1, 4, 0, 5])); return out; }
  if (kind === 'back') { for (const r of recs) take(r, grid([0, 1], [2, 3, 1, 4, 0, 5])); return out; }
  return out;
}

// How the bots place before each fight. 'bot' = default (melee front, ranged back). A formation name = always that one.
// 'best' = try every formation in PLACE.trials practice replays on other dice, keep the one that wins most (a player who has learned the map).
const PLACE = { mode: 'bot', trials: 2 };
function setPlace(mode, trials) { PLACE.mode = mode || 'bot'; if (trials) PLACE.trials = trials; }
function placeForFight(run, seed) {
  if (run.fight === 0) return;
  const snap = snapFight(run, seed); let s2 = seed ^ 0x5bd1e995; const rng = () => (s2 = (s2 * 1103515245 + 12345) >>> 0) / 4294967296;
  let pos;
  if (PLACE.mode !== 'best') pos = formation(snap, PLACE.mode, rng);
  else {
    let best = -1, bestHp = 9;
    for (const f of FORMATIONS) { const p = formation(snap, f, rng); let w = 0, hp = 0;
      for (let j = 0; j < PLACE.trials; j++) { const v = replayFight(Object.assign({}, snap, { seed: seed * 31 + 104729 * (j + 1) }), { pos: p }); w += v.win; hp += v.hpLost; }
      if (w > best || (w === best && hp < bestHp)) { best = w; bestHp = hp; pos = p; } }
  }
  for (const r of onBoard(run)) if (pos[r.uid]) r.pos = pos[r.uid];
}
