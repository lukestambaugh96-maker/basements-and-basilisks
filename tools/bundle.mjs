/**
 * bundle.mjs — Bundles the modular Basements & Basilisks v0.22 codebase into a single
 * self-contained offline HTML file at dist/Basements_&_Basilisks_0.22.html.
 */

import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');

const scriptOrder = [
  'src/00-assets.js',
  'src/01-geo.js',
  'src/02-enemies.js',
  'src/03-heroes.js',
  'src/04-items.js',
  'src/05-engine.js',
  'src/06-adventure.js',
  'src/07-glossary.js',
  'src/08-portraits.js',
  'src/09-cards.js',
  'src/10-board.js',
  'src/11-shell.js',
];

const bundledJs = scriptOrder
  .map(f => `/* === ${f} === */\n` + fs.readFileSync(path.join(root, f), 'utf8'))
  .join('\n\n');

let out = html.replace(
  '<link rel="stylesheet" href="styles.css" />',
  `<style>\n${css}\n</style>`
);

const firstTag = `<script src="${scriptOrder[0]}"></script>`;
const lastTag = `<script src="${scriptOrder[scriptOrder.length - 1]}"></script>`;
const startIdx = out.indexOf(firstTag);
const endIdx = out.indexOf(lastTag) + lastTag.length;

if (startIdx < 0 || endIdx <= startIdx) {
  throw new Error('Could not locate script tag block in index.html');
}

out = out.slice(0, startIdx) + `<script>\n${bundledJs}\n</script>` + out.slice(endIdx);

const distPath = path.join(root, 'dist', 'Basements_&_Basilisks_0.22.html');
fs.mkdirSync(path.dirname(distPath), { recursive: true });
fs.writeFileSync(distPath, out, 'utf8');
console.log(`Bundled single-file HTML -> ${distPath} (${(out.length / 1024).toFixed(1)} KB)`);
