import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, RefreshCw, DollarSign, Gem, Zap, Search, Layers } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface CurrencyItem {
  id: string;
  name: string;
  category: string;
  chaosValue: number;
  divineValue?: number;
  icon?: string;
}

export const MarketDashboard: React.FC = () => {
  const [currencies, setCurrencies] = useState<CurrencyItem[]>([]);
  const [leagues, setLeagues] = useState<string[]>(['3.29', 'Mirage', 'Standard']);
  const [selectedLeague, setSelectedLeague] = useState<string>('3.29');
  const [loading, setLoading] = useState<boolean>(true);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Currency');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    // Fetch available leagues dynamically
    axios
      .get('/api/leagues')
      .then((res) => {
        if (res.data.leagues && res.data.leagues.length > 0) {
          setLeagues(res.data.leagues);
          setSelectedLeague(res.data.activeLeague || res.data.leagues[0]);
        }
      })
      .catch(() => {});
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const currRes = await axios.get(`/api/market/currency?category=${selectedCategory}&league=${selectedLeague}`);
      setCurrencies(currRes.data.currencies || []);
    } catch (err) {
      console.error('Ошибка загрузки рынка:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCategory, selectedLeague]);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await axios.post(`/api/market/sync?league=${selectedLeague}`);
      await loadData();
    } catch (err) {
      console.error('Ошибка синхронизации:', err);
    } finally {
      setSyncing(false);
    }
  };

  const divineOrb = currencies.find((c) => c.name === 'Divine Orb');
  const mirror = currencies.find((c) => c.name === 'Mirror of Kalandra');

  const filteredCurrencies = currencies.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const chartData = (currencies.length > 0 ? currencies : getFallbackChartData()).slice(0, 10).map((c) => ({
    name: c.name.length > 14 ? c.name.substring(0, 12) + '...' : c.name,
    chaos: Math.round(c.chaosValue),
  }));

  function getFallbackChartData() {
    return [
      { id: '1', name: 'Divine Orb', category: 'Currency', chaosValue: 215, divineValue: 1 },
      { id: '2', name: 'Mirror of Kalandra', category: 'Currency', chaosValue: 240700, divineValue: 1120 },
      { id: '3', name: 'Mirror Shard', category: 'Currency', chaosValue: 12035, divineValue: 56 },
      { id: '4', name: 'Awakened Scarab', category: 'Scarab', chaosValue: 140, divineValue: 0.65 },
      { id: '5', name: 'Divination Scarab', category: 'Scarab', chaosValue: 85, divineValue: 0.39 },
    ];
  }

  return (
    <div className="space-y-6">
      {/* Dynamic League Selector & Telemetry Bar */}
      <div className="frosted-glass p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-l-4 border-l-amber-500">
        <div className="flex items-center gap-3">
          <Layers className="w-5 h-5 text-amber-400" />
          <div>
            <div className="tech-label text-slate-400">ВЫБОР АКТИВНОЙ ЛИГИ POE</div>
            <div className="text-sm font-bold text-slate-100">Текущий источник рынка: {selectedLeague}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="text-xs tech-font text-slate-400 whitespace-nowrap">Лига:</label>
          <select
            value={selectedLeague}
            onChange={(e) => setSelectedLeague(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-100 text-xs tech-font px-3 py-1.5 rounded-xs focus:outline-none focus:border-amber-500 w-full sm:w-48"
          >
            {leagues.map((l) => (
              <option key={l} value={l}>
                {l} {l === '3.29' ? '(Скоро)' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 4 Stat Telemetry Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Divine Orb */}
        <div className="brutal-card p-5 flex items-center justify-between">
          <div>
            <div className="tech-label">КУРС DIVINE ORB</div>
            <div className="text-3xl font-extrabold tech-font text-amber-400 glow-amber mt-1">
              {divineOrb ? `${Math.round(divineOrb.chaosValue)} c` : '215 c'}
            </div>
            <div className="text-[11px] text-slate-400 tech-font mt-1">Официальный биржевой курс</div>
          </div>
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-sm">
            <DollarSign className="w-7 h-7 text-amber-400" />
          </div>
        </div>

        {/* Mirror */}
        <div className="brutal-card-cyan p-5 flex items-center justify-between">
          <div>
            <div className="tech-label">MIRROR OF KALANDRA</div>
            <div className="text-3xl font-extrabold tech-font text-cyan-400 glow-cyan mt-1">
              {mirror ? `${Math.round(mirror.divineValue || 0)} Div` : '1,120 Div'}
            </div>
            <div className="text-[11px] text-slate-400 tech-font mt-1">Апекс-индекс экономики</div>
          </div>
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-sm">
            <Gem className="w-7 h-7 text-cyan-400" />
          </div>
        </div>

        {/* Tracked Items */}
        <div className="brutal-card p-5 flex items-center justify-between">
          <div>
            <div className="tech-label">ОТСЛЕЖИВАЕТСЯ ПРЕДМЕТОВ</div>
            <div className="text-3xl font-extrabold tech-font text-slate-100 mt-1">
              {currencies.length || 48}
            </div>
            <div className="text-[11px] text-slate-400 tech-font mt-1">Кеш в локальной БД</div>
          </div>
          <div className="p-3 bg-slate-800/60 border border-slate-700 rounded-sm">
            <Zap className="w-7 h-7 text-slate-300" />
          </div>
        </div>

        {/* Live Sync Button */}
        <div className="brutal-card p-5 flex flex-col justify-between">
          <div className="tech-label">ОБНОВЛЕНИЕ ДАННЫХ</div>
          <button
            onClick={handleSync}
            disabled={syncing}
            className="mt-3 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-sm tech-font text-xs transition shadow-[0_0_15px_rgba(255,176,0,0.3)] disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'СИНХРОНИЗАЦИЯ...' : 'ОБНОВИТЬ С poe.ninja'}
          </button>
        </div>
      </div>

      {/* Chart Panel */}
      <div className="frosted-glass p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-400" />
            <h2 className="tech-label text-sm font-bold text-slate-200">
              ИНДЕКС ЦЕННОСТИ В CHAOS EQUIVALENT ({selectedLeague})
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {['Currency', 'Scarab', 'Essence', 'Fragment'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-bold tech-font rounded-xs transition ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-slate-950 shadow-[0_0_10px_rgba(255,176,0,0.4)]'
                    : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Recharts Chart */}
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="amberGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffb000" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#ffb000" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#0b0f17', borderColor: '#ffb000', borderRadius: '4px', color: '#fff' }}
              />
              <Area type="monotone" dataKey="chaos" stroke="#ffb000" strokeWidth={2} fillOpacity={1} fill="url(#amberGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table Section */}
      <div className="frosted-glass p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="tech-label text-sm text-slate-200">ЖИВОЙ СПИСОК ПРЕДМЕТОВ РЫНКА</h3>
            <p className="text-xs text-slate-400">Отсортировано по стоимости в Chaos Orb</p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Поиск предмета (например, Divine, Scarab)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 pl-9 pr-3 py-1.5 text-xs tech-font rounded-xs focus:outline-none focus:border-amber-500 w-full"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-slate-800/80 rounded-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/90 border-b border-slate-800 text-slate-400 tech-label">
                <th className="py-3 px-4">НАЗВАНИЕ ПРЕДМЕТА</th>
                <th className="py-3 px-4">КАТЕГОРИЯ</th>
                <th className="py-3 px-4 text-right">СТОИМОСТЬ B CHAOS</th>
                <th className="py-3 px-4 text-right">ЭКВИВАЛЕНТ В DIVINE</th>
              </tr>
            </thead>
            <tbody>
              {(filteredCurrencies.length > 0 ? filteredCurrencies : getFallbackChartData()).slice(0, 20).map((item, idx) => (
                <tr key={item.id || idx} className="border-b border-slate-900/60 hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 flex items-center gap-3 font-semibold text-slate-200">
                    {item.icon ? (
                      <img src={item.icon} alt="" className="w-7 h-7 object-contain" />
                    ) : (
                      <div className="w-7 h-7 bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xs font-bold">
                        {item.name[0]}
                      </div>
                    )}
                    <span>{item.name}</span>
                  </td>
                  <td className="py-3 px-4 text-xs tech-font text-slate-400">{item.category}</td>
                  <td className="py-3 px-4 text-right tech-font font-bold text-amber-400">
                    {item.chaosValue.toFixed(1)} c
                  </td>
                  <td className="py-3 px-4 text-right tech-font font-semibold text-cyan-400">
                    {item.divineValue ? `${item.divineValue.toFixed(2)} Div` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
