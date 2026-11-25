# Basements & Basilisks v0.25: Hero Design Session

**Date:** 2026-11-23
**Status:** Decisions from a hero balance and design chat with Luke. Nothing here is implemented yet.
**Builds on:** `docs/v0.25_design_direction.md` in the game repo (commit `1d83fc0`). Where this doc is more specific, it wins for the heroes and rules below.
**Balance model:** the "B&B v0.25 balance curve model" sheet (https://claude.ai/artifact/WDbQac2gSrsGTdjmbXNkP2). Every [bracketed] number here is a placeholder that the sheet and, later, the game's sim will tune.

Items marked **(proposed)** still need Luke's OK; everything else was agreed.

---

## 1. Global rules

### 1.1 The d20 ability roll
- Every hero rolls a d20 for their ability, with five results: **Fizzle, Low, Mid, High, Crit.**
- Only the two ends are standardized:
  - **Fizzle (natural 1):** nothing happens; half the charge comes back.
  - **Crit (natural 20):** the dice rolled are doubled. Flat bonuses are not.
- **Low, Mid and High mean whatever fits each hero** (dagger count, taunt length, Ward size, number of allies buffed). How much a High roll is worth differs by hero, which is what makes Inspiration a real choice.
- **Every ability needs at least one dice component,** or its crit does nothing. Buffs can roll their duration (e.g. 2d4 + 4 s).
- The roll is d20 + the hero's key ability modifier against the band thresholds (placeholders: Low up to 5, High from 14).
- **Expected value:** at +3, an average cast is worth about 17% more than a Mid roll. Each +2 to the roll is worth about 5–6% more ability.

### 1.2 Advantage and Disadvantage
- **Advantage:** roll the ability d20 twice, keep the higher. **Disadvantage:** roll twice, keep the lower.
- **They only affect d20 ability rolls,** never damage dice. **They don't stack;** having both cancels out.
- **Value:** at +3, Advantage makes a cast worth about 18% more and nearly doubles the crit chance (5% → 9.75%). Disadvantage is the reverse and nearly doubles the fizzle chance.
  - Its worth scales with ability share: about +12% total output for a caster, +7% for a balanced hero, +4–5% for an attacker. That caster skew is intended: every lever has a natural home.
- **Advantage is a multiplier, not a payoff. Price it by uptime:**
  - One Advantaged roll ≈ +18% of one cast: small. One-shots belong on cheap things (Common items, consumables, small T3 cards, bargains), never as an ability's whole payoff.
  - Constant Advantage is strong: a T3 perk or rare item (Elven Accuracy).
  - Long-uptime sources (Hex, auras) or riders on something else are the right shape.
  - It's worth more on heroes whose rolls swing hard: big slow spells, steep High bands, crit payoffs.
- **Disadvantage on enemies** hurts enemy casters, healers and bosses more than brutes, so "who do I Hex?" is a real targeting choice. **Bosses take half** (Disadvantage on every other roll).

### 1.3 Crits
- A crit doubles the dice rolled, not flat bonuses.
- **Crit sources:** natural 20 on an ability roll; abilities that guarantee a crit (Alert Strike); **melee hits on a stunned foe;** **the first strike out of Stealth.** A strike that's already a crit doesn't double again on a natural 20; that hero's natural-20 line carries the extra instead.
- **No random crit-chance stat.** Crit payoffs are separate from crit sources (Savage Attacks: +1 die on crits).
- A crit is shown with a bigger or differently colored number, not a "CRIT!" text popup.

### 1.4 How numbers are written
- **Amounts** (damage, healing, Ward, poison, charge granted, regen per second) are dice plus a flat bonus. Simple conversions of a rolled amount ("heals for half the damage dealt") are allowed; percentage boosts to amounts are not.
- **Rates** (attack speed, movement, charge gain, Slow, Haste, drain) are percentages. Time is felt, not rolled.
- **Durations** (root, stun, taunt, dodge windows, cast time) are plain seconds.
- **Any ability score can be a damage bonus** when it fits the class or theme. Fractions round down.
- **Radiant never gets a flat bonus** (it ignores AC and SR, so its dice run smaller).
- No ability fires more than once per second.

### 1.5 Control statuses

| Status | Effect |
|---|---|
| **Root** | Can't move; can still attack and cast. **A rooted foe that casts rolls its ability with Disadvantage.** Peel against movers, and a real answer to stationary casters. |
| **Slow** | Moves and attacks slower (a percentage). Doesn't stack; the strongest Slow wins. |
| **Stun** | Can't move, attack or gain charge. Short durations. After a stun ends, the unit can't be stunned again for about 1s. |
| **Taunt** | Must attack the taunter. |

- **Bosses take half duration** from all four. **Spell resistance shortens control** by the same amount it cuts magic damage.
- **Stealth (a self status):** untargetable; ends when the hero attacks or casts, and that first strike crits. Velith stealths herself; Saint's Cloak of Shadows can stealth allies.
- Frighten, Charm and Expose wait until a hero needs them.

### 1.6 Last Stand
Once per fight, a unit that would die drops to 1 HP instead and is **invulnerable for about 1.5s**. Every "drop to 1 HP" effect uses this one rule. Pillar's Rage cash-in replaces it for him.

### 1.7 Pacing
- Fights get longer only so that systems interact, not for length's sake.
- **Measure pacing in events, not seconds (proposed):** every T2 trigger fires at least twice a fight. Casts per fight are set per style.
- **Hit profile:** every enemy gets one (how often it hits × how big each hit is). "Swarm" means many small hits, not many bodies.
- **For the encounter pass (proposed):** widen enemy attack intervals to about 0.7s (skirmishers) to 2.5s (brutes).

### 1.8 Map ranges
On the 6-row × 8-column map (heroes in columns 1–4, enemies in 5–8). **Proposed scale:** melee 1, short 2, mid 3, long 4.

### 1.9 Roles
- **Hybrid roles are allowed but rare,** only when the T1 kit really does both jobs. The first role listed is the primary one, shown as a split chip.
- Current hybrids: **Bram and Juniper (Tank/Support), Zark (Damage/Tank), Pillar (Tank/Damage).**
- Temporary forms (Wild Shape) don't change the card's role.

### 1.10 Packs
- **Packs are a design and organization tool only.** The v0.24 shop pack filters are removed; the shop draws from the whole cast.

### 1.11 Card display
- **AC and SR show the value;** hovering shows the percentage resisted.
- **The primary attribute is highlighted.** Numbers that scale with another stat are colored to match it.
- Ability cards show "about every Xs" (the time-only interval); the tooltip explains that attacking and taking hits speed it up.
- T2 choices, quests, boons and multiclass stay hidden until earned.

### 1.12 Targeting
- **Supports target themselves only as a fallback,** when no ally qualifies. **Never charge yourself.** Lowest-HP-% targeting naturally includes the caster.

### 1.13 Starting encounter
- **The first encounter is the starting hero alone,** cleared with **about one cast**: the enemy group's effective HP ≈ the starter's effective damage over one cast interval, plus that cast.
- **Open:** support starters deal little damage alone. Lean: a short intro fight per starter, which doubles as its tutorial.

- **The intro fight is melee only,** so starters who only hit foes that come to them (Toot) can clear it.

---

## 2. The math model

### 2.1 No hidden multipliers
- Power grows only through visible things: **dice count, die size, flat bonuses, hit dice, rates and targets.** No background curve multiplies hero or enemy stats.
- **The endgame should feel overpowered,** and that comes from players finding engines: rate × targets × dice × crits multiply each other, visibly.
- **Encounters are balanced on time-to-kill in both directions.**

### 2.2 Formulas
- **Damage per second** = rate × targets × (N × (X+1)/2 + flat bonus). **Tiers add dice** (N), **items and perks raise die size** (X), **the thematic key score is the flat bonus.** Area abilities use dice only.
- **Resistance** = R³ / (R³ + 16³) (the cubed curve; 50% at 16). AC against physical, SR against magic. **Radiant ignores both.** STR penetration lowers R first.
- **Effective HP** = HP ÷ (1 − resistance). Stacking AC is itself an engine past about 25.
- **HP from hit dice:** base HP + [8] hit dice per tier (the class's die, averaged) + **CON × every hit die, applied retroactively.**

### 2.3 Attack speed
- **Attack interval = base interval ÷ (1 + ratio × attack speed bonus)**, minimum [0.3s].
- **Every hero has a unique base attack interval** (fastest: Naill ~0.95s; slowest: Pillar 2.4s).
- **Attack speed ratio:** 1 by default; higher for attack-speed fantasies (Lorcan [1.25]), lower for heavy hitters (Pillar [0.75]).
- **Slow** applies the same formula in reverse.

### 2.4 Abilities: interval, cast time and budget
- **Every hero has a unique base cast interval and cast time:** instant (0s), quick (~0.5s), heavy (~1–1.5s).
  - No attacks during the cast. A stun during a cast cancels it with half charge back. The attack timer restarts after a cast. INT never shortens the wind-up.
- **Ability budget = share of the hero's output per second.** Targets: attacker 25%, balanced 40%, caster 65%; heroes can deviate on purpose (Nettle 25%).
- **Casters get weak, cantrip-level basic attacks** (Faelan: 1d4 + half INT). Warlocks are the exception.

### 2.5 Charge
- **Time is the reliable base,** scaled by INT. **Attacks add a little ([1] per basic attack); taking hits adds more** ([60] for losing your whole max HP, before armor). Ward-absorbed, dodged and self-inflicted hits count.
- **INT = cast rate:** +[10%] passive charge gain per INT modifier (time part only). **CHA = starting charge:** +[10] per CHA modifier, capped at [50].
- Stun pauses all charge. The one-cast-per-second rule is the backstop.

### 2.6 Keyword mechanics in the model
- **Burn:** value per second for 3s; a new Burn replaces the old one. Fire: big, short, doesn't stack.
- **Poison (from `v0.25_design_direction.md` §4, unchanged):** cards say "Inflict 1d4 poison" or "Inflict 1 poison." Poison deals its value per second, then drops by 1 (4 poison = 4+3+2+1 = 10). New poison adds to the existing value.
  - Balance note, not a rule: one application of p poison deals p(p+1)/2, so big single applications grow fast. Each hero's poison amount is tuned in the balance sheet.
- **Hex / Hunter's Mark:** extra dice per attack on the marked foe (Hex +1d6, Colossus Slayer +1d8), from T2.
- **Ki:** per hit, up to [4]; the ability spends it all for +1 die each, from T2.
- **Rage:** stacks from hits, up to [2 + tier]. Zark: each Rage gives half his CON modifier in HP per second. Pillar: cashed in at 0 HP as a draining second health bar (not yet in the sheet).
- **Advantage:** about +18% ability value (Zark's Reckless Swing).

### 2.7 How to read hero requests
- "More of an auto attacker": lower the ability share; shorten the base attack interval; raise the attack speed ratio if attack speed is their fantasy; tune the attack die and bonus; cut ability dice to keep total output level; make the ability quicker and cheaper; slightly more charge per attack.
- "More of a caster" is the same list in reverse.

### 2.8 Where the cast stands (ability share of output, T1 → T4)

| Hero | Share | Target | Note |
|---|---|---|---|
| Arthur | 21% → 25% | 25% | ✓ an attacker |
| Lorcan | 26% → 32% | 25% | close; with Hunter's Mark the top attacker |
| Wallaby | 42% → 49% | 40% | close |
| Naill | 30% → 39% | 40% | ✓ with Ki |
| Zark | 41% → 49% | 40% | ✓; regen halved |
| Pillar | 33% → 40% | 40% | ✓; Rage bar not yet modeled |
| Nettle | 21% → 24% | 25% | ✓ blaster with a curse |
| Lumen | 42% → 37% | 40% | ✓; all damage is Radiant, so it all lands |
| Faelan | 64% → 68% | 65% | ✓; Ward 3.9 → 14.4 per second |
| Brother Jamison | 39% → 45% | 40% | ✓ heal measured as output |
| Rosalind | 26% → 37% | 65% | buff valued on an average ally; far more on a carry |
| Mother Laurel | 36% → 42% | 40% | ✓ after the fix; drain heals 2.7 → 9.8 per second |
| Sir Dane | 21% → 30% | 40% | taunt value not counted |
| Juniper | 18% → 26% | 40% | root value not counted |
| Bram | ~37% | 40% | heal measured as output |
| Zoe | 36% → 39% | 40% | ✓ supplies measured as healing |
| Toot | 66% → 64% | 65% | ✓ Mote damage counted as his |
| Gilthrax | 32% → 37% | 40% | ✓ plus taunt (2.2 → 6.1 redirected per second); Retort not counted |
| Velith | 35% → 40% | 40% | ✓ flat poison (2 + tier) |
| Cinder | 66% → 70% | 65% | ✓ about 15 effective damage per second at T4 |
| Gains | 64% → 66% | 65% | ✓ about 13.5 effective damage per second at T4 |
| Corvin | 37% → 38% | 40% | ✓ about 15 effective damage per second at T4, like Naill |
| Saint | 24% → 26% (heal only) | 40% | ✓ with the Double: heal 1.4 → 4.6, Double absorbs about 2.9 → 7.7 and deals about 2 → 6 per second |
| Kaska | 37% → 44% | 40% | ✓ heals 1.6 → 6.2 per second to the lowest-HP ally |

Other findings:
- **Resistance eats about 40–45% of damage** at a reference enemy (AC 15 / SR 14). Radiant heroes (Lumen, Dane's smite) skip that entirely.
- **A lone tank survives about 10–14s** against an act's enemies, so tanks need support. Zark survives longer through regen.
- **Control and support value (new measures):**
  - Dane's taunt redirects about 2.7 → 8 enemy damage per second onto himself.
  - Pillar's stuns prevent about 2.7 → 7.7 enemy damage per second; his Rage bar is 56 / 98 / 150 HP at T2 / T3 / T4 and adds up to 3–4s of survival.
  - Juniper's root keeps about 0.75–0.8 enemies rooted; its cast Disadvantage prevents only about 0.3–0.8 per second. Root's main value (movement denial) isn't modeled.
  - Mother Laurel's drain (her Verdant Strike only) heals about 2.7 → 9.8 per second across herself and one adjacent ally, after the fix below.
  - Gilthrax survives alone about 14 → 12s, the best of the tanks, with Ward 2.2 → 7.9 per second.
- **The encounter numbers are placeholders.** Real enemy stat blocks come in the encounter pass.

---

## 3. Tiers, keywords, verbs and ancestry

### 3.1 Tier 1 and the keyword
Tier 1 does one thing, with **no keyword**. **Tier 2 unlocks the class keyword,** and the hero's T2 choice decides how it works for them.

### 3.2 Keyword rules
Every keyword has a **generic version** (multiclassing, items, perks) and **hero versions** (each hero's T2 choice).

| Keyword | Class | Universal rule and generic version |
|---|---|---|
| Action Surge | Fighter | Triggered. Generic (draft): every [5th] attack, immediately attack again. |
| Channel Divinity | Cleric | Each cleric picks their own version. Generic: a once-per-fight burst heal. |
| Arcane Recovery | Wizard | **"Gets X charge back when Y."** Generic: "Gets X charge back after using their ability." |
| Sneak Attack | Rogue | Triggered; a bonus hit on a cooldown. **Generic: triggers on a foe affected by control (Rooted, Slowed, Stunned or Taunted).** |
| Smite | Paladin | The Paladin keyword. Generic (draft): every 3rd melee hit adds Radiant dice. |
| **Aura** | **Generic** | Any fitting character, item or perk. Aura of Devotion and Aura of Warding are Paladin T3 cards. |
| Hunter's Mark | Ranger | One Mark per ranger; it moves when the target dies. |
| Wild Shape | Druid | Transformation: a temporary form in a **different role** than the base kit, with its own HP pool, set as a **percentage of the druid's max HP** so bonus HP carries into the form. |
| Bardic Inspiration | Bard | Adds a die to the ally's next ability d20. **It can't create a crit or save a fizzle.** |
| Rage | Barbarian | **Stack type: gain Rage when hit (self-damage counts).** What Rage does is the hero's version (Zark: regeneration; Pillar: a cash-in second health bar). Generic (draft): regeneration. |
| **Ki** | Monk | **Resource type (model B): gain 1 Ki per hit dealt, up to [4]; your ability spends all of it.** Generic: +1 die to your ability per Ki spent. |
| **Hex** | Warlock | **Mark type: one Hex per warlock; it moves when the target dies. The Hexed foe takes +1d6 from your hits and rolls its abilities with Disadvantage.** Generic: the same. |

### 3.3 Combat verbs
**Every hero is designed around one or two verbs. Every keyword is attached to a verb.** Multiclassing, items and perks become a matching problem.

**Definition:** an **attack** is a basic attack only. A **hit** is any instance of damage, ability hits included.

| Verb | What counts |
|---|---|
| **Attack** | Making a basic attack |
| **Cast** | Using their ability |
| **Get hit** | Being attacked: taking hits, absorbing, dodging |
| **Heal** | Restoring an ally's HP |
| **Protect** | Giving Ward or shields, or standing between enemies and allies |
| **Control** | Applying Root, Slow, Stun or Taunt |
| **Afflict** | Applying a lasting effect to a foe: Poison, Burn, Mark, Hex |
| **Finish** | Hitting wounded foes and getting kills |
| **Empower** | Giving allies charge, speed, dice or buffs |
| **Transform** | Entering a form |
| **Stack** | Building a resource and spending it (Ki, Rage, stacks) |
| **Advantage** | Rolling with Advantage, yourself or by granting it to allies |
| **Disadvantage** | Making foes roll with Disadvantage |

- **Advantage and Disadvantage are separate verbs** with different hosts and payoffs. Counting payoffs ("X times") should match the uptime of realistic sources.
- **Payoff ideas for the perk decks:** "When you roll with Advantage, +1 die," "Roll with Advantage 3 times: your next cast crits," "Foes rolling with Disadvantage take +X from your hits," "When a foe fizzles, gain charge." Bard, Warlock and Wizard decks first.
- **Two ways to place a keyword:** **amplify** (match the primary verb) or **patch** (cover a missing verb). Offer both.

### 3.4 Ancestry perks (Tier 3 deck)
- **No hero has an innate ancestry passive.** Ancestry perks are T3 deck cards for heroes of that ancestry.
- **Proposed:** each T3 offer is 2 class (or multiclass) cards plus 1 guaranteed ancestry card. Useful against any enemy, about as strong as the median class perk.

| Ancestry | Perk (draft) | Effect |
|---|---|---|
| Dwarf | Dwarven Toughness | Big max-HP boost that grows with CON. |
| Elf | Elven Accuracy | Ability rolls with Advantage (constant). |
| Halfling | Lucky | A Low-band ability roll is rerolled once. |
| Human | Ambitious | +1 to every attribute. |
| Half-Orc | Relentless Endurance | Triggers Last Stand, and every attack during the window crits. Includes Savage Attacks. |
| Gnome | Gnome Cunning | +2 to ability rolls and +2 SR. |

---

### 3.5 Metamagic without sorcery points (approved)
- **Metamagic is the Sorcerer keyword, and its verb is Cast:** it changes the *shape* of a hero's ability, not its numbers.
- **Generic (multiclass) version:** pick one option for your ability.
  - *Twinned:* also hits a second target for half the dice. Best on big single-target abilities (Alert Strike, Gilded Beam, Velith).
  - *Quickened:* no cast time, and a stun can't cancel it. Best on long wind-ups (Cinder, Gains, Zoe).
  - *Extended:* the ability's durations last [+2s]. Best on control and buffs (Dane's taunt, Juniper's root, Rosalind, Jamison's Bond).
  - *Empowered:* rerolls 1s and 2s on the ability's dice. Best on dice-heavy abilities.
  - *Distant:* [+1] range. Best on short-range casters.
- **Sorcerer T3 deck:** perks key off "has Metamagic" or "when you cast," so a multiclassed hero opens the deck too.
  - Examples: *Metamagic Adept* (learn a second option), *Tides of Chaos* (once per fight, roll your ability with Advantage), *Draconic Resilience* (AC and HP), *Elemental Affinity* (add CHA to one of your ability's damage rolls).
- Values are checked in the sheet when a hero takes one.

## 4. Heroes

Quests are being reworked elsewhere, so quest rewards are mostly left out here.

### Arthur · Human fighter, Battle Master · Damage · melee
**Verbs:** Get hit (dodge), Finish.
- **Passive: Alert.** Starts each fight with [+25] charge.
- **T1: Alert Strike** (instant). Dodges all attacks (not spells or area effects) for about 1.5s, then a guaranteed critical strike: **1d8 doubled (2d8) per tier + STR**, +1 die per attack dodged (max +3).
- **T2, Action Surge:** *Ready First* (Surge at fight start) or *Second Wind* (Surge below half HP: heal and refill charge).

### Bram · Dwarf cleric, Life Domain · Tank/Support · melee
**Verbs:** Heal, Get hit.
- **Attack:** Warhammer, 1d8 + STR.
- **T1: Cure Wounds.** Heals the closest injured ally [2d4 per tier] + WIS, and heals Bram for half.
- **T2, Channel Divinity:** *Preserve Life* (once per fight, when an ally drops below a third, heal every ally below half) or *Turn the Faithless* (a Radiant burst around him).

### Faelan · Elf wizard, Abjuration · Support · range [3]
**Verbs:** Protect, Cast.
- **Attack:** Ray of Frost, **1d4 + 1** (half INT), cold. A cantrip, kept weak on purpose.
- **T1: Shield.** Wards the ally at the lowest HP % (herself included) for **4d10 per tier** + INT. A new Shield replaces the old Ward if it's bigger.
- **T2, Arcane Recovery:** *Spell Weave* (5 charge back per hit her Ward absorbs, up to 3 per Shield; flat) or *Shared Recovery* (her charge back goes to the Shielded ally).

### Wallaby · Halfling rogue, Thief · Damage · range 2
**Verbs:** Finish, Cast.
- **Attack:** thrown dagger, 1d4 + DEX.
- **T1: Dagger Toss.** [2 / 3 / 4] daggers at the lowest-HP foe within 3 squares, each **2d4 per tier** + DEX. If a dagger kills, the rest move on. Each dagger is a hit, not an attack.
- **T2, Sneak Attack** (his own version): *Cutthroat* (foes below half HP; kills refund 60 charge) or *Pickpocket* (foes an ally is also attacking; kills steal 1 gold).

### Sir Dane · Human paladin, Devotion · Tank · melee
**Verbs:** Control (taunt), Get hit.
- **T1: Compelled Duel.** Taunts the deadliest foe within 3 squares for about [2 / 3 / 4]s and smites it for small Radiant dice.
- **T2, Smite:** *Duelist* (every 3rd melee hit on his taunted foe smites) or *Retribution* (each hit his taunted foe lands on him makes his next attack smite).
- **The cast's only taunt tank.**

### Lorcan · Half-elf ranger, Hunter · Damage · range 4
**Verbs:** Attack, Afflict.
- **Attack:** Longbow, 1d8 + DEX. **Attack speed ratio [1.25].**
- **T1: Twin Shot** (instant). Every attack fires 2 arrows for [3 / 4 / 5]s; a crit also doubles arrow dice.
- **T2, Hunter's Mark** (WIS is the Mark's flat bonus): *Colossus Slayer* (highest-HP foe, +1d8 per hit) or *Horde Breaker* (Mark jumps on death; next attack also hits an adjacent foe).

### Juniper · Gnome druid, Circle of the Land · Tank/Support · melee
**Verbs:** Control (root), Get hit.
- **Attack:** Shillelagh, 1d8 + WIS bludgeoning. **Stats (proposed):** about [115] HP, [13] AC.
- **T1: Entangle.** Roots foes within [2] squares for [2 / 2.5 / 3]s and deals small dice (area).
- **T2, Wild Shape into Briar form** (a thorn-covered badger, proposed): when Entangle roots 2+ foes, about 6s, form HP [40%] of her max. *Bramble Guard* (Tank: big form HP, Thorns) or *Bramble Stalker* (Damage: her hits inflict 1 poison; rooted foes Slowed).

### Rosalind · Human bard, Lore · Support · range 3
**Verbs:** Empower, Cast.
- **Attack:** Vicious Mockery, 1d8 + CHA psychic.
- **T1: Inspiring Verse: the speed buffer.** The closest ally (herself only if alone) is **Inspired** for 2d4 + 4 s (effectively always on): attacks **20% faster, +5% per tier (35% at T4)**. **High Inspires a second ally; a natural 20 Inspires the whole party.**
- **T2, Bardic Inspiration (caster enabler):** *Muse* (the Inspired ally adds the die to their next ability d20) or *Encore* (Inspired allies gain charge faster).
- **On-hit damage** is saved for a future character. **Natural pairing:** Lorcan.

### Zark · Half-Orc barbarian, Totem Warrior · Damage/Tank · melee
**Verbs:** Get hit, Stack, Advantage.
- **Attack:** Greataxe, 1d12 + STR.
- **T1: Reckless Swing.** Sweeps every adjacent foe for **[2d12 per tier]** (area) and costs him **[1d6 per tier]** of his own HP. **The swing's d20 rolls with Advantage** (5e's Reckless Attack). **No taunt.**
- **T2, Rage:** gain 1 Rage when hit (self-damage counts), up to [2 + tier]. Each Rage gives **half his CON modifier** in HP per second. *Bear Totem* (regen doubled) or *Wolf Totem* (on gaining Rage, adjacent allies attack faster for [4]s).
- The cast's first **Advantage host**.

### Naill · Wood Elf monk, Open Hand · Damage · melee
**Verbs:** Attack, Stack.
- **Attack:** Unarmed Strike, 1d6 + DEX, ~0.95s.
- **T1: Flurry of Blows** (instant). [2 / 3 / 4] rapid strikes, each a hit with tier dice + DEX.
- **T2, Ki (model B):** 1 Ki per hit, up to [4]; Flurry spends it all for +1 die each. *Stunning Strike* (3+ Ki: the last strike stuns) or *Step of the Wind* (3+ Ki: he first leaps to a back-line foe).

### Nettle · Halfling warlock, The Fiend · Damage · range [3]
**Verbs:** Afflict, Attack, Disadvantage.
- **Identity:** a **blaster with a curse** (target share 25%).
- **Attack:** Eldritch Blast, 1d10 + CHA force. A warlock's cantrip is their core.
- **T1: Hellfire Curse.** [2d6 per tier] + CHA fire and **Burn** ([2.5 per tier] per second for 3s).
- **T2, Hex:** +1d6 from her hits and Disadvantage on the Hexed foe's abilities. *Dark One's Blessing* (killer of a Hexed foe gains a Ward) or *Hellfire Pact* (Hexed foes explode on death; the Hex jumps).

### Pillar · Goliath barbarian, Zealot · Tank/Damage · melee
**Verbs:** Get hit, Stack, Control (stun).
**Fantasy:** the slowest, heaviest hitter in the cast (inspired by Dota's Tiny). Every swing is an event, and when he "dies," he's just getting started.
- **Attack:** Maul of Faith, [2d8 per tier] + STR every **[2.4s]**, the slowest base interval in the cast. **Every hit stuns for [0.5s].** One stun per swing; the 1s stun immunity keeps him from locking a target alone.
  - The stun opens a window for the team: allies' melee hits on a stunned foe crit, and generic Sneak Attack triggers. A strong reason to put him beside Arthur, Naill or Wallaby.
  - **Attack speed ratio [0.75]:** attack speed items do less for him; his speed comes from Rage.
- **T1: Toss.** Grabs an adjacent foe and hurls it up to [3] squares toward the enemy back line. It lands for [2d10 per tier] (dice only) on the thrown foe and anything it lands next to, **stunning them for [1s]**. Throws their front line into their casters.
- **T2: Rage (his version: the cash-in).** Gains +1 Rage each time he's hit, up to [2 + tier]. **When he reaches 0 HP, he doesn't die:** all his Rage becomes a **second, draining health bar** of [1d10 per tier + CON] per Rage, draining about [10%] per second, and he **attacks [+50%] faster** while it's up. When it empties, he falls.
  - It replaces the generic Last Stand for him; once per fight. Wards absorb before the Rage bar; heals on him extend it.
  - About 40% of his max HP at T4 with full Rage. The more they hit him, the scarier his "death."
  - *Unbreakable:* the bar is [50%] bigger and drains slower.
  - *Avalanche:* during the Rage bar, every hit stuns and splashes to adjacent foes.
- **Removed:** the crowd taunt, the High-roll Zealot Rage, the natural-20 stun line, Living Beacon.

### Mother Laurel · Wood Elf paladin, Oath of the Ancients · Tank · melee
**Verbs:** Heal, Get hit.
**Fantasy:** the sustain paladin who drains life to keep the front line standing. (Adjacent roots are Juniper's lane.)
- **Attack:** Verdant Glaive, 1d8 + STR.
- **T1: Verdant Strike.** Every [10s] base. Strikes her target for [3d8 per tier] + STR and **heals herself and each adjacent ally for half the damage dealt.** (Half of a rolled amount is a conversion, like Bram's self-heal; a 50% lifesteal stat is not, so it's gone.)
- **T2, Smite (Ancients version):**
  - *Ensnaring Smite:* every 3rd melee hit smites and **roots** the target. A control payoff for generic Sneak Attack and a front-line duo with Wallaby or Naill.
  - *Warding Smite:* each smite gives the adjacent ally a small Ward.
- **Aura of Warding** (+SR to adjacent allies, the anti-caster aura) becomes a **Paladin T3 card**, alongside Aura of Devotion.
- **Removed:** both keywords at T1, the 50% lifesteal, the adjacent-root Nature's Wrath.
- **Balance fix (2026-11-23):** she sat at 27–32% of output against a 40% target, and her drain only counted Verdant Strike. Dice went 2d8 → **3d8 per tier** and the base cast interval 11.5s → **10s**. Now 36% → 42%, healing 2.7 → 9.8 per second split across herself and an adjacent ally: a real sustain tank, about Bram's level.

### Lumen · Aasimar warlock, The Celestial · Damage · range [3]
**Verbs:** Attack, Afflict, Disadvantage.
**Fantasy:** lines of light and a ramp that builds through the fight. (Nettle is Burn, explosions and the curse.)
- **Radiant rule:** Radiant ignores AC and SR and **never gets a flat bonus**. Smaller dice, but every point lands.
- **Attack:** Sacred Beam, 1d6 Radiant.
- **T1: Sunbeam.** A piercing line through his target: [2d6 per tier] Radiant to every foe in the line (area, dice only). Rewards lining enemies up on the narrow map.
- **T2, Hex (Celestial version):** universal Hex (+1d6, Disadvantage) plus:
  - *Searing Focus:* each time a Hexed foe dies, he attacks [10%] faster for the rest of the fight.
  - *Healing Light:* his attacks heal the lowest-HP ally for half the damage dealt.

### Brother Jamison · Human cleric, Peace Domain · Support · melee
**Verbs:** Empower, Heal.
- **Attack:** Quarterstaff, 1d6.
- **T1: Emboldening Bond.** Bonds the closest ally (two on High, the whole party on a natural 20) for [10]s. Bonded allies **add 1d4 to their ability rolls** (5e's Emboldening Bond; can't create a crit or save a fizzle) and are healed [2d4 per tier] + CHA.
  - A d4 on the roll is worth about 6–7% of an ability: a rider, which is why the Bond also heals.
- **T2, Channel Divinity (Peace version):** *Balm of Peace* (once per fight, when an ally drops below half, heal the whole party) or *Protective Bond* (when a bonded ally takes a hit over [X], Jamison takes it instead).
- **Removed:** the Gentle Strike passive and the 30% share mechanic.
- **Overlap note:** Rosalind's Muse also adds a die to rolls, but only at T2 via Inspiration; Jamison's is smaller (d4) and constant while bonded.

### Zoe · Human fighter, Rune Knight · Support · melee
**Verbs:** Empower, Protect.
**Fantasy:** the quartermaster-smith with a bottomless pack, who knows exactly what you need mid-fight.
- **Attack:** Runed Hammer, 1d8 + STR every **[1.35s]**. Attack speed ratio [0.9].
- **T1: Rummage.** Cast every [10.5s], cast time [0.75s] (she digs). Tosses an ally a **supply** picked by need, not at random:
  - lowest HP % → *Potion:* heals [3d6 per tier] + INT;
  - taking the most hits → *Spare Shield:* Ward of [3d6 per tier] + INT;
  - otherwise → *Whetstone:* their next [3] attacks deal +[1d6 per tier].
  - Low: one ally. High: two allies. Each ally holds one supply at a time; a new one replaces it. (No "items for the rest of the fight": that snowballs across 12 casts.)
- **T2, Action Surge (Emergency Quartermaster):** the first time each fight an ally drops below half HP, she instantly Rummages for them, free.
  - *Rune Carver:* supplies are runed and roll twice the dice.
  - *Just the Thing:* an ally who uses a supply gains [15] charge.
- **Removed:** random Common items, refreshing once-per-fight items, the +25% charge-speed path.

### Toot · Plasmoid bard, College of Creation · Support · range 4
**Verbs:** Empower.
**Fantasy:** a stationary gelatinous trumpeter who plays for tips and makes his friends' big moments bigger.
- **Attack:** Brass Solo, a **pulse of [1d4 per tier] Thunder to every foe within 1 square** (area, dice only) every **[1.6s]**, attack speed ratio [1.1]. He never moves and never picks an enemy target; the pulse just goes off. It counts as an attack for charge only when it hits something.
  - Placement is the choice: up front he deals area damage and gets hit (charge, but risk); in the back he's safe and only plays Fanfare.
- **T1: Fanfare.** Cast every [8.5s], cast time [0.25s]. Sends a **Mote of Potential** to the closest ally with an ability: their next ability deals **+[4d8 per tier] + CHA**. Low: one ally. High: two. Natural 20: everyone.
  - **The Mote's dice are part of the ally's roll, so the ally's crit doubles them.** That's the combo: Mote a hero whose ability already crits (Arthur's Alert Strike, Velith out of Stealth).
  - One Mote per ally; Toot picks allies without one. It's his whole output (64–66%), which is why the dice are big.
- **T2, Bardic Inspiration (Creation version):** the Mote also adds its die to the ally's d20 roll.
  - *Busker's Rhythm:* +[10%] attack speed for Toot per Gold earned this fight.
  - *Street Performer:* allies who roll High or a natural 20 while holding a Mote pop +1 Gold.
- **Overlap:** Rosalind speeds allies up; Jamison adds a d4 to rolls and heals; Toot adds raw damage to one big moment.

### Gilthrax · Gold Dragonborn fighter, Eldritch Knight · Tank · melee
**Verbs:** Protect, Get hit, Afflict (Burn).
**Fantasy:** the gilded bodyguard whose Ward explodes into dragonfire when they break it.
- **Attack:** Gilded Greataxe, 1d10 + STR every **[1.75s]**, attack speed ratio [0.85].
- **T1: Arcane Shield.** Cast every [11.5s], cast time [0.4s]. Wards himself for **[2d10 per tier] + CON** and **taunts adjacent foes for [1.5s]**. Low: Ward only. High: taunt [2.5s].
  - A crowd taunt, short. Dane's is one long duel; Gilthrax's grabs whoever's touching him.
- **T2, Action Surge (Dragon's Retort):** when his Ward breaks, he breathes fire in a cone for **half the damage it absorbed**, plus Burn of [1d4 per tier]. The harder they hit the shield, the bigger the breath.
  - *Gilded Hoard:* +[3] Ward per equipped item (+[6] for Rare or better). Flat, so gear makes him tankier without hidden multipliers.
  - *Bodyguard's Fee:* each breath gives adjacent allies [20] charge.
- **Removed:** Ward "scaling with item value" at T1 (moved to Gilded Hoard as flat Ward), the natural-20 instant breath.

### Velith · Drow rogue, Assassin · Damage · melee
**Verbs:** Finish, Afflict (Poison).
**Fantasy:** the killer who vanishes, reappears behind you and finishes the wounded.
- **Attack:** Venom Dagger, 1d6 + DEX every **[1.0s]**, attack speed ratio [1.15].
- **Assassinate (passive):** starts every fight in Stealth for [3s]; her first strike crits.
- **T1: Cloak of Darkness.** Cast every [9s], cast time [0.2s].
  - Low: strikes her target for [2d6 per tier] + DEX and **inflicts [2 + tier] poison** (3 / 4 / 5 / 6).
  - Mid: **vanishes into Stealth, reappears behind the lowest-HP foe in reach and strikes; out of Stealth, so it crits** (4d6 per tier).
  - High: as Mid, and the poison is inflicted twice.
  - Natural 20: as High, and a foe left below [25%] HP is executed.
- **T2, Sneak Attack (Venomous Strike):** her hits on Poisoned foes deal +1d6 and **inflict 1 poison**. At her 1s attack interval that matches poison's decay, so she holds a stack in place by attacking.
  - *First Blood:* Advantage on her first ability roll each fight.
  - *Nightshade Vials:* Poisoned foes are Slowed [15%]. That's control, so it also triggers everyone's generic Sneak Attack.
- **Removed:** Exposed (undefined), the chain-to-a-second-foe leap.
- **Overlap:** Wallaby throws daggers from range 2 at the lowest-HP foe; Velith is a melee diver who stacks Poison and executes.

### Cinder · Tiefling sorcerer, Draconic Bloodline · Damage · range 4
**Verbs:** Cast.
**Fantasy:** the big-spell pyromancer. A long wind-up, then the biggest blast in the cast.
- **Attack:** Fire Bolt, 1d6 + 1 (cantrip-level) every **[1.8s]**, attack speed ratio [0.95].
- **T1: Fireball.** Cast every [12.25s], with the longest wind-up in the cast, **[1.25s]** (a stun cancels it). Hits the densest clump: the target and every foe next to it take **[6d6 per tier]** (area, dice only).
  - Low: only the target. High: the blast reaches foes 2 squares from the center.
  - The answer to her is stuns and divers; the reason to protect her is that one landed Fireball swings the fight.
- **T2, Metamagic (Draconic version):**
  - *Twinned Spell:* Fireball also hurls a second blast at the next-densest clump for half the dice.
  - *Empowered Spell:* Fireball rerolls every 1 and 2 (shown on the dice).
- **Overlap:** Nettle is the fast curse-and-Burn blaster at 25%; Cinder is one huge spell at 65%, with no Burn.
- **Removed:** the Sorcery pip bar, Burn on Fireball, the natural-20 Burn detonation, Exposed.

### Gains · Tiefling wizard, Transmutation · Damage · range 4
**Verbs:** Cast, Finish.
**Fantasy:** the calculating alchemist whose beams turn enemies into gold.
- **Attack:** Alchemical Bolt, 1d6 + 1 (cantrip-level) every **[1.7s]**, attack speed ratio [1.05].
- **T1: Gilded Beam.** Cast every [9.75s], cast time [1.0s]. A force beam at the foe with the most HP for **[5d8 per tier] + INT**, which marks it **Gilded**: a Gilded foe drops +1 Gold when it dies.
  - Low: no mark. High: also Gilds a foe next to the target.
  - He targets the biggest foe, so the gold arrives late in a fight. Velith and Wallaby finish the weak ones; Gains softens the tank.
- **T2, Arcane Recovery (Transmutation):** whenever Gold drops in combat, he gets [15] charge back.
  - *Compound Interest:* +1 to his ability rolls per 10 Gold held (max +5).
  - *Liquid Assets:* his charge back also gives [10] charge to every ally.
- **Removed:** the "+ half Gold held" damage bonus at T1, the natural-20 board-wide Gild.

### Corvin · Human ranger, Gloom Stalker · Damage · melee
**Verbs:** Attack, Finish.
**Fantasy:** the ambush hunter who opens every fight with a blur of steel. (Lorcan is the ranged on-hit ranger; Corvin is the melee one.)
- **Attack:** Twin Shortswords, **two strikes** of 1d4 + DEX, one every **[0.9s]**, attack speed ratio [1.2]. Each strike is its own hit, so on-hit effects trigger twice as often as on anyone else.
- **Dread Ambusher (passive):** starts every fight with [50] charge, so his first ability lands in the opening seconds.
- **T1: Dread Ambush.** Instant (no cast time), every [8.75s]. Unleashes [3] strikes at his target for **[1d8 per tier] + DEX** each, every one a hit with on-hit effects. Low: 2 strikes. High: 4.
- **T2, Hunter's Mark (Gloom Stalker version):** Dread Ambush Marks its target; his hits on the Marked foe deal +1d4.
  - *Stalker's Flurry:* every 3rd basic attack on the Marked foe adds a third strike.
  - *First Strike:* a Dread Ambush in the first [5s] of a fight gives every ally [15] charge. The ambush-team enabler.
- **Weakness by design:** front-loaded. Long fights against sustain wear him down.
- **Removed:** Stealth on Mid+ (Velith owns Stealth), the natural-20 Shadow Echo.

### Saint · Half-Elf cleric, Trickery Domain · Support · range 4
**Verbs:** Protect, Heal.
**Fantasy:** the trickster priest whose illusions take the hits meant for his friends. Dane protects by forcing a duel; Saint protects with decoys.
- **Attack:** Toll the Dead, **1d8 magic, or 1d12 against a wounded foe** (the die visibly swaps), every **[1.85s]**, attack speed ratio [0.9].
- **T1: Mirror Blessing.** Cast every [11.25s], cast time [0.3s]. Heals the ally at the lowest HP % for **[2d8 per tier] + WIS** and summons a **Double** of them on the nearest empty square.
  - The Double copies the ally's **basic attack only** (no ability, no keywords) and lasts [5s] or until destroyed.
  - It's fragile: its HP is **[20%] of the ally's max HP**. (Low HP does the job of "takes increased damage" without a hidden damage multiplier.)
  - When it appears, it **taunts every foe that was targeting the ally for [1.5s]**. They switch to the Double, the ally gets breathing room and the heal sticks.
  - Low: no taunt. High: the Double lasts [8s].
- **T2, Channel Divinity (Trickery version):**
  - *Invoke Duplicity:* Doubles also copy the ally's ability once when they appear (at the Low result).
  - *Cloak of Shadows:* when a Double is destroyed, the ally gains Stealth (their next strike crits).
- **Removed:** Necrosis on Toll the Dead (not in the v0.25 rules), Stagger and Expose.

### Kaska · Half-Orc druid, Circle of the Moon · Damage/Support · melee
**Verbs:** Attack, Heal, Transform.
**Fantasy:** the moon druid who leaps on the enemy's back line and feeds the pack. (Juniper is the rooting front-line druid.)
- **Attack:** Moon Sickle, 1d8 + STR every **[1.25s]**.
- **T1: Moonlit Pounce.** Cast every [9.25s], cast time [0.35s]. Leaps onto the farthest foe (their back line) for **[4d8 per tier] + STR** and **heals the lowest-HP ally for half the damage dealt**. Low: no leap (strikes her current target). High: also roots the target [1.5s].
  - A diver that heals from range. Laurel heals the ally beside her; Kaska heals whoever needs it, from deep in enemy lines.
- **T2, Wild Shape (Moon version):** after each Pounce, she shifts into a form for [6s] with its own HP, a percentage of her max HP, so anything that raises her HP raises the form too.
  - *Panther* (Damage): form HP [30%]; attacks [30%] faster, and every hit counts as a Pounce hit for the heal.
  - *Dire Bear* (Tank): form HP [60%], and taunts adjacent foes when she shifts.
- **Removed:** Exposed, starting every fight in Panther Form, the natural-20 party heal.

---

## 5. Changes to make to `v0.25_design_direction.md`
- §3: AC and SR show the value first, with the resist percentage on hover.
- §4: the full math model in §2 of this doc; the amounts/rates/durations rule; any ability score can be a damage bonus; Radiant never gets a flat bonus.
- §5, open Q1: no keyword at T1.
- §6: Aura is generic; Smite is the Paladin keyword; keywords have generic and hero versions; generic Sneak Attack triggers on controlled foes; Ki is model B; Hex gives Disadvantage; Rage builds from hits and each barbarian decides what it does; every keyword is attached to a verb.
- §8: the starting encounter (§1.13).
- §12: the d20 decision is answered. Every hero rolls; only Fizzle and Crit are standardized.
- New sections: Advantage and Disadvantage, control statuses, crits, Last Stand, hybrid roles, combat verbs, ancestry perks, targeting fallback, pack filters removed, Stealth.

## 6. Still open
- The guaranteed ancestry slot in the T3 offer.
- The range scale applied to the whole cast.
- Support starters and their intro fights.
- Root's movement-denial value in the sheet (needs positions; better done in the sim).
- Juniper's form creature (badger proposed).
- Generic versions for Action Surge, Smite, Rage and Metamagic.
- Verb profiles in the sim; porting the math into the game's sim (needs repo push access).
- Real enemy stat blocks and the encounter pass (hit profiles, solo intro fights).
