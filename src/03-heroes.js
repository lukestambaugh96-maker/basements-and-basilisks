/* ================= 0.23 HEROES: 24-HERO CAST, 13 CLASS KEYWORDS, BOONS & MULTICLASS =================
   All 24 heroes across 6 toggleable packs unified under 13 canonical D&D Class Keywords
   (1 per class + Paladin's Smite & Aura):
     Fighter:   Action Surge          | Cleric:    Channel Divinity
     Paladin:   Smite, Aura           | Wizard:    Arcane Recovery
     Barbarian: Rage                  | Bard:      Bardic Inspiration
     Druid:     Wild Shape            | Ranger:    Hunter's Mark
     Rogue:     Sneak Attack          | Monk:      Ki
     Sorcerer:  Metamagic             | Warlock:   Hex
   Standing v0.23 Design Rules:
   - One focused Ability forever per hero (except Arthur's Quest Flame Gauntlet upgrade).
   - Compensator Passive ONLY where a kit has a real mechanical deficit (Arthur, Wallaby, Rosalind, Zark, Jamison, Velith, Corvin).
   - Tier II Specializations: strictly 1 clean sentence each; hidden on Tier I cards until chosen.
   - Tier IV: universal 9-card Epic Boon deck (pick 1 of 3); zero per-hero T4 clauses.
   - Hero Quests: opt-in only via Quest Board (❖); hidden on base hero cards until accepted.
   - Holy -> Radiant everywhere; Alert/Afterimage -> universal multiplicative Evasion.
*/

const HERO_ORDER = [
  'arthur', 'bram', 'faelan', 'wallaby',
  'dane', 'lorcan', 'juniper', 'rosalind',
  'cinder', 'zark', 'naill', 'nettle',
  'pillar', 'mother_laurel', 'lumen', 'jamison',
  'zoe', 'toot', 'gilthrax', 'gains',
  'velith', 'corvin', 'saint', 'kaska'
];

/* ---------- Universal 12-Class Keyword Registry (13 Canonical Keywords) ---------- */
const CLASS_KW = {
  action_surge:       { n: 'Action Surge',       cls: 'Fighter',   kind: 'Trigger',        c: '#a84a1c', x: 'Fighter keyword. Unleashes an immediate burst of extra combat action when its trigger fires.' },
  channel_divinity:   { n: 'Channel Divinity',   cls: 'Cleric',    kind: 'Trigger',        c: '#b88a1c', x: 'Cleric keyword. Once-per-fight divine miracle; can be reset by Nat 20s or Cleric items.' },
  smite:              { n: 'Smite',              cls: 'Paladin',   kind: 'Trigger',        c: '#c8a02c', x: 'Paladin keyword. Empowers strikes with Radiant or Nature bursts that trigger Smite synergies.' },
  aura:               { n: 'Aura',               cls: 'Paladin',   kind: 'Presence',       c: '#8a7a2c', x: 'Paladin keyword. Radiates a persistent protective or healing zone to nearby allies.' },
  arcane_recovery:    { n: 'Arcane Recovery',    cls: 'Wizard',    kind: 'Trigger',        c: '#2f5a8f', x: 'Wizard keyword. Recovers ability Charge whenever this Wizard’s signature condition occurs.' },
  rage:               { n: 'Rage',               cls: 'Barbarian', kind: 'State',          c: '#a82a1c', x: 'Barbarian keyword. Enters or stacks a fierce combat state driving durability, speed, or immortality.' },
  bardic_inspiration: { n: 'Bardic Inspiration', cls: 'Bard',      kind: 'Token',          c: '#a83a7a', x: 'Bard keyword. Grants an ally an Inspiration Die or Mote of Potential to empower abilities.' },
  wild_shape:         { n: 'Wild Shape',         cls: 'Druid',     kind: 'Transformation', c: '#3c8a4c', x: 'Druid keyword. Channels a primal beast form or living nature aspect.' },
  hunters_mark:       { n: 'Hunter’s Mark',      cls: 'Ranger',    kind: 'Mark',           c: '#3f7a2c', x: 'Ranger keyword. Marked foes take +1d4 bonus damage from every hit (stacks).' },
  sneak_attack:       { n: 'Sneak Attack',       cls: 'Rogue',     kind: 'Trigger',        c: '#3a3a4a', x: 'Rogue keyword. Bonus precision damage against flanked, poisoned, or ambushed foes (1/s).' },
  ki:                 { n: 'Ki',                 cls: 'Monk',      kind: 'Resource',       c: '#2c7a8a', x: 'Monk keyword. 4-pip bar filled by attacking and taking hits; filling it fires an Open Hand Strike.' },
  metamagic:          { n: 'Metamagic',          cls: 'Sorcerer',  kind: 'Resource',       c: '#c4441c', x: 'Sorcerer keyword. 4-pip Sorcery bar filled by casts; filling it fires a free Twinned spell.' },
  hex:                { n: 'Hex',                cls: 'Warlock',   kind: 'Mark',           c: '#7a3fa0', x: 'Warlock keyword. Patron curse amplifying hits, attack speed, or fiery death detonations.' }
};

const classKwOf = k => {
  const d = H[k];
  if (!d) return [];
  if (d.ckw && d.ckw.length) return d.ckw.map(e => e.k);
  return Object.keys(d.kw || {}).filter(x => CLASS_KW[x]);
};

const classKwPill = (kwKey, match, sub) => {
  const K = CLASS_KW[kwKey];
  if (!K) return '';
  const title = `${K.n} (${K.cls} · ${K.kind})${match ? ' — Party Synergy' : ''}`;
  const tip = `${sub ? sub + ' — ' : ''}${K.x}${match ? ' Shares or interacts with a Class Keyword in your party.' : ''}`;
  return `<span class="ckwpill${match ? ' syn' : ''}" style="--kc:${K.c}" data-tn="${esc(title)}" data-tip="${esc(tip)}">${match ? '★ ' : ''}${esc(K.n)}</span>`;
};

/* ---------- v0.23 Tier IV Universal Epic Boons (9-Card Shared Deck) ---------- */
const EPIC_BOONS = {
  irresistible_offense: { k: 'irresistible_offense', n: 'Boon of Irresistible Offense', x: 'All damage dealt ignores AC and SR.' },
  spell_recall:         { k: 'spell_recall',         n: 'Boon of Spell Recall',         x: 'Abilities cast a second time on High and Nat 20.' },
  recovery:             { k: 'recovery',             n: 'Boon of Recovery',             x: 'First time dropping to 0 HP each fight, revive at 50% HP.' },
  combat_prowess:       { k: 'combat_prowess',       n: 'Boon of Combat Prowess',       x: 'Basic attacks heal you for 30% of damage dealt.' },
  fate:                 { k: 'fate',                 n: 'Boon of Fate',                 x: 'Natural 19s count as Nat 20s.' },
  speed:                { k: 'speed',                n: 'Boon of Speed',                x: '+35% Attack Speed and +25% Charge Speed.' },
  fortitude:            { k: 'fortitude',            n: 'Boon of Fortitude',            x: '+40% Max HP and start every fight with a 25% Max HP Ward.' },
  night_spirit:         { k: 'night_spirit',         n: 'Boon of the Night Spirit',     x: '+25% Evasion; evading an attack grants +15 Charge.' },
  dimensional_travel:   { k: 'dimensional_travel',   n: 'Boon of Dimensional Travel',   x: 'Starts combat with +50 Charge and teleports to safety at 40% HP.' }
};
const EPIC_BOON_KEYS = Object.keys(EPIC_BOONS);

/* ---------- v0.23 Single-Class Multiclass Dips (12 Unique Named Map Nodes) ---------- */
const MULTICLASS = {
  Fighter:   { cls: 'Fighter',   node: 'Sparring Grounds',  kw: 'action_surge',       x: 'Make an extra basic attack immediately after casting your ability.' },
  Rogue:     { cls: 'Rogue',     node: 'Thieves’ Guild',    kw: 'sneak_attack',       x: 'Basic attacks deal +1d6 bonus damage against flanked or Exposed foes (1/s).' },
  Cleric:    { cls: 'Cleric',    node: 'Wayside Chapel',    kw: 'channel_divinity',   x: 'Once per fight, when dropping to 0 HP, revive at 25% Max HP.' },
  Paladin:   { cls: 'Paladin',   node: 'Oath Shrine',       kw: 'smite',              x: 'Every 3rd basic attack deals +1d6 Radiant damage.' },
  Wizard:    { cls: 'Wizard',    node: 'Arcane Study',      kw: 'arcane_recovery',    x: 'High and Nat 20 casts recover +25 Charge.' },
  Barbarian: { cls: 'Barbarian', node: 'Berserker’s Cairn', kw: 'rage',               x: 'Dropping below 50% HP grants Rage (+15% damage reduction & +20% Attack Speed).' },
  Bard:      { cls: 'Bard',      node: 'Minstrel’s Stage',  kw: 'bardic_inspiration', x: 'First cast each fight grants the closest ally a d6 Inspiration Die.' },
  Druid:     { cls: 'Druid',     node: 'Sacred Grove',      kw: 'wild_shape',         x: 'Starts every fight with a Primal Ward (20% Max HP) that reflects Thorns.' },
  Ranger:    { cls: 'Ranger',    node: 'Hunter’s Lodge',    kw: 'hunters_mark',       x: 'Every 3rd basic attack applies a stack of Hunter’s Mark (+1d4 damage per hit).' },
  Monk:      { cls: 'Monk',      node: 'Quiet Monastery',   kw: 'ki',                 x: 'Every 4th basic attack deals +2d6 damage and Staggers the target.' },
  Sorcerer:  { cls: 'Sorcerer',  node: 'Leyline Well',      kw: 'metamagic',          x: 'Ability damage and healing are increased by +20%.' },
  Warlock:   { cls: 'Warlock',   node: 'Patron’s Altar',    kw: 'hex',                x: 'First attack applies Hex (+1d4 necrotic on hits; jumps to another foe on death).' }
};
const MULTICLASS_KEYS = Object.keys(MULTICLASS);

function heroKeywords(heroOrKey) {
  const k = typeof heroOrKey === 'string' ? heroOrKey : (heroOrKey && heroOrKey.key);
  const base = classKwOf(k).slice();
  const mc = typeof heroOrKey === 'object' && heroOrKey && heroOrKey.multiclass;
  if (mc && MULTICLASS[mc] && !base.includes(MULTICLASS[mc].kw)) base.push(MULTICLASS[mc].kw);
  return base;
}

/* ---------- Tag definitions (mechanical labels only; zero trait-counting) ---------- */
const TAGDEF = {
  evasion: { n: 'Evasion',      c: '#3d7fa8', x: 'Percent chance to completely evade enemy basic attacks.' },
  charge:  { n: 'Charge',       c: '#2c7a8a', x: 'Generates or refunds ability Charge.' },
  onhit:   { n: 'On-hit',       c: '#8a5a2c', x: 'Multi-hit strikes that trigger on-hit effects repeatedly.' },
  heal:    { n: 'Heal',         c: '#3c8a5c', x: 'Restores allies’ HP.' },
  ward:    { n: 'Ward',         c: '#3d6fa8', x: 'Temporary shield that absorbs damage and necrosis before HP.' },
  radiant: { n: 'Radiant',      c: '#c8a02c', x: 'Rare sacred damage that ignores AC and SR and stops undead rising.' },
  side:    { n: 'Side by side', c: '#7a4a2c', x: 'Rewards standing next to allies on the grid.' },
  backline:{ n: 'Backline',     c: '#5a4a6a', x: 'Leaps behind or targets distant enemy backliners.' },
  gold:    { n: 'Gold',         c: '#b08a1c', x: 'Generates or scales with Gold during the run.' },
  ambush:  { n: 'Ambush',       c: '#3a3a3a', x: 'Uses Stealth or sudden backline burst.' },
  marked:  { n: 'Marked',       c: '#3f7a2c', x: 'Stacking Hunter’s Mark adding +1d4 bonus damage to every hit.' },
  control: { n: 'Control',      c: '#8a6a1c', x: 'Roots, Stuns, Staggers, or Taunts enemies.' },
  poison:  { n: 'Poison',       c: '#4a8a2c', x: 'Stacking damage over time that never fades.' },
  d20:     { n: 'd20',          c: '#a83a7a', x: 'Manipulates ability d20 rolls, Inspiration dice, or Nat 20s.' },
  burn:    { n: 'Burn',         c: '#c4441c', x: 'Fire damage over time that can be fed and detonated.' },
  rage:    { n: 'Rage',         c: '#a82a1c', x: 'Barbarian Rage state driving durability, speed, or immortality.' },
  hex:     { n: 'Hex',          c: '#7a3fa0', x: 'Warlock Patron curse driving fire bursts or attack speed ramps.' },
  necrosis:{ n: 'Necrosis',     c: '#3a2a4a', x: 'Grows a kill threshold from the left end of the health bar.' }
};

const HTAGS = {
  arthur:        ['evasion', 'onhit'],
  bram:          ['heal', 'ward', 'radiant', 'side'],
  faelan:        ['ward', 'charge'],
  wallaby:       ['backline', 'gold', 'ambush'],
  dane:          ['radiant', 'onhit', 'side', 'control'],
  lorcan:        ['marked', 'onhit'],
  juniper:       ['control', 'poison', 'heal'],
  rosalind:      ['d20', 'charge', 'side'],
  cinder:        ['burn', 'charge'],
  zark:          ['rage', 'side', 'control'],
  naill:         ['onhit', 'evasion', 'control'],
  nettle:        ['hex', 'burn', 'onhit'],
  pillar:        ['rage', 'control', 'side'],
  mother_laurel: ['control', 'heal', 'ward', 'side'],
  lumen:         ['radiant', 'hex', 'onhit'],
  jamison:       ['heal', 'ward', 'side'],
  zoe:           ['charge', 'gold'],
  toot:          ['gold', 'd20'],
  gilthrax:      ['ward', 'burn', 'gold'],
  gains:         ['gold', 'charge'],
  velith:        ['ambush', 'poison', 'backline'],
  corvin:        ['ambush', 'onhit', 'marked'],
  saint:         ['necrosis', 'evasion', 'd20'],
  kaska:         ['ambush', 'control', 'heal']
};
const tagsOf = k => HTAGS[k] || [];
const tagPill = (t, n) => {
  const D = TAGDEF[t];
  return D ? `<span class="tag18" style="--tc:${D.c}" data-tn="${esc(D.n)}" data-tip="${esc(D.x)}">${esc(D.n)}${n ? ` <b>${n}</b>` : ''}</span>` : '';
};

/* ---------- 6 Core Packs (24 Heroes; toggleable pre-run!) ---------- */
const PACKS = {
  tavern: {
    n: 'You Meet at a Tavern',
    x: 'Classic, dependable starters driving Evasion, Ward, Charge, Heal, and Backline burst.',
    heroes: ['arthur', 'bram', 'faelan', 'wallaby'],
    item: 'potion_healing',
    ic: 'vial'
  },
  campfire: {
    n: 'Around the Campfire',
    x: 'Wilderness trackers and party bonds built on Radiant Smite, Hunter’s Mark, Root/Poison, and Inspiration.',
    heroes: ['dane', 'lorcan', 'juniper', 'rosalind'],
    item: 'cloak_elvenkind',
    ic: 'cloak'
  },
  beaten: {
    n: 'Off the Beaten Path',
    x: 'Wild outsiders and snowballers fueling Burn, uncapped Bear Rage, Ki flurries, and Infernal Hex.',
    heroes: ['cinder', 'zark', 'naill', 'nettle'],
    item: 'flame_tongue',
    ic: 'fireblade'
  },
  divine: {
    n: 'Divine Intervention',
    x: 'Four registers of faith: Zealot immortality, Verdant drain-cleave, Celestial Radiant Hex, and Peace Bonds.',
    heroes: ['pillar', 'mother_laurel', 'lumen', 'jamison'],
    item: 'mantle_spell_resistance',
    ic: 'cloak'
  },
  market: {
    n: 'Cornering the Market',
    x: 'Economy, hoarding, and item amplifiers powered by Rummage, Bounty Motes, Dragonfire Wards, and Alchemy.',
    heroes: ['zoe', 'toot', 'gilthrax', 'gains'],
    item: 'bag_holding',
    ic: 'brooch'
  },
  surprise: {
    n: 'Surprise Round',
    x: 'Dark ambushers and tricksters leveraging Stealth, Twin-Blade Mark, Illusory Doubles, and Panther Form.',
    heroes: ['velith', 'corvin', 'saint', 'kaska'],
    item: 'cloak_displacement',
    ic: 'cloak'
  }
};
const PACK_ORDER = Object.keys(PACKS);

/* ==========================================================================
   PACK 1: YOU MEET AT A TAVERN
   ========================================================================== */

hero('arthur', {
  name: 'Arthur', fullName: 'Arthur',
  title: 'Human Fighter · Battle Master', cls: 'Fighter', sub: 'Battle Master', anc: 'Human',
  role: 'Damage', reach: 'Melee', rng: 1, ft: 30,
  bio: 'Always first through the tavern door and first to draw steel.',
  attr: { str: 16, dex: 14, con: 14, int: 10, wis: 12, cha: 10 },
  prim: 'str', pair: ['str', 'dex'],
  hp: 112, ac: 14, sr: 11,
  kw: { action_surge: 1 },
  ckw: [
    { k: 'action_surge', sub: 'Counter-Strike', x: 'Whenever Arthur evades an attack, he triggers Action Surge (immediate free Longsword strike).' }
  ],
  f: { baseEvasion: 0.20, arthurSurge: 1 },
  passive: { n: 'Alert', x: 'Grants +20% Evasion.' },
  atk: { n: 'Longsword', d: [1, 8], flat: 3, kind: 'phys', ty: 'slashing', iv: 1.35 },
  abil: {
    n: 'Longbow Volley', cr: 7.5, pa: 10, cut: [6, 13], self: 1,
    one: 'Looses 1–4 arrows at farthest foes (on-hit); High grants +25% Evasion, Nat 20 grants party +35% Evasion.',
    b: [
      'Looses 1 arrow (2d6) at the farthest foe (triggers on-hit).',
      'Looses 2 arrows (2d6 each) at farthest foes (triggers on-hit).',
      'Looses 3 arrows (2d6 each) and gains +25% Evasion (4s).',
      'Looses 4 arrows (2d8 each) and grants the entire party +35% Evasion (5s).'
    ],
    fx(b, u, P) {
      const fs = foes(b, u).filter(x => !x.hidden);
      if (!fs.length) return;
      const count = [1, 2, 3, 4][P];
      const flame = !!(u.questDone && u.key === 'arthur');
      if (flame) {
        const near = fs.slice().sort((a, c) => hd(a, u) - hd(c, u)).slice(0, count);
        b.events.push({ k: 'area', id: u.id, tid: near[0] && near[0].id, shape: 'cone', r: 2, ty: 'fire', ids: near.map(x => x.id) });
        near.forEach(t => {
          hit(b, u, t, roll(P === 3 ? 3 : 2, 8), { kind: 'magic', el: 'fire', ty: 'fire', area: 1, ab: 1 });
          applyStatus(b, u, t, 'burn', 6 + Math.max(0, u.m.dex) * 2);
        });
      } else {
        const far = fs.slice().sort((a, c) => hd(c, u) - hd(a, u));
        for (let i = 0; i < count; i++) {
          const t = far[i % far.length];
          later(b, i * .07, () => {
            if (!u.alive || !t.alive) return;
            b.events.push({ k: 'proj', s: u.id, t: t.id, ty: 'piercing' });
            const got = hit(b, u, t, roll(2, P === 3 ? 8 : 6), { kind: 'phys', ty: 'piercing', ab: 1 });
            if (t.alive) onHit(b, u, t, got);
          });
        }
      }
      if (P === 2) grantTempEvasion(b, u, 0.25, 4, false);
      if (P === 3) {
        friends(b, u).filter(a => !a.minion).forEach(a => grantTempEvasion(b, a, 0.35, 5, true));
        callout(b, u, 'PARTY EVASION +35%!', '#8fd0ff');
      }
    }
  },
  paths: [
    { k: 'vigilance', n: 'Constant Vigilance', attr: 'str', tags: ['evasion'], x: 'Arthur gains +15% Evasion.', f: { specEvasion: 0.15 } },
    { k: 'init_splash', n: 'Roll for Initiative', attr: 'dex', tags: ['evasion', 'charge'], x: 'Allies gain +25 Charge whenever they evade an attack.', f: { initSplash: 1 } }
  ],
  quest: {
    id: 'arthur_q', statKey: 'evades', goal: 12,
    label: 'Evade 12 attacks',
    rewardName: 'Flame Gauntlet',
    rewardDesc: 'Replaces Longbow Volley with Gauntlet Blast (frontline fire cone + Burn, keeping High/Nat 20 Evasion).'
  }
});

hero('bram', {
  name: 'Bram', fullName: 'Bram',
  title: 'Dwarf Cleric · Life Domain', cls: 'Cleric', sub: 'Life Domain', anc: 'Dwarf',
  role: 'Tank', reach: 'Melee', rng: 1, ft: 25,
  bio: 'Stout dwarf priest with a dented hammer, a warm prayer, and boots nailed to the frontline.',
  attr: { str: 14, dex: 10, con: 16, int: 10, wis: 16, cha: 10 },
  prim: 'wis', pair: ['str', 'wis'],
  hp: 132, ac: 15, sr: 14,
  kw: { channel_divinity: 1 },
  ckw: [
    { k: 'channel_divinity', sub: 'Preserve Life', x: 'Once per fight, when an ally drops below 45% HP, bursts heavy healing onto nearby allies.' }
  ],
  f: { preserveLife: 1 },
  atk: { n: 'Warhammer', d: [1, 8], flat: 2, kind: 'phys', ty: 'bludgeoning', iv: 1.55 },
  abil: {
    n: 'Cure Wounds', cr: 7.2, pa: 8, cut: [5, 13], self: 1,
    one: 'Heals closest injured ally; High turns excess healing into Ward, Nat 20 heals adjacent allies & resets Cleric Channel Divinity.',
    b: [
      'Heals the closest injured ally (2d6 + WIS).',
      'Heals the closest injured ally (3d6 + WIS).',
      'Heals the closest injured ally (4d8 + WIS); excess healing becomes Ward.',
      'Heals all adjacent allies (4d8 + WIS) and resets Channel Divinity for all Clerics!'
    ],
    fx(b, u, P) {
      const fr = friends(b, u).filter(a => !a.minion);
      const injured = fr.slice().sort((a, c) => (hpPct(a) < .98 ? 0 : 1) - (hpPct(c) < .98 ? 0 : 1) || hd(a, u) - hd(c, u) || hpPct(a) - hpPct(c));
      const t = injured[0] || u;
      const dice = [[2, 6], [3, 6], [4, 8], [4, 8]][P];
      const baseAmt = (roll(dice[0], dice[1]) + Math.max(0, u.m.wis) * 3) * u.dm;
      const doHeal = a => {
        let amt = baseAmt;
        if (u.f.discipleLife && hpPct(a) < .5) amt *= 1.4;
        const missing = Math.max(0, a.maxHp - a.hp);
        heal(b, u, a, amt, { raw: 1 });
        if (P >= 2 && amt > missing + 1) {
          addWard(b, a, Math.round(amt - missing), a.maxHp * .5, u);
        }
      };
      if (P === 3) {
        const adj = fr.filter(a => hd(a, u) <= 1);
        b.events.push({ k: 'area', id: u.id, shape: 'nova', r: 1, ty: 'radiant', ids: adj.map(x => x.id) });
        adj.forEach(doHeal);
        friends(b, u).filter(a => a.cls === 'Cleric' || a.mc === 'Cleric').forEach(c => { c._cdUsed = 0; c._pres = 0; });
        callout(b, u, 'PRESERVE LIFE RESET!', '#ffe9a0');
      } else {
        b.events.push({ k: 'area', id: u.id, tid: t.id, shape: 'splash', r: 1, ty: 'radiant', ids: [t.id] });
        doHeal(t);
      }
    }
  },
  paths: [
    { k: 'disciple_life', n: 'Disciple of Life', attr: 'wis', tags: ['heal'], x: 'Heals 40% more on allies below half HP.', f: { discipleLife: 1 } },
    { k: 'divine_strike', n: 'Divine Strike', attr: 'str', tags: ['radiant', 'side'], x: 'Bram and adjacent allies add +1d6 Radiant damage to melee attacks.', f: { divineStrike: 1 } }
  ],
  quest: {
    id: 'bram_q', statKey: 'flawlessWins', goal: 3,
    label: 'Win 3 fights with no ally falling',
    rewardName: 'Blessed Ale',
    rewardDesc: 'Adjacent allies start every fight with a heavy Ward.'
  }
});

hero('faelan', {
  name: 'Faelan', fullName: 'Faelan',
  title: 'Elf Wizard · School of Abjuration', cls: 'Wizard', sub: 'School of Abjuration', anc: 'Elf',
  role: 'Support', reach: 'Ranged', rng: 4, ft: 30,
  bio: 'Calm elven abjurer weaving shimmering Wards and turning broken shields into fuel.',
  attr: { str: 8, dex: 12, con: 12, int: 16, wis: 14, cha: 12 },
  prim: 'int', pair: ['int', 'int'],
  hp: 86, ac: 11, sr: 14,
  kw: { arcane_recovery: 1 },
  ckw: [
    { k: 'arcane_recovery', sub: 'Ward Siphon', x: 'Whenever a Ward Faelan placed breaks, she gains +15 Charge.' }
  ],
  f: { abjurer: 1 },
  atk: { n: 'Ray of Frost', d: [1, 8], flat: 1, kind: 'magic', ty: 'cold', iv: 1.5 },
  abil: {
    n: 'Arcane Ward', cr: 10.5, pa: 7, cut: [5, 13], self: 1,
    one: 'Places an INT-scaled Ward on the most-threatened ally; High Wards 2 allies, Nat 20 Wards everyone & recasts.',
    b: [
      'Places a light Arcane Ward on the most-threatened ally.',
      'Places a strong Arcane Ward on the most-threatened ally.',
      'Places Arcane Wards on the 2 most-threatened allies.',
      'Wards the entire party and immediately casts a second Ward on the lowest-HP ally!'
    ],
    fx(b, u, P) {
      const fr = friends(b, u).filter(a => !a.minion);
      const threat = a => (hpPct(a) * 100) + a.ward * .4 - (a.role === 'Tank' ? 14 : 0);
      const ord = fr.slice().sort((a, c) => threat(a) - threat(c));
      const base = [24, 40, 48, 52][P] + Math.max(0, u.m.int) * [5, 7, 8, 9][P];
      const val = Math.round(base * u.dm * chaK(u) * (u.f.projWard ? 1.35 : 1));
      const cap = a => a.maxHp * .7;
      if (P === 3) {
        b.events.push({ k: 'area', id: u.id, shape: 'nova', r: 5, ty: 'force', ids: fr.map(x => x.id) });
        fr.forEach(a => addWard(b, a, val, cap(a), u));
        const low = fr.slice().sort((a, c) => hpPct(a) - hpPct(c))[0];
        if (low) addWard(b, low, val, low.maxHp * .85, u);
        callout(b, u, 'AEGIS OF ABJURATION!', '#8fb4e6');
      } else {
        const list = ord.slice(0, P === 2 ? 2 : 1);
        b.events.push({ k: 'area', id: u.id, tid: list[0] && list[0].id, shape: 'splash', r: 1, ty: 'force', ids: list.map(x => x.id) });
        list.forEach(a => addWard(b, a, val, cap(a), u));
      }
    }
  },
  paths: [
    { k: 'proj_ward', n: 'Projected Ward', attr: 'int', tags: ['ward'], x: 'Arcane Wards are 35% stronger.', f: { projWard: 1 } },
    { k: 'spell_battery', n: 'Spell Battery', attr: 'int', tags: ['ward', 'charge'], x: 'When Faelan’s Ward breaks, that ally gains +25 Charge.', f: { spellBattery: 1 } }
  ],
  quest: {
    id: 'faelan_q', statKey: 'wardAbsorbed', goal: 600,
    label: 'Absorb 600 damage with Wards',
    rewardName: 'Owl Familiar',
    rewardDesc: 'Permanently gains +1 INT after every win.'
  }
});

hero('wallaby', {
  name: 'Wallaby', fullName: 'Wallaby',
  title: 'Halfling Rogue · Thief', cls: 'Rogue', sub: 'Thief', anc: 'Halfling',
  role: 'Damage', reach: 'Melee', rng: 1, ft: 35,
  bio: 'Quick-fingered halfling who slips behind the farthest caster and empties their pockets.',
  attr: { str: 10, dex: 16, con: 12, int: 12, wis: 10, cha: 14 },
  prim: 'dex', pair: ['dex', 'dex'],
  hp: 94, ac: 13, sr: 12,
  kw: { sneak_attack: 1 },
  ckw: [
    { k: 'sneak_attack', sub: 'Backstab', x: 'Basic attacks deal +1d6 Sneak Attack against flanked or debuffed foes (1/s); Backstab counts as a Sneak Attack.' }
  ],
  f: { lucky: 1 },
  passive: { n: 'Lucky', x: 'Rerolls natural 1s on ability rolls.' },
  atk: { n: 'Shortsword', d: [1, 6], flat: 2, kind: 'phys', ty: 'piercing', iv: 1.05 },
  abil: {
    n: 'Backstab', cr: 8.5, pa: 9, cut: [5, 13], self: 1,
    one: 'Leaps behind the farthest foe for heavy piercing burst; High enters Stealth, Nat 20 refunds 100% Charge & +2 Gold.',
    b: [
      'Leaps behind the farthest foe for 3d6 piercing damage.',
      'Leaps behind the farthest foe for 5d6 piercing damage.',
      'Leaps behind the farthest foe for 7d6 piercing and enters Stealth (halving next hit).',
      'Leaps behind the farthest foe for 9d6 piercing, refunds 100% Charge, and pops +2 Gold!'
    ],
    fx(b, u, P) {
      const fs = foes(b, u).filter(x => !x.hidden);
      if (!fs.length) return;
      const t = fs.slice().sort((a, c) => hd(c, u) - hd(a, u))[0];
      const spot = walkNbrs(t).filter(h => freeHex(b, h, u)).sort((a, c) => hd(c, u) - hd(a, u))[0];
      if (spot) { u.c = spot.c; u.r = spot.r; u.target = t; b.events.push({ k: 'leap', id: u.id }); }
      const dice = [3, 5, 7, 9][P];
      hit(b, u, t, roll(dice, 6), { kind: 'phys', ty: 'piercing', melee: 1, ab: 1 });
      triggerSneakAttack(b, u, t, { ability: 1 });
      if (u.f.pickpocket) gainGold(b, u, P === 3 ? 2 : 1, 'PICKPOCKET');
      if (P >= 2) triggerCunningAction(b, u, t, { stealth: 2.5, stealthShield: 1, label: 'STEALTH' });
      if (P === 3) {
        giveCharge(b, u, 100, 1);
        gainGold(b, u, 2, 'JACKPOT');
        callout(b, u, 'CLEAN GETAWAY!', '#ffd76a');
      }
    }
  },
  paths: [
    { k: 'cutthroat', n: 'Cutthroat', attr: 'dex', tags: ['backline', 'charge'], x: 'Kills refund 60% Charge.', f: { cutthroat: 1 } },
    { k: 'pickpocket', n: 'Pickpocket', attr: 'dex', tags: ['gold'], x: 'Backstab steals +1 Gold (doubled on Nat 20).', f: { pickpocket: 1 } }
  ],
  quest: {
    id: 'wallaby_q', statKey: 'itemWins', goal: 3,
    label: 'Win 3 fights holding 2+ items',
    rewardName: 'Use Magic Device',
    rewardDesc: 'Gains +1 item slot and ignores all item class and range locks.'
  }
});

/* ==========================================================================
   PACK 2: AROUND THE CAMPFIRE
   ========================================================================== */

hero('dane', {
  name: 'Sir Dane', fullName: 'Sir Dane',
  title: 'Human Paladin · Oath of Devotion', cls: 'Paladin', sub: 'Oath of Devotion', anc: 'Human',
  role: 'Tank', reach: 'Melee', rng: 1, ft: 30,
  bio: 'Oath-sworn knight who plants his banner, calls out the deadliest foe, and smites in radiant steel.',
  attr: { str: 16, dex: 10, con: 16, int: 10, wis: 12, cha: 14 },
  prim: 'str', pair: ['str', 'cha'],
  hp: 134, ac: 15, sr: 13,
  kw: { smite: 1, aura: 1 },
  ckw: [
    { k: 'smite', sub: 'Divine Smite', x: 'Every 3rd melee attack unleashes a 1d8 Radiant Smite.' },
    { k: 'aura', sub: 'Aura of Devotion', x: 'Adjacent allies gain +1 AC and +1 SR.' }
  ],
  f: { smitePeriodic: 1, auraDevotion: 1 },
  atk: { n: 'Longsword', d: [1, 8], flat: 3, kind: 'phys', ty: 'slashing', iv: 1.4 },
  abil: {
    n: 'Compelled Duel', cr: 7.5, pa: 9, cut: [6, 13], self: 1,
    one: 'Taunts and Smites his target (Radiant); High gains Ward, Nat 20 lets allies Smite his Taunted foe.',
    b: [
      'Taunts his target (3s) and deals a 1d8 Radiant Smite.',
      'Taunts his target (4s) and deals a 2d8 Radiant Smite.',
      'Taunts his target (4s), deals a 2d8 Radiant Smite, and gains a Ward.',
      'Taunts his target (5s), deals a 3d8 Radiant Smite, and allies hitting it unleash bonus 1d8 Radiant Smites!'
    ],
    fx(b, u, P) {
      const fs = foes(b, u).filter(x => !x.hidden);
      if (!fs.length) return;
      const t = (u.target && u.target.alive) ? u.target : fs.sort((a, c) => hd(a, u) - hd(c, u))[0];
      const dur = [3, 4, 4, 5][P] * chaK(u);
      t.st.taunt = Math.max(t.st.taunt || 0, dur);
      t.st.tauntBy = u;
      t.target = u;
      const dice = [1, 2, 2, 3][P];
      triggerSmite(b, u, t, roll(dice, 8), { ab: 1, label: 'COMPELLED DUEL' });
      if (P >= 2) {
        const w = Math.round((32 + Math.max(0, u.m.cha) * 6) * u.dm * chaK(u));
        addWard(b, u, w, u.maxHp * .6, u);
      }
      if (P === 3 && t.alive) {
        t.st.duelCrusade = Math.max(t.st.duelCrusade || 0, 5 * chaK(u));
        callout(b, u, 'CRUSADE DUEL!', '#ffe9a0');
      }
    }
  },
  paths: [
    { k: 'oath_devotion', n: 'Oath of Devotion', attr: 'str', tags: ['radiant', 'control'], x: 'Retaliates with a Radiant Smite whenever his Taunted foe hits him.', f: { oathDevotion: 1 } },
    { k: 'aura_protection', n: 'Aura of Protection', attr: 'cha', tags: ['side'], x: 'Aura of Devotion expands to 2 squares and grants +2 AC and +2 SR.', f: { auraProtection: 1 } }
  ],
  quest: {
    id: 'dane_q', statKey: 'smites', goal: 12,
    label: 'Trigger 12 Smites',
    rewardName: 'Find Steed',
    rewardDesc: 'Transforms into a Large (2×2) mounted knight who opens every fight with a pushing cavalry charge.'
  }
});

hero('lorcan', {
  name: 'Lorcan', fullName: 'Lorcan',
  title: 'Half-Elf Ranger · Hunter', cls: 'Ranger', sub: 'Hunter', anc: 'Half-Elf',
  role: 'Damage', reach: 'Ranged', rng: 5, ft: 35,
  bio: 'Sharp-eyed wilderness tracker who marks priority quarries for the whole party to bring down.',
  attr: { str: 10, dex: 16, con: 12, int: 10, wis: 14, cha: 10 },
  prim: 'dex', pair: ['dex', 'wis'],
  hp: 94, ac: 13, sr: 12,
  kw: { hunters_mark: 1 },
  ckw: [
    { k: 'hunters_mark', sub: 'Quarry Focus', x: 'Marked foes take +1d4 bonus damage from every hit (stacks).' }
  ],
  f: { huntMark: 1 },
  atk: { n: 'Longbow', d: [1, 8], flat: 2, kind: 'phys', ty: 'piercing', iv: 1.3 },
  abil: {
    n: 'Hunter’s Volley', cr: 8.5, pa: 9, cut: [6, 13], self: 1,
    one: 'Applies Hunter’s Mark and fires 1–4 arrows (on-hit); Nat 20 jumps Mark stacks on kill & refunds 50% Charge.',
    b: [
      'Applies Hunter’s Mark and fires 1 arrow (1d8, on-hit).',
      'Applies Hunter’s Mark and fires 1 arrow (2d8, on-hit).',
      'Applies Hunter’s Mark and fires 2 arrows (2d8 each, on-hit).',
      'Applies Hunter’s Mark and fires 4 arrows (2d8 each); on kill, Mark stacks jump & refund 50% Charge!'
    ],
    fx(b, u, P) {
      const fs = foes(b, u).filter(x => !x.hidden);
      if (!fs.length) return;
      const t = (u.target && u.target.alive) ? u.target : fs.sort((a, c) => hd(a, u) - hd(c, u))[0];
      markFoe(b, u, t, 1);
      const count = [1, 1, 2, 4][P];
      const dice = P === 0 ? 1 : 2;
      for (let i = 0; i < count; i++) {
        later(b, i * .08, () => {
          if (!u.alive || !t.alive) return;
          const hadStacks = t.st.markStacks || 1;
          b.events.push({ k: 'proj', s: u.id, t: t.id, ty: 'piercing' });
          const got = hit(b, u, t, roll(dice, 8), { kind: 'phys', ty: 'piercing', ab: 1 });
          if (t.alive) onHit(b, u, t, got);
          if (P === 3 && !t.alive && !u._nat20Jump) {
            u._nat20Jump = 1;
            const nx = alive(b, 'E').sort((a, c) => hd(a, t) - hd(c, t))[0];
            if (nx) markFoe(b, u, nx, hadStacks);
            giveCharge(b, u, 50);
            callout(b, u, 'QUARRY JUMP!', '#9fd86a');
          }
        });
      }
      u._nat20Jump = 0;
    }
  },
  paths: [
    { k: 'colossus_slayer', n: 'Colossus Slayer', attr: 'dex', tags: ['marked', 'onhit'], x: 'Every 3rd attack against a Marked foe deals +2d8 bonus damage.', f: { colossusSlayer: 1 } },
    { k: 'pack_hunter', n: 'Pack Hunter', attr: 'wis', tags: ['marked'], x: 'Hunter’s Mark deals +1d6 per stack instead of +1d4.', f: { packHunter: 1 } }
  ],
  quest: {
    id: 'lorcan_q', statKey: 'markKills', goal: 10,
    label: 'Kill 10 Marked foes',
    rewardName: 'Favoured Enemy',
    rewardDesc: 'Killing an Elite or Boss permanently grants +1 DEX.'
  }
});

hero('juniper', {
  name: 'Juniper', fullName: 'Juniper',
  title: 'Gnome Druid · Circle of the Land', cls: 'Druid', sub: 'Circle of the Land', anc: 'Gnome',
  role: 'Support', reach: 'Ranged', rng: 4, ft: 25,
  bio: 'Moss-cloaked gnome druid who snares enemy clumps in grasping vines and creeping rot.',
  attr: { str: 8, dex: 12, con: 12, int: 12, wis: 16, cha: 12 },
  prim: 'wis', pair: ['wis', 'wis'],
  hp: 90, ac: 11, sr: 15,
  kw: { wild_shape: 1 },
  ckw: [
    { k: 'wild_shape', sub: 'Bramble Aspect', x: 'Nearby allies gain Thorns (5s) whenever Juniper triggers Wild Shape (on High/Nat 20 Entangle).' }
  ],
  f: { naturalRecovery: 1 },
  atk: { n: 'Thorn Whip', d: [1, 8], flat: 1, kind: 'magic', ty: 'poison', iv: 1.45 },
  abil: {
    n: 'Entangle', cr: 8.5, pa: 8, cut: [5, 13], self: 1,
    one: 'Roots an enemy clump with nature damage; High adds Poison & Wild Shape Thorns, Nat 20 Roots frontline & ticks Poison twice.',
    b: [
      'Roots an enemy clump (2s) for 2d6 nature damage.',
      'Roots an enemy clump (3s) for 3d6 nature damage.',
      'Roots an enemy clump (3.5s), applies Poison, and triggers Wild Shape (nearby allies gain Thorns).',
      'Roots the entire enemy frontline (4s), triggers Wild Shape, and triggers all Poison twice!'
    ],
    fx(b, u, P) {
      const fs = foes(b, u).filter(x => !x.hidden);
      if (!fs.length) return;
      const center = fs.slice().sort((a, c) => fs.filter(x => hd(x, c) <= 1).length - fs.filter(x => hd(x, a) <= 1).length)[0];
      const hitFoes = P === 3
        ? fs.slice().sort((a, c) => hd(a, u) - hd(c, u)).slice(0, Math.min(fs.length, 4))
        : fs.filter(x => hd(x, center) <= 1);
      const dur = [2, 3, 3.5, 4][P] * chaK(u);
      const dice = [2, 3, 3, 4][P];
      b.events.push({ k: 'area', id: u.id, tid: center.id, shape: P === 3 ? 'nova' : 'splash', r: P === 3 ? 3 : 1, ty: 'poison', ids: hitFoes.map(x => x.id) });
      hitFoes.forEach(x => {
        hit(b, u, x, roll(dice, 6), { kind: 'magic', ty: 'poison', area: 1, ab: 1 });
        if (x.alive) applyRoot(b, u, x, dur);
        if (P >= 2 && x.alive) applyStatus(b, u, x, 'poison', (P === 3 ? 4 : 3) * chaK(u));
      });
      if (P >= 2) triggerWildShape(b, u, { form: 'Bramble Aspect', dur: 5, thorns: 1 });
      if (P === 3) {
        foes(b, u).filter(x => x.st.poison > 0).forEach(x => {
          const pDmg = Math.max(2, Math.round(x.st.poison * 2));
          hit(b, u, x, pDmg, { dot: 1, ty: 'poison' });
          if (x.alive) hit(b, u, x, pDmg, { dot: 1, ty: 'poison' });
        });
        callout(b, u, 'BRIAR OVERGROWTH!', '#6da670');
      }
    }
  },
  paths: [
    { k: 'overgrowth', n: 'Overgrowth', attr: 'wis', tags: ['control', 'poison'], x: 'Rooted foes take double Poison damage.', f: { overgrowth: 1 } },
    { k: 'circle_land', n: 'Circle of the Land', attr: 'wis', tags: ['control', 'heal'], x: 'Whenever Juniper Roots a foe, heal the lowest-HP ally.', f: { circleLand: 1 } }
  ],
  quest: {
    id: 'juniper_q', statKey: 'rootsApplied', goal: 15,
    label: 'Root 15 enemies',
    rewardName: 'Goodberries',
    rewardDesc: 'Spawns Goodberries each fight that automatically heal allies below 60% HP.'
  }
});

hero('rosalind', {
  name: 'Rosalind', fullName: 'Rosalind',
  title: 'Human Bard · College of Lore', cls: 'Bard', sub: 'College of Lore', anc: 'Human',
  role: 'Support', reach: 'Ranged', rng: 4, ft: 30,
  targetMode: 'closest_ally',
  bio: 'Sharp-tongued troubadour whose verses push allies over the top and take the wind out of foes.',
  attr: { str: 8, dex: 12, con: 12, int: 12, wis: 12, cha: 16 },
  prim: 'cha', pair: ['cha', 'cha'],
  hp: 90, ac: 11, sr: 13,
  kw: { bardic_inspiration: 1 },
  ckw: [
    { k: 'bardic_inspiration', sub: 'Lore Die', x: 'Grants the closest ally an Inspiration Die (adds to their next ability d20 roll and empowers that cast).' }
  ],
  passive: { n: 'Vicious Mockery', x: 'Basic attacks reduce the target’s damage by 20%.' },
  f: {},
  atk: { n: 'Vicious Mockery', d: [1, 8], flat: 0, kind: 'magic', ty: 'psychic', iv: 1.5 },
  abil: {
    n: 'Inspiring Verse', cr: 8.8, pa: 8, cut: [5, 13], self: 1,
    one: 'Grants the closest ally a d6–d10 Inspiration Die + Charge; High inspires 2 allies, Nat 20 inspires everyone.',
    b: [
      'Grants the closest uninspired ally a d6 Inspiration Die and +15 Charge.',
      'Grants the closest uninspired ally a d8 Inspiration Die and +15 Charge.',
      'Grants the 2 closest allies a d8 Inspiration Die and +20 Charge.',
      'Grants the entire party a d10 Inspiration Die and +30 Charge!'
    ],
    fx(b, u, P) {
      const others = friends(b, u).filter(a => a !== u && !a.minion && a.abil);
      if (!others.length) return;
      const ord = others.slice().sort((a, c) => (a.inspDie ? 1 : 0) - (c.inspDie ? 1 : 0) || hd(a, u) - hd(c, u));
      const sides = [6, 8, 8, 10][P];
      const chg = [15, 15, 20, 30][P];
      const list = P === 3 ? ord : ord.slice(0, P === 2 ? 2 : 1);
      b.events.push({ k: 'area', id: u.id, shape: 'nova', r: 4, ty: 'psychic', ids: list.map(x => x.id) });
      list.forEach(a => {
        grantInspDie(b, u, a, sides, u.f.passRound ? 1 : 0);
        giveCharge(b, a, chg, 1);
      });
      if (P === 3) callout(b, u, 'GRAND CRESCENDO!', '#ffd76a');
    }
  },
  paths: [
    { k: 'pass_round', n: 'Pass the Round', attr: 'cha', tags: ['d20'], x: 'When an ally spends an Inspiration Die, it passes to the next closest ally.', f: { passRound: 1 } },
    { k: 'encore', n: 'Encore', attr: 'cha', tags: ['d20', 'charge'], x: 'Allies holding an Inspiration Die gain +35% Charge speed.', f: { encore: 1 } }
  ],
  quest: {
    id: 'rosalind_q', statKey: 'inspSpent', goal: 15,
    label: 'Spend 15 Inspiration dice',
    rewardName: 'Instrument of the Bards',
    rewardDesc: 'Inspired allies count 19s as Nat 20s.'
  }
});

/* ==========================================================================
   PACK 3: OFF THE BEATEN PATH
   ========================================================================== */

hero('cinder', {
  name: 'Cinder', fullName: 'Cinder',
  title: 'Tiefling Sorcerer · Draconic Bloodline', cls: 'Sorcerer', sub: 'Draconic Bloodline', anc: 'Tiefling',
  role: 'Damage', reach: 'Ranged', rng: 4, ft: 30,
  bio: 'Ember-eyed pyromancer who turns crowded battlefields into chain-reacting Twinned Fireballs.',
  attr: { str: 8, dex: 12, con: 12, int: 10, wis: 10, cha: 16 },
  prim: 'cha', pair: ['cha', 'cha'],
  hp: 90, ac: 12, sr: 13,
  kw: { metamagic: 1 },
  ckw: [
    { k: 'metamagic', sub: 'Twinned Spell', x: '4-pip Sorcery bar (+1 per cast); at 4 pips, automatically casts a free Twinned Fireball at another clump.' }
  ],
  f: {},
  atk: { n: 'Fire Bolt', d: [1, 10], flat: 1, kind: 'magic', ty: 'fire', iv: 1.55 },
  abil: {
    n: 'Fireball', cr: 8.2, pa: 9, cut: [6, 13], self: 1,
    one: 'Blasts the densest enemy clump with Fire + Burn; High gains +2 Sorcery, Nat 20 detonates all Burn on the board.',
    b: [
      'Blasts the densest clump (3d6 fire + Burn) and gains +1 Sorcery.',
      'Blasts the densest clump (4d6 fire + Burn) and gains +1 Sorcery.',
      'Blasts the densest clump (5d6 fire + heavy Burn) and gains +2 Sorcery.',
      'Blasts the densest clump (6d6 fire), gains +2 Sorcery, and detonates all Burn on the board!'
    ],
    fx(b, u, P) {
      const hurl = (exclude, isTwin) => {
        const fs = foes(b, u).filter(x => !x.hidden);
        if (!fs.length) return [];
        const cand = exclude ? fs.filter(x => x !== exclude) : fs;
        const pool = cand.length ? cand : fs;
        const center = pool.slice().sort((a, c) => fs.filter(x => hd(x, c) <= 1).length - fs.filter(x => hd(x, a) <= 1).length)[0];
        const hitFoes = fs.filter(x => hd(x, center) <= 1);
        const dice = isTwin ? 4 : [3, 4, 5, 6][P];
        b.events.push({ k: 'area', id: u.id, tid: center.id, shape: 'splash', r: 1, ty: 'fire', ids: hitFoes.map(x => x.id) });
        hitFoes.forEach(x => {
          hit(b, u, x, roll(dice, 6), { kind: 'magic', el: 'fire', ty: 'fire', area: 1, ab: 1 });
          if (x.alive) applyStatus(b, u, x, 'burn', (P >= 2 ? 10 : 6) * chaK(u));
          if (u.f.wildfire && x.alive) expose(b, x, 4 * chaK(u));
        });
        return hitFoes;
      };
      const firstHits = hurl(null, false);
      if (P === 3) {
        foes(b, u).filter(x => x.st.burn >= 1).forEach(x => {
          const det = Math.max(4, Math.round(x.st.burn * 1.4));
          x.st.burn = 0;
          hit(b, u, x, det, { kind: 'magic', ty: 'fire', area: 1, noBonus: 1, ab: 1 });
          u.stats.burnCredit = (u.stats.burnCredit || 0) + 1;
        });
        callout(b, u, 'INFERNO DETONATION!', '#ff6a4a');
      }
      addSorcery(b, u, P >= 2 ? 2 : 1, firstHits[0] || null, hurl);
    }
  },
  paths: [
    { k: 'draconic_surge', n: 'Draconic Surge', attr: 'cha', tags: ['burn', 'charge'], x: 'Enemy Burn ticks fill Cinder’s Sorcery bar.', f: { draconicSurge: 1 } },
    { k: 'wildfire', n: 'Wildfire', attr: 'cha', tags: ['burn', 'control'], x: 'Fireballs also apply Exposed.', f: { wildfire: 1 } }
  ],
  quest: {
    id: 'cinder_q', statKey: 'burnCredit', goal: 15,
    label: 'Apply or detonate Burn 15 times',
    rewardName: 'Dragon’s Hoard',
    rewardDesc: 'Gains +1 CHA per 20 Gold held (cap +6).'
  }
});

hero('zark', {
  name: 'Zark', fullName: 'Zark',
  title: 'Half-Orc Barbarian · Bear Totem', cls: 'Barbarian', sub: 'Totem Warrior (Bear)', anc: 'Half-Orc',
  role: 'Tank', reach: 'Melee', rng: 1, ft: 30,
  bio: 'Scarred half-orc berserker who only gets harder to kill the longer the brawl drags on.',
  attr: { str: 16, dex: 10, con: 16, int: 8, wis: 10, cha: 10 },
  prim: 'str', pair: ['str', 'con'],
  hp: 144, ac: 13, sr: 11,
  kw: { rage: 1 },
  ckw: [
    { k: 'rage', sub: 'Bear Totem', x: 'Each stack of Rage grants +6% damage reduction and +10% attack speed (stacks endlessly).' }
  ],
  f: { bearRage: 1, relentlessEndurance: 1 },
  passive: { n: 'Relentless Endurance', x: 'Once per fight, survives lethal damage at 1 HP.' },
  atk: { n: 'Greataxe', d: [1, 12], flat: 3, kind: 'phys', ty: 'slashing', iv: 1.65 },
  abil: {
    n: 'Bear Cleave', cr: 7.5, pa: 9, cut: [6, 13], self: 1,
    one: 'Sweeps adjacent foes with his greataxe; High gains +1 Rage & heals 10% HP, Nat 20 gains +2 Rage & Stuns.',
    b: [
      'Sweeps adjacent foes for 2d8 slashing.',
      'Sweeps adjacent foes for 3d8 slashing.',
      'Sweeps adjacent foes for 3d10 slashing, gains +1 Rage, and heals 10% max HP.',
      'Sweeps adjacent foes for 4d12 slashing, gains +2 Rage, and Stuns hit foes (1.5s)!'
    ],
    fx(b, u, P) {
      const adj = foes(b, u).filter(x => !x.hidden && hd(x, u) <= 1);
      const list = adj.length ? adj : foes(b, u).filter(x => !x.hidden).sort((a, c) => hd(a, u) - hd(c, u)).slice(0, 1);
      const dice = [[2, 8], [3, 8], [3, 10], [4, 12]][P];
      b.events.push({ k: 'area', id: u.id, shape: 'nova', r: 1, ty: 'slashing', ids: list.map(x => x.id) });
      list.forEach(x => {
        hit(b, u, x, roll(dice[0], dice[1]), { kind: 'phys', ty: 'slashing', melee: 1, area: 1, ab: 1 });
        if (P === 3 && x.alive) stun(b, x, 1.5);
      });
      if (P === 2) {
        addBearRage(b, u, 1);
        heal(b, u, u, Math.round(u.maxHp * .10), { raw: 1 });
      }
      if (P === 3) {
        addBearRage(b, u, 2);
        callout(b, u, 'UNSTOPPABLE BEAR!', '#ff6a4a');
      }
    }
  },
  paths: [
    { k: 'relentless_bear', n: 'Relentless Bear', attr: 'con', tags: ['rage', 'd20'], x: 'Taking a heavy hit grants +2 to Zark’s next ability roll.', f: { relentlessBear: 1 } },
    { k: 'totem_roar', n: 'Totem Roar', attr: 'str', tags: ['rage', 'side'], x: 'Whenever Zark gains Rage, adjacent allies gain +25% attack speed for 4s.', f: { totemRoar: 1 } }
  ],
  quest: {
    id: 'zark_q', statKey: 'bearRagePeak', goal: 4, singleFight: true,
    label: 'Reach 4 Rage in a single fight',
    rewardName: 'Relentless Hide',
    rewardDesc: 'Permanently gains +1 CON after every fight survived below 50% HP.'
  }
});

hero('naill', {
  name: 'Naill', fullName: 'Naill',
  title: 'Wood Elf Monk · Open Hand', cls: 'Monk', sub: 'Way of the Open Hand', anc: 'Wood Elf',
  role: 'Damage', reach: 'Melee', rng: 1, ft: 40,
  bio: 'Blur of fists and wind who turns rapid strikes into staggering Open Hand blows.',
  attr: { str: 10, dex: 16, con: 12, int: 10, wis: 16, cha: 10 },
  prim: 'dex', pair: ['dex', 'wis'],
  hp: 102, ac: 14, sr: 14,
  kw: { ki: 1 },
  ckw: [
    { k: 'ki', sub: 'Open Hand Strike', x: '4-pip Ki bar filled by attacking and taking hits; at 4 pips, unleashes a heavy Staggering blow (triggers on-hit).' }
  ],
  f: { monkNaill: 1 },
  atk: { n: 'Unarmed Strike', d: [1, 6], flat: 2, kind: 'phys', ty: 'bludgeoning', iv: 0.95 },
  abil: {
    n: 'Flurry of Blows', cr: 8.5, pa: 9, cut: [6, 13], self: 1,
    one: 'Unleashes 2–6 rapid strikes (on-hit + Ki); High grants +25% Evasion, Nat 20 grants +50% Evasion.',
    b: [
      'Unleashes 2 rapid unarmed strikes (on-hit, builds Ki).',
      'Unleashes 3 rapid unarmed strikes (on-hit, builds Ki).',
      'Unleashes 4 rapid strikes and gains +25% Evasion (3s).',
      'Unleashes 6 rapid strikes and gains +50% Evasion (4s)!'
    ],
    fx(b, u, P) {
      const count = [2, 3, 4, 6][P];
      for (let i = 0; i < count; i++) {
        later(b, i * .07, () => {
          if (!u.alive) return;
          const t = (u.target && u.target.alive) ? u.target : foes(b, u).filter(x => !x.hidden).sort((a, c) => hd(a, u) - hd(c, u))[0];
          if (!t) return;
          const got = hit(b, u, t, roll(1, 6) + 2, { kind: 'phys', ty: 'bludgeoning', melee: 1, ab: 1 });
          if (t.alive) {
            onHit(b, u, t, got);
            u.ki = Math.min(KI_MAX, (u.ki || 0) + 1);
            if (u.ki >= KI_MAX) fireNaillKiStrike(b, u, t);
          }
        });
      }
      if (P === 2) grantTempEvasion(b, u, 0.25, 3, false);
      if (P === 3) {
        grantTempEvasion(b, u, 0.50, 4, false);
        callout(b, u, 'PATIENT DEFENSE +50%!', '#8fd8d8');
      }
    }
  },
  paths: [
    { k: 'open_hand', n: 'Open Hand', attr: 'dex', tags: ['onhit'], x: 'Open Hand Strike triggers on-hit effects twice.', f: { naillOpenHand: 1 } },
    { k: 'flowing_leaves', n: 'Flowing Leaves', attr: 'wis', tags: ['control'], x: 'Open Hand Strike also Staggers adjacent foes.', f: { flowingLeaves: 1 } }
  ],
  quest: {
    id: 'naill_q', statKey: 'kiStrikes', goal: 15,
    label: 'Trigger 15 Ki strikes',
    rewardName: 'Wraps of the Hundred Fists',
    rewardDesc: 'Open Hand Strike grants Advantage on Naill’s next ability roll.'
  }
});

hero('nettle', {
  name: 'Nettle', fullName: 'Nettle',
  title: 'Halfling Warlock · The Fiend', cls: 'Warlock', sub: 'The Fiend', anc: 'Halfling',
  role: 'Support', reach: 'Ranged', rng: 4, ft: 25,
  bio: 'Smiling halfling diabolist who signs infernal hexes onto foes and watches them pop in hellfire.',
  attr: { str: 8, dex: 12, con: 12, int: 12, wis: 10, cha: 16 },
  prim: 'cha', pair: ['cha', 'cha'],
  hp: 90, ac: 11, sr: 13,
  kw: { hex: 1 },
  ckw: [
    { k: 'hex', sub: 'Infernal Hex', x: 'Cursed foes take +1d6 Fire damage from every hit; on death, explodes in Hellfire (AoE fire) and jumps.' }
  ],
  f: {},
  atk: { n: 'Eldritch Blast', d: [1, 10], flat: 1, kind: 'magic', ty: 'force', iv: 1.45 },
  abil: {
    n: 'Infernal Hex', cr: 9.0, pa: 8, cut: [5, 13], self: 1,
    one: 'Blasts & curses target with Infernal Hex; High adds heavy Burn, Nat 20 curses 3 foes with Hex & Burn.',
    b: [
      'Blasts target (2d8 fire) and applies Infernal Hex.',
      'Blasts target (3d8 fire) and applies Infernal Hex.',
      'Blasts target (3d8 fire), applies Infernal Hex, and inflicts heavy Burn.',
      'Blasts and curses 3 foes with Infernal Hex and heavy Burn!'
    ],
    fx(b, u, P) {
      const fs = foes(b, u).filter(x => !x.hidden);
      if (!fs.length) return;
      const ord = fs.slice().sort((a, c) => (a.st.hex ? 1 : 0) - (c.st.hex ? 1 : 0) || hd(a, u) - hd(c, u));
      const list = P === 3 ? ord.slice(0, 3) : [ord[0]];
      const dice = P === 0 ? 2 : 3;
      list.forEach(t => {
        b.events.push({ k: 'proj', s: u.id, t: t.id, ty: 'fire' });
        hit(b, u, t, roll(dice, 8), { kind: 'magic', el: 'fire', ty: 'fire', ab: 1 });
        if (t.alive) {
          applyNettleHex(b, u, t, true);
          if (P >= 2) applyStatus(b, u, t, 'burn', (P === 3 ? 10 : 8) * chaK(u));
        }
      });
      if (P === 3) callout(b, u, 'INFERNAL CLAUSE!', '#ff7b4a');
    }
  },
  paths: [
    { k: 'fine_print', n: 'Fine Print', attr: 'cha', tags: ['hex', 'burn'], x: 'Hexed foes take double Burn damage.', f: { finePrint: 1 } },
    { k: 'dark_bargain', n: 'Dark One’s Blessing', attr: 'cha', tags: ['hex', 'ward'], x: 'Killing a Hexed foe grants the killer a Ward.', f: { darkBargain: 1 } }
  ],
  quest: {
    id: 'nettle_q', statKey: 'hexDeaths', goal: 10,
    label: 'Trigger 10 Hex deaths',
    rewardName: 'Infernal Contract',
    rewardDesc: 'Each Hex death grants Nettle +1 to ability rolls for the rest of the fight.'
  }
});

/* ==========================================================================
   PACK 4: DIVINE INTERVENTION
   ========================================================================== */

hero('pillar', {
  name: 'Pillar', fullName: 'Pillar',
  title: 'Goliath Barbarian · Zealot', cls: 'Barbarian', sub: 'Path of the Zealot', anc: 'Goliath',
  role: 'Tank', reach: 'Melee', rng: 1, ft: 30,
  bio: 'Towering stone-skinned zealot who simply refuses to die while his faith holds.',
  attr: { str: 16, dex: 10, con: 16, int: 8, wis: 12, cha: 10 },
  prim: 'str', pair: ['str', 'str'],
  hp: 146, ac: 14, sr: 12,
  kw: { rage: 1 },
  ckw: [
    { k: 'rage', sub: 'Zealot Rage', x: 'Cannot drop below 1 HP while Zealot Rage is active (triggered by High/Nat 20 Monument Slam).' }
  ],
  f: { zealot: 1 },
  atk: { n: 'Maul of Faith', d: [1, 10], flat: 3, kind: 'phys', ty: 'bludgeoning', iv: 1.55 },
  abil: {
    n: 'Monument Slam', cr: 7.5, pa: 9, cut: [6, 13], self: 1,
    one: 'Slams his target and Taunts nearby foes; High enters Zealot Rage (3s), Nat 20 line-Stuns & enters Zealot Rage (4s).',
    b: [
      'Slams his target (2d8 bludgeoning) and Taunts nearby foes.',
      'Slams his target (3d8 bludgeoning) and Taunts nearby foes.',
      'Slams his target (3d8 bludgeoning), Taunts nearby foes, and enters Zealot Rage (3s).',
      'Cracks the ground in a line Stun (4d8 bludgeoning, 1.5s), Taunts, and enters Zealot Rage (4s)!'
    ],
    fx(b, u, P) {
      const fs = foes(b, u).filter(x => !x.hidden);
      if (!fs.length) return;
      const t = (u.target && u.target.alive) ? u.target : fs.sort((a, c) => hd(a, u) - hd(c, u))[0];
      taunt(b, u, 2, 3.5 * chaK(u));
      if (P === 3) {
        const lineFoes = fs.filter(x => hd(x, u) <= (u.questDone ? 4 : 3)).slice(0, u.questDone ? 5 : 4);
        b.events.push({ k: 'area', id: u.id, tid: t.id, shape: 'line', r: u.questDone ? 4 : 3, ty: 'bludgeoning', ids: lineFoes.map(x => x.id) });
        lineFoes.forEach(x => {
          hit(b, u, x, roll(4, 8), { kind: 'phys', ty: 'bludgeoning', melee: 1, area: 1, ab: 1 });
          if (x.alive) stun(b, x, 1.5);
        });
        enterZealotRage(b, u, 4);
        callout(b, u, 'UNDYING MONUMENT!', '#ffe9a0');
      } else {
        const dice = P === 0 ? 2 : 3;
        hit(b, u, t, roll(dice, 8), { kind: 'phys', ty: 'bludgeoning', melee: 1, ab: 1 });
        if (P === 2) enterZealotRage(b, u, 3);
      }
    }
  },
  paths: [
    { k: 'unstoppable_faith', n: 'Unstoppable Faith', attr: 'str', tags: ['rage'], x: 'Kills extend Zealot Rage by 1.5s.', f: { unstoppableFaith: 1 } },
    { k: 'living_beacon', n: 'Living Beacon', attr: 'str', tags: ['radiant', 'side'], x: 'Taking a hit adds +1d6 Radiant damage to adjacent allies’ next attack.', f: { livingBeacon: 1 } }
  ],
  quest: {
    id: 'pillar_q', statKey: 'taken', goal: 800,
    label: 'Soak 800 damage',
    rewardName: 'Living Colossus',
    rewardDesc: 'Transforms into a Large (2×2) stone statue with +3 STR and wider Nat 20 shockwaves.'
  }
});

hero('mother_laurel', {
  name: 'Mother Laurel', fullName: 'Mother Laurel',
  title: 'Wood Elf Paladin · Oath of the Ancients', cls: 'Paladin', sub: 'Oath of the Ancients', anc: 'Wood Elf',
  role: 'Tank', reach: 'Melee', rng: 1, ft: 30,
  bio: 'Warden of the elder boughs who cleaves the frontline, binds foes in roots, and drains life for her allies.',
  attr: { str: 16, dex: 10, con: 14, int: 10, wis: 16, cha: 12 },
  prim: 'wis', pair: ['str', 'wis'],
  hp: 132, ac: 14, sr: 14,
  kw: { aura: 1, smite: 1 },
  ckw: [
    { k: 'aura', sub: 'Verdant Aura', x: 'Heals for 40% of all damage she deals; adjacent allies heal for half as much (20%).' },
    { k: 'smite', sub: 'Verdant Smite', x: 'Attacks against Rooted foes deal +1d4 Nature (Magic) Smite damage.' }
  ],
  f: { verdantCleave: 1, verdantAura: 1, verdantSmite: 1 },
  atk: { n: 'Verdant Glaive', d: [1, 6], flat: 2, kind: 'phys', ty: 'slashing', iv: 1.45 },
  abil: {
    n: 'Nature’s Wrath', cr: 8.0, pa: 9, cut: [6, 13], self: 1,
    one: 'Roots adjacent foes with Nature damage; High Smites every Rooted enemy, Nat 20 Roots within 2 squares & Smites twice.',
    b: [
      'Roots adjacent foes (2.5s) for 2d6 Nature damage.',
      'Roots adjacent foes (3s) for 3d6 Nature damage.',
      'Roots adjacent foes (3s, 3d6) and triggers Verdant Smite on every Rooted enemy on the board.',
      'Roots all foes within 2 squares (4s, 4d6) and triggers Verdant Smite on them twice!'
    ],
    fx(b, u, P) {
      const rad = P === 3 ? 2 : 1;
      const near = foes(b, u).filter(x => !x.hidden && hd(x, u) <= rad);
      const list = near.length ? near : foes(b, u).filter(x => !x.hidden).sort((a, c) => hd(a, u) - hd(c, u)).slice(0, 2);
      const dice = [2, 3, 3, 4][P];
      const dur = [2.5, 3, 3, 4][P] * chaK(u);
      b.events.push({ k: 'area', id: u.id, shape: 'nova', r: rad, ty: 'poison', ids: list.map(x => x.id) });
      list.forEach(x => {
        hit(b, u, x, roll(dice, 6), { kind: 'magic', ty: 'poison', area: 1, ab: 1 });
        if (x.alive) applyRoot(b, u, x, dur);
      });
      if (P === 2) {
        foes(b, u).filter(x => x.alive && x.st.root > 0).forEach(x => {
          triggerSmite(b, u, x, roll(1, 6) + Math.max(0, u.m.wis), { kind: 'magic', ty: 'poison', ab: 1, label: 'VERDANT SMITE' });
        });
      }
      if (P === 3) {
        list.forEach(x => {
          if (x.alive) triggerSmite(b, u, x, roll(1, 6) + Math.max(0, u.m.wis), { kind: 'magic', ty: 'poison', ab: 1 });
          if (x.alive) triggerSmite(b, u, x, roll(1, 6) + Math.max(0, u.m.wis), { kind: 'magic', ty: 'poison', ab: 1 });
        });
        callout(b, u, 'WRATH OF THE GROVE!', '#6da670');
      }
    }
  },
  paths: [
    { k: 'overgrowth_ward', n: 'Overgrowth Ward', attr: 'wis', tags: ['heal', 'ward'], x: 'Excess healing becomes Ward.', f: { overgrowthWard: 1 } },
    { k: 'bountiful_vines', n: 'Bountiful Vines', attr: 'str', tags: ['control', 'onhit'], x: 'Allies also trigger Verdant Smite against Rooted foes.', f: { bountifulVines: 1 } }
  ],
  quest: {
    id: 'laurel_q', statKey: 'heal', goal: 600,
    label: 'Heal 600 HP via Verdant Aura',
    rewardName: 'Garden of Plenty',
    rewardDesc: 'Basic attacks also Root her primary target (1s).'
  }
});

hero('lumen', {
  name: 'Lumen', fullName: 'Lumen',
  title: 'Aasimar Warlock · The Celestial', cls: 'Warlock', sub: 'The Celestial', anc: 'Aasimar',
  role: 'Damage', reach: 'Ranged', rng: 4, ft: 30,
  bio: 'Radiant celestial warlock who brands a single quarry and ramps his solar beams to blinding speed.',
  attr: { str: 8, dex: 12, con: 12, int: 10, wis: 12, cha: 16 },
  prim: 'cha', pair: ['cha', 'cha'],
  hp: 92, ac: 12, sr: 14,
  kw: { hex: 1 },
  ckw: [
    { k: 'hex', sub: 'Radiant Hex', x: 'Basic attacks apply stacks of Radiant Hex. Lumen gains +12% Attack Speed per stack against Hexed foes.' }
  ],
  f: { radiantHex: 1 },
  atk: { n: 'Sacred Beam', d: [1, 6], flat: 0, kind: 'radiant', ty: 'radiant', iv: 1.4 },
  abil: {
    n: 'Sunbeam', cr: 8.2, pa: 9, cut: [6, 13], self: 1,
    one: 'Fires a piercing line of Radiant damage; High adds +2 Radiant Hex stacks, Nat 20 fires a double-width Sunbeam twice.',
    b: [
      'Fires a piercing Radiant line (2d6) through his target.',
      'Fires a piercing Radiant line (3d6) through his target.',
      'Fires a piercing Radiant line (4d6) and applies 2 stacks of Radiant Hex to every enemy hit.',
      'Fires a double-width Sunbeam (5d6 Radiant) twice through his target!'
    ],
    fx(b, u, P) {
      const fs = foes(b, u).filter(x => !x.hidden);
      if (!fs.length) return;
      const t = (u.target && u.target.alive) ? u.target : fs.sort((a, c) => hd(a, u) - hd(c, u))[0];
      const fireBeam = (wide, dice) => {
        const curFoes = foes(b, u).filter(x => !x.hidden);
        const line = curFoes.filter(x => x === t || hd(x, t) <= (wide ? 2 : 1)).slice(0, wide ? 5 : 3);
        b.events.push({ k: 'area', id: u.id, tid: t.id, shape: 'line', r: wide ? 4 : 3, ty: 'radiant', ids: line.map(x => x.id) });
        line.forEach(x => {
          hit(b, u, x, roll(dice, 6), { kind: 'radiant', ty: 'radiant', area: 1, ab: 1 });
          if (x.alive && P >= 2) applyRadiantHex(b, u, x, 2);
          if (x.alive && u.questDone && (x.st.radHex || 0) > 0 && hpPct(x) < .20) {
            callout(b, u, 'JUDGEMENT!', '#ffe9a0');
            hit(b, u, x, x.hp + 999, { kind: 'radiant', ty: 'radiant', noBonus: 1, ab: 1 });
          }
        });
      };
      if (P === 3) {
        fireBeam(true, 5);
        later(b, .18, () => { if (u.alive) fireBeam(true, 5); });
        callout(b, u, 'DOUBLE SUNBEAM!', '#ffe9a0');
      } else {
        fireBeam(false, [2, 3, 4][P]);
      }
    }
  },
  paths: [
    { k: 'searing_focus', n: 'Searing Focus', attr: 'cha', tags: ['hex', 'onhit'], x: 'Gains permanent Attack Speed for the fight whenever a Hexed enemy dies.', f: { searingFocus: 1 } },
    { k: 'healing_light', n: 'Healing Light', attr: 'cha', tags: ['radiant', 'heal'], x: 'Basic attacks heal the lowest-HP ally for 25% of damage dealt.', f: { healingLight: 1 } }
  ],
  quest: {
    id: 'lumen_q', statKey: 'radHexApplied', goal: 40,
    label: 'Apply 40 stacks of Radiant Hex',
    rewardName: 'Book of Judgement',
    rewardDesc: 'Sunbeam executes Hexed enemies below 20% HP.'
  }
});

hero('jamison', {
  name: 'Brother Jamison', fullName: 'Brother Jamison',
  title: 'Human Cleric · Peace Domain', cls: 'Cleric', sub: 'Peace Domain', anc: 'Human',
  role: 'Support', reach: 'Melee', rng: 1, ft: 30,
  targetMode: 'closest_ally',
  bio: 'Quiet friar with a wooden staff who ties allies together so every blessing ripples across the party.',
  attr: { str: 10, dex: 10, con: 14, int: 10, wis: 14, cha: 16 },
  prim: 'cha', pair: ['cha', 'cha'],
  hp: 122, ac: 14, sr: 14,
  kw: { channel_divinity: 1 },
  ckw: [
    { k: 'channel_divinity', sub: 'Balm of Peace', x: 'Once per fight, when an ally drops below 50% HP, heals the entire party and Bonds 1 ally.' }
  ],
  passive: { n: 'Gentle Strike', x: 'Basic attacks heal the lowest-HP bonded ally for the damage dealt.' },
  f: { peaceCleric: 1, gentleStrike: 1 },
  atk: { n: 'Quarterstaff', d: [1, 6], flat: 0, kind: 'phys', ty: 'bludgeoning', iv: 1.5 },
  abil: {
    n: 'Emboldening Bond', cr: 8.5, pa: 8, cut: [5, 13], self: 1,
    one: 'Bonds closest unbonded ally & heals bonded allies (30% Heal/Ward share); High bonds 2, Nat 20 bonds entire party.',
    b: [
      'Bonds the closest unbonded ally and lightly heals all bonded allies.',
      'Bonds the closest unbonded ally and heals all bonded allies.',
      'Bonds the 2 closest unbonded allies and heals all bonded allies.',
      'Bonds the entire party with a heavy heal!'
    ],
    fx(b, u, P) {
      const fr = friends(b, u).filter(a => !a.minion);
      u.bonded = u;
      const unb = fr.filter(a => a !== u && a.bonded !== u).sort((a, c) => hd(a, u) - hd(c, u));
      const toBond = P === 3 ? unb : unb.slice(0, P === 2 ? 2 : 1);
      toBond.forEach(a => { a.bonded = u; status(b, a, 'BONDED', '#ffe9a0'); });
      const bonded = fr.filter(a => a.bonded === u);
      const amt = ([12, 18, 22, 34][P] + Math.max(0, u.m.cha) * 3) * u.dm;
      b.events.push({ k: 'area', id: u.id, shape: 'nova', r: 4, ty: 'radiant', ids: bonded.map(x => x.id) });
      bonded.forEach(a => heal(b, u, a, amt, { raw: 1, bondShare: 1 }));
      u.stats.bondedCasts = (u.stats.bondedCasts || 0) + Math.max(1, toBond.length);
      if (P === 3) callout(b, u, 'UNITY OF PEACE!', '#ffe9a0');
    }
  },
  paths: [
    { k: 'shared_grace', n: 'Shared Grace', attr: 'cha', tags: ['heal', 'ward'], x: 'Bonded allies share 50% of Heals and Wards instead of 30%.', f: { sharedGrace: 1 } },
    { k: 'radiant_link', n: 'Radiant Link', attr: 'cha', tags: ['radiant', 'heal'], x: 'Whenever a bonded ally is healed, zap the nearest enemy for 1d6 Radiant.', f: { radiantLink: 1 } }
  ],
  quest: {
    id: 'jamison_q', statKey: 'bondedCasts', goal: 12,
    label: 'Link allies 12 times',
    rewardName: 'Holy Symbol of Pelor',
    rewardDesc: 'Starts every fight with his 2 closest allies already Bonded.'
  }
});

/* ==========================================================================
   PACK 5: CORNERING THE MARKET
   ========================================================================== */

hero('zoe', {
  name: 'Zoe', fullName: 'Zoe',
  title: 'Human Fighter · Rune Knight', cls: 'Fighter', sub: 'Rune Knight', anc: 'Human',
  role: 'Support', reach: 'Melee', rng: 1, ft: 30,
  bio: 'Quartermaster-smith hauling a bottomless pack of spare common gear for whoever needs it mid-fight.',
  attr: { str: 14, dex: 10, con: 14, int: 16, wis: 10, cha: 12 },
  prim: 'int', pair: ['str', 'int'],
  hp: 116, ac: 14, sr: 12,
  kw: { action_surge: 1 },
  ckw: [
    { k: 'action_surge', sub: 'Emergency Quartermaster', x: 'First time any ally drops below 50% HP each fight, triggers Action Surge to toss them a free Rummage item.' }
  ],
  f: { zoeQuartermaster: 1 },
  atk: { n: 'Runed Hammer', d: [1, 8], flat: 2, kind: 'phys', ty: 'bludgeoning', iv: 1.45 },
  abil: {
    n: 'Rummage', cr: 8.5, pa: 8, cut: [5, 13], self: 1,
    one: 'Tosses a random temporary Common item to an ally for the fight; High tosses to 2, Nat 20 equips party & refreshes once-per-fight items.',
    b: [
      'Tosses a random temporary Common item to an ally for this fight.',
      'Tosses a random temporary Common item to an ally for this fight.',
      'Tosses random temporary Common items to 2 allies for this fight.',
      'Tosses random temporary Common items to the entire party and refreshes all once-per-fight items!'
    ],
    fx(b, u, P) {
      const fr = friends(b, u).filter(a => !a.minion);
      const ord = fr.slice().sort((a, c) => ((a.tempItems && a.tempItems.length) || 0) - ((c.tempItems && c.tempItems.length) || 0) || hpPct(a) - hpPct(c));
      const baseN = P === 3 ? fr.length : (P === 2 ? 2 : 1);
      const extra = u.questDone ? 1 : 0;
      const targets = [];
      for (let i = 0; i < baseN + extra; i++) targets.push(ord[i % ord.length]);
      b.events.push({ k: 'area', id: u.id, shape: 'nova', r: 4, ty: 'force', ids: [...new Set(targets)].map(x => x.id) });
      triggerZoeRummage(b, u, targets);
      u.stats.rummageCasts = (u.stats.rummageCasts || 0) + 1;
      if (P === 3) {
        fr.forEach(a => {
          a._potionUsed = 0; a._ringEvUsed = 0; a._woundRageUsed = 0;
          a._moonSickleUsed = 0; a._periaptUsed = 0; a._berryUsed = 0;
        });
        callout(b, u, 'FULLY STOCKED!', '#ffd76a');
      }
    }
  },
  paths: [
    { k: 'rune_carver', n: 'Rune Carver', attr: 'str', tags: ['gold'], x: 'Rummaged items are inscribed with Runes, doubling their stats.', f: { runeCarver: 1 } },
    { k: 'just_the_thing', n: 'Just the Thing', attr: 'int', tags: ['charge', 'gold'], x: 'Allies carrying 2+ real items gain +25% Charge speed.', f: { justTheThing: 1 } }
  ],
  quest: {
    id: 'zoe_q', statKey: 'rummageCasts', goal: 12,
    label: 'Cast Rummage 12 times',
    rewardName: 'Grand Opening',
    rewardDesc: 'Rummage always tosses an extra item.'
  }
});

hero('toot', {
  name: 'Toot', fullName: 'Toot',
  title: 'Plasmoid Bard · College of Creation', cls: 'Bard', sub: 'College of Creation', anc: 'Plasmoid',
  role: 'Support', reach: 'Ranged', rng: 4, ft: 0,
  targetMode: 'closest_ally',
  bio: 'Stationary gelatinous trumpeter who deals zero weapon damage, dancing in place for tips and kill-bounty Motes.',
  attr: { str: 8, dex: 12, con: 12, int: 10, wis: 10, cha: 16 },
  prim: 'cha', pair: ['cha', 'cha'],
  hp: 94, ac: 11, sr: 12,
  kw: { bardic_inspiration: 1 },
  ckw: [
    { k: 'bardic_inspiration', sub: 'Mote of Potential', x: 'Empowers an ally’s next damaging ability with +1d8 bonus damage — popping +2 Gold if it kills.' }
  ],
  f: {},
  atk: { n: 'Brass Solo', d: [0, 0], flat: 0, kind: 'magic', ty: 'thunder', iv: 1.55 },
  abil: {
    n: 'Fanfare', cr: 8.5, pa: 8, cut: [5, 13], self: 1,
    one: 'Sends a bounty Mote of Potential to the closest ally; High sends 2 Motes, Nat 20 sends Motes to everyone.',
    b: [
      'Sends a Mote of Potential to the closest ally.',
      'Sends a Mote of Potential to the closest ally.',
      'Sends Motes of Potential to the 2 closest allies.',
      'Sends Motes of Potential to the entire party!'
    ],
    fx(b, u, P) {
      const others = friends(b, u).filter(a => a !== u && !a.minion && a.abil);
      if (!others.length) return;
      const ord = others.slice().sort((a, c) => (a.inspMote ? 1 : 0) - (c.inspMote ? 1 : 0) || hd(a, u) - hd(c, u));
      const list = P === 3 ? ord : ord.slice(0, P === 2 ? 2 : 1);
      const chg = u.questDone ? 20 : 0;
      b.events.push({ k: 'area', id: u.id, shape: 'nova', r: 4, ty: 'thunder', ids: list.map(x => x.id) });
      list.forEach(a => grantInspMote(b, u, a, chg));
      if (P === 3) callout(b, u, 'ENCORE FANFARE!', '#ffd76a');
    }
  },
  paths: [
    { k: 'busker', n: 'Busker’s Rhythm', attr: 'cha', tags: ['gold'], x: 'Gains +15% Attack Speed for each Gold earned this fight.', f: { busker: 1 } },
    { k: 'street_performer', n: 'Street Performer', attr: 'cha', tags: ['gold', 'd20'], x: 'Allies have a chance to pop +1 Gold whenever they roll a High or Nat 20.', f: { streetPerformer: 1 } }
  ],
  quest: {
    id: 'toot_q', statKey: 'gold', goal: 15,
    label: 'Earn 15 Gold in combat',
    rewardName: 'Record Deal',
    rewardDesc: 'Motes also grant +20 Charge when received.'
  }
});

hero('gilthrax', {
  name: 'Gilthrax', fullName: 'Gilthrax',
  title: 'Gold Dragonborn Fighter · Eldritch Knight', cls: 'Fighter', sub: 'Eldritch Knight', anc: 'Dragonborn',
  role: 'Tank', reach: 'Melee', rng: 1, ft: 30,
  bio: 'Gilded dragonborn bodyguard whose ward swells with his gear and explodes into dragonfire when broken.',
  attr: { str: 16, dex: 10, con: 16, int: 12, wis: 10, cha: 12 },
  prim: 'str', pair: ['str', 'con'],
  hp: 138, ac: 15, sr: 12,
  kw: { action_surge: 1 },
  ckw: [
    { k: 'action_surge', sub: 'Dragon’s Retort', x: 'Whenever Gilthrax’s Ward breaks, triggers Action Surge — breathing Fire + Burn equal to absorbed damage.' }
  ],
  f: { gilthraxWard: 1 },
  atk: { n: 'Gilded Greataxe', d: [1, 10], flat: 2, kind: 'phys', ty: 'slashing', iv: 1.55 },
  abil: {
    n: 'Arcane Shield', cr: 7.5, pa: 9, cut: [6, 13], self: 1,
    one: 'Raises a Ward scaling with item rarity/value & Taunts adjacent foes; High raises a bigger Ward, Nat 20 also breathes Fire.',
    b: [
      'Raises a Ward scaling with equipped item value and Taunts adjacent foes.',
      'Raises a strong Ward scaling with equipped item value and Taunts adjacent foes.',
      'Raises a heavy Ward (storing larger Fire Breath) and Taunts adjacent foes.',
      'Raises a massive Ward, Taunts, and immediately unleashes a wide Fire Breath + Burn cone!'
    ],
    fx(b, u, P) {
      const w = gilthraxWardAmount(u, P);
      addWard(b, u, w, u.maxHp * 1.1, u);
      taunt(b, u, 1, 3.5 * chaK(u));
      if (P === 3) {
        triggerGilthraxBreath(b, u, w, true);
      }
    }
  },
  paths: [
    { k: 'gilded_hoard', n: 'Gilded Hoard', attr: 'con', tags: ['ward', 'gold'], x: 'Gains +2 AC per item equipped (doubled for Rare and higher items).', f: { gildedHoard: 1 } },
    { k: 'bodyguard_fee', n: 'Bodyguard’s Fee', attr: 'str', tags: ['burn', 'charge'], x: 'Unleashing Fire Breath grants adjacent allies +20 Charge.', f: { bodyguardFee: 1 } }
  ],
  quest: {
    id: 'gilthrax_q', statKey: 'wardAbs', goal: 400,
    label: 'Absorb 400 Ward damage',
    rewardName: 'Gems, Glorious Gems',
    rewardDesc: 'Starts every fight with a free Arcane Shield.'
  }
});

hero('gains', {
  name: 'Gains', fullName: 'Gains',
  title: 'Tiefling Wizard · Transmutation', cls: 'Wizard', sub: 'School of Transmutation', anc: 'Tiefling',
  role: 'Damage', reach: 'Ranged', rng: 4, ft: 30,
  bio: 'Calculating alchemist-wizard whose slow beams transmute enemies into cold hard Gold.',
  attr: { str: 8, dex: 10, con: 12, int: 16, wis: 12, cha: 14 },
  prim: 'int', pair: ['int', 'int'],
  hp: 88, ac: 11, sr: 13,
  kw: { arcane_recovery: 1 },
  ckw: [
    { k: 'arcane_recovery', sub: 'Transmutation', x: 'Whenever Gold drops in combat, Gains recovers +15 Charge.' }
  ],
  f: { transmuter: 1, goldBolt: 1 },
  atk: { n: 'Alchemical Bolt', d: [1, 6], flat: 0, kind: 'magic', ty: 'force', iv: 1.75 },
  abil: {
    n: 'Gilded Beam', cr: 5.8, pa: 10, cut: [6, 13], self: 1,
    one: 'Heavy force beam marking target Gilded (+1 Gold on death); High hits 2 foes, Nat 20 scales with Gold held & Gilds nearby.',
    b: [
      'Fires a heavy force beam (3d8) and marks the foe Gilded (+1 Gold on death).',
      'Fires a heavy force beam (4d8) and marks the foe Gilded (+1 Gold on death).',
      'Fires heavy force beams (5d8) at 2 foes and marks both Gilded.',
      'Blasts target (6d8 + Gold held) and marks nearby foes Gilded!'
    ],
    fx(b, u, P) {
      const fs = foes(b, u).filter(x => !x.hidden);
      if (!fs.length) return;
      const ord = fs.slice().sort((a, c) => (a.st.gilded ? 1 : 0) - (c.st.gilded ? 1 : 0) || c.hp - a.hp);
      const list = P === 2 ? ord.slice(0, 2) : [ord[0]];
      const dice = [3, 4, 5, 6][P];
      const goldBonus = P === 3 ? Math.min(45, (u.goldHeld || 0)) : 0;
      list.forEach(t => {
        b.events.push({ k: 'proj', s: u.id, t: t.id, ty: 'force' });
        hit(b, u, t, roll(dice, 8) + goldBonus, { kind: 'magic', ty: 'force', ab: 1 });
        if (t.alive) { t.st.gilded = u; status(b, t, 'GILDED', '#ffd76a'); }
      });
      if (P === 3 && list[0]) {
        foes(b, u).filter(x => hd(x, list[0]) <= 2).forEach(x => { x.st.gilded = u; status(b, x, 'GILDED', '#ffd76a'); });
        callout(b, u, 'MIDAS RAY!', '#ffd76a');
      }
    }
  },
  paths: [
    { k: 'compound_interest', n: 'Compound Interest', attr: 'int', tags: ['gold', 'd20'], x: 'Gains +1 to ability rolls per 10 Gold held (max +5).', f: { compoundInterest: 1 } },
    { k: 'liquid_assets', n: 'Liquid Assets', attr: 'int', tags: ['gold', 'charge'], x: 'Gains’s Arcane Recovery also grants +10 Charge to all allies.', f: { liquidAssets: 1 } }
  ],
  quest: {
    id: 'gains_q', statKey: 'gildedKills', goal: 10,
    label: 'Slay 10 Gilded enemies',
    rewardName: 'Golden Goose',
    rewardDesc: 'Earn +10% Gold interest (up to +5g) after every win.'
  }
});

/* ==========================================================================
   PACK 6: SURPRISE ROUND
   ========================================================================== */

hero('velith', {
  name: 'Velith', fullName: 'Velith',
  title: 'Drow Rogue · Assassin', cls: 'Rogue', sub: 'Assassin', anc: 'Drow',
  role: 'Damage', reach: 'Melee', rng: 1, ft: 35,
  bio: 'Silent drow killer who opens from shadows with venom and finishes wounded prey.',
  attr: { str: 10, dex: 16, con: 12, int: 12, wis: 12, cha: 12 },
  prim: 'dex', pair: ['dex', 'dex'],
  hp: 94, ac: 13, sr: 13,
  kw: { sneak_attack: 1 },
  ckw: [
    { k: 'sneak_attack', sub: 'Venomous Strike', x: 'Attacks from Stealth or against Poisoned foes deal +1d6 Sneak Attack and apply Poison (1/s).' }
  ],
  passive: { n: 'Assassinate', x: 'Starts every fight in Stealth (untargetable for 3s).' },
  f: { assassinate: 1 },
  atk: { n: 'Venom Dagger', d: [1, 6], flat: 2, kind: 'phys', ty: 'piercing', iv: 1.05 },
  abil: {
    n: 'Cloak of Darkness', cr: 8.5, pa: 9, cut: [5, 13], self: 1,
    one: 'Strikes target with Poison; High re-enters Stealth (3s), Nat 20 executes <25% HP & chains to a second foe.',
    b: [
      'Strikes her target (3d6 piercing) and applies Poison.',
      'Strikes her target (4d6 piercing) and applies Poison.',
      'Strikes her target (6d6 piercing), applies Poison, and re-enters Stealth (3s).',
      'Strikes for 8d6 piercing, executes foes below 25% HP, and chains to a second foe!'
    ],
    fx(b, u, P) {
      const strikeOne = t => {
        if (!t || !t.alive) return;
        const dice = [3, 4, 6, 8][P];
        hit(b, u, t, roll(dice, 6), { kind: 'phys', ty: 'piercing', melee: 1, ab: 1 });
        if (t.alive) applyStatus(b, u, t, 'poison', (P >= 2 ? 4 : 2) * chaK(u));
        triggerSneakAttack(b, u, t, { ability: 1, venom: 1 });
        if (P === 3 && t.alive && hpPct(t) < .25) {
          callout(b, u, 'ASSASSINATE!', '#c48fe6');
          hit(b, u, t, t.hp + 999, { kind: 'radiant', ty: 'piercing', noBonus: 1, ab: 1 });
        }
      };
      const fs = foes(b, u).filter(x => !x.hidden);
      if (!fs.length) return;
      const t = (u.target && u.target.alive) ? u.target : fs.sort((a, c) => hpPct(a) - hpPct(c))[0];
      strikeOne(t);
      if (P >= 2) triggerCunningAction(b, u, t, { stealth: 3, label: 'SHADOW CLOAK' });
      if (P === 3) {
        const next = foes(b, u).filter(x => x !== t && x.alive && !x.hidden).sort((a, c) => hpPct(a) - hpPct(c))[0];
        if (next) {
          const spot = walkNbrs(next).filter(h => freeHex(b, h, u))[0];
          if (spot) { u.c = spot.c; u.r = spot.r; u.target = next; b.events.push({ k: 'leap', id: u.id }); }
          later(b, .12, () => { if (u.alive && next.alive) strikeOne(next); });
        }
      }
    }
  },
  paths: [
    { k: 'first_blood', n: 'First Blood', attr: 'dex', tags: ['ambush', 'd20'], x: 'Starts every fight with Advantage on her first ability roll.', f: { firstBlood: 1 } },
    { k: 'nightshade', n: 'Nightshade Vials', attr: 'dex', tags: ['poison', 'control'], x: 'Velith’s Poison also applies Exposed.', f: { nightshade: 1 } }
  ],
  quest: {
    id: 'velith_q', statKey: 'kills', goal: 12,
    label: 'Score 12 kills',
    rewardName: 'Death’s Ledger',
    rewardDesc: 'Permanently gains +1 DEX for every 4 kills thereafter.'
  }
});

hero('corvin', {
  name: 'Corvin', fullName: 'Corvin',
  title: 'Human Ranger · Gloom Stalker', cls: 'Ranger', sub: 'Gloom Stalker', anc: 'Human',
  role: 'Damage', reach: 'Melee', rng: 1, ft: 35,
  bio: 'Twin-bladed ambush hunter who opens fast and shreds Marked foes with a blur of steel.',
  attr: { str: 12, dex: 16, con: 12, int: 10, wis: 14, cha: 10 },
  prim: 'dex', pair: ['dex', 'wis'],
  hp: 102, ac: 14, sr: 12,
  kw: { hunters_mark: 1 },
  ckw: [
    { k: 'hunters_mark', sub: 'Quarry Focus', x: 'Marked foes take +1d4 bonus damage from every hit (stacks).' }
  ],
  passive: { n: 'Dread Ambusher', x: 'Starts every fight with +35 Charge.' },
  f: { dreadAmbusher: 1 },
  atk: { n: 'Twin Shortswords', d: [1, 6], flat: 1, kind: 'phys', ty: 'slashing', iv: 1.35, hits: 2 },
  abil: {
    n: 'Dread Ambush', cr: 8.5, pa: 9, cut: [6, 13], self: 1,
    one: 'Applies Hunter’s Mark & unleashes 2–4 melee strikes (on-hit); High enters Stealth, Nat 20 spawns a Shadow Echo.',
    b: [
      'Applies Hunter’s Mark and unleashes 2 rapid melee strikes (on-hit).',
      'Applies Hunter’s Mark and unleashes 3 rapid melee strikes (on-hit).',
      'Applies Hunter’s Mark, unleashes 3 rapid strikes, and enters Stealth (2s).',
      'Applies Hunter’s Mark, unleashes 4 rapid strikes, and spawns a Shadow Echo repeating the spin!'
    ],
    fx(b, u, P) {
      const fs = foes(b, u).filter(x => !x.hidden);
      if (!fs.length) return;
      const t = (u.target && u.target.alive) ? u.target : fs.sort((a, c) => hd(a, u) - hd(c, u))[0];
      markFoe(b, u, t, 1);
      if (u.f.firstStrike && b.time <= 5 && !u._fsUsed) {
        u._fsUsed = 1;
        friends(b, u).filter(a => !a.minion).forEach(a => giveCharge(b, a, 15, 1));
        status(b, u, 'FIRST STRIKE +15 CHG', '#9fd86a');
      }
      const spin = (delayBase, count) => {
        for (let i = 0; i < count; i++) {
          later(b, delayBase + i * .07, () => {
            if (!u.alive) return;
            const cur = t.alive ? t : foes(b, u).filter(x => !x.hidden).sort((a, c) => hd(a, u) - hd(c, u))[0];
            if (!cur) return;
            const got = hit(b, u, cur, roll(1, 8) + 2, { kind: 'phys', ty: 'slashing', melee: 1, ab: 1 });
            u.stats.ambushStrikes = (u.stats.ambushStrikes || 0) + 1;
            if (cur.alive) onHit(b, u, cur, got);
          });
        }
      };
      const count = [2, 3, 3, 4][P];
      spin(0, count);
      if (P >= 2) triggerCunningAction(b, u, t, { stealth: 2, label: 'GLOOM STEALTH' });
      if (P === 3 || (P === 2 && u.questDone)) {
        spin(count * .07 + .12, count);
        callout(b, u, 'SHADOW ECHO!', '#c48fe6');
      }
    }
  },
  paths: [
    { k: 'stalker_flurry', n: 'Stalker’s Flurry', attr: 'dex', tags: ['onhit'], x: 'Every 3rd basic attack spawns a bonus +1d6 shadow slash.', f: { stalkerFlurry: 1 } },
    { k: 'first_strike', n: 'First Strike', attr: 'wis', tags: ['ambush', 'charge'], x: 'Casting Dread Ambush in the first 5s grants all allies +15 Charge.', f: { firstStrike: 1 } }
  ],
  quest: {
    id: 'corvin_q', statKey: 'ambushStrikes', goal: 25,
    label: 'Land 25 Dread Ambush strikes',
    rewardName: 'Twin Blades of the Gloom',
    rewardDesc: 'High rolls also spawn a Shadow Echo.'
  }
});

hero('saint', {
  name: 'Saint', fullName: 'Saint',
  title: 'Half-Elf Cleric · Trickery Domain', cls: 'Cleric', sub: 'Trickery Domain', anc: 'Half-Elf',
  role: 'Support', reach: 'Ranged', rng: 4, ft: 30,
  bio: 'Velvet-voiced trickster priest ringing funeral bells alongside a shimmering double.',
  attr: { str: 8, dex: 12, con: 12, int: 12, wis: 16, cha: 14 },
  prim: 'wis', pair: ['wis', 'cha'],
  hp: 94, ac: 12, sr: 14,
  kw: { channel_divinity: 1 },
  ckw: [
    { k: 'channel_divinity', sub: 'Invoke Duplicity', x: 'Once per fight, summons an Illusory Double that absorbs 1 hit and echoes Saint’s next Toll the Dead.' }
  ],
  f: {},
  atk: { n: 'Bell of Passing', d: [1, 8], flat: 1, kind: 'magic', ty: 'necrotic', iv: 1.45 },
  abil: {
    n: 'Toll the Dead', cr: 8.5, pa: 8, cut: [5, 13], self: 1,
    one: 'Inflicts necrotic damage + Necrosis (d12 vs wounded); High refreshes Invoke Duplicity, Nat 20 also Staggers & Exposes farthest foe.',
    b: [
      'Rings the bell for 2d8 (2d12 if wounded) necrotic + Necrosis.',
      'Rings the bell for 3d8 (3d12 if wounded) necrotic + Necrosis.',
      'Rings the bell for 3d8/3d12 necrotic + Necrosis and refreshes Invoke Duplicity.',
      'Rings the bell for 4d8/4d12 necrotic + Necrosis, refreshes Invoke Duplicity, and Staggers + Exposes farthest foe!'
    ],
    fx(b, u, P) {
      const fs = foes(b, u).filter(x => !x.hidden);
      if (!fs.length) return;
      const ringOn = t => {
        if (!t || !t.alive) return;
        const wounded = t.hp < t.maxHp * .99;
        const dieS = wounded ? 12 : 8;
        const dice = [2, 3, 3, 4][P];
        const nec = [10, 14, 18, 22][P] + Math.max(0, u.m.wis) * 2;
        b.events.push({ k: 'proj', s: u.id, t: t.id, ty: 'necrotic' });
        hit(b, u, t, roll(dice, dieS), { kind: 'magic', ty: 'necrotic', nec, ab: 1 });
      };
      const t = fs.slice().sort((a, c) => hpPct(a) - hpPct(c))[0];
      ringOn(t);
      u.stats.saintCasts = (u.stats.saintCasts || 0) + 1;
      // If Invoke Duplicity hasn't been used yet, activate it; if a Double is active, it echoes!
      if (u.illusoryDouble > 0) {
        const echoT = fs.filter(x => x !== t && x.alive)[0] || t;
        later(b, .18, () => { if (u.alive && echoT.alive) { status(b, u, 'DOUBLE ECHO', '#c48fe6'); ringOn(echoT); } });
      } else if (!u._cdUsed) {
        triggerSaintCD(b, u);
      }
      if (P >= 2) {
        u._cdUsed = 0;
        triggerSaintCD(b, u);
      }
      if (P === 3) {
        const far = foes(b, u).filter(x => !x.hidden).sort((a, c) => hd(c, u) - hd(a, u))[0];
        if (far && far.alive) {
          stagger(b, far, 3 * chaK(u));
          expose(b, far, 4 * chaK(u));
        }
        callout(b, u, 'FUNERAL CHIME!', '#c48fe6');
      }
    }
  },
  paths: [
    { k: 'two_faced', n: 'Two-Faced', attr: 'wis', tags: ['necrosis'], x: 'When Saint’s Illusory Double breaks, it inflicts 12 Necrosis on the attacker.', f: { twoFaced: 1 } },
    { k: 'smoke_mirrors', n: 'Smoke & Mirrors', attr: 'cha', tags: ['evasion', 'heal'], x: 'Whenever an ally evades an attack, heal them for 10% max HP.', f: { smokeMirrors: 1 } }
  ],
  quest: {
    id: 'saint_q', statKey: 'saintCasts', goal: 12,
    label: 'Cast Toll the Dead 12 times',
    rewardName: 'Mirror Image',
    rewardDesc: 'Saint can hold 2 Illusory Doubles at once.'
  }
});

hero('kaska', {
  name: 'Kaska', fullName: 'Kaska',
  title: 'Half-Orc Druid · Circle of the Moon', cls: 'Druid', sub: 'Circle of the Moon', anc: 'Half-Orc',
  role: 'Support', reach: 'Melee', rng: 1, ft: 35,
  bio: 'Silver-eyed moon druid who bounds into battle as a panther and tears open gaps for the pack.',
  attr: { str: 16, dex: 12, con: 14, int: 10, wis: 16, cha: 10 },
  prim: 'wis', pair: ['str', 'wis'],
  hp: 124, ac: 14, sr: 13,
  kw: { wild_shape: 1 },
  ckw: [
    { k: 'wild_shape', sub: 'Panther Form', x: 'Starts every fight in Panther Form with a separate Beast HP bar (reverts when Beast HP breaks).' }
  ],
  f: { pantherForm: 1 },
  atk: { n: 'Panther Claws / Thorn Whip', d: [1, 8], flat: 2, kind: 'phys', ty: 'slashing', iv: 1.3 },
  abil: {
    n: 'Moonlit Pounce', cr: 8.2, pa: 9, cut: [6, 13], self: 1,
    one: 'Leaps onto a foe dealing slashing damage & Exposed; High re-shifts Panther Form, Nat 20 Stuns, re-shifts & heals party.',
    b: [
      'Pounces target for 2d8 slashing and applies Exposed (3s).',
      'Pounces target for 3d8 slashing and applies Exposed (4s).',
      'Pounces for 3d8 + Exposed and re-shifts into Panther Form (fresh Beast HP).',
      'Stuns target (2s), re-shifts into Panther Form, and heals the entire party!'
    ],
    fx(b, u, P) {
      const fs = foes(b, u).filter(x => !x.hidden);
      if (!fs.length) return;
      const t = (u.target && u.target.alive) ? u.target : fs.slice().sort((a, c) => hd(c, u) - hd(a, u))[0];
      const spot = walkNbrs(t).filter(h => freeHex(b, h, u)).sort((a, c) => hd(a, u) - hd(c, u))[0];
      if (spot && hd(u, t) > 1) { u.c = spot.c; u.r = spot.r; u.target = t; b.events.push({ k: 'leap', id: u.id }); }
      b.events.push({ k: 'area', id: u.id, tid: t.id, shape: P === 3 ? 'nova' : 'splash', r: P === 3 ? 2 : 1, ty: 'cold', ids: [t.id] });
      hit(b, u, t, roll(P === 0 ? 2 : 3, 8), { kind: 'phys', ty: 'slashing', melee: 1, ab: 1 });
      if (t.alive) expose(b, t, (P === 0 ? 3 : 4) * chaK(u));
      u.stats.pounces = (u.stats.pounces || 0) + 1;
      if (P >= 2) {
        const bhp = Math.round(u.maxHp * (u.f.lunarResilience ? .45 : .32));
        u.beast = { hp: bhp, max: bhp };
        triggerWildShape(b, u, { form: 'Panther Form', beastHp: bhp });
      }
      if (P === 3) {
        if (t.alive) stun(b, t, 2);
        friends(b, u).filter(a => !a.minion).forEach(a => {
          heal(b, u, a, (18 + Math.max(0, u.m.wis) * 3) * u.dm, { raw: 1 });
        });
        callout(b, u, 'MOONLIT HUNT!', '#8fd0ff');
      }
    }
  },
  paths: [
    { k: 'lunar_resilience', n: 'Lunar Resilience', attr: 'str', tags: ['ward'], x: 'Panther Form gains +40% Beast HP.', f: { lunarResilience: 1 } },
    { k: 'pack_hunt', n: 'Pack Hunt', attr: 'wis', tags: ['ambush', 'heal'], x: 'Allies hitting Exposed enemies heal for 8% max HP (1s cooldown).', f: { packHunt: 1 } }
  ],
  quest: {
    id: 'kaska_q', statKey: 'pounces', goal: 10,
    label: 'Cast Moonlit Pounce 10 times',
    rewardName: 'Moon’s Favour',
    rewardDesc: 'While in Panther Form, Kaska’s melee attacks cleave adjacent enemies.'
  }
});

/* Board range compression for all 24 heroes */
Object.values(H).forEach(d => {
  if (d.rng) d.rng = RANGE15(d.rng);
});

/* One-sentence glance helper for cards & shop offers (strict progressive disclosure!) */
const abil1 = k => (H[k] && H[k].abil && H[k].abil.one) || '';
function glanceHTML(k, pathKey, G) {
  const d = H[k]; if (!d) return '';
  const P = pathKey ? d.paths.find(p => p.k === pathKey) : null;
  const ckwHtml = (d.ckw || []).map(e => {
    const K = CLASS_KW[e.k];
    const head = K ? `${K.n}${e.sub ? ' — ' + e.sub : ''}` : (e.sub || e.k);
    return `<div class="gk"><span class="ckwtag" style="--kc:${K ? K.c : '#5a4a8a'}" data-tn="${esc(K ? `${K.n} (${K.cls} · ${K.kind})` : head)}" data-tip="${esc(K ? K.x : '')}">${esc(K ? K.n : head)}</span><b>${esc(e.sub || '')}</b> ${G(e.x)}</div>`;
  }).join('');
  return `<div class="glance">${ckwHtml}${d.passive ? `<div><b>${esc(d.passive.n)}</b> ${G(d.passive.x)}</div>` : ''}<div><b>${esc(d.abil.n)}</b> ${G(abil1(k))}</div>${P ? `<div class="gp"><b>${esc(P.n)}</b> ${G(P.x)}</div>` : ''}</div>`;
}
