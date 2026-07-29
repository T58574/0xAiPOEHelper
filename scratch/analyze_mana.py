import xml.etree.ElementTree as ET

root = ET.parse('scratch/user_pob_5pZ.xml').getroot()

print('=== MANA STATS ===')
for stat in root.findall('.//PlayerStat'):
    name = stat.attrib['stat']
    val = stat.attrib['value']
    if 'Mana' in name or 'Cost' in name:
        print(f'  {name}: {val}')

print('\n=== SKILLS IN 6L BODY ARMOUR ===')
for sg in root.findall('.//Skill'):
    slot = sg.attrib.get('slot', 'Unset')
    gems = [(g.attrib.get('nameSpec'), g.attrib.get('level'), g.attrib.get('quality'), g.attrib.get('enabled')) for g in sg.findall('Gem')]
    if 'Body' in slot or any(g[0] == 'Penance Brand' for g in gems):
        print(f'Slot: {slot:<15} Gems: {gems}')

print('\n=== CRAFTED MODS ON RINGS / AMULET / HELMET ===')
items = {item.attrib['id']: item.text.strip() for item in root.findall('.//Item')}
item_set = root.find('.//ItemSet')
if item_set is not None:
    for slot in item_set.findall('Slot'):
        name = slot.attrib.get('name')
        item_id = slot.attrib.get('itemId')
        if item_id in items:
            lines = items[item_id].splitlines()
            for l in lines:
                if 'Mana' in l or 'Cost' in l or '{crafted}' in l:
                    print(f'{name:<12}: {l}')
