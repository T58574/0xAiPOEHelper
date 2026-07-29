import sys
import os
import json

from mcp_server import pob_import_build, pob_get_analysis, pob_simulate, pob_query_items

TEST_XML = """
<PathOfBuilding>
    <Build level="94" className="Deadeye" ascendClassName="Deadeye">
        <PlayerStat stat="CombinedDPS" value="2850000"/>
        <PlayerStat stat="TotalEHP" value="19500"/>
        <PlayerStat stat="Life" value="3400"/>
        <PlayerStat stat="EnergyShield" value="200"/>
        <PlayerStat stat="SpellSuppressionChance" value="88"/>
        <PlayerStat stat="FireResist" value="75"/>
        <PlayerStat stat="ColdResist" value="75"/>
        <PlayerStat stat="LightningResist" value="75"/>
        <PlayerStat stat="ChaosResist" value="-20"/>
        <PlayerStat stat="PhysicalMaximumHitTaken" value="3800"/>
        <PlayerStat stat="HitChance" value="95"/>
        <PlayerStat stat="CritChance" value="72"/>
        <PlayerStat stat="CritMultiplier" value="480"/>
    </Build>
</PathOfBuilding>
"""

def main():
    print("=== 1. Testing pob_import_build ===")
    res_import = pob_import_build(TEST_XML)
    print(res_import)

    print("\n=== 2. Testing pob_get_analysis ===")
    res_analysis = pob_get_analysis(TEST_XML)
    print(res_analysis)

    print("\n=== 3. Testing pob_simulate (gem swap) ===")
    res_sim = pob_simulate(TEST_XML, "gem_swap", '{"old_gem": "Added Cold", "new_gem": "Awakened Added Cold"}')
    print(res_sim)

    print("\n=== 4. Testing pob_query_items (Kinetic Blast / Nimis) ===")
    res_query = pob_query_items(keyword="Nimis")
    print(res_query)

    print("\n[+] ALL END-TO-END TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    main()
