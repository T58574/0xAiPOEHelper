import os
import sqlite3
import json
import re
import urllib.request

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "poe_items.db")

# Pre-populated key uniques data (sample dataset + dynamic ingestion)
POPULAR_UNIQUES = [
    {
        "name": "Mageblood",
        "base_type": "Heavy Belt",
        "item_type": "Belt",
        "stats": "Leftmost 4 Utility Flasks constantly apply their Flask Effects to you\nMagic Utility Flask Effects cannot be removed\n+30-50% to Fire Resistance\n+30-50% to Cold Resistance",
        "req_level": 44,
        "tags": "utility,flask,resist,belt"
    },
    {
        "name": "Headhunter",
        "base_type": "Leather Belt",
        "item_type": "Belt",
        "stats": "When you Kill a Rare Monster, you gain its Modifiers for 20 seconds\n+40-50 to Strength\n+40-50 to Dexterity\n+50-60 to Maximum Life",
        "req_level": 40,
        "tags": "belt,speed,dps,life"
    },
    {
        "name": "Watcher's Eye",
        "base_type": "Prismatic Jewel",
        "item_type": "Jewel",
        "stats": "+4-6% to maximum Energy Shield\n+4-6% to maximum Life\n+4-6% to maximum Mana\nModifications while affected by Auras",
        "req_level": 1,
        "tags": "jewel,aura,dps,ehp,crit"
    },
    {
        "name": "Unnatural Instinct",
        "base_type": "Viridian Jewel",
        "item_type": "Jewel",
        "stats": "Allocates Unallocated Small Passive Skills in Radius\nGrants nothing from Allocated Skills in Radius",
        "req_level": 1,
        "tags": "jewel,tree,speed,crit"
    },
    {
        "name": "Thread of Hope",
        "base_type": "Crimson Jewel",
        "item_type": "Jewel",
        "stats": "Only Passive Skills in Ring are Allocatable\n-10% to -20% to all Elemental Resistances",
        "req_level": 1,
        "tags": "jewel,tree,nodes"
    },
    {
        "name": "Nimis",
        "base_type": "Topaz Ring",
        "item_type": "Ring",
        "stats": "Projectiles Return to you\nProjectiles are fired in random directions\n+20-30% to Lightning Resistance\nProjectiles deal 30-40% increased Damage",
        "req_level": 64,
        "tags": "ring,projectile,returning,dps,kinetic_blast"
    },
    {
        "name": "Voices",
        "base_type": "Large Cluster Jewel",
        "item_type": "Jewel",
        "stats": "Adds 3/5/7 Small Passive Skills which grant nothing\nAdds 3 Jewel Sockets",
        "req_level": 1,
        "tags": "jewel,cluster,sockets"
    },
    {
        "name": "Phantasmal Might / Forbidden Flame",
        "base_type": "Crimson Jewel",
        "item_type": "Jewel",
        "stats": "Allocates Ascendancy Node if matching Forbidden Flesh is equipped",
        "req_level": 1,
        "tags": "jewel,ascendancy"
    },
    {
        "name": "Original Sin",
        "base_type": "Amethyst Ring",
        "item_type": "Ring",
        "stats": "All Elemental Damage Converted to Chaos Damage\nNearby Enemies' Chaos Resistance is 0",
        "req_level": 64,
        "tags": "ring,chaos,penetration,dps"
    },
    {
        "name": "Replica Alberon's Warpath",
        "base_type": "Soldier Boots",
        "item_type": "Boots",
        "stats": "Adds 1 to 80 Chaos Damage to Attacks per 80 Strength\n+18% to Chaos Resistance",
        "req_level": 49,
        "tags": "boots,strength,chaos,dps"
    }
]

POPULAR_GEMS = [
    {"name": "Kinetic Blast", "gem_type": "Active", "tags": "Attack, Projectile, AoE, Wand", "description": "Fires a wand projectile that explodes on hit."},
    {"name": "Kinetic Blast of Clustering", "gem_type": "Active", "tags": "Attack, Projectile, AoE, Wand", "description": "Transfigured Kinetic Blast with focused explosions."},
    {"name": "Awakened Added Cold Damage", "gem_type": "Support", "tags": "Cold, Support", "description": "Adds flat cold damage and +1 to supported cold gems."},
    {"name": "Awakened Elemental Focus", "gem_type": "Support", "tags": "Elemental, Support", "description": "Massive elemental damage boost, prevents inflict status ailments."},
    {"name": "Awakened Greater Multiple Projectiles", "gem_type": "Support", "tags": "Projectile, Support", "description": "Adds 5 additional projectiles with minimal damage penalty."},
    {"name": "Increased Critical Strikes", "gem_type": "Support", "tags": "Critical, Support", "description": "Grants flat base critical strike chance and multiplier."},
    {"name": "Critical Strike Damage", "gem_type": "Support", "tags": "Critical, Support", "description": "Grants high critical strike multiplier."},
    {"name": "Inspiration Support", "gem_type": "Support", "tags": "Critical, Mana, Support", "description": "Reduces mana cost and grants critical strike chance and damage."}
]

def init_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Create tables
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS uniques (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE,
        base_type TEXT,
        item_type TEXT,
        stats TEXT,
        req_level INTEGER,
        tags TEXT
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS skill_gems (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE,
        gem_type TEXT,
        tags TEXT,
        description TEXT,
        base_dps_multiplier REAL DEFAULT 1.0
    )
    """)

    # Populate uniques
    for item in POPULAR_UNIQUES:
        cursor.execute("""
        INSERT OR REPLACE INTO uniques (name, base_type, item_type, stats, req_level, tags)
        VALUES (?, ?, ?, ?, ?, ?)
        """, (item["name"], item["base_type"], item["item_type"], item["stats"], item["req_level"], item["tags"]))

    # Populate gems
    for gem in POPULAR_GEMS:
        cursor.execute("""
        INSERT OR REPLACE INTO skill_gems (name, gem_type, tags, description)
        VALUES (?, ?, ?, ?)
        """, (gem["name"], gem["gem_type"], gem["tags"], gem["description"]))

    conn.commit()
    conn.close()
    print(f"[+] SQLite Database initialized at {DB_PATH}")

if __name__ == "__main__":
    init_db()
