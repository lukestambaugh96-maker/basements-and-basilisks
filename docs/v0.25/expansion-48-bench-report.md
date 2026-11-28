# Basements & Basilisks v0.25 — Full 48-Hero Testbench Report (25 New vs. 23 Existing)

**Date:** 2026-11-28  
**Scope:** All **25 new/reworked heroes** (Batches A–E) wired into `tools/testbench/` alongside the **23 existing locked heroes** (`48` total, `4` per D&D class), evaluated across **every command in `bench.js`**: `run --preset prototype2`, `stats`, `intro`, `jobs` (T1 & T2), `cast`, `paths`, `gauntlet`, `bots`, `bosscheck`, `castoff`, `itemoff`, `placement`, `luck`, `buffs`, and `encaudit`.

---

## 1. Executive Summary & Key Findings

| Check | Scope | Result | Verdict |
| :--- | :--- | :--- | :---: |
| **`prototype2` invariant** | `run --preset prototype2 --n 300` | **47.0% exact** (`{"1":129,"2":7,"3":16,"4":3,"5":4}`) | PASS |
| **`intro` (Fight 1 solo)** | All 48 heroes × 50 seeds | **48 / 48 at 100%** | PASS |
| **`encaudit` (Fight 1 solo)** | All 48 heroes × 12 procedural seeds | **100% overall** | PASS |
| **`jobs` T1 (48 heroes)** | Fights 2–5, random 3-hero parties, `n=80` | New cast tracks existing cast closely by job (see §2) | PASS |
| **`jobs` T2 (25 new)** | `--tier 2 --partnerTier 1`, No-Path / Path A / Path B | **25 / 25 non-lopsided** (max gap `9`; 17 within `0–3` pts) | PASS |
| **`cast` (48 heroes)** | Ability On vs. Off, `n=60` | Every new hero lifts **`+5` to `+32` pts** (0 dead abilities) | PASS |
| **`castoff` (573 bot fights)** | All 48 heroes in live bot builds | Every new hero drops **`+8` to `+80` pts** without ability | PASS |
| **`bosscheck` (138 parties)** | Act 1 Boss as Act 2 gate (`reps=3`) | **A `77%` / B `74%` / C `33%`** (Front+Dmg+Sup: `82/80/47%`) | PASS |
| **`itemoff` (573 fights)** | Full build vs. 1 removed vs. no items | F3 `-20`, F4 `-29`, F5 `-31`, Boss `-42` pts without items | PASS |
| **`placement` (573 fights)** | All formations on identical dice | `smart` **79%** vs. `swapped` **59%** (`+20` pts; Best `94%`/Worst `40%`) | PASS |
| **`luck` (478 fights)** | Average dice vs. 3× normal dice | Avg `70%` vs. Normal `71%` (`20%` coin-flip, `4%` upset, `5%` rescue) | PASS |
| **`bots` (200 runs, seed 20000)** | `bare / sensible / engine` | **Updated `ownedHeroWeight` `0.75 → 1.65`**: `0/37/45%` → **`0/55/63%`** (`T2@F5 = 1.1`) | PASS |

### Critical System-Level Finding & Fix: Shop Pool Dilution at 48 Heroes
Doubling the hero pool from **23 → 48** while keeping `rules.shop.ownedHeroWeight = 0.75` cuts per-slot duplicate probability in half (`10.1% → 4.8%`), collapsing `T2@F5` from `~1.1–1.5` down to **`0.7`** and dropping Act 1 bot clears from `0% / 53% / 60%` to `0% / 37% / 45%`.

Updated `rules.shop.ownedHeroWeight` to **`1.65`** in `tools/testbench/config/rules.config.json` (scaling proportionally with unowned hero count `45/20`; `presets/prototype2.json` remains pinned at `1`). This restores `T2@F5 = 1.1` and yields **`0% / 55% / 63%`** — dead-on against Luke's locked `0% / 54% / 65%` target!

---

## 2. Tier 1 Job Benchmark: 25 New Heroes vs. 23 Existing (`jobs --n 80`)

*Fights 2–5, Tier 1, no items, 80 random 3-hero parties per hero. Existing heroes marked `OLD`, expansion heroes marked `NEW`. `L`/`H` = outside target band (`rules.config.json`).*

### FRONTLINE *(Target: Fight EHP `280–340`, DPS `2–3`)*
*Existing avg: `32.0%` win, `3.0` DPS, `277` EHP · New avg: `36.5%` win, `3.9` DPS, `275` EHP*

| Grp | Hero | Size | Win | Dies | Fight EHP | DPS | Casts/30s | Val/Cast | Ab% | Help |
| :-: | :--- | :--- | --: | --: | --: | --: | --: | --: | --: | --: |
| NEW | **Corporal Tobbin** | med | 41% | 93% | 266 | 2.6 | 3.8 | 27 H | 38% | 57 |
| NEW | **Durn** | med | 40% | 89% | 281 | 6.0 H | 3.0 | 19 | 30% | 0 |
| OLD | Zark | med | 40% | 93% | 283 | 5.2 H | 3.9 | 17 | 80% | 0 |
| OLD | Sir Dane | med | 34% | 95% | 321 | 2.1 | 4.8 | 18 | 0% | 0 |
| OLD | Bram | med | 33% | 94% | 290 | 1.7 L | 3.5 | 24 | 0% | 32 |
| NEW | **Lady Malice** | med | 33% | 94% | 278 | 3.5 H | 3.9 | 18 | 58% | 0 |
| NEW | **Vela** | med | 32% | 93% | 273 | 3.4 H | 3.4 | 30 H | 68% | 11 |
| OLD | Juniper | med | 30% | 96% | 239 L | 3.1 | 2.8 | 24 | 46% | 0 |
| OLD | Mother Laurel | med | 29% | 96% | 260 | 3.8 H | 3.1 | 22 | 37% | 19 |
| OLD | Gilthrax | med | 26% | 98% | 270 | 1.8 | 3.2 | 10 L | 0% | 0 |

### BRAWLER *(Target: Fight EHP `210–260`, DPS `4–5`)*
*Existing avg: `32.9%` win, `4.5` DPS, `235` EHP · New avg: `31.6%` win, `5.1` DPS, `217` EHP*

| Grp | Hero | Size | Win | Dies | Fight EHP | DPS | Casts/30s | Val/Cast | Ab% | Help |
| :-: | :--- | :--- | --: | --: | --: | --: | --: | --: | --: | --: |
| OLD | Arthur | med | 37% | 93% | 256 | 5.3 | 1.8 | 18 | 40% | 0 |
| NEW | **Father Gorr** | med | 35% | 95% | 221 | 4.9 | 1.3 | 25 | 29% | 0 |
| NEW | **Burbrax** | med | 33% | 93% | 207 | 5.4 | 1.3 | 23 | 27% | 0 |
| NEW | **Colony** | med | 33% | 94% | 216 | 5.2 | 1.3 | 40 H | 56% | 0 |
| OLD | Kaska | big | 32% | 91% | 212 | 3.9 | 0.6 | 49 H | 16% | 2 |
| NEW | **Petra** | big | 32% | 92% | 223 | 5.1 | 0.8 | 40 | 35% | 0 |
| OLD | Pillar | big | 30% | 96% | 238 | 4.3 | 0.3 | 42 | 23% | 0 |
| NEW | **Malthrax** | med | 29% | 94% | 219 | 5.5 | 2.0 | 27 H | 50% | 0 |
| NEW | **Rico** | med | 27% | 98% | 215 | 4.3 | 1.5 | 19 | 16% | 0 |

### ATTACKER *(Target: Fight EHP `160–210`, DPS `4–5`, Ab% `≤35%`)*
*Existing avg: `31.7%` win, `4.9` DPS, `184` EHP · New avg: `35.9%` win, `5.2` DPS, `185` EHP*

| Grp | Hero | Size | Win | Dies | Fight EHP | DPS | Casts/30s | Val/Cast | Ab% | Help |
| :-: | :--- | :--- | --: | --: | --: | --: | --: | --: | --: | --: |
| NEW | **Tova** | med | 46% | 68% | 190 | 4.9 | 2.7 | 21 | 32% | 26 |
| OLD | Lorcan | med | 44% | 69% | 190 | 5.1 | 2.5 | 0 L | 0% | 0 |
| NEW | **Suna** | med | 38% | 72% | 177 | 5.3 | 2.8 | 14 L | 37% | 0 |
| NEW | **Thia** | med | 37% | 75% | 202 | 5.8 H | 2.9 | 19 | 23% | 0 |
| OLD | Velith | big | 36% | 75% | 177 | 4.7 | 1.1 | 29 | 30% | 0 |
| NEW | **Falcorn** | med | 34% | 78% | 191 | 5.1 | 1.5 | 23 | 35% | 0 |
| NEW | **Leagues** | med | 34% | 76% | 166 | 4.9 | 2.4 | 17 | 44% | 0 |
| NEW | **Moxie** | med | 33% | 74% | 177 | 5.6 H | 2.5 | 16 | 38% | 2 |
| OLD | Nettle | med | 33% | 78% | 189 | 5.2 | 2.2 | 10 L | 21% | 0 |
| OLD | Wallaby | sml | 32% | 85% | 177 | 5.1 | 3.2 | 8 | 31% | 0 |
| OLD | Lumen | big | 32% | 80% | 185 | 4.3 | 1.4 | 29 | 49% | 18 |
| NEW | **Maxim** | med | 29% | 82% | 190 | 4.5 | 2.3 | 12 L | 32% | 0 |
| OLD | Corvin | med | 25% | 99% | 190 | 5.8 H | 2.6 | 14 L | 54% | 0 |
| OLD | Naill | med | 20% | 99% | 182 | 4.3 | 0.8 | 16 | 28% | 0 |

### CASTER *(Target: Fight EHP `140–190`, DPS `4.5–5.5`, Ab% `≥50%`)*
*Existing avg: `21.1%` win, `4.5` DPS, `154` EHP · New avg: `35.0%` win, `5.0` DPS, `169` EHP*

| Grp | Hero | Size | Win | Dies | Fight EHP | DPS | Casts/30s | Val/Cast | Ab% | Help |
| :-: | :--- | :--- | --: | --: | --: | --: | --: | --: | --: | --: |
| NEW | **Bellin** | big | 39% | 71% | 166 | 5.3 | 1.9 | 42 | 79% | 0 |
| NEW | **Morel** | med | 38% | 75% | 190 | 5.6 | 2.4 | 11 L* | 9%* | 0 |
| NEW | **Orlo** | sml | 33% | 77% | 154 | 4.8 | 7.0 | 10 | 80% | 0 |
| NEW | **Chuk** | big | 30% | 86% | 166 | 4.2 | 1.6 | 34 | 65% | 0 |
| OLD | Cinder | med | 21% | 89% | 154 | 4.6 | 2.9 | 22 | 73% | 0 |
| OLD | Gains | big | 21% | 88% | 154 | 4.4 | 1.7 | 33 | 68% | 0 |

*\*Morel's Poison ticks report under DoT rather than `abDmg`, so actual ability share is much higher than 9%. Note also that existing Cinder/Gains sit lower in naked T1 `jobs` (`21%`) because they have `154` EHP with no body-blocking summons/forms and shine at T2/with items.*

### SUPPORT *(Target: Fight EHP `160–210`, DPS `1–2`, Help `60–90`)*
*Existing avg: `28.1%` win, `2.0` DPS, `202` EHP · New avg: `37.7%` win, `1.8` DPS, `189` EHP*

| Grp | Hero | Size | Win | Dies | Fight EHP | DPS | Casts/30s | Val/Cast | Ab% | Help |
| :-: | :--- | :--- | --: | --: | --: | --: | --: | --: | --: | --: |
| NEW | **Toot** | med | 43% | 71% | 195 | 2.8 H | 3.5 | 25 | 61% | 50 L |
| NEW | **Ylowyn** | med | 38% | 73% | 180 | 1.3 | 3.8 | 21 | 0% | 72 |
| OLD | Saint | med | 37% | 73% | 172 | 1.7 | 3.4 | 0 L | 0% | 0 L |
| NEW | **Nix** | sml | 35% | 72% | 203 | 2.0 | 7.2 | 14 H | 58% | 45 L |
| NEW | **Hewitt** | med | 35% | 80% | 179 | 1.1 | 3.6 | 16 | 0% | 51 L |
| OLD | Faelan | med | 28% | 81% | 206 | 1.1 | 5.0 | 23 | 0% | 66 |
| OLD | Zoe | med | 27% | 98% | 239 H | 2.9 H | 1.6 | 19 | 0% | 7 L |
| OLD | Brother Jamison | med | 25% | 97% | 220 | 1.1 | 2.0 | 17 | 0% | 38 L |
| OLD | Rosalind | med | 24% | 90% | 174 | 3.3 H | 3.4 | 7 L | 34% | 4 L |

---

## 3. Tier 2 Specialization Matrix (All 25 New Heroes)

*`jobs --tier 2 --partnerTier 1` (fights 2–5, no items, `n=60–80`) + real itemed bot fights (`paths --n 120`, 862 fights).*

| Hero | Job | T1 | T2 Base | Rank-Up | Path A | Jobs Win (Δ) | Path B | Jobs Win (Δ) | Gap | `paths` Reg (A / B) |
| :--- | :--- | --: | --: | --: | :--- | --: | :--- | --: | --: | --: |
| **Toot** | Support | 43% | 58% | +14 | Mint Condition | 60% (+3) | Golden Wall | 62% (+4) | 1 | 95% / 95% |
| **Father Gorr** | Brawler | 35% | 58% | +23 | Crusader's Mantle | 70% (+12) | War God's Blessing | 63% (+5) | 7 | 97% / 97% |
| **Morel** | Caster | 38% | 58% | +19 | Spore Detonation | 68% (+11) | Mycelial Network | 62% (+4) | 7 | 88% / 86% |
| **Tova** | Attacker | 46% | 61% | +15 | Twin Hunt | 65% (+4) | Golden Talons | 64% (+3) | 1 | 99% / 100% |
| **Bellin** | Caster | 39% | 58% | +19 | Ossuary Abomination | 62% (+4) | Soul Echo | 62% (+4) | 0 | 98% / 98% |
| **Thia** | Attacker | 37% | 63% | +26 | Nutty Barrage | 70% (+7) | Cauterizing Flame | 70% (+7) | 0 | 98% / 95%* |
| **Orlo** | Caster | 33% | 53% | +19 | Seeking Barrage | 62% (+9) | Arcane Warhead | 58% (+5) | 4 | 96% / 96% |
| **Leagues** | Attacker | 34% | 54% | +20 | Riptide Torrent | 58% (+4) | Grasping Tentacles | 62% (+8) | 4 | 100% / 96% |
| **Ylowyn** | Support | 38% | 58% | +20 | Telepathic Bond | 62% (+4) | Protective Spores | 61% (+3) | 1 | 100% / 100% |
| **Chuk** | Caster | 30% | 61% | +32 | Controlled Chaos | 65% (+4) | Spell Bombardment | 65% (+3) | 0 | 92% / 97% |
| **Durn** | Frontline | 40% | 65% | +25 | Ironhide Spikes | 78% (+13) | Bloodied Chicken | 76% (+12) | 2 | 100% / 100% |
| **Corporal Tobbin** | Frontline | 41% | 73% | +32 | Hold the Line | 77% (+4) | Over the Top | 77% (+5) | 0 | 98% / 100% |
| **Vela** | Frontline | 32% | 62% | +29 | Plague Mask | 69% (+7) | Hand of Mercy | 68% (+6) | 1 | 93% / 96% |
| **Lady Malice** | Frontline | 33% | 63% | +29 | Aura of Dominion | 70% (+8) | Blood Tithe | 74% (+11) | 3 | 100% / 100% |
| **Malthrax** | Brawler | 29% | 65% | +35 | Crimson Hunger | 68% (+3) | Frost & Blood | 75% (+10) | 7 | 93% / 93% |
| **Falcorn** | Attacker | 34% | 64% | +30 | Apex Predator | 72% (+8) | Gale Wings | 71% (+7) | 1 | 89% / 92% |
| **Moxie** | Attacker | 33% | 54% | +21 | Grand Finale | 61% (+7) | Razor Encore | 57% (+3) | 4 | 93% / 88% |
| **Maxim** | Attacker | 29% | 53% | +24 | Crossbow Master | 56% (+3) | Bursting Arrow | 56% (+3) | 0 | 90% / 94% |
| **Suna** | Attacker | 38% | 57% | +20 | One with the Bow | 58% (+2) | Patient Aim | 60% (+3) | 1 | 100% / 96% |
| **Petra** | Brawler | 32% | 58% | +26 | Platinum Rival | 64% (+7) | Bahamut's Banner | 64% (+7) | 0 | 100% / 100% |
| **Burbrax** | Brawler | 33% | 63% | +30 | Top-Shelf Proof | 67% (+3) | Drunken Sway | 76% (+12) | 9 | 85% / 82% |
| **Colony** | Brawler | 33% | 68% | +34 | Killer Bees | 73% (+6) | Blinding Swarm | 73% (+5) | 1 | 94% / 97% |
| **Nix** | Support | 35% | 56% | +22 | Versatile Trickster | 60% (+3) | Spell Thief | 59% (+3) | 1 | 100% / 100% |
| **Rico** | Brawler | 27% | 55% | +27 | Master Duelist | 63% (+8) | Panache | 60% (+5) | 3 | 100% / 98% |
| **Hewitt** | Support | 35% | 54% | +19 | Trance of Order | 57% (+3) | Clockwork Cavalcade | 58% (+4) | 1 | 92% / 94% |

*\*Thia's `paths` ran prior to her final `Nutty Barrage` trim; post-trim `jobs` landed at an exact `70% / 70%` (`Gap 0`).*

### Run-Long Scaler Check (`gauntlet lady_malice --n 150`)
- **Path A (`Aura of Dominion`):** `57.3%` avg across F2–Boss (`100 / 88.7 / 72.7 / 24.7 / 0.7%`), carrying **`+77.5` permanent Max HP**.
- **Path B (`Blood Tithe`):** `58.8%` avg across F2–Boss (`97.3 / 83.3 / 88.0 / 22.7 / 2.7%`), carrying **`+74.5` permanent Max HP**.

---

## 4. Whole-Cast Testbench Suite (All 48 Heroes)

### 4.1 `cast` (Ability Lift, Fights 2–5, `n=60`)
- **25 New Heroes:** Win range **`26%–47%`** (avg `35.1%`), Ability Lift **`+5` to `+32` pts** (avg **`+17.4` pts**). Top lifts: Toot (`+32`), Morel/Orlo/Ylowyn/Nix/Hewitt (`+28`), Moxie (`+23`), Bellin (`+22`), Tobbin/Falcorn (`+19`), Thia/Chuk (`+18`).
- **23 Existing Heroes:** Win range **`19%–46%`** (avg `31.1%`), Ability Lift **`+2` to `+25` pts** (avg **`+10.5` pts**).

### 4.2 `bots` Progression (200 Runs, Seed 20000)

| Setup | Bot | Cleared | Median End | F1 | F2 | F3 | F4 | F5 | Boss | Items@F5 | T2@F5 |
| :--- | :--- | --: | :--- | --: | --: | --: | --: | --: | --: | --: | --: |
| **48 Heroes (default `w=0.75`)** | Never buys | 0% | fight 3 | 100% | 87% | 34% | 14% | 0% | - | 0.0 | 0.0 |
| **48 Heroes (default `w=0.75`)** | Buys sensibly | 37% | fight 5 | 100% | 91% | 73% | 68% | 48% | 72% | 5.7 | 0.7 |
| **48 Heroes (default `w=0.75`)** | Builds engine | 45% | boss | 100% | 84% | 77% | 65% | 61% | 71% | 5.2 | 0.7 |
| **48 Heroes (`w=1.65`)** | Never buys | 0% | fight 4 | 100% | 80% | 37% | 18% | 0% | - | 0.0 | 0.0 |
| **48 Heroes (`w=1.65`)** | Buys sensibly | **55%** | cleared | 100% | 91% | 82% | 73% | 59% | 81% | 5.6 | 1.1 |
| **48 Heroes (`w=1.65`)** | Builds engine | **63%** | cleared | 100% | 88% | 80% | 75% | 74% | 87% | 4.9 | 1.1 |

### 4.3 `bosscheck` (138 Bot Parties, 3 Replays Each)

| Party Variant | Overall Win | Front+Dmg+Sup | Front+Dmg | No Frontline | Avg HP Lost |
| :--- | --: | --: | --: | --: | --: |
| **A: All T2, items on 1 hero** | **77%** | 82% | 77% | 69% | 66% |
| **B: Two T2, with items** | **74%** | 80% | 74% | 68% | 71% |
| **C: One T2, with items** | **33%** | 47% | 33% | 17% | 88% |

### 4.4 `castoff`, `itemoff`, `placement`, `luck`, `buffs`
- **`castoff` (573 fights):** Fight win drops from `77%→53%` (F2), `77%→51%` (F3), `73%→51%` (F4), `55%→35%` (F5), `77%→47%` (Boss) with 1 ability off. All 25 new heroes show strong positive drops (`+8` Leagues to `+80` Nix).
- **`itemoff` (573 fights):** Full build → No items drops `77%→57%` (F3), `73%→44%` (F4), `55%→24%` (F5), `77%→35%` (Boss). Top items: Sun Blade (`+36`), Cloak of Displacement (`+29`), Cloak of Evasion (`+24`), Vicious Weapon / Ring of Spell Storing / Scarab (`+17`).
- **`placement` (573 fights):** `smart` **`79%`** vs. `swapped` **`59%`** (`+20` pt tactical spread; `spread 77%`, `back 76%`, `random 73%`, `bot 72%`, `tight/wall 71%`; Best `94%` vs. Worst `40%`).
- **`luck` (478 fights, `reps=3`):** Average dice `70%` vs. Normal dice `71%`; `20%` coin-flip, `4%` upset, `5%` rescue.
- **`buffs` (961 hero-fights across all 48 heroes):** Clean job-differentiated scaling — Attackers scale best on Attack Dice (`+13` @ `+1d10`) & Speed (`+9` @ `+30%`); Brawlers on Attack Dice (`+14`), Speed (`+10`), Key (`+7`), & Ability Dice (`+7`); Frontliners on Ability Dice (`+9`) & CON (`+5`).

---

## 5. Bugs Caught & Tuning Adjustments Made During Bench Testing

1. **Durn Quadratic Bleed & Uncapped Thorns (`12.0 → 9.8 → 6.0` DPS):** Stacking `S.bleed += u.rage` every 2s scaled as $O(t^2)$, and unthrottled `1/4 AC` Thorns triggered on every multi-enemy hit (`4.9` DPS from Thorns alone). Fixed to linear mutual Bleed pulse (`ceil(rage/2)` every `3s`), `acDiv: 8` (`4` on Ironhide Spikes) with `0.75s` CD, plus `2d6 + CON` Ward on *Spiked Hug* (`40%` T1 win, `281` EHP, T2 `78%/76%`).
2. **Ylowyn Solo Fight 1 Failure (`94% → 100%`):** Base `96` HP / `12` AC and `1d4` attack stalled solo vs. Goblin Ambush (`48.8s`). Bumped to `104` HP (`CON 14`), `13` AC, `1d6 + half CHA @ 1.6s`, plus `3d6 + CHA` Ward + `1d8 + CHA` heal on *Flumphry's Spores* (`100%` intro, `38%` T1 win, `72` Help — 0 flags).
3. **Orlo Infinite-Loop Ramp (`7.1 → 4.8` DPS):** `60`-charge Small cast + `+6` AR/missile (`+30` cap) fired `9.5` casts/30s. Trimmed to `+3` AR/missile (`+15` cap) and `2/2/3` base + `1` add (`33%` T1 win, `4.8` DPS, `10` Val — 0 flags).
4. **Thia Wildfire Over-DPS (`7.4 → 5.8` T1, `82% → 70%` T2 Path A):** Trimmed *Flaming Acorn* to `1d4 + WIS @ 1.8s` (`1` Burn), Squirrel AS to `+35%`, and *Nutty Barrage* to `startShifted` + every `3rd` attack (`70% / 70%` T2 Gap 0).
5. **Chuk Slow Cast Cadence (`2.9 → 4.2` DPS, `20% → 30%` win):** `INT 8` dragged Big `180` charge to `10.0s` (`1.2` casts/30s). Bumped to `INT 12`, `startSp: 1`, `5d8 + CHA` primary + `2d6` Low splash (0 T1 flags, `65% / 65%` T2 Gap 0).
6. **Flat Geometry-Locked T2 Paths (`Leagues`, `Suna`, `Corporal Tobbin`, `Moxie`, `Maxim`, `Falcorn`, `Nix`, `Hewitt`):** Fixed grid-line misses (`lineCells` behind target rarely aligns on 8×8 → nearest enemy within splash/pierce radius), delayed buffs expiring after fights end (*Over the Top* grants AS immediately on horn), and non-caster Act 1 matchups (*Spell Thief* boosts base Charge Steal alongside enemy Fizzle/Disadvantage).
