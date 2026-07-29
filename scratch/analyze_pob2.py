import sys
import os
import xml.etree.ElementTree as ET

sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "pob_bridge"))
from pob_headless import fetch_pob_from_url, decode_pob_code

raw = fetch_pob_from_url('https://pobb.in/dEJWE85tvBjn')
xml_str = decode_pob_code(raw)
root = ET.fromstring(xml_str)

build = root.find('Build')
print('=== BUILD INFO ===')
print('Class:', build.attrib.get('className'), '| Ascendancy:', build.attrib.get('ascendClassName'), '| Level:', build.attrib.get('level'))

print('\n=== SKILLS & GEMS ===')
for skill in root.findall('.//Skill'):
    slot = skill.attrib.get('slot', 'NoSlot')
    enabled = skill.attrib.get('enabled', 'true')
    gems = [(g.attrib.get('nameSpec'), g.attrib.get('level'), g.attrib.get('quality'), g.attrib.get('enabled')) for g in skill.findall('Gem')]
    if gems:
        print(f"[{slot}] enabled={enabled}: {gems}")

print('\n=== EQUIPPED ITEMS ===')
items_elem = root.find('Items')
active_set_id = items_elem.attrib.get('activeItemSet', '1') if items_elem is not None else '1'
active_set = root.find(f".//ItemSet[@id='{active_set_id}']")
if active_set is None:
    active_set = root.find('.//ItemSet')

item_map = {item.attrib.get('id'): item.text.strip() if item.text else '' for item in root.findall('.//Item')}
if active_set is not None:
    for slot in active_set.findall('Slot'):
        s_name = slot.attrib.get('slot') or 'Unknown'
        item_id = slot.attrib.get('itemId')
        if item_id in item_map:
            lines = item_map[item_id].split('\n')
            print(f"{s_name:<15}: {lines[0]} | {lines[1] if len(lines)>1 else ''}")

print('\n=== ALL ITEM TEXTS ===')
for item_id, item_text in item_map.items():
    print(f"\n--- Item {item_id} ---")
    print(item_text)
