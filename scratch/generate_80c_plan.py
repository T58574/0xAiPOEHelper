import json, urllib.request

def get_ggg_trade_id(payload, league="Allflame"):
    url = f"https://www.pathofexile.com/api/trade/search/{league}"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Origin": "https://www.pathofexile.com",
        "Referer": f"https://www.pathofexile.com/trade/search/{league}"
    }

    req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            return f"https://www.pathofexile.com/trade/search/{league}/{data.get('id')}"
    except Exception as e:
        print("Error:", e)
        return None

# 1. Amulet Query
q_amulet = {
    "query": {
        "status": {"option": "online"},
        "stats": [
            {
                "type": "and",
                "filters": [
                    {"id": "pseudo.pseudo_total_life", "value": {"min": 60}},
                    {"id": "explicit.stat_3382807662", "value": {"min": 10}}
                ]
            }
        ],
        "filters": {
            "trade_filters": {
                "filters": {
                    "price": {"max": 30}
                }
            },
            "type_filters": {
                "filters": {
                    "category": {"option": "accessory.amulet"},
                    "rarity": {"option": "nonunique"}
                }
            }
        }
    },
    "sort": {"price": "asc"}
}

# 2. Gloves Query
q_gloves = {
    "query": {
        "status": {"option": "online"},
        "stats": [
            {
                "type": "and",
                "filters": [
                    {"id": "pseudo.pseudo_total_life", "value": {"min": 80}},
                    {"id": "explicit.stat_3382807662", "value": {"min": 12}}
                ]
            }
        ],
        "filters": {
            "trade_filters": {
                "filters": {
                    "price": {"max": 20}
                }
            },
            "type_filters": {
                "filters": {
                    "category": {"option": "armour.gloves"},
                    "rarity": {"option": "nonunique"}
                }
            }
        }
    },
    "sort": {"price": "asc"}
}

# 3. Jewel Query (Life + Fire DoT Multi)
q_jewel = {
    "query": {
        "status": {"option": "online"},
        "stats": [
            {
                "type": "and",
                "filters": [
                    {"id": "pseudo.pseudo_total_life", "value": {"min": 5}},
                    {"id": "explicit.stat_3382807662", "value": {"min": 6}}
                ]
            }
        ],
        "filters": {
            "trade_filters": {
                "filters": {
                    "price": {"max": 15}
                }
            },
            "type_filters": {
                "filters": {
                    "category": {"option": "jewel"},
                    "rarity": {"option": "nonunique"}
                }
            }
        }
    },
    "sort": {"price": "asc"}
}

# 4. Swiftbrand 20/20 Gem Query
q_swiftbrand = {
    "query": {
        "name": "Swiftbrand Support",
        "status": {"option": "online"},
        "type_filters": {
            "filters": {
                "category": {"option": "gem"},
                "gem_level": {"min": 20},
                "gem_quality": {"min": 20}
            }
        },
        "filters": {
            "trade_filters": {
                "filters": {
                    "price": {"max": 10}
                }
            }
        }
    },
    "sort": {"price": "asc"}
}

print("Amulet:", get_ggg_trade_id(q_amulet))
print("Gloves:", get_ggg_trade_id(q_gloves))
print("Jewel:", get_ggg_trade_id(q_jewel))
print("Swiftbrand Gem:", get_ggg_trade_id(q_swiftbrand))
