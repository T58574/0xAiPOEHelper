# Project Notes & Memory Summary (0xAiPOEHelper)

This document serves as a persistent summary for future AI assistant sessions.

---

## User Profile & Preferences

- **Playstyle**: High-speed mapping with **Headhunter (HH)** or high-clearing Beyblade/Minion setups, Ranged / Non-melee playstyle, screen-wide clear, full positional control.
- **Dislikes**: Melee wind-up/vulnerability, uncontrollable movement skills (e.g., Flicker Strike).
- **Environment**: Standard league & League 3.29 (CotA).
- **Current Active League Starter (3.29)**: **[3.29] MasterT's Physical Soulwrest Necromancer** (CI, 22 Phantasms, dual Soulwrest X-swap, screen-wide Annihilation explosions, immortal spectres/AG).
- **Favorite Past Builds**: Kinetic Fusillade Totems, Kinetic Blast Wanders, Physical Soulwrest Necromancer.

---

## Active Build Guide Reference

- **Build Name**: MasterT's Physical Soulwrest Necromancer (PoE 3.29 CotA)
- **Primary PoB**: [https://pobb.in/8ggfuWXTU3wi](https://pobb.in/8ggfuWXTU3wi)
- **Documentation Directory**: [builds/NecroMaster Phys Soulwrest/](file:///c:/Users/user/Documents/projects/0xAiPOEHelper/builds/NecroMaster%20Phys%20Soulwrest/)
  - [README.md](file:///c:/Users/user/Documents/projects/0xAiPOEHelper/builds/NecroMaster%20Phys%20Soulwrest/README.md) - Master Overview & Patch Changes
  - [leveling_and_progression.md](file:///c:/Users/user/Documents/projects/0xAiPOEHelper/builds/NecroMaster%20Phys%20Soulwrest/leveling_and_progression.md) - Acts 1-10 leveling guide
  - [items_and_crafting.md](file:///c:/Users/user/Documents/projects/0xAiPOEHelper/builds/NecroMaster%20Phys%20Soulwrest/items_and_crafting.md) - Gear progression & AG setup
  - [skills_and_spectres.md](file:///c:/Users/user/Documents/projects/0xAiPOEHelper/builds/NecroMaster%20Phys%20Soulwrest/skills_and_spectres.md) - Gem setups & Spectres guide
  - [faq_and_mechanics.md](file:///c:/Users/user/Documents/projects/0xAiPOEHelper/builds/NecroMaster%20Phys%20Soulwrest/faq_and_mechanics.md) - Mechanics & FAQ

---

## Technical Infrastructure Built

1. **PoB Headless Bridge (`pob_bridge/`)**:
   - Path of Building Community Portable v2.65.0 installed.
   - `pob_headless.py` decodes `pobb.in`, `pastebin`, raw XML, base64 strings.
2. **SQLite Item DB (`database/`)**:
   - `poe_items.db` containing uniques, gems, and base items with fast SQL querying.
3. **Bottleneck & Diagnostic Analyzer (`analyzer/`)**:
   - Checks resist caps, chaos res, spell suppression, EHP, hit chance, crit chance/multi variance.
4. **Hypothesis Simulation Engine (`simulator/`)**:
   - Evaluates "What-If" item, gem, node, and config swaps with exact stat deltas (+% DPS, +EHP).
5. **MCP Server (`mcp_server.py`)**:
   - Exposes tools (`pob_import_build`, `pob_get_analysis`, `pob_simulate`, `pob_query_items`) to Antigravity IDE.

---

## Important Theorycrafting Lessons Learned

1. **`Soulwrest 22-Phantasm Limit`**: Socketing a Lvl 21 `Summon Phantasm Support` into Soulwrest combines inherent Lvl 25 staff limit (11) and gem limit (11) for 22 Phantasms.
2. **`Marylene's Fallacy`**: Imposes `40% LESS Crit Chance`. Never use unless base crit chance is 90%+.
3. **`Voidforge`**: Multiplies flat physical damage to attacks by 700% as extra elemental damage. Best paired with `Herald of Purity` and flat phys on rings/jewels.
4. **Bossing with Headhunter**: HH provides 0 buffs on boss arenas without rare mobs. Swap to `Ryslatha's Coil`, `Mageblood`, or `Stygian Vise` for pinnacle boss fights like Exarch.
