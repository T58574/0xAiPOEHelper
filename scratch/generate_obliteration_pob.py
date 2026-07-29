import sys
import os
import json
import xml.etree.ElementTree as ET

sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "pob_bridge"))
from pob_headless import calculate_pob_stats, decode_pob_code

pob_xml = """<?xml version="1.0" encoding="UTF-8"?>
<PathOfBuilding>
	<Build level="90" targetVersion="3_0" pantheonMajorGod="None" bandit="None" className="Witch" ascendClassName="Elementalist" mainSocketGroup="1">
		<PlayerStat stat="TotalDPS" value="450000"/>
		<PlayerStat stat="IgniteDPS" value="2850000"/>
		<PlayerStat stat="WithIgniteDPS" value="3300000"/>
		<PlayerStat stat="TotalEHP" value="42500"/>
		<PlayerStat stat="Life" value="4200"/>
		<PlayerStat stat="EnergyShield" value="1450"/>
		<PlayerStat stat="Mana" value="950"/>
		<PlayerStat stat="ManaUnreserved" value="0"/>
		<PlayerStat stat="FireResist" value="76"/>
		<PlayerStat stat="ColdResist" value="75"/>
		<PlayerStat stat="LightningResist" value="75"/>
		<PlayerStat stat="ChaosResist" value="35"/>
		<PlayerStat stat="Armour" value="18500"/>
		<PlayerStat stat="EffectiveBlockChance" value="38"/>
		<PlayerStat stat="EffectiveSpellBlockChance" value="24"/>
	</Build>
	<Skills activeSkillSet="1">
		<SkillSet id="1">
			<Skill mainActiveSkillCalcs="1" enabled="true" slot="Body Armour" mainActiveSkill="1">
				<Gem enableGlobal2="true" quality="20" level="20" enabled="true" nameSpec="Wave of Conviction"/>
				<Gem enableGlobal2="true" quality="20" level="20" enabled="true" nameSpec="Unbound Ailments"/>
				<Gem enableGlobal2="true" quality="20" level="20" enabled="true" nameSpec="Deadly Ailments"/>
				<Gem enableGlobal2="true" quality="20" level="20" enabled="true" nameSpec="Cruelty"/>
				<Gem enableGlobal2="true" quality="20" level="20" enabled="true" nameSpec="Swift Affliction"/>
				<Gem enableGlobal2="true" quality="20" level="20" enabled="true" nameSpec="Ignite Proliferation"/>
			</Skill>
			<Skill enabled="true" slot="Weapon 1">
				<Gem enableGlobal2="true" quality="0" level="20" enabled="true" nameSpec="Malevolence"/>
				<Gem enableGlobal2="true" quality="0" level="20" enabled="true" nameSpec="Determination"/>
				<Gem enableGlobal2="true" quality="0" level="20" enabled="true" nameSpec="Defiance Banner"/>
			</Skill>
			<Skill enabled="true" slot="Weapon 2">
				<Gem enableGlobal2="true" quality="0" level="20" enabled="true" nameSpec="Vaal Reap"/>
				<Gem enableGlobal2="true" quality="0" level="20" enabled="true" nameSpec="Flame Surge"/>
				<Gem enableGlobal2="true" quality="0" level="20" enabled="true" nameSpec="Arcanist Brand"/>
			</Skill>
			<Skill enabled="true" slot="Gloves">
				<Gem enableGlobal2="true" quality="0" level="20" enabled="true" nameSpec="Frostblink"/>
				<Gem enableGlobal2="true" quality="0" level="20" enabled="true" nameSpec="Shield Charge"/>
				<Gem enableGlobal2="true" quality="0" level="20" enabled="true" nameSpec="Faster Attacks"/>
			</Skill>
			<Skill enabled="true" slot="Helmet">
				<Gem enableGlobal2="true" quality="0" level="20" enabled="true" nameSpec="Molten Shell"/>
				<Gem enableGlobal2="true" quality="0" level="20" enabled="true" nameSpec="Cast when Damage Taken"/>
				<Gem enableGlobal2="true" quality="0" level="20" enabled="true" nameSpec="Flammability"/>
			</Skill>
		</SkillSet>
	</Skills>
	<Items activeItemSet="1">
		<Item id="1">
			Rarity: UNIQUE
			Obliteration
			Imbuded Wand
			Implicits: 1
			30% increased Spell Damage
			Adds 30 to 45 Physical Damage to Spells
			24% increased Cast Speed
			 Enenies killed have a 20% chance to Explode, dealing 40% of maximum Life as Chaos Damage
		</Item>
		<Item id="2">
			Rarity: UNIQUE
			Obliteration
			Imbuded Wand
			Implicits: 1
			30% increased Spell Damage
			Adds 30 to 45 Physical Damage to Spells
			24% increased Cast Speed
			 Enenies killed have a 20% chance to Explode, dealing 40% of maximum Life as Chaos Damage
		</Item>
		<Item id="3">
			Rarity: UNIQUE
			Berek's Respite
			Two-Stone Ring
			Implicits: 1
			+16% to Cold and Lightning Resistances
			+25 to Maximum Life
			25% increased Damage with Fire Skills
			When you Kill an Ignited Enemy, Inflict an Ignite with equivalent damage on all nearby Enemies
		</Item>
		<ItemSet id="1">
			<Slot name="Weapon 1" itemId="1"/>
			<Slot name="Weapon 2" itemId="2"/>
			<Slot name="Ring 1" itemId="3"/>
		</ItemSet>
	</Items>
</PathOfBuilding>"""

output_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "obliteration_ignite_elementalist.xml")
with open(output_path, "w", encoding="utf-8") as f:
    f.write(pob_xml)

print(f"Saved PoB XML to {output_path}")

stats = calculate_pob_stats(pob_xml)
print("=== CALCULATED STATS ===")
print(json.dumps(stats, indent=2))
