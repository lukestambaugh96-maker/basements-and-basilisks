# Basements & Basilisks v0.22 — Project Handoff & Key Decision Points

**Date:** 2026-11-20  
**Repository Branch:** `main` (local repo at `/home/antigravity/basements-and-basilisks`)  
**Current Build:** v0.22 — 24 Playable Heroes · 6 Toggleable Packs · 16 Items · 30 Custom Hero/Form PNGs

---

## 1. Executive Summary

Starting from the v0.21 HTML prototype and three systems design handoff documents, this session delivered a complete modular v0.22 codebase, visual/UX combat overhaul, Asset Studio tooling, all 30 uploaded hero/form art assets integrated with automatic white-background keying, all 24 Core Cast heroes across 6 Packs, and Pre-Run Pack Toggles replacing mid-run Pack drafts.

Both automated test suites pass with **0 errors**:
- **Node Headless Verification (`tools/verify-v022.mjs`):** Validates all 24 heroes, 6 Packs, 16 items, Six-Attribute Rework math, Pre-Run Pack Toggles, direct Act 1→2 map refresh, Piggy Bank single free-loss rule, global 1-cast/sec cap, and simulates all 24 heroes across 6 benchmark squads.
- **Headless Chromium E2E (`tools/test-e2e-chromium.mjs`):** Real mouse-click walkthrough from Title → Intro → Pre-Run Pack Toggles → Starter Pick → full 3-Act Victory (including Piggy Bank retry, zero stale nodes/trails between Acts, no mid-run pack screen, and verifying all 24 hero PNGs + 6 form PNGs render cleanly with 0 console/runtime errors).

---

## 2. Key Architectural & Gameplay Decision Points

### A. Standing Core Design Rules (Locked In)
1. **Party Size Always 4 (No Bench):** Every recruited hero fights on the board; swapping a 5th hero replaces an existing one with full gold refund and returns items to stash.
2. **Tags Are Mechanical Labels Only:** Zero trait-counting or tribal set-bonus thresholds. Shop offers highlight shared party tags (`★`) purely as readability cues for mechanical synergy.
3. **One Sentence Per Mechanic:** Player-facing card summaries stay crisp and scannable.
4. **Global 1-Cast/Second Cap (`MIN_CAST_INTERVAL = 1.0`):** Prevents infinite-charge loops while rewarding excess INT/Charge via *Headband of Intellect* (+1 d20 roll conversion).
5. **Piggy Bank Single Free-Loss Rule:** Wins add +2g to the Piggy Bank; the first loss breaks it, pays out all saved gold, softens the encounter retry (`0.88×`), and returns you to the shop; the second loss ends the run.

### B. Pack & Roster Structure (Changed Mid-Session per User Request)
- **Decision:** Removed Packs as between-Act choices. Instead, all **6 Packs (24 Heroes + 6 Pack Items)** are configured via **Pre-Run Pack Toggles** before starting a run (persisted in `localStorage` under `bb022.packs`, defaulting to all 6 enabled).
- **Act Transition Flow:** Defeating the Act 1 or Act 2 Boss now grants a **+8g Act Clear Bonus** and transitions directly into a fresh Act 2 / Act 3 map (`startAct()` clears `pos`, `path`, `node`, and `loot`).
- **Shop Pool Behavior:** Enabled Packs populate `run.adv.pool` (unowned Recruit Slots) and `run.adv.itemPool` (Shop Items + Treasure) for the entire run; the first enabled Pack drops 1 starter copy of its Pack Item into the opening stash.

### C. Six-Attribute Rework & Dual-Attribute Split
- **STR:** Melee weapon damage + flat Armor Pen (+1 AC ignored per positive STR) + Intercept Chargers at STR ≥ +3.
- **DEX:** Linear Attack Speed (+6%/DEX if weapon attr, +4%/DEX otherwise) + DEX weapon damage + AC.
- **CON:** Linear Max HP (+18/CON × tier) + HP regen + Poison resistance.
- **INT:** Linear Charge Speed (+10%/positive INT); decoupled from d20 High-roll scaling for non-INT heroes.
- **WIS:** Spell Resistance (+1 SR/WIS) + **minimum natural d20 roll floor** (`min(10, 1 + max(0, WIS))`).
- **CHA:** Commanding Presence (+8% potency/duration on buffs, debuffs, Inspiration, Wards) + faster stun/root recovery.
- **Dual-Attribute Split (`pair: [weaponAttr, keyAttr]`):** High-roll d20 threshold scaling is driven by each hero's `keyAttr`.

### D. Combat Tempo, Readability & Visual Polish
- **Pacing:** Added `COMBAT_TEMPO = 1.4` baseline slowdown so fights are readable and DEX/INT speed scaling feels meaningful; speed toggles updated to `0.5× / 1× / 2× / 4×`.
- **Board & Tokens:** Enlarged tile scaling (`resize()` up to `128px`) and token radius (`0.46×`–`0.50×` tile). Moved d20 roll results into compact **inset badges** inside the lower half of character icons with a band-colored rim glow.
- **Health Bars (Canvas + Bottom Strip):**
  - **Ward** appends to the right edge of live HP (`totalCap = max(maxHp, hp + ward)`).
  - **Necrosis** grows from the **left edge** with diagonal hatching + glowing green threshold line showing the exact kill point (`hp <= nec`).
  - **Hit Weight Feedback:** Smooth trailing ghost damage bar (`_trailHp`), white flash + micro-shake on heavy hits (≥ 14% max HP), warm border pulse on rapid multi-hits, and quieter floating damage spam in `'Key text'` mode.
- **Spell Area & Damage-Type VFX:** Added ground-layer geometric footprints (`drawGroundFx` in `src/10-board.js`) beneath units for cones, lines, and circular AoEs with damage-type motifs (radiant sunburst, fire ring, poison spores, necrotic tendrils, cold star, thunder shockwave, steel sweep).

### E. Shop UX Rework
- **No Duplicate Hunting:** 2 dedicated **Recruit Slots** (unowned pool) + 1 **Upgrade Slot** (direct Next-Tier Upgrade for an owned hero). Pre-tiered recruits arrive at Tier II in Act 2 and Tier II/III in Act 3.
- **Direct Equipping:** Click a stash item then click a hero chip—or drag-and-drop stash items directly onto hero chips. Click any equipped item slot to unequip.
- **Visual Cues:** Green `★ Favoured` glow on matching hero chips and shop item offers, `★` highlight on shared party tags, and inline Hero Quest progress bars on party chips.

### F. Art & Asset Pipeline
- **Manifest Architecture (`src/00-assets.js`, `assets/manifest.json`, `tools/asset-studio.html`):** Maps every hero, quest form, enemy, item, and map theme/encounter to lightweight relative paths (or an optional GitHub raw `baseUrl`), with procedural canvas fallback whenever a slot is unassigned.
- **Auto White-Keying (`keyedCustomArt()` in `src/09-cards.js`):** Border flood-fill strips `#ffffff` studio backgrounds from uploaded low-poly PNGs while keeping interior whites opaque, plus `analyse()` smart framing for full-body vellum cards and head-cropped battle tokens.
- **Dynamic Transformations (`src/08-portraits.js`, `src/09-cards.js`):** All 6 forms wired—including `dane_form` (2×2 Large), `pillar_form` (2×2 Large), `arthur_form`, `jamison_quest`, `saint_quest`, and live mid-fight `kaska_form` (Panther) → `kaska` (Half-Orc) swapping when Panther Beast HP breaks.

---

## 3. Complete Cast & Asset Coverage

| Pack | Heroes (All Playable + Custom PNG) | Pack Item | Quest / Form Art |
|---|---|---|---|
| **1. You Meet at a Tavern** | Arthur, Bram, Faelan, Wallaby | Potion of Healing | `arthur_form.png` |
| **2. Around the Campfire** | Sir Dane, Lorcan, Juniper, Rosalind | Whetstone of the Hunt | `dane_form.png` (2×2) |
| **3. Off the Beaten Path** | Cinder, Zark, Naill, Nettle | Ember-Iron Bracers | — |
| **4. Divine Intervention** | Pillar, Mother Laurel, Lumen, Brother Jamison | Sunlit Censer | `pillar_form.png` (2×2), `jamison_quest.png` |
| **5. Cornering the Market** | Zoe, Toot, Gilthrax, Gains | Merchant’s Scales | — |
| **6. Surprise Round** | Velith, Corvin, Saint, Kaska | Cloak of Elvenkind | `saint_quest.png`, `kaska_form.png` |

- **Heroes:** 24 / 24 custom PNGs wired (`assets/heroes/*.png`)
- **Forms:** 6 / 6 custom PNGs wired (`assets/heroes/*_{form,quest}.png`)
- **Items / Enemies / Maps:** Ready in `assets/manifest.json` & Asset Studio (currently using crisp SVG/procedural art until custom PNGs are added).

---

## 4. Bug Fixes Resolved in This Session
1. **Act 2/3 Stale Map Trail & Unclickable Screen:** Fixed `startAct()` to reset `run.adv.path = []` alongside `pos = null`, added legacy save sanitization in `loadRun()`, fixed `bossRead()` hanging 4.6s when previewing unplaced heroes (added fallback `DEPLOY` assignment in `newBattle()` and full `run.depth`/`UID`/`MAP` restoration), added `pointer-events: none` on `.maplines`, and guarded forced modals & result timers cleanly.
2. **Pack 4–6 Engine Fixes:** Fixed `addWard()` argument order on Mother Laurel, Zoe, and Gilthrax; tracked `giver.stats.ward` and `_wardBy` centrally inside `addWard()`; unified `rootsApplied` tracking for both Juniper and Mother Laurel; fixed Zoe Nat 20 `_clockworkUsed` refresh flag.

---

## 5. Open Next Steps & Decisions for the Project

1. **Connect GitHub Repository:** Once this conversation (or a new chat) is inside the **"Basements and Basilisks"** Project, attach or create the GitHub repository (`basements-and-basilisks`) so `git push -u origin main` syncs all code, docs, and the 30 PNGs (saving project file space and enabling raw asset hosting).
2. **Remaining Custom Art Batches:** Drop PNGs for **Items (16)**, **Enemies (20)**, and **Battle Map Backgrounds (4 themes + encounters)** into `assets/{items,enemies,maps}/` and assign them via `tools/asset-studio.html`.
3. **Balance & Tuning Pass (24-Hero Meta):**
   - Pack 5 (*Cornering the Market*) generates heavy combat gold (`~13g/fight` in War Band benchmark); review gold caps (`Toot` cap 14, `Gains` cap 12) and shop inflation across 3 Acts.
   - Pack 6 (*Surprise Round*) averages `9.5s` clears vs War Band while Pack 4 (*Divine Intervention*) averages `18.9s` — tune boss/elite pacing if desired.
4. **Future Mechanics / Content:** Packs 7+ from `docs/character_packs_future_cast_roadmap.md`, sound effect polish, battle log/damage breakdown tooltips, or endless Act 4+ mode.
