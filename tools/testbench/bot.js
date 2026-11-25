'use strict';
// Headless bot: plays Act 1 with a simple shop policy (fill 3 heroes, then items). Runs in node and in the browser dev panel.
function botPlaceAll(run) { for (const r of run.roster) r.pos = null; const order = run.roster.slice().sort((a, b) => (HEROES[a.id].range <= 1 ? 0 : 1) - (HEROES[b.id].range <= 1 ? 0 : 1)); for (const r of order) autoPlace(run, r); }
function botShop(run, policy) {
  let guard = 0;
  while (guard++ < 20) {
    const o = run.offers; let bought = false;
    const want = run.roster.length < (policy.party || 3);
    if (want) for (const h of o.heroes) { if (!h.sold && !run.roster.find(r => r.id === h.id) && run.gold >= offerPrice(run, h)) { buyOffer(run, h); bought = true; break; } }
    if (!want) {
      // a duplicate ranks up
      for (const h of o.heroes) { const own = run.roster.find(r => r.id === h.id); if (!h.sold && own && own.tier < 2 && run.gold >= offerPrice(run, h)) { const res = buyOffer(run, h); if (res.rankUp) res.rankUp.t2 = Math.floor(RNG() * 2); bought = true; break; } }
      if (!bought) { const slots = run.roster.reduce((a, r) => a + ECON.slots - r.items.length, 0) - run.stash.length; if (slots > 0) for (const it of o.items) { if (!it.sold && run.gold >= offerPrice(run, it) + (policy.save || 0)) { buyOffer(run, it); bought = true; break; } } }
    }
    for (const ir of run.stash.slice()) { const rec = run.roster.filter(r => r.items.length < ECON.slots).sort((a, b) => a.items.length - b.items.length)[0]; if (rec) equip(run, ir, rec); }
    if (!bought) { if (want && run.gold >= run.rerollCost + 15 && run.rerollCost <= 2) { reroll(run); continue; } break; }
  }
  botPlaceAll(run);
}
function botChoice(run, cards) {
  const c = cards.find(c => c.id === 'purse') || cards.find(c => c.id === 'training') || cards.find(c => c.id === 'freeitem') || cards.find(c => c.id === 'recruit') || cards.find(c => !c.id.startsWith('bargain')) || cards[0];
  if (c.id === 'purse') run.gold += ECON.purse;
  else if (c.id === 'training') { const r = pick(run.roster); r.train[HEROES[r.id].key] = (r.train[HEROES[r.id].key] || 0) + 2; }
  else if (c.id === 'freeitem') run.stash.push({ id: pick(ITEM_LIST.filter(i => i.rar === 'Uncommon')).id, wins: 0, paid: 0 });
  else if (c.id === 'recruit') { if (run.roster.length < 6) addHero(run, pick(Object.keys(HEROES)), { bench: true, spent: 0 }); }
  else if (c.id === 'classitem') { const its = classItemOffers(run); run.stash.push({ id: its[0].id, wins: 0, paid: 0 }); }
  else if (c.id === 'multiclass') { const r = run.roster.find(r => !r.mc); if (r) { r.mc = pick(mcOptions(r)); if (r.mc === 'Metamagic') r.mcMeta = 'Quickened'; } }
  else if (c.id === 'bargain_elite') run.bargainElite = true;
  else if (c.id === 'bargain_more') run.extraCard = true;
}
function botRun(seed, opts = {}) {
  const run = newRun(seed);
  const starter = opts.starter || pick(Object.keys(HEROES));
  addHero(run, starter, { spent: 0 }); run.starter = starter;
  const fights = [];
  let fightGuard = 0;
  while (!run.over && fightGuard++ < 12) {
    if (run.phase === 'starter' || run.phase === 'shop' || run.phase === 'shop-retry') { enterShop(run); if (run.fight > 0 || opts.shopFirst) botShop(run, opts); else botPlaceAll(run); }
    const F = startRunFight(run, { headless: true });
    while (!F.over) stepFight(F);
    const res = finishFight(run, F);
    res.party = F.units.filter(u => u.side === 'H' && !u.summon).map(u => u.id + (u.tier > 1 ? '*' : ''));
    fights.push(res);
    if (run.phase === 'rousing') { run.over = true; break; }
    if (run.phase === 'choice') { botChoice(run, drawChoices(run)); run.phase = 'shop'; }
    else if (run.phase === 'campfire') { const t1 = run.roster.filter(r => r.tier === 1 && r.pos); if (t1.length) { const r = pick(t1); r.tier = 2; r.t2 = Math.floor(RNG() * 2); } else run.campWard = true; run.phase = 'shop'; }
  }
  return { run, fights, starter };
}
if (typeof module !== 'undefined') module.exports = { botRun };
