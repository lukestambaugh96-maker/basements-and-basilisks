#!/usr/bin/env node
// Basements & Basilisks test bench. Reads config/*.config.json, runs the prototype 2 fight engine headless.
// Usage: node bench.js <command> [options]   (node bench.js help)
'use strict';
const fs = require('fs'), vm = require('vm'), path = require('path');
const DIR = __dirname;

// ---------------- options ----------------
const argv = process.argv.slice(2); const cmd = argv[0] || 'help'; const pos = []; const opt = {};
for (let i = 1; i < argv.length; i++) { const a = argv[i]; if (a.startsWith('--')) { const k = a.slice(2); const v = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true; opt[k] = v; } else pos.push(a); }

// ---------------- config + edits ----------------
const readJson = f => JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8'));
function loadConfig() { return { heroes: readJson('config/heroes.config.json'), enemies: readJson('config/enemies.config.json'), rules: readJson('config/rules.config.json') }; }
function parseValue(v) { if (v === undefined) return true; try { return JSON.parse(v); } catch (e) { return v; } }
// "dane.ability.ward.dice=4d8, klarg.hp=110" -> { "heroes.heroes.dane.ability.ward.dice": "4d8", ... }
function parseEdits(str, cfg) {
  const out = {}; if (!str) return out;
  for (const part of String(str).split(/,(?![^{\[]*[}\]])/).map(s => s.trim()).filter(Boolean)) {
    const eq = part.indexOf('='); if (eq < 0) throw new Error('Edit needs "path=value": ' + part);
    out[part.slice(0, eq).trim()] = parseValue(part.slice(eq + 1).trim());
  }
  return out;
}
function resolvePath(p, cfg) {
  const s = p.split('.');
  if (s[0] === 'heroes' && cfg.heroes.heroes[s[1]]) return ['heroes', 'heroes', ...s.slice(1)];
  if (s[0] === 'enemies' && cfg.enemies.enemies[s[1]]) return ['enemies', 'enemies', ...s.slice(1)];
  if (s[0] === 'rules') return s;
  if (cfg.heroes.heroes[s[0]]) return ['heroes', 'heroes', ...s];
  if (cfg.enemies.enemies[s[0]]) return ['enemies', 'enemies', ...s];
  throw new Error('Unknown path: ' + p + ' (start with a hero id, an enemy id, or rules.)');
}
function applyEdits(cfg, edits) {
  for (const [p, v] of Object.entries(edits)) {
    if (p.startsWith('_')) continue;
    const s = resolvePath(p, cfg); let o = cfg;
    for (let i = 0; i < s.length - 1; i++) { if (o[s[i]] == null || typeof o[s[i]] !== 'object') o[s[i]] = {}; o = o[s[i]]; }
    o[s[s.length - 1]] = v;
  }
  return cfg;
}
function buildConfig(extraEdits) {
  const cfg = loadConfig();
  if (opt.preset) applyEdits(cfg, readJson(`presets/${opt.preset}.json`).edits);
  if (extraEdits) applyEdits(cfg, extraEdits);
  if (opt.dice) { if (!['random', 'average', 'average-all'].includes(opt.dice)) throw new Error('--dice must be random, average or average-all'); cfg.rules.dice = Object.assign({}, cfg.rules.dice, { mode: opt.dice }); }
  return cfg;
}

// ---------------- load the engine into a fresh context ----------------
function loadGame(cfg) {
  const src = ['engine.js', 'behaviour.js', 'run.js', 'bot.js', 'bots.js'].map(f => fs.readFileSync(path.join(DIR, f), 'utf8')).join('\n');
  const hook = `
const _heal = heal; heal = function (F, src, t, amt) { const r = _heal(F, src, t, amt); if (src && t !== src && src.side === t.side) src.toOthers = (src.toOthers || 0) + (r || 0); return r; };
const _aw = addWard; addWard = function (F, src, t, amt, rep) { const before = t.ward; _aw(F, src, t, amt, rep); if (src && t !== src && src.side === t.side) src.toOthers = (src.toOthers || 0) + Math.max(0, t.ward - before); };
const _rc = resolveCast; resolveCast = function (F, u) { u._inCast = true; try { return _rc(F, u); } finally { u._inCast = false; } };
const _heal2 = heal; heal = function (F, src, t, amt) { const r = _heal2(F, src, t, amt) || 0; if (src && src === t) src.selfSus = (src.selfSus || 0) + r; if (src && src._inCast) src.abVal = (src.abVal || 0) + r; return r; };
const _aw2 = addWard; addWard = function (F, src, t, amt, rep) { const before = t.ward; _aw2(F, src, t, amt, rep); const g = Math.max(0, t.ward - before); if (src && src === t) src.selfSus = (src.selfSus || 0) + g; if (src && src._inCast) src.abVal = (src.abVal || 0) + g; };
const _ff = finishFight; finishFight = function (run, F) { const extra = F.units.filter(u => u.side === 'H' && !u.summon).map(u => ({ id: u.id, casts: u.casts || 0 })); const r = _ff(run, F); r.extra = extra; r.t = F.t; return r; };
this.G = { HEROES, ENEMIES, ACT1, BOSSES, makeFight, makeHeroUnit, stepFight, seedRng, botRun, parseDice, mod, policyRun, BOTS, replayFight, formation, FORMATIONS, ITEMS, setPlace };`;
  const ctx = { console, Math, CFG: cfg }; vm.createContext(ctx);
  vm.runInContext(src + '\n' + hook, ctx);
  return ctx.G;
}

// ---------------- fights ----------------
function lcg(s) { return () => (s = (s * 1103515245 + 12345) >>> 0) / 4294967296; }
function place(G, ids, enc) {
  const blocked = new Set((enc.terrain || []).filter(([k]) => ['wall', 'chasm', 'forge', 'gate', 'rock'].includes(k)).map(([k, x, y]) => x + ',' + y));
  const used = new Set(); const order = ids.slice().sort((a, b) => (G.HEROES[a].range <= 1 ? 0 : 1) - (G.HEROES[b].range <= 1 ? 0 : 1)); const out = {};
  for (const id of order) { const def = G.HEROES[id]; const front = def.range <= 1 && !def.noMove; const cols = front ? [3, 2, 1, 0] : [1, 0, 2, 3];
    outer: for (const x of cols) for (const y of [2, 3, 1, 4, 0, 5]) { const k = x + ',' + y; if (!used.has(k) && !blocked.has(k)) { used.add(k); out[id] = { x, y }; break outer; } } }
  return out;
}
function partners(G, hid, n) { const others = Object.keys(G.HEROES).filter(k => k !== hid); const r = lcg(77); const P = []; for (let i = 0; i < n; i++) { const a = others[Math.floor(r() * others.length)]; let b; do b = others[Math.floor(r() * others.length)]; while (b === a); P.push([a, b]); } return P; }
const BOSS_ORDER = ['grol', 'nezznar', 'venomfang'];
const FIGHT_LIST = G => [...G.ACT1.slice(1).map(e => ({ enc: e, boss: false })), ...BOSS_ORDER.filter(k => G.BOSSES[k]).concat(Object.keys(G.BOSSES).filter(k => !BOSS_ORDER.includes(k))).map(k => ({ enc: G.BOSSES[k], boss: true }))];
// One hero in N random 3-hero parties (no items, default placement) across fights 2-5 and the bosses. At bosses the hero is T2 (first path).
function testHero(G, hid, N, abilityOn = true) {
  const def = G.HEROES[hid]; const ab0 = def.ab; if (!abilityOn) def.ab = null;
  const P = partners(G, hid, N); const res = { byFight: {}, fights: 0, wins: 0, reg: { n: 0, w: 0 }, dies: 0, allyN: 0, allyDies: 0, dmg: 0, life: 0, taken: 0, given: 0, casts: 0, partyDmg: 0, partyT: 0 };
  FIGHT_LIST(G).forEach(({ enc, boss }, fi) => {
    let w = 0;
    P.forEach(([a, b], i) => {
      G.seedRng(90000 + fi * 1000 + i);
      const ids = [hid, a, b]; const ps = place(G, ids, enc);
      const units = ids.map((id, j) => G.makeHeroUnit({ id, tier: boss && j === 0 ? 2 : 1, t2: boss && j === 0 ? 0 : null, items: [], train: {}, pos: ps[id] }));
      const F = G.makeFight(enc, units, { headless: true }); while (!F.over) G.stepFight(F);
      const won = F.result === 'win'; if (won) w++;
      const h = units[0]; res.fights++; if (won) res.wins++; if (!boss) { res.reg.n++; if (won) res.reg.w++; }
      if (!h.alive) res.dies++; for (const u of units.slice(1)) { res.allyN++; if (!u.alive) res.allyDies++; }
      if (!boss) { res.dmg += h.stat.dmg; res.life += h.alive ? F.t : (h.diedAt || F.t); res.taken += h.stat.taken; res.given += h.toOthers || 0; res.casts += h.casts || 0; res.partyDmg += F.units.filter(u => u.side === 'H').reduce((s, u) => s + u.stat.dmg, 0); res.partyT += F.t; }
    });
    res.byFight[enc.name] = 100 * w / N;
  });
  def.ab = ab0;
  const nReg = res.reg.n;
  return { win: 100 * res.wins / res.fights, reg: 100 * res.reg.w / nReg, byFight: res.byFight, dies: 100 * res.dies / res.fights, allyDies: 100 * res.allyDies / res.allyN,
    dps: res.dmg / Math.max(1, res.life), dmg: res.dmg / nReg, soak: res.taken / nReg, given: res.given / nReg, casts: res.casts / nReg, partyDps: res.partyDmg / Math.max(1, res.partyT) };
}

// Measure one hero against the job benchmark: fights 2-5, tier 1, no items, N random partner pairs. Rates are per 30 s of fight.
function measureHero(G, cfg, hid, N) {
  const P = partners(G, hid, N); const fights = G.ACT1.slice(1); const R = cfg.rules; const K = R.resistance.K;
  const a = { n: 0, w: 0, dies: 0, dmg: 0, life: 0, ab: 0, val: 0, casts: 0, sus: 0, given: 0, t: 0, taken: 0 };
  fights.forEach((enc, fi) => P.forEach(([x, y], i) => {
    G.seedRng(90000 + fi * 1000 + i);
    const ids = [hid, x, y]; const ps = place(G, ids, enc);
    const units = ids.map(id => G.makeHeroUnit({ id, tier: 1, t2: null, items: [], train: {}, pos: ps[id] }));
    const F = G.makeFight(enc, units, { headless: true }); while (!F.over) G.stepFight(F);
    const h = units[0]; a.n++; if (F.result === 'win') a.w++; if (!h.alive) a.dies++;
    a.dmg += h.stat.dmg; a.life += h.alive ? F.t : (h.diedAt || F.t); a.ab += h.stat.abDmg; a.val += (h.abVal || 0); a.casts += h.casts || 0;
    a.sus += h.selfSus || 0; a.given += h.toOthers || 0; a.t += F.t; a.taken += h.stat.taken;
  }));
  const d = G.HEROES[hid], m = heroMath(G, hid, cfg); const per30 = v => v / a.t * 30;
  const abTotal = a.ab + a.val;
  return { id: hid, name: d.name, job: d.cfg.benchJob, size: d.cfg.size, chargeToCast: d.chargeToCast || 100,
    win: 100 * a.w / a.n, dies: 100 * a.dies / a.n, ehp: m.ehpP, dpsFight: a.dmg / Math.max(1, a.t), fightEhp: m.ehpP + per30(a.sus), dps: a.dmg / Math.max(1, a.life),
    castsPer30: per30(a.casts), valuePerCast: a.casts ? abTotal / a.casts : 0, abShare: a.dmg ? a.ab / a.dmg : 0, givenPer30: per30(a.given), takenPer30: per30(a.taken) };
}
function judge(v, range) { if (!range) return ''; const [lo, hi] = range; return v < lo * 0.9 ? 'LOW' : v > hi * 1.1 ? 'HIGH' : 'ok'; }
function judgeHero(r, cfg) {
  const T = cfg.rules.jobTargets[r.job], S = cfg.rules.abilitySizes[r.size]; const out = { ehp: judge(r.fightEhp, T.fightEhp), dps: judge(r.dps, T.dps) };
  const tv = S.valuePerCast; out.value = r.valuePerCast < tv * 0.75 ? 'LOW' : r.valuePerCast > tv * 1.33 ? 'HIGH' : 'ok';
  if (r.job === 'support') out.help = judge(r.givenPer30, T.helpGiven);
  return out;
}

// ---------------- arithmetic (no simulation) ----------------
function heroMath(G, id, cfg) {
  const d = G.HEROES[id], c = d.cfg, R = cfg.rules; const m = s => G.mod(c.stats[s]);
  const hd = R.hp.hitDie[d.cls]; const hp = R.hp.base + Math.floor(R.hp.hitDiceAtTier * (hd + 1) / 2) + m('CON') * R.hp.hitDiceAtTier;
  const K = R.resistance.K; const a = d.atk;
  const per = (a.n || 1) * (a.x + 1) / 2 + (a.flat || 0) + (a.stat ? (a.half ? Math.floor(m(a.stat) / 2) : m(a.stat)) : 0);
  const rawDps = per * (a.strikes || 1) / a.iv;
  const vsArmor = a.type === 'radiant' ? 1 : K / ((a.type === 'magic' ? 12 : 13) + K);
  const need = d.chargeToCast || 100; let cast = '';
  if (d.job === 'attack') { const per = Math.round(100 * a.iv / R.charge.attackerSecondsPerCast); const n = Math.ceil(need / per); cast = `every ${n} attacks (~${f1(n * a.iv)}s)`; }
  else if (d.job === 'hit') cast = `every ${Math.ceil(need / (d.cHit || R.charge.perHitTaken))} hits taken`;
  else { const s = need / (100 / (d.cTime || R.charge.casterBaseSeconds) * Math.max(0.5, 1 + R.charge.casterIntPerModifier * m('INT'))); cast = `every ${s.toFixed(1)}s`; }
  return { hp, ehpP: Math.round(hp * (d.ac + K) / K), ehpM: Math.round(hp * (d.sr + K) / K), rawDps, dps: rawDps * vsArmor, cast };
}
function enemyMath(G, id, cfg) {
  const d = G.ENEMIES[id], K = cfg.rules.resistance.K, a = d.atk;
  const per = (a.n || 1) * (a.x + 1) / 2 + (a.flat || 0); const rawDps = per * (a.strikes || 1) / a.iv;
  return { hp: d.hp, ehpP: Math.round(d.hp * (d.ac + K) / K), ehpM: Math.round(d.hp * (d.sr + K) / K), rawDps, vsTank: rawDps * K / (17 + K) };
}

// ---------------- output ----------------
const pad = (s, n, right) => { s = String(s); return right ? s.padStart(n) : s.padEnd(n); };
const f0 = x => x == null || isNaN(x) ? '-' : Math.round(x).toString();
const f1 = x => x == null || isNaN(x) ? '-' : x.toFixed(1);
function table(cols, rows) {
  const w = cols.map((c, i) => Math.max(c.length, ...rows.map(r => String(r[i]).length)));
  const line = r => r.map((v, i) => pad(v, w[i], i > 0)).join('  ');
  return [line(cols), w.map(n => '-'.repeat(n)).join('  '), ...rows.map(line)].join('\n');
}
const ROLE_TARGET = { Tank: 'dies at or below allies', Support: 'lift 10-30', Damage: 'damage per second' };
function heroList(G) { return pos.length ? pos.filter(x => !x.includes('=')) : Object.keys(G.HEROES); }

// ---------------- commands ----------------
const COMMANDS = {
  help() {
    console.log(`B&B test bench. Numbers: config/heroes.config.json, config/enemies.config.json, config/rules.config.json.

  node bench.js stats                     Arithmetic for every hero and enemy (HP, effective HP, damage per second, cast cadence). Instant.
  node bench.js test <hero> [--n 250]     One hero in random parties: ability on vs off, each fight, deaths, damage, help given.
  node bench.js cast [heroes...] [--n 100]  The whole cast (or the heroes named): one row each, ability on vs off.
  node bench.js try "<edits>" [heroes...]  Apply number edits, then compare before vs after (test for the named heroes, else whole run).
  node bench.js run [--n 300]             Whole Act 1 bot runs (as in the prototype notes).
  node bench.js intro                     Each hero alone vs Fight 1 (every starter must clear it).
  node bench.js bots [bare sensible engine] [--n 60] [--place bot|best|smart|...] [--edits "..."]   The three bot players, whole Act 1 runs each (same seeds).
  node bench.js itemoff [--bots sensible,engine] [--n 60]    Replay each fight with no items, and with each item removed one at a time.
  node bench.js castoff [--bots sensible,engine] [--n 60]    Replay each fight with each hero's ability turned off.
  node bench.js placement [--bots sensible,engine] [--n 60]  Replay each fight in different formations (same party, same dice).
  node bench.js paths [heroes...] [--n 60]  Each hero's tier 2 paths in real fights: tier 1 vs tier 2 no path vs path A vs path B.
  node bench.js luck [--bots sensible,engine] [--n 60]       Each fight on average dice vs normal dice: how often the dice decide it.
    (itemoff, castoff, placement, luck: --reps 3 replays each variant from 3 seeds; --fight 3,4 limits to those fights)
  node bench.js jobs [heroes...] [--n 60]  Every hero against their job and ability-size benchmark (rules.config.json), flagged LOW/HIGH.

  Edits: "dane.ability.ward.dice=4d8, klarg.hp=110, rules.resistance.K=25"  (start with a hero id, an enemy id, or rules.)
  --preset prototype2   use the numbers from playable prototype 2 (before the 24-25 Nov approved changes).
  --dice average        every damage, heal, Ward and bonus die rolls its average (the d20 ability roll stays random).
  --dice average-all    the d20 rolls its average too (10.5; Advantage 13.8, Disadvantage 7.2): no Low, crit or fizzle luck.
  --json                print machine-readable results.`);
  },
  stats() {
    const cfg = buildConfig(); const G = loadGame(cfg);
    const hr = Object.keys(G.HEROES).map(id => { const d = G.HEROES[id], x = heroMath(G, id, cfg); return [d.name, d.role.join('/'), d.job, x.hp, d.ac, d.sr, x.ehpP, x.ehpM, f1(x.rawDps), f1(x.dps), d.chargeToCast || 100, x.cast]; });
    console.log('HEROES (tier 1, no items)\n' + table(['Hero', 'Role', 'Job', 'HP', 'AC', 'SR', 'EHP phys', 'EHP magic', 'Attack DPS raw', 'vs AC13/SR12', 'Charge to cast', 'Ability'], hr));
    const er = Object.keys(G.ENEMIES).map(id => { const d = G.ENEMIES[id], x = enemyMath(G, id, cfg); return [d.name, d.rank, d.hp, d.ac, d.sr, x.ehpP, x.ehpM, f1(x.rawDps), f1(x.vsTank), d.ab ? d.ab.name : '']; });
    console.log('\nENEMIES\n' + table(['Enemy', 'Rank', 'HP', 'AC', 'SR', 'EHP phys', 'EHP magic', 'Attack DPS raw', 'vs AC17', 'Ability'], er));
    console.log('\nEHP = HP x (resistance + K) / K, K = ' + cfg.rules.resistance.K + '. Attack DPS is basic attacks only (abilities not included).');
  },
  test() {
    const hid = pos[0]; const N = +opt.n || 250; const cfg = buildConfig(); const G = loadGame(cfg);
    if (!G.HEROES[hid]) throw new Error('Unknown hero: ' + hid);
    const on = testHero(G, hid, N, true), off = testHero(G, hid, N, false);
    if (opt.json) return console.log(JSON.stringify({ hero: hid, on, off }, null, 1));
    const names = Object.keys(on.byFight);
    console.log(`${G.HEROES[hid].name} (${G.HEROES[hid].role.join('/')}) + 2 random heroes, no items, ${N} parties per fight. Bosses: hero at T2.\n`);
    console.log(table(['', 'Fights 2-5', ...names.map(n => n.split(',')[0]), 'Hero dies', 'Allies die', 'Dmg/s', 'Taken/fight', 'Given to allies', 'Casts'],
      [['Ability on', f0(on.reg) + '%', ...names.map(n => f0(on.byFight[n])), f0(on.dies) + '%', f0(on.allyDies) + '%', f1(on.dps), f0(on.soak), f0(on.given), f1(on.casts)],
       ['Ability off', f0(off.reg) + '%', ...names.map(n => f0(off.byFight[n])), f0(off.dies) + '%', f0(off.allyDies) + '%', f1(off.dps), f0(off.soak), f0(off.given), f1(off.casts)]]));
    console.log(`\nLift from the ability (fights 2-5): ${f0(on.reg - off.reg)} points.`);
  },
  cast() {
    const N = +opt.n || 100; const cfg = buildConfig(); const G = loadGame(cfg); const rows = []; const js = {};
    for (const id of heroList(G)) {
      const on = testHero(G, id, N, true), off = testHero(G, id, N, false); const d = G.HEROES[id]; js[id] = { on, off };
      rows.push([d.name, d.role.join('/'), f0(on.reg) + '%', f0(on.reg - off.reg), f0(on.dies) + '%', f0(on.allyDies) + '%', f1(on.dps), f0(on.soak), f0(on.given), f1(on.casts)]);
      process.stderr.write('.');
    }
    process.stderr.write('\n');
    if (opt.json) return console.log(JSON.stringify(js, null, 1));
    console.log(`Whole cast: each hero + 2 random heroes, no items, ${N} parties per fight, fights 2-5.\n`);
    console.log(table(['Hero', 'Role', 'Win', 'Lift', 'Dies', 'Allies die', 'Dmg/s', 'Taken/fight', 'Given to allies', 'Casts'], rows));
  },
  try() {
    const editStr = pos.shift(); const N = +opt.n || 250;
    const before = buildConfig(); const after = buildConfig(parseEdits(editStr, before));
    const GB = loadGame(before), GA = loadGame(after);
    console.log('Edits: ' + editStr + '\n');
    const heroes = pos.filter(x => GB.HEROES[x]);
    if (heroes.length) {
      const rows = [];
      for (const id of heroes) { const b = testHero(GB, id, N, true), a = testHero(GA, id, N, true); const names = Object.keys(b.byFight);
        rows.push([GB.HEROES[id].name + ' before', f0(b.reg) + '%', ...names.map(n => f0(b.byFight[n])), f0(b.dies) + '%', f0(b.allyDies) + '%']);
        rows.push([GA.HEROES[id].name + ' after', f0(a.reg) + '%', ...names.map(n => f0(a.byFight[n])), f0(a.dies) + '%', f0(a.allyDies) + '%']); }
      const names = Object.keys(testHero(GB, heroes[0], 1, true).byFight);
      console.log(table(['', 'Fights 2-5', ...names.map(n => n.split(',')[0]), 'Hero dies', 'Allies die'], rows));
    } else { const n = +opt.n || 300; console.log('Before:'); runReport(GB, n); console.log('\nAfter:'); runReport(GA, n); }
  },
  run() { const cfg = buildConfig(); const G = loadGame(cfg); runReport(G, +opt.n || 300); },
  intro() {
    const cfg = buildConfig(opt.edits ? parseEdits(opt.edits, loadConfig()) : null); const G = loadGame(cfg); const rows = [];
    for (const id of Object.keys(G.HEROES)) { let w = 0; const ts = [];
      for (let i = 0; i < 50; i++) { G.seedRng(5000 + i); const u = G.makeHeroUnit({ id, tier: 1, items: [], train: {}, pos: { x: 2, y: 2 } }); const F = G.makeFight(G.ACT1[0], [u], { headless: true }); while (!F.over) G.stepFight(F); if (F.result === 'win') { w++; ts.push(F.t); } }
      ts.sort((a, b) => a - b); rows.push([G.HEROES[id].name, (100 * w / 50).toFixed(0) + '%', ts.length ? f1(ts[Math.floor((ts.length - 1) / 2)]) + 's' : '-']); }
    console.log('Each hero alone vs Fight 1 (Goblin Ambush), 50 tries:\n' + table(['Hero', 'Wins', 'Median length'], rows));
  },
  jobs() {
    const N = +opt.n || 60; const cfg = buildConfig(opt.edits ? parseEdits(opt.edits, loadConfig()) : null); const G = loadGame(cfg); const rows = []; const js = [];
    for (const id of heroList(G)) { const r = measureHero(G, cfg, id, N); const j = judgeHero(r, cfg); js.push(Object.assign(r, { judge: j })); process.stderr.write('.'); }
    process.stderr.write('\n');
    if (opt.json) return console.log(JSON.stringify(js, null, 1));
    const T = cfg.rules.jobTargets, S = cfg.rules.abilitySizes; const tag = (v, j) => v + (j && j !== 'ok' ? ' ' + j : '');
    for (const job of ['frontline', 'brawler', 'attacker', 'caster', 'support']) {
      const g = js.filter(r => r.job === job); if (!g.length) continue; const t = T[job];
      console.log(`\n${job.toUpperCase()}  targets: fight EHP ${t.fightEhp.join('-')}, damage/s ${t.dps.join('-')}${t.helpGiven ? ', help given ' + t.helpGiven.join('-') : ''}`);
      console.log(table(['Hero', 'Size', 'Charge', 'Win', 'Dies', 'Fight EHP', 'Damage/s', 'Casts/30s', 'Value/cast (target)', 'Ability share', 'Help given'],
        g.map(r => [r.name, r.size, r.chargeToCast, f0(r.win) + '%', f0(r.dies) + '%', tag(f0(r.fightEhp), r.judge.ehp), tag(f1(r.dps), r.judge.dps), f1(r.castsPer30), tag(f0(r.valuePerCast), r.judge.value) + ' (' + S[r.size].valuePerCast + ')', f0(100 * r.abShare) + '%', tag(f0(r.givenPer30), r.judge.help)])));
    }
  },
  bots() {
    const N = +opt.n || 60; const cfg = buildConfig(opt.edits ? parseEdits(opt.edits, loadConfig()) : null); const G = loadGame(cfg);
    const ids = pos.length ? pos : ['bare', 'sensible', 'engine']; const out = {}; G.setPlace(opt.place || 'bot', +opt.trials || 0);
    for (const b of ids) out[b] = botReport(G, b, N, +opt.seed || 1000);
    if (opt.json) return console.log(JSON.stringify(out, null, 1));
    const names = ['Goblin Ambush', "Klarg's Cave", "Glasstaff's Hideout", 'Thundertree', 'Forge of Spells', 'Boss'];
    console.log(`Bot players, ${N} whole Act 1 runs each (same seeds). Placement: ${opt.place || 'bot'}. Dice: ${opt.dice || 'random'}.\n`);
    console.log(table(['Bot', 'Cleared', 'Run ends at (fight 1-5, B)', 'Median end', 'Free loss used', ...names.map(n => n.split(/[ ']/)[0]), 'HP lost F2-5', 'Items@F5', 'T2@F5'],
      ids.map(b => { const r = out[b]; return [BOTS_LABEL[b] || b, f0(r.clear) + '%', r.ends, r.medianEnd, f0(r.freeLoss) + '%', ...names.map((n, i) => r.win[i] == null ? '-' : f0(r.win[i]) + '%'), f0(r.hpLost) + '%', f1(r.itemsF5), f1(r.t2F5)]; })));
    console.log('\nWin % per fight counts every attempt (a retry after the free loss is a second attempt). Run ends: how many runs ended at each fight; B = boss, W = cleared.');
  },
  itemoff() {
    const { G, snaps } = collectSnaps(); const per = {}, items = {};
    for (const s of snaps) {
      const k = fightKey(G, s); const base = replayAvg(G, s), none = replayAvg(G, s, { noItems: true });
      const p = per[k] = per[k] || { n: 0, full: 0, none: 0, one: 0, oneN: 0, hpFull: 0, hpNone: 0 };
      p.n++; p.full += base.win; p.none += none.win; p.hpFull += base.hpLost; p.hpNone += none.hpLost;
      for (const r of s.recs) r.items.forEach((ir, i) => { const v = replayAvg(G, s, { drop: [r.uid, i] }); p.one += v.win; p.oneN++;
        const key = ir.id; const o = items[key] = items[key] || { n: 0, w: 0, wo: 0, name: (G.ITEMS[key] || {}).name || key }; o.n++; o.w += base.win; o.wo += v.win; });
    }
    if (opt.json) return console.log(JSON.stringify({ per, items }, null, 1));
    console.log(`Item-off test (${+opt.reps || 1} replay${(+opt.reps || 1) > 1 ? 's' : ''} each): ${snaps.length} fights from ${opt.bots || 'sensible,engine'} runs, each replayed from the same dice.\n`);
    console.log(table(['Fight', 'Fights', 'Full build', 'One item removed', 'No items', 'HP lost full', 'HP lost no items'], Object.keys(per).sort().map(k => { const p = per[k];
      return [k, p.n, pc(p.full, p.n), p.oneN ? pc(p.one, p.oneN) : '-', pc(p.none, p.n), pc(p.hpFull, p.n), pc(p.hpNone, p.n)]; })));
    console.log('\nEach item: win with it vs the same fight with only it removed (fights it was held in).\n');
    console.log(table(['Item', 'Held', 'With', 'Without', 'Drop'], Object.values(items).filter(o => o.n >= (+opt.min || 10)).sort((a, b) => (b.w - b.wo) / b.n - (a.w - a.wo) / a.n)
      .map(o => [o.name, o.n, pc(o.w, o.n), pc(o.wo, o.n), f0(100 * (o.w - o.wo) / o.n)])));
  },
  castoff() {
    const { G, snaps } = collectSnaps(); const heroes = {}, per = {};
    for (const s of snaps) {
      const k = fightKey(G, s); const base = replayAvg(G, s); const p = per[k] = per[k] || { n: 0, w: 0, off: 0, offN: 0 }; p.n++; p.w += base.win;
      for (const r of s.recs) { const v = replayAvg(G, s, { noAbility: r.uid }); p.off += v.win; p.offN++;
        const o = heroes[r.id] = heroes[r.id] || { n: 0, w: 0, wo: 0, dies: 0, diesOff: 0, name: G.HEROES[r.id].name, job: G.HEROES[r.id].cfg.benchJob };
        o.n++; o.w += base.win; o.wo += v.win; o.dies += base.deadOf(r.uid); o.diesOff += v.deadOf(r.uid); }
    }
    if (opt.json) return console.log(JSON.stringify({ per, heroes }, null, 1));
    console.log(`Cast-off test (${+opt.reps || 1} replay${(+opt.reps || 1) > 1 ? 's' : ''} each): ${snaps.length} fights from ${opt.bots || 'sensible,engine'} runs, each replayed with one hero's ability turned off.\n`);
    console.log(table(['Fight', 'Fights', 'Win', 'One ability off (avg)'], Object.keys(per).sort().map(k => { const p = per[k]; return [k, p.n, pc(p.w, p.n), pc(p.off, p.offN)]; })));
    console.log('\nEach hero: party win with vs without that hero\'s ability. A big drop means the party leans on that hero.\n');
    console.log(table(['Hero', 'Job', 'Fights', 'With', 'Without', 'Drop', 'Hero dies (with / without)'], Object.values(heroes).sort((a, b) => (b.w - b.wo) / b.n - (a.w - a.wo) / a.n)
      .map(o => [o.name, o.job, o.n, pc(o.w, o.n), pc(o.wo, o.n), f0(100 * (o.w - o.wo) / o.n), pc(o.dies, o.n) + ' / ' + pc(o.diesOff, o.n)])));
  },
  placement() {
    const { G, snaps } = collectSnaps(); const F = (opt.formations ? String(opt.formations).split(',') : G.FORMATIONS); const per = {}, all = { n: 0, best: 0, worst: 0 };
    let seed = 7; const rng = () => (seed = (seed * 1103515245 + 12345) >>> 0) / 4294967296;
    for (const s of snaps) {
      const k = fightKey(G, s); const p = per[k] = per[k] || { n: 0, best: 0, worst: 0 }; p.n++; all.n++; const res = [];
      for (const f of F) { const v = replayAvg(G, s, { pos: G.formation(s, f, rng) }); p[f] = (p[f] || 0) + v.win; all[f] = (all[f] || 0) + v.win; res.push(v.win); }
      const b = Math.max(...res), w = Math.min(...res); p.best += b; p.worst += w; all.best += b; all.worst += w;
    }
    if (opt.json) return console.log(JSON.stringify(per, null, 1));
    console.log(`Placement test (${+opt.reps || 1} replay${(+opt.reps || 1) > 1 ? 's' : ''} each): ${snaps.length} fights from ${opt.bots || 'sensible,engine'} runs, the same party and dice in each formation.`);
    console.log('bot = how the bots place; smart = frontliners centre front, melee beside them, ranged behind (towers first); swapped = ranged in front, melee behind;');
    console.log('tight = clumped centre; spread = rows far apart; wall = everyone in front; back = everyone at the back; random = random cells.');
    console.log("Best / Worst = each party's best and worst formation, fight by fight (averaged over --reps): how much placement can swing a fight.\n");
    const rows = Object.keys(per).sort().map(k => { const p = per[k]; return [k, p.n, ...F.map(f => pc(p[f] || 0, p.n)), pc(p.best, p.n), pc(p.worst, p.n)]; });
    rows.push(['All', all.n, ...F.map(f => pc(all[f] || 0, all.n)), pc(all.best, all.n), pc(all.worst, all.n)]);
    console.log(table(['Fight', 'Fights', ...F, 'Best', 'Worst'], rows));
  },
  luck() {
    // Same snapshots, two engines: one rolling average dice (everything, d20 included), one rolling normal dice --reps times (default 5).
    if (!opt.reps) opt.reps = 5; const R = +opt.reps;
    const { G, snaps } = collectSnaps(); const cfgA = buildConfig(opt.edits ? parseEdits(opt.edits, loadConfig()) : null); cfgA.rules.dice = { mode: String(opt.dice && opt.dice !== 'random' ? opt.dice : 'average-all') }; const GA = loadGame(cfgA);
    const per = {}, all = { n: 0 };
    for (const s of snaps) {
      const k = fightKey(G, s); const a = GA.replayFight(s); const r = replayAvg(G, s);
      for (const p of [per[k] = per[k] || { n: 0 }, all]) { p.n++; p.avgWin = (p.avgWin || 0) + a.win; p.randWin = (p.randWin || 0) + r.win; p.coin = (p.coin || 0) + (r.win > 0.2 && r.win < 0.8);
        p.upset = (p.upset || 0) + (a.win && r.win < 0.5); p.rescue = (p.rescue || 0) + (!a.win && r.win >= 0.5); p.hpA = (p.hpA || 0) + a.hpLost; p.hpR = (p.hpR || 0) + r.hpLost; }
    }
    if (opt.json) return console.log(JSON.stringify({ per, all }, null, 1));
    console.log(`Luck test: ${snaps.length} fights from ${opt.bots || 'sensible,engine'} runs. Each fight played once with average dice (${cfgA.rules.dice.mode}) and ${R} times with normal dice.`);
    console.log('Coin flip = normal dice win it between 20% and 80% of the time. Upset = average dice win, normal dice lose most tries. Rescue = the reverse.\n');
    const rows = Object.keys(per).sort().map(k => [k, per[k]]).concat([['All', all]]).map(([k, p]) => [k, p.n, pc(p.avgWin, p.n), pc(p.randWin, p.n), pc(p.coin, p.n), pc(p.upset, p.n), pc(p.rescue, p.n), pc(p.hpA, p.n), pc(p.hpR, p.n)]);
    console.log(table(['Fight', 'Fights', 'Win, average dice', 'Win, normal dice', 'Coin flip', 'Upset', 'Rescue', 'HP lost avg', 'HP lost normal'], rows));
  },
  paths() {
    // Every hero's tier 2 paths, in real fights: each fight a bot party walked into (fight 3 on, items and partners as they were),
    // replayed with one hero forced to tier 2 with no path, path A, path B, and at tier 1, all on the same dice.
    if (!opt.fight) opt.fight = '3,4,5,6';
    const { G, snaps } = collectSnaps(); const H = {};
    const only = pos.filter(x => G.HEROES[x]);
    for (const s of snaps) for (const r of s.recs) {
      if (only.length && !only.includes(r.id)) continue;
      const boss = s.fight === 5; const h = H[r.id] = H[r.id] || { reg: { n: 0 }, boss: { n: 0 } }; const g = boss ? h.boss : h.reg; g.n++;
      const variant = (tier, t2) => { const c = JSON.parse(JSON.stringify(s)); const rr = c.recs.find(x => x.uid === r.uid); rr.tier = tier; rr.t2 = t2; return replayAvg(G, c).win; };
      g.t1 = (g.t1 || 0) + variant(1, null); g.t2 = (g.t2 || 0) + variant(2, null); g.a = (g.a || 0) + variant(2, 0); g.b = (g.b || 0) + variant(2, 1);
    }
    if (opt.json) return console.log(JSON.stringify(H, null, 1));
    console.log(`Specialization test (${+opt.reps || 1} replay${(+opt.reps || 1) > 1 ? 's' : ''} each): fights ${opt.fight} from ${opt.bots || 'sensible,engine'} runs (${snaps.length} fights).`);
    console.log('Each fight a hero was in is replayed with that hero at tier 1, at tier 2 with no path, and at tier 2 with each path. Party, items and dice stay the same.');
    console.log('Rank-up = tier 2 with no path minus tier 1. A and B = what each path adds on top of that. Flags: "flat" = path adds under 3 points; "lopsided" = paths 10+ points apart.\n');
    const lift = (x, g) => g.n ? 100 * (x - g.t2) / g.n : NaN;
    for (const [label, key] of [['Regular fights (Glasstaff, Thundertree, Forge)', 'reg'], ['Bosses (Grol, Nezznar, Venomfang)', 'boss']]) {
      const rows = Object.keys(H).filter(id => H[id][key].n >= (+opt.min || 8)).sort((x, y) => G.HEROES[x].name.localeCompare(G.HEROES[y].name)).map(id => {
        const g = H[id][key], P = PATH_NAMES[id] || ['A', 'B']; const la = lift(g.a, g), lb = lift(g.b, g); const fl = [];
        if (la < 3) fl.push(P[0] + ' flat'); if (lb < 3) fl.push(P[1] + ' flat'); if (Math.abs(la - lb) >= 10) fl.push('lopsided');
        return [G.HEROES[id].name, g.n, pc(g.t1, g.n), pc(g.t2, g.n), f0(100 * (g.t2 - g.t1) / g.n), P[0], pc(g.a, g.n), sg(la), P[1], pc(g.b, g.n), sg(lb), fl.join(', ')];
      });
      console.log(label + '\n' + table(['Hero', 'Fights', 'T1', 'T2 no path', 'Rank-up', 'Path A', 'Win', 'Adds', 'Path B', 'Win', 'Adds', 'Flags'], rows) + '\n');
    }
    const few = (only.length ? only : Object.keys(G.HEROES)).filter(id => !H[id] || H[id].reg.n + H[id].boss.n < (+opt.min || 8)).map(id => G.HEROES[id].name);
    if (few.length) console.log('Too few fights to judge (bots rarely field them): ' + few.join(', ') + '. Raise --n.');
    console.log('Not measured here: gold made in a run (Pickpocket, Gains), or anything that grows across fights.');
  },
};
const sg = x => isNaN(x) ? '-' : (x >= 0 ? '+' : '') + Math.round(x);
// Tier 2 path names, in t2 order (0 = A, 1 = B), from behaviour.js.
const PATH_NAMES = { arthur: ['Ready First', 'Second Wind'], bram: ['Preserve Life', 'Turn the Faithless'], faelan: ['Spell Weave', 'Shared Recovery'], wallaby: ['Cutthroat', 'Pickpocket'], dane: ['Duelist', 'Retribution'], lorcan: ['Colossus Slayer', 'Horde Breaker'], juniper: ['Bramble Guard', 'Bramble Stalker'], rosalind: ['Muse', 'Encore'], zark: ['Bear Totem', 'Wolf Totem'], naill: ['Stunning Strike', 'Step of the Wind'], nettle: ["Dark One's Blessing", 'Hellfire Pact'], pillar: ['Unbreakable', 'Avalanche'], laurel: ['Ensnaring Smite', 'Warding Smite'], lumen: ['Searing Focus', 'Healing Light'], jamison: ['Balm of Peace', 'Protective Bond'], zoe: ['Rune Carver', 'Just the Thing'], gilthrax: ['Gilded Hoard', "Bodyguard's Fee"], velith: ['First Blood', 'Nightshade Vials'], cinder: ['Twinned Spell', 'Empowered Spell'], gains: ['Compound Interest', 'Liquid Assets'], corvin: ["Stalker's Flurry", 'First Strike'], saint: ['Invoke Duplicity', 'Cloak of Shadows'], kaska: ['Panther', 'Dire Bear'], toot: ["Busker's Rhythm", 'Street Performer'] };
const BOTS_LABEL = { bare: 'Never buys', sensible: 'Buys sensibly', engine: 'Builds an engine' };
function runReport(G, N) {
  const q = (a, p) => { const s = a.slice().sort((x, y) => x - y); return s[Math.floor((s.length - 1) * p)]; };
  const per = {}; let wins = 0; const reached = {};
  for (let i = 0; i < N; i++) {
    const { run, fights } = G.botRun(1000 + i); if (run.won) wins++;
    const last = fights[fights.length - 1]; reached[last.fight] = (reached[last.fight] || 0) + (run.won ? 0 : 1);
    for (const f of fights) { const k = f.fight === 5 ? 'Boss ' + f.name : (f.fight + 1) + ' ' + f.name; const p = per[k] = per[k] || { t: [], lost: [], w: 0, n: 0 }; p.n++; if (f.result === 'win') { p.w++; p.t.push(f.t); } p.lost.push(f.hpLostPct); }
  }
  console.log(`Runs: ${N}   Act 1 cleared: ${(100 * wins / N).toFixed(1)}%   lost runs ended at fight: ${JSON.stringify(reached)}`);
  console.log(table(['Fight', 'Played', 'Win', 'Length p10/med/p90', 'HP lost'], Object.keys(per).sort().map(k => { const p = per[k]; return [k, p.n, f0(100 * p.w / p.n) + '%', `${f0(q(p.t, .1))}/${f0(q(p.t, .5))}/${f0(q(p.t, .9))}s`, f0(100 * p.lost.reduce((a, b) => a + b, 0) / p.n) + '%']; })));
}

const pc = (a, n) => n ? f0(100 * a / n) + '%' : '-';
const FIGHT_NAMES = ['1 Goblin Ambush', "2 Klarg's Cave", "3 Glasstaff", '4 Thundertree', '5 Forge of Spells'];
function fightKey(G, s) { return s.fight < 5 ? FIGHT_NAMES[s.fight] : '6 Boss ' + s.bossId; }
// Snapshots of every fight (2 onward) the chosen bots walked into, from --n whole runs each.
// Replay a snapshot --reps times from different seeds and average (wins and HP lost become fractions).
function replayAvg(G, s, mod) { const R = +opt.reps || 1; let w = 0, hp = 0; const dead = {}; for (let j = 0; j < R; j++) { const v = G.replayFight(Object.assign({}, s, { seed: s.seed + j * 7919 }), mod); w += v.win; hp += v.hpLost; for (const u of v.dead) dead[u] = (dead[u] || 0) + 1 / R; } return { win: w / R, hpLost: hp / R, dead, deadOf: uid => dead[uid] || 0 }; }
function collectSnaps() {
  const cfg = buildConfig(opt.edits ? parseEdits(opt.edits, loadConfig()) : null); const G = loadGame(cfg);
  const bots = String(opt.bots || 'sensible,engine').split(','); const N = +opt.n || 60; const seed0 = +opt.seed || 1000; const snaps = [];
  const only = opt.fight ? String(opt.fight).split(',').map(Number) : null;
  for (const b of bots) for (let i = 0; i < N; i++) { const { fights } = G.policyRun(seed0 + i, b); for (const f of fights) if (f.fight >= 1 && (!only || only.includes(f.fight + 1))) snaps.push(f.snap); }
  return { G, snaps };
}
function botReport(G, b, N, seed0) {
  const ends = {}; let clear = 0, free = 0, hp = 0, hpN = 0, itF5 = 0, t2F5 = 0, nF5 = 0; const att = [0, 0, 0, 0, 0, 0], won = [0, 0, 0, 0, 0, 0]; const endIdx = [];
  for (let i = 0; i < N; i++) {
    const { run, fights } = G.policyRun(seed0 + i, b); if (run.won) clear++; if (run.freeLossUsed) free++;
    const last = fights[fights.length - 1]; const k = run.won ? 'W' : (last.fight === 5 ? 'B' : String(last.fight + 1)); ends[k] = (ends[k] || 0) + 1; endIdx.push(run.won ? 7 : last.fight + 1);
    let seenF5 = false;
    for (const f of fights) { att[f.fight]++; if (f.result === 'win') won[f.fight]++; if (f.fight >= 1 && f.fight <= 4) { hp += f.hpLostPct; hpN++; } if (f.fight === 4 && !seenF5) { seenF5 = true; itF5 += f.items; t2F5 += f.t2; nF5++; } }
  }
  endIdx.sort((a, c) => a - c); const med = endIdx[Math.floor((N - 1) / 2)];
  const order = ['1', '2', '3', '4', '5', 'B', 'W'];
  return { clear: 100 * clear / N, freeLoss: 100 * free / N, ends: order.filter(k => ends[k]).map(k => k + ':' + ends[k]).join(' '), endsRaw: ends, medianEnd: med === 7 ? 'cleared' : med === 6 ? 'boss' : 'fight ' + med,
    win: att.map((a, i) => a ? 100 * won[i] / a : null), hpLost: hpN ? 100 * hp / hpN : 0, itemsF5: nF5 ? itF5 / nF5 : NaN, t2F5: nF5 ? t2F5 / nF5 : NaN };
}

try { (COMMANDS[cmd] || COMMANDS.help)(); } catch (e) { console.error('Error: ' + e.message); process.exit(1); }
