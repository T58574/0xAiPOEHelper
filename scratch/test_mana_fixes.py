import xml.etree.ElementTree as ET

# Base Mana Cost 25
# Current multipliers: 1.4 * 1.3 * 1.3 * 1.3 * 1.4 = 4.79 -> 25 * 4.79 = 119.7 -> 120 Mana Cost

print("=== MANA COST REDUCTION ANALYSIS ===")
print("Current Setup (4.79x multiplier): 120 Mana Cost")

# Swap Swift Affliction (1.4x) for Inspiration (0.66x multiplier)
base_insp = 25 * 1.4 * 1.3 * 1.3 * 1.3 * 0.66
print(f"Swap Swift Affliction for Inspiration (0.66x): {round(base_insp)} Mana Cost")

# With 2x Ring Bench Crafts (-7 Mana Cost each = -14 total):
print(f"With 2x Rings bench-crafted (-7 Mana Cost each): {round(base_insp) - 14} Mana Cost")

# With Mana Mastery (-8% or paid as life):
print(f"With Inspiration + 2x Ring Crafts + Mana Mastery: ~35-40 Mana Cost!")
