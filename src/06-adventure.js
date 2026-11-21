/* ================= 0.22 ADVENTURE, ECONOMY, PIGGY BANK, SHOP & HERO QUESTS =================
   Pure game logic, zero DOM dependencies (runs in both browser and Node headless tests).
   Implements v0.22 Systems Handoff rules:
   - Standing Piggy Bank single free-loss rule (first loss breaks bank, pays out, retries fight; second ends run)
   - Reworked Shop: 2 Recruit Slots (unowned) + 1 Upgrade Slot (Next-Tier Upgrade; NO Tier I duplicates)
   - Pre-Tiered Recruits in Act 2 (Tier II) & Act 3 (Tier II/III) with immediate Tier II Path pop-up
   - Pack Drafting adds 4 heroes + 1 Pack Item to shop pool
   - Training Node (Promote +1 Tier OR +1 Attribute), Campfire Retraining (switch Tier II Path freely), Quest Board (Quest Acceleration)
   - Built-in Personal Hero Quests & Uncapped Run Scalers for all 12 heroes
*/

const ECON = {
  freeLosses: 1,
  piggyPerWin: 2,
  winGold: d => 5 + Math.floor(d / 5),
  lossGold: () => 0,
  heroPrice: t => [0, 3, 6, 9, 13][t] || 13,
  itemPrice: [2, 3, 5, 7, 12],
  reroll: n => 1 + n,
  sellBack: 1,
  sale: 2,
  victory: 999,
  board: 4,
  bench: 0,
  stash: 10,
  shopHeroes: 3, // Slots 0-1: Recruit Slots (unowned); Slot 2: Upgrade Slot (owned next tier)
  shopItems: 3
};

const TIERCOL = { 1: '#a8743c', 2: '#8c9aa8', 3: '#d0a02a', 4: '#8a4fb8' };
const heroValue = t => { let v = 0; for (let i = 1; i <= t; i++) v += ECON.heroPrice(i); return v; };
const actOf = run => (run && run.adv ? run.adv.act : 1);

/* Smooth per-encounter progression (e = encounters won): higher tiers slowly climb each fight while Tier I / Common remain findable in Act 3 */
const encounterCount = run => Math.max(0, (run && run.stats && run.stats.won) || 0);

function heroTierOdds(e) {
  const n = Math.max(0, e || 0);
  const t3 = n < 6 ? 0 : Math.min(30, (n - 5) * 3);
  const t2Raw = n < 1 ? 0 : Math.min(55, n * 5);
  const t1 = Math.max(25, 100 - t2Raw - t3);
  const t2 = Math.max(0, 100 - t1 - t3);
  return [t1 / 100, t2 / 100, t3 / 100];
}
function rollOfferTier(run, rand = Math.random) {
  const o = heroTierOdds(encounterCount(run));
  let x = rand();
  for (let t = 0; t < 3; t++) { x -= o[t]; if (x <= 0) return t + 1; }
  return 1;
}

function itemRarityOdds(e) {
  const n = Math.max(0, e || 0);
  const vr = n < 5 ? 0 : Math.min(28, Math.round((n - 4) * 2.4));
  const rare = n < 1 ? 0 : Math.min(38, Math.round(n * 2.8));
  const common = Math.max(12, Math.round(70 - n * 4.2));
  const uncommon = Math.max(15, 100 - common - rare - vr);
  const sum = common + uncommon + rare + vr;
  return [common / sum, uncommon / sum, rare / sum, vr / sum];
}
function rollItemRarity(run, rand = Math.random, bonusEnc = 0) {
  const o = itemRarityOdds(encounterCount(run) + bonusEnc);
  let x = rand();
  for (let r = 0; r < 4; r++) { x -= o[r]; if (x <= 0) return r; }
  return 0;
}
function rollItemFromPool(avail, run, rand = Math.random, bonusEnc = 0) {
  if (!avail || !avail.length) return null;
  const targetR = rollItemRarity(run, rand, bonusEnc);
  let bucket = avail.filter(k => ITEMS[k] && ITEMS[k].r === targetR);
  if (!bucket.length) {
    // Fallback to nearest available rarity
    for (let d = 1; d <= 3 && !bucket.length; d++) {
      bucket = avail.filter(k => ITEMS[k] && (ITEMS[k].r === targetR - d || ITEMS[k].r === targetR + d));
    }
  }
  const pickFrom = bucket.length ? bucket : avail;
  return pickFrom[Math.floor(rand() * pickFrom.length)];
}

const THREATS = {
  ambush:    { enc: 'ambush',    n: 'Raiders',      q: 'Blades in front, archers and a healer behind',        tag: 'baseline', m: 1.05 },
  wolves:    { enc: 'wolves',    n: 'Wolf pack',    q: 'A swarm, and a Dire Wolf that leaps at the back row', tag: 'swarm',    m: .95 },
  reavers:   { enc: 'reavers',   n: 'Reavers',      q: 'Chargers that leap at the back row',                  tag: 'charger',  m: 1.04 },
  gate:      { enc: 'gate',      n: 'Shield wall',  q: 'High AC in front, archers behind',                    tag: 'armor',    m: 1.02 },
  owlwell:   { enc: 'owlwell',   n: 'Necromancer',  q: 'Necrosis, and a summoner raising archers',            tag: 'necrosis', m: .80 },
  blights:   { enc: 'blights',   n: 'Blight swarm', q: 'Many weak foes, and a summoner growing more',         tag: 'swarm',    m: .98 },
  glasstaff: { enc: 'glasstaff', n: 'Battle Mage',  q: 'A caster behind a shield wall; high SR',              tag: 'spell',    m: .96 },
  forge:     { enc: 'forge',     n: 'Fire cult',    q: 'Casters that punish clumps',                          tag: 'fire',     m: .96 },
  orcs:      { enc: 'orcs',      n: 'War band',     q: 'Chargers, an ogre and a warlord',                     tag: 'elite', boss: 1, m: .96 },
  owlbear:   { enc: 'owlbear',   n: 'Owlbear',      q: 'One juggernaut that enrages',                         tag: 'elite', boss: 1, m: .87 },
  spider:    { enc: 'spider',    n: 'Brood Mother', q: 'Boss: necrosis, webs and spiders',                    tag: 'boss',  boss: 1, m: .78 }
};
const THREAT_ORDER = Object.keys(THREATS);

const CURVE = {
  share: [.45, .60, .76, .88, 1],
  grow: 1.225,
  dmgGrow: 1.28,
  ease: [0.95, 1.14, 1.28, 1.40, 1.46],
  retry: .88
};
function curveAt(d) {
  const di = Math.max(1, Math.floor(d));
  const share = CURVE.share[Math.min(di, CURVE.share.length) - 1];
  if (d <= 5) { const e = CURVE.ease[di - 1]; return { share, hp: e, dmg: e }; }
  return { share, hp: Math.pow(CURVE.grow, d - 5), dmg: Math.pow(CURVE.dmgGrow, d - 5) };
}

const ADV = {
  acts: 3, rows: 7, bossRow: 6,
  depth: (act, r) => [1, 6.5, 10.5][act - 1] + r * [1, .85, .8][act - 1],
  bossDepth: act => [8.2, 13.0, 17.5][act - 1],
  eliteDepth: 1.3, eliteK: 1.26, eliteGold: 3,
  startGold: 6
};

const NODE = {
  fight:    { n: 'Fight',       g: '⚔' },
  elite:    { n: 'Elite fight', g: '☠' },
  boss:     { n: 'Boss',        g: '♛' },
  train:    { n: 'Training',    g: '✦' },
  quest:    { n: 'Quest board', g: '❖' },
  rest:     { n: 'Campfire',    g: '♨' },
  treasure: { n: 'Treasure',    g: '◆' }
};

/* ---------- Run Creation ---------- */
let RUN_UID = 1;
function newRun() {
  return {
    v: '0.22', depth: 1, shopNo: 0, endless: false, victory: false,
    losses: 0, piggy: 0, piggyBroken: false, gold: 0,
    team: [], stash: [],
    shop: { heroes: [], slotKind: [], tiers: [], items: [], lockH: [], lockI: [], fresh: [], sale: null, rr: 0, frozen: false },
    next: null, hist: [], log: [],
    stats: { won: 0, lost: 0, gold: 0, spent: 0, rerolls: 0 },
    firstPick: null, over: false, started: Date.now()
  };
}

function newAdventure(rand = Math.random) {
  const run = newRun();
  run.adv = {
    act: 1, map: null, pos: null, path: [], packs: [],
    pool: [], itemPool: [...CORE_ITEM_KEYS],
    done: [], bosses: [], stage: 'packs', offer: null, node: null, loot: null, trained: 0
  };
  run.gold = ADV.startGold;
  run.adv.offer = packOffer(run, rand);
  return run;
}

const cfgOf = (h, run) => ({
  key: h.key, tier: h.tier, path: h.path, asi: h.asi, train: h.train,
  items: h.items, c: h.c, r: h.r,
  questDone: !!h.questDone, questStacks: h.questStacks || 0, questTrophies: h.questTrophies || [],
  act: actOf(run), goldHeld: run ? run.gold : 0
});
const boardHeroes = run => run.team.filter(h => h.onBoard);
const benchHeroes = run => run.team.filter(h => !h.onBoard);
const ownedHero = (run, k) => run.team.find(h => h.key === k);
const canAfford = (run, p) => p != null && run.gold >= p;
const onSale = (run, kind, i) => run.shop && run.shop.sale && run.shop.sale.kind === kind && run.shop.sale.i === i;
const itemPrice = (run, i) => { const k = run.shop.items[i]; return k ? Math.max(1, ECON.itemPrice[ITEMS[k].r] - (onSale(run, 'i', i) ? ECON.sale : 0)) : null; };
const rerollPrice = run => ECON.reroll(run.shop.rr || 0);
const heroRefund = h => heroValue(h.tier);
function itemRefund(run, k) {
  const f = (run.shop.fresh || []).find(x => x[0] === k);
  const base = f ? f[1] : Math.max(1, Math.floor(ECON.itemPrice[ITEMS[k].r] * .5));
  const hasSellBonus = run && run.team && run.team.some(h => (h.items || []).some(ik => ITEMS[ik] && ITEMS[ik].s && ITEMS[ik].s.sellBonus));
  return hasSellBonus && !f ? Math.ceil(base * 1.5) : base;
}

function mkRosterHero(k, tier = 1, spent = 0) {
  return {
    uid: RUN_UID++, key: k, tier, path: null, asi: null, items: [], spent, onBoard: true,
    questProg: 0, questDone: false, questStacks: 0, questTrophies: [], itemsWonSet: []
  };
}

function freeHero(run, k) {
  const h = mkRosterHero(k, 1, 0);
  run.team.push(h);
  return h;
}

/* ---------- Pre-Run Pack Toggles (Hero pool selection; all items always in shop) ---------- */
function packOffer(run, rand = Math.random) {
  const open = PACK_ORDER.filter(k => !run.adv.packs.includes(k));
  return open;
}

function openPack(run, k) {
  const P = PACKS[k];
  if (!P || run.adv.packs.includes(k)) return;
  run.adv.packs.push(k);
  P.heroes.forEach(h => { if (!run.adv.pool.includes(h)) run.adv.pool.push(h); });
  run.adv.offer = null;
}

function firstPickFromPacks(packKeys, rand = Math.random) {
  const valid = (packKeys || []).filter(k => PACKS[k]);
  if (!valid.length) return PACKS[PACK_ORDER[0]].heroes.slice();
  if (valid.length === 1) return PACKS[valid[0]].heroes.slice();
  // Spread the 4 free starter choices across enabled packs (shuffled)
  const picks = [];
  const shuffledPacks = valid.slice().sort(() => rand() - .5);
  for (const pk of shuffledPacks) {
    if (picks.length >= 4) break;
    const hs = PACKS[pk].heroes.filter(h => !picks.includes(h));
    if (hs.length) picks.push(hs[Math.floor(rand() * hs.length)]);
  }
  const all = valid.flatMap(pk => PACKS[pk].heroes).filter(h => !picks.includes(h));
  while (picks.length < 4 && all.length) {
    picks.push(all.splice(Math.floor(rand() * all.length), 1)[0]);
  }
  return picks;
}

function startRunWithPacks(run, packKeys, rand = Math.random) {
  const valid = (packKeys || []).filter(k => PACKS[k]);
  const chosen = valid.length ? valid : [...PACK_ORDER];
  run.adv.packs = [];
  run.adv.pool = [];
  // All items (including all pack items) are always available in the shop regardless of enabled/disabled packs.
  run.adv.itemPool = [...CORE_ITEM_KEYS];
  // No free starting item in stash.
  chosen.forEach(k => openPack(run, k));
  run.firstPick = firstPickFromPacks(chosen, rand);
  run.adv.stage = 'pick';
  return chosen;
}

/* ---------- Shop: Encounter-Scaled Tiers/Rarities, Exact-Tier Upgrades, No Lower-Tier Duplicates ---------- */
function heroOffer(run, k, slot) {
  const o = ownedHero(run, k);
  const off = slot != null && onSale(run, 'h', slot) ? ECON.sale : 0;
  if (!o) {
    const ot = (run.shop && run.shop.tiers && slot != null && run.shop.tiers[slot]) || 1;
    return { tier: ot, price: Math.max(1, heroValue(ot) - off), isNew: true, sale: off, offerTier: ot, slotKind: 'recruit' };
  }
  if (o.tier >= 4) return { tier: 4, price: null, maxed: true, offerTier: 4, slotKind: 'upgrade' };
  // Upgrading requires finding a matching-tier copy (Tier I -> II via T1 copy, Tier II -> III via T2 copy, Tier III -> IV via T3 copy)
  const copyTier = (run.shop && run.shop.tiers && slot != null && run.shop.tiers[slot]) || o.tier;
  if (copyTier < o.tier) return { tier: o.tier, price: null, maxed: true, offerTier: copyTier, slotKind: 'upgrade' };
  const nt = o.tier + 1;
  return { tier: nt, price: Math.max(1, ECON.heroPrice(nt) - off), upgrade: o, sale: off, offerTier: o.tier, slotKind: 'upgrade' };
}

function toggleLock(run, kind, i) {
  const L = kind === 'h' ? run.shop.lockH : run.shop.lockI;
  L[i] = !L[i];
  return L[i];
}
function toggleFreeze(run) { run.shop.frozen = !run.shop.frozen; return run.shop.frozen; }

function rollShop(run, rand = Math.random, keepCount) {
  const old = run.shop || {};
  const lockH = old.lockH || [], lockI = old.lockI || [], oldT = old.tiers || [];
  // Release any locked hero duplicate that has fallen below the owned hero's current tier (or maxed)
  const keptH = (old.heroes || []).map((k, i) => {
    if (!lockH[i] || !k) return null;
    const o = ownedHero(run, k);
    if (o && (o.tier >= 4 || (oldT[i] || 1) < o.tier)) return null;
    return k;
  });
  const keptI = (old.items || []).map((k, i) => lockI[i] && k ? k : null);

  const fullPool = (run.adv && run.adv.pool.length) ? run.adv.pool : HERO_ORDER;
  const unownedPool = fullPool.filter(k => !ownedHero(run, k) && !keptH.includes(k));
  // First shop never offers a hero upgrade
  const allowUpgrades = (run.shopNo || 0) > 1 || encounterCount(run) > 0;

  const heroes = [];
  const slotKind = [];
  const tiers = [];
  const recBag = [...unownedPool];

  for (let i = 0; i < ECON.shopHeroes; i++) {
    if (keptH[i]) {
      heroes.push(keptH[i]);
      const o = ownedHero(run, keptH[i]);
      slotKind.push(o ? 'upgrade' : 'recruit');
      tiers.push(o ? o.tier : (oldT[i] || 1));
      continue;
    }
    const ot = rollOfferTier(run, rand);
    // Owned heroes can only appear at their exact current tier (never at a lower tier until sold!)
    const upgAtTier = allowUpgrades
      ? run.team.filter(h => h.tier === ot && h.tier < 4 && !heroes.includes(h.key) && !keptH.includes(h.key)).map(h => h.key)
      : [];
    const wantUpgrade = (i === 2 && upgAtTier.length > 0);
    if (wantUpgrade) {
      const k = upgAtTier[Math.floor(rand() * upgAtTier.length)];
      heroes.push(k);
      slotKind.push('upgrade');
      tiers.push(ot);
    } else if (recBag.length > 0) {
      const k = recBag.splice(Math.floor(rand() * recBag.length), 1)[0];
      heroes.push(k);
      slotKind.push('recruit');
      tiers.push(ot);
    } else if (upgAtTier.length > 0) {
      const k = upgAtTier[Math.floor(rand() * upgAtTier.length)];
      heroes.push(k);
      slotKind.push('upgrade');
      tiers.push(ot);
    } else {
      heroes.push(null);
      slotKind.push('recruit');
      tiers.push(ot);
    }
  }

  const availItems = (run.adv && run.adv.itemPool && run.adv.itemPool.length) ? run.adv.itemPool : CORE_ITEM_KEYS;
  const items = [];
  for (let i = 0; i < ECON.shopItems; i++) {
    if (keptI[i]) { items.push(keptI[i]); continue; }
    const c = availItems.filter(k => ITEMS[k] && !items.includes(k) && !keptI.includes(k));
    items.push(rollItemFromPool(c, run, rand, 0));
  }

  const free = [
    ...heroes.map((k, i) => k && !keptH[i] ? ['h', i] : null),
    ...items.map((k, i) => k && !keptI[i] ? ['i', i] : null)
  ].filter(Boolean);
  const sl = free.length ? free[Math.floor(rand() * free.length)] : null;

  run.shop = {
    heroes, slotKind, tiers, items,
    rr: keepCount ? (old.rr || 0) : 0,
    frozen: false,
    lockH: keptH.map(Boolean),
    lockI: keptI.map(Boolean),
    fresh: keepCount ? (old.fresh || []) : [],
    sale: sl ? { kind: sl[0], i: sl[1] } : (keepCount ? old.sale : null)
  };
}

function openShop(run, rand = Math.random) {
  run.shopNo = (run.shopNo || 0) + 1;
  if (run.shop && run.shop.frozen && run.shop.heroes.length) {
    run.shop.frozen = false; run.shop.rr = 0; run.shop.fresh = [];
    return false;
  }
  rollShop(run, rand);
  return true;
}

function buyHero(run, slot, swapUid) {
  const k = run.shop.heroes[slot];
  if (!k) return { ok: false, why: 'Sold out' };
  const o = heroOffer(run, k, slot);
  if (o.maxed) return { ok: false, why: 'Already Tier IV' };
  if (o.isNew && run.team.length >= ECON.board) {
    if (swapUid == null) return { ok: false, why: 'Party is full (4/4)', needSwap: true };
    const out = run.team.find(h => h.uid === swapUid);
    if (!out) return { ok: false, why: 'No such hero' };
    if (run.gold + heroValue(out.tier) < o.price) return { ok: false, why: 'Not enough gold' };
    sellHero(run, swapUid, true);
  }
  if (!canAfford(run, o.price)) return { ok: false, why: 'Not enough gold' };
  run.gold -= o.price; run.stats.spent += o.price;
  run.shop.heroes[slot] = null; run.shop.lockH[slot] = false;
  if (o.isNew) {
    const h = mkRosterHero(k, o.tier, o.price);
    run.team.push(h);
    return { ok: true, hero: h, isNew: true, needsPath: h.tier >= 2, needsAsi: h.tier >= 3 };
  }
  const h = o.upgrade;
  const was = h.tier;
  h.tier = o.tier;
  h.spent += o.price;
  return { ok: true, hero: h, tierUp: true, needsPath: was < 2 && h.tier >= 2 && !h.path, needsAsi: was < 3 && h.tier >= 3 && !h.asi };
}

function sellHero(run, uid, swap) {
  const i = run.team.findIndex(x => x.uid === uid);
  if (i < 0) return 0;
  const h = run.team[i];
  if (run.team.length === 1 && !swap) return 0;
  const back = heroValue(h.tier);
  run.gold += back;
  h.items.forEach(k => {
    if (run.stash.length < ECON.stash) run.stash.push(k);
    else run.gold += ECON.itemPrice[ITEMS[k].r];
  });
  run.team.splice(i, 1);
  return back;
}

function buyItem(run, slot) {
  const k = run.shop.items[slot];
  if (!k) return { ok: false, why: 'Sold out' };
  const p = itemPrice(run, slot);
  if (!canAfford(run, p)) return { ok: false, why: 'Not enough gold' };
  if (run.stash.length >= ECON.stash) return { ok: false, why: 'Your stash is full' };
  run.gold -= p; run.stats.spent += p;
  run.shop.items[slot] = null; run.shop.lockI[slot] = false;
  run.stash.push(k);
  run.shop.fresh.push([k, p]);
  return { ok: true, item: k };
}

function reroll(run, rand = Math.random) {
  const p = rerollPrice(run);
  if (run.gold < p) return false;
  run.gold -= p; run.stats.spent += p; run.stats.rerolls++;
  const n = (run.shop.rr || 0) + 1;
  rollShop(run, rand, true);
  run.shop.rr = n;
  return true;
}

function equip(run, uid, stashIdx) {
  const h = run.team.find(x => x.uid === uid);
  const k = run.stash[stashIdx];
  if (!h || !k) return false;
  if (h.items.length >= slotsOf(h)) return false;
  if (!canCarry(h, k)) return false;
  run.stash.splice(stashIdx, 1);
  h.items.push(k);
  return true;
}

function unequip(run, uid, i) {
  const h = run.team.find(x => x.uid === uid);
  if (!h || run.stash.length >= ECON.stash) return false;
  run.stash.push(h.items.splice(i, 1)[0]);
  return true;
}

function sellItem(run, stashIdx) {
  const k = run.stash[stashIdx];
  if (!k) return 0;
  const back = itemRefund(run, k);
  const fi = (run.shop.fresh || []).findIndex(x => x[0] === k);
  if (fi >= 0) run.shop.fresh.splice(fi, 1);
  run.gold += back;
  run.stash.splice(stashIdx, 1);
  return back;
}

function toggleBoard() { return false; } // Party is always 4 heroes on board

/* ---------- Encounters & Adventure Map ---------- */
function buildEncounter(run, rand = Math.random) {
  const d = run.depth;
  const tk = run.forceThreat || 'ambush';
  const T = THREATS[tk];
  const base = ENC[T.enc];
  const cv = curveAt(d);
  let units = base.u.map((u, i) => ({ u, i, el: E[u[0]].elite || E[u[0]].boss }));
  const n = Math.max(d === 1 ? 2 : 1, Math.round(units.length * cv.share));
  const regs = units.filter(x => !x.el), els = units.filter(x => x.el);
  let keep = d >= 3 || T.boss ? [...els, ...regs] : [...regs, ...els];
  keep = keep.slice(0, n).sort((a, b) => a.i - b.i).map(x => x.u);
  if (d === 1) keep = keep.filter(u => !E[u[0]].elite).slice(0, 2);
  const sc = base.sc || {};
  const retry = Math.pow(CURVE.retry, run.retries || 0);
  const enc = {
    n: T.n, place: base.place, theme: base.theme, q: T.q, note: base.note, map: base.map, u: keep,
    waves: d >= 5 ? (base.waves || []) : [],
    sc: { hp: (sc.hp || 1) * cv.hp * (T.m || 1) * retry * (d === 1 ? .96 : 1), dmg: (sc.dmg || 1) * cv.dmg * (T.m || 1) * retry * (d === 1 ? .95 : 1) },
    threat: tk, depth: d
  };
  ENC.run = enc;
  run.next = { threat: tk, n: T.n, q: T.q, tag: T.tag, boss: !!T.boss, foes: keep.map(u => u[0]) };
  return enc;
}

function genMap(run, act, rand = Math.random) {
  const rows = [];
  const used = new Set(run.hist.slice(-2));
  const threat = elite => {
    const pool = THREAT_ORDER.filter(k => (!THREATS[k].boss && k !== 'ambush') || (act === 1 && !elite && k === 'ambush'));
    const fresh = pool.filter(k => !used.has(k));
    const k = (fresh.length ? fresh : pool)[Math.floor(rand() * (fresh.length ? fresh : pool).length)];
    used.add(k); if (used.size > 6) used.delete(used.values().next().value);
    return k;
  };
  const EVENTS = ['train', 'quest', 'rest', 'treasure'];
  for (let r = 0; r < ADV.bossRow; r++) {
    const row = [];
    if (r % 2 === 0) {
      const kinds = r === 0 && act === 1 ? ['fight', 'fight', 'fight'] : ['fight', 'fight', 'elite'];
      kinds.sort(() => rand() - .5);
      kinds.forEach((kind, i) => {
        const node = { kind, r, i, x: (i + .5) / kinds.length, threat: threat(kind === 'elite') };
        node.d = ADV.depth(act, r) + (kind === 'elite' ? ADV.eliteDepth : 0);
        row.push(node);
      });
    } else {
      const pool = EVENTS.slice();
      const kinds = [];
      if (r === ADV.bossRow - 1) kinds.push(pool.splice(pool.indexOf('rest'), 1)[0]);
      while (kinds.length < 3) kinds.push(pool.splice(Math.floor(rand() * pool.length), 1)[0]);
      kinds.forEach((kind, i) => row.push({ kind, r, i, x: (i + .5) / kinds.length }));
    }
    rows.push(row);
  }
  const bosses = THREAT_ORDER.filter(k => THREATS[k].boss && !(run.adv.bosses || []).includes(k));
  const bk = bosses[Math.floor(rand() * bosses.length)] || 'owlbear';
  rows.push([{ kind: 'boss', r: ADV.bossRow, i: 0, x: .5, threat: bk, d: ADV.bossDepth(act) }]);
  return rows;
}

function startAct(run, rand = Math.random) {
  run.adv.map = genMap(run, run.adv.act, rand);
  run.adv.pos = null;
  run.adv.path = [];
  run.adv.node = null;
  run.adv.loot = null;
  run.adv.stage = 'map';
}
function nextNodes(run) {
  const M = run.adv && run.adv.map, p = run.adv && run.adv.pos;
  if (!M || !M.length) return [];
  if (!p) return M[0] || [];
  return M[p.r + 1] || [];
}
function enterNode(run, node) {
  run.adv.node = node;
  if (node.kind === 'fight' || node.kind === 'elite' || node.kind === 'boss') {
    buildNodeEncounter(run, node);
    run.adv.stage = 'shop';
    return 'fight';
  }
  run.adv.stage = 'event';
  return node.kind;
}
function buildNodeEncounter(run, node) {
  run.depth = node.d;
  run.forceThreat = node.threat;
  const enc = buildEncounter(run);
  run.forceThreat = null;
  if (node.kind === 'elite') { enc.sc.hp *= ADV.eliteK; enc.sc.dmg *= ADV.eliteK; run.next.elite = true; }
  if (node.kind === 'boss') run.next.boss = true;
  run.next.kind = node.kind;
  return enc;
}
function clearNode(run) {
  const n = run.adv.node;
  if (n) run.adv.pos = { r: n.r, i: n.i };
  run.adv.node = null;
  run.adv.stage = 'map';
}

/* ---------- Placement ---------- */
function autoPlace(run, force) {
  loadMap(ENC.run.map);
  const spots = DEPLOY.slice();
  const rows = [...new Set(spots.map(s => s.r))].sort((a, b) => a - b);
  const mid = (COLS - 1) / 2;
  const order = spots.slice().sort((a, b) => Math.abs(a.c - mid) - Math.abs(b.c - mid));
  const front = order.filter(s => s.r === rows[0]), back = order.filter(s => s.r !== rows[0]);
  const on = boardHeroes(run);
  const used = new Set();
  const kOf = s => s.c + ',' + s.r;
  if (!force) on.forEach(h => { if (h.c != null && spots.some(s => s.c === h.c && s.r === h.r) && !used.has(kOf(h))) used.add(kOf(h)); else h.c = null; });
  else on.forEach(h => h.c = null);
  on.filter(h => h.c == null).sort((a, b) => (H[a.key].role === 'Tank' ? 0 : 1) - (H[b.key].role === 'Tank' ? 0 : 1)).forEach(h => {
    const pref = H[h.key].role === 'Tank' || H[h.key].reach === 'Melee' ? [...front, ...back] : [...back, ...front];
    const s = pref.find(x => !used.has(kOf(x)));
    if (s) { h.c = s.c; h.r = s.r; used.add(kOf(s)); }
  });
}
function autoBless() {} // No bless-hold hero in initial 12 cast
function partyCfg(run) { return boardHeroes(run).map(h => cfgOf(h, run)); }

/* ---------- Hero Quests Progression & Uncapped Run Scalers ---------- */
function updateHeroQuests(run, won, b) {
  const updates = [];
  if (!b) return updates;
  const P = b.units.filter(x => x.side === 'P' && !x.minion);
  const noneFell = won && P.length > 0 && P.every(u => u.alive);

  boardHeroes(run).forEach(h => {
    const d = H[h.key];
    const q = d && d.quest;
    const u = P.find(x => x.key === h.key);
    if (!q || !u) return;

    // Post-completion uncapped run scalers
    if (h.questDone) {
      if (h.key === 'faelan' && won) {
        h.questStacks = (h.questStacks || 0) + 1;
        updates.push({ h, scaled: `Owl Familiar: +1 INT (total +${h.questStacks})` });
      }
      if (h.key === 'zark' && u.alive && u._droppedHalf) {
        h.questStacks = (h.questStacks || 0) + 1;
        updates.push({ h, scaled: `Relentless Hide: +1 CON (total +${h.questStacks})` });
      }
      if (h.key === 'velith' && (u.stats.kills || 0) > 0) {
        h.questKillBank = (h.questKillBank || 0) + (u.stats.kills || 0);
        const gained = Math.floor(h.questKillBank / 4);
        if (gained > 0) {
          h.questKillBank %= 4;
          h.questStacks = (h.questStacks || 0) + gained;
          updates.push({ h, scaled: `Death’s Ledger: +${gained} DEX (total +${h.questStacks})` });
        }
      }
      if (h.key === 'lorcan' && b.trophiesEarned && b.trophiesEarned.length) {
        h.questTrophies = h.questTrophies || [];
        b.trophiesEarned.forEach(a => {
          if (!h.questTrophies.includes(a)) {
            h.questTrophies.push(a);
            updates.push({ h, scaled: `Favoured Enemy trophy: ${a} (+1 DEX, +15% dmg)` });
          }
        });
      }
      return;
    }

    // Track progress toward personal Quest Goal
    let delta = 0;
    if (q.statKey === 'flawlessWins') {
      if (noneFell) delta = 1;
    } else if (q.statKey === 'itemsWon') {
      if (won) {
        h.itemsWonSet = h.itemsWonSet || [];
        (h.items || []).forEach(ik => { if (!h.itemsWonSet.includes(ik)) h.itemsWonSet.push(ik); });
        h.questProg = h.itemsWonSet.length;
      }
    } else if (q.statKey === 'bearRagePeak') {
      h.questProg = Math.max(h.questProg || 0, u.stats.bearRagePeak || 0);
    } else {
      delta = u.stats[q.statKey] || 0;
    }

    if (delta > 0) h.questProg = (h.questProg || 0) + delta;

    if (h.questProg >= q.goal) {
      h.questDone = true;
      h.questProg = q.goal;
      updates.push({ h, completed: true, rewardName: q.rewardName, rewardDesc: q.rewardDesc });
    } else if (delta > 0 || (q.statKey === 'bearRagePeak' && u.stats.bearRagePeak > 0)) {
      updates.push({ h, progress: Math.min(1, h.questProg / q.goal), prog: h.questProg, goal: q.goal });
    }
  });

  return updates;
}

/* ---------- Post-Combat Resolution (Piggy Bank Single Free-Loss Rule!) ---------- */
function resolveFight(run, won, b) {
  const d = run.depth;
  let gold = 0, piggy = 0, bonusGold = 0;
  if (won) {
    gold = ECON.winGold(d);
    // Bag of Holding (winBonusGold): +1 bonus Gold per copy carried on win
    const scaleCount = (run.team || []).reduce((acc, h) => acc + (h.items || []).filter(k => ITEMS[k] && ITEMS[k].s && ITEMS[k].s.winBonusGold).length, 0);
    if (scaleCount > 0) bonusGold += scaleCount;
    // Gains Quest Compound Interest: +10% held Gold interest (up to +5g) on win
    if ((run.team || []).some(h => h.key === 'gains' && h.questDone)) {
      bonusGold += Math.min(5, Math.floor((run.gold || 0) * .10));
    }
    gold += bonusGold;
    run.stats.won++;
    run.depth++;
    run.retries = 0;
    if (!run.piggyBroken) run.piggy += ECON.piggyPerWin;
  } else {
    run.losses++;
    run.stats.lost++;
    run.retries = (run.retries || 0) + 1;
    // Standing Rule: First loss breaks the Piggy Bank, pays out, and lets you shop & retry the fight; second loss ends the run!
    if (run.losses <= ECON.freeLosses && !run.piggyBroken) {
      piggy = run.piggy;
      run.piggy = 0;
      run.piggyBroken = true;
      gold += piggy;
    }
  }
  const made = (b && b.gold) || 0;
  run.gold += gold + made;
  run.stats.gold += gold + made;
  run.hist.push(run.next.threat);
  run.log.push({ d: Math.round(d), threat: run.next.threat, won, gold, made, piggy, time: b ? +b.time.toFixed(1) : 0 });
  if (run.losses > ECON.freeLosses) run.over = true;
  return { won, gold, made, d, piggy, bonusGold };
}

function resolveNodeFight(run, won, b) {
  const n = run.adv.node;
  const res = resolveFight(run, won, b);
  res.quests = updateHeroQuests(run, won, b);
  if (won && n && n.kind === 'elite') {
    run.gold += ADV.eliteGold;
    run.stats.gold += ADV.eliteGold;
    res.elite = ADV.eliteGold;
    run.adv.loot = treasureOffer(run, Math.random);
  }
  if (won && n && n.kind === 'boss') {
    run.adv.bosses.push(n.threat);
    res.actDone = run.adv.act;
    if (run.adv.act >= ADV.acts) {
      run.victory = true; run.over = true; res.finished = true;
    } else {
      // Act Boss clear bonus Gold (replaces mid-run Pack draft)
      run.gold += 8;
      run.stats.gold += 8;
      res.actBonus = 8;
    }
  }
  return res;
}

function afterNodeFight(run, res, rand = Math.random) {
  const n = run.adv.node;
  if (run.over) return 'over';
  if (res.actDone) {
    run.adv.act++;
    startAct(run, rand);
    return 'map';
  }
  // Piggy Bank retry: first loss lets you visit the shop and retry that exact fight!
  if (!res.won && n) {
    buildNodeEncounter(run, n);
    run.adv.stage = 'shop';
    return 'shop';
  }
  clearNode(run);
  return 'map';
}

/* ---------- Map Events: Training (+1 Tier OR +1 Attr), Campfire Retraining, Quest Acceleration, Treasure ---------- */
function trainHero(run, uid, attr) {
  const h = run.team.find(x => x.uid === uid);
  if (!h) return false;
  h.train = h.train || {};
  h.train[attr] = (h.train[attr] || 0) + 1;
  run.adv.trained++;
  return true;
}

function promoteHero(run, uid) {
  const h = run.team.find(x => x.uid === uid);
  if (!h || h.tier >= 4) return { ok: false };
  const was = h.tier;
  h.tier += 1;
  run.adv.trained++;
  return { ok: true, hero: h, needsPath: was < 2 && h.tier >= 2 && !h.path, needsAsi: was < 3 && h.tier >= 3 && !h.asi };
}

function retrainHeroPath(run, uid, newPathKey) {
  const h = run.team.find(x => x.uid === uid);
  if (!h || h.tier < 2) return false;
  const d = H[h.key];
  if (!d.paths.some(p => p.k === newPathKey)) return false;
  h.path = newPathKey;
  return true;
}

function accelerateHeroQuest(run, uid) {
  const h = run.team.find(x => x.uid === uid);
  if (!h || h.questDone) return null;
  const q = H[h.key].quest;
  if (!q) return null;
  const boost = Math.max(1, Math.ceil(q.goal * .35));
  h.questProg = Math.min(q.goal, (h.questProg || 0) + boost);
  if (h.questProg >= q.goal) {
    h.questDone = true;
    return { completed: true, h, q };
  }
  return { completed: false, h, q, boost };
}

function restAt(run, choice) {
  if (choice === 'piggy' && !run.piggyBroken) { run.piggy += 4; return 'Added +4 gold to your Piggy Bank'; }
  run.gold += 4; run.stats.gold += 4;
  return 'Foraged +4 gold';
}

function treasureOffer(run, rand = Math.random) {
  const avail = (run.adv && run.adv.itemPool && run.adv.itemPool.length) ? run.adv.itemPool.slice() : CORE_ITEM_KEYS.slice();
  const out = [];
  while (out.length < 3 && avail.length) {
    const pick = rollItemFromPool(avail, run, rand, 3);
    if (!pick) break;
    out.push(pick);
    const idx = avail.indexOf(pick);
    if (idx >= 0) avail.splice(idx, 1);
  }
  return out;
}
function takeTreasure(run, k) { if (run.stash.length < ECON.stash) run.stash.push(k); }

/* ---------- Boss Readiness Forecast ---------- */
function bossRead(run, sims = 3) {
  const M = run.adv.map;
  if (!M || !run.team.length) return null;
  const boss = M[ADV.bossRow][0];
  const saveEnc = ENC.run, saveNext = run.next, saveDepth = run.depth, saveUid = UID;
  let m = 0;
  try {
    for (let s = 0; s < sims; s++) {
      buildNodeEncounter(run, boss);
      const b = simulate('run', partyCfg(run), 1);
      const P = b.units.filter(u => u.side === 'P' && !u.minion);
      const E2 = b.units.filter(u => u.side === 'E');
      const pHp = P.reduce((a, u) => a + (u.alive ? Math.max(0, u.hp) : 0), 0) / Math.max(1, P.reduce((a, u) => a + u.maxHp, 0));
      const eHp = E2.reduce((a, u) => a + (u.alive ? Math.max(0, u.hp) : 0), 0) / Math.max(1, E2.reduce((a, u) => a + u.maxHp, 0));
      m += b.winner === 'P' ? .5 + .5 * pHp : .5 * (1 - eHp);
    }
  } finally {
    ENC.run = saveEnc; run.next = saveNext; run.depth = saveDepth; UID = saveUid;
    if (saveEnc && saveEnc.map) loadMap(saveEnc.map);
  }
  m /= sims;
  return { m, label: m >= .7 ? 'Favoured' : m >= .52 ? 'Even' : m >= .3 ? 'Dangerous' : 'Deadly' };
}
