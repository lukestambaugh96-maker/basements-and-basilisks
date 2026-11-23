/* ================= 0.23 CORE CONSTANTS, DICE, 3-ACT ENEMIES, 12 MAPS & ENCOUNTERS ================= */
const CLASS = {
  Cleric: { col: '#b8923a' }, Rogue: { col: '#5a4a6a' }, Fighter: { col: '#6e7684' },
  Wizard: { col: '#3a5a9a' }, Bard: { col: '#a83a5a' },
  Paladin: { col: '#c4a03a' }, Ranger: { col: '#3c7a44' }, Druid: { col: '#4a7a3a' },
  Sorcerer: { col: '#b84424' }, Barbarian: { col: '#9e2c22' }, Monk: { col: '#3a7a84' }, Warlock: { col: '#6a3a8a' }
};
const heroCol = d => (CLASS[d.cls] || { col: '#555' }).col;
const ROLE_COL = { Damage: '#8f1d14', Tank: '#3d5a78', Support: '#2d6a3a' };
const ATTRS = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
const ATTR_N = { str: 'Strength', dex: 'Dexterity', con: 'Constitution', int: 'Intelligence', wis: 'Wisdom', cha: 'Charisma' };
const ATTR_S = { str: 'STR', dex: 'DEX', con: 'CON', int: 'INT', wis: 'WIS', cha: 'CHA' };
const modOf = s => Math.floor((s - 10) / 2);
const BAND_N = ['Low', 'Mid', 'High', 'Natural 20'];

/* ---------- heroes registry ---------- */
const H = {};
function hero(key, o) { H[key] = { key, ...o }; }

/* ---------- dice ---------- */
const DICE = {
  d20:    { n: 'Plain d20',  x: 'No change.' },
  swift:  { n: 'Swift Die',  x: 'Charges 25% faster. A natural 20 counts as a plain High roll.' },
  heavy:  { n: 'Heavy Die',  x: 'Charges 30% slower. High and natural 20 rolls are 50% stronger.' },
  coin:   { n: 'Coin',       x: 'Every roll is Low or High, half each. Never Mid, never a fizzle, never a natural 20.' },
  glass:  { n: 'Glass Die',  x: 'High starts 4 lower, but every roll costs 8% of max HP.' },
  cursed: { n: 'Cursed Die', x: '1 to 3 all fizzle with no charge back. The roll after a fizzle is always a natural 20.' }
};

/* ---------- v0.24 Soft-Lane Objective Registry ---------- */
const LANE_OBJ = {
  breach: {
    k: 'breach', n: 'Main Breach', g: '⚔', col: '#d6a531',
    winTxt: 'Flank Rush (+35% spd, +20% Atk Spd 5s) as winners cross over',
    failTxt: 'Hold the center line'
  },
  ritual: {
    k: 'ritual', n: 'Dark Ritual', g: '☽', col: '#a85ad8', timer: 12,
    winTxt: 'Interrupt <12s: +2g & Stun all remaining foes 1s',
    failTxt: 'At 12s: All enemies gain +25% Max HP Ward!'
  },
  loot: {
    k: 'loot', n: 'Supply Cart', g: '💰', col: '#e0b43a', timer: 14,
    winTxt: 'Clear <14s: +3g (+1g/Act) & +1 Free Reroll!',
    failTxt: 'At 14s: Cart escapes (opportunity lost)'
  },
  choke: {
    k: 'choke', n: 'Duel Choke', g: '🛡', col: '#4a8ab8', maxHeroes: 1,
    winTxt: '1 Hero max · Win: Party gains +2 AC & +2 SR',
    failTxt: 'Left empty: Foes Ambush (+35% dmg & Haste 5s)!'
  },
  shrine: {
    k: 'shrine', n: 'Battle Shrine', g: '✦', col: '#4ab87a',
    winTxt: 'Win: All surviving allies gain Advantage & +25 Charge',
    failTxt: 'No penalty if cleared late'
  },
  boss: {
    k: 'boss', n: 'Boss Throne', g: '♛', col: '#c83a24',
    winTxt: 'Clear side lanes to Expose the Boss (6s) & flank!',
    failTxt: 'Defeat the Boss to win'
  }
};

/* ---------- 13 Redesigned Soft-Lane Battle Maps (2-Lane 10x10 & 3-Lane 11x10) ----------
   Physical terrain dividers split rows 2..6 into distinct lanes while keeping rear (r=0..1)
   and backline (r=8..9) crossover bridges open so lane winners Breach & Flank remaining lanes! */
const BATTLE_MAPS = {
  // Act 1: Phandalin & the Triboar Trail
  triboar_road: {
    n: 'Triboar Trail', theme: 'forest', laneCount: 2,
    lanes: [
      { id: 'left',  n: 'Left Road',  c0: 0, c1: 3, obj: 'choke' },
      { id: 'right', n: 'Right Road', c0: 6, c1: 9, obj: 'ritual' }
    ],
    grid: [
      'v........v',
      '..........',
      '....OO....',
      '.,..OO..,.',
      '....OO....',
      'v...OO...v',
      '....OO....',
      'PPPP..PPPP',
      'PPPP..PPPP',
      'PPPP..PPPP'
    ]
  },
  tresendar_cellar: {
    n: 'Tresendar Cellar', theme: 'dungeon', laneCount: 2,
    lanes: [
      { id: 'left',  n: 'West Vault', c0: 0, c1: 3, obj: 'breach' },
      { id: 'right', n: 'East Vault', c0: 6, c1: 9, obj: 'loot' }
    ],
    grid: [
      '..........',
      '....dd....',
      '....##....',
      'c...##...c',
      '....##....',
      '....##....',
      '....##....',
      'PPPPddPPPP',
      'PPPP..PPPP',
      'PPPP..PPPP'
    ]
  },
  cragmaw_cave: {
    n: 'Cragmaw Cave', theme: 'cave', laneCount: 3,
    lanes: [
      { id: 'left',   n: 'Left Tunnel',  c0: 0, c1: 2, obj: 'choke' },
      { id: 'center', n: 'Main Cavern',  c0: 4, c1: 6, obj: 'breach' },
      { id: 'right',  n: 'Stream Ledge', c0: 8, c1: 10, obj: 'loot' }
    ],
    grid: [
      '...........',
      '...........',
      '...O...~...',
      '.,.#...~...',
      '...#...~...',
      '...O...~...',
      '...O...~...',
      'PPP.PPP.PPP',
      'PPP.PPP.PPP',
      'PPP.PPP.PPP'
    ]
  },
  thundertree_ruins: {
    n: 'Thundertree Ruins', theme: 'forest', laneCount: 3,
    lanes: [
      { id: 'left',   n: 'West Ruin',   c0: 0, c1: 2, obj: 'ritual' },
      { id: 'center', n: 'Courtyard',   c0: 4, c1: 6, obj: 'breach' },
      { id: 'right',  n: 'East Grove',  c0: 8, c1: 10, obj: 'shrine' }
    ],
    grid: [
      'v.........v',
      '...........',
      '...O...O...',
      '...O...O...',
      '.,.O...O.,.',
      '...O...O...',
      '...O...O...',
      'PPP.PPP.PPP',
      'PPP.PPP.PPP',
      'PPP.PPP.PPP'
    ]
  },
  spider_temple: {
    n: 'Wave Echo Sanctum', theme: 'cave', laneCount: 3,
    lanes: [
      { id: 'left',   n: 'Web Alcove',   c0: 0, c1: 2, obj: 'ritual' },
      { id: 'center', n: 'Spider Altar', c0: 4, c1: 6, obj: 'boss' },
      { id: 'right',  n: 'Bone Chasm',   c0: 8, c1: 10, obj: 'shrine' }
    ],
    grid: [
      '...........',
      '....w.w....',
      '...O...O...',
      '.w.O...O.w.',
      '...O...O...',
      '...O...O...',
      '...O...O...',
      'PPP.PPP.PPP',
      'PPP.PPP.PPP',
      'PPP.PPP.PPP'
    ]
  },

  // Act 2: White Plume Mountain
  boiling_bubble: {
    n: 'Boiling Bubble Chamber', theme: 'cave', laneCount: 3,
    lanes: [
      { id: 'left',   n: 'Steam Vent',  c0: 0, c1: 2, obj: 'choke' },
      { id: 'center', n: 'Bubble Core', c0: 4, c1: 6, obj: 'breach' },
      { id: 'right',  n: 'Vault Pool',  c0: 8, c1: 10, obj: 'loot' }
    ],
    grid: [
      '...........',
      '...........',
      '...~...~...',
      '.^.~...~.^.',
      '...~...~...',
      '...~...~...',
      '...~...~...',
      'PPP.PPP.PPP',
      'PPP.PPP.PPP',
      'PPP.PPP.PPP'
    ]
  },
  frictionless_hall: {
    n: 'Frictionless Hall', theme: 'dungeon', laneCount: 2,
    lanes: [
      { id: 'left',  n: 'West Gallery', c0: 0, c1: 3, obj: 'ritual' },
      { id: 'right', n: 'East Gallery', c0: 6, c1: 9, obj: 'shrine' }
    ],
    grid: [
      '..........',
      '..........',
      '....__....',
      '....__....',
      '....__....',
      '....__....',
      '....__....',
      'PPPP..PPPP',
      'PPPP..PPPP',
      'PPPP..PPPP'
    ]
  },
  inverted_ziggurat: {
    n: 'Inverted Ziggurat', theme: 'dungeon', laneCount: 3,
    lanes: [
      { id: 'left',   n: 'West Tier',   c0: 0, c1: 2, obj: 'ritual' },
      { id: 'center', n: 'Apex Shaft',  c0: 4, c1: 6, obj: 'breach' },
      { id: 'right',  n: 'East Tier',   c0: 8, c1: 10, obj: 'shrine' }
    ],
    grid: [
      '...........',
      '...........',
      '...#...#...',
      '...#...#...',
      '...#...#...',
      '...O...O...',
      '...O...O...',
      'PPP.PPP.PPP',
      'PPP.PPP.PPP',
      'PPP.PPP.PPP'
    ]
  },
  shadow_crypt: {
    n: 'Shadow Crypt', theme: 'cave', laneCount: 2,
    lanes: [
      { id: 'left',  n: 'Sarcophagi',  c0: 0, c1: 3, obj: 'choke' },
      { id: 'right', n: 'Crypt Vault', c0: 6, c1: 9, obj: 'loot' }
    ],
    grid: [
      '..........',
      '..........',
      '....##....',
      'c...##...c',
      '....##....',
      '....##....',
      '....##....',
      'PPPP..PPPP',
      'PPPP..PPPP',
      'PPPP..PPPP'
    ]
  },

  // Act 3: The Hells
  avernus_wastes: {
    n: 'Avernus Wastes', theme: 'hells', laneCount: 3,
    lanes: [
      { id: 'left',   n: 'Ash Ridge',    c0: 0, c1: 2, obj: 'choke' },
      { id: 'center', n: 'Obsidian Rift',c0: 4, c1: 6, obj: 'breach' },
      { id: 'right',  n: 'Soul Wagon',   c0: 8, c1: 10, obj: 'loot' }
    ],
    grid: [
      '...........',
      '...........',
      '..._..._...',
      '.^._..._.^.',
      '..._..._...',
      '..._..._...',
      '..._..._...',
      'PPP.PPP.PPP',
      'PPP.PPP.PPP',
      'PPP.PPP.PPP'
    ]
  },
  iron_citadel: {
    n: 'Iron Citadel', theme: 'hells', laneCount: 2,
    lanes: [
      { id: 'left',  n: 'West Bastion', c0: 0, c1: 3, obj: 'ritual' },
      { id: 'right', n: 'East Bastion', c0: 6, c1: 9, obj: 'breach' }
    ],
    grid: [
      '..........',
      '....dd....',
      '....##....',
      '....aa....',
      '....##....',
      '....aa....',
      '....##....',
      'PPPP..PPPP',
      'PPPP..PPPP',
      'PPPP..PPPP'
    ]
  },
  styx_crossing: {
    n: 'River Styx Crossing', theme: 'hells', laneCount: 3,
    lanes: [
      { id: 'left',   n: 'West Bridge',   c0: 0, c1: 2, obj: 'shrine' },
      { id: 'center', n: 'Center Bridge', c0: 4, c1: 6, obj: 'breach' },
      { id: 'right',  n: 'East Bridge',   c0: 8, c1: 10, obj: 'ritual' }
    ],
    grid: [
      '...........',
      '...........',
      '...~...~...',
      '...~...~...',
      '...~...~...',
      '...~...~...',
      '...~...~...',
      'PPP.PPP.PPP',
      'PPP.PPP.PPP',
      'PPP.PPP.PPP'
    ]
  },
  throne_ninth: {
    n: 'Throne of the Ninth', theme: 'hells', laneCount: 3,
    lanes: [
      { id: 'left',   n: 'Hellfire Wing', c0: 0, c1: 2, obj: 'ritual' },
      { id: 'center', n: 'Ninth Throne',  c0: 4, c1: 6, obj: 'boss' },
      { id: 'right',  n: 'Relic Wing',    c0: 8, c1: 10, obj: 'shrine' }
    ],
    grid: [
      '...........',
      '...........',
      '...O...O...',
      '.^.O...O.^.',
      '...O...O...',
      '...O...O...',
      '...O...O...',
      'PPP.PPP.PPP',
      'PPP.PPP.PPP',
      'PPP.PPP.PPP'
    ]
  }
};

const WOODS = {
  A: BATTLE_MAPS.triboar_road.grid,
  B: BATTLE_MAPS.thundertree_ruins.grid,
  C: BATTLE_MAPS.cragmaw_cave.grid,
  S: BATTLE_MAPS.spider_temple.grid
};

/* ==========================================================================
   ENEMIES — Bounded Accuracy (AC/SR 8–20) Across All 3 Acts
   ========================================================================== */
const E = {
  /* ---------- ACT 1: PHANDALIN & THE TRIBOAR TRAIL ---------- */
  goblin: {
    name: 'Raider', arch: 'swarm', hp: 32, ac: 13, sr: 10, ft: 30, rng: 1,
    atk: { n: 'Scimitar', d: [1, 6], flat: 3, kind: 'phys', ty: 'slashing', iv: 1.0 },
    role: 'Swarm: quick blades in numbers'
  },
  archer: {
    name: 'Raider Archer', arch: 'archer', hp: 24, ac: 12, sr: 10, ft: 30, rng: 6,
    atk: { n: 'Shortbow', d: [1, 6], flat: 3, kind: 'phys', ty: 'piercing', iv: 1.2 },
    role: 'Archer: shoots from behind the front line'
  },
  ruffian: {
    name: 'Redbrand Ruffian', arch: 'swarm', hp: 42, ac: 14, sr: 10, pen: 2, ft: 30, rng: 1,
    atk: { n: 'Shortsword', d: [1, 6], flat: 3, kind: 'phys', ty: 'piercing', iv: 1.1, hits: 2 },
    role: 'Brawler: double-striking brigand (2 Armor Pen)'
  },
  shaman: {
    name: 'Hedge Shaman', arch: 'shaman', hp: 36, ac: 11, sr: 14, spen: 2, ft: 30, rng: 5, elite: 1,
    atk: { n: 'Hex Spark', d: [1, 6], flat: 2, kind: 'magic', el: 'fire', ty: 'fire', iv: 1.45 },
    role: 'Healer: mends allies with herbal fire',
    abil: {
      n: 'Mend', self: 1, cr: 10, cut: [8, 15],
      fx(b, u, P) {
        const fr = friends(b, u);
        if (P === 0) { const t = fr.slice().sort((a, c) => a.hp / a.maxHp - c.hp / c.maxHp)[0]; heal(b, u, t, roll(2, 6) + 4); return; }
        const ts = fr.filter(a => P === 3 || hd(a, u) <= 3);
        b.events.push({ k: 'area', id: u.id, shape: 'nova', r: 3, ty: 'poison', ids: ts.map(x => x.id) });
        ts.forEach(a => heal(b, u, a, roll(P === 3 ? 4 : P === 2 ? 3 : 2, 6) + 4));
      }
    }
  },
  wolf: {
    name: 'Wolf', arch: 'swarm', hp: 34, ac: 12, sr: 9, ft: 40, rng: 1,
    atk: { n: 'Bite', d: [2, 4], flat: 3, kind: 'phys', ty: 'piercing', iv: 1.0 },
    role: 'Pack hunter: fast melee rusher'
  },
  ripper: {
    name: 'Ripper (Dire Wolf)', arch: 'charger', hp: 72, ac: 13, sr: 10, pen: 2, ft: 40, rng: 1, elite: 1,
    atk: { n: 'Savage Bite', d: [2, 6], flat: 4, kind: 'phys', ty: 'piercing', iv: 1.0 },
    role: 'Charger: leaps at the back row and drags heroes down (2 Armor Pen)',
    abil: {
      n: 'Drag Down', cr: 10.5, cut: [8, 15],
      fx(b, u, P) {
        const t = u.target; if (!t || !t.alive || hd(t, u) > 1) return;
        hit(b, u, t, roll([2, 3, 4, 6][P], 6), { kind: 'phys', ty: 'piercing', melee: 1, ab: 1 });
        stun(b, t, [.8, 1.2, 1.8, 2.5][P]);
      }
    }
  },
  hobgoblin: {
    name: 'Shieldbearer', arch: 'wall', hp: 48, ac: 17, sr: 10, ft: 30, rng: 1,
    atk: { n: 'Longsword', d: [1, 8], flat: 4, kind: 'phys', ty: 'slashing', iv: 1.25 },
    role: 'Shield wall: heavy AC 17, weak to magic; adjacent allies get +2 AC'
  },
  captain: {
    name: 'Shield Captain', arch: 'wall', hp: 84, ac: 18, sr: 11, pen: 3, ft: 30, rng: 1, elite: 1,
    atk: { n: 'Greatsword', d: [2, 6], flat: 4, kind: 'phys', ty: 'slashing', iv: 1.15 },
    role: 'Captain: armors the ranks and cleaves armor (3 Armor Pen)',
    abil: {
      n: 'Form Ranks', self: 1, cr: 10, cut: [8, 15],
      fx(b, u, P) {
        const ts = friends(b, u).filter(a => hd(a, u) <= 2);
        b.events.push({ k: 'area', id: u.id, shape: 'nova', r: 2, ty: 'force', ids: ts.map(x => x.id) });
        ts.forEach(a => { acBuff(b, a, [2, 2, 3, 3][P], [4, 6, 8, 10][P]); if (P === 3) addWard(b, a, 20); });
      }
    }
  },
  zombie: {
    name: 'Zombie', arch: 'brute', hp: 62, ac: 10, sr: 8, ft: 20, rng: 1,
    atk: { n: 'Slam', d: [1, 8], flat: 4, kind: 'phys', ty: 'bludgeoning', iv: 1.4 },
    f: { undying: .5 },
    role: 'Meat shield: half the time gets back up unless Radiant or Necrosis kills it'
  },
  orc: {
    name: 'Reaver', arch: 'charger', hp: 38, ac: 12, sr: 9, pen: 2, ft: 40, rng: 1,
    atk: { n: 'Greataxe', d: [1, 12], flat: 3, kind: 'phys', ty: 'slashing', iv: 1.2 },
    role: 'Charger: leaps over the frontline at backliners (2 Armor Pen)'
  },
  ogre: {
    name: 'Ogre', arch: 'brute', hp: 125, ac: 11, sr: 9, pen: 4, ft: 25, rng: 1, elite: 1, large: 1,
    atk: { n: 'Greatclub', d: [2, 8], flat: 5, kind: 'phys', ty: 'bludgeoning', iv: 1.35 },
    f: { pushResist: .7 },
    role: '2×2 Brute: armor-crushing boulder swings (4 Armor Pen)',
    abil: {
      n: 'Swat', cr: 9.5, cut: [8, 15],
      fx(b, u, P) {
        const t = u.target; if (!t || !t.alive || hd(t, u) > 1) return;
        hit(b, u, t, roll([2, 3, 4, 6][P], 8), { kind: 'phys', ty: 'bludgeoning', melee: 1, ab: 1 });
        push(b, u, t, [1, 2, 2, 3][P], { aim: P >= 2, stun: P === 3 ? 1.5 : 0 });
      }
    }
  },
  chief: {
    name: 'Warlord', arch: 'charger', hp: 82, ac: 14, sr: 11, pen: 3, ft: 40, rng: 1, elite: 1,
    atk: { n: 'Greataxe', d: [1, 12], flat: 5, kind: 'phys', ty: 'slashing', iv: 1.05 },
    f: { hasteAura: [3, 25], pushResist: .4 },
    role: 'War chief: allies within 3 squares attack 25% faster (3 Armor Pen)',
    abil: {
      n: 'Axe-Biter', cr: 10, cut: [8, 15],
      fx(b, u, P) {
        const t = u.target; if (!t || !t.alive || hd(t, u) > 1) return;
        hit(b, u, t, roll([2, 3, 4, 6][P], 12), { kind: 'phys', ty: 'slashing', melee: 1, ab: 1 });
        if (P === 3) friends(b, u).forEach(a => giveCharge(b, a, 40));
      }
    }
  },
  klarg: {
    name: 'Klarg (Bugbear Chief)', arch: 'charger', hp: 145, ac: 15, sr: 11, pen: 4, ft: 35, rng: 1, elite: 1, boss: 1,
    atk: { n: 'Morningstar', d: [2, 8], flat: 6, kind: 'phys', ty: 'piercing', iv: 1.15 },
    f: { pushResist: .6 },
    role: 'Act 1 Miniboss: brutal ambusher crushing armor (4 Armor Pen) with heavy stuns',
    abil: {
      n: 'Brutal Smash', cr: 11, cut: [7, 14],
      fx(b, u, P) {
        const t = u.target; if (!t || !t.alive) return;
        b.events.push({ k: 'area', id: u.id, tid: t.id, shape: 'splash', r: 1, ty: 'bludgeoning', ids: [t.id] });
        hit(b, u, t, roll([3, 4, 5, 7][P], 8), { kind: 'phys', ty: 'bludgeoning', melee: 1, ab: 1 });
        if (P >= 2 && t.alive) stun(b, t, 1.2);
        if (P === 3) friends(b, u).forEach(a => { a.tempHaste = 30; a.tempHasteT = 4; });
      }
    }
  },
  blight: {
    name: 'Twig Blight', arch: 'swarm', hp: 14, ac: 12, sr: 8, ft: 35, rng: 1,
    atk: { n: 'Claws', d: [1, 4], flat: 2, kind: 'phys', ty: 'piercing', iv: .9 },
    role: 'Swarm: weak alone, dangerous in numbers'
  },
  ashzombie: {
    name: 'Ash Zombie', arch: 'afflicter', hp: 48, ac: 10, sr: 8, ft: 20, rng: 1,
    atk: { n: 'Slam', d: [1, 8], flat: 3, kind: 'phys', ty: 'bludgeoning', iv: 1.4 },
    f: { undying: .5, deathPuff: 3 },
    role: 'Meat shield: explodes in choking poison ash on death'
  },
  skeleton: {
    name: 'Skeleton Archer', arch: 'archer', hp: 28, ac: 11, sr: 16, ft: 30, rng: 5,
    atk: { n: 'Shortbow', d: [1, 6], flat: 3, kind: 'phys', ty: 'piercing', iv: 1.2 },
    role: 'Bowman: brittle bones (AC 11) but high SR 16'
  },
  glasstaff: {
    name: 'Glasstaff (Iarno Albrek)', arch: 'caster', hp: 145, ac: 13, sr: 17, spen: 3, ft: 30, rng: 6, boss: 1,
    atk: { n: 'Staff of Defense', d: [2, 6], flat: 3, kind: 'magic', ty: 'force', iv: 1.25, hits: 2 },
    f: { pushResist: .5 },
    role: 'Act 1 Boss: twin-bolt battle mage firing piercing Lightning Bolts & Hold Person (3 Spell Pen)',
    abil: {
      n: 'Lightning Bolt', cr: 11.5, cut: [7, 14],
      fx(b, u, P) {
        const t = u.target; if (!t || !t.alive) return;
        addWard(b, u, Math.round(u.maxHp * [0.08, 0.12, 0.18, 0.25][P]), u.maxHp * .45, u);
        if (P === 0) { hit(b, u, t, roll(2, 8), { kind: 'magic', ty: 'psychic', ab: 1 }); t.st.root = Math.max(t.st.root, 2.2); status(b, t, 'HELD', '#c8b8ff'); return; }
        const line = lineHexes(u, t, 7);
        const ts = foes(b, u).filter(x => x === t || line.some(h => h.c === x.c && h.r === x.r));
        b.events.push({ k: 'area', id: u.id, tid: t.id, shape: 'line', ty: 'lightning', ids: ts.map(x => x.id) });
        ts.forEach(x => { hit(b, u, x, roll([0, 4, 5, 7][P], 6), { kind: 'magic', ty: 'lightning', ab: 1 }); if (P >= 2 && x.alive) x.st.root = Math.max(x.st.root, 1.5); if (P === 3 && x.alive) stun(b, x, 1.5); });
      }
    }
  },
  flameskull: {
    name: 'Flameskull', arch: 'caster', hp: 68, ac: 13, sr: 17, spen: 3, ft: 30, rng: 6, elite: 1,
    atk: { n: 'Fire Ray', d: [2, 6], flat: 3, kind: 'magic', el: 'fire', ty: 'fire', iv: 1.2 },
    f: { fireproof: 1 },
    role: 'Artillery: punishes clumped heroes with Fireball; high SR 17 (3 Spell Pen)',
    abil: {
      n: 'Fireball', cr: 10.5, cut: [8, 15],
      fx(b, u, P) {
        const t = u.target; if (!t || !t.alive) return;
        const R = P === 3 ? 2 : 1;
        const ts = foes(b, u).filter(x => hd(x, t) <= R);
        b.events.push({ k: 'area', id: u.id, tid: t.id, shape: 'splash', r: R, ty: 'fire', ids: ts.map(x => x.id) });
        ts.forEach(x => hit(b, u, x, roll([2, 3, 5, 7][P], 6), { kind: 'magic', el: 'fire', ty: 'fire', area: 1, ab: 1 }));
      }
    }
  },
  owlbear: {
    name: 'Owlbear', arch: 'brute', hp: 185, ac: 15, sr: 11, pen: 4, ft: 40, rng: 1, elite: 1, large: 1,
    atk: { n: 'Beak and Claws', d: [1, 8], flat: 4, kind: 'phys', ty: 'slashing', iv: 1.3, hits: 2 },
    f: { pushResist: .7, enrage: 6 },
    role: '2×2 Juggernaut: enrages +15% damage every 6s (4 Armor Pen)',
    abil: {
      n: 'Rend', cr: 9.5, cut: [8, 15],
      fx(b, u, P) {
        const t = u.target; if (!t || !t.alive || hd(t, u) > 1) return;
        hit(b, u, t, roll([2, 3, 4, 6][P], 8), { kind: 'phys', ty: 'slashing', melee: 1, ab: 1 });
        if (P >= 1) stun(b, t, [0, .8, 1.2, 2][P]);
      }
    }
  },
  spider: {
    name: 'Giant Spider', arch: 'afflicter', hp: 42, ac: 13, sr: 11, ft: 35, rng: 1,
    atk: { n: 'Venom Bite', d: [1, 8], flat: 3, kind: 'phys', ty: 'piercing', iv: 1.15, onHit: [{ t: 'status', el: 'poison', v: 1.5 }] },
    f: { pushResist: .4, webwalk: 1 },
    role: 'Afflicter: poisons targets and ignores webs'
  },
  nezznar: {
    name: 'Nezznar (The Black Spider)', arch: ['summoner', 'afflicter'], hp: 165, ac: 14, sr: 16, spen: 3, ft: 30, rng: 6, boss: 1, large: 1,
    atk: { n: 'Spider Staff', d: [2, 8], flat: 4, kind: 'magic', ty: 'necrotic', iv: 1.15, nec: 5 },
    f: { pushResist: .6, webwalk: 1 },
    role: 'Act 1 Boss: rapid necrotic blasts, webs, and giant spider brood (3 Spell Pen)',
    abil: {
      n: 'Web of Shadows', cr: 11.5, cut: [8, 15],
      fx(b, u, P) {
        const t = u.target;
        if (P === 3) { status(b, u, 'CALL THE BROOD', '#c48fe6'); spawn(b, 'spider', u.c - 1, u.r + 1); spawn(b, 'spider', u.c + 1, u.r + 1); return; }
        if (!t || !t.alive) return;
        const ts = P >= 1 ? foes(b, u).filter(x => hd(x, t) <= 1) : [t];
        if (ts.length > 1) b.events.push({ k: 'area', id: u.id, tid: t.id, shape: 'splash', r: 1, ty: 'necrotic', ids: ts.map(x => x.id) });
        ts.forEach(x => { hit(b, u, x, roll([2, 2, 3][P], 8), { kind: 'magic', ty: 'necrotic', nec: [6, 8, 12][P], ab: 1 }); x.st.root = Math.max(x.st.root, [1.5, 1.5, 2][P]); });
      }
    }
  },
  venomfang: {
    name: 'Venomfang (Green Dragon)', arch: ['brute', 'afflicter'], hp: 215, ac: 17, sr: 14, pen: 4, ft: 35, rng: 2, boss: 1, large: 1,
    atk: { n: 'Bite & Rending Claws', d: [2, 6], flat: 4, kind: 'phys', ty: 'slashing', iv: 1.25, hits: 2, onHit: [{ t: 'status', el: 'poison', v: 1.5 }] },
    f: { pushResist: .8 },
    role: 'Act 1 Boss (2×2 Dragon): twin venomous claws (4 Armor Pen), Poison Breath cones & Wing Buffet',
    abil: {
      n: 'Poison Breath', cr: 11.5, cut: [7, 14],
      fx(b, u, P) {
        const fs = foes(b, u).filter(x => !x.hidden);
        if (!fs.length) return;
        const cone = fs.filter(x => hd(x, u) <= (P === 3 ? 4 : 3));
        const list = cone.length ? cone : fs.slice(0, 2);
        b.events.push({ k: 'area', id: u.id, tid: list[0].id, shape: 'cone', r: P === 3 ? 4 : 3, ty: 'poison', ids: list.map(x => x.id) });
        list.forEach(x => {
          hit(b, u, x, roll([2, 3, 4, 5][P], 8), { kind: 'magic', el: 'poison', ty: 'poison', area: 1, ab: 1 });
          if (x.alive) applyStatus(b, u, x, 'poison', [2, 3, 4, 5][P]);
          if (P >= 2 && x.alive && hd(x, u) <= 2) push(b, u, x, 2, {});
        });
      }
    }
  },
  adept: {
    name: 'Cult Adept', arch: 'caster', hp: 42, ac: 12, sr: 14, spen: 2, ft: 30, rng: 6, elite: 1,
    atk: { n: 'Fire Bolt', d: [1, 10], kind: 'magic', el: 'fire', ty: 'fire', iv: 1.45 },
    role: 'Caster: hurls Fireballs at clumped heroes (2 Spell Pen)',
    abil: {
      n: 'Fireball', self: 1, cr: 9.5, cut: [8, 15],
      fx(b, u, P) {
        const hs = foes(b, u).filter(x => !x.hidden && hd(x, u) <= 7); if (!hs.length) return;
        const R = P === 3 ? 2 : 1;
        const c = hs.slice().sort((a, z) => hs.filter(y => hd(y, z) <= R).length - hs.filter(y => hd(y, a) <= R).length)[0];
        const ts = foes(b, u).filter(x => hd(x, c) <= R);
        b.events.push({ k: 'area', id: u.id, tid: c.id, shape: 'splash', r: R, ty: 'fire', ids: ts.map(x => x.id) });
        ts.forEach(x => hit(b, u, x, roll([2, 3, 4, 6][P], 6), { kind: 'magic', el: 'fire', ty: 'fire', area: 1, ab: 1 }));
      }
    }
  },
  conjurer: {
    name: 'Conjurer', arch: 'summoner', hp: 46, ac: 12, sr: 14, spen: 2, ft: 30, rng: 5, elite: 1,
    atk: { n: 'Eldritch Bolt', d: [1, 8], flat: 2, kind: 'magic', ty: 'force', iv: 1.4 },
    f: { summon: { k: 'skeleton', n: 2, every: 8, first: 5, cap: 3, hp: .6 } },
    role: 'Summoner: raises two skeleton archers every 8s'
  },
  caller: {
    name: 'Blight Caller', arch: 'summoner', hp: 42, ac: 12, sr: 12, ft: 30, rng: 5, elite: 1,
    atk: { n: 'Thorn Lash', d: [1, 8], flat: 2, kind: 'phys', ty: 'piercing', iv: 1.35 },
    f: { summon: { k: 'blight', n: 2, every: 6, first: 3, cap: 6 } },
    role: 'Summoner: grows twig blights every 6s'
  },
  necromancer: {
    name: 'Necromancer', arch: 'afflicter', hp: 66, ac: 12, sr: 15, spen: 3, ft: 30, rng: 6, elite: 1,
    atk: { n: 'Ray of Enfeeblement', d: [2, 6], flat: 3, kind: 'magic', ty: 'necrotic', iv: 1.25, nec: 4 },
    role: 'Necromancer: inflicts Necrosis and raises fallen zombies (3 Spell Pen)',
    abil: {
      n: 'Enervation', cr: 10.5, cut: [8, 15],
      fx(b, u, P) {
        if (P === 3) {
          const dead = b.units.filter(x => !x.alive && x.key === 'zombie');
          dead.forEach(z => { z.alive = true; z.hp = Math.round(z.maxHp / 2); z.nec = 0; z.st = freshSt(); b.events.push({ k: 'spawn', id: z.id }); status(b, z, 'RAISED', '#9be38a'); });
          if (dead.length) return;
        }
        const t = u.target; if (!t || !t.alive) return;
        const ts = P >= 2 ? [t, ...friends(b, t).filter(a => a !== t && hd(a, t) <= 1)] : [t];
        if (ts.length > 1) b.events.push({ k: 'area', id: u.id, tid: t.id, shape: 'splash', r: 1, ty: 'necrotic', ids: ts.map(x => x.id) });
        ts.forEach(x => hit(b, u, x, 0, { kind: 'magic', ty: 'necrotic', nec: [10, 14, 16, 18][P], noBonus: 1, ab: 1 }));
      }
    }
  },

  /* ---------- ACT 2: WHITE PLUME MOUNTAIN ---------- */
  kelpie: {
    name: 'Kelpie', arch: 'caster', hp: 58, ac: 12, sr: 14, ft: 30, rng: 4,
    atk: { n: 'Drowning Lash', d: [1, 8], flat: 3, kind: 'magic', ty: 'cold', iv: 1.45 },
    role: 'Lurer: charms and Roots heroes with mire magic',
    abil: {
      n: 'Siren Undertow', cr: 7.5, cut: [8, 15],
      fx(b, u, P) {
        const t = u.target; if (!t || !t.alive) return;
        hit(b, u, t, roll([2, 2, 3, 4][P], 6), { kind: 'magic', ty: 'psychic', ab: 1 });
        if (t.alive) { t.st.root = Math.max(t.st.root, 2.2); if (P >= 2) charm(b, u, t, 1.5); }
      }
    }
  },
  gargoyle: {
    name: 'Gargoyle Sentinel', arch: 'wall', hp: 66, ac: 17, sr: 12, ft: 35, rng: 1,
    atk: { n: 'Stone Claws', d: [1, 8], flat: 4, kind: 'phys', ty: 'slashing', iv: 1.25 },
    f: { pushResist: .5 },
    role: 'Armored Stone Wall: high AC 17, weak to magic & Armor Pen'
  },
  flesh_golem: {
    name: 'Flesh Golem', arch: 'brute', hp: 118, ac: 12, sr: 14, ft: 25, rng: 1, elite: 1,
    atk: { n: 'Stitched Slam', d: [2, 8], flat: 4, kind: 'phys', ty: 'bludgeoning', iv: 1.5 },
    f: { pushResist: .7 },
    role: 'Construct Brute: massive HP and heavy cleaving slams',
    abil: {
      n: 'Berserk Smash', cr: 6.5, cut: [8, 15],
      fx(b, u, P) {
        const adj = foes(b, u).filter(x => hd(x, u) <= 1);
        const list = adj.length ? adj : [u.target].filter(Boolean);
        b.events.push({ k: 'area', id: u.id, shape: 'nova', r: 1, ty: 'bludgeoning', ids: list.map(x => x.id) });
        list.forEach(x => { hit(b, u, x, roll([2, 3, 4, 5][P], 8), { kind: 'phys', ty: 'bludgeoning', melee: 1, ab: 1 }); if (P === 3 && x.alive) stun(b, x, 1.5); });
      }
    }
  },
  manticore: {
    name: 'Manticore', arch: 'archer', hp: 62, ac: 14, sr: 12, ft: 40, rng: 5,
    atk: { n: 'Tail Spikes', d: [1, 8], flat: 3, kind: 'phys', ty: 'piercing', iv: 1.35, hits: 2 },
    role: 'Flying Skirmisher: fires twin piercing tail spikes from afar'
  },
  wight: {
    name: 'Wight', arch: 'afflicter', hp: 72, ac: 14, sr: 14, ft: 30, rng: 1,
    atk: { n: 'Life Drain Blade', d: [1, 8], flat: 4, kind: 'phys', ty: 'necrotic', iv: 1.25, nec: 3 },
    role: 'Undead Warrior: drains life with Necrosis blades'
  },
  ghoul: {
    name: 'Ghoul', arch: 'swarm', hp: 36, ac: 12, sr: 10, ft: 40, rng: 1,
    atk: { n: 'Paralyzing Claws', d: [1, 6], flat: 3, kind: 'phys', ty: 'slashing', iv: 1.0, onHit: [{ t: 'status', el: 'poison', v: 1 }] },
    role: 'Swarm: fast undead rushers with paralytic poison'
  },
  shadow_assassin: {
    name: 'Shadow Assassin', arch: 'charger', hp: 52, ac: 14, sr: 13, ft: 40, rng: 1,
    atk: { n: 'Shadow Blade', d: [2, 6], flat: 3, kind: 'phys', ty: 'piercing', iv: 1.05 },
    role: 'Backline Diver: leaps into the backline with rapid blades'
  },
  steam_mephit: {
    name: 'Steam Mephit', arch: 'caster', hp: 38, ac: 12, sr: 13, ft: 35, rng: 4,
    atk: { n: 'Scalding Puff', d: [1, 8], flat: 2, kind: 'magic', el: 'fire', ty: 'fire', iv: 1.4 },
    f: { fireproof: 1 },
    role: 'Skirmisher: blasts scalding fire & Burn'
  },
  ctenmiir: {
    name: 'Ctenmiir (Vampire)', arch: 'afflicter', hp: 130, ac: 16, sr: 16, pen: 3, ft: 35, rng: 1, elite: 1,
    atk: { n: 'Vampiric Bite', d: [2, 8], flat: 4, kind: 'phys', ty: 'necrotic', iv: 1.15, nec: 4 },
    f: { pushResist: .5 },
    role: 'Act 2 Elite: undead vampire draining HP and Necrosis (3 Armor Pen); Radiant stops his sustain',
    abil: {
      n: 'Blood Drain', cr: 10, cut: [7, 14],
      fx(b, u, P) {
        const t = u.target; if (!t || !t.alive) return;
        const dealt = hit(b, u, t, roll([3, 4, 5, 6][P], 8), { kind: 'magic', ty: 'necrotic', nec: [6, 8, 12, 16][P], ab: 1 });
        if (dealt > 0) heal(b, u, u, Math.round(dealt * .65), { raw: 1 });
      }
    }
  },
  efreeti: {
    name: 'Efreeti Guard', arch: 'caster', hp: 135, ac: 16, sr: 16, spen: 3, ft: 35, rng: 4, elite: 1,
    atk: { n: 'Hurl Flame', d: [2, 8], flat: 4, kind: 'magic', el: 'fire', ty: 'fire', iv: 1.25 },
    f: { fireproof: 1, pushResist: .6 },
    role: 'Act 2 Elite: fire genie blasting wide Flame Strikes & Burn (3 Spell Pen)',
    abil: {
      n: 'Flame Wave', cr: 10, cut: [7, 14],
      fx(b, u, P) {
        const t = u.target || foes(b, u)[0]; if (!t) return;
        const ts = foes(b, u).filter(x => hd(x, t) <= (P === 3 ? 2 : 1));
        b.events.push({ k: 'area', id: u.id, tid: t.id, shape: 'splash', r: P === 3 ? 2 : 1, ty: 'fire', ids: ts.map(x => x.id) });
        ts.forEach(x => { hit(b, u, x, roll([3, 4, 5, 7][P], 6), { kind: 'magic', el: 'fire', ty: 'fire', area: 1, ab: 1 }); if (x.alive) applyStatus(b, u, x, 'burn', 6); });
      }
    }
  },
  chain_golem: {
    name: 'Chain Golem', arch: 'wall', hp: 155, ac: 18, sr: 14, pen: 4, ft: 25, rng: 2, elite: 1, large: 1,
    atk: { n: 'Barbed Chains', d: [2, 8], flat: 4, kind: 'phys', ty: 'slashing', iv: 1.3 },
    f: { pushResist: .8 },
    role: 'Act 2 Elite (2×2): AC 18 iron construct that Roots and lashes heroes (4 Armor Pen)',
    abil: {
      n: 'Chain Snare', cr: 10, cut: [7, 14],
      fx(b, u, P) {
        const ts = foes(b, u).filter(x => hd(x, u) <= 3).slice(0, P === 3 ? 4 : 2);
        b.events.push({ k: 'area', id: u.id, shape: 'nova', r: 3, ty: 'slashing', ids: ts.map(x => x.id) });
        ts.forEach(x => { hit(b, u, x, roll([2, 3, 4, 5][P], 8), { kind: 'phys', ty: 'slashing', ab: 1 }); if (x.alive) x.st.root = Math.max(x.st.root, 2.5); });
      }
    }
  },
  ogre_mage: {
    name: 'Ogre Mage (Oni)', arch: 'caster', hp: 120, ac: 15, sr: 16, spen: 3, ft: 30, rng: 4, elite: 1,
    atk: { n: 'Glaive / Frost Bolt', d: [2, 6], flat: 4, kind: 'magic', el: 'cold', ty: 'cold', iv: 1.2 },
    f: { pushResist: .5 },
    role: 'Act 2 Elite: frost-casting oni with Cone of Cold & regeneration (3 Spell Pen)',
    abil: {
      n: 'Cone of Cold', cr: 10, cut: [7, 14],
      fx(b, u, P) {
        const ts = foes(b, u).filter(x => hd(x, u) <= 3);
        const list = ts.length ? ts : foes(b, u).slice(0, 2);
        b.events.push({ k: 'area', id: u.id, tid: list[0] && list[0].id, shape: 'cone', r: 3, ty: 'cold', ids: list.map(x => x.id) });
        list.forEach(x => { hit(b, u, x, roll([3, 4, 5, 6][P], 6), { kind: 'magic', el: 'cold', ty: 'cold', area: 1, ab: 1 }); if (x.alive) stagger(b, x, 2.5); });
        heal(b, u, u, Math.round(u.maxHp * .10), { raw: 1 });
      }
    }
  },
  keraptis: {
    name: 'Simulacrum of Keraptis', arch: ['caster', 'summoner'], hp: 175, ac: 14, sr: 16, spen: 4, ft: 30, rng: 5, boss: 1,
    atk: { n: 'Twin Arcane Bolts', d: [2, 6], flat: 4, kind: 'magic', ty: 'force', iv: 1.25, hits: 2 },
    f: { pushResist: .6, summon: { k: 'steam_mephit', n: 1, every: 10, first: 5, cap: 2, hp: .65 } },
    role: 'Act 2 Boss: mad archmage firing twin arcane bolts (4 Spell Pen), Wards & Elemental Novas',
    abil: {
      n: 'Funhouse Nova', cr: 12, cut: [7, 14],
      fx(b, u, P) {
        addWard(b, u, Math.round(u.maxHp * [0.08, 0.11, 0.15, 0.20][P]), u.maxHp * .4, u);
        const ts = foes(b, u).filter(x => !x.hidden);
        b.events.push({ k: 'area', id: u.id, shape: 'nova', r: 5, ty: P >= 2 ? 'lightning' : 'fire', ids: ts.map(x => x.id) });
        ts.forEach(x => hit(b, u, x, roll([2, 3, 4, 5][P], 6), { kind: 'magic', el: P >= 2 ? 'cold' : 'fire', ty: P >= 2 ? 'cold' : 'fire', area: 1, ab: 1 }));
        if (P === 3) spawn(b, 'gargoyle', u.c, Math.min(ROWS - 2, u.r + 1));
      }
    }
  },
  blackrazor_wielder: {
    name: 'Wielder of Blackrazor', arch: 'brute', hp: 185, ac: 15, sr: 14, pen: 4, ft: 35, rng: 1, boss: 1,
    atk: { n: 'Blackrazor', d: [2, 8], flat: 5, kind: 'phys', ty: 'slashing', iv: 1.05 },
    f: { pushResist: .7, blackrazorBoss: 1 },
    role: 'Act 2 Boss: rapid soul-drinker (4 Armor Pen) gaining Ward, Haste & Damage on ANY death!',
    abil: {
      n: 'Devour Soul', cr: 11.5, cut: [7, 14],
      fx(b, u, P) {
        const t = u.target; if (!t || !t.alive) return;
        const dealt = hit(b, u, t, roll([2, 3, 4, 6][P], 8), { kind: 'phys', ty: 'necrotic', nec: [4, 6, 9, 12][P], melee: 1, ab: 1 });
        if (dealt > 0) addWard(b, u, Math.round(dealt * .4), u.maxHp * .4, u);
        if (P === 3) { u.tempHaste = 25; u.tempHasteT = 4; }
      }
    }
  },
  gynosphinx: {
    name: 'Gynosphinx', arch: 'caster', hp: 205, ac: 15, sr: 16, pen: 4, spen: 3, ft: 35, rng: 2, boss: 1, large: 1,
    atk: { n: 'Twin Golden Claws', d: [2, 6], flat: 4, kind: 'phys', ty: 'slashing', iv: 1.2, hits: 2 },
    f: { pushResist: .8 },
    role: 'Act 2 Boss (2×2): twin claws (4 Armor Pen), Roar of Ages stuns/drains Charge & Temporal Shift',
    abil: {
      n: 'Roar of Ages', cr: 11.5, cut: [7, 14],
      fx(b, u, P) {
        const ts = foes(b, u).filter(x => !x.hidden);
        b.events.push({ k: 'area', id: u.id, shape: 'nova', r: 5, ty: 'thunder', ids: ts.map(x => x.id) });
        ts.forEach(x => {
          hit(b, u, x, roll([2, 3, 4, 5][P], 6), { kind: 'magic', ty: 'thunder', area: 1, ab: 1 });
          if (x.alive) { x.charge = Math.max(0, (x.charge || 0) - [8, 12, 18, 25][P]); if (P >= 2) stagger(b, x, 2.0); if (P === 3) stun(b, x, 1.2); }
        });
        if (P >= 2) { u.st.burn = 0; u.st.poison = 0; u.st.exp = 0; heal(b, u, u, Math.round(u.maxHp * .10), { raw: 1 }); status(b, u, 'TEMPORAL SHIFT', '#ffd76a'); }
      }
    }
  },
  giant_crab: {
    name: 'Giant Crab of the Bubble', arch: 'wall', hp: 215, ac: 17, sr: 12, pen: 4, ft: 25, rng: 1, boss: 1, large: 1,
    atk: { n: 'Twin Crushing Claws', d: [2, 6], flat: 4, kind: 'phys', ty: 'bludgeoning', iv: 1.3, hits: 2 },
    f: { pushResist: .9, fireproof: 1 },
    role: 'Act 2 Boss (2×2): AC 17 carapace, twin crushing claws (4 Armor Pen), Root & Boiling Splash',
    abil: {
      n: 'Boiling Splash', cr: 11.5, cut: [7, 14],
      fx(b, u, P) {
        const ts = foes(b, u).filter(x => hd(x, u) <= (P === 3 ? 4 : 2));
        const list = ts.length ? ts : foes(b, u).slice(0, 2);
        b.events.push({ k: 'area', id: u.id, shape: 'nova', r: P === 3 ? 4 : 2, ty: 'fire', ids: list.map(x => x.id) });
        list.forEach(x => {
          hit(b, u, x, roll([2, 3, 4, 6][P], 6), { kind: 'magic', el: 'fire', ty: 'fire', area: 1, ab: 1 });
          if (x.alive && hd(x, u) <= 2) x.st.root = Math.max(x.st.root, 2.0);
        });
      }
    }
  },

  /* ---------- ACT 3: THE HELLS ---------- */
  bearded_devil: {
    name: 'Bearded Devil', arch: 'wall', hp: 78, ac: 16, sr: 14, ft: 30, rng: 1,
    atk: { n: 'Infernal Glaive', d: [1, 10], flat: 4, kind: 'phys', ty: 'slashing', iv: 1.3 },
    f: { fireproof: 1 },
    role: 'Hell Phalanx: armored infernal frontline that resists fire'
  },
  hell_hound: {
    name: 'Hell Hound', arch: 'charger', hp: 62, ac: 14, sr: 13, ft: 40, rng: 1,
    atk: { n: 'Fiery Bite', d: [2, 6], flat: 3, kind: 'phys', el: 'fire', ty: 'fire', iv: 1.1 },
    f: { fireproof: 1 },
    role: 'Fiery Charger: leaps into the backline with burning jaws'
  },
  spined_devil: {
    name: 'Spined Devil', arch: 'archer', hp: 48, ac: 13, sr: 14, ft: 35, rng: 5,
    atk: { n: 'Tail Spine', d: [1, 8], flat: 3, kind: 'magic', el: 'fire', ty: 'fire', iv: 1.25 },
    f: { fireproof: 1 },
    role: 'Ranged Fiend: hurls burning tail spines from afar'
  },
  imp: {
    name: 'Imp', arch: 'swarm', hp: 38, ac: 13, sr: 14, ft: 40, rng: 1,
    atk: { n: 'Stinger', d: [1, 6], flat: 3, kind: 'phys', ty: 'piercing', iv: 1.0, onHit: [{ t: 'status', el: 'poison', v: 2 }] },
    f: { fireproof: 1 },
    role: 'Trickster Swarm: fast venom stingers'
  },
  cambion: {
    name: 'Cambion', arch: 'caster', hp: 78, ac: 15, sr: 16, ft: 30, rng: 5,
    atk: { n: 'Fire Ray', d: [2, 8], flat: 3, kind: 'magic', el: 'fire', ty: 'fire', iv: 1.4 },
    f: { fireproof: 1 },
    role: 'Fiend Caster: scorching fire rays and Fiendish Charm',
    abil: {
      n: 'Fiendish Charm', cr: 7.5, cut: [8, 15],
      fx(b, u, P) {
        const t = u.target; if (!t || !t.alive) return;
        hit(b, u, t, roll([2, 3, 4, 5][P], 6), { kind: 'magic', el: 'fire', ty: 'fire', ab: 1 });
        if (P >= 2 && t.alive) charm(b, u, t, 1.8);
      }
    }
  },
  bone_devil: {
    name: 'Bone Devil', arch: 'afflicter', hp: 98, ac: 16, sr: 16, ft: 35, rng: 2,
    atk: { n: 'Hooked Polearm', d: [2, 6], flat: 4, kind: 'phys', ty: 'piercing', iv: 1.25, onHit: [{ t: 'status', el: 'poison', v: 2 }] },
    f: { fireproof: 1, pushResist: .5 },
    role: 'Reach Enforcer: stinging poison polearm with AC 16 / SR 16'
  },
  narzugon: {
    name: 'Narzugon Rider', arch: 'charger', hp: 108, ac: 17, sr: 15, ft: 40, rng: 1,
    atk: { n: 'Hellfire Lance', d: [2, 8], flat: 4, kind: 'phys', el: 'fire', ty: 'fire', iv: 1.25 },
    f: { fireproof: 1, pushResist: .6 },
    role: 'Infernal Knight: heavy armored charger with flaming lance'
  },
  chain_devil: {
    name: 'Chain Devil', arch: 'afflicter', hp: 92, ac: 15, sr: 15, ft: 30, rng: 2,
    atk: { n: 'Animated Chains', d: [2, 6], flat: 4, kind: 'phys', ty: 'slashing', iv: 1.3 },
    f: { fireproof: 1 },
    role: 'Controller: binds heroes with barbed chains',
    abil: {
      n: 'Animate Chains', cr: 7.5, cut: [8, 15],
      fx(b, u, P) {
        const ts = foes(b, u).filter(x => hd(x, u) <= 3).slice(0, P === 3 ? 3 : 2);
        ts.forEach(x => { hit(b, u, x, roll([2, 3, 4, 5][P], 6), { kind: 'phys', ty: 'slashing', ab: 1 }); if (x.alive) x.st.root = Math.max(x.st.root, 2.2); });
      }
    }
  },
  erinyes: {
    name: 'Erinyes Executioner', arch: 'archer', hp: 128, ac: 17, sr: 16, pen: 4, ft: 40, rng: 5, elite: 1,
    atk: { n: 'Hellish Longbow', d: [2, 8], flat: 4, kind: 'phys', ty: 'piercing', iv: 1.15, onHit: [{ t: 'status', el: 'poison', v: 2 }] },
    f: { fireproof: 1 },
    role: 'Act 3 Elite: lethal armored archer raining venomous arrows (4 Armor Pen)',
    abil: {
      n: 'Execution Volley', cr: 10.5, cut: [7, 14],
      fx(b, u, P) {
        const ts = foes(b, u).filter(x => !x.hidden).sort((a, c) => hpPct(a) - hpPct(c)).slice(0, P === 3 ? 3 : 2);
        ts.forEach(x => {
          b.events.push({ k: 'proj', s: u.id, t: x.id, ty: 'poison' });
          hit(b, u, x, roll([3, 4, 5, 6][P], 8), { kind: 'phys', ty: 'piercing', ab: 1 });
          if (x.alive) applyStatus(b, u, x, 'poison', 3);
        });
      }
    }
  },
  horned_devil: {
    name: 'Horned Devil', arch: 'brute', hp: 165, ac: 17, sr: 16, pen: 4, ft: 35, rng: 2, elite: 1, large: 1,
    atk: { n: 'Infernal Fork', d: [2, 8], flat: 5, kind: 'phys', el: 'fire', ty: 'piercing', iv: 1.25 },
    f: { fireproof: 1, pushResist: .7 },
    role: 'Act 3 Elite (2×2): massive armored fiend hurling flames (4 Armor Pen)',
    abil: {
      n: 'Hurl Flame', cr: 10, cut: [7, 14],
      fx(b, u, P) {
        const t = u.target || foes(b, u)[0]; if (!t) return;
        const ts = foes(b, u).filter(x => hd(x, t) <= 1);
        b.events.push({ k: 'area', id: u.id, tid: t.id, shape: 'splash', r: 1, ty: 'fire', ids: ts.map(x => x.id) });
        ts.forEach(x => { hit(b, u, x, roll([3, 4, 5, 7][P], 6), { kind: 'magic', el: 'fire', ty: 'fire', area: 1, ab: 1 }); if (x.alive) applyStatus(b, u, x, 'burn', 6); });
      }
    }
  },
  ice_devil: {
    name: 'Ice Devil (Gelugon)', arch: 'caster', hp: 158, ac: 17, sr: 18, spen: 4, ft: 35, rng: 2, elite: 1, large: 1,
    atk: { n: 'Frost Spear', d: [2, 8], flat: 4, kind: 'magic', el: 'cold', ty: 'cold', iv: 1.25 },
    f: { pushResist: .7 },
    role: 'Act 3 Elite (2×2): SR 18 frost devil freezing & staggering the party (4 Spell Pen)',
    abil: {
      n: 'Wall of Ice', cr: 10, cut: [7, 14],
      fx(b, u, P) {
        const ts = foes(b, u).filter(x => hd(x, u) <= 3);
        const list = ts.length ? ts : foes(b, u).slice(0, 2);
        b.events.push({ k: 'area', id: u.id, shape: 'cone', r: 3, ty: 'cold', ids: list.map(x => x.id) });
        list.forEach(x => { hit(b, u, x, roll([3, 4, 5, 6][P], 6), { kind: 'magic', el: 'cold', ty: 'cold', area: 1, ab: 1 }); if (x.alive) stagger(b, x, 3); });
      }
    }
  },
  vrock: {
    name: 'Vrock Demon', arch: 'charger', hp: 112, ac: 15, sr: 15, pen: 3, ft: 40, rng: 1, elite: 1,
    atk: { n: 'Vulture Talons', d: [2, 6], flat: 4, kind: 'phys', ty: 'slashing', iv: 1.15, hits: 2 },
    role: 'Act 3 Elite: Blood War demon unleashing stunning shrieks & toxic spores (3 Armor Pen)',
    abil: {
      n: 'Stunning Screech', cr: 10, cut: [7, 14],
      fx(b, u, P) {
        const ts = foes(b, u).filter(x => hd(x, u) <= 2);
        b.events.push({ k: 'area', id: u.id, shape: 'nova', r: 2, ty: 'poison', ids: ts.map(x => x.id) });
        ts.forEach(x => { hit(b, u, x, roll([2, 3, 4, 5][P], 6), { kind: 'magic', ty: 'poison', ab: 1 }); if (P >= 2 && x.alive) stun(b, x, 1.2); });
      }
    }
  },
  pit_fiend: {
    name: 'Pit Fiend Enforcer', arch: ['brute', 'summoner'], hp: 205, ac: 16, sr: 16, pen: 4, ft: 35, rng: 2, elite: 1, boss: 1, large: 1,
    atk: { n: 'Infernal Mace & Tail', d: [2, 6], flat: 5, kind: 'phys', el: 'fire', ty: 'fire', iv: 1.3, hits: 2, onHit: [{ t: 'status', el: 'poison', v: 2 }] },
    f: { fireproof: 1, pushResist: .8, summon: { k: 'bearded_devil', n: 1, every: 12, first: 6, cap: 1, hp: .6 } },
    role: 'Act 3 Wandering Miniboss (2×2): twin fire/poison strikes (4 Armor Pen) summoning Bearded Devils',
    abil: {
      n: 'Meteor Fireball', cr: 11.5, cut: [7, 14],
      fx(b, u, P) {
        const t = u.target || foes(b, u)[0]; if (!t) return;
        const ts = foes(b, u).filter(x => hd(x, t) <= (P === 3 ? 2 : 1));
        b.events.push({ k: 'area', id: u.id, tid: t.id, shape: 'splash', r: P === 3 ? 2 : 1, ty: 'fire', ids: ts.map(x => x.id) });
        ts.forEach(x => { hit(b, u, x, roll([2, 3, 5, 7][P], 6), { kind: 'magic', el: 'fire', ty: 'fire', area: 1, ab: 1 }); if (x.alive) applyStatus(b, u, x, 'burn', 6); });
      }
    }
  },
  orcus: {
    name: 'Orcus (Prince of Undeath)', arch: ['summoner', 'afflicter'], hp: 225, ac: 16, sr: 16, spen: 5, ft: 30, rng: 2, boss: 1, large: 1,
    atk: { n: 'Wand of Orcus', d: [2, 6], flat: 4, kind: 'magic', ty: 'necrotic', iv: 1.3, hits: 2, nec: 4 },
    f: { pushResist: .9, summon: { k: 'wight', n: 1, every: 12, first: 6, cap: 1, hp: .6 } },
    role: 'Act 3 Boss (2×2): twin necrotic Wand strikes (5 Spell Pen), Necrosis waves & undead legions',
    abil: {
      n: 'Power Word Kill Wave', cr: 12, cut: [7, 14],
      fx(b, u, P) {
        const ts = foes(b, u).filter(x => !x.hidden);
        b.events.push({ k: 'area', id: u.id, shape: 'nova', r: 5, ty: 'necrotic', ids: ts.map(x => x.id) });
        ts.forEach(x => hit(b, u, x, roll([2, 2, 3, 4][P], 8), { kind: 'magic', ty: 'necrotic', nec: [4, 7, 10, 14][P], area: 1, ab: 1 }));
        if (P === 3) { spawn(b, 'ghoul', u.c - 1, u.r + 1); }
      }
    }
  },
  asmodeus: {
    name: 'Asmodeus (Lord of the Ninth)', arch: ['caster', 'summoner'], hp: 215, ac: 16, sr: 17, spen: 5, ft: 35, rng: 5, boss: 1,
    atk: { n: 'Twin Ruby Rods', d: [2, 6], flat: 4, kind: 'magic', el: 'fire', ty: 'fire', iv: 1.3, hits: 2 },
    f: { fireproof: 1, pushResist: .8, summon: { k: 'bearded_devil', n: 1, every: 12, first: 6, cap: 1, hp: .55 } },
    role: 'Act 3 Boss: twin hellfire beams (5 Spell Pen), Infernal Command stuns, and heavy Wards',
    abil: {
      n: 'Infernal Command', cr: 12, cut: [7, 14],
      fx(b, u, P) {
        addWard(b, u, Math.round(u.maxHp * [0.06, 0.08, 0.11, 0.15][P]), u.maxHp * .35, u);
        const ts = foes(b, u).filter(x => !x.hidden);
        const targets = P >= 2 ? ts : ts.slice(0, 2);
        b.events.push({ k: 'area', id: u.id, shape: 'line', r: 5, ty: 'fire', ids: targets.map(x => x.id) });
        targets.forEach(x => {
          hit(b, u, x, roll([2, 3, 4, 5][P], 6), { kind: 'magic', el: 'fire', ty: 'fire', area: 1, ab: 1 });
          if (P === 3 && x.alive) { stun(b, x, 1.0); expose(b, x, 4); }
        });
      }
    }
  },
  tiamat: {
    name: 'Tiamat (Queen of Dragons)', arch: ['brute', 'caster'], hp: 245, ac: 16, sr: 16, pen: 5, spen: 4, ft: 35, rng: 3, boss: 1, large: 1,
    atk: { n: 'Five-Headed Snap', d: [2, 8], flat: 4, kind: 'phys', ty: 'piercing', iv: 1.25, hits: 2 },
    f: { fireproof: 1, pushResist: .9 },
    role: 'Act 3 Boss (2×2): ferocious multi-head bites (5 Armor Pen) & Five Chromatic Breath Weapons',
    abil: {
      n: 'Chromatic Breath', cr: 12.5, cut: [7, 14],
      fx(b, u, P) {
        const heads = [
          { n: 'RED BREATH (FIRE)', el: 'fire', ty: 'fire' },
          { n: 'GREEN BREATH (POISON)', el: 'poison', ty: 'poison' },
          { n: 'BLUE BREATH (LIGHTNING)', el: null, ty: 'lightning' },
          { n: 'WHITE BREATH (COLD)', el: 'cold', ty: 'cold' },
          { n: 'BLACK BREATH (ACID)', el: 'acid', ty: 'acid' }
        ];
        const idx = (u._headIdx || 0) % 5;
        u._headIdx = idx + 1;
        const head = heads[idx];
        const ts = foes(b, u).filter(x => !x.hidden);
        const list = P === 3 ? ts : ts.slice(0, Math.min(ts.length, 3));
        status(b, u, head.n, '#ffd76a');
        b.events.push({ k: 'area', id: u.id, tid: list[0] && list[0].id, shape: 'cone', r: 4, ty: head.ty, ids: list.map(x => x.id) });
        list.forEach(x => {
          hit(b, u, x, roll([3, 4, 5, 6][P], 6), { kind: 'magic', el: head.el, ty: head.ty, area: 1, ab: 1 });
          if (head.el === 'fire' && x.alive) applyStatus(b, u, x, 'burn', 6);
          if (head.el === 'poison' && x.alive) applyStatus(b, u, x, 'poison', 3);
          if (head.el === 'cold' && x.alive) stagger(b, x, 2.5);
          if (head.ty === 'lightning' && P >= 2 && x.alive) stun(b, x, 1.0);
        });
      }
    }
  }
};

/* ==========================================================================
   ENCOUNTERS — Full 3-Act Soft-Lane Encounter Library
   2-Lane coords: Left c=0..3, Right c=6..9
   3-Lane coords: Left c=0..2, Center c=4..6, Right c=8..10
   ========================================================================== */
const ENC = {
  /* ---------- ACT 1: PHANDALIN & THE TRIBOAR TRAIL ---------- */
  ambush: {
    n: 'Goblin Ambush', place: 'Triboar Trail', theme: 'forest', mapKey: 'triboar_road',
    q: 'Baseline · 2 Lanes', note: 'Raiders hold the Left Choke while a Hedge Shaman & archers channel a Dark Ritual on the Right.',
    map: BATTLE_MAPS.triboar_road.grid, lanes: BATTLE_MAPS.triboar_road.lanes,
    u: [['goblin', 1, 4], ['goblin', 2, 4], ['archer', 1, 1], ['goblin', 7, 4], ['shaman', 8, 1], ['archer', 7, 1], ['goblin', 8, 4]]
  },
  wolves: {
    n: 'Wolf Pack', place: 'Neverwinter Woods', theme: 'forest', mapKey: 'triboar_road',
    q: 'Chargers · 2 Lanes', sc: { dmg: 1.12 }, note: 'Hungry wolves hold the Left road while Ripper the Dire Wolf leaps from the Right.',
    map: BATTLE_MAPS.triboar_road.grid, lanes: BATTLE_MAPS.triboar_road.lanes,
    u: [['wolf', 1, 4], ['wolf', 2, 4], ['wolf', 2, 2], ['ripper', 7, 2], ['wolf', 7, 4], ['wolf', 8, 4]]
  },
  redbrands: {
    n: 'Redbrand Ruffians', place: 'Tresendar Cellar', theme: 'dungeon', mapKey: 'tresendar_cellar',
    q: 'Brawlers · 2 Lanes', note: 'Ruffians guard the West Breach while an adept and crossbowman defend the East Supply Cart.',
    map: BATTLE_MAPS.tresendar_cellar.grid, lanes: BATTLE_MAPS.tresendar_cellar.lanes,
    u: [['ruffian', 1, 4], ['ruffian', 2, 4], ['ruffian', 7, 4], ['adept', 7, 1], ['archer', 8, 1]]
  },
  gate: {
    n: 'Hobgoblin Patrol', place: 'Triboar Road', theme: 'forest', mapKey: 'triboar_road',
    q: 'High AC · 2 Lanes', note: 'AC 17 Shieldbearers anchor the Left Choke while archers & a shaman channel on the Right.',
    map: BATTLE_MAPS.triboar_road.grid, lanes: BATTLE_MAPS.triboar_road.lanes,
    u: [['hobgoblin', 1, 4], ['hobgoblin', 2, 4], ['captain', 2, 2], ['shaman', 7, 1], ['archer', 8, 1], ['archer', 6, 1]]
  },
  reavers: {
    n: 'Cragmaw Reavers', place: 'Cragmaw Cave', theme: 'cave', mapKey: 'cragmaw_cave',
    q: 'Chargers · 3 Lanes', sc: { hp: .94, dmg: .94 }, note: 'Reavers charge down the tunnels while a shaman guards the center and raiders protect the Right Supply Cart.',
    map: BATTLE_MAPS.cragmaw_cave.grid, lanes: BATTLE_MAPS.cragmaw_cave.lanes,
    u: [['orc', 1, 4], ['orc', 5, 4], ['shaman', 5, 1], ['archer', 4, 1], ['orc', 9, 4], ['archer', 9, 1]]
  },
  blights: {
    n: 'Twig Blight Swarm', place: 'Thundertree Ruins', theme: 'forest', mapKey: 'thundertree_ruins',
    q: 'Swarm · 3 Lanes', sc: { hp: 1.08, dmg: 1.08 }, note: 'Blight Caller channels a West Ritual while swarms pour down Center and guard the East Shrine.',
    map: BATTLE_MAPS.thundertree_ruins.grid, lanes: BATTLE_MAPS.thundertree_ruins.lanes,
    u: [['caller', 1, 1], ['blight', 1, 4], ['ashzombie', 5, 3], ['blight', 4, 4], ['blight', 6, 4], ['spider', 9, 4], ['blight', 9, 2]],
    waves: [{ at: 9, u: [['blight', 1, 0], ['blight', 5, 0], ['blight', 9, 0]] }]
  },
  skeleton_watch: {
    n: 'Skeleton Watch', place: 'Tresendar Cellar', theme: 'dungeon', mapKey: 'tresendar_cellar',
    q: 'High SR · 2 Lanes', note: 'SR 16 Skeleton archers shoot behind undying zombies across both cellar vaults.',
    map: BATTLE_MAPS.tresendar_cellar.grid, lanes: BATTLE_MAPS.tresendar_cellar.lanes,
    u: [['zombie', 1, 4], ['ashzombie', 2, 4], ['skeleton', 1, 1], ['zombie', 7, 4], ['skeleton', 7, 1], ['skeleton', 8, 1]]
  },
  owlwell: {
    n: 'Old Owl Well', place: 'Ruined Watchtower', theme: 'forest', mapKey: 'thundertree_ruins',
    q: 'Elite · Necrosis · 3 Lanes', sc: { dmg: .90 }, note: 'Necromancer channels on the West Ruin while zombies anchor Center and a Conjurer guards the East Shrine.',
    map: BATTLE_MAPS.thundertree_ruins.grid, lanes: BATTLE_MAPS.thundertree_ruins.lanes,
    u: [['necromancer', 1, 1], ['zombie', 1, 4], ['zombie', 4, 4], ['zombie', 6, 4], ['conjurer', 9, 1], ['zombie', 9, 4]]
  },
  orcs: {
    n: 'Wyvern Tor War Band', place: 'Wyvern Tor', theme: 'cave', mapKey: 'cragmaw_cave',
    q: 'Elite · War Band · 3 Lanes', sc: { hp: .90, dmg: .90 }, note: 'Ogre & Warlord anchor Main Cavern while Orcs press Left Choke and Right Supply Ledge.',
    map: BATTLE_MAPS.cragmaw_cave.grid, lanes: BATTLE_MAPS.cragmaw_cave.lanes,
    u: [['orc', 1, 4], ['ogre', 4, 2], ['chief', 5, 0], ['orc', 6, 4], ['orc', 9, 4], ['orc', 9, 2]]
  },
  owlbear: {
    n: 'Cragmaw Owlbear', place: 'Cragmaw Keep', theme: 'forest', mapKey: 'thundertree_ruins',
    q: 'Elite · Attrition · 3 Lanes', note: 'Enraging 2×2 Owlbear dominates the Courtyard flanked by archers on the Ruins & Shrine.',
    map: BATTLE_MAPS.thundertree_ruins.grid, lanes: BATTLE_MAPS.thundertree_ruins.lanes,
    u: [['owlbear', 4, 2], ['archer', 1, 1], ['goblin', 1, 4], ['archer', 9, 1], ['goblin', 9, 4]]
  },
  forge: {
    n: 'Wave Echo Flameskull', place: 'Wave Echo Forge', theme: 'cave', mapKey: 'cragmaw_cave',
    q: 'Elite · High SR / Burn · 3 Lanes', sc: { hp: .92, dmg: .90 }, note: 'SR 17 Flameskull anchors Center behind ash zombies while Cult Adepts hold the flank tunnels.',
    map: BATTLE_MAPS.cragmaw_cave.grid, lanes: BATTLE_MAPS.cragmaw_cave.lanes,
    u: [['adept', 1, 1], ['ashzombie', 1, 4], ['flameskull', 5, 1], ['ashzombie', 5, 4], ['adept', 9, 1], ['zombie', 9, 4]]
  },
  klarg: {
    n: 'Klarg’s Hideout', place: 'Cragmaw Hideout', theme: 'cave', mapKey: 'cragmaw_cave',
    q: 'Miniboss · 3 Lanes', sc: { hp: .94, dmg: .90 }, note: 'Klarg anchors Center, Ripper stalks the Left Choke, and raiders guard Klarg’s Supply Cart on the Right!',
    map: BATTLE_MAPS.cragmaw_cave.grid, lanes: BATTLE_MAPS.cragmaw_cave.lanes,
    u: [['klarg', 5, 3], ['goblin', 4, 4], ['ripper', 1, 3], ['archer', 1, 1], ['goblin', 9, 4], ['archer', 9, 1]]
  },
  nezznar: {
    n: 'Nezznar, the Black Spider', place: 'Wave Echo Sanctum', theme: 'cave', mapKey: 'spider_temple',
    q: 'Act 1 Boss · 3 Lanes', sc: { hp: .98, dmg: .90 }, note: 'Boss: Nezznar holds the Center Altar; clear the Web Ritual & Bone Shrine to Expose him!',
    map: BATTLE_MAPS.spider_temple.grid, lanes: BATTLE_MAPS.spider_temple.lanes,
    u: [['nezznar', 5, 1], ['goblin', 5, 4], ['spider', 1, 3], ['spider', 9, 3], ['skeleton', 9, 1]]
  },
  venomfang: {
    n: 'Venomfang, Green Dragon', place: 'Thundertree Ruins', theme: 'forest', mapKey: 'thundertree_ruins',
    q: 'Act 1 Boss · 3 Lanes', sc: { hp: .94, dmg: .86 }, note: 'Boss (2×2 Dragon): Venomfang rules the Center Courtyard flanked by Cult Ritualists and Blights.',
    map: BATTLE_MAPS.thundertree_ruins.grid,
    lanes: [
      { id: 'left',   n: 'Cult Ritual',   c0: 0, c1: 2, obj: 'ritual' },
      { id: 'center', n: 'Dragon Throne', c0: 4, c1: 6, obj: 'boss' },
      { id: 'right',  n: 'East Shrine',   c0: 8, c1: 10, obj: 'shrine' }
    ],
    u: [['venomfang', 4, 2], ['adept', 1, 1], ['blight', 1, 4], ['adept', 9, 1], ['blight', 9, 4]]
  },
  glasstaff: {
    n: 'Glasstaff, Redbrand Mage', place: 'Tresendar Manor', theme: 'dungeon', mapKey: 'tresendar_cellar',
    q: 'Act 1 Boss · 2 Lanes', sc: { hp: 1.00, dmg: .93 }, note: 'Boss: Glasstaff channels Arcane Wards in the West Vault while Redbrands guard the East Vault.',
    map: BATTLE_MAPS.tresendar_cellar.grid,
    lanes: [
      { id: 'left',  n: 'Mage Sanctum', c0: 0, c1: 3, obj: 'boss' },
      { id: 'right', n: 'Redbrand Wing',c0: 6, c1: 9, obj: 'shrine' }
    ],
    u: [['glasstaff', 1, 1], ['hobgoblin', 1, 4], ['ruffian', 2, 4], ['hobgoblin', 7, 4], ['skeleton', 7, 1], ['skeleton', 8, 1]]
  },

  /* ---------- ACT 2: WHITE PLUME MOUNTAIN ---------- */
  kelpie_mire: {
    n: 'Kelpie & Mire Stalkers', place: 'Flooded Grotto', theme: 'cave', mapKey: 'boiling_bubble',
    q: 'Control · 3 Lanes', note: 'Gargoyles anchor the Steam Vent & Bubble Core while Kelpies charm across the water.',
    map: BATTLE_MAPS.boiling_bubble.grid, lanes: BATTLE_MAPS.boiling_bubble.lanes,
    u: [['gargoyle', 1, 4], ['kelpie', 5, 1], ['gargoyle', 5, 4], ['kelpie', 9, 1], ['steam_mephit', 9, 4]]
  },
  gargoyle_hall: {
    n: 'Gargoyle Sentinels', place: 'Inverted Ziggurat', theme: 'dungeon', mapKey: 'inverted_ziggurat',
    q: 'High AC · 3 Lanes', note: 'AC 17 Gargoyles hold every tier while Manticores pepper from the wings.',
    map: BATTLE_MAPS.inverted_ziggurat.grid, lanes: BATTLE_MAPS.inverted_ziggurat.lanes,
    u: [['gargoyle', 1, 4], ['manticore', 1, 1], ['gargoyle', 5, 4], ['gargoyle', 9, 4], ['manticore', 9, 1]]
  },
  flesh_lab: {
    n: 'Flesh Golem & Cultists', place: 'Shadow Crypt', theme: 'cave', mapKey: 'shadow_crypt',
    q: 'Brute + Casters · 2 Lanes', note: 'A hulking Flesh Golem plugs the Left Choke while Adepts & Mephits guard the Right Vault.',
    map: BATTLE_MAPS.shadow_crypt.grid, lanes: BATTLE_MAPS.shadow_crypt.lanes,
    u: [['flesh_golem', 1, 3], ['steam_mephit', 2, 1], ['adept', 7, 1], ['adept', 8, 1], ['steam_mephit', 7, 4]]
  },
  manticore_brood: {
    n: 'Manticore Brood', place: 'Frictionless Hall', theme: 'dungeon', mapKey: 'frictionless_hall',
    q: 'Ranged Volley · 2 Lanes', note: 'Manticores unleash twin tail spikes across the chasm behind stone gargoyles.',
    map: BATTLE_MAPS.frictionless_hall.grid, lanes: BATTLE_MAPS.frictionless_hall.lanes,
    u: [['gargoyle', 1, 4], ['manticore', 1, 1], ['manticore', 2, 1], ['gargoyle', 7, 4], ['manticore', 8, 1]]
  },
  wight_pack: {
    n: 'Wight & Ghoul Pack', place: 'Shadow Crypt', theme: 'cave', mapKey: 'shadow_crypt',
    q: 'Necrosis & Poison · 2 Lanes', note: 'Wights inflict Necrosis while fast Ghouls rush both crypt corridors.',
    map: BATTLE_MAPS.shadow_crypt.grid, lanes: BATTLE_MAPS.shadow_crypt.lanes,
    u: [['wight', 1, 3], ['ghoul', 1, 4], ['ghoul', 2, 4], ['wight', 7, 3], ['ghoul', 7, 4], ['ghoul', 8, 4]]
  },
  shadow_ambush: {
    n: 'Shadow Assassins', place: 'Frictionless Hall', theme: 'dungeon', mapKey: 'frictionless_hall',
    q: 'Backline Divers · 2 Lanes', note: 'Shadow Assassins leap past your frontline on both galleries.',
    map: BATTLE_MAPS.frictionless_hall.grid, lanes: BATTLE_MAPS.frictionless_hall.lanes,
    u: [['wight', 1, 4], ['shadow_assassin', 1, 2], ['shadow_assassin', 2, 2], ['wight', 7, 4], ['shadow_assassin', 8, 2]]
  },
  ctenmiir_crypt: {
    n: 'Ctenmiir the Vampire', place: 'Vampire Vault', theme: 'cave', mapKey: 'shadow_crypt',
    q: 'Elite · Lifesteal · 2 Lanes', note: 'Ctenmiir drains HP in the Left Choke while Wights & Ghouls guard the Right Crypt Vault.',
    map: BATTLE_MAPS.shadow_crypt.grid, lanes: BATTLE_MAPS.shadow_crypt.lanes,
    u: [['ctenmiir', 1, 3], ['ghoul', 2, 4], ['wight', 7, 3], ['wight', 8, 3], ['ghoul', 7, 4]]
  },
  efreeti_guard: {
    n: 'Efreeti Guard', place: 'Boiling Bubble', theme: 'cave', mapKey: 'boiling_bubble',
    q: 'Elite · Fire AoE · 3 Lanes', note: 'Efreeti blasts Flame Waves from Center while Mephits & Gargoyles hold the flank vents.',
    map: BATTLE_MAPS.boiling_bubble.grid, lanes: BATTLE_MAPS.boiling_bubble.lanes,
    u: [['gargoyle', 1, 4], ['steam_mephit', 1, 1], ['efreeti', 5, 2], ['gargoyle', 5, 4], ['steam_mephit', 9, 2]]
  },
  chain_vault: {
    n: 'Chain Golem & Mephits', place: 'Inverted Ziggurat', theme: 'dungeon', mapKey: 'inverted_ziggurat',
    q: 'Elite · AC 18 + Root · 3 Lanes', note: '2×2 Chain Golem anchors Center Apex flanked by burning Mephits & Gargoyles.',
    map: BATTLE_MAPS.inverted_ziggurat.grid, lanes: BATTLE_MAPS.inverted_ziggurat.lanes,
    u: [['chain_golem', 4, 2], ['steam_mephit', 1, 1], ['gargoyle', 1, 4], ['steam_mephit', 9, 1]]
  },
  oni_enforcers: {
    n: 'Ogre Mage Enforcers', place: 'Frictionless Hall', theme: 'dungeon', mapKey: 'frictionless_hall',
    q: 'Elite · Frost & Regen · 2 Lanes', note: 'Twin Frost-casting Ogre Mages supported by Shadow Assassins on each gallery.',
    map: BATTLE_MAPS.frictionless_hall.grid, lanes: BATTLE_MAPS.frictionless_hall.lanes,
    u: [['ogre_mage', 1, 1], ['shadow_assassin', 2, 3], ['ogre_mage', 8, 1], ['shadow_assassin', 7, 3]]
  },
  keraptis: {
    n: 'Simulacrum of Keraptis', place: 'Inverted Ziggurat', theme: 'dungeon', mapKey: 'inverted_ziggurat',
    q: 'Act 2 Boss · 3 Lanes', sc: { hp: 1.12, dmg: 1.02 }, note: 'Boss: Archmage holds the Apex Throne; clear West Ritual & East Shrine to Expose him!',
    map: BATTLE_MAPS.inverted_ziggurat.grid,
    lanes: [
      { id: 'left',   n: 'Arcane Ritual', c0: 0, c1: 2, obj: 'ritual' },
      { id: 'center', n: 'Keraptis Apex', c0: 4, c1: 6, obj: 'boss' },
      { id: 'right',  n: 'East Shrine',   c0: 8, c1: 10, obj: 'shrine' }
    ],
    u: [['keraptis', 5, 1], ['gargoyle', 1, 4], ['steam_mephit', 1, 1], ['gargoyle', 9, 4], ['steam_mephit', 9, 1]]
  },
  blackrazor_boss: {
    n: 'Wielder of Blackrazor', place: 'Shadow Crypt', theme: 'cave', mapKey: 'shadow_crypt',
    q: 'Act 2 Boss · 2 Lanes', sc: { hp: .98, dmg: .88 }, note: 'Boss: Gains Ward & Haste whenever ANY unit dies — hold or race his Crypt lanes wisely!',
    map: BATTLE_MAPS.shadow_crypt.grid,
    lanes: [
      { id: 'left',  n: 'Soul Throne', c0: 0, c1: 3, obj: 'boss' },
      { id: 'right', n: 'Crypt Shrine',c0: 6, c1: 9, obj: 'shrine' }
    ],
    u: [['blackrazor_wielder', 1, 3], ['ghoul', 2, 4], ['wight', 7, 3], ['ghoul', 7, 4], ['shadow_assassin', 8, 1]]
  },
  gynosphinx: {
    n: 'Gynosphinx', place: 'Inverted Ziggurat', theme: 'dungeon', mapKey: 'inverted_ziggurat',
    q: 'Act 2 Boss · 3 Lanes', sc: { hp: 1.08, dmg: .94 }, note: 'Boss (2×2): Roar of Ages drains Charge from Center while sentinels guard the side tiers.',
    map: BATTLE_MAPS.inverted_ziggurat.grid,
    lanes: [
      { id: 'left',   n: 'Riddle Ritual', c0: 0, c1: 2, obj: 'ritual' },
      { id: 'center', n: 'Sphinx Dais',   c0: 4, c1: 6, obj: 'boss' },
      { id: 'right',  n: 'East Shrine',   c0: 8, c1: 10, obj: 'shrine' }
    ],
    u: [['gynosphinx', 4, 2], ['gargoyle', 1, 4], ['gargoyle', 9, 4], ['manticore', 9, 1]]
  },
  giant_crab: {
    n: 'Giant Crab of the Bubble', place: 'Boiling Bubble Chamber', theme: 'cave', mapKey: 'boiling_bubble',
    q: 'Act 2 Boss · 3 Lanes', sc: { hp: 1.10, dmg: .98 }, note: 'Boss (2×2): Armored Titan rules the Center Core while Kelpies & Mephits flank the bubble.',
    map: BATTLE_MAPS.boiling_bubble.grid,
    lanes: [
      { id: 'left',   n: 'Steam Choke',  c0: 0, c1: 2, obj: 'choke' },
      { id: 'center', n: 'Titan Core',   c0: 4, c1: 6, obj: 'boss' },
      { id: 'right',  n: 'Vault Pool',   c0: 8, c1: 10, obj: 'loot' }
    ],
    u: [['giant_crab', 4, 2], ['gargoyle', 1, 4], ['steam_mephit', 1, 1], ['gargoyle', 9, 4], ['kelpie', 9, 1]]
  },

  /* ---------- ACT 3: THE HELLS ---------- */
  bearded_phalanx: {
    n: 'Bearded Devil Phalanx', place: 'Iron Citadel', theme: 'hells', mapKey: 'iron_citadel',
    q: 'Armored Line · 2 Lanes', note: 'Disciplined Bearded Devils hold both iron bastions backed by Spined Devils.',
    map: BATTLE_MAPS.iron_citadel.grid, lanes: BATTLE_MAPS.iron_citadel.lanes,
    u: [['bearded_devil', 1, 4], ['bearded_devil', 2, 4], ['spined_devil', 1, 1], ['bearded_devil', 7, 4], ['spined_devil', 8, 1]]
  },
  hell_hounds: {
    n: 'Hell Hound Pack', place: 'Avernus Wastes', theme: 'hells', mapKey: 'avernus_wastes',
    q: 'Fiery Chargers · 3 Lanes', note: 'Blazing Hell Hounds charge all 3 obsidian lanes led by a Cambion in the Center.',
    map: BATTLE_MAPS.avernus_wastes.grid, lanes: BATTLE_MAPS.avernus_wastes.lanes,
    u: [['hell_hound', 1, 4], ['hell_hound', 4, 4], ['hell_hound', 6, 4], ['cambion', 5, 1], ['hell_hound', 9, 4]]
  },
  spined_volley: {
    n: 'Spined Devil Volley', place: 'River Styx Crossing', theme: 'hells', mapKey: 'styx_crossing',
    q: 'Ranged Volley · 3 Lanes', note: 'Spined Devils shoot across all three Styx bridges while Bearded Devils anchor the span.',
    map: BATTLE_MAPS.styx_crossing.grid, lanes: BATTLE_MAPS.styx_crossing.lanes,
    u: [['spined_devil', 1, 1], ['bearded_devil', 5, 4], ['spined_devil', 5, 1], ['bearded_devil', 9, 4], ['spined_devil', 9, 1]]
  },
  cambion_coven: {
    n: 'Imp & Cambion Coven', place: 'Avernus Wastes', theme: 'hells', mapKey: 'avernus_wastes',
    q: 'Charm & Venom · 3 Lanes', note: 'Cambions unleash hellfire behind stinging Imps across the ridge & Soul Wagon.',
    map: BATTLE_MAPS.avernus_wastes.grid, lanes: BATTLE_MAPS.avernus_wastes.lanes,
    u: [['cambion', 1, 1], ['imp', 1, 4], ['imp', 4, 4], ['imp', 6, 4], ['cambion', 9, 1], ['imp', 9, 4]]
  },
  bone_guard: {
    n: 'Bone Devil Guard', place: 'Iron Citadel', theme: 'hells', mapKey: 'iron_citadel',
    q: 'Reach & Poison · 2 Lanes', note: 'Bone Devils strike with venomous polearms while Chain Devils hold the East Bastion.',
    map: BATTLE_MAPS.iron_citadel.grid, lanes: BATTLE_MAPS.iron_citadel.lanes,
    u: [['bone_devil', 1, 3], ['spined_devil', 2, 1], ['bone_devil', 7, 3], ['chain_devil', 8, 4]]
  },
  narzugon_riders: {
    n: 'Narzugon Riders', place: 'Avernus Wastes', theme: 'hells', mapKey: 'avernus_wastes',
    q: 'Heavy Chargers · 3 Lanes', note: 'Armored Narzugon hell-knights charge Left & Right while hounds guard Center.',
    map: BATTLE_MAPS.avernus_wastes.grid, lanes: BATTLE_MAPS.avernus_wastes.lanes,
    u: [['narzugon', 1, 3], ['hell_hound', 5, 4], ['spined_devil', 5, 1], ['narzugon', 9, 3]]
  },
  erinyes_exec: {
    n: 'Erinyes Executioners', place: 'Iron Citadel', theme: 'hells', mapKey: 'iron_citadel',
    q: 'Elite · Lethal Archers · 2 Lanes', note: 'Winged Erinyes snipe from behind Bearded Devil shieldlines across both bastions.',
    map: BATTLE_MAPS.iron_citadel.grid, lanes: BATTLE_MAPS.iron_citadel.lanes,
    u: [['erinyes', 1, 1], ['bearded_devil', 1, 4], ['erinyes', 8, 1], ['bearded_devil', 7, 4]]
  },
  horned_legion: {
    n: 'Horned Devil & Chains', place: 'Avernus Wastes', theme: 'hells', mapKey: 'avernus_wastes',
    q: 'Elite · 2×2 Fiend · 3 Lanes', note: '2×2 Horned Devil dominates the Obsidian Rift while Chain Devils pin the flanks.',
    map: BATTLE_MAPS.avernus_wastes.grid, lanes: BATTLE_MAPS.avernus_wastes.lanes,
    u: [['horned_devil', 4, 2], ['chain_devil', 1, 4], ['chain_devil', 9, 4], ['spined_devil', 9, 1]]
  },
  ice_wardens: {
    n: 'Ice Devil & Wardens', place: 'River Styx Crossing', theme: 'hells', mapKey: 'styx_crossing',
    q: 'Elite · SR 18 Freeze · 3 Lanes', note: 'Gelugon Ice Devil freezes Center Bridge backed by Bone Devils on the flanks.',
    map: BATTLE_MAPS.styx_crossing.grid, lanes: BATTLE_MAPS.styx_crossing.lanes,
    u: [['ice_devil', 5, 2], ['imp', 5, 4], ['bone_devil', 1, 3], ['bone_devil', 9, 3]]
  },
  blood_war: {
    n: 'Blood War Incursion', place: 'Avernus Wastes', theme: 'hells', mapKey: 'avernus_wastes',
    q: 'Elite · Demon Rush · 3 Lanes', note: 'Twin Vrock demons dive the flanks while a Cambion commands the Rift.',
    map: BATTLE_MAPS.avernus_wastes.grid, lanes: BATTLE_MAPS.avernus_wastes.lanes,
    u: [['vrock', 1, 3], ['hell_hound', 1, 4], ['cambion', 5, 1], ['vrock', 9, 3], ['hell_hound', 9, 4]]
  },
  pit_fiend: {
    n: 'Pit Fiend Enforcer', place: 'Avernus Wastes', theme: 'hells', mapKey: 'avernus_wastes',
    q: 'Act 3 Wandering Miniboss · 3 Lanes', sc: { hp: .96, dmg: .84 }, note: 'Wandering Miniboss (2×2): Infernal lord holds the Center Rift; win the Soul Wagon for huge loot!',
    map: BATTLE_MAPS.avernus_wastes.grid, lanes: BATTLE_MAPS.avernus_wastes.lanes,
    u: [['pit_fiend', 4, 2], ['bearded_devil', 1, 4], ['bearded_devil', 9, 4], ['spined_devil', 9, 1]]
  },
  orcus: {
    n: 'Orcus, Prince of Undeath', place: 'Throne of the Ninth', theme: 'hells', mapKey: 'throne_ninth',
    q: 'Act 3 Final Boss · 3 Lanes', sc: { hp: 1.02, dmg: .90 }, note: 'Final Boss (2×2): Orcus channels Necrosis from the Ninth Throne; clear the wings to Expose him!',
    map: BATTLE_MAPS.throne_ninth.grid, lanes: BATTLE_MAPS.throne_ninth.lanes,
    u: [['orcus', 4, 2], ['wight', 1, 4], ['bone_devil', 5, 4], ['wight', 9, 4]]
  },
  asmodeus: {
    n: 'Asmodeus, Lord of the Ninth', place: 'Throne of the Ninth', theme: 'hells', mapKey: 'throne_ninth',
    q: 'Act 3 Final Boss · 3 Lanes', sc: { hp: .98, dmg: .86 }, note: 'Final Boss: Asmodeus commands Hellfire from the Ninth Throne flanked by Narzugons & Devils.',
    map: BATTLE_MAPS.throne_ninth.grid, lanes: BATTLE_MAPS.throne_ninth.lanes,
    u: [['asmodeus', 5, 1], ['narzugon', 1, 4], ['spined_devil', 1, 1], ['bearded_devil', 9, 4], ['spined_devil', 9, 1]]
  },
  tiamat: {
    n: 'Tiamat, Queen of Dragons', place: 'Throne of the Ninth', theme: 'hells', mapKey: 'throne_ninth',
    q: 'Act 3 Final Boss · 3 Lanes', sc: { hp: 1.12, dmg: 1.02 }, note: 'Final Boss (2×2): Five Chromatic Breaths from the Ninth Throne flanked by Infernal guards!',
    map: BATTLE_MAPS.throne_ninth.grid, lanes: BATTLE_MAPS.throne_ninth.lanes,
    u: [['tiamat', 4, 2], ['cambion', 1, 1], ['bearded_devil', 1, 4], ['cambion', 9, 1], ['bearded_devil', 9, 4]]
  }
};

// Backwards-compatible alias for legacy `spider` key if referenced anywhere
ENC.spider = ENC.nezznar;

const TUNE = {};
const RANGE15 = r => r >= 6 ? 5 : r >= 5 ? 4 : r >= 4 ? 3 : r;
Object.values(E).forEach(d => { if (d.rng) d.rng = RANGE15(d.rng); });
