import sys
import os
import xml.etree.ElementTree as ET

sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), "pob_bridge"))
from pob_headless import fetch_pob_from_url, decode_pob_code

raw = fetch_pob_from_url('https://pobb.in/7Ity4goXw-fJ')
xml_str = decode_pob_code(raw)
root = ET.fromstring(xml_str)

print("=== SKILLS & GEMS ===")
for skill in root.findall(".//Skill"):
    slot = skill.attrib.get("slot", "NoSlot")
    enabled = skill.attrib.get("enabled", "true")
    gems = [(g.attrib.get("nameSpec"), g.attrib.get("level"), g.attrib.get("quality"), g.attrib.get("enabled")) for g in skill.findall("Gem")]
    if gems:
        print(f"[{slot}] enabled={enabled}: {gems}")

print("\n=== EQUIPPED ITEM SET ===")
active_set_id = root.find("Items").attrib.get("activeItemSet", "1")
active_set = root.find(f".//ItemSet[@id='{active_set_id}']")
if active_set is None:
    active_set = root.find(".//ItemSet")

item_map = {}
for item in root.findall(".//Item"):
    item_map[item.attrib.get("id")] = item.text.strip() if item.text else ""

if active_set is not None:
    for slot in active_set.findall("Slot"):
        s_name = slot.attrib.get("slot") or "Unknown"
        item_id = slot.attrib.get("itemId")
        if item_id in item_map:
            lines = item_map[item_id].split("\n")
            print(f"Slot: {s_name:<15} -> {lines[:3]}")

print("\n=== DETAILED MAIN WEAPON & AMULET & JEWELS ===")
for item_id, item_text in item_map.items():
    if "Reaver Axe" in item_text or "Marylene" in item_text or "Doctrine" in item_text or "Lethal Pride" in item_text or "Light of Meaning" in item_text or "Headhunter" in item_text or "Two-Stone" in item_text or "Giantslayer" in item_text:
        print(f"\n--- Item ID {item_id} ---")
        print(item_text)
