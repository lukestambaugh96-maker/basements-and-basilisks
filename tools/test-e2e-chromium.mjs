import { spawn } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';

const PORT = 9226;
const SCREENSHOT_DIR = process.env.E2E_SCREENSHOT_DIR || '';
const CHROME_BIN = ['/usr/bin/chromium', '/usr/bin/google-chrome', '/usr/bin/chromium-browser'].find(p => fs.existsSync(p)) || 'google-chrome';
const chrome = spawn(CHROME_BIN, [
  '--headless=new', '--disable-gpu', '--no-sandbox',
  '--window-size=1440,980',
  `--remote-debugging-port=${PORT}`, 'about:blank'
], { stdio: 'ignore' });

function getJSON(url) {
  return new Promise((res, rej) => http.get(url, r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }).on('error', rej));
}

function assert(cond, msg) {
  if (!cond) throw new Error('ASSERT FAILED: ' + msg);
}

async function main() {
  let targets;
  for (let i = 0; i < 40; i++) {
    try { targets = await getJSON(`http://127.0.0.1:${PORT}/json/list`); if (targets.length) break; } catch {}
    await new Promise(r => setTimeout(r, 150));
  }
  const wsUrl = targets.find(t => t.type === 'page').webSocketDebuggerUrl;
  const ws = new WebSocket(wsUrl);
  await new Promise(r => ws.addEventListener('open', r));
  let seq = 1;
  const pending = new Map();
  const errors = [];
  ws.addEventListener('message', ev => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
    if (m.method === 'Runtime.exceptionThrown') {
      errors.push('EXCEPTION: ' + (m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text));
    }
    if (m.method === 'Console.messageAdded' && m.params.message.level === 'error') {
      errors.push('CONSOLE: ' + m.params.message.text);
    }
  });
  const send = (method, params = {}) => new Promise(res => {
    const id = seq++; pending.set(id, res); ws.send(JSON.stringify({ id, method, params }));
  });
  const evalJS = async expr => {
    const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    if (r.result && r.result.exceptionDetails) {
      errors.push('EVAL_ERR: ' + (r.result.exceptionDetails.exception?.description || r.result.exceptionDetails.text));
    }
    return r.result && r.result.result ? r.result.result.value : undefined;
  };

  async function snapShot(name) {
    if (!SCREENSHOT_DIR) return;
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
    const r = await send('Page.captureScreenshot', { format: 'png' });
    if (r.result && r.result.data) {
      fs.writeFileSync(path.join(SCREENSHOT_DIR, `${name}.png`), Buffer.from(r.result.data, 'base64'));
    }
  }

  async function realClick(sel) {
    const info = await evalJS(`(() => {
      const els = [...document.querySelectorAll(${JSON.stringify(sel)})].filter(el => {
        if (el.hidden || el.disabled) return false;
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
      });
      const el = els[0];
      if (!el) return { found: false };
      el.scrollIntoView({ block: 'center', inline: 'center' });
      const r = el.getBoundingClientRect();
      const x = r.left + r.width / 2, y = r.top + r.height / 2;
      const top = document.elementFromPoint(x, y);
      return {
        found: true, x, y,
        a: el.dataset.a || el.className,
        hitInside: !!(top && (top === el || el.contains(top) || top.contains(el))),
        topTag: top ? (top.tagName + (top.id ? '#' + top.id : '') + '.' + (typeof top.className === 'string' ? top.className : '')) : 'NONE'
      };
    })()`);
    if (!info || !info.found) return info || { found: false };
    await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: info.x, y: info.y, button: 'left', clickCount: 1 });
    await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: info.x, y: info.y, button: 'left', clickCount: 1 });
    await new Promise(r => setTimeout(r, 70));
    return info;
  }

  async function clearForcedModals() {
    const log = [];
    for (let k = 0; k < 10; k++) {
      const open = await evalJS(`!document.getElementById('modal').hidden`);
      if (!open) break;
      const order = [
        '#modal [data-a="choosePath"]',
        '#modal [data-a="chooseAsi"]',
        '#modal [data-a="chooseBoon"]',
        '#modal [data-a="swapBuy"]',
        '#modal [data-a="evTake"]',
        '#modal [data-a="evPromote"]',
        '#modal [data-a="evMulticlass"]',
        '#modal [data-a="evMcAttr"]',
        '#modal [data-a="evQuestBoost"]',
        '#modal [data-a="mysteryChoice"]:not([disabled])',
        '#modal [data-a="evRetrain"]',
        '#modal [data-a="evRest"]',
        '#modal [data-a="evSkip"]',
        '#modal [data-a="closeModal"]'
      ];
      let clicked = null;
      for (const s of order) {
        const res = await realClick(s);
        if (res.found) { clicked = res; break; }
      }
      assert(clicked && clicked.hitInside, 'Stuck or blocked modal: ' + JSON.stringify(clicked));
      log.push(clicked.a);
    }
    return log;
  }

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Console.enable');
  await send('Page.navigate', { url: 'http://127.0.0.1:8081/index.html' });
  await new Promise(r => setTimeout(r, 950));

  await snapShot('01-title');
  assert((await realClick('[data-a="newrun"]')).hitInside, 'newrun');
  assert((await realClick('[data-a="begin"]')).hitInside, 'begin');

  // Verify Pre-Run Pack Toggles
  const packInit = await evalJS(`({ cards: document.querySelectorAll('#packList .pack-toggle').length, on: document.querySelectorAll('#packList .pack-toggle.on').length })`);
  console.log('PRE-RUN PACK TOGGLES:', packInit);
  assert(packInit.cards === 6 && packInit.on === 6, 'Expected 6 enabled packs by default');
  assert((await realClick('#packList [data-a="togglePack"][data-k="surprise"]')).hitInside, 'toggle pack off');
  assert((await evalJS(`document.querySelectorAll('#packList .pack-toggle.on').length`)) === 5, 'Expected 5 enabled packs');
  assert((await realClick('#packList [data-a="togglePack"][data-k="surprise"]')).hitInside, 'toggle pack back on');
  assert((await realClick('#packControls [data-a="confirmPacks"]')).hitInside, 'confirmPacks');
  assert((await evalJS(`RUN.adv.pool.length === 24 && RUN.adv.packs.length === 6`)), 'Expected 24 heroes & 6 packs');

  // Strict Progressive Disclosure check on Starter Pick Tier I cards!
  const pdCheck = await evalJS(`(() => {
    const txt = document.getElementById('picks').textContent;
    return {
      cards: document.querySelectorAll('#picks .hcard').length,
      hasSpecLeak: /Specialization|Tier II Path|Epic Boon|Personal Quest/i.test(txt)
    };
  })()`);
  console.log('TIER I STRICT PROGRESSIVE DISCLOSURE:', pdCheck);
  assert(pdCheck.cards >= 3 && !pdCheck.hasSpecLeak, 'Tier I card leaked Spec/Quest/Boon text: ' + JSON.stringify(pdCheck));

  assert((await realClick('#picks [data-a="pick"]')).hitInside, 'pick starter');

  // v0.23 Camp Shop Flow Flip: After starter pick, we land in Camp Shop!
  const shopStart = await evalJS(`({
    phase: PHASE,
    hasBossReminder: (document.getElementById('nextFight')?.textContent || '').includes('Act Boss Reminder:'),
    hasFreeze: !!document.getElementById('freezeBtn'),
    hasToMap: !!document.querySelector('#shop [data-a="toMap"]')
  })`);
  console.log('CAMP SHOP START:', shopStart);
  assert(shopStart.phase === 'shop' && shopStart.hasBossReminder && shopStart.hasFreeze && shopStart.hasToMap, 'Camp Shop v0.23 layout check failed');

  // Test Whole-Shop Freeze toggle
  assert((await realClick('#freezeBtn')).hitInside, 'freeze toggle on');
  assert((await evalJS('RUN.shop.frozen === true')), 'Expected RUN.shop.frozen === true');
  await snapShot('02-camp-shop');
  assert((await realClick('#freezeBtn')).hitInside, 'freeze toggle off');
  assert((await evalJS('RUN.shop.frozen === false')), 'Expected RUN.shop.frozen === false');

  let testedPiggyRetry = false;
  let capturedDeploy = false;
  let capturedAct3Map = false;
  let capturedAct3Battle = false;

  // Complete all 3 Acts through the 9-row constricting DAG!
  let safety = 0;
  while (safety++ < 140) {
    await clearForcedModals();
    const ph = await evalJS('PHASE');
    if (ph === 'over') break;

    if (ph === 'shop') {
      await evalJS(`RUN.gold = Math.max(RUN.gold, 24); renderShop();`);
      await clearForcedModals();
      // Buy an available hero or upgrade if present
      const boughtHero = await realClick('#offers .ho18:not(.sold):not(.poor)');
      if (boughtHero.found) await clearForcedModals();
      // Buy an available item if present
      const boughtItem = await realClick('#ioffers .io18:not(.sold):not(.poor)');
      if (boughtItem.found) await clearForcedModals();

      const retry = await evalJS('!!RUN.adv.retryPending');
      if (retry) {
        assert((await realClick('#shop [data-a="tobattle"]')).hitInside, 'retry tobattle');
      } else {
        assert((await realClick('#shop [data-a="toMap"]')).hitInside, 'toMap');
      }
      continue;
    }

    if (ph === 'advmap') {
      const msnap = await evalJS(`({
        act: RUN.adv.act,
        rows: (RUN.adv.map || []).length,
        canCount: document.querySelectorAll('#mapBoard .mnode.can').length,
        edges: document.querySelectorAll('#mapBoard .maplines line').length,
        hasBossLabel: !!document.querySelector('.mnode.k-boss')
      })`);
      assert(msnap.rows === 9 && msnap.canCount >= 1 && msnap.edges > 0 && msnap.hasBossLabel, '9-row DAG map failed: ' + JSON.stringify(msnap));
      if (msnap.act === 1 && !capturedDeploy) await snapShot('03-act1-dag-map');
      if (msnap.act === 3 && !capturedAct3Map) {
        capturedAct3Map = true;
        await snapShot('05-act3-hells-map');
      }
      const clickNode = await realClick('#advmap .mnode.can');
      assert(clickNode.found && clickNode.hitInside, 'DAG node click failed');
      await clearForcedModals();
      continue;
    }

    if (ph === 'combat') {
      const actNow = await evalJS('RUN.adv.act');
      if (!capturedDeploy) {
        capturedDeploy = true;
        // Add Rosalind if not on team just to screenshot spatial targeting preview lines on Deployment
        await evalJS(`if (!RUN.team.some(h => h.key === 'rosalind') && RUN.team.length < 4) { freeHero(RUN, 'rosalind'); autoPlace(RUN, false); renderStrip(); drawBoard(); }`);
        await new Promise(r => setTimeout(r, 120));
        await snapShot('04-deployment-preview');
      }

      // Test Piggy Bank first-loss -> Camp Shop -> Retry Battle -> Win on Act 2!
      if (actNow === 2 && !testedPiggyRetry) {
        testedPiggyRetry = true;
        assert((await realClick('#combat [data-a="begin-battle"]')).hitInside, 'begin piggy loss');
        await evalJS(`(() => { B.units.filter(u => u.side === 'P').forEach(u => { u.alive = false; u.hp = 0; }); B.over = true; B.winner = 'E'; resultShown = true; showResult(); })()`);
        assert((await realClick('#result [data-a="afterFight"]')).hitInside, 'afterFight piggy');
        const rp = await evalJS(`({ phase: PHASE, broken: RUN.piggyBroken, retries: RUN.retries, retryPending: RUN.adv.retryPending })`);
        console.log('PIGGY BANK RETRY:', rp);
        assert(rp.phase === 'shop' && rp.broken && rp.retries === 1 && rp.retryPending, 'Piggy Bank retry check failed');
        continue;
      }

      assert((await realClick('#combat [data-a="begin-battle"]')).hitInside, 'begin battle');
      if (actNow === 3 && !capturedAct3Battle) {
        capturedAct3Battle = true;
        await new Promise(r => setTimeout(r, 250));
        await snapShot('06-act3-hells-combat');
      }
      await evalJS(`(() => { B.units.filter(u => u.side === 'E').forEach(u => { u.alive = false; u.hp = 0; }); B.over = true; B.winner = 'P'; resultShown = true; showResult(); })()`);
      assert((await realClick('#result [data-a="afterFight"]')).hitInside, 'afterFight win');
      await clearForcedModals();
      continue;
    }

    throw new Error('Unexpected phase: ' + ph);
  }

  const finalSnap = await evalJS(`({ phase: PHASE, victory: RUN.victory, over: RUN.over, act: RUN.adv.act, wins: RUN.stats.won })`);
  console.log('FINAL VICTORY:', finalSnap);
  assert(finalSnap.phase === 'over' && finalSnap.victory && finalSnap.over && finalSnap.act === 3, 'Expected full 3-Act victory');

  // Verify all 24 heroes + 6 forms + 82 items + 10 bosses render cleanly
  const contentCheck = await evalJS(`(() => {
    let cardsOk = 0, loadedHeroes = 0, loadedForms = 0, itemsOk = 0;
    HERO_ORDER.forEach(k => {
      const h1 = largeCard(k, 1, { cfg: { key: k, tier: 1 } });
      const h4 = largeCard(k, 4, { cfg: { key: k, tier: 4, path: H[k].paths[0].k, asi: H[k].pair[1], boon: EPIC_BOON_KEYS[0], multiclass: 'Fighter', questActive: true, questDone: true } });
      if (h1 && h4 && h4.includes(H[k].name) && h4.includes(EPIC_BOONS[EPIC_BOON_KEYS[0]].n)) cardsOk++;
      if (keyedCustomArt('heroes', k)) loadedHeroes++;
    });
    ['arthur_form','dane_form','pillar_form','jamison_quest','saint_quest','kaska_form'].forEach(f => {
      if (keyedCustomArt('forms', f)) loadedForms++;
    });
    ALL_ITEM_KEYS.forEach(ik => {
      const ic = itemIcon(ik, 32);
      if (ic && ic.includes('<svg')) itemsOk++;
    });
    return { cardsOk, loadedHeroes, loadedForms, itemsOk, enemyCount: Object.keys(E).length };
  })()`);
  console.log('CONTENT & ART CHECK:', contentCheck);
  assert(contentCheck.cardsOk === 24 && contentCheck.loadedHeroes === 24 && contentCheck.loadedForms === 6 && contentCheck.itemsOk === 82, 'Content/art check failed');

  // Verify Field Guide & Stat Tracker page loads and all 4 tabs render with 0 errors!
  await send('Page.navigate', { url: 'http://127.0.0.1:8081/tools/wiki.html' });
  await new Promise(r => setTimeout(r, 850));
  await snapShot('07-wiki-heroes');
  assert((await realClick('.mtab[data-tab="patch"]')).hitInside, 'wiki patch tab');
  assert((await realClick('.mtab[data-tab="items"]')).hitInside, 'wiki items tab');
  const itemRows = await evalJS(`document.querySelectorAll('#itemStatTable tbody tr').length`);
  assert((await realClick('.mtab[data-tab="meta"]')).hitInside, 'wiki meta tab');
  await new Promise(r => setTimeout(r, 150));
  await snapShot('08-wiki-meta');
  const wikiCheck = await evalJS(`({
    title: document.title,
    rosterRows: document.querySelectorAll('#rosterList .hrow').length,
    dossierText: (document.getElementById('heroDossier')?.textContent || '').length,
    bossRows: document.querySelectorAll('#bossStatTable tbody tr').length,
    botRows: document.querySelectorAll('#runBotTable tbody tr').length
  })`);
  console.log('WIKI CHECK:', { ...wikiCheck, itemRows });
  assert(wikiCheck.rosterRows === 24 && wikiCheck.dossierText > 200 && itemRows === 82 && wikiCheck.bossRows === 10 && wikiCheck.botRows === 5, 'Wiki v0.23 check failed');

  assert(errors.length === 0, 'Browser errors detected: ' + JSON.stringify(errors));
  console.log('ALL v0.23 CHROMIUM E2E ASSERTIONS PASSED (0 errors)!');
  ws.close();
  chrome.kill();
}

main().catch(e => { console.error(e); chrome.kill(); process.exit(1); });
