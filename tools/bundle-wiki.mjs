/**
 * bundle-wiki.mjs — Bundles tools/wiki.html + src/00..08 + src/04b-house-rules.js + data/wiki-meta-stats.js
 * + 24 hero WebP portraits into a single self-contained offline HTML artifact at
 * dist/Basements_&_Basilisks_0.24_Field_Guide.html.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
let html = fs.readFileSync(path.join(root, 'tools', 'wiki.html'), 'utf8');

const scripts = [
  'src/00-assets.js',
  'src/01-geo.js',
  'src/02-enemies.js',
  'src/03-heroes.js',
  'src/04-items.js',
  'src/04b-house-rules.js',
  'src/05-engine.js',
  'src/06-adventure.js',
  'src/07-glossary.js',
  'src/08-portraits.js',
  'data/wiki-meta-stats.js',
];

// Encode all 24 hero portraits as crisp 256px WebP data URIs
const heroDir = path.join(root, 'assets', 'heroes');
const heroFiles = fs.readdirSync(heroDir).filter(f => f.endsWith('.png') && !f.includes('_form') && !f.includes('_quest'));
const py = `
import sys, json, io, base64, os
from PIL import Image
entries = json.loads(sys.stdin.read())
out = {}
for p in entries:
    k = os.path.splitext(os.path.basename(p))[0]
    im = Image.open(p).convert("RGBA")
    im.thumbnail((256, 256), Image.Resampling.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, format="WEBP", quality=82, method=6)
    out[k] = "data:image/webp;base64," + base64.b64encode(buf.getvalue()).decode("ascii")
sys.stdout.write(json.dumps(out))
`;
const heroMap = JSON.parse(execFileSync('python3', ['-c', py], {
  input: JSON.stringify(heroFiles.map(f => path.join(heroDir, f))),
  maxBuffer: 32 * 1024 * 1024,
  encoding: 'utf8'
}));

const bundledJs = [
  `window.__WIKI_HERO_ART__ = ${JSON.stringify(heroMap)};`,
  ...scripts.map(f => `/* === ${f} === */\n` + fs.readFileSync(path.join(root, f), 'utf8'))
].join('\n\n');

// Replace heroImgSrc to use embedded WebP map
html = html.replace(
  'function heroImgSrc(k) { return `../assets/heroes/${k}.png`; }',
  'function heroImgSrc(k) { return (window.__WIKI_HERO_ART__ && window.__WIKI_HERO_ART__[k]) || `../assets/heroes/${k}.png`; }'
);

// Hide relative nav buttons in standalone offline bundle
html = html.replace(/<nav class="nav-actions"[\s\S]*?<\/nav>/, '');

// Inline all external script tags
const firstTag = '<script src="../src/00-assets.js"></script>';
const lastTag = '<script src="../data/wiki-meta-stats.js"></script>';
const sIdx = html.indexOf(firstTag);
const eIdx = html.indexOf(lastTag) + lastTag.length;
if (sIdx < 0 || eIdx <= sIdx) throw new Error('Could not locate wiki script block');

html = html.slice(0, sIdx) + `<script>\n${bundledJs}\n</script>` + html.slice(eIdx);

const outPath = path.join(root, 'dist', 'Basements_&_Basilisks_0.24_Field_Guide.html');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, html, 'utf8');
console.log(`Bundled self-contained Field Guide -> ${outPath} (${(html.length / 1024).toFixed(1)} KB, ${Object.keys(heroMap).length} embedded WebP heroes)`);
