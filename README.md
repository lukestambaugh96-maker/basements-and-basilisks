# Basements & Basilisks (v0.22)

A tabletop-inspired roguelike auto-battler built in zero-dependency vanilla HTML, CSS, and modular JavaScript.

## Highlights (v0.22)
- **24 Playable Heroes across 6 Packs** (Packs 1–6: *You Meet at a Tavern*, *Around the Campfire*, *Off the Beaten Path*, *Divine Intervention*, *Cornering the Market*, *Surprise Round*), all with custom low-poly portrait art + all **6 quest/shapechange transformation forms** (`30/30` hero assets).
- **Pre-Run Pack Toggles:** Enable or disable any subset of the 6 Packs before starting a run (saved in `localStorage`). Enabled heroes populate shop Recruit Slots and Pack Items unlock across all 3 Acts—no mid-run Pack draft interruptions.
- **Six-Attribute Rework:** Linear STR (melee Armor Pen + Intercept), DEX (Attack Speed + AC), CON (HP + regen + Poison resist), INT (Charge Speed, capped at 1 cast/s), WIS (SR + minimum natural d20 floor), and CHA (Commanding Presence buff/debuff potency).
- **Reworked Shop & Progression:** 2 Recruit Slots + 1 Next-Tier Upgrade Slot (no duplicate hunting), Act 2/3 pre-tiered recruits, click-to-equip & drag-and-drop stash, Favoured Class highlights, Party tag synergy badges, Campfire Path Retraining, Training Free Tier-Up, Hero Quests, and the Piggy Bank single free-loss rule.
- **Combat UX & Visual Overhaul:** `1.4×` baseline combat tempo (`0.5× / 1× / 2× / 4×` speed controls), larger grid squares & tokens, inset d20 result badges, chunky health bars (Ward extending right, Necrosis rising from the left as the kill threshold, smooth trailing ghost damage + heavy-hit flash/shake), and ground-layer elemental spell AoE animations.
- **Asset Studio:** Visual asset-to-entity browser & manifest manager at `tools/asset-studio.html`.

## Project Structure
```
basements-and-basilisks/
├── index.html                      # Modular game entry point
├── styles.css                      # Full UI & tabletop vellum stylesheet
├── src/
│   ├── 00-assets.js                # Manifest loader + custom image cache
│   ├── 01-geo.js                   # Grid geometry, LOS, cones, lines, pathing
│   ├── 02-enemies.js               # Enemy roster & encounter definitions
│   ├── 03-heroes.js                # All 24 heroes, 6 Packs, Paths, & Quests
│   ├── 04-items.js                 # 6 Pack Items + 10 Core Shop Items (16 total)
│   ├── 05-engine.js                # Headless combat engine (Node & browser)
│   ├── 06-adventure.js             # Run economy, Piggy Bank, Shop, Map, Quests
│   ├── 07-glossary.js              # Interactive keyword tooltips & changelog
│   ├── 08-portraits.js             # Procedural portraits & dynamic form resolver
│   ├── 09-cards.js                 # Hero/enemy cards & white-keyed custom art
│   ├── 10-board.js                 # Battle canvas, chunky HP bars, spell FX
│   └── 11-shell.js                 # Game screens, Pre-Run Pack Toggles, Shop UI
├── assets/
│   ├── manifest.json               # Entity-to-image mapping (all 30 hero/form PNGs)
│   ├── README.md                   # Asset workflow & repo path guide
│   └── heroes/                     # 24 hero PNGs + 6 quest/shapechange form PNGs
├── docs/
│   ├── PROJECT_HANDOFF_v0.22.md    # Complete summary & key decision points
│   ├── antigravity_handoff_gameplay_attribute_rework.md
│   ├── initial_prototype_cast_12_heroes_core_items.md
│   └── character_packs_future_cast_roadmap.md
├── tools/
│   ├── asset-studio.html           # Visual asset mapper & manifest exporter
│   ├── bundle.mjs                  # Builds dist/Basements_&_Basilisks_0.22.html
│   ├── verify-v022.mjs             # Headless Node verification & 24-hero sim suite
│   └── test-e2e-chromium.mjs       # Real headless Chromium 3-Act E2E test suite
└── dist/
    └── Basements_&_Basilisks_0.22.html  # Single-file playable build
```

## Quick Commands
```bash
# Run headless Node verification + 24-hero combat benchmarks
node tools/verify-v022.mjs

# Serve locally for playtesting & Asset Studio
python3 -m http.server 8081

# Run full 3-Act Chromium E2E test (while server runs on 8081)
node tools/test-e2e-chromium.mjs

# Rebuild single-file playable HTML bundle
node tools/bundle.mjs
```
