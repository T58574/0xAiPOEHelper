# 0xAiPOEHelper - AI Assistant Workspace Context (`gemini.md`)

Welcome to **0xAiPOEHelper**. This document provides persistent context and repository structure for AI assistants. Read this file at the start of every session to immediately understand the project state, user preferences, current active build, and available tools.

---

## 1. Project Overview & Architecture

`0xAiPOEHelper` is an advanced Path of Exile (PoE) 3.29 theorycrafting, build analyzer, and simulation suite designed to run locally with headless Path of Building integration.

### Core Modules
- **`pob_bridge/`**: Path of Building Community Portable (v2.65.0) headless Python bridge (`pob_headless.py`). Decodes `pobb.in`, `pastebin`, raw XML, base64 strings.
- **`analyzer/`**: Automated build diagnostic engine checking resist caps, spell suppression, EHP, hit chance, and crit variance.
- **`simulator/`**: Hypothesis simulation engine evaluating "What-If" item, gem, node, and configuration swaps with exact DPS/EHP deltas.
- **`database/`**: SQLite database (`database/poe_items.db`) containing uniques, gems, and base items.
- **`329patch/`**: Contains PoE 3.29 gem data (`gems.md`) and patch analysis (`gems_analysis.md`).
- **`archive/`**: Contains archived web UI (`web/`), Node.js backend (`server/`), and Go microservice (`go_server/`). Deprecated per user request; work is conducted directly in chat & Python CLI tools.

---

## 2. Active Build for PoE 3.29 CotA League Start

- **Build Name**: **[3.29] MasterT's Physical Soulwrest Necromancer**
- **Class / Ascendancy**: Witch -> Necromancer (Catarina Bloodline)
- **Archetype**: Minion League Starter / Beyblade Cyclone CWC / Chaos Inoculation (CI)
- **Primary PoB Link**: [https://pobb.in/8ggfuWXTU3wi](https://pobb.in/8ggfuWXTU3wi)
- **Detailed Documentation Path**: [builds/NecroMaster Phys Soulwrest/](file:///c:/Users/user/Documents/projects/0xAiPOEHelper/builds/NecroMaster%20Phys%20Soulwrest/)

### Key Mechanics Summary
1. **22 Phantasms Tech**: Staff inherent level 25 `Summon Phantasm` (11 limit) stacks with socketed level 21 `Summon Phantasm Support` gem (11 limit) for a total of **22 Phantasms**.
2. **Dual Soulwrest X-Swap**:
   - **Mainhand (Single Target)**: `Summon Phantasm` + `Minion Damage` + `Fresh Meat` + `Predator` + `Brutality` + `Increased Critical Strikes`
   - **Weapon Swap (Clear)**: `Summon Phantasm` + `Minion Damage` + `Fresh Meat` + `Greater Multiple Projectiles` + `Faster Projectiles` + `Annihilation Support` (Screen-wide crit explosions!)
   - *Press 'X' to swap instantly without despawning phantasms!*
3. **Defensive Engine**:
   - **Chaos Inoculation (CI)**: Immunity to Chaos Damage.
   - **9,182 ES / 26,344 Armour / 73% Block / 295K EHP / 319% MS**.
   - **Immortal Minions & ES Recovery**: 45% instant life recovery on minion death/desecrate (`Life from Death` + Minion Defence Mastery) converts to instant Energy Shield recovery via `Ghost Reaver` + `Bone Barrier`.
   - **Bonemeld Amulet**: Grants +116% global defenses in endgame.
4. **Immortal Spectres & Animate Guardian**:
   - Minions do not die due to 45% instant recovery.
   - **Campaign Spectres**: Carnage Chieftain (Frenzy) + Warcaller (Onslaught).
   - **Early Mapping Spectres**: 2x Demon Harpies (50% phys damage taken debuff) + 1x Pale Seraphim (15% damage taken / 15% slow). Desecrate pool sharing via **`/global 6666`**.
   - **Endgame Spectres**: Perfect Blood Demon (Pride), Perfect Forest Warrior (Onslaught + Culling), Perfect Pain Artist (Zealotry), Spectral Leader (20% Action Speed).
   - **Endgame Animate Guardian**: Kingmaker + Garb of the Ephemeral + Leer Cast + Surgebinders + Windscream.

### Map Dangerous Modifiers Regex
```regex
!f ph|s rec|ur$|efe|reg|rch$
```

---

## 3. Directory Layout & Build Guides Index

```
0xAiPOEHelper/
├── gemini.md                          <- AI persistent workspace context (this file)
├── PROJECT_NOTES.md                   <- Historical user preferences & theorycrafting notes
├── README_LAUNCH.md                   <- Launch guide for web/server components
├── run_app.bat / run_tests.bat        <- Quick scripts to start server/tests
├── mcp_server.py                      <- MCP tool server for IDE integration
├── pob_bridge/                        <- Headless PoB v2.65.0 bridge
│   ├── pob_headless.py
│   └── pob_portable/
├── builds/
│   ├── NecroMaster Phys Soulwrest/    <- [3.29 ACTIVE] MasterT's Physical Soulwrest Necromancer
│   │   ├── README.md                  <- Main overview, patch notes & stats
│   │   ├── leveling_and_progression.md<- Acts 1-10 leveling guide & gem links
│   │   ├── items_and_crafting.md      <- Gear progression (5 stages), AG gear & ring crafting
│   │   ├── skills_and_spectres.md     <- Complete gem links, dual swap tech & spectres guide
│   │   └── faq_and_mechanics.md       <- Deep mechanical breakdown & troubleshooting
│   └── Kb build/                      <- Kinetic Blast / Kinetic Fusillade Wander guide
├── 329patch/                          <- PoE 3.29 Patch Gem analysis files
└── database/                          <- SQLite item database (poe_items.db)
```

---

## 4. Operational Commands Cheat Sheet

- **Run Web & Backend App**:
  ```powershell
  .\run_app.bat
  ```
- **Run Full System Tests**:
  ```powershell
  .\run_tests.bat
  ```
- **Test PoB Import & Analysis in Python**:
  ```powershell
  python inspect_user_build.py
  ```
- **Launch MCP Server**:
  ```powershell
  python mcp_server.py
  ```

---

## 5. Theorycrafting Rules & Hard Lessons

1. **`Marylene's Fallacy`**: Imposes `40% LESS Crit Chance`. Never use unless base crit chance is 90%+.
2. **`Voidforge`**: Multiplies flat physical damage to attacks by 700% as extra elemental damage. Best paired with `Herald of Purity` and flat phys on rings/jewels.
3. **`Soulwrest Double Cap Tech`**: Always socket a level 21 `Summon Phantasm Support` into Soulwrest to double the max phantasm cap from 11 to 22.
4. **`AG Gear Preservation`**: AG gear is permanently bound to the guardian until replaced or overwritten. Never unequip or remove the gem in dangerous hideout/map state.

---

## 6. AI Lessons Learned & Theorycrafting Gotchas (ALWAYS CHECK AT STARTUP)

1. **`Essence / Craft Modifiers Checklist`**: Always inspect explicit essence/corrupt modifiers before suggesting item replacements. (e.g. `Socketed Gems deal 30% More Elemental Damage` Essence of Horror suffix on a 4L `Archdemon Crown` turns a 4-link into a pseudo 6-link; do NOT replace it with a generic 6L body armour!).
2. **`Budget & Base Damage Realities`**: Never recommend expensive transfigured gems (e.g. 80c `Penance Brand of Dissipation`) if the user has a tight budget (e.g. 79c total). Standard gems often have massive flat physical hit damage (4,400–6,600 flat phys on L20 `Penance Brand`), creating colossal Ignite hits!
3. **`Reservation Efficiency`**: Always check current aura/herald reservations (`Herald of Ash` + `Herald of Purity`) before suggesting adding extra high-reservation auras (`Malevolence`).
4. **`Brand Acceleration Synergy`**: Energy stacking on standard Penance Brand is doubled by allocating **`Runebinder`** (attaches 2 brands to 1 boss) paired with **`Swiftbrand Support`** (~50% activation frequency boost).

