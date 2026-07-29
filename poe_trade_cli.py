#!/usr/bin/env python
"""
poe_trade_cli.py - Interactive Python CLI for PoB Integration & PoE Trade Price/Quality Search
"""

import sys
import os
import argparse
import json

# Ensure pob_bridge directory is in python path
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), "pob_bridge"))
from trade_engine import (
    DEFAULT_LEAGUE,
    SLOT_TYPE_MAP,
    build_trade_query_json,
    generate_trade_web_url,
    fetch_trade_results,
    calculate_price_quality_score
)
from pob_headless import fetch_pob_from_url, decode_pob_code


def cmd_generate_link(args):
    """
    Generates a direct clickable official PoE Trade URL with a real GGG search ID.
    """
    query = build_trade_query_json(
        slot=args.slot,
        min_life=args.life,
        min_ele_res=args.ele_res,
        min_chaos_res=args.chaos_res,
        min_fire_dot_multi=args.fire_dot,
        max_price_chaos=args.max_price,
        min_links=args.links
    )
    url = generate_trade_web_url(query, league=args.league)
    print("\n" + "="*70)
    print(f"Generated Official GGG PoE Trade Link ({args.league} League):")
    print("="*70)
    print(f"{url}")
    print("="*70 + "\n")
    return url


def cmd_search(args):
    """
    Executes live PoE trade search API call, fetches items, calculates price-to-quality ratio,
    and displays top recommendations.
    """
    query = build_trade_query_json(
        slot=args.slot,
        min_life=args.life,
        min_ele_res=args.ele_res,
        min_chaos_res=args.chaos_res,
        min_fire_dot_multi=args.fire_dot,
        max_price_chaos=args.max_price,
        min_links=args.links
    )

    url = generate_trade_web_url(query, league=args.league)

    print(f"Querying PoE Trade API for slot: [{args.slot or 'Any'}] (Max Price: {args.max_price or 'Any'}c)...")
    res = fetch_trade_results(query, league=args.league, max_results=args.limit, session_id=args.session_id)

    items = res.get("items", [])
    if not items:
        print("\n[!] No live items found directly via public API (or rate limited).")
        print(f"[*] Open trade search link directly in browser:\n{url}\n")
        return

    # Calculate Value Score
    for item in items:
        calculate_price_quality_score(item)

    # Sort items by Value Ratio (price/quality score) descending
    items.sort(key=lambda x: x.get("value_ratio", 0), reverse=True)

    print("\n" + "="*80)
    print(f"TOP {len(items)} VALUE-FOR-MONEY ITEMS (Sorted by Price/Quality Score):")
    print("="*80)
    print(f"{'#':<3} {'Price':<12} {'Score':<8} {'Item Name':<30} {'Seller'}")
    print("-" * 80)

    for idx, item in enumerate(items, 1):
        price_str = f"{item['price_amount']} {item['price_currency']}"
        name_str = item['name'][:28]
        seller = item['seller'][:15]
        score = item['value_ratio']
        print(f"{idx:<3} {price_str:<12} {score:<8} {name_str:<30} {seller}")

    print("="*80)
    print(f"Direct Trade Web Link: {url}")
    print("="*80 + "\n")

    # Save to scratch directory for AI agent inspection
    out_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "scratch")
    os.makedirs(out_dir, exist_ok=True)
    out_file = os.path.join(out_dir, "trade_results.json")
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump({"web_url": url, "items": items}, f, indent=2, ensure_ascii=False)
    print(f"Results saved for AI inspection to: {out_file}")


def cmd_pob_upgrade(args):
    """
    Parses a PoB URL/Code, detects character requirements, and generates tailored trade search queries.
    """
    print(f"Loading PoB from: {args.pob}...")
    try:
        if args.pob.startswith("http"):
            raw = fetch_pob_from_url(args.pob)
        else:
            raw = args.pob
        xml_str = decode_pob_code(raw)
        print("PoB successfully imported!")
    except Exception as e:
        print(f"Failed to parse PoB: {e}")
        return

    # Auto-detect defaults based on slot
    print(f"\nAuto-Generating Trade Search for Slot: [{args.slot}] (Max Price: {args.max_price}c)...")
    query_args = argparse.Namespace(
        slot=args.slot,
        life=args.life or 60,
        ele_res=args.ele_res or 40,
        chaos_res=args.chaos_res or 0,
        fire_dot=args.fire_dot or (10 if args.slot in ["gloves", "amulet", "ring"] else None),
        max_price=args.max_price,
        links=args.links,
        league=args.league,
        limit=10,
        session_id=args.session_id
    )
    cmd_search(query_args)


def main():
    parser = argparse.ArgumentParser(description="0xAiPOEHelper - PoE Trade & PoB Integration Engine")
    subparsers = parser.add_subparsers(dest="command", help="Sub-commands")

    # Command: generate-link
    link_p = subparsers.add_parser("generate-link", help="Generate official PoE Trade search URL")
    link_p.add_argument("--slot", choices=list(SLOT_TYPE_MAP.keys()), help="Gear slot")
    link_p.add_argument("--life", type=int, help="Minimum total life")
    link_p.add_argument("--ele-res", type=int, help="Minimum elemental resistances")
    link_p.add_argument("--chaos-res", type=int, help="Minimum chaos resistance")
    link_p.add_argument("--fire-dot", type=int, help="Minimum Fire DoT Multiplier")
    link_p.add_argument("--max-price", type=int, default=50, help="Maximum price in Chaos Orbs")
    link_p.add_argument("--links", type=int, help="Minimum socket links")
    link_p.add_argument("--league", default=DEFAULT_LEAGUE, help="PoE League name (defaults to Allflame)")

    # Command: search
    search_p = subparsers.add_parser("search", help="Execute live PoE trade search and rank price/quality")
    search_p.add_argument("--slot", choices=list(SLOT_TYPE_MAP.keys()), help="Gear slot")
    search_p.add_argument("--life", type=int, help="Minimum total life")
    search_p.add_argument("--ele-res", type=int, help="Minimum elemental resistances")
    search_p.add_argument("--chaos-res", type=int, help="Minimum chaos resistance")
    search_p.add_argument("--fire-dot", type=int, help="Minimum Fire DoT Multiplier")
    search_p.add_argument("--max-price", type=int, default=50, help="Maximum price in Chaos Orbs")
    search_p.add_argument("--links", type=int, help="Minimum socket links")
    search_p.add_argument("--limit", type=int, default=10, help="Max results to display")
    search_p.add_argument("--league", default=DEFAULT_LEAGUE, help="PoE League name (defaults to Allflame)")
    search_p.add_argument("--session-id", help="Optional POESESSID cookie for authenticated requests")

    # Command: pob-upgrade
    pob_p = subparsers.add_parser("pob-upgrade", help="Parse PoB and find best gear upgrades for slot")
    pob_p.add_argument("--pob", required=True, help="PoB URL (pobb.in) or base64 string")
    pob_p.add_argument("--slot", required=True, choices=list(SLOT_TYPE_MAP.keys()), help="Target gear slot to upgrade")
    pob_p.add_argument("--max-price", type=int, default=50, help="Maximum budget in Chaos Orbs")
    pob_p.add_argument("--life", type=int, help="Override min life requirement")
    pob_p.add_argument("--ele-res", type=int, help="Override min ele res requirement")
    pob_p.add_argument("--chaos-res", type=int, help="Override min chaos res requirement")
    pob_p.add_argument("--fire-dot", type=int, help="Override min Fire DoT Multi requirement")
    pob_p.add_argument("--links", type=int, help="Minimum socket links")
    pob_p.add_argument("--league", default=DEFAULT_LEAGUE, help="PoE League name (defaults to Allflame)")
    pob_p.add_argument("--session-id", help="Optional POESESSID cookie")

    args = parser.parse_args()

    if args.command == "generate-link":
        cmd_generate_link(args)
    elif args.command == "search":
        cmd_search(args)
    elif args.command == "pob-upgrade":
        cmd_pob_upgrade(args)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
