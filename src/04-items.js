/* ================= 0.22 ITEMS: 46 CANONICAL D&D ITEMS =================
   Structured across 4 rarity tiers (Common -> Uncommon -> Rare -> Very Rare):
     - 8 Common staples (obvious generic D&D gear & +1 weapons, Shield, Leather Armor, Potion, Clockwork Amulet)
     - 24 Class-Keyword items (exactly 2 per class across all 12 classes; implicit keyword interaction, no explicit class labels)
     - 14 Armor Ladder & Archetype Rider items (Breastplate, Plate Armor, Dwarven Plate, plus iconic Rare & Very Rare riders)
   Exact 6-attribute parity: 7 items / +10 modifier (+20 score) each for STR, DEX, CON, INT, WIS, CHA.
   Direct combat stats (Damage, Attack Speed, AC, HP, SR) offered both independently and in disparate pairings.
   All items are always available in the shop & treasure pool regardless of enabled/disabled Hero Packs.
   Attribute bonuses use score deltas (+2 score = +1 modifier).
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
  /* ---------- 1. COMMON STAPLES (2g — Obvious D&D Gear) ---------- */
  longsword_p1: {
    n: '+1 Longsword', r: 0, ic: 'sword', t: 'melee',
    a: { str: 2 },
    s: { dmg: 2 }
  },
  rapier_p1: {
    n: '+1 Rapier', r: 0, ic: 'dagger_fork', t: 'melee',
    a: { dex: 2 },
    s: { haste: 12 }
  },
  longbow_p1: {
    n: '+1 Longbow', r: 0, ic: 'bow', t: 'ranged',
    s: { dmg: 3, haste: 8 }
  },
  wand_war_mage: {
    n: 'Wand of the War Mage', r: 0, ic: 'wand', t: 'ranged',
    a: { int: 2 },
    s: { dmg: 2 }
  },
  shield: {
    n: 'Shield', r: 0, ic: 'shield',
    s: { ac: 1 }
  },
  leather_armor: {
    n: 'Leather Armor', r: 0, ic: 'armor_studs',
    s: { ac: 1, hp: 20 }
  },
  potion_healing: {
    n: 'Potion of Healing', r: 0, ic: 'vial',
    s: { potionHeal: 1 },
    x: 'Automatically drunk the first time holder drops below 50% HP each fight (refills next fight; scales by Act: 2d4+2 / 4d4+4 / 8d4+8 / 10d4+20)'
  },
  clockwork_amulet: {
    n: 'Clockwork Amulet', r: 0, ic: 'amulet',
    s: { clockworkFloor: 1 },
    x: 'Once per fight, first ability roll cannot roll below 10 (never Fizzles or rolls Low)'
  },

  /* ---------- 2. UNCOMMON (3g — 12 Class-Keyword Items + Armor & Utility) ---------- */
  weapon_warning: {
    n: 'Weapon of Warning', r: 1, ic: 'defender', t: 'melee',
    kwHooks: ['action_surge'],
    a: { str: 2 },
    s: { haste: 10, openingSurge: 1 },
    x: 'Opens each fight with an immediate strike that triggers Action Surge'
  },
  periapt_wound_closure: {
    n: 'Periapt of Wound Closure', r: 1, ic: 'amulet_heart',
    kwHooks: ['rage'],
    a: { con: 2 },
    s: { hp: 25, woundRage: 1 },
    x: 'First time holder drops below 50% HP, gains +2 Rage and double Regeneration for 4s'
  },
  sentinel_shield: {
    n: 'Sentinel Shield', r: 1, ic: 'shield_eye',
    kwHooks: ['aura', 'smite'],
    s: { ac: 2, hp: 15, sentinelAura: 1 },
    x: 'Radiates an Aura granting adjacent allies +1 AC and +1 SR (widens existing Auras by +1 square)'
  },
  amulet_devout: {
    n: 'Amulet of the Devout', r: 1, ic: 'holy',
    kwHooks: ['channel_divinity'],
    a: { wis: 2 },
    s: { hp: 15, cdBoost: 0.35, healHolyPulse: 1 },
    x: 'Boosts Channel Divinity potency by +35%; heals and Wards pulse 1d6 Holy damage to the nearest foe'
  },
  bracers_archery: {
    n: 'Bracers of Archery', r: 1, ic: 'bracers',
    kwHooks: ['hunters_mark'],
    a: { dex: 2 },
    s: { haste: 10, markPoison: 1 },
    x: 'Attacks against Hunter’s Mark targets apply 1 stack of Poison'
  },
  cloak_elvenkind: {
    n: 'Cloak of Elvenkind', r: 1, ic: 'cloak',
    kwHooks: ['cunning_action', 'sneak_attack'],
    a: { dex: 2 },
    s: { ac: 1, startStealth: 3, stealthExpose: 1, cloakSneak: 1 },
    x: 'Triggers Cunning Action (Stealth 3s) at fight start; opening attack Exposes and triggers a 1d6 Sneak Attack'
  },
  dragonhide_belt: {
    n: 'Dragonhide Belt', r: 1, ic: 'belt',
    kwHooks: ['ki', 'ki_ability'],
    a: { wis: 2 },
    s: { haste: 12, kw_ki: 1, kw_ki_ability: 1, highKi: 1 },
    x: 'Grants a 4-pip Ki bar firing a Staggering Ki Ability when full (+1 Ki on High rolls)'
  },
  pipes_haunting: {
    n: 'Pipes of Haunting', r: 1, ic: 'lute',
    kwHooks: ['bardic_inspiration'],
    a: { cha: 2 },
    s: { haste: 12, startInsp: 1, inspCharge: 15 },
    x: 'Grants the nearest ally Bardic Inspiration (d6) at fight start; spending Inspiration grants +15% Charge'
  },
  moon_sickle: {
    n: 'Moon Sickle', r: 1, ic: 'scythe', t: 'melee',
    kwHooks: ['wild_shape'],
    a: { wis: 2 },
    s: { hp: 20, moonSickle: 1 },
    x: 'Healing an ally or entering Wild Shape grants +25% Attack Speed and +2 Damage for 4s'
  },
  pearl_power: {
    n: 'Pearl of Power', r: 1, ic: 'orb',
    kwHooks: ['arcane_recovery'],
    a: { int: 2 },
    s: { haste: 12, firstCastRec: 25, arcRecBoost: 0.40 },
    x: 'Triggers Arcane Recovery (+25 Charge) after first cast and boosts Arcane Recovery by +40%'
  },
  bloodwell_vial: {
    n: 'Bloodwell Vial', r: 1, ic: 'vial',
    kwHooks: ['sorcery_points', 'metamagic'],
    a: { cha: 2, int: 2 },
    s: { quickenFirst: 1, startSorcery: 2 },
    x: 'Starts each fight with +2 Sorcery Points and triggers Metamagic (first cast charges at 2× speed)'
  },
  rod_pact_keeper: {
    n: 'Rod of the Pact Keeper', r: 1, ic: 'rod',
    kwHooks: ['hex', 'pact_boon'],
    a: { cha: 2 },
    s: { hp: 20, startHex: 1, pactRestore: 1 },
    x: 'Applies Hex to the farthest foe at fight start; Pact Boon restores 15% HP and +15 Charge'
  },
  breastplate: {
    n: 'Breastplate', r: 1, ic: 'armor_shine',
    s: { ac: 2, hp: 40 }
  },
  bag_holding: {
    n: 'Bag of Holding', r: 1, ic: 'brooch',
    s: { winBonusGold: 1, sellBonus: 1 },
    x: 'Winning a fight grants +1 bonus Gold; while carried, sold stash items refund 150% value'
  },
  luckstone: {
    n: 'Stone of Good Luck', r: 1, ic: 'stone',
    a: { wis: 2 },
    s: { rerollLowOnce: 1 },
    x: 'Rerolls the holder’s first Low ability roll each fight'
  },

  /* ---------- 3. RARE (5g — 8 Class-Keyword Items + Plate & Archetype Riders) ---------- */
  flametongue: {
    n: 'Flame Tongue', r: 2, ic: 'sword_flame', t: 'melee',
    kwHooks: ['action_surge'],
    a: { str: 4 },
    s: { dmg: 3, flameEvery2: 1, flameKwBurn: 1 },
    x: 'Every 2nd strike applies Burn; triggering Action Surge spreads Burn to an adjacent foe'
  },
  berserker_axe: {
    n: 'Berserker Axe', r: 2, ic: 'axe', t: 'melee',
    kwHooks: ['rage'],
    a: { str: 4 },
    s: { dmg: 4, rageDmg: 2, killRage: 1 },
    x: 'Each Rage stack adds +2 flat Damage; killing a foe grants +1 Rage'
  },
  staff_healing: {
    n: 'Staff of Healing', r: 2, ic: 'staff2',
    kwHooks: ['channel_divinity'],
    a: { wis: 4 },
    s: { hp: 25, staffCdHeal: 1 },
    x: 'First time an ally drops below 40% HP each fight, triggers a Channel Divinity heal pulse (2d8 + WIS)'
  },
  oathbow: {
    n: 'Oathbow', r: 2, ic: 'bow', t: 'ranged',
    kwHooks: ['hunters_mark'],
    a: { dex: 4 },
    s: { dmg: 3, markPenPct: 0.30, markCharge: 8, highMarks: 1 },
    x: 'Attacks vs. Hunter’s Mark foes ignore 30% AC and build +8 Charge; High rolls apply Hunter’s Mark'
  },
  dagger_venom: {
    n: 'Dagger of Venom', r: 2, ic: 'dagger_drip', t: 'melee',
    kwHooks: ['sneak_attack'],
    a: { dex: 2 },
    s: { haste: 20, sneakVenom: 1 },
    x: 'Sneak Attack hits apply 2 stacks of Poison and shred −2 AC for 3s'
  },
  horn_valhalla: {
    n: 'Horn of Valhalla', r: 2, ic: 'crown',
    kwHooks: ['bardic_inspiration'],
    a: { cha: 4, con: 2 },
    s: { hp: 30, inspWardHaste: 1 },
    x: 'Whenever an ally spends Bardic Inspiration, they gain an 18 HP Ward and +20% Attack Speed for 3s'
  },
  wand_fireballs: {
    n: 'Wand of Fireballs', r: 2, ic: 'ring_flame', t: 'ranged',
    kwHooks: ['metamagic', 'sorcery_points'],
    a: { cha: 4 },
    s: { dmg: 3, metaFireball: 1 },
    x: 'Every Metamagic trigger (or every 2nd cast) detonates a 1-square Fireball applying Burn'
  },
  staff_withering: {
    n: 'Staff of Withering', r: 2, ic: 'staff_skull',
    kwHooks: ['hex', 'pact_boon'],
    a: { int: 4 },
    s: { hp: 30, hexNecrosis: 6, pactSpreadHex: 1 },
    x: 'Attacks against Hex targets apply 6 Necrosis; Pact Boon spreads Hex to two enemies'
  },
  plate_armor: {
    n: 'Plate Armor', r: 2, ic: 'armor_plate',
    s: { ac: 3, hp: 75 }
  },
  cloak_displacement: {
    n: 'Cloak of Displacement', r: 2, ic: 'cloak_double',
    a: { dex: 4 },
    s: { ac: 2, displaceAlert: 6 },
    x: 'Starts each fight with Alert and refreshes Alert every 6s'
  },
  amulet_health: {
    n: 'Amulet of Health', r: 2, ic: 'gem',
    a: { con: 4 },
    s: { hp: 45, heavyHitRecover: 0.30 },
    x: 'Taking a hit of 15% or more Max HP heals back 30% of that damage over 2s'
  },
  headband: {
    n: 'Headband of Intellect', r: 2, ic: 'circlet',
    a: { int: 4 },
    s: { haste: 15, capToRoll: 1 },
    x: 'When hitting the 1-cast/second cap, excess Charge speed converts into +1 to ability d20 rolls'
  },
  boots_speed: {
    n: 'Boots of Speed', r: 2, ic: 'boots_wing',
    a: { str: 2 },
    s: { haste: 25, ft: 15, openingDouble: 1 },
    x: 'First attack each fight strikes twice'
  },
  ring_spell_storing: {
    n: 'Ring of Spell Storing', r: 2, ic: 'ring',
    a: { int: 2 },
    s: { sr: 2, startCharge: 45 },
    x: 'Starts each fight with 45% ability Charge'
  },

  /* ---------- 4. VERY RARE (7g — 4 Class-Keyword Centerpieces + Iconic Archetype Riders) ---------- */
  sunblade: {
    n: 'Sun Blade', r: 3, ic: 'greatsword', t: 'melee',
    kwHooks: ['smite', 'aura'],
    a: { str: 2, cha: 2 },
    s: { dmg: 3, holyAttacks: 1, kwHolyHeal: 1 },
    x: 'Attacks deal Holy damage (ignoring AC and SR); triggering Smite pulses a heal to allies in your Aura'
  },
  staff_striking: {
    n: 'Staff of Striking', r: 3, ic: 'spear', t: 'melee',
    kwHooks: ['ki', 'ki_ability'],
    a: { wis: 4 },
    s: { haste: 20, kiDoubleStrike: 1 },
    x: 'Every Ki Ability strikes twice and refunds 1 Ki pip'
  },
  staff_woodlands: {
    n: 'Staff of the Woodlands', r: 3, ic: 'ring_leaf',
    kwHooks: ['wild_shape'],
    a: { wis: 4, con: 4 },
    s: { woodlandPulse: 4 },
    x: 'While in Wild Shape (or after first cast), Roots a nearby foe every 4s and heals adjacent allies +15 HP'
  },
  staff_power: {
    n: 'Staff of Power', r: 3, ic: 'staff', t: 'ranged',
    kwHooks: ['arcane_recovery'],
    a: { int: 4 },
    s: { ac: 2, wardOnCast: 16, doubleArcaneRec: 1, nat20Refund: 30 },
    x: 'Casting grants a 16 HP Ward; doubles Arcane Recovery Charge and Nat 20s refund 30% Charge'
  },
  dwarven_plate: {
    n: 'Dwarven Plate', r: 3, ic: 'armor_spikes',
    a: { con: 2 },
    s: { ac: 4, hp: 110, pushRes: 1, meleeReflect: 0.15 },
    x: 'Immune to push and knockback; reflects 15% of melee damage taken back at the attacker'
  },
  scimitar_speed: {
    n: 'Scimitar of Speed', r: 3, ic: 'scimitar', t: 'melee',
    a: { dex: 4 },
    s: { haste: 30, every3Strike: 1 },
    x: 'Every 3rd attack triggers an immediate bonus strike'
  },
  frost_brand: {
    n: 'Frost Brand', r: 3, ic: 'sword_frost', t: 'melee',
    a: { str: 4, con: 2 },
    s: { dmg: 4, sr: 2, chillOnHit: 1 },
    x: 'Attacks Chill targets (−15% Attack Speed for 2s)'
  },
  robe_stars: {
    n: 'Robe of Stars', r: 3, ic: 'cloak_star',
    a: { cha: 4 },
    s: { hp: 40, sr: 2, starBolt: 1 },
    x: 'High and Nat 20 ability rolls fire a 2d6 Holy star bolt at the lowest-HP foe'
  },
  ring_regeneration: {
    n: 'Ring of Regeneration', r: 3, ic: 'bands',
    a: { con: 4 },
    s: { hp: 40, pctRegen: 0.04, cleanseEvery: 2 },
    x: 'Regenerates 4% Max HP per second and cleanses 1 Burn or Poison stack every 2s'
  }
};

/* All items are always in the global shop & treasure pool regardless of enabled Hero Packs */
const CORE_ITEM_KEYS = Object.keys(ITEMS);
const ITEM_ORDER = Object.keys(ITEMS).sort((a, b) => ITEMS[a].r - ITEMS[b].r);
const itemKwHooks = k => (ITEMS[k] && ITEMS[k].kwHooks) || [];
const favFor = () => false; // Replaced by implicit Class Keyword hooks (no explicit Favoured Class tags)

/* Item text with attributes, direct combat stats (Damage, Attack Speed, AC, HP, SR, Speed), and rider */
function itemText(k) {
  const it = ITEMS[k];
  if (!it) return '';
  const stats = [];
  Object.entries(it.a || {}).forEach(([s, v]) => stats.push(`+${v / 2} ${ATTR_N[s]}`));
  const st = it.s || {};
  if (st.dmg) stats.push(`+${st.dmg} Damage`);
  if (st.haste) stats.push(`+${st.haste}% Attack Speed`);
  if (st.ac) stats.push(`+${st.ac} AC`);
  if (st.hp) stats.push(`+${st.hp} HP`);
  if (st.sr) stats.push(`+${st.sr} SR`);
  if (st.ft) stats.push(`+${st.ft} ft Speed`);
  const parts = [];
  if (stats.length) parts.push(stats.join(', '));
  if (it.x) parts.push(it.x);
  const pre = it.t === 'melee' ? 'Melee weapon. ' : it.t === 'ranged' ? 'Ranged weapon. ' : '';
  const body = parts.join('; ');
  return pre + body + (body && !/[.]$/.test(body) ? '.' : '');
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
  'holyAttacks', 'quickenFirst', 'rerollLowOnce', 'clockworkFloor', 'clockworkHigh', 'capToRoll',
  'flameEvery2', 'flameSpread', 'flameKwBurn', 'highMarks', 'surgeArrow',
  'doubleArcaneRec', 'highSorcery', 'pactHeal', 'highPulseHeal', 'kwHolyHeal',
  'potionHeal', 'highBurnBurst', 'healHolyPulse', 'sellBonus',
  'stealthExpose', 'startStealth', 'cloakSneak', 'highKi',
  'openingSurge', 'woundRage', 'sentinelAura', 'startInsp', 'moonSickle',
  'startHex', 'pactRestore', 'killRage', 'staffCdHeal', 'sneakVenom',
  'inspWardHaste', 'metaFireball', 'pactSpreadHex', 'displaceAlert',
  'openingDouble', 'kiDoubleStrike', 'woodlandPulse', 'every3Strike',
  'chillOnHit', 'starBolt', 'cleanseEvery'
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
