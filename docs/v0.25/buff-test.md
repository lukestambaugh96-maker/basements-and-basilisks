# B&B v0.25b: buff test (sample item values), 26 Nov 2026

`node bench.js buffs --n 100` (2 replays each): 734 fights from fight 3 to the boss (Nezznar) that the sensible and engine bots walked into, **with every item removed** so a single buff can show (parties win 51% on average without items). Each hero in each fight is replayed with one buff on the same dice. Numbers are **win % points** the buff adds to that hero's party. Current configs (encounter pass 1, Nezznar only, shop odds 0.75).

Buffs: +1/2/3 to the hero's key score, +1/2/3 CON, +10/20/30% attack speed, an extra 1d4/1d6/1d8/1d10 on each attack hit (the attack's own damage type), an extra 1d4–1d10 on each hit of the ability.

## By job (win % points added)
| Buff | Attackers | Brawlers | Casters | Frontlines | Supports | Everyone |
|---|---|---|---|---|---|---|
| Key +1 | +0 | +1 | +0 | +2 | +0 | +1 |
| Key +2 | +4 | +5 | +6 | +5 | +3 | +4 |
| Key +3 | +4 | +5 | +6 | +7 | +5 | +6 |
| CON +1 | +0 | +0 | +0 | +2 | +0 | +1 |
| CON +2 | +2 | +4 | +2 | +5 | +2 | +4 |
| CON +3 | +2 | +4 | +2 | +9 | +2 | +5 |
| Attack speed +10% | +5 | +4 | +1 | +2 | +3 | +3 |
| Attack speed +20% | +9 | +7 | +3 | +4 | +3 | +6 |
| Attack speed +30% | +12 | +10 | +1 | +6 | +4 | +8 |
| Attack +1d4 | +13 | +4 | +12 | +5 | +7 | +8 |
| Attack +1d6 | +16 | +6 | +14 | +8 | +8 | +10 |
| Attack +1d8 | +19 | +8 | +18 | +10 | +11 | +13 |
| Attack +1d10 | +25 | +11 | +19 | +13 | +13 | +16 |
| Ability +1d4 | +3 | +1 | +5 | +1 | +0 | +2 |
| Ability +1d6 | +4 | +1 | +6 | +2 | +0 | +2 |
| Ability +1d8 | +5 | +2 | +8 | +2 | +0 | +3 |
| Ability +1d10 | +6 | +2 | +10 | +3 | +0 | +4 |

Fights per job: attackers 532, brawlers 342, casters 175, frontlines 792, supports 361 (2,202 hero-fights).

## Findings
- **Ability scores move in steps of 2.** A modifier only changes at even scores, and almost every key score is 16, so +1 does nothing and +3 is worth the same as +2. Heroes on odd scores (Bram, Juniper, Laurel, Kaska and Jamison on 15) are the exception: for them +1 and +3 matter. Key +2 is worth about +4 points, CON +2 about +4 (frontlines +5).
- **Attack speed scales with how much a hero attacks:** attackers +5 / +9 / +12, brawlers +4 / +7 / +10, casters and supports almost nothing.
- **An extra attack die is the strongest buff per item:** +1d4 is worth about twice a +2 score (+8 vs +4), +1d10 about four times (+16). It's biggest on fast or armor-ignoring attackers: Wallaby +24 to +39, Lumen +19 to +33 (his Sacred Beam is Radiant, so the die ignores armor), Faelan +15 to +27, Cinder +17 to +25.
- **An extra ability die only helps damage abilities,** and most of all abilities that hit several times: Cinder's 3 rays (+7 to +16), Wallaby's daggers (+5 to +18), Juniper's Entangle on every foe in reach (+4 to +10). Healers, Ward-givers and buffers get nothing.
- **Rough value bands for the item tiers:** Uncommon about +4 to +6 points (+2 to a score, +20% speed); Rare about +8 to +13 (+1d4 to +1d8 on attacks, +30% speed on an attacker); Epic +15 and up, or a build-around clause.
- **Noise:** each hero has 43–191 fights, so a single hero's figure can be off by about 5 points. Kaska's steady −3 on ability dice is most likely noise.

## Per hero
Full `node bench.js buffs --n 100` output:

```
Ability scores
Hero                   Job  Key score  Fights  Win, no buff  Key +1  Key +2  Key +3  CON +1  CON +2  CON +3
---------------  ---------  ---------  ------  ------------  ------  ------  ------  ------  ------  ------
Corvin            attacker     DEX 16      71           61%      +0      +2      +2      +0      +5      +5
Lorcan            attacker     DEX 16      80           43%      +0      +1      +1      +0      +2      +2
Lumen             attacker     CHA 16      78           42%      +0      -1      -1      +0      +2      +2
Naill             attacker     DEX 16      84           34%      +0      +8      +8      +0      +4      +4
Nettle            attacker     CHA 16      77           54%      +0     +10     +10      +0      +3      +3
Velith            attacker     DEX 16      72           51%      +0      +1      +1      +0      +0      +0
Wallaby           attacker     DEX 16      70           47%      +0      +6      +6      +0      +1      +1
Arthur             brawler     STR 16      86           49%      +0      +3      +3      +0      +3      +3
Kaska              brawler     STR 15      72           64%      +5      +5      +4      +0      +3      +3
Pillar             brawler     STR 18     107           53%      +0      +6      +6      +0      +3      +3
Zark               brawler     STR 16      77           51%      +0      +5      +5      +0      +8      +8
Cinder              caster     CHA 16      87           55%      +0      +5      +5      +0      +4      +4
Gains               caster     INT 16      88           51%      +0      +6      +6      +0      +1      +1
Bram             frontline     WIS 15     169           54%      +1      +1      +5      +0      +7      +7
Gilthrax         frontline     CON 16     134           46%      +0      +7      +7      +0      +7      +7
Juniper          frontline     WIS 15     155           50%      +3      +3      +7      +5      +5      +7
Mother Laurel    frontline     STR 15     191           54%      +5      +5     +10      +4      +4     +11
Sir Dane         frontline     CHA 14     143           43%      +0      +7      +7      +3      +3     +13
Brother Jamison    support     CHA 15     118           51%      +0      +0      +5      +0      +3      +3
Faelan             support     INT 16      49           60%      +0     +14     +14      +0      -2      -2
Rosalind           support     CHA 16      43           52%      +0      +2      +2      +0      +0      +0
Saint              support     WIS 16      83           61%      +0      +4      +4      +0      +5      +5
Zoe                support     INT 13      68           51%      +1      +1      +3      +0      +1      +1
                                                                                                           
All attackers     attacker                532           47%      +0      +4      +4      +0      +2      +2
All brawlers       brawler                342           54%      +1      +5      +5      +0      +4      +4
All casters         caster                175           53%      +0      +6      +6      +0      +2      +2
All frontlines   frontline                792           50%      +2      +5      +7      +2      +5      +9
All supports       support                361           55%      +0      +3      +5      +0      +2      +2
Everyone                                 2202           51%      +1      +4      +6      +1      +4      +5

Attack speed and attack dice
Hero                   Job  Key score  Fights  Win, no buff  Speed +10%  Speed +20%  Speed +30%  Attack +1d4  Attack +1d6  Attack +1d8  Attack +1d10
---------------  ---------  ---------  ------  ------------  ----------  ----------  ----------  -----------  -----------  -----------  ------------
Corvin            attacker     DEX 16      71           61%          +4          +6         +10          +11          +11          +13           +17
Lorcan            attacker     DEX 16      80           43%          +4          +8         +17           +8          +12          +14           +21
Lumen             attacker     CHA 16      78           42%          +9         +15         +12          +19          +21          +29           +33
Naill             attacker     DEX 16      84           34%          +6          +8          +8          +13          +14          +16           +23
Nettle            attacker     CHA 16      77           54%          +2          +8         +17          +10          +16          +17           +21
Velith            attacker     DEX 16      72           51%          +6         +10          +9           +6          +10          +15           +23
Wallaby           attacker     DEX 16      70           47%          +2          +8         +14          +24          +31          +33           +39
Arthur             brawler     STR 16      86           49%          +4          +6         +12           +5           +8          +10           +13
Kaska              brawler     STR 15      72           64%          +1          +5          +6           +2           +6           +8           +11
Pillar             brawler     STR 18     107           53%          +4         +12         +14           +6           +6           +7            +9
Zark               brawler     STR 16      77           51%          +5          +3          +8           +3           +6           +7           +10
Cinder              caster     CHA 16      87           55%          +0          +1          -2          +17          +20          +24           +25
Gains               caster     INT 16      88           51%          +3          +5          +5           +7           +9          +11           +14
Bram             frontline     WIS 15     169           54%          +7          +9         +12           +9          +11          +13           +16
Gilthrax         frontline     CON 16     134           46%          -2          +1          +2           +0           +2           +4            +8
Juniper          frontline     WIS 15     155           50%          +2          +1          +2           +3           +6           +9           +13
Mother Laurel    frontline     STR 15     191           54%          +2          +3          +4           +6           +8          +10           +11
Sir Dane         frontline     CHA 14     143           43%          +1          +9         +11           +8          +12          +13           +16
Brother Jamison    support     CHA 15     118           51%          +2          +0          +1           +2           +3           +3            +5
Faelan             support     INT 16      49           60%          +5         +10          +8          +15          +18          +24           +27
Rosalind           support     CHA 16      43           52%          +1          +0          +3           +8          +13          +15           +15
Saint              support     WIS 16      83           61%          +7          +9          +7          +12          +12          +13           +16
Zoe                support     INT 13      68           51%          -1          -1          +2           +4           +3           +7           +10
                                                                                                                                                    
All attackers     attacker                532           47%          +5          +9         +12          +13          +16          +19           +25
All brawlers       brawler                342           54%          +4          +7         +10           +4           +6           +8           +11
All casters         caster                175           53%          +1          +3          +1          +12          +14          +18           +19
All frontlines   frontline                792           50%          +2          +4          +6           +5           +8          +10           +13
All supports       support                361           55%          +3          +3          +4           +7           +8          +11           +13
Everyone                                 2202           51%          +3          +6          +8           +8          +10          +13           +16

Ability dice
Hero                   Job  Key score  Fights  Win, no buff  Ability +1d4  Ability +1d6  Ability +1d8  Ability +1d10
---------------  ---------  ---------  ------  ------------  ------------  ------------  ------------  -------------
Corvin            attacker     DEX 16      71           61%            +3            +3            +5             +4
Lorcan            attacker     DEX 16      80           43%            +0            +0            +0             +0
Lumen             attacker     CHA 16      78           42%            +3            +4            +5             +4
Naill             attacker     DEX 16      84           34%            +6            +7            +8             +8
Nettle            attacker     CHA 16      77           54%            +0            +1            +3             +5
Velith            attacker     DEX 16      72           51%            +1            +1            +1             +2
Wallaby           attacker     DEX 16      70           47%            +5           +11           +11            +18
Arthur             brawler     STR 16      86           49%            +1            +1            +2             +3
Kaska              brawler     STR 15      72           64%            -3            -3            -3             -3
Pillar             brawler     STR 18     107           53%            +2            +2            +2             +2
Zark               brawler     STR 16      77           51%            +4            +3            +6             +5
Cinder              caster     CHA 16      87           55%            +7            +9           +13            +16
Gains               caster     INT 16      88           51%            +3            +3            +3             +5
Bram             frontline     WIS 15     169           54%            +0            +0            +0             +0
Gilthrax         frontline     CON 16     134           46%            +0            +0            +0             +0
Juniper          frontline     WIS 15     155           50%            +4            +6            +8            +10
Mother Laurel    frontline     STR 15     191           54%            +1            +1            +2             +4
Sir Dane         frontline     CHA 14     143           43%            +0            +0            +0             +0
Brother Jamison    support     CHA 15     118           51%            +0            +0            +0             +0
Faelan             support     INT 16      49           60%            +0            +0            +0             +0
Rosalind           support     CHA 16      43           52%            +0            +0            +0             +0
Saint              support     WIS 16      83           61%            +0            +0            +0             +0
Zoe                support     INT 13      68           51%            +0            +0            +0             +0
                                                                                                                    
All attackers     attacker                532           47%            +3            +4            +5             +6
All brawlers       brawler                342           54%            +1            +1            +2             +2
All casters         caster                175           53%            +5            +6            +8            +10
All frontlines   frontline                792           50%            +1            +2            +2             +3
All supports       support                361           55%            +0            +0            +0             +0
Everyone                                 2202           51%            +2            +2            +3             +4
```
