import xml.etree.ElementTree as ET

tree = ET.parse('user_current_pob.xml')
root = tree.getroot()

print("=== ALL SKILLS IN POB ===")
for skill in root.findall('.//Skill'):
    slot = skill.get('slot', 'Unassigned')
    enabled = skill.get('enabled')
    label = skill.get('label', '')
    print(f"\n--- Skill Group: Slot={slot}, Label={label}, Enabled={enabled} ---")
    for gem in skill.findall('Gem'):
        name = gem.get('nameSpec')
        level = gem.get('level')
        quality = gem.get('quality')
        gem_enabled = gem.get('enabled')
        count = gem.get('count', '1')
        print(f"  Gem: {name} | Level: {level} | Quality: {quality} | Enabled: {gem_enabled} | Count: {count}")

print("\n=== ITEMS FULL STATS & MODS ===")
for item in root.findall('.//Item'):
    text = item.text.strip()
    print("-----------------------------------")
    print(text)

print("\n=== TREE NODES & KELESTONES ===")
spec = root.find('.//Spec')
if spec is not None:
    nodes = spec.get('nodes', '').split(',')
    print("Total allocated node IDs:", len(nodes))

print("\n=== SOCKETED JEWELS ===")
for socket in root.findall('.//Sockets/Socket'):
    item_id = socket.get('itemId')
    node_id = socket.get('nodeId')
    if item_id and item_id != "0":
        print(f"NodeId: {node_id} -> ItemId: {item_id}")
