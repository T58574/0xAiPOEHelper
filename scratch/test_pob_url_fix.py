import json, urllib.parse

# Correct category options for PoE Trade site
CATEGORY_MAP = {
    "helmet": "armour.helmet",
    "body": "armour.chest",
    "gloves": "armour.gloves",
    "boots": "armour.boots",
    "ring": "accessory.ring",
    "amulet": "accessory.amulet",
    "belt": "accessory.belt",
    "shield": "armour.shield",
    "wand": "weapon.wand",
    "weapon": "weapon"
}

def make_valid_poe_trade_url(slot, min_life=None, min_ele_res=None, min_fire_dot=None, max_price=20, league="Allflame"):
    type_filters = {}
    if slot in CATEGORY_MAP:
        type_filters = {
            "filters": {
                "category": {"option": CATEGORY_MAP[slot]}
            }
        }

    stat_filters = []
    if min_life:
        stat_filters.append({"id": "pseudo.pseudo_total_life", "value": {"min": min_life}})
    if min_ele_res:
        stat_filters.append({"id": "pseudo.pseudo_total_elemental_resistance", "value": {"min": min_ele_res}})
    if min_fire_dot:
        stat_filters.append({"id": "explicit.stat_3542385806", "value": {"min": min_fire_dot}})

    payload = {
        "engine": "new",
        "query": {
            "status": {"option": "online"},
            "type_filters": type_filters,
            "stats": [
                {
                    "type": "and",
                    "filters": stat_filters
                }
            ],
            "filters": {
                "trade_filters": {
                    "filters": {
                        "price": {"max": max_price}
                    }
                }
            }
        },
        "sort": {"price": "asc"}
    }

    encoded = urllib.parse.quote(json.dumps(payload, separators=(',', ':')))
    url = f"https://www.pathofexile.com/trade/search/{league}?q={encoded}"
    return url

print("Amulet URL:")
print(make_valid_poe_trade_url("amulet", min_life=60, min_ele_res=30, max_price=20))
print("\nGloves URL:")
print(make_valid_poe_trade_url("gloves", min_life=80, min_fire_dot=10, max_price=20))
print("\nBody Armour URL:")
print(make_valid_poe_trade_url("body", min_life=100, min_ele_res=40, max_price=20))
