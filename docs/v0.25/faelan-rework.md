# Faelan rework: Arcane Recovery in the base kit (approved by Luke, 27 Nov)

Review card: "Faelan" on the B&B design review page (applied). Everything below is in `heroes.config.json`; the prototype2 preset reverts it and still reproduces 47.0%.

## Kit
- **Arcane Recovery:** gain 10 charge.
- **Spell Weave (passive):** each hit one of her Wards absorbs triggers Arcane Recovery, up to 3 times per Shield.
- **Shield (Medium):** unchanged, Ward the lowest-% ally 3d10 + INT per tier (Low 2d10, High +1d10).
- **Ray of Frost:** 1d4 → 1d6 (+ half INT).
- **Tier 2, Projected Ward (the wall):** each Shield also Wards the next-lowest ally for 40% of the amount.
- **Tier 2, Shared Recovery (the battery):** each time she triggers Arcane Recovery, her top damage dealer also gains 20 charge.
- Removed: the old Spell Weave path (now her base trigger) and the old Shared Recovery (5 charge to the Warded ally).

## Results
| Version | Win | Faelan dies | Allies die | Damage/s | Casts/30s | Help/30s |
|---|---|---|---|---|---|---|
| Today, tier 1 | 34% | 72% | 74% | 1.0 | 4.4 | 65 |
| New base, tier 1 | 42% | 64% | 66% | 1.05 | 5.8 | 88 |
| Tier 2 + tier 1 partners, no path | 71% | 32% | 35% | | 7.3 | 178 |
| Projected Ward | 78% | 27% | 30% | | | |
| Shared Recovery | 76% | 27% | 30% | | | |

Tier 1 targets: effective HP 207 (160–210), damage 1.05 (1–2), help 88 (60–90), value per cast 24 (Medium 20).

Whole runs (300 per bot): never-buy 0% (fight 3), sensible 61%, engine 74%. Boss check A / B / C: 89 / 85 / 39%.

Notes: Shared Recovery aimed at the Warded ally (usually the tank) added almost nothing; aimed at the top damage dealer it works. The bots rarely recruit her (72 fights), so paths were compared with `jobs --tier 2 --partnerTier 1 --path 0|1`. Rosalind also feeds the top damage dealer (attack speed); Faelan feeds casts (charge), so they stack.
