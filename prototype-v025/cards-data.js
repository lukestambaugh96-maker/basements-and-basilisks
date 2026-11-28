'use strict';
// Player-facing tabletop card copy, Multiclass trigger descriptions, and keyword/stat glossary.
// Every trigger, stack, and number matches tools/testbench/config/*.config.json, engine.js, and behaviour.js.

const HERO_CARDS = {
  arthur: {
    feature: 'Action Surge: Whenever Arthur evades or dodges an attack, he immediately takes an extra weapon attack (6s cooldown). Starts with +25% Evasion.',
    abilityName: 'Alert Strike',
    ability: 'Dodge all incoming attacks for 0.75 / 1.0 / 1.25s, then strike for 1d8/tier + STR (+1d8 per attack dodged, max +3d8; +1d8 on Nat 20).',
    paths: [
      { name: 'Riposte Master', text: 'Action Surge cooldown drops to 3s, always Crits, and Alert Strike stores up to 3 dodge dice.' },
      { name: 'Goading Strike', text: '+10% Evasion. Alert Strike lasts +1s longer and Taunts foes within 2 squares at the start.' },
    ],
  },
  bram: {
    feature: 'Channel Divinity (1/fight): The first time an ally drops below 33% HP, heal every ally below 50% HP for 2d8/tier + WIS.',
    abilityName: 'Cure Wounds',
    ability: 'Heal the lowest-HP ally for 3d8/tier + WIS (+1 die on High). Also heals Bram for 75% of that amount.',
    paths: [
      { name: 'Unyielding', text: 'Self-heal doubles to 150% of Cure Wounds, and casting Taunts adjacent foes for 2s.' },
      { name: 'Shield of Faith', text: 'Cure Wounds also grants the healed ally a Ward equal to the heal.' },
    ],
  },
  faelan: {
    feature: 'Arcane Recovery: Each time a Ward Faelan cast absorbs a hit, Faelan gains +10 charge (up to 3 times per Shield).',
    abilityName: 'Shield',
    ability: 'Grant the lowest-HP ally a Ward of 2d10 / 3d10 / 4d10 per tier + INT.',
    paths: [
      { name: 'Projected Ward', text: 'Casting Shield also grants a second ally a Ward for 40% of the Shield value.' },
      { name: 'Shared Recovery', text: 'Each Arcane Recovery trigger also grants +20 charge to your highest-damage ally.' },
    ],
  },
  wallaby: {
    feature: 'Sneak Attack: When an ally is attacking Wallaby’s target, throw a bonus dagger dealing +1d4/tier damage (3s cooldown).',
    abilityName: 'Dagger Toss',
    ability: 'Throw 1 / 2 / 3 daggers (1d4/tier + DEX each) at foes within 3 squares and trigger Sneak Attack.',
    paths: [
      { name: 'Cutthroat', text: 'Sneak Attack deals +1d8/tier on a 1.5s cooldown. Killing a foe refunds 60 charge (1s cooldown).' },
      { name: 'Pickpocket', text: 'Killing a foe with Sneak Attack drops +3 gold during combat.' },
    ],
  },
  dane: {
    feature: 'Smite: Divine Smite deals +1d8/tier Radiant damage on hit.',
    abilityName: 'Compelled Duel',
    ability: 'Taunt a foe within 3 squares for 2 / 3 / 4s, gain a 2d8 / 3d8 / 4d8 per tier + CHA Ward, and empower your next attack with Divine Smite.',
    paths: [
      { name: 'Duelist', text: 'Each dueled foe that dies permanently adds +1d8 to Divine Smite for the rest of the run (max +5d8).' },
      { name: 'Retribution', text: 'Whenever Dane is hit while his Ward holds, he triggers Divine Smite back on the attacker.' },
    ],
  },
  lorcan: {
    feature: "Favored Foe: Basic attacks apply Hunter's Mark and deal +1d4/tier extra physical damage to Marked foes.",
    abilityName: 'Twin Shot',
    ability: 'For 3 / 4 / 5s, every Longbow attack fires a second arrow (both arrows Crit on Nat 20).',
    paths: [
      { name: 'Colossus Slayer', text: 'Favored Foe upgrades to +1d10/tier against Marked foes above 50% HP.' },
      { name: 'Horde Breaker', text: "When a Marked foe dies, Hunter's Mark jumps to the nearest enemy and Lorcan’s next attack strikes all adjacent foes." },
    ],
  },
  juniper: {
    feature: 'Wild Shape: Entering Briar Form grants a bonus HP bar (3d8/tier + CON) and +2 AC until the bonus HP is depleted.',
    abilityName: 'Entangle & Briar Form',
    ability: 'Damage and Restrain foes within 1 square, then enter Briar Form.',
    paths: [
      { name: 'Bramble Guard', text: 'Briar Form grants 4d8/tier + CON bonus HP, +3 AC, Taunts adjacent foes (1.5s), and deals 1d4 thorns to attackers.' },
      { name: 'Bramble Stalker', text: 'Entangle Slows 30% (3s). In Briar Form: +40% attack speed, 1d12 attacks, and 3 Poison on hit.' },
    ],
  },
  rosalind: {
    feature: 'Bardic Inspiration: Grants 1 / 1 / 2 allies a 1d8/tier Inspiration die, spent automatically on their next cast for bonus damage or Ward.',
    abilityName: 'Dissonant Whispers',
    ability: 'Deal 1d6/tier + CHA magic damage, Slow 30% for 2s (High Stuns 1s), and grant Bardic Inspiration to 1 / 1 / 2 allies.',
    paths: [
      { name: 'Cutting Words', text: 'Dissonant Whispers hits 2 foes. When an ally spends Inspiration, strike their attacker for 1d8/tier magic damage and Slow 35% (2s).' },
      { name: 'Heroism', text: 'Inspired allies also gain a 1d8/tier + CHA Ward and +20% attack speed for 3s.' },
    ],
  },
  zark: {
    feature: 'Rage: Gain +1 Rage stack for every 25/tier damage taken (1 stack fades every 3s). Each stack heals Zark for 1 HP every 2s.',
    abilityName: 'Reckless Cleave',
    ability: 'Cleave all adjacent enemies with your Greataxe, taking recoil damage.',
    paths: [
      { name: 'Bear Totem', text: 'Rage healing doubles to 2 HP every 2s per stack.' },
      { name: 'Wolf Totem', text: 'Reckless Cleave deals +1d4 extra damage per Rage stack to every foe hit.' },
    ],
  },
  naill: {
    feature: 'Ki: Gain +1 Ki on every basic attack (max 5). Each Ki grants +2% attack speed; at 5 Ki, Flurry of Blows gains +1 strike.',
    abilityName: 'Flurry of Blows',
    ability: 'Unleash rapid Unarmed Strikes against your target (+1 extra strike at 5 Ki).',
    paths: [
      { name: 'Stunning Strike', text: 'At 5 Ki, the final hit of Flurry of Blows Stuns the target for 1s.' },
      { name: 'Step of the Wind', text: 'At 5 Ki, leap to the rearmost enemy before unleashing Flurry of Blows.' },
    ],
  },
  nettle: {
    feature: 'Pact: Basic attacks deal +1d4 bonus magic damage to Hexed foes. Whenever a Hexed foe dies, Nettle gains a 2d8/tier + CHA Ward.',
    abilityName: 'Hex Blast',
    ability: 'Apply Hex, deal magic damage, and inflict Burn (0 / 2 / 4+ per tier).',
    paths: [
      { name: 'Hellfire Pact', text: 'When a Hexed foe dies, it explodes for 2d6/tier magic damage to adjacent foes and Hex jumps to the nearest enemy.' },
      { name: "Fiend's Favor", text: 'Pact Ward is doubled and grants +30% attack speed for 4s.' },
    ],
  },
  pillar: {
    feature: 'Rage: Gain +1 Rage stack for every 2nd hit Pillar takes. Each Rage stack adds +1 physical damage to Maul of Faith. Basic attacks also splash 1d4/tier to adjacent foes and Slow 25% for 1.5s.',
    abilityName: 'Earthshaker Quake',
    ability: 'Smash all foes within 1 square for 8d6/tier physical damage and Stun them for 1 / 1.5 / 2s.',
    paths: [
      { name: 'Unbreakable', text: '+3 AC. Earthshaker Quake grants 2d6/tier Ward per foe stunned, plus +3/tier Ward per Rage stack.' },
      { name: 'Avalanche', text: 'Earthshaker Quake reaches 2 squares and adds +1d4 damage per Rage stack.' },
    ],
  },
  laurel: {
    feature: "Smite: Divine Smite deals +1d8/tier Radiant damage. Basic attacks heal adjacent allies for 33% of damage dealt.",
    abilityName: 'Verdant Smite',
    ability: 'Strike with your glaive + Divine Smite, healing Laurel and adjacent allies for 50% of the total damage dealt.',
    paths: [
      { name: 'Warden', text: 'Every 3rd basic attack triggers Divine Smite and Restrains the target for 1.5s.' },
      { name: 'Bruiser', text: '+20% attack speed, and basic attacks also heal Laurel for 50% of damage dealt.' },
    ],
  },
  lumen: {
    feature: 'Pact: Sacred Beam applies Hex on hit (deals Radiant damage). Damaging a Hexed foe heals the lowest-HP ally for 2d6/tier (3s cooldown).',
    abilityName: 'Celestial Beam',
    ability: 'Fire a Radiant beam in a line, applying Hex and dealing Radiant damage to every enemy hit.',
    paths: [
      { name: 'Searing Light', text: 'Celestial Beam gains +2 dice for each extra enemy hit; Sacred Beam deals +1d6 Radiant to Hexed foes.' },
      { name: 'Healing Light', text: 'Pact heals 2 allies for 2d8/tier on a 2s cooldown.' },
    ],
  },
  jamison: {
    feature: 'Channel Divinity (1/fight): The first time an ally drops below 35% HP, equalize HP % across all allies and grant everyone a 1d6/tier Ward.',
    abilityName: 'Emboldening Bond',
    ability: 'Bond Jamison with 1 / 2 / 2 allies for 6s and heal the lowest bonded ally for 2d6/tier + CHA. Heals, Wards, and attack speed buffs on a bonded ally share 50% to other bonded allies.',
    paths: [
      { name: 'Balm of Peace', text: 'Bond sharing increases to 100%, and casting also heals Jamison for 1d8/tier.' },
      { name: 'Protective Bond', text: 'Hits of 10+ damage on a bonded ally grant them a 1d6/tier Ward (3s cooldown). Every 3rd cast restores Channel Divinity.' },
    ],
  },
  zoe: {
    feature: 'Action Surge: Whenever Zoe casts Rummage, she immediately takes an extra weapon attack.',
    abilityName: 'Rummage',
    ability: 'Supply 1 / 1 / 2 allies with a Potion (heal), Spare Shield (Ward), or Whetstone (bonus attack dice), adding +1 die per item that ally holds.',
    paths: [
      { name: 'Rune Knight', text: 'Casting Rummage grants Zoe a 2d6/tier Ward and adds +1d6/tier physical damage to her attacks for 4s.' },
      { name: 'Quartermaster', text: 'Supplies +1 extra ally per cast and restores +15 charge to every supplied ally.' },
    ],
  },
  gilthrax: {
    feature: 'Action Surge: When Gilthrax’s Ward breaks, take 1 extra weapon attack per item held (up to 3). Gilded Bulwark gains +5 Ward per item (+5 more per Rare/Epic item).',
    abilityName: 'Gilded Bulwark',
    ability: 'Gain a 1d6 / 1d8 / 2d8 per tier + CON Ward (plus item bonus) and Taunt adjacent foes.',
    paths: [
      { name: "Dragon's Retort", text: 'When Ward breaks, breathe fire in a 2-square cone dealing 30% (+15% per item) of absorbed damage as magic damage.' },
      { name: 'Gilded Scales', text: 'Gain +2 AC and +1 SR for every item Gilthrax holds.' },
    ],
  },
  velith: {
    feature: 'Sneak Attack: Starts fight in Stealth. Basic attacks apply 1 Poison and trigger a bonus strike (+1d4/tier + 1 Poison, 5s cooldown) against Poisoned foes or from Stealth.',
    abilityName: 'Shadow Ambush',
    ability: 'On Mid/High, leap behind the lowest-HP foe, Crit, apply Poison (double on High), and trigger Sneak Attack.',
    paths: [
      { name: 'Assassin', text: 'Sneak Attack executes non-boss enemies below 30% HP.' },
      { name: 'Poisoner', text: 'Sneak Attack spreads 4 Poison to all enemies adjacent to the target.' },
    ],
  },
  cinder: {
    feature: 'Metamagic: Each Fire Bolt grants +1 Sorcery Point (max 4). Casting at 4 Sorcery Points spends all 4 to cast twice.',
    abilityName: 'Scorching Ray',
    ability: 'Fire 2 / 3 / 4 rays dealing 2d6/tier magic damage each.',
    paths: [
      { name: 'Scorched Earth', text: 'Rays splash 1d4/tier to adjacent foes and ignite burning ground tiles (1d4/s for 2s).' },
      { name: 'Living Flame', text: 'Fire Bolt becomes 1d6/tier + CHA. Casting grants 1 / 1 / 2 Flame stacks (+20% attack speed each and extra Fire Bolts).' },
    ],
  },
  gains: {
    feature: 'Arcane Recovery: Whenever gold drops in combat, Gains recovers +30 charge.',
    abilityName: 'Gilded Beam',
    ability: 'Blast the highest-HP enemy for 10d8/tier + INT magic damage, drop +1 gold on hit, and gild the target (+1 gold on death; High gilds an adjacent foe too).',
    paths: [
      { name: 'Compound Interest', text: 'Gilded Beam gains +3d8 damage, plus +2d8 for every 10 gold you hold (max +8d8 bonus).' },
      { name: 'Liquid Assets', text: 'Beam drops +2 gold on hit, gilded kills drop +2 gold, and gold drops grant +20 charge to all allies.' },
    ],
  },
  corvin: {
    feature: "Favored Foe: Basic attacks against a Hunter's Marked foe strike twice and Slow them by 20% for 1s.",
    abilityName: 'Twin Volley',
    ability: "Apply Hunter's Mark and strike the target rapidly (2 / 3 / 4 hits).",
    paths: [
      { name: "Stalker's Flurry", text: 'Every basic attack against a Marked foe triggers an extra strike.' },
      { name: 'First Strike', text: 'First cast grants all allies +15 charge; killing a Marked foe restores +25 charge.' },
    ],
  },
  saint: {
    feature: "Channel Divinity (1/fight): The first time an ally drops below 35% HP, grant them Stealth (2s) and +25% Evasion (3s). Toll the Dead deals 1d12 vs wounded foes.",
    abilityName: 'Invoke Mirror Double',
    ability: 'Grant the frontmost wounded ally +15% Evasion (3s) and summon a Mirror Double (20% HP, lasts 2 / 2.5 / 3s, Taunts 0 / 1 / 1.5s).',
    paths: [
      { name: 'Invoke Duplicity', text: 'Doubles have 40% HP, last +1.5s, cast a Low copy of the ally’s ability, and Channel Divinity also summons a Double.' },
      { name: 'Cloak of Shadows', text: 'Evasion buff rises to +25% (4s), grants Stealth (1.5s) when the Double expires, and ally evades restore +15 charge.' },
    ],
  },
  kaska: {
    feature: 'Wild Shape: Moon Beast grants 4d10/tier + CON bonus HP, +25% attack speed, and heals the lowest-HP ally for 1d4/tier on hit until depleted.',
    abilityName: 'Moon Pounce',
    ability: 'On Mid/High, leap to the farthest foe, strike for 5d8/tier + STR, Restrain them, heal the lowest-HP ally for 2d6/tier, and enter Moon Beast form.',
    paths: [
      { name: 'Panther', text: 'Start every fight in Panther form (3d10/tier + CON bonus HP, +40% attack speed, 1d10 attacks, 1d6/tier heal on hit).' },
      { name: 'Dire Bear', text: 'Start every fight in Dire Bear form (5d10/tier + CON bonus HP, +3 AC, 2d6 attacks, 1d4/tier cleave, Taunt adjacent foes 2s).' },
    ],
  },
};

// Exact triggers & effects granted by the Multiclass Trainer (matches tools/testbench/engine.js)
const MULTICLASS_INFO = {
  'Action Surge': 'Every 5th basic attack, take an extra weapon attack.',
  'Channel Divinity': 'Once per fight, when an ally drops below 50% HP, heal them for 2d8 + WIS.',
  'Arcane Recovery': 'After casting your ability, recover +15 charge.',
  'Sneak Attack': 'Basic attacks against Stunned, Restrained, Slowed, or Taunted foes deal +2d6 physical damage (3s cooldown).',
  'Smite': 'Every 3rd melee basic attack smites for +2d8 Radiant damage.',
  'Favored Foe': 'Marks your first target until it dies; attacks against it deal +1d6 bonus damage.',
  'Bardic Inspiration': 'After casting your ability, grant the nearest ally a 1d6 Inspiration die spent automatically on their next cast for bonus magic damage or Ward.',
  'Rage': 'Gain +1 Rage when hit (up to 2 + tier stacks); each stack heals at least 1 HP/s (scales with CON).',
  'Ki': 'Gain +1 Ki per basic attack (max 4). Each Ki grants +5% attack speed; at 4 Ki, your abilities gain +1 extra die.',
  'Pact': 'Hexes your first target until it dies; attacks against it deal +1d6 bonus damage.',
  'Metamagic': 'Quickened Spell: your ability casts instantly with 0s cast time.',
};

// Universal keyword & status glossary for custom hover tooltips
const GLOSSARY = {
  'Action Surge': 'Fighter feature — triggers an extra weapon attack outside normal attack speed.',
  'Channel Divinity': 'Cleric feature — 1 charge per fight (max 1). Never fires at fight start; triggers on a condition.',
  'Arcane Recovery': 'Wizard feature — restores ability charge when its trigger occurs.',
  'Sneak Attack': 'Rogue feature — bonus weapon strike with extra damage on an internal cooldown.',
  'Smite': 'Paladin feature — adds Radiant damage (ignores AC & SR) to an attack.',
  'Favored Foe': "Ranger feature — triggers bonus effects against enemies with Hunter's Mark.",
  "Hunter's Mark": 'Condition — marks an enemy until it dies. Does not stack.',
  'Bardic Inspiration': 'Bard feature — grants an ally an Inspiration die used on their next ability cast.',
  'Rage': 'Barbarian feature — stacks built during combat that power passive healing, damage, or abilities.',
  'Ki': 'Monk feature — built on basic attacks to boost attack speed and enhance abilities.',
  'Pact': 'Warlock feature — triggers bonus effects on Hexed enemies or when Hexed enemies die.',
  'Hex': 'Condition — hexes an enemy until it dies. Does not stack.',
  'Metamagic': 'Sorcerer feature — spends Sorcery Points (or Quickened cast) to enhance ability casts.',
  'Wild Shape': 'Druid feature — adds a bonus HP bar and transforms stats/attacks until the bonus HP is depleted.',
  'Ward': 'Temporary shield that absorbs damage before HP. Multiple Wards add together.',
  'Evasion': 'Chance to completely evade incoming basic attacks (capped at 50%). Never evades abilities; reduced by Pierce.',
  'Pierce': 'Lowers the target’s Evasion chance on your basic attacks.',
  'Radiant': 'Damage type that ignores both Armor Class (AC) and Spell Resistance (SR).',
  'Restrained': 'Cannot move, attacks 50% slower, and rolls ability casts with Disadvantage. Halved on bosses.',
  'Stun': 'Cannot move, attack, or gain charge; cancels an active cast (50% charge refunded). Grants 1s stun immunity after.',
  'Slow': 'Reduces movement and attack speed by the strongest active Slow percentage. Halved on bosses.',
  'Taunt': 'Forces affected enemies to target the taunter. Halved on bosses.',
  'Stealth': 'Untargetable by attacks and single-target spells. Ends on attack or cast; the first strike out of Stealth Crits.',
  'Burn': 'Deals magic damage every second for 3s. Reapplying refreshes duration.',
  'Poison': 'Deals magic damage equal to stacks every second, then decreases by 1 stack. Stacks add together.',
  'Crit': 'Critical hit — doubles all rolled dice (flat bonuses are not doubled). Triggered by Nat 20, Stealth, or melee vs Stunned foes.',
  'Fizzle': 'Rolling a Natural 1 on an ability d20 roll cancels the cast and refunds 50% charge.',
  'Last Stand': 'Once per fight, dropping to 0 HP leaves the hero at 1 HP and invulnerable for 1.5s.',
};

const ENEMY_NOTES = {
  goblin: 'Fast melee swarmer.',
  goblin_archer: 'Backline ranged shooter.',
  wolf: 'Fast Pack swarmer. Gains +15% attack speed when adjacent to an allied enemy.',
  bugbear: 'Heavy Bugbear Elite. Charges Crushing Swing every 4 attacks (heavy hit + Stun).',
  klarg: 'Bugbear Chieftain Elite. Charges Crushing Swing every 4 attacks (heavy hit + Stun).',
  ripper: 'Dire Wolf. Gains +15% attack speed when adjacent to an allied enemy.',
  redbrand: 'Melee ruffian guarding the narrow bridge.',
  glasstaff: 'Mage Elite. Fires Magic Missile volleys (High roll grants a self-Ward).',
  vine: 'Controller Elite. Pulls and Restrains a hero at fight start, and Restrains every 3rd hit.',
  twig: 'Fast melee swarmer.',
  needle: 'Ranged needle thrower.',
  flameskull: 'Artillery Elite. Splash attacks and Fireball AoE every 6s — spread your party out!',
  lesser_skull: 'Ranged magic splash attacker.',
  ghoul: 'Double-strike melee brute; Stuns on every 3rd hit against the same hero.',
  nezznar: 'Act 1 Boss. Casts Web on 3 heroes every 6s (8d6+10 magic + Restrained). At 50% HP casts Darkness (6s, blocks ranged attacks).',
  giant_spider: 'Double-bite melee escort.',
};

const TERRAIN_INFO = {
  rock: { name: 'Boulders / Pillars', desc: 'Blocks movement and ranged line of sight.' },
  chasm: { name: 'Chasm', desc: 'Impassable pit — funnels melee across bridges. Ranged attacks can shoot over it.' },
  water: { name: 'Shallow Water', desc: 'Impassable stream or pool — ranged attacks and spells can shoot over it.' },
  crates: { name: 'Supply Crates', desc: 'Blocks movement — ranged attacks and spells can shoot over them.' },
  wall: { name: 'Ruined Wall', desc: 'Blocks movement and ranged line of sight.' },
  forge: { name: 'Spell Forge', desc: 'Impassable arcane forge — blocks movement and line of sight.' },
  web: { name: 'Spider Web', desc: 'Stepping on a web Restrains a hero for 1s (2.5s cooldown).' },
  tower: { name: 'Watchtower', desc: 'Standing here grants +1 attack range.' },
  gate: { name: 'Iron Gate', desc: 'Impassable barrier.' },
};

const CHOICE_META = {
  multiclass: { icon: '✦', desc: 'Grant one hero a secondary Class Feature with its own combat trigger for the rest of the run.' },
  freeitem: { icon: '🎁', desc: 'Receive a random Uncommon item immediately into your stash.' },
  purse: { icon: '💰', desc: 'Gain +15 gold immediately.' },
  training: { icon: '⚔', desc: 'Permanently grant +2 to one hero’s primary ability score.' },
  recruit: { icon: '🛡', desc: 'Draft 1 of 3 Tier 1 heroes for free onto your bench (or board).' },
  bargain_elite: { icon: '🔥', desc: 'Add an extra Elite enemy to the next fight; win for DOUBLE gold.' },
  bargain_more: { icon: '🃏', desc: 'Skip this reward; your next Choice screen offers 3 cards instead of 2.' },
};

const CLASS_COLORS = {
  Fighter: '#b84a32',
  Cleric: '#c9972e',
  Wizard: '#3768a8',
  Rogue: '#4a5568',
  Paladin: '#c48f2a',
  Ranger: '#3a7a4a',
  Druid: '#2e7d52',
  Bard: '#a8436c',
  Barbarian: '#a83328',
  Monk: '#367c8c',
  Warlock: '#6b3e5e',
  Sorcerer: '#c44b24',
};
