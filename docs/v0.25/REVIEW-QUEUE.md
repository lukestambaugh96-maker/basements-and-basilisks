# Review queue (replaces the claude.ai review page outside claude.ai)

Add one entry per proposal. Luke rules: **Approved**, **Rejected**, or a note. Newest first.

## Waiting for Luke
| Item | Proposal | Doc | Ruling |
|---|---|---|---|
| Act 1 encounters | Encounter pass 1 (called good to go 26 Nov; card never ruled) | encounter-pass1.md | |
| Act 1 boss | Nezznar as the single boss / Act 2 check (called good to go; card never ruled) | nezznar-boss.md | |

## Ruled (27 Nov — session 2)
| Item | Ruling |
|---|---|
| Act 1 shop rarity curve + Nezznar C tightening (Midpoint 1) | Locked in: Act 1 `rarityWeights` tightened (`90/10/0` → `75/25/0` → `55/40/5` → `40/50/10` → `30/50/20` → `25/50/25`), Nezznar Web `castSeconds: 7 → 6` (zero HP inflation). Nezznar A/B/C **84 / 79 / 38%** (balanced 95/86/48%), bots **0 / 53 / 60%**. Act 1 replay checks verified (`placement` 97% vs 38% Best/Worst, `castoff` all 22 heroes +10 to +42 pts, `luck` 11% coin flips / 4% upset / 4% rescue). |
| Items rework (3-tier stat-based pool) | Locked in (`config/items.config.json`, `Uncommon 8g` ×12 / `Rare 15g` ×12 / `Epic 24g` ×7; class items on hold for Act 1; `Staff of Power` `+1d8` applies to any casted ability — damage, heal, Ward, Wild Shape). All 31 items positive; `bare` 0% / `sensible` 51% / `engine` 62%; `prototype2` 47.0% exact. |
| Attack growth + Act 1 encounter buff | Locked in: `attackGrowth.extraDicePerTier = 1` (martials match ×1.5/×2/×2.5 EHP & DPS; Casters glass-cannon ×3.24 DPS); `enemyScale` `+12% AS / ×1.12 dmg / ×1.0 HP` + Nezznar Web `8d6+10` → bare 0% (F3), sensible 54%, engine 65%, Nezznar A/B/C 81/77/37% |
| Batch 4 (Juniper, Kaska — Wild Shape) | Locked in (generalized no-timer bonus HP bar `enterWildShape`/`endForm`; Juniper Briar Form; Kaska Moon Beast + T2 `startInForm` Panther/Dire Bear). Completes all 22 active heroes. |
| Batch 3 (Gains, Rosalind, Jamison, Saint) | Locked in (Gains Arcane Recovery + gold-on-beam-hit; Rosalind Dissonant Whispers + Bardic Inspiration die; Jamison `range: 1` Mace + Emboldening Bond sharing + Unity of Peace CD; Saint Mirror Doubles + Evasion + Trickster's Escape CD) |
| Cinder (batch 3) | Locked in (Metamagic Twin Spell at 4 SP via Fire Bolt; **Scorched Earth** / **Living Flame**; non-stacking burning ground tiles) |
| Batch 2 (Lorcan, Corvin, Velith, Nettle, Lumen) | Locked in (Lumen Path A named **Searing Light**; Lorcan fast-bow `1d6` @ `1.15s`, DEX 14) |
| Ranger `Favored Foe` + `Hunter's Mark` pure tag; Warlock `Pact` + `Hex` pure tag | Decided & locked in (`CLASS_KW` updated) |
| Barbarian Rage unlimited + clean card math (Zark `1 HP/2s` no tier scale; Pillar pure-dice `2d6` Maul + `1d4`/tier splash + Rage-tied T2 paths) | Locked in |
| Hidden `speedScaling` stripped to `1.0` cast-wide; base attack speed echoes kit goals | Decided & locked in |
| Shared `actionSurge()` with loop guard; Velith Sneak Attack `force` bypass | Locked in |

## Ruled (27 Nov — session 1)
| Item | Ruling |
|---|---|
| Enemy buff | Applied: enemies attack 5% faster (Luke asked for a small buff) |
| Batch 1 (Gilthrax, Zoe, Laurel, Pillar, Zark, Naill) + Sir Dane | Locked in |
| Wallaby | Locked in (Pickpocket gold-only for now) |
| Faelan, Bram, Arthur (kit + paths) | Locked in |
| Class feature rules, card-writing rule, Smite definition, Ki never spent, scaling = run-long | Decided |
| Evasion stat with a hard cap; Arthur lower AC | Decided |
