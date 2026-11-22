#!/usr/bin/env node
/* Comprehensive v0.23 verification & 5-Persona 3-Act Meta Calibration Runner */
import fs from 'fs';

const files = [
  'src/01-geo.js', 'src/02-enemies.js', 'src/03-heroes.js',
  'src/04-items.js', 'src/05-engine.js', 'src/06-adventure.js'
];
const engineCode = files.map(f => fs.readFileSync(f, 'utf8')).join('\n');
const RUNS_PER_PERSONA = Number(process.argv[2] || 25);

const report = new Function(engineCode + `\nreturn (() => {
  /* ===== 1. STATIC & STRUCTURAL INVARIANTS ===== */
  if (HERO_ORDER.length !== 24) throw new Error('Expected 24 heroes');
  if (Object.keys(CLASS_KW).length !== 13) throw new Error('Expected 13 CLASS_KW');
  if (EPIC_BOON_KEYS.length !== 9) throw new Error('Expected 9 Epic Boons');
  if (MULTICLASS_KEYS.length !== 12) throw new Error('Expected 12 Multiclass dips');
  if (ALL_ITEM_KEYS.length !== 82) throw new Error('Expected 82 items');
  if (STANDARD_ITEM_KEYS.length !== 58 || UNIQUE_ITEM_KEYS.length !== 24) throw new Error('Expected 58 std + 24 unique');
  for (let r = 0; r < 5; r++) {
    const exp = [1, 2, 3, 4, 6][r];
    const sum = { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 };
    ITEM_BY_R[r].forEach(k => Object.entries(ITEMS[k].a || {}).forEach(([a, v]) => sum[a] += v / 2));
    for (const a of ATTRS) if (sum[a] !== exp) throw new Error('Parity failed tier ' + r + ' ' + a);
  }
  const mk = v => ({ ac: v, sr: v, f: {}, st: { acid: 0, exp: 0, acS: 0, acBT: 0, acB: 0, srBT: 0, srB: 0 }, auraAC: 0, auraSR: 0 });
  const dr14 = +(1 - mitigate(null, null, mk(14), 100, { kind: 'phys' }) / 100).toFixed(3);
  if (dr14 !== 0.5) throw new Error('Expected K=14 DR 50%');

  /* ===== 2. 5-PERSONA FULL 3-ACT CAMPAIGN SIMULATION ===== */
  function makeRng(seed) {
    let s = seed >>> 0;
    return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  }

  function autoPickUpgrades(run, rand, persona) {
    run.team.forEach(h => {
      if (h.tier >= 2 && !h.path) {
        const ps = H[h.key].paths;
        h.path = persona === 'casual' ? ps[Math.floor(rand() * ps.length)].k : ps[0].k;
      }
      if (h.tier >= 3 && !h.asi) h.asi = H[h.key].pair[1];
      if (h.tier >= 4 && !h.boon) {
        const off = rollEpicBoonOffer(rand);
        h.boon = off[0];
      }
    });
  }

  function autoEquipAll(run) {
    for (let si = run.stash.length - 1; si >= 0; si--) {
      const k = run.stash[si];
      const it = ITEMS[k];
      if (!it) continue;
      const cands = run.team
        .filter(h => h.items.length < slotsOf(h) && canCarry(h, k))
        .sort((a, b) => {
          const scoreH = h => {
            const d = H[h.key];
            let sc = 0;
            if ((it.kwHooks || []).some(w => heroKeywords(h).includes(w))) sc += 15;
            if (it.a) Object.entries(it.a).forEach(([ak, av]) => { if (d.pair.includes(ak)) sc += av * 2; });
            if ((it.ac || it.hp) && d.role === 'Tank') sc += 6;
            if ((it.pen || it.dm || it.spen) && d.role === 'Damage') sc += 5;
            return sc - h.items.length * 2;
          };
          return scoreH(b) - scoreH(a);
        });
      if (cands[0]) equip(run, cands[0].uid, si);
    }
  }

  function shopDecision(run, rand, persona) {
    const isZero = persona === 'zero_item';
    const isCasual = persona === 'casual';
    const isGreed = persona === 'greed';
    const isSyn = persona === 'synergy';
    const isSmart = persona === 'competent' || isSyn || isGreed;

    const tryShopPass = () => {
      // 1. Recruit up to 4 heroes & buy upgrades first (smart personas prefer role balance + shared Class Keywords)
      const teamKws = new Set(run.team.flatMap(h => heroKeywords(h)));
      const hasTank = run.team.some(h => H[h.key].role === 'Tank');
      const hasSup = run.team.some(h => H[h.key].role === 'Support');
      const heroIdxs = run.shop.heroes.map((k, i) => ({ k, i })).filter(x => x.k);
      if (isSmart) {
        heroIdxs.sort((a, b) => {
          const oa = heroOffer(run, a.k, a.i), ob = heroOffer(run, b.k, b.i);
          const sc = (k, o) => (o.upgrade ? 14 : 0)
            + (isSyn ? (H[k].ckw || []).filter(w => teamKws.has(w.k)).length * 5 : 0)
            + (!hasTank && H[k].role === 'Tank' ? 7 : 0)
            + (!hasSup && H[k].role === 'Support' ? 4 : 0);
          return sc(b.k, ob) - sc(a.k, oa);
        });
      }
      for (const { k, i } of heroIdxs) {
        const o = heroOffer(run, k, i);
        if (o.maxed || !canAfford(run, o.price)) continue;
        if (o.isNew && run.team.length < 4) {
          if (isGreed && run.team.length >= 2 && !['zoe', 'toot', 'gilthrax', 'gains'].includes(k) && rand() < .35) continue;
          buyHero(run, i);
          autoPickUpgrades(run, rand, persona);
        } else if (o.upgrade) {
          buyHero(run, i);
          autoPickUpgrades(run, rand, persona);
        }
      }
      // 2. Buy items (unless zero_item; smart players fill 4 heroes before buying Common items!)
      if (!isZero) {
        const buyChance = isCasual ? 0.45 : 1.0;
        const itemIdxs = run.shop.items.map((k, i) => ({ k, i })).filter(x => x.k)
          .sort((a, b) => (ITEMS[b.k].r || 0) - (ITEMS[a.k].r || 0));
        for (const { k, i } of itemIdxs) {
          const p = itemPrice(run, i);
          if (!canAfford(run, p) || run.stash.length >= ECON.stash) continue;
          if (rand() > buyChance) continue;
          const it = ITEMS[k];
          if (isSmart && run.team.length < 4 && it.r <= 1 && run.gold < p + 3) continue;
          if (isSyn && it.r === 0 && run.adv.act >= 2 && run.gold < 7) continue;
          const openSlots = run.team.reduce((a, h) => a + Math.max(0, slotsOf(h) - h.items.length), 0);
          if (isSmart && openSlots <= 0 && it.r <= 1) continue;
          buyItem(run, i);
        }
        autoEquipAll(run);
      }
    };

    tryShopPass();
    const maxRR = isCasual || isZero ? 0 : 1;
    for (let r = 0; r < maxRR; r++) {
      if (run.gold >= rerollPrice(run) + 9 && run.team.length >= 4) {
        if (reroll(run, rand)) tryShopPass();
      }
    }
    autoEquipAll(run);
  }

  function pickNextNode(run, rand, persona) {
    const opts = nextNodes(run);
    if (!opts.length) return null;
    if (persona === 'casual' || persona === 'zero_item') return opts[Math.floor(rand() * opts.length)];
    const avgTier = run.team.reduce((a, h) => a + h.tier, 0) / Math.max(1, run.team.length);
    const totalItems = run.team.reduce((a, h) => a + h.items.length, 0);
    const score = n => {
      const W = run.adv.wanderer;
      if (W && W.alive && W.r === n.r && W.i === n.i) return (persona === 'synergy' && avgTier >= 3.2 && totalItems >= 6) ? 7 : -10;
      if (n.kind === 'train') return 11;
      if (n.kind === 'curio') return run.gold >= 5 ? 10 : 3;
      if (n.kind === 'multiclass') return 9;
      if (n.kind === 'treasure') return 9;
      if (n.kind === 'fight') return 8; // Combat wins grant gold + Piggy + free Camp Shop!
      if (n.kind === 'elite') return (avgTier >= 2.0 && totalItems >= 2) ? 8.5 : 4;
      if (n.kind === 'miniboss') return (run.team.length >= 4 && avgTier >= 1.75) ? 8.5 : 3;
      if (n.kind === 'quest') return 6;
      if (n.kind === 'mystery') return 5;
      if (n.kind === 'rest') return 4;
      return 5;
    };
    return opts.slice().sort((a, b) => score(b) - score(a))[0];
  }

  const personas = ['zero_item', 'casual', 'competent', 'synergy', 'greed'];
  const summary = {};
  const bossStats = {};
  const heroStatsAcc = {};

  for (const persona of personas) {
    let wins = 0, piggyBroke = 0, totalFights = 0, act1Clears = 0, act2Clears = 0, totalGold = 0;
    for (let rIdx = 0; rIdx < ${RUNS_PER_PERSONA}; rIdx++) {
      const rand = makeRng((personas.indexOf(persona) + 1) * 10000 + rIdx * 97 + 13);
      const run = newAdventure(rand);
      const usePacks = persona === 'greed' ? ['market', 'tavern', 'campfire'] : PACK_ORDER;
      startRunWithPacks(run, usePacks, rand);
      const starter = persona === 'greed'
        ? (run.firstPick.find(k => ['zoe', 'toot', 'gilthrax', 'gains'].includes(k)) || run.firstPick[0])
        : run.firstPick[Math.floor(rand() * run.firstPick.length)];
      freeHero(run, starter);
      startAct(run, rand);

      let guard = 0;
      while (!run.over && guard++ < 80) {
        if (run.adv.stage === 'shop') {
          shopDecision(run, rand, persona);
          if (run.adv.retryPending) {
            run.adv.stage = 'battle';
          } else {
            run.adv.stage = 'map';
          }
          continue;
        }
        if (run.adv.stage === 'map') {
          const n = pickNextNode(run, rand, persona);
          if (!n) break;
          const k = enterNode(run, n, rand);
          if (k === 'battle') continue;
          // Resolve non-combat node
          if (k === 'train') {
            const low = run.team.slice().sort((a, b) => a.tier - b.tier)[0];
            if (low && low.tier < 4) { promoteHero(run, low.uid); autoPickUpgrades(run, rand, persona); }
            else if (low) trainHero(run, low.uid, H[low.key].pair[1]);
          } else if (k === 'quest') {
            const qh = run.team.find(h => !h.questDone);
            if (qh) accelerateHeroQuest(run, qh.uid); else restAt(run, 'gold');
          } else if (k === 'rest') {
            restAt(run, 'gold');
          } else if (k === 'treasure') {
            if (persona !== 'zero_item') { const ts = treasureOffer(run, rand); if (ts[0]) takeTreasure(run, ts[0]); autoEquipAll(run); }
          } else if (k === 'curio') {
            if (persona !== 'zero_item' && run.adv.curio) {
              for (let ci = 0; ci < run.adv.curio.items.length; ci++) {
                if (canAfford(run, run.adv.curio.items[ci].price)) buyCurioItem(run, ci);
              }
              autoEquipAll(run);
            }
          } else if (k === 'multiclass') {
            const cls = n.mcClass;
            const elig = eligibleForMulticlass(run, cls);
            if (elig[0]) applyMulticlass(run, elig[0].uid, cls);
            else restAt(run, 'gold');
          } else if (k === 'mystery' && run.adv.mystery) {
            const M = run.adv.mystery;
            if (M.type === 'treasure' && persona !== 'zero_item' && M.items[0]) { takeTreasure(run, M.items[0]); autoEquipAll(run); }
            else if (M.type === 'event' && M.event) {
              const ch = M.event.choices.find(c => !c.fight && (!c.cost || run.gold >= c.cost)) || M.event.choices[M.event.choices.length - 1];
              if (ch.cost && run.gold >= ch.cost) { run.gold -= ch.cost; run.stats.spent += ch.cost; }
              if (!ch.fight) {
                const out = ch.fx(run, rand);
                autoPickUpgrades(run, rand, persona);
                if (persona !== 'zero_item') autoEquipAll(run);
                if (out && out.ambush) {
                  const actMod = currentActModule(run);
                  buildEncounter(run, rand, { threat: pickFromBag(run, actMod.id + '_norm', actMod.pools.normal, rand) });
                  run.next.kind = 'fight'; run.adv.stage = 'battle'; continue;
                }
              }
            }
          }
          clearNode(run, rand);
          continue;
        }
        if (run.adv.stage === 'battle') {
          autoPlace(run, false);
          const b = simulate('run', partyCfg(run), 1);
          const won = b.winner === 'P';
          totalFights++;
          const n = run.adv.node;
          if (n && n.kind === 'boss') {
            const bk = run.next.threat;
            bossStats[bk] = bossStats[bk] || { fought: 0, won: 0, act: run.adv.act };
            bossStats[bk].fought++;
            if (won) bossStats[bk].won++;
          }
          const res = resolveNodeFight(run, won, b, rand);
          if (run.adv.loot && persona !== 'zero_item') {
            takeTreasure(run, run.adv.loot[0]);
            run.adv.loot = null;
            autoEquipAll(run);
          } else { run.adv.loot = null; }
          if (res.actDone === 1) act1Clears++;
          if (res.actDone === 2) act2Clears++;
          afterNodeFight(run, res, rand);
        }
      }
      if (run.victory) wins++;
      if (run.piggyBroken) piggyBroke++;
      totalGold += run.stats.gold;
      if (persona === 'competent' || persona === 'synergy') {
        run.team.forEach(h => {
          heroStatsAcc[h.key] = heroStatsAcc[h.key] || { runs: 0, wins: 0 };
          heroStatsAcc[h.key].runs++;
          if (run.victory) heroStatsAcc[h.key].wins++;
        });
      }
    }
    summary[persona] = {
      runs: ${RUNS_PER_PERSONA},
      winRate: +(wins / ${RUNS_PER_PERSONA} * 100).toFixed(1),
      act1Clear: +(act1Clears / ${RUNS_PER_PERSONA} * 100).toFixed(1),
      act2Clear: +(act2Clears / ${RUNS_PER_PERSONA} * 100).toFixed(1),
      piggyBreakRate: +(piggyBroke / ${RUNS_PER_PERSONA} * 100).toFixed(1),
      avgFights: +(totalFights / ${RUNS_PER_PERSONA}).toFixed(1),
      avgGold: +(totalGold / ${RUNS_PER_PERSONA}).toFixed(1)
    };
  }

  return { summary, bossStats, heroCount: Object.keys(heroStatsAcc).length };
})();`)();

console.log('=== v0.23 VERIFICATION & 5-PERSONA 3-ACT CALIBRATION ===');
console.log(JSON.stringify(report.summary, null, 2));
console.log('\n=== BOSS WIN RATES (ACROSS ALL PERSONAS) ===');
for (const [k, v] of Object.entries(report.bossStats).sort((a, b) => a[1].act - b[1].act || a[0].localeCompare(b[0]))) {
  console.log(`Act ${v.act} · ${k.padEnd(18)} : ${v.won}/${v.fought} (${(v.won / Math.max(1, v.fought) * 100).toFixed(1)}%)`);
}
