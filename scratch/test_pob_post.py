import json, urllib.request

def test_post_fixed():
    url = "https://www.pathofexile.com/api/trade/search/Allflame"
    
    # Correct GGG Trade API schema: type_filters is inside filters!
    payload = {
        "query": {
            "status": {"option": "online"},
            "stats": [
                {
                    "type": "and",
                    "filters": [
                        {"id": "pseudo.pseudo_total_life", "value": {"min": 60}},
                        {"id": "pseudo.pseudo_total_elemental_resistance", "value": {"min": 30}}
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
                        "category": {"option": "accessory.amulet"},
                        "rarity": {"option": "nonunique"}
                    }
                }
            }
        },
        "sort": {"price": "asc"}
    }

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Origin": "https://www.pathofexile.com",
        "Referer": "https://www.pathofexile.com/trade/search/Allflame"
    }

    req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            query_id = data.get("id")
            print("SUCCESS! Query ID:", query_id)
            print("WORKING DIRECT TRADE URL:")
            print(f"https://www.pathofexile.com/trade/search/Allflame/{query_id}")
            return query_id
    except Exception as e:
        print("POST Error:", e)
        if hasattr(e, "read"):
            print("Error details:", e.read().decode("utf-8"))
        return None

if __name__ == "__main__":
    test_post_fixed()
