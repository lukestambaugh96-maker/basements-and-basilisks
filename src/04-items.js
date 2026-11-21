/* ================= 0.22 ITEMS: 3 PACK ITEMS + 10 CORE SHOP ITEMS =================
   Organized into the 4 v0.22 buckets from the Systems Handoff:
     1. Pack Items (unlocked when drafting their Pack): Potion of Healing, Whetstone of the Hunt, Ember-Iron Bracers
     2. Classic D&D Weapons (Melee/Ranged locked + Favoured Class bonus): Flametongue, Oathbow, Staff of Power, Sunblade
     3. Multiclass Energy Items: Amulet of the Devout, Metamagic Rod (Quicken), Dragonhide Belt
     4. d20 / INT / WIS Lever Items: Stone of Good Luck, Clockwork Amulet, Headband of Intellect
   Attribute bonuses use score deltas (+2 score = +1 modifier, matching 0.21 attrRow display).
*/

const RARITY = [
  { n: 'Common',    col: '#4d483d' },
  { n: 'Uncommon',  col: '#226d3a' },
  { n: 'Rare',      col: '#12477d' },
  { n: 'Very Rare', col: '#4b127d' },
  { n: 'Legendary', col: '#8a4a0e', reserved: 1 }
];

const SOLVE = {
  armor: 'High AC foes', spell: 'High SR foes', swarm: 'Swarms',
  elite: 'Elites and bosses', necrosis: 'Necrosis', control: 'Stuns and roots',
  burst: 'Burst damage', fire: 'Fire and Burn', sustain: 'Long fights'
};

const ITEMS = {
  /* ---------- 1. PACK ITEMS (unlocked by drafting their Pack) ---------- */
  potion_healing: {
    n: 'Potion of Healing', r: 0, ic: 'vial', packOnly: 'tavern',
    s: { potionHeal: 1 },
    x: 'Automatically drunk the first time holder drops below 50% HP each fight (refills next fight; scales by Act: 2d4+2 / 4d4+4 / 8d4+8 / 10d4+20)'
  },
  whetstone: {
    n: 'Whetstone of the Hunt', r: 1, ic: 'stone', packOnly: 'campfire',
    kwHooks: ['hunters_mark'],
    a: { dex: 2 },
    s: { markPoison: 1 },
    x: 'Attacks against Hunter’s Mark targets apply 1 stack of Poison'
  },
  ember_bracers: {
    n: 'Ember-Iron Bracers', r: 1, ic: 'bracers', packOnly: 'beaten',
    a: { con: 2 },
    s: { highBurnBurst: 1 },
    x: 'Whenever the holder lands a High or Nat 20 ability roll, deal a burst of Burn to adjacent enemies'
  },
  sunlit_censer: {
    n: 'Sunlit Censer', r: 1, ic: 'holy', packOnly: 'divine',
    kwHooks: ['channel_divinity', 'smite'],
    a: { wis: 2 },
    s: { healHolyPulse: 1 },
    x: 'Whenever the holder heals or Wards an ally, pulse 1d6 Holy damage to the nearest enemy'
  },
  merchants_scales: {
    n: 'Merchant’s Scales', r: 1, ic: 'brooch', packOnly: 'market',
    a: { cha: 2 },
    s: { winBonusGold: 1, sellBonus: 1 },
    x: 'Winning a fight grants +1 bonus Gold; while carried, sold stash items refund 150% value'
  },
  cloak_elvenkind: {
    n: 'Cloak of Elvenkind', r: 1, ic: 'cloak', packOnly: 'surprise',
    kwHooks: ['cunning_action', 'sneak_attack'],
    a: { dex: 2 },
    s: { startStealth: 3, stealthExpose: 1, cloakSneak: 1 },
    x: 'Triggers Cunning Action (Stealth 3s) at fight start; opening attack Exposes and triggers a 1d6 Sneak Attack'
  },

  /* ---------- 2. CLASSIC D&D WEAPONS (Favoured Class bonuses & Class Keyword hooks) ---------- */
  flametongue: {
    n: 'Flametongue', r: 2, ic: 'sword_flame', t: 'melee',
    kwHooks: ['action_surge', 'smite'],
    a: { str: 4 },
    s: { flameEvery2: 1 },
    x: 'Every 2nd strike applies Burn',
    fav: { cls: ['Fighter', 'Paladin'], s: { flameEvery2: 1, flameSpread: 1, flameKwBurn: 1 }, x: 'Triggering Action Surge or Smite spreads Burn to an adjacent foe' }
  },
  oathbow: {
    n: 'Oathbow', r: 2, ic: 'bow', t: 'ranged',
    kwHooks: ['hunters_mark', 'action_surge'],
    a: { dex: 4 },
    s: { markPenPct: 0.30, markCharge: 8 },
    x: 'Attacks vs. Hunter’s Mark foes ignore 30% AC and build +8 Charge',
    fav: { cls: ['Ranger', 'Fighter'], s: { markPenPct: 0.30, markCharge: 8, highMarks: 1, surgeArrow: 1 }, x: 'High rolls apply Hunter’s Mark; Action Surge looses a bonus piercing arrow' }
  },
  staff_power: {
    n: 'Staff of Power', r: 2, ic: 'staff', t: 'ranged',
    kwHooks: ['arcane_recovery', 'sorcery_points', 'pact_boon'],
    a: { int: 4 },
    s: { wardOnCast: 12 },
    x: 'Casting grants a small Ward',
    fav: { cls: ['Wizard', 'Sorcerer', 'Warlock'], s: { wardOnCast: 12, nat20Refund: 30, doubleArcaneRec: 1, highSorcery: 1, pactHeal: 1 }, x: 'Doubles Arcane Recovery Charge, grants +1 Sorcery Point on High/Nat 20, and heals on Pact Boon' }
  },
  sunblade: {
    n: 'Sunblade', r: 2, ic: 'greatsword', t: 'melee',
    kwHooks: ['smite', 'channel_divinity'],
    a: { str: 2, wis: 2 },
    s: { holyAttacks: 1 },
    x: 'Attacks deal Holy damage (ignoring AC and SR)',
    fav: { cls: ['Cleric', 'Paladin'], s: { holyAttacks: 1, highPulseHeal: 1, kwHolyHeal: 1 }, x: 'Triggering Smite or Channel Divinity pulses a heal to nearby allies' }
  },

  /* ---------- 3. MULTICLASS ENERGY ITEMS (Grant or Amplify Class Keywords!) ---------- */
  amulet_devout: {
    n: 'Amulet of the Devout', r: 1, ic: 'holy',
    kwHooks: ['smite', 'channel_divinity'],
    a: { cha: 2 },
    s: { devoutSmite: 5, cdBoost: 0.35 },
    x: 'Every 5s, next attack triggers a Smite (2d6 Holy); boosts Channel Divinity potency by +35%'
  },
  metarod_quicken: {
    n: 'Metamagic Rod (Quicken)', r: 1, ic: 'rod',
    kwHooks: ['metamagic', 'sorcery_points'],
    a: { int: 4 },
    s: { quickenFirst: 1, startSorcery: 2 },
    x: 'Triggers Metamagic (first ability cast charges at 2× speed) and grants +2 starting Sorcery Points'
  },
  dragonhide_belt: {
    n: 'Dragonhide Belt', r: 1, ic: 'belt',
    kwHooks: ['ki', 'ki_ability'],
    a: { dex: 2, wis: 2 },
    s: { kw_ki: 1, kw_ki_ability: 1, highKi: 1 },
    x: 'Grants a 4-pip Ki bar + Ki Ability (Stagger strike); Monks also gain +1 Ki on High rolls'
  },

  /* ---------- 4. d20 / INT / WIS LEVER ITEMS ---------- */
  luckstone: {
    n: 'Stone of Good Luck', r: 1, ic: 'stone',
    a: { wis: 2 },
    s: { rerollLowOnce: 1 },
    x: 'Rerolls the holder’s first Low ability roll each fight'
  },
  clockwork_amulet: {
    n: 'Clockwork Amulet', r: 2, ic: 'amulet',
    a: { int: 4 },
    s: { clockworkHigh: 1 },
    x: 'Once per fight, guarantees a High roll instead of rolling the d20'
  },
  headband: {
    n: 'Headband of Intellect', r: 2, ic: 'circlet',
    a: { int: 6 },
    s: { capToRoll: 1 },
    x: 'When hitting the 1-cast/second cap, excess Charge speed converts into +1 to ability d20 rolls'
  }
};

const CORE_ITEM_KEYS = Object.keys(ITEMS).filter(k => !ITEMS[k].packOnly);
const ITEM_ORDER = Object.keys(ITEMS).sort((a, b) => ITEMS[a].r - ITEMS[b].r);
const itemKwHooks = k => (ITEMS[k] && ITEMS[k].kwHooks) || [];

/* Favoured Class clones (`key@fav`) read transparently by heroStats() */
const favFor = (k, heroKey) => {
  const it = ITEMS[k];
  return !!(it && it.fav && H[heroKey] && it.fav.cls.includes(H[heroKey].cls));
};
Object.keys(ITEMS).forEach(k => {
  const it = ITEMS[k];
  if (!it.fav) return;
  ITEMS[k + '@fav'] = { ...it, s: { ...it.s, ...it.fav.s }, favOf: k };
});

/* Item text with attribute summary, melee/ranged tag, and Favoured Class note */
function itemText(k) {
  const it = ITEMS[k];
  if (!it) return '';
  const parts = Object.entries(it.a || {}).map(([s, v]) => `+${v / 2} ${ATTR_N[s]}`);
  if (it.x) parts.push(it.x);
  const pre = it.t === 'melee' ? 'Melee weapon. ' : it.t === 'ranged' ? 'Ranged weapon. ' : '';
  const body = parts.join('; ');
  const fv = it.fav ? ` Favoured (${it.fav.cls.join(', ')}): ${it.fav.x}.` : '';
  return pre + body + (body && !/[.]$/.test(body) ? '.' : '') + fv;
}

/* Carrying items: 1 slot per tier up to 4 (+1 slot for Wallaby's quest or Zoe's Tier IV Just the Thing!) */
const MAX_ITEMS = 4;
const slotsOf = (tOrHero) => {
  if (typeof tOrHero === 'object' && tOrHero) {
    const base = Math.max(1, Math.min(MAX_ITEMS, tOrHero.tier || 1));
    const bonus = ((tOrHero.key === 'wallaby' && tOrHero.questDone) || (tOrHero.key === 'zoe' && tOrHero.path === 'just_the_thing' && (tOrHero.tier || 1) >= 4)) ? 1 : 0;
    return Math.min(MAX_ITEMS + 1, base + bonus);
  }
  return Math.max(1, Math.min(MAX_ITEMS, tOrHero || 1));
};

const itemType = k => ITEMS[k] && ITEMS[k].t;
function canCarry(heroOrKey, k) {
  const t = itemType(k);
  if (!t) return true;
  if (typeof heroOrKey === 'object' && heroOrKey) {
    if (heroOrKey.key === 'wallaby' && heroOrKey.questDone) return true; // Use Magic Device!
    const r = H[heroOrKey.key].rng;
    return t === 'melee' ? r <= 2 : r >= 3;
  }
  const r = H[heroOrKey].rng;
  return t === 'melee' ? r <= 2 : r >= 3;
}

const ITEM_MAX = new Set([
  'pushRes', 'freeAct', 'burnImm', 'deathWard', 'displace', 'bigArea',
  'holyAttacks', 'quickenFirst', 'rerollLowOnce', 'clockworkHigh', 'capToRoll',
  'flameEvery2', 'flameSpread', 'flameKwBurn', 'highMarks', 'surgeArrow',
  'doubleArcaneRec', 'highSorcery', 'pactHeal', 'highPulseHeal', 'kwHolyHeal',
  'potionHeal', 'highBurnBurst', 'healHolyPulse', 'sellBonus',
  'stealthExpose', 'startStealth', 'cloakSneak', 'highKi'
]);
const ITEM_MUL = new Set(['poisonX']);

function combineItems(keys) {
  const list = (keys || []).map(k => ITEMS[k]).filter(Boolean);
  if (!list.length) return null;
  if (list.length === 1) return list[0];
  const a = {}, s = {}, set = {};
  list.forEach(it => {
    Object.entries(it.a || {}).forEach(([k, v]) => a[k] = (a[k] || 0) + v);
    Object.entries(it.set || {}).forEach(([k, v]) => set[k] = Math.max(set[k] || 0, v));
    Object.entries(it.s || {}).forEach(([k, v]) => {
      if (Array.isArray(v)) s[k] = [...(s[k] || []), ...v];
      else if (typeof v === 'object') {
        const o = s[k] ? { ...s[k] } : {};
        Object.entries(v).forEach(([f, x]) => o[f] = f === 'r' ? Math.max(o[f] || 0, x) : (o[f] || 0) + x);
        s[k] = o;
      } else if (ITEM_MUL.has(k)) s[k] = (s[k] || 1) * v;
      else if (ITEM_MAX.has(k)) s[k] = Math.max(s[k] || 0, v);
      else s[k] = (s[k] || 0) + v;
    });
  });
  return { n: list.map(i => i.n).join(', '), r: Math.max(...list.map(i => i.r)), a, s, set, combined: 1 };
}
