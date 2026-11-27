# B&B v0.25b: encounter pass 1 (25 Nov 2026)

Proposed, on the review page (B&B design review) as "Act 1 encounters: Enemies hit harder so the party has to grow or lose". `tools/testbench/config/enemies.config.json` holds these numbers; the "before" values are listed below.

## The three bot players (`tools/testbench/bots.js`)
- **Never buys (`bare`)** fills the 3 party slots (the first 30 gold), then never buys anything else: no items, duplicates or rerolls, and only Purse or Patience choice cards. Read as Luke's intent: literally never buying leaves the starter alone, who loses at fight 2.
- **Buys sensibly (`sensible`)** wants a frontliner and a damage dealer, buys a copy of any hero it owns (rank-up), buys the item worth most per gold to whoever it fits, and takes Free item > Class item > Training > Purse > Multiclass.
- **Builds an engine (`engine`)** builds a melee brawl engine: a melee carry, a sustain frontliner (Laurel, Bram, Gilthrax, Dane), Rage multiclass or the Totem on the front line, on-hit items, STR and the Battle Master's Gauntlet on the carry, rank-ups for the carry first, rerolls to find copies.
- All three play the real shop, economy, choice cards, campfire and free loss from `run.js`. Same seed = same starter and first shop. T2 paths are still random for every bot.
- Command: `node bench.js bots [bare sensible engine] --n 300 --seed 20000 [--edits "..."] [--json]`.

## Results (300 runs per bot, seeds 20000+)

| Bot | Cleared | Runs end (fight: count) | Free loss used | Klarg | Glasstaff | Thundertree | Forge | Bosses | HP lost F2–5 |
|---|---|---|---|---|---|---|---|---|---|
| Never buys, before | 15% | ends mostly at 4 | 92% | 66% | 83% | 28% | 77% | 39% | 78% |
| Sensible, before | 81% | | 36% | 75% | 95% | 81% | 100% | 99% | 49% |
| Engine, before* | 86% | | 30% | 74% | 98% | 89% | 100% | 99% | 46% |
| **Never buys** | **0%** | 2:19 3:179 4:80 5:22 (median 3) | 100% | 84% | 21% | 14% | — | — | 84% |
| **Buys sensibly** | **50%** | 2:1 3:33 4:41 5:24 B:52 W:149 | 68% | 95% | 72% | 70% | 78% | 64% | 62% |
| **Builds an engine** | **61%** | 2:10 3:30 4:23 5:13 B:42 W:182 | 57% | 92% | 75% | 78% | 86% | 70% | 57% |

*Before = first engine bot (carry + buffer), 200 runs, seeds 1000+. Win % per fight counts every attempt.
Bosses after: sensible Grol 66% / Nezznar 66% / Venomfang 81%; engine 69% / 72% / 80%. Engine wins with less HP lost (bosses 38–45% vs 53–62%).
The original `run` bot now clears 25% (was 78%). Every hero still clears Fight 1 alone (goblins unchanged).

## Enemy changes (damage only, no HP)
| Enemy | Before | After |
|---|---|---|
| Goblin Archer (Klarg's Cave) | 2d10+4 | 2d8+2 (eased: fight 2 is always a bare party) |
| Glasstaff | bolt 2d10+4; darts 1d6+1, every 6s | bolt 2d10+6; darts 2d4+2, every 5s |
| Redbrand Ruffian | 1d8 ×2 | 1d8+2 ×2 |
| Vine / Twig / Needle Blight | 2d8+1 / 2d4+1 / 2d10 | 2d8+4 / 2d4+2 / 2d10+2 |
| Ghoul | 2d6 ×2 | 2d6+8 ×2 |
| Flameskull | 3d6; Fireball 3/5/7d6 every 11s | 3d6+8; Fireball 6/8/10d6 every 6s |
| Lesser Flameskull | 3d6 | 3d6+6 |
| King Grol | 4d6; Charge 3/4/4d8+4 every 10s | 4d6+14; Charge 5/6/6d8+8 every 6s |
| Cragmaw Wolf | 2d4+1 | 2d4+6 |
| Nezznar | 2d8+6; Web 2d6+2 | 2d8+22; Web 5d6+8 |
| Giant Spider | 2d6 ×2 | 2d6+8 ×2 |
| Venomfang | 4d6+4; Breath 4d6+6 every 7s | 4d6+20; Breath 10d6+8 every 5s |

## Findings
- **Rank-ups grow a party fastest.** At Glasstaff a single T2 hero takes a party from about 25% to about 75%; items alone add less. Two copies of a 15-gold hero is the best buy in the game.
- **"Feed one carry" is not an engine today.** The first engine bot (carry + Rosalind/Jamison, damage items stacked on the carry) did worse than buying sensibly. Rosalind and Jamison are near the bottom at the Forge and bosses; parties where one hero deals over half the damage win no more often.
- **What does win late:** on-hit weapons (Flame Tongue 93%, Vicious 85% at Forge/bosses), the Totem Fetish / Rage (88%), Belt of Hill Giant Strength, the Battle Master's Gauntlet. Attack speed (Gloves, Quicksilver) and charge items (Pearl of Power, Pact Rod) lag.
- **Why the engine gap is thin (61% vs 50%):** 2 item slots per hero, T2 is the cap in Act 1, most items are flat stats, and T2 paths are random. A bigger gap needs engines in the kits and items (T2 pass, items rework), not harder enemies.
- **Shape to revisit:** boss flats are now large next to their dice (e.g. Nezznar 2d8+22). If Luke prefers dice to carry the damage, I can reshape to the same averages.

## Not yet tested (from the review skill's test list)
Placement variations, item-off and cast-off tests on the tuned encounters.
