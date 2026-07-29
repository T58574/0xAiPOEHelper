import React, { useState } from 'react';
import axios from 'axios';
import { ArrowRight, ShieldCheck, Zap, Heart, Activity } from 'lucide-react';

interface PoBMetrics {
  className?: string;
  ascendancyName?: string;
  level?: number;
  life?: number;
  energyShield?: number;
  dps?: number;
  ehp?: number;
  fireResist?: number;
  coldResist?: number;
  lightningResist?: number;
  chaosResist?: number;
  suppressChance?: number;
}

export const PoBInspector: React.FC = () => {
  const [pobInput, setPobInput] = useState<string>('');
  const [metrics, setMetrics] = useState<PoBMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImport = async () => {
    if (!pobInput.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('/api/pob/decode', { pobInput });
      setMetrics(res.data.metrics);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Import Section */}
      <div className="frosted-glass p-6">
        <div className="tech-label text-cyan-400 glow-cyan mb-1 flex items-center gap-2">
          <Activity className="w-4 h-4" /> PATH OF BUILDING DECODER & TELEMETRY
        </div>
        <h2 className="text-xl font-extrabold text-slate-100 mb-4">Import Character Build</h2>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Paste pobb.in URL (e.g. https://pobb.in/...) or base64 XML code..."
            value={pobInput}
            onChange={(e) => setPobInput(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-700 text-slate-100 px-4 py-2.5 text-xs tech-font focus:outline-none focus:border-cyan-400 rounded-xs"
          />
          <button
            onClick={handleImport}
            disabled={loading}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold tech-font px-6 py-2.5 rounded-xs transition shadow-[0_0_15px_rgba(0,240,255,0.3)] flex items-center justify-center gap-2 text-xs disabled:opacity-50"
          >
            {loading ? 'ANALYZING...' : 'DECODE BUILD'} <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {error && <div className="mt-3 text-xs text-rose-400 tech-font">Import Error: {error}</div>}
      </div>

      {/* Metrics Results */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="brutal-card p-5 space-y-2">
            <div className="tech-label">CHARACTER & CLASS</div>
            <div className="text-3xl font-extrabold text-slate-100 tech-font">{metrics.ascendancyName || metrics.className}</div>
            <div className="text-xs text-slate-400 tech-font">Level {metrics.level} {metrics.className}</div>
          </div>

          <div className="brutal-card-cyan p-5 space-y-2">
            <div className="tech-label">COMBINED FULL DPS</div>
            <div className="text-3xl font-extrabold text-cyan-400 tech-font glow-cyan">
              {metrics.dps ? `${(metrics.dps / 1000000).toFixed(2)}M DPS` : '---'}
            </div>
            <div className="text-xs text-slate-400 tech-font">Path of Building Calculated DPS</div>
          </div>

          <div className="brutal-card p-5 space-y-2">
            <div className="tech-label">EFFECTIVE HIT POOL (EHP)</div>
            <div className="text-3xl font-extrabold text-amber-400 tech-font glow-amber">
              {metrics.ehp ? `${Math.round(metrics.ehp).toLocaleString()} EHP` : '---'}
            </div>
            <div className="text-xs text-slate-400 tech-font">Total Survivability Pool</div>
          </div>

          {/* Defense & Resist Breakdown */}
          <div className="md:col-span-3 frosted-glass p-6">
            <div className="tech-label mb-4">DEFENSIVE CAPS & RESISTANCE DIAGNOSTICS</div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
              <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xs">
                <div className="text-[10px] text-slate-400 tech-font tracking-wider">FIRE RESIST</div>
                <div className={`text-2xl font-extrabold tech-font mt-1 ${metrics.fireResist && metrics.fireResist >= 75 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {metrics.fireResist}%
                </div>
              </div>

              <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xs">
                <div className="text-[10px] text-slate-400 tech-font tracking-wider">COLD RESIST</div>
                <div className={`text-2xl font-extrabold tech-font mt-1 ${metrics.coldResist && metrics.coldResist >= 75 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {metrics.coldResist}%
                </div>
              </div>

              <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xs">
                <div className="text-[10px] text-slate-400 tech-font tracking-wider">LIGHTNING RESIST</div>
                <div className={`text-2xl font-extrabold tech-font mt-1 ${metrics.lightningResist && metrics.lightningResist >= 75 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {metrics.lightningResist}%
                </div>
              </div>

              <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xs">
                <div className="text-[10px] text-slate-400 tech-font tracking-wider">CHAOS RESIST</div>
                <div className={`text-2xl font-extrabold tech-font mt-1 ${metrics.chaosResist && metrics.chaosResist >= 0 ? 'text-amber-400' : 'text-rose-400'}`}>
                  {metrics.chaosResist}%
                </div>
              </div>

              <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xs">
                <div className="text-[10px] text-slate-400 tech-font tracking-wider">SPELL SUPPRESS</div>
                <div className={`text-2xl font-extrabold tech-font mt-1 ${metrics.suppressChance && metrics.suppressChance >= 100 ? 'text-cyan-400' : 'text-slate-400'}`}>
                  {metrics.suppressChance}%
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
