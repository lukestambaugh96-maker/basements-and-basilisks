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
// Sneak Attack (base kit, 27 Nov proposal): a bonus Thrown Dagger at the foe with +bonus dice, independent of attack speed, with an internal cooldown.
// Opportunist (passive) holds the trigger: an ally is also attacking his target. force = an effect that "triggers Sneak Attack" (skips the condition, keeps the cooldown).
function sneakNew(F, u, t, force) {
  const SA = u.def.cfg.sneakAttack, T = u.def.cfg.t2; if (!t || !t.alive || u.counters.sa > F.t) return;
  const CT = u.t2 === 0 && T.cutthroat2;
  const ok = force || F.units.some(a => a.alive && a.side === 'H' && a !== u && a.target === t) || (CT && t.hp < t.maxHp * CT.foeBelowHp);
  if (!ok) return; u.counters.sa = F.t + (CT && CT.cooldown && t.hp < t.maxHp * CT.foeBelowHp ? CT.cooldown : SA.cooldown); u.sneaks = (u.sneaks || 0) + 1;
  const a = u.atk, b = spec(u, CT && CT.bonus && t.hp < t.maxHp * CT.foeBelowHp ? CT.bonus : SA.bonus); const dmg = dealDamage(F, u, t, rollDice(a.n || 1, a.x) + u.m(a.stat || 'DEX') + rollDice(b.n, b.x) + b.flat, 'phys', { attack: true });
  if (!t.alive) { u.sneakKill = true; const PP = u.t2 === 1 && T.pickpocket2; if (PP && t.side === 'E') { F.gold += PP.goldPerSneakKill; u.goldStolen = (u.goldStolen || 0) + PP.goldPerSneakKill; onGoldDrop(F); } }
  return dmg;
}
function sneakW(F, u, t) {
  if (u.def.cfg.sneakAttack) return sneakNew(F, u, t, false);
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
        const A = c.ability, w = byRoll(A.dodgeSeconds, r); u.st.dodge = w; u.dodged = 0; u.dodgedBy = new Set();
        const GS0 = c.t2.goadingStrike; // Goading Strike, 'start' version: dare every foe nearby to swing into the dodge
        if (GS0 && u.t2 === 1 && GS0.when === 'start') for (const o of foesOf(F, u).filter(o => dist(o, u) <= GS0.reach)) applyControl(F, u, o, 'taunt', w + GS0.extraSeconds);
        u.pend.push({ t: w, fn: (F, u) => {
          const GS = c.t2.goadingStrike; // Goading Strike (path B, 26 Nov proposal): taunt every foe that swung during the dodge
          if (GS && u.t2 === 1 && GS.when !== 'start') for (const o of u.dodgedBy) if (o.alive) applyControl(F, u, o, 'taunt', GS.tauntSeconds);
          const t = acquire(F, u); if (!t || !canHit(F, u, t)) return false; const s = spec(u, A.strike);
          const RM = c.t2.riposteMaster; const stored = RM && u.t2 === 0 ? (u.storedDice || 0) : 0; u.storedDice = 0;
          const n = s.n + (A.extraDiceIfDodged || 0) * Math.min(1, u.dodged || 0) + (A.extraDicePerDodge || 0) * Math.min(A.maxDodgeDice || 0, u.dodged || 0) + stored + (r.crit ? (A.extraDiceOnNatural20 || 0) : 0);
          abHit(F, u, t, n, s.x, s.flat, 'phys', r, { crit: true }); return true; } });
      } },
    // Action Surge: Riposte (26 Nov): when an attack misses him (evaded or dodged), an immediate Longsword attack at the attacker.
    // Internal cooldown, except while Alert Strike's dodge is up (if noCooldownWhileDodging).
    onAvoid(F, u, src) { const R = c.riposte; if (!R || !src || !src.alive || src.side === u.side) return;
      if (u.st.dodge > 0 && u.dodgedBy) u.dodgedBy.add(src);
      const RM = c.t2.riposteMaster && u.t2 === 0 ? c.t2.riposteMaster : null; const cd = RM ? RM.riposteCooldown : R.cooldown;
      const inDodge = u.st.dodge > 0 && R.noCooldownWhileDodging;
      if (!inDodge && F.t < (u.counters.rip || -99)) return;
      if (!actionSurge(F, u, { crit: !!(RM && RM.riposteCrits), fallbackTarget: src })) return;
      if (!inDodge) u.counters.rip = F.t + cd;
      // Action Surge (Luke, 27 Nov): take an extra weapon attack, at his current target. Alert holds the trigger: when he dodges an attack.
      u.ripostes = (u.ripostes || 0) + 1;
      if (RM) u.storedDice = Math.min(RM.maxStoredDice, (u.storedDice || 0) + 1); }, // Riposte Master: each Riposte adds a die to the next Alert Strike
    onStart(F, u) {
      if (u.t2 === 0 && c.t2.readyFirst && !c.t2.riposteMaster) u.charge = Math.min(u.maxCharge, u.charge + c.t2.readyFirst.extraStartCharge);
      if (u.t2 === 1 && c.t2.goadingStrike) u.eva += c.t2.goadingStrike.evasionBonus;
    },
    onAttack(F, u, t) { if (u.t2 === 0 && c.t2.readyFirst && !c.t2.riposteMaster && !u.counters.rf) { u.counters.rf = 1; for (let i = 0; i < c.t2.readyFirst.extraStrikesOnFirstAttack; i++) { if (i > 0 && !t.alive) break; strike(F, u, t, {}); } } },
    onHalf(F, u) { if (u.t2 === 1 && c.t2.secondWind && !c.t2.goadingStrike) { const s = spec(u, c.t2.secondWind.heal); heal(F, u, u, rollDice(s.n, s.x) + s.flat); u.charge = u.maxCharge; } },
  }),
  bram: c => ({
    ab: { can: (F, u) => alliesOf(F, u).some(a => a.hp < a.maxHp),
      cast(F, u, r) {
        const inj = alliesOf(F, u).filter(a => a !== u && a.hp < a.maxHp); const GD0 = u.t2 === 1 && c.t2.guardian; const front = GD0 && GD0.targetFrontliner ? inj.filter(a => a.def.cfg && a.def.cfg.benchJob === 'frontline') : []; const t = (front.length ? lowestPct(front) : GD0 && GD0.targetLowest ? lowestPct(inj) : nearest(inj, u)) || u;
        const s = spec(u, c.ability.heal, r); const amt = rollDice(s.n + r.xd, s.x, r.crit, u.empower) + s.flat;
        const AN = u.t2 === 0 ? c.t2.anchor : null, GD = u.t2 === 1 ? c.t2.guardian : null; // 27 Nov proposal: solo frontline / off-tank paths
        heal(F, u, t, amt); if (t !== u) heal(F, u, u, Math.floor(amt * (AN ? AN.selfHealShare : c.ability.selfHealShare)));
        if (AN) for (const o of foesOf(F, u).filter(o => dist(o, u) <= (AN.reach || 1))) applyControl(F, u, o, 'taunt', AN.tauntSeconds);
        if (GD && t !== u) { addWard(F, u, t, Math.floor(amt * GD.wardShare), false); for (const o of adjUnits(F, t, 'E')) applyControl(F, u, o, 'taunt', GD.tauntSeconds); }
        if (u.t2 === 1 && !c.t2.guardian && c.t2.turnTheFaithless) { const b = spec(u, c.t2.turnTheFaithless.burst); for (const o of adjUnits(F, u, 'E')) dealDamage(F, u, o, rollDice(b.n, b.x, r.crit) + b.flat, 'radiant', { ability: true, area: true }); }
      } },
    // Channel Divinity (base kit, 27 Nov proposal): every fight starts with one charge, hold at most one; Disciple of Life holds the trigger.
    onStart(F, u) { if (c.channelDivinity) u.cd = 1; },
    tick(F, u) { const CD = c.channelDivinity;
      if (CD && u.cd > 0) { const lo = alliesOf(F, u).find(a => a.hp < a.maxHp * CD.triggerBelowHp); if (lo) { u.cd = 0; u.cdUses = (u.cdUses || 0) + 1; for (const a of alliesOf(F, u)) if (a.hp < a.maxHp * CD.healsAlliesBelowHp) { const s = spec(u, CD.heal); heal(F, u, a, rollDice(s.n, s.x) + s.flat); } } }
      if (CD) return;
      const P = c.t2.preserveLife; if (u.t2 === 0 && !u.counters.pl) { const lo = alliesOf(F, u).find(a => a.hp < a.maxHp * P.triggerBelowHp); if (lo) { u.counters.pl = 1; for (const a of alliesOf(F, u)) if (a.hp < a.maxHp * P.healsAlliesBelowHp) { const s = spec(u, P.heal); heal(F, u, a, rollDice(s.n, s.x) + s.flat); } } } },
  }),
  faelan: c => ({
    ab: { cast(F, u, r) { const t = lowestPctFront(F, u); const s = spec(u, c.ability.ward, r); const amt = rollDice(s.n + r.xd, s.x, r.crit, u.empower) + s.flat; addWard(F, u, t, amt, wardReplaces()); u.weaveLeft = c.arcaneRecovery ? c.arcaneRecovery.maxPerShield : c.t2.absorbsCounted;
      const PW = u.t2 === 0 && c.t2.projectedWard; if (PW) { const t2 = lowestPct(alliesOf(F, u).filter(a => a !== t)); if (t2) addWard(F, u, t2, Math.floor(amt * PW.share), false); } } },
    // Arcane Recovery (base kit, 27 Nov proposal): gain charge; Spell Weave (passive) holds the trigger: each hit one of her Wards absorbs, up to maxPerShield per Shield.
    onWardAbsorb(F, u, t) { const AR = c.arcaneRecovery;
      if (AR) { if (!(u.weaveLeft > 0)) return; u.weaveLeft--; u.charge = Math.min(u.maxCharge, u.charge + AR.charge); u.arUses = (u.arUses || 0) + 1; const SR = u.t2 === 1 && c.t2.sharedRecovery2; if (SR) { let a = t; if (SR.target === 'topDamage') a = alliesOf(F, u).filter(o => o !== u && o.ab).sort((x, y) => y.stat.dmg - x.stat.dmg)[0]; else if (SR.target === 'mostCharged') a = alliesOf(F, u).filter(o => o !== u && o.ab).sort((x, y) => y.charge / y.maxCharge - x.charge / x.maxCharge)[0]; if (a && a !== u) a.charge = Math.min(a.maxCharge, a.charge + SR.allyCharge); } return; }
      if (u.t2 == null || !(u.weaveLeft > 0)) return; u.weaveLeft--; if (u.t2 === 0) u.charge = Math.min(u.maxCharge, u.charge + c.t2.spellWeave.chargeBackPerAbsorb); else t.charge = Math.min(t.maxCharge, t.charge + c.t2.sharedRecovery.allyChargePerAbsorb); },
  }),
  wallaby: c => ({ dmgAb: true,
    ab: { can: (F, u) => tfoes(F, u).some(o => dist(o, u) <= c.ability.reach),
      cast(F, u, r) { const k = byRoll(c.ability.daggers, r); for (let i = 0; i < k; i++) { const t = lowestHp(tfoes(F, u).filter(o => dist(o, u) <= c.ability.reach)); if (!t) break; const s = spec(u, c.ability.dagger); abHit(F, u, t, s.n, s.x, s.flat, 'phys', r); if (c.sneakAttack) { if (i === 0 && c.ability.triggersSneakAttack) sneakNew(F, u, t, true); } else sneakW(F, u, t); } } },
    onStrike(F, u, t) { sneakW(F, u, t); },
    onKill(F, u, t) { const T = c.t2; if (c.sneakAttack) { const CT = u.t2 === 0 && T.cutthroat2; if (CT && !(u.counters.cutCd > F.t)) { u.counters.cutCd = F.t + CT.killCooldown; u.charge = Math.min(u.maxCharge, u.charge + CT.chargeOnKill); } return; } if (u.t2 === 0 && !(u.counters.cutCd > F.t)) { u.counters.cutCd = F.t + T.cutthroat.killCooldown; u.charge = Math.min(u.maxCharge, u.charge + T.cutthroat.chargeOnKill); } if (u.t2 === 1 && t.side === 'E') { F.gold += T.pickpocket.goldPerKill; onGoldDrop(F); } },
  }),
  dane: c => ({
    ab: { can: (F, u) => foesOf(F, u).some(o => dist(o, u) <= c.ability.reach),
      cast(F, u, r) {
        const A = c.ability; const t = deadliest(foesOf(F, u).filter(o => dist(o, u) <= A.reach)); if (!t) return;
        applyControl(F, u, t, 'taunt', byRoll(A.tauntSeconds, r)); u.duelT = t; u.target = t;
        if (A.smite) { const s = spec(u, A.smite); abHit(F, u, t, s.n, s.x, s.flat, 'radiant', r); }
        if (A.ward) { const s = spec(u, A.ward, r); addWard(F, u, u, rollDice(s.n + r.xd, s.x, r.crit) + s.flat, false); }
        if (c.smite && A.nextAttackSmites) u.smiteNext = true;
        if (u.t2 === 0 && c.t2.duelist2 && c.t2.duelist2.lockOn) u.lockT = t; // Duelist: he fights his dueled foe until it falls
      } },
    onStrike(F, u, t, dmg, crit) {
      const T = c.t2;
      if (c.smite) { // Smite (base kit, 27 Nov proposal): one definition; anything that calls for a smite uses it
        let smite = false; if (u.smiteNext) { smite = true; u.smiteNext = false; }
        if (u.t2 === 0 && T.duelist2 && u.duelT && u.duelT.alive && (u.duelT.st.taunt > 0 || T.duelist2.untilItFalls) && (T.duelist2.anyFoe || t === u.duelT)) { u.counters.duel = (u.counters.duel || 0) + 1; if (u.counters.duel % T.duelist2.everyNthHit === 0) smite = true; }
        if (u.t2 === 1 && T.retribution2 && u.retri > 0) { u.retri = 0; smite = true; }
        if (smite && t.alive) { const s = spec(u, c.smite); u.smites = (u.smites || 0) + 1; dealDamage(F, u, t, rollDice(s.n + (u.duelStacks || 0), s.x, crit) + s.flat, c.smite.type || 'radiant', { crit }); }
        return;
      }
      if (u.t2 === 0 && t === u.duelT && t.st.taunt > 0) { u.counters.duel = (u.counters.duel || 0) + 1; if (u.counters.duel % T.duelist.everyNthHit === 0) { const s = spec(u, T.duelist.smite); dealDamage(F, u, t, rollDice(s.n, s.x, crit) + s.flat, 'radiant', { crit }); } }
      if (u.t2 === 1 && u.retri > 0 && t.alive) { u.retri = 0; const s = spec(u, T.retribution.smite); dealDamage(F, u, t, rollDice(s.n, s.x, crit) + s.flat, 'radiant', { crit }); }
    },
    carryKeys: ['duelStacks'],
    tick(F, u) { const D = c.t2.duelist3; if (u.t2 === 0 && D && u.duelT && !u.duelT.alive && !u.duelT.duelCounted) { u.duelT.duelCounted = true; if (!D.whileTaunted || u.duelT.st.taunt > 0) u.duelStacks = Math.min(D.maxDice || 99, (u.duelStacks || 0) + D.dicePerKill); } }, // Duelist (Luke, 27 Nov): each dueled foe that dies adds a die to his Smite
    onHitTaken(F, u, src) { if (u.t2 === 1 && src && src === u.duelT && (src.st.taunt > 0 || (c.t2.retribution2 && c.t2.retribution2.anyTime))) u.retri = 1; },
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


// ---------------- batch 1 reworks (27 Nov, proposals): used when a hero's config has "kit2"; the old kit stays for the prototype2 preset ----------------
// Action Surge (Fighter): take an extra weapon attack at the current target (with re-entrancy guard against loops).
function actionSurge(F, u, o = {}) {
  if (u._inSurge) return false;
  let t = acquire(F, u);
  if (!t || !canHit(F, u, t)) t = o.fallbackTarget && o.fallbackTarget.alive && canHit(F, u, o.fallbackTarget) ? o.fallbackTarget : null;
  if (!t) return false;
  u._inSurge = true;
  u.surges = (u.surges || 0) + 1;
  ev(F, { k: 'surge', u, t });
  strike(F, u, t, { crit: !!o.crit });
  u._inSurge = false;
  return true;
}
const itemsHeld = u => u.itemCount || 0;
const KITS2 = {
  gilthrax: c => { const K = c.kit2; return {
    ab: { cast(F, u, r) {
      const A = c.ability; const s = spec(u, K.ward, r); let amt = rollDice(s.n + r.xd, s.x, r.crit) + s.flat;
      amt += K.wardPerItem * itemsHeld(u) + K.wardPerRareItem * (u.rareCount || 0); // Gilded Hoard (passive)
      addWard(F, u, u, amt, false);
      const dur = byRoll(A.tauntAdjacentSeconds, r); if (dur > 0) for (const o of adjUnits(F, u, 'E')) applyControl(F, u, o, 'taunt', dur);
    } },
    onStart(F, u) { const GS = u.t2 === 1 && K.t2.gildedScales; if (GS) { u.ac += GS.acPerItem * itemsHeld(u); u.sr += GS.srPerItem * itemsHeld(u); } },
    // Dragon's Hoard (passive): when his Ward breaks, he triggers Action Surge once for each item he holds.
    onWardBreak(F, u) {
      for (let i = 0; i < Math.min(K.maxSurgesPerBreak, itemsHeld(u) + (K.surgesBare || 0)); i++) actionSurge(F, u);
      const DR = u.t2 === 0 && K.t2.dragonsRetort; if (!DR) { u.wardAbs = 0; return; }
      const amt = Math.floor(u.wardAbs * (DR.shareOfAbsorbed + DR.sharePerItem * itemsHeld(u))); u.wardAbs = 0; if (amt <= 0) return;
      for (const o of foesOf(F, u)) { const dx = o.x - u.x; if (dx >= 0 && dx <= 2 && Math.abs(o.y - u.y) <= Math.max(1, dx)) dealDamage(F, u, o, amt, 'magic', { area: true }); }
    },
  }; },
  zoe: c => { const K = c.kit2; return {
    ab: { cast(F, u, r) {
      const QM = u.t2 === 1 && K.t2.quartermaster; const k = byRoll(c.ability.allies, r) + (QM ? QM.extraSupplies : 0); const used = new Set();
      for (let i = 0; i < k; i++) rummage2(F, u, r, used, K, QM);
      actionSurge(F, u); // Quartermaster's Drill (passive): each Rummage triggers Action Surge
      const RK = u.t2 === 0 && K.t2.runeKnight; if (RK) { u.giantT = F.t + RK.seconds; const w = spec(u, RK.ward); addWard(F, u, u, rollDice(w.n, w.x, r.crit) + w.flat, false); }
    } },
    onStrike(F, u, t, dmg, crit) { const RK = u.t2 === 0 && K.t2.runeKnight; if (RK && u.giantT > F.t && t.alive) { const s = spec(u, RK.bonus); dealDamage(F, u, t, rollDice(s.n, s.x, crit) + s.flat, 'phys', { crit }); } },
  }; },
  laurel: c => { const K = c.kit2; return { dmgAb: true,
    ab: { can: (F, u) => hasTarget(F, u),
      cast(F, u, r) { const t = acquire(F, u); if (!t || !canHit(F, u, t)) return; const s = spec(u, c.ability.damage, r); let dmg = abHit(F, u, t, s.n, s.x, s.flat, 'phys', r); dmg += smite2(F, u, t, r.crit, K); const h = Math.floor(dmg * c.ability.healShareOfDamage); heal(F, u, u, h); for (const a of adjUnits(F, u, 'H')) heal(F, u, a, h); } },
    onStrike(F, u, t, dmg, crit) {
      let total = dmg; const W = u.t2 === 0 && K.t2.warden, B = u.t2 === 1 && K.t2.bruiser;
      if (W && t.alive) { u.counters.sm = (u.counters.sm || 0) + 1; if (u.counters.sm % W.everyNthHit === 0) { total += smite2(F, u, t, crit, K); applyControl(F, u, t, 'root', W.restrainSeconds); } }
      const h = Math.floor(total * K.hitHealShare); if (h > 0) { for (const a of adjUnits(F, u, 'H')) heal(F, u, a, h); if (B) heal(F, u, u, Math.floor(total * B.selfHealShare)); } // Ancients' Mercy (passive)
    },
    onStart(F, u) { const B = u.t2 === 1 && K.t2.bruiser; if (B) u.as += B.attackSpeed; },
  }; },
  pillar: c => { const K = c.kit2; return { dmgAb: true,
    onStart(F, u) { const UB = u.t2 === 0 && K.t2.unbreakable; if (UB && UB.flatAc) u.ac += UB.flatAc; },
    ab: { can: (F, u) => foesOf(F, u).some(o => dist(o, u) <= K.quake.reach + (u.t2 === 1 && K.t2.avalanche ? K.t2.avalanche.extraReach : 0)),
      cast(F, u, r) { const Q = K.quake; const AV = u.t2 === 1 && K.t2.avalanche; const reach = Q.reach + (AV ? AV.extraReach : 0); const s = spec(u, Q.damage, r); const st = byRoll(Q.stunSeconds, r); let n = 0;
        const rageDice = AV && AV.bonusDiePerStack && (u.rage2 || 0) > 0 ? rollDice(u.rage2, AV.bonusDiePerStack, r.crit) : 0;
        for (const o of foesOf(F, u).filter(o => dist(o, u) <= reach)) { abHit(F, u, o, s.n, s.x, s.flat + rageDice, 'phys', r, { area: true }); if (applyControl(F, u, o, 'stun', st)) n++; }
        const UB = u.t2 === 0 && K.t2.unbreakable; if (UB && n) {
          let wAmt = 0;
          if (UB.wardPerFoe) { const ws = spec(u, UB.wardPerFoe); wAmt += rollDice(ws.n * n, ws.x, r.crit) + ws.flat * n; }
          else if (UB.wardShareOfHpPerFoe) wAmt += Math.floor(u.maxHp * UB.wardShareOfHpPerFoe * n);
          if (UB.wardPerStack) wAmt += UB.wardPerStack * u.tier * (u.rage2 || 0);
          if (wAmt > 0) addWard(F, u, u, wAmt, false);
        } } },
    // Maul: slow heavy swing; separate splash instance (splashDice or legacy splashShare) + Slow. Rage: unlimited stacks, +1 Maul damage per stack.
    onStrike(F, u, t, dmg, crit) { const M = K.maul;
      const extra = (M.hpShare ? Math.floor(u.maxHp * M.hpShare) : 0) + (u.rage2 || 0) * (K.rage.dmgPerStack || 1);
      if (t.alive && extra > 0) dealDamage(F, u, t, extra, 'phys', {});
      if (t.alive) applyControl(F, u, t, 'slow', M.slowSeconds, M.slow);
      for (const o of adjUnits(F, t, 'E')) {
        let spDmg = 0;
        if (M.splashDice) { const ss = spec(u, M.splashDice); spDmg = rollDice(ss.n, ss.x, false) + ss.flat; }
        else if (M.splashShare) { const s = rollDice(u.atk.n * u.tier, u.atk.x) + u.m('STR'); spDmg = Math.floor((s + extra) * M.splashShare); }
        if (spDmg > 0) dealDamage(F, u, o, spDmg, 'phys', { area: true });
        applyControl(F, u, o, 'slow', M.slowSeconds, M.slow);
      } },
    onHitTaken(F, u) { const before = u.rage2 || 0; const nth = K.rage.everyNthHit || 1;
      u.counters.rh = (u.counters.rh || 0) + 1; if (u.counters.rh % nth !== 0) return;
      u.rage2 = K.rage.maxStacks ? Math.min(K.rage.maxStacks, before + 1) : before + 1;
      const UB = u.t2 === 0 && K.t2.unbreakable; if (UB && UB.acPerStack && u.rage2 > before) {
        const gained = u.rageAcGained || 0; const cap = UB.acCap || 999; const add = Math.min(UB.acPerStack, Math.max(0, cap - gained));
        if (add > 0) { u.ac += add; u.rageAcGained = gained + add; }
      } },
  }; },
  zark: c => { const K = c.kit2; return { dmgAb: true, lastStand: true,
    ab: { can: (F, u) => foesOf(F, u).some(o => dist(o, u) <= 1),
      cast(F, u, r) { const s = spec(u, c.ability.damage, r); const WT = u.t2 === 1 && K.t2.wolfTotem; const maxW = WT && WT.maxBonusDice ? WT.maxBonusDice : 99; const xn = WT && WT.swingDicePerStack ? Math.min(maxW, WT.swingDicePerStack * (u.rage2 || 0)) : 0; const wDie = WT && WT.swingDie;
        for (const o of foesOf(F, u).filter(o => dist(o, u) <= 1)) {
          if (wDie && xn > 0) { abHit(F, u, o, s.n, s.x, s.flat + rollDice(xn, wDie, r.crit), 'phys', r, { area: true }); }
          else abHit(F, u, o, s.n + xn, s.x, s.flat, 'phys', r, { area: true });
        }
        const sd = spec(u, c.ability.selfDamage); dealDamage(F, u, u, rollDice(sd.n, sd.x) + sd.flat, 'true', { self: true }); } },
    // Rage: +1 stack per damage threshold taken (unlimited when maxStacks is null); stacks fade every fadeSeconds.
    onHitTaken(F, u, src, raw) { const R = K.rage; u.rageDmg = (u.rageDmg || 0) + raw; const per = R.damagePerStack ? R.damagePerStack * u.tier : u.maxHp * R.hpSharePerStack; while (u.rageDmg >= per) { u.rageDmg -= per; const was = u.rage2 || 0; u.rage2 = R.maxStacks ? Math.min(R.maxStacks, was + 1) : was + 1; if (!R.fadeUnconditional || was === 0) u.rageFade = F.t + R.fadeSeconds; } },
    perSecond(F, u) { const R = K.rage; if (!(u.rage2 > 0)) return; if (F.t >= u.rageFade) { u.rage2--; u.rageFade = F.t + R.fadeSeconds; }
      if (!(u.rage2 > 0)) return;
      const BT = u.t2 === 0 && K.t2.bearTotem;
      if (R.flatRegenPerStack != null) {
        u.rageTick = (u.rageTick || 0) + 1;
        const iv = R.regenInterval || 1;
        if (u.rageTick >= iv) { u.rageTick = 0; const tierMult = R.scaleRegenByTier === false ? 1 : u.tier; const amt = R.flatRegenPerStack * tierMult * u.rage2 * (BT ? BT.regenMultiplier : 1); heal(F, u, u, amt); }
      } else {
        const per = (R.regenPerStack + R.regenPerConMod * u.m('CON')) * u.tier * (BT ? BT.regenMultiplier : 1); heal(F, u, u, per * u.rage2);
      }
      const WT = u.t2 === 1 && K.t2.wolfTotem; if (WT && WT.allyAttackSpeedPerStack) for (const a of adjUnits(F, u, 'H')) { a.st.haste = WT.allyAttackSpeedPerStack * u.rage2; a.st.hasteT = 1.1; } },
  }; },
  naill: c => { const K = c.kit2; return { dmgAb: true,
    ab: { can: (F, u) => hasTarget(F, u) || (u.t2 === 1 && (u.ki2 || 0) >= K.ki.max && tfoes(F, u).length > 0),
      cast(F, u, r) {
        const T = K.t2; let t = acquire(F, u); const full = (u.ki2 || 0) >= K.ki.max;
        if (u.t2 === 1 && T.stepOfTheWind && full) { const far = tfoes(F, u).sort((a, b) => b.x - a.x)[0]; const cl = far && freeCellNear(F, far.x, far.y, 'H', 1); if (cl && dist(cl, far) <= 1) { moveTo(F, u, cl.x, cl.y); t = far; u.target = far; } }
        const k = byRoll(c.ability.strikes, r) + Math.floor((u.ki2 || 0) / K.ki.kiPerExtraStrike); const s = spec(u, c.ability.strike);
        for (let i = 0; i < k; i++) { if (!t || !t.alive) t = acquire(F, u); if (!t || !canHit(F, u, t)) break; abHit(F, u, t, s.n, s.x, s.flat, 'phys', r); if (i === k - 1 && u.t2 === 0 && T.stunningStrike && full) applyControl(F, u, t, 'stun', T.stunningStrike.stunSeconds); }
      } },
    // Ki: +1 on every hit, up to ki.max, never spent; each Ki point: attacks ki.attackSpeedPerKi faster.
    onStrike(F, u) { const before = u.ki2 || 0; u.ki2 = Math.min(K.ki.max, before + 1); if (u.ki2 !== before) u.as += K.ki.attackSpeedPerKi; },
  }; },
};
function rummage2(F, u, r, used, K, QM) {
  const C = u.def.cfg.ability; const al = alliesOf(F, u).filter(a => !used.has(a)); if (!al.length) return;
  let t, kind; const low = lowestPct(al);
  if (low && pct(low) < C.potionBelowHp) { t = low; kind = 'potion'; }
  else { const tank = al.slice().sort((a, b) => b.stat.taken - a.stat.taken)[0]; if (tank && tank.stat.taken > 0 && tank.ward < 5) { t = tank; kind = 'shield'; } else { t = al.slice().sort((a, b) => b.stat.dmg - a.stat.dmg)[0]; kind = 'whet'; } }
  used.add(t); const extra = K.dicePerAllyItem * (t.itemCount || 0); const crit = r && r.crit; // supplies grow with the items the ally holds
  if (kind === 'potion') { const s = spec(u, C.potion); heal(F, u, t, rollDice(s.n + extra, s.x, crit) + s.flat); }
  else if (kind === 'shield') { const s = spec(u, C.spareShield); addWard(F, u, t, rollDice(s.n + extra, s.x, crit) + s.flat, false); }
  else { const s = spec(u, C.whetstone); t.whet = C.whetstone.attacks; t.whetN = s.n + extra; }
  if (QM) t.charge = Math.min(t.maxCharge, t.charge + QM.allyCharge);
}
function smite2(F, u, t, crit, K) { if (!t.alive) return 0; const s = spec(u, K.smite); u.smites = (u.smites || 0) + 1; return dealDamage(F, u, t, rollDice(s.n, s.x, crit) + s.flat, 'radiant', { crit }); }


// ---------------- batch 2 reworks (27 Nov, proposals): Favored Foe + Hunter's Mark tag, Pact + Hex tag, Sneak Attack force bypass ----------------
Object.assign(KITS2, {
  lorcan: c => { const K = c.kit2; return {
    ab: { can: (F, u) => hasTarget(F, u), cast(F, u, r) { u.twinT = F.t + byRoll(c.ability.seconds, r); u.twinCrit = r.crit; } },
    // Longbow applies Hunter's Mark (pure tag). Favored Foe: when attacking a target with Hunter's Mark, deal bonus dice.
    onStrike(F, u, t, dmg, crit) {
      if (!t.alive) return;
      if (t.st.marked) {
        const CS = u.t2 === 0 && K.t2.colossusSlayer;
        const s = spec(u, CS && t.hp > t.maxHp * CS.aboveHp ? CS.bonus : K.favoredFoe);
        dealDamage(F, u, t, rollDice(s.n, s.x, crit) + s.flat, 'phys', { crit });
      }
      if (t.alive) applyHuntersMark(F, u, t);
    },
    onAttack(F, u, t) {
      if (u.twinT > F.t && t.alive) strike(F, u, t, { crit: u.twinCrit });
      if (u.hb && u.t2 === 1) {
        u.hb = 0;
        const adj = adjUnits(F, t, 'E');
        const list = K.t2.hordeBreaker && K.t2.hordeBreaker.cleaveAll ? adj : adj.slice(0, 1);
        for (const a of list) if (a.alive) strike(F, u, a, {});
      }
    },
    // Horde Breaker: when any Marked foe dies, mark the nearest foe and next attack cleaves an adjacent foe.
    onMarkedDeath(F, u, t) {
      const HB = u.t2 === 1 && K.t2.hordeBreaker; if (!HB) return;
      u.hb = 1; const n = nearest(tfoes(F, u), t); if (n) applyHuntersMark(F, u, n);
    },
  }; },
  corvin: c => { const K = c.kit2; return { dmgAb: true,
    // Favored Foe: when attacking a target with Hunter's Mark, Twin Shortswords strike twice and Slow the target.
    strikesVs: (F, u, t) => (t.st.marked && t.alive ? c.attack.strikesVsMarked : (c.attack.strikes || 1)),
    ab: { can: (F, u) => hasTarget(F, u),
      cast(F, u, r) {
        const t = acquire(F, u); if (!t) return; const k = byRoll(c.ability.strikes, r);
        applyHuntersMark(F, u, t);
        const s = spec(u, c.ability.strike);
        for (let i = 0; i < k && t.alive; i++) abHit(F, u, t, s.n, s.x, s.flat, 'phys', r);
        const FS = u.t2 === 1 && K.t2.firstStrike;
        if (FS && !u.counters.fs) { u.counters.fs = 1; for (const a of alliesOf(F, u)) if (a !== u) a.charge = Math.min(a.maxCharge, a.charge + FS.allyCharge); }
      } },
    onStrike(F, u, t) {
      if (t.alive && t.st.marked && K.favoredFoe && K.favoredFoe.slow) applyControl(F, u, t, 'slow', K.favoredFoe.slowSeconds || 1, K.favoredFoe.slow);
    },
    onAttack(F, u, t) {
      const SF = u.t2 === 0 && K.t2.stalkersFlurry;
      if (SF && t.st.marked && t.alive) { u.counters.sf = (u.counters.sf || 0) + 1; if (u.counters.sf % SF.everyNthAttack === 0) strike(F, u, t, {}); }
    },
    onMarkedDeath(F, u) {
      const FS = u.t2 === 1 && K.t2.firstStrike;
      if (FS && FS.chargeOnMarkedKill) u.charge = Math.min(u.maxCharge, u.charge + FS.chargeOnMarkedKill);
    },
  }; },
  velith: c => { const K = c.kit2;
    // Sneak Attack: bonus Venom Dagger (+bonus dice, +poison), internal cooldown. force = skip condition, keep cooldown (same rule as Wallaby).
    const sneak = (F, u, t, force) => {
      const SA = K.sneakAttack; if (!t || !t.alive || u.counters.sa > F.t) return;
      if (!force && !(t.st.poison > 0) && !(u.st.stealth > 0)) return;
      u.counters.sa = F.t + SA.cooldown; u.sneaks = (u.sneaks || 0) + 1;
      const s = spec(u, SA.bonus); const a = u.atk;
      dealDamage(F, u, t, rollDice(a.n || 1, a.x) + u.m('DEX') + rollDice(s.n, s.x) + s.flat, 'phys', { attack: true });
      if (SA.poison && t.alive) addPoison(F, u, t, SA.poison);
      const PO = u.t2 === 1 && K.t2.poisoner; if (PO) for (const o of adjUnits(F, t, 'E')) addPoison(F, u, o, PO.spreadPoison);
      const AS = u.t2 === 0 && K.t2.assassin; if (AS && t.alive && !t.boss && t.hp < t.maxHp * AS.executeBelowHp) dealDamage(F, u, t, t.hp + t.ward + 1, 'true', {});
    };
    return { dmgAb: true,
    onStart(F, u) { u.st.stealth = c.startStealthSeconds; },
    ab: { can: (F, u) => tfoes(F, u).length > 0,
      cast(F, u, r) {
        const A = c.ability; const pois = A.poisonBase + A.poisonPerTier * u.tier; const s = spec(u, A.strike);
        if (r.band === 'Low') { const t = acquire(F, u); if (!t || !canHit(F, u, t)) return; abHit(F, u, t, s.n, s.x, s.flat, 'phys', r); addPoison(F, u, t, pois); sneak(F, u, t, true); return; }
        const list = tfoes(F, u); const t = lowestHp(list.filter(o => dist(o, u) <= A.jumpReach)) || lowestHp(list); if (!t) return;
        const cl = free(F, t.x + 1, t.y) ? { x: t.x + 1, y: t.y } : freeCellNear(F, t.x, t.y, 'E', 1); if (cl && dist(cl, t) <= 1) moveTo(F, u, cl.x, cl.y);
        u.target = t; abHit(F, u, t, s.n, s.x, s.flat, 'phys', r, { crit: true }); addPoison(F, u, t, pois); if (r.band === 'High') addPoison(F, u, t, pois); sneak(F, u, t, true);
        if (r.crit && t.alive && !t.boss && t.hp < t.maxHp * A.executeBelowHp) dealDamage(F, u, t, t.hp + t.ward + 1, 'true', {});
      } },
    // Venom Dagger: hits apply Poison; Assassinate triggers Sneak Attack on Poisoned foes or from Stealth.
    onStrike(F, u, t) { if (K.daggerPoison && t.alive) addPoison(F, u, t, K.daggerPoison); sneak(F, u, t, false); },
  }; },
  nettle: c => { const K = c.kit2; return { dmgAb: true,
    ab: { can: (F, u) => hasTarget(F, u),
      cast(F, u, r) {
        const A = c.ability; const t = acquire(F, u); if (!t) return;
        applyHex(F, u, t);
        const s = spec(u, A.damage); abHit(F, u, t, s.n, s.x, s.flat, A.type, r);
        const bp = byRoll(A.burnPerTier, r); if (bp > 0) addBurn(F, u, t, bp * u.tier + (r.band === 'High' ? A.burnHighBonus : 0));
      } },
    onStrike(F, u, t, dmg, crit) {
      if (t.st.hexed && t.alive && K.hexBonus) { const s = spec(u, K.hexBonus); dealDamage(F, u, t, rollDice(s.n, s.x, crit) + s.flat, 'magic', { crit }); }
    },
    // Pact of the Fiend: whenever any Hexed foe dies, Nettle gains a Ward.
    onHexedDeath(F, u, t) {
      u.pacts = (u.pacts || 0) + 1;
      const FF = u.t2 === 1 && K.t2.fiendsFavor;
      const w = spec(u, K.pactWard);
      const mult = FF && FF.wardMultiplier ? FF.wardMultiplier : 1;
      addWard(F, u, u, (rollDice(w.n, w.x) + w.flat) * mult, false);
      if (FF && FF.attackSpeed) { u.st.haste = FF.attackSpeed; u.st.hasteT = FF.seconds; }
      const HP = u.t2 === 0 && K.t2.hellfirePact;
      if (HP) {
        const s = spec(u, HP.explosion);
        for (const o of adjUnits(F, t, 'E')) dealDamage(F, u, o, rollDice(s.n, s.x) + s.flat, 'magic', { area: true });
        const n = nearest(tfoes(F, u), t); if (n) applyHex(F, u, n);
      }
    },
  }; },
  lumen: c => { const K = c.kit2; return { dmgAb: true,
    ab: { can: (F, u) => hasTarget(F, u),
      cast(F, u, r) {
        const t = acquire(F, u); if (!t) return;
        const SL = u.t2 === 0 && (K.t2.searingLight || K.t2.radiantSoul);
        const s = spec(u, c.ability.damage, r); let hits = 0;
        for (const cl of lineCells(u, t)) {
          const o = unitAt(F, cl.x, cl.y);
          if (o && o.side === 'E') {
            applyHex(F, u, o);
            abHit(F, u, o, s.n + (SL ? SL.extraDicePerFoeHit * hits : 0), s.x, s.flat, c.ability.type, r, { area: true });
            hits++;
          }
        }
      } },
    // Sacred Beam applies Hex (pure tag). Path A (Searing Light): +beamBonus radiant vs Hexed foes.
    onStrike(F, u, t, dmg, crit) {
      if (!t.alive) return;
      const SL = u.t2 === 0 && (K.t2.searingLight || K.t2.radiantSoul);
      if (SL && SL.beamBonus && t.st.hexed) { const s = spec(u, SL.beamBonus); dealDamage(F, u, t, rollDice(s.n, s.x, crit) + s.flat, 'radiant', { crit }); }
      if (t.alive) applyHex(F, u, t);
    },
    // Pact of the Celestial (separate from casts): whenever Lumen damages a Hexed foe (internal CD), heal his most-hurt ally.
    onHexedDamage(F, u) {
      const P = K.pact; if (!P) return;
      const HL = u.t2 === 1 && K.t2.healingLight;
      const cd = HL && HL.cooldown != null ? HL.cooldown : P.cooldown;
      if (u.counters.pactCd > F.t) return;
      u.counters.pactCd = F.t + cd;
      u.pacts = (u.pacts || 0) + 1;
      const count = HL && HL.allies ? HL.allies : 1;
      const al = alliesOf(F, u).slice().sort((a, b) => pct(a) - pct(b));
      const hSpec = HL && HL.heal ? HL.heal : P.heal;
      const h = spec(u, hSpec);
      for (const a of al.slice(0, count)) heal(F, u, a, rollDice(h.n, h.x) + h.flat);
    },
  }; },
});

// ---------------- batch 3 reworks (27 Nov, proposals) ----------------
Object.assign(KITS2, {
  cinder: c => { const K = c.kit2; const maxSp = (K.metamagic && K.metamagic.maxSp) || 4;
    return { dmgAb: true,
    onStart(F, u) {
      const BV = u.t2 === 1 && K.t2.livingFlame;
      if (BV && BV.attackStat) {
        u.atk = Object.assign({}, u.atk, { stat: BV.attackStat, flat: BV.attackFlat != null ? BV.attackFlat : 0 });
        if (BV.attackDice) { const p = parseDice(BV.attackDice); u.atk.n = p.n; u.atk.x = p.x; u.atk.tierDice = !!BV.attackPerTier; }
      }
    },
    strikesVs: (F, u) => {
      const BV = u.t2 === 1 && K.t2.livingFlame;
      if (!BV || !BV.stacksPerExtraBolt) return 1;
      const st = u.flameStacks || 0;
      const extra = BV.firstBoltAt1 ? Math.ceil(st / BV.stacksPerExtraBolt) : Math.floor(st / BV.stacksPerExtraBolt);
      return 1 + (BV.maxExtraBolts != null ? Math.min(BV.maxExtraBolts, extra) : extra);
    },
    // Passive (Draconic Spark): each Fire Bolt attack grants +1 Sorcery Point (max 4).
    onAttack(F, u) { u.sp = Math.min(maxSp, (u.sp || 0) + 1); },
    ab: {
      can: (F, u) => u.t2 === 1 && K.t2.livingFlame ? tfoes(F, u).length > 0 : tfoes(F, u).some(o => canHit(F, u, o)),
      cast(F, u, r) {
        // Metamagic (Twin Spell): at 4 Sorcery Points, spend all 4 to cast twice.
        let casts = 1;
        if ((u.sp || 0) >= maxSp) { u.sp = 0; casts = 2; u.twins = (u.twins || 0) + 1; }
        const BV = u.t2 === 1 && K.t2.livingFlame;
        if (BV) {
          const perCast = BV.stacksByRoll ? byRoll(BV.stacksByRoll, r) : 1;
          const add = perCast * casts;
          u.flameStacks = (u.flameStacks || 0) + add;
          u.as += BV.asPerStack * add;
          return;
        }
        const A = c.ability, SE = u.t2 === 0 && K.t2.scorchedEarth;
        const raySpec = K.ray || A.ray;
        const s = spec(u, raySpec, r);
        const raysPerCast = K.rays ? (typeof K.rays === 'number' ? K.rays : byRoll(K.rays, r)) : byRoll(A.rays, r);
        for (let k = 0; k < casts; k++) {
          const list = tfoes(F, u).filter(o => canHit(F, u, o)).sort((a, b) => dist(a, u) - dist(b, u));
          if (!list.length) break;
          for (let i = 0; i < raysPerCast; i++) {
            const aliveFoes = list.filter(o => o.alive); if (!aliveFoes.length) break;
            const t = aliveFoes[i % Math.min(A.targets || 3, aliveFoes.length)];
            const tx = t.x, ty = t.y;
            abHit(F, u, t, s.n, s.x, s.flat, A.type, r);
            if (SE) {
              if (SE.splash) {
                const sp = spec(u, SE.splash);
                for (const o of adjUnits(F, { x: tx, y: ty }, 'E')) if (o !== t) dealDamage(F, u, o, rollDice(sp.n, sp.x, r.crit) + sp.flat, A.type, { ability: true, area: true });
              }
              if (SE.fireDot) {
                const fd = spec(u, SE.fireDot);
                const rad = SE.fireRadius || 0;
                for (let dy = -rad; dy <= rad; dy++) for (let dx = -rad; dx <= rad; dx++) igniteTile(F, u, tx + dx, ty + dy, SE.fireSeconds || 3, fd);
              }
            }
          }
        }
      },
    },
  }; },
  gains: c => { const K = c.kit2; return { dmgAb: true,
    // Arcane Recovery (base kit): whenever gold drops in combat, gain charge.
    onGoldDrop(F, u) {
      const ar = K.arcaneRecovery; if (!ar) return;
      u.charge = Math.min(u.maxCharge, u.charge + ar.charge);
      u.arUses = (u.arUses || 0) + 1;
      const LA = u.t2 === 1 && K.t2.liquidAssets;
      if (LA && LA.allyCharge) for (const a of alliesOf(F, u)) if (a !== u) a.charge = Math.min(a.maxCharge, a.charge + LA.allyCharge);
    },
    ab: { can: (F, u) => tfoes(F, u).some(o => canHit(F, u, o)),
      cast(F, u, r) {
        const A = c.ability; const list = tfoes(F, u).filter(o => canHit(F, u, o));
        const t = highestHp(list.length ? list : tfoes(F, u)); if (!t) return;
        const LA = u.t2 === 1 && K.t2.liquidAssets;
        const goldAmt = LA && LA.gildedGold ? LA.gildedGold : 1;
        // Gild BEFORE damage resolves so one-shot kills still drop gold and trigger Arcane Recovery!
        t.gilded = true; t.gildedGold = Math.max(t.gildedGold || 0, goldAmt);
        if (r.band === 'High') { const adj = adjUnits(F, t, 'E')[0]; if (adj) { adj.gilded = true; adj.gildedGold = Math.max(adj.gildedGold || 0, goldAmt); } }
        const s = spec(u, K.beam || A.damage, r);
        const CI = u.t2 === 0 && K.t2.compoundInterest;
        let extraDice = 0;
        if (CI) extraDice = (CI.baseBonusDice || 0) + Math.min(CI.maxDice || 8, (CI.dicePerStep || 1) * Math.floor((F.runGold || 0) / (CI.goldPerStep || 10)));
        const dmg = abHit(F, u, t, s.n + extraDice, s.x, s.flat, A.type, r);
        if (dmg > 0 && K.goldOnBeamHit) {
          const hitG = LA && LA.goldOnBeamHit ? LA.goldOnBeamHit : K.goldOnBeamHit;
          F.gold += hitG; fx(F, t, `+${hitG}g`, '#ffd75e');
          for (let i = 0; i < hitG; i++) onGoldDrop(F);
        }
      } },
  }; },
  rosalind: c => { const K = c.kit2; return {
    // Dissonant Whispers (Bard spell) + Bardic Inspiration (die spent on ally's next cast).
    ab: { can: (F, u) => tfoes(F, u).length > 0,
      cast(F, u, r) {
        const CW = u.t2 === 0 && K.t2.cuttingWords, HE = u.t2 === 1 && K.t2.heroism;
        const foes = tfoes(F, u).slice().sort((a, b) => (deadliest([a, b]) === a ? -1 : 1));
        const targets = foes.slice(0, CW && CW.targets ? CW.targets : 1);
        const ws = spec(u, K.whispers.damage, r);
        for (const f of targets) {
          abHit(F, u, f, ws.n, ws.x, ws.flat, 'magic', r, { area: targets.length > 1 });
          if (f.alive) {
            if (r.band === 'High' && K.whispers.highStunSeconds) applyControl(F, u, f, 'stun', K.whispers.highStunSeconds);
            else if (K.whispers.slow) applyControl(F, u, f, 'slow', K.whispers.slowSeconds || 2, K.whispers.slow);
          }
        }
        // Grant Bardic Inspiration die to top damage dealer(s).
        const al = alliesOf(F, u).filter(a => a !== u && a.ab);
        const pool = al.length ? al : [u];
        const k = r.crit ? 99 : byRoll(K.inspiration.allies, r);
        pool.sort((a, b) => (!!a.bardDie - !!b.bardDie) || (b.stat.dmg - a.stat.dmg) || dist(a, u) - dist(b, u));
        const bdSpec = spec(u, K.inspiration.die);
        for (const a of pool.slice(0, k)) {
          a.bardDie = {
            n: bdSpec.n, x: bdSpec.x, flat: bdSpec.flat, src: u,
            onSpend: CW ? (F2, src, ally) => {
              const att = ally.lastHitBy && ally.lastHitBy.alive && ally.lastHitBy.side === 'E' ? ally.lastHitBy : nearest(tfoes(F2, ally), ally);
              if (att) {
                const cs = spec(src, CW.damage);
                dealDamage(F2, src, att, rollDice(cs.n, cs.x) + cs.flat, 'magic', { ability: true });
                if (att.alive && CW.slow) applyControl(F2, src, att, 'slow', CW.slowSeconds || 2, CW.slow);
              }
            } : null,
          };
          if (HE) {
            if (HE.ward) { const w = spec(u, HE.ward); addWard(F, u, a, rollDice(w.n, w.x, r.crit) + w.flat, false); }
            if (HE.attackSpeed) { a.st.haste = Math.max(a.st.haste || 0, HE.attackSpeed); a.st.hasteT = Math.max(a.st.hasteT || 0, HE.seconds || 4); }
          }
        }
      } },
  }; },
  jamison: c => { const K = c.kit2; return {
    onStart(F, u) { u.cd = 1; }, // Channel Divinity: 1 charge at fight start, max 1
    // Emboldening Bond: binds Jamison + allies; any heal, Ward, or attack-speed buff is passed to all Bonded allies.
    ab: { cast(F, u, r) {
      const BP = u.t2 === 0 && K.t2.balmOfPeace, PB = u.t2 === 1 && K.t2.protectiveBond;
      const share = BP && BP.bondShare != null ? BP.bondShare : K.bond.share;
      const dur = K.bond.seconds;
      const al = alliesOf(F, u).filter(a => a !== u);
      const k = r.crit ? 99 : byRoll(K.bond.allies, r);
      al.sort((a, b) => ((a.st.bond > 1) - (b.st.bond > 1)) || pct(a) - pct(b));
      const bonded = [u, ...al.slice(0, k)];
      for (const a of bonded) { a.st.bond = dur; a.bondBy = u; a.bondShare = share; }
      const tgt = lowestPct(bonded) || u;
      if (K.bond.heal) { const h = spec(u, K.bond.heal, r); heal(F, u, tgt, rollDice(h.n + r.xd, h.x, r.crit) + h.flat); }
      if (K.bond.ward) { const w = spec(u, K.bond.ward, r); addWard(F, u, tgt, rollDice(w.n, w.x, r.crit) + w.flat, false); }
      if (BP && BP.selfHeal) { const sh = spec(u, BP.selfHeal); heal(F, u, u, rollDice(sh.n, sh.x, r.crit) + sh.flat); }
      // Protective Bond: restores Channel Divinity once on his Nth cast.
      if (PB && PB.restoreOnCast && !u.counters.cdRestored && (u.casts || 0) >= PB.restoreOnCast && u.cd === 0) {
        u.counters.cdRestored = 1; u.cd = 1;
      }
    } },
    // Protective Bond: when a Bonded ally takes a heavy hit, grant them a Ward (cooldown per ally).
    onAllyDamaged(F, u, ally, src, dmg) {
      const PB = u.t2 === 1 && K.t2.protectiveBond;
      if (!PB || !PB.hitWard || ally.st.bond <= 0 || dmg < (PB.minHit || 10)) return;
      const ck = 'pb_' + ally.fid;
      if (u.counters[ck] > F.t) return;
      u.counters[ck] = F.t + (PB.cooldown || 2);
      const ws = spec(u, PB.hitWard);
      addWard(F, u, ally, rollDice(ws.n, ws.x) + ws.flat, false);
    },
    // Channel Divinity (Unity of Peace): first time an ally drops below threshold, equalize HP % across all allies + Ward everyone.
    tick(F, u) {
      const CD = K.channelDivinity; if (!CD || !(u.cd > 0)) return;
      const al = alliesOf(F, u);
      if (!al.some(a => a.hp < a.maxHp * CD.triggerBelowHp)) return;
      u.cd = 0; u.cdUses = (u.cdUses || 0) + 1;
      const avgPct = al.reduce((s, a) => s + a.hp / a.maxHp, 0) / al.length;
      const prevShare = F._bondSharing; F._bondSharing = true;
      for (const a of al) {
        const targetHp = Math.max(1, Math.round(a.maxHp * avgPct));
        if (targetHp > a.hp) { const gain = targetHp - a.hp; a.hp = targetHp; u.stat.heal += gain; }
        else a.hp = targetHp;
      }
      if (CD.ward) { const ws = spec(u, CD.ward); for (const a of al) addWard(F, u, a, rollDice(ws.n, ws.x) + ws.flat, false); }
      F._bondSharing = prevShare;
    },
  }; },
  saint: c => { const K = c.kit2;
    const makeDouble = (F, u, t, dur, hpShare, tauntSec) => {
      const ID = u.t2 === 0 && K.t2.invokeDuplicity, CS = u.t2 === 1 && K.t2.cloakOfShadows;
      const finalDur = dur + (ID && ID.extraSeconds ? ID.extraSeconds : 0);
      const finalHp = ID && ID.doubleHpShare ? ID.doubleHpShare : hpShare;
      const dbl = summonDouble(F, u, t, finalDur, finalHp);
      if (!dbl) return null;
      if (tauntSec > 0) for (const o of foesOf(F, u)) if (o.target === t) applyControl(F, dbl, o, 'taunt', tauntSec);
      if (CS && CS.stealthOnExpire) dbl.onGone = () => { if (t.alive) t.st.stealth = Math.max(t.st.stealth, CS.stealthOnExpire); };
      if (ID && ID.copiesAbility && t.ab && t.ab.cast) { try { dbl.ab = t.ab; t.ab.cast(F, dbl, { band: 'Low', crit: false, xd: 0, nat: 5 }); } catch (e) { } dbl.ab = null; }
      return dbl;
    };
    return {
    onStart(F, u) { u.cd = 1; }, // Channel Divinity: 1 charge at fight start, max 1
    ab: { cast(F, u, r) {
      const A = c.ability, CS = u.t2 === 1 && K.t2.cloakOfShadows;
      const t = lowestPctFront(F, u);
      if (K.heal) { const h = spec(u, K.heal, r); heal(F, u, t, rollDice(h.n + r.xd, h.x, r.crit) + h.flat); }
      const eva = CS && CS.evasionBonus ? CS.evasionBonus : K.evasion.bonus;
      const evaSec = CS && CS.evasionSeconds ? CS.evasionSeconds : K.evasion.seconds;
      t.st.evaBuff = Math.max(t.st.evaBuff || 0, eva); t.st.evaT = Math.max(t.st.evaT || 0, evaSec);
      const tSec = K.tauntSeconds ? byRoll(K.tauntSeconds, r) : byRoll(A.tauntSeconds, r);
      makeDouble(F, u, t, byRoll(K.doubleSeconds || A.doubleSeconds, r), K.doubleHpShare || A.doubleHpShare, tSec);
    } },
    // Cloak of Shadows: whenever any ally evades or dodges an attack, Saint gains charge.
    onAllyAvoid(F, u) {
      const CS = u.t2 === 1 && K.t2.cloakOfShadows;
      if (CS && CS.chargeOnAvoid) u.charge = Math.min(u.maxCharge, u.charge + CS.chargeOnAvoid);
    },
    // Channel Divinity (Trickster's Escape): first time an ally drops below threshold, give them Stealth + Evasion (Invoke Duplicity also spawns a Double).
    tick(F, u) {
      const CD = K.channelDivinity; if (!CD || !(u.cd > 0)) return;
      const lo = alliesOf(F, u).find(a => a.hp < a.maxHp * CD.triggerBelowHp);
      if (!lo) return;
      u.cd = 0; u.cdUses = (u.cdUses || 0) + 1;
      lo.st.stealth = Math.max(lo.st.stealth, CD.stealthSeconds);
      if (CD.evasionBonus) { lo.st.evaBuff = Math.max(lo.st.evaBuff || 0, CD.evasionBonus); lo.st.evaT = Math.max(lo.st.evaT || 0, CD.evasionSeconds || 3); }
      const ID = u.t2 === 0 && K.t2.invokeDuplicity;
      if (CD.doubleSeconds || (ID && ID.cdDoubleSeconds)) {
        makeDouble(F, u, lo, CD.doubleSeconds || ID.cdDoubleSeconds, CD.doubleHpShare || 0.3, CD.tauntSeconds || 1.5);
      }
    },
  }; },
});

// ---------------- batch 4 reworks (27 Nov, proposals): Wild Shape bonus HP bar (no timer, ends when depleted) ----------------
Object.assign(KITS2, {
  juniper: c => { const K = c.kit2; return {
    ab: { can: (F, u) => foesOf(F, u).some(o => dist(o, u) <= c.ability.reach),
      cast(F, u, r) {
        const A = c.ability; const dur = byRoll(A.restrainSeconds, r);
        const BG = u.t2 === 0 && K.t2.brambleGuard, BS = u.t2 === 1 && K.t2.brambleStalker;
        for (const o of foesOf(F, u).filter(o => dist(o, u) <= A.reach)) {
          applyControl(F, u, o, 'root', dur);
          const s = spec(u, A.damage);
          abHit(F, u, o, s.n, s.x, s.flat, A.type, r, { area: true });
          if (BS && BS.slow && o.alive) applyControl(F, u, o, 'slow', BS.slowSeconds || 3, BS.slow);
        }
        // Trigger Wild Shape (Briar Form): bonus HP bar (no timer), lasts until depleted.
        const hpSpec = spec(u, BG && BG.formHp ? BG.formHp : K.wildShape.hp);
        const hpAmt = rollDice(hpSpec.n, hpSpec.x, r.crit) + hpSpec.flat;
        const thCfg = BG && BG.thorns ? BG.thorns : K.wildShape.thorns;
        const thSpec = thCfg ? spec(u, thCfg) : null;
        enterWildShape(F, u, hpAmt, {
          kind: BG ? 'brambleGuard' : BS ? 'brambleStalker' : 'briar',
          acBonus: BG && BG.acBonus != null ? BG.acBonus : (K.wildShape.acBonus || 0),
          asBonus: BS && BS.asBonus ? BS.asBonus : 0,
          atkDice: BS && BS.atkDice ? BS.atkDice : null,
          thorns: thSpec ? { n: thSpec.n, x: thSpec.x, flat: thSpec.flat } : false,
          poisonOnHit: BS && BS.poisonPerHit ? BS.poisonPerHit : 0,
        });
        if (BG && BG.tauntSeconds) for (const o of adjUnits(F, u, 'E')) applyControl(F, u, o, 'taunt', BG.tauntSeconds);
      } },
  }; },
  kaska: c => { const K = c.kit2;
    const shiftKaska = (F, u, crit) => {
      const PA = u.t2 === 0 && K.t2.panther, DB = u.t2 === 1 && K.t2.direBear;
      const fCfg = PA || DB || K.wildShape;
      const hpSpec = spec(u, fCfg.hp || K.wildShape.hp);
      const hpAmt = rollDice(hpSpec.n, hpSpec.x, crit) + hpSpec.flat;
      const healHitSpec = fCfg.healOnHit ? spec(u, fCfg.healOnHit) : (!DB && K.wildShape.healOnHit ? spec(u, K.wildShape.healOnHit) : null);
      const cleaveSpec = fCfg.cleaveOnHit ? spec(u, fCfg.cleaveOnHit) : null;
      enterWildShape(F, u, hpAmt, {
        kind: PA ? 'panther' : DB ? 'direBear' : 'moonBeast',
        acBonus: fCfg.acBonus || 0,
        asBonus: fCfg.asBonus != null ? fCfg.asBonus : (DB ? 0 : (K.wildShape.asBonus || 0)),
        atkDice: fCfg.atkDice || null,
        healOnHit: healHitSpec,
        cleaveOnHit: cleaveSpec,
      });
      if (DB && DB.tauntSeconds) for (const o of adjUnits(F, u, 'E')) applyControl(F, u, o, 'taunt', DB.tauntSeconds);
    };
    return { dmgAb: true,
    onStart(F, u) {
      const fCfg = u.t2 === 0 ? K.t2.panther : u.t2 === 1 ? K.t2.direBear : null;
      if (fCfg && fCfg.startInForm) shiftKaska(F, u, false);
    },
    ab: { can: (F, u) => tfoes(F, u).length > 0,
      cast(F, u, r) {
        const A = c.ability;
        let t;
        if (r.band === 'Low') { t = acquire(F, u); if (!t || !canHit(F, u, t)) return; }
        else {
          const list = tfoes(F, u); t = list.sort((a, b) => dist(b, u) - dist(a, u))[0];
          const cl = t && freeCellNear(F, t.x, t.y, 'H', 1);
          if (cl && dist(cl, t) <= 1) moveTo(F, u, cl.x, cl.y);
          else { t = acquire(F, u); if (!t || !canHit(F, u, t)) return; }
        }
        u.target = t;
        const s = spec(u, K.pounce.damage, r);
        abHit(F, u, t, s.n, s.x, s.flat, 'phys', r);
        if (K.pounce.heal) {
          const hs = spec(u, K.pounce.heal, r);
          const a = lowestPct(alliesOf(F, u));
          if (a) heal(F, u, a, rollDice(hs.n, hs.x, r.crit) + hs.flat);
        }
        const rs = byRoll(A.restrainSeconds, r); if (rs > 0 && t.alive) applyControl(F, u, t, 'root', rs);
        shiftKaska(F, u, r.crit);
      } },
  }; },
});

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
  const c = HC[id], k = c.kit2 && KITS2[id] ? KITS2[id](c) : KITS[id] ? KITS[id](c) : {};
  const def = Object.assign({
    id, cfg: c, name: c.name, anc: c.ancestry, cls: c.class, sub: c.subclass, role: c.role, pro: c.pronouns,
    job: c.job, stats: STAT_KEYS.map(s => c.stats[s]), key: c.key, ac: c.ac, sr: c.sr, evasion: c.evasion || 0, range: c.range,
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
  const def = { id, cfg: c, name: c.name, chassis: c.chassis, rank: c.rank, affix: c.affix, hp: c.hp, ac: c.ac, sr: c.sr, evasion: c.evasion || 0, pierce: c.pierce || 0, range: c.range, atk };
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
const BOSSES = {}; for (const b of CFG.enemies.bosses) if (b.active !== false) BOSSES[b.id] = encFromCfg(b); // active: false keeps a boss in the config but out of runs and tests
