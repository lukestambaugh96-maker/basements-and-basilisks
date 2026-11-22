/* ================= 0.23 ITEMS: 82 CANONICAL D&D ITEMS ACROSS 6 TIERS =================
   - 58 Universal Standard Playstyle Items (Standard Shop & Treasure):
       r=0 Common    (12 items,  2g): 1 minor stat, 0 effect text (also Zoe's Rummage pool)
       r=1 Uncommon  (14 items,  3g): 2 different stats, 0 effect text
       r=2 Rare      (12 items,  4g): Larger stat + 1 concise minor effect (max 1d4 on-hit)
       r=3 Very Rare (12 items,  6g): Upper-end stats + 1 crisp endgame build-enabler
       r=4 Legendary  (8 items, 10g): Top stats + 1 iconic gamebreaking artifact effect
     EXACT Per-Tier 6-Attribute Parity (score deltas; +2 score = +1 modifier):
       Common +1 | Uncommon +2 | Rare +3 | Very Rare +4 | Legendary +6  =>  +16 each!
   - 24 Unique Class-Keyword Items (r=5, 5g, Curio Merchant map node only):
       Exact 2 per class across all 12 classes (1 Trigger/Resource + 1 Modifier).
   All 58 Standard items are always unlocked regardless of enabled/disabled Hero Packs.
*/

const RARITY = [
  { n: 'Common',    col: '#4d483d', cost: 2 },
  { n: 'Uncommon',  col: '#226d3a', cost: 3 },
  { n: 'Rare',      col: '#12477d', cost: 4 },
  { n: 'Very Rare', col: '#4b127d', cost: 6 },
  { n: 'Legendary', col: '#8a4a0e', cost: 10 },
  { n: 'Unique',    col: '#1b7a78', cost: 5, curioOnly: 1 }
];

const SOLVE = {
  armor: 'High AC foes', spell: 'High SR foes', swarm: 'Swarms',
  elite: 'Elites and bosses', necrosis: 'Necrosis', control: 'Stuns and roots',
  burst: 'Burst damage', fire: 'Fire and Burn', sustain: 'Long fights'
};

const ITEMS = {
  /* ==========================================================================
     A. COMMON TIER — 12 ITEMS (2g, 1 Minor Stat, Zero Effect Text)
        Attribute Parity: STR +1 · DEX +1 · CON +1 · INT +1 · WIS +1 · CHA +1
     ========================================================================== */
  stone_str: {
    n: 'Stone of Strength', r: 0, ic: 'stone',
    a: { str: 2 }, s: {}
  },
  stone_dex: {
    n: 'Stone of Dexterity', r: 0, ic: 'stone',
    a: { dex: 2 }, s: {}
  },
  stone_con: {
    n: 'Stone of Constitution', r: 0, ic: 'stone',
    a: { con: 2 }, s: {}
  },
  stone_int: {
    n: 'Stone of Intelligence', r: 0, ic: 'stone',
    a: { int: 2 }, s: {}
  },
  stone_wis: {
    n: 'Stone of Wisdom', r: 0, ic: 'stone',
    a: { wis: 2 }, s: {}
  },
  stone_cha: {
    n: 'Stone of Charisma', r: 0, ic: 'stone',
    a: { cha: 2 }, s: {}
  },
  weapon_p1: {
    n: '+1 Weapon', r: 0, ic: 'sword',
    s: { dmg: 2 }
  },
  gloves_quickness: {
    n: 'Gloves of Quickness', r: 0, ic: 'gloves',
    s: { haste: 12 }
  },
  shield: {
    n: 'Shield', r: 0, ic: 'shield',
    s: { ac: 1 }
  },
  cloak_protection: {
    n: 'Cloak of Protection', r: 0, ic: 'cloak',
    s: { sr: 1 }
  },
  leather_armor: {
    n: 'Leather Armor', r: 0, ic: 'armor_studs',
    s: { hp: 25 }
  },
  ring_warmth: {
    n: 'Ring of Warmth', r: 0, ic: 'ring_flame',
    s: { regen: 1.5 }
  },

  /* ==========================================================================
     B. UNCOMMON TIER — 14 ITEMS (3g, 2 Different Stats, Zero Effect Text)
        Attribute Parity: STR +2 · DEX +2 · CON +2 · INT +2 · WIS +2 · CHA +2
     ========================================================================== */
  breastplate: {
    n: 'Breastplate', r: 1, ic: 'armor',
    s: { ac: 2, hp: 35 }
  },
  mantle_spell_resistance: {
    n: 'Mantle of Spell Resistance', r: 1, ic: 'cloak_star',
    s: { sr: 2, hp: 30 }
  },
  gauntlets_ogre: {
    n: 'Gauntlets of Ogre Power', r: 1, ic: 'gloves',
    a: { str: 2 }, s: { pen: 2 }
  },
  boots_striding: {
    n: 'Boots of Striding', r: 1, ic: 'boots',
    a: { str: 2 }, s: { haste: 15 }
  },
  boots_elvenkind: {
    n: 'Boots of Elvenkind', r: 1, ic: 'boots_wing',
    a: { dex: 2 }, s: { evasion: 0.10 }
  },
  gloves_thievery: {
    n: 'Gloves of Thievery', r: 1, ic: 'gloves',
    a: { dex: 2 }, s: { dmg: 2 }
  },
  belt_dwarvenkind: {
    n: 'Belt of Dwarvenkind', r: 1, ic: 'belt',
    a: { con: 2 }, s: { regen: 2 }
  },
  ring_protection: {
    n: 'Ring of Protection', r: 1, ic: 'ring',
    a: { con: 2 }, s: { ac: 1 }
  },
  wand_magic_missiles: {
    n: 'Wand of Magic Missiles', r: 1, ic: 'wand', t: 'ranged',
    a: { int: 2 }, s: { spen: 2 }
  },
  ring_mind_shielding: {
    n: 'Ring of Mind Shielding', r: 1, ic: 'ring_wing',
    a: { int: 2 }, s: { haste: 15 }
  },
  goggles_night: {
    n: 'Goggles of Night', r: 1, ic: 'goggles',
    a: { wis: 2 }, s: { pen: 2 }
  },
  gem_brightness: {
    n: 'Gem of Brightness', r: 1, ic: 'gem',
    a: { wis: 2 }, s: { crPct: 15 }
  },
  brooch_shielding: {
    n: 'Brooch of Shielding', r: 1, ic: 'brooch',
    a: { cha: 2 }, s: { crPct: 15 }
  },
  circlet_blasting: {
    n: 'Circlet of Blasting', r: 1, ic: 'circlet',
    a: { cha: 2 }, s: { spen: 2 }
  },

  /* ==========================================================================
     C. RARE TIER — 12 ITEMS (4g, Larger Stat + 1 Concise Minor Effect)
        Attribute Parity: STR +3 · DEX +3 · CON +3 · INT +3 · WIS +3 · CHA +3
     ========================================================================== */
  plate_armor: {
    n: 'Plate Armor', r: 2, ic: 'armor_plate',
    s: { ac: 2, hp: 60, pushRes: 1 },
    x: 'Immune to push and knockback.'
  },
  sword_sharpness: {
    n: 'Sword of Sharpness', r: 2, ic: 'sword', t: 'melee',
    a: { str: 4 },
    s: { pen: 2, onHit: [{ t: 'bonus', d: [1, 4], kind: 'phys', ty: 'slashing' }] },
    x: 'Basic attacks deal +1d4 bonus slashing damage.'
  },
  boots_speed: {
    n: 'Boots of Speed', r: 2, ic: 'boots_wing',
    a: { str: 2 },
    s: { haste: 20, openingDouble: 1 },
    x: 'First basic attack each fight strikes twice.'
  },
  vicious_bow: {
    n: 'Vicious Bow', r: 2, ic: 'bow', t: 'ranged',
    a: { dex: 4 },
    s: { dmg: 2, onHit: [{ t: 'bonus', d: [1, 4], kind: 'phys', ty: 'piercing' }] },
    x: 'Basic attacks deal +1d4 bonus piercing damage.'
  },
  cloak_displacement: {
    n: 'Cloak of Displacement', r: 2, ic: 'cloak_double',
    a: { dex: 2 },
    s: { evasion: 0.15, evadeCharge: 10 },
    x: 'Evading an attack grants +10 Charge (1s CD).'
  },
  amulet_health: {
    n: 'Amulet of Health', r: 2, ic: 'amulet_heart',
    a: { con: 4 },
    s: { hp: 40, lowDoubleRegen: 1 },
    x: 'While below 50% HP, double your HP Regen.'
  },
  potion_healing: {
    n: 'Potion of Greater Healing', r: 2, ic: 'vial',
    a: { con: 2 },
    s: { hp: 20, potionHeal: 1 },
    x: 'Auto-drinks below 50% HP each fight to heal 25% Max HP and cleanse Burn/Poison.'
  },
  ring_spell_storing: {
    n: 'Ring of Spell Storing', r: 2, ic: 'ring',
    a: { int: 4 },
    s: { crPct: 10, startCharge: 30 },
    x: 'Start every fight with +30 Charge.'
  },
  wand_web: {
    n: 'Wand of Web', r: 2, ic: 'wand_web', t: 'ranged',
    a: { int: 2, wis: 2 },
    s: { firstCastRoot: 2 },
    x: 'First ability cast each fight Roots the target for 2s.'
  },
  stone_good_luck: {
    n: 'Stone of Good Luck', r: 2, ic: 'stone',
    a: { wis: 4 },
    s: { sr: 1, rerollLowOnce: 1 },
    x: 'Reroll your first Low ability roll each fight.'
  },
  glamoured_leather: {
    n: 'Glamoured Studded Leather', r: 2, ic: 'armor_shine',
    a: { cha: 4 },
    s: { ac: 1, startEvasion: 0.20, startEvasionDur: 4 },
    x: 'Start every fight with +20% Evasion for 4s.'
  },
  bag_holding: {
    n: 'Bag of Holding', r: 2, ic: 'bag',
    a: { cha: 2 },
    s: { hp: 25, bagGold: 1, sellMult: 1.25 },
    x: 'Winning grants +1 Gold (max 1); sold stash items refund 125%.'
  },

  /* ==========================================================================
     D. VERY RARE TIER — 12 ITEMS (6g, Upper-End Stats + 1 Endgame Enabler)
        Attribute Parity: STR +4 · DEX +4 · CON +4 · INT +4 · WIS +4 · CHA +4
     ========================================================================== */
  dwarven_plate: {
    n: 'Dwarven Plate', r: 3, ic: 'armor_spikes',
    a: { con: 4 },
    s: { ac: 3, hp: 90, meleeReflect: 0.20 },
    x: 'Reflects 20% of melee damage taken back at the attacker.'
  },
  ring_regeneration: {
    n: 'Ring of Regeneration', r: 3, ic: 'ring_leaf',
    a: { con: 4 },
    s: { hp: 50, regen: 4, cleanseEvery: 2 },
    x: 'Cleanses 1 Burn or Poison stack every 2s.'
  },
  belt_fire_giant: {
    n: 'Belt of Fire Giant Strength', r: 3, ic: 'belt',
    a: { str: 4 },
    s: { pen: 4, dmg: 3, meleeCleave: 0.30 },
    x: 'Melee basic attacks cleave 30% damage to adjacent foes.'
  },
  frost_brand: {
    n: 'Frost Brand', r: 3, ic: 'sword_frost', t: 'melee',
    a: { str: 4 },
    s: { sr: 3, dmg: 3, staggerOnHit: 1 },
    x: 'Basic attacks Stagger targets (−30% Attack Speed, 2s).'
  },
  scimitar_speed: {
    n: 'Scimitar of Speed', r: 3, ic: 'scimitar', t: 'melee',
    a: { dex: 4 },
    s: { haste: 30, every3Strike: 1 },
    x: 'Every 3rd basic attack strikes twice.'
  },
  ring_evasion: {
    n: 'Ring of Evasion', r: 3, ic: 'ring_wing',
    a: { dex: 4 },
    s: { evasion: 0.20, firstAbilHalf: 1 },
    x: 'First enemy ability that hits you each fight deals 50% less damage.'
  },
  staff_power: {
    n: 'Staff of Power', r: 3, ic: 'staff', t: 'ranged',
    a: { int: 4 },
    s: { spen: 3, wardOnCastPct: 0.15 },
    x: 'Casting an ability grants a Ward equal to 15% Max HP (1s CD).'
  },
  headband_intellect: {
    n: 'Headband of Intellect', r: 3, ic: 'circlet',
    a: { int: 4 },
    s: { crPct: 20, haste: 15, capToRoll: 1 },
    x: 'Excess Charge past 1 cast/sec adds +1 to your next ability d20 roll.'
  },
  tome_understanding: {
    n: 'Tome of Understanding', r: 3, ic: 'book',
    a: { wis: 4 },
    s: { sr: 2, hp: 30, shareD20Floor: 1 },
    x: 'Adjacent allies inherit your minimum natural d20 roll floor.'
  },
  cloak_arachnida: {
    n: 'Cloak of Arachnida', r: 3, ic: 'cloak',
    a: { wis: 4 },
    s: { haste: 15, poisonOnHit: 2 },
    x: 'Basic attacks apply 2 Poison (1s CD).'
  },
  robe_stars: {
    n: 'Robe of Stars', r: 3, ic: 'cloak_star',
    a: { cha: 4 },
    s: { sr: 2, hp: 35, starBolt: 1 },
    x: 'High and Nat 20 rolls fire a 2d6 Radiant bolt at the lowest-HP foe.'
  },
  staff_fire: {
    n: 'Staff of Fire', r: 3, ic: 'staff2', t: 'ranged',
    a: { cha: 4 },
    s: { spen: 3, staffFireBurn: 1 },
    x: 'Ability hits apply 4 Burn (1s CD).'
  },

  /* ==========================================================================
     E. LEGENDARY TIER — 8 ITEMS (10g, Borderline-Gamebreaking Artifacts)
        Attribute Parity: STR +6 · DEX +6 · CON +6 · INT +6 · WIS +6 · CHA +6
     ========================================================================== */
  belt_storm_giant: {
    n: 'Belt of Storm Giant Strength', r: 4, ic: 'belt',
    a: { str: 8 },
    s: { dmg: 6, pen: 5, stormCleave: 1 },
    x: 'Melee attacks cleave adjacent foes and Stun for 0.5s (1.5s CD).'
  },
  vorpal_sword: {
    n: 'Vorpal Sword', r: 4, ic: 'greatsword', t: 'melee',
    a: { dex: 6 },
    s: { haste: 30, pen: 4, vorpalExec: 0.20 },
    x: 'Basic attacks execute enemies below 20% HP.'
  },
  armor_invulnerability: {
    n: 'Armor of Invulnerability', r: 4, ic: 'armor_plate',
    a: { con: 6 },
    s: { ac: 3, sr: 3, hp: 120, invulnSec: 4 },
    x: 'Take 0 damage for the first 4 seconds of combat.'
  },
  blackrazor: {
    n: 'Blackrazor', r: 4, ic: 'sword_drop', t: 'melee',
    a: { str: 4, con: 6 },
    s: { dmg: 4, blackrazorKill: 1 },
    x: 'Kills grant 35% Max HP as Ward and +25% Attack Speed for the fight.'
  },
  staff_magi: {
    n: 'Staff of the Magi', r: 4, ic: 'staff', t: 'ranged',
    a: { int: 6, wis: 6 },
    s: { spen: 4, castChargeRefund: 40 },
    x: 'Ability casts refund 40% Charge.'
  },
  robe_archmagi: {
    n: 'Robe of the Archmagi', r: 4, ic: 'cloak_star',
    a: { int: 6, cha: 6 },
    s: { sr: 3, evasion: 0.15, permAdvantage: 1 },
    x: 'Your ability d20 rolls have permanent Advantage.'
  },
  luck_blade: {
    n: 'Luck Blade', r: 4, ic: 'sword_twin', t: 'melee',
    a: { dex: 6, wis: 6 },
    s: { evasion: 0.20, critThreshold: 18 },
    x: 'Natural 18–20 all count as Nat 20s.'
  },
  holy_avenger: {
    n: 'Holy Avenger', r: 4, ic: 'shield_star', t: 'melee',
    a: { cha: 6 },
    s: { dmg: 4, ac: 2, sr: 2, holyAvenger: 1 },
    x: 'All attacks and abilities add +2d6 Radiant and heal adjacent allies (1s CD).'
  },

  /* ==========================================================================
     F. UNIQUE TIER — 24 CLASS-KEYWORD ITEMS (5g, Curio Merchant Map Node Only)
        Exact 2 per class (1 Trigger/Resource Gain + 1 Modifier)
     ========================================================================== */
  // Fighter · Action Surge
  weapon_warning: {
    n: 'Weapon of Warning', r: 5, ic: 'defender', t: 'melee',
    kwHooks: ['action_surge'], cls: 'Fighter', uKind: 'Trigger',
    a: { str: 2 }, s: { haste: 12, every5Surge: 1 },
    x: 'Every 5th basic attack triggers Action Surge.'
  },
  flame_tongue: {
    n: 'Flame Tongue', r: 5, ic: 'sword_flame', t: 'melee',
    kwHooks: ['action_surge'], cls: 'Fighter', uKind: 'Modifier',
    a: { str: 4 }, s: { dmg: 2, surgeFire: 1 },
    x: 'Your Action Surge also deals +2d6 Fire and applies Burn.'
  },
  // Barbarian · Rage
  periapt_wound_closure: {
    n: 'Periapt of Wound Closure', r: 5, ic: 'amulet_heart',
    kwHooks: ['rage'], cls: 'Barbarian', uKind: 'Trigger',
    a: { con: 2 }, s: { regen: 2, woundRage: 1 },
    x: 'First time dropping below 50% HP, trigger Rage.'
  },
  berserker_axe: {
    n: 'Berserker Axe', r: 5, ic: 'axe', t: 'melee',
    kwHooks: ['rage'], cls: 'Barbarian', uKind: 'Modifier',
    a: { str: 4 }, s: { dmg: 3, rageCleave: 0.40 },
    x: 'While Raging, melee attacks cleave 40% damage to adjacent foes.'
  },
  // Paladin · Smite
  holy_symbol_ravenkind: {
    n: 'Holy Symbol of Ravenkind', r: 5, ic: 'holy',
    kwHooks: ['smite'], cls: 'Paladin', uKind: 'Trigger',
    a: { str: 2, cha: 2 }, s: { highSmite: 1 },
    x: 'High ability rolls trigger a free Smite on your target.'
  },
  sun_blade: {
    n: 'Sun Blade', r: 5, ic: 'sword_flame', t: 'melee',
    kwHooks: ['smite'], cls: 'Paladin', uKind: 'Modifier',
    a: { str: 2, wis: 2 }, s: { dmg: 3, smiteSun: 1 },
    x: 'Holder’s Smites deal +1d8 Radiant and heal adjacent allies (1s CD).'
  },
  // Cleric · Channel Divinity
  amulet_devout: {
    n: 'Amulet of the Devout', r: 5, ic: 'amulet',
    kwHooks: ['channel_divinity'], cls: 'Cleric', uKind: 'Trigger',
    a: { wis: 2 }, s: { sr: 1, firstHighResetCD: 1 },
    x: 'Your first High roll each fight resets Channel Divinity.'
  },
  staff_healing: {
    n: 'Staff of Healing', r: 5, ic: 'staff2',
    kwHooks: ['channel_divinity'], cls: 'Cleric', uKind: 'Modifier',
    a: { wis: 4 }, s: { hp: 25, cdWardPct: 0.20 },
    x: 'Your Channel Divinity also grants affected allies a 20% Max HP Ward.'
  },
  // Wizard · Arcane Recovery
  pearl_power: {
    n: 'Pearl of Power', r: 5, ic: 'orb',
    kwHooks: ['arcane_recovery'], cls: 'Wizard', uKind: 'Trigger',
    a: { int: 2 }, s: { haste: 12, every3ArcRec: 12 },
    x: 'Every 3rd basic attack triggers Arcane Recovery (+12 Charge).'
  },
  arcane_grimoire: {
    n: 'Arcane Grimoire', r: 5, ic: 'book',
    kwHooks: ['arcane_recovery'], cls: 'Wizard', uKind: 'Modifier',
    a: { int: 4 }, s: { spen: 2, arcRecRoll: 1 },
    x: 'Your Arcane Recovery also grants +1 to your next ability d20 roll (1s CD).'
  },
  // Ranger · Hunter's Mark
  bracers_archery: {
    n: 'Bracers of Archery', r: 5, ic: 'bracers',
    kwHooks: ['hunters_mark'], cls: 'Ranger', uKind: 'Trigger',
    a: { dex: 2 }, s: { haste: 12, every3Mark: 1 },
    x: 'Every 3rd basic attack applies a stack of Hunter’s Mark.'
  },
  oathbow: {
    n: 'Oathbow', r: 5, ic: 'bow', t: 'ranged',
    kwHooks: ['hunters_mark'], cls: 'Ranger', uKind: 'Modifier',
    a: { dex: 4 }, s: { pen: 2, oathbowMod: 1 },
    x: 'Your Hunter’s Mark also applies Exposed (2s) and grants +5 Charge on hit (1s CD).'
  },
  // Rogue · Sneak Attack
  cloak_elvenkind: {
    n: 'Cloak of Elvenkind', r: 5, ic: 'cloak',
    kwHooks: ['sneak_attack'], cls: 'Rogue', uKind: 'Trigger',
    a: { dex: 2 }, s: { evasion: 0.10, every3Sneak: 1 },
    x: 'Every 3rd basic attack triggers Sneak Attack even without flanking.'
  },
  dagger_venom: {
    n: 'Dagger of Venom', r: 5, ic: 'dagger_drip', t: 'melee',
    kwHooks: ['sneak_attack'], cls: 'Rogue', uKind: 'Modifier',
    a: { dex: 4 }, s: { haste: 15, sneakVenom: 1 },
    x: 'Your Sneak Attacks also apply 2 Poison and Exposed (3s).'
  },
  // Monk · Ki
  dragonhide_belt: {
    n: 'Dragonhide Belt', r: 5, ic: 'belt',
    kwHooks: ['ki'], cls: 'Monk', uKind: 'Trigger',
    a: { dex: 2, wis: 2 }, s: { evadeKi: 1 },
    x: 'Gain +1 Ki whenever you evade an attack or roll High (1s CD).'
  },
  staff_striking: {
    n: 'Staff of Striking', r: 5, ic: 'spear', t: 'melee',
    kwHooks: ['ki'], cls: 'Monk', uKind: 'Modifier',
    a: { wis: 2 }, s: { haste: 20, kiDoubleStrike: 1 },
    x: 'Your Ki strikes hit twice.'
  },
  // Bard · Bardic Inspiration
  pipes_haunting: {
    n: 'Pipes of Haunting', r: 5, ic: 'lute',
    kwHooks: ['bardic_inspiration'], cls: 'Bard', uKind: 'Trigger',
    a: { cha: 2 }, s: { crPct: 12, startInsp: 1 },
    x: 'Start combat granting the closest ally Bardic Inspiration.'
  },
  horn_valhalla: {
    n: 'Horn of Valhalla', r: 5, ic: 'horn',
    kwHooks: ['bardic_inspiration'], cls: 'Bard', uKind: 'Modifier',
    a: { cha: 4 }, s: { hp: 30, inspWardPct: 0.20 },
    x: 'Allies spending your Bardic Inspiration gain a 20% Max HP Ward.'
  },
  // Druid · Wild Shape
  moon_sickle: {
    n: 'Moon Sickle', r: 5, ic: 'sickle', t: 'melee',
    kwHooks: ['wild_shape'], cls: 'Druid', uKind: 'Trigger',
    a: { wis: 2 }, s: { hp: 25, lowWildShape: 1 },
    x: 'First time dropping below 60% HP, trigger Wild Shape.'
  },
  staff_woodlands: {
    n: 'Staff of the Woodlands', r: 5, ic: 'staff',
    kwHooks: ['wild_shape'], cls: 'Druid', uKind: 'Modifier',
    a: { con: 4, wis: 2 }, s: { woodlandRoot: 1 },
    x: 'While in Wild Shape, Root a nearby enemy every 3s.'
  },
  // Sorcerer · Metamagic
  bloodwell_vial: {
    n: 'Bloodwell Vial', r: 5, ic: 'vial',
    kwHooks: ['metamagic'], cls: 'Sorcerer', uKind: 'Trigger',
    a: { cha: 2, int: 2 }, s: { startSorcery: 2, highSorcery: 1 },
    x: 'Start combat with 2 Sorcery Points; High rolls grant +1 extra.'
  },
  wand_fireballs: {
    n: 'Wand of Fireballs', r: 5, ic: 'wand', t: 'ranged',
    kwHooks: ['metamagic'], cls: 'Sorcerer', uKind: 'Modifier',
    a: { cha: 4 }, s: { spen: 2, metaExpose: 4 },
    x: 'Triggering Metamagic also applies Exposed (4s) to hit foes.'
  },
  // Warlock · Hex
  rod_pact_keeper: {
    n: 'Rod of the Pact Keeper', r: 5, ic: 'rod',
    kwHooks: ['hex'], cls: 'Warlock', uKind: 'Trigger',
    a: { cha: 2 }, s: { spen: 2, every4Hex: 1 },
    x: 'Every 4th attack applies your Hex to the target.'
  },
  staff_withering: {
    n: 'Staff of Withering', r: 5, ic: 'staff_skull',
    kwHooks: ['hex'], cls: 'Warlock', uKind: 'Modifier',
    a: { int: 4 }, s: { hp: 25, hexSpellAmp: 0.20 },
    x: 'Enemies with your Hex take +20% damage from spells and Radiant hits.'
  }
};

const ALL_ITEM_KEYS = Object.keys(ITEMS);
const ITEM_ORDER = ALL_ITEM_KEYS;
const COMMON_ITEM_KEYS = ALL_ITEM_KEYS.filter(k => ITEMS[k].r === 0);
const STANDARD_ITEM_KEYS = ALL_ITEM_KEYS.filter(k => ITEMS[k].r <= 4);
const CORE_ITEM_KEYS = STANDARD_ITEM_KEYS;
const UNIQUE_ITEM_KEYS = ALL_ITEM_KEYS.filter(k => ITEMS[k].r === 5);

const ITEM_BY_R = [0, 1, 2, 3, 4, 5].map(r => ALL_ITEM_KEYS.filter(k => ITEMS[k].r === r));
const itemKwHooks = k => (ITEMS[k] && ITEMS[k].kwHooks) || [];
const itemText = k => itemDesc(ITEMS[k]);

function uniqueItemsForParty(party, ownedSet) {
  const kwSet = new Set();
  (party || []).forEach(h => heroKeywords(h).forEach(k => kwSet.add(k)));
  const matched = UNIQUE_ITEM_KEYS.filter(k => {
    const it = ITEMS[k];
    return (!ownedSet || !ownedSet.has(k)) && (it.kwHooks || []).some(w => kwSet.has(w));
  });
  return matched;
}

function canCarry(heroOrKey, k) {
  const it = ITEMS[k];
  if (!it || !it.t) return true;
  if (typeof heroOrKey === 'object' && heroOrKey && heroOrKey.key === 'wallaby' && heroOrKey.questDone) return true;
  const hKey = typeof heroOrKey === 'string' ? heroOrKey : (heroOrKey && heroOrKey.key);
  const d = H[hKey];
  if (!d) return true;
  return it.t === (d.reach === 'Melee' ? 'melee' : 'ranged');
}

function itemStatsText(it) {
  if (!it) return '';
  const bits = [];
  if (it.a) Object.entries(it.a).forEach(([k, v]) => bits.push(`+${v / 2} ${k.toUpperCase()}`));
  const s = it.s || {};
  if (s.dmg) bits.push(`+${s.dmg} Dmg`);
  if (s.haste) bits.push(`+${s.haste}% Atk Spd`);
  if (s.crPct) bits.push(`+${s.crPct}% Charge`);
  if (s.ac) bits.push(`+${s.ac} AC`);
  if (s.sr) bits.push(`+${s.sr} SR`);
  if (s.hp) bits.push(`+${s.hp} HP`);
  if (s.regen) bits.push(`+${s.regen} HP/s Regen`);
  if (s.pen) bits.push(`+${s.pen} Armor Pen`);
  if (s.spen) bits.push(`+${s.spen} Spell Pen`);
  if (s.evasion) bits.push(`+${Math.round(s.evasion * 100)}% Evasion`);
  return bits.join(' · ');
}

function itemDesc(it) {
  if (!it) return '';
  const st = itemStatsText(it);
  if (it.x) return st ? `${st}. ${it.x}` : it.x;
  return st || '';
}

const ITEM_MAX = new Set([
  'pushRes', 'potionHeal', 'woundRage', 'lowDoubleRegen', 'firstCastRoot',
  'rerollLowOnce', 'startEvasionDur', 'bagGold', 'sellMult', 'meleeReflect',
  'meleeCleave', 'staggerOnHit', 'every3Strike', 'firstAbilHalf', 'wardOnCastPct',
  'capToRoll', 'shareD20Floor', 'poisonOnHit', 'starBolt', 'staffFireBurn',
  'stormCleave', 'vorpalExec', 'invulnSec', 'blackrazorKill', 'castChargeRefund',
  'permAdvantage', 'holyAvenger', 'every5Surge', 'surgeFire', 'rageCleave',
  'highSmite', 'smiteSun', 'firstHighResetCD', 'cdWardPct', 'every3ArcRec',
  'arcRecRoll', 'every3Mark', 'oathbowMod', 'every3Sneak', 'sneakVenom',
  'evadeKi', 'kiDoubleStrike', 'startInsp', 'inspWardPct', 'lowWildShape',
  'woodlandRoot', 'highSorcery', 'metaExpose', 'every4Hex', 'hexSpellAmp',
  'openingDouble', 'cleanseEvery', 'evadeCharge'
]);
const ITEM_MIN = new Set(['critThreshold']);
const ITEM_MUL = new Set(['poisonX']);
const ITEM_EVASION = new Set(['evasion', 'startEvasion']);

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
      } else if (ITEM_EVASION.has(k)) s[k] = 1 - (1 - (s[k] || 0)) * (1 - v);
      else if (ITEM_MIN.has(k)) s[k] = s[k] == null ? v : Math.min(s[k], v);
      else if (ITEM_MUL.has(k)) s[k] = (s[k] || 1) * v;
      else if (ITEM_MAX.has(k)) s[k] = Math.max(s[k] || 0, v);
      else s[k] = (s[k] || 0) + v;
    });
  });
  return { n: list.map(i => i.n).join(', '), r: Math.max(...list.map(i => i.r)), a, s, set, combined: 1 };
}
