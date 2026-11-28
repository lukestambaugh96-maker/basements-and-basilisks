# Handoff: Basements & Basilisks v0.25 balance work (27 Nov 2026)

Start here. This file lets a new agent (Google Antigravity or anything else) pick up the v0.25 balance and cast-rework work exactly where the Claude sessions stopped. Everything needed is in this repo; the claude.ai artifacts mentioned below are summarized here because they can't be opened from outside claude.ai.

Owner: Luke (designer). Read **"How Luke works"** before proposing anything.

---

## 1. What this is

A D&D 5e-flavored roguelike autobattler. v0.25 = Act 1 (Phandelver): 5 fights + the boss Nezznar, a shop between fights, heroes tier 1 → 2 by buying a second copy, two tier 2 specializations ("paths") per hero.

The balance work happens in a **headless test bench** that simulates fights and whole runs with bot players:

- `tools/testbench/` — the bench (Node, no dependencies). **All numbers live in `config/*.json`.**
  - `config/heroes.config.json` — every hero's numbers (23 heroes; Toot is `enabled: false`).
  - `config/enemies.config.json` — enemies, encounters, bosses (only Nezznar is `active`).
  - `config/rules.config.json` — game-wide rules (HP formula, resistance, charge, ability sizes, job targets, evasion cap, enemy buff knobs, shop odds, dice mode).
  - `engine.js` (fight rules), `behaviour.js` (hero and enemy kits), `run.js` (items, shop, economy), `bots.js` (bot players), `bench.js` (the CLI).
  - `presets/` — named edit sets. `prototype2.json` reverts everything to playable prototype 2 and **must keep reproducing 47.0%** (`node bench.js run --preset prototype2 --n 300`). `batch1.json` = batch 1 (now identical to the config). `batch2.json` = batch 2 proposals (NOT in the config yet).
- `tools/sheetgen/` — scripts that rebuild the balance spreadsheets from the configs (`node gen.js` → `python3 model.py` / `perf.py`, reading `--json` bench outputs in /tmp).
- `docs/v0.25/` — design and test write-ups (one per reworked hero or batch, plus encounter, boss, buff and specialization tests).
- Design references: `docs/v0.25_design_direction.md`, `docs/v0.25/hero-design-session.md` (the 23-hero kits from 23 Nov; newer docs win).

## 2. Running the bench

```
cd tools/testbench
node bench.js stats                         # hero and enemy numbers
node bench.js jobs <hero> --n 300            # tier 1 benchmark: win, dies, effective HP, damage/s, casts, value per cast, LOW/HIGH flags
node bench.js jobs <hero> --tier 2 --partnerTier 1 --path 0|1 --n 300   # compare tier 2 paths (only that hero ranks up)
node bench.js jobs <hero> --items shield,cloak_protection               # give the measured hero items (--partnerItems for partners)
node bench.js gauntlet <hero> --path 0 --n 300   # fights 2-5 + Nezznar in a row, run-long state carried (scaling paths)
node bench.js bots bare sensible engine --n 300 --seed 20000   # whole Act 1 runs per bot
node bench.js bosscheck --n 150              # Nezznar check: party A (all tier 2), B (two tier 2 + items), C (one tier 2)
node bench.js paths <hero> --n 150 --reps 3  # replay real bot fights with the hero at each path
node bench.js castoff | itemoff | placement | luck | buffs   # other replay tests
```
- Every command takes `--json`, `--preset <name>`, `--edits "hero.path=value, ..."`.
- **`--edits` gotcha:** values can be JSON, but only one level of `{}` nesting parses. For deeper objects use dotted paths (`lumen.kit2.t2.radiantSoul.beamBonus={"dice":"1d6"}`) or put the edit in a preset file.
- `jobs` with `--n 250–300` takes 1–2 minutes per hero; run heroes in parallel.
- Tier 2 parties win ~90% of single fights, so path lifts look tiny in `paths`; use `jobs --tier 2 --partnerTier 1` (or `gauntlet` for run-long scaling) to compare paths.

## 3. Current state (after batch 3, 27 Nov)

- Whole runs (300 per bot, seeds 20000+): **never-buy 0% (median fight 4), sensible 69%, engine 76%.**
- Boss check A / B / C: **82 / 82 / 50%** (target: A does well ~85, B clears fairly well ~75–80, **C struggles ~33** → C is high; retune right after Batch 4).
- Prototype2 preset: 47.0% (reproduces).
- PR #6 (branch `testbench-bots-and-replay-tests`) was merged into `main` (commit `9477726`).

## 4. How Luke works (follow this)

- Treat his numbers and ideas as **intent, not hard specs**; ask what experience he's after.
- Run the math and tests yourself; propose **number edits**, test them, post one proposal per hero, Luke rules.
- Give real design insight and disagree when the evidence says so. Don't just validate. Be concise; tables over prose.
- **No hidden multipliers or invisible math in player-facing rules.** Players see dice and features they can read off a card. Internal measuring sticks (×1.5/×2/×2.5 tier curve) are for us only. `speedScaling` stripped to `1.0` cast-wide; base attack speed (`interval`) should echo each hero's kit goals.
- Luke's fun rules: real tension (a real chance to lose); winning anyway is a failure; the player is in control (predictable, explainable); build toward the payoff, don't wait for it (every buy pays a little now); shared verb + unique identity; the whole kit works together; every hit feels good; bounds are starting points, engines break them.
- Enemies have the edge over a bare party. Threat from damage and actions, not HP pools (Luke allowed a small EHP option on 27 Nov, but damage/attack speed is preferred).
- Ask at most one question per reply, and only if it's his decision.
- His review page (a claude.ai artifact) isn't reachable from here: use **`docs/v0.25/REVIEW-QUEUE.md`** instead (pending items, his rulings).

## 5. Decided rules (all in the configs unless noted)

**Combat and stats**
- HP = 60 + floor(8·tier·(hitDie+1)/2) + CON mod·8·tier. Resistance: AC (physical) / SR (magic) reduce damage by R/(R+20). Radiant/true ignore it.
- **Ability modifiers are half-point:** (score−10)/2, no rounding; .5 amounts round up or down at random.
- **Evasion** (26 Nov): a chance an *attack* misses (never abilities). **Hard cap 50%** (`rules.evasion.cap`). Pierce lowers it. Dodge = guaranteed miss for a window. AC does **not** cause misses.
- All Wards add up. Root is **Restrained** (can't move, attacks 50% slower, casts with Disadvantage).
- Charge by job: attackers 100 per 5s of attacking; frontliners 15 per hit taken; casters 100 per 5s (+10% per INT mod). Ability sizes by charge to cast: Small 60 / Medium 100 / Big 180 / Huge Nuke 300; value per cast targets 9 / 20 / 35 / 70.
- Job targets (tier 1, no items): Frontline 280–340 EHP, 2–3 dps; Brawler 210–260, 4–5; Attacker 160–210, 4–5 (ability ≤35%); Caster 140–190, 4.5–5.5 (ability ≥50%); Support 160–210, 1–2 + 60–90 help. Proposed tier 2–4 growth ×1.5/×2/×2.5 (balance sheet "Benchmarks by tier" tab).
- **Attack growth (decided, not switched on):** basic attacks +1 weapon die per tier; attacks and casts may grow at different rates. Switch: `rules.attackGrowth.extraDicePerTier` (0 now → 1 after the whole cast is reworked). Open: should damage grow on the HP curve or outgrow it?
- **Enemy buff knobs:** `rules.enemyScale` {damage ×, attackSpeed +, hp ×}. Set to **+5% attack speed** (27 Nov).

**Class features (Luke, 26–27 Nov)** — universal properties with interaction rules; not strong or weak by design; power comes from each hero's version; part of the kit and counted in the job benchmarks; effects scale with tier per character (or via natural stat/HP growth).
- **Card rule:** the feature's line says only what it does ("Action Surge: take an extra weapon attack"); the trigger is written on the kit part that causes it ("Alert: … when Arthur dodges an attack, he triggers Action Surge").
- Fighter **Action Surge**: unique trigger; anything that "triggers Action Surge" is an extra trigger (shared `actionSurge()` with loop guard).
- Rogue **Sneak Attack**: bonus attack on a condition, independent of attack speed, unique property, internal cooldown; "triggers Sneak Attack" skips the condition but keeps the cooldown (`force` bypass).
- Cleric **Channel Divinity**: one charge at fight start (nothing fires at start), max one; effects can trigger or restore it.
- Paladin **Smite**: one definition per character (not a charge); anything that calls for a smite uses it.
- Wizard **Arcane Recovery**: gain charge on a condition; Wizards are the best at recovering charge.
- Sorcerer **Metamagic**: sorcery points fill to 4; a cast at 4 spends all for a modifier.
- Monk **Ki**: earned per attack, has a maximum, **never spent**; monks ramp through a fight.
- Ranger **Favored Foe** (renamed 27 Nov): triggers off the pure-tag **`Hunter's Mark`** condition (`t.st.marked`, non-stacking, lasts until death, no hidden debuff); Rangers apply Hunter's Mark in their kit and cash in via Favored Foe.
- Barbarian **Rage**: unlimited stacks from conditions (usually damage taken), passive bonus; stacks alone must never make a hero invincible.
- Warlock **Pact**: triggers off the pure-tag **`Hex`** condition (`t.st.hexed`, non-stacking, lasts until death, no hidden debuff); not spent or stacked; separate from casts.
- Bard **Bardic Inspiration**: a die given to allies; casts can use or read it.
- Druid **Wild Shape**: a bonus health bar; when it's depleted the form ends; can transform abilities/stats.
- Loops: outside triggers respect each feature's internal cooldown.
- **Scaling means it carries across the run** (Luke, 27 Nov): run-long state uses a kit's `carryKeys`, saved on the hero's rec after each fight (`carryBack`).

**Items, shop, encounters**
- Items stay **stat-based for now**; class features tie into perks and house rules first. Item tiers direction: Uncommon (small stats) / Rare (solid offense/defense) / Epic (build-around).
- Shop: owned heroes offered at 0.75 weight; rerolls start at 1 gold, +1 per reroll per shop.
- Nezznar is the only Act 1 boss and the Act 2 check. Placement is a skill reward. Flat boss bonuses are fine.
- Encounters get a numbers buff (damage first) once the whole cast is reworked.

## 6. Cast rework status

Workflow per batch: Luke gives a one-line direction per hero (or "your call") → draft base kit + two paths → test (tier 1 `jobs`; paths with `--tier 2 --partnerTier 1`; `gauntlet` for scaling) → proposal per hero → Luke rules → lock in → run `bots`, `bosscheck`, prototype2 once for the batch.

| Hero | Class | Status | Doc |
|---|---|---|---|
| Arthur | Fighter | **Locked** (Alert 25% Evasion → Action Surge on dodge; Riposte Master / Goading Strike) | docs/v0.25/arthur-rework.md |
| Bram | Cleric | **Locked** (Preserve Life base; Unyielding / Shield of Faith) | bram-rework.md |
| Faelan | Wizard | **Locked** (Arcane Recovery via Spell Weave; Projected Ward / Shared Recovery) | faelan-rework.md |
| Wallaby | Rogue | **Locked** (Sneak Attack via Opportunist; Cutthroat / Pickpocket gold-only) | wallaby-rework.md |
| Sir Dane | Paladin | **Locked** (Divine Smite; run-long Duelist / Retribution) | batch1-rework.md |
| Gilthrax, Zoe, Laurel, Pillar, Zark, Naill | batch 1 | **Locked** (Zark & Pillar Rage/Maul updated in class-feature pass) | batch1-rework.md, batch2-proposals.md |
| Lorcan, Corvin, Velith, Nettle, Lumen | batch 2 | **Locked** (Favored Foe + Hunter's Mark tag, Pact + Hex tag, Sneak Attack force bypass) | batch2-proposals.md |
| Cinder, Gains, Rosalind, Jamison, Saint | batch 3 | **Locked** (Metamagic, Arcane Recovery, Bardic Inspiration, Channel Divinity ×2) | batch3-rework.md |
| Juniper, Kaska | batch 4 | To do (Wild Shape: new health-bar mechanic) | |
| Toot | Bard | Switched off until redesigned | |

**Code pattern for reworks:** new kits go in `behaviour.js` `KITS2` and are picked when the hero's config has a `"kit2": {...}` block (the old `KITS` entry stays for the prototype2 preset). Arthur, Bram, Faelan, Wallaby and Dane were done earlier with config hooks inside their original kits (e.g. `riposte`, `channelDivinity`, `arcaneRecovery`, `sneakAttack`, `smite`).

**Lock-in checklist:** copy the preset's edits into `heroes.config.json` (patch the text; don't reformat the whole file); add the reverse edits to `presets/prototype2.json` (`kit2: null`, old values) and confirm it still gives 47.0%; update `PATH_NAMES` in `bench.js`; run `bots bare sensible engine --n 300 --seed 20000` and `bosscheck --n 150`; write or update the doc in `docs/v0.25/`; record the ruling in `REVIEW-QUEUE.md`.

## 7. Next steps, in order

1. **Batch 4:** Juniper and Kaska (Wild Shape). Needs a bonus health bar mechanic in the engine (`formHp` exists for the old tier 2 forms; generalize it).
2. Turn on attack growth (`rules.attackGrowth.extraDicePerTier = 1`) and check the whole cast against the tier 2–4 benchmarks; settle whether damage may outgrow the HP curve.
3. **Encounter numbers buff** to match the reworked cast (damage first): never-buy dies at fight 3; sensible survives with tension; engine pulls ahead; boss check C back to ~33%.
4. Then the items rework (Uncommon / Rare / Epic, priced with the buff-test values in docs/v0.25/buff-test.md), then shop odds.
5. Later: Toot's kit; wiring the playable prototype (`src/`) to read the bench configs.

## 8. Known open items

- Boss check party C (one tier 2) at 42% — above "struggles".
- Zark (frontline) damage 4.1/s vs 2–3; Lorcan 5.8 and Velith 6.0 vs 4–5 (batch 2).
- Pickpocket (Wallaby) is gold-only; its value needs whole-run tests where bots pick paths on purpose (they pick at random today).
- The bench barely separates "solo frontline" from "with another tank" (Bram's paths).
- Unruled older cards: "Act 1 encounters" (encounter pass 1) and "Act 1 boss" (Nezznar) — Luke called them good to go on 26 Nov.

## 9. Where things are saved

- GitHub: this repo. All bench work, presets and docs are on branch `testbench-bots-and-replay-tests` (PR #6), merged into `main` on 27 Nov if the merge succeeded (check `git log main`).
- claude.ai Project "Basement & Basilisks" mirrors the bench (`claude/testbench/`, one-file `testbench-bundle.js`) and the docs (`claude/v0.25b-*.md`), plus artifacts that can't be opened from here: the Design Bible (class-feature rules section), the B&B design review page (cards and rulings), the balance model sheet (incl. Benchmarks by tier), the hero performance sheet and the Nezznar boss check sheet. Their substance is in this file and `docs/v0.25/`.
