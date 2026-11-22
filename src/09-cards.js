/* ================= 0.22 HERO CARDS, 12-HERO PROCEDURAL LOOKS, ENEMY CARDS & CHANGELOG ================= */

const TIER_INK = { 1: '#4d483d', 2: '#226d3a', 3: '#12477d', 4: '#4b127d' };
const TIER_NAME = { 1: 'Tier I', 2: 'Tier II', 3: 'Tier III', 4: 'Tier IV' };
const BCOL = ['#7a1d18', '#2f5a8f', '#1f6a34', '#8a6515', '#b3260f'];
const fmt = n => Number.isInteger(n) ? n : +n.toFixed(1);

/* Tailored procedural ink-and-parchment looks for all 12 v0.22 heroes */
const LOOKS = {
  // Pack 1: You Meet at a Tavern
  arthur:   { body: 'm-avg',    pose: 'sword', shield: 'heater', hair: 'short',   beard: 'short', pauldron: true, cape: true, symbol: 'star',   col: { skin: '#e2b48c', hair: '#4a2c1a', cloth: '#6c7480', cloak: '#2c4f8f', trim: '#d6a531', accent: '#b5341f' } },
  bram:     { body: 'm-large',  pose: 'sword', shield: 'round',  hair: 'short',   beard: 'long',  pauldron: true, symbol: 'sun',               col: { skin: '#e2b48c', hair: '#8a4a22', cloth: '#e9e1cf', trim: '#b07a35', accent: '#d6a531', metal: '#c9a24a' } },
  faelan:   { body: 'f-svelte', pose: 'bow',   head: 'none',     hair: 'long',    symbol: 'moon', place: 'tabard', cape: true,                 col: { skin: '#f1d3b3', hair: '#d9d4c8', cloth: '#2c4f8f', cloak: '#3f7f6b', trim: '#d6a531', accent: '#8fb4e6' } },
  wallaby:  { body: 'm-svelte', pose: 'sword', shield: 'round',  head: 'hood',    cape: true,                                                  col: { skin: '#e2b48c', hair: '#4a2c1a', cloth: '#2a2420', cloak: '#4b3a6b', trim: '#d6a531', leather: '#5a3d26' } },
  // Pack 2: Around the Campfire
  dane:     { body: 'm-large',  pose: 'sword', shield: 'heater', head: 'helm',    symbol: 'sun',  pauldron: true, cape: true,                  col: { skin: '#e2b48c', cloth: '#e9e1cf', cloak: '#b5341f', trim: '#d6a531', metal: '#c9a24a', accent: '#d6a531' } },
  lorcan:   { body: 'm-svelte', pose: 'bow',   head: 'hood',     hair: 'short',   cape: true,                                                  col: { skin: '#c68b5e', hair: '#1f1a17', cloth: '#5d6e2f', cloak: '#3f7f6b', trim: '#b07a35', leather: '#5a3d26' } },
  juniper:  { body: 'f-avg',    pose: 'bow',   hair: 'topknot',  symbol: 'moon',  place: 'tabard', cape: true,                                 col: { skin: '#e2b48c', hair: '#c9562a', cloth: '#5d6e2f', cloak: '#5a3d26', trim: '#7d8a5a', accent: '#6da670' } },
  rosalind: { body: 'f-avg',    pose: 'bow',   hair: 'long',     symbol: 'star',  place: 'tabard', cape: true,                                 col: { skin: '#f1d3b3', hair: '#d8b46a', cloth: '#8e2a3b', cloak: '#2c4f8f', trim: '#d6a531', accent: '#ffd76a' } },
  // Pack 3: Off the Beaten Path
  cinder:   { body: 'f-svelte', pose: 'bow',   hair: 'long',     symbol: 'star',  place: 'tabard', cape: true,                                 col: { skin: '#b5341f', hair: '#1f1a17', cloth: '#2a2420', cloak: '#8e2a3b', trim: '#c96f2d', accent: '#ff9c4a' } },
  zark:     { body: 'm-large',  pose: 'sword', shield: 'round',  hair: 'topknot', pauldron: true,                                              col: { skin: '#7d8a5a', hair: '#1f1a17', cloth: '#5a3d26', trim: '#b5341f', leather: '#4a2c1a', metal: '#5d636b' } },
  naill:         { body: 'm-svelte', pose: 'sword', shield: 'round',  hair: 'topknot',                                                              col: { skin: '#c68b5e', hair: '#4a2c1a', cloth: '#3f7f6b', trim: '#d6a531', leather: '#6b4a2c', accent: '#8fd8d8' } },
  nettle:        { body: 'f-svelte', pose: 'bow',   head: 'hood',     hair: 'long',    symbol: 'skull', place: 'tabard', cape: true,                col: { skin: '#e2b48c', hair: '#1f1a17', cloth: '#4b3a6b', cloak: '#2a2420', trim: '#c96f2d', accent: '#c48fe6' } },
  // Pack 4: Divine Intervention
  pillar:        { body: 'm-large',  pose: 'sword', shield: 'heater', hair: 'none',    pauldron: true,  symbol: 'sun',                              col: { skin: '#b5b8be', hair: '#4d5056', cloth: '#7d828a', trim: '#d6a531', metal: '#c9a24a', accent: '#ffe9a0' } },
  mother_laurel: { body: 'f-avg',    pose: 'sword', shield: 'round',  hair: 'long',    symbol: 'moon',  place: 'tabard', cape: true,                col: { skin: '#e6c5a3', hair: '#6b8e3e', cloth: '#3f6a3c', cloak: '#5d6e2f', trim: '#d6a531', accent: '#8fe0a0' } },
  lumen:         { body: 'f-svelte', pose: 'bow',   hair: 'long',     symbol: 'sun',   place: 'tabard', cape: true,                                 col: { skin: '#f5dfc4', hair: '#f0d882', cloth: '#e9e1cf', cloak: '#c9a24a', trim: '#d6a531', accent: '#ffe9a0' } },
  jamison:       { body: 'm-avg',    pose: 'sword', shield: 'round',  hair: 'short',   beard: 'short',  symbol: 'sun',   place: 'tabard',           col: { skin: '#d9a982', hair: '#7a5a3a', cloth: '#e9e1cf', trim: '#b07a35', accent: '#ffe9a0' } },
  // Pack 5: Cornering the Market
  zoe:           { body: 'f-avg',    pose: 'sword', shield: 'round',  hair: 'topknot', pauldron: true,                                              col: { skin: '#e2b48c', hair: '#8f3a2a', cloth: '#6b4a2c', trim: '#c96f2d', metal: '#8a929c', accent: '#ffd76a' } },
  toot:          { body: 'm-avg',    pose: 'bow',   hair: 'none',     symbol: 'star',  place: 'tabard',                                             col: { skin: '#68b4a8', cloth: '#8e2a3b', trim: '#d6a531', accent: '#ffd76a' } },
  gilthrax:      { body: 'm-large',  pose: 'sword', shield: 'heater', head: 'helm',    pauldron: true,  cape: true,                                 col: { skin: '#d6a531', cloth: '#8f1d14', cloak: '#4a2c10', trim: '#ffe9a0', metal: '#d6a531', accent: '#8fb4e6' } },
  gains:         { body: 'm-svelte', pose: 'bow',   hair: 'short',    symbol: 'star',  place: 'tabard', cape: true,                                 col: { skin: '#a8342a', hair: '#1f1a17', cloth: '#2c4f8f', cloak: '#4b3a6b', trim: '#d6a531', accent: '#ffd76a' } },
  // Pack 6: Surprise Round
  velith:        { body: 'f-svelte', pose: 'sword', shield: 'round',  head: 'hood',    hair: 'long',    cape: true,                                 col: { skin: '#6a5a7a', hair: '#e8e8f0', cloth: '#1f1a24', cloak: '#3a2450', trim: '#9be38a', accent: '#c48fe6' } },
  corvin:        { body: 'm-svelte', pose: 'sword', shield: 'round',  head: 'hood',    hair: 'short',   cape: true,                                 col: { skin: '#d4a27c', hair: '#2a201c', cloth: '#2a303a', cloak: '#1a1e26', trim: '#9fd86a', accent: '#c48fe6' } },
  saint:         { body: 'm-avg',    pose: 'bow',   hair: 'short',    symbol: 'moon',  place: 'tabard', cape: true,                                 col: { skin: '#e6c5a3', hair: '#3a2c24', cloth: '#4b3a6b', cloak: '#2a1c3a', trim: '#d6a531', accent: '#c48fe6' } },
  kaska:         { body: 'f-large',  pose: 'sword', shield: 'round',  hair: 'topknot', pauldron: true,  cape: true,                                 col: { skin: '#7d8a5a', hair: '#2a221c', cloth: '#3f5a3c', cloak: '#2a2420', trim: '#8fd0ff', accent: '#8fd0ff' } }
};
const LOOK_BASE = { body: 'm-avg', pose: 'sword', shield: 'heater', head: 'none', hair: 'short', beard: 'none', symbol: 'none', place: 'shield', cape: false, pauldron: false, col: { skin: '#d9a982', hair: '#4a2c1a', cloth: '#2c4f8f', cloak: '#2a2420', trim: '#b5341f', metal: '#a9aeb3', leather: '#6b4a2c', accent: '#d6a531' } };

const CAST = [...HERO_ORDER];
const DRAFT = {};
const nameOf = k => H[k] ? H[k].name : k;
const roleOf = k => H[k] ? H[k].role : 'Damage';

const ART = {}, SET = {};
let CUR = CAST[0], TIER = 1;
const PATH = {};
const defSet = () => ({ mode: 'multiply', tol: 28, cz: 1, cx: 0, cy: 0, iz: 1, ix: 0, iy: 0 });
const pathOf = k => H[k] ? (PATH[k] || H[k].paths[0].k) : null;

function placeholderCanvas(k) {
  const L = LOOKS[k] || {};
  const sp = { ...LOOK_BASE, ...L, col: { ...LOOK_BASE.col, ...(L.col || {}) } };
  const s = 3, c = document.createElement('canvas'); c.width = 280 * s; c.height = 300 * s;
  const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height); g.scale(s, s);
  drawFigure(g, sp);
  return c;
}
function analyse(src) {
  const w = src.width, h = src.height, d = src.getContext('2d').getImageData(0, 0, w, h).data;
  let x0 = w, x1 = 0, y0 = h, y1 = 0; const st = Math.max(1, Math.round(Math.max(w, h) / 700));
  const ink = i => d[i + 3] > 40 && (765 - (d[i] + d[i + 1] + d[i + 2])) > 66;
  for (let y = 0; y < h; y += st) for (let x = 0; x < w; x += st) { if (ink((y * w + x) * 4)) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; } }
  if (x1 < x0) { x0 = 0; y0 = 0; x1 = w; y1 = h; }
  const H_ = y1 - y0, mean = (ya, yb, xa, xb) => { let s = 0, n = 0; for (let y = ya; y < yb; y += st) for (let x = Math.max(0, Math.round(xa)); x <= Math.min(w - 1, xb); x += st) if (ink((Math.round(y) * w + x) * 4)) { s += x; n++; } return n ? s / n : null; };
  const bx = mean(y0 + H_ * .6, y0 + H_ * .92, x0, x1) ?? (x0 + x1) / 2, hw = Math.max(3, H_ * .035); let ht = y0;
  const rowInk = y => { for (let x = Math.max(0, Math.round(bx - hw)); x <= Math.min(w - 1, bx + hw); x += st) if (ink((Math.round(y) * w + x) * 4)) return true; return false; };
  const run = H_ * .12; let found = false;
  find: for (let y = y0; y < y0 + H_ * .5; y += st) { if (!rowInk(y)) continue; for (let z = y; z < y + run; z += st) if (!rowInk(z)) continue find; ht = y; found = true; break; }
  if (!found) for (let y = y0; y < y0 + H_ * .5; y += st) if (rowInk(y)) { ht = y; break; }
  const hx = mean(ht, ht + H_ * .07, bx - H_ * .06, bx + H_ * .06) ?? bx;
  return { w, h, x0, x1, y0, y1, hx, ht };
}
function keyed(src, tol) {
  const w = src.width, h = src.height, c = document.createElement('canvas'); c.width = w; c.height = h;
  const g = c.getContext('2d'); g.drawImage(src, 0, 0);
  const im = g.getImageData(0, 0, w, h), d = im.data, seen = new Uint8Array(w * h), stack = [];
  const near = i => Math.max(255 - d[i * 4], 255 - d[i * 4 + 1], 255 - d[i * 4 + 2]);
  for (let x = 0; x < w; x++) stack.push(x, (h - 1) * w + x);
  for (let y = 0; y < h; y++) stack.push(y * w, y * w + w - 1);
  const T = tol * 2.2;
  while (stack.length) {
    const p = stack.pop(); if (seen[p]) continue; seen[p] = 1; const m = near(p); if (m > T) continue;
    d[p * 4 + 3] = m < T * .55 ? 0 : Math.round(255 * (m - T * .55) / (T * .45));
    const x = p % w, y = (p / w) | 0;
    if (x > 0) stack.push(p - 1); if (x < w - 1) stack.push(p + 1); if (y > 0) stack.push(p - w); if (y < h - 1) stack.push(p + w);
  }
  g.putImageData(im, 0, 0); return c;
}
function artFor(k) {
  if (!ART[k]) { const src = placeholderCanvas(k); ART[k] = { src, an: analyse(src), user: false }; }
  if (!SET[k]) SET[k] = defSet(); const A = ART[k], S = SET[k];
  if (S.mode === 'key' && (!A.keyed || A.keyTol !== S.tol)) { A.keyed = keyed(A.src, S.tol); A.keyTol = S.tol; }
  return A;
}
function drawSrc(g, A, S, sx, sy, sw, sh, dx, dy, dw, dh) { g.save(); if (S.mode === 'multiply') g.globalCompositeOperation = 'multiply'; g.drawImage(S.mode === 'key' ? A.keyed : A.src, sx, sy, sw, sh, dx, dy, dw, dh); g.restore(); }
function vellum(g, x, y, w, h, tone = '#efe3c6') { g.fillStyle = tone; g.fillRect(x, y, w, h); const gr = g.createRadialGradient(x + w * .45, y + h * .4, w * .1, x + w * .5, y + h * .5, Math.max(w, h) * .75); gr.addColorStop(0, 'rgba(255,250,235,.35)'); gr.addColorStop(1, 'rgba(120,90,40,.16)'); g.fillStyle = gr; g.fillRect(x, y, w, h); }
function prepC(c, w, h) { const d = Math.min(2, window.devicePixelRatio || 1); c.width = Math.round(w * d); c.height = Math.round(h * d); c.style.width = w + 'px'; c.style.aspectRatio = w + '/' + h; const g = c.getContext('2d'); g.setTransform(d, 0, 0, d, 0, 0); return g; }
const _CUSTOM_ART_CACHE = {};
function keyedCustomArt(cat, key) {
  const img = typeof getCustomImage === 'function' ? getCustomImage(cat, key) : null;
  if (!img) return null;
  const ck = cat + ':' + key;
  if (_CUSTOM_ART_CACHE[ck] && _CUSTOM_ART_CACHE[ck].srcImg === img) return _CUSTOM_ART_CACHE[ck];
  const maxDim = 512;
  const sc = Math.min(1, maxDim / Math.max(img.naturalWidth, img.naturalHeight));
  const w = Math.max(1, Math.round(img.naturalWidth * sc)), h = Math.max(1, Math.round(img.naturalHeight * sc));
  const raw = document.createElement('canvas'); raw.width = w; raw.height = h;
  const rg = raw.getContext('2d'); rg.drawImage(img, 0, 0, w, h);
  // Auto-strip pure white studio background via border flood-fill while keeping interior whites opaque!
  const kCanvas = keyed(raw, 16);
  const an = analyse(raw);
  return (_CUSTOM_ART_CACHE[ck] = { srcImg: img, canvas: kCanvas, an, w, h });
}
function drawContainCustom(g, C, W, H_) {
  const bw = Math.max(1, C.an.x1 - C.an.x0), bh = Math.max(1, C.an.y1 - C.an.y0);
  const pad = 0.90;
  const s = Math.min((W * pad) / bw, (H_ * pad) / bh);
  const dx = (W - bw * s) / 2 - C.an.x0 * s;
  const dy = (H_ - bh * s) / 2 - C.an.y0 * s;
  g.drawImage(C.canvas, 0, 0, C.w, C.h, dx, dy, C.w * s, C.h * s);
}
function drawTokenCustom(g, C, D, fullBody) {
  if (fullBody) { drawContainCustom(g, C, D, D); return; }
  const a = C.an, bw = Math.max(1, a.x1 - a.x0), bh = Math.max(1, a.y1 - a.y0);
  // Frame upper torso + head nicely inside circular battle tokens
  const side = Math.max(bh * 0.54, bw * 0.56);
  const cx = a.hx ?? (a.x0 + a.x1) / 2;
  const cy = (a.ht ?? a.y0) + side * 0.42;
  const sx = Math.max(0, Math.min(C.w - side, cx - side / 2));
  const sy = Math.max(0, Math.min(C.h - side, cy - side / 2));
  g.drawImage(C.canvas, sx, sy, Math.min(side, C.w), Math.min(side, C.h), 0, 0, D, D);
}
function drawSplash(c, k, W, H_) {
  const g = prepC(c, W, H_);
  const C = keyedCustomArt(c.dataset && c.dataset.form ? 'forms' : 'heroes', (c.dataset && c.dataset.form) || k);
  if (C) { vellum(g, 0, 0, W, H_); drawContainCustom(g, C, W, H_); return; }
  const A = artFor(k), S = SET[k], a = A.an; vellum(g, 0, 0, W, H_); const s = (H_ * .86 * S.cz) / (a.y1 - a.y0), cx = (a.x0 + a.x1) / 2, dx = W / 2 - cx * s + S.cx * W, dy = H_ * .95 - a.y1 * s + S.cy * H_; g.save(); g.beginPath(); g.rect(0, 0, W, H_); g.clip(); drawSrc(g, A, S, 0, 0, a.w, a.h, dx, dy, a.w * s, a.h * s); g.restore();
}
function drawBust(c, k, W, H_) {
  const g = prepC(c, W, H_);
  const C = keyedCustomArt('heroes', k);
  if (C) { vellum(g, 0, 0, W, H_); drawTokenCustom(g, C, W, false); return; }
  const A = artFor(k), S = SET[k], a = A.an; vellum(g, 0, 0, W, H_); const side = (a.y1 - (a.ht ?? a.y0)) * .5 / S.iz, cx = a.hx + S.ix * side * .68, cy = (a.ht ?? a.y0) + side * .42 + S.iy * side * .68; drawSrc(g, A, S, cx - side / 2, cy - side * .42, side, side * H_ / W, 0, 0, W, H_);
}
function iconCanvas(k, D, opts = {}) { const c = document.createElement('canvas'); const d = Math.min(2, window.devicePixelRatio || 1); c.width = Math.round(D * d); c.height = Math.round(D * d); c.style.width = D + 'px'; const g = c.getContext('2d'); g.scale(d, d); drawIcon(g, k, D, opts); return c; }
function drawIcon(g, k, D, opts = {}) {
  const rc = ROLE_COL[roleOf(k)], ring = Math.max(1.5, D * .07);
  const C = keyedCustomArt(opts.form ? 'forms' : 'heroes', opts.form || k);
  g.save(); g.beginPath(); g.arc(D / 2, D / 2, D / 2 - ring * .5, 0, 7); g.clip();
  vellum(g, 0, 0, D, D, '#e6d6ad');
  if (C) { drawTokenCustom(g, C, D, !!opts.fullBody); }
  else { const A = artFor(k), S = SET[k], a = A.an, side = (a.y1 - (a.ht ?? a.y0)) * .34 / S.iz, cx = a.hx + S.ix * side, cy = (a.ht ?? a.y0) + side * .48 + S.iy * side; drawSrc(g, A, S, cx - side / 2, cy - side / 2, side, side, 0, 0, D, D); }
  g.restore(); g.lineWidth = ring; g.strokeStyle = rc; g.beginPath(); g.arc(D / 2, D / 2, D / 2 - ring * .85, 0, 7); g.stroke(); g.lineWidth = Math.max(1, ring * .35); g.strokeStyle = '#2a1c12'; g.beginPath(); g.arc(D / 2, D / 2, D / 2 - g.lineWidth / 2, 0, 7); g.stroke();
}

/* ---------- Live Engine Numbers & Six-Attribute v0.22 Tooltips ---------- */
function numbers(k, t, cfg) {
  const d = H[k]; if (!d) return null;
  const st = heroStats(cfg || { key: k, tier: t, die: 'd20', path: t >= 2 ? pathOf(k) : undefined });
  const A = st.atk || d.atk; const hits = A.hits || 1, ab = atkBonus(st, d);
  const nDice = A.d[0] * (st.tier || 1);
  const avg = ((A.d[1] + 1) / 2 * nDice + (A.flat || 0) + ab) * (A.mul || 1) * (A.heals ? 1 : st.atM || 1);
  const rawEvery = 100 / (st.cr + (st.trig === 'striking' ? st.pa * (st.chgX || 1) / st.iv : 0));
  const every = Math.max(MIN_CAST_INTERVAL, rawEvery);
  return { d, st, hits, avg, every, odds: bandOdds(d, st) };
}

const statTile = (ic, label, val, sub, kwk) => `<div class="st" title="${esc(label)}">${kwk ? `<span class="kw" tabindex="0" role="button" data-kw="${kwk}">${icon(ic, 15)}</span>` : icon(ic, 15)}<b>${val}</b><span>${esc(sub || label)}</span></div>`;
function statTiles(N, full) {
  const { d, st, hits, avg, every } = N;
  if (full === 'extra') {
    const ev = st.evasion > 0 ? [statTile('evasion', 'Evasion', `${Math.round(st.evasion * 100)}%`, 'evasion', 'evasion')] : [];
    return [statTile('abil', 'Ability cadence', `~${fmt(every)}s`, 'ability', 'ability'), statTile('speed', 'Speed', d.ft, 'ft', 'speed'), statTile('regen', 'Regeneration', fmt(st.regen) + '/s', 'regen', 'regen'), ...ev].join('');
  }
  const rad = d.atk.kind === 'radiant' || d.atk.kind === 'holy';
  const dmg = statTile('dmg', 'Damage per attack', d.atk.d[0] === 0 ? '0' : `${hits > 1 ? hits + '×' : ''}${Math.round(avg)}`, d.atk.kind === 'magic' ? 'magic' : rad ? 'Radiant' : 'physical', d.atk.kind === 'magic' ? 'magic' : rad ? 'radiant' : 'physical');
  const base = [
    statTile('hp', 'HP', st.maxHp, st.sz > 1 ? 'HP (2×2)' : 'HP', 'HP'),
    statTile('ac', 'AC', st.ac, 'AC', 'AC'),
    statTile('sr', 'SR', st.sr, 'SR', 'SR'),
    dmg,
    statTile('rate', 'Attack interval', fmt(st.iv) + 's', 'attack'),
    st.evasion > 0
      ? statTile('evasion', 'Evasion', `${Math.round(st.evasion * 100)}%`, 'evasion', 'evasion')
      : statTile('range', 'Range', d.rng, d.reach === 'Melee' ? 'melee' : 'range', 'melee')
  ];
  return base.join('');
}

const ATTR_S2 = { str: 'STR', dex: 'DEX', con: 'CON', int: 'INT', wis: 'WIS', cha: 'CHA' };
const sgn = v => (v >= 0 ? '+' : '') + v;

function attrTip(a, d, st) {
  const m = st.m[a], w = st.w === a, k = st.k === a, L = [];
  if (w) L.push(`Weapon attribute: ${sgn(m)} to basic attacks.`);
  if (k) L.push(`Key attribute: ${sgn(m)} to ability d20 roll, High-roll scaling (+${Math.floor(Math.max(0, m) / 2)}), and ability/heal/Ward potency.`);
  if (a === 'str') L.push(`${d.rng <= 2 ? `Ignores ${Math.max(0, m)} enemy AC (Armor Penetration). ` : ''}${m >= 3 && d.rng <= 2 ? 'Intercepts leaping Chargers and resists pushes.' : 'At +3, melee heroes Intercept Chargers.'}`);
  if (a === 'dex') L.push(`${sgn((w ? 6 : 4) * m)}% Attack Speed and ${sgn(m)} AC.`);
  if (a === 'con') L.push(`${sgn(Math.round(18 * m * Math.pow(TIERX.hp, st.tier - 1)))} Max HP, faster regen, and ${Math.max(0, m * 10)}% Poison resistance.`);
  if (a === 'int') L.push(`+${Math.max(0, m) * 10}% Charge Speed (cast cadence, global cap 1/sec).`);
  if (a === 'wis') L.push(`${sgn(m)} Spell Resistance and minimum natural d20 roll floor of ${Math.min(10, 1 + Math.max(0, m))} (no rolls below this).`);
  if (a === 'cha') L.push(`Commanding Presence: +${Math.max(0, m) * 8}% potency & duration on buffs, debuffs, Inspiration, and Wards; ${Math.max(0, m * 10)}% faster stun/root recovery.`);
  return L.join(' ');
}

function attrRow(d, st, cfg) {
  const it = cfg && cfg.items && cfg.items.length ? combineItems(cfg.items) : null;
  const ia = (it && it.a) || {};
  return `<div class="attrs6">${ATTRS.map(a => {
    const m = st.m[a], tag = st.w === a && st.k === a ? 'weapon · key' : st.w === a ? 'weapon' : st.k === a ? 'key' : '';
    return `<span class="kw a6${tag ? ' pr' : ''}" style="--ac:${ATTR_COL[a]}" tabindex="0" role="button" data-tn="${ATTR_N[a]} ${sgn(m)}" data-tip="${esc(attrTip(a, d, st))}"><i>${ATTR_S2[a]}</i><b>${sgn(m)}</b>${ia[a] ? `<em>+${ia[a] / 2}</em>` : ''}${tag ? `<u>${tag}</u>` : ''}</span>`;
  }).join('')}</div>`;
}

const r1 = x => Math.round(x), fx2 = x => +x.toFixed(2);
function mathSpan(txt, attr, title, tip) { return `<span class="kw amath" style="--ac:${ATTR_COL[attr] || '#6b5a44'}" tabindex="0" role="button" data-tn="${esc(title)}" data-tip="${esc(tip)}">${txt}</span>`; }
function atkMath(d, st) {
  const A = st.atk || d.atk;
  if (A.d[0] === 0) return mathSpan('0 dmg', st.k, A.n, 'Performs in place for a chance to pop +1 Gold.');
  const bon = atkBonus(st, d), fl = A.flat || 0, tier = st.tier || 1;
  const nDice = A.d[0] * tier;
  const a = st.w;
  const k = (st.atM || 1) * (A.mul || 1);
  return mathSpan(
    `${nDice}d${A.d[1]}${fl + bon ? sgn(fl + bon) : ''}${k !== 1 ? `<small> ×${fx2(k)}</small>` : ''}`,
    a, `${A.n}`,
    `Base ${A.d[0]}d${A.d[1]} × ${TIER_NAME[tier]} (${nDice}d${A.d[1]}) + ${ATTR_N[a]} & items (${sgn(bon)})${fl ? ` + weapon (+${fl})` : ''}.`
  );
}
function annotateDice(html, d, st) {
  const tier = st.tier || 1;
  return html.replace(/(\d+)d(\d+)(\s+(Radiant|Holy|fire|necrotic|radiant|thunder|cold|lightning|force|poison|piercing|slashing|bludgeoning|Nature|Arcane|Ward))?/g, (m, n, f, _t, ty) => {
    if (f === '20') return m;
    const scaled = Number(n) * tier;
    const rad = ty === 'Radiant' || ty === 'Holy' || ty === 'radiant';
    const label = `${scaled}d${f}${ty ? ' ' + ty : ''}`;
    const tip = rad
      ? `Base ${n}d${f} × ${TIER_NAME[tier]} (${scaled}d${f}). Radiant ignores AC and SR.`
      : `Base ${n}d${f} × ${TIER_NAME[tier]} (${scaled}d${f}), plus ${ATTR_N[st.k]} (${sgn(st.mk)}).`;
    return mathSpan(label, rad ? null : st.k, `${st.abil.n}`, tip);
  });
}

function largeCard(k, t, opts = {}) {
  const seen = new Set(), G = s => glossarize(s, seen);
  const N = numbers(k, t, opts.cfg), { d, st, hits, odds } = N, L = st.bands.low, Hb = st.bands.hi;
  const hObj = opts.heroObj;
  // Strict Progressive Disclosure: only display Specialization if chosen (or explicitly previewed)
  const cp = opts.previewPath || (opts.cfg && opts.cfg.path) || (hObj && hObj.path) || null;
  const A = st.atk || d.atk;
  const isRad = A.kind === 'radiant' || A.kind === 'holy';
  const atkKind = A.kind === 'phys' ? 'physical' : isRad ? 'Radiant' : 'magic';
  const atkLine = `${A.n}: §ATK§ ${A.d[0] === 0 ? '(chance to pop +1 Gold)' : (A.ty || atkKind)}${hits > 1 ? ` ×${hits}` : ''} every ${fmt(st.iv)}s`;
  const pct = x => Math.round(x * 100);
  const bandRow = (i, lab, range, txt) => `<div class="band b${i}"><span class="bn">${i === 0 ? kw('fizzle', lab) : i === 4 ? kw('nat20', lab) : kw('band', lab)}<i>${range}</i></span><span>${annotateDice(G(txt), d, st)}</span></div>`;
  const AB = st.abil || d.abil, role = st.role || d.role, TG = TRIG[st.trig];

  // Strict Progressive Disclosure: Quest only appears once accepted at a Quest Board (or completed)
  const q = d.quest;
  const qActive = !!(hObj && (hObj.questActive || hObj.questDone)) || !!(opts.cfg && (opts.cfg.questActive || opts.cfg.questDone));
  const qProg = hObj ? (hObj.questProg || 0) : 0;
  const qDone = !!(hObj && hObj.questDone) || !!(opts.cfg && opts.cfg.questDone);
  const questHTML = (q && qActive)
    ? `<div class="qcard${qDone ? ' done' : ''}"><div class="qhead"><b>Quest · ${esc(q.rewardName)}</b><span>${qDone ? 'COMPLETE ★' : `${Math.round(qProg)} / ${q.goal}`}</span></div><div class="qgoal">${esc(q.label)}</div><div class="qrew">${G(q.rewardDesc)}</div></div>`
    : '';

  // Strict Progressive Disclosure: Tier II Specialization only shown once chosen or previewed
  const chosenSpec = cp ? d.paths.find(p => p.k === cp) : null;
  const specHTML = chosenSpec
    ? `<div class="specbox"><span class="lbl">${kw('spec', 'Tier II Specialization')}</span><div class="specline"><b>${esc(chosenSpec.n)}</b>${chosenSpec.attr ? ` <span class="grow" style="--ac:${ATTR_COL[chosenSpec.attr]}">+1 ${ATTR_S2[chosenSpec.attr]}</span>` : ''} — ${G(chosenSpec.x)}</div></div>`
    : '';

  // Strict Progressive Disclosure: Tier IV Epic Boon only shown once chosen
  const boonKey = (hObj && hObj.boon) || (opts.cfg && opts.cfg.boon) || null;
  const boonObj = boonKey && EPIC_BOONS[boonKey];
  const boonHTML = boonObj
    ? `<div class="boonbox"><span class="lbl">${kw('boon', 'Tier IV Epic Boon')}</span><div class="specline"><b>${esc(boonObj.n)}</b> — ${G(boonObj.x)}</div></div>`
    : '';

  // Strict Progressive Disclosure: Multiclass Dip only shown once acquired
  const mcKey = (hObj && hObj.multiclass) || (opts.cfg && opts.cfg.multiclass) || null;
  const mcObj = mcKey && MULTICLASS[mcKey];
  const mcHTML = mcObj
    ? `<div class="mcbox"><span class="lbl">${kw('multiclass', `Multiclass · ${mcObj.cls}`)}</span><div class="specline">${classKwPill(mcObj.kw, false)} ${G(mcObj.x)}</div></div>`
    : '';

  const formMap = { dane: 'dane_form', arthur: 'arthur_form', pillar: 'pillar_form', jamison: 'jamison_quest', saint: 'saint_quest' };
  const activeForm = qDone && formMap[k] ? formMap[k] : '';
  const ckwPills = (d.ckw || []).map(e => classKwPill(e.k, false, e.sub)).join('') + (mcObj ? classKwPill(mcObj.kw, false, 'Multiclass') : '');
  return `<div class="hcard lg c13" style="--tc:${TIER_INK[t]};--rc:${ROLE_COL[role]}">
   <div class="ribbon">${kw('tier', TIER_NAME[t])}</div>
   <div class="chead"><div><h2 class="cname">${esc(d.name)}</h2><div class="ctitle">${esc(d.title)}${mcObj ? ` / ${esc(mcObj.cls)}` : ''}</div>${ckwPills ? `<div class="cckw">${ckwPills}</div>` : ''}</div><span class="rolechip">${role}</span></div>
   <div class="splash"><canvas data-splash="${k}"${activeForm ? ` data-form="${activeForm}"` : ''}></canvas><div class="reach">${G(d.reach)} · ${st.sz > 1 ? 'Large 2×2 · ' : ''}${d.ft > 0 ? G(d.ft + ' ft') : 'Stationary'}</div></div>
   ${glanceHTML(k, cp, G)}
   <div class="stats">${statTiles(N, false)}</div>
   ${attrRow(d, st, opts.cfg)}
   <div class="atk"><span class="lbl">Attack</span> ${G(atkLine).replace('§ATK§', atkMath(d, st))}</div>
   <details class="abil"><summary><span class="ah"><b>${esc(AB.n)}</b><span class="lbl">${kw('ability', 'Ability')} · ~${fmt(N.every)}s · ${kw('trig-' + st.trig, TG.n)} · floor ${st.d20Floor}</span></span>
     <span class="odds">${odds.map((x, i) => x > 0 ? `<i style="flex:${x};background:${BCOL[i]}" title="${pct(x)}%">${pct(x) >= 8 ? pct(x) + '%' : ''}</i>` : '').join('')}</span><span class="more">${kw('key-attr', 'd20' + sgn(st.rb || 0))} ▾</span></summary>
    ${bandRow(0, 'Fizzle', 'natural 1', 'Nothing happens; half Charge comes back.')}${bandRow(1, 'Low', `${L} or less`, AB.b[0])}${bandRow(2, 'Mid', `${L + 1}–${Hb - 1}`, AB.b[1])}${bandRow(3, 'High', `${Hb}+`, AB.b[2])}${bandRow(4, 'Natural 20', 'natural 20', AB.b[3])}</details>
   ${specHTML}${boonHTML}${mcHTML}${questHTML}
   <details class="moreinfo"><summary>More about ${esc(d.name)} ▾</summary><div class="stats">${statTiles(N, 'extra')}</div><p class="bio">${esc(d.bio)}</p></details>
   ${opts.items || ''}${opts.foot || ''}
  </div>`;
}

function paintCanvases(root) {
  root.querySelectorAll('canvas[data-splash]').forEach(c => drawSplash(c, c.dataset.splash, 356, 320));
  root.querySelectorAll('canvas[data-bust]').forEach(c => drawBust(c, c.dataset.bust, 96, 120));
}
function loadSaved() { return Promise.resolve(); }

/* ---------- Enemy Cards ---------- */
const E_ABIL = {
  shaman: ['Heals the most-hurt ally 2d6+4.', 'Heals allies within 3 squares 2d6+4.', 'Heals allies within 3 squares 3d6+4.', 'Heals every ally 4d6+4.'],
  ripper: ['2d6 and stuns 0.8s.', '3d6 and stuns 1.2s.', '4d6 and stuns 1.8s.', '6d6 and stuns 2.5s.'],
  captain: ['Allies within 2 squares: +2 AC for 4s.', '+2 AC for 6s.', '+3 AC for 8s.', '+3 AC for 10s and 20 Ward.'],
  ogre: ['2d8 and pushes 1 square.', '3d8 and pushes 2 squares.', '4d8 and pushes 2 squares.', '6d8, pushes 3 squares, and stuns 1.5s.'],
  chief: ['2d12 to target.', '3d12.', '4d12.', '6d12, and every ally gains 40 Charge.'],
  klarg: ['3d8 smash.', '4d8 smash.', '5d8 smash and stuns 1.2s.', '7d8 smash, stuns, and hastes allies!'],
  glasstaff: ['Arcane Ward + Hold Person root.', 'Arcane Ward + 4d6 Lightning line.', 'Strong Ward + 5d6 Lightning + Root.', 'Heavy Ward + 7d6 Lightning + Stun!'],
  flameskull: ['2d6 fire AoE.', '3d6 fire AoE.', '5d6 fire AoE.', '7d6 wide fire AoE.'],
  owlbear: ['2d8 to target.', '3d8 and stuns 0.8s.', '4d8 and stuns 1.2s.', '6d8 and stuns 2s.'],
  nezznar: ['2d8 necrotic + 6 necrosis + root.', '2d8 + 8 necrosis AoE.', '3d8 + 12 necrosis AoE.', 'Calls the Brood: summons two Giant Spiders.'],
  venomfang: ['2d8 Poison Breath cone.', '3d8 Poison Breath cone.', '4d8 Poison Breath + Wing Buffet knockback.', '5d8 wide Poison Breath + knockback!'],
  adept: ['Fireball 2d6 AoE.', 'Fireball 3d6 AoE.', 'Fireball 4d6 AoE.', 'Fireball 6d6 wide AoE.'],
  necromancer: ['10 necrosis on target.', '14 necrosis on target.', '16 necrosis AoE.', 'Raises every fallen zombie at half HP.'],
  kelpie: ['2d6 psychic + Root.', '2d6 psychic + Root.', '3d6 psychic + Root & Charm.', '4d6 psychic + Root & Charm.'],
  flesh_golem: ['2d8 cleave.', '3d8 cleave.', '4d8 cleave.', '5d8 cleave + Stun 1.5s.'],
  ctenmiir: ['3d8 necrotic + 6 necrosis & heals.', '4d8 + 8 necrosis & heals.', '5d8 + 12 necrosis & heals.', '6d8 + 16 necrosis & heals.'],
  efreeti: ['3d6 fire + Burn AoE.', '4d6 fire + Burn AoE.', '5d6 fire + Burn AoE.', '7d6 wide fire + Burn AoE.'],
  chain_golem: ['2d8 slashing + Root 2.5s.', '3d8 + Root.', '4d8 + Root.', '5d8 + Roots up to 4 heroes.'],
  ogre_mage: ['3d6 cold cone + Stagger + heal.', '4d6 cold cone + Stagger + heal.', '5d6 cold cone + Stagger + heal.', '6d6 cold cone + Stagger + heal.'],
  keraptis: ['Arcane Ward + 2d6 Elemental Nova.', 'Arcane Ward + 3d6 Nova.', 'Strong Ward + 4d6 Frost Nova.', 'Massive Ward + 5d6 Nova + summons Gargoyle!'],
  blackrazor_wielder: ['3d8 + 6 necrosis + Ward.', '4d8 + 8 necrosis + Ward.', '5d8 + 12 necrosis + Ward.', '7d8 + 16 necrosis + Ward + Haste!'],
  gynosphinx: ['2d6 Roar + Charge drain.', '3d6 Roar + Charge drain.', '4d6 Roar + Stagger + Temporal cleanse/heal.', '5d6 Roar + Stun + Temporal cleanse/heal!'],
  giant_crab: ['2d6 Boiling Splash + Root.', '3d6 Boiling Splash + Root.', '4d6 Boiling Splash + Root.', '6d6 wide Boiling Splash + Root!'],
  cambion: ['2d6 fire ray.', '3d6 fire ray.', '4d6 fire ray + Charm.', '5d6 fire ray + Charm.'],
  chain_devil: ['2d6 chains + Root.', '3d6 + Root.', '4d6 + Root.', '5d6 + Roots 3 heroes.'],
  erinyes: ['3d8 venomous volley.', '4d8 venomous volley.', '5d8 venomous volley.', '6d8 venomous volley at 3 heroes.'],
  horned_devil: ['3d6 Hurl Flame + Burn.', '4d6 Hurl Flame + Burn.', '5d6 Hurl Flame + Burn.', '7d6 Hurl Flame + Burn.'],
  ice_devil: ['3d6 frost cone + Stagger.', '4d6 frost cone + Stagger.', '5d6 frost cone + Stagger.', '6d6 frost cone + Stagger.'],
  vrock: ['2d6 toxic screech.', '3d6 toxic screech.', '4d6 screech + Stun.', '5d6 screech + Stun.'],
  pit_fiend: ['3d6 Meteor Fireball + Burn.', '4d6 Meteor Fireball + Burn.', '6d6 Meteor Fireball + Burn.', '8d6 wide Meteor Fireball + Burn!'],
  orcus: ['2d8 + 8 Necrosis wave.', '3d8 + 12 Necrosis wave.', '4d8 + 16 Necrosis wave.', '5d8 + 22 Necrosis wave + raises Ghouls!'],
  asmodeus: ['Ward + 3d6 Ruby Rod line.', 'Ward + 4d6 line.', 'Heavy Ward + 5d6 line + Stun.', 'Massive Ward + 6d6 line + Stun + Exposed!'],
  tiamat: ['3d6 Chromatic Breath cone.', '4d6 Chromatic Breath cone.', '5d6 Chromatic Breath cone.', '6d6 full-party Chromatic Breath!']
};
const E_TRAIT = f => [
  f.undying && ['Gets back up', `${Math.round(f.undying * 100)}% chance to rise at 30% HP unless killed by Radiant or Necrosis.`],
  f.deathPuff && ['Choking ash', 'Bursts into Poison on adjacent heroes when it falls.'],
  f.hasteAura && ['War cry', `Allies within ${f.hasteAura[0]} squares attack ${f.hasteAura[1]}% faster.`],
  f.pushResist && ['Stands firm', `Ignores ${Math.round(f.pushResist * 100)}% of pushes.`],
  f.enrage && ['Enrages', `Every ${f.enrage}s it hits 15% harder.`],
  f.webwalk && ['Web walker', 'Webs don’t hold it.'],
  f.fireproof && ['Fireproof', 'Ignores fire tiles and Boiling Steam.'],
  f.blackrazorBoss && ['Soul Drinker', 'Gains Ward, Haste, and Damage whenever ANY unit dies!'],
  f.summon && ['Summoner', `Every ${f.summon.every}s summons ${f.summon.n} ${(E[f.summon.k] || {}).name || f.summon.k}s.`]
].filter(Boolean);
const archChips = k => { const A = archOf(k); return A.length ? `<span class="archs">${A.map(a => `<span class="archchip" tabindex="0" data-tn="${esc(EARCH[a].n)}" data-tip="${esc(EARCH[a].x)}">${esc(EARCH[a].n)}</span>`).join('')}</span>` : ''; };
function enemyCard(u, b, compact) {
  const d = E[u.key] || {}, a = d.atk || u.atk, avg = ((a.d[0] * (a.d[1] + 1) / 2) + (a.flat || 0)) * (u.dm || 1);
  const tag = u.boss ? 'Boss' : u.elite ? 'Elite' : 'Foe';
  const ac = b ? curAC(b, u) : u.ac, sr = b ? curSR(b, u) : u.sr;
  const kind = a.kind === 'phys' ? (a.ty || 'physical') : (a.kind === 'radiant' || a.kind === 'holy') ? 'Radiant' : 'magic';
  const s = u.st || {};
  const live = [s.stun > 0 && 'Stunned', s.root > 0 && 'Rooted', s.taunt > 0 && 'Taunted', s.markStacks > 0 && `Mark ×${s.markStacks}`, s.hex && 'Infernal Hex', s.radHex > 0 && `Radiant Hex ×${s.radHex}`, s.burn >= 1 && `Burn ${Math.round(s.burn)}`, s.poison > 0 && `Poison ${s.poison.toFixed(0)}/s`, u.nec > 0 && `Necrosis ${Math.round(u.nec)}`, u.ward > 0 && `Ward ${Math.round(u.ward)}`].filter(Boolean);
  const hp = b ? `${Math.max(0, Math.round(u.hp))} / ${u.maxHp}` : u.maxHp;
  const head = `<div class="ehead"><img src="${portraitURL(u.key)}" alt=""><div><div class="lbl">${tag}</div><b>${esc(u.name || d.name)}</b><div class="erole">${esc(d.role || '')}</div>${archChips(u.key)}</div></div>`;
  const stats = `<div class="estats"><span><i>HP</i>${hp}</span><span><i>AC</i>${ac}</span><span><i>SR</i>${sr}</span><span><i>Speed</i>${d.ft || u.ft} ft</span><span><i>Range</i>${d.rng || u.rng}</span></div>`;
  const atk = `<div class="eline"><span class="lbl">Attack</span> ${esc(a.n)}: about <b>${Math.round(avg)}</b> ${esc(kind)}${a.hits > 1 ? `, ${a.hits} strikes` : ''} every ${a.iv}s.</div>`;
  if (compact) return `<div class="etip-in">${head}${stats}${atk}${d.abil ? `<div class="eline"><span class="lbl">Ability</span> ${esc(d.abil.n)}</div>` : ''}${live.length ? `<div class="elive">${live.join(' · ')}</div>` : ''}<div class="small mute">Right-click for full card</div></div>`;
  const ab = d.abil ? `<div class="eabil"><div class="lbl">Ability · ${esc(d.abil.n)}</div>${(E_ABIL[u.key] || []).map((t, i) => `<div class="band b${i + 1}"><span class="bn">${['Low', 'Mid', 'High', 'Natural 20'][i]}</span><span>${esc(t)}</span></div>`).join('')}</div>` : '';
  const tr = E_TRAIT(d.f || {}).map(([n, x]) => `<div class="eline"><b>${n}.</b> ${x}</div>`).join('');
  return `<div class="ecard">${head}${stats}${atk}${ab}${tr}${live.length ? `<div class="elive">${live.join(' · ')}</div>` : ''}</div>`;
}

/* ---------- v0.23 Changelog ---------- */
const CHANGELOG_HTML = `
<div><h3>3-Act Campaign, 9-Row Constricting DAG &amp; 10 Rotating Bosses</h3><ul>
<li><b>Act 1 — Phandalin &amp; the Triboar Trail:</b> 4 curated maps, Klarg’s Hideout optional miniboss, and 3 rotating bosses (<i>Nezznar</i>, <i>Venomfang</i> 2×2 Dragon, <i>Glasstaff</i>).</li>
<li><b>Act 2 — White Plume Mountain:</b> 4 dungeon maps, visible <b>Dungeon Hazards</b> (Boiling Steam, Frictionless Floor, Arcane Dampener) with Vault Loot, and 4 rotating bosses (<i>Keraptis</i>, <i>Blackrazor</i>, <i>Gynosphinx</i>, <i>Giant Crab</i>).</li>
<li><b>Act 3 — The Hells:</b> New volcanic <code>hells</code> board theme, <b>Wandering Pit Fiend</b> miniboss stepping across lanes, Devil’s Bargain <code>?</code> events, and 3 endgame bosses (<i>Orcus</i>, <i>Asmodeus</i>, <i>Tiamat</i>).</li>
<li><b>Camp Shop Flow Flip &amp; Whole-Shop Freeze:</b> Camp Shop opens after wins and at Act start with an Act Boss Reminder and Whole-Shop Freeze; combat nodes jump straight to Tactical Deployment.</li>
</ul></div>
<div><h3>Complete 24-Hero Rework, Strict Progressive Disclosure, Epic Boons &amp; Multiclass</h3><ul>
<li><b>24 Reworked Heroes &amp; 13 Canonical Class Keywords:</b> Lumen reborn as a <b>Celestial Warlock</b>, Mother Laurel as a frontline Cleave Drain Tank, Arthur on universal <b>Evasion</b> + Action Surge, Zoe tossing any random Common item, Gilthrax unleashing Gold Dragon Fire Breath, Toot dancing for bounty Motes, and live spatial targeting lines for Rosalind, Toot &amp; Brother Jamison!</li>
<li><b>Tier II Specializations &amp; Tier IV Universal Epic Boons:</b> Strictly 1-line Specializations hidden until Tier II, plus a shared 9-card Tier IV Epic Boon deck (pick 1 of 3).</li>
<li><b>12 Single-Class Named Multiclass Nodes (✧) &amp; Opt-In Quest Board (❖):</b> Visit unique locations like <i>Oath Shrine</i> or <i>Arcane Study</i> to dip a second class &amp; unlock its Curio items, and opt into personal Hero Quests on the Quest Board.</li>
</ul></div>
<div><h3>82-Item Six-Tier Catalog &amp; Cubed AC/SR Combat Math</h3><ul>
<li><b>58 Universal Standard Items (5 Tiers) + 24 Unique Class-Keyword Items:</b> Common (2g), Uncommon (3g), Rare (4g), Very Rare (6g), Legendary (10g) with exact per-tier 6-attribute parity, plus 24 Unique items (2 per class) sold at the <b>Curio Merchant (⚖)</b>.</li>
<li><b>Cubed AC/SR Curve (K = 14), Multiplicative Evasion &amp; Radiant Damage:</b> Bounded accuracy where every point of AC/SR (10–20) feels impactful, counterable by Armor/Spell Pen, scarce Radiant true damage, and universal Evasion.</li>
</ul></div>`;
