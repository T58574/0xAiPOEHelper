import axios from 'axios';
import { getDb, saveDb } from '../db';

export interface CurrencyItem {
  id: string;
  league: string;
  name: string;
  category: string;
  chaosValue: number;
  divineValue?: number;
  icon?: string;
  sparkline?: string;
}

export interface UniqueItem {
  id: string;
  league: string;
  name: string;
  baseType?: string;
  category: string;
  chaosValue: number;
  divineValue?: number;
  icon?: string;
  links: number;
  sparkline?: string;
}

const LEAGUE_PREFERENCES = ['3.29', 'Mirage', 'Standard'];

export async function fetchActiveLeague(): Promise<string> {
  for (const league of LEAGUE_PREFERENCES) {
    try {
      const res = await axios.get(
        `https://poe.ninja/api/data/currencyoverview?league=${encodeURIComponent(league)}&type=Currency`,
        { timeout: 4000 }
      );
      if (res.data && res.data.lines && res.data.lines.length > 0) {
        return league;
      }
    } catch {
      // Continue to next fallback league
    }
  }
  return 'Standard';
}

export async function syncPoeNinjaCurrency(league?: string): Promise<CurrencyItem[]> {
  const activeLeague = league || (await fetchActiveLeague());
  const categories = ['Currency', 'Fragment', 'Scarab', 'Essence', 'Resonator'];
  const results: CurrencyItem[] = [];

  let divineChaosVal = 160.0;

  for (const category of categories) {
    try {
      const url = `https://poe.ninja/api/data/currencyoverview?league=${encodeURIComponent(activeLeague)}&type=${category}`;
      const res = await axios.get(url, { timeout: 6000 });
      if (!res.data || !res.data.lines) continue;

      const currencyDetailsMap = new Map<string, any>();
      if (res.data.currencyDetails) {
        for (const cd of res.data.currencyDetails) {
          currencyDetailsMap.set(cd.name, cd);
        }
      }

      for (const item of res.data.lines) {
        const name = item.currencyTypeName;
        const chaosVal = item.chaosEquivalent || 0;
        if (name === 'Divine Orb' && chaosVal > 0) {
          divineChaosVal = chaosVal;
        }

        const details = currencyDetailsMap.get(name);
        const icon = details ? details.icon : undefined;
        const sparkline = item.receiveSparkLine ? JSON.stringify(item.receiveSparkLine.data) : undefined;

        results.push({
          id: `${activeLeague}_${name}`,
          league: activeLeague,
          name,
          category,
          chaosValue: chaosVal,
          divineValue: chaosVal / divineChaosVal,
          icon,
          sparkline,
        });
      }
    } catch (err) {
      console.warn(`[poeNinja] Failed syncing category ${category}:`, (err as Error).message);
    }
  }

  const db = await getDb();
  for (const item of results) {
    db.run(
      `INSERT OR REPLACE INTO currency_prices (id, league, name, category, chaos_value, divine_value, icon, sparkline, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [
        item.id,
        item.league,
        item.name,
        item.category,
        item.chaosValue,
        item.divineValue || 0,
        item.icon || null,
        item.sparkline || null,
      ]
    );
  }
  saveDb();

  return results;
}

export async function syncPoeNinjaUniques(league?: string): Promise<UniqueItem[]> {
  const activeLeague = league || (await fetchActiveLeague());
  const categories = ['UniqueArmour', 'UniqueWeapon', 'UniqueAccessory', 'UniqueJewel', 'SkillGem'];
  const results: UniqueItem[] = [];

  for (const category of categories) {
    try {
      const url = `https://poe.ninja/api/data/itemoverview?league=${encodeURIComponent(activeLeague)}&type=${category}`;
      const res = await axios.get(url, { timeout: 6000 });
      if (!res.data || !res.data.lines) continue;

      for (const item of res.data.lines) {
        const name = item.name;
        const chaosVal = item.chaosValue || 0;
        const divineVal = item.divineValue || 0;

        results.push({
          id: `${activeLeague}_${category}_${name}_${item.links || 0}`,
          league: activeLeague,
          name,
          baseType: item.baseType,
          category,
          chaosValue: chaosVal,
          divineValue: divineVal,
          icon: item.icon,
          links: item.links || 0,
          sparkline: item.sparkline ? JSON.stringify(item.sparkline.data) : undefined,
        });
      }
    } catch (err) {
      console.warn(`[poeNinja] Failed syncing uniques category ${category}:`, (err as Error).message);
    }
  }

  const db = await getDb();
  for (const item of results) {
    db.run(
      `INSERT OR REPLACE INTO unique_prices (id, league, name, base_type, category, chaos_value, divine_value, icon, links, sparkline, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [
        item.id,
        item.league,
        item.name,
        item.baseType || null,
        item.category,
        item.chaosValue,
        item.divineValue || 0,
        item.icon || null,
        item.links,
        item.sparkline || null,
      ]
    );
  }
  saveDb();

  return results;
}

export async function getCachedCurrencies(category?: string): Promise<any[]> {
  const db = await getDb();
  let query = 'SELECT * FROM currency_prices';
  const params: any[] = [];
  if (category) {
    query += ' WHERE category = ?';
    params.push(category);
  }
  query += ' ORDER BY chaos_value DESC';
  
  const stmt = db.prepare(query);
  if (params.length > 0) stmt.bind(params);
  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

export async function getCachedUniques(keyword?: string): Promise<any[]> {
  const db = await getDb();
  let query = 'SELECT * FROM unique_prices';
  const params: any[] = [];
  if (keyword) {
    query += ' WHERE name LIKE ? OR base_type LIKE ?';
    params.push(`%${keyword}%`, `%${keyword}%`);
  }
  query += ' ORDER BY chaos_value DESC LIMIT 50';

  const stmt = db.prepare(query);
  if (params.length > 0) stmt.bind(params);
  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}
