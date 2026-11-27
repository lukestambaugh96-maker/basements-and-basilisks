# Wallaby rework: Sneak Attack in the base kit (approved by Luke, 27 Nov)

Review card: "Wallaby" on the B&B design review page (applied). Everything below is in `heroes.config.json`; the prototype2 preset reverts it and still reproduces 47.0%.

## Kit
- **Sneak Attack:** a bonus Thrown Dagger that deals +1d4 per tier, at most once every 3s.
- **Opportunist (passive):** when an ally is attacking the same foe, Wallaby triggers Sneak Attack.
- **Dagger Toss (Small):** 1 / 2 / 3 daggers of 1d4 + DEX per tier at the lowest-HP foes within 3; the first dagger triggers Sneak Attack (skips the condition, keeps the cooldown).
- **Thrown Dagger:** unchanged, 1d4 + DEX every 1.2s.
- **Tier 2, Cutthroat (the killer):** Sneak Attack also triggers on foes below half HP; against them it deals +1d8 per tier and comes back every 1.5s; a kill gives him 60 charge.
- **Tier 2, Pickpocket (the thief):** each Sneak Attack kill steals 3 gold. Gold only, no fight effect (Luke: fine for now).

## Results
| Version | Win | Wallaby dies | Damage/s | Ability share | Gold per fight |
|---|---|---|---|---|---|
| Today, tier 1 | 32% | 82% | 4.2 | 42% | |
| +1d6 every 2s (first try) | 45% | 71% | 6.0 | 29% | |
| New base, tier 1 | 42% | 74% | 5.4 | 33% | |
| Tier 2 + tier 1 partners, no path | 63% | 58% | 6.5 | | 0.1 |
| Cutthroat | 67% | 54% | 7.6 | | 0.1 |
| Pickpocket | 63% | 58% | 6.5 | | 1.2 |

Whole runs (300 per bot): never-buy 0% (fight 3), sensible 62%, engine 74%. Boss check A / B / C: 88 / 83 / 39%.

Open: Pickpocket's worth only shows over whole runs; measuring it needs the bots to pick paths on purpose (they pick at random today).
