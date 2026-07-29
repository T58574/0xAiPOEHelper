import xml.etree.ElementTree as ET

tree = ET.parse('user_current_pob.xml')
root = tree.getroot()

print("=== BUILD OVERVIEW ===")
build_node = root.find('Build')
if build_node is not None:
    print('Level:', build_node.get('level'))
    print('ClassName:', build_node.get('className'))
    print('AscendClassName:', build_node.get('ascendClassName'))

print("\n=== STATS IN POB ===")
for stat in root.findall('.//PlayerStat'):
    stat_name = stat.get('stat')
    if stat_name in ['Life', 'EnergyShield', 'Mana', 'Armour', 'EHP', 'FireResist', 'ColdResist', 'LightningResist', 'ChaosResist', 'CombinedDPS', 'FullDPS', 'BlockChance', 'SpellBlockChance']:
        print(f"{stat_name}: {stat.get('value')}")

print("\n=== SKILLS / GEM LINKS ===")
for skill_group in root.findall('.//Skills/Skill'):
    slot = skill_group.get('slot', 'Unassigned')
    enabled = skill_group.get('enabled', 'true')
    label = skill_group.get('label', '')
    gems = []
    for g in skill_group.findall('Gem'):
        name = g.get('nameSpec')
        level = g.get('level')
        quality = g.get('quality')
        is_enabled = g.get('enabled')
        gems.append(f"{name} (L{level}/Q{quality}) [{'ON' if is_enabled=='true' else 'OFF'}]")
    print(f"Slot: {slot} | Label: {label} | Enabled: {enabled}")
    for g in gems:
        print(f"  - {g}")

print("\n=== EQUIPPED ITEMS ===")
equipped_items = {}
for slot in root.findall('.//Items/ItemSet/Slot'):
    name = slot.get('name')
    item_id = slot.get('itemId')
    equipped_items[item_id] = name

for item in root.findall('.//Items/Item'):
    item_id = item.get('id')
    if item_id in equipped_items:
        slot_name = equipped_items[item_id]
        raw_lines = [l.strip() for l in item.text.strip().split('\n') if l.strip()]
        print(f"[{slot_name}] -> {raw_lines[0]} | {raw_lines[1] if len(raw_lines)>1 else ''}")

print("\n=== PASSIVE TREE ALLOCATED KELESTONES & CLUSTERS ===")
nodes_str = root.find('.//Spec').get('nodes', '') if root.find('.//Spec') is not None else ''
print("Total Nodes allocated:", len(nodes_str.split(',')))
