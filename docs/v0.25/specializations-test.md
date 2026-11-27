# B&B v0.25b: specializations (tier 2 paths) test, 26 Nov 2026

`node bench.js paths --n 150 --reps 2`: every fight from fight 3 on that the sensible and engine bots walked into (1,177 fights, 150 runs each, items and partners as they were, current configs with encounter pass 1). Each fight is replayed for every hero in the party at tier 1, at tier 2 with no path, and at tier 2 with each path, on the same dice (2 seeds each). **Rank-up** = T2 no path minus T1. **Adds** = a path's win rate minus T2 no path.

Caveats: regular fights run near the ceiling for some heroes (Pillar 97%, Laurel 95% at T2 with no path), so their paths can't show there. Boss samples are 15–49 fights per hero (about ±10 points). Gold made in a run (Pickpocket, Gains) isn't counted.

## Regular fights (Glasstaff, Thundertree, Forge)
| Hero | Fights | T1 | T2 no path | Rank-up | Path A | Adds | Path B | Adds |
|---|---|---|---|---|---|---|---|---|
| Arthur | 127 | 63% | 84% | +21 | Ready First | +6 | Second Wind | +5 |
| Bram | 206 | 58% | 81% | +22 | Preserve Life | +4 | Turn the Faithless | +17 |
| Brother Jamison | 121 | 58% | 79% | +21 | Balm of Peace | +8 | Protective Bond | +5 |
| Cinder | 124 | 69% | 90% | +21 | Twinned Spell | +6 | Empowered Spell | +3 |
| Corvin | 88 | 76% | 91% | +16 | Stalker's Flurry | +1 | First Strike | +1 |
| Faelan | 89 | 76% | 93% | +16 | Spell Weave | +0 | Shared Recovery | +1 |
| Gains | 101 | 64% | 79% | +15 | Compound Interest | 0 | Liquid Assets | 0 |
| Gilthrax | 175 | 62% | 82% | +21 | Gilded Hoard | +13 | Bodyguard's Fee | +15 |
| Juniper | 136 | 63% | 83% | +19 | Bramble Guard | +6 | Bramble Stalker | +5 |
| Kaska | 82 | 69% | 86% | +17 | Panther | +1 | Dire Bear | +1 |
| Lorcan | 72 | 73% | 80% | +7 | Colossus Slayer | +5 | Horde Breaker | +13 |
| Lumen | 116 | 71% | 83% | +12 | Searing Focus | +2 | Healing Light | +4 |
| Mother Laurel | 182 | 66% | 95% | +28 | Ensnaring Smite | +1 | Warding Smite | +2 |
| Naill | 153 | 68% | 83% | +15 | Stunning Strike | +4 | Step of the Wind | +6 |
| Nettle | 98 | 68% | 85% | +17 | Dark One's Blessing | +5 | Hellfire Pact | +4 |
| Pillar | 162 | 72% | 97% | +25 | Unbreakable | +1 | Avalanche | +1 |
| Rosalind | 57 | 80% | 81% | +1 | Muse | +4 | Encore | +7 |
| Saint | 111 | 73% | 84% | +11 | Invoke Duplicity | +10 | Cloak of Shadows | +3 |
| Sir Dane | 177 | 65% | 85% | +19 | Duelist | +4 | Retribution | +13 |
| Velith | 101 | 58% | 78% | +20 | First Blood | +2 | Nightshade Vials | +0 |
| Wallaby | 112 | 68% | 89% | +21 | Cutthroat | +6 | Pickpocket | +8 |
| Zark | 118 | 55% | 76% | +21 | Bear Totem | +24 | Wolf Totem | +14 |
| Zoe | 94 | 67% | 94% | +27 | Rune Carver | +6 | Just the Thing | +4 |

## Bosses (Grol, Nezznar, Venomfang)
| Hero | Fights | T1 | T2 no path | Rank-up | Path A | Adds | Path B | Adds |
|---|---|---|---|---|---|---|---|---|
| Arthur | 30 | 20% | 58% | +38 | Ready First | −7 | Second Wind | +8 |
| Bram | 49 | 39% | 59% | +20 | Preserve Life | +4 | Turn the Faithless | +12 |
| Brother Jamison | 25 | 70% | 88% | +18 | Balm of Peace | +2 | Protective Bond | −14 |
| Cinder | 33 | 73% | 88% | +15 | Twinned Spell | +8 | Empowered Spell | +2 |
| Corvin | 25 | 34% | 58% | +24 | Stalker's Flurry | +18 | First Strike | +18 |
| Faelan | 22 | 77% | 95% | +18 | Spell Weave | +2 | Shared Recovery | −2 |
| Gains | 24 | 48% | 71% | +23 | Compound Interest | 0 | Liquid Assets | 0 |
| Gilthrax | 49 | 38% | 60% | +22 | Gilded Hoard | +19 | Bodyguard's Fee | +13 |
| Juniper | 40 | 33% | 45% | +13 | Bramble Guard | +11 | Bramble Stalker | +8 |
| Kaska | 20 | 63% | 80% | +18 | Panther | +8 | Dire Bear | +8 |
| Lorcan | 24 | 31% | 40% | +8 | Colossus Slayer | +10 | Horde Breaker | +29 |
| Lumen | 25 | 60% | 72% | +12 | Searing Focus | +2 | Healing Light | +12 |
| Mother Laurel | 47 | 36% | 76% | +39 | Ensnaring Smite | +6 | Warding Smite | +9 |
| Naill | 40 | 38% | 59% | +21 | Stunning Strike | +14 | Step of the Wind | +5 |
| Nettle | 26 | 40% | 58% | +17 | Dark One's Blessing | +12 | Hellfire Pact | +4 |
| Pillar | 47 | 49% | 79% | +30 | Unbreakable | +12 | Avalanche | +5 |
| Rosalind | 15 | 50% | 67% | +17 | Muse | −3 | Encore | +7 |
| Saint | 34 | 47% | 57% | +10 | Invoke Duplicity | +13 | Cloak of Shadows | +3 |
| Sir Dane | 45 | 49% | 73% | +24 | Duelist | +0 | Retribution | +3 |
| Velith | 22 | 39% | 55% | +16 | First Blood | +14 | Nightshade Vials | +9 |
| Wallaby | 33 | 58% | 64% | +6 | Cutthroat | +14 | Pickpocket | +21 |
| Zark | 29 | 33% | 55% | +22 | Bear Totem | +22 | Wolf Totem | +5 |
| Zoe | 25 | 48% | 84% | +36 | Rune Carver | +12 | Just the Thing | +8 |

## Findings
- **The rank-up itself does most of the work** (+15 to +28 at regular fights, more at bosses). Most paths add 0–8 on top; a typical path is worth about a third of the rank-up.
- **Paths that do nothing:** both of Gains's (exactly 0: Compound Interest boosts a d20 roll his damage doesn't use; the +15 charge per gold drop on a 180 bar rarely lands in time), Faelan's, Corvin's and Kaska's at regular fights, Velith's Nightshade Vials, Lumen's Searing Focus, Dane's Duelist.
- **Paths that hurt:** Brother Jamison's Protective Bond at bosses (−14: redirecting big hits to himself gets him killed); Arthur's Ready First at bosses (−7); Rosalind's Muse at bosses (−3, small sample).
- **Paths that dominate:** Zark's Bear Totem (+24 / +22, the biggest in the game), Gilthrax's both (+13 to +19: Dragon's Retort is shared by both paths), Bram's Turn the Faithless (+17), Dane's Retribution (+13 vs Duelist +4), Lorcan's Horde Breaker (+13 / +29).
- **Lopsided pairs** (a player should always pick one): Bram, Dane, Lorcan, Zark, Saint, Jamison, Lumen.
- **Weak rank-ups:** Rosalind (+1 at regular fights; her tier only adds +5% attack speed), Lorcan (+7), Wallaby at bosses (+6).
