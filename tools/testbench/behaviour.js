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
      for (const o of foesOf(F, u)) {
        const sn = !!(RULES.map && RULES.map.southNorth);
        const inCone = sn ? (u.y - o.y >= 0 && u.y - o.y <= 2 && Math.abs(o.x - u.x) <= Math.max(1, u.y - o.y)) : (o.x - u.x >= 0 && o.x - u.x <= 2 && Math.abs(o.y - u.y) <= Math.max(1, o.x - u.x));
        if (inCone) dealDamage(F, u, o, amt, 'magic', { area: true });
      }
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
        if (u.t2 === 1 && T.stepOfTheWind && full) { const sn = !!(RULES.map && RULES.map.southNorth); const far = tfoes(F, u).sort((a, b) => sn ? (a.y - b.y) : (b.x - a.x))[0]; const cl = far && freeCellNear(F, far.x, far.y, 'H', 1); if (cl && dist(cl, far) <= 1) { moveTo(F, u, cl.x, cl.y); t = far; u.target = far; } }
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
        const sn = !!(RULES.map && RULES.map.southNorth);
        const bx = sn ? t.x : t.x + 1, by = sn ? t.y - 1 : t.y;
        const cl = free(F, bx, by) ? { x: bx, y: by } : freeCellNear(F, t.x, t.y, 'E', 1); if (cl && dist(cl, t) <= 1) moveTo(F, u, cl.x, cl.y);
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

// ---------------- Phase 2 Batch A (Summons & Companions): Toot, Father Gorr, Morel, Tova, Bellin ----------------
Object.assign(KITS2, {
  toot: c => { const K = c.kit2;
    const myCoins = (F, u) => F.units.filter(o => o.alive && o.summon && o.owner === u && o.minionTag === 'coin');
    const spawnCoin = (F, u) => {
      const MC = u.t2 === 0 && K.t2.mintCondition, GW = u.t2 === 1 && K.t2.goldenWall;
      const maxC = MC ? MC.maxAlive : K.coin.maxAlive;
      if (myCoins(F, u).length >= maxC) return null;
      const atkS = spec(u, K.coin.atk);
      const hp = Math.max(10, Math.round(u.maxHp * K.coin.hpShare));
      const coin = summonMinion(F, u, {
        name: 'Coin Soldier', tag: 'coin', hp,
        ac: u.ac + (K.coin.acBonus || 0) + (GW ? GW.acBonus : 0), sr: u.sr, range: 1,
        as: MC && MC.coinAs ? MC.coinAs : 0,
        atk: { name: 'Coin Spear', n: atkS.n, x: atkS.x, flat: atkS.flat, type: 'phys', iv: K.coin.atk.interval },
        creditOwner: true, creditAsAb: true,
        onGone(F2, m, killed) {
          if (killed && GW && GW.explode) {
            const ex = spec(u, GW.explode);
            for (const o of adjUnits(F2, m, 'E')) dealDamage(F2, u, o, rollDice(ex.n, ex.x) + ex.flat, 'magic', { ability: true, area: true });
          }
        },
      });
      if (coin && GW && GW.tauntSeconds) for (const o of adjUnits(F, coin, 'E')) applyControl(F, coin, o, 'taunt', GW.tauntSeconds);
      return coin;
    };
    return {
      onStart(F, u) {
        const MC = u.t2 === 0 && K.t2.mintCondition;
        if (MC && MC.startCoins) for (let i = 0; i < MC.startCoins; i++) spawnCoin(F, u);
      },
      ab: { cast(F, u, r) {
        const count = byRoll(K.coin.count, r);
        for (let i = 0; i < count; i++) spawnCoin(F, u);
        // Bardic Inspiration: closest ally gets Ward + 1d6/tier die; spending it heals & hastes all active Coin Soldiers
        const ally = nearest(alliesOf(F, u).filter(o => o !== u && o.ab), u) || u;
        if (K.inspiration.allyWard) {
          const ws = spec(u, K.inspiration.allyWard);
          addWard(F, u, ally, rollDice(ws.n, ws.x, r.crit) + ws.flat, false);
        }
        const dieS = spec(u, K.inspiration.die);
        const chS = spec(u, K.inspiration.coinHeal);
        ally.bardDie = {
          n: dieS.n, x: dieS.x, flat: dieS.flat, src: u,
          onSpend(F2, src) {
            if (!src || !src.alive) return;
            for (const cn of myCoins(F2, src)) {
              heal(F2, src, cn, rollDice(chS.n, chS.x) + chS.flat);
              cn.st.haste = Math.max(cn.st.haste || 0, K.inspiration.coinAs);
              cn.st.hasteT = Math.max(cn.st.hasteT || 0, K.inspiration.coinAsSeconds);
            }
          },
        };
      } },
      onFightEnd(F, u, res) {
        if (res !== 'win') return;
        const aliveCoins = myCoins(F, u).length;
        if (aliveCoins > 0) {
          const g = aliveCoins * (K.coin.goldPerSurvivor || 1);
          F.gold += g;
          for (let i = 0; i < g; i++) onGoldDrop(F);
        }
      },
    };
  },

  father_gorr: c => { const K = c.kit2;
    const farthestFoe = (F, u) => {
      const list = tfoes(F, u);
      return list.length ? list.sort((a, b) => dist(b, u) - dist(a, u))[0] : null;
    };
    const triggerGuided = (F, u) => {
      if (!(u.cd > 0)) return false;
      u.cd = 0; u.cdUses = (u.cdUses || 0) + 1;
      u.nextStrikeCrit = true; u.nextStrikeTrue = true; u.swGuided = true;
      const WB = u.t2 === 1 && K.t2.warGodsBlessing;
      if (WB) {
        for (const ally of alliesOf(F, u)) if (ally !== u) { ally.nextStrikeCrit = true; ally.advNext = true; if (WB.partyCharge) addCharge(ally, WB.partyCharge); }
      }
      return true;
    };
    const swHit = (F, u, crit, diceCfg, isAb) => {
      const bt = farthestFoe(F, u); if (!bt) return;
      const p = parseDice(diceCfg.dice);
      const n = diceCfg.perTier ? p.n * u.tier : p.n + (RULES.attackGrowth ? RULES.attackGrowth.extraDicePerTier * (u.tier - 1) : 0);
      const dmg = dealDamage(F, u, bt, rollDice(n, p.x, crit), 'radiant', { attack: !isAb, ability: !!isAb, crit, ignoreEvasion: crit });
      const CM = u.t2 === 0 && K.t2.crusadersMantle;
      if (CM && dmg > 0) {
        const sp = spec(u, CM.splash);
        for (const o of adjUnits(F, bt, 'E')) dealDamage(F, u, o, rollDice(sp.n, sp.x) + sp.flat, 'radiant', { area: true, ability: !!isAb });
      }
      const WB = u.t2 === 1 && K.t2.warGodsBlessing;
      if (WB && WB.restoreOnce && !bt.alive && !u.cdRestored) { u.cdRestored = true; u.cd = 1; }
    };
    return {
      dmgAb: true,
      onStart(F, u) { u.cd = 1; u.cdRestored = false; },
      onAttack(F, u) {
        const crit = !!u.swGuided; u.swGuided = false;
        swHit(F, u, crit, K.spiritualWeapon, false);
      },
      onKill(F, u) {
        const WB = u.t2 === 1 && K.t2.warGodsBlessing;
        if (WB && WB.restoreOnce && !u.cdRestored && u.cd === 0) { u.cdRestored = true; u.cd = 1; }
      },
      tick(F, u) {
        if (u.cd > 0 && foesOf(F, u).some(o => o.hp < o.maxHp * K.channelDivinity.triggerBelowHp)) triggerGuided(F, u);
      },
      ab: {
        can: (F, u) => hasTarget(F, u),
        cast(F, u, r) {
          triggerGuided(F, u);
          const t = acquire(F, u);
          if (t && canHit(F, u, t)) {
            const ms = spec(u, K.command.melee);
            abHit(F, u, t, ms.n, ms.x, ms.flat, 'phys', r);
          }
          swHit(F, u, r.crit, K.command.backline, true);
          if (K.command.selfWard) { const ws = spec(u, K.command.selfWard); addWard(F, u, u, rollDice(ws.n, ws.x, r.crit) + ws.flat, false); }
          u.st.haste = Math.max(u.st.haste || 0, K.command.asBonus);
          u.st.hasteT = Math.max(u.st.hasteT || 0, byRoll(K.command.asSeconds, r));
        },
      },
    };
  },

  morel: c => { const K = c.kit2;
    const detonatePod = (F, u, p) => {
      const SD = u.t2 === 0 && K.t2.sporeDetonation;
      if (!SD) return;
      const ds = spec(u, SD.damage);
      for (const o of foesOf(F, u).filter(e => dist(e, p) <= SD.radius)) {
        dealDamage(F, u, o, rollDice(ds.n, ds.x) + ds.flat, 'magic', { ability: true, area: true });
        if (o.alive) addPoison(F, u, o, SD.poison);
      }
    };
    const pulsePod = (F, u, p) => {
      const sym = u.form === 'symbiotic' && u.formHp > 0;
      const pois = sym ? K.pod.symbioticPoison : K.pod.poison;
      for (const o of foesOf(F, u).filter(e => dist(e, p) <= K.pod.radius)) {
        if (K.pod.damage) { const ps = spec(u, K.pod.damage); dealDamage(F, u, o, rollDice(ps.n, ps.x) + ps.flat, 'magic', { ability: true, area: true }); }
        if (o.alive) addPoison(F, u, o, pois);
      }
      const MN = u.t2 === 1 && K.t2.mycelialNetwork;
      if (MN && sym) {
        const nearAllies = alliesOf(F, u).filter(a => dist(a, p) <= MN.radius && a.hp < a.maxHp);
        const lo = lowestPct(nearAllies);
        if (lo) { const hs = spec(u, MN.heal); heal(F, u, lo, rollDice(hs.n, hs.x) + hs.flat); }
      }
    };
    const spawnPodAt = (F, u, x, y) => addPod(F, u, x, y, {
      tag: 'mushroom', maxPods: K.pod.maxPods, interval: K.pod.interval,
      getRate: (F2, p) => (u.form === 'symbiotic' && u.formHp > 0 ? K.pod.symbioticRate : 1),
      onPulse: (F2, p) => pulsePod(F2, u, p),
      onDetonate: (F2, p) => detonatePod(F2, u, p),
    });
    return {
      dmgAb: true,
      onAttack(F, u, t) { if (t) spawnPodAt(F, u, t.x, t.y); },
      tick(F, u) {
        const isSym = u.form === 'symbiotic' && u.formHp > 0;
        if (u._wasSym && !isSym && u.t2 === 0 && F.pods) {
          for (const p of F.pods.filter(p => p.owner === u && p.tag === 'mushroom')) detonatePod(F, u, p);
        }
        u._wasSym = isSym;
      },
      ab: {
        can: (F, u) => tfoes(F, u).length > 0,
        cast(F, u, r) {
          const hpS = spec(u, K.wildShape.hp);
          enterWildShape(F, u, rollDice(hpS.n, hpS.x, r.crit) + hpS.flat, { kind: 'symbiotic' });
          u._wasSym = true;
          const nPods = byRoll(K.bloom.pods, r);
          const foes = tfoes(F, u);
          for (let i = 0; i < nPods && foes.length; i++) {
            const tg = foes[i % foes.length];
            spawnPodAt(F, u, tg.x, tg.y);
            if (K.bloom.damage) { const bs = spec(u, K.bloom.damage); abHit(F, u, tg, bs.n, bs.x, bs.flat, 'magic', r, { area: true }); }
          }
          if (F.pods) for (const p of F.pods.filter(p => p.owner === u && p.tag === 'mushroom')) pulsePod(F, u, p);
        },
      },
    };
  },

  tova: c => { const K = c.kit2;
    const findFalcon = (F, u) => F.units.find(o => o.alive && o.summon && o.owner === u && o.minionTag === 'falcon');
    const spawnFalcon = (F, u, hpPct = 1) => {
      const TH = u.t2 === 0 && K.t2.twinHunt, GT = u.t2 === 1 && K.t2.goldenTalons;
      const baseHp = u.maxHp * K.falcon.hpShare * (TH ? TH.hpMult : 1);
      const p = parseDice(K.falcon.atk.dice);
      const n = p.n + (RULES.attackGrowth ? RULES.attackGrowth.extraDicePerTier * (u.tier - 1) : 0);
      const f = summonMinion(F, u, {
        name: 'Falcon', tag: 'falcon', hp: Math.max(10, Math.round(baseHp)),
        ac: K.falcon.ac, sr: u.sr, evasion: K.falcon.evasion + (TH ? TH.extraEvasion : 0),
        as: GT ? (GT.falconAs || 0) : 0,
        range: 1, move: 0.3, preferMarked: true, creditOwner: true,
        atk: { name: 'Talons', n, x: p.x, type: 'phys', iv: K.falcon.atk.interval },
        def: {
          onStrike(F2, fm, t, dmg) {
            if (!GT || !t || !t.st.marked || dmg <= 0) return;
            u.falconMarkHits = (u.falconMarkHits || 0) + 1;
            if (u.falconMarkHits % GT.everyStrikes === 0 && (u.falconGold || 0) < GT.maxGold) {
              u.falconGold = (u.falconGold || 0) + 1; F2.gold++; onGoldDrop(F2);
              u.st.haste = Math.max(u.st.haste || 0, GT.asBonus); u.st.hasteT = Math.max(u.st.hasteT || 0, GT.asSeconds);
            }
          },
          onKill(F2, fm, t) {
            if (!GT || !t || !t.st.marked || (u.falconGold || 0) >= GT.maxGold) return;
            u.falconGold = (u.falconGold || 0) + 1; F2.gold++; onGoldDrop(F2);
            u.st.haste = Math.max(u.st.haste || 0, GT.asBonus); u.st.hasteT = Math.max(u.st.hasteT || 0, GT.asSeconds);
          },
        },
      });
      if (f && hpPct < 1) f.hp = Math.max(1, Math.round(f.maxHp * hpPct));
      return f;
    };
    const sicEm = (F, u, t, crit) => {
      const f = findFalcon(F, u);
      if (!f || !t || !t.alive) return;
      const cl = freeCellNear(F, t.x, t.y, 'H', 1);
      if (cl && dist(cl, t) <= 1) moveTo(F, f, cl.x, cl.y);
      f.target = t;
      const ds = spec(u, K.favoredFoe.dive);
      const TH = u.t2 === 0 && K.t2.twinHunt;
      let amt = rollDice(ds.n, ds.x, crit) + ds.flat;
      if (TH && TH.diveBonus) { const db = spec(u, TH.diveBonus); amt += rollDice(db.n, db.x, crit) + db.flat; }
      dealDamage(F, f, t, amt, 'phys', { ability: true, crit });
    };
    return {
      kwMark: true, dmgAb: true,
      onStart(F, u) { spawnFalcon(F, u, 1); },
      onAttack(F, u) {
        const mk = tfoes(F, u).find(o => o.st.marked);
        if (!mk) return;
        const TH = u.t2 === 0 && K.t2.twinHunt;
        const every = TH ? TH.everyNth : K.favoredFoe.everyNth;
        u.tovaMarkAtks = (u.tovaMarkAtks || 0) + 1;
        if (u.tovaMarkAtks % every === 0) sicEm(F, u, mk, false);
      },
      ab: {
        can: (F, u) => tfoes(F, u).length > 0,
        cast(F, u, r) {
          const list = tfoes(F, u);
          const unmarked = list.filter(o => !o.st.marked);
          const pool = unmarked.length ? unmarked : list;
          const tg = pool.sort((a, b) => dist(b, u) - dist(a, u))[0];
          if (tg) applyHuntersMark(F, u, tg);
          const share = byRoll(K.call.healShare, r);
          let f = findFalcon(F, u);
          if (f) heal(F, u, f, Math.round(f.maxHp * share));
          else f = spawnFalcon(F, u, share);
          if (tg && f) sicEm(F, u, tg, r.crit);
        },
      },
    };
  },

  bellin: c => { const K = c.kit2;
    const findHom = (F, u) => F.units.find(o => o.alive && o.summon && o.owner === u && o.minionTag === 'homunculus');
    const spawnHom = (F, u, hpShare = 1) => {
      const H = K.homunculus;
      const p = parseDice(H.atk.dice);
      const hp = Math.max(12, Math.round(u.maxHp * H.hpShare));
      const m = summonMinion(F, u, {
        name: 'Flesh Homunculus', tag: 'homunculus', hp, ac: H.ac, sr: u.sr, range: 1,
        creditOwner: true, creditAsAb: true,
        atk: { name: 'Grafted Slam', n: p.n, x: p.x, stat: H.atk.bonus, half: !!H.atk.halfBonus, type: 'phys', iv: H.atk.interval },
        def: {
          onStrike(F2, hm, t, dmg) {
            if (!t || !t.alive || !(hm.grafts > 0)) return;
            const gd = spec(u, H.graftDmg);
            dealDamage(F2, hm, t, rollDice(gd.n * hm.grafts, gd.x), 'phys', { ability: true });
            const OA = u.t2 === 0 && K.t2.ossuaryAbomination;
            if (OA && hm.grafts >= OA.cleaveAtGrafts) {
              for (const o of adjUnits(F2, hm, 'E')) if (o !== t) dealDamage(F2, hm, o, rollDice(gd.n * hm.grafts, gd.x), 'phys', { ability: true, area: true });
            }
          },
        },
      });
      if (m) {
        m.grafts = 0;
        if (hpShare < 1) m.hp = Math.max(1, Math.round(m.maxHp * hpShare));
      }
      return m;
    };
    const graftHom = (F, u) => {
      const H = K.homunculus;
      let hm = findHom(F, u);
      if (!hm) { hm = spawnHom(F, u, 0.5); if (!hm) return; }
      hm.grafts = (hm.grafts || 0) + 1;
      const hpAdd = Math.max(5, Math.round(u.maxHp * H.hpShare * H.graftHpPct));
      hm.maxHp += hpAdd;
      hm.hp = Math.min(hm.maxHp, hm.hp + hpAdd + Math.round(hm.maxHp * H.graftHealPct));
    };
    return {
      dmgAb: true,
      onStart(F, u) {
        spawnHom(F, u, 1);
        const OA = u.t2 === 0 && K.t2.ossuaryAbomination;
        if (OA && OA.startGrafts) for (let i = 0; i < OA.startGrafts; i++) graftHom(F, u);
      },
      onAnyEnemyDeath(F, u, t) {
        if (!(t.st.reverb > 0)) return;
        u.charge = Math.min(u.maxCharge, u.charge + K.arcaneRecovery.charge);
        graftHom(F, u);
        const SE = u.t2 === 1 && K.t2.soulEcho;
        if (SE) {
          const ex = spec(u, SE.explode);
          for (const o of foesOf(F, u).filter(e => dist(e, t) <= 1)) dealDamage(F, u, o, rollDice(ex.n, ex.x) + ex.flat, 'magic', { ability: true, area: true });
        }
      },
      onReverbDamaged(F, u, t, amt) {
        const OA = u.t2 === 0 && K.t2.ossuaryAbomination;
        if (!OA) return;
        t._revDmg = (t._revDmg || 0) + amt;
        const step = t.maxHp * OA.chunkPct;
        while (t._revDmg >= step) { t._revDmg -= step; graftHom(F, u); }
      },
      ab: {
        can: (F, u) => tfoes(F, u).length > 0,
        cast(F, u, r) {
          const DK = K.deathKnell, SE = u.t2 === 1 && K.t2.soulEcho;
          const bs = spec(u, DK.base, r), ds = spec(u, DK.damaged, r);
          const extra = SE && SE.bonusDmg ? spec(u, SE.bonusDmg) : null;
          for (const o of foesOf(F, u)) {
            const wounded = o.hp < o.maxHp;
            const s = wounded ? ds : bs;
            abHit(F, u, o, s.n + (extra ? extra.n : 0), s.x, s.flat, 'magic', r, { area: true });
            if (o.alive && (wounded || (SE && SE.reverbAll))) {
              o.st.reverb = Math.max(o.st.reverb || 0, DK.reverbSeconds);
              o.st.reverbSrc = u;
              if (SE) applyControl(F, u, o, 'necrosis', SE.necrosisSeconds);
            }
          }
          if (!findHom(F, u)) spawnHom(F, u, DK.reviveShare);
        },
      },
    };
  },
});

// ---------------- Phase 2 Batch B (Casters & Spellcraft): Thia, Orlo, Leagues, Ylowyn, Chuk ----------------
Object.assign(KITS2, {
  thia: c => { const K = c.kit2;
    const shiftSquirrel = (F, u, crit) => {
      const ws = K.wildShape;
      if (u.form === 'squirrel' && u.formHp > 0) {
        const rf = spec(u, ws.refreshHp);
        const add = rollDice(rf.n, rf.x, crit) + rf.flat;
        u.formHp += add; u.selfSus = (u.selfSus || 0) + add; if (u._inCast) u.abVal = (u.abVal || 0) + add; u.stat.ward += add;
      } else {
        const hpS = spec(u, ws.hp);
        enterWildShape(F, u, rollDice(hpS.n, hpS.x, crit) + hpS.flat, { kind: 'squirrel', asBonus: ws.asBonus });
      }
    };
    return {
      dmgAb: true,
      onStart(F, u) {
        const NB = u.t2 === 0 && K.t2.nuttyBarrage;
        if (NB && NB.startShifted) shiftSquirrel(F, u, false);
      },
      onStrike(F, u, t, dmg, crit) {
        if (!t) return;
        const sp = spec(u, K.acorn.splash);
        for (const o of adjUnits(F, t, 'E')) {
          dealDamage(F, u, o, rollDice(sp.n, sp.x) + sp.flat, 'magic', { area: true });
          if (o.alive) addBurn(F, u, o, K.acorn.burn);
        }
        if (t.alive) addBurn(F, u, t, K.acorn.burn);
        const NB = u.t2 === 0 && K.t2.nuttyBarrage;
        if (NB && u.form === 'squirrel' && u.formHp > 0) {
          u._sqAtks = (u._sqAtks || 0) + 1;
          if (u._sqAtks % NB.everyNth === 0) {
            const gd = spec(u, NB.damage);
            for (const o of foesOf(F, u).filter(e => dist(e, t) <= 1)) {
              dealDamage(F, u, o, rollDice(gd.n, gd.x) + gd.flat, 'magic', { ability: true, area: true });
              if (o.alive) addBurn(F, u, o, NB.burn);
            }
          }
        }
      },
      onAnyEnemyDeath(F, u, t) {
        const CF = u.t2 === 1 && K.t2.cauterizingFlame;
        if (!CF || !(t.st.burnT > 0 && t.st.burn > 0)) return;
        const lo = lowestPct(alliesOf(F, u));
        if (lo) { const hs = spec(u, CF.heal); heal(F, u, lo, rollDice(hs.n, hs.x) + hs.flat); }
        shiftSquirrel(F, u, false);
      },
      ab: {
        can: (F, u) => tfoes(F, u).some(o => canHit(F, u, o)),
        cast(F, u, r) {
          const NB = u.t2 === 0 && K.t2.nuttyBarrage;
          const cones = byRoll(K.barrage.cones, r) + (NB && NB.extraCone ? NB.extraCone : 0);
          const ds = spec(u, K.barrage.damage);
          const sp = spec(u, K.acorn.splash);
          for (let i = 0; i < cones; i++) {
            const list = tfoes(F, u).filter(o => canHit(F, u, o));
            const tg = densest(F, u, list.length ? list : tfoes(F, u));
            if (!tg) break;
            const tx = tg.x, ty = tg.y;
            abHit(F, u, tg, ds.n, ds.x, ds.flat, 'magic', r, { area: cones > 1 });
            if (tg.alive) addBurn(F, u, tg, K.barrage.burn);
            for (const o of foesOf(F, u).filter(e => e !== tg && dist(e, { x: tx, y: ty }) <= 1)) {
              dealDamage(F, u, o, rollDice(sp.n, sp.x) + sp.flat, 'magic', { ability: true, area: true });
              if (o.alive) addBurn(F, u, o, K.barrage.burn);
            }
          }
          shiftSquirrel(F, u, r.crit);
        },
      },
    };
  },

  orlo: c => { const K = c.kit2;
    return {
      dmgAb: true,
      onStart(F, u) {
        const SB = u.t2 === 0 && K.t2.seekingBarrage;
        u.extraMissiles = SB && SB.startMissiles ? SB.startMissiles : 0;
        u.warheadCharges = 0;
      },
      ab: {
        can: (F, u) => tfoes(F, u).some(o => canHit(F, u, o)),
        cast(F, u, r) {
          const M = K.missile, SB = u.t2 === 0 && K.t2.seekingBarrage, AW = u.t2 === 1 && K.t2.arcaneWarhead;
          const baseN = byRoll(M.base, r);
          const total = AW ? (baseN + (r.band === 'High' ? 1 : 0)) : (baseN + (u.extraMissiles || 0));
          const ds = spec(u, M.damage);
          let hitEva = false;
          for (let i = 0; i < total; i++) {
            const list = tfoes(F, u).filter(o => canHit(F, u, o));
            const pool = list.length ? list : tfoes(F, u);
            if (!pool.length) break;
            const tg = lowestHp(pool);
            if (SB && ((tg.eva || 0) > 0 || (tg.st.evaT > 0 && tg.st.evaBuff > 0))) hitEva = true;
            abHit(F, u, tg, ds.n, ds.x, ds.flat, 'magic', r);
            if (SB && tg.alive) {
              tg.st.srMod = Math.max(-SB.srMax, (tg.st.srModT > 0 ? tg.st.srMod : 0) - SB.srShred);
              tg.st.srModT = Math.max(tg.st.srModT || 0, SB.srSeconds);
            }
          }
          const arGain = Math.min(M.arCap, total * M.arPerMissile) + (SB && hitEva ? SB.evaBonusAr : 0);
          addCharge(u, arGain);
          if (AW) {
            u.warheadCharges = (u.warheadCharges || 0) + 1;
            if (u.warheadCharges >= AW.chargesNeeded) {
              u.warheadCharges = 0;
              const list = tfoes(F, u);
              const ctr = densest(F, u, list);
              if (ctr) {
                const ns = spec(u, AW.nuke);
                for (const o of foesOf(F, u).filter(e => dist(e, ctr) <= AW.radius)) {
                  abHit(F, u, o, ns.n, ns.x, ns.flat, 'magic', r, { area: true });
                }
              }
            }
          } else {
            u.extraMissiles = (u.extraMissiles || 0) + byRoll(M.add, r);
          }
        },
      },
    };
  },

  leagues: c => { const K = c.kit2;
    return {
      kwHex: true, dmgAb: true,
      onStart(F, u) {
        const GT = u.t2 === 1 && K.t2.graspingTentacles;
        if (GT && GT.startHex) {
          const tg = nearest(tfoes(F, u), u);
          if (tg) applyHex(F, u, tg);
        }
      },
      onStrike(F, u, t) {
        const RT = u.t2 === 0 && K.t2.riptideTorrent;
        if (!RT || !t) return;
        const ps = spec(u, RT.pierceDamage);
        const splashTarget = adjUnits(F, t, 'E')[0];
        if (splashTarget) {
          dealDamage(F, u, splashTarget, rollDice(ps.n, ps.x) + ps.flat, 'magic', { attack: true, area: true });
        }
        if (t.alive && t.st.hexed && RT.pushHexed) pushUnit(F, u, t, RT.pushHexed);
      },
      onHexedAttack(F, u, attacker) {
        const P = K.pact, GT = u.t2 === 1 && K.t2.graspingTentacles;
        const cd = GT ? GT.cooldown : P.cooldown;
        if (u.counters.pactCd > F.t) return;
        u.counters.pactCd = F.t + cd;
        const ds = spec(u, P.damage);
        dealDamage(F, u, attacker, rollDice(ds.n, ds.x) + ds.flat, 'magic', { ability: true });
        if (attacker.alive) {
          applyControl(F, u, attacker, 'slow', P.slowSeconds, P.slow);
          if (GT) {
            u._tentacleHits = (u._tentacleHits || 0) + 1;
            if (u._tentacleHits % GT.rootEveryNth === 0) applyControl(F, u, attacker, 'root', GT.rootSeconds);
          }
        }
      },
      ab: {
        can: (F, u) => tfoes(F, u).some(o => canHit(F, u, o)),
        cast(F, u, r) {
          const list = tfoes(F, u).filter(o => canHit(F, u, o));
          const pool = list.length ? list : tfoes(F, u);
          const unhexed = pool.filter(o => !o.st.hexed);
          const tg = deadliest(unhexed.length ? unhexed : pool);
          if (!tg) return;
          const s = spec(u, K.surge.damage);
          abHit(F, u, tg, s.n, s.x, s.flat, 'magic', r);
          if (tg.alive) {
            applyHex(F, u, tg);
            pushUnit(F, u, tg, K.surge.push);
          }
          if (r.band === 'High') {
            const extra = pool.find(o => o !== tg && o.alive && !o.st.hexed) || pool.find(o => o !== tg && o.alive);
            if (extra) applyHex(F, u, extra);
          }
        },
      },
    };
  },

  ylowyn: c => { const K = c.kit2; const maxSp = K.metamagic.maxSp || 4;
    const gainSp = (F, u) => {
      if (u.counters.spCd > F.t) return;
      u.counters.spCd = F.t + (K.metamagic.spCd || 1.0);
      u.sp = Math.min(maxSp, (u.sp || 0) + 1);
    };
    return {
      onStart(F, u) {
        const TB = u.t2 === 0 && K.t2.telepathicBond;
        u.sp = TB ? TB.startSp : (K.metamagic.startSp || 0);
      },
      onAllyAvoid(F, u, ally) {
        gainSp(F, u);
        const PS = u.t2 === 1 && K.t2.protectiveSpores;
        if (PS && ally && ally.alive) {
          const ck = 'mh_' + ally.fid;
          if (!(u.counters[ck] > F.t)) {
            u.counters[ck] = F.t + PS.missHealCd;
            const hs = spec(u, PS.missHeal);
            heal(F, u, ally, rollDice(hs.n, hs.x) + hs.flat);
          }
        }
      },
      onEnemyRoll(F, u, enemy, r) {
        if (r.fizzle || r.band === 'Low') gainSp(F, u);
      },
      ab: {
        can: (F, u) => alliesOf(F, u).length > 0,
        cast(F, u, r) {
          const TB = u.t2 === 0 && K.t2.telepathicBond, PS = u.t2 === 1 && K.t2.protectiveSpores;
          const others = alliesOf(F, u).filter(a => a !== u);
          const front = others.length ? lowestPctFront(F, u) : u;
          const tgt = others.includes(front) ? front : (others[0] || u);
          const evaSec = byRoll(K.spores.evaSeconds, r);
          tgt.st.evaBuff = Math.max(tgt.st.evaBuff || 0, K.spores.evasion);
          tgt.st.evaT = Math.max(tgt.st.evaT || 0, evaSec);
          if (PS && PS.partyEva) {
            for (const a of alliesOf(F, u)) { a.st.evaBuff = Math.max(a.st.evaBuff || 0, PS.partyEva); a.st.evaT = Math.max(a.st.evaT || 0, PS.partyEvaSeconds); }
          }
          const ws = spec(u, K.spores.ward);
          addWard(F, u, tgt, rollDice(ws.n, ws.x, r.crit) + ws.flat, false);
          if (K.spores.heal) {
            const lo = lowestPct(others.length ? others : [u]);
            if (lo) { const hs = spec(u, K.spores.heal); heal(F, u, lo, rollDice(hs.n, hs.x, r.crit) + hs.flat); }
          }
          const foes = tfoes(F, u).slice().sort((a, b) => ((tgt.lastHitBy === b) - (tgt.lastHitBy === a)) || (deadliest([a, b]) === a ? -1 : 1));
          const nDis = PS ? PS.disadvTargets : 1;
          for (const f of foes.slice(0, nDis)) applyControl(F, u, f, 'disadv', K.spores.disadvSeconds);
          if ((u.sp || 0) >= maxSp) {
            u.sp = TB && TB.refundSp ? TB.refundSp : 0;
            const caster = others.filter(a => a.ab).sort((a, b) => (b.stat.dmg - a.stat.dmg) || dist(a, u) - dist(b, u))[0] || tgt;
            caster.st.twincast = 1;
            caster._onTwincast = (F2, ally) => {
              if (!u.alive) return;
              if (TB) {
                addCharge(u, TB.chargeOnTwin);
                addCharge(ally, TB.chargeOnTwin);
                if (TB.twinWard) {
                  const tw = spec(u, TB.twinWard);
                  addWard(F2, u, ally, rollDice(tw.n, tw.x) + tw.flat, false);
                  addWard(F2, u, u, rollDice(tw.n, tw.x) + tw.flat, false);
                }
              }
            };
          } else {
            u.sp = Math.min(maxSp, (u.sp || 0) + 1);
          }
        },
      },
    };
  },

  chuk: c => { const K = c.kit2; const maxSp = K.metamagic.maxSp || 4;
    return {
      dmgAb: true,
      onStart(F, u) {
        const CC = u.t2 === 0 && K.t2.controlledChaos;
        u.sp = CC ? CC.startSp : (K.metamagic.startSp || 0);
      },
      modifyRoll(F, u, nat) {
        if ((u.sp || 0) >= maxSp) { u.sp = 0; u._bentLuck = true; return 20; }
        return nat;
      },
      onSelfRoll(F, u, r) {
        if (u._bentLuck) return;
        if (r.fizzle || r.band === 'Low') u.sp = Math.min(maxSp, (u.sp || 0) + 2);
        else u.sp = Math.min(maxSp, (u.sp || 0) + 1);
      },
      onAllyCast(F, u, ally, r) {
        if (ally !== u && (r.band === 'High' || r.crit)) u.sp = Math.min(maxSp, (u.sp || 0) + 1);
      },
      ab: {
        can: (F, u) => tfoes(F, u).some(o => canHit(F, u, o)),
        cast(F, u, r) {
          const bent = !!u._bentLuck; u._bentLuck = false;
          const CC = u.t2 === 0 && K.t2.controlledChaos, SB = u.t2 === 1 && K.t2.spellBombardment;
          const list = tfoes(F, u).filter(o => canHit(F, u, o));
          const pool = list.length ? list : tfoes(F, u);
          const tg = densest(F, u, pool);
          if (!tg) return;
          const tx = tg.x, ty = tg.y;
          const ds = spec(u, K.surge.damage);
          abHit(F, u, tg, ds.n, ds.x, ds.flat, 'magic', r);
          if (r.band === 'Low') {
            if (tg.alive) { tg.st.weaken = Math.max(tg.st.weaken || 0, K.surge.lowWeaken); tg.st.weakenT = Math.max(tg.st.weakenT || 0, K.surge.lowSeconds); }
            if (K.surge.lowSplash) {
              const ls = spec(u, K.surge.lowSplash);
              for (const o of foesOf(F, u).filter(e => e !== tg && dist(e, { x: tx, y: ty }) <= 1)) {
                dealDamage(F, u, o, rollDice(ls.n, ls.x, r.crit) + ls.flat, 'magic', { ability: true, area: true });
              }
            }
          } else if (r.band === 'Mid') {
            const ms = spec(u, K.surge.midSplash);
            for (const o of foesOf(F, u).filter(e => e !== tg && dist(e, { x: tx, y: ty }) <= 1)) {
              dealDamage(F, u, o, rollDice(ms.n, ms.x, r.crit) + ms.flat, 'magic', { ability: true, area: true });
            }
          } else {
            const hs = spec(u, K.surge.highExtra);
            const extras = foesOf(F, u).filter(e => e !== tg).slice(0, K.surge.highTargets);
            for (const o of extras) dealDamage(F, u, o, rollDice(hs.n, hs.x, r.crit) + hs.flat, 'magic', { ability: true, area: true });
            for (const a of alliesOf(F, u)) if (a !== u) addCharge(a, K.surge.highCharge);
          }
          if (bent && CC && CC.partyAdv) for (const a of alliesOf(F, u)) if (a !== u) a.advNext = true;
          if (SB && (r.crit || (SB.onHigh && r.band === 'High'))) {
            const b2 = foesOf(F, u).filter(e => e !== tg)[0] || (tg.alive ? tg : null);
            if (b2) { const bs = spec(u, SB.bounce); dealDamage(F, u, b2, rollDice(bs.n, bs.x, r.crit) + bs.flat, 'magic', { ability: true, crit: r.crit }); }
            u.sp = Math.min(maxSp, (u.sp || 0) + SB.refundSp);
          }
        },
      },
    };
  },
});

// ---------------- Phase 2 Batch C (Frontliners & Brawlers): Durn, Corporal Tobbin, Vela, Lady Malice, Malthrax ----------------
Object.assign(KITS2, {
  durn: c => { const K = c.kit2;
    return {
      onStart(F, u) { u.rage = 0; u._bleedTick = 0; },
      onHitTaken(F, u, src) {
        if (!src || src === u || src.side === u.side) return;
        const IS = u.t2 === 0 && K.t2.ironhideSpikes, BC = u.t2 === 1 && K.t2.bloodiedChicken;
        const effAc = u.ac + (u.st.acModT > 0 ? u.st.acMod : 0);
        const thorns = Math.floor(effAc / (IS ? IS.acDiv : K.thorns.acDiv));
        if (thorns > 0 && dist(u, src) <= 1 && src.alive && !(u.counters.thCd > F.t)) {
          u.counters.thCd = F.t + (K.thorns.cd || 0.75);
          dealDamage(F, u, src, thorns, 'phys', {});
        }
        if (!(u.counters.rageCd > F.t)) {
          u.counters.rageCd = F.t + K.rage.cd;
          u.rage = (u.rage || 0) + 1;
        }
        if (BC && src.st.bleed > 0) {
          const hs = spec(u, BC.bleedHitHeal);
          heal(F, u, u, rollDice(hs.n, hs.x) + hs.flat);
        }
      },
      onHalf(F, u) {
        const BC = u.t2 === 1 && K.t2.bloodiedChicken;
        if (BC) u.rage = (u.rage || 0) + BC.halfRage;
      },
      perSecond(F, u) {
        if (!(u.rage > 0)) return;
        u._bleedTick = (u._bleedTick || 0) + 1;
        if (u._bleedTick % K.rage.bleedInterval !== 0) return;
        const amt = Math.max(1, Math.ceil(u.rage / 2));
        dealDamage(F, u, u, amt, 'phys', { dot: 'bleed', floor1: true });
        for (const o of adjUnits(F, u, 'E')) {
          dealDamage(F, u, o, amt, 'phys', { dot: 'bleed' });
          if (o.alive && o.st.bleed < 2) addBleed(F, u, o, 1, false);
        }
      },
      ab: {
        can: (F, u) => hasTarget(F, u),
        cast(F, u, r) {
          const t = acquire(F, u); if (!t || !canHit(F, u, t)) return;
          const ds = spec(u, K.hug.damage);
          const effAc = u.ac + (u.st.acModT > 0 ? u.st.acMod : 0);
          abHit(F, u, t, ds.n, ds.x, ds.flat + Math.floor(effAc * K.hug.acShare), 'phys', r);
          if (t.alive) {
            applyControl(F, u, t, 'root', byRoll(K.hug.rootSeconds, r));
            addBleed(F, u, t, byRoll(K.hug.bleed, r), false);
          }
          if (K.hug.ward) { const bw = spec(u, K.hug.ward); addWard(F, u, u, rollDice(bw.n, bw.x, r.crit) + bw.flat, false); }
          const IS = u.t2 === 0 && K.t2.ironhideSpikes;
          if (IS && IS.ward) { const ws = spec(u, IS.ward); addWard(F, u, u, rollDice(ws.n, ws.x, r.crit) + ws.flat, false); }
        },
      },
    };
  },

  corporal_tobbin: c => { const K = c.kit2;
    return {
      ab: {
        can: (F, u) => alliesOf(F, u).length > 0,
        cast(F, u, r) {
          const HL = u.t2 === 0 && K.t2.holdTheLine, OT = u.t2 === 1 && K.t2.overTheTop;
          const wall = alliesOf(F, u).filter(a => a === u || dist(a, u) <= 1 || a.y === u.y);
          const acB = byRoll(K.horn.acBonus, r);
          const ws = spec(u, K.horn.ward);
          for (const a of wall) {
            if (a.st.acModT <= 0 || acB >= a.st.acMod) { a.st.acMod = acB; a.st.acModT = K.horn.seconds; }
            else a.st.acModT = Math.max(a.st.acModT, K.horn.seconds);
            if (HL) { a.st.srMod = Math.max(a.st.srModT > 0 ? a.st.srMod : 0, HL.srBonus); a.st.srModT = Math.max(a.st.srModT || 0, K.horn.seconds); }
            addWard(F, u, a, rollDice(ws.n, ws.x, r.crit) + ws.flat, false);
            if (OT) {
              a.st.haste = Math.max(a.st.haste || 0, OT.asBonus); a.st.hasteT = Math.max(a.st.hasteT || 0, OT.asSeconds);
              if (a !== u && OT.allyCharge) addCharge(a, OT.allyCharge);
            }
          }
          if (K.horn.bash) {
            const bt = acquire(F, u);
            if (bt && canHit(F, u, bt)) { const bs = spec(u, K.horn.bash); abHit(F, u, bt, bs.n, bs.x, bs.flat, 'phys', r); }
          }
          const k = byRoll(K.horn.inspireCount, r);
          const pool = alliesOf(F, u).filter(a => a !== u).sort((a, b) => (!!a.bardDie - !!b.bardDie) || dist(a, u) - dist(b, u));
          const targets = pool.length ? pool.slice(0, k) : [u];
          const bd = spec(u, K.inspiration.die);
          for (const a of targets) {
            a.bardDie = {
              n: bd.n, x: bd.x, flat: bd.flat, src: u,
              onDefend(F2, src, defender) {
                const w = rollDice(bd.n, bd.x) + bd.flat;
                addWard(F2, src || defender, defender, w, false);
                if (HL && src && src.alive) { const hs = spec(src, HL.spendHeal); heal(F2, src, src, rollDice(hs.n, hs.x) + hs.flat); }
              },
            };
          }
        },
      },
    };
  },

  vela: c => { const K = c.kit2;
    return {
      dmgAb: true,
      onStart(F, u) { u.ki = 0; },
      onAttack(F, u, t) {
        u.ki = Math.min(K.ki.max, (u.ki || 0) + 1);
        const PM = u.t2 === 0 && K.t2.plagueMask;
        if (PM && t && t.alive) {
          addPoison(F, u, t, PM.attackPoison);
          if (t.st.necrosis > 0) t.st.necrosis = Math.max(t.st.necrosis, K.harm.necrosisSeconds);
        }
      },
      ab: {
        can: (F, u) => hasTarget(F, u),
        cast(F, u, r) {
          const t = acquire(F, u); if (!t || !canHit(F, u, t)) return;
          const PM = u.t2 === 0 && K.t2.plagueMask, HM = u.t2 === 1 && K.t2.handOfMercy;
          const ds = spec(u, K.harm.damage);
          const kiDmg = (u.ki || 0) > 0 ? rollDice(u.ki, parseDice(K.ki.die).x, r.crit) : 0;
          const dmg = abHit(F, u, t, ds.n, ds.x, ds.flat + kiDmg, 'magic', r);
          if (t.alive) applyControl(F, u, t, 'necrosis', K.harm.necrosisSeconds);
          if (PM && (u.ki || 0) >= PM.splashAtKi) {
            for (const o of adjUnits(F, t, 'E')) {
              dealDamage(F, u, o, rollDice(ds.n, ds.x, r.crit) + ds.flat + kiDmg, 'magic', { ability: true, area: true });
              if (o.alive) applyControl(F, u, o, 'necrosis', K.harm.necrosisSeconds);
            }
          }
          const bh = K.harm.baseHeal ? spec(u, K.harm.baseHeal) : null;
          const hAmt = Math.max(1, Math.round(dmg * K.harm.healShare)) + (bh ? rollDice(bh.n, bh.x, r.crit) + bh.flat : 0);
          heal(F, u, u, hAmt);
          const ally = lowestPct(alliesOf(F, u).filter(a => a !== u)) || u;
          if (r.band === 'High' || HM) {
            if (ally !== u) heal(F, u, ally, Math.round(hAmt * 0.6));
            if (HM) {
              cleanse1(ally);
              const ws = spec(u, HM.ward);
              addWard(F, u, ally, rollDice(ws.n, ws.x, r.crit) + ws.flat, false);
            }
          }
        },
      },
    };
  },

  lady_malice: c => { const K = c.kit2;
    return {
      carryKeys: ['conquestHp'], dmgAb: true,
      onStart(F, u) {
        const bonus = u.conquestHp || 0;
        if (bonus > 0) { u.maxHp += bonus; u.hp += bonus; }
      },
      onAnyEnemyDeath(F, u, t) {
        if (dist(t, u) > K.aura.radius) return;
        const AD = u.t2 === 0 && K.t2.auraOfDominion, BT = u.t2 === 1 && K.t2.bloodTithe;
        const cap = AD ? AD.cap : K.aura.capPerTier * u.tier;
        const cur = u.conquestHp || 0;
        const gain = Math.min(K.aura.hpPerKill, Math.max(0, cap - cur));
        if (gain > 0) { u.conquestHp = cur + gain; u.maxHp += gain; u.hp += gain; }
        if (BT) {
          heal(F, u, u, Math.round(u.maxHp * BT.healPct));
          addCharge(u, BT.charge);
        }
      },
      perSecond(F, u) {
        const AD = u.t2 === 0 && K.t2.auraOfDominion;
        if (!AD) return;
        for (const o of foesOf(F, u).filter(e => dist(e, u) <= K.aura.radius)) {
          applyControl(F, u, o, 'slow', 1.2, AD.slow);
          o.st.weaken = Math.max(o.st.weaken || 0, AD.weaken);
          o.st.weakenT = Math.max(o.st.weakenT || 0, 1.2);
        }
      },
      ab: {
        can: (F, u) => foesOf(F, u).some(o => dist(o, u) <= K.aura.radius),
        cast(F, u, r) {
          const t = acquire(F, u);
          if (t && canHit(F, u, t)) {
            const sm = spec(u, K.smite.damage);
            const bonus = Math.floor((u.conquestHp || 0) / K.smite.hpDiv);
            abHit(F, u, t, sm.n, sm.x, sm.flat + bonus, 'magic', r);
          }
          const tSec = byRoll(K.presence.tauntSeconds, r);
          const ps = spec(u, K.presence.pulse);
          for (const o of foesOf(F, u).filter(e => dist(e, u) <= K.aura.radius)) {
            applyControl(F, u, o, 'taunt', tSec);
            dealDamage(F, u, o, rollDice(ps.n, ps.x, r.crit) + ps.flat, 'magic', { ability: true, area: true });
          }
          if (K.presence.ward) { const ws = spec(u, K.presence.ward); addWard(F, u, u, rollDice(ws.n, ws.x, r.crit) + ws.flat, false); }
        },
      },
    };
  },

  malthrax: c => { const K = c.kit2;
    return {
      kwHex: true, dmgAb: true,
      onStrike(F, u, t, dmg, crit) {
        if (!t || !t.st.hexed || dmg <= 0) return;
        const CH = u.t2 === 0 && K.t2.crimsonHunger;
        const cd = CH && pct(u) < CH.lowHpPct ? CH.lowCd : K.pact.cooldown;
        if (u.counters.pactCd > F.t) return;
        u.counters.pactCd = F.t + cd;
        const bs = spec(u, K.pact.bonus);
        const extra = t.alive ? dealDamage(F, u, t, rollDice(bs.n, bs.x, crit) + bs.flat, 'magic', { ability: true }) : 0;
        heal(F, u, u, Math.round((dmg + extra) * K.pact.healShare));
      },
      onHexedDeath(F, u, t) {
        const CH = u.t2 === 0 && K.t2.crimsonHunger;
        if (!CH) return;
        const nxt = nearest(tfoes(F, u).filter(o => !o.st.hexed), t || u);
        if (nxt) applyHex(F, u, nxt);
      },
      ab: {
        can: (F, u) => adjUnits(F, u, 'E').length > 0 || hasTarget(F, u),
        cast(F, u, r) {
          const FB = u.t2 === 1 && K.t2.frostAndBlood;
          const t = acquire(F, u);
          const targets = adjUnits(F, u, 'E');
          if (t && !targets.includes(t) && canHit(F, u, t)) targets.unshift(t);
          if (!targets.length) return;
          const ds = spec(u, K.curse.damage);
          for (const o of targets) abHit(F, u, o, ds.n, ds.x, ds.flat, 'phys', r, { area: targets.length > 1 });
          const main = (t && t.alive) ? t : targets.find(o => o.alive);
          if (main) applyHex(F, u, main);
          if (FB) {
            for (const o of targets) if (o.alive) applyControl(F, u, o, 'slow', FB.slowSeconds, FB.slow);
            const cnt = foesOf(F, u).filter(e => dist(e, u) <= 2 && (e.st.hexed || e.st.slowT > 0)).length;
            if (cnt > 0) {
              const fs = spec(u, FB.bonusPerFoe);
              for (const o of targets) if (o.alive) dealDamage(F, u, o, rollDice(fs.n * cnt, fs.x) + fs.flat, 'magic', { ability: true, area: true });
            }
          }
          const ws = spec(u, K.curse.ward);
          addWard(F, u, u, rollDice(ws.n, ws.x, r.crit) + ws.flat, false);
          if (r.band === 'High') {
            u.st.evaBuff = Math.max(u.st.evaBuff || 0, K.curse.highEvasion);
            u.st.evaT = Math.max(u.st.evaT || 0, K.curse.highEvaSeconds);
          }
        },
      },
    };
  },
});

// ---------------- Phase 2 Batch D (Strikers & Skirmishers): Falcorn, Moxie, Maxim, Suna, Petra ----------------
Object.assign(KITS2, {
  falcorn: c => { const K = c.kit2;
    const doDive = (F, u, r) => {
      u.st.airborne = K.dive.airSeconds;
      u.pend.push({ t: K.dive.airSeconds, fn(F2, u2) {
        if (!u2.alive) return true;
        const list = tfoes(F2, u2);
        if (!list.length) return true;
        const tg = list.sort((a, b) => dist(b, u2) - dist(a, u2))[0];
        const cl = freeCellNear(F2, tg.x, tg.y, 'H', 1);
        if (cl && dist(cl, tg) <= 1) moveTo(F2, u2, cl.x, cl.y);
        u2.target = tg;
        u2.rage = (u2.rage || 0) + 1;
        const ds = spec(u2, K.dive.damage);
        const dmg = abHit(F2, u2, tg, ds.n, ds.x, ds.flat + u2.rage * K.rage.divePerStack, 'phys', r);
        if (r.band === 'High') {
          for (const o of adjUnits(F2, tg, 'E')) {
            dealDamage(F2, u2, o, Math.round(dmg * 0.5), 'phys', { ability: true, area: true });
            if (o.alive) applyControl(F2, u2, o, 'stun', K.dive.highStunSeconds);
          }
        }
        const GW = u2.t2 === 1 && K.t2.galeWings;
        if (GW) {
          for (const o of adjUnits(F2, u2, 'E')) applyControl(F2, u2, o, 'stun', GW.stunSeconds);
          if (GW.ward) { const gw = spec(u2, GW.ward); addWard(F2, u2, u2, rollDice(gw.n, gw.x) + gw.flat, false); }
          u2.st.evaBuff = Math.max(u2.st.evaBuff || 0, GW.evasion);
          u2.st.evaT = Math.max(u2.st.evaT || 0, GW.evaSeconds);
        }
        return true;
      } });
    };
    return {
      dmgAb: true,
      onStart(F, u) { u.rage = 0; u._atkCnt = 0; },
      onStrike(F, u, t) {
        if (t && t.alive && (u.rage || 0) > 0) dealDamage(F, u, t, u.rage * K.rage.atkPerStack, 'phys', { onhit: true });
      },
      onAttack(F, u) {
        u._atkCnt = (u._atkCnt || 0) + 1;
        if (u._atkCnt % 2 === 0) u.rage = (u.rage || 0) + 1;
      },
      onKill(F, u) {
        u.rage = (u.rage || 0) + K.rage.killStacks;
        const AP = u.t2 === 0 && K.t2.apexPredator;
        if (AP) {
          addCharge(u, AP.killCharge);
          if (!(u.counters.apDiveCd > F.t) && tfoes(F, u).length > 0) {
            u.counters.apDiveCd = F.t + AP.diveCd;
            doDive(F, u, { band: 'Mid', crit: false, xd: 0 });
          }
        }
      },
      ab: {
        can: (F, u) => tfoes(F, u).length > 0,
        cast(F, u, r) { doDive(F, u, r); },
      },
    };
  },

  moxie: c => { const K = c.kit2;
    const maxJuggle = u => (u.t2 === 0 && K.t2.grandFinale ? K.t2.grandFinale.max : K.juggle.max);
    return {
      dmgAb: true,
      onStart(F, u) {
        const GF = u.t2 === 0 && K.t2.grandFinale;
        u.juggle = GF && GF.startJuggle ? GF.startJuggle : 0;
      },
      onAttack(F, u, t) {
        const extra = u.juggle || 0;
        if (extra <= 0 || !t) return;
        const bp = parseDice(K.juggle.blade.dice);
        for (let i = 0; i < extra; i++) {
          const tg = t.alive ? t : nearest(tfoes(F, u).filter(o => canHit(F, u, o)), u);
          if (!tg) break;
          dealDamage(F, u, tg, rollDice(bp.n, bp.x), 'phys', { attack: true });
        }
      },
      ab: {
        can: (F, u) => tfoes(F, u).some(o => canHit(F, u, o)),
        cast(F, u, r) {
          const GF = u.t2 === 0 && K.t2.grandFinale, RE = u.t2 === 1 && K.t2.razorEncore;
          u.juggle = Math.min(maxJuggle(u), (u.juggle || 0) + 1);
          const list = tfoes(F, u).filter(o => canHit(F, u, o));
          const tg = densest(F, u, list.length ? list : tfoes(F, u));
          if (tg) {
            const dur = byRoll(K.cloud.seconds, r);
            const td = spec(u, K.cloud.tickDamage);
            for (const o of foesOf(F, u).filter(e => dist(e, tg) <= K.cloud.radius)) {
              abHit(F, u, o, td.n, td.x, td.flat, 'phys', r, { area: true });
            }
            addPod(F, u, tg.x, tg.y, {
              tag: 'daggers', interval: 1.0, life: dur, maxPods: 2,
              onPulse(F2, p) {
                for (const o of foesOf(F2, u).filter(e => dist(e, p) <= K.cloud.radius)) {
                  dealDamage(F2, u, o, rollDice(td.n, td.x) + td.flat, 'phys', { ability: true, area: true });
                }
              },
            });
            if (GF && r.band === 'High' && (u.juggle || 0) > 0) {
              const bp = parseDice(K.juggle.blade.dice);
              for (const o of tfoes(F, u).slice(0, GF.highFanTargets)) {
                dealDamage(F, u, o, rollDice(bp.n * u.juggle, bp.x, r.crit), 'phys', { ability: true, area: true });
              }
            }
          }
          const ally = nearest(alliesOf(F, u).filter(a => a !== u && a.ab), u) || u;
          const bd = spec(u, K.inspiration.die);
          ally.bardDie = {
            n: bd.n, x: bd.x, flat: bd.flat, src: u,
            onSpend(F2, src) {
              if (!src || !src.alive) return;
              src.juggle = Math.min(maxJuggle(src), (src.juggle || 0) + 1);
              if (RE) {
                if (RE.moxieCharge) addCharge(src, RE.moxieCharge);
                const ep = spec(src, RE.pulse);
                const ctr = densest(F2, src, tfoes(F2, src));
                if (ctr) {
                  for (const o of foesOf(F2, src).filter(e => dist(e, ctr) <= K.cloud.radius)) {
                    dealDamage(F2, src, o, rollDice(ep.n, ep.x) + ep.flat, 'phys', { ability: true, area: true });
                  }
                }
              }
            },
          };
        },
      },
    };
  },

  maxim: c => { const K = c.kit2;
    return {
      dmgAb: true,
      onStart(F, u) { u._xbowAtks = 0; },
      onAttack(F, u, t) {
        const CM = u.t2 === 0 && K.t2.crossbowMaster;
        const every = CM ? CM.everyNth : K.surge.everyNth;
        u._xbowAtks = (u._xbowAtks || 0) + 1;
        if (u._xbowAtks % every === 0) {
          const bolts = CM && CM.extraBolts ? CM.extraBolts : 1;
          for (let i = 0; i < bolts; i++) {
            if (CM && CM.ignoreEvasion) u.nextStrikeTrue = true;
            actionSurge(F, u, { fallbackTarget: t });
          }
        }
      },
      ab: {
        can: (F, u) => tfoes(F, u).some(o => canHit(F, u, o)),
        cast(F, u, r) {
          const BA = u.t2 === 1 && K.t2.burstingArrow;
          const list = tfoes(F, u).filter(o => canHit(F, u, o));
          const tg = deadliest(list.length ? list : tfoes(F, u));
          if (!tg) return;
          const ds = spec(u, K.shot.damage, r);
          abHit(F, u, tg, ds.n, ds.x, ds.flat, 'phys', r);
          if (r.band === 'High' && tg.alive) {
            tg.st.acMod = Math.min(tg.st.acModT > 0 ? tg.st.acMod : 0, K.shot.highAcShred);
            tg.st.acModT = Math.max(tg.st.acModT || 0, K.shot.highAcSeconds);
          }
          if (BA) {
            const sp = spec(u, BA.splash);
            for (const o of adjUnits(F, tg, 'E')) {
              dealDamage(F, u, o, rollDice(sp.n, sp.x, r.crit) + sp.flat, 'magic', { ability: true, area: true });
              if (o.alive && BA.acShred) { o.st.acMod = Math.min(o.st.acModT > 0 ? o.st.acMod : 0, BA.acShred); o.st.acModT = Math.max(o.st.acModT || 0, BA.acSeconds); }
            }
            if (!u._baPierce) {
              u._baPierce = BA.pierceBonus; u.pierce += BA.pierceBonus;
              u.pend.push({ t: BA.pierceSeconds, fn(F2, u2) { u2.pierce = Math.max(0, u2.pierce - (u2._baPierce || 0)); u2._baPierce = 0; return true; } });
            }
          }
        },
      },
    };
  },

  suna: c => { const K = c.kit2;
    return {
      dmgAb: true,
      onStart(F, u) {
        const OW = u.t2 === 0 && K.t2.oneWithTheBow, PA = u.t2 === 1 && K.t2.patientAim;
        u.ki = PA ? PA.startKi : (OW && OW.startKi ? OW.startKi : 0);
        if (u.ki >= K.ki.max) u.nextStrikeTrue = true;
      },
      onStrike(F, u, t, dmg, crit) {
        if (!t) return;
        const kp = parseDice(K.ki.bonusPerKi);
        if ((u.ki || 0) > 0 && t.alive) dealDamage(F, u, t, rollDice(u.ki * kp.n, kp.x, crit), 'phys', { attack: true, crit });
        const OW = u.t2 === 0 && K.t2.oneWithTheBow;
        if (OW && (u.ki || 0) >= OW.pierceAtKi) {
          const second = foesOf(F, u).filter(e => e !== t && dist(e, t) <= (OW.pierceRadius || 2)).sort((a, b) => dist(a, t) - dist(b, t))[0];
          if (second) {
            const pd = spec(u, OW.pierceDamage);
            dealDamage(F, u, second, rollDice(pd.n, pd.x, crit) + pd.flat, 'phys', { attack: true, area: true, ignoreEvasion: true });
          }
        }
      },
      onAttack(F, u) {
        u.ki = Math.min(K.ki.max, (u.ki || 0) + 1);
        if (u.ki >= K.ki.max) u.nextStrikeTrue = true;
      },
      ab: {
        can: (F, u) => tfoes(F, u).some(o => canHit(F, u, o)),
        cast(F, u, r) {
          const PA = u.t2 === 1 && K.t2.patientAim;
          u.ki = Math.min(K.ki.max, (u.ki || 0) + 1);
          if (u.ki >= K.ki.max) u.nextStrikeTrue = true;
          const list = tfoes(F, u).filter(o => canHit(F, u, o));
          const tg = deadliest(list.length ? list : tfoes(F, u));
          if (!tg) return;
          const ds = spec(u, K.shot.damage, r);
          abHit(F, u, tg, ds.n, ds.x, ds.flat, 'phys', r, { crit: r.band === 'High' || r.crit });
          if (PA && tg.alive) {
            tg.st.acMod = Math.min(tg.st.acModT > 0 ? tg.st.acMod : 0, PA.acShred);
            tg.st.acModT = Math.max(tg.st.acModT || 0, PA.acSeconds);
            applyControl(F, u, tg, 'slow', PA.slowSeconds, PA.slow);
          }
        },
      },
    };
  },

  petra: c => { const K = c.kit2;
    return {
      dmgAb: true,
      onStart(F, u) { u._chasing = false; },
      tick(F, u) {
        const others = alliesOf(F, u).filter(a => a !== u);
        if (!others.length) return;
        const topOther = Math.max(...others.map(a => a.stat.dmg));
        const behind = topOther > u.stat.dmg;
        if (behind) {
          u.st.haste = Math.max(u.st.haste || 0, K.chaser.asBonus);
          u.st.hasteT = Math.max(u.st.hasteT || 0, 0.2);
          if (!u._chasing) { u._chasing = true; u.cr += K.chaser.crBonus; }
        } else {
          if (u._chasing) { u._chasing = false; u.cr = Math.max(0, u.cr - K.chaser.crBonus); }
          if (u.stat.dmg > 0) {
            const BB = u.t2 === 1 && K.t2.bahamutsBanner;
            for (const a of others) {
              a.st.petraAura = Math.max(a.st.petraAura || 0, 0.25);
              if (BB) {
                a.st.acMod = Math.max(a.st.acModT > 0 ? a.st.acMod : 0, BB.acBonus); a.st.acModT = Math.max(a.st.acModT || 0, 0.25);
                a.st.srMod = Math.max(a.st.srModT > 0 ? a.st.srMod : 0, BB.srBonus); a.st.srModT = Math.max(a.st.srModT || 0, 0.25);
              }
            }
          }
        }
      },
      ab: {
        can: (F, u) => hasTarget(F, u),
        cast(F, u, r) {
          const PR = u.t2 === 0 && K.t2.platinumRival, BB = u.t2 === 1 && K.t2.bahamutsBanner;
          const t = acquire(F, u); if (!t || !canHit(F, u, t)) return;
          const ls = spec(u, K.charge.lance), sm = spec(u, K.charge.smite);
          abHit(F, u, t, ls.n, ls.x, ls.flat, 'phys', r, { crit: true });
          if (t.alive) dealDamage(F, u, t, rollDice(sm.n, sm.x, true), 'radiant', { ability: true, crit: true });
          if (t.alive) pushUnit(F, u, t, K.charge.push);
          if (K.charge.selfWard) { const sw = spec(u, K.charge.selfWard); addWard(F, u, u, rollDice(sw.n, sw.x, r.crit) + sw.flat, false); }
          if (PR) {
            if (t.alive && canHit(F, u, t)) strike(F, u, t, {});
            if (!t.alive) addCharge(u, PR.killRefund);
          }
          if (BB) {
            const ws = spec(u, BB.ward);
            for (const a of alliesOf(F, u)) addWard(F, u, a, rollDice(ws.n, ws.x, r.crit) + ws.flat, false);
          }
        },
      },
    };
  },
});

// ---------------- Phase 2 Batch E (Control, Disruption & Utility): Burbrax, Colony, Nix, Rico, Hewitt ----------------
Object.assign(KITS2, {
  burbrax: c => { const K = c.kit2;
    const syncEva = u => { u.eva = (u.def.evasion || 0) + (u.ki || 0) * K.ki.evaPerKi; };
    return {
      dmgAb: true,
      onStart(F, u) {
        const DS = u.t2 === 1 && K.t2.drunkenSway;
        u.ki = DS ? DS.startKi : 0;
        syncEva(u);
      },
      onAttack(F, u) {
        if ((u.ki || 0) < K.ki.max) { u.ki = (u.ki || 0) + 1; syncEva(u); }
      },
      onAvoid(F, u, src) {
        const TP = u.t2 === 0 && K.t2.topShelfProof, DS = u.t2 === 1 && K.t2.drunkenSway;
        if (TP && src && src.alive && !(u.counters.tpCd > F.t)) {
          u.counters.tpCd = F.t + TP.cd;
          const ds = spec(u, TP.damage);
          dealDamage(F, u, src, rollDice(ds.n, ds.x) + ds.flat, 'magic', { ability: true });
          if (src.alive) addBurn(F, u, src, TP.burn);
        }
        if (DS) {
          if ((u.ki || 0) < K.ki.max) { u.ki = (u.ki || 0) + 1; syncEva(u); }
          addCharge(u, DS.avoidCharge);
        }
      },
      ab: {
        can: (F, u) => hasTarget(F, u),
        cast(F, u, r) {
          const t = acquire(F, u); if (!t) return;
          const cone = foesOf(F, u).filter(e => dist(e, t) <= 1 && dist(e, u) <= 2);
          if (!cone.includes(t)) cone.unshift(t);
          const ds = spec(u, K.breath.damage);
          const burnAmt = byRoll(K.breath.burn, r);
          for (const o of cone) {
            abHit(F, u, o, ds.n, ds.x, ds.flat, 'magic', r, { area: cone.length > 1 });
            if (o.alive) {
              addBurn(F, u, o, burnAmt);
              applyControl(F, u, o, 'disadv', K.breath.disadvSeconds);
            }
          }
          if (K.breath.selfWard) { const sw = spec(u, K.breath.selfWard); addWard(F, u, u, rollDice(sw.n, sw.x, r.crit) + sw.flat, false); }
          for (const a of [u, ...adjUnits(F, u, 'H')]) {
            a.st.evaBuff = Math.max(a.st.evaBuff || 0, K.breath.allyEva);
            a.st.evaT = Math.max(a.st.evaT || 0, K.breath.allyEvaSeconds);
          }
        },
      },
    };
  },

  colony: c => { const K = c.kit2;
    return {
      kwMark: true, dmgAb: true,
      onStart(F, u) { u._swarmT = 0; u._firstHit = false; },
      onStrike(F, u, t) {
        if (!u._firstHit && t && t.alive) { u._firstHit = true; applyHuntersMark(F, u, t); }
      },
      onMarkedDeath(F, u, t) {
        const KB = u.t2 === 0 && K.t2.killerBees;
        if (!KB || !KB.jumpMark) return;
        const nxt = nearest(tfoes(F, u).filter(o => !o.st.marked), t || u);
        if (nxt) applyHuntersMark(F, u, nxt);
      },
      perSecond(F, u) {
        u._swarmT = (u._swarmT || 0) + 1;
        if (u._swarmT % K.swarm.interval !== 0) return;
        const KB = u.t2 === 0 && K.t2.killerBees, BS = u.t2 === 1 && K.t2.blindingSwarm;
        const ds = spec(u, K.swarm.damage);
        const hitSet = new Set(adjUnits(F, u, 'E'));
        const marked = foesOf(F, u).filter(e => e.st.marked);
        for (const m of marked) hitSet.add(m);
        for (const o of hitSet) {
          dealDamage(F, u, o, rollDice(ds.n, ds.x) + ds.flat, 'magic', { ability: true, area: true });
          if (o.alive && o.st.marked) {
            applyControl(F, u, o, 'slow', K.swarm.markSeconds, K.swarm.markSlow);
            applyControl(F, u, o, 'disadv', K.swarm.markSeconds);
          }
          if (KB && o.alive) addPoison(F, u, o, KB.poison);
        }
        if (BS) {
          for (const a of alliesOf(F, u)) {
            if (dist(a, u) <= BS.radius || marked.some(m => dist(a, m) <= BS.radius)) {
              a.st.evaBuff = Math.max(a.st.evaBuff || 0, BS.evasion);
              a.st.evaT = Math.max(a.st.evaT || 0, BS.evaSeconds);
            }
          }
        }
      },
      ab: {
        can: (F, u) => foesOf(F, u).some(o => dist(o, u) <= K.surge.radius),
        cast(F, u, r) {
          const targets = foesOf(F, u).filter(o => dist(o, u) <= K.surge.radius);
          if (!targets.length) return;
          const ds = spec(u, K.surge.damage);
          const sSec = byRoll(K.surge.slowSeconds, r);
          for (const o of targets) {
            abHit(F, u, o, ds.n, ds.x, ds.flat, 'magic', r, { area: targets.length > 1 });
            if (o.alive) applyControl(F, u, o, 'slow', sSec, K.surge.slow);
          }
          if (K.surge.selfWard) { const sw = spec(u, K.surge.selfWard); addWard(F, u, u, rollDice(sw.n, sw.x, r.crit) + sw.flat, false); }
          const mk = deadliest(targets.filter(o => o.alive));
          if (mk) applyHuntersMark(F, u, mk);
        },
      },
    };
  },

  nix: c => { const K = c.kit2;
    const ambush = (F, u, t, force) => {
      if (!t || !t.alive || (!force && u.counters.sa > F.t)) return;
      if (!force && !controlled(t)) return;
      u.counters.sa = F.t + K.sneak.cooldown;
      const ST = u.t2 === 1 && K.t2.spellThief;
      const ds = spec(u, ST ? ST.damage : K.sneak.damage);
      dealDamage(F, u, t, rollDice(ds.n, ds.x) + ds.flat, 'magic', { ability: true });
      const others = alliesOf(F, u).filter(a => a !== u && a.ab).sort((a, b) => (a.charge / a.maxCharge) - (b.charge / b.maxCharge));
      const ally = others[0] || u;
      const stealAmt = ST ? ST.steal : K.sneak.steal;
      const minChg = ST && ST.minAllyCharge ? ST.minAllyCharge : K.sneak.minAllyCharge;
      const stolen = stealCharge(F, u, t, stealAmt, ally);
      if (stolen < minChg) addCharge(ally, minChg - stolen);
    };
    return {
      dmgAb: true,
      onAttack(F, u, t) { ambush(F, u, t, false); },
      onEnemyRoll(F, u, enemy, r) {
        const ST = u.t2 === 1 && K.t2.spellThief;
        if (!ST || !(r.fizzle || r.dis)) return;
        const others = alliesOf(F, u).filter(a => a !== u && a.ab).sort((a, b) => b.stat.dmg - a.stat.dmg);
        const top = others[0] || u;
        const stolen = stealCharge(F, u, enemy, ST.steal, top);
        if (stolen < ST.steal) addCharge(top, Math.round((ST.steal - stolen) * 0.5));
        const ds = spec(u, ST.damage);
        dealDamage(F, u, enemy, rollDice(ds.n, ds.x) + ds.flat, 'magic', { ability: true });
      },
      ab: {
        can: (F, u) => tfoes(F, u).length > 0,
        cast(F, u, r) {
          const VT = u.t2 === 0 && K.t2.versatileTrickster;
          const list = tfoes(F, u).slice().sort((a, b) => ((!!b.ab) - (!!a.ab)) || ((b.charge || 0) - (a.charge || 0)));
          const tg = list[0];
          if (!tg) return;
          const ds = spec(u, K.sabotage.damage);
          abHit(F, u, tg, ds.n, ds.x, ds.flat, 'magic', r);
          if (tg.alive) {
            applyControl(F, u, tg, 'disadv', byRoll(K.sabotage.disadvSeconds, r));
            if (VT) {
              const sw = spec(u, VT.stripWard);
              const strip = rollDice(sw.n, sw.x);
              if (tg.ward > 0) tg.ward = Math.max(0, tg.ward - strip);
              else dealDamage(F, u, tg, Math.round(strip * 0.5), 'magic', { ability: true });
            }
            ambush(F, u, tg, true);
          }
          const lo = lowestPctFront(F, u);
          if (lo) {
            const ws = spec(u, K.sabotage.allyWard);
            addWard(F, u, lo, rollDice(ws.n, ws.x, r.crit) + ws.flat, false);
            if (VT) { lo.st.evaBuff = Math.max(lo.st.evaBuff || 0, VT.evasion); lo.st.evaT = Math.max(lo.st.evaT || 0, VT.evaSeconds); }
          }
        },
      },
    };
  },

  rico: c => { const K = c.kit2;
    const rakish = (F, u, t, force) => {
      if (!t || !t.alive || (!force && u.counters.sa > F.t)) return;
      const isolated = adjUnits(F, t, 'H').filter(o => o !== u).length === 0;
      if (!force && !isolated) return;
      u.counters.sa = F.t + K.sneak.cooldown;
      const MD = u.t2 === 0 && K.t2.masterDuelist;
      const crit = !!(MD && MD.isoCrit && isolated);
      const ds = spec(u, K.sneak.damage);
      dealDamage(F, u, t, rollDice(ds.n, ds.x, crit) + ds.flat, 'phys', { attack: !force, ability: !!force, crit });
      if (MD && MD.resetOnKill && !t.alive) u.counters.sa = 0;
    };
    return {
      dmgAb: true,
      onAttack(F, u, t) { rakish(F, u, t, false); },
      onAvoid(F, u) {
        const PA = u.t2 === 1 && K.t2.panache;
        if (PA) addCharge(u, PA.avoidCharge);
      },
      ab: {
        can: (F, u) => hasTarget(F, u),
        cast(F, u, r) {
          const PA = u.t2 === 1 && K.t2.panache;
          const t = acquire(F, u); if (!t || !canHit(F, u, t)) return;
          rakish(F, u, t, true);
          const ws = spec(u, K.footwork.ward);
          addWard(F, u, u, rollDice(ws.n, ws.x, r.crit) + ws.flat, false);
          if (t.alive) {
            applyControl(F, u, t, 'taunt', byRoll(K.footwork.tauntSeconds, r));
            if (PA) {
              t.st.acMod = Math.min(t.st.acModT > 0 ? t.st.acMod : 0, -PA.stealAc); t.st.acModT = Math.max(t.st.acModT || 0, PA.stealSeconds);
              u.st.acMod = Math.max(u.st.acModT > 0 ? u.st.acMod : 0, PA.stealAc); u.st.acModT = Math.max(u.st.acModT || 0, PA.stealSeconds);
            }
          }
          if (r.band !== 'Low' && K.footwork.eva) {
            u.st.evaBuff = Math.max(u.st.evaBuff || 0, K.footwork.eva);
            u.st.evaT = Math.max(u.st.evaT || 0, K.footwork.evaSeconds);
          }
        },
      },
    };
  },

  hewitt: c => { const K = c.kit2; const maxSp = K.metamagic.maxSp || 4;
    const gainSp = (F, u) => {
      if (u.counters.spCd > F.t) return;
      u.counters.spCd = F.t + (K.metamagic.spCd || 1.5);
      u.sp = Math.min(maxSp, (u.sp || 0) + 1);
    };
    return {
      onStart(F, u) {
        const CC = u.t2 === 1 && K.t2.clockworkCavalcade;
        u.sp = CC && CC.startSp ? CC.startSp : (K.metamagic.startSp || 0);
        u._ocTargets = [];
      },
      onAllyCast(F, u, ally) {
        if (ally !== u && ally.st.statBuffT > 0) gainSp(F, u);
      },
      tick(F, u) {
        for (const a of (u._ocTargets || [])) {
          if (!a.alive || a.st.statBuffT <= 0) continue;
          const cnt = a.atkCount || 0;
          const prev = a._hewittAtks || 0;
          if (cnt - prev >= K.metamagic.atksForSp) { a._hewittAtks = cnt; gainSp(F, u); }
        }
      },
      ab: {
        can: (F, u) => alliesOf(F, u).length > 0,
        cast(F, u, r) {
          const TO = u.t2 === 0 && K.t2.tranceOfOrder, CC = u.t2 === 1 && K.t2.clockworkCavalcade;
          const supercharge = (u.sp || 0) >= maxSp;
          if (supercharge) u.sp = 0; else u.sp = Math.min(maxSp, (u.sp || 0) + 1);
          const others = alliesOf(F, u).filter(a => a !== u).sort((a, b) => (b.stat.dmg - a.stat.dmg) || dist(a, u) - dist(b, u));
          const pool = others.length ? others : [u];
          const targets = pool.slice(0, supercharge ? 2 : 1);
          const amt = byRoll(K.overclock.statAmt, r) + (u.tier - 1) * 2;
          const ws = spec(u, K.overclock.ward);
          u._ocTargets = targets;
          for (const a of targets) {
            a.st.statBuff = { key: a.key, amt };
            a.st.statBuffT = Math.max(a.st.statBuffT || 0, K.overclock.seconds);
            a.st.haste = Math.max(a.st.haste || 0, K.overclock.asBonus);
            a.st.hasteT = Math.max(a.st.hasteT || 0, K.overclock.seconds);
            a._hewittAtks = a.atkCount || 0;
            addWard(F, u, a, rollDice(ws.n, ws.x, r.crit) + ws.flat, false);
            if (K.overclock.allyCharge) addCharge(a, K.overclock.allyCharge);
            if (supercharge || TO) a.st.noFizzle = Math.max(a.st.noFizzle || 0, TO ? TO.noFizzleSeconds : 6);
            if (TO) addCharge(a, TO.allyCharge);
          }
          if (supercharge && CC) {
            const pw = spec(u, CC.partyWard);
            for (const a of alliesOf(F, u)) {
              addWard(F, u, a, rollDice(pw.n, pw.x, r.crit) + pw.flat, false);
              if (CC.partyEva) { a.st.evaBuff = Math.max(a.st.evaBuff || 0, CC.partyEva); a.st.evaT = Math.max(a.st.evaT || 0, CC.partyEvaSeconds); }
              cleanse1(a);
            }
          }
        },
      },
    };
  },
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
  if (a.ignoreEvasion) out.ignoreEvasion = true;
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
function rearmostHero(F, from, maxD) { const sn = !!(RULES.map && RULES.map.southNorth); const hs = F.units.filter(o => o.alive && o.side === 'H' && !o.summon && o.st.stealth <= 0 && (maxD === undefined || dist(o, from) <= maxD)); return hs.sort((a, b) => sn ? (b.y - a.y || a.x - b.x) : (a.x - b.x || a.y - b.y))[0]; }
function farthestHero(F, from) { const sn = !!(RULES.map && RULES.map.southNorth); const hs = F.units.filter(o => o.alive && o.side === 'H' && !o.summon); return hs.sort((a, b) => dist(b, from) - dist(a, from) || (sn ? b.y - a.y : a.x - b.x))[0]; }
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
    tick(F, u) { const B = c.halfHp; const sn = !!(RULES.map && RULES.map.southNorth); if (!u.buffet && u.hp < u.maxHp / 2) { u.buffet = 1; const s = rollStr(B.damage.dice); for (const h of adjUnits(F, u, 'H')) { dealDamage(F, u, h, rollDice(s.n, s.x) + s.flat, 'phys', {}); for (let i = 0; i < B.pushSquares; i++) { const nx = sn ? h.x : h.x - 1, ny = sn ? h.y + 1 : h.y; if (free(F, nx, ny)) moveTo(F, h, nx, ny); } } if (B.rechargesBreath) u.charge = u.maxCharge; } },
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
const ASCII_TERR = { '#': 'wall', O: 'rock', '~': 'water', c: 'crates', w: 'web', f: 'forge', t: 'tower' };
function parseAsciiMap(mapId) {
  const m = CFG.maps && CFG.maps.maps && CFG.maps.maps[mapId];
  if (!m) return { mapId, mapName: '', biome: 'dungeon', terrain: [], deploy: [] };
  const terrain = [], deploy = [];
  m.grid.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const ch = row[x];
      if (ch === 'P') deploy.push({ x, y });
      else if (ch === 't') { terrain.push(['tower', x, y]); if (y >= 5) deploy.push({ x, y }); }
      else if (ASCII_TERR[ch]) terrain.push([ASCII_TERR[ch], x, y]);
    }
  });
  return { mapId, mapName: m.name, biome: m.biome, terrain, deploy };
}
const encFromCfg = e => ({ id: e.id, name: e.name, enemies: e.enemies.map(([id, x, y]) => ({ id, x, y })), terrain: e.terrain || [] });
const ACT1 = CFG.enemies.encounters.map(encFromCfg);
const BOSSES = {};
for (const b of CFG.enemies.bosses) {
  if (b.active === false) continue;
  if (RULES.map && RULES.map.southNorth && CFG.maps && CFG.maps.bosses && CFG.maps.bosses[b.id]) {
    const bm = CFG.maps.bosses[b.id];
    const parsed = parseAsciiMap(bm.map);
    BOSSES[b.id] = { id: b.id, name: bm.name, mapId: parsed.mapId, mapName: parsed.mapName, biome: parsed.biome, templateId: 'boss_' + b.id, enemies: bm.enemies.map(([id, x, y]) => ({ id, x, y })), terrain: parsed.terrain, deploy: parsed.deploy };
  } else {
    BOSSES[b.id] = encFromCfg(b);
  }
}
