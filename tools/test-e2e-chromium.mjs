import { spawn } from 'node:child_process';
import http from 'node:http';

const PORT = 9226;
const chrome = spawn('/usr/bin/chromium', [
  '--headless=new', '--disable-gpu', '--no-sandbox',
  '--window-size=1440,1000',
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
    await new Promise(r => setTimeout(r, 60));
    return info;
  }

  async function clearForcedModals() {
    const log = [];
    for (let k = 0; k < 6; k++) {
      const open = await evalJS(`!document.getElementById('modal').hidden`);
      if (!open) break;
      const order = [
        '#modal [data-a="choosePath"]',
        '#modal [data-a="chooseAsi"]',
        '#modal [data-a="swapBuy"]',
        '#modal [data-a="evTake"]',
        '#modal [data-a="evPromote"]',
        '#modal [data-a="evRetrain"]',
        '#modal [data-a="evQuestBoost"]',
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
  await new Promise(r => setTimeout(r, 900));

  assert((await realClick('[data-a="newrun"]')).hitInside, 'newrun');
  assert((await realClick('[data-a="begin"]')).hitInside, 'begin');

  // Verify Pre-Run Pack Toggles (all 6 visible, toggle 1 off -> 5 packs / 20 heroes, toggle back on -> 6 packs / 24 heroes)
  const packInit = await evalJS(`({ cards: document.querySelectorAll('#packList .pack-toggle').length, on: document.querySelectorAll('#packList .pack-toggle.on').length })`);
  console.log('PRE-RUN PACK TOGGLES:', packInit);
  assert(packInit.cards === 6 && packInit.on === 6, 'Expected 6 enabled packs by default');
  assert((await realClick('#packList [data-a="togglePack"][data-k="surprise"]')).hitInside, 'toggle pack off');
  assert((await evalJS(`document.querySelectorAll('#packList .pack-toggle.on').length`)) === 5, 'Expected 5 enabled packs after toggling one off');
  assert((await realClick('#packList [data-a="togglePack"][data-k="surprise"]')).hitInside, 'toggle pack back on');
  assert((await evalJS(`document.querySelectorAll('#packList .pack-toggle.on').length`)) === 6, 'Expected 6 enabled packs after toggling back on');
  assert((await realClick('#packControls [data-a="confirmPacks"]')).hitInside, 'confirmPacks');
  assert((await evalJS(`RUN.adv.pool.length === 24 && RUN.adv.packs.length === 6`)), 'Expected 24 heroes & 6 packs active in run');
  assert((await realClick('#picks [data-a="pick"]')).hitInside, 'pick1');

  let testedPiggyRetry = false;

  for (let act = 1; act <= 3; act++) {
    const snap = await evalJS(`({
      act: RUN.adv.act, stage: RUN.adv.stage, phase: PHASE,
      pos: RUN.adv.pos, pathLen: (RUN.adv.path || []).length,
      beenNodes: document.querySelectorAll('#mapBoard .mnode.been').length,
      canNodes: document.querySelectorAll('#mapBoard .mnode.can').length,
      redLines: document.querySelectorAll('#mapBoard .maplines line.on').length,
      nxLines: document.querySelectorAll('#mapBoard .maplines line.nx').length,
      modalHidden: document.getElementById('modal').hidden,
      modalForced: document.getElementById('modal').dataset.forced
    })`);
    console.log(`ACT ${act} START:`, snap);
    assert(snap.act === act, `Expected act ${act}, got ${snap.act}`);
    assert(snap.phase === 'advmap', `Expected advmap, got ${snap.phase}`);
    assert(snap.pos === null, `Expected pos=null on Act ${act} start`);
    assert(snap.pathLen === 0, `Expected pathLen=0 on Act ${act} start, got ${snap.pathLen}`);
    assert(snap.beenNodes === 0, `Expected beenNodes=0 on Act ${act} start, got ${snap.beenNodes}`);
    assert(snap.redLines === 0, `Expected redLines=0 on Act ${act} start, got ${snap.redLines}`);
    assert(snap.nxLines === 0, `Expected nxLines=0 on Act ${act} start, got ${snap.nxLines}`);
    assert(snap.canNodes === 3, `Expected 3 clickable row-0 nodes on Act ${act} start, got ${snap.canNodes}`);
    assert(snap.modalHidden && !snap.modalForced, `Modal should be hidden on Act ${act} start`);

    for (let step = 0; step < 7; step++) {
      await clearForcedModals();
      const clickNode = await realClick('#advmap .mnode.can');
      assert(clickNode.found && clickNode.hitInside, `Act ${act} row ${step} node click failed: ${JSON.stringify(clickNode)}`);

      const phaseNow = await evalJS('PHASE');
      if (phaseNow === 'shop') {
        await evalJS(`RUN.gold = Math.max(RUN.gold, 20); renderShop();`);
        await clearForcedModals();
        await realClick('#offers .ho18:not(.sold):not(.poor)');
        await clearForcedModals();

        // Test Piggy Bank first-loss -> shop -> retry -> win on Act 2 row 0!
        if (act === 2 && step === 0 && !testedPiggyRetry) {
          testedPiggyRetry = true;
          assert((await realClick('#shop [data-a="tobattle"]')).hitInside, 'tobattle loss');
          assert((await realClick('#combat [data-a="begin-battle"]')).hitInside, 'begin loss');
          await evalJS(`(() => { B.units.filter(u => u.side === 'P').forEach(u => { u.alive = false; u.hp = 0; }); B.over = true; B.winner = 'E'; resultShown = true; showResult(); })()`);
          assert((await realClick('#result [data-a="afterFight"]')).hitInside, 'afterFight piggy');
          const retryPhase = await evalJS(`({ phase: PHASE, broken: RUN.piggyBroken, retries: RUN.retries })`);
          console.log('PIGGY BANK RETRY:', retryPhase);
          assert(retryPhase.phase === 'shop' && retryPhase.broken && retryPhase.retries === 1, 'Piggy Bank retry failed');
        }

        assert((await realClick('#shop [data-a="tobattle"]')).hitInside, `tobattle act ${act} row ${step}`);
        assert((await realClick('#combat [data-a="begin-battle"]')).hitInside, `begin act ${act} row ${step}`);
        await evalJS(`(() => { B.units.filter(u => u.side === 'E').forEach(u => { u.alive = false; u.hp = 0; }); B.over = true; B.winner = 'P'; resultShown = true; showResult(); })()`);
        assert((await realClick('#result [data-a="afterFight"]')).hitInside, `afterFight act ${act} row ${step}`);
        await clearForcedModals();

        const afterPhase = await evalJS('PHASE');
        assert(afterPhase !== 'packs', 'Packs screen must NOT appear between acts!');
        if (afterPhase === 'over') break;
      } else {
        await clearForcedModals();
      }
    }
  }

  const finalSnap = await evalJS(`({ phase: PHASE, victory: RUN.victory, over: RUN.over, act: RUN.adv.act, wins: RUN.stats.won })`);
  console.log('FINAL VICTORY:', finalSnap);
  assert(finalSnap.phase === 'over' && finalSnap.victory && finalSnap.over && finalSnap.wins === 12, 'Expected full 3-act victory');

  // Verify all 24 heroes render largeCard + custom art without error
  const artCheck = await evalJS(`(() => {
    let cardsOk = 0, loadedHeroes = 0, loadedForms = 0;
    HERO_ORDER.forEach(k => {
      const html = largeCard(k, 2, { cfg: { key: k, tier: 2, questDone: true } });
      if (html && html.includes(H[k].name)) cardsOk++;
      if (keyedCustomArt('heroes', k)) loadedHeroes++;
    });
    ['arthur_form','dane_form','pillar_form','jamison_quest','saint_quest','kaska_form'].forEach(f => {
      if (keyedCustomArt('forms', f)) loadedForms++;
    });
    return { cardsOk, loadedHeroes, loadedForms };
  })()`);
  console.log('24-HERO & 6-FORM ART CHECK:', artCheck);
  assert(artCheck.cardsOk === 24 && artCheck.loadedHeroes === 24 && artCheck.loadedForms === 6, 'Expected 24 cards, 24 hero PNGs, 6 form PNGs');

  // Verify starting a New Run from Victory screen works cleanly
  assert((await realClick('#over [data-a="newrun"]')).hitInside, 'newrun from victory');
  assert((await evalJS('PHASE')) === 'intro', 'Expected intro after newrun');

  // Verify legacy save migration (stale Act 1 path saved on Act 2 pos:null)
  await evalJS(`(() => {
    const r = newAdventure();
    startRunWithPacks(r, PACK_ORDER);
    freeHero(r, 'arthur');
    r.adv.act = 2; startAct(r);
    r.adv.path = [{r:0,i:0},{r:1,i:1},{r:2,i:2},{r:3,i:0},{r:4,i:1},{r:5,i:2}];
    localStorage.setItem(SAVE_KEY, JSON.stringify(r));
    renderTitle();
  })()`);
  assert((await realClick('#contBtn')).hitInside, 'continue legacy save');
  const migrated = await evalJS(`({ act: RUN.adv.act, pathLen: RUN.adv.path.length, been: document.querySelectorAll('#mapBoard .mnode.been').length, can: document.querySelectorAll('#mapBoard .mnode.can').length })`);
  console.log('LEGACY SAVE MIGRATION:', migrated);
  assert(migrated.act === 2 && migrated.pathLen === 0 && migrated.been === 0 && migrated.can === 3, 'Legacy save migration failed');

  assert(errors.length === 0, 'Browser errors detected: ' + JSON.stringify(errors));
  console.log('ALL CHROMIUM E2E ASSERTIONS PASSED (0 errors)!');
  ws.close();
  chrome.kill();
}

main().catch(e => { console.error(e); chrome.kill(); process.exit(1); });
