/* ================= 0.23 KEYWORD GLOSSARY, STAT ICONS & ITEM ICONS ================= */
const GLOSS = [
  { k: "nat20", n: "Natural 20", re: /\bnatural 20s?\b|\bNat 20s?\b/i, d: "A board-bending critical ability roll that breaks action economy or empowers the whole party." },
  { k: "fizzle", n: "Fizzle", re: /\bfizzles?\b/i, d: "An ability roll of 1. Nothing happens, and half the Charge comes back. WIS raises your minimum natural roll floor to eliminate fizzles." },
  { k: "band", n: "Low, Mid and High", re: /\b(Low|Mid|High) (band|rolls?)\b/, d: "Low/Mid give the baseline effect; High triggers the hero’s signature state change or recursion firework; Nat 20 is the tabletop cheer moment." },
  { k: "advantage", n: "Advantage", re: /\bAdvantage\b/, d: "Roll two d20s for the next ability roll and keep the higher result." },
  { k: "evasion", n: "Evasion", re: /\bEvasion\b|\bevades?\b|\bevading\b/i, d: "Universal multiplicative % chance to take 0 damage from enemy basic attacks (spells and abilities still connect; Exposed suppresses Evasion)." },
  { k: "ability", n: "Ability Charge", re: /\bCharg(e|es|ed|ing)\b/, d: "Abilities charge over time and from triggers, sped up by INT. No hero ability can fire more than once per second." },
  { k: "radiant", n: "Radiant damage", re: /\bRadiant\b/, d: "Rare sacred damage that ignores both AC and SR and stops undead from rising." },
  { k: "ward", n: "Ward", re: /\bWards?\b/, d: "A temporary shield of extra HP. Damage and Necrosis hit Ward before health." },
  { k: "necrosis", n: "Necrosis", re: /\bnecrosis\b/i, d: "Grows from the left edge of the health bar as a kill threshold. Cannot be healed; a unit executes immediately when HP drops to the Necrosis line." },
  { k: "burn", n: "Burn", re: /\b(Burn|burns|burning)\b/, d: "Fire damage over time (pierces half SR) that ticks every 0.5s and fades unless fed or detonated." },
  { k: "poison", n: "Poison", re: /\bpoison(ed|s)?\b/i, d: "Stacking damage over time (pierces half SR) that ticks every 0.5s and slowly fades (-12%/s). CON resists it." },
  { k: "taunt", n: "Taunt", re: /\btaunt(s|ed|ing)?\b/i, d: "Forces affected foes to attack this hero." },
  { k: "stun", n: "Stun", re: /\bstun(s|ned)?\b/i, d: "Cannot move, attack, or charge abilities." },
  { k: "root", n: "Root", re: /\broot(s|ed)?\b/i, d: "Cannot move, but can still attack and cast." },
  { k: "staggered", n: "Staggered", re: /\bStagger(s|ed|ing)?\b/, d: "Attacks and moves 30% slower." },
  { k: "exposed", n: "Exposed", re: /\bExposed\b/, d: "−2 AC and −2 SR, and suppresses Stealth and Evasion." },
  { k: "onhit", n: "On-hit", re: /\bon[- ]hit\b/i, d: "Effects that trigger on every strike or multi-arrow hit." },
  { k: "AC", n: "AC (Armor Class)", re: /\bAC\b/, d: "Cubed physical mitigation: DR = AC³ / (AC³ + 14³). AC 14 blocks 50%; AC 20 blocks 74.5%. Melee STR and Armor Pen reduce effective AC." },
  { k: "SR", n: "SR (Spell Resistance)", re: /\bSR\b/, d: "Cubed magic mitigation: DR = SR³ / (SR³ + 14³). Raised by WIS; pierced by Spell Pen." },
  { k: "HP", n: "HP", re: /\bHP\b/, d: "Hit points, scaled linearly by CON and hero tier." },
  { k: "attr-str", n: "Strength (STR)", re: /\bStrength\b|\bSTR\b/, d: "Melee weapon damage + flat Armor Penetration (+1 AC ignored per STR). At +3, melee heroes Intercept chargers." },
  { k: "attr-dex", n: "Dexterity (DEX)", re: /\bDexterity\b|\bDEX\b/, d: "Linear Attack Speed (+6%/DEX for DEX weapons, +4%/DEX otherwise), DEX weapon damage, and +1 AC per point." },
  { k: "attr-con", n: "Constitution (CON)", re: /\bConstitution\b|\bCON\b/, d: "+18 Max HP per point (scaled by tier), faster regen, and poison resistance." },
  { k: "attr-int", n: "Intelligence (INT)", re: /\bIntelligence\b|\bINT\b/, d: "+10% Charge Speed per point (cast cadence, capped at 1 cast/second)." },
  { k: "attr-wis", n: "Wisdom (WIS)", re: /\bWisdom\b|\bWIS\b/, d: "+1 Spell Resistance per point and raises the minimum natural d20 roll floor (1 + WIS) for combo consistency." },
  { k: "attr-cha", n: "Charisma (CHA)", re: /\bCharisma\b|\bCHA\b/, d: "Commanding Presence: +8% potency and duration per point on buffs, debuffs, Inspiration, and Wards." },
  { k: "key-attr", n: "Key Attribute", re: /\bkey attribute\b/i, d: "Added to the hero’s ability d20 roll, shifts the High roll threshold, and scales ability/heal/Ward potency." },
  { k: "spec", n: "Tier II Specialization", re: /\bSpecializations?\b/i, d: "Chosen at Tier II: one clean rule that sharpens this hero’s engine or wires it into the party. Retrain freely at Campfires." },
  { k: "boon", n: "Tier IV Epic Boon", re: /\bEpic Boons?\b/i, d: "Unlocked at Tier IV: pick 1 of 3 universal endgame boons drawn from a shared 9-card deck." },
  { k: "multiclass", n: "Multiclass Dip", re: /\bMulticlass\b/i, d: "Single-class map shrines granting 1 hero a 1-line passive and extra Class Keyword tag (max 1 per hero)." },
  { k: "curio", n: "Curio Merchant", re: /\bCurio Merchant\b/i, d: "Map node selling 3 Unique Class-Keyword items (5g) tailored to your party’s keywords." },
  { k: "tier", n: "Tier", re: /\b[Tt]ier\b/, d: "Upgrading raises HP (×1.45) and damage/healing (×1.3), unlocks Tier II Specializations, Tier III ASI (+2), and Tier IV Epic Boons." },
  { k: "action_surge", n: "Action Surge (Fighter)", re: /\bAction Surges?\b/, d: "Fighter Class Keyword. Fires an immediate burst of extra combat action when its trigger fires." },
  { k: "channel_divinity", n: "Channel Divinity (Cleric)", re: /\bChannel Divinity\b/, d: "Cleric Class Keyword. Once-per-fight divine miracle; can be reset by Nat 20s or Cleric items." },
  { k: "smite", n: "Smite (Paladin)", re: /\b(Divine |Verdant )?Smites?\b/, d: "Paladin Class Keyword. Empowers strikes with Radiant or Nature bursts." },
  { k: "aura", n: "Aura (Paladin)", re: /\bAuras?\b/, d: "Paladin Class Keyword. Persistent protective or healing zone radiating to nearby allies." },
  { k: "arcane_recovery", n: "Arcane Recovery (Wizard)", re: /\bArcane Recovery\b/, d: "Wizard Class Keyword. Recovers ability Charge whenever this Wizard’s signature condition occurs." },
  { k: "rage", n: "Rage (Barbarian)", re: /\b(Bear |Zealot )?Rage\b/, d: "Barbarian Class Keyword. Fierce combat state driving durability, speed, or immortality." },
  { k: "bardic_inspiration", n: "Bardic Inspiration (Bard)", re: /\b(Bardic )?Inspiration\b|\bInspired\b|\bMote of Potential\b/, d: "Bard Class Keyword. Grants an ally a bonus d20 Inspiration Die or bounty Mote of Potential." },
  { k: "wild_shape", n: "Wild Shape (Druid)", re: /\bWild Shape\b/, d: "Druid Class Keyword. Channels a primal beast form or living nature aspect." },
  { k: "hunters_mark", n: "Hunter’s Mark (Ranger)", re: /\bHunter’s Mark\b|\bMarked\b/, d: "Ranger Class Keyword. Marked foes take +1d4 bonus damage from every hit (stacks)." },
  { k: "sneak_attack", n: "Sneak Attack (Rogue)", re: /\bSneak Attacks?\b/, d: "Rogue Class Keyword. Bonus precision damage against flanked, poisoned, or ambushed foes (1/s)." },
  { k: "ki", n: "Ki (Monk)", re: /\bKi\b/, d: "Monk Class Keyword. 4-pip bar filled by attacking and taking hits; fires an Open Hand Strike when full." },
  { k: "metamagic", n: "Metamagic (Sorcerer)", re: /\bMetamagic\b|\bSorcery\b|\bTwinned\b/, d: "Sorcerer Class Keyword. 4-pip Sorcery bar filled by casts; fires a free Twinned Fireball when full." },
  { k: "hex", n: "Hex (Warlock)", re: /\b(Infernal |Radiant )?Hex(es|ed)?\b/, d: "Warlock Class Keyword. Patron curse amplifying hits, attack speed, or fiery Hellfire explosions on death." },
  { k: "trig-struck", n: "Struck", re: /\bStruck\b/, d: "Gains Charge when taking damage." },
  { k: "trig-striking", n: "Striking", re: /\bStriking\b/, d: "Gains Charge each time an attack lands." },
  { k: "trig-watchful", n: "Watchful", re: /\bWatchful\b/, d: "Gains Charge when allies in range take damage or are healed." },
  { k: "melee", n: "Melee and Ranged", re: /\b(Melee|Ranged)\b/, d: "Melee heroes close in to fight; ranged heroes hold distance." },
  { k: "speed", n: "Speed", re: /\b\d+ ft\b/, d: "Movement speed in feet." },
  { k: "regen", n: "Regeneration", re: /\bregenerat\w*\b/i, d: "Passive HP regained per second from CON and items." },
  { k: "physical", n: "Physical damage", re: /\bphysical\b|\b(slashing|piercing|bludgeoning)\b/, d: "Reduced by AC (and pierced by melee STR and Armor Pen)." },
  { k: "magic", n: "Magic damage", re: /\bmagic\b/, d: "Reduced by SR (and pierced by Spell Pen)." },
  { k: "square", n: "Square", re: /\bsquares?\b/, d: "One tile on the 10×10 battle grid." }
];
const GLOSS_BY = Object.fromEntries(GLOSS.map(g => [g.k, g]));
const _gEsc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[c]));
function kw(key, label) { const g = GLOSS_BY[key]; return g ? `<span class="kw" tabindex="0" role="button" data-kw="${key}">${_gEsc(label || g.n)}</span>` : _gEsc(label); }
function glossarize(text, seen) {
  let parts = [{ s: _gEsc(text) }];
  for (const g of GLOSS) {
    if (seen && seen.has(g.k)) continue;
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i]; if (p.h) continue;
      const m = g.re.exec(p.s); if (!m) continue;
      const w = p.s.slice(m.index, m.index + m[0].length);
      parts.splice(i, 1, { s: p.s.slice(0, m.index) }, { h: 1, s: `<span class="kw" tabindex="0" role="button" data-kw="${g.k}">${w}</span>` }, { s: p.s.slice(m.index + m[0].length) });
      if (seen) seen.add(g.k); break;
    }
  }
  return parts.map(p => p.s).join("");
}
const GLOSS_CSS = `.kw{text-decoration:underline dotted;text-underline-offset:2px;text-decoration-thickness:1.5px;cursor:help;border-radius:2px}
.kw:hover,.kw:focus{background:rgba(143,29,20,.12);outline:none}
#kwtip{position:fixed;z-index:1000;max-width:290px;background:#2a1c12;color:#f4ead0;font:14px/1.35 "EB Garamond",Georgia,serif;padding:8px 11px;border-radius:2px;box-shadow:0 6px 18px rgba(0,0,0,.3);pointer-events:none}
#kwtip b{display:block;font-family:"IM Fell English SC",Georgia,serif;font-weight:400;font-size:1.05rem;color:#f0c98a;margin-bottom:2px}
#kwtip[hidden]{display:none}`;
function glossaryInit() {
  if (document.getElementById("kwtip")) return;
  const st = document.createElement("style"); st.textContent = GLOSS_CSS; document.head.appendChild(st);
  const tip = document.createElement("div"); tip.id = "kwtip"; tip.hidden = true; tip.setAttribute("role", "tooltip"); document.body.appendChild(tip);
  let pinned = null;
  const show = el => {
    const g = el.dataset.tip ? { n: el.dataset.tn || "", d: el.dataset.tip } : GLOSS_BY[el.dataset.kw];
    if (!g) return;
    tip.innerHTML = `<b>${_gEsc(g.n)}</b>${_gEsc(g.d)}`; tip.hidden = false;
    const r = el.getBoundingClientRect(), tw = tip.offsetWidth, th = tip.offsetHeight;
    let x = Math.min(window.innerWidth - tw - 8, Math.max(8, r.left + r.width / 2 - tw / 2)), y = r.top - th - 8;
    if (y < 8) y = r.bottom + 8;
    tip.style.left = x + "px"; tip.style.top = y + "px";
  };
  const hide = () => { tip.hidden = true; pinned = null; };
  const TIP_SEL = ".kw,.ckwpill,.ckwtag,.tag18";
  document.addEventListener("mouseover", e => { const el = e.target.closest(TIP_SEL); if (el) show(el); });
  document.addEventListener("mouseout", e => { const el = e.target.closest(TIP_SEL); if (el && !pinned) tip.hidden = true; });
  document.addEventListener("focusin", e => { const el = e.target.closest(TIP_SEL); if (el) show(el); });
  document.addEventListener("focusout", e => { if (e.target.closest(TIP_SEL) && !pinned) tip.hidden = true; });
  document.addEventListener("click", e => { const el = e.target.closest(TIP_SEL); if (el && !el.closest('[data-a="buyHero"],[data-a="buyItem"]')) { e.preventDefault(); e.stopPropagation(); if (pinned === el) { hide(); return; } pinned = el; show(el); return; } if (pinned) hide(); }, true);
  document.addEventListener("keydown", e => { if (e.key === "Escape") hide(); if ((e.key === "Enter" || e.key === " ") && e.target.matches && e.target.matches(TIP_SEL)) { e.preventDefault(); pinned = e.target; show(e.target); } });
  window.addEventListener("scroll", () => { if (!tip.hidden && !pinned) tip.hidden = true; }, true);
}

/* ================= Basements and Basilisks: stat icons =================
   Game-wide. Simple ink line icons in the manuscript style, drawn with currentColor so they take the text colour.
   icon('hp') returns inline SVG. Each icon has a matching glossary key where one exists. */
const ICONS={
 hp:{n:'HP',kw:'HP',p:'<path d="M8 13.5S2.5 10 2.5 6.2A2.9 2.9 0 0 1 8 4.6a2.9 2.9 0 0 1 5.5 1.6C13.5 10 8 13.5 8 13.5z" fill="currentColor" fill-opacity=".18"/>'},
 ac:{n:'AC',kw:'AC',p:'<path d="M8 1.8l5 1.8v4.2c0 3.1-2.2 5.3-5 6.4-2.8-1.1-5-3.3-5-6.4V3.6z" fill="currentColor" fill-opacity=".18"/><path d="M8 3.6v9"/>'},
 sr:{n:'SR',kw:'SR',p:'<circle cx="8" cy="8" r="5.6" fill="currentColor" fill-opacity=".14"/><path d="M8 3.8l1.2 2.9 3 .3-2.3 2 .7 3L8 10.4 5.4 12l.7-3-2.3-2 3-.3z"/>'},
 dmg:{n:'Damage per attack',kw:'physical',p:'<path d="M12.8 2.2l1 1-7.6 7.6-1.9-.1-.1-1.9z" fill="currentColor" fill-opacity=".18"/><path d="M3.3 9.8l2.9 2.9M2.4 13.6l2.2-2.2"/>'},
 heal:{n:'Healing per attack',kw:'',p:'<path d="M6.3 2.5h3.4v3.8h3.8v3.4H9.7v3.8H6.3V9.7H2.5V6.3h3.8z" fill="currentColor" fill-opacity=".18"/>'},
 rate:{n:'Attack interval',kw:'',p:'<path d="M4 2h8M4 14h8M5 2c0 3.5 6 4.5 6 6s-6 2.5-6 6M11 2c0 3.5-6 4.5-6 6s6 2.5 6 6"/><path d="M6.5 12.6h3L8 11z" fill="currentColor"/>'},
 abil:{n:'Ability, about every',kw:'ability',p:'<path d="M8 1.6l5.6 3.2v6.4L8 14.4l-5.6-3.2V4.8z" fill="currentColor" fill-opacity=".14"/><path d="M8 4.4l3 5.2H5z"/>'},
 range:{n:'Range',kw:'square',p:'<circle cx="8" cy="8" r="5.6"/><circle cx="8" cy="8" r="2.6"/><circle cx="8" cy="8" r=".6" fill="currentColor"/>'},
 speed:{n:'Speed',kw:'speed',p:'<path d="M5 2.5h3v6l4 2v2.8H3.2V10z" fill="currentColor" fill-opacity=".18"/><path d="M1.5 6h2M1 8.5h2"/>'},
 regen:{n:'Regeneration',kw:'regen',p:'<path d="M8 2.2S4 7 4 9.6a4 4 0 0 0 8 0C12 7 8 2.2 8 2.2z" fill="currentColor" fill-opacity=".16"/><path d="M8 7.6v4M6 9.6h4"/>'},
 evasion:{n:'Evasion',kw:'evasion',p:'<path d="M2.2 8.2c2.4-3.4 8-3.4 11.4 0-3.4 3.4-9 3.4-11.4 0z" fill="currentColor" fill-opacity=".14"/><path d="M5 5.4l6 5.4M11 5.4l-6 5.4"/>'},
};
function icon(k,size=16){const I=ICONS[k];if(!I)return'';return`<svg class="ico" width="${size}" height="${size}" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">${I.p}</svg>`}


/* ================= Basements and Basilisks: item icons =================
   Same ink-line style as icons.js (16-unit grid, round strokes, light fill), one glyph per kind of item.
   itemIcon(key,size) draws the glyph in the item's rarity ink inside a vellum tile with a rarity border, and adds a
   small corner badge: the item's element (by colour) or the attribute it raises most (by letter). */
const ITEM_GLYPHS={
 sword_flame:'<path d="M12.6 2.2l1.2 1.2-7.4 7.4-1.8.1.1-1.8z" class="f"/><path d="M3.4 8.6l4 4M4.2 11.8l-1.9 1.9"/><path d="M12.6 6.6c1.3 1 1.5 2.5.5 3.5.1-1-.4-1.6-1-1.8.2.8-.2 1.4-.9 1.6-.8-1-.2-2.5 1.4-3.3z" class="f"/>',
 sword_frost:'<path d="M12.6 2.2l1.2 1.2-7.4 7.4-1.8.1.1-1.8z" class="f"/><path d="M3.4 8.6l4 4M4.2 11.8l-1.9 1.9"/><path d="M12.6 8.4v4M10.6 10.4h4M11.2 9l2.8 2.8M14 9l-2.8 2.8"/>',
 sword_twin:'<path d="M12.6 2.2l1.2 1.2-7.4 7.4-1.8.1.1-1.8z" class="f"/><path d="M3.4 8.6l4 4M4.2 11.8l-1.9 1.9"/><path d="M3.4 2.2L2.2 3.4l7.4 7.4 1.8.1-.1-1.8z" class="f"/><path d="M12.6 8.6l-4 4M11.8 11.8l1.9 1.9"/>',
 sword_drop:'<path d="M12.6 2.2l1.2 1.2-7.4 7.4-1.8.1.1-1.8z" class="f"/><path d="M3.4 8.6l4 4M4.2 11.8l-1.9 1.9"/><path d="M12.6 8.4c-1 1.4-1.6 2.2-1.6 3a1.6 1.6 0 0 0 3.2 0c0-.8-.6-1.6-1.6-3z" class="f"/>',
 greatsword:'<path d="M7 1.4h2l.5 8.6H6.5z" class="f"/><path d="M3.4 10h9.2M3.4 10c-.8-1-.5-2 .5-2.4M12.6 10c.8-1 .5-2-.5-2.4M8 10v3"/><circle cx="8" cy="14" r=".9"/>',
 defender:'<path d="M12.6 2.2l1.2 1.2-7.4 7.4-1.8.1.1-1.8z" class="f"/><path d="M3.4 8.6l4 4M4.2 11.8l-1.9 1.9"/><path d="M11.6 8.4l2.6 1v2c0 1.5-1.1 2.6-2.6 3.2-1.5-.6-2.6-1.7-2.6-3.2v-2z" class="f"/>',
 kris:'<path d="M12.8 2.2C12 3.6 13.4 4.2 11.8 5.4 10.2 6.6 11.2 7.4 9.6 8.4 8.4 9.2 7.8 9 7 9.8"/><path d="M4.9 8.2l2.9 2.9M5.6 10.4L3.4 12.6"/><path d="M12.6 10.2c1.4 0 2 1.6.8 2.4l-.8.6-.8-.6c-1.2-.8-.6-2.4.8-2.4z" class="f"/>',
 dagger_serrated:'<path d="M11.6 3.2l1.2 1.2-5.2 5.2-1.6.2.2-1.6z" class="f"/><path d="M4.9 8.2l2.9 2.9M5.6 10.4L3.4 12.6"/><path d="M8.4 4.9l.9.9M9.6 3.8l.9.9M7.2 6.1l.9.9"/>',
 dagger_fork:'<path d="M10.4 4.4l1.2 1.2-4 4-1.6.2.2-1.6z" class="f"/><path d="M10.4 4.4l1-3 .6 2.4 2.4.6-3 1"/><path d="M4.9 8.2l2.9 2.9M5.6 10.4L3.4 12.6"/>',
 dagger_drip:'<path d="M11.6 3.2l1.2 1.2-5.2 5.2-1.6.2.2-1.6z" class="f"/><path d="M4.9 8.2l2.9 2.9M5.6 10.4L3.4 12.6"/><path d="M12.4 8.6c-.9 1.3-1.4 2-1.4 2.7a1.4 1.4 0 0 0 2.8 0c0-.7-.5-1.4-1.4-2.7z" class="f"/>',
 shield_eye:'<path d="M8 1.8l5 1.8v4.2c0 3.1-2.2 5.3-5 6.4-2.8-1.1-5-3.3-5-6.4V3.6z" class="f"/><path d="M5.2 7.6c1.5-1.9 4.1-1.9 5.6 0-1.5 1.9-4.1 1.9-5.6 0z"/><circle cx="8" cy="7.6" r=".9"/>',
 shield_cross:'<path d="M8 1.8l5 1.8v4.2c0 3.1-2.2 5.3-5 6.4-2.8-1.1-5-3.3-5-6.4V3.6z" class="f"/><path d="M8 4.2v7.4M5.4 7.2h5.2"/>',
 shield_star:'<path d="M8 1.8l5 1.8v4.2c0 3.1-2.2 5.3-5 6.4-2.8-1.1-5-3.3-5-6.4V3.6z" class="f"/><path d="M8 4.6l.9 1.9 2.1.2-1.6 1.4.5 2.1L8 9.1l-1.9 1.1.5-2.1L5 6.7l2.1-.2z"/>',
 ring_leaf:'<circle cx="8" cy="9.8" r="3.8" class="f"/><circle cx="8" cy="9.8" r="2.2"/><path d="M8 6C6.2 5.4 5.8 3.6 6.6 2.4c1.6.2 2.4 1.6 1.4 3.6z" class="f"/><path d="M8 6c.6-1.4 1.6-2.4 3-2.8"/>',
 ring_flame:'<circle cx="8" cy="9.8" r="3.8" class="f"/><circle cx="8" cy="9.8" r="2.2"/><path d="M8 6.1c-1.7-.6-1.9-2.3-.9-3.5 0 .8.6 1.2 1 1 0-.8.4-1.6 1.2-2 .4 1.4 1.1 2.9-1.3 4.5z" class="f"/>',
 ring_horns:'<circle cx="8" cy="9.8" r="3.8" class="f"/><circle cx="8" cy="9.8" r="2.2"/><path d="M5.6 6.4C3.6 6 3 3.6 4.8 2.8c1.4-.6 2.6.6 2 1.8M10.4 6.4c2-.4 2.6-2.8.8-3.6-1.4-.6-2.6.6-2 1.8"/>',
 ring_wing:'<circle cx="8" cy="9.8" r="3.8" class="f"/><circle cx="8" cy="9.8" r="2.2"/><path d="M8.8 6c1.6-2.6 3.6-3.4 5-3.4-.4 2-1.8 3.6-5 3.4z" class="f"/><path d="M8.8 6c.8-.4 1.8-.6 3-.6"/>',
 cloak_star:'<path d="M5 2.6h6l2.6 11H2.4z" class="f"/><circle cx="8" cy="3.6" r=".9"/><path d="M8 6.6l.8 1.7 1.9.2-1.4 1.3.4 1.9L8 10.8l-1.7.9.4-1.9-1.4-1.3 1.9-.2z"/>',
 cloak_double:'<path d="M5 2.6h6l2.6 11H2.4z" class="f"/><circle cx="8" cy="3.6" r=".9"/><path d="M6.6 6l-1 7.6"/><path d="M7.4 1.4h5.4l2.6 10.4" stroke-dasharray="1.2 1"/>',
 armor_studs:'<path d="M4 3l2-1c1 1.6 3 1.6 4 0l2 1 1 3-1.6 1.2v6.4H4.6V7.2L3 6z" class="f"/><path d="M8 4.4v8.8"/><circle cx="6" cy="6.6" r=".5"/><circle cx="10" cy="6.6" r=".5"/><circle cx="6" cy="10.8" r=".5"/><circle cx="10" cy="10.8" r=".5"/>',
 armor_spikes:'<path d="M4 3l2-1c1 1.6 3 1.6 4 0l2 1 1 3-1.6 1.2v6.4H4.6V7.2L3 6z" class="f"/><path d="M8 4.4v8.8"/><path d="M4 3L2.4 1.4M12 3l1.6-1.6M3 6L1.2 6.4M13 6l1.8.4M5.6 9.6h4.8"/>',
 armor_shine:'<path d="M4 3l2-1c1 1.6 3 1.6 4 0l2 1 1 3-1.6 1.2v6.4H4.6V7.2L3 6z" class="f"/><path d="M8 4.4v8.8"/><path d="M5.4 6.2l1.6 1.6M9 9.6l1.6 1.6M9.6 5.4l.6.6"/>',
 armor_plate:'<path d="M4 3l2-1c1 1.6 3 1.6 4 0l2 1 1 3-1.6 1.2v6.4H4.6V7.2L3 6z" class="f"/><path d="M8 4.4v8.8"/><path d="M2.2 3.2h3.4v2.8H2.2zM10.4 3.2h3.4v2.8h-3.4z" class="f"/><path d="M5.2 9.6h5.6M5.2 11.6h5.6"/>',
 boots_wing:'<path d="M4 2.4h4.2v7l4.4 1.6v2.8H4z" class="f"/><path d="M4 11.6h8.6"/><path d="M8.6 4.8c2-1.6 4-1.8 5.2-1.4-1 1.2-2.8 2-5.2 1.4zM8.6 6.8c1.6-.8 3.2-.8 4.4-.4"/>',
 amulet_heart:'<path d="M3.4 2.4c0 4.4 9.2 4.4 9.2 0"/><path d="M8 13.8S5 11.8 5 9.8a1.6 1.6 0 0 1 3-.8 1.6 1.6 0 0 1 3 .8c0 2-3 4-3 4z" class="f"/>',
 wand_web:'<path d="M3 13l7.4-7.4"/><circle cx="12" cy="4" r="2.4" class="f"/><path d="M12 1.2v5.6M9.2 4h5.6M10 2l4 4M14 2l-4 4"/>',
 staff_skull:'<path d="M3.8 14.2l7-9.4"/><path d="M10.2 3.6a2 2 0 1 1 3.6 1.2v1h-2.4v-1a2 2 0 0 1-1.2-1.2z" class="f"/><path d="M11.4 3.4h.1M12.8 3.4h.1"/>',
 sword:'<path d="M12.6 2.2l1.2 1.2-7.4 7.4-1.8.1.1-1.8z" class="f"/><path d="M3.4 8.6l4 4M4.2 11.8l-1.9 1.9"/>',
 dagger:'<path d="M11.6 3.2l1.2 1.2-5.2 5.2-1.6.2.2-1.6z" class="f"/><path d="M4.9 8.2l2.9 2.9M5.6 10.4L3.4 12.6"/>',
 scimitar:'<path d="M5.2 10.8C9 9.8 12.6 6.5 13.6 2.4c-3 2.6-6.2 4.2-9.6 6.6z" class="f"/><path d="M3 8.2l3 3M4.2 10.9l-1.8 1.8"/>',
 axe:'<path d="M3.2 13.8l8.4-8.4"/><path d="M9.2 2.6c2.9-.4 4.6 1.3 4.2 4.2L11.6 5.8 10.2 4.4z" class="f"/>',
 mace:'<path d="M3 13.4l5.6-5.6"/><circle cx="10.6" cy="5.8" r="2.8" class="f"/><path d="M10.6 1.6v1.4M14.8 5.8h-1.4M13.6 2.8l-1 1M13.6 8.8l-1-1"/>',
 hammer:'<path d="M3 13.6l6.2-6.2"/><path d="M7 5.2l3.2-3.2 3.8 3.8-3.2 3.2z" class="f"/>',
 spear:'<path d="M2.6 13.4l8.8-8.8"/><path d="M10.2 3.6l3.6-1.4-1.4 3.6-1.6.4z" class="f"/><path d="M4.4 10.2l1.4 1.4"/>',
 scythe:'<path d="M4 14L10 2"/><path d="M10 2c3 0 4.6 2 4 4.6C12.6 5 11 4.6 9.2 5z" class="f"/>',
 sickle:'<path d="M4 13.6l2.4-2.8"/><path d="M6.4 10.8C9.8 11.4 13 8.8 12.6 5.2 12.2 2.6 9.8 1.8 7 2.4c2.4.8 3.6 2.6 3.2 4.8-.3 1.8-1.8 3-3.8 3.6z" class="f"/>',
 bow:'<path d="M4.4 2.4c5.4 1.6 5.4 9.6 0 11.2"/><path d="M4.4 2.4v11.2M2.2 8h11"/><path d="M11.4 6.4L13.6 8l-2.2 1.6" class="f"/>',
 staff:'<path d="M3.8 14.2l7-9.4"/><circle cx="12" cy="3.6" r="2" class="f"/><path d="M9.6 2.2l-.8-.8M14.6 5.8l.8.6"/>',
 staff2:'<path d="M4 14.2l7-9.4"/><path d="M10.4 2.2h3v2.4h-3z" class="f"/><path d="M11.9 1v4.8M9.6 3.4h4.6"/>',
 wand:'<path d="M3 13l7.2-7.2"/><path d="M12 1.8v4.4M9.8 4h4.4M10.5 2.5l3 3M13.5 2.5l-3 3"/>',
 rod:'<path d="M3.4 13.4l6.4-6.4"/><path d="M9.4 4.6l2-2.4 2.4 2.4-2.4 2z" class="f"/>',
 ring:'<circle cx="8" cy="9.8" r="3.8" class="f"/><circle cx="8" cy="9.8" r="2.2"/><path d="M6.5 5.6L8 3.6l1.5 2z" class="f"/>',
 amulet:'<path d="M3.4 2.4c0 4.4 9.2 4.4 9.2 0"/><path d="M8 7.6l2.6 3-2.6 3.2-2.6-3.2z" class="f"/>',
 gem:'<path d="M3.6 6l2.2-3h4.4l2.2 3L8 13.6z" class="f"/><path d="M3.6 6h8.8M5.8 3L8 6l2.2-3M8 6v7.6"/>',
 brooch:'<circle cx="8" cy="8" r="5" class="f"/><path d="M8 4.8l1 2.2 2.2.2-1.7 1.5.5 2.3L8 9.8 6 11l.5-2.3L4.8 7.2 7 7z"/>',
 stone:'<path d="M3.8 9C3.8 5.4 6.6 3.6 9.4 4c3 .5 3.6 4 2.6 6.6-1 2.6-6 3-7.2 1.2-.6-.8-1-1.8-1-2.8z" class="f"/><path d="M7.4 6.8l1.2 1.2 1.6-1.6M8.6 8v2"/>',
 orb:'<circle cx="8" cy="8" r="4.2" class="f"/><path d="M1.8 9.6c0-1.8 12.4-4.6 12.4-3.2s-12.4 4.6-12.4 3.2"/>',
 orb2:'<circle cx="8" cy="7.4" r="4.4" class="f"/><path d="M6 13.8h4M8 11.8v2M6.2 6a2 2 0 0 1 2-1.6"/>',
 cloak:'<path d="M5 2.6h6l2.6 11H2.4z" class="f"/><circle cx="8" cy="3.6" r=".9"/><path d="M6.6 6l-1 7.6M9.4 6l1 7.6"/>',
 boots:'<path d="M4.6 2.4h4.2v7l4.4 1.6v2.8H4.6z" class="f"/><path d="M4.6 4.6h4.2M4.6 11.6h8.6"/>',
 gloves:'<path d="M4.6 13.6V8.4C4.6 5 5.4 2.8 7.4 2.8h2.4c1.6 0 1.8 1.8 1.8 3.6l1.6 1.8c.6.8-.2 1.8-1.2 1.4l-.4-.2v4.2z" class="f"/><path d="M4.6 11.4h7M7.4 2.8v3.4M9.6 2.8v3.2"/>',
 belt:'<path d="M1.8 6.4h12.4v3.2H1.8z" class="f"/><path d="M6.4 5.2h3.2v5.6H6.4z"/><path d="M8 6.4v3.2"/>',
 circlet:'<path d="M2.4 9.2c0-3.2 11.2-3.2 11.2 0 0 2-11.2 2-11.2 0z"/><path d="M8 4.6l1.3 1.7L8 8 6.7 6.3z" class="f"/>',
 crown:'<path d="M2.4 12.4V5l3 3L8 3.4 10.6 8l3-3v7.4z" class="f"/><path d="M2.4 10.4h11.2"/>',
 helm:'<path d="M3.4 13V8.2C3.4 4.6 5.4 2.4 8 2.4s4.6 2.2 4.6 5.8V13z" class="f"/><path d="M5.2 8h5.6M8 8v4.4"/>',
 shield:'<path d="M8 1.8l5 1.8v4.2c0 3.1-2.2 5.3-5 6.4-2.8-1.1-5-3.3-5-6.4V3.6z" class="f"/><circle cx="8" cy="7.6" r="1.6"/>',
 armor:'<path d="M4 3l2-1c1 1.6 3 1.6 4 0l2 1 1 3-1.6 1.2v6.4H4.6V7.2L3 6z" class="f"/><path d="M8 4.4v8.8"/><path d="M5.2 9.6h5.6"/>',
 vial:'<path d="M6.4 2.2h3.2M7 2.2v3.6L4 11.4c-.7 1.4.3 2.4 1.8 2.4h4.4c1.5 0 2.5-1 1.8-2.4L9 5.8V2.2"/><path d="M4.8 10h6.4l.8 1.4c.7 1.4-.3 2.4-1.8 2.4H5.8c-1.5 0-2.5-1-1.8-2.4z" class="f"/>',
 holy:'<circle cx="8" cy="8" r="2.6" class="f"/><path d="M8 1.6v2.2M8 12.2v2.2M1.6 8h2.2M12.2 8h2.2M3.5 3.5l1.5 1.5M11 11l1.5 1.5M12.5 3.5L11 5M5 11l-1.5 1.5"/>',
 lute:'<circle cx="6.4" cy="10" r="3.6" class="f"/><circle cx="6.4" cy="10" r="1"/><path d="M8.9 7.5l4.4-4.4M12.2 2l2 2"/>',
 horn:'<path d="M3 12.4C6 12 9.8 9.2 12.8 3.2c1 1.8.8 4.2-.6 6.2-1.8 2.6-5.2 4-9.2 3z" class="f"/><path d="M11 5.2l2.4 1.6"/>',
 book:'<path d="M3.2 2.6h8.2c1 0 1.6.6 1.6 1.6v9.2H4.8c-1 0-1.6-.6-1.6-1.6z" class="f"/><path d="M4.8 2.6v10.8M6.6 5.6h4.2M6.6 8h4.2"/>',
 goggles:'<circle cx="5.2" cy="8.4" r="2.6" class="f"/><circle cx="10.8" cy="8.4" r="2.6" class="f"/><path d="M7.8 8.4h.4M2.6 8.4H1.4M13.4 8.4h1.2"/>',
 bag:'<path d="M5.6 4.4h4.8l2.6 7.4c.4 1.2-.5 2-1.8 2H4.8c-1.3 0-2.2-.8-1.8-2z" class="f"/><path d="M5.6 4.4L4.4 2.4h7.2l-1.2 2M5.6 6.4h4.8"/>',
 quiver:'<path d="M5 5.4l4.6 8.8 2.4-1.2-4.6-8.8z" class="f"/><path d="M6 5L4 1.6M7.2 4.4l-.6-3.2M8.4 3.8L9.2.8"/>',
 bracers:'<path d="M3.6 5.2l7.4-1.6 1.6 7.6-7.4 1.6z" class="f"/><path d="M5.4 7.2l6-1.3M6 10l6-1.3"/>',
 scarab:'<ellipse cx="8" cy="9.2" rx="3.6" ry="4.4" class="f"/><circle cx="8" cy="3.8" r="1.5"/><path d="M8 5.2v8.4M4.4 7.6l-2-1M11.6 7.6l2-1M4.4 10.8l-2 1M11.6 10.8l2 1"/>',
 bands:'<circle cx="6" cy="8" r="3.6" class="f"/><circle cx="10" cy="8" r="3.6"/>',
};
const EL_COL={fire:'#c4501b',cold:'#2f86b4',lightning:'#6a4fc4',thunder:'#4b3a8a',acid:'#6f9a1f',poison:'#2f7d3a',nec:'#24321c',holy:'#b8923a',radiant:'#b8923a',force:'#5a6a86'};
const ATTR_COL={str:'#8f1d14',dex:'#2d6a3a',con:'#a85a14',int:'#2f5a8f',wis:'#7a6a1a',cha:'#a83a6a'};
const ATTR_L={str:'S',dex:'D',con:'C',int:'I',wis:'W',cha:'Ch'};
/* the badge: an element if the item carries one, otherwise its largest attribute */
function itemBadge(k){const it=ITEMS[k];const s=it.s||{};
  const e=(s.onHit||[]).map(x=>(x.kind==='holy'||x.kind==='radiant')?'radiant':x.el||(x.ty==='force'?'force':null)).find(Boolean);
  if(e)return {col:EL_COL[e],t:''};if(s.abilNec)return {col:EL_COL.nec,t:''};
  const a=Object.entries(it.a||{}).sort((x,y)=>y[1]-x[1])[0];if(a)return {col:ATTR_COL[a[0]],t:ATTR_L[a[0]]};return null}
function itemIcon(k,size=40){const it=ITEMS[k];if(!it)return'';const R=RARITY[it.r];const u=(typeof assetURL==='function')?assetURL('items',k):'';
  if(u){return `<span class="iico" style="width:${size}px;height:${size}px;display:inline-grid;place-items:center;border-radius:4px;border:2px solid ${R.col};background:#f3e8cc;overflow:hidden;flex:none" aria-label="${it.n}" role="img"><img src="${u}" alt="${it.n}" style="width:100%;height:100%;object-fit:cover;display:block"></span>`}
  const g=ITEM_GLYPHS[it.ic]||ITEM_GLYPHS.gem;const bd=itemBadge(k);
  const badge=bd?`<circle cx="19.6" cy="4.4" r="3.6" fill="${bd.col}" stroke="#f3e8cc" stroke-width=".9"/>${bd.t?`<text x="19.6" y="5.85" text-anchor="middle" font-size="${bd.t.length>1?3.4:4.4}" font-weight="800" fill="#f8efd8" font-family="Alegreya Sans,sans-serif">${bd.t}</text>`:''}`:'';
  return `<svg class="iico" width="${size}" height="${size}" viewBox="0 0 24 24" aria-label="${it.n}" role="img"><rect x=".8" y=".8" width="22.4" height="22.4" rx="3.2" fill="#f3e8cc" stroke="${R.col}" stroke-width="1.6"/>`+
    `<rect x="2.2" y="2.2" width="19.6" height="19.6" rx="2.2" fill="none" stroke="${R.col}" stroke-opacity=".28" stroke-width=".6"/>`+
    `<g transform="translate(4 4)" fill="none" stroke="${R.col}" stroke-width="1.25" stroke-linejoin="round" stroke-linecap="round">${g.replace(/class="f"/g,`fill="${R.col}" fill-opacity=".2"`)}</g>${badge}</svg>`}

