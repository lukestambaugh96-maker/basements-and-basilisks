/**
 * bundle.mjs — Bundles the modular Basements & Basilisks v0.24 codebase AND all mapped
 * custom art assets from assets/manifest.json into a single truly self-contained offline
 * HTML prototype at dist/Basements_&_Basilisks_0.24.html.
 */

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');

const scriptOrder = [
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
  'src/09-cards.js',
  'src/10-board.js',
  'src/11-shell.js',
];

function buildEmbeddedManifest() {
  const manifestPath = path.join(root, 'assets', 'manifest.json');
  const raw = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const cats = ['heroes', 'forms', 'enemies', 'items', 'maps'];
  const entries = [];
  for (const cat of cats) {
    const map = raw[cat] || {};
    for (const [key, rel] of Object.entries(map)) {
      if (!rel || /^(data:|blob:|https?:\/\/)/i.test(rel)) continue;
      const abs = path.join(root, rel);
      if (fs.existsSync(abs)) entries.push({ cat, key, abs });
    }
  }

  const out = { version: raw.version || '0.23', baseUrl: '', heroes: {}, forms: {}, enemies: {}, items: {}, maps: {} };
  // Preserve any direct URL/data entries already in manifest.json
  for (const cat of cats) {
    for (const [key, val] of Object.entries(raw[cat] || {})) {
      if (val && /^(data:|blob:|https?:\/\/)/i.test(val)) out[cat][key] = val;
    }
  }

  if (!entries.length) return { manifest: out, count: 0, mode: 'none' };

  // Prefer resizing to 512px WebP via Python Pillow (matches keyedCustomArt maxDim=512, ~30x smaller than raw 1024px PNGs)
  try {
    const pyScript = `
import sys, json, io, base64
from PIL import Image
entries = json.loads(sys.stdin.read())
res = []
for e in entries:
    im = Image.open(e["abs"]).convert("RGBA")
    im.thumbnail((512, 512), Image.Resampling.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, format="WEBP", quality=86, method=6)
    b64 = base64.b64encode(buf.getvalue()).decode("ascii")
    res.append({"cat": e["cat"], "key": e["key"], "uri": "data:image/webp;base64," + b64})
sys.stdout.write(json.dumps(res))
`;
    const encoded = JSON.parse(
      execFileSync('python3', ['-c', pyScript], {
        input: JSON.stringify(entries),
        maxBuffer: 64 * 1024 * 1024,
        encoding: 'utf8',
      })
    );
    for (const item of encoded) out[item.cat][item.key] = item.uri;
    return { manifest: out, count: encoded.length, mode: 'webp-512' };
  } catch {
    // Pure-Node fallback: embed raw base64 files as-is
    for (const e of entries) {
      const ext = path.extname(e.abs).toLowerCase().slice(1);
      const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : ext === 'webp' ? 'image/webp' : ext === 'svg' ? 'image/svg+xml' : 'image/png';
      out[e.cat][e.key] = `data:${mime};base64,${fs.readFileSync(e.abs).toString('base64')}`;
    }
    return { manifest: out, count: entries.length, mode: 'raw' };
  }
}

const { manifest: embeddedManifest, count: assetCount, mode: assetMode } = buildEmbeddedManifest();

const bundledJs = [
  `/* === Embedded Manifest (${assetCount} assets, ${assetMode}) === */\nwindow.__BUNDLED_MANIFEST__ = ${JSON.stringify(embeddedManifest)};`,
  ...scriptOrder.map(f => `/* === ${f} === */\n` + fs.readFileSync(path.join(root, f), 'utf8')),
].join('\n\n');

let out = html.replace(
  '<link rel="stylesheet" href="styles.css" />',
  `<style>\n${css}\n</style>`
);

// Hide relative Asset Studio & Field Guide links in standalone single-file bundle
out = out.replace(/<a class="btn" id="(assetStudioLink|wikiLink)"[^>]*>.*?<\/a>/g, '');

const firstTag = `<script src="${scriptOrder[0]}"></script>`;
const lastTag = `<script src="${scriptOrder[scriptOrder.length - 1]}"></script>`;
const startIdx = out.indexOf(firstTag);
const endIdx = out.indexOf(lastTag) + lastTag.length;

if (startIdx < 0 || endIdx <= startIdx) {
  throw new Error('Could not locate script tag block in index.html');
}

out = out.slice(0, startIdx) + `<script>\n${bundledJs}\n</script>` + out.slice(endIdx);

const distPath = path.join(root, 'dist', 'Basements_&_Basilisks_0.24.html');
fs.mkdirSync(path.dirname(distPath), { recursive: true });
fs.writeFileSync(distPath, out, 'utf8');
console.log(`Bundled single-file HTML -> ${distPath} (${(out.length / 1024).toFixed(1)} KB, ${assetCount} embedded assets via ${assetMode})`);
