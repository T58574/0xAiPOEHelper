import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, Coins, Pickaxe, Flame, CheckCircle, Zap } from 'lucide-react';

interface MarketRatio {
  title: string;
  ratioText: string;
  value: number;
  unit: string;
  trend: string;
  category: string;
  annotation: string;
}

interface FarmStrategy {
  name: string;
  category: string;
  estChaosHr: number;
  estDivHr: number;
  keyItems: string[];
  difficulty: string;
  description: string;
}

export const FarmAnalytics: React.FC = () => {
  const [ratios, setRatios] = useState<MarketRatio[]>([]);
  const [strategies, setStrategies] = useState<FarmStrategy[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    axios
      .get('/api/market/analytics')
      .then((res) => {
        setRatios(res.data.ratios || []);
        setStrategies(res.data.farmStrategies || []);
      })
      .catch((err) => console.error('Failed loading analytics:', err))
      .finally(() => setLoading(false));
  }, []);

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'Низкая':
        return <span className="px-2 py-0.5 text-xs font-bold tech-font bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">ЛЕГКАЯ</span>;
      case 'Средняя':
        return <span className="px-2 py-0.5 text-xs font-bold tech-font bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">СРЕДНЯЯ</span>;
      case 'Высокая':
        return <span className="px-2 py-0.5 text-xs font-bold tech-font bg-amber-500/20 text-amber-400 border border-amber-500/40">ВЫСОКАЯ</span>;
      default:
        return <span className="px-2 py-0.5 text-xs font-bold tech-font bg-rose-500/20 text-rose-400 border border-rose-500/40">АПЕКС</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="frosted-glass p-6">
        <div className="tech-label text-amber-400 glow-amber flex items-center gap-2">
          <Pickaxe className="w-4 h-4" /> АНАЛИТИКА ДОХОДНОСТИ И СТРАТЕГИИ ФАРМА (ROI)
        </div>
        <h2 className="text-2xl font-extrabold text-slate-100 mt-1">Оценка Эффективности и Соотношения Валют</h2>
        <p className="text-xs text-slate-400 mt-1">
          Реальная окупаемость популярных стратегий фарма с расчетом профита в Divine/час и анализом соотношений предметов.
        </p>
      </div>

      {/* Ratios Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {ratios.map((r, idx) => (
          <div key={idx} className="brutal-card p-4 space-y-2">
            <div className="tech-label text-slate-400">{r.category}</div>
            <h3 className="font-bold text-slate-100 text-sm">{r.title}</h3>
            <div className="text-xl font-extrabold tech-font text-amber-400 glow-amber">{r.ratioText}</div>
            <p className="text-[11px] text-slate-400 leading-tight pt-1 border-t border-slate-800">{r.annotation}</p>
          </div>
        ))}
      </div>

      {/* Farm Strategies ROI */}
      <div className="frosted-glass p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="tech-label text-sm text-slate-200">ТОП СТРАТЕГИЙ ФАРМА В ТЕКУЩЕМ РЫНКЕ</h3>
            <p className="text-xs text-slate-400">Рейтинг фарм-механик по чистой прибыли в час</p>
          </div>
          <Zap className="w-5 h-5 text-amber-400" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {strategies.map((s, idx) => (
            <div key={idx} className="brutal-card-cyan p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tech-font text-cyan-400">{s.category}</span>
                {getDifficultyBadge(s.difficulty)}
              </div>

              <h4 className="text-lg font-bold text-slate-100">{s.name}</h4>

              <div className="flex items-center gap-4 bg-slate-950/80 p-3 border border-slate-800 rounded-xs">
                <div>
                  <div className="text-[10px] tech-font text-slate-400">ПРОФИТ В ЧАС</div>
                  <div className="text-xl font-extrabold tech-font text-emerald-400">
                    ~{s.estDivHr.toFixed(1)} Div / ч
                  </div>
                </div>
                <div className="border-l border-slate-800 pl-4">
                  <div className="text-[10px] tech-font text-slate-400">В CHAOS ORB</div>
                  <div className="text-sm font-bold tech-font text-amber-400">
                    {s.estChaosHr.toLocaleString()} c / ч
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{s.description}</p>

              <div className="pt-2 border-t border-slate-800/80">
                <div className="text-[10px] tech-font text-slate-400 mb-1">КЛЮЧЕВЫЕ ПРЕДМЕТЫ / СКАРАБЕИ:</div>
                <div className="flex flex-wrap gap-1">
                  {s.keyItems.map((item, i) => (
                    <span key={i} className="text-[10px] tech-font bg-slate-900 text-slate-300 px-2 py-0.5 border border-slate-800 rounded-xs">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
