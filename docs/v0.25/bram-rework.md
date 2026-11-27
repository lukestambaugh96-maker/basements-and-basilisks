# Bram rework: Life Domain, solo frontline or off-tank (approved by Luke, 27 Nov)

Review card: "Bram" on the B&B design review page (applied). Everything below is in `heroes.config.json`; the prototype2 preset reverts it and still reproduces 47.0%.

## Kit
- **Channel Divinity, Preserve Life:** heal every ally below half HP 2d8 + WIS per tier. One charge per fight; nothing fires at the start.
- **Disciple of Life (passive):** the first time an ally drops below a third of their HP, Bram uses Channel Divinity.
- **Cure Wounds (Medium):** heals the closest hurt ally 3d8 + WIS per tier (High +1d8); Bram heals himself ¾ of it (was all of it).
- **Warhammer:** 1d8 → 1d10.
- **Tier 2, Unyielding (solo frontline):** Cure Wounds heals Bram 1½ times the amount and taunts every foe next to him for 2s.
- **Tier 2, Shield of Faith (off-tank):** Cure Wounds goes to the lowest-HP ally anywhere and also Wards them for the full amount.
- Removed: Preserve Life as a path (now his base Channel Divinity) and Turn the Faithless.

## Results
Tier 1 (no items, fights 2–5): win 36% → 38%, effective HP 283 (280–340), damage 1.7 → 2.0/s (2–3), value per cast 28 → 25 (Medium 20). All on target.

| Tier 2 version | Regular / Nezznar (bot fights) | Bram dies, Nezznar | Allies die, Nezznar | T2 Bram + T1 partners |
|---|---|---|---|---|
| No path | 91% / 86% | 25% | 26% | 65% |
| Unyielding | 91% / 94% | 14% | 21% | 73% |
| Shield of Faith | 92% / 94% | 20% | 13% | 73% |

Whole runs (300 per bot): never-buy 0% (fight 3), sensible 62%, engine 75%. Boss check A / B / C: 87 / 83 / 37%.

Tried and dropped: taunting foes next to his heal target, a 2-square taunt, healing the frontliner first. The bench barely separates "solo" from "with another tank"; the paths differ in who survives.

Test tools added: `jobs --tier 2 --partnerTier 1 --path 0|1` (only the measured hero ranks up; adds ally deaths and a solo / with-tank split).
