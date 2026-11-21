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
const ROLL_SHIFT = 3;
const COMBAT_TEMPO = 1.4; // ~1.4x slower baseline tempo so combat reads clearly and DEX/INT speed scaling shines
const OT_START = 40, OT_STEP = 6, TIME_LIMIT = 110;
const CHARGE_TAKEN = 60;
const MIN_CAST_INTERVAL = 1.0; // Global 1-cast/second cap
const LARGE_AREA = 1.25, LARGE_HP = 1.5;
var KI_MAX = 4;

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
  const AB = (path && path.abil) || d.abil;
  const pr = pairOf(d);

  // Score calculation (+2 score = +1 modifier)
  const sc = { ...d.attr };
  if (it) Object.entries(it.a || {}).forEach(([k, v]) => sc[k] += v);
  if (path && path.attr) sc[path.attr] += 2; // Tier II path: +1 to its attribute
  if (tier >= 3) sc[cfg.asi || pr[1]] += 4;  // Tier III ASI: +2 to chosen attribute
  if (cfg.train) Object.entries(cfg.train).forEach(([a, v]) => { sc[a] += 2 * v; });

  // Hero Quest permanent attribute rewards
  if (cfg.questDone) {
    if (cfg.key === 'arthur') sc.con += 4;                                           // Flame Gauntlet: +2 CON
    if (cfg.key === 'bram') sc.con += 2;                                             // Blessed Ale: +1 CON
    if (cfg.key === 'faelan') sc.int += 2 * (cfg.questStacks || 0);                  // Owl Familiar: +1 INT per win (uncapped)
    if (cfg.key === 'wallaby') sc.dex += 2;                                          // Use Magic Device: +1 DEX
    if (cfg.key === 'dane') { sc.str += 4; sc.con += 4; }                            // Find Steed: +2 STR, +2 CON
    if (cfg.key === 'lorcan') sc.dex += 2 * ((cfg.questTrophies || []).length);      // Favoured Enemy: +1 DEX per trophy
    if (cfg.key === 'juniper') sc.wis += 4;                                          // Goodberries: +2 WIS
    if (cfg.key === 'rosalind') sc.cha += 4;                                         // Instrument of the Bards: +2 CHA
    if (cfg.key === 'cinder') sc.cha += 2 * Math.min(6, Math.floor((cfg.goldHeld || 0) / 25)); // Dragon's Hoard
    if (cfg.key === 'zark') sc.con += 2 * (cfg.questStacks || 0);                    // Relentless Hide: +1 CON per tough win
    if (cfg.key === 'naill') sc.dex += 4;                                            // Wraps of the Hundred Fists: +2 DEX
    if (cfg.key === 'nettle') sc.int += 4;                                           // Infernal Contract: +2 INT
    if (cfg.key === 'pillar') sc.str += 6;                                           // Living Colossus: +3 STR (+ Large 2x2)
    if (cfg.key === 'mother_laurel') sc.wis += 4;                                    // Garden of Plenty: +2 WIS
    if (cfg.key === 'lumen') sc.wis += 4;                                            // Book of Judgement: +2 WIS
    if (cfg.key === 'jamison') sc.cha += 4;                                          // Holy Symbol of Pelor: +2 CHA
    if (cfg.key === 'zoe') sc.int += 4;                                              // Grand Opening: +2 INT
    if (cfg.key === 'toot') sc.cha += 4;                                             // Record Deal: +2 CHA
    if (cfg.key === 'gilthrax') { sc.con += 4; sc.str += 4; }                        // Gems, Glorious Gems: +2 CON, +2 STR
    if (cfg.key === 'gains') sc.int += 4;                                            // Compound Interest: +2 INT
    if (cfg.key === 'velith') sc.dex += 2 * (cfg.questStacks || 0);                  // Death's Ledger: +1 DEX per 4 kills
    if (cfg.key === 'corvin') sc.dex += 4;                                           // Twin Blades of the Gloom: +2 DEX
    if (cfg.key === 'saint') sc.cha += 4;                                            // Mirror Image: +2 CHA
    if (cfg.key === 'kaska') { sc.str += 4; sc.wis += 4; }                           // Moon's Favour: +2 STR, +2 WIS
  }

  const m = {};
  ATTRS.forEach(a => m[a] = modOf(sc[a]));
  const s = (it && it.s) || {};
  const f = { ...(d.f || {}), ...(path ? path.f : {}) };
  const hpx = Math.pow(TIERX.hp, tier - 1);
  const dm = Math.pow(TIERX.dmg, tier - 1);
  const isLarge = (cfg.key === 'dane' || cfg.key === 'pillar') && cfg.questDone;

  // 1. STR: Melee Armor Penetration (+1 AC ignored per positive STR)
  const strPen = (d.rng <= 2 || d.atk.thrown) ? Math.max(0, m.str) : 0;
  // 2. DEX: Linear Attack Speed (+6%/DEX if weapon attr, +4%/DEX otherwise)
  const dexHaste = (pr[0] === 'dex' ? 6 : 4) * m.dex;
  // 3. CON: Linear Max HP (+18/CON) & regen
  const baseMaxHp = Math.round((d.hp + 18 * m.con + (s.hp || 0)) * hpx * (isLarge ? LARGE_HP : 1));
  // 4. INT: Linear Charge Speed (+10% per positive INT)
  const intChargePct = Math.max(0, m.int) * 10;
  // 5. WIS: Spell Resistance (+1 SR/WIS) + Minimum Natural d20 Roll Floor (1 + WIS, cap 10)
  const d20Floor = Math.min(10, 1 + Math.max(0, m.wis));
  // 6. CHA: Commanding Presence (+8% linear potency/duration on buffs & debuffs)
  const chaPotency = +(1 + 0.08 * Math.max(0, m.cha)).toFixed(2);

  // Dual-Attribute Split: High-roll threshold shift moved from INT to Key Attribute!
  const mk = m[pr[1]];
  const hiShift = Math.floor(Math.max(0, mk) / 2);
  const hoardBonus = f.gildedHoard ? rawItems.length : 0;
  const interestBonus = f.compoundInterest ? Math.min(5, Math.floor((cfg.goldHeld || 0) / 10)) : 0;

  const st = {
    sc, m, f, path, item: it, die: cfg.die || 'd20', tier, dm,
    sz: isLarge ? 2 : 1,
    maxHp: baseMaxHp,
    ac: d.ac + m.dex + (s.ac || 0) + hoardBonus * 2,
    sr: d.sr + m.wis + (s.sr || 0),
    ft: d.ft + (s.ft || 0),
    rng: d.rng + (s.rng || 0),
    dmgBonus: s.dmg || 0,
    regen: +((0.5 + 0.5 * Math.max(0, m.con) + (s.regen || 0)) * hpx).toFixed(2),
    haste: dexHaste + (f.haste || 0) + (s.haste || 0),
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
  st.abM = sty.ab || 1;
  st.atM = sty.atk || 1;
  st.hidCr = sty.hid || 1;
  st.role = (path && path.role) || d.role;
  st.abil = (cfg.key === 'arthur' && cfg.questDone)
    ? { ...AB, n: 'Gauntlet Blast', one: 'Frontline fire cone hitting 1–4 nearest foes with Burn; High grants Alert, Nat 20 makes party Alert.' }
    : AB;

  const chgMult = 1 + (intChargePct + (s.crPct || 0)) / 100;
  st.cr = (sty.cr || 1) * AB.cr * chgMult / COMBAT_TEMPO;
  st.chgX = chgMult;
  st.trig = (path && path.trig) || d.trig || TRIG_ROLE[st.role] || 'striking';

  // d20 Band Layout (Key Attribute adds to roll and shifts High band)
  st.rb = st.mk + (s.rollBonus || 0) + hoardBonus + interestBonus;
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
  for (let raw = 1; raw <= 20; raw++) {
    const n = Math.max(floor, raw);
    if (n === 1) { o[0]++; continue; }
    if (n === 20) { o[4]++; continue; }
    const v = Math.min(19, n + (st.rb || 0));
    o[v >= st.bands.hi ? 3 : v <= st.bands.low ? 1 : 2]++;
  }
  return o.map(x => x / 20);
}

function atkBonus(st, d) {
  const a = d.atk;
  if (a.heals) return st.mk;
  const itemDmg = st.dmgBonus || 0;
  if (a.kind === 'holy') return itemDmg;
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
  const kd = e.kind === 'holy' ? 'Holy' : e.el || e.ty || (e.kind === 'magic' ? 'magic' : 'physical');
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
  mark: null, hex: null, hexStacks: 0, hexJump: 0, hexSlow: 0,
  cut: 0, vow: null, duelCrusade: 0, mockT: 0, srShred: 0, gilded: null
});

function mkHero(cfg, side = 'P') {
  const d = H[cfg.key];
  const st = heroStats(cfg);
  const atk = { ...d.atk, ...(st.f.atk || {}) };
  if (st.item && st.item.s && st.item.s.holyAttacks) { atk.kind = 'holy'; atk.ty = 'radiant'; }
  const u = {
    id: UID++, key: d.key, side, name: d.name, cls: d.cls, role: st.role,
    hidCr: st.hidCr, vet: 0, streak: 0, bounce: 0, verse: 0, reach: d.reach,
    c: cfg.c, r: cfg.r, sz: st.sz,
    maxHp: st.maxHp, hp: st.maxHp, ac: st.ac, sr: st.sr, regen: st.regen, ward: 0, nec: 0,
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
    haste: 0, tempHaste: 0, tempHasteT: 0,
    rollBonus: st.rb, nextBonus: 0, advantage: 0,
    alert: 0, afterimage: 0, bearRage: 0, sorcery: 0, ki: 0, clauses: 0,
    zealotT: 0, radiantSoulT: 0, arcaneReflectT: 0, illusoryDouble: 0, beast: null, wildShapeT: 0,
    bonded: null, bondDie: 0, bondChargeShare: 0,
    inspDie: null, inspMote: null, _cdUsed: 0, _shieldHits: 0, _lastCastT: -99,
    questDone: !!cfg.questDone, questStacks: cfg.questStacks || 0, questTrophies: cfg.questTrophies || [],
    act: cfg.act || 1,
    alive: true, st: freshSt(),
    stats: {
      dmg: 0, heal: 0, ward: 0, nec: 0, taken: 0, hpLost: 0, wardAbs: 0,
      healIn: 0, wardIn: 0, regenIn: 0, alive: 0, rolls: [0, 0, 0, 0, 0], gold: 0,
      alertDodges: 0, wardAbsorbed: 0, markedAllyHits: 0, markedKills: 0,
      rootsApplied: 0, inspPassed: 0, burnCredit: 0, bearRagePeak: 0, kiStrikes: 0, hexDeaths: 0,
      zealotProcs: 0, bloomHeals: 0, searApplied: 0, bondedCasts: 0, rummageBuffs: 0,
      gildedKills: 0, kills: 0, ambushStrikes: 0, saintCasts: 0, pounces: 0,
      smites: 0, actionSurges: 0, channelDivinities: 0, arcaneRecoveries: 0,
      wildShapes: 0, cunningActions: 0, pactBoons: 0, metamagics: 0, sneaks: 0, rages: 0
    },
    tier: cfg.tier || 1, path: st.path && st.path.k, items: cfg.items || [], goldHeld: cfg.goldHeld || 0
  };
  u.kw = { ...(d.kw || {}) };
  Object.keys(u.it).forEach(x => { if (x.startsWith('kw_')) { const n = x.slice(3); u.kw[n] = (u.kw[n] || 0) + u.it[x]; } });
  u.gold = d.gold ? { ...d.gold } : (u.f.fastHands || (u.f.darkBargain && u.tier >= 4) ? { cap: 12 } : null);
  return u;
}

const ESC = { hp: 2.25, dmg: 1.76 };
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
    it: {}, iv: +(d.atk.iv * COMBAT_TEMPO).toFixed(2), cr: d.abil ? d.abil.cr / COMBAT_TEMPO : 0, pa: d.abil ? 5 : 0,
    charge: 0, t: Math.random() * .5, mt: 0, _lastCastT: -99,
    f: { ...(d.f || {}), webwalk: WEBFREE.has(k) }, die: 'd20',
    bands: d.abil ? { low: d.abil.cut[0], hi: d.abil.cut[1] + 1 } : null,
    dm, pen: 0, spen: 0, d20Floor: 1, chaPotency: 1, poisonX: 1, bon: null,
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
const isQuarry = t => !!(t && t.st && (t.st.mark || t.st.hex || t.st.vow));
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
  const avg = (a.d[0] * (a.d[1] + 1) / 2 + (a.flat || 0)) * (a.hits || 1);
  return avg * x.dm / x.iv * (x.boss ? 1.6 : x.elite ? 1.3 : 1) + (x.abil ? 3 : 0);
}
const curAC = (b, t) => (t.st.exp > 0 ? -2 : 0) + t.ac + (t.st.acBT > 0 ? t.st.acB : 0) + t.st.acS - t.st.acid + (t.auraAC || 0);
const curSR = (b, t) => t.sr + (t.auraSR || 0) - (t.st.exp > 0 ? 2 : 0) - (t.st.srShred || 0);

/* ---------- Unified 12-Class Keyword Event Bus & Helpers ---------- */
function emitClassKw(b, actor, kwKey, ctx = {}) {
  if (!b || !actor) return;
  b.kwCounts = b.kwCounts || {};
  b.kwCounts[kwKey] = (b.kwCounts[kwKey] || 0) + 1;
  if (actor.side !== 'P') return;
  const depth = (b._kwDepth || 0);
  if (depth >= 3) return; // Guard against infinite event recursion
  b._kwDepth = depth + 1;
  try {
    const P = alive(b, 'P');
    const tgt = ctx.target && ctx.target.alive ? ctx.target : (actor.target && actor.target.alive ? actor.target : foes(b, actor)[0]);

    if (kwKey === 'action_surge') {
      // Arthur Path 2 Roll for Initiative: any ally Action Surge applies Exposed
      if (tgt && P.some(x => x.f.initSplash)) expose(b, tgt, 4 * chaK(actor));
      // Zoe Path 2 Just the Thing: any ally Action Surge grants Ward + 12 Charge
      P.filter(x => x.f.justTheThing).forEach(zoe => {
        if (actor.alive) {
          addWard(b, actor, (16 + Math.max(0, zoe.m.int) * 2) * zoe.dm, actor.maxHp * .5, zoe);
          giveCharge(b, actor, 12, 1);
        }
      });
      // Flametongue (Favoured): Action Surge spreads Burn
      if (actor.it && actor.it.flameKwBurn && tgt) {
        applyStatus(b, actor, tgt, 'burn', 5);
        const adj = foes(b, actor).find(x => x !== tgt && hd(x, tgt) <= 1);
        if (adj) applyStatus(b, actor, adj, 'burn', 4);
      }
      // Oathbow (Favoured): Action Surge looses a bonus piercing arrow
      if (actor.it && actor.it.surgeArrow && tgt) {
        later(b, .06, () => {
          if (actor.alive && tgt.alive) {
            b.events.push({ k: 'beam', id: actor.id, tid: tgt.id, ty: 'piercing' });
            hit(b, actor, tgt, roll(2, 6), { kind: 'phys', ty: 'piercing', noBonus: 1, onhit: 1 });
          }
        });
      }
    } else if (kwKey === 'channel_divinity') {
      // Bram Path 2 Divine Strike: any ally Channel Divinity triggers adjacent Holy strikes
      P.filter(x => x.f.divineStrike).forEach(bram => triggerAdjHolyStrikes(b, bram));
      // Lumen Path 2 Purifying Light: any ally Channel Divinity fires a free Sear bolt
      P.filter(x => x.f.purifyingLight).forEach(lumen => {
        const hi = foes(b, lumen).sort((a, c) => c.hp - a.hp)[0];
        if (hi) {
          b.events.push({ k: 'beam', id: lumen.id, tid: hi.id, ty: 'radiant' });
          hit(b, lumen, hi, roll(2, 8), { kind: 'holy', ty: 'radiant', noBonus: 1 });
          if (hi.alive) applyStatus(b, lumen, hi, 'burn', 6 * chaK(lumen));
        }
      });
      // Jamison Path 2 Peace & Radiance: any ally Channel Divinity radiates a 1d8 Holy burst
      P.filter(x => x.f.peaceRadiance).forEach(jm => {
        foes(b, jm).filter(x => hd(x, jm) <= 2).forEach(x => hit(b, jm, x, roll(1, 8), { kind: 'holy', ty: 'radiant', noBonus: 1, area: 1 }));
        if (jm.tier >= 4) {
          const low = friends(b, jm).filter(a => !a.minion).sort((a, c) => hpPct(a) - hpPct(c))[0];
          if (low) heal(b, jm, low, 12 * jm.dm, { raw: 1 });
        }
      });
      // Saint Path 2 Smoke & Mirrors: any ally Channel Divinity spawns Saint a free Illusory Double
      P.filter(x => x.f.smokeMirrors && x !== actor).forEach(st => {
        const maxD = (st.f.twoFaced && st.tier >= 4) ? 2 : 1;
        st.illusoryDouble = Math.min(maxD, (st.illusoryDouble || 0) + 1);
        status(b, st, 'MIRROR DOUBLE', '#c48fe6');
      });
      // Sunblade (Favoured): Channel Divinity pulses a heal to nearby allies
      if (actor.it && actor.it.kwHolyHeal) {
        friends(b, actor).filter(a => !a.minion && hd(a, actor) <= 2).forEach(a => heal(b, actor, a, 12 * actor.dm, { raw: 1 }));
      }
    } else if (kwKey === 'smite') {
      // Sir Dane: credit Smite quest if Dane or ally inside Dane's Aura Smites, and Call to Arms grants Aura allies +8 Charge
      P.filter(x => x.key === 'dane').forEach(dane => {
        const rad = dane.questDone ? 3 : 2;
        if (actor === dane || hd(actor, dane) <= rad) {
          if (actor !== dane) dane.stats.smites = (dane.stats.smites || 0) + 1;
        }
        if (dane.f.callToArms) {
          friends(b, dane).filter(a => !a.minion && hd(a, dane) <= rad).forEach(a => giveCharge(b, a, 8, 1));
        }
      });
      // Mother Laurel Path 2 Bountiful Vines: any ally Smite pulses a heal to lowest-HP ally (T4 whole party)
      P.filter(x => x.f.bountifulVines).forEach(ml => {
        const fr = friends(b, ml).filter(a => !a.minion);
        const list = ml.tier >= 4 ? fr : [fr.slice().sort((a, c) => hpPct(a) - hpPct(c))[0]].filter(Boolean);
        list.forEach(a => heal(b, ml, a, (8 + Math.max(0, ml.m.wis) * 2) * ml.dm, { raw: 1 }));
      });
      // Flametongue (Favoured): Smite spreads Burn
      if (actor.it && actor.it.flameKwBurn && tgt) {
        applyStatus(b, actor, tgt, 'burn', 5);
        const adj = foes(b, actor).find(x => x !== tgt && hd(x, tgt) <= 1);
        if (adj) applyStatus(b, actor, adj, 'burn', 4);
      }
      // Sun Blade: Smite pulses a heal to nearby allies in Aura radius
      if (actor.it && actor.it.kwHolyHeal) {
        const rad = ((actor.key === 'dane' && actor.questDone) || actor.it.sentinelAura) ? 3 : 2;
        friends(b, actor).filter(a => !a.minion && hd(a, actor) <= rad).forEach(a => heal(b, actor, a, 12 * actor.dm, { raw: 1 }));
      }
    } else if (kwKey === 'arcane_recovery') {
      // Gains Path 2 Liquid Assets: shares 50% of Arcane Recovery Charge with all allies
      if (actor.f.liquidAssets && ctx.charge > 0) {
        const share = Math.max(6, Math.round(ctx.charge * .5));
        friends(b, actor).filter(a => a !== actor && !a.minion).forEach(a => giveCharge(b, a, share, 1));
      }
    } else if (kwKey === 'rage') {
      // Zark Path 2 Totem Roar: whenever ANY ally enters or stacks Rage, adjacent allies (T4 party) gain Haste + Charge
      P.filter(x => x.f.totemRoar).forEach(zark => {
        const allies = friends(b, zark).filter(a => a !== zark && !a.minion && (zark.tier >= 4 || hd(a, zark) <= 1));
        allies.forEach(a => {
          a.tempHaste = Math.max(a.tempHaste || 0, 25);
          a.tempHasteT = Math.max(a.tempHasteT || 0, 3);
          giveCharge(b, a, 18);
        });
        if (allies.length) status(b, zark, 'TOTEM ROAR', '#ffd27a');
      });
      // Pillar Tier IV Living Beacon: entering Rage heals nearby allies
      if (actor.f.livingBeacon && actor.tier >= 4) {
        friends(b, actor).filter(a => a !== actor && !a.minion && hd(a, actor) <= 2).forEach(a => heal(b, actor, a, 24 * actor.dm));
      }
    } else if (kwKey === 'wild_shape') {
      // Juniper Path 2 Circle of the Land: any ally Wild Shape triggers Circle of the Land heal + Ward
      P.filter(x => x.f.circleLand).forEach(j => triggerCircleLand(b, j));
      // Mother Laurel Path 2 Bountiful Vines: any ally Wild Shape pulses a heal
      P.filter(x => x.f.bountifulVines).forEach(ml => {
        const fr = friends(b, ml).filter(a => !a.minion);
        const list = ml.tier >= 4 ? fr : [fr.slice().sort((a, c) => hpPct(a) - hpPct(c))[0]].filter(Boolean);
        list.forEach(a => heal(b, ml, a, (8 + Math.max(0, ml.m.wis) * 2) * ml.dm, { raw: 1 }));
      });
      // Moon Sickle: entering Wild Shape grants +25% Attack Speed & +2 Damage for 4s
      if (actor.it && actor.it.moonSickle) {
        actor.tempHaste = Math.max(actor.tempHaste || 0, 25);
        actor.tempHasteT = Math.max(actor.tempHasteT || 0, 4);
        actor.moonDmgT = Math.max(actor.moonDmgT || 0, 4);
      }
    } else if (kwKey === 'sneak_attack') {
      // Velith Path 2 Nightshade Vials: any ally Sneak Attack splashes 2 Poison
      if (tgt && P.some(x => x.f.nightshade)) {
        applyStatus(b, actor, tgt, 'poison', 2);
      }
      // Dagger of Venom: Sneak Attack applies 2 Poison & shreds -2 AC for 3s
      if (tgt && actor.it && actor.it.sneakVenom) {
        applyStatus(b, actor, tgt, 'poison', 2);
        tgt.st.acid = Math.max(tgt.st.acid || 0, 2);
        tgt.st.acidT = Math.max(tgt.st.acidT || 0, 3);
      }
    } else if (kwKey === 'ki_ability') {
      // Naill Path 2 Flowing Leaves: any ally Ki Ability Staggers & Exposes adjacent foes (+15 Charge at T4)
      P.filter(x => x.f.flowingLeaves).forEach(naill => {
        if (tgt) {
          foes(b, actor).filter(x => x !== tgt && hd(x, tgt) <= 1).forEach(x => { stagger(b, x, 2); expose(b, x, 3.5); });
        }
        if (naill.tier >= 4) {
          const lowC = friends(b, naill).filter(a => a !== actor && !a.minion && a.abil).sort((a, c) => a.charge - c.charge)[0];
          if (lowC) giveCharge(b, lowC, 15);
        }
      });
      // Staff of Striking: Ki Ability strikes twice and refunds 1 Ki pip
      if (actor.it && actor.it.kiDoubleStrike) {
        actor.ki = Math.min(KI_MAX, (actor.ki || 0) + 1);
        if (tgt && tgt.alive) {
          later(b, .08, () => {
            if (actor.alive && tgt.alive) hit(b, actor, tgt, roll(1, 8) + Math.max(0, actor.m.wis), { kind: 'phys', ty: 'bludgeoning', melee: 1, noBonus: 1, onhit: 1 });
          });
        }
      }
    } else if (kwKey === 'bardic_inspiration' && ctx.action === 'spend') {
      // Pipes of Haunting: spending Inspiration grants +15% Charge
      P.filter(x => x.it && x.it.inspCharge).forEach(p => {
        if (actor.alive) giveCharge(b, actor, p.it.inspCharge, 1);
      });
      // Horn of Valhalla: spending Inspiration grants 18 HP Ward & +20% Attack Speed for 3s
      P.filter(x => x.it && x.it.inspWardHaste).forEach(h => {
        if (actor.alive) {
          addWard(b, actor, 18 * h.dm, actor.maxHp * .5, h);
          actor.tempHaste = Math.max(actor.tempHaste || 0, 20);
          actor.tempHasteT = Math.max(actor.tempHasteT || 0, 3);
        }
      });
    } else if (kwKey === 'metamagic') {
      // Wand of Fireballs: every Metamagic trigger detonates a 1-square Fireball applying Burn
      if (actor.it && actor.it.metaFireball) {
        fireWandFireball(b, actor);
      }
    } else if (kwKey === 'pact_boon') {
      // Rod of the Pact Keeper: Pact Boon restores 15% HP & +15 Charge
      if (actor.it && actor.it.pactRestore && actor.alive) {
        heal(b, actor, actor, Math.round(actor.maxHp * .15), { raw: 1 });
        giveCharge(b, actor, 15, 1);
      }
      // Staff of Withering: Pact Boon spreads Hex to two enemies
      if (actor.it && actor.it.pactSpreadHex && actor.alive) {
        const cands = foes(b, actor).filter(x => !x.st.hex);
        const list = cands.length ? cands.slice(0, 2) : foes(b, actor).slice(0, 2);
        list.forEach(x => applyNettleHex(b, actor, x, false));
      }
    }
  } finally {
    b._kwDepth = depth;
  }
}

function fireWandFireball(b, u) {
  if (!u || !u.alive) return;
  const fs = foes(b, u).filter(x => !x.hidden);
  const c = (u.target && u.target.alive) ? u.target : fs[0];
  if (!c) return;
  const hitFoes = fs.filter(x => hd(x, c) <= 1);
  b.events.push({ k: 'area', id: u.id, tid: c.id, shape: 'splash', r: 1, ty: 'fire', ids: hitFoes.map(x => x.id) });
  hitFoes.forEach(x => {
    hit(b, u, x, roll(2, 6), { kind: 'magic', el: 'fire', ty: 'fire', area: 1, noBonus: 1 });
    if (x.alive) applyStatus(b, u, x, 'burn', 6 * chaK(u));
  });
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
    if (opts.cleave) {
      const list = (u.f.gildedHoard && u.tier >= 4) ? foes(b, u).filter(x => hd(x, u) <= 1) : [tgt];
      b.events.push({ k: 'area', id: u.id, tid: tgt.id, shape: 'nova', r: 1, ty: 'force', ids: list.map(x => x.id) });
      list.forEach(x => {
        if (x.alive) {
          strike(b, u, x, 1);
          if (x.alive) hit(b, u, x, roll(2, 6), { kind: 'magic', ty: 'force', noBonus: 1, area: 1 });
        }
      });
    } else {
      const mult = (u.key === 'arthur' && u.f.vigilance) ? 1.5 : 1;
      later(b, .04, () => {
        if (!u.alive) return;
        const x = tgt.alive ? tgt : foes(b, u).sort((a, c) => hd(a, u) - hd(c, u))[0];
        if (x && (hd(x, u) <= Math.max(2, u.rng) || u.rng >= 3)) strike(b, u, x, mult);
      });
    }
  }
  emitClassKw(b, u, 'action_surge', { target: tgt, giver: opts.giver });
}

function triggerChannelDivinity(b, u, label, fn) {
  if (!u || !u.alive) return false;
  u._cdUsed = 1;
  u.stats.channelDivinities = (u.stats.channelDivinities || 0) + 1;
  u.stats.channel = (u.stats.channel || 0) + 1;
  const cdMult = 1 + ((u.it && u.it.cdBoost) || 0);
  if (fn) fn(cdMult);
  callout(b, u, label || 'CHANNEL DIVINITY!', '#ffe9a0');
  emitClassKw(b, u, 'channel_divinity', { label, cdMult });
  return true;
}

function triggerBramCD(b, u) {
  u._pres = 1;
  return triggerChannelDivinity(b, u, 'CD · PRESERVE LIFE', mult => {
    const ts = friends(b, u).filter(a => !a.minion && hd(a, u) <= 4);
    b.events.push({ k: 'area', id: u.id, shape: 'nova', r: 4, ty: 'radiant', ids: ts.map(x => x.id) });
    ts.forEach(a => heal(b, u, a, a.maxHp * (.14 + .02 * Math.max(0, u.m.wis)) * mult, { raw: 1 }));
  });
}

function triggerLumenCD(b, u) {
  return triggerChannelDivinity(b, u, 'CD · RADIANCE OF DAWN', mult => {
    const ts = foes(b, u).filter(x => hd(x, u) <= 3);
    const list = ts.length ? ts : foes(b, u).slice(0, 2);
    b.events.push({ k: 'area', id: u.id, shape: 'nova', r: 3, ty: 'radiant', ids: list.map(x => x.id) });
    list.forEach(x => {
      hit(b, u, x, Math.round(roll(3, 8) * mult), { kind: 'holy', ty: 'radiant', area: 1, ab: 1 });
      if (x.alive) {
        applyStatus(b, u, x, 'burn', 8 * mult * chaK(u));
        u.stats.searApplied = (u.stats.searApplied || 0) + 1;
      }
    });
  });
}

function triggerJamisonCD(b, u) {
  return triggerChannelDivinity(b, u, 'CD · BALM OF PEACE', mult => {
    const fr = friends(b, u).filter(a => !a.minion);
    const die = (u.f.goodVibes && u.tier >= 4) ? 6 : 4;
    b.events.push({ k: 'area', id: u.id, shape: 'nova', r: 5, ty: 'radiant', ids: fr.map(x => x.id) });
    fr.forEach(a => {
      a.bonded = u;
      a.bondDie = Math.max(a.bondDie || 0, die);
      if (u.questDone) a.d20Floor = Math.max(a.d20Floor || 1, u.d20Floor || 1);
      heal(b, u, a, (18 + Math.max(0, u.m.cha) * 4) * u.dm * mult, { raw: 1 });
    });
    u.stats.bondedCasts = (u.stats.bondedCasts || 0) + fr.length;
  });
}

function triggerSaintCD(b, u) {
  return triggerChannelDivinity(b, u, 'CD · INVOKE DUPLICITY', mult => {
    const maxD = (u.f.twoFaced && u.tier >= 4) ? 2 : 1;
    u.illusoryDouble = Math.min(maxD, (u.illusoryDouble || 0) + 1);
    if (mult > 1.01) addWard(b, u, 16 * u.dm * mult, u.maxHp * .4, u);
  });
}

function triggerSmite(b, u, t, dmg, opts = {}) {
  if (!u || !u.alive || !t || !t.alive) return 0;
  const dealt = hit(b, u, t, dmg, { kind: 'holy', ty: 'radiant', noBonus: 1, ab: opts.ab || 0, onhit: opts.onhit || 0, thorn: opts.thorn || 0 });
  u.stats.smites = (u.stats.smites || 0) + 1;
  if (opts.label) status(b, t, opts.label, '#ffe9a0');
  emitClassKw(b, u, 'smite', { target: t, dmg: dealt });
  return dealt;
}

function triggerArcaneRecovery(b, u, baseCharge, why) {
  if (!u || !u.alive) return 0;
  const mult = (1 + ((u.it && u.it.arcRecBoost) || 0)) * ((u.it && u.it.doubleArcaneRec) ? 2 : 1);
  const amt = Math.round(baseCharge * mult);
  giveCharge(b, u, amt, 1);
  u.stats.arcaneRecoveries = (u.stats.arcaneRecoveries || 0) + 1;
  status(b, u, `ARCANE REC +${amt}`, '#8fb4e6');
  emitClassKw(b, u, 'arcane_recovery', { charge: amt, why });
  return amt;
}

function grantAlert(b, u, stacks = 1) {
  if (!u || !u.alive) return;
  u.alert = Math.max(u.alert || 0, stacks);
  status(b, u, stacks > 1 ? `ALERT ×${stacks}` : 'ALERT', '#8fd0ff');
}

function triggerAdjHolyStrikes(b, bram) {
  const die = bram.tier >= 4 ? 8 : 4;
  friends(b, bram).filter(a => a !== bram && !a.minion && hd(a, bram) <= 1).forEach(a => {
    const t = a.target && a.target.alive ? a.target : foes(b, a).sort((x, y) => hd(x, a) - hd(y, a))[0];
    if (t && hd(t, a) <= 2) hit(b, a, t, roll(1, die), { kind: 'holy', ty: 'radiant', noBonus: 1, onhit: 1 });
  });
}

function grantInspDie(b, giver, target, sides, passes) {
  if (!target || !target.alive) return;
  const cur = target.inspDie;
  if (!cur || sides >= cur.sides) {
    target.inspDie = { sides, passes: passes || 0, giver, chaBonus: Math.max(0, Math.floor((giver.m.cha || 0) / 2)), expandCrit: !!(giver.key === 'rosalind' && giver.questDone) };
  } else {
    cur.passes = Math.max(cur.passes, passes || 0);
    if (giver.key === 'rosalind' && giver.questDone) cur.expandCrit = true;
  }
  status(b, target, `INSPIRED d${target.inspDie.sides}`, '#ffd76a');
  emitClassKw(b, giver, 'bardic_inspiration', { action: 'grant', target, kind: 'die' });
}

function grantInspMote(b, giver, target, chargeAmt) {
  if (!target || !target.alive) return;
  target.advantage = Math.max(target.advantage || 0, 1);
  target.inspMote = { giver };
  if (giver.f.busker && giver.tier >= 4) target.nextBonus = Math.min(6, (target.nextBonus || 0) + 2);
  if (chargeAmt > 0) giveCharge(b, target, chargeAmt);
  status(b, target, 'INSPIRED (MOTE)', '#ffd76a');
  emitClassKw(b, giver, 'bardic_inspiration', { action: 'grant', target, kind: 'mote' });
}

function passInspDie(b, spentBy, dieObj) {
  if (!dieObj || dieObj.passes <= 0) return;
  const giver = dieObj.giver;
  const shrink = !(giver && giver.f && giver.f.passRound && giver.tier >= 4);
  const nextSides = shrink ? (dieObj.sides >= 10 ? 8 : dieObj.sides >= 8 ? 6 : 4) : dieObj.sides;
  const others = friends(b, spentBy).filter(a => a !== spentBy && a !== giver && !a.minion && a.abil);
  if (!others.length) return;
  const nextT = others.sort((a, c) => (a.inspDie ? 1 : 0) - (c.inspDie ? 1 : 0) || c.charge - a.charge)[0];
  if (giver && giver.stats) giver.stats.inspPassed = (giver.stats.inspPassed || 0) + 1;
  grantInspDie(b, giver || spentBy, nextT, nextSides, dieObj.passes - 1);
}

function addSorcery(b, u, n, excludeCenter, hurlFn) {
  if (!u || !u.alive) return;
  const maxPips = (u.f.draconicSurge && u.tier >= 4) ? 3 : 4;
  u.sorcery = Math.min(maxPips, (u.sorcery || 0) + n);
  emitClassKw(b, u, 'sorcery_points', { added: n, total: u.sorcery });
  if (u.sorcery >= maxPips) {
    u.sorcery = 0;
    u.stats.metamagics = (u.stats.metamagics || 0) + 1;
    callout(b, u, 'METAMAGIC · TWINNED!', '#ff9c4a');
    emitClassKw(b, u, 'metamagic', { kind: 'twinned' });
    later(b, .16, () => {
      if (!u.alive) return;
      if (hurlFn) hurlFn(excludeCenter, true);
      else {
        const fs = foes(b, u).filter(x => !x.hidden);
        if (!fs.length) return;
        const c = fs[0];
        const hitFoes = fs.filter(x => hd(x, c) <= 1);
        b.events.push({ k: 'area', id: u.id, tid: c.id, shape: 'splash', r: 1, ty: 'fire', ids: hitFoes.map(x => x.id) });
        hitFoes.forEach(x => {
          hit(b, u, x, roll(4, 6), { kind: 'magic', el: 'fire', ty: 'fire', area: 1 });
          applyStatus(b, u, x, 'burn', 8 * chaK(u));
          if (u.f.wildfire && x.alive) { expose(b, x, 4 * chaK(u)); x.st.srShred = Math.min(6, (x.st.srShred || 0) + 2); }
        });
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
  u.stats.cunningActions = (u.stats.cunningActions || 0) + 1;
  if (opts.stealth > 0) {
    u.hidden = 1;
    u.hideT = Math.max(u.hideT || 0, b.time + opts.stealth);
    if (opts.stealthShield) u.stealthShield = 1;
    b.units.forEach(x => { if (x.target === u) x.target = null; });
  }
  status(b, u, `CUNNING · ${opts.label || 'STEALTH'}`, '#c48fe6');
  emitClassKw(b, u, 'cunning_action', { target, ...opts });
}

function triggerSneakAttack(b, u, target, opts = {}) {
  if (!u || !u.alive || !target) return;
  u.stats.sneaks = (u.stats.sneaks || 0) + 1;
  if (!opts.ability && target.alive) {
    const dice = (u.kw && u.kw.sneak_attack) || 1;
    hit(b, u, target, roll(dice, 6), { kind: 'phys', ty: 'piercing', noBonus: 1, onhit: 1 });
  }
  emitClassKw(b, u, 'sneak_attack', { target, ...opts });
}

function kiCost(u) {
  return (u.f && u.f.naillOpenHand && u.tier >= 4) ? 3 : KI_MAX;
}

function fireNaillKiStrike(b, u, t) {
  if (!u || !u.alive || !t || !t.alive) return;
  u.ki = 0;
  u.stats.kiStrikes = (u.stats.kiStrikes || 0) + 1;
  callout(b, u, 'KI · OPEN HAND!', '#8fd8d8');
  b.events.push({ k: 'area', id: u.id, tid: t.id, shape: 'splash', r: u.f.flowingLeaves ? 1 : 0.6, ty: 'thunder', ids: [t.id] });
  const got = hit(b, u, t, roll(1, 8) + Math.max(0, u.m.wis), { kind: 'phys', ty: 'bludgeoning', melee: 1, noBonus: 1 });
  stagger(b, t, 2);
  if (u.f.naillOpenHand) {
    if (t.alive) { onHit(b, u, t, got); onHit(b, u, t, got); }
    u.nextBonus += 1;
  }
  if (u.key === 'naill' && u.questDone) {
    u.advantage = 1; // Wraps of the Hundred Fists
  }
  emitClassKw(b, u, 'ki_ability', { target: t });
}

function fireGenericKiAbility(b, u, t) {
  if (!u || !u.alive || !t || !t.alive) return;
  u.ki = 0;
  u.stats.kiStrikes = (u.stats.kiStrikes || 0) + 1;
  stagger(b, t, 2);
  status(b, t, 'KI ABILITY', '#8fd8d8');
  emitClassKw(b, u, 'ki_ability', { target: t });
}

function triggerPactBoon(b, nettle, victim, killer) {
  if (!nettle) return;
  nettle.stats.hexDeaths = (nettle.stats.hexDeaths || 0) + 1;
  nettle.stats.pactBoons = (nettle.stats.pactBoons || 0) + 1;
  if (victim && victim.st.hexJump && nettle.alive) {
    const nx = foes(b, nettle)[0];
    if (nx) applyNettleHex(b, nettle, nx, true);
    friends(b, nettle).filter(a => !a.minion).forEach(a => heal(b, nettle, a, (5 + Math.max(0, nettle.m.cha)) * nettle.dm, { raw: 1 }));
  }
  if (nettle.f.darkBargain && killer && killer.side === 'P' && killer.alive) {
    giveCharge(b, killer, 30);
    killer.advantage = 1;
    status(b, killer, 'PACT BOON ADV!', '#c48fe6');
    if (nettle.tier >= 4 && victim && (victim.elite || victim.boss)) gainGold(b, nettle, 3, 'BARGAIN');
  }
  if (nettle.alive && nettle.key === 'nettle' && nettle.questDone) {
    nettle.clauses = (nettle.clauses || 0) + 1;
    nettle.rollBonus += 1;
    nettle.cr *= 1.10;
    nettle.chgX *= 1.10;
    status(b, nettle, `CLAUSE ×${nettle.clauses}`, '#ffd76a');
  }
  emitClassKw(b, nettle, 'pact_boon', { victim, killer });
}

function applyRoot(b, src, t, dur) {
  if (!t || !t.alive) return;
  t.st.root = Math.max(t.st.root, dur);
  status(b, t, 'ROOTED', '#6da670');
  if (src && src.stats) src.stats.rootsApplied = (src.stats.rootsApplied || 0) + 1;
  if (src && src.key === 'juniper') {
    triggerCircleLand(b, src);
    if (src.f.overgrowth && src.tier >= 4) {
      foes(b, src).filter(x => x !== t && hd(x, t) <= 1 && x.st.root < dur * .6).forEach(x => {
        x.st.root = Math.max(x.st.root, dur * .75);
      });
    }
  }
}

function triggerCircleLand(b, juniper) {
  if (!juniper || !juniper.alive || !juniper.f.circleLand) return;
  const fr = friends(b, juniper).filter(a => !a.minion);
  const targets = juniper.tier >= 4 ? fr : [fr.slice().sort((a, c) => hpPct(a) - hpPct(c))[0]].filter(Boolean);
  const amt = (4 + Math.max(0, juniper.m.wis)) * juniper.dm;
  targets.forEach(a => {
    heal(b, juniper, a, amt, { raw: 1 });
    addWard(b, a, amt * .8, a.maxHp * .4, juniper);
  });
}

function applyNettleHex(b, u, t, withJump) {
  if (!t || !t.alive) return;
  const maxStacks = (u.f.finePrint && u.tier >= 4) ? 2 : 1;
  t.st.hex = u;
  t.st.hexStacks = Math.min(maxStacks, (t.st.hexStacks || 0) + 1);
  if (withJump) t.st.hexJump = 1;
  status(b, t, t.st.hexStacks > 1 ? 'HEX ×2' : 'HEXED', '#c48fe6');
  emitClassKw(b, u, 'hex', { target: t });
}

function markFoe(b, u, t) {
  if (!t || !t.alive || t.side === u.side) return;
  t.st.mark = u;
  status(b, t, 'HUNTER’S MARK', '#9fd86a');
  emitClassKw(b, u, 'hunters_mark', { target: t });
}
function hexFoe(b, u, t) { applyNettleHex(b, u, t, false); }
const liveMark = (b, u) => b.units.find(x => x.alive && x.st.mark === u);
const liveHex = (b, u) => b.units.find(x => x.alive && x.st.hex === u);

function stagger(b, t, s) { if (!t || !t.alive) return; if (t.boss) s *= .6; t.st.stag = Math.max(t.st.stag || 0, s); status(b, t, 'STAGGERED', '#ffb27a'); }
function expose(b, t, s) { if (!t || !t.alive) return; t.st.exp = Math.max(t.st.exp || 0, s); t.hidden = 0; status(b, t, 'EXPOSED', '#ff9cd0'); }
function frighten(b, t, s) { if (!t || !t.alive || t.boss || t.f.braveSelf || t.auraDane) return; t.st.fear = Math.max(t.st.fear || 0, s); status(b, t, 'FRIGHTENED', '#d0a0ff'); }
function charm(b, src, t, s) { if (!t || !t.alive || t.boss || t.f.feyAncestry || t.auraDane) return; t.st.charm = Math.max(t.st.charm || 0, s); t.target = null; status(b, t, 'CHARMED', '#ff9cd0'); }
function stun(b, t, s) { if (t.it && t.it.freeAct) s *= .5; t.st.stun = Math.max(t.st.stun, s); status(b, t, 'STUNNED', '#ffd27a'); }
function acBuff(b, u, v, s) { u.st.acB = Math.max(u.st.acB && u.st.acBT > 0 ? u.st.acB : 0, v); u.st.acBT = Math.max(u.st.acBT, s); status(b, u, '+' + v + ' AC', '#a8b8cc'); }
function taunt(b, u, R, T) { const fs = foes(b, u).filter(x => hd(x, u) <= R); fs.forEach(x => { x.st.taunt = T; x.st.tauntBy = u; x.target = u; }); b.events.push({ k: 'area', id: u.id, shape: 'nova', r: R, ty: 'force', ids: fs.map(x => x.id) }); }

function gainGold(b, u, v, why) {
  if (!u || u.side !== 'P' || !(v > 0)) return 0;
  const cap = (u.gold && u.gold.cap) || 12;
  const got = Math.min(Math.round(v), cap - (u.stats.gold || 0));
  if (got <= 0) return 0;
  u.stats.gold = (u.stats.gold || 0) + got;
  b.gold = (b.gold || 0) + got;
  b.events.push({ k: 'status', id: u.id, txt: `+${got} GOLD${why ? ' · ' + why : ''}`, col: '#ffd76a' });
  // Toot Path 1 Busker's Rhythm: combat Gold speeds up Toot
  alive(b, 'P').filter(x => x.f.busker).forEach(toot => {
    const add = Math.min(100 - (toot._buskerH || 0), got * 10);
    if (add > 0) { toot._buskerH = (toot._buskerH || 0) + add; toot.haste += add; toot.cr *= (1 + add / 100); toot.chgX *= (1 + add / 100); }
  });
  // Gains Arcane Recovery (Transmutation): triggers whenever Gold drops in combat!
  alive(b, 'P').filter(x => x.f.transmuter).forEach(g => {
    triggerArcaneRecovery(b, g, 16, 'GOLD');
  });
  return got;
}

/* ---------- Damage & Mitigation ---------- */
function bonusFor(src, o) {
  const B = src.bon;
  if (!B || o.noBonus) return 0;
  const itemFlat = !o.ab ? ((src.dmgBonus || 0) + ((src.it && src.it.rageDmg) ? (src.bearRage || 0) * src.it.rageDmg : 0) + ((src.moonDmgT || 0) > 0 ? 2 : 0)) : 0;
  if (o.kind === 'holy') return itemFlat;
  const melee = o.melee || src.rng <= 2 || (src.thrown && !o.ab);
  let v = o.ab ? B.k : B.w;
  if (o.kind === 'phys' && !melee && !o.ab && src.cls && H[src.key] && pairOf(H[src.key])[0] === 'str') v = 0;
  return v + itemFlat;
}

function mitigate(b, src, t, amt, o) {
  if (o.kind === 'holy' || o.dot) return amt;
  let base = o.kind === 'magic' ? curSR(b, t) : curAC(b, t);
  let pen = (o.pen || 0) + (src ? (o.kind === 'magic' ? src.spen : src.pen) : 0);
  // Zark Tier IV Relentless Bear: Armor Pen per Bear Rage stack
  if (src && o.kind !== 'magic' && src.f.relentlessBear && src.tier >= 4 && src.bearRage > 0) pen += src.bearRage;
  // Oathbow: ignore 30% AC vs Marked targets
  if (src && o.kind !== 'magic' && src.it && src.it.markPenPct && t.st.mark) pen += Math.round(base * src.it.markPenPct);
  if (pen > 0) base = Math.max(Math.min(base, 10), base - pen);
  base = Math.max(5, base);
  return amt * 10 / base;
}

function onAllyDodge(b, dodger, attacker) {
  if (!dodger || dodger.side !== 'P') return;
  alive(b, 'P').filter(x => x.f.smokeMirrors).forEach(st => {
    heal(b, st, dodger, (14 + Math.max(0, st.m.wis) * 3) * st.dm, { raw: 1 });
    dodger.nextBonus = Math.min(6, (dodger.nextBonus || 0) + 2);
    if (st.tier >= 4 && attacker && attacker.alive) {
      later(b, 0, () => { if (st.alive && attacker.alive) hit(b, st, attacker, roll(2, 8), { kind: 'magic', ty: 'necrotic', noBonus: 1, thorn: 1 }); });
    }
  });
}

function hit(b, src, t, amt, o = {}) {
  if (!t || !t.alive) return 0;
  o.ab = o.ab ?? (src && src._casting ? 1 : 0);
  if (src && src.c !== undefined) src._shown = b.time + 2;

  // Dodge checks: Alert, Afterimage & Saint's Illusory Double
  if (src && !o.dot && amt > 0 && !(t.st.exp > 0) && !(src.f && src.f.keenSight)) {
    if (t.alert > 0) {
      t.alert--;
      t.stats.alertDodges = (t.stats.alertDodges || 0) + 1;
      status(b, t, 'ALERT DODGE!', '#8fd0ff');
      // Arthur Action Surge (Combat Reflexes): dodging with Alert triggers Action Surge!
      if (t.f.arthurSurge) {
        triggerActionSurge(b, t, { target: src, charge: 15, label: 'ACTION SURGE!' });
      }
      if (t.side === 'P' && alive(b, 'P').some(x => x.f.initSplash)) giveCharge(b, t, 22);
      onAllyDodge(b, t, src);
      return 0;
    }
    if (t.afterimage > 0) {
      t.afterimage--;
      status(b, t, 'AFTERIMAGE!', '#8fd8d8');
      if (t.key === 'naill' && t.questDone) t.ki = Math.min(KI_MAX, (t.ki || 0) + 1);
      if (t.side === 'P' && alive(b, 'P').some(x => x.f.initSplash)) giveCharge(b, t, 22);
      onAllyDodge(b, t, src);
      return 0;
    }
  }
  if (src && !o.dot && amt > 0 && (t.illusoryDouble || 0) > 0) {
    t.illusoryDouble--;
    status(b, t, 'ILLUSORY DOUBLE!', '#c48fe6');
    if (t.f.twoFaced) {
      if (src.alive) addNec(b, t, src, 12);
      giveCharge(b, t, 25);
    }
    onAllyDodge(b, t, src);
    return 0;
  }

  let raw = amt;
  if (o.area && szOf(t) > 1) raw *= LARGE_AREA;

  if (src && !o.dot) {
    if (amt > 0) raw += bonusFor(src, o);
    let mul = src.dm * (1 + .15 * otLevel(b)) * (o.mul || 1) * (o.ab ? src.abM || 1 : o.strike ? src.atM || 1 : 1);
    if (src.st.mockT > 0) mul *= .85;
    if (o.onhit && t.st.mark && alive(b, 'P').some(x => x.f.trophyVolley)) mul *= 1.35;
    if (src.key === 'lorcan' && src.questDone && src.questTrophies && src.questTrophies.length) {
      const arches = archOf(t.key);
      if (arches.some(a => src.questTrophies.includes(a))) mul *= 1.15;
    }
    // Velith Path 2 Nightshade Vials: +18% party damage in opening 5s
    if (b.time <= 5 && src.side === 'P' && alive(b, 'P').some(x => x.f.nightshade)) mul *= 1.18;
    // Velith Tier IV Death's Ledger: attacks from Stealth deal +50%
    if (src.hidden && src.f.deathsLedger && src.tier >= 4) mul *= 1.5;
    // Gains Tier IV Compound Interest: Gilded foes take +25% magic damage
    if (o.kind === 'magic' && t.st.gilded && alive(b, 'P').some(x => x.f.compoundInterest && x.tier >= 4)) mul *= 1.25;
    raw *= mul;
  }

  if (o.dot && o.ty === 'poison' && t.st.root > 0 && alive(b, 'P').some(x => x.f.overgrowth)) raw *= 2;
  if (o.dot && t.st.mark && alive(b, 'P').some(x => x.f.trophyVolley)) raw *= 1.35;

  let dmg = Math.max(amt > 0 ? 1 : 0, Math.round(mitigate(b, src, t, raw, o)));

  if (t.f.hellishRes && (o.el === 'fire' || o.ty === 'fire')) dmg = Math.round(dmg * .5);
  if (t.stealthShield && !o.dot && dmg > 0) { t.stealthShield = 0; dmg = Math.round(dmg * .5); status(b, t, 'GLANCING', '#c48fe6'); }
  if (t.bearRage > 0 && !o.dot && dmg > 0) { dmg = Math.max(1, Math.round(dmg * (1 - Math.min(.60, t.bearRage * .04)))); }
  // Pillar Stone's Endurance: reduces heavy hits by 4
  if (t.f.stoneEndure && !o.dot && dmg >= 12) dmg = Math.max(1, dmg - t.f.stoneEndure);
  // Brother Jamison Good Vibes: bonded allies take 15% less damage
  if (t.bonded && t.bonded.f && t.bonded.f.goodVibes && dmg > 0) dmg = Math.max(1, Math.round(dmg * .85));

  const pre = dmg;
  const hadWard = t.ward > 0;
  let wardAbsorbedHit = false;
  if (t.ward > 0 && dmg > 0) {
    wardAbsorbedHit = true;
    const a = Math.min(t.ward, dmg);
    t.ward -= a;
    dmg -= a;
    t.stats.wardAbs = (t.stats.wardAbs || 0) + a;
    if (t._wardBy && t._wardBy.stats) t._wardBy.stats.wardAbsorbed = (t._wardBy.stats.wardAbsorbed || 0) + a;
    if (t.f.discipleLife) t.nextBonus = Math.min(6, (t.nextBonus || 0) + 2);
    if (hadWard && t.ward <= 0 && t._wardBy) {
      const giver = t._wardBy;
      t._wardBy = null;
      if (giver.alive && giver.f.abjurer) {
        triggerArcaneRecovery(b, giver, 20, 'WARD BREAK');
        giver._wardsBroken = (giver._wardsBroken || 0) + 1;
        if (giver.f.projWard && giver._wardsBroken % 3 === 0) {
          giver.advantage = 1;
          status(b, giver, 'ADVANTAGE', '#8fb4e6');
        }
        if (giver.f.spellBattery) {
          const ch = 16 + Math.max(0, giver.m.int) * 3;
          giveCharge(b, t, ch);
          if (giver.tier >= 4) {
            friends(b, t).filter(x => x !== t && !x.minion && hd(x, t) <= 1).forEach(x => giveCharge(b, x, ch));
          }
        }
      }
    }
  } else if (t.f.discipleLife && !o.dot && raw > 4 && pre < raw * .65) {
    t.nextBonus = Math.min(6, (t.nextBonus || 0) + 2);
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
    giveCharge(b, t, pre / t.maxHp * (t.side === 'E' ? CHARGE_TAKEN : CHG.struck * (t.chgX || 1)), 1);
  }
  if (t.side === 'P' && pre > 0) {
    const sh = watchShare(b, t);
    for (const a of b.units) {
      if (a.alive && a.side === 'P' && a.trig === 'watchful' && hd(a, t) <= a.rng + 1) {
        giveCharge(b, a, pre / t.maxHp * CHG.watchful * (a === t ? 2.5 : sh) * (a.chgX || 1), 1);
      }
    }
  }

  // Pillar Path 2 Living Beacon: taking damage empowers adjacent allies' next strike with +1d6 Holy Smite
  if (t.f.livingBeacon && !o.dot && pre > 0 && t.alive) {
    friends(b, t).filter(a => a !== t && !a.minion && hd(a, t) <= 1).forEach(a => { a._beaconHoly = 1; });
  }

  if (t.f.relentlessBear && !o.dot && pre >= t.maxHp * .10 && t.alive) {
    t.nextBonus = Math.min(6, (t.nextBonus || 0) + 2);
    heal(b, t, t, (3 + Math.max(0, t.m.con)) * t.dm, { raw: 1 });
  }
  // Arthur Action Surge at 50% HP (once per fight; Constant Vigilance also grants Alert!)
  if (t.f.arthurSurge && !t._secondWind && t.alive && t.hp < t.maxHp * .5) {
    t._secondWind = 1;
    if (t.f.vigilance) grantAlert(b, t, t.tier >= 4 ? 2 : 1);
    triggerActionSurge(b, t, { target: src, charge: 15, label: 'ACTION SURGE!' });
  }
  // Gilthrax Action Surge (Eldritch Counter): every 3 hits absorbed by Ward or reflected triggers Action Surge!
  if (t.f.gilthraxSurge && !o.dot && pre > 0 && t.alive && (wardAbsorbedHit || t.arcaneReflectT > 0)) {
    t._shieldHits = (t._shieldHits || 0) + 1;
    if (t._shieldHits % 3 === 0) {
      later(b, .04, () => { if (t.alive) triggerActionSurge(b, t, { target: src, cleave: 1, label: 'ELDRITCH SURGE!' }); });
    }
  }
  if (t.it && t.it.potionHeal && !t._potionUsed && t.alive && t.hp < t.maxHp * .5) {
    t._potionUsed = 1;
    const act = Math.min(4, Math.max(1, t.act || 1));
    const dice = [[2, 4, 2], [4, 4, 4], [8, 4, 8], [10, 4, 20]][act - 1];
    let amtH = roll(dice[0], dice[1]) + dice[2];
    if (alive(b, 'P').some(x => x.key === 'bram' && x.questDone)) amtH = Math.round(amtH * 1.5);
    heal(b, t, t, amtH, { raw: 1 });
    status(b, t, `POTION +${amtH}`, '#8fe0a0');
  }
  // Periapt of Wound Closure: first time below 50% HP grants +2 Rage and double Regen for 4s
  if (t.it && t.it.woundRage && !t._woundRageUsed && t.alive && t.hp < t.maxHp * .5) {
    t._woundRageUsed = 1;
    t.doubleRegenT = Math.max(t.doubleRegenT || 0, 4);
    addBearRage(b, t, 2);
  }
  // Amulet of Health: heavy hit (>= 15% Max HP) heals back 30% over 2s
  if (t.it && t.it.heavyHitRecover && !o.dot && pre >= t.maxHp * .15 && t.alive) {
    const halfRec = Math.max(1, Math.round(pre * t.it.heavyHitRecover * .5));
    later(b, 1.0, () => { if (t.alive) heal(b, t, t, halfRec, { raw: 1 }); });
    later(b, 2.0, () => { if (t.alive) heal(b, t, t, halfRec, { raw: 1 }); });
  }
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

  // Thorns & Reflection (Sir Dane, Juniper, Gilthrax Arcane Reflect, Dwarven Plate)
  if (src && src.alive && t.alive && src.side !== t.side && !o.dot && !o.thorn && pre > 0) {
    if (t.it && t.it.meleeReflect && hd(src, t) <= 2) {
      const refD = Math.max(1, Math.round(pre * t.it.meleeReflect));
      later(b, 0, () => { if (src.alive && t.alive) hit(b, t, src, refD, { kind: 'phys', ty: 'bludgeoning', noBonus: 1, thorn: 1 }); });
    }
    if (t.sacredShieldT > 0) {
      later(b, 0, () => { if (src.alive && t.alive) hit(b, t, src, (4 + Math.max(0, t.m.cha)) * t.dm, { kind: 'holy', ty: 'radiant', noBonus: 1, thorn: 1 }); });
    }
    // Sir Dane Path 1 Oath of Devotion: taking hits from his Taunted foe retaliates with a Smite!
    if (t.f.oathDevotion && src.st.tauntBy === t) {
      later(b, 0, () => { if (src.alive && t.alive) triggerSmite(b, t, src, roll(1, 8), { thorn: 1 }); });
    }
    if (t.vineThornsT > 0 && hd(src, t) <= 1) {
      later(b, 0, () => { if (src.alive && t.alive) hit(b, t, src, 5 * t.dm, { kind: 'magic', ty: 'poison', noBonus: 1, thorn: 1 }); });
    }
    if (t.arcaneReflectT > 0) {
      const refDmg = Math.max(2, Math.round(pre * .85));
      const targets = (t.f.gildedHoard && t.tier >= 4) ? foes(b, t).filter(x => hd(x, t) <= 1) : [src];
      later(b, 0, () => { targets.forEach(x => { if (x.alive && t.alive) hit(b, t, x, refDmg, { kind: 'magic', ty: 'force', noBonus: 1, thorn: 1 }); }); });
      if (t.f.bodyguardFee && b.time >= (t._bgT || 0)) {
        t._bgT = b.time + .6;
        friends(b, t).filter(a => a !== t && !a.minion && hd(a, t) <= 1).forEach(a => giveCharge(b, a, 8, 1));
        if (Math.random() < .32) gainGold(b, t, 1, 'BODYGUARD FEE');
      }
    }
  }

  // Juniper innate Charge gain when Rooted foes take damage (folded naturally into kit)
  if (pre > 0 && t.side === 'E' && t.st.root > 0) {
    alive(b, 'P').filter(x => x.f.naturalRecovery && b.time >= (x._nrT || 0)).forEach(x => {
      x._nrT = b.time + .4;
      giveCharge(b, x, 10 * (x.chgX || 1), 1);
    });
  }

  // Mother Laurel Path 2 Bountiful Vines: Rooted foes take +1d6 Holy Smite on every direct hit
  if (pre > 0 && src && src.side === 'P' && t.side === 'E' && t.alive && t.st.root > 0 && !o.dot && !o.onhit && !o.vineProc && alive(b, 'P').some(x => x.f.bountifulVines)) {
    later(b, 0, () => { if (t.alive && src.alive) triggerSmite(b, src, t, roll(1, 6), { onhit: 1 }); });
  }
  // Lumen Path 2 Purifying Light: any ally Holy hit also applies Burn
  if (pre > 0 && o.kind === 'holy' && src && src.side === 'P' && t.side === 'E' && t.alive && !o.dot && alive(b, 'P').some(x => x.f.purifyingLight)) {
    applyStatus(b, src, t, 'burn', 4);
  }
  // Kaska Path 2 Pack Hunt: allies hitting Exposed foes heal 10 HP + 10 Charge (1s CD)
  if (pre > 0 && src && src.side === 'P' && t.side === 'E' && t.st.exp > 0 && !o.dot && !o.onhit && alive(b, 'P').some(x => x.f.packHunt)) {
    if (b.time >= (src._phT || 0)) {
      src._phT = b.time + 1.0;
      heal(b, src, src, 10 * src.dm, { raw: 1 });
      giveCharge(b, src, 10, 1);
    }
  }
  // Corvin Tier IV First Strike: allies hitting any Hunter's Mark foe deal +1d4 piercing
  if (pre > 0 && src && src.side === 'P' && t.side === 'E' && t.alive && t.st.mark && !o.dot && !o.onhit && !o.fsProc && alive(b, 'P').some(x => x.f.firstStrike && x.tier >= 4)) {
    later(b, 0, () => { if (t.alive) hit(b, src, t, roll(1, 4), { kind: 'phys', ty: 'piercing', noBonus: 1, fsProc: 1, onhit: 1 }); });
  }

  // Nettle Hex
  if (pre > 0 && src && src.side === 'P' && t.side === 'E' && t.alive && t.st.hex && !o.dot && !o.hexProc) {
    const hexer = t.st.hex;
    const stacks = t.st.hexStacks || 1;
    const dieS = hexer.tier >= 2 ? 6 : 4;
    const bonus = roll(stacks, dieS) * chaK(hexer);
    later(b, 0, () => { if (t.alive) hit(b, hexer, t, bonus, { kind: 'magic', ty: 'necrotic', noBonus: 1, hexProc: 1 }); });
  }
  if (pre > 0 && o.dot && t.side === 'E' && t.alive && t.st.hex && t.st.hex.f.finePrint) {
    const hexer = t.st.hex;
    if (b.time >= (t._fpT || 0)) {
      t._fpT = b.time + .45;
      later(b, 0, () => { if (t.alive) hit(b, hexer, t, roll(1, 6), { kind: 'magic', ty: 'fire', noBonus: 1, hexProc: 1 }); });
    }
  }
  // Sir Dane Nat 20 Crusade Aura: allies attacking his Taunted foe trigger a bonus 1d8 Smite + 10 Charge!
  if (pre > 0 && src && src.side === 'P' && t.side === 'E' && t.st.duelCrusade > 0 && !o.dot && !o.crusadeProc && !o.onhit) {
    giveCharge(b, src, 10, 1);
    later(b, 0, () => { if (t.alive && src.alive) triggerSmite(b, src, t, roll(1, 8), { onhit: 1 }); });
  }

  if (pre > 0 || o.nec) {
    b.events.push({ k: 'dmg', id: t.id, v: pre, w: 0, sid: src ? src.id : undefined, ty: o.ty || 'force', near: src && hd(src, t) <= 1 && !o.area, src: src ? src.side : '', dot: o.dot, blk: o.kind !== 'holy' && !o.dot && raw > 4 && pre < raw * .55 });
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
    s.burn += dealt * .45;
    s.burnT = s.burnT || .5;
    if (src && src.key === 'cinder') src.stats.burnCredit = (src.stats.burnCredit || 0) + 1;
  } else if (el === 'cold') {
    s.frz += dealt * 2.0;
    if (s.frz >= 100) { s.frz = 0; stun(b, t, 1.2); status(b, t, 'FROZEN', '#8fd0ff'); }
  } else if (el === 'poison') {
    s.poison += Math.max(1, dealt * .15);
    if (src && src.key === 'juniper') triggerCircleLand(b, src);
    if (src && src.f && src.f.nightshade) expose(b, t, 3.5 * chaK(src));
  } else if (el === 'acid') {
    s.acid = Math.min(6, s.acid + 1); s.acidT = 5;
  }
}

function applyStatus(b, src, t, el, v, max) {
  if (!t || !t.alive) return;
  const s = t.st;
  const k = src ? src.dm : 1;
  if (el === 'burn') {
    s.burn += v * k;
    s.burnT = s.burnT || .5;
    if (src && src.key === 'cinder') src.stats.burnCredit = (src.stats.burnCredit || 0) + 1;
  } else if (el === 'cold') {
    s.frz += v;
    if (s.frz >= 100) { s.frz = 0; stun(b, t, 1.2); status(b, t, 'FROZEN', '#8fd0ff'); }
  } else if (el === 'poison') {
    s.poison += v * k;
    if (src && src.key === 'juniper') triggerCircleLand(b, src);
    if (src && src.f && src.f.nightshade) expose(b, t, 3.5 * chaK(src));
  } else if (el === 'nec') {
    addNec(b, src, t, v);
  }
}

function addNec(b, src, t, amt) {
  if (!t || !t.alive) return;
  let v = amt * (src ? src.dm : 1);
  if (t.boss) v /= 2;
  if (t.ward > 0) { const a = Math.min(t.ward, v); t.ward -= a; v -= a; if (a >= 1) b.events.push({ k: 'ward', id: t.id, v: Math.round(a) }); }
  if (v <= 0) return;
  t.nec = Math.min(t.maxHp, t.nec + v);
  if (src) src.stats.nec += v;
  status(b, t, 'NECROSIS +' + Math.round(v), '#9be38a');
  if (t.st.hex && t.st.hex.f.finePrint && b.time >= (t._fpT || 0)) {
    t._fpT = b.time + .45;
    later(b, 0, () => { if (t.alive) hit(b, t.st.hex, t, roll(1, 6), { kind: 'magic', ty: 'fire', noBonus: 1, hexProc: 1 }); });
  }
}

function kill(b, t, src, o) {
  // Pillar Zealot Rage: cannot die while Zealot Rage is active
  if (t.zealotT > 0 && t.side === 'P') {
    t.hp = Math.max(1, Math.round(t.nec) + 1);
    return;
  }
  // Zark Relentless Endurance: survive lethal at 1 HP once per fight
  if (t.f.relentlessEndurance && !t._relentlessUsed && t.side === 'P') {
    t._relentlessUsed = 1;
    t.hp = Math.max(1, Math.round(t.nec) + 1);
    callout(b, t, 'RELENTLESS!', '#ff6a4a');
    return;
  }
  if (t.f.undying && !t._rose && o.kind !== 'holy' && t.nec <= 0 && Math.random() < t.f.undying) {
    t._rose = 1; t.hp = Math.round(t.maxHp * .3); status(b, t, 'GETS BACK UP', '#c8b48a'); return;
  }

  const wasTauntedBy = t.st.tauntBy;
  t.alive = false; t.hp = Math.max(0, t.hp);
  b.events.push({ k: 'die', id: t.id });
  b.units.forEach(x => { if (x.target === t) x.target = null; if (x.st.tauntBy === t) { x.st.taunt = 0; x.st.tauntBy = null; } });

  if (t.side === 'E') {
    const K = src && src.minion && src.owner ? src.owner : src;
    if (K && K.side === 'P' && K.stats) K.stats.kills = (K.stats.kills || 0) + 1;

    // Pillar Path 1 Unstoppable Faith: kills during Zealot Rage extend it by 1.5s
    if (K && K.alive && K.f.unstoppableFaith && K.zealotT > 0) {
      K.zealotT += 1.5;
      status(b, K, 'ZEALOT +1.5s', '#ffe9a0');
    }

    // Arthur Path 1 Constant Vigilance: kills refresh Alert
    if (K && K.alive && K.f.vigilance) grantAlert(b, K, K.tier >= 4 ? 2 : 1);

    // Wallaby Path 1 Slippery: kills refund 50% (100% T4) Charge and +2 next d20
    if (K && K.alive && K.f.slippery) {
      giveCharge(b, K, K.tier >= 4 ? 100 : 50);
      K.nextBonus += 2;
    }

    // Gains Gilded death: pop +1 Gold (which triggers Arcane Recovery!), or trigger Arcane Recovery directly if Gold capped
    if (t.st.gilded) {
      const gainer = t.st.gilded;
      if (gainer.stats) gainer.stats.gildedKills = (gainer.stats.gildedKills || 0) + 1;
      const gotG = gainGold(b, gainer, 1, 'GILDED');
      if (!gotG && gainer.alive && gainer.f.transmuter) triggerArcaneRecovery(b, gainer, 16, 'GILDED KILL');
      if (gainer.f.liquidAssets && gainer.tier >= 4 && K && K.alive && K.side === 'P') giveCharge(b, K, 30);
    }

    // Velith Tier IV Nightshade Vials: Poisoned enemy death spreads Poison to adjacent enemy
    if (t.st.poison > 0 && alive(b, 'P').some(x => x.f.nightshade && x.tier >= 4)) {
      const nx = alive(b, 'E').sort((a, c) => hd(a, t) - hd(c, t))[0];
      if (nx && hd(nx, t) <= 2) { nx.st.poison += t.st.poison; status(b, nx, 'VENOM SPREADS', '#9be38a'); }
    }

    // Sir Dane Tier IV Oath of Devotion: when his Taunted foe dies, auto-Taunt & Smite nearest enemy
    if (wasTauntedBy && wasTauntedBy.alive && wasTauntedBy.f.oathDevotion && wasTauntedBy.tier >= 4) {
      const nx = foes(b, wasTauntedBy).sort((a, c) => hd(a, wasTauntedBy) - hd(c, wasTauntedBy))[0];
      if (nx) {
        nx.st.taunt = Math.max(nx.st.taunt, 3 * chaK(wasTauntedBy));
        nx.st.tauntBy = wasTauntedBy;
        nx.target = wasTauntedBy;
        triggerSmite(b, wasTauntedBy, nx, roll(1, 8), { label: 'OATH SMITE' });
      }
    }

    // Hunter's Mark death triggers: Lorcan quest & T4 Volley of Trophies haste
    if (t.st.mark) {
      const lorcan = alive(b, 'P').find(x => x.key === 'lorcan');
      if (lorcan) {
        lorcan.stats.markedKills = (lorcan.stats.markedKills || 0) + 1;
        if (lorcan.f.trophyVolley && lorcan.tier >= 4) {
          alive(b, 'P').forEach(a => { a.tempHaste = Math.max(a.tempHaste || 0, 25); a.tempHasteT = Math.max(a.tempHasteT || 0, 4); });
        }
      }
    }

    // Lorcan Favoured Enemy trophy tracking
    if ((t.elite || t.boss) && alive(b, 'P').some(x => x.key === 'lorcan' && x.questDone)) {
      b.trophiesEarned = b.trophiesEarned || [];
      archOf(t.key).forEach(a => { if (!b.trophiesEarned.includes(a)) b.trophiesEarned.push(a); });
    }

    // Nettle Pact Boon (Dark One's Blessing) on Hexed death!
    if (t.st.hex) {
      triggerPactBoon(b, t.st.hex, t, K);
    }

    // Cinder T4 Wildfire: Burn spreads on enemy death
    if (t.st.burn >= 1 && alive(b, 'P').some(x => x.f.wildfire && x.tier >= 4)) {
      const n = alive(b, 'E').sort((a, c) => hd(a, t) - hd(c, t))[0];
      if (n && hd(n, t) <= 3) { n.st.burn += t.st.burn * .8; n.st.burnT = n.st.burnT || .5; status(b, n, 'WILDFIRE SPREADS', '#ff9c4a'); }
    }

    // Berserker Axe: killing a foe grants +1 Rage
    if (K && K.alive && K.side === 'P' && K.it && K.it.killRage) {
      addBearRage(b, K, 1);
    }

    // Damage hero takedown charge
    if (K && K.alive && K.side === 'P' && K.role === 'Damage') {
      giveCharge(b, K, 25, 1);
      friends(b, K).filter(a => a !== K && !a.minion && hd(a, K) <= 3).forEach(a => giveCharge(b, a, 10, 1));
      K.stats.takedowns = (K.stats.takedowns || 0) + 1;
    }
  }

  if (t.f.deathPuff) {
    const ps = alive(b, t.side === 'P' ? 'E' : 'P').filter(x => hd(x, t) <= 1);
    b.events.push({ k: 'area', id: t.id, shape: 'nova', r: 1, ty: 'poison', ids: ps.map(x => x.id) });
    ps.forEach(x => { x.st.poison += t.f.deathPuff * t.dm; status(b, x, 'CHOKING ASH', '#9be38a'); });
  }
}

function triggerSunlitCenser(b, holder) {
  if (!holder || !holder.alive || !holder.it || !holder.it.healHolyPulse) return;
  if (b.time < (holder._censerT || 0)) return;
  holder._censerT = b.time + .6;
  const near = foes(b, holder).sort((a, c) => hd(a, holder) - hd(c, holder))[0];
  if (near) later(b, 0, () => { if (holder.alive && near.alive) hit(b, holder, near, roll(1, 6), { kind: 'holy', ty: 'radiant', noBonus: 1, onhit: 1 }); });
}

function heal(b, src, t, amt, o = {}) {
  if (!t || !t.alive) return 0;
  let v = amt;
  if (src && !o.raw) {
    if (src.bon) v += src.bon.k;
    v *= src.dm;
  }
  v = Math.round(v);
  const room = Math.max(0, t.maxHp - t.hp);
  const got = Math.min(room, v);
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
  if (got > 0) {
    b.events.push({ k: 'heal', id: t.id, v: got, sid: src ? src.id : undefined });
    triggerSunlitCenser(b, src);
    // Moon Sickle: healing an ally grants +25% Attack Speed & +2 Damage for 4s
    if (src && src.alive && src.it && src.it.moonSickle) {
      src.tempHaste = Math.max(src.tempHaste || 0, 25);
      src.tempHasteT = Math.max(src.tempHasteT || 0, 4);
      src.moonDmgT = Math.max(src.moonDmgT || 0, 4);
    }
  }
  return got;
}

function addWard(b, t, v, cap, giver) {
  if (!t || !t.alive) return;
  v = Math.round(v);
  if (cap) v = Math.min(v, Math.max(0, cap - t.ward));
  if (v <= 0) return;
  t.ward += v;
  t.stats.wardIn = (t.stats.wardIn || 0) + v;
  if (giver) {
    t._wardBy = giver;
    if (giver.stats) giver.stats.ward = (giver.stats.ward || 0) + v;
    triggerSunlitCenser(b, giver);
  }
  b.events.push({ k: 'ward', id: t.id, v });
}

function giveCharge(b, u, v, quiet) {
  if (!u || !u.abil || !u.alive || !(v > 0)) return;
  u.charge = Math.min(100, u.charge + v);
  if (!quiet && v >= 15) status(b, u, '+' + Math.round(v) + ' CHARGE', '#ffd76a');
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

/* ---------- Ability d20 Roll (WIS Floor, Advantage, Inspiration Dice, Bond Die, Clockwork, Luckstone) ---------- */
function rollNaturalD20(b, u) {
  const floor = Math.min(12, (u.d20Floor || 1) + (u.auraFloor || 0) + (u.bonded && u.bonded.f && u.bonded.f.goodVibes ? 1 : 0));
  let r1 = d20();
  if (u.advantage > 0) {
    u.advantage = 0;
    const r2 = d20();
    r1 = Math.max(r1, r2);
    status(b, u, `ADV (${r1})`, '#ffd76a');
  }
  if (r1 === 1 && u.f.lucky) { r1 = d20(); status(b, u, 'LUCKY', '#9fd86a'); }
  return Math.max(floor, r1);
}

function castAbility(b, u) {
  const A = u.abil;
  u._lastCastT = b.time;
  u._casts = (u._casts || 0) + 1;

  // Clockwork Amulet: once per fight guarantees a High roll instead of rolling d20
  let nat, P, bonus = u.rollBonus + u.nextBonus - (u.st.hexSlow > 0 ? 3 : 0);
  if (u.hidden && u.f.deathsLedger) bonus += 2;
  u.nextBonus = 0;

  let usedInsp = null;
  let usedMote = null;
  if (u.inspMote) {
    usedMote = u.inspMote;
    u.inspMote = null;
  }
  if (u.it && u.it.clockworkHigh && !u._clockworkUsed) {
    u._clockworkUsed = 1;
    nat = Math.max(15, u.bands.hi);
    P = 2;
    status(b, u, 'CLOCKWORK HIGH', '#ffd76a');
  } else {
    nat = rollNaturalD20(b, u);
    if (u.it && u.it.clockworkFloor && !u._clockworkUsed) {
      u._clockworkUsed = 1;
      if (nat < 10) { nat = 10; status(b, u, 'CLOCKWORK 10', '#ffd76a'); }
    }
    // Brother Jamison Emboldening Bond bonus die (d4 or d6)
    if (u.bondDie > 0) {
      const bRoll = roll(1, u.bondDie);
      bonus += bRoll;
      status(b, u, `BOND +${bRoll}`, '#ffe9a0');
    }
    // Spend Bardic Inspiration die (adds d6/d8/d10 + CHA bonus to d20 roll!)
    let nat20Threshold = 20;
    if (u.inspDie) {
      usedInsp = u.inspDie;
      u.inspDie = null;
      const inspRoll = roll(1, usedInsp.sides) + (usedInsp.chaBonus || 0);
      bonus += inspRoll;
      if (usedInsp.expandCrit) nat20Threshold = 19; // Instrument of the Bards!
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
      if (P === 0 && u.it && u.it.rerollLowOnce && !u._luckUsed) {
        u._luckUsed = 1;
        const n2 = rollNaturalD20(b, u);
        if (n2 >= nat20Threshold) { nat = n2; P = 3; }
        else { const v2 = Math.min(19, n2 + bonus); const p2 = v2 >= u.bands.hi ? 2 : v2 <= u.bands.low ? 0 : 1; if (p2 > P) { nat = n2; P = p2; } }
        status(b, u, 'LUCKSTONE', '#9fd86a');
      }
    }
  }

  u.charge = 0;
  u.stats.rolls[P + 1]++;
  b.events.push({ k: 'roll', id: u.id, nat, band: Math.min(P, 2), name: A.n + (P === 3 ? '' : ' · ' + BAND_N[P]), side: u.side, bonus });

  // Unified Bardic Inspiration Spend (Lore Die OR Creation Mote!)
  const spentInspiration = !!(usedInsp || usedMote);
  if (usedMote && usedMote.giver && usedMote.giver.alive) {
    gainGold(b, usedMote.giver, 1, 'MOTE SPENT');
  }
  if (spentInspiration) {
    emitClassKw(b, u, 'bardic_inspiration', { action: 'spend', band: P });
    if (P === 3) {
      alive(b, 'P').filter(x => x.f.passRound).forEach(r => giveCharge(b, r, 50));
    }
    if (usedInsp) passInspDie(b, u, usedInsp);
  }

  u._casting = 1;
  const tgt = u.target;
  try { A.fx(b, u, P); } finally { u._casting = 0; }

  // Brother Jamison Bond triggers (Nat 20 Charge share & Path 2 Peace & Radiance)
  if (u.side === 'P' && u.bonded) {
    if (u.bondChargeShare && P >= 2) {
      friends(b, u).filter(a => a !== u && !a.minion && a.bonded).forEach(a => giveCharge(b, a, 18, 1));
    }
    const jm = u.bonded;
    if (jm.alive && jm.f.peaceRadiance) {
      foes(b, jm).filter(x => hd(x, jm) <= 2).forEach(x => hit(b, jm, x, roll(1, 8), { kind: 'holy', ty: 'radiant', noBonus: 1, area: 1 }));
      if (jm.tier >= 4) {
        const low = friends(b, jm).filter(a => !a.minion && a.bonded).sort((a, c) => hpPct(a) - hpPct(c))[0];
        if (low) heal(b, jm, low, 12 * jm.dm, { raw: 1 });
      }
    }
  }
  // Toot Path 2 Street Performer: ally High/Nat 20 drops +1 Gold (+2 if spending Bardic Inspiration!)
  if (u.side === 'P' && P >= 2) {
    alive(b, 'P').filter(x => x.f.streetPerformer).forEach(toot => gainGold(b, toot, spentInspiration ? 2 : 1, 'STREET PERFORMER'));
  }

  // Item on-cast & Class Keyword hooks
  const I = u.it || {};
  if (I.quickenFirst && u._casts === 1) {
    u.stats.metamagics = (u.stats.metamagics || 0) + 1;
    emitClassKw(b, u, 'metamagic', { kind: 'quicken' });
  }
  if (I.firstCastRec && u._casts === 1) {
    later(b, .04, () => { if (u.alive) triggerArcaneRecovery(b, u, I.firstCastRec, 'PEARL'); });
  }
  if (I.metaFireball && u._casts % 2 === 0) {
    later(b, .08, () => fireWandFireball(b, u));
  }
  if (I.wardOnCast) addWard(b, u, I.wardOnCast * u.dm, u.maxHp * .5, u);
  if (P === 3 && I.nat20Refund) later(b, .05, () => { if (u.alive) giveCharge(b, u, I.nat20Refund); });
  if (P >= 2 && I.highMarks && tgt && tgt.alive && tgt.side !== u.side) markFoe(b, u, tgt);
  if (P >= 2 && I.starBolt) {
    const lowFoe = foes(b, u).filter(x => !x.hidden).sort((a, c) => a.hp - c.hp)[0];
    if (lowFoe) {
      b.events.push({ k: 'beam', id: u.id, tid: lowFoe.id, ty: 'radiant' });
      hit(b, u, lowFoe, roll(2, 6), { kind: 'holy', ty: 'radiant', noBonus: 1 });
    }
  }
  if (P >= 2 && I.highPulseHeal) {
    friends(b, u).filter(a => hd(a, u) <= 2).forEach(a => heal(b, u, a, 8 * u.dm, { raw: 1 }));
  }
  if (P >= 2 && I.highBurnBurst) {
    foes(b, u).filter(x => hd(x, u) <= 2).forEach(x => applyStatus(b, u, x, 'burn', 6));
  }
  if (P >= 2 && I.highSorcery && u.kw && u.kw.sorcery_points) {
    addSorcery(b, u, 1, null, null);
  }
  if (P >= 2 && I.highKi && u.kw && u.kw.ki) {
    u.ki = Math.min(KI_MAX, (u.ki || 0) + 1);
  }
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
  const rageHaste = (u.bearRage || 0) * 10;
  const h = u.haste + (u.auraHaste || 0) + (u.tempHasteT > 0 ? u.tempHaste : 0) + rageHaste;
  const slow = (u.st.stag > 0 ? 1.3 : 1) * (u.st.hexSlow > 0 ? 1.25 : 1) * (u.st.chillT > 0 ? 1.15 : 1);
  return u.iv / Math.max(.4, 1 + h / 100) * (1 + Math.min(50, u.st.frz / 2) / 100) * slow / (1 + .2 * otLevel(b));
}
const moveTime = (b, u) => .42 * COMBAT_TEMPO * 30 / u.ft * (u.st.stag > 0 ? 1.3 : 1) / (1 + .2 * otLevel(b));

function doAttack(b, u) {
  if (u.st.fear > 0) return false;
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
  const got = hit(b, u, t, roll(a.d[0], a.d[1]) + (a.flat || 0), { kind: a.kind, el: a.el, ty: a.ty, melee: u.rng <= 2, nec: a.nec || 0, mul: (a.mul || 1) * (m || 1), strike: 1 });
  if (t.alive || got > 0) {
    onHit(b, u, t, got);
    // Sir Dane Path 2 Call to Arms: allies inside Dane's Aura trigger on-hit twice on 1st hit (and every 3rd at T4)!
    if (u.side === 'P' && t.side === 'E' && t.alive && u.auraDane && u.auraDane.f.callToArms && u.auraDane !== u) {
      const dane = u.auraDane;
      const isDaneTarget = (t.st.tauntBy === dane || dane.target === t);
      if (isDaneTarget) {
        u._ctaHits = u._ctaHits || {};
        const n = (u._ctaHits[t.id] = (u._ctaHits[t.id] || 0) + 1);
        if (n === 1 || (dane.tier >= 4 && n % 3 === 0)) {
          onHit(b, u, t, got);
        }
      }
    }
  }
  postStrikeHooks(b, u, t, got);
  return got;
}

function onHit(b, u, t, got) {
  for (const e of u.onHit || []) {
    if (!t.alive) break;
    const amt = () => e.d ? roll(e.d[0], e.d[1]) : (e.flat || 0);
    const o = { kind: e.kind || 'magic', el: e.el || null, ty: e.el || e.ty || (e.kind === 'holy' ? 'radiant' : 'force'), noBonus: 1, onhit: 1 };
    if (e.t === 'bonus') hit(b, u, t, amt(), o);
    else if (e.t === 'echo') later(b, e.delay || .25, () => { if (t.alive) hit(b, u, t, amt(), o); });
    else if (e.t === 'status') applyStatus(b, u, t, e.el, e.v || 1, e.max);
  }
  // Bracers of Archery: attacks vs Hunter's Mark apply Poison
  if (u.it && u.it.markPoison && t.alive && t.st.mark) applyStatus(b, u, t, 'poison', 1.5);
  // Staff of Withering: attacks vs Hex apply Necrosis
  if (u.it && u.it.hexNecrosis && t.alive && t.st.hex) addNec(b, u, t, u.it.hexNecrosis);
  // Frost Brand: attacks Chill targets (-15% Attack Speed for 2s)
  if (u.it && u.it.chillOnHit && t.alive) t.st.chillT = Math.max(t.st.chillT || 0, 2);
  // Flame Tongue: every 2nd strike applies Burn
  if (u.it && u.it.flameEvery2 && t.alive) {
    u._ftCnt = (u._ftCnt || 0) + 1;
    if (u._ftCnt % 2 === 0) {
      applyStatus(b, u, t, 'burn', 5);
      if (u.it.flameSpread) {
        const adj = foes(b, u).find(x => x !== t && hd(x, t) <= 1);
        if (adj) applyStatus(b, u, adj, 'burn', 4);
      }
    }
  }
  // Oathbow: +8 Charge vs Hunter's Mark foes
  if (u.it && u.it.markCharge && t.st.mark) giveCharge(b, u, u.it.markCharge, 1);
  // Bram Path 2 Divine Strike: Bram & adjacent allies add 1d4 (1d8 T4) Holy to melee attacks
  if (u.side === 'P' && u.rng <= 2 && t.alive) {
    const bram = alive(b, 'P').find(x => x.f.divineStrike && hd(x, u) <= 1);
    if (bram) hit(b, u, t, roll(1, bram.tier >= 4 ? 8 : 4), { kind: 'holy', ty: 'radiant', noBonus: 1, onhit: 1 });
  }
  // Pillar Path 2 Living Beacon: empowered next strike triggers a +1d6 Holy Smite!
  if (u._beaconHoly && t.alive) {
    u._beaconHoly = 0;
    triggerSmite(b, u, t, roll(1, 6), { onhit: 1 });
  }
  // Pillar Path 1 Unstoppable Faith: +1d8 Holy during Zealot Rage
  if (u.f.unstoppableFaith && u.zealotT > 0 && t.alive) {
    hit(b, u, t, roll(1, 8), { kind: 'holy', ty: 'radiant', noBonus: 1, onhit: 1 });
  }
  // Zoe Path 1 Rune Carver (+3 force per party item) & Path 2 Just the Thing (+1d4 force for 2+ item allies)
  if (u.f.runeCarver && t.alive) {
    const totalItems = alive(b, 'P').reduce((sum, a) => sum + ((a.items && a.items.length) || 0), 0);
    if (totalItems > 0) hit(b, u, t, 3 * totalItems, { kind: 'magic', ty: 'force', noBonus: 1, onhit: 1 });
  }
  if (u.side === 'P' && (u.items || []).length >= 2 && t.alive && alive(b, 'P').some(x => x.f.justTheThing)) {
    hit(b, u, t, roll(1, 4), { kind: 'magic', ty: 'force', noBonus: 1, onhit: 1 });
  }
}

function postStrikeHooks(b, u, t, got) {
  if (!t) return;
  const K = u.kw || {};
  // Pack 6 Item: Cloak of Elvenkind opening attack from Stealth applies Exposed + triggers 1d6 Sneak Attack!
  if (u._stealthExposeReady && t.alive) {
    u._stealthExposeReady = 0;
    expose(b, t, 4);
    if (u.it && u.it.cloakSneak) triggerSneakAttack(b, u, t, {});
  }
  // Velith Assassinate: strikes from Stealth apply bonus Poison
  if (u.hidden && u.f.assassinate && t.alive) {
    applyStatus(b, u, t, 'poison', 3);
  }
  // Amulet of the Devout: every 5s next attack triggers a 2d6 Holy Smite!
  if (u.it && u.it.devoutSmite && t.alive && b.time >= (u._devoutT || 0)) {
    u._devoutT = b.time + u.it.devoutSmite;
    triggerSmite(b, u, t, roll(2, 6), { label: 'DEVOUT SMITE', onhit: 1 });
  }
  // Sir Dane / Mother Laurel Smite: every 3rd strike empowers with Divine Smite / Verdant Smite!
  if (u.f.smitePeriodic && t.alive) {
    u._smCnt = (u._smCnt || 0) + 1;
    if (u._smCnt % 3 === 0) {
      if (u.f.verdantSmite) {
        triggerSmite(b, u, t, roll(1, 6), { label: 'VERDANT SMITE', onhit: 1 });
        if (t.alive) applyRoot(b, u, t, 1.5 * chaK(u));
      } else {
        triggerSmite(b, u, t, roll(1, 8), { label: 'DIVINE SMITE', onhit: 1 });
      }
    }
  }
  // Lumen Tier IV Judgement: Radiant Soul attacks splash 50% Holy to an adjacent foe
  if (u.radiantSoulT > 0 && u.f.judgement && u.tier >= 4 && got > 0) {
    const adj = foes(b, u).find(x => x !== t && hd(x, t) <= 1);
    if (adj) hit(b, u, adj, Math.max(1, Math.round(got * .5)), { kind: 'holy', ty: 'radiant', noBonus: 1, onhit: 1 });
  }
  // Toot Tip Jar: every 3rd attack pops +1 Gold
  if (u.f.tipJar) {
    u._tipCnt = (u._tipCnt || 0) + 1;
    if (u._tipCnt % 3 === 0) gainGold(b, u, 1, 'TIP JAR');
  }
  // Corvin Path 1 Stalker's Flurry: every 3rd basic strike spawns a shadow slash (+1d6 piercing)
  if (u.f.stalkerFlurry && t.alive) {
    u._sfCnt = (u._sfCnt || 0) + 1;
    if (u._sfCnt % 3 === 0) hit(b, u, t, roll(1, 6), { kind: 'phys', ty: 'piercing', noBonus: 1, onhit: 1 });
  }
  // Kaska Path 1 Lunar Resilience: Wild Shape (Panther) cleaves 50% to an adjacent foe
  if (u.f.lunarResilience && u.beast && u.beast.hp > 0 && got > 0) {
    const adj = foes(b, u).find(x => x !== t && hd(x, u) <= 1);
    if (adj) hit(b, u, adj, Math.max(1, Math.round(got * .5)), { kind: 'phys', ty: 'slashing', noBonus: 1, onhit: 1 });
  }
  // Lorcan / Corvin Hunter's Mark: bonus WIS-scaled damage vs Marked + Colossus Slayer
  if (K.hunters_mark && t.alive && t.st.mark) {
    hit(b, u, t, roll(1, 6) + Math.max(0, u.m.wis), { kind: 'phys', ty: 'piercing', noBonus: 1, onhit: 1 });
    if (u.f.colossusSlayer) {
      u._colCnt = (u._colCnt || 0) + 1;
      if (u._colCnt % (u.tier >= 4 ? 2 : 3) === 0) {
        hit(b, u, t, roll(2, 8), { kind: 'phys', ty: 'piercing', noBonus: 1, onhit: 1 });
        u.nextBonus += 1;
        status(b, t, 'COLOSSUS SLAYER', '#9fd86a');
      }
    }
  }
  // Wallaby / Velith Sneak Attack: +1d6 when ally adjacent, in Stealth, or target impaired/Poisoned
  if (K.sneak_attack && t.alive && b.time >= (u._snT || 0)) {
    const ok = u.hidden || t.st.mark || t.st.hex || t.st.poison > 0 || t.st.stag > 0 || t.st.stun > 0 || t.st.exp > 0 || alive(b, u.side).some(a => a !== u && hd(a, t) <= 1);
    if (ok) {
      u._snT = b.time + 1;
      triggerSneakAttack(b, u, t, {});
    }
  }
  // Rosalind Vicious Mockery: slight enemy damage debuff
  if (u.key === 'rosalind' && t.alive) { t.st.mockT = Math.max(t.st.mockT || 0, 2.2 * chaK(u)); }
  // Ki bar (Naill & Dragonhide Belt): 4-pip bar -> Ki Ability!
  if (K.ki && t.alive) {
    u.ki = Math.min(KI_MAX, (u.ki || 0) + 1);
    if (u.ki >= kiCost(u)) {
      if (u.f.monkNaill) fireNaillKiStrike(b, u, t);
      else fireGenericKiAbility(b, u, t);
    }
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
  // Start-of-combat hero keywords, passives, Pack Items & quest rewards
  P.forEach(u => {
    if (u.f.startAlert) {
      grantAlert(b, u, u.f.vigilance && u.tier >= 4 ? 2 : 1);
      u.charge = Math.max(u.charge, 25);
    }
    if (u.f.initSplash && u.tier >= 4) P.forEach(a => grantAlert(b, a, 1));
    if (u.f.socialite && adjAllies(b, u) > 0) u.charge = Math.max(u.charge, 30);
    if (u.key === 'bram' && u.questDone) {
      P.filter(a => a !== u && hd(a, u) <= 1).forEach(a => addWard(b, a, Math.round(a.maxHp * .15), a.maxHp * .5, u));
    }
    if (u.key === 'faelan' && u.questDone) {
      const far = P.filter(a => a !== u).sort((a, c) => hd(c, u) - hd(a, u))[0] || u;
      addWard(b, far, Math.round(22 * u.dm), far.maxHp * .5, u);
      status(b, far, 'OWL WARD', '#8fb4e6');
    }
    if (u.key === 'juniper' && u.questDone) b.goodberries += 4;
    if (u.key === 'dane' && u.questDone) {
      const fs = alive(b, 'E').sort((a, c) => hd(a, u) - hd(c, u));
      if (fs.length) {
        fs.slice(0, 3).forEach(e => { push(b, u, e, 2, { stun: .8 }); triggerSmite(b, u, e, roll(1, 8), { label: 'CHARGE SMITE' }); });
        callout(b, u, 'CAVALRY CHARGE!', '#ffe9a0');
      }
    }
    // Item & Pack 4-6 Start-of-combat Class Keyword hooks
    if (u.it && u.it.startSorcery) {
      u.sorcery = Math.min(4, (u.sorcery || 0) + u.it.startSorcery);
    }
    if (u.it && u.it.startCharge) {
      u.charge = Math.min(100, Math.max(u.charge || 0, u.it.startCharge));
    }
    if (u.it && u.it.startStealth) {
      triggerCunningAction(b, u, null, { stealth: u.it.startStealth, label: 'CLOAK' });
      if (u.it.stealthExpose) u._stealthExposeReady = 1;
    }
    if (u.it && u.it.displaceAlert) {
      grantAlert(b, u, 1);
      u._dispT = u.it.displaceAlert;
    }
    if (u.it && u.it.openingSurge) {
      later(b, .15, () => {
        if (!u.alive) return;
        const near = foes(b, u).filter(x => !x.hidden).sort((a, c) => hd(a, u) - hd(c, u))[0];
        triggerActionSurge(b, u, { target: near, label: 'WARNING SURGE!', force: 1 });
      });
    }
    if (u.it && u.it.startInsp) {
      const ally = P.filter(a => a !== u && !a.minion && a.abil).sort((a, c) => hd(a, u) - hd(c, u))[0] || u;
      grantInspDie(b, u, ally, 6, 0);
    }
    if (u.it && u.it.startHex) {
      const far = alive(b, 'E').sort((a, c) => hd(c, u) - hd(a, u))[0];
      if (far) applyNettleHex(b, u, far, false);
    }
    if (u.f.unstoppableFaith && u.tier >= 4) enterZealotRage(b, u, 1.5);
    if (u.f.streetPerformer && u.tier >= 4) {
      const bonusCh = Math.min(40, (u.goldHeld || 0) * 2);
      if (bonusCh > 0) P.forEach(a => { a.charge = Math.min(100, (a.charge || 0) + bonusCh); });
    }
    if (u.key === 'gilthrax' && u.questDone) {
      addWard(b, u, Math.round(40 * u.dm), u.maxHp * .9, u);
      status(b, u, 'GILDED WARD', '#ffd76a');
    }
    if (u.f.assassinate) {
      triggerCunningAction(b, u, null, { stealth: 3, label: 'AMBUSH' });
      if (u.f.deathsLedger) u.advantage = Math.max(u.advantage || 0, 1);
    }
    if (u.f.dreadAmbusher) {
      u.charge = Math.max(u.charge, 30);
      u.tempHaste = Math.max(u.tempHaste || 0, 25);
      u.tempHasteT = Math.max(u.tempHasteT || 0, 4);
    }
    if (u.key === 'saint' && u.questDone) {
      u.illusoryDouble = Math.max(u.illusoryDouble || 0, 1);
    }
    if (u.f.pantherForm) {
      const bhp = Math.round(u.maxHp * (u.f.lunarResilience ? .55 : .40) * (u.questDone ? 1.25 : 1));
      u.beast = { hp: bhp, max: bhp };
      triggerWildShape(b, u, { form: 'Panther Form', beastHp: bhp });
    }
  });

  // Enemy chargers schedule opening leap
  b.units.forEach(u => { if (u.side === 'E' && archOf(u.key).includes('charger')) u._chg = .6 + Math.random() * .6; });
  return b;
}

function applyAuras(b) {
  b.units.forEach(u => { u.auraHaste = 0; u.auraSR = 0; u.auraDmg = 0; u.auraAC = 0; u.auraCr = 0; u.auraFloor = 0; u.auraDane = null; });
  // Sentinel Shield: radiates an Aura (+1 AC, +1 SR) to adjacent allies (and widens existing Paladin Auras by +1 square!)
  alive(b, 'P').filter(x => x.it && x.it.sentinelAura).forEach(s => {
    friends(b, s).filter(a => !a.minion && hd(a, s) <= 1).forEach(a => {
      a.auraAC = Math.max(a.auraAC, 1);
      a.auraSR = Math.max(a.auraSR, 1);
    });
  });
  // Paladin Aura: Sir Dane Aura of Devotion (+1 AC, +1 SR, Charm/Frighten immunity within 2 squares; +1 mounted / +1 Sentinel Shield)
  alive(b, 'P').filter(x => x.f.auraDevotion).forEach(dane => {
    const rad = (dane.questDone ? 3 : 2) + (dane.it && dane.it.sentinelAura ? 1 : 0);
    friends(b, dane).filter(a => !a.minion && hd(a, dane) <= rad).forEach(a => {
      a.auraAC = Math.max(a.auraAC, 1);
      a.auraSR = Math.max(a.auraSR, 1);
      a.auraDane = dane;
    });
  });
  // Paladin Aura: Mother Laurel Aura of Warding (+2 SR baseline, +5 SR with Ancients' Ward, +1 d20 floor at T4)
  alive(b, 'P').filter(x => x.f.auraWarding || x.f.ancientsWard).forEach(ml => {
    const rad = 2 + (ml.it && ml.it.sentinelAura ? 1 : 0);
    const srBonus = (ml.f.auraWarding ? 2 : 0) + (ml.f.ancientsWard ? 3 : 0);
    friends(b, ml).filter(a => !a.minion && hd(a, ml) <= rad).forEach(a => {
      a.auraSR = Math.max(a.auraSR, srBonus);
      if (ml.f.ancientsWard && ml.tier >= 4) a.auraFloor = Math.max(a.auraFloor, 1);
    });
  });
  // Rosalind Path 2 Encore: adjacent Inspired ally (Lore Die OR Toot Mote!) gains +40% Charge speed
  alive(b, 'P').filter(x => x.f.encore).forEach(r => {
    const adj = friends(b, r).filter(a => a !== r && (a.inspDie || a.inspMote) && hd(a, r) <= 1);
    const list = r.tier >= 4 ? adj : adj.slice(0, 1);
    list.forEach(a => { a.auraCr = Math.max(a.auraCr, 40); });
  });
  // Zoe Path 2 Just the Thing: allies carrying 2+ items gain +20% Charge speed
  if (alive(b, 'P').some(x => x.f.justTheThing)) {
    alive(b, 'P').filter(a => (a.items || []).length >= 2).forEach(a => { a.auraCr = Math.max(a.auraCr, 20); });
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
    u.doubleRegenT = Math.max(0, (u.doubleRegenT || 0) - dt);
    u.moonDmgT = Math.max(0, (u.moonDmgT || 0) - dt);
    u.sacredShieldT = Math.max(0, (u.sacredShieldT || 0) - dt);
    u.vineThornsT = Math.max(0, (u.vineThornsT || 0) - dt);
    u.zealotT = Math.max(0, (u.zealotT || 0) - dt);
    u.radiantSoulT = Math.max(0, (u.radiantSoulT || 0) - dt);
    u.arcaneReflectT = Math.max(0, (u.arcaneReflectT || 0) - dt);
    u.wildShapeT = Math.max(0, (u.wildShapeT || 0) - dt);

    // Kaska Quest Moon's Favour: Wild Shape (Panther Form) radiates moonlight healing every 2.5s
    if (u.key === 'kaska' && u.questDone && u.beast && u.beast.hp > 0 && b.time >= (u._moonT || 2.5)) {
      u._moonT = b.time + 2.5;
      friends(b, u).filter(a => !a.minion && hd(a, u) <= 2).forEach(a => heal(b, u, a, 8 * u.dm, { raw: 1 }));
    }
    // Cloak of Displacement: refreshes Alert every 6s
    if (u.it && u.it.displaceAlert && b.time >= (u._dispT || u.it.displaceAlert)) {
      u._dispT = b.time + u.it.displaceAlert;
      grantAlert(b, u, 1);
    }
    // Staff of the Woodlands: while in Wild Shape (or after 1st cast), Roots nearby foe & heals adjacent allies +15 HP every 4s
    if (u.it && u.it.woodlandPulse && (u.wildShapeT > 0 || (u.beast && u.beast.hp > 0) || (u._casts || 0) >= 1) && b.time >= (u._woodT || u.it.woodlandPulse)) {
      u._woodT = b.time + u.it.woodlandPulse;
      const fs = foes(b, u).filter(x => !x.hidden).sort((a, c) => (a.st.root > 0 ? 1 : 0) - (c.st.root > 0 ? 1 : 0) || hd(a, u) - hd(c, u));
      if (fs[0]) applyRoot(b, u, fs[0], 2.5 * chaK(u));
      friends(b, u).filter(a => !a.minion && hd(a, u) <= 1).forEach(a => heal(b, u, a, 15 * u.dm, { raw: 1 }));
    }
    // Ring of Regeneration: cleanses 1 Burn or Poison stack every 2s
    if (u.it && u.it.cleanseEvery && b.time >= (u._clnT || u.it.cleanseEvery)) {
      u._clnT = b.time + u.it.cleanseEvery;
      if (s.poison > 0) s.poison = Math.max(0, s.poison - 1);
      else if (s.burn > 0) s.burn = Math.max(0, s.burn - 2);
    }

    if (tile(u) === '^' && !u.f.fireproof) { s.burn = Math.max(s.burn, 8); s.burnT = s.burnT || .5; }
    if (u.f.enrage && b.time >= (u._enr || (u._enr = u.f.enrage))) { u._enr += u.f.enrage; u.dm *= 1.15; status(b, u, 'ENRAGED', '#ff9c94'); }

    // Burn ticks (every 0.5s) — feeds Cinder Path 1 Draconic Surge!
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
              c.nextBonus = Math.min(6, (c.nextBonus || 0) + 1);
              addSorcery(b, c, 1, null, null);
            }
          });
        }
        if (!u.alive) continue;
      }
    } else s.burn = 0;

    // Poison ticks (steady, never fades; Juniper Overgrowth extends Root on tick!)
    if (s.poison > 0) {
      s.poisonAcc += s.poison * dt * Math.max(.3, 1 - .1 * Math.max(0, u.con));
      if (s.poisonAcc >= 1) {
        const v = Math.floor(s.poisonAcc);
        s.poisonAcc -= v;
        if (u.st.root > 0 && alive(b, 'P').some(x => x.f.overgrowth)) u.st.root += .25;
        hit(b, null, u, v, { dot: 1, ty: 'poison' });
        if (!u.alive) continue;
      }
    }

    // Cleric Channel Divinity auto-triggers (Bram Preserve Life, Lumen Radiance of Dawn, Jamison Balm of Peace)
    if (u.side === 'P' && !u._cdUsed && u.st.stun <= 0) {
      if (u.f.preserveLife && !u._pres) {
        const low = friends(b, u).find(a => !a.minion && hpPct(a) < .45 && hd(a, u) <= 4);
        if (low) triggerBramCD(b, u);
      } else if (u.f.lumenCaster) {
        const burningCount = foes(b, u).filter(x => x.st.burn >= 1).length;
        if (burningCount >= 3) triggerLumenCD(b, u);
      } else if (u.f.peaceCleric) {
        const hurt = friends(b, u).find(a => !a.minion && hpPct(a) < .60);
        if (hurt) triggerJamisonCD(b, u);
      }
    }
    // Staff of Healing: first time an ally drops below 40% HP triggers a Channel Divinity heal pulse (2d8 + WIS)
    if (u.side === 'P' && u.it && u.it.staffCdHeal && !u._staffCdUsed && u.st.stun <= 0) {
      const low = friends(b, u).find(a => !a.minion && hpPct(a) < .40);
      if (low) {
        u._staffCdUsed = 1;
        triggerChannelDivinity(b, u, 'CD · STAFF OF HEALING', mult => {
          const ts = friends(b, u).filter(a => !a.minion && hd(a, u) <= 3);
          const list = ts.length ? ts : [low];
          b.events.push({ k: 'area', id: u.id, shape: 'nova', r: 3, ty: 'radiant', ids: list.map(x => x.id) });
          list.forEach(a => heal(b, u, a, (roll(2, 8) + Math.max(0, u.m.wis)) * u.dm * mult, { raw: 1 }));
        });
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

    const totalRegen = (u.regen || 0) * ((u.doubleRegenT || 0) > 0 ? 2 : 1) + (u.it && u.it.pctRegen ? u.maxHp * u.it.pctRegen : 0);
    if (totalRegen > 0 && u.hp < u.maxHp) {
      const r = Math.min(u.maxHp - u.hp, totalRegen * dt);
      u.hp += r; u.stats.regenIn = (u.stats.regenIn || 0) + r;
    }
    u.stats.alive = (u.stats.alive || 0) + dt;
  }

  for (const u of b.units) if (u.hidden && (b.time >= u.hideT || !u.alive)) u.hidden = 0;

  for (const u of b.units) {
    if (!u.alive || u.st.stun > 0) continue;
    u.target = pickTarget(b, u);

    if (u.abil && !(u.st.charm > 0) && !(u.st.fear > 0)) {
      const quickenMult = (u.it && u.it.quickenFirst && !(u._casts > 0)) ? 2.0 : 1.0;
      const gain = u.cr * dt * (1 + (u.auraCr || 0) / 100) * quickenMult;
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
  const p = alive(b, 'P').length, e = alive(b, 'E').length;
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
