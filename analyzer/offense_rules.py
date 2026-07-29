# Offensive Diagnostic Rules for Path of Exile Builds

def analyze_offense(metrics):
    issues = []
    recommendations = []
    
    combined_dps = metrics.get("combinedDPS", 0)
    hit_chance = metrics.get("hitChance", 100)
    crit_chance = metrics.get("critChance", 0)
    crit_multi = metrics.get("critMultiplier", 0)
    
    # 1. Accuracy & Hit Chance Check (for attacks)
    if hit_chance > 0 and hit_chance < 100:
        issues.append(f"Hit Chance is not capped ({hit_chance}%). Missing attacks directly reduces your DPS!")
        recommendations.append("Gain flat Accuracy Rating on gloves/rings/helmet or allocate Precision aura / accuracy passives to reach 100% Hit Chance.")

    # 2. Critical Strike Chance Check
    if 30 <= crit_chance < 90 and crit_multi > 300:
        issues.append(f"Critical Strike Chance is uncapped ({crit_chance}% with {crit_multi}% Crit Multiplier). High variance in DPS.")
        recommendations.append("Cap Crit Chance to 100% using Increased Critical Strikes gem, Power Charges, Bottled Faith, or Diamond Flask.")

    # 3. DPS Benchmarks Check
    if combined_dps < 1000000:
        issues.append(f"Combined DPS is low ({combined_dps:,.0f}).")
        recommendations.append("Focus on flat damage rolls, weapon DPS, +1 skill gem levels, or Awakened support gems.")
    elif combined_dps >= 1000000 and combined_dps < 5000000:
        issues.append(f"DPS is moderate ({combined_dps:,.0f}). Good for mapping, but pinnacle bosses will take time.")
        recommendations.append("Consider cluster jewels, crit cap, elemental penetration, or additional curses (e.g. Sniper's Mark).")

    return {
        "issues": issues,
        "recommendations": recommendations,
        "score": min(100, int(combined_dps / 100000))
    }
