#!/usr/bin/env node
/* Comprehensive v0.23 verification & 5-Persona 3-Act Skill-Ceiling Calibration Runner */
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
  const dr16 = +(1 - mitigate(null, null, mk(16), 100, { kind: 'phys' }) / 100).toFixed(3);
  if (dr16 !== 0.5) throw new Error('Expected K=16 DR 50%');

  /* ===== 2. REALISTIC SKILL-TIER PERSONAS ===== */
  function makeRng(seed) {
    let s = seed >>> 0;
    return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  }

  // Real mechanical cross-hero engine tags (matches actual 03-heroes.js & 05-engine.js hooks)
  const ENGINE_TAGS = {
    dane:          ['ward', 'radiant', 'melee'],
    bram:          ['heal', 'radiant', 'melee'],
    arthur:        ['evade', 'mark_hit'],
    wallaby:       ['exposed_pay', 'gold', 'mark_hit'],
    faelan:        ['ward'],
    rosalind:      ['insp'],
    cinder:        ['burn', 'exposed'],
    juniper:       ['root', 'poison', 'heal'],
    nettle:        ['hex', 'burn', 'ward'],
    lumen:         ['hex', 'radiant', 'heal'],
    jamison:       ['heal', 'ward', 'radiant'],
    kaska:         ['exposed', 'root', 'heal'],
    velith:        ['poison', 'exposed'],
    lorcan:        ['mark'],
    corvin:        ['mark'],
    gains:         ['gold'],
    toot:          ['gold', 'insp'],
    zoe:           ['item_carry'],
    gilthrax:      ['ward', 'burn', 'melee'],
    naill:         ['evade', 'exposed', 'mark_hit'],
    saint:         ['evade', 'exposed'],
    mother_laurel: ['root', 'ward', 'heal', 'melee'],
    zark:          ['melee'],
    pillar:        ['melee', 'radiant']
  };

  function compScore(team, candKey) {
    const d = H[candKey];
    let sc = 0;
    const roles = team.map(h => H[h.key].role);
    const tanks = roles.filter(r => r === 'Tank').length;
    const sups  = roles.filter(r => r === 'Support').length;
    const dmgs  = roles.filter(r => r === 'Damage').length;
    if (d.role === 'Tank' && tanks === 0) sc += 20;
    else if (d.role === 'Tank' && tanks >= 2) sc -= 14;
    if (d.role === 'Support' && sups === 0) sc += 14;
    else if (d.role === 'Support' && sups >= 2) sc -= 10;
    if (d.role === 'Damage' && dmgs < 2) sc += 10;
    else if (d.role === 'Damage' && dmgs >= 3) sc -= 12;

    const myTags = ENGINE_TAGS[candKey] || [];
    const teamTags = team.flatMap(h => ENGINE_TAGS[h.key] || []);
    for (const tg of ['burn', 'hex', 'poison', 'root', 'exposed', 'evade', 'ward', 'mark', 'gold', 'melee', 'radiant']) {
      if (myTags.includes(tg) && teamTags.includes(tg)) sc += 7;
    }
    if (myTags.includes('mark_hit') && teamTags.includes('mark')) sc += 8;
    if (myTags.includes('mark') && teamTags.includes('mark_hit')) sc += 8;
    if (myTags.includes('exposed_pay') && teamTags.includes('exposed')) sc += 6;
    return sc;
  }

  function pickPathForTeam(run, h, rand, persona) {
    const ps = H[h.key].paths;
    if (persona === 'average' || persona === 'zero_item') return ps[Math.floor(rand() * ps.length)].k;
    if (persona === 'competent') return ps[0].k;
    // Synergy & Greed pick Path 2 when real team partners exist!
    const others = run.team.filter(x => x.uid !== h.uid);
    const oTags = new Set(others.flatMap(x => ENGINE_TAGS[x.key] || []));
    const k = h.key;
    if (k === 'faelan' && oTags.has('ward')) return ps[1].k; // Spell Battery
    if (k === 'arthur' && oTags.has('evade')) return ps[1].k; // Roll for Initiative
    if (k === 'saint' && oTags.has('evade')) return ps[1].k; // Smoke & Mirrors
    if (k === 'naill' && (oTags.has('exposed') || oTags.has('exposed_pay'))) return ps[1].k; // Flowing Leaves
    if (k === 'kaska' && oTags.has('exposed')) return ps[1].k; // Pack Hunt
    if (k === 'mother_laurel' && oTags.has('root')) return ps[1].k; // Bountiful Vines
    if (k === 'juniper' && oTags.has('poison')) return ps[0].k; // Overgrowth (Path 1!)
    if (k === 'juniper') return ps[1].k; // Circle of the Land
    if (k === 'velith' && (oTags.has('exposed') || oTags.has('exposed_pay'))) return ps[1].k; // Nightshade Vials
    if (k === 'nettle' && oTags.has('burn')) return ps[0].k; // Fine Print (Path 1!)
    if (k === 'cinder' && oTags.has('burn')) return ps[0].k; // Draconic Surge (Path 1!)
    if (k === 'cinder' && oTags.has('exposed')) return ps[1].k; // Wildfire
    if (k === 'lorcan') return ps[1].k; // Pack Hunter (+1d6 Mark for all allies)
    if (k === 'bram' && oTags.has('melee')) return ps[1].k; // Divine Strike
    if (k === 'zark' && oTags.has('melee')) return ps[1].k; // Totem Roar
    if (k === 'pillar' && oTags.has('melee')) return ps[1].k; // Living Beacon
    if (k === 'dane') return ps[1].k; // Aura of Protection
    if (k === 'gilthrax' && oTags.has('ward')) return ps[1].k; // Bodyguard's Fee
    if (k === 'gains' && oTags.has('gold')) return ps[1].k; // Liquid Assets
    if (k === 'toot') return ps[1].k; // Street Performer
    if (k === 'wallaby' && oTags.has('gold')) return ps[1].k; // Pickpocket
    if (k === 'rosalind') return ps[1].k; // Encore
    if (k === 'jamison' && oTags.has('ward')) return ps[0].k; // Shared Grace
    return ps[0].k;
  }

  function autoPickUpgrades(run, rand, persona) {
    run.team.forEach(h => {
      if (h.tier >= 2 && !h.path) h.path = pickPathForTeam(run, h, rand, persona);
      if (h.tier >= 3 && !h.asi) h.asi = H[h.key].pair[persona === 'average' ? (rand() < .5 ? 0 : 1) : 1];
      if (h.tier >= 4 && !h.boon) {
        const off = rollEpicBoonOffer(rand);
        h.boon = off[0];
      }
    });
  }

  function itemFitScore(h, k) {
    const it = ITEMS[k], d = H[h.key];
    if (!it || !d) return -99;
    let sc = (it.r || 0) * 6;
    if ((it.kwHooks || []).some(w => heroKeywords(h).includes(w))) sc += 26;
    if (it.a) Object.entries(it.a).forEach(([ak, av]) => {
      if (d.pair[0] === ak) sc += av * 4;
      else if (d.pair[1] === ak) sc += av * 3.5;
      else if (ak === 'con' && d.role === 'Tank') sc += av * 3;
      else sc += av * 0.5;
    });
    if ((it.ac || it.hp || it.ward || it.regen) && d.role === 'Tank') sc += 12;
    if ((it.pen || it.dm || it.spen || it.crit || it.as) && d.role === 'Damage') sc += 10;
    if ((it.heal || it.cr || it.ward) && d.role === 'Support') sc += 8;
    return sc;
  }

  function autoEquipSmart(run) {
    for (let si = run.stash.length - 1; si >= 0; si--) {
      const k = run.stash[si];
      const it = ITEMS[k]; if (!it) continue;
      const open = run.team.filter(h => h.items.length < slotsOf(h) && canCarry(h, k))
        .sort((a, b) => itemFitScore(b, k) - itemFitScore(a, k));
      if (open[0]) { equip(run, open[0].uid, si); continue; }
      let bestSwap = null, bestGain = 4;
      for (const h of run.team) {
        if (!canCarry(h, k)) continue;
        const newSc = itemFitScore(h, k);
        h.items.forEach((oldK, idx) => {
          const gain = newSc - itemFitScore(h, oldK);
          if (gain > bestGain) { bestGain = gain; bestSwap = { h, idx }; }
        });
      }
      if (bestSwap) {
        unequip(run, bestSwap.h.uid, bestSwap.idx);
        const newSi = run.stash.indexOf(k);
        if (newSi >= 0) equip(run, bestSwap.h.uid, newSi);
      }
    }
  }

  function autoEquipNaive(run, rand) {
    for (let si = run.stash.length - 1; si >= 0; si--) {
      const k = run.stash[si];
      const cands = run.team.filter(h => h.items.length < slotsOf(h) && canCarry(h, k));
      if (cands.length) equip(run, cands[Math.floor(rand() * cands.length)].uid, si);
    }
  }

  function shopDecision(run, rand, persona) {
    const isZero = persona === 'zero_item';
    const isAvg = persona === 'average';
    const isGreed = persona === 'greed';
    const isSyn = persona === 'synergy';
    const isSmart = persona === 'competent' || isSyn || isGreed;

    // Interest floor: skilled players keep 5/10/15g banked when board is stable (unless retryPending or < 4 heroes)
    const wantBank = () => {
      if (!isSmart || run.adv.retryPending || run.team.length < 4) return 0;
      if (run.adv.act === 3 && run.adv.row >= 6) return 0; // spend everything before final boss!
      const target = isGreed ? 15 : isSyn ? 10 : 5;
      return run.gold >= target ? target : 0;
    };

    const tryShopPass = () => {
      const heroIdxs = run.shop.heroes.map((k, i) => ({ k, i })).filter(x => x.k);
      if (isSmart) {
        heroIdxs.sort((a, b) => {
          const oa = heroOffer(run, a.k, a.i), ob = heroOffer(run, b.k, b.i);
          const sa = (oa.upgrade ? 24 : (isSyn ? compScore(run.team, a.k) : (H[a.k].role === 'Tank' && !run.team.some(h => H[h.key].role === 'Tank') ? 16 : 0)));
          const sb = (ob.upgrade ? 24 : (isSyn ? compScore(run.team, b.k) : (H[b.k].role === 'Tank' && !run.team.some(h => H[h.key].role === 'Tank') ? 16 : 0)));
          return sb - sa;
        });
      }
      for (const { k, i } of heroIdxs) {
        const o = heroOffer(run, k, i);
        if (o.maxed || !canAfford(run, o.price)) continue;
        if (o.isNew && run.team.length < 4) {
          if (isGreed && run.team.length >= 2 && !['zoe', 'toot', 'gilthrax', 'gains'].includes(k) && rand() < .35) continue;
          if (isSyn && run.team.length === 3 && compScore(run.team, k) < -6 && run.gold >= rerollPrice(run) + 4) continue;
          buyHero(run, i);
          autoPickUpgrades(run, rand, persona);
        } else if (o.upgrade) {
          buyHero(run, i);
          autoPickUpgrades(run, rand, persona);
        }
      }
      if (!isZero) {
        const buyChance = isAvg ? 0.55 : 1.0;
        const itemIdxs = run.shop.items.map((k, i) => ({ k, i })).filter(x => x.k);
        if (isSmart) {
          itemIdxs.sort((a, b) => {
            const ba = Math.max(...run.team.map(h => itemFitScore(h, a.k)));
            const bb = Math.max(...run.team.map(h => itemFitScore(h, b.k)));
            return bb - ba;
          });
        }
        for (const { k, i } of itemIdxs) {
          const p = itemPrice(run, i);
          if (!canAfford(run, p) || run.stash.length >= ECON.stash) continue;
          if (rand() > buyChance) continue;
          const it = ITEMS[k];
          if (isSmart) {
            if (run.team.length < 4 && it.r <= 1 && run.gold < p + 4) continue;
            const bank = wantBank();
            const bestFit = Math.max(...run.team.map(h => itemFitScore(h, k)));
            const openSlots = run.team.reduce((a, h) => a + Math.max(0, slotsOf(h) - h.items.length), 0);
            if (openSlots <= 0 && bestFit < 18) continue;
            if (it.r === 0 && run.adv.act >= 2 && bestFit < 14) continue;
            if (run.gold - p < bank && it.r <= 1 && openSlots <= 2) continue;
          }
          buyItem(run, i);
        }
        if (isSmart) {
          autoEquipSmart(run);
          // Liquidate superseded low-tier stash items via 50% sellback to fuel upgrades/interest!
          for (let si = run.stash.length - 1; si >= 0; si--) {
            if (ITEMS[run.stash[si]].r <= 2) sellItem(run, si);
          }
        } else {
          autoEquipNaive(run, rand);
        }
      }
    };

    tryShopPass();
    const maxRR = isAvg || isZero ? 0 : 1;
    for (let r = 0; r < maxRR; r++) {
      const bank = wantBank();
      const thresh = run.team.length < 4 ? rerollPrice(run) + 4 : Math.max(bank + rerollPrice(run) + 4, rerollPrice(run) + 8);
      if (run.gold >= thresh) {
        if (reroll(run, rand)) tryShopPass();
      }
    }
    if (isSmart) autoEquipSmart(run); else if (!isZero) autoEquipNaive(run, rand);
  }

  function pickNextNode(run, rand, persona) {
    const opts = nextNodes(run);
    if (!opts.length) return null;
    if (persona === 'average' || persona === 'zero_item') return opts[Math.floor(rand() * opts.length)];
    const avgTier = run.team.reduce((a, h) => a + h.tier, 0) / Math.max(1, run.team.length);
    const totalItems = run.team.reduce((a, h) => a + h.items.length, 0);
    const score = n => {
      const W = run.adv.wanderer;
      if (W && W.alive && W.r === n.r && W.i === n.i) return -15;
      if (n.kind === 'train') return 12;
      if (n.kind === 'curio') return run.gold >= ECON.itemPrice[5] ? 11 : 2;
      if (n.kind === 'treasure') return 9.5;
      if (n.kind === 'multiclass') return 9;
      if (n.kind === 'fight') return 8;
      if (n.kind === 'elite') return (avgTier >= 2.25 && totalItems >= 4) ? 9 : 2.5;
      if (n.kind === 'miniboss') return (run.team.length >= 4 && avgTier >= 2.0 && totalItems >= 3) ? 8.5 : 2;
      if (n.kind === 'quest') return 6;
      if (n.kind === 'mystery') return 5;
      if (n.kind === 'rest') return 4;
      return 5;
    };
    return opts.slice().sort((a, b) => score(b) - score(a))[0];
  }

  const personas = ['zero_item', 'average', 'competent', 'synergy', 'greed'];
  const summary = {};
  const bossStats = {};
  const heroStatsAcc = {};

  for (const persona of personas) {
    let wins = 0, piggyBroke = 0, totalFights = 0, act1Clears = 0, act2Clears = 0, totalGold = 0;
    const isSmart = persona === 'competent' || persona === 'synergy' || persona === 'greed';
    for (let rIdx = 0; rIdx < ${RUNS_PER_PERSONA}; rIdx++) {
      const rand = makeRng((personas.indexOf(persona) + 1) * 10000 + rIdx * 97 + 13);
      const run = newAdventure(rand);
      const usePacks = persona === 'greed' ? ['market', 'tavern', 'campfire'] : PACK_ORDER;
      startRunWithPacks(run, usePacks, rand);
      const starter = persona === 'greed'
        ? (run.firstPick.find(k => ['zoe', 'toot', 'gilthrax', 'gains'].includes(k)) || run.firstPick[0])
        : persona === 'synergy'
          ? (run.firstPick.find(k => H[k].role === 'Tank') || run.firstPick[0])
          : run.firstPick[Math.floor(rand() * run.firstPick.length)];
      freeHero(run, starter);
      startAct(run, rand);

      let guard = 0;
      while (!run.over && guard++ < 85) {
        if (run.adv.stage === 'shop') {
          shopDecision(run, rand, persona);
          run.adv.stage = run.adv.retryPending ? 'battle' : 'map';
          continue;
        }
        if (run.adv.stage === 'map') {
          const n = pickNextNode(run, rand, persona);
          if (!n) break;
          const k = enterNode(run, n, rand);
          if (k === 'battle') continue;
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
            if (persona !== 'zero_item') {
              const ts = treasureOffer(run, rand);
              if (ts.length) {
                const pick = isSmart
                  ? ts.slice().sort((a, b) => Math.max(...run.team.map(h => itemFitScore(h, b))) - Math.max(...run.team.map(h => itemFitScore(h, a))))[0]
                  : ts[0];
                takeTreasure(run, pick);
                if (isSmart) autoEquipSmart(run); else autoEquipNaive(run, rand);
              }
            }
          } else if (k === 'curio') {
            if (persona !== 'zero_item' && run.adv.curio) {
              for (let ci = 0; ci < run.adv.curio.items.length; ci++) {
                if (canAfford(run, run.adv.curio.items[ci].price)) buyCurioItem(run, ci);
              }
              if (isSmart) autoEquipSmart(run); else autoEquipNaive(run, rand);
            }
          } else if (k === 'multiclass') {
            const cls = n.mcClass;
            const elig = eligibleForMulticlass(run, cls);
            if (elig[0]) applyMulticlass(run, elig[0].uid, cls);
            else restAt(run, 'gold');
          } else if (k === 'mystery' && run.adv.mystery) {
            const M = run.adv.mystery;
            if (M.type === 'treasure' && persona !== 'zero_item' && M.items[0]) {
              takeTreasure(run, M.items[0]);
              if (isSmart) autoEquipSmart(run); else autoEquipNaive(run, rand);
            } else if (M.type === 'event' && M.event) {
              const ch = M.event.choices.find(c => !c.fight && (!c.cost || run.gold >= c.cost)) || M.event.choices[M.event.choices.length - 1];
              if (ch.cost && run.gold >= ch.cost) { run.gold -= ch.cost; run.stats.spent += ch.cost; }
              if (!ch.fight) {
                const out = ch.fx(run, rand);
                autoPickUpgrades(run, rand, persona);
                if (persona !== 'zero_item') { if (isSmart) autoEquipSmart(run); else autoEquipNaive(run, rand); }
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
            const pick = isSmart
              ? run.adv.loot.slice().sort((a, b) => Math.max(...run.team.map(h => itemFitScore(h, b))) - Math.max(...run.team.map(h => itemFitScore(h, a))))[0]
              : run.adv.loot[0];
            takeTreasure(run, pick);
            run.adv.loot = null;
            if (isSmart) autoEquipSmart(run); else autoEquipNaive(run, rand);
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
