# Basements & Basilisks v0.25: Act 1 Encounters (Lost Mine of Phandelver), first pass

**Date:** 2026-11-23
**Status:** First-pass numbers from the balance sheet ("Act 1 Phandelver" tab). Nothing is implemented yet; the sim will move these.
**Builds on:** `claude/v0.25-hero-design-session-2026-11-23.md` (hero math) and `docs/v0.25_design_direction.md` §8–10 (map, Act structure, fight length).

## Targets and assumptions
- **Act shape:** 5 encounters and a boss (§9 of the design direction).
- **Party assumed per fight:** Fight 1 the starter alone (T1); three heroes at T1 from Fight 2; at the boss, one hero at T2 from the Campfire rank-up.
- **Fight length:** intro about 8–14s (about one cast); Fights 2–3 30–40s; Fights 4–5 35–45s; boss 45–60s.
- **Economy (Luke's numbers):** start with 10 gold and a free starter; heroes 15 / 25 / 35 / 45 gold by tier; items Common 5, Uncommon 10, Rare 15, Very Rare 25, Legendary 35, class items 15; 20 gold per win in Act 1; interest of 1 per 5 saved, counting up to 20. A typical player saves the 10, has 32 after Fight 1 and buys 2 heroes, so the party is full from Fight 2. Item power per hero (Common-item equivalents, Economy tab): 0.9 at Fight 3, 2.0 at Fight 4, 3.4 at Fight 5, 4.6 at the boss. Nobody reaches T2 until the Campfire, so the boss party averages tier 1.33.
- **Damage taken:** an average party with items loses about **30%** of its HP before elite and boss abilities (roughly 40% with them). A competent party (good placement, focus fire, counters bought) should finish with most of its HP; a careless one is in real danger.
- **Enemy rules:** regulars have a basic attack and at most one trait; elites and bosses add one d20 ability (Low / Mid / High, Fizzle and Crit as for heroes). Bosses take half duration from control and half value from Advantage and Disadvantage. All amounts are dice plus flat; no hidden multipliers.
- **Hit profiles:** attack intervals run from 1.2s (goblins, twig blights) to 3.0s (Klarg).

## The encounters

| # | Fight | Enemies | Terrain | Clear time | Party HP lost |
|---|---|---|---|---|---|
| 1 | Goblin Ambush (Triboar Trail) | 2 Goblins, melee only | None (intro) | ~10s | ~17% |
| 2 | Klarg's Cave (Cragmaw Hideout) | Klarg, Ripper (his wolf), 2 Goblins | Flood channel: at 10s water rushes down the bottom row, pushing anyone in it 2 squares left | ~33s | ~35% |
| 3 | Glasstaff's Hideout (Tresendar Manor) | Glasstaff, 2 Redbrand Ruffians | A crevasse splits the enemy half with one bridge; Glasstaff stands behind it | ~34s | ~31% |
| 4 | Thundertree | Vine Blight, 2 Needle Blights, 1 Ash Zombie, 2 Twig Blights | Ruined cottage walls block line of sight | ~36s | ~30% |
| 5 | Forge of Spells (Wave Echo Cave) | 2 Flameskulls, 2 Ghouls | The Forge: a hero next to it adds +1 die to their ability | ~36s | ~28% |
| Boss | Nezznar, the Black Spider | Nezznar, 2 Giant Spiders | Webbed squares root for 1s | ~48s | ~31% |
| Boss | Venomfang (Thundertree tower) | Venomfang, 2 Twig Blights | Ruined tower: high ground, +1 range | ~52s | ~26% |
| Boss | King Grol (Cragmaw Castle) | King Grol, 2 Wolves, 1 Goblin Archer | Castle gate: a one-at-a-time choke point | ~46s | ~29% |

Three bosses are drafted so the Act can draw one per run and preview it at the Campfire.

## What each fight tests
- **1, Goblin Ambush:** the starter alone, melee only, so every starter (Toot included) can clear it with about one cast.
- **2, Klarg's Cave:** placement. Ripper leaps onto your rearmost hero when the fight starts, so you choose who it lands on (a sturdy hero in the back corner, or a guard next to your caster). Klarg doesn't leap; he smashes whoever is in front of him. The flood punishes standing in the bottom row.
- **3, Glasstaff's Hideout:** reaching a caster. Glasstaff's Magic Missile targets the lowest-HP hero; the bridge is a choke point, so ranged heroes and divers (Kaska, Pillar's Toss) shine. The Redbrands' AC 14 favors magic and Radiant.
- **4, Thundertree:** many small hits and crowd control. The Vine Blight's Entangle roots heroes (who then cast with Disadvantage); the Ash Zombie inflicts poison when it dies; walls block shooters.
- **5, Forge of Spells:** focus fire. A destroyed Flameskull drops its skull (20 HP, AC 10) for 6s: break it and the Flameskull is gone, ignore it and it re-forms at half HP. A Radiant killing blow skips the skull, so Radiant is a shortcut, not a requirement. Ghouls stun with every third hit. The Forge rewards holding ground next to it.
- **Bosses:** Nezznar is the control boss (Web, then Darkness at half HP); Venomfang is the poison and positioning boss (cone breath, Wing Buffet); King Grol is the dive boss (Brutal Charge on the rearmost hero within 4 squares, faster attacks at half HP).

## Enemy roster

| Enemy | Rank | HP | AC / SR | Attack | Trait or ability |
|---|---|---|---|---|---|
| Goblin | Regular | 26 | 12 / 10 | 1d6, 1.4s | Melee only in the intro |
| Goblin Archer | Regular | 30 | 12 / 10 | 1d6, 1.8s | Range 4 |
| Ripper (Klarg's wolf) | Regular | 90 | 13 / 10 | 1d6, 1.8s | Leaps onto the rearmost hero at the start; placement decides who |
| Klarg (bugbear) | Elite | 300 | 15 / 11 | 2d8, 3.2s | Surprise Attack: smashes his current target (Low 2d8+2, Mid 3d8+2, High also stuns 1s); no leap |
| Redbrand Ruffian | Regular | 120 | 14 / 10 | 2 × 1d4, 2.0s | Two strikes; armored brawler |
| Glasstaff (Iarno) | Elite | 240 | 12 / 16 | 3 × 1d4 magic, 1.8s | Magic Missile (3 darts) at the lowest-HP hero; Staff of Defense Ward 2d10+INT; once, teleports away at half HP |
| Twig Blight | Regular | 40 | 12 / 8 | 1d4, 1.7s | Many small hits |
| Needle Blight | Regular | 85 | 12 / 9 | 1d6, 2.8s | Range 3 |
| Vine Blight | Elite | 310 | 12 / 10 | 2d6, 3.2s | Entangle: roots target and neighbors 1.5 / 2 / 3s, 1d6 each |
| Ash Zombie | Regular | 140 | 9 / 8 | 1d8, 3.0s | On death, inflicts 2 poison on adjacent heroes |
| Flameskull | Elite | 170 | 13 / 16 | 2d6 magic, 3.0s | Range 4. Fireball 3d6 (High 4d6). Rejuvenation: drops a 20 HP skull for 6s; break it or it re-forms at half HP (once); Radiant skips the skull |
| Ghoul | Regular | 150 | 12 / 10 | 2 × 1d6, 2.7s | Two claws; every 3rd hit on the same hero stuns 0.5s |
| Nezznar | Boss | 820 | 14 / 16 | 2d8+2 magic, 2.2s | Range 4. Web: roots 2 heroes 2 / 3s, 2d6 each; Darkness at half HP |
| Giant Spider | Regular | 125 | 14 / 11 | 1d8+1, 2.2s | Bite inflicts 1 poison |
| Venomfang | Boss | 1000 | 17 / 14 | 2d10+2, 2.6s | Large. Poison Breath: cone, 4d6 + 3 poison (High 5); Wing Buffet at half HP |
| King Grol | Boss | 930 | 16 / 12 | 2d8+2, 2.8s | Brutal Charge: charges the rearmost hero within 4 squares, 4d8+3, stun 1s (High 1.5s); faster at half HP |
| Wolf | Regular | 70 | 12 / 9 | 1d6, 1.8s | Fast melee |

## Open
- **Design principle used here:** enemy jumps target a position (the rearmost hero), not the weakest hero, so the player's placement controls them.
- Elite and boss abilities aren't in the sheet's numbers yet; the sim should confirm they keep fights inside the targets.
- The party-per-fight assumption depends on shop economy (gold per fight, hero prices).
- Support starters in the intro fight: some deal little damage alone; check each starter's clear time.
- Large units (Venomfang) and map size: confirm Large means 2×2 on the 6×8 map.
