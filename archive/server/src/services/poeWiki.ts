import axios from 'axios';

export interface WikiGemInfo {
  name: string;
  primary_attribute?: string;
  gem_description?: string;
  stat_text?: string;
  required_level?: number;
}

export async function searchPoEWiki(query: string): Promise<any[]> {
  try {
    const url = `https://www.poewiki.net/w/api.php?action=cargoquery&tables=items,gems&fields=items.name,items.description,gems.stat_text,items.required_level&where=items.name LIKE '%${encodeURIComponent(query)}%'&join_on=items._pageName=gems._pageName&format=json`;
    
    const response = await axios.get(url, {
      timeout: 5000,
      headers: { 'User-Agent': '0xAiPOEHelper-App/1.0' }
    });

    if (response.data && response.data.cargoquery) {
      return response.data.cargoquery.map((item: any) => item.title);
    }
    return [];
  } catch (error) {
    console.warn('[poeWiki] Search failed:', (error as Error).message);
    return [];
  }
}
