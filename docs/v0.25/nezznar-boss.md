# B&B v0.25b: Nezznar, the one Act 1 boss (26 Nov 2026)

Proposed on the review page as "Act 1 boss: Nezznar is the check for Act 2".

## Luke's brief (26 Nov)
One boss instead of three: Nezznar, the check for entering Act 2. A party of all tier 2 heroes, one with items, should do well; two tier 2 heroes with items should clear relatively well with a good team; a party with one tier 2 hero should struggle.

## Changes
- `enemies.config.json`: Venomfang and King Grol stay in the file with `"active": false` (out of runs and tests, kept for later acts). Nezznar is the only active boss.
- Nezznar's damage (on top of encounter pass 1; no HP changed):

| | Pass 1 | Now |
|---|---|---|
| Giant Spider (×3) | 2d6+8 ×2 every 1.6s | 2d6+3 ×2 |
| Nezznar's bolt | 2d8+22 every 2s | 2d8+14 |
| Web | 5d6+8 to the 2 closest heroes, Restrained 2s | 7d6+8 to the 3 closest heroes |

  Damage moved from the spiders' steady hits into Web's burst on the whole party, which punishes tier 1 heroes' smaller HP most and widens the gap between the three party types.
- Bench: `bosses.<id>.<key>` edit paths (e.g. `bosses.grol.active=true`); `presets/prototype2.json` turns the other two bosses back on and still reproduces 47.0%.

## The boss check (`node bench.js bosscheck --n 150`, 3 replays each)
Every party the sensible and engine bots brought to the boss (227 parties), rebuilt three ways; the heroes holding the most items rank up first.

| Party | Win | HP lost | Items held |
|---|---|---|---|
| A: all tier 2, items on one hero | 84% | 64% | 2.0 |
| B: two tier 2, with items | 73% | 68% | 5.9 |
| C: one tier 2, with items | 33% | 86% | 5.9 |

| Team | A | B | C |
|---|---|---|---|
| Frontliner + damage + support (68) | 93% | 84% | 40% |
| Frontliner + damage, no support (106) | 85% | 72% | 31% |
| No frontliner (50) | 74% | 62% | 30% |

Before (pass 1 Nezznar): A 48%, B 42%, C 11%.

## Whole runs (`bots --n 300 --seed 20000`)
| Bot | Cleared (3 bosses, pass 1) | Cleared (Nezznar only, before) | Cleared now | Boss win now |
|---|---|---|---|---|
| Never buys | 0% | 0% | 0% | — (dies at fight 3) |
| Buys sensibly | 50% | 45% | 62% | 87% |
| Builds an engine | 61% | 58% | 70% | 89% |

Bot parties reach the boss with about 2–3 tier 2 heroes and 6 items, so they sit near party types A and B. The run's tension now lives in fights 3–5.
