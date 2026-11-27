# Arthur rework: the counter-puncher (26 Nov, proposed)

Review card: "Arthur" on the B&B design review page. Nothing here is in `heroes.config.json` yet; the bench supports it through edits.

## Proposed kit
- **Longsword:** 1d8 + STR every 1.5s, +1d8 per tier (Luke's attack-growth rule).
- **Alert (passive):** 25% Evasion.
- **Action Surge, Riposte:** when an attack misses him (evaded or dodged), he makes an immediate Longsword attack at the attacker. 6s internal cooldown.
- **Alert Strike (Medium, 100 charge):** he dodges every attack for 0.75 / 1 / 1.25s (Low / Mid / High), then makes a crit strike of 1d8 per tier + STR, +1d8 for each attack he dodged (up to 3). A natural 20 adds +1 die.
- **Stats:** AC 16 → 12, STR 16 → 14. Everything else unchanged.

## New rule: Evasion (Luke, 26 Nov)
- A chance that an attack misses. Attacks only, never abilities.
- Hard cap 50% (`rules.evasion.cap`).
- Pierce lowers it (`pierce` on enemies; `pierce` on items).
- Sources: hero passives (`evasion` in a hero's config), items (`eva`), enemies (`evasion`, rare and low).
- Effective HP counts it: physical effective HP ÷ (1 − evasion).

## Results (tier 1, no items, fights 2–5)
| Version | Win | Dies | Eff. HP | Dmg/s | Casts/30s | Value/cast |
|---|---|---|---|---|---|---|
| Today | 30% | 82% | 216 | 4.6 | 0.9 | 31 |
| First draft (Riposte free during the dodge, 1d8 strike) | 58% | 61% | 256 | 5.7 | 2.8 | 8 |
| Riposte 4s always, +1d8 per dodge, STR 16 | 56% | 60% | 256 | 6.0 | 2.8 | 19 |
| Shorter dodge, up to 2 dice | 46% | 72% | 256 | 5.3 | 2.6 | 14 |
| **Proposed** | **46%** | **73%** | **256** | **5.1** | **2.6** | **16** |

Tiers 2 / 3 / 4 with attack growth on: damage 7.2 / 9.5 / 11.4 (targets 6–7.5 / 8–10 / 10–12.5), effective HP 384 / 512 / 640 (on target), value per cast 19 / 23 / 28 (targets 30 / 40 / 50: attacks carry his growth, not the cast).

Cast off: his fights drop 14 points today, 13 with the proposal. Whole runs (200 per bot): sensible 52.5 → 54.5%, engine 68.5 → 70%.

## Re-run
```
E='arthur.ac=12, arthur.evasion=0.25, arthur.size=medium, arthur.chargeToCast=100, arthur.ability.dodgeSeconds={"low":0.75,"mid":1,"high":1.25}, arthur.ability.strike.dice=1d8, arthur.ability.extraDiceIfDodged=0, arthur.ability.extraDiceOnNatural20=1, arthur.ability.extraDicePerDodge=1, arthur.ability.maxDodgeDice=3, arthur.riposte={"cooldown":6,"noCooldownWhileDodging":false}, arthur.stats.STR=14'
node bench.js jobs arthur --n 250 --edits "$E"
node bench.js jobs arthur --n 150 --tier 2 --edits "rules.attackGrowth.extraDicePerTier=1, $E"
```

## Tier 2 paths (Luke picked these, 27 Nov; numbers proposed)
- **Riposte Master (path A, damage):** Ripostes are critical hits; each Riposte adds +1d8 to his next Alert Strike (stores up to 3); Riposte cooldown 6s → 3s.
- **Goading Strike (path B, tank):** when Alert Strike starts, every foe within 2 squares is taunted until 1s after the dodge ends, so they swing into it; Alert 25% → 35% Evasion.

| Version | Win, regular | Win, Nezznar | Arthur dies | Allies die | Party HP lost |
|---|---|---|---|---|---|
| Tier 1 | 69% | 75% | 54% | 51% | 69% |
| Tier 2, no path | 86% | 87% | 26% | 41% | 58% |
| Ready First (today) | 91% | 90% | 15% | 35% | 52% |
| Second Wind (today) | 91% | 91% | 14% | 38% | 54% |
| Riposte Master | 89% | 97% | 18% | 39% | 56% |
| Goading Strike | 90% | 95% | 18% | 29% | 50% |

Fights 3 to Nezznar from 150 sensible + 150 engine runs, 3 replays each (`paths` now also reports party HP lost and deaths). Tier 2 damage per second: no path 7.3, Riposte Master 8.8.

What didn't work: taunting only the foes who already swung at him (they were on him anyway; allies died as often), and only shortening Riposte's cooldown (Evasion limits Ripostes, not the cooldown).

```
P='arthur.t2.riposteMaster={"riposteCooldown":3,"maxStoredDice":3,"riposteCrits":true}, arthur.t2.goadingStrike={"when":"start","reach":2,"extraSeconds":1,"evasionBonus":0.1}'
node bench.js paths arthur --n 150 --reps 3 --edits "$E, $P"
node bench.js jobs arthur --n 200 --tier 2 --path 0 --edits "rules.attackGrowth.extraDicePerTier=1, $E, $P"
```

## Open
- `rules.attackGrowth.extraDicePerTier` is 0 (off) until the whole cast is reworked; turning it on alone makes every hero's casts and attacks grow together.
