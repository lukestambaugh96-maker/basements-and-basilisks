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
  return cfg;
}

// ---------------- load the engine into a fresh context ----------------
function loadGame(cfg) {
  const src = ['engine.js', 'behaviour.js', 'run.js', 'bot.js'].map(f => fs.readFileSync(path.join(DIR, f), 'utf8')).join('\n');
  const hook = `
const _heal = heal; heal = function (F, src, t, amt) { const r = _heal(F, src, t, amt); if (src && t !== src && src.side === t.side) src.toOthers = (src.toOthers || 0) + (r || 0); return r; };
const _aw = addWard; addWard = function (F, src, t, amt, rep) { const before = t.ward; _aw(F, src, t, amt, rep); if (src && t !== src && src.side === t.side) src.toOthers = (src.toOthers || 0) + Math.max(0, t.ward - before); };
const _ff = finishFight; finishFight = function (run, F) { const extra = F.units.filter(u => u.side === 'H' && !u.summon).map(u => ({ id: u.id, casts: u.casts || 0 })); const r = _ff(run, F); r.extra = extra; r.t = F.t; return r; };
this.G = { HEROES, ENEMIES, ACT1, BOSSES, makeFight, makeHeroUnit, stepFight, seedRng, botRun, parseDice, mod };`;
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

// ---------------- arithmetic (no simulation) ----------------
function heroMath(G, id, cfg) {
  const d = G.HEROES[id], c = d.cfg, R = cfg.rules; const m = s => G.mod(c.stats[s]);
  const hd = R.hp.hitDie[d.cls]; const hp = R.hp.base + Math.floor(R.hp.hitDiceAtTier * (hd + 1) / 2) + m('CON') * R.hp.hitDiceAtTier;
  const K = R.resistance.K; const a = d.atk;
  const per = (a.n || 1) * (a.x + 1) / 2 + (a.flat || 0) + (a.stat ? (a.half ? Math.floor(m(a.stat) / 2) : m(a.stat)) : 0);
  const rawDps = per * (a.strikes || 1) / a.iv;
  const vsArmor = a.type === 'radiant' ? 1 : K / ((a.type === 'magic' ? 12 : 13) + K);
  let cast = '';
  if (d.job === 'attack') cast = `every ${Math.ceil(100 / Math.round(100 * a.iv / R.charge.attackerSecondsPerCast))} attacks (~${R.charge.attackerSecondsPerCast}s of attacking)`;
  else if (d.job === 'hit') cast = `every ${Math.ceil(100 / (d.cHit || R.charge.perHitTaken))} hits taken`;
  else { const s = (d.cTime || R.charge.casterBaseSeconds) / Math.max(0.5, 1 + R.charge.casterIntPerModifier * m('INT')); cast = `every ${s.toFixed(1)}s`; }
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

  Edits: "dane.ability.ward.dice=4d8, klarg.hp=110, rules.resistance.K=25"  (start with a hero id, an enemy id, or rules.)
  --preset prototype2   use the numbers from playable prototype 2 (before the 24-25 Nov approved changes).
  --json                print machine-readable results.`);
  },
  stats() {
    const cfg = buildConfig(); const G = loadGame(cfg);
    const hr = Object.keys(G.HEROES).map(id => { const d = G.HEROES[id], x = heroMath(G, id, cfg); return [d.name, d.role.join('/'), d.job, x.hp, d.ac, d.sr, x.ehpP, x.ehpM, f1(x.rawDps), f1(x.dps), x.cast]; });
    console.log('HEROES (tier 1, no items)\n' + table(['Hero', 'Role', 'Job', 'HP', 'AC', 'SR', 'EHP phys', 'EHP magic', 'Attack DPS raw', 'vs AC13/SR12', 'Ability'], hr));
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
};
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

try { (COMMANDS[cmd] || COMMANDS.help)(); } catch (e) { console.error('Error: ' + e.message); process.exit(1); }
