# Cast rework batch 1 + Sir Dane (locked in by Luke, 27 Nov)

Review cards (applied): Sir Dane, Gilthrax, Zoe, Mother Laurel, Pillar, Zark, Naill. All in `heroes.config.json` (`kit2` blocks pick the new kits in `behaviour.js` KITS2; Dane's are `smite`, `t2.duelist3`, `t2.retribution2`). The prototype2 preset reverts them and still reproduces 47.0%.

| Hero | Kit | Tier 1 win | Tier 2 + tier 1 partners: no path → A / B |
|---|---|---|---|
| Sir Dane | Smite (+1d8 radiant/tier); Compelled Duel's next attack is a smite. Duelist: each dueled foe that dies adds +1d8 to his Smite for the run (max +5d8). Retribution: when his dueled foe hits him, next attack smites. | 38% → 41% | gauntlet avg 60% → 68% / 64% |
| Gilthrax | Ward 1d8 + CON/tier; +5 Ward per item (+5 per Rare); Ward break triggers Action Surge once per item (max 3). Dragon's Retort (breath, scales with items) / Gilded Scales (+2 AC, +1 SR per item). | bare 38% → 30%; 2 items 44% → 64% | 79% → 88% / 85% (2 items) |
| Zoe | Supplies +1 die per item the ally holds; each Rummage triggers Action Surge. Rune Knight (Giant for 4s) / Quartermaster (+1 supply, 15 charge). | 32% → 41% (51% with partner items) | 74% → 87% / 88% |
| Mother Laurel | Verdant Smite; hits heal adjacent allies a third of the damage; Verdant Strike 1d8/tier; Glaive every 2.0s. Warden (every 3rd hit smites + Restrain) / Bruiser (heals herself too, +20% attack speed). | 39% → 45% | 74% → 78% / 78% |
| Pillar | Rage +1 stack per hit taken (max 5), +1 Maul damage each; Maul 1d8/tier + STR + 1% max HP every 3s (speed counts half), splashes a quarter and Slows 25%; Earthshaker (Big) stuns adjacent foes, 8d6/tier; no Toss. Unbreakable (Ward per foe stunned, +2 AC per stack) / Avalanche (+2 reach). | 36% → 47% | 79% → 84% / 87% |
| Zark | Frontline; STR 12, CON 18, Greataxe 1d10; Rage +1 stack per 15% max HP taken (max 5, fades every 4s), each stack regenerates HP. Bear Totem (double regen) / Wolf Totem (+1d8 per stack on Reckless Swing). | 46% → 48% (damage 4.1, high for frontline) | 73% → 84% / 84% |
| Naill | Ki +1 per hit (max 5), never spent, +2% attack speed each; Flurry 1/2/3 strikes, +1 at 5 Ki. Stunning Strike / Step of the Wind. | 30% → 36% | 52% → 55% / 55% |

## After locking in (300 runs per bot, seeds 20000+)
- Never-buy: 0% cleared, but now dies at fight 4 (Thundertree) instead of fight 3: bare parties got stronger.
- Sensible 64% (was 62%), engine 76% (was 74%).
- Boss check A / B / C: 82 / 80 / 44% (was 88 / 83 / 39%). C ("one tier 2 should struggle") is creeping up.
- Expected: the encounter numbers buff after the whole cast is reworked brings these back.

## Bench additions
`--preset batch1` (now the same as the config), `jobs --items a,b` / `--partnerItems a,b`, `gauntlet`, run-long state (`carryKeys`).
