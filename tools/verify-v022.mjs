/**
 * verify-v022.mjs — Automated Node headless verification suite for Basements & Basilisks v0.22.
 * Tests:
 *   1. Six-Attribute Rework (STR Armor Pen, DEX Attack Speed, CON HP, INT Charge Speed & 1-cast/s cap, WIS d20 floor, CHA potency)
 *   2. Reworked Shop Rules (No duplicate hunting, 2 Recruit + 1 Upgrade slots, Pre-tiered recruits in Act 2/3, Pack Item pool unlock)
 *   3. Piggy Bank Single Free-Loss Rule + Camp Retraining + Map-Node Promotion
 *   4. All 12 Heroes & 13 Items + Hero Quests (incl. Sir Dane Large 2x2 Cavalry Charge, Arthur Flame Gauntlet, Wallaby Use Magic Device, Faelan Owl Familiar)
 *   5. All 3 Benchmark Test Comps from initial_prototype_cast_12_heroes_core_items.md
 */

import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const files = [
  'src/01-geo.js',
  'src/02-enemies.js',
  'src/03-heroes.js',
  'src/04-items.js',
  'src/05-engine.js',
  'src/06-adventure.js',
];

const ctx = vm.createContext({ console, Math, Set, Map, Object, Array, Number, String, Boolean, JSON, Date, parseInt, parseFloat, isNaN });
for (const f of files) {
  const code = fs.readFileSync(path.join(root, f), 'utf8');
  vm.runInContext(code, ctx, { filename: f });
}

function assert(cond, msg) {
  if (!cond) throw new Error('ASSERTION FAILED: ' + msg);
}

// Execute tests inside VM context
vm.runInContext(`
  // 1. Cast & Item Counts (24 Heroes, 6 Packs, 16 Items)
  if (HERO_ORDER.length !== 24) throw new Error('Expected 24 heroes, got ' + HERO_ORDER.length);
  if (PACK_ORDER.length !== 6) throw new Error('Expected 6 packs, got ' + PACK_ORDER.length);
  if (CORE_ITEM_KEYS.length !== 10) throw new Error('Expected 10 core shop items, got ' + CORE_ITEM_KEYS.length);
  if (Object.keys(ITEMS).filter(k => !k.endsWith('@fav')).length !== 16) throw new Error('Expected 16 total items');
  console.log('[PASS] Cast & Items: 24 heroes across 6 packs, 6 Pack Items + 10 Core Shop Items.');

  // 2. Six-Attribute Rework checks
  const stFaelan = heroStats({ key: 'faelan', tier: 1 });
  const stFaelanInt = heroStats({ key: 'faelan', tier: 1, train: { int: 3 } });
  if (!(stFaelanInt.intChargePct > stFaelan.intChargePct && stFaelanInt.cr > stFaelan.cr)) {
    throw new Error('INT must increase Charge speed');
  }
  const stArthur0 = heroStats({ key: 'arthur', tier: 1 });
  const stArthurInt = heroStats({ key: 'arthur', tier: 1, train: { int: 4 } });
  const stArthurDex = heroStats({ key: 'arthur', tier: 1, train: { dex: 4 } });
  if (stArthurInt.bands.hi !== stArthur0.bands.hi) throw new Error('INT must NOT shift High band for non-INT key hero');
  if (!(stArthurDex.bands.hi < stArthur0.bands.hi || stArthurDex.rb > stArthur0.rb)) throw new Error('Key Attr (DEX) must improve Arthur d20 scaling');
  if (!(stArthur0.pen >= 3)) throw new Error('STR must grant melee Armor Penetration');
  const stBram = heroStats({ key: 'bram', tier: 1 });
  if (stBram.d20Floor !== 4) throw new Error('Expected Bram WIS +3 -> d20Floor 4, got ' + stBram.d20Floor);
  if (bandOdds(H.bram, stBram)[0] !== 0) throw new Error('WIS +3 hero should have 0% natural 1 fizzle chance!');
  const stRosalind = heroStats({ key: 'rosalind', tier: 1 });
  if (!(stRosalind.chaPotency > 1.2)) throw new Error('CHA +3 must grant >20% Commanding Presence');
  console.log('[PASS] Six-Attribute Rework verified.');

  // 3. Pre-Run Pack Toggles, Shop Rules & Direct Act 1 -> Act 2 Transition (NO mid-run Pack Draft!)
  const run = newAdventure();
  startRunWithPacks(run, ['divine', 'market']);
  if (run.adv.packs.length !== 2 || run.adv.pool.length !== 8) throw new Error('Pre-run pack toggle failed: expected 2 packs / 8 heroes');
  if (!run.adv.itemPool.includes('sunlit_censer') || !run.adv.itemPool.includes('merchants_scales')) throw new Error('Enabled Pack Items missing from itemPool');
  if (run.adv.itemPool.includes('cloak_elvenkind')) throw new Error('Disabled Pack Item leaked into itemPool');
  freeHero(run, 'pillar');
  openShop(run);
  const s0 = run.shop.heroes[0], s1 = run.shop.heroes[1], s2 = run.shop.heroes[2];
  if (s0 === 'pillar' || s1 === 'pillar') throw new Error('Owned hero appeared in Recruit Slot!');
  if (!run.adv.pool.includes(s0) || !run.adv.pool.includes(s1)) throw new Error('Recruit outside enabled packs appeared in shop!');
  if (s2 !== 'pillar' || heroOffer(run, s2, 2).tier !== 2) throw new Error('Upgrade Slot did not offer owned hero Next-Tier Upgrade!');
  // Simulate beating Act 1 Boss -> must go directly to Act 2 'map' (NO 'packs' screen!)
  startAct(run);
  enterNode(run, run.adv.map[ADV.bossRow][0]);
  const bossRes = resolveNodeFight(run, true, { time: 18, gold: 2, units: [] });
  if (!bossRes.actDone || bossRes.actBonus !== 8) throw new Error('Act 1 Boss should grant Act Clear Bonus');
  const nextAfterBoss = afterNodeFight(run, bossRes);
  if (nextAfterBoss !== 'map' || run.adv.act !== 2 || run.adv.pos !== null || run.adv.path.length !== 0) {
    throw new Error('Beating Act 1 Boss must advance directly to fresh Act 2 map without mid-run pack screen! Got: ' + nextAfterBoss);
  }
  // Act 2 Pre-tiered Recruits + Camp Retraining + Map-Node Promotion
  rollShop(run);
  const recOffer = heroOffer(run, run.shop.heroes[0], 0);
  if (!recOffer.isNew || recOffer.tier !== 2) throw new Error('Act 2 unowned recruit must start at Tier II, got ' + recOffer.tier);
  run.gold = 100;
  const bought = buyHero(run, 0);
  if (!bought.ok || !bought.needsPath || bought.hero.tier !== 2) throw new Error('Buying Act 2 Tier II recruit must trigger Path choice!');
  bought.hero.path = H[bought.hero.key].paths[0].k;
  const altPath = H[bought.hero.key].paths[1].k;
  if (!retrainHeroPath(run, bought.hero.uid, altPath) || bought.hero.path !== altPath) throw new Error('Camp Retraining failed');
  const prom = promoteHero(run, bought.hero.uid);
  if (!prom.ok || bought.hero.tier !== 3 || !prom.needsAsi) throw new Error('Map-node Training Promotion failed');
  // Merchant's Scales 150% sell bonus
  bought.hero.items.push('merchants_scales');
  const baseRef = Math.max(1, Math.floor(ECON.itemPrice[ITEMS.flametongue.r] * .5));
  if (itemRefund(run, 'flametongue') !== Math.ceil(baseRef * 1.5)) throw new Error('Merchant Scales 150% sell refund failed');
  console.log('[PASS] Pre-Run Pack Toggles, Direct Act 1->2 Map Refresh, Shop Rules, Retraining, Promotion & Merchant Scales.');

  // 4. Piggy Bank Single Free-Loss Rule
  const pRun = newAdventure();
  startRunWithPacks(pRun, ['tavern']);
  freeHero(pRun, 'arthur');
  startAct(pRun);
  enterNode(pRun, pRun.adv.map[0][0]);
  resolveNodeFight(pRun, true, { time: 8, gold: 0, units: [] });
  if (pRun.piggy !== 2 || pRun.piggyBroken) throw new Error('Win should fill Piggy Bank');
  enterNode(pRun, pRun.adv.map[2][0]);
  const loss1 = resolveNodeFight(pRun, false, { time: 15, gold: 0, units: [] });
  if (!pRun.piggyBroken || loss1.piggy !== 2 || pRun.over) throw new Error('First loss must break Piggy Bank, pay out, and keep run alive');
  if (afterNodeFight(pRun, loss1) !== 'shop') throw new Error('First loss must return to shop to retry fight');
  resolveNodeFight(pRun, false, { time: 15, gold: 0, units: [] });
  if (!pRun.over) throw new Error('Second loss must end the run');
  console.log('[PASS] Piggy Bank Single Free-Loss Rule.');

  // 5. Quest Signature Rewards (Packs 1-6)
  if (heroStats({ key: 'dane', tier: 2, questDone: true }).sz !== 2) throw new Error('Sir Dane quest must be Large 2x2');
  if (heroStats({ key: 'pillar', tier: 2, questDone: true }).sz !== 2) throw new Error('Pillar Living Colossus quest must be Large 2x2');
  if (heroStats({ key: 'arthur', tier: 2, questDone: true }).abil.n !== 'Gauntlet Blast') throw new Error('Arthur quest must swap ability');
  if (slotsOf({ key: 'wallaby', tier: 2, questDone: true }) !== 3) throw new Error('Wallaby quest must grant +1 slot');
  if (slotsOf({ key: 'zoe', tier: 4, path: 'just_the_thing' }) !== 5) throw new Error('Zoe T4 Just the Thing must grant +1 slot');
  console.log('[PASS] Hero Quests (Packs 1-6: Sir Dane 2x2, Pillar 2x2, Arthur, Wallaby, Zoe T4).');

  // 6. Combat Benchmark Squads covering ALL 24 HEROES & ALL 16 ITEMS
  const benchComps = [
    {
      name: '1. Rage Snowball (Packs 1-3)',
      party: [
        { key: 'zark',     tier: 2, path: 'relentless', items: ['ember_bracers'], c: 4, r: 6 },
        { key: 'rosalind', tier: 2, path: 'passround',  items: ['amulet_devout'], c: 5, r: 7, questDone: true },
        { key: 'faelan',   tier: 2, path: 'battery',    items: ['headband'],      c: 3, r: 8 },
        { key: 'cinder',   tier: 2, path: 'draconic',   items: ['staff_power'],   c: 6, r: 8 }
      ]
    },
    {
      name: '2. Machine-Gun Marks (Packs 2-3)',
      party: [
        { key: 'dane',   tier: 2, path: 'calltoarms', items: ['sunblade'],         c: 4, r: 6, questDone: true },
        { key: 'lorcan', tier: 2, path: 'colossus',   items: ['oathbow'],          c: 2, r: 8 },
        { key: 'naill',  tier: 2, path: 'openhand',   items: ['whetstone'],        c: 6, r: 6 },
        { key: 'nettle', tier: 2, path: 'bargain',    items: ['clockwork_amulet'], c: 7, r: 8 }
      ]
    },
    {
      name: '3. Frontline & Forest (Packs 1-2)',
      party: [
        { key: 'arthur',  tier: 2, path: 'vigilance', items: ['flametongue'],      c: 4, r: 6, questDone: true },
        { key: 'bram',    tier: 2, path: 'divine',    items: ['potion_healing'],   c: 5, r: 6 },
        { key: 'wallaby', tier: 2, path: 'fasthands', items: ['dragonhide_belt'],  c: 6, r: 6 },
        { key: 'juniper', tier: 2, path: 'overgrowth',items: ['luckstone'],        c: 3, r: 8, questDone: true }
      ]
    },
    {
      name: '4. Pack 4: Divine Intervention (Pillar, Mother Laurel, Lumen, Jamison)',
      party: [
        { key: 'pillar',        tier: 2, path: 'unstoppable',    items: ['sunblade'],      c: 4, r: 6, questDone: true },
        { key: 'mother_laurel', tier: 2, path: 'bountiful_vines',items: ['sunlit_censer'], c: 6, r: 6, questDone: true },
        { key: 'lumen',         tier: 2, path: 'purifying',      items: ['staff_power'],   c: 3, r: 8, questDone: true },
        { key: 'jamison',       tier: 2, path: 'good_vibes',     items: ['amulet_devout'], c: 5, r: 7, questDone: true }
      ]
    },
    {
      name: '5. Pack 5: Cornering the Market (Zoe, Toot, Gilthrax, Gains)',
      party: [
        { key: 'gilthrax', tier: 2, path: 'gilded_hoard',      items: ['ember_bracers', 'sunblade'], c: 4, r: 6, questDone: true },
        { key: 'zoe',      tier: 2, path: 'just_the_thing',    items: ['potion_healing', 'luckstone'], c: 5, r: 6, questDone: true },
        { key: 'toot',     tier: 2, path: 'street_performer',  items: ['merchants_scales'], c: 3, r: 8, questDone: true, goldHeld: 20 },
        { key: 'gains',    tier: 2, path: 'compound_interest', items: ['metarod_quicken'],  c: 6, r: 8, questDone: true, goldHeld: 30 }
      ]
    },
    {
      name: '6. Pack 6: Surprise Round (Velith, Corvin, Saint, Kaska)',
      party: [
        { key: 'kaska',  tier: 2, path: 'lunar_resilience', items: ['cloak_elvenkind'], c: 4, r: 6, questDone: true },
        { key: 'corvin', tier: 2, path: 'stalker_flurry',   items: ['whetstone'],       c: 5, r: 6, questDone: true },
        { key: 'velith', tier: 2, path: 'nightshade',       items: ['dragonhide_belt'], c: 6, r: 6, questDone: true },
        { key: 'saint',  tier: 2, path: 'two_faced',        items: ['clockwork_amulet'],c: 3, r: 8, questDone: true }
      ]
    }
  ];

  const testedHeroes = new Set();
  for (const comp of benchComps) {
    comp.party.forEach(p => testedHeroes.add(p.key));
    let wins = 0, totalTime = 0, totalGold = 0;
    const trials = 8;
    for (let i = 0; i < trials; i++) {
      const b = simulate('orcs', comp.party, 1);
      if (b.winner === 'P') wins++;
      totalTime += b.time;
      totalGold += b.gold || 0;
    }
    console.log('[BENCH] ' + comp.name + ': ' + wins + '/' + trials + ' wins vs War Band (avg ' + (totalTime / trials).toFixed(1) + 's' + (totalGold ? ', Gold=' + totalGold : '') + ')');
  }
  if (testedHeroes.size !== 24) throw new Error('Expected all 24 heroes simulated, got ' + testedHeroes.size);
  console.log('[PASS] All 24/24 heroes simulated cleanly with 0 exceptions!');

  // 7. Global 1-cast/second Cap check
  const fastParty = [
    { key: 'faelan', tier: 3, path: 'battery', items: ['headband', 'metarod_quicken'], c: 4, r: 7 },
    { key: 'zark',   tier: 3, path: 'totemroar', items: ['potion_healing'], c: 5, r: 6 },
    { key: 'rosalind', tier: 3, path: 'encore', items: ['clockwork_amulet'], c: 3, r: 7 },
    { key: 'bram',   tier: 3, path: 'divine', items: ['sunblade'], c: 6, r: 6 }
  ];
  const bCap = newBattle('orcs', fastParty, 1);
  const castTimes = {};
  while (!bCap.over) {
    tick(bCap, TICK);
    for (const ev of bCap.events) {
      if (ev.k === 'roll' && ev.side === 'P') {
        const prev = castTimes[ev.id];
        if (prev != null && bCap.time - prev < MIN_CAST_INTERVAL - 1e-6) {
          throw new Error('Global 1-cast/sec cap violated! gap=' + (bCap.time - prev));
        }
        castTimes[ev.id] = bCap.time;
      }
    }
    bCap.events.length = 0;
  }
  console.log('[PASS] Global 1-cast/second cap strictly enforced.');
`, ctx);
