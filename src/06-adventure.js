/* ================= 0.23 ADVENTURE: 9-ROW DAG MAP, 3 ACTS, CAMP SHOP, CURIO, MULTICLASS & EVENTS =================
   Pure game logic, zero DOM dependencies (runs in both browser and Node headless tests).
   Implements v0.23 design specs:
   - Camp Shop Flow Flip (opens after win / Act start; Act Boss Reminder; Whole-Shop Freeze only)
   - Constricting Non-Crossing 9-Row DAG genMap() with explicit node.next edges
   - 3 Full Acts (Phandalin -> White Plume Mountain -> The Hells) with self-contained ACTS modules + nextActChoices()
   - Stationary Miniboss (Act 1 Klarg), Dungeon Hazards + Vault Loot (Act 2), Wandering Miniboss (Act 3 Pit Fiend)
   - 18 D&D Mystery Events (6 per Act) + ? weighted resolver (55% Event, 20% Ambush, 15% Treasure, 10% Peddler)
   - Curio Merchant (party-keyword-filtered 5g Unique items + 2g reroll)
   - Single-Class Named Multiclass Nodes (12 unique nodes, no repeats per run, fallback +4g / +1 Attr)
   - Opt-In Quest Board (accept 1 hero's personal Quest or claim bounty)
   - Tier IV 1-of-3 Universal Epic Boon picker
   - Standing Piggy Bank single free-loss rule
*/

const ECON = {
  freeLosses: 1,
  piggyPerWin: 2,
  actIntactBonus: 3,
  interestStep: 5,
  interestCap: 5,
  winGold: d => 6 + Math.floor(d / 3),
  lossGold: () => 0,
  heroPrice: t => [0, 4, 7, 11, 15][t] || 15,
  itemPrice: [3, 4, 6, 9, 13, 7], // Common 3, Uncommon 4, Rare 6, Very Rare 9, Legendary 13, Unique 7
  reroll: n => 1 + n,
  curioReroll: 2,
  sellBack: 1,
  sale: 2,
  victory: 999,
  board: 4,
  bench: 0,
  stash: 10,
  shopHeroes: 4,
  shopItems: 3
};

/* ---------- v0.24 Camp / Guild Rank Progression (Immediate vs Future Power!) ---------- */
const CAMP_RANKS = [
  null,
  { rank: 1, n: 'Camp Rank I',   cost: 0,  interestCap: 5,  hrSlots: 2, hrMaxR: 1, tierBonus: 0,  itemBonus: 0, freeReroll: 0, desc: '2 House Rule slots (Common/Uncommon) · Interest cap +5g' },
  { rank: 2, n: 'Camp Rank II',  cost: 7,  interestCap: 7,  hrSlots: 2, hrMaxR: 2, tierBonus: 12, itemBonus: 2, freeReroll: 0, desc: 'Unlocks Rare House Rules · +12% T2 Hero odds · Interest cap +7g' },
  { rank: 3, n: 'Camp Rank III', cost: 11, interestCap: 9,  hrSlots: 3, hrMaxR: 3, tierBonus: 24, itemBonus: 4, freeReroll: 0, desc: '3rd House Rule slot · Unlocks Legendary Rules & Very Rare items · Interest cap +9g' },
  { rank: 4, n: 'Camp Rank IV',  cost: 15, interestCap: 12, hrSlots: 3, hrMaxR: 3, tierBonus: 36, itemBonus: 6, freeReroll: 1, desc: '1 Free Reroll/visit · Guaranteed Rare+ Item & Rule · Interest cap +12g' }
];

const TIERCOL = { 1: '#a8743c', 2: '#8c9aa8', 3: '#d0a02a', 4: '#8a4fb8' };
const heroValue = t => { let v = 0; for (let i = 1; i <= t; i++) v += ECON.heroPrice(i); return v; };
const hasHouseRule = (run, k) => !!(run && Array.isArray(run.houseRules) && run.houseRules.includes(k));
const campRankOf = run => Math.max(1, Math.min(4, (run && run.campRank) || 1));
const campRankDef = run => CAMP_RANKS[campRankOf(run)] || CAMP_RANKS[1];
function campRankUpgradeCost(run) {
  const cur = campRankOf(run);
  if (cur >= 4) return null;
  const next = CAMP_RANKS[cur + 1];
  const disc = (run && run.campDiscount) || 0;
  const qm = hasHouseRule(run, 'hr_quartermaster') ? 2 : 0;
  return Math.max(2, next.cost - disc - qm);
}
function goldInterestCap(run) {
  return campRankDef(run).interestCap + (hasHouseRule(run, 'hr_guild_treasury') ? 4 : 0);
}
const goldInterest = run => Math.min(goldInterestCap(run), Math.floor(Math.max(0, (run && run.gold) || 0) / ECON.interestStep));
const actOf = run => (run && run.adv ? run.adv.act : 1);
const encounterCount = run => Math.max(0, (run && run.stats && run.stats.won) || 0);
const slotsOf = h => (h && h.key === 'wallaby' && h.questDone) ? 4 : 3;

/* ---------- Smooth Per-Encounter Progression Curves (Boosted by Camp Rank!) ---------- */
function heroTierOdds(e, campRank = 1) {
  const n = Math.max(0, e || 0);
  const tb = (CAMP_RANKS[campRank] && CAMP_RANKS[campRank].tierBonus) || 0;
  const t3 = (n < 5 && campRank < 3) ? 0 : Math.min(42, Math.max(0, (n - 4) * 3) + Math.floor(tb * 0.45));
  const t2Raw = (n < 1 && campRank < 2) ? 0 : Math.min(60, n * 5 + Math.floor(tb * 0.7));
  const t1 = Math.max(15, 100 - t2Raw - t3);
  const t2 = Math.max(0, 100 - t1 - t3);
  return [t1 / 100, t2 / 100, t3 / 100];
}
function rollOfferTier(run, rand = Math.random) {
  const o = heroTierOdds(encounterCount(run), campRankOf(run));
  let x = rand();
  for (let t = 0; t < 3; t++) { x -= o[t]; if (x <= 0) return t + 1; }
  return 1;
}

// v0.24 Smooth 5-Tier Item Rarity Curve (Common / Uncommon / Rare / Very Rare / Legendary)
const ITEM_ODDS_TABLE = [
  [0,  [60, 40,  0,  0, 0]],
  [2,  [50, 40, 10,  0, 0]],
  [4,  [40, 40, 18,  2, 0]],
  [6,  [32, 36, 24,  8, 0]],
  [8,  [24, 32, 28, 15, 1]],
  [10, [16, 26, 30, 23, 5]],
  [12, [12, 20, 30, 29, 9]],
  [15, [ 8, 16, 28, 34, 14]]
];
function itemRarityOdds(e, campRank = 1) {
  const ib = (CAMP_RANKS[campRank] && CAMP_RANKS[campRank].itemBonus) || 0;
  const n = Math.max(0, (e || 0) + ib);
  const T = ITEM_ODDS_TABLE;
  if (n <= T[0][0]) return T[0][1].map(v => v / 100);
  if (n >= T[T.length - 1][0]) return T[T.length - 1][1].map(v => v / 100);
  for (let i = 0; i < T.length - 1; i++) {
    const [e0, p0] = T[i], [e1, p1] = T[i + 1];
    if (n >= e0 && n <= e1) {
      const f = (n - e0) / (e1 - e0);
      const raw = p0.map((v, j) => v + (p1[j] - v) * f);
      const sum = raw.reduce((a, b) => a + b, 0) || 100;
      return raw.map(v => v / sum);
    }
  }
  return T[0][1].map(v => v / 100);
}
function rollItemRarity(run, rand = Math.random, bonusEnc = 0) {
  const o = itemRarityOdds(encounterCount(run) + bonusEnc, campRankOf(run));
  let x = rand();
  for (let r = 0; r < 5; r++) { x -= o[r]; if (x <= 0) return r; }
  return 0;
}
function rollItemFromPool(avail, run, rand = Math.random, bonusEnc = 0, minR = 0) {
  const std = (avail || []).filter(k => ITEMS[k] && ITEMS[k].r <= 4);
  if (!std.length) return null;
  const targetR = Math.max(minR, rollItemRarity(run, rand, bonusEnc));
  let bucket = std.filter(k => ITEMS[k].r === targetR);
  for (let d = 1; d <= 4 && !bucket.length; d++) {
    bucket = std.filter(k => ITEMS[k].r === targetR + d || (targetR - d >= minR && ITEMS[k].r === targetR - d));
  }
  const pickFrom = bucket.length ? bucket : std;
  return pickFrom[Math.floor(rand() * pickFrom.length)];
}

/* ---------- v0.24 Exponential Difficulty Curve (Balatro-Style Escalation) ----------
   Act 1 (d 1..6): gentle flat-power friendly onboarding
   Act 2 (d 6..11): steepening inflection point demanding synergies & House Rules
   Act 3 (d 11..16+): true exponential endgame demanding multiplicative engines */
const CURVE = {
  share: [.52, .68, .84, .95, 1],
  retry: .94
};
function curveAt(d) {
  const x = Math.max(1, d || 1);
  const di = Math.floor(x);
  const share = CURVE.share[Math.min(di, CURVE.share.length) - 1];
  // Piecewise smooth exponential: gentle Act 1, accelerating Act 2, steep exponential Act 3!
  if (x <= 6) {
    const t = x - 1;
    return {
      share,
      hp: +(0.74 * Math.pow(1.11, t)).toFixed(3),
      dmg: +(0.76 * Math.pow(1.09, t)).toFixed(3)
    };
  }
  if (x <= 10.5) {
    const t = x - 6;
    return {
      share,
      hp: +(1.250 * Math.pow(1.225, t)).toFixed(3),
      dmg: +(1.170 * Math.pow(1.175, t)).toFixed(3)
    };
  }
  const t = x - 10.5;
  return {
    share,
    hp: +(3.115 * Math.pow(1.31, t)).toFixed(3),
    dmg: +(2.425 * Math.pow(1.21, t)).toFixed(3)
  };
}

const HAZARDS = {
  steam:        { k: 'steam',        n: 'Boiling Steam',      g: '♨', x: 'All non-fireproof units take 3% Max HP fire ticks every 3s. Grants Vault Loot!' },
  frictionless: { k: 'frictionless', n: 'Frictionless Floor', g: '❄', x: 'Push distances doubled and movement slowed 20%. Grants Vault Loot!' },
  dampener:     { k: 'dampener',     n: 'Arcane Dampener',    g: '◈', x: '35% slower Charge gain for both sides during the first 10s. Grants Vault Loot!' }
};
const HAZARD_KEYS = Object.keys(HAZARDS);

const ADV = {
  acts: 3, rows: 9, bossRow: 8,
  depth: (act, r) => [1, 5.8, 9.8][act - 1] + r * [.58, .52, .50][act - 1],
  bossDepth: act => [5.9, 10.2, 13.8][act - 1],
  eliteDepth: 0.90, eliteK: 1.18, eliteGold: 5,
  minibossDepth: 1.05, minibossK: 1.20,
  startGold: 9
};

const NODE = {
  fight:      { n: 'Fight',          g: '⚔' },
  elite:      { n: 'Dangerous',      g: '☠' },
  miniboss:   { n: 'Miniboss',       g: '★' },
  boss:       { n: 'Act Boss',       g: '♛' },
  mystery:    { n: 'Mystery',        g: '?' },
  rest:       { n: 'Campfire',       g: '♨' },
  train:      { n: 'Training',       g: '✦' },
  quest:      { n: 'Quest Board',    g: '❖' },
  treasure:   { n: 'Treasure',       g: '◆' },
  curio:      { n: 'Curio Merchant', g: '⚖' },
  multiclass: { n: 'Multiclass',     g: '✧' }
};

/* ---------- 18 Curated Act ? Mystery Events (6 per Act) ---------- */
const ACT_EVENTS = {
  phandalin: [
    {
      id: 'barthen', n: 'Barthen’s Provisions',
      body: 'Elmar Barthen waves you behind the counter of his general store. “Quiet week on the Triboar Trail—need gear or coin?”',
      choices: [
        { label: 'Buy Discounted Rare Gear (3g)', cost: 3, fx(run, rand) { const k = rollItemFromPool(STANDARD_ITEM_KEYS, run, rand, 4, 2); if (k && run.stash.length < ECON.stash) run.stash.push(k); return k ? `Bought ${ITEMS[k].n} for 3g!` : 'Stash full.'; } },
        { label: 'Claim Free Travel Rations (+4g)', fx(run) { run.gold += 4; run.stats.gold += 4; return 'Claimed +4g in trade supplies.'; } }
      ]
    },
    {
      id: 'sildar', n: 'Sildar Hallwinter in Chains',
      body: 'You discover the bruised Lords’ Alliance knight bound in a roadside culvert. “Cut me loose and I’ll drill your squad myself.”',
      choices: [
        { label: 'Bribe the Goblin Lookout (3g → +1 Random Attr to Party)', cost: 3, fx(run, rand) { run.team.forEach(h => { const a = H[h.key].pair[1]; h.train = h.train || {}; h.train[a] = (h.train[a] || 0) + 1; }); return 'Sildar trained the entire party (+1 Key Attribute each)!'; } },
        { label: 'Free Him Quietly (+1 Training to 1st Hero & +2g)', fx(run) { const h = run.team[0]; if (h) { const a = H[h.key].pair[1]; h.train = h.train || {}; h.train[a] = (h.train[a] || 0) + 1; } run.gold += 2; run.stats.gold += 2; return 'Freed Sildar (+1 Key Attr & +2g).'; } }
      ]
    },
    {
      id: 'agatha', n: 'Agatha the Banshee',
      body: 'Silver mist swirls around a bower of woven branches. Agatha’s spectral eyes fix on your packs. “An offering… for forbidden insight.”',
      choices: [
        { label: 'Offer 5g → Promote Lowest-Tier Hero (+1 Tier)', cost: 5, fx(run) { const h = run.team.slice().sort((a, b) => a.tier - b.tier)[0]; if (!h || h.tier >= 4) return 'No hero eligible to promote.'; const res = promoteHero(run, h.uid); return { msg: `Agatha’s blessing promoted ${H[h.key].name} to Tier ${h.tier}!`, promote: res }; } },
        { label: 'Bow Respectfully & Leave (+2g Piggy Bank)', fx(run) { if (!run.piggyBroken) run.piggy += 2; else { run.gold += 2; run.stats.gold += 2; } return 'Left quietly (+2g saved).'; } }
      ]
    },
    {
      id: 'tymora', n: 'Shrine of Tymora',
      body: 'A gleaming silver chalice rests atop Phandalin’s Luck Shrine. Toss a coin and roll Lady Luck’s d20.',
      choices: [
        { label: 'Toss 2g & Roll d20 (High: +8g & Rare Item!)', cost: 2, fx(run, rand) {
          const r = 1 + Math.floor(rand() * 20);
          if (r >= 13) { const k = rollItemFromPool(STANDARD_ITEM_KEYS, run, rand, 4, 2); run.gold += 8; run.stats.gold += 8; if (k && run.stash.length < ECON.stash) run.stash.push(k); return `Rolled ${r}! Lady Luck grants +8g and ${k ? ITEMS[k].n : 'glory'}!`; }
          if (r >= 7) { run.gold += 4; run.stats.gold += 4; return `Rolled ${r}! Won back +4g.`; }
          return `Rolled ${r}… the coin vanishes into the basin.`;
        } },
        { label: 'Keep Your Coin (+1g)', fx(run) { run.gold += 1; run.stats.gold += 1; return 'Pocketed a stray copper (+1g).'; } }
      ]
    },
    {
      id: 'tavern_brawl', n: 'Redbrand Tavern Brawl',
      body: 'Redbrand toughs block the Sleeping Giant doorway, jeering at your party.',
      choices: [
        { label: 'Intimidate Them (Need CHA ≥ 14 Hero → +6g)', fx(run) {
          const ok = run.team.some(h => heroStats(cfgOf(h, run)).sc.cha >= 14);
          if (ok) { run.gold += 6; run.stats.gold += 6; return 'Your silver tongue sends them packing! Claimed +6g.'; }
          run.gold += 2; run.stats.gold += 2; return 'They back off grudgingly (+2g).';
        } },
        { label: 'Fight for Bounty! (Combat + 5g Bonus)', fight: 'redbrands', bonusGold: 5, fx() { return 'Rolling into brawl!'; } }
      ]
    },
    {
      id: 'reidoth', n: 'Reidoth the Druid',
      body: 'A weathered old druid tends glowing herbs beside a fallen stone wall. “Take a breath before the dragon’s roost.”',
      choices: [
        { label: 'Restore Piggy Bank (or +5g if intact)', fx(run) {
          if (run.piggyBroken) { run.piggyBroken = false; run.losses = 0; run.piggy = Math.max(run.piggy, 4); return 'Reidoth mended your Piggy Bank (free loss restored)!'; }
          run.gold += 5; run.stats.gold += 5; return 'Piggy Bank already intact — received +5g in rare herbs!';
        } },
        { label: 'Brew Goodberries (+4g to Piggy Bank)', fx(run) { if (!run.piggyBroken) run.piggy += 4; else { run.gold += 4; run.stats.gold += 4; } return 'Added +4g to Piggy Bank.'; } }
      ]
    }
  ],

  white_plume: [
    {
      id: 'vault_wave', n: 'Vault of Wave',
      body: 'Behind a shimmering curtain of boiling mist rests a pedestal carved like a cresting sea serpent.',
      choices: [
        { label: 'Test Your Wisdom (Claim Free Very Rare / Rare Item)', fx(run, rand) { const k = rollItemFromPool(STANDARD_ITEM_KEYS, run, rand, 5, 2); if (k && run.stash.length < ECON.stash) run.stash.push(k); return k ? `Claimed ${ITEMS[k].n} from the Vault of Wave!` : 'Stash full.'; } },
        { label: 'Drink the Tidewater (+1 WIS to All Heroes)', fx(run) { run.team.forEach(h => { h.train = h.train || {}; h.train.wis = (h.train.wis || 0) + 1; }); return 'All heroes gained +1 WIS!'; } }
      ]
    },
    {
      id: 'vault_whelm', n: 'Vault of Whelm',
      body: 'Dwarven runes thrum across an anvil chamber. A voice booms: “Prove your grit and take steel worthy of kings!”',
      choices: [
        { label: 'Endure the Shockwave (+2 STR to Frontline Hero)', fx(run) { const h = run.team.find(x => H[x.key].reach === 'Melee') || run.team[0]; if (h) { h.train = h.train || {}; h.train.str = (h.train.str || 0) + 2; } return `${h ? H[h.key].name : 'Hero'} gained +2 STR!`; } },
        { label: 'Claim the Forged Coinage (+6g)', fx(run) { run.gold += 6; run.stats.gold += 6; return 'Claimed +6g from the dwarven chest.'; } }
      ]
    },
    {
      id: 'tetanus_pit', n: 'The Super-Tetanus Pit',
      body: 'Swinging chains hang above a glistening pit piled high with gleaming adventurer gear.',
      choices: [
        { label: 'Swing Across! (65% Very Rare Item, 35% Ambush)', fx(run, rand) {
          if (rand() < .65) { const k = rollItemFromPool(STANDARD_ITEM_KEYS, run, rand, 6, 3); if (k && run.stash.length < ECON.stash) run.stash.push(k); return k ? `Clean swing! Snagged ${ITEMS[k].n}!` : 'Clean swing!'; }
          return { ambush: true, msg: 'A chain snaps—monsters swarm the ledge!' };
        } },
        { label: 'Skirt the Edge Safely (+3g)', fx(run) { run.gold += 3; run.stats.gold += 3; return 'Gathered +3g safely along the ledge.'; } }
      ]
    },
    {
      id: 'talking_wall', n: 'The Talking Wall’s Riddle',
      body: 'A stone face grins from the dungeon corridor. “Answer true, or pay in silver, and I’ll speed your destiny!”',
      choices: [
        { label: 'Solve the Riddle (Advance Active Quest by +50% or +5g)', fx(run) {
          const qh = run.team.find(h => h.questActive && !h.questDone);
          if (qh) {
            const q = H[qh.key].quest;
            qh.questProg = Math.min(q.goal, (qh.questProg || 0) + Math.ceil(q.goal * .5));
            if (qh.questProg >= q.goal) { qh.questDone = true; return `Riddle solved! ${H[qh.key].name} completed ${q.rewardName}!`; }
            return `Riddle solved! ${H[qh.key].name}’s quest surged forward (${qh.questProg}/${q.goal}).`;
          }
          run.gold += 5; run.stats.gold += 5; return 'Riddle solved! Claimed +5g.';
        } },
        { label: 'Demand a Curio Relic (5g → Random Party Unique)', cost: 5, fx(run, rand) {
          const owned = new Set(run.stash.concat(...run.team.map(h => h.items)));
          const pool = uniqueItemsForParty(run.team, owned);
          const k = (pool.length ? pool : UNIQUE_ITEM_KEYS)[Math.floor(rand() * (pool.length ? pool.length : UNIQUE_ITEM_KEYS.length))];
          if (k && run.stash.length < ECON.stash) run.stash.push(k);
          return k ? `The wall opens to reveal ${ITEMS[k].n}!` : 'Stash full.';
        } }
      ]
    },
    {
      id: 'keraptis_mirror', n: 'Keraptis’s Mirror',
      body: 'A silvered mirror reflects your party twice over, humming with transmutation magic.',
      choices: [
        { label: 'Duplicate a Common/Uncommon Item in Party or Stash', fx(run) {
          const all = [...run.stash, ...run.team.flatMap(h => h.items)].filter(k => ITEMS[k] && ITEMS[k].r <= 1);
          if (all.length && run.stash.length < ECON.stash) { const k = all[all.length - 1]; run.stash.push(k); return `Mirrored a copy of ${ITEMS[k].n} into your stash!`; }
          run.gold += 4; run.stats.gold += 4; return 'No Common/Uncommon item to mirror—gained +4g instead.';
        } },
        { label: 'Shatter the Mirror (+5g)', fx(run) { run.gold += 5; run.stats.gold += 5; return 'Salvaged +5g of silvered glass.'; } }
      ]
    },
    {
      id: 'turnkey_toll', n: 'Turnkey’s Toll',
      body: 'A hooded dungeon caretaker rattles a ring of bronze valve keys. “For a fee, I can shut down every trap left on this floor.”',
      choices: [
        { label: 'Pay 4g → Clear All Dungeon Hazards on This Act Map', cost: 4, fx(run) {
          (run.adv.map || []).forEach(row => row.forEach(n => { if (n.hazard) n.hazard = null; }));
          return 'Every remaining Dungeon Hazard in White Plume Mountain has been disarmed!';
        } },
        { label: 'Keep Your Gold & Brave the Traps (+3g)', fx(run) { run.gold += 3; run.stats.gold += 3; return 'Declined the Turnkey (+3g found).'; } }
      ]
    }
  ],

  hells: [
    {
      id: 'infernal_contract', n: 'The Infernal Contract',
      body: 'A smiling contract devil unrolls a flaming parchment. “Instant ascension for one champion… merely forfeit your safety net.”',
      choices: [
        { label: 'Sign in Blood (Free +1 Tier Promotion; Breaks Piggy Bank!)', fx(run) {
          const h = run.team.slice().sort((a, b) => a.tier - b.tier)[0];
          if (!h || h.tier >= 4) return 'All heroes already Tier IV.';
          run.piggyBroken = true; run.piggy = 0; run.losses = Math.max(run.losses, ECON.freeLosses);
          const res = promoteHero(run, h.uid);
          return { msg: `Contract signed! ${H[h.key].name} ascended to Tier ${h.tier} (Piggy Bank shattered!).`, promote: res };
        } },
        { label: 'Burn the Parchment (+4g)', fx(run) { run.gold += 4; run.stats.gold += 4; return 'Rejected the devil and took +4g of brimstone gold.'; } }
      ]
    },
    {
      id: 'soul_coins', n: 'Soul Coin Hoard',
      body: 'An overturned infernal war-wagon spills glowing soul coins across the obsidian waste.',
      choices: [
        { label: 'Scoop the Hoard (+14g; Act 3 Boss gains +8% Damage)', fx(run) {
          run.gold += 14; run.stats.gold += 14;
          run.adv.bossBuff = (run.adv.bossBuff || 0) + 0.08;
          return 'Claimed +14g! The Lord of the Ninth grows +8% deadlier.';
        } },
        { label: 'Leave the Cursed Coin (+2g to Piggy Bank)', fx(run) { if (!run.piggyBroken) run.piggy += 2; else { run.gold += 2; run.stats.gold += 2; } return 'Left the cursed hoard untouched.'; } }
      ]
    },
    {
      id: 'styx_ferryman', n: 'Ferryman of the Styx',
      body: 'A gaunt merrenoloth poles silently up to the obsidian bank, offering a veiled relic chest.',
      choices: [
        { label: 'Trade 6g → Guaranteed Legendary Artifact!', cost: 6, fx(run, rand) {
          const leg = ITEM_BY_R[4];
          const k = leg[Math.floor(rand() * leg.length)];
          if (k && run.stash.length < ECON.stash) run.stash.push(k);
          return k ? `The Ferryman hands over ${ITEMS[k].n}!` : 'Stash full.';
        } },
        { label: 'Pass Quietly (+1 Random Attr to 1st Hero)', fx(run) { const h = run.team[0]; if (h) { const a = H[h.key].pair[1]; h.train = h.train || {}; h.train[a] = (h.train[a] || 0) + 1; } return 'Crossed in silence (+1 Key Attribute).'; } }
      ]
    },
    {
      id: 'blood_war', n: 'Blood War Battlefield',
      body: 'Devils and demons clash across a shattered obsidian ridge—weapons and gold litter the field.',
      choices: [
        { label: 'Scavenge the Ridge (+6g & +1 CON to All Heroes)', fx(run) {
          run.gold += 6; run.stats.gold += 6;
          run.team.forEach(h => { h.train = h.train || {}; h.train.con = (h.train.con || 0) + 1; });
          return 'Scavenged +6g and hardened every hero (+1 CON)!';
        } },
        { label: 'Raid the Supply Wagon (Combat + Guaranteed Very Rare)', fight: 'blood_war', bonusGold: 6, fx() { return 'Entering the Blood War fray!'; } }
      ]
    },
    {
      id: 'fallen_reliquary', n: 'Fallen Paladin’s Reliquary',
      body: 'A radiant banner still stands unbroken amid the ash of Avernus, guarding an oath-bound chest.',
      choices: [
        { label: 'Claim the Oath (Instantly Complete 1 Active Hero Quest!)', fx(run) {
          const h = run.team.find(x => x.questActive && !x.questDone) || run.team.find(x => !x.questDone);
          if (h) { h.questActive = true; h.questDone = true; h.questProg = H[h.key].quest.goal; return `${H[h.key].name} completed ${H[h.key].quest.rewardName}!`; }
          run.gold += 8; run.stats.gold += 8; return 'All quests complete — claimed +8g!';
        } },
        { label: 'Take the Sacred Relic (Free Very Rare Item)', fx(run, rand) { const k = rollItemFromPool(STANDARD_ITEM_KEYS, run, rand, 8, 3); if (k && run.stash.length < ECON.stash) run.stash.push(k); return k ? `Claimed ${ITEMS[k].n}!` : 'Stash full.'; } }
      ]
    },
    {
      id: 'mephisto_forge', n: 'Mephistopheles’s Forge',
      body: 'Blue hellfire roars inside an obsidian crucible. “Drop your trinkets in—I’ll temper them into legends.”',
      choices: [
        { label: 'Temper Stash (Upgrade up to 2 Stash Items +1 Rarity!)', fx(run, rand) {
          let up = 0;
          for (let i = 0; i < run.stash.length && up < 2; i++) {
            const it = ITEMS[run.stash[i]];
            if (it && it.r < 4) {
              const bucket = ITEM_BY_R[it.r + 1];
              if (bucket && bucket.length) { run.stash[i] = bucket[Math.floor(rand() * bucket.length)]; up++; }
            }
          }
          if (up > 0) return `Tempered ${up} stash item${up > 1 ? 's' : ''} up a rarity tier!`;
          run.gold += 6; run.stats.gold += 6; return 'No upgradeable stash items—claimed +6g instead.';
        } },
        { label: 'Steal Ember Ingots (+7g)', fx(run) { run.gold += 7; run.stats.gold += 7; return 'Claimed +7g of infernal ingots.'; } }
      ]
    }
  ]
};

/* ---------- Self-Contained Act Modules (Tagged by actTier for Future Act Branching!) ---------- */
const ACTS = {
  phandalin: {
    id: 'phandalin', actTier: 1, name: 'Phandalin & the Triboar Trail', sub: 'The Frontier Road',
    silhouette: [3, 3, 3, 2, 2, 3, 3, 2, 1],
    traversal: { pinchRows: [3, 4], miniboss: { key: 'klarg', name: 'Klarg’s Hideout', rows: [2, 5], wandering: false } },
    maps: ['triboar_road', 'cragmaw_cave', 'tresendar_cellar', 'thundertree_ruins'],
    pools: {
      earlyNormal: ['ambush', 'wolves', 'redbrands'],
      normal: ['blights', 'gate', 'reavers', 'skeleton_watch'],
      dangerous: ['owlwell', 'orcs', 'owlbear', 'forge'],
      miniboss: ['klarg'],
      boss: ['nezznar', 'venomfang', 'glasstaff']
    },
    events: ACT_EVENTS.phandalin
  },
  white_plume: {
    id: 'white_plume', actTier: 2, name: 'White Plume Mountain', sub: 'The Funhouse Dungeon',
    silhouette: [2, 3, 3, 2, 3, 3, 2, 2, 1],
    traversal: { hazards: 3 },
    maps: ['boiling_bubble', 'frictionless_hall', 'inverted_ziggurat', 'shadow_crypt'],
    pools: {
      earlyNormal: ['kelpie_mire', 'gargoyle_hall', 'wight_pack'],
      normal: ['flesh_lab', 'manticore_brood', 'shadow_ambush', 'kelpie_mire', 'gargoyle_hall', 'wight_pack'],
      dangerous: ['ctenmiir_crypt', 'efreeti_guard', 'chain_vault', 'oni_enforcers'],
      miniboss: [],
      boss: ['keraptis', 'blackrazor_boss', 'gynosphinx', 'giant_crab']
    },
    events: ACT_EVENTS.white_plume
  },
  hells: {
    id: 'hells', actTier: 3, name: 'The Hells', sub: 'The Infernal Descent',
    silhouette: [3, 3, 2, 3, 2, 2, 2, 2, 1],
    traversal: { miniboss: { key: 'pit_fiend', name: 'Pit Fiend Enforcer', rows: [2], wandering: true } },
    maps: ['avernus_wastes', 'iron_citadel', 'styx_crossing', 'throne_ninth'],
    pools: {
      earlyNormal: ['bearded_phalanx', 'hell_hounds', 'spined_volley'],
      normal: ['cambion_coven', 'bone_guard', 'narzugon_riders', 'bearded_phalanx', 'hell_hounds', 'spined_volley'],
      dangerous: ['erinyes_exec', 'horned_legion', 'ice_wardens', 'blood_war'],
      miniboss: ['pit_fiend'],
      boss: ['orcus', 'asmodeus', 'tiamat']
    },
    events: ACT_EVENTS.hells
  }
};

function nextActChoices(actTier) {
  return Object.values(ACTS).filter(a => a.actTier === actTier);
}
function currentActModule(run) {
  const id = run && run.adv && run.adv.actId;
  if (id && ACTS[id]) return ACTS[id];
  const list = nextActChoices(actOf(run));
  return list[0] || ACTS.phandalin;
}

/* ---------- Legacy THREATS helper map for metadata & stats ---------- */
const THREATS = Object.fromEntries(Object.entries(ENC).map(([k, e]) => [k, {
  enc: k, n: e.n, q: e.q || '', tag: e.theme || 'forest',
  boss: /Boss|Miniboss/i.test(e.q || ''), m: 1.0
}]));
const THREAT_ORDER = Object.keys(THREATS);

/* ---------- Run Creation ---------- */
let RUN_UID = 1;
function newRun() {
  return {
    v: '0.24', depth: 1, shopNo: 0, endless: false, victory: false,
    losses: 0, piggy: 0, piggyBroken: false, gold: 0,
    campRank: 1, campDiscount: 0, freeRerolls: 0,
    houseRules: [],
    hrState: { blitzStacks: 0, apprenticeWins: 0, apprenticeDone: false, bountyObjs: 0 },
    itemStacks: {},
    team: [], stash: [],
    shop: { heroes: [], slotKind: [], tiers: [], items: [], houseRules: [], fresh: [], sale: null, rr: 0, visitFreeUsed: false, frozen: false },
    next: null, hist: [], log: [],
    stats: { won: 0, lost: 0, gold: 0, spent: 0, rerolls: 0 },
    firstPick: null, over: false, started: Date.now()
  };
}

function newAdventure(rand = Math.random) {
  const run = newRun();
  run.adv = {
    act: 1, actId: 'phandalin', actBoss: null,
    map: null, pos: null, path: [], packs: [],
    pool: [], itemPool: [...STANDARD_ITEM_KEYS],
    done: [], bosses: [], seenMc: [], seenEvents: [], seenEnc: {},
    wanderer: null, bossBuff: 0,
    curio: null, mystery: null, hrDraft: null, retryPending: false,
    stage: 'packs', offer: null, node: null, loot: null, trained: 0
  };
  run.gold = ADV.startGold;
  run.adv.offer = packOffer(run, rand);
  return run;
}

const cfgOf = (h, run) => ({
  key: h.key, tier: h.tier, path: h.path, asi: h.asi, boon: h.boon || null, multiclass: h.multiclass || null,
  train: h.train, items: h.items, c: h.c, r: h.r,
  questActive: !!h.questActive, questDone: !!h.questDone,
  questStacks: h.questStacks || 0, questTrophies: h.questTrophies || [],
  act: actOf(run), goldHeld: run ? run.gold : 0,
  itemStacks: (run && run.itemStacks) || {},
  houseRules: (run && run.houseRules) || []
});
const battleOpts = run => ({
  houseRules: (run && run.houseRules) || [],
  hrState: (run && run.hrState) || {},
  runGold: (run && run.gold) || 0,
  act: actOf(run)
});
const boardHeroes = run => run.team.filter(h => h.onBoard);
const benchHeroes = run => run.team.filter(h => !h.onBoard);
const ownedHero = (run, k) => run.team.find(h => h.key === k);
const canAfford = (run, p) => p != null && run.gold >= p;
const onSale = (run, kind, i) => run.shop && run.shop.sale && run.shop.sale.kind === kind && run.shop.sale.i === i;
const itemPrice = (run, i) => { const k = run.shop.items[i]; return k ? Math.max(1, ECON.itemPrice[ITEMS[k].r] - (onSale(run, 'i', i) ? ECON.sale : 0)) : null; };
const houseRuleShopPrice = (run, i) => {
  const k = run.shop && run.shop.houseRules && run.shop.houseRules[i];
  if (!k || typeof HOUSE_RULES === 'undefined' || !HOUSE_RULES[k]) return null;
  const base = HOUSE_RULE_RARITY[HOUSE_RULES[k].r].cost;
  return Math.max(2, base - (onSale(run, 'hr', i) ? ECON.sale : 0));
};
function hasVisitFreeReroll(run) {
  if (!run || !run.shop) return false;
  if ((run.freeRerolls || 0) > 0) return true;
  const perk = (campRankDef(run).freeReroll > 0 || hasHouseRule(run, 'hr_quartermaster'));
  return perk && !run.shop.visitFreeUsed;
}
function rerollPrice(run) {
  if (hasVisitFreeReroll(run)) return 0;
  return ECON.reroll((run && run.shop && run.shop.rr) || 0);
}
const heroRefund = h => Math.max(2, Math.floor(heroValue(h.tier) * 0.7));
function itemRefund(run, k) {
  const f = (run.shop.fresh || []).find(x => x[0] === k);
  const base = f ? f[1] : Math.max(1, Math.floor(ECON.itemPrice[ITEMS[k].r] * .5));
  const hasBag = run && run.team && run.team.some(h => (h.items || []).some(ik => ITEMS[ik] && ITEMS[ik].s && ITEMS[ik].s.sellMult));
  return hasBag && !f ? Math.ceil(base * 1.25) : base;
}

function mkRosterHero(k, tier = 1, spent = 0) {
  return {
    uid: RUN_UID++, key: k, tier, path: null, asi: null, boon: null, multiclass: null,
    items: [], spent, onBoard: true,
    questActive: false, questProg: 0, questDone: false, questStacks: 0, questTrophies: []
  };
}

function freeHero(run, k) {
  const h = mkRosterHero(k, 1, 0);
  run.team.push(h);
  return h;
}

/* ---------- Pre-Run Pack Toggles ---------- */
function packOffer(run) {
  return PACK_ORDER.filter(k => !run.adv.packs.includes(k));
}
function openPack(run, k) {
  const P = PACKS[k];
  if (!P || run.adv.packs.includes(k)) return;
  run.adv.packs.push(k);
  P.heroes.forEach(h => { if (!run.adv.pool.includes(h)) run.adv.pool.push(h); });
  run.adv.offer = null;
}
function firstPickFromPacks(packKeys, rand = Math.random) {
  const valid = (packKeys || []).filter(k => PACKS[k]);
  if (!valid.length) return PACKS[PACK_ORDER[0]].heroes.slice();
  if (valid.length === 1) return PACKS[valid[0]].heroes.slice();
  const picks = [];
  const shuffledPacks = valid.slice().sort(() => rand() - .5);
  for (const pk of shuffledPacks) {
    if (picks.length >= 4) break;
    const hs = PACKS[pk].heroes.filter(h => !picks.includes(h));
    if (hs.length) picks.push(hs[Math.floor(rand() * hs.length)]);
  }
  const all = valid.flatMap(pk => PACKS[pk].heroes).filter(h => !picks.includes(h));
  while (picks.length < 4 && all.length) picks.push(all.splice(Math.floor(rand() * all.length), 1)[0]);
  return picks;
}
function startRunWithPacks(run, packKeys, rand = Math.random) {
  const valid = (packKeys || []).filter(k => PACKS[k]);
  const chosen = valid.length ? valid : [...PACK_ORDER];
  run.adv.packs = [];
  run.adv.pool = [];
  run.adv.itemPool = [...STANDARD_ITEM_KEYS];
  chosen.forEach(k => openPack(run, k));
  run.firstPick = firstPickFromPacks(chosen, rand);
  run.adv.stage = 'pick';
  return chosen;
}

/* ---------- Camp Rank Upgrades & House Rules Shop Helpers ---------- */
function upgradeCampRank(run) {
  const cost = campRankUpgradeCost(run);
  if (cost == null) return { ok: false, why: 'Already max Camp Rank IV' };
  if (!canAfford(run, cost)) return { ok: false, why: `Need ${cost}g to upgrade Camp` };
  run.gold -= cost;
  run.stats.spent += cost;
  run.campRank = campRankOf(run) + 1;
  run.campDiscount = 0;
  return { ok: true, rank: run.campRank, cost };
}

function rollHouseRulesForShop(run, rand = Math.random) {
  if (typeof HOUSE_RULE_KEYS === 'undefined') return [];
  const def = campRankDef(run);
  const owned = new Set(run.houseRules || []);
  const maxR = Math.min(3, Math.max(def.hrMaxR, actOf(run) >= 3 ? 3 : actOf(run) >= 2 ? 2 : 1));
  const slots = def.hrSlots || 2;
  const avail = HOUSE_RULE_KEYS.filter(k => !owned.has(k) && HOUSE_RULES[k].r <= maxR);
  const picked = [];

  // Rarity weights based on Camp Rank + Act
  const rWeights = [
    [55, 45, 0, 0],
    [28, 38, 34, 0],
    [14, 28, 38, 20],
    [ 6, 20, 42, 32]
  ][campRankOf(run) - 1] || [55, 45, 0, 0];

  const pickOne = (pool, minR = 0, preferFit = false) => {
    const cands = pool.filter(k => !picked.includes(k) && HOUSE_RULES[k].r >= minR);
    if (!cands.length) return null;
    if (preferFit) {
      const fits = cands.filter(k => houseRuleFit(k, run).match);
      if (fits.length && rand() < 0.72) {
        return fits[Math.floor(rand() * fits.length)];
      }
    }
    let rollX = rand() * 100, targetR = minR;
    for (let r = 0; r <= maxR; r++) {
      rollX -= rWeights[r];
      if (rollX <= 0) { targetR = Math.max(minR, r); break; }
    }
    let bucket = cands.filter(k => HOUSE_RULES[k].r === targetR);
    if (!bucket.length) bucket = cands;
    return bucket[Math.floor(rand() * bucket.length)];
  };

  for (let i = 0; i < slots; i++) {
    const minR = (i === 0 && campRankOf(run) >= 4) ? 2 : 0;
    const k = pickOne(avail, minR, i === 0);
    if (k) picked.push(k);
  }
  return picked;
}

function rollHouseRuleDraft(run, rand = Math.random, minR = 1) {
  if (typeof HOUSE_RULE_KEYS === 'undefined') return [];
  const owned = new Set(run.houseRules || []);
  const maxR = actOf(run) >= 2 ? 3 : 2;
  const pool = HOUSE_RULE_KEYS.filter(k => !owned.has(k) && HOUSE_RULES[k].r >= minR && HOUSE_RULES[k].r <= maxR);
  const out = [];
  const fits = pool.filter(k => houseRuleFit(k, run).match).sort(() => rand() - .5);
  if (fits[0]) out.push(fits[0]);
  const rest = pool.filter(k => !out.includes(k)).sort(() => rand() - .5);
  while (out.length < 3 && rest.length) out.push(rest.shift());
  return out;
}

function buyHouseRule(run, slot, replaceIdx) {
  const k = run.shop && run.shop.houseRules && run.shop.houseRules[slot];
  if (!k || !HOUSE_RULES[k]) return { ok: false, why: 'Sold out' };
  run.houseRules = run.houseRules || [];
  if (run.houseRules.includes(k)) return { ok: false, why: 'Already active' };
  const p = houseRuleShopPrice(run, slot);
  if (run.houseRules.length >= HOUSE_RULE_MAX) {
    if (replaceIdx == null) return { ok: false, why: `House Rules full (${HOUSE_RULE_MAX}/${HOUSE_RULE_MAX})`, needSwap: true };
    const oldKey = run.houseRules[replaceIdx];
    const refund = oldKey ? houseRuleRefund(oldKey) : 0;
    if (run.gold + refund < p) return { ok: false, why: 'Not enough gold' };
    sellHouseRule(run, replaceIdx);
  }
  if (!canAfford(run, p)) return { ok: false, why: 'Not enough gold' };
  run.gold -= p; run.stats.spent += p;
  run.shop.houseRules[slot] = null;
  run.houseRules.push(k);
  return { ok: true, rule: k, price: p };
}

function addFreeHouseRule(run, ruleKey, replaceIdx) {
  if (!ruleKey || !HOUSE_RULES[ruleKey]) return { ok: false, why: 'Invalid House Rule' };
  run.houseRules = run.houseRules || [];
  if (run.houseRules.includes(ruleKey)) return { ok: false, why: 'Already active' };
  if (run.houseRules.length >= HOUSE_RULE_MAX) {
    if (replaceIdx == null) return { ok: false, needSwap: true, why: `House Rules full (${HOUSE_RULE_MAX}/${HOUSE_RULE_MAX})` };
    sellHouseRule(run, replaceIdx);
  }
  run.houseRules.push(ruleKey);
  return { ok: true, rule: ruleKey };
}

function sellHouseRule(run, idx) {
  if (!run.houseRules || !run.houseRules[idx]) return 0;
  const k = run.houseRules.splice(idx, 1)[0];
  const back = houseRuleRefund(k);
  run.gold += back;
  return back;
}

/* ---------- Camp Shop (Whole-Shop Freeze Only, Exact-Tier Upgrades, 5-Tier Items + House Rules) ---------- */
function heroOffer(run, k, slot) {
  const o = ownedHero(run, k);
  const off = slot != null && onSale(run, 'h', slot) ? ECON.sale : 0;
  if (!o) {
    const ot = (run.shop && run.shop.tiers && slot != null && run.shop.tiers[slot]) || 1;
    return { tier: ot, price: Math.max(1, heroValue(ot) - off), isNew: true, sale: off, offerTier: ot, slotKind: 'recruit' };
  }
  if (o.tier >= 4) return { tier: 4, price: null, maxed: true, offerTier: 4, slotKind: 'upgrade' };
  const copyTier = (run.shop && run.shop.tiers && slot != null && run.shop.tiers[slot]) || o.tier;
  if (copyTier < o.tier) return { tier: o.tier, price: null, maxed: true, offerTier: copyTier, slotKind: 'upgrade' };
  const nt = o.tier + 1;
  return { tier: nt, price: Math.max(1, ECON.heroPrice(nt) - off), upgrade: o, sale: off, offerTier: o.tier, slotKind: 'upgrade' };
}

function toggleFreeze(run) { run.shop.frozen = !run.shop.frozen; return run.shop.frozen; }
function toggleLock(run) { return toggleFreeze(run); }

function rollShop(run, rand = Math.random, keepCount) {
  const old = run.shop || {};
  const fullPool = (run.adv && run.adv.pool.length) ? run.adv.pool : HERO_ORDER;
  const unownedPool = fullPool.filter(k => !ownedHero(run, k));
  const allowUpgrades = (run.shopNo || 0) > 1 || encounterCount(run) > 0;

  const heroes = [], slotKind = [], tiers = [];
  const recBag = [...unownedPool];

  for (let i = 0; i < ECON.shopHeroes; i++) {
    const ot = rollOfferTier(run, rand);
    const upgAtTier = allowUpgrades
      ? run.team.filter(h => h.tier === ot && h.tier < 4 && !heroes.includes(h.key)).map(h => h.key)
      : [];
    const wantUpgrade = (i === 2 && upgAtTier.length > 0);
    if (wantUpgrade) {
      heroes.push(upgAtTier[Math.floor(rand() * upgAtTier.length)]);
      slotKind.push('upgrade'); tiers.push(ot);
    } else if (recBag.length > 0) {
      heroes.push(recBag.splice(Math.floor(rand() * recBag.length), 1)[0]);
      slotKind.push('recruit'); tiers.push(ot);
    } else if (upgAtTier.length > 0) {
      heroes.push(upgAtTier[Math.floor(rand() * upgAtTier.length)]);
      slotKind.push('upgrade'); tiers.push(ot);
    } else {
      heroes.push(null); slotKind.push('recruit'); tiers.push(ot);
    }
  }

  const availItems = (run.adv && run.adv.itemPool && run.adv.itemPool.length) ? run.adv.itemPool : STANDARD_ITEM_KEYS;
  const items = [];
  for (let i = 0; i < ECON.shopItems; i++) {
    const c = availItems.filter(k => ITEMS[k] && ITEMS[k].r <= 4 && !items.includes(k));
    const minR = (i === 0 && campRankOf(run) >= 4) ? 2 : 0;
    items.push(rollItemFromPool(c, run, rand, 0, minR));
  }

  const houseRules = rollHouseRulesForShop(run, rand);

  const free = [
    ...heroes.map((k, i) => k ? ['h', i] : null),
    ...items.map((k, i) => k ? ['i', i] : null),
    ...houseRules.map((k, i) => k ? ['hr', i] : null)
  ].filter(Boolean);
  const sl = free.length ? free[Math.floor(rand() * free.length)] : null;

  run.shop = {
    heroes, slotKind, tiers, items, houseRules,
    rr: keepCount ? (old.rr || 0) : 0,
    visitFreeUsed: keepCount ? !!old.visitFreeUsed : false,
    frozen: false,
    fresh: keepCount ? (old.fresh || []) : [],
    sale: sl ? { kind: sl[0], i: sl[1] } : (keepCount ? old.sale : null)
  };
}

function openShop(run, rand = Math.random) {
  run.shopNo = (run.shopNo || 0) + 1;
  if (run.shop && run.shop.frozen && (run.shop.heroes.some(Boolean) || run.shop.items.some(Boolean) || (run.shop.houseRules || []).some(Boolean))) {
    run.shop.frozen = false; run.shop.rr = 0; run.shop.visitFreeUsed = false; run.shop.fresh = [];
    return false;
  }
  rollShop(run, rand);
  return true;
}

function rollEpicBoonOffer(rand = Math.random) {
  const bag = EPIC_BOON_KEYS.slice();
  const out = [];
  while (out.length < 3 && bag.length) out.push(bag.splice(Math.floor(rand() * bag.length), 1)[0]);
  return out;
}
function chooseHeroBoon(run, uid, boonKey) {
  const h = run.team.find(x => x.uid === uid);
  if (!h || !EPIC_BOONS[boonKey]) return false;
  h.boon = boonKey;
  return true;
}

function buyHero(run, slot, swapUid) {
  const k = run.shop.heroes[slot];
  if (!k) return { ok: false, why: 'Sold out' };
  const o = heroOffer(run, k, slot);
  if (o.maxed) return { ok: false, why: 'Already Tier IV' };
  if (o.isNew && run.team.length >= ECON.board) {
    if (swapUid == null) return { ok: false, why: 'Party is full (4/4)', needSwap: true };
    const out = run.team.find(h => h.uid === swapUid);
    if (!out) return { ok: false, why: 'No such hero' };
    if (run.gold + heroValue(out.tier) < o.price) return { ok: false, why: 'Not enough gold' };
    sellHero(run, swapUid, true);
  }
  if (!canAfford(run, o.price)) return { ok: false, why: 'Not enough gold' };
  run.gold -= o.price; run.stats.spent += o.price;
  run.shop.heroes[slot] = null;
  if (o.isNew) {
    const h = mkRosterHero(k, o.tier, o.price);
    run.team.push(h);
    return { ok: true, hero: h, isNew: true, needsPath: h.tier >= 2, needsAsi: h.tier >= 3, needsBoon: h.tier >= 4 };
  }
  const h = o.upgrade;
  const was = h.tier;
  h.tier = o.tier;
  h.spent += o.price;
  return {
    ok: true, hero: h, tierUp: true,
    needsPath: was < 2 && h.tier >= 2 && !h.path,
    needsAsi: was < 3 && h.tier >= 3 && !h.asi,
    needsBoon: was < 4 && h.tier >= 4 && !h.boon
  };
}

function sellHero(run, uid, swap) {
  const i = run.team.findIndex(x => x.uid === uid);
  if (i < 0) return 0;
  const h = run.team[i];
  if (run.team.length === 1 && !swap) return 0;
  const back = heroRefund(h);
  run.gold += back;
  h.items.forEach(k => {
    if (run.stash.length < ECON.stash) run.stash.push(k);
    else run.gold += itemRefund(run, k);
  });
  run.team.splice(i, 1);
  return back;
}

function buyItem(run, slot) {
  const k = run.shop.items[slot];
  if (!k) return { ok: false, why: 'Sold out' };
  const p = itemPrice(run, slot);
  if (!canAfford(run, p)) return { ok: false, why: 'Not enough gold' };
  if (run.stash.length >= ECON.stash) return { ok: false, why: 'Your stash is full' };
  run.gold -= p; run.stats.spent += p;
  run.shop.items[slot] = null;
  run.stash.push(k);
  run.shop.fresh.push([k, p]);
  return { ok: true, item: k };
}

function reroll(run, rand = Math.random) {
  const p = rerollPrice(run);
  if (run.gold < p) return false;
  if (p === 0) {
    if ((run.freeRerolls || 0) > 0) run.freeRerolls--;
    else run.shop.visitFreeUsed = true;
    run.stats.rerolls++;
    rollShop(run, rand, true);
    return true;
  }
  run.gold -= p; run.stats.spent += p; run.stats.rerolls++;
  const n = (run.shop.rr || 0) + 1;
  rollShop(run, rand, true);
  run.shop.rr = n;
  return true;
}

function equip(run, uid, stashIdx) {
  const h = run.team.find(x => x.uid === uid);
  const k = run.stash[stashIdx];
  if (!h || !k) return false;
  if (h.items.length >= slotsOf(h)) return false;
  if (!canCarry(h, k)) return false;
  run.stash.splice(stashIdx, 1);
  h.items.push(k);
  return true;
}

function unequip(run, uid, i) {
  const h = run.team.find(x => x.uid === uid);
  if (!h || run.stash.length >= ECON.stash) return false;
  run.stash.push(h.items.splice(i, 1)[0]);
  return true;
}

function sellItem(run, stashIdx) {
  const k = run.stash[stashIdx];
  if (!k) return 0;
  const back = itemRefund(run, k);
  const fi = (run.shop.fresh || []).findIndex(x => x[0] === k);
  if (fi >= 0) run.shop.fresh.splice(fi, 1);
  run.gold += back;
  run.stash.splice(stashIdx, 1);
  return back;
}

function toggleBoard() { return false; }

/* ==========================================================================
   CONSTRICTING NON-CROSSING 9-ROW DAG GENERATOR
   ========================================================================== */
function pickFromBag(run, poolKey, list, rand) {
  run.adv.seenEnc = run.adv.seenEnc || {};
  const seen = run.adv.seenEnc[poolKey] || [];
  let fresh = list.filter(k => !seen.includes(k));
  if (!fresh.length) { run.adv.seenEnc[poolKey] = []; fresh = list.slice(); }
  const pick = fresh[Math.floor(rand() * fresh.length)];
  run.adv.seenEnc[poolKey] = [...(run.adv.seenEnc[poolKey] || []), pick];
  return pick;
}

function buildNonCrossingEdges(w0, w1, rand) {
  // Guarantees: every node in w0 has 1-2 outgoing edges, every node in w1 has >=1 incoming edge, ZERO edge crossings!
  const edges = Array.from({ length: w0 }, () => new Set());
  if (w1 === 1) {
    for (let i = 0; i < w0; i++) edges[i].add(0);
    return edges.map(s => [...s]);
  }
  // 1. Primary monotone mapping from each source to nearest proportional target
  let lastT = 0;
  for (let i = 0; i < w0; i++) {
    const ideal = w0 === 1 ? 0 : Math.round(i * (w1 - 1) / (w0 - 1));
    const t = Math.max(lastT, Math.min(w1 - 1, ideal));
    edges[i].add(t);
    lastT = t;
  }
  // 2. Ensure every target in w1 has >= 1 incoming edge without crossing
  for (let j = 0; j < w1; j++) {
    if (edges.some(s => s.has(j))) continue;
    const idealSrc = w1 === 1 ? 0 : Math.round(j * (w0 - 1) / (w1 - 1));
    let src = idealSrc;
    // Find a valid non-crossing source
    for (let d = 0; d < w0; d++) {
      for (const cand of [idealSrc - d, idealSrc + d]) {
        if (cand < 0 || cand >= w0) continue;
        const leftMax = cand > 0 ? Math.max(...edges[cand - 1]) : -1;
        const rightMin = cand < w0 - 1 ? Math.min(...edges[cand + 1]) : w1;
        if (j >= leftMax && j <= rightMin) { src = cand; d = w0; break; }
      }
    }
    edges[src].add(j);
  }
  // 3. Optionally add 1 non-crossing branch edge for variety (max 2 outgoing per node)
  for (let i = 0; i < w0; i++) {
    if (edges[i].size >= 2 || rand() > .55) continue;
    const cur = [...edges[i]][0];
    const leftMax = i > 0 ? Math.max(...edges[i - 1]) : 0;
    const rightMin = i < w0 - 1 ? Math.min(...edges[i + 1]) : w1 - 1;
    const opts = [cur - 1, cur + 1].filter(t => t >= 0 && t < w1 && t >= leftMax && t <= rightMin && !edges[i].has(t));
    if (opts.length) edges[i].add(opts[Math.floor(rand() * opts.length)]);
  }
  return edges.map(s => [...s].sort((a, b) => a - b));
}

function genMap(run, act, rand = Math.random) {
  const actMod = currentActModule(run);
  const sil = actMod.silhouette || [3, 3, 2, 3, 2, 3, 3, 2, 1];
  const rows = sil.map((w, r) =>
    Array.from({ length: w }, (_, i) => ({
      kind: 'fight', r, i, x: (i + .5) / w, next: [],
      d: ADV.depth(act, r)
    }))
  );

  // Build non-crossing DAG edges for rows 0..7
  for (let r = 0; r < rows.length - 1; r++) {
    const ed = buildNonCrossingEdges(rows[r].length, rows[r + 1].length, rand);
    ed.forEach((nx, i) => { rows[r][i].next = nx; });
  }

  // Row 0: Always earlyNormal fights
  rows[0].forEach(n => { n.kind = 'fight'; n.early = true; });

  // Row 8: Single Rotating Act Boss
  const bossPool = actMod.pools.boss.filter(k => !(run.adv.bosses || []).includes(k));
  const useBossPool = bossPool.length ? bossPool : actMod.pools.boss;
  const bossKey = useBossPool[Math.floor(rand() * useBossPool.length)];
  run.adv.actBoss = bossKey;
  rows[8][0].kind = 'boss';
  rows[8][0].threat = bossKey;
  rows[8][0].d = ADV.bossDepth(act);

  // Row 7: Pre-Boss Staging Row (2 nodes: guaranteed Campfire + Training/Curio)
  rows[7][0].kind = 'rest';
  if (rows[7][1]) rows[7][1].kind = rand() < .5 ? 'train' : 'curio';

  // Middle Rows (r = 1..6): place guaranteed special nodes + Mystery + Combat + Elites
  const midSlots = [];
  for (let r = 1; r <= 6; r++) rows[r].forEach(n => midSlots.push(n));
  const freeMid = () => midSlots.filter(n => !n._locked);
  const claim = (list, kind, extra = {}) => {
    if (!list.length) return null;
    const n = list[Math.floor(rand() * list.length)];
    n.kind = kind; n._locked = 1;
    Object.assign(n, extra);
    return n;
  };

  // 1. Act 1 Stationary Optional Miniboss (Klarg on row 2 or row 5)
  if (actMod.traversal && actMod.traversal.miniboss && !actMod.traversal.miniboss.wandering) {
    const mb = actMod.traversal.miniboss;
    const rPick = mb.rows[Math.floor(rand() * mb.rows.length)];
    const cand = rows[rPick].filter(n => !n._locked);
    claim(cand, 'miniboss', { threat: mb.key, label: mb.name, d: ADV.depth(act, rPick) + ADV.minibossDepth });
  }

  // 2. Guaranteed 1-2 Single-Class Uniquely Named Multiclass nodes (no repeat class in run!)
  run.adv.seenMc = run.adv.seenMc || [];
  const mcCount = rand() < .55 ? 2 : 1;
  for (let m = 0; m < mcCount; m++) {
    const availMc = MULTICLASS_KEYS.filter(c => !run.adv.seenMc.includes(c));
    if (!availMc.length) break;
    const cls = availMc[Math.floor(rand() * availMc.length)];
    run.adv.seenMc.push(cls);
    const cand = freeMid().filter(n => n.r >= 2 && n.r <= 6 && !rows[n.r].some(x => x.kind === 'multiclass'));
    claim(cand.length ? cand : freeMid(), 'multiclass', { mcClass: cls, label: MULTICLASS[cls].node });
  }

  // 3. Guaranteed Curio Merchant, Training, Quest Board, Treasure, and Campfire
  if (!rows[7].some(n => n.kind === 'curio')) claim(freeMid().filter(n => n.r >= 2 && n.r <= 6), 'curio');
  if (!rows[7].some(n => n.kind === 'train')) claim(freeMid().filter(n => n.r >= 2 && n.r <= 5), 'train');
  claim(freeMid().filter(n => n.r >= 1 && n.r <= 4), 'quest');
  claim(freeMid().filter(n => n.r >= 2 && n.r <= 6), 'treasure');
  claim(freeMid().filter(n => n.r >= 3 && n.r <= 5), 'rest');

  // 4. Fill remaining middle slots (~25% Mystery, ~25% Dangerous Elite, ~40% Fight, ~10% extra utility)
  const rem = freeMid();
  const targetMystery = Math.max(3, Math.round(midSlots.length * 0.25));
  let curMystery = 0;
  rem.sort(() => rand() - .5).forEach(n => {
    const rowHasElite = rows[n.r].some(x => x.kind === 'elite');
    const prevRowRest = rows[n.r - 1].some(p => p.kind === 'rest' && p.next.includes(n.i));
    const nextRowRest = rows[n.r + 1].some(c => c.kind === 'rest' && n.next.includes(c.i));
    const allowRest = !prevRowRest && !nextRowRest;

    if (curMystery < targetMystery && rand() < .5) {
      n.kind = 'mystery'; curMystery++;
    } else if (n.r >= 2 && (!rowHasElite || act >= 2) && rand() < (act === 3 ? .38 : .26)) {
      n.kind = 'elite'; n.d = ADV.depth(act, n.r) + ADV.eliteDepth;
    } else if (rand() < .18) {
      const util = ['treasure', 'curio', 'train', ...(allowRest ? ['rest'] : [])];
      n.kind = util[Math.floor(rand() * util.length)];
    } else {
      n.kind = 'fight';
    }
    n._locked = 1;
  });

  // Ensure no back-to-back Campfire along any edge
  for (let r = 1; r <= 6; r++) {
    rows[r].forEach(n => {
      if (n.kind === 'rest') {
        const bad = rows[r + 1].some(c => c.kind === 'rest' && n.next.includes(c.i));
        if (bad) n.kind = 'mystery';
      }
      delete n._locked;
    });
  }

  // 5. Act 2 Traversal Identity: Stamp Dungeon Hazards on 2-3 high-reward combat nodes!
  if (actMod.traversal && actMod.traversal.hazards) {
    const combatMid = midSlots.filter(n => n.kind === 'fight' || n.kind === 'elite').sort(() => rand() - .5);
    const hCount = Math.min(actMod.traversal.hazards, combatMid.length);
    for (let i = 0; i < hCount; i++) {
      combatMid[i].hazard = HAZARD_KEYS[i % HAZARD_KEYS.length];
    }
  }

  // 6. Act 3 Traversal Identity: Spawn Wandering Pit Fiend on Row 2!
  run.adv.wanderer = null;
  if (actMod.traversal && actMod.traversal.miniboss && actMod.traversal.miniboss.wandering) {
    const wRow = 2;
    const wIdx = Math.floor(rand() * rows[wRow].length);
    run.adv.wanderer = { r: wRow, i: wIdx, key: actMod.traversal.miniboss.key, name: actMod.traversal.miniboss.name, alive: true };
  }

  // 7. v0.24 Pre-Scout Combat Nodes: assign threat, Encounter CR, lane count, and threat tag on Map!
  rows.forEach(row => row.forEach(n => {
    if (!['fight', 'elite', 'miniboss', 'boss'].includes(n.kind)) return;
    if (!n.threat) {
      if (n.kind === 'boss') n.threat = run.adv.actBoss || actMod.pools.boss[0];
      else if (n.kind === 'miniboss') n.threat = actMod.pools.miniboss[0] || actMod.pools.dangerous[0];
      else if (n.kind === 'elite') n.threat = pickFromBag(run, `${actMod.id}_dang`, actMod.pools.dangerous, rand);
      else if (n.early || n.r === 0) n.threat = pickFromBag(run, `${actMod.id}_early`, actMod.pools.earlyNormal, rand);
      else n.threat = pickFromBag(run, `${actMod.id}_norm`, actMod.pools.normal, rand);
    }
    const base = ENC[n.threat] || ENC.ambush;
    const bm = base.mapKey && BATTLE_MAPS[base.mapKey];
    n.laneCount = (base.lanes && base.lanes.length) || (bm && bm.laneCount) || 2;
    n.threatTag = (base.q || '').split('·')[0].trim();
    n.cr = estimateNodeCR(n, act);
  }));

  return rows;
}

/* ---------- v0.24 Honest Challenge Rating (CR) & Per-Lane Matchup Engine ---------- */
function ehpFactor(ac, sr) {
  const k3 = MITIGATE_K * MITIGATE_K * MITIGATE_K;
  const ehpA = 1 + (Math.pow(Math.max(5, ac || 10), 3) / k3);
  const ehpS = 1 + (Math.pow(Math.max(5, sr || 10), 3) / k3);
  return 0.55 * ehpA + 0.45 * ehpS;
}

function unitPowerEnemy(ek, hpSc, dmgSc) {
  const d = E[ek];
  if (!d) return 10;
  const hp = d.hp * ESC.hp * (hpSc || 1) * (d.large ? LARGE_HP : 1);
  const ehp = hp * ehpFactor(d.ac, d.sr);
  const a = d.atk || { d: [1, 6], flat: 2, iv: 1.3, hits: 1 };
  const avgHit = (a.d[0] * (a.d[1] + 1) / 2 + (a.flat || 0)) * (a.hits || 1);
  const dps = (avgHit * ESC.dmg * (dmgSc || 1) / Math.max(0.4, a.iv * ENEMY_TEMPO)) * (d.abil ? 1.32 : 1.0) * (d.boss ? 1.25 : d.elite ? 1.12 : 1.0);
  return Math.sqrt(Math.max(1, ehp * Math.max(2, dps)));
}

function unitPowerHero(cfg) {
  const d = H[cfg.key];
  if (!d) return 10;
  const st = heroStats(cfg);
  const evMult = 1 / Math.max(0.35, 1 - (st.evasion || 0) * 0.65);
  const ehp = (st.maxHp + st.regen * 12) * ehpFactor(st.ac, st.sr) * evMult;
  const a = st.atk || d.atk;
  const avgDice = a.noDmg ? 4 : (a.d[0] * (st.tier || 1) * (a.d[1] + 1) / 2 + (a.flat || 0) + Math.max(0, st.mw) + (st.dmgBonus || 0));
  const atkDps = (avgDice * (st.hits || 1) / Math.max(0.3, st.iv)) * (st.atM || 1);
  const abilRate = st.cr / 100;
  const odds = bandOdds(d, st);
  const d20Quality = 0.65 * odds[1] + 1.0 * odds[2] + 1.45 * odds[3] + 2.0 * odds[4];
  const abilDps = (14 * (st.tier || 1) + Math.max(0, st.mk) * 3) * abilRate * d20Quality * (st.abM || 1);
  const roleBonus = st.role === 'Support' ? 1.24 : st.role === 'Tank' ? 1.12 : 1.06;
  const metaBonus = (st.path ? 1.12 : 1) * (st.boon ? 1.24 : 1) * (st.mc ? 1.12 : 1) * (st.questDone ? 1.16 : 1);
  return Math.sqrt(Math.max(1, ehp * Math.max(4, atkDps + abilDps))) * roleBonus * metaBonus;
}

const RAW_TO_CR = raw => Math.max(0.5, +(raw / 26).toFixed(1));

function calcEncounterCR(enc) {
  if (!enc || !enc.u || !enc.u.length) return 1;
  const hpSc = (enc.sc && enc.sc.hp) || 1;
  const dmgSc = (enc.sc && enc.sc.dmg) || 1;
  let tot = 0;
  enc.u.forEach(([ek]) => { tot += unitPowerEnemy(ek, hpSc, dmgSc); });
  if (enc.waves && enc.waves.length) tot *= 1.14;
  if (enc.hazard) tot *= 1.08;
  return Math.max(1, +(RAW_TO_CR(tot)).toFixed(1));
}

function estimateNodeCR(node, act) {
  const tk = node.threat || 'ambush';
  const base = ENC[tk] || ENC.ambush;
  const d = node.d || ADV.depth(act || 1, node.r || 0);
  const cv = curveAt(d);
  const isBoss = node.kind === 'boss';
  const isMb = node.kind === 'miniboss';
  const sc = base.sc || {};
  const ek = node.kind === 'elite' ? ADV.eliteK : isMb ? ADV.minibossK : 1;
  const hpSc = (sc.hp || 1) * cv.hp * ek * (d <= 1.2 ? .92 : 1);
  const dmgSc = (sc.dmg || 1) * cv.dmg * ek * (d <= 1.2 ? .92 : 1);
  const n = (isBoss || isMb) ? base.u.length : Math.max(d <= 1.2 ? 3 : 2, Math.round(base.u.length * cv.share));
  let tot = 0;
  base.u.slice(0, n).forEach(([k]) => { tot += unitPowerEnemy(k, hpSc, dmgSc); });
  if (d >= 4 && base.waves && base.waves.length) tot *= 1.14;
  if (node.hazard) tot *= 1.08;
  return Math.max(1, +(RAW_TO_CR(tot)).toFixed(1));
}

function calcPartyCR(run) {
  const team = boardHeroes(run);
  if (!team.length) return { cr: 0, offense: 0, durability: 0, engine: 1 };
  let sumP = 0, off = 0, dur = 0;
  team.forEach(h => {
    const cfg = cfgOf(h, run);
    const st = heroStats(cfg);
    sumP += unitPowerHero(cfg);
    dur += st.maxHp * ehpFactor(st.ac, st.sr);
    off += (st.tier * 12 + Math.max(0, st.mw) * 2 + (st.dmgBonus || 0)) / Math.max(0.35, st.iv) + st.cr * 0.45 * st.tier;
  });
  const hrMult = typeof houseRuleEngineMult === 'function' ? houseRuleEngineMult(run) : 1.0;
  // Shared-role / balanced comp stability bonus
  const hasTank = team.some(h => H[h.key].role === 'Tank');
  const hasSup = team.some(h => H[h.key].role === 'Support');
  const compBonus = 1 + (hasTank ? 0.06 : 0) + (hasSup ? 0.06 : 0);
  const engine = +(hrMult * compBonus).toFixed(2);
  const cr = +(RAW_TO_CR(sumP * Math.pow(engine, 0.78))).toFixed(1);
  return { cr, offense: Math.round(off), durability: Math.round(dur), engine };
}

function crVerdict(partyCR, encCR) {
  const ratio = partyCR / Math.max(0.5, encCR || 1);
  if (ratio >= 1.18) return { label: 'Favoured', cls: 'favoured', ratio };
  if (ratio >= 0.88) return { label: 'Even',     cls: 'even',     ratio };
  if (ratio >= 0.68) return { label: 'Dangerous',cls: 'dangerous',ratio };
  return { label: 'Deadly', cls: 'deadly', ratio };
}

/* Per-Lane Matchup Evaluator used live during Tactical Deployment */
function evalLanes(run, enc) {
  if (!enc || !run) return [];
  const lanes = (enc.lanes && enc.lanes.length) ? enc.lanes : [{ id: 'center', n: 'Battlefield', c0: 0, c1: COLS - 1, obj: 'breach' }];
  const hrMult = typeof houseRuleEngineMult === 'function' ? Math.pow(houseRuleEngineMult(run), 0.78) : 1.0;
  const hs = boardHeroes(run);
  const hpSc = (enc.sc && enc.sc.hp) || 1;
  const dmgSc = (enc.sc && enc.sc.dmg) || 1;

  return lanes.map((L, idx) => {
    const def = (typeof LANE_OBJ !== 'undefined' && LANE_OBJ[L.obj]) || LANE_OBJ.breach;
    const laneHeroes = hs.filter(h => h.c != null && laneOfCol(h.c, lanes) === idx);
    const laneFoes = (enc.u || []).filter(([ek, c]) => laneOfCol(c, lanes) === idx);

    let hPow = 0, ePow = 0;
    let physHeroes = 0, magHeroes = 0, hasIntercept = false, hasBuddy = false;
    laneHeroes.forEach(h => {
      const cfg = cfgOf(h, run);
      const st = heroStats(cfg);
      hPow += unitPowerHero(cfg) * hrMult;
      if (st.atk && st.atk.kind === 'phys') physHeroes++;
      else magHeroes++;
      if (st.rng <= 2 && st.m.str >= 3) hasIntercept = true;
      if (H[h.key].targetMode === 'closest_ally' && laneHeroes.length >= 2) hasBuddy = true;
    });

    let maxAC = 0, maxSR = 0, hasCharger = false;
    laneFoes.forEach(([ek]) => {
      const ed = E[ek];
      ePow += unitPowerEnemy(ek, hpSc, dmgSc);
      if (ed) {
        maxAC = Math.max(maxAC, ed.ac || 10);
        maxSR = Math.max(maxSR, ed.sr || 10);
        if (archOf(ek).includes('charger')) hasCharger = true;
      }
    });

    const heroCR = +(RAW_TO_CR(hPow)).toFixed(1);
    const enemyCR = +(RAW_TO_CR(ePow)).toFixed(1);
    const verdict = laneFoes.length === 0
      ? { label: 'Clear', cls: 'favoured' }
      : laneHeroes.length === 0
        ? { label: 'Empty!', cls: 'deadly' }
        : crVerdict(heroCR, enemyCR);

    const flags = [];
    if (laneFoes.length > 0 && laneHeroes.length === 0) {
      flags.push({ kind: 'warn', txt: L.obj === 'choke' ? '⚠ Uncontested: Enemy Ambush!' : L.obj === 'ritual' ? '⚠ Uncontested Ritual!' : '⚠ Uncontested Lane' });
    }
    if (maxAC >= 17 && physHeroes > 0 && magHeroes === 0) {
      flags.push({ kind: 'warn', txt: `⚠ High AC ${maxAC} (use Pen/Magic/Radiant)` });
    }
    if (maxSR >= 16 && magHeroes > 0 && physHeroes === 0) {
      flags.push({ kind: 'warn', txt: `⚠ High SR ${maxSR} (use Physical/Radiant)` });
    }
    if (hasCharger && hasIntercept) flags.push({ kind: 'good', txt: '✓ STR +3 Intercepts Charger' });
    else if (hasCharger && laneHeroes.length > 0 && !hasIntercept) flags.push({ kind: 'warn', txt: '⚠ Charger dives backline' });
    if (hasBuddy) flags.push({ kind: 'good', txt: '★ Ally Link active' });
    if (hasHouseRule(run, 'hr_solo_vanguard') && laneHeroes.length === 1) flags.push({ kind: 'good', txt: '🛡 Hold the Line (+45% Ward)' });
    if (hasHouseRule(run, 'hr_buddy_system') && laneHeroes.length >= 2) flags.push({ kind: 'good', txt: '🤝 Buddy System (+1 d20)' });

    return {
      idx, id: L.id, n: L.n, c0: L.c0, c1: L.c1, obj: L.obj, def,
      heroCount: laneHeroes.length, enemyCount: laneFoes.length, maxHeroes: def.maxHeroes || 4,
      heroCR, enemyCR, verdict, flags
    };
  });
}

function advanceWanderer(run, rand = Math.random) {
  const W = run.adv && run.adv.wanderer;
  const M = run.adv && run.adv.map;
  if (!W || !W.alive || !M) return;
  const curRow = M[W.r];
  if (!curRow || !curRow[W.i]) return;
  const curNode = curRow[W.i];
  const playerRow = run.adv.pos ? run.adv.pos.r : -1;
  if (W.r < 6 && (W.r <= playerRow + 1 || rand() < .6)) {
    const nx = curNode.next || [];
    if (nx.length) {
      W.r += 1;
      W.i = nx[Math.floor(rand() * nx.length)];
      return;
    }
  }
  const sib = curRow.map((_, idx) => idx).filter(idx => idx !== W.i);
  if (sib.length) W.i = sib[Math.floor(rand() * sib.length)];
}

function startAct(run, rand = Math.random) {
  const choices = nextActChoices(run.adv.act);
  const actMod = choices[0] || ACTS.phandalin;
  run.adv.actId = actMod.id;
  run.adv.bossBuff = 0;
  run.adv.map = genMap(run, run.adv.act, rand);
  run.adv.pos = null;
  run.adv.path = [];
  run.adv.node = null;
  run.adv.loot = null;
  run.adv.hrDraft = null;
  run.adv.curio = null;
  run.adv.mystery = null;
  run.adv.retryPending = false;
  openShop(run, rand);
  run.adv.stage = 'shop';
}

function nextNodes(run) {
  const M = run.adv && run.adv.map, p = run.adv && run.adv.pos;
  if (!M || !M.length) return [];
  if (!p) return M[0] || [];
  const cur = M[p.r] && M[p.r][p.i];
  if (!cur || !M[p.r + 1]) return [];
  const edges = cur.next || [];
  return M[p.r + 1].filter(n => edges.includes(n.i));
}

/* ---------- Encounter Builder (Soft-Lane Safe Map Selection + Mirroring + Exact CR) ---------- */
function buildEncounter(run, rand = Math.random, opts = {}) {
  const d = run.depth;
  const tk = opts.threat || run.forceThreat || 'ambush';
  const base = ENC[tk] || ENC.ambush;
  const actMod = currentActModule(run);
  const cv = curveAt(d);
  const isBoss = !!opts.boss || /Boss/i.test(base.q || '');
  const isMiniboss = !!opts.miniboss || /Miniboss/i.test(base.q || '');

  // Keep lane count identical when picking an alternate Act map so enemy lane coordinates always match!
  const baseMap = (base.mapKey && BATTLE_MAPS[base.mapKey]) || null;
  const baseLanes = base.lanes || (baseMap && baseMap.lanes) || [{ id: 'center', n: 'Battlefield', c0: 0, c1: base.map[0].length - 1, obj: 'breach' }];
  let mapGrid = base.map;
  let lanes = baseLanes.map(l => ({ ...l }));
  let theme = base.theme || 'forest';
  let place = base.place;

  if (!isBoss && !isMiniboss && actMod.maps && actMod.maps.length && !opts.pinMap) {
    const compat = actMod.maps.filter(mk => BATTLE_MAPS[mk] && BATTLE_MAPS[mk].grid[0].length === base.map[0].length);
    if (compat.length) {
      const mk = rand() < .65 && base.mapKey ? base.mapKey : compat[Math.floor(rand() * compat.length)];
      const bm = BATTLE_MAPS[mk];
      if (bm) { mapGrid = bm.grid; theme = bm.theme; place = bm.n; lanes = bm.lanes.map(l => ({ ...l })); }
    }
  }
  const mapW = mapGrid[0].length;
  const doMirror = !isBoss && !isMiniboss && rand() < .5;
  if (doMirror) {
    mapGrid = mirrorMap(mapGrid);
    lanes = mirrorLanes(lanes, mapW);
  }

  let units = base.u.map((u, i) => ({
    u: doMirror ? [u[0], (E[u[0]] && E[u[0]].large ? mapW - 2 - u[1] : mapW - 1 - u[1]), u[2]] : u,
    i, el: E[u[0]] && (E[u[0]].elite || E[u[0]].boss)
  }));
  const n = (isBoss || isMiniboss) ? units.length : Math.max(d <= 1.2 ? 3 : 2, Math.round(units.length * cv.share));
  const regs = units.filter(x => !x.el), els = units.filter(x => x.el);
  let keep = (d >= 3 || isBoss || isMiniboss) ? [...els, ...regs] : [...regs, ...els];
  keep = keep.slice(0, n).sort((a, b) => a.i - b.i).map(x => x.u);
  if (d <= 1.2 && !isBoss && !isMiniboss) keep = keep.filter(u => !(E[u[0]] && E[u[0]].elite)).slice(0, 3);
  if (!keep.length) keep = base.u.slice(0, 2);

  const sc = base.sc || {};
  const retry = Math.pow(CURVE.retry, run.retries || 0);
  const bossBuff = isBoss ? (1 + (run.adv && run.adv.bossBuff ? run.adv.bossBuff : 0)) : 1;
  const enc = {
    n: base.n, place, theme, q: base.q || '', note: base.note || '',
    map: mapGrid, lanes, u: keep,
    hazard: opts.hazard || null,
    waves: d >= 4 ? (base.waves || []) : [],
    sc: {
      hp: (sc.hp || 1) * cv.hp * retry * (d <= 1.2 ? .92 : 1),
      dmg: (sc.dmg || 1) * cv.dmg * retry * bossBuff * (d <= 1.2 ? .92 : 1)
    },
    threat: tk, depth: d
  };
  enc.cr = calcEncounterCR(enc);
  ENC.run = enc;
  run.next = {
    threat: tk, n: base.n, q: base.q || '', tag: theme, cr: enc.cr,
    boss: isBoss, miniboss: isMiniboss, elite: !!opts.elite,
    hazard: opts.hazard || null, bonusGold: opts.bonusGold || 0,
    foes: keep.map(u => u[0])
  };
  return enc;
}

function buildNodeEncounter(run, node, rand = Math.random) {
  const actMod = currentActModule(run);
  run.depth = node.d || ADV.depth(run.adv.act, node.r || 0);
  let tk = node.threat;
  const W = run.adv.wanderer;
  const isWandererHit = !!(W && W.alive && node.r === W.r && node.i === W.i);
  if (isWandererHit) {
    tk = W.key;
    run.depth = ADV.depth(run.adv.act, node.r) + ADV.minibossDepth;
  } else if (!tk) {
    if (node.kind === 'boss') tk = run.adv.actBoss || actMod.pools.boss[0];
    else if (node.kind === 'miniboss') tk = actMod.pools.miniboss[0] || actMod.pools.dangerous[0];
    else if (node.kind === 'elite') tk = pickFromBag(run, `${actMod.id}_dang`, actMod.pools.dangerous, rand);
    else if (node.early || node.r === 0) tk = pickFromBag(run, `${actMod.id}_early`, actMod.pools.earlyNormal, rand);
    else tk = pickFromBag(run, `${actMod.id}_norm`, actMod.pools.normal, rand);
    node.threat = tk;
  }
  const enc = buildEncounter(run, rand, {
    threat: tk,
    boss: node.kind === 'boss',
    miniboss: node.kind === 'miniboss' || isWandererHit,
    elite: node.kind === 'elite',
    hazard: node.hazard || null
  });
  if (node.kind === 'elite') { enc.sc.hp *= ADV.eliteK; enc.sc.dmg *= ADV.eliteK; }
  if (node.kind === 'miniboss' || isWandererHit) { enc.sc.hp *= ADV.minibossK; enc.sc.dmg *= ADV.minibossK; }
  enc.cr = calcEncounterCR(enc);
  run.next.cr = enc.cr;
  run.next.kind = isWandererHit ? 'miniboss' : node.kind;
  run.next.wanderer = isWandererHit;
  return enc;
}

function enterNode(run, node, rand = Math.random) {
  run.adv.node = node;
  run.adv.retryPending = false;
  const W = run.adv.wanderer;
  const hitWanderer = !!(W && W.alive && node.r === W.r && node.i === W.i);
  if (hitWanderer || node.kind === 'fight' || node.kind === 'elite' || node.kind === 'miniboss' || node.kind === 'boss') {
    buildNodeEncounter(run, node, rand);
    run.adv.stage = 'battle';
    return 'battle';
  }
  if (node.kind === 'curio') {
    run.adv.curio = rollCurioStock(run, rand);
    run.adv.stage = 'event';
    return 'curio';
  }
  if (node.kind === 'mystery') {
    const m = resolveMystery(run, rand);
    run.adv.mystery = m;
    if (m.type === 'ambush') {
      buildEncounter(run, rand, { threat: m.threat });
      run.next.kind = 'fight';
      run.adv.stage = 'battle';
      return 'battle';
    }
    run.adv.stage = 'event';
    return 'mystery';
  }
  run.adv.stage = 'event';
  return node.kind;
}

function clearNode(run, rand = Math.random) {
  const n = run.adv.node;
  if (n) {
    run.adv.pos = { r: n.r, i: n.i };
    run.adv.path.push({ r: n.r, i: n.i });
  }
  run.adv.node = null;
  run.adv.curio = null;
  run.adv.mystery = null;
  run.adv.retryPending = false;
  advanceWanderer(run, rand);
  run.adv.stage = 'map';
}

/* ---------- ? Mystery Weighted Resolver (55% Event, 20% Ambush, 15% Treasure, 10% Peddler) ---------- */
function resolveMystery(run, rand = Math.random) {
  const actMod = currentActModule(run);
  const rollV = rand();
  if (rollV < 0.55) {
    run.adv.seenEvents = run.adv.seenEvents || [];
    const pool = actMod.events.filter(ev => !run.adv.seenEvents.includes(ev.id));
    const use = pool.length ? pool : actMod.events;
    const ev = use[Math.floor(rand() * use.length)];
    run.adv.seenEvents.push(ev.id);
    return { type: 'event', event: ev };
  }
  if (rollV < 0.75) {
    const threat = pickFromBag(run, `${actMod.id}_norm`, actMod.pools.normal, rand);
    return { type: 'ambush', threat, title: 'Surprise Ambush!' };
  }
  if (rollV < 0.90) {
    const items = treasureOffer(run, rand);
    return { type: 'treasure', items, title: 'Hidden Treasure Cache!' };
  }
  const items = [];
  for (let i = 0; i < 2; i++) {
    const k = rollItemFromPool(STANDARD_ITEM_KEYS.filter(x => !items.includes(x)), run, rand, 4, 2);
    if (k) items.push({ key: k, price: Math.max(2, ECON.itemPrice[ITEMS[k].r] - 2), bought: false });
  }
  return { type: 'peddler', items, title: 'Wandering Curio Peddler' };
}

/* ---------- Curio Merchant (Party-Keyword-Filtered 5g Unique Items + 1 Reroll 2g) ---------- */
function rollCurioStock(run, rand = Math.random) {
  const owned = new Set([...(run.stash || []), ...run.team.flatMap(h => h.items || [])]);
  const matched = uniqueItemsForParty(run.team, owned).sort(() => rand() - .5);
  const fallbackU = UNIQUE_ITEM_KEYS.filter(k => !owned.has(k) && !matched.includes(k)).sort(() => rand() - .5);
  const stock = [];
  for (const k of [...matched, ...fallbackU]) {
    if (stock.length >= 3) break;
    stock.push({ key: k, price: ECON.itemPrice[5], bought: false });
  }
  while (stock.length < 3) {
    const k = rollItemFromPool(STANDARD_ITEM_KEYS, run, rand, 4, 2);
    if (!k) break;
    stock.push({ key: k, price: ECON.itemPrice[ITEMS[k].r], bought: false });
  }
  return { items: stock, rerolled: false };
}

function buyCurioItem(run, idx) {
  const C = run.adv && run.adv.curio;
  if (!C || !C.items[idx] || C.items[idx].bought) return { ok: false, why: 'Sold out' };
  const entry = C.items[idx];
  if (!canAfford(run, entry.price)) return { ok: false, why: 'Not enough gold' };
  if (run.stash.length >= ECON.stash) return { ok: false, why: 'Stash is full' };
  run.gold -= entry.price; run.stats.spent += entry.price;
  entry.bought = true;
  run.stash.push(entry.key);
  return { ok: true, item: entry.key };
}

function rerollCurio(run, rand = Math.random) {
  const C = run.adv && run.adv.curio;
  if (!C || C.rerolled) return { ok: false, why: 'Already rerolled' };
  if (!canAfford(run, ECON.curioReroll)) return { ok: false, why: 'Need 2g to reroll' };
  run.gold -= ECON.curioReroll; run.stats.spent += ECON.curioReroll;
  const fresh = rollCurioStock(run, rand);
  fresh.rerolled = true;
  run.adv.curio = fresh;
  return { ok: true };
}

/* ---------- Single-Class Named Multiclass Nodes ---------- */
function eligibleForMulticlass(run, cls) {
  return run.team.filter(h => !h.multiclass && H[h.key] && H[h.key].cls !== cls);
}
function applyMulticlass(run, uid, cls) {
  const h = run.team.find(x => x.uid === uid);
  if (!h || !MULTICLASS[cls] || h.multiclass || H[h.key].cls === cls) return false;
  h.multiclass = cls;
  return true;
}

/* ---------- v0.24 Lane-Aware Smart Auto-Placement ---------- */
function autoPlace(run, force) {
  const enc = ENC.run;
  loadMap(enc.map, enc.lanes);
  const spots = DEPLOY.slice();
  const on = boardHeroes(run);
  const used = new Set();
  const kOf = s => s.c + ',' + s.r;
  const laneHeroCounts = LANES.map(() => 0);

  if (!force) {
    on.forEach(h => {
      if (h.c != null && spots.some(s => s.c === h.c && s.r === h.r) && !used.has(kOf(h))) {
        const li = laneOfCol(h.c, LANES);
        const maxH = (LANE_OBJ[LANES[li].obj] && LANE_OBJ[LANES[li].obj].maxHeroes) || 4;
        if (laneHeroCounts[li] < maxH) {
          used.add(kOf(h));
          laneHeroCounts[li]++;
          return;
        }
      }
      h.c = null;
    });
  } else {
    on.forEach(h => { h.c = null; });
  }

  // Order lanes by priority (contested enemy lanes first; Boss/Breach/Ritual/Choke ahead of empty)
  const laneEnemyCounts = LANES.map((_, idx) => (enc.u || []).filter(([, c]) => laneOfCol(c, LANES) === idx).length);
  const toPlace = on.filter(h => h.c == null).sort((a, b) => {
    const ra = H[a.key].role === 'Tank' ? 0 : H[a.key].reach === 'Melee' ? 1 : H[a.key].role === 'Damage' ? 2 : 3;
    const rb = H[b.key].role === 'Tank' ? 0 : H[b.key].reach === 'Melee' ? 1 : H[b.key].role === 'Damage' ? 2 : 3;
    return ra - rb;
  });

  toPlace.forEach(h => {
    const d = H[h.key];
    const isFront = d.role === 'Tank' || d.reach === 'Melee';
    // Choose best lane with remaining capacity (spread across contested lanes first, then double up main/ritual lane)
    const candLanes = LANES.map((L, idx) => {
      const maxH = (LANE_OBJ[L.obj] && LANE_OBJ[L.obj].maxHeroes) || 4;
      const full = laneHeroCounts[idx] >= maxH;
      const foesN = laneEnemyCounts[idx];
      let score = full ? -999 : (foesN > 0 ? 20 : 0) - laneHeroCounts[idx] * 12;
      if (!full && d.role === 'Tank' && L.obj === 'choke' && laneHeroCounts[idx] === 0) score += 14;
      if (!full && L.obj === 'boss' || L.obj === 'breach') score += 5;
      if (!full && L.obj === 'ritual' && laneHeroCounts[idx] === 0) score += 8;
      if (!full && d.targetMode === 'closest_ally' && laneHeroCounts[idx] === 1) score += 16;
      return { idx, score };
    }).sort((a, b) => b.score - a.score);

    const pickedLane = candLanes[0] ? candLanes[0].idx : 0;
    const lCells = laneDeployCells(pickedLane, LANES);
    const lRows = [...new Set(lCells.map(s => s.r))].sort((a, b) => a - b);
    const lMid = (LANES[pickedLane].c0 + LANES[pickedLane].c1) / 2;
    const sorted = lCells.slice().sort((a, b) => Math.abs(a.c - lMid) - Math.abs(b.c - lMid));
    const front = sorted.filter(s => s.r === lRows[0]);
    const back = sorted.filter(s => s.r !== lRows[0]);
    const pref = isFront ? [...front, ...back, ...spots] : [...back, ...front, ...spots];
    const spot = pref.find(x => !used.has(kOf(x)));
    if (spot) {
      h.c = spot.c; h.r = spot.r;
      used.add(kOf(spot));
      laneHeroCounts[laneOfCol(spot.c, LANES)]++;
    }
  });
}
function autoBless() {}
function partyCfg(run) { return boardHeroes(run).map(h => cfgOf(h, run)); }

/* ---------- Opt-In Hero Quests Progression & Uncapped Run Scalers ---------- */
function acceptHeroQuest(run, uid) {
  const h = run.team.find(x => x.uid === uid);
  if (!h || h.questActive || h.questDone) return false;
  h.questActive = true;
  h.questProg = 0;
  return true;
}

function updateHeroQuests(run, won, b) {
  const updates = [];
  if (!b) return updates;
  const P = b.units.filter(x => x.side === 'P' && !x.minion);
  const noneFell = won && P.length > 0 && P.every(u => u.alive);

  boardHeroes(run).forEach(h => {
    const d = H[h.key];
    const q = d && d.quest;
    const u = P.find(x => x.key === h.key);
    if (!q || !u) return;
    if (!h.questActive && !h.questDone) return;

    if (h.questDone) {
      if (h.key === 'faelan' && won) {
        h.questStacks = (h.questStacks || 0) + 1;
        updates.push({ h, scaled: `Owl Familiar: +1 INT (total +${h.questStacks})` });
      }
      if (h.key === 'zark' && u.alive && u._droppedHalf) {
        h.questStacks = (h.questStacks || 0) + 1;
        updates.push({ h, scaled: `Relentless Hide: +1 CON (total +${h.questStacks})` });
      }
      if (h.key === 'velith' && (u.stats.kills || 0) > 0) {
        h.questKillBank = (h.questKillBank || 0) + (u.stats.kills || 0);
        const gained = Math.floor(h.questKillBank / 4);
        if (gained > 0) {
          h.questKillBank %= 4;
          h.questStacks = (h.questStacks || 0) + gained;
          updates.push({ h, scaled: `Death’s Ledger: +${gained} DEX (total +${h.questStacks})` });
        }
      }
      if (h.key === 'lorcan' && b.trophiesEarned && b.trophiesEarned.length) {
        h.questStacks = (h.questStacks || 0) + b.trophiesEarned.length;
        updates.push({ h, scaled: `Favoured Enemy: +${b.trophiesEarned.length} DEX (total +${h.questStacks})` });
      }
      return;
    }

    let delta = 0;
    if (q.statKey === 'flawlessWins') {
      if (noneFell) delta = 1;
    } else if (q.statKey === 'itemWins') {
      if (won && (h.items || []).length >= 2) delta = 1;
    } else if (q.statKey === 'bearRagePeak') {
      h.questProg = Math.max(h.questProg || 0, u.stats.bearRagePeak || 0);
    } else {
      delta = u.stats[q.statKey] || 0;
    }

    if (delta > 0) h.questProg = (h.questProg || 0) + delta;

    if (h.questProg >= q.goal) {
      h.questDone = true;
      h.questProg = q.goal;
      updates.push({ h, completed: true, rewardName: q.rewardName, rewardDesc: q.rewardDesc });
    } else if (delta > 0 || (q.statKey === 'bearRagePeak' && u.stats.bearRagePeak > 0)) {
      updates.push({ h, progress: Math.min(1, h.questProg / q.goal), prog: h.questProg, goal: q.goal });
    }
  });

  return updates;
}

/* ---------- Post-Combat Resolution (Scaling Items, House Rules, Lane Bonuses, Piggy Bank) ---------- */
function resolveFight(run, won, b) {
  const d = run.depth;
  let gold = 0, piggy = 0, bonusGold = 0, interest = 0;
  const hrNotes = [];
  run.hrState = run.hrState || { blitzStacks: 0, apprenticeWins: 0, apprenticeDone: false, bountyObjs: 0 };
  run.itemStacks = run.itemStacks || {};

  if (won) {
    gold = ECON.winGold(d);
    interest = goldInterest(run);
    // Bag of Holding: +1 Gold (max 1) on win
    const hasBag = (run.team || []).some(h => (h.items || []).some(k => ITEMS[k] && ITEMS[k].s && ITEMS[k].s.bagGold));
    if (hasBag) bonusGold += 1;
    // Gains Quest Golden Goose: +10% held Gold interest (up to +5g)
    if ((run.team || []).some(h => h.key === 'gains' && h.questDone)) {
      bonusGold += Math.min(5, Math.floor((run.gold || 0) * .10));
    }
    // House Rule: Guild Treasury (+1g per win)
    if (hasHouseRule(run, 'hr_guild_treasury')) bonusGold += 1;
    // Scaling Investment Items: increment stacks for every equipped scaling item (+1g per win for Ledger of the Mint!)
    const seenScale = new Set();
    (run.team || []).forEach(h => (h.items || []).forEach(ik => {
      const it = ITEMS[ik];
      if (it && it.scaling && !seenScale.has(ik)) {
        seenScale.add(ik);
        run.itemStacks[ik] = (run.itemStacks[ik] || 0) + 1;
        if (ik === 'ledger_mint') bonusGold += 1;
        hrNotes.push(`🌱 ${it.n} grew to +${run.itemStacks[ik]} stacks`);
      }
    }));

    // House Rule: Speedrun Bonus (win <15s -> +5% permanent party dmg)
    if (hasHouseRule(run, 'hr_blitzkrieg') && b && b.time < 15) {
      run.hrState.blitzStacks = (run.hrState.blitzStacks || 0) + 1;
      hrNotes.push(`⏱ Speedrun Bonus: ×${Math.pow(1.05, run.hrState.blitzStacks).toFixed(2)} permanent Damage!`);
    }
    // House Rule: Long-Term Investment (after 3 wins -> promote lowest-tier hero + x1.22 Damage!)
    if (hasHouseRule(run, 'hr_apprentice_pact') && !run.hrState.apprenticeDone) {
      run.hrState.apprenticeWins = (run.hrState.apprenticeWins || 0) + 1;
      if (run.hrState.apprenticeWins >= 3) {
        run.hrState.apprenticeDone = true;
        const lowH = run.team.slice().sort((a, c) => a.tier - c.tier)[0];
        if (lowH && lowH.tier < 4) {
          promoteHero(run, lowH.uid);
          hrNotes.push(`🌱 Long-Term Investment matured! ${H[lowH.key].name} promoted to Tier ${lowH.tier} & ×1.22 Party Damage!`);
        } else {
          hrNotes.push('🌱 Long-Term Investment matured! ×1.22 Party Damage unlocked!');
        }
      } else {
        hrNotes.push(`🌱 Long-Term Investment: ${run.hrState.apprenticeWins}/3 wins`);
      }
    }
    // House Rule: Double Bounties (every 2 lane objectives won -> +1 Key Attribute to a hero!)
    if (hasHouseRule(run, 'hr_bounty_board') && b && b.laneObjectivesWon > 0) {
      run.hrState.bountyObjs = (run.hrState.bountyObjs || 0) + b.laneObjectivesWon;
      while (run.hrState.bountyObjs >= 2) {
        run.hrState.bountyObjs -= 2;
        const th = run.team[Math.floor(Math.random() * run.team.length)];
        if (th) {
          const attr = H[th.key].pair[1];
          th.train = th.train || {};
          th.train[attr] = (th.train[attr] || 0) + 1;
          hrNotes.push(`🎯 Double Bounties: ${H[th.key].name} gained +1 ${ATTR_S[attr]}!`);
        }
      }
    }
    // Supply Cart free rerolls & Camp Rank discount (-1g per combat win!)
    if (b && b.laneBonusRerolls > 0) {
      run.freeRerolls = (run.freeRerolls || 0) + b.laneBonusRerolls;
      hrNotes.push(`💰 Supply Cart: +${b.laneBonusRerolls} Free Shop Reroll!`);
    }
    if (campRankOf(run) < 4) run.campDiscount = (run.campDiscount || 0) + 1;

    if (run.next && run.next.bonusGold) bonusGold += run.next.bonusGold;
    gold += interest + bonusGold;
    run.stats.won++;
    run.depth++;
    run.retries = 0;
    if (!run.piggyBroken) run.piggy += ECON.piggyPerWin;
  } else {
    run.losses++;
    run.stats.lost++;
    run.retries = (run.retries || 0) + 1;
    if (run.losses <= ECON.freeLosses && !run.piggyBroken) {
      piggy = run.piggy;
      run.piggy = 0;
      run.piggyBroken = true;
      gold += piggy;
    }
  }
  const made = (b && b.gold) || 0;
  run.gold += gold + made;
  run.stats.gold += gold + made;
  run.hist.push(run.next ? run.next.threat : 'ambush');
  run.log.push({ d: Math.round(d), threat: run.next ? run.next.threat : 'ambush', won, gold, interest, made, piggy, time: b ? +b.time.toFixed(1) : 0 });
  if (run.losses > ECON.freeLosses) run.over = true;
  return { won, gold, interest, made, d, piggy, bonusGold, hrNotes };
}

function resolveNodeFight(run, won, b, rand = Math.random) {
  const n = run.adv.node;
  const res = resolveFight(run, won, b);
  res.quests = updateHeroQuests(run, won, b);
  const hitWanderer = !!(run.next && run.next.wanderer);

  if (won && hitWanderer && run.adv.wanderer) {
    run.adv.wanderer.alive = false;
    run.gold += 10; run.stats.gold += 10;
    res.minibossGold = 10;
    run.adv.loot = treasureOffer(run, rand, 6, 3);
    run.adv.hrDraft = rollHouseRuleDraft(run, rand, 2);
  } else if (won && n && n.kind === 'miniboss') {
    run.gold += 6; run.stats.gold += 6;
    res.minibossGold = 6;
    run.adv.loot = treasureOffer(run, rand, 4, 2);
    run.adv.hrDraft = rollHouseRuleDraft(run, rand, 1);
  } else if (won && n && (n.kind === 'elite' || n.hazard)) {
    const bonus = n.hazard ? 4 : ADV.eliteGold;
    run.gold += bonus; run.stats.gold += bonus;
    res.elite = bonus;
    run.adv.loot = treasureOffer(run, rand, n.hazard ? 4 : 3);
  }

  if (won && n && n.kind === 'boss') {
    run.adv.bosses.push(n.threat);
    res.actDone = run.adv.act;
    if (!run.piggyBroken && ECON.actIntactBonus) {
      run.gold += ECON.actIntactBonus;
      run.stats.gold += ECON.actIntactBonus;
      res.actBonus = (res.actBonus || 0) + ECON.actIntactBonus;
    }
    if (run.adv.act >= ADV.acts) {
      run.victory = true; run.over = true; res.finished = true;
    } else {
      run.gold += 8; run.stats.gold += 8;
      res.actBonus = 8;
      run.adv.hrDraft = rollHouseRuleDraft(run, rand, run.adv.act >= 2 ? 2 : 1);
      if (run.adv.act >= 2) run.adv.loot = treasureOffer(run, rand, 5, 2);
    }
  }
  return res;
}

function afterNodeFight(run, res, rand = Math.random) {
  const n = run.adv.node;
  if (run.over) return 'over';
  if (res.actDone) {
    run.adv.act++;
    startAct(run, rand);
    return 'shop';
  }
  if (!res.won && n) {
    buildNodeEncounter(run, n, rand);
    run.adv.retryPending = true;
    openShop(run, rand);
    run.adv.stage = 'shop';
    return 'shop';
  }
  clearNode(run, rand);
  openShop(run, rand);
  run.adv.stage = 'shop';
  return 'shop';
}

/* ---------- Map Events: Training, Campfire, Quest Board, Treasure ---------- */
function trainHero(run, uid, attr) {
  const h = run.team.find(x => x.uid === uid);
  if (!h) return false;
  h.train = h.train || {};
  h.train[attr] = (h.train[attr] || 0) + 1;
  run.adv.trained++;
  return true;
}

function promoteHero(run, uid) {
  const h = run.team.find(x => x.uid === uid);
  if (!h || h.tier >= 4) return { ok: false };
  const was = h.tier;
  h.tier += 1;
  run.adv.trained++;
  return {
    ok: true, hero: h,
    needsPath: was < 2 && h.tier >= 2 && !h.path,
    needsAsi: was < 3 && h.tier >= 3 && !h.asi,
    needsBoon: was < 4 && h.tier >= 4 && !h.boon
  };
}

function retrainHeroPath(run, uid, newPathKey) {
  const h = run.team.find(x => x.uid === uid);
  if (!h || h.tier < 2) return false;
  const d = H[h.key];
  if (!d.paths.some(p => p.k === newPathKey)) return false;
  h.path = newPathKey;
  return true;
}

function accelerateHeroQuest(run, uid) {
  const h = run.team.find(x => x.uid === uid);
  if (!h || h.questDone) return null;
  if (!h.questActive) { acceptHeroQuest(run, uid); return { accepted: true, h, q: H[h.key].quest }; }
  const q = H[h.key].quest;
  if (!q) return null;
  const boost = Math.max(1, Math.ceil(q.goal * .35));
  h.questProg = Math.min(q.goal, (h.questProg || 0) + boost);
  if (h.questProg >= q.goal) { h.questDone = true; return { completed: true, h, q }; }
  return { completed: false, h, q, boost };
}

function restAt(run, choice) {
  if (choice === 'piggy' && !run.piggyBroken) { run.piggy += 4; return 'Added +4 gold to your Piggy Bank'; }
  run.gold += 4; run.stats.gold += 4;
  return 'Foraged +4 gold';
}

function treasureOffer(run, rand = Math.random, bonusEnc = 3, minR = 0) {
  const avail = (run.adv && run.adv.itemPool && run.adv.itemPool.length) ? run.adv.itemPool.slice() : STANDARD_ITEM_KEYS.slice();
  const out = [];
  while (out.length < 3 && avail.length) {
    const pick = rollItemFromPool(avail, run, rand, bonusEnc, minR);
    if (!pick) break;
    out.push(pick);
    const idx = avail.indexOf(pick);
    if (idx >= 0) avail.splice(idx, 1);
  }
  return out;
}
function takeTreasure(run, k) { if (run.stash.length < ECON.stash) run.stash.push(k); }

/* ---------- Boss Readiness Forecast (CR-Backed + Fast Live Sim) ---------- */
function bossRead(run) {
  const M = run.adv && run.adv.map;
  if (!M || !run.team.length) return null;
  const boss = M[ADV.bossRow] && M[ADV.bossRow][0];
  if (!boss) return null;
  const pcr = calcPartyCR(run).cr;
  const bcr = boss.cr || estimateNodeCR(boss, actOf(run));
  const v = crVerdict(pcr, bcr);
  return { m: v.ratio, cr: bcr, partyCR: pcr, label: v.label, cls: v.cls };
}
