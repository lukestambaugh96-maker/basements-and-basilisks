#!/usr/bin/env node
/* Comprehensive v0.24 verification, Soft-Lane geometry audit, CR correlation & 5-Persona 3-Act Calibration */
import fs from 'fs';

const files = [
  'src/01-geo.js', 'src/02-enemies.js', 'src/03-heroes.js',
  'src/04-items.js', 'src/04b-house-rules.js', 'src/05-engine.js', 'src/06-adventure.js'
];
const engineCode = files.map(f => fs.readFileSync(f, 'utf8')).join('\n');
const RUNS_PER_PERSONA = Number(process.argv[2] || 20);

const report = new Function(engineCode + `\nreturn (() => {
  /* ===== 1. STATIC & STRUCTURAL INVARIANTS ===== */
  if (HERO_ORDER.length !== 24) throw new Error('Expected 24 heroes, got ' + HERO_ORDER.length);
  if (Object.keys(CLASS_KW).length !== 13) throw new Error('Expected 13 CLASS_KW');
  if (EPIC_BOON_KEYS.length !== 9) throw new Error('Expected 9 Epic Boons');
  if (MULTICLASS_KEYS.length !== 12) throw new Error('Expected 12 Multiclass dips');
  if (HOUSE_RULE_KEYS.length !== 36) throw new Error('Expected 36 House Rules, got ' + HOUSE_RULE_KEYS.length);
  if (HOUSE_RULE_MAX !== 6) throw new Error('Expected HOUSE_RULE_MAX === 6');
  if (ALL_ITEM_KEYS.length !== 88) throw new Error('Expected 88 items (82 base + 6 scaling), got ' + ALL_ITEM_KEYS.length);
  if (STANDARD_ITEM_KEYS.length !== 64 || UNIQUE_ITEM_KEYS.length !== 24) throw new Error('Expected 64 std + 24 unique');

  // Verify exact 6-attribute parity across all 5 standard tiers (Uncommon is now +3/attr with the 6 Scaling items!)
  for (let r = 0; r < 5; r++) {
    const exp = [1, 3, 3, 4, 6][r];
    const sum = { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 };
    ITEM_BY_R[r].forEach(k => Object.entries(ITEMS[k].a || {}).forEach(([a, v]) => sum[a] += v / 2));
    for (const a of ATTRS) if (sum[a] !== exp) throw new Error('Parity failed tier ' + r + ' ' + a + ': got ' + sum[a] + ' exp ' + exp);
  }

  // Verify Cubed AC/SR midpoint K=16
  const mk = v => ({ ac: v, sr: v, f: {}, st: { acid: 0, exp: 0, acS: 0, acBT: 0, acB: 0, srBT: 0, srB: 0, acShred: 0, srShred: 0 }, auraAC: 0, auraSR: 0 });
  const dr16 = +(1 - mitigate(null, null, mk(16), 100, { kind: 'phys' }) / 100).toFixed(3);
  if (dr16 !== 0.5) throw new Error('Expected K=16 DR 50%, got ' + dr16);

  /* ===== 2. SOFT-LANE MAP & ENCOUNTER GEOMETRY INVARIANTS ===== */
  for (const [mkKey, bm] of Object.entries(BATTLE_MAPS)) {
    const w = bm.grid[0].length;
    if (bm.grid.length !== 10) throw new Error('Map ' + mkKey + ' must have 10 rows');
    if (bm.grid.some(r => r.length !== w)) throw new Error('Map ' + mkKey + ' has uneven row width');
    if (!bm.lanes || bm.lanes.length < 2) throw new Error('Map ' + mkKey + ' missing lanes');
    loadMap(bm.grid, bm.lanes);
    for (let li = 0; li < bm.lanes.length; li++) {
      const cells = laneDeployCells(li, bm.lanes);
      if (cells.length < 6) throw new Error('Map ' + mkKey + ' lane ' + li + ' has too few deploy cells: ' + cells.length);
    }
  }
  for (const [ek, enc] of Object.entries(ENC)) {
    if (ek === 'spider') continue;
    const lanes = enc.lanes || (enc.mapKey && BATTLE_MAPS[enc.mapKey].lanes);
    loadMap(enc.map, lanes);
    const seenPos = new Set();
    enc.u.forEach(([uk, c, r]) => {
      if (!E[uk]) throw new Error('Unknown enemy ' + uk + ' in ' + ek);
      if (!passable({ c, r })) throw new Error('Encounter ' + ek + ' spawns ' + uk + ' on blocked tile (' + c + ',' + r + ')');
      const pk = c + ',' + r;
      if (seenPos.has(pk)) throw new Error('Encounter ' + ek + ' duplicate spawn at ' + pk);
      seenPos.add(pk);
    });
  }

  /* ===== 3. SMOKE TEST ALL 36 HOUSE RULES IN LIVE COMBAT ===== */
  const smokeRun = newAdventure(() => 0.42);
  startRunWithPacks(smokeRun, PACK_ORDER, () => 0.42);
  ['dane', 'arthur', 'faelan', 'cinder'].forEach(k => freeHero(smokeRun, k));
  smokeRun.team[0].multiclass = 'Cleric';
  smokeRun.team[1].multiclass = 'Rogue';
  for (const hrk of HOUSE_RULE_KEYS) {
    smokeRun.houseRules = [hrk];
    buildEncounter(smokeRun, () => 0.42, { threat: 'ambush' });
    autoPlace(smokeRun, true);
    const b = simulate('run', partyCfg(smokeRun), 1, battleOpts(smokeRun));
    if (!b.over || !b.winner) throw new Error('House Rule ' + hrk + ' failed to finish battle');
  }

  /* ===== 4. 5-PERSONA 3-ACT CAMPAIGN CALIBRATION + CR CORRELATION ===== */
  function makeRng(seed) {
    let s = seed >>> 0;
    return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  }

  const ENGINE_TAGS = {
    dane: ['ward', 'radiant', 'melee'], bram: ['heal', 'radiant', 'melee'],
    arthur: ['evade', 'mark_hit'], wallaby: ['exposed_pay', 'gold', 'mark_hit'],
    faelan: ['ward'], rosalind: ['insp'], cinder: ['burn', 'exposed'],
    juniper: ['root', 'poison', 'heal'], nettle: ['hex', 'burn', 'ward'],
    lumen: ['hex', 'radiant', 'heal'], jamison: ['heal', 'ward', 'radiant'],
    kaska: ['exposed', 'root', 'heal'], velith: ['poison', 'exposed'],
    lorcan: ['mark'], corvin: ['mark'], gains: ['gold'], toot: ['gold', 'insp'],
    zoe: ['item_carry'], gilthrax: ['ward', 'burn', 'melee'],
    naill: ['evade', 'exposed', 'mark_hit'], saint: ['evade', 'exposed'],
    mother_laurel: ['root', 'ward', 'heal', 'melee'], zark: ['melee'], pillar: ['melee', 'radiant']
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
    return sc;
  }

  function autoPickUpgrades(run, rand, persona) {
    run.team.forEach(h => {
      if (h.tier >= 2 && !h.path) h.path = H[h.key].paths[persona === 'naive' ? Math.floor(rand() * 2) : 0].k;
      if (h.tier >= 3 && !h.asi) h.asi = H[h.key].pair[1];
      if (h.tier >= 4 && !h.boon) h.boon = rollEpicBoonOffer(rand)[0];
    });
  }

  function itemFitScore(h, k, persona) {
    const it = ITEMS[k], d = H[h.key];
    if (!it || !d) return -99;
    let sc = (it.r || 0) * 6;
    if (it.scaling && (persona === 'engine' || persona === 'greed')) sc += 14;
    if ((it.kwHooks || []).some(w => heroKeywords(h).includes(w))) sc += 24;
    if (it.a) Object.entries(it.a).forEach(([ak, av]) => {
      if (d.pair[0] === ak) sc += av * 4;
      else if (d.pair[1] === ak) sc += av * 3.5;
      else if (ak === 'con' && d.role === 'Tank') sc += av * 3;
    });
    return sc;
  }

  function autoEquipSmart(run, persona) {
    for (let si = run.stash.length - 1; si >= 0; si--) {
      const k = run.stash[si];
      const open = run.team.filter(h => h.items.length < slotsOf(h) && canCarry(h, k))
        .sort((a, b) => itemFitScore(b, k, persona) - itemFitScore(a, k, persona));
      if (open[0]) { equip(run, open[0].uid, si); continue; }
      let bestSwap = null, bestGain = 5;
      for (const h of run.team) {
        if (!canCarry(h, k)) continue;
        const newSc = itemFitScore(h, k, persona);
        h.items.forEach((oldK, idx) => {
          const gain = newSc - itemFitScore(h, oldK, persona);
          if (gain > bestGain) { bestGain = gain; bestSwap = { h, idx }; }
        });
      }
      if (bestSwap) {
        unequip(run, bestSwap.h.uid, bestSwap.idx);
        const nsi = run.stash.indexOf(k);
        if (nsi >= 0) equip(run, bestSwap.h.uid, nsi);
      }
    }
  }

  function hrScore(run, k) {
    const hr = HOUSE_RULES[k];
    if (!hr) return 0;
    const fit = houseRuleFit(k, run);
    return (hr.r + 1) * 10 + fit.score * 14 + (hr.cat === 'capstone' ? 18 : 0);
  }

  function shopDecision(run, rand, persona) {
    const isNaive = persona === 'naive';
    const isFlat = persona === 'flat_only'; // Never buys House Rules or Camp Rank!
    const isComp = persona === 'competent';
    const isEngine = persona === 'engine';
    const isGreed = persona === 'greed';
    const isSmart = isComp || isEngine || isGreed;

    const tryPass = () => {
      // 1. Recruit to 4 heroes first
      const hIdxs = run.shop.heroes.map((k, i) => ({ k, i })).filter(x => x.k);
      if (isSmart) {
        hIdxs.sort((a, b) => {
          const oa = heroOffer(run, a.k, a.i), ob = heroOffer(run, b.k, b.i);
          return (ob.upgrade ? 22 : compScore(run.team, b.k)) - (oa.upgrade ? 22 : compScore(run.team, a.k));
        });
      }
      for (const { k, i } of hIdxs) {
        const o = heroOffer(run, k, i);
        if (o.maxed || !canAfford(run, o.price)) continue;
        if (o.isNew && run.team.length < 4) { buyHero(run, i); autoPickUpgrades(run, rand, persona); }
        else if (o.upgrade && (isFlat || isNaive || run.team.length >= 4)) {
          if (isGreed && campRankOf(run) < 3 && run.gold < o.price + 6) continue;
          buyHero(run, i); autoPickUpgrades(run, rand, persona);
        }
      }

      // 2. Camp Rank upgrade (Immediate vs Future Power!)
      if (isSmart && run.team.length >= 4 && !run.adv.retryPending) {
        const upCost = campRankUpgradeCost(run);
        const wantRank = isGreed ? 4 : isEngine ? 4 : 3;
        const pcr = calcPartyCR(run).cr;
        const nx = nextNodes(run);
        const minNextCR = nx.length ? Math.min(...nx.map(n => n.cr || 1)) : 1;
        if (upCost != null && campRankOf(run) < wantRank && canAfford(run, upCost)) {
          if (isGreed || pcr >= minNextCR * 0.92 || run.gold >= upCost + 6) {
            upgradeCampRank(run);
          }
        }
      }

      // 3. Buy House Rules (Engine & Greed & Competent prioritize strong synergistic House Rules!)
      if (!isFlat && (!isNaive || rand() < 0.25)) {
        const hrIdxs = (run.shop.houseRules || []).map((k, i) => ({ k, i })).filter(x => x.k);
        hrIdxs.sort((a, b) => hrScore(run, b.k) - hrScore(run, a.k));
        for (const { k, i } of hrIdxs) {
          const p = houseRuleShopPrice(run, i);
          if (!canAfford(run, p)) continue;
          const sc = hrScore(run, k);
          if (isSmart && sc < 24 && run.houseRules.length >= 2) continue;
          if (run.houseRules.length < HOUSE_RULE_MAX) {
            buyHouseRule(run, i);
          } else if (isSmart) {
            // Replace weakest owned House Rule if new one is clearly stronger!
            let worstIdx = -1, worstSc = sc - 14;
            run.houseRules.forEach((ok, idx) => {
              const osc = hrScore(run, ok);
              if (osc < worstSc) { worstSc = osc; worstIdx = idx; }
            });
            if (worstIdx >= 0) buyHouseRule(run, i, worstIdx);
          }
        }
      }

      // 4. Buy Items
      const iIdxs = run.shop.items.map((k, i) => ({ k, i })).filter(x => x.k);
      for (const { k, i } of iIdxs) {
        const p = itemPrice(run, i);
        if (!canAfford(run, p) || run.stash.length >= ECON.stash) continue;
        if (isNaive && rand() > 0.5) continue;
        const bestFit = Math.max(...run.team.map(h => itemFitScore(h, k, persona)));
        if (isSmart && bestFit < 10 && run.gold < p + 8) continue;
        buyItem(run, i);
      }
      autoEquipSmart(run, persona);
    };

    tryPass();
    // Use free rerolls or roll once if flush with gold
    if (isSmart && (rerollPrice(run) === 0 || (run.gold >= 16 && run.adv.act >= 2))) {
      if (reroll(run, rand)) tryPass();
    }
  }

  const crBuckets = { favoured: [0, 0], even: [0, 0], dangerous: [0, 0], deadly: [0, 0] };

  function runCampaign(persona, seed) {
    const rand = makeRng(seed);
    const run = newAdventure(rand);
    startRunWithPacks(run, PACK_ORDER, rand);
    freeHero(run, run.firstPick[0]);
    startAct(run, rand);

    let steps = 0;
    while (!run.over && steps++ < 90) {
      if (run.adv.stage === 'shop') {
        shopDecision(run, rand, persona);
        if (run.adv.retryPending) {
          autoPlace(run, true);
          const b = simulate('run', partyCfg(run), 1, battleOpts(run));
          const res = resolveNodeFight(run, b.winner === 'P', b, rand);
          if (run.adv.loot) { takeTreasure(run, run.adv.loot[0]); run.adv.loot = null; autoEquipSmart(run, persona); }
          if (run.adv.hrDraft && persona !== 'flat_only') {
            const best = run.adv.hrDraft.slice().sort((a, c) => hrScore(run, c) - hrScore(run, a))[0];
            if (best) addFreeHouseRule(run, best, run.houseRules.length >= HOUSE_RULE_MAX ? 0 : null);
            run.adv.hrDraft = null;
          }
          afterNodeFight(run, res, rand);
          continue;
        }
        run.adv.stage = 'map';
      }
      const nx = nextNodes(run);
      if (!nx.length) break;
      const pcr = calcPartyCR(run).cr;
      let pick = nx[Math.floor(rand() * nx.length)];
      if (persona === 'engine' || persona === 'greed' || persona === 'competent') {
        pick = nx.slice().sort((a, b) => {
          const scoreN = n => {
            if (n.kind === 'multiclass') return 35;
            if (n.kind === 'train') return 30;
            if (n.kind === 'curio') return 26;
            if (n.kind === 'quest') return 22;
            if (n.kind === 'treasure') return 20;
            if (n.kind === 'elite' || n.kind === 'miniboss') return pcr >= (n.cr || 1) * 0.95 ? 25 : 4;
            if (n.kind === 'fight') return 14;
            return 12;
          };
          return scoreN(b) - scoreN(a);
        })[0];
      }
      const k = enterNode(run, pick, rand);
      if (k === 'battle') {
        autoPlace(run, true);
        const encCR = ENC.run.cr || calcEncounterCR(ENC.run);
        const v = crVerdict(calcPartyCR(run).cr, encCR);
        const b = simulate('run', partyCfg(run), 1, battleOpts(run));
        const won = b.winner === 'P';
        crBuckets[v.cls][1]++;
        if (won) crBuckets[v.cls][0]++;
        const res = resolveNodeFight(run, won, b, rand);
        if (run.adv.loot) { takeTreasure(run, run.adv.loot[0]); run.adv.loot = null; autoEquipSmart(run, persona); }
        if (run.adv.hrDraft && persona !== 'flat_only') {
          const best = run.adv.hrDraft.slice().sort((a, c) => hrScore(run, c) - hrScore(run, a))[0];
          if (best) addFreeHouseRule(run, best, run.houseRules.length >= HOUSE_RULE_MAX ? 0 : null);
          run.adv.hrDraft = null;
        } else {
          run.adv.hrDraft = null;
        }
        afterNodeFight(run, res, rand);
        autoPickUpgrades(run, rand, persona);
      } else {
        // Resolve non-combat nodes cleanly
        if (k === 'train') {
          const low = run.team.slice().sort((a, b) => a.tier - b.tier)[0];
          if (low && low.tier < 4) { promoteHero(run, low.uid); autoPickUpgrades(run, rand, persona); }
          else if (low) trainHero(run, low.uid, H[low.key].pair[1]);
        } else if (k === 'multiclass') {
          const elig = eligibleForMulticlass(run, pick.mcClass);
          if (elig[0]) applyMulticlass(run, elig[0].uid, pick.mcClass);
          else restAt(run, 'gold');
        } else if (k === 'quest') {
          const qh = run.team.find(h => !h.questDone && H[h.key].quest);
          if (qh) accelerateHeroQuest(run, qh.uid);
          else restAt(run, 'gold');
        } else if (k === 'treasure') {
          const offer = treasureOffer(run, rand);
          if (offer[0]) takeTreasure(run, offer[0]);
          autoEquipSmart(run, persona);
        } else if (k === 'curio') {
          if (run.adv.curio && run.adv.curio.items[0] && canAfford(run, run.adv.curio.items[0].price)) {
            buyCurioItem(run, 0);
            autoEquipSmart(run, persona);
          }
        } else if (k === 'rest') {
          restAt(run, 'gold');
        } else if (k === 'mystery' && run.adv.mystery) {
          const m = run.adv.mystery;
          if (m.type === 'treasure' && m.items[0]) takeTreasure(run, m.items[0]);
          else if (m.type === 'event' && m.event && m.event.choices) {
            const ch = m.event.choices.find(c => !c.cost && !c.fight) || m.event.choices[0];
            if (ch && !ch.fight && (!ch.cost || run.gold >= ch.cost)) {
              if (ch.cost) run.gold -= ch.cost;
              ch.fx(run, rand);
            }
          }
        }
        clearNode(run, rand);
      }
    }
    return {
      victory: run.victory, act: run.adv.act, won: run.stats.won,
      piggy: run.piggyBroken, gold: run.stats.gold,
      campRank: run.campRank, rules: run.houseRules.length,
      pcr: calcPartyCR(run).cr
    };
  }

  const personas = ['naive', 'flat_only', 'competent', 'engine', 'greed'];
  const summary = {};
  for (const p of personas) {
    let wins = 0, pig = 0, gSum = 0, rSum = 0, hrSum = 0, crSum = 0;
    const deaths = [0, 0, 0];
    for (let i = 0; i < ${RUNS_PER_PERSONA}; i++) {
      const r = runCampaign(p, 1000 + personas.indexOf(p) * 500 + i * 17);
      if (r.victory) wins++; else deaths[Math.min(2, (r.act || 1) - 1)]++;
      if (r.piggy) pig++;
      gSum += r.gold; rSum += r.campRank; hrSum += r.rules; crSum += r.pcr;
    }
    summary[p] = {
      wr: +(wins / ${RUNS_PER_PERSONA} * 100).toFixed(1),
      piggyPct: +(pig / ${RUNS_PER_PERSONA} * 100).toFixed(1),
      avgGold: +(gSum / ${RUNS_PER_PERSONA}).toFixed(1),
      avgCampRank: +(rSum / ${RUNS_PER_PERSONA}).toFixed(2),
      avgHouseRules: +(hrSum / ${RUNS_PER_PERSONA}).toFixed(2),
      avgEndCR: +(crSum / ${RUNS_PER_PERSONA}).toFixed(1),
      deaths
    };
  }

  const crCorr = {};
  for (const [k, [w, n]] of Object.entries(crBuckets)) {
    crCorr[k] = { fights: n, wr: n ? +(w / n * 100).toFixed(1) : 0 };
  }

  return { ok: true, invariants: 'ALL PASSED', summary, crCorr };
})();`)();

console.log(JSON.stringify(report, null, 2));
