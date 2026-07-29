import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

import { syncPoeNinjaCurrency, syncPoeNinjaUniques, getCachedCurrencies, getCachedUniques, fetchActiveLeague } from '../services/poeNinja';
import { searchPoEWiki } from '../services/poeWiki';
import { decodePoBInput } from '../services/pobDecoder';
import { searchPatchNotes } from '../services/patchNotes';

const server = new Server(
  {
    name: 'poe1-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Register available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'poe_ninja_price',
        description: 'Query live and cached market prices (currency, uniques, scarabs, gems) for Path of Exile 1 (League 3.29 / Mirage / Standard).',
        inputSchema: {
          type: 'object',
          properties: {
            item_name: { type: 'string', description: 'Name of item or currency (e.g. "Divine Orb", "Mageblood")' },
            category: { type: 'string', description: 'Category filter (Currency, Scarab, Essence, UniqueArmour, UniqueWeapon)' },
            league: { type: 'string', description: 'Target league (3.29, Mirage, Standard)' },
          },
        },
      },
      {
        name: 'poe_wiki_lookup',
        description: 'Query official PoE Wiki for gem scaling, base items, and mechanics.',
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Search term for wiki' },
          },
          required: ['query'],
        },
      },
      {
        name: 'poe_pob_import',
        description: 'Imports and decodes a Path of Building (PoB) build link (pobb.in / pastebin) and returns calculated DPS, EHP, life, resists.',
        inputSchema: {
          type: 'object',
          properties: {
            pob_input: { type: 'string', description: 'PoB URL (pobb.in/XYZ) or raw base64 string' },
          },
          required: ['pob_input'],
        },
      },
      {
        name: 'poe_patch_notes',
        description: 'Searches local 3.29 patch notes (gems changes, buffs, nerfs, reworks).',
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Gem name or keyword (e.g. "Spark", "buff")' },
          },
        },
      },
    ],
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === 'poe_ninja_price') {
      const itemName = (args?.item_name as string) || '';
      const category = (args?.category as string) || '';
      const league = (args?.league as string) || (await fetchActiveLeague());

      // Attempt live sync first if database is empty
      let currencies = await getCachedCurrencies(category);
      if (currencies.length === 0) {
        await syncPoeNinjaCurrency(league);
        currencies = await getCachedCurrencies(category);
      }

      let uniques = await getCachedUniques(itemName);
      if (uniques.length === 0) {
        await syncPoeNinjaUniques(league);
        uniques = await getCachedUniques(itemName);
      }

      if (itemName) {
        const filteredCurr = currencies.filter((c: any) => c.name.toLowerCase().includes(itemName.toLowerCase()));
        return {
          content: [{ type: 'text', text: JSON.stringify({ league, currencies: filteredCurr, uniques }, null, 2) }],
        };
      }

      return {
        content: [{ type: 'text', text: JSON.stringify({ league, currencies: currencies.slice(0, 25), uniques: uniques.slice(0, 25) }, null, 2) }],
      };
    }

    if (name === 'poe_wiki_lookup') {
      const query = (args?.query as string) || '';
      const wikiResults = await searchPoEWiki(query);
      return {
        content: [{ type: 'text', text: JSON.stringify(wikiResults, null, 2) }],
      };
    }

    if (name === 'poe_pob_import') {
      const pobInput = (args?.pob_input as string) || '';
      const metrics = await decodePoBInput(pobInput);
      return {
        content: [{ type: 'text', text: JSON.stringify(metrics, null, 2) }],
      };
    }

    if (name === 'poe_patch_notes') {
      const query = (args?.query as string) || '';
      const notes = searchPatchNotes(query);
      return {
        content: [{ type: 'text', text: JSON.stringify(notes, null, 2) }],
      };
    }

    throw new Error(`Unknown tool: ${name}`);
  } catch (error) {
    return {
      isError: true,
      content: [{ type: 'text', text: `Error executing ${name}: ${(error as Error).message}` }],
    };
  }
});

async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('[PoE1 MCP Server] Running on stdio transport.');
}

run().catch((err) => {
  console.error('[PoE1 MCP Server] Fatal error:', err);
  process.exit(1);
});
