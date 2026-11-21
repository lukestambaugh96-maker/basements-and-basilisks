import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const rawDir = path.join(root, 'data/v0.22-meta');

const w1 = JSON.parse(fs.readFileSync(path.join(rawDir, 'wiki-sim-1.json'), 'utf8'));
const w2 = JSON.parse(fs.readFileSync(path.join(rawDir, 'wiki-sim-2.json'), 'utf8'));
const baseA = JSON.parse(fs.readFileSync(path.join(rawDir, 'sim-a-results.json'), 'utf8'));
const baseB = JSON.parse(fs.readFileSync(path.join(rawDir, 'sim-b-results.json'), 'utf8'));
const postB = JSON.parse(fs.readFileSync(path.join(rawDir, 'post-b-results.json'), 'utf8'));

// Calibrated re-test for Gilthrax items at d=14.2 so naked baseline doesn't hit 100% WR ceiling
const engineCode = [
  'src/01-geo.js', 'src/02-enemies.js', 'src/03-heroes.js',
  'src/04-items.js', 'src/05-engine.js', 'src/06-adventure.js',
].map(f => fs.readFileSync(path.join(root, f), 'utf8')).join('\n');

const gilthraxItems = new Function(engineCode + `
  let _seed = 202611219;
  Math.random = () => {
    _seed = (_seed + 0x6D2B79F5) | 0;
    let t = Math.imul(_seed ^ (_seed >>> 15), 1 | _seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  function placeParty(party) {
    loadMap(ENC.run.map);
    const spots = DEPLOY.slice();
    const rows = [...new Set(spots.map(s => s.r))].sort((a, b) => a - b);
    const mid = (COLS - 1) / 2;
    const order = spots.slice().sort((a, b) => Math.abs(a.c - mid) - Math.abs(b.c - mid));
    const front = order.filter(s => s.r === rows[0]);
    const back = order.filter(s => s.r !== rows[0]);
    const used = new Set();
    const out = party.map(h => ({ ...h }));
    out.slice().sort((a, b) => (H[a.key].role === 'Tank' ? 0 : 1) - (H[b.key].role === 'Tank' ? 0 : 1)).forEach(h => {
      const pref = (H[h.key].role === 'Tank' || H[h.key].reach === 'Melee') ? [...front, ...back] : [...back, ...front];
      const s = pref.find(x => !used.has(x.c + ',' + x.r));
      if (s) { h.c = s.c; h.r = s.r; used.add(s.c + ',' + s.r); }
    });
    return out;
  }
  function fight(threat, depth, party) {
    const r = newAdventure(); r.depth = depth; r.forceThreat = threat;
    buildEncounter(r);
    const b = simulate('run', placeParty(party), 1);
    const P = b.units.filter(u => u.side === 'P' && !u.minion);
    const E2 = b.units.filter(u => u.side === 'E');
    const pHp = P.reduce((a, u) => a + (u.alive ? Math.max(0, u.hp) : 0), 0) / Math.max(1, P.reduce((a, u) => a + u.maxHp, 0));
    const eHp = E2.reduce((a, u) => a + (u.alive ? Math.max(0, u.hp) : 0), 0) / Math.max(1, E2.reduce((a, u) => a + u.maxHp, 0));
    const won = b.winner === 'P';
    return { won, score: won ? 0.5 + 0.5 * pHp : 0.5 * (1 - eHp) };
  }
  const team = (it) => [
    { key: 'gilthrax', tier: 3, path: 'gilded_hoard', asi: 'con', items: it ? [it] : [], act: 3, goldHeld: 20 },
    { key: 'arthur', tier: 3, path: 'vigilance', asi: 'dex', items: [], act: 3, goldHeld: 20 },
    { key: 'rosalind', tier: 3, path: 'passround', asi: 'cha', items: [], act: 3, goldHeld: 20 },
    { key: 'lorcan', tier: 3, path: 'colossus', asi: 'wis', items: [], act: 3, goldHeld: 20 }
  ];
  const ths = ['orcs', 'owlbear', 'spider', 'glasstaff', 'forge', 'gate'];
  let bSc = 0, bW = 0;
  ths.forEach(th => { const r = fight(th, 13.6, team(null)); bSc += r.score; if (r.won) bW++; });
  bSc = +(100 * bSc / ths.length).toFixed(1);
  const cands = ['weapon_warning','flametongue','dwarven_plate','plate_armor','ring_regeneration','amulet_health','cloak_displacement','sentinel_shield','sunblade','potion_healing'];
  const rows = cands.map(ik => {
    let sc = 0, w = 0;
    ths.forEach(th => { const r = fight(th, 13.6, team(ik)); sc += r.score; if (r.won) w++; });
    const avgSc = +(100 * sc / ths.length).toFixed(1);
    const lift = +(avgSc - bSc).toFixed(1);
    const it = ITEMS[ik];
    const cost = ECON.itemPrice[it.r] || 3;
    const kwMatch = !!(it.kwHooks && it.kwHooks.includes('action_surge'));
    return { item: ik, name: it.n, rarity: it.r, cost, kwMatch, winRate: +(100 * w / ths.length).toFixed(1), score: avgSc, lift, valPerGold: +(lift / cost).toFixed(2) };
  }).sort((a, b) => b.lift - a.lift || b.valPerGold - a.valPerGold);
  return { baseScore: bSc, baseWR: +(100 * bW / ths.length).toFixed(1), top: rows.slice(0, 5), bestValue: rows.slice().sort((a, b) => b.valPerGold - a.valPerGold).slice(0, 3), all: rows };
`)();
w2.items.gilthrax = gilthraxItems;

// Read H metadata for names/keywords
const heroMeta = new Function(engineCode + `
  const out = {};
  HERO_ORDER.forEach(k => {
    out[k] = { name: H[k].name, role: H[k].role, cls: H[k].cls, kw: Object.keys(H[k].kw || {}) };
  });
  return out;
`)();

// Curated accurate per-hero changelog, status, archetype, and live use case (grounded in full-balance.diff + live sims)
const HERO_NOTES = {
  arthur: {
    status: 'buff',
    archetype: 'Backline Sniper & Action Surge Trigger',
    useCase: 'Your premier multi-arrow on-hit carrier and Action Surge bridge. Draft Arthur to snipe fragile enemy summoners/healers from the back with Longbow Volley while proccing on-hit items (Frost Brand, Sun Blade, Flame Tongue) across multiple targets—and pair him with Zoe or Gilthrax to chain Action Surge loops.',
    changes: [
      { type: 'buff', text: 'Global Damage Role Buff: +12% base damage scaling (`u.dm × 1.12`) across all attacks and Volley arrows.' },
      { type: 'buff', text: 'Longbow Volley: each arrow now deals +3 flat bonus piercing damage (`2d6+3` / `2d8+3` on Nat 20).' }
    ]
  },
  bram: {
    status: 'buff',
    archetype: 'Stalwart Frontline & Emergency Burst Healer',
    useCase: 'Reliable Act 1–3 frontline anchor who buys time for glass-cannon carries with a boosted 146 HP pool and his once-per-fight Preserve Life Channel Divinity save. Bram shines alongside high-burst carries like Cinder or paired tanks like Sir Dane who let him soak spikes without dying before Preserve Life fires.',
    changes: [
      { type: 'buff', text: 'Base HP increased 132 → 146 (+14 HP) so he survives buffed Act 2–3 frontline burst.' },
      { type: 'global', text: '28s Overtime anti-stall decay (−15% Heal/Ward every 5s, max −60%) trims drawn-out attrition fights.' }
    ]
  },
  faelan: {
    status: 'nerf',
    archetype: 'Arcane Recovery Battery & Anti-Burst Warder',
    useCase: 'No longer a solo unlosable shield wall (dropped from #2 to middle of the pack), Faelan is now a dedicated Charge battery and burst-mitigation specialist. Draft him on Spell Battery alongside Action Surge / Arcane Recovery partners (Zoe, Gilthrax, Gains) and feed him Staff of Power or Ring of Spell Storing to turbocharge team casts.',
    changes: [
      { type: 'nerf', text: 'Arcane Ward base trimmed [14, 24, 30, 36] + 3×INT → [12, 18, 24, 28] + 2×INT, and max Ward cap reduced 75% → 55% Max HP.' },
      { type: 'nerf', text: 'High roll Charge refund cut 35% → 18%; Projected Ward Path multiplier trimmed 1.35× → 1.18×.' },
      { type: 'nerf', text: 'Arcane Recovery on Ward break reduced 20 → 12 Charge.' },
      { type: 'fix', text: 'Fixed double-counted `u.stats.ward` stat tracking bug.' },
      { type: 'global', text: 'Overtime decay (starting at 28s) reduces Ward generation in stall fights.' }
    ]
  },
  wallaby: {
    status: 'rebal',
    archetype: 'Backline Assassin & Burst Execute Rogue',
    useCase: 'A high-variance backline diver who jumps straight onto enemy archers, necromancers, and Battle Mages. Buffed Backstab dice (3d6–9d6), +1d6 passive Sneak Attack, and free shadow-evade on kill make him a lethal finisher—just give him one defensive or tempo item (Dwarven Plate, Amulet of Health, or Boots of Speed) so he survives the dive.',
    changes: [
      { type: 'buff', text: 'Global Damage Role Buff (+12% `u.dm`); Base HP increased 94 → 106; Shortsword flat damage 2 → 3.' },
      { type: 'buff', text: 'Backstab Sneak Attack dice buffed [2, 4, 6, 8]d6 → [3, 5, 7, 9]d6; passive Sneak Attack gains +1 bonus d6.' },
      { type: 'buff', text: 'Now gains Stealth Shadow Evade (halves next hit) automatically whenever he scores a kill.' },
      { type: 'nerf', text: 'Combat Gold cap tightened 12g → 8g per fight to keep economy healthy.' }
    ]
  },
  dane: {
    status: 'global',
    archetype: 'Aura Tank, Smite Enabler & 2×2 Colossus Scaler',
    useCase: 'The single most versatile frontline glue hero in the live meta. Sir Dane’s Paladin Aura protects both tanks and squishy carries, his Smites trigger Ally Smite hooks (Mother Laurel, Sun Blade), and completing his Quest transforms him into a Large 2×2 mounted tank. Pair him with almost any top carry or Zoe for consistent 80%+ win rates.',
    changes: [
      { type: 'global', text: 'No direct nerfs; benefits heavily from live meta shift toward faster fights where Aura + Smite burst outpace slow stall heals.' },
      { type: 'global', text: 'Indirectly impacted by global enemy scaling (+50% dmg/HP curve) and 28s Overtime Ward/Heal decay.' }
    ]
  },
  lorcan: {
    status: 'buff',
    archetype: 'Hunter’s Mark Boss-Melter & On-Hit Marksman',
    useCase: 'Mediocre naked, terrifying once geared. Lorcan’s reworked Hunter’s Mark now amplifies ALL party damage against the marked target by +22% while his own arrows proc +1d10+WIS bonus damage. Give him Ring of Spell Storing (instant Turn-1 Mark) or Oathbow and pair him with Zoe, Sir Dane, or Corvin to shred high-HP bosses like Owlbear and Brood Mother.',
    changes: [
      { type: 'buff', text: 'Global Damage Role Buff (+12% `u.dm`); Base HP increased 94 → 104; Longbow flat damage 2 → 3.' },
      { type: 'buff', text: 'Hunter’s Mark rework: Marked enemies now take +22% damage from the entire party, and Ranger bonus proc buffed 1d6+WIS → 1d10+WIS.' }
    ]
  },
  juniper: {
    status: 'nerf',
    archetype: 'Root/Poison Controller & Wild Shape Anchor',
    useCase: 'Even after Circle of the Land’s sustain nerfs, Juniper remains an S-tier control powerhouse (554 avg damage + constant Roots). Overgrowth locks down melee rushers while Poison ticks through high-AC tanks, and pairing her with Mother Laurel or Kaska forms the #1 tested Act 3 comp (Wild Shape Moon & Land, 100% WR).',
    changes: [
      { type: 'nerf', text: 'Circle of the Land Path now has a 1.0s internal cooldown, hits 2 allies (not whole party) at Tier IV, and trims heal (`4+WIS → 3+0.8×WIS`) and Ward (`0.8× → 0.45×`, cap `40% → 30%`).' },
      { type: 'global', text: '28s Overtime anti-stall decay applies to Circle of the Land heals and Wards.' }
    ]
  },
  rosalind: {
    status: 'buff',
    archetype: 'Inspired Flourish Hyper-Buffer & Roll Fixer',
    useCase: 'Reborn as a true offensive amplifier. Spending Rosalind’s Bardic Inspiration now triggers Inspired Flourish (+25% damage & +25% Haste for 4.5s) on top of +15/18 Charge and d20 roll boosting, while Vicious Mockery cuts enemy damage by −22% and Staggers. Draft her on Pass the Round beside high-impact casters/carries (Sir Dane, Cinder, Zark) and equip Horn of Valhalla or Pipes of Haunting.',
    changes: [
      { type: 'buff', text: 'New Inspired Flourish mechanic: any ally spending Bardic Inspiration gains +25% Damage & +25% Haste for 4.5s (CHA-scaled).' },
      { type: 'buff', text: 'Bardic Inspiration now also grants +15 Charge (Low/Mid) and +18 Charge (High) immediately on cast.' },
      { type: 'buff', text: 'Base HP buffed 90 → 102; Vicious Mockery buffed 1d6+1 (1.4s) → 1d8+2 (1.35s), enemy damage debuff −15% → −22%, and now applies Stagger.' }
    ]
  },
  cinder: {
    status: 'buff',
    archetype: 'AoE Burn Nuke & Metamagic Clump-Punisher',
    useCase: 'Your premier AoE boss-and-swarm sweeper who climbed sharply into A-tier. With buffed Fireball dice (3d6–8d6), faster Burn accumulation (55%), 2.2× Burn Detonation, and Wildfire shredding SR + applying Exposed on every Fireball, Cinder annihilates Wolf Packs, Blights, and Necromancers. Protect her with Sir Dane or Faelan and accelerate her first cast with Ring of Spell Storing.',
    changes: [
      { type: 'buff', text: 'Global Damage Role Buff (+12% `u.dm`).' },
      { type: 'buff', text: 'Fireball buffed [2, 4, 5, 7]d6 → [3, 5, 6, 8]d6 and Burn stacks [4, 7, 10, 14] → [5, 8, 12, 16]; Twinned Spell buffed 4d6 → 5d6.' },
      { type: 'buff', text: 'Nat 20 Burn Detonation multiplier raised 1.8× → 2.2× (min 12); global Fire element Burn feed increased 45% → 55%.' },
      { type: 'buff', text: 'Wildfire Path now applies Exposed + −2 SR shred on EVERY Fireball (not just Twinned Spell).' }
    ]
  },
  zark: {
    status: 'buff',
    archetype: 'Scaling Drain-Tank Barbarian & Rage Snowballer',
    useCase: 'A frontline bruiser who scales harder the longer he swings. Buffed Bear Rage (6% DR per stack + 10%/15% Max HP self-heal on High/Nat 20 Bear Cleave) fixes his old Act 2 fragility while Relentless Endurance absorbs lethal spikes. Pair Zark with Zoe (extra swings/Rage tempo) or Kaska (Pack Hunt sustain) and gear him with Sun Blade or Ring of Regeneration.',
    changes: [
      { type: 'buff', text: 'Bear Rage damage reduction buffed 4% → 6% per stack (cap adjusted to 55%).' },
      { type: 'buff', text: 'High Bear Cleave now restores 10% Max HP; Nat 20 restores 15% Max HP.' }
    ]
  },
  naill: {
    status: 'buff',
    archetype: 'Rapid Multi-Hit Ki Bruiser & On-Hit Disrupter',
    useCase: 'Now a genuine A-tier melee skirmisher whose 4-pip Ki bar hits like a truck (2d10 + 2×WIS + Stagger + free Alert stack). Because Naill triggers rapid strikes and double on-hit procs on Open Hand, he pairs explosively with Corvin/Lorcan (Hunter’s Mark +22% & First Strike) and Zoe, and dominates with Cloak of Displacement or Staff of Striking.',
    changes: [
      { type: 'buff', text: 'Global Damage Role Buff (+12% `u.dm`).' },
      { type: 'buff', text: 'Ki Strike (Open Hand) buffed from 1d8 + WIS → 2d10 + 2×WIS bludgeoning and now grants +1 Alert stack on every trigger.' }
    ]
  },
  nettle: {
    status: 'buff',
    archetype: 'Single-Target Hex Shredder & Pact Boon Battery',
    useCase: 'One of the biggest meta risers—delivering the highest average damage of any Support (624 avg dmg!). Reworked Hex adds 1d8/1d10 necrotic to EVERY allied hit on the cursed foe, while Pact Boon now feeds +16 Charge to Nettle and the killer plus heals the lowest-HP ally. Draft Nettle with sturdy tanks (Mother Laurel, Bram) and fast casters (Headband of Intellect / Staff of Power).',
    changes: [
      { type: 'buff', text: 'Hex on-hit necrotic proc buffed from d4 (T1) / d6 (T2+) → d8 (T1) / d10 (T2+) per stack.' },
      { type: 'buff', text: 'Pact Boon now restores +16 Charge to both Nettle and the killer, and heals the lowest-HP ally (`7 + 1.5×CHA`).' },
      { type: 'rebal', text: 'Jumping Hex party heal lightly trimmed (`5+CHA → 4+CHA`) to balance the new lowest-HP heal.' }
    ]
  },
  pillar: {
    status: 'rebal',
    archetype: 'Stone-Colossus Meatshield & Anti-Spike Tank',
    useCase: 'Pillar trades burst damage for sheer immovable bulk—Stone’s Endurance shaves flat damage off every heavy hit, and completing his Quest transforms him into a Large 2×2 Living Colossus that shields your entire backline. Pair him with high-output ranged carries like Cinder or Arthur and prioritize Ring of Regeneration or Plate Armor.',
    changes: [
      { type: 'fix', text: 'Fixed double-scaled `u.dm²` heal bug on Tier IV Living Beacon (added `{ raw: 1 }`).' },
      { type: 'global', text: 'Indirectly feels the tougher Act 2–3 enemy curve; thrives most once Quest 2×2 Colossus form + sustain gear come online.' }
    ]
  },
  mother_laurel: {
    status: 'nerf',
    archetype: 'Paladin/Druid Hybrid Tank & Root-Smite Engine',
    useCase: 'Fixed from a broken double-scaling heal bug into a still-strong A-tier synergy tank. Mother Laurel bridges Paladin Smite/Aura and Druid Root/Wild Shape engines: Bountiful Vines converts ally Smites and Wild Shapes into steady heals while punishing Rooted foes. Pair her with Kaska, Juniper, or Velith for one of the strongest mid-to-late shells in the game.',
    changes: [
      { type: 'fix', text: 'Fixed double-scaled `u.dm²` heal bug on Bloom ability (added `{ raw: 1 }`).' },
      { type: 'nerf', text: 'Bloom heal trimmed `18 + 4×WIS → 14 + 3×WIS`, Ward trimmed `22 + 3×WIS → 16 + 2×WIS` (cap 50% → 40%).' },
      { type: 'nerf', text: 'Bountiful Vines Path now has a 1.0s cooldown, reduced heal (`8+2×WIS → 6+1.5×WIS`), and heals 2 allies (not whole party) at Tier IV.' }
    ]
  },
  lumen: {
    status: 'rebal',
    archetype: 'Burn-Detonating Radiant Blaster & Execute Cleric',
    useCase: 'Lumen shines as a dedicated Burn-payoff and Channel Divinity finisher rather than a solo carry. On Purifying Light, Lumen turns ally Holy hits into Burn and detonates accumulated Burn for massive radiant AoE—making Cinder her undisputed #1 partner. Gear her with Scimitar of Speed, Wand of Fireballs, or Sun Blade to accelerate casts and executes.',
    changes: [
      { type: 'buff', text: 'Global Damage Role Buff (+12% `u.dm`).' },
      { type: 'fix', text: 'Fixed double-scaled `u.dm²` heal bug on Tier IV Purifying Light Burn detonation (added `{ raw: 1 }`).' }
    ]
  },
  jamison: {
    status: 'nerf',
    archetype: 'Damage-Reduction Bonder & d20 Consistency Support',
    useCase: 'A steady A-tier defensive support whose Good Vibes (−15% damage taken on Bonded allies) and Bonded d20 dice stabilize high-risk frontlines without turning fights into unkillable stalls. Draft Brother Jamison alongside Sir Dane or Zark when you need consistent High/Nat 20 rolls and damage mitigation against Act 3 bosses.',
    changes: [
      { type: 'fix', text: 'Fixed double-scaled `u.dm²` heal bug on Emboldening Bond cast (added `{ raw: 1 }`).' },
      { type: 'nerf', text: 'Channel Divinity Balm of Peace heal trimmed `18 + 4×CHA → 14 + 3×CHA`; Tier IV Peace & Radiance heal trimmed `12 → 10`.' },
      { type: 'global', text: '28s Overtime decay reins in long-fight healing output.' }
    ]
  },
  zoe: {
    status: 'nerf',
    archetype: 'Action Surge Accelerator & Item-Scaling Force Multiplier',
    useCase: 'Still the #1 individual hero in the live build—but now earned through offensive tempo instead of infinite sustain. Zoe turns your most-equipped ally into a hyper-carry via Action Surge, capped Runic Upgrades (+8% ×2), Haste, and Nat 20 item refreshes. Draft her with Sir Dane, Gilthrax, or Arthur and stack Charge speed (Staff of Power, Ring of Spell Storing, Headband of Intellect).',
    changes: [
      { type: 'fix', text: 'Fixed double-scaled `u.dm²` heal bug on Rummage (added `{ raw: 1 }`).' },
      { type: 'nerf', text: 'Rummage heal cut `[18, 28, 32, 36]+3×INT → [8, 12, 16, 20]+2×INT`, Ward cut `25+4×INT → 16+2×INT` (cap 50% → 35%), Charge 15 → 12, Nat 20 Gold 2g → 1g.' },
      { type: 'nerf', text: 'Runic Upgrade capped at max 2 stacks of +8% damage (was uncapped +12% per High roll).' },
      { type: 'nerf', text: 'Just the Thing Path Action Surge Ward reduced (`16+2×INT → 10+INT`, cap 35%, Charge 12 → 10) with a 1.0s cooldown.' }
    ]
  },
  toot: {
    status: 'rebal',
    archetype: 'Economy Engine & Inspired Flourish Bard',
    useCase: 'Toot is a pure economy-and-tempo investment, not a raw combat stat-stick (lowest solo score at 29.2, yet drives the 80% WR Pack 5 Market Cartel full-run strat!). Early Tip Jar + Mote gold buys extra Tier upgrades and Very Rare items by Act 3, while spending Motes now triggers Inspired Flourish (+25% dmg & Haste). Pair with Gilthrax, Sir Dane, or Zoe.',
    changes: [
      { type: 'buff', text: 'Benefits from new Inspired Flourish mechanic (+25% Damage & +25% Haste for 4.5s whenever an ally spends a Bardic Mote).' },
      { type: 'nerf', text: 'Combat Gold cap tightened 14g → 6g per fight so Pack 5 Greed stays strong without breaking the shop economy.' }
    ]
  },
  gilthrax: {
    status: 'nerf',
    archetype: 'Item-Scaling Shield Tank & Action Surge Anchor',
    useCase: 'Despite targeted Ward and gold-cap nerfs, Gilthrax remains an S-tier frontline carry (532 avg dmg + 248 Ward!). Hoard Scales rewards loading him with 3–4 items, Arcane Shield feeds Action Surge counters into Zoe/Arthur, and Arcane Reflect punishes fast attackers. Pair him with Zoe or Faelan (Arcane Recovery Battery hits 91.7% Act 3 WR!).',
    changes: [
      { type: 'nerf', text: 'Arcane Shield base Ward cut [28, 42, 56, 70] → [22, 34, 46, 58], per-item bonus [10, 12, 15, 18] → [8, 10, 12, 14], CON scaling 5× → 4×, cap 90% → 65% Max HP.' },
      { type: 'nerf', text: 'Arcane Reflect duration reduced 4s → 3s; Tier IV Bodyguard’s Fee ally Ward trimmed 35% → 30% (cap 40%).' },
      { type: 'nerf', text: 'Combat Gold cap reduced 10g → 6g per fight.' }
    ]
  },
  gains: {
    status: 'rebal',
    archetype: 'Late-Run Gold-Hoarding Arcane Artillery',
    useCase: 'Gains scales with your unspent bankroll and Arcane Recovery tempo. In bare-bones midgame tests he looks modest (32.7), but inside Pack 5 Market Cartel or Arcane Recovery Battery (with Faelan + Gilthrax + Zoe, 91.7% Act 3 WR!) he snowballs into devastating burst. Equip Scimitar of Speed, Boots of Speed, or Robe of Stars to supercharge his output.',
    changes: [
      { type: 'buff', text: 'Global Damage Role Buff (+12% `u.dm`).' },
      { type: 'nerf', text: 'Combat Gold cap tightened 12g → 6g per fight.' }
    ]
  },
  velith: {
    status: 'buff',
    archetype: 'Premier Melee Assassin & Poison/Exposed Finisher',
    useCase: 'The #1 Damage hero in the live meta (#2 overall at 47.5, 541 avg dmg!). Velith combines stealth ambush openings, buffed passive Sneak Attack (+1d6), and Nightshade Poison scaling to erase high-priority targets before enemy waves overwhelm you. Pair her with Corvin, Kaska, or Sir Dane, and equip Dagger of Venom or Dwarven Plate to turn her into an unstoppable carry.',
    changes: [
      { type: 'buff', text: 'Global Damage Role Buff (+12% `u.dm`).' },
      { type: 'buff', text: 'Passive Sneak Attack trigger upgraded by +1 bonus d6 piercing damage.' }
    ]
  },
  corvin: {
    status: 'buff',
    archetype: 'Melee Hunter’s Mark Skirmisher & Exposed Flanker',
    useCase: 'Corvin is the premier melee enabler for on-hit and ambush comps. His First Strike Path spreads Hunter’s Mark (+22% party damage + 1d10+WIS Ranger proc) right at fight start—turning Naill (100% pair WR!), Velith (75% pair WR), and Lorcan into shredding machines. Give him Dagger of Venom, Cloak of Displacement, or Boots of Speed to keep him swinging safely.',
    changes: [
      { type: 'buff', text: 'Global Damage Role Buff (+12% `u.dm`).' },
      { type: 'buff', text: 'Hunter’s Mark rework: Marked foes take +22% damage from all allies, and Ranger bonus proc buffed 1d6+WIS → 1d10+WIS.' }
    ]
  },
  saint: {
    status: 'rebal',
    archetype: 'Anti-Heal Necrosis Bell & Duplicity Disruptor',
    useCase: 'A tactical counter-pick specialist against healing/summoner encounters (Raiders, Necromancer, Brood Mother). Buffed HP (108), faster Bell attacks, and heavier Necrosis stacks ([4, 10, 16, 22]) let Saint shut down enemy recovery while Illusory Double absorbs lethal boss hits. Pair with Sir Dane or Velith and boost Charge with Staff of Power or Horn of Valhalla.',
    changes: [
      { type: 'buff', text: 'Base HP buffed 96 → 108; Bell of Passing flat dmg 1 → 2 and faster interval 1.4s → 1.35s.' },
      { type: 'buff', text: 'Toll the Dead Necrosis stacks buffed [0, 6, 12, 16] → [4, 10, 16, 22].' },
      { type: 'fix', text: 'Fixed double-scaled `u.dm²` heal bug on Nat 20 party heal (added `{ raw: 1 }`).' }
    ]
  },
  kaska: {
    status: 'nerf',
    archetype: 'Exposed-Spreading Bruiser Support & Wild Shape Anchor',
    useCase: 'Even after Panther Beast HP and Pack Hunt nerfs, Kaska holds S-tier (#4 overall at 43.6) because Exposed + Wild Shape + frontline disruption fits almost every aggressive squad. Pack Hunt turns Velith (100% pair WR!), Arthur, and Zark into drain-bruisers, while pairing with Mother Laurel & Juniper unlocks the #1 Act 3 comp. Best gear: Staff of Healing & Staff of the Woodlands.',
    changes: [
      { type: 'fix', text: 'Fixed double-scaled `u.dm²` heal bug on Pounce self-heal and Nat 20 party heal (added `{ raw: 1 }`).' },
      { type: 'nerf', text: 'Panther Form Beast HP reduced 40% → 32% Max HP (Lunar Resilience 55% → 44%); Tier IV Lunar Ward 26 → 20 (cap 40%).' },
      { type: 'nerf', text: 'Pack Hunt Path trimmed from 10 HP + 10 Charge (1.0s CD) → 7 HP + 8 Charge (1.2s CD).' },
      { type: 'nerf', text: 'Pounce self-heal trimmed `22+4×WIS → 18+3×WIS`; Nat 20 party heal trimmed `24+4×WIS → 20+3×WIS`.' }
    ]
  }
};

function explainPairing(h1, h2, sharedKw) {
  const pairSet = new Set([h1, h2]);
  const has = (a, b) => pairSet.has(a) && pairSet.has(b);
  if (has('cinder', 'lumen')) return 'Cinder floods the board with Burn while Lumen (Purifying Light) detonates it for massive radiant AoE.';
  if (has('juniper', 'mother_laurel')) return 'Juniper’s Roots & Wild Shapes constantly trigger Mother Laurel’s Bountiful Vines Smite damage and heals.';
  if (has('juniper', 'kaska')) return 'Double Wild Shape triggers Circle of the Land heals/Wards while Kaska Exposes Rooted foes.';
  if (has('mother_laurel', 'kaska')) return 'Kaska’s Wild Shapes trigger Bountiful Vines while Pack Hunt sustains Laurel’s melee frontline.';
  if (has('kaska', 'velith')) return 'Kaska spreads Exposed onto targets so Velith’s Ambush & Sneak Attacks melt backlines while healing via Pack Hunt.';
  if (has('corvin', 'naill')) return 'Corvin’s First Strike applies Hunter’s Mark (+22% team dmg) that multiplies every rapid Ki strike from Naill.';
  if (has('corvin', 'velith')) return 'Corvin marks and Exposes frontline/midline targets for Velith’s Poison & Sneak Attack executes.';
  if (has('corvin', 'lorcan')) return 'Double Ranger Hunter’s Mark keeps +22% team-wide amplification and 1d10+WIS procs active all fight.';
  if (has('zoe', 'gilthrax')) return 'Shared Action Surge loop: Gilthrax’s item-loaded Ward triggers Action Surge counters & Zoe’s Runic Upgrades.';
  if (has('zoe', 'arthur')) return 'Shared Action Surge loop: Zoe turbocharges Arthur’s multi-arrow Volleys with Haste, Charge, and free attacks.';
  if (has('zoe', 'dane')) return 'Sir Dane’s Aura keeps Zoe alive while Zoe’s Action Surge & Runic Upgrade accelerate Dane’s Smites and Quest.';
  if (has('faelan', 'gains')) return 'Shared Arcane Recovery engine feeds constant Charge into Gains’s Gilded Beam bursts.';
  if (has('faelan', 'gilthrax')) return 'Layered Wards keep Gilthrax topped off while broken Wards feed Faelan’s Spell Battery Charge back into the party.';
  if (has('faelan', 'zoe')) return 'Zoe’s Haste/Charge speeds up Faelan’s Wards while Spell Battery loops Zoe’s Rummage & Action Surges.';
  if (has('dane', 'cinder')) return 'Sir Dane’s Aura & Taunt clump enemies safely in front so Cinder’s Fireballs hit maximum targets.';
  if (has('dane', 'jamison')) return 'Stacked Aura + Good Vibes (−15% dmg taken) + Bonded d20 dice create an ultra-reliable frontline core.';
  if (has('zark', 'kaska')) return 'Kaska’s Exposed + Pack Hunt fuels Zark’s Rage cleaves with bonus sustain and faster Charge.';
  if (has('toot', 'gilthrax')) return 'Pack 5 economy duo: Toot’s gold + Motes (Inspired Flourish) buy extra items that directly scale Gilthrax’s Hoard Scales.';
  if (has('velith', 'wallaby')) return 'Double Sneak Attack / Cunning Action dive shreds enemy backlines before summoners or healers can cast.';
  if (has('bram', 'cinder')) return 'Bram’s 146 HP frontline + Preserve Life burst heal guarantees Cinder lives long enough to detonate Burn.';
  if (has('pillar', 'cinder')) return 'Pillar’s Stone’s Endurance & 2×2 Colossus body clumps enemies cleanly for Cinder’s Fireballs.';
  if (has('arthur', 'naill')) return 'Dual high-tempo on-hit strikers: Arthur Exposes backlines while Naill Staggers and disrupts the front.';
  if (has('lorcan', 'zoe')) return 'Zoe’s Runic Upgrade, Haste, and Action Surge multiply Lorcan’s Hunter’s Mark arrows and Colossus Slayer procs.';
  if (sharedKw && sharedKw.length) return `Shared ${sharedKw.map(x => x.replace(/_/g, ' ')).join(' & ')} keyword engine amplifies both heroes’ triggers.`;
  const r1 = heroMeta[h1].role, r2 = heroMeta[h2].role;
  if (r1 !== r2) return `Strong ${r1}/${r2} role synergy balancing frontline survivability with live burst tempo.`;
  return `High-tempo ${r1} duo whose kits cover each other’s scaling curves through Act 3.`;
}

// Compute baseline rankings
const baseSorted = baseA.heroes.slice().sort((a, b) => b.combScore - a.combScore);
const baseRankMap = Object.fromEntries(baseSorted.map((h, i) => [h.key, i + 1]));
const baseDataMap = Object.fromEntries(baseA.heroes.map(h => [h.key, h]));
const pathMap = Object.fromEntries(w1.paths.map(p => [p.key, p]));

const heroesOut = {};
w1.heroes.forEach((h, idx) => {
  const k = h.key;
  const b = baseDataMap[k] || {};
  const baseScore = b.combScore != null ? +(b.combScore * 100).toFixed(1) : null;
  const baseWR = b.combWR != null ? +b.combWR.toFixed(1) : null;
  const liveRank = idx + 1;
  const baseRank = baseRankMap[k] || liveRank;
  const note = HERO_NOTES[k] || { status: 'global', archetype: h.role, useCase: '', changes: [] };
  const pObj = pathMap[k] || { p0: {}, p1: {}, winner: 'Even' };
  const partners = (w2.partners[k] && w2.partners[k].top || []).slice(0, 4).map(p => ({
    ...p,
    why: explainPairing(k, p.partner, p.sharedKw)
  }));
  const itInfo = w2.items[k] || { top: [], bestValue: [] };

  heroesOut[k] = {
    ...h,
    liveRank,
    baseRank,
    rankDelta: baseRank - liveRank, // positive = climbed ranks!
    baseScore,
    baseWR,
    scoreDelta: baseScore != null ? +(h.avgScore - baseScore).toFixed(1) : 0,
    wrDelta: baseWR != null ? +(h.avgWR - baseWR).toFixed(1) : 0,
    changeStatus: note.status,
    archetype: note.archetype,
    useCase: note.useCase,
    changes: note.changes,
    paths: pObj,
    bestPartners: partners,
    bestItems: itInfo.top.slice(0, 4),
    bestValueItems: itInfo.bestValue.slice(0, 3)
  };
});

// Build top carriers per item from w2.items across all 24 heroes + sim-b synergy carrier
const itemCarrierAcc = {};
Object.entries(w2.items).forEach(([hk, info]) => {
  (info.all || []).forEach(row => {
    if (!itemCarrierAcc[row.item]) itemCarrierAcc[row.item] = [];
    itemCarrierAcc[row.item].push({ hero: hk, name: heroMeta[hk].name, lift: row.lift, kwMatch: row.kwMatch });
  });
});

const itemsOut = baseB.items.map(it => {
  const tested = (itemCarrierAcc[it.key] || []).slice().sort((a, b) => (b.kwMatch ? 1 : 0) - (a.kwMatch ? 1 : 0) || b.lift - a.lift);
  const topCarriers = tested.filter(x => x.lift > 0).slice(0, 3);
  if (!topCarriers.length && it.synCarrier && heroMeta[it.synCarrier]) {
    topCarriers.push({ hero: it.synCarrier, name: heroMeta[it.synCarrier].name, lift: +(it.bestDelta * 100).toFixed(1), kwMatch: true });
  }
  return {
    key: it.key,
    name: it.name,
    rarity: it.rarity,
    r: it.r,
    price: it.price,
    kwHooks: it.kwHooks || [],
    bestDelta: it.bestDelta,
    valPerGold: it.valPerGold,
    topCarriers
  };
});

// Full-run bot comparison Before vs Live
const beforeBots = Object.fromEntries(baseB.fullRuns.botSummary.map(b => [b.id, b]));
const botsOut = postB.fullRuns.botSummary.map(b => ({
  id: b.id,
  label: b.label,
  beforeWR: beforeBots[b.id] ? beforeBots[b.id].winRate : 0,
  liveWR: b.winRate,
  piggyBreak: b.piggyBreakRate,
  avgGold: b.avgTotalGold,
  avgWins: b.avgWins
}));

const globalChanges = {
  combat: [
    { type: 'buff', tag: 'Damage +12%', text: 'All Damage-role heroes receive +12% base damage scaling (`u.dm × 1.12`) so offensive carries compete with sustain.' },
    { type: 'buff', tag: 'Hunter’s Mark', text: 'Marked enemies now take +22% damage from the entire party, and Ranger bonus damage buffed 1d6+WIS → 1d10+WIS.' },
    { type: 'buff', tag: 'Inspired Flourish', text: 'Spending Bardic Inspiration (Rosalind or Toot) now grants +25% Damage & +25% Haste for 4.5s (CHA-scaled).' },
    { type: 'buff', tag: 'Sneak Attack & Fire', text: 'Passive Sneak Attack gains +1 bonus d6; Fire element Burn accumulation boosted 45% → 55%.' },
    { type: 'nerf', tag: 'Overtime 28s', text: 'Overtime begins at 28s (was 40s), stepping every 5s: Heal & Ward effectiveness decay −15% per stack (up to −60%) to end infinite stall comps.' },
    { type: 'fix', tag: '7 Heal Bugfixes', text: 'Fixed 7 double-scaled `u.dm²` heals missing `{ raw: 1 }` (Mother Laurel, Kaska, Jamison, Saint, Lumen, Pillar, Zoe) plus Faelan’s duplicate Ward counter.' }
  ],
  enemy: [
    { type: 'buff', tag: 'Enemy Curve', text: 'Scaling buffed across all 3 Acts: `CURVE.grow` 1.21 → 1.225, `CURVE.dmgGrow` 1.22 → 1.28, `ease` [0.56..1.24] → [0.95..1.46], opening fight `d=1` eased penalty removed (.75/.70 → .96/.95).' },
    { type: 'buff', tag: 'Bosses & Elites', text: 'Act Boss depths raised [7.5, 12.0, 15.8] → [8.2, 13.0, 17.5]; Elites raised +1.3 depth & 1.26× scaling; War Band (`orcs`) threat mult buffed 0.81 → 0.96, Owlbear 0.80 → 0.87, Brood Mother 0.73 → 0.78.' },
    { type: 'nerf', tag: 'Shop Economy', text: 'Win gold tightened `6+d/4 → 5+d/5`, Hero prices `[3,5,8,12] → [3,6,9,13]`, Elite bonus 4g → 3g, Campfire Forage 6g → 4g, and Pack 5 combat gold caps tightened (6g–8g).' }
  ]
};

const finalMeta = {
  version: '0.22 Live Balance',
  generatedAt: '2026-11-21',
  heroes: heroesOut,
  items: itemsOut,
  comps: w1.comps,
  bots: botsOut,
  globalChanges
};

fs.mkdirSync(path.join(root, 'data'), { recursive: true });
const jsContent = `/* Auto-generated live meta telemetry & changelog for tools/wiki.html */\nwindow.WIKI_META = ${JSON.stringify(finalMeta, null, 2)};\n`;
fs.writeFileSync(path.join(root, 'data/wiki-meta-stats.js'), jsContent);
console.log('Wrote data/wiki-meta-stats.js:', (jsContent.length / 1024).toFixed(1), 'KB');
console.log('Gilthrax calibrated items:', gilthraxItems.top.slice(0, 4).map(x => `${x.name}(+${x.lift})`).join(', '));
console.log('Biggest rank climbers:', Object.values(heroesOut).sort((a,b) => b.rankDelta - a.rankDelta).slice(0,5).map(h => `${h.name}(#${h.baseRank}->#${h.liveRank}, +${h.rankDelta})`).join(', '));
console.log('Biggest rank drops:', Object.values(heroesOut).sort((a,b) => a.rankDelta - b.rankDelta).slice(0,5).map(h => `${h.name}(#${h.baseRank}->#${h.liveRank}, ${h.rankDelta})`).join(', '));
