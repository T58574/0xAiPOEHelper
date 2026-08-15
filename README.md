# 🔮 0xAiPOEHelper — Headless Path of Building Simulator & Build Diagnostics Suite

<div align="center">

[![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)
[![Lua](https://img.shields.io/badge/Engine-Lua_5.1%20%2F%20PoB-000080?style=flat-square&logo=lua&logoColor=white)](https://www.lua.org/)
[![Path of Building](https://img.shields.io/badge/Bridge-PoB_Community_Portable-purple?style=flat-square)](https://pathofbuilding.community/)
[![SQLite](https://img.shields.io/badge/Database-SQLite_3-003B57?style=flat-square&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

**An advanced Path of Exile theorycrafting suite, automated build diagnostic analyzer, and headless Path of Building simulation bridge calculating DPS and EHP deltas on-the-fly.**

[Key Features](#-key-features) • [Architecture](#-architecture) • [Headless Bridge](#-headless-pob-bridge) • [Quick Start](#-quick-start) • [License](#-license)

</div>

---

## 📖 Overview

**0xAiPOEHelper** is an automated build diagnostic and simulation toolkit designed for serious Path of Exile theorycrafters. By interfacing directly with a portable, headless instance of **Path of Building Community**, it computes exact damage calculations, effective health pools (EHP), and defensive thresholds directly via Python and CLI scripts without requiring the graphical PoB interface to be open.

The suite includes an automated build health auditor, a "What-If" item and gem swap simulator, an internal SQLite unique item database, and an integrated trade market CLI.

---

## ✨ Key Features

- ⚡ **Headless Path of Building (PoB) Bridge**
  - Direct IPC execution with PoB's Lua calculation engine (`pob_headless.py`), calculating full DPS, average hit, mana sustain, and EHP numbers in sub-second runtimes.
- 🩺 **Automated Build Health Diagnostic Analyzer**
  - Instant checks for elemental and chaos resistance caps, 100% spell suppression validation, critical strike chance consistency, accuracy caps, and attribute requirements.
- 🔄 **"What-If" Item & Gem Swap Simulator**
  - Evaluates prospective gear upgrades, passive tree node adjustments, or alternate support gem setups by generating precise comparative deltas ($\Delta\text{DPS}$, $\Delta\text{EHP}$).
- 🗄️ **Integrated SQLite Unique Item & Gem Database**
  - Offline local database (`poe_items.db`) populated with unique item mod ranges, base items, and gem quality multipliers.
- 🛒 **Official Trade Search CLI (`poe_trade_cli.py`)**
  - Directly queries Path of Exile trade APIs with structured item filters and currency price normalization.

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                   0xAiPOEHelper Python CLI / MCP                 │
└─────────────────────────────────┬────────────────────────────────┘
                                  │ Python / Lua Subprocess Bridge
┌─────────────────────────────────▼────────────────────────────────┐
│            Headless Path of Building Community Engine            │
│                                                                  │
│  ┌────────────────────────┐  ┌────────────────────────────────┐  │
│  │ PoB XML Tree Parser    │  │ Calcs.lua Damage Engine        │  │
│  └────────────────────────┘  └────────────────────────────────┘  │
│  ┌────────────────────────┐  ┌────────────────────────────────┐  │
│  │ Build Diagnostic Suite │  │ "What-If" Swap Simulator       │  │
│  └────────────────────────┘  └────────────────────────────────┘  │
└─────────────────────────────────┬────────────────────────────────┘
                                  │ Local DB & PoE Trade API
┌─────────────────────────────────▼────────────────────────────────┐
│         SQLite Item Database (poe_items.db) • PoE Trade API      │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### 1. Installation
```bash
git clone https://github.com/T58574/0xAiPOEHelper.git
cd 0xAiPOEHelper
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Inspect a Build from PoB Code
```bash
python inspect_user_build.py --pob "https://pobb.in/8ggfuWXTU3wi"
```

### 3. Run Automated Diagnostic Suite
```bash
python test_all.py
```

---

## 📜 License

Distributed under the **MIT License**. See [LICENSE](LICENSE) for details.
