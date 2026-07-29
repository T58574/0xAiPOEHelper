import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  TrendingUp,
  Search,
  Copy,
  Check,
  ExternalLink,
  Target,
  AlertTriangle,
  Zap,
  Map,
  Shield,
  Coins
} from 'lucide-react';
import { BuildProfile } from '../types/buildProfile';

interface LeagueStartDashboardProps {
  profile: BuildProfile;
}

interface UniquePrice {
  name: string;
  chaosValue: number;
  divineValue: number;
  icon?: string;
}

export const LeagueStartDashboard: React.FC<LeagueStartDashboardProps> = ({ profile }) => {
  // Timer State
  const [timeSeconds, setTimeSeconds] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [splits, setSplits] = useState<{ act: string; time: string }[]>([]);

  // Regex Generator State
  const [avoidPhysReflect, setAvoidPhysReflect] = useState<boolean>(true);
  const [avoidNoRegen, setAvoidNoRegen] = useState<boolean>(true);
  const [avoidNoLeech, setAvoidNoLeech] = useState<boolean>(true);
  const [avoidReducedRecovery, setAvoidReducedRecovery] = useState<boolean>(true);
  const [copiedRegex, setCopiedRegex] = useState<boolean>(false);

  // Prices State
  const [prices, setPrices] = useState<UniquePrice[]>([]);
  const [loadingPrices, setLoadingPrices] = useState<boolean>(false);

  // Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTimeSeconds((prev) => prev + 1);
      }, 1000);
    } else if (!isRunning && timeSeconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeSeconds]);

  // Load saved splits & prices
  useEffect(() => {
    const savedTime = localStorage.getItem('league_start_timer');
    if (savedTime) setTimeSeconds(parseInt(savedTime, 10) || 0);

    const savedSplits = localStorage.getItem('league_start_splits');
    if (savedSplits) {
      try {
        setSplits(JSON.parse(savedSplits));
      } catch (e) {}
    }

    // Fetch Unique Prices
    setLoadingPrices(true);
    axios
      .get('/api/market/uniques')
      .then((res) => {
        const uniques = res.data.uniques || [];
        const trackedNames = ['Soulwrest', 'Ancient Skull', 'Bonemeld', 'Darkness Enthroned', 'The Sorrow of the Divine', 'Kingmaker'];
        const matched = uniques.filter((u: any) => trackedNames.some((tn) => u.name.includes(tn)));
        setPrices(matched);
      })
      .catch(() => {
        // Fallback default prices if server is syncing
        setPrices([
          { name: 'Soulwrest', chaosValue: 5, divineValue: 0.02 },
          { name: 'Ancient Skull', chaosValue: 12, divineValue: 0.05 },
          { name: 'Bonemeld', chaosValue: 150, divineValue: 0.7 },
          { name: 'Darkness Enthroned', chaosValue: 15, divineValue: 0.07 },
          { name: 'Kingmaker', chaosValue: 450, divineValue: 2.1 }
        ]);
      })
      .finally(() => setLoadingPrices(false));
  }, []);

  const formatTime = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeSeconds(0);
    setSplits([]);
    localStorage.removeItem('league_start_timer');
    localStorage.removeItem('league_start_splits');
  };

  const recordSplit = (label: string) => {
    const newSplit = { act: label, time: formatTime(timeSeconds) };
    const updated = [...splits, newSplit];
    setSplits(updated);
    localStorage.setItem('league_start_splits', JSON.stringify(updated));
  };

  // Build Dynamic Regex String
  const generateRegex = () => {
    const parts: string[] = [];
    if (avoidPhysReflect) parts.push('ph');
    if (avoidNoRegen) parts.push('s rec');
    if (avoidNoLeech) parts.push('efe');
    if (avoidReducedRecovery) parts.push('reg');
    if (parts.length === 0) return profile.defaultMapRegex;
    return `!f ${parts.join('|')}|ur$|rch$`;
  };

  const currentRegex = generateRegex();

  const copyRegex = () => {
    navigator.clipboard.writeText(currentRegex);
    setCopiedRegex(true);
    setTimeout(() => setCopiedRegex(false), 2000);
  };

  return (
    <div className="brutal-card p-6 space-y-6 border-l-4 border-l-amber-500 bg-slate-950/90">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400 animate-pulse" />
            <h2 className="text-xl font-extrabold text-slate-100 tracking-wider">
              КОМАНДНЫЙ ЦЕНТР СТАРТА ЛИГИ 3.29
            </h2>
          </div>
          <p className="text-xs text-slate-400 tech-font mt-0.5">
            Активный Билд: <strong className="text-amber-400">{profile.name}</strong> &bull; Мониторинг & Спидран
          </p>
        </div>

        {/* Speedrun Timer Control */}
        <div className="flex items-center gap-3 bg-slate-900 p-2.5 border border-slate-800 rounded-xs">
          <Timer className="w-5 h-5 text-amber-400" />
          <div className="font-mono text-xl font-extrabold text-amber-400 tracking-widest">
            {formatTime(timeSeconds)}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={toggleTimer}
              className={`p-1.5 rounded-xs transition ${
                isRunning ? 'bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-slate-950' : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950'
              }`}
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={resetTimer}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xs transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Prices + Regex Generator */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LIVE PRICE MONITOR */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs tech-font">
            <span className="font-bold text-slate-300 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-400" /> LIVE-ЦЕНЫ УНИКОВ БИЛДА (POE.NINJA / TRADE):
            </span>
            <span className="text-[10px] text-emerald-400">ОБНОВЛЕНО</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {prices.map((p, idx) => (
              <div key={idx} className="bg-slate-900 p-2.5 border border-slate-800 rounded-xs flex justify-between items-center text-xs tech-font">
                <span className="text-slate-300 font-bold truncate">{p.name}</span>
                <span className="text-amber-400 font-extrabold shrink-0">
                  {p.chaosValue}c {p.divineValue >= 1 ? `(${p.divineValue.toFixed(1)} Div)` : ''}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* MAP REGEX GENERATOR */}
        <div className="space-y-3">
          <div className="text-xs tech-font font-bold text-slate-300 flex items-center gap-1.5">
            <Search className="w-4 h-4 text-amber-400" /> ГЕНЕРАТОР РЕГЕКСА ОПАСНЫХ КАРТ:
          </div>

          <div className="flex flex-wrap gap-2 text-[11px] tech-font">
            <label className="flex items-center gap-1 bg-slate-900 px-2.5 py-1 border border-slate-800 rounded-xs cursor-pointer text-slate-300">
              <input type="checkbox" checked={avoidPhysReflect} onChange={(e) => setAvoidPhysReflect(e.target.checked)} />
              Phys Reflect
            </label>

            <label className="flex items-center gap-1 bg-slate-900 px-2.5 py-1 border border-slate-800 rounded-xs cursor-pointer text-slate-300">
              <input type="checkbox" checked={avoidNoRegen} onChange={(e) => setAvoidNoRegen(e.target.checked)} />
              No Regen
            </label>

            <label className="flex items-center gap-1 bg-slate-900 px-2.5 py-1 border border-slate-800 rounded-xs cursor-pointer text-slate-300">
              <input type="checkbox" checked={avoidNoLeech} onChange={(e) => setAvoidNoLeech(e.target.checked)} />
              No Leech
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={currentRegex}
              className="w-full bg-slate-900 border border-slate-800 p-2 text-xs font-mono text-emerald-400 rounded-xs outline-none"
            />
            <button
              onClick={copyRegex}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold tech-font text-xs px-3 py-2 rounded-xs transition shrink-0 flex items-center gap-1"
            >
              {copiedRegex ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedRegex ? 'ОК' : 'КОПИРОВАТЬ'}
            </button>
          </div>
        </div>
      </div>

      {/* ATLAS PRESETS QUICK BAR */}
      <div className="pt-2 border-t border-slate-800 space-y-2">
        <div className="text-xs tech-font text-slate-400 font-bold flex items-center gap-1.5">
          <Map className="w-4 h-4 text-cyan-400" /> ПРЕСЕТЫ ДЕРЕВА АТЛАСА ПОД ФАРМ:
        </div>
        <div className="flex flex-wrap gap-3">
          {profile.atlasPresets.map((preset) => (
            <a
              key={preset.id}
              href={preset.url}
              target="_blank"
              rel="noreferrer"
              className="bg-slate-900 hover:bg-slate-800 border border-cyan-500/30 px-3 py-1.5 rounded-xs text-xs tech-font text-cyan-300 flex items-center gap-2 transition"
            >
              <span>{preset.title}</span>
              <ExternalLink className="w-3 h-3 text-cyan-400" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
