# Basements & Basilisks — Initial Prototype Cast (12 Heroes)

**Scope:** A tight 3-pack vertical slice (12 heroes, 3 pack items, 10 core shop items) to replace the placeholder cast in Antigravity and validate the new attribute, shop, and High/Nat 20 trigger systems.

**Why these 3 packs?**
- **Roles:** 3 Tanks, 5 Damage, 4 Support (supports 2-Tank and 2-Support compositions).
- **Systems Tested:** All 6 attributes (STR/DEX/CON/INT/WIS/CHA), d20 manipulation (Rosalind), uncapped recursion (Zark, Cinder), Large 2x2 form upgrade (Sir Dane), uncapped run scaling (Faelan, Zark), and cross-pack engines (Alert/Charge, Marked/On-hit, Burn, Ward, Control/Poison, Hex, Gold).

---

## Pack 1: You Meet at a Tavern (Starter Pack)

**Pack Item — Potion of Healing:** Held item. Holder automatically drinks it the first time they drop below 50% HP each fight; refills next fight. Scales by Act: Act 1 (`2d4+2`), Act 2 (`4d4+4`), Act 3 (`8d4+8`), Act 4 (`10d4+20`).

### 1. Arthur
- **Class / Subclass / Ancestry:** Fighter (Battle Master) · Human (Variant) · he/him
- **Role / Reach / Size:** Damage · Melee · Medium | **Weapon / Key:** STR / DEX
- **Attack:** Longsword (`1d8` slashing)
- **Ability — Longbow Volley:** Looses arrows at farthest foes first (wrapping if out of targets); each arrow triggers on-hit effects.
  - **Low / Mid:** 1 / 2 arrows.
  - **High:** 3 arrows + Arthur becomes **Alert** (dodges next attack against him).
  - **Nat 20:** 4 arrows + **entire party becomes Alert** for 1 attack.
- **Class Keyword / Ancestry Passive:** **Alert** (starts every fight Alert with bonus Charge).
- **Path 1 (Vertical) — Constant Vigilance:** Dodging triggers a longsword riposte; kills refresh Alert; gains Alert once at 50% HP (Second Wind). *(Tier IV: Each Alert dodges 2 attacks.)*
- **Path 2 (Splash) — Roll for Initiative:** Whenever *any* ally dodges an attack, they gain bonus Charge; Arthur's first volley applies **Exposed**. *(Tier IV: Whole party starts Alert.)*
- **Tags:** Alert, Charge, On-hit
- **Quest:** Dodge 25 attacks with Alert. **Reward — Flame Gauntlet:** +2 CON; replaces *Longbow Volley* with **Gauntlet Blast** (frontline fire cone hitting 1/2/3/4 nearest foes with **Burn**, keeping the High/Nat 20 Alert triggers).

### 2. Bram
- **Class / Subclass / Ancestry:** Cleric (Life Domain) · Dwarf · he/him
- **Role / Reach / Size:** Tank · Melee · Medium | **Weapon / Key:** STR / WIS
- **Attack:** Warhammer (bludgeoning)
- **Ability — Cure Wounds:** Heals closest ally (or self if alone).
  - **Low / Mid:** Small / solid heal.
  - **High:** Big heal, all excess becomes **Ward**, + free **Warhammer swing** at current target.
  - **Nat 20:** Heals all adjacent allies, excess becomes Ward, + **resets Channel Divinity** for the fight.
- **Class Keyword:** **Channel Divinity (Preserve Life)** — Once per fight, bursts healing onto a nearby ally who drops low.
- **Ancestry Passive:** **Stout** — Immune to push and knockback.
- **Path 1 (Vertical) — Disciple of Life:** Heals more at low HP; Bram gains +2 to his next d20 roll whenever he blocks or absorbs a hit. *(Tier IV: Heals the 2 closest allies.)*
- **Path 2 (Splash) — Divine Strike:** Bram and adjacent allies add `1d4` flat **Holy** damage to melee attacks; Bram's High/Nat 20 swings trigger adjacent allies' Holy strikes too. *(Tier IV: `1d8` Holy.)*
- **Tags:** Heal, Ward, Holy, Side by side
- **Quest:** Win 5 fights with no hero falling. **Reward — Blessed Ale:** +1 CON; adjacent allies start each fight with a small Ward, and any Potion of Healing on the team heals 50% more.

### 3. Faelan
- **Class / Subclass / Ancestry:** Wizard (School of Abjuration) · Elf · she/her
- **Role / Reach / Size:** Support · Ranged · Medium | **Weapon / Key:** INT / INT
- **Attack:** Ray of Frost (cold damage + slight attack-speed slow)
- **Ability — Arcane Ward:** Shields the ally taking the most damage.
  - **Low / Mid:** Small / solid Ward on most-threatened ally.
  - **High:** Wards top 2 threatened allies + **refunds 35% Charge**.
  - **Nat 20:** Wards the **entire party** + **casts again** on the lowest-HP ally.
- **Class Keyword:** **Arcane Recovery** — Regains Charge whenever a Ward she placed breaks.
- **Ancestry Passive:** **Fey Ancestry** — Immune to Charm and Sleep.
- **Path 1 (Vertical) — Projected Ward:** Larger Wards that never expire; every 3rd broken Ward grants Faelan **Advantage** on her next cast. *(Tier IV: Every cast hits top 2 allies.)*
- **Path 2 (Splash) — Spell Battery:** When Faelan's Ward breaks, the warded ally gains Charge (scales with Faelan's INT). *(Tier IV: Charge splashes to adjacent allies.)*
- **Tags:** Ward, Charge
- **Quest:** Wards absorb 1,000 total damage. **Reward — Owl Familiar:** Starts each fight flying a small Ward to the farthest ally; gains **+1 INT permanently** after every win (uncapped).

### 4. Wallaby
- **Class / Subclass / Ancestry:** Rogue (Thief) · Halfling · he/him
- **Role / Reach / Size:** Damage · Melee · Medium | **Weapon / Key:** DEX / DEX
- **Attack:** Shortsword (fast strikes)
- **Ability — Backstab:** Tumbles behind the farthest foe for Sneak Attack damage (`2d6 / 4d6 / 6d6 / 8d6`).
  - **Low / Mid:** Standard backline strike.
  - **High:** Heavy strike + **Stealth** (halves next hit taken and drops aggro).
  - **Nat 20:** Massive strike + **instant 100% Charge refund** + pops bonus **Gold**.
- **Class Keyword:** **Sneak Attack** — Attacks deal `+1d6` when an ally is also adjacent to the target.
- **Ancestry Passive:** **Lucky** — Rerolls natural 1s on abilities.
- **Path 1 (Vertical) — Slippery:** Kills refund 50% Charge and grant +2 to his next d20 roll. *(Tier IV: Kills refund 100% Charge.)*
- **Path 2 (Splash) — Fast Hands:** High and Nat 20 rolls steal **Gold** (board-only) and apply **Exposed** to the target. *(Tier IV: Double Gold.)*
- **Tags:** Backline, Gold, Ambush
- **Quest:** Carry 3 different items into winning fights. **Reward — Use Magic Device:** +1 DEX; ignores all item class/melee/ranged locks and gains **+1 item slot**.

---

## Pack 2: Around the Campfire

**Pack Item — Whetstone of the Hunt:** Held item. +1 DEX; attacks against **Marked** targets apply 1 stack of **Poison**.

### 5. Sir Dane
- **Class / Subclass / Ancestry:** Paladin (Oath of Devotion) · Human · he/him
- **Role / Reach / Size:** Tank · Melee · Medium (Large 2x2 mounted) | **Weapon / Key:** STR / CHA
- **Attack:** Longsword (radiant-edged slashing)
- **Ability — Compelled Duel:** Taunts target and applies **Marked**.
  - **Low / Mid:** Taunts + Marked.
  - **High:** Taunts + Marked + grants himself **Sacred Shield** (Ward + thorns).
  - **Nat 20:** Taunts + Marked + **allies attacking the target deal bonus Holy damage and gain Charge**.
- **Class Keyword:** **Divine Smite** — Periodically empowers his strike with flat Holy damage.
- **Ancestry Passive:** **Human Versatility** — +1 to all six attributes.
- **Path 1 (Vertical) — Oath of Devotion:** Taking hits from his Marked foe smites them for Holy damage. *(Tier IV: Mark automatically jumps to a new foe on kill.)*
- **Path 2 (Splash) — Call to Arms:** Allies hitting Dane's Marked target trigger their **on-hit effects twice** on their first hit. *(Tier IV: Every 3rd hit triggers twice.)*
- **Tags:** Marked, Holy, On-hit
- **Quest:** Allies trigger 20 hits on Marked targets. **Reward — Find Steed:** +2 STR, +2 CON; **transforms into a Large (2x2) mounted knight**. Starts combat with a cavalry charge that pushes enemies back and **Marks** every foe he collides with.

### 6. Lorcan
- **Class / Subclass / Ancestry:** Ranger (Hunter) · Half-Elf · he/him
- **Role / Reach / Size:** Damage · Ranged · Medium | **Weapon / Key:** DEX / WIS
- **Attack:** Longbow (fast ranged physical)
- **Ability — Hunter's Mark:** Fires a piercing arrow and applies **Marked**.
  - **Low / Mid:** Piercing shot + Marked.
  - **High:** Fires a **double-shot** (2x on-hit) at the Marked target.
  - **Nat 20:** Fires a **4-arrow volley** at the Marked target; if it dies, Mark jumps and **refunds 50% Charge**.
- **Class Keyword:** **Hunter's Mark** — Bonus damage on attacks against Marked foes (scales with WIS).
- **Ancestry Passive:** **Keen Sight** — Extended range and ignores partial dodge/cover penalties.
- **Path 1 (Vertical) — Colossus Slayer:** Every 3rd auto-attack against a Marked foe deals bonus damage and grants +1 to his next d20 roll. *(Tier IV: Every 2nd attack.)*
- **Path 2 (Splash) — Volley of Trophies:** Marked targets take bonus damage from *all* allies' on-hit effects and statuses. *(Tier IV: Killing a Marked foe grants the party attack speed.)*
- **Tags:** Marked, On-hit
- **Quest:** Kill 20 Marked targets. **Reward — Favoured Enemy:** Each elite or boss archetype killed adds a trophy granting permanent +1 DEX and +15% damage vs. that archetype for the rest of the run.

### 7. Juniper
- **Class / Subclass / Ancestry:** Druid (Circle of the Land, Forest) · Gnome · she/her
- **Role / Reach / Size:** Support · Ranged · Medium | **Weapon / Key:** WIS / WIS
- **Attack:** Thorn Whip (nature damage, light pull)
- **Ability — Entangle:** Erupts vines that **Root** a group of foes.
  - **Low / Mid:** Roots target area briefly.
  - **High:** Roots + applies stacking **Poison** + grants **Thorns** to adjacent allies.
  - **Nat 20:** Roots the **entire enemy frontline** + triggers all active **Poison** stacks twice immediately.
- **Class Keyword:** **Natural Recovery** — Gains bonus Charge when a Rooted enemy takes damage.
- **Ancestry Passive:** **Gnome Cunning** — Bonus Spell Resistance.
- **Path 1 (Vertical) — Overgrowth:** Rooted foes take double Poison damage, and Poison ticks extend Root duration. *(Tier IV: Roots spread to adjacent enemies.)*
- **Path 2 (Splash) — Circle of the Land:** Whenever a foe is Rooted or Poisoned, the lowest-HP ally heals and gains a small **Ward**. *(Tier IV: Heals the whole party.)*
- **Tags:** Control, Poison, Heal
- **Quest:** Root enemies 30 times. **Reward — Goodberries:** +2 WIS; spawns glowing berries at fight start that heal allies whenever they drop below 60% HP and grant +1 to their next d20 roll.

### 8. Rosalind
- **Class / Subclass / Ancestry:** Bard (College of Lore) · Human · she/her
- **Role / Reach / Size:** Support · Ranged · Medium | **Weapon / Key:** CHA / CHA
- **Attack:** Vicious Mockery (psychic damage + slight enemy damage debuff)
- **Ability — Bardic Inspiration:** Grants an ally an Inspiration die added to their next ability d20 roll (potency scales with CHA).
  - **Low / Mid:** Grants a `d6` Inspiration die.
  - **High:** Grants a `d8` die that **passes to another ally** after being spent.
  - **Nat 20:** **Inspires the entire party (`d10`)** and grants **+30% Charge**.
- **Class Keyword:** **Bardic Inspiration** — Stackable d20 bonus dice.
- **Ancestry Passive:** **Socialite's Poise** — Starts combat with bonus Charge when positioned beside an ally.
- **Path 1 (Vertical) — Pass the Round:** Inspired allies pass a diminishing die up to CHA times; any ally rolling a **Nat 20** with Inspiration refunds Rosalind 50% Charge. *(Tier IV: Dice never shrink.)*
- **Path 2 (Splash) — Encore:** Adjacent Inspired ally gains massive **INT (Charge speed)** for machine-gun casting. *(Tier IV: Applies to both adjacent allies.)*
- **Tags:** d20, Charge, Side by side
- **Quest:** Pass Bardic Inspiration 25 times. **Reward — Instrument of the Bards:** +2 CHA; Inspired allies expand their **Nat 20 range to 19–20**.

---

## Pack 3: Off the Beaten Path

**Pack Item — Ember-Iron Bracers:** Held item. +1 CON; whenever the holder lands a **High** or **Nat 20** ability roll, they deal a burst of **Burn** to adjacent enemies.

### 9. Cinder
- **Class / Subclass / Ancestry:** Sorcerer (Draconic Bloodline, Red) · Tiefling · she/her
- **Role / Reach / Size:** Damage · Ranged · Medium | **Weapon / Key:** CHA / CHA
- **Attack:** Fire Bolt (fire damage)
- **Ability — Fireball:** Hurls fire at the densest enemy clump, dealing fire damage + **Burn**.
  - **Low / Mid:** Standard Fireball + light Burn.
  - **High:** Fireball + **+2 Sorcery Points** (at 4 points, automatically **Twins** a free Fireball at the next densest group).
  - **Nat 20:** Fireball + **detonates all Burn** on the board immediately.
- **Class Keyword:** **Metamagic (Sorcery Points)** — Single bar of 4; auto-Twins at full.
- **Ancestry Passive:** **Hellish Resistance** — Reduced fire/Burn damage taken.
- **Path 1 (Vertical) — Draconic Surge:** Enemy Burn ticks feed Cinder Sorcery Points and +1 to her next d20 roll. *(Tier IV: Twins at 3 Sorcery Points.)*
- **Path 2 (Splash) — Wildfire:** Twinned casts apply **Exposed** and shred enemy Spell Resistance. *(Tier IV: Burn spreads on enemy death.)*
- **Tags:** Burn, Charge
- **Quest:** Apply or detonate Burn on 30 foes. **Reward — Dragon's Hoard:** Gains **+1 CHA** for every 25 Gold currently held (cap +6), bridging Burn and Gold strategies.

### 10. Zark
- **Class / Subclass / Ancestry:** Barbarian (Totem Warrior, Bear) · Half-Orc · he/him
- **Role / Reach / Size:** Tank · Melee · Medium | **Weapon / Key:** STR / CON
- **Attack:** Greataxe (heavy slashing)
- **Ability — Bear Cleave:** Sweeps his greataxe across frontline foes.
  - **Low / Mid:** Heavy physical cleave.
  - **High:** Cleave + stacks **Bear Rage** (flat damage reduction + attack speed for the rest of the fight, uncapped).
  - **Nat 20:** Cleave + **2 stacks of Bear Rage** + brief **Stun** + **50% Charge refund**.
- **Class Keyword:** **Rage** — Stacking combat state driving defense and speed.
- **Ancestry Passive:** **Relentless Endurance** — Once per fight, survives lethal damage at 1 HP.
- **Path 1 (Vertical) — Relentless Bear:** Taking heavy hits grants Zark +2 to his next d20 roll and heals a sliver of CON. *(Tier IV: Rage stacks also grant Armor Penetration.)*
- **Path 2 (Splash) — Totem Roar:** Gaining a Rage stack gives adjacent allies a burst of **attack speed** and **Charge**. *(Tier IV: Affects the entire party.)*
- **Tags:** Rage, Side by side, Control
- **Quest:** Reach 5 stacks of Bear Rage in a single fight. **Reward — Relentless Hide:** Gains **+1 CON permanently** after every fight survived where he dropped below 50% HP.

### 11. Naill
- **Class / Subclass / Ancestry:** Monk (Way of the Open Hand) · Wood Elf · they/them
- **Role / Reach / Size:** Damage · Melee · Medium | **Weapon / Key:** DEX / WIS
- **Attack:** Unarmed Strike (very fast; builds 4-pip **Ki** bar)
- **Ability — Flurry of Blows:** Rapid unarmed barrage (triggers on-hit).
  - **Low / Mid:** 3 / 4 quick strikes.
  - **High:** Flurry + **instantly fills Ki bar**, firing a **Ki Strike** (Stagger + bonus hit).
  - **Nat 20:** Flurry + **two Ki Strikes** + leaves **Afterimage** (next 2 attacks against Naill miss).
- **Class Keyword:** **Ki** — Single bar of 4; next attack at full bar is a Ki Strike (abilities read/fill Ki, never spend it).
- **Ancestry Passive:** **Fleet of Foot** — Faster movement and target-switching on the grid.
- **Path 1 (Vertical) — Open Hand:** Every Ki Strike triggers on-hit effects twice and grants +1 to Naill's next d20 roll. *(Tier IV: Ki bar shrinks to 3.)*
- **Path 2 (Splash) — Flowing Leaves:** Ki Strikes **Stagger** and **Mark** adjacent foes. *(Tier IV: Ki Strikes feed Charge to the lowest-Charge ally.)*
- **Tags:** On-hit, Control, Marked
- **Quest:** Trigger 25 Ki Strikes. **Reward — Wraps of the Hundred Fists:** +2 DEX; Ki Strikes grant **Advantage** on Naill's next ability d20 roll, and dodging via Afterimage grants +1 Ki.

### 12. Nettle
- **Class / Subclass / Ancestry:** Warlock (The Fiend) · Halfling · she/her
- **Role / Reach / Size:** Support · Ranged · Medium | **Weapon / Key:** CHA / CHA
- **Attack:** Eldritch Blast (force damage)
- **Ability — Infernal Hex:** Curses a foe with **Hex** (takes bonus necrotic damage on every hit).
  - **Low / Mid:** Applies Hex to 1 foe.
  - **High:** Applies Hex + **Necrosis**; if target dies, Hex jumps and heals Nettle's team.
  - **Nat 20:** **Hexes 3 foes** and reduces their attack speed / d20 rolls for 4s.
- **Class Keyword:** **Hex** — Per-hit damage amplifier that transfers on death.
- **Ancestry Passive:** **Brave** — Immune to Frighten.
- **Path 1 (Vertical) — Fine Print:** Hexed foes taking status damage (Burn, Poison, Necrosis) suffer extra hellfire bursts. *(Tier IV: Hex never fades and stacks twice.)*
- **Path 2 (Splash) — Dark One's Bargain:** Allies who kill a Hexed foe gain **Charge** and **Advantage** on their next ability roll. *(Tier IV: Elite kills drop bonus Gold.)*
- **Tags:** Hex, On-hit, Necrosis, d20
- **Quest:** Have 15 Hexed foes die. **Reward — Infernal Contract:** +2 INT; each Hexed death adds a glowing clause for the rest of the fight (+1 to d20 rolls and +10% Charge speed, uncapped per fight).

---

## Starter Core Shop Items (10 Items for Prototype Testing)

### Classic Weapons (Favoured Class Bonuses)
1. **Flametongue** *(Melee · Favoured: Fighter, Paladin)* — +2 STR; every 2nd strike applies **Burn**. *(Favoured: Burn spreads to an adjacent foe.)*
2. **Oathbow** *(Ranged · Favoured: Ranger, Fighter)* — +2 DEX; attacks vs. **Marked** foes ignore 30% AC and build bonus Charge. *(Favoured: High rolls apply Marked.)*
3. **Staff of Power** *(Ranged · Favoured: Wizard, Sorcerer, Warlock)* — +2 INT; casting grants a small **Ward**. *(Favoured: Nat 20s refund 30% Charge.)*
4. **Sunblade** *(Melee · Favoured: Cleric, Paladin)* — +1 STR, +1 WIS; attacks deal **Holy** damage. *(Favoured: High rolls pulse a small heal.)*

### Multiclass Energy Items
5. **Amulet of the Devout** — +1 CHA; every 5s, next attack triggers a flat **Holy** Smite.
6. **Metamagic Rod (Quicken)** — +2 INT; first ability cast each fight charges at **2x speed**.
7. **Dragonhide Belt** — +1 DEX, +1 WIS; grants any hero a 4-hit **Ki bar** (4th hit Staggers).

### d20 / INT / WIS Lever Items
8. **Stone of Good Luck** — +1 WIS; rerolls the holder's first **Low** ability roll each fight.
9. **Clockwork Amulet** — +2 INT; once per fight, guarantees a **High** roll instead of rolling the d20.
10. **Headband of Intellect** — +3 INT; if the holder hits the **1-cast/second cap**, excess Charge speed converts into **+1 to ability d20 rolls**.

---

## 3 Benchmark Test Comps (Prototype Validation)

1. **The Rage Snowball (d20 Recursion):** Zark + Rosalind (*Pass the Round*) + Faelan (*Spell Battery*) + Cinder. *Verify:* Rosalind's dice push Zark into constant High rolls, stacking uncapped Bear Rage while Faelan's Wards fuel Charge.
2. **Machine-Gun Marks (On-Hit Focus Fire):** Sir Dane (*Call to Arms*) + Lorcan (*Colossus Slayer*) + Naill (*Open Hand*) + Nettle (*Dark One's Bargain*). *Verify:* Rapid multi-hits shred Marked+Hexed targets and chain Charge + Advantage across kills.
3. **Frontline Wildfire (Burn & Alert):** Arthur (*Flame Gauntlet* quest) + Bram (*Divine Strike*) + Cinder (*Draconic Surge*) + Faelan (*Spell Battery*). *Verify:* Bram/Faelan keep Arthur alive while Burn feeds Cinder's Twinned Fireballs and Nat 20 detonations.