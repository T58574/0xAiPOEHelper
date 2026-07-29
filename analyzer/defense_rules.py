# Defensive Diagnostic Rules for Path of Exile Builds

def analyze_defenses(metrics):
    issues = []
    recommendations = []
    
    fire_res = metrics.get("fireRes", 0)
    cold_res = metrics.get("coldRes", 0)
    lightning_res = metrics.get("lightningRes", 0)
    chaos_res = metrics.get("chaosRes", 0)
    
    # 1. Elemental Resistances Cap Check
    if fire_res < 75:
        issues.append(f"Fire Resistance is uncapped: {fire_res}% / 75%")
        recommendations.append("Craft or swap gear to get +Fire Resistance to reach at least 75%.")
    if cold_res < 75:
        issues.append(f"Cold Resistance is uncapped: {cold_res}% / 75%")
        recommendations.append("Craft or swap gear to get +Cold Resistance to reach at least 75%.")
    if lightning_res < 75:
        issues.append(f"Lightning Resistance is uncapped: {lightning_res}% / 75%")
        recommendations.append("Craft or swap gear to get +Lightning Resistance to reach at least 75%.")
        
    # 2. Chaos Resistance Check
    if chaos_res < 0:
        issues.append(f"CRITICAL: Chaos Resistance is negative ({chaos_res}%). Highly susceptible to chaos one-shots!")
        recommendations.append("Prioritize Amethyst rings or chaos resistance on gear/passives to get Chaos Res > 0% (target 75%).")
    elif chaos_res < 60:
        issues.append(f"Chaos Resistance is low ({chaos_res}%).")
        recommendations.append("Consider raising Chaos Resistance towards 75% for high-tier mapping and pinnacle bosses.")

    # 3. Spell Suppression Check
    suppression = metrics.get("spellSuppression", 0)
    if 0 < suppression < 100:
        issues.append(f"Spell Suppression is not capped ({suppression}%). Uncapped suppression leaves you vulnerable to spell RNG one-shots.")
        recommendations.append("Cap Spell Suppression to 100% using gear suffixes or evasion passives.")
        
    # 4. Physical Max Hit Taken Check
    phys_max_hit = metrics.get("physMaxHit", 0)
    if phys_max_hit > 0 and phys_max_hit < 5000:
        issues.append(f"Physical Max Hit Taken is dangerously low ({phys_max_hit}). Physical slams will one-shot you.")
        recommendations.append("Add Armour, Endurance Charges, Physical Damage Taken as Elemental/Chaos mods, or Taste of Hate flask.")

    # 5. Effective HP Pool Check
    ehp = metrics.get("ehp", 0)
    life = metrics.get("life", 0)
    es = metrics.get("energyShield", 0)
    total_pool = life + es
    
    if total_pool < 3500 and ehp < 25000:
        issues.append(f"Low total EHP pool ({total_pool} Life+ES, {ehp} EHP).")
        recommendations.append("Increase flat Life/ES nodes and flat life rolls on gear.")
        
    return {
        "issues": issues,
        "recommendations": recommendations,
        "score": max(0, 100 - len(issues) * 15)
    }
