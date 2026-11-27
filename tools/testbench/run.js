'use strict';
// ===================== Items (stand-in set built from the v0.25 items rework rules) =====================
const RARITY_PRICE = { Common: 5, Uncommon: 10, Rare: 15, 'Very Rare': 25, Legendary: 35, Class: 15 };
const ITEM_LIST = [
  // Common: stats only
  { id: 'stone_str', name: 'Stone of Might', rar: 'Common', stats: { STR: 2 }, text: '+2 STR' },
  { id: 'stone_dex', name: 'Stone of Agility', rar: 'Common', stats: { DEX: 2 }, text: '+2 DEX' },
  { id: 'stone_con', name: 'Stone of Fortitude', rar: 'Common', stats: { CON: 4 }, text: '+4 CON' },
  { id: 'stone_int', name: 'Stone of Intellect', rar: 'Common', stats: { INT: 2 }, cr: 0.05, text: '+2 INT, +5% cast rate' },
  { id: 'stone_wis', name: 'Stone of Insight', rar: 'Common', stats: { WIS: 2 }, text: '+2 WIS' },
  { id: 'stone_cha', name: 'Stone of Presence', rar: 'Common', stats: { CHA: 2 }, text: '+2 CHA' },
  { id: 'shield', name: 'Shield', rar: 'Common', ac: 2, text: '+2 AC' },
  { id: 'warding_charm', name: 'Warding Charm', rar: 'Common', sr: 2, text: '+2 SR' },
  { id: 'potion', name: 'Potion of Healing', rar: 'Common', potion: [4, 4, 4], text: 'Once per fight, at half HP: heal 4d4+4.' },
  // Uncommon
  { id: 'weapon1', name: '+1 Weapon', rar: 'Uncommon', dieUp: 1, flat: 1, text: 'Weapon die one size bigger, +1 damage.' },
  { id: 'cloak_protection', name: 'Cloak of Protection', rar: 'Uncommon', ac: 1, sr: 1, stats: { CON: 2 }, text: '+1 AC, +1 SR, +2 CON' },
  { id: 'bracers_archery', name: 'Bracers of Archery', rar: 'Uncommon', stats: { DEX: 2 }, rangedAs: 0.12, text: '+2 DEX. Ranged heroes attack 12% faster.' },
  { id: 'gauntlets_ogre', name: 'Gauntlets of Ogre Power', rar: 'Uncommon', stats: { STR: 2 }, meleeFlat: 1, text: '+2 STR. Melee heroes +1 damage.' },
  { id: 'amulet_health', name: 'Amulet of Health', rar: 'Uncommon', stats: { CON: 4 }, hp: 12, text: '+4 CON, +12 HP' },
  { id: 'pearl_power', name: 'Pearl of Power', rar: 'Uncommon', sc: 25, text: 'Start fights with +25 charge.' },
  { id: 'wand_warmage', name: 'Wand of the War Mage', rar: 'Uncommon', rollB: 2, spen: 1, text: '+2 to ability rolls, 1 spell penetration.' },
  { id: 'potion_greater', name: 'Greater Potion of Healing', rar: 'Uncommon', potion: [8, 4, 8], text: 'Once per fight, at half HP: heal 8d4+8.' },
  { id: 'boots_elvenkind', name: 'Boots of Elvenkind', rar: 'Uncommon', stats: { DEX: 1 }, text: 'Start each fight in Stealth (2.5s). +1 DEX' },
  { id: 'periapt', name: 'Periapt of Wound Closure', rar: 'Uncommon', regen: 1, text: 'Regenerate 1 HP per second. Last Stand lasts 0.5s longer.' },
  { id: 'whetstone', name: 'Whetstone', rar: 'Uncommon', scale: { f: 'flat', per: 1, cap: 4 }, text: '+1 attack damage per win while held (max +4).' },
  { id: 'gloves_swift', name: 'Gloves of Swiftness', rar: 'Uncommon', as: 0.12, text: 'Attack 12% faster.' },
  // Rare
  { id: 'flame_tongue', name: 'Flame Tongue', rar: 'Rare', onHit: { n: 1, x: 6, type: 'magic' }, text: 'On hit: +1d6 fire (same hit).' },
  { id: 'frost_brand', name: 'Frost Brand', rar: 'Rare', onHit: { n: 1, x: 4, type: 'magic', slow: 0.15 }, text: 'On hit: +1d4 cold and Slow 15% for 1s.' },
  { id: 'displacement', name: 'Cloak of Displacement', rar: 'Rare', text: 'The first 2 attacks against you each fight miss.' },
  { id: 'ring_evasion', name: 'Ring of Evasion', rar: 'Rare', stats: { DEX: 1 }, text: 'Halves the first enemy ability that hits you each fight. +1 DEX' },
  { id: 'spell_storing', name: 'Ring of Spell Storing', rar: 'Rare', sc: 40, text: 'Start fights with +40 charge.' },
  { id: 'potion_superior', name: 'Superior Potion of Healing', rar: 'Rare', potion: [8, 8, 8], text: 'Once per fight, at half HP: heal 8d8+8.' },
  { id: 'belt_hill', name: 'Belt of Hill Giant Strength', rar: 'Rare', stats: { STR: 3, CON: 2 }, text: '+3 STR, +2 CON' },
  { id: 'glamoured', name: 'Glamoured Studded Leather', rar: 'Rare', ac: 1, stats: { DEX: 1 }, text: '+1 AC, +1 DEX. Start each fight in Stealth (2.5s).' },
  { id: 'mantle_sr', name: 'Mantle of Spell Resistance', rar: 'Rare', sr: 4, text: '+4 SR' },
  { id: 'quicksilver', name: 'Quicksilver Vial', rar: 'Rare', as: 0.05, scale: { f: 'as', per: 0.03, cap: 0.15 }, text: 'Attack 5% faster, +3% per win while held (max +15%).' },
  { id: 'elven_chain', name: 'Elven Chain', rar: 'Rare', ac: 2, sr: 1, text: '+2 AC, +1 SR' },
  { id: 'vicious', name: 'Vicious Weapon', rar: 'Rare', onHit: { n: 1, x: 6, type: 'phys' }, text: 'On hit: +1d6 (same hit).' },
  // Very Rare
  { id: 'arachnida', name: 'Cloak of Arachnida', rar: 'Very Rare', sr: 2, arachnida: 1, text: 'Basic attacks inflict 1 Poison. +2 SR' },
  { id: 'ioun_mastery', name: 'Ioun Stone of Mastery', rar: 'Very Rare', text: 'Your ability rolls have Advantage.' },
  { id: 'scarab', name: 'Scarab of Protection', rar: 'Very Rare', sr: 3, ac: 1, hp: 15, text: '+1 AC, +3 SR, +15 HP' },
  { id: 'holy_weapon', name: 'Sun Blade', rar: 'Very Rare', dieUp: 1, onHit: { n: 1, x: 6, type: 'radiant' }, text: 'Weapon die one size bigger. On hit: +1d6 Radiant.' },
  { id: 'staff_power', name: 'Staff of Power', rar: 'Very Rare', stats: { INT: 2 }, cr: 0.15, sr: 2, text: '+2 INT, +15% cast rate, +2 SR' },
  // Class items (offered by the Class item choice card)
  { id: 'bm_gauntlet', name: "Battle Master's Gauntlet", rar: 'Class', cls: 'Fighter', stats: { STR: 2 }, text: '+2 STR. Every 4th attack, attack again (Action Surge).' },
  { id: 'holy_symbol', name: 'Holy Symbol of Life', rar: 'Class', cls: 'Cleric', stats: { WIS: 2 }, text: '+2 WIS. Your heals on allies heal +1d8.' },
  { id: 'grimoire', name: 'Arcane Grimoire', rar: 'Class', cls: 'Wizard', stats: { INT: 2 }, text: '+2 INT. Get 15 charge back after using your ability (Arcane Recovery).' },
  { id: 'cutpurse_cloak', name: "Cutpurse's Cloak", rar: 'Class', cls: 'Rogue', stats: { DEX: 2 }, text: '+2 DEX. Sneak Attack: +2d6 on controlled foes, every 3s.' },
  { id: 'devotion_brand', name: 'Devotion Brand', rar: 'Class', cls: 'Paladin', stats: { STR: 1 }, text: '+1 STR. Every 3rd melee hit smites for 2d8 Radiant.' },
  { id: 'hunters_quiver', name: "Hunter's Quiver", rar: 'Class', cls: 'Ranger', stats: { DEX: 2 }, text: '+2 DEX. +1d4 per hit on your current target.' },
  { id: 'cudgel', name: 'Living Cudgel', rar: 'Class', cls: 'Druid', stats: { WIS: 2 }, onHit: { n: 0, x: 4, type: 'phys', heal: 1 }, regen: 1, text: '+2 WIS. Regenerate 1 HP per second.' },
  { id: 'bard_instrument', name: 'Instrument of the Bards', rar: 'Class', cls: 'Bard', stats: { CHA: 2 }, text: '+2 CHA. After your ability, the closest ally adds 1d6 to their next ability roll.' },
  { id: 'totem', name: 'Totem Fetish', rar: 'Class', cls: 'Barbarian', stats: { CON: 4 }, kw: 'Rage', text: '+4 CON. Rage: gain Rage when hit; each Rage regenerates HP.' },
  { id: 'wraps', name: 'Wraps of Unarmed Power', rar: 'Class', cls: 'Monk', stats: { DEX: 2 }, kw: 'Ki', text: '+2 DEX. Ki: gain 1 Ki per hit (max 4); your ability spends it for +1 die each.' },
  { id: 'pact_rod', name: 'Rod of the Pact Keeper', rar: 'Class', cls: 'Warlock', stats: { CHA: 2 }, rollB: 2, text: '+2 CHA, +2 to ability rolls.' },
  { id: 'bloodwell', name: 'Bloodwell Vial', rar: 'Class', cls: 'Sorcerer', stats: { CHA: 2 }, sc: 20, text: '+2 CHA. Start fights with +20 charge.' },
];
const ITEMS = {}; for (const it of ITEM_LIST) { it.price = RARITY_PRICE[it.rar]; ITEMS[it.id] = it; }
ITEMS.cudgel.onHit = null;

const KW_LIST = ['Action Surge', 'Channel Divinity', 'Arcane Recovery', 'Sneak Attack', 'Smite', "Hunter's Mark", 'Bardic Inspiration', 'Rage', 'Ki', 'Hex', 'Metamagic'];
const CLASS_KW = { Fighter: 'Action Surge', Cleric: 'Channel Divinity', Wizard: 'Arcane Recovery', Rogue: 'Sneak Attack', Paladin: 'Smite', Ranger: "Hunter's Mark", Druid: 'Wild Shape', Bard: 'Bardic Inspiration', Barbarian: 'Rage', Monk: 'Ki', Warlock: 'Hex', Sorcerer: 'Metamagic' };

// ===================== Economy and run =====================
const ECON = { start: 10, heroCost: [15, 25, 35, 45], win: 20, boss: 75, interestPer: 5, interestCap: 20, sellBack: 0.66, saleOff: 0.25, saleChance: 0.15, piggyPerWin: 5, purse: 15, boardMax: 3, benchMax: 2, slot4: 55, slots: 2 };
const RARITY_WEIGHTS = [
  { Common: 70, Uncommon: 30 }, { Common: 55, Uncommon: 40, Rare: 5 }, { Common: 40, Uncommon: 45, Rare: 15 },
  { Common: 30, Uncommon: 45, Rare: 20, 'Very Rare': 5 }, { Common: 20, Uncommon: 45, Rare: 25, 'Very Rare': 10 }, { Common: 15, Uncommon: 40, Rare: 30, 'Very Rare': 15 },
];
const CHOICE_DECK = [
  { id: 'multiclass', name: 'Multiclass Trainer' }, { id: 'classitem', name: 'Class Item' }, { id: 'freeitem', name: 'Free Item' }, { id: 'purse', name: 'Purse' },
  { id: 'training', name: 'Training' }, { id: 'recruit', name: 'Recruit' }, { id: 'bargain_elite', name: 'Bargain: Elite' }, { id: 'bargain_more', name: 'Bargain: Patience' },
];

function newRun(seed) {
  if (seed !== undefined) seedRng(seed);
  return { gold: ECON.start, fight: 0, roster: [], stash: [], piggy: { amt: 0, broken: false }, over: false, won: false, rerollCost: 1, offers: null, bossId: pick(Object.keys(BOSSES)), campWard: false, bargainElite: false, extraCard: false, uid: 1, history: [], phase: 'starter' };
}
const encOf = run => run.fight < 5 ? ACT1[run.fight] : BOSSES[run.bossId];
const onBoard = run => run.roster.filter(r => r.pos);
const onBench = run => run.roster.filter(r => !r.pos);
function heroCost(tier) { return ECON.heroCost[tier - 1]; }
function starterOffers() { return shuffle(Object.keys(HEROES)).slice(0, 3); }
function addHero(run, id, opt = {}) {
  const rec = { uid: run.uid++, id, tier: 1, copies: 1, items: [], t2: null, mc: null, train: {}, pos: null, spent: opt.spent || 0 };
  run.roster.push(rec); autoPlace(run, rec, opt.bench); return rec;
}
function autoPlace(run, rec, forceBench) {
  if (forceBench || onBoard(run).length >= ECON.boardMax) { rec.pos = null; return; }
  const def = HEROES[rec.id]; const front = def.range <= 1 && !def.noMove;
  const cols = front ? [3, 2, 1, 0] : [1, 0, 2, 3]; const rows = [2, 3, 1, 4, 0, 5];
  for (const x of cols) for (const y of rows) if (!run.roster.some(r => r.pos && r.pos.x === x && r.pos.y === y) && cellOpenForHero(run, x, y)) { rec.pos = { x, y }; return; }
  rec.pos = null;
}
function cellOpenForHero(run, x, y) { const enc = encOf(run); return !(enc.terrain || []).some(([k, tx, ty]) => tx === x && ty === y && ['wall', 'chasm', 'forge', 'gate', 'rock'].includes(k)); }
function rollItemRarity(run) { const w = RARITY_WEIGHTS[Math.min(5, run.fight)]; let tot = 0; for (const k in w) tot += w[k]; let r = RNG() * tot; for (const k in w) { r -= w[k]; if (r <= 0) return k; } return 'Common'; }
function rollShop(run) {
  // Heroes you already own show up less often (rules.config.json shop.ownedHeroWeight; 1 = every hero equally likely). Luke, 26 Nov: until the hero pool grows.
  const w = (CFG.rules.shop && CFG.rules.shop.ownedHeroWeight != null) ? CFG.rules.shop.ownedHeroWeight : 1;
  let ids;
  if (w === 1) ids = shuffle(Object.keys(HEROES)).slice(0, 3);
  else { const pool = Object.keys(HEROES).map(id => ({ id, w: run.roster.some(r => r.id === id) ? w : 1 })); ids = [];
    for (let k = 0; k < 3 && pool.length; k++) { let t = pool.reduce((a, p) => a + p.w, 0) * RNG(); let i = 0; while (i < pool.length - 1 && (t -= pool[i].w) > 0) i++; ids.push(pool[i].id); pool.splice(i, 1); } }
  const heroes = ids.map(id => ({ kind: 'hero', id, sale: RNG() < ECON.saleChance, sold: false }));
  const items = []; for (let i = 0; i < 3; i++) { const rar = rollItemRarity(run); const pool = ITEM_LIST.filter(it => it.rar === rar && !items.some(o => o.id === it.id)); items.push({ kind: 'item', id: pick(pool).id, sale: RNG() < ECON.saleChance, sold: false }); }
  run.offers = { heroes, items };
}
function offerPrice(run, o) {
  let p = o.kind === 'hero' ? heroCost(1) : ITEMS[o.id].price;
  if (o.sale) p = Math.floor(p * (1 - ECON.saleOff)); return p;
}
function canBuyHero(run, id) { const owned = run.roster.find(r => r.id === id); if (owned) return owned.tier < 2; return run.roster.length < ECON.boardMax + ECON.benchMax; }
function buyOffer(run, o, target) {
  if (o.sold) return { ok: false, why: 'Sold out' };
  const p = offerPrice(run, o); if (run.gold < p) return { ok: false, why: 'Not enough gold' };
  if (o.kind === 'hero') {
    if (!canBuyHero(run, o.id)) return { ok: false, why: 'Party full or max tier' };
    run.gold -= p; o.sold = true;
    const owned = run.roster.find(r => r.id === o.id);
    if (owned) { owned.copies++; owned.spent += p; if (owned.copies >= 2 && owned.tier < 2) { owned.tier = 2; run.rankUps = (run.rankUps || 0) + 1; if (run.rerolled) run.rankUpsAfterReroll = (run.rankUpsAfterReroll || 0) + 1; return { ok: true, rankUp: owned }; } return { ok: true }; }
    addHero(run, o.id, { spent: p }); return { ok: true };
  }
  run.gold -= p; o.sold = true; run.stash.push({ id: o.id, wins: 0, paid: p }); return { ok: true };
}
function reroll(run) { if (run.gold < run.rerollCost) return false; run.gold -= run.rerollCost; run.rerollCost++; run.rerolled = true; run.rerollsTotal = (run.rerollsTotal || 0) + 1; rollShop(run); return true; }
function equip(run, ir, rec) { if (rec.items.length >= ECON.slots) return false; const i = run.stash.indexOf(ir); if (i >= 0) run.stash.splice(i, 1); rec.items.push(ir); return true; }
function enterShop(run) { run.rerollCost = 1; run.rerolled = false; rollShop(run); run.phase = 'shop'; }

function startRunFight(run, opts = {}) {
  const enc = encOf(run);
  const units = onBoard(run).map(r => makeHeroUnit(r));
  const F = makeFight(enc, units, { headless: opts.headless, extraElite: run.bargainElite && run.fight < 5, campWard: run.fight === 5 && run.campWard, runGold: run.gold });
  F.isBoss = run.fight === 5; F.doubleGold = run.bargainElite && run.fight < 5;
  return F;
}
function finishFight(run, F) {
  carryBack(F);
  const res = { fight: run.fight, name: encOf(run).name, result: F.result, t: F.t, gold: 0, interest: 0, piggy: 0, heroes: F.units.filter(u => u.side === 'H' && !u.summon).map(u => ({ name: u.name, id: u.id, dmg: u.stat.dmg, heal: u.stat.heal, ward: u.stat.ward, taken: u.stat.taken, alive: u.alive, killedBy: u.killedBy, hp: Math.max(0, u.hp), maxHp: u.maxHp, abDmg: u.stat.abDmg })) };
  const hpLeft = res.heroes.reduce((a, h) => a + h.hp, 0), hpMax = res.heroes.reduce((a, h) => a + h.maxHp, 0);
  res.hpLostPct = hpMax ? 1 - hpLeft / hpMax : 1;
  run.gold += F.gold; res.combatGold = F.gold;
  if (F.result === 'win') {
    res.interest = Math.floor(Math.min(run.gold, ECON.interestCap) / ECON.interestPer);
    res.gold = (F.isBoss ? ECON.boss : ECON.win) * (F.doubleGold ? 2 : 1);
    run.gold += res.gold + res.interest;
    if (!run.piggy.broken) { run.piggy.amt += ECON.piggyPerWin; res.piggy = ECON.piggyPerWin; }
    for (const r of onBoard(run)) for (const ir of r.items) ir.wins = (ir.wins || 0) + 1;
    run.bargainElite = false;
    run.fight++;
    if (F.isBoss) { run.won = true; run.phase = 'rousing'; }
    else if (run.fight === 5) run.phase = 'campfire';
    else run.phase = 'choice';
  } else {
    if (!run.piggy.broken) { run.piggy.broken = true; res.piggyPayout = run.piggy.amt; run.gold += run.piggy.amt; run.piggy.amt = 0; res.freeLoss = true; run.bargainElite = false; run.phase = 'shop-retry'; }
    else { run.over = true; run.phase = 'defeat'; }
  }
  run.history.push(res);
  return res;
}
function drawChoices(run) { const n = run.extraCard ? 3 : 2; run.extraCard = false; return shuffle(CHOICE_DECK).slice(0, n); }
function classItemOffers(run) { const classes = [...new Set(run.roster.map(r => HEROES[r.id].cls))]; const pool = ITEM_LIST.filter(it => it.rar === 'Class' && classes.includes(it.cls)); return shuffle(pool.length >= 2 ? pool : ITEM_LIST.filter(it => it.rar === 'Class')).slice(0, 2); }
function mcOptions(rec) { const cls = HEROES[rec.id].cls; return KW_LIST.filter(k => k !== CLASS_KW[cls]); }
