# Basements & Basilisks v0.25 — 48-Hero Roster Expansion Spec (25 New Heroes)

**Date:** 2026-11-28  
**Status:** Locked by Luke — names, pronouns, ancestries, art briefs, class-feature contracts, and bug guardrails finalized. Ready for Phase 2 testbench rollout on go-ahead.  
**Builds on:** `HANDOFF.md` §5 (locked v0.25 class-feature contracts, linear resistance `R/(R+20)`, half-point ability modifiers, `50%` Evasion hard cap, `attackGrowth = 1`, no hidden multipliers).  
**Art Style Anchor (`basements-basilisks-art`):** Low-poly vector geometry, sharp A-frame silhouettes, exaggerated proportions, featureless faces, flat high-contrast colors, dynamic action poses.

---

## 1. Roster Expansion Summary (23 Active → 48 Total)

Brings every D&D class from the current 23 active heroes (plus disabled *Toot*) to **4 heroes per class (48 total)**:

| Class | Active (23) | Planned (+25) | Total |
| :--- | :--- | :--- | :---: |
| **Barbarian** | Zark, Pillar | **Durn** (Dwarf), **Falcorn** (Aarakocra) | **4** |
| **Bard** | Rosalind | **Moxie** (Tiefling), **Corporal Tobbin** (Halfling), **Toot** (Plasmoid, rework) | **4** |
| **Cleric** | Bram, Brother Jamison, Saint | **Father Gorr** (Half-Orc) | **4** |
| **Druid** | Juniper, Kaska | **Thia** (Wood Elf), **Morel** (Human) | **4** |
| **Fighter** | Arthur, Gilthrax, Zoe | **Maxim** (Human) | **4** |
| **Monk** | Naill | **Vela** (Half-Elf), **Suna** (Human), **Burbrax** (Brass Dragonborn) | **4** |
| **Paladin** | Sir Dane, Mother Laurel | **Lady Malice** (Tiefling), **Petra** (Silverbrow Human) | **4** |
| **Ranger** | Lorcan, Corvin | **Tova** (Goliath), **Colony** (Tiefling) | **4** |
| **Rogue** | Wallaby, Velith | **Nix** (Gnome), **Rico** (Half-Elf) | **4** |
| **Sorcerer** | Cinder | **Ylowyn** (Gnome), **Hewitt** (Dwarf), **Chuk** (Half-Orc) | **4** |
| **Warlock** | Nettle, Lumen | **Leagues** (Sea Elf), **Malthrax** (White Dragonborn) | **4** |
| **Wizard** | Faelan, Gains | **Orlo** (High Elf), **Bellin** (Elf) | **4** |

### Job, Range & Ancestry Guardrails
- **Jobs (48 total):** 10 Frontline, 9 Brawler, 14 Attacker, 6 Caster, 9 Support.
- **Ranges (48 total):** 25 Melee (`1`), 4 Short (`2`), 12 Mid (`3`), 7 Long (`4`).
- **Ancestries:** Basic PHB ancestries only (Human, Elf/Sea Elf, Dwarf, Halfling, Gnome, Half-Orc, Half-Elf, Tiefling, Dragonborn), except Luke's explicit exceptions (**Aarakocra**, **Plasmoid**, **Goliath**, **Silverbrow Human**, plus existing **Aasimar**).

---

## 2. Shared Engine Primitives Required Before Implementation

All 25 kits rely on **6 reusable primitives** in `tools/testbench/engine.js` (gated so `prototype2` stays exact at **47.0%**):

| Primitive | Rule / Guardrail | Used By |
| :--- | :--- | :--- |
| **1. General Summons & Non-Blocking Pods** | Extends `summonDouble` for combat pets/constructs (Toot's Coin Soldiers, Tova's Falcon, Bellin's Flesh Homunculus), **untargetable** spectral companions (Father Gorr's Spiritual Weapon), and **non-blocking tile pods** (Morel's Mushrooms, capped at 5). | Toot, Father Gorr, Morel, Tova, Bellin |
| **2. Physical Bleed** | Physical DoT (`1/s`, **reduced by AC**). Distinct from Magic/SR Poison & Burn so AC stacking directly wins Durn's mutual-bleed duel; self-bleed has a `1 HP` floor. | Durn |
| **3. Necrosis** | `-50%` healing received for duration (bosses half duration). | Vela, Bellin (T2) |
| **4. Charge Steal** | Removes Charge from an enemy and grants it to an ally (`50%` share vs. Bosses, matching `bossControlShare`). | Nix |
| **5. Push & Brief Airborne Dive** | `1`-tile knockback + brief `0.8s` untargetable dive windup (short enough to dodge casts without dumping melee aggro onto backlines). | Falcorn, Leagues, Petra |
| **6. Ally Twincast & Key-Stat Overclock** | Reuses Cinder's `Twin Spell` hook for ally casts (safe fallback `+50%` dice / `2×` Ward/Heal on toggle abilities) + temporary `+N` bonus to an ally's `keyStat`. | Ylowyn, Hewitt |

---

## 3. Hero Specifications & Art Briefs (25 Planned Heroes)

*(All numeric values are starting design targets to be tuned in `tools/testbench/`.)*

---

### Barbarian (+2) — *Class Feature: Unlimited Rage (Never Grants Invincibility)*

#### 1. **Durn** *(he/him)*
- **Identity:** Dwarf · Path of the Battlerager · **Frontline** · Range `1` · Key `CON` (secondary `STR`) · Charge: Hit · Size: Medium (`100`) · `136 HP · 16 AC · 11 SR`
- **Art Brief:** Wide blocky Dwarf in head-to-toe ridged spiked plate + spiked helm, hunched forward mid-charge like a bowling ball of blades. *Palette:* Gunmetal, rust iron, blood crimson. *Vibe:* "If hugging hurts you more than me, I win."
- **Signature Verb:** *Stack AC & Out-Bleed*
- **Attack:** *Spiked Gauntlets* (`1d6 + STR` @ `1.6s`, melee; passive `1` Thorns per `4` AC).
- **Rage:** Unlimited stacks (`+1` when taking physical damage, `1s` CD). Every `2s`, deals `1` **Physical Bleed** per Rage stack to himself and adjacent foes (**reduced by AC**; self-bleed cannot drop him below `1 HP`). Never grants AC via Rage.
- **Ability — Spiked Hug (100):** Slams & Restrains target (`1 / 1.5 / 2s`) for `1d8`/tier `+ half AC` physical damage and applies `2 / 3 / 4` Physical Bleed.
- **T2 Specializations:**
  - *Ironhide Spikes (Vertical):* Thorns double (`1` per `2` AC) and Spiked Hug grants `2d6 + CON`/tier Ward.
  - *Bloodied Chicken (Pivot):* Below `50%` HP, gain `+2` Rage stacks immediately and heal `1d4`/tier whenever a Bleeding foe hits him.
- **Guardrail:** Bleed reads AC so building AC items wins the mutual-bleed game of chicken without self-suiciding in Fight 1.

#### 2. **Falcorn** *(he/him)*
- **Identity:** Aarakocra · Path of the Wildheart (Eagle) · **Attacker** · Range `1` · Key `STR` (secondary `DEX`) · Charge: Attack · Size: Medium (`100`) · `116 HP · 13 AC · 11 SR`
- **Art Brief:** Tall falcon-headed Aarakocra with swept V-wings tucked sharp into an arrowhead mid-dive, greataxe trailing behind. *Palette:* Slate brown, ivory feathers, ochre gold. *Vibe:* "Never looks down until he's already falling."
- **Signature Verb:** *Soar & Nosedive*
- **Attack:** *Talon Greataxe* (`1d8 + STR` @ `1.5s`, melee).
- **Rage:** Unlimited stacks (`+1` per dive, `+1` every 2 attacks, `+2` on kill); each stack adds `+1` attack and dive damage.
- **Ability — Falcon Dive (100):** Launches airborne briefly (`0.8s`, dodges projectiles/AoE) and nosedives the farthest enemy for `3d8 + STR`/tier physical `+ 2` per Rage stack (High: splashes half damage to adjacent foes + `1s` Stun).
- **T2 Specializations:**
  - *Apex Predator (Vertical):* Scoring a kill refunds `60` Charge and triggers a fresh Falcon Dive (`3s` CD).
  - *Gale Wings (Pivot):* Landing pushes adjacent enemies `1` tile away and grants `+25%` Evasion for `2.5s`.
- **Guardrail:** Brief `0.8s` flight window prevents enemy melee from dropping aggro onto your Act 1 backline.

---

### Bard (+3) — *Class Feature: Bardic Inspiration Die*

#### 3. **Moxie** *(they/them)*
- **Identity:** Tiefling · College of Swords · **Attacker** · Range `3` · Key `DEX` (secondary `CHA`) · Charge: Attack · Size: Medium (`100`) · `104 HP · 14 AC · 13 SR`
- **Art Brief:** Lean curved-horned Tiefling mid-spin juggling an arc of 4–5 gleaming throwing knives overhead; flared jester-coat tails & pointed tail whip. *Palette:* Scarlet skin, plum coat, bright silver. *Vibe:* "One more blade and the crowd stops breathing."
- **Signature Verb:** *Juggle Blades & Shred*
- **Attack:** *Juggled Dagger* (`1d4 + DEX` @ `1.2s`, range 3; throws `+1` extra `1d4` dice-only blade per juggle stack, max `3` extra blades at T1).
- **Bardic Inspiration:** `1d6`/tier die; when an ally spends it, they add `+1d6`/tier damage and toss `+1` extra blade into Moxie's juggle for the fight.
- **Ability — Cloud of Daggers (100):** Adds `+1` blade to the juggle, inspires `1` ally, and creates a `2×2` whirling blade zone (`3 / 4 / 5s`) dealing `1d6`/tier physical/s.
- **T2 Specializations:**
  - *Grand Finale (Vertical):* Raises max juggled blades to `5`; High rolls fan all juggled blades across `3` foes.
  - *Razor Encore (Pivot):* Whenever an ally spends Moxie's Inspiration, *Cloud of Daggers* pulses for `2d6`/tier across all foes inside.
- **Guardrail:** Extra juggled blades deal dice only (no flat DEX per extra blade) and attack-charge triggers per throw event, preventing DPS/charge runaway.

#### 4. **Corporal Tobbin** *(he/him)*
- **Identity:** Halfling · College of Valor · **Frontline** · Range `1` · Key `CON` (secondary `CHA`) · Charge: Hit · Size: Medium (`100`) · `120 HP · 17 AC · 13 SR`
- **Art Brief:** Compact grounded battle-weary Halfling footman with an oversized battered tower shield planted forward, brass rallying horn raised to his blank helmeted face, muddy cloak. *Palette:* Olive drab, worn steel, tarnished brass. *Vibe:* "Survived four sieges by refusing to take a step back."
- **Signature Verb:** *Hold the Shield Wall*
- **Attack:** *Shortsword & Buckler* (`1d6 + STR` @ `1.6s`, melee).
- **Bardic Inspiration (Combat Inspiration):** `1d8`/tier die spent **when attacked** to grant `1d8`/tier Ward (distinct from Rosalind's cast-spent die).
- **Ability — Rallying Horn (100):** Grants self + adjacent/same-row allies `+3 / +4 / +5` AC (`4s`, non-stacking) and `2d6 + CHA`/tier Ward, inspiring `1 / 1 / 2` allies.
- **T2 Specializations:**
  - *Hold the Line (Vertical):* Shield Wall allies also gain `+3` SR; Tobbin heals `1d6`/tier when an ally spends Combat Inspiration.
  - *Over the Top (Pivot):* When Shield Wall ends, shielded allies gain `+30%` Attack Speed for `3s`.
- **Guardrail:** Non-stacking AC buff prevents double-tank stall walls.

#### 5. **Toot** *(he/him — Rework)*
- **Identity:** Plasmoid · College of Creation · **Support** · Range `2` · Key `CHA` · Charge: Time · Size: Medium (`100`) · `112 HP · 13 AC · 14 SR`
- **Art Brief:** Existing Plasmoid portrait + **Coin Soldier** summon art (polygonal gold coin on stubby legs with tiny spear + round buckler). *Palette:* Translucent cyan, burnished gold. *Vibe:* "Every copper is an employee until the tavern closes."
- **Signature Verb:** *Animate Coins & Profit*
- **Attack:** *Brass Honk* (`1d4 + half CHA` @ `1.6s`, range 2).
- **Bardic Inspiration:** `1d6`/tier die; spending it heals all active Coin Soldiers `1d6`/tier and grants them `+25%` Attack Speed (`3s`).
- **Ability — Animate Gold (100):** Inspires `1` ally and animates `1` (High: `2`) **Coin Soldier** (`25%` Toot's HP, melee `1d6`/tier, **max `3` alive**). Every Coin Soldier surviving at fight end pays out **`+1g`**.
- **T2 Specializations:**
  - *Mint Condition (Vertical):* Raises Coin Soldier cap to `5` and starts every fight with `1` Coin Soldier already active.
  - *Golden Wall (Pivot):* Coin Soldiers gain `+3` AC, Taunt nearby foes `1s` on spawn, and explode for `2d6`/tier magic when destroyed.
- **Guardrail:** Explicit `3`-minion cap (`3g`/fight T1 max) keeps Act 1 shop economy intact while making protecting the coins a real tactical game.

---

### Cleric (+1) — *Class Feature: Channel Divinity (1/fight)*

#### 6. **Father Gorr** *(he/him)*
- **Identity:** Half-Orc · War Domain · **Brawler** · Range `1` · Key `STR` (secondary `WIS`) · Charge: Attack · Size: Medium (`100`) · `112 HP · 16 AC · 12 SR`
- **Art Brief:** Broad armored Half-Orc with heavy pauldrons, swinging a spiked warhammer forward while a glowing translucent floating **Spiritual Weapon** warhammer mirrors the exact arc behind him. *Palette:* Moss skin, charcoal plate, radiant amber. *Vibe:* "Two hammers, one prayer, zero subtlety."
- **Signature Verb:** *Sync-Strike Backline*
- **Attack:** *Warhammer* (`1d6 + half STR` @ `1.5s`, melee) synced with an **untargetable** *Spiritual Weapon* (`1d4` Radiant, no flat bonus, at the farthest enemy; vanishes if Father Gorr dies).
- **Channel Divinity (Guided Strike):** Triggers on first cast (or first enemy `<50%` HP); next synchronized Warhammer + Spiritual Weapon swings are **guaranteed Crits** and ignore Evasion.
- **Ability — War Priest's Command (100):** Slams both weapons immediately (`2d6 + STR`/tier melee + `2d6`/tier Radiant backline) and grants `+25%` Attack Speed (`3 / 4 / 5s`).
- **T2 Specializations:**
  - *Crusader's Mantle (Vertical):* Spiritual Weapon attacks splash `1d4`/tier Radiant to enemies adjacent to the backline target.
  - *War God's Blessing (Pivot):* Guided Strike also gives the closest ally a guaranteed Crit on their next cast/attack and restores Channel Divinity once per fight on a backline kill.
- **Guardrail:** Spiritual Weapon is strictly untargetable and carries pure Radiant dice (no flat stat bonus) so combined attack DPS stays inside Brawler bounds.

---

### Druid (+2) — *Class Feature: Wild Shape (No-Timer Bonus HP Bar)*

#### 7. **Thia** *(she/her)*
- **Identity:** Wood Elf · Circle of Wildfire · **Attacker** · Range `3` · Key `WIS` · Charge: Attack · Size: Medium (`100`) · `104 HP · 13 AC · 14 SR`
- **Art Brief:** Nimble hooded Wood Elf winding up a pitch with a blazing pinecone grenade, satchel of smoking acorns at hip. **Form Art (`Flaming Squirrel`):** arch-backed low-poly squirrel with a blazing orange flame tail mid-leap. *Palette:* Pine green, bark brown, ember orange. *Vibe:* "The forest regrows faster if you help it burn."
- **Signature Verb:** *Lob Pinecones & Go Squirrel*
- **Attack:** *Flaming Acorn* (`1d6 + WIS` @ `1.7s`, range 3, magic; `1d4` splash to adjacent foes + `2` Burn).
- **Wild Shape (Flaming Squirrel):** Fragile bonus HP bar (`2d8 + WIS`/tier, no timer) granting **`+45%` Attack Speed** while intact.
- **Ability — Pinecone Barrage (100):** Lobs `1 / 2 / 3` flaming pinecones (`2d6`/tier magic splash + `3` Burn) and enters **Flaming Squirrel** form (or restores `1d8`/tier form HP if already shifted).
- **T2 Specializations:**
  - *Nutty Barrage (Vertical):* While in Flaming Squirrel form, every 3rd attack throws a Giant Pinecone (`2d6`/tier `3×3` splash).
  - *Cauterizing Flame (Pivot):* Whenever a Burned enemy dies, heal the lowest-% ally `2d6`/tier and restore `1d8`/tier Squirrel form HP.
- **Guardrail:** Attacker (`charge: attack`) lets Flaming Squirrel `+45%` AS accelerate both throws and casts; direct AoE splash ensures high speed never wastes DPS on Burn overwrites.

#### 8. **Morel** *(they/them)*
- **Identity:** Human · Circle of Spores · **Caster** · Range `2` · Key `WIS` (secondary `CON`) · Charge: Time · Size: Medium (`100`) · `108 HP · 12 AC · 14 SR`
- **Art Brief:** Hunched wide-mantled Human wearing a giant spotted toadstool-cap cloak/hat, gnarled staff sprouting glowing fungi, mid-stride with spores drifting off shoulders. **Form Art (`Symbiotic Entity`):** glowing fungal-encrusted silhouette bursting with chartreuse spore-caps. *Palette:* Muddy umber, sickly chartreuse, bone cap. *Vibe:* "Doesn't mind dying—the mushrooms love the company."
- **Signature Verb:** *Grow Mushrooms & Overbloom*
- **Attack:** *Spore Bolt* (`1d4 + half WIS` @ `1.7s`, range 2, magic; spawns a **non-blocking Mushroom Pod** near target, **max `5`**; each pod pulses `1` Poison every `2s` at adjacent foes).
- **Wild Shape (Symbiotic Entity):** Bonus HP bar (`3d10 + CON`/tier, no timer); while intact, all Mushroom Pods apply `+2` extra Poison and pulse `50%` faster.
- **Ability — Symbiotic Bloom (100):** Enters **Symbiotic Entity**, spawns `1 / 2 / 2` Mushroom Pods, and triggers an immediate Poison pulse from every active pod.
- **T2 Specializations:**
  - *Spore Detonation (Vertical):* Spawning past the `5`-pod cap (or when Symbiotic Entity breaks) detonates pods for `2d6`/tier magic + `3` Poison in a `3×3` area.
  - *Mycelial Network (Pivot):* Allies standing near Mushroom Pods regenerate `1d4`/tier HP every `2s` while Symbiotic Entity holds.
- **Guardrail:** Non-blocking pods capped at 5 prevent grid pathing softlocks; trimmed `173` base EHP keeps Symbiotic Entity meaningful.

---

### Fighter (+1) — *Class Feature: Action Surge (Shared `actionSurge()`)*

#### 9. **Maxim** *(he/him)*
- **Identity:** Human · Arcane Archer (Crossbow Expert) · **Attacker** · Range `3` · Key `DEX` · Charge: Attack · Size: Medium (`100`) · `112 HP · 14 AC · 12 SR`
- **Art Brief:** Sharp tactical Human in a cocky leaning stance dual-wielding rune-lit hand crossbows crossed across his chest, bandolier of glowing bolts, popped collar. *Palette:* Charcoal leather, cobalt runes, bright steel. *Vibe:* "Optimized his feat tree before session zero."
- **Signature Verb:** *Crossbow Expert & Min-Max*
- **Attack:** *Dual Hand Crossbows* (`1d4 + DEX` @ `1.05s`, range 3).
- **Action Surge (Action Economy):** Triggers automatically on **every 5th basic attack** (fires a double-bolt burst via shared `actionSurge()`).
- **Ability — Sharpshooter Shot (100):** Auto-hitting piercing arcane bolt (`3d6 + DEX`/tier; Low `2d6`, High `4d6` + `-3` AC shred for `3s`; ignores Evasion).
- **T2 Specializations:**
  - *Crossbow Master (Vertical):* Action Surge triggers every **4th** attack and fires an auto-hitting piercing bolt.
  - *Bursting Arrow (Pivot):* Sharpshooter Shot explodes for `2d6`/tier magic to adjacent foes and grants `+20%` Pierce for `4s`.
- **Guardrail:** Range 3 rapid hand-crossbows + attack-count Action Surge stay clearly distinct from Lorcan's Range 4 Hunter's Mark bow.

---

### Monk (+3) — *Class Feature: Ki (Earned Per Attack, Never Spent, Ramps)*

#### 10. **Vela** *(they/them)*
- **Identity:** Half-Elf · Way of Mercy · **Frontline** · Range `1` · Key `CON` (secondary `WIS`) · Charge: Hit · Size: Medium (`100`) · `120 HP · 15 AC · 13 SR`
- **Art Brief:** Tall gaunt Half-Elf in an angular white-and-obsidian beaked plague mask and flowing monk sash; one arm looks old and decrepit like an ancient embalmed corpse, glowing sickly violet reaching forward in a draining thrust. *Palette:* Bone white, deep slate, necrotic violet. *Vibe:* "Cures the illness by taking the patient's strength."
- **Signature Verb:** *Drain, Necrose & Sustain*
- **Attack:** *Draining Palm* (`1d6 + half WIS` @ `1.5s`, melee).
- **Ki (max 5, never spent):** `+1` Ki per attack; each Ki adds **`+1d4` damage and healing** to *Hand of Harm* (read without spending!).
- **Ability — Hand of Harm (100):** Strikes for `2d6 + WIS`/tier `+ 1d4` per Ki magic, applies **Necrosis (`-50%` healing received, `4s`)**, and heals self for `50%` of damage dealt (High: heals lowest-% ally for the same amount).
- **T2 Specializations:**
  - *Plague Mask (Vertical):* Basic attacks apply `1` Poison and refresh Necrosis; at `5` Ki, Hand of Harm splashes to adjacent foes.
  - *Hand of Mercy (Pivot):* Hand of Harm also Cleanses `1` debuff off the healed ally and grants `1d8`/tier Ward.

#### 11. **Suna** *(she/her)*
- **Identity:** Human · Way of the Kensei · **Attacker** · Range `4` · Key `DEX` · Charge: Attack · Size: Medium (`100`) · `104 HP · 14 AC · 13 SR`
- **Art Brief:** Tall serene Human holding an asymmetric towering Yumi longbow at full draw, crisp flowing haori sleeves, planted wide archer stance. *Palette:* Indigo cloth, warm ivory, lacquered red. *Vibe:* "Draws once. Never needs to draw twice."
- **Signature Verb:** *Slow Yumi Ballista*
- **Attack:** *Yumi Longbow* (`2d8 + DEX` @ `2.5s`, range 4).
- **Ki (max 3, never spent):** `+1` Ki per attack (and `+1` on cast); each Ki adds **`+1d6`** to Yumi attacks (bench check vs. `+1d8`), and at `3` Ki attacks ignore Evasion.
- **Ability — Deft Shot (100):** Unmissable focused arrow (`3d8 + DEX`/tier physical; High: guaranteed **Crit**!).
- **T2 Specializations:**
  - *One with the Bow (Vertical):* At `3` Ki, every Yumi shot pierces through to a 2nd enemy behind the target.
  - *Patient Aim (Pivot):* Starts fights with `2` Ki; Deft Shot shreds `-4` AC (`4s`) and Slows `30%` (`2s`).
- **Guardrail:** Max Ki `3` fixes the slow-attack ramp math so the Yumi hits full power by shot 3 instead of 15s into a fight.

#### 12. **Burbrax** *(he/him)*
- **Identity:** Brass Dragonborn · Way of the Drunken Master · **Brawler** · Range `1` · Key `DEX` (secondary `CON`) · Charge: Attack · Size: Medium (`100`) · `116 HP · 14 AC · 12 SR`
- **Art Brief:** Rotund Brass Dragonborn leaning wildly backward on one heel with a rotund belly, clay jug slung over shoulder, belching a sharp polygonal cone of bright orange fire. *Palette:* Dark green, brass scales, flame orange. *Vibe:* "Swears it's a legitimate monastery technique."
- **Signature Verb:** *Sway & Fire Belch*
- **Attack:** *Staggering Fist* (`1d6 + DEX` @ `1.35s`, melee).
- **Ki (max 5, never spent):** `+1` Ki per attack; each Ki grants `+5%` Evasion (capped by global `50%` Evasion cap).
- **Ability — Firewater Breath (100):** Cone of flaming belch (`2d6 + CON`/tier magic + `3 / 4 / 5` Burn), applies **Cast Disadvantage** (`3s`), and grants adjacent allies `+15%` Evasion (`3s`).
- **T2 Specializations:**
  - *Top-Shelf Proof (Vertical):* Evading an attack splashes `2` Burn + `1d6`/tier fire onto the attacker (`2s` CD).
  - *Drunken Sway (Pivot):* Starts fights with `2` Ki; evading an attack grants `+1` Ki and `+15` Charge.
- **Guardrail:** Uses Evasion + Cast Disadvantage instead of a separate cap-breaking "miss chance" stat.

---

### Paladin (+2) — *Class Feature: Smite (One Definition Per Hero)*

#### 13. **Lady Malice** *(she/her)*
- **Identity:** Tiefling · Oath of Conquest · **Frontline** · Range `1` · Key `CON` (secondary `STR`) · Charge: Hit · Size: Medium (`100`) · `128 HP · 17 AC · 13 SR`
- **Art Brief:** Towering horned-crown Tiefling in jagged spiked plate with sweeping tattered cape, heavy iron flail dragging sparks, standing tall in a stark dominant silhouette. *Palette:* Deep burgundy skin, obsidian iron, ash crimson. *Vibe:* "Every body that drops near her makes her harder to kill."
- **Signature Verb:** *Harvest HP in Aura*
- **Attack:** *Iron Flail* (`1d8 + STR` @ `1.65s`, melee).
- **Smite (Conquest Smite):** `+1d6`/tier magic `+ 1` per `15` bonus Max HP.
- **Run-Long Aura (`carryKeys`):** Any enemy dying within `2` tiles permanently adds **`+6` Max HP** for the run (**cap `+60`/tier**).
- **Ability — Conquering Presence (100):** Delivers **Conquest Smite** on target, Taunts foes within `2` tiles (`1.5 / 2 / 3s`), and pulses `1d6`/tier magic.
- **T2 Specializations:**
  - *Aura of Dominion (Vertical):* Enemies within `2` tiles are Slowed `25%` and deal `15%` less damage; raises permanent HP cap to `+120`.
  - *Blood Tithe (Pivot):* Each Aura kill immediately heals `15%` Max HP and grants `+25` Charge.
- **Guardrail:** Aura-proximity trigger avoids ally last-hit frustration; per-tier cap prevents infinite Act 3 HP pools.

#### 14. **Petra** *(she/her)*
- **Identity:** Silverbrow Human · Oath of Bahamut · **Brawler** · Range `1` · Key `STR` (secondary `CHA`) · Charge: Attack · Size: Big (`180`) · `120 HP · 16 AC · 12 SR`
- **Art Brief:** Young dramatic Silverbrow Human perched forward in the saddle of a sleek winged **Dragonnel** mount, wearing a black hoodie-like tunic under silver scale armor (**no cape**), oversized platinum lance couched straight ahead. *Palette:* Black, platinum, bright silver. *Vibe:* "Refuses to come in second place—even to her own party."
- **Signature Verb:** *Chase #1 & Crit Smite*
- **Attack:** *Dragonnel Lance* (`1d10 + STR` @ `1.7s`, melee).
- **Passive (#1 Chaser):** Reads combat damage meter — while behind any ally in damage, gains `+25%` Attack Speed & Charge Rate; while `#1`, allies gain `+1d4` Radiant on-hit.
- **Smite (Platinum Smite):** `+2d8`/tier Radiant (no flat bonus; doubles to **`4d8`/tier** on Crits!).
- **Ability — Dragonnel Charge (180):** Charges target for a **guaranteed Critical Hit** (`2d10 + STR`/tier) + **Platinum Smite** (`4d8`/tier Radiant on Crit!) and knocks target back `1` tile.
- **T2 Specializations:**
  - *Platinum Rival (Vertical):* Dragonnel Charge makes a follow-up Lance strike if the target survives; kills refund `50%` Charge.
  - *Bahamut's Banner (Pivot):* While `#1` in damage, her Platinum Aura also grants allies `+3` AC/SR and `1d6`/tier Ward on every Charge.
- **Guardrail:** Big (`180`) cadence keeps guaranteed Critical Radiant Smites explosive without one-shotting Act 1 elites on a short cooldown.

---

### Ranger (+2) — *Class Feature: Favored Foe (Triggers Off Pure-Tag `Hunter's Mark`)*

#### 15. **Tova** *(she/her)*
- **Identity:** Goliath · Beast Master · **Attacker** · Range `2` · Key `STR` (secondary `WIS`) · Charge: Attack · Size: Medium (`100`) · `112 HP · 14 AC · 12 SR`
- **Art Brief:** Massive fur-mantled Goliath mountaineer with climbing spear planted diagonally, armored gauntlet raised launching a diving **Falcon** (`Summon Art`). *Palette:* Frost grey skin, pine-brown furs, glacial teal. *Vibe:* "She marks the climb; the bird owns the sky."
- **Signature Verb:** *Mark & Sic Falcon*
- **Attack:** *Climbing Spear* (`1d6 + STR` @ `1.7s`, range 2) + permanent **Falcon** (`35%` HP, `1d4` @ `1.5s`, prioritizes Marked backline foes; **no separate item slots** — scales off Tier + WIS).
- **Favored Foe (Sic 'Em!):** Every 3rd Tova attack (or cast) vs. a **Marked** foe commands the Falcon to dive-strike that target for `2d6 + WIS`/tier.
- **Ability — Falconer's Call (100):** Applies **Hunter's Mark** to the farthest/deadliest foe, heals or resummons the Falcon (`50 / 75 / 100%` HP), and triggers **Favored Foe**.
- **T2 Specializations:**
  - *Twin Hunt (Vertical):* Falcon gains `+40%` HP, `+25%` Evasion, and triggers Favored Foe every **2nd** Tova attack.
  - *Golden Talons (Pivot/Economy):* Falcon steals `+1g` on every Marked kill or 4th Marked strike (**cap `3g`/fight**) and grants Tova `+20%` Attack Speed (`3s`).

#### 16. **Colony** *(she/her)*
- **Identity:** Tiefling · Swarmkeeper · **Brawler** · Range `1` · Key `WIS` (secondary `DEX`) · Charge: Attack · Size: Medium (`100`) · `120 HP · 14 AC · 13 SR`
- **Art Brief:** Wiry wrapped Tiefling swinging a smoking brass **beekeeper's smoker flail** in a wide arc, honeycomb-patterned shawl, jagged geometric cloud of gold-and-black bees orbiting her silhouette. *Palette:* Amber-ochre skin, honey gold, soot black. *Vibe:* "Never travels alone—just brings four thousand friends."
- **Signature Verb:** *Bee Aura & Disrupt*
- **Attack:** *Smoker Flail* (`1d8 + DEX` @ `1.5s`, melee `1`; first hit applies **Hunter's Mark**).
- **Favored Foe (Swarming Bees):** Bee aura pulses `1d6`/tier magic every `2s` around Colony **and** engulfs any **Marked** foe, Slowing their attacks `30%` and applying Cast Disadvantage.
- **Ability — Hive Surge (100):** Blasts smoke and bees across foes within `2` tiles (`2d6 + WIS`/tier magic, `35%` Slow `2 / 3 / 4s`) and applies **Hunter's Mark** to the deadliest foe hit.
- **T2 Specializations:**
  - *Killer Bees (Vertical):* Bee aura inflicts `1` Poison per pulse and jumps **Hunter's Mark** to the nearest foe on death.
  - *Blinding Swarm (Pivot):* Allies within `2` tiles of Colony or the Marked foe gain `+15%` Evasion.

---

### Rogue (+2) — *Class Feature: Sneak Attack (Unique Condition + Internal CD)*

#### 17. **Nix** *(they/them)*
- **Identity:** Gnome · Arcane Trickster · **Support** · Range `3` · Key `INT` (secondary `DEX`) · Charge: Time · Size: Small (`60`) · `104 HP · 13 AC · 14 SR`
- **Art Brief:** Tiny crouched Gnome in an oversized pointed hood, sling tucked at hip while a glowing floating translucent **Mage Hand** reaches forward pinching a spark of stolen light. *Palette:* Deep teal cloak, warm tan, electric cyan. *Vibe:* "Why dodge a fireball when you can steal the mana first?"
- **Signature Verb:** *Steal Charge & Sabotage*
- **Attack:** *Arcane Sling* (`1d4 + half INT` @ `1.5s`, range 3, magic).
- **Sneak Attack (Magical Ambush, `4s` CD):** Triggers vs. any **Controlled or Debuffed** foe; deals `+1d6`/tier magic and **Steals `20` Charge** (`10` vs. Bosses) for the lowest-charge ally.
- **Ability — Mage Hand Sabotage (60):** Hits highest-charge enemy for `1d6 + INT`/tier magic, applies **Cast Disadvantage** (`3 / 4 / 5s`), and force-triggers **Sneak Attack**.
- **T2 Specializations:**
  - *Versatile Trickster (Vertical):* Mage Hand also grants the frontliner `+15%` Evasion (`3s`) and strips `2d6`/tier Ward.
  - *Spell Thief (Pivot):* Whenever an enemy Fizzles or casts with Disadvantage, steal `25` Charge for the top-DPS ally and deal `2d6`/tier magic.

#### 18. **Rico** *(he/him)*
- **Identity:** Half-Elf · Swashbuckler · **Brawler** · Range `1` · Key `DEX` (secondary `CHA`) · Charge: Attack · Size: Medium (`100`) · `112 HP · 14 AC · 12 SR`
- **Art Brief:** Flashing wide-stance Half-Elf in a sweeping feathered tricorne/cavalier hat, lunging forward with a curved cutlass, sash billowing behind in a dramatic diagonal A-frame. *Palette:* Seafoam tunic, cream sash, sunlit gold. *Vibe:* "Fights best when nobody's crowding his spotlight."
- **Signature Verb:** *Isolated 1v1 Duel*
- **Attack:** *Cutlass* (`1d8 + DEX` @ `1.45s`, melee).
- **Sneak Attack (Rakish Audacity, `3.5s` CD):** Triggers when **no other ally is adjacent to the target** (mirror opposite of Wallaby!).
- **Ability — Fancy Footwork (100):** Force-triggers **Sneak Attack** (`+1d6`/tier — ensures boss viability!), gains `2d6 + CHA`/tier Ward, and Taunts target (`1.5 / 2.5 / 3.5s`; High: `+25%` Evasion `2s`).
- **T2 Specializations:**
  - *Master Duelist (Vertical):* Isolated Sneak Attacks always **Crit** and reset cooldown on kill.
  - *Panache (Pivot):* Fancy Footwork steals `3` AC from target (`4s`) and grants `+15` Charge on evade.

---

### Sorcerer (+3) — *Class Feature: Metamagic (Fill 4 SP → Spend All on Cast)*

#### 19. **Ylowyn** *(she/her — with baby Flumph **Flumphry**)*
- **Identity:** Gnome · Empathic Sorcerer · **Support** · Range `3` · Key `CHA` · Charge: Time · Size: Medium (`100`) · `96 HP · 12 AC · 14 SR`
- **Art Brief:** Tiny hunched Gnome grandmother in a cozy patched shawl with a crooked walking cane, leaning forward while cute floating translucent baby Flumph **Flumphry** (`Summon Art`) hovers eagerly beside her. *Palette:* Lavender shawl, silver bun, pastel pink-cyan. *Vibe:* "Don't mind Flumphry—he just wants to copy your best spell."
- **Signature Verb:** *Send Flumphry to Twincast*
- **Attack:** *Telepathic Spark* (`1d4 + half CHA` @ `1.7s`, range 3, magic).
- **SP Generator:** `+1` SP on her own cast **plus** `+1` SP whenever any enemy misses an attack or rolls Fizzle/Low (`1s` CD).
- **Metamagic (4 SP — Flumphry's Twincast):** Sends **Flumphry** to the closest ally, granting **Twincast** on their next ability (safe fallback: `+50%` bonus dice / `2×` Ward/Heal on toggle abilities).
- **Ability — Flumphry's Spores (100):** Grants closest ally `+15%` Evasion (`3 / 4 / 5s`) + `2d6 + CHA`/tier Ward and applies **Cast Disadvantage** (`2.5s`) to their attacker.
- **T2 Specializations:**
  - *Telepathic Bond (Vertical):* Starts fights with `2` SP; when an ally Twincasts with Flumphry, Ylowyn gains `+25` Charge.
  - *Protective Spores (Pivot):* Flumphry's Spores hits `2` enemies with Cast Disadvantage and heals the ally `1d8`/tier whenever an enemy misses them.
- **Guardrail:** Self-cast SP + built-in Evasion/Disadvantage guarantees she reaches 4 SP even in bare parties while spiking in Evasion comps.

#### 20. **Hewitt** *(he/him)*
- **Identity:** Dwarf · Clockwork Soul · **Support** · Range `3` · Key `CHA` · Charge: Time · Size: Medium (`100`) · `104 HP · 13 AC · 14 SR`
- **Art Brief:** Boxy crisp Dwarf in brass-and-enamel geometric robes with an oversized spinning clockwork gear halo behind his back, holding a tuning key forward. *Palette:* Burnished brass, ivory enamel, cobalt blue. *Vibe:* "Measures friendship in extra attack speed."
- **Signature Verb:** *Overclock One Carry*
- **Attack:** *Orderly Bolt* (`1d4 + half CHA` @ `1.7s`, range 3, magic).
- **SP Generator:** `+1` SP whenever the Overclocked ally casts or lands 3 attacks (`1.5s` CD).
- **Metamagic (4 SP — Supercharge):** Overclocks **2 allies** instead of 1 (and prevents Low/Fizzle on their next cast).
- **Ability — Overclock (100):** Grants closest ally **`+3 / +4 / +6` to their Key Stat** (`+1` per tier) and `+25%` Attack Speed for `4s`.
- **T2 Specializations:**
  - *Trance of Order (Vertical):* Overclocked allies cannot Fizzle (Nat 1 → Mid) and gain `+15` Charge when Overclocked.
  - *Clockwork Cavalcade (Pivot):* Spending `4` SP grants the whole party `2d6`/tier Ward and Cleanses `1` debuff.

#### 21. **Chuk** *(he/him)*
- **Identity:** Half-Orc · Wild Magic · **Caster** · Range `3` · Key `CHA` · Charge: Time · Size: Big (`180`) · `104 HP · 12 AC · 14 SR`
- **Art Brief:** Huge hunched Half-Orc crammed into a frayed wizard coat, two massive fists crackling with mismatched jagged magenta and gold lightning bolts. *Palette:* Olive skin, scorched charcoal, magenta & gold. *Vibe:* "Has no idea what the spell will do—loves it anyway."
- **Signature Verb:** *Rig the Chaos Table*
- **Attack:** *Chaos Bolt* (`1d6 + 1` @ `1.8s`, range 3, magic).
- **SP Generator:** `+1` SP on any hero's High/Nat 20; **`+2` SP on own Low/Fizzle**.
- **Metamagic (4 SP — Bend Luck):** Guarantees a **Nat 20 Crit** and picks the strongest Chaos Surge outcome.
- **Ability — Wild Surge (180):** Blasts target cluster for `4d8 + CHA`/tier magic + positive d20 Surge (Low: shrinks target `-30%` dmg `3s`; Mid: `2d6`/tier splash; High: hits `2` extra foes + `+25` ally Charge).
- **T2 Specializations:**
  - *Controlled Chaos (Vertical):* Starts fights with `2` SP; Bend Luck also gives the party **Advantage** on their next cast.
  - *Spell Bombardment (Pivot):* Wild Surge Crits bounce to a 2nd target for half dice and refund `2` SP.

---

### Warlock (+2) — *Class Feature: Pact (Triggers Off Pure-Tag `Hex`, Independent of Casts)*

#### 22. **Leagues** *(they/them)*
- **Identity:** Sea Elf · The Fathomless · **Attacker** · Range `4` · Key `CHA` · Charge: Attack · Size: Medium (`100`) · `104 HP · 12 AC · 14 SR`
- **Art Brief:** Eerie draped Sea Elf with a deep pitch-black silhouetted head sealed inside a glossy glowing glass **fishbowl diving helmet** (Mysterio-inspired), waterlogged high-collar cape, swirling abyssal tentacles bursting from hem. *Palette:* Sea-glass cyan, abyssal navy, ink black. *Vibe:* "Nobody has ever seen their face—only the tide inside the glass."
- **Signature Verb:** *Tentacle Lash & Torrent*
- **Attack:** *Eldritch Torrent* (`1d8 + CHA` @ `1.65s`, range 4, magic).
- **Pact (Tentacle of the Deeps):** Whenever a **Hexed** foe attacks (`2.5s` CD), a Tentacle slams them for `1d8 + CHA`/tier cold magic and **Slows** `30%` for `2s`. *(Pure-tag `Hex` compliance.)*
- **Ability — Abyssal Surge (100):** Water blast dealing `3d6 + CHA`/tier magic, **Pushing** `1` tile, and applying **Hex** (High: Hexes `2` foes).
- **T2 Specializations:**
  - *Riptide Torrent (Vertical):* Basic *Eldritch Torrent* fires a piercing water beam hitting foes behind the target and pushing Hexed foes `1` tile.
  - *Grasping Tentacles (Pivot):* Tentacle Pact cooldown drops to `1.25s` and Restrains on every 2nd lash (`1.5s`).

#### 23. **Malthrax** *(he/him)*
- **Identity:** White Dragonborn · The Hexblade · **Brawler** · Range `1` · Key `CHA` (secondary `CON`) · Charge: Attack · Size: Medium (`100`) · `112 HP · 15 AC · 13 SR`
- **Art Brief:** Broad jagged snow-white horned Dragonborn leaning into a heavy swing with an oversized glowing crimson jagged greatsword dripping light. *Palette:* Frost white scales, iron charcoal, blood red. *Vibe:* "Cold scales, warm blade."
- **Signature Verb:** *Blood-Drinking Blade*
- **Attack:** *Blood Greatsword* (`1d10 + CHA` @ `1.75s`, melee).
- **Pact (Blood Blade):** Striking a **Hexed** foe (`2s` CD) deals `+1d6`/tier bonus damage and heals for `35%` of the hit.
- **Ability — Hexblade's Curse (100):** Cleaves adjacent foes `2d8 + CHA`/tier physical, applies **Hex** to main target, and grants `2d6 + CON`/tier Ward (High: `+20%` Evasion `3s`).
- **T2 Specializations:**
  - *Crimson Hunger (Vertical):* Hex jumps on death; Blood Blade cooldown drops to `1.0s` while below `60%` HP.
  - *Frost & Blood (Pivot):* Hexblade's Curse also Slows cleaved foes `30%` (`2.5s`) and deals `+1d6`/tier cold per nearby Hexed/Slowed foe.

---

### Wizard (+2) — *Class Feature: Arcane Recovery (Charge Gain on Condition)*

#### 24. **Orlo** *(he/him)*
- **Identity:** High Elf · School of Evocation · **Caster** · Range `4` · Key `INT` · Charge: Time · Size: Small (`60`) · `96 HP · 12 AC · 14 SR`
- **Art Brief:** Tall rigid High Elf in sharp high-collared academy robes and a pointed wizard's hat shaped like a missile head; both palms thrust forward launching a tight geometric fan of glowing star-tipped darts. *Palette:* Royal blue, crisp silver, starlight white. *Vibe:* "Started with three darts; plans to finish with thirty."
- **Signature Verb:** *Stack Missiles / Warhead*
- **Attack:** *Arcane Spark* (`1d4 + half INT` @ `1.6s`, range 4, auto-hit magic).
- **Arcane Recovery:** `+6` Charge per Magic Missile fired (capped `+30`/cast so late fights don't infinite-loop).
- **Ability — Magic Missile (60):** Fires `3` auto-hitting missiles (`1d4`/tier magic each, ignores Evasion) and **permanently adds `+1` missile** to future casts this fight (Low `2` base; High `+2` missiles added).
- **T2 Specializations:**
  - *Seeking Barrage (Vertical):* Missiles shred `-1` SR per hit (`3s`, max `-5` SR) and grant `+10` Arcane Recovery when hitting targets with Evasion.
  - *Arcane Warhead (Pivot):* Stops adding extra missiles; each cast still fires `3` missiles AND loads `+1` Warhead charge — at `3` charges, launches a sculpted **`10d8`/tier `3×3` Arcane Nuke**!
- **Guardrail:** Arcane Warhead keeps firing 3 base missiles while charging so there is zero dead time before detonation.

#### 25. **Bellin** *(he/him)*
- **Identity:** Elf · School of Necromancy · **Caster** · Range `3` · Key `INT` (secondary `CON`) · Charge: Time · Size: Big (`180`) · `104 HP · 12 AC · 14 SR`
- **Art Brief:** Frail bent elder Elf in tattered funeral vestments ringing a heavy iron handbell; looming behind him is the stitched hunched **Flesh Homunculus** (`Summon Art`). *Palette:* Dusty slate, yellowed bone, sickly emerald. *Vibe:* "Every bell tolls twice—once for them, once for the graft."
- **Signature Verb:** *Reverberate & Graft*
- **Attack:** *Necrotic Bolt* (`1d4 + half INT` @ `1.7s`, range 3, magic) + starts fight with **Flesh Homunculus** (`35%` Bellin's HP, melee `1d6 + half INT` @ `1.7s`).
- **Arcane Recovery:** `+35` Charge whenever a **Reverberated** foe dies (or the Homunculus is revived).
- **Ability — Death Knell (180):** *(Renamed from Toll the Dead to avoid colliding with Saint's attack.)* Deals `2d6`/tier magic to all foes — **doubles dice (`4d6`/tier) and Reverberates (`5s`)** every damaged foe. Reverberated foes that die are grafted onto the Homunculus (`+25%` Max HP, `+1d6`/tier dmg, heals `30%`).
- **T2 Specializations:**
  - *Ossuary Abomination (Vertical):* Homunculus also gains `+1` graft whenever a Reverberated foe loses `30%` HP (boss-viable!) and cleaves adjacent foes at `3+` grafts.
  - *Soul Echo (Pivot):* Reverberated foes suffer **Necrosis (`-50%` healing received)** and explode for `2d6`/tier necrotic on death.

---

## 4. Extra Summon & Wild Shape Form Art (7 Assets)

| Asset | Kind | Owner | Pronouns | Visual Read (Low-Poly Style) |
| :--- | :--- | :--- | :--- | :--- |
| **Coin Soldier** | Summon | Toot | it/its | Polygonal gold coin on stubby legs with tiny spear + round buckler. |
| **Spiritual Weapon** | Summon | Father Gorr | it/its | Floating radiant amber spiked warhammer mirroring Gorr's weapon. |
| **Flaming Squirrel** | Wild Shape | Thia | she/her | Arch-backed low-poly squirrel with a blazing orange flame tail, mid-leap. |
| **Symbiotic Entity** | Wild Shape | Morel | they/them | Glowing fungal-encrusted silhouette bursting with chartreuse spore-caps. |
| **Falcon** | Summon | Tova | it/its | Sharp diving raptor silhouette with outstretched talons. |
| **Flumphry** | Summon | Ylowyn | he/him | Cute floating pastel-pink/cyan polygonal baby Flumph with tiny tendrils. |
| **Flesh Homunculus** | Summon | Bellin | it/its | Asymmetric stitched-together polygonal brute that visibly reads as "grafted." |

---

## 5. Planned Testbench Rollout Batches (Phase 2)

1. **Engine Pass:** Add the 6 shared primitives to `tools/testbench/engine.js` (verify `prototype2` = `47.0%`).
2. **Batch A (Summons & Companions):** Toot, Father Gorr, Morel, Tova, Bellin.
3. **Batch B (Casters & Spellcraft):** Thia, Orlo, Leagues, Ylowyn, Chuk.
4. **Batch C (Frontliners & Brawlers):** Durn, Corporal Tobbin, Vela, Lady Malice, Malthrax.
5. **Batch D (Strikers & Skirmishers):** Falcorn, Moxie, Maxim, Suna, Petra.
6. **Batch E (Control, Disruption & Utility):** Burbrax, Colony, Nix, Rico, Hewitt.
