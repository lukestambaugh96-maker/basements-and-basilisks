/**
 * build-wiki-data.mjs — Live v0.23 Simulation & Field Guide Telemetry Builder.
 * Runs deterministic headless v0.23 benchmarks across all 24 reworked heroes, 48 Specializations,
 * 82 six-tier items, 12 signature comps, 10 rotating Act bosses, and 5 campaign personas,
 * then writes data/wiki-meta-stats.js powering tools/wiki.html.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const engineCode = [
  'src/01-geo.js', 'src/02-enemies.js', 'src/03-heroes.js',
  'src/04-items.js', 'src/05-engine.js', 'src/06-adventure.js',
].map(f => fs.readFileSync(path.join(root, f), 'utf8')).join('\n');

// Load v0.22 rank baseline if present for rank-delta comparison
let v022BaseRank = {};
let v022BaseScore = {};
try {
  const prev = JSON.parse(fs.readFileSync(path.join(root, 'data/v0.22-meta/wiki-sim-1.json'), 'utf8'));
  (prev.heroes || []).forEach((h, i) => {
    v022BaseRank[h.key] = i + 1;
    v022BaseScore[h.key] = h.avgScore;
  });
} catch {}

const HERO_NOTES = {
  arthur: {
    status: 'rebal',
    archetype: 'Evasion Duelist & Action Surge Counter-Striker',
    useCase: 'Rebuilt around v0.23 Universal Evasion and Action Surge counter-strikes. Every time Arthur dodges an attack, he fires a free Longsword strike—stack multiplicative Evasion (Constant Vigilance + Cloak of Displacement + Boots of Speed) and let him shred frontlines while triggering Ally Action Surge hooks with Zoe and Gilthrax.',
    changes: [
      { type: 'rebal', text: 'Reworked into melee Longsword + Longbow Volley Evasion Fighter; every Evade triggers an immediate Action Surge counter-strike.' },
      { type: 'buff', text: 'Specializations streamlined to 1-line rules: `Constant Vigilance` (+15% Evasion) and `Deadeye` (Volley fires +1 extra arrow).' },
      { type: 'rebal', text: 'Opt-in Quest (`Flame Gauntlet`): Evade 12 attacks to replace Longbow Volley with a frontline fire cone + Burn.' }
    ]
  },
  bram: {
    status: 'rebal',
    archetype: 'Stalwart Frontline & Channel Divinity Burst Healer',
    useCase: 'Classic Life Cleric frontline anchor whose Preserve Life spikes your entire squad back from the brink when an ally drops below 40% HP. Pair Bram with high-output carries (Cinder, Gains, Velith) and equip Heavy Armor or Devotee’s Censer to amplify his Channel Divinity burst.',
    changes: [
      { type: 'rebal', text: 'Card simplified to strict progressive disclosure; `Channel Divinity` fires Preserve Life automatically below 40% HP.' },
      { type: 'buff', text: 'Specializations: `Blessed Healer` (self-heal 50% of heals cast) and `Radiant Shield` (grant Ward on overheal).' },
      { type: 'global', text: 'Benefits from Cubed AC/SR (`K=14`), making Plate Armor & Shield upgrades noticeably tankier.' }
    ]
  },
  faelan: {
    status: 'rebal',
    archetype: 'Arcane Recovery Battery & Projected Ward Wizard',
    useCase: 'Your premier Ward-and-Charge engine. Whenever Faelan’s Arcane Ward breaks, Arcane Recovery fuels his next cast—making him an ideal partner for Gains, Zoe, and Gilthrax. Choose `Spell Battery` to feed Charge to allies or `Projected Ward` to protect fragile carries against Act 3 boss nukes.',
    changes: [
      { type: 'rebal', text: 'Clean v0.23 Arcane Recovery loop: broken Wards restore Charge to keep casting smoothly without stalling.' },
      { type: 'buff', text: 'Specializations trimmed to 1-line choices (`Projected Ward` / `Spell Battery`); scales naturally with INT Charge speed and Spell Pen.' }
    ]
  },
  wallaby: {
    status: 'buff',
    archetype: 'Backline Assassin & Class-Bypassing Thief',
    useCase: 'High-impact backline diver who leaps behind Act 2–3 shield walls to assassinate casters and summoners. His v0.23 `Use Magic Device` trait lets him equip ANY of the 24 Curio Unique items regardless of class lock, and his Quest (`Bag of Holding`) unlocks a 4th item slot!',
    changes: [
      { type: 'buff', text: 'New Thief passive (`Use Magic Device`): Wallaby bypasses class locks on all 24 Curio Unique items!' },
      { type: 'buff', text: 'Evasion synergy: benefits multiplicatively from Boots/Cloak/Ring evasion stacking while diving backlines.' },
      { type: 'rebal', text: 'Opt-in Quest (`Bag of Holding`): open a 4th equipment slot after stealing gold in combat.' }
    ]
  },
  dane: {
    status: 'rebal',
    archetype: 'Aura Tank, Radiant Smite Anchor & 2×2 Mount Scaler',
    useCase: 'The gold-standard Paladin frontline anchor. Sir Dane’s Aura adds +AC/+SR directly inside the Cubed AC/SR sweet spot, while his Divine Smite deals **Radiant true damage** that bypasses high-AC Act 2–3 bosses like Giant Crab, Orcus, and Tiamat completely.',
    changes: [
      { type: 'buff', text: 'Divine Smite now deals true **Radiant** damage, bypassing both AC and SR on heavily armored bosses.' },
      { type: 'rebal', text: 'Aura of Protection shines on the Cubed AC/SR curve (`K=14`), turning +2 AC/SR into massive effective HP.' },
      { type: 'rebal', text: 'Opt-in Quest (`Find Steed`): transforms Sir Dane into a Large 2×2 mounted colossus.' }
    ]
  },
  lorcan: {
    status: 'buff',
    archetype: 'Hunter’s Mark Boss-Melter & Ranged On-Hit Carry',
    useCase: 'Your premier single-target boss shredder. Lorcan applies Hunter’s Mark (+1d4 bonus damage from EVERY allied hit) and stacks Colossus Slayer / on-hit procs—pair him with rapid-hit allies (Naill, Corvin, Arthur) and grab Hunter’s Mark Curio Uniques or Oathbow.',
    changes: [
      { type: 'buff', text: 'Hunter’s Mark unified across Rangers: marked foes take stacking +1d4 bonus damage from every hit.' },
      { type: 'rebal', text: 'Streamlined 1-line Specializations (`Colossus Slayer` vs `Volley Master`) and opt-in Trophy Hunter Quest.' }
    ]
  },
  juniper: {
    status: 'rebal',
    archetype: 'Root/Poison Controller & Wild Shape Anchor',
    useCase: 'Versatile Druid controller who locks melee rushers in place with Entangle Roots while Poison ticks through high AC. Pairs naturally with Mother Laurel and Kaska to trigger Wild Shape engines and shines on Act 2–3 choke maps.',
    changes: [
      { type: 'rebal', text: 'Unified under canonical `Wild Shape` keyword with clean 1-line `Circle of the Land` / `Circle of Spores` Specializations.' },
      { type: 'global', text: 'Poison bypasses Cubed AC/SR armor scaling, keeping Juniper dangerous into Act 3.' }
    ]
  },
  rosalind: {
    status: 'buff',
    archetype: 'Spatial Closest-Ally Buffer & Bardic Inspiration Engine',
    useCase: 'Positioning matters! Rosalind’s Bardic Inspiration targets her **closest ally** (previewed with dashed gold lines during Tactical Deployment), granting Inspired Flourish (+Damage & +Haste) and d20 roll boosts right onto your chosen hyper-carry.',
    changes: [
      { type: 'buff', text: 'Spatial targeting (`closest_ally`): position Rosalind beside your chosen carry with live deployment preview lines.' },
      { type: 'rebal', text: 'Clean 1-line Specializations (`Pass the Round` vs `Cutting Words`) and Bardic Inspiration keyword hooks.' }
    ]
  },
  cinder: {
    status: 'buff',
    archetype: 'Metamagic Fireball Nuke & Burn AoE Sweeper',
    useCase: 'Premier AoE blaster who punishes enemy clumps across Phandalin and White Plume Mountain, and melts high-AC foes with Burn and Spell Pen. Pair with Lumen or Nettle to chain Burn/Hex detonations, and prioritize Spell Pen + INT Charge gear.',
    changes: [
      { type: 'buff', text: 'Unified under canonical `Metamagic` keyword with clean 1-line `Wildfire` / `Twinned Spell` Specializations.' },
      { type: 'global', text: 'Spell Pen items (Circlet of Blasting, Wand of the War Mage, Robe of the Archmagi) dramatically boost Fireball against Act 3 SR 16–17 bosses.' }
    ]
  },
  zark: {
    status: 'buff',
    archetype: 'Bear Rage Frontline Bruiser & Relentless Endurance Tank',
    useCase: 'Unstoppable melee brawler who gets deadlier the longer he fights. Zark’s `Relentless Endurance` sits at priority #2 in v0.23’s Lethal-Revive order (survives fatal hits at 1 HP!), and `Bear Rage` stacks physical mitigation + self-heal cleaves.',
    changes: [
      { type: 'buff', text: 'Unified under `Rage` keyword; `Relentless Endurance` obeys exact v0.23 Lethal-Revive priority (survives at 1 HP).' },
      { type: 'rebal', text: '1-line Specializations (`Totem of the Bear` / `Reckless Cleave`) and opt-in Quest.' }
    ]
  },
  naill: {
    status: 'buff',
    archetype: 'Rapid Multi-Hit Ki Bruiser & Stagger Disrupter',
    useCase: 'Lightning-fast melee Monk who racks up 4-pip Ki combos and procs Hunter’s Mark / Hex / on-hit weapons faster than anyone else in the cast. Pair with Corvin, Lorcan, or Nettle, and gear him with Evasion + DEX speed items.',
    changes: [
      { type: 'buff', text: 'Unified under canonical `Ki` keyword with clean Evasion + Stagger tempo.' },
      { type: 'rebal', text: '1-line Specializations (`Open Hand` / `Drunken Sway` +Evasion) and opt-in Quest.' }
    ]
  },
  nettle: {
    status: 'buff',
    archetype: 'Infernal Hex Shredder & Hellfire Warlock',
    useCase: 'Reworked into an Infernal Pact Hex caster who curses priority targets so every allied hit deals bonus necrotic damage, then unleashes Hellfire & Pact Boon Charge/heal surges when cursed foes fall. Devastating alongside rapid attackers (Naill, Corvin, Arthur).',
    changes: [
      { type: 'buff', text: 'Reworked kit: Infernal Hex + Hellfire burst + Pact Boon Charge/heal trigger on cursed enemy death.' },
      { type: 'rebal', text: 'Unified under canonical `Eldritch Pact` keyword with clean 1-line Specializations.' }
    ]
  },
  pillar: {
    status: 'rebal',
    archetype: 'Stone-Colossus Meatshield & Anti-Spike Tank',
    useCase: 'Immovable Goliath tank whose Stone’s Endurance shaves flat damage off heavy Act 2–3 boss blows, and whose opt-in Quest transforms him into a Large 2×2 Living Colossus that shields your entire backline.',
    changes: [
      { type: 'rebal', text: 'Unified under `Rage` / Stone’s Endurance with Cubed AC/SR synergy; armor & HP gear scale dramatically on him.' },
      { type: 'rebal', text: '1-line Specializations (`Stone Bulwark` / `Earthshaker`) and opt-in 2×2 Colossus Quest.' }
    ]
  },
  mother_laurel: {
    status: 'rebal',
    archetype: 'Melee Cleave Drain Tank (Paladin / Druid Hybrid)',
    useCase: 'Rebuilt in v0.23 as a true **Range 1 Melee Cleave Drain Tank** who swings thorny sweeps across adjacent enemies, heals through Bloom, and bridges Paladin `Smite` + Druid `Wild Shape` synergy hooks. Pair with Sir Dane, Juniper, or Kaska.',
    changes: [
      { type: 'rebal', text: 'Reworked to Range 1 melee cleave tank with thorny sweeps, Radiant Smite hooks, and Wild Shape synergy.' },
      { type: 'rebal', text: 'Streamlined 1-line Specializations (`Bountiful Vines` / `Thorn Cleave`) with zero text bloat.' }
    ]
  },
  lumen: {
    status: 'rebal',
    archetype: 'Celestial Warlock (`CHA/CHA`) & Radiant True-Damage Blaster',
    useCase: 'Completely reworked in v0.23 into a **Celestial Warlock** (`CHA/CHA`) wielding **Radiant true damage** that cuts straight through Giant Crab’s AC 17 and Act 3 Boss resistances while triggering `Eldritch Pact` + Burn detonations alongside Cinder and Nettle!',
    changes: [
      { type: 'rebal', text: 'Reworked class & scaling to Celestial Warlock (`CHA/CHA`, `Eldritch Pact` keyword) firing Radiant true damage.' },
      { type: 'buff', text: 'Radiant damage bypasses both AC and SR on the v0.23 Cubed defense curve.' }
    ]
  },
  jamison: {
    status: 'rebal',
    archetype: 'Spatial Closest-Ally Bonder & Channel Divinity Support',
    useCase: 'Position Brother Jamison right next to your main tank or carry (shown via live dashed targeting lines on Deployment!): Emboldening Bond grants Good Vibes damage reduction + d20 consistency, while Balm of Peace keeps frontlines standing through Act 3 bosses.',
    changes: [
      { type: 'buff', text: 'Spatial targeting (`closest_ally`): Emboldening Bond reliably anchors to your chosen adjacent ally.' },
      { type: 'rebal', text: 'Unified under `Channel Divinity` with crisp 1-line Specializations and opt-in Quest.' }
    ]
  },
  zoe: {
    status: 'rebal',
    archetype: 'Artificer Action-Surge Accelerator & Rummage Crafter',
    useCase: 'High-tempo support Artificer whose v0.23 `Rummage` tosses **any random Common item** from the 12-item Common pool onto an ally for the fight (doubled by `Rune Carver`!), while triggering `Action Surge` loops with Gilthrax and Arthur.',
    changes: [
      { type: 'rebal', text: 'Reworked `Rummage`: tosses a random Common item from the full 12-item Common pool (+1 extra with `Rune Carver`).' },
      { type: 'rebal', text: 'Unified under `Action Surge` with clean 1-line Specializations (`Just the Thing` / `Rune Carver`).' }
    ]
  },
  toot: {
    status: 'rebal',
    archetype: 'Stationary Musician (`0 ft`), Bounty Mote Bard & Economy Engine',
    useCase: 'Reworked in v0.23 into a **stationary (`ft: 0`), 0-damage musician** who plants in the backline, plays closest-ally Bardic Inspiration Motes (previewed during Deployment!), and generates combat bounty gold to fund Curio Uniques and Tier IV upgrades.',
    changes: [
      { type: 'rebal', text: 'Reworked to stationary (`ft: 0`), 0-damage Brass Solo musician targeting closest ally with bounty Motes.' },
      { type: 'rebal', text: 'Drives Pack 5 economy synergy cleanly alongside Gilthrax & Gains without infinite gold exploits.' }
    ]
  },
  gilthrax: {
    status: 'rebal',
    archetype: 'Item-Value Ward Tank & Gold Dragon Fire-Breath Fighter',
    useCase: 'Hoard-scaled Dragonborn tank whose Arcane Shield scales directly with the **gold value/rarity** of his equipped items! When his Ward breaks, he triggers `Action Surge` to breathe **Gold Dragon Fire + Burn** across enemies equal to absorbed damage.',
    changes: [
      { type: 'rebal', text: 'Reworked Ward scaling to item gold value/rarity; broken Ward triggers Action Surge Gold Dragon Fire Breath.' },
      { type: 'rebal', text: 'Bridges Pack 5 economy with `Action Surge` partners (Zoe, Arthur) and Burn allies (Cinder, Lumen).' }
    ]
  },
  gains: {
    status: 'rebal',
    archetype: 'Slow Gold-Bolt Heavy-CD Wizard & Arcane Recovery Artillery',
    useCase: 'Rebuilt as a deliberate, hard-hitting **slow Gold-bolt heavy-CD Wizard** whose Gilded Beam marks enemies Gilded (+1g on kill) and scales explosively on Nat 20 with unspent gold held. Pair with Faelan (`Arcane Recovery`) and Toot for huge Act 3 spikes.',
    changes: [
      { type: 'rebal', text: 'Reworked into slow Gold-bolt heavy-cooldown artillery Wizard; combat gold drops restore +15 Charge (`Arcane Recovery`).' },
      { type: 'rebal', text: '1-line Specializations (`Compound Interest` / `Golden Beam`) and opt-in Quest.' }
    ]
  },
  velith: {
    status: 'buff',
    archetype: 'Stealth Ambush Assassin & Nightshade Poison Finisher',
    useCase: 'Premier melee Rogue assassin who opens from Stealth with devastating Sneak Attacks and Nightshade Poison stacks that melt high-AC Act 2–3 bosses. Pair with Corvin (`Hunter’s Mark`) or Kaska (`Exposed`) and equip Evasion + Poison gear.',
    changes: [
      { type: 'buff', text: 'Unified under `Sneak Attack` with Poison & Exposed scaling that bypasses high-AC bosses cleanly.' },
      { type: 'rebal', text: 'Clean 1-line Specializations (`Nightshade` / `Shadowstep`) and opt-in Quest.' }
    ]
  },
  corvin: {
    status: 'buff',
    archetype: 'Melee Dread Ambush Ranger & Hunter’s Mark Enabler',
    useCase: 'Melee skirmisher who opens with Dread Ambush, spreads stacking `Hunter’s Mark` (+1d4 per hit from the entire party!), and summons a Shadow Echo on Nat 20. Turns Naill, Velith, and Arthur into boss-melting machines.',
    changes: [
      { type: 'buff', text: 'Unified under `Hunter’s Mark` + melee on-hit multi-strikes; Dread Ambush excels into Act 2–3 elites.' },
      { type: 'rebal', text: 'Clean 1-line Specializations (`First Strike` / `Shadow Stalker`) and opt-in Quest.' }
    ]
  },
  saint: {
    status: 'rebal',
    archetype: 'Necrosis Anti-Heal Cleric & Illusory Double Trickster',
    useCase: 'Tactical counter-pick against heavy healing/Ward bosses (Keraptis, Gynosphinx, Asmodeus). Toll the Dead stacks Necrosis kill thresholds while Illusory Double absorbs lethal boss bursts and triggers `Channel Divinity` utility.',
    changes: [
      { type: 'rebal', text: 'Unified under `Channel Divinity` with crisp Necrosis pressure and Illusory Double decoy survivability.' },
      { type: 'rebal', text: 'Clean 1-line Specializations (`Bell of Passing` / `Trickster’s Veil`) and opt-in Quest.' }
    ]
  },
  kaska: {
    status: 'rebal',
    archetype: 'Wild Shape Panther Bruiser & Pack Hunt Support',
    useCase: 'Agile Moon Druid skirmisher who pounces into the fray in Panther Form, spreads `Exposed`, and sustains aggressive melee squads via `Pack Hunt`. Bridges seamlessly with Juniper, Mother Laurel, Velith, and Zark.',
    changes: [
      { type: 'rebal', text: 'Unified under `Wild Shape` with balanced Panther Beast HP and Pack Hunt sustain.' },
      { type: 'rebal', text: 'Clean 1-line Specializations (`Lunar Resilience` / `Pack Hunt`) and opt-in Quest.' }
    ]
  }
};

console.log('Running v0.23 live simulation suite for Field Guide & Stat Tracker...');
const tStart = Date.now();

const simData = new Function(engineCode + `
  let _seed = 20261123;
  const rand = () => {
    _seed = (_seed + 0x6D2B79F5) | 0;
    let t = Math.imul(_seed ^ (_seed >>> 15), 1 | _seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  Math.random = rand;

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
    const r = newAdventure(rand);
    r.depth = depth;
    buildEncounter(r, rand, { threat, depth });
    const b = simulate('run', placeParty(party), 1);
    const P = b.units.filter(u => u.side === 'P' && !u.minion);
    const E2 = b.units.filter(u => u.side === 'E');
    const pHp = P.reduce((a, u) => a + (u.alive ? Math.max(0, u.hp) : 0), 0) / Math.max(1, P.reduce((a, u) => a + u.maxHp, 0));
    const eHp = E2.reduce((a, u) => a + (u.alive ? Math.max(0, u.hp) : 0), 0) / Math.max(1, E2.reduce((a, u) => a + u.maxHp, 0));
    const won = b.winner === 'P';
    return { won, score: won ? 0.5 + 0.5 * pHp : 0.5 * (1 - eHp), time: b.time, gold: b.gold || 0, b, P };
  }

  // Standard 3-hero benchmark shell (Tank + Support + Damage) that swaps slot 0 for the tested hero
  const SHELL = {
    Tank: ['lorcan', 'rosalind', 'cinder'],
    Damage: ['dane', 'bram', 'rosalind'],
    Support: ['dane', 'lorcan', 'cinder']
  };
  const makeShell = (k, tier, pathK, items = [], extraPartner = null) => {
    const base = SHELL[H[k].role].filter(x => x !== k);
    if (extraPartner && extraPartner !== k) {
      const filtered = base.filter(x => x !== extraPartner);
      filtered.unshift(extraPartner);
      base.splice(0, base.length, ...filtered);
    }
    const allies = base.slice(0, 3);
    const act = tier >= 3 ? 3 : 2;
    return [
      { key: k, tier, path: pathK || H[k].paths[0].k, asi: tier >= 3 ? H[k].pair[1] : null, items, act, goldHeld: 18 },
      ...allies.map(ak => ({ key: ak, tier, path: H[ak].paths[0].k, asi: tier >= 3 ? H[ak].pair[1] : null, items: [], act, goldHeld: 18 }))
    ];
  };

  const MID_THREATS = ['redbrands', 'kelpie_mire'];
  const LATE_THREATS = ['blackrazor_boss', 'orcus', 'tiamat'];

  // 1. Per-hero Midgame (T2) + Lategame (T3) + Spec H2H benchmark
  const heroBench = [];
  const pathBench = {};
  for (const k of HERO_ORDER) {
    const h = H[k];
    const p0 = h.paths[0], p1 = h.paths[1];
    let mW = 0, mSc = 0, lW = 0, lSc = 0, dmg = 0, healA = 0, wardA = 0, goldA = 0, surv = 0, tm = 0, nTot = 0;
    const pAcc = [{ sc: 0, w: 0, n: 0 }, { sc: 0, w: 0, n: 0 }];

    for (let pi = 0; pi < 2; pi++) {
      const pk = h.paths[pi].k;
      for (const th of MID_THREATS) {
        const res = fight(th, 7.2, makeShell(k, 2, pk));
        mSc += res.score; if (res.won) mW++;
        pAcc[pi].sc += res.score; if (res.won) pAcc[pi].w++; pAcc[pi].n++;
        const u = res.P.find(x => x.key === k);
        if (u) { dmg += u.stats.dmg || 0; healA += u.stats.heal || 0; wardA += u.stats.ward || 0; if (u.alive) surv++; }
        goldA += res.gold; tm += res.time; nTot++;
      }
      for (const th of LATE_THREATS) {
        const res = fight(th, 11.4, makeShell(k, 3, pk, ['plate_armor']));
        lSc += res.score; if (res.won) lW++;
        pAcc[pi].sc += res.score; if (res.won) pAcc[pi].w++; pAcc[pi].n++;
        const u = res.P.find(x => x.key === k);
        if (u) { dmg += u.stats.dmg || 0; healA += u.stats.heal || 0; wardA += u.stats.ward || 0; if (u.alive) surv++; }
        goldA += res.gold; tm += res.time; nTot++;
      }
    }
    const midN = MID_THREATS.length * 2, lateN = LATE_THREATS.length * 2;
    const avgScore = +(100 * (mSc / midN * 0.45 + lSc / lateN * 0.55)).toFixed(1);
    const midWR = +(100 * mW / midN).toFixed(1);
    const lateWR = +(100 * lW / lateN).toFixed(1);
    const avgWR = +(100 * (mW + lW) / nTot).toFixed(1);
    heroBench.push({
      key: k, name: h.name, role: h.role, cls: h.cls,
      avgScore, avgWR, midWR, lateWR,
      avgDmg: Math.round(dmg / nTot),
      avgHeal: Math.round(healA / nTot),
      avgWard: Math.round(wardA / nTot),
      avgGold: +(goldA / nTot).toFixed(2),
      survPct: +(100 * surv / nTot).toFixed(1),
      avgTime: +(tm / nTot).toFixed(1)
    });
    const s0 = +(100 * pAcc[0].sc / pAcc[0].n).toFixed(1), w0 = +(100 * pAcc[0].w / pAcc[0].n).toFixed(1);
    const s1 = +(100 * pAcc[1].sc / pAcc[1].n).toFixed(1), w1 = +(100 * pAcc[1].w / pAcc[1].n).toFixed(1);
    pathBench[k] = {
      key: k,
      p0: { k: p0.k, n: p0.n, score: s0, wr: w0 },
      p1: { k: p1.k, n: p1.n, score: s1, wr: w1 },
      winner: Math.abs(s0 - s1) < 1.2 ? 'Even' : (s0 > s1 ? p0.n : p1.n)
    };
  }
  heroBench.sort((a, b) => b.avgScore - a.avgScore);
  const heroScoreMap = Object.fromEntries(heroBench.map(h => [h.key, h.avgScore]));
  console.log('  [1/4] 24-hero & 48-spec benchmarks done');

  // 2. Best Partner Heroes per hero (test candidate partners with shared Class Keywords + diverse roles)
  const PARTNER_THS = ['blackrazor_boss', 'orcus'];
  const partnerMap = {};
  for (const k of HERO_ORDER) {
    const kws = Object.keys(H[k].kw || {});
    const kwShared = HERO_ORDER.filter(o => o !== k && Object.keys(H[o].kw || {}).some(w => kws.includes(w)));
    const comp = HERO_ORDER.filter(o => o !== k && !kwShared.includes(o) && H[o].role !== H[k].role).slice(0, Math.max(2, 4 - kwShared.length));
    const cands = [...kwShared, ...comp].slice(0, 4);
    const rows = cands.map(p => {
      let sc = 0, w = 0;
      for (const th of PARTNER_THS) {
        const res = fight(th, 11.6, makeShell(k, 3, H[k].paths[0].k, [], p));
        sc += res.score; if (res.won) w++;
      }
      const avgSc = +(100 * sc / PARTNER_THS.length).toFixed(1);
      const sharedKw = Object.keys(H[p].kw || {}).filter(w => kws.includes(w));
      const expected = (heroScoreMap[k] + heroScoreMap[p]) / 2;
      return {
        partner: p, name: H[p].name, sharedKw,
        score: avgSc, winRate: +(100 * w / PARTNER_THS.length).toFixed(1),
        lift: +(avgSc - expected).toFixed(1)
      };
    }).sort((a, b) => (b.score + b.sharedKw.length * 2) - (a.score + a.sharedKw.length * 2));
    partnerMap[k] = rows.slice(0, 4);
  }
  console.log('  [2/4] Best partner benchmarks done');

  // 3. Best Items per hero & All 82 Items A/B Benchmark
  const ITEM_THS = ['orcus', 'tiamat'];
  const baseHeroScores = {};
  for (const k of HERO_ORDER) {
    let sc = 0;
    for (const th of ITEM_THS) sc += fight(th, 11.8, makeShell(k, 3, H[k].paths[0].k, [])).score;
    baseHeroScores[k] = +(100 * sc / ITEM_THS.length).toFixed(1);
  }

  const itemCarrierAcc = {};
  const heroItemsOut = {};
  const UNIV_SAMPLE = ['cloak_displacement', 'boots_speed', 'ring_protection', 'sun_blade', 'flame_tongue', 'plate_armor', 'robe_archmagi', 'amulet_health'];
  for (const k of HERO_ORDER) {
    const kws = Object.keys(H[k].kw || {});
    const kwUniques = UNIQUE_ITEM_KEYS.filter(ik => canCarry({ key: k }, ik) && (ITEMS[ik].kwHooks || []).some(w => kws.includes(w)));
    const attrMatches = STANDARD_ITEM_KEYS.filter(ik => ITEMS[ik].r >= 2 && ITEMS[ik].a && Object.keys(ITEMS[ik].a).some(a => H[k].pair.includes(a))).slice(0, 2);
    const cands = [...new Set([...kwUniques, ...attrMatches, ...UNIV_SAMPLE])].filter(ik => ITEMS[ik] && canCarry({ key: k }, ik)).slice(0, 5);
    const rows = cands.map(ik => {
      let sc = 0, w = 0;
      for (const th of ITEM_THS) {
        const res = fight(th, 11.8, makeShell(k, 3, H[k].paths[0].k, [ik]));
        sc += res.score; if (res.won) w++;
      }
      const avgSc = +(100 * sc / ITEM_THS.length).toFixed(1);
      const lift = +(avgSc - baseHeroScores[k]).toFixed(1);
      const it = ITEMS[ik];
      const cost = ECON.itemPrice[it.r] || 3;
      const kwMatch = !!(it.kwHooks || []).some(w => kws.includes(w));
      if (!itemCarrierAcc[ik]) itemCarrierAcc[ik] = [];
      itemCarrierAcc[ik].push({ hero: k, name: H[k].name, lift, kwMatch });
      return { item: ik, name: it.n, rarity: it.r, cost, kwMatch, winRate: +(100 * w / ITEM_THS.length).toFixed(1), score: avgSc, lift, valPerGold: +(lift / cost).toFixed(2) };
    }).sort((a, b) => (b.lift + (b.kwMatch ? 2 : 0)) - (a.lift + (a.kwMatch ? 2 : 0)));
    heroItemsOut[k] = {
      top: rows.slice(0, 4),
      bestValue: rows.slice().sort((a, b) => b.valPerGold - a.valPerGold).slice(0, 3)
    };
  }

  // Ensure every single one of the 82 items has real A/B telemetry on its best natural carrier!
  const allItemsOut = ALL_ITEM_KEYS.map(ik => {
    const it = ITEMS[ik];
    const cost = ECON.itemPrice[it.r] || 2;
    let tested = (itemCarrierAcc[ik] || []).slice();
    if (!tested.length) {
      const bestH = HERO_ORDER.find(hk => canCarry({ key: hk }, ik) && (it.kwHooks || []).some(w => H[hk].kw && H[hk].kw[w]))
        || HERO_ORDER.find(hk => canCarry({ key: hk }, ik) && it.a && Object.keys(it.a).some(a => H[hk].pair.includes(a)))
        || HERO_ORDER.find(hk => canCarry({ key: hk }, ik))
        || 'dane';
      const sc = fight('orcus', 11.8, makeShell(bestH, 3, H[bestH].paths[0].k, [ik])).score;
      const lift = +(100 * sc - baseHeroScores[bestH]).toFixed(1);
      const kwMatch = !!(it.kwHooks || []).some(w => H[bestH].kw && H[bestH].kw[w]);
      tested.push({ hero: bestH, name: H[bestH].name, lift, kwMatch });
    }
    tested.sort((a, b) => b.lift - a.lift);
    const bestLift = tested[0] ? tested[0].lift : 0;
    return {
      key: ik, name: it.n, r: it.r, rarity: RARITY[it.r].n, price: cost,
      kwHooks: it.kwHooks || [],
      clsLock: it.cls || null,
      bestDelta: +(bestLift / 100).toFixed(3),
      valPerGold: +(bestLift / (cost * 100)).toFixed(3),
      topCarriers: tested.slice(0, 3)
    };
  });
  console.log('  [3/4] 82-item A/B benchmarks done');

  // 4. 12 Signature v0.23 Archetype Compositions tested at Act 3 Bosses
  const COMP_DEFS = [
    { name: 'Radiant Smite & Vines', heroes: ['dane', 'mother_laurel', 'lumen', 'bram'] },
    { name: 'Wild Shape Moon & Land', heroes: ['mother_laurel', 'kaska', 'juniper', 'velith'] },
    { name: 'Action Surge Armory', heroes: ['gilthrax', 'arthur', 'zoe', 'rosalind'] },
    { name: 'Pack 5 Market Cartel', heroes: ['gilthrax', 'zoe', 'toot', 'gains'] },
    { name: 'Arcane Recovery Battery', heroes: ['gilthrax', 'faelan', 'gains', 'zoe'] },
    { name: 'Infernal Hex & Burn', heroes: ['dane', 'cinder', 'lumen', 'nettle'] },
    { name: 'Hunter’s Mark Ambush', heroes: ['zark', 'corvin', 'lorcan', 'naill'] },
    { name: 'Backline Dive & Evasion', heroes: ['arthur', 'wallaby', 'velith', 'naill'] },
    { name: 'Colossus & Artillery', heroes: ['pillar', 'cinder', 'rosalind', 'gains'] },
    { name: 'Bonded Frontline Aura', heroes: ['dane', 'zark', 'jamison', 'bram'] },
    { name: 'Anti-Heal Necrosis Control', heroes: ['pillar', 'saint', 'nettle', 'juniper'] },
    { name: 'Tavern Classic Core', heroes: ['bram', 'arthur', 'faelan', 'wallaby'] }
  ];
  const COMP_THS = ['orcus', 'asmodeus', 'tiamat'];
  const compsOut = COMP_DEFS.map(c => {
    let sc = 0, w = 0, tm = 0, g = 0;
    const party = c.heroes.map(hk => ({ key: hk, tier: 3, path: H[hk].paths[0].k, asi: H[hk].pair[1], items: ['ring_protection'], act: 3, goldHeld: 20 }));
    for (const th of COMP_THS) {
      const res = fight(th, 12.2, party);
      sc += res.score; if (res.won) w++; tm += res.time; g += res.gold;
    }
    return {
      name: c.name, heroes: c.heroes,
      avgScore: +(100 * sc / COMP_THS.length).toFixed(1),
      winRate: +(100 * w / COMP_THS.length).toFixed(1),
      avgTime: +(tm / COMP_THS.length).toFixed(1),
      avgGold: +(g / COMP_THS.length).toFixed(1)
    };
  }).sort((a, b) => b.avgScore - a.avgScore);
  console.log('  [4/4] 12 signature comps done');

  return { heroBench, pathBench, partnerMap, heroItemsOut, allItemsOut, compsOut };
`)();

// Run a quick 20-run/persona 3-Act campaign summary for the Meta & Difficulty Overview tab (uses current calibrated src/)
import { execFileSync } from 'node:child_process';
let campaignSummary = null;
let bossSummary = [];
try {
  const out = execFileSync('node', [path.join(root, 'tools/verify-v023.mjs'), '25'], { encoding: 'utf8', cwd: root, maxBuffer: 10 * 1024 * 1024 });
  const m = out.match(/\{[\s\S]*?\n\}/);
  if (m) campaignSummary = JSON.parse(m[0]);
  const bossLines = out.split('\n').filter(l => /^Act \d/.test(l));
  bossSummary = bossLines.map(l => {
    const mm = l.match(/^Act (\d) · (\S+)\s+:\s+(\d+)\/(\d+) \(([\d.]+)%\)/);
    if (!mm) return null;
    return { act: Number(mm[1]), key: mm[2], won: Number(mm[3]), fought: Number(mm[4]), winRate: Number(mm[5]) };
  }).filter(Boolean);
} catch (e) {
  console.warn('Warning: could not capture live campaign summary:', e.message);
}

const PERSONA_LABELS = {
  zero_item: 'Zero-Item / Naive (0 Items Bought)',
  casual: 'Casual Player (Random Path & ~45% Items)',
  competent: 'Competent Tactician (Balanced & Geared)',
  synergy: 'Synergy Drafter (Keyword + Role Focus)',
  greed: 'Pack 5 Market Greed (Zoe/Toot/Gilthrax/Gains)'
};
const TARGET_GATES = {
  zero_item: '< 15% WR',
  casual: '25–45% WR',
  competent: '55–70% WR (40–65% Piggy)',
  synergy: '55–70% WR (40–65% Piggy)',
  greed: '≤ 70% WR'
};
const botsOut = campaignSummary ? Object.entries(campaignSummary).map(([id, v]) => ({
  id, label: PERSONA_LABELS[id] || id, target: TARGET_GATES[id] || '—',
  liveWR: v.winRate, act1Clear: v.act1Clear, act2Clear: v.act2Clear,
  piggyBreak: v.piggyBreakRate, avgGold: v.avgGold, avgFights: v.avgFights
})) : [];

function explainPairing(h1, h2, sharedKw) {
  if (sharedKw && sharedKw.length) return `Shared ${sharedKw.map(x => x.replace(/_/g, ' ')).join(' & ')} Class Keyword engine chains triggers across both kits.`;
  return 'Complementary frontline/backline tempo pairing tested across Act 2–3 bosses.';
}

const heroesOut = {};
simData.heroBench.forEach((h, idx) => {
  const k = h.key;
  const liveRank = idx + 1;
  const baseRank = v022BaseRank[k] || liveRank;
  const baseScore = v022BaseScore[k] != null ? v022BaseScore[k] : null;
  const note = HERO_NOTES[k] || { status: 'rebal', archetype: h.role, useCase: '', changes: [] };
  const partners = (simData.partnerMap[k] || []).map(p => ({ ...p, why: explainPairing(k, p.partner, p.sharedKw) }));
  const itInfo = simData.heroItemsOut[k] || { top: [], bestValue: [] };
  heroesOut[k] = {
    ...h,
    liveRank, baseRank,
    rankDelta: baseRank - liveRank,
    baseScore,
    scoreDelta: baseScore != null ? +(h.avgScore - baseScore).toFixed(1) : 0,
    changeStatus: note.status,
    archetype: note.archetype,
    useCase: note.useCase,
    changes: note.changes,
    paths: simData.pathBench[k],
    bestPartners: partners,
    bestItems: itInfo.top,
    bestValueItems: itInfo.bestValue
  };
});

const globalChanges = {
  combat: [
    { type: 'rebal', tag: 'Cubed AC/SR', text: 'Defense mitigation now follows `1 / (1 + (Eff / 14)^3)` — AC 10 blocks 26.7%, AC 14 blocks 50.0%, AC 20 blocks 74.5%, countered by Armor Pen & Spell Pen.' },
    { type: 'buff', tag: 'Radiant True Dmg', text: 'Radiant damage (Sir Dane Smite, Lumen Celestial bolts, Sun Blade, Holy Avenger) bypasses both AC and SR completely.' },
    { type: 'buff', tag: 'Universal Evasion', text: 'All Evasion sources combine multiplicatively (`1 - Π(1 - e_i)`) and trigger Arthur’s Action Surge counter-strikes.' },
    { type: 'rebal', tag: '9 Epic Boons', text: 'Tier IV replaces per-path upgrades with a universal 1-of-3 **Epic Boon** picker (Combat Prowess, Fortitude, Irresistible Offense, Recovery, Spell Recall, Fate, Speed, Truesight, Energy Resistance).' },
    { type: 'rebal', tag: '12 Multiclass Dips', text: 'Single-class named shrines (`✧`, no repeats per run) grant a hero a secondary Class Keyword and unlock Curio Uniques for that class.' },
    { type: 'fix', tag: 'Lethal Priority', text: 'Strict lethal-hit rescue order: `Zealot → Relentless Endurance (1 HP) → Cleric MC (25%) → Boon of Recovery (50%)`.' }
  ],
  enemy: [
    { type: 'buff', tag: '3 Full Acts', text: 'Act 1 **Phandalin** (Klarg Miniboss, 3 bosses), Act 2 **White Plume Mountain** (Dungeon Hazards + Vault Loot, 4 bosses), Act 3 **The Hells** (Wandering Pit Fiend + Devil’s Bargains, 3 Final Bosses: Orcus, Asmodeus, Tiamat).' },
    { type: 'rebal', tag: '9-Row DAG Map', text: 'Constricting non-crossing 9-row DAG (`3→3→3→3→3→2→2→2→1`) with Camp Shop Flow Flip, Act Boss Reminder, and Whole-Shop Freeze.' },
    { type: 'buff', tag: '82 Six-Tier Items', text: '58 Universal Standard Shop items (`Common 2g → Legendary 10g`) with exact 6-attribute parity (`+1/+2/+3/+4/+6`), plus 24 **Unique (5g)** Class-Keyword relics at the Curio Merchant (`⚖`).' },
    { type: 'rebal', tag: 'Strict Disclosure', text: 'Tier I hero cards hide Specializations, Quests, Boons, and Multiclass boxes until unlocked; all 48 Specializations are strictly 1-line rules.' }
  ]
};

const finalMeta = {
  version: '0.23 Live Build',
  generatedAt: new Date().toISOString().slice(0, 10),
  heroes: heroesOut,
  items: simData.allItemsOut,
  comps: simData.compsOut,
  bots: botsOut,
  bosses: bossSummary,
  globalChanges
};

fs.mkdirSync(path.join(root, 'data'), { recursive: true });
const jsContent = `/* Auto-generated v0.23 live meta telemetry & changelog for tools/wiki.html */\nwindow.WIKI_META = ${JSON.stringify(finalMeta, null, 2)};\n`;
fs.writeFileSync(path.join(root, 'data/wiki-meta-stats.js'), jsContent);
console.log(`Wrote data/wiki-meta-stats.js (${(jsContent.length / 1024).toFixed(1)} KB, 24 heroes, ${simData.allItemsOut.length} items, ${simData.compsOut.length} comps, ${bossSummary.length} bosses) in ${((Date.now() - tStart) / 1000).toFixed(1)}s`);
