# Act 1 Prototype: Build Instructions (v0.25)

**Date:** 2026-11-23
**Goal:** a playable Act 1 (Lost Mine of Phandelver) on the v0.25 rules: pick a starter, five fights and a boss, shops, choice cards, the Campfire, then Rousing. Tiers 1–2 only.
**Who this is for:** whoever builds it (Luke or a coding agent). Read this first, then the sources below.

## 0. Sources of truth

| What | File | Wins over |
|---|---|---|
| Rules, math model, hero kits (T1 and T2) | `docs/v0.25/hero-design-session.md` | everything below it |
| Act 1 enemies, encounters, terrain | `docs/v0.25/act1-phandelver-encounters.md` | old `src/02-enemies.js` data |
| Items | `docs/v0.25/items-rework.md` | old `src/04-items.js` data |
| Game shape (Act loop, map, shop, Campfire, Rousing) | `docs/v0.25_design_direction.md` §7–§10 | older handoffs |
| Numbers | `data/v0.25/heroes.json`, `items.json`, `act1.json`, `economy.json` | numbers written in prose |

The numbers come from the balance sheet (claude.ai artifact "B&B v0.25 balance curve model"). If a doc and a JSON file disagree, the JSON file is newer. Numbers in [brackets] in the docs are tunable.

**Don't invent rules.** If something isn't covered here or in the sources, use the default in §9 and log it in `docs/v0.25/PROTOTYPE_NOTES.md` for Luke.

## 1. Remove or switch off

- Lanes, Camp Ranks, House Rules (`src/04b-house-rules.js`), pack filters in the shop, the branching DAG map, Mystery/Curio/Training/Quest Board/Multiclass Shrine nodes, Epic Boons, hero quests.
- Hidden multipliers: per-tier damage/HP multipliers (`TIERX`, `tierScale`, `dm`), the exponential enemy `CURVE`, `TUNE` per-hero multipliers, `chaK` potency scaling. Everything must follow §2.
- Evasion (all sources), Exposed, Stagger (use Slow), Necrosis, Sorcery Points, the WIS minimum d20 roll, attribute parity on items.
- `tools/verify-v024.mjs` checks the old item parity invariant; retire it or replace it with a v0.25 verifier (§8).

## 2. Combat math (engine: `src/05-engine.js`)

Full details: hero-design-session.md §1–§2. Summary:

- **Damage per hit** = NdX + flat bonus. Tiers add dice, items and perks raise die size, the key ability modifier is the flat bonus. **Area abilities use dice only. Radiant never gets a flat bonus.** Fractions round down.
- **Resistance** = R³ / (R³ + 16³). AC vs physical, SR vs magic, **Radiant ignores both.** Armor/spell penetration lowers R first. Poison and Burn are magic.
- **HP** = base HP + 8 hit dice per tier (class die, averaged) + CON modifier × every hit die. CON gains apply retroactively.
- **Attack interval** = base interval ÷ (1 + ratio × attack speed bonus), minimum 0.3s. Each hero has its own base interval and ratio (`heroes.json`).
- **Abilities:** each hero has a base cast interval and a cast time. No attacks during a cast; a stun during a cast cancels it with half charge back; the attack timer restarts after a cast. No ability fires more than once per second.
- **Charge (0–100):** time-based gain at 100 / cast interval per second, +10% per INT modifier (time part only); +1 per basic attack; +60 for losing your whole max HP (before armor; Ward-absorbed, dodged and self-inflicted hits count). **Starting charge** = 10 per CHA modifier, max 50. Stun pauses charge.
- **The d20 ability roll:** d20 + key modifier. Natural 1 = **Fizzle** (nothing happens, half charge back). Natural 20 = **Crit** (dice doubled, flat bonus not). Low (≤5), Mid, High (≥14) are per hero; Low/High band effects are in each kit.
- **Advantage / Disadvantage:** ability rolls only, roll 2d20 and take the higher/lower; they don't stack. Bosses take half (roll with it every other time).
- **Crits** double dice only. Sources: natural 20, abilities that say so, melee hits on a stunned foe, the first strike out of Stealth. No random crit chance.
- **On-hit item damage** is a separate die; another damage type uses that type's resistance but counts as the same hit (no extra on-hit triggers, charge or Ki).
- **Last Stand:** once per fight, a hero dropping to 0 stays at 1 HP and is invulnerable for 1.5s. Pillar's Rage bar replaces it for him.

## 3. Statuses

| Status | Rule |
|---|---|
| Root | Can't move. A rooted unit that casts rolls with Disadvantage. |
| Slow | Moves and attacks slower by a %, strongest wins, no stacking. |
| Stun | Can't move, attack or gain charge. 1s stun immunity afterward. |
| Taunt | Must attack the taunter. |
| Stealth | Untargetable; ends when the unit attacks or casts; that strike crits. Area effects still hit. |
| Burn | Its value per second for 3s; a new Burn replaces the old. |
| Poison | Deals its value per second, then drops by 1. New poison adds to the existing value. |

- Bosses take half duration from Root, Slow, Stun and Taunt. Spell resistance shortens control by the same fraction it cuts magic damage.
- Wild Shape forms have their own HP as a % of the druid's max HP.

## 4. Heroes (`src/03-heroes.js`)

- All 24 heroes, T1 kits and T2 keyword choices: hero-design-session.md §4. Numbers: `data/v0.25/heroes.json` (read its `modelNotes`: a few sheet values are stand-ins, e.g. Pillar's weapon is 2d8 per tier, Velith's ability is 2d6 per tier).
- **T1 has no keyword.** T2 unlocks the class keyword, and the player picks one of the hero's two T2 options.
- Roles may be hybrid (e.g. "Tank/Support"). Supports target themselves only as a fallback.
- Targeting: enemy jumps and leaps target a **position** (e.g. the rearmost hero), never "the weakest hero", so placement controls them.

## 5. Items (`src/04-items.js`)

- All 88 items: `data/v0.25/items.json` (`text` is the card text). Rules: items-rework.md.
- Common/Uncommon items are stats only. Stat items give +2 (or +4) to one or two scores.
- Prices: `economy.json`.

## 6. Act 1 (`src/02-enemies.js`, `src/01-geo.js`, `src/06-adventure.js`)

- **Map:** 6 rows × 8 columns, horizontal. Heroes deploy in columns 1–4, enemies in 5–8. One terrain element per map (`act1.json`).
- **Enemies and encounters:** `act1.json`. Regulars have a basic attack and at most one trait; elites and bosses have one d20 ability.
- **Fight 1** is the starter alone, melee enemies only, cleared with about one cast.
- **Boss:** draw one of the three each run and show it at the Campfire (default; Luke may fix it to Nezznar).
- **Loop** (design direction §9): Shop → Fight 1 → Choice → Shop → Fight 2 → Choice → Shop → Fight 3 → Choice → Shop → Fight 4 → Choice → Shop → Fight 5 → Campfire → Shop → Boss → Rousing.

## 7. Economy, shop, choice cards, Campfire

- **Economy:** `economy.json`. Start with 10 gold and a free starter. 20 gold per win in Act 1; 75 for the boss and Rousing. Interest: 1 per 5 saved, counting up to 20. Sales 25% off; sell back for 66%; rerolls 1 gold, +1 per reroll.
- **Shop:** 3 hero offers and 3 item offers per roll. The shop is a window: the player can toggle to the upcoming battle map and place heroes before pressing Fight.
- **Choice after each fight (draft Act 1 deck, two cards shown):**
  - Multiclass Trainer: one hero gains another class's generic keyword (one multiclass per hero).
  - Class item: pick 1 of 2 class items for classes in your party.
  - Free item: a random Uncommon.
  - Purse: +15 gold.
  - Training: +2 to one hero's key stat for the run.
  - Recruit: pick 1 of 3 T1 heroes for free (goes to the bench).
  - Bargain: the next fight adds an elite; win it for double gold.
  - Bargain: skip this reward; the next choice shows 3 cards.
- **Campfire (after Fight 5), pick one:** rank one T1 hero up to T2; every hero starts the boss with a Ward of 4d10 + CON; refresh the Piggy Bank.
- **Rousing (after the boss):** 75 gold and a premium shop (party expansion slot, a Legendary item). Act 2 isn't built, so end the run with a victory screen here.
- **Losing:** one free loss (the Piggy Bank breaks; retry the same fight after a shop); the second loss ends the run.

## 8. Testing and acceptance

Build a headless bot run (extend `tools/` or a `sim/` script) that plays Act 1 with a simple shop policy (fill 3 heroes, then items) across many random parties, and print per fight:
- fight length (median and 10th/90th percentile);
- party HP left at the end;
- win rate per fight and per run;
- per-hero damage, healing, Ward and damage taken.

**Targets** (from the sheet; tune enemies first, heroes second):

| Fight | Length | Party HP lost (average party) |
|---|---|---|
| 1, Goblin Ambush | 8–14s | ~15–20% |
| 2–5 | 30–45s | ~30–40% |
| Boss | 45–60s | ~30–40% |

- A competent party (good placement, buys counters) should finish fights with most of its HP; a careless one should be able to lose.
- Every starter must clear Fight 1. Report any that can't.
- Report any hero whose ability share drifts more than 10 points from its target in `heroes.json`.
- Add `docs/v0.25/PROTOTYPE_NOTES.md` with the results and every default you had to use.

## 9. Defaults for undecided details

Use these and log them; Luke decides later.

| Question | Default |
|---|---|
| How duplicates tier a hero up | Buying a copy of a hero you own ranks it up (two copies = T2). |
| Item slots per hero | 2 at T1–T2. |
| Starters | Offer 3 random heroes; all 24 are eligible. |
| Boss | Random of the three; preview at the Campfire. |
| Unclear enemy targeting | Nearest hero; ties go to the higher row. |
| Range | Melee 1, short 2, mid 3, long 4 squares. |

## 10. Suggested order of work

1. Strip the removed systems (§1) and get the game running on a single test fight.
2. Engine math and statuses (§2–§3), with unit checks: one hero vs one dummy prints damage per second matching the sheet.
3. Heroes T1 (§4), then T2 choices.
4. Items (§5).
5. Act 1 maps, enemies and the loop (§6–§7).
6. Shop window, choice cards, Campfire, Rousing, post-fight summary (damage dealt and taken per hero, what killed the fallen, how close it was). Cards show AC and SR as values with the resist % on hover.
7. Bot runs and tuning (§8); write PROTOTYPE_NOTES.md.
