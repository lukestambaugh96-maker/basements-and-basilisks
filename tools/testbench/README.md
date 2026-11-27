# B&B test bench

A permanent, headless test engine for Basements & Basilisks v0.25. Every hero, enemy and rule number lives in three config files; the engine reads them. No rebuilding.

## Files
- `config/heroes.config.json`: all 24 heroes (stats, attack, ability and T2 numbers). Approved changes through 25 Nov are in.
- `config/enemies.config.json`: all Act 1 enemies, encounters (positions, terrain) and bosses.
- `config/rules.config.json`: game-wide numbers (resistance curve, charge, Restrained, Ward stacking, HP).
- `engine.js`: prototype 2's fight engine; every constant comes from the rules config.
- `behaviour.js`: how each hero and enemy acts; every number comes from the configs.
- `run.js`, `bot.js`: items, economy and the original bot that plays whole runs (not yet in config).
- `bots.js`: the three bot players for encounter tuning (25 Nov): `bare` never buys anything beyond filling the 3 party slots; `sensible` fills a balanced party, ranks heroes up and buys items that fit; `engine` builds a melee brawl engine (Rage on the front line, on-hit damage and Action Surge on a melee carry, rerolls for copies).
- `presets/prototype2.json`: the numbers from playable prototype 2, before the 24–25 Nov approved changes.
- `presets/normalize1.json`: normalization batch 1, approved and applied to the hero config 25 Nov (kept for reference; running it changes nothing).
- `bench.js`: the commands.

## Setup
From the repo: `cd tools/testbench && node bench.js help`. No install step; plain Node.

In a claude.ai chat without the repo, the project keeps a one-file copy: read `claude/testbench/testbench-bundle.js`, then `node <that file> unpack ./testbench`.

## Commands
```
node bench.js stats                       arithmetic for every hero and enemy, instant
node bench.js test dane --n 250           one hero: ability on vs off, every fight, deaths, damage, help given
node bench.js cast [heroes...] --n 100    one row per hero (whole cast takes a few minutes)
node bench.js try "dane.ability.ward.dice=4d8, klarg.hp=110" dane
node bench.js run --n 300                 whole Act 1 bot runs
node bench.js intro                       each hero alone vs Fight 1
node bench.js jobs --n 60 [--tier 2]      every hero vs their job and ability-size benchmark (LOW / HIGH flags); --tier measures everyone at that tier (no path)
node bench.js bots --n 300                the three bot players, whole Act 1 runs each (same seeds); --seed, --edits, --json
node bench.js bots --place best           bots place by trying every formation on practice dice first (also: smart, wall, ... any formation)
node bench.js itemoff --n 60 --reps 3     each fight replayed with no items, and with each item removed one at a time
node bench.js castoff --n 60 --reps 3     each fight replayed with each hero's ability turned off
node bench.js placement --n 60 --reps 3   each fight replayed in 8 formations; Best / Worst shows how much placement can swing it
node bench.js paths --n 150 --reps 2     every hero's tier 2 paths in real fights (fight 3 on): T1 vs T2 no path vs path A vs path B
node bench.js bosscheck --n 150          the boss as the Act 2 check: bot parties rebuilt as all tier 2 (items on one) / two tier 2 / one tier 2
node bench.js buffs --n 100             what +1/2/3 key score or CON, +10/20/30% attack speed, or an extra 1d4-1d10 on attacks or abilities is worth to each hero (items removed; --keep-items)
node bench.js luck --n 60                 each fight once on average dice vs 5 times on normal dice: how often the dice decide it
  (these six: --bots sensible,engine  --fight 3,4  --seed  --edits; --reps replays each variant from several seeds to cut dice noise)
--dice average                            any command: every damage, heal, Ward and bonus die rolls its average (d20 stays random)
--dice average-all                        any command: the d20 rolls its average too (10.5; Advantage 13.8, Disadvantage 7.2)
--preset prototype2                       use prototype 2's numbers
```

## Charge and ability size (25 Nov)
Every job gains charge the same way (attacks: 100 per 5s of attacking; hits: 15 per hit; time: 100 per 5s, faster with INT). Each hero's `chargeToCast` (default 100) sets how big and rare their ability is: about 60 small, 100 medium, 180 big, 300 nuke (`abilitySizes` in rules.config.json). Casters' old per-hero cast speeds became chargeToCast (Faelan 130, Zoe 110, Gains 130, Cinder 160); the prototype2 preset restores the old values.

## Checks (25 Nov)
- `node bench.js run --preset prototype2 --n 300` reproduces prototype 2's saved notes exactly: 47.0% cleared (the preset also reverts normalization batch 1 and encounter pass 1; re-checked 26 Nov), losses ending at fights {1:129, 2:7, 3:16, 4:3, 5:4}.
- `node bench.js test jamison --n 250` reproduced the 25 Nov Jamison test exactly with the configs of that day (before normalization batch 1 and encounter pass 1); it no longer will on today's configs (fights 50/42/8/45, bosses 36/32/48, dies 83% vs allies 66%).

## Rulings
Approve or reject proposed changes on the review page (B&B design review, https://claude.ai/artifact/DrhsxE5uoUjnm6bjQQrpXy). Approved numbers go into the configs.

## Still open
- Encounter pass 1 (`enemies.config.json`) is proposed on the review page; if rejected, the old values are in `claude/v0.25b-encounter-pass1.md` in the project.
- Items and the economy are still in `run.js`; the prototype doesn't read the configs yet.
- Home: the GitHub repo, `tools/testbench/` (on main). This project copy and the bundle are for chats without the repo.

## Encounter pass 1 (25 Nov, proposed)
`enemies.config.json` retuned with enemy damage only (no HP). `node bench.js bots --n 300 --seed 20000`: never-buy 0% cleared, runs end at fight 3 (median); sensible 50% cleared, 68% use the free loss; engine 61% cleared. The original `run` bot now clears 25%.

## Replay tests (25 Nov)
`itemoff`, `castoff` and `placement` take every fight the chosen bots walked into (a snapshot of the party: heroes, tiers, items, positions) and replay it with one thing changed, from the same seed as the full-build replay. Removing an item can shift which dice land where, so read drops under about 5 points, or items held fewer than 20 times, as noise; `--reps 3` or more smooths it.
Formations: `bot` (how the bots place: melee front, ranged back), `smart` (frontliners centre front, melee beside them, ranged behind, towers first), `swapped` (ranged front, melee behind), `tight`, `spread`, `wall` (all front), `back` (all back), `random`.
First results (sensible + engine, 60 runs each): removing all items drops late fights 20-40 points (Forge 80% -> 52%, Grol 68% -> 29%); turning off Saint's, Faelan's or Cinder's ability drops their parties 37-45 points, Pillar's or Zark's 5-6; the best formation per party wins 95% vs 48% for the worst and 77% for the bots' own placement. With `--place best`, sensible clears 81% and engine 88% (default placement: 50% / 61%).

## Average dice (26 Nov)
`rules.config.json` `dice.mode` (or `--dice`): `random` is normal play; `average` makes every damage, heal, Ward and bonus die roll its average while the d20 ability roll stays random; `average-all` fixes the d20 too, so abilities never crit or fizzle. Damage still rounds once per hit, as in normal play. Other randomness (shop offers, ties in targeting) stays.
First results (300 runs per bot, `--seed 20000`): cleared never-buy 0 / 0 / 0%, sensible 50 / 52 / 51%, engine 61 / 63 / 63% (random / average / average-all), so runs are decided by the build, not luck. `luck` (sensible + engine, 60 runs each): 11% of fights are coin flips on normal dice; bad luck loses a fight average dice win 6% of the time, good luck saves one 3%; Nezznar is the most luck-driven (24% coin flips).

## One boss (26 Nov, proposed)
Act 1 has one boss, Nezznar: the check for entering Act 2. Venomfang and King Grol stay in `enemies.config.json` with `"active": false`; edit paths like `bosses.grol.active=true` turn them back on (the prototype2 preset does). `bosscheck`: all tier 2 with items on one hero 84%, two tier 2 with items 73% (84% with frontliner + damage + support), one tier 2 33%.

## Shop odds (26 Nov, proposed)
`rules.config.json` `shop.ownedHeroWeight` 0.75: a hero you already own is offered 75% as often as one you don't, until the hero pool grows (Luke, 26 Nov). Rerolls are unchanged: 1 gold, then 1 more for each reroll in the same shop. `bots` now reports rank-ups bought per run, the share found after a reroll, and rerolls per run. At 300 runs per bot (`--seed 20000`): weight 1: sensible 62% / engine 70% cleared, 1.5 rank-ups, 34% after a reroll; 0.75: 55% / 65%, 1.3, 41%; 0.65: 51% / 65%, 1.2, 42%; 0.5: 45% / 61%, 1.0, 45%.

## Ability modifiers (26 Nov, Luke)
`rules.config.json` `abilityScores.modifier` "half": each point above 10 is worth half a modifier point (15 gives +2.5), so odd scores and +1 items count; even scores are unchanged. A damage, heal or Ward amount that ends in .5 rounds up or down at random, so half a point is worth half on average. "floor" restores D&D's rounded-down modifier (the prototype2 preset uses it). Per point at tier 1: +4 HP from CON (8 hit dice), +5 starting charge from CHA, +0.5 damage per hit from an attack or ability score, +5% charge speed from INT for casters. Effect at 300 runs per bot: sensible 55% -> 60% cleared, engine 65% -> 70%; never-buy still dies at fight 3; boss check unchanged (86 / 79 / 32%). `buffs --only stat` (100 runs per bot): key +1 / +2 / +3 worth +1 / +4 / +5 points, CON +1 / +3 / +5.

## Evasion and attack growth (26 Nov)
- **Evasion:** a chance that an attack misses (attacks only, never abilities). Hard cap `rules.evasion.cap` (0.5). Sources: hero config `evasion`, item `eva`, enemy `evasion`; `pierce` lowers it. Effective HP in `stats` and `jobs` divides physical EHP by (1 − evasion).
- **Attack growth:** `rules.attackGrowth.extraDicePerTier` adds weapon dice per tier above 1 for heroes (0 = off; Luke's rule is 1, waiting for the cast rework).
- **`jobs --path 0|1`:** measures the hero at their path (with `--tier 2`). `paths --json` also reports party HP lost, the hero's deaths and allies' deaths.
- **Arthur's rework hooks:** `arthur.t2.riposteMaster` / `arthur.t2.goadingStrike` replace Ready First / Second Wind when set; `arthur.riposte` ({cooldown, noCooldownWhileDodging}) and `arthur.ability.extraDicePerDodge` / `maxDodgeDice`. Off unless set; see `claude/v0.25b-arthur-rework.md`.
- **`jobs --partnerTier 1`** (with `--tier 2`): only the measured hero is at that tier; JSON adds `allyDies` and a `split` by whether another frontliner is in the party. `paths --json` adds the same split (`regSolo`, `regTank`, `bossSolo`, `bossTank`).
- **Bram's proposal hooks (27 Nov, off unless set):** `bram.channelDivinity` (Preserve Life in the base kit, with Disciple of Life's trigger), `bram.t2.anchor` (Unyielding), `bram.t2.guardian` (Shield of Faith).
- **Faelan's proposal hooks (27 Nov, off unless set):** `faelan.arcaneRecovery` ({charge, maxPerShield}: Arcane Recovery in the base kit, Spell Weave's trigger), `faelan.t2.projectedWard` ({share}), `faelan.t2.sharedRecovery2` ({allyCharge, target: topDamage | mostCharged}).
- **Wallaby's proposal hooks (27 Nov, off unless set):** `wallaby.sneakAttack` ({cooldown, bonus}: Sneak Attack in the base kit, Opportunist's trigger), `wallaby.ability.triggersSneakAttack`, `wallaby.t2.cutthroat2` ({foeBelowHp, chargeOnKill, killCooldown, cooldown, bonus}), `wallaby.t2.pickpocket2` ({goldPerSneakKill}). `jobs --json` adds `goldPerFight`.
- **Dane's proposal hooks (27 Nov, off unless set):** `dane.smite` (Divine Smite definition), `dane.ability.nextAttackSmites`, `dane.t2.duelist2` ({everyNthHit, untilItFalls, anyFoe, lockOn}), `dane.t2.retribution2` ({anyTime}).
- **Run-long state (27 Nov, Luke: scaling means it carries across the run):** a hero's `carryKeys` (in its kit) are copied onto its rec after every fight (`carryBack`, also in `run.js` finishFight) and back onto the unit next fight (`rec.carry`). Dane's Duelist uses `duelStacks`; hook `dane.t2.duelist3` ({dicePerKill, maxDice, whileTaunted}).
- **`gauntlet <hero> [--tier 2] [--path 0|1] [--partnerTier 1] [--n 200]`:** the hero and random partners play fights 2-5 then the boss in a row with no items, carrying run-long state; reports win per fight and the carried stacks.
- **Batch 1 proposals (27 Nov): `--preset batch1`** turns on the reworked kits for Gilthrax, Zoe, Laurel, Pillar, Zark and Naill (`kit2` in a hero's config picks the new kit in `behaviour.js` KITS2; without it the old kit runs). `jobs --items a,b` gives the measured hero items; `--partnerItems a,b` gives each partner items.
- **Enemy buff knobs (27 Nov):** `rules.enemyScale` {damage (multiplier), attackSpeed (bonus), hp (multiplier)} applies to every enemy. Set to +5% attack speed after batch 1.
- **Batch 2 proposals (27 Nov): `--preset batch2`** (Lorcan, Corvin, Velith, Nettle, Lumen). Hunter's Mark is now a shared rule in `engine.js` (`setMark` / `applyMarks`): marks from different heroes stack, one per hero, and trigger on any hero's attack.
