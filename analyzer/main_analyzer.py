from defense_rules import analyze_defenses
from offense_rules import analyze_offense
from config_rules import analyze_config

def generate_build_analysis(metrics):
    defense = analyze_defenses(metrics)
    offense = analyze_offense(metrics)
    config = analyze_config(metrics)
    
    all_issues = defense["issues"] + offense["issues"] + config["issues"]
    all_recs = defense["recommendations"] + offense["recommendations"] + config["recommendations"]
    
    summary = {
        "class": f"{metrics.get('ascendClassName', 'Class')} ({metrics.get('className', 'Base')})",
        "level": metrics.get("level", 1),
        "combinedDPS": f"{metrics.get('combinedDPS', 0):,.0f}",
        "ehp": f"{metrics.get('ehp', 0):,.0f}",
        "life": f"{metrics.get('life', 0):,.0f}",
        "energyShield": f"{metrics.get('energyShield', 0):,.0f}",
        "spellSuppression": f"{metrics.get('spellSuppression', 0)}%",
        "resistances": {
            "fire": f"{metrics.get('fireRes', 0)}%",
            "cold": f"{metrics.get('coldRes', 0)}%",
            "lightning": f"{metrics.get('lightningRes', 0)}%",
            "chaos": f"{metrics.get('chaosRes', 0)}%"
        },
        "maxHitTaken": {
            "physical": f"{metrics.get('physMaxHit', 0):,.0f}",
            "fire": f"{metrics.get('fireMaxHit', 0):,.0f}",
            "cold": f"{metrics.get('coldMaxHit', 0):,.0f}",
            "lightning": f"{metrics.get('lightningMaxHit', 0):,.0f}",
            "chaos": f"{metrics.get('chaosMaxHit', 0):,.0f}"
        },
        "bottlenecks": all_issues,
        "recommendations": all_recs
    }
    return summary

if __name__ == "__main__":
    test_metrics = {
        "className": "Deadeye",
        "ascendClassName": "Deadeye",
        "level": 95,
        "combinedDPS": 1850000,
        "ehp": 18000,
        "life": 3200,
        "energyShield": 150,
        "spellSuppression": 85,
        "fireRes": 75,
        "coldRes": 75,
        "lightningRes": 75,
        "chaosRes": -15,
        "physMaxHit": 3200,
        "hitChance": 92,
        "critChance": 65,
        "critMultiplier": 420
    }
    analysis = generate_build_analysis(test_metrics)
    import json
    print(json.dumps(analysis, indent=2))
