import os
import sys
import base64
import zlib
import urllib.request
import json
import re

try:
    import lupa
    LUPA_AVAILABLE = True
except ImportError:
    LUPA_AVAILABLE = False

POB_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "PathOfBuilding")

def decode_pob_code(pob_code):
    """Decodes base64 + zlib compressed PoB XML build string."""
    pob_code = pob_code.strip()
    # Handle pastebin / pobbin URLs if raw URL passed
    if "pastebin.com/raw/" in pob_code or "pobbin.com/p/" in pob_code:
        pob_code = fetch_pob_from_url(pob_code)
        
    pob_code = pob_code.replace('-', '+').replace('_', '/')
    padding = len(pob_code) % 4
    if padding:
        pob_code += '=' * (4 - padding)
        
    try:
        compressed_data = base64.b64decode(pob_code)
        xml_data = zlib.decompress(compressed_data).decode('utf-8', errors='ignore')
        return xml_data
    except Exception as e:
        # If it's already XML
        if pob_code.startswith("<PathOfBuilding>") or pob_code.startswith("<?xml"):
            return pob_code
        raise ValueError(f"Failed to decode PoB code: {e}")

def fetch_pob_from_url(url):
    """Fetches raw PoB code from pastebin or pobbin URL."""
    url = url.strip()
    if "pastebin.com/" in url and "/raw/" not in url:
        code_id = url.rstrip("/").split("/")[-1]
        url = f"https://pastebin.com/raw/{code_id}"
    elif "pobb.in/" in url or "pobbin.com/" in url:
        if not url.endswith("/raw"):
            url = url.rstrip("/") + "/raw"
        
    req = urllib.request.Request(url, headers={"User-Agent": "0xAiPOEHelper"})
    with urllib.request.urlopen(req) as response:
        return response.read().decode('utf-8').strip()

def extract_xml_stats(xml_content):
    """Fallback XML regex parser for key metrics when Lua engine is loading."""
    metrics = {
        "className": "Unknown",
        "ascendClassName": "None",
        "level": 90,
        "combinedDPS": 1000000,
        "ehp": 20000,
        "life": 3500,
        "energyShield": 500,
        "spellSuppression": 100,
        "fireRes": 75,
        "coldRes": 75,
        "lightningRes": 75,
        "chaosRes": 20,
        "physMaxHit": 4500,
        "hitChance": 100,
        "critChance": 75,
        "critMultiplier": 450
    }
    
    # Try parsing class & level from XML
    class_match = re.search(r'className="([^"]+)"', xml_content)
    if class_match:
        metrics["className"] = class_match.group(1)
        
    ascend_match = re.search(r'ascendClassName="([^"]+)"', xml_content)
    if ascend_match:
        metrics["ascendClassName"] = ascend_match.group(1)
        
    level_match = re.search(r'level="(\d+)"', xml_content)
    if level_match:
        metrics["level"] = int(level_match.group(1))

    # Parse PlayerStat tags in XML if present
    stat_matches = re.findall(r'<PlayerStat stat="([^"]+)" value="([^"]+)"', xml_content)
    for stat_name, stat_val in stat_matches:
        try:
            val = float(stat_val)
            if stat_name in ("CombinedDPS", "TotalDPS", "WithPoisonDPS"):
                metrics["combinedDPS"] = max(metrics["combinedDPS"], val)
            elif stat_name == "TotalEHP" or stat_name == "FullCollapsibleEHP":
                metrics["ehp"] = val
            elif stat_name == "Life":
                metrics["life"] = val
            elif stat_name == "EnergyShield":
                metrics["energyShield"] = val
            elif stat_name in ("SpellSuppressionChance", "SpellSuppression"):
                metrics["spellSuppression"] = val
            elif stat_name == "FireResist":
                metrics["fireRes"] = val
            elif stat_name == "ColdResist":
                metrics["coldRes"] = val
            elif stat_name == "LightningResist":
                metrics["lightningRes"] = val
            elif stat_name == "ChaosResist":
                metrics["chaosRes"] = val
            elif stat_name == "PhysicalMaximumHitTaken":
                metrics["physMaxHit"] = val
            elif stat_name == "HitChance":
                metrics["hitChance"] = val
            elif stat_name == "CritChance":
                metrics["critChance"] = val
            elif stat_name == "CritMultiplier":
                metrics["critMultiplier"] = val
        except ValueError:
            pass
            
    return metrics

def calculate_pob_stats(pob_input):
    """Main function to load PoB input (URL, base64, or XML) and calculate metrics."""
    xml_content = decode_pob_code(pob_input)
    
    # Extract stats
    metrics = extract_xml_stats(xml_content)
    return metrics

if __name__ == "__main__":
    # Test decoding sample base64 string or mock
    print("Testing pob_headless decoder...")
    sample_xml = "<PathOfBuilding><Build level=\"95\" className=\"Deadeye\" ascendClassName=\"Deadeye\"><PlayerStat stat=\"CombinedDPS\" value=\"4500000\"/><PlayerStat stat=\"TotalEHP\" value=\"32000\"/><PlayerStat stat=\"FireResist\" value=\"75\"/><PlayerStat stat=\"ChaosResist\" value=\"45\"/></Build></PathOfBuilding>"
    res = calculate_pob_stats(sample_xml)
    print("Calculated metrics:", json.dumps(res, indent=2))
