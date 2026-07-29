export interface LevelingStep {
  id: string;
  act: number;
  title: string;
  desc: string;
  zoneTip?: string;
  recommendedGear?: string;
  gemsToBuy?: string[];
  links?: string;
  labNote?: string;
  isMilestone?: boolean;
}

export interface TradeBookmark {
  id: string;
  title: string;
  category: 'Starter' | 'Endgame' | 'Jewels' | 'Craft Bases' | 'Clusters' | 'AG Gear';
  url: string;
  note?: string;
}

export interface GemSetup {
  slot: string;
  name: string;
  gems: { name: string; color: 'red' | 'blue' | 'green'; level: string; note: string }[];
  description: string;
}

export interface GearStage {
  stage: number;
  name: string;
  levelRange: string;
  budget: string;
  color: 'emerald' | 'cyan' | 'amber';
  items: { slot: string; item: string; note: string }[];
}

export interface CraftingGuideItem {
  id: string;
  title: string;
  description: string;
  steps: string[];
}

export interface SpectreCategory {
  title: string;
  subtitle: string;
  color: 'amber' | 'cyan' | 'purple';
  spectres: { name: string; location: string; effect: string }[];
}

export interface AGItemSlot {
  slotName: string;
  itemName: string;
  itemBase: string;
  tradeUrl: string;
  effects: string[];
}

export interface AGIterSet {
  tier: 'tier1' | 'tier2' | 'tier3';
  tierTitle: string;
  tierBudget: string;
  slots: AGItemSlot[];
}

export interface FarmStrategy {
  id: string;
  title: string;
  stageTag: string;
  description: string;
  profitText: string;
  color: 'amber' | 'emerald' | 'purple' | 'cyan';
}

export interface AtlasTreePreset {
  id: string;
  title: string;
  focus: string;
  description: string;
  url: string;
}

export interface BuildProfile {
  id: string;
  name: string;
  author: string;
  patch: string;
  class: string;
  ascendancy: string;
  archetype: string;
  pobLink: string;
  defaultMapRegex: string;
  summary: string;
  keyStats: { label: string; value: string; note: string; color: 'amber' | 'cyan' | 'emerald' | 'rose' }[];
  levelingSteps: LevelingStep[];
  gemSetups: GemSetup[];
  gearStages: GearStage[];
  craftingGuides: CraftingGuideItem[];
  tradeBookmarks: TradeBookmark[];
  spectreCategories: SpectreCategory[];
  agSets: AGIterSet[];
  ciChecklist: string[];
  farmStrategies: FarmStrategy[];
  atlasPresets: AtlasTreePreset[];
}
