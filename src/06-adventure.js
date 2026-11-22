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
  interestCap: 4,
  winGold: d => 6 + Math.floor(d / 4),
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

const TIERCOL = { 1: '#a8743c', 2: '#8c9aa8', 3: '#d0a02a', 4: '#8a4fb8' };
const heroValue = t => { let v = 0; for (let i = 1; i <= t; i++) v += ECON.heroPrice(i); return v; };
const goldInterest = run => Math.min(ECON.interestCap, Math.floor(Math.max(0, (run && run.gold) || 0) / ECON.interestStep));
const actOf = run => (run && run.adv ? run.adv.act : 1);
const encounterCount = run => Math.max(0, (run && run.stats && run.stats.won) || 0);
const slotsOf = h => (h && h.key === 'wallaby' && h.questDone) ? 4 : 3;

/* ---------- Smooth Per-Encounter Progression Curves ---------- */
function heroTierOdds(e) {
  const n = Math.max(0, e || 0);
  const t3 = n < 6 ? 0 : Math.min(30, (n - 5) * 3);
  const t2Raw = n < 1 ? 0 : Math.min(55, n * 5);
  const t1 = Math.max(25, 100 - t2Raw - t3);
  const t2 = Math.max(0, 100 - t1 - t3);
  return [t1 / 100, t2 / 100, t3 / 100];
}
function rollOfferTier(run, rand = Math.random) {
  const o = heroTierOdds(encounterCount(run));
  let x = rand();
  for (let t = 0; t < 3; t++) { x -= o[t]; if (x <= 0) return t + 1; }
  return 1;
}

// v0.23 Smooth 5-Tier Item Rarity Curve (Common / Uncommon / Rare / Very Rare / Legendary)
const ITEM_ODDS_TABLE = [
  [0,  [65, 35,  0,  0, 0]],
  [2,  [56, 36,  8,  0, 0]],
  [4,  [46, 38, 16,  0, 0]],
  [6,  [36, 36, 23,  5, 0]],
  [8,  [28, 33, 27, 12, 0]],
  [10, [20, 27, 30, 20, 3]],
  [12, [15, 22, 30, 27, 6]],
  [15, [10, 18, 30, 33, 9]]
];
function itemRarityOdds(e) {
  const n = Math.max(0, e || 0);
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
  const o = itemRarityOdds(encounterCount(run) + bonusEnc);
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

/* ---------- Difficulty Curve & Hazards ---------- */
const CURVE = {
  share: [.52, .68, .84, .95, 1],
  grow: 1.162,
  dmgGrow: 1.168,
  ease: [0.86, 1.02, 1.15, 1.26, 1.38],
  retry: .96
};
function curveAt(d) {
  const di = Math.max(1, Math.floor(d));
  const share = CURVE.share[Math.min(di, CURVE.share.length) - 1];
  if (d <= 5) { const e = CURVE.ease[di - 1]; return { share, hp: e, dmg: e }; }
  return { share, hp: Math.pow(CURVE.grow, d - 5), dmg: Math.pow(CURVE.dmgGrow, d - 5) };
}

const HAZARDS = {
  steam:        { k: 'steam',        n: 'Boiling Steam',      g: '♨', x: 'All non-fireproof units take 3% Max HP fire ticks every 2s. Grants Vault Loot!' },
  frictionless: { k: 'frictionless', n: 'Frictionless Floor', g: '❄', x: 'Push distances doubled and movement slowed 20%. Grants Vault Loot!' },
  dampener:     { k: 'dampener',     n: 'Arcane Dampener',    g: '◈', x: '35% slower Charge gain for both sides during the first 10s. Grants Vault Loot!' }
};
const HAZARD_KEYS = Object.keys(HAZARDS);

const ADV = {
  acts: 3, rows: 9, bossRow: 8,
  depth: (act, r) => [1, 5.7, 9.0][act - 1] + r * [.62, .50, .42][act - 1],
  bossDepth: act => [6.2, 10.0, 12.2][act - 1],
  eliteDepth: 0.95, eliteK: 1.18, eliteGold: 5,
  minibossDepth: 1.10, minibossK: 1.18,
  startGold: 8
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
    v: '0.23', depth: 1, shopNo: 0, endless: false, victory: false,
    losses: 0, piggy: 0, piggyBroken: false, gold: 0,
    team: [], stash: [],
    shop: { heroes: [], slotKind: [], tiers: [], items: [], fresh: [], sale: null, rr: 0, frozen: false },
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
    curio: null, mystery: null, retryPending: false,
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
  act: actOf(run), goldHeld: run ? run.gold : 0
});
const boardHeroes = run => run.team.filter(h => h.onBoard);
const benchHeroes = run => run.team.filter(h => !h.onBoard);
const ownedHero = (run, k) => run.team.find(h => h.key === k);
const canAfford = (run, p) => p != null && run.gold >= p;
const onSale = (run, kind, i) => run.shop && run.shop.sale && run.shop.sale.kind === kind && run.shop.sale.i === i;
const itemPrice = (run, i) => { const k = run.shop.items[i]; return k ? Math.max(1, ECON.itemPrice[ITEMS[k].r] - (onSale(run, 'i', i) ? ECON.sale : 0)) : null; };
const rerollPrice = run => ECON.reroll(run.shop.rr || 0);
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

/* ---------- Camp Shop (Whole-Shop Freeze Only, Exact-Tier Upgrades, 5-Tier Items) ---------- */
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
// Backwards-compatible no-op for removed per-slot lock calls
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
    items.push(rollItemFromPool(c, run, rand, 0));
  }

  const free = [
    ...heroes.map((k, i) => k ? ['h', i] : null),
    ...items.map((k, i) => k ? ['i', i] : null)
  ].filter(Boolean);
  const sl = free.length ? free[Math.floor(rand() * free.length)] : null;

  run.shop = {
    heroes, slotKind, tiers, items,
    rr: keepCount ? (old.rr || 0) : 0,
    frozen: false,
    fresh: keepCount ? (old.fresh || []) : [],
    sale: sl ? { kind: sl[0], i: sl[1] } : (keepCount ? old.sale : null)
  };
}

function openShop(run, rand = Math.random) {
  run.shopNo = (run.shopNo || 0) + 1;
  if (run.shop && run.shop.frozen && (run.shop.heroes.some(Boolean) || run.shop.items.some(Boolean))) {
    run.shop.frozen = false; run.shop.rr = 0; run.shop.fresh = [];
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

  return rows;
}

function advanceWanderer(run, rand = Math.random) {
  const W = run.adv && run.adv.wanderer;
  const M = run.adv && run.adv.map;
  if (!W || !W.alive || !M) return;
  const curRow = M[W.r];
  if (!curRow || !curRow[W.i]) return;
  const curNode = curRow[W.i];
  const playerRow = run.adv.pos ? run.adv.pos.r : -1;
  // Step forward if ahead/behind player (never into Boss row 8)
  if (W.r < 6 && (W.r <= playerRow + 1 || rand() < .6)) {
    const nx = curNode.next || [];
    if (nx.length) {
      W.r += 1;
      W.i = nx[Math.floor(rand() * nx.length)];
      return;
    }
  }
  // Otherwise patrol sideways within the same row
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
  run.adv.curio = null;
  run.adv.mystery = null;
  run.adv.retryPending = false;
  // v0.23 Camp Shop Flow Flip: open refreshed Camp Shop at the start of every Act!
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

/* ---------- Encounter Builder (Dynamic Pool Roll + Curated Maps + Optional Mirroring) ---------- */
function buildEncounter(run, rand = Math.random, opts = {}) {
  const d = run.depth;
  const tk = opts.threat || run.forceThreat || 'ambush';
  const base = ENC[tk] || ENC.ambush;
  const actMod = currentActModule(run);
  const cv = curveAt(d);
  const isBoss = !!opts.boss || /Boss/i.test(base.q || '');
  const isMiniboss = !!opts.miniboss || /Miniboss/i.test(base.q || '');

  // Choose map: Bosses/Minibosses pin signature arena; Normal/Elite pick compatible Act map w/ 50% horizontal mirror
  let mapGrid = base.map;
  let theme = base.theme || 'forest';
  let place = base.place;
  if (!isBoss && !isMiniboss && actMod.maps && actMod.maps.length && !opts.pinMap) {
    const mk = rand() < .5 && base.mapKey ? base.mapKey : actMod.maps[Math.floor(rand() * actMod.maps.length)];
    const bm = BATTLE_MAPS[mk];
    if (bm) { mapGrid = bm.grid; theme = bm.theme; place = bm.n; }
  }
  const doMirror = !isBoss && !isMiniboss && rand() < .5;
  if (doMirror) mapGrid = mirrorMap(mapGrid);

  let units = base.u.map((u, i) => ({
    u: doMirror ? [u[0], (E[u[0]] && E[u[0]].large ? 8 - u[1] : 9 - u[1]), u[2]] : u,
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
    map: mapGrid, u: keep,
    hazard: opts.hazard || null,
    waves: d >= 4 ? (base.waves || []) : [],
    sc: {
      hp: (sc.hp || 1) * cv.hp * retry * (d <= 1.2 ? .92 : 1),
      dmg: (sc.dmg || 1) * cv.dmg * retry * bossBuff * (d <= 1.2 ? .92 : 1)
    },
    threat: tk, depth: d
  };
  ENC.run = enc;
  run.next = {
    threat: tk, n: base.n, q: base.q || '', tag: theme,
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
    run.adv.stage = 'battle'; // Goes directly into Tactical Deployment!
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
  // 10% Wandering Curio Peddler (2 discounted Rare/Very Rare items)
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

/* ---------- Placement ---------- */
function autoPlace(run, force) {
  loadMap(ENC.run.map);
  const spots = DEPLOY.slice();
  const rows = [...new Set(spots.map(s => s.r))].sort((a, b) => a - b);
  const mid = (COLS - 1) / 2;
  const order = spots.slice().sort((a, b) => Math.abs(a.c - mid) - Math.abs(b.c - mid));
  const front = order.filter(s => s.r === rows[0]), back = order.filter(s => s.r !== rows[0]);
  const on = boardHeroes(run);
  const used = new Set();
  const kOf = s => s.c + ',' + s.r;
  if (!force) on.forEach(h => { if (h.c != null && spots.some(s => s.c === h.c && s.r === h.r) && !used.has(kOf(h))) used.add(kOf(h)); else h.c = null; });
  else on.forEach(h => h.c = null);
  on.filter(h => h.c == null).sort((a, b) => (H[a.key].role === 'Tank' ? 0 : 1) - (H[b.key].role === 'Tank' ? 0 : 1)).forEach(h => {
    const pref = H[h.key].role === 'Tank' || H[h.key].reach === 'Melee' ? [...front, ...back] : [...back, ...front];
    const s = pref.find(x => !used.has(kOf(x)));
    if (s) { h.c = s.c; h.r = s.r; used.add(kOf(s)); }
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
    if (!h.questActive && !h.questDone) return; // Opt-in only via Quest Board!

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

/* ---------- Post-Combat Resolution (Piggy Bank Single Free-Loss Rule!) ---------- */
function resolveFight(run, won, b) {
  const d = run.depth;
  let gold = 0, piggy = 0, bonusGold = 0, interest = 0;
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
  return { won, gold, interest, made, d, piggy, bonusGold };
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
    run.adv.loot = treasureOffer(run, rand, 6, 3); // Very Rare / Legendary!
  } else if (won && n && n.kind === 'miniboss') {
    run.gold += 6; run.stats.gold += 6;
    res.minibossGold = 6;
    run.adv.loot = treasureOffer(run, rand, 4, 2); // Guaranteed Rare / Very Rare!
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
      // Act 2 Boss drops a bonus Rare/Very Rare/Legendary relic choice!
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
  // Piggy Bank retry exception: returns to Camp Shop with Retry button for that exact fight!
  if (!res.won && n) {
    buildNodeEncounter(run, n, rand);
    run.adv.retryPending = true;
    openShop(run, rand);
    run.adv.stage = 'shop';
    return 'shop';
  }
  // v0.23 Camp Shop Flow Flip: after every combat win, advance position & open refreshed Camp Shop!
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

/* ---------- Boss Readiness Forecast ---------- */
function bossRead(run, sims = 3) {
  const M = run.adv.map;
  if (!M || !run.team.length) return null;
  const boss = M[ADV.bossRow][0];
  const saveEnc = ENC.run, saveNext = run.next, saveDepth = run.depth, saveUid = UID;
  let m = 0;
  try {
    for (let s = 0; s < sims; s++) {
      buildNodeEncounter(run, boss);
      const b = simulate('run', partyCfg(run), 1);
      const P = b.units.filter(u => u.side === 'P' && !u.minion);
      const E2 = b.units.filter(u => u.side === 'E');
      const pHp = P.reduce((a, u) => a + (u.alive ? Math.max(0, u.hp) : 0), 0) / Math.max(1, P.reduce((a, u) => a + u.maxHp, 0));
      const eHp = E2.reduce((a, u) => a + (u.alive ? Math.max(0, u.hp) : 0), 0) / Math.max(1, E2.reduce((a, u) => a + u.maxHp, 0));
      m += b.winner === 'P' ? .5 + .5 * pHp : .5 * (1 - eHp);
    }
  } finally {
    ENC.run = saveEnc; run.next = saveNext; run.depth = saveDepth; UID = saveUid;
    if (saveEnc && saveEnc.map) loadMap(saveEnc.map);
  }
  m /= sims;
  return { m, label: m >= .7 ? 'Favoured' : m >= .52 ? 'Even' : m >= .3 ? 'Dangerous' : 'Deadly' };
}
