import React, { useState } from 'react';
import {
  Sliders,
  Download,
  Copy,
  Check,
  Sparkles,
  Zap,
  Shield,
  Eye,
  FileText,
  CheckSquare,
  Square,
  Layers,
  HelpCircle,
  Coins,
  AlertCircle
} from 'lucide-react';
import { BuildProfile } from '../types/buildProfile';

interface FilterCustomizerProps {
  profile: BuildProfile;
}

export const FilterCustomizer: React.FC<FilterCustomizerProps> = ({ profile }) => {
  const [selectedStage, setSelectedStage] = useState<1 | 2 | 3>(2);
  const [styleTheme, setStyleTheme] = useState<'monochrome' | 'neversink'>('monochrome');
  const [highlight3L, setHighlight3L] = useState<boolean>(true);
  const [highlightMSBoots, setHighlightMSBoots] = useState<boolean>(true);
  const [highlight4L, setHighlight4L] = useState<boolean>(true);
  const [highlight6Socket, setHighlight6Socket] = useState<boolean>(true);
  const [highlightEzomyte, setHighlightEzomyte] = useState<boolean>(true);
  const [highlightCraftBases, setHighlightCraftBases] = useState<boolean>(true);
  const [copiedText, setCopiedText] = useState<boolean>(false);

  // Generate Filter text dynamically
  const generateFilterContent = () => {
    let rules = `# ==============================================================================
# 0xAiPOEHELPER HIGH-CONTRAST ITEM FILTER (PoE 3.29)
# Active Build: ${profile.name}
# Theme: ${styleTheme === 'monochrome' ? 'HIGH-CONTRAST BLACK & WHITE (ЧЕРНО-БЕЛЫЙ СТИЛЬ)' : 'NEVERSINK STANDARD'}
# Guaranteed Protection: DIVINES, MIRRORS, HINEKORA, CHAOS ARE NEVER HIDDEN!
# ==============================================================================

# --- 1. GUARANTEED CURRENCY PROTECTION (MUST BE FIRST) ---
Show # 0xAiPOE: GOD TIER CURRENCY (MIRROR, HINEKORA, DIVINE, SACRED, FRACTURING)
\tClass "Stackable Currency" "Currency"
\tBaseType == "Mirror of Kalandra" "Mirror Shard" "Hinekora's Lock" "Divine Orb" "Sacred Orb" "Veiled Orb" "Fracturing Orb" "Fracturing Shard" "Awakener's Orb" "Tailoring Orb" "Tempering Orb" "Albino Rhoa Feather"
\tSetFontSize 45
\tSetTextColor 255 255 255 255
\tSetBorderColor 255 0 0 255
\tSetBackgroundColor 220 0 0 255
\tPlayAlertSound 6 300
\tPlayEffect Red
\tMinimapIcon 0 Red Star

Show # 0xAiPOE: HIGH VALUE CURRENCY (EXALT, CHAOS, ANNULMENT, VAAL, STACKED DECK)
\tClass "Stackable Currency" "Currency"
\tBaseType == "Exalted Orb" "Orb of Annulment" "Chaos Orb" "Vaal Orb" "Gemcutter's Prism" "Stacked Deck" "Orb of Unmaking" "Ancient Orb" "Regal Orb" "Orb of Regret" "Orb of Fusing" "Glassblower's Bauble"
\tSetFontSize 45
\tSetTextColor 0 0 0 255
\tSetBorderColor 255 215 0 255
\tSetBackgroundColor 255 255 255 255
\tPlayAlertSound 1 300
\tPlayEffect Yellow
\tMinimapIcon 0 Yellow Circle
`;

    if (selectedStage === 1) {
      rules += `
# --- STAGE 1: ACTS 1-5 BUILD OVERRIDES ---
`;

      if (highlight3L) {
        rules += `
Show # 0xAiPOE: R-B-B 3-Link Leveling Wands / Staves / Sceptres
\tClass "Wands" "Staves" "Sceptres"
\tLinkedSockets >= 3
\tSocketGroup "RBB"
\tAreaLevel <= 45
\tSetFontSize 45
\tSetTextColor 0 0 0 255
\tSetBorderColor 255 215 0 255
\tSetBackgroundColor 255 255 255 255
\tPlayAlertSound 1 300
\tPlayEffect Yellow
\tMinimapIcon 0 Yellow Diamond

Show # 0xAiPOE: B-B-B 3-Link Leveling Wands / Staves
\tClass "Wands" "Staves" "Sceptres"
\tLinkedSockets >= 3
\tSocketGroup "BBB"
\tAreaLevel <= 45
\tSetFontSize 45
\tSetTextColor 0 0 0 255
\tSetBorderColor 0 200 255 255
\tSetBackgroundColor 240 245 255 255
\tPlayAlertSound 1 250
\tPlayEffect Cyan
\tMinimapIcon 1 Cyan Diamond
`;
      }

      if (highlightMSBoots) {
        rules += `
Show # 0xAiPOE: Quicksilver Flask & Movement Speed Boots
\tBaseType == "Quicksilver Flask"
\tAreaLevel <= 60
\tSetFontSize 45
\tSetTextColor 0 0 0 255
\tSetBorderColor 0 255 128 255
\tSetBackgroundColor 255 255 255 255
\tPlayAlertSound 2 300
\tPlayEffect Green
\tMinimapIcon 0 Green Circle

Show # 0xAiPOE: Movement Speed Boots (Early Acts)
\tClass "Boots"
\tAreaLevel <= 35
\tRarity Magic Rare
\tSetFontSize 45
\tSetTextColor 0 0 0 255
\tSetBorderColor 0 255 200 255
\tSetBackgroundColor 255 255 255 255
\tPlayEffect Cyan Temp
`;
      }
    } else if (selectedStage === 2) {
      rules += `
# --- STAGE 2: ACTS 6-10 BUILD OVERRIDES ---
`;

      if (highlightEzomyte) {
        rules += `
Show # 0xAiPOE: Ezomyte Staff Base (Level 60+ Soulwrest Base)
\tBaseType == "Ezomyte Staff"
\tAreaLevel >= 60
\tSetFontSize 45
\tSetTextColor 0 0 0 255
\tSetBorderColor 255 0 0 255
\tSetBackgroundColor 255 255 255 255
\tPlayAlertSound 6 300
\tPlayEffect Red
\tMinimapIcon 0 Red Star
`;
      }

      if (highlight4L) {
        rules += `
Show # 0xAiPOE: 4-Link R-B-B-B Core Armor
\tLinkedSockets >= 4
\tSocketGroup "RBBB"
\tAreaLevel <= 75
\tSetFontSize 45
\tSetTextColor 0 0 0 255
\tSetBorderColor 255 176 0 255
\tSetBackgroundColor 255 255 255 255
\tPlayAlertSound 2 300
\tPlayEffect Orange
\tMinimapIcon 0 Orange Square

Show # 0xAiPOE: 4-Link B-B-B-B Core Support Armor
\tLinkedSockets >= 4
\tSocketGroup "BBBB"
\tAreaLevel <= 75
\tSetFontSize 45
\tSetTextColor 0 0 0 255
\tSetBorderColor 0 200 255 255
\tSetBackgroundColor 255 255 255 255
\tPlayAlertSound 2 250
\tPlayEffect Cyan
\tMinimapIcon 1 Cyan Square
`;
      }

      if (highlight6Socket) {
        rules += `
Show # 0xAiPOE: 6-Socket Items (Jeweller's Vendor Recipe)
\tSockets == 6
\tLinkedSockets < 6
\tSetFontSize 45
\tSetTextColor 0 0 0 255
\tSetBorderColor 255 255 255 255
\tSetBackgroundColor 240 150 0 255
\tPlayAlertSound 3 250
\tPlayEffect Yellow
\tMinimapIcon 1 Yellow Circle
`;
      }
    } else {
      rules += `
# --- STAGE 3: ENDGAME MAPS BUILD OVERRIDES ---
Show # 0xAiPOE: 6-Link Items (All Bases)
\tLinkedSockets == 6
\tSetFontSize 45
\tSetTextColor 0 0 0 255
\tSetBorderColor 255 0 0 255
\tSetBackgroundColor 255 255 255 255
\tPlayAlertSound 1 300
\tPlayEffect Red
\tMinimapIcon 0 Red Diamond

Show # 0xAiPOE: Unique Soulwrest Ezomyte Staff
\tBaseType == "Ezomyte Staff"
\tRarity Unique
\tSetFontSize 45
\tSetTextColor 0 0 0 255
\tSetBorderColor 255 176 0 255
\tSetBackgroundColor 255 255 255 255
\tPlayAlertSound 6 300
\tPlayEffect Red
\tMinimapIcon 0 Red Star

Show # 0xAiPOE: Build Endgame Uniques (Ancient Skull, Bonemeld, Sorrow of the Divine, Kingmaker)
\tBaseType == "Bone Helmet" "Sulphur Flask" "Despot Axe" "Citrine Amulet"
\tRarity Unique
\tSetFontSize 45
\tSetTextColor 0 0 0 255
\tSetBorderColor 255 0 255 255
\tSetBackgroundColor 255 255 255 255
\tPlayAlertSound 1 300
\tPlayEffect Purple
\tMinimapIcon 0 Purple Diamond
`;

      if (highlightCraftBases) {
        rules += `
Show # 0xAiPOE: High ES Crafting Base (Vaal Regalia ilvl 86+)
\tBaseType == "Vaal Regalia"
\tItemLevel >= 86
\tSetFontSize 45
\tSetTextColor 0 0 0 255
\tSetBorderColor 0 255 255 255
\tSetBackgroundColor 255 255 255 255
\tPlayAlertSound 3 300
\tPlayEffect Cyan
\tMinimapIcon 0 Cyan Diamond

Show # 0xAiPOE: Bone Rings & Cluster Jewels (8-Passive Minion & Medium)
\tBaseType == "Bone Ring" "Large Cluster Jewel" "Medium Cluster Jewel"
\tSetFontSize 45
\tSetTextColor 0 0 0 255
\tSetBorderColor 0 255 180 255
\tSetBackgroundColor 255 255 255 255
\tPlayAlertSound 3 300
\tPlayEffect Green
\tMinimapIcon 0 Green Hexagon
`;
      }
    }

    rules += `
# --- GENERAL STACKABLE CURRENCY (NEVER HIDDEN) ---
Show
\tClass "Stackable Currency" "Currency"
\tSetFontSize 40
\tSetTextColor 0 0 0 255
\tSetBorderColor 240 150 0 255
\tSetBackgroundColor 255 255 255 255

Show
\tClass "Maps" "Divination Card" "Skill Gems"
\tSetFontSize 40

Show
\tRarity Unique Rare
\tSetFontSize 38
`;

    return rules;
  };

  const currentFilterText = generateFilterContent();

  const handleDownload = () => {
    const blob = new Blob([currentFilterText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `0xAiPOE_Soulwrest_Stage${selectedStage}_Monochrome.filter`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFilterText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="frosted-glass p-6 border-l-4 border-l-amber-500 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-extrabold text-slate-100">
              ГЕНЕРАТОР ИТЕМ-ФИЛЬТРА (ЧЕРНО-БЕЛЫЙ СТИЛЬ & ЗАЩИТА ВАЛЮТЫ)
            </h2>
          </div>
          <p className="text-xs text-slate-400 tech-font mt-1">
            Крупный шрифт (SetFontSize 45) + Черный текст на белом фоне. <strong>Дивайны, Мирроры, Хинекора и Хаосы 100% ВСЕГДА ПОДСВЕЧЕНЫ!</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-500/40 text-xs font-bold tech-font px-4 py-2.5 rounded-xs transition"
          >
            {copiedText ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copiedText ? 'СКОПИРОВАНО!' : 'СКОПИРОВАТЬ ТЕКСТ'}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold tech-font text-xs px-4 py-2.5 rounded-xs transition shadow-[0_0_15px_rgba(255,176,0,0.3)]"
          >
            <Download className="w-4 h-4" /> СКАЧАТЬ (.FILTER)
          </button>
        </div>
      </div>

      {/* GUARANTEED PROTECTION BANNER */}
      <div className="bg-emerald-500/10 border-l-4 border-l-emerald-500 p-4 rounded-xs text-xs tech-font text-emerald-300 flex items-start gap-3">
        <Coins className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-emerald-400">ГАРАНТИЯ 100% ВИДИМОСТИ ВАЛЮТЫ:</strong>
          <div className="text-slate-300 mt-1">
            Все ценности — <strong>Mirror of Kalandra, Divine Orb, Hinekora's Lock, Sacred Orb, Exalted Orb, Chaos Orb, Stacked Deck</strong> — стоят в самом верху файла с максимальным шрифтом 45, громким звуком и лучами света. Они <strong>НИКОГДА НЕ СКРЫВАЮТСЯ!</strong>
          </div>
        </div>
      </div>

      {/* STAGE SELECTOR CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setSelectedStage(1)}
          className={`brutal-card p-5 border-l-4 text-left transition ${
            selectedStage === 1 ? 'border-l-emerald-500 bg-emerald-500/10' : 'border-l-slate-800 hover:border-l-slate-600'
          }`}
        >
          <div className="text-xs font-bold tech-font text-emerald-400">ЭТАП 1: АКТЫ 1–5</div>
          <h3 className="text-base font-extrabold text-slate-100 mt-1">Черно-Белый Старт</h3>
          <p className="text-xs text-slate-400 mt-1">
            Крупная подсветка 3-линк R-B-B связок, Quicksilver, MS ботинок и колец.
          </p>
        </button>

        <button
          onClick={() => setSelectedStage(2)}
          className={`brutal-card p-5 border-l-4 text-left transition ${
            selectedStage === 2 ? 'border-l-amber-500 bg-amber-500/10' : 'border-l-slate-800 hover:border-l-slate-600'
          }`}
        >
          <div className="text-xs font-bold tech-font text-amber-400">ЭТАП 2: АКТЫ 6–10 & МИДГЕЙМ</div>
          <h3 className="text-base font-extrabold text-slate-100 mt-1">Soulwrest Base & 4L</h3>
          <p className="text-xs text-slate-400 mt-1">
            Черно-белые крупные плашки под 4L R-B-B-B, 6-сокеты (7 Jeweller's) и Ezomyte Staff.
          </p>
        </button>

        <button
          onClick={() => setSelectedStage(3)}
          className={`brutal-card p-5 border-l-4 text-left transition ${
            selectedStage === 3 ? 'border-l-cyan-500 bg-cyan-500/10' : 'border-l-slate-800 hover:border-l-slate-600'
          }`}
        >
          <div className="text-xs font-bold tech-font text-cyan-400">ЭТАП 3: ЭНДГЕЙМ КАРТЫ & CI</div>
          <h3 className="text-base font-extrabold text-slate-100 mt-1">Т16 Lux Monochrome</h3>
          <p className="text-xs text-slate-400 mt-1">
            Крупный шрифт для 6-линков, Vaal Regalia (ilvl 86+), Bone Rings и кластеров.
          </p>
        </button>
      </div>

      {/* CODE PREVIEW PANEL */}
      <div className="brutal-card p-5 space-y-3 border-l-4 border-l-amber-500">
        <div className="flex justify-between items-center text-xs tech-font text-slate-400">
          <span className="flex items-center gap-1.5 font-bold text-slate-200">
            <Eye className="w-4 h-4 text-amber-400" /> ПРЕВЬЮ ЧЕРНО-БЕЛОГО ФИЛЬТРА (0xAiPOE_Soulwrest_Stage{selectedStage}.filter):
          </span>
          <span className="text-emerald-400 font-bold">100% ВАЛЮТА И ШМОТ ПОДЦВЕЧЕНЫ</span>
        </div>

        <pre className="bg-slate-950 p-4 border border-slate-800 rounded-xs text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-96">
          {currentFilterText}
        </pre>
      </div>
    </div>
  );
};
