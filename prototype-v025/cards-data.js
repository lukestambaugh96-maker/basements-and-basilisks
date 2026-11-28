'use strict';
// Player-facing tabletop card copy for all 22 locked v0.25 heroes, Act 1 enemies, terrain, and choice cards.
// Every number matches tools/testbench/config/*.config.json and tools/testbench/behaviour.js.

const HERO_CARDS = {
  arthur: {
    feature: 'Action Surge — Take an extra weapon attack.',
    passive: 'Alert: +25% Evasion. When Arthur evades or dodges an attack, trigger Action Surge (6s cooldown).',
    abilityName: 'Alert Strike',
    ability: 'Dodge incoming attacks for 0.75 / 1.0 / 1.25s, then strike for 1d8/tier + STR (+1d8 per attack dodged, max +3d8; +1d8 on Nat 20).',
    paths: [
      { name: 'Riposte Master', text: 'Alert cooldown drops to 3s. Riposte Action Surges always crit and store up to 3 extra dice.' },
      { name: 'Goading Strike', text: 'Gain +10% Evasion. Alert Strike lasts +1s longer and Taunts nearby foes (range 2) at the start.' },
    ],
  },
  bram: {
    feature: 'Channel Divinity — 1 charge per fight. Preserve Life: when an ally drops below 33% HP, heal allies below 50% HP for 2d8/tier + WIS.',
    passive: 'Disciple of Life: triggers Preserve Life automatically the first time an ally drops below 33% HP.',
    abilityName: 'Cure Wounds',
    ability: 'Heal the lowest-HP ally for 3d8/tier + WIS (+1 die on High). Also heals Bram for 75% of that amount.',
    paths: [
      { name: 'Unyielding', text: 'Self-heal doubles to 150% of Cure Wounds, and casting Taunts adjacent foes for 2s.' },
      { name: 'Shield of Faith', text: 'Cure Wounds also grants the healed ally a Ward equal to the heal.' },
    ],
  },
  faelan: {
    feature: 'Arcane Recovery — Gain +10 charge when a Ward Faelan cast absorbs a hit (up to 3 times per Shield).',
    passive: 'Spell Weave: Wards Faelan grants feed charge back through Arcane Recovery.',
    abilityName: 'Shield',
    ability: 'Grant an ally a Ward of 2d10 / 3d10 / 4d10 per tier + INT (targets lowest HP).',
    paths: [
      { name: 'Projected Ward', text: 'Casting Shield also Wards a second ally for 40% of the Shield value.' },
      { name: 'Shared Recovery', text: 'Each Arcane Recovery trigger also grants +20 charge to your highest-damage ally.' },
    ],
  },
  wallaby: {
    feature: 'Sneak Attack — Bonus Thrown Dagger dealing +1d4/tier damage (3s cooldown).',
    passive: 'Opportunist: when an ally is attacking the same foe, Wallaby triggers Sneak Attack.',
    abilityName: 'Dagger Toss',
    ability: 'Throw 1 / 2 / 3 daggers (1d4/tier + DEX each) at foes in range 3 and trigger Sneak Attack.',
    paths: [
      { name: 'Cutthroat', text: 'Sneak Attack upgrades to +1d8/tier on a 1.5s cooldown; killing a foe refunds 60 charge (1s cd).' },
      { name: 'Pickpocket', text: 'Killing a foe with Sneak Attack drops +3 gold during combat.' },
    ],
  },
  dane: {
    feature: 'Smite — Divine Smite adds +1d8/tier Radiant damage on your next hit.',
    passive: 'Radiant damage ignores enemy AC and SR.',
    abilityName: 'Compelled Duel',
    ability: 'Taunt target (range 3) for 2 / 3 / 4s, gain a 2d8 / 3d8 / 4d8 per tier + CHA Ward, and empower your next attack with Divine Smite.',
    paths: [
      { name: 'Duelist', text: 'Scaling: each dueled foe that dies adds +1d8 to Divine Smite for the rest of the run (max +5d8).' },
      { name: 'Retribution', text: 'Whenever Dane takes a hit while his Ward holds, he triggers Divine Smite back on the attacker.' },
    ],
  },
  lorcan: {
    feature: "Favored Foe — Basic attacks on a Hunter's Marked foe deal +1d4/tier bonus damage.",
    passive: "Hunter's Mark lasts until the foe dies (pure tag, no stacking).",
    abilityName: "Hunter's Barrage",
    ability: "Apply Hunter's Mark and fire arrows at the target (deals weapon-scaled volleys, triggering Favored Foe).",
    paths: [
      { name: 'Colossus Slayer', text: 'Bonus +1d10/tier damage against Marked foes above 50% HP.' },
      { name: 'Horde Breaker', text: "Hunter's Mark jumps to a new foe on kill, and ability volleys cleave all nearby enemies." },
    ],
  },
  juniper: {
    feature: 'Wild Shape — Transform with a bonus HP bar (no timer; reverts when bonus HP breaks).',
    passive: 'Briar Form grants +2 AC while Wild Shape holds.',
    abilityName: 'Briar Form',
    ability: 'Enter Wild Shape with 3d8/tier + CON bonus HP and +2 AC; slam adjacent foes with thorny strikes.',
    paths: [
      { name: 'Bramble Guard', text: 'Form HP increases to 4d8/tier + CON, +3 AC, Taunts nearby foes (1.5s), and deals 1d4 thorns when hit.' },
      { name: 'Bramble Stalker', text: 'While in Briar Form: +40% attack speed, 1d12 attacks, 3 Poison on hit, and 30% Slow (3s).' },
    ],
  },
  rosalind: {
    feature: 'Bardic Inspiration — Grant 1 / 1 / 2 allies an Inspiration die (1d8/tier) spent on their next cast for bonus damage or Ward.',
    passive: 'Allies automatically spend their Bardic Inspiration die on their next ability cast.',
    abilityName: 'Dissonant Whispers',
    ability: 'Deal 1d6/tier + CHA magic damage, Slow 30% (2s; High Stuns 1s), and grant Bardic Inspiration to 1 / 1 / 2 allies.',
    paths: [
      { name: 'Cutting Words', text: 'Dissonant Whispers hits 2 foes for 1d8/tier magic damage and Slows 35% (2s).' },
      { name: 'Heroism', text: 'Inspired allies also gain a 1d8/tier + CHA Ward and +20% attack speed for 3s.' },
    ],
  },
  zark: {
    feature: 'Rage — Gain unlimited Rage stacks every 25 damage taken; each stack heals 1 HP every 2s (fades 3s after last gain).',
    passive: 'Takes hits to build Rage stacks and outlast enemy front lines.',
    abilityName: 'Reckless Cleave',
    ability: 'Cleave adjacent enemies with Greataxe sweeps, gaining extra impact from Rage.',
    paths: [
      { name: 'Bear Totem', text: 'Rage healing per stack is doubled (2 HP every 2s per stack).' },
      { name: 'Wolf Totem', text: 'Reckless Cleave adds +1d4 damage per Rage stack to every foe hit.' },
    ],
  },
  naill: {
    feature: 'Ki — Gain 1 Ki per attack (max 5, never spent). Each Ki grants +2% attack speed; at 5 Ki, Flurry gains +1 strike.',
    passive: 'Fast martial attacker who ramps up through the fight without losing Ki.',
    abilityName: 'Flurry of Blows',
    ability: 'Unleash rapid Unarmed Strikes on your target (extra strike at max Ki).',
    paths: [
      { name: 'Stunning Strike', text: 'The final hit of Flurry of Blows Stuns the target for 1s.' },
      { name: 'Step of the Wind', text: 'Leaps to the rearmost enemy before unleashing Flurry of Blows.' },
    ],
  },
  nettle: {
    feature: 'Pact — Basic attacks against Hexed foes deal +1d4 bonus magic damage; killing a Hexed foe grants a 2d8/tier + CHA Ward.',
    passive: 'Hex lasts until the foe dies (pure tag, no stacking).',
    abilityName: 'Hex Blast',
    ability: 'Hex the target and blast it with Eldritch fire (scales per tier).',
    paths: [
      { name: 'Hellfire Pact', text: 'When a Hexed foe dies, it explodes for 2d6/tier magic damage to adjacent enemies.' },
      { name: "Fiend's Favor", text: 'Pact Ward on Hexed kill is doubled and grants +30% attack speed for 4s.' },
    ],
  },
  pillar: {
    feature: 'Rage — Gain unlimited Rage every 2nd basic attack (also splashes 1d4/tier and Slows 25% for 1.5s).',
    passive: 'Maul of Faith hits hard (2d6 + STR @ 3.0s) with 0.5s Stun on hit and 1d4/tier splash.',
    abilityName: 'Earthshaker Quake',
    ability: 'Big ability (180 charge): smash all foes in range 1 for 8d6/tier physical damage and Stun for 1 / 1.5 / 2s.',
    paths: [
      { name: 'Unbreakable', text: 'Gain +3 AC. Quake grants a 2d6/tier Ward per foe hit plus +3 Ward per Rage stack.' },
      { name: 'Avalanche', text: 'Quake reach increases by +1 square and adds +1d4 damage per Rage stack.' },
    ],
  },
  laurel: {
    feature: 'Smite — Radiant Smite deals +1d8/tier Radiant damage; heals Laurel for 33% of melee damage dealt.',
    passive: 'Durable Paladin frontline who drains life on every glaive sweep.',
    abilityName: 'Verdant Smite',
    ability: 'Cleave foes with a Radiant Smite strike, healing Laurel from the blow.',
    paths: [
      { name: 'Warden', text: 'Every 3rd basic attack Restrains the target for 1.5s.' },
      { name: 'Bruiser', text: 'Drain healing increases to 50% of damage dealt and grants +20% attack speed.' },
    ],
  },
  lumen: {
    feature: 'Pact — Damaging a Hexed foe heals the lowest-HP ally for 2d6/tier (3s cooldown).',
    passive: 'Sacred Beam deals Radiant damage (ignores AC & SR).',
    abilityName: 'Celestial Beam',
    ability: 'Big ability (180 charge): Hex foes in a line and scorch them with Radiant light.',
    paths: [
      { name: 'Searing Light', text: 'Beam gains +2 dice per foe hit, and basic attacks vs Hexed foes deal +1d6 Radiant.' },
      { name: 'Healing Light', text: 'Pact heal upgrades to 2d8/tier, heals 2 allies, and cooldown drops to 2s.' },
    ],
  },
  jamison: {
    feature: 'Channel Divinity — Unity of Peace (1/fight when an ally drops below 35% HP): equalize party HP % and grant a 1d6/tier Ward to all allies.',
    passive: 'Emboldening Bond (6s): heals, Wards, and attack speed buffs on a bonded hero share 50% to other bonded allies.',
    abilityName: 'Emboldening Bond',
    ability: 'Bond Jamison with 1 / 2 / 2 allies for 6s and heal the lowest bonded ally for 2d6/tier + CHA (shared across the Bond).',
    paths: [
      { name: 'Balm of Peace', text: 'Bond sharing increases to 100%, and casting also heals Jamison for 1d8/tier.' },
      { name: 'Protective Bond', text: 'Hits of 10+ damage on a bonded ally grant a 1d6/tier Ward (3s cd); every 3rd cast restores Channel Divinity.' },
    ],
  },
  zoe: {
    feature: 'Action Surge — Attacking supplies allies; casting hands out Potions, Spare Shields, or Whetstones (+1 die per ally item).',
    passive: 'Supplies scale with how many items your allies carry.',
    abilityName: 'Field Supplies',
    ability: 'Deliver a Potion (heal), Spare Shield (Ward), or Whetstone (bonus attack dice) to the ally who needs it most.',
    paths: [
      { name: 'Rune Knight', text: 'Casting also grants Zoe a 2d6/tier Ward and +1d6/tier bonus damage for 4s.' },
      { name: 'Quartermaster', text: 'Delivers +1 extra supply per cast and restores +15 charge to supplied allies.' },
    ],
  },
  gilthrax: {
    feature: 'Action Surge — When Gilthrax’s Ward breaks, trigger Action Surge (up to 3 times per break based on items held).',
    passive: 'Item Hoarder: Ward gains +5 per item (+5 more per Rare/Epic item).',
    abilityName: 'Gilded Bulwark',
    ability: 'Gain a 1d6 / 1d8 / 2d8 per tier + CON Ward (boosted by items held).',
    paths: [
      { name: "Dragon's Retort", text: 'When Ward breaks, breathe fire in a cone for 30% (+15%/item) of absorbed damage + Burn.' },
      { name: 'Gilded Scales', text: 'Gain +2 AC and +1 SR for every item Gilthrax holds.' },
    ],
  },
  velith: {
    feature: 'Sneak Attack — Bonus attack dealing +1d4/tier + 1 Poison (5s cd). Venom Dagger inflicts 1 Poison on hit.',
    passive: 'High-impact assassin who stacks Poison and punishes controlled targets.',
    abilityName: 'Shadow Ambush',
    ability: 'Big ability (180 charge): blink behind the rearmost foe (on Mid/High), guaranteed Crit, apply Poison, and trigger Sneak Attack.',
    paths: [
      { name: 'Assassin', text: 'Shadow Ambush executes foes below 30% HP.' },
      { name: 'Poisoner', text: 'When a poisoned foe dies, spread 4 Poison to nearby enemies.' },
    ],
  },
  cinder: {
    feature: 'Metamagic — Gain 1 Sorcery Point per Fire Bolt; at 4 SP, your next cast spends all 4 for Twin Spell.',
    passive: 'Pure Sorcerer artillery building toward explosive Twinned Scorching Rays.',
    abilityName: 'Scorching Ray',
    ability: 'Fire 2 / 3 / 4 rays dealing 2d6/tier magic damage each (Twinned at 4 SP).',
    paths: [
      { name: 'Scorched Earth', text: 'Rays splash 1d4/tier and ignite burning ground tiles (1d4/s for 2s, non-stacking).' },
      { name: 'Living Flame', text: 'Each cast grants Flame stacks (+20% AS each, upgrades Fire Bolt to 1d6/tier + CHA and fires extra bolts).' },
    ],
  },
  gains: {
    feature: 'Arcane Recovery — Whenever gold drops in combat, Gains recovers +30 charge.',
    passive: 'Gilded Beam drops +1 gold on hit and gilds the target (drops gold on death).',
    abilityName: 'Gilded Beam',
    ability: 'Big ability (180 charge): fire a heavy beam for 10d8/tier + INT magic damage, gilding the target and dropping +1 gold.',
    paths: [
      { name: 'Compound Interest', text: 'Gilded Beam gains +3d8 (+2d8 per 10 gold you hold, max +8d8 total).' },
      { name: 'Liquid Assets', text: 'Beam drops +2 gold on hit, gilded kills drop +2 gold, and gold drops grant +20 charge to allies.' },
    ],
  },
  corvin: {
    feature: "Favored Foe — Attacks on Hunter's Marked foes strike twice and Slow 20% for 1s.",
    passive: 'Lightning-fast twin shortswords (0.9s interval) that shred Marked targets.',
    abilityName: 'Twin Volley',
    ability: "Mark the target with Hunter's Mark and unleash a flurry of rapid strikes.",
    paths: [
      { name: "Stalker's Flurry", text: 'Every basic attack against a Marked foe triggers an extra Favored Foe strike.' },
      { name: 'First Strike', text: 'Killing a Marked foe grants Corvin +25 charge and all allies +15 charge.' },
    ],
  },
  saint: {
    feature: "Channel Divinity — Trickster's Escape (1/fight when an ally drops below 35% HP): grant Stealth (2s) and +25% Evasion (3s).",
    passive: 'Toll the Dead deals 1d8 (1d12 vs wounded foes). Grants +15% Evasion (3s) when casting.',
    abilityName: 'Invoke Mirror Double',
    ability: 'Summon a Mirror Double of an ally (20% HP, lasts 2 / 2.5 / 3s, Taunts 0 / 1 / 1.5s) and grant +15% Evasion (3s).',
    paths: [
      { name: 'Invoke Duplicity', text: 'Doubles have 40% HP, last +1.5s, copy casts, and Trickster’s Escape also summons a Double.' },
      { name: 'Cloak of Shadows', text: 'Evasion buff rises to +25% (4s), grants Stealth (1.5s) on expiry, and ally evades restore +15 charge.' },
    ],
  },
  kaska: {
    feature: 'Wild Shape — Moon Beast bonus HP bar (4d10/tier + CON, no timer) with +25% AS and 1d4/tier heal on hit.',
    passive: 'Ferocious melee Druid who pounces into Moon Beast form.',
    abilityName: 'Moon Pounce',
    ability: 'Big ability (180 charge): enter Moon Beast form, strike for 5d8/tier + STR, and heal lowest ally for 2d6/tier.',
    paths: [
      { name: 'Panther', text: 'Starts fight in Panther form (3d10/tier + CON HP, +40% AS, 1d10 attacks, 1d6/tier heal on hit).' },
      { name: 'Dire Bear', text: 'Starts fight in Dire Bear form (5d10/tier + CON HP, +3 AC, 2d6 attacks, 1d4/tier cleave, 2s Taunt).' },
    ],
  },
};

const ENEMY_NOTES = {
  goblin: 'Fast melee swarmer. Easy starter warm-up.',
  goblin_archer: 'Backline ranged shooter. Uses cover well.',
  klarg: 'Bugbear Elite. Charges Crushing Swing every 4 attacks (heavy hit + Stun).',
  ripper: 'Dire Wolf. Pack tactics (+15% AS next to allies) and fast movement.',
  redbrand: 'Tough melee ruffian blocking the narrow bridge.',
  glasstaff: 'Evil Mage Elite. Fires Magic Missile volleys (High grants self-Ward).',
  vine: 'Controller Elite. Pulls & Restrains a hero at start, Restrains every 3rd hit.',
  twig: 'Fast melee swarmer.',
  needle: 'Ranged needle thrower.',
  flameskull: 'Artillery Elite. Splash attacks and Fireball AoE every 6s — spread out!',
  lesser_skull: 'Ranged magic splash attacker.',
  ghoul: 'Two-strike melee brute; Stuns on every 3rd hit on the same hero.',
  nezznar: 'ACT 1 BOSS. Casts Web on 3 heroes every 6s (8d6+10 + Restrain). At 50% HP casts Darkness (6s, blocks ranged attacks).',
  giant_spider: 'Double-bite melee escort.',
};

const TERRAIN_INFO = {
  rock: { name: 'Boulders', desc: 'Blocks movement and line of sight.' },
  chasm: { name: 'Chasm', desc: 'Impassable pit — funnels melee across the bridge.' },
  wall: { name: 'Ruined Wall', desc: 'Blocks movement and ranged line of sight.' },
  forge: { name: 'Spell Forge', desc: 'Impassable arcane forge in the center.' },
  web: { name: 'Spider Web', desc: 'Stepping on a web Restrains a hero for 1s (2.5s cooldown).' },
  tower: { name: 'Watchtower', desc: 'Standing here grants +1 attack range.' },
  gate: { name: 'Iron Gate', desc: 'Impassable barrier.' },
};

const CHOICE_META = {
  multiclass: { icon: '✦', desc: 'Grant one hero a secondary Class Feature for the rest of the run.' },
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
