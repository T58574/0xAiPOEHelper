import axios from 'axios';
import zlib from 'zlib';

export interface PoBMetrics {
  buildName?: string;
  className?: string;
  ascendancyName?: string;
  level?: number;
  life?: number;
  energyShield?: number;
  mana?: number;
  dps?: number;
  ehp?: number;
  fireResist?: number;
  coldResist?: number;
  lightningResist?: number;
  chaosResist?: number;
  suppressChance?: number;
  mainSkill?: string;
}

export async function decodePoBInput(input: string): Promise<PoBMetrics> {
  let rawXml = '';

  const cleanInput = input.trim();

  // If pobb.in URL
  if (cleanInput.includes('pobb.in')) {
    const code = cleanInput.split('/').pop();
    const rawUrl = `https://pobb.in/${code}/raw`;
    const res = await axios.get(rawUrl, { timeout: 5000 });
    const b64Data = res.data.trim();
    rawXml = inflatePoBBase64(b64Data);
  }
  // If pastebin URL
  else if (cleanInput.includes('pastebin.com')) {
    const code = cleanInput.split('/').pop();
    const rawUrl = `https://pastebin.com/raw/${code}`;
    const res = await axios.get(rawUrl, { timeout: 5000 });
    const b64Data = res.data.trim();
    rawXml = inflatePoBBase64(b64Data);
  }
  // If raw XML
  else if (cleanInput.startsWith('<PathofBuilding>') || cleanInput.startsWith('<?xml')) {
    rawXml = cleanInput;
  }
  // Base64 string
  else {
    rawXml = inflatePoBBase64(cleanInput);
  }

  return parsePoBXmlMetrics(rawXml);
}

function inflatePoBBase64(b64: string): string {
  // Convert URL-safe base64
  const normalized = b64.replace(/-/g, '+').replace(/_/g, '/');
  const buffer = Buffer.from(normalized, 'base64');
  const decompressed = zlib.inflateSync(buffer);
  return decompressed.toString('utf-8');
}

function parsePoBXmlMetrics(xml: string): PoBMetrics {
  // RegEx extraction of core PoB stat tags
  const extractAttr = (statName: string): number => {
    const match = xml.match(new RegExp(`<Stat stat="${statName}" value="([^"]+)"`, 'i'));
    return match ? parseFloat(match[1]) : 0;
  };

  const classMatch = xml.match(/className="([^"]+)"/i);
  const ascendMatch = xml.match(/ascendClassName="([^"]+)"/i);
  const levelMatch = xml.match(/level="([^"]+)"/i);

  const life = extractAttr('Life') || extractAttr('TotalLife');
  const energyShield = extractAttr('EnergyShield');
  const dps = extractAttr('TotalDPS') || extractAttr('CombinedDPS') || extractAttr('FullDPS');
  const ehp = extractAttr('TotalEHP') || extractAttr('EffectiveHitPool');
  const fireRes = extractAttr('FireResist');
  const coldRes = extractAttr('ColdResist');
  const lightningRes = extractAttr('LightningResist');
  const chaosRes = extractAttr('ChaosResist');
  const suppress = extractAttr('SpellSuppressChance');

  return {
    className: classMatch ? classMatch[1] : 'Unknown',
    ascendancyName: ascendMatch ? ascendMatch[1] : 'None',
    level: levelMatch ? parseInt(levelMatch[1], 10) : 90,
    life: Math.round(life),
    energyShield: Math.round(energyShield),
    dps: Math.round(dps),
    ehp: Math.round(ehp),
    fireResist: Math.round(fireRes),
    coldResist: Math.round(coldRes),
    lightningResist: Math.round(lightningRes),
    chaosResist: Math.round(chaosRes),
    suppressChance: Math.round(suppress),
  };
}
