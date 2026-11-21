# Basements & Basilisks (v0.22)

A tabletop-inspired roguelike auto-battler built in zero-dependency vanilla HTML, CSS, and modular JavaScript.

## Highlights (v0.22)
- **24 Playable Heroes across 6 Packs & 12-Class Keyword System:** Packs 1–6 (*You Meet at a Tavern*, *Around the Campfire*, *Off the Beaten Path*, *Divine Intervention*, *Cornering the Market*, *Surprise Round*), unified around **17 canonical class keywords** across all 12 classes, with custom low-poly portrait art + all **6 quest/shapechange transformation forms** (`30/30` hero assets).
- **46 Canonical D&D Items:** 8 Common staples, 24 Class-Keyword items (2 per class), and 14 Armor Ladder & Archetype Riders with exact 6-attribute parity (`7 items / +10 modifier` per attribute). All 46 items are always available in shops regardless of enabled packs.
- **Pre-Run Pack Toggles:** Enable or disable any subset of the 6 Packs before starting a run (saved in `localStorage`). Enabled heroes populate shop Recruit Slots across all 3 Acts—no mid-run Pack draft interruptions.
- **Six-Attribute Rework:** Linear STR (melee Armor Pen + Intercept), DEX (Attack Speed + AC), CON (HP + regen + Poison resist), INT (Charge Speed, capped at 1 cast/s), WIS (SR + minimum natural d20 floor), and CHA (Commanding Presence buff/debuff potency).
- **Encounter-Scaled Shop & Progression:** 2 Recruit Slots + 1 exact Next-Tier Upgrade Slot (from Shop #2 onward, no duplicate hunting), smooth encounter-scaled hero tier & item rarity odds, click-to-equip & drag-and-drop stash, Class-Keyword synergy highlights, Campfire Path Retraining, Training Free Tier-Up, Hero Quests, Bag of Holding, and the Piggy Bank single free-loss rule.
- **Combat UX & Visual Overhaul:** `1.4×` baseline combat tempo (`0.5× / 1× / 2× / 4×` speed controls), larger grid squares & tokens, inset d20 result badges, chunky health bars (Ward extending right, Necrosis rising from the left as the kill threshold, smooth trailing ghost damage + heavy-hit flash/shake), and ground-layer elemental spell AoE animations.
- **Self-Contained Offline Bundle, Asset Studio & Field Guide Stat Tracker:** `tools/bundle.mjs` embeds all 30 custom hero/form portraits into `dist/Basements_&_Basilisks_0.22.html` for zero-dependency offline play, `tools/asset-studio.html` manages custom art manifests, and `tools/wiki.html` provides an interactive v0.22 character wiki, live balance changelog, simulation stat tracker, best partner heroes, and best item pairings.

## Project Structure
```
basements-and-basilisks/
├── index.html                      # Modular game entry point
├── styles.css                      # Full UI & tabletop vellum stylesheet
├── src/
│   ├── 00-assets.js                # Manifest loader + bundled/custom image cache
│   ├── 01-geo.js                   # Grid geometry, LOS, cones, lines, pathing
│   ├── 02-enemies.js               # Enemy roster & encounter definitions
│   ├── 03-heroes.js                # All 24 heroes, 6 Packs, 12-Class Keywords, Paths & Quests
│   ├── 04-items.js                 # 46 Canonical D&D Items (4 rarity tiers, 6-attr parity)
│   ├── 05-engine.js                # Headless combat engine (Node & browser)
│   ├── 06-adventure.js             # Run economy, encounter-scaled Shop, Piggy Bank, Map, Quests
│   ├── 07-glossary.js              # Interactive keyword tooltips & SVG icon registry
│   ├── 08-portraits.js             # Procedural portraits & dynamic form resolver
│   ├── 09-cards.js                 # Hero/enemy cards, white-keyed custom art & changelog
│   ├── 10-board.js                 # Battle canvas, chunky HP bars, spell FX
│   └── 11-shell.js                 # Game screens, Pre-Run Pack Toggles, Shop UI
├── assets/
│   ├── manifest.json               # Entity-to-image mapping (all 30 hero/form PNGs)
│   ├── README.md                   # Asset workflow & repo path guide
│   └── heroes/                     # 24 hero PNGs + 6 quest/shapechange form PNGs
├── data/
│   ├── wiki-meta-stats.js          # Live v0.22 simulation telemetry powering tools/wiki.html
│   └── v0.22-meta/                 # Raw JSON simulation snapshots (baseline & live balance)
├── docs/
│   ├── v0.22_meta_report_and_lessons.md  # Full v0.22 meta archive, mistakes post-mortem & v0.23+ guardrails
│   ├── PROJECT_HANDOFF_v0.22.md    # Complete summary & key decision points
│   ├── antigravity_handoff_gameplay_attribute_rework.md
│   ├── initial_prototype_cast_12_heroes_core_items.md
│   └── character_packs_future_cast_roadmap.md
├── tools/
│   ├── wiki.html                   # Field Guide & Live Stat Tracker (changelog, stats, partners, items)
│   ├── build-wiki-data.mjs         # Regenerates data/wiki-meta-stats.js from data/v0.22-meta/
│   ├── asset-studio.html           # Visual asset mapper & manifest exporter
│   ├── bundle.mjs                  # Builds self-contained dist/Basements_&_Basilisks_0.22.html
│   ├── verify-v022.mjs             # Headless Node verification & 24-hero/46-item sim suite
│   └── test-e2e-chromium.mjs       # Real headless Chromium 3-Act E2E test suite
└── dist/
    └── Basements_&_Basilisks_0.22.html  # Single-file offline playable build (with embedded art)
```

## Quick Commands
```bash
# Run headless Node verification + 24-hero combat benchmarks
node tools/verify-v022.mjs

# Serve locally for playtesting, Field Guide Stat Tracker & Asset Studio
python3 -m http.server 8081

# Run full 3-Act Chromium E2E test (while server runs on 8081)
node tools/test-e2e-chromium.mjs

# Regenerate Field Guide & Stat Tracker telemetry dataset
node tools/build-wiki-data.mjs

# Rebuild single-file playable HTML bundle
node tools/bundle.mjs
```
