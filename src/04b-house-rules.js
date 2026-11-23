/* ================= 0.24 HOUSE RULES: 36 SHOP-OFFERED PARTY MODIFIERS =================
   Inspired by Guildrun's relic layer & Balatro's multiplicative scaling engines:
   - Permanent party-wide rules bought in the Camp Shop (or drafted after Boss/Miniboss wins).
   - Capped at HOUSE_RULE_MAX = 6 slots (sell any active House Rule for 50% Gold to pivot/upgrade).
   - 4 Rarities unlocked progressively by Camp Rank:
       r=0 Common (4g) · r=1 Uncommon (6g) · r=2 Rare (9g) · r=3 Legendary (14g)
   - Categories:
       1. 13 Class-Keyword Multiplicative Engines (supercharged by Multiclass Shrines!)
       2.  8 Composition & Soft-Lane Tactical Rules
       3.  6 Economy & Future-Power Rules
       4.  9 Legendary Capstone Engines (Act 2-3 exponential payoffs)
*/

const HOUSE_RULE_MAX = 6;

const HOUSE_RULE_RARITY = [
  { n: 'Common',    col: '#4d483d', cost: 4 },
  { n: 'Uncommon',  col: '#226d3a', cost: 6 },
  { n: 'Rare',      col: '#12477d', cost: 9 },
  { n: 'Legendary', col: '#8a4a0e', cost: 14 }
];

const HOUSE_RULES = {
  /* ==========================================================================
     1. 13 CLASS-KEYWORD MULTIPLICATIVE ENGINES (Encourage Multiclassing!)
     ========================================================================== */
  hr_action_surge: {
    n: 'Rule of Momentum', r: 2, cat: 'keyword', kw: 'action_surge', glyph: '⚡',
    x: 'Every Action Surge grants the whole party +10% Attack Speed & ×1.06 Damage this fight (stacks up to 12×).'
  },
  hr_smite: {
    n: 'Crusader’s Vow', r: 2, cat: 'keyword', kw: 'smite', glyph: '☀',
    x: 'Every Smite multiplies all party Radiant & Smite damage by ×1.12 and party Damage by ×1.05 this fight.'
  },
  hr_arcane_recovery: {
    n: 'Leyline Overcharge', r: 2, cat: 'keyword', kw: 'arcane_recovery', glyph: '◈',
    x: 'Every Arcane Recovery multiplies party Ability Damage & Ward gained by ×1.09 this fight.'
  },
  hr_channel_divinity: {
    n: 'Miracle at the Table', r: 2, cat: 'keyword', kw: 'channel_divinity', glyph: '✦',
    x: 'Triggering Channel Divinity heals the party for 20% Max HP and multiplies party Damage & Ward by ×1.22.'
  },
  hr_rage: {
    n: 'Bloodfury Pact', r: 1, cat: 'keyword', kw: 'rage', glyph: '🔥',
    x: 'Every Rage stack gained by any ally multiplies whole-party Damage by ×1.05 and grants +3% DR this fight.'
  },
  hr_bardic_inspiration: {
    n: 'Tabletop Encore', r: 2, cat: 'keyword', kw: 'bardic_inspiration', glyph: '♫',
    x: 'Spending Bardic Inspiration gives all allies +1 to their next d20 roll and ×1.10 Ability power this fight.'
  },
  hr_wild_shape: {
    n: 'Primal Pack Law', r: 1, cat: 'keyword', kw: 'wild_shape', glyph: '🌿',
    x: 'Triggering Wild Shape grants all allies a 15% Max HP Ward and ×1.10 Damage for the fight.'
  },
  hr_hunters_mark: {
    n: 'Pack Quarry Rule', r: 1, cat: 'keyword', kw: 'hunters_mark', glyph: '◎',
    x: 'Marked foes take ×1.12 damage per 2 Mark stacks and transfer their Marks to the nearest foe on death.'
  },
  hr_sneak_attack: {
    n: 'Exposed Flanks', r: 1, cat: 'keyword', kw: 'sneak_attack', glyph: '🗡',
    x: 'Every Sneak Attack permanently strips −1 AC & −1 SR from the target and adds ×1.06 party Damage this fight.'
  },
  hr_ki: {
    n: 'Flowing Ki Tempo', r: 1, cat: 'keyword', kw: 'ki', glyph: '☯',
    x: 'Every Ki Strike grants all allies +10 Charge and multiplies party Attack Speed by +8% & Damage by ×1.07.'
  },
  hr_metamagic: {
    n: 'Twin-Spell Resonance', r: 2, cat: 'keyword', kw: 'metamagic', glyph: '✴',
    x: 'Every Metamagic proc multiplies all party Spell & Burn Damage by ×1.15 for the fight.'
  },
  hr_hex: {
    n: 'Hexbound Covenant', r: 2, cat: 'keyword', kw: 'hex', glyph: '☽',
    x: 'Hexed foes take ×1.18 damage from all allies; each Hex death stacks ×1.12 party Damage this fight.'
  },
  hr_aura: {
    n: 'Shieldwall Doctrine', r: 1, cat: 'keyword', kw: 'aura', glyph: '⛨',
    x: 'Allies standing inside any Paladin Aura gain ×1.18 Damage & +15% Ward effectiveness.'
  },

  /* ==========================================================================
     2. 8 COMPOSITION & SOFT-LANE TACTICAL HOUSE RULES
     ========================================================================== */
  hr_motley_crew: {
    n: 'Motley Crew', r: 1, cat: 'comp', glyph: '★',
    x: 'If all heroes have different base classes, the party gains +22% Charge Speed & ×1.22 Damage.'
  },
  hr_guild_brotherhood: {
    n: 'Shared Training', r: 2, cat: 'comp', glyph: '⚔',
    x: 'For every Class Keyword shared by 2+ heroes (including Multiclass), party gains ×1.16 Damage & +12% Max HP.'
  },
  hr_flank_conquer: {
    n: 'Flank & Conquer', r: 0, cat: 'lane', glyph: '⚑',
    x: 'Winning a Lane grants surviving heroes ×1.28 Damage & +30% Attack Speed for the rest of the fight.'
  },
  hr_solo_vanguard: {
    n: 'Hold the Line', r: 1, cat: 'lane', glyph: '🛡',
    x: 'Any hero deployed alone in a Lane starts with a 45% Max HP Ward and ×1.25 Damage.'
  },
  hr_buddy_system: {
    n: 'Buddy System', r: 0, cat: 'lane', glyph: '🤝',
    x: 'Heroes deployed together in the same Lane share 25% of Ward gained and get +1 to ability d20 rolls.'
  },
  hr_loaded_tray: {
    n: 'Hot Dice Rule', r: 2, cat: 'd20', glyph: '🎲',
    x: 'Every High d20 roll multiplies party Damage by ×1.06 this fight; every Nat 20 multiplies it by ×1.20!'
  },
  hr_fumble_grace: {
    n: 'Merciful DM', r: 0, cat: 'd20', glyph: '🍀',
    x: 'Whenever a hero rolls a Nat 1 Fizzle, they gain a 30% Max HP Ward and Advantage on their next cast.'
  },
  hr_blitzkrieg: {
    n: 'Speedrun Bonus', r: 1, cat: 'scale', glyph: '⏱',
    x: 'Winning a combat in under 15s permanently grants +5% multiplicative Party Damage for the rest of the run.'
  },

  /* ==========================================================================
     3. 6 ECONOMY & FUTURE-POWER HOUSE RULES
     ========================================================================== */
  hr_guild_treasury: {
    n: 'Guild Treasury', r: 0, cat: 'econ', glyph: '💰',
    x: 'Raises Gold Interest Cap by +4g and grants +1g after every combat victory.'
  },
  hr_golden_aegis: {
    n: 'Golden Aegis', r: 2, cat: 'econ', glyph: '🪙',
    x: 'Every +1g earned in combat grants all allies 5% Max HP Ward & ×1.06 Damage this fight.'
  },
  hr_quartermaster: {
    n: 'Quartermaster’s Tab', r: 1, cat: 'econ', glyph: '📜',
    x: 'Your first Camp Shop reroll each visit is Free, and Camp Rank upgrades cost −2g.'
  },
  hr_bounty_board: {
    n: 'Double Bounties', r: 0, cat: 'econ', glyph: '🎯',
    x: 'Lane Objectives pay double Gold, and every 2 Lane Objectives won grants a random hero +1 Key Attribute.'
  },
  hr_compound_coffers: {
    n: 'Compound Coffers', r: 3, cat: 'econ', glyph: '👑',
    x: 'Party gains ×1.03 Damage & ×1.02 Ward for every 1g currently held (up to ×2.20 at 40g!).'
  },
  hr_apprentice_pact: {
    n: 'Long-Term Investment', r: 0, cat: 'scale', glyph: '🌱',
    x: 'Does nothing immediately—after 3 combat wins, promotes your lowest-Tier hero +1 Tier & grants ×1.22 Party Damage.'
  },

  /* ==========================================================================
     4. 9 LEGENDARY CAPSTONE HOUSE RULES (Act 2-3 Exponential Engines)
     ========================================================================== */
  hr_endless_surges: {
    n: 'Rule of Cool', r: 3, cat: 'capstone', kw: 'action_surge', glyph: '⚔',
    x: 'Every 5th basic attack by any hero triggers a free Action Surge and stacks ×1.06 party Damage this fight.'
  },
  hr_cataclysm: {
    n: 'Elemental Cascade', r: 3, cat: 'capstone', glyph: '🌋',
    x: 'Every Burn, Poison, or Necrosis tick increases all damage enemies take by ×1.03 multiplicatively (up to ×3.0).'
  },
  hr_titanic_vanguard: {
    n: 'Titanic Endurance', r: 3, cat: 'capstone', glyph: '⛰',
    x: 'Every 150 HP healed or absorbed by Ward multiplies party Max HP & Damage by ×1.07 for the fight.'
  },
  hr_astral_dice: {
    n: 'Loaded Twenty', r: 3, cat: 'capstone', glyph: '✦',
    x: 'All hero d20 High thresholds drop by 2, and every Nat 20 triggers a free ability cast from the closest ally!'
  },
  hr_multiclass_crown: {
    n: 'Gestalt Characters', r: 3, cat: 'capstone', glyph: '✧',
    x: 'Each Multiclass Dip in your party grants ×1.30 Party Damage & ×1.20 Ward, plus +15% Charge Speed.'
  },
  hr_overclocked_arsenal: {
    n: 'Magic Item Hoard', r: 3, cat: 'capstone', glyph: '💎',
    x: 'Every equipped item across your party multiplies party Damage by ×1.07 and grants +3% Attack Speed.'
  },
  hr_dragonfire_hoard: {
    n: 'Dragon’s Tax', r: 3, cat: 'capstone', glyph: '🐉',
    x: 'Start every fight with +15% Damage per Rare+ item equipped and apply 6 Burn to all foes when any lane is won.'
  },
  hr_eternal_vigil: {
    n: 'Death Saves Off', r: 3, cat: 'capstone', glyph: '☥',
    x: 'The first time each hero would drop to 0 HP per fight, prevent death with a 35% Max HP Ward & ×1.25 Damage!'
  },
  hr_grand_tactician: {
    n: 'Action Economy', r: 3, cat: 'capstone', glyph: '♟',
    x: 'All heroes start combat with +40 Charge; every ability cast multiplies party Damage & Heal by ×1.06 this fight.'
  }
};

const HOUSE_RULE_KEYS = Object.keys(HOUSE_RULES);
const HOUSE_RULES_BY_R = [0, 1, 2, 3].map(r => HOUSE_RULE_KEYS.filter(k => HOUSE_RULES[k].r === r));

function houseRuleRefund(k) {
  const hr = HOUSE_RULES[k];
  if (!hr) return 2;
  const cost = (HOUSE_RULE_RARITY[hr.r] && HOUSE_RULE_RARITY[hr.r].cost) || 4;
  return Math.max(2, Math.floor(cost * 0.5));
}

function partyKeywordCounts(team) {
  const counts = {};
  (team || []).forEach(h => {
    const kws = typeof heroKeywords === 'function' ? heroKeywords(h) : [];
    kws.forEach(kw => { counts[kw] = (counts[kw] || 0) + 1; });
  });
  return counts;
}

function houseRuleFit(ruleKey, run) {
  const hr = HOUSE_RULES[ruleKey];
  if (!hr || !run || !run.team || !run.team.length) return { match: false, score: 0, reason: '' };
  const kwc = partyKeywordCounts(run.team);
  if (hr.kw) {
    const n = kwc[hr.kw] || 0;
    if (n >= 2) return { match: true, score: 3, reason: `${n}× ${CLASS_KW[hr.kw].n} engine!` };
    if (n === 1) return { match: true, score: 2, reason: `Matches ${CLASS_KW[hr.kw].n}` };
    return { match: false, score: 0, reason: '' };
  }
  if (ruleKey === 'hr_motley_crew') {
    const cls = new Set(run.team.map(h => H[h.key] && H[h.key].cls));
    if (cls.size === run.team.length) return { match: true, score: 2, reason: 'All unique classes' };
  }
  if (ruleKey === 'hr_guild_brotherhood') {
    const shared = Object.values(kwc).filter(v => v >= 2).length;
    if (shared > 0) return { match: true, score: 2 + shared, reason: `${shared} shared keyword${shared > 1 ? 's' : ''}` };
  }
  if (ruleKey === 'hr_multiclass_crown') {
    const mcs = run.team.filter(h => h.multiclass).length;
    if (mcs > 0) return { match: true, score: 2 + mcs, reason: `${mcs} Multiclass dip${mcs > 1 ? 's' : ''}` };
  }
  if (ruleKey === 'hr_overclocked_arsenal' || ruleKey === 'hr_dragonfire_hoard') {
    const eq = run.team.reduce((a, h) => a + (h.items || []).length, 0);
    if (eq >= 4) return { match: true, score: 2, reason: `${eq} equipped items` };
  }
  if (ruleKey === 'hr_golden_aegis') {
    if (run.team.some(h => ['toot', 'gains', 'wallaby', 'gilthrax', 'zoe'].includes(h.key))) {
      return { match: true, score: 2, reason: 'Gold-gen party match' };
    }
  }
  if (hr.cat === 'econ' || hr.cat === 'lane' || hr.cat === 'd20' || hr.cat === 'scale' || hr.cat === 'capstone') {
    return { match: hr.r >= 3, score: hr.r >= 3 ? 2 : 1, reason: hr.r >= 3 ? 'Legendary Capstone' : '' };
  }
  return { match: false, score: 0, reason: '' };
}

/* Deterministic Engine Multiplier contributed by active House Rules (used by Party CR!) */
function houseRuleEngineMult(run) {
  if (!run || !Array.isArray(run.houseRules) || !run.houseRules.length) return 1.0;
  const team = run.team || [];
  const kwc = partyKeywordCounts(team);
  let mult = 1.0;

  run.houseRules.forEach(k => {
    const hr = HOUSE_RULES[k];
    if (!hr) return;
    if (hr.kw) {
      const n = kwc[hr.kw] || 0;
      if (n >= 1) mult *= (1 + 0.14 * n + (n >= 2 ? 0.12 : 0));
      else mult *= 1.02;
    } else if (k === 'hr_motley_crew') {
      const cls = new Set(team.map(h => H[h.key] && H[h.key].cls));
      if (cls.size === team.length && team.length >= 2) mult *= 1.28;
    } else if (k === 'hr_guild_brotherhood') {
      const shared = Object.values(kwc).filter(v => v >= 2).length;
      mult *= Math.pow(1.18, shared);
    } else if (k === 'hr_flank_conquer') {
      mult *= 1.18;
    } else if (k === 'hr_solo_vanguard') {
      mult *= 1.22;
    } else if (k === 'hr_buddy_system') {
      mult *= 1.14;
    } else if (k === 'hr_loaded_tray') {
      mult *= 1.26;
    } else if (k === 'hr_fumble_grace') {
      mult *= 1.08;
    } else if (k === 'hr_blitzkrieg') {
      const st = (run.hrState && run.hrState.blitzStacks) || 0;
      mult *= Math.pow(1.05, st);
    } else if (k === 'hr_golden_aegis') {
      const goldGen = team.some(h => ['toot', 'gains', 'wallaby', 'gilthrax'].includes(h.key));
      mult *= goldGen ? 1.32 : 1.14;
    } else if (k === 'hr_compound_coffers') {
      mult *= Math.min(2.2, Math.pow(1.03, Math.max(0, run.gold || 0)));
    } else if (k === 'hr_apprentice_pact') {
      const done = run.hrState && run.hrState.apprenticeDone;
      mult *= done ? 1.22 : 1.0;
    } else if (k === 'hr_endless_surges') {
      mult *= 1.45;
    } else if (k === 'hr_cataclysm') {
      mult *= 1.42;
    } else if (k === 'hr_titanic_vanguard') {
      mult *= 1.40;
    } else if (k === 'hr_astral_dice') {
      mult *= 1.46;
    } else if (k === 'hr_multiclass_crown') {
      const mcs = team.filter(h => h.multiclass).length;
      mult *= mcs > 0 ? Math.pow(1.34, mcs) : 1.08;
    } else if (k === 'hr_overclocked_arsenal') {
      const eq = team.reduce((a, h) => a + (h.items || []).length, 0);
      mult *= Math.pow(1.07, eq);
    } else if (k === 'hr_dragonfire_hoard') {
      const rareEq = team.reduce((a, h) => a + (h.items || []).filter(ik => ITEMS[ik] && ITEMS[ik].r >= 2).length, 0);
      mult *= (1.16 + 0.14 * rareEq);
    } else if (k === 'hr_eternal_vigil') {
      mult *= 1.44;
    } else if (k === 'hr_grand_tactician') {
      mult *= 1.48;
    } else {
      mult *= 1.04;
    }
  });

  return Math.min(12, mult);
}
