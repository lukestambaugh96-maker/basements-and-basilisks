#!/usr/bin/env node
/**
 * build-v025.mjs — Builds the self-contained playable v0.25 Act 1 prototype directly from
 * the locked testbench configs & engine (zero rules drift) + custom hero portraits.
 *
 * Outputs:
 *   - v025.html (repo root, ready for GitHub Pages)
 *   - dist/Basements_&_Basilisks_0.25.html (offline standalone bundle)
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const tb = path.join(root, 'tools', 'testbench');
const proto = path.join(root, 'prototype-v025');

const read = p => fs.readFileSync(p, 'utf8');
const readJson = p => JSON.parse(read(p));

const CFG = {
  rules: readJson(path.join(tb, 'config', 'rules.config.json')),
  heroes: readJson(path.join(tb, 'config', 'heroes.config.json')),
  enemies: readJson(path.join(tb, 'config', 'enemies.config.json')),
  items: readJson(path.join(tb, 'config', 'items.config.json')),
};

function buildPortraits() {
  const heroDir = path.join(root, 'assets', 'heroes');
  const wanted = [];
  for (const [id, h] of Object.entries(CFG.heroes.heroes)) {
    if (h.enabled === false) continue;
    const fname = id === 'laurel' ? 'mother_laurel.png' : `${id}.png`;
    const abs = path.join(heroDir, fname);
    if (fs.existsSync(abs)) wanted.push({ key: id, abs });
  }
  for (const formKey of ['arthur_form', 'dane_form', 'pillar_form', 'kaska_form']) {
    const abs = path.join(heroDir, `${formKey}.png`);
    if (fs.existsSync(abs)) wanted.push({ key: formKey, abs });
  }

  const out = {};
  try {
    const py = `
import sys, json, io, base64
from PIL import Image
entries = json.loads(sys.stdin.read())
res = []
for e in entries:
    im = Image.open(e["abs"]).convert("RGBA")
    im.thumbnail((256, 256), Image.Resampling.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, format="WEBP", quality=82, method=6)
    res.append({"key": e["key"], "uri": "data:image/webp;base64," + base64.b64encode(buf.getvalue()).decode("ascii")})
sys.stdout.write(json.dumps(res))
`;
    const encoded = JSON.parse(execFileSync('python3', ['-c', py], { input: JSON.stringify(wanted), maxBuffer: 64 * 1024 * 1024, encoding: 'utf8' }));
    for (const item of encoded) out[item.key] = item.uri;
    return { portraits: out, count: encoded.length, mode: 'webp-256' };
  } catch {
    for (const e of wanted) {
      out[e.key] = 'data:image/png;base64,' + fs.readFileSync(e.abs).toString('base64');
    }
    return { portraits: out, count: wanted.length, mode: 'png-raw' };
  }
}

const { portraits, count, mode } = buildPortraits();
const css = read(path.join(proto, 'styles.css'));

// Bundle exact locked engine + behaviour + run + UI into one clean IIFE (zero global leaks)
const engineSrc = [
  read(path.join(tb, 'engine.js')),
  read(path.join(tb, 'behaviour.js')),
  read(path.join(tb, 'run.js')),
  read(path.join(proto, 'cards-data.js')),
  read(path.join(proto, 'ui.js')),
].join('\n\n').replace(/<\/script>/gi, '<\\/script>');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Basements &amp; Basilisks v0.25 · Act 1 Playable Prototype</title>
  <meta name="description" content="Basements &amp; Basilisks v0.25 playable Act 1 (Lost Mine of Phandelver) prototype: 22 reworked heroes, 31 three-tier stat items, 6x8 tactical deployment, and Nezznar boss encounter." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Alegreya+Sans:ital,wght@0,400;0,700;0,800;1,400&family=Cinzel:wght@600;700;800&display=swap" rel="stylesheet" />
  <style>
${css}
  </style>
</head>
<body>
  <main class="app" id="app"></main>
  <script>
window.CFG = ${JSON.stringify(CFG)};
window.PORTRAITS = ${JSON.stringify(portraits)};
(function () {
${engineSrc}
})();
  </script>
</body>
</html>
`;

const rootOut = path.join(root, 'v025.html');
const distOut = path.join(root, 'dist', 'Basements_&_Basilisks_0.25.html');
fs.mkdirSync(path.dirname(distOut), { recursive: true });
fs.writeFileSync(rootOut, html, 'utf8');
fs.writeFileSync(distOut, html, 'utf8');
console.log(`Built v0.25 prototype -> ${rootOut} & ${distOut} (${(html.length / 1024).toFixed(1)} KB, ${count} portraits via ${mode})`);
