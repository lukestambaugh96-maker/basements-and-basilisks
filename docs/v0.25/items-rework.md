# Basements & Basilisks v0.25: Item Rework, first pass

**Date:** 2026-11-23
**Status:** Every item from `src/04-items.js` (v0.23) rewritten for the v0.25 damage rules and valued in the balance sheet ("Items" tab). Nothing is implemented yet.
**Builds on:** `claude/v0.25-hero-design-session-2026-11-23.md` (math model and number rules).

## Rules applied
- **Amounts are dice plus flat.** No percentage boosts to damage, healing or Wards: "+20% spell damage," "Ward equal to 15% max HP," "reflect 20%," "cleave 30%" are all rewritten as dice or flat numbers.
- **Rates stay percentages:** attack speed, cast rate, Slow.
- **On-hit items add a separate die of damage.** If it's another type (fire, cold, Radiant), it uses that type's resistance but **counts as the same hit as the attack**: no extra on-hit triggers, charge or Ki.
- **Die size is the item lever:** "+1 Weapon" makes the weapon die one size bigger; Staff of Striking makes Ki dice bigger; Staff of Withering makes Hex a d8.
- **Removed for now:** Evasion, Exposed, Sorcery Points.
- **No attribute parity:** every item leans into one or two stats, so it says who it's for.

## How items are valued
- Value = % gain in output (or effective HP for tanks) on a reference Tier 1 hero who fits the item: a damage hero, a caster or a tank. Fights are assumed to last 35s.
- **Working value targets by rarity:** Common ≈ 12%, Uncommon ≈ 20%, Rare ≈ 30%, Very Rare ≈ 45%, Legendary ≈ 65%, class items ≈ 35% on a keyword user.
- **Prices (Luke's economy, 2026-11-23):** Common 5, Uncommon 10 (Claude's suggestion), Rare 15, Very Rare 25, Legendary 35, class items 15 (Claude's suggestion; Luke set 5). Value per gold falls gently with rarity (2.4% → ~1.9%): cheap items are efficient fillers, expensive ones are worth more per item slot.
- After the pass, every item lands within ±25% of its rarity's target. These are working targets for tuning, not rules.

## Notable changes
- **Stones:** +2 to one stat (Constitution +4, since CON is worth less per point at Tier 1; Intelligence adds +5% cast rate).
- **Shield** is +2 AC (one point of AC at Tier 1 was worth only ~6%). **Cloak of Protection** is +1 AC and +1 SR, as in 5e.
- **+1 Weapon** moved to Uncommon (as in 5e): +1 damage and a bigger weapon die.
- **Scaling items** (Whetstone, Quicksilver, Heartwood, Tome of Compounding, Owl's Astrolabe, Ledger) grow by a flat amount per win with a cap, instead of percentages that never stop.
- **Evasion items** now do something concrete: Boots of Elvenkind and Glamoured Studded Leather start the fight in Stealth; Cloak of Displacement makes the first 2 attacks against you miss; Ring of Evasion halves the first enemy ability that hits you.
- **Holy Avenger** was worth about twice a Legendary (2d6 Radiant on everything). It's now +1d6 Radiant per hit plus the heal.
- **Belt of Storm Giant Strength** came down from +8 STR to +4 for the same reason.
- **Poison items:** Cloak of Arachnida inflicts 1 poison per basic attack. On heroes who hit faster than once a second (Corvin, Naill), poison stacks without limit, so it's priced as Very Rare.
- **Class items** are rewritten against the v0.25 keywords (Arcane Recovery, Hunter's Mark, Sneak Attack, Ki model B, Metamagic without points, Hex).

## Open
- Class items are valued with a rough keyword estimate; check them once the T2 keywords are modeled in the sheet.
- The encounter sheet still uses a placeholder (+12% damage, +10% HP per item); swap in real item values once a shop economy is set.
- Item slots per hero: the falling value per gold assumes slots are limited.
