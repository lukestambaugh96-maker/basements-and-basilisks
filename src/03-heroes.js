/* ================= 0.22 HEROES: 24-HERO CAST & 12-CLASS KEYWORD SYSTEM =================
   All 24 heroes across 6 toggleable packs unified under 17 iconic D&D Class Keywords (1-2 per class):
     Fighter:   Action Surge          | Cleric:    Channel Divinity
     Paladin:   Smite, Aura           | Wizard:    Arcane Recovery
     Barbarian: Rage                  | Bard:      Bardic Inspiration
     Druid:     Wild Shape            | Ranger:    Hunter's Mark (Ranger-exclusive)
     Rogue:     Sneak Attack, Cunning Action
     Monk:      Ki -> Ki Ability      | Sorcerer:  Sorcery Points -> Metamagic
     Warlock:   Hex, Pact Boon
   Standing Rules:
   - One ability forever per hero (except Arthur's Quest Flame Gauntlet upgrade).
   - High = signature state / recursion firework. Nat 20 = board-bending tabletop cheer moment.
   - Tier II Paths = The Wiring (Path 1 Vertical fuels own firework; Path 2 Splash wires into team).
   - Tags & Class Keywords are mechanical labels/hooks ONLY (zero trait-counting bonuses).
   - One sentence per mechanic on player-facing cards.
*/

const HERO_ORDER = [
  'arthur', 'bram', 'faelan', 'wallaby',
  'dane', 'lorcan', 'juniper', 'rosalind',
  'cinder', 'zark', 'naill', 'nettle',
  'pillar', 'mother_laurel', 'lumen', 'jamison',
  'zoe', 'toot', 'gilthrax', 'gains',
  'velith', 'corvin', 'saint', 'kaska'
];

/* ---------- Universal 12-Class Keyword Registry (17 Class Keywords) ---------- */
const CLASS_KW = {
  action_surge:       { n: 'Action Surge',       cls: 'Fighter',   kind: 'Trigger',        c: '#a84a1c', x: 'Fighter keyword. Fires an immediate burst of extra action economy (bonus strike, follow-up, or refresh) when its condition is met.' },
  channel_divinity:   { n: 'Channel Divinity',   cls: 'Cleric',    kind: 'Trigger',        c: '#b88a1c', x: 'Cleric keyword. Once-per-fight signature divine miracle; can be reset by Nat 20s, items, or Cleric synergies.' },
  smite:              { n: 'Smite',              cls: 'Paladin',   kind: 'Trigger',        c: '#c8a02c', x: 'Paladin keyword. Empowers a strike or ability with a radiant or nature burst that triggers Smite synergies.' },
  aura:               { n: 'Aura',               cls: 'Paladin',   kind: 'Presence',       c: '#8a7a2c', x: 'Paladin keyword. Radiates a persistent protective or empowering zone to nearby allies.' },
  arcane_recovery:    { n: 'Arcane Recovery',    cls: 'Wizard',    kind: 'Trigger',        c: '#2f5a8f', x: 'Wizard keyword. Recovers ability Charge whenever this Wizard’s signature condition occurs.' },
  rage:               { n: 'Rage',               cls: 'Barbarian', kind: 'State',          c: '#a82a1c', x: 'Barbarian keyword. Enters or stacks a fierce combat state driving durability, speed, or immortality.' },
  bardic_inspiration: { n: 'Bardic Inspiration', cls: 'Bard',      kind: 'Token',          c: '#a83a7a', x: 'Bard keyword. Grants an ally an Inspiration die or Mote that boosts their next ability roll and triggers effects when spent.' },
  wild_shape:         { n: 'Wild Shape',         cls: 'Druid',     kind: 'Transformation', c: '#3c8a4c', x: 'Druid keyword. Channels a primal form or living nature aspect to transform combat presence.' },
  hunters_mark:       { n: 'Hunter’s Mark',      cls: 'Ranger',    kind: 'Mark',           c: '#3f7a2c', x: 'Ranger keyword. Designates a quarry for bonus WIS-scaled Ranger damage and team focus-fire payoffs.' },
  sneak_attack:       { n: 'Sneak Attack',       cls: 'Rogue',     kind: 'Trigger',        c: '#3a3a4a', x: 'Rogue keyword. Bonus precision damage against flanked, impaired, or ambushed foes.' },
  cunning_action:     { n: 'Cunning Action',     cls: 'Rogue',     kind: 'Trigger',        c: '#5a4a6a', x: 'Rogue keyword. Agile tumble, Stealth, or trickery maneuver that triggers ambush payoffs.' },
  ki:                 { n: 'Ki',                 cls: 'Monk',      kind: 'Resource',       c: '#2c7a8a', x: 'Monk resource. 4-pip bar filled by attacking and taking hits; filling it fires a Ki Ability.' },
  ki_ability:         { n: 'Ki Ability',         cls: 'Monk',      kind: 'Payoff',         c: '#1f6a7a', x: 'Monk payoff. Signature martial technique fired whenever this hero’s Ki bar fills.' },
  sorcery_points:     { n: 'Sorcery Points',     cls: 'Sorcerer',  kind: 'Resource',       c: '#c4441c', x: 'Sorcerer resource. 4-pip bar built by casts and elemental triggers; filling it fires Metamagic.' },
  metamagic:          { n: 'Metamagic',          cls: 'Sorcerer',  kind: 'Payoff',         c: '#d45a1c', x: 'Sorcerer payoff. Spell-warping effect automatically fired when Sorcery Points fill.' },
  hex:                { n: 'Hex',                cls: 'Warlock',   kind: 'Mark',           c: '#7a3fa0', x: 'Warlock keyword. Curses a foe to take bonus necrotic damage on every hit; transfers on death.' },
  pact_boon:          { n: 'Pact Boon',          cls: 'Warlock',   kind: 'Trigger',        c: '#5a2a7a', x: 'Warlock keyword. Patron payoff triggered whenever a Hexed foe dies.' }
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
  alert:   { n: 'Alert',        c: '#3d7fa8', x: 'Dodges incoming attacks and triggers counter-effects.' },
  charge:  { n: 'Charge',       c: '#2c7a8a', x: 'Generates or refunds ability Charge.' },
  onhit:   { n: 'On-hit',       c: '#8a5a2c', x: 'Multi-hit strikes that trigger on-hit effects repeatedly.' },
  heal:    { n: 'Heal',         c: '#3c8a5c', x: 'Restores allies’ HP.' },
  ward:    { n: 'Ward',         c: '#3d6fa8', x: 'Temporary shield that absorbs damage and necrosis before HP.' },
  holy:    { n: 'Holy',         c: '#c8a02c', x: 'Radiant damage that ignores AC and SR and stops undead rising.' },
  side:    { n: 'Side by side', c: '#7a4a2c', x: 'Rewards standing next to allies on the grid.' },
  backline:{ n: 'Backline',     c: '#5a4a6a', x: 'Leaps behind or targets distant enemy backliners.' },
  gold:    { n: 'Gold',         c: '#b08a1c', x: 'Generates or scales with Gold during the run.' },
  ambush:  { n: 'Ambush',       c: '#3a3a3a', x: 'Uses Stealth or sudden backline burst.' },
  marked:  { n: 'Marked',       c: '#3f7a2c', x: 'Ranger Hunter’s Mark amplifying strikes and on-hit effects.' },
  control: { n: 'Control',      c: '#8a6a1c', x: 'Roots, Stuns, Staggers, or Taunts enemies.' },
  poison:  { n: 'Poison',       c: '#4a8a2c', x: 'Stacking damage over time that never fades.' },
  d20:     { n: 'd20',          c: '#a83a7a', x: 'Manipulates ability d20 rolls, Inspiration dice, or Nat 20s.' },
  burn:    { n: 'Burn',         c: '#c4441c', x: 'Fire damage over time that can be fed and detonated.' },
  rage:    { n: 'Rage',         c: '#a82a1c', x: 'Barbarian Rage state driving durability, speed, or immortality.' },
  hex:     { n: 'Hex',          c: '#7a3fa0', x: 'Warlock curse dealing bonus necrotic damage on every hit.' },
  necrosis:{ n: 'Necrosis',     c: '#3a2a4a', x: 'Grows a kill threshold from the left end of the health bar.' }
};

const HTAGS = {
  arthur:        ['alert', 'charge', 'onhit'],
  bram:          ['heal', 'ward', 'holy', 'side'],
  faelan:        ['ward', 'charge'],
  wallaby:       ['backline', 'gold', 'ambush'],
  dane:          ['holy', 'onhit', 'side', 'control'],
  lorcan:        ['marked', 'onhit'],
  juniper:       ['control', 'poison', 'heal'],
  rosalind:      ['d20', 'charge', 'side'],
  cinder:        ['burn', 'charge'],
  zark:          ['rage', 'side', 'control'],
  naill:         ['onhit', 'control'],
  nettle:        ['hex', 'onhit', 'necrosis', 'd20'],
  pillar:        ['rage', 'holy', 'control', 'side'],
  mother_laurel: ['control', 'heal', 'holy', 'ward'],
  lumen:         ['holy', 'burn', 'd20'],
  jamison:       ['d20', 'holy', 'charge', 'side'],
  zoe:           ['charge', 'heal', 'gold'],
  toot:          ['gold', 'd20', 'charge'],
  gilthrax:      ['ward', 'gold', 'side'],
  gains:         ['gold', 'control', 'charge'],
  velith:        ['ambush', 'poison', 'backline'],
  corvin:        ['ambush', 'onhit', 'marked'],
  saint:         ['necrosis', 'heal', 'd20'],
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
    x: 'Classic, dependable starters driving Alert, Ward, Charge, Heal, and Gold.',
    heroes: ['arthur', 'bram', 'faelan', 'wallaby'],
    item: 'potion_healing',
    ic: 'vial'
  },
  campfire: {
    n: 'Around the Campfire',
    x: 'Wilderness trackers and party bonds built on Marked, On-hit, Root/Poison, and d20 dice.',
    heroes: ['dane', 'lorcan', 'juniper', 'rosalind'],
    item: 'bracers_archery',
    ic: 'bracers'
  },
  beaten: {
    n: 'Off the Beaten Path',
    x: 'Wild outsiders and snowballers fueling Burn, uncapped Bear Rage, Ki flurries, and Hex.',
    heroes: ['cinder', 'zark', 'naill', 'nettle'],
    item: 'periapt_wound_closure',
    ic: 'amulet_heart'
  },
  divine: {
    n: 'Divine Intervention',
    x: 'Four registers of holiness: Zealot immortality, Ancients Roots, Sunbeam Sear, and Peace Bonds.',
    heroes: ['pillar', 'mother_laurel', 'lumen', 'jamison'],
    item: 'amulet_devout',
    ic: 'holy'
  },
  market: {
    n: 'Cornering the Market',
    x: 'Economy, hoarding, and item amplifiers powered by Gold drops, Motes, and Arcane Shields.',
    heroes: ['zoe', 'toot', 'gilthrax', 'gains'],
    item: 'bag_holding',
    ic: 'brooch'
  },
  surprise: {
    n: 'Surprise Round',
    x: 'Dark ambushers and tricksters leveraging Stealth, Exposed, Illusory Doubles, and Panther Form.',
    heroes: ['velith', 'corvin', 'saint', 'kaska'],
    item: 'cloak_elvenkind',
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
  hp: 112, ac: 15, sr: 11,
  kw: { action_surge: 1 },
  ckw: [
    { k: 'action_surge', sub: 'Combat Reflexes', x: 'Dodging with Alert—or dropping below 50% HP once per fight—triggers Action Surge (immediate free Longsword strike + 15 Charge).' }
  ],
  f: { startAlert: 1, arthurSurge: 1 },
  passive: { n: 'Alert', x: 'Starts every fight Alert (dodging the next attack) with +25 Charge.' },
  atk: { n: 'Longsword', d: [1, 8], flat: 3, kind: 'phys', ty: 'slashing', iv: 1.35 },
  abil: {
    n: 'Longbow Volley', cr: 7.5, pa: 10, cut: [6, 13], self: 1,
    one: 'Looses 1–4 arrows at farthest foes (triggering on-hit); High grants Alert, Nat 20 makes the whole party Alert.',
    b: [
      'Looses 1 arrow (2d6) at the farthest foe, triggering on-hit effects.',
      'Looses 2 arrows (2d6 each) at farthest foes, triggering on-hit effects.',
      'Looses 3 arrows (2d6 each) and becomes Alert (dodges the next attack).',
      'Looses 4 arrows (2d8 each) and makes the entire party Alert for 1 attack.'
    ],
    fx(b, u, P) {
      const fs = foes(b, u).filter(x => !x.hidden);
      if (!fs.length) return;
      const count = [1, 2, 3, 4][P];
      const flame = !!(u.questDone && u.key === 'arthur');
      if (flame) {
        // Flame Gauntlet Quest Reward: Gauntlet Blast frontline fire cone
        const near = fs.slice().sort((a, c) => hd(a, u) - hd(c, u)).slice(0, count);
        b.events.push({ k: 'area', id: u.id, tid: near[0] && near[0].id, shape: 'cone', r: 2, ty: 'fire', ids: near.map(x => x.id) });
        near.forEach(t => {
          hit(b, u, t, roll(P === 3 ? 3 : 2, 8), { kind: 'magic', el: 'fire', ty: 'fire', area: 1 });
          applyStatus(b, u, t, 'burn', 6 + Math.max(0, u.m.dex) * 2);
          if (u.f.initSplash && !u._firstVolleyDone) expose(b, t, 4 * chaK(u));
        });
        u._firstVolleyDone = 1;
      } else {
        // Longbow Volley: farthest foes first, wrapping if out of targets; triggers on-hit!
        const far = fs.slice().sort((a, c) => hd(c, u) - hd(a, u));
        for (let i = 0; i < count; i++) {
          const t = far[i % far.length];
          if (!t || !t.alive) continue;
          b.events.push({ k: 'beam', id: u.id, tid: t.id, ty: 'piercing' });
          const got = hit(b, u, t, roll(2, P === 3 ? 8 : 6) + 3, { kind: 'phys', ty: 'piercing', ab: 1 });
          if (t.alive) onHit(b, u, t, got);
          if (u.f.initSplash && !u._firstVolleyDone && t.alive) expose(b, t, 4 * chaK(u));
        }
        u._firstVolleyDone = 1;
      }
      if (P === 2) grantAlert(b, u, u.f.vigilance && u.tier >= 4 ? 2 : 1);
      if (P === 3) {
        const stacks = u.f.vigilance && u.tier >= 4 ? 2 : 1;
        friends(b, u).filter(a => !a.minion).forEach(a => grantAlert(b, a, stacks));
        callout(b, u, 'PARTY ALERT!', '#8fd0ff');
      }
    }
  },
  paths: [
    {
      k: 'vigilance', n: 'Constant Vigilance', attr: 'dex', tags: ['alert', 'onhit'],
      x: 'Kills refresh Alert; Arthur’s Action Surge deals +50% damage and grants Alert at 50% HP.',
      full: 'Kills refresh Alert. Arthur’s Action Surge strikes deal +50% damage, and dropping below 50% HP also grants Alert once per fight.',
      t4x: 'Each Alert dodges 2 attacks instead of 1.',
      f: { vigilance: 1 }
    },
    {
      k: 'initiative', n: 'Roll for Initiative', attr: 'int', tags: ['alert', 'charge'],
      x: 'Ally dodges grant +22 Charge; any ally Action Surge applies Exposed to its target.',
      full: 'Whenever any ally dodges an attack, they gain +22 Charge. Arthur’s first volley and any ally Action Surge apply Exposed.',
      t4x: 'The entire party starts every fight Alert.',
      f: { initSplash: 1 }
    }
  ],
  quest: {
    id: 'arthur_q', statKey: 'alertDodges', goal: 25,
    label: 'Dodge 25 attacks with Alert',
    rewardName: 'Flame Gauntlet',
    rewardDesc: '+2 CON; replaces Longbow Volley with Gauntlet Blast (frontline fire cone with Burn, keeping High/Nat 20 Alert).'
  }
});

hero('bram', {
  name: 'Bram', fullName: 'Bram',
  title: 'Dwarf Cleric · Life Domain', cls: 'Cleric', sub: 'Life Domain', anc: 'Dwarf',
  role: 'Tank', reach: 'Melee', rng: 1, ft: 25,
  bio: 'Keeps a warhammer in one hand, a flagon in the other, and his friends upright.',
  attr: { str: 14, dex: 10, con: 16, int: 10, wis: 16, cha: 12 },
  prim: 'wis', pair: ['str', 'wis'],
  hp: 146, ac: 16, sr: 13,
  kw: { channel_divinity: 1 },
  ckw: [
    { k: 'channel_divinity', sub: 'Preserve Life', x: 'Once per fight, when Bram or a nearby ally drops below 45% HP, bursts heavy healing onto nearby allies.' }
  ],
  passive: { n: 'Stout', x: 'Immune to push and knockback.' },
  f: { pushResist: 1, preserveLife: 1 },
  atk: { n: 'Warhammer', d: [1, 8], flat: 3, kind: 'phys', ty: 'bludgeoning', iv: 1.45 },
  abil: {
    n: 'Cure Wounds', cr: 7, pa: 8, cut: [6, 13], self: 1,
    one: 'Heals closest ally; High turns excess into Ward plus a free Warhammer swing, Nat 20 heals adjacent allies and resets Channel Divinity for all Clerics.',
    b: [
      'Heals the closest injured ally (or himself) for 2d6.',
      'Heals the closest injured ally for 3d6.',
      'Heals for 4d8, turning all excess into Ward, plus a free Warhammer swing.',
      'Heals all adjacent allies for 4d8 (excess becomes Ward) and resets Channel Divinity for Bram and Cleric allies.'
    ],
    fx(b, u, P) {
      const fr = friends(b, u).filter(a => !a.minion);
      const sortClosest = list => list.slice().sort((a, c) => (hpPct(a) < .98 ? 0 : 1) - (hpPct(c) < .98 ? 0 : 1) || hd(a, u) - hd(c, u) || hpPct(a) - hpPct(c));
      const lowBonus = t => (u.f.discipleLife && hpPct(t) < .5 ? 1.4 : 1);
      const healWithOverWard = (t, raw, overWard) => {
        const amt = raw * lowBonus(t);
        const before = t.hp;
        const cap = (t.maxHp - before);
        const eff = Math.round((amt + (u.bon ? u.bon.k : 0)) * u.dm);
        heal(b, u, t, amt);
        if (overWard && eff > cap) {
          addWard(b, t, eff - cap, t.maxHp * .5, u);
        }
      };

      if (P === 3) {
        const ts = fr.filter(a => hd(a, u) <= 1);
        b.events.push({ k: 'area', id: u.id, shape: 'nova', r: 1, ty: 'radiant', ids: ts.map(x => x.id) });
        ts.forEach(a => healWithOverWard(a, roll(4, 8), true));
        // Reset Channel Divinity for Bram AND any Cleric allies!
        fr.filter(a => a.kw && a.kw.channel_divinity).forEach(cl => { cl._cdUsed = 0; cl._pres = 0; });
        callout(b, u, 'CHANNEL RESET!', '#ffe9a0');
        if (u.target && u.target.alive && hd(u.target, u) <= 1) {
          strike(b, u, u.target);
          if (u.f.divineStrike) triggerAdjHolyStrikes(b, u);
        }
      } else {
        const maxT = (u.f.discipleLife && u.tier >= 4) ? 2 : 1;
        const targets = sortClosest(fr).slice(0, maxT);
        const dice = P === 0 ? [2, 6] : P === 1 ? [3, 6] : [4, 8];
        targets.forEach(a => healWithOverWard(a, roll(dice[0], dice[1]), P >= 2));
        if (P === 2 && u.target && u.target.alive && hd(u.target, u) <= 1) {
          strike(b, u, u.target);
          if (u.f.divineStrike) triggerAdjHolyStrikes(b, u);
        }
      }
    }
  },
  paths: [
    {
      k: 'disciple', n: 'Disciple of Life', attr: 'wis', tags: ['heal', 'ward', 'd20'],
      x: 'Heals 40% more below half HP; absorbing or blocking a hit grants +2 to his next d20 roll.',
      full: 'Heals 40% more on allies below half HP. Whenever Bram blocks or absorbs a hit with Ward or high armor, he gains +2 to his next ability d20 roll.',
      t4x: 'Cure Wounds heals the 2 closest allies.',
      f: { discipleLife: 1 }
    },
    {
      k: 'divine', n: 'Divine Strike', attr: 'str', tags: ['holy', 'side'],
      x: 'Adjacent allies add 1d4 Holy to melee attacks; any ally Channel Divinity or High swing triggers adjacent Holy strikes.',
      full: 'Bram and adjacent allies add 1d4 flat Holy damage to melee attacks. Bram’s High/Nat 20 swings and any ally Channel Divinity trigger adjacent allies’ Holy strikes.',
      t4x: 'Bonus Holy damage increases to 1d8.',
      f: { divineStrike: 1 }
    }
  ],
  quest: {
    id: 'bram_q', statKey: 'flawlessWins', goal: 5,
    label: 'Win 5 fights with no hero falling',
    rewardName: 'Blessed Ale',
    rewardDesc: '+1 CON; adjacent allies start each fight with a Ward, and any Potion of Healing on the team heals 50% more.'
  }
});

hero('faelan', {
  name: 'Faelan', fullName: 'Faelan',
  title: 'Elf Wizard · Abjuration', cls: 'Wizard', sub: 'School of Abjuration', anc: 'Elf',
  role: 'Support', reach: 'Ranged', rng: 4, ft: 30,
  bio: 'Measures every sword swing by the exact rune needed to turn it aside.',
  attr: { str: 8, dex: 12, con: 12, int: 16, wis: 14, cha: 10 },
  prim: 'int', pair: ['int', 'int'],
  hp: 86, ac: 12, sr: 14,
  kw: { arcane_recovery: 1 },
  ckw: [
    { k: 'arcane_recovery', sub: 'Abjuration', x: 'Triggers Arcane Recovery (+20 Charge) whenever a Ward she placed breaks.' }
  ],
  passive: { n: 'Fey Ancestry', x: 'Immune to Charm and Sleep.' },
  f: { feyAncestry: 1, abjurer: 1 },
  atk: { n: 'Ray of Frost', d: [1, 8], flat: 1, kind: 'magic', el: 'cold', ty: 'cold', iv: 1.45 },
  abil: {
    n: 'Arcane Ward', cr: 8.5, pa: 8, cut: [6, 13], self: 1,
    one: 'Wards the most-threatened ally; High Wards top 2 and refunds 18% Charge, Nat 20 Wards the party and casts again.',
    b: [
      'Places a 12 + INT Ward on the most-threatened ally.',
      'Places an 18 + INT Ward on the most-threatened ally.',
      'Wards the top 2 threatened allies (24 + INT) and refunds 18% Charge.',
      'Wards the entire party (28 + INT) and immediately casts again on the lowest-HP ally.'
    ],
    fx(b, u, P) {
      const fr = friends(b, u).filter(a => !a.minion);
      if (!fr.length) return;
      const threat = a => (a.stats.taken || 0) + (1 - hpPct(a)) * 120 + (a.role === 'Tank' ? 25 : 0);
      const sorted = fr.slice().sort((a, c) => threat(c) - threat(a));
      const base = ([12, 18, 24, 28][P] + Math.max(0, u.m.int) * 2) * u.dm * (u.f.projWard ? 1.18 : 1);
      const applyFaelanWard = a => {
        addWard(b, a, base, a.maxHp * .55, u);
        a._wardBy = u;
      };
      if (P === 3) {
        b.events.push({ k: 'area', id: u.id, shape: 'nova', r: 6, ty: 'force', ids: fr.map(x => x.id) });
        fr.forEach(applyFaelanWard);
        const low = fr.slice().sort((a, c) => hpPct(a) - hpPct(c))[0];
        if (low) applyFaelanWard(low);
        callout(b, u, 'GRAND ABJURATION!', '#8fb4e6');
      } else {
        const n = (P >= 2 || (u.f.projWard && u.tier >= 4)) ? 2 : 1;
        sorted.slice(0, n).forEach(applyFaelanWard);
        if (P === 2) {
          later(b, .05, () => { if (u.alive) giveCharge(b, u, 18); });
        }
      }
    }
  },
  paths: [
    {
      k: 'projected', n: 'Projected Ward', attr: 'int', tags: ['ward', 'd20'],
      x: 'Larger Wards; every 3rd Arcane Recovery grants Faelan Advantage on her next cast.',
      full: 'Faelan’s Wards are 35% larger. Every 3rd Ward break (Arcane Recovery) grants her Advantage on her next ability d20 roll.',
      t4x: 'Every cast of Arcane Ward shields the top 2 threatened allies.',
      f: { projWard: 1 }
    },
    {
      k: 'battery', n: 'Spell Battery', attr: 'int', tags: ['ward', 'charge'],
      x: 'When Faelan triggers Arcane Recovery, the warded ally gains Charge scaling with her INT.',
      full: 'Whenever Faelan’s Ward breaks (Arcane Recovery), the warded ally gains 16 + 3×INT Charge.',
      t4x: 'The Charge burst also splashes to allies standing adjacent to the warded hero.',
      f: { spellBattery: 1 }
    }
  ],
  quest: {
    id: 'faelan_q', statKey: 'wardAbsorbed', goal: 1000,
    label: 'Wards absorb 1,000 total damage',
    rewardName: 'Owl Familiar',
    rewardDesc: 'Flies a Ward to the farthest ally at fight start; gains +1 INT permanently after every win (uncapped).'
  }
});

hero('wallaby', {
  name: 'Wallaby', fullName: 'Wallaby',
  title: 'Halfling Rogue · Thief', cls: 'Rogue', sub: 'Thief', anc: 'Halfling',
  role: 'Damage', reach: 'Melee', rng: 1, ft: 35,
  bio: 'If your purse is lighter and your archer is on the floor, Wallaby was already here.',
  attr: { str: 10, dex: 16, con: 12, int: 12, wis: 10, cha: 14 },
  prim: 'dex', pair: ['dex', 'dex'],
  hp: 106, ac: 14, sr: 11,
  kw: { sneak_attack: 1, cunning_action: 1 },
  ckw: [
    { k: 'sneak_attack', sub: 'Backstab', x: 'Strikes deal +1d6 Sneak Attack (1/s) against flanked or impaired foes; Backstab is a burst Sneak Attack.' },
    { k: 'cunning_action', sub: 'Tumble & Pilfer', x: 'High Backstab uses Cunning Action to tumble into Stealth; Fast Hands steals Gold and Exposes foes on Cunning Action.' }
  ],
  passive: { n: 'Lucky', x: 'Rerolls natural 1s on ability rolls.' },
  f: { lucky: 1 },
  gold: { cap: 8 },
  atk: { n: 'Shortsword', d: [1, 6], flat: 3, kind: 'phys', ty: 'piercing', iv: 1.05 },
  abil: {
    n: 'Backstab', cr: 7, pa: 10, cut: [6, 13], self: 1,
    one: 'Tumbles behind the farthest foe for a 3d6–9d6 Sneak Attack; High triggers Cunning Action Stealth, Nat 20 refunds 100% Charge + Gold.',
    b: [
      'Tumbles behind the farthest foe for a 3d6 Sneak Attack.',
      'Tumbles behind the farthest foe for a 5d6 Sneak Attack.',
      'Strikes for a 7d6 Sneak Attack and triggers Cunning Action (Stealth, halves next hit).',
      'Strikes for a 9d6 Sneak Attack, refunds 100% Charge, and pops +2 Gold.'
    ],
    fx(b, u, P) {
      const fs = foes(b, u).filter(x => !x.hidden);
      if (!fs.length) return;
      const far = fs.slice().sort((a, c) => hd(c, u) - hd(a, u) || (c.rng - a.rng))[0];
      const spot = walkNbrs(far).filter(h => freeHex(b, h, u)).sort((a, c) => a.r - c.r)[0];
      if (spot) { u.c = spot.c; u.r = spot.r; u.target = far; b.events.push({ k: 'leap', id: u.id }); }
      b.events.push({ k: 'area', id: u.id, tid: far.id, shape: 'splash', r: 0.7, ty: 'psychic', ids: [far.id] });
      const nDice = [3, 5, 7, 9][P];
      hit(b, u, far, roll(nDice, 6), { kind: 'phys', ty: 'piercing', melee: 1, ab: 1 });
      triggerSneakAttack(b, u, far, { ability: 1 });
      if (P >= 2) {
        triggerCunningAction(b, u, far, { stealth: P === 2 ? 3.5 : 0, stealthShield: P === 2 ? 1 : 0, label: 'TUMBLE' });
        if (u.f.fastHands) {
          const amt = (P === 3 ? 2 : 1) * (u.tier >= 4 ? 2 : 1);
          gainGold(b, u, amt, 'FAST HANDS');
          if (far.alive) expose(b, far, 4 * chaK(u));
        }
      }
      if (P === 3) {
        gainGold(b, u, 2, 'JACKPOT');
        later(b, .05, () => { if (u.alive) u.charge = 100; });
        callout(b, u, 'JACKPOT BACKSTAB!', '#ffd76a');
      }
    }
  },
  paths: [
    {
      k: 'slippery', n: 'Slippery', attr: 'dex', tags: ['backline', 'charge', 'd20'],
      x: 'Kills refund 50% Charge and grant +2 to his next d20 roll.',
      full: 'Whenever Wallaby lands a killing blow, he regains 50% Charge and +2 to his next ability d20 roll.',
      t4x: 'Kills refund 100% Charge.',
      f: { slippery: 1 }
    },
    {
      k: 'fasthands', n: 'Fast Hands', attr: 'cha', tags: ['gold', 'ambush'],
      x: 'Cunning Action and High/Nat 20 rolls steal Gold and apply Exposed to the target.',
      full: 'Wallaby’s Cunning Action and High/Nat 20 ability rolls steal bonus Gold (board-only) and apply Exposed (−2 AC and SR) to his target.',
      t4x: 'Double Gold stolen from Fast Hands.',
      f: { fastHands: 1 }
    }
  ],
  quest: {
    id: 'wallaby_q', statKey: 'itemsWon', goal: 3,
    label: 'Carry 3 different items into winning fights',
    rewardName: 'Use Magic Device',
    rewardDesc: '+1 DEX; ignores all item class and melee/ranged locks and gains +1 item slot.'
  }
});

/* ==========================================================================
   PACK 2: AROUND THE CAMPFIRE
   ========================================================================== */

hero('dane', {
  name: 'Sir Dane', fullName: 'Sir Dane',
  title: 'Human Paladin · Devotion', cls: 'Paladin', sub: 'Oath of Devotion', anc: 'Human',
  role: 'Tank', reach: 'Melee', rng: 1, ft: 30,
  bio: 'Swears his oath before breakfast and rides straight at the biggest threat.',
  attr: { str: 16, dex: 12, con: 16, int: 12, wis: 12, cha: 16 }, // Includes Human Versatility (+1 all six!)
  prim: 'cha', pair: ['str', 'cha'],
  hp: 136, ac: 17, sr: 13,
  kw: { smite: 1, aura: 1 },
  ckw: [
    { k: 'smite', sub: 'Divine Smite', x: 'Every 3rd melee strike and Compelled Duel unleash a Smite (+1d8 Holy).' },
    { k: 'aura', sub: 'Aura of Devotion', x: 'Allies within 2 squares (3 mounted) gain +1 AC, +1 SR, and immunity to Charm and Frighten.' }
  ],
  passive: { n: 'Human Versatility', x: '+1 to all six attributes (included in stats).' },
  f: { smitePeriodic: 1, auraDevotion: 1 },
  atk: { n: 'Longsword', d: [1, 8], flat: 3, kind: 'phys', ty: 'slashing', iv: 1.4 },
  abil: {
    n: 'Compelled Duel', cr: 7.5, pa: 8, cut: [6, 13], self: 1,
    one: 'Taunts and Smites his target; High raises Sacred Shield (Ward + thorns), Nat 20 empowers his Aura so allies attacking the Taunted foe trigger Smites and +10 Charge.',
    b: [
      'Taunts his target for 2.5s and unleashes a Smite (1d8 Holy).',
      'Taunts his target for 3.5s and unleashes a Smite (2d8 Holy).',
      'Taunts and Smites (2d8 Holy), raising Sacred Shield (Ward + thorns).',
      'Taunts and Smites (3d8 Holy); allies attacking his Taunted foe trigger bonus 1d8 Smites and gain +10 Charge.'
    ],
    fx(b, u, P) {
      const fs = foes(b, u).filter(x => !x.hidden);
      if (!fs.length) return;
      const t = (u.target && u.target.alive) ? u.target : fs.slice().sort((a, c) => hd(a, u) - hd(c, u))[0];
      const dur = [2.5, 3.5, 4.5, 5.5][P] * chaK(u);
      t.st.taunt = Math.max(t.st.taunt, dur);
      t.st.tauntBy = u;
      t.target = u;
      b.events.push({ k: 'beam', id: u.id, tid: t.id, ty: 'radiant' });
      b.events.push({ k: 'area', id: u.id, tid: t.id, shape: P >= 2 ? 'nova' : 'splash', r: P >= 2 ? 1.2 : 0.75, ty: 'radiant', ids: [t.id] });
      triggerSmite(b, u, t, roll([1, 2, 2, 3][P], 8), { label: 'DIVINE SMITE', ab: 1 });
      status(b, t, 'COMPELLED DUEL', '#ffe9a0');
      if (P >= 2) {
        const w = (26 + Math.max(0, u.m.cha) * 5) * u.dm * chaK(u);
        addWard(b, u, w, u.maxHp * .6, u);
        u.sacredShieldT = Math.max(u.sacredShieldT || 0, 5 * chaK(u));
        status(b, u, 'SACRED SHIELD', '#8fb4e6');
      }
      if (P === 3) {
        t.st.duelCrusade = 6 * chaK(u);
        callout(b, t, 'CRUSADE AURA!', '#ffe9a0');
      }
    }
  },
  paths: [
    {
      k: 'devotion', n: 'Oath of Devotion', attr: 'cha', tags: ['holy', 'control'],
      x: 'Taking hits from his Taunted foe retaliates with a 1d8 Holy Smite.',
      full: 'Whenever Sir Dane’s Taunted target hits him, he retaliates with a 1d8 Holy Smite.',
      t4x: 'When his Taunted foe dies, Dane automatically Taunts and Smites the nearest enemy.',
      f: { oathDevotion: 1 }
    },
    {
      k: 'calltoarms', n: 'Call to Arms', attr: 'str', tags: ['holy', 'onhit', 'side'],
      x: 'Allies in Dane’s Aura trigger on-hit twice on their first hit; any ally Smite grants Aura allies +8 Charge.',
      full: 'Allies standing inside Sir Dane’s Aura trigger on-hit effects twice on their first strike against his target. Whenever any ally triggers Smite, allies in Dane’s Aura gain +8 Charge.',
      t4x: 'Every 3rd attack from allies in Dane’s Aura also triggers on-hit effects twice.',
      f: { callToArms: 1 }
    }
  ],
  quest: {
    id: 'dane_q', statKey: 'smites', goal: 20,
    label: 'Trigger 20 Smites (Dane or allies in his Aura)',
    rewardName: 'Find Steed',
    rewardDesc: '+2 STR, +2 CON; transforms into a Large (2×2) mounted knight whose opening cavalry charge pushes & Smites foes and widens his Aura.'
  }
});

hero('lorcan', {
  name: 'Lorcan', fullName: 'Lorcan',
  title: 'Half-Elf Ranger · Hunter', cls: 'Ranger', sub: 'Hunter', anc: 'Half-Elf',
  role: 'Damage', reach: 'Ranged', rng: 5, ft: 30,
  bio: 'Marks one target at dusk and counts the arrows before they fly.',
  attr: { str: 10, dex: 16, con: 12, int: 10, wis: 16, cha: 10 },
  prim: 'wis', pair: ['dex', 'wis'],
  hp: 104, ac: 14, sr: 13,
  kw: { hunters_mark: 1 },
  ckw: [
    { k: 'hunters_mark', sub: 'Hunter’s Quarry', x: 'Applies Hunter’s Mark (+15% team damage); Ranger attacks deal +1d8 + WIS bonus damage.' }
  ],
  passive: { n: 'Keen Sight', x: 'Extended range (+1 square) and ignores partial dodge or brush cover.' },
  f: { keenSight: 1, huntMark: 1 },
  atk: { n: 'Longbow', d: [1, 8], flat: 3, kind: 'phys', ty: 'piercing', iv: 1.2 },
  abil: {
    n: 'Hunter’s Mark', cr: 7.5, pa: 10, cut: [6, 13],
    one: 'Piercing shot + Hunter’s Mark; High fires a double-shot (2× on-hit), Nat 20 fires a 4-arrow volley that jumps and refunds 50% Charge on kill.',
    b: [
      'Fires a piercing arrow (2d6) and applies Hunter’s Mark.',
      'Fires a piercing arrow (3d6) and applies Hunter’s Mark.',
      'Applies Hunter’s Mark and fires a double-shot (2× on-hit) at the Marked target.',
      'Fires a 4-arrow volley (4× on-hit) at the Marked target; kills jump Hunter’s Mark and refund 50% Charge.'
    ],
    fx(b, u, P) {
      const t = (u.target && u.target.alive) ? u.target : foes(b, u)[0];
      if (!t || !t.alive) return;
      markFoe(b, u, t);
      const fireArrow = (diceN, diceS, delay) => {
        const go = () => {
          if (!u.alive) return;
          let x = t.alive ? t : foes(b, u)[0];
          if (!x) return;
          b.events.push({ k: 'beam', id: u.id, tid: x.id, ty: 'piercing' });
          const got = hit(b, u, x, roll(diceN, diceS), { kind: 'phys', ty: 'piercing', ab: 1 });
          if (x.alive) onHit(b, u, x, got);
          if (!x.alive && P === 3 && !u._nat20Jump) {
            u._nat20Jump = 1;
            const nx = foes(b, u)[0];
            if (nx) markFoe(b, u, nx);
            giveCharge(b, u, 50);
            callout(b, u, 'MARK JUMPS!', '#9fd86a');
          }
        };
        if (delay) later(b, delay, go); else go();
      };
      u._nat20Jump = 0;
      if (P === 0) fireArrow(2, 6, 0);
      else if (P === 1) fireArrow(3, 6, 0);
      else if (P === 2) { fireArrow(2, 8, 0); fireArrow(2, 8, .12); }
      else {
        for (let i = 0; i < 4; i++) fireArrow(2, 8, i * .1);
        callout(b, u, 'FOUR-ARROW VOLLEY!', '#9fd86a');
      }
    }
  },
  paths: [
    {
      k: 'colossus', n: 'Colossus Slayer', attr: 'dex', tags: ['marked', 'onhit', 'd20'],
      x: 'Every 3rd attack against a Marked foe deals +2d8 bonus damage and grants +1 to his next d20 roll.',
      full: 'Every 3rd auto-attack against a Hunter’s Mark foe deals +2d8 physical damage and adds +1 to Lorcan’s next ability d20 roll.',
      t4x: 'Triggers on every 2nd auto-attack against a Marked foe.',
      f: { colossusSlayer: 1 }
    },
    {
      k: 'trophies', n: 'Volley of Trophies', attr: 'wis', tags: ['marked', 'onhit'],
      x: 'Hunter’s Mark targets take +35% bonus damage from all allies’ on-hit effects and statuses.',
      full: 'Hunter’s Mark targets take 35% more damage from all allies’ on-hit effects and damaging statuses (Burn, Poison).',
      t4x: 'Killing a Marked foe grants the whole party +25% attack speed for 4s.',
      f: { trophyVolley: 1 }
    }
  ],
  quest: {
    id: 'lorcan_q', statKey: 'markedKills', goal: 20,
    label: 'Kill 20 Hunter’s Mark targets',
    rewardName: 'Favoured Enemy',
    rewardDesc: 'Each elite or boss archetype killed grants a permanent trophy (+1 DEX and +15% damage vs. that archetype).'
  }
});

hero('juniper', {
  name: 'Juniper', fullName: 'Juniper',
  title: 'Gnome Druid · Land (Forest)', cls: 'Druid', sub: 'Circle of the Land', anc: 'Gnome',
  role: 'Support', reach: 'Ranged', rng: 4, ft: 25,
  bio: 'Carries bramble seeds in every pocket and never wastes a root.',
  attr: { str: 8, dex: 12, con: 14, int: 12, wis: 16, cha: 12 },
  prim: 'wis', pair: ['wis', 'wis'],
  hp: 96, ac: 13, sr: 16, // Includes Gnome Cunning (+2 SR)
  kw: { wild_shape: 1 },
  ckw: [
    { k: 'wild_shape', sub: 'Bramble Aspect', x: 'High/Nat 20 Entangle channels Wild Shape for 5s, granting nearby allies Thorns and amplifying Root and Poison.' }
  ],
  passive: { n: 'Gnome Cunning', x: '+2 Spell Resistance (included in stats); gains +10 Charge when Rooted foes take damage.' },
  f: { naturalRecovery: 1 },
  atk: { n: 'Thorn Whip', d: [1, 8], flat: 1, kind: 'magic', ty: 'piercing', iv: 1.4 },
  abil: {
    n: 'Entangle', cr: 8, pa: 8, cut: [6, 13], self: 1,
    one: 'Roots a clump of foes; High channels Wild Shape (Bramble Aspect) + Poison, Nat 20 Roots the enemy frontline and double-triggers Poison.',
    b: [
      'Roots target area for 1.8s and deals 1d6 nature damage.',
      'Roots target area for 2.6s and deals 2d6 nature damage.',
      'Roots for 3.2s, applies 4 Poison/s, and channels Wild Shape (Bramble Aspect + ally Thorns).',
      'Roots the enemy frontline for 4s, channels Wild Shape, and immediately triggers all active Poison twice.'
    ],
    fx(b, u, P) {
      const fs = foes(b, u).filter(x => !x.hidden);
      if (!fs.length) return;
      const centerT = (u.target && u.target.alive) ? u.target : fs.slice().sort((a, c) => hd(a, u) - hd(c, u))[0];
      let targets;
      if (P === 3) {
        const maxR = Math.max(...fs.map(x => x.r));
        targets = fs.filter(x => x.r >= maxR - 2);
        if (!targets.length) targets = fs;
        callout(b, u, 'OVERGROWN FRONTLINE!', '#6da670');
      } else {
        targets = fs.filter(x => hd(x, centerT) <= 1);
      }
      b.events.push({ k: 'area', id: u.id, tid: centerT.id, shape: 'splash', r: P === 3 ? 2 : 1, ty: 'poison', ids: targets.map(x => x.id) });
      const wsMult = (u.wildShapeT > 0 || P >= 2) ? 1.25 : 1;
      const dur = [1.8, 2.6, 3.2, 4.0][P] * chaK(u) * wsMult;
      targets.forEach(t => {
        applyRoot(b, u, t, dur);
        hit(b, u, t, roll([1, 2, 2, 3][P], 6), { kind: 'magic', ty: 'poison', area: 1 });
        if (P >= 2) applyStatus(b, u, t, 'poison', (3 + Math.max(0, u.m.wis) * .6) * wsMult);
      });
      if (P >= 2) {
        triggerWildShape(b, u, { form: 'Bramble Aspect', dur: 5 * chaK(u), thorns: 1 });
      }
      if (P === 3) {
        fs.forEach(t => {
          if (t.alive && t.st.poison > 0) {
            const burst = Math.max(2, Math.round(t.st.poison * 2 * (u.f.overgrowth && t.st.root > 0 ? 2 : 1)));
            hit(b, u, t, burst, { dot: 1, ty: 'poison' });
            if (t.alive) hit(b, u, t, burst, { dot: 1, ty: 'poison' });
          }
        });
      }
    }
  },
  paths: [
    {
      k: 'overgrowth', n: 'Overgrowth', attr: 'wis', tags: ['control', 'poison'],
      x: 'Rooted foes take double Poison damage, and Poison ticks extend Root duration.',
      full: 'Rooted foes take double Poison damage, and each Poison tick extends their Root by 0.25s.',
      t4x: 'Roots spread to adjacent enemies whenever Entangle lands.',
      f: { overgrowth: 1 }
    },
    {
      k: 'land', n: 'Circle of the Land', attr: 'con', tags: ['control', 'poison', 'heal'],
      x: 'Whenever a foe is Rooted/Poisoned—or any ally triggers Wild Shape—the lowest-HP ally heals and gains Ward.',
      full: 'Whenever Juniper Roots or Poisons a foe, or any ally channels Wild Shape, the lowest-HP ally heals for 4 + WIS and gains a small Ward.',
      t4x: 'Heals and Wards the entire party instead of one ally.',
      f: { circleLand: 1 }
    }
  ],
  quest: {
    id: 'juniper_q', statKey: 'rootsApplied', goal: 30,
    label: 'Root enemies 30 times',
    rewardName: 'Goodberries',
    rewardDesc: '+2 WIS; spawns glowing berries at fight start that heal allies below 60% HP and grant +1 to their next d20 roll.'
  }
});

hero('rosalind', {
  name: 'Rosalind', fullName: 'Rosalind',
  title: 'Human Bard · College of Lore', cls: 'Bard', sub: 'College of Lore', anc: 'Human',
  role: 'Support', reach: 'Ranged', rng: 4, ft: 30,
  bio: 'Knows three verses for every hero and one devastating insult for every monster.',
  attr: { str: 8, dex: 12, con: 12, int: 14, wis: 12, cha: 16 },
  prim: 'cha', pair: ['cha', 'cha'],
  hp: 102, ac: 13, sr: 13,
  kw: { bardic_inspiration: 1 },
  ckw: [
    { k: 'bardic_inspiration', sub: 'Lore Die', x: 'Grants a stackable d6/d8/d10 Bardic Inspiration die + Charge; spending Inspiration grants +25% damage & Haste for 4.5s.' }
  ],
  passive: { n: 'Socialite’s Poise', x: 'Starts combat with +30 Charge when positioned beside an ally.' },
  f: { socialite: 1, bardSelf: 1 },
  atk: { n: 'Vicious Mockery', d: [1, 8], flat: 2, kind: 'magic', ty: 'psychic', iv: 1.35 },
  abil: {
    n: 'Bardic Inspiration', cr: 8.5, pa: 8, cut: [6, 13], self: 1,
    one: 'Grants a d6/d8/d10 Bardic Inspiration die + Charge; High passes the die on, Nat 20 inspires the whole party with +30% Charge.',
    b: [
      'Grants the closest ally a d6 Bardic Inspiration die + 15 Charge.',
      'Grants an ally a d6 Bardic Inspiration die (+CHA bonus) + 15 Charge.',
      'Grants a d8 Bardic Inspiration die (+18 Charge) that passes to another ally after being spent.',
      'Inspires the entire party with d10 Bardic Inspiration dice and grants +30% Charge to everyone.'
    ],
    fx(b, u, P) {
      const fr = friends(b, u).filter(a => a !== u && !a.minion && a.abil);
      if (!fr.length) return;
      const pick = fr.slice().sort((a, c) => (a.inspDie ? 1 : 0) - (c.inspDie ? 1 : 0) || c.charge - a.charge)[0];
      if (P === 3) {
        b.events.push({ k: 'area', id: u.id, shape: 'nova', r: 6, ty: 'psychic', ids: fr.map(x => x.id) });
        fr.forEach(a => {
          grantInspDie(b, u, a, 10, u.f.passRound ? Math.max(1, u.m.cha) : 1);
          giveCharge(b, a, 30);
        });
        callout(b, u, 'STANDING OVATION!', '#ffd76a');
      } else if (P === 2) {
        const passes = u.f.passRound ? Math.max(2, u.m.cha) : 1;
        grantInspDie(b, u, pick, 8, passes);
        giveCharge(b, pick, 18);
      } else {
        const passes = u.f.passRound ? Math.max(1, u.m.cha - 1) : 0;
        grantInspDie(b, u, pick, 6, passes);
        giveCharge(b, pick, 15);
      }
    }
  },
  paths: [
    {
      k: 'passround', n: 'Pass the Round', attr: 'cha', tags: ['d20', 'charge'],
      x: 'Inspired allies pass a diminishing die up to CHA times; any Inspired Nat 20 refunds Rosalind 50% Charge.',
      full: 'Inspired allies pass a diminishing Inspiration die up to CHA times. Any ally rolling a Nat 20 while spending Bardic Inspiration (Lore Die or Mote) refunds Rosalind 50% Charge.',
      t4x: 'Passed Inspiration dice never shrink in size.',
      f: { passRound: 1 }
    },
    {
      k: 'encore', n: 'Encore', attr: 'int', tags: ['d20', 'charge', 'side'],
      x: 'Adjacent Inspired ally (Lore Die or Mote) gains +40% Charge speed for rapid casting.',
      full: 'An ally holding any Bardic Inspiration beside Rosalind gains +40% Charge speed until they cast.',
      t4x: 'Applies to all adjacent Inspired allies.',
      f: { encore: 1 }
    }
  ],
  quest: {
    id: 'rosalind_q', statKey: 'inspPassed', goal: 25,
    label: 'Pass Bardic Inspiration 25 times',
    rewardName: 'Instrument of the Bards',
    rewardDesc: '+2 CHA; Inspired allies expand their Nat 20 range to 19–20.'
  }
});

/* ==========================================================================
   PACK 3: OFF THE BEATEN PATH
   ========================================================================== */

hero('cinder', {
  name: 'Cinder', fullName: 'Cinder',
  title: 'Tiefling Sorcerer · Draconic', cls: 'Sorcerer', sub: 'Draconic Bloodline', anc: 'Tiefling',
  role: 'Damage', reach: 'Ranged', rng: 4, ft: 30,
  bio: 'Smells of brimstone and counts every spark until the room goes up.',
  attr: { str: 8, dex: 12, con: 12, int: 14, wis: 10, cha: 16 },
  prim: 'cha', pair: ['cha', 'cha'],
  hp: 90, ac: 13, sr: 13,
  kw: { sorcery_points: 1, metamagic: 1 },
  ckw: [
    { k: 'sorcery_points', sub: 'Draconic Sparks', x: '4-pip Sorcery Points bar built by High Fireballs (+2) and Burn ticks (Draconic Surge).' },
    { k: 'metamagic', sub: 'Twinned Spell', x: 'When Sorcery Points fill, Metamagic automatically casts a free Twinned Fireball at the next densest group.' }
  ],
  passive: { n: 'Hellish Resistance', x: 'Takes 50% less fire and Burn damage.' },
  f: { hellishRes: 1, sorceryBar: 1 },
  atk: { n: 'Fire Bolt', d: [1, 10], flat: 1, kind: 'magic', el: 'fire', ty: 'fire', iv: 1.45 },
  abil: {
    n: 'Fireball', cr: 8, pa: 8, cut: [6, 13], self: 1,
    one: 'Blasts the densest clump with Fire + Burn; High builds +2 Sorcery Points (fires Metamagic at 4), Nat 20 detonates all Burn.',
    b: [
      'Hurls a Fireball (3d6 fire + light Burn) at the densest clump.',
      'Hurls a Fireball (5d6 fire + Burn) at the densest clump.',
      'Hurls a Fireball (6d6 fire + Burn) and gains +2 Sorcery Points (auto-fires Metamagic: Twinned Spell at 4).',
      'Hurls a massive Fireball (8d6 fire) and detonates all Burn on the board immediately.'
    ],
    fx(b, u, P) {
      const hurlAt = (excludeCenter, isTwin) => {
        const fs = foes(b, u).filter(x => !x.hidden);
        if (!fs.length) return null;
        const R = P === 3 ? 2 : 1;
        const pool = excludeCenter ? fs.filter(x => x !== excludeCenter) : fs;
        const list = pool.length ? pool : fs;
        const nearCount = x => fs.filter(y => hd(y, x) <= R).length;
        const c = list.slice().sort((a, z) => nearCount(z) - nearCount(a))[0];
        const hitFoes = fs.filter(x => hd(x, c) <= R);
        b.events.push({ k: 'area', id: u.id, tid: c.id, shape: 'splash', r: R, ty: 'fire', ids: hitFoes.map(x => x.id) });
        const diceN = [3, 5, 6, 8][P];
        hitFoes.forEach(x => {
          hit(b, u, x, roll(diceN, 6), { kind: 'magic', el: 'fire', ty: 'fire', area: 1 });
          applyStatus(b, u, x, 'burn', [5, 8, 12, 16][P] * chaK(u));
          if (u.f.wildfire && x.alive) {
            expose(b, x, 4 * chaK(u));
            x.st.srShred = Math.min(6, (x.st.srShred || 0) + 2);
          }
        });
        return c;
      };
      const firstC = hurlAt(null, false);
      if (P >= 2) {
        addSorcery(b, u, 2, firstC, hurlAt);
      }
      if (P === 3) {
        const burning = foes(b, u).filter(x => x.alive && x.st.burn >= 1);
        if (burning.length) {
          callout(b, u, 'BURN DETONATION!', '#ff6a2a');
          burning.forEach(x => {
            const v = Math.max(12, Math.round(x.st.burn * 2.2));
            x.st.burn = 0;
            u.stats.burnCredit = (u.stats.burnCredit || 0) + 1;
            hit(b, u, x, v, { kind: 'magic', ty: 'fire', noBonus: 1, area: 1 });
          });
        }
      }
    }
  },
  paths: [
    {
      k: 'draconic', n: 'Draconic Surge', attr: 'cha', tags: ['burn', 'd20'],
      x: 'Enemy Burn ticks feed Cinder Sorcery Points and +1 to her next d20 roll.',
      full: 'Every 3rd enemy Burn tick grants Cinder +1 Sorcery Point and +1 to her next ability d20 roll.',
      t4x: 'Metamagic fires at 3 Sorcery Points instead of 4.',
      f: { draconicSurge: 1 }
    },
    {
      k: 'wildfire', n: 'Wildfire', attr: 'int', tags: ['burn', 'charge'],
      x: 'Metamagic casts apply Exposed and shred enemy Spell Resistance.',
      full: 'Metamagic (Twinned) Fireballs apply Exposed and shred −2 SR on every foe hit.',
      t4x: 'Burning foes spread 80% of their Burn to the nearest enemy on death.',
      f: { wildfire: 1 }
    }
  ],
  quest: {
    id: 'cinder_q', statKey: 'burnCredit', goal: 30,
    label: 'Apply or detonate Burn on 30 foes',
    rewardName: 'Dragon’s Hoard',
    rewardDesc: 'Gains +1 CHA for every 25 Gold currently held (cap +6).'
  }
});

hero('zark', {
  name: 'Zark', fullName: 'Zark',
  title: 'Half-Orc Barbarian · Bear Totem', cls: 'Barbarian', sub: 'Totem Warrior (Bear)', anc: 'Half-Orc',
  role: 'Tank', reach: 'Melee', rng: 1, ft: 30,
  bio: 'Gets angrier, tougher, and faster every time someone tries to stop him.',
  attr: { str: 16, dex: 12, con: 16, int: 8, wis: 10, cha: 10 },
  prim: 'con', pair: ['str', 'con'],
  hp: 142, ac: 14, sr: 11,
  kw: { rage: 1 },
  ckw: [
    { k: 'rage', sub: 'Bear Rage', x: 'High/Nat 20 Bear Cleave stacks uncapped Rage (+6% damage reduction & +10% attack speed per stack) and restores 10% HP.' }
  ],
  passive: { n: 'Relentless Endurance', x: 'Once per fight, survives lethal damage at 1 HP.' },
  f: { relentlessEndurance: 1, bearTotem: 1 },
  atk: { n: 'Greataxe', d: [1, 12], flat: 3, kind: 'phys', ty: 'slashing', iv: 1.5 },
  abil: {
    n: 'Bear Cleave', cr: 7.5, pa: 9, cut: [6, 13], self: 1,
    one: 'Cleaves frontline foes; High stacks uncapped Rage (+DR, speed & 10% heal), Nat 20 adds 2 Rage stacks, Stun, and 50% Charge refund.',
    b: [
      'Sweeps his greataxe across adjacent foes for 2d8 slashing.',
      'Sweeps his greataxe across adjacent foes for 3d8 slashing.',
      'Cleaves for 3d10, restores 10% HP, and gains +1 Bear Rage stack (+6% DR & +10% speed).',
      'Cleaves for 4d12, restores 15% HP, gains +2 Bear Rage stacks, stuns for 1.5s, and refunds 50% Charge.'
    ],
    fx(b, u, P) {
      const adj = foes(b, u).filter(x => hd(x, u) <= 1);
      const targets = adj.length ? adj : (u.target && u.target.alive ? [u.target] : []);
      if (!targets.length) return;
      b.events.push({ k: 'area', id: u.id, shape: 'nova', r: 1, ty: 'slashing', ids: targets.map(x => x.id) });
      const dice = [[2, 8], [3, 8], [3, 10], [4, 12]][P];
      targets.forEach(x => {
        hit(b, u, x, roll(dice[0], dice[1]), { kind: 'phys', ty: 'slashing', melee: 1, area: 1 });
        if (P === 3 && x.alive) stun(b, x, 1.5);
      });
      if (P >= 2) {
        addBearRage(b, u, P === 3 ? 2 : 1);
        heal(b, u, u, Math.round(u.maxHp * (P === 3 ? .15 : .10)), { raw: 1 });
      }
      if (P === 3) {
        later(b, .05, () => { if (u.alive) giveCharge(b, u, 50); });
        callout(b, u, 'UNSTOPPABLE BEAR!', '#ff6a4a');
      }
    }
  },
  paths: [
    {
      k: 'relentless', n: 'Relentless Bear', attr: 'con', tags: ['rage', 'd20'],
      x: 'Taking heavy hits grants Zark +2 to his next d20 roll and heals a sliver of CON.',
      full: 'Whenever Zark takes a hit of at least 10% of his max HP, he gains +2 to his next ability d20 roll and heals 3 + CON HP.',
      t4x: 'Each Bear Rage stack also grants +1 Armor Penetration.',
      f: { relentlessBear: 1 }
    },
    {
      k: 'totemroar', n: 'Totem Roar', attr: 'str', tags: ['rage', 'side', 'charge'],
      x: 'Whenever Zark or any ally enters/stacks Rage, adjacent allies gain +25% attack speed and +18 Charge.',
      full: 'Whenever Zark or any Barbarian ally enters or stacks Rage, adjacent allies gain +25% attack speed for 3s and +18 Charge.',
      t4x: 'Totem Roar affects the entire party.',
      f: { totemRoar: 1 }
    }
  ],
  quest: {
    id: 'zark_q', statKey: 'bearRagePeak', goal: 5,
    label: 'Reach 5 stacks of Bear Rage in a single fight',
    rewardName: 'Relentless Hide',
    rewardDesc: 'Gains +1 CON permanently after every fight survived where he dropped below 50% HP.'
  }
});

hero('naill', {
  name: 'Naill', fullName: 'Naill',
  title: 'Wood Elf Monk · Open Hand', cls: 'Monk', sub: 'Way of the Open Hand', anc: 'Wood Elf',
  role: 'Damage', reach: 'Melee', rng: 1, ft: 40,
  bio: 'Four strikes before the dust settles, and never where you swing back.',
  attr: { str: 10, dex: 16, con: 12, int: 10, wis: 16, cha: 10 },
  prim: 'wis', pair: ['dex', 'wis'],
  hp: 100, ac: 15, sr: 13,
  kw: { ki: 1, ki_ability: 1 },
  ckw: [
    { k: 'ki', sub: '4-Pip Ki Bar', x: 'Builds Ki from attacks, taking hits, and High Flurry of Blows.' },
    { k: 'ki_ability', sub: 'Open Hand Strike', x: 'At full Ki, unleashes an immediate Staggering strike that triggers on-hit effects.' }
  ],
  passive: { n: 'Fleet of Foot', x: '40 ft speed for rapid movement and target-switching on the grid.' },
  f: { monkNaill: 1 },
  atk: { n: 'Unarmed Strike', d: [1, 6], flat: 1, kind: 'phys', ty: 'bludgeoning', iv: 0.95 },
  abil: {
    n: 'Flurry of Blows', cr: 7.5, pa: 9, cut: [6, 13],
    one: 'Rapid unarmed barrage triggering on-hit; High fills Ki for an immediate Ki Ability, Nat 20 fires two Ki Abilities + Afterimage.',
    b: [
      'Unleashes 3 rapid unarmed strikes triggering on-hit effects.',
      'Unleashes 4 rapid unarmed strikes triggering on-hit effects.',
      'Unleashes 4 strikes and fills Ki, immediately firing Ki Ability: Open Hand Strike (Stagger + bonus hit).',
      'Unleashes 5 strikes, fires two Ki Abilities, and gains Afterimage (dodges next 2 attacks).'
    ],
    fx(b, u, P) {
      const t = (u.target && u.target.alive) ? u.target : foes(b, u)[0];
      if (!t || !t.alive) return;
      const count = [3, 4, 4, 5][P];
      b.events.push({ k: 'area', id: u.id, tid: t.id, shape: 'cone', r: 1.4, ty: 'thunder', ids: [t.id] });
      for (let i = 0; i < count; i++) {
        later(b, i * .08, () => {
          if (!u.alive) return;
          const x = t.alive ? t : foes(b, u).sort((a, c) => hd(a, u) - hd(c, u))[0];
          if (x && hd(x, u) <= Math.max(2, u.rng)) strike(b, u, x, .75);
        });
      }
      if (P >= 2) {
        u.ki = KI_MAX;
        later(b, .18, () => {
          if (!u.alive) return;
          const x = t.alive ? t : foes(b, u).sort((a, c) => hd(a, u) - hd(c, u))[0];
          if (x) fireNaillKiStrike(b, u, x);
        });
      }
      if (P === 3) {
        later(b, .34, () => {
          if (!u.alive) return;
          const x = t.alive ? t : foes(b, u).sort((a, c) => hd(a, u) - hd(c, u))[0];
          if (x) fireNaillKiStrike(b, u, x);
        });
        u.afterimage = (u.afterimage || 0) + 2;
        callout(b, u, 'AFTERIMAGE ×2!', '#8fd8d8');
      }
    }
  },
  paths: [
    {
      k: 'openhand', n: 'Open Hand', attr: 'dex', tags: ['onhit', 'd20'],
      x: 'Every Ki Ability triggers on-hit effects twice and grants +1 to Naill’s next d20 roll.',
      full: 'Every Ki Ability (Open Hand Strike) triggers Naill’s on-hit effects twice and adds +1 to Naill’s next ability d20 roll.',
      t4x: 'Ki bar shrinks from 4 to 3.',
      f: { naillOpenHand: 1 }
    },
    {
      k: 'flowing', n: 'Flowing Leaves', attr: 'wis', tags: ['control', 'charge'],
      x: 'Ki Abilities Stagger and Expose adjacent foes.',
      full: 'Whenever Naill (or any ally) lands a Ki Ability, foes adjacent to the target are also Staggered and Exposed.',
      t4x: 'Ki Abilities feed +15 Charge to the lowest-Charge ally.',
      f: { flowingLeaves: 1 }
    }
  ],
  quest: {
    id: 'naill_q', statKey: 'kiStrikes', goal: 25,
    label: 'Trigger 25 Ki Abilities',
    rewardName: 'Wraps of the Hundred Fists',
    rewardDesc: '+2 DEX; Ki Abilities grant Advantage on Naill’s next ability d20 roll, and dodging via Afterimage grants +1 Ki.'
  }
});

hero('nettle', {
  name: 'Nettle', fullName: 'Nettle',
  title: 'Halfling Warlock · The Fiend', cls: 'Warlock', sub: 'The Fiend', anc: 'Halfling',
  role: 'Support', reach: 'Ranged', rng: 4, ft: 25,
  bio: 'Reads the fine print aloud while her patron collects the balance.',
  attr: { str: 8, dex: 12, con: 12, int: 14, wis: 10, cha: 16 },
  prim: 'cha', pair: ['cha', 'cha'],
  hp: 88, ac: 13, sr: 13,
  kw: { hex: 1, pact_boon: 1 },
  ckw: [
    { k: 'hex', sub: 'Infernal Hex', x: 'Curses foes to take bonus necrotic damage on every hit; transfers on death.' },
    { k: 'pact_boon', sub: 'Dark One’s Blessing', x: 'When a Hexed foe dies, Pact Boon heals Nettle’s team and triggers Bargain / Contract clauses.' }
  ],
  passive: { n: 'Brave', x: 'Immune to Frighten.' },
  f: { braveSelf: 1 },
  atk: { n: 'Eldritch Blast', d: [1, 10], flat: 1, kind: 'magic', ty: 'force', iv: 1.4 },
  abil: {
    n: 'Infernal Hex', cr: 8, pa: 9, cut: [6, 13], self: 1,
    one: 'Curses a foe with Hex (bonus necrotic on every hit); High adds Necrosis + Pact Boon jump-heal, Nat 20 Hexes 3 foes and slows them.',
    b: [
      'Curses 1 foe with Hex (takes +1d4 necrotic on every hit).',
      'Curses 1 foe with Hex (takes +1d6 necrotic on every hit) and deals 2d6 force.',
      'Applies Hex + Necrosis; on death, Pact Boon jumps Hex and heals Nettle’s team.',
      'Hexes 3 foes and slows their attack speed and d20 rolls for 4s.'
    ],
    fx(b, u, P) {
      const fs = foes(b, u).filter(x => !x.hidden);
      if (!fs.length) return;
      const t = (u.target && u.target.alive) ? u.target : fs[0];
      if (P === 3) {
        const picked = fs.slice().sort((a, c) => (a.st.hex ? 1 : 0) - (c.st.hex ? 1 : 0) || c.maxHp - a.maxHp).slice(0, 3);
        picked.forEach(x => {
          b.events.push({ k: 'beam', id: u.id, tid: x.id, ty: 'necrotic' });
          b.events.push({ k: 'area', id: u.id, tid: x.id, shape: 'splash', r: 0.85, ty: 'necrotic', ids: [x.id] });
          applyNettleHex(b, u, x, true);
          x.st.hexSlow = Math.max(x.st.hexSlow || 0, 4 * chaK(u));
          addNec(b, u, x, 10 * chaK(u));
        });
        callout(b, u, 'TRIPLE HEX!', '#c48fe6');
      } else {
        b.events.push({ k: 'beam', id: u.id, tid: t.id, ty: 'necrotic' });
        b.events.push({ k: 'area', id: u.id, tid: t.id, shape: 'splash', r: 0.8, ty: 'necrotic', ids: [t.id] });
        applyNettleHex(b, u, t, P >= 2);
        if (P >= 1) hit(b, u, t, roll(2, 6), { kind: 'magic', ty: 'force', ab: 1 });
        if (P === 2) addNec(b, u, t, 14 * chaK(u));
      }
    }
  },
  paths: [
    {
      k: 'fineprint', n: 'Fine Print', attr: 'cha', tags: ['hex', 'necrosis'],
      x: 'Hexed foes taking status damage (Burn, Poison, Necrosis) suffer extra hellfire bursts.',
      full: 'Whenever a Hexed foe takes Burn, Poison, or Necrosis, they suffer an extra 1d6 hellfire burst.',
      t4x: 'Hex never fades and can stack twice on the same foe.',
      f: { finePrint: 1 }
    },
    {
      k: 'bargain', n: 'Dark One’s Bargain', attr: 'int', tags: ['hex', 'd20', 'charge'],
      x: 'Pact Boon grants the ally who slew a Hexed foe +30 Charge and Advantage on their next roll.',
      full: 'Whenever any ally kills a Hexed foe (Pact Boon), that ally gains +30 Charge and Advantage on their next ability d20 roll.',
      t4x: 'Killing a Hexed Elite or Boss drops +3 bonus Gold.',
      f: { darkBargain: 1 }
    }
  ],
  quest: {
    id: 'nettle_q', statKey: 'hexDeaths', goal: 15,
    label: 'Trigger Pact Boon 15 times (Hexed deaths)',
    rewardName: 'Infernal Contract',
    rewardDesc: '+2 INT; each Pact Boon adds a glowing clause for the rest of the fight (+1 d20 and +10% Charge speed, uncapped).'
  }
});

/* ==========================================================================
   PACK 4: DIVINE INTERVENTION (Pillar, Mother Laurel, Lumen, Brother Jamison)
   ========================================================================== */

hero('pillar', {
  name: 'Pillar', fullName: 'Pillar',
  title: 'Goliath Zealot Barbarian · Tank', cls: 'Barbarian', sub: 'Path of the Zealot', anc: 'Goliath',
  role: 'Tank', reach: 'Melee', rng: 1, ft: 30,
  bio: 'Carved from mountain oath and stubborn faith; refuses to fall while the fight still stands.',
  attr: { str: 16, dex: 10, con: 16, int: 8, wis: 12, cha: 10 },
  prim: 'str', pair: ['str', 'str'],
  hp: 152, ac: 15, sr: 12,
  kw: { rage: 1 },
  ckw: [
    { k: 'rage', sub: 'Zealot Rage', x: 'High/Nat 20 Monument Charge enters Rage (cannot drop below 1 HP for 2.5s/3.5s).' }
  ],
  passive: { n: 'Stone’s Endurance', x: 'Reduces incoming heavy hits by 4 damage.' },
  f: { stoneEndure: 4 },
  atk: { n: 'Maul of Faith', d: [1, 10], flat: 3, kind: 'phys', ty: 'bludgeoning', iv: 1.5 },
  abil: {
    n: 'Monument Charge', cr: 7.5, pa: 8, cut: [6, 13], self: 1,
    one: 'Slams foes with Holy impact; High enters Rage (cannot drop below 1 HP), Nat 20 cracks a line Stun + Holy shockwave.',
    b: [
      'Slams target for 2d8 bludgeoning + 1d6 Holy.',
      'Slams target for 3d8 + 2d6 Holy and Taunts adjacent foes.',
      'Enters Zealot Rage (cannot drop below 1 HP for 2.5s) and deals 3d8 + 2d6 Holy.',
      'Cracks the ground in a line (4d8 Holy + Stun 1.6s) and enters Zealot Rage for 3.5s.'
    ],
    fx(b, u, P) {
      const fs = foes(b, u).filter(x => !x.hidden);
      if (!fs.length) return;
      const t = (u.target && u.target.alive) ? u.target : fs.slice().sort((a, c) => hd(a, u) - hd(c, u))[0];
      if (P === 3) {
        const len = u.questDone ? 5 : 4;
        const line = lineHexes(u, t, len);
        const ts = fs.filter(x => x === t || line.some(h => hd(h, x) <= (u.questDone ? 1 : 0)));
        b.events.push({ k: 'area', id: u.id, tid: t.id, shape: 'line', r: len, ty: 'radiant', ids: ts.map(x => x.id) });
        ts.forEach(x => { hit(b, u, x, roll(4, 8), { kind: 'holy', ty: 'radiant', area: 1, ab: 1 }); stun(b, x, 1.6); });
        enterZealotRage(b, u, 3.5);
        callout(b, u, 'LIVING MONUMENT!', '#ffe9a0');
      } else {
        b.events.push({ k: 'area', id: u.id, tid: t.id, shape: 'splash', r: 1, ty: 'radiant', ids: [t.id] });
        hit(b, u, t, roll(P === 0 ? 2 : 3, 8), { kind: 'phys', ty: 'bludgeoning', melee: 1, ab: 1 });
        if (t.alive) hit(b, u, t, roll(P === 0 ? 1 : 2, 6), { kind: 'holy', ty: 'radiant', noBonus: 1, ab: 1 });
        if (P >= 1) taunt(b, u, 2, 2.5);
        if (P === 2) {
          enterZealotRage(b, u, 2.5);
        }
      }
    }
  },
  paths: [
    {
      k: 'unstoppable', n: 'Unstoppable Faith', attr: 'str', tags: ['rage', 'holy', 'control'],
      x: 'While in Rage, attacks deal +1d8 Holy and kills extend Rage by 1.5s.',
      full: 'During Zealot Rage, Pillar’s attacks add +1d8 Holy damage and every kill extends Rage by 1.5s.',
      t4x: 'Starts every fight in Zealot Rage for 1.5s.',
      f: { unstoppableFaith: 1 }
    },
    {
      k: 'beacon', n: 'Living Beacon', attr: 'con', tags: ['holy', 'side'],
      x: 'Taking hits empowers adjacent allies’ next strikes with a +1d6 Holy Smite.',
      full: 'Whenever Pillar takes damage, adjacent allies gain a Smite charge adding +1d6 Holy to their next strike.',
      t4x: 'Entering Rage also heals nearby allies.',
      f: { livingBeacon: 1 }
    }
  ],
  quest: {
    id: 'pillar_q', statKey: 'taken', goal: 1200,
    label: 'Soak 1,200 total damage',
    rewardName: 'Living Colossus',
    rewardDesc: '+3 STR; transforms into a Large (2×2) stone statue with wider Nat 20 shockwaves.'
  }
});

hero('mother_laurel', {
  name: 'Mother Laurel', fullName: 'Mother Laurel',
  title: 'Elf Ancients Paladin · Tank', cls: 'Paladin', sub: 'Oath of the Ancients', anc: 'Wood Elf',
  role: 'Tank', reach: 'Melee', rng: 2, ft: 35,
  bio: 'Her glaive sings like wind through old-growth boughs, binding invaders in blooming vines.',
  attr: { str: 14, dex: 12, con: 14, int: 10, wis: 16, cha: 12 },
  prim: 'wis', pair: ['str', 'wis'],
  hp: 134, ac: 16, sr: 15,
  kw: { smite: 1, aura: 1 },
  ckw: [
    { k: 'smite', sub: 'Verdant Smite', x: 'Every 3rd glaive strike and Nature’s Wrath trigger Smite (+1d6 Holy + Root).' },
    { k: 'aura', sub: 'Aura of Warding', x: 'Allies within 2 squares gain +2 Spell Resistance (upgraded by Ancients’ Ward).' }
  ],
  passive: { n: 'Warden’s Reach', x: 'Sweeping melee glaive strikes from 2 squares away.' },
  f: { smitePeriodic: 1, verdantSmite: 1, auraWarding: 1 },
  atk: { n: 'Verdant Glaive', d: [1, 10], flat: 2, kind: 'phys', ty: 'slashing', iv: 1.45 },
  abil: {
    n: 'Nature’s Wrath', cr: 7.5, pa: 8, cut: [6, 13], self: 1,
    one: 'Sweeping glaive + Verdant Smite & Root; High blooms party healing and cleanse, Nat 20 Roots all melee foes + party Ward.',
    b: [
      'Sweeps target for 2d6 slashing + Verdant Smite (1d6 Holy) and Roots it for 2s.',
      'Sweeps 2 foes for 2d8 slashing + Verdant Smite and Roots them for 2.5s.',
      'Sweeps 2 foes + Verdant Smite & Root, blooming a heal and cleansing debuffs on nearby allies.',
      'Roots all melee foes for 3.5s, Smites them, and blooms a party-wide Heal + Ward.'
    ],
    fx(b, u, P) {
      const fs = foes(b, u).filter(x => !x.hidden).sort((a, c) => hd(a, u) - hd(c, u));
      if (!fs.length) return;
      const targets = P === 3 ? fs.filter(x => hd(x, u) <= 3) : fs.slice(0, P === 0 ? 1 : 2);
      const hitList = targets.length ? targets : [fs[0]];
      b.events.push({ k: 'area', id: u.id, tid: hitList[0].id, shape: P === 3 ? 'nova' : 'cone', r: P === 3 ? 3 : 2, ty: 'poison', ids: hitList.map(x => x.id) });
      hitList.forEach(t => {
        hit(b, u, t, roll(2, P === 0 ? 6 : 8), { kind: 'phys', ty: 'slashing', melee: 1, ab: 1 });
        if (t.alive) {
          triggerSmite(b, u, t, roll(1, 6), { label: 'VERDANT SMITE', ab: 1 });
          applyRoot(b, u, t, [2, 2.5, 3, 3.5][P] * chaK(u));
        }
      });
      if (P >= 2) {
        const allies = friends(b, u).filter(a => !a.minion && (P === 3 || hd(a, u) <= 3));
        allies.forEach(a => {
          heal(b, u, a, (14 + Math.max(0, u.m.wis) * 3) * u.dm, { raw: 1 });
          a.st.poison = Math.max(0, a.st.poison - 2);
          a.st.burn = Math.max(0, a.st.burn - 6);
          if (P === 3 || u.questDone) addWard(b, a, (16 + Math.max(0, u.m.wis) * 2) * u.dm, a.maxHp * .4, u);
          if (u.questDone) { a.tempHaste = Math.max(a.tempHaste || 0, 15); a.tempHasteT = Math.max(a.tempHasteT || 0, 4); }
        });
        u.stats.bloomHeals = (u.stats.bloomHeals || 0) + allies.length;
        if (P === 3) callout(b, u, 'ANCIENT BLOOM!', '#8fe0a0');
      }
    }
  },
  paths: [
    {
      k: 'ancients_ward', n: 'Ancients’ Ward', attr: 'wis', tags: ['ward', 'holy'],
      x: 'Mother Laurel’s Aura grants an extra +3 Spell Resistance to nearby allies.',
      full: 'Supercharges Aura of Warding, granting nearby allies +3 additional Spell Resistance against magic damage.',
      t4x: 'Aura also raises nearby allies’ minimum natural d20 floor by +1.',
      f: { ancientsWard: 1 }
    },
    {
      k: 'bountiful_vines', n: 'Bountiful Vines', attr: 'str', tags: ['control', 'holy'],
      x: 'Rooted foes take +1d6 Holy Smite on hit; any ally Smite or Wild Shape heals the most-hurt ally (1s CD).',
      full: 'Striking a Rooted foe adds +1d6 Holy Smite damage. Whenever any ally triggers Smite or Wild Shape, pulses a heal to the lowest-HP ally (1s cooldown).',
      t4x: 'Heals the 2 lowest-HP allies instead of one.',
      f: { bountifulVines: 1 }
    }
  ],
  quest: {
    id: 'laurel_q', statKey: 'rootsApplied', goal: 18,
    label: 'Root 18 enemies with Nature’s Wrath',
    rewardName: 'Garden of Plenty',
    rewardDesc: '+2 WIS; every Nature’s Wrath bloom also grants Ward and +15% Attack Speed.'
  }
});

hero('lumen', {
  name: 'Lumen', fullName: 'Lumen',
  title: 'Aasimar Light Cleric · Damage', cls: 'Cleric', sub: 'Light Domain', anc: 'Aasimar',
  role: 'Damage', reach: 'Ranged', rng: 4, ft: 30,
  bio: 'Draws noon sunlight straight into dungeon corridors until every shadow burns away.',
  attr: { str: 8, dex: 12, con: 12, int: 12, wis: 16, cha: 14 },
  prim: 'wis', pair: ['wis', 'wis'],
  hp: 94, ac: 13, sr: 15,
  kw: { channel_divinity: 1 },
  ckw: [
    { k: 'channel_divinity', sub: 'Radiance of the Dawn', x: 'Once per fight, on her first High/Nat 20 Sunbeam (or when 3+ foes Burn), unleashes a 3d8 Holy + Burn nova.' }
  ],
  passive: { n: 'Warding Flare', x: 'Blinding sunlight applies burning Sear stacks with Sunbeam.' },
  f: { lumenCaster: 1 },
  atk: { n: 'Sacred Flame', d: [1, 8], flat: 2, kind: 'holy', ty: 'radiant', iv: 1.4 },
  abil: {
    n: 'Sunbeam', cr: 8.5, pa: 9, cut: [6, 13],
    one: 'Line of Holy damage + Burn (Sear); High awakens Radiant Soul & Channel Divinity, Nat 20 detonates all Burn.',
    b: [
      'Fires a narrow Sunbeam (2d8 Holy + Burn) along a line.',
      'Fires a Sunbeam (3d8 Holy + Burn) along a line.',
      'Fires a Sunbeam (4d8 Holy + Burn), awakens Radiant Soul, and fires Channel Divinity if ready.',
      'Double-width Sunbeam (5d8 Holy) detonating all Burn on hit foes!'
    ],
    fx(b, u, P) {
      const fs = foes(b, u).filter(x => !x.hidden);
      if (!fs.length) return;
      const t = (u.target && u.target.alive) ? u.target : fs[0];
      const line = lineHexes(u, t, 6);
      const ts = fs.filter(x => x === t || line.some(h => hd(h, x) <= (P === 3 ? 1 : 0)));
      const hits = ts.length ? ts : [t];
      b.events.push({ k: 'area', id: u.id, tid: t.id, shape: 'line', r: 6, ty: 'radiant', ids: hits.map(x => x.id) });
      const nDice = [2, 3, 4, 5][P];
      hits.forEach(x => {
        hit(b, u, x, roll(nDice, 8), { kind: 'holy', ty: 'radiant', area: 1, ab: 1 });
        if (x.alive) {
          applyStatus(b, u, x, 'burn', (P === 0 ? 5 : 9) * chaK(u));
          u.stats.searApplied = (u.stats.searApplied || 0) + 1;
          if (u.f.judgement) u.nextBonus = Math.min(6, (u.nextBonus || 0) + 1);
          if (P === 3 && x.st.burn > 0) {
            const det = Math.round(x.st.burn * 1.4);
            x.st.burn = 0;
            hit(b, u, x, det, { kind: 'holy', ty: 'radiant', noBonus: 1, area: 1 });
            if (u.f.purifyingLight && u.tier >= 4) friends(b, u).filter(a => !a.minion).forEach(a => heal(b, u, a, 14 * u.dm, { raw: 1 }));
          }
          if (u.questDone && x.alive && x.hp / x.maxHp < 0.16) {
            hit(b, u, x, x.hp + 10, { kind: 'holy', ty: 'radiant', noBonus: 1 });
            status(b, x, 'JUDGED', '#ffe9a0');
          }
        }
      });
      if (P >= 2) {
        u.radiantSoulT = Math.max(u.radiantSoulT || 0, P === 3 ? 7 : 5);
        u.tempHaste = Math.max(u.tempHaste || 0, 30);
        u.tempHasteT = Math.max(u.tempHasteT || 0, 5);
        status(b, u, 'RADIANT SOUL', '#ffe9a0');
        if (!u._cdUsed) triggerLumenCD(b, u);
      }
      if (P === 3) callout(b, u, 'SOLAR DETONATION!', '#ffe9a0');
    }
  },
  paths: [
    {
      k: 'judgement', n: 'Judgement', attr: 'wis', tags: ['holy', 'd20'],
      x: 'Each foe Seared by Sunbeam adds +1 to Lumen’s next d20 roll.',
      full: 'Every foe hit with Sear adds +1 (up to +6) to Lumen’s next ability d20 roll.',
      t4x: 'Radiant Soul attacks splash 50% Holy damage to an adjacent foe.',
      f: { judgement: 1 }
    },
    {
      k: 'purifying', n: 'Purifying Light', attr: 'cha', tags: ['holy', 'burn'],
      x: 'Ally Holy damage applies Burn; whenever any ally triggers Channel Divinity, Lumen fires a free Sear bolt.',
      full: 'Whenever any ally deals Holy damage, it applies Burn. Whenever any ally triggers Channel Divinity, Lumen fires a free 2d8 Holy + Burn bolt at the highest-HP foe.',
      t4x: 'Detonating Burn heals the whole party.',
      f: { purifyingLight: 1 }
    }
  ],
  quest: {
    id: 'lumen_q', statKey: 'searApplied', goal: 25,
    label: 'Sear 25 enemies with Sunbeam',
    rewardName: 'Book of Judgement',
    rewardDesc: '+2 WIS; Sunbeam automatically executes Seared enemies below 16% HP.'
  }
});

hero('jamison', {
  name: 'Brother Jamison', fullName: 'Brother Jamison',
  title: 'Human Peace Cleric · Support', cls: 'Cleric', sub: 'Peace Domain', anc: 'Human',
  role: 'Support', reach: 'Melee', rng: 1, ft: 30,
  bio: 'Keeps a pot of tea hot and his companions linked by an unshakable prayer of fellowship.',
  attr: { str: 12, dex: 10, con: 14, int: 10, wis: 14, cha: 16 },
  prim: 'cha', pair: ['cha', 'cha'],
  hp: 118, ac: 15, sr: 14,
  kw: { channel_divinity: 1 },
  ckw: [
    { k: 'channel_divinity', sub: 'Balm of Peace', x: 'Once per fight, when an ally drops below 60% HP (or on High Bond), bonds and heals the entire party.' }
  ],
  passive: { n: 'Peaceful Aura', x: 'Emboldening Bond links allies for +1d4 on ability d20 rolls.' },
  f: { peaceCleric: 1 },
  atk: { n: 'Quarterstaff', d: [1, 6], flat: 2, kind: 'phys', ty: 'bludgeoning', iv: 1.45 },
  abil: {
    n: 'Emboldening Bond', cr: 8.5, pa: 8, cut: [6, 13], self: 1,
    one: 'Links allies for bonus d20 dice; High links 3 + pulses Word of Radiance & Balm of Peace, Nat 20 bonds whole party with shared Charge.',
    b: [
      'Links 2 allies with Emboldening Bond (+1d4 to their next ability roll).',
      'Links 2 allies with Emboldening Bond and heals them for 1d8.',
      'Links 3 allies, pulses Word of Radiance (2d8 Holy AoE), and triggers Channel Divinity if ready.',
      'Bonds the entire party! Any ally High/Nat 20 feeds +18 Charge to all bonded allies.'
    ],
    fx(b, u, P) {
      const fr = friends(b, u).filter(a => !a.minion);
      const count = P === 3 ? fr.length : P === 2 ? 3 : 2;
      const picked = fr.slice().sort((a, c) => (a.bonded ? 1 : 0) - (c.bonded ? 1 : 0)).slice(0, count);
      const die = (u.f.goodVibes && u.tier >= 4) ? 6 : 4;
      b.events.push({ k: 'area', id: u.id, shape: 'nova', r: P >= 2 ? 3 : 2, ty: 'radiant', ids: picked.map(x => x.id) });
      picked.forEach(a => {
        a.bonded = u;
        a.bondDie = Math.max(a.bondDie || 0, die);
        if (P === 3) a.bondChargeShare = 1;
        if (u.questDone) a.d20Floor = Math.max(a.d20Floor || 1, u.d20Floor || 1);
        if (P >= 1) heal(b, u, a, (roll(1, 8) + Math.max(0, u.m.cha) * 2) * u.dm, { raw: 1 });
        status(b, a, `BONDED +d${die}`, '#ffe9a0');
      });
      u.stats.bondedCasts = (u.stats.bondedCasts || 0) + picked.length;
      if (P >= 2) {
        const near = foes(b, u).filter(x => hd(x, u) <= 2);
        near.forEach(x => hit(b, u, x, roll(2, 8), { kind: 'holy', ty: 'radiant', area: 1, ab: 1 }));
        if (!u._cdUsed) triggerJamisonCD(b, u);
      }
      if (P === 3) callout(b, u, 'EMBOLDENING BOND!', '#ffe9a0');
    }
  },
  paths: [
    {
      k: 'good_vibes', n: 'Good Vibes', attr: 'wis', tags: ['d20', 'side'],
      x: 'Bonded allies gain +1 minimum d20 floor and 15% damage reduction.',
      full: 'Allies linked by Emboldening Bond gain +1 minimum natural d20 floor and take 15% less damage.',
      t4x: 'Emboldening Bond bonus die upgrades from d4 to d6.',
      f: { goodVibes: 1 }
    },
    {
      k: 'peace_radiance', n: 'Peace & Radiance', attr: 'cha', tags: ['holy', 'charge'],
      x: 'Bonded ally casts and ally Channel Divinity triggers radiate a free 1d8 Holy pulse around Jamison.',
      full: 'Whenever a bonded ally casts an ability—or any ally triggers Channel Divinity—Jamison radiates a free 1d8 Holy burst to nearby enemies.',
      t4x: 'Each Holy pulse also heals the lowest-HP bonded ally.',
      f: { peaceRadiance: 1 }
    }
  ],
  quest: {
    id: 'jamison_q', statKey: 'bondedCasts', goal: 20,
    label: 'Link allies 20 times with Emboldening Bond',
    rewardName: 'Holy Symbol of Pelor',
    rewardDesc: '+2 CHA; bonded allies inherit Brother Jamison’s WIS d20 floor.'
  }
});

/* ==========================================================================
   PACK 5: CORNERING THE MARKET (Zoe, Toot, Gilthrax, Gains)
   ========================================================================== */

hero('zoe', {
  name: 'Zoe', fullName: 'Zoe',
  title: 'Human Rune Knight Fighter · Support', cls: 'Fighter', sub: 'Rune Knight', anc: 'Human',
  role: 'Support', reach: 'Melee', rng: 1, ft: 30,
  bio: 'Carries three packs, six runes, and somehow always pulls out the exact gizmo you need.',
  attr: { str: 14, dex: 12, con: 14, int: 16, wis: 10, cha: 12 },
  prim: 'int', pair: ['str', 'int'],
  hp: 116, ac: 15, sr: 12,
  kw: { action_surge: 1 },
  ckw: [
    { k: 'action_surge', sub: 'Runic Momentum', x: 'High/Nat 20 Rummage triggers Action Surge on buffed allies (immediate free attack + Runic Upgrade Ward).' }
  ],
  passive: { n: 'Pack Rat', x: 'Rummages battle buffs that supercharge allies’ equipped items.' },
  f: { runeKnight: 1 },
  atk: { n: 'Runed Hammer', d: [1, 8], flat: 2, kind: 'phys', ty: 'bludgeoning', iv: 1.35 },
  abil: {
    n: 'Rummage', cr: 8.5, pa: 9, cut: [6, 13], self: 1,
    one: 'Tosses a battle buff to an ally; High triggers Action Surge + Runic Upgrade, Nat 20 triggers party Action Surge + refreshes items + Gold.',
    b: [
      'Tosses a tonic to an ally (+10 HP + 15% Haste for 3s).',
      'Tosses a tonic to an ally (+16 HP + 22% Haste + 12 Charge).',
      'Triggers Action Surge (immediate free attack) + Runic Upgrade (+8% dmg, max 2 stacks, + Ward) on the most-equipped ally.',
      'Triggers party-wide Action Surge, refreshes all once-per-fight items, and pops +1 Gold!'
    ],
    fx(b, u, P) {
      const fr = friends(b, u).filter(a => !a.minion);
      const count = (P >= 2 && (u.questDone || (u.f.runeCarver && u.tier >= 4))) ? 2 : 1;
      const targets = fr.slice().sort((a, c) => (c.items ? c.items.length : 0) - (a.items ? a.items.length : 0) || hpPct(a) - hpPct(c)).slice(0, P === 3 ? fr.length : count);
      b.events.push({ k: 'area', id: u.id, shape: 'nova', r: 3, ty: 'force', ids: targets.map(x => x.id) });
      targets.forEach(a => {
        heal(b, u, a, ([8, 12, 16, 20][P] + Math.max(0, u.m.int) * 2) * u.dm, { raw: 1 });
        a.tempHaste = Math.max(a.tempHaste || 0, P >= 1 ? 22 : 15);
        a.tempHasteT = Math.max(a.tempHasteT || 0, 3.0 * chaK(u));
        if (P >= 1) giveCharge(b, a, 12);
        if (P >= 2) {
          if ((a._runicStacks || 0) < 2) {
            a._runicStacks = (a._runicStacks || 0) + 1;
            a.dm *= 1.08;
          }
          addWard(b, a, (16 + Math.max(0, u.m.int) * 2) * u.dm, a.maxHp * .35, u);
          status(b, a, 'RUNIC UPGRADE', '#ffd76a');
          triggerActionSurge(b, a, { giver: u, label: 'RUNIC SURGE' });
        }
        if (P === 3) {
          a._potionUsed = 0; a._luckUsed = 0; a._clockworkUsed = 0; a._casts = 0;
        }
      });
      u.stats.rummageBuffs = (u.stats.rummageBuffs || 0) + targets.length;
      if (P === 3) {
        gainGold(b, u, 1, 'GRAND OPENING');
        callout(b, u, 'ITEMS REFRESHED!', '#ffd76a');
      }
    }
  },
  paths: [
    {
      k: 'rune_carver', n: 'Rune Carver', attr: 'str', tags: ['onhit', 'charge'],
      x: 'Zoe’s attacks deal +3 bonus force damage for each item carried by your party.',
      full: 'Every basic attack Zoe lands adds +3 bonus force damage per item equipped across your party.',
      t4x: 'High Rummage triggers Action Surge & Runic Upgrade on 2 allies at once.',
      f: { runeCarver: 1 }
    },
    {
      k: 'just_the_thing', n: 'Just the Thing', attr: 'int', tags: ['charge', 'gold'],
      x: 'Allies with 2+ items gain +20% Charge speed & on-hit sparks; any ally Action Surge grants them Ward + 12 Charge.',
      full: 'Any ally wearing 2+ items gains +20% Charge speed and +1d4 force on hit. Whenever any ally triggers Action Surge, Zoe tosses them a Ward and +12 Charge.',
      t4x: 'Zoe gains +1 extra item slot.',
      f: { justTheThing: 1 }
    }
  ],
  quest: {
    id: 'zoe_q', statKey: 'rummageBuffs', goal: 18,
    label: 'Buff allies 18 times with Rummage',
    rewardName: 'Grand Opening',
    rewardDesc: '+2 INT; High Rummage automatically buffs 2 allies at once.'
  }
});

hero('toot', {
  name: 'Toot', fullName: 'Toot',
  title: 'Plasmoid Creation Bard · Support', cls: 'Bard', sub: 'College of Creation', anc: 'Plasmoid',
  role: 'Support', reach: 'Ranged', rng: 4, ft: 30,
  bio: 'A cheerful brass-horn ooze who turns every skirmish into a paid street performance.',
  attr: { str: 8, dex: 12, con: 14, int: 12, wis: 10, cha: 16 },
  prim: 'cha', pair: ['cha', 'cha'],
  hp: 102, ac: 13, sr: 13,
  kw: { bardic_inspiration: 1 },
  ckw: [
    { k: 'bardic_inspiration', sub: 'Mote of Potential', x: 'Grants a Bardic Inspiration Mote (Advantage on next roll + Charge); spending a Mote pops +1 Gold.' }
  ],
  passive: { n: 'Tip Jar', x: 'Every 3rd attack pops +1 Gold (up to fight cap).' },
  f: { tipJar: 1 },
  gold: { cap: 6 },
  atk: { n: 'Brass Honk', d: [1, 8], flat: 1, kind: 'magic', ty: 'thunder', iv: 1.35 },
  abil: {
    n: 'Fanfare (Motes)', cr: 8.5, pa: 8, cut: [6, 13], self: 1,
    one: 'Sends Bardic Inspiration Motes (Advantage on next cast); High sends 2 Motes + Gold, Nat 20 inspires the whole party + Gold.',
    b: [
      'Sends 1 Bardic Inspiration Mote (Advantage on next ability roll) to the highest-Charge ally.',
      'Sends 1 Bardic Inspiration Mote (Advantage + 12 Charge) to an ally.',
      'Sends 2 Bardic Inspiration Motes (Advantage + 16 Charge) and pops +1 Gold.',
      'Gives the whole party Bardic Inspiration Motes + Advantage and pops +3 Gold!'
    ],
    fx(b, u, P) {
      const fr = friends(b, u).filter(a => a !== u && !a.minion && a.abil);
      const pool = fr.length ? fr : [u];
      const count = P === 3 ? pool.length : P === 2 ? 2 : 1;
      const picked = pool.slice().sort((a, c) => (a.advantage || a.inspMote ? 1 : 0) - (c.advantage || c.inspMote ? 1 : 0) || c.charge - a.charge).slice(0, count);
      b.events.push({ k: 'area', id: u.id, shape: 'nova', r: 5, ty: 'psychic', ids: picked.map(x => x.id) });
      picked.forEach(a => {
        grantInspMote(b, u, a, (P >= 2 ? 16 : P === 1 ? 12 : 6) + (u.questDone ? 14 : 0));
      });
      if (P === 2) gainGold(b, u, u.questDone ? 2 : 1, 'ENCORE TIP');
      if (P === 3) {
        gainGold(b, u, u.questDone ? 4 : 3, 'STANDING OVATION');
        callout(b, u, 'PARTY MOTES!', '#ffd76a');
      }
    }
  },
  paths: [
    {
      k: 'busker', n: 'Busker’s Rhythm', attr: 'cha', tags: ['gold', 'charge'],
      x: 'Each Gold earned in combat grants Toot +10% Attack Speed and +10% Charge speed.',
      full: 'Every Gold generated during the fight speeds up Toot’s attacks and Charge by +10% for that fight.',
      t4x: 'Motes also grant +2 to the ally’s next d20 roll.',
      f: { busker: 1 }
    },
    {
      k: 'street_performer', n: 'Street Performer', attr: 'dex', tags: ['gold', 'd20'],
      x: 'Ally High/Nat 20 rolls drop +1 Gold (+2 Gold if the ally spent Bardic Inspiration).',
      full: 'Every ally High or Nat 20 ability roll triggers +1 Gold (+2 if spending Bardic Inspiration from any Bard, up to fight cap).',
      t4x: 'Unspent Gold grants the party +2% starting Charge per Gold (max +40%).',
      f: { streetPerformer: 1 }
    }
  ],
  quest: {
    id: 'toot_q', statKey: 'gold', goal: 20,
    label: 'Earn 20 Gold in combat',
    rewardName: 'Record Deal',
    rewardDesc: '+2 CHA; Motes grant +14 extra Charge and High/Nat 20 Fanfare drops extra Gold.'
  }
});

hero('gilthrax', {
  name: 'Gilthrax', fullName: 'Gilthrax',
  title: 'Gold Dragonborn Eldritch Knight · Tank', cls: 'Fighter', sub: 'Eldritch Knight', anc: 'Gold Dragonborn',
  role: 'Tank', reach: 'Melee', rng: 1, ft: 30,
  bio: 'Polishes his scales and his relics alike; every coin and trinket fortifies his arcane ward.',
  attr: { str: 16, dex: 10, con: 16, int: 12, wis: 10, cha: 12 },
  prim: 'con', pair: ['str', 'con'],
  hp: 146, ac: 17, sr: 13,
  kw: { action_surge: 1 },
  ckw: [
    { k: 'action_surge', sub: 'Eldritch Counter', x: 'Every 3 hits absorbed or reflected by Arcane Shield triggers Action Surge (free cleave + 2d6 force pulse).' }
  ],
  passive: { n: 'Hoard Scales', x: 'Gains +10 bonus Ward on Arcane Shield for each item carried.' },
  f: { hoardScales: 1, gilthraxSurge: 1 },
  gold: { cap: 6 },
  atk: { n: 'Gilded Greataxe', d: [1, 10], flat: 3, kind: 'phys', ty: 'slashing', iv: 1.45 },
  abil: {
    n: 'Arcane Shield', cr: 7.5, pa: 8, cut: [6, 13], self: 1,
    one: 'Raises item-scaling Ward (fueling Action Surge counters); High adds arcane reflect, Nat 20 blasts Arcane Nova + Gold.',
    b: [
      'Raises a 22 Ward (+8 per equipped item).',
      'Raises a 34 Ward (+10 per equipped item) and Taunts adjacent foes.',
      'Raises a 46 Ward (+12 per item) and activates arcane damage reflect for 3s.',
      'Raises a 58 Ward, blasts an Arcane Nova (4d8 force AoE), and pops +2 Gold!'
    ],
    fx(b, u, P) {
      const nItems = (u.items || []).length;
      const wBase = [22, 34, 46, 58][P] + nItems * [8, 10, 12, 14][P] + Math.max(0, u.m.con) * 4;
      const wAmt = wBase * u.dm * chaK(u);
      addWard(b, u, wAmt, u.maxHp * .65, u);
      if (u.f.bodyguardFee && u.tier >= 4) {
        friends(b, u).filter(a => a !== u && hd(a, u) <= 1).forEach(a => addWard(b, a, wAmt * .30, a.maxHp * .4, u));
      }
      if (P >= 1) taunt(b, u, 2, 2.5);
      if (P >= 2) {
        u.arcaneReflectT = Math.max(u.arcaneReflectT || 0, 3 * chaK(u));
        status(b, u, 'ARCANE REFLECT', '#8fb4e6');
      }
      if (P === 3) {
        const near = foes(b, u).filter(x => hd(x, u) <= 2);
        b.events.push({ k: 'area', id: u.id, shape: 'nova', r: 2, ty: 'force', ids: near.map(x => x.id) });
        near.forEach(x => hit(b, u, x, roll(4, 8), { kind: 'magic', ty: 'force', area: 1, ab: 1 }));
        gainGold(b, u, 2, 'GILDED NOVA');
        callout(b, u, 'ARCANE NOVA!', '#ffd76a');
      } else {
        b.events.push({ k: 'area', id: u.id, shape: 'nova', r: 1, ty: 'force', ids: [u.id] });
      }
    }
  },
  paths: [
    {
      k: 'gilded_hoard', n: 'Gilded Hoard', attr: 'con', tags: ['ward', 'gold'],
      x: '+2 AC and +1 to ability d20 rolls for every item Gilthrax carries.',
      full: 'Each item equipped on Gilthrax grants +2 AC and +1 to his Arcane Shield d20 rolls.',
      t4x: 'Action Surge and Arcane Reflect damage all adjacent enemies.',
      f: { gildedHoard: 1 }
    },
    {
      k: 'bodyguard_fee', n: 'Bodyguard’s Fee', attr: 'str', tags: ['ward', 'side'],
      x: 'Reflecting damage feeds +8 Charge to adjacent allies and pops Gold.',
      full: 'Whenever Gilthrax reflects damage, adjacent allies gain +8 Charge (with a chance to pop +1 Gold).',
      t4x: 'Arcane Shield spills 35% of its Ward onto adjacent allies.',
      f: { bodyguardFee: 1 }
    }
  ],
  quest: {
    id: 'gilthrax_q', statKey: 'ward', goal: 400,
    label: 'Generate 400 total Ward',
    rewardName: 'Gems, Glorious Gems',
    rewardDesc: '+2 CON, +2 STR; begins every fight with a free Arcane Shield Ward.'
  }
});

hero('gains', {
  name: 'Gains', fullName: 'Gains',
  title: 'Tiefling Transmutation Wizard · Damage', cls: 'Wizard', sub: 'Transmutation', anc: 'Tiefling',
  role: 'Damage', reach: 'Ranged', rng: 4, ft: 30,
  bio: 'Measures every spell in profit margins; turns foes into walking gold reserves.',
  attr: { str: 8, dex: 12, con: 12, int: 16, wis: 12, cha: 12 },
  prim: 'int', pair: ['int', 'int'],
  hp: 88, ac: 13, sr: 14,
  kw: { arcane_recovery: 1 },
  ckw: [
    { k: 'arcane_recovery', sub: 'Transmutation', x: 'Triggers Arcane Recovery (+16 Charge) whenever Gold drops in combat or a Gilded foe dies.' }
  ],
  passive: { n: 'Transmuter’s Eye', x: 'Gilded foes are Staggered and drop +1 Gold when slain.' },
  f: { transmuter: 1 },
  gold: { cap: 6 },
  atk: { n: 'Alchemical Bolt', d: [1, 10], flat: 1, kind: 'magic', ty: 'force', iv: 1.4 },
  abil: {
    n: 'Gilded Beam', cr: 8.5, pa: 9, cut: [6, 13],
    one: 'Fires a beam applying Gilded (slow; drops Gold on death); High hits 2 foes, Nat 20 scales off held Gold and Gilds neighbours.',
    b: [
      'Blasts target for 2d8 force and applies Gilded (Staggered + drops +1g on death).',
      'Blasts target for 3d8 force and applies Gilded.',
      'Blasts 2 foes for 4d8 force and applies Gilded to both.',
      'Unleashes a massive Gilded Beam (+1d8 per 8 Gold held) that Gilds neighbours!'
    ],
    fx(b, u, P) {
      const fs = foes(b, u).filter(x => !x.hidden);
      if (!fs.length) return;
      const t = (u.target && u.target.alive) ? u.target : fs[0];
      const targets = P === 3
        ? fs.filter(x => x === t || hd(x, t) <= 1)
        : P === 2
          ? [t, ...fs.filter(x => x !== t).slice(0, 1)]
          : [t];
      const extraGoldDice = P === 3 ? Math.min(6, Math.floor((u.goldHeld || 0) / 8)) : 0;
      const nDice = [2, 3, 4, 4][P] + extraGoldDice;
      targets.forEach(x => {
        b.events.push({ k: 'beam', id: u.id, tid: x.id, ty: 'radiant' });
        b.events.push({ k: 'area', id: u.id, tid: x.id, shape: 'splash', r: .75, ty: 'radiant', ids: [x.id] });
        hit(b, u, x, roll(nDice, 8), { kind: 'magic', ty: 'force', ab: 1 });
        if (x.alive) {
          x.st.gilded = u;
          stagger(b, x, 3.5 * chaK(u));
          status(b, x, 'GILDED', '#ffd76a');
        }
      });
      if (P === 3) callout(b, u, 'HOSTILE TAKEOVER!', '#ffd76a');
    }
  },
  paths: [
    {
      k: 'compound_interest', n: 'Compound Interest', attr: 'int', tags: ['gold', 'd20'],
      x: '+1 to ability d20 rolls per 10 Gold held (up to +5).',
      full: 'Unspent Gold compounds Gains’ precision: +1 to Gilded Beam d20 rolls for every 10 Gold you hold.',
      t4x: 'Gilded foes take +25% magic damage from all sources.',
      f: { compoundInterest: 1 }
    },
    {
      k: 'liquid_assets', n: 'Liquid Assets', attr: 'cha', tags: ['gold', 'charge'],
      x: 'Gains’s Arcane Recovery shares 50% of its Charge with the whole party whenever Gold drops.',
      full: 'Every time Gold drops in combat, Gains triggers Arcane Recovery and shares half of that Charge with every ally.',
      t4x: 'Killing a Gilded foe refunds 30% Charge to the killer.',
      f: { liquidAssets: 1 }
    }
  ],
  quest: {
    id: 'gains_q', statKey: 'gildedKills', goal: 12,
    label: 'Slay 12 Gilded enemies',
    rewardName: 'Compound Interest',
    rewardDesc: '+2 INT; earn +10% end-of-fight Gold interest (up to +5g) after every win.'
  }
});

/* ==========================================================================
   PACK 6: SURPRISE ROUND (Velith, Corvin, Saint, Kaska)
   ========================================================================== */

hero('velith', {
  name: 'Velith', fullName: 'Velith',
  title: 'Drow Assassin Rogue · Damage', cls: 'Rogue', sub: 'Assassin', anc: 'Drow',
  role: 'Damage', reach: 'Melee', rng: 1, ft: 35,
  bio: 'Crosses names off a black-vellum ledger before the first lantern is lit.',
  attr: { str: 10, dex: 16, con: 12, int: 12, wis: 12, cha: 10 },
  prim: 'dex', pair: ['dex', 'dex'],
  hp: 94, ac: 15, sr: 12,
  kw: { sneak_attack: 1, cunning_action: 1 },
  ckw: [
    { k: 'sneak_attack', sub: 'Venomous Strike', x: 'Strikes from Stealth or vs. Poisoned/impaired foes trigger Sneak Attack (+1d6 + Poison).' },
    { k: 'cunning_action', sub: 'Shadow Fade', x: 'Starts combat in Stealth via Cunning Action and re-enters Stealth on High Cloak of Darkness.' }
  ],
  passive: { n: 'Assassinate', x: 'Starts every fight in Stealth; strikes from Stealth deal bonus Poison.' },
  f: { assassinate: 1 },
  atk: { n: 'Venom Dagger', d: [1, 6], flat: 2, kind: 'phys', ty: 'piercing', iv: 1.05 },
  abil: {
    n: 'Cloak of Darkness', cr: 7.5, pa: 10, cut: [6, 13], self: 1,
    one: 'Ambush Sneak Attack burst; High adds Poison + Cunning Action Stealth, Nat 20 executes wounded targets and chains.',
    b: [
      'Strikes target for a 3d6 Sneak Attack.',
      'Strikes target for a 4d6 Sneak Attack + 2 Poison.',
      'Strikes for a 6d6 Sneak Attack + 4 Poison and triggers Cunning Action (Stealth 3s).',
      'Strikes for 8d6 (executes < 25% HP) and immediately chains to a second foe!'
    ],
    fx(b, u, P) {
      const fs = foes(b, u).filter(x => !x.hidden);
      if (!fs.length) return;
      const t = (u.target && u.target.alive) ? u.target : fs.slice().sort((a, c) => hpPct(a) - hpPct(c))[0];
      const strikeOne = (target, mult) => {
        if (!target || !target.alive) return;
        const spot = walkNbrs(target).filter(h => freeHex(b, h, u)).sort((a, c) => hd(a, target) - hd(c, target))[0];
        if (spot && hd(u, target) > 1) { u.c = spot.c; u.r = spot.r; b.events.push({ k: 'leap', id: u.id }); }
        b.events.push({ k: 'area', id: u.id, tid: target.id, shape: 'splash', r: .75, ty: 'poison', ids: [target.id] });
        const dmg = roll([3, 4, 6, 8][P], 6) * (mult || 1);
        hit(b, u, target, dmg, { kind: 'phys', ty: 'piercing', melee: 1, ab: 1 });
        triggerSneakAttack(b, u, target, { ability: 1 });
        if (target.alive && P >= 1) applyStatus(b, u, target, 'poison', P >= 2 ? 4 : 2);
        const exCut = u.questDone ? 0.30 : 0.25;
        if (target.alive && P === 3 && hpPct(target) < exCut) {
          hit(b, u, target, target.hp + 20, { kind: 'phys', ty: 'piercing', noBonus: 1 });
          status(b, target, 'EXECUTED', '#ff6a6a');
        }
      };
      strikeOne(t, 1);
      if (P >= 2) {
        triggerCunningAction(b, u, t, { stealth: 3.0, stealthShield: 1, label: 'SHADOW FADE' });
      }
      if (P === 3) {
        const next = foes(b, u).filter(x => x !== t && !x.hidden).sort((a, c) => hpPct(a) - hpPct(c))[0];
        if (next) later(b, .14, () => { if (u.alive && next.alive) strikeOne(next, .85); });
        callout(b, u, 'CHAIN ASSASSINATE!', '#c48fe6');
      }
    }
  },
  paths: [
    {
      k: 'deaths_ledger', n: 'Death’s Ledger', attr: 'dex', tags: ['ambush', 'd20'],
      x: 'Opening Advantage and +2 to ability d20 rolls while in Stealth.',
      full: 'Begins combat with Advantage and gains +2 to Cloak of Darkness rolls when attacking from Stealth.',
      t4x: 'Attacks from Stealth always deal +50% critical damage.',
      f: { deathsLedger: 1 }
    },
    {
      k: 'nightshade', n: 'Nightshade Vials', attr: 'wis', tags: ['poison', 'ambush'],
      x: 'Poison Exposes targets; party deals +18% damage in the first 5s and any ally Sneak Attack splashes Poison.',
      full: 'Velith’s Poison applies Exposed (−2 AC/SR), the whole party deals +18% damage during the opening 5s, and any ally Sneak Attack splashes 2 Poison.',
      t4x: 'Killing a Poisoned foe spreads its Poison to an adjacent enemy.',
      f: { nightshade: 1 }
    }
  ],
  quest: {
    id: 'velith_q', statKey: 'kills', goal: 16,
    label: 'Score 16 kills',
    rewardName: 'Death’s Ledger',
    rewardDesc: 'Permanently gains +1 DEX for every 4 kills thereafter (uncapped) and raises Nat 20 execute threshold to 30%.'
  }
});

hero('corvin', {
  name: 'Corvin', fullName: 'Corvin',
  title: 'Human Gloom Stalker Ranger · Damage', cls: 'Ranger', sub: 'Gloom Stalker', anc: 'Human',
  role: 'Damage', reach: 'Melee', rng: 1, ft: 35,
  bio: 'Twin blades flash out of the dark before his shadow even catches up.',
  attr: { str: 12, dex: 16, con: 12, int: 10, wis: 14, cha: 10 },
  prim: 'dex', pair: ['dex', 'wis'],
  hp: 104, ac: 15, sr: 13,
  kw: { hunters_mark: 1 },
  ckw: [
    { k: 'hunters_mark', sub: 'Gloom Quarry', x: 'Applies Hunter’s Mark via Dread Ambush; Ranger strikes vs. Marked foes deal +1d6 + WIS bonus damage.' }
  ],
  passive: { n: 'Dread Ambusher', x: 'Starts every fight with +30 Charge and +25% opening Haste (4s).' },
  f: { dreadAmbusher: 1, huntMark: 1 },
  atk: { n: 'Twin Shortswords', d: [1, 6], flat: 1, hits: 2, kind: 'phys', ty: 'slashing', iv: 1.25 },
  abil: {
    n: 'Dread Ambush', cr: 7.5, pa: 9, cut: [6, 13],
    one: 'Rapid twin-blade spin + Hunter’s Mark; High fires 3 on-hit strikes + Umbral Sight (Stealth), Nat 20 spawns a shadow echo.',
    b: [
      'Unleashes 2 rapid strikes (triggering on-hit) and applies Hunter’s Mark.',
      'Unleashes 3 rapid strikes (triggering on-hit) and applies Hunter’s Mark.',
      'Unleashes 3 strikes, applies Hunter’s Mark, and enters Umbral Sight (Stealth 2s).',
      'Unleashes 4 strikes + Umbral Sight, then spawns a Shadow Echo repeating the entire spin!'
    ],
    fx(b, u, P) {
      const t = (u.target && u.target.alive) ? u.target : foes(b, u)[0];
      if (!t || !t.alive) return;
      const runSpin = (nHits, scale) => {
        b.events.push({ k: 'area', id: u.id, tid: t.id, shape: 'cone', r: 1.5, ty: 'psychic', ids: [t.id] });
        for (let i = 0; i < nHits; i++) {
          later(b, i * .09, () => {
            if (!u.alive) return;
            const x = t.alive ? t : foes(b, u).sort((a, c) => hd(a, u) - hd(c, u))[0];
            if (x && hd(x, u) <= 2) {
              strike(b, u, x, scale);
              u.stats.ambushStrikes = (u.stats.ambushStrikes || 0) + 1;
            }
          });
        }
      };
      markFoe(b, u, t);
      if (u.f.firstStrike && b.time <= 5) {
        friends(b, u).filter(a => !a.minion).forEach(a => giveCharge(b, a, 15));
      }
      runSpin([2, 3, 3, 4][P], .78);
      if (P >= 2) {
        u.hidden = 1; u.hideT = b.time + 2.2;
        if (u.f.stalkerFlurry && u.tier >= 4) { u.tempHaste = Math.max(u.tempHaste || 0, 25); u.tempHasteT = Math.max(u.tempHasteT || 0, 3); }
        status(b, u, 'UMBRAL SIGHT', '#c48fe6');
      }
      if (P === 3 || (P === 2 && u.questDone)) {
        later(b, .38, () => { if (u.alive) { callout(b, u, 'SHADOW ECHO!', '#c48fe6'); runSpin(3, .65); } });
      }
    }
  },
  paths: [
    {
      k: 'stalker_flurry', n: 'Stalker’s Flurry', attr: 'dex', tags: ['onhit', 'ambush'],
      x: 'Every 3rd basic strike spawns a bonus shadow slash (+1d6 piercing).',
      full: 'Every 3rd attack Corvin lands triggers a bonus shadow slash dealing +1d6 piercing damage.',
      t4x: 'Umbral Sight also grants +25% Attack Speed for 3s.',
      f: { stalkerFlurry: 1 }
    },
    {
      k: 'first_strike', n: 'First Strike', attr: 'wis', tags: ['marked', 'charge'],
      x: 'Casting in the first 5s grants all allies +15 Charge and applies Hunter’s Mark.',
      full: 'Whenever Corvin casts Dread Ambush within the opening 5s of battle, the whole party gains +15 Charge.',
      t4x: 'Allies attacking any Hunter’s Mark foe deal +1d4 bonus piercing damage.',
      f: { firstStrike: 1 }
    }
  ],
  quest: {
    id: 'corvin_q', statKey: 'ambushStrikes', goal: 35,
    label: 'Land 35 Dread Ambush strikes',
    rewardName: 'Twin Blades of the Gloom',
    rewardDesc: '+2 DEX; High rolls also spawn a Shadow Echo repeating the ambush spin.'
  }
});

hero('saint', {
  name: 'Saint', fullName: 'Saint',
  title: 'Half-Elf Trickery Cleric · Support', cls: 'Cleric', sub: 'Trickery Domain', anc: 'Half-Elf',
  role: 'Support', reach: 'Ranged', rng: 4, ft: 30,
  bio: 'Smiles from two places at once while a funeral bell tolls for anyone already bleeding.',
  attr: { str: 8, dex: 12, con: 12, int: 10, wis: 16, cha: 16 },
  prim: 'cha', pair: ['wis', 'cha'],
  hp: 108, ac: 14, sr: 15,
  kw: { channel_divinity: 1 },
  ckw: [
    { k: 'channel_divinity', sub: 'Invoke Duplicity', x: 'Summons an Illusory Double (absorbs a hit & echoes Toll the Dead); resets on High/Nat 20 or Cleric resets.' }
  ],
  passive: { n: 'Fey Trickster', x: 'Toll the Dead upgrades from d8 to d12 against wounded foes.' },
  f: { trickeryCleric: 1 },
  atk: { n: 'Bell of Passing', d: [1, 8], flat: 2, kind: 'magic', ty: 'necrotic', iv: 1.35 },
  abil: {
    n: 'Toll the Dead', cr: 8.5, pa: 9, cut: [6, 13],
    one: 'Necrotic bell (stronger vs wounded) + Channel Divinity Double; High adds Necrosis + Double echo, Nat 20 heals party & disrupts backline.',
    b: [
      'Rings Toll the Dead (2d8 necrotic, or 2d12 vs wounded foe) + 4 Necrosis and invokes Channel Divinity if ready.',
      'Rings Toll the Dead (3d8 / 3d12 vs wounded) + 10 Necrosis and invokes Channel Divinity if ready.',
      'Deals 3d12 + 16 Necrosis, refreshes Channel Divinity Double, and echoes Toll the Dead!',
      'Deals 4d12 + 22 Necrosis, confuses enemy backline, refreshes Double, and heals the entire party!'
    ],
    fx(b, u, P) {
      const fs = foes(b, u).filter(x => !x.hidden);
      if (!fs.length) return;
      const t = (u.target && u.target.alive) ? u.target : fs.slice().sort((a, c) => hpPct(a) - hpPct(c))[0];
      const ringBell = (target, diceCount, necAmt) => {
        if (!target || !target.alive) return;
        const wounded = target.hp < target.maxHp * .95;
        b.events.push({ k: 'beam', id: u.id, tid: target.id, ty: 'necrotic' });
        b.events.push({ k: 'area', id: u.id, tid: target.id, shape: 'splash', r: .85, ty: 'necrotic', ids: [target.id] });
        hit(b, u, target, roll(diceCount, wounded ? 12 : 8), { kind: 'magic', ty: 'necrotic', ab: 1 });
        if (target.alive && necAmt > 0) { addNec(b, u, target, necAmt * chaK(u)); u.stats.saintCasts = (u.stats.saintCasts || 0) + 1; }
      };
      const hadDouble = (u.illusoryDouble || 0) > 0;
      if (P >= 2) u._cdUsed = 0; // High/Nat 20 refreshes Invoke Duplicity!
      if (!u._cdUsed) triggerSaintCD(b, u);
      u.stats.saintCasts = (u.stats.saintCasts || 0) + 1;
      ringBell(t, [2, 3, 3, 4][P], [4, 10, 16, 22][P]);
      if (P >= 2 && hadDouble) {
        later(b, .2, () => {
          const t2 = t.alive ? t : foes(b, u)[0];
          if (u.alive && t2) { status(b, u, 'DOUBLE ECHO', '#c48fe6'); ringBell(t2, 2, 8); }
        });
      }
      if (P === 3) {
        const far = fs.slice().sort((a, c) => hd(c, u) - hd(a, u))[0];
        if (far) { stagger(b, far, 3.5); expose(b, far, 4); }
        friends(b, u).filter(a => !a.minion).forEach(a => heal(b, u, a, (24 + Math.max(0, u.m.cha) * 4) * u.dm, { raw: 1 }));
        callout(b, u, 'MIRROR TOLL!', '#c48fe6');
      }
    }
  },
  paths: [
    {
      k: 'two_faced', n: 'Two-Faced', attr: 'cha', tags: ['necrosis', 'charge'],
      x: 'When Saint’s Illusory Double breaks, it detonates for 12 Necrosis and +25 Charge.',
      full: 'Whenever an enemy destroys Saint’s Illusory Double, it bursts for 12 Necrosis to the attacker and grants Saint +25 Charge.',
      t4x: 'Saint can maintain up to 2 Illusory Doubles at once.',
      f: { twoFaced: 1 }
    },
    {
      k: 'smoke_mirrors', n: 'Smoke & Mirrors', attr: 'wis', tags: ['d20', 'heal'],
      x: 'Ally dodges heal + grant +2 d20; any ally Channel Divinity spawns Saint a free Illusory Double.',
      full: 'Every ally dodge heals that ally and adds +2 to their next d20 roll. Whenever any ally triggers Channel Divinity, Saint spawns a free Illusory Double.',
      t4x: 'Ally dodges also ring a free 2d8 Toll the Dead on the attacker.',
      f: { smokeMirrors: 1 }
    }
  ],
  quest: {
    id: 'saint_q', statKey: 'saintCasts', goal: 20,
    label: 'Toll the Dead & inflict Necrosis 20 times',
    rewardName: 'Mirror Image',
    rewardDesc: '+2 CHA; starts every fight with an active Illusory Double.'
  }
});

hero('kaska', {
  name: 'Kaska', fullName: 'Kaska',
  title: 'Half-Orc Moon Druid · Support', cls: 'Druid', sub: 'Circle of the Moon', anc: 'Half-Orc',
  role: 'Support', reach: 'Melee', rng: 1, ft: 35,
  bio: 'Leaps into the enemy line as a silver-eyed panther, then lashes out with thorn whips when cornered.',
  attr: { str: 16, dex: 12, con: 14, int: 10, wis: 16, cha: 10 },
  prim: 'wis', pair: ['str', 'wis'],
  hp: 124, ac: 15, sr: 14,
  kw: { wild_shape: 1 },
  ckw: [
    { k: 'wild_shape', sub: 'Panther Form', x: 'Starts in Wild Shape (Panther Form with separate Beast HP bar); High/Nat 20 Moonlit Pounce re-shifts with fresh Beast HP.' }
  ],
  passive: { n: 'Predator’s Leap', x: 'Pounces onto targets to apply Exposed; reverts to Thorn Whip when Panther HP breaks.' },
  f: { pantherForm: 1 },
  atk: { n: 'Panther Claws / Thorn Whip', d: [1, 8], flat: 2, kind: 'phys', ty: 'slashing', iv: 1.3 },
  abil: {
    n: 'Moonlit Pounce', cr: 8, pa: 9, cut: [6, 13], self: 1,
    one: 'Pounces and Exposes target; High heals & re-shifts into Wild Shape (Panther), Nat 20 Stuns + radiates party moonlight heal and Haste.',
    b: [
      'Pounces target for 2d8 slashing and applies Exposed (3s).',
      'Pounces target for 3d8 slashing, applies Exposed (4s), and heals Kaska.',
      'Pounces for 3d8 + Exposed, heals Kaska, and re-shifts into Wild Shape (fresh Panther Beast HP)!',
      'Stuns target (2s), Exposes nearby foes, re-shifts into Wild Shape, and bathes party in Moonlight (Heal + 25% Haste)!'
    ],
    fx(b, u, P) {
      const fs = foes(b, u).filter(x => !x.hidden);
      if (!fs.length) return;
      const t = (u.target && u.target.alive) ? u.target : fs.slice().sort((a, c) => hd(c, u) - hd(a, u))[0];
      const spot = walkNbrs(t).filter(h => freeHex(b, h, u)).sort((a, c) => hd(a, u) - hd(c, u))[0];
      if (spot && hd(u, t) > 1) { u.c = spot.c; u.r = spot.r; u.target = t; b.events.push({ k: 'leap', id: u.id }); }
      b.events.push({ k: 'area', id: u.id, tid: t.id, shape: P === 3 ? 'nova' : 'splash', r: P === 3 ? 2 : 1, ty: 'cold', ids: [t.id] });
      hit(b, u, t, roll(P === 0 ? 2 : 3, 8), { kind: 'phys', ty: 'slashing', melee: 1, ab: 1 });
      if (t.alive) expose(b, t, (P === 0 ? 3 : 4.5) * chaK(u));
      if (u.f.packHunt && u.tier >= 4) {
        foes(b, u).filter(x => x !== t && hd(x, t) <= 1).forEach(x => expose(b, x, 3.5 * chaK(u)));
      }
      u.stats.pounces = (u.stats.pounces || 0) + 1;
      if (P >= 1) heal(b, u, u, (18 + Math.max(0, u.m.wis) * 3) * u.dm, { raw: 1 });
      if (P >= 2) {
        const bhp = Math.round(u.maxHp * (u.f.lunarResilience ? .44 : .32) * (u.questDone ? 1.25 : 1));
        u.beast = { hp: bhp, max: bhp };
        if (u.f.lunarResilience && u.tier >= 4) { grantAlert(b, u, 1); addWard(b, u, 20 * u.dm, u.maxHp * .4, u); }
        triggerWildShape(b, u, { form: 'Panther Form', beastHp: bhp });
      }
      if (P === 3) {
        if (t.alive) stun(b, t, 2);
        friends(b, u).filter(a => !a.minion).forEach(a => {
          heal(b, u, a, (20 + Math.max(0, u.m.wis) * 3) * u.dm, { raw: 1 });
          a.tempHaste = Math.max(a.tempHaste || 0, 25);
          a.tempHasteT = Math.max(a.tempHasteT || 0, 4);
        });
        callout(b, u, 'MOONLIT HUNT!', '#8fd0ff');
      }
    }
  },
  paths: [
    {
      k: 'lunar_resilience', n: 'Lunar Resilience', attr: 'str', tags: ['control', 'ward'],
      x: 'Wild Shape (Panther) gains +40% Beast HP and cleaves adjacent enemies.',
      full: 'Panther Form starts with 40% more Beast HP and Kaska’s melee attacks cleave 50% damage to an adjacent foe.',
      t4x: 'Shifting into Wild Shape grants Alert and a Ward.',
      f: { lunarResilience: 1 }
    },
    {
      k: 'pack_hunt', n: 'Pack Hunt', attr: 'wis', tags: ['ambush', 'heal'],
      x: 'Allies hitting Exposed foes heal for 10 HP and gain +10 Charge.',
      full: 'Whenever any ally strikes an Exposed enemy, that ally heals 10 HP and gains +10 Charge (once per second).',
      t4x: 'Moonlit Pounce Exposes all foes adjacent to the target.',
      f: { packHunt: 1 }
    }
  ],
  quest: {
    id: 'kaska_q', statKey: 'pounces', goal: 16,
    label: 'Land 16 Moonlit Pounces',
    rewardName: 'Moon’s Favour',
    rewardDesc: '+2 STR, +2 WIS; Wild Shape gains +25% extra Beast HP and radiates moonlight healing.'
  }
});

/* Woodland board range compression for all 24 heroes */
Object.values(H).forEach(d => {
  if (d.rng) d.rng = RANGE15(d.rng);
  if (d.f && d.f.keenSight) d.rng += 1; // Lorcan's Keen Sight: extended range
});

/* One-sentence glance helper for cards & shop offers (now displays Hero Class Keyword Expressions!) */
const abil1 = k => (H[k] && H[k].abil && H[k].abil.one) || '';
function glanceHTML(k, pathKey, G) {
  const d = H[k]; if (!d) return '';
  const P = pathKey ? d.paths.find(p => p.k === pathKey) : null;
  const ckwHtml = (d.ckw || []).map(e => {
    const K = CLASS_KW[e.k];
    const head = K ? `${K.n}${e.sub ? ' — ' + e.sub : ''}` : (e.sub || e.k);
    return `<div class="gk"><span class="ckwtag" style="--kc:${K ? K.c : '#5a4a8a'}" data-tn="${esc(K ? `${K.n} (${K.cls} · ${K.kind})` : head)}" data-tip="${esc(K ? K.x : '')}">${esc(K ? K.n : head)}</span><b>${esc(e.sub || '')}</b> ${G(e.x)}</div>`;
  }).join('');
  return `<div class="glance">${ckwHtml}<div><b>${esc(d.abil.n)}</b> ${G(abil1(k))}</div>${d.passive ? `<div><b>${esc(d.passive.n)}</b> ${G(d.passive.x)}</div>` : ''}${P ? `<div class="gp"><b>${esc(P.n)}</b> ${G(P.x)}</div>` : ''}</div>`;
}
