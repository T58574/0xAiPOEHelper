"""
pob_bridge/trade_engine.py - PoE Trade API Query Generator & Item Value Engine
"""

import json
import urllib.request
import urllib.parse
import sys
import os

DEFAULT_LEAGUE = os.getenv("POE_LEAGUE", "Allflame")

# Stat IDs mapping for PoE Trade API
PSEUDO_STATS = {
    "total_life": "pseudo.pseudo_total_life",
    "total_ele_res": "pseudo.pseudo_total_elemental_resistance",
    "total_chaos_res": "pseudo.pseudo_total_chaos_resistance",
    "fire_dot_multi": "explicit.stat_3382807662", # Fire Damage over Time Multiplier
    "dot_multi": "pseudo.pseudo_global_damage_over_time_multiplier",
    "spell_suppress": "pseudo.pseudo_total_suppress_chance",
    "flat_life": "explicit.stat_3299347043",
    "movement_speed": "pseudo.pseudo_movement_speed",
}

SLOT_TYPE_MAP = {
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


def build_trade_query_json(slot=None, min_life=None, min_ele_res=None, min_chaos_res=None, 
                         min_fire_dot_multi=None, max_price_chaos=None, min_links=None):
    """
    Constructs a valid PoE Trade API query JSON dictionary compatible with PoE Trade frontend engine.
    """
    filters = {
        "trade_filters": {
            "filters": {
                "price": {"max": max_price_chaos} if max_price_chaos else {}
            }
        }
    }

    if slot and slot in SLOT_TYPE_MAP:
        filters["type_filters"] = {
            "filters": {
                "category": {"option": SLOT_TYPE_MAP[slot]}
            }
        }

    if min_links is not None and min_links > 0:
        filters["socket_filters"] = {
            "filters": {
                "links": {"min": min_links}
            }
        }

    stat_filters = []
    if min_life is not None and min_life > 0:
        stat_filters.append({"id": PSEUDO_STATS["total_life"], "value": {"min": min_life}})
    
    if min_ele_res is not None and min_ele_res > 0:
        stat_filters.append({"id": PSEUDO_STATS["total_ele_res"], "value": {"min": min_ele_res}})

    if min_chaos_res is not None and min_chaos_res > 0:
        stat_filters.append({"id": PSEUDO_STATS["total_chaos_res"], "value": {"min": min_chaos_res}})

    if min_fire_dot_multi is not None and min_fire_dot_multi > 0:
        stat_filters.append({"id": PSEUDO_STATS["fire_dot_multi"], "value": {"min": min_fire_dot_multi}})

    query_body = {
        "status": {"option": "online"},
        "stats": [{"type": "and", "filters": stat_filters}] if stat_filters else [],
        "filters": filters
    }

    payload = {
        "engine": "new",
        "query": query_body,
        "sort": {"price": "asc"}
    }

    return payload


def generate_trade_web_url(query_data, league=DEFAULT_LEAGUE):
    """
    POSTs the query payload to GGG Trade API to obtain a real, 100% valid search ID string (e.g. wvg6Vy8Ksb)
    and returns the direct working search URL https://www.pathofexile.com/trade/search/<league>/<query_id>.
    Handles 429 rate limiting with automatic retry backoff.
    """
    import time
    search_url = f"https://www.pathofexile.com/api/trade/search/{urllib.parse.quote(league)}"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Origin": "https://www.pathofexile.com",
        "Referer": f"https://www.pathofexile.com/trade/search/{urllib.parse.quote(league)}"
    }

    # Extract query payload
    api_payload = query_data.get("query", query_data)
    full_payload = {
        "query": api_payload,
        "sort": query_data.get("sort", {"price": "asc"})
    }

    for attempt in range(3):
        req = urllib.request.Request(search_url, data=json.dumps(full_payload).encode("utf-8"), headers=headers)
        try:
            with urllib.request.urlopen(req, timeout=10) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                query_id = data.get("id")
                if query_id:
                    return f"https://www.pathofexile.com/trade/search/{league}/{query_id}"
        except urllib.error.HTTPError as e:
            if e.code == 429 and attempt < 2:
                time.sleep(2 * (attempt + 1))
                continue
            break
        except Exception:
            break

    # Fallback if POST fails
    if "engine" not in query_data:
        query_data = {"engine": "new", **query_data}
    json_compact = json.dumps(query_data, separators=(',', ':'))
    encoded_json = urllib.parse.quote(json_compact)
    return f"https://www.pathofexile.com/trade/search/{league}?q={encoded_json}"


def fetch_trade_results(query_data, league=DEFAULT_LEAGUE, max_results=10, session_id=None):
    """
    Executes a trade search and fetches item details from PoE Trade API.
    Returns a list of parsed item dicts with price, stats, and whisper codes.
    """
    search_url = f"https://www.pathofexile.com/api/trade/search/{urllib.parse.quote(league)}"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
    if session_id:
        headers["Cookie"] = f"POESESSID={session_id}"

    # Strip top-level 'engine' key for API POST request if present
    api_payload = query_data.get("query", query_data)
    if "query" not in api_payload:
        api_payload = {"query": api_payload, "sort": query_data.get("sort", {"price": "asc"})}

    req = urllib.request.Request(search_url, data=json.dumps(api_payload).encode("utf-8"), headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            res = json.loads(response.read().decode("utf-8"))
            result_ids = res.get("result", [])[:max_results]
            query_id = res.get("id")

            if not result_ids:
                return {"query_id": query_id, "items": []}

            fetch_url = f"https://www.pathofexile.com/api/trade/fetch/{','.join(result_ids)}?query={query_id}"
            fetch_req = urllib.request.Request(fetch_url, headers=headers)
            with urllib.request.urlopen(fetch_req, timeout=10) as fetch_res:
                fetch_data = json.loads(fetch_res.read().decode("utf-8"))
                parsed_items = []
                for item_wrapper in fetch_data.get("result", []):
                    item = item_wrapper.get("item", {})
                    listing = item_wrapper.get("listing", {})
                    price_info = listing.get("price", {})
                    
                    amount = price_info.get("amount", 0)
                    currency = price_info.get("currency", "chaos")
                    
                    parsed_items.append({
                        "id": item.get("id"),
                        "name": item.get("name", "") or item.get("typeLine", ""),
                        "typeLine": item.get("typeLine", ""),
                        "price_amount": amount,
                        "price_currency": currency,
                        "ilvl": item.get("ilvl"),
                        "corrupted": item.get("corrupted", False),
                        "implicitMods": item.get("implicitMods", []),
                        "explicitMods": item.get("explicitMods", []),
                        "whisper": listing.get("whisper", ""),
                        "seller": listing.get("account", {}).get("name", "Unknown")
                    })
                return {"query_id": query_id, "web_url": f"https://www.pathofexile.com/trade/search/{league}/{query_id}", "items": parsed_items}
    except Exception as e:
        return {"error": str(e), "items": []}


def calculate_price_quality_score(item, weights=None):
    """
    Calculates a Price/Quality Score (Value Ratio) for an item.
    Higher score = better value for money spent.
    """
    if weights is None:
        weights = {"life": 1.0, "ele_res": 0.8, "fire_dot": 3.0}

    # Normalize price to Chaos
    price = item.get("price_amount", 1)
    currency = item.get("price_currency", "chaos")
    if currency == "divine":
        price *= 140 # Approx conversion

    if price <= 0:
        price = 1

    # Extract score from explicit mods
    score_points = 0
    mods_text = " ".join(item.get("explicitMods", []) + item.get("implicitMods", [])).lower()

    if "maximum life" in mods_text:
        score_points += 50 * weights.get("life", 1.0)
    if "resistance" in mods_text:
        score_points += 40 * weights.get("ele_res", 1.0)
    if "fire damage over time" in mods_text or "damage over time multiplier" in mods_text:
        score_points += 150 * weights.get("fire_dot", 3.0)

    value_ratio = round(score_points / price, 2)
    item["value_ratio"] = value_ratio
    return value_ratio
