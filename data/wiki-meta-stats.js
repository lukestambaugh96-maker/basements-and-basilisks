/* Auto-generated v0.23 live meta telemetry & changelog for tools/wiki.html */
window.WIKI_META = {
  "version": "0.23 Live Build",
  "generatedAt": "2026-11-23",
  "heroes": {
    "gilthrax": {
      "key": "gilthrax",
      "name": "Gilthrax",
      "role": "Tank",
      "cls": "Fighter",
      "avgScore": 74.9,
      "avgWR": 80,
      "midWR": 100,
      "lateWR": 66.7,
      "avgDmg": 682,
      "avgHeal": 0,
      "avgWard": 1279,
      "avgGold": 0,
      "survPct": 80,
      "avgTime": 20.4,
      "liveRank": 1,
      "baseRank": 5,
      "rankDelta": 4,
      "baseScore": 43.5,
      "scoreDelta": 31.4,
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
          "score": 81.2,
          "wr": 100
        },
        "p1": {
          "k": "bodyguard_fee",
          "n": "Bodyguard’s Fee",
          "score": 66.1,
          "wr": 60
        },
        "winner": "Gilded Hoard"
      },
      "bestPartners": [
        {
          "partner": "faelan",
          "name": "Faelan",
          "sharedKw": [],
          "score": 63.6,
          "winRate": 50,
          "lift": -2.5,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "arthur",
          "name": "Arthur",
          "sharedKw": [
            "action_surge"
          ],
          "score": 52.4,
          "winRate": 50,
          "lift": -9.2,
          "why": "Shared action surge Class Keyword engine chains triggers across both kits."
        },
        {
          "partner": "zoe",
          "name": "Zoe",
          "sharedKw": [
            "action_surge"
          ],
          "score": 50.6,
          "winRate": 50,
          "lift": -8.5,
          "why": "Shared action surge Class Keyword engine chains triggers across both kits."
        },
        {
          "partner": "wallaby",
          "name": "Wallaby",
          "sharedKw": [],
          "score": 44.3,
          "winRate": 50,
          "lift": -15.8,
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
          "winRate": 100,
          "score": 69.9,
          "lift": 49.5,
          "valPerGold": 7.07
        },
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 50,
          "score": 62.4,
          "lift": 42,
          "valPerGold": 7
        },
        {
          "item": "sword_sharpness",
          "name": "Sword of Sharpness",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 50,
          "score": 52,
          "lift": 31.6,
          "valPerGold": 5.27
        },
        {
          "item": "boots_speed",
          "name": "Boots of Speed",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 50,
          "score": 37.9,
          "lift": 17.5,
          "valPerGold": 2.92
        }
      ],
      "bestValueItems": [
        {
          "item": "flame_tongue",
          "name": "Flame Tongue",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 100,
          "score": 69.9,
          "lift": 49.5,
          "valPerGold": 7.07
        },
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 50,
          "score": 62.4,
          "lift": 42,
          "valPerGold": 7
        },
        {
          "item": "sword_sharpness",
          "name": "Sword of Sharpness",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 50,
          "score": 52,
          "lift": 31.6,
          "valPerGold": 5.27
        }
      ]
    },
    "faelan": {
      "key": "faelan",
      "name": "Faelan",
      "role": "Support",
      "cls": "Wizard",
      "avgScore": 57.2,
      "avgWR": 50,
      "midWR": 100,
      "lateWR": 16.7,
      "avgDmg": 116,
      "avgHeal": 0,
      "avgWard": 1207,
      "avgGold": 0,
      "survPct": 40,
      "avgTime": 21.7,
      "liveRank": 2,
      "baseRank": 11,
      "rankDelta": 9,
      "baseScore": 38.9,
      "scoreDelta": 18.3,
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
          "score": 59.2,
          "wr": 60
        },
        "p1": {
          "k": "spell_battery",
          "n": "Spell Battery",
          "score": 49.3,
          "wr": 40
        },
        "winner": "Projected Ward"
      },
      "bestPartners": [
        {
          "partner": "arthur",
          "name": "Arthur",
          "sharedKw": [],
          "score": 41.7,
          "winRate": 50,
          "lift": -11,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "gains",
          "name": "Gains",
          "sharedKw": [
            "arcane_recovery"
          ],
          "score": 20.3,
          "winRate": 0,
          "lift": -30.9,
          "why": "Shared arcane recovery Class Keyword engine chains triggers across both kits."
        },
        {
          "partner": "bram",
          "name": "Bram",
          "sharedKw": [],
          "score": 18.4,
          "winRate": 0,
          "lift": -35.9,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "wallaby",
          "name": "Wallaby",
          "sharedKw": [],
          "score": 16.6,
          "winRate": 0,
          "lift": -34.6,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        }
      ],
      "bestItems": [
        {
          "item": "ring_spell_storing",
          "name": "Ring of Spell Storing",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 23.7,
          "lift": 10.9,
          "valPerGold": 1.82
        },
        {
          "item": "arcane_grimoire",
          "name": "Arcane Grimoire",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 19.1,
          "lift": 6.3,
          "valPerGold": 0.9
        },
        {
          "item": "pearl_power",
          "name": "Pearl of Power",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 19,
          "lift": 6.2,
          "valPerGold": 0.89
        },
        {
          "item": "wand_web",
          "name": "Wand of Web",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 14.7,
          "lift": 1.9,
          "valPerGold": 0.32
        }
      ],
      "bestValueItems": [
        {
          "item": "ring_spell_storing",
          "name": "Ring of Spell Storing",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 23.7,
          "lift": 10.9,
          "valPerGold": 1.82
        },
        {
          "item": "arcane_grimoire",
          "name": "Arcane Grimoire",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 19.1,
          "lift": 6.3,
          "valPerGold": 0.9
        },
        {
          "item": "pearl_power",
          "name": "Pearl of Power",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 19,
          "lift": 6.2,
          "valPerGold": 0.89
        }
      ]
    },
    "kaska": {
      "key": "kaska",
      "name": "Kaska",
      "role": "Support",
      "cls": "Druid",
      "avgScore": 56.2,
      "avgWR": 50,
      "midWR": 100,
      "lateWR": 16.7,
      "avgDmg": 233,
      "avgHeal": 105,
      "avgWard": 0,
      "avgGold": 0,
      "survPct": 50,
      "avgTime": 17.8,
      "liveRank": 3,
      "baseRank": 4,
      "rankDelta": 1,
      "baseScore": 43.6,
      "scoreDelta": 12.6,
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
          "score": 50.3,
          "wr": 40
        },
        "p1": {
          "k": "pack_hunt",
          "n": "Pack Hunt",
          "score": 56.5,
          "wr": 60
        },
        "winner": "Pack Hunt"
      },
      "bestPartners": [
        {
          "partner": "arthur",
          "name": "Arthur",
          "sharedKw": [],
          "score": 27.9,
          "winRate": 0,
          "lift": -24.3,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "juniper",
          "name": "Juniper",
          "sharedKw": [
            "wild_shape"
          ],
          "score": 21.7,
          "winRate": 0,
          "lift": -32.6,
          "why": "Shared wild shape Class Keyword engine chains triggers across both kits."
        },
        {
          "partner": "wallaby",
          "name": "Wallaby",
          "sharedKw": [],
          "score": 18.4,
          "winRate": 0,
          "lift": -32.3,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "bram",
          "name": "Bram",
          "sharedKw": [],
          "score": 14.3,
          "winRate": 0,
          "lift": -39.5,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        }
      ],
      "bestItems": [
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 16.7,
          "lift": 7.1,
          "valPerGold": 1.18
        },
        {
          "item": "moon_sickle",
          "name": "Moon Sickle",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 12.6,
          "lift": 3,
          "valPerGold": 0.43
        },
        {
          "item": "sword_sharpness",
          "name": "Sword of Sharpness",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 14.1,
          "lift": 4.5,
          "valPerGold": 0.75
        },
        {
          "item": "staff_woodlands",
          "name": "Staff of the Woodlands",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 11.6,
          "lift": 2,
          "valPerGold": 0.29
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
          "score": 16.7,
          "lift": 7.1,
          "valPerGold": 1.18
        },
        {
          "item": "sword_sharpness",
          "name": "Sword of Sharpness",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 14.1,
          "lift": 4.5,
          "valPerGold": 0.75
        },
        {
          "item": "boots_speed",
          "name": "Boots of Speed",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 13.2,
          "lift": 3.6,
          "valPerGold": 0.6
        }
      ]
    },
    "velith": {
      "key": "velith",
      "name": "Velith",
      "role": "Damage",
      "cls": "Rogue",
      "avgScore": 54.3,
      "avgWR": 50,
      "midWR": 100,
      "lateWR": 16.7,
      "avgDmg": 912,
      "avgHeal": 0,
      "avgWard": 0,
      "avgGold": 0,
      "survPct": 50,
      "avgTime": 21.7,
      "liveRank": 4,
      "baseRank": 2,
      "rankDelta": -2,
      "baseScore": 47.5,
      "scoreDelta": 6.8,
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
          "score": 47.8,
          "wr": 40
        },
        "p1": {
          "k": "nightshade",
          "n": "Nightshade Vials",
          "score": 54.1,
          "wr": 60
        },
        "winner": "Nightshade Vials"
      },
      "bestPartners": [
        {
          "partner": "faelan",
          "name": "Faelan",
          "sharedKw": [],
          "score": 33.6,
          "winRate": 0,
          "lift": -22.1,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "bram",
          "name": "Bram",
          "sharedKw": [],
          "score": 33.3,
          "winRate": 50,
          "lift": -19.5,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "dane",
          "name": "Sir Dane",
          "sharedKw": [],
          "score": 26.9,
          "winRate": 0,
          "lift": -24.8,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "wallaby",
          "name": "Wallaby",
          "sharedKw": [
            "sneak_attack"
          ],
          "score": 17.3,
          "winRate": 0,
          "lift": -32.5,
          "why": "Shared sneak attack Class Keyword engine chains triggers across both kits."
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
          "score": 11.3,
          "lift": 2.5,
          "valPerGold": 0.36
        },
        {
          "item": "cloak_elvenkind",
          "name": "Cloak of Elvenkind",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 9.6,
          "lift": 0.8,
          "valPerGold": 0.11
        },
        {
          "item": "boots_speed",
          "name": "Boots of Speed",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 10.3,
          "lift": 1.5,
          "valPerGold": 0.25
        },
        {
          "item": "ring_protection",
          "name": "Ring of Protection",
          "rarity": 1,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 9.4,
          "lift": 0.6,
          "valPerGold": 0.15
        }
      ],
      "bestValueItems": [
        {
          "item": "dagger_venom",
          "name": "Dagger of Venom",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 11.3,
          "lift": 2.5,
          "valPerGold": 0.36
        },
        {
          "item": "boots_speed",
          "name": "Boots of Speed",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 10.3,
          "lift": 1.5,
          "valPerGold": 0.25
        },
        {
          "item": "ring_protection",
          "name": "Ring of Protection",
          "rarity": 1,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 9.4,
          "lift": 0.6,
          "valPerGold": 0.15
        }
      ]
    },
    "jamison": {
      "key": "jamison",
      "name": "Brother Jamison",
      "role": "Support",
      "cls": "Cleric",
      "avgScore": 52.8,
      "avgWR": 40,
      "midWR": 100,
      "lateWR": 0,
      "avgDmg": 79,
      "avgHeal": 397,
      "avgWard": 25,
      "avgGold": 0,
      "survPct": 40,
      "avgTime": 16.9,
      "liveRank": 5,
      "baseRank": 10,
      "rankDelta": 5,
      "baseScore": 39.7,
      "scoreDelta": 13.1,
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
          "score": 49.1,
          "wr": 40
        },
        "p1": {
          "k": "radiant_link",
          "n": "Radiant Link",
          "score": 49.1,
          "wr": 40
        },
        "winner": "Even"
      },
      "bestPartners": [
        {
          "partner": "arthur",
          "name": "Arthur",
          "sharedKw": [],
          "score": 16.8,
          "winRate": 0,
          "lift": -33.7,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "bram",
          "name": "Bram",
          "sharedKw": [
            "channel_divinity"
          ],
          "score": 12.9,
          "winRate": 0,
          "lift": -39.2,
          "why": "Shared channel divinity Class Keyword engine chains triggers across both kits."
        },
        {
          "partner": "wallaby",
          "name": "Wallaby",
          "sharedKw": [],
          "score": 13.8,
          "winRate": 0,
          "lift": -35.2,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "saint",
          "name": "Saint",
          "sharedKw": [
            "channel_divinity"
          ],
          "score": 10.9,
          "winRate": 0,
          "lift": -38.8,
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
          "score": 17,
          "lift": 4.2,
          "valPerGold": 0.6
        },
        {
          "item": "glamoured_leather",
          "name": "Glamoured Studded Leather",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 12.6,
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
          "score": 12.1,
          "lift": -0.7,
          "valPerGold": -0.12
        },
        {
          "item": "amulet_devout",
          "name": "Amulet of the Devout",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 9.9,
          "lift": -2.9,
          "valPerGold": -0.41
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
          "score": 17,
          "lift": 4.2,
          "valPerGold": 0.6
        },
        {
          "item": "glamoured_leather",
          "name": "Glamoured Studded Leather",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 12.6,
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
          "score": 12.1,
          "lift": -0.7,
          "valPerGold": -0.12
        }
      ]
    },
    "juniper": {
      "key": "juniper",
      "name": "Juniper",
      "role": "Support",
      "cls": "Druid",
      "avgScore": 52.4,
      "avgWR": 40,
      "midWR": 100,
      "lateWR": 0,
      "avgDmg": 457,
      "avgHeal": 61,
      "avgWard": 0,
      "avgGold": 0,
      "survPct": 40,
      "avgTime": 17.9,
      "liveRank": 6,
      "baseRank": 3,
      "rankDelta": -3,
      "baseScore": 46.9,
      "scoreDelta": 5.5,
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
          "score": 48.8,
          "wr": 40
        },
        "p1": {
          "k": "circle_land",
          "n": "Circle of the Land",
          "score": 51.3,
          "wr": 40
        },
        "winner": "Circle of the Land"
      },
      "bestPartners": [
        {
          "partner": "bram",
          "name": "Bram",
          "sharedKw": [],
          "score": 26.5,
          "winRate": 0,
          "lift": -25.4,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "arthur",
          "name": "Arthur",
          "sharedKw": [],
          "score": 24.3,
          "winRate": 0,
          "lift": -26,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "kaska",
          "name": "Kaska",
          "sharedKw": [
            "wild_shape"
          ],
          "score": 21,
          "winRate": 0,
          "lift": -33.3,
          "why": "Shared wild shape Class Keyword engine chains triggers across both kits."
        },
        {
          "partner": "wallaby",
          "name": "Wallaby",
          "sharedKw": [],
          "score": 20.8,
          "winRate": 0,
          "lift": -28,
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
          "score": 19.6,
          "lift": 6.1,
          "valPerGold": 0.87
        },
        {
          "item": "stone_good_luck",
          "name": "Stone of Good Luck",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 19.5,
          "lift": 6,
          "valPerGold": 1
        },
        {
          "item": "boots_speed",
          "name": "Boots of Speed",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 16.9,
          "lift": 3.4,
          "valPerGold": 0.57
        },
        {
          "item": "wand_web",
          "name": "Wand of Web",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 14.1,
          "lift": 0.6,
          "valPerGold": 0.1
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
          "score": 19.5,
          "lift": 6,
          "valPerGold": 1
        },
        {
          "item": "staff_woodlands",
          "name": "Staff of the Woodlands",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 19.6,
          "lift": 6.1,
          "valPerGold": 0.87
        },
        {
          "item": "boots_speed",
          "name": "Boots of Speed",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 16.9,
          "lift": 3.4,
          "valPerGold": 0.57
        }
      ]
    },
    "bram": {
      "key": "bram",
      "name": "Bram",
      "role": "Tank",
      "cls": "Cleric",
      "avgScore": 51.4,
      "avgWR": 40,
      "midWR": 100,
      "lateWR": 0,
      "avgDmg": 79,
      "avgHeal": 278,
      "avgWard": 10,
      "avgGold": 0,
      "survPct": 40,
      "avgTime": 14.8,
      "liveRank": 7,
      "baseRank": 15,
      "rankDelta": 8,
      "baseScore": 33.5,
      "scoreDelta": 17.9,
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
          "score": 49.4,
          "wr": 40
        },
        "p1": {
          "k": "divine_strike",
          "n": "Divine Strike",
          "score": 46.6,
          "wr": 40
        },
        "winner": "Disciple of Life"
      },
      "bestPartners": [
        {
          "partner": "faelan",
          "name": "Faelan",
          "sharedKw": [],
          "score": 26.3,
          "winRate": 0,
          "lift": -28,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "jamison",
          "name": "Brother Jamison",
          "sharedKw": [
            "channel_divinity"
          ],
          "score": 20.1,
          "winRate": 0,
          "lift": -32,
          "why": "Shared channel divinity Class Keyword engine chains triggers across both kits."
        },
        {
          "partner": "arthur",
          "name": "Arthur",
          "sharedKw": [],
          "score": 19.2,
          "winRate": 0,
          "lift": -30.6,
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
          "lift": -36.1,
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
          "score": 14.5,
          "lift": 4,
          "valPerGold": 0.57
        },
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 14.3,
          "lift": 3.8,
          "valPerGold": 0.63
        },
        {
          "item": "amulet_devout",
          "name": "Amulet of the Devout",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 11.1,
          "lift": 0.6,
          "valPerGold": 0.09
        },
        {
          "item": "boots_speed",
          "name": "Boots of Speed",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 12.3,
          "lift": 1.8,
          "valPerGold": 0.3
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
          "score": 14.3,
          "lift": 3.8,
          "valPerGold": 0.63
        },
        {
          "item": "staff_healing",
          "name": "Staff of Healing",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 14.5,
          "lift": 4,
          "valPerGold": 0.57
        },
        {
          "item": "boots_speed",
          "name": "Boots of Speed",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 12.3,
          "lift": 1.8,
          "valPerGold": 0.3
        }
      ]
    },
    "cinder": {
      "key": "cinder",
      "name": "Cinder",
      "role": "Damage",
      "cls": "Sorcerer",
      "avgScore": 51.3,
      "avgWR": 40,
      "midWR": 100,
      "lateWR": 0,
      "avgDmg": 873,
      "avgHeal": 0,
      "avgWard": 0,
      "avgGold": 0,
      "survPct": 30,
      "avgTime": 17.4,
      "liveRank": 8,
      "baseRank": 8,
      "rankDelta": 0,
      "baseScore": 40.8,
      "scoreDelta": 10.5,
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
          "score": 50.2,
          "wr": 40
        },
        "p1": {
          "k": "wildfire",
          "n": "Wildfire",
          "score": 45.7,
          "wr": 40
        },
        "winner": "Draconic Surge"
      },
      "bestPartners": [
        {
          "partner": "faelan",
          "name": "Faelan",
          "sharedKw": [],
          "score": 61,
          "winRate": 50,
          "lift": 6.8,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "juniper",
          "name": "Juniper",
          "sharedKw": [],
          "score": 29.1,
          "winRate": 0,
          "lift": -22.7,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "bram",
          "name": "Bram",
          "sharedKw": [],
          "score": 26.5,
          "winRate": 0,
          "lift": -24.8,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "dane",
          "name": "Sir Dane",
          "sharedKw": [],
          "score": 26,
          "winRate": 0,
          "lift": -24.2,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        }
      ],
      "bestItems": [
        {
          "item": "wand_fireballs",
          "name": "Wand of Fireballs",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 22.6,
          "lift": 4.1,
          "valPerGold": 0.59
        },
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 19,
          "lift": 0.5,
          "valPerGold": 0.08
        },
        {
          "item": "bloodwell_vial",
          "name": "Bloodwell Vial",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 16.7,
          "lift": -1.8,
          "valPerGold": -0.26
        },
        {
          "item": "bag_holding",
          "name": "Bag of Holding",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 14.9,
          "lift": -3.6,
          "valPerGold": -0.6
        }
      ],
      "bestValueItems": [
        {
          "item": "wand_fireballs",
          "name": "Wand of Fireballs",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 22.6,
          "lift": 4.1,
          "valPerGold": 0.59
        },
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 19,
          "lift": 0.5,
          "valPerGold": 0.08
        },
        {
          "item": "bloodwell_vial",
          "name": "Bloodwell Vial",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 16.7,
          "lift": -1.8,
          "valPerGold": -0.26
        }
      ]
    },
    "mother_laurel": {
      "key": "mother_laurel",
      "name": "Mother Laurel",
      "role": "Tank",
      "cls": "Paladin",
      "avgScore": 51.1,
      "avgWR": 50,
      "midWR": 100,
      "lateWR": 16.7,
      "avgDmg": 233,
      "avgHeal": 132,
      "avgWard": 25,
      "avgGold": 0,
      "survPct": 30,
      "avgTime": 14.5,
      "liveRank": 9,
      "baseRank": 7,
      "rankDelta": -2,
      "baseScore": 41.6,
      "scoreDelta": 9.5,
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
          "score": 52.4,
          "wr": 60
        },
        "p1": {
          "k": "bountiful_vines",
          "n": "Bountiful Vines",
          "score": 43.9,
          "wr": 40
        },
        "winner": "Overgrowth Ward"
      },
      "bestPartners": [
        {
          "partner": "faelan",
          "name": "Faelan",
          "sharedKw": [],
          "score": 35.5,
          "winRate": 50,
          "lift": -18.7,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "arthur",
          "name": "Arthur",
          "sharedKw": [],
          "score": 25.8,
          "winRate": 0,
          "lift": -23.9,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "dane",
          "name": "Sir Dane",
          "sharedKw": [
            "smite",
            "aura"
          ],
          "score": 17.1,
          "winRate": 0,
          "lift": -33,
          "why": "Shared smite & aura Class Keyword engine chains triggers across both kits."
        },
        {
          "partner": "wallaby",
          "name": "Wallaby",
          "sharedKw": [],
          "score": 12.5,
          "winRate": 0,
          "lift": -35.7,
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
          "score": 9,
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
          "score": 10,
          "lift": 0.9,
          "valPerGold": 0.15
        },
        {
          "item": "boots_speed",
          "name": "Boots of Speed",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 9.7,
          "lift": 0.6,
          "valPerGold": 0.1
        },
        {
          "item": "holy_symbol_ravenkind",
          "name": "Holy Symbol of Ravenkind",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 7.4,
          "lift": -1.7,
          "valPerGold": -0.24
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
          "score": 10,
          "lift": 0.9,
          "valPerGold": 0.15
        },
        {
          "item": "boots_speed",
          "name": "Boots of Speed",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 9.7,
          "lift": 0.6,
          "valPerGold": 0.1
        },
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 9.1,
          "lift": 0,
          "valPerGold": 0
        }
      ]
    },
    "dane": {
      "key": "dane",
      "name": "Sir Dane",
      "role": "Tank",
      "cls": "Paladin",
      "avgScore": 49.1,
      "avgWR": 40,
      "midWR": 100,
      "lateWR": 0,
      "avgDmg": 173,
      "avgHeal": 0,
      "avgWard": 140,
      "avgGold": 0,
      "survPct": 30,
      "avgTime": 15.1,
      "liveRank": 10,
      "baseRank": 6,
      "rankDelta": -4,
      "baseScore": 42.7,
      "scoreDelta": 6.4,
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
          "score": 46.3,
          "wr": 40
        },
        "p1": {
          "k": "aura_protection",
          "n": "Aura of Protection",
          "score": 46.2,
          "wr": 40
        },
        "winner": "Even"
      },
      "bestPartners": [
        {
          "partner": "mother_laurel",
          "name": "Mother Laurel",
          "sharedKw": [
            "aura",
            "smite"
          ],
          "score": 17.3,
          "winRate": 0,
          "lift": -32.8,
          "why": "Shared aura & smite Class Keyword engine chains triggers across both kits."
        },
        {
          "partner": "faelan",
          "name": "Faelan",
          "sharedKw": [],
          "score": 19.9,
          "winRate": 0,
          "lift": -33.3,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "arthur",
          "name": "Arthur",
          "sharedKw": [],
          "score": 16.4,
          "winRate": 0,
          "lift": -32.3,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "wallaby",
          "name": "Wallaby",
          "sharedKw": [],
          "score": 10.6,
          "winRate": 0,
          "lift": -36.6,
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
          "score": 8.4,
          "lift": 1.3,
          "valPerGold": 0.19
        },
        {
          "item": "boots_speed",
          "name": "Boots of Speed",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 9.6,
          "lift": 2.5,
          "valPerGold": 0.42
        },
        {
          "item": "holy_symbol_ravenkind",
          "name": "Holy Symbol of Ravenkind",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 7.1,
          "lift": 0,
          "valPerGold": 0
        },
        {
          "item": "sword_sharpness",
          "name": "Sword of Sharpness",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 7.6,
          "lift": 0.5,
          "valPerGold": 0.08
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
          "score": 9.6,
          "lift": 2.5,
          "valPerGold": 0.42
        },
        {
          "item": "sun_blade",
          "name": "Sun Blade",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 8.4,
          "lift": 1.3,
          "valPerGold": 0.19
        },
        {
          "item": "sword_sharpness",
          "name": "Sword of Sharpness",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 7.6,
          "lift": 0.5,
          "valPerGold": 0.08
        }
      ]
    },
    "naill": {
      "key": "naill",
      "name": "Naill",
      "role": "Damage",
      "cls": "Monk",
      "avgScore": 49,
      "avgWR": 40,
      "midWR": 100,
      "lateWR": 0,
      "avgDmg": 576,
      "avgHeal": 0,
      "avgWard": 0,
      "avgGold": 0,
      "survPct": 40,
      "avgTime": 22.5,
      "liveRank": 11,
      "baseRank": 9,
      "rankDelta": -2,
      "baseScore": 40.6,
      "scoreDelta": 8.4,
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
          "score": 45.8,
          "wr": 40
        },
        "p1": {
          "k": "flowing_leaves",
          "n": "Flowing Leaves",
          "score": 45,
          "wr": 40
        },
        "winner": "Even"
      },
      "bestPartners": [
        {
          "partner": "faelan",
          "name": "Faelan",
          "sharedKw": [],
          "score": 49.4,
          "winRate": 50,
          "lift": -3.7,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "juniper",
          "name": "Juniper",
          "sharedKw": [],
          "score": 24.6,
          "winRate": 0,
          "lift": -26.1,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "dane",
          "name": "Sir Dane",
          "sharedKw": [],
          "score": 15.8,
          "winRate": 0,
          "lift": -33.3,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "bram",
          "name": "Bram",
          "sharedKw": [],
          "score": 13.8,
          "winRate": 0,
          "lift": -36.4,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        }
      ],
      "bestItems": [
        {
          "item": "staff_striking",
          "name": "Staff of Striking",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 9.5,
          "lift": 1.4,
          "valPerGold": 0.2
        },
        {
          "item": "dragonhide_belt",
          "name": "Dragonhide Belt",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 6.5,
          "lift": -1.6,
          "valPerGold": -0.23
        },
        {
          "item": "boots_speed",
          "name": "Boots of Speed",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 7.8,
          "lift": -0.3,
          "valPerGold": -0.05
        },
        {
          "item": "ring_protection",
          "name": "Ring of Protection",
          "rarity": 1,
          "cost": 4,
          "kwMatch": false,
          "winRate": 0,
          "score": 6.7,
          "lift": -1.4,
          "valPerGold": -0.35
        }
      ],
      "bestValueItems": [
        {
          "item": "staff_striking",
          "name": "Staff of Striking",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 9.5,
          "lift": 1.4,
          "valPerGold": 0.2
        },
        {
          "item": "boots_speed",
          "name": "Boots of Speed",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 7.8,
          "lift": -0.3,
          "valPerGold": -0.05
        },
        {
          "item": "dragonhide_belt",
          "name": "Dragonhide Belt",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 6.5,
          "lift": -1.6,
          "valPerGold": -0.23
        }
      ]
    },
    "arthur": {
      "key": "arthur",
      "name": "Arthur",
      "role": "Damage",
      "cls": "Fighter",
      "avgScore": 48.2,
      "avgWR": 40,
      "midWR": 100,
      "lateWR": 0,
      "avgDmg": 594,
      "avgHeal": 0,
      "avgWard": 0,
      "avgGold": 0,
      "survPct": 40,
      "avgTime": 23.6,
      "liveRank": 12,
      "baseRank": 12,
      "rankDelta": 0,
      "baseScore": 38,
      "scoreDelta": 10.2,
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
          "score": 45.5,
          "wr": 40
        },
        "p1": {
          "k": "init_splash",
          "n": "Roll for Initiative",
          "score": 43.9,
          "wr": 40
        },
        "winner": "Constant Vigilance"
      },
      "bestPartners": [
        {
          "partner": "gilthrax",
          "name": "Gilthrax",
          "sharedKw": [
            "action_surge"
          ],
          "score": 55.1,
          "winRate": 50,
          "lift": -6.5,
          "why": "Shared action surge Class Keyword engine chains triggers across both kits."
        },
        {
          "partner": "faelan",
          "name": "Faelan",
          "sharedKw": [],
          "score": 23.9,
          "winRate": 0,
          "lift": -28.8,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "bram",
          "name": "Bram",
          "sharedKw": [],
          "score": 21.7,
          "winRate": 0,
          "lift": -28.1,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "zoe",
          "name": "Zoe",
          "sharedKw": [
            "action_surge"
          ],
          "score": 16,
          "winRate": 0,
          "lift": -29.8,
          "why": "Shared action surge Class Keyword engine chains triggers across both kits."
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
          "score": 8.7,
          "lift": 3,
          "valPerGold": 0.43
        },
        {
          "item": "weapon_warning",
          "name": "Weapon of Warning",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 7.1,
          "lift": 1.4,
          "valPerGold": 0.2
        },
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 8.4,
          "lift": 2.7,
          "valPerGold": 0.45
        },
        {
          "item": "sword_sharpness",
          "name": "Sword of Sharpness",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 8.2,
          "lift": 2.5,
          "valPerGold": 0.42
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
          "score": 8.4,
          "lift": 2.7,
          "valPerGold": 0.45
        },
        {
          "item": "flame_tongue",
          "name": "Flame Tongue",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 8.7,
          "lift": 3,
          "valPerGold": 0.43
        },
        {
          "item": "sword_sharpness",
          "name": "Sword of Sharpness",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 8.2,
          "lift": 2.5,
          "valPerGold": 0.42
        }
      ]
    },
    "lorcan": {
      "key": "lorcan",
      "name": "Lorcan",
      "role": "Damage",
      "cls": "Ranger",
      "avgScore": 48.1,
      "avgWR": 40,
      "midWR": 100,
      "lateWR": 0,
      "avgDmg": 409,
      "avgHeal": 0,
      "avgWard": 0,
      "avgGold": 0,
      "survPct": 40,
      "avgTime": 17.4,
      "liveRank": 13,
      "baseRank": 18,
      "rankDelta": 5,
      "baseScore": 32.9,
      "scoreDelta": 15.2,
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
          "score": 43.9,
          "wr": 40
        },
        "p1": {
          "k": "pack_hunter",
          "n": "Pack Hunter",
          "score": 44.2,
          "wr": 40
        },
        "winner": "Even"
      },
      "bestPartners": [
        {
          "partner": "faelan",
          "name": "Faelan",
          "sharedKw": [],
          "score": 51.7,
          "winRate": 50,
          "lift": -1,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "bram",
          "name": "Bram",
          "sharedKw": [],
          "score": 21.4,
          "winRate": 0,
          "lift": -28.4,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "corvin",
          "name": "Corvin",
          "sharedKw": [
            "hunters_mark"
          ],
          "score": 17.8,
          "winRate": 0,
          "lift": -29.7,
          "why": "Shared hunters mark Class Keyword engine chains triggers across both kits."
        },
        {
          "partner": "dane",
          "name": "Sir Dane",
          "sharedKw": [],
          "score": 12.2,
          "winRate": 0,
          "lift": -36.4,
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
          "score": 10.6,
          "lift": 4.9,
          "valPerGold": 0.7
        },
        {
          "item": "bracers_archery",
          "name": "Bracers of Archery",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 6.8,
          "lift": 1.1,
          "valPerGold": 0.16
        },
        {
          "item": "boots_speed",
          "name": "Boots of Speed",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 6.4,
          "lift": 0.7,
          "valPerGold": 0.12
        },
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 6.2,
          "lift": 0.5,
          "valPerGold": 0.08
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
          "score": 10.6,
          "lift": 4.9,
          "valPerGold": 0.7
        },
        {
          "item": "bracers_archery",
          "name": "Bracers of Archery",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 6.8,
          "lift": 1.1,
          "valPerGold": 0.16
        },
        {
          "item": "boots_speed",
          "name": "Boots of Speed",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 6.4,
          "lift": 0.7,
          "valPerGold": 0.12
        }
      ]
    },
    "lumen": {
      "key": "lumen",
      "name": "Lumen",
      "role": "Damage",
      "cls": "Warlock",
      "avgScore": 48.1,
      "avgWR": 40,
      "midWR": 100,
      "lateWR": 0,
      "avgDmg": 494,
      "avgHeal": 23,
      "avgWard": 0,
      "avgGold": 0,
      "survPct": 40,
      "avgTime": 17.2,
      "liveRank": 14,
      "baseRank": 21,
      "rankDelta": 7,
      "baseScore": 32.4,
      "scoreDelta": 15.7,
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
          "score": 44.9,
          "wr": 40
        },
        "p1": {
          "k": "healing_light",
          "n": "Healing Light",
          "score": 43.6,
          "wr": 40
        },
        "winner": "Searing Focus"
      },
      "bestPartners": [
        {
          "partner": "faelan",
          "name": "Faelan",
          "sharedKw": [],
          "score": 52,
          "winRate": 50,
          "lift": -0.7,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "nettle",
          "name": "Nettle",
          "sharedKw": [
            "hex"
          ],
          "score": 18.1,
          "winRate": 0,
          "lift": -28.4,
          "why": "Shared hex Class Keyword engine chains triggers across both kits."
        },
        {
          "partner": "bram",
          "name": "Bram",
          "sharedKw": [],
          "score": 18.8,
          "winRate": 0,
          "lift": -30.9,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "dane",
          "name": "Sir Dane",
          "sharedKw": [],
          "score": 14,
          "winRate": 0,
          "lift": -34.6,
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
          "score": 10.6,
          "lift": 2.9,
          "valPerGold": 0.41
        },
        {
          "item": "rod_pact_keeper",
          "name": "Rod of the Pact Keeper",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 9.9,
          "lift": 2.2,
          "valPerGold": 0.31
        },
        {
          "item": "bag_holding",
          "name": "Bag of Holding",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 10.5,
          "lift": 2.8,
          "valPerGold": 0.47
        },
        {
          "item": "glamoured_leather",
          "name": "Glamoured Studded Leather",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 7.4,
          "lift": -0.3,
          "valPerGold": -0.05
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
          "score": 10.5,
          "lift": 2.8,
          "valPerGold": 0.47
        },
        {
          "item": "staff_withering",
          "name": "Staff of Withering",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 10.6,
          "lift": 2.9,
          "valPerGold": 0.41
        },
        {
          "item": "rod_pact_keeper",
          "name": "Rod of the Pact Keeper",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 9.9,
          "lift": 2.2,
          "valPerGold": 0.31
        }
      ]
    },
    "pillar": {
      "key": "pillar",
      "name": "Pillar",
      "role": "Tank",
      "cls": "Barbarian",
      "avgScore": 47.9,
      "avgWR": 40,
      "midWR": 100,
      "lateWR": 0,
      "avgDmg": 261,
      "avgHeal": 0,
      "avgWard": 0,
      "avgGold": 0,
      "survPct": 20,
      "avgTime": 18.5,
      "liveRank": 15,
      "baseRank": 17,
      "rankDelta": 2,
      "baseScore": 33,
      "scoreDelta": 14.9,
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
          "score": 44.8,
          "wr": 40
        },
        "p1": {
          "k": "living_beacon",
          "n": "Living Beacon",
          "score": 46.4,
          "wr": 40
        },
        "winner": "Living Beacon"
      },
      "bestPartners": [
        {
          "partner": "zark",
          "name": "Zark",
          "sharedKw": [
            "rage"
          ],
          "score": 48,
          "winRate": 50,
          "lift": 0.7,
          "why": "Shared rage Class Keyword engine chains triggers across both kits."
        },
        {
          "partner": "wallaby",
          "name": "Wallaby",
          "sharedKw": [],
          "score": 40.1,
          "winRate": 0,
          "lift": -6.4,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "arthur",
          "name": "Arthur",
          "sharedKw": [],
          "score": 35.7,
          "winRate": 0,
          "lift": -12.3,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "faelan",
          "name": "Faelan",
          "sharedKw": [],
          "score": 19.7,
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
          "score": 27,
          "lift": 5.5,
          "valPerGold": 0.92
        },
        {
          "item": "sword_sharpness",
          "name": "Sword of Sharpness",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 22.4,
          "lift": 0.9,
          "valPerGold": 0.15
        },
        {
          "item": "periapt_wound_closure",
          "name": "Periapt of Wound Closure",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 7.8,
          "lift": -13.7,
          "valPerGold": -1.96
        },
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 9.4,
          "lift": -12.1,
          "valPerGold": -2.02
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
          "score": 27,
          "lift": 5.5,
          "valPerGold": 0.92
        },
        {
          "item": "sword_sharpness",
          "name": "Sword of Sharpness",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 22.4,
          "lift": 0.9,
          "valPerGold": 0.15
        },
        {
          "item": "periapt_wound_closure",
          "name": "Periapt of Wound Closure",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 7.8,
          "lift": -13.7,
          "valPerGold": -1.96
        }
      ]
    },
    "corvin": {
      "key": "corvin",
      "name": "Corvin",
      "role": "Damage",
      "cls": "Ranger",
      "avgScore": 46.9,
      "avgWR": 40,
      "midWR": 100,
      "lateWR": 0,
      "avgDmg": 516,
      "avgHeal": 0,
      "avgWard": 0,
      "avgGold": 0,
      "survPct": 40,
      "avgTime": 22,
      "liveRank": 16,
      "baseRank": 16,
      "rankDelta": 0,
      "baseScore": 33.5,
      "scoreDelta": 13.4,
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
          "score": 42.9,
          "wr": 40
        },
        "p1": {
          "k": "first_strike",
          "n": "First Strike",
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
          "score": 42.1,
          "winRate": 50,
          "lift": -9.9,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "lorcan",
          "name": "Lorcan",
          "sharedKw": [
            "hunters_mark"
          ],
          "score": 18.7,
          "winRate": 0,
          "lift": -28.8,
          "why": "Shared hunters mark Class Keyword engine chains triggers across both kits."
        },
        {
          "partner": "dane",
          "name": "Sir Dane",
          "sharedKw": [],
          "score": 15.9,
          "winRate": 0,
          "lift": -32.1,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "bram",
          "name": "Bram",
          "sharedKw": [],
          "score": 15.1,
          "winRate": 0,
          "lift": -34,
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
          "score": 10.8,
          "lift": 3.4,
          "valPerGold": 0.49
        },
        {
          "item": "sun_blade",
          "name": "Sun Blade",
          "rarity": 5,
          "cost": 7,
          "kwMatch": false,
          "winRate": 0,
          "score": 8.2,
          "lift": 0.8,
          "valPerGold": 0.11
        },
        {
          "item": "boots_speed",
          "name": "Boots of Speed",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 7.8,
          "lift": 0.4,
          "valPerGold": 0.07
        },
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 7.3,
          "lift": -0.1,
          "valPerGold": -0.02
        }
      ],
      "bestValueItems": [
        {
          "item": "bracers_archery",
          "name": "Bracers of Archery",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 10.8,
          "lift": 3.4,
          "valPerGold": 0.49
        },
        {
          "item": "sun_blade",
          "name": "Sun Blade",
          "rarity": 5,
          "cost": 7,
          "kwMatch": false,
          "winRate": 0,
          "score": 8.2,
          "lift": 0.8,
          "valPerGold": 0.11
        },
        {
          "item": "boots_speed",
          "name": "Boots of Speed",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 7.8,
          "lift": 0.4,
          "valPerGold": 0.07
        }
      ]
    },
    "zark": {
      "key": "zark",
      "name": "Zark",
      "role": "Tank",
      "cls": "Barbarian",
      "avgScore": 46.8,
      "avgWR": 40,
      "midWR": 100,
      "lateWR": 0,
      "avgDmg": 234,
      "avgHeal": 86,
      "avgWard": 0,
      "avgGold": 0,
      "survPct": 40,
      "avgTime": 14.7,
      "liveRank": 17,
      "baseRank": 14,
      "rankDelta": -3,
      "baseScore": 35.8,
      "scoreDelta": 11,
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
          "score": 47.8,
          "wr": 40
        },
        "p1": {
          "k": "totem_roar",
          "n": "Totem Roar",
          "score": 40.1,
          "wr": 40
        },
        "winner": "Relentless Bear"
      },
      "bestPartners": [
        {
          "partner": "faelan",
          "name": "Faelan",
          "sharedKw": [],
          "score": 51.9,
          "winRate": 50,
          "lift": -0.1,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "pillar",
          "name": "Pillar",
          "sharedKw": [
            "rage"
          ],
          "score": 32.1,
          "winRate": 0,
          "lift": -15.2,
          "why": "Shared rage Class Keyword engine chains triggers across both kits."
        },
        {
          "partner": "arthur",
          "name": "Arthur",
          "sharedKw": [],
          "score": 24.2,
          "winRate": 0,
          "lift": -23.3,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "wallaby",
          "name": "Wallaby",
          "sharedKw": [],
          "score": 14.2,
          "winRate": 0,
          "lift": -31.8,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        }
      ],
      "bestItems": [
        {
          "item": "berserker_axe",
          "name": "Berserker Axe",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 10,
          "lift": 2.3,
          "valPerGold": 0.33
        },
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 12,
          "lift": 4.3,
          "valPerGold": 0.72
        },
        {
          "item": "periapt_wound_closure",
          "name": "Periapt of Wound Closure",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 9.7,
          "lift": 2,
          "valPerGold": 0.29
        },
        {
          "item": "boots_speed",
          "name": "Boots of Speed",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 11.6,
          "lift": 3.9,
          "valPerGold": 0.65
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
          "score": 12,
          "lift": 4.3,
          "valPerGold": 0.72
        },
        {
          "item": "boots_speed",
          "name": "Boots of Speed",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 11.6,
          "lift": 3.9,
          "valPerGold": 0.65
        },
        {
          "item": "berserker_axe",
          "name": "Berserker Axe",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 10,
          "lift": 2.3,
          "valPerGold": 0.33
        }
      ]
    },
    "saint": {
      "key": "saint",
      "name": "Saint",
      "role": "Support",
      "cls": "Cleric",
      "avgScore": 46.5,
      "avgWR": 40,
      "midWR": 100,
      "lateWR": 0,
      "avgDmg": 165,
      "avgHeal": 77,
      "avgWard": 0,
      "avgGold": 0,
      "survPct": 40,
      "avgTime": 13.8,
      "liveRank": 18,
      "baseRank": 23,
      "rankDelta": 5,
      "baseScore": 29.9,
      "scoreDelta": 16.6,
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
          "score": 39.5,
          "wr": 40
        },
        "p1": {
          "k": "smoke_mirrors",
          "n": "Smoke & Mirrors",
          "score": 46.5,
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
          "score": 13.8,
          "winRate": 0,
          "lift": -35.2,
          "why": "Shared channel divinity Class Keyword engine chains triggers across both kits."
        },
        {
          "partner": "jamison",
          "name": "Brother Jamison",
          "sharedKw": [
            "channel_divinity"
          ],
          "score": 13,
          "winRate": 0,
          "lift": -36.6,
          "why": "Shared channel divinity Class Keyword engine chains triggers across both kits."
        },
        {
          "partner": "arthur",
          "name": "Arthur",
          "sharedKw": [],
          "score": 15,
          "winRate": 0,
          "lift": -32.4,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "wallaby",
          "name": "Wallaby",
          "sharedKw": [],
          "score": 13.4,
          "winRate": 0,
          "lift": -32.5,
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
          "score": 10.1,
          "lift": -0.6,
          "valPerGold": -0.09
        },
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 9.6,
          "lift": -1.1,
          "valPerGold": -0.18
        },
        {
          "item": "amulet_devout",
          "name": "Amulet of the Devout",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 5.1,
          "lift": -5.6,
          "valPerGold": -0.8
        },
        {
          "item": "wand_web",
          "name": "Wand of Web",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 6,
          "lift": -4.7,
          "valPerGold": -0.78
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
          "score": 10.1,
          "lift": -0.6,
          "valPerGold": -0.09
        },
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 9.6,
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
          "score": 6,
          "lift": -4.7,
          "valPerGold": -0.78
        }
      ]
    },
    "gains": {
      "key": "gains",
      "name": "Gains",
      "role": "Damage",
      "cls": "Wizard",
      "avgScore": 45.3,
      "avgWR": 40,
      "midWR": 100,
      "lateWR": 0,
      "avgDmg": 482,
      "avgHeal": 0,
      "avgWard": 0,
      "avgGold": 3.5,
      "survPct": 30,
      "avgTime": 18.5,
      "liveRank": 19,
      "baseRank": 20,
      "rankDelta": 1,
      "baseScore": 32.7,
      "scoreDelta": 12.6,
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
          "score": 41.3,
          "wr": 40
        },
        "p1": {
          "k": "liquid_assets",
          "n": "Liquid Assets",
          "score": 42.1,
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
          "score": 49,
          "winRate": 50,
          "lift": -2.3,
          "why": "Shared arcane recovery Class Keyword engine chains triggers across both kits."
        },
        {
          "partner": "juniper",
          "name": "Juniper",
          "sharedKw": [],
          "score": 28.7,
          "winRate": 0,
          "lift": -20.1,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "bram",
          "name": "Bram",
          "sharedKw": [],
          "score": 19.5,
          "winRate": 0,
          "lift": -28.8,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "dane",
          "name": "Sir Dane",
          "sharedKw": [],
          "score": 14.8,
          "winRate": 0,
          "lift": -32.4,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        }
      ],
      "bestItems": [
        {
          "item": "pearl_power",
          "name": "Pearl of Power",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 5.9,
          "lift": 0.5,
          "valPerGold": 0.07
        },
        {
          "item": "arcane_grimoire",
          "name": "Arcane Grimoire",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 5.9,
          "lift": 0.5,
          "valPerGold": 0.07
        },
        {
          "item": "wand_web",
          "name": "Wand of Web",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 6.7,
          "lift": 1.3,
          "valPerGold": 0.22
        },
        {
          "item": "ring_spell_storing",
          "name": "Ring of Spell Storing",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 6.4,
          "lift": 1,
          "valPerGold": 0.17
        }
      ],
      "bestValueItems": [
        {
          "item": "wand_web",
          "name": "Wand of Web",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 6.7,
          "lift": 1.3,
          "valPerGold": 0.22
        },
        {
          "item": "ring_spell_storing",
          "name": "Ring of Spell Storing",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 6.4,
          "lift": 1,
          "valPerGold": 0.17
        },
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 5.9,
          "lift": 0.5,
          "valPerGold": 0.08
        }
      ]
    },
    "wallaby": {
      "key": "wallaby",
      "name": "Wallaby",
      "role": "Damage",
      "cls": "Rogue",
      "avgScore": 45.2,
      "avgWR": 40,
      "midWR": 100,
      "lateWR": 0,
      "avgDmg": 537,
      "avgHeal": 0,
      "avgWard": 0,
      "avgGold": 3.2,
      "survPct": 40,
      "avgTime": 20.2,
      "liveRank": 20,
      "baseRank": 22,
      "rankDelta": 2,
      "baseScore": 31.4,
      "scoreDelta": 13.8,
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
          "score": 39.9,
          "wr": 40
        },
        "p1": {
          "k": "pickpocket",
          "n": "Pickpocket",
          "score": 43.3,
          "wr": 40
        },
        "winner": "Pickpocket"
      },
      "bestPartners": [
        {
          "partner": "faelan",
          "name": "Faelan",
          "sharedKw": [],
          "score": 28.2,
          "winRate": 0,
          "lift": -23,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "velith",
          "name": "Velith",
          "sharedKw": [
            "sneak_attack"
          ],
          "score": 23.9,
          "winRate": 0,
          "lift": -25.9,
          "why": "Shared sneak attack Class Keyword engine chains triggers across both kits."
        },
        {
          "partner": "dane",
          "name": "Sir Dane",
          "sharedKw": [],
          "score": 15.7,
          "winRate": 0,
          "lift": -31.5,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "bram",
          "name": "Bram",
          "sharedKw": [],
          "score": 14.9,
          "winRate": 0,
          "lift": -33.4,
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
          "score": 10.3,
          "lift": 4.1,
          "valPerGold": 0.59
        },
        {
          "item": "cloak_elvenkind",
          "name": "Cloak of Elvenkind",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 7.5,
          "lift": 1.3,
          "valPerGold": 0.19
        },
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 7.9,
          "lift": 1.7,
          "valPerGold": 0.28
        },
        {
          "item": "boots_speed",
          "name": "Boots of Speed",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 6.3,
          "lift": 0.1,
          "valPerGold": 0.02
        }
      ],
      "bestValueItems": [
        {
          "item": "dagger_venom",
          "name": "Dagger of Venom",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 10.3,
          "lift": 4.1,
          "valPerGold": 0.59
        },
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 7.9,
          "lift": 1.7,
          "valPerGold": 0.28
        },
        {
          "item": "cloak_elvenkind",
          "name": "Cloak of Elvenkind",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 7.5,
          "lift": 1.3,
          "valPerGold": 0.19
        }
      ]
    },
    "nettle": {
      "key": "nettle",
      "name": "Nettle",
      "role": "Support",
      "cls": "Warlock",
      "avgScore": 44.8,
      "avgWR": 40,
      "midWR": 100,
      "lateWR": 0,
      "avgDmg": 270,
      "avgHeal": 0,
      "avgWard": 48,
      "avgGold": 0,
      "survPct": 40,
      "avgTime": 12.4,
      "liveRank": 21,
      "baseRank": 13,
      "rankDelta": -8,
      "baseScore": 37.6,
      "scoreDelta": 7.2,
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
          "score": 41.6,
          "wr": 40
        },
        "p1": {
          "k": "dark_bargain",
          "n": "Dark One’s Blessing",
          "score": 41.7,
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
          "score": 16.5,
          "winRate": 0,
          "lift": -30,
          "why": "Shared hex Class Keyword engine chains triggers across both kits."
        },
        {
          "partner": "bram",
          "name": "Bram",
          "sharedKw": [],
          "score": 16.4,
          "winRate": 0,
          "lift": -31.7,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "arthur",
          "name": "Arthur",
          "sharedKw": [],
          "score": 15,
          "winRate": 0,
          "lift": -31.5,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "wallaby",
          "name": "Wallaby",
          "sharedKw": [],
          "score": 12.5,
          "winRate": 0,
          "lift": -32.5,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        }
      ],
      "bestItems": [
        {
          "item": "glamoured_leather",
          "name": "Glamoured Studded Leather",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 9.8,
          "lift": 3.1,
          "valPerGold": 0.52
        },
        {
          "item": "staff_withering",
          "name": "Staff of Withering",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 6.8,
          "lift": 0.1,
          "valPerGold": 0.01
        },
        {
          "item": "rod_pact_keeper",
          "name": "Rod of the Pact Keeper",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 6.4,
          "lift": -0.3,
          "valPerGold": -0.04
        },
        {
          "item": "bag_holding",
          "name": "Bag of Holding",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 7.3,
          "lift": 0.6,
          "valPerGold": 0.1
        }
      ],
      "bestValueItems": [
        {
          "item": "glamoured_leather",
          "name": "Glamoured Studded Leather",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 9.8,
          "lift": 3.1,
          "valPerGold": 0.52
        },
        {
          "item": "bag_holding",
          "name": "Bag of Holding",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 7.3,
          "lift": 0.6,
          "valPerGold": 0.1
        },
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 7.2,
          "lift": 0.5,
          "valPerGold": 0.08
        }
      ]
    },
    "rosalind": {
      "key": "rosalind",
      "name": "Rosalind",
      "role": "Support",
      "cls": "Bard",
      "avgScore": 43.3,
      "avgWR": 40,
      "midWR": 100,
      "lateWR": 0,
      "avgDmg": 68,
      "avgHeal": 0,
      "avgWard": 0,
      "avgGold": 0,
      "survPct": 40,
      "avgTime": 14.8,
      "liveRank": 22,
      "baseRank": 19,
      "rankDelta": -3,
      "baseScore": 32.8,
      "scoreDelta": 10.5,
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
          "score": 41.2,
          "wr": 40
        },
        "p1": {
          "k": "encore",
          "n": "Encore",
          "score": 39.9,
          "wr": 40
        },
        "winner": "Pass the Round"
      },
      "bestPartners": [
        {
          "partner": "bram",
          "name": "Bram",
          "sharedKw": [],
          "score": 19,
          "winRate": 0,
          "lift": -28.3,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "arthur",
          "name": "Arthur",
          "sharedKw": [],
          "score": 15.2,
          "winRate": 0,
          "lift": -30.6,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "toot",
          "name": "Toot",
          "sharedKw": [
            "bardic_inspiration"
          ],
          "score": 11,
          "winRate": 0,
          "lift": -28.8,
          "why": "Shared bardic inspiration Class Keyword engine chains triggers across both kits."
        },
        {
          "partner": "wallaby",
          "name": "Wallaby",
          "sharedKw": [],
          "score": 12.9,
          "winRate": 0,
          "lift": -31.4,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        }
      ],
      "bestItems": [
        {
          "item": "pipes_haunting",
          "name": "Pipes of Haunting",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 12.7,
          "lift": 4.5,
          "valPerGold": 0.64
        },
        {
          "item": "horn_valhalla",
          "name": "Horn of Valhalla",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 10.4,
          "lift": 2.2,
          "valPerGold": 0.31
        },
        {
          "item": "bag_holding",
          "name": "Bag of Holding",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 10.4,
          "lift": 2.2,
          "valPerGold": 0.37
        },
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 9.7,
          "lift": 1.5,
          "valPerGold": 0.25
        }
      ],
      "bestValueItems": [
        {
          "item": "pipes_haunting",
          "name": "Pipes of Haunting",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 12.7,
          "lift": 4.5,
          "valPerGold": 0.64
        },
        {
          "item": "bag_holding",
          "name": "Bag of Holding",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 10.4,
          "lift": 2.2,
          "valPerGold": 0.37
        },
        {
          "item": "horn_valhalla",
          "name": "Horn of Valhalla",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 10.4,
          "lift": 2.2,
          "valPerGold": 0.31
        }
      ]
    },
    "zoe": {
      "key": "zoe",
      "name": "Zoe",
      "role": "Support",
      "cls": "Fighter",
      "avgScore": 43.3,
      "avgWR": 40,
      "midWR": 100,
      "lateWR": 0,
      "avgDmg": 64,
      "avgHeal": 0,
      "avgWard": 0,
      "avgGold": 0,
      "survPct": 20,
      "avgTime": 14.4,
      "liveRank": 23,
      "baseRank": 1,
      "rankDelta": -22,
      "baseScore": 51.8,
      "scoreDelta": -8.5,
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
          "score": 40.9,
          "wr": 40
        },
        "p1": {
          "k": "just_the_thing",
          "n": "Just the Thing",
          "score": 39.5,
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
          "score": 20.8,
          "winRate": 0,
          "lift": -38.3,
          "why": "Shared action surge Class Keyword engine chains triggers across both kits."
        },
        {
          "partner": "arthur",
          "name": "Arthur",
          "sharedKw": [
            "action_surge"
          ],
          "score": 12.3,
          "winRate": 0,
          "lift": -33.5,
          "why": "Shared action surge Class Keyword engine chains triggers across both kits."
        },
        {
          "partner": "bram",
          "name": "Bram",
          "sharedKw": [],
          "score": 14.1,
          "winRate": 0,
          "lift": -33.2,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "wallaby",
          "name": "Wallaby",
          "sharedKw": [],
          "score": 12.8,
          "winRate": 0,
          "lift": -31.4,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        }
      ],
      "bestItems": [
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 10.2,
          "lift": 2,
          "valPerGold": 0.33
        },
        {
          "item": "weapon_warning",
          "name": "Weapon of Warning",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 7.1,
          "lift": -1.1,
          "valPerGold": -0.16
        },
        {
          "item": "flame_tongue",
          "name": "Flame Tongue",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 7.1,
          "lift": -1.1,
          "valPerGold": -0.16
        },
        {
          "item": "sword_sharpness",
          "name": "Sword of Sharpness",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 6.8,
          "lift": -1.4,
          "valPerGold": -0.23
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
          "score": 10.2,
          "lift": 2,
          "valPerGold": 0.33
        },
        {
          "item": "weapon_warning",
          "name": "Weapon of Warning",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 7.1,
          "lift": -1.1,
          "valPerGold": -0.16
        },
        {
          "item": "flame_tongue",
          "name": "Flame Tongue",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 7.1,
          "lift": -1.1,
          "valPerGold": -0.16
        }
      ]
    },
    "toot": {
      "key": "toot",
      "name": "Toot",
      "role": "Support",
      "cls": "Bard",
      "avgScore": 36.4,
      "avgWR": 40,
      "midWR": 100,
      "lateWR": 0,
      "avgDmg": 3,
      "avgHeal": 0,
      "avgWard": 0,
      "avgGold": 1.6,
      "survPct": 10,
      "avgTime": 16.8,
      "liveRank": 24,
      "baseRank": 24,
      "rankDelta": 0,
      "baseScore": 29.2,
      "scoreDelta": 7.2,
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
          "score": 33.1,
          "wr": 40
        },
        "p1": {
          "k": "street_performer",
          "n": "Street Performer",
          "score": 34.8,
          "wr": 40
        },
        "winner": "Street Performer"
      },
      "bestPartners": [
        {
          "partner": "arthur",
          "name": "Arthur",
          "sharedKw": [],
          "score": 12.3,
          "winRate": 0,
          "lift": -30,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "bram",
          "name": "Bram",
          "sharedKw": [],
          "score": 9.9,
          "winRate": 0,
          "lift": -34,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "wallaby",
          "name": "Wallaby",
          "sharedKw": [],
          "score": 9.8,
          "winRate": 0,
          "lift": -31,
          "why": "Complementary frontline/backline tempo pairing tested across Act 2–3 bosses."
        },
        {
          "partner": "rosalind",
          "name": "Rosalind",
          "sharedKw": [
            "bardic_inspiration"
          ],
          "score": 5.9,
          "winRate": 0,
          "lift": -33.9,
          "why": "Shared bardic inspiration Class Keyword engine chains triggers across both kits."
        }
      ],
      "bestItems": [
        {
          "item": "pipes_haunting",
          "name": "Pipes of Haunting",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 4.9,
          "lift": -0.9,
          "valPerGold": -0.13
        },
        {
          "item": "cloak_displacement",
          "name": "Cloak of Displacement",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 5.2,
          "lift": -0.6,
          "valPerGold": -0.1
        },
        {
          "item": "horn_valhalla",
          "name": "Horn of Valhalla",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 2.6,
          "lift": -3.2,
          "valPerGold": -0.46
        },
        {
          "item": "glamoured_leather",
          "name": "Glamoured Studded Leather",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 4.2,
          "lift": -1.6,
          "valPerGold": -0.27
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
          "score": 5.2,
          "lift": -0.6,
          "valPerGold": -0.1
        },
        {
          "item": "pipes_haunting",
          "name": "Pipes of Haunting",
          "rarity": 5,
          "cost": 7,
          "kwMatch": true,
          "winRate": 0,
          "score": 4.9,
          "lift": -0.9,
          "valPerGold": -0.13
        },
        {
          "item": "glamoured_leather",
          "name": "Glamoured Studded Leather",
          "rarity": 2,
          "cost": 6,
          "kwMatch": false,
          "winRate": 0,
          "score": 4.2,
          "lift": -1.6,
          "valPerGold": -0.27
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
      "bestDelta": 0.042,
      "valPerGold": 0.014,
      "topCarriers": [
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": 4.2,
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
      "bestDelta": 0.021,
      "valPerGold": 0.007,
      "topCarriers": [
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": 2.1,
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
      "bestDelta": 0.059,
      "valPerGold": 0.02,
      "topCarriers": [
        {
          "hero": "zark",
          "name": "Zark",
          "lift": 5.9,
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
      "bestDelta": 0.158,
      "valPerGold": 0.053,
      "topCarriers": [
        {
          "hero": "faelan",
          "name": "Faelan",
          "lift": 15.8,
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
      "bestDelta": 0.009,
      "valPerGold": 0.003,
      "topCarriers": [
        {
          "hero": "bram",
          "name": "Bram",
          "lift": 0.9,
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
      "bestDelta": 0.015,
      "valPerGold": 0.005,
      "topCarriers": [
        {
          "hero": "dane",
          "name": "Sir Dane",
          "lift": 1.5,
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
      "bestDelta": 0.116,
      "valPerGold": 0.039,
      "topCarriers": [
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": 11.6,
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
      "key": "shield",
      "name": "Shield",
      "r": 0,
      "rarity": "Common",
      "price": 3,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.062,
      "valPerGold": 0.021,
      "topCarriers": [
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": 6.2,
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
      "bestDelta": 0.019,
      "valPerGold": 0.006,
      "topCarriers": [
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": 1.9,
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
      "bestDelta": 0.017,
      "valPerGold": 0.006,
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
      "key": "ring_warmth",
      "name": "Ring of Warmth",
      "r": 0,
      "rarity": "Common",
      "price": 3,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.021,
      "valPerGold": 0.007,
      "topCarriers": [
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": 2.1,
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
      "bestDelta": 0.056,
      "valPerGold": 0.014,
      "topCarriers": [
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": 5.6,
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
      "bestDelta": 0.021,
      "valPerGold": 0.005,
      "topCarriers": [
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": 2.1,
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
      "bestDelta": 0.055,
      "valPerGold": 0.014,
      "topCarriers": [
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": 5.5,
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
      "bestDelta": 0.011,
      "valPerGold": 0.003,
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
      "key": "boots_elvenkind",
      "name": "Boots of Elvenkind",
      "r": 1,
      "rarity": "Uncommon",
      "price": 4,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.02,
      "valPerGold": 0.005,
      "topCarriers": [
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": 2,
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
      "bestDelta": 0.021,
      "valPerGold": 0.005,
      "topCarriers": [
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": 2.1,
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
      "bestDelta": 0.062,
      "valPerGold": 0.015,
      "topCarriers": [
        {
          "hero": "zark",
          "name": "Zark",
          "lift": 6.2,
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
      "bestDelta": 0.006,
      "valPerGold": 0.002,
      "topCarriers": [
        {
          "hero": "velith",
          "name": "Velith",
          "lift": 0.6,
          "kwMatch": false
        },
        {
          "hero": "wallaby",
          "name": "Wallaby",
          "lift": -0.2,
          "kwMatch": false
        },
        {
          "hero": "corvin",
          "name": "Corvin",
          "lift": -1.2,
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
      "bestDelta": -0.097,
      "valPerGold": -0.024,
      "topCarriers": [
        {
          "hero": "faelan",
          "name": "Faelan",
          "lift": -9.7,
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
      "bestDelta": 0.06,
      "valPerGold": 0.015,
      "topCarriers": [
        {
          "hero": "faelan",
          "name": "Faelan",
          "lift": 6,
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
      "bestDelta": 0.043,
      "valPerGold": 0.011,
      "topCarriers": [
        {
          "hero": "bram",
          "name": "Bram",
          "lift": 4.3,
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
      "bestDelta": 0.01,
      "valPerGold": 0.003,
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
      "key": "brooch_shielding",
      "name": "Brooch of Shielding",
      "r": 1,
      "rarity": "Uncommon",
      "price": 4,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.041,
      "valPerGold": 0.01,
      "topCarriers": [
        {
          "hero": "dane",
          "name": "Sir Dane",
          "lift": 4.1,
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
      "bestDelta": 0.102,
      "valPerGold": 0.025,
      "topCarriers": [
        {
          "hero": "dane",
          "name": "Sir Dane",
          "lift": 10.2,
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
      "bestDelta": 0.055,
      "valPerGold": 0.009,
      "topCarriers": [
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": 5.5,
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
      "bestDelta": 0.316,
      "valPerGold": 0.053,
      "topCarriers": [
        {
          "hero": "gilthrax",
          "name": "Gilthrax",
          "lift": 31.6,
          "kwMatch": false
        },
        {
          "hero": "kaska",
          "name": "Kaska",
          "lift": 4.5,
          "kwMatch": false
        },
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": 2.5,
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
      "bestDelta": 0.175,
      "valPerGold": 0.029,
      "topCarriers": [
        {
          "hero": "gilthrax",
          "name": "Gilthrax",
          "lift": 17.5,
          "kwMatch": false
        },
        {
          "hero": "pillar",
          "name": "Pillar",
          "lift": 5.5,
          "kwMatch": false
        },
        {
          "hero": "zark",
          "name": "Zark",
          "lift": 3.9,
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
      "bestDelta": 0.004,
      "valPerGold": 0.001,
      "topCarriers": [
        {
          "hero": "lorcan",
          "name": "Lorcan",
          "lift": 0.4,
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
      "bestDelta": 0.42,
      "valPerGold": 0.07,
      "topCarriers": [
        {
          "hero": "gilthrax",
          "name": "Gilthrax",
          "lift": 42,
          "kwMatch": false
        },
        {
          "hero": "kaska",
          "name": "Kaska",
          "lift": 7.1,
          "kwMatch": false
        },
        {
          "hero": "zark",
          "name": "Zark",
          "lift": 4.3,
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
      "bestDelta": 0.097,
      "valPerGold": 0.016,
      "topCarriers": [
        {
          "hero": "zark",
          "name": "Zark",
          "lift": 9.7,
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
      "bestDelta": 0.096,
      "valPerGold": 0.016,
      "topCarriers": [
        {
          "hero": "zark",
          "name": "Zark",
          "lift": 9.6,
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
      "bestDelta": 0.109,
      "valPerGold": 0.018,
      "topCarriers": [
        {
          "hero": "faelan",
          "name": "Faelan",
          "lift": 10.9,
          "kwMatch": false
        },
        {
          "hero": "gains",
          "name": "Gains",
          "lift": 1,
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
      "bestDelta": 0.019,
      "valPerGold": 0.003,
      "topCarriers": [
        {
          "hero": "faelan",
          "name": "Faelan",
          "lift": 1.9,
          "kwMatch": false
        },
        {
          "hero": "gains",
          "name": "Gains",
          "lift": 1.3,
          "kwMatch": false
        },
        {
          "hero": "juniper",
          "name": "Juniper",
          "lift": 0.6,
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
      "bestDelta": 0.06,
      "valPerGold": 0.01,
      "topCarriers": [
        {
          "hero": "juniper",
          "name": "Juniper",
          "lift": 6,
          "kwMatch": false
        },
        {
          "hero": "saint",
          "name": "Saint",
          "lift": -6.2,
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
      "bestDelta": 0.031,
      "valPerGold": 0.005,
      "topCarriers": [
        {
          "hero": "nettle",
          "name": "Nettle",
          "lift": 3.1,
          "kwMatch": false
        },
        {
          "hero": "rosalind",
          "name": "Rosalind",
          "lift": 0.3,
          "kwMatch": false
        },
        {
          "hero": "jamison",
          "name": "Brother Jamison",
          "lift": -0.2,
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
      "bestDelta": 0.028,
      "valPerGold": 0.005,
      "topCarriers": [
        {
          "hero": "lumen",
          "name": "Lumen",
          "lift": 2.8,
          "kwMatch": false
        },
        {
          "hero": "rosalind",
          "name": "Rosalind",
          "lift": 2.2,
          "kwMatch": false
        },
        {
          "hero": "nettle",
          "name": "Nettle",
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
      "bestDelta": 0.196,
      "valPerGold": 0.022,
      "topCarriers": [
        {
          "hero": "zark",
          "name": "Zark",
          "lift": 19.6,
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
      "bestDelta": 0.147,
      "valPerGold": 0.016,
      "topCarriers": [
        {
          "hero": "zark",
          "name": "Zark",
          "lift": 14.7,
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
      "bestDelta": 0.016,
      "valPerGold": 0.002,
      "topCarriers": [
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": 1.6,
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
      "bestDelta": 0.089,
      "valPerGold": 0.01,
      "topCarriers": [
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": 8.9,
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
      "bestDelta": 0.069,
      "valPerGold": 0.008,
      "topCarriers": [
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": 6.9,
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
      "bestDelta": 0.047,
      "valPerGold": 0.005,
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
      "key": "staff_power",
      "name": "Staff of Power",
      "r": 3,
      "rarity": "Very Rare",
      "price": 9,
      "kwHooks": [],
      "clsLock": null,
      "bestDelta": 0.207,
      "valPerGold": 0.023,
      "topCarriers": [
        {
          "hero": "faelan",
          "name": "Faelan",
          "lift": 20.7,
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
      "bestDelta": 0.283,
      "valPerGold": 0.031,
      "topCarriers": [
        {
          "hero": "faelan",
          "name": "Faelan",
          "lift": 28.3,
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
      "bestDelta": 0.015,
      "valPerGold": 0.002,
      "topCarriers": [
        {
          "hero": "bram",
          "name": "Bram",
          "lift": 1.5,
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
      "bestDelta": 0.122,
      "valPerGold": 0.014,
      "topCarriers": [
        {
          "hero": "bram",
          "name": "Bram",
          "lift": 12.2,
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
      "bestDelta": 0.061,
      "valPerGold": 0.007,
      "topCarriers": [
        {
          "hero": "dane",
          "name": "Sir Dane",
          "lift": 6.1,
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
      "bestDelta": 0.085,
      "valPerGold": 0.009,
      "topCarriers": [
        {
          "hero": "rosalind",
          "name": "Rosalind",
          "lift": 8.5,
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
      "bestDelta": 0.079,
      "valPerGold": 0.006,
      "topCarriers": [
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": 7.9,
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
      "bestDelta": 0.03,
      "valPerGold": 0.002,
      "topCarriers": [
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": 3,
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
      "bestDelta": 0.315,
      "valPerGold": 0.024,
      "topCarriers": [
        {
          "hero": "zark",
          "name": "Zark",
          "lift": 31.5,
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
      "bestDelta": 0.091,
      "valPerGold": 0.007,
      "topCarriers": [
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": 9.1,
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
      "bestDelta": 0.651,
      "valPerGold": 0.05,
      "topCarriers": [
        {
          "hero": "faelan",
          "name": "Faelan",
          "lift": 65.1,
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
      "bestDelta": 0.362,
      "valPerGold": 0.028,
      "topCarriers": [
        {
          "hero": "faelan",
          "name": "Faelan",
          "lift": 36.2,
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
      "bestDelta": 0.039,
      "valPerGold": 0.003,
      "topCarriers": [
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": 3.9,
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
      "bestDelta": 0.062,
      "valPerGold": 0.005,
      "topCarriers": [
        {
          "hero": "dane",
          "name": "Sir Dane",
          "lift": 6.2,
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
      "bestDelta": 0.059,
      "valPerGold": 0.008,
      "topCarriers": [
        {
          "hero": "gilthrax",
          "name": "Gilthrax",
          "lift": 5.9,
          "kwMatch": true
        },
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": 1.4,
          "kwMatch": true
        },
        {
          "hero": "zoe",
          "name": "Zoe",
          "lift": -1.1,
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
      "bestDelta": 0.495,
      "valPerGold": 0.071,
      "topCarriers": [
        {
          "hero": "gilthrax",
          "name": "Gilthrax",
          "lift": 49.5,
          "kwMatch": true
        },
        {
          "hero": "arthur",
          "name": "Arthur",
          "lift": 3,
          "kwMatch": true
        },
        {
          "hero": "zoe",
          "name": "Zoe",
          "lift": -1.1,
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
      "bestDelta": 0.02,
      "valPerGold": 0.003,
      "topCarriers": [
        {
          "hero": "zark",
          "name": "Zark",
          "lift": 2,
          "kwMatch": true
        },
        {
          "hero": "pillar",
          "name": "Pillar",
          "lift": -13.7,
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
      "bestDelta": 0.023,
      "valPerGold": 0.003,
      "topCarriers": [
        {
          "hero": "zark",
          "name": "Zark",
          "lift": 2.3,
          "kwMatch": true
        },
        {
          "hero": "pillar",
          "name": "Pillar",
          "lift": -14.7,
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
      "bestDelta": 0,
      "valPerGold": 0,
      "topCarriers": [
        {
          "hero": "dane",
          "name": "Sir Dane",
          "lift": 0,
          "kwMatch": true
        },
        {
          "hero": "mother_laurel",
          "name": "Mother Laurel",
          "lift": -1.7,
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
      "bestDelta": 0.013,
      "valPerGold": 0.002,
      "topCarriers": [
        {
          "hero": "dane",
          "name": "Sir Dane",
          "lift": 1.3,
          "kwMatch": true
        },
        {
          "hero": "corvin",
          "name": "Corvin",
          "lift": 0.8,
          "kwMatch": false
        },
        {
          "hero": "mother_laurel",
          "name": "Mother Laurel",
          "lift": -0.1,
          "kwMatch": true
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
      "bestDelta": 0.006,
      "valPerGold": 0.001,
      "topCarriers": [
        {
          "hero": "bram",
          "name": "Bram",
          "lift": 0.6,
          "kwMatch": true
        },
        {
          "hero": "jamison",
          "name": "Brother Jamison",
          "lift": -2.9,
          "kwMatch": true
        },
        {
          "hero": "saint",
          "name": "Saint",
          "lift": -5.6,
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
      "bestDelta": 0.042,
      "valPerGold": 0.006,
      "topCarriers": [
        {
          "hero": "jamison",
          "name": "Brother Jamison",
          "lift": 4.2,
          "kwMatch": true
        },
        {
          "hero": "bram",
          "name": "Bram",
          "lift": 4,
          "kwMatch": true
        },
        {
          "hero": "saint",
          "name": "Saint",
          "lift": -0.6,
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
      "bestDelta": 0.062,
      "valPerGold": 0.009,
      "topCarriers": [
        {
          "hero": "faelan",
          "name": "Faelan",
          "lift": 6.2,
          "kwMatch": true
        },
        {
          "hero": "gains",
          "name": "Gains",
          "lift": 0.5,
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
      "bestDelta": 0.063,
      "valPerGold": 0.009,
      "topCarriers": [
        {
          "hero": "faelan",
          "name": "Faelan",
          "lift": 6.3,
          "kwMatch": true
        },
        {
          "hero": "gains",
          "name": "Gains",
          "lift": 0.5,
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
      "bestDelta": 0.034,
      "valPerGold": 0.005,
      "topCarriers": [
        {
          "hero": "corvin",
          "name": "Corvin",
          "lift": 3.4,
          "kwMatch": true
        },
        {
          "hero": "lorcan",
          "name": "Lorcan",
          "lift": 1.1,
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
      "bestDelta": 0.049,
      "valPerGold": 0.007,
      "topCarriers": [
        {
          "hero": "lorcan",
          "name": "Lorcan",
          "lift": 4.9,
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
      "bestDelta": 0.013,
      "valPerGold": 0.002,
      "topCarriers": [
        {
          "hero": "wallaby",
          "name": "Wallaby",
          "lift": 1.3,
          "kwMatch": true
        },
        {
          "hero": "velith",
          "name": "Velith",
          "lift": 0.8,
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
      "bestDelta": 0.041,
      "valPerGold": 0.006,
      "topCarriers": [
        {
          "hero": "wallaby",
          "name": "Wallaby",
          "lift": 4.1,
          "kwMatch": true
        },
        {
          "hero": "velith",
          "name": "Velith",
          "lift": 2.5,
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
      "bestDelta": -0.016,
      "valPerGold": -0.002,
      "topCarriers": [
        {
          "hero": "naill",
          "name": "Naill",
          "lift": -1.6,
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
      "bestDelta": 0.014,
      "valPerGold": 0.002,
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
      "key": "pipes_haunting",
      "name": "Pipes of Haunting",
      "r": 5,
      "rarity": "Unique",
      "price": 7,
      "kwHooks": [
        "bardic_inspiration"
      ],
      "clsLock": "Bard",
      "bestDelta": 0.045,
      "valPerGold": 0.006,
      "topCarriers": [
        {
          "hero": "rosalind",
          "name": "Rosalind",
          "lift": 4.5,
          "kwMatch": true
        },
        {
          "hero": "toot",
          "name": "Toot",
          "lift": -0.9,
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
      "bestDelta": 0.022,
      "valPerGold": 0.003,
      "topCarriers": [
        {
          "hero": "rosalind",
          "name": "Rosalind",
          "lift": 2.2,
          "kwMatch": true
        },
        {
          "hero": "toot",
          "name": "Toot",
          "lift": -3.2,
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
      "bestDelta": 0.03,
      "valPerGold": 0.004,
      "topCarriers": [
        {
          "hero": "kaska",
          "name": "Kaska",
          "lift": 3,
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
      "bestDelta": 0.061,
      "valPerGold": 0.009,
      "topCarriers": [
        {
          "hero": "juniper",
          "name": "Juniper",
          "lift": 6.1,
          "kwMatch": true
        },
        {
          "hero": "kaska",
          "name": "Kaska",
          "lift": 2,
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
      "bestDelta": -0.018,
      "valPerGold": -0.003,
      "topCarriers": [
        {
          "hero": "cinder",
          "name": "Cinder",
          "lift": -1.8,
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
      "bestDelta": 0.041,
      "valPerGold": 0.006,
      "topCarriers": [
        {
          "hero": "cinder",
          "name": "Cinder",
          "lift": 4.1,
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
      "bestDelta": 0.022,
      "valPerGold": 0.003,
      "topCarriers": [
        {
          "hero": "lumen",
          "name": "Lumen",
          "lift": 2.2,
          "kwMatch": true
        },
        {
          "hero": "nettle",
          "name": "Nettle",
          "lift": -0.3,
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
      "bestDelta": 0.029,
      "valPerGold": 0.004,
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
          "lift": 0.1,
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
      "avgScore": 29.7,
      "winRate": 0,
      "avgTime": 35.1,
      "avgGold": 7.3
    },
    {
      "name": "Action Surge Armory",
      "heroes": [
        "gilthrax",
        "arthur",
        "zoe",
        "rosalind"
      ],
      "avgScore": 26.2,
      "winRate": 0,
      "avgTime": 29.3,
      "avgGold": 0
    },
    {
      "name": "Wild Shape Moon & Land",
      "heroes": [
        "mother_laurel",
        "kaska",
        "juniper",
        "velith"
      ],
      "avgScore": 20.5,
      "winRate": 0,
      "avgTime": 18.7,
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
      "avgScore": 14.5,
      "winRate": 0,
      "avgTime": 12.9,
      "avgGold": 1
    },
    {
      "name": "Tavern Classic Core",
      "heroes": [
        "bram",
        "arthur",
        "faelan",
        "wallaby"
      ],
      "avgScore": 13.5,
      "winRate": 0,
      "avgTime": 28.2,
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
      "avgScore": 13.4,
      "winRate": 0,
      "avgTime": 32.2,
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
      "avgScore": 13,
      "winRate": 0,
      "avgTime": 21.3,
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
      "avgScore": 12.2,
      "winRate": 0,
      "avgTime": 14.7,
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
      "avgScore": 12.2,
      "winRate": 0,
      "avgTime": 15.2,
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
      "avgScore": 11,
      "winRate": 0,
      "avgTime": 14.1,
      "avgGold": 0.7
    },
    {
      "name": "Infernal Hex & Burn",
      "heroes": [
        "dane",
        "cinder",
        "lumen",
        "nettle"
      ],
      "avgScore": 9.8,
      "winRate": 0,
      "avgTime": 9.5,
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
      "avgScore": 9.5,
      "winRate": 0,
      "avgTime": 12.6,
      "avgGold": 0
    }
  ],
  "bots": [
    {
      "id": "zero_item",
      "label": "Zero-Item / Naive (0 Items Bought)",
      "target": "< 15% WR",
      "liveWR": 0,
      "act1Clear": 64,
      "act2Clear": 16,
      "piggyBreak": 100,
      "avgGold": 92.4,
      "avgFights": 8.3
    },
    {
      "id": "average",
      "label": "average",
      "target": "—",
      "liveWR": 8,
      "act1Clear": 52,
      "act2Clear": 28,
      "piggyBreak": 96,
      "avgGold": 83.3,
      "avgFights": 7.8
    },
    {
      "id": "competent",
      "label": "Competent Tactician (Balanced & Geared)",
      "target": "55–70% WR (40–65% Piggy)",
      "liveWR": 48,
      "act1Clear": 80,
      "act2Clear": 60,
      "piggyBreak": 80,
      "avgGold": 110.4,
      "avgFights": 10.6
    },
    {
      "id": "synergy",
      "label": "Synergy Drafter (Keyword + Role Focus)",
      "target": "55–70% WR (40–65% Piggy)",
      "liveWR": 20,
      "act1Clear": 80,
      "act2Clear": 44,
      "piggyBreak": 100,
      "avgGold": 112.6,
      "avgFights": 10.2
    },
    {
      "id": "greed",
      "label": "Pack 5 Market Greed (Zoe/Toot/Gilthrax/Gains)",
      "target": "≤ 70% WR",
      "liveWR": 56,
      "act1Clear": 68,
      "act2Clear": 60,
      "piggyBreak": 72,
      "avgGold": 126.2,
      "avgFights": 9.6
    }
  ],
  "bosses": [
    {
      "act": 1,
      "key": "glasstaff",
      "won": 30,
      "fought": 46,
      "winRate": 65.2
    },
    {
      "act": 1,
      "key": "nezznar",
      "won": 31,
      "fought": 44,
      "winRate": 70.5
    },
    {
      "act": 1,
      "key": "venomfang",
      "won": 25,
      "fought": 37,
      "winRate": 67.6
    },
    {
      "act": 2,
      "key": "blackrazor_boss",
      "won": 11,
      "fought": 12,
      "winRate": 91.7
    },
    {
      "act": 2,
      "key": "giant_crab",
      "won": 14,
      "fought": 25,
      "winRate": 56
    },
    {
      "act": 2,
      "key": "gynosphinx",
      "won": 10,
      "fought": 21,
      "winRate": 47.6
    },
    {
      "act": 2,
      "key": "keraptis",
      "won": 17,
      "fought": 35,
      "winRate": 48.6
    },
    {
      "act": 3,
      "key": "asmodeus",
      "won": 10,
      "fought": 11,
      "winRate": 90.9
    },
    {
      "act": 3,
      "key": "orcus",
      "won": 11,
      "fought": 14,
      "winRate": 78.6
    },
    {
      "act": 3,
      "key": "tiamat",
      "won": 12,
      "fought": 18,
      "winRate": 66.7
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
