import os
import sqlite3
import json

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "poe_items.db")

def query_uniques(keyword=None, item_type=None, tags=None, limit=10):
    if not os.path.exists(DB_PATH):
        return []
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    query = "SELECT name, base_type, item_type, stats, req_level, tags FROM uniques WHERE 1=1"
    params = []
    
    if keyword:
        query += " AND (name LIKE ? OR stats LIKE ? OR base_type LIKE ?)"
        pattern = f"%{keyword}%"
        params.extend([pattern, pattern, pattern])
        
    if item_type:
        query += " AND item_type LIKE ?"
        params.append(f"%{item_type}%")
        
    if tags:
        query += " AND tags LIKE ?"
        params.append(f"%{tags}%")
        
    query += " LIMIT ?"
    params.append(limit)
    
    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()
    
    results = []
    for r in rows:
        results.append({
            "name": r[0],
            "base_type": r[1],
            "item_type": r[2],
            "stats": r[3].split("\n") if r[3] else [],
            "req_level": r[4],
            "tags": r[5]
        })
    return results

def query_gems(keyword=None, gem_type=None, limit=10):
    if not os.path.exists(DB_PATH):
        return []
        
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    query = "SELECT name, gem_type, tags, description FROM skill_gems WHERE 1=1"
    params = []
    
    if keyword:
        query += " AND (name LIKE ? OR tags LIKE ? OR description LIKE ?)"
        pattern = f"%{keyword}%"
        params.extend([pattern, pattern, pattern])
        
    if gem_type:
        query += " AND gem_type LIKE ?"
        params.append(f"%{gem_type}%")
        
    query += " LIMIT ?"
    params.append(limit)
    
    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()
    
    results = []
    for r in rows:
        results.append({
            "name": r[0],
            "gem_type": r[1],
            "tags": r[2],
            "description": r[3]
        })
    return results

if __name__ == "__main__":
    from build_db import init_db
    init_db()
    print("Testing unique query 'Kinetic':", query_uniques(keyword="Kinetic"))
    print("Testing gem query 'Awakened':", query_gems(keyword="Awakened"))
