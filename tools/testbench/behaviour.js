'use strict';
// ===================== Behaviour: how each hero and enemy acts. Every number comes from the configs (CFG.heroes, CFG.enemies). =====================
const HC = CFG.heroes.heroes, EC = CFG.enemies.enemies;
const BAND = r => r.band === 'Low' ? 'low' : r.band === 'High' ? 'high' : 'mid';
const byRoll = (o, r) => o[BAND(r)];
// A roll spec { dice, perTier, bonus, low, high } at this unit's tier and this ability roll -> { n, x, flat }
function spec(u, sp, r) {
  const b = parseDice(sp.dice); let n = b.n, x = b.x, flat = b.flat;
  if (sp.perTier) n *= u.tier;
  const ov = r ? (r.band === 'Low' ? sp.low : r.band === 'High' ? sp.high : null) : null;
  if (ov != null) { if (/^[+-]\d+$/.test(String(ov))) n += +ov; else { const o = parseDice(ov); n = o.n * (sp.perTier ? u.tier : 1); x = o.x; flat = o.flat; } }
  n = Math.max(1, n);
  if (sp.bonus != null) flat += typeof sp.bonus === 'number' ? sp.bonus : u.m(sp.bonus);
  return { n, x, flat };
}
const wardReplaces = () => CFG.rules.ward.stacking !== 'add';

// targeting helpers used by kits
function hasTarget(F, u) { const t = acquire(F, u); return !!t && canHit(F, u, t); }
function deadliest(list) { let b = null, bv = -1; for (const o of list) { const a = o.atk; const v = ((a.n || 1) * ((a.x || 4) + 1) / 2 + (a.flat || 0)) * (a.strikes || 1) / a.iv + (o.boss ? 5 : o.elite ? 3 : 0); if (v > bv) { bv = v; b = o; } } return b; }
function lowestPctFront(F, u) {
  const al = alliesOf(F, u); const hurt = al.filter(a => a.hp < a.maxHp);
  if (hurt.length) return lowestPct(hurt);
  const foes = foesOf(F, u); if (!foes.length) return u;
  let b = null, bd = 1e9; for (const a of al) { const dd = Math.min(...foes.map(f => dist(a, f))); if (dd < bd) { bd = dd; b = a; } } return b || u;
}
function lineCells(a, b) { const out = []; const m = Math.max(Math.abs(b.x - a.x), Math.abs(b.y - a.y)) || 1; for (let k = 1; k <= 20; k++) { const x = Math.round(a.x + (b.x - a.x) * k / m), y = Math.round(a.y + (b.y - a.y) * k / m); if (!inb(x, y)) break; if (!out.some(c => c.x === x && c.y === y)) out.push({ x, y }); } return out; }
function densest(F, u, list) { let b = null, bc = -1; for (const o of list) { const c = list.filter(p => dist(p, o) <= 1).length; if (c > bc || (c === bc && o.hp > b.hp)) { bc = c; b = o; } } return b; }
function hex(F, u, t) { if (!t) return; if (u.hexT && u.hexT.hexedBy === u) u.hexT.hexedBy = null; u.hexT = t; t.hexedBy = u; }
function wildShape(F, u, frac, dur, kind, extra = {}) { u.form = kind; u.formHp = Math.floor(u.maxHp * frac); u.formT = dur; u.formThorns = extra.thorns || false; u.formAs = extra.as || 0; u.formHealPounce = extra.healPounce || false; }
function rummageFor(F, u, forced, r, used) {
  const C = u.def.cfg.ability, T = u.def.cfg.t2;
  const al = alliesOf(F, u).filter(a => !used.has(a)); if (!al.length) return;
  let t, kind;
  if (forced) { t = forced; kind = 'potion'; }
  else {
    const low = lowestPct(al);
    if (low && pct(low) < C.potionBelowHp) { t = low; kind = 'potion'; }
    else { const tank = al.slice().sort((a, b) => b.stat.taken - a.stat.taken)[0]; if (tank && tank.stat.taken > 0 && tank.ward < 5) { t = tank; kind = 'shield'; } else { t = al.slice().sort((a, b) => b.stat.dmg - a.stat.dmg)[0]; kind = 'whet'; } }
  }
  used.add(t); const mult = u.t2 === 0 ? T.runeCarver.supplyMultiplier : 1; const crit = r && r.crit;
  if (kind === 'potion') { const s = spec(u, C.potion); heal(F, u, t, rollDice(s.n * mult, s.x, crit) + s.flat); }
  else if (kind === 'shield') { const s = spec(u, C.spareShield); addWard(F, u, t, rollDice(s.n * mult, s.x, crit) + s.flat, false); }
  else { const s = spec(u, C.whetstone); t.whet = C.whetstone.attacks; t.whetN = s.n * mult; }
  if (u.t2 === 1) t.charge = Math.min(t.maxCharge, t.charge + T.justTheThing.allyCharge);
}
function sneakW(F, u, t) {
  const T = u.def.cfg.t2;
  if (u.t2 == null || !t.alive || u.counters.sa > F.t) return;
  const ok = u.t2 === 0 ? t.hp < t.maxHp * T.cutthroat.foeBelowHp : F.units.some(a => a.alive && a.side === 'H' && a !== u && a.target === t);
  if (!ok) return; u.counters.sa = F.t + T.cooldown;
  const s = spec(u, T.sneak); dealDamage(F, u, t, rollDice(s.n, s.x) + s.flat, 'phys', {});
}

// ---------------- hero kits ----------------
const KITS = {
  arthur: c => ({ dmgAb: true,
    ab: { can: (F, u) => tfoes(F, u).some(o => dist(o, u) <= c.ability.needsFoeWithin),
      cast(F, u, r) {
        const A = c.ability, w = byRoll(A.dodgeSeconds, r); u.st.dodge = w; u.dodged = 0;
        u.pend.push({ t: w, fn: (F, u) => { const t = acquire(F, u); if (!t || !canHit(F, u, t)) return false; const s = spec(u, A.strike); const n = s.n + A.extraDiceIfDodged * Math.min(1, u.dodged || 0) + (r.crit ? A.extraDiceOnNatural20 : 0); abHit(F, u, t, n, s.x, s.flat, 'phys', r, { crit: true }); return true; } });
      } },
    onStart(F, u) { if (u.t2 === 0) u.charge = Math.min(u.maxCharge, u.charge + c.t2.readyFirst.extraStartCharge); },
    onAttack(F, u, t) { if (u.t2 === 0 && !u.counters.rf) { u.counters.rf = 1; for (let i = 0; i < c.t2.readyFirst.extraStrikesOnFirstAttack; i++) { if (i > 0 && !t.alive) break; strike(F, u, t, {}); } } },
    onHalf(F, u) { if (u.t2 === 1) { const s = spec(u, c.t2.secondWind.heal); heal(F, u, u, rollDice(s.n, s.x) + s.flat); u.charge = u.maxCharge; } },
  }),
  bram: c => ({
    ab: { can: (F, u) => alliesOf(F, u).some(a => a.hp < a.maxHp),
      cast(F, u, r) {
        const inj = alliesOf(F, u).filter(a => a !== u && a.hp < a.maxHp); const t = nearest(inj, u) || u;
        const s = spec(u, c.ability.heal, r); const amt = rollDice(s.n + r.xd, s.x, r.crit, u.empower) + s.flat;
        heal(F, u, t, amt); if (t !== u) heal(F, u, u, Math.floor(amt * c.ability.selfHealShare));
        if (u.t2 === 1) { const b = spec(u, c.t2.turnTheFaithless.burst); for (const o of adjUnits(F, u, 'E')) dealDamage(F, u, o, rollDice(b.n, b.x, r.crit) + b.flat, 'radiant', { ability: true, area: true }); }
      } },
    tick(F, u) { const P = c.t2.preserveLife; if (u.t2 === 0 && !u.counters.pl) { const lo = alliesOf(F, u).find(a => a.hp < a.maxHp * P.triggerBelowHp); if (lo) { u.counters.pl = 1; for (const a of alliesOf(F, u)) if (a.hp < a.maxHp * P.healsAlliesBelowHp) { const s = spec(u, P.heal); heal(F, u, a, rollDice(s.n, s.x) + s.flat); } } } },
  }),
  faelan: c => ({
    ab: { cast(F, u, r) { const t = lowestPctFront(F, u); const s = spec(u, c.ability.ward, r); addWard(F, u, t, rollDice(s.n + r.xd, s.x, r.crit, u.empower) + s.flat, wardReplaces()); u.weaveLeft = c.t2.absorbsCounted; } },
    onWardAbsorb(F, u, t) { if (u.t2 == null || !(u.weaveLeft > 0)) return; u.weaveLeft--; if (u.t2 === 0) u.charge = Math.min(u.maxCharge, u.charge + c.t2.spellWeave.chargeBackPerAbsorb); else t.charge = Math.min(t.maxCharge, t.charge + c.t2.sharedRecovery.allyChargePerAbsorb); },
  }),
  wallaby: c => ({ dmgAb: true,
    ab: { can: (F, u) => tfoes(F, u).some(o => dist(o, u) <= c.ability.reach),
      cast(F, u, r) { const k = byRoll(c.ability.daggers, r); for (let i = 0; i < k; i++) { const t = lowestHp(tfoes(F, u).filter(o => dist(o, u) <= c.ability.reach)); if (!t) break; const s = spec(u, c.ability.dagger); abHit(F, u, t, s.n, s.x, s.flat, 'phys', r); sneakW(F, u, t); } } },
    onStrike(F, u, t) { sneakW(F, u, t); },
    onKill(F, u, t) { const T = c.t2; if (u.t2 === 0 && !(u.counters.cutCd > F.t)) { u.counters.cutCd = F.t + T.cutthroat.killCooldown; u.charge = Math.min(u.maxCharge, u.charge + T.cutthroat.chargeOnKill); } if (u.t2 === 1 && t.side === 'E') { F.gold += T.pickpocket.goldPerKill; onGoldDrop(F); } },
  }),
  dane: c => ({
    ab: { can: (F, u) => foesOf(F, u).some(o => dist(o, u) <= c.ability.reach),
      cast(F, u, r) {
        const A = c.ability; const t = deadliest(foesOf(F, u).filter(o => dist(o, u) <= A.reach)); if (!t) return;
        applyControl(F, u, t, 'taunt', byRoll(A.tauntSeconds, r)); u.duelT = t; u.target = t;
        if (A.smite) { const s = spec(u, A.smite); abHit(F, u, t, s.n, s.x, s.flat, 'radiant', r); }
        if (A.ward) { const s = spec(u, A.ward, r); addWard(F, u, u, rollDice(s.n + r.xd, s.x, r.crit) + s.flat, false); }
      } },
    onStrike(F, u, t, dmg, crit) {
      const T = c.t2;
      if (u.t2 === 0 && t === u.duelT && t.st.taunt > 0) { u.counters.duel = (u.counters.duel || 0) + 1; if (u.counters.duel % T.duelist.everyNthHit === 0) { const s = spec(u, T.duelist.smite); dealDamage(F, u, t, rollDice(s.n, s.x, crit) + s.flat, 'radiant', { crit }); } }
      if (u.t2 === 1 && u.retri > 0 && t.alive) { u.retri = 0; const s = spec(u, T.retribution.smite); dealDamage(F, u, t, rollDice(s.n, s.x, crit) + s.flat, 'radiant', { crit }); }
    },
    onHitTaken(F, u, src) { if (u.t2 === 1 && src && src === u.duelT && src.st.taunt > 0) u.retri = 1; },
  }),
  lorcan: c => ({ kwMark: true,
    ab: { can: (F, u) => hasTarget(F, u), cast(F, u, r) { u.twinT = F.t + byRoll(c.ability.seconds, r); u.twinCrit = r.crit; } },
    tick(F, u) {
      if (u.t2 == null) return;
      if (!u.markT || !u.markT.alive) { const list = tfoes(F, u); const m = u.t2 === 0 ? highestHp(list) : (u.target && u.target.alive ? u.target : nearest(list, u)); if (m) { const mk = (u.t2 === 0 ? c.t2.colossusSlayer : c.t2.hordeBreaker).mark; const s = spec(u, mk); u.markT = m; u.markDie = s.x; u.markFlat = s.flat; if (u.counters.markJump) { u.hb = 1; u.counters.markJump = false; } } }
      if (u.t2 === 0 && u.markT && targetable(F, u, u.markT) && canHit(F, u, u.markT) && !(u.st.taunt > 0)) u.target = u.markT;
    },
    onAttack(F, u, t) { if (u.twinT > F.t && t.alive) strike(F, u, t, { crit: u.twinCrit }); if (u.hb && u.t2 === 1) { u.hb = 0; const a = adjUnits(F, t, 'E')[0]; if (a) strike(F, u, a, {}); } },
  }),
  juniper: c => ({
    ab: { can: (F, u) => foesOf(F, u).some(o => dist(o, u) <= c.ability.reach),
      cast(F, u, r) {
        const A = c.ability, T = c.t2; const dur = byRoll(A.restrainSeconds, r); let n = 0;
        for (const o of foesOf(F, u).filter(o => dist(o, u) <= A.reach)) { if (applyControl(F, u, o, 'root', dur)) n++; const s = spec(u, A.damage); abHit(F, u, o, s.n, s.x, s.flat, A.type, r, { area: true }); if (u.t2 === 1) applyControl(F, u, o, 'slow', dur, T.brambleStalker.slow); }
        if (A.wardPerFoe) { const s = spec(u, A.wardPerFoe); addWard(F, u, u, rollDice(s.n * n, s.x, r.crit) + (n ? s.flat : 0), false); }
        if (u.t2 != null && n >= T.minFoes) { if (u.t2 === 0) wildShape(F, u, T.brambleGuard.formHpShare, T.formSeconds, 'thorns', { thorns: parseDice(T.brambleGuard.thorns.dice) }); else wildShape(F, u, T.brambleStalker.formHpShare, T.formSeconds, 'stalker'); }
      } },
    onStrike(F, u, t) { if (u.form === 'stalker' && t.alive) addPoison(F, u, t, c.t2.brambleStalker.poisonPerHit); },
  }),
  rosalind: c => ({
    ab: { cast(F, u, r) {
      const A = c.ability; const al = alliesOf(F, u).filter(a => a !== u); const pool = al.length ? al : [u]; const k = r.crit ? 99 : byRoll(A.allies, r);
      const top = A.target === 'top damage dealer';
      pool.sort((a, b) => ((a.st.inspired > 1) - (b.st.inspired > 1)) || (top ? (b.stat.dmg - a.stat.dmg) : 0) || dist(a, u) - dist(b, u));
      const sd = spec(u, A.seconds);
      for (const a of pool.slice(0, k)) { a.st.inspired = Math.max(a.st.inspired, rollDice(sd.n, sd.x, r.crit) + sd.flat); a.inspAs = A.attackSpeed + A.attackSpeedPerTier * u.tier; if (u.t2 === 0) a.inspireDie = c.t2.muse.abilityRollDie; if (u.t2 === 1) a.encore = c.t2.encore.chargeRateBonus; }
    } },
  }),
  zark: c => ({ dmgAb: true, kwRage: true,
    ab: { can: (F, u) => foesOf(F, u).some(o => dist(o, u) <= 1),
      cast(F, u, r) { const s = spec(u, c.ability.damage, r); for (const o of foesOf(F, u).filter(o => dist(o, u) <= 1)) abHit(F, u, o, s.n, s.x, s.flat, 'phys', r, { area: true }); const sd = spec(u, c.ability.selfDamage); dealDamage(F, u, u, rollDice(sd.n, sd.x) + sd.flat, 'true', { self: true }); } },
    onRage(F, u) { if (u.t2 === 1) for (const a of adjUnits(F, u, 'H')) { a.st.haste = c.t2.wolfTotem.allyAttackSpeed; a.st.hasteT = c.t2.wolfTotem.seconds; } },
  }),
  naill: c => ({ dmgAb: true, kwKi: true,
    ab: { can: (F, u) => hasTarget(F, u) || (u.t2 === 1 && (u.ki || 0) >= c.t2.kiNeeded && tfoes(F, u).length > 0),
      cast(F, u, r) {
        const T = c.t2; let t = acquire(F, u);
        if (u.t2 === 1 && r.kiSpent >= T.kiNeeded) { const far = tfoes(F, u).sort((a, b) => b.x - a.x)[0]; const cl = far && freeCellNear(F, far.x, far.y, 'H', 1); if (cl && dist(cl, far) <= 1) { moveTo(F, u, cl.x, cl.y); t = far; u.target = far; } }
        const k = byRoll(c.ability.strikes, r); const s = spec(u, c.ability.strike);
        for (let i = 0; i < k; i++) { if (!t || !t.alive) t = acquire(F, u); if (!t || !canHit(F, u, t)) break; abHit(F, u, t, s.n, s.x, s.flat, 'phys', r); if (i === k - 1 && u.t2 === 0 && r.kiSpent >= T.kiNeeded) applyControl(F, u, t, 'stun', T.stunningStrike.stunSeconds); }
      } },
    onStrike(F, u) { if (u.t2 != null) u.ki = Math.min(c.t2.kiMax, (u.ki || 0) + 1); },
  }),
  nettle: c => ({ dmgAb: true, kwHex: true,
    ab: { can: (F, u) => hasTarget(F, u),
      cast(F, u, r) { const A = c.ability; const t = acquire(F, u); if (!t) return; const s = spec(u, A.damage); abHit(F, u, t, s.n, s.x, s.flat, A.type, r); const bp = byRoll(A.burnPerTier, r); if (bp > 0) addBurn(F, u, t, bp * u.tier + (r.band === 'High' ? A.burnHighBonus : 0)); if (u.t2 != null) hex(F, u, t); } },
    onHexDeath(F, u, t) { const T = c.t2; if (u.t2 === 0) { const k = t.lastHitBy && t.lastHitBy.side === 'H' && t.lastHitBy.alive ? t.lastHitBy : u; const s = spec(u, T.darkOnesBlessing.ward); addWard(F, u, k, rollDice(s.n, s.x) + s.flat, false); } else { const s = spec(u, T.hellfirePact.explosion); for (const o of adjUnits(F, t, 'E')) dealDamage(F, u, o, rollDice(s.n, s.x) + s.flat, 'magic', { area: true }); hex(F, u, nearest(tfoes(F, u), t)); } },
  }),
  pillar: c => ({ dmgAb: true, kwRage: true, rageBar: true,
    ab: { can: (F, u) => foesOf(F, u).some(o => dist(o, u) <= 1 && !o.boss),
      cast(F, u, r) {
        const A = c.ability; const adj = foesOf(F, u).filter(o => dist(o, u) <= 1 && !o.boss); const t = adj.includes(u.target) ? u.target : adj[0]; if (!t) return;
        const range = byRoll(A.throwSquares, r); let land = null;
        for (let i = range; i >= 1 && !land; i--) for (const dy of [0, -1, 1]) { const x = t.x + i, y = t.y + dy; if (free(F, x, y)) { land = { x, y }; break; } }
        if (land) moveTo(F, t, land.x, land.y);
        const s = spec(u, A.damage, r);
        abHit(F, u, t, s.n, s.x, s.flat, 'phys', r, { area: true }); applyControl(F, u, t, 'stun', A.stunSeconds);
        for (const o of adjUnits(F, t, 'E')) { abHit(F, u, o, s.n, s.x, s.flat, 'phys', r, { area: true }); applyControl(F, u, o, 'stun', A.stunSeconds); }
      } },
    onStrike(F, u, t) { if (t.alive) applyControl(F, u, t, 'stun', c.attack.stunOnHit); if (u.t2 === 1 && u.rageBar > 0) { const s = spec(u, c.t2.avalanche.splash); for (const o of adjUnits(F, t, 'E')) dealDamage(F, u, o, rollDice(s.n, s.x) + s.flat, 'phys', { area: true }); } },
  }),
  laurel: c => ({ dmgAb: true,
    ab: { can: (F, u) => hasTarget(F, u),
      cast(F, u, r) { const t = acquire(F, u); if (!t || !canHit(F, u, t)) return; const s = spec(u, c.ability.damage, r); const dmg = abHit(F, u, t, s.n, s.x, s.flat, 'phys', r); const h = Math.floor(dmg * c.ability.healShareOfDamage); heal(F, u, u, h); for (const a of adjUnits(F, u, 'H')) heal(F, u, a, h); } },
    onStrike(F, u, t, dmg, crit) {
      const T = c.t2; if (u.t2 == null || !t.alive) return; u.counters.sm = (u.counters.sm || 0) + 1; if (u.counters.sm % T.everyNthHit) return;
      const s = spec(u, T.smite); dealDamage(F, u, t, rollDice(s.n, s.x, crit) + s.flat, 'radiant', { crit });
      if (u.t2 === 0) applyControl(F, u, t, 'root', T.ensnaringSmite.restrainSeconds); else { const a = lowestPct(adjUnits(F, u, 'H').filter(x => !x.summon)) || u; const w = spec(u, T.wardingSmite.ward); addWard(F, u, a, rollDice(w.n, w.x) + w.flat, false); }
    },
  }),
  lumen: c => ({ dmgAb: true, kwHex: true,
    ab: { can: (F, u) => hasTarget(F, u),
      cast(F, u, r) { const t = acquire(F, u); if (!t) return; const s = spec(u, c.ability.damage, r); for (const cl of lineCells(u, t)) { const o = unitAt(F, cl.x, cl.y); if (o && o.side === 'E') abHit(F, u, o, s.n, s.x, s.flat, c.ability.type, r, { area: true }); } if (u.t2 != null) hex(F, u, t); } },
    onHexDeath(F, u) { if (u.t2 === 0) u.as += c.t2.searingFocus.attackSpeedPerHexedKill; },
    onStrike(F, u, t, dmg) { if (u.t2 === 1 && dmg > 0) { const a = lowestPct(alliesOf(F, u)); if (a) heal(F, u, a, Math.floor(dmg * c.t2.healingLight.healShareOfDamage)); } },
  }),
  jamison: c => ({
    ab: { cast(F, u, r) {
      const A = c.ability; const al = alliesOf(F, u).filter(a => a !== u); const pool = al.length ? al : [u]; const k = r.crit ? 99 : byRoll(A.allies, r);
      pool.sort((a, b) => ((a.st.bond > 1) - (b.st.bond > 1)) || dist(a, u) - dist(b, u));
      for (const a of pool.slice(0, k)) {
        a.st.bond = A.bondSeconds; a.bondBy = u;
        const h = spec(u, A.heal); heal(F, u, a, rollDice(h.n + r.xd, h.x, r.crit) + h.flat);
        if (A.ward) { const w = spec(u, A.ward); addWard(F, u, a, rollDice(w.n, w.x, r.crit) + w.flat, false); }
      }
      if (A.selfWard) { const w = spec(u, A.selfWard); addWard(F, u, u, rollDice(w.n, w.x, r.crit) + w.flat, false); }
    } },
    onAllyHalf(F, u) { if (u.t2 === 0 && !u.counters.balm) { u.counters.balm = 1; const s = spec(u, c.t2.balmOfPeace.heal); for (const a of alliesOf(F, u)) heal(F, u, a, rollDice(s.n, s.x) + s.flat); } },
  }),
  zoe: c => ({
    ab: { cast(F, u, r) { const k = byRoll(c.ability.allies, r); const used = new Set(); for (let i = 0; i < k; i++) rummageFor(F, u, null, r, used); } },
    onAllyHalf(F, u, t) { if (u.t2 != null && !u.counters.eqm) { u.counters.eqm = 1; rummageFor(F, u, t, null, new Set()); } },
  }),
  toot: c => ({
    ab: { cast(F, u, r) {
      const A = c.ability; let cand = alliesOf(F, u).filter(a => a !== u && a.ab && !a.mote).sort((a, b) => dist(a, u) - dist(b, u)); if (!cand.length && !alliesOf(F, u).some(a => a !== u)) cand = [u];
      const k = r.crit ? 99 : byRoll(A.allies, r); const s = spec(u, A.mote);
      for (const a of cand.slice(0, k)) a.mote = { n: s.n, x: s.x, flat: s.flat, src: u, d20: u.t2 != null };
    } },
    tick(F, u) { if (u.t2 === 0) { u.as0 = u.as0 === undefined ? u.as : u.as0; u.as = u.as0 + c.t2.buskersRhythm.attackSpeedPerGold * F.gold; } },
  }),
  gilthrax: c => ({
    ab: { cast(F, u, r) {
      const A = c.ability, T = c.t2; const s = spec(u, A.ward, r); let amt = rollDice(s.n + r.xd, s.x, r.crit) + s.flat;
      if (u.t2 === 0) amt += T.gildedHoard.wardPerItem * u.itemCount + T.gildedHoard.extraPerRareItem * u.rareCount; addWard(F, u, u, amt, false);
      const dur = byRoll(A.tauntAdjacentSeconds, r); if (dur > 0) for (const o of adjUnits(F, u, 'E')) applyControl(F, u, o, 'taunt', dur);
    } },
    onWardBreak(F, u) { const T = c.t2; if (u.t2 == null) return; const amt = Math.floor(u.wardAbs * T.dragonsRetort.shareOfAbsorbed); u.wardAbs = 0; if (amt <= 0) return; const b = spec(u, T.dragonsRetort.burn); for (const o of foesOf(F, u)) { const dx = o.x - u.x; if (dx >= 0 && dx <= 2 && Math.abs(o.y - u.y) <= Math.max(1, dx)) { dealDamage(F, u, o, amt, 'magic', { area: true }); addBurn(F, u, o, rollDice(b.n, b.x) + b.flat); } } if (u.t2 === 1) for (const a of adjUnits(F, u, 'H')) a.charge = Math.min(a.maxCharge, a.charge + T.bodyguardsFee.allyChargePerBreath); },
  }),
  velith: c => ({ dmgAb: true,
    onStart(F, u) { u.st.stealth = c.startStealthSeconds; if (u.t2 === 0) u.firstBlood = true; },
    ab: { can: (F, u) => tfoes(F, u).length > 0,
      cast(F, u, r) {
        const A = c.ability; const pois = A.poisonBase + A.poisonPerTier * u.tier; const s = spec(u, A.strike);
        if (r.band === 'Low') { const t = acquire(F, u); if (!t || !canHit(F, u, t)) return; abHit(F, u, t, s.n, s.x, s.flat, 'phys', r); addPoison(F, u, t, pois); return; }
        const list = tfoes(F, u); const t = lowestHp(list.filter(o => dist(o, u) <= A.jumpReach)) || lowestHp(list); if (!t) return;
        const cl = free(F, t.x + 1, t.y) ? { x: t.x + 1, y: t.y } : freeCellNear(F, t.x, t.y, 'E', 1); if (cl && dist(cl, t) <= 1) moveTo(F, u, cl.x, cl.y);
        u.target = t;
        abHit(F, u, t, s.n, s.x, s.flat, 'phys', r, { crit: true }); addPoison(F, u, t, pois); if (r.band === 'High') addPoison(F, u, t, pois);
        if (r.crit && t.alive && !t.boss && t.hp < t.maxHp * A.executeBelowHp) dealDamage(F, u, t, t.hp + t.ward + 1, 'true', {});
      } },
    onStrike(F, u, t) { const T = c.t2; if (u.t2 != null && t.alive && t.st.poison > 0) { const s = spec(u, T.venom); dealDamage(F, u, t, rollDice(s.n, s.x) + s.flat, 'phys', {}); addPoison(F, u, t, T.venomPoison); } },
    perSecond(F, u) { if (u.t2 === 1) for (const o of foesOf(F, u)) if (o.st.poison > 0) applyControl(F, null, o, 'slow', 1.1, c.t2.nightshadeVials.slow); },
  }),
  cinder: c => ({ dmgAb: true,
    onStart(F, u) { if (u.t2 === 1) u.empower = true; },
    // Scorching Ray: one fire beam at each of up to 3 foes in range; with fewer foes, the extra beams double up.
    ab: { can: (F, u) => tfoes(F, u).some(o => canHit(F, u, o)),
      cast(F, u, r) {
        const A = c.ability;
        if (A.name === 'Fireball') { // prototype 2's Cinder, kept for the prototype2 preset
          const fl = tfoes(F, u).filter(o => canHit(F, u, o)); const ce = densest(F, u, fl.length ? fl : tfoes(F, u)); if (!ce) return;
          const rad = byRoll(A.radius, r); const hit = foesOf(F, u).filter(o => dist(o, ce) <= rad); const fs = spec(u, A.damage);
          for (const o of hit) abHit(F, u, o, fs.n, fs.x, fs.flat, A.type, r, { area: true });
          if (u.t2 === 0) { const rest = tfoes(F, u).filter(o => !hit.includes(o)); const c2 = densest(F, u, rest); const s2 = spec(u, c.t2.twinnedSpell.damage); if (c2) for (const o of foesOf(F, u).filter(o => dist(o, c2) <= 1)) abHit(F, u, o, s2.n, s2.x, s2.flat, A.type, r, { area: true }); }
          return;
        }
        const list = tfoes(F, u).filter(o => canHit(F, u, o)).sort((a, b) => dist(a, u) - dist(b, u)); if (!list.length) return;
        const rays = byRoll(A.rays, r) + (u.t2 === 0 ? c.t2.twinnedSpell.extraRays : 0); const s = spec(u, A.ray);
        for (let i = 0; i < rays; i++) { const alive = list.filter(o => o.alive); if (!alive.length) break; const t = alive[i % Math.min(A.targets, alive.length)]; abHit(F, u, t, s.n, s.x, s.flat, A.type, r); }
      } },
  }),
  gains: c => ({ dmgAb: true,
    ab: { can: (F, u) => tfoes(F, u).some(o => canHit(F, u, o)),
      cast(F, u, r) { const A = c.ability; const list = tfoes(F, u).filter(o => canHit(F, u, o)); const t = highestHp(list.length ? list : tfoes(F, u)); if (!t) return; const s = spec(u, A.damage); abHit(F, u, t, s.n, s.x, s.flat, A.type, r); if (r.band !== 'Low' && t.alive) t.gilded = true; if (r.band === 'High') { const a = adjUnits(F, t, 'E')[0]; if (a) a.gilded = true; } } },
  }),
  corvin: c => ({ dmgAb: true, kwMark: true,
    // Twin Shortswords: both swords strike only his Hunter's Marked target (set by Dread Ambush).
    strikesVs: c.attack.strikesVsMarked ? (F, u, t) => (u.huntT === t && t.alive ? c.attack.strikesVsMarked : (c.attack.strikes || 1)) : null,
    ab: { can: (F, u) => hasTarget(F, u),
      cast(F, u, r) { const T = c.t2; const t = acquire(F, u); if (!t) return; const k = byRoll(c.ability.strikes, r); if (u.t2 != null) { const m = spec(u, T.mark); u.markT = t; u.markDie = m.x; u.markFlat = m.flat; } if (c.ability.marksTarget) u.huntT = t; const s = spec(u, c.ability.strike); for (let i = 0; i < k && t.alive; i++) abHit(F, u, t, s.n, s.x, s.flat, 'phys', r); if (u.t2 === 1 && F.t <= T.firstStrike.withinSeconds && !u.counters.fs) { u.counters.fs = 1; for (const a of alliesOf(F, u)) if (a !== u) a.charge = Math.min(a.maxCharge, a.charge + T.firstStrike.allyCharge); } } },
    onAttack(F, u, t) { if (u.t2 === 0 && u.markT === t && t.alive) { u.counters.sf = (u.counters.sf || 0) + 1; if (u.counters.sf % c.t2.stalkersFlurry.everyNthAttack === 0) strike(F, u, t, {}); } },
  }),
  saint: c => ({
    ab: { cast(F, u, r) {
      const A = c.ability; const t = lowestPctFront(F, u); const h = spec(u, A.heal); heal(F, u, t, rollDice(h.n + r.xd, h.x, r.crit) + h.flat);
      const dbl = summonDouble(F, u, t, byRoll(A.doubleSeconds, r), A.doubleHpShare); if (!dbl) return;
      const td = byRoll(A.tauntSeconds, r); if (td > 0) for (const o of foesOf(F, u)) if (o.target === t) applyControl(F, dbl, o, 'taunt', td);
      if (u.t2 === 1) dbl.onGone = (F, d, killed) => { if (killed && t.alive) t.st.stealth = c.t2.cloakOfShadows.stealthSeconds; };
      if (u.t2 === 0 && t.ab && t.ab.cast) { try { dbl.ab = t.ab; t.ab.cast(F, dbl, { band: 'Low', crit: false, xd: 0, nat: 5 }); } catch (e) { } dbl.ab = null; }
    } },
  }),
  kaska: c => ({ dmgAb: true,
    ab: { can: (F, u) => tfoes(F, u).length > 0,
      cast(F, u, r) {
        const A = c.ability, T = c.t2; let t;
        if (r.band === 'Low') { t = acquire(F, u); if (!t || !canHit(F, u, t)) return; }
        else { const list = tfoes(F, u); t = list.sort((a, b) => dist(b, u) - dist(a, u))[0]; const cl = t && freeCellNear(F, t.x, t.y, 'H', 1); if (cl && dist(cl, t) <= 1) moveTo(F, u, cl.x, cl.y); else { t = acquire(F, u); if (!t || !canHit(F, u, t)) return; } }
        u.target = t; const s = spec(u, A.damage); const dmg = abHit(F, u, t, s.n, s.x, s.flat, 'phys', r); const a = lowestPct(alliesOf(F, u)); if (a) heal(F, u, a, Math.floor(dmg * A.healShareOfDamage));
        const rs = byRoll(A.restrainSeconds, r); if (rs > 0) applyControl(F, u, t, 'root', rs);
        if (u.t2 === 0) wildShape(F, u, T.panther.formHpShare, T.formSeconds, 'panther', { as: T.panther.attackSpeed, healPounce: T.panther.healShareOfHit });
        else if (u.t2 === 1) { wildShape(F, u, T.direBear.formHpShare, T.formSeconds, 'bear'); for (const o of adjUnits(F, u, 'E')) applyControl(F, u, o, 'taunt', T.direBear.tauntSeconds); }
      } },
  }),
};

// ---------------- build HEROES from config + kits ----------------
const STAT_KEYS = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
function atkFromCfg(a) {
  const p = parseDice(a.dice);
  const out = { name: a.name, n: p.n, x: p.x, type: a.type === 'magic' ? 'magic' : a.type === 'radiant' ? 'radiant' : 'phys', iv: a.interval };
  if (p.flat) out.flat = p.flat;
  if (a.bonus) out.stat = a.bonus; else out.stat = null;
  if (a.halfBonus) out.half = true;
  if (a.speedScaling != null) out.ratio = a.speedScaling;
  if (a.strikes) out.strikes = a.strikes;
  if (a.perTier) out.tierDice = true;
  if (a.pulse) out.pulse = true;
  if (a.woundedDice) out.woundedX = parseDice(a.woundedDice).x;
  return out;
}
const HEROES = {};
for (const id in HC) {
  if (HC[id].enabled === false) continue; // switched off (e.g. Toot, 25 Nov)
  const c = HC[id], k = KITS[id] ? KITS[id](c) : {};
  const def = Object.assign({
    id, cfg: c, name: c.name, anc: c.ancestry, cls: c.class, sub: c.subclass, role: c.role, pro: c.pronouns,
    job: c.job, stats: STAT_KEYS.map(s => c.stats[s]), key: c.key, ac: c.ac, sr: c.sr, range: c.range,
    atk: atkFromCfg(c.attack),
  }, k);
  if (c.castSeconds != null) def.cTime = c.castSeconds;
  def.chargeToCast = c.chargeToCast != null ? c.chargeToCast : (c.size ? CFG.rules.abilitySizes[c.size].chargeToCast : 100);
  if (c.chargePerHit != null) def.cHit = c.chargePerHit;
  if (c.startCharge != null) def.startCharge = c.startCharge === 'full' ? def.chargeToCast : c.startCharge;
  if (c.neverMoves) def.noMove = true;
  if (c.lastStand) def.lastStand = true;
  if (c.abilityAdvantage) def.abAdv = true;
  if (k.ab) def.ab = Object.assign({ name: c.ability.name, ct: c.ability.castTime || 0 }, k.ab);
  HEROES[id] = def;
}

// ---------------- enemies ----------------
function rearmostHero(F, from, maxD) { const hs = F.units.filter(o => o.alive && o.side === 'H' && !o.summon && o.st.stealth <= 0 && (maxD === undefined || dist(o, from) <= maxD)); return hs.sort((a, b) => a.x - b.x || a.y - b.y)[0]; }
function farthestHero(F, from) { const hs = F.units.filter(o => o.alive && o.side === 'H' && !o.summon); return hs.sort((a, b) => dist(b, from) - dist(a, from) || a.x - b.x)[0]; }
function clumpOf(F, c) { return F.units.filter(o => o.alive && o.side === 'H' && dist(o, c) <= 1); }
function densestHero(F, u) { const hs = F.units.filter(o => o.alive && o.side === 'H' && o.st.stealth <= 0 && canHit(F, u, o)); let b = null, bc = -1; for (const h of hs) { const c = clumpOf(F, h).length; if (c > bc) { bc = c; b = h; } } return b; }
const rollStr = (s, r, ab) => { const p = parseDice(s); return { n: p.n, x: p.x, flat: p.flat }; };
const crushingSwing = c => function (F, u, r) { const A = c.ability; const t = acquire(F, u); if (!t || !canHit(F, u, t)) return; const s = rollStr(byRoll(A.damage, r)); abHit(F, u, t, s.n, s.x, s.flat, 'phys', r); const st = byRoll(A.stunSeconds, r); if (st > 0) applyControl(F, u, t, 'stun', st); };
const ENEMY_KITS = {
  klarg: c => ({ ab: { job: 'attack', cast: crushingSwing(c) } }),
  bugbear: c => ({ ab: { job: 'attack', cast: crushingSwing(c) } }),
  glasstaff: c => ({ ab: { cast(F, u, r) { const A = c.ability; const t = acquire(F, u); if (!t) return; const d = rollStr(A.dart.dice); for (let i = 0; i < byRoll(A.darts, r); i++) { if (!t.alive) break; abHit(F, u, t, d.n, d.x, d.flat, 'magic', r); } if (r.band === 'High') { const w = rollStr(A.highWard.dice); addWard(F, u, u, rollDice(w.n, w.x) + w.flat, false); } } } }),
  vine: c => ({ grasp: true,
    onStart(F, u) { const h = farthestHero(F, u); if (!h) return; const cl = freeCellNear(F, u.x, u.y, 'H', 1); if (cl) moveTo(F, h, cl.x, cl.y); applyControl(F, u, h, 'root', c.pullAtStart.restrainSeconds); F.pulled = h; },
    onStrike(F, u, t) { u.counters.vr = (u.counters.vr || 0) + 1; if (u.counters.vr % c.restrainEveryNthHit === 0) applyControl(F, u, t, 'root', c.restrainSeconds); } }),
  flameskull: c => ({ ab: { can: (F, u) => !!densestHero(F, u), cast(F, u, r) { const ce = densestHero(F, u); if (!ce) return; const s = rollStr(byRoll(c.ability.damage, r)); for (const h of clumpOf(F, ce)) abHit(F, u, h, s.n, s.x, s.flat, 'magic', r, { area: true }); } } }),
  ghoul: c => ({ onStrike(F, u, t) { const k = 'g' + t.fid; u.counters[k] = (u.counters[k] || 0) + 1; if (u.counters[k] % c.stunEveryNthHitOnSameHero === 0) applyControl(F, u, t, 'stun', c.stunSeconds); } }),
  venomfang: c => ({
    tick(F, u) { const B = c.halfHp; if (!u.buffet && u.hp < u.maxHp / 2) { u.buffet = 1; const s = rollStr(B.damage.dice); for (const h of adjUnits(F, u, 'H')) { dealDamage(F, u, h, rollDice(s.n, s.x) + s.flat, 'phys', {}); for (let i = 0; i < B.pushSquares; i++) if (free(F, h.x - 1, h.y)) moveTo(F, h, h.x - 1, h.y); } if (B.rechargesBreath) u.charge = u.maxCharge; } },
    ab: { can: (F, u) => !!densestHero(F, u) || F.units.some(h => h.alive && h.side === 'H'), cast(F, u, r) { const A = c.ability; let ce = densestHero(F, u) || nearest(tfoes(F, u), u); if (!ce) return; const s = rollStr(byRoll(A.damage, r)); for (const h of clumpOf(F, ce)) { abHit(F, u, h, s.n, s.x, s.flat, 'magic', r, { area: true }); addPoison(F, u, h, byRoll(A.poison, r)); } } } }),
  nezznar: c => ({
    tick(F, u) { if (!u.dark && u.hp < u.maxHp / 2) { u.dark = 1; u.st.dark = c.halfHp.seconds; for (const o of adjUnits(F, u, 'E')) o.st.dark = c.halfHp.seconds; } },
    ab: { cast(F, u, r) { const A = c.ability; const hs = F.units.filter(o => o.alive && o.side === 'H' && !o.summon).sort((a, b) => dist(a, u) - dist(b, u)).slice(0, A.heroes); const s = rollStr(byRoll(A.damage, r)); for (const h of hs) { applyControl(F, u, h, 'root', byRoll(A.restrainSeconds, r)); abHit(F, u, h, s.n, s.x, s.flat, 'magic', r, { area: true }); } } } }),
  grol: c => ({
    tick(F, u) { if (!u.enraged && u.hp < u.maxHp / 2) u.enraged = true; },
    ab: { can: (F, u) => !!rearmostHero(F, u), cast(F, u, r) { const A = c.ability; const h = rearmostHero(F, u); if (!h) return; const cl = freeCellNear(F, h.x, h.y, 'E', 1); if (cl && dist(cl, h) <= 1) { u.x = cl.x; u.y = cl.y; } u.target = h; u.lockT = h; const s = rollStr(byRoll(A.damage, r)); abHit(F, u, h, s.n, s.x, s.flat, 'phys', r); const st = byRoll(A.stunSeconds, r); if (st > 0) applyControl(F, u, h, 'stun', st); } } }),
};
const ENEMIES = {};
for (const id in EC) {
  const c = EC[id], k = ENEMY_KITS[id] ? ENEMY_KITS[id](c) : {};
  const p = parseDice(c.attack.dice);
  const atk = { n: p.n, x: p.x, iv: c.attack.interval }; if (p.flat) atk.flat = p.flat; if (c.attack.strikes) atk.strikes = c.attack.strikes; if (c.attack.type === 'magic') atk.type = 'magic';
  const def = { id, cfg: c, name: c.name, chassis: c.chassis, rank: c.rank, affix: c.affix, hp: c.hp, ac: c.ac, sr: c.sr, range: c.range, atk };
  if (c.abilityRollBonus) def.keyMod = c.abilityRollBonus;
  if (c.splash) def.splash = true;
  if (c.packAttackSpeed) { def.pack = true; def.packAttackSpeed = c.packAttackSpeed; }
  if (c.moveSeconds) def.move = c.moveSeconds;
  if (c.halfHp && c.halfHp.attackSpeedMultiplier) def.enrageMult = c.halfHp.attackSpeedMultiplier;
  for (const key of ['onStart', 'onStrike', 'tick', 'grasp']) if (k[key]) def[key] = k[key];
  if (k.ab) { const A = c.ability; def.ab = Object.assign({ name: A.name, ct: A.castTime || 0, iv: A.castSeconds || 99 }, k.ab); if (A.chargePerAttack) def.ab.perAtk = A.chargePerAttack; }
  ENEMIES[id] = def;
}
const encFromCfg = e => ({ id: e.id, name: e.name, enemies: e.enemies.map(([id, x, y]) => ({ id, x, y })), terrain: e.terrain || [] });
const ACT1 = CFG.enemies.encounters.map(encFromCfg);
const BOSSES = {}; for (const b of CFG.enemies.bosses) BOSSES[b.id] = encFromCfg(b);
