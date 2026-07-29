import sys, os, xml.etree.ElementTree as ET
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "pob_bridge"))
from pob_headless import fetch_pob_from_url, decode_pob_code

raw = fetch_pob_from_url('https://pobb.in/dEJWE85tvBjn')
xml_str = decode_pob_code(raw)
root = ET.fromstring(xml_str)

for skill in root.findall('.//Skill'):
    slot = skill.attrib.get('slot', 'NoSlot')
    enabled = skill.attrib.get('enabled', 'true')
    gems = [(g.attrib.get('nameSpec'), g.attrib.get('level'), g.attrib.get('quality'), g.attrib.get('enabled')) for g in skill.findall('Gem')]
    print(f"Slot: {slot:<15} Enabled: {enabled:<5} Gems: {gems}")
