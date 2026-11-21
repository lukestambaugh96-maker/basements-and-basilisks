/* ================= 0.22 ASSET MANIFEST LOADER & CUSTOM ART OVERRIDES =================
   Loads assets/manifest.json + optional Asset Studio localStorage preview overrides.
   Every slot falls back seamlessly to procedural canvas/SVG art when unassigned.
*/
const ASSET_STORE_KEY = 'bb022.assets';
const ASSET_MANIFEST = { version: '0.22', baseUrl: '', heroes: {}, forms: {}, enemies: {}, items: {}, maps: {} };
const ASSET_IMG = {}; // Loaded HTMLImageElement cache keyed by "<cat>:<key>"
const ASSET_CATS = ['heroes', 'forms', 'enemies', 'items', 'maps'];

function _mergeManifest(base, patch) {
  if (!patch || typeof patch !== 'object') return base;
  if (typeof patch.baseUrl === 'string') base.baseUrl = patch.baseUrl;
  ASSET_CATS.forEach(cat => {
    if (patch[cat] && typeof patch[cat] === 'object') {
      base[cat] = { ...(base[cat] || {}), ...patch[cat] };
    }
  });
  return base;
}

function assetURL(cat, key) {
  const raw = ASSET_MANIFEST[cat] && ASSET_MANIFEST[cat][key];
  if (!raw) return '';
  if (/^(data:|blob:|https?:\/\/|\/)/i.test(raw)) return raw;
  const base = (ASSET_MANIFEST.baseUrl || '').replace(/\/+$/, '');
  return base ? `${base}/${raw.replace(/^\/+/, '')}` : raw;
}

function getCustomImage(cat, key) {
  const img = ASSET_IMG[cat + ':' + key];
  return img && img.complete && img.naturalWidth > 0 ? img : null;
}

function preloadManifestAssets(onDone) {
  const jobs = [];
  ASSET_CATS.forEach(cat => {
    Object.keys(ASSET_MANIFEST[cat] || {}).forEach(key => {
      const url = assetURL(cat, key);
      const ck = cat + ':' + key;
      if (!url) { delete ASSET_IMG[ck]; return; }
      if (ASSET_IMG[ck] && ASSET_IMG[ck]._src === url) return;
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img._src = url;
      const p = new Promise(res => {
        img.onload = () => {
          ASSET_IMG[ck] = img;
          if ((cat === 'heroes' || cat === 'enemies') && typeof PORTRAIT !== 'undefined') delete PORTRAIT[key];
          if (cat === 'forms' && typeof PORTRAIT !== 'undefined') delete PORTRAIT[key];
          if (cat === 'maps' && typeof mapDirty !== 'undefined') mapDirty = true;
          res();
        };
        img.onerror = () => res();
      });
      img.src = url;
      jobs.push(p);
    });
  });
  Promise.all(jobs).then(() => { if (onDone) onDone(); });
}

function initAssets(onReady) {
  // 1. Apply any pre-inlined bundle manifest (used by single-file dist/Basements_&_Basilisks_0.22.html)
  const bundled = (typeof window !== 'undefined' && window.__BUNDLED_MANIFEST__) || null;
  if (bundled) _mergeManifest(ASSET_MANIFEST, bundled);
  // 2. Apply any localStorage overrides saved from Asset Studio
  let local = null;
  try { local = JSON.parse(localStorage.getItem(ASSET_STORE_KEY) || 'null'); } catch (e) {}
  // 3. Fetch assets/manifest.json in modular dev mode (skipped when bundled or running from file://)
  const applyAll = (disk) => {
    if (disk) _mergeManifest(ASSET_MANIFEST, disk);
    if (local) _mergeManifest(ASSET_MANIFEST, local);
    preloadManifestAssets(() => { if (onReady) onReady(); });
  };
  if (!bundled && typeof fetch === 'function' && typeof location !== 'undefined' && location.protocol !== 'file:') {
    fetch('assets/manifest.json', { cache: 'no-cache' })
      .then(r => (r.ok ? r.json() : null))
      .then(applyAll)
      .catch(() => applyAll(null));
  } else {
    applyAll(null);
  }
}
