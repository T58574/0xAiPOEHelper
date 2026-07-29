"""
0xAiPOEHelper Item Filter Generator & NeverSink Injector Engine
Generates custom PoE 1 item filter files (.filter) tailored for leveling and endgame mapping.
Features:
- Guaranteed Protection & Maximum Highlight for Divines, Mirrors, Hinekora's Lock, Chaos, etc. (NEVER HIDDEN)
- High-contrast Black-and-White (Черно-белая) style with large text (SetFontSize 45) for key build gear.
"""

import sys
import os
import argparse

# --- GUARANTEED CURRENCY PROTECTION BLOCK (NEVER HIDDEN, PLACED FIRST) ---
GOD_CURRENCY_PROTECTION_BLOCK = """#===============================================================================================================
# [[0050]] 0xAiPOEHELPER GUARANTEED CURRENCY PROTECTION (MIRRORS, DIVINES, HINEKORA - NEVER HIDDEN!)
#===============================================================================================================

Show # 0xAiPOE: GOD TIER CURRENCY (MIRROR, HINEKORA, DIVINE, SACRED, FRACTURING)
\tClass "Stackable Currency" "Currency"
\tBaseType == "Mirror of Kalandra" "Mirror Shard" "Hinekora's Lock" "Divine Orb" "Sacred Orb" "Veiled Orb" "Fracturing Orb" "Fracturing Shard" "Awakener's Orb" "Tailoring Orb" "Tempering Orb" "Albino Rhoa Feather"
\tSetFontSize 45
\tSetTextColor 255 255 255 255
\tSetBorderColor 255 0 0 255
\tSetBackgroundColor 220 0 0 255
\tPlayAlertSound 6 300
\tPlayEffect Red
\tMinimapIcon 0 Red Star

Show # 0xAiPOE: HIGH VALUE CURRENCY (EXALT, CHAOS, ANNULMENT, VAAL, STACKED DECK)
\tClass "Stackable Currency" "Currency"
\tBaseType == "Exalted Orb" "Orb of Annulment" "Chaos Orb" "Vaal Orb" "Gemcutter's Prism" "Stacked Deck" "Orb of Unmaking" "Ancient Orb" "Regal Orb" "Orb of Regret" "Orb of Fusing" "Glassblower's Bauble"
\tSetFontSize 45
\tSetTextColor 0 0 0 255
\tSetBorderColor 255 215 0 255
\tSetBackgroundColor 255 255 255 255
\tPlayAlertSound 1 300
\tPlayEffect Yellow
\tMinimapIcon 0 Yellow Circle
"""

# --- STAGE 1: ACTS 1-5 (MONOCHROME & GOLD HIGH-CONTRAST) ---
STAGE_1_ACTS1_5_RULES = """#===============================================================================================================
# [[0100]] 0xAiPOEHELPER BUILD OVERRIDE - STAGE 1: ACTS 1-5 (BLACK & WHITE HIGH CONTRAST)
#===============================================================================================================

Show # 0xAiPOE: R-B-B 3-Link Leveling Wands / Staves / Sceptres
\tClass "Wands" "Staves" "Sceptres"
\tLinkedSockets >= 3
\tSocketGroup "RBB"
\tAreaLevel <= 45
\tSetFontSize 45
\tSetTextColor 0 0 0 255
\tSetBorderColor 255 215 0 255
\tSetBackgroundColor 255 255 255 255
\tPlayAlertSound 1 300
\tPlayEffect Yellow
\tMinimapIcon 0 Yellow Diamond

Show # 0xAiPOE: B-B-B 3-Link Leveling Wands / Staves
\tClass "Wands" "Staves" "Sceptres"
\tLinkedSockets >= 3
\tSocketGroup "BBB"
\tAreaLevel <= 45
\tSetFontSize 45
\tSetTextColor 0 0 0 255
\tSetBorderColor 0 200 255 255
\tSetBackgroundColor 240 245 255 255
\tPlayAlertSound 1 250
\tPlayEffect Cyan
\tMinimapIcon 1 Cyan Diamond

Show # 0xAiPOE: Quicksilver Flask & Movement Speed Boots
\tBaseType == "Quicksilver Flask"
\tAreaLevel <= 60
\tSetFontSize 45
\tSetTextColor 0 0 0 255
\tSetBorderColor 0 255 128 255
\tSetBackgroundColor 255 255 255 255
\tPlayAlertSound 2 300
\tPlayEffect Green
\tMinimapIcon 0 Green Circle

Show # 0xAiPOE: Movement Speed Boots (Early Acts)
\tClass "Boots"
\tAreaLevel <= 35
\tRarity Magic Rare
\tSetFontSize 45
\tSetTextColor 0 0 0 255
\tSetBorderColor 0 255 200 255
\tSetBackgroundColor 255 255 255 255
\tPlayEffect Cyan Temp

Show # 0xAiPOE: Two-Stone Rings (Fire/Cold/Light Resists)
\tBaseType == "Two-Stone Ring" "Ruby Ring" "Sapphire Ring" "Topaz Ring" "Unset Ring"
\tAreaLevel <= 68
\tSetFontSize 42
\tSetTextColor 0 0 0 255
\tSetBorderColor 255 215 0 255
\tSetBackgroundColor 255 255 255 255
\tPlayEffect Yellow Temp
\tMinimapIcon 2 Yellow Square
"""

# --- STAGE 2: ACTS 6-10 (BLACK & WHITE HIGH CONTRAST) ---
STAGE_2_ACTS6_10_RULES = """#===============================================================================================================
# [[0100]] 0xAiPOEHELPER BUILD OVERRIDE - STAGE 2: ACTS 6-10 & EARLY MAPS (BLACK & WHITE HIGH CONTRAST)
#===============================================================================================================

Show # 0xAiPOE: Ezomyte Staff Base (Level 60+ Soulwrest Base)
\tBaseType == "Ezomyte Staff"
\tAreaLevel >= 60
\tSetFontSize 45
\tSetTextColor 0 0 0 255
\tSetBorderColor 255 0 0 255
\tSetBackgroundColor 255 255 255 255
\tPlayAlertSound 6 300
\tPlayEffect Red
\tMinimapIcon 0 Red Star

Show # 0xAiPOE: 4-Link R-B-B-B Core Armor
\tLinkedSockets >= 4
\tSocketGroup "RBBB"
\tAreaLevel <= 75
\tSetFontSize 45
\tSetTextColor 0 0 0 255
\tSetBorderColor 255 176 0 255
\tSetBackgroundColor 255 255 255 255
\tPlayAlertSound 2 300
\tPlayEffect Orange
\tMinimapIcon 0 Orange Square

Show # 0xAiPOE: 4-Link B-B-B-B Core Support Armor
\tLinkedSockets >= 4
\tSocketGroup "BBBB"
\tAreaLevel <= 75
\tSetFontSize 45
\tSetTextColor 0 0 0 255
\tSetBorderColor 0 200 255 255
\tSetBackgroundColor 255 255 255 255
\tPlayAlertSound 2 250
\tPlayEffect Cyan
\tMinimapIcon 1 Cyan Square

Show # 0xAiPOE: 6-Socket Items (Jeweller's Vendor Recipe: 7 Jeweller Orbs)
\tSockets == 6
\tLinkedSockets < 6
\tSetFontSize 45
\tSetTextColor 0 0 0 255
\tSetBorderColor 255 255 255 255
\tSetBackgroundColor 240 150 0 255
\tPlayAlertSound 3 250
\tPlayEffect Yellow
\tMinimapIcon 1 Yellow Circle

Show # 0xAiPOE: Ghastly Eye Jewels & Stygian Vise
\tBaseType == "Ghastly Eye Jewel" "Stygian Vise" "Darkness Enthroned"
\tSetFontSize 45
\tSetTextColor 0 0 0 255
\tSetBorderColor 0 255 180 255
\tSetBackgroundColor 255 255 255 255
\tPlayAlertSound 3 300
\tPlayEffect Green
\tMinimapIcon 0 Green Diamond
"""

# --- STAGE 3: ENDGAME MAPS & CI TRANSITION (BLACK & WHITE HIGH CONTRAST) ---
STAGE_3_ENDGAME_RULES = """#===============================================================================================================
# [[0100]] 0xAiPOEHELPER BUILD OVERRIDE - STAGE 3: ENDGAME MAPS & CI (BLACK & WHITE HIGH CONTRAST)
#===============================================================================================================

Show # 0xAiPOE: 6-Link Items (All Bases)
\tLinkedSockets == 6
\tSetFontSize 45
\tSetTextColor 0 0 0 255
\tSetBorderColor 255 0 0 255
\tSetBackgroundColor 255 255 255 255
\tPlayAlertSound 1 300
\tPlayEffect Red
\tMinimapIcon 0 Red Diamond

Show # 0xAiPOE: Unique Soulwrest Ezomyte Staff
\tBaseType == "Ezomyte Staff"
\tRarity Unique
\tSetFontSize 45
\tSetTextColor 0 0 0 255
\tSetBorderColor 255 176 0 255
\tSetBackgroundColor 255 255 255 255
\tPlayAlertSound 6 300
\tPlayEffect Red
\tMinimapIcon 0 Red Star

Show # 0xAiPOE: Build Endgame Uniques (Ancient Skull, Bonemeld, Sorrow of the Divine, Kingmaker)
\tBaseType == "Bone Helmet" "Sulphur Flask" "Despot Axe" "Citrine Amulet"
\tRarity Unique
\tSetFontSize 45
\tSetTextColor 0 0 0 255
\tSetBorderColor 255 0 255 255
\tSetBackgroundColor 255 255 255 255
\tPlayAlertSound 1 300
\tPlayEffect Purple
\tMinimapIcon 0 Purple Diamond

Show # 0xAiPOE: High ES Crafting Base (Vaal Regalia ilvl 86+)
\tBaseType == "Vaal Regalia"
\tItemLevel >= 86
\tSetFontSize 45
\tSetTextColor 0 0 0 255
\tSetBorderColor 0 255 255 255
\tSetBackgroundColor 255 255 255 255
\tPlayAlertSound 3 300
\tPlayEffect Cyan
\tMinimapIcon 0 Cyan Diamond

Show # 0xAiPOE: Bone Rings & Cluster Jewels (8-Passive Minion & Medium)
\tBaseType == "Bone Ring" "Large Cluster Jewel" "Medium Cluster Jewel"
\tSetFontSize 45
\tSetTextColor 0 0 0 255
\tSetBorderColor 0 255 180 255
\tSetBackgroundColor 255 255 255 255
\tPlayAlertSound 3 300
\tPlayEffect Green
\tMinimapIcon 0 Green Hexagon
"""

def generate_custom_filter(stage: int = 2) -> str:
    """Generates a complete standalone item filter file string with guaranteed currency protection."""
    header = f"""#===============================================================================================================
# 0xAiPOEHelper Custom High-Contrast Item Filter (PoE 3.29)
# Style Theme: High-Contrast Black & White (Черно-Белый Стилизованный)
# Active Profile: MasterT's Physical Soulwrest Necromancer
# Active Stage: {stage}
# Features: Guaranteed Currency Protection (Divines, Mirrors, Hinekora NEVER HIDDEN!)
#===============================================================================================================
"""
    if stage == 1:
        rules = STAGE_1_ACTS1_5_RULES
    elif stage == 3:
        rules = STAGE_3_ENDGAME_RULES
    else:
        rules = STAGE_2_ACTS6_10_RULES

    # Always prepend currency protection BEFORE any hide rules!
    full_rules = GOD_CURRENCY_PROTECTION_BLOCK + "\n\n" + rules

    fallback = """
# --- GENERAL STACKABLE CURRENCY (NEVER HIDDEN) ---
Show
\tClass "Stackable Currency" "Currency"
\tSetFontSize 40
\tSetTextColor 0 0 0 255
\tSetBorderColor 240 150 0 255
\tSetBackgroundColor 255 255 255 255

Show
\tClass "Maps" "Divination Card" "Skill Gems"
\tSetFontSize 40

Show
\tRarity Unique Rare
\tSetFontSize 38

Hide
\tAreaLevel >= 68
\tRarity Magic Normal
\tClass "Body Armours" "Helmets" "Gloves" "Boots" "Shields" "Wands" "Staves" "Sceptres" "Bows" "Claws" "Daggers" "Axes" "Swords" "Maces"
"""
    return header + "\n" + full_rules + "\n" + fallback

def inject_into_neversink(neversink_filepath: str, output_filepath: str, stage: int = 2):
    """Injects currency protection & black-and-white build rules into top of NeverSink filter."""
    if not os.path.exists(neversink_filepath):
        print(f"Error: NeverSink filter file not found at {neversink_filepath}")
        return False

    if stage == 1:
        rules = STAGE_1_ACTS1_5_RULES
    elif stage == 3:
        rules = STAGE_3_ENDGAME_RULES
    else:
        rules = STAGE_2_ACTS6_10_RULES

    full_override = GOD_CURRENCY_PROTECTION_BLOCK + "\n\n" + rules

    with open(neversink_filepath, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()

    new_content = full_override + "\n\n" + content

    with open(output_filepath, "w", encoding="utf-8") as f:
        f.write(new_content)

    print(f"Successfully injected Stage {stage} rules & Currency Protection into {output_filepath}")
    return True

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="0xAiPOEHelper Item Filter Generator")
    parser.add_argument("--stage", type=int, default=2, choices=[1, 2, 3], help="Leveling Stage (1: Acts 1-5, 2: Acts 6-10, 3: Endgame)")
    parser.add_argument("--inject", type=str, help="Path to NeverSink filter to inject into")
    parser.add_argument("--output", type=str, default="0xAiPOE_Soulwrest.filter", help="Output filter file path")

    args = parser.parse_args()

    if args.inject:
        inject_into_neversink(args.inject, args.output, args.stage)
    else:
        filter_text = generate_custom_filter(args.stage)
        with open(args.output, "w", encoding="utf-8") as f:
            f.write(filter_text)
        print(f"Successfully generated standalone Stage {args.stage} filter: {args.output}")
