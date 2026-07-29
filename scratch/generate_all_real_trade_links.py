import json, urllib.request

def get_ggg_trade_link(slot, min_life=None, min_ele_res=None, min_fire_dot=None, max_price=20, league="Allflame"):
    url = f"https://www.pathofexile.com/api/trade/search/{league}"
    
    category_map = {
        "helmet": "armour.helmet",
        "body": "armour.chest",
        "gloves": "armour.gloves",
        "boots": "armour.boots",
        "ring": "accessory.ring",
        "amulet": "accessory.amulet",
        "belt": "accessory.belt",
        "shield": "armour.shield",
        "wand": "weapon.wand"
    }

    filters = {
        "trade_filters": {
            "filters": {
                "price": {"max": max_price}
            }
        }
    }

    if slot in category_map:
        filters["type_filters"] = {
            "filters": {
                "category": {"option": category_map[slot]},
                "rarity": {"option": "nonunique"}
            }
        }

    stat_filters = []
    if min_life:
        stat_filters.append({"id": "pseudo.pseudo_total_life", "value": {"min": min_life}})
    if min_ele_res:
        stat_filters.append({"id": "pseudo.pseudo_total_elemental_resistance", "value": {"min": min_ele_res}})
    if min_fire_dot:
        stat_filters.append({"id": "explicit.stat_3382807662", "value": {"min": min_fire_dot}})

    payload = {
        "query": {
            "status": {"option": "online"},
            "stats": [{"type": "and", "filters": stat_filters}] if stat_filters else [],
            "filters": filters
        },
        "sort": {"price": "asc"}
    }

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
            query_id = data.get("id")
            return f"https://www.pathofexile.com/trade/search/{league}/{query_id}"
    except Exception as e:
        err_msg = str(e)
        if hasattr(e, "read"):
            err_msg += " " + e.read().decode("utf-8")
        print(f"Error fetching trade link for {slot}: {err_msg}")
        return None

if __name__ == "__main__":
    print("Generating 100% Real GGG Trade Links...")
    amulet_url = get_ggg_trade_link("amulet", min_life=60, min_ele_res=30, max_price=20)
    gloves_url = get_ggg_trade_link("gloves", min_life=80, min_fire_dot=10, max_price=20)
    body_url = get_ggg_trade_link("body", min_life=100, min_ele_res=40, max_price=20)

    print("\n=== AMULET LINK ===")
    print(amulet_url)

    print("\n=== GLOVES LINK ===")
    print(gloves_url)

    print("\n=== BODY ARMOUR LINK ===")
    print(body_url)
