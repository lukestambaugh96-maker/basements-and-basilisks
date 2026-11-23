/* Auto-generated v0.24 live meta telemetry & changelog for tools/wiki.html */
window.WIKI_META = {
  "version": "0.24 Live Build",
  "generatedAt": "2026-11-23",
  "heroes": {
    "gilthrax": {
      "key": "gilthrax",
      "name": "Gilthrax",
      "role": "Tank",
      "cls": "Fighter",
      "avgScore": 48.2,
      "avgWR": 40,
      "midWR": 100,
      "lateWR": 0,
      "avgDmg": 929,
      "avgHeal": 0,
      "avgWard": 998,
      "avgGold": 0.4,
      "survPct": 40,
      "avgTime": 19.8,
      "liveRank": 1,
      "baseRank": 5,
      "rankDelta": 4,
      "baseScore": 43.5,
      "scoreDelta": 4.7,
      "changeStatus": "rebal",
      "archetype": "Item-Value Ward Tank & Gold Dragon Fire-Breath Fighter",
      "useCase": "Hoard-scaled Dragonborn tank whose Arcane Shield scales directly with the **gold value/rarity** of his equipped items! When his Ward breaks, he triggers `Action Surge` to breathe **Gold Dragon Fire + Burn** across enemies equal to absorbed damage.",
      "changes": [
        {
          "type": "rebal",
          "text": "Reworked Ward scaling to item gold value/rarity; broken Ward triggers Action Surge Gold Dragon Fire Breath."
        },
        {
          "type": "rebal",
          "text": "Bridges Pack 5 economy with `Action Surge` partners (Zoe, Arthur) and Burn allies (Cinder, Lumen)."
        }
      ],
      "paths": {
        "key": "gilthrax",
        "p0": {
          "k": "gilded_hoard",
          "n": "Gilded Hoard",
          "score": 45,
          "wr": 40
        },
        "p1": {
          "k": "bodyguard_fee",
          "n": "Bodyguard’s Fee",
          "score": 44.5,
          "wr": 40
        },
        "winner": "Even"
      },
      "bestPartners": [
        {
          "partner": "faelan",
          "name": "Faelan",
          "sharedKw": [],
          "score": 33.3,
          "winRate": 0,
          "lift": -13.4,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "arthur",
          "name": "Arthur",
          "sharedKw": [
            "action_surge"
          ],
          "score": 18.6,
          "winRate": 0,
          "lift": -27.4,
          "why": "Shared action surge Class Keyword engine chains triggers across both kits."
        },
        {
          "partner": "wallaby",
          "name": "Wallaby",
          "sharedKw": [],
          "score": 18.3,
          "winRate": 0,
          "lift": -26.2,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "zoe",
          "name": "Zoe",
          "sharedKw": [
            "action_surge"
          ],
          "score": 12.8,
          "winRate": 0,
          "lift": -29.4,
          "why": "Shared action surge Class Keyword engine chains triggers across both kits."
        }
      ],
      "bestItems": [
        {
          "item": "boots_speed",
          "name": "Boots of Speed",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 14.3,
          "lift": 5.7,
          "valPerGold": 0.95
        },
        {
          "item": "weapon_warning",
          "name": "Weapon of Warning",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 11.8,
          "lift": 3.2,
          "valPerGold": 0.46
        },
        {
          "item": "sword_sharpness",
          "name": "Sword of Sharpness",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 12.1,
          "lift": 3.5,
          "valPerGold": 0.58
        },
        {
          "item": "flame_tongue",
          "name": "Flame Tongue",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 9.6,
          "lift": 1,
          "valPerGold": 0.14
        }
      ],
      "bestValueItems": [
        {
          "item": "boots_speed",
          "name": "Boots of Speed",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 14.3,
          "lift": 5.7,
          "valPerGold": 0.95
        },
        {
          "item": "sword_sharpness",
          "name": "Sword of Sharpness",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 12.1,
          "lift": 3.5,
          "valPerGold": 0.58
        },
        {
          "item": "weapon_warning",
          "name": "Weapon of Warning",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 11.8,
          "lift": 3.2,
          "valPerGold": 0.46
        }
      ]
    },
    "velith": {
      "key": "velith",
      "name": "Velith",
      "role": "Damage",
      "cls": "Rogue",
      "avgScore": 48.1,
      "avgWR": 40,
      "midWR": 100,
      "lateWR": 0,
      "avgDmg": 818,
      "avgHeal": 0,
      "avgWard": 0,
      "avgGold": 0.6,
      "survPct": 40,
      "avgTime": 20.5,
      "liveRank": 2,
      "baseRank": 2,
      "rankDelta": 0,
      "baseScore": 47.5,
      "scoreDelta": 0.6,
      "changeStatus": "buff",
      "archetype": "Stealth Ambush Assassin & Nightshade Poison Finisher",
      "useCase": "Premier melee Rogue assassin who opens from Stealth with devastating Sneak Attacks and Nightshade Poison stacks that melt high-AC Act 2–3 bosses. Pair with Corvin (`Hunter’s Mark`) or Kaska (`Exposed`) and equip Evasion + Poison gear.",
      "changes": [
        {
          "type": "buff",
          "text": "Unified under `Sneak Attack` with Poison & Exposed scaling that bypasses high-AC bosses cleanly."
        },
        {
          "type": "rebal",
          "text": "Clean 1-line Specializations (`Nightshade` / `Shadowstep`) and opt-in Quest."
        }
      ],
      "paths": {
        "key": "velith",
        "p0": {
          "k": "first_blood",
          "n": "First Blood",
          "score": 44.7,
          "wr": 40
        },
        "p1": {
          "k": "nightshade",
          "n": "Nightshade Vials",
          "score": 43.8,
          "wr": 40
        },
        "winner": "Even"
      },
      "bestPartners": [
        {
          "partner": "faelan",
          "name": "Faelan",
          "sharedKw": [],
          "score": 41.9,
          "winRate": 50,
          "lift": -4.7,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "wallaby",
          "name": "Wallaby",
          "sharedKw": [
            "sneak_attack"
          ],
          "score": 9.9,
          "winRate": 0,
          "lift": -34.5,
          "why": "Shared sneak attack Class Keyword engine chains triggers across both kits."
        },
        {
          "partner": "bram",
          "name": "Bram",
          "sharedKw": [],
          "score": 8.9,
          "winRate": 0,
          "lift": -37,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "dane",
          "name": "Sir Dane",
          "sharedKw": [],
          "score": 8.6,
          "winRate": 0,
          "lift": -33.8,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        }
      ],
      "bestItems": [
        {
          "item": "dagger_venom",
          "name": "Dagger of Venom",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 6.4,
          "lift": 1.3,
          "valPerGold": 0.19
        },
        {
          "item": "cloak_elvenkind",
          "name": "Cloak of Elvenkind",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 5.4,
          "lift": 0.3,
          "valPerGold": 0.04
        },
        {
          "item": "ring_protection",
          "name": "Ring of Protection",
          "rarity": 1,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 6,
          "lift": 0.9,
          "valPerGold": 0.23
        },
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 5.2,
          "lift": 0.1,
          "valPerGold": 0.02
        }
      ],
      "bestValueItems": [
        {
          "item": "ring_protection",
          "name": "Ring of Protection",
          "rarity": 1,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 6,
          "lift": 0.9,
          "valPerGold": 0.23
        },
        {
          "item": "dagger_venom",
          "name": "Dagger of Venom",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 6.4,
          "lift": 1.3,
          "valPerGold": 0.19
        },
        {
          "item": "cloak_elvenkind",
          "name": "Cloak of Elvenkind",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 5.4,
          "lift": 0.3,
          "valPerGold": 0.04
        }
      ]
    },
    "kaska": {
      "key": "kaska",
      "name": "Kaska",
      "role": "Support",
      "cls": "Druid",
      "avgScore": 46.9,
      "avgWR": 40,
      "midWR": 100,
      "lateWR": 0,
      "avgDmg": 212,
      "avgHeal": 111,
      "avgWard": 0,
      "avgGold": 0.3,
      "survPct": 40,
      "avgTime": 16.3,
      "liveRank": 3,
      "baseRank": 4,
      "rankDelta": 1,
      "baseScore": 43.6,
      "scoreDelta": 3.3,
      "changeStatus": "rebal",
      "archetype": "Wild Shape Panther Bruiser & Pack Hunt Support",
      "useCase": "Agile Moon Druid skirmisher who pounces into the fray in Panther Form, spreads `Exposed`, and sustains aggressive melee squads via `Pack Hunt`. Bridges seamlessly with Juniper, Mother Laurel, Velith, and Zark.",
      "changes": [
        {
          "type": "rebal",
          "text": "Unified under `Wild Shape` with balanced Panther Beast HP and Pack Hunt sustain."
        },
        {
          "type": "rebal",
          "text": "Clean 1-line Specializations (`Lunar Resilience` / `Pack Hunt`) and opt-in Quest."
        }
      ],
      "paths": {
        "key": "kaska",
        "p0": {
          "k": "lunar_resilience",
          "n": "Lunar Resilience",
          "score": 41.7,
          "wr": 40
        },
        "p1": {
          "k": "pack_hunt",
          "n": "Pack Hunt",
          "score": 44.3,
          "wr": 40
        },
        "winner": "Pack Hunt"
      },
      "bestPartners": [
        {
          "partner": "juniper",
          "name": "Juniper",
          "sharedKw": [
            "wild_shape"
          ],
          "score": 16.7,
          "winRate": 0,
          "lift": -26.3,
          "why": "Shared wild shape Class Keyword engine chains triggers across both kits."
        },
        {
          "partner": "wallaby",
          "name": "Wallaby",
          "sharedKw": [],
          "score": 10.1,
          "winRate": 0,
          "lift": -33.7,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "bram",
          "name": "Bram",
          "sharedKw": [],
          "score": 9.8,
          "winRate": 0,
          "lift": -35.5,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "arthur",
          "name": "Arthur",
          "sharedKw": [],
          "score": 9.5,
          "winRate": 0,
          "lift": -35.8,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        }
      ],
      "bestItems": [
        {
          "item": "staff_woodlands",
          "name": "Staff of the Woodlands",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 5.2,
          "lift": 0.2,
          "valPerGold": 0.03
        },
        {
          "item": "moon_sickle",
          "name": "Moon Sickle",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 5,
          "lift": 0,
          "valPerGold": 0
        },
        {
          "item": "boots_speed",
          "name": "Boots of Speed",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 5.2,
          "lift": 0.2,
          "valPerGold": 0.03
        },
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 4.7,
          "lift": -0.3,
          "valPerGold": -0.05
        }
      ],
      "bestValueItems": [
        {
          "item": "staff_woodlands",
          "name": "Staff of the Woodlands",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 5.2,
          "lift": 0.2,
          "valPerGold": 0.03
        },
        {
          "item": "boots_speed",
          "name": "Boots of Speed",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 5.2,
          "lift": 0.2,
          "valPerGold": 0.03
        },
        {
          "item": "moon_sickle",
          "name": "Moon Sickle",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 5,
          "lift": 0,
          "valPerGold": 0
        }
      ]
    },
    "naill": {
      "key": "naill",
      "name": "Naill",
      "role": "Damage",
      "cls": "Monk",
      "avgScore": 46.3,
      "avgWR": 40,
      "midWR": 100,
      "lateWR": 0,
      "avgDmg": 471,
      "avgHeal": 0,
      "avgWard": 0,
      "avgGold": 0.3,
      "survPct": 40,
      "avgTime": 19.9,
      "liveRank": 4,
      "baseRank": 9,
      "rankDelta": 5,
      "baseScore": 40.6,
      "scoreDelta": 5.7,
      "changeStatus": "buff",
      "archetype": "Rapid Multi-Hit Ki Bruiser & Stagger Disrupter",
      "useCase": "Lightning-fast melee Monk who racks up 4-pip Ki combos and procs Hunter’s Mark / Hex / on-hit weapons faster than anyone else in the cast. Pair with Corvin, Lorcan, or Nettle, and gear him with Evasion + DEX speed items.",
      "changes": [
        {
          "type": "buff",
          "text": "Unified under canonical `Ki` keyword with clean Evasion + Stagger tempo."
        },
        {
          "type": "rebal",
          "text": "1-line Specializations (`Open Hand` / `Drunken Sway` +Evasion) and opt-in Quest."
        }
      ],
      "paths": {
        "key": "naill",
        "p0": {
          "k": "open_hand",
          "n": "Open Hand",
          "score": 41.9,
          "wr": 40
        },
        "p1": {
          "k": "flowing_leaves",
          "n": "Flowing Leaves",
          "score": 42.1,
          "wr": 40
        },
        "winner": "Even"
      },
      "bestPartners": [
        {
          "partner": "faelan",
          "name": "Faelan",
          "sharedKw": [],
          "score": 15.6,
          "winRate": 0,
          "lift": -30.1,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "juniper",
          "name": "Juniper",
          "sharedKw": [],
          "score": 10.1,
          "winRate": 0,
          "lift": -32.6,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "bram",
          "name": "Bram",
          "sharedKw": [],
          "score": 9.7,
          "winRate": 0,
          "lift": -35.3,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "dane",
          "name": "Sir Dane",
          "sharedKw": [],
          "score": 8.7,
          "winRate": 0,
          "lift": -32.8,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        }
      ],
      "bestItems": [
        {
          "item": "boots_speed",
          "name": "Boots of Speed",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 7.4,
          "lift": 3.1,
          "valPerGold": 0.52
        },
        {
          "item": "staff_striking",
          "name": "Staff of Striking",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 5,
          "lift": 0.7,
          "valPerGold": 0.1
        },
        {
          "item": "dragonhide_belt",
          "name": "Dragonhide Belt",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 4.6,
          "lift": 0.3,
          "valPerGold": 0.04
        },
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 6.1,
          "lift": 1.8,
          "valPerGold": 0.3
        }
      ],
      "bestValueItems": [
        {
          "item": "boots_speed",
          "name": "Boots of Speed",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 7.4,
          "lift": 3.1,
          "valPerGold": 0.52
        },
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 6.1,
          "lift": 1.8,
          "valPerGold": 0.3
        },
        {
          "item": "staff_striking",
          "name": "Staff of Striking",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 5,
          "lift": 0.7,
          "valPerGold": 0.1
        }
      ]
    },
    "lorcan": {
      "key": "lorcan",
      "name": "Lorcan",
      "role": "Damage",
      "cls": "Ranger",
      "avgScore": 45.8,
      "avgWR": 40,
      "midWR": 100,
      "lateWR": 0,
      "avgDmg": 453,
      "avgHeal": 0,
      "avgWard": 0,
      "avgGold": 0,
      "survPct": 40,
      "avgTime": 19.2,
      "liveRank": 5,
      "baseRank": 18,
      "rankDelta": 13,
      "baseScore": 32.9,
      "scoreDelta": 12.9,
      "changeStatus": "buff",
      "archetype": "Hunter’s Mark Boss-Melter & Ranged On-Hit Carry",
      "useCase": "Your premier single-target boss shredder. Lorcan applies Hunter’s Mark (+1d4 bonus damage from EVERY allied hit) and stacks Colossus Slayer / on-hit procs—pair him with rapid-hit allies (Naill, Corvin, Arthur) and grab Hunter’s Mark Curio Uniques or Oathbow.",
      "changes": [
        {
          "type": "buff",
          "text": "Hunter’s Mark unified across Rangers: marked foes take stacking +1d4 bonus damage from every hit."
        },
        {
          "type": "rebal",
          "text": "Streamlined 1-line Specializations (`Colossus Slayer` vs `Volley Master`) and opt-in Trophy Hunter Quest."
        }
      ],
      "paths": {
        "key": "lorcan",
        "p0": {
          "k": "colossus_slayer",
          "n": "Colossus Slayer",
          "score": 44.6,
          "wr": 40
        },
        "p1": {
          "k": "pack_hunter",
          "n": "Pack Hunter",
          "score": 39,
          "wr": 40
        },
        "winner": "Colossus Slayer"
      },
      "bestPartners": [
        {
          "partner": "faelan",
          "name": "Faelan",
          "sharedKw": [],
          "score": 43.2,
          "winRate": 50,
          "lift": -2.3,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "corvin",
          "name": "Corvin",
          "sharedKw": [
            "hunters_mark"
          ],
          "score": 6.2,
          "winRate": 0,
          "lift": -39.5,
          "why": "Shared hunters mark Class Keyword engine chains triggers across both kits."
        },
        {
          "partner": "bram",
          "name": "Bram",
          "sharedKw": [],
          "score": 7.1,
          "winRate": 0,
          "lift": -37.6,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "dane",
          "name": "Sir Dane",
          "sharedKw": [],
          "score": 7,
          "winRate": 0,
          "lift": -34.3,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        }
      ],
      "bestItems": [
        {
          "item": "oathbow",
          "name": "Oathbow",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 5.8,
          "lift": 2.4,
          "valPerGold": 0.34
        },
        {
          "item": "bracers_archery",
          "name": "Bracers of Archery",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 4.6,
          "lift": 1.2,
          "valPerGold": 0.17
        },
        {
          "item": "boots_speed",
          "name": "Boots of Speed",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 5.1,
          "lift": 1.7,
          "valPerGold": 0.28
        },
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 4.8,
          "lift": 1.4,
          "valPerGold": 0.23
        }
      ],
      "bestValueItems": [
        {
          "item": "oathbow",
          "name": "Oathbow",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 5.8,
          "lift": 2.4,
          "valPerGold": 0.34
        },
        {
          "item": "boots_speed",
          "name": "Boots of Speed",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 5.1,
          "lift": 1.7,
          "valPerGold": 0.28
        },
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 4.8,
          "lift": 1.4,
          "valPerGold": 0.23
        }
      ]
    },
    "jamison": {
      "key": "jamison",
      "name": "Brother Jamison",
      "role": "Support",
      "cls": "Cleric",
      "avgScore": 45.6,
      "avgWR": 40,
      "midWR": 100,
      "lateWR": 0,
      "avgDmg": 83,
      "avgHeal": 516,
      "avgWard": 64,
      "avgGold": 0,
      "survPct": 40,
      "avgTime": 17.9,
      "liveRank": 6,
      "baseRank": 10,
      "rankDelta": 4,
      "baseScore": 39.7,
      "scoreDelta": 5.9,
      "changeStatus": "rebal",
      "archetype": "Spatial Closest-Ally Bonder & Channel Divinity Support",
      "useCase": "Position Brother Jamison right next to your main tank or carry (shown via live dashed targeting lines on Deployment!): Emboldening Bond grants Good Vibes damage reduction + d20 consistency, while Balm of Peace keeps frontlines standing through Act 3 bosses.",
      "changes": [
        {
          "type": "buff",
          "text": "Spatial targeting (`closest_ally`): Emboldening Bond reliably anchors to your chosen adjacent ally."
        },
        {
          "type": "rebal",
          "text": "Unified under `Channel Divinity` with crisp 1-line Specializations and opt-in Quest."
        }
      ],
      "paths": {
        "key": "jamison",
        "p0": {
          "k": "shared_grace",
          "n": "Shared Grace",
          "score": 43.1,
          "wr": 40
        },
        "p1": {
          "k": "radiant_link",
          "n": "Radiant Link",
          "score": 40.3,
          "wr": 40
        },
        "winner": "Shared Grace"
      },
      "bestPartners": [
        {
          "partner": "saint",
          "name": "Saint",
          "sharedKw": [
            "channel_divinity"
          ],
          "score": 9.5,
          "winRate": 0,
          "lift": -33.7,
          "why": "Shared channel divinity Class Keyword engine chains triggers across both kits."
        },
        {
          "partner": "bram",
          "name": "Bram",
          "sharedKw": [
            "channel_divinity"
          ],
          "score": 8.3,
          "winRate": 0,
          "lift": -36.3,
          "why": "Shared channel divinity Class Keyword engine chains triggers across both kits."
        },
        {
          "partner": "arthur",
          "name": "Arthur",
          "sharedKw": [],
          "score": 9.9,
          "winRate": 0,
          "lift": -34.8,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "wallaby",
          "name": "Wallaby",
          "sharedKw": [],
          "score": 9.3,
          "winRate": 0,
          "lift": -33.9,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        }
      ],
      "bestItems": [
        {
          "item": "amulet_devout",
          "name": "Amulet of the Devout",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 4.2,
          "lift": -0.2,
          "valPerGold": -0.03
        },
        {
          "item": "staff_healing",
          "name": "Staff of Healing",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 4.2,
          "lift": -0.2,
          "valPerGold": -0.03
        },
        {
          "item": "bag_holding",
          "name": "Bag of Holding",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 4.2,
          "lift": -0.2,
          "valPerGold": -0.03
        },
        {
          "item": "glamoured_leather",
          "name": "Glamoured Studded Leather",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 3.7,
          "lift": -0.7,
          "valPerGold": -0.12
        }
      ],
      "bestValueItems": [
        {
          "item": "amulet_devout",
          "name": "Amulet of the Devout",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 4.2,
          "lift": -0.2,
          "valPerGold": -0.03
        },
        {
          "item": "staff_healing",
          "name": "Staff of Healing",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 4.2,
          "lift": -0.2,
          "valPerGold": -0.03
        },
        {
          "item": "bag_holding",
          "name": "Bag of Holding",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 4.2,
          "lift": -0.2,
          "valPerGold": -0.03
        }
      ]
    },
    "corvin": {
      "key": "corvin",
      "name": "Corvin",
      "role": "Damage",
      "cls": "Ranger",
      "avgScore": 45.6,
      "avgWR": 40,
      "midWR": 100,
      "lateWR": 0,
      "avgDmg": 448,
      "avgHeal": 0,
      "avgWard": 0,
      "avgGold": 0.3,
      "survPct": 40,
      "avgTime": 19.7,
      "liveRank": 7,
      "baseRank": 16,
      "rankDelta": 9,
      "baseScore": 33.5,
      "scoreDelta": 12.1,
      "changeStatus": "buff",
      "archetype": "Melee Dread Ambush Ranger & Hunter’s Mark Enabler",
      "useCase": "Melee skirmisher who opens with Dread Ambush, spreads stacking `Hunter’s Mark` (+1d4 per hit from the entire party!), and summons a Shadow Echo on Nat 20. Turns Naill, Velith, and Arthur into boss-melting machines.",
      "changes": [
        {
          "type": "buff",
          "text": "Unified under `Hunter’s Mark` + melee on-hit multi-strikes; Dread Ambush excels into Act 2–3 elites."
        },
        {
          "type": "rebal",
          "text": "Clean 1-line Specializations (`First Strike` / `Shadow Stalker`) and opt-in Quest."
        }
      ],
      "paths": {
        "key": "corvin",
        "p0": {
          "k": "stalker_flurry",
          "n": "Stalker’s Flurry",
          "score": 42.8,
          "wr": 40
        },
        "p1": {
          "k": "first_strike",
          "n": "First Strike",
          "score": 40,
          "wr": 40
        },
        "winner": "Stalker’s Flurry"
      },
      "bestPartners": [
        {
          "partner": "faelan",
          "name": "Faelan",
          "sharedKw": [],
          "score": 17.5,
          "winRate": 0,
          "lift": -27.9,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "dane",
          "name": "Sir Dane",
          "sharedKw": [],
          "score": 11,
          "winRate": 0,
          "lift": -30.2,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "lorcan",
          "name": "Lorcan",
          "sharedKw": [
            "hunters_mark"
          ],
          "score": 7.8,
          "winRate": 0,
          "lift": -37.9,
          "why": "Shared hunters mark Class Keyword engine chains triggers across both kits."
        },
        {
          "partner": "bram",
          "name": "Bram",
          "sharedKw": [],
          "score": 7.2,
          "winRate": 0,
          "lift": -37.4,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        }
      ],
      "bestItems": [
        {
          "item": "bracers_archery",
          "name": "Bracers of Archery",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 5.9,
          "lift": 1.6,
          "valPerGold": 0.23
        },
        {
          "item": "boots_speed",
          "name": "Boots of Speed",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 6.6,
          "lift": 2.3,
          "valPerGold": 0.38
        },
        {
          "item": "ring_protection",
          "name": "Ring of Protection",
          "rarity": 1,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 5.1,
          "lift": 0.8,
          "valPerGold": 0.2
        },
        {
          "item": "sun_blade",
          "name": "Sun Blade",
          "rarity": 5,
          "cost": 7,
          "kwMatch": false,
          "winRate": 0,
          "score": 4.3,
          "lift": 0,
          "valPerGold": 0
        }
      ],
      "bestValueItems": [
        {
          "item": "boots_speed",
          "name": "Boots of Speed",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 6.6,
          "lift": 2.3,
          "valPerGold": 0.38
        },
        {
          "item": "bracers_archery",
          "name": "Bracers of Archery",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 5.9,
          "lift": 1.6,
          "valPerGold": 0.23
        },
        {
          "item": "ring_protection",
          "name": "Ring of Protection",
          "rarity": 1,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 5.1,
          "lift": 0.8,
          "valPerGold": 0.2
        }
      ]
    },
    "faelan": {
      "key": "faelan",
      "name": "Faelan",
      "role": "Support",
      "cls": "Wizard",
      "avgScore": 45.1,
      "avgWR": 40,
      "midWR": 100,
      "lateWR": 0,
      "avgDmg": 115,
      "avgHeal": 0,
      "avgWard": 1201,
      "avgGold": 0.6,
      "survPct": 40,
      "avgTime": 19.9,
      "liveRank": 8,
      "baseRank": 11,
      "rankDelta": 3,
      "baseScore": 38.9,
      "scoreDelta": 6.2,
      "changeStatus": "rebal",
      "archetype": "Arcane Recovery Battery & Projected Ward Wizard",
      "useCase": "Your premier Ward-and-Charge engine. Whenever Faelan’s Arcane Ward breaks, Arcane Recovery fuels his next cast—making him an ideal partner for Gains, Zoe, and Gilthrax. Choose `Spell Battery` to feed Charge to allies or `Projected Ward` to protect fragile carries against Act 3 boss nukes.",
      "changes": [
        {
          "type": "rebal",
          "text": "Clean v0.23 Arcane Recovery loop: broken Wards restore Charge to keep casting smoothly without stalling."
        },
        {
          "type": "buff",
          "text": "Specializations trimmed to 1-line choices (`Projected Ward` / `Spell Battery`); scales naturally with INT Charge speed and Spell Pen."
        }
      ],
      "paths": {
        "key": "faelan",
        "p0": {
          "k": "proj_ward",
          "n": "Projected Ward",
          "score": 43.1,
          "wr": 40
        },
        "p1": {
          "k": "spell_battery",
          "n": "Spell Battery",
          "score": 39.7,
          "wr": 40
        },
        "winner": "Projected Ward"
      },
      "bestPartners": [
        {
          "partner": "gains",
          "name": "Gains",
          "sharedKw": [
            "arcane_recovery"
          ],
          "score": 19.6,
          "winRate": 0,
          "lift": -24.5,
          "why": "Shared arcane recovery Class Keyword engine chains triggers across both kits."
        },
        {
          "partner": "wallaby",
          "name": "Wallaby",
          "sharedKw": [],
          "score": 20.1,
          "winRate": 0,
          "lift": -22.8,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "bram",
          "name": "Bram",
          "sharedKw": [],
          "score": 18.2,
          "winRate": 0,
          "lift": -26.2,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "arthur",
          "name": "Arthur",
          "sharedKw": [],
          "score": 17.3,
          "winRate": 0,
          "lift": -27.2,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        }
      ],
      "bestItems": [
        {
          "item": "arcane_grimoire",
          "name": "Arcane Grimoire",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 9.9,
          "lift": 3.5,
          "valPerGold": 0.5
        },
        {
          "item": "ring_spell_storing",
          "name": "Ring of Spell Storing",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 8.9,
          "lift": 2.5,
          "valPerGold": 0.42
        },
        {
          "item": "pearl_power",
          "name": "Pearl of Power",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 6,
          "lift": -0.4,
          "valPerGold": -0.06
        },
        {
          "item": "wand_web",
          "name": "Wand of Web",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 6.4,
          "lift": 0,
          "valPerGold": 0
        }
      ],
      "bestValueItems": [
        {
          "item": "arcane_grimoire",
          "name": "Arcane Grimoire",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 9.9,
          "lift": 3.5,
          "valPerGold": 0.5
        },
        {
          "item": "ring_spell_storing",
          "name": "Ring of Spell Storing",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 8.9,
          "lift": 2.5,
          "valPerGold": 0.42
        },
        {
          "item": "wand_web",
          "name": "Wand of Web",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 6.4,
          "lift": 0,
          "valPerGold": 0
        }
      ]
    },
    "cinder": {
      "key": "cinder",
      "name": "Cinder",
      "role": "Damage",
      "cls": "Sorcerer",
      "avgScore": 43.9,
      "avgWR": 40,
      "midWR": 100,
      "lateWR": 0,
      "avgDmg": 662,
      "avgHeal": 0,
      "avgWard": 0,
      "avgGold": 0,
      "survPct": 40,
      "avgTime": 18.2,
      "liveRank": 9,
      "baseRank": 8,
      "rankDelta": -1,
      "baseScore": 40.8,
      "scoreDelta": 3.1,
      "changeStatus": "buff",
      "archetype": "Metamagic Fireball Nuke & Burn AoE Sweeper",
      "useCase": "Premier AoE blaster who punishes enemy clumps across Phandalin and White Plume Mountain, and melts high-AC foes with Burn and Spell Pen. Pair with Lumen or Nettle to chain Burn/Hex detonations, and prioritize Spell Pen + INT Charge gear.",
      "changes": [
        {
          "type": "buff",
          "text": "Unified under canonical `Metamagic` keyword with clean 1-line `Wildfire` / `Twinned Spell` Specializations."
        },
        {
          "type": "global",
          "text": "Spell Pen items (Circlet of Blasting, Wand of the War Mage, Robe of the Archmagi) dramatically boost Fireball against Act 3 SR 16–17 bosses."
        }
      ],
      "paths": {
        "key": "cinder",
        "p0": {
          "k": "draconic_surge",
          "n": "Draconic Surge",
          "score": 43.2,
          "wr": 40
        },
        "p1": {
          "k": "wildfire",
          "n": "Wildfire",
          "score": 37.2,
          "wr": 40
        },
        "winner": "Draconic Surge"
      },
      "bestPartners": [
        {
          "partner": "faelan",
          "name": "Faelan",
          "sharedKw": [],
          "score": 21.7,
          "winRate": 0,
          "lift": -22.8,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "juniper",
          "name": "Juniper",
          "sharedKw": [],
          "score": 13.6,
          "winRate": 0,
          "lift": -27.9,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "bram",
          "name": "Bram",
          "sharedKw": [],
          "score": 12.8,
          "winRate": 0,
          "lift": -30.9,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "dane",
          "name": "Sir Dane",
          "sharedKw": [],
          "score": 8.2,
          "winRate": 0,
          "lift": -32.1,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        }
      ],
      "bestItems": [
        {
          "item": "bloodwell_vial",
          "name": "Bloodwell Vial",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 5.8,
          "lift": -0.8,
          "valPerGold": -0.11
        },
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 6.6,
          "lift": 0,
          "valPerGold": 0
        },
        {
          "item": "wand_fireballs",
          "name": "Wand of Fireballs",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 4.3,
          "lift": -2.3,
          "valPerGold": -0.33
        },
        {
          "item": "glamoured_leather",
          "name": "Glamoured Studded Leather",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 4.9,
          "lift": -1.7,
          "valPerGold": -0.28
        }
      ],
      "bestValueItems": [
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 6.6,
          "lift": 0,
          "valPerGold": 0
        },
        {
          "item": "bloodwell_vial",
          "name": "Bloodwell Vial",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 5.8,
          "lift": -0.8,
          "valPerGold": -0.11
        },
        {
          "item": "glamoured_leather",
          "name": "Glamoured Studded Leather",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 4.9,
          "lift": -1.7,
          "valPerGold": -0.28
        }
      ]
    },
    "arthur": {
      "key": "arthur",
      "name": "Arthur",
      "role": "Damage",
      "cls": "Fighter",
      "avgScore": 43.8,
      "avgWR": 40,
      "midWR": 100,
      "lateWR": 0,
      "avgDmg": 520,
      "avgHeal": 0,
      "avgWard": 0,
      "avgGold": 0.3,
      "survPct": 40,
      "avgTime": 21.5,
      "liveRank": 10,
      "baseRank": 12,
      "rankDelta": 2,
      "baseScore": 38,
      "scoreDelta": 5.8,
      "changeStatus": "rebal",
      "archetype": "Evasion Duelist & Action Surge Counter-Striker",
      "useCase": "Rebuilt around v0.23 Universal Evasion and Action Surge counter-strikes. Every time Arthur dodges an attack, he fires a free Longsword strike—stack multiplicative Evasion (Constant Vigilance + Cloak of Displacement + Boots of Speed) and let him shred frontlines while triggering Ally Action Surge hooks with Zoe and Gilthrax.",
      "changes": [
        {
          "type": "rebal",
          "text": "Reworked into melee Longsword + Longbow Volley Evasion Fighter; every Evade triggers an immediate Action Surge counter-strike."
        },
        {
          "type": "buff",
          "text": "Specializations streamlined to 1-line rules: `Constant Vigilance` (+15% Evasion) and `Deadeye` (Volley fires +1 extra arrow)."
        },
        {
          "type": "rebal",
          "text": "Opt-in Quest (`Flame Gauntlet`): Evade 12 attacks to replace Longbow Volley with a frontline fire cone + Burn."
        }
      ],
      "paths": {
        "key": "arthur",
        "p0": {
          "k": "vigilance",
          "n": "Constant Vigilance",
          "score": 39.9,
          "wr": 40
        },
        "p1": {
          "k": "init_splash",
          "n": "Roll for Initiative",
          "score": 40.1,
          "wr": 40
        },
        "winner": "Even"
      },
      "bestPartners": [
        {
          "partner": "faelan",
          "name": "Faelan",
          "sharedKw": [],
          "score": 16.7,
          "winRate": 0,
          "lift": -27.8,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "gilthrax",
          "name": "Gilthrax",
          "sharedKw": [
            "action_surge"
          ],
          "score": 14.4,
          "winRate": 0,
          "lift": -31.6,
          "why": "Shared action surge Class Keyword engine chains triggers across both kits."
        },
        {
          "partner": "bram",
          "name": "Bram",
          "sharedKw": [],
          "score": 11,
          "winRate": 0,
          "lift": -32.7,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "zoe",
          "name": "Zoe",
          "sharedKw": [
            "action_surge"
          ],
          "score": 6.9,
          "winRate": 0,
          "lift": -33.1,
          "why": "Shared action surge Class Keyword engine chains triggers across both kits."
        }
      ],
      "bestItems": [
        {
          "item": "weapon_warning",
          "name": "Weapon of Warning",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 5.4,
          "lift": 1,
          "valPerGold": 0.14
        },
        {
          "item": "flame_tongue",
          "name": "Flame Tongue",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 5.4,
          "lift": 1,
          "valPerGold": 0.14
        },
        {
          "item": "boots_speed",
          "name": "Boots of Speed",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 5.7,
          "lift": 1.3,
          "valPerGold": 0.22
        },
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 5.3,
          "lift": 0.9,
          "valPerGold": 0.15
        }
      ],
      "bestValueItems": [
        {
          "item": "boots_speed",
          "name": "Boots of Speed",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 5.7,
          "lift": 1.3,
          "valPerGold": 0.22
        },
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 5.3,
          "lift": 0.9,
          "valPerGold": 0.15
        },
        {
          "item": "weapon_warning",
          "name": "Weapon of Warning",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 5.4,
          "lift": 1,
          "valPerGold": 0.14
        }
      ]
    },
    "bram": {
      "key": "bram",
      "name": "Bram",
      "role": "Tank",
      "cls": "Cleric",
      "avgScore": 43.6,
      "avgWR": 40,
      "midWR": 100,
      "lateWR": 0,
      "avgDmg": 107,
      "avgHeal": 349,
      "avgWard": 1,
      "avgGold": 0.5,
      "survPct": 40,
      "avgTime": 15.8,
      "liveRank": 11,
      "baseRank": 15,
      "rankDelta": 4,
      "baseScore": 33.5,
      "scoreDelta": 10.1,
      "changeStatus": "rebal",
      "archetype": "Stalwart Frontline & Channel Divinity Burst Healer",
      "useCase": "Classic Life Cleric frontline anchor whose Preserve Life spikes your entire squad back from the brink when an ally drops below 40% HP. Pair Bram with high-output carries (Cinder, Gains, Velith) and equip Heavy Armor or Devotee’s Censer to amplify his Channel Divinity burst.",
      "changes": [
        {
          "type": "rebal",
          "text": "Card simplified to strict progressive disclosure; `Channel Divinity` fires Preserve Life automatically below 40% HP."
        },
        {
          "type": "buff",
          "text": "Specializations: `Blessed Healer` (self-heal 50% of heals cast) and `Radiant Shield` (grant Ward on overheal)."
        },
        {
          "type": "global",
          "text": "Benefits from Cubed AC/SR (`K=14`), making Plate Armor & Shield upgrades noticeably tankier."
        }
      ],
      "paths": {
        "key": "bram",
        "p0": {
          "k": "disciple_life",
          "n": "Disciple of Life",
          "score": 39.6,
          "wr": 40
        },
        "p1": {
          "k": "divine_strike",
          "n": "Divine Strike",
          "score": 40.5,
          "wr": 40
        },
        "winner": "Even"
      },
      "bestPartners": [
        {
          "partner": "faelan",
          "name": "Faelan",
          "sharedKw": [],
          "score": 16.1,
          "winRate": 0,
          "lift": -28.3,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "saint",
          "name": "Saint",
          "sharedKw": [
            "channel_divinity"
          ],
          "score": 10.7,
          "winRate": 0,
          "lift": -31.5,
          "why": "Shared channel divinity Class Keyword engine chains triggers across both kits."
        },
        {
          "partner": "arthur",
          "name": "Arthur",
          "sharedKw": [],
          "score": 11.1,
          "winRate": 0,
          "lift": -32.6,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "jamison",
          "name": "Brother Jamison",
          "sharedKw": [
            "channel_divinity"
          ],
          "score": 7.5,
          "winRate": 0,
          "lift": -37.1,
          "why": "Shared channel divinity Class Keyword engine chains triggers across both kits."
        }
      ],
      "bestItems": [
        {
          "item": "staff_healing",
          "name": "Staff of Healing",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 6.8,
          "lift": 2.1,
          "valPerGold": 0.3
        },
        {
          "item": "amulet_devout",
          "name": "Amulet of the Devout",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 4.6,
          "lift": -0.1,
          "valPerGold": -0.01
        },
        {
          "item": "sword_sharpness",
          "name": "Sword of Sharpness",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 6.2,
          "lift": 1.5,
          "valPerGold": 0.25
        },
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 5.6,
          "lift": 0.9,
          "valPerGold": 0.15
        }
      ],
      "bestValueItems": [
        {
          "item": "staff_healing",
          "name": "Staff of Healing",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 6.8,
          "lift": 2.1,
          "valPerGold": 0.3
        },
        {
          "item": "sword_sharpness",
          "name": "Sword of Sharpness",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 6.2,
          "lift": 1.5,
          "valPerGold": 0.25
        },
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 5.6,
          "lift": 0.9,
          "valPerGold": 0.15
        }
      ]
    },
    "gains": {
      "key": "gains",
      "name": "Gains",
      "role": "Damage",
      "cls": "Wizard",
      "avgScore": 43.1,
      "avgWR": 40,
      "midWR": 100,
      "lateWR": 0,
      "avgDmg": 495,
      "avgHeal": 0,
      "avgWard": 0,
      "avgGold": 3.5,
      "survPct": 40,
      "avgTime": 18.2,
      "liveRank": 12,
      "baseRank": 20,
      "rankDelta": 8,
      "baseScore": 32.7,
      "scoreDelta": 10.4,
      "changeStatus": "rebal",
      "archetype": "Slow Gold-Bolt Heavy-CD Wizard & Arcane Recovery Artillery",
      "useCase": "Rebuilt as a deliberate, hard-hitting **slow Gold-bolt heavy-CD Wizard** whose Gilded Beam marks enemies Gilded (+1g on kill) and scales explosively on Nat 20 with unspent gold held. Pair with Faelan (`Arcane Recovery`) and Toot for huge Act 3 spikes.",
      "changes": [
        {
          "type": "rebal",
          "text": "Reworked into slow Gold-bolt heavy-cooldown artillery Wizard; combat gold drops restore +15 Charge (`Arcane Recovery`)."
        },
        {
          "type": "rebal",
          "text": "1-line Specializations (`Compound Interest` / `Golden Beam`) and opt-in Quest."
        }
      ],
      "paths": {
        "key": "gains",
        "p0": {
          "k": "compound_interest",
          "n": "Compound Interest",
          "score": 39,
          "wr": 40
        },
        "p1": {
          "k": "liquid_assets",
          "n": "Liquid Assets",
          "score": 39.6,
          "wr": 40
        },
        "winner": "Even"
      },
      "bestPartners": [
        {
          "partner": "faelan",
          "name": "Faelan",
          "sharedKw": [
            "arcane_recovery"
          ],
          "score": 20.5,
          "winRate": 0,
          "lift": -23.6,
          "why": "Shared arcane recovery Class Keyword engine chains triggers across both kits."
        },
        {
          "partner": "juniper",
          "name": "Juniper",
          "sharedKw": [],
          "score": 10.9,
          "winRate": 0,
          "lift": -30.2,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "dane",
          "name": "Sir Dane",
          "sharedKw": [],
          "score": 8.6,
          "winRate": 0,
          "lift": -31.3,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "bram",
          "name": "Bram",
          "sharedKw": [],
          "score": 8.4,
          "winRate": 0,
          "lift": -35,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        }
      ],
      "bestItems": [
        {
          "item": "arcane_grimoire",
          "name": "Arcane Grimoire",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 4.7,
          "lift": 0.6,
          "valPerGold": 0.09
        },
        {
          "item": "pearl_power",
          "name": "Pearl of Power",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 4.4,
          "lift": 0.3,
          "valPerGold": 0.04
        },
        {
          "item": "wand_web",
          "name": "Wand of Web",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 4.1,
          "lift": 0,
          "valPerGold": 0
        },
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 3.9,
          "lift": -0.2,
          "valPerGold": -0.03
        }
      ],
      "bestValueItems": [
        {
          "item": "arcane_grimoire",
          "name": "Arcane Grimoire",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 4.7,
          "lift": 0.6,
          "valPerGold": 0.09
        },
        {
          "item": "pearl_power",
          "name": "Pearl of Power",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 4.4,
          "lift": 0.3,
          "valPerGold": 0.04
        },
        {
          "item": "wand_web",
          "name": "Wand of Web",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 4.1,
          "lift": 0,
          "valPerGold": 0
        }
      ]
    },
    "lumen": {
      "key": "lumen",
      "name": "Lumen",
      "role": "Damage",
      "cls": "Warlock",
      "avgScore": 42,
      "avgWR": 40,
      "midWR": 100,
      "lateWR": 0,
      "avgDmg": 555,
      "avgHeal": 29,
      "avgWard": 0,
      "avgGold": 0,
      "survPct": 30,
      "avgTime": 21.6,
      "liveRank": 13,
      "baseRank": 21,
      "rankDelta": 8,
      "baseScore": 32.4,
      "scoreDelta": 9.6,
      "changeStatus": "rebal",
      "archetype": "Celestial Warlock (`CHA/CHA`) & Radiant True-Damage Blaster",
      "useCase": "Completely reworked in v0.23 into a **Celestial Warlock** (`CHA/CHA`) wielding **Radiant true damage** that cuts straight through Giant Crab’s AC 17 and Act 3 Boss resistances while triggering `Eldritch Pact` + Burn detonations alongside Cinder and Nettle!",
      "changes": [
        {
          "type": "rebal",
          "text": "Reworked class & scaling to Celestial Warlock (`CHA/CHA`, `Eldritch Pact` keyword) firing Radiant true damage."
        },
        {
          "type": "buff",
          "text": "Radiant damage bypasses both AC and SR on the v0.23 Cubed defense curve."
        }
      ],
      "paths": {
        "key": "lumen",
        "p0": {
          "k": "searing_focus",
          "n": "Searing Focus",
          "score": 31.8,
          "wr": 40
        },
        "p1": {
          "k": "healing_light",
          "n": "Healing Light",
          "score": 45,
          "wr": 40
        },
        "winner": "Healing Light"
      },
      "bestPartners": [
        {
          "partner": "faelan",
          "name": "Faelan",
          "sharedKw": [],
          "score": 18.7,
          "winRate": 0,
          "lift": -24.8,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "nettle",
          "name": "Nettle",
          "sharedKw": [
            "hex"
          ],
          "score": 9.8,
          "winRate": 0,
          "lift": -30.3,
          "why": "Shared hex Class Keyword engine chains triggers across both kits."
        },
        {
          "partner": "bram",
          "name": "Bram",
          "sharedKw": [],
          "score": 10.7,
          "winRate": 0,
          "lift": -32.1,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "dane",
          "name": "Sir Dane",
          "sharedKw": [],
          "score": 9,
          "winRate": 0,
          "lift": -30.4,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        }
      ],
      "bestItems": [
        {
          "item": "staff_withering",
          "name": "Staff of Withering",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 6.4,
          "lift": 2.5,
          "valPerGold": 0.36
        },
        {
          "item": "rod_pact_keeper",
          "name": "Rod of the Pact Keeper",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 5,
          "lift": 1.1,
          "valPerGold": 0.16
        },
        {
          "item": "bag_holding",
          "name": "Bag of Holding",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 5,
          "lift": 1.1,
          "valPerGold": 0.18
        },
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 5,
          "lift": 1.1,
          "valPerGold": 0.18
        }
      ],
      "bestValueItems": [
        {
          "item": "staff_withering",
          "name": "Staff of Withering",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 6.4,
          "lift": 2.5,
          "valPerGold": 0.36
        },
        {
          "item": "bag_holding",
          "name": "Bag of Holding",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 5,
          "lift": 1.1,
          "valPerGold": 0.18
        },
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 5,
          "lift": 1.1,
          "valPerGold": 0.18
        }
      ]
    },
    "wallaby": {
      "key": "wallaby",
      "name": "Wallaby",
      "role": "Damage",
      "cls": "Rogue",
      "avgScore": 40.7,
      "avgWR": 40,
      "midWR": 100,
      "lateWR": 0,
      "avgDmg": 578,
      "avgHeal": 0,
      "avgWard": 0,
      "avgGold": 3.1,
      "survPct": 40,
      "avgTime": 21.6,
      "liveRank": 14,
      "baseRank": 22,
      "rankDelta": 8,
      "baseScore": 31.4,
      "scoreDelta": 9.3,
      "changeStatus": "buff",
      "archetype": "Backline Assassin & Class-Bypassing Thief",
      "useCase": "High-impact backline diver who leaps behind Act 2–3 shield walls to assassinate casters and summoners. His v0.23 `Use Magic Device` trait lets him equip ANY of the 24 Curio Unique items regardless of class lock, and his Quest (`Bag of Holding`) unlocks a 4th item slot!",
      "changes": [
        {
          "type": "buff",
          "text": "New Thief passive (`Use Magic Device`): Wallaby bypasses class locks on all 24 Curio Unique items!"
        },
        {
          "type": "buff",
          "text": "Evasion synergy: benefits multiplicatively from Boots/Cloak/Ring evasion stacking while diving backlines."
        },
        {
          "type": "rebal",
          "text": "Opt-in Quest (`Bag of Holding`): open a 4th equipment slot after stealing gold in combat."
        }
      ],
      "paths": {
        "key": "wallaby",
        "p0": {
          "k": "cutthroat",
          "n": "Cutthroat",
          "score": 35,
          "wr": 40
        },
        "p1": {
          "k": "pickpocket",
          "n": "Pickpocket",
          "score": 39.4,
          "wr": 40
        },
        "winner": "Pickpocket"
      },
      "bestPartners": [
        {
          "partner": "faelan",
          "name": "Faelan",
          "sharedKw": [],
          "score": 24,
          "winRate": 0,
          "lift": -18.9,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "velith",
          "name": "Velith",
          "sharedKw": [
            "sneak_attack"
          ],
          "score": 10.8,
          "winRate": 0,
          "lift": -33.6,
          "why": "Shared sneak attack Class Keyword engine chains triggers across both kits."
        },
        {
          "partner": "bram",
          "name": "Bram",
          "sharedKw": [],
          "score": 9.2,
          "winRate": 0,
          "lift": -33,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "dane",
          "name": "Sir Dane",
          "sharedKw": [],
          "score": 9,
          "winRate": 0,
          "lift": -29.7,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        }
      ],
      "bestItems": [
        {
          "item": "cloak_elvenkind",
          "name": "Cloak of Elvenkind",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 5.4,
          "lift": 1.2,
          "valPerGold": 0.17
        },
        {
          "item": "dagger_venom",
          "name": "Dagger of Venom",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 5.3,
          "lift": 1.1,
          "valPerGold": 0.16
        },
        {
          "item": "ring_protection",
          "name": "Ring of Protection",
          "rarity": 1,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 4.5,
          "lift": 0.3,
          "valPerGold": 0.07
        },
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 4.4,
          "lift": 0.2,
          "valPerGold": 0.03
        }
      ],
      "bestValueItems": [
        {
          "item": "cloak_elvenkind",
          "name": "Cloak of Elvenkind",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 5.4,
          "lift": 1.2,
          "valPerGold": 0.17
        },
        {
          "item": "dagger_venom",
          "name": "Dagger of Venom",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 5.3,
          "lift": 1.1,
          "valPerGold": 0.16
        },
        {
          "item": "ring_protection",
          "name": "Ring of Protection",
          "rarity": 1,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 4.5,
          "lift": 0.3,
          "valPerGold": 0.07
        }
      ]
    },
    "saint": {
      "key": "saint",
      "name": "Saint",
      "role": "Support",
      "cls": "Cleric",
      "avgScore": 40.7,
      "avgWR": 40,
      "midWR": 100,
      "lateWR": 0,
      "avgDmg": 191,
      "avgHeal": 66,
      "avgWard": 0,
      "avgGold": 1,
      "survPct": 40,
      "avgTime": 13.8,
      "liveRank": 15,
      "baseRank": 23,
      "rankDelta": 8,
      "baseScore": 29.9,
      "scoreDelta": 10.8,
      "changeStatus": "rebal",
      "archetype": "Necrosis Anti-Heal Cleric & Illusory Double Trickster",
      "useCase": "Tactical counter-pick against heavy healing/Ward bosses (Keraptis, Gynosphinx, Asmodeus). Toll the Dead stacks Necrosis kill thresholds while Illusory Double absorbs lethal boss bursts and triggers `Channel Divinity` utility.",
      "changes": [
        {
          "type": "rebal",
          "text": "Unified under `Channel Divinity` with crisp Necrosis pressure and Illusory Double decoy survivability."
        },
        {
          "type": "rebal",
          "text": "Clean 1-line Specializations (`Bell of Passing` / `Trickster’s Veil`) and opt-in Quest."
        }
      ],
      "paths": {
        "key": "saint",
        "p0": {
          "k": "two_faced",
          "n": "Two-Faced",
          "score": 35.7,
          "wr": 40
        },
        "p1": {
          "k": "smoke_mirrors",
          "n": "Smoke & Mirrors",
          "score": 38.4,
          "wr": 40
        },
        "winner": "Smoke & Mirrors"
      },
      "bestPartners": [
        {
          "partner": "bram",
          "name": "Bram",
          "sharedKw": [
            "channel_divinity"
          ],
          "score": 10.8,
          "winRate": 0,
          "lift": -31.4,
          "why": "Shared channel divinity Class Keyword engine chains triggers across both kits."
        },
        {
          "partner": "jamison",
          "name": "Brother Jamison",
          "sharedKw": [
            "channel_divinity"
          ],
          "score": 8.3,
          "winRate": 0,
          "lift": -34.9,
          "why": "Shared channel divinity Class Keyword engine chains triggers across both kits."
        },
        {
          "partner": "arthur",
          "name": "Arthur",
          "sharedKw": [],
          "score": 10.2,
          "winRate": 0,
          "lift": -32,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "wallaby",
          "name": "Wallaby",
          "sharedKw": [],
          "score": 7.6,
          "winRate": 0,
          "lift": -33.1,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        }
      ],
      "bestItems": [
        {
          "item": "staff_healing",
          "name": "Staff of Healing",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 3.8,
          "lift": -0.7,
          "valPerGold": -0.1
        },
        {
          "item": "amulet_devout",
          "name": "Amulet of the Devout",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 3.6,
          "lift": -0.9,
          "valPerGold": -0.13
        },
        {
          "item": "stone_good_luck",
          "name": "Stone of Good Luck",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 4.5,
          "lift": 0,
          "valPerGold": 0
        },
        {
          "item": "wand_web",
          "name": "Wand of Web",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 3.9,
          "lift": -0.6,
          "valPerGold": -0.1
        }
      ],
      "bestValueItems": [
        {
          "item": "stone_good_luck",
          "name": "Stone of Good Luck",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 4.5,
          "lift": 0,
          "valPerGold": 0
        },
        {
          "item": "staff_healing",
          "name": "Staff of Healing",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 3.8,
          "lift": -0.7,
          "valPerGold": -0.1
        },
        {
          "item": "wand_web",
          "name": "Wand of Web",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 3.9,
          "lift": -0.6,
          "valPerGold": -0.1
        }
      ]
    },
    "rosalind": {
      "key": "rosalind",
      "name": "Rosalind",
      "role": "Support",
      "cls": "Bard",
      "avgScore": 40,
      "avgWR": 40,
      "midWR": 100,
      "lateWR": 0,
      "avgDmg": 66,
      "avgHeal": 0,
      "avgWard": 0,
      "avgGold": 0.9,
      "survPct": 40,
      "avgTime": 12.8,
      "liveRank": 16,
      "baseRank": 19,
      "rankDelta": 3,
      "baseScore": 32.8,
      "scoreDelta": 7.2,
      "changeStatus": "buff",
      "archetype": "Spatial Closest-Ally Buffer & Bardic Inspiration Engine",
      "useCase": "Positioning matters! Rosalind’s Bardic Inspiration targets her **closest ally** (previewed with dashed gold lines during Tactical Deployment), granting Inspired Flourish (+Damage & +Haste) and d20 roll boosts right onto your chosen hyper-carry.",
      "changes": [
        {
          "type": "buff",
          "text": "Spatial targeting (`closest_ally`): position Rosalind beside your chosen carry with live deployment preview lines."
        },
        {
          "type": "rebal",
          "text": "Clean 1-line Specializations (`Pass the Round` vs `Cutting Words`) and Bardic Inspiration keyword hooks."
        }
      ],
      "paths": {
        "key": "rosalind",
        "p0": {
          "k": "pass_round",
          "n": "Pass the Round",
          "score": 37.1,
          "wr": 40
        },
        "p1": {
          "k": "encore",
          "n": "Encore",
          "score": 36.1,
          "wr": 40
        },
        "winner": "Even"
      },
      "bestPartners": [
        {
          "partner": "bram",
          "name": "Bram",
          "sharedKw": [],
          "score": 10.1,
          "winRate": 0,
          "lift": -31.7,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "arthur",
          "name": "Arthur",
          "sharedKw": [],
          "score": 9.6,
          "winRate": 0,
          "lift": -32.3,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "wallaby",
          "name": "Wallaby",
          "sharedKw": [],
          "score": 8.2,
          "winRate": 0,
          "lift": -32.2,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "toot",
          "name": "Toot",
          "sharedKw": [
            "bardic_inspiration"
          ],
          "score": 5.5,
          "winRate": 0,
          "lift": -31.5,
          "why": "Shared bardic inspiration Class Keyword engine chains triggers across both kits."
        }
      ],
      "bestItems": [
        {
          "item": "horn_valhalla",
          "name": "Horn of Valhalla",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 6.7,
          "lift": 1.8,
          "valPerGold": 0.26
        },
        {
          "item": "pipes_haunting",
          "name": "Pipes of Haunting",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 4.7,
          "lift": -0.2,
          "valPerGold": -0.03
        },
        {
          "item": "bag_holding",
          "name": "Bag of Holding",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 5.5,
          "lift": 0.6,
          "valPerGold": 0.1
        },
        {
          "item": "glamoured_leather",
          "name": "Glamoured Studded Leather",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 5.3,
          "lift": 0.4,
          "valPerGold": 0.07
        }
      ],
      "bestValueItems": [
        {
          "item": "horn_valhalla",
          "name": "Horn of Valhalla",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 6.7,
          "lift": 1.8,
          "valPerGold": 0.26
        },
        {
          "item": "bag_holding",
          "name": "Bag of Holding",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 5.5,
          "lift": 0.6,
          "valPerGold": 0.1
        },
        {
          "item": "glamoured_leather",
          "name": "Glamoured Studded Leather",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 5.3,
          "lift": 0.4,
          "valPerGold": 0.07
        }
      ]
    },
    "juniper": {
      "key": "juniper",
      "name": "Juniper",
      "role": "Support",
      "cls": "Druid",
      "avgScore": 39.1,
      "avgWR": 40,
      "midWR": 100,
      "lateWR": 0,
      "avgDmg": 422,
      "avgHeal": 62,
      "avgWard": 0,
      "avgGold": 0.5,
      "survPct": 40,
      "avgTime": 14.7,
      "liveRank": 17,
      "baseRank": 3,
      "rankDelta": -14,
      "baseScore": 46.9,
      "scoreDelta": -7.8,
      "changeStatus": "rebal",
      "archetype": "Root/Poison Controller & Wild Shape Anchor",
      "useCase": "Versatile Druid controller who locks melee rushers in place with Entangle Roots while Poison ticks through high AC. Pairs naturally with Mother Laurel and Kaska to trigger Wild Shape engines and shines on Act 2–3 choke maps.",
      "changes": [
        {
          "type": "rebal",
          "text": "Unified under canonical `Wild Shape` keyword with clean 1-line `Circle of the Land` / `Circle of Spores` Specializations."
        },
        {
          "type": "global",
          "text": "Poison bypasses Cubed AC/SR armor scaling, keeping Juniper dangerous into Act 3."
        }
      ],
      "paths": {
        "key": "juniper",
        "p0": {
          "k": "overgrowth",
          "n": "Overgrowth",
          "score": 33.8,
          "wr": 40
        },
        "p1": {
          "k": "circle_land",
          "n": "Circle of the Land",
          "score": 38.1,
          "wr": 40
        },
        "winner": "Circle of the Land"
      },
      "bestPartners": [
        {
          "partner": "arthur",
          "name": "Arthur",
          "sharedKw": [],
          "score": 14.7,
          "winRate": 0,
          "lift": -26.8,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "kaska",
          "name": "Kaska",
          "sharedKw": [
            "wild_shape"
          ],
          "score": 12.6,
          "winRate": 0,
          "lift": -30.4,
          "why": "Shared wild shape Class Keyword engine chains triggers across both kits."
        },
        {
          "partner": "bram",
          "name": "Bram",
          "sharedKw": [],
          "score": 13.7,
          "winRate": 0,
          "lift": -27.7,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "wallaby",
          "name": "Wallaby",
          "sharedKw": [],
          "score": 8.9,
          "winRate": 0,
          "lift": -31,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        }
      ],
      "bestItems": [
        {
          "item": "staff_woodlands",
          "name": "Staff of the Woodlands",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 6.1,
          "lift": -1.3,
          "valPerGold": -0.19
        },
        {
          "item": "boots_speed",
          "name": "Boots of Speed",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 6.6,
          "lift": -0.8,
          "valPerGold": -0.13
        },
        {
          "item": "stone_good_luck",
          "name": "Stone of Good Luck",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 6.3,
          "lift": -1.1,
          "valPerGold": -0.18
        },
        {
          "item": "wand_web",
          "name": "Wand of Web",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 5.3,
          "lift": -2.1,
          "valPerGold": -0.35
        }
      ],
      "bestValueItems": [
        {
          "item": "boots_speed",
          "name": "Boots of Speed",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 6.6,
          "lift": -0.8,
          "valPerGold": -0.13
        },
        {
          "item": "stone_good_luck",
          "name": "Stone of Good Luck",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 6.3,
          "lift": -1.1,
          "valPerGold": -0.18
        },
        {
          "item": "staff_woodlands",
          "name": "Staff of the Woodlands",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 6.1,
          "lift": -1.3,
          "valPerGold": -0.19
        }
      ]
    },
    "mother_laurel": {
      "key": "mother_laurel",
      "name": "Mother Laurel",
      "role": "Tank",
      "cls": "Paladin",
      "avgScore": 38.4,
      "avgWR": 40,
      "midWR": 100,
      "lateWR": 0,
      "avgDmg": 160,
      "avgHeal": 86,
      "avgWard": 0,
      "avgGold": 0.6,
      "survPct": 40,
      "avgTime": 13.4,
      "liveRank": 18,
      "baseRank": 7,
      "rankDelta": -11,
      "baseScore": 41.6,
      "scoreDelta": -3.2,
      "changeStatus": "rebal",
      "archetype": "Melee Cleave Drain Tank (Paladin / Druid Hybrid)",
      "useCase": "Rebuilt in v0.23 as a true **Range 1 Melee Cleave Drain Tank** who swings thorny sweeps across adjacent enemies, heals through Bloom, and bridges Paladin `Smite` + Druid `Wild Shape` synergy hooks. Pair with Sir Dane, Juniper, or Kaska.",
      "changes": [
        {
          "type": "rebal",
          "text": "Reworked to Range 1 melee cleave tank with thorny sweeps, Radiant Smite hooks, and Wild Shape synergy."
        },
        {
          "type": "rebal",
          "text": "Streamlined 1-line Specializations (`Bountiful Vines` / `Thorn Cleave`) with zero text bloat."
        }
      ],
      "paths": {
        "key": "mother_laurel",
        "p0": {
          "k": "overgrowth_ward",
          "n": "Overgrowth Ward",
          "score": 35.1,
          "wr": 40
        },
        "p1": {
          "k": "bountiful_vines",
          "n": "Bountiful Vines",
          "score": 34.7,
          "wr": 40
        },
        "winner": "Even"
      },
      "bestPartners": [
        {
          "partner": "faelan",
          "name": "Faelan",
          "sharedKw": [],
          "score": 16.5,
          "winRate": 0,
          "lift": -25.3,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "dane",
          "name": "Sir Dane",
          "sharedKw": [
            "smite",
            "aura"
          ],
          "score": 7.2,
          "winRate": 0,
          "lift": -30.3,
          "why": "Shared smite & aura Class Keyword engine chains triggers across both kits."
        },
        {
          "partner": "arthur",
          "name": "Arthur",
          "sharedKw": [],
          "score": 8.9,
          "winRate": 0,
          "lift": -32.2,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "wallaby",
          "name": "Wallaby",
          "sharedKw": [],
          "score": 7.3,
          "winRate": 0,
          "lift": -32.3,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        }
      ],
      "bestItems": [
        {
          "item": "holy_symbol_ravenkind",
          "name": "Holy Symbol of Ravenkind",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 4.2,
          "lift": 0.2,
          "valPerGold": 0.03
        },
        {
          "item": "sun_blade",
          "name": "Sun Blade",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 4.2,
          "lift": 0.2,
          "valPerGold": 0.03
        },
        {
          "item": "boots_speed",
          "name": "Boots of Speed",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 4.8,
          "lift": 0.8,
          "valPerGold": 0.13
        },
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 4.4,
          "lift": 0.4,
          "valPerGold": 0.07
        }
      ],
      "bestValueItems": [
        {
          "item": "boots_speed",
          "name": "Boots of Speed",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 4.8,
          "lift": 0.8,
          "valPerGold": 0.13
        },
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 4.4,
          "lift": 0.4,
          "valPerGold": 0.07
        },
        {
          "item": "sword_sharpness",
          "name": "Sword of Sharpness",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 4.3,
          "lift": 0.3,
          "valPerGold": 0.05
        }
      ]
    },
    "nettle": {
      "key": "nettle",
      "name": "Nettle",
      "role": "Support",
      "cls": "Warlock",
      "avgScore": 38.2,
      "avgWR": 40,
      "midWR": 100,
      "lateWR": 0,
      "avgDmg": 232,
      "avgHeal": 0,
      "avgWard": 29,
      "avgGold": 0.3,
      "survPct": 40,
      "avgTime": 12.3,
      "liveRank": 19,
      "baseRank": 13,
      "rankDelta": -6,
      "baseScore": 37.6,
      "scoreDelta": 0.6,
      "changeStatus": "buff",
      "archetype": "Infernal Hex Shredder & Hellfire Warlock",
      "useCase": "Reworked into an Infernal Pact Hex caster who curses priority targets so every allied hit deals bonus necrotic damage, then unleashes Hellfire & Pact Boon Charge/heal surges when cursed foes fall. Devastating alongside rapid attackers (Naill, Corvin, Arthur).",
      "changes": [
        {
          "type": "buff",
          "text": "Reworked kit: Infernal Hex + Hellfire burst + Pact Boon Charge/heal trigger on cursed enemy death."
        },
        {
          "type": "rebal",
          "text": "Unified under canonical `Eldritch Pact` keyword with clean 1-line Specializations."
        }
      ],
      "paths": {
        "key": "nettle",
        "p0": {
          "k": "fine_print",
          "n": "Fine Print",
          "score": 34.9,
          "wr": 40
        },
        "p1": {
          "k": "dark_bargain",
          "n": "Dark One’s Blessing",
          "score": 35,
          "wr": 40
        },
        "winner": "Even"
      },
      "bestPartners": [
        {
          "partner": "lumen",
          "name": "Lumen",
          "sharedKw": [
            "hex"
          ],
          "score": 9,
          "winRate": 0,
          "lift": -31.1,
          "why": "Shared hex Class Keyword engine chains triggers across both kits."
        },
        {
          "partner": "bram",
          "name": "Bram",
          "sharedKw": [],
          "score": 10.2,
          "winRate": 0,
          "lift": -30.7,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "arthur",
          "name": "Arthur",
          "sharedKw": [],
          "score": 8.2,
          "winRate": 0,
          "lift": -32.8,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "wallaby",
          "name": "Wallaby",
          "sharedKw": [],
          "score": 7.2,
          "winRate": 0,
          "lift": -32.3,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        }
      ],
      "bestItems": [
        {
          "item": "rod_pact_keeper",
          "name": "Rod of the Pact Keeper",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 6.3,
          "lift": 1.8,
          "valPerGold": 0.26
        },
        {
          "item": "staff_withering",
          "name": "Staff of Withering",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 5.7,
          "lift": 1.2,
          "valPerGold": 0.17
        },
        {
          "item": "bag_holding",
          "name": "Bag of Holding",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 6.2,
          "lift": 1.7,
          "valPerGold": 0.28
        },
        {
          "item": "glamoured_leather",
          "name": "Glamoured Studded Leather",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 5.4,
          "lift": 0.9,
          "valPerGold": 0.15
        }
      ],
      "bestValueItems": [
        {
          "item": "bag_holding",
          "name": "Bag of Holding",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 6.2,
          "lift": 1.7,
          "valPerGold": 0.28
        },
        {
          "item": "rod_pact_keeper",
          "name": "Rod of the Pact Keeper",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 6.3,
          "lift": 1.8,
          "valPerGold": 0.26
        },
        {
          "item": "staff_withering",
          "name": "Staff of Withering",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 5.7,
          "lift": 1.2,
          "valPerGold": 0.17
        }
      ]
    },
    "zark": {
      "key": "zark",
      "name": "Zark",
      "role": "Tank",
      "cls": "Barbarian",
      "avgScore": 37.5,
      "avgWR": 40,
      "midWR": 100,
      "lateWR": 0,
      "avgDmg": 260,
      "avgHeal": 146,
      "avgWard": 0,
      "avgGold": 0.3,
      "survPct": 20,
      "avgTime": 15.2,
      "liveRank": 20,
      "baseRank": 14,
      "rankDelta": -6,
      "baseScore": 35.8,
      "scoreDelta": 1.7,
      "changeStatus": "buff",
      "archetype": "Bear Rage Frontline Bruiser & Relentless Endurance Tank",
      "useCase": "Unstoppable melee brawler who gets deadlier the longer he fights. Zark’s `Relentless Endurance` sits at priority #2 in v0.23’s Lethal-Revive order (survives fatal hits at 1 HP!), and `Bear Rage` stacks physical mitigation + self-heal cleaves.",
      "changes": [
        {
          "type": "buff",
          "text": "Unified under `Rage` keyword; `Relentless Endurance` obeys exact v0.23 Lethal-Revive priority (survives at 1 HP)."
        },
        {
          "type": "rebal",
          "text": "1-line Specializations (`Totem of the Bear` / `Reckless Cleave`) and opt-in Quest."
        }
      ],
      "paths": {
        "key": "zark",
        "p0": {
          "k": "relentless_bear",
          "n": "Relentless Bear",
          "score": 36,
          "wr": 40
        },
        "p1": {
          "k": "totem_roar",
          "n": "Totem Roar",
          "score": 32.9,
          "wr": 40
        },
        "winner": "Relentless Bear"
      },
      "bestPartners": [
        {
          "partner": "faelan",
          "name": "Faelan",
          "sharedKw": [],
          "score": 51.6,
          "winRate": 50,
          "lift": 10.3,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "pillar",
          "name": "Pillar",
          "sharedKw": [
            "rage"
          ],
          "score": 11.7,
          "winRate": 0,
          "lift": -25.6,
          "why": "Shared rage Class Keyword engine chains triggers across both kits."
        },
        {
          "partner": "wallaby",
          "name": "Wallaby",
          "sharedKw": [],
          "score": 12.2,
          "winRate": 0,
          "lift": -26.9,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "arthur",
          "name": "Arthur",
          "sharedKw": [],
          "score": 8.8,
          "winRate": 0,
          "lift": -31.8,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        }
      ],
      "bestItems": [
        {
          "item": "periapt_wound_closure",
          "name": "Periapt of Wound Closure",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 4.7,
          "lift": 0.1,
          "valPerGold": 0.01
        },
        {
          "item": "berserker_axe",
          "name": "Berserker Axe",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 4.2,
          "lift": -0.4,
          "valPerGold": -0.06
        },
        {
          "item": "sword_sharpness",
          "name": "Sword of Sharpness",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 4.9,
          "lift": 0.3,
          "valPerGold": 0.05
        },
        {
          "item": "boots_speed",
          "name": "Boots of Speed",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 4.3,
          "lift": -0.3,
          "valPerGold": -0.05
        }
      ],
      "bestValueItems": [
        {
          "item": "sword_sharpness",
          "name": "Sword of Sharpness",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 4.9,
          "lift": 0.3,
          "valPerGold": 0.05
        },
        {
          "item": "periapt_wound_closure",
          "name": "Periapt of Wound Closure",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 4.7,
          "lift": 0.1,
          "valPerGold": 0.01
        },
        {
          "item": "boots_speed",
          "name": "Boots of Speed",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 4.3,
          "lift": -0.3,
          "valPerGold": -0.05
        }
      ]
    },
    "pillar": {
      "key": "pillar",
      "name": "Pillar",
      "role": "Tank",
      "cls": "Barbarian",
      "avgScore": 37.1,
      "avgWR": 40,
      "midWR": 100,
      "lateWR": 0,
      "avgDmg": 407,
      "avgHeal": 0,
      "avgWard": 0,
      "avgGold": 0.3,
      "survPct": 10,
      "avgTime": 21.4,
      "liveRank": 21,
      "baseRank": 17,
      "rankDelta": -4,
      "baseScore": 33,
      "scoreDelta": 4.1,
      "changeStatus": "rebal",
      "archetype": "Stone-Colossus Meatshield & Anti-Spike Tank",
      "useCase": "Immovable Goliath tank whose Stone’s Endurance shaves flat damage off heavy Act 2–3 boss blows, and whose opt-in Quest transforms him into a Large 2×2 Living Colossus that shields your entire backline.",
      "changes": [
        {
          "type": "rebal",
          "text": "Unified under `Rage` / Stone’s Endurance with Cubed AC/SR synergy; armor & HP gear scale dramatically on him."
        },
        {
          "type": "rebal",
          "text": "1-line Specializations (`Stone Bulwark` / `Earthshaker`) and opt-in 2×2 Colossus Quest."
        }
      ],
      "paths": {
        "key": "pillar",
        "p0": {
          "k": "unstoppable_faith",
          "n": "Unstoppable Faith",
          "score": 35.1,
          "wr": 40
        },
        "p1": {
          "k": "living_beacon",
          "n": "Living Beacon",
          "score": 33.8,
          "wr": 40
        },
        "winner": "Unstoppable Faith"
      },
      "bestPartners": [
        {
          "partner": "faelan",
          "name": "Faelan",
          "sharedKw": [],
          "score": 17.1,
          "winRate": 0,
          "lift": -24,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "zark",
          "name": "Zark",
          "sharedKw": [
            "rage"
          ],
          "score": 9.8,
          "winRate": 0,
          "lift": -27.5,
          "why": "Shared rage Class Keyword engine chains triggers across both kits."
        },
        {
          "partner": "arthur",
          "name": "Arthur",
          "sharedKw": [],
          "score": 9.8,
          "winRate": 0,
          "lift": -30.7,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "wallaby",
          "name": "Wallaby",
          "sharedKw": [],
          "score": 7.4,
          "winRate": 0,
          "lift": -31.5,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        }
      ],
      "bestItems": [
        {
          "item": "sword_sharpness",
          "name": "Sword of Sharpness",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 9.9,
          "lift": 3.5,
          "valPerGold": 0.58
        },
        {
          "item": "periapt_wound_closure",
          "name": "Periapt of Wound Closure",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 7.1,
          "lift": 0.7,
          "valPerGold": 0.1
        },
        {
          "item": "boots_speed",
          "name": "Boots of Speed",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 9.1,
          "lift": 2.7,
          "valPerGold": 0.45
        },
        {
          "item": "berserker_axe",
          "name": "Berserker Axe",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 7,
          "lift": 0.6,
          "valPerGold": 0.09
        }
      ],
      "bestValueItems": [
        {
          "item": "sword_sharpness",
          "name": "Sword of Sharpness",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 9.9,
          "lift": 3.5,
          "valPerGold": 0.58
        },
        {
          "item": "boots_speed",
          "name": "Boots of Speed",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 9.1,
          "lift": 2.7,
          "valPerGold": 0.45
        },
        {
          "item": "periapt_wound_closure",
          "name": "Periapt of Wound Closure",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 7.1,
          "lift": 0.7,
          "valPerGold": 0.1
        }
      ]
    },
    "dane": {
      "key": "dane",
      "name": "Sir Dane",
      "role": "Tank",
      "cls": "Paladin",
      "avgScore": 36.7,
      "avgWR": 40,
      "midWR": 100,
      "lateWR": 0,
      "avgDmg": 200,
      "avgHeal": 0,
      "avgWard": 153,
      "avgGold": 0,
      "survPct": 30,
      "avgTime": 14.6,
      "liveRank": 22,
      "baseRank": 6,
      "rankDelta": -16,
      "baseScore": 42.7,
      "scoreDelta": -6,
      "changeStatus": "rebal",
      "archetype": "Aura Tank, Radiant Smite Anchor & 2×2 Mount Scaler",
      "useCase": "The gold-standard Paladin frontline anchor. Sir Dane’s Aura adds +AC/+SR directly inside the Cubed AC/SR sweet spot, while his Divine Smite deals **Radiant true damage** that bypasses high-AC Act 2–3 bosses like Giant Crab, Orcus, and Tiamat completely.",
      "changes": [
        {
          "type": "buff",
          "text": "Divine Smite now deals true **Radiant** damage, bypassing both AC and SR on heavily armored bosses."
        },
        {
          "type": "rebal",
          "text": "Aura of Protection shines on the Cubed AC/SR curve (`K=14`), turning +2 AC/SR into massive effective HP."
        },
        {
          "type": "rebal",
          "text": "Opt-in Quest (`Find Steed`): transforms Sir Dane into a Large 2×2 mounted colossus."
        }
      ],
      "paths": {
        "key": "dane",
        "p0": {
          "k": "oath_devotion",
          "n": "Oath of Devotion",
          "score": 32,
          "wr": 40
        },
        "p1": {
          "k": "aura_protection",
          "n": "Aura of Protection",
          "score": 35.2,
          "wr": 40
        },
        "winner": "Aura of Protection"
      },
      "bestPartners": [
        {
          "partner": "faelan",
          "name": "Faelan",
          "sharedKw": [],
          "score": 26.7,
          "winRate": 0,
          "lift": -14.2,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "mother_laurel",
          "name": "Mother Laurel",
          "sharedKw": [
            "aura",
            "smite"
          ],
          "score": 8.9,
          "winRate": 0,
          "lift": -28.6,
          "why": "Shared aura & smite Class Keyword engine chains triggers across both kits."
        },
        {
          "partner": "arthur",
          "name": "Arthur",
          "sharedKw": [],
          "score": 8.1,
          "winRate": 0,
          "lift": -32.1,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "wallaby",
          "name": "Wallaby",
          "sharedKw": [],
          "score": 8.1,
          "winRate": 0,
          "lift": -30.6,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        }
      ],
      "bestItems": [
        {
          "item": "sun_blade",
          "name": "Sun Blade",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 5.3,
          "lift": 0.9,
          "valPerGold": 0.13
        },
        {
          "item": "holy_symbol_ravenkind",
          "name": "Holy Symbol of Ravenkind",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 4.6,
          "lift": 0.2,
          "valPerGold": 0.03
        },
        {
          "item": "sword_sharpness",
          "name": "Sword of Sharpness",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 5.1,
          "lift": 0.7,
          "valPerGold": 0.12
        },
        {
          "item": "boots_speed",
          "name": "Boots of Speed",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 4.7,
          "lift": 0.3,
          "valPerGold": 0.05
        }
      ],
      "bestValueItems": [
        {
          "item": "sun_blade",
          "name": "Sun Blade",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 5.3,
          "lift": 0.9,
          "valPerGold": 0.13
        },
        {
          "item": "sword_sharpness",
          "name": "Sword of Sharpness",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 5.1,
          "lift": 0.7,
          "valPerGold": 0.12
        },
        {
          "item": "boots_speed",
          "name": "Boots of Speed",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 4.7,
          "lift": 0.3,
          "valPerGold": 0.05
        }
      ]
    },
    "zoe": {
      "key": "zoe",
      "name": "Zoe",
      "role": "Support",
      "cls": "Fighter",
      "avgScore": 36.2,
      "avgWR": 40,
      "midWR": 100,
      "lateWR": 0,
      "avgDmg": 50,
      "avgHeal": 0,
      "avgWard": 0,
      "avgGold": 0.3,
      "survPct": 0,
      "avgTime": 14.1,
      "liveRank": 23,
      "baseRank": 1,
      "rankDelta": -22,
      "baseScore": 51.8,
      "scoreDelta": -15.6,
      "changeStatus": "rebal",
      "archetype": "Artificer Action-Surge Accelerator & Rummage Crafter",
      "useCase": "High-tempo support Artificer whose v0.23 `Rummage` tosses **any random Common item** from the 12-item Common pool onto an ally for the fight (doubled by `Rune Carver`!), while triggering `Action Surge` loops with Gilthrax and Arthur.",
      "changes": [
        {
          "type": "rebal",
          "text": "Reworked `Rummage`: tosses a random Common item from the full 12-item Common pool (+1 extra with `Rune Carver`)."
        },
        {
          "type": "rebal",
          "text": "Unified under `Action Surge` with clean 1-line Specializations (`Just the Thing` / `Rune Carver`)."
        }
      ],
      "paths": {
        "key": "zoe",
        "p0": {
          "k": "rune_carver",
          "n": "Rune Carver",
          "score": 33.4,
          "wr": 40
        },
        "p1": {
          "k": "just_the_thing",
          "n": "Just the Thing",
          "score": 32.7,
          "wr": 40
        },
        "winner": "Even"
      },
      "bestPartners": [
        {
          "partner": "gilthrax",
          "name": "Gilthrax",
          "sharedKw": [
            "action_surge"
          ],
          "score": 11.8,
          "winRate": 0,
          "lift": -30.4,
          "why": "Shared action surge Class Keyword engine chains triggers across both kits."
        },
        {
          "partner": "arthur",
          "name": "Arthur",
          "sharedKw": [
            "action_surge"
          ],
          "score": 9.6,
          "winRate": 0,
          "lift": -30.4,
          "why": "Shared action surge Class Keyword engine chains triggers across both kits."
        },
        {
          "partner": "wallaby",
          "name": "Wallaby",
          "sharedKw": [],
          "score": 7.9,
          "winRate": 0,
          "lift": -30.6,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "bram",
          "name": "Bram",
          "sharedKw": [],
          "score": 6.8,
          "winRate": 0,
          "lift": -33.1,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        }
      ],
      "bestItems": [
        {
          "item": "flame_tongue",
          "name": "Flame Tongue",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 3.7,
          "lift": -0.2,
          "valPerGold": -0.03
        },
        {
          "item": "weapon_warning",
          "name": "Weapon of Warning",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 3.5,
          "lift": -0.4,
          "valPerGold": -0.06
        },
        {
          "item": "boots_speed",
          "name": "Boots of Speed",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 3.8,
          "lift": -0.1,
          "valPerGold": -0.02
        },
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 3.5,
          "lift": -0.4,
          "valPerGold": -0.07
        }
      ],
      "bestValueItems": [
        {
          "item": "boots_speed",
          "name": "Boots of Speed",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 3.8,
          "lift": -0.1,
          "valPerGold": -0.02
        },
        {
          "item": "flame_tongue",
          "name": "Flame Tongue",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 3.7,
          "lift": -0.2,
          "valPerGold": -0.03
        },
        {
          "item": "weapon_warning",
          "name": "Weapon of Warning",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 3.5,
          "lift": -0.4,
          "valPerGold": -0.06
        }
      ]
    },
    "toot": {
      "key": "toot",
      "name": "Toot",
      "role": "Support",
      "cls": "Bard",
      "avgScore": 33.9,
      "avgWR": 40,
      "midWR": 100,
      "lateWR": 0,
      "avgDmg": 2,
      "avgHeal": 0,
      "avgWard": 0,
      "avgGold": 1.5,
      "survPct": 30,
      "avgTime": 15.3,
      "liveRank": 24,
      "baseRank": 24,
      "rankDelta": 0,
      "baseScore": 29.2,
      "scoreDelta": 4.7,
      "changeStatus": "rebal",
      "archetype": "Stationary Musician (`0 ft`), Bounty Mote Bard & Economy Engine",
      "useCase": "Reworked in v0.23 into a **stationary (`ft: 0`), 0-damage musician** who plants in the backline, plays closest-ally Bardic Inspiration Motes (previewed during Deployment!), and generates combat bounty gold to fund Curio Uniques and Tier IV upgrades.",
      "changes": [
        {
          "type": "rebal",
          "text": "Reworked to stationary (`ft: 0`), 0-damage Brass Solo musician targeting closest ally with bounty Motes."
        },
        {
          "type": "rebal",
          "text": "Drives Pack 5 economy synergy cleanly alongside Gilthrax & Gains without infinite gold exploits."
        }
      ],
      "paths": {
        "key": "toot",
        "p0": {
          "k": "busker",
          "n": "Busker’s Rhythm",
          "score": 30.1,
          "wr": 40
        },
        "p1": {
          "k": "street_performer",
          "n": "Street Performer",
          "score": 31.5,
          "wr": 40
        },
        "winner": "Street Performer"
      },
      "bestPartners": [
        {
          "partner": "arthur",
          "name": "Arthur",
          "sharedKw": [],
          "score": 6.7,
          "winRate": 0,
          "lift": -32.1,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "rosalind",
          "name": "Rosalind",
          "sharedKw": [
            "bardic_inspiration"
          ],
          "score": 4.6,
          "winRate": 0,
          "lift": -32.4,
          "why": "Shared bardic inspiration Class Keyword engine chains triggers across both kits."
        },
        {
          "partner": "bram",
          "name": "Bram",
          "sharedKw": [],
          "score": 5.9,
          "winRate": 0,
          "lift": -32.9,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "wallaby",
          "name": "Wallaby",
          "sharedKw": [],
          "score": 5,
          "winRate": 0,
          "lift": -32.3,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        }
      ],
      "bestItems": [
        {
          "item": "horn_valhalla",
          "name": "Horn of Valhalla",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 3.2,
          "lift": 0.4,
          "valPerGold": 0.06
        },
        {
          "item": "pipes_haunting",
          "name": "Pipes of Haunting",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 3.1,
          "lift": 0.3,
          "valPerGold": 0.04
        },
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 2.6,
          "lift": -0.2,
          "valPerGold": -0.03
        },
        {
          "item": "bag_holding",
          "name": "Bag of Holding",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 2.3,
          "lift": -0.5,
          "valPerGold": -0.08
        }
      ],
      "bestValueItems": [
        {
          "item": "horn_valhalla",
          "name": "Horn of Valhalla",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 3.2,
          "lift": 0.4,
          "valPerGold": 0.06
        },
        {
          "item": "pipes_haunting",
          "name": "Pipes of Haunting",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 3.1,
          "lift": 0.3,
          "valPerGold": 0.04
        },
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 2.6,
          "lift": -0.2,
          "valPerGold": -0.03
        }
      ]
    }
  },
  "items": [
    {
      "key": "stone_str",
      "name": "Stone of Strength",
      "r": 0,
      "rarity": "Common",
      "price": 3,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.011,
      "valPerGold": 0.004,
      "topCarriers": [
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": 1.1,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "stone_dex",
      "name": "Stone of Dexterity",
      "r": 0,
      "rarity": "Common",
      "price": 3,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.007,
      "valPerGold": 0.002,
      "topCarriers": [
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": 0.7,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "stone_con",
      "name": "Stone of Constitution",
      "r": 0,
      "rarity": "Common",
      "price": 3,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.009,
      "valPerGold": 0.003,
      "topCarriers": [
        {
          "hero": "zark",
          "name": "Zark",
          "lift": 0.9,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "stone_int",
      "name": "Stone of Intelligence",
      "r": 0,
      "rarity": "Common",
      "price": 3,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.027,
      "valPerGold": 0.009,
      "topCarriers": [
        {
          "hero": "faelan",
          "name": "Faelan",
          "lift": 2.7,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "stone_wis",
      "name": "Stone of Wisdom",
      "r": 0,
      "rarity": "Common",
      "price": 3,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": -0.013,
      "valPerGold": -0.004,
      "topCarriers": [
        {
          "hero": "bram",
          "name": "Bram",
          "lift": -1.3,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "stone_cha",
      "name": "Stone of Charisma",
      "r": 0,
      "rarity": "Common",
      "price": 3,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": -0.006,
      "valPerGold": -0.002,
      "topCarriers": [
        {
          "hero": "dane",
          "name": "Sir Dane",
          "lift": -0.6,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "weapon_p1",
      "name": "+1 Weapon",
      "r": 0,
      "rarity": "Common",
      "price": 3,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.005,
      "valPerGold": 0.002,
      "topCarriers": [
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": 0.5,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "gloves_quickness",
      "name": "Gloves of Quickness",
      "r": 0,
      "rarity": "Common",
      "price": 3,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.007,
      "valPerGold": 0.002,
      "topCarriers": [
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": 0.7,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "shield",
      "name": "Shield",
      "r": 0,
      "rarity": "Common",
      "price": 3,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.001,
      "valPerGold": 0,
      "topCarriers": [
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": 0.1,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "cloak_protection",
      "name": "Cloak of Protection",
      "r": 0,
      "rarity": "Common",
      "price": 3,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.022,
      "valPerGold": 0.007,
      "topCarriers": [
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": 2.2,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "leather_armor",
      "name": "Leather Armor",
      "r": 0,
      "rarity": "Common",
      "price": 3,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.006,
      "valPerGold": 0.002,
      "topCarriers": [
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": 0.6,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "ring_warmth",
      "name": "Ring of Warmth",
      "r": 0,
      "rarity": "Common",
      "price": 3,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.006,
      "valPerGold": 0.002,
      "topCarriers": [
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": 0.6,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "breastplate",
      "name": "Breastplate",
      "r": 1,
      "rarity": "Uncommon",
      "price": 4,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.001,
      "valPerGold": 0,
      "topCarriers": [
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": 0.1,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "mantle_spell_resistance",
      "name": "Mantle of Spell Resistance",
      "r": 1,
      "rarity": "Uncommon",
      "price": 4,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.005,
      "valPerGold": 0.001,
      "topCarriers": [
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": 0.5,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "gauntlets_ogre",
      "name": "Gauntlets of Ogre Power",
      "r": 1,
      "rarity": "Uncommon",
      "price": 4,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.005,
      "valPerGold": 0.001,
      "topCarriers": [
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": 0.5,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "boots_striding",
      "name": "Boots of Striding",
      "r": 1,
      "rarity": "Uncommon",
      "price": 4,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.01,
      "valPerGold": 0.003,
      "topCarriers": [
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": 1,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "boots_elvenkind",
      "name": "Boots of Elvenkind",
      "r": 1,
      "rarity": "Uncommon",
      "price": 4,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.004,
      "valPerGold": 0.001,
      "topCarriers": [
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": 0.4,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "gloves_thievery",
      "name": "Gloves of Thievery",
      "r": 1,
      "rarity": "Uncommon",
      "price": 4,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.004,
      "valPerGold": 0.001,
      "topCarriers": [
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": 0.4,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "belt_dwarvenkind",
      "name": "Belt of Dwarvenkind",
      "r": 1,
      "rarity": "Uncommon",
      "price": 4,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.01,
      "valPerGold": 0.003,
      "topCarriers": [
        {
          "hero": "zark",
          "name": "Zark",
          "lift": 1,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "ring_protection",
      "name": "Ring of Protection",
      "r": 1,
      "rarity": "Uncommon",
      "price": 4,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.009,
      "valPerGold": 0.002,
      "topCarriers": [
        {
          "hero": "velith",
          "name": "Velith",
          "lift": 0.9,
          "kwMatch": false
        },
        {
          "hero": "corvin",
          "name": "Corvin",
          "lift": 0.8,
          "kwMatch": false
        },
        {
          "hero": "wallaby",
          "name": "Wallaby",
          "lift": 0.3,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "whetstone_growth",
      "name": "Whetstone of Growth",
      "r": 1,
      "rarity": "Uncommon",
      "price": 4,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.009,
      "valPerGold": 0.002,
      "topCarriers": [
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": 0.9,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "quicksilver_vial",
      "name": "Quicksilver Vial",
      "r": 1,
      "rarity": "Uncommon",
      "price": 4,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.017,
      "valPerGold": 0.004,
      "topCarriers": [
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": 1.7,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "heartwood_seed",
      "name": "Heartwood Seed",
      "r": 1,
      "rarity": "Uncommon",
      "price": 4,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.009,
      "valPerGold": 0.002,
      "topCarriers": [
        {
          "hero": "zark",
          "name": "Zark",
          "lift": 0.9,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "tome_compounding",
      "name": "Tome of Compounding",
      "r": 1,
      "rarity": "Uncommon",
      "price": 4,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.014,
      "valPerGold": 0.003,
      "topCarriers": [
        {
          "hero": "faelan",
          "name": "Faelan",
          "lift": 1.4,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "owls_astrolabe",
      "name": "Owl’s Astrolabe",
      "r": 1,
      "rarity": "Uncommon",
      "price": 4,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.016,
      "valPerGold": 0.004,
      "topCarriers": [
        {
          "hero": "bram",
          "name": "Bram",
          "lift": 1.6,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "ledger_mint",
      "name": "Ledger of the Mint",
      "r": 1,
      "rarity": "Uncommon",
      "price": 4,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": -0.003,
      "valPerGold": -0.001,
      "topCarriers": [
        {
          "hero": "dane",
          "name": "Sir Dane",
          "lift": -0.3,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "wand_magic_missiles",
      "name": "Wand of Magic Missiles",
      "r": 1,
      "rarity": "Uncommon",
      "price": 4,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.017,
      "valPerGold": 0.004,
      "topCarriers": [
        {
          "hero": "faelan",
          "name": "Faelan",
          "lift": 1.7,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "ring_mind_shielding",
      "name": "Ring of Mind Shielding",
      "r": 1,
      "rarity": "Uncommon",
      "price": 4,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.007,
      "valPerGold": 0.002,
      "topCarriers": [
        {
          "hero": "faelan",
          "name": "Faelan",
          "lift": 0.7,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "goggles_night",
      "name": "Goggles of Night",
      "r": 1,
      "rarity": "Uncommon",
      "price": 4,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.032,
      "valPerGold": 0.008,
      "topCarriers": [
        {
          "hero": "bram",
          "name": "Bram",
          "lift": 3.2,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "gem_brightness",
      "name": "Gem of Brightness",
      "r": 1,
      "rarity": "Uncommon",
      "price": 4,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.021,
      "valPerGold": 0.005,
      "topCarriers": [
        {
          "hero": "bram",
          "name": "Bram",
          "lift": 2.1,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "brooch_shielding",
      "name": "Brooch of Shielding",
      "r": 1,
      "rarity": "Uncommon",
      "price": 4,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.002,
      "valPerGold": 0.001,
      "topCarriers": [
        {
          "hero": "dane",
          "name": "Sir Dane",
          "lift": 0.2,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "circlet_blasting",
      "name": "Circlet of Blasting",
      "r": 1,
      "rarity": "Uncommon",
      "price": 4,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.013,
      "valPerGold": 0.003,
      "topCarriers": [
        {
          "hero": "dane",
          "name": "Sir Dane",
          "lift": 1.3,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "plate_armor",
      "name": "Plate Armor",
      "r": 2,
      "rarity": "Rare",
      "price": 6,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.014,
      "valPerGold": 0.002,
      "topCarriers": [
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": 1.4,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "sword_sharpness",
      "name": "Sword of Sharpness",
      "r": 2,
      "rarity": "Rare",
      "price": 6,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.035,
      "valPerGold": 0.006,
      "topCarriers": [
        {
          "hero": "pillar",
          "name": "Pillar",
          "lift": 3.5,
          "kwMatch": false
        },
        {
          "hero": "gilthrax",
          "name": "Gilthrax",
          "lift": 3.5,
          "kwMatch": false
        },
        {
          "hero": "bram",
          "name": "Bram",
          "lift": 1.5,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "boots_speed",
      "name": "Boots of Speed",
      "r": 2,
      "rarity": "Rare",
      "price": 6,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.057,
      "valPerGold": 0.009,
      "topCarriers": [
        {
          "hero": "gilthrax",
          "name": "Gilthrax",
          "lift": 5.7,
          "kwMatch": false
        },
        {
          "hero": "naill",
          "name": "Naill",
          "lift": 3.1,
          "kwMatch": false
        },
        {
          "hero": "pillar",
          "name": "Pillar",
          "lift": 2.7,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "vicious_bow",
      "name": "Vicious Bow",
      "r": 2,
      "rarity": "Rare",
      "price": 6,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.008,
      "valPerGold": 0.001,
      "topCarriers": [
        {
          "hero": "lorcan",
          "name": "Lorcan",
          "lift": 0.8,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "cloak_displacement",
      "name": "Cloak of Displacement",
      "r": 2,
      "rarity": "Rare",
      "price": 6,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.018,
      "valPerGold": 0.003,
      "topCarriers": [
        {
          "hero": "naill",
          "name": "Naill",
          "lift": 1.8,
          "kwMatch": false
        },
        {
          "hero": "lorcan",
          "name": "Lorcan",
          "lift": 1.4,
          "kwMatch": false
        },
        {
          "hero": "lumen",
          "name": "Lumen",
          "lift": 1.1,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "amulet_health",
      "name": "Amulet of Health",
      "r": 2,
      "rarity": "Rare",
      "price": 6,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.022,
      "valPerGold": 0.004,
      "topCarriers": [
        {
          "hero": "zark",
          "name": "Zark",
          "lift": 2.2,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "potion_healing",
      "name": "Potion of Greater Healing",
      "r": 2,
      "rarity": "Rare",
      "price": 6,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.006,
      "valPerGold": 0.001,
      "topCarriers": [
        {
          "hero": "zark",
          "name": "Zark",
          "lift": 0.6,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "ring_spell_storing",
      "name": "Ring of Spell Storing",
      "r": 2,
      "rarity": "Rare",
      "price": 6,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.025,
      "valPerGold": 0.004,
      "topCarriers": [
        {
          "hero": "faelan",
          "name": "Faelan",
          "lift": 2.5,
          "kwMatch": false
        },
        {
          "hero": "gains",
          "name": "Gains",
          "lift": -0.8,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "wand_web",
      "name": "Wand of Web",
      "r": 2,
      "rarity": "Rare",
      "price": 6,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0,
      "valPerGold": 0,
      "topCarriers": [
        {
          "hero": "faelan",
          "name": "Faelan",
          "lift": 0,
          "kwMatch": false
        },
        {
          "hero": "gains",
          "name": "Gains",
          "lift": 0,
          "kwMatch": false
        },
        {
          "hero": "saint",
          "name": "Saint",
          "lift": -0.6,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "stone_good_luck",
      "name": "Stone of Good Luck",
      "r": 2,
      "rarity": "Rare",
      "price": 6,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0,
      "valPerGold": 0,
      "topCarriers": [
        {
          "hero": "saint",
          "name": "Saint",
          "lift": 0,
          "kwMatch": false
        },
        {
          "hero": "juniper",
          "name": "Juniper",
          "lift": -1.1,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "glamoured_leather",
      "name": "Glamoured Studded Leather",
      "r": 2,
      "rarity": "Rare",
      "price": 6,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.009,
      "valPerGold": 0.002,
      "topCarriers": [
        {
          "hero": "nettle",
          "name": "Nettle",
          "lift": 0.9,
          "kwMatch": false
        },
        {
          "hero": "lumen",
          "name": "Lumen",
          "lift": 0.8,
          "kwMatch": false
        },
        {
          "hero": "rosalind",
          "name": "Rosalind",
          "lift": 0.4,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "bag_holding",
      "name": "Bag of Holding",
      "r": 2,
      "rarity": "Rare",
      "price": 6,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.017,
      "valPerGold": 0.003,
      "topCarriers": [
        {
          "hero": "nettle",
          "name": "Nettle",
          "lift": 1.7,
          "kwMatch": false
        },
        {
          "hero": "lumen",
          "name": "Lumen",
          "lift": 1.1,
          "kwMatch": false
        },
        {
          "hero": "rosalind",
          "name": "Rosalind",
          "lift": 0.6,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "dwarven_plate",
      "name": "Dwarven Plate",
      "r": 3,
      "rarity": "Very Rare",
      "price": 9,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.041,
      "valPerGold": 0.005,
      "topCarriers": [
        {
          "hero": "zark",
          "name": "Zark",
          "lift": 4.1,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "ring_regeneration",
      "name": "Ring of Regeneration",
      "r": 3,
      "rarity": "Very Rare",
      "price": 9,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": -0.015,
      "valPerGold": -0.002,
      "topCarriers": [
        {
          "hero": "zark",
          "name": "Zark",
          "lift": -1.5,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "belt_fire_giant",
      "name": "Belt of Fire Giant Strength",
      "r": 3,
      "rarity": "Very Rare",
      "price": 9,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.032,
      "valPerGold": 0.004,
      "topCarriers": [
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": 3.2,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "frost_brand",
      "name": "Frost Brand",
      "r": 3,
      "rarity": "Very Rare",
      "price": 9,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.031,
      "valPerGold": 0.003,
      "topCarriers": [
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": 3.1,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "scimitar_speed",
      "name": "Scimitar of Speed",
      "r": 3,
      "rarity": "Very Rare",
      "price": 9,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.054,
      "valPerGold": 0.006,
      "topCarriers": [
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": 5.4,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "ring_evasion",
      "name": "Ring of Evasion",
      "r": 3,
      "rarity": "Very Rare",
      "price": 9,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.006,
      "valPerGold": 0.001,
      "topCarriers": [
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": 0.6,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "staff_power",
      "name": "Staff of Power",
      "r": 3,
      "rarity": "Very Rare",
      "price": 9,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.011,
      "valPerGold": 0.001,
      "topCarriers": [
        {
          "hero": "faelan",
          "name": "Faelan",
          "lift": 1.1,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "headband_intellect",
      "name": "Headband of Intellect",
      "r": 3,
      "rarity": "Very Rare",
      "price": 9,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": -0.003,
      "valPerGold": 0,
      "topCarriers": [
        {
          "hero": "faelan",
          "name": "Faelan",
          "lift": -0.3,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "tome_understanding",
      "name": "Tome of Understanding",
      "r": 3,
      "rarity": "Very Rare",
      "price": 9,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.036,
      "valPerGold": 0.004,
      "topCarriers": [
        {
          "hero": "bram",
          "name": "Bram",
          "lift": 3.6,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "cloak_arachnida",
      "name": "Cloak of Arachnida",
      "r": 3,
      "rarity": "Very Rare",
      "price": 9,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.045,
      "valPerGold": 0.005,
      "topCarriers": [
        {
          "hero": "bram",
          "name": "Bram",
          "lift": 4.5,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "robe_stars",
      "name": "Robe of Stars",
      "r": 3,
      "rarity": "Very Rare",
      "price": 9,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0,
      "valPerGold": 0,
      "topCarriers": [
        {
          "hero": "dane",
          "name": "Sir Dane",
          "lift": 0,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "staff_fire",
      "name": "Staff of Fire",
      "r": 3,
      "rarity": "Very Rare",
      "price": 9,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.018,
      "valPerGold": 0.002,
      "topCarriers": [
        {
          "hero": "rosalind",
          "name": "Rosalind",
          "lift": 1.8,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "belt_storm_giant",
      "name": "Belt of Storm Giant Strength",
      "r": 4,
      "rarity": "Legendary",
      "price": 13,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.025,
      "valPerGold": 0.002,
      "topCarriers": [
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": 2.5,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "vorpal_sword",
      "name": "Vorpal Sword",
      "r": 4,
      "rarity": "Legendary",
      "price": 13,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.024,
      "valPerGold": 0.002,
      "topCarriers": [
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": 2.4,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "armor_invulnerability",
      "name": "Armor of Invulnerability",
      "r": 4,
      "rarity": "Legendary",
      "price": 13,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.008,
      "valPerGold": 0.001,
      "topCarriers": [
        {
          "hero": "zark",
          "name": "Zark",
          "lift": 0.8,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "blackrazor",
      "name": "Blackrazor",
      "r": 4,
      "rarity": "Legendary",
      "price": 13,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.018,
      "valPerGold": 0.001,
      "topCarriers": [
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": 1.8,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "staff_magi",
      "name": "Staff of the Magi",
      "r": 4,
      "rarity": "Legendary",
      "price": 13,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.082,
      "valPerGold": 0.006,
      "topCarriers": [
        {
          "hero": "faelan",
          "name": "Faelan",
          "lift": 8.2,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "robe_archmagi",
      "name": "Robe of the Archmagi",
      "r": 4,
      "rarity": "Legendary",
      "price": 13,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.014,
      "valPerGold": 0.001,
      "topCarriers": [
        {
          "hero": "faelan",
          "name": "Faelan",
          "lift": 1.4,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "luck_blade",
      "name": "Luck Blade",
      "r": 4,
      "rarity": "Legendary",
      "price": 13,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.008,
      "valPerGold": 0.001,
      "topCarriers": [
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": 0.8,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "holy_avenger",
      "name": "Holy Avenger",
      "r": 4,
      "rarity": "Legendary",
      "price": 13,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.027,
      "valPerGold": 0.002,
      "topCarriers": [
        {
          "hero": "dane",
          "name": "Sir Dane",
          "lift": 2.7,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "weapon_warning",
      "name": "Weapon of Warning",
      "r": 5,
      "rarity": "Unique",
      "price": 7,
      "kwHooks": [
        "action_surge"
      ],
      "clsLock": "Fighter",
      "bestDelta": 0.032,
      "valPerGold": 0.005,
      "topCarriers": [
        {
          "hero": "gilthrax",
          "name": "Gilthrax",
          "lift": 3.2,
          "kwMatch": true
        },
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": 1,
          "kwMatch": true
        },
        {
          "hero": "zoe",
          "name": "Zoe",
          "lift": -0.4,
          "kwMatch": true
        }
      ]
    },
    {
      "key": "flame_tongue",
      "name": "Flame Tongue",
      "r": 5,
      "rarity": "Unique",
      "price": 7,
      "kwHooks": [
        "action_surge"
      ],
      "clsLock": "Fighter",
      "bestDelta": 0.01,
      "valPerGold": 0.001,
      "topCarriers": [
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": 1,
          "kwMatch": true
        },
        {
          "hero": "gilthrax",
          "name": "Gilthrax",
          "lift": 1,
          "kwMatch": true
        },
        {
          "hero": "zoe",
          "name": "Zoe",
          "lift": -0.2,
          "kwMatch": true
        }
      ]
    },
    {
      "key": "periapt_wound_closure",
      "name": "Periapt of Wound Closure",
      "r": 5,
      "rarity": "Unique",
      "price": 7,
      "kwHooks": [
        "rage"
      ],
      "clsLock": "Barbarian",
      "bestDelta": 0.007,
      "valPerGold": 0.001,
      "topCarriers": [
        {
          "hero": "pillar",
          "name": "Pillar",
          "lift": 0.7,
          "kwMatch": true
        },
        {
          "hero": "zark",
          "name": "Zark",
          "lift": 0.1,
          "kwMatch": true
        }
      ]
    },
    {
      "key": "berserker_axe",
      "name": "Berserker Axe",
      "r": 5,
      "rarity": "Unique",
      "price": 7,
      "kwHooks": [
        "rage"
      ],
      "clsLock": "Barbarian",
      "bestDelta": 0.006,
      "valPerGold": 0.001,
      "topCarriers": [
        {
          "hero": "pillar",
          "name": "Pillar",
          "lift": 0.6,
          "kwMatch": true
        },
        {
          "hero": "zark",
          "name": "Zark",
          "lift": -0.4,
          "kwMatch": true
        }
      ]
    },
    {
      "key": "holy_symbol_ravenkind",
      "name": "Holy Symbol of Ravenkind",
      "r": 5,
      "rarity": "Unique",
      "price": 7,
      "kwHooks": [
        "smite"
      ],
      "clsLock": "Paladin",
      "bestDelta": 0.002,
      "valPerGold": 0,
      "topCarriers": [
        {
          "hero": "dane",
          "name": "Sir Dane",
          "lift": 0.2,
          "kwMatch": true
        },
        {
          "hero": "mother_laurel",
          "name": "Mother Laurel",
          "lift": 0.2,
          "kwMatch": true
        }
      ]
    },
    {
      "key": "sun_blade",
      "name": "Sun Blade",
      "r": 5,
      "rarity": "Unique",
      "price": 7,
      "kwHooks": [
        "smite"
      ],
      "clsLock": "Paladin",
      "bestDelta": 0.009,
      "valPerGold": 0.001,
      "topCarriers": [
        {
          "hero": "dane",
          "name": "Sir Dane",
          "lift": 0.9,
          "kwMatch": true
        },
        {
          "hero": "mother_laurel",
          "name": "Mother Laurel",
          "lift": 0.2,
          "kwMatch": true
        },
        {
          "hero": "corvin",
          "name": "Corvin",
          "lift": 0,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "amulet_devout",
      "name": "Amulet of the Devout",
      "r": 5,
      "rarity": "Unique",
      "price": 7,
      "kwHooks": [
        "channel_divinity"
      ],
      "clsLock": "Cleric",
      "bestDelta": -0.001,
      "valPerGold": 0,
      "topCarriers": [
        {
          "hero": "bram",
          "name": "Bram",
          "lift": -0.1,
          "kwMatch": true
        },
        {
          "hero": "jamison",
          "name": "Brother Jamison",
          "lift": -0.2,
          "kwMatch": true
        },
        {
          "hero": "saint",
          "name": "Saint",
          "lift": -0.9,
          "kwMatch": true
        }
      ]
    },
    {
      "key": "staff_healing",
      "name": "Staff of Healing",
      "r": 5,
      "rarity": "Unique",
      "price": 7,
      "kwHooks": [
        "channel_divinity"
      ],
      "clsLock": "Cleric",
      "bestDelta": 0.021,
      "valPerGold": 0.003,
      "topCarriers": [
        {
          "hero": "bram",
          "name": "Bram",
          "lift": 2.1,
          "kwMatch": true
        },
        {
          "hero": "jamison",
          "name": "Brother Jamison",
          "lift": -0.2,
          "kwMatch": true
        },
        {
          "hero": "saint",
          "name": "Saint",
          "lift": -0.7,
          "kwMatch": true
        }
      ]
    },
    {
      "key": "pearl_power",
      "name": "Pearl of Power",
      "r": 5,
      "rarity": "Unique",
      "price": 7,
      "kwHooks": [
        "arcane_recovery"
      ],
      "clsLock": "Wizard",
      "bestDelta": 0.003,
      "valPerGold": 0,
      "topCarriers": [
        {
          "hero": "gains",
          "name": "Gains",
          "lift": 0.3,
          "kwMatch": true
        },
        {
          "hero": "faelan",
          "name": "Faelan",
          "lift": -0.4,
          "kwMatch": true
        }
      ]
    },
    {
      "key": "arcane_grimoire",
      "name": "Arcane Grimoire",
      "r": 5,
      "rarity": "Unique",
      "price": 7,
      "kwHooks": [
        "arcane_recovery"
      ],
      "clsLock": "Wizard",
      "bestDelta": 0.035,
      "valPerGold": 0.005,
      "topCarriers": [
        {
          "hero": "faelan",
          "name": "Faelan",
          "lift": 3.5,
          "kwMatch": true
        },
        {
          "hero": "gains",
          "name": "Gains",
          "lift": 0.6,
          "kwMatch": true
        }
      ]
    },
    {
      "key": "bracers_archery",
      "name": "Bracers of Archery",
      "r": 5,
      "rarity": "Unique",
      "price": 7,
      "kwHooks": [
        "hunters_mark"
      ],
      "clsLock": "Ranger",
      "bestDelta": 0.016,
      "valPerGold": 0.002,
      "topCarriers": [
        {
          "hero": "corvin",
          "name": "Corvin",
          "lift": 1.6,
          "kwMatch": true
        },
        {
          "hero": "lorcan",
          "name": "Lorcan",
          "lift": 1.2,
          "kwMatch": true
        }
      ]
    },
    {
      "key": "oathbow",
      "name": "Oathbow",
      "r": 5,
      "rarity": "Unique",
      "price": 7,
      "kwHooks": [
        "hunters_mark"
      ],
      "clsLock": "Ranger",
      "bestDelta": 0.024,
      "valPerGold": 0.003,
      "topCarriers": [
        {
          "hero": "lorcan",
          "name": "Lorcan",
          "lift": 2.4,
          "kwMatch": true
        }
      ]
    },
    {
      "key": "cloak_elvenkind",
      "name": "Cloak of Elvenkind",
      "r": 5,
      "rarity": "Unique",
      "price": 7,
      "kwHooks": [
        "sneak_attack"
      ],
      "clsLock": "Rogue",
      "bestDelta": 0.012,
      "valPerGold": 0.002,
      "topCarriers": [
        {
          "hero": "wallaby",
          "name": "Wallaby",
          "lift": 1.2,
          "kwMatch": true
        },
        {
          "hero": "velith",
          "name": "Velith",
          "lift": 0.3,
          "kwMatch": true
        }
      ]
    },
    {
      "key": "dagger_venom",
      "name": "Dagger of Venom",
      "r": 5,
      "rarity": "Unique",
      "price": 7,
      "kwHooks": [
        "sneak_attack"
      ],
      "clsLock": "Rogue",
      "bestDelta": 0.013,
      "valPerGold": 0.002,
      "topCarriers": [
        {
          "hero": "velith",
          "name": "Velith",
          "lift": 1.3,
          "kwMatch": true
        },
        {
          "hero": "wallaby",
          "name": "Wallaby",
          "lift": 1.1,
          "kwMatch": true
        }
      ]
    },
    {
      "key": "dragonhide_belt",
      "name": "Dragonhide Belt",
      "r": 5,
      "rarity": "Unique",
      "price": 7,
      "kwHooks": [
        "ki"
      ],
      "clsLock": "Monk",
      "bestDelta": 0.003,
      "valPerGold": 0,
      "topCarriers": [
        {
          "hero": "naill",
          "name": "Naill",
          "lift": 0.3,
          "kwMatch": true
        }
      ]
    },
    {
      "key": "staff_striking",
      "name": "Staff of Striking",
      "r": 5,
      "rarity": "Unique",
      "price": 7,
      "kwHooks": [
        "ki"
      ],
      "clsLock": "Monk",
      "bestDelta": 0.007,
      "valPerGold": 0.001,
      "topCarriers": [
        {
          "hero": "naill",
          "name": "Naill",
          "lift": 0.7,
          "kwMatch": true
        }
      ]
    },
    {
      "key": "pipes_haunting",
      "name": "Pipes of Haunting",
      "r": 5,
      "rarity": "Unique",
      "price": 7,
      "kwHooks": [
        "bardic_inspiration"
      ],
      "clsLock": "Bard",
      "bestDelta": 0.003,
      "valPerGold": 0,
      "topCarriers": [
        {
          "hero": "toot",
          "name": "Toot",
          "lift": 0.3,
          "kwMatch": true
        },
        {
          "hero": "rosalind",
          "name": "Rosalind",
          "lift": -0.2,
          "kwMatch": true
        }
      ]
    },
    {
      "key": "horn_valhalla",
      "name": "Horn of Valhalla",
      "r": 5,
      "rarity": "Unique",
      "price": 7,
      "kwHooks": [
        "bardic_inspiration"
      ],
      "clsLock": "Bard",
      "bestDelta": 0.018,
      "valPerGold": 0.003,
      "topCarriers": [
        {
          "hero": "rosalind",
          "name": "Rosalind",
          "lift": 1.8,
          "kwMatch": true
        },
        {
          "hero": "toot",
          "name": "Toot",
          "lift": 0.4,
          "kwMatch": true
        }
      ]
    },
    {
      "key": "moon_sickle",
      "name": "Moon Sickle",
      "r": 5,
      "rarity": "Unique",
      "price": 7,
      "kwHooks": [
        "wild_shape"
      ],
      "clsLock": "Druid",
      "bestDelta": 0,
      "valPerGold": 0,
      "topCarriers": [
        {
          "hero": "kaska",
          "name": "Kaska",
          "lift": 0,
          "kwMatch": true
        }
      ]
    },
    {
      "key": "staff_woodlands",
      "name": "Staff of the Woodlands",
      "r": 5,
      "rarity": "Unique",
      "price": 7,
      "kwHooks": [
        "wild_shape"
      ],
      "clsLock": "Druid",
      "bestDelta": 0.002,
      "valPerGold": 0,
      "topCarriers": [
        {
          "hero": "kaska",
          "name": "Kaska",
          "lift": 0.2,
          "kwMatch": true
        },
        {
          "hero": "juniper",
          "name": "Juniper",
          "lift": -1.3,
          "kwMatch": true
        }
      ]
    },
    {
      "key": "bloodwell_vial",
      "name": "Bloodwell Vial",
      "r": 5,
      "rarity": "Unique",
      "price": 7,
      "kwHooks": [
        "metamagic"
      ],
      "clsLock": "Sorcerer",
      "bestDelta": -0.008,
      "valPerGold": -0.001,
      "topCarriers": [
        {
          "hero": "cinder",
          "name": "Cinder",
          "lift": -0.8,
          "kwMatch": true
        }
      ]
    },
    {
      "key": "wand_fireballs",
      "name": "Wand of Fireballs",
      "r": 5,
      "rarity": "Unique",
      "price": 7,
      "kwHooks": [
        "metamagic"
      ],
      "clsLock": "Sorcerer",
      "bestDelta": -0.023,
      "valPerGold": -0.003,
      "topCarriers": [
        {
          "hero": "cinder",
          "name": "Cinder",
          "lift": -2.3,
          "kwMatch": true
        }
      ]
    },
    {
      "key": "rod_pact_keeper",
      "name": "Rod of the Pact Keeper",
      "r": 5,
      "rarity": "Unique",
      "price": 7,
      "kwHooks": [
        "hex"
      ],
      "clsLock": "Warlock",
      "bestDelta": 0.018,
      "valPerGold": 0.003,
      "topCarriers": [
        {
          "hero": "nettle",
          "name": "Nettle",
          "lift": 1.8,
          "kwMatch": true
        },
        {
          "hero": "lumen",
          "name": "Lumen",
          "lift": 1.1,
          "kwMatch": true
        }
      ]
    },
    {
      "key": "staff_withering",
      "name": "Staff of Withering",
      "r": 5,
      "rarity": "Unique",
      "price": 7,
      "kwHooks": [
        "hex"
      ],
      "clsLock": "Warlock",
      "bestDelta": 0.025,
      "valPerGold": 0.004,
      "topCarriers": [
        {
          "hero": "lumen",
          "name": "Lumen",
          "lift": 2.5,
          "kwMatch": true
        },
        {
          "hero": "nettle",
          "name": "Nettle",
          "lift": 1.2,
          "kwMatch": true
        }
      ]
    }
  ],
  "comps": [
    {
      "name": "Action Surge Armory",
      "heroes": [
        "gilthrax",
        "arthur",
        "zoe",
        "rosalind"
      ],
      "avgScore": 15.5,
      "winRate": 0,
      "avgTime": 25.8,
      "avgGold": 0
    },
    {
      "name": "Arcane Recovery Battery",
      "heroes": [
        "gilthrax",
        "faelan",
        "gains",
        "zoe"
      ],
      "avgScore": 12.3,
      "winRate": 0,
      "avgTime": 33.8,
      "avgGold": 2.3
    },
    {
      "name": "Wild Shape Moon & Land",
      "heroes": [
        "mother_laurel",
        "kaska",
        "juniper",
        "velith"
      ],
      "avgScore": 9.8,
      "winRate": 0,
      "avgTime": 16.6,
      "avgGold": 0
    },
    {
      "name": "Pack 5 Market Cartel",
      "heroes": [
        "gilthrax",
        "zoe",
        "toot",
        "gains"
      ],
      "avgScore": 7.3,
      "winRate": 0,
      "avgTime": 16.3,
      "avgGold": 0.7
    },
    {
      "name": "Tavern Classic Core",
      "heroes": [
        "bram",
        "arthur",
        "faelan",
        "wallaby"
      ],
      "avgScore": 6.4,
      "winRate": 0,
      "avgTime": 32.6,
      "avgGold": 0
    },
    {
      "name": "Anti-Heal Necrosis Control",
      "heroes": [
        "pillar",
        "saint",
        "nettle",
        "juniper"
      ],
      "avgScore": 5.6,
      "winRate": 0,
      "avgTime": 13.4,
      "avgGold": 0
    },
    {
      "name": "Backline Dive & Evasion",
      "heroes": [
        "arthur",
        "wallaby",
        "velith",
        "naill"
      ],
      "avgScore": 5.3,
      "winRate": 0,
      "avgTime": 14.6,
      "avgGold": 0
    },
    {
      "name": "Colossus & Artillery",
      "heroes": [
        "pillar",
        "cinder",
        "rosalind",
        "gains"
      ],
      "avgScore": 5.1,
      "winRate": 0,
      "avgTime": 18.5,
      "avgGold": 0.3
    },
    {
      "name": "Infernal Hex & Burn",
      "heroes": [
        "dane",
        "cinder",
        "lumen",
        "nettle"
      ],
      "avgScore": 4.9,
      "winRate": 0,
      "avgTime": 9.6,
      "avgGold": 0
    },
    {
      "name": "Hunter’s Mark Ambush",
      "heroes": [
        "zark",
        "corvin",
        "lorcan",
        "naill"
      ],
      "avgScore": 4.9,
      "winRate": 0,
      "avgTime": 12.5,
      "avgGold": 0
    },
    {
      "name": "Radiant Smite & Vines",
      "heroes": [
        "dane",
        "mother_laurel",
        "lumen",
        "bram"
      ],
      "avgScore": 3.7,
      "winRate": 0,
      "avgTime": 15.4,
      "avgGold": 0
    },
    {
      "name": "Bonded Frontline Aura",
      "heroes": [
        "dane",
        "zark",
        "jamison",
        "bram"
      ],
      "avgScore": 2.5,
      "winRate": 0,
      "avgTime": 28.3,
      "avgGold": 0
    }
  ],
  "bots": [
    {
      "id": "naive",
      "label": "Naive / Zero-Engine (Random Pick & Minimal Items)",
      "target": "< 15% WR",
      "liveWR": 46.7,
      "act1Clear": 53,
      "act2Clear": 53,
      "piggyBreak": 66.7,
      "avgGold": 144.7,
      "avgCampRank": 1,
      "avgHouseRules": 3.27,
      "avgEndCR": 89.5
    },
    {
      "id": "flat_only",
      "label": "Flat-Stats Only (Ignores Scaling Items & House Rules)",
      "target": "15–35% WR",
      "liveWR": 6.7,
      "act1Clear": 73,
      "act2Clear": 53,
      "piggyBreak": 100,
      "avgGold": 106.3,
      "avgCampRank": 1,
      "avgHouseRules": 0,
      "avgEndCR": 30.3
    },
    {
      "id": "competent",
      "label": "Competent Tactician (Balanced Squad, Camp Rank & Gear)",
      "target": "50–70% WR",
      "liveWR": 73.3,
      "act1Clear": 87,
      "act2Clear": 80,
      "piggyBreak": 53.3,
      "avgGold": 172.4,
      "avgCampRank": 2.73,
      "avgHouseRules": 5.2,
      "avgEndCR": 276.3
    },
    {
      "id": "engine",
      "label": "Engine Drafter (Keyword Synergy + Scaling + House Rules)",
      "target": "55–75% WR",
      "liveWR": 33.3,
      "act1Clear": 73,
      "act2Clear": 47,
      "piggyBreak": 86.7,
      "avgGold": 107.4,
      "avgCampRank": 3,
      "avgHouseRules": 4.33,
      "avgEndCR": 105.6
    },
    {
      "id": "greed",
      "label": "Pack 5 Market Greed (Economy Snowball + Camp Rank)",
      "target": "≤ 75% WR",
      "liveWR": 13.3,
      "act1Clear": 20,
      "act2Clear": 13,
      "piggyBreak": 86.7,
      "avgGold": 54.5,
      "avgCampRank": 2.53,
      "avgHouseRules": 2.27,
      "avgEndCR": 55.6
    }
  ],
  "bosses": [
    {
      "act": 1,
      "key": "glasstaff",
      "won": 0,
      "fought": 5,
      "winRate": 0
    },
    {
      "act": 1,
      "key": "nezznar",
      "won": 2,
      "fought": 5,
      "winRate": 40
    },
    {
      "act": 1,
      "key": "venomfang",
      "won": 0,
      "fought": 5,
      "winRate": 0
    },
    {
      "act": 2,
      "key": "blackrazor_boss",
      "won": 1,
      "fought": 5,
      "winRate": 20
    },
    {
      "act": 2,
      "key": "giant_crab",
      "won": 1,
      "fought": 5,
      "winRate": 20
    },
    {
      "act": 2,
      "key": "gynosphinx",
      "won": 0,
      "fought": 5,
      "winRate": 0
    },
    {
      "act": 2,
      "key": "keraptis",
      "won": 1,
      "fought": 5,
      "winRate": 20
    },
    {
      "act": 3,
      "key": "asmodeus",
      "won": 0,
      "fought": 5,
      "winRate": 0
    },
    {
      "act": 3,
      "key": "orcus",
      "won": 0,
      "fought": 5,
      "winRate": 0
    },
    {
      "act": 3,
      "key": "tiamat",
      "won": 0,
      "fought": 5,
      "winRate": 0
    }
  ],
  "crCorr": {
    "favoured": {
      "fights": 500,
      "wr": 98
    },
    "even": {
      "fights": 87,
      "wr": 64.4
    },
    "dangerous": {
      "fights": 26,
      "wr": 38.5
    },
    "deadly": {
      "fights": 16,
      "wr": 18.8
    }
  },
  "globalChanges": {
    "combat": [
      {
        "type": "buff",
        "tag": "Soft Lanes",
        "text": "Battlefields now feature **2–3 tactical Soft Lanes** with lane-aligned deployment zones, flank routing, and unobstructed arena readability."
      },
      {
        "type": "buff",
        "tag": "36 House Rules",
        "text": "Brand-new **House Rules** system (`6-slot cap` per run) offering run-defining passives, cross-class bridges, and rule twists across all 3 Acts."
      },
      {
        "type": "rebal",
        "tag": "Camp Rank & CR",
        "text": "Upgradeable **Camp Rank** progression in the Camp Shop unlocks higher-tier shop odds & scaling, paired with live **Party CR vs. Encounter CR** diagnostics."
      },
      {
        "type": "rebal",
        "tag": "Cubed AC/SR K=16",
        "text": "Defense curve recalibrated to `1 / (1 + (Eff / 16)^3)` alongside Cantrip tier-dice scaling (`1×/2×/3×/4×`), kit-scaled Charge, and systemic Burn/Poison scaling."
      },
      {
        "type": "rebal",
        "tag": "9 Epic Boons",
        "text": "Tier IV universal 1-of-3 **Epic Boon** picker + **12 Single-Class Multiclass Shrines** (`✧`) with no repeats per run."
      }
    ],
    "enemy": [
      {
        "type": "buff",
        "tag": "88 Six-Tier Items",
        "text": "64 Standard Shop items (including **6 new Uncommon Scaling items** with exact `+1/+3/+3/+4/+6` 6-attribute parity) + 24 **Curio Unique (5g)** relics."
      },
      {
        "type": "buff",
        "tag": "3 Full Acts",
        "text": "Act 1 **Phandalin** (Klarg Miniboss, 3 bosses), Act 2 **White Plume Mountain** (Dungeon Hazards + Vault Loot, 4 bosses), Act 3 **The Hells** (Wandering Pit Fiend + Orcus, Asmodeus, Tiamat)."
      },
      {
        "type": "rebal",
        "tag": "Combat UI Overhaul",
        "text": "Enlarged central arena, unobscured chunky health bars, left party strip, prominent **Gold Hub**, right **Unit Card + Battle Log** column, and scrollable post-fight summary."
      }
    ]
  }
};
