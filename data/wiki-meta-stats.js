/* Auto-generated v0.23 live meta telemetry & changelog for tools/wiki.html */
window.WIKI_META = {
  "version": "0.23 Live Build",
  "generatedAt": "2026-11-22",
  "heroes": {
    "gilthrax": {
      "key": "gilthrax",
      "name": "Gilthrax",
      "role": "Tank",
      "cls": "Fighter",
      "avgScore": 82,
      "avgWR": 90,
      "midWR": 100,
      "lateWR": 83.3,
      "avgDmg": 734,
      "avgHeal": 0,
      "avgWard": 1978,
      "avgGold": 0,
      "survPct": 90,
      "avgTime": 24.8,
      "liveRank": 1,
      "baseRank": 5,
      "rankDelta": 4,
      "baseScore": 43.5,
      "scoreDelta": 38.5,
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
          "score": 88.2,
          "wr": 100
        },
        "p1": {
          "k": "bodyguard_fee",
          "n": "Bodyguard’s Fee",
          "score": 75,
          "wr": 80
        },
        "winner": "Gilded Hoard"
      },
      "bestPartners": [
        {
          "partner": "faelan",
          "name": "Faelan",
          "sharedKw": [],
          "score": 92,
          "winRate": 100,
          "lift": 16.9,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "zoe",
          "name": "Zoe",
          "sharedKw": [
            "action_surge"
          ],
          "score": 81.8,
          "winRate": 100,
          "lift": 19.2,
          "why": "Shared action surge Class Keyword engine chains triggers across both kits."
        },
        {
          "partner": "wallaby",
          "name": "Wallaby",
          "sharedKw": [],
          "score": 78.5,
          "winRate": 100,
          "lift": 11.3,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "arthur",
          "name": "Arthur",
          "sharedKw": [
            "action_surge"
          ],
          "score": 74.4,
          "winRate": 100,
          "lift": 0.6,
          "why": "Shared action surge Class Keyword engine chains triggers across both kits."
        }
      ],
      "bestItems": [
        {
          "item": "weapon_warning",
          "name": "Weapon of Warning",
          "rarity": 5,
          "cost": 5,
          "kwMatch": true,
          "winRate": 100,
          "score": 77,
          "lift": 20.8,
          "valPerGold": 4.16
        },
        {
          "item": "sword_sharpness",
          "name": "Sword of Sharpness",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 100,
          "score": 75.6,
          "lift": 19.4,
          "valPerGold": 4.85
        },
        {
          "item": "boots_speed",
          "name": "Boots of Speed",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 100,
          "score": 72.1,
          "lift": 15.9,
          "valPerGold": 3.98
        },
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 100,
          "score": 69.8,
          "lift": 13.6,
          "valPerGold": 3.4
        }
      ],
      "bestValueItems": [
        {
          "item": "sword_sharpness",
          "name": "Sword of Sharpness",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 100,
          "score": 75.6,
          "lift": 19.4,
          "valPerGold": 4.85
        },
        {
          "item": "weapon_warning",
          "name": "Weapon of Warning",
          "rarity": 5,
          "cost": 5,
          "kwMatch": true,
          "winRate": 100,
          "score": 77,
          "lift": 20.8,
          "valPerGold": 4.16
        },
        {
          "item": "boots_speed",
          "name": "Boots of Speed",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 100,
          "score": 72.1,
          "lift": 15.9,
          "valPerGold": 3.98
        }
      ]
    },
    "lumen": {
      "key": "lumen",
      "name": "Lumen",
      "role": "Damage",
      "cls": "Warlock",
      "avgScore": 74.6,
      "avgWR": 70,
      "midWR": 100,
      "lateWR": 50,
      "avgDmg": 1050,
      "avgHeal": 36,
      "avgWard": 0,
      "avgGold": 0,
      "survPct": 70,
      "avgTime": 25,
      "liveRank": 2,
      "baseRank": 21,
      "rankDelta": 19,
      "baseScore": 32.4,
      "scoreDelta": 42.2,
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
          "score": 76,
          "wr": 80
        },
        "p1": {
          "k": "healing_light",
          "n": "Healing Light",
          "score": 69.4,
          "wr": 60
        },
        "winner": "Searing Focus"
      },
      "bestPartners": [
        {
          "partner": "nettle",
          "name": "Nettle",
          "sharedKw": [
            "hex"
          ],
          "score": 93.9,
          "winRate": 100,
          "lift": 28,
          "why": "Shared hex Class Keyword engine chains triggers across both kits."
        },
        {
          "partner": "bram",
          "name": "Bram",
          "sharedKw": [],
          "score": 61.5,
          "winRate": 50,
          "lift": 0,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "faelan",
          "name": "Faelan",
          "sharedKw": [],
          "score": 50.8,
          "winRate": 50,
          "lift": -20.6,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "dane",
          "name": "Sir Dane",
          "sharedKw": [],
          "score": 28.1,
          "winRate": 0,
          "lift": -41.7,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        }
      ],
      "bestItems": [
        {
          "item": "glamoured_leather",
          "name": "Glamoured Studded Leather",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 50,
          "score": 57.6,
          "lift": 32.5,
          "valPerGold": 8.13
        },
        {
          "item": "staff_withering",
          "name": "Staff of Withering",
          "rarity": 5,
          "cost": 5,
          "kwMatch": true,
          "winRate": 0,
          "score": 28,
          "lift": 2.9,
          "valPerGold": 0.58
        },
        {
          "item": "bag_holding",
          "name": "Bag of Holding",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 26.6,
          "lift": 1.5,
          "valPerGold": 0.38
        },
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 25.4,
          "lift": 0.3,
          "valPerGold": 0.07
        }
      ],
      "bestValueItems": [
        {
          "item": "glamoured_leather",
          "name": "Glamoured Studded Leather",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 50,
          "score": 57.6,
          "lift": 32.5,
          "valPerGold": 8.13
        },
        {
          "item": "staff_withering",
          "name": "Staff of Withering",
          "rarity": 5,
          "cost": 5,
          "kwMatch": true,
          "winRate": 0,
          "score": 28,
          "lift": 2.9,
          "valPerGold": 0.58
        },
        {
          "item": "bag_holding",
          "name": "Bag of Holding",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 26.6,
          "lift": 1.5,
          "valPerGold": 0.38
        }
      ]
    },
    "velith": {
      "key": "velith",
      "name": "Velith",
      "role": "Damage",
      "cls": "Rogue",
      "avgScore": 71.4,
      "avgWR": 60,
      "midWR": 100,
      "lateWR": 33.3,
      "avgDmg": 898,
      "avgHeal": 0,
      "avgWard": 0,
      "avgGold": 0,
      "survPct": 60,
      "avgTime": 24,
      "liveRank": 3,
      "baseRank": 2,
      "rankDelta": -1,
      "baseScore": 47.5,
      "scoreDelta": 23.9,
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
          "score": 71.3,
          "wr": 60
        },
        "p1": {
          "k": "nightshade",
          "n": "Nightshade Vials",
          "score": 67.7,
          "wr": 60
        },
        "winner": "First Blood"
      },
      "bestPartners": [
        {
          "partner": "bram",
          "name": "Bram",
          "sharedKw": [],
          "score": 71.6,
          "winRate": 50,
          "lift": 11.6,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "faelan",
          "name": "Faelan",
          "sharedKw": [],
          "score": 69,
          "winRate": 50,
          "lift": -0.8,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "dane",
          "name": "Sir Dane",
          "sharedKw": [],
          "score": 55.9,
          "winRate": 50,
          "lift": -12.3,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "wallaby",
          "name": "Wallaby",
          "sharedKw": [
            "sneak_attack"
          ],
          "score": 51.3,
          "winRate": 50,
          "lift": -10.6,
          "why": "Shared sneak attack Class Keyword engine chains triggers across both kits."
        }
      ],
      "bestItems": [
        {
          "item": "cloak_elvenkind",
          "name": "Cloak of Elvenkind",
          "rarity": 5,
          "cost": 5,
          "kwMatch": true,
          "winRate": 0,
          "score": 30.1,
          "lift": -14.2,
          "valPerGold": -2.84
        },
        {
          "item": "ring_protection",
          "name": "Ring of Protection",
          "rarity": 1,
          "cost": 3,
          "kwMatch": false,
          "winRate": 0,
          "score": 30.7,
          "lift": -13.6,
          "valPerGold": -4.53
        },
        {
          "item": "dagger_venom",
          "name": "Dagger of Venom",
          "rarity": 5,
          "cost": 5,
          "kwMatch": true,
          "winRate": 0,
          "score": 24.7,
          "lift": -19.6,
          "valPerGold": -3.92
        },
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 22.1,
          "lift": -22.2,
          "valPerGold": -5.55
        }
      ],
      "bestValueItems": [
        {
          "item": "cloak_elvenkind",
          "name": "Cloak of Elvenkind",
          "rarity": 5,
          "cost": 5,
          "kwMatch": true,
          "winRate": 0,
          "score": 30.1,
          "lift": -14.2,
          "valPerGold": -2.84
        },
        {
          "item": "dagger_venom",
          "name": "Dagger of Venom",
          "rarity": 5,
          "cost": 5,
          "kwMatch": true,
          "winRate": 0,
          "score": 24.7,
          "lift": -19.6,
          "valPerGold": -3.92
        },
        {
          "item": "ring_protection",
          "name": "Ring of Protection",
          "rarity": 1,
          "cost": 3,
          "kwMatch": false,
          "winRate": 0,
          "score": 30.7,
          "lift": -13.6,
          "valPerGold": -4.53
        }
      ]
    },
    "juniper": {
      "key": "juniper",
      "name": "Juniper",
      "role": "Support",
      "cls": "Druid",
      "avgScore": 70.8,
      "avgWR": 70,
      "midWR": 100,
      "lateWR": 50,
      "avgDmg": 475,
      "avgHeal": 130,
      "avgWard": 0,
      "avgGold": 0,
      "survPct": 70,
      "avgTime": 20.6,
      "liveRank": 4,
      "baseRank": 3,
      "rankDelta": -1,
      "baseScore": 46.9,
      "scoreDelta": 23.9,
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
          "score": 61.3,
          "wr": 60
        },
        "p1": {
          "k": "circle_land",
          "n": "Circle of the Land",
          "score": 78.2,
          "wr": 80
        },
        "winner": "Circle of the Land"
      },
      "bestPartners": [
        {
          "partner": "bram",
          "name": "Bram",
          "sharedKw": [],
          "score": 70,
          "winRate": 50,
          "lift": 10.4,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "arthur",
          "name": "Arthur",
          "sharedKw": [],
          "score": 55.2,
          "winRate": 50,
          "lift": -13,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "kaska",
          "name": "Kaska",
          "sharedKw": [
            "wild_shape"
          ],
          "score": 51.3,
          "winRate": 50,
          "lift": -16.1,
          "why": "Shared wild shape Class Keyword engine chains triggers across both kits."
        },
        {
          "partner": "wallaby",
          "name": "Wallaby",
          "sharedKw": [],
          "score": 47.5,
          "winRate": 50,
          "lift": -14.1,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        }
      ],
      "bestItems": [
        {
          "item": "staff_woodlands",
          "name": "Staff of the Woodlands",
          "rarity": 5,
          "cost": 5,
          "kwMatch": true,
          "winRate": 50,
          "score": 53.9,
          "lift": 20.4,
          "valPerGold": 4.08
        },
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 50,
          "score": 50.2,
          "lift": 16.7,
          "valPerGold": 4.17
        },
        {
          "item": "stone_good_luck",
          "name": "Stone of Good Luck",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 33.2,
          "lift": -0.3,
          "valPerGold": -0.07
        },
        {
          "item": "wand_web",
          "name": "Wand of Web",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 31,
          "lift": -2.5,
          "valPerGold": -0.63
        }
      ],
      "bestValueItems": [
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 50,
          "score": 50.2,
          "lift": 16.7,
          "valPerGold": 4.17
        },
        {
          "item": "staff_woodlands",
          "name": "Staff of the Woodlands",
          "rarity": 5,
          "cost": 5,
          "kwMatch": true,
          "winRate": 50,
          "score": 53.9,
          "lift": 20.4,
          "valPerGold": 4.08
        },
        {
          "item": "stone_good_luck",
          "name": "Stone of Good Luck",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 33.2,
          "lift": -0.3,
          "valPerGold": -0.07
        }
      ]
    },
    "faelan": {
      "key": "faelan",
      "name": "Faelan",
      "role": "Support",
      "cls": "Wizard",
      "avgScore": 68.2,
      "avgWR": 60,
      "midWR": 100,
      "lateWR": 33.3,
      "avgDmg": 133,
      "avgHeal": 0,
      "avgWard": 1734,
      "avgGold": 0,
      "survPct": 60,
      "avgTime": 26.9,
      "liveRank": 5,
      "baseRank": 11,
      "rankDelta": 6,
      "baseScore": 38.9,
      "scoreDelta": 29.3,
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
          "score": 66.2,
          "wr": 60
        },
        "p1": {
          "k": "spell_battery",
          "n": "Spell Battery",
          "score": 66.2,
          "wr": 60
        },
        "winner": "Even"
      },
      "bestPartners": [
        {
          "partner": "bram",
          "name": "Bram",
          "sharedKw": [],
          "score": 59.5,
          "winRate": 50,
          "lift": 1.1,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "gains",
          "name": "Gains",
          "sharedKw": [
            "arcane_recovery"
          ],
          "score": 51,
          "winRate": 50,
          "lift": -7.8,
          "why": "Shared arcane recovery Class Keyword engine chains triggers across both kits."
        },
        {
          "partner": "arthur",
          "name": "Arthur",
          "sharedKw": [],
          "score": 51.8,
          "winRate": 50,
          "lift": -15.2,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "wallaby",
          "name": "Wallaby",
          "sharedKw": [],
          "score": 45.7,
          "winRate": 50,
          "lift": -14.6,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        }
      ],
      "bestItems": [
        {
          "item": "ring_spell_storing",
          "name": "Ring of Spell Storing",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 50,
          "score": 59.5,
          "lift": 46.2,
          "valPerGold": 11.55
        },
        {
          "item": "arcane_grimoire",
          "name": "Arcane Grimoire",
          "rarity": 5,
          "cost": 5,
          "kwMatch": true,
          "winRate": 0,
          "score": 29.4,
          "lift": 16.1,
          "valPerGold": 3.22
        },
        {
          "item": "wand_web",
          "name": "Wand of Web",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 30.4,
          "lift": 17.1,
          "valPerGold": 4.28
        },
        {
          "item": "pearl_power",
          "name": "Pearl of Power",
          "rarity": 5,
          "cost": 5,
          "kwMatch": true,
          "winRate": 0,
          "score": 23.9,
          "lift": 10.6,
          "valPerGold": 2.12
        }
      ],
      "bestValueItems": [
        {
          "item": "ring_spell_storing",
          "name": "Ring of Spell Storing",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 50,
          "score": 59.5,
          "lift": 46.2,
          "valPerGold": 11.55
        },
        {
          "item": "wand_web",
          "name": "Wand of Web",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 30.4,
          "lift": 17.1,
          "valPerGold": 4.28
        },
        {
          "item": "arcane_grimoire",
          "name": "Arcane Grimoire",
          "rarity": 5,
          "cost": 5,
          "kwMatch": true,
          "winRate": 0,
          "score": 29.4,
          "lift": 16.1,
          "valPerGold": 3.22
        }
      ]
    },
    "corvin": {
      "key": "corvin",
      "name": "Corvin",
      "role": "Damage",
      "cls": "Ranger",
      "avgScore": 66.5,
      "avgWR": 60,
      "midWR": 100,
      "lateWR": 33.3,
      "avgDmg": 632,
      "avgHeal": 0,
      "avgWard": 0,
      "avgGold": 0,
      "survPct": 60,
      "avgTime": 25.8,
      "liveRank": 6,
      "baseRank": 16,
      "rankDelta": 10,
      "baseScore": 33.5,
      "scoreDelta": 33,
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
          "score": 67.4,
          "wr": 60
        },
        "p1": {
          "k": "first_strike",
          "n": "First Strike",
          "score": 60.5,
          "wr": 60
        },
        "winner": "Stalker’s Flurry"
      },
      "bestPartners": [
        {
          "partner": "faelan",
          "name": "Faelan",
          "sharedKw": [],
          "score": 71.8,
          "winRate": 50,
          "lift": 4.5,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "bram",
          "name": "Bram",
          "sharedKw": [],
          "score": 60.8,
          "winRate": 50,
          "lift": 3.3,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "dane",
          "name": "Sir Dane",
          "sharedKw": [],
          "score": 53.2,
          "winRate": 50,
          "lift": -12.5,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "lorcan",
          "name": "Lorcan",
          "sharedKw": [
            "hunters_mark"
          ],
          "score": 30.1,
          "winRate": 0,
          "lift": -32.6,
          "why": "Shared hunters mark Class Keyword engine chains triggers across both kits."
        }
      ],
      "bestItems": [
        {
          "item": "boots_speed",
          "name": "Boots of Speed",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 27.8,
          "lift": 18.3,
          "valPerGold": 4.58
        },
        {
          "item": "sun_blade",
          "name": "Sun Blade",
          "rarity": 5,
          "cost": 5,
          "kwMatch": false,
          "winRate": 0,
          "score": 20.9,
          "lift": 11.4,
          "valPerGold": 2.28
        },
        {
          "item": "bracers_archery",
          "name": "Bracers of Archery",
          "rarity": 5,
          "cost": 5,
          "kwMatch": true,
          "winRate": 0,
          "score": 17.5,
          "lift": 8,
          "valPerGold": 1.6
        },
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 15.4,
          "lift": 5.9,
          "valPerGold": 1.48
        }
      ],
      "bestValueItems": [
        {
          "item": "boots_speed",
          "name": "Boots of Speed",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 27.8,
          "lift": 18.3,
          "valPerGold": 4.58
        },
        {
          "item": "sun_blade",
          "name": "Sun Blade",
          "rarity": 5,
          "cost": 5,
          "kwMatch": false,
          "winRate": 0,
          "score": 20.9,
          "lift": 11.4,
          "valPerGold": 2.28
        },
        {
          "item": "bracers_archery",
          "name": "Bracers of Archery",
          "rarity": 5,
          "cost": 5,
          "kwMatch": true,
          "winRate": 0,
          "score": 17.5,
          "lift": 8,
          "valPerGold": 1.6
        }
      ]
    },
    "naill": {
      "key": "naill",
      "name": "Naill",
      "role": "Damage",
      "cls": "Monk",
      "avgScore": 66.3,
      "avgWR": 60,
      "midWR": 100,
      "lateWR": 33.3,
      "avgDmg": 594,
      "avgHeal": 0,
      "avgWard": 0,
      "avgGold": 0,
      "survPct": 30,
      "avgTime": 29.9,
      "liveRank": 7,
      "baseRank": 9,
      "rankDelta": 2,
      "baseScore": 40.6,
      "scoreDelta": 25.7,
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
          "score": 64.7,
          "wr": 60
        },
        "p1": {
          "k": "flowing_leaves",
          "n": "Flowing Leaves",
          "score": 63.1,
          "wr": 60
        },
        "winner": "Open Hand"
      },
      "bestPartners": [
        {
          "partner": "faelan",
          "name": "Faelan",
          "sharedKw": [],
          "score": 98.7,
          "winRate": 100,
          "lift": 31.5,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "juniper",
          "name": "Juniper",
          "sharedKw": [],
          "score": 68.2,
          "winRate": 50,
          "lift": -0.3,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "dane",
          "name": "Sir Dane",
          "sharedKw": [],
          "score": 57.3,
          "winRate": 50,
          "lift": -8.4,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "bram",
          "name": "Bram",
          "sharedKw": [],
          "score": 20.4,
          "winRate": 0,
          "lift": -37,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        }
      ],
      "bestItems": [
        {
          "item": "staff_striking",
          "name": "Staff of Striking",
          "rarity": 5,
          "cost": 5,
          "kwMatch": true,
          "winRate": 0,
          "score": 28.3,
          "lift": 10.1,
          "valPerGold": 2.02
        },
        {
          "item": "dragonhide_belt",
          "name": "Dragonhide Belt",
          "rarity": 5,
          "cost": 5,
          "kwMatch": true,
          "winRate": 0,
          "score": 19.6,
          "lift": 1.4,
          "valPerGold": 0.28
        },
        {
          "item": "boots_speed",
          "name": "Boots of Speed",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 20.5,
          "lift": 2.3,
          "valPerGold": 0.57
        },
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 19.3,
          "lift": 1.1,
          "valPerGold": 0.28
        }
      ],
      "bestValueItems": [
        {
          "item": "staff_striking",
          "name": "Staff of Striking",
          "rarity": 5,
          "cost": 5,
          "kwMatch": true,
          "winRate": 0,
          "score": 28.3,
          "lift": 10.1,
          "valPerGold": 2.02
        },
        {
          "item": "boots_speed",
          "name": "Boots of Speed",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 20.5,
          "lift": 2.3,
          "valPerGold": 0.57
        },
        {
          "item": "dragonhide_belt",
          "name": "Dragonhide Belt",
          "rarity": 5,
          "cost": 5,
          "kwMatch": true,
          "winRate": 0,
          "score": 19.6,
          "lift": 1.4,
          "valPerGold": 0.28
        }
      ]
    },
    "arthur": {
      "key": "arthur",
      "name": "Arthur",
      "role": "Damage",
      "cls": "Fighter",
      "avgScore": 65.7,
      "avgWR": 60,
      "midWR": 100,
      "lateWR": 33.3,
      "avgDmg": 523,
      "avgHeal": 0,
      "avgWard": 0,
      "avgGold": 0,
      "survPct": 40,
      "avgTime": 30.4,
      "liveRank": 8,
      "baseRank": 12,
      "rankDelta": 4,
      "baseScore": 38,
      "scoreDelta": 27.7,
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
          "score": 61.5,
          "wr": 60
        },
        "p1": {
          "k": "init_splash",
          "n": "Roll for Initiative",
          "score": 64.9,
          "wr": 60
        },
        "winner": "Roll for Initiative"
      },
      "bestPartners": [
        {
          "partner": "faelan",
          "name": "Faelan",
          "sharedKw": [],
          "score": 61.8,
          "winRate": 50,
          "lift": -5.2,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "gilthrax",
          "name": "Gilthrax",
          "sharedKw": [
            "action_surge"
          ],
          "score": 51.1,
          "winRate": 50,
          "lift": -22.7,
          "why": "Shared action surge Class Keyword engine chains triggers across both kits."
        },
        {
          "partner": "bram",
          "name": "Bram",
          "sharedKw": [],
          "score": 38.4,
          "winRate": 0,
          "lift": -18.7,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "zoe",
          "name": "Zoe",
          "sharedKw": [
            "action_surge"
          ],
          "score": 20.4,
          "winRate": 0,
          "lift": -34.1,
          "why": "Shared action surge Class Keyword engine chains triggers across both kits."
        }
      ],
      "bestItems": [
        {
          "item": "weapon_warning",
          "name": "Weapon of Warning",
          "rarity": 5,
          "cost": 5,
          "kwMatch": true,
          "winRate": 0,
          "score": 30.9,
          "lift": 15.7,
          "valPerGold": 3.14
        },
        {
          "item": "sword_sharpness",
          "name": "Sword of Sharpness",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 29.2,
          "lift": 14,
          "valPerGold": 3.5
        },
        {
          "item": "flame_tongue",
          "name": "Flame Tongue",
          "rarity": 5,
          "cost": 5,
          "kwMatch": true,
          "winRate": 0,
          "score": 24.6,
          "lift": 9.4,
          "valPerGold": 1.88
        },
        {
          "item": "boots_speed",
          "name": "Boots of Speed",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 25.2,
          "lift": 10,
          "valPerGold": 2.5
        }
      ],
      "bestValueItems": [
        {
          "item": "sword_sharpness",
          "name": "Sword of Sharpness",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 29.2,
          "lift": 14,
          "valPerGold": 3.5
        },
        {
          "item": "weapon_warning",
          "name": "Weapon of Warning",
          "rarity": 5,
          "cost": 5,
          "kwMatch": true,
          "winRate": 0,
          "score": 30.9,
          "lift": 15.7,
          "valPerGold": 3.14
        },
        {
          "item": "boots_speed",
          "name": "Boots of Speed",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 25.2,
          "lift": 10,
          "valPerGold": 2.5
        }
      ]
    },
    "dane": {
      "key": "dane",
      "name": "Sir Dane",
      "role": "Tank",
      "cls": "Paladin",
      "avgScore": 65,
      "avgWR": 70,
      "midWR": 100,
      "lateWR": 50,
      "avgDmg": 547,
      "avgHeal": 0,
      "avgWard": 785,
      "avgGold": 0,
      "survPct": 70,
      "avgTime": 19,
      "liveRank": 9,
      "baseRank": 6,
      "rankDelta": -3,
      "baseScore": 42.7,
      "scoreDelta": 22.3,
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
          "score": 55.2,
          "wr": 60
        },
        "p1": {
          "k": "aura_protection",
          "n": "Aura of Protection",
          "score": 71.3,
          "wr": 80
        },
        "winner": "Aura of Protection"
      },
      "bestPartners": [
        {
          "partner": "mother_laurel",
          "name": "Mother Laurel",
          "sharedKw": [
            "aura",
            "smite"
          ],
          "score": 63.9,
          "winRate": 50,
          "lift": 8.4,
          "why": "Shared aura & smite Class Keyword engine chains triggers across both kits."
        },
        {
          "partner": "faelan",
          "name": "Faelan",
          "sharedKw": [],
          "score": 55.9,
          "winRate": 50,
          "lift": -10.7,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "wallaby",
          "name": "Wallaby",
          "sharedKw": [],
          "score": 15.3,
          "winRate": 0,
          "lift": -43.4,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "arthur",
          "name": "Arthur",
          "sharedKw": [],
          "score": 14.4,
          "winRate": 0,
          "lift": -50.9,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        }
      ],
      "bestItems": [
        {
          "item": "boots_speed",
          "name": "Boots of Speed",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 16.4,
          "lift": 2.7,
          "valPerGold": 0.68
        },
        {
          "item": "sun_blade",
          "name": "Sun Blade",
          "rarity": 5,
          "cost": 5,
          "kwMatch": true,
          "winRate": 0,
          "score": 14.2,
          "lift": 0.5,
          "valPerGold": 0.1
        },
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 12.5,
          "lift": -1.2,
          "valPerGold": -0.3
        },
        {
          "item": "holy_symbol_ravenkind",
          "name": "Holy Symbol of Ravenkind",
          "rarity": 5,
          "cost": 5,
          "kwMatch": true,
          "winRate": 0,
          "score": 9.2,
          "lift": -4.5,
          "valPerGold": -0.9
        }
      ],
      "bestValueItems": [
        {
          "item": "boots_speed",
          "name": "Boots of Speed",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 16.4,
          "lift": 2.7,
          "valPerGold": 0.68
        },
        {
          "item": "sun_blade",
          "name": "Sun Blade",
          "rarity": 5,
          "cost": 5,
          "kwMatch": true,
          "winRate": 0,
          "score": 14.2,
          "lift": 0.5,
          "valPerGold": 0.1
        },
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 12.5,
          "lift": -1.2,
          "valPerGold": -0.3
        }
      ]
    },
    "jamison": {
      "key": "jamison",
      "name": "Brother Jamison",
      "role": "Support",
      "cls": "Cleric",
      "avgScore": 64.8,
      "avgWR": 50,
      "midWR": 100,
      "lateWR": 16.7,
      "avgDmg": 99,
      "avgHeal": 706,
      "avgWard": 308,
      "avgGold": 0,
      "survPct": 50,
      "avgTime": 23.2,
      "liveRank": 10,
      "baseRank": 10,
      "rankDelta": 0,
      "baseScore": 39.7,
      "scoreDelta": 25.1,
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
          "score": 57,
          "wr": 40
        },
        "p1": {
          "k": "radiant_link",
          "n": "Radiant Link",
          "score": 66.9,
          "wr": 60
        },
        "winner": "Radiant Link"
      },
      "bestPartners": [
        {
          "partner": "bram",
          "name": "Bram",
          "sharedKw": [
            "channel_divinity"
          ],
          "score": 58.1,
          "winRate": 50,
          "lift": 1.5,
          "why": "Shared channel divinity Class Keyword engine chains triggers across both kits."
        },
        {
          "partner": "saint",
          "name": "Saint",
          "sharedKw": [
            "channel_divinity"
          ],
          "score": 54.9,
          "winRate": 50,
          "lift": -2,
          "why": "Shared channel divinity Class Keyword engine chains triggers across both kits."
        },
        {
          "partner": "arthur",
          "name": "Arthur",
          "sharedKw": [],
          "score": 34.4,
          "winRate": 0,
          "lift": -30.9,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "wallaby",
          "name": "Wallaby",
          "sharedKw": [],
          "score": 24.3,
          "winRate": 0,
          "lift": -34.3,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        }
      ],
      "bestItems": [
        {
          "item": "amulet_devout",
          "name": "Amulet of the Devout",
          "rarity": 5,
          "cost": 5,
          "kwMatch": true,
          "winRate": 0,
          "score": 30.1,
          "lift": 12.3,
          "valPerGold": 2.46
        },
        {
          "item": "bag_holding",
          "name": "Bag of Holding",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 25.6,
          "lift": 7.8,
          "valPerGold": 1.95
        },
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 19,
          "lift": 1.2,
          "valPerGold": 0.3
        },
        {
          "item": "glamoured_leather",
          "name": "Glamoured Studded Leather",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 15.7,
          "lift": -2.1,
          "valPerGold": -0.53
        }
      ],
      "bestValueItems": [
        {
          "item": "amulet_devout",
          "name": "Amulet of the Devout",
          "rarity": 5,
          "cost": 5,
          "kwMatch": true,
          "winRate": 0,
          "score": 30.1,
          "lift": 12.3,
          "valPerGold": 2.46
        },
        {
          "item": "bag_holding",
          "name": "Bag of Holding",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 25.6,
          "lift": 7.8,
          "valPerGold": 1.95
        },
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 19,
          "lift": 1.2,
          "valPerGold": 0.3
        }
      ]
    },
    "kaska": {
      "key": "kaska",
      "name": "Kaska",
      "role": "Support",
      "cls": "Druid",
      "avgScore": 64.1,
      "avgWR": 60,
      "midWR": 100,
      "lateWR": 33.3,
      "avgDmg": 309,
      "avgHeal": 80,
      "avgWard": 0,
      "avgGold": 0,
      "survPct": 60,
      "avgTime": 20.3,
      "liveRank": 11,
      "baseRank": 4,
      "rankDelta": -7,
      "baseScore": 43.6,
      "scoreDelta": 20.5,
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
          "score": 61.5,
          "wr": 60
        },
        "p1": {
          "k": "pack_hunt",
          "n": "Pack Hunt",
          "score": 61.9,
          "wr": 60
        },
        "winner": "Even"
      },
      "bestPartners": [
        {
          "partner": "juniper",
          "name": "Juniper",
          "sharedKw": [
            "wild_shape"
          ],
          "score": 46.2,
          "winRate": 50,
          "lift": -21.2,
          "why": "Shared wild shape Class Keyword engine chains triggers across both kits."
        },
        {
          "partner": "arthur",
          "name": "Arthur",
          "sharedKw": [],
          "score": 27.8,
          "winRate": 0,
          "lift": -37.1,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "wallaby",
          "name": "Wallaby",
          "sharedKw": [],
          "score": 21.9,
          "winRate": 0,
          "lift": -36.4,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "bram",
          "name": "Bram",
          "sharedKw": [],
          "score": 20.3,
          "winRate": 0,
          "lift": -36,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        }
      ],
      "bestItems": [
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 16.2,
          "lift": 4.8,
          "valPerGold": 1.2
        },
        {
          "item": "moon_sickle",
          "name": "Moon Sickle",
          "rarity": 5,
          "cost": 5,
          "kwMatch": true,
          "winRate": 0,
          "score": 14.1,
          "lift": 2.7,
          "valPerGold": 0.54
        },
        {
          "item": "staff_woodlands",
          "name": "Staff of the Woodlands",
          "rarity": 5,
          "cost": 5,
          "kwMatch": true,
          "winRate": 0,
          "score": 13.6,
          "lift": 2.2,
          "valPerGold": 0.44
        },
        {
          "item": "boots_speed",
          "name": "Boots of Speed",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 14.5,
          "lift": 3.1,
          "valPerGold": 0.78
        }
      ],
      "bestValueItems": [
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 16.2,
          "lift": 4.8,
          "valPerGold": 1.2
        },
        {
          "item": "boots_speed",
          "name": "Boots of Speed",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 14.5,
          "lift": 3.1,
          "valPerGold": 0.78
        },
        {
          "item": "moon_sickle",
          "name": "Moon Sickle",
          "rarity": 5,
          "cost": 5,
          "kwMatch": true,
          "winRate": 0,
          "score": 14.1,
          "lift": 2.7,
          "valPerGold": 0.54
        }
      ]
    },
    "pillar": {
      "key": "pillar",
      "name": "Pillar",
      "role": "Tank",
      "cls": "Barbarian",
      "avgScore": 60.7,
      "avgWR": 70,
      "midWR": 100,
      "lateWR": 50,
      "avgDmg": 720,
      "avgHeal": 0,
      "avgWard": 0,
      "avgGold": 0,
      "survPct": 70,
      "avgTime": 20.8,
      "liveRank": 12,
      "baseRank": 17,
      "rankDelta": 5,
      "baseScore": 33,
      "scoreDelta": 27.7,
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
          "score": 60.3,
          "wr": 80
        },
        "p1": {
          "k": "living_beacon",
          "n": "Living Beacon",
          "score": 58.5,
          "wr": 60
        },
        "winner": "Unstoppable Faith"
      },
      "bestPartners": [
        {
          "partner": "zark",
          "name": "Zark",
          "sharedKw": [
            "rage"
          ],
          "score": 77,
          "winRate": 100,
          "lift": 21.4,
          "why": "Shared rage Class Keyword engine chains triggers across both kits."
        },
        {
          "partner": "faelan",
          "name": "Faelan",
          "sharedKw": [],
          "score": 74.7,
          "winRate": 100,
          "lift": 10.3,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "wallaby",
          "name": "Wallaby",
          "sharedKw": [],
          "score": 61,
          "winRate": 100,
          "lift": 4.5,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "arthur",
          "name": "Arthur",
          "sharedKw": [],
          "score": 50.8,
          "winRate": 50,
          "lift": -12.4,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        }
      ],
      "bestItems": [
        {
          "item": "berserker_axe",
          "name": "Berserker Axe",
          "rarity": 5,
          "cost": 5,
          "kwMatch": true,
          "winRate": 50,
          "score": 35.9,
          "lift": -13.5,
          "valPerGold": -2.7
        },
        {
          "item": "sword_sharpness",
          "name": "Sword of Sharpness",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 50,
          "score": 37.5,
          "lift": -11.9,
          "valPerGold": -2.98
        },
        {
          "item": "boots_speed",
          "name": "Boots of Speed",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 24.1,
          "lift": -25.3,
          "valPerGold": -6.33
        },
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 18.7,
          "lift": -30.7,
          "valPerGold": -7.67
        }
      ],
      "bestValueItems": [
        {
          "item": "berserker_axe",
          "name": "Berserker Axe",
          "rarity": 5,
          "cost": 5,
          "kwMatch": true,
          "winRate": 50,
          "score": 35.9,
          "lift": -13.5,
          "valPerGold": -2.7
        },
        {
          "item": "sword_sharpness",
          "name": "Sword of Sharpness",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 50,
          "score": 37.5,
          "lift": -11.9,
          "valPerGold": -2.98
        },
        {
          "item": "boots_speed",
          "name": "Boots of Speed",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 24.1,
          "lift": -25.3,
          "valPerGold": -6.33
        }
      ]
    },
    "lorcan": {
      "key": "lorcan",
      "name": "Lorcan",
      "role": "Damage",
      "cls": "Ranger",
      "avgScore": 58.9,
      "avgWR": 50,
      "midWR": 100,
      "lateWR": 16.7,
      "avgDmg": 451,
      "avgHeal": 0,
      "avgWard": 0,
      "avgGold": 0,
      "survPct": 50,
      "avgTime": 28.5,
      "liveRank": 13,
      "baseRank": 18,
      "rankDelta": 5,
      "baseScore": 32.9,
      "scoreDelta": 26,
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
          "score": 60.2,
          "wr": 60
        },
        "p1": {
          "k": "pack_hunter",
          "n": "Pack Hunter",
          "score": 51.6,
          "wr": 40
        },
        "winner": "Colossus Slayer"
      },
      "bestPartners": [
        {
          "partner": "bram",
          "name": "Bram",
          "sharedKw": [],
          "score": 58.1,
          "winRate": 50,
          "lift": 4.4,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "faelan",
          "name": "Faelan",
          "sharedKw": [],
          "score": 53,
          "winRate": 50,
          "lift": -10.5,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "dane",
          "name": "Sir Dane",
          "sharedKw": [],
          "score": 45,
          "winRate": 50,
          "lift": -17,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "corvin",
          "name": "Corvin",
          "sharedKw": [
            "hunters_mark"
          ],
          "score": 40.1,
          "winRate": 50,
          "lift": -22.6,
          "why": "Shared hunters mark Class Keyword engine chains triggers across both kits."
        }
      ],
      "bestItems": [
        {
          "item": "bracers_archery",
          "name": "Bracers of Archery",
          "rarity": 5,
          "cost": 5,
          "kwMatch": true,
          "winRate": 0,
          "score": 22,
          "lift": 2.5,
          "valPerGold": 0.5
        },
        {
          "item": "vicious_bow",
          "name": "Vicious Bow",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 22.4,
          "lift": 2.9,
          "valPerGold": 0.72
        },
        {
          "item": "oathbow",
          "name": "Oathbow",
          "rarity": 5,
          "cost": 5,
          "kwMatch": true,
          "winRate": 0,
          "score": 18.2,
          "lift": -1.3,
          "valPerGold": -0.26
        },
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 14.4,
          "lift": -5.1,
          "valPerGold": -1.27
        }
      ],
      "bestValueItems": [
        {
          "item": "vicious_bow",
          "name": "Vicious Bow",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 22.4,
          "lift": 2.9,
          "valPerGold": 0.72
        },
        {
          "item": "bracers_archery",
          "name": "Bracers of Archery",
          "rarity": 5,
          "cost": 5,
          "kwMatch": true,
          "winRate": 0,
          "score": 22,
          "lift": 2.5,
          "valPerGold": 0.5
        },
        {
          "item": "oathbow",
          "name": "Oathbow",
          "rarity": 5,
          "cost": 5,
          "kwMatch": true,
          "winRate": 0,
          "score": 18.2,
          "lift": -1.3,
          "valPerGold": -0.26
        }
      ]
    },
    "nettle": {
      "key": "nettle",
      "name": "Nettle",
      "role": "Support",
      "cls": "Warlock",
      "avgScore": 57.3,
      "avgWR": 60,
      "midWR": 100,
      "lateWR": 33.3,
      "avgDmg": 378,
      "avgHeal": 0,
      "avgWard": 48,
      "avgGold": 0,
      "survPct": 60,
      "avgTime": 15,
      "liveRank": 14,
      "baseRank": 13,
      "rankDelta": -1,
      "baseScore": 37.6,
      "scoreDelta": 19.7,
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
          "score": 53.4,
          "wr": 60
        },
        "p1": {
          "k": "dark_bargain",
          "n": "Dark One’s Blessing",
          "score": 56.4,
          "wr": 60
        },
        "winner": "Dark One’s Blessing"
      },
      "bestPartners": [
        {
          "partner": "bram",
          "name": "Bram",
          "sharedKw": [],
          "score": 61.2,
          "winRate": 50,
          "lift": 8.3,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "arthur",
          "name": "Arthur",
          "sharedKw": [],
          "score": 46.3,
          "winRate": 50,
          "lift": -15.2,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "lumen",
          "name": "Lumen",
          "sharedKw": [
            "hex"
          ],
          "score": 42.9,
          "winRate": 50,
          "lift": -23,
          "why": "Shared hex Class Keyword engine chains triggers across both kits."
        },
        {
          "partner": "wallaby",
          "name": "Wallaby",
          "sharedKw": [],
          "score": 15.7,
          "winRate": 0,
          "lift": -39.1,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        }
      ],
      "bestItems": [
        {
          "item": "bag_holding",
          "name": "Bag of Holding",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 19.9,
          "lift": 4.9,
          "valPerGold": 1.23
        },
        {
          "item": "staff_withering",
          "name": "Staff of Withering",
          "rarity": 5,
          "cost": 5,
          "kwMatch": true,
          "winRate": 0,
          "score": 13.6,
          "lift": -1.4,
          "valPerGold": -0.28
        },
        {
          "item": "rod_pact_keeper",
          "name": "Rod of the Pact Keeper",
          "rarity": 5,
          "cost": 5,
          "kwMatch": true,
          "winRate": 0,
          "score": 13.3,
          "lift": -1.7,
          "valPerGold": -0.34
        },
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 11.4,
          "lift": -3.6,
          "valPerGold": -0.9
        }
      ],
      "bestValueItems": [
        {
          "item": "bag_holding",
          "name": "Bag of Holding",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 19.9,
          "lift": 4.9,
          "valPerGold": 1.23
        },
        {
          "item": "staff_withering",
          "name": "Staff of Withering",
          "rarity": 5,
          "cost": 5,
          "kwMatch": true,
          "winRate": 0,
          "score": 13.6,
          "lift": -1.4,
          "valPerGold": -0.28
        },
        {
          "item": "rod_pact_keeper",
          "name": "Rod of the Pact Keeper",
          "rarity": 5,
          "cost": 5,
          "kwMatch": true,
          "winRate": 0,
          "score": 13.3,
          "lift": -1.7,
          "valPerGold": -0.34
        }
      ]
    },
    "cinder": {
      "key": "cinder",
      "name": "Cinder",
      "role": "Damage",
      "cls": "Sorcerer",
      "avgScore": 53.6,
      "avgWR": 40,
      "midWR": 100,
      "lateWR": 0,
      "avgDmg": 507,
      "avgHeal": 0,
      "avgWard": 0,
      "avgGold": 0,
      "survPct": 40,
      "avgTime": 23.7,
      "liveRank": 15,
      "baseRank": 8,
      "rankDelta": -7,
      "baseScore": 40.8,
      "scoreDelta": 12.8,
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
          "score": 51.5,
          "wr": 40
        },
        "p1": {
          "k": "wildfire",
          "n": "Wildfire",
          "score": 49.3,
          "wr": 40
        },
        "winner": "Draconic Surge"
      },
      "bestPartners": [
        {
          "partner": "juniper",
          "name": "Juniper",
          "sharedKw": [],
          "score": 78.5,
          "winRate": 100,
          "lift": 16.3,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "dane",
          "name": "Sir Dane",
          "sharedKw": [],
          "score": 64,
          "winRate": 50,
          "lift": 4.7,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "bram",
          "name": "Bram",
          "sharedKw": [],
          "score": 52.2,
          "winRate": 50,
          "lift": 1.2,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "faelan",
          "name": "Faelan",
          "sharedKw": [],
          "score": 31.2,
          "winRate": 0,
          "lift": -29.7,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        }
      ],
      "bestItems": [
        {
          "item": "wand_fireballs",
          "name": "Wand of Fireballs",
          "rarity": 5,
          "cost": 5,
          "kwMatch": true,
          "winRate": 50,
          "score": 41.7,
          "lift": 17.6,
          "valPerGold": 3.52
        },
        {
          "item": "bloodwell_vial",
          "name": "Bloodwell Vial",
          "rarity": 5,
          "cost": 5,
          "kwMatch": true,
          "winRate": 0,
          "score": 27.2,
          "lift": 3.1,
          "valPerGold": 0.62
        },
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 26.2,
          "lift": 2.1,
          "valPerGold": 0.53
        },
        {
          "item": "bag_holding",
          "name": "Bag of Holding",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 24.6,
          "lift": 0.5,
          "valPerGold": 0.13
        }
      ],
      "bestValueItems": [
        {
          "item": "wand_fireballs",
          "name": "Wand of Fireballs",
          "rarity": 5,
          "cost": 5,
          "kwMatch": true,
          "winRate": 50,
          "score": 41.7,
          "lift": 17.6,
          "valPerGold": 3.52
        },
        {
          "item": "bloodwell_vial",
          "name": "Bloodwell Vial",
          "rarity": 5,
          "cost": 5,
          "kwMatch": true,
          "winRate": 0,
          "score": 27.2,
          "lift": 3.1,
          "valPerGold": 0.62
        },
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 26.2,
          "lift": 2.1,
          "valPerGold": 0.53
        }
      ]
    },
    "wallaby": {
      "key": "wallaby",
      "name": "Wallaby",
      "role": "Damage",
      "cls": "Rogue",
      "avgScore": 52.4,
      "avgWR": 40,
      "midWR": 100,
      "lateWR": 0,
      "avgDmg": 453,
      "avgHeal": 0,
      "avgWard": 0,
      "avgGold": 2.2,
      "survPct": 30,
      "avgTime": 29.7,
      "liveRank": 16,
      "baseRank": 22,
      "rankDelta": 6,
      "baseScore": 31.4,
      "scoreDelta": 21,
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
          "score": 49.5,
          "wr": 40
        },
        "p1": {
          "k": "pickpocket",
          "n": "Pickpocket",
          "score": 49.1,
          "wr": 40
        },
        "winner": "Even"
      },
      "bestPartners": [
        {
          "partner": "faelan",
          "name": "Faelan",
          "sharedKw": [],
          "score": 61.3,
          "winRate": 50,
          "lift": 1,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "velith",
          "name": "Velith",
          "sharedKw": [
            "sneak_attack"
          ],
          "score": 55.3,
          "winRate": 50,
          "lift": -6.6,
          "why": "Shared sneak attack Class Keyword engine chains triggers across both kits."
        },
        {
          "partner": "bram",
          "name": "Bram",
          "sharedKw": [],
          "score": 53.7,
          "winRate": 50,
          "lift": 3.3,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "dane",
          "name": "Sir Dane",
          "sharedKw": [],
          "score": 53.7,
          "winRate": 50,
          "lift": -5,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        }
      ],
      "bestItems": [
        {
          "item": "dagger_venom",
          "name": "Dagger of Venom",
          "rarity": 5,
          "cost": 5,
          "kwMatch": true,
          "winRate": 0,
          "score": 30.2,
          "lift": 20.2,
          "valPerGold": 4.04
        },
        {
          "item": "cloak_elvenkind",
          "name": "Cloak of Elvenkind",
          "rarity": 5,
          "cost": 5,
          "kwMatch": true,
          "winRate": 0,
          "score": 22.2,
          "lift": 12.2,
          "valPerGold": 2.44
        },
        {
          "item": "ring_protection",
          "name": "Ring of Protection",
          "rarity": 1,
          "cost": 3,
          "kwMatch": false,
          "winRate": 0,
          "score": 15.7,
          "lift": 5.7,
          "valPerGold": 1.9
        },
        {
          "item": "boots_speed",
          "name": "Boots of Speed",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 15.6,
          "lift": 5.6,
          "valPerGold": 1.4
        }
      ],
      "bestValueItems": [
        {
          "item": "dagger_venom",
          "name": "Dagger of Venom",
          "rarity": 5,
          "cost": 5,
          "kwMatch": true,
          "winRate": 0,
          "score": 30.2,
          "lift": 20.2,
          "valPerGold": 4.04
        },
        {
          "item": "cloak_elvenkind",
          "name": "Cloak of Elvenkind",
          "rarity": 5,
          "cost": 5,
          "kwMatch": true,
          "winRate": 0,
          "score": 22.2,
          "lift": 12.2,
          "valPerGold": 2.44
        },
        {
          "item": "ring_protection",
          "name": "Ring of Protection",
          "rarity": 1,
          "cost": 3,
          "kwMatch": false,
          "winRate": 0,
          "score": 15.7,
          "lift": 5.7,
          "valPerGold": 1.9
        }
      ]
    },
    "rosalind": {
      "key": "rosalind",
      "name": "Rosalind",
      "role": "Support",
      "cls": "Bard",
      "avgScore": 51.4,
      "avgWR": 50,
      "midWR": 100,
      "lateWR": 16.7,
      "avgDmg": 79,
      "avgHeal": 0,
      "avgWard": 0,
      "avgGold": 0,
      "survPct": 50,
      "avgTime": 18.9,
      "liveRank": 17,
      "baseRank": 19,
      "rankDelta": 2,
      "baseScore": 32.8,
      "scoreDelta": 18.6,
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
          "score": 46.7,
          "wr": 40
        },
        "p1": {
          "k": "encore",
          "n": "Encore",
          "score": 51.7,
          "wr": 60
        },
        "winner": "Encore"
      },
      "bestPartners": [
        {
          "partner": "bram",
          "name": "Bram",
          "sharedKw": [],
          "score": 34.1,
          "winRate": 0,
          "lift": -15.9,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "arthur",
          "name": "Arthur",
          "sharedKw": [],
          "score": 19.1,
          "winRate": 0,
          "lift": -39.4,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "wallaby",
          "name": "Wallaby",
          "sharedKw": [],
          "score": 18.7,
          "winRate": 0,
          "lift": -33.2,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "toot",
          "name": "Toot",
          "sharedKw": [
            "bardic_inspiration"
          ],
          "score": 15.2,
          "winRate": 0,
          "lift": -29.7,
          "why": "Shared bardic inspiration Class Keyword engine chains triggers across both kits."
        }
      ],
      "bestItems": [
        {
          "item": "glamoured_leather",
          "name": "Glamoured Studded Leather",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 16.5,
          "lift": 4,
          "valPerGold": 1
        },
        {
          "item": "pipes_haunting",
          "name": "Pipes of Haunting",
          "rarity": 5,
          "cost": 5,
          "kwMatch": true,
          "winRate": 0,
          "score": 10.6,
          "lift": -1.9,
          "valPerGold": -0.38
        },
        {
          "item": "horn_valhalla",
          "name": "Horn of Valhalla",
          "rarity": 5,
          "cost": 5,
          "kwMatch": true,
          "winRate": 0,
          "score": 8.9,
          "lift": -3.6,
          "valPerGold": -0.72
        },
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 10.3,
          "lift": -2.2,
          "valPerGold": -0.55
        }
      ],
      "bestValueItems": [
        {
          "item": "glamoured_leather",
          "name": "Glamoured Studded Leather",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 16.5,
          "lift": 4,
          "valPerGold": 1
        },
        {
          "item": "pipes_haunting",
          "name": "Pipes of Haunting",
          "rarity": 5,
          "cost": 5,
          "kwMatch": true,
          "winRate": 0,
          "score": 10.6,
          "lift": -1.9,
          "valPerGold": -0.38
        },
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 10.3,
          "lift": -2.2,
          "valPerGold": -0.55
        }
      ]
    },
    "zark": {
      "key": "zark",
      "name": "Zark",
      "role": "Tank",
      "cls": "Barbarian",
      "avgScore": 50.5,
      "avgWR": 50,
      "midWR": 100,
      "lateWR": 16.7,
      "avgDmg": 511,
      "avgHeal": 170,
      "avgWard": 0,
      "avgGold": 0,
      "survPct": 40,
      "avgTime": 17.5,
      "liveRank": 18,
      "baseRank": 14,
      "rankDelta": -4,
      "baseScore": 35.8,
      "scoreDelta": 14.7,
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
          "score": 56.3,
          "wr": 60
        },
        "p1": {
          "k": "totem_roar",
          "n": "Totem Roar",
          "score": 40.4,
          "wr": 40
        },
        "winner": "Relentless Bear"
      },
      "bestPartners": [
        {
          "partner": "faelan",
          "name": "Faelan",
          "sharedKw": [],
          "score": 55.3,
          "winRate": 50,
          "lift": -4.1,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "pillar",
          "name": "Pillar",
          "sharedKw": [
            "rage"
          ],
          "score": 46.7,
          "winRate": 50,
          "lift": -8.9,
          "why": "Shared rage Class Keyword engine chains triggers across both kits."
        },
        {
          "partner": "wallaby",
          "name": "Wallaby",
          "sharedKw": [],
          "score": 18.1,
          "winRate": 0,
          "lift": -33.4,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "arthur",
          "name": "Arthur",
          "sharedKw": [],
          "score": 12.7,
          "winRate": 0,
          "lift": -45.4,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        }
      ],
      "bestItems": [
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 16.4,
          "lift": 8.9,
          "valPerGold": 2.23
        },
        {
          "item": "periapt_wound_closure",
          "name": "Periapt of Wound Closure",
          "rarity": 5,
          "cost": 5,
          "kwMatch": true,
          "winRate": 0,
          "score": 11.3,
          "lift": 3.8,
          "valPerGold": 0.76
        },
        {
          "item": "berserker_axe",
          "name": "Berserker Axe",
          "rarity": 5,
          "cost": 5,
          "kwMatch": true,
          "winRate": 0,
          "score": 11,
          "lift": 3.5,
          "valPerGold": 0.7
        },
        {
          "item": "sword_sharpness",
          "name": "Sword of Sharpness",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 11.9,
          "lift": 4.4,
          "valPerGold": 1.1
        }
      ],
      "bestValueItems": [
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 16.4,
          "lift": 8.9,
          "valPerGold": 2.23
        },
        {
          "item": "sword_sharpness",
          "name": "Sword of Sharpness",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 11.9,
          "lift": 4.4,
          "valPerGold": 1.1
        },
        {
          "item": "periapt_wound_closure",
          "name": "Periapt of Wound Closure",
          "rarity": 5,
          "cost": 5,
          "kwMatch": true,
          "winRate": 0,
          "score": 11.3,
          "lift": 3.8,
          "valPerGold": 0.76
        }
      ]
    },
    "gains": {
      "key": "gains",
      "name": "Gains",
      "role": "Damage",
      "cls": "Wizard",
      "avgScore": 49.4,
      "avgWR": 40,
      "midWR": 100,
      "lateWR": 0,
      "avgDmg": 386,
      "avgHeal": 0,
      "avgWard": 0,
      "avgGold": 4.1,
      "survPct": 20,
      "avgTime": 27.7,
      "liveRank": 19,
      "baseRank": 20,
      "rankDelta": 1,
      "baseScore": 32.7,
      "scoreDelta": 16.7,
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
          "score": 46.4,
          "wr": 40
        },
        "p1": {
          "k": "liquid_assets",
          "n": "Liquid Assets",
          "score": 46.2,
          "wr": 40
        },
        "winner": "Even"
      },
      "bestPartners": [
        {
          "partner": "juniper",
          "name": "Juniper",
          "sharedKw": [],
          "score": 80.9,
          "winRate": 100,
          "lift": 20.8,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "bram",
          "name": "Bram",
          "sharedKw": [],
          "score": 57.5,
          "winRate": 50,
          "lift": 8.5,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "dane",
          "name": "Sir Dane",
          "sharedKw": [],
          "score": 33.5,
          "winRate": 0,
          "lift": -23.7,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "faelan",
          "name": "Faelan",
          "sharedKw": [
            "arcane_recovery"
          ],
          "score": 28.6,
          "winRate": 0,
          "lift": -30.2,
          "why": "Shared arcane recovery Class Keyword engine chains triggers across both kits."
        }
      ],
      "bestItems": [
        {
          "item": "ring_spell_storing",
          "name": "Ring of Spell Storing",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 26.7,
          "lift": 9.8,
          "valPerGold": 2.45
        },
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 21.9,
          "lift": 5,
          "valPerGold": 1.25
        },
        {
          "item": "arcane_grimoire",
          "name": "Arcane Grimoire",
          "rarity": 5,
          "cost": 5,
          "kwMatch": true,
          "winRate": 0,
          "score": 16.2,
          "lift": -0.7,
          "valPerGold": -0.14
        },
        {
          "item": "pearl_power",
          "name": "Pearl of Power",
          "rarity": 5,
          "cost": 5,
          "kwMatch": true,
          "winRate": 0,
          "score": 12.1,
          "lift": -4.8,
          "valPerGold": -0.96
        }
      ],
      "bestValueItems": [
        {
          "item": "ring_spell_storing",
          "name": "Ring of Spell Storing",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 26.7,
          "lift": 9.8,
          "valPerGold": 2.45
        },
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 21.9,
          "lift": 5,
          "valPerGold": 1.25
        },
        {
          "item": "arcane_grimoire",
          "name": "Arcane Grimoire",
          "rarity": 5,
          "cost": 5,
          "kwMatch": true,
          "winRate": 0,
          "score": 16.2,
          "lift": -0.7,
          "valPerGold": -0.14
        }
      ]
    },
    "saint": {
      "key": "saint",
      "name": "Saint",
      "role": "Support",
      "cls": "Cleric",
      "avgScore": 49,
      "avgWR": 50,
      "midWR": 100,
      "lateWR": 16.7,
      "avgDmg": 225,
      "avgHeal": 0,
      "avgWard": 0,
      "avgGold": 0,
      "survPct": 50,
      "avgTime": 16.3,
      "liveRank": 20,
      "baseRank": 23,
      "rankDelta": 3,
      "baseScore": 29.9,
      "scoreDelta": 19.1,
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
          "score": 53.2,
          "wr": 60
        },
        "p1": {
          "k": "smoke_mirrors",
          "n": "Smoke & Mirrors",
          "score": 39.6,
          "wr": 40
        },
        "winner": "Two-Faced"
      },
      "bestPartners": [
        {
          "partner": "jamison",
          "name": "Brother Jamison",
          "sharedKw": [
            "channel_divinity"
          ],
          "score": 56.2,
          "winRate": 50,
          "lift": -0.7,
          "why": "Shared channel divinity Class Keyword engine chains triggers across both kits."
        },
        {
          "partner": "bram",
          "name": "Bram",
          "sharedKw": [
            "channel_divinity"
          ],
          "score": 47.4,
          "winRate": 50,
          "lift": -1.4,
          "why": "Shared channel divinity Class Keyword engine chains triggers across both kits."
        },
        {
          "partner": "wallaby",
          "name": "Wallaby",
          "sharedKw": [],
          "score": 38.4,
          "winRate": 50,
          "lift": -12.3,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "arthur",
          "name": "Arthur",
          "sharedKw": [],
          "score": 11.7,
          "winRate": 0,
          "lift": -45.7,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        }
      ],
      "bestItems": [
        {
          "item": "staff_healing",
          "name": "Staff of Healing",
          "rarity": 5,
          "cost": 5,
          "kwMatch": true,
          "winRate": 0,
          "score": 12.8,
          "lift": 6.2,
          "valPerGold": 1.24
        },
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 11.3,
          "lift": 4.7,
          "valPerGold": 1.18
        },
        {
          "item": "stone_good_luck",
          "name": "Stone of Good Luck",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 11.2,
          "lift": 4.6,
          "valPerGold": 1.15
        },
        {
          "item": "amulet_devout",
          "name": "Amulet of the Devout",
          "rarity": 5,
          "cost": 5,
          "kwMatch": true,
          "winRate": 0,
          "score": 7.8,
          "lift": 1.2,
          "valPerGold": 0.24
        }
      ],
      "bestValueItems": [
        {
          "item": "staff_healing",
          "name": "Staff of Healing",
          "rarity": 5,
          "cost": 5,
          "kwMatch": true,
          "winRate": 0,
          "score": 12.8,
          "lift": 6.2,
          "valPerGold": 1.24
        },
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 11.3,
          "lift": 4.7,
          "valPerGold": 1.18
        },
        {
          "item": "stone_good_luck",
          "name": "Stone of Good Luck",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 11.2,
          "lift": 4.6,
          "valPerGold": 1.15
        }
      ]
    },
    "bram": {
      "key": "bram",
      "name": "Bram",
      "role": "Tank",
      "cls": "Cleric",
      "avgScore": 48.5,
      "avgWR": 40,
      "midWR": 100,
      "lateWR": 0,
      "avgDmg": 116,
      "avgHeal": 581,
      "avgWard": 93,
      "avgGold": 0,
      "survPct": 40,
      "avgTime": 22.1,
      "liveRank": 21,
      "baseRank": 15,
      "rankDelta": -6,
      "baseScore": 33.5,
      "scoreDelta": 15,
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
          "score": 43.4,
          "wr": 40
        },
        "p1": {
          "k": "divine_strike",
          "n": "Divine Strike",
          "score": 47.5,
          "wr": 40
        },
        "winner": "Divine Strike"
      },
      "bestPartners": [
        {
          "partner": "jamison",
          "name": "Brother Jamison",
          "sharedKw": [
            "channel_divinity"
          ],
          "score": 14.9,
          "winRate": 0,
          "lift": -41.8,
          "why": "Shared channel divinity Class Keyword engine chains triggers across both kits."
        },
        {
          "partner": "faelan",
          "name": "Faelan",
          "sharedKw": [],
          "score": 16.1,
          "winRate": 0,
          "lift": -42.3,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "saint",
          "name": "Saint",
          "sharedKw": [
            "channel_divinity"
          ],
          "score": 12.9,
          "winRate": 0,
          "lift": -35.9,
          "why": "Shared channel divinity Class Keyword engine chains triggers across both kits."
        },
        {
          "partner": "arthur",
          "name": "Arthur",
          "sharedKw": [],
          "score": 11.2,
          "winRate": 0,
          "lift": -45.9,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        }
      ],
      "bestItems": [
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 15.3,
          "lift": 9.2,
          "valPerGold": 2.3
        },
        {
          "item": "staff_healing",
          "name": "Staff of Healing",
          "rarity": 5,
          "cost": 5,
          "kwMatch": true,
          "winRate": 0,
          "score": 12.3,
          "lift": 6.2,
          "valPerGold": 1.24
        },
        {
          "item": "amulet_devout",
          "name": "Amulet of the Devout",
          "rarity": 5,
          "cost": 5,
          "kwMatch": true,
          "winRate": 0,
          "score": 10.6,
          "lift": 4.5,
          "valPerGold": 0.9
        },
        {
          "item": "sword_sharpness",
          "name": "Sword of Sharpness",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 7.2,
          "lift": 1.1,
          "valPerGold": 0.28
        }
      ],
      "bestValueItems": [
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 15.3,
          "lift": 9.2,
          "valPerGold": 2.3
        },
        {
          "item": "staff_healing",
          "name": "Staff of Healing",
          "rarity": 5,
          "cost": 5,
          "kwMatch": true,
          "winRate": 0,
          "score": 12.3,
          "lift": 6.2,
          "valPerGold": 1.24
        },
        {
          "item": "amulet_devout",
          "name": "Amulet of the Devout",
          "rarity": 5,
          "cost": 5,
          "kwMatch": true,
          "winRate": 0,
          "score": 10.6,
          "lift": 4.5,
          "valPerGold": 0.9
        }
      ]
    },
    "mother_laurel": {
      "key": "mother_laurel",
      "name": "Mother Laurel",
      "role": "Tank",
      "cls": "Paladin",
      "avgScore": 46,
      "avgWR": 40,
      "midWR": 100,
      "lateWR": 0,
      "avgDmg": 415,
      "avgHeal": 182,
      "avgWard": 2,
      "avgGold": 0,
      "survPct": 20,
      "avgTime": 17,
      "liveRank": 22,
      "baseRank": 7,
      "rankDelta": -15,
      "baseScore": 41.6,
      "scoreDelta": 4.4,
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
          "score": 41.9,
          "wr": 40
        },
        "p1": {
          "k": "bountiful_vines",
          "n": "Bountiful Vines",
          "score": 44.3,
          "wr": 40
        },
        "winner": "Bountiful Vines"
      },
      "bestPartners": [
        {
          "partner": "dane",
          "name": "Sir Dane",
          "sharedKw": [
            "smite",
            "aura"
          ],
          "score": 54.9,
          "winRate": 50,
          "lift": -0.6,
          "why": "Shared smite & aura Class Keyword engine chains triggers across both kits."
        },
        {
          "partner": "faelan",
          "name": "Faelan",
          "sharedKw": [],
          "score": 53,
          "winRate": 50,
          "lift": -4.1,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "arthur",
          "name": "Arthur",
          "sharedKw": [],
          "score": 21.6,
          "winRate": 0,
          "lift": -34.3,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "wallaby",
          "name": "Wallaby",
          "sharedKw": [],
          "score": 15.7,
          "winRate": 0,
          "lift": -33.5,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        }
      ],
      "bestItems": [
        {
          "item": "sun_blade",
          "name": "Sun Blade",
          "rarity": 5,
          "cost": 5,
          "kwMatch": true,
          "winRate": 0,
          "score": 11.1,
          "lift": 2.8,
          "valPerGold": 0.56
        },
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 10.9,
          "lift": 2.6,
          "valPerGold": 0.65
        },
        {
          "item": "boots_speed",
          "name": "Boots of Speed",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 8.9,
          "lift": 0.6,
          "valPerGold": 0.15
        },
        {
          "item": "holy_symbol_ravenkind",
          "name": "Holy Symbol of Ravenkind",
          "rarity": 5,
          "cost": 5,
          "kwMatch": true,
          "winRate": 0,
          "score": 6.8,
          "lift": -1.5,
          "valPerGold": -0.3
        }
      ],
      "bestValueItems": [
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 10.9,
          "lift": 2.6,
          "valPerGold": 0.65
        },
        {
          "item": "sun_blade",
          "name": "Sun Blade",
          "rarity": 5,
          "cost": 5,
          "kwMatch": true,
          "winRate": 0,
          "score": 11.1,
          "lift": 2.8,
          "valPerGold": 0.56
        },
        {
          "item": "boots_speed",
          "name": "Boots of Speed",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 8.9,
          "lift": 0.6,
          "valPerGold": 0.15
        }
      ]
    },
    "zoe": {
      "key": "zoe",
      "name": "Zoe",
      "role": "Support",
      "cls": "Fighter",
      "avgScore": 43.2,
      "avgWR": 40,
      "midWR": 100,
      "lateWR": 0,
      "avgDmg": 57,
      "avgHeal": 0,
      "avgWard": 0,
      "avgGold": 0,
      "survPct": 10,
      "avgTime": 18.5,
      "liveRank": 23,
      "baseRank": 1,
      "rankDelta": -22,
      "baseScore": 51.8,
      "scoreDelta": -8.6,
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
          "score": 41.1,
          "wr": 40
        },
        "p1": {
          "k": "just_the_thing",
          "n": "Just the Thing",
          "score": 39.8,
          "wr": 40
        },
        "winner": "Rune Carver"
      },
      "bestPartners": [
        {
          "partner": "gilthrax",
          "name": "Gilthrax",
          "sharedKw": [
            "action_surge"
          ],
          "score": 53,
          "winRate": 50,
          "lift": -9.6,
          "why": "Shared action surge Class Keyword engine chains triggers across both kits."
        },
        {
          "partner": "bram",
          "name": "Bram",
          "sharedKw": [],
          "score": 32.5,
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
          "score": 19.6,
          "winRate": 0,
          "lift": -34.9,
          "why": "Shared action surge Class Keyword engine chains triggers across both kits."
        },
        {
          "partner": "wallaby",
          "name": "Wallaby",
          "sharedKw": [],
          "score": 9.6,
          "winRate": 0,
          "lift": -38.2,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        }
      ],
      "bestItems": [
        {
          "item": "sword_sharpness",
          "name": "Sword of Sharpness",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 30,
          "lift": 18.3,
          "valPerGold": 4.58
        },
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 18.8,
          "lift": 7.1,
          "valPerGold": 1.77
        },
        {
          "item": "boots_speed",
          "name": "Boots of Speed",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 14.7,
          "lift": 3,
          "valPerGold": 0.75
        },
        {
          "item": "flame_tongue",
          "name": "Flame Tongue",
          "rarity": 5,
          "cost": 5,
          "kwMatch": true,
          "winRate": 0,
          "score": 7.9,
          "lift": -3.8,
          "valPerGold": -0.76
        }
      ],
      "bestValueItems": [
        {
          "item": "sword_sharpness",
          "name": "Sword of Sharpness",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 30,
          "lift": 18.3,
          "valPerGold": 4.58
        },
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 18.8,
          "lift": 7.1,
          "valPerGold": 1.77
        },
        {
          "item": "boots_speed",
          "name": "Boots of Speed",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 14.7,
          "lift": 3,
          "valPerGold": 0.75
        }
      ]
    },
    "toot": {
      "key": "toot",
      "name": "Toot",
      "role": "Support",
      "cls": "Bard",
      "avgScore": 38.4,
      "avgWR": 30,
      "midWR": 75,
      "lateWR": 0,
      "avgDmg": 3,
      "avgHeal": 0,
      "avgWard": 0,
      "avgGold": 1.6,
      "survPct": 30,
      "avgTime": 18.1,
      "liveRank": 24,
      "baseRank": 24,
      "rankDelta": 0,
      "baseScore": 29.2,
      "scoreDelta": 9.2,
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
          "score": 30.4,
          "wr": 20
        },
        "p1": {
          "k": "street_performer",
          "n": "Street Performer",
          "score": 41.4,
          "wr": 40
        },
        "winner": "Street Performer"
      },
      "bestPartners": [
        {
          "partner": "bram",
          "name": "Bram",
          "sharedKw": [],
          "score": 39.6,
          "winRate": 50,
          "lift": -3.9,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "rosalind",
          "name": "Rosalind",
          "sharedKw": [
            "bardic_inspiration"
          ],
          "score": 12.9,
          "winRate": 0,
          "lift": -32,
          "why": "Shared bardic inspiration Class Keyword engine chains triggers across both kits."
        },
        {
          "partner": "arthur",
          "name": "Arthur",
          "sharedKw": [],
          "score": 14.5,
          "winRate": 0,
          "lift": -37.5,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "wallaby",
          "name": "Wallaby",
          "sharedKw": [],
          "score": 8.2,
          "winRate": 0,
          "lift": -37.2,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        }
      ],
      "bestItems": [
        {
          "item": "horn_valhalla",
          "name": "Horn of Valhalla",
          "rarity": 5,
          "cost": 5,
          "kwMatch": true,
          "winRate": 0,
          "score": 9.9,
          "lift": 5.8,
          "valPerGold": 1.16
        },
        {
          "item": "pipes_haunting",
          "name": "Pipes of Haunting",
          "rarity": 5,
          "cost": 5,
          "kwMatch": true,
          "winRate": 0,
          "score": 7.3,
          "lift": 3.2,
          "valPerGold": 0.64
        },
        {
          "item": "bag_holding",
          "name": "Bag of Holding",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 8.2,
          "lift": 4.1,
          "valPerGold": 1.02
        },
        {
          "item": "glamoured_leather",
          "name": "Glamoured Studded Leather",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 5,
          "lift": 0.9,
          "valPerGold": 0.23
        }
      ],
      "bestValueItems": [
        {
          "item": "horn_valhalla",
          "name": "Horn of Valhalla",
          "rarity": 5,
          "cost": 5,
          "kwMatch": true,
          "winRate": 0,
          "score": 9.9,
          "lift": 5.8,
          "valPerGold": 1.16
        },
        {
          "item": "bag_holding",
          "name": "Bag of Holding",
          "rarity": 2,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 8.2,
          "lift": 4.1,
          "valPerGold": 1.02
        },
        {
          "item": "pipes_haunting",
          "name": "Pipes of Haunting",
          "rarity": 5,
          "cost": 5,
          "kwMatch": true,
          "winRate": 0,
          "score": 7.3,
          "lift": 3.2,
          "valPerGold": 0.64
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
      "price": 2,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.176,
      "valPerGold": 0.088,
      "topCarriers": [
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": 17.6,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "stone_dex",
      "name": "Stone of Dexterity",
      "r": 0,
      "rarity": "Common",
      "price": 2,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": -0.006,
      "valPerGold": -0.003,
      "topCarriers": [
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": -0.6,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "stone_con",
      "name": "Stone of Constitution",
      "r": 0,
      "rarity": "Common",
      "price": 2,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.072,
      "valPerGold": 0.036,
      "topCarriers": [
        {
          "hero": "zark",
          "name": "Zark",
          "lift": 7.2,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "stone_int",
      "name": "Stone of Intelligence",
      "r": 0,
      "rarity": "Common",
      "price": 2,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.146,
      "valPerGold": 0.073,
      "topCarriers": [
        {
          "hero": "faelan",
          "name": "Faelan",
          "lift": 14.6,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "stone_wis",
      "name": "Stone of Wisdom",
      "r": 0,
      "rarity": "Common",
      "price": 2,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.01,
      "valPerGold": 0.005,
      "topCarriers": [
        {
          "hero": "bram",
          "name": "Bram",
          "lift": 1,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "stone_cha",
      "name": "Stone of Charisma",
      "r": 0,
      "rarity": "Common",
      "price": 2,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.134,
      "valPerGold": 0.067,
      "topCarriers": [
        {
          "hero": "dane",
          "name": "Sir Dane",
          "lift": 13.4,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "weapon_p1",
      "name": "+1 Weapon",
      "r": 0,
      "rarity": "Common",
      "price": 2,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": -0.045,
      "valPerGold": -0.022,
      "topCarriers": [
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": -4.5,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "gloves_quickness",
      "name": "Gloves of Quickness",
      "r": 0,
      "rarity": "Common",
      "price": 2,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": -0.006,
      "valPerGold": -0.003,
      "topCarriers": [
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": -0.6,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "shield",
      "name": "Shield",
      "r": 0,
      "rarity": "Common",
      "price": 2,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.096,
      "valPerGold": 0.048,
      "topCarriers": [
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": 9.6,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "cloak_protection",
      "name": "Cloak of Protection",
      "r": 0,
      "rarity": "Common",
      "price": 2,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.046,
      "valPerGold": 0.023,
      "topCarriers": [
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": 4.6,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "leather_armor",
      "name": "Leather Armor",
      "r": 0,
      "rarity": "Common",
      "price": 2,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": -0.007,
      "valPerGold": -0.003,
      "topCarriers": [
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": -0.7,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "ring_warmth",
      "name": "Ring of Warmth",
      "r": 0,
      "rarity": "Common",
      "price": 2,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.037,
      "valPerGold": 0.019,
      "topCarriers": [
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": 3.7,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "breastplate",
      "name": "Breastplate",
      "r": 1,
      "rarity": "Uncommon",
      "price": 3,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.074,
      "valPerGold": 0.025,
      "topCarriers": [
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": 7.4,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "mantle_spell_resistance",
      "name": "Mantle of Spell Resistance",
      "r": 1,
      "rarity": "Uncommon",
      "price": 3,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": -0.002,
      "valPerGold": -0.001,
      "topCarriers": [
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": -0.2,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "gauntlets_ogre",
      "name": "Gauntlets of Ogre Power",
      "r": 1,
      "rarity": "Uncommon",
      "price": 3,
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
      "key": "boots_striding",
      "name": "Boots of Striding",
      "r": 1,
      "rarity": "Uncommon",
      "price": 3,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.252,
      "valPerGold": 0.084,
      "topCarriers": [
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": 25.2,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "boots_elvenkind",
      "name": "Boots of Elvenkind",
      "r": 1,
      "rarity": "Uncommon",
      "price": 3,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.208,
      "valPerGold": 0.069,
      "topCarriers": [
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": 20.8,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "gloves_thievery",
      "name": "Gloves of Thievery",
      "r": 1,
      "rarity": "Uncommon",
      "price": 3,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.238,
      "valPerGold": 0.079,
      "topCarriers": [
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": 23.8,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "belt_dwarvenkind",
      "name": "Belt of Dwarvenkind",
      "r": 1,
      "rarity": "Uncommon",
      "price": 3,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.071,
      "valPerGold": 0.024,
      "topCarriers": [
        {
          "hero": "zark",
          "name": "Zark",
          "lift": 7.1,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "ring_protection",
      "name": "Ring of Protection",
      "r": 1,
      "rarity": "Uncommon",
      "price": 3,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.057,
      "valPerGold": 0.019,
      "topCarriers": [
        {
          "hero": "wallaby",
          "name": "Wallaby",
          "lift": 5.7,
          "kwMatch": false
        },
        {
          "hero": "corvin",
          "name": "Corvin",
          "lift": 4.5,
          "kwMatch": false
        },
        {
          "hero": "naill",
          "name": "Naill",
          "lift": -2.5,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "wand_magic_missiles",
      "name": "Wand of Magic Missiles",
      "r": 1,
      "rarity": "Uncommon",
      "price": 3,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.231,
      "valPerGold": 0.077,
      "topCarriers": [
        {
          "hero": "faelan",
          "name": "Faelan",
          "lift": 23.1,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "ring_mind_shielding",
      "name": "Ring of Mind Shielding",
      "r": 1,
      "rarity": "Uncommon",
      "price": 3,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.275,
      "valPerGold": 0.092,
      "topCarriers": [
        {
          "hero": "faelan",
          "name": "Faelan",
          "lift": 27.5,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "goggles_night",
      "name": "Goggles of Night",
      "r": 1,
      "rarity": "Uncommon",
      "price": 3,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": -0.028,
      "valPerGold": -0.009,
      "topCarriers": [
        {
          "hero": "bram",
          "name": "Bram",
          "lift": -2.8,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "gem_brightness",
      "name": "Gem of Brightness",
      "r": 1,
      "rarity": "Uncommon",
      "price": 3,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.089,
      "valPerGold": 0.03,
      "topCarriers": [
        {
          "hero": "bram",
          "name": "Bram",
          "lift": 8.9,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "brooch_shielding",
      "name": "Brooch of Shielding",
      "r": 1,
      "rarity": "Uncommon",
      "price": 3,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": -0.026,
      "valPerGold": -0.009,
      "topCarriers": [
        {
          "hero": "dane",
          "name": "Sir Dane",
          "lift": -2.6,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "circlet_blasting",
      "name": "Circlet of Blasting",
      "r": 1,
      "rarity": "Uncommon",
      "price": 3,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": -0.064,
      "valPerGold": -0.021,
      "topCarriers": [
        {
          "hero": "dane",
          "name": "Sir Dane",
          "lift": -6.4,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "plate_armor",
      "name": "Plate Armor",
      "r": 2,
      "rarity": "Rare",
      "price": 4,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0,
      "valPerGold": 0,
      "topCarriers": [
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": 0,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "sword_sharpness",
      "name": "Sword of Sharpness",
      "r": 2,
      "rarity": "Rare",
      "price": 4,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.194,
      "valPerGold": 0.048,
      "topCarriers": [
        {
          "hero": "gilthrax",
          "name": "Gilthrax",
          "lift": 19.4,
          "kwMatch": false
        },
        {
          "hero": "zoe",
          "name": "Zoe",
          "lift": 18.3,
          "kwMatch": false
        },
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": 14,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "boots_speed",
      "name": "Boots of Speed",
      "r": 2,
      "rarity": "Rare",
      "price": 4,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.183,
      "valPerGold": 0.046,
      "topCarriers": [
        {
          "hero": "corvin",
          "name": "Corvin",
          "lift": 18.3,
          "kwMatch": false
        },
        {
          "hero": "gilthrax",
          "name": "Gilthrax",
          "lift": 15.9,
          "kwMatch": false
        },
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": 10,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "vicious_bow",
      "name": "Vicious Bow",
      "r": 2,
      "rarity": "Rare",
      "price": 4,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.029,
      "valPerGold": 0.007,
      "topCarriers": [
        {
          "hero": "lorcan",
          "name": "Lorcan",
          "lift": 2.9,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "cloak_displacement",
      "name": "Cloak of Displacement",
      "r": 2,
      "rarity": "Rare",
      "price": 4,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.167,
      "valPerGold": 0.042,
      "topCarriers": [
        {
          "hero": "juniper",
          "name": "Juniper",
          "lift": 16.7,
          "kwMatch": false
        },
        {
          "hero": "gilthrax",
          "name": "Gilthrax",
          "lift": 13.6,
          "kwMatch": false
        },
        {
          "hero": "bram",
          "name": "Bram",
          "lift": 9.2,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "amulet_health",
      "name": "Amulet of Health",
      "r": 2,
      "rarity": "Rare",
      "price": 4,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.14,
      "valPerGold": 0.035,
      "topCarriers": [
        {
          "hero": "zark",
          "name": "Zark",
          "lift": 14,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "potion_healing",
      "name": "Potion of Greater Healing",
      "r": 2,
      "rarity": "Rare",
      "price": 4,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.13,
      "valPerGold": 0.033,
      "topCarriers": [
        {
          "hero": "zark",
          "name": "Zark",
          "lift": 13,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "ring_spell_storing",
      "name": "Ring of Spell Storing",
      "r": 2,
      "rarity": "Rare",
      "price": 4,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.462,
      "valPerGold": 0.116,
      "topCarriers": [
        {
          "hero": "faelan",
          "name": "Faelan",
          "lift": 46.2,
          "kwMatch": false
        },
        {
          "hero": "gains",
          "name": "Gains",
          "lift": 9.8,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "wand_web",
      "name": "Wand of Web",
      "r": 2,
      "rarity": "Rare",
      "price": 4,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.171,
      "valPerGold": 0.043,
      "topCarriers": [
        {
          "hero": "faelan",
          "name": "Faelan",
          "lift": 17.1,
          "kwMatch": false
        },
        {
          "hero": "saint",
          "name": "Saint",
          "lift": -0.1,
          "kwMatch": false
        },
        {
          "hero": "juniper",
          "name": "Juniper",
          "lift": -2.5,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "stone_good_luck",
      "name": "Stone of Good Luck",
      "r": 2,
      "rarity": "Rare",
      "price": 4,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.046,
      "valPerGold": 0.011,
      "topCarriers": [
        {
          "hero": "saint",
          "name": "Saint",
          "lift": 4.6,
          "kwMatch": false
        },
        {
          "hero": "juniper",
          "name": "Juniper",
          "lift": -0.3,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "glamoured_leather",
      "name": "Glamoured Studded Leather",
      "r": 2,
      "rarity": "Rare",
      "price": 4,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.325,
      "valPerGold": 0.081,
      "topCarriers": [
        {
          "hero": "lumen",
          "name": "Lumen",
          "lift": 32.5,
          "kwMatch": false
        },
        {
          "hero": "rosalind",
          "name": "Rosalind",
          "lift": 4,
          "kwMatch": false
        },
        {
          "hero": "toot",
          "name": "Toot",
          "lift": 0.9,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "bag_holding",
      "name": "Bag of Holding",
      "r": 2,
      "rarity": "Rare",
      "price": 4,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.078,
      "valPerGold": 0.019,
      "topCarriers": [
        {
          "hero": "jamison",
          "name": "Brother Jamison",
          "lift": 7.8,
          "kwMatch": false
        },
        {
          "hero": "nettle",
          "name": "Nettle",
          "lift": 4.9,
          "kwMatch": false
        },
        {
          "hero": "toot",
          "name": "Toot",
          "lift": 4.1,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "dwarven_plate",
      "name": "Dwarven Plate",
      "r": 3,
      "rarity": "Very Rare",
      "price": 6,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.119,
      "valPerGold": 0.02,
      "topCarriers": [
        {
          "hero": "zark",
          "name": "Zark",
          "lift": 11.9,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "ring_regeneration",
      "name": "Ring of Regeneration",
      "r": 3,
      "rarity": "Very Rare",
      "price": 6,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.157,
      "valPerGold": 0.026,
      "topCarriers": [
        {
          "hero": "zark",
          "name": "Zark",
          "lift": 15.7,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "belt_fire_giant",
      "name": "Belt of Fire Giant Strength",
      "r": 3,
      "rarity": "Very Rare",
      "price": 6,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.221,
      "valPerGold": 0.037,
      "topCarriers": [
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": 22.1,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "frost_brand",
      "name": "Frost Brand",
      "r": 3,
      "rarity": "Very Rare",
      "price": 6,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.047,
      "valPerGold": 0.008,
      "topCarriers": [
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": 4.7,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "scimitar_speed",
      "name": "Scimitar of Speed",
      "r": 3,
      "rarity": "Very Rare",
      "price": 6,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.092,
      "valPerGold": 0.015,
      "topCarriers": [
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": 9.2,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "ring_evasion",
      "name": "Ring of Evasion",
      "r": 3,
      "rarity": "Very Rare",
      "price": 6,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.031,
      "valPerGold": 0.005,
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
      "key": "staff_power",
      "name": "Staff of Power",
      "r": 3,
      "rarity": "Very Rare",
      "price": 6,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.227,
      "valPerGold": 0.038,
      "topCarriers": [
        {
          "hero": "faelan",
          "name": "Faelan",
          "lift": 22.7,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "headband_intellect",
      "name": "Headband of Intellect",
      "r": 3,
      "rarity": "Very Rare",
      "price": 6,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.301,
      "valPerGold": 0.05,
      "topCarriers": [
        {
          "hero": "faelan",
          "name": "Faelan",
          "lift": 30.1,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "tome_understanding",
      "name": "Tome of Understanding",
      "r": 3,
      "rarity": "Very Rare",
      "price": 6,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.064,
      "valPerGold": 0.011,
      "topCarriers": [
        {
          "hero": "bram",
          "name": "Bram",
          "lift": 6.4,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "cloak_arachnida",
      "name": "Cloak of Arachnida",
      "r": 3,
      "rarity": "Very Rare",
      "price": 6,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.02,
      "valPerGold": 0.003,
      "topCarriers": [
        {
          "hero": "bram",
          "name": "Bram",
          "lift": 2,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "robe_stars",
      "name": "Robe of Stars",
      "r": 3,
      "rarity": "Very Rare",
      "price": 6,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.029,
      "valPerGold": 0.005,
      "topCarriers": [
        {
          "hero": "dane",
          "name": "Sir Dane",
          "lift": 2.9,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "staff_fire",
      "name": "Staff of Fire",
      "r": 3,
      "rarity": "Very Rare",
      "price": 6,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.156,
      "valPerGold": 0.026,
      "topCarriers": [
        {
          "hero": "rosalind",
          "name": "Rosalind",
          "lift": 15.6,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "belt_storm_giant",
      "name": "Belt of Storm Giant Strength",
      "r": 4,
      "rarity": "Legendary",
      "price": 10,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.093,
      "valPerGold": 0.009,
      "topCarriers": [
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": 9.3,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "vorpal_sword",
      "name": "Vorpal Sword",
      "r": 4,
      "rarity": "Legendary",
      "price": 10,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.672,
      "valPerGold": 0.067,
      "topCarriers": [
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": 67.2,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "armor_invulnerability",
      "name": "Armor of Invulnerability",
      "r": 4,
      "rarity": "Legendary",
      "price": 10,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.906,
      "valPerGold": 0.091,
      "topCarriers": [
        {
          "hero": "zark",
          "name": "Zark",
          "lift": 90.6,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "blackrazor",
      "name": "Blackrazor",
      "r": 4,
      "rarity": "Legendary",
      "price": 10,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.092,
      "valPerGold": 0.009,
      "topCarriers": [
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": 9.2,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "staff_magi",
      "name": "Staff of the Magi",
      "r": 4,
      "rarity": "Legendary",
      "price": 10,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.671,
      "valPerGold": 0.067,
      "topCarriers": [
        {
          "hero": "faelan",
          "name": "Faelan",
          "lift": 67.1,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "robe_archmagi",
      "name": "Robe of the Archmagi",
      "r": 4,
      "rarity": "Legendary",
      "price": 10,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.659,
      "valPerGold": 0.066,
      "topCarriers": [
        {
          "hero": "faelan",
          "name": "Faelan",
          "lift": 65.9,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "luck_blade",
      "name": "Luck Blade",
      "r": 4,
      "rarity": "Legendary",
      "price": 10,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.088,
      "valPerGold": 0.009,
      "topCarriers": [
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": 8.8,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "holy_avenger",
      "name": "Holy Avenger",
      "r": 4,
      "rarity": "Legendary",
      "price": 10,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.804,
      "valPerGold": 0.08,
      "topCarriers": [
        {
          "hero": "dane",
          "name": "Sir Dane",
          "lift": 80.4,
          "kwMatch": false
        }
      ]
    },
    {
      "key": "weapon_warning",
      "name": "Weapon of Warning",
      "r": 5,
      "rarity": "Unique",
      "price": 5,
      "kwHooks": [
        "action_surge"
      ],
      "clsLock": "Fighter",
      "bestDelta": 0.208,
      "valPerGold": 0.042,
      "topCarriers": [
        {
          "hero": "gilthrax",
          "name": "Gilthrax",
          "lift": 20.8,
          "kwMatch": true
        },
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": 15.7,
          "kwMatch": true
        },
        {
          "hero": "zoe",
          "name": "Zoe",
          "lift": -4.6,
          "kwMatch": true
        }
      ]
    },
    {
      "key": "flame_tongue",
      "name": "Flame Tongue",
      "r": 5,
      "rarity": "Unique",
      "price": 5,
      "kwHooks": [
        "action_surge"
      ],
      "clsLock": "Fighter",
      "bestDelta": 0.094,
      "valPerGold": 0.019,
      "topCarriers": [
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": 9.4,
          "kwMatch": true
        },
        {
          "hero": "gilthrax",
          "name": "Gilthrax",
          "lift": 7,
          "kwMatch": true
        },
        {
          "hero": "zoe",
          "name": "Zoe",
          "lift": -3.8,
          "kwMatch": true
        }
      ]
    },
    {
      "key": "periapt_wound_closure",
      "name": "Periapt of Wound Closure",
      "r": 5,
      "rarity": "Unique",
      "price": 5,
      "kwHooks": [
        "rage"
      ],
      "clsLock": "Barbarian",
      "bestDelta": 0.038,
      "valPerGold": 0.008,
      "topCarriers": [
        {
          "hero": "zark",
          "name": "Zark",
          "lift": 3.8,
          "kwMatch": true
        },
        {
          "hero": "pillar",
          "name": "Pillar",
          "lift": -35.6,
          "kwMatch": true
        }
      ]
    },
    {
      "key": "berserker_axe",
      "name": "Berserker Axe",
      "r": 5,
      "rarity": "Unique",
      "price": 5,
      "kwHooks": [
        "rage"
      ],
      "clsLock": "Barbarian",
      "bestDelta": 0.035,
      "valPerGold": 0.007,
      "topCarriers": [
        {
          "hero": "zark",
          "name": "Zark",
          "lift": 3.5,
          "kwMatch": true
        },
        {
          "hero": "pillar",
          "name": "Pillar",
          "lift": -13.5,
          "kwMatch": true
        }
      ]
    },
    {
      "key": "holy_symbol_ravenkind",
      "name": "Holy Symbol of Ravenkind",
      "r": 5,
      "rarity": "Unique",
      "price": 5,
      "kwHooks": [
        "smite"
      ],
      "clsLock": "Paladin",
      "bestDelta": -0.015,
      "valPerGold": -0.003,
      "topCarriers": [
        {
          "hero": "mother_laurel",
          "name": "Mother Laurel",
          "lift": -1.5,
          "kwMatch": true
        },
        {
          "hero": "dane",
          "name": "Sir Dane",
          "lift": -4.5,
          "kwMatch": true
        }
      ]
    },
    {
      "key": "sun_blade",
      "name": "Sun Blade",
      "r": 5,
      "rarity": "Unique",
      "price": 5,
      "kwHooks": [
        "smite"
      ],
      "clsLock": "Paladin",
      "bestDelta": 0.114,
      "valPerGold": 0.023,
      "topCarriers": [
        {
          "hero": "corvin",
          "name": "Corvin",
          "lift": 11.4,
          "kwMatch": false
        },
        {
          "hero": "mother_laurel",
          "name": "Mother Laurel",
          "lift": 2.8,
          "kwMatch": true
        },
        {
          "hero": "dane",
          "name": "Sir Dane",
          "lift": 0.5,
          "kwMatch": true
        }
      ]
    },
    {
      "key": "amulet_devout",
      "name": "Amulet of the Devout",
      "r": 5,
      "rarity": "Unique",
      "price": 5,
      "kwHooks": [
        "channel_divinity"
      ],
      "clsLock": "Cleric",
      "bestDelta": 0.123,
      "valPerGold": 0.025,
      "topCarriers": [
        {
          "hero": "jamison",
          "name": "Brother Jamison",
          "lift": 12.3,
          "kwMatch": true
        },
        {
          "hero": "bram",
          "name": "Bram",
          "lift": 4.5,
          "kwMatch": true
        },
        {
          "hero": "saint",
          "name": "Saint",
          "lift": 1.2,
          "kwMatch": true
        }
      ]
    },
    {
      "key": "staff_healing",
      "name": "Staff of Healing",
      "r": 5,
      "rarity": "Unique",
      "price": 5,
      "kwHooks": [
        "channel_divinity"
      ],
      "clsLock": "Cleric",
      "bestDelta": 0.062,
      "valPerGold": 0.012,
      "topCarriers": [
        {
          "hero": "bram",
          "name": "Bram",
          "lift": 6.2,
          "kwMatch": true
        },
        {
          "hero": "saint",
          "name": "Saint",
          "lift": 6.2,
          "kwMatch": true
        },
        {
          "hero": "jamison",
          "name": "Brother Jamison",
          "lift": -4.8,
          "kwMatch": true
        }
      ]
    },
    {
      "key": "pearl_power",
      "name": "Pearl of Power",
      "r": 5,
      "rarity": "Unique",
      "price": 5,
      "kwHooks": [
        "arcane_recovery"
      ],
      "clsLock": "Wizard",
      "bestDelta": 0.106,
      "valPerGold": 0.021,
      "topCarriers": [
        {
          "hero": "faelan",
          "name": "Faelan",
          "lift": 10.6,
          "kwMatch": true
        },
        {
          "hero": "gains",
          "name": "Gains",
          "lift": -4.8,
          "kwMatch": true
        }
      ]
    },
    {
      "key": "arcane_grimoire",
      "name": "Arcane Grimoire",
      "r": 5,
      "rarity": "Unique",
      "price": 5,
      "kwHooks": [
        "arcane_recovery"
      ],
      "clsLock": "Wizard",
      "bestDelta": 0.161,
      "valPerGold": 0.032,
      "topCarriers": [
        {
          "hero": "faelan",
          "name": "Faelan",
          "lift": 16.1,
          "kwMatch": true
        },
        {
          "hero": "gains",
          "name": "Gains",
          "lift": -0.7,
          "kwMatch": true
        }
      ]
    },
    {
      "key": "bracers_archery",
      "name": "Bracers of Archery",
      "r": 5,
      "rarity": "Unique",
      "price": 5,
      "kwHooks": [
        "hunters_mark"
      ],
      "clsLock": "Ranger",
      "bestDelta": 0.08,
      "valPerGold": 0.016,
      "topCarriers": [
        {
          "hero": "corvin",
          "name": "Corvin",
          "lift": 8,
          "kwMatch": true
        },
        {
          "hero": "lorcan",
          "name": "Lorcan",
          "lift": 2.5,
          "kwMatch": true
        }
      ]
    },
    {
      "key": "oathbow",
      "name": "Oathbow",
      "r": 5,
      "rarity": "Unique",
      "price": 5,
      "kwHooks": [
        "hunters_mark"
      ],
      "clsLock": "Ranger",
      "bestDelta": -0.013,
      "valPerGold": -0.003,
      "topCarriers": [
        {
          "hero": "lorcan",
          "name": "Lorcan",
          "lift": -1.3,
          "kwMatch": true
        }
      ]
    },
    {
      "key": "cloak_elvenkind",
      "name": "Cloak of Elvenkind",
      "r": 5,
      "rarity": "Unique",
      "price": 5,
      "kwHooks": [
        "sneak_attack"
      ],
      "clsLock": "Rogue",
      "bestDelta": 0.122,
      "valPerGold": 0.024,
      "topCarriers": [
        {
          "hero": "wallaby",
          "name": "Wallaby",
          "lift": 12.2,
          "kwMatch": true
        },
        {
          "hero": "velith",
          "name": "Velith",
          "lift": -14.2,
          "kwMatch": true
        }
      ]
    },
    {
      "key": "dagger_venom",
      "name": "Dagger of Venom",
      "r": 5,
      "rarity": "Unique",
      "price": 5,
      "kwHooks": [
        "sneak_attack"
      ],
      "clsLock": "Rogue",
      "bestDelta": 0.202,
      "valPerGold": 0.04,
      "topCarriers": [
        {
          "hero": "wallaby",
          "name": "Wallaby",
          "lift": 20.2,
          "kwMatch": true
        },
        {
          "hero": "velith",
          "name": "Velith",
          "lift": -19.6,
          "kwMatch": true
        }
      ]
    },
    {
      "key": "dragonhide_belt",
      "name": "Dragonhide Belt",
      "r": 5,
      "rarity": "Unique",
      "price": 5,
      "kwHooks": [
        "ki"
      ],
      "clsLock": "Monk",
      "bestDelta": 0.014,
      "valPerGold": 0.003,
      "topCarriers": [
        {
          "hero": "naill",
          "name": "Naill",
          "lift": 1.4,
          "kwMatch": true
        }
      ]
    },
    {
      "key": "staff_striking",
      "name": "Staff of Striking",
      "r": 5,
      "rarity": "Unique",
      "price": 5,
      "kwHooks": [
        "ki"
      ],
      "clsLock": "Monk",
      "bestDelta": 0.101,
      "valPerGold": 0.02,
      "topCarriers": [
        {
          "hero": "naill",
          "name": "Naill",
          "lift": 10.1,
          "kwMatch": true
        }
      ]
    },
    {
      "key": "pipes_haunting",
      "name": "Pipes of Haunting",
      "r": 5,
      "rarity": "Unique",
      "price": 5,
      "kwHooks": [
        "bardic_inspiration"
      ],
      "clsLock": "Bard",
      "bestDelta": 0.032,
      "valPerGold": 0.006,
      "topCarriers": [
        {
          "hero": "toot",
          "name": "Toot",
          "lift": 3.2,
          "kwMatch": true
        },
        {
          "hero": "rosalind",
          "name": "Rosalind",
          "lift": -1.9,
          "kwMatch": true
        }
      ]
    },
    {
      "key": "horn_valhalla",
      "name": "Horn of Valhalla",
      "r": 5,
      "rarity": "Unique",
      "price": 5,
      "kwHooks": [
        "bardic_inspiration"
      ],
      "clsLock": "Bard",
      "bestDelta": 0.058,
      "valPerGold": 0.012,
      "topCarriers": [
        {
          "hero": "toot",
          "name": "Toot",
          "lift": 5.8,
          "kwMatch": true
        },
        {
          "hero": "rosalind",
          "name": "Rosalind",
          "lift": -3.6,
          "kwMatch": true
        }
      ]
    },
    {
      "key": "moon_sickle",
      "name": "Moon Sickle",
      "r": 5,
      "rarity": "Unique",
      "price": 5,
      "kwHooks": [
        "wild_shape"
      ],
      "clsLock": "Druid",
      "bestDelta": 0.027,
      "valPerGold": 0.005,
      "topCarriers": [
        {
          "hero": "kaska",
          "name": "Kaska",
          "lift": 2.7,
          "kwMatch": true
        }
      ]
    },
    {
      "key": "staff_woodlands",
      "name": "Staff of the Woodlands",
      "r": 5,
      "rarity": "Unique",
      "price": 5,
      "kwHooks": [
        "wild_shape"
      ],
      "clsLock": "Druid",
      "bestDelta": 0.204,
      "valPerGold": 0.041,
      "topCarriers": [
        {
          "hero": "juniper",
          "name": "Juniper",
          "lift": 20.4,
          "kwMatch": true
        },
        {
          "hero": "kaska",
          "name": "Kaska",
          "lift": 2.2,
          "kwMatch": true
        }
      ]
    },
    {
      "key": "bloodwell_vial",
      "name": "Bloodwell Vial",
      "r": 5,
      "rarity": "Unique",
      "price": 5,
      "kwHooks": [
        "metamagic"
      ],
      "clsLock": "Sorcerer",
      "bestDelta": 0.031,
      "valPerGold": 0.006,
      "topCarriers": [
        {
          "hero": "cinder",
          "name": "Cinder",
          "lift": 3.1,
          "kwMatch": true
        }
      ]
    },
    {
      "key": "wand_fireballs",
      "name": "Wand of Fireballs",
      "r": 5,
      "rarity": "Unique",
      "price": 5,
      "kwHooks": [
        "metamagic"
      ],
      "clsLock": "Sorcerer",
      "bestDelta": 0.176,
      "valPerGold": 0.035,
      "topCarriers": [
        {
          "hero": "cinder",
          "name": "Cinder",
          "lift": 17.6,
          "kwMatch": true
        }
      ]
    },
    {
      "key": "rod_pact_keeper",
      "name": "Rod of the Pact Keeper",
      "r": 5,
      "rarity": "Unique",
      "price": 5,
      "kwHooks": [
        "hex"
      ],
      "clsLock": "Warlock",
      "bestDelta": -0.017,
      "valPerGold": -0.003,
      "topCarriers": [
        {
          "hero": "nettle",
          "name": "Nettle",
          "lift": -1.7,
          "kwMatch": true
        },
        {
          "hero": "lumen",
          "name": "Lumen",
          "lift": -8.6,
          "kwMatch": true
        }
      ]
    },
    {
      "key": "staff_withering",
      "name": "Staff of Withering",
      "r": 5,
      "rarity": "Unique",
      "price": 5,
      "kwHooks": [
        "hex"
      ],
      "clsLock": "Warlock",
      "bestDelta": 0.029,
      "valPerGold": 0.006,
      "topCarriers": [
        {
          "hero": "lumen",
          "name": "Lumen",
          "lift": 2.9,
          "kwMatch": true
        },
        {
          "hero": "nettle",
          "name": "Nettle",
          "lift": -1.4,
          "kwMatch": true
        }
      ]
    }
  ],
  "comps": [
    {
      "name": "Arcane Recovery Battery",
      "heroes": [
        "gilthrax",
        "faelan",
        "gains",
        "zoe"
      ],
      "avgScore": 85.6,
      "winRate": 100,
      "avgTime": 50.1,
      "avgGold": 10.3
    },
    {
      "name": "Action Surge Armory",
      "heroes": [
        "gilthrax",
        "arthur",
        "zoe",
        "rosalind"
      ],
      "avgScore": 63.1,
      "winRate": 66.7,
      "avgTime": 43.7,
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
      "avgScore": 49.3,
      "winRate": 66.7,
      "avgTime": 32.7,
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
      "avgScore": 46.9,
      "winRate": 33.3,
      "avgTime": 47.8,
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
      "avgScore": 44.4,
      "winRate": 33.3,
      "avgTime": 29.8,
      "avgGold": 4.7
    },
    {
      "name": "Wild Shape Moon & Land",
      "heroes": [
        "mother_laurel",
        "kaska",
        "juniper",
        "velith"
      ],
      "avgScore": 40.9,
      "winRate": 33.3,
      "avgTime": 30.6,
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
      "avgScore": 31.1,
      "winRate": 33.3,
      "avgTime": 24.9,
      "avgGold": 6.7
    },
    {
      "name": "Radiant Smite & Vines",
      "heroes": [
        "dane",
        "mother_laurel",
        "lumen",
        "bram"
      ],
      "avgScore": 22.6,
      "winRate": 0,
      "avgTime": 29.1,
      "avgGold": 0
    },
    {
      "name": "Infernal Hex & Burn",
      "heroes": [
        "dane",
        "cinder",
        "lumen",
        "nettle"
      ],
      "avgScore": 18.4,
      "winRate": 0,
      "avgTime": 13,
      "avgGold": 0
    },
    {
      "name": "Tavern Classic Core",
      "heroes": [
        "bram",
        "arthur",
        "faelan",
        "wallaby"
      ],
      "avgScore": 14.8,
      "winRate": 0,
      "avgTime": 38.6,
      "avgGold": 0.7
    },
    {
      "name": "Backline Dive & Evasion",
      "heroes": [
        "arthur",
        "wallaby",
        "velith",
        "naill"
      ],
      "avgScore": 11,
      "winRate": 0,
      "avgTime": 13.8,
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
      "avgScore": 8.8,
      "winRate": 0,
      "avgTime": 13.4,
      "avgGold": 0
    }
  ],
  "bots": [
    {
      "id": "zero_item",
      "label": "Zero-Item / Naive (0 Items Bought)",
      "target": "< 15% WR",
      "liveWR": 24,
      "act1Clear": 96,
      "act2Clear": 56,
      "piggyBreak": 92,
      "avgGold": 118.9,
      "avgFights": 11.2
    },
    {
      "id": "casual",
      "label": "Casual Player (Random Path & ~45% Items)",
      "target": "25–45% WR",
      "liveWR": 20,
      "act1Clear": 92,
      "act2Clear": 64,
      "piggyBreak": 84,
      "avgGold": 135.2,
      "avgFights": 11.6
    },
    {
      "id": "competent",
      "label": "Competent Tactician (Balanced & Geared)",
      "target": "55–70% WR (40–65% Piggy)",
      "liveWR": 60,
      "act1Clear": 100,
      "act2Clear": 92,
      "piggyBreak": 56,
      "avgGold": 130.7,
      "avgFights": 12.6
    },
    {
      "id": "synergy",
      "label": "Synergy Drafter (Keyword + Role Focus)",
      "target": "55–70% WR (40–65% Piggy)",
      "liveWR": 44,
      "act1Clear": 96,
      "act2Clear": 72,
      "piggyBreak": 80,
      "avgGold": 129.4,
      "avgFights": 11.7
    },
    {
      "id": "greed",
      "label": "Pack 5 Market Greed (Zoe/Toot/Gilthrax/Gains)",
      "target": "≤ 70% WR",
      "liveWR": 52,
      "act1Clear": 76,
      "act2Clear": 68,
      "piggyBreak": 72,
      "avgGold": 122.2,
      "avgFights": 10.3
    }
  ],
  "bosses": [
    {
      "act": 1,
      "key": "glasstaff",
      "won": 44,
      "fought": 50,
      "winRate": 88
    },
    {
      "act": 1,
      "key": "nezznar",
      "won": 37,
      "fought": 41,
      "winRate": 90.2
    },
    {
      "act": 1,
      "key": "venomfang",
      "won": 34,
      "fought": 37,
      "winRate": 91.9
    },
    {
      "act": 2,
      "key": "blackrazor_boss",
      "won": 22,
      "fought": 29,
      "winRate": 75.9
    },
    {
      "act": 2,
      "key": "giant_crab",
      "won": 15,
      "fought": 18,
      "winRate": 83.3
    },
    {
      "act": 2,
      "key": "gynosphinx",
      "won": 17,
      "fought": 21,
      "winRate": 81
    },
    {
      "act": 2,
      "key": "keraptis",
      "won": 34,
      "fought": 38,
      "winRate": 89.5
    },
    {
      "act": 3,
      "key": "asmodeus",
      "won": 13,
      "fought": 30,
      "winRate": 43.3
    },
    {
      "act": 3,
      "key": "orcus",
      "won": 16,
      "fought": 24,
      "winRate": 66.7
    },
    {
      "act": 3,
      "key": "tiamat",
      "won": 21,
      "fought": 31,
      "winRate": 67.7
    }
  ],
  "globalChanges": {
    "combat": [
      {
        "type": "rebal",
        "tag": "Cubed AC/SR",
        "text": "Defense mitigation now follows `1 / (1 + (Eff / 14)^3)` — AC 10 blocks 26.7%, AC 14 blocks 50.0%, AC 20 blocks 74.5%, countered by Armor Pen & Spell Pen."
      },
      {
        "type": "buff",
        "tag": "Radiant True Dmg",
        "text": "Radiant damage (Sir Dane Smite, Lumen Celestial bolts, Sun Blade, Holy Avenger) bypasses both AC and SR completely."
      },
      {
        "type": "buff",
        "tag": "Universal Evasion",
        "text": "All Evasion sources combine multiplicatively (`1 - Π(1 - e_i)`) and trigger Arthur’s Action Surge counter-strikes."
      },
      {
        "type": "rebal",
        "tag": "9 Epic Boons",
        "text": "Tier IV replaces per-path upgrades with a universal 1-of-3 **Epic Boon** picker (Combat Prowess, Fortitude, Irresistible Offense, Recovery, Spell Recall, Fate, Speed, Truesight, Energy Resistance)."
      },
      {
        "type": "rebal",
        "tag": "12 Multiclass Dips",
        "text": "Single-class named shrines (`✧`, no repeats per run) grant a hero a secondary Class Keyword and unlock Curio Uniques for that class."
      },
      {
        "type": "fix",
        "tag": "Lethal Priority",
        "text": "Strict lethal-hit rescue order: `Zealot → Relentless Endurance (1 HP) → Cleric MC (25%) → Boon of Recovery (50%)`."
      }
    ],
    "enemy": [
      {
        "type": "buff",
        "tag": "3 Full Acts",
        "text": "Act 1 **Phandalin** (Klarg Miniboss, 3 bosses), Act 2 **White Plume Mountain** (Dungeon Hazards + Vault Loot, 4 bosses), Act 3 **The Hells** (Wandering Pit Fiend + Devil’s Bargains, 3 Final Bosses: Orcus, Asmodeus, Tiamat)."
      },
      {
        "type": "rebal",
        "tag": "9-Row DAG Map",
        "text": "Constricting non-crossing 9-row DAG (`3→3→3→3→3→2→2→2→1`) with Camp Shop Flow Flip, Act Boss Reminder, and Whole-Shop Freeze."
      },
      {
        "type": "buff",
        "tag": "82 Six-Tier Items",
        "text": "58 Universal Standard Shop items (`Common 2g → Legendary 10g`) with exact 6-attribute parity (`+1/+2/+3/+4/+6`), plus 24 **Unique (5g)** Class-Keyword relics at the Curio Merchant (`⚖`)."
      },
      {
        "type": "rebal",
        "tag": "Strict Disclosure",
        "text": "Tier I hero cards hide Specializations, Quests, Boons, and Multiclass boxes until unlocked; all 48 Specializations are strictly 1-line rules."
      }
    ]
  }
};
