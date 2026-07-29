import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MarketDashboard } from './components/MarketDashboard';
import { PatchInspector } from './components/PatchInspector';
import { PoBInspector } from './components/PoBInspector';
import { FarmAnalytics } from './components/FarmAnalytics';
import { CraftingCalculator } from './components/CraftingCalculator';
import { BuildGuide } from './components/BuildGuide';
import { PoeToolsBar } from './components/PoeToolsBar';
import { Shield, TrendingUp, Sparkles, Cpu, Activity, Pickaxe, Hammer, Award, ExternalLink, BookOpen } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'market' | 'farm' | 'craft' | 'meta' | 'patch' | 'pob'>('meta');
  const [leagueInfo, setLeagueInfo] = useState<{ activeLeague: string; status: string } | null>(null);

  useEffect(() => {
    axios
      .get('/api/league')
      .then((res) => setLeagueInfo(res.data))
      .catch(() => setLeagueInfo({ activeLeague: '3.29', status: 'Лига 3.29 Готовится' }));
  }, []);

  return (
    <div className="min-h-screen pb-16 flex flex-col justify-between">
      <div>
        {/* Sci-Fi Brutalist Glass Header */}
        <header className="frosted-glass border-b border-slate-800/80 sticky top-0 z-50 px-4 py-3">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Logo & Title */}
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-sm shadow-[0_0_15px_rgba(255,176,0,0.15)]">
                <Cpu className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-extrabold tech-font text-slate-100 tracking-wider">0xAiPOEHelper</h1>
                  <span className="text-[10px] font-bold tech-font bg-amber-500/20 text-amber-400 border border-amber-500/40 px-2 py-0.5 rounded-xs">
                    ГОТОВ К ЛИГЕ 3.29
                  </span>
                </div>
                <p className="text-xs text-slate-400 tech-font mt-0.5">Аналитика Рынка Path of Exile 1 & AI MCP Движок</p>
              </div>
            </div>

            {/* Russian Nav Tabs */}
            <nav className="flex flex-wrap bg-slate-950/80 p-1 border border-slate-800 rounded-sm gap-1">
              <button
                onClick={() => setActiveTab('meta')}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold tech-font rounded-xs transition-all ${
                  activeTab === 'meta'
                    ? 'bg-amber-500 text-slate-950 shadow-[0_0_12px_rgba(255,176,0,0.4)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <BookOpen className="w-4 h-4 text-amber-400" /> БИЛД И ЛЕВЕЛИНГ
              </button>

              <button
                onClick={() => setActiveTab('market')}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold tech-font rounded-xs transition-all ${
                  activeTab === 'market'
                    ? 'bg-amber-500 text-slate-950 shadow-[0_0_12px_rgba(255,176,0,0.4)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <TrendingUp className="w-4 h-4" /> РЫНОК
              </button>

              <button
                onClick={() => setActiveTab('farm')}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold tech-font rounded-xs transition-all ${
                  activeTab === 'farm'
                    ? 'bg-amber-500 text-slate-950 shadow-[0_0_12px_rgba(255,176,0,0.4)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Pickaxe className="w-4 h-4" /> ФАРМ (ROI)
              </button>

              <button
                onClick={() => setActiveTab('craft')}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold tech-font rounded-xs transition-all ${
                  activeTab === 'craft'
                    ? 'bg-amber-500 text-slate-950 shadow-[0_0_12px_rgba(255,176,0,0.4)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Hammer className="w-4 h-4" /> КРАФТ И ФЛИП
              </button>

              <button
                onClick={() => setActiveTab('patch')}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold tech-font rounded-xs transition-all ${
                  activeTab === 'patch'
                    ? 'bg-amber-500 text-slate-950 shadow-[0_0_12px_rgba(255,176,0,0.4)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Sparkles className="w-4 h-4" /> ПАТЧ-НОУТЫ
              </button>

              <button
                onClick={() => setActiveTab('pob')}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold tech-font rounded-xs transition-all ${
                  activeTab === 'pob'
                    ? 'bg-amber-500 text-slate-950 shadow-[0_0_12px_rgba(255,176,0,0.4)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Shield className="w-4 h-4" /> POB ИНСПЕКТОР
              </button>
            </nav>

            {/* League Status Badge */}
            <div className="flex items-center gap-3 bg-slate-950/90 px-3.5 py-1.5 border border-slate-800 rounded-sm">
              <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
              <div className="text-right">
                <div className="text-[9px] tech-font text-slate-400 tracking-wider">АКТИВНАЯ ЛИГА</div>
                <div className="text-xs font-extrabold tech-font text-emerald-400">
                  {leagueInfo ? leagueInfo.activeLeague : '3.29 / Mirage'}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Body */}
        <main className="max-w-7xl mx-auto px-4 md:px-6 mt-6">
          <PoeToolsBar />

          {activeTab === 'meta' && <BuildGuide />}
          {activeTab === 'market' && <MarketDashboard />}
          {activeTab === 'farm' && <FarmAnalytics />}
          {activeTab === 'craft' && <CraftingCalculator />}
          {activeTab === 'patch' && <PatchInspector />}
          {activeTab === 'pob' && <PoBInspector />}
        </main>
      </div>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 mt-16 pt-6 border-t border-slate-800/60 w-full flex flex-col md:flex-row items-center justify-between text-xs tech-font text-slate-400 gap-4">
        <div>Path of Exile 1 (3.29) Аналитика &bull; Движок Go LAN + TS MCP Сервер</div>
        <div className="flex gap-4">
          <a href="https://www.pathofexile.com/trade/" target="_blank" rel="noreferrer" className="hover:text-emerald-400 flex items-center gap-1">
            PoE Trade <ExternalLink className="w-3 h-3" />
          </a>
          <a href="https://wealthyexile.com/stash" target="_blank" rel="noreferrer" className="hover:text-amber-400 flex items-center gap-1">
            Wealthy Exile <ExternalLink className="w-3 h-3" />
          </a>
          <a href="https://www.poelab.com/" target="_blank" rel="noreferrer" className="hover:text-cyan-400 flex items-center gap-1">
            PoELab <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </footer>
    </div>
  );
};
