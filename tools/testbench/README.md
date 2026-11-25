# B&B test bench

A permanent, headless test engine for Basements & Basilisks v0.25. Every hero, enemy and rule number lives in three config files; the engine reads them. No rebuilding.

## Files
- `config/heroes.config.json`: all 24 heroes (stats, attack, ability and T2 numbers). Approved changes through 25 Nov are in.
- `config/enemies.config.json`: all Act 1 enemies, encounters (positions, terrain) and bosses.
- `config/rules.config.json`: game-wide numbers (resistance curve, charge, Restrained, Ward stacking, HP).
- `engine.js`: prototype 2's fight engine; every constant comes from the rules config.
- `behaviour.js`: how each hero and enemy acts; every number comes from the configs.
- `run.js`, `bot.js`: items, economy and the bot that plays whole runs (not yet in config).
- `presets/prototype2.json`: the numbers from playable prototype 2, before the 24–25 Nov approved changes.
- `presets/normalize1.json`: normalization batch 1 (proposed 25 Nov), not yet approved.
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
node bench.js jobs --n 60                 every hero vs their job and ability-size benchmark (LOW / HIGH flags)
--preset prototype2                       use prototype 2's numbers
```

## Charge and ability size (25 Nov)
Every job gains charge the same way (attacks: 100 per 5s of attacking; hits: 15 per hit; time: 100 per 5s, faster with INT). Each hero's `chargeToCast` (default 100) sets how big and rare their ability is: about 60 small, 100 medium, 180 big, 300 nuke (`abilitySizes` in rules.config.json). Casters' old per-hero cast speeds became chargeToCast (Faelan 130, Zoe 110, Gains 130, Cinder 160); the prototype2 preset restores the old values.

## Checks (25 Nov)
- `node bench.js run --preset prototype2 --n 300` reproduces prototype 2's saved notes exactly: 47.0% cleared, losses ending at fights {1:129, 2:7, 3:16, 4:3, 5:4}.
- `node bench.js test jamison --n 250` reproduces the 25 Nov Jamison test exactly (fights 50/42/8/45, bosses 36/32/48, dies 83% vs allies 66%).

## Rulings
Approve or reject proposed changes on the review page (B&B design review, https://claude.ai/artifact/DrhsxE5uoUjnm6bjQQrpXy). Approved numbers go into the configs.

## Still open
- Brother Jamison's self-Ward (pending on the review page): `jamison.ability.selfWard` is null until approved.
- Items and the economy are still in `run.js`; the prototype doesn't read the configs yet.
- Home: the GitHub repo, `tools/testbench/` (pull request #4, https://github.com/lukestambaugh96-maker/basements-and-basilisks/pull/4). This project copy and the bundle are for chats without the repo.
