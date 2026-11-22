# Basements & Basilisks — Map, Traversal & 3-Act Campaign Design

**Status:** Draft for Review  
**Scope:** Map topology, Camp Shop flow, `?` Mystery events, Act traversal identities, tiered encounter pools, curated battle maps, and the 3-Act campaign (*Phandalin* → *White Plume Mountain* → *The Hells*).  
**Future-Proofing:** Every Act is defined as a self-contained data module tagged by `actTier` (`1 | 2 | 3`) so **Choose Your Next Act** branching between Acts can be added later with zero engine refactor.

---

## 1. Core Loop & Camp Shop Changes

### A. New Between-Node Flow (No Shop Combat Preview)
Because normal and dangerous fights are now rolled randomly from the Act’s tier pool when entered, the Shop no longer spoils the upcoming fight:

1. **Start of Act / After Combat Win → Camp Shop**
   - The Camp Shop automatically refreshes (unless frozen) and opens so you can spend gold, recruit, upgrade, and equip **before** committing to your next route choice.
   - **Combat Preview (`#nextFight`) Removed:** Replaced by a compact **Act Boss Reminder** banner (e.g., *Act 1 Boss: Venomfang — Young Green Dragon*) and a **"Choose Next Path →"** button leading to the Map.
   - **Piggy Bank Retry Exception:** If your Piggy Bank just broke on a loss, returning to the Camp Shop *does* show **"Retry: [Encounter Name] (12% softer)"** and routes straight back into that exact fight.
2. **Map → Pick Connected Node**
   - You only see node **types** (`⚔ Fight`, `☠ Dangerous`, `? Mystery`, `★ Miniboss`, `♨ Campfire`, `✦ Training`, `❖ Quest Board`, `◆ Treasure`, `⚖ Curio`, `✧ Multiclass` *(shown by its unique class location name)*, `♛ Boss`), any Act traversal markers (hazards, wandering miniboss), and the Act Boss at the top.
   - Clicking a combat node rolls a fresh encounter from that Act’s pool, picks one of the Act’s battle maps, and opens directly into **Tactical Deployment** so you can still read the enemies and position your 4 heroes before hitting **Fight**.
   - Visiting a non-combat stop (`?`, `♨`, `✦`, `❖`, `◆`, `⚖`, `✧`) resolves the event and returns you to the Map (without refreshing the Camp Shop, though you can always open the Camp Shop tab/button to equip newly looted items or spend found gold!).

### B. Whole-Shop Freeze Only
- Remove individual per-slot hero/item locks (`lockH`, `lockI`).
- **Freeze Shop** locks the **entire shop** (all remaining hero & item slots) through the next post-combat refresh.
- Reroll unfreezes the shop immediately. Buying individual items/heroes from a frozen shop leaves empty slots while keeping the rest frozen until the next refresh.
- *Design rationale:* Sharper economy tension (saving 1 high-value offer costs your free post-fight refresh) and cleaner shop UI.

---

## 2. Constricting Map Topology (Rule-Based DAG)

No ML or heavy procedural model is required. [`genMap()`](../src/06-adventure.js) becomes a lightweight, deterministic **non-crossing Directed Acyclic Graph (DAG)** generator (~50 lines of JS):

### A. Dimensions & Pacing
- **9 Rows per Act (`r = 0..8`):**
  - **Row 0:** Always `⚔ Fight` (entry encounters from `earlyNormal` so Fight 1 is fair).
  - **Rows 1–6:** Mixed branching rows combining `⚔ Fight`, `☠ Dangerous`, `? Mystery`, `♨ Campfire`, `✦ Training`, `❖ Quest Board`, `◆ Treasure`, `⚖ Curio`, `✧ Multiclass` (single-class named shrine/guild), and Act-specific special nodes (e.g., `★ Klarg’s Hideout`).
  - **Row 7:** Pre-boss staging row (narrowed to 2 nodes — e.g., guaranteed `♨ Campfire` on one side and `✦ Training` / `⚖ Curio` on the other).
  - **Row 8:** Single `♛ Act Boss` node.
- **Expected Run Length:** ~4–6 combats per Act (**~14–16 fights** across a full 3-Act run, up slightly from 12, giving Hero Quests and Tier III/IV builds room to breathe).

### B. Constricting Graph Rules
Each Act specifies a **row-width silhouette** (e.g., `[3, 3, 2, 3, 2, 3, 3, 2, 1]`) so paths naturally pinch into bottlenecks and fan back out:
1. **Explicit Edges (`node.next = [i, ...]`):** [`nextNodes(run)`](../src/06-adventure.js) returns only the nodes connected to `run.adv.pos`.
2. **Non-Crossing Invariant:** For two nodes `a < b` in row `r`, every outgoing edge from `a` satisfies `target(a) <= target(b)`. This keeps SVG map lines clean and guarantees distinct left/center/right lanes.
3. **Connectivity Invariant:** Every node in rows `0..7` has at least 1 outgoing edge (1–2 max so choices genuinely constrict), and every node in rows `1..8` has at least 1 incoming edge.
4. **Pacing Guards:**
   - No `☠ Dangerous` on Row 0 (and at most 1 per row in Act 1).
   - No back-to-back `♨ Campfire` on the same edge.
   - At least 1 `⚖ Curio`, 1 `✦ Training`, and **1–2 uniquely named `✧ Multiclass` nodes** guaranteed per Act.
   - `? Mystery` accounts for ~22–28% of middle-row nodes.

### C. Single-Class Multiclass Map Nodes (`✧`)
Per [`v0.23_character_design_philosophy.md`](./v0.23_character_design_philosophy.md), each Multiclass node on the map offers **exactly one class dip** and displays its **unique location name** directly on the map—turning multiclassing into an intentional routing decision on the constricting graph (e.g., steering through a Dangerous fight to reach *Oath Shrine* before a *Curio Merchant*):
- **Spawn Rules:** **1–2 per Act** on branching middle rows (`r = 1..6`), never repeating the same class within a run.
- **Eligibility & Fallback:** Pick any hero without an existing multiclass dip whose base class differs from the node’s class. If you decline (or no hero is eligible), you may take a fallback (**+4g** or **+1 Attribute**) so the node is never dead.
- **Synergy with Curio Merchant (`⚖`):** Taking a Multiclass dip immediately adds that Class Keyword to `u.kw`, unlocking that class’s `Unique` Trigger/Modifier items at subsequent `⚖ Curio` stops!

| Class | Unique Map Node Name | Keyword | Class | Unique Map Node Name | Keyword |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Fighter** | **Sparring Grounds** | *Action Surge* | **Bard** | **Minstrel’s Stage** | *Bardic Inspiration* |
| **Rogue** | **Thieves’ Guild** | *Sneak Attack* | **Druid** | **Sacred Grove** | *Wild Shape* |
| **Cleric** | **Wayside Chapel** | *Channel Divinity* | **Ranger** | **Hunter’s Lodge** | *Hunter’s Mark* |
| **Paladin** | **Oath Shrine** | *Smite* | **Monk** | **Quiet Monastery** | *Ki* |
| **Wizard** | **Arcane Study** | *Arcane Recovery* | **Sorcerer** | **Leyline Well** | *Metamagic* |
| **Barbarian** | **Berserker’s Cairn** | *Rage* | **Warlock** | **Patron’s Altar** | *Hex* |

### D. `?` Mystery Node Resolution
Stepping on a `?` node rolls from a weighted table (with **pity / no-repeat tracking** per Act so you never see the same event twice):
- **~55% Act Choice Event:** 2–3 crisp D&D choices (risk/reward, gold, Training, Quest boost, rare items, curses, or optional fights).
- **~20% Surprise Ambush:** An unexpected fight from the Act’s `normal` pool (keeps `?` tense; rewards normal win gold + shop refresh).
- **~15% Hidden Treasure:** Free treasure draft (`e + 3` rarity roll).
- **~10% Wandering Curio Peddler:** Special item offer (1–2 Rare/Very Rare items at a discount).

---

## 3. Encounter Tiers, Difficulty Curve & Battle Maps

### A. Decoupled Pools + Smooth Depth Scaling
Each Act defines four separate encounter pools (drawn via a **no-repeat shuffle bag** per Act):
- `earlyNormal`: Fight 1–2 friendly encounters (Row 0–1).
- `normal`: Standard Act encounters (Rows 1–6).
- `dangerous`: Dedicated, mechanically nastier Elite encounters (not stat-inflated normal fights).
- `miniboss`: Optional named Act miniboss (e.g., **Klarg** in Act 1, **Wandering Enforcer** in Act 3).
- `boss`: Rotating Act Boss pool (1 rolled when the Act starts, displayed at Row 8).

Difficulty still scales smoothly by Act & Row via `curveAt(d)` (recalibrated for ~5 fights/Act so Act 1 stays punchy and Act 3 Bosses remain a real build check).

### B. Curated Battle Maps per Act (3–4 Layouts)
Instead of procedurally generating combat tiles (which risks broken 2×2 Large unit pathing or unfair sightlines), each Act owns **3–4 handcrafted 10×10 battlefield templates** built on the existing tile engine ([`src/01-geo.js`](../src/01-geo.js), [`src/10-board.js`](../src/10-board.js)).
- Normal & Dangerous encounters draw from their compatible Act templates (with optional **horizontal mirroring** for free tactical variety).
- Named Minibosses and Bosses pin their signature arena map.

---

## 4. The 3-Act Campaign & Traversal Identities

### Act 1: Phandalin & the Triboar Trail *(The Frontier Road)*
- **Act Tier:** 1 | **Theme:** Frontier woodland, caves, and town outskirts
- **Map Silhouette:** `[3, 3, 3, 2, 2, 3, 3, 2, 1]` — trails widen through the Neverwinter Woods, **pinch into Phandalin** at Rows 3–4 (town stops: Campfire, Quest Board, Curio, Training), then branch out toward the boss lair.
- **Traversal Identity — Stationary Optional Miniboss (`★ Cragmaw Hideout`):**
  - **Klarg** spawns as a visible, marked optional miniboss node on one lane in Row 2 or Row 5.
  - Committing to Klarg’s branch pits you against **Klarg (Bugbear Chief) + Ripper (Dire Wolf) + Goblin Skirmishers** for a guaranteed **Rare/Very Rare item + bonus gold**; other branches let you bypass him safely.
  - *(Engine hook: supports an optional `wanderer: true` flag later if we ever want Klarg’s Raiding Party to roam lanes!)*
- **Curated Battle Maps (4):**
  1. **Triboar Trail (`forest`):** Classic 3-lane road with trees (`O`) and flank brush (`v`).
  2. **Cragmaw Cave (`cave`):** Rock pillars (`O`), narrow stream (`~`), and tight central choke.
  3. **Tresendar Cellar (`dungeon`):** Stone walls (`#`), doorways, crates (`c`), short sightlines.
  4. **Thundertree Ruins (`forest`):** Broken stone pillars (`O`), difficult rubble (`,`), open center for dragons/casters.
- **Encounter Pools:**
  - *Early Normal:* **Goblin Ambush** (Triboar Road), **Wolf Pack**, **Redbrand Ruffians**
  - *Normal:* **Twig Blight Swarm**, **Hobgoblin Patrol (Shield Wall)**, **Cragmaw Reavers**, **Skeleton Watch**
  - *Dangerous (Elite):* **Old Owl Well (Necromancer + Conjurer)**, **Wyvern Tor War Band (Ogre + Warlord)**, **Cragmaw Owlbear**, **Wave Echo Flameskull**
  - *Optional Miniboss:* **Klarg’s Hideout** (Klarg — high-burst melee ambusher + Ripper + Raiders)
  - *Rotating Bosses (3):*
    1. **Nezznar (The Black Spider):** Necrosis, webs (`w`), and spider brood summoning *(existing `nezznar`, tuned for Act 1 Boss)*.
    2. **Venomfang (Young Green Dragon):** 2×2 Large dragon; **Poison Breath** cone, high AC, wing pushback / poison cloud *(new)*.
    3. **Glasstaff (Iarno Albrek):** Upgraded boss version of Battle Mage — Lightning Bolt lines, Hold Person root, Redbrand Shieldbearers + arcane ward *(reworked)*.
- **Act 1 `?` Mystery Events (Sample Pool):**
  - *Barthen’s Provisions* (buy discounted supplies or claim free starter stash)
  - *Sildar Hallwinter in Chains* (pay gold / take a quick skirmish to gain a free Hero Training or Quest boost)
  - *Agatha the Banshee* (sacrifice an item or gold for a major stat/tier blessing)
  - *Shrine of Tymora (Luck)* (roll a d20 gamble: huge gold/item on High/20, small tax on Low)
  - *Redbrand Tavern Brawl* (fight for bounty gold or intimidate with high-CHA hero for free loot)
  - *Reidoth the Druid* (free Campfire retrain or Piggy Bank refill)

---

### Act 2: White Plume Mountain *(The Funhouse Dungeon)*
- **Act Tier:** 2 | **Theme:** Classic Gygaxian trap-filled volcanic dungeon
- **Map Silhouette:** `[2, 3, 3, 2, 3, 3, 2, 2, 1]` — tight corridor forks leading into side-wing chambers that rejoin the central shaft.
- **Traversal Identity — Dungeon Hazards & Relic Vaults:**
  - 2–3 high-reward nodes per Act sit behind a visible **Dungeon Hazard** badge (e.g., *Boiling Steam*, *Frictionless Floor*, *Anti-Magic Corridor*):
    - *Boiling Steam:* All units take minor fire ticks during the fight (rewards Fire Resist / Ward / fast kill).
    - *Frictionless Floor:* Push/knockback distances doubled & movement slowed slightly.
    - *Arcane Dampener:* Slower initial ability charge for both sides.
  - Clearing a Hazardous node yields **Vault Loot** (bonus gold + elevated rarity item draft).
- **Curated Battle Maps (4):**
  1. **Boiling Bubble Chamber (`cave`):** Water (`~`) perimeter, steam vents (`^`), open center.
  2. **Frictionless Hall (`dungeon`):** Long narrow corridor (`#`) with side alcoves and chasm/pit edges (`_`).
  3. **Inverted Ziggurat (`dungeon`):** Stepped pillar tiers (`O`) and corner water hazards (`~`).
  4. **Shadow Crypt (`cave`):** Cramped tomb walls (`#`), crates/sarcophagi (`c`), flank passages.
- **Encounter Pools:**
  - *Normal:* **Kelpie & Mire Stalkers**, **Gargoyle Sentinels**, **Flesh Golem & Cultists**, **Manticore Brood**, **Wight & Ghoul Pack**, **Shadow Assassins**
  - *Dangerous (Elite):* **Ctenmiir the Vampire** (lifesteal/necrosis), **Efreeti Guard** (fire/aoe), **Chain Golem & Steam Mephits**, **Ogre Mage Enforcers**
  - *Rotating Bosses (4):*
    1. **Keraptis (or Simulacrum of Keraptis):** Mad archmage; teleports/summons constructs, elemental AoEs, arcane wards.
    2. **Blackrazor (Sentient Greatsword & Wielder):** Soul-drinking melee juggernaut; gains massive Ward + Haste + Damage whenever any unit dies (even allies/summons!).
    3. **Gynosphinx:** 2×2 Large celestial beast; **Roar of Ages** (AoE fear/stun + charge drain) and **Temporal Shift** (rewinds/cleanses debuffs).
    4. **Giant Crab (in the Boiling Bubble):** 2×2 Large armored titan; sky-high AC, **Crushing Claw** grapple/root, and **Boiling Splash** hazards.
- **Act 2 `?` Mystery Events (Sample Pool):**
  - *Vault of Wave* (test of WIS/bravery to claim a temporary/unique trident boon or Rare water relic)
  - *Vault of Whelm* (risk a trap ambush to earn a massive STR/melee upgrade)
  - *The Super-Tetanus Pit* (gamble crossing for treasure vs. taking a 1-fight poison/HP handicap)
  - *The Talking Wall’s Riddle* (free Quest acceleration or Curio pick)
  - *Keraptis’s Mirror* (duplicate an equipped Common/Uncommon item or retrain a hero path)
  - *Turnkey’s Toll* (pay gold to remove all Dungeon Hazards on the remaining map)

---

### Act 3: The Hells *(The Infernal Descent)*
- **Act Tier:** 3 | **Theme:** Fire, iron, blood war, and cosmic endgame bosses
- **Map Silhouette:** `[3, 3, 2, 3, 2, 2, 2, 2, 1]` — steep, constricting descent through the Nine Hells with high Elite density and fewer safe rest stops.
- **Traversal Identity — Wandering Infernal Enforcer + Devil’s Bargains:**
  - **Wandering Miniboss (`⚑ Pit Fiend / Infernal Vanguard`):** Spawns on Row 2 and **steps forward/sideways 1 lane** along connected map nodes every time you clear a node.
    - Its current position is clearly marked on the map with a pulsing banner.
    - Stepping onto its node triggers a brutal miniboss showdown for a **guaranteed Very Rare/Legendary item + +10g** (and removes it for the rest of the Act).
    - Routing around it lets you survive—at the cost of giving up optimal event lanes!
  - **Devil’s Bargain `?` Nodes:** High-stakes pacts offering instant late-game power spikes (free Tier IV promotion, Legendary item, massive gold) in exchange for real costs (break Piggy Bank, lose gold, or grant the Act Boss +10% HP).
- **Curated Battle Maps (4) — New `hells` Visual Theme:**
  1. **Avernus Wastes (`hells`):** Cracked obsidian floor, lava fissures (`^`), and chasm drops (`_`).
  2. **Iron Citadel (`hells`):** Brimstone walls (`#`), arrow slits (`a`), and choke gates.
  3. **River Styx Crossing (`hells`):** Dark river (`~`) splitting the board with 2–3 narrow bridges.
  4. **Throne of the Ninth (`hells`):** Grand symmetrical boss arena with lava braziers (`^`) and pillars (`O`).
- **Encounter Pools:**
  - *Normal:* **Bearded Devil Phalanx**, **Hell Hound Pack**, **Spined Devil Volley**, **Imp & Cambion Coven**, **Bone Devil Guard**, **Narzugon Riders**
  - *Dangerous (Elite):* **Erinyes Executioners**, **Horned Devil & Chain Devils**, **Ice Devil (Gelugon) & Frost Wardens**, **Blood War Demon Incursion**
  - *Wandering Miniboss:* **Pit Fiend Enforcer** (2×2 Large fire/poison aura, summons Bearded Devils)
  - *Rotating Bosses (3):*
    1. **Orcus (Prince of Undeath):** 2×2 Large; **Wand of Orcus** massive necrosis waves, raises fallen foes/zombies, punishes slow attrition comps.
    2. **Asmodeus (Lord of the Ninth):** Ruby Rod hellfire beams, devil summons, **Infernal Command** (stuns/charms + massive Ward), tactical control boss.
    3. **Tiamat (Queen of Dragons):** 2×2 Large; cycles **Five Breath Weapons** (Fire, Poison, Lightning, Cold, Acid cones/lines) testing party positioning, SR, and sustain.
- **Act 3 `?` Mystery Events (Sample Pool):**
  - *The Infernal Contract* (free Tier-Up for any hero, but breaks your Piggy Bank if intact)
  - *Soul Coin Hoard* (gain +14g, but the Act Boss gains +8% damage)
  - *Ferryman of the Styx* (trade a Rare item for a Legendary / Very Rare upgrade)
  - *Blood War Battlefield* (pick a side for combat loot, or scavenge safely for Training)
  - *Fallen Paladin’s Reliquary* (free Quest completion for 1 hero + Holy boon)
  - *Mephistopheles’s Forge* (re-roll or upgrade 2 stash items up a rarity tier)

---

## 5. Technical Architecture & Phased Build Plan

### Data Model Summary ([`src/06-adventure.js`](../src/06-adventure.js))
```js
ACTS = {
  phandalin: {
    id: 'phandalin', actTier: 1, name: 'Phandalin & the Triboar Trail',
    silhouette: [3, 3, 3, 2, 2, 3, 3, 2, 1],
    traversal: { pinchRows: [3, 4], miniboss: { key: 'klarg', rowRange: [2, 5], wandering: false } },
    maps: ['triboar_road', 'cragmaw_cave', 'tresendar_cellar', 'thundertree_ruins'],
    pools: { earlyNormal: [...], normal: [...], dangerous: [...], miniboss: ['klarg'], boss: ['nezznar', 'venomfang', 'glasstaff'] },
    events: [...]
  },
  white_plume: { id: 'white_plume', actTier: 2, /* ... */ },
  hells:       { id: 'hells',       actTier: 3, /* ... */ }
}
```
- **Choose-Your-Next-Act Hook:** `nextActChoices(actTier)` simply filters `Object.values(ACTS).filter(a => a.actTier === nextTier)`. Today each tier has 1 Act (auto-advances); the moment we add a 2nd Act for Tier 2 or 3, the transition screen automatically offers a choice!

### Recommended Implementation Phases
1. **Phase 1 — Engine Overhaul + Act 1 (Phandalin):**
   - Implement constricting non-crossing DAG in `genMap()` + edge-aware `nextNodes()` + updated SVG path rendering in `renderMap()`.
   - Flip Shop/Map flow (Shop opens after win / before map choice), remove `#nextFight` spoiler preview, replace per-slot locks with **whole-shop Freeze**.
   - Add `?` Mystery event resolver & modal UI, `⚖ Curio` node, `✧ Multiclass` single-class named nodes (all 12 classes), and `★ Miniboss` node support.
   - Build Act 1 (*Phandalin*): 4 curated battle maps, tiered normal/dangerous pools, **Klarg** miniboss, **Venomfang** boss, reworked **Glasstaff** & **Nezznar** bosses, and 6 Act 1 `?` events.
2. **Phase 2 — Act 2 (White Plume Mountain):**
   - Add Dungeon Hazard node modifiers + Vault rewards.
   - Add White Plume enemies, 4 battle maps, 6 `?` events (*Wave*, *Whelm*, traps, riddles), and the 4 bosses (**Keraptis**, **Blackrazor**, **Gynosphinx**, **Giant Crab**).
3. **Phase 3 — Act 3 (The Hells) + Wandering Miniboss:**
   - Add `hells` visual board theme + 4 infernal battle maps.
   - Implement reusable **Wandering Miniboss** stepper (`advanceWanderer()`).
   - Add Hell enemies, Devil’s Bargain `?` events, **Pit Fiend** wanderer, and the 3 bosses (**Orcus**, **Asmodeus**, **Tiamat**).
   - Run headless 3-Act bot verification (`tools/verify-v022.mjs` / meta sims) to calibrate the 9-row difficulty curve and gold economy across all 3 Acts.
