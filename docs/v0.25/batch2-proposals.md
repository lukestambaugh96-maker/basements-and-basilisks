# Cast rework batch 2 + class feature consistency pass (locked in by Luke, 27 Nov)

All 7 heroes (Lorcan, Corvin, Velith, Nettle, Lumen, plus Zark and Pillar Rage/Maul updates) are locked into `tools/testbench/config/heroes.config.json`. `presets/prototype2.json` reverts them (plus stripped `speedScaling`) and still reproduces **47.0%**.

## Rules decided (27 Nov)
- **Hunter's Mark** and **Hex** are **pure tag conditions** (`t.st.marked`, `t.st.hexed`): non-stacking, last until the foe dies, no hidden baseline debuff.
- **Ranger class feature renamed to Favored Foe:** triggers off the `Hunter's Mark` condition; Rangers apply Hunter's Mark in their kit and cash in via Favored Foe.
- **Warlock class feature (`Pact`):** triggers off the `Hex` condition independently of casts; Warlocks apply Hex in their kit and cash in via Pact. (`CLASS_KW` updated in `run.js`.)
- **Barbarian Rage is truly unlimited** (no `maxStacks` cap) and uses clean card math (no fractional regen, no `%` Maul/splash formulas).
- **No invisible attack-speed multipliers:** `speedScaling` stripped to `1.0` across the entire cast. Base attack speed (`interval`) should echo each hero's kit goals going forward.
- **Shared Action Surge** (`actionSurge()` in `behaviour.js`) with re-entrancy guard used by all Fighters (Arthur, Gilthrax, Zoe).
- **Sneak Attack `force` bypass** unified across Wallaby and Velith (external triggers skip the condition, keep the internal cooldown).

## Locked kits & benchmarks (`n=200–250` T1; `n=150–200` T2 + T1 partners)

| Hero | Job | Locked kit & class feature | T1 Win (EHP / DPS) | T2 Base → Path A / Path B |
|---|---|---|---:|---:|
| **Lorcan** | Attacker | Longbow `1d6 + DEX` (DEX 14) every `1.15s`, applies **Hunter's Mark**. **Favored Foe:** `+1d4`/tier vs Marked. Twin Shot unchanged. | 48% (190 / 5.4) | 65% → Colossus Slayer **71%** (`1d10`/tier >50% HP) / Horde Breaker **72%** (mark jumps on Marked death, next attack cleaves all adjacent) |
| **Corvin** | Attacker | Dread Ambush `1d10 + DEX`/tier applies **Hunter's Mark**. **Favored Foe:** Twin Shortswords strike twice and Slow `20%` `1s` vs Marked. | 34% (190 / 5.6) | 55% → Stalker's Flurry **62%** (3 strikes vs Marked) / First Strike **64%** (`+15` ally charge on first Ambush, `+25` charge on any Marked death) |
| **Velith** | Attacker | Venom Dagger (`2.0s`) poisons on hit. **Sneak Attack:** bonus Venom Dagger `+1d4`/tier + `1` Poison (`5s` CD); Cloak of Darkness force-triggers it (skips condition, keeps CD). | 39% (177 / 5.5) | 54% → Assassin **60%** (Sneak Attack executes non-bosses `<30%` HP) / Poisoner **58%** (spreads `4` Poison to adjacent foes) |
| **Nettle** | Attacker | Hellfire Curse `3d6 + CHA`/tier applies **Hex**; Eldritch Blast `+1d4` vs Hexed. **Pact of the Fiend:** whenever any Hexed foe dies, gain Ward `2d8 + CHA`/tier. | 49% (192 / 5.3) | 68% → Hellfire Pact **71%** (Hexed death explodes `2d6`/tier + Hex jumps) / Fiend's Favor **75%** (double Ward + `+30%` AS `4s`) |
| **Lumen** | Attacker | Sacred Beam & Sunbeam apply **Hex**. **Pact of the Celestial:** damaging a Hexed foe (`3s` CD) heals most-hurt ally `2d6`/tier. | 49% (184 / 5.0) | 72% → **Searing Light 80%** (`+1d6` Beam vs Hexed; Sunbeam `+2` dice/foe) / Healing Light **80%** (`2d8`/tier to 2 allies, `2s` CD) |
| **Zark** | Frontline | **Unlimited Rage:** `+1` per `25×tier` dmg taken, unconditional `3s` fade, heals `1 HP` every `2s` per stack (no tier scaling). | 52% (289 / 4.1) | 68% → Bear Totem **71%** (`×2` regen) / Wolf Totem **71%** (`+1d4`/stack on Reckless Swing) |
| **Pillar** | Brawler | Maul `2d6 + STR` every `3.0s` (`speedScaling: 1`), separate `1d4`/tier splash + Slow `25%` `1.5s`. **Unlimited Rage:** `+1` every 2 hits taken, `+1` Maul dmg/stack. | 49% (238 / 5.4) | 79% → Unbreakable **83%** (Earthshaker Ward `2d6`/tier per foe + `3×tier`/Rage + `3` AC) / Avalanche **81%** (`+1` reach + `+1d4`/Rage stack) |

## After locking in (`n=300`, seeds 20000+; `bosscheck --n 150`)
- **Prototype2 preset:** **47.0%** (exact).
- **Whole runs:** never-buy **0%** (median end fight 4), sensible **65%** (was 64%), engine **76%** (was 75%).
- **Boss check (Nezznar, 249 parties):** A / B / C = **78% / 81% / 46%** (was 82 / 81 / 42%). Party C continues to drift high as expected; will be retuned in the post-cast encounter buff pass.
