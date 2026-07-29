import xml.etree.ElementTree as ET

tree = ET.parse('user_current_pob.xml')
root = tree.getroot()

print("=== ALL GEM GROUPS IN POB ===")
for i, skill in enumerate(root.findall('.//Skill')):
    slot = skill.get('slot', 'Unassigned')
    enabled = skill.get('enabled')
    label = skill.get('label', '')
    gems = []
    for g in skill.findall('Gem'):
        gems.append(f"{g.get('nameSpec')} (L{g.get('level')})")
    print(f"Group {i+1} | Slot: {slot} | Label: '{label}' | Enabled: {enabled}")
    for gem in gems:
        print(f"   -> {gem}")
