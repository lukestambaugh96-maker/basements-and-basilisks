# Cast rework batch 4 — Wild Shape (locked in by Luke, 27 Nov)

Completes the full 22-hero Act 1 cast rework (Toot stays switched off until redesigned). Both **Juniper** and **Kaska** are locked into `tools/testbench/config/heroes.config.json`, using the new generalized Wild Shape bonus health bar in `engine.js` (`enterWildShape` / `endForm`: pure-dice bonus HP bar, **no timer** — form ends only when depleted, overflow hits real HP, transforms stats/attacks and reverts cleanly on break). `presets/prototype2.json` reverts them and still reproduces **47.0%**.

## Locked kits & benchmarks (`n=250` T1; `n=200` T2 + T1 partners)

| Hero | Job | Locked kit & Wild Shape | T1 Win (EHP / DPS / Val) | T2 Base → Path A / Path B |
|---|---|---|---|---|
| **Juniper** | Frontline | **Entangle** (Medium, `100` charge): Restrains foes within `2` (`1.5/2/2.5s`), deals `1d6`/tier magic, triggers **Wild Shape (Briar Form)** (`3d8 + CON`/tier bonus HP, `+2` AC). | 47% (`245`* / `2.9` / `23`) | 68% → **Bramble Guard 80%** (`4d8 + CON`/tier HP, `+3` AC, `1d4` Thorns, `1.5s` taunt) / **Bramble Stalker 76%** (`1d12 + WIS` Claws, `+40%` AS, `+3` Poison/hit, Entangle Slows `30%` `3s`) |
| **Kaska** | Brawler | **Moonlit Pounce** (Big, `180` charge): Leaps to farthest foe (`5d8 + STR`/tier phys, High Restrains `1.5s`), heals lowest-% ally `2d6`/tier, triggers **Wild Shape (Moon Beast)** (`4d10 + CON`/tier HP, `+25%` AS, hits heal lowest-% ally `1d4`/tier). | 42% (`223` / `4.2` / `47`) | 70% → **Panther 84%** (starts fight in form: `3d10 + CON`/tier HP, `+40%` AS, `1d10 + STR` Claws, `1d6`/tier heal on hit) / **Dire Bear 88%** (starts fight in form: `5d10 + CON`/tier HP, `+3` AC, `2d6 + STR` Maul + `1d4`/tier cleave, `2s` taunt) |

*\*Juniper's `Fight EHP` counts raw form HP without her `+2` AC bonus while shifted.*

## After locking in (`n=300`, seeds 20000+; `bosscheck --n 150`)
| Config | `prototype2` | `bare` | `sensible` | `engine` | Nezznar A / B / C |
|---|---:|---:|---:|---:|---|
| **Batch 4 locked (`attackGrowth = 0`)** | **47.0%** | 0% (med F4) | 70% | 80% | **86 / 86 / 53%** |
| **Preview: `attackGrowth.extraDicePerTier = 1`** | — | 0% (med F4) | 79% | 87% | **95 / 94 / 64%** |
