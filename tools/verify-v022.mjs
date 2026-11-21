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
  // 1. Cast & Item Counts (24 Heroes, 6 Packs, 46 Canonical D&D Items)
  if (HERO_ORDER.length !== 24) throw new Error('Expected 24 heroes, got ' + HERO_ORDER.length);
  if (PACK_ORDER.length !== 6) throw new Error('Expected 6 packs, got ' + PACK_ORDER.length);
  const allItemKeys = Object.keys(ITEMS);
  if (allItemKeys.length !== 46) throw new Error('Expected 46 total items, got ' + allItemKeys.length);
  if (CORE_ITEM_KEYS.length !== 46) throw new Error('Expected all 46 items in CORE_ITEM_KEYS, got ' + CORE_ITEM_KEYS.length);
  if (allItemKeys.some(k => ITEMS[k].fav || k.endsWith('@fav'))) throw new Error('Items must not have explicit Favoured Class tags');
  // Exact 6-attribute parity check (7 items & +20 score / +10 mod per attribute)
  const attrTotals = { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 };
  const attrCounts = { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 };
  allItemKeys.forEach(k => {
    Object.entries(ITEMS[k].a || {}).forEach(([a, v]) => { attrTotals[a] += v; attrCounts[a]++; });
  });
  Object.keys(attrTotals).forEach(a => {
    if (attrTotals[a] !== 20 || attrCounts[a] !== 7) {
      throw new Error('Attribute parity failed for ' + a + ': score=' + attrTotals[a] + ', items=' + attrCounts[a]);
    }
  });
  // Exactly 2 items interacting with each of the 12 classes' keywords
  const clsItemCount = {};
  allItemKeys.forEach(k => {
    const classes = new Set((ITEMS[k].kwHooks || []).map(kwk => CLASS_KW[kwk] && CLASS_KW[kwk].cls).filter(Boolean));
    classes.forEach(c => { clsItemCount[c] = (clsItemCount[c] || 0) + 1; });
  });
  const all12Classes = ['Fighter','Barbarian','Paladin','Cleric','Ranger','Rogue','Monk','Bard','Druid','Wizard','Sorcerer','Warlock'];
  all12Classes.forEach(c => {
    if (clsItemCount[c] !== 2) throw new Error('Expected 2 keyword items for ' + c + ', got ' + (clsItemCount[c] || 0));
  });
  // Direct combat stats check (independent of attributes)
  const stSword = heroStats({ key: 'arthur', tier: 1, items: ['longsword_p1'] });
  const stBase = heroStats({ key: 'arthur', tier: 1 });
  if (stSword.dmgBonus !== 2 || atkBonus(stSword, H.arthur) !== atkBonus(stBase, H.arthur) + 3) {
    throw new Error('Direct item Damage (+1 Longsword: +1 STR + +2 dmg) failed');
  }
  const stShield = heroStats({ key: 'arthur', tier: 1, items: ['shield'] });
  if (stShield.ac !== stBase.ac + 1) throw new Error('Shield +1 AC failed');
  const stPlate = heroStats({ key: 'arthur', tier: 1, items: ['plate_armor'] });
  if (stPlate.ac !== stBase.ac + 3 || stPlate.maxHp !== stBase.maxHp + 75) throw new Error('Plate Armor +3 AC / +75 HP failed');
  console.log('[PASS] Cast & Items: 24 heroes, 46 canonical D&D items (exact 7 items/+10 mod per attribute, 2 items/class, direct combat stats).');

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

  // 3. Pre-Run Pack Toggles, All Items in Shop, No Free Item, No Shop #1 Upgrade, Smooth Encounter Odds & Matching-Tier Upgrades
  const run = newAdventure();
  startRunWithPacks(run, ['divine', 'market']);
  if (run.adv.packs.length !== 2 || run.adv.pool.length !== 8) throw new Error('Pre-run pack toggle failed: expected 2 packs / 8 heroes');
  if (run.stash.length !== 0) throw new Error('Expected empty opening stash (no free first item), got ' + run.stash.length);
  if (run.adv.itemPool.length !== 46 || !run.adv.itemPool.includes('cloak_elvenkind') || !run.adv.itemPool.includes('bag_holding')) {
    throw new Error('All 46 items (including disabled pack items) must always be in shop itemPool');
  }
  freeHero(run, 'pillar');
  // First shop: MUST NOT contain an upgrade for owned starter hero
  openShop(run);
  if (run.shop.heroes.includes('pillar')) throw new Error('First shop must NOT offer a hero upgrade!');
  run.shop.heroes.forEach(k => { if (!run.adv.pool.includes(k)) throw new Error('Recruit outside enabled packs appeared in shop!'); });

  // Second shop (e=0 -> Tier 1): Tier 1 owned hero CAN now appear as a Tier 1 copy upgrade in slot 2
  openShop(run);
  if (run.shop.heroes[2] !== 'pillar' || heroOffer(run, 'pillar', 2).tier !== 2 || heroOffer(run, 'pillar', 2).offerTier !== 1) {
    throw new Error('Shop #2 should offer Tier I copy upgrade for Tier I owned hero');
  }
  // Upgrade pillar to Tier II -> Tier I copies must NEVER appear for pillar until sold!
  run.team[0].tier = 2;
  for (let trial = 0; trial < 40; trial++) {
    rollShop(run); // e=0 -> 100% Tier 1 slots
    if (run.shop.heroes.includes('pillar')) throw new Error('Lower-tier (Tier I) duplicate appeared for owned Tier II hero!');
  }
  // Encounter-scaled odds check: T1 still appears at e=12..15, while T2/T3 & Rare/Very Rare smoothly rise
  const ho0 = heroTierOdds(0), ho6 = heroTierOdds(6), ho15 = heroTierOdds(15);
  if (ho0[0] !== 1 || !(ho6[1] > ho0[1]) || !(ho15[2] > ho6[2]) || !(ho15[0] >= 0.25)) {
    throw new Error('Smooth encounter hero tier odds check failed: ' + JSON.stringify({ ho0, ho6, ho15 }));
  }
  const io0 = itemRarityOdds(0), io6 = itemRarityOdds(6), io15 = itemRarityOdds(15);
  if (io0[3] !== 0 || !(io6[2] > io0[2]) || !(io15[3] > io6[3]) || !(io15[0] >= 0.10)) {
    throw new Error('Smooth encounter item rarity odds check failed: ' + JSON.stringify({ io0, io6, io15 }));
  }
  // At e=8 (mid Act 2), Tier II copies appear and upgrade Tier II -> Tier III; lower-tier (Tier I) never appears for Tier II hero!
  run.stats.won = 8;
  let sawT2Upgrade = false;
  for (let trial = 0; trial < 120; trial++) {
    rollShop(run);
    for (let si = 0; si < 3; si++) {
      if (run.shop.heroes[si] === 'pillar') {
        const off = heroOffer(run, 'pillar', si);
        if (off.offerTier < 2) throw new Error('Lower-tier duplicate rolled for Tier II hero!');
        if (off.offerTier === 2 && off.tier === 3) sawT2Upgrade = true;
      }
    }
  }
  if (!sawT2Upgrade) throw new Error('Expected to see a Tier II copy upgrading Tier II -> Tier III at e=8');

  // Selling pillar lets Tier I duplicates of pillar appear again
  freeHero(run, 'lumen');
  sellHero(run, run.team[0].uid);
  run.stats.won = 0;
  let sawSoldBack = false;
  for (let trial = 0; trial < 80; trial++) {
    rollShop(run);
    if (run.shop.heroes.includes('pillar')) { sawSoldBack = true; break; }
  }
  if (!sawSoldBack) throw new Error('Sold hero should be able to reappear at Tier I in shop');

  // Direct Act 1 -> Act 2 map refresh + Camp Retraining + Map-Node Promotion + Bag of Holding 150% sell bonus
  startAct(run);
  enterNode(run, run.adv.map[ADV.bossRow][0]);
  const bossRes = resolveNodeFight(run, true, { time: 18, gold: 2, units: [] });
  if (!bossRes.actDone || bossRes.actBonus !== 8) throw new Error('Act 1 Boss should grant Act Clear Bonus');
  const nextAfterBoss = afterNodeFight(run, bossRes);
  if (nextAfterBoss !== 'map' || run.adv.act !== 2 || run.adv.pos !== null || run.adv.path.length !== 0) {
    throw new Error('Beating Act 1 Boss must advance directly to fresh Act 2 map! Got: ' + nextAfterBoss);
  }
  run.gold = 100;
  run.stats.won = 8;
  rollShop(run);
  const bought = buyHero(run, 0);
  if (!bought.ok) throw new Error('Buying recruit failed');
  if (bought.hero.tier < 2) promoteHero(run, bought.hero.uid);
  bought.hero.path = H[bought.hero.key].paths[0].k;
  const altPath = H[bought.hero.key].paths[1].k;
  if (!retrainHeroPath(run, bought.hero.uid, altPath) || bought.hero.path !== altPath) throw new Error('Camp Retraining failed');
  const prom = promoteHero(run, bought.hero.uid);
  if (!prom.ok || bought.hero.tier !== 3 || !prom.needsAsi) throw new Error('Map-node Training Promotion failed');
  bought.hero.items.push('bag_holding');
  const baseRef = Math.max(1, Math.floor(ECON.itemPrice[ITEMS.flametongue.r] * .5));
  if (itemRefund(run, 'flametongue') !== Math.ceil(baseRef * 1.5)) throw new Error('Bag of Holding 150% sell refund failed');
  console.log('[PASS] Pre-Run Pack Toggles, All Items in Shop, No Free Item, No Shop #1 Upgrade, Smooth Encounter Odds, Exact-Tier Upgrades & Bag of Holding.');

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

  // 6. Combat Benchmark Squads covering ALL 24 HEROES & ALL 46 ITEMS
  const benchComps = [
    {
      name: '1. Rage Snowball (Packs 1-3)',
      party: [
        { key: 'zark',     tier: 2, path: 'relentless', items: ['periapt_wound_closure', 'berserker_axe'], c: 4, r: 6 },
        { key: 'rosalind', tier: 2, path: 'passround',  items: ['pipes_haunting', 'horn_valhalla'], c: 5, r: 7, questDone: true },
        { key: 'faelan',   tier: 2, path: 'battery',    items: ['pearl_power', 'headband'], c: 3, r: 8 },
        { key: 'cinder',   tier: 2, path: 'draconic',   items: ['bloodwell_vial', 'wand_fireballs'], c: 6, r: 8 }
      ]
    },
    {
      name: '2. Machine-Gun Marks (Packs 2-3)',
      party: [
        { key: 'dane',   tier: 2, path: 'calltoarms', items: ['sentinel_shield', 'sunblade'], c: 4, r: 6, questDone: true },
        { key: 'lorcan', tier: 2, path: 'colossus',   items: ['bracers_archery', 'oathbow'], c: 2, r: 8 },
        { key: 'naill',  tier: 2, path: 'openhand',   items: ['dragonhide_belt', 'staff_striking'], c: 6, r: 6 },
        { key: 'nettle', tier: 2, path: 'bargain',    items: ['rod_pact_keeper', 'staff_withering'], c: 7, r: 8 }
      ]
    },
    {
      name: '3. Frontline & Forest (Packs 1-2)',
      party: [
        { key: 'arthur',  tier: 2, path: 'vigilance', items: ['weapon_warning', 'flametongue'], c: 4, r: 6, questDone: true },
        { key: 'bram',    tier: 2, path: 'divine',    items: ['potion_healing', 'staff_healing'], c: 5, r: 6 },
        { key: 'wallaby', tier: 2, path: 'fasthands', items: ['dagger_venom', 'scimitar_speed'], c: 6, r: 6 },
        { key: 'juniper', tier: 2, path: 'overgrowth',items: ['moon_sickle', 'staff_woodlands'], c: 3, r: 8, questDone: true }
      ]
    },
    {
      name: '4. Pack 4: Divine Intervention (Pillar, Mother Laurel, Lumen, Jamison)',
      party: [
        { key: 'pillar',        tier: 2, path: 'unstoppable',     items: ['dwarven_plate', 'frost_brand'], c: 4, r: 6, questDone: true },
        { key: 'mother_laurel', tier: 2, path: 'bountiful_vines', items: ['plate_armor', 'ring_regeneration'], c: 6, r: 6, questDone: true },
        { key: 'lumen',         tier: 2, path: 'purifying',       items: ['staff_power', 'robe_stars'], c: 3, r: 8, questDone: true },
        { key: 'jamison',       tier: 2, path: 'good_vibes',      items: ['amulet_devout', 'ring_spell_storing'], c: 5, r: 7, questDone: true }
      ]
    },
    {
      name: '5. Pack 5: Cornering the Market (Zoe, Toot, Gilthrax, Gains)',
      party: [
        { key: 'gilthrax', tier: 2, path: 'gilded_hoard',      items: ['amulet_health', 'boots_speed'], c: 4, r: 6, questDone: true },
        { key: 'zoe',      tier: 2, path: 'just_the_thing',    items: ['longsword_p1', 'breastplate'], c: 5, r: 6, questDone: true },
        { key: 'toot',     tier: 2, path: 'street_performer',  items: ['bag_holding', 'leather_armor'], c: 3, r: 8, questDone: true, goldHeld: 20 },
        { key: 'gains',    tier: 2, path: 'compound_interest', items: ['wand_war_mage', 'luckstone'], c: 6, r: 8, questDone: true, goldHeld: 30 }
      ]
    },
    {
      name: '6. Pack 6: Surprise Round (Velith, Corvin, Saint, Kaska)',
      party: [
        { key: 'kaska',  tier: 2, path: 'lunar_resilience', items: ['cloak_elvenkind', 'cloak_displacement'], c: 4, r: 6, questDone: true },
        { key: 'corvin', tier: 2, path: 'stalker_flurry',   items: ['rapier_p1', 'shield'], c: 5, r: 6, questDone: true },
        { key: 'velith', tier: 2, path: 'nightshade',       items: ['longbow_p1', 'clockwork_amulet'], c: 6, r: 6, questDone: true },
        { key: 'saint',  tier: 2, path: 'two_faced',        items: ['clockwork_amulet', 'amulet_devout'], c: 3, r: 8, questDone: true }
      ]
    }
  ];

  const testedHeroes = new Set();
  const testedItems = new Set();
  for (const comp of benchComps) {
    comp.party.forEach(p => { testedHeroes.add(p.key); (p.items || []).forEach(ik => testedItems.add(ik)); });
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
  if (testedItems.size !== 46) {
    const missing = allItemKeys.filter(k => !testedItems.has(k));
    throw new Error('Expected all 46 items simulated, missing: ' + missing.join(', '));
  }
  console.log('[PASS] All 24/24 heroes and all 46/46 items simulated cleanly with 0 exceptions!');

  // 7. Global 1-cast/second Cap check
  const fastParty = [
    { key: 'faelan', tier: 3, path: 'battery', items: ['headband', 'bloodwell_vial'], c: 4, r: 7 },
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

  // 8. 12-Class Keyword System & Sir Dane Non-Mark Rework verification
  const expectedKws = [
    'action_surge', 'channel_divinity', 'smite', 'aura', 'arcane_recovery', 'rage',
    'bardic_inspiration', 'wild_shape', 'hunters_mark', 'sneak_attack', 'cunning_action',
    'ki', 'ki_ability', 'sorcery_points', 'metamagic', 'hex', 'pact_boon'
  ];
  if (Object.keys(CLASS_KW).length !== 17) throw new Error('Expected 17 Class Keywords, got ' + Object.keys(CLASS_KW).length);
  expectedKws.forEach(k => { if (!CLASS_KW[k] || !KW[k]) throw new Error('Missing Class Keyword: ' + k); });
  if (CLASS_KW.natural_recovery || CLASS_KW.natrec) throw new Error('Natural Recovery must NOT be a Class Keyword');
  HERO_ORDER.forEach(hk => {
    const h = H[hk];
    if (!h.ckw || !h.ckw.length) throw new Error('Hero missing ckw expression: ' + hk);
    h.ckw.forEach(e => {
      if (!CLASS_KW[e.k]) throw new Error('Unknown ckw key ' + e.k + ' on ' + hk);
      if (CLASS_KW[e.k].cls !== h.cls) throw new Error('Class Keyword class mismatch on ' + hk + ': ' + e.k);
    });
  });

  // Ranger-exclusive Hunter's Mark check: Sir Dane & Naill must NEVER apply Hunter's Mark
  const markHolders = HERO_ORDER.filter(hk => classKwOf(hk).includes('hunters_mark'));
  if (markHolders.sort().join(',') !== 'corvin,lorcan') throw new Error('Hunter’s Mark must belong only to Rangers (corvin,lorcan), got ' + markHolders);
  if (H.dane.quest.statKey !== 'smites') throw new Error('Sir Dane quest must track smites, got ' + H.dane.quest.statKey);
  const bDane = simulate('orcs', [
    { key: 'dane', tier: 2, path: 'calltoarms', items: ['sunblade'], c: 4, r: 6, questDone: true },
    { key: 'naill', tier: 2, path: 'flowing', items: ['dragonhide_belt'], c: 5, r: 6 }
  ], 1);
  if (bDane.kwCounts.hunters_mark) throw new Error('Sir Dane + Naill must NOT trigger Hunter’s Mark!');
  if (!(bDane.kwCounts.smite > 0)) throw new Error('Sir Dane must trigger Smite!');
  if (!(bDane.kwCounts.ki_ability > 0)) throw new Error('Naill must trigger Ki Ability!');

  // Sir Dane Aura of Devotion check (+1 AC/+1 SR)
  const bAura = newBattle('orcs', [
    { key: 'dane', tier: 2, path: 'devotion', c: 4, r: 6 },
    { key: 'bram', tier: 2, path: 'divine', c: 5, r: 6 }
  ], 1);
  applyAuras(bAura);
  const bramUnit = bAura.units.find(x => x.key === 'bram');
  if (!(bramUnit.auraAC >= 1 && bramUnit.auraSR >= 1 && bramUnit.auraDane)) throw new Error('Sir Dane Aura of Devotion did not buff adjacent ally');

  // Staff of Power doubles Arcane Recovery Charge
  const bRec = newBattle('orcs', [
    { key: 'faelan', tier: 2, path: 'battery', items: ['staff_power'], c: 3, r: 8 },
    { key: 'gains',  tier: 2, path: 'liquid_assets', items: ['staff_power'], c: 5, r: 8 }
  ], 1);
  const faeU = bRec.units.find(x => x.key === 'faelan');
  const gainU = bRec.units.find(x => x.key === 'gains');
  faeU.charge = 0;
  const gotFae = triggerArcaneRecovery(bRec, faeU, 20, 'TEST');
  if (gotFae !== 40) throw new Error('Staff of Power must double Faelan Arcane Recovery (expected 40, got ' + gotFae + ')');
  gainU.charge = 0; faeU.charge = 0;
  const gotGain = triggerArcaneRecovery(bRec, gainU, 16, 'TEST');
  if (gotGain !== 32 || !(faeU.charge >= 16)) throw new Error('Gains Liquid Assets + Staff of Power Arcane Recovery share failed');

  // Cross-class triggers across all remaining Class Keywords
  const bKw1 = simulate('orcs', [
    { key: 'arthur', tier: 2, path: 'initiative', items: ['flametongue'], c: 4, r: 6 },
    { key: 'zoe', tier: 2, path: 'just_the_thing', items: ['clockwork_amulet'], c: 5, r: 6 },
    { key: 'gilthrax', tier: 2, path: 'gilded_hoard', items: ['weapon_warning'], c: 3, r: 6, questDone: true },
    { key: 'lumen', tier: 2, path: 'purifying', items: ['amulet_devout'], c: 6, r: 8 }
  ], 1);
  if (!(bKw1.kwCounts.action_surge > 0)) throw new Error('Fighter squad must trigger Action Surge');

  const bKw2 = simulate('orcs', [
    { key: 'bram', tier: 2, path: 'divine', items: ['sunblade'], c: 4, r: 6 },
    { key: 'jamison', tier: 2, path: 'peace_radiance', items: ['amulet_devout'], c: 5, r: 6 },
    { key: 'saint', tier: 2, path: 'smoke_mirrors', items: ['clockwork_amulet'], c: 3, r: 8 },
    { key: 'kaska', tier: 2, path: 'pack_hunt', items: ['cloak_elvenkind'], c: 6, r: 6 }
  ], 1);
  if (!(bKw2.kwCounts.channel_divinity > 0)) throw new Error('Cleric squad must trigger Channel Divinity');
  if (!(bKw2.kwCounts.wild_shape > 0)) throw new Error('Kaska must trigger Wild Shape');
  if (!(bKw2.kwCounts.cunning_action > 0)) throw new Error('Cloak of Elvenkind must trigger Cunning Action');

  // Unified Bardic Inspiration (Toot Mote activates Rosalind Encore!)
  const bBard = newBattle('orcs', [
    { key: 'rosalind', tier: 2, path: 'encore', c: 4, r: 8 },
    { key: 'toot', tier: 2, path: 'street_performer', c: 6, r: 8 },
    { key: 'arthur', tier: 2, path: 'vigilance', c: 5, r: 8 }
  ], 1);
  const tootU = bBard.units.find(x => x.key === 'toot');
  const arthU = bBard.units.find(x => x.key === 'arthur');
  grantInspMote(bBard, tootU, arthU, 10);
  applyAuras(bBard);
  if (!(arthU.auraCr >= 40)) throw new Error('Rosalind Encore must recognize Toot Bardic Inspiration Mote!');

  console.log('[PASS] All 12-Class / 17-Keyword rules, Sir Dane non-Mark rework, and cross-class synergies verified!');
`, ctx);
