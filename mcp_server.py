import sys
import os
import json
import asyncio

# Ensure paths
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), "pob_bridge"))
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), "database"))
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), "analyzer"))
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), "simulator"))

from pob_headless import calculate_pob_stats
from main_analyzer import generate_build_analysis
from pob_simulator import simulate_hypothesis
from db_query import query_uniques, query_gems
from build_db import init_db

from mcp.server.fastmcp import FastMCP

# Initialize FastMCP Server
mcp = FastMCP("0xAiPOEHelper-PoB-Server")

# Ensure database initialized on startup
init_db()

@mcp.tool()
def pob_import_build(pob_input: str) -> str:
    """
    Imports a Path of Building build from pastebin/pobbin URL or base64/XML string.
    Returns the core metrics (DPS, EHP, life, resists, caps).
    """
    try:
        metrics = calculate_pob_stats(pob_input)
        return json.dumps(metrics, indent=2)
    except Exception as e:
        return json.dumps({"error": str(e)})

@mcp.tool()
def pob_get_analysis(pob_input: str) -> str:
    """
    Analyzes a PoB build for defensive/offensive bottlenecks, uncapped resists, low EHP, and provides optimization recommendations.
    """
    try:
        metrics = calculate_pob_stats(pob_input)
        analysis = generate_build_analysis(metrics)
        return json.dumps(analysis, indent=2)
    except Exception as e:
        return json.dumps({"error": str(e)})

@mcp.tool()
def pob_simulate(pob_input: str, change_type: str, change_details_json: str) -> str:
    """
    Simulates a 'What-If' build hypothesis (e.g. gem_swap, item_swap, passive_change).
    change_type: 'gem_swap', 'item_swap', or 'passive_change'
    change_details_json: JSON string with change details (e.g. '{"old_gem": "Added Cold", "new_gem": "Awakened Added Cold"}')
    """
    try:
        details = json.loads(change_details_json) if isinstance(change_details_json, str) else change_details_json
        result = simulate_hypothesis(pob_input, change_type, details)
        return json.dumps(result, indent=2)
    except Exception as e:
        return json.dumps({"error": str(e)})

@mcp.tool()
def pob_query_items(keyword: str = "", item_type: str = "", tags: str = "") -> str:
    """
    Queries local SQLite database for unique items, jewels, and gems matching keywords or tags.
    """
    try:
        uniques = query_uniques(keyword=keyword, item_type=item_type, tags=tags, limit=10)
        gems = query_gems(keyword=keyword, limit=10)
        return json.dumps({"uniques": uniques, "gems": gems}, indent=2)
    except Exception as e:
        return json.dumps({"error": str(e)})

if __name__ == "__main__":
    mcp.run()
