import json
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.utils import get_column_letter as L
J = json.load(open('/tmp/jobs.json')); CO = json.load(open('/tmp/castoff.json'))['heroes']; P = json.load(open('/tmp/paths.json'))
R = json.load(open('/home/claude/sheetgen/data.json'))['rules']
PN = {'arthur': ['Ready First', 'Second Wind'], 'bram': ['Preserve Life', 'Turn the Faithless'], 'faelan': ['Spell Weave', 'Shared Recovery'], 'wallaby': ['Cutthroat', 'Pickpocket'], 'dane': ['Duelist', 'Retribution'], 'lorcan': ['Colossus Slayer', 'Horde Breaker'], 'juniper': ['Bramble Guard', 'Bramble Stalker'], 'rosalind': ['Muse', 'Encore'], 'zark': ['Bear Totem', 'Wolf Totem'], 'naill': ['Stunning Strike', 'Step of the Wind'], 'nettle': ["Dark One's Blessing", 'Hellfire Pact'], 'pillar': ['Unbreakable', 'Avalanche'], 'laurel': ['Ensnaring Smite', 'Warding Smite'], 'lumen': ['Searing Focus', 'Healing Light'], 'jamison': ['Balm of Peace', 'Protective Bond'], 'zoe': ['Rune Carver', 'Just the Thing'], 'gilthrax': ['Gilded Hoard', "Bodyguard's Fee"], 'velith': ['First Blood', 'Nightshade Vials'], 'cinder': ['Twinned Spell', 'Empowered Spell'], 'gains': ['Compound Interest', 'Liquid Assets'], 'corvin': ["Stalker's Flurry", 'First Strike'], 'saint': ['Invoke Duplicity', 'Cloak of Shadows'], 'kaska': ['Panther', 'Dire Bear']}
HEAD = PatternFill('solid', fgColor='F3F3F3'); NOTE = Font(italic=True, color='666666'); TITLE = Font(bold=True, size=12)
wb = Workbook(); ws = wb.active; ws.title = 'Heroes'
cols = ['Hero', 'Job', 'Size', 'Win % (fights 2–5, tier 1, no items)', 'Hero dies', 'Fight effective HP', 'Effective HP check', 'Damage/s', 'Damage/s check', 'Casts per 30s', 'Value per cast', 'Size target', 'Value check', 'Ability share of damage', 'Help given per 30s', 'Help check',
        'Party win with ability', 'Party win without ability', 'Ability-off drop (points)', 'Rank-up adds (points)', 'Path A', 'Path A adds', 'Path B', 'Path B adds', 'Path A adds at the boss', 'Path B adds at the boss', 'Boss fights']
for i, c in enumerate(cols, 1):
    cell = ws.cell(row=1, column=i, value=c); cell.fill = HEAD; cell.alignment = Alignment(wrap_text=True, vertical='top')
order = sorted(J, key=lambda r: (['frontline', 'brawler', 'attacker', 'caster', 'support'].index(r['job']), r['name']))
for i, r in enumerate(order, 2):
    hid = r['id']; co = CO.get(hid); p = P.get(hid); size = r['size']; tv = R['abilitySizes'][size]['valuePerCast']; jd = r['judge']
    reg = p['reg'] if p else None; bs = p['boss'] if p else None
    row = [r['name'], r['job'], size, r['win'] / 100, r['dies'] / 100, round(r['fightEhp']), jd['ehp'], round(r['dps'], 1), jd['dps'], round(r['castsPer30'], 1), round(r['valuePerCast']), tv, jd['value'], r['abShare'], round(r['givenPer30']) if r['job'] == 'support' else None, jd.get('help'),
           (co['w'] / co['n']) if co else None, (co['wo'] / co['n']) if co else None, round(100 * (co['w'] - co['wo']) / co['n']) if co else None,
           round(100 * (reg['t2'] - reg['t1']) / reg['n']) if reg and reg['n'] else None, PN.get(hid, ['A', 'B'])[0], round(100 * (reg['a'] - reg['t2']) / reg['n']) if reg and reg['n'] else None, PN.get(hid, ['A', 'B'])[1], round(100 * (reg['b'] - reg['t2']) / reg['n']) if reg and reg['n'] else None,
           round(100 * (bs['a'] - bs['t2']) / bs['n']) if bs and bs['n'] else None, round(100 * (bs['b'] - bs['t2']) / bs['n']) if bs and bs['n'] else None, bs['n'] if bs else None]
    for j, v in enumerate(row, 1):
        c = ws.cell(row=i, column=j, value=v)
        if j in (4, 5, 14, 17, 18) and v is not None: c.number_format = '0%'
for j, w in enumerate([16, 10, 8, 11, 8, 9, 8, 8, 8, 8, 8, 8, 8, 9, 9, 8, 10, 10, 10, 10, 18, 8, 18, 8, 10, 10, 8], 1): ws.column_dimensions[L(j)].width = w
ws.freeze_panes = 'B2'
n = wb.create_sheet('Notes')
notes = ['About this data', 'Test bench, 26 Nov 2026, current configs: approved hero kits, normalization batch 1, encounter pass 1, Nezznar as the only boss, shop odds 0.75, half-point ability modifiers.', None,
 'Win % to Help check: `node bench.js jobs --n 60`. Each hero in 60 random 3-hero parties, tier 1, no items, fights 2–5. Checks read LOW or HIGH against the job and size targets on the balance model\'s Rules tab (Effective HP and damage/s 10% outside the range, value per cast 25% under or 33% over).',
 'Party win with and without ability: `node bench.js castoff --n 100 --reps 2`. Every fight the sensible and engine bots walked into (fight 2 on, items and partners as they were), replayed with that hero\'s ability off. A big drop means the party leans on that hero.',
 'Rank-up and paths: `node bench.js paths --n 100 --reps 2`. Fights 3 to the boss, each replayed with the hero at tier 1, at tier 2 with no path, and with each path. Rank-up = tier 2 with no path minus tier 1; Path adds = what each path adds on top. Boss columns: Nezznar only, 9–47 fights per hero, so read them loosely.',
 'Single-hero figures can be about 5 points off; boss figures more.', None, 'Columns', 'Fight effective HP: HP × (AC + 20) / 20, plus the Ward, healing and regen the hero gives itself in a 30-second fight.', 'Damage/s: the hero\'s own damage per second alive, after enemy armor, ability included.',
 'Value per cast: damage, healing and Ward each cast delivers. Size target: Small 9, Medium 20, Big 35.', 'Help given per 30s: healing and Ward to allies (supports only).', None,
 'History: this Sheet held prototype 2\'s numbers (24 Nov) until 26 Nov; Version history in the page has them.']
for i, t in enumerate(notes, 1):
    c = n.cell(row=i, column=1, value=t)
    if t in ('About this data', 'Columns'): c.font = TITLE
n.column_dimensions['A'].width = 140
for row in n.iter_rows():
    for c in row: c.alignment = Alignment(wrap_text=True, vertical='top')
wb.save('/home/claude/sheetgen/perf.xlsx'); print('saved perf')
