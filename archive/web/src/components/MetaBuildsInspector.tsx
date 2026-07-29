import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Flame, Shield, ExternalLink, CheckCircle, AlertCircle, Award, Sparkles, User, ShieldCheck } from 'lucide-react';

interface MetaBuild {
  name: string;
  author: string;
  class: string;
  tier: string;
  playstyle: string;
  coreSkill: string;
  keyUniques: string[];
  estBudgetDiv: number;
  pobLink: string;
  pros: string[];
  cons: string[];
  authorNote?: string;
}

export const MetaBuildsInspector: React.FC = () => {
  const [builds, setBuilds] = useState<MetaBuild[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    axios
      .get('/api/meta/builds')
      .then((res) => setBuilds(res.data.builds || []))
      .catch((err) => console.error('Failed loading meta builds:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="frosted-glass p-6 border-l-4 border-l-amber-500">
        <div className="tech-label text-amber-400 glow-amber flex items-center gap-2">
          <Award className="w-4 h-4" /> ТИР-ЛИСТ БИЛДОВ ОТ ТОП-ПРО И СТРИМЕРОВ (FUBGUN, RUETOO, TYTYKILLER, BEN_)
        </div>
        <h2 className="text-2xl font-extrabold text-slate-100 mt-1">Официальные Сборки и Спредшиты Лиги</h2>
        <p className="text-xs text-slate-400 mt-1">
          Только проверенные билды от сильнейших спидраннеров, крафтеров и Т17-фермеров (без мусорных сборников).
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {builds.map((build, idx) => (
          <div key={idx} className="brutal-card p-6 space-y-4 flex flex-col justify-between">
            <div>
              {/* Author & Tier Badges */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold tech-font bg-amber-500 text-slate-950 px-2.5 py-1 rounded-xs shadow-[0_0_10px_rgba(255,176,0,0.4)]">
                  {build.tier}
                </span>
                <div className="flex items-center gap-1 text-xs font-extrabold tech-font text-cyan-400 bg-slate-950 px-2.5 py-1 border border-cyan-500/30 rounded-xs">
                  <User className="w-3.5 h-3.5" /> Автор: {build.author}
                </div>
              </div>

              <h3 className="text-xl font-extrabold text-slate-100 mt-3">{build.name}</h3>
              <div className="text-xs text-slate-400 tech-font mt-0.5">{build.playstyle} &bull; {build.class}</div>

              {/* Author Note Highlight */}
              {build.authorNote && (
                <div className="mt-3 bg-cyan-500/10 border border-cyan-500/30 p-3 rounded-xs text-xs tech-font text-cyan-300">
                  {build.authorNote}
                </div>
              )}

              {/* Core Skill & Budget */}
              <div className="mt-3 bg-slate-950/80 p-3.5 border border-slate-800 rounded-xs space-y-2">
                <div className="flex justify-between text-xs tech-font">
                  <span className="text-slate-400">Главное умение:</span>
                  <span className="text-amber-400 font-bold">{build.coreSkill}</span>
                </div>
                <div className="flex justify-between text-xs tech-font">
                  <span className="text-slate-400">Стартовый бюджет:</span>
                  <span className="text-emerald-400 font-bold">~{build.estBudgetDiv} Div</span>
                </div>
              </div>

              {/* Key Uniques */}
              <div className="mt-3 space-y-1">
                <div className="text-[10px] tech-font text-slate-400">КЛЮЧЕВЫЕ УНИКАЛЬНЫЕ ПРЕДМЕТЫ:</div>
                <div className="flex flex-wrap gap-1.5">
                  {build.keyUniques.map((u, uIdx) => (
                    <span key={uIdx} className="text-[11px] tech-font bg-slate-900 text-amber-300 border border-amber-500/20 px-2.5 py-0.5 rounded-xs">
                      {u}
                    </span>
                  ))}
                </div>
              </div>

              {/* Pros & Cons */}
              <div className="mt-4 space-y-2 pt-3 border-t border-slate-800/80">
                <div className="space-y-1">
                  {build.pros.map((p, pIdx) => (
                    <div key={pIdx} className="text-xs text-emerald-300 flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-1">
                  {build.cons.map((c, cIdx) => (
                    <div key={cIdx} className="text-xs text-rose-300 flex items-center gap-2">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* PoB Link Action */}
            <a
              href={build.pobLink}
              target="_blank"
              rel="noreferrer"
              className="mt-4 flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-cyan-500/40 text-xs font-bold tech-font py-2.5 rounded-xs transition"
            >
              ОТКРЫТЬ В POBB.IN <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};
