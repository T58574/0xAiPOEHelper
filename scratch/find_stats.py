import json, urllib.request

url = 'https://www.pathofexile.com/api/trade/data/stats'
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'}
req = urllib.request.Request(url, headers=headers)
res = json.loads(urllib.request.urlopen(req).read().decode('utf-8'))

for group in res.get('result', []):
    for entry in group.get('entries', []):
        text = entry.get('text', '')
        if 'fire damage over time multiplier' in text.lower() or 'damage over time multiplier' in text.lower():
            print(f"ID: {entry.get('id'):<40} Text: {text}")
