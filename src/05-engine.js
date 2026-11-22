/* ================= 0.22 COMBAT ENGINE (NO DOM; RUNS IN BROWSER & NODE) =================
   Six-Attribute Rework (Linear Scaling):
     STR: Melee weapon damage + flat Armor Penetration (+1 AC ignored per STR) + Intercept at STR >= 3
     DEX: Linear Attack Speed (+6%/DEX if weapon attr, +4%/DEX otherwise) + DEX weapon damage + AC
     CON: Max HP (+18/CON × tier) + HP regen + poison resistance
     INT: Charge Speed (+10% linear per positive INT on passive & trigger charge)
     WIS: Spell Resistance (+1 SR/WIS) + minimum natural d20 roll floor (1 + WIS, capped at 10)
     CHA: Commanding Presence (+8% linear potency/duration on buffs, debuffs, Inspiration, Wards)
   Dual-Attribute Split:
     pair: [weaponAttr, keyAttr]. d20 High-roll scaling is decoupled from INT and driven by keyAttr.
   Global Cast Speed Cap:
     MIN_CAST_INTERVAL = 1.0s. No hero ability fires more than once per second via Charge.
*/

const TIERX = { hp: 1.45, dmg: 1.3 };
const MITIGATE_K = 16; // Cubed AC/SR mitigation midpoint: DR(x) = x^3 / (x^3 + 16^3)
const ROLL_SHIFT = 3;
const COMBAT_TEMPO = 1.4; // Baseline hero movement/attack tempo so combat reads clearly and DEX/INT scaling shines
const ENEMY_TEMPO = 1.08; // Faster enemy attack & cast tempo to keep frontline pressure & sustain honest
const OT_START = 28, OT_STEP = 5, TIME_LIMIT = 110;
const CHARGE_TAKEN = 60;
const MIN_CAST_INTERVAL = 1.0; // Global 1-cast/second cap
const LARGE_AREA = 1.25, LARGE_HP = 1.5;
var KI_MAX = 4;

// Hero tier scaling via D&D Cantrip dice (1x / 2x / 3x / 4x base dice) instead of hidden u.dm multiplier
const diceMult = u => (u && u.side === 'P' && !u.minion ? Math.max(1, u.tier || 1) : 1);
const tierRoll = (u, n, s) => roll(n * diceMult(u), s);
const tierScale = u => (u && u.side === 'P' && !u.minion ? 1 + 0.55 * Math.max(0, (u.tier || 1) - 1) : (u ? u.dm : 1));

const isRadiant = o => !!(o && (o.kind === 'radiant' || o.kind === 'holy'));
const combineEvasion = (...vals) => {
  let rem = 1;
  for (const v of vals) if (v > 0) rem *= (1 - Math.min(0.9, v));
  return Math.min(0.85, Math.max(0, 1 - rem));
};

const STYLE = {
  caster:   { n: 'Caster',   ab: 1.3,  atk: .7,  cr: 1.25, x: 'Most damage comes from the ability.' },
  attacker: { n: 'Attacker', ab: .55,  atk: 1.2, cr: .7,   x: 'Most damage comes from steady attacks.' },
  striker:  { n: 'Striker',  ab: 1.25, atk: 1,   cr: 1, hid: 3, x: 'Ability charges faster from stealth.' }
};

const pairOf = d => d.pair || [d.prim, d.prim];
const TRIG_ROLE = { Tank: 'struck', Damage: 'striking', Support: 'watchful' };
const TRIG = {
  struck:   { n: 'Struck',   x: 'Gains Charge when taking damage.' },
  striking: { n: 'Striking', x: 'Gains Charge each time an attack lands.' },
  watchful: { n: 'Watchful', x: 'Gains Charge when allies in range take damage or are healed.' },
  reaper:   { n: 'Reaper',   x: 'Gains Charge when nearby foes die.' }
};
const CHG = { struck: 90, watchful: 55, reaper: 22 };
const atkOf = (d, f) => ({ ...d.atk, ...((f && f.atk) || {}) });

/* ---------- Six-Attribute Derived Stats (shared by engine and cards) ---------- */
function heroStats(cfg) {
  const d = H[cfg.key];
  const rawItems = cfg.items && cfg.items.length ? cfg.items : (cfg.item ? [cfg.item] : []);
  const it = rawItems.length ? combineItems(rawItems) : null;
  const tier = cfg.tier || 1;
  const path = cfg.path && tier >= 2 ? d.paths.find(p => p.k === cfg.path) : null;
  const boon = cfg.boon && tier >= 4 ? cfg.boon : null;
  const mc = cfg.multiclass && typeof MULTICLASS !== 'undefined' && MULTICLASS[cfg.multiclass] ? cfg.multiclass : null;
  const AB = (path && path.abil) || d.abil;
  const pr = pairOf(d);

  // Score calculation (+2 score = +1 modifier)
  const sc = { ...d.attr };
  if (it) Object.entries(it.a || {}).forEach(([k, v]) => sc[k] += v);
  if (path && path.attr) sc[path.attr] += 2; // Tier II Specialization attribute bump (if any)
  if (tier >= 3) sc[cfg.asi || pr[1]] += 4;  // Tier III ASI: +2 to chosen attribute
  if (cfg.train) Object.entries(cfg.train).forEach(([a, v]) => { sc[a] += 2 * v; });

  // Hero Quest permanent attribute rewards
  if (cfg.questDone) {
    if (cfg.key === 'faelan') sc.int += 2 * (cfg.questStacks || 0);                  // Owl Familiar: +1 INT per win
    if (cfg.key === 'lorcan') sc.dex += 2 * (cfg.questStacks || (cfg.questTrophies || []).length); // Favoured Enemy: +1 DEX per Elite/Boss kill
    if (cfg.key === 'cinder') sc.cha += 2 * Math.min(6, Math.floor((cfg.goldHeld || 0) / 20)); // Dragon's Hoard: +1 CHA per 20g (cap +6)
    if (cfg.key === 'zark') sc.con += 2 * (cfg.questStacks || 0);                    // Relentless Hide: +1 CON per tough win
    if (cfg.key === 'pillar') sc.str += 6;                                           // Living Colossus: +3 STR (+ Large 2x2)
    if (cfg.key === 'velith') sc.dex += 2 * (cfg.questStacks || 0);                  // Death's Ledger: +1 DEX per 4 kills
  }

  const m = {};
  ATTRS.forEach(a => m[a] = modOf(sc[a]));
  const s = (it && it.s) || {};
  const f = { ...(d.f || {}), ...(path ? path.f : {}) };
  const hpx = Math.pow(TIERX.hp, tier - 1);
  const dm = 1; // Heroes scale visibly via tier dice (1x/2x/3x/4x), not a hidden u.dm multiplier
  const isLarge = (cfg.key === 'dane' || cfg.key === 'pillar') && cfg.questDone;

  // 1. STR: Melee Armor Penetration (+1 AC ignored per positive STR)
  const strPen = (d.rng <= 2 || d.atk.thrown) ? Math.max(0, m.str) : 0;
  // 2. DEX: Linear Attack Speed (+6%/DEX if weapon attr, +4%/DEX otherwise)
  const dexHaste = (pr[0] === 'dex' ? 6 : 4) * m.dex;
  // 3. CON: Linear Max HP (+18/CON) & regen
  const fortMult = boon === 'fortitude' ? 1.4 : 1;
  const baseMaxHp = Math.round((d.hp + 18 * m.con + (s.hp || 0)) * hpx * (isLarge ? LARGE_HP : 1) * fortMult);
  // 4. INT: Linear Charge Speed (+10% per positive INT)
  const intChargePct = Math.max(0, m.int) * 10;
  // 5. WIS: Spell Resistance (+1 SR/WIS) + Minimum Natural d20 Roll Floor (1 + WIS, cap 10)
  const d20Floor = Math.min(10, 1 + Math.max(0, m.wis));
  // 6. CHA: Commanding Presence (+8% linear potency/duration on buffs & debuffs)
  const chaPotency = +(1 + 0.08 * Math.max(0, m.cha)).toFixed(2);

  // Dual-Attribute Split: High-roll threshold shift driven by Key Attribute
  const mk = m[pr[1]];
  const hiShift = Math.floor(Math.max(0, mk) / 2);
  // Gilthrax Gilded Hoard: +2 AC per item (doubled for Rare/Very Rare/Legendary/Unique)
  const hoardAC = f.gildedHoard
    ? rawItems.reduce((sum, ik) => sum + ((ITEMS[ik] && ITEMS[ik].r >= 2) ? 4 : 2), 0)
    : 0;
  const interestBonus = f.compoundInterest ? Math.min(5, Math.floor((cfg.goldHeld || 0) / 10)) : 0;
  // Evasion: multiplicative combination of base/passive, Specialization, items, and Epic Boon
  const evasion = combineEvasion(
    f.baseEvasion || 0,
    f.specEvasion || 0,
    s.evasion || 0,
    boon === 'night_spirit' ? 0.25 : 0
  );

  const st = {
    sc, m, f, path, boon, mc, item: it, die: cfg.die || 'd20', tier, dm,
    sz: isLarge ? 2 : 1,
    maxHp: baseMaxHp,
    ac: d.ac + m.dex + (s.ac || 0) + hoardAC,
    sr: d.sr + m.wis + (s.sr || 0),
    evasion,
    ft: d.ft + (s.ft || 0),
    rng: d.rng + (s.rng || 0),
    dmgBonus: s.dmg || 0,
    regen: +((0.5 + 0.5 * Math.max(0, m.con) + (s.regen || 0)) * hpx).toFixed(2),
    haste: dexHaste + (f.haste || 0) + (s.haste || 0) + (boon === 'speed' ? 35 : 0),
    intChargePct,
    d20Floor,
    chaPotency,
    hiShift,
    asi: tier >= 3 ? (cfg.asi || pr[1]) : null,
    w: pr[0], k: pr[1], mw: m[pr[0]], mk,
    pen: strPen + (s.pen || 0),
    spen: s.spen || 0,
    pa: f.pa || AB.pa,
    questDone: !!cfg.questDone,
    questStacks: cfg.questStacks || 0,
    questTrophies: cfg.questTrophies || []
  };

  const A0 = atkOf(d, f);
  st.atk = A0;
  st.iv = +(A0.iv * COMBAT_TEMPO / Math.max(0.4, 1 + st.haste / 100)).toFixed(2);
  st.onHit = onHitList(d, st);
  st.hits = A0.hits || 1;
  st.style = (path && path.style) || d.style || null;
  const sty = STYLE[st.style] || {};
  st.abM = (sty.ab || 1) * (mc === 'Sorcerer' ? 1.2 : 1);
  st.atM = sty.atk || 1;
  st.hidCr = sty.hid || 1;
  st.role = (path && path.role) || d.role;
  st.abil = (cfg.key === 'arthur' && cfg.questDone)
    ? { ...AB, n: 'Gauntlet Blast', one: 'Frontline fire cone hitting nearest foes with Burn; High grants +25% Evasion, Nat 20 grants party +35% Evasion.' }
    : AB;

  const chgMult = 1 + (intChargePct + (s.crPct || 0) + (boon === 'speed' ? 25 : 0)) / 100;
  st.cr = (sty.cr || 1) * AB.cr * chgMult;
  st.chgX = chgMult;
  st.trig = (path && path.trig) || d.trig || TRIG_ROLE[st.role] || 'striking';

  // d20 Band Layout (Key Attribute adds to roll and shifts High band)
  st.rb = st.mk + (s.rollBonus || 0) + interestBonus;
  const cut = AB.cut;
  let hiStart = Math.min(19, cut[1] + 1 + ROLL_SHIFT - st.hiShift);
  hiStart = Math.max(cut[0] + ROLL_SHIFT + 2, hiStart);
  st.bands = { low: cut[0] + ROLL_SHIFT, hi: hiStart };
  return st;
}

/* Band probabilities accounting for WIS minimum d20 roll floor */
function bandOdds(d, st) {
  const o = [0, 0, 0, 0, 0];
  const floor = st.d20Floor || 1;
  const critAt = st.boon === 'fate' ? 19 : 20;
  for (let raw = 1; raw <= 20; raw++) {
    const n = Math.max(floor, raw);
    if (n === 1) { o[0]++; continue; }
    if (n >= critAt) { o[4]++; continue; }
    const v = Math.min(19, n + (st.rb || 0));
    o[v >= st.bands.hi ? 3 : v <= st.bands.low ? 1 : 2]++;
  }
  return o.map(x => x / 20);
}

function atkBonus(st, d) {
  const a = d.atk;
  if (a.heals) return st.mk;
  if (a.noDmg) return 0;
  const itemDmg = st.dmgBonus || 0;
  const melee = d.rng <= 2 || a.thrown;
  let v = st.mw;
  if (a.kind === 'phys' && !melee && st.w === 'str') v = 0; // Ranged physical never gets STR unless thrown
  return v + itemDmg;
}

function onHitList(d, st) {
  return [...(d.atk.onHit || []), ...((st.f && st.f.onHit) || []), ...((st.item && st.item.s && st.item.s.onHit) || [])];
}
function onHitText(e) {
  const dmg = e.d ? `${e.d[0]}d${e.d[1]}` : e.flat;
  const kd = (e.kind === 'radiant' || e.kind === 'holy') ? 'Radiant' : e.el || e.ty || (e.kind === 'magic' ? 'magic' : 'physical');
  if (e.t === 'bonus') return `+${dmg} ${kd}`;
  if (e.t === 'echo') return `${dmg} ${kd} a moment later`;
  return { burn: `Burn ${e.v}`, cold: `Freeze ${e.v}`, poison: `Poison ${e.v}/s`, lightning: `Charge ${e.v}`, acid: '−1 AC (Acid)', nec: `${e.v} necrosis` }[e.el] || e.el;
}

/* ---------- Units & Statuses ---------- */
const freshSt = () => ({
  necImm: 0, stun: 0, root: 0, taunt: 0, tauntBy: null,
  burn: 0, burnT: 0, frz: 0, chillT: 0, poison: 0, poisonAcc: 0, chg: 0,
  acid: 0, acidT: 0, acB: 0, acBT: 0, acS: 0, acST: 0,
  stag: 0, exp: 0, fear: 0, charm: 0,
  mark: null, markStacks: 0, hex: null, hexStacks: 0, hexJump: 0, hexSlow: 0,
  radHex: 0, radHexBy: null,
  cut: 0, vow: null, duelCrusade: 0, mockT: 0, srShred: 0, gilded: null
});

function mkHero(cfg, side = 'P') {
  const d = H[cfg.key];
  const st = heroStats(cfg);
  const atk = { ...d.atk, ...(st.f.atk || {}) };
  const u = {
    id: UID++, key: d.key, side, name: d.name, cls: d.cls, role: st.role,
    hidCr: st.hidCr, vet: 0, streak: 0, bounce: 0, verse: 0, reach: d.reach,
    c: cfg.c, r: cfg.r, sz: st.sz,
    maxHp: st.maxHp, hp: st.maxHp, ac: st.ac, sr: st.sr, evasion: st.evasion || 0,
    tempEvasion: 0, tempEvasionT: 0, partyEvasion: 0, partyEvasionT: 0,
    regen: st.regen, ward: 0, wardStored: 0, nec: 0,
    rng: st.rng, ft: st.ft, atk, abil: st.abil, iv: st.iv, dmgBonus: st.dmgBonus || 0,
    it: { ...((st.item && st.item.s) || {}) },
    cr: st.cr, pa: st.pa, charge: 0, t: Math.random() * .35, mt: 0,
    f: { ...st.f }, abM: st.abM, atM: st.atM, die: st.die, bands: st.bands,
    dm: st.dm, pen: st.pen, spen: st.spen, d20Floor: st.d20Floor, chaPotency: st.chaPotency,
    poisonX: (st.item && st.item.s && st.item.s.poisonX) || 1,
    bigArea: st.item && st.item.s && st.item.s.bigArea,
    chgX: st.chgX || 1,
    bon: { w: st.mw, k: st.mk, ranged: 0 },
    onHit: onHitList(d, st), thrown: d.atk.thrown, trig: st.trig,
    cha: st.m.cha, con: st.m.con, str: st.m.str, m: st.m,
    haste: 0, tempHaste: 0, tempHasteT: 0, permHaste: 0,
    rollBonus: st.rb, nextBonus: 0, advantage: 0,
    alert: 0, afterimage: 0, bearRage: 0, mcRage: 0, sorcery: 0, ki: 0, clauses: 0,
    zealotT: 0, radiantSoulT: 0, arcaneReflectT: 0, illusoryDouble: 0, beast: null, wildShapeT: 0,
    bonded: null, bondDie: 0, bondChargeShare: 0,
    inspDie: null, inspMote: null, _cdUsed: 0, _shieldHits: 0, _lastCastT: -99,
    boon: st.boon, mc: st.mc,
    questDone: !!cfg.questDone, questStacks: cfg.questStacks || 0, questTrophies: cfg.questTrophies || [],
    act: cfg.act || 1,
    alive: true, st: freshSt(),
    stats: {
      dmg: 0, heal: 0, ward: 0, nec: 0, taken: 0, hpLost: 0, wardAbs: 0,
      healIn: 0, wardIn: 0, regenIn: 0, alive: 0, rolls: [0, 0, 0, 0, 0], gold: 0,
      alertDodges: 0, evades: 0, wardAbsorbed: 0, markedAllyHits: 0, markedKills: 0,
      rootsApplied: 0, inspPassed: 0, burnCredit: 0, bearRagePeak: 0, kiStrikes: 0, hexDeaths: 0,
      zealotProcs: 0, bloomHeals: 0, searApplied: 0, radHexApplied: 0, bondedCasts: 0, rummageBuffs: 0,
      gildedKills: 0, kills: 0, ambushStrikes: 0, saintCasts: 0, pounces: 0,
      smites: 0, actionSurges: 0, channelDivinities: 0, arcaneRecoveries: 0,
      wildShapes: 0, cunningActions: 0, pactBoons: 0, metamagics: 0, sneaks: 0, rages: 0
    },
    tier: cfg.tier || 1, path: st.path && st.path.k, items: cfg.items || [], tempItems: [], goldHeld: cfg.goldHeld || 0
  };
  u.kw = { ...(d.kw || {}) };
  if (st.mc && typeof MULTICLASS !== 'undefined' && MULTICLASS[st.mc]) {
    const mkw = MULTICLASS[st.mc].kw;
    u.kw[mkw] = (u.kw[mkw] || 0) + 1;
  }
  Object.keys(u.it).forEach(x => { if (x.startsWith('kw_')) { const n = x.slice(3); u.kw[n] = (u.kw[n] || 0) + u.it[x]; } });
  u.gold = d.gold ? { ...d.gold } : null;
  return u;
}

const ESC = { hp: 2.36, dmg: 1.66 };
function mkEnemy(k, c, r, tier, enc) {
  const d = E[k];
  const es = (enc && enc.sc) || {};
  const hpx = Math.pow(TIERX.hp, tier - 1) * ESC.hp * (es.hp || 1) * (d.large ? LARGE_HP : 1);
  const dm = Math.pow(TIERX.dmg, tier - 1) * ESC.dmg * (es.dmg || 1);
  return {
    id: UID++, key: k, side: 'E', name: d.name, c, r,
    maxHp: Math.round(d.hp * hpx), hp: Math.round(d.hp * hpx),
    ac: d.ac, sr: d.sr, regen: 0, ward: 0, nec: 0,
    rng: d.rng, ft: d.ft, atk: d.atk, abil: d.abil || null, onHit: d.atk.onHit || [],
    it: {}, iv: +(d.atk.iv * ENEMY_TEMPO).toFixed(2), cr: d.abil ? d.abil.cr / ENEMY_TEMPO : 0, pa: d.abil ? (d.boss ? 9 : d.elite ? 7 : 5) : 0,
    charge: 0, t: Math.random() * .5, mt: 0, _lastCastT: -99,
    f: { ...(d.f || {}), webwalk: WEBFREE.has(k) }, die: 'd20',
    bands: d.abil ? { low: d.abil.cut[0], hi: d.abil.cut[1] + 1 } : null,
    dm, pen: d.pen || 0, spen: d.spen || 0, d20Floor: 1, chaPotency: 1, poisonX: 1, bon: null,
    cha: 0, con: 0, str: 0, m: { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 },
    haste: 0, tempHaste: 0, tempHasteT: 0, rollBonus: 0, nextBonus: 0, advantage: 0,
    elite: d.elite, boss: d.boss, sz: d.large ? 2 : 1, alive: true, st: freshSt(),
    stats: { dmg: 0, heal: 0, ward: 0, nec: 0, taken: 0, rolls: [0, 0, 0, 0, 0] }, tier
  };
}

/* ---------- Core Helpers ---------- */
const alive = (b, side) => b.units.filter(u => u.alive && u.side === side);
const foes = (b, u) => alive(b, u.side === 'P' ? 'E' : 'P');
const friends = (b, u) => alive(b, u.side);
const occupied = (b, h, ex) => b.units.some(u => u.alive && u !== ex && covers(u, h));
const freeHex = (b, h, ex) => fpCells(h, szOf(ex)).every(q => passable(q) && !occupied(b, q, ex));
const hpPct = u => u.hp / u.maxHp;
const canHit = (u, h, t) => { const d = hd(h, t); return d <= u.rng && (d <= 1 || los(h, t)); };
function roll(n, s) { let t = 0; for (let i = 0; i < n; i++) t += rnd(1, s); return t; }
function status(b, u, txt, col) { b.events.push({ k: 'status', id: u.id, txt, col }); }
function callout(b, u, txt, col) { b.events.push({ k: 'callout', id: u ? u.id : 0, txt, col: col || '#ffd76a' }); }
function otLevel(b) { return b.time >= OT_START ? 1 + Math.floor((b.time - OT_START) / OT_STEP) : 0; }
const chaK = u => (u && u.chaPotency) || (1 + 0.08 * Math.max(0, (u && u.cha) || 0));
const adjAllies = (b, u) => alive(b, u.side).filter(a => a !== u && hd(a, u) <= 1).length;
const isQuarry = t => !!(t && t.st && (t.st.mark || t.st.hex || t.st.radHex > 0 || t.st.vow));
const auraR = u => (u.f && u.f.divineStrike ? 1 : u.f && u.f.encore ? 1 : 0);

function settleLarge(units) {
  units.filter(x => szOf(x) > 1 && x.alive !== false).forEach(x => {
    const others = units.filter(y => y !== x && y.alive !== false);
    const ok = h => fpCells(h, 2).every(q => passable(q) && !others.some(y => covers(y, q)));
    if (ok(x)) return;
    let best = null, bd = 99;
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      const h = { c, r };
      const d = Math.max(Math.abs(c - x.c), Math.abs(r - x.r)) + (r < x.r ? 0 : .1);
      if (d < bd && ok(h)) { bd = d; best = h; }
    }
    if (best) { x.c = best.c; x.r = best.r; }
  });
}

function threatOf(x) {
  const a = x.atk;
  const avg = (a.d[0] * diceMult(x) * (a.d[1] + 1) / 2 + (a.flat || 0)) * (a.hits || 1);
  return avg * x.dm / x.iv * (x.boss ? 1.6 : x.elite ? 1.3 : 1) + (x.abil ? 3 : 0);
}
const curAC = (b, t) => (t.st.exp > 0 ? -2 : 0) + t.ac + (t.st.acBT > 0 ? t.st.acB : 0) + t.st.acS - t.st.acid + (t.auraAC || 0);
const curSR = (b, t) => t.sr + (t.auraSR || 0) - (t.st.exp > 0 ? 2 : 0) - (t.st.srShred || 0);

/* ---------- Unified 12-Class Keyword Event Bus & Helpers (v0.23) ---------- */
function emitClassKw(b, actor, kwKey, ctx = {}) {
  if (!b || !actor) return;
  b.kwCounts = b.kwCounts || {};
  b.kwCounts[kwKey] = (b.kwCounts[kwKey] || 0) + 1;
  if (actor.side !== 'P') return;
  const depth = (b._kwDepth || 0);
  if (depth >= 3) return;
  b._kwDepth = depth + 1;
  try {
    const P = alive(b, 'P');
    const tgt = ctx.target && ctx.target.alive ? ctx.target : (actor.target && actor.target.alive ? actor.target : foes(b, actor)[0]);

    if (kwKey === 'action_surge') {
      // Flame Tongue (v0.23 Unique): Action Surge also deals +2d6 Fire & applies Burn
      if (actor.it && actor.it.surgeFire && tgt && tgt.alive) {
        hit(b, actor, tgt, roll(2, 6), { kind: 'magic', el: 'fire', ty: 'fire', noBonus: 1, onhit: 1 });
        if (tgt.alive) applyStatus(b, actor, tgt, 'burn', 5 * chaK(actor));
      }
    } else if (kwKey === 'channel_divinity') {
      // Staff of Healing (v0.23 Unique): Channel Divinity also grants affected allies a 20% Max HP Ward
      if (actor.it && actor.it.cdWardPct) {
        const list = (ctx.affected && ctx.affected.length) ? ctx.affected : friends(b, actor).filter(a => !a.minion && hd(a, actor) <= 3);
        list.forEach(a => { if (a.alive) addWard(b, a, Math.round(a.maxHp * actor.it.cdWardPct), a.maxHp * .5, actor); });
      }
    } else if (kwKey === 'smite') {
      // Sun Blade (v0.23 Unique): Smites deal +1d8 Radiant and heal adjacent allies (1s CD)
      if (actor.it && actor.it.smiteSun && b.time >= (actor._sbCd || 0)) {
        actor._sbCd = b.time + 1.0;
        if (tgt && tgt.alive) hit(b, actor, tgt, roll(1, 8), { kind: 'radiant', ty: 'radiant', noBonus: 1, onhit: 1 });
        friends(b, actor).filter(a => !a.minion && hd(a, actor) <= 1).forEach(a => heal(b, actor, a, Math.round(a.maxHp * .08), { raw: 1 }));
      }
    } else if (kwKey === 'arcane_recovery') {
      // Gains Spec 2 Liquid Assets: Arcane Recovery also grants +10 Charge to all allies
      if (actor.f.liquidAssets) {
        friends(b, actor).filter(a => a !== actor && !a.minion).forEach(a => giveCharge(b, a, 10, 1));
      }
      // Arcane Grimoire (v0.23 Unique): Arcane Recovery grants +1 to next ability d20 roll (1s CD)
      if (actor.it && actor.it.arcRecRoll && b.time >= (actor._agCd || 0)) {
        actor._agCd = b.time + 1.0;
        actor.nextBonus = Math.min(6, (actor.nextBonus || 0) + actor.it.arcRecRoll);
        status(b, actor, 'GRIMOIRE +1 d20', '#8fb4e6');
      }
    } else if (kwKey === 'rage') {
      // Zark Spec 2 Totem Roar: whenever Zark gains Rage, adjacent allies gain +25% Attack Speed for 4s
      if (actor.f.totemRoar) {
        friends(b, actor).filter(a => a !== actor && !a.minion && hd(a, actor) <= 1).forEach(a => {
          a.tempHaste = Math.max(a.tempHaste || 0, 25);
          a.tempHasteT = Math.max(a.tempHasteT || 0, 4);
        });
        status(b, actor, 'TOTEM ROAR', '#ffd27a');
      }
    } else if (kwKey === 'sneak_attack') {
      // Dagger of Venom (v0.23 Unique): Sneak Attacks apply 2 Poison & Exposed (3s)
      if (tgt && tgt.alive && actor.it && actor.it.sneakVenom) {
        applyStatus(b, actor, tgt, 'poison', 2);
        expose(b, tgt, 3);
      }
    } else if (kwKey === 'ki' || kwKey === 'ki_ability') {
      // Naill Spec 2 Flowing Leaves: Open Hand Strike also Staggers adjacent foes
      if (actor.f.flowingLeaves && tgt) {
        foes(b, actor).filter(x => x !== tgt && hd(x, tgt) <= 1).forEach(x => stagger(b, x, 2));
      }
      // Staff of Striking (v0.23 Unique): Ki strikes hit twice
      if (actor.it && actor.it.kiDoubleStrike && !ctx.isEcho && tgt && tgt.alive) {
        later(b, .08, () => {
          if (actor.alive && tgt.alive) {
            const g2 = hit(b, actor, tgt, roll(2, 8) + Math.max(0, actor.m.wis), { kind: 'phys', ty: 'bludgeoning', melee: 1, noBonus: 1, onhit: 1 });
            if (tgt.alive) onHit(b, actor, tgt, g2);
          }
        });
      }
    } else if (kwKey === 'bardic_inspiration' && ctx.action === 'spend') {
      // Horn of Valhalla (v0.23 Unique): allies spending your Bardic Inspiration gain 20% Max HP Ward
      const giver = ctx.giver;
      if (giver && giver.it && giver.it.inspWardPct && actor.alive) {
        addWard(b, actor, Math.round(actor.maxHp * giver.it.inspWardPct), actor.maxHp * .5, giver);
      }
    } else if (kwKey === 'metamagic') {
      // Wand of Fireballs (v0.23 Unique): triggering Metamagic also applies Exposed (4s) to hit foes
      if (actor.it && actor.it.metaExpose && ctx.hitFoes) {
        ctx.hitFoes.forEach(x => { if (x.alive) expose(b, x, 4); });
      }
    }
  } finally {
    b._kwDepth = depth;
  }
}

function commonItemKeys() {
  return Object.keys(ITEMS).filter(k => ITEMS[k].r === 0);
}

function triggerZoeRummage(b, zoe, targets) {
  const pool = commonItemKeys();
  if (!pool.length) return;
  const mult = zoe.f.runeCarver ? 2 : 1;
  targets.forEach(a => {
    const pick = pool[Math.floor(Math.random() * pool.length)];
    applyTempItem(b, zoe, a, pick, mult);
  });
  zoe.stats.rummageBuffs = (zoe.stats.rummageBuffs || 0) + targets.length;
}

function gilthraxItemValue(u) {
  const prices = [2, 3, 4, 6, 10, 5];
  return (u.items || []).reduce((sum, ik) => sum + (ITEMS[ik] ? (prices[ITEMS[ik].r] || 2) : 0), 0);
}

function gilthraxWardAmount(u, P) {
  const val = gilthraxItemValue(u);
  const base = [24, 38, 60, 82][P] + val * [3, 4, 6, 7][P] + Math.max(0, u.m.con) * 4;
  return Math.round(base * tierScale(u) * chaK(u));
}

function triggerGilthraxBreath(b, u, storedDmg, wide = false) {
  if (!u || !u.alive) return;
  const rad = wide ? 3 : 2;
  const fs = foes(b, u).filter(x => !x.hidden && hd(x, u) <= rad);
  const list = fs.length ? fs : foes(b, u).filter(x => !x.hidden).sort((a, c) => hd(a, u) - hd(c, u)).slice(0, 2);
  if (!list.length) return;
  const dmg = Math.max(Math.round(14 * tierScale(u)), Math.round(storedDmg * (wide ? 1.15 : 0.9)));
  b.events.push({ k: 'area', id: u.id, tid: list[0].id, shape: 'cone', r: rad, ty: 'fire', ids: list.map(x => x.id) });
  callout(b, u, 'GOLD DRAGON BREATH!', '#ff9c4a');
  list.forEach(x => {
    hit(b, u, x, dmg, { kind: 'magic', el: 'fire', ty: 'fire', area: 1, noBonus: 1 });
    if (x.alive) applyStatus(b, u, x, 'burn', Math.round((wide ? 10 : 6) * chaK(u)));
  });
  // Bodyguard's Fee: unleashing Fire Breath grants adjacent allies +20 Charge
  if (u.f.bodyguardFee) {
    friends(b, u).filter(a => a !== u && !a.minion && hd(a, u) <= 1).forEach(a => giveCharge(b, a, 20, 1));
  }
  u.stats.actionSurges = (u.stats.actionSurges || 0) + 1;
  emitClassKw(b, u, 'action_surge', { target: list[0], breath: 1 });
}

function triggerActionSurge(b, u, opts = {}) {
  if (!u || !u.alive) return;
  if (b.time < (u._surgeCd || 0) && !opts.force) return;
  u._surgeCd = b.time + .25;
  u.stats.actionSurges = (u.stats.actionSurges || 0) + 1;
  const fs = foes(b, u).filter(x => !x.hidden);
  const tgt = (opts.target && opts.target.alive) ? opts.target : (u.target && u.target.alive ? u.target : fs.sort((a, c) => hd(a, u) - hd(c, u))[0]);
  status(b, u, opts.label || 'ACTION SURGE!', '#ff9c4a');
  if (opts.charge) giveCharge(b, u, opts.charge, 1);
  if (tgt && tgt.alive) {
    later(b, .04, () => {
      if (!u.alive) return;
      const x = tgt.alive ? tgt : foes(b, u).sort((a, c) => hd(a, u) - hd(c, u))[0];
      if (x && (hd(x, u) <= Math.max(2, u.rng) || u.rng >= 3)) strike(b, u, x, 1);
    });
  }
  emitClassKw(b, u, 'action_surge', { target: tgt, giver: opts.giver });
}

function triggerChannelDivinity(b, u, label, fn) {
  if (!u || !u.alive) return false;
  u._cdUsed = 1;
  u.stats.channelDivinities = (u.stats.channelDivinities || 0) + 1;
  u.stats.channel = (u.stats.channel || 0) + 1;
  let affected = null;
  if (fn) affected = fn(1);
  callout(b, u, label || 'CHANNEL DIVINITY!', '#ffe9a0');
  emitClassKw(b, u, 'channel_divinity', { label, affected });
  return true;
}

function triggerBramCD(b, u) {
  u._pres = 1;
  return triggerChannelDivinity(b, u, 'CD · PRESERVE LIFE', () => {
    const ts = friends(b, u).filter(a => !a.minion && hd(a, u) <= 3);
    b.events.push({ k: 'area', id: u.id, shape: 'nova', r: 3, ty: 'radiant', ids: ts.map(x => x.id) });
    ts.forEach(a => {
      let pct = .16 + .02 * Math.max(0, u.m.wis);
      if (u.f.discipleLife && hpPct(a) < .5) pct *= 1.4;
      heal(b, u, a, a.maxHp * pct, { raw: 1 });
    });
    return ts;
  });
}

function triggerJamisonCD(b, u) {
  return triggerChannelDivinity(b, u, 'CD · BALM OF PEACE', () => {
    const fr = friends(b, u).filter(a => !a.minion);
    b.events.push({ k: 'area', id: u.id, shape: 'nova', r: 5, ty: 'radiant', ids: fr.map(x => x.id) });
    // Bonds 1 closest unbonded ally + heals entire party
    const unb = fr.filter(a => a !== u && a.bonded !== u).sort((a, c) => hd(a, u) - hd(c, u))[0];
    if (unb) { unb.bonded = u; status(b, unb, 'BONDED', '#ffe9a0'); }
    fr.forEach(a => heal(b, u, a, tierRoll(u, 2, 6) + Math.max(0, u.m.cha) * 2, { raw: 1, bondShare: 1 }));
    u.stats.bondedCasts = (u.stats.bondedCasts || 0) + 1;
    return fr;
  });
}

function spawnSaintDouble(b, u) {
  const maxD = u.questDone ? 2 : 1;
  const cur = b.units.filter(x => x.alive && x.isDouble && x.owner === u);
  if (cur.length >= maxD) return cur[0];
  // Prefer an empty square 1-2 tiles forward/adjacent toward enemies so the double can draw aggro & echo
  const cands = [];
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    const h = { c, r };
    if (passable(h) && !occupied(b, h, null)) {
      const distU = hd(h, u);
      const fwdBias = Math.abs((u.r - 1) - r) * 0.6 + (r <= u.r ? 0 : 1.5);
      cands.push({ c, r, score: distU + fwdBias + (distU < 1 || distU > 3 ? 6 : 0) });
    }
  }
  cands.sort((a, z) => a.score - z.score);
  const spot = cands[0];
  if (!spot) return null;
  const dbl = {
    id: UID++, key: 'saint', side: 'P', role: 'Support', name: 'Illusory Double',
    c: spot.c, r: spot.r, maxHp: 1, hp: 1, ac: 10, sr: 10, evasion: 0,
    regen: 0, ward: 0, nec: 0, rng: u.rng, ft: 0, atk: null, abil: null, onHit: [],
    it: {}, iv: 99, cr: 0, pa: 0, charge: 0, t: 0, mt: 0, _lastCastT: -99,
    f: { illusoryDecoy: 1 }, die: 'd20', bands: null, dm: 1, pen: 0, spen: 0,
    d20Floor: 1, chaPotency: 1, poisonX: 1, bon: null,
    cha: 0, con: 0, str: 0, m: { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 },
    haste: 0, tempHaste: 0, tempHasteT: 0, rollBonus: 0, nextBonus: 0, advantage: 0,
    minion: 1, isDouble: 1, owner: u, sz: 1, alive: true, st: freshSt(),
    stats: { dmg: 0, heal: 0, ward: 0, nec: 0, taken: 0, rolls: [0, 0, 0, 0, 0] }, tier: u.tier
  };
  b.units.push(dbl);
  status(b, dbl, 'ILLUSORY DOUBLE', '#c48fe6');
  return dbl;
}

function triggerSaintCD(b, u) {
  return triggerChannelDivinity(b, u, 'CD · INVOKE DUPLICITY', () => {
    const dbl = spawnSaintDouble(b, u);
    return dbl ? [u, dbl] : [u];
  });
}

function triggerSmite(b, u, t, dmg, opts = {}) {
  if (!u || !u.alive || !t || !t.alive) return 0;
  const kind = opts.kind || 'radiant';
  const ty = opts.ty || (kind === 'radiant' ? 'radiant' : 'poison');
  const dealt = hit(b, u, t, dmg, { kind, ty, noBonus: 1, ab: opts.ab || 0, onhit: opts.onhit || 0, thorn: opts.thorn || 0 });
  u.stats.smites = (u.stats.smites || 0) + 1;
  if (opts.label) status(b, t, opts.label, kind === 'radiant' ? '#ffe9a0' : '#9be38a');
  emitClassKw(b, u, 'smite', { target: t, dmg: dealt });
  return dealt;
}

function triggerArcaneRecovery(b, u, baseCharge, why) {
  if (!u || !u.alive) return 0;
  const amt = Math.round(baseCharge);
  giveCharge(b, u, amt, 1);
  u.stats.arcaneRecoveries = (u.stats.arcaneRecoveries || 0) + 1;
  status(b, u, `ARCANE REC +${amt}`, '#8fb4e6');
  emitClassKw(b, u, 'arcane_recovery', { charge: amt, why });
  return amt;
}

function grantAlert(b, u, stacks = 1) {
  if (!u || !u.alive) return;
  grantTempEvasion(b, u, Math.min(0.4, 0.2 * stacks), 4, false);
}

function grantInspDie(b, giver, target, sides, passes) {
  if (!target || !target.alive) return;
  const cur = target.inspDie;
  const expandCrit = !!(giver && giver.key === 'rosalind' && giver.questDone);
  if (!cur || sides >= cur.sides) {
    target.inspDie = { sides, passes: passes || 0, giver, chaBonus: Math.max(0, Math.floor((giver.m.cha || 0) / 2)), expandCrit };
  } else {
    cur.passes = Math.max(cur.passes, passes || 0);
    if (expandCrit) cur.expandCrit = true;
  }
  status(b, target, `INSPIRED d${target.inspDie.sides}`, '#ffd76a');
  emitClassKw(b, giver, 'bardic_inspiration', { action: 'grant', target, kind: 'die' });
}

function grantInspMote(b, giver, target, chargeAmt) {
  if (!target || !target.alive) return;
  target.inspMote = { giver, sides: 8 };
  if (chargeAmt > 0) giveCharge(b, target, chargeAmt, 1);
  status(b, target, 'MOTE OF POTENTIAL', '#ffd76a');
  emitClassKw(b, giver, 'bardic_inspiration', { action: 'grant', target, kind: 'mote' });
}

function passInspDie(b, spentBy, dieObj) {
  if (!dieObj) return;
  const giver = dieObj.giver;
  const canPass = (dieObj.passes > 0) || (giver && giver.alive && giver.f.passRound && !dieObj._passedOnce);
  if (!canPass) return;
  const nextSides = dieObj.sides >= 10 ? 8 : 6;
  const others = friends(b, spentBy).filter(a => a !== spentBy && a !== giver && !a.minion && a.abil);
  if (!others.length) return;
  const nextT = others.sort((a, c) => (a.inspDie ? 1 : 0) - (c.inspDie ? 1 : 0) || hd(a, spentBy) - hd(c, spentBy))[0];
  if (giver && giver.stats) giver.stats.inspPassed = (giver.stats.inspPassed || 0) + 1;
  grantInspDie(b, giver || spentBy, nextT, nextSides, Math.max(0, (dieObj.passes || 1) - 1));
  if (nextT.inspDie) nextT.inspDie._passedOnce = 1;
}

function addSorcery(b, u, n, excludeCenter, hurlFn) {
  if (!u || !u.alive) return;
  u.sorcery = Math.min(4, (u.sorcery || 0) + n);
  if (u.sorcery >= 4) {
    u.sorcery = 0;
    u.stats.metamagics = (u.stats.metamagics || 0) + 1;
    callout(b, u, 'METAMAGIC · TWINNED!', '#ff9c4a');
    later(b, .16, () => {
      if (!u.alive) return;
      if (hurlFn) {
        const hitFoes = hurlFn(excludeCenter, true) || [];
        emitClassKw(b, u, 'metamagic', { kind: 'twinned', hitFoes });
      } else {
        const fs = foes(b, u).filter(x => !x.hidden);
        if (!fs.length) return;
        const c = fs[0];
        const hitFoes = fs.filter(x => hd(x, c) <= 1);
        b.events.push({ k: 'area', id: u.id, tid: c.id, shape: 'splash', r: 1, ty: 'fire', ids: hitFoes.map(x => x.id) });
        hitFoes.forEach(x => {
          hit(b, u, x, roll(4, 6), { kind: 'magic', el: 'fire', ty: 'fire', area: 1 });
          if (x.alive) applyStatus(b, u, x, 'burn', 8 * chaK(u));
          if (u.f.wildfire && x.alive) expose(b, x, 4 * chaK(u));
        });
        emitClassKw(b, u, 'metamagic', { kind: 'twinned', hitFoes });
      }
    });
  }
}

function addBearRage(b, u, stacks = 1) {
  if (!u || !u.alive) return;
  u.bearRage = (u.bearRage || 0) + stacks;
  u.stats.bearRagePeak = Math.max(u.stats.bearRagePeak || 0, u.bearRage);
  u.stats.rages = (u.stats.rages || 0) + stacks;
  status(b, u, `RAGE ×${u.bearRage}`, '#ff6a4a');
  emitClassKw(b, u, 'rage', { kind: 'bear', stacks });
}

function enterZealotRage(b, u, dur) {
  if (!u || !u.alive) return;
  u.zealotT = Math.max(u.zealotT || 0, dur);
  u.stats.zealotProcs = (u.stats.zealotProcs || 0) + 1;
  u.stats.rages = (u.stats.rages || 0) + 1;
  status(b, u, 'ZEALOT RAGE', '#ffe9a0');
  emitClassKw(b, u, 'rage', { kind: 'zealot', dur });
}

function triggerWildShape(b, u, opts = {}) {
  if (!u || !u.alive) return;
  u.stats.wildShapes = (u.stats.wildShapes || 0) + 1;
  if (opts.dur) u.wildShapeT = Math.max(u.wildShapeT || 0, opts.dur);
  if (opts.thorns) {
    friends(b, u).filter(a => hd(a, u) <= 2).forEach(a => { a.vineThornsT = Math.max(a.vineThornsT || 0, opts.dur || 5); });
  }
  status(b, u, `WILD SHAPE · ${(opts.form || 'PRIMAL').toUpperCase()}`, '#6da670');
  emitClassKw(b, u, 'wild_shape', opts);
}

function triggerCunningAction(b, u, target, opts = {}) {
  if (!u || !u.alive) return;
  if (opts.stealth > 0) {
    u.hidden = 1;
    u.hideT = Math.max(u.hideT || 0, b.time + opts.stealth);
    if (opts.stealthShield) u.stealthShield = 1;
    b.units.forEach(x => { if (x.target === u) x.target = null; });
  }
  status(b, u, opts.label || 'STEALTH', '#c48fe6');
}

function triggerSneakAttack(b, u, target, opts = {}) {
  if (!u || !u.alive || !target) return;
  u.stats.sneaks = (u.stats.sneaks || 0) + 1;
  if (!opts.ability && target.alive) {
    hit(b, u, target, tierRoll(u, 1, 6), { kind: 'phys', ty: 'piercing', noBonus: 1, onhit: 1 });
    if (opts.venom && target.alive) applyStatus(b, u, target, 'poison', 2 * chaK(u));
  }
  emitClassKw(b, u, 'sneak_attack', { target, ...opts });
}

function fireNaillKiStrike(b, u, t) {
  if (!u || !u.alive || !t || !t.alive) return;
  u.ki = 0;
  u.stats.kiStrikes = (u.stats.kiStrikes || 0) + 1;
  callout(b, u, 'KI · OPEN HAND!', '#8fd8d8');
  const adj = u.f.flowingLeaves ? foes(b, u).filter(x => x.alive && hd(x, t) <= 1) : [t];
  b.events.push({ k: 'area', id: u.id, tid: t.id, shape: 'splash', r: u.f.flowingLeaves ? 1 : 0.6, ty: 'thunder', ids: adj.map(x => x.id) });
  const got = hit(b, u, t, tierRoll(u, 2, 8) + Math.max(0, u.m.wis) * 2, { kind: 'phys', ty: 'bludgeoning', melee: 1, noBonus: 1 });
  if (t.alive) {
    stagger(b, t, 2);
    onHit(b, u, t, got);
    if (u.f.naillOpenHand && t.alive) onHit(b, u, t, got);
  }
  if (u.f.flowingLeaves) {
    adj.forEach(x => {
      if (!x.alive) return;
      stagger(b, x, 2 * chaK(u));
      expose(b, x, 3 * chaK(u));
    });
  }
  if (u.key === 'naill' && u.questDone) u.advantage = 1;
  emitClassKw(b, u, 'ki', { target: t });
}

function applyNettleHex(b, u, t, withJump = true) {
  if (!t || !t.alive) return;
  t.st.hex = u;
  t.st.hexType = 'infernal';
  t.st.hexStacks = 1;
  t.st.hexJump = withJump ? 1 : 0;
  status(b, t, 'INFERNAL HEX', '#ff7b4a');
  emitClassKw(b, u, 'hex', { target: t });
}

function applyMcHex(b, u, t) {
  if (!t || !t.alive) return;
  t.st.hex = u;
  t.st.hexType = 'mc';
  t.st.hexStacks = 1;
  t.st.hexJump = 1;
  status(b, t, 'HEXED', '#c48fe6');
  emitClassKw(b, u, 'hex', { target: t });
}

function applyRadiantHex(b, u, t, stacks = 1) {
  if (!t || !t.alive) return;
  t.st.radHex = Math.min(12, (t.st.radHex || 0) + stacks);
  t.st.radHexBy = u;
  if (u.stats) u.stats.radHexApplied = (u.stats.radHexApplied || 0) + stacks;
  status(b, t, `RADIANT HEX ×${t.st.radHex}`, '#ffe9a0');
  emitClassKw(b, u, 'hex', { target: t, kind: 'radiant' });
}

function triggerPactBoon(b, hexer, victim, killer) {
  if (!hexer) return;
  hexer.stats.hexDeaths = (hexer.stats.hexDeaths || 0) + 1;
  // Infernal Hex: explodes in Hellfire AoE and jumps to another foe!
  if (victim && victim.st.hexType === 'infernal') {
    const near = alive(b, 'E').filter(x => hd(x, victim) <= 2);
    if (near.length) {
      b.events.push({ k: 'area', id: hexer.id, tid: victim.id, shape: 'splash', r: 2, ty: 'fire', ids: near.map(x => x.id) });
      near.forEach(x => {
        hit(b, hexer, x, tierRoll(hexer, 2, 8), { kind: 'magic', el: 'fire', ty: 'fire', area: 1, noBonus: 1 });
        if (x.alive) applyStatus(b, hexer, x, 'burn', 4 * chaK(hexer));
      });
    }
    const nx = alive(b, 'E').sort((a, c) => hd(a, victim) - hd(c, victim))[0];
    if (nx && hexer.alive) applyNettleHex(b, hexer, nx, true);
  } else if (victim && victim.st.hexJump && hexer.alive) {
    const nx = alive(b, 'E').sort((a, c) => hd(a, victim) - hd(c, victim))[0];
    if (nx) applyMcHex(b, hexer, nx);
  }
  // Nettle Spec 2 Dark One's Blessing: killing a Hexed foe grants the killer a Ward
  if (hexer.f && hexer.f.darkBargain && killer && killer.side === 'P' && killer.alive) {
    addWard(b, killer, Math.round(killer.maxHp * .20), killer.maxHp * .5, hexer);
  }
  // Nettle Quest Infernal Contract: each Hex death grants Nettle +1 to ability rolls for rest of fight
  if (hexer.alive && hexer.key === 'nettle' && hexer.questDone) {
    hexer.clauses = (hexer.clauses || 0) + 1;
    hexer.rollBonus += 1;
    status(b, hexer, `CONTRACT +${hexer.clauses} d20`, '#ffd76a');
  }
}

function applyRoot(b, src, t, dur) {
  if (!t || !t.alive) return;
  t.st.root = Math.max(t.st.root, dur);
  status(b, t, 'ROOTED', '#6da670');
  if (src && src.stats) src.stats.rootsApplied = (src.stats.rootsApplied || 0) + 1;
  // Juniper Spec 2 Circle of the Land: whenever Juniper Roots a foe, heal lowest-HP ally (1s CD)
  if (src && src.key === 'juniper' && src.f.circleLand && b.time >= (src._clT || 0)) {
    src._clT = b.time + 1.0;
    const low = friends(b, src).filter(a => !a.minion).sort((a, c) => hpPct(a) - hpPct(c))[0];
    if (low) heal(b, src, low, tierRoll(src, 2, 6) + Math.max(0, src.m.wis) * 2, { raw: 1 });
  }
}

function markFoe(b, u, t, stacks = 1) {
  if (!t || !t.alive || t.side === u.side) return;
  t.st.mark = u;
  t.st.markStacks = Math.min(8, (t.st.markStacks || 0) + stacks);
  status(b, t, t.st.markStacks > 1 ? `MARK ×${t.st.markStacks}` : 'HUNTER’S MARK', '#9fd86a');
  emitClassKw(b, u, 'hunters_mark', { target: t, stacks: t.st.markStacks });
}
function hexFoe(b, u, t) { applyNettleHex(b, u, t, true); }
const liveMark = (b, u) => b.units.find(x => x.alive && x.st.mark === u);
const liveHex = (b, u) => b.units.find(x => x.alive && x.st.hex === u);

function stagger(b, t, s) { if (!t || !t.alive) return; if (t.boss) s *= .6; t.st.stag = Math.max(t.st.stag || 0, s); status(b, t, 'STAGGERED', '#ffb27a'); }
function expose(b, t, s) { if (!t || !t.alive) return; t.st.exp = Math.max(t.st.exp || 0, s); t.hidden = 0; status(b, t, 'EXPOSED', '#ff9cd0'); }
function frighten(b, t, s) { if (!t || !t.alive || t.boss) return; t.st.fear = Math.max(t.st.fear || 0, s); status(b, t, 'FRIGHTENED', '#d0a0ff'); }
function charm(b, src, t, s) { if (!t || !t.alive || t.boss) return; t.st.charm = Math.max(t.st.charm || 0, s); t.target = null; status(b, t, 'CHARMED', '#ff9cd0'); }
function stun(b, t, s) { if (t.it && t.it.freeAct) s *= .5; t.st.stun = Math.max(t.st.stun, s); status(b, t, 'STUNNED', '#ffd27a'); }
function acBuff(b, u, v, s) { u.st.acB = Math.max(u.st.acB && u.st.acBT > 0 ? u.st.acB : 0, v); u.st.acBT = Math.max(u.st.acBT, s); status(b, u, '+' + v + ' AC', '#a8b8cc'); }
function taunt(b, u, R, T) { const fs = foes(b, u).filter(x => hd(x, u) <= R); fs.forEach(x => { x.st.taunt = T; x.st.tauntBy = u; x.target = u; }); b.events.push({ k: 'area', id: u.id, shape: 'nova', r: R, ty: 'force', ids: fs.map(x => x.id) }); }

function gainGold(b, u, v, why) {
  if (!u || u.side !== 'P' || !(v > 0)) return 0;
  const got = Math.round(v);
  if (got <= 0) return 0;
  u.stats.gold = (u.stats.gold || 0) + got;
  b.gold = (b.gold || 0) + got;
  b.events.push({ k: 'status', id: u.id, txt: `+${got} GOLD${why ? ' · ' + why : ''}`, col: '#ffd76a' });
  // Toot Spec 1 Busker's Rhythm: +15% Attack Speed per Gold earned this fight (cap +120%)
  alive(b, 'P').filter(x => x.f.busker).forEach(toot => {
    const add = Math.min(120 - (toot._buskerH || 0), got * 15);
    if (add > 0) { toot._buskerH = (toot._buskerH || 0) + add; toot.permHaste = (toot.permHaste || 0) + add; }
  });
  // Gains Arcane Recovery (Transmutation): whenever Gold drops in combat, recover +15 Charge
  alive(b, 'P').filter(x => x.f.transmuter).forEach(g => {
    triggerArcaneRecovery(b, g, 15, 'GOLD');
  });
  return got;
}

/* ---------- Damage, Mitigation, Evasion & Temporary Rummage Items ---------- */
function curEvasion(b, t) {
  if (!t) return 0;
  const smokeAura = (b && t.side === 'P' && !t.minion && alive(b, 'P').some(x => x.f.smokeMirrors)) ? 0.10 : 0;
  return combineEvasion(
    t.evasion || 0,
    (t.tempEvasionT > 0 ? t.tempEvasion : 0),
    (t.partyEvasionT > 0 ? t.partyEvasion : 0),
    smokeAura
  );
}

function grantTempEvasion(b, u, pct, dur, isParty) {
  if (!u || !u.alive) return;
  if (isParty) {
    u.partyEvasion = Math.max(u.partyEvasion || 0, pct);
    u.partyEvasionT = Math.max(u.partyEvasionT || 0, dur);
  } else {
    u.tempEvasion = Math.max(u.tempEvasion || 0, pct);
    u.tempEvasionT = Math.max(u.tempEvasionT || 0, dur);
  }
  status(b, u, `+${Math.round(pct * 100)}% EVASION`, '#8fd0ff');
}

function applyTempItem(b, giver, target, itemKey, mult = 1) {
  const it = ITEMS[itemKey];
  if (!it || !target || !target.alive) return;
  target.tempItems = target.tempItems || [];
  target.tempItems.push(itemKey);
  const a = it.a || {};
  const s = it.s || {};
  const addMod = (attr, scDelta) => {
    const dMod = Math.floor((scDelta * mult) / 2);
    if (!dMod) return;
    target.m[attr] = (target.m[attr] || 0) + dMod;
    if (attr === 'str') { target.str = (target.str || 0) + dMod; if (target.rng <= 2 || target.thrown) target.pen += dMod; if (H[target.key] && pairOf(H[target.key])[0] === 'str') target.bon.w += dMod; }
    if (attr === 'dex') { target.ac += dMod; const dh = (H[target.key] && pairOf(H[target.key])[0] === 'dex') ? 6 : 4; target.permHaste = (target.permHaste || 0) + dh * dMod; if (H[target.key] && pairOf(H[target.key])[0] === 'dex') target.bon.w += dMod; }
    if (attr === 'con') { target.con = (target.con || 0) + dMod; const addHp = Math.round(18 * dMod * Math.pow(TIERX.hp, (target.tier || 1) - 1)); target.maxHp += addHp; target.hp += addHp; target.regen += 0.5 * dMod; }
    if (attr === 'int') { target.cr *= (1 + 0.1 * dMod); target.chgX *= (1 + 0.1 * dMod); }
    if (attr === 'wis') { target.sr += dMod; target.d20Floor = Math.min(10, (target.d20Floor || 1) + dMod); }
    if (attr === 'cha') { target.cha = (target.cha || 0) + dMod; target.chaPotency = +(1 + 0.08 * Math.max(0, target.cha)).toFixed(2); }
    if (H[target.key] && pairOf(H[target.key])[1] === attr) { target.bon.k += dMod; target.rollBonus += dMod; }
  };
  Object.entries(a).forEach(([k, v]) => addMod(k, v));
  if (s.dmg) target.dmgBonus = (target.dmgBonus || 0) + s.dmg * mult;
  if (s.haste) target.permHaste = (target.permHaste || 0) + s.haste * mult;
  if (s.ac) target.ac += s.ac * mult;
  if (s.sr) target.sr += s.sr * mult;
  if (s.hp) { const addHp = Math.round(s.hp * mult * Math.pow(TIERX.hp, (target.tier || 1) - 1)); target.maxHp += addHp; target.hp += addHp; }
  if (s.regen) target.regen = (target.regen || 0) + s.regen * mult;
  if (s.evasion) target.evasion = combineEvasion(target.evasion || 0, Math.min(0.5, s.evasion * mult));
  status(b, target, `${mult > 1 ? 'RUNIC ' : ''}${it.n.toUpperCase()}`, '#ffd76a');
}

function bonusFor(src, o) {
  const B = src.bon;
  if (!B || o.noBonus) return 0;
  const itemFlat = !o.ab ? ((src.dmgBonus || 0) + ((src.it && src.it.rageDmg) ? (src.bearRage || 0) * src.it.rageDmg : 0) + ((src.moonDmgT || 0) > 0 ? 2 : 0)) : 0;
  const melee = o.melee || src.rng <= 2 || (src.thrown && !o.ab);
  let v = o.ab ? B.k : B.w;
  if (o.kind === 'phys' && !melee && !o.ab && src.cls && H[src.key] && pairOf(H[src.key])[0] === 'str') v = 0;
  return v + itemFlat;
}

function mitigate(b, src, t, amt, o) {
  if (isRadiant(o) || o.dot) return amt;
  if (src && src.boon === 'irresistible_offense') return amt;
  let base = o.kind === 'magic' ? curSR(b, t) : curAC(b, t);
  let pen = (o.pen || 0) + (src ? (o.kind === 'magic' ? src.spen : src.pen) : 0);
  if (src && o.kind !== 'magic' && src.it && src.it.markPenPct && t.st.mark) pen += Math.round(base * src.it.markPenPct);
  if (pen > 0) base = Math.max(Math.min(base, 6), base - pen);
  base = Math.max(5, base);
  const k3 = MITIGATE_K * MITIGATE_K * MITIGATE_K;
  const b3 = base * base * base;
  return amt * k3 / (b3 + k3);
}

function onUnitEvade(b, dodger, attacker) {
  if (!dodger || dodger.side !== 'P') return;
  dodger.stats.evades = (dodger.stats.evades || 0) + 1;
  dodger.stats.alertDodges = (dodger.stats.alertDodges || 0) + 1;
  // Prevent Evasion from starving Struck Tanks of ability Charge
  if (dodger.abil && dodger.trig === 'struck') {
    giveCharge(b, dodger, 4 * (dodger.chgX || 1), 1);
  }
  // Arthur Action Surge: evading triggers an immediate free Longsword strike
  if (dodger.f.arthurSurge) {
    triggerActionSurge(b, dodger, { target: attacker, label: 'ACTION SURGE!' });
  }
  // Arthur Spec 2 Roll for Initiative: allies gain +25 Charge whenever they evade
  if (alive(b, 'P').some(x => x.f.initSplash)) {
    giveCharge(b, dodger, 25);
  }
  // Saint Spec 2 Smoke & Mirrors: whenever an ally evades an attack, heal them for 10% max HP
  alive(b, 'P').filter(x => x.f.smokeMirrors).forEach(st => {
    heal(b, st, dodger, Math.round(dodger.maxHp * .10), { raw: 1 });
  });
  // Boon of the Night Spirit: evading grants +15 Charge (1s CD)
  if (dodger.boon === 'night_spirit' && b.time >= (dodger._nsCd || 0)) {
    dodger._nsCd = b.time + 1.0;
    giveCharge(b, dodger, 15);
  }
  // Cloak of Displacement (v0.23 Rare): evading grants +10 Charge (1s CD)
  if (dodger.it && dodger.it.evadeCharge && b.time >= (dodger._dispCd || 0)) {
    dodger._dispCd = b.time + 1.0;
    giveCharge(b, dodger, dodger.it.evadeCharge, 1);
  }
  // Dragonhide Belt (v0.23 Unique): gain +1 Ki when evading (1s CD)
  if (dodger.it && dodger.it.evadeKi && dodger.kw && dodger.kw.ki && b.time >= (dodger._dkCd || 0)) {
    dodger._dkCd = b.time + 1.0;
    dodger.ki = Math.min(KI_MAX, (dodger.ki || 0) + 1);
  }
}

function onAllyDodge(b, dodger, attacker) { onUnitEvade(b, dodger, attacker); }

function hit(b, src, t, amt, o = {}) {
  if (!t || !t.alive) return 0;
  o.ab = o.ab ?? (src && src._casting ? 1 : 0);
  if (src && src.c !== undefined) src._shown = b.time + 2;

  // Armor of Invulnerability (v0.23 Legendary): take 0 damage for first 4s of combat
  if (t.it && t.it.invulnSec && b.time < t.it.invulnSec && amt > 0) {
    status(b, t, 'INVULNERABLE', '#ffd76a');
    return 0;
  }

  // Universal Evasion check: negates incoming BASIC ATTACKS only (abilities/spells/DoTs still hit!)
  if (src && o.strike && !o.dot && !o.ab && !o.area && !o.thorn && !o.onhit && amt > 0) {
    const ev = curEvasion(b, t);
    if (ev > 0 && Math.random() < ev) {
      status(b, t, 'EVADED!', '#8fd0ff');
      onUnitEvade(b, t, src);
      return 0;
    }
  }

  // Legacy discrete Alert/Afterimage fallback + Saint's Illusory Double
  if (src && !o.dot && amt > 0 && !(t.st.exp > 0) && !(src.f && src.f.keenSight)) {
    if (t.alert > 0) {
      t.alert--;
      status(b, t, 'EVADED!', '#8fd0ff');
      onUnitEvade(b, t, src);
      return 0;
    }
    if (t.afterimage > 0) {
      t.afterimage--;
      status(b, t, 'EVADED!', '#8fd8d8');
      onUnitEvade(b, t, src);
      return 0;
    }
  }
  if (t.isDouble && amt > 0) {
    t.alive = false; t.hp = 0;
    b.events.push({ k: 'die', id: t.id });
    b.units.forEach(x => { if (x.target === t) x.target = null; });
    status(b, t, 'ILLUSION EVADED!', '#c48fe6');
    const owner = t.owner;
    if (owner && owner.alive) {
      onUnitEvade(b, owner, src);
      if (owner.f.twoFaced && src && src.alive) addNec(b, owner, src, 12);
    }
    return 0;
  }

  let raw = amt;
  if (o.area && szOf(t) > 1) raw *= LARGE_AREA;

  if (src && !o.dot) {
    if (amt > 0) raw += bonusFor(src, o);
    let mul = src.dm * (1 + .15 * otLevel(b)) * (o.mul || 1) * (o.ab ? src.abM || 1 : o.strike ? src.atM || 1 : 1);
    if (src.st.mockT > 0) mul *= .80;
    if (src.inspAmpT > 0) mul *= 1.25;
    // Staff of Withering (v0.23 Unique): enemies with holder's Hex take +20% damage from spells & Radiant hits
    if ((o.kind === 'magic' || isRadiant(o)) && (t.st.hex || t.st.radHex > 0) && alive(b, 'P').some(x => x.it && x.it.hexSpellAmp)) {
      mul *= 1.20;
    }
    raw *= mul;
  }

  if (o.dot && o.ty === 'poison' && t.st.root > 0 && alive(b, 'P').some(x => x.f.overgrowth)) raw *= 2;
  if (o.dot && o.ty === 'fire' && (t.st.hex || t.st.radHex > 0) && alive(b, 'P').some(x => x.f.finePrint)) raw *= 2;

  let dmg = Math.max(amt > 0 ? 1 : 0, Math.round(mitigate(b, src, t, raw, o)));

  // Ring of Evasion (v0.23 Very Rare): first enemy ability that hits you deals 50% less damage
  if (o.ab && !o.dot && dmg > 0 && t.it && t.it.firstAbilHalf && !t._ringEvUsed) {
    t._ringEvUsed = 1;
    dmg = Math.max(1, Math.round(dmg * .5));
    status(b, t, 'RING OF EVASION', '#8fd0ff');
  }
  if (t.stealthShield && !o.dot && dmg > 0) { t.stealthShield = 0; dmg = Math.round(dmg * .5); status(b, t, 'GLANCING', '#c48fe6'); }
  if (t.bearRage > 0 && !o.dot && dmg > 0) { dmg = Math.max(1, Math.round(dmg * (1 - Math.min(.55, t.bearRage * .06)))); }
  if (t.mcRage > 0 && !o.dot && dmg > 0) { dmg = Math.max(1, Math.round(dmg * .85)); }

  const pre = dmg;
  const hadWard = t.ward > 0;
  if (t.ward > 0 && dmg > 0) {
    const a = Math.min(t.ward, dmg);
    t.ward -= a;
    dmg -= a;
    t.stats.wardAbs = (t.stats.wardAbs || 0) + a;
    if (t._wardBy && t._wardBy.stats) t._wardBy.stats.wardAbsorbed = (t._wardBy.stats.wardAbsorbed || 0) + a;
    if (hadWard && t.ward <= 0) {
      t._wardBy = null;
      // Gilthrax Ward-Break: blasts cone of Fire equal to absorbed Ward!
      if (t.alive && t.f.gilthraxWard && (t.wardStored || 0) > 0) {
        const stored = t.wardStored;
        t.wardStored = 0;
        later(b, .02, () => { if (t.alive) triggerGilthraxBreath(b, t, stored, false); });
      }
      // Faelan Ward Siphon & Spell Battery: trigger when ANY allied Ward breaks (0.5s ICD)
      if (t.side === 'P' && !t.minion) {
        alive(b, 'P').filter(x => x.f.abjurer && b.time >= (x._wsCd || 0)).forEach(abj => {
          abj._wsCd = b.time + 0.5;
          triggerArcaneRecovery(b, abj, 15, 'WARD BREAK');
          if (abj.f.spellBattery) {
            giveCharge(b, t, 25);
          }
        });
      }
    }
  }

  // Kaska Wild Shape (Panther Form): Beast HP absorbs incoming damage before main HP bar!
  if (t.beast && t.beast.hp > 0 && dmg > 0) {
    const abs = Math.min(t.beast.hp, dmg);
    t.beast.hp -= abs;
    dmg -= abs;
    if (t.beast.hp <= 0) {
      t.beast = null;
      status(b, t, 'HALF-ORC FORM', '#c8b48a');
    }
  }

  t.hp -= dmg;
  // Pillar Zealot Rage: cannot drop below 1 HP while active
  if (t.zealotT > 0 && t.hp < 1) t.hp = 1;

  t.stats.taken += pre;
  t.stats.hpLost = (t.stats.hpLost || 0) + dmg;
  if (t.hp < t.maxHp * .5) t._droppedHalf = 1;
  if (src) {
    const cr = src.minion && src.owner ? src.owner : src;
    cr.stats.dmg += pre;
    if (pre > (cr.stats.big || 0)) cr.stats.big = pre;
  }

  if (t.abil && pre > 0 && (t.side === 'E' || t.trig === 'struck')) {
    if (t.side === 'E') {
      giveCharge(b, t, pre / t.maxHp * CHARGE_TAKEN, 1);
    } else {
      const chgRef = Math.max(pre, raw * 0.45);
      giveCharge(b, t, Math.max(4, chgRef / t.maxHp * CHG.struck) * (t.chgX || 1), 1);
    }
  }
  if (t.side === 'P' && pre > 0) {
    const sh = watchShare(b, t);
    const watchRef = Math.max(pre, raw * 0.40);
    for (const a of b.units) {
      if (a.alive && a.side === 'P' && a.trig === 'watchful' && hd(a, t) <= a.rng + 1) {
        giveCharge(b, a, watchRef / t.maxHp * CHG.watchful * (a === t ? 2.5 : sh) * (a.chgX || 1), 1);
      }
    }
  }

  // Mother Laurel Spec 1 Verdant Aura: heals self for 40% and adjacent allies for 20% of damage dealt
  if (pre > 0 && src && src.alive && src.f.verdantAura && !o.dot) {
    const selfH = Math.max(1, Math.round(pre * .40));
    const allyH = Math.max(1, Math.round(pre * .20));
    heal(b, src, src, selfH, { raw: 1 });
    friends(b, src).filter(a => a !== src && !a.minion && hd(a, src) <= 1).forEach(a => heal(b, src, a, allyH, { raw: 1 }));
  }

  // Toot Mote of Potential: ability damage triggers +1d8 (×tier) bonus damage & +2g bounty on kill
  if (pre > 0 && o.ab && !o.dot && !o.moteProc && src && src.side === 'P' && src._activeMote) {
    const mote = src._activeMote;
    if (b.time >= (src._moteCdT || 0)) {
      src._moteCdT = b.time + .5;
      later(b, 0, () => {
        if (!t.alive) return;
        const wasAlive = t.alive;
        hit(b, src, t, tierRoll(mote.giver || src, 1, 8), { kind: 'magic', ty: 'thunder', noBonus: 1, moteProc: 1, onhit: 1 });
        if (wasAlive && !t.alive && mote.giver && mote.giver.alive && !mote.bountyPaid) {
          mote.bountyPaid = 1;
          gainGold(b, mote.giver, 2, 'BOUNTY +2g');
        }
      });
    }
  }
  // If an ability hit with an active Mote directly killed the target, award the +2g bounty too
  if (pre > 0 && o.ab && !o.dot && src && src.side === 'P' && src._activeMote && !src._activeMote.bountyPaid && t.hp <= 0) {
    const mote = src._activeMote;
    if (mote.giver && mote.giver.alive) {
      mote.bountyPaid = 1;
      gainGold(b, mote.giver, 2, 'BOUNTY +2g');
    }
  }

  // Staff of Fire (v0.23 Very Rare): ability hits apply 4 Burn (1s CD)
  if (pre > 0 && o.ab && !o.dot && src && src.alive && src.it && src.it.staffFireBurn && t.alive && b.time >= (src._sfBurnT || 0)) {
    src._sfBurnT = b.time + 1.0;
    applyStatus(b, src, t, 'burn', 4);
  }

  // Pillar Spec 2 Living Beacon: taking damage empowers adjacent allies' next strike with +1d6 Radiant Smite
  if (t.f.livingBeacon && !o.dot && pre > 0 && t.alive) {
    friends(b, t).filter(a => a !== t && !a.minion && hd(a, t) <= 1).forEach(a => { a._beaconHoly = 1; });
  }

  // Zark Spec 1 Relentless Bear: heavy hits (>=10% Max HP) grant +2 on next d20 roll
  if (t.f.relentlessBear && !o.dot && pre >= t.maxHp * .10 && t.alive) {
    t.nextBonus = Math.min(6, (t.nextBonus || 0) + 2);
  }

  // Zoe Emergency Quartermaster (Action Surge): first time any ally drops below 50% HP, toss them a free Common item
  if (t.side === 'P' && !t.minion && t.alive && t.hp < t.maxHp * .5) {
    alive(b, 'P').filter(z => z.f.zoeQuartermaster && !z._zoeSurgeUsed).forEach(z => {
      z._zoeSurgeUsed = 1;
      status(b, z, 'EMERGENCY SURGE!', '#f2c14e');
      emitClassKw(b, z, 'action_surge', { kind: 'zoe_emergency' });
      triggerZoeRummage(b, z, [t]);
    });
  }

  // Potion of Greater Healing (v0.23 Rare): <50% HP heals 25% Max HP & cleanses Burn/Poison
  if (t.it && t.it.potionHeal && !t._potionUsed && t.alive && t.hp < t.maxHp * .5) {
    t._potionUsed = 1;
    const amtH = Math.max(1, Math.round(t.maxHp * .25));
    t.st.burn = 0; t.st.poison = 0; t.st.poisonAcc = 0;
    heal(b, t, t, amtH, { raw: 1 });
    status(b, t, `POTION +${amtH}`, '#8fe0a0');
  }
  // Periapt of Wound Closure (v0.23 Unique · Rage): first time <50% HP triggers Rage
  if (t.it && t.it.woundRage && !t._woundRageUsed && t.alive && t.hp < t.maxHp * .5) {
    t._woundRageUsed = 1;
    if (t.f.zealot) enterZealotRage(b, t);
    else if (t.f.bearRage) addBearRage(b, t, 2);
    else { t.mcRage = 1; emitClassKw(b, t, 'rage', { kind: 'periapt' }); status(b, t, 'PERIAPT RAGE!', '#ff6a4a'); }
  }
  // Moon Sickle (v0.23 Unique · Wild Shape): first time <60% HP triggers Wild Shape
  if (t.it && t.it.lowWildShape && !t._moonSickleUsed && t.alive && t.hp < t.maxHp * .6) {
    t._moonSickleUsed = 1;
    t.wildShapeT = Math.max(t.wildShapeT || 0, 5);
    if (t.key === 'kaska') {
      const hp = Math.round(t.maxHp * .35);
      t.beast = { hp, maxHp: hp };
      status(b, t, 'MOON SICKLE PANTHER!', '#6da670');
    } else {
      addWard(b, t, Math.round(t.maxHp * .20), t.maxHp * .5, t);
      t.vineThornsT = Math.max(t.vineThornsT || 0, 5);
      status(b, t, 'MOON SICKLE WILD SHAPE!', '#6da670');
    }
    triggerWildShape(b, t, 'MOON SICKLE');
  }
  // Goodberries (from events/consumables)
  if (t.side === 'P' && t.alive && t.hp < t.maxHp * .6 && (b.goodberries || 0) > 0 && !t._berryUsed) {
    t._berryUsed = 1;
    b.goodberries--;
    heal(b, t, t, Math.round(t.maxHp * .18), { raw: 1 });
    t.nextBonus += 1;
    status(b, t, 'GOODBERRY +1 d20', '#6da670');
  }
  if (pre > 0 && t.alive && src && src.side !== t.side && !o.dot && t.kw && t.kw.ki) {
    t.ki = Math.min(KI_MAX, (t.ki || 0) + 1);
  }

  // Thorns & Reflection (Sir Dane, Juniper, Dwarven Plate)
  if (src && src.alive && t.alive && src.side !== t.side && !o.dot && !o.thorn && pre > 0) {
    if (t.it && t.it.meleeReflect && hd(src, t) <= 2) {
      const refD = Math.max(1, Math.round(pre * t.it.meleeReflect));
      later(b, 0, () => { if (src.alive && t.alive) hit(b, t, src, refD, { kind: 'phys', ty: 'bludgeoning', noBonus: 1, thorn: 1 }); });
    }
    // Sir Dane Spec 1 Oath of Devotion: taking hits from his Taunted foe retaliates with a Smite (1s CD)
    if (t.f.oathDevotion && src.st.tauntBy === t && b.time >= (t._devotionT || 0)) {
      t._devotionT = b.time + 1.0;
      later(b, 0, () => { if (src.alive && t.alive) triggerSmite(b, t, src, tierRoll(t, 1, 8), { thorn: 1 }); });
    }
    if (t.vineThornsT > 0 && hd(src, t) <= 1) {
      later(b, 0, () => { if (src.alive && t.alive) hit(b, t, src, Math.round(5 * tierScale(t)), { kind: 'magic', ty: 'poison', noBonus: 1, thorn: 1 }); });
    }
  }

  // Juniper innate Charge gain when Rooted foes take damage
  if (pre > 0 && t.side === 'E' && t.st.root > 0) {
    alive(b, 'P').filter(x => x.f.naturalRecovery && b.time >= (x._nrT || 0)).forEach(x => {
      x._nrT = b.time + .4;
      giveCharge(b, x, 10 * (x.chgX || 1), 1);
    });
  }

  // Kaska Spec 2 Pack Hunt: allies hitting Exposed foes heal 8% Max HP (1s CD)
  if (pre > 0 && src && src.side === 'P' && t.side === 'E' && t.st.exp > 0 && !o.dot && !o.onhit && alive(b, 'P').some(x => x.f.packHunt)) {
    if (b.time >= (src._phT || 0)) {
      src._phT = b.time + 1.0;
      heal(b, src, src, Math.max(1, Math.round(src.maxHp * .08)), { raw: 1 });
    }
  }

  // Warlock Patron Hex: Infernal Hex (+1d6 Fire, scales w/ tier) / Warlock Multiclass Hex (+1d4 Necrotic) on every hit
  if (pre > 0 && src && src.side === 'P' && t.side === 'E' && t.alive && t.st.hex && !o.dot && !o.hexProc) {
    const hexer = t.st.hex;
    const isInfernal = t.st.hexType === 'infernal';
    const dieS = isInfernal ? 6 : 4;
    const ty = isInfernal ? 'fire' : 'necrotic';
    const bonus = isInfernal ? roll(Math.max(1, Math.ceil((hexer.tier || 1) * 0.75)), dieS) : roll(1, dieS);
    later(b, 0, () => { if (t.alive) hit(b, hexer, t, bonus, { kind: 'magic', ty, noBonus: 1, hexProc: 1 }); });
  }
  // Sir Dane Nat 20 Crusade Aura: allies attacking his Taunted foe trigger a bonus 1d8 Smite + 10 Charge!
  if (pre > 0 && src && src.side === 'P' && t.side === 'E' && t.st.duelCrusade > 0 && !o.dot && !o.crusadeProc && !o.onhit) {
    giveCharge(b, src, 10, 1);
    later(b, 0, () => { if (t.alive && src.alive) triggerSmite(b, src, t, tierRoll(src, 1, 8), { onhit: 1 }); });
  }

  // Boon of Combat Prowess: basic attacks heal holder for 30% of damage dealt
  if (pre > 0 && src && src.alive && o.strike && !o.dot && src.boon === 'combat_prowess') {
    heal(b, src, src, Math.max(1, Math.round(pre * .30)), { raw: 1 });
  }
  // Druid Multiclass Primal Ward Thorns: reflects thorns to melee attackers while Primal Ward holds
  if (pre > 0 && t.alive && src && src.alive && src.side !== t.side && !o.dot && !o.thorn && t._primalWard && t.ward > 0 && hd(src, t) <= 1) {
    later(b, 0, () => { if (src.alive && t.alive) hit(b, t, src, Math.round(6 * tierScale(t)), { kind: 'magic', ty: 'poison', noBonus: 1, thorn: 1 }); });
  }
  if (t._primalWard && t.ward <= 0) t._primalWard = 0;

  // Barbarian Multiclass: dropping below 50% HP grants Rage (+15% DR & +20% Attack Speed)
  if (t.alive && t.side === 'P' && t.mc === 'Barbarian' && !t._mcRageUsed && t.hp < t.maxHp * .5) {
    t._mcRageUsed = 1;
    t.mcRage = 1;
    t.stats.rages = (t.stats.rages || 0) + 1;
    status(b, t, 'MULTICLASS RAGE!', '#ff6a4a');
    emitClassKw(b, t, 'rage', { kind: 'mc' });
  }
  // Boon of Dimensional Travel: teleports to safety at 40% HP once per fight
  if (t.alive && t.side === 'P' && t.boon === 'dimensional_travel' && !t._dimUsed && t.hp < t.maxHp * .4) {
    t._dimUsed = 1;
    const spots = DEPLOY.filter(h => freeHex(b, h, t)).sort((a, c) => nearestFoeD(b, t, c) - nearestFoeD(b, t, a));
    if (spots[0]) {
      t.c = spots[0].c; t.r = spots[0].r;
      b.events.push({ k: 'leap', id: t.id });
      b.units.forEach(x => { if (x.target === t) x.target = null; });
      status(b, t, 'DIMENSIONAL BLINK!', '#8fb4e6');
    }
  }

  if (pre > 0 || o.nec) {
    b.events.push({ k: 'dmg', id: t.id, v: pre, w: 0, sid: src ? src.id : undefined, ty: o.ty || 'force', near: src && hd(src, t) <= 1 && !o.area, src: src ? src.side : '', dot: o.dot, blk: !isRadiant(o) && !o.dot && raw > 4 && pre < raw * .55 });
  }
  if (pre > 0 && !o.dot) applyElement(b, src, t, o.el, pre, o);
  if (o.nec) addNec(b, src, t, o.nec);
  if (t.alive && !(t.zealotT > 0) && (t.hp <= 0 || (t.nec > 0 && t.hp <= t.nec))) kill(b, t, src, o);
  return pre;
}

function applyElement(b, src, t, el, dealt, o) {
  if (!el || !t.alive) return;
  const s = t.st;
  if (el === 'fire') {
    s.burn += dealt * .55;
    s.burnT = s.burnT || .5;
    if (src && src.key === 'cinder') src.stats.burnCredit = (src.stats.burnCredit || 0) + 1;
  } else if (el === 'cold') {
    s.frz += dealt * 2.0;
    if (s.frz >= 100) { s.frz = 0; stun(b, t, 1.2); status(b, t, 'FROZEN', '#8fd0ff'); }
  } else if (el === 'poison') {
    s.poison += Math.max(1, dealt * .15);
    if (src && src.f && src.f.nightshade) expose(b, t, 3.5 * chaK(src));
  } else if (el === 'acid') {
    s.acid = Math.min(6, s.acid + 1); s.acidT = 5;
  }
}

function applyStatus(b, src, t, el, v, max) {
  if (!t || !t.alive) return;
  const s = t.st;
  const k = src ? tierScale(src) : 1;
  if (el === 'burn') {
    s.burn += v * k;
    s.burnT = s.burnT || .5;
    if (src && src.key === 'cinder') src.stats.burnCredit = (src.stats.burnCredit || 0) + 1;
  } else if (el === 'cold') {
    s.frz += v;
    if (s.frz >= 100) { s.frz = 0; stun(b, t, 1.2); status(b, t, 'FROZEN', '#8fd0ff'); }
  } else if (el === 'poison') {
    s.poison += v * k;
    if (src && src.f && src.f.nightshade) expose(b, t, 3.5 * chaK(src));
  } else if (el === 'nec') {
    addNec(b, src, t, v);
  }
}

function addNec(b, src, t, amt) {
  if (!t || !t.alive) return;
  let v = amt * (src ? tierScale(src) : 1);
  if (t.boss) v /= 2;
  if (t.ward > 0) { const a = Math.min(t.ward, v); t.ward -= a; v -= a; if (a >= 1) b.events.push({ k: 'ward', id: t.id, v: Math.round(a) }); }
  if (v <= 0) return;
  t.nec = Math.min(t.maxHp, t.nec + v);
  if (src) src.stats.nec += v;
  status(b, t, 'NECROSIS +' + Math.round(v), '#9be38a');
}

function kill(b, t, src, o) {
  // 0. Pillar Zealot Rage: cannot die while Zealot Rage is active
  if (t.zealotT > 0 && t.side === 'P') {
    t.hp = Math.max(1, Math.round(t.nec) + 1);
    return;
  }
  // Lethal-Damage Revive Priority Order (v0.23 locked spec):
  //   1. Relentless Endurance (Zark passive) -> 1 HP
  if (t.f.relentlessEndurance && !t._relentlessUsed && t.side === 'P') {
    t._relentlessUsed = 1;
    t.hp = Math.max(1, Math.round(t.nec) + 1);
    callout(b, t, 'RELENTLESS!', '#ff6a4a');
    return;
  }
  //   2. Cleric Multiclass Channel Divinity -> revive at 25% Max HP (resettable!)
  if (t.mc === 'Cleric' && !t._cdUsed && t.side === 'P') {
    t.nec = 0;
    t.hp = Math.max(1, Math.round(t.maxHp * .25));
    triggerChannelDivinity(b, t, 'CD · CLERIC REVIVE!', null);
    return;
  }
  //   3. Boon of Recovery (Tier IV Epic Boon) -> revive at 50% Max HP
  if (t.boon === 'recovery' && !t._boonRecUsed && t.side === 'P') {
    t._boonRecUsed = 1;
    t.nec = 0;
    t.hp = Math.max(1, Math.round(t.maxHp * .50));
    callout(b, t, 'BOON OF RECOVERY!', '#ffe9a0');
    return;
  }
  // Undying enemies (blocked by Radiant damage or Necrosis)
  if (t.f.undying && !t._rose && !isRadiant(o) && t.nec <= 0 && Math.random() < t.f.undying) {
    t._rose = 1; t.hp = Math.round(t.maxHp * .3); status(b, t, 'GETS BACK UP', '#c8b48a'); return;
  }

  const wasTauntedBy = t.st.tauntBy;
  t.alive = false; t.hp = Math.max(0, t.hp);
  b.events.push({ k: 'die', id: t.id });
  b.units.forEach(x => {
    if (x.target === t) x.target = null;
    if (x.st.tauntBy === t) { x.st.taunt = 0; x.st.tauntBy = null; }
    if (x.isDouble && x.owner === t && x.alive) { x.alive = false; x.hp = 0; b.events.push({ k: 'die', id: x.id }); }
  });

  if (t.side === 'E') {
    const K = src && src.minion && src.owner ? src.owner : src;
    if (K && K.side === 'P' && K.stats) K.stats.kills = (K.stats.kills || 0) + 1;

    // Pillar Spec 1 Unstoppable Faith: kills extend Zealot Rage by 1.5s
    if (K && K.alive && K.f.unstoppableFaith && K.zealotT > 0) {
      K.zealotT += 1.5;
      status(b, K, 'ZEALOT +1.5s', '#ffe9a0');
    }

    // Wallaby Spec 1 Cutthroat (or legacy Slippery): kills refund 60% Charge
    if (K && K.alive && (K.f.cutthroat || K.f.slippery)) {
      giveCharge(b, K, 60);
    }

    // Gains Gilded death: pop +1 Gold (which triggers Arcane Recovery!)
    if (t.st.gilded) {
      const gainer = t.st.gilded;
      if (gainer.stats) gainer.stats.gildedKills = (gainer.stats.gildedKills || 0) + 1;
      const gotG = gainGold(b, gainer, 1, 'GILDED');
      if (!gotG && gainer.alive && gainer.f.transmuter) triggerArcaneRecovery(b, gainer, 15, 'GILDED KILL');
    }

    // Hunter's Mark death triggers
    if (t.st.mark) {
      const lorcan = alive(b, 'P').find(x => x.key === 'lorcan');
      if (lorcan) lorcan.stats.markedKills = (lorcan.stats.markedKills || 0) + 1;
    }

    // Lorcan Favoured Enemy quest: killing an Elite or Boss permanently grants +1 DEX
    if ((t.elite || t.boss) && alive(b, 'P').some(x => x.key === 'lorcan' && x.questDone)) {
      b.lorcanBossKills = (b.lorcanBossKills || 0) + 1;
      b.trophiesEarned = b.trophiesEarned || [];
      archOf(t.key).forEach(a => { if (!b.trophiesEarned.includes(a)) b.trophiesEarned.push(a); });
    }

    // Lumen Spec 1 Searing Focus: permanent Attack Speed for the fight whenever a Hexed enemy dies
    if ((t.st.radHex > 0 || t.st.hex) && alive(b, 'P').some(x => x.f.searingFocus)) {
      alive(b, 'P').filter(x => x.f.searingFocus).forEach(lm => {
        lm.permHaste = Math.min(120, (lm.permHaste || 0) + 18);
        status(b, lm, 'SEARING +18% SPD', '#ffe9a0');
      });
    }

    // Nettle Infernal Hex / Warlock Multiclass Hex death explosion & jump
    if (t.st.hex) {
      triggerPactBoon(b, t.st.hex, t, K);
    }

    // Blackrazor (v0.23 Legendary): kills grant 35% Max HP as Ward and +25% Attack Speed for the fight
    if (K && K.alive && K.side === 'P' && K.it && K.it.blackrazorKill) {
      addWard(b, K, Math.round(K.maxHp * .35), K.maxHp * .8, K);
      K.permHaste = Math.min(150, (K.permHaste || 0) + 25);
      status(b, K, 'BLACKRAZOR!', '#c48fe6');
    }

    // Damage hero takedown charge
    if (K && K.alive && K.side === 'P' && K.role === 'Damage') {
      giveCharge(b, K, 25, 1);
      friends(b, K).filter(a => a !== K && !a.minion && hd(a, K) <= 3).forEach(a => giveCharge(b, a, 10, 1));
      K.stats.takedowns = (K.stats.takedowns || 0) + 1;
    }
  }

  // Act 2 Boss: Wielder of Blackrazor gains Ward, Haste & Damage whenever ANY unit dies!
  alive(b, 'E').filter(x => x !== t && x.f && x.f.blackrazorBoss).forEach(br => {
    addWard(b, br, Math.round(br.maxHp * .08), br.maxHp * .35, br);
    br.permHaste = Math.min(40, (br.permHaste || 0) + 8);
    br.dm *= 1.06;
    status(b, br, 'SOUL DEVOURED!', '#c48fe6');
  });

  if (t.f.deathPuff) {
    const ps = alive(b, t.side === 'P' ? 'E' : 'P').filter(x => hd(x, t) <= 1);
    b.events.push({ k: 'area', id: t.id, shape: 'nova', r: 1, ty: 'poison', ids: ps.map(x => x.id) });
    ps.forEach(x => { x.st.poison += t.f.deathPuff * t.dm; status(b, x, 'CHOKING ASH', '#9be38a'); });
  }
}

function triggerSunlitCenser(b, holder) {
  if (!holder || !holder.alive || !holder.it || !holder.it.healHolyPulse) return;
  if (b.time < (holder._censerT || 0)) return;
  holder._censerT = b.time + 1.0;
  const near = foes(b, holder).sort((a, c) => hd(a, holder) - hd(c, holder))[0];
  if (near) later(b, 0, () => { if (holder.alive && near.alive) hit(b, holder, near, roll(1, 6), { kind: 'radiant', ty: 'radiant', noBonus: 1, onhit: 1 }); });
}

function heal(b, src, t, amt, o = {}) {
  if (!t || !t.alive) return 0;
  let v = amt;
  if (src && !o.raw) {
    if (src.bon) v += src.bon.k;
    v *= src.dm;
  }
  if (src && src.mc === 'Sorcerer' && src._casting) v *= 1.2;
  const ot = otLevel(b);
  if (ot > 0) v *= Math.max(.4, 1 - .15 * ot);
  v = Math.round(v);
  const room = Math.max(0, t.maxHp - t.hp);
  const got = Math.min(room, v);
  const over = Math.max(0, v - room);
  t.hp += got;
  t.stats.healIn = (t.stats.healIn || 0) + got;
  if (got > 0 && t.side === 'P' && !o.raw) {
    const sh = watchShare(b, t);
    for (const a of b.units) {
      if (a.alive && a.side === 'P' && a !== src && a.trig === 'watchful' && hd(a, t) <= a.rng + 1) {
        giveCharge(b, a, got / t.maxHp * CHG.watchful * .5 * sh * (a.chgX || 1), 1);
      }
    }
  }
  if (src) src.stats.heal += got;
  // Mother Laurel Spec 1 Overgrowth Ward: excess healing becomes Ward
  if (over > 0 && src && src.f && src.f.overgrowthWard && t.alive) {
    addWard(b, t, over, t.maxHp * .5, src);
  }
  if (got > 0) {
    b.events.push({ k: 'heal', id: t.id, v: got, sid: src ? src.id : undefined });
    triggerSunlitCenser(b, src);
    // Brother Jamison Emboldening Bond: bonded allies share 30% (50% Shared Grace) of Heals
    if (!o.bondShare && t.bonded && t.bonded.alive) {
      const jm = t.bonded;
      const pct = jm.f.sharedGrace ? .50 : .30;
      const shareAmt = Math.round(got * pct);
      if (shareAmt > 0) {
        friends(b, t).filter(a => a !== t && !a.minion && a.bonded === jm).forEach(a => {
          heal(b, jm, a, shareAmt, { raw: 1, bondShare: 1 });
        });
      }
      // Jamison Spec 2 Radiant Link: whenever a bonded ally is healed, zap nearest foe for 1d6 Radiant (1s CD)
      if (jm.f.radiantLink && b.time >= (jm._rlCd || 0)) {
        jm._rlCd = b.time + 1.0;
        const near = foes(b, jm).filter(x => !x.hidden).sort((a, c) => hd(a, jm) - hd(c, jm))[0];
        if (near) later(b, 0, () => { if (jm.alive && near.alive) hit(b, jm, near, tierRoll(jm, 1, 6), { kind: 'radiant', ty: 'radiant', noBonus: 1, onhit: 1 }); });
      }
    }
  }
  return got;
}

function addWard(b, t, v, cap, giver, o = {}) {
  if (!t || !t.alive) return;
  const ot = otLevel(b);
  if (ot > 0) v *= Math.max(.4, 1 - .15 * ot);
  v = Math.round(v);
  if (cap) v = Math.min(v, Math.max(0, cap - t.ward));
  if (v <= 0) return;
  t.ward += v;
  if (t.f && t.f.gilthraxWard) t.wardStored = (t.wardStored || 0) + v;
  t.stats.wardIn = (t.stats.wardIn || 0) + v;
  if (giver) {
    t._wardBy = giver;
    if (giver.stats) giver.stats.ward = (giver.stats.ward || 0) + v;
    triggerSunlitCenser(b, giver);
  }
  b.events.push({ k: 'ward', id: t.id, v });
  // Brother Jamison Emboldening Bond: bonded allies share 30% (50% Shared Grace) of Wards
  if (!o.bondShare && t.bonded && t.bonded.alive) {
    const jm = t.bonded;
    const pct = jm.f.sharedGrace ? .50 : .30;
    const shareAmt = Math.round(v * pct);
    if (shareAmt > 0) {
      friends(b, t).filter(a => a !== t && !a.minion && a.bonded === jm).forEach(a => {
        addWard(b, a, shareAmt, a.maxHp * .6, jm, { bondShare: 1 });
      });
    }
  }
}

function giveCharge(b, u, v, quiet) {
  if (!u || !u.abil || !u.alive || !(v > 0)) return;
  const damp = (b.hazard === 'dampener' && b.time < 10) ? .65 : 1;
  u.charge = Math.min(100, u.charge + v * damp);
  if (!quiet && v * damp >= 15) status(b, u, '+' + Math.round(v * damp) + ' CHARGE', '#ffd76a');
}

/* ---------- Forced Movement (Pushes) ---------- */
const PDIRS = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
function pushPath(b, t, dir, n) {
  let c = t.c, r = t.r, i = 0, stop = null;
  for (; i < n; i++) {
    const h = { c: c + dir[0], r: r + dir[1] };
    const fp = fpCells(h, szOf(t));
    if (!fp.every(passable)) { stop = 'wall'; break; }
    const o = b.units.find(x => x.alive && x !== t && fp.some(q => covers(x, q)));
    if (o) { stop = o; break; }
    c = h.c; r = h.r;
  }
  return { c, r, left: n - i, stop };
}
function push(b, src, t, n, o = {}) {
  if (!t || !t.alive) return;
  if (t.it && t.it.pushRes) { status(b, t, 'STANDS FIRM', '#c8b48a'); return; }
  if (t.f.pushResist && Math.random() < t.f.pushResist) { status(b, t, 'STANDS FIRM', '#c8b48a'); return; }
  if (b.hazard === 'frictionless') n *= 2;
  if (t.boss) n = Math.max(1, n - 1);
  if (szOf(t) > 1) { n--; if (n <= 0) return; }
  if (t.side === 'P' && (t.str || 0) >= 3) { n--; if (n <= 0) { status(b, t, 'STANDS FIRM', '#c8b48a'); return; } }
  const away = [Math.sign(t.c - src.c), Math.sign(t.r - src.r)];
  if (!away[0] && !away[1]) away[1] = -1;
  const pp = pushPath(b, t, away, n);
  const moved = pp.c !== t.c || pp.r !== t.r;
  t.c = pp.c; t.r = pp.r;
  if (moved) b.events.push({ k: 'leap', id: t.id });
  if (pp.stop && pp.left > 0) {
    status(b, t, 'SLAM', '#ffd27a');
    hit(b, src, t, roll(pp.left, 6), { kind: 'phys', ty: 'bludgeoning', noBonus: 1 });
    if (o.stun) stun(b, t, o.stun);
  }
  terrainEnter(b, t);
}

function terrainEnter(b, u) {
  const tt = tile(u);
  if (tt === 'w' && !u.f.webwalk) { u.st.root = Math.max(u.st.root, 1.2); status(b, u, 'WEBBED', '#e6e6f0'); }
  if (tt === '^' && !u.f.fireproof) { u.st.burn = Math.max(u.st.burn, 8); u.st.burnT = u.st.burnT || .5; }
}
function spawn(b, k, c, r) {
  const probe = { sz: E[k] && E[k].large ? 2 : 1 };
  const spot = [{ c, r }, ...nbrs({ c, r })].find(h => freeHex(b, h, probe));
  if (!spot) return null;
  const u = mkEnemy(k, spot.c, spot.r, b.eTier, ENC[b.enc]);
  b.units.push(u); b.events.push({ k: 'spawn', id: u.id }); return u;
}
function spawnWave(b, w) { w.done = 1; b.events.push({ k: 'wave' }); w.u.forEach(([k, c, r]) => spawn(b, k, c, r)); }

/* ---------- Ability d20 Roll (WIS Floor, Advantage, Inspiration Dice, Luckstone, Epic Boons) ---------- */
function rollNaturalD20(b, u) {
  const floor = Math.min(12, Math.max(u.d20Floor || 1, u.auraFloor || 1));
  let r1 = d20();
  const hasPermAdv = !!(u.it && u.it.permAdvantage);
  if (u.advantage > 0 || hasPermAdv) {
    if (!hasPermAdv) u.advantage = 0;
    const r2 = d20();
    r1 = Math.max(r1, r2);
    status(b, u, `ADV (${r1})`, '#ffd76a');
  }
  if (r1 === 1 && u.f.lucky) { r1 = d20(); status(b, u, 'LUCKY', '#9fd86a'); }
  return Math.max(floor, r1);
}

function castAbility(b, u, isRecall = false) {
  const A = u.abil;
  if (!isRecall) {
    u._lastCastT = b.time;
    u._casts = (u._casts || 0) + 1;
  }

  let nat, P, bonus = u.rollBonus + u.nextBonus - (u.st.hexSlow > 0 ? 3 : 0);
  if (!isRecall) u.nextBonus = 0;

  let usedInsp = null;
  let usedMote = null;
  if (!isRecall && u.inspMote) {
    usedMote = u.inspMote;
    u.inspMote = null;
  }
  if (!isRecall && u.it && u.it.clockworkHigh && !u._clockworkUsed) {
    u._clockworkUsed = 1;
    nat = Math.max(15, u.bands.hi);
    P = 2;
    status(b, u, 'CLOCKWORK HIGH', '#ffd76a');
  } else {
    nat = rollNaturalD20(b, u);
    if (!isRecall && u.it && u.it.clockworkFloor && !u._clockworkUsed) {
      u._clockworkUsed = 1;
      if (nat < 10) { nat = 10; status(b, u, 'CLOCKWORK 10', '#ffd76a'); }
    }
    let nat20Threshold = 20;
    if (u.boon === 'fate') nat20Threshold = Math.min(nat20Threshold, 19);
    if (u.it && u.it.critThreshold) nat20Threshold = Math.min(nat20Threshold, u.it.critThreshold);
    if (!isRecall && u.inspDie) {
      usedInsp = u.inspDie;
      u.inspDie = null;
      const inspRoll = roll(1, usedInsp.sides) + (usedInsp.chaBonus || 0);
      bonus += inspRoll;
      if (usedInsp.expandCrit) nat20Threshold = Math.min(nat20Threshold, 19);
      status(b, u, `INSPIRED +${inspRoll}`, '#ffd76a');
    }

    if (nat === 1) {
      u.charge = 50; u.stats.rolls[0]++;
      b.events.push({ k: 'roll', id: u.id, nat, band: -1, name: A.n, side: u.side });
      status(b, u, 'FIZZLE', '#ff9c94');
      return;
    } else if (nat >= nat20Threshold) {
      P = 3;
    } else {
      const v = Math.min(19, nat + bonus);
      P = v >= u.bands.hi ? 2 : v <= u.bands.low ? 0 : 1;
      if (P === 0 && !isRecall && u.it && u.it.rerollLowOnce && !u._luckUsed) {
        u._luckUsed = 1;
        const n2 = rollNaturalD20(b, u);
        if (n2 >= nat20Threshold) { nat = n2; P = 3; }
        else { const v2 = Math.min(19, n2 + bonus); const p2 = v2 >= u.bands.hi ? 2 : v2 <= u.bands.low ? 0 : 1; if (p2 > P) { nat = n2; P = p2; } }
        status(b, u, 'LUCKSTONE', '#9fd86a');
      }
    }
  }

  if (!isRecall) u.charge = 0;
  u.stats.rolls[P + 1]++;
  b.events.push({ k: 'roll', id: u.id, nat, band: Math.min(P, 2), name: A.n + (P === 3 ? '' : ' · ' + BAND_N[P]), side: u.side, bonus });

  // Unified Bardic Inspiration Spend (Lore Die OR Creation Mote)
  const spentInspiration = !!(usedInsp || usedMote);
  if (usedMote) {
    u._activeMote = usedMote; // Adds bonus damage on this cast & +2g if it kills!
  }
  if (spentInspiration) {
    const giver = (usedInsp && usedInsp.giver) || (usedMote && usedMote.giver) || u;
    if (usedInsp) {
      const fDur = 4.0 * chaK(giver);
      u.inspAmpT = Math.max(u.inspAmpT || 0, fDur);
      status(b, u, 'INSPIRED!', '#ffd76a');
    }
    emitClassKw(b, u, 'bardic_inspiration', { action: 'spend', band: P, giver });
    if (usedInsp) passInspDie(b, u, usedInsp);
  }

  u._casting = 1;
  const tgt = u.target;
  try { A.fx(b, u, P); } finally { u._casting = 0; u._activeMote = null; }

  // Boon of Spell Recall: abilities cast a second time on High and Nat 20
  if (!isRecall && u.boon === 'spell_recall' && P >= 2 && u.alive) {
    later(b, .18, () => {
      if (u.alive && !b.over) {
        status(b, u, 'SPELL RECALL!', '#ffd76a');
        castAbility(b, u, true);
      }
    });
  }

  // Multiclass Dip on-cast triggers (Fighter, Wizard, Bard)
  if (!isRecall && u.side === 'P' && u.alive) {
    if (u.mc === 'Fighter') {
      triggerActionSurge(b, u, { target: tgt, label: 'MC · ACTION SURGE' });
    }
    if (u.mc === 'Wizard' && P >= 2) {
      later(b, .05, () => { if (u.alive) triggerArcaneRecovery(b, u, 25, 'MC ARCANE'); });
    }
    if (u.mc === 'Bard' && u._casts === 1) {
      const ally = friends(b, u).filter(a => a !== u && !a.minion && a.abil).sort((a, c) => hd(a, u) - hd(c, u))[0];
      if (ally) grantInspDie(b, u, ally, 6, 0);
    }
  }

  // Toot Spec 2 Street Performer: allies have a chance to pop +1 Gold on High/Nat 20
  if (!isRecall && u.side === 'P' && P >= 2) {
    alive(b, 'P').filter(x => x.f.streetPerformer).forEach(toot => {
      if (Math.random() < (P === 3 ? .85 : .45)) gainGold(b, toot, 1, 'STREET PERFORMER');
    });
  }

  // Item on-cast & Class Keyword hooks
  const I = u.it || {};
  if (!isRecall && I.castChargeRefund) {
    later(b, .05, () => { if (u.alive) giveCharge(b, u, I.castChargeRefund, 1); });
  }
  if (!isRecall && I.firstCastRoot && u._casts === 1 && tgt && tgt.alive && tgt.side !== u.side) {
    applyRoot(b, u, tgt, I.firstCastRoot);
  }
  if (!isRecall && I.wardOnCastPct && b.time >= (u._wocCd || 0)) {
    u._wocCd = b.time + 1.0;
    addWard(b, u, Math.round(u.maxHp * I.wardOnCastPct), u.maxHp * .5, u);
  } else if (!isRecall && I.wardOnCast) {
    addWard(b, u, I.wardOnCast * u.dm, u.maxHp * .5, u);
  }
  if (!isRecall && P >= 2 && I.highSmite && tgt && tgt.alive && tgt.side !== u.side) {
    triggerSmite(b, u, tgt, roll(1, 8), { label: 'HOLY SYMBOL SMITE' });
  }
  if (!isRecall && P >= 2 && I.firstHighResetCD && !u._devoutResetUsed) {
    u._devoutResetUsed = 1;
    u._cdUsed = 0; u._pres = 0;
    status(b, u, 'CD RESET!', '#ffe9a0');
  }
  if (!isRecall && P >= 2 && I.starBolt) {
    const lowFoe = foes(b, u).filter(x => !x.hidden).sort((a, c) => a.hp - c.hp)[0];
    if (lowFoe) {
      b.events.push({ k: 'beam', id: u.id, tid: lowFoe.id, ty: 'radiant' });
      hit(b, u, lowFoe, roll(2, 6), { kind: 'radiant', ty: 'radiant', noBonus: 1 });
    }
  }
  if (!isRecall && P >= 2 && I.highSorcery && u.kw && u.kw.metamagic) {
    addSorcery(b, u, 1, null, null);
  }
  if (!isRecall && P >= 2 && I.evadeKi && u.kw && u.kw.ki && b.time >= (u._dkCd || 0)) {
    u._dkCd = b.time + 1.0;
    u.ki = Math.min(KI_MAX, (u.ki || 0) + 1);
  }
  if (!isRecall && I.holyAvenger && tgt && tgt.alive && tgt.side !== u.side && b.time >= (u._haCd || 0)) {
    u._haCd = b.time + 1.0;
    hit(b, u, tgt, roll(2, 6), { kind: 'radiant', ty: 'radiant', noBonus: 1 });
    friends(b, u).filter(a => !a.minion && hd(a, u) <= 1).forEach(a => heal(b, u, a, Math.round(a.maxHp * .08), { raw: 1 }));
  }
  if (!isRecall && I.quickenFirst && u._casts === 1) {
    u.stats.metamagics = (u.stats.metamagics || 0) + 1;
    emitClassKw(b, u, 'metamagic', { kind: 'quicken' });
  }
  if (!isRecall && I.firstCastRec && u._casts === 1) {
    later(b, .04, () => { if (u.alive) triggerArcaneRecovery(b, u, I.firstCastRec, 'PEARL'); });
  }
  if (!isRecall && P === 3 && I.nat20Refund) later(b, .05, () => { if (u.alive) giveCharge(b, u, I.nat20Refund); });
  if (!isRecall && P >= 2 && I.highMarks && tgt && tgt.alive && tgt.side !== u.side) markFoe(b, u, tgt);
  if (!isRecall && P >= 2 && I.highKi && u.kw && u.kw.ki) u.ki = Math.min(KI_MAX, (u.ki || 0) + 1);
}

/* ---------- Targeting & Movement ---------- */
const LANE_W = .6;
const TCOST = { ',': 2, 'w': 4, '^': 8 };
const WEBFREE = new Set(['spider', 'nezznar']);
const tcost = h => TCOST[tile(h)] || 1;
const BRUSH_SEE = 2;
const inBrush = u => tile(u) === 'v';
const veiled = (b, t, obs) => inBrush(t) && b.time >= (t._shown || 0) && hd(t, obs) > BRUSH_SEE && !(obs.f && obs.f.keenSight);

function walkField(b, u) {
  const block = new Set(), ally = new Set();
  b.units.forEach(x => { if (!x.alive || x === u) return; (x.side === u.side ? ally : block).add(key(x)); });
  const dist = new Map([[key(u), 0]]);
  const q = [{ h: { c: u.c, r: u.r }, d: 0 }];
  while (q.length) {
    let mi = 0; for (let i = 1; i < q.length; i++) if (q[i].d < q[mi].d) mi = i;
    const { h, d } = q.splice(mi, 1)[0];
    if (d > dist.get(key(h))) continue;
    for (const n of walkNbrs(h)) {
      const nk = key(n); if (block.has(nk)) continue;
      const nd = d + tcost(n) + (ally.has(nk) ? 2 : 0) + ((n.c !== h.c && n.r !== h.r) ? .01 : 0);
      if (nd < (dist.get(nk) ?? 1e9)) { dist.set(nk, nd); q.push({ h: n, d: nd }); }
    }
  }
  return dist;
}
function walkTo(u, field, x) {
  if (u.rng >= 2) { let best = 1e9; for (const [k, d] of field) { if (d >= best) continue; const [c, r] = k.split(',').map(Number); if (canHit(u, { c, r }, x)) best = d; } return best; }
  let best = 1e9; nbrs(x).forEach(n => { const d = field.get(key(n)); if (d !== undefined && d < best) best = d; }); return best;
}

function pickTarget(b, u) {
  if (u.st.taunt > 0 && u.st.tauntBy && u.st.tauntBy.alive && !(u.st.charm > 0)) return u.st.tauntBy;
  if (u.st.charm > 0) { const own = alive(b, u.side).filter(x => x !== u && !x.hidden).sort((a, c) => hd(a, u) - hd(c, u)); return own[0] || null; }
  const fs = foes(b, u).filter(x => !x.hidden && !veiled(b, x, u));
  if (!fs.length) return null;
  if (u.f.huntMark) { const m = fs.find(x => x.st.mark); if (m && !u.target) return m; }
  const cur = u.target && u.target.alive && !u.target.hidden ? u.target : null;
  const ranged = u.rng >= 3;
  const onMe = fs.filter(x => hd(x, u) <= 1 && (ranged ? x.target === u : true));
  if (onMe.length && !(cur && hd(cur, u) <= 1)) { const front = onMe.filter(x => x.rng <= 2); return front.find(x => x.target === u) || front[0] || onMe[0]; }
  if (cur) return cur;
  const field = walkField(b, u);
  const W = new Map(fs.map(x => [x, walkTo(u, field, x)]));
  const w = x => (W.get(x) >= 1e9 ? 60 : W.get(x)) + Math.abs(x.c - u.c) * LANE_W;
  return fs.slice().sort((a, c) => (w(a) - w(c)) || (a.hp - c.hp))[0];
}

function dijkstra(b, u, maxCost) {
  const S = szOf(u);
  const occ = new Map();
  b.units.forEach(x => { if (x.alive && x !== u) fpCells(x, szOf(x)).forEach(q => occ.set(key(q), x)); });
  const blockedBy = n => { if (S === 1) return occ.get(key(n)); let o = null; for (const q of fpCells(n, S)) { const y = occ.get(key(q)); if (y) { if (y.side !== u.side) return y; o = y; } } return o; };
  const steps = h => S === 1 ? walkNbrs(h) : nbrs(h).filter(n => fpCells(n, S).every(passable)).map(n => ({ c: n.c, r: n.r, sz: S }));
  const dist = new Map([[key(u), 0]]), first = new Map(), hs = new Map([[key(u), { c: u.c, r: u.r, sz: S }]]);
  const q = [{ h: { c: u.c, r: u.r, sz: S }, d: 0 }];
  while (q.length) {
    let mi = 0; for (let i = 1; i < q.length; i++) if (q[i].d < q[mi].d) mi = i;
    const { h, d } = q.splice(mi, 1)[0]; const k = key(h);
    if (d > dist.get(k) || d > maxCost) continue;
    for (const n of steps(h)) {
      const nk = key(n); const o = blockedBy(n); if (o && o.side !== u.side) continue;
      const nd = d + tcost(n) + (o ? 3 : 0) + ((n.c !== h.c && n.r !== h.r) ? .01 : 0);
      if (nd < (dist.get(nk) ?? 1e9)) { dist.set(nk, nd); hs.set(nk, n); first.set(nk, k === key(u) ? n : first.get(k)); q.push({ h: n, d: nd }); }
    }
  }
  const taken = k => { const h = hs.get(k); return !!(h && blockedBy(h)); };
  return { dist, first, hs, occ: { has: taken } };
}
function pathStep(b, u, goal) {
  const { dist, first, hs, occ } = dijkstra(b, u, 80); let best = null, bd = 1e9;
  for (const [k, d] of dist) { if (k === key(u) || occ.has(k)) continue; const h = hs.get(k); if (goal(h) && d < bd) { bd = d; best = k; } }
  if (!best) return null; const f = first.get(best); if (!f || occ.has(key(f))) return 'wait'; return f;
}
function nearestFoeD(b, u, h) { let m = 99; foes(b, u).forEach(f => { m = Math.min(m, hd(f, h)); }); return m; }
function moveStep(b, u) {
  const t = u.target; if (!t || u.st.root > 0) return null;
  if (canHit(u, u, t) && (u.rng < 3 || u._attacked || nearestFoeD(b, u, u) >= 2)) return null;
  if (u.rng >= 3) { const s = pathStep(b, u, h => canHit(u, h, t) && nearestFoeD(b, u, h) >= 2 && tile(h) !== '^'); if (s) return s; }
  return pathStep(b, u, h => canHit(u, h, t));
}

/* ---------- Battlefield Archetypes ---------- */
const EARCH = {
  charger:   { n: 'Charger',    x: 'Leaps at the back row at fight start and every 8s. Frontliners with STR +3 Intercept it.' },
  archer:    { n: 'Archer',     x: 'Shoots from behind its front line.' },
  wall:      { n: 'Shield wall',x: 'Heavy armor; allies next to it get +2 AC.' },
  brute:     { n: 'Brute',      x: 'High HP and heavy single hits.' },
  caster:    { n: 'Caster',     x: 'Charges spells aimed at hero clumps.' },
  shaman:    { n: 'Shaman',     x: 'Heals and protects allies.' },
  swarm:     { n: 'Swarm',      x: 'Many fast bodies.' },
  summoner:  { n: 'Summoner',   x: 'Adds new foes over time.' },
  afflicter: { n: 'Afflicter',  x: 'Applies Poison, Burn, or Necrosis.' }
};
const archOf = k => E[k] && E[k].arch ? [].concat(E[k].arch) : [];
const INTERCEPT_STR = 3;
const canIntercept = x => x.alive && x.side === 'P' && !x.minion && x.st.stun <= 0 && x.rng <= 2 && (x.str || 0) >= INTERCEPT_STR;
const watchShare = (b, t) => { let n = 0; for (const a of b.units) if (a.alive && a.side === 'P' && a.trig === 'watchful' && hd(a, t) <= a.rng + 1) n++; return n > 1 ? 1 / n : 1; };

function chargeTarget(b, u) {
  const hs = foes(b, u).filter(x => !x.hidden && !x.pet);
  if (!hs.length) return null;
  return hs.slice().sort((a, c) => ((c.rng >= 3 ? 40 : 0) - (a.rng >= 3 ? 40 : 0)) || (a.maxHp - c.maxHp))[0];
}
function charge(b, u) {
  const t = chargeTarget(b, u); if (!t || hd(t, u) <= 1) return false;
  const line = lineHexes(u, t, hd(u, t));
  let stop = null, at = 1e9;
  for (const x of foes(b, u)) { if (x === t || !canIntercept(x)) continue; const i = line.findIndex(h => hd(h, x) <= 1); if (i >= 0 && i < at) { at = i; stop = x; } }
  const dest = stop || t;
  const spot = walkNbrs(dest).filter(h => freeHex(b, h, u)).sort((a, c) => hd(a, u) - hd(c, u))[0];
  if (!spot) return false;
  u.c = spot.c; u.r = spot.r; b.events.push({ k: 'leap', id: u.id }); u.target = dest;
  if (stop) { u.st.root = Math.max(u.st.root, 1); u.st.taunt = 2; u.st.tauntBy = stop; stop.stats.intercepts = (stop.stats.intercepts || 0) + 1; callout(b, u, 'INTERCEPTED', '#e0b45a'); }
  else { stun(b, t, .4); status(b, u, 'CHARGE', '#ff9c94'); }
  return true;
}

/* ---------- Attacks & On-Hit ---------- */
function attackIv(b, u) {
  const rageHaste = (u.bearRage || 0) * 10 + (u.mcRage ? 20 : 0);
  const hexStacks = (u.key === 'lumen' && u.target && u.target.st) ? ((u.target.st.radHex || 0) + (u.target.st.hex ? 2 : 0)) : 0;
  const radHexHaste = hexStacks > 0 ? Math.min(120, hexStacks * 12) : 0;
  const h = u.haste + (u.permHaste || 0) + (u.auraHaste || 0) + (u.tempHasteT > 0 ? u.tempHaste : 0) + rageHaste + radHexHaste;
  const slow = (u.st.stag > 0 ? 1.3 : 1) * (u.st.hexSlow > 0 ? 1.25 : 1) * (u.st.chillT > 0 ? 1.15 : 1);
  return u.iv / Math.max(.4, 1 + h / 100) * (1 + Math.min(50, u.st.frz / 2) / 100) * slow / (1 + .2 * otLevel(b));
}
const moveTime = (b, u) => .42 * COMBAT_TEMPO * 30 / u.ft * (u.st.stag > 0 ? 1.3 : 1) * (b.hazard === 'frictionless' ? 1.2 : 1) / (1 + .2 * otLevel(b));

function doAttack(b, u) {
  if (u.st.fear > 0) return false;
  // Toot Brass Solo: stationary 0-damage musician with organic chance to pop +1 Gold
  if (u.atk && u.atk.noDmg) {
    u._attacked = 1;
    if (Math.random() < (u.atk.goldChance || 0.35)) gainGold(b, u, 1, 'BRASS SOLO');
    if (u.abil) giveCharge(b, u, u.pa * (u.chgX || 1), 1);
    return true;
  }
  let t = u.target; u._attacked = 1;
  if (!t || !canHit(u, u, t)) return false;
  strike(b, u, t);
  for (let i = 1; i < (u.atk.hits || 1); i++) {
    later(b, .1 * i, () => { if (u.alive && u.st.stun <= 0 && t.alive && canHit(u, u, t)) strike(b, u, t); });
  }
  // Boots of Speed: first attack each fight strikes twice
  if (u.it && u.it.openingDouble && !u._bootDoubleUsed) {
    u._bootDoubleUsed = 1;
    later(b, .08, () => { if (u.alive && u.st.stun <= 0 && t.alive && canHit(u, u, t)) strike(b, u, t); });
  }
  // Scimitar of Speed: every 3rd attack triggers an immediate bonus strike
  if (u.it && u.it.every3Strike) {
    u._scimCnt = (u._scimCnt || 0) + 1;
    if (u._scimCnt % 3 === 0) {
      later(b, .08, () => { if (u.alive && u.st.stun <= 0 && t.alive && canHit(u, u, t)) strike(b, u, t); });
    }
  }
  if (u.abil && (u.side === 'E' || u.trig === 'striking')) giveCharge(b, u, u.pa * (u.chgX || 1), 1);
  return true;
}

function strike(b, u, t, m) {
  const a = u.atk;
  const dmgRoll = a.d[0] > 0 ? tierRoll(u, a.d[0], a.d[1]) : 0;
  const got = hit(b, u, t, dmgRoll + (a.flat || 0), { kind: a.kind, el: a.el, ty: a.ty, melee: u.rng <= 2, nec: a.nec || 0, mul: (a.mul || 1) * (m || 1), strike: 1 });
  if (t.alive || got > 0) {
    onHit(b, u, t, got);
  }
  postStrikeHooks(b, u, t, got);
  return got;
}

function onHit(b, u, t, got) {
  for (const e of u.onHit || []) {
    if (!t.alive) break;
    const amt = () => e.d ? roll(e.d[0], e.d[1]) : (e.flat || 0);
    const o = { kind: e.kind || 'magic', el: e.el || null, ty: e.el || e.ty || (isRadiant(e) ? 'radiant' : 'force'), noBonus: 1, onhit: 1 };
    if (e.t === 'bonus') hit(b, u, t, amt(), o);
    else if (e.t === 'echo') later(b, e.delay || .25, () => { if (t.alive) hit(b, u, t, amt(), o); });
    else if (e.t === 'status') applyStatus(b, u, t, e.el, e.v || 1, e.max);
  }
  // Hunter's Mark (v0.23 standardized): Marked foes take +1d4 (+1d6 w/ Pack Hunter) per stack on EVERY hit!
  if (t.alive && t.st.markStacks > 0 && u.side === 'P') {
    const dieS = alive(b, 'P').some(x => x.f.packHunter) ? 6 : 4;
    const stacks = Math.min(8, t.st.markStacks);
    hit(b, u, t, roll(stacks, dieS), { kind: 'phys', ty: 'piercing', noBonus: 1, onhit: 1 });
    if (u.it && u.it.oathbowMod && b.time >= (u._obCd || 0)) {
      u._obCd = b.time + 1.0;
      expose(b, t, 2);
      giveCharge(b, u, 5, 1);
    }
  }
  // Frost Brand (v0.23): basic attacks Stagger targets (-30% Attack Speed, 2s)
  if (u.it && u.it.staggerOnHit && t.alive) stagger(b, t, 2);
  if (u.it && u.it.chillOnHit && t.alive) t.st.chillT = Math.max(t.st.chillT || 0, 2);
  // Cloak of Arachnida (v0.23): basic attacks apply 2 Poison (1s CD)
  if (u.it && u.it.poisonOnHit && t.alive && b.time >= (u._arachCd || 0)) {
    u._arachCd = b.time + 1.0;
    applyStatus(b, u, t, 'poison', u.it.poisonOnHit);
  }
  // Bram Spec 2 Divine Strike: Bram & adjacent allies add +1d6 (×Bram tier) Radiant to melee attacks
  if (u.side === 'P' && u.rng <= 2 && t.alive) {
    const bram = alive(b, 'P').find(x => x.f.divineStrike && hd(x, u) <= 1);
    if (bram) hit(b, u, t, tierRoll(bram, 1, 6), { kind: 'radiant', ty: 'radiant', noBonus: 1, onhit: 1 });
  }
  // Pillar Spec 2 Living Beacon: empowered next strike adds +1d6 (×tier) Radiant
  if (u._beaconHoly && t.alive) {
    u._beaconHoly = 0;
    hit(b, u, t, tierRoll(u, 1, 6), { kind: 'radiant', ty: 'radiant', noBonus: 1, onhit: 1 });
  }
  // Holy Avenger (v0.23 Legendary): attacks add +2d6 Radiant & heal adjacent allies (1s CD)
  if (u.it && u.it.holyAvenger && t.alive && b.time >= (u._haCd || 0)) {
    u._haCd = b.time + 1.0;
    hit(b, u, t, roll(2, 6), { kind: 'radiant', ty: 'radiant', noBonus: 1, onhit: 1 });
    friends(b, u).filter(a => !a.minion && hd(a, u) <= 1).forEach(a => heal(b, u, a, Math.round(a.maxHp * .08), { raw: 1 }));
  }
  // Vorpal Sword (v0.23 Legendary): execute enemies below 20% HP
  if (u.it && u.it.vorpalExec && t.alive && t.side === 'E' && hpPct(t) < u.it.vorpalExec) {
    callout(b, u, 'SNICKER-SNACK!', '#ff6a4a');
    hit(b, u, t, t.hp + 999, { kind: 'radiant', ty: 'slashing', noBonus: 1, onhit: 1 });
  }
}

function postStrikeHooks(b, u, t, got) {
  if (!t) return;
  const K = u.kw || {};
  u._stkCnt = (u._stkCnt || 0) + 1;

  // Belt of Fire Giant / Belt of Storm Giant / Berserker Axe melee cleave
  if (got > 0 && u.rng <= 2 && u.side === 'P') {
    const cleavePct = (u.it && u.it.meleeCleave) || ((u.it && u.it.rageCleave && (u.bearRage > 0 || u.zealotT > 0 || u.mcRage > 0)) ? u.it.rageCleave : 0);
    if (cleavePct > 0) {
      foes(b, u).filter(x => x !== t && hd(x, u) <= 1).forEach(x => {
        hit(b, u, x, Math.max(1, Math.round(got * cleavePct)), { kind: 'phys', ty: 'slashing', noBonus: 1, onhit: 1 });
      });
    }
    if (u.it && u.it.stormCleave && b.time >= (u._scCd || 0)) {
      u._scCd = b.time + 1.5;
      foes(b, u).filter(x => hd(x, u) <= 1).forEach(x => {
        if (x !== t) hit(b, u, x, Math.max(1, Math.round(got * .5)), { kind: 'phys', ty: 'bludgeoning', noBonus: 1, onhit: 1 });
        if (x.alive) stun(b, x, .5);
      });
    }
  }

  // Unique Item periodic attack triggers (Weapon of Warning, Pearl of Power, Bracers of Archery, Cloak of Elvenkind, Rod of Pact Keeper)
  if (u.it && u.it.every5Surge && u._stkCnt % 5 === 0) triggerActionSurge(b, u, { target: t, label: 'WARNING SURGE!' });
  if (u.it && u.it.every3ArcRec && u._stkCnt % 3 === 0) triggerArcaneRecovery(b, u, u.it.every3ArcRec, 'PEARL');
  if (u.it && u.it.every3Mark && u._stkCnt % 3 === 0 && t.alive) markFoe(b, u, t);
  if (u.it && u.it.every3Sneak && u._stkCnt % 3 === 0 && t.alive) triggerSneakAttack(b, u, t, {});
  if (u.it && u.it.every4Hex && u._stkCnt % 4 === 0 && t.alive) {
    if (u.key === 'lumen') applyRadiantHex(b, u, t, 1);
    else applyNettleHex(b, u, t, true);
  }

  // Multiclass Dip attack triggers (Rogue, Paladin, Ranger, Monk, Warlock)
  if (u.side === 'P' && u.mc && t.alive) {
    if (u.mc === 'Rogue' && b.time >= (u._mcSnT || 0)) {
      const ok = t.st.exp > 0 || alive(b, u.side).some(a => a !== u && hd(a, t) <= 1);
      if (ok) { u._mcSnT = b.time + 1.0; triggerSneakAttack(b, u, t, {}); }
    }
    if (u.mc === 'Paladin' && u._stkCnt % 3 === 0) {
      triggerSmite(b, u, t, roll(1, 6), { label: 'MC SMITE', onhit: 1 });
    }
    if (u.mc === 'Ranger' && u._stkCnt % 3 === 0) {
      markFoe(b, u, t);
    }
    if (u.mc === 'Monk' && u._stkCnt % 4 === 0) {
      hit(b, u, t, roll(2, 6), { kind: 'phys', ty: 'bludgeoning', noBonus: 1, onhit: 1 });
      if (t.alive) stagger(b, t, 2);
      emitClassKw(b, u, 'ki', { target: t });
    }
    if (u.mc === 'Warlock' && !u._mcHexUsed) {
      u._mcHexUsed = 1;
      applyMcHex(b, u, t);
    }
  }

  // Sir Dane Divine Smite: every 3rd melee attack unleashes 1d8 (×tier) Radiant Smite
  if (u.f.smitePeriodic && t.alive) {
    u._smCnt = (u._smCnt || 0) + 1;
    if (u._smCnt % 3 === 0) {
      triggerSmite(b, u, t, tierRoll(u, 1, 8), { label: 'DIVINE SMITE', onhit: 1 });
    }
  }
  // Mother Laurel Cleave, Verdant Smite (Nature Magic vs Rooted), Quest Root & Verdant Aura drain
  if (u.f.verdantCleave && got > 0) {
    foes(b, u).filter(x => x !== t && hd(x, u) <= 1).forEach(x => {
      const cg = hit(b, u, x, tierRoll(u, u.atk.d[0], u.atk.d[1]) + (u.atk.flat || 0), { kind: 'phys', ty: 'slashing', melee: 1, onhit: 1 });
      if (x.alive && x.st.root > 0) triggerSmite(b, u, x, tierRoll(u, 1, 4), { kind: 'magic', ty: 'poison', label: 'VERDANT SMITE', onhit: 1 });
    });
  }
  if (u.key === 'mother_laurel' && u.questDone && t.alive) applyRoot(b, u, t, 1.0);
  if (t.alive && t.st.root > 0 && u.side === 'P' && (u.f.verdantSmite || alive(b, 'P').some(x => x.f.bountifulVines))) {
    triggerSmite(b, u, t, tierRoll(u, 1, 4), { kind: 'magic', ty: 'poison', label: 'VERDANT SMITE', onhit: 1 });
  }
  // Lumen Radiant Hex on basic attacks + Healing Light spec
  if (u.f.radiantHex && t.alive) {
    applyRadiantHex(b, u, t, 1);
  }
  if (u.f.healingLight && got > 0) {
    const low = friends(b, u).filter(a => !a.minion).sort((a, c) => hpPct(a) - hpPct(c))[0];
    if (low) heal(b, u, low, Math.max(1, Math.round(got * .25)), { raw: 1 });
  }
  // Brother Jamison Gentle Strike: weak melee basic attacks heal lowest-HP bonded ally for damage dealt
  if (u.f.gentleStrike && got > 0) {
    const bondedAllies = friends(b, u).filter(a => !a.minion && a.bonded === u);
    const pool = bondedAllies.length ? bondedAllies : friends(b, u).filter(a => !a.minion);
    const low = pool.sort((a, c) => hpPct(a) - hpPct(c))[0];
    if (low) heal(b, u, low, got, { raw: 1 });
  }
  // Gains Alchemical Bolt: slow bolt has a chance to pop +1 Gold (feeding Arcane Recovery)
  if (u.f.goldBolt && Math.random() < 0.25) {
    gainGold(b, u, 1, 'ALCHEMY');
  }
  // Corvin Spec 1 Stalker's Flurry: every 3rd basic attack spawns +1d6 (×tier) shadow slash
  if (u.f.stalkerFlurry && t.alive) {
    u._sfCnt = (u._sfCnt || 0) + 1;
    if (u._sfCnt % 3 === 0) hit(b, u, t, tierRoll(u, 1, 6), { kind: 'phys', ty: 'piercing', noBonus: 1, onhit: 1 });
  }
  // Kaska Quest Moon's Favour: while in Panther Form, melee attacks cleave adjacent foes
  if (u.key === 'kaska' && u.questDone && u.beast && u.beast.hp > 0 && got > 0) {
    foes(b, u).filter(x => x !== t && hd(x, u) <= 1).forEach(x => {
      hit(b, u, x, Math.max(1, Math.round(got * .6)), { kind: 'phys', ty: 'slashing', noBonus: 1, onhit: 1 });
    });
  }
  // Lorcan Spec 1 Colossus Slayer: every 3rd attack vs Marked foe deals +2d8 (×tier) bonus damage
  if (u.f.colossusSlayer && t.alive && t.st.mark) {
    u._colCnt = (u._colCnt || 0) + 1;
    if (u._colCnt % 3 === 0) {
      hit(b, u, t, tierRoll(u, 2, 8), { kind: 'phys', ty: 'piercing', noBonus: 1, onhit: 1 });
      status(b, t, 'COLOSSUS SLAYER', '#9fd86a');
    }
  }
  // Wallaby / Velith Sneak Attack (1/s)
  if (K.sneak_attack && u.mc !== 'Rogue' && t.alive && b.time >= (u._snT || 0)) {
    const isVelith = u.key === 'velith';
    const ok = isVelith
      ? (u.hidden || t.st.poison > 0)
      : (u.hidden || t.st.mark || t.st.hex || t.st.poison > 0 || t.st.stag > 0 || t.st.stun > 0 || t.st.exp > 0 || alive(b, u.side).some(a => a !== u && hd(a, t) <= 1));
    if (ok) {
      u._snT = b.time + 1.0;
      triggerSneakAttack(b, u, t, { venom: isVelith });
    }
  }
  // Rosalind Passive Vicious Mockery: reduces target damage by 20%
  if (u.key === 'rosalind' && t.alive) {
    t.st.mockT = Math.max(t.st.mockT || 0, 2.5 * chaK(u));
  }
  // Ki bar (Naill): 4-pip bar -> Open Hand Strike!
  if (K.ki && u.f.monkNaill && t.alive) {
    u.ki = Math.min(KI_MAX, (u.ki || 0) + 1);
    if (u.ki >= KI_MAX) fireNaillKiStrike(b, u, t);
  }
}

function later(b, dt, f) { (b.later = b.later || []).push({ at: b.time + dt, f }); }

/* ---------- Battle Setup & Main Loop ---------- */
function newBattle(encKey, party, eTier) {
  const enc = ENC[encKey];
  loadMap(enc.map);
  UID = 1;
  const b = {
    time: 0, units: [], events: [], over: false, winner: null,
    enc: encKey, eTier: eTier || 1, gold: 0, goodberries: 0, kwCounts: {},
    hazard: (enc && enc.hazard) || null,
    waves: (enc.waves || []).map(w => ({ ...w, done: 0 }))
  };
  const usedDep = new Set(party.filter(c => c.c != null && c.r != null).map(c => c.c + ',' + c.r));
  let depIdx = 0;
  party.forEach(cfg => {
    let useCfg = cfg;
    if (cfg.c == null || cfg.r == null) {
      while (depIdx < DEPLOY.length && usedDep.has(DEPLOY[depIdx].c + ',' + DEPLOY[depIdx].r)) depIdx++;
      const sp = DEPLOY[depIdx] || DEPLOY[0] || { c: 1, r: Math.max(0, ROWS - 2) };
      usedDep.add(sp.c + ',' + sp.r);
      useCfg = { ...cfg, c: sp.c, r: sp.r };
    }
    b.units.push(mkHero(useCfg));
  });
  enc.u.forEach(([k, c, r]) => b.units.push(mkEnemy(k, c, r, eTier || 1, enc)));
  settleLarge(b.units.filter(x => x.side === 'E'));
  settleLarge(b.units.filter(x => x.side === 'P'));

  const P = alive(b, 'P');
  // Start-of-combat Epic Boons, Multiclass dips, Hero Passives, Items & Quests
  P.forEach(u => {
    // Tier IV Epic Boon combat-start hooks
    if (u.boon === 'fortitude') addWard(b, u, Math.round(u.maxHp * .25), u.maxHp * .5, u);
    if (u.boon === 'dimensional_travel') u.charge = Math.max(u.charge, 50);

    // Multiclass Druid: Primal Ward (20% Max HP) with Thorns
    if (u.mc === 'Druid') {
      u._primalWard = 1;
      addWard(b, u, Math.round(u.maxHp * .20), u.maxHp * .5, u);
      emitClassKw(b, u, 'wild_shape', { form: 'Primal Ward' });
    }

    // Quest rewards at combat start
    if (u.key === 'bram' && u.questDone) {
      P.filter(a => a !== u && hd(a, u) <= 1).forEach(a => addWard(b, a, Math.round(a.maxHp * .22), a.maxHp * .5, u));
    }
    if (u.key === 'juniper' && u.questDone) b.goodberries += 4;
    if (u.key === 'dane' && u.questDone) {
      const fs = alive(b, 'E').sort((a, c) => hd(a, u) - hd(c, u));
      if (fs.length) {
        fs.slice(0, 3).forEach(e => { push(b, u, e, 2, { stun: .8 }); triggerSmite(b, u, e, tierRoll(u, 1, 8), { label: 'CHARGE SMITE' }); });
        callout(b, u, 'CAVALRY CHARGE!', '#ffe9a0');
      }
    }
    if (u.key === 'jamison' && u.questDone) {
      P.filter(a => a !== u && !a.minion).sort((a, c) => hd(a, u) - hd(c, u)).slice(0, 2).forEach(a => { a.bonded = u; status(b, a, 'BONDED', '#ffe9a0'); });
    }
    if (u.key === 'gilthrax' && u.questDone) {
      const wVal = gilthraxWardAmount(u, 1);
      addWard(b, u, wVal, u.maxHp * .8, u);
      u.wardStored = (u.wardStored || 0) + wVal;
      status(b, u, 'FREE ARCANE SHIELD', '#ffd76a');
    }

    // Hero passives & specs at combat start
    if (u.f.assassinate) {
      u.hidden = 1; u.hideT = 3.0;
      status(b, u, 'STEALTH', '#c48fe6');
      if (u.f.firstBlood || u.f.deathsLedger) u.advantage = Math.max(u.advantage || 0, 1);
    }
    if (u.f.dreadAmbusher) u.charge = Math.max(u.charge, 35);
    if (u.f.pantherForm) {
      const bhp = Math.round(u.maxHp * (u.f.lunarResilience ? .48 : .34));
      u.beast = { hp: bhp, max: bhp };
      triggerWildShape(b, u, { form: 'Panther Form', beastHp: bhp });
    }

    // Item start-of-combat hooks
    if (u.it && u.it.startSorcery) u.sorcery = Math.min(4, (u.sorcery || 0) + u.it.startSorcery);
    if (u.it && u.it.startCharge) u.charge = Math.min(100, Math.max(u.charge || 0, u.it.startCharge));
    if (u.it && u.it.startEvasion) grantTempEvasion(b, u, u.it.startEvasion, u.it.startEvasionDur || 4, false);
    if (u.it && u.it.startInsp) {
      const ally = P.filter(a => a !== u && !a.minion && a.abil).sort((a, c) => hd(a, u) - hd(c, u))[0] || u;
      grantInspDie(b, u, ally, 6, 0);
    }
  });

  // Enemy chargers schedule opening leap
  b.units.forEach(u => { if (u.side === 'E' && archOf(u.key).includes('charger')) u._chg = .6 + Math.random() * .6; });
  return b;
}

function applyAuras(b) {
  b.units.forEach(u => { u.auraHaste = 0; u.auraSR = 0; u.auraDmg = 0; u.auraAC = 0; u.auraCr = 0; u.auraFloor = 0; u.auraDane = null; });
  // Paladin Aura: Sir Dane Aura of Devotion (+1 AC/SR adjacent; Aura of Protection expands to 2 sq & +2 AC/SR)
  alive(b, 'P').filter(x => x.f.auraDevotion).forEach(dane => {
    const rad = dane.f.auraProtection ? 2 : 1;
    const bonus = dane.f.auraProtection ? 2 : 1;
    friends(b, dane).filter(a => !a.minion && hd(a, dane) <= rad).forEach(a => {
      a.auraAC = Math.max(a.auraAC, bonus);
      a.auraSR = Math.max(a.auraSR, bonus);
      a.auraDane = dane;
    });
  });
  // Tome of Understanding (v0.23 Very Rare): adjacent allies inherit holder's min natural d20 floor
  alive(b, 'P').filter(x => x.it && x.it.shareD20Floor).forEach(holder => {
    friends(b, holder).filter(a => !a.minion && hd(a, holder) <= 1).forEach(a => {
      a.auraFloor = Math.max(a.auraFloor, holder.d20Floor || 1);
    });
  });
  // Rosalind Spec 2 Encore: allies holding an Inspiration Die gain +35% Charge speed
  if (alive(b, 'P').some(x => x.f.encore)) {
    alive(b, 'P').filter(a => a.inspDie || a.inspMote).forEach(a => { a.auraCr = Math.max(a.auraCr, 35); });
  }
  // Zoe Spec 2 Just the Thing: allies carrying 2+ real items gain +25% Charge speed
  if (alive(b, 'P').some(x => x.f.justTheThing)) {
    alive(b, 'P').filter(a => (a.items || []).length >= 2).forEach(a => { a.auraCr = Math.max(a.auraCr, 25); });
  }
  // Enemy auras
  alive(b, 'E').forEach(a => {
    if (a.f.hasteAura) { const [r, v] = a.f.hasteAura; friends(b, a).forEach(x => { if (x !== a && hd(x, a) <= r) x.auraHaste = Math.max(x.auraHaste, v); }); }
    if (archOf(a.key).includes('wall')) { friends(b, a).forEach(x => { if (x !== a && hd(x, a) <= 1) x.auraAC = Math.max(x.auraAC || 0, 2); }); }
  });
}

function tick(b, dt) {
  if (b.over) return;
  b.time += dt;
  const ot = otLevel(b);
  if (ot !== b._ot) { b._ot = ot; if (ot) b.events.push({ k: 'overtime', lvl: ot }); }

  // Act 2 Dungeon Hazard: Boiling Steam deals minor fire ticks every 3s
  if (b.hazard === 'steam' && b.time >= (b._hzT || 3)) {
    b._hzT = b.time + 3;
    b.units.filter(u => u.alive && !u.f.fireproof).forEach(u => {
      hit(b, null, u, Math.max(2, Math.round(u.maxHp * .03)), { dot: 1, ty: 'fire' });
    });
  }

  applyAuras(b);
  for (const w of b.waves) if (!w.done && b.time >= w.at) spawnWave(b, w);
  if (b.later && b.later.length) {
    const due = b.later.filter(x => x.at <= b.time);
    if (due.length) {
      b.later = b.later.filter(x => x.at > b.time);
      for (const x of due) { x.f(); if (b.over) return; }
      checkOver(b); if (b.over) return;
    }
  }

  for (const u of b.units) {
    if (!u.alive) continue;
    const s = u.st;
    const cr0 = dt * (1 + .1 * Math.max(0, u.cha || 0));
    s.stun = Math.max(0, s.stun - cr0);
    s.root = Math.max(0, s.root - cr0);
    s.taunt = Math.max(0, s.taunt - dt);
    s.acBT = Math.max(0, s.acBT - dt);
    s.acidT = Math.max(0, s.acidT - dt); if (s.acidT <= 0) s.acid = 0;
    s.frz = Math.max(0, s.frz - 8 * dt);
    s.chillT = Math.max(0, (s.chillT || 0) - dt);
    s.stag = Math.max(0, s.stag - dt);
    s.exp = Math.max(0, s.exp - dt); if (s.exp > 0) u.hidden = 0;
    s.fear = Math.max(0, s.fear - dt);
    s.charm = Math.max(0, s.charm - dt);
    s.duelCrusade = Math.max(0, s.duelCrusade - dt);
    s.mockT = Math.max(0, s.mockT - dt);
    s.hexSlow = Math.max(0, s.hexSlow - dt);
    u.tempHasteT = Math.max(0, (u.tempHasteT || 0) - dt);
    u.tempEvasionT = Math.max(0, (u.tempEvasionT || 0) - dt);
    u.partyEvasionT = Math.max(0, (u.partyEvasionT || 0) - dt);
    u.inspAmpT = Math.max(0, (u.inspAmpT || 0) - dt);
    u.doubleRegenT = Math.max(0, (u.doubleRegenT || 0) - dt);
    u.moonDmgT = Math.max(0, (u.moonDmgT || 0) - dt);
    u.sacredShieldT = Math.max(0, (u.sacredShieldT || 0) - dt);
    u.vineThornsT = Math.max(0, (u.vineThornsT || 0) - dt);
    u.zealotT = Math.max(0, (u.zealotT || 0) - dt);
    u.radiantSoulT = Math.max(0, (u.radiantSoulT || 0) - dt);
    u.arcaneReflectT = Math.max(0, (u.arcaneReflectT || 0) - dt);
    u.wildShapeT = Math.max(0, (u.wildShapeT || 0) - dt);

    // Staff of the Woodlands (v0.23 Unique · Wild Shape): while in Wild Shape, Roots a nearby enemy every 3s
    if (u.it && u.it.woodlandRoot && (u.wildShapeT > 0 || (u.beast && u.beast.hp > 0) || u._primalWard) && b.time >= (u._woodT || 3)) {
      u._woodT = b.time + 3;
      const fs = foes(b, u).filter(x => !x.hidden).sort((a, c) => (a.st.root > 0 ? 1 : 0) - (c.st.root > 0 ? 1 : 0) || hd(a, u) - hd(c, u));
      if (fs[0]) applyRoot(b, u, fs[0], 2.5 * chaK(u));
    }
    // Ring of Regeneration (v0.23 Very Rare): cleanses 1 Burn or Poison stack every 2s
    if (u.it && u.it.cleanseEvery && b.time >= (u._clnT || u.it.cleanseEvery)) {
      u._clnT = b.time + u.it.cleanseEvery;
      if (s.poison > 0) s.poison = Math.max(0, s.poison - 1);
      else if (s.burn > 0) s.burn = Math.max(0, s.burn - 2);
    }

    if (tile(u) === '^' && !u.f.fireproof) { s.burn = Math.max(s.burn, 8); s.burnT = s.burnT || .5; }
    if (u.f.enrage && b.time >= (u._enr || (u._enr = u.f.enrage))) { u._enr += u.f.enrage; u.dm *= 1.15; status(b, u, 'ENRAGED', '#ff9c94'); }

    // Burn ticks (every 0.5s) — feeds Cinder Spec 1 Draconic Surge!
    if (s.burn >= .5) {
      s.burnT -= dt;
      if (s.burnT <= 0) {
        s.burnT = .5;
        const v = Math.max(1, Math.round(s.burn * .35));
        s.burn *= .65;
        hit(b, null, u, v, { dot: 1, ty: 'fire' });
        if (u.side === 'E') {
          alive(b, 'P').filter(x => x.f.draconicSurge).forEach(c => {
            c._dsTicks = (c._dsTicks || 0) + 1;
            if (c._dsTicks % 3 === 0) {
              addSorcery(b, c, 1, null, null);
            }
          });
        }
        if (!u.alive) continue;
      }
    } else s.burn = 0;

    // Poison ticks (steady, never fades)
    if (s.poison > 0) {
      s.poisonAcc += s.poison * dt * Math.max(.3, 1 - .1 * Math.max(0, u.con));
      if (s.poisonAcc >= 1) {
        const v = Math.floor(s.poisonAcc);
        s.poisonAcc -= v;
        hit(b, null, u, v, { dot: 1, ty: 'poison' });
        if (!u.alive) continue;
      }
    }

    // Cleric Channel Divinity auto-triggers (Bram Preserve Life <45%, Jamison Balm of Peace <50%)
    if (u.side === 'P' && !u._cdUsed && u.st.stun <= 0) {
      if (u.f.preserveLife && !u._pres) {
        const low = friends(b, u).find(a => !a.minion && hpPct(a) < .45 && hd(a, u) <= 4);
        if (low) triggerBramCD(b, u);
      } else if (u.f.peaceCleric) {
        const hurt = friends(b, u).find(a => !a.minion && hpPct(a) < .50);
        if (hurt) triggerJamisonCD(b, u);
      }
    }

    // Enemy chargers & summoners
    if (u.side === 'E') {
      if (archOf(u.key).includes('charger') && u._chg != null && b.time >= u._chg && s.stun <= 0 && s.root <= 0 && s.fear <= 0 && s.charm <= 0) {
        u._chg = b.time + 8; charge(b, u);
      }
      if (u.f.summon && b.time >= (u._sum ?? (u._sum = u.f.summon.first || 4)) && s.stun <= 0 && s.charm <= 0) {
        u._sum = b.time + u.f.summon.every;
        const S = u.f.summon;
        if (alive(b, 'E').filter(x => x._summoned === u).length < S.cap) {
          for (let i = 0; i < S.n; i++) {
            const m = spawn(b, S.k, u.c + (i ? 1 : -1), u.r);
            if (m) { m._summoned = u; m.dm = u.dm * (S.dm || 1); m.maxHp = m.hp = Math.round(m.maxHp * (S.hp || 1)); }
          }
          status(b, u, 'SUMMONS', '#c48fe6');
        }
      }
    }

    const lowDouble = (u.it && u.it.lowDoubleRegen && u.hp < u.maxHp * .5) ? 2 : 1;
    const totalRegen = (u.regen || 0) * ((u.doubleRegenT || 0) > 0 ? 2 : 1) * lowDouble + (u.it && u.it.pctRegen ? u.maxHp * u.it.pctRegen : 0);
    if (totalRegen > 0 && u.hp < u.maxHp) {
      const r = Math.min(u.maxHp - u.hp, totalRegen * dt);
      u.hp += r; u.stats.regenIn = (u.stats.regenIn || 0) + r;
    }
    u.stats.alive = (u.stats.alive || 0) + dt;
  }

  for (const u of b.units) if (u.hidden && (b.time >= u.hideT || !u.alive)) u.hidden = 0;

  for (const u of b.units) {
    if (!u.alive || u.st.stun > 0 || u.isDouble) continue;
    u.target = pickTarget(b, u);

    if (u.abil && !(u.st.charm > 0) && !(u.st.fear > 0)) {
      const quickenMult = (u.it && u.it.quickenFirst && !(u._casts > 0)) ? 2.0 : 1.0;
      const damp = (b.hazard === 'dampener' && b.time < 10) ? .65 : 1.0;
      const gain = u.cr * dt * (1 + (u.auraCr || 0) / 100) * quickenMult * damp;
      const wasFull = u.charge >= 100;
      u.charge = Math.min(100, u.charge + gain);

      const A = u.abil;
      const canCastNow = u.charge >= 100 && (A.self || (A.ready ? A.ready(b, u) : u.target && canHit(u, u, u.target)));
      if (canCastNow) {
        if (b.time - (u._lastCastT ?? -99) >= MIN_CAST_INTERVAL) {
          u._headbandTicked = 0;
          castAbility(b, u);
          if (b.over) return;
          if (!u.alive) continue;
        } else if (u.it && u.it.capToRoll && !u._headbandTicked && wasFull) {
          u._headbandTicked = 1;
          u.nextBonus += 1;
          status(b, u, 'HEADBAND +1 d20', '#8fb4e6');
        }
      }
    }

    u.t += dt;
    const iv = attackIv(b, u);
    if (u.t >= iv) { if (doAttack(b, u)) u.t = 0; else u.t = iv; }

    if (u.target && !(canHit(u, u, u.target) && (u.rng < 3 || u._attacked || nearestFoeD(b, u, u) >= 2))) {
      u.mt += dt;
      if (u.mt >= moveTime(b, u)) {
        const s = moveStep(b, u);
        if (s && s !== 'wait') { u.c = s.c; u.r = s.r; u.mt = 0; terrainEnter(b, u); }
        else u.mt = moveTime(b, u) * .6;
      }
    } else u.mt = 0;
  }

  checkOver(b);
}

function checkOver(b) {
  const p = alive(b, 'P').filter(x => !x.isDouble).length, e = alive(b, 'E').length;
  if (!e) { b.over = true; b.winner = 'P'; }
  else if (!p) { b.over = true; b.winner = 'E'; }
  else if (b.time >= TIME_LIMIT) { b.over = true; b.winner = 'E'; b.timeout = 1; }
}

function simulate(encKey, party, eTier) {
  const b = newBattle(encKey, party, eTier);
  while (!b.over) { tick(b, TICK); b.events.length = 0; }
  return b;
}

/* ---------- Unified Class Keyword Lookup Table (mirrors CLASS_KW in 03-heroes.js) ---------- */
const KW = typeof CLASS_KW !== 'undefined' ? CLASS_KW : {};
const KW_STATUS = { stag: 'Staggered', exp: 'Exposed', fear: 'Frightened', charm: 'Charmed' };
