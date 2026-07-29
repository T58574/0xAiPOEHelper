import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Flame, Sparkles } from 'lucide-react';

interface PatchNote {
  gemName: string;
  changeType: 'BUFF' | 'NERF' | 'REWORK' | 'NEW' | 'NEUTRAL';
  summary: string;
  fullText: string;
}

export const PatchInspector: React.FC = () => {
  const [notes, setNotes] = useState<PatchNote[]>([]);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [filterType, setFilterType] = useState<string>('ALL');

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/patch-notes?q=${search}`);
        setNotes(res.data.notes || []);
      } catch (err) {
        console.error('Failed loading patch notes:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, [search]);

  const filteredNotes = notes.filter((n) => filterType === 'ALL' || n.changeType === filterType);

  const getBadge = (type: string) => {
    switch (type) {
      case 'BUFF':
        return <span className="px-2.5 py-1 text-xs font-bold tech-font bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-xs">BUFF</span>;
      case 'NERF':
        return <span className="px-2.5 py-1 text-xs font-bold tech-font bg-rose-500/20 text-rose-400 border border-rose-500/40 rounded-xs">NERF</span>;
      case 'REWORK':
        return <span className="px-2.5 py-1 text-xs font-bold tech-font bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 rounded-xs">REWORK</span>;
      case 'NEW':
        return <span className="px-2.5 py-1 text-xs font-bold tech-font bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-xs">NEW GEM</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-bold tech-font bg-slate-800 text-slate-300 border border-slate-700 rounded-xs">CHANGE</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="frosted-glass p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="tech-label text-amber-400 glow-amber flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> PATH OF EXILE 3.29 BALANCE DATABASE
            </div>
            <h2 className="text-2xl font-extrabold text-slate-100 mt-1">Skill Gems & Support Adjustments</h2>
            <p className="text-xs text-slate-400 mt-1">Real-time patch notes parser & balance tracker</p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search gem changes (Spark, Kinetic)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-100 pl-9 pr-3 py-2 text-xs tech-font rounded-xs focus:outline-none focus:border-amber-500 w-full"
            />
          </div>
        </div>

        {/* Filter Badges */}
        <div className="flex gap-2 mt-6 pt-4 border-t border-slate-800/80">
          {['ALL', 'BUFF', 'NERF', 'REWORK', 'NEW'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-4 py-1.5 text-xs font-bold tech-font rounded-xs transition ${
                filterType === t
                  ? 'bg-amber-500 text-slate-950 shadow-[0_0_12px_rgba(255,176,0,0.4)]'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Gem Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNotes.map((note, idx) => (
          <div key={idx} className="brutal-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold tech-font text-slate-100 flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-400" />
                {note.gemName}
              </h3>
              {getBadge(note.changeType)}
            </div>

            <div className="text-xs text-slate-300 font-mono leading-relaxed bg-slate-950/80 p-4 border border-slate-800/90 rounded-xs">
              {note.fullText}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
