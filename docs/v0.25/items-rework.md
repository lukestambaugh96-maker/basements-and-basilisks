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

---

## v0.25 Implementation — 3-Tier Stat-Based Pool (Locked 27 Nov 2026)

Implemented in `tools/testbench/config/items.config.json` (`rules.items.useConfig = true`; legacy items preserved under `presets/prototype2.json`, which still reproduces **47.0%** exact).

### Decisions
- **3 tiers:** **Uncommon (8g, 12 items)** small stats / **Rare (15g, 12 items)** solid offense & defense / **Epic (24g, 7 items)** build-arounds.
- **Class items on hold for Act 1** (`classItemsEnabled: false`; `classitem` removed from `CHOICE_DECK`). Will return tied to perks/house rules later.
- **New hooks:** Evasion (`eva`), Pierce (`pierce`), on-hit Burn (`onHit.burn`), and `castDie` (`Staff of Power` adds `+1d8` to any casted ability effect — damage, heal, Ward, and Wild Shape bonus HP).
- **Shop rarity weights** by fight (1 → 6): `90/10/0` → `75/25/0` → `55/40/5` → `40/50/10` → `30/50/20` → `25/50/25` (`Uncommon / Rare / Epic`, tightened for Act 1 so Epics unlock at Fight 3 and peak at 25% before Nezznar).

### Final Benchmarks (`n = 300` runs, `n = 150` itemoff / bosscheck)
- **Whole runs (with Nezznar Web `6s`):** `Never buys` **0%** (med Fight 3), `Buys sensibly` **53%**, `Builds an engine` **60%**.
- **Full-build `itemoff` lift (1,451 fights):** Fight 3 **+26 pts**, Fight 4 **+25 pts**, Fight 5 **+40 pts**, Boss Nezznar **+40 pts** (91% → 51%).
- **Per-item health:** All **31/31** items positive (**+1 to +19 pts**; zero dead/negative items). Top Epics: `Scarab of Protection` (+18), `Cloak of Arachnida` (+17), `Sun Blade` (+15), `Staff of Power` (+14).
- **Nezznar `bosscheck` (with Web `6s` + Act 1 shop curve):** A / B / C = **84% / 79% / 38%** (balanced team: **95% / 86% / 48%**; no-support: **78% / 75% / 35%**).
