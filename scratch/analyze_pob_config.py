import xml.etree.ElementTree as ET

tree = ET.parse('user_current_pob.xml')
root = tree.getroot()

print("=== CONFIG INPUTS ===")
config = root.find('.//Config')
if config is not None:
    for inp in config.findall('Input'):
        name = inp.get('name')
        val = inp.get('boolean') or inp.get('string') or inp.get('number')
        print(f"  {name} = {val}")

print("\n=== ALL PLAYER/MINION STATS IN POB ===")
for stat in root.findall('.//PlayerStat'):
    s = stat.get('stat')
    v = stat.get('value')
    if any(k in s for k in ['DPS', 'Damage', 'Life', 'Shield', 'Resist', 'HitChance', 'Crit', 'Speed', 'Block', 'Armour', 'EHP']):
        print(f"  {s} = {v}")
