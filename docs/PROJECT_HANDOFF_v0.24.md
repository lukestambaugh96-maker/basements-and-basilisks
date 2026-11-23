# Basements & Basilisks v0.24 — Handoff for a New AI Chat

> **v0.25 redesign in progress:** see [`docs/v0.25_design_direction.md`](v0.25_design_direction.md). Where it disagrees with this file, the v0.25 doc wins (its §14 lists every superseded rule).

**Date:** 2026-11-23
**Repo:** https://github.com/lukestambaugh96-maker/basements-and-basilisks (branch `main`, commit `2bfbdc5`)
**Art repo:** https://github.com/lukestambaugh96-maker/basements-basilisks-art (source PNGs, commit `2b8143f`)
**Playable build:** `dist/Basements_&_Basilisks_0.24.html` (single file, art embedded, opens offline)
**Field Guide:** `dist/Basements_&_Basilisks_0.24_Field_Guide.html` (hero/item/boss stats from live sims)

---

## 0. How to Use This Document (read first, AI assistant)

You are picking up a working prototype mid-development. The owner (Luke) designs the game and makes UI/balance changes himself; your job is usually to **implement requested changes, rebuild the bundle, verify, and report**. Rules of engagement that worked well so far:

1. **Do not rewrite architecture.** Zero-dependency vanilla JS, globals shared across `src/NN-*.js` files loaded in numeric order. No frameworks, no build step except the optional bundler.
2. **Keep the headless engine pure.** `src/01`–`06` (+`04b`) must run in Node with no DOM (the verify/sim tools `new Function()` them together). DOM/UI code lives only in `00`, `07`–`11`.
3. **After any change:** `node --check src/*.js` → `node tools/verify-v024.mjs 20` → `node tools/bundle.mjs` → open the dist HTML and play to a fight.
4. **Balance claims need ≥ 60 runs per persona.** 15-run results swing ±12 pts and previously produced a false “random beats synergy” conclusion (see §6).
5. **Owner preferences:** concise answers, one sentence per mechanic on cards, D&D flavor, tabletop/vellum look. Tags are readability labels, *not* trait-count set bonuses (a locked rule since v0.22 — ask before changing it).

---

## 1. What the Game Is

A tabletop-inspired **roguelike auto-battler**. Draft a party of **exactly 4 heroes** (no bench), buy items and House Rules in a **Camp Shop**, deploy on a 10-row grid split into **Soft Lanes**, and watch real-time combat resolve with D&D-style d20 rolls. Three Acts on a branching map (DAG), 10 rotating bosses, one free loss (Piggy Bank).

**Core loop:** Map node → (fight: Tactical Deployment → auto-combat → loot/House Rule draft) → Camp Shop → next node. Act boss → +gold → next Act. Win Act 3 boss = victory.

---

## 2. File Map

| Path | Lines | Role |
|---|---|---|
| `index.html` | — | Modular entry; loads `styles.css` + `src/*.js` in order |
| `styles.css` | — | All UI styling (vellum, Act 3 Hells theme, modals) |
| `src/00-assets.js` | 83 | Asset manifest loader / embedded image cache (DOM) |
| `src/01-geo.js` | 87 | Grid geometry, LOS, `loadMap(rows, lanes)`, Soft-Lane deploy cells |
| `src/02-enemies.js` | 1319 | 58 enemies, `ENC` encounters, 10 Act bosses, minibosses, `BATTLE_MAPS` (+lanes) |
| `src/03-heroes.js` | 1641 | 24 heroes `H`, 13 `CLASS_KW`, 9 Epic Boons, 12 Multiclass dips, `heroKeywords()` |
| `src/04-items.js` | 642 | 88 items (64 Standard incl. 6 Scaling + 24 Curio Uniques), `ITEM_BY_R` |
| `src/04b-house-rules.js` | 309 | 36 House Rules, `HOUSE_RULE_MAX = 6`, `houseRuleFit()` |
| `src/05-engine.js` | 2950 | Headless combat engine: `simulate()`, `mitigate()` (Cubed AC/SR, K=16), statuses |
| `src/06-adventure.js` | 1955 | Run state, `ECON`, `CAMP_RANKS`, map/DAG, shop, CR diagnostics, node resolution |
| `src/07-glossary.js` | 213 | Keyword tooltips, SVG icons (DOM) |
| `src/08-portraits.js` | 716 | Procedural portraits for enemies/bosses (DOM canvas) |
| `src/09-cards.js` | 395 | Hero/enemy cards, progressive disclosure, changelog (DOM) |
| `src/10-board.js` | 799 | Battle canvas, lanes overlay, deployment preview, FX (DOM) |
| `src/11-shell.js` | 1749 | Screens/flow: title, shop, map, modals, save/resume (`localStorage`, `r.v === '0.24'`) |
| `assets/manifest.json` | — | Entity→image mapping; `assets/heroes/*.png` = 30 portraits (23 MB, not in the zip) |
| `tools/bundle.mjs` | — | Builds `dist/Basements_&_Basilisks_0.24.html` (needs Python Pillow for WebP) |
| `tools/verify-v024.mjs` | 396 | Invariants + House Rule smoke test + 5-persona 3-Act calibration + CR correlation |
| `tools/build-wiki-data.mjs` | — | Runs sims → `data/wiki-meta-stats.js` (~90 s) |
| `tools/wiki.html`, `tools/bundle-wiki.mjs` | — | Field Guide page + its single-file bundler |
| `tools/test-e2e-chromium.mjs` | — | Headless Chromium click-through (expects server on :8081; partially v0.23-era) |
| `tools/asset-studio.html` | — | Visual art mapper / manifest exporter |
| `docs/*.md` | — | Design history (v0.22 handoff, v0.23 cast/items/combat pillars, maps & acts) |

**Key functions:** `simulate` (05-engine:2942), `mitigate` (05:1019), `newAdventure` (06:506), `buyHouseRule` (06:688), `calcEncounterCR` (06:1170), `calcPartyCR` (06:1200), `crVerdict` (06:1221), `startAct` (06:1318), `buildEncounter` (06:1347), `enterNode` (06:1448), `autoPlace` (06:1574), `resolveNodeFight` (06:1815), `afterNodeFight` (06:1859), `loadMap` (01:24).

---

## 3. Commands

```bash
# Syntax check
for f in src/*.js; do node --check "$f" || exit 1; done
# Invariants + persona calibration (arg = runs per persona; use 60+ for balance decisions)
node tools/verify-v024.mjs 20
# Rebuild single-file game (requires: pip install pillow; reads assets/heroes/*.png)
node tools/bundle.mjs
# Rebuild Field Guide data + bundle
node tools/build-wiki-data.mjs && node tools/bundle-wiki.mjs
# Local play (any static server)
python3 -m http.server 8081   # then open /index.html
```

> If `assets/heroes/*.png` are missing (e.g. working from the zip), either clone the repo/art repo, or skip `bundle.mjs` and just play via `index.html` (heroes fall back to procedural portraits). The prebuilt `dist/` HTML already has art embedded.

---

## 4. v0.24 Systems (current state)

- **Soft Lanes:** each map has 2–3 lanes (`BATTLE_MAPS[k].lanes`, `ENC.run.lanes`) with objectives (e.g. *Duel Choke · 1 Max*, *Dark Ritual · 12s*), lane CR readouts, and an *Ally Link* indicator. Deployment is lane-based.
- **36 House Rules** (`04b-house-rules.js`): run-wide modifiers bought in shop or drafted free after some fights; categories incl. keyword (`hr.kw`), econ, lane, d20, scale, capstone. Max 6 owned; sell for 50%.
- **Camp Rank I–IV** (`CAMP_RANKS`, costs 0/7/11/15): raises interest cap, House Rule rarity cap, hero tier odds, item rarity, free reroll at IV.
- **CR diagnostics:** `calcPartyCR` vs `calcEncounterCR` → `crVerdict` (favoured / even / dangerous / deadly) shown in HUD.
- **Items:** 88 total. Standard tiers keep exact 6-attribute parity (+1/+3/+3/+4/+6 per attribute per tier). 6 Uncommon **Scaling** items grow per win. 24 Curio Uniques (2 per class keyword) at the Curio Merchant.
- **Combat math:** Cubed AC/SR mitigation `1/(1+(Eff/16)^3)` (AC 16 = 50%), Cantrip tier dice 1×/2×/3×/4×, kit-scaled Charge, Burn/Poison scaling, global 1 cast/sec cap, multiplicative Evasion, Radiant true damage.
- **Economy (`ECON`):** win gold `6 + floor(depth/3)`, hero price 4/7/11/15 by tier, item price 3/4/6/9/13 (Unique 7), reroll 1+n, interest 1g per 5g (cap by Camp Rank), Piggy Bank +2g/win, first loss breaks it and grants a softened retry.
- **Locked design rules:** party always 4; tags are labels only (no trait thresholds); one sentence per mechanic; progressive disclosure on Tier I cards.

---

## 5. Recent Bugs Fixed (don't regress)

- `clearNode()` must reset `retryPending`.
- Post-fight `.result` modal: `position: fixed; z-index: 40; overflow-y: auto` (previously the Quest-Complete *Continue* button hid behind `#strip` and soft-locked the run — Sir Dane's quest).
- Asset Studio `ITEM_ORDER` crash; `initAssets()` must redraw pick/combat screens.
- Opening an **in-chat exported** HTML may hang on “loading” if the export captured a stub; always use the real `dist/` file.

---

## 6. Open Balance Problem (where work left off)

**Live telemetry (v0.24 build, 15 runs/persona):** Competent 73%, Engine 33%, Naive 47%, Flat-only 7%, Greed 13%. CR verdict tracks reality well (favoured 98% / even 64% / dangerous 38% / deadly 19%). Bosses: Act 1 Glasstaff & Venomfang 0/5, Act 3 all 0/5 in direct benchmarks.

**60-run ablation (`analysis/ablate-60.json`, script `analysis/ablate-v024.mjs`):**

| Variant | WR | Avg tier | Gold |
|---|---|---|---|
| naive | 45% | 2.64 | 147 |
| competent | 63% | 2.87 | 143 |
| engine (baseline) | 62% | 2.80 | 141 |
| engine, no Camp Rank | 63% | 2.83 | 156 |
| engine, no scaling-item bias | 63% | 2.90 | 146 |
| engine, random map path | 52% | 2.77 | 136 |
| engine, all fixes (no rank + no scaling bias + early upgrades) | **72%** | 3.11 | 167 |
| greed (rush Camp Rank IV) | 38% | 2.34 | 108 |

**Conclusions:**
1. The 15-run inversion was noise; true order is Engine > Naive, but the skill gap is small and Naive's 45% is far above the < 15% target → **floor too high**.
2. **Synergy has little payoff:** no trait counting by design; synergy only via keyword House Rules + 26 `kwHooks` items. Engine teams share barely more tags than random (1.9 vs 1.7). The Engine bot also drafts with a hand-written `ENGINE_TAGS` table (verify-v024.mjs ~L82) instead of the game's `classKwOf()` — **bot bug**.
3. **Future-power is a trap:** Camp Rank IV costs 33g (~25% of run income) without paying back; Scaling items lose to plain higher-rarity items.
4. Map routing (Train/Multiclass/Curio nodes) is worth ~10 pts — currently the main skill expression.

**Candidate next steps (owner has not chosen yet):**
- Fix bot drafting to use real class keywords; default calibration to 60+ runs.
- Add real synergy payoff (small 2/3-keyword bonuses — *requires owner sign-off, conflicts with locked rule*) or buff keyword House Rules.
- Cheaper/front-loaded Camp Rank (e.g. 4/7/10 or immediate perks); stronger or Rare-tier Scaling items.
- Raise floor: tougher Act 1 elites/bosses; tune boss win rates (several 0%).

---

## 7. Version Bump Checklist

When shipping v0.25: update `v:` in `newAdventure` (06:~492) and the resume check in `11-shell.js:23`, output filenames in `tools/bundle.mjs` / `tools/bundle-wiki.mjs`, version strings in `tools/wiki.html` & `build-wiki-data.mjs`, add a changelog entry in `09-cards.js`, copy `verify-v024.mjs` → `verify-v025.mjs`, update `README.md`.
