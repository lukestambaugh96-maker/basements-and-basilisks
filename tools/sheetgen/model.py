import json, sys
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.workbook.defined_name import DefinedName
from openpyxl.utils import get_column_letter as L
D = json.load(open('/home/claude/sheetgen/data.json'))
R = D['rules']; E = D['econ']
wb = Workbook(); wb.remove(wb.active)
HEAD = PatternFill('solid', fgColor='F3F3F3'); BOLD = Font(bold=True); TITLE = Font(bold=True, size=12); NOTE = Font(italic=True, color='666666')
def name(n, ref): wb.defined_names[n] = DefinedName(n, attr_text=ref)
def header(ws, row, cols):
    for i, c in enumerate(cols, 1):
        cell = ws.cell(row=row, column=i, value=c); cell.fill = HEAD; cell.alignment = Alignment(wrap_text=True, vertical='top')
def widths(ws, w):
    for i, x in enumerate(w, 1): ws.column_dimensions[L(i)].width = x
MOD = lambda c: f'IF(HalfModifiers,({c}-10)/2,FLOOR(({c}-10)/2,1))'

# ---------------- Rules ----------------
ws = wb.create_sheet('Rules')
ws['A1'] = 'Game-wide rules the test bench uses (rules.config.json, 26 Nov 2026). Edit a value here and every formula in this Sheet follows.'; ws['A1'].font = TITLE
header(ws, 3, ['Rule', 'Value', 'What it does'])
rules = [
 ('ResistK', 'Resistance midpoint K', R['resistance']['K'], 'Damage taken = damage × K / (resistance + K). AC resists physical, SR magic; Radiant ignores both.'),
 ('MinDamage', 'Minimum damage per hit', R['resistance']['minimumDamage'], 'After resistance, a hit always deals at least this.'),
 ('HalfModifiers', 'Half-point modifiers', True, 'TRUE: modifier = (score − 10) / 2 (15 gives +2.5). FALSE: D&D\'s rounded-down modifier. Luke, 26 Nov.'),
 ('BaseHP', 'Base HP', R['hp']['base'], 'Every hero starts with this, before hit dice.'),
 ('HitDicePerTier', 'Hit dice per tier', R['hp']['hitDiceAtTier'], 'HP = base + hit dice × average of the class die + CON modifier × hit dice. Tier 2 doubles the hit dice.'),
 ('AttackerSecPerCast', 'Attackers: seconds of attacking per cast', R['charge']['attackerSecondsPerCast'], 'Charge per basic attack = 100 × attack interval / this.'),
 ('ChargePerHit', 'Frontliners: charge per hit taken', R['charge']['perHitTaken'], ''),
 ('CasterBaseSec', 'Casters: seconds per 100 charge', R['charge']['casterBaseSeconds'], 'Faster with INT (next row).'),
 ('CasterIntPerMod', 'Casters: charge speed per INT modifier', R['charge']['casterIntPerModifier'], 'At least half speed.'),
 ('ChaChargePerMod', 'Starting charge per CHA modifier', R['charge']['chaStartChargePerModifier'], ''),
 ('ChaChargeMax', 'Most starting charge from CHA', R['charge']['chaStartChargeMax'], ''),
 ('MinCastGap', 'Fewest seconds between casts', R['charge']['minSecondsBetweenCasts'], ''),
 ('RefundShare', 'Charge kept after a Fizzle or a stun mid-cast', R['charge']['refundShare'], 'Share of charge to cast.'),
 ('LowBand', 'd20 ability roll: Low at or below', R['abilityRoll']['lowAtOrBelow'], 'd20 + key modifier. Natural 1 fizzles; natural 20 is High and doubles the dice.'),
 ('HighBand', 'd20 ability roll: High at or above', R['abilityRoll']['highAtOrAbove'], ''),
 ('RestrainedSlow', 'Restrained: attacks slower by', R['statuses']['restrained']['attackSlow'], 'Also can\'t move; casts roll with Disadvantage.'),
 ('BossControl', 'Control on bosses lasts', R['statuses']['bossControlShare'], 'Share of the normal duration.'),
 ('StunImmunity', 'Stun immunity after a stun (s)', R['statuses']['stunImmunityAfter'], ''),
 ('LastStandSec', 'Last Stand invulnerability (s)', R['statuses']['lastStandSeconds'], 'Heroes with a Last Stand source only.'),
 ('BurnSec', 'Burn lasts (s)', R['statuses']['burnSeconds'], ''),
 ('MinAttackInterval', 'Fastest attack interval (s)', 0.3, ''),
 ('RefAC', 'Reference enemy AC (hero damage)', 13, 'Typical Act 1 regular enemy, for the Heroes tab\'s damage per second.'),
 ('RefSR', 'Reference enemy SR (hero damage)', 12, ''),
 ('TankAC', 'Reference tank AC (enemy damage)', 17, 'For the Enemies tab\'s damage per second against a frontliner.'),
 ('TankSR', 'Reference tank SR (enemy damage)', 13, ''),
]
for i, (n, lab, v, note) in enumerate(rules, 4):
    ws.cell(row=i, column=1, value=lab); ws.cell(row=i, column=2, value=v); ws.cell(row=i, column=3, value=note); name(n, f"Rules!$B${i}")
r = 4 + len(rules) + 1
ws.cell(row=r, column=1, value='Hit die by class').font = BOLD; r += 1
header(ws, r, ['Class', 'Hit die']); start = r + 1
for cls, die in R['hp']['hitDie'].items(): r += 1; ws.cell(row=r, column=1, value=cls); ws.cell(row=r, column=2, value=die)
name('HitDieClass', f"Rules!$A${start}:$A${r}"); name('HitDieSize', f"Rules!$B${start}:$B${r}")
r += 2; ws.cell(row=r, column=1, value='Ability sizes').font = BOLD; r += 1
header(ws, r, ['Size', 'Charge to cast', 'Value per cast', 'Share of output', 'Casts per 30s (measured)'])
for s in ['small', 'medium', 'big', 'nuke']:
    r += 1; x = R['abilitySizes'][s]; ws.cell(row=r, column=1, value=s); ws.cell(row=r, column=2, value=x['chargeToCast']); ws.cell(row=r, column=3, value=x['valuePerCast']); ws.cell(row=r, column=4, value=x['shareOfOutput']); ws.cell(row=r, column=5, value=x['castsPer30s'])
r += 2; ws.cell(row=r, column=1, value='Job benchmarks (tier 1, no items, Act 1 regular fights)').font = BOLD; r += 1
header(ws, r, ['Job', 'Fight effective HP', 'Damage per second', 'Other'])
other = {'attacker': 'ability ≤ 35% of damage', 'caster': 'ability ≥ 50% of damage', 'support': '60–90 healing/Ward to allies per 30s, or +15–25% party damage'}
for j in ['frontline', 'brawler', 'attacker', 'caster', 'support']:
    r += 1; t = R['jobTargets'][j]; ws.cell(row=r, column=1, value=j); ws.cell(row=r, column=2, value=f"{t['fightEhp'][0]}–{t['fightEhp'][1]}"); ws.cell(row=r, column=3, value=f"{t['dps'][0]}–{t['dps'][1]}"); ws.cell(row=r, column=4, value=other.get(j, ''))
r += 2; ws.cell(row=r, column=1, value='Fight effective HP = HP × (AC + K) / K, plus the Ward, healing and regen a hero gives itself in a 30-second fight. Damage per second is after enemy armor, ability included.').font = NOTE
widths(ws, [42, 14, 90, 30, 22])
ws.freeze_panes = 'A4'

# ---------------- Heroes ----------------
ws = wb.create_sheet('Heroes')
cols = ['Hero', 'Job', 'Size', 'Class', 'HP T1', 'HP T2', 'AC', 'SR', 'Effective HP vs physical T1', 'Effective HP vs magic T1', 'Effective HP vs physical T2',
        'Attack', 'Average hit T1', 'Attack interval (s)', 'Attack damage/s raw T1', 'Attack damage/s vs AC 13 / SR 12, T1',
        'Charge source', 'Charge to cast', 'Starting charge', 'Casts after', 'Unit', '≈ seconds per cast, T1', 'Ability (tier 1 numbers per tier)',
        'Hit die', 'STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA', 'Key score', 'Range', 'Attack dice', 'Attack die', 'Attack flat', 'Attack adds', 'Adds half', 'Strikes per attack', 'Damage type', 'Attack dice per tier', 'Start charge (config)']
header(ws, 1, cols)
idx = {c: i + 1 for i, c in enumerate(cols)}; C = lambda c: L(idx[c])
for i, h in enumerate(D['heroes'], 2):
    v = {'Hero': h['name'], 'Job': h['job'], 'Size': h['size'], 'Class': h['cls'], 'AC': h['ac'], 'SR': h['sr'], 'Attack': h['atk'], 'Attack interval (s)': h['aiv'],
         'Charge source': h['charge'], 'Charge to cast': h['ctc'], 'Ability (tier 1 numbers per tier)': h['ability'], 'STR': h['STR'], 'DEX': h['DEX'], 'CON': h['CON'], 'INT': h['INT'], 'WIS': h['WIS'], 'CHA': h['CHA'],
         'Key score': h['key'], 'Range': h['range'], 'Attack dice': h['an'], 'Attack die': h['ax'], 'Attack flat': h['af'], 'Attack adds': h['astat'] or None, 'Adds half': h['ahalf'],
         'Strikes per attack': h['astr'], 'Damage type': h['atype'], 'Attack dice per tier': h['apt'], 'Start charge (config)': h['sc']}
    for k, val in v.items(): ws.cell(row=i, column=idx[k], value=val)
    c = lambda k: f"{C(k)}{i}"
    con, cha, intl, strg = MOD(c('CON')), MOD(c('CHA')), MOD(c('INT')), MOD(c('STR'))
    stat = f"INDEX({c('STR')}:{c('CHA')},MATCH({c('Attack adds')},{{\"STR\",\"DEX\",\"CON\",\"INT\",\"WIS\",\"CHA\"}},0))"
    ws[c('Hit die')] = f"=INDEX(HitDieSize,MATCH({c('Class')},HitDieClass,0))"
    ws[c('HP T1')] = f"=BaseHP+FLOOR(HitDicePerTier*({c('Hit die')}+1)/2,1)+{con}*HitDicePerTier"
    ws[c('HP T2')] = f"=BaseHP+FLOOR(2*HitDicePerTier*({c('Hit die')}+1)/2,1)+{con}*2*HitDicePerTier"
    ws[c('Effective HP vs physical T1')] = f"={c('HP T1')}*({c('AC')}+ResistK)/ResistK"
    ws[c('Effective HP vs magic T1')] = f"={c('HP T1')}*({c('SR')}+ResistK)/ResistK"
    ws[c('Effective HP vs physical T2')] = f"={c('HP T2')}*({c('AC')}+ResistK)/ResistK"
    ws[c('Average hit T1')] = f"={c('Attack dice')}*({c('Attack die')}+1)/2+{c('Attack flat')}+IF({c('Attack adds')}=\"\",0,IF({c('Adds half')},FLOOR({MOD(stat)}/2,1),{MOD(stat)}))"
    ws[c('Attack damage/s raw T1')] = f"={c('Average hit T1')}*{c('Strikes per attack')}/{c('Attack interval (s)')}"
    ws[c('Attack damage/s vs AC 13 / SR 12, T1')] = f"={c('Attack damage/s raw T1')}*IF({c('Damage type')}=\"radiant\",1,IF({c('Damage type')}=\"magic\",ResistK/(RefSR+ResistK),ResistK/(MAX(0,RefAC-MAX(0,{strg}))+ResistK)))"
    ws[c('Starting charge')] = f"=MIN({c('Charge to cast')},MIN(ChaChargeMax,MAX(0,ChaChargePerMod*{cha}))+{c('Start charge (config)')})"
    ws[c('Casts after')] = f"=IF({c('Charge source')}=\"attack\",CEILING({c('Charge to cast')}/ROUND(100*{c('Attack interval (s)')}/AttackerSecPerCast,0),1),IF({c('Charge source')}=\"hit\",CEILING({c('Charge to cast')}/ChargePerHit,1),{c('Charge to cast')}/(100/CasterBaseSec*MAX(0.5,1+CasterIntPerMod*{intl}))))"
    ws[c('Unit')] = f"=IF({c('Charge source')}=\"attack\",\"attacks\",IF({c('Charge source')}=\"hit\",\"hits taken\",\"seconds\"))"
    ws[c('≈ seconds per cast, T1')] = f"=IF({c('Charge source')}=\"attack\",{c('Casts after')}*{c('Attack interval (s)')},IF({c('Charge source')}=\"time\",{c('Casts after')},\"\"))"
    for k, fmt in [('HP T1', '0'), ('HP T2', '0'), ('Effective HP vs physical T1', '0'), ('Effective HP vs magic T1', '0'), ('Effective HP vs physical T2', '0'), ('Average hit T1', '0.0'), ('Attack damage/s raw T1', '0.0'), ('Attack damage/s vs AC 13 / SR 12, T1', '0.0'), ('Casts after', '0.0'), ('≈ seconds per cast, T1', '0.0'), ('Starting charge', '0')]:
        ws[c(k)].number_format = fmt
    ws[c('Ability (tier 1 numbers per tier)')].alignment = Alignment(wrap_text=True, vertical='top')
n = len(D['heroes']) + 1
r = n + 2
ws.cell(row=r, column=1, value='Inputs are the config numbers (heroes.config.json); the coloured-free columns left of "Hit die" are formulas. Abilities are summarised in words: their dice per tier, bands (Low/Mid/High) and riders come from the config; the measured value per cast is on the hero performance Sheet.').font = NOTE
r += 1; ws.cell(row=r, column=1, value='Attack damage/s counts basic attacks only (no ability, items or buffs). Physical damage subtracts the hero\'s STR modifier from enemy AC (penetration). Corvin strikes his Marked target twice; Lorcan\'s Twin Shot and Pillar\'s stun on hit are not counted.').font = NOTE
r += 1; ws.cell(row=r, column=1, value='Casts after: attackers count attacks, frontliners hits taken, casters seconds. ≈ seconds per cast ignores walking, stuns and Restrained.').font = NOTE
widths(ws, [16, 10, 8, 10, 7, 7, 5, 5, 10, 10, 10, 18, 8, 9, 10, 12, 9, 8, 8, 7, 9, 9, 60] + [7] * 18)
ws.freeze_panes = 'B2'

# ---------------- Enemies ----------------
ws = wb.create_sheet('Enemies')
cols = ['Enemy', 'Rank', 'Chassis', 'Affix', 'Boss in Act 1', 'HP', 'AC', 'SR', 'Effective HP vs physical', 'Effective HP vs magic', 'Average hit', 'Attack interval (s)', 'Strikes', 'Damage type',
        'Attack damage/s raw', 'Attack damage/s vs AC 17 / SR 13', 'Ability', 'Ability average damage', 'Ability cadence', 'Ability target', 'Range', 'Id', 'Attack dice', 'Attack die', 'Attack flat', 'Ability dice', 'Ability die', 'Ability flat']
header(ws, 1, cols); idx = {c: i + 1 for i, c in enumerate(cols)}; C = lambda c: L(idx[c])
for i, e in enumerate(D['enemies'], 2):
    ab = e['ab']
    v = {'Enemy': e['name'], 'Rank': e['rank'], 'Chassis': e['chassis'], 'Affix': e['affix'] or None, 'Boss in Act 1': (e['active'] if e['active'] != '' else None), 'HP': e['hp'], 'AC': e['ac'], 'SR': e['sr'],
         'Attack interval (s)': e['aiv'], 'Strikes': e['astr'], 'Damage type': e['atype'], 'Ability': ab[0] or None, 'Ability cadence': ab[4] or None, 'Ability target': ab[5] or None, 'Range': e['range'], 'Id': e['id'],
         'Attack dice': e['an'], 'Attack die': e['ax'], 'Attack flat': e['af'], 'Ability dice': ab[1], 'Ability die': ab[2], 'Ability flat': ab[3]}
    for k, val in v.items(): ws.cell(row=i, column=idx[k], value=val)
    c = lambda k: f"{C(k)}{i}"
    ws[c('Effective HP vs physical')] = f"={c('HP')}*({c('AC')}+ResistK)/ResistK"
    ws[c('Effective HP vs magic')] = f"={c('HP')}*({c('SR')}+ResistK)/ResistK"
    ws[c('Average hit')] = f"={c('Attack dice')}*({c('Attack die')}+1)/2+{c('Attack flat')}"
    ws[c('Attack damage/s raw')] = f"={c('Average hit')}*{c('Strikes')}/{c('Attack interval (s)')}"
    ws[c('Attack damage/s vs AC 17 / SR 13')] = f"={c('Attack damage/s raw')}*IF({c('Damage type')}=\"magic\",ResistK/(TankSR+ResistK),ResistK/(TankAC+ResistK))"
    ws[c('Ability average damage')] = f"=IF({c('Ability dice')}=\"\",\"\",{c('Ability dice')}*({c('Ability die')}+1)/2+{c('Ability flat')})"
    for k, fmt in [('Effective HP vs physical', '0'), ('Effective HP vs magic', '0'), ('Average hit', '0.0'), ('Attack damage/s raw', '0.0'), ('Attack damage/s vs AC 17 / SR 13', '0.0'), ('Ability average damage', '0.0')]:
        ws[c(k)].number_format = fmt
ne = len(D['enemies']) + 1
name('EnemyId', f"Enemies!${C('Id')}$2:${C('Id')}${ne}")
for k, nm in [('Enemy', 'EnemyName'), ('HP', 'EnemyHP'), ('Effective HP vs physical', 'EnemyEHP'), ('Attack damage/s raw', 'EnemyDPS'), ('Attack damage/s vs AC 17 / SR 13', 'EnemyDPSTank'), ('Ability', 'EnemyAbility')]:
    name(nm, f"Enemies!${C(k)}$2:${C(k)}${ne}")
r = ne + 2
ws.cell(row=r, column=1, value='Numbers from enemies.config.json (encounter pass 1 and the Nezznar check). Venomfang and King Grol are switched off for Act 1 (Boss in Act 1 = FALSE). Ability damage is the Mid result; abilities that hit several heroes deal it to each.').font = NOTE
widths(ws, [20, 8, 10, 9, 8, 6, 5, 5, 10, 10, 8, 9, 7, 9, 10, 12, 16, 9, 18, 34, 6, 14] + [7] * 6)
ws.freeze_panes = 'B2'

# ---------------- Encounters ----------------
ws = wb.create_sheet('Encounters')
ws['A1'] = 'Act 1 fights'; ws['A1'].font = TITLE
header(ws, 2, ['Fight', 'Encounter', 'Enemies', 'Total HP', 'Total effective HP vs physical', 'Enemy attack damage/s raw', 'Enemy attack damage/s vs AC 17 / SR 13'])
fights = []
for f, nm, _ in D['enc']:
    if (f, nm) not in fights: fights.append((f, nm))
top = 3; long0 = top + len(fights) + 3
for j, (f, nm) in enumerate(fights):
    rr = top + j; ws.cell(row=rr, column=1, value=f); ws.cell(row=rr, column=2, value=nm)
    rng = lambda col: f"${col}${long0+1}:${col}${long0+len(D['enc'])}"
    ws.cell(row=rr, column=3, value=f"=COUNTIFS({rng('B')},B{rr})")
    ws.cell(row=rr, column=4, value=f"=SUMIFS({rng('E')},{rng('B')},B{rr})")
    ws.cell(row=rr, column=5, value=f"=SUMIFS({rng('F')},{rng('B')},B{rr})").number_format = '0'
    ws.cell(row=rr, column=6, value=f"=SUMIFS({rng('G')},{rng('B')},B{rr})").number_format = '0.0'
    ws.cell(row=rr, column=7, value=f"=SUMIFS({rng('H')},{rng('B')},B{rr})").number_format = '0.0'
ws.cell(row=long0 - 1, column=1, value='Enemies in each fight').font = TITLE
header(ws, long0, ['Fight', 'Encounter', 'Enemy id', 'Enemy', 'HP', 'Effective HP vs physical', 'Attack damage/s raw', 'Attack damage/s vs AC 17 / SR 13', 'Ability'])
for k, (f, nm, eid) in enumerate(D['enc']):
    rr = long0 + 1 + k
    ws.cell(row=rr, column=1, value=f); ws.cell(row=rr, column=2, value=nm); ws.cell(row=rr, column=3, value=eid)
    for col, rng in [(4, 'EnemyName'), (5, 'EnemyHP'), (6, 'EnemyEHP'), (7, 'EnemyDPS'), (8, 'EnemyDPSTank'), (9, 'EnemyAbility')]:
        cell = ws.cell(row=rr, column=col, value=f"=IFERROR(INDEX({rng},MATCH(C{rr},EnemyId,0)),\"\")")
        if col in (6,): cell.number_format = '0'
        if col in (7, 8): cell.number_format = '0.0'
rr = long0 + len(D['enc']) + 2
ws.cell(row=rr, column=1, value='Fight 1 (Goblin Ambush) is the starter alone. Ability damage and control are not in these totals; see the Enemies tab. Positions and terrain are in enemies.config.json.').font = NOTE
widths(ws, [7, 26, 13, 20, 9, 12, 12, 14, 16])

# ---------------- Items ----------------
ws = wb.create_sheet('Items')
ws['A1'] = 'Items in the shop today (run.js, before the Uncommon / Rare / Epic rework)'; ws['A1'].font = TITLE
header(ws, 2, ['Item', 'Rarity', 'Price', 'Effect'])
for i, it in enumerate(D['items'], 3):
    for j, v in enumerate(it, 1): ws.cell(row=i, column=j, value=v)
r = 3 + len(D['items']) + 1
ws.cell(row=r, column=1, value='Buff values (buff test, 26 Nov): win % points one buff adds to a hero\'s party, items removed').font = TITLE; r += 1
header(ws, r, ['Buff', 'Attackers', 'Brawlers', 'Casters', 'Frontlines', 'Supports', 'Everyone'])
buffs = [['Key score +1 (half modifiers)', 2, 3, 0, -1, 3, 1], ['Key score +2', 4, 5, 6, 5, 3, 4], ['Key score +3 (half modifiers)', 5, 5, 4, 5, 5, 5],
         ['CON +1 (half modifiers)', 1, 1, 1, 1, 0, 1], ['CON +2', 2, 4, 2, 5, 2, 4], ['CON +3 (half modifiers)', 3, 4, 3, 8, 4, 5],
         ['Attack speed +10%', 5, 4, 1, 2, 3, 3], ['Attack speed +20%', 9, 7, 3, 4, 3, 6], ['Attack speed +30%', 12, 10, 1, 6, 4, 8],
         ['Attack +1d4 per hit', 13, 4, 12, 5, 7, 8], ['Attack +1d6 per hit', 16, 6, 14, 8, 8, 10], ['Attack +1d8 per hit', 19, 8, 18, 10, 11, 13], ['Attack +1d10 per hit', 25, 11, 19, 13, 13, 16],
         ['Ability +1d4 per hit', 3, 1, 5, 1, 0, 2], ['Ability +1d6 per hit', 4, 1, 6, 2, 0, 2], ['Ability +1d8 per hit', 5, 2, 8, 2, 0, 3], ['Ability +1d10 per hit', 6, 2, 10, 3, 0, 4]]
for b in buffs:
    r += 1
    for j, v in enumerate(b, 1): ws.cell(row=r, column=j, value=v)
r += 2; ws.cell(row=r, column=1, value='Rough bands for the rework: Uncommon about +4 to +6 points, Rare +8 to +13, Epic +15 and up (or a build-around clause). Per-hero figures: claude/v0.25b-buff-test.md. Ability-score rows marked "half modifiers" were measured after the 26 Nov modifier change; the rest before it.').font = NOTE
widths(ws, [30, 11, 9, 9, 10, 9, 9])

# ---------------- Economy ----------------
ws = wb.create_sheet('Economy')
ws['A1'] = 'Economy (run.js and rules.config.json, 26 Nov 2026)'; ws['A1'].font = TITLE
header(ws, 2, ['Setting', 'Value'])
econ = [('Starting gold', E['start']), ('Hero price (tier 1 copy)', E['heroCost'][0]), ('Gold per win, Act 1', E['win']), ('Gold for the boss', E['boss']),
        ('Interest', f"1 per {E['interestPer']} saved, counting up to {E['interestCap']} (max +{E['interestCap']//E['interestPer']})"), ('Sale chance', E['saleChance']), ('Sale discount', E['saleOff']),
        ('Piggy Bank per win', E['piggyPerWin']), ('Purse card', E['purse']), ('Party on the board', E['boardMax']), ('Bench', E['benchMax']), ('Item slots per hero', E['slots']),
        ('Rerolls', '1 gold, then 1 more per reroll in the same shop; back to 1 at the next shop'), ('Owned heroes offered (vs a hero you don\'t own)', R['shop']['ownedHeroWeight']),
        ('Shop offers', '3 heroes and 3 items'), ('Copies to rank up', '2 (tier 2 is the cap in Act 1)')]
for i, (k, v) in enumerate(econ, 3):
    ws.cell(row=i, column=1, value=k); cell = ws.cell(row=i, column=2, value=v)
    if k in ('Sale chance', 'Sale discount', 'Owned heroes offered (vs a hero you don\'t own)'): cell.number_format = '0%'
r = 3 + len(econ) + 1
ws.cell(row=r, column=1, value='Item prices by rarity').font = TITLE; r += 1
header(ws, r, ['Rarity', 'Price'])
for k, v in [('Common', 5), ('Uncommon', 10), ('Rare', 15), ('Very Rare', 25), ('Legendary', 35), ('Class (choice card only)', 15)]:
    r += 1; ws.cell(row=r, column=1, value=k); ws.cell(row=r, column=2, value=v)
r += 2; ws.cell(row=r, column=1, value='Shop item odds by fight (% of each item offer)').font = TITLE; r += 1
header(ws, r, ['Shop before', 'Common', 'Uncommon', 'Rare', 'Very Rare'])
labels = ['Fight 1 (unused: no shop)', 'Fight 2', 'Fight 3', 'Fight 4', 'Fight 5', 'Boss']
for i, w in enumerate(D['weights']):
    r += 1; ws.cell(row=r, column=1, value=labels[i])
    for j, k in enumerate(['Common', 'Uncommon', 'Rare', 'Very Rare'], 2): ws.cell(row=r, column=j, value=w.get(k, 0))
r += 2; ws.cell(row=r, column=1, value='Choice cards after each win (2 drawn): Multiclass Trainer, Class Item, Free Item, Purse, Training, Recruit, Bargain: Elite, Bargain: Patience. After fight 5: the Campfire (rank one hero up, or a Ward for the boss).').font = NOTE
widths(ws, [44, 22, 11, 9, 10])

out = sys.argv[1] if len(sys.argv) > 1 else '/home/claude/sheetgen/model.xlsx'
wb.save(out); print('saved', out)

# ---------------- Act 1 results (measured, appended) ----------------
B = json.load(open('/tmp/bots.json')); BO = json.load(open('/tmp/boss.json'))
wb2 = __import__('openpyxl').load_workbook(out)
ws = wb2.create_sheet('Act 1 results')
ws['A1'] = 'Measured on the test bench, 26 Nov 2026 (current configs): 300 whole Act 1 runs per bot, seeds 20000+'; ws['A1'].font = TITLE
header(ws, 2, ['Bot', 'Cleared', 'Free loss used', 'Run ends (median)', "Klarg's Cave", "Glasstaff's Hideout", 'Thundertree', 'Forge of Spells', 'Boss (Nezznar)', 'HP lost, fights 2–5', 'Rank-ups bought per run', 'Rank-ups found after a reroll'])
for i, (k, lab) in enumerate([('bare', 'Never buys'), ('sensible', 'Buys sensibly'), ('engine', 'Builds an engine')], 3):
    b = B[k]; w = b['win']
    vals = [lab, b['clear'] / 100, b['freeLoss'] / 100, b['medianEnd'], w[1] / 100, w[2] / 100, w[3] / 100, (w[4] / 100 if w[4] is not None else None), (w[5] / 100 if w[5] is not None else None), b['hpLost'] / 100, round(b['rankUps'], 1), b['rankUpsAfterReroll'] / 100]
    for j, v in enumerate(vals, 1):
        c = ws.cell(row=i, column=j, value=v)
        if j in (2, 3, 5, 6, 7, 8, 9, 10, 12) and v is not None: c.number_format = '0%'
ws.cell(row=7, column=1, value='Win % per fight counts every attempt (a retry after the free loss is a second attempt). Never-buy fills the 3 party slots, then buys nothing.').font = NOTE
ws.cell(row=9, column=1, value='Boss check: parties the sensible and engine bots brought to Nezznar, rebuilt three ways (3 replays each)').font = TITLE
header(ws, 10, ['Party', 'Parties', 'Win', 'HP lost', 'Items held', 'Target (Luke, 26 Nov)'])
for i, (k, lab, tgt) in enumerate([('A', 'A: all tier 2, items on one hero', 'does well'), ('B', 'B: two tier 2, with items', 'clears relatively well with a good team'), ('C', 'C: one tier 2, with items', 'struggles')], 11):
    o = BO['res'][k]
    for j, v in enumerate([lab, o['n'], o['w'] / o['n'], o['hp'] / o['n'], round(o['items'] / o['n'], 1), tgt], 1):
        c = ws.cell(row=i, column=j, value=v)
        if j in (3, 4): c.number_format = '0%'
ws.cell(row=15, column=1, value='Re-run: node bench.js bots --n 300 --seed 20000; node bench.js bosscheck --n 150. Placement: the bots\' default (melee front, ranged back).').font = NOTE
widths(ws, [32, 9, 10, 12, 10, 11, 11, 11, 11, 11, 11, 12])
wb2.save(out); print('added results')
