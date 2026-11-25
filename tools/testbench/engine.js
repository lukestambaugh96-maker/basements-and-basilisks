'use strict';
// Test bench engine: prototype 2's fight logic; every constant comes from config/rules.config.json (CFG.rules).
// ===================== Basements & Basilisks v0.25 — Act 1 prototype: engine =====================
const RULES = CFG.rules;
const ROWS = RULES.map.rows, COLS = RULES.map.columns, DT = RULES.fight.tickSeconds, FIGHT_TIMEOUT = RULES.fight.timeoutSeconds;
const STATS = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
const STAT_NAME = { STR: 'Strength', DEX: 'Dexterity', CON: 'Constitution', INT: 'Intelligence', WIS: 'Wisdom', CHA: 'Charisma' };
const HIT_DIE = RULES.hp.hitDie;
const BASE_HP = RULES.hp.base;

let RNG = Math.random;
function seedRng(seed) { let s = seed >>> 0; RNG = function () { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const d = x => 1 + Math.floor(RNG() * x);
// "2d8+3" -> { n: 2, x: 8, flat: 3 }
function parseDice(s) { const m = /^(\d+)d(\d+)([+-]\d+)?$/.exec(String(s).replace(/\s/g, '')); if (!m) throw new Error('Bad dice: ' + s); return { n: +m[1], x: +m[2], flat: m[3] ? +m[3] : 0 }; }
const mod = s => Math.floor((s - 10) / 2);
function rollDice(n, x, crit, emp) { n = Math.max(0, n | 0); const c = crit ? n * 2 : n; let t = 0; for (let i = 0; i < c; i++) { let r = d(x); if (emp && r <= 2) r = d(x); t += r; } return t; }
const RESIST_K = RULES.resistance.K;
const resist = R => { R = Math.max(0, R); return R / (R + RESIST_K); };
const SETTINGS = { atkDiv: RULES.charge.attackerSecondsPerCast, restrain: RULES.statuses.restrained.attackSlow };
const pick = a => a[Math.floor(RNG() * a.length)];
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(RNG() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
const dist = (a, b) => Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
const inb = (x, y) => x >= 0 && y >= 0 && x < COLS && y < ROWS;
const DIE_UP = { 4: 6, 6: 8, 8: 10, 10: 12, 12: 12 };
const upDie = (x, k) => { for (let i = 0; i < k; i++) x = DIE_UP[x] || x; return x; };

// ---------------- fight setup ----------------
function makeFight(enc, heroUnits, opts = {}) {
  const F = { t: 0, ev: [], units: [], enc, campWard: !!opts.campWard, runGold: opts.runGold || 0, terr: [], fx: [], log: [], headless: !!opts.headless, over: false, result: null, gold: 0, uidc: 1, flood: enc.flood ? { t: enc.flood.t, row: enc.flood.row, done: false } : null };
  for (let y = 0; y < ROWS; y++) { F.terr.push(new Array(COLS).fill(null)); }
  for (const [kind, x, y] of (enc.terrain || [])) F.terr[y][x] = kind;
  for (const u of heroUnits) addUnit(F, u);
  for (const e of enc.enemies) addUnit(F, makeEnemyUnit(e.id, e.x, e.y));
  if (opts.extraElite) { const c = freeCellNear(F, 6, 2, 'E') || { x: 7, y: 0 }; addUnit(F, makeEnemyUnit('bugbear', c.x, c.y)); }
  for (const u of F.units) startUnit(F, u);
  return F;
}
function addUnit(F, u) { u.F = F; u.fid = F.uidc++; F.units.push(u); return u; }

function baseUnit() {
  return {
    alive: true, charge: 0, atkT: 0, moveT: 0, castT: 0, casting: false, lastCast: -9, target: null, pend: [], dotT: 0,
    ward: 0, wardAbs: 0, st: { root: 0, stun: 0, stunImm: 0, taunt: 0, tauntSrc: null, stealth: 0, slow: 0, slowT: 0, burn: 0, burnT: 0, burnSrc: null, poison: 0, poisonSrc: null, invuln: 0, dodge: 0, dark: 0, inspired: 0, bond: 0, haste: 0, hasteT: 0 },
    stat: { dmg: 0, heal: 0, ward: 0, taken: 0, abDmg: 0 }, gk: new Set(), counters: {}, it: {}, onHitItems: [], lastHitBy: null,
  };
}

function makeHeroUnit(rec) {
  const def = HEROES[rec.id];
  const u = Object.assign(baseUnit(), { side: 'H', def, id: rec.id, name: def.name, rec, tier: rec.tier, t2: rec.t2, x: rec.pos ? rec.pos.x : 0, y: rec.pos ? rec.pos.y : 0 });
  u.stats = {}; STATS.forEach((k, i) => u.stats[k] = def.stats[i] + ((rec.train || {})[k] || 0));
  u.ac = def.ac; u.sr = def.sr; u.as = 0; u.cr = 0; u.sc = def.startCharge || 0; u.rollB = 0; u.dieUp = 0; u.flat = 0; u.pen = 0; u.spen = 0; u.hpB = 0; u.regen = 0;
  u.range = def.range; u.atk = Object.assign({}, def.atk); u.ab = def.ab; u.key = def.key;
  let rareCount = 0;
  for (const ir of (rec.items || [])) {
    const it = ITEMS[ir.id]; if (!it) continue; u.it[it.id] = ir;
    if (['Rare', 'Very Rare', 'Legendary'].includes(it.rar)) rareCount++;
    for (const k in (it.stats || {})) u.stats[k] += it.stats[k];
    u.ac += it.ac || 0; u.sr += it.sr || 0; u.as += it.as || 0; u.cr += it.cr || 0; u.sc += it.sc || 0; u.rollB += it.rollB || 0;
    u.dieUp += it.dieUp || 0; u.flat += it.flat || 0; u.hpB += it.hp || 0; u.regen += it.regen || 0; u.spen += it.spen || 0;
    if (it.scale) { const v = Math.min(it.scale.cap, it.scale.per * (ir.wins || 0)); if (it.scale.f === 'flat') u.flat += v; if (it.scale.f === 'as') u.as += v; }
    if (it.onHit) u.onHitItems.push(it.onHit);
    if (it.kw) u.gk.add(it.kw);
    if (it.rangedAs && def.range >= 2) u.as += it.rangedAs;
    if (it.meleeFlat && def.range <= 1) u.flat += it.meleeFlat;
  }
  if (rec.mc) u.gk.add(rec.mc);
  if (rec.mcMeta) u.meta = rec.mcMeta;
  u.itemCount = (rec.items || []).length; u.rareCount = rareCount;
  u.m = k => mod(u.stats[k]);
  u.pen = Math.max(0, u.m('STR'));
  const hd = HIT_DIE[def.cls], dice = RULES.hp.hitDiceAtTier * u.tier;
  u.maxHp = BASE_HP + Math.floor(dice * (hd + 1) / 2) + u.m('CON') * dice + u.hpB;
  u.hp = u.maxHp;
  u.atkIvBase = def.atk.iv; u.ratio = def.atk.ratio || 1;
  u.job = def.job || 'time';
  u.cAtk = def.cAtk !== undefined ? def.cAtk : Math.round(100 * def.atk.iv / SETTINGS.atkDiv);
  u.cHit = def.cHit || RULES.charge.perHitTaken;
  u.cTime = def.cTime || RULES.charge.casterBaseSeconds;
  u.maxCharge = def.chargeToCast || 100; // charge needed to cast: set per hero (ability size)
  if (rec.mc === 'Metamagic' && rec.mcMeta === 'Empowered') u.empower = true;
  if (rec.mc === 'Metamagic' && rec.mcMeta === 'Quickened') u.quick = true;
  return u;
}

function makeEnemyUnit(id, x, y) {
  const def = ENEMIES[id];
  const u = Object.assign(baseUnit(), { side: 'E', def, id, name: def.name, x, y, tier: 1, boss: def.rank === 'Boss', elite: def.rank === 'Elite' });
  u.maxHp = def.hp; u.hp = def.hp; u.ac = def.ac; u.sr = def.sr; u.range = def.range || 1;
  u.atk = Object.assign({}, def.atk); u.ab = def.ab || null; u.as = 0; u.cr = 0; u.rollB = 0; u.dieUp = 0; u.flat = def.atk.flat || 0; u.pen = 0; u.spen = 0; u.regen = 0;
  u.atkIvBase = def.atk.iv; u.ratio = 1; u.job = def.ab ? (def.ab.job || 'time') : 'none'; u.cAtk = def.ab && def.ab.perAtk || 0; u.cHit = 0; u.cTime = def.ab ? def.ab.iv : 99; u.stats = { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 }; u.m = () => 0; u.maxCharge = 100; u.keyMod = def.keyMod || 0;
  return u;
}

function startUnit(F, u) {
  u.charge = Math.min(u.maxCharge, (u.sc || 0) + (u.side === 'H' ? Math.min(RULES.charge.chaStartChargeMax, Math.max(0, RULES.charge.chaStartChargePerModifier * u.m('CHA'))) : 0));
  u.atkT = atkIv(u) * 0.5;
  if (u.side === 'H') {
    if (u.it.boots_elvenkind || u.it.glamoured) u.st.stealth = 2.5;
    if (u.it.displacement) u.counters.displace = 2;
    if (u.it.ring_evasion) u.counters.evasion = 1;
    if (u.def.onStart) u.def.onStart(F, u);
  } else if (u.def.onStart) u.def.onStart(F, u);
  if (u.side === 'H' && F.campWard) addWard(F, u, u, rollDice(4, 10) + u.m('CON'), false);
}

// ---------------- helpers ----------------
const alive = F => F.units.filter(u => u.alive);
const foesOf = (F, u) => F.units.filter(o => o.alive && o.side !== u.side);
const alliesOf = (F, u, inclSummon) => F.units.filter(o => o.alive && o.side === u.side && (inclSummon || !o.summon));
function targetable(F, u, o) { if (!o.alive || o.side === u.side) return false; if (o.st.stealth > 0) return false; if (o.st.dark > 0 && u.range > 1) return false; if (o.untargetable) return false; return true; }
const tfoes = (F, u) => F.units.filter(o => targetable(F, u, o));
function nearest(list, u) { let b = null, bd = 1e9; for (const o of list) { const dd = dist(u, o) * 10 + o.y * 0.01; if (dd < bd) { bd = dd; b = o; } } return b; }
const pct = u => u.hp / u.maxHp;
function lowestPct(list) { let b = null; for (const o of list) if (!b || pct(o) < pct(b)) b = o; return b; }
function lowestHp(list) { let b = null; for (const o of list) if (!b || o.hp < b.hp) b = o; return b; }
function highestHp(list) { let b = null; for (const o of list) if (!b || o.hp > b.hp) b = o; return b; }
function unitAt(F, x, y) { return F.units.find(u => u.alive && u.x === x && u.y === y); }
function passable(F, x, y) { if (!inb(x, y)) return false; const t = F.terr[y][x]; return !(t === 'wall' || t === 'chasm' || t === 'forge' || t === 'gate' || t === 'rock'); }
function free(F, x, y) { return passable(F, x, y) && !unitAt(F, x, y); }
function freeCellNear(F, x, y, side, maxR = 3) {
  for (let r = 0; r <= maxR; r++) {
    const c = [];
    for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) if (Math.max(Math.abs(dx), Math.abs(dy)) === r && free(F, x + dx, y + dy)) c.push({ x: x + dx, y: y + dy });
    if (c.length) { c.sort((a, b) => (side === 'E' ? b.x - a.x : a.x - b.x) || a.y - b.y); return c[0]; }
  }
  return null;
}
function adjUnits(F, c, side) { return F.units.filter(o => o.alive && (!side || o.side === side) && o !== c && dist(o, c) === 1); }
function los(F, a, b) {
  const steps = Math.max(Math.abs(b.x - a.x), Math.abs(b.y - a.y)) * 4;
  for (let i = 1; i < steps; i++) {
    const fx = a.x + (b.x - a.x) * i / steps, fy = a.y + (b.y - a.y) * i / steps;
    const cx = Math.round(fx), cy = Math.round(fy);
    if ((cx === a.x && cy === a.y) || (cx === b.x && cy === b.y)) continue;
    if (inb(cx, cy) && F.terr[cy][cx] === 'wall') return false;
  }
  return true;
}
function rangeOf(F, u) { return u.range + (inb(u.x, u.y) && F.terr[u.y][u.x] === 'tower' ? 1 : 0); }
function canHit(F, u, t, from) { const p = from || u; const r = rangeOf(F, u); if (dist(p, t) > r) return false; if (r > 1 && !los(F, p, t)) return false; return true; }
function moveTo(F, u, x, y) {
  u.x = x; u.y = y;
  if (u.side === 'H' && F.terr[y][x] === 'web' && !(u.counters.webCd > F.t)) { u.counters.webCd = F.t + 2.5; applyControl(F, null, u, 'root', 1); }
}
function fx(F, u, text, color, big) { if (!F.headless && u) F.fx.push({ x: u.x, y: u.y, text, color, big: !!big, t: 0, id: Math.random() }); }
function logF(F, s) { if (!F.headless) { F.log.push(`[${F.t.toFixed(1)}s] ${s}`); if (F.log.length > 200) F.log.shift(); } }

// ---------------- statuses ----------------
function applyControl(F, src, t, kind, dur, extra) {
  if (!t.alive) return false;
  if (t.def && t.def.immune && t.def.immune.includes(kind)) return false;
  if (t.boss) dur *= RULES.statuses.bossControlShare;
  if (src && t.side !== src.side && RULES.resistance.controlReadsSr) dur *= (1 - resist(t.sr));
  if (kind === 'stun') { if (t.st.stunImm > 0) return false; t.st.stun = Math.max(t.st.stun, dur); t.st.stunImm = dur + RULES.statuses.stunImmunityAfter; if (t.casting) { t.casting = false; t.charge = Math.max(t.charge, t.maxCharge * RULES.charge.refundShare); } fx(F, t, 'stun', '#ffd75e'); }
  else if (kind === 'root') { t.st.root = Math.max(t.st.root, dur); }
  else if (kind === 'taunt') { t.st.taunt = dur; t.st.tauntSrc = src; t.target = src; }
  else if (kind === 'slow') { if (extra >= t.st.slow || t.st.slowT <= 0) { t.st.slow = extra; t.st.slowT = dur; } else t.st.slowT = Math.max(t.st.slowT, dur); }
  if (src && src.side === 'H') src.stat.ctrl = (src.stat.ctrl || 0) + dur;
  return true;
}
const controlled = t => t.st.root > 0 || t.st.stun > 0 || t.st.taunt > 0 || t.st.slowT > 0;
function addPoison(F, src, t, v) { if (!t.alive || v <= 0) return; t.st.poison += v; t.st.poisonSrc = src; }
function addBurn(F, src, t, v) { if (!t.alive || v <= 0) return; t.st.burn = v; t.st.burnT = RULES.statuses.burnSeconds; t.st.burnSrc = src; }
function addWard(F, src, t, amt, replaceIfBigger = true) {
  amt = Math.max(0, Math.round(amt)); if (!t.alive) return;
  if (replaceIfBigger) { if (amt > t.ward) { const gain = amt - t.ward; t.ward = amt; t.wardAbs = 0; t.wardSrc = src; if (src) src.stat.ward += gain; } }
  else { t.ward += amt; t.wardSrc = src; if (src) src.stat.ward += amt; }
  ev(F, { k: 'ward', t, v: amt });
}
function heal(F, src, t, amt) {
  if (!t.alive || amt <= 0) return 0; amt = Math.round(amt);
  if (src && src.side === 'H' && src.it && src.it.holy_symbol && src !== t) amt += d(8);
  if (t.rageBar > 0) { t.rageBar += amt; if (src) src.stat.heal += amt; return amt; }
  const real = Math.min(amt, t.maxHp - t.hp); t.hp += real; if (src) src.stat.heal += real;
  if (real > 0) ev(F, { k: 'heal', s: src, t, v: real });
  return real;
}

// ---------------- damage ----------------
function dealDamage(F, src, t, raw, type, o = {}) {
  if (!t || !t.alive || raw <= 0) return 0;
  raw = Math.round(raw);
  if (t.st.bond > 0 && t.bondBy && t.bondBy !== t && t.bondBy.alive && t.bondBy.t2 === 1 && raw >= t.bondBy.def.cfg.t2.protectiveBond.redirectHitsOf && src && src.side !== t.side) t = t.bondBy;
  if (src && src !== t) t.lastHitBy = src;
  if (o.attack) {
    if (t.st.dodge > 0) { t.dodged = (t.dodged || 0) + 1; hitCharge(t); ev(F, { k: 'dodge', t }); return 0; }
    if (t.counters.displace > 0) { t.counters.displace--; hitCharge(t); ev(F, { k: 'dodge', t }); return 0; }
  }
  if (o.ability && src && src.side !== t.side && t.counters.evasion > 0) { t.counters.evasion--; raw = Math.floor(raw / 2); }
  if (t.st.invuln > 0) return 0;
  let R = 0;
  if (type === 'phys') R = t.ac - (src ? src.pen || 0 : 0);
  else if (type === 'magic') R = t.sr - (src ? src.spen || 0 : 0);
  let amt = (type === 'radiant' || type === 'true') ? raw : Math.max(RULES.resistance.minimumDamage, Math.round(raw * (1 - resist(R))));
  if (o.self) amt = raw;
  if (t.formHp > 0) { const a = Math.min(t.formHp, amt); t.formHp -= a; amt -= a; if (t.formHp <= 0) endForm(F, t); }
  if (!o.dot) hitCharge(t);
  if (t.side === 'H' || t.def.rageOnHit) onHitTaken(F, t, src, raw);
  let absorbed = 0;
  if (t.ward > 0 && amt > 0) { absorbed = Math.min(t.ward, amt); t.ward -= absorbed; amt -= absorbed; t.wardAbs += absorbed; onWardAbsorb(F, t, absorbed); if (t.ward <= 0) onWardBreak(F, t); }
  if (src && src !== t) { src.stat.dmg += amt + absorbed; if (o.ability) src.stat.abDmg += amt + absorbed; }
  t.stat.taken += amt + absorbed;
  if (amt > 0) {
    if (t.rageBar > 0) { t.rageBar -= amt; if (t.rageBar <= 0) { t.rageBar = 0; die(F, t, src, type); } }
    else {
      t.hp -= amt;
      if (t.hp <= 0) {
        if (t.side === 'H' && !t.summon && t.def.rageBar && t.t2 != null && !t.rageCashed) { t.hp = 0; startRageBar(F, t); }
        else if (t.side === 'H' && !t.summon && !t.lastStand && t.def.lastStand) { t.lastStand = true; t.hp = 1; t.st.invuln = RULES.statuses.lastStandSeconds + (t.it.periapt ? 0.5 : 0); fx(F, t, 'Last Stand', '#ffd75e'); logF(F, `${t.name} makes a Last Stand.`); if (t.counters.halfFired === undefined) fireHalf(F, t); }
        else { t.hp = 0; die(F, t, src, type); }
      } else if (t.side === 'H' && !t.summon && t.hp < t.maxHp / 2 && !t.counters.halfFired) fireHalf(F, t);
    }
  }
  if (amt + absorbed > 0) ev(F, { k: 'hit', s: src, t, v: amt + absorbed });
  if (src && src !== t && t.alive === false && src.alive) onKill(F, src, t, type);
  return amt + absorbed;
}
function addCharge(u, amt) { if (!u.ab || u.st.stun > 0 || u.casting) return; const m = (1 + (u.cr || 0)) * (u.encore > 0 && u.st.inspired > 0 ? 1 + u.encore : 1); u.charge = Math.min(u.maxCharge, u.charge + amt * m); }
function hitCharge(t) { if (t.job === 'hit') addCharge(t, t.cHit); }
function ev(F, e) { if (!F.headless) { e.t0 = F.t; F.ev.push(e); } }
function fireHalf(F, t) {
  t.counters.halfFired = true;
  for (const k of ['potion', 'potion_greater', 'potion_superior']) if (t.it[k] && !t.counters['used_' + k]) { const it = ITEMS[k]; t.counters['used_' + k] = 1; heal(F, t, t, rollDice(it.potion[0], it.potion[1]) + it.potion[2]); break; }
  if (t.def.onHalf) t.def.onHalf(F, t);
  for (const a of alliesOf(F, t)) { if (a.def.onAllyHalf) a.def.onAllyHalf(F, a, t); if (a.gk.has('Channel Divinity') && !a.counters.gcd) { a.counters.gcd = 1; heal(F, a, t, rollDice(2, 8) + a.m('WIS')); } }
}
function die(F, t, src, type) {
  ev(F, { k: 'die', t }); t.alive = false; t.killedBy = src ? src.name : (t.lastHitBy ? t.lastHitBy.name : 'effects'); t.diedAt = F.t;
  logF(F, `${t.name} falls${src ? ' to ' + src.name : ''}.`);
  if (t.def.onDeath) t.def.onDeath(F, t, src, type);
  if (t.side === 'E') {
    if (t.gilded) { F.gold++; fx(F, t, '+1g', '#ffd75e'); onGoldDrop(F); }
    for (const h of F.units) if (h.alive && h.hexT === t) { h.hexT = null; if (h.def.onHexDeath) h.def.onHexDeath(F, h, t); }
    for (const h of F.units) if (h.alive && h.markT === t) { h.markT = null; h.counters.markJump = true; }
  }
  if (t.onGone) t.onGone(F, t, true);
}
function onGoldDrop(F) { for (const h of F.units) if (h.alive && h.id === 'gains' && h.t2 != null) { const g = h.def.cfg.t2; h.charge = Math.min(h.maxCharge, h.charge + g.chargePerGoldDrop); if (h.t2 === 1) for (const a of alliesOf(F, h)) if (a !== h) a.charge = Math.min(a.maxCharge, a.charge + g.liquidAssets.allyCharge); } }
function onKill(F, u, t, type) {
  if (u.def.onKill) u.def.onKill(F, u, t, type);
  if (t.side === 'E' && t.pickpocket) { F.gold++; fx(F, t, '+1g', '#ffd75e'); onGoldDrop(F); }
}
function onHitTaken(F, t, src, raw) {
  if (t.gk && (t.gk.has('Rage') || (t.def.kwRage && t.t2 != null))) { const cap = ((t.def.cfg && t.def.cfg.t2 && t.def.cfg.t2.rageCapBase) || 2) + t.tier; if ((t.rage || 0) < cap) { t.rage = (t.rage || 0) + 1; if (t.def.onRage) t.def.onRage(F, t); } }
  if (t.def.onHitTaken) t.def.onHitTaken(F, t, src, raw);
  if (src && t.formThorns) { const th = t.formThorns; dealDamage(F, t, src, rollDice(th.n, th.x) + th.flat, 'phys', {}); }
}
function onWardAbsorb(F, t, a) { const s = t.wardSrc; if (s && s.alive && s.def.onWardAbsorb) s.def.onWardAbsorb(F, s, t, a); }
function onWardBreak(F, t) { if (t.def.onWardBreak) t.def.onWardBreak(F, t); }
function startRageBar(F, t) {
  t.rageCashed = true; const r = Math.max(1, t.rage || 0);
  const RB = t.def.cfg.t2, rb = RB.rageBar, rd = parseDice(rb.dicePerRage);
  let bar = 0; for (let i = 0; i < r; i++) bar += rollDice(rd.n * (rb.perTier ? t.tier : 1), rd.x) + t.m(rb.bonus);
  if (t.t2 === 0) bar = Math.round(bar * RB.unbreakable.barMultiplier);
  t.rageBar = bar; t.rageBar0 = bar; t.as += rb.attackSpeed; t.ward = 0; t.st.invuln = 0.3;
  fx(F, t, 'RAGE', '#ff6b4d', true); logF(F, `${t.name} refuses to fall: Rage bar ${bar}.`);
}
function endForm(F, t) { t.formHp = 0; t.form = null; t.formThorns = false; t.formAs = 0; t.formHealPounce = false; }

// ---------------- the d20 ability roll ----------------
function abilityRoll(F, u) {
  let adv = !!u.advNext || !!u.def.abAdv || !!(u.it && u.it.ioun_mastery);
  if (u.firstBlood && !u.counters.fbUsed) { adv = true; u.counters.fbUsed = 1; }
  u.advNext = false;
  let dis = u.st.root > 0 || (u.hexedBy && u.hexedBy.alive);
  if (u.boss && (adv || dis)) { u.counters.halfToggle = !u.counters.halfToggle; if (!u.counters.halfToggle) { adv = false; dis = false; } }
  const a = d(20), b = d(20);
  let nat = a; if (adv && !dis) nat = Math.max(a, b); else if (dis && !adv) nat = Math.min(a, b);
  const r = { nat, xd: 0, crit: false, fizzle: false, adv: adv && !dis, dis: dis && !adv };
  if (nat === 1) { r.fizzle = true; return r; }
  let bonus = (u.side === 'H' ? u.m(u.key) : u.keyMod) + (u.rollB || 0);
  if (u.inspireDie) { bonus += d(u.inspireDie); u.inspireDie = 0; }
  if (u.st.bond > 0) bonus += d(4);
  if (u.mote && u.mote.d20) bonus += d(6);
  if (u.id === 'gains' && u.t2 === 0) { const ci = u.def.cfg.t2.compoundInterest; bonus += Math.min(ci.max, ci.rollBonusPer10Gold * Math.floor((F.runGold || 0) / 10)); }
  r.total = nat + bonus;
  r.band = nat === 20 ? 'High' : r.total <= RULES.abilityRoll.lowAtOrBelow ? 'Low' : r.total >= RULES.abilityRoll.highAtOrAbove ? 'High' : 'Mid';
  r.crit = nat === 20;
  if (u.side === 'H' && F.terr && nearTerr(F, u, 'forge')) r.xd += 1;
  if (u.gk.has('Ki') && u.ki > 0) { r.xd += u.ki; u.ki = 0; }
  if (u.def.kwKi && u.t2 != null && u.ki > 0) { r.kiSpent = u.ki; r.xd += u.ki; u.ki = 0; }
  return r;
}
function nearTerr(F, u, kind) { for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const x = u.x + dx, y = u.y + dy; if (inb(x, y) && F.terr[y][x] === kind) return true; } return false; }
function abHit(F, u, t, n, x, flat, type, r, o = {}) {
  if (!t || !t.alive) return 0;
  let nn = n; if (!r.xdUsed) { nn += r.xd; r.xdUsed = true; }
  const crit = r.crit || !!o.crit;
  let amt = rollDice(nn, x, crit, u.empower) + (flat || 0);
  if (u.mote && !o.noMote) { amt += rollDice(u.mote.n, u.mote.x || 8, crit) + u.mote.flat; motePop(F, u, r); u.mote = null; }
  if (u.st.stealth > 0 || u.stealthStrike) { u.st.stealth = 0; u.stealthStrike = false; }
  const dmg = dealDamage(F, u, t, amt, type, { ability: true, crit, area: o.area });
  if (!o.area) itemOnHit(F, u, t, crit);
  return dmg;
}
function motePop(F, u, r) { const toot = u.mote && u.mote.src; if (toot && toot.alive && toot.t2 === 1 && r.band === 'High') { F.gold++; fx(F, u, '+1g', '#ffd75e'); onGoldDrop(F); } }

// ---------------- basic attacks ----------------
function atkIv(u) {
  let as = u.as + (u.st.inspired > 0 ? (u.inspAs || 0) : 0) + (u.st.hasteT > 0 ? u.st.haste : 0) + (u.formAs || 0);
  let iv = u.atkIvBase / (1 + u.ratio * as);
  const sl = Math.max(u.st.slowT > 0 ? u.st.slow : 0, u.st.root > 0 ? (SETTINGS.restrain || 0) : 0); // Restrained: also slows attacks
  if (sl > 0) iv /= Math.max(0.2, 1 - sl);
  if (u.boss && u.enraged) iv *= u.def.enrageMult;
  if (u.side === 'E' && u.F && u.F.units.some(o => o !== u && o.alive && o.side === 'E' && o.def.pack && dist(o, u) === 1)) iv /= 1 + u.F.units.find(o => o !== u && o.alive && o.side === 'E' && o.def.pack && dist(o, u) === 1).def.packAttackSpeed;
  return Math.max(0.3, iv);
}
function basicAttack(F, u, t) {
  const a = u.atk; const strikes = u.def.strikesVs ? u.def.strikesVs(F, u, t) : (a.strikes || 1);
  if (u.st.stealth > 0) { u.st.stealth = 0; u.stealthStrike = true; }
  for (let i = 0; i < strikes; i++) { if (!t.alive) break; strike(F, u, t, {}); }
  if (u.def.onAttack) u.def.onAttack(F, u, t);
  if (u.job === 'attack') addCharge(u, u.cAtk);
  if (u.gk.has('Action Surge') || (u.it && u.it.bm_gauntlet)) { u.counters.gas = (u.counters.gas || 0) + 1; const every = u.it.bm_gauntlet && !u.gk.has('Action Surge') ? 4 : (u.it.bm_gauntlet ? 4 : 5); if (u.counters.gas % every === 0 && t.alive) { strike(F, u, t, {}); } }
  if (u.it && u.it.arachnida && t.alive) addPoison(F, u, t, 1);
}
function strike(F, u, t, o) {
  const a = u.atk; const melee = u.range <= 1;
  let crit = !!o.crit || !!u.stealthStrike || (melee && t.st.stun > 0);
  u.stealthStrike = false;
  let n = (a.n || 1) * (a.tierDice ? u.tier : 1); let x = upDie(a.x, u.dieUp);
  if (a.woundedX && t.hp < t.maxHp) x = a.woundedX;
  let flat = (a.stat ? (a.half ? Math.floor(u.m(a.stat) / 2) : u.m(a.stat)) : 0) + (a.flat || 0) + (u.flat || 0);
  if (u.side === 'E') flat = a.flat || 0;
  let amt = rollDice(n, x, crit) + flat;
  if (u.whet > 0) { amt += rollDice(u.whetN || u.tier, 6, crit); u.whet--; }
  amt += hitRiders(F, u, t, crit, melee);
  const type = a.type || 'phys';
  const dmg = dealDamage(F, u, t, amt, type, { attack: true, crit, melee });
  if (u.def.splash) for (const o of adjUnits(F, t, t.side)) dealDamage(F, u, o, rollDice(n, x, false) + flat, type, { area: true });
  itemOnHit(F, u, t, crit);
  if (u.def.onStrike) u.def.onStrike(F, u, t, dmg, crit);
  if (u.formHealPounce && dmg > 0) { const a2 = lowestPct(alliesOf(F, u)); if (a2) heal(F, u, a2, Math.floor(dmg * u.formHealPounce)); }
  return dmg;
}
function hitRiders(F, u, t, crit, melee) {
  let extra = 0;
  if (u.side !== 'H') return 0;
  if (u.hexT === t) extra += rollDice(1, 6, crit);
  if (u.markT === t) extra += rollDice(1, u.markDie || 6, crit) + (u.markFlat || 0);
  if (u.gk.has('Hex') && !u.def.kwHex) { if (!u.hexT || !u.hexT.alive) { u.hexT = t; t.hexedBy = u; } }
  if (u.gk.has("Hunter's Mark") && !u.def.kwMark) { if (!u.markT || !u.markT.alive) { u.markT = t; u.markDie = 6; } }
  if (u.it && u.it.hunters_quiver && u.target === t) extra += rollDice(1, 4, crit);
  if (melee && (u.gk.has('Smite') || (u.it && u.it.devotion_brand))) { u.counters.gsm = (u.counters.gsm || 0) + 1; if (u.counters.gsm % 3 === 0) { dealDamage(F, u, t, rollDice(2, 8, crit), 'radiant', { crit }); } }
  if ((u.gk.has('Sneak Attack') || (u.it && u.it.cutpurse_cloak)) && controlled(t) && !(u.counters.gsa > F.t)) { u.counters.gsa = F.t + 3; dealDamage(F, u, t, rollDice(2, 6, crit), 'phys', { crit }); }
  if (u.gk.has('Ki') && !u.def.kwKi) u.ki = Math.min(4, (u.ki || 0) + 1);
  return extra;
}
function itemOnHit(F, u, t, crit) {
  for (const oh of u.onHitItems) { if (!t.alive) break; dealDamage(F, u, t, rollDice(oh.n, oh.x, crit) + (oh.flat || 0), oh.type, { onhit: true }); if (oh.slow) applyControl(F, u, t, 'slow', 1, oh.slow); if (oh.heal) heal(F, u, u, oh.heal); }
}

// ---------------- movement (BFS) ----------------
function stepToward(F, u, t) {
  if (u.st.root > 0 || u.st.stun > 0 || u.noMove) return false;
  const key = (x, y) => y * COLS + x;
  const start = key(u.x, u.y); const prev = new Map([[start, -1]]); const q = [[u.x, u.y]]; let goal = null;
  const isGoal = (x, y) => canHit(F, u, t, { x, y });
  while (q.length) {
    const [x, y] = q.shift();
    if (!(x === u.x && y === u.y) && isGoal(x, y)) { goal = [x, y]; break; }
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]) {
      const nx = x + dx, ny = y + dy; const k = key(nx, ny);
      if (prev.has(k) || !free(F, nx, ny)) continue;
      prev.set(k, key(x, y)); q.push([nx, ny]);
    }
  }
  let next = null;
  if (goal) { let k = key(goal[0], goal[1]); while (prev.get(k) !== start) k = prev.get(k); next = { x: k % COLS, y: Math.floor(k / COLS) }; }
  else {
    let best = null, bd = dist(u, t);
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]) { const nx = u.x + dx, ny = u.y + dy; if (free(F, nx, ny)) { const dd = Math.max(Math.abs(nx - t.x), Math.abs(ny - t.y)); if (dd < bd) { bd = dd; best = { x: nx, y: ny }; } } }
    next = best;
  }
  if (!next) return false;
  moveTo(F, u, next.x, next.y); return true;
}

function acquire(F, u) {
  if (u.st.taunt > 0 && u.st.tauntSrc && u.st.tauntSrc.alive && targetable(F, u, u.st.tauntSrc)) return u.st.tauntSrc;
  if (u.lockT && u.lockT.alive && targetable(F, u, u.lockT)) return u.lockT;
  const list = tfoes(F, u); if (!list.length) return null;
  if (u.target && u.target.alive && targetable(F, u, u.target) && canHit(F, u, u.target)) return u.target;
  const inReach = list.filter(o => canHit(F, u, o));
  return nearest(inReach.length ? inReach : list, u);
}

// ---------------- main tick ----------------
function stepFight(F) {
  if (F.over) return;
  F.t += DT;
  if (F.flood && !F.flood.done && F.t >= F.flood.t) {
    F.flood.done = true; F.floodFx = 1.2;
    for (const u of alive(F)) if (u.y === F.flood.row) { for (let i = 0; i < 2; i++) if (free(F, u.x - 1, u.y)) moveTo(F, u, u.x - 1, u.y); }
  }
  if (F.floodFx > 0) F.floodFx -= DT;
  for (const u of F.units.slice()) if (u.alive) tickUnit(F, u);
  for (const e of F.fx) e.t += DT; F.fx = F.fx.filter(e => e.t < 1.1);
  const h = F.units.some(u => u.alive && u.side === 'H' && !u.summon), e = F.units.some(u => u.alive && u.side === 'E');
  if (!e) end(F, 'win'); else if (!h) end(F, 'loss'); else if (F.t >= FIGHT_TIMEOUT) { end(F, 'loss'); }
}
function end(F, res) { F.over = true; F.result = res; }

function tickUnit(F, u) {
  const S = u.st;
  for (const k of ['root', 'stun', 'stunImm', 'taunt', 'stealth', 'invuln', 'dodge', 'dark', 'inspired', 'bond', 'hasteT']) if (S[k] > 0) S[k] -= DT;
  if (S.slowT > 0) S.slowT -= DT;
  if (S.burnT > 0) S.burnT -= DT;
  if (u.life !== undefined) { u.life -= DT; if (u.life <= 0) { u.alive = false; if (u.onGone) u.onGone(F, u, false); return; } }
  if (u.formT > 0) { u.formT -= DT; if (u.formT <= 0) endForm(F, u); }
  if (u.rageBar > 0) { u.rageBar -= u.rageBar0 * (u.t2 === 0 ? u.def.cfg.t2.unbreakable.drainPerSecond : u.def.cfg.t2.avalanche.drainPerSecond) * DT; if (u.rageBar <= 0) { u.rageBar = 0; die(F, u, null); return; } }
  u.dotT += DT;
  if (u.dotT >= 1) {
    u.dotT -= 1;
    if (S.burnT > 0 && S.burn > 0) dealDamage(F, S.burnSrc, u, S.burn, 'magic', { dot: 'burn' });
    if (u.alive && S.poison > 0) { dealDamage(F, S.poisonSrc, u, S.poison, 'magic', { dot: 'poison' }); S.poison = Math.max(0, S.poison - 1); }
    if (u.alive) { let rg = u.regen || 0; if (u.rage > 0) { let per = Math.max(1, Math.floor(u.m('CON') / 2)); if (u.id === 'zark' && u.t2 === 0) per *= u.def.cfg.t2.bearTotem.regenMultiplier; if (u.gk.has('Rage') || u.id === 'zark') rg += per * u.rage; } if (rg > 0 && u.hp < u.maxHp) heal(F, u, u, rg); }
    if (u.def.perSecond && u.alive) u.def.perSecond(F, u);
  }
  if (!u.alive) return;
  for (const p of u.pend.slice()) { p.t -= DT; if (p.t <= 0) { const done = p.fn(F, u); if (done !== false || p.t < -4) u.pend.splice(u.pend.indexOf(p), 1); } }
  if (u.def.tick) u.def.tick(F, u);
  if (u.def.inert) return;
  if (S.stun > 0) return;
  if (u.ab && !u.casting && u.job === 'time') {
    const intMod = u.side === 'H' ? u.m('INT') : 0;
    addCharge(u, (100 / u.cTime) * Math.max(0.5, 1 + RULES.charge.casterIntPerModifier * intMod) * DT);
  }
  if (u.casting) { u.castT -= DT; if (u.castT <= 0) { u.casting = false; resolveCast(F, u); } return; }
  if (u.ab && u.charge >= u.maxCharge && F.t - u.lastCast >= RULES.charge.minSecondsBetweenCasts && (!u.ab.can || u.ab.can(F, u))) {
    u.charge = 0; u.lastCast = F.t; if (S.stealth > 0 && !u.ab.keepStealth) { S.stealth = 0; u.stealthStrike = true; }
    const ct = u.quick ? 0 : (u.ab.ct || 0);
    if (ct > 0) { u.casting = true; u.castT = ct; u.castT0 = ct; } else resolveCast(F, u);
    return;
  }
  if (u.atk.pulse) {
    u.atkT -= DT; if (u.atkT <= 0) { u.atkT = atkIv(u); const hits = foesOf(F, u).filter(o => dist(o, u) <= 1); for (const o of hits) dealDamage(F, u, o, rollDice((u.atk.n || 1) * (u.atk.tierDice ? u.tier : 1), u.atk.x), u.atk.type || 'magic', { attack: true, area: true }); if (hits.length) ev(F, { k: 'pulse', u }); }
    return;
  }
  const t = acquire(F, u); u.target = t;
  if (!t) return;
  if (canHit(F, u, t)) {
    u.atkT -= DT;
    if (u.atkT <= 0) { u.atkT = atkIv(u); basicAttack(F, u, t); }
  } else {
    u.moveT -= DT;
    if (u.moveT <= 0) { const sp = (u.def.move || 0.5) / Math.max(0.2, S.slowT > 0 ? 1 - S.slow : 1); u.moveT = sp; stepToward(F, u, t); }
  }
}

function resolveCast(F, u) {
  const r = abilityRoll(F, u);
  u.atkT = atkIv(u);
  ev(F, { k: 'd20', u, nat: r.nat });
  if (r.fizzle) { u.charge = u.maxCharge * RULES.charge.refundShare; u.fizzles = (u.fizzles || 0) + 1; return; }
  u.casts = (u.casts || 0) + 1;
  if (u.mote && !u.def.dmgAb) { const t = acquire(F, u) || nearest(tfoes(F, u), u); if (t) { dealDamage(F, u, t, rollDice(u.mote.n, u.mote.x || 8, r.crit) + u.mote.flat, 'magic', { ability: true, crit: r.crit }); motePop(F, u, r); } u.mote = null; }
  u.ab.cast(F, u, r);
  if (u.mote && r) u.mote = null;
  if (u.gk.has('Arcane Recovery') || (u.it && u.it.grimoire)) u.charge = Math.min(u.maxCharge, u.charge + 15);
  if (u.gk.has('Bardic Inspiration') || (u.it && u.it.bard_instrument)) { const a = nearest(alliesOf(F, u).filter(o => o !== u && o.ab), u); if (a) a.inspireDie = 6; }
  if (u.side === 'H') for (const a of alliesOf(F, u)) if (a.def.onAllyCast) a.def.onAllyCast(F, a, u, r);
}

// ---------------- summons ----------------
function summonDouble(F, src, ally, life, hpShare = 0.2) {
  const c = freeCellNear(F, ally.x, ally.y, 'H', 2); if (!c) return null;
  const dbl = Object.assign(baseUnit(), { side: 'H', def: ally.def, id: ally.id, name: ally.name + "'s Double", summon: true, isDouble: true, tier: ally.tier, x: c.x, y: c.y, life });
  dbl.stats = Object.assign({}, ally.stats); dbl.m = k => mod(dbl.stats[k]); dbl.ac = ally.ac; dbl.sr = ally.sr; dbl.as = ally.as; dbl.cr = 0; dbl.rollB = 0; dbl.dieUp = ally.dieUp; dbl.flat = ally.flat; dbl.pen = ally.pen; dbl.spen = 0; dbl.regen = 0;
  dbl.range = ally.range; dbl.atk = Object.assign({}, ally.atk); dbl.ab = null; dbl.atkIvBase = ally.atkIvBase; dbl.ratio = ally.ratio; dbl.key = ally.key;
  dbl.maxCharge = 100; dbl.maxHp = Math.max(5, Math.floor(ally.maxHp * hpShare)); dbl.hp = dbl.maxHp; dbl.lastStand = true; dbl.atkT = 0.3; dbl.onHitItems = [];
  addUnit(F, dbl);
  return dbl;
}
