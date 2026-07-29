import xml.etree.ElementTree as ET

root = ET.parse('scratch/user_pob_new.xml').getroot()

build = root.find('Build')
print('=== BUILD SUMMARY ===')
print('Level:', build.attrib.get('level'), 'Class:', build.attrib.get('className'), 'Ascendancy:', build.attrib.get('ascendClassName'))

print('\n=== KEY STATS ===')
for stat in root.findall('.//PlayerStat'):
    name = stat.attrib['stat']
    val = stat.attrib['value']
    if name in ['IgniteDPS', 'CombinedDPS', 'TotalDotDPS', 'Life', 'Spec:LifeInc', 'EnergyShield', 'Spec:EnergyShieldInc', 'Armour', 'EHP', 'FireResist', 'ColdResist', 'LightningResist', 'ChaosResist', 'CastSpeed', 'Speed', 'BrandActivationFrequency', 'BrandAttachmentRangeMetre']:
        print(f'  {name}: {val}')

print('\n=== SKILLS / GEMS ===')
for sg in root.findall('.//Skill'):
    enabled = sg.attrib.get('enabled', 'true')
    slot = sg.attrib.get('slot', 'Unset')
    gems = [(g.attrib.get('nameSpec'), g.attrib.get('level'), g.attrib.get('quality'), g.attrib.get('enabled')) for g in sg.findall('Gem')]
    print(f'Slot: {slot:<15} Enabled: {enabled:<5} Gems: {gems}')

print('\n=== ITEMS IN USE ===')
items = {item.attrib['id']: item.text.strip() for item in root.findall('.//Item')}
item_set = root.find('.//ItemSet')
if item_set is not None:
    for slot in item_set.findall('Slot'):
        name = slot.attrib.get('name')
        item_id = slot.attrib.get('itemId')
        if item_id in items:
            lines = items[item_id].splitlines()
            print(f'{name:<15}: {lines[0]} | {lines[1] if len(lines)>1 else ""}')
            for line in lines[2:]:
                if any(k in line for k in ['Rarity:', 'Unique ID:', 'Item Level:', 'Sockets:']):
                    continue
                print(f'   {line}')

print('\n=== PASSIVE TREE NODES ===')
spec = root.find('.//Spec')
if spec is not None:
    nodes = spec.attrib.get('nodes', '')
    print(f'Total nodes allocated: {len(nodes.split(","))}')
