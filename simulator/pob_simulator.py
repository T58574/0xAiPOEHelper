import sys
import os
import json

sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "pob_bridge"))
from pob_headless import calculate_pob_stats

def simulate_hypothesis(pob_input, change_type, change_details):
    """
    Simulates a build hypothesis change.
    change_type: 'gem_swap', 'item_swap', 'passive_change', 'config_change'
    change_details: dict with details of modification
    """
    # 1. Base calculation
    base_metrics = calculate_pob_stats(pob_input)
    
    # 2. Modified calculation
    mod_metrics = dict(base_metrics)
    
    if change_type == "gem_swap":
        # Simulate gem upgrade impact (e.g. standard support gem to Awakened support gem)
        old_gem = change_details.get("old_gem", "")
        new_gem = change_details.get("new_gem", "")
        
        # Calculate estimated DPS boost multiplier
        boost = 1.18 if "Awakened" in new_gem else 1.10
        mod_metrics["combinedDPS"] = int(mod_metrics["combinedDPS"] * boost)
        
    elif change_type == "item_swap":
        slot = change_details.get("slot", "Ring")
        stats_added = change_details.get("stats_added", {})
        
        if "dps_percent" in stats_added:
            mod_metrics["combinedDPS"] = int(mod_metrics["combinedDPS"] * (1 + stats_added["dps_percent"] / 100))
        if "fire_res" in stats_added:
            mod_metrics["fireRes"] = min(90, mod_metrics["fireRes"] + stats_added["fire_res"])
        if "cold_res" in stats_added:
            mod_metrics["coldRes"] = min(90, mod_metrics["coldRes"] + stats_added["cold_res"])
        if "lightning_res" in stats_added:
            mod_metrics["lightningRes"] = min(90, mod_metrics["lightningRes"] + stats_added["lightning_res"])
        if "chaos_res" in stats_added:
            mod_metrics["chaosRes"] = min(90, mod_metrics["chaosRes"] + stats_added["chaos_res"])
        if "life" in stats_added:
            mod_metrics["life"] += stats_added["life"]
            mod_metrics["ehp"] += stats_added["life"] * 4
            
    elif change_type == "passive_change":
        nodes_added = change_details.get("nodes_added", 0)
        dps_gain = change_details.get("dps_gain_percent", 5.0)
        mod_metrics["combinedDPS"] = int(mod_metrics["combinedDPS"] * (1 + dps_gain / 100))

    # 3. Calculate Deltas
    dps_diff = mod_metrics["combinedDPS"] - base_metrics["combinedDPS"]
    dps_pct = (dps_diff / base_metrics["combinedDPS"] * 100) if base_metrics["combinedDPS"] > 0 else 0
    
    ehp_diff = mod_metrics["ehp"] - base_metrics["ehp"]
    ehp_pct = (ehp_diff / base_metrics["ehp"] * 100) if base_metrics["ehp"] > 0 else 0

    verdict = "RECOMMENDED" if (dps_diff > 0 or ehp_diff > 0) else "NEUTRAL / NOT RECOMMENDED"

    return {
        "changeType": change_type,
        "details": change_details,
        "before": {
            "combinedDPS": f"{base_metrics['combinedDPS']:,.0f}",
            "ehp": f"{base_metrics['ehp']:,.0f}",
            "fireRes": f"{base_metrics['fireRes']}%",
            "chaosRes": f"{base_metrics['chaosRes']}%"
        },
        "after": {
            "combinedDPS": f"{mod_metrics['combinedDPS']:,.0f}",
            "ehp": f"{mod_metrics['ehp']:,.0f}",
            "fireRes": f"{mod_metrics['fireRes']}%",
            "chaosRes": f"{mod_metrics['chaosRes']}%"
        },
        "delta": {
            "dpsChange": f"{'+' if dps_diff >= 0 else ''}{dps_diff:,.0f} ({'+' if dps_pct >= 0 else ''}{dps_pct:.1f}%)",
            "ehpChange": f"{'+' if ehp_diff >= 0 else ''}{ehp_diff:,.0f} ({'+' if ehp_pct >= 0 else ''}{ehp_pct:.1f}%)"
        },
        "verdict": verdict
    }

if __name__ == "__main__":
    test_xml = "<PathOfBuilding><Build level=\"95\" className=\"Deadeye\"><PlayerStat stat=\"CombinedDPS\" value=\"2000000\"/><PlayerStat stat=\"TotalEHP\" value=\"20000\"/></Build></PathOfBuilding>"
    res = simulate_hypothesis(test_xml, "gem_swap", {"old_gem": "Added Cold Damage", "new_gem": "Awakened Added Cold Damage"})
    print(json.dumps(res, indent=2))
