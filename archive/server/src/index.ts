import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {
  syncPoeNinjaCurrency,
  syncPoeNinjaUniques,
  getCachedCurrencies,
  getCachedUniques,
  fetchActiveLeague,
} from './services/poeNinja';
import { decodePoBInput } from './services/pobDecoder';
import { searchPatchNotes } from './services/patchNotes';
import { searchPoEWiki } from './services/poeWiki';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 1. Get active league status
app.get('/api/league', async (req, res) => {
  try {
    const activeLeague = await fetchActiveLeague();
    res.json({
      activeLeague,
      supportedLeagues: ['3.29', 'Mirage', 'Standard'],
      status: activeLeague === '3.29' ? '3.29 League Live!' : `Pre-3.29 Patch Mode (Active: ${activeLeague})`,
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// 2. Market Currencies & Scarabs
app.get('/api/market/currency', async (req, res) => {
  try {
    const category = req.query.category as string | undefined;
    let data = await getCachedCurrencies(category);
    if (data.length === 0) {
      await syncPoeNinjaCurrency();
      data = await getCachedCurrencies(category);
    }
    res.json({ currencies: data });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// 3. Market Uniques
app.get('/api/market/uniques', async (req, res) => {
  try {
    const keyword = req.query.q as string | undefined;
    let data = await getCachedUniques(keyword);
    if (data.length === 0) {
      await syncPoeNinjaUniques();
      data = await getCachedUniques(keyword);
    }
    res.json({ uniques: data });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// 4. Force Trigger Live Sync
app.post('/api/market/sync', async (req, res) => {
  try {
    const league = req.body.league;
    const currencies = await syncPoeNinjaCurrency(league);
    const uniques = await syncPoeNinjaUniques(league);
    res.json({ message: 'Sync successful', currencyCount: currencies.length, uniqueCount: uniques.length });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// 5. PoB Decode & Stat Calculation
app.post('/api/pob/decode', async (req, res) => {
  try {
    const { pobInput } = req.body;
    if (!pobInput) {
      return res.status(400).json({ error: 'pobInput is required' });
    }
    const metrics = await decodePoBInput(pobInput);
    res.json({ metrics });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// 6. Patch 3.29 Notes & Gems
app.get('/api/patch-notes', (req, res) => {
  try {
    const q = req.query.q as string | undefined;
    const notes = searchPatchNotes(q || '');
    res.json({ notes });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// 7. Wiki Search
app.get('/api/wiki', async (req, res) => {
  try {
    const q = req.query.q as string;
    if (!q) return res.status(400).json({ error: 'Query param q is required' });
    const wikiData = await searchPoEWiki(q);
    res.json({ results: wikiData });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.listen(PORT, () => {
  console.log(`[0xAiPOEHelper Backend] REST Server running on http://localhost:${PORT}`);
});
