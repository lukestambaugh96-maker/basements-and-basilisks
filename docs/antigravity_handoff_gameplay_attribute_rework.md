# Basements & Basilisks — Antigravity Systems Handoff

**Purpose:** Apply these core gameplay, attribute, shop, and combat-trigger updates on top of the last Claude prototype (0.21/0.22 baseline) while replacing the old placeholder cast with the reworked heroes in `prototype-initial-cast.md`.

**Standing Design Rules to Preserve:**
- **Party size:** Always 4 heroes.
- **No trait-counting:** Tags are mechanical labels only ("this hero makes the Y that feeds my X"). Never grant stat bonuses for counting matching tags.
- **One sentence per mechanic:** Keep abilities, keywords, ancestry passives, and paths readable at a glance. Never explain design philosophy ("this hero is for...") on player-facing cards.
- **No blanket racial traits:** Ancestry passives are unique per hero.
- **Global cast speed cap:** No hero ability may fire more than once per second.
- **Loss rule:** Keep the "Piggy Bank" single free-loss system (wins fill the bank; first loss breaks it, pays out, and lets you shop and retry the fight; second loss ends the run).

---

## 1. Six-Attribute Rework

Each hero still uses a **Dual-Attribute Split**: a **Weapon Attribute** (scales basic attacks) and a **Key Attribute** (added to the hero's ability d20 roll and scales ability/heal/Ward potency).

Crucially, **d20 High-roll scaling is decoupled from INT** and moved onto each hero's **Key Attribute**. Every attribute now has a clear, distinct job:

| Attribute | Primary Combat Effect | Design Role |
| :--- | :--- | :--- |
| **STR** | Melee weapon damage + **Armor Penetration** | Frontline damage and tank-busting (ranged physical gets no STR unless thrown). |
| **DEX** | **Attack Speed** + DEX weapon damage | Rapid auto-attacks, visual speed on the board, and on-hit engine procs. |
| **CON** | Max HP and frontline durability | Raw survivability and tank scaling. |
| **INT** | **Charge Speed** (cast cadence) | Universal "engine speed" stat for casters and ability-driven heroes. |
| **WIS** | **Spell Resistance** + **d20 Consistency** | Raises the hero's **minimum d20 roll floor** so combo engines don't brick on Low rolls. |
| **CHA** | **Commanding Presence** | Scales the potency of buffs and debuffs applied by the hero. |

### Implementation Notes for INT & WIS
- **INT (Charge Speed):** Faster Charge generation toward casting. Because of the global 1-cast/second cap, high-INT builds should eventually be able to convert excess Charge speed via items or future heroes (e.g., *Headband of Intellect*).
- **WIS (d20 Floor):** Each point (or breakpoint) of WIS raises the minimum natural roll on the hero's ability d20 (e.g., treating rolls below the floor as the floor value) while also contributing Spell Resistance.
- **Linear Scaling:** Keep attribute scaling linear (flat gains per point rather than opaque percentage multipliers) so every +1 or Tier III ASI (+2) feels impactful.

---

## 2. The d20 Trigger & Recursion Philosophy

To prevent engines from feeling like flat damage modifiers and to give every hero a distinct "star" moment, ability roll bands follow a strict structure:

- **Low / Mid:** Baseline effect (standard damage, heal, Ward, or status).
- **High:** Triggers the hero's **signature state change or recursion mechanic** (e.g., stacking Bear Rage, refreshing Alert, building Sorcery Points to Twin a spell, free weapon swing).
- **Natural 20:** A board-bending **"tabletop cheer" moment** that breaks action economy or impacts the whole party (e.g., whole party gains Alert, detonating all Burn on the board, casting twice, massive Charge refund).

### Teambuilding as a Trigger Machine
- Synergies should come from **chaining triggers across heroes** (action economy, state changes, and recursion), not just inflating damage numbers.
- **Producers & Payoffs:** Every mechanic in the active prototype must have both producers and payoffs (no orphan tags).

---

## 3. Tier II Paths, Promotions & Retraining

Each hero keeps **one ability forever** (with rare Quest Signature Item exceptions). To keep Tier II paths from clashing with High/Nat 20 triggers, separate their jobs:

- **The Ability (High / Nat 20)** = **The Firework** (the hero's signature verb).
- **The Tier II Path** = **The Wiring**:
  - **Path 1 (Vertical):** Fuels the hero's own firework (e.g., rigging their own d20 rolls, triggering extra procs off their signature state).
  - **Path 2 (Splash):** Wires their firework into another engine or teammate (e.g., feeding Charge, spreading statuses, buffing adjacent allies).
- **Tier III:** Ability Score Improvement (+2 to one attribute).
- **Tier IV:** Visible payoff (doubles the path's main number or expands its effect to the whole party).
- **Retraining (Anti-Lock-In):** Allow players to retrain a hero's Tier II path at Camp / Rest nodes (free or low gold cost) so Act 1 picks don't trap players when they pivot in Act 2.

---

## 4. Shop, Pivoting & Pack Drafting Rework

**Problem Being Solved:** In previous versions, buying duplicates to tier up created sunk-cost lock-in on starter heroes, and drafting new 4-hero packs diluted the shop pool.

### New Shop Rules
1. **No Duplicate Hunting:** Owned heroes **never** appear in the shop as Tier I duplicates. Instead, if an owned hero rolls in the shop, it appears directly as their **Next-Tier Upgrade**.
2. **Map-Node Leveling:** Tier-ups can also be earned at non-combat map nodes (Training / Camp nodes), reducing pressure on shop RNG.
3. **Pre-Tiered Recruits (Clean Pivoting):** As the run progresses into later acts, unowned heroes naturally appear in the shop **starting at higher tiers** (e.g., Tier II in Act 2, Tier II/III in Act 3). Buying a pre-tiered hero immediately triggers their Tier II Path choice pop-up so players can tailor them to their current comp on the spot.
4. **Slot Weighting / Separation:** Separate or weight **Recruit Slots** vs. **Upgrade Slots** in the shop (e.g., 2 Recruit slots + 1 Upgrade slot, or guaranteed recruit slots) so owned starters don't crowd out fresh pack heroes.
5. **Pack Drafting:** At run start and between acts, the player drafts a themed **4-hero pack**. Taking a pack adds its 4 heroes and **1 Pack Item** to the shop pool.

---

## 5. Quests & Item Architecture

### Hero Quests & Signature Rewards
Each hero has a mechanic-driven **Quest Goal** (e.g., *"Dodge 25 attacks with Alert"*). Completing it grants a unique reward falling into one of three archetypes:
1. **Rule-Benders / Form Upgrades:** Visibly alters the hero or board footprint (e.g., Sir Dane becoming a Large 2x2 mounted unit; Arthur's *Flame Gauntlet* transforming his ability into a frontline fire cone).
2. **d20 & Recursion Accelerators:** Expands Nat 20 ranges, grants Advantage, or shares WIS floors.
3. **Uncapped Run Scalers:** Permanent per-win or per-fight stat growth requiring early investment (e.g., Faelan's *Owl Familiar* granting +1 INT per win; Zark's *Relentless Hide* granting +1 CON).

### Shop Item Structure
Keep item effects clean, classic D&D in flavor, and worth roughly 25–50% of a tier-up. Organize the shop pool into four buckets:
1. **Pack Items:** 1 unique item unlocked per drafted pack (scaling by act where appropriate, like *Potion of Healing*).
2. **Classic D&D Weapons:** Melee or Ranged locked, with a bonus effect when held by a **Favoured Class**.
3. **Multiclass Energy Items:** Let any hero dip into another class's signature mechanic (Smite, Ki bar, Quicken Metamagic, Gold-on-crit).
4. **d20 / INT / WIS Lever Items:** Items that directly manipulate roll floors, guarantee a High roll once per fight, or convert excess INT Charge speed past the 1-cast/second cap.