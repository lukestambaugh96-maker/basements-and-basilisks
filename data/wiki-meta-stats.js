/* Auto-generated live meta telemetry & changelog for tools/wiki.html */
window.WIKI_META = {
  "version": "0.22 Live Balance",
  "generatedAt": "2026-11-21",
  "heroes": {
    "zoe": {
      "key": "zoe",
      "name": "Zoe",
      "cls": "Fighter",
      "role": "Support",
      "reach": "Melee",
      "pack": 5,
      "packKey": "market",
      "nMid": 48,
      "nLate": 44,
      "midWR": 58.3,
      "lateWR": 40.9,
      "avgWR": 49.6,
      "midScore": 54.9,
      "lateScore": 48.6,
      "avgScore": 51.8,
      "avgTime": 23.6,
      "avgDmg": 271,
      "avgHeal": 362,
      "avgWard": 387,
      "avgTaken": 711,
      "avgGold": 0.49,
      "survPct": 37,
      "liveRank": 1,
      "baseRank": 1,
      "rankDelta": 0,
      "baseScore": 93.7,
      "baseWR": 94.4,
      "scoreDelta": -41.9,
      "wrDelta": -44.8,
      "changeStatus": "nerf",
      "archetype": "Action Surge Accelerator & Item-Scaling Force Multiplier",
      "useCase": "Still the #1 individual hero in the live build—but now earned through offensive tempo instead of infinite sustain. Zoe turns your most-equipped ally into a hyper-carry via Action Surge, capped Runic Upgrades (+8% ×2), Haste, and Nat 20 item refreshes. Draft her with Sir Dane, Gilthrax, or Arthur and stack Charge speed (Staff of Power, Ring of Spell Storing, Headband of Intellect).",
      "changes": [
        {
          "type": "fix",
          "text": "Fixed double-scaled `u.dm²` heal bug on Rummage (added `{ raw: 1 }`)."
        },
        {
          "type": "nerf",
          "text": "Rummage heal cut `[18, 28, 32, 36]+3×INT → [8, 12, 16, 20]+2×INT`, Ward cut `25+4×INT → 16+2×INT` (cap 50% → 35%), Charge 15 → 12, Nat 20 Gold 2g → 1g."
        },
        {
          "type": "nerf",
          "text": "Runic Upgrade capped at max 2 stacks of +8% damage (was uncapped +12% per High roll)."
        },
        {
          "type": "nerf",
          "text": "Just the Thing Path Action Surge Ward reduced (`16+2×INT → 10+INT`, cap 35%, Charge 12 → 10) with a 1.0s cooldown."
        }
      ],
      "paths": {
        "key": "zoe",
        "name": "Zoe",
        "p0": {
          "k": "rune_carver",
          "n": "Rune Carver",
          "wr": 90,
          "score": 79.8
        },
        "p1": {
          "k": "just_the_thing",
          "n": "Just the Thing",
          "wr": 90,
          "score": 85.6
        },
        "diff": -5.8,
        "winner": "Just the Thing"
      },
      "bestPartners": [
        {
          "partner": "dane",
          "name": "Sir Dane",
          "role": "Tank",
          "cls": "Paladin",
          "winRate": 100,
          "score": 91.2,
          "sharedKw": [],
          "lift": 33.9,
          "why": "Sir Dane’s Aura keeps Zoe alive while Zoe’s Action Surge & Runic Upgrade accelerate Dane’s Smites and Quest."
        },
        {
          "partner": "gilthrax",
          "name": "Gilthrax",
          "role": "Tank",
          "cls": "Fighter",
          "winRate": 100,
          "score": 90.6,
          "sharedKw": [
            "action_surge"
          ],
          "lift": 33.3,
          "why": "Shared Action Surge loop: Gilthrax’s item-loaded Ward triggers Action Surge counters & Zoe’s Runic Upgrades."
        },
        {
          "partner": "arthur",
          "name": "Arthur",
          "role": "Damage",
          "cls": "Fighter",
          "winRate": 100,
          "score": 86.5,
          "sharedKw": [
            "action_surge"
          ],
          "lift": 29.2,
          "why": "Shared Action Surge loop: Zoe turbocharges Arthur’s multi-arrow Volleys with Haste, Charge, and free attacks."
        },
        {
          "partner": "faelan",
          "name": "Faelan",
          "role": "Support",
          "cls": "Wizard",
          "winRate": 100,
          "score": 78,
          "sharedKw": [],
          "lift": 20.7,
          "why": "Zoe’s Haste/Charge speeds up Faelan’s Wards while Spell Battery loops Zoe’s Rummage & Action Surges."
        }
      ],
      "bestItems": [
        {
          "item": "staff_power",
          "name": "Staff of Power",
          "rarity": 3,
          "cost": 7,
          "kwMatch": false,
          "winRate": 50,
          "score": 62,
          "lift": 32.8,
          "valPerGold": 4.69
        },
        {
          "item": "ring_spell_storing",
          "name": "Ring of Spell Storing",
          "rarity": 2,
          "cost": 5,
          "kwMatch": false,
          "winRate": 50,
          "score": 60.8,
          "lift": 31.6,
          "valPerGold": 6.32
        },
        {
          "item": "headband",
          "name": "Headband of Intellect",
          "rarity": 2,
          "cost": 5,
          "kwMatch": false,
          "winRate": 50,
          "score": 57.9,
          "lift": 28.7,
          "valPerGold": 5.74
        },
        {
          "item": "weapon_warning",
          "name": "Weapon of Warning",
          "rarity": 1,
          "cost": 3,
          "kwMatch": true,
          "winRate": 50,
          "score": 51.8,
          "lift": 22.6,
          "valPerGold": 7.53
        }
      ],
      "bestValueItems": [
        {
          "item": "weapon_warning",
          "name": "Weapon of Warning",
          "rarity": 1,
          "cost": 3,
          "kwMatch": true,
          "winRate": 50,
          "score": 51.8,
          "lift": 22.6,
          "valPerGold": 7.53
        },
        {
          "item": "ring_spell_storing",
          "name": "Ring of Spell Storing",
          "rarity": 2,
          "cost": 5,
          "kwMatch": false,
          "winRate": 50,
          "score": 60.8,
          "lift": 31.6,
          "valPerGold": 6.32
        },
        {
          "item": "headband",
          "name": "Headband of Intellect",
          "rarity": 2,
          "cost": 5,
          "kwMatch": false,
          "winRate": 50,
          "score": 57.9,
          "lift": 28.7,
          "valPerGold": 5.74
        }
      ]
    },
    "velith": {
      "key": "velith",
      "name": "Velith",
      "cls": "Rogue",
      "role": "Damage",
      "reach": "Melee",
      "pack": 6,
      "packKey": "surprise",
      "nMid": 50,
      "nLate": 44,
      "midWR": 56,
      "lateWR": 31.8,
      "avgWR": 43.9,
      "midScore": 54.1,
      "lateScore": 40.9,
      "avgScore": 47.5,
      "avgTime": 22.4,
      "avgDmg": 541,
      "avgHeal": 2,
      "avgWard": 0,
      "avgTaken": 190,
      "avgGold": 0,
      "survPct": 37.2,
      "liveRank": 2,
      "baseRank": 6,
      "rankDelta": 4,
      "baseScore": 72.9,
      "baseWR": 78.3,
      "scoreDelta": -25.4,
      "wrDelta": -34.4,
      "changeStatus": "buff",
      "archetype": "Premier Melee Assassin & Poison/Exposed Finisher",
      "useCase": "The #1 Damage hero in the live meta (#2 overall at 47.5, 541 avg dmg!). Velith combines stealth ambush openings, buffed passive Sneak Attack (+1d6), and Nightshade Poison scaling to erase high-priority targets before enemy waves overwhelm you. Pair her with Corvin, Kaska, or Sir Dane, and equip Dagger of Venom or Dwarven Plate to turn her into an unstoppable carry.",
      "changes": [
        {
          "type": "buff",
          "text": "Global Damage Role Buff (+12% `u.dm`)."
        },
        {
          "type": "buff",
          "text": "Passive Sneak Attack trigger upgraded by +1 bonus d6 piercing damage."
        }
      ],
      "paths": {
        "key": "velith",
        "name": "Velith",
        "p0": {
          "k": "deaths_ledger",
          "n": "Death’s Ledger",
          "wr": 70,
          "score": 56.7
        },
        "p1": {
          "k": "nightshade",
          "n": "Nightshade Vials",
          "wr": 80,
          "score": 59.7
        },
        "diff": -3,
        "winner": "Nightshade Vials"
      },
      "bestPartners": [
        {
          "partner": "corvin",
          "name": "Corvin",
          "role": "Damage",
          "cls": "Ranger",
          "winRate": 75,
          "score": 59.5,
          "sharedKw": [],
          "lift": 12.6,
          "why": "Corvin marks and Exposes frontline/midline targets for Velith’s Poison & Sneak Attack executes."
        },
        {
          "partner": "dane",
          "name": "Sir Dane",
          "role": "Tank",
          "cls": "Paladin",
          "winRate": 50,
          "score": 56.4,
          "sharedKw": [],
          "lift": 9.5,
          "why": "Strong Damage/Tank role synergy balancing frontline survivability with live burst tempo."
        },
        {
          "partner": "zoe",
          "name": "Zoe",
          "role": "Support",
          "cls": "Fighter",
          "winRate": 25,
          "score": 53.3,
          "sharedKw": [],
          "lift": 6.4,
          "why": "Strong Damage/Support role synergy balancing frontline survivability with live burst tempo."
        },
        {
          "partner": "lorcan",
          "name": "Lorcan",
          "role": "Damage",
          "cls": "Ranger",
          "winRate": 75,
          "score": 52.7,
          "sharedKw": [],
          "lift": 5.8,
          "why": "High-tempo Damage duo whose kits cover each other’s scaling curves through Act 3."
        }
      ],
      "bestItems": [
        {
          "item": "dwarven_plate",
          "name": "Dwarven Plate",
          "rarity": 3,
          "cost": 7,
          "kwMatch": false,
          "winRate": 100,
          "score": 79,
          "lift": 10.1,
          "valPerGold": 1.44
        },
        {
          "item": "dagger_venom",
          "name": "Dagger of Venom",
          "rarity": 2,
          "cost": 5,
          "kwMatch": true,
          "winRate": 100,
          "score": 78.2,
          "lift": 9.3,
          "valPerGold": 1.86
        },
        {
          "item": "flametongue",
          "name": "Flame Tongue",
          "rarity": 2,
          "cost": 5,
          "kwMatch": false,
          "winRate": 100,
          "score": 76.3,
          "lift": 7.4,
          "valPerGold": 1.48
        },
        {
          "item": "frost_brand",
          "name": "Frost Brand",
          "rarity": 3,
          "cost": 7,
          "kwMatch": false,
          "winRate": 75,
          "score": 74.8,
          "lift": 5.9,
          "valPerGold": 0.84
        }
      ],
      "bestValueItems": [
        {
          "item": "dagger_venom",
          "name": "Dagger of Venom",
          "rarity": 2,
          "cost": 5,
          "kwMatch": true,
          "winRate": 100,
          "score": 78.2,
          "lift": 9.3,
          "valPerGold": 1.86
        },
        {
          "item": "flametongue",
          "name": "Flame Tongue",
          "rarity": 2,
          "cost": 5,
          "kwMatch": false,
          "winRate": 100,
          "score": 76.3,
          "lift": 7.4,
          "valPerGold": 1.48
        },
        {
          "item": "dwarven_plate",
          "name": "Dwarven Plate",
          "rarity": 3,
          "cost": 7,
          "kwMatch": false,
          "winRate": 100,
          "score": 79,
          "lift": 10.1,
          "valPerGold": 1.44
        }
      ]
    },
    "juniper": {
      "key": "juniper",
      "name": "Juniper",
      "cls": "Druid",
      "role": "Support",
      "reach": "Ranged",
      "pack": 2,
      "packKey": "campfire",
      "nMid": 45,
      "nLate": 52,
      "midWR": 28.9,
      "lateWR": 51.9,
      "avgWR": 40.4,
      "midScore": 44.7,
      "lateScore": 49,
      "avgScore": 46.9,
      "avgTime": 22.5,
      "avgDmg": 554,
      "avgHeal": 37,
      "avgWard": 16,
      "avgTaken": 245,
      "avgGold": 0,
      "survPct": 34,
      "liveRank": 3,
      "baseRank": 5,
      "rankDelta": 2,
      "baseScore": 73.4,
      "baseWR": 77.4,
      "scoreDelta": -26.5,
      "wrDelta": -37,
      "changeStatus": "nerf",
      "archetype": "Root/Poison Controller & Wild Shape Anchor",
      "useCase": "Even after Circle of the Land’s sustain nerfs, Juniper remains an S-tier control powerhouse (554 avg damage + constant Roots). Overgrowth locks down melee rushers while Poison ticks through high-AC tanks, and pairing her with Mother Laurel or Kaska forms the #1 tested Act 3 comp (Wild Shape Moon & Land, 100% WR).",
      "changes": [
        {
          "type": "nerf",
          "text": "Circle of the Land Path now has a 1.0s internal cooldown, hits 2 allies (not whole party) at Tier IV, and trims heal (`4+WIS → 3+0.8×WIS`) and Ward (`0.8× → 0.45×`, cap `40% → 30%`)."
        },
        {
          "type": "global",
          "text": "28s Overtime anti-stall decay applies to Circle of the Land heals and Wards."
        }
      ],
      "paths": {
        "key": "juniper",
        "name": "Juniper",
        "p0": {
          "k": "overgrowth",
          "n": "Overgrowth",
          "wr": 50,
          "score": 51.8
        },
        "p1": {
          "k": "land",
          "n": "Circle of the Land",
          "wr": 20,
          "score": 45.3
        },
        "diff": 6.5,
        "winner": "Overgrowth"
      },
      "bestPartners": [
        {
          "partner": "mother_laurel",
          "name": "Mother Laurel",
          "role": "Tank",
          "cls": "Paladin",
          "winRate": 100,
          "score": 80.4,
          "sharedKw": [],
          "lift": 23.7,
          "why": "Juniper’s Roots & Wild Shapes constantly trigger Mother Laurel’s Bountiful Vines Smite damage and heals."
        },
        {
          "partner": "kaska",
          "name": "Kaska",
          "role": "Support",
          "cls": "Druid",
          "winRate": 75,
          "score": 71.7,
          "sharedKw": [
            "wild_shape"
          ],
          "lift": 15,
          "why": "Double Wild Shape triggers Circle of the Land heals/Wards while Kaska Exposes Rooted foes."
        },
        {
          "partner": "dane",
          "name": "Sir Dane",
          "role": "Tank",
          "cls": "Paladin",
          "winRate": 100,
          "score": 63.3,
          "sharedKw": [],
          "lift": 6.6,
          "why": "Strong Support/Tank role synergy balancing frontline survivability with live burst tempo."
        },
        {
          "partner": "cinder",
          "name": "Cinder",
          "role": "Damage",
          "cls": "Sorcerer",
          "winRate": 50,
          "score": 56.2,
          "sharedKw": [],
          "lift": -0.5,
          "why": "Strong Support/Damage role synergy balancing frontline survivability with live burst tempo."
        }
      ],
      "bestItems": [
        {
          "item": "moon_sickle",
          "name": "Moon Sickle",
          "rarity": 1,
          "cost": 3,
          "kwMatch": true,
          "winRate": 100,
          "score": 78.5,
          "lift": 18.4,
          "valPerGold": 6.13
        },
        {
          "item": "staff_woodlands",
          "name": "Staff of the Woodlands",
          "rarity": 3,
          "cost": 7,
          "kwMatch": true,
          "winRate": 100,
          "score": 78,
          "lift": 17.9,
          "valPerGold": 2.56
        },
        {
          "item": "staff_healing",
          "name": "Staff of Healing",
          "rarity": 2,
          "cost": 5,
          "kwMatch": false,
          "winRate": 100,
          "score": 74.6,
          "lift": 14.5,
          "valPerGold": 2.9
        },
        {
          "item": "horn_valhalla",
          "name": "Horn of Valhalla",
          "rarity": 2,
          "cost": 5,
          "kwMatch": false,
          "winRate": 100,
          "score": 74.4,
          "lift": 14.3,
          "valPerGold": 2.86
        }
      ],
      "bestValueItems": [
        {
          "item": "moon_sickle",
          "name": "Moon Sickle",
          "rarity": 1,
          "cost": 3,
          "kwMatch": true,
          "winRate": 100,
          "score": 78.5,
          "lift": 18.4,
          "valPerGold": 6.13
        },
        {
          "item": "amulet_devout",
          "name": "Amulet of the Devout",
          "rarity": 1,
          "cost": 3,
          "kwMatch": false,
          "winRate": 100,
          "score": 70.3,
          "lift": 10.2,
          "valPerGold": 3.4
        },
        {
          "item": "staff_healing",
          "name": "Staff of Healing",
          "rarity": 2,
          "cost": 5,
          "kwMatch": false,
          "winRate": 100,
          "score": 74.6,
          "lift": 14.5,
          "valPerGold": 2.9
        }
      ]
    },
    "kaska": {
      "key": "kaska",
      "name": "Kaska",
      "cls": "Druid",
      "role": "Support",
      "reach": "Melee",
      "pack": 6,
      "packKey": "surprise",
      "nMid": 49,
      "nLate": 55,
      "midWR": 53.1,
      "lateWR": 21.8,
      "avgWR": 37.5,
      "midScore": 53.6,
      "lateScore": 33.6,
      "avgScore": 43.6,
      "avgTime": 25.4,
      "avgDmg": 395,
      "avgHeal": 291,
      "avgWard": 0,
      "avgTaken": 1148,
      "avgGold": 0,
      "survPct": 27.9,
      "liveRank": 4,
      "baseRank": 7,
      "rankDelta": 3,
      "baseScore": 72.8,
      "baseWR": 79.6,
      "scoreDelta": -29.2,
      "wrDelta": -42.1,
      "changeStatus": "nerf",
      "archetype": "Exposed-Spreading Bruiser Support & Wild Shape Anchor",
      "useCase": "Even after Panther Beast HP and Pack Hunt nerfs, Kaska holds S-tier (#4 overall at 43.6) because Exposed + Wild Shape + frontline disruption fits almost every aggressive squad. Pack Hunt turns Velith (100% pair WR!), Arthur, and Zark into drain-bruisers, while pairing with Mother Laurel & Juniper unlocks the #1 Act 3 comp. Best gear: Staff of Healing & Staff of the Woodlands.",
      "changes": [
        {
          "type": "fix",
          "text": "Fixed double-scaled `u.dm²` heal bug on Pounce self-heal and Nat 20 party heal (added `{ raw: 1 }`)."
        },
        {
          "type": "nerf",
          "text": "Panther Form Beast HP reduced 40% → 32% Max HP (Lunar Resilience 55% → 44%); Tier IV Lunar Ward 26 → 20 (cap 40%)."
        },
        {
          "type": "nerf",
          "text": "Pack Hunt Path trimmed from 10 HP + 10 Charge (1.0s CD) → 7 HP + 8 Charge (1.2s CD)."
        },
        {
          "type": "nerf",
          "text": "Pounce self-heal trimmed `22+4×WIS → 18+3×WIS`; Nat 20 party heal trimmed `24+4×WIS → 20+3×WIS`."
        }
      ],
      "paths": {
        "key": "kaska",
        "name": "Kaska",
        "p0": {
          "k": "lunar_resilience",
          "n": "Lunar Resilience",
          "wr": 60,
          "score": 60.4
        },
        "p1": {
          "k": "pack_hunt",
          "n": "Pack Hunt",
          "wr": 90,
          "score": 73.9
        },
        "diff": -13.5,
        "winner": "Pack Hunt"
      },
      "bestPartners": [
        {
          "partner": "velith",
          "name": "Velith",
          "role": "Damage",
          "cls": "Rogue",
          "winRate": 100,
          "score": 73.2,
          "sharedKw": [],
          "lift": 24.3,
          "why": "Kaska spreads Exposed onto targets so Velith’s Ambush & Sneak Attacks melt backlines while healing via Pack Hunt."
        },
        {
          "partner": "zark",
          "name": "Zark",
          "role": "Tank",
          "cls": "Barbarian",
          "winRate": 75,
          "score": 63.5,
          "sharedKw": [],
          "lift": 14.6,
          "why": "Kaska’s Exposed + Pack Hunt fuels Zark’s Rage cleaves with bonus sustain and faster Charge."
        },
        {
          "partner": "arthur",
          "name": "Arthur",
          "role": "Damage",
          "cls": "Fighter",
          "winRate": 75,
          "score": 61.4,
          "sharedKw": [],
          "lift": 12.5,
          "why": "Strong Support/Damage role synergy balancing frontline survivability with live burst tempo."
        },
        {
          "partner": "dane",
          "name": "Sir Dane",
          "role": "Tank",
          "cls": "Paladin",
          "winRate": 50,
          "score": 55.6,
          "sharedKw": [],
          "lift": 6.7,
          "why": "Strong Support/Tank role synergy balancing frontline survivability with live burst tempo."
        }
      ],
      "bestItems": [
        {
          "item": "staff_healing",
          "name": "Staff of Healing",
          "rarity": 2,
          "cost": 5,
          "kwMatch": false,
          "winRate": 100,
          "score": 89.7,
          "lift": 48.1,
          "valPerGold": 9.62
        },
        {
          "item": "staff_woodlands",
          "name": "Staff of the Woodlands",
          "rarity": 3,
          "cost": 7,
          "kwMatch": true,
          "winRate": 100,
          "score": 85.8,
          "lift": 44.2,
          "valPerGold": 6.31
        },
        {
          "item": "ring_regeneration",
          "name": "Ring of Regeneration",
          "rarity": 3,
          "cost": 7,
          "kwMatch": false,
          "winRate": 100,
          "score": 76.3,
          "lift": 34.7,
          "valPerGold": 4.96
        },
        {
          "item": "staff_power",
          "name": "Staff of Power",
          "rarity": 3,
          "cost": 7,
          "kwMatch": false,
          "winRate": 75,
          "score": 76.1,
          "lift": 34.5,
          "valPerGold": 4.93
        }
      ],
      "bestValueItems": [
        {
          "item": "moon_sickle",
          "name": "Moon Sickle",
          "rarity": 1,
          "cost": 3,
          "kwMatch": true,
          "winRate": 75,
          "score": 71.9,
          "lift": 30.3,
          "valPerGold": 10.1
        },
        {
          "item": "staff_healing",
          "name": "Staff of Healing",
          "rarity": 2,
          "cost": 5,
          "kwMatch": false,
          "winRate": 100,
          "score": 89.7,
          "lift": 48.1,
          "valPerGold": 9.62
        },
        {
          "item": "amulet_devout",
          "name": "Amulet of the Devout",
          "rarity": 1,
          "cost": 3,
          "kwMatch": false,
          "winRate": 50,
          "score": 62.4,
          "lift": 20.8,
          "valPerGold": 6.93
        }
      ]
    },
    "gilthrax": {
      "key": "gilthrax",
      "name": "Gilthrax",
      "cls": "Fighter",
      "role": "Tank",
      "reach": "Melee",
      "pack": 5,
      "packKey": "market",
      "nMid": 53,
      "nLate": 66,
      "midWR": 45.3,
      "lateWR": 27.3,
      "avgWR": 36.3,
      "midScore": 47,
      "lateScore": 39.9,
      "avgScore": 43.5,
      "avgTime": 22,
      "avgDmg": 532,
      "avgHeal": 4,
      "avgWard": 244,
      "avgTaken": 861,
      "avgGold": 0.62,
      "survPct": 21,
      "liveRank": 5,
      "baseRank": 4,
      "rankDelta": -1,
      "baseScore": 74.8,
      "baseWR": 79.3,
      "scoreDelta": -31.3,
      "wrDelta": -43,
      "changeStatus": "nerf",
      "archetype": "Item-Scaling Shield Tank & Action Surge Anchor",
      "useCase": "Despite targeted Ward and gold-cap nerfs, Gilthrax remains an S-tier frontline carry (532 avg dmg + 248 Ward!). Hoard Scales rewards loading him with 3–4 items, Arcane Shield feeds Action Surge counters into Zoe/Arthur, and Arcane Reflect punishes fast attackers. Pair him with Zoe or Faelan (Arcane Recovery Battery hits 91.7% Act 3 WR!).",
      "changes": [
        {
          "type": "nerf",
          "text": "Arcane Shield base Ward cut [28, 42, 56, 70] → [22, 34, 46, 58], per-item bonus [10, 12, 15, 18] → [8, 10, 12, 14], CON scaling 5× → 4×, cap 90% → 65% Max HP."
        },
        {
          "type": "nerf",
          "text": "Arcane Reflect duration reduced 4s → 3s; Tier IV Bodyguard’s Fee ally Ward trimmed 35% → 30% (cap 40%)."
        },
        {
          "type": "nerf",
          "text": "Combat Gold cap reduced 10g → 6g per fight."
        }
      ],
      "paths": {
        "key": "gilthrax",
        "name": "Gilthrax",
        "p0": {
          "k": "gilded_hoard",
          "n": "Gilded Hoard",
          "wr": 60,
          "score": 54.7
        },
        "p1": {
          "k": "bodyguard_fee",
          "n": "Bodyguard’s Fee",
          "wr": 50,
          "score": 50.8
        },
        "diff": 3.9,
        "winner": "Gilded Hoard"
      },
      "bestPartners": [
        {
          "partner": "zoe",
          "name": "Zoe",
          "role": "Support",
          "cls": "Fighter",
          "winRate": 100,
          "score": 79.3,
          "sharedKw": [
            "action_surge"
          ],
          "lift": 13.7,
          "why": "Shared Action Surge loop: Gilthrax’s item-loaded Ward triggers Action Surge counters & Zoe’s Runic Upgrades."
        },
        {
          "partner": "faelan",
          "name": "Faelan",
          "role": "Support",
          "cls": "Wizard",
          "winRate": 100,
          "score": 72.4,
          "sharedKw": [],
          "lift": 6.8,
          "why": "Layered Wards keep Gilthrax topped off while broken Wards feed Faelan’s Spell Battery Charge back into the party."
        },
        {
          "partner": "toot",
          "name": "Toot",
          "role": "Support",
          "cls": "Bard",
          "winRate": 75,
          "score": 70.4,
          "sharedKw": [],
          "lift": 4.8,
          "why": "Pack 5 economy duo: Toot’s gold + Motes (Inspired Flourish) buy extra items that directly scale Gilthrax’s Hoard Scales."
        },
        {
          "partner": "jamison",
          "name": "Brother Jamison",
          "role": "Support",
          "cls": "Cleric",
          "winRate": 75,
          "score": 68.6,
          "sharedKw": [],
          "lift": 3,
          "why": "Strong Tank/Support role synergy balancing frontline survivability with live burst tempo."
        }
      ],
      "bestItems": [
        {
          "item": "ring_regeneration",
          "name": "Ring of Regeneration",
          "rarity": 3,
          "cost": 7,
          "kwMatch": false,
          "winRate": 33.3,
          "score": 46.5,
          "lift": 31,
          "valPerGold": 4.43
        },
        {
          "item": "dwarven_plate",
          "name": "Dwarven Plate",
          "rarity": 3,
          "cost": 7,
          "kwMatch": false,
          "winRate": 16.7,
          "score": 31.2,
          "lift": 15.7,
          "valPerGold": 2.24
        },
        {
          "item": "amulet_health",
          "name": "Amulet of Health",
          "rarity": 2,
          "cost": 5,
          "kwMatch": false,
          "winRate": 16.7,
          "score": 27.7,
          "lift": 12.2,
          "valPerGold": 2.44
        },
        {
          "item": "sunblade",
          "name": "Sun Blade",
          "rarity": 3,
          "cost": 7,
          "kwMatch": false,
          "winRate": 16.7,
          "score": 25.2,
          "lift": 9.7,
          "valPerGold": 1.39
        }
      ],
      "bestValueItems": [
        {
          "item": "ring_regeneration",
          "name": "Ring of Regeneration",
          "rarity": 3,
          "cost": 7,
          "kwMatch": false,
          "winRate": 33.3,
          "score": 46.5,
          "lift": 31,
          "valPerGold": 4.43
        },
        {
          "item": "amulet_health",
          "name": "Amulet of Health",
          "rarity": 2,
          "cost": 5,
          "kwMatch": false,
          "winRate": 16.7,
          "score": 27.7,
          "lift": 12.2,
          "valPerGold": 2.44
        },
        {
          "item": "dwarven_plate",
          "name": "Dwarven Plate",
          "rarity": 3,
          "cost": 7,
          "kwMatch": false,
          "winRate": 16.7,
          "score": 31.2,
          "lift": 15.7,
          "valPerGold": 2.24
        }
      ]
    },
    "dane": {
      "key": "dane",
      "name": "Sir Dane",
      "cls": "Paladin",
      "role": "Tank",
      "reach": "Melee",
      "pack": 2,
      "packKey": "campfire",
      "nMid": 72,
      "nLate": 71,
      "midWR": 50,
      "lateWR": 16.9,
      "avgWR": 33.5,
      "midScore": 50.7,
      "lateScore": 34.7,
      "avgScore": 42.7,
      "avgTime": 21.9,
      "avgDmg": 351,
      "avgHeal": 2,
      "avgWard": 156,
      "avgTaken": 671,
      "avgGold": 0,
      "survPct": 16.1,
      "liveRank": 6,
      "baseRank": 13,
      "rankDelta": 7,
      "baseScore": 65.2,
      "baseWR": 67.2,
      "scoreDelta": -22.5,
      "wrDelta": -33.7,
      "changeStatus": "global",
      "archetype": "Aura Tank, Smite Enabler & 2×2 Colossus Scaler",
      "useCase": "The single most versatile frontline glue hero in the live meta. Sir Dane’s Paladin Aura protects both tanks and squishy carries, his Smites trigger Ally Smite hooks (Mother Laurel, Sun Blade), and completing his Quest transforms him into a Large 2×2 mounted tank. Pair him with almost any top carry or Zoe for consistent 80%+ win rates.",
      "changes": [
        {
          "type": "global",
          "text": "No direct nerfs; benefits heavily from live meta shift toward faster fights where Aura + Smite burst outpace slow stall heals."
        },
        {
          "type": "global",
          "text": "Indirectly impacted by global enemy scaling (+50% dmg/HP curve) and 28s Overtime Ward/Heal decay."
        }
      ],
      "paths": {
        "key": "dane",
        "name": "Sir Dane",
        "p0": {
          "k": "devotion",
          "n": "Oath of Devotion",
          "wr": 70,
          "score": 59
        },
        "p1": {
          "k": "calltoarms",
          "n": "Call to Arms",
          "wr": 50,
          "score": 53.3
        },
        "diff": 5.7,
        "winner": "Oath of Devotion"
      },
      "bestPartners": [
        {
          "partner": "zoe",
          "name": "Zoe",
          "role": "Support",
          "cls": "Fighter",
          "winRate": 100,
          "score": 82.6,
          "sharedKw": [],
          "lift": 22.4,
          "why": "Sir Dane’s Aura keeps Zoe alive while Zoe’s Action Surge & Runic Upgrade accelerate Dane’s Smites and Quest."
        },
        {
          "partner": "cinder",
          "name": "Cinder",
          "role": "Damage",
          "cls": "Sorcerer",
          "winRate": 100,
          "score": 77.5,
          "sharedKw": [],
          "lift": 17.3,
          "why": "Sir Dane’s Aura & Taunt clump enemies safely in front so Cinder’s Fireballs hit maximum targets."
        },
        {
          "partner": "jamison",
          "name": "Brother Jamison",
          "role": "Support",
          "cls": "Cleric",
          "winRate": 75,
          "score": 72.3,
          "sharedKw": [],
          "lift": 12.1,
          "why": "Stacked Aura + Good Vibes (−15% dmg taken) + Bonded d20 dice create an ultra-reliable frontline core."
        },
        {
          "partner": "mother_laurel",
          "name": "Mother Laurel",
          "role": "Tank",
          "cls": "Paladin",
          "winRate": 50,
          "score": 68.8,
          "sharedKw": [
            "smite",
            "aura"
          ],
          "lift": 8.6,
          "why": "Shared smite & aura keyword engine amplifies both heroes’ triggers."
        }
      ],
      "bestItems": [
        {
          "item": "sunblade",
          "name": "Sun Blade",
          "rarity": 3,
          "cost": 7,
          "kwMatch": true,
          "winRate": 100,
          "score": 85.7,
          "lift": 20,
          "valPerGold": 2.86
        },
        {
          "item": "ring_regeneration",
          "name": "Ring of Regeneration",
          "rarity": 3,
          "cost": 7,
          "kwMatch": false,
          "winRate": 100,
          "score": 82.5,
          "lift": 16.8,
          "valPerGold": 2.4
        },
        {
          "item": "sentinel_shield",
          "name": "Sentinel Shield",
          "rarity": 1,
          "cost": 3,
          "kwMatch": true,
          "winRate": 100,
          "score": 69.8,
          "lift": 4.1,
          "valPerGold": 1.37
        },
        {
          "item": "dwarven_plate",
          "name": "Dwarven Plate",
          "rarity": 3,
          "cost": 7,
          "kwMatch": false,
          "winRate": 75,
          "score": 63.2,
          "lift": -2.5,
          "valPerGold": -0.36
        }
      ],
      "bestValueItems": [
        {
          "item": "sunblade",
          "name": "Sun Blade",
          "rarity": 3,
          "cost": 7,
          "kwMatch": true,
          "winRate": 100,
          "score": 85.7,
          "lift": 20,
          "valPerGold": 2.86
        },
        {
          "item": "ring_regeneration",
          "name": "Ring of Regeneration",
          "rarity": 3,
          "cost": 7,
          "kwMatch": false,
          "winRate": 100,
          "score": 82.5,
          "lift": 16.8,
          "valPerGold": 2.4
        },
        {
          "item": "sentinel_shield",
          "name": "Sentinel Shield",
          "rarity": 1,
          "cost": 3,
          "kwMatch": true,
          "winRate": 100,
          "score": 69.8,
          "lift": 4.1,
          "valPerGold": 1.37
        }
      ]
    },
    "mother_laurel": {
      "key": "mother_laurel",
      "name": "Mother Laurel",
      "cls": "Paladin",
      "role": "Tank",
      "reach": "Melee",
      "pack": 4,
      "packKey": "divine",
      "nMid": 71,
      "nLate": 68,
      "midWR": 28.2,
      "lateWR": 32.4,
      "avgWR": 30.3,
      "midScore": 42.6,
      "lateScore": 40.6,
      "avgScore": 41.6,
      "avgTime": 22.8,
      "avgDmg": 266,
      "avgHeal": 160,
      "avgWard": 11,
      "avgTaken": 478,
      "avgGold": 0,
      "survPct": 28.8,
      "liveRank": 7,
      "baseRank": 3,
      "rankDelta": -4,
      "baseScore": 77.2,
      "baseWR": 75.4,
      "scoreDelta": -35.6,
      "wrDelta": -45.1,
      "changeStatus": "nerf",
      "archetype": "Paladin/Druid Hybrid Tank & Root-Smite Engine",
      "useCase": "Fixed from a broken double-scaling heal bug into a still-strong A-tier synergy tank. Mother Laurel bridges Paladin Smite/Aura and Druid Root/Wild Shape engines: Bountiful Vines converts ally Smites and Wild Shapes into steady heals while punishing Rooted foes. Pair her with Kaska, Juniper, or Velith for one of the strongest mid-to-late shells in the game.",
      "changes": [
        {
          "type": "fix",
          "text": "Fixed double-scaled `u.dm²` heal bug on Bloom ability (added `{ raw: 1 }`)."
        },
        {
          "type": "nerf",
          "text": "Bloom heal trimmed `18 + 4×WIS → 14 + 3×WIS`, Ward trimmed `22 + 3×WIS → 16 + 2×WIS` (cap 50% → 40%)."
        },
        {
          "type": "nerf",
          "text": "Bountiful Vines Path now has a 1.0s cooldown, reduced heal (`8+2×WIS → 6+1.5×WIS`), and heals 2 allies (not whole party) at Tier IV."
        }
      ],
      "paths": {
        "key": "mother_laurel",
        "name": "Mother Laurel",
        "p0": {
          "k": "ancients_ward",
          "n": "Ancients’ Ward",
          "wr": 40,
          "score": 42.8
        },
        "p1": {
          "k": "bountiful_vines",
          "n": "Bountiful Vines",
          "wr": 60,
          "score": 60.4
        },
        "diff": -17.6,
        "winner": "Bountiful Vines"
      },
      "bestPartners": [
        {
          "partner": "kaska",
          "name": "Kaska",
          "role": "Support",
          "cls": "Druid",
          "winRate": 100,
          "score": 84.6,
          "sharedKw": [],
          "lift": 24.1,
          "why": "Kaska’s Wild Shapes trigger Bountiful Vines while Pack Hunt sustains Laurel’s melee frontline."
        },
        {
          "partner": "arthur",
          "name": "Arthur",
          "role": "Damage",
          "cls": "Fighter",
          "winRate": 75,
          "score": 79.9,
          "sharedKw": [],
          "lift": 19.4,
          "why": "Strong Tank/Damage role synergy balancing frontline survivability with live burst tempo."
        },
        {
          "partner": "velith",
          "name": "Velith",
          "role": "Damage",
          "cls": "Rogue",
          "winRate": 100,
          "score": 76.6,
          "sharedKw": [],
          "lift": 16.1,
          "why": "Strong Tank/Damage role synergy balancing frontline survivability with live burst tempo."
        },
        {
          "partner": "dane",
          "name": "Sir Dane",
          "role": "Tank",
          "cls": "Paladin",
          "winRate": 75,
          "score": 68,
          "sharedKw": [
            "smite",
            "aura"
          ],
          "lift": 7.5,
          "why": "Shared smite & aura keyword engine amplifies both heroes’ triggers."
        }
      ],
      "bestItems": [
        {
          "item": "amulet_health",
          "name": "Amulet of Health",
          "rarity": 2,
          "cost": 5,
          "kwMatch": false,
          "winRate": 75,
          "score": 69.8,
          "lift": 10.6,
          "valPerGold": 2.12
        },
        {
          "item": "sunblade",
          "name": "Sun Blade",
          "rarity": 3,
          "cost": 7,
          "kwMatch": true,
          "winRate": 75,
          "score": 69.5,
          "lift": 10.3,
          "valPerGold": 1.47
        },
        {
          "item": "ring_regeneration",
          "name": "Ring of Regeneration",
          "rarity": 3,
          "cost": 7,
          "kwMatch": false,
          "winRate": 75,
          "score": 68.8,
          "lift": 9.6,
          "valPerGold": 1.37
        },
        {
          "item": "potion_healing",
          "name": "Potion of Healing",
          "rarity": 0,
          "cost": 2,
          "kwMatch": false,
          "winRate": 75,
          "score": 66.4,
          "lift": 7.2,
          "valPerGold": 3.6
        }
      ],
      "bestValueItems": [
        {
          "item": "potion_healing",
          "name": "Potion of Healing",
          "rarity": 0,
          "cost": 2,
          "kwMatch": false,
          "winRate": 75,
          "score": 66.4,
          "lift": 7.2,
          "valPerGold": 3.6
        },
        {
          "item": "amulet_health",
          "name": "Amulet of Health",
          "rarity": 2,
          "cost": 5,
          "kwMatch": false,
          "winRate": 75,
          "score": 69.8,
          "lift": 10.6,
          "valPerGold": 2.12
        },
        {
          "item": "sunblade",
          "name": "Sun Blade",
          "rarity": 3,
          "cost": 7,
          "kwMatch": true,
          "winRate": 75,
          "score": 69.5,
          "lift": 10.3,
          "valPerGold": 1.47
        }
      ]
    },
    "cinder": {
      "key": "cinder",
      "name": "Cinder",
      "cls": "Sorcerer",
      "role": "Damage",
      "reach": "Ranged",
      "pack": 3,
      "packKey": "beaten",
      "nMid": 45,
      "nLate": 59,
      "midWR": 48.9,
      "lateWR": 18.6,
      "avgWR": 33.8,
      "midScore": 48.6,
      "lateScore": 32.9,
      "avgScore": 40.8,
      "avgTime": 20.2,
      "avgDmg": 482,
      "avgHeal": 1,
      "avgWard": 0,
      "avgTaken": 224,
      "avgGold": 0,
      "survPct": 26,
      "liveRank": 8,
      "baseRank": 9,
      "rankDelta": 1,
      "baseScore": 68.8,
      "baseWR": 72.9,
      "scoreDelta": -28,
      "wrDelta": -39.1,
      "changeStatus": "buff",
      "archetype": "AoE Burn Nuke & Metamagic Clump-Punisher",
      "useCase": "Your premier AoE boss-and-swarm sweeper who climbed sharply into A-tier. With buffed Fireball dice (3d6–8d6), faster Burn accumulation (55%), 2.2× Burn Detonation, and Wildfire shredding SR + applying Exposed on every Fireball, Cinder annihilates Wolf Packs, Blights, and Necromancers. Protect her with Sir Dane or Faelan and accelerate her first cast with Ring of Spell Storing.",
      "changes": [
        {
          "type": "buff",
          "text": "Global Damage Role Buff (+12% `u.dm`)."
        },
        {
          "type": "buff",
          "text": "Fireball buffed [2, 4, 5, 7]d6 → [3, 5, 6, 8]d6 and Burn stacks [4, 7, 10, 14] → [5, 8, 12, 16]; Twinned Spell buffed 4d6 → 5d6."
        },
        {
          "type": "buff",
          "text": "Nat 20 Burn Detonation multiplier raised 1.8× → 2.2× (min 12); global Fire element Burn feed increased 45% → 55%."
        },
        {
          "type": "buff",
          "text": "Wildfire Path now applies Exposed + −2 SR shred on EVERY Fireball (not just Twinned Spell)."
        }
      ],
      "paths": {
        "key": "cinder",
        "name": "Cinder",
        "p0": {
          "k": "draconic",
          "n": "Draconic Surge",
          "wr": 60,
          "score": 56.8
        },
        "p1": {
          "k": "wildfire",
          "n": "Wildfire",
          "wr": 40,
          "score": 50.5
        },
        "diff": 6.3,
        "winner": "Draconic Surge"
      },
      "bestPartners": [
        {
          "partner": "dane",
          "name": "Sir Dane",
          "role": "Tank",
          "cls": "Paladin",
          "winRate": 100,
          "score": 75.2,
          "sharedKw": [],
          "lift": 28,
          "why": "Sir Dane’s Aura & Taunt clump enemies safely in front so Cinder’s Fireballs hit maximum targets."
        },
        {
          "partner": "faelan",
          "name": "Faelan",
          "role": "Support",
          "cls": "Wizard",
          "winRate": 75,
          "score": 63.6,
          "sharedKw": [],
          "lift": 16.4,
          "why": "Strong Damage/Support role synergy balancing frontline survivability with live burst tempo."
        },
        {
          "partner": "mother_laurel",
          "name": "Mother Laurel",
          "role": "Tank",
          "cls": "Paladin",
          "winRate": 75,
          "score": 61.2,
          "sharedKw": [],
          "lift": 14,
          "why": "Strong Damage/Tank role synergy balancing frontline survivability with live burst tempo."
        },
        {
          "partner": "arthur",
          "name": "Arthur",
          "role": "Damage",
          "cls": "Fighter",
          "winRate": 75,
          "score": 59.9,
          "sharedKw": [],
          "lift": 12.7,
          "why": "High-tempo Damage duo whose kits cover each other’s scaling curves through Act 3."
        }
      ],
      "bestItems": [
        {
          "item": "ring_spell_storing",
          "name": "Ring of Spell Storing",
          "rarity": 2,
          "cost": 5,
          "kwMatch": false,
          "winRate": 100,
          "score": 80.2,
          "lift": 10.8,
          "valPerGold": 2.16
        },
        {
          "item": "scimitar_speed",
          "name": "Scimitar of Speed",
          "rarity": 3,
          "cost": 7,
          "kwMatch": false,
          "winRate": 100,
          "score": 79.4,
          "lift": 10,
          "valPerGold": 1.43
        },
        {
          "item": "staff_power",
          "name": "Staff of Power",
          "rarity": 3,
          "cost": 7,
          "kwMatch": false,
          "winRate": 100,
          "score": 78,
          "lift": 8.6,
          "valPerGold": 1.23
        },
        {
          "item": "bloodwell_vial",
          "name": "Bloodwell Vial",
          "rarity": 1,
          "cost": 3,
          "kwMatch": true,
          "winRate": 100,
          "score": 77.7,
          "lift": 8.3,
          "valPerGold": 2.77
        }
      ],
      "bestValueItems": [
        {
          "item": "bloodwell_vial",
          "name": "Bloodwell Vial",
          "rarity": 1,
          "cost": 3,
          "kwMatch": true,
          "winRate": 100,
          "score": 77.7,
          "lift": 8.3,
          "valPerGold": 2.77
        },
        {
          "item": "ring_spell_storing",
          "name": "Ring of Spell Storing",
          "rarity": 2,
          "cost": 5,
          "kwMatch": false,
          "winRate": 100,
          "score": 80.2,
          "lift": 10.8,
          "valPerGold": 2.16
        },
        {
          "item": "oathbow",
          "name": "Oathbow",
          "rarity": 2,
          "cost": 5,
          "kwMatch": false,
          "winRate": 100,
          "score": 77.1,
          "lift": 7.7,
          "valPerGold": 1.54
        }
      ]
    },
    "naill": {
      "key": "naill",
      "name": "Naill",
      "cls": "Monk",
      "role": "Damage",
      "reach": "Melee",
      "pack": 3,
      "packKey": "beaten",
      "nMid": 48,
      "nLate": 54,
      "midWR": 41.7,
      "lateWR": 14.8,
      "avgWR": 28.3,
      "midScore": 49.9,
      "lateScore": 31.4,
      "avgScore": 40.6,
      "avgTime": 23.8,
      "avgDmg": 470,
      "avgHeal": 0,
      "avgWard": 0,
      "avgTaken": 312,
      "avgGold": 0,
      "survPct": 18.6,
      "liveRank": 9,
      "baseRank": 12,
      "rankDelta": 3,
      "baseScore": 65.5,
      "baseWR": 68,
      "scoreDelta": -24.9,
      "wrDelta": -39.7,
      "changeStatus": "buff",
      "archetype": "Rapid Multi-Hit Ki Bruiser & On-Hit Disrupter",
      "useCase": "Now a genuine A-tier melee skirmisher whose 4-pip Ki bar hits like a truck (2d10 + 2×WIS + Stagger + free Alert stack). Because Naill triggers rapid strikes and double on-hit procs on Open Hand, he pairs explosively with Corvin/Lorcan (Hunter’s Mark +22% & First Strike) and Zoe, and dominates with Cloak of Displacement or Staff of Striking.",
      "changes": [
        {
          "type": "buff",
          "text": "Global Damage Role Buff (+12% `u.dm`)."
        },
        {
          "type": "buff",
          "text": "Ki Strike (Open Hand) buffed from 1d8 + WIS → 2d10 + 2×WIS bludgeoning and now grants +1 Alert stack on every trigger."
        }
      ],
      "paths": {
        "key": "naill",
        "name": "Naill",
        "p0": {
          "k": "openhand",
          "n": "Open Hand",
          "wr": 40,
          "score": 45
        },
        "p1": {
          "k": "flowing",
          "n": "Flowing Leaves",
          "wr": 40,
          "score": 46.2
        },
        "diff": -1.2,
        "winner": "Even"
      },
      "bestPartners": [
        {
          "partner": "zoe",
          "name": "Zoe",
          "role": "Support",
          "cls": "Fighter",
          "winRate": 50,
          "score": 66.4,
          "sharedKw": [],
          "lift": 28.2,
          "why": "Strong Damage/Support role synergy balancing frontline survivability with live burst tempo."
        },
        {
          "partner": "corvin",
          "name": "Corvin",
          "role": "Damage",
          "cls": "Ranger",
          "winRate": 50,
          "score": 51.6,
          "sharedKw": [],
          "lift": 13.4,
          "why": "Corvin’s First Strike applies Hunter’s Mark (+22% team dmg) that multiplies every rapid Ki strike from Naill."
        },
        {
          "partner": "dane",
          "name": "Sir Dane",
          "role": "Tank",
          "cls": "Paladin",
          "winRate": 25,
          "score": 46.6,
          "sharedKw": [],
          "lift": 8.4,
          "why": "Strong Damage/Tank role synergy balancing frontline survivability with live burst tempo."
        },
        {
          "partner": "lorcan",
          "name": "Lorcan",
          "role": "Damage",
          "cls": "Ranger",
          "winRate": 25,
          "score": 39.3,
          "sharedKw": [],
          "lift": 1.1,
          "why": "High-tempo Damage duo whose kits cover each other’s scaling curves through Act 3."
        }
      ],
      "bestItems": [
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 5,
          "kwMatch": false,
          "winRate": 75,
          "score": 74.2,
          "lift": 13.2,
          "valPerGold": 2.64
        },
        {
          "item": "staff_striking",
          "name": "Staff of Striking",
          "rarity": 3,
          "cost": 7,
          "kwMatch": true,
          "winRate": 75,
          "score": 73.2,
          "lift": 12.2,
          "valPerGold": 1.74
        },
        {
          "item": "flametongue",
          "name": "Flame Tongue",
          "rarity": 2,
          "cost": 5,
          "kwMatch": false,
          "winRate": 75,
          "score": 68.5,
          "lift": 7.5,
          "valPerGold": 1.5
        },
        {
          "item": "dagger_venom",
          "name": "Dagger of Venom",
          "rarity": 2,
          "cost": 5,
          "kwMatch": false,
          "winRate": 75,
          "score": 68.3,
          "lift": 7.3,
          "valPerGold": 1.46
        }
      ],
      "bestValueItems": [
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 5,
          "kwMatch": false,
          "winRate": 75,
          "score": 74.2,
          "lift": 13.2,
          "valPerGold": 2.64
        },
        {
          "item": "staff_striking",
          "name": "Staff of Striking",
          "rarity": 3,
          "cost": 7,
          "kwMatch": true,
          "winRate": 75,
          "score": 73.2,
          "lift": 12.2,
          "valPerGold": 1.74
        },
        {
          "item": "flametongue",
          "name": "Flame Tongue",
          "rarity": 2,
          "cost": 5,
          "kwMatch": false,
          "winRate": 75,
          "score": 68.5,
          "lift": 7.5,
          "valPerGold": 1.5
        }
      ]
    },
    "jamison": {
      "key": "jamison",
      "name": "Brother Jamison",
      "cls": "Cleric",
      "role": "Support",
      "reach": "Melee",
      "pack": 4,
      "packKey": "divine",
      "nMid": 57,
      "nLate": 48,
      "midWR": 38.6,
      "lateWR": 20.8,
      "avgWR": 29.7,
      "midScore": 46.2,
      "lateScore": 33.1,
      "avgScore": 39.7,
      "avgTime": 22.3,
      "avgDmg": 233,
      "avgHeal": 216,
      "avgWard": 0,
      "avgTaken": 419,
      "avgGold": 0,
      "survPct": 12.4,
      "liveRank": 10,
      "baseRank": 8,
      "rankDelta": -2,
      "baseScore": 70.3,
      "baseWR": 76.1,
      "scoreDelta": -30.6,
      "wrDelta": -46.4,
      "changeStatus": "nerf",
      "archetype": "Damage-Reduction Bonder & d20 Consistency Support",
      "useCase": "A steady A-tier defensive support whose Good Vibes (−15% damage taken on Bonded allies) and Bonded d20 dice stabilize high-risk frontlines without turning fights into unkillable stalls. Draft Brother Jamison alongside Sir Dane or Zark when you need consistent High/Nat 20 rolls and damage mitigation against Act 3 bosses.",
      "changes": [
        {
          "type": "fix",
          "text": "Fixed double-scaled `u.dm²` heal bug on Emboldening Bond cast (added `{ raw: 1 }`)."
        },
        {
          "type": "nerf",
          "text": "Channel Divinity Balm of Peace heal trimmed `18 + 4×CHA → 14 + 3×CHA`; Tier IV Peace & Radiance heal trimmed `12 → 10`."
        },
        {
          "type": "global",
          "text": "28s Overtime decay reins in long-fight healing output."
        }
      ],
      "paths": {
        "key": "jamison",
        "name": "Brother Jamison",
        "p0": {
          "k": "good_vibes",
          "n": "Good Vibes",
          "wr": 30,
          "score": 44.7
        },
        "p1": {
          "k": "peace_radiance",
          "n": "Peace & Radiance",
          "wr": 20,
          "score": 38
        },
        "diff": 6.7,
        "winner": "Good Vibes"
      },
      "bestPartners": [
        {
          "partner": "dane",
          "name": "Sir Dane",
          "role": "Tank",
          "cls": "Paladin",
          "winRate": 75,
          "score": 67.7,
          "sharedKw": [],
          "lift": 30.6,
          "why": "Stacked Aura + Good Vibes (−15% dmg taken) + Bonded d20 dice create an ultra-reliable frontline core."
        },
        {
          "partner": "zark",
          "name": "Zark",
          "role": "Tank",
          "cls": "Barbarian",
          "winRate": 50,
          "score": 50.5,
          "sharedKw": [],
          "lift": 13.4,
          "why": "Strong Support/Tank role synergy balancing frontline survivability with live burst tempo."
        },
        {
          "partner": "mother_laurel",
          "name": "Mother Laurel",
          "role": "Tank",
          "cls": "Paladin",
          "winRate": 25,
          "score": 42.1,
          "sharedKw": [],
          "lift": 5,
          "why": "Strong Support/Tank role synergy balancing frontline survivability with live burst tempo."
        },
        {
          "partner": "pillar",
          "name": "Pillar",
          "role": "Tank",
          "cls": "Barbarian",
          "winRate": 25,
          "score": 40.4,
          "sharedKw": [],
          "lift": 3.3,
          "why": "Strong Support/Tank role synergy balancing frontline survivability with live burst tempo."
        }
      ],
      "bestItems": [
        {
          "item": "robe_stars",
          "name": "Robe of Stars",
          "rarity": 3,
          "cost": 7,
          "kwMatch": false,
          "winRate": 50,
          "score": 58.7,
          "lift": 9.2,
          "valPerGold": 1.31
        },
        {
          "item": "ring_spell_storing",
          "name": "Ring of Spell Storing",
          "rarity": 2,
          "cost": 5,
          "kwMatch": false,
          "winRate": 50,
          "score": 53,
          "lift": 3.5,
          "valPerGold": 0.7
        },
        {
          "item": "headband",
          "name": "Headband of Intellect",
          "rarity": 2,
          "cost": 5,
          "kwMatch": false,
          "winRate": 50,
          "score": 50.5,
          "lift": 1,
          "valPerGold": 0.2
        },
        {
          "item": "staff_power",
          "name": "Staff of Power",
          "rarity": 3,
          "cost": 7,
          "kwMatch": false,
          "winRate": 50,
          "score": 49.4,
          "lift": -0.1,
          "valPerGold": -0.01
        }
      ],
      "bestValueItems": [
        {
          "item": "robe_stars",
          "name": "Robe of Stars",
          "rarity": 3,
          "cost": 7,
          "kwMatch": false,
          "winRate": 50,
          "score": 58.7,
          "lift": 9.2,
          "valPerGold": 1.31
        },
        {
          "item": "ring_spell_storing",
          "name": "Ring of Spell Storing",
          "rarity": 2,
          "cost": 5,
          "kwMatch": false,
          "winRate": 50,
          "score": 53,
          "lift": 3.5,
          "valPerGold": 0.7
        },
        {
          "item": "headband",
          "name": "Headband of Intellect",
          "rarity": 2,
          "cost": 5,
          "kwMatch": false,
          "winRate": 50,
          "score": 50.5,
          "lift": 1,
          "valPerGold": 0.2
        }
      ]
    },
    "faelan": {
      "key": "faelan",
      "name": "Faelan",
      "cls": "Wizard",
      "role": "Support",
      "reach": "Ranged",
      "pack": 1,
      "packKey": "tavern",
      "nMid": 59,
      "nLate": 56,
      "midWR": 39,
      "lateWR": 19.6,
      "avgWR": 29.3,
      "midScore": 43.6,
      "lateScore": 34.2,
      "avgScore": 38.9,
      "avgTime": 26.1,
      "avgDmg": 199,
      "avgHeal": 0,
      "avgWard": 909,
      "avgTaken": 417,
      "avgGold": 0,
      "survPct": 20.9,
      "liveRank": 11,
      "baseRank": 2,
      "rankDelta": -9,
      "baseScore": 84.7,
      "baseWR": 94.1,
      "scoreDelta": -45.8,
      "wrDelta": -64.8,
      "changeStatus": "nerf",
      "archetype": "Arcane Recovery Battery & Anti-Burst Warder",
      "useCase": "No longer a solo unlosable shield wall (dropped from #2 to middle of the pack), Faelan is now a dedicated Charge battery and burst-mitigation specialist. Draft him on Spell Battery alongside Action Surge / Arcane Recovery partners (Zoe, Gilthrax, Gains) and feed him Staff of Power or Ring of Spell Storing to turbocharge team casts.",
      "changes": [
        {
          "type": "nerf",
          "text": "Arcane Ward base trimmed [14, 24, 30, 36] + 3×INT → [12, 18, 24, 28] + 2×INT, and max Ward cap reduced 75% → 55% Max HP."
        },
        {
          "type": "nerf",
          "text": "High roll Charge refund cut 35% → 18%; Projected Ward Path multiplier trimmed 1.35× → 1.18×."
        },
        {
          "type": "nerf",
          "text": "Arcane Recovery on Ward break reduced 20 → 12 Charge."
        },
        {
          "type": "fix",
          "text": "Fixed double-counted `u.stats.ward` stat tracking bug."
        },
        {
          "type": "global",
          "text": "Overtime decay (starting at 28s) reduces Ward generation in stall fights."
        }
      ],
      "paths": {
        "key": "faelan",
        "name": "Faelan",
        "p0": {
          "k": "projected",
          "n": "Projected Ward",
          "wr": 60,
          "score": 55.4
        },
        "p1": {
          "k": "battery",
          "n": "Spell Battery",
          "wr": 80,
          "score": 71.6
        },
        "diff": -16.2,
        "winner": "Spell Battery"
      },
      "bestPartners": [
        {
          "partner": "zoe",
          "name": "Zoe",
          "role": "Support",
          "cls": "Fighter",
          "winRate": 75,
          "score": 78.2,
          "sharedKw": [],
          "lift": 28.1,
          "why": "Zoe’s Haste/Charge speeds up Faelan’s Wards while Spell Battery loops Zoe’s Rummage & Action Surges."
        },
        {
          "partner": "dane",
          "name": "Sir Dane",
          "role": "Tank",
          "cls": "Paladin",
          "winRate": 75,
          "score": 63.8,
          "sharedKw": [],
          "lift": 13.7,
          "why": "Strong Support/Tank role synergy balancing frontline survivability with live burst tempo."
        },
        {
          "partner": "gilthrax",
          "name": "Gilthrax",
          "role": "Tank",
          "cls": "Fighter",
          "winRate": 50,
          "score": 63.5,
          "sharedKw": [],
          "lift": 13.4,
          "why": "Layered Wards keep Gilthrax topped off while broken Wards feed Faelan’s Spell Battery Charge back into the party."
        },
        {
          "partner": "arthur",
          "name": "Arthur",
          "role": "Damage",
          "cls": "Fighter",
          "winRate": 50,
          "score": 55.3,
          "sharedKw": [],
          "lift": 5.2,
          "why": "Strong Support/Damage role synergy balancing frontline survivability with live burst tempo."
        }
      ],
      "bestItems": [
        {
          "item": "staff_power",
          "name": "Staff of Power",
          "rarity": 3,
          "cost": 7,
          "kwMatch": true,
          "winRate": 100,
          "score": 92.3,
          "lift": 50.2,
          "valPerGold": 7.17
        },
        {
          "item": "ring_spell_storing",
          "name": "Ring of Spell Storing",
          "rarity": 2,
          "cost": 5,
          "kwMatch": false,
          "winRate": 100,
          "score": 88.8,
          "lift": 46.7,
          "valPerGold": 9.34
        },
        {
          "item": "staff_woodlands",
          "name": "Staff of the Woodlands",
          "rarity": 3,
          "cost": 7,
          "kwMatch": false,
          "winRate": 100,
          "score": 88.2,
          "lift": 46.1,
          "valPerGold": 6.59
        },
        {
          "item": "robe_stars",
          "name": "Robe of Stars",
          "rarity": 3,
          "cost": 7,
          "kwMatch": false,
          "winRate": 100,
          "score": 84.6,
          "lift": 42.5,
          "valPerGold": 6.07
        }
      ],
      "bestValueItems": [
        {
          "item": "ring_spell_storing",
          "name": "Ring of Spell Storing",
          "rarity": 2,
          "cost": 5,
          "kwMatch": false,
          "winRate": 100,
          "score": 88.8,
          "lift": 46.7,
          "valPerGold": 9.34
        },
        {
          "item": "headband",
          "name": "Headband of Intellect",
          "rarity": 2,
          "cost": 5,
          "kwMatch": false,
          "winRate": 100,
          "score": 82.2,
          "lift": 40.1,
          "valPerGold": 8.02
        },
        {
          "item": "staff_power",
          "name": "Staff of Power",
          "rarity": 3,
          "cost": 7,
          "kwMatch": true,
          "winRate": 100,
          "score": 92.3,
          "lift": 50.2,
          "valPerGold": 7.17
        }
      ]
    },
    "arthur": {
      "key": "arthur",
      "name": "Arthur",
      "cls": "Fighter",
      "role": "Damage",
      "reach": "Melee",
      "pack": 1,
      "packKey": "tavern",
      "nMid": 55,
      "nLate": 47,
      "midWR": 27.3,
      "lateWR": 23.4,
      "avgWR": 25.4,
      "midScore": 41.1,
      "lateScore": 35,
      "avgScore": 38,
      "avgTime": 21.7,
      "avgDmg": 351,
      "avgHeal": 4,
      "avgWard": 0,
      "avgTaken": 362,
      "avgGold": 0,
      "survPct": 11.8,
      "liveRank": 12,
      "baseRank": 10,
      "rankDelta": -2,
      "baseScore": 67.1,
      "baseWR": 66,
      "scoreDelta": -29.1,
      "wrDelta": -40.6,
      "changeStatus": "buff",
      "archetype": "Backline Sniper & Action Surge Trigger",
      "useCase": "Your premier multi-arrow on-hit carrier and Action Surge bridge. Draft Arthur to snipe fragile enemy summoners/healers from the back with Longbow Volley while proccing on-hit items (Frost Brand, Sun Blade, Flame Tongue) across multiple targets—and pair him with Zoe or Gilthrax to chain Action Surge loops.",
      "changes": [
        {
          "type": "buff",
          "text": "Global Damage Role Buff: +12% base damage scaling (`u.dm × 1.12`) across all attacks and Volley arrows."
        },
        {
          "type": "buff",
          "text": "Longbow Volley: each arrow now deals +3 flat bonus piercing damage (`2d6+3` / `2d8+3` on Nat 20)."
        }
      ],
      "paths": {
        "key": "arthur",
        "name": "Arthur",
        "p0": {
          "k": "vigilance",
          "n": "Constant Vigilance",
          "wr": 60,
          "score": 56
        },
        "p1": {
          "k": "initiative",
          "n": "Roll for Initiative",
          "wr": 50,
          "score": 54.1
        },
        "diff": 1.9,
        "winner": "Constant Vigilance"
      },
      "bestPartners": [
        {
          "partner": "zoe",
          "name": "Zoe",
          "role": "Support",
          "cls": "Fighter",
          "winRate": 75,
          "score": 67.4,
          "sharedKw": [
            "action_surge"
          ],
          "lift": 19.8,
          "why": "Shared Action Surge loop: Zoe turbocharges Arthur’s multi-arrow Volleys with Haste, Charge, and free attacks."
        },
        {
          "partner": "naill",
          "name": "Naill",
          "role": "Damage",
          "cls": "Monk",
          "winRate": 75,
          "score": 57.7,
          "sharedKw": [],
          "lift": 10.1,
          "why": "Dual high-tempo on-hit strikers: Arthur Exposes backlines while Naill Staggers and disrupts the front."
        },
        {
          "partner": "faelan",
          "name": "Faelan",
          "role": "Support",
          "cls": "Wizard",
          "winRate": 50,
          "score": 56.2,
          "sharedKw": [],
          "lift": 8.6,
          "why": "Strong Damage/Support role synergy balancing frontline survivability with live burst tempo."
        },
        {
          "partner": "cinder",
          "name": "Cinder",
          "role": "Damage",
          "cls": "Sorcerer",
          "winRate": 50,
          "score": 55.6,
          "sharedKw": [],
          "lift": 8,
          "why": "High-tempo Damage duo whose kits cover each other’s scaling curves through Act 3."
        }
      ],
      "bestItems": [
        {
          "item": "frost_brand",
          "name": "Frost Brand",
          "rarity": 3,
          "cost": 7,
          "kwMatch": false,
          "winRate": 100,
          "score": 76.5,
          "lift": 23,
          "valPerGold": 3.29
        },
        {
          "item": "sunblade",
          "name": "Sun Blade",
          "rarity": 3,
          "cost": 7,
          "kwMatch": false,
          "winRate": 100,
          "score": 75.1,
          "lift": 21.6,
          "valPerGold": 3.09
        },
        {
          "item": "boots_speed",
          "name": "Boots of Speed",
          "rarity": 2,
          "cost": 5,
          "kwMatch": false,
          "winRate": 75,
          "score": 66.6,
          "lift": 13.1,
          "valPerGold": 2.62
        },
        {
          "item": "flametongue",
          "name": "Flame Tongue",
          "rarity": 2,
          "cost": 5,
          "kwMatch": true,
          "winRate": 75,
          "score": 58.9,
          "lift": 5.4,
          "valPerGold": 1.08
        }
      ],
      "bestValueItems": [
        {
          "item": "frost_brand",
          "name": "Frost Brand",
          "rarity": 3,
          "cost": 7,
          "kwMatch": false,
          "winRate": 100,
          "score": 76.5,
          "lift": 23,
          "valPerGold": 3.29
        },
        {
          "item": "sunblade",
          "name": "Sun Blade",
          "rarity": 3,
          "cost": 7,
          "kwMatch": false,
          "winRate": 100,
          "score": 75.1,
          "lift": 21.6,
          "valPerGold": 3.09
        },
        {
          "item": "boots_speed",
          "name": "Boots of Speed",
          "rarity": 2,
          "cost": 5,
          "kwMatch": false,
          "winRate": 75,
          "score": 66.6,
          "lift": 13.1,
          "valPerGold": 2.62
        }
      ]
    },
    "nettle": {
      "key": "nettle",
      "name": "Nettle",
      "cls": "Warlock",
      "role": "Support",
      "reach": "Ranged",
      "pack": 3,
      "packKey": "beaten",
      "nMid": 55,
      "nLate": 58,
      "midWR": 40,
      "lateWR": 17.2,
      "avgWR": 28.6,
      "midScore": 45.4,
      "lateScore": 29.8,
      "avgScore": 37.6,
      "avgTime": 17.8,
      "avgDmg": 624,
      "avgHeal": 93,
      "avgWard": 0,
      "avgTaken": 216,
      "avgGold": 0,
      "survPct": 20.4,
      "liveRank": 13,
      "baseRank": 21,
      "rankDelta": 8,
      "baseScore": 55.1,
      "baseWR": 51.9,
      "scoreDelta": -17.5,
      "wrDelta": -23.3,
      "changeStatus": "buff",
      "archetype": "Single-Target Hex Shredder & Pact Boon Battery",
      "useCase": "One of the biggest meta risers—delivering the highest average damage of any Support (624 avg dmg!). Reworked Hex adds 1d8/1d10 necrotic to EVERY allied hit on the cursed foe, while Pact Boon now feeds +16 Charge to Nettle and the killer plus heals the lowest-HP ally. Draft Nettle with sturdy tanks (Mother Laurel, Bram) and fast casters (Headband of Intellect / Staff of Power).",
      "changes": [
        {
          "type": "buff",
          "text": "Hex on-hit necrotic proc buffed from d4 (T1) / d6 (T2+) → d8 (T1) / d10 (T2+) per stack."
        },
        {
          "type": "buff",
          "text": "Pact Boon now restores +16 Charge to both Nettle and the killer, and heals the lowest-HP ally (`7 + 1.5×CHA`)."
        },
        {
          "type": "rebal",
          "text": "Jumping Hex party heal lightly trimmed (`5+CHA → 4+CHA`) to balance the new lowest-HP heal."
        }
      ],
      "paths": {
        "key": "nettle",
        "name": "Nettle",
        "p0": {
          "k": "fineprint",
          "n": "Fine Print",
          "wr": 10,
          "score": 30.5
        },
        "p1": {
          "k": "bargain",
          "n": "Dark One’s Bargain",
          "wr": 0,
          "score": 26.3
        },
        "diff": 4.2,
        "winner": "Fine Print"
      },
      "bestPartners": [
        {
          "partner": "mother_laurel",
          "name": "Mother Laurel",
          "role": "Tank",
          "cls": "Paladin",
          "winRate": 50,
          "score": 46.3,
          "sharedKw": [],
          "lift": 10.5,
          "why": "Strong Support/Tank role synergy balancing frontline survivability with live burst tempo."
        },
        {
          "partner": "bram",
          "name": "Bram",
          "role": "Tank",
          "cls": "Cleric",
          "winRate": 25,
          "score": 44.5,
          "sharedKw": [],
          "lift": 8.7,
          "why": "Strong Support/Tank role synergy balancing frontline survivability with live burst tempo."
        },
        {
          "partner": "juniper",
          "name": "Juniper",
          "role": "Support",
          "cls": "Druid",
          "winRate": 25,
          "score": 43.9,
          "sharedKw": [],
          "lift": 8.1,
          "why": "High-tempo Support duo whose kits cover each other’s scaling curves through Act 3."
        },
        {
          "partner": "zark",
          "name": "Zark",
          "role": "Tank",
          "cls": "Barbarian",
          "winRate": 25,
          "score": 40.7,
          "sharedKw": [],
          "lift": 4.9,
          "why": "Strong Support/Tank role synergy balancing frontline survivability with live burst tempo."
        }
      ],
      "bestItems": [
        {
          "item": "headband",
          "name": "Headband of Intellect",
          "rarity": 2,
          "cost": 5,
          "kwMatch": false,
          "winRate": 75,
          "score": 58.8,
          "lift": 13.4,
          "valPerGold": 2.68
        },
        {
          "item": "staff_power",
          "name": "Staff of Power",
          "rarity": 3,
          "cost": 7,
          "kwMatch": false,
          "winRate": 50,
          "score": 58.6,
          "lift": 13.2,
          "valPerGold": 1.89
        },
        {
          "item": "staff_woodlands",
          "name": "Staff of the Woodlands",
          "rarity": 3,
          "cost": 7,
          "kwMatch": false,
          "winRate": 50,
          "score": 55.6,
          "lift": 10.2,
          "valPerGold": 1.46
        },
        {
          "item": "staff_withering",
          "name": "Staff of Withering",
          "rarity": 2,
          "cost": 5,
          "kwMatch": true,
          "winRate": 50,
          "score": 55.1,
          "lift": 9.7,
          "valPerGold": 1.94
        }
      ],
      "bestValueItems": [
        {
          "item": "headband",
          "name": "Headband of Intellect",
          "rarity": 2,
          "cost": 5,
          "kwMatch": false,
          "winRate": 75,
          "score": 58.8,
          "lift": 13.4,
          "valPerGold": 2.68
        },
        {
          "item": "staff_withering",
          "name": "Staff of Withering",
          "rarity": 2,
          "cost": 5,
          "kwMatch": true,
          "winRate": 50,
          "score": 55.1,
          "lift": 9.7,
          "valPerGold": 1.94
        },
        {
          "item": "staff_power",
          "name": "Staff of Power",
          "rarity": 3,
          "cost": 7,
          "kwMatch": false,
          "winRate": 50,
          "score": 58.6,
          "lift": 13.2,
          "valPerGold": 1.89
        }
      ]
    },
    "zark": {
      "key": "zark",
      "name": "Zark",
      "cls": "Barbarian",
      "role": "Tank",
      "reach": "Melee",
      "pack": 3,
      "packKey": "beaten",
      "nMid": 67,
      "nLate": 79,
      "midWR": 25.4,
      "lateWR": 19,
      "avgWR": 22.2,
      "midScore": 39.4,
      "lateScore": 32.3,
      "avgScore": 35.8,
      "avgTime": 22.3,
      "avgDmg": 279,
      "avgHeal": 102,
      "avgWard": 0,
      "avgTaken": 775,
      "avgGold": 0,
      "survPct": 11.6,
      "liveRank": 14,
      "baseRank": 18,
      "rankDelta": 4,
      "baseScore": 58.4,
      "baseWR": 51.6,
      "scoreDelta": -22.6,
      "wrDelta": -29.4,
      "changeStatus": "buff",
      "archetype": "Scaling Drain-Tank Barbarian & Rage Snowballer",
      "useCase": "A frontline bruiser who scales harder the longer he swings. Buffed Bear Rage (6% DR per stack + 10%/15% Max HP self-heal on High/Nat 20 Bear Cleave) fixes his old Act 2 fragility while Relentless Endurance absorbs lethal spikes. Pair Zark with Zoe (extra swings/Rage tempo) or Kaska (Pack Hunt sustain) and gear him with Sun Blade or Ring of Regeneration.",
      "changes": [
        {
          "type": "buff",
          "text": "Bear Rage damage reduction buffed 4% → 6% per stack (cap adjusted to 55%)."
        },
        {
          "type": "buff",
          "text": "High Bear Cleave now restores 10% Max HP; Nat 20 restores 15% Max HP."
        }
      ],
      "paths": {
        "key": "zark",
        "name": "Zark",
        "p0": {
          "k": "relentless",
          "n": "Relentless Bear",
          "wr": 70,
          "score": 54.7
        },
        "p1": {
          "k": "totemroar",
          "n": "Totem Roar",
          "wr": 50,
          "score": 50
        },
        "diff": 4.7,
        "winner": "Relentless Bear"
      },
      "bestPartners": [
        {
          "partner": "zoe",
          "name": "Zoe",
          "role": "Support",
          "cls": "Fighter",
          "winRate": 75,
          "score": 69.4,
          "sharedKw": [],
          "lift": 20.9,
          "why": "Strong Tank/Support role synergy balancing frontline survivability with live burst tempo."
        },
        {
          "partner": "kaska",
          "name": "Kaska",
          "role": "Support",
          "cls": "Druid",
          "winRate": 50,
          "score": 60.9,
          "sharedKw": [],
          "lift": 12.4,
          "why": "Kaska’s Exposed + Pack Hunt fuels Zark’s Rage cleaves with bonus sustain and faster Charge."
        },
        {
          "partner": "cinder",
          "name": "Cinder",
          "role": "Damage",
          "cls": "Sorcerer",
          "winRate": 75,
          "score": 57.3,
          "sharedKw": [],
          "lift": 8.8,
          "why": "Strong Tank/Damage role synergy balancing frontline survivability with live burst tempo."
        },
        {
          "partner": "jamison",
          "name": "Brother Jamison",
          "role": "Support",
          "cls": "Cleric",
          "winRate": 75,
          "score": 57.2,
          "sharedKw": [],
          "lift": 8.7,
          "why": "Strong Tank/Support role synergy balancing frontline survivability with live burst tempo."
        }
      ],
      "bestItems": [
        {
          "item": "sunblade",
          "name": "Sun Blade",
          "rarity": 3,
          "cost": 7,
          "kwMatch": false,
          "winRate": 100,
          "score": 80,
          "lift": 11.8,
          "valPerGold": 1.69
        },
        {
          "item": "ring_regeneration",
          "name": "Ring of Regeneration",
          "rarity": 3,
          "cost": 7,
          "kwMatch": false,
          "winRate": 100,
          "score": 79,
          "lift": 10.8,
          "valPerGold": 1.54
        },
        {
          "item": "amulet_health",
          "name": "Amulet of Health",
          "rarity": 2,
          "cost": 5,
          "kwMatch": false,
          "winRate": 100,
          "score": 77.4,
          "lift": 9.2,
          "valPerGold": 1.84
        },
        {
          "item": "periapt_wound_closure",
          "name": "Periapt of Wound Closure",
          "rarity": 1,
          "cost": 3,
          "kwMatch": true,
          "winRate": 100,
          "score": 73.9,
          "lift": 5.7,
          "valPerGold": 1.9
        }
      ],
      "bestValueItems": [
        {
          "item": "periapt_wound_closure",
          "name": "Periapt of Wound Closure",
          "rarity": 1,
          "cost": 3,
          "kwMatch": true,
          "winRate": 100,
          "score": 73.9,
          "lift": 5.7,
          "valPerGold": 1.9
        },
        {
          "item": "amulet_health",
          "name": "Amulet of Health",
          "rarity": 2,
          "cost": 5,
          "kwMatch": false,
          "winRate": 100,
          "score": 77.4,
          "lift": 9.2,
          "valPerGold": 1.84
        },
        {
          "item": "sunblade",
          "name": "Sun Blade",
          "rarity": 3,
          "cost": 7,
          "kwMatch": false,
          "winRate": 100,
          "score": 80,
          "lift": 11.8,
          "valPerGold": 1.69
        }
      ]
    },
    "bram": {
      "key": "bram",
      "name": "Bram",
      "cls": "Cleric",
      "role": "Tank",
      "reach": "Melee",
      "pack": 1,
      "packKey": "tavern",
      "nMid": 61,
      "nLate": 74,
      "midWR": 27.9,
      "lateWR": 14.9,
      "avgWR": 21.4,
      "midScore": 39.3,
      "lateScore": 27.8,
      "avgScore": 33.5,
      "avgTime": 23,
      "avgDmg": 159,
      "avgHeal": 237,
      "avgWard": 4,
      "avgTaken": 693,
      "avgGold": 0,
      "survPct": 7.4,
      "liveRank": 15,
      "baseRank": 17,
      "rankDelta": 2,
      "baseScore": 59.2,
      "baseWR": 55.6,
      "scoreDelta": -25.7,
      "wrDelta": -34.2,
      "changeStatus": "buff",
      "archetype": "Stalwart Frontline & Emergency Burst Healer",
      "useCase": "Reliable Act 1–3 frontline anchor who buys time for glass-cannon carries with a boosted 146 HP pool and his once-per-fight Preserve Life Channel Divinity save. Bram shines alongside high-burst carries like Cinder or paired tanks like Sir Dane who let him soak spikes without dying before Preserve Life fires.",
      "changes": [
        {
          "type": "buff",
          "text": "Base HP increased 132 → 146 (+14 HP) so he survives buffed Act 2–3 frontline burst."
        },
        {
          "type": "global",
          "text": "28s Overtime anti-stall decay (−15% Heal/Ward every 5s, max −60%) trims drawn-out attrition fights."
        }
      ],
      "paths": {
        "key": "bram",
        "name": "Bram",
        "p0": {
          "k": "disciple",
          "n": "Disciple of Life",
          "wr": 50,
          "score": 52.6
        },
        "p1": {
          "k": "divine",
          "n": "Divine Strike",
          "wr": 50,
          "score": 51.9
        },
        "diff": 0.7,
        "winner": "Even"
      },
      "bestPartners": [
        {
          "partner": "cinder",
          "name": "Cinder",
          "role": "Damage",
          "cls": "Sorcerer",
          "winRate": 100,
          "score": 72.2,
          "sharedKw": [],
          "lift": 26,
          "why": "Bram’s 146 HP frontline + Preserve Life burst heal guarantees Cinder lives long enough to detonate Burn."
        },
        {
          "partner": "dane",
          "name": "Sir Dane",
          "role": "Tank",
          "cls": "Paladin",
          "winRate": 75,
          "score": 70.6,
          "sharedKw": [],
          "lift": 24.4,
          "why": "High-tempo Tank duo whose kits cover each other’s scaling curves through Act 3."
        },
        {
          "partner": "zoe",
          "name": "Zoe",
          "role": "Support",
          "cls": "Fighter",
          "winRate": 75,
          "score": 64.8,
          "sharedKw": [],
          "lift": 18.6,
          "why": "Strong Tank/Support role synergy balancing frontline survivability with live burst tempo."
        },
        {
          "partner": "arthur",
          "name": "Arthur",
          "role": "Damage",
          "cls": "Fighter",
          "winRate": 75,
          "score": 60.1,
          "sharedKw": [],
          "lift": 13.9,
          "why": "Strong Tank/Damage role synergy balancing frontline survivability with live burst tempo."
        }
      ],
      "bestItems": [
        {
          "item": "ring_regeneration",
          "name": "Ring of Regeneration",
          "rarity": 3,
          "cost": 7,
          "kwMatch": false,
          "winRate": 100,
          "score": 86.6,
          "lift": 27.7,
          "valPerGold": 3.96
        },
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 5,
          "kwMatch": false,
          "winRate": 75,
          "score": 73,
          "lift": 14.1,
          "valPerGold": 2.82
        },
        {
          "item": "dwarven_plate",
          "name": "Dwarven Plate",
          "rarity": 3,
          "cost": 7,
          "kwMatch": false,
          "winRate": 75,
          "score": 69,
          "lift": 10.1,
          "valPerGold": 1.44
        },
        {
          "item": "amulet_health",
          "name": "Amulet of Health",
          "rarity": 2,
          "cost": 5,
          "kwMatch": false,
          "winRate": 75,
          "score": 65.8,
          "lift": 6.9,
          "valPerGold": 1.38
        }
      ],
      "bestValueItems": [
        {
          "item": "ring_regeneration",
          "name": "Ring of Regeneration",
          "rarity": 3,
          "cost": 7,
          "kwMatch": false,
          "winRate": 100,
          "score": 86.6,
          "lift": 27.7,
          "valPerGold": 3.96
        },
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 5,
          "kwMatch": false,
          "winRate": 75,
          "score": 73,
          "lift": 14.1,
          "valPerGold": 2.82
        },
        {
          "item": "dwarven_plate",
          "name": "Dwarven Plate",
          "rarity": 3,
          "cost": 7,
          "kwMatch": false,
          "winRate": 75,
          "score": 69,
          "lift": 10.1,
          "valPerGold": 1.44
        }
      ]
    },
    "corvin": {
      "key": "corvin",
      "name": "Corvin",
      "cls": "Ranger",
      "role": "Damage",
      "reach": "Melee",
      "pack": 6,
      "packKey": "surprise",
      "nMid": 50,
      "nLate": 45,
      "midWR": 28,
      "lateWR": 13.3,
      "avgWR": 20.6,
      "midScore": 39.9,
      "lateScore": 27,
      "avgScore": 33.5,
      "avgTime": 19.2,
      "avgDmg": 355,
      "avgHeal": 1,
      "avgWard": 0,
      "avgTaken": 296,
      "avgGold": 0,
      "survPct": 11.6,
      "liveRank": 16,
      "baseRank": 11,
      "rankDelta": -5,
      "baseScore": 66.7,
      "baseWR": 65.4,
      "scoreDelta": -33.2,
      "wrDelta": -44.8,
      "changeStatus": "buff",
      "archetype": "Melee Hunter’s Mark Skirmisher & Exposed Flanker",
      "useCase": "Corvin is the premier melee enabler for on-hit and ambush comps. His First Strike Path spreads Hunter’s Mark (+22% party damage + 1d10+WIS Ranger proc) right at fight start—turning Naill (100% pair WR!), Velith (75% pair WR), and Lorcan into shredding machines. Give him Dagger of Venom, Cloak of Displacement, or Boots of Speed to keep him swinging safely.",
      "changes": [
        {
          "type": "buff",
          "text": "Global Damage Role Buff (+12% `u.dm`)."
        },
        {
          "type": "buff",
          "text": "Hunter’s Mark rework: Marked foes take +22% damage from all allies, and Ranger bonus proc buffed 1d6+WIS → 1d10+WIS."
        }
      ],
      "paths": {
        "key": "corvin",
        "name": "Corvin",
        "p0": {
          "k": "stalker_flurry",
          "n": "Stalker’s Flurry",
          "wr": 10,
          "score": 28.1
        },
        "p1": {
          "k": "first_strike",
          "n": "First Strike",
          "wr": 20,
          "score": 30.7
        },
        "diff": -2.6,
        "winner": "First Strike"
      },
      "bestPartners": [
        {
          "partner": "naill",
          "name": "Naill",
          "role": "Damage",
          "cls": "Monk",
          "winRate": 100,
          "score": 69.2,
          "sharedKw": [],
          "lift": 23.5,
          "why": "Corvin’s First Strike applies Hunter’s Mark (+22% team dmg) that multiplies every rapid Ki strike from Naill."
        },
        {
          "partner": "velith",
          "name": "Velith",
          "role": "Damage",
          "cls": "Rogue",
          "winRate": 75,
          "score": 54,
          "sharedKw": [],
          "lift": 8.3,
          "why": "Corvin marks and Exposes frontline/midline targets for Velith’s Poison & Sneak Attack executes."
        },
        {
          "partner": "juniper",
          "name": "Juniper",
          "role": "Support",
          "cls": "Druid",
          "winRate": 50,
          "score": 52.8,
          "sharedKw": [],
          "lift": 7.1,
          "why": "Strong Damage/Support role synergy balancing frontline survivability with live burst tempo."
        },
        {
          "partner": "dane",
          "name": "Sir Dane",
          "role": "Tank",
          "cls": "Paladin",
          "winRate": 50,
          "score": 51.9,
          "sharedKw": [],
          "lift": 6.2,
          "why": "Strong Damage/Tank role synergy balancing frontline survivability with live burst tempo."
        }
      ],
      "bestItems": [
        {
          "item": "dagger_venom",
          "name": "Dagger of Venom",
          "rarity": 2,
          "cost": 5,
          "kwMatch": false,
          "winRate": 75,
          "score": 71.5,
          "lift": 23.4,
          "valPerGold": 4.68
        },
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 5,
          "kwMatch": false,
          "winRate": 75,
          "score": 68.6,
          "lift": 20.5,
          "valPerGold": 4.1
        },
        {
          "item": "boots_speed",
          "name": "Boots of Speed",
          "rarity": 2,
          "cost": 5,
          "kwMatch": false,
          "winRate": 75,
          "score": 67.8,
          "lift": 19.7,
          "valPerGold": 3.94
        },
        {
          "item": "cloak_elvenkind",
          "name": "Cloak of Elvenkind",
          "rarity": 1,
          "cost": 3,
          "kwMatch": false,
          "winRate": 75,
          "score": 64.6,
          "lift": 16.5,
          "valPerGold": 5.5
        }
      ],
      "bestValueItems": [
        {
          "item": "cloak_elvenkind",
          "name": "Cloak of Elvenkind",
          "rarity": 1,
          "cost": 3,
          "kwMatch": false,
          "winRate": 75,
          "score": 64.6,
          "lift": 16.5,
          "valPerGold": 5.5
        },
        {
          "item": "dagger_venom",
          "name": "Dagger of Venom",
          "rarity": 2,
          "cost": 5,
          "kwMatch": false,
          "winRate": 75,
          "score": 71.5,
          "lift": 23.4,
          "valPerGold": 4.68
        },
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 5,
          "kwMatch": false,
          "winRate": 75,
          "score": 68.6,
          "lift": 20.5,
          "valPerGold": 4.1
        }
      ]
    },
    "pillar": {
      "key": "pillar",
      "name": "Pillar",
      "cls": "Barbarian",
      "role": "Tank",
      "reach": "Melee",
      "pack": 4,
      "packKey": "divine",
      "nMid": 79,
      "nLate": 69,
      "midWR": 30.4,
      "lateWR": 10.1,
      "avgWR": 20.3,
      "midScore": 40.1,
      "lateScore": 25.8,
      "avgScore": 33,
      "avgTime": 21.1,
      "avgDmg": 185,
      "avgHeal": 2,
      "avgWard": 0,
      "avgTaken": 651,
      "avgGold": 0,
      "survPct": 10.8,
      "liveRank": 17,
      "baseRank": 14,
      "rankDelta": -3,
      "baseScore": 64.9,
      "baseWR": 70.8,
      "scoreDelta": -31.9,
      "wrDelta": -50.5,
      "changeStatus": "rebal",
      "archetype": "Stone-Colossus Meatshield & Anti-Spike Tank",
      "useCase": "Pillar trades burst damage for sheer immovable bulk—Stone’s Endurance shaves flat damage off every heavy hit, and completing his Quest transforms him into a Large 2×2 Living Colossus that shields your entire backline. Pair him with high-output ranged carries like Cinder or Arthur and prioritize Ring of Regeneration or Plate Armor.",
      "changes": [
        {
          "type": "fix",
          "text": "Fixed double-scaled `u.dm²` heal bug on Tier IV Living Beacon (added `{ raw: 1 }`)."
        },
        {
          "type": "global",
          "text": "Indirectly feels the tougher Act 2–3 enemy curve; thrives most once Quest 2×2 Colossus form + sustain gear come online."
        }
      ],
      "paths": {
        "key": "pillar",
        "name": "Pillar",
        "p0": {
          "k": "unstoppable",
          "n": "Unstoppable Faith",
          "wr": 10,
          "score": 31.4
        },
        "p1": {
          "k": "beacon",
          "n": "Living Beacon",
          "wr": 20,
          "score": 37.9
        },
        "diff": -6.5,
        "winner": "Living Beacon"
      },
      "bestPartners": [
        {
          "partner": "cinder",
          "name": "Cinder",
          "role": "Damage",
          "cls": "Sorcerer",
          "winRate": 100,
          "score": 64.8,
          "sharedKw": [],
          "lift": 21.9,
          "why": "Pillar’s Stone’s Endurance & 2×2 Colossus body clumps enemies cleanly for Cinder’s Fireballs."
        },
        {
          "partner": "arthur",
          "name": "Arthur",
          "role": "Damage",
          "cls": "Fighter",
          "winRate": 50,
          "score": 58.6,
          "sharedKw": [],
          "lift": 15.7,
          "why": "Strong Tank/Damage role synergy balancing frontline survivability with live burst tempo."
        },
        {
          "partner": "faelan",
          "name": "Faelan",
          "role": "Support",
          "cls": "Wizard",
          "winRate": 25,
          "score": 51.4,
          "sharedKw": [],
          "lift": 8.5,
          "why": "Strong Tank/Support role synergy balancing frontline survivability with live burst tempo."
        },
        {
          "partner": "jamison",
          "name": "Brother Jamison",
          "role": "Support",
          "cls": "Cleric",
          "winRate": 50,
          "score": 50.8,
          "sharedKw": [],
          "lift": 7.9,
          "why": "Strong Tank/Support role synergy balancing frontline survivability with live burst tempo."
        }
      ],
      "bestItems": [
        {
          "item": "ring_regeneration",
          "name": "Ring of Regeneration",
          "rarity": 3,
          "cost": 7,
          "kwMatch": false,
          "winRate": 75,
          "score": 65.2,
          "lift": 10.2,
          "valPerGold": 1.46
        },
        {
          "item": "plate_armor",
          "name": "Plate Armor",
          "rarity": 2,
          "cost": 5,
          "kwMatch": false,
          "winRate": 100,
          "score": 64.5,
          "lift": 9.5,
          "valPerGold": 1.9
        },
        {
          "item": "potion_healing",
          "name": "Potion of Healing",
          "rarity": 0,
          "cost": 2,
          "kwMatch": false,
          "winRate": 75,
          "score": 61.3,
          "lift": 6.3,
          "valPerGold": 3.15
        },
        {
          "item": "sentinel_shield",
          "name": "Sentinel Shield",
          "rarity": 1,
          "cost": 3,
          "kwMatch": false,
          "winRate": 75,
          "score": 60.7,
          "lift": 5.7,
          "valPerGold": 1.9
        }
      ],
      "bestValueItems": [
        {
          "item": "potion_healing",
          "name": "Potion of Healing",
          "rarity": 0,
          "cost": 2,
          "kwMatch": false,
          "winRate": 75,
          "score": 61.3,
          "lift": 6.3,
          "valPerGold": 3.15
        },
        {
          "item": "plate_armor",
          "name": "Plate Armor",
          "rarity": 2,
          "cost": 5,
          "kwMatch": false,
          "winRate": 100,
          "score": 64.5,
          "lift": 9.5,
          "valPerGold": 1.9
        },
        {
          "item": "sentinel_shield",
          "name": "Sentinel Shield",
          "rarity": 1,
          "cost": 3,
          "kwMatch": false,
          "winRate": 75,
          "score": 60.7,
          "lift": 5.7,
          "valPerGold": 1.9
        }
      ]
    },
    "lorcan": {
      "key": "lorcan",
      "name": "Lorcan",
      "cls": "Ranger",
      "role": "Damage",
      "reach": "Ranged",
      "pack": 2,
      "packKey": "campfire",
      "nMid": 56,
      "nLate": 52,
      "midWR": 21.4,
      "lateWR": 17.3,
      "avgWR": 19.4,
      "midScore": 34.6,
      "lateScore": 31.2,
      "avgScore": 32.9,
      "avgTime": 19.6,
      "avgDmg": 433,
      "avgHeal": 0,
      "avgWard": 0,
      "avgTaken": 254,
      "avgGold": 0,
      "survPct": 13,
      "liveRank": 18,
      "baseRank": 16,
      "rankDelta": -2,
      "baseScore": 62.2,
      "baseWR": 65.7,
      "scoreDelta": -29.3,
      "wrDelta": -46.3,
      "changeStatus": "buff",
      "archetype": "Hunter’s Mark Boss-Melter & On-Hit Marksman",
      "useCase": "Mediocre naked, terrifying once geared. Lorcan’s reworked Hunter’s Mark now amplifies ALL party damage against the marked target by +22% while his own arrows proc +1d10+WIS bonus damage. Give him Ring of Spell Storing (instant Turn-1 Mark) or Oathbow and pair him with Zoe, Sir Dane, or Corvin to shred high-HP bosses like Owlbear and Brood Mother.",
      "changes": [
        {
          "type": "buff",
          "text": "Global Damage Role Buff (+12% `u.dm`); Base HP increased 94 → 104; Longbow flat damage 2 → 3."
        },
        {
          "type": "buff",
          "text": "Hunter’s Mark rework: Marked enemies now take +22% damage from the entire party, and Ranger bonus proc buffed 1d6+WIS → 1d10+WIS."
        }
      ],
      "paths": {
        "key": "lorcan",
        "name": "Lorcan",
        "p0": {
          "k": "colossus",
          "n": "Colossus Slayer",
          "wr": 40,
          "score": 49.7
        },
        "p1": {
          "k": "trophies",
          "n": "Volley of Trophies",
          "wr": 30,
          "score": 46.2
        },
        "diff": 3.5,
        "winner": "Colossus Slayer"
      },
      "bestPartners": [
        {
          "partner": "zoe",
          "name": "Zoe",
          "role": "Support",
          "cls": "Fighter",
          "winRate": 75,
          "score": 67.2,
          "sharedKw": [],
          "lift": 26.4,
          "why": "Zoe’s Runic Upgrade, Haste, and Action Surge multiply Lorcan’s Hunter’s Mark arrows and Colossus Slayer procs."
        },
        {
          "partner": "dane",
          "name": "Sir Dane",
          "role": "Tank",
          "cls": "Paladin",
          "winRate": 50,
          "score": 54.4,
          "sharedKw": [],
          "lift": 13.6,
          "why": "Strong Damage/Tank role synergy balancing frontline survivability with live burst tempo."
        },
        {
          "partner": "corvin",
          "name": "Corvin",
          "role": "Damage",
          "cls": "Ranger",
          "winRate": 50,
          "score": 47.2,
          "sharedKw": [
            "hunters_mark"
          ],
          "lift": 6.4,
          "why": "Double Ranger Hunter’s Mark keeps +22% team-wide amplification and 1d10+WIS procs active all fight."
        },
        {
          "partner": "juniper",
          "name": "Juniper",
          "role": "Support",
          "cls": "Druid",
          "winRate": 50,
          "score": 46.8,
          "sharedKw": [],
          "lift": 6,
          "why": "Strong Damage/Support role synergy balancing frontline survivability with live burst tempo."
        }
      ],
      "bestItems": [
        {
          "item": "ring_spell_storing",
          "name": "Ring of Spell Storing",
          "rarity": 2,
          "cost": 5,
          "kwMatch": false,
          "winRate": 100,
          "score": 80.4,
          "lift": 29.8,
          "valPerGold": 5.96
        },
        {
          "item": "oathbow",
          "name": "Oathbow",
          "rarity": 2,
          "cost": 5,
          "kwMatch": true,
          "winRate": 100,
          "score": 76.4,
          "lift": 25.8,
          "valPerGold": 5.16
        },
        {
          "item": "sunblade",
          "name": "Sun Blade",
          "rarity": 3,
          "cost": 7,
          "kwMatch": false,
          "winRate": 100,
          "score": 74.7,
          "lift": 24.1,
          "valPerGold": 3.44
        },
        {
          "item": "wand_fireballs",
          "name": "Wand of Fireballs",
          "rarity": 2,
          "cost": 5,
          "kwMatch": false,
          "winRate": 75,
          "score": 67,
          "lift": 16.4,
          "valPerGold": 3.28
        }
      ],
      "bestValueItems": [
        {
          "item": "ring_spell_storing",
          "name": "Ring of Spell Storing",
          "rarity": 2,
          "cost": 5,
          "kwMatch": false,
          "winRate": 100,
          "score": 80.4,
          "lift": 29.8,
          "valPerGold": 5.96
        },
        {
          "item": "oathbow",
          "name": "Oathbow",
          "rarity": 2,
          "cost": 5,
          "kwMatch": true,
          "winRate": 100,
          "score": 76.4,
          "lift": 25.8,
          "valPerGold": 5.16
        },
        {
          "item": "bracers_archery",
          "name": "Bracers of Archery",
          "rarity": 1,
          "cost": 3,
          "kwMatch": true,
          "winRate": 75,
          "score": 65.3,
          "lift": 14.7,
          "valPerGold": 4.9
        }
      ]
    },
    "rosalind": {
      "key": "rosalind",
      "name": "Rosalind",
      "cls": "Bard",
      "role": "Support",
      "reach": "Ranged",
      "pack": 2,
      "packKey": "campfire",
      "nMid": 46,
      "nLate": 59,
      "midWR": 17.4,
      "lateWR": 11.9,
      "avgWR": 14.6,
      "midScore": 37.1,
      "lateScore": 28.4,
      "avgScore": 32.8,
      "avgTime": 19.8,
      "avgDmg": 150,
      "avgHeal": 1,
      "avgWard": 0,
      "avgTaken": 262,
      "avgGold": 0,
      "survPct": 9.5,
      "liveRank": 19,
      "baseRank": 24,
      "rankDelta": 5,
      "baseScore": 49,
      "baseWR": 42.9,
      "scoreDelta": -16.2,
      "wrDelta": -28.3,
      "changeStatus": "buff",
      "archetype": "Inspired Flourish Hyper-Buffer & Roll Fixer",
      "useCase": "Reborn as a true offensive amplifier. Spending Rosalind’s Bardic Inspiration now triggers Inspired Flourish (+25% damage & +25% Haste for 4.5s) on top of +15/18 Charge and d20 roll boosting, while Vicious Mockery cuts enemy damage by −22% and Staggers. Draft her on Pass the Round beside high-impact casters/carries (Sir Dane, Cinder, Zark) and equip Horn of Valhalla or Pipes of Haunting.",
      "changes": [
        {
          "type": "buff",
          "text": "New Inspired Flourish mechanic: any ally spending Bardic Inspiration gains +25% Damage & +25% Haste for 4.5s (CHA-scaled)."
        },
        {
          "type": "buff",
          "text": "Bardic Inspiration now also grants +15 Charge (Low/Mid) and +18 Charge (High) immediately on cast."
        },
        {
          "type": "buff",
          "text": "Base HP buffed 90 → 102; Vicious Mockery buffed 1d6+1 (1.4s) → 1d8+2 (1.35s), enemy damage debuff −15% → −22%, and now applies Stagger."
        }
      ],
      "paths": {
        "key": "rosalind",
        "name": "Rosalind",
        "p0": {
          "k": "passround",
          "n": "Pass the Round",
          "wr": 50,
          "score": 47.1
        },
        "p1": {
          "k": "encore",
          "n": "Encore",
          "wr": 30,
          "score": 40.6
        },
        "diff": 6.5,
        "winner": "Pass the Round"
      },
      "bestPartners": [
        {
          "partner": "dane",
          "name": "Sir Dane",
          "role": "Tank",
          "cls": "Paladin",
          "winRate": 50,
          "score": 54.8,
          "sharedKw": [],
          "lift": 27.7,
          "why": "Strong Support/Tank role synergy balancing frontline survivability with live burst tempo."
        },
        {
          "partner": "zark",
          "name": "Zark",
          "role": "Tank",
          "cls": "Barbarian",
          "winRate": 25,
          "score": 41.5,
          "sharedKw": [],
          "lift": 14.4,
          "why": "Strong Support/Tank role synergy balancing frontline survivability with live burst tempo."
        },
        {
          "partner": "cinder",
          "name": "Cinder",
          "role": "Damage",
          "cls": "Sorcerer",
          "winRate": 0,
          "score": 29,
          "sharedKw": [],
          "lift": 1.9,
          "why": "Strong Support/Damage role synergy balancing frontline survivability with live burst tempo."
        },
        {
          "partner": "jamison",
          "name": "Brother Jamison",
          "role": "Support",
          "cls": "Cleric",
          "winRate": 0,
          "score": 24.4,
          "sharedKw": [],
          "lift": -2.7,
          "why": "High-tempo Support duo whose kits cover each other’s scaling curves through Act 3."
        }
      ],
      "bestItems": [
        {
          "item": "staff_power",
          "name": "Staff of Power",
          "rarity": 3,
          "cost": 7,
          "kwMatch": false,
          "winRate": 75,
          "score": 56.5,
          "lift": 21.8,
          "valPerGold": 3.11
        },
        {
          "item": "horn_valhalla",
          "name": "Horn of Valhalla",
          "rarity": 2,
          "cost": 5,
          "kwMatch": true,
          "winRate": 50,
          "score": 51.3,
          "lift": 16.6,
          "valPerGold": 3.32
        },
        {
          "item": "pipes_haunting",
          "name": "Pipes of Haunting",
          "rarity": 1,
          "cost": 3,
          "kwMatch": true,
          "winRate": 50,
          "score": 50.8,
          "lift": 16.1,
          "valPerGold": 5.37
        },
        {
          "item": "ring_regeneration",
          "name": "Ring of Regeneration",
          "rarity": 3,
          "cost": 7,
          "kwMatch": false,
          "winRate": 50,
          "score": 49,
          "lift": 14.3,
          "valPerGold": 2.04
        }
      ],
      "bestValueItems": [
        {
          "item": "pipes_haunting",
          "name": "Pipes of Haunting",
          "rarity": 1,
          "cost": 3,
          "kwMatch": true,
          "winRate": 50,
          "score": 50.8,
          "lift": 16.1,
          "valPerGold": 5.37
        },
        {
          "item": "horn_valhalla",
          "name": "Horn of Valhalla",
          "rarity": 2,
          "cost": 5,
          "kwMatch": true,
          "winRate": 50,
          "score": 51.3,
          "lift": 16.6,
          "valPerGold": 3.32
        },
        {
          "item": "staff_power",
          "name": "Staff of Power",
          "rarity": 3,
          "cost": 7,
          "kwMatch": false,
          "winRate": 75,
          "score": 56.5,
          "lift": 21.8,
          "valPerGold": 3.11
        }
      ]
    },
    "gains": {
      "key": "gains",
      "name": "Gains",
      "cls": "Wizard",
      "role": "Damage",
      "reach": "Ranged",
      "pack": 5,
      "packKey": "market",
      "nMid": 49,
      "nLate": 53,
      "midWR": 22.4,
      "lateWR": 15.1,
      "avgWR": 18.8,
      "midScore": 36.5,
      "lateScore": 28.9,
      "avgScore": 32.7,
      "avgTime": 22,
      "avgDmg": 444,
      "avgHeal": 1,
      "avgWard": 0,
      "avgTaken": 279,
      "avgGold": 1.42,
      "survPct": 12.7,
      "liveRank": 20,
      "baseRank": 19,
      "rankDelta": -1,
      "baseScore": 58.4,
      "baseWR": 52.5,
      "scoreDelta": -25.7,
      "wrDelta": -33.7,
      "changeStatus": "rebal",
      "archetype": "Late-Run Gold-Hoarding Arcane Artillery",
      "useCase": "Gains scales with your unspent bankroll and Arcane Recovery tempo. In bare-bones midgame tests he looks modest (32.7), but inside Pack 5 Market Cartel or Arcane Recovery Battery (with Faelan + Gilthrax + Zoe, 91.7% Act 3 WR!) he snowballs into devastating burst. Equip Scimitar of Speed, Boots of Speed, or Robe of Stars to supercharge his output.",
      "changes": [
        {
          "type": "buff",
          "text": "Global Damage Role Buff (+12% `u.dm`)."
        },
        {
          "type": "nerf",
          "text": "Combat Gold cap tightened 12g → 6g per fight."
        }
      ],
      "paths": {
        "key": "gains",
        "name": "Gains",
        "p0": {
          "k": "compound_interest",
          "n": "Compound Interest",
          "wr": 40,
          "score": 50.2
        },
        "p1": {
          "k": "liquid_assets",
          "n": "Liquid Assets",
          "wr": 30,
          "score": 48.1
        },
        "diff": 2.1,
        "winner": "Compound Interest"
      },
      "bestPartners": [
        {
          "partner": "gilthrax",
          "name": "Gilthrax",
          "role": "Tank",
          "cls": "Fighter",
          "winRate": 50,
          "score": 56,
          "sharedKw": [],
          "lift": 19.1,
          "why": "Strong Damage/Tank role synergy balancing frontline survivability with live burst tempo."
        },
        {
          "partner": "zoe",
          "name": "Zoe",
          "role": "Support",
          "cls": "Fighter",
          "winRate": 25,
          "score": 51.1,
          "sharedKw": [],
          "lift": 14.2,
          "why": "Strong Damage/Support role synergy balancing frontline survivability with live burst tempo."
        },
        {
          "partner": "dane",
          "name": "Sir Dane",
          "role": "Tank",
          "cls": "Paladin",
          "winRate": 50,
          "score": 50.7,
          "sharedKw": [],
          "lift": 13.8,
          "why": "Strong Damage/Tank role synergy balancing frontline survivability with live burst tempo."
        },
        {
          "partner": "cinder",
          "name": "Cinder",
          "role": "Damage",
          "cls": "Sorcerer",
          "winRate": 50,
          "score": 47.6,
          "sharedKw": [],
          "lift": 10.7,
          "why": "High-tempo Damage duo whose kits cover each other’s scaling curves through Act 3."
        }
      ],
      "bestItems": [
        {
          "item": "scimitar_speed",
          "name": "Scimitar of Speed",
          "rarity": 3,
          "cost": 7,
          "kwMatch": false,
          "winRate": 100,
          "score": 74.7,
          "lift": 28.5,
          "valPerGold": 4.07
        },
        {
          "item": "boots_speed",
          "name": "Boots of Speed",
          "rarity": 2,
          "cost": 5,
          "kwMatch": false,
          "winRate": 100,
          "score": 73.6,
          "lift": 27.4,
          "valPerGold": 5.48
        },
        {
          "item": "robe_stars",
          "name": "Robe of Stars",
          "rarity": 3,
          "cost": 7,
          "kwMatch": false,
          "winRate": 75,
          "score": 68.6,
          "lift": 22.4,
          "valPerGold": 3.2
        },
        {
          "item": "pearl_power",
          "name": "Pearl of Power",
          "rarity": 1,
          "cost": 3,
          "kwMatch": true,
          "winRate": 100,
          "score": 68,
          "lift": 21.8,
          "valPerGold": 7.27
        }
      ],
      "bestValueItems": [
        {
          "item": "pearl_power",
          "name": "Pearl of Power",
          "rarity": 1,
          "cost": 3,
          "kwMatch": true,
          "winRate": 100,
          "score": 68,
          "lift": 21.8,
          "valPerGold": 7.27
        },
        {
          "item": "boots_speed",
          "name": "Boots of Speed",
          "rarity": 2,
          "cost": 5,
          "kwMatch": false,
          "winRate": 100,
          "score": 73.6,
          "lift": 27.4,
          "valPerGold": 5.48
        },
        {
          "item": "wand_fireballs",
          "name": "Wand of Fireballs",
          "rarity": 2,
          "cost": 5,
          "kwMatch": false,
          "winRate": 75,
          "score": 67.8,
          "lift": 21.6,
          "valPerGold": 4.32
        }
      ]
    },
    "lumen": {
      "key": "lumen",
      "name": "Lumen",
      "cls": "Cleric",
      "role": "Damage",
      "reach": "Ranged",
      "pack": 4,
      "packKey": "divine",
      "nMid": 55,
      "nLate": 51,
      "midWR": 23.6,
      "lateWR": 17.6,
      "avgWR": 20.6,
      "midScore": 35.3,
      "lateScore": 29.5,
      "avgScore": 32.4,
      "avgTime": 19.3,
      "avgDmg": 311,
      "avgHeal": 2,
      "avgWard": 0,
      "avgTaken": 236,
      "avgGold": 0,
      "survPct": 15.1,
      "liveRank": 21,
      "baseRank": 15,
      "rankDelta": -6,
      "baseScore": 64.9,
      "baseWR": 64.7,
      "scoreDelta": -32.5,
      "wrDelta": -44.1,
      "changeStatus": "rebal",
      "archetype": "Burn-Detonating Radiant Blaster & Execute Cleric",
      "useCase": "Lumen shines as a dedicated Burn-payoff and Channel Divinity finisher rather than a solo carry. On Purifying Light, Lumen turns ally Holy hits into Burn and detonates accumulated Burn for massive radiant AoE—making Cinder her undisputed #1 partner. Gear her with Scimitar of Speed, Wand of Fireballs, or Sun Blade to accelerate casts and executes.",
      "changes": [
        {
          "type": "buff",
          "text": "Global Damage Role Buff (+12% `u.dm`)."
        },
        {
          "type": "fix",
          "text": "Fixed double-scaled `u.dm²` heal bug on Tier IV Purifying Light Burn detonation (added `{ raw: 1 }`)."
        }
      ],
      "paths": {
        "key": "lumen",
        "name": "Lumen",
        "p0": {
          "k": "judgement",
          "n": "Judgement",
          "wr": 30,
          "score": 51.6
        },
        "p1": {
          "k": "purifying",
          "n": "Purifying Light",
          "wr": 60,
          "score": 62.3
        },
        "diff": -10.7,
        "winner": "Purifying Light"
      },
      "bestPartners": [
        {
          "partner": "cinder",
          "name": "Cinder",
          "role": "Damage",
          "cls": "Sorcerer",
          "winRate": 50,
          "score": 48.4,
          "sharedKw": [],
          "lift": 16.2,
          "why": "Cinder floods the board with Burn while Lumen (Purifying Light) detonates it for massive radiant AoE."
        },
        {
          "partner": "zark",
          "name": "Zark",
          "role": "Tank",
          "cls": "Barbarian",
          "winRate": 25,
          "score": 41.9,
          "sharedKw": [],
          "lift": 9.7,
          "why": "Strong Damage/Tank role synergy balancing frontline survivability with live burst tempo."
        },
        {
          "partner": "dane",
          "name": "Sir Dane",
          "role": "Tank",
          "cls": "Paladin",
          "winRate": 0,
          "score": 39.3,
          "sharedKw": [],
          "lift": 7.1,
          "why": "Strong Damage/Tank role synergy balancing frontline survivability with live burst tempo."
        },
        {
          "partner": "pillar",
          "name": "Pillar",
          "role": "Tank",
          "cls": "Barbarian",
          "winRate": 25,
          "score": 39,
          "sharedKw": [],
          "lift": 6.8,
          "why": "Strong Damage/Tank role synergy balancing frontline survivability with live burst tempo."
        }
      ],
      "bestItems": [
        {
          "item": "scimitar_speed",
          "name": "Scimitar of Speed",
          "rarity": 3,
          "cost": 7,
          "kwMatch": false,
          "winRate": 100,
          "score": 70.5,
          "lift": 18.3,
          "valPerGold": 2.61
        },
        {
          "item": "wand_fireballs",
          "name": "Wand of Fireballs",
          "rarity": 2,
          "cost": 5,
          "kwMatch": false,
          "winRate": 100,
          "score": 70,
          "lift": 17.8,
          "valPerGold": 3.56
        },
        {
          "item": "sunblade",
          "name": "Sun Blade",
          "rarity": 3,
          "cost": 7,
          "kwMatch": false,
          "winRate": 75,
          "score": 66.5,
          "lift": 14.3,
          "valPerGold": 2.04
        },
        {
          "item": "oathbow",
          "name": "Oathbow",
          "rarity": 2,
          "cost": 5,
          "kwMatch": false,
          "winRate": 75,
          "score": 66.4,
          "lift": 14.2,
          "valPerGold": 2.84
        }
      ],
      "bestValueItems": [
        {
          "item": "wand_fireballs",
          "name": "Wand of Fireballs",
          "rarity": 2,
          "cost": 5,
          "kwMatch": false,
          "winRate": 100,
          "score": 70,
          "lift": 17.8,
          "valPerGold": 3.56
        },
        {
          "item": "oathbow",
          "name": "Oathbow",
          "rarity": 2,
          "cost": 5,
          "kwMatch": false,
          "winRate": 75,
          "score": 66.4,
          "lift": 14.2,
          "valPerGold": 2.84
        },
        {
          "item": "staff_healing",
          "name": "Staff of Healing",
          "rarity": 2,
          "cost": 5,
          "kwMatch": true,
          "winRate": 50,
          "score": 65.9,
          "lift": 13.7,
          "valPerGold": 2.74
        }
      ]
    },
    "wallaby": {
      "key": "wallaby",
      "name": "Wallaby",
      "cls": "Rogue",
      "role": "Damage",
      "reach": "Melee",
      "pack": 1,
      "packKey": "tavern",
      "nMid": 54,
      "nLate": 46,
      "midWR": 25.9,
      "lateWR": 4.3,
      "avgWR": 15.1,
      "midScore": 39.2,
      "lateScore": 23.6,
      "avgScore": 31.4,
      "avgTime": 20.3,
      "avgDmg": 320,
      "avgHeal": 0,
      "avgWard": 0,
      "avgTaken": 313,
      "avgGold": 0.59,
      "survPct": 10,
      "liveRank": 22,
      "baseRank": 20,
      "rankDelta": -2,
      "baseScore": 55.6,
      "baseWR": 50,
      "scoreDelta": -24.2,
      "wrDelta": -34.9,
      "changeStatus": "rebal",
      "archetype": "Backline Assassin & Burst Execute Rogue",
      "useCase": "A high-variance backline diver who jumps straight onto enemy archers, necromancers, and Battle Mages. Buffed Backstab dice (3d6–9d6), +1d6 passive Sneak Attack, and free shadow-evade on kill make him a lethal finisher—just give him one defensive or tempo item (Dwarven Plate, Amulet of Health, or Boots of Speed) so he survives the dive.",
      "changes": [
        {
          "type": "buff",
          "text": "Global Damage Role Buff (+12% `u.dm`); Base HP increased 94 → 106; Shortsword flat damage 2 → 3."
        },
        {
          "type": "buff",
          "text": "Backstab Sneak Attack dice buffed [2, 4, 6, 8]d6 → [3, 5, 7, 9]d6; passive Sneak Attack gains +1 bonus d6."
        },
        {
          "type": "buff",
          "text": "Now gains Stealth Shadow Evade (halves next hit) automatically whenever he scores a kill."
        },
        {
          "type": "nerf",
          "text": "Combat Gold cap tightened 12g → 8g per fight to keep economy healthy."
        }
      ],
      "paths": {
        "key": "wallaby",
        "name": "Wallaby",
        "p0": {
          "k": "slippery",
          "n": "Slippery",
          "wr": 20,
          "score": 31.8
        },
        "p1": {
          "k": "fasthands",
          "n": "Fast Hands",
          "wr": 20,
          "score": 33.3
        },
        "diff": -1.5,
        "winner": "Even"
      },
      "bestPartners": [
        {
          "partner": "gilthrax",
          "name": "Gilthrax",
          "role": "Tank",
          "cls": "Fighter",
          "winRate": 75,
          "score": 54.9,
          "sharedKw": [],
          "lift": 25.5,
          "why": "Strong Damage/Tank role synergy balancing frontline survivability with live burst tempo."
        },
        {
          "partner": "velith",
          "name": "Velith",
          "role": "Damage",
          "cls": "Rogue",
          "winRate": 50,
          "score": 45.3,
          "sharedKw": [
            "sneak_attack",
            "cunning_action"
          ],
          "lift": 15.9,
          "why": "Double Sneak Attack / Cunning Action dive shreds enemy backlines before summoners or healers can cast."
        },
        {
          "partner": "zoe",
          "name": "Zoe",
          "role": "Support",
          "cls": "Fighter",
          "winRate": 25,
          "score": 35.3,
          "sharedKw": [],
          "lift": 5.9,
          "why": "Strong Damage/Support role synergy balancing frontline survivability with live burst tempo."
        },
        {
          "partner": "dane",
          "name": "Sir Dane",
          "role": "Tank",
          "cls": "Paladin",
          "winRate": 0,
          "score": 31.1,
          "sharedKw": [],
          "lift": 1.7,
          "why": "Strong Damage/Tank role synergy balancing frontline survivability with live burst tempo."
        }
      ],
      "bestItems": [
        {
          "item": "dwarven_plate",
          "name": "Dwarven Plate",
          "rarity": 3,
          "cost": 7,
          "kwMatch": false,
          "winRate": 75,
          "score": 66.9,
          "lift": 23.7,
          "valPerGold": 3.39
        },
        {
          "item": "boots_speed",
          "name": "Boots of Speed",
          "rarity": 2,
          "cost": 5,
          "kwMatch": false,
          "winRate": 100,
          "score": 66.3,
          "lift": 23.1,
          "valPerGold": 4.62
        },
        {
          "item": "amulet_health",
          "name": "Amulet of Health",
          "rarity": 2,
          "cost": 5,
          "kwMatch": false,
          "winRate": 100,
          "score": 65.3,
          "lift": 22.1,
          "valPerGold": 4.42
        },
        {
          "item": "dagger_venom",
          "name": "Dagger of Venom",
          "rarity": 2,
          "cost": 5,
          "kwMatch": true,
          "winRate": 100,
          "score": 63.9,
          "lift": 20.7,
          "valPerGold": 4.14
        }
      ],
      "bestValueItems": [
        {
          "item": "boots_speed",
          "name": "Boots of Speed",
          "rarity": 2,
          "cost": 5,
          "kwMatch": false,
          "winRate": 100,
          "score": 66.3,
          "lift": 23.1,
          "valPerGold": 4.62
        },
        {
          "item": "cloak_elvenkind",
          "name": "Cloak of Elvenkind",
          "rarity": 1,
          "cost": 3,
          "kwMatch": true,
          "winRate": 50,
          "score": 56.7,
          "lift": 13.5,
          "valPerGold": 4.5
        },
        {
          "item": "amulet_health",
          "name": "Amulet of Health",
          "rarity": 2,
          "cost": 5,
          "kwMatch": false,
          "winRate": 100,
          "score": 65.3,
          "lift": 22.1,
          "valPerGold": 4.42
        }
      ]
    },
    "saint": {
      "key": "saint",
      "name": "Saint",
      "cls": "Cleric",
      "role": "Support",
      "reach": "Ranged",
      "pack": 6,
      "packKey": "surprise",
      "nMid": 68,
      "nLate": 40,
      "midWR": 19.1,
      "lateWR": 5,
      "avgWR": 12.1,
      "midScore": 35,
      "lateScore": 24.8,
      "avgScore": 29.9,
      "avgTime": 19.6,
      "avgDmg": 294,
      "avgHeal": 62,
      "avgWard": 0,
      "avgTaken": 290,
      "avgGold": 0,
      "survPct": 13,
      "liveRank": 23,
      "baseRank": 22,
      "rankDelta": -1,
      "baseScore": 53.3,
      "baseWR": 46.8,
      "scoreDelta": -23.4,
      "wrDelta": -34.7,
      "changeStatus": "rebal",
      "archetype": "Anti-Heal Necrosis Bell & Duplicity Disruptor",
      "useCase": "A tactical counter-pick specialist against healing/summoner encounters (Raiders, Necromancer, Brood Mother). Buffed HP (108), faster Bell attacks, and heavier Necrosis stacks ([4, 10, 16, 22]) let Saint shut down enemy recovery while Illusory Double absorbs lethal boss hits. Pair with Sir Dane or Velith and boost Charge with Staff of Power or Horn of Valhalla.",
      "changes": [
        {
          "type": "buff",
          "text": "Base HP buffed 96 → 108; Bell of Passing flat dmg 1 → 2 and faster interval 1.4s → 1.35s."
        },
        {
          "type": "buff",
          "text": "Toll the Dead Necrosis stacks buffed [0, 6, 12, 16] → [4, 10, 16, 22]."
        },
        {
          "type": "fix",
          "text": "Fixed double-scaled `u.dm²` heal bug on Nat 20 party heal (added `{ raw: 1 }`)."
        }
      ],
      "paths": {
        "key": "saint",
        "name": "Saint",
        "p0": {
          "k": "two_faced",
          "n": "Two-Faced",
          "wr": 10,
          "score": 30
        },
        "p1": {
          "k": "smoke_mirrors",
          "n": "Smoke & Mirrors",
          "wr": 10,
          "score": 28.2
        },
        "diff": 1.8,
        "winner": "Two-Faced"
      },
      "bestPartners": [
        {
          "partner": "dane",
          "name": "Sir Dane",
          "role": "Tank",
          "cls": "Paladin",
          "winRate": 50,
          "score": 48.3,
          "sharedKw": [],
          "lift": 21.9,
          "why": "Strong Support/Tank role synergy balancing frontline survivability with live burst tempo."
        },
        {
          "partner": "velith",
          "name": "Velith",
          "role": "Damage",
          "cls": "Rogue",
          "winRate": 0,
          "score": 32.7,
          "sharedKw": [],
          "lift": 6.3,
          "why": "Strong Support/Damage role synergy balancing frontline survivability with live burst tempo."
        },
        {
          "partner": "mother_laurel",
          "name": "Mother Laurel",
          "role": "Tank",
          "cls": "Paladin",
          "winRate": 25,
          "score": 31,
          "sharedKw": [],
          "lift": 4.6,
          "why": "Strong Support/Tank role synergy balancing frontline survivability with live burst tempo."
        },
        {
          "partner": "kaska",
          "name": "Kaska",
          "role": "Support",
          "cls": "Druid",
          "winRate": 0,
          "score": 28.5,
          "sharedKw": [],
          "lift": 2.1,
          "why": "High-tempo Support duo whose kits cover each other’s scaling curves through Act 3."
        }
      ],
      "bestItems": [
        {
          "item": "staff_power",
          "name": "Staff of Power",
          "rarity": 3,
          "cost": 7,
          "kwMatch": false,
          "winRate": 0,
          "score": 29.2,
          "lift": 8.4,
          "valPerGold": 1.2
        },
        {
          "item": "horn_valhalla",
          "name": "Horn of Valhalla",
          "rarity": 2,
          "cost": 5,
          "kwMatch": false,
          "winRate": 25,
          "score": 28.4,
          "lift": 7.6,
          "valPerGold": 1.52
        },
        {
          "item": "headband",
          "name": "Headband of Intellect",
          "rarity": 2,
          "cost": 5,
          "kwMatch": false,
          "winRate": 0,
          "score": 26,
          "lift": 5.2,
          "valPerGold": 1.04
        },
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 5,
          "kwMatch": false,
          "winRate": 0,
          "score": 25.9,
          "lift": 5.1,
          "valPerGold": 1.02
        }
      ],
      "bestValueItems": [
        {
          "item": "horn_valhalla",
          "name": "Horn of Valhalla",
          "rarity": 2,
          "cost": 5,
          "kwMatch": false,
          "winRate": 25,
          "score": 28.4,
          "lift": 7.6,
          "valPerGold": 1.52
        },
        {
          "item": "amulet_devout",
          "name": "Amulet of the Devout",
          "rarity": 1,
          "cost": 3,
          "kwMatch": true,
          "winRate": 0,
          "score": 24.8,
          "lift": 4,
          "valPerGold": 1.33
        },
        {
          "item": "staff_power",
          "name": "Staff of Power",
          "rarity": 3,
          "cost": 7,
          "kwMatch": false,
          "winRate": 0,
          "score": 29.2,
          "lift": 8.4,
          "valPerGold": 1.2
        }
      ]
    },
    "toot": {
      "key": "toot",
      "name": "Toot",
      "cls": "Bard",
      "role": "Support",
      "reach": "Ranged",
      "pack": 5,
      "packKey": "market",
      "nMid": 52,
      "nLate": 54,
      "midWR": 19.2,
      "lateWR": 7.4,
      "avgWR": 13.3,
      "midScore": 34,
      "lateScore": 24.4,
      "avgScore": 29.2,
      "avgTime": 18,
      "avgDmg": 155,
      "avgHeal": 0,
      "avgWard": 0,
      "avgTaken": 294,
      "avgGold": 5.94,
      "survPct": 7.5,
      "liveRank": 24,
      "baseRank": 23,
      "rankDelta": -1,
      "baseScore": 51.3,
      "baseWR": 46.4,
      "scoreDelta": -22.1,
      "wrDelta": -33.1,
      "changeStatus": "rebal",
      "archetype": "Economy Engine & Inspired Flourish Bard",
      "useCase": "Toot is a pure economy-and-tempo investment, not a raw combat stat-stick (lowest solo score at 29.2, yet drives the 80% WR Pack 5 Market Cartel full-run strat!). Early Tip Jar + Mote gold buys extra Tier upgrades and Very Rare items by Act 3, while spending Motes now triggers Inspired Flourish (+25% dmg & Haste). Pair with Gilthrax, Sir Dane, or Zoe.",
      "changes": [
        {
          "type": "buff",
          "text": "Benefits from new Inspired Flourish mechanic (+25% Damage & +25% Haste for 4.5s whenever an ally spends a Bardic Mote)."
        },
        {
          "type": "nerf",
          "text": "Combat Gold cap tightened 14g → 6g per fight so Pack 5 Greed stays strong without breaking the shop economy."
        }
      ],
      "paths": {
        "key": "toot",
        "name": "Toot",
        "p0": {
          "k": "busker",
          "n": "Busker’s Rhythm",
          "wr": 30,
          "score": 43.4
        },
        "p1": {
          "k": "street_performer",
          "n": "Street Performer",
          "wr": 20,
          "score": 38.1
        },
        "diff": 5.3,
        "winner": "Busker’s Rhythm"
      },
      "bestPartners": [
        {
          "partner": "gilthrax",
          "name": "Gilthrax",
          "role": "Tank",
          "cls": "Fighter",
          "winRate": 50,
          "score": 53.3,
          "sharedKw": [],
          "lift": 24.7,
          "why": "Pack 5 economy duo: Toot’s gold + Motes (Inspired Flourish) buy extra items that directly scale Gilthrax’s Hoard Scales."
        },
        {
          "partner": "dane",
          "name": "Sir Dane",
          "role": "Tank",
          "cls": "Paladin",
          "winRate": 50,
          "score": 42.2,
          "sharedKw": [],
          "lift": 13.7,
          "why": "Strong Support/Tank role synergy balancing frontline survivability with live burst tempo."
        },
        {
          "partner": "zoe",
          "name": "Zoe",
          "role": "Support",
          "cls": "Fighter",
          "winRate": 25,
          "score": 37.9,
          "sharedKw": [],
          "lift": 9.3,
          "why": "High-tempo Support duo whose kits cover each other’s scaling curves through Act 3."
        },
        {
          "partner": "arthur",
          "name": "Arthur",
          "role": "Damage",
          "cls": "Fighter",
          "winRate": 25,
          "score": 37.6,
          "sharedKw": [],
          "lift": 9.1,
          "why": "Strong Support/Damage role synergy balancing frontline survivability with live burst tempo."
        }
      ],
      "bestItems": [
        {
          "item": "robe_stars",
          "name": "Robe of Stars",
          "rarity": 3,
          "cost": 7,
          "kwMatch": false,
          "winRate": 25,
          "score": 38.5,
          "lift": 7.8,
          "valPerGold": 1.11
        },
        {
          "item": "horn_valhalla",
          "name": "Horn of Valhalla",
          "rarity": 2,
          "cost": 5,
          "kwMatch": true,
          "winRate": 25,
          "score": 35.9,
          "lift": 5.2,
          "valPerGold": 1.04
        },
        {
          "item": "ring_regeneration",
          "name": "Ring of Regeneration",
          "rarity": 3,
          "cost": 7,
          "kwMatch": false,
          "winRate": 25,
          "score": 35.2,
          "lift": 4.5,
          "valPerGold": 0.64
        },
        {
          "item": "headband",
          "name": "Headband of Intellect",
          "rarity": 2,
          "cost": 5,
          "kwMatch": false,
          "winRate": 25,
          "score": 33.8,
          "lift": 3.1,
          "valPerGold": 0.62
        }
      ],
      "bestValueItems": [
        {
          "item": "robe_stars",
          "name": "Robe of Stars",
          "rarity": 3,
          "cost": 7,
          "kwMatch": false,
          "winRate": 25,
          "score": 38.5,
          "lift": 7.8,
          "valPerGold": 1.11
        },
        {
          "item": "horn_valhalla",
          "name": "Horn of Valhalla",
          "rarity": 2,
          "cost": 5,
          "kwMatch": true,
          "winRate": 25,
          "score": 35.9,
          "lift": 5.2,
          "valPerGold": 1.04
        },
        {
          "item": "ring_regeneration",
          "name": "Ring of Regeneration",
          "rarity": 3,
          "cost": 7,
          "kwMatch": false,
          "winRate": 25,
          "score": 35.2,
          "lift": 4.5,
          "valPerGold": 0.64
        }
      ]
    }
  },
  "items": [
    {
      "key": "bracers_archery",
      "name": "Bracers of Archery",
      "rarity": "Uncommon",
      "r": 1,
      "price": 3,
      "kwHooks": [
        "hunters_mark"
      ],
      "bestDelta": 0.287,
      "valPerGold": 0.0956,
      "topCarriers": [
        {
          "hero": "lorcan",
          "name": "Lorcan",
          "lift": 14.7,
          "kwMatch": true
        },
        {
          "hero": "corvin",
          "name": "Corvin",
          "lift": 11.2,
          "kwMatch": true
        }
      ]
    },
    {
      "key": "pearl_power",
      "name": "Pearl of Power",
      "rarity": "Uncommon",
      "r": 1,
      "price": 3,
      "kwHooks": [
        "arcane_recovery"
      ],
      "bestDelta": 0.28,
      "valPerGold": 0.0932,
      "topCarriers": [
        {
          "hero": "gains",
          "name": "Gains",
          "lift": 21.8,
          "kwMatch": true
        },
        {
          "hero": "faelan",
          "name": "Faelan",
          "lift": 18.8,
          "kwMatch": true
        }
      ]
    },
    {
      "key": "longsword_p1",
      "name": "+1 Longsword",
      "rarity": "Common",
      "r": 0,
      "price": 2,
      "kwHooks": [],
      "bestDelta": 0.175,
      "valPerGold": 0.0874,
      "topCarriers": []
    },
    {
      "key": "wand_war_mage",
      "name": "Wand of the War Mage",
      "rarity": "Common",
      "r": 0,
      "price": 2,
      "kwHooks": [],
      "bestDelta": 0.163,
      "valPerGold": 0.0817,
      "topCarriers": []
    },
    {
      "key": "leather_armor",
      "name": "Leather Armor",
      "rarity": "Common",
      "r": 0,
      "price": 2,
      "kwHooks": [],
      "bestDelta": 0.153,
      "valPerGold": 0.0765,
      "topCarriers": []
    },
    {
      "key": "bloodwell_vial",
      "name": "Bloodwell Vial",
      "rarity": "Uncommon",
      "r": 1,
      "price": 3,
      "kwHooks": [
        "sorcery_points",
        "metamagic"
      ],
      "bestDelta": 0.223,
      "valPerGold": 0.0744,
      "topCarriers": [
        {
          "hero": "cinder",
          "name": "Cinder",
          "lift": 8.3,
          "kwMatch": true
        }
      ]
    },
    {
      "key": "cloak_elvenkind",
      "name": "Cloak of Elvenkind",
      "rarity": "Uncommon",
      "r": 1,
      "price": 3,
      "kwHooks": [
        "cunning_action",
        "sneak_attack"
      ],
      "bestDelta": 0.219,
      "valPerGold": 0.073,
      "topCarriers": [
        {
          "hero": "wallaby",
          "name": "Wallaby",
          "lift": 13.5,
          "kwMatch": true
        },
        {
          "hero": "velith",
          "name": "Velith",
          "lift": 3.1,
          "kwMatch": true
        },
        {
          "hero": "corvin",
          "name": "Corvin",
          "lift": 16.5,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "rapier_p1",
      "name": "+1 Rapier",
      "rarity": "Common",
      "r": 0,
      "price": 2,
      "kwHooks": [],
      "bestDelta": 0.131,
      "valPerGold": 0.0655,
      "topCarriers": []
    },
    {
      "key": "moon_sickle",
      "name": "Moon Sickle",
      "rarity": "Uncommon",
      "r": 1,
      "price": 3,
      "kwHooks": [
        "wild_shape"
      ],
      "bestDelta": 0.188,
      "valPerGold": 0.0628,
      "topCarriers": [
        {
          "hero": "kaska",
          "name": "Kaska",
          "lift": 30.3,
          "kwMatch": true
        },
        {
          "hero": "juniper",
          "name": "Juniper",
          "lift": 18.4,
          "kwMatch": true
        }
      ]
    },
    {
      "key": "weapon_warning",
      "name": "Weapon of Warning",
      "rarity": "Uncommon",
      "r": 1,
      "price": 3,
      "kwHooks": [
        "action_surge"
      ],
      "bestDelta": 0.179,
      "valPerGold": 0.0597,
      "topCarriers": [
        {
          "hero": "zoe",
          "name": "Zoe",
          "lift": 22.6,
          "kwMatch": true
        }
      ]
    },
    {
      "key": "shield",
      "name": "Shield",
      "rarity": "Common",
      "r": 0,
      "price": 2,
      "kwHooks": [],
      "bestDelta": 0.118,
      "valPerGold": 0.0591,
      "topCarriers": []
    },
    {
      "key": "staff_withering",
      "name": "Staff of Withering",
      "rarity": "Rare",
      "r": 2,
      "price": 5,
      "kwHooks": [
        "hex",
        "pact_boon"
      ],
      "bestDelta": 0.261,
      "valPerGold": 0.0522,
      "topCarriers": [
        {
          "hero": "nettle",
          "name": "Nettle",
          "lift": 9.7,
          "kwMatch": true
        }
      ]
    },
    {
      "key": "amulet_devout",
      "name": "Amulet of the Devout",
      "rarity": "Uncommon",
      "r": 1,
      "price": 3,
      "kwHooks": [
        "channel_divinity"
      ],
      "bestDelta": 0.148,
      "valPerGold": 0.0495,
      "topCarriers": [
        {
          "hero": "saint",
          "name": "Saint",
          "lift": 4,
          "kwMatch": true
        },
        {
          "hero": "lumen",
          "name": "Lumen",
          "lift": 0.6,
          "kwMatch": true
        },
        {
          "hero": "kaska",
          "name": "Kaska",
          "lift": 20.8,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "headband",
      "name": "Headband of Intellect",
      "rarity": "Rare",
      "r": 2,
      "price": 5,
      "kwHooks": [],
      "bestDelta": 0.236,
      "valPerGold": 0.0472,
      "topCarriers": [
        {
          "hero": "faelan",
          "name": "Faelan",
          "lift": 40.1,
          "kwMatch": false
        },
        {
          "hero": "zoe",
          "name": "Zoe",
          "lift": 28.7,
          "kwMatch": false
        },
        {
          "hero": "kaska",
          "name": "Kaska",
          "lift": 15.7,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "sentinel_shield",
      "name": "Sentinel Shield",
      "rarity": "Uncommon",
      "r": 1,
      "price": 3,
      "kwHooks": [
        "aura",
        "smite"
      ],
      "bestDelta": 0.137,
      "valPerGold": 0.0457,
      "topCarriers": [
        {
          "hero": "dane",
          "name": "Sir Dane",
          "lift": 4.1,
          "kwMatch": true
        },
        {
          "hero": "pillar",
          "name": "Pillar",
          "lift": 5.7,
          "kwMatch": false
        },
        {
          "hero": "gilthrax",
          "name": "Gilthrax",
          "lift": 1.7,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "breastplate",
      "name": "Breastplate",
      "rarity": "Uncommon",
      "r": 1,
      "price": 3,
      "kwHooks": [],
      "bestDelta": 0.124,
      "valPerGold": 0.0412,
      "topCarriers": []
    },
    {
      "key": "longbow_p1",
      "name": "+1 Longbow",
      "rarity": "Common",
      "r": 0,
      "price": 2,
      "kwHooks": [],
      "bestDelta": 0.08,
      "valPerGold": 0.04,
      "topCarriers": []
    },
    {
      "key": "dagger_venom",
      "name": "Dagger of Venom",
      "rarity": "Rare",
      "r": 2,
      "price": 5,
      "kwHooks": [
        "sneak_attack"
      ],
      "bestDelta": 0.199,
      "valPerGold": 0.0399,
      "topCarriers": [
        {
          "hero": "wallaby",
          "name": "Wallaby",
          "lift": 20.7,
          "kwMatch": true
        },
        {
          "hero": "velith",
          "name": "Velith",
          "lift": 9.3,
          "kwMatch": true
        },
        {
          "hero": "corvin",
          "name": "Corvin",
          "lift": 23.4,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "luckstone",
      "name": "Stone of Good Luck",
      "rarity": "Uncommon",
      "r": 1,
      "price": 3,
      "kwHooks": [],
      "bestDelta": 0.116,
      "valPerGold": 0.0386,
      "topCarriers": []
    },
    {
      "key": "staff_power",
      "name": "Staff of Power",
      "rarity": "Very Rare",
      "r": 3,
      "price": 7,
      "kwHooks": [
        "arcane_recovery"
      ],
      "bestDelta": 0.254,
      "valPerGold": 0.0362,
      "topCarriers": [
        {
          "hero": "faelan",
          "name": "Faelan",
          "lift": 50.2,
          "kwMatch": true
        },
        {
          "hero": "gains",
          "name": "Gains",
          "lift": 14.5,
          "kwMatch": true
        },
        {
          "hero": "kaska",
          "name": "Kaska",
          "lift": 34.5,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "bag_holding",
      "name": "Bag of Holding",
      "rarity": "Uncommon",
      "r": 1,
      "price": 3,
      "kwHooks": [],
      "bestDelta": 0.106,
      "valPerGold": 0.0353,
      "topCarriers": []
    },
    {
      "key": "staff_woodlands",
      "name": "Staff of the Woodlands",
      "rarity": "Very Rare",
      "r": 3,
      "price": 7,
      "kwHooks": [
        "wild_shape"
      ],
      "bestDelta": 0.235,
      "valPerGold": 0.0336,
      "topCarriers": [
        {
          "hero": "kaska",
          "name": "Kaska",
          "lift": 44.2,
          "kwMatch": true
        },
        {
          "hero": "juniper",
          "name": "Juniper",
          "lift": 17.9,
          "kwMatch": true
        },
        {
          "hero": "faelan",
          "name": "Faelan",
          "lift": 46.1,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "dragonhide_belt",
      "name": "Dragonhide Belt",
      "rarity": "Uncommon",
      "r": 1,
      "price": 3,
      "kwHooks": [
        "ki",
        "ki_ability"
      ],
      "bestDelta": 0.097,
      "valPerGold": 0.0324,
      "topCarriers": [
        {
          "hero": "naill",
          "name": "Naill",
          "lift": 9.7,
          "kwMatch": true
        }
      ]
    },
    {
      "key": "oathbow",
      "name": "Oathbow",
      "rarity": "Rare",
      "r": 2,
      "price": 5,
      "kwHooks": [
        "hunters_mark"
      ],
      "bestDelta": 0.157,
      "valPerGold": 0.0314,
      "topCarriers": [
        {
          "hero": "lorcan",
          "name": "Lorcan",
          "lift": 25.8,
          "kwMatch": true
        },
        {
          "hero": "corvin",
          "name": "Corvin",
          "lift": 3.9,
          "kwMatch": true
        },
        {
          "hero": "gains",
          "name": "Gains",
          "lift": 18.1,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "wand_fireballs",
      "name": "Wand of Fireballs",
      "rarity": "Rare",
      "r": 2,
      "price": 5,
      "kwHooks": [
        "metamagic",
        "sorcery_points"
      ],
      "bestDelta": 0.153,
      "valPerGold": 0.0307,
      "topCarriers": [
        {
          "hero": "cinder",
          "name": "Cinder",
          "lift": 2.5,
          "kwMatch": true
        },
        {
          "hero": "gains",
          "name": "Gains",
          "lift": 21.6,
          "kwMatch": false
        },
        {
          "hero": "lumen",
          "name": "Lumen",
          "lift": 17.8,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "boots_speed",
      "name": "Boots of Speed",
      "rarity": "Rare",
      "r": 2,
      "price": 5,
      "kwHooks": [],
      "bestDelta": 0.153,
      "valPerGold": 0.0305,
      "topCarriers": [
        {
          "hero": "gains",
          "name": "Gains",
          "lift": 27.4,
          "kwMatch": false
        },
        {
          "hero": "wallaby",
          "name": "Wallaby",
          "lift": 23.1,
          "kwMatch": false
        },
        {
          "hero": "corvin",
          "name": "Corvin",
          "lift": 19.7,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "staff_healing",
      "name": "Staff of Healing",
      "rarity": "Rare",
      "r": 2,
      "price": 5,
      "kwHooks": [
        "channel_divinity"
      ],
      "bestDelta": 0.142,
      "valPerGold": 0.0285,
      "topCarriers": [
        {
          "hero": "lumen",
          "name": "Lumen",
          "lift": 13.7,
          "kwMatch": true
        },
        {
          "hero": "saint",
          "name": "Saint",
          "lift": 5,
          "kwMatch": true
        },
        {
          "hero": "bram",
          "name": "Bram",
          "lift": 1.7,
          "kwMatch": true
        }
      ]
    },
    {
      "key": "amulet_health",
      "name": "Amulet of Health",
      "rarity": "Rare",
      "r": 2,
      "price": 5,
      "kwHooks": [],
      "bestDelta": 0.131,
      "valPerGold": 0.0262,
      "topCarriers": [
        {
          "hero": "wallaby",
          "name": "Wallaby",
          "lift": 22.1,
          "kwMatch": false
        },
        {
          "hero": "gilthrax",
          "name": "Gilthrax",
          "lift": 12.2,
          "kwMatch": false
        },
        {
          "hero": "mother_laurel",
          "name": "Mother Laurel",
          "lift": 10.6,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "berserker_axe",
      "name": "Berserker Axe",
      "rarity": "Rare",
      "r": 2,
      "price": 5,
      "kwHooks": [
        "rage"
      ],
      "bestDelta": 0.129,
      "valPerGold": 0.0258,
      "topCarriers": [
        {
          "hero": "zark",
          "name": "Zark",
          "lift": 5.6,
          "kwMatch": true
        },
        {
          "hero": "bram",
          "name": "Bram",
          "lift": 6.8,
          "kwMatch": false
        },
        {
          "hero": "mother_laurel",
          "name": "Mother Laurel",
          "lift": 2.3,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "plate_armor",
      "name": "Plate Armor",
      "rarity": "Rare",
      "r": 2,
      "price": 5,
      "kwHooks": [],
      "bestDelta": 0.129,
      "valPerGold": 0.0257,
      "topCarriers": [
        {
          "hero": "pillar",
          "name": "Pillar",
          "lift": 9.5,
          "kwMatch": false
        },
        {
          "hero": "gilthrax",
          "name": "Gilthrax",
          "lift": 4.5,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "flametongue",
      "name": "Flame Tongue",
      "rarity": "Rare",
      "r": 2,
      "price": 5,
      "kwHooks": [
        "action_surge"
      ],
      "bestDelta": 0.126,
      "valPerGold": 0.0252,
      "topCarriers": [
        {
          "hero": "zoe",
          "name": "Zoe",
          "lift": 13.2,
          "kwMatch": true
        },
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": 5.4,
          "kwMatch": true
        },
        {
          "hero": "gilthrax",
          "name": "Gilthrax",
          "lift": 3.2,
          "kwMatch": true
        }
      ]
    },
    {
      "key": "cloak_displacement",
      "name": "Cloak of Displacement",
      "rarity": "Rare",
      "r": 2,
      "price": 5,
      "kwHooks": [],
      "bestDelta": 0.116,
      "valPerGold": 0.0232,
      "topCarriers": [
        {
          "hero": "corvin",
          "name": "Corvin",
          "lift": 20.5,
          "kwMatch": false
        },
        {
          "hero": "wallaby",
          "name": "Wallaby",
          "lift": 15.8,
          "kwMatch": false
        },
        {
          "hero": "bram",
          "name": "Bram",
          "lift": 14.1,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "sunblade",
      "name": "Sun Blade",
      "rarity": "Very Rare",
      "r": 3,
      "price": 7,
      "kwHooks": [
        "smite",
        "aura"
      ],
      "bestDelta": 0.157,
      "valPerGold": 0.0225,
      "topCarriers": [
        {
          "hero": "dane",
          "name": "Sir Dane",
          "lift": 20,
          "kwMatch": true
        },
        {
          "hero": "mother_laurel",
          "name": "Mother Laurel",
          "lift": 10.3,
          "kwMatch": true
        },
        {
          "hero": "lorcan",
          "name": "Lorcan",
          "lift": 24.1,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "robe_stars",
      "name": "Robe of Stars",
      "rarity": "Very Rare",
      "r": 3,
      "price": 7,
      "kwHooks": [],
      "bestDelta": 0.152,
      "valPerGold": 0.0217,
      "topCarriers": [
        {
          "hero": "faelan",
          "name": "Faelan",
          "lift": 42.5,
          "kwMatch": false
        },
        {
          "hero": "gains",
          "name": "Gains",
          "lift": 22.4,
          "kwMatch": false
        },
        {
          "hero": "kaska",
          "name": "Kaska",
          "lift": 15.7,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "frost_brand",
      "name": "Frost Brand",
      "rarity": "Very Rare",
      "r": 3,
      "price": 7,
      "kwHooks": [],
      "bestDelta": 0.148,
      "valPerGold": 0.0211,
      "topCarriers": [
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": 23,
          "kwMatch": false
        },
        {
          "hero": "gains",
          "name": "Gains",
          "lift": 16.1,
          "kwMatch": false
        },
        {
          "hero": "wallaby",
          "name": "Wallaby",
          "lift": 14.3,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "staff_striking",
      "name": "Staff of Striking",
      "rarity": "Very Rare",
      "r": 3,
      "price": 7,
      "kwHooks": [
        "ki",
        "ki_ability"
      ],
      "bestDelta": 0.143,
      "valPerGold": 0.0204,
      "topCarriers": [
        {
          "hero": "naill",
          "name": "Naill",
          "lift": 12.2,
          "kwMatch": true
        }
      ]
    },
    {
      "key": "ring_spell_storing",
      "name": "Ring of Spell Storing",
      "rarity": "Rare",
      "r": 2,
      "price": 5,
      "kwHooks": [],
      "bestDelta": 0.096,
      "valPerGold": 0.0193,
      "topCarriers": [
        {
          "hero": "faelan",
          "name": "Faelan",
          "lift": 46.7,
          "kwMatch": false
        },
        {
          "hero": "zoe",
          "name": "Zoe",
          "lift": 31.6,
          "kwMatch": false
        },
        {
          "hero": "kaska",
          "name": "Kaska",
          "lift": 29.9,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "periapt_wound_closure",
      "name": "Periapt of Wound Closure",
      "rarity": "Uncommon",
      "r": 1,
      "price": 3,
      "kwHooks": [
        "rage"
      ],
      "bestDelta": 0.051,
      "valPerGold": 0.0169,
      "topCarriers": [
        {
          "hero": "zark",
          "name": "Zark",
          "lift": 5.7,
          "kwMatch": true
        }
      ]
    },
    {
      "key": "dwarven_plate",
      "name": "Dwarven Plate",
      "rarity": "Very Rare",
      "r": 3,
      "price": 7,
      "kwHooks": [],
      "bestDelta": 0.092,
      "valPerGold": 0.0131,
      "topCarriers": [
        {
          "hero": "wallaby",
          "name": "Wallaby",
          "lift": 23.7,
          "kwMatch": false
        },
        {
          "hero": "gilthrax",
          "name": "Gilthrax",
          "lift": 15.7,
          "kwMatch": false
        },
        {
          "hero": "bram",
          "name": "Bram",
          "lift": 10.1,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "pipes_haunting",
      "name": "Pipes of Haunting",
      "rarity": "Uncommon",
      "r": 1,
      "price": 3,
      "kwHooks": [
        "bardic_inspiration"
      ],
      "bestDelta": 0.032,
      "valPerGold": 0.0105,
      "topCarriers": [
        {
          "hero": "rosalind",
          "name": "Rosalind",
          "lift": 16.1,
          "kwMatch": true
        }
      ]
    },
    {
      "key": "horn_valhalla",
      "name": "Horn of Valhalla",
      "rarity": "Rare",
      "r": 2,
      "price": 5,
      "kwHooks": [
        "bardic_inspiration"
      ],
      "bestDelta": 0.03,
      "valPerGold": 0.006,
      "topCarriers": [
        {
          "hero": "rosalind",
          "name": "Rosalind",
          "lift": 16.6,
          "kwMatch": true
        },
        {
          "hero": "toot",
          "name": "Toot",
          "lift": 5.2,
          "kwMatch": true
        },
        {
          "hero": "zoe",
          "name": "Zoe",
          "lift": 18,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "scimitar_speed",
      "name": "Scimitar of Speed",
      "rarity": "Very Rare",
      "r": 3,
      "price": 7,
      "kwHooks": [],
      "bestDelta": 0.034,
      "valPerGold": 0.0048,
      "topCarriers": [
        {
          "hero": "gains",
          "name": "Gains",
          "lift": 28.5,
          "kwMatch": false
        },
        {
          "hero": "lumen",
          "name": "Lumen",
          "lift": 18.3,
          "kwMatch": false
        },
        {
          "hero": "lorcan",
          "name": "Lorcan",
          "lift": 11.9,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "potion_healing",
      "name": "Potion of Healing",
      "rarity": "Common",
      "r": 0,
      "price": 2,
      "kwHooks": [],
      "bestDelta": 0.009,
      "valPerGold": 0.0047,
      "topCarriers": [
        {
          "hero": "mother_laurel",
          "name": "Mother Laurel",
          "lift": 7.2,
          "kwMatch": false
        },
        {
          "hero": "pillar",
          "name": "Pillar",
          "lift": 6.3,
          "kwMatch": false
        },
        {
          "hero": "gilthrax",
          "name": "Gilthrax",
          "lift": 1.3,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "ring_regeneration",
      "name": "Ring of Regeneration",
      "rarity": "Very Rare",
      "r": 3,
      "price": 7,
      "kwHooks": [],
      "bestDelta": 0.024,
      "valPerGold": 0.0034,
      "topCarriers": [
        {
          "hero": "kaska",
          "name": "Kaska",
          "lift": 34.7,
          "kwMatch": false
        },
        {
          "hero": "gilthrax",
          "name": "Gilthrax",
          "lift": 31,
          "kwMatch": false
        },
        {
          "hero": "faelan",
          "name": "Faelan",
          "lift": 29.6,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "rod_pact_keeper",
      "name": "Rod of the Pact Keeper",
      "rarity": "Uncommon",
      "r": 1,
      "price": 3,
      "kwHooks": [
        "hex",
        "pact_boon"
      ],
      "bestDelta": 0.006,
      "valPerGold": 0.0019,
      "topCarriers": [
        {
          "hero": "nettle",
          "name": "Nettle",
          "lift": 0.7,
          "kwMatch": true
        }
      ]
    },
    {
      "key": "clockwork_amulet",
      "name": "Clockwork Amulet",
      "rarity": "Common",
      "r": 0,
      "price": 2,
      "kwHooks": [],
      "bestDelta": -0.003,
      "valPerGold": -0.0015,
      "topCarriers": []
    }
  ],
  "comps": [
    {
      "id": "wild_shape_pack",
      "name": "Wild Shape Moon & Land",
      "heroes": [
        "mother_laurel",
        "kaska",
        "juniper",
        "corvin"
      ],
      "paths": {
        "mother_laurel": "bountiful_vines",
        "kaska": "pack_hunt",
        "juniper": "land",
        "corvin": "stalker_flurry"
      },
      "items": {
        "mother_laurel": [
          "sunblade"
        ],
        "kaska": [
          "moon_sickle"
        ],
        "juniper": [
          "staff_woodlands"
        ],
        "corvin": [
          "bracers_archery"
        ]
      },
      "winRate": 100,
      "avgScore": 93.9,
      "avgTime": 21.2,
      "avgGold": 0
    },
    {
      "id": "arcane_battery",
      "name": "Arcane Recovery Battery",
      "heroes": [
        "gilthrax",
        "gains",
        "faelan",
        "zoe"
      ],
      "paths": {
        "gilthrax": "gilded_hoard",
        "gains": "liquid_assets",
        "faelan": "battery",
        "zoe": "rune_carver"
      },
      "items": {
        "gilthrax": [
          "plate_armor"
        ],
        "gains": [
          "staff_power"
        ],
        "faelan": [
          "pearl_power"
        ],
        "zoe": [
          "headband"
        ]
      },
      "winRate": 91.7,
      "avgScore": 88,
      "avgTime": 32.4,
      "avgGold": 6.6
    },
    {
      "id": "action_surge_blitz",
      "name": "Action Surge Blitz",
      "heroes": [
        "gilthrax",
        "arthur",
        "zoe",
        "faelan"
      ],
      "paths": {
        "gilthrax": "bodyguard_fee",
        "arthur": "initiative",
        "zoe": "just_the_thing",
        "faelan": "battery"
      },
      "items": {
        "gilthrax": [
          "weapon_warning"
        ],
        "arthur": [
          "flametongue",
          "boots_speed"
        ],
        "zoe": [
          "ring_spell_storing"
        ],
        "faelan": [
          "pearl_power"
        ]
      },
      "winRate": 66.7,
      "avgScore": 64.1,
      "avgTime": 28,
      "avgGold": 2.3
    },
    {
      "id": "campfire_bonds",
      "name": "Pack 2 Campfire Bonds",
      "heroes": [
        "dane",
        "lorcan",
        "juniper",
        "rosalind"
      ],
      "paths": {
        "dane": "devotion",
        "lorcan": "colossus",
        "juniper": "overgrowth",
        "rosalind": "passround"
      },
      "items": {
        "dane": [
          "sentinel_shield"
        ],
        "lorcan": [
          "oathbow"
        ],
        "juniper": [
          "staff_woodlands"
        ],
        "rosalind": [
          "horn_valhalla"
        ]
      },
      "winRate": 33.3,
      "avgScore": 42.7,
      "avgTime": 22.1,
      "avgGold": 0
    },
    {
      "id": "shadow_ambush",
      "name": "Surprise Round Ambush",
      "heroes": [
        "kaska",
        "velith",
        "wallaby",
        "saint"
      ],
      "paths": {
        "kaska": "pack_hunt",
        "velith": "deaths_ledger",
        "wallaby": "slippery",
        "saint": "smoke_mirrors"
      },
      "items": {
        "kaska": [
          "moon_sickle"
        ],
        "velith": [
          "dagger_venom",
          "cloak_elvenkind"
        ],
        "wallaby": [
          "boots_speed"
        ],
        "saint": [
          "amulet_devout"
        ]
      },
      "winRate": 25,
      "avgScore": 42.5,
      "avgTime": 21.8,
      "avgGold": 0
    },
    {
      "id": "poison_root_control",
      "name": "Poison & Root Control",
      "heroes": [
        "mother_laurel",
        "velith",
        "juniper",
        "nettle"
      ],
      "paths": {
        "mother_laurel": "bountiful_vines",
        "velith": "nightshade",
        "juniper": "overgrowth",
        "nettle": "fineprint"
      },
      "items": {
        "mother_laurel": [
          "sentinel_shield"
        ],
        "velith": [
          "dagger_venom"
        ],
        "juniper": [
          "staff_woodlands"
        ],
        "nettle": [
          "staff_withering"
        ]
      },
      "winRate": 33.3,
      "avgScore": 42.1,
      "avgTime": 12.9,
      "avgGold": 0
    },
    {
      "id": "gold_greed",
      "name": "Pack 5 Market Cartel",
      "heroes": [
        "gilthrax",
        "gains",
        "zoe",
        "toot"
      ],
      "paths": {
        "gilthrax": "gilded_hoard",
        "gains": "compound_interest",
        "zoe": "rune_carver",
        "toot": "busker"
      },
      "items": {
        "gilthrax": [
          "plate_armor"
        ],
        "gains": [
          "staff_power"
        ],
        "zoe": [
          "bag_holding"
        ],
        "toot": [
          "horn_valhalla"
        ]
      },
      "winRate": 16.7,
      "avgScore": 34.6,
      "avgTime": 20.2,
      "avgGold": 9.1
    },
    {
      "id": "cinder_wildfire",
      "name": "Wildfire Burn Engine",
      "heroes": [
        "zark",
        "cinder",
        "lumen",
        "rosalind"
      ],
      "paths": {
        "zark": "totemroar",
        "cinder": "wildfire",
        "lumen": "purifying",
        "rosalind": "encore"
      },
      "items": {
        "zark": [
          "periapt_wound_closure"
        ],
        "cinder": [
          "bloodwell_vial",
          "wand_fireballs"
        ],
        "lumen": [
          "amulet_devout"
        ],
        "rosalind": [
          "pipes_haunting"
        ]
      },
      "winRate": 16.7,
      "avgScore": 34.2,
      "avgTime": 12.9,
      "avgGold": 0
    },
    {
      "id": "hex_necrosis",
      "name": "Hex & Necrosis Rot",
      "heroes": [
        "pillar",
        "velith",
        "saint",
        "nettle"
      ],
      "paths": {
        "pillar": "beacon",
        "velith": "nightshade",
        "saint": "two_faced",
        "nettle": "bargain"
      },
      "items": {
        "pillar": [
          "dwarven_plate"
        ],
        "velith": [
          "dagger_venom"
        ],
        "saint": [
          "amulet_devout"
        ],
        "nettle": [
          "rod_pact_keeper",
          "staff_withering"
        ]
      },
      "winRate": 16.7,
      "avgScore": 31.7,
      "avgTime": 16.9,
      "avgGold": 0
    },
    {
      "id": "hunters_volley",
      "name": "Hunter’s Mark Volley",
      "heroes": [
        "dane",
        "lorcan",
        "corvin",
        "rosalind"
      ],
      "paths": {
        "dane": "calltoarms",
        "lorcan": "trophies",
        "corvin": "first_strike",
        "rosalind": "passround"
      },
      "items": {
        "dane": [
          "sentinel_shield"
        ],
        "lorcan": [
          "oathbow",
          "bracers_archery"
        ],
        "corvin": [
          "cloak_elvenkind"
        ],
        "rosalind": [
          "horn_valhalla"
        ]
      },
      "winRate": 16.7,
      "avgScore": 30.5,
      "avgTime": 13,
      "avgGold": 0
    },
    {
      "id": "bardic_inspire",
      "name": "Double Bard Inspiration",
      "heroes": [
        "dane",
        "cinder",
        "rosalind",
        "toot"
      ],
      "paths": {
        "dane": "devotion",
        "cinder": "wildfire",
        "rosalind": "passround",
        "toot": "street_performer"
      },
      "items": {
        "dane": [
          "sunblade"
        ],
        "cinder": [
          "wand_fireballs"
        ],
        "rosalind": [
          "pipes_haunting"
        ],
        "toot": [
          "horn_valhalla"
        ]
      },
      "winRate": 8.3,
      "avgScore": 23.2,
      "avgTime": 11.9,
      "avgGold": 6
    },
    {
      "id": "beaten_path",
      "name": "Pack 3 Off the Beaten Path",
      "heroes": [
        "zark",
        "cinder",
        "naill",
        "nettle"
      ],
      "paths": {
        "zark": "relentless",
        "cinder": "draconic",
        "naill": "openhand",
        "nettle": "fineprint"
      },
      "items": {
        "zark": [
          "berserker_axe"
        ],
        "cinder": [
          "bloodwell_vial"
        ],
        "naill": [
          "dragonhide_belt"
        ],
        "nettle": [
          "rod_pact_keeper"
        ]
      },
      "winRate": 0,
      "avgScore": 20.7,
      "avgTime": 10.9,
      "avgGold": 0
    },
    {
      "id": "tavern_starters",
      "name": "Pack 1 Tavern Classics",
      "heroes": [
        "bram",
        "arthur",
        "wallaby",
        "faelan"
      ],
      "paths": {
        "bram": "disciple",
        "arthur": "vigilance",
        "wallaby": "slippery",
        "faelan": "projected"
      },
      "items": {
        "bram": [
          "plate_armor"
        ],
        "arthur": [
          "flametongue"
        ],
        "wallaby": [
          "cloak_elvenkind"
        ],
        "faelan": [
          "pearl_power"
        ]
      },
      "winRate": 0,
      "avgScore": 19.2,
      "avgTime": 23,
      "avgGold": 0.2
    },
    {
      "id": "ki_flurry",
      "name": "Ki On-Hit Flurry",
      "heroes": [
        "dane",
        "naill",
        "lorcan",
        "rosalind"
      ],
      "paths": {
        "dane": "calltoarms",
        "naill": "openhand",
        "lorcan": "colossus",
        "rosalind": "encore"
      },
      "items": {
        "dane": [
          "sentinel_shield"
        ],
        "naill": [
          "dragonhide_belt",
          "staff_striking"
        ],
        "lorcan": [
          "oathbow"
        ],
        "rosalind": [
          "pipes_haunting"
        ]
      },
      "winRate": 0,
      "avgScore": 17.2,
      "avgTime": 10.9,
      "avgGold": 0
    },
    {
      "id": "rage_bruisers",
      "name": "Double Rage Bruisers",
      "heroes": [
        "zark",
        "pillar",
        "arthur",
        "jamison"
      ],
      "paths": {
        "zark": "relentless",
        "pillar": "unstoppable",
        "arthur": "vigilance",
        "jamison": "good_vibes"
      },
      "items": {
        "zark": [
          "berserker_axe",
          "periapt_wound_closure"
        ],
        "pillar": [
          "amulet_health"
        ],
        "arthur": [
          "flametongue"
        ],
        "jamison": [
          "staff_healing"
        ]
      },
      "winRate": 0,
      "avgScore": 16.8,
      "avgTime": 17,
      "avgGold": 0
    },
    {
      "id": "divine_radiance",
      "name": "Divine Channel Radiance",
      "heroes": [
        "bram",
        "mother_laurel",
        "lumen",
        "jamison"
      ],
      "paths": {
        "bram": "disciple",
        "mother_laurel": "ancients_ward",
        "lumen": "judgement",
        "jamison": "peace_radiance"
      },
      "items": {
        "bram": [
          "plate_armor"
        ],
        "mother_laurel": [
          "sentinel_shield"
        ],
        "lumen": [
          "amulet_devout"
        ],
        "jamison": [
          "staff_healing"
        ]
      },
      "winRate": 0,
      "avgScore": 14.5,
      "avgTime": 15.1,
      "avgGold": 0
    }
  ],
  "bots": [
    {
      "id": "casual",
      "label": "Casual / Naive (Random)",
      "beforeWR": 68,
      "liveWR": 8,
      "piggyBreak": 96,
      "avgGold": 107,
      "avgWins": 9.2
    },
    {
      "id": "noitems",
      "label": "Tier-Only (Zero Items Ever)",
      "beforeWR": 68,
      "liveWR": 8,
      "piggyBreak": 96,
      "avgGold": 100,
      "avgWins": 10.2
    },
    {
      "id": "competent",
      "label": "Competent (Tiers + Smart Items)",
      "beforeWR": 92,
      "liveWR": 56,
      "piggyBreak": 52,
      "avgGold": 136,
      "avgWins": 10.9
    },
    {
      "id": "synergy",
      "label": "Synergy & Keyword Optimizer",
      "beforeWR": 100,
      "liveWR": 52,
      "piggyBreak": 68,
      "avgGold": 138,
      "avgWins": 11
    },
    {
      "id": "greed",
      "label": "Pack 5 Economy / Greed",
      "beforeWR": 100,
      "liveWR": 80,
      "piggyBreak": 40,
      "avgGold": 164,
      "avgWins": 11.6
    }
  ],
  "globalChanges": {
    "combat": [
      {
        "type": "buff",
        "tag": "Damage +12%",
        "text": "All Damage-role heroes receive +12% base damage scaling (`u.dm × 1.12`) so offensive carries compete with sustain."
      },
      {
        "type": "buff",
        "tag": "Hunter’s Mark",
        "text": "Marked enemies now take +22% damage from the entire party, and Ranger bonus damage buffed 1d6+WIS → 1d10+WIS."
      },
      {
        "type": "buff",
        "tag": "Inspired Flourish",
        "text": "Spending Bardic Inspiration (Rosalind or Toot) now grants +25% Damage & +25% Haste for 4.5s (CHA-scaled)."
      },
      {
        "type": "buff",
        "tag": "Sneak Attack & Fire",
        "text": "Passive Sneak Attack gains +1 bonus d6; Fire element Burn accumulation boosted 45% → 55%."
      },
      {
        "type": "nerf",
        "tag": "Overtime 28s",
        "text": "Overtime begins at 28s (was 40s), stepping every 5s: Heal & Ward effectiveness decay −15% per stack (up to −60%) to end infinite stall comps."
      },
      {
        "type": "fix",
        "tag": "7 Heal Bugfixes",
        "text": "Fixed 7 double-scaled `u.dm²` heals missing `{ raw: 1 }` (Mother Laurel, Kaska, Jamison, Saint, Lumen, Pillar, Zoe) plus Faelan’s duplicate Ward counter."
      }
    ],
    "enemy": [
      {
        "type": "buff",
        "tag": "Enemy Curve",
        "text": "Scaling buffed across all 3 Acts: `CURVE.grow` 1.21 → 1.225, `CURVE.dmgGrow` 1.22 → 1.28, `ease` [0.56..1.24] → [0.95..1.46], opening fight `d=1` eased penalty removed (.75/.70 → .96/.95)."
      },
      {
        "type": "buff",
        "tag": "Bosses & Elites",
        "text": "Act Boss depths raised [7.5, 12.0, 15.8] → [8.2, 13.0, 17.5]; Elites raised +1.3 depth & 1.26× scaling; War Band (`orcs`) threat mult buffed 0.81 → 0.96, Owlbear 0.80 → 0.87, Brood Mother 0.73 → 0.78."
      },
      {
        "type": "nerf",
        "tag": "Shop Economy",
        "text": "Win gold tightened `6+d/4 → 5+d/5`, Hero prices `[3,5,8,12] → [3,6,9,13]`, Elite bonus 4g → 3g, Campfire Forage 6g → 4g, and Pack 5 combat gold caps tightened (6g–8g)."
      }
    ]
  }
};
