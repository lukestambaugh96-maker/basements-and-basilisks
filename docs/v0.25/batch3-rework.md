# Cast rework batch 3 (locked in by Luke, 27 Nov)

All 5 heroes (Cinder, Gains, Rosalind, Brother Jamison, Saint) are locked into `tools/testbench/config/heroes.config.json`. `presets/prototype2.json` reverts them and still reproduces **47.0%**.

## Locked kits & benchmarks (`n=200–250` T1; `n=150–200` T2 + T1 partners)

| Hero | Job | Locked kit & class feature | T1 Win (EHP / DPS / Help) | T2 Base → Path A / Path B |
|---|---|---|---:|---:|
| **Cinder** | Caster | **Metamagic (Twin Spell):** 4 SP → cast twice. **Draconic Spark:** `+1` SP per Fire Bolt. **Scorching Ray** (Medium): `2/3/4` rays of `2d6`/tier magic. | 36% (`154` / `4.9` / `22` val) | 61% → **Scorched Earth 69%** (rays splash `1d4`/tier + `2s` non-stacking 3×3 burning ground `1d4`/s) / **Living Flame 70%** (Fire Bolt `1d6`/tier `+ CHA`; cast becomes **Kindle** stacking `+20%` AS + extra bolts at stacks `1/3/5`) |
| **Gains** | Caster | **Arcane Recovery:** `+30` charge per combat gold drop. **Gilded Beam** (Big, `0.8s` cast): `10d8`/tier `+ INT` magic, Gilds *before* damage (High Gilds adj), drops `1g` on hit + `1g` on Gilded death. | 34% (`154` / `4.9` / `32` val) | 55% → **Compound Interest 60%** *(at 0g; `+3d8` base + `+2d8` per `10g` held, max `+8d8`)* / **Liquid Assets 61%** (`2g` on hit & Gilded death + `+20` ally charge per gold drop) |
| **Rosalind** | Support | **Bardic Inspiration:** grants `1d8`/tier die; ally spends it on next cast for `+1d8`/tier magic dmg (or Ward). **Dissonant Whispers** (Medium): `1d6 + CHA`/tier magic + Slow `30%` `2s` (High Stun `1s`) + inspires `1/1/2` allies. | 40% (`174` / `3.2`) | 54% → **Cutting Words 69%** (hits `2` foes; spending Inspiration deals `1d8`/tier + Slow `35%` `2s` to attacker) / **Heroism 67%** (inspiring also gives `1d8 + CHA`/tier Ward + `+20%` AS `3s`) |
| **Brother Jamison** | Support (`range: 1` Mace) | **Emboldening Bond** (Medium): bonds Jamison + `1/2/2` allies (`6s`), heals `2d6 + CHA`/tier; **Pass the Heal/Buff** (`50%` of heals/Wards + full AS buffs spread across Bond). **Channel Divinity (Unity of Peace):** first ally `<35%` HP → equalize party HP `%` + `1d6`/tier Ward to all. | 35% (`232` / `1.1` / `61` help, front-row `autoPlace`) | 54% → **Balm of Peace 69%** (`100%` Bond share + `1d8`/tier self-heal) / **Protective Bond 67%** (Bonded ally taking `10+` dmg gains `1d6`/tier Ward `3s` CD; 3rd cast restores CD once) |
| **Saint** | Support | **Mirror Blessing** (Medium): `+15%` Evasion (`3s`) + Mirror Double (`20%` HP, `2/2.5/3s`, taunts `0/1/1.5s`). **Channel Divinity (Trickster's Escape):** first ally `<35%` HP → `2s` Stealth + `+25%` Evasion (`3s`). | 53% (`172` / `1.6`) | 62% → **Invoke Duplicity 74%** (`40%` HP Doubles, `+1.5s`, copy ally cast at Low, CD also spawns Double) / **Cloak of Shadows 70%** (`+25%` Evasion `4s`, `1.5s` Stealth on Double expire, `+15` charge per ally evade/dodge) |

## After locking in (`n=300`, seeds 20000+; `bosscheck --n 150`)
- **Prototype2 preset:** **47.0%** (exact).
- **Whole runs:** never-buy **0%** (median fight 4), sensible **69%** (was 65%), engine **76%** (was 76%).
- **Boss check (Nezznar, 252 parties):** A / B / C = **82% / 82% / 50%** (was 78 / 81 / 46%; Frontliner + damage + support jumped to 94 / 92 / 67% with the reworked supports). Party C will be retuned back toward ~33% in the post-cast encounter buff pass.
