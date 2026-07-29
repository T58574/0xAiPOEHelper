import json, urllib.parse, urllib.request

def create_trade_search_payload(league="Settlers", max_price_chaos=50):
    """
    Example generator for PoE official trade search query payload.
    """
    payload = {
        "query": {
            "status": {"option": "online"},
            "stats": [{"type": "and", "filters": []}],
            "filters": {
                "trade_filters": {
                    "filters": {
                        "price": {"max": max_price_chaos}
                    }
                }
            }
        },
        "sort": {"price": "asc"}
    }
    return payload

print("PoE Trade API helper module initialized.")
