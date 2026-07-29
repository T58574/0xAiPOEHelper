import json, urllib.request, urllib.parse

def test_api_post():
    url = "https://www.pathofexile.com/api/trade/search/Allflame"
    payload = {
        "query": {
            "status": {"option": "online"},
            "type_filters": {
                "filters": {
                    "category": {"option": "accessory.amulet"}
                }
            },
            "stats": [
                {
                    "type": "and",
                    "filters": [
                        {"id": "pseudo.pseudo_total_life", "value": {"min": 50}}
                    ]
                }
            ],
            "filters": {
                "trade_filters": {
                    "filters": {
                        "price": {"max": 20}
                    }
                }
            }
        },
        "sort": {"price": "asc"}
    }
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Content-Type": "application/json",
        "Accept": "application/json"
    }

    req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            print("POST API SUCCESS! ID:", data.get("id"))
            print("Generated URL:", f"https://www.pathofexile.com/trade/search/Allflame/{data.get('id')}")
            return data.get("id")
    except Exception as e:
        print("POST API FAILED:", e)
        return None

def test_query_param():
    payload = {
        "engine": "new",
        "query": {
            "status": {"option": "online"},
            "type_filters": {
                "filters": {
                    "category": {"option": "accessory.amulet"}
                }
            },
            "stats": [
                {
                    "type": "and",
                    "filters": [
                        {"id": "pseudo.pseudo_total_life", "value": {"min": 50}}
                    ]
                }
            ],
            "filters": {
                "trade_filters": {
                    "filters": {
                        "price": {"max": 20}
                    }
                }
            }
        },
        "sort": {"price": "asc"}
    }
    encoded = urllib.parse.quote(json.dumps(payload))
    full_url = f"https://www.pathofexile.com/trade/search/Allflame?q={encoded}"
    print("\nQUERY PARAM URL:")
    print(full_url)

if __name__ == "__main__":
    test_api_post()
    test_query_param()
