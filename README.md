# Basements & Basilisks (v0.23)

> **v0.25 redesign in progress:** see [`docs/v0.25_design_direction.md`](docs/v0.25_design_direction.md). Where it disagrees with this file, the v0.25 doc wins (its §14 lists every superseded rule).
>
> **Act 1 prototype:** build instructions in [`docs/v0.25/ACT1_PROTOTYPE_BUILD.md`](docs/v0.25/ACT1_PROTOTYPE_BUILD.md); numbers in [`data/v0.25/`](data/v0.25/).

A tabletop-inspired roguelike auto-battler built in zero-dependency vanilla HTML, CSS, and modular JavaScript.

## Highlights (v0.23)
- **3 Full Acts, 9-Row Constricting Non-Crossing DAG & 10 Rotating Bosses:**
  - **Act 1 — Phandalin & the Triboar Trail:** Classic frontier battles, stationary **Klarg's Hideout** Miniboss (`★`), and 3 rotating Act Bosses (*Nezznar*, *Venomfang*, *Glasstaff*).
  - **Act 2 — White Plume Mountain:** Funhouse dungeon encounters, **Dungeon Hazards** (*Boiling Steam*, *Frictionless Floor*, *Arcane Dampener*) granting Vault Loot, and 4 rotating Act Bosses (*Simulacrum of Keraptis*, *Wielder of Blackrazor*, *Gynosphinx*, *Giant Crab of the Bubble*).
  - **Act 3 — The Hells:** Infernal obsidian/lava theme, **Wandering Miniboss** (*Pit Fiend Enforcer* patrolling the map), Devil's Bargain mysteries, and 3 rotating Final Bosses (*Orcus*, *Asmodeus*, *Tiamat*).
  - **18 Curated D&D Mystery Events** (6 per Act) + weighted `?` node resolver (55% Event, 20% Ambush, 15% Treasure, 10% Wandering Peddler), **58 distinct enemies**, and rich procedural canvas portraits for every enemy/boss.
- **24 Reworked Heroes & 13 Canonical Class Keywords:**
  - All 24 heroes across 6 Packs refactored with **Strict Progressive Disclosure** on Tier I cards (Specializations, Quests, Epic Boons, and Multiclass boxes stay hidden until unlocked), **48 strictly 1-line Tier II Specializations**, **24 opt-in Personal Quests** (accepted at **Quest Board `❖`** nodes), spatial **closest-ally targeting** with live deployment preview lines (*Rosalind*, *Toot*, *Brother Jamison*), and key reworks (*Lumen* Celestial Warlock, *Mother Laurel* Melee Cleave Drain Tank, *Arthur* Evasion Action Surge, *Zoe* any-Common Rummage, *Toot* stationary 0-dmg musician, *Gilthrax* item-value Ward + Gold Dragon Fire Breath, *Gains* slow Gold-bolt artillery, *Nettle* Infernal Hex + Hellfire).
- **Universal Tier IV Epic Boons & 12 Single-Class Multiclass Shrines:**
  - Reaching Tier IV opens a **1-of-3 Epic Boon** picker from 9 universal boons (*Combat Prowess*, *Fortitude*, *Irresistible Offense*, *Recovery*, *Spell Recall*, *Fate*, *Speed*, *Truesight*, *Energy Resistance*).
  - **12 Named Multiclass Shrines (`✧`)** (no repeats per run) grant a hero a secondary Class Keyword and unlock that class's Curio Uniques.
- **82 Canonical D&D Items Across 6 Tiers:**
  - **58 Universal Standard Shop Items** (`12 Common 2g / 14 Uncommon 3g / 12 Rare 4g / 12 Very Rare 6g / 8 Legendary 10g`) with exact per-tier **6-attribute parity** (`+1/+2/+3/+4/+6` across STR/DEX/CON/INT/WIS/CHA) and clean stat-only Common/Uncommon tiers.
  - **24 Unique Class-Keyword Relics (5g)** (2 per class: 1 Trigger + 1 Modifier) sold at the **Curio Merchant (`⚖`)** with party-keyword filtering and a 2g stock reroll (*Wallaby*'s Thief `Use Magic Device` bypasses class locks!).
- **Cubed AC/SR Defense Curve, Universal Evasion & Radiant True Damage:**
  - Defense mitigation follows $1 / (1 + (\text{Eff}/14)^3)$ (`AC 10 → 26.7%`, `AC 14 → 50.0%`, `AC 20 → 74.5%`), countered by Armor/Spell Pen and **Radiant true damage** (bypasses AC & SR).
  - All Evasion sources combine multiplicatively ($1 - \prod(1 - e_i)$), and Lethal-Revive follows exact priority (`Zealot → Relentless Endurance 1 HP → Cleric MC 25% → Boon of Recovery 50%`).
- **Camp Shop Flow Flip, Whole-Shop Freeze & Standing Piggy Bank:**
  - Camp Shop opens after every combat victory and at Act start, displaying an **Act Boss Reminder** (no combat spoilers!) and **Whole-Shop Freeze**, while clicking combat nodes jumps straight into **Tactical Deployment**. First loss breaks the Piggy Bank for one softened retry.
- **Offline Bundle, Asset Studio & Field Guide Stat Tracker:**
  - `tools/bundle.mjs` builds `dist/Basements_&_Basilisks_0.23.html` with all 30 custom WebP hero/form portraits embedded, `tools/asset-studio.html` manages custom art manifests across all 188 slots, and `tools/wiki.html` provides the interactive v0.23 Field Guide & Live Stat Tracker.

## Project Structure
```
basements-and-basilisks/
├── index.html                      # Modular v0.23 game entry point
├── styles.css                      # Full UI, tabletop vellum & Act 3 Hells styling
├── src/
│   ├── 00-assets.js                # Manifest loader + bundled/custom image cache
│   ├── 01-geo.js                   # Grid geometry, LOS, cones, lines, 13 battle maps
│   ├── 02-enemies.js               # 58 enemies, 10 rotating Act bosses, 2 minibosses
│   ├── 03-heroes.js                # 24 reworked heroes, 13 Class Keywords, 9 Epic Boons, 12 Multiclass dips
│   ├── 04-items.js                 # 82 six-tier D&D items (58 Standard + 24 Curio Uniques)
│   ├── 05-engine.js                # Headless combat engine (Cubed AC/SR K=14, Evasion, Radiant, Lethal priority)
│   ├── 06-adventure.js             # 3 Acts, 9-row non-crossing DAG, 18 Mystery events, Curio, Camp Shop
│   ├── 07-glossary.js              # Interactive keyword tooltips & SVG item/stat icons
│   ├── 08-portraits.js             # Procedural portraits for all enemies/bosses + dynamic hero forms
│   ├── 09-cards.js                 # Strict Progressive Disclosure hero/enemy cards & v0.23 changelog
│   ├── 10-board.js                 # Battle canvas, Hells theme, deployment targeting lines, spell FX
│   └── 11-shell.js                 # Camp Shop Flow Flip, 9-row DAG UI, Epic Boon/Multiclass/Curio modals
├── assets/
│   ├── manifest.json               # Entity-to-image mapping (24 heroes, 6 forms, 58 enemies, 82 items, 18 maps)
│   └── heroes/                     # 24 hero PNGs + 6 quest/shapechange form PNGs
├── data/
│   ├── wiki-meta-stats.js          # Live v0.23 simulation telemetry powering tools/wiki.html
│   └── v0.22-meta/                 # Historical v0.22 simulation snapshots
├── docs/                           # v0.23 design specs & v0.22 meta post-mortem
├── tools/
│   ├── wiki.html                   # Field Guide & Live Stat Tracker (v0.23 heroes, 82 items, 10 bosses, Boons)
│   ├── build-wiki-data.mjs         # Runs live headless v0.23 benchmarks -> data/wiki-meta-stats.js
│   ├── asset-studio.html           # Visual asset mapper & manifest exporter
│   ├── bundle.mjs                  # Builds self-contained dist/Basements_&_Basilisks_0.23.html
│   ├── verify-v023.mjs             # Headless Node invariants & 5-persona 3-Act campaign calibration suite
│   └── test-e2e-chromium.mjs       # Real headless Chromium 3-Act E2E & Wiki verification suite
└── dist/
    └── Basements_&_Basilisks_0.23.html  # Single-file offline playable build (with embedded art)
```

## Quick Commands
```bash
# Run v0.23 invariants & 5-persona 3-Act campaign calibration (default 25 runs/persona)
node tools/verify-v023.mjs 25

# Serve locally for playtesting, Field Guide Stat Tracker & Asset Studio
python3 -m http.server 8081

# Run full 3-Act Chromium E2E test + Wiki check (while server runs on 8081)
node tools/test-e2e-chromium.mjs

# Regenerate Field Guide & Stat Tracker live v0.23 telemetry dataset
node tools/build-wiki-data.mjs

# Rebuild single-file playable HTML bundle
node tools/bundle.mjs
```
