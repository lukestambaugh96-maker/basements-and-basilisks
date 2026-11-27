# Cast rework batch 2 (proposed 27 Nov, waiting for Luke)

Not in `heroes.config.json` yet. Turn on with `--preset batch2` (`tools/testbench/presets/batch2.json`). Review cards: "Lorcan", "Corvin", "Velith", "Nettle", "Lumen" on the B&B design review page (pending). Luke gave no one-line directions for this batch; the designs are Claude's.

| Hero | Base kit | Tier 1 win | Tier 2 (tier 1 partners): no path → A / B |
|---|---|---|---|
| Lorcan | Hunter's Mark: his attacks mark the foe; every hero attack on it +1d4 per tier. Twin Shot unchanged. | 30% → 48% (damage 5.8, counts allies' mark hits) | 67% → Colossus Slayer 76% (mark +1d8/tier vs foes above half) / Horde Breaker 71% (mark jumps on a kill, next attack cleaves) |
| Corvin | His mark (from Dread Ambush) Slows the foe 20% for 1s on any hero hit; swords still double on it. Ambush 1d10 + DEX per tier (was 2d8). | 32% → 34% (damage 6.3 → 5.5) | 56% → Stalker's Flurry 60% (every 2nd attack on the mark adds a strike) / First Strike 69% (first Ambush gives allies 15 charge; marked kill gives him 50) |
| Velith | Sneak Attack: bonus Venom Dagger +1d4/tier + 1 Poison, every 4s. Assassinate (passive): on a Poisoned foe or from Stealth. Dagger poisons on hit, every 1.8s (was 1.5s). Cloak of Darkness triggers Sneak Attack. | 33% → 42% (damage 6.0, high) | 55% → Assassin 63% (Sneak Attack kills non-bosses below 30%) / Poisoner 63% (spreads 4 Poison to adjacent foes) |
| Nettle | Pact of the Fiend: whenever a foe she cursed dies, Ward 2d8 + CHA per tier. Hellfire Curse 3d6 + CHA per tier (was 2d6) and curses: her attacks on it +1d6. | 33% → 45% | 66% → Hellfire Pact 70% (cursed foe explodes, curse jumps) / Fiend's Favor 73% (Pact Ward doubled, +30% attack speed 4s) |
| Lumen | Pact of the Celestial: whenever Sunbeam hits foes, his most-hurt ally heals 2d6 per tier per foe hit. | 34% → 41% | 59% → "Radiant Soul" 72% (Sacred Beam +1d6 radiant; Sunbeam +2 dice per foe already hit) / Healing Light 68% (Pact heals ×3; Sacred Beam heals half its damage) |

## Open questions for Luke
- **Lumen's path A name:** Radiant Soul was his old passive and was removed in 0.25. Options: rename the new path (e.g. "Searing Light"), bring back Searing Focus triggered by the Pact (each Sunbeam kill: +10% attack speed for the fight), or keep the name.
- Lorcan and Velith read high on damage (5.8 and 6.0 vs 4–5).
- Corvin's paths are 9 points apart (limit 10); First Strike is the stronger one.

## Rules added in this batch
- **Hunter's Mark is a shared engine rule** (`setMark` / `applyMarks` in `engine.js`): a mark carries its maker's effect; any hero's attack on the foe triggers it; marks from different heroes stack, one per hero.
