import React, { useState, useEffect } from 'react';
import {
  Shield,
  Zap,
  CheckSquare,
  Square,
  ExternalLink,
  Plus,
  Trash2,
  Bookmark,
  Sparkles,
  Sword,
  Skull,
  Layers,
  ArrowRight,
  Flame,
  Award,
  RefreshCw,
  Copy,
  Check,
  Search,
  BookOpen,
  Hammer,
  HelpCircle,
  AlertTriangle,
  Info,
  Target,
  Coins,
  AlertCircle,
  CheckCircle2,
  Sliders,
  Filter
} from 'lucide-react';

import { ALL_BUILD_PROFILES } from '../data/buildProfiles';
import { BuildProfile, TradeBookmark } from '../types/buildProfile';
import { LeagueStartDashboard } from './LeagueStartDashboard';
import { FilterCustomizer } from './FilterCustomizer';

export const BuildGuide: React.FC = () => {
  const [activeProfileId, setActiveProfileId] = useState<string>(ALL_BUILD_PROFILES[0].id);
  const [activeSubTab, setActiveSubTab] = useState<'leveling' | 'filter' | 'atlas_voidstones' | 'gear_progression' | 'gems' | 'crafting' | 'trade' | 'spectres_ag' | 'troubleshooting_ci' | 'farm_strategies'>('leveling');
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [bookmarks, setBookmarks] = useState<TradeBookmark[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [agTier, setAgTier] = useState<'tier1' | 'tier2' | 'tier3'>('tier3');
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newCat, setNewCat] = useState<'Starter' | 'Endgame' | 'Jewels' | 'Craft Bases' | 'Clusters'>('Starter');
  const [newNote, setNewNote] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedChat, setCopiedChat] = useState(false);

  const currentProfile: BuildProfile = ALL_BUILD_PROFILES.find((p) => p.id === activeProfileId) || ALL_BUILD_PROFILES[0];

  useEffect(() => {
    const savedSteps = localStorage.getItem(`leveling_steps_${activeProfileId}`);
    if (savedSteps) {
      try {
        setCompletedSteps(JSON.parse(savedSteps));
      } catch (e) {}
    } else {
      setCompletedSteps({});
    }

    const savedBookmarks = localStorage.getItem(`trade_bookmarks_${activeProfileId}`);
    if (savedBookmarks) {
      try {
        setBookmarks(JSON.parse(savedBookmarks));
      } catch (e) {
        setBookmarks(currentProfile.tradeBookmarks);
      }
    } else {
      setBookmarks(currentProfile.tradeBookmarks);
    }
  }, [activeProfileId]);

  const toggleStep = (id: string) => {
    const updated = { ...completedSteps, [id]: !completedSteps[id] };
    setCompletedSteps(updated);
    localStorage.setItem(`leveling_steps_${activeProfileId}`, JSON.stringify(updated));
  };

  const resetProgress = () => {
    if (window.confirm('Сбросить весь прогресс прокачки актов?')) {
      setCompletedSteps({});
      localStorage.removeItem(`leveling_steps_${activeProfileId}`);
    }
  };

  const addBookmark = () => {
    if (!newTitle || !newUrl) return;
    const item: TradeBookmark = {
      id: Date.now().toString(),
      title: newTitle,
      url: newUrl,
      category: newCat,
      note: newNote
    };
    const updated = [item, ...bookmarks];
    setBookmarks(updated);
    localStorage.setItem(`trade_bookmarks_${activeProfileId}`, JSON.stringify(updated));
    setNewTitle('');
    setNewUrl('');
    setNewNote('');
    setShowAddModal(false);
  };

  const removeBookmark = (id: string) => {
    const updated = bookmarks.filter((b) => b.id !== id);
    setBookmarks(updated);
    localStorage.setItem(`trade_bookmarks_${activeProfileId}`, JSON.stringify(updated));
  };

  const copySpectrePrompt = () => {
    navigator.clipboard.writeText('Does anyone have Demon Harpy / Pale Seraphim in hideout for desecrate?');
    setCopiedChat(true);
    setTimeout(() => setCopiedChat(false), 2000);
  };

  const totalSteps = currentProfile.levelingSteps.length;
  const doneCount = currentProfile.levelingSteps.filter((s) => completedSteps[s.id]).length;
  const progressPct = totalSteps > 0 ? Math.round((doneCount / totalSteps) * 100) : 0;

  const filteredBookmarks = selectedCategory === 'ALL' ? bookmarks : bookmarks.filter((b) => b.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* PROFILE SELECTOR & HEADER */}
      <div className="frosted-glass p-6 border-l-4 border-l-amber-500 relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tech-font bg-amber-500 text-slate-950 px-2 py-0.5 rounded-xs shadow-[0_0_10px_rgba(255,176,0,0.4)]">
                {currentProfile.patch}
              </span>
              <span className="text-xs font-bold tech-font bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-xs">
                {currentProfile.ascendancy}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={activeProfileId}
                onChange={(e) => setActiveProfileId(e.target.value)}
                className="bg-slate-950 text-slate-100 text-xl font-extrabold tech-font p-2 border border-amber-500/40 rounded-xs outline-none focus:border-amber-500 cursor-pointer"
              >
                {ALL_BUILD_PROFILES.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <p className="text-xs text-slate-400 tech-font">{currentProfile.summary}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={currentProfile.pobLink}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold tech-font text-xs px-4 py-2.5 rounded-xs transition shadow-[0_0_15px_rgba(255,176,0,0.3)]"
            >
              ОТКРЫТЬ В POBB.IN <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* SUBTAB NAVIGATION */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-slate-800/80">
          <button
            onClick={() => setActiveSubTab('leveling')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold tech-font rounded-xs transition ${
              activeSubTab === 'leveling'
                ? 'bg-amber-500 text-slate-950 shadow-[0_0_12px_rgba(255,176,0,0.4)]'
                : 'bg-slate-950/80 text-slate-300 hover:bg-slate-900 border border-slate-800'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" /> 📋 ПРОКАЧКА И АКТЫ ({progressPct}%)
          </button>

          <button
            onClick={() => setActiveSubTab('filter')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold tech-font rounded-xs transition ${
              activeSubTab === 'filter'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                : 'bg-slate-950/80 text-emerald-300 hover:bg-slate-900 border border-emerald-500/30'
            }`}
          >
            <Filter className="w-3.5 h-3.5" /> 🎨 ИТЕМ-ФИЛЬТР (.FILTER)
          </button>

          <button
            onClick={() => setActiveSubTab('atlas_voidstones')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold tech-font rounded-xs transition ${
              activeSubTab === 'atlas_voidstones'
                ? 'bg-amber-500 text-slate-950 shadow-[0_0_12px_rgba(255,176,0,0.4)]'
                : 'bg-slate-950/80 text-slate-300 hover:bg-slate-900 border border-slate-800'
            }`}
          >
            <Target className="w-3.5 h-3.5" /> 🎯 АТЛАС & 2 ВОЙДСТОУНА
          </button>

          <button
            onClick={() => setActiveSubTab('gear_progression')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold tech-font rounded-xs transition ${
              activeSubTab === 'gear_progression'
                ? 'bg-amber-500 text-slate-950 shadow-[0_0_12px_rgba(255,176,0,0.4)]'
                : 'bg-slate-950/80 text-slate-300 hover:bg-slate-900 border border-slate-800'
            }`}
          >
            <Shield className="w-3.5 h-3.5" /> 🛡️ СНАРЯЖЕНИЕ ПО СТАДИЯМ
          </button>

          <button
            onClick={() => setActiveSubTab('gems')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold tech-font rounded-xs transition ${
              activeSubTab === 'gems'
                ? 'bg-amber-500 text-slate-950 shadow-[0_0_12px_rgba(255,176,0,0.4)]'
                : 'bg-slate-950/80 text-slate-300 hover:bg-slate-900 border border-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> 🔮 СВЯЗКИ КАМНЕЙ
          </button>

          <button
            onClick={() => setActiveSubTab('crafting')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold tech-font rounded-xs transition ${
              activeSubTab === 'crafting'
                ? 'bg-amber-500 text-slate-950 shadow-[0_0_12px_rgba(255,176,0,0.4)]'
                : 'bg-slate-950/80 text-slate-300 hover:bg-slate-900 border border-slate-800'
            }`}
          >
            <Hammer className="w-3.5 h-3.5" /> 🔨 КРАФТ 1100+ ES
          </button>

          <button
            onClick={() => setActiveSubTab('trade')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold tech-font rounded-xs transition ${
              activeSubTab === 'trade'
                ? 'bg-amber-500 text-slate-950 shadow-[0_0_12px_rgba(255,176,0,0.4)]'
                : 'bg-slate-950/80 text-slate-300 hover:bg-slate-900 border border-slate-800'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" /> 🛒 BETTER TRADING
          </button>

          <button
            onClick={() => setActiveSubTab('spectres_ag')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold tech-font rounded-xs transition ${
              activeSubTab === 'spectres_ag'
                ? 'bg-amber-500 text-slate-950 shadow-[0_0_12px_rgba(255,176,0,0.4)]'
                : 'bg-slate-950/80 text-slate-300 hover:bg-slate-900 border border-slate-800'
            }`}
          >
            <Skull className="w-3.5 h-3.5" /> 🧟 СПЕКТРЫ & AG
          </button>

          <button
            onClick={() => setActiveSubTab('troubleshooting_ci')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold tech-font rounded-xs transition ${
              activeSubTab === 'troubleshooting_ci'
                ? 'bg-rose-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(244,63,94,0.4)]'
                : 'bg-slate-950/80 text-rose-300 hover:bg-slate-900 border border-rose-500/30'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" /> ⚠️ УЗКИЕ МЕСТА & CI
          </button>

          <button
            onClick={() => setActiveSubTab('farm_strategies')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold tech-font rounded-xs transition ${
              activeSubTab === 'farm_strategies'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                : 'bg-slate-950/80 text-emerald-300 hover:bg-slate-900 border border-emerald-500/30'
            }`}
          >
            <Coins className="w-3.5 h-3.5" /> 💰 ФАРМ-СТРАТЕГИИ
          </button>
        </div>
      </div>

      {/* LEAGUE START DASHBOARD */}
      <LeagueStartDashboard profile={currentProfile} />

      {/* SUBTAB: FILTER CUSTOMIZER */}
      {activeSubTab === 'filter' && <FilterCustomizer profile={currentProfile} />}

      {/* SUBTAB 1: LEVELING TRACKER */}
      {activeSubTab === 'leveling' && (
        <div className="space-y-6">
          <div className="brutal-card p-6 space-y-4">
            <div className="flex justify-between items-center text-xs tech-font">
              <span className="text-slate-300 font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" /> ПРОГРЕСС ПРОХОЖДЕНИЯ АКТОВ И ЛЕВЕЛИНГА:
              </span>
              <span className="text-amber-400 font-bold">
                {doneCount} из {totalSteps} шагов ({progressPct}%)
              </span>
            </div>

            <div className="w-full bg-slate-950 border border-slate-800 h-3 rounded-xs overflow-hidden">
              <div
                className="bg-amber-500 h-full transition-all duration-300 shadow-[0_0_12px_rgba(255,176,0,0.6)]"
                style={{ width: `${progressPct}%` }}
              ></div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 p-3.5 rounded-xs text-xs tech-font text-amber-300 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong>КВЕСТ РАЗБОЙНИКОВ В АКТЕ 2 (BANDITS):</strong> УБИЙТЕ ВСЕХ РАЗБОЙНИКОВ (Kill All Bandits)!
                Эрамир даст +1 очко пассивных навыков (в эндгейме дает максимальную ценность для дерева).
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <p className="text-[11px] text-slate-400 tech-font">
                Отмечайте выполненные этапы во время старта лиги. Состояние сохраняется автоматически!
              </p>
              <button
                onClick={resetProgress}
                className="text-[11px] text-rose-400 hover:text-rose-300 tech-font flex items-center gap-1 underline"
              >
                <RefreshCw className="w-3 h-3" /> Сбросить прогресс
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {currentProfile.levelingSteps.map((step) => {
              const isDone = completedSteps[step.id];
              return (
                <div
                  key={step.id}
                  className={`brutal-card p-5 border-l-4 transition-all ${
                    step.isMilestone
                      ? 'border-l-amber-500 bg-amber-500/5'
                      : isDone
                      ? 'border-l-emerald-500 opacity-80'
                      : 'border-l-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => toggleStep(step.id)}
                      className="mt-1 text-amber-400 hover:text-amber-300 shrink-0 transition"
                    >
                      {isDone ? (
                        <CheckSquare className="w-6 h-6 text-emerald-400" />
                      ) : (
                        <Square className="w-6 h-6 text-slate-600" />
                      )}
                    </button>

                    <div className="space-y-2 w-full">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className={`text-base font-extrabold ${isDone ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                          {step.title}
                        </h3>
                        {step.isMilestone && (
                          <span className="text-[10px] font-bold tech-font bg-amber-500 text-slate-950 px-2 py-0.5 rounded-xs animate-pulse">
                            КЛЮЧЕВОЙ СВИТЧ 60 УРОВНЯ
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-300">{step.desc}</p>

                      {step.zoneTip && (
                        <div className="bg-slate-950 p-2 border border-slate-800 rounded-xs text-[11px] tech-font text-slate-400">
                          🗺️ <strong>Фишка локации:</strong> {step.zoneTip}
                        </div>
                      )}

                      {step.recommendedGear && (
                        <div className="bg-cyan-500/10 border border-cyan-500/30 p-2 rounded-xs text-[11px] tech-font text-cyan-300">
                          🛡️ <strong>Рекомендуемый шмот:</strong> {step.recommendedGear}
                        </div>
                      )}

                      {step.labNote && (
                        <div className="bg-amber-500/10 border border-amber-500/30 p-2.5 rounded-xs text-xs tech-font text-amber-300">
                          🏛️ <strong>Лабиринт:</strong> {step.labNote}
                        </div>
                      )}

                      {step.gemsToBuy && (
                        <div className="space-y-1">
                          <div className="text-[10px] tech-font text-slate-400">КУПИТЬ У ВЕНДОРА:</div>
                          <div className="flex flex-wrap gap-1.5">
                            {step.gemsToBuy.map((g, gIdx) => (
                              <span
                                key={gIdx}
                                className="text-[11px] tech-font bg-slate-950 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded-xs"
                              >
                                {g}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {step.links && (
                        <div className="text-xs tech-font text-emerald-400 font-bold bg-slate-950/80 p-2 border border-slate-800 rounded-xs">
                          СВЯЗКА: {step.links}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB: ATLAS & VOIDSTONES */}
      {activeSubTab === 'atlas_voidstones' && (
        <div className="space-y-6">
          <div className="frosted-glass p-6 border-l-4 border-l-amber-500">
            <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
              <Target className="w-5 h-5 text-amber-400" /> Атлас и Захват 2 Войдстоунов (Eater of Worlds & Searing Exarch)
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Пошаговая стратегия выхода на красные карты Т16 и получение первых двух камней Бездны без гибели миньонов.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="brutal-card p-5 space-y-4 border-l-4 border-l-rose-500">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-extrabold text-rose-400">1. Войдстоун: Красный Иерарх (Searing Exarch)</h3>
                <span className="text-[10px] tech-font bg-rose-500/20 text-rose-400 border border-rose-500/40 px-2 py-0.5 rounded-xs font-bold">
                  Т14+ КАРТЫ
                </span>
              </div>

              <div className="space-y-2 text-xs tech-font text-slate-300">
                <div className="bg-slate-950 p-3 border border-slate-800 rounded-xs">
                  🎯 <strong>Условие доступа:</strong> Выполните цепочку квестов Пламенного Иерарха в красных картах (Т14+) и убейте Quest Exarch.
                </div>

                <div className="bg-slate-950 p-3 border border-slate-800 rounded-xs">
                  ⚔️ <strong>Тактика боя для Soulwrest:</strong>
                  <div className="text-slate-400 mt-1">• Перед пулом босса переключите оружие на <strong>Посох 1 (Соло-цель)</strong>.</div>
                  <div className="text-slate-400">• Примените <strong>Predator (Signal Prey)</strong> прямо на Exarch — 22 фантома сфокусируют 30M DPS прямо в босса.</div>
                  <div className="text-slate-400">• На фазе катящихся шаров (Rolling Orbs) бегайте по краю арены и кастуйте <strong>Convocation</strong>, чтобы стянуть фантомов к себе.</div>
                </div>
              </div>
            </div>

            <div className="brutal-card p-5 space-y-4 border-l-4 border-l-cyan-500">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-extrabold text-cyan-400">2. Войдстоун: Синий Пожиратель (Eater of Worlds)</h3>
                <span className="text-[10px] tech-font bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 px-2 py-0.5 rounded-xs font-bold">
                  Т15+ КАРТЫ
                </span>
              </div>

              <div className="space-y-2 text-xs tech-font text-slate-300">
                <div className="bg-slate-950 p-3 border border-slate-800 rounded-xs">
                  🎯 <strong>Условие доступа:</strong> Выполните цепочку квестов Пожирателя Миров в Т15+ картах и победите Quest Eater of Worlds.
                </div>

                <div className="bg-slate-950 p-3 border border-slate-800 rounded-xs">
                  ⚔️ <strong>Тактика боя для Soulwrest:</strong>
                  <div className="text-slate-400 mt-1">• Убедитесь, что включен <strong>Purity of Elements</strong> (иммунитет к заморозке и шоку).</div>
                  <div className="text-slate-400">• Во время фазы тонущих сфер (Drowning Orbs) активируйте сферы за 2 секунды до взрыва и уходите с шага через Frostblink.</div>
                  <div className="text-slate-400">• Фантомы непрерывно отхиливают ваш ES через Instant Leech, позволяя игнорировать лазер босса.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB: GEAR PROGRESSION */}
      {activeSubTab === 'gear_progression' && (
        <div className="space-y-6">
          <div className="frosted-glass p-6 border-l-4 border-l-amber-500">
            <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-400" /> Прогрессия Экипировки ({currentProfile.gearStages.length} Стадии)
            </h2>
            <p className="text-xs text-slate-400 mt-1">От старта на белых картах до бессмертного CI танка с 9,182 ES.</p>
          </div>

          <div className="space-y-6">
            {currentProfile.gearStages.map((stage) => (
              <div
                key={stage.stage}
                className={`brutal-card p-6 border-l-4 space-y-4 ${
                  stage.color === 'emerald'
                    ? 'border-l-emerald-500'
                    : stage.color === 'cyan'
                    ? 'border-l-cyan-500'
                    : 'border-l-amber-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3
                    className={`text-lg font-extrabold ${
                      stage.color === 'emerald'
                        ? 'text-emerald-400'
                        : stage.color === 'cyan'
                        ? 'text-cyan-400'
                        : 'text-amber-400'
                    }`}
                  >
                    {stage.name}
                  </h3>
                  <span className="text-[10px] tech-font bg-slate-950 text-slate-200 px-2.5 py-1 border border-slate-800 rounded-xs font-bold">
                    БЮДЖЕТ: {stage.budget}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs tech-font text-slate-300">
                  {stage.items.map((item, iIdx) => (
                    <div key={iIdx} className="bg-slate-950 p-3 border border-slate-800 rounded-xs">
                      <strong>{item.slot}:</strong> {item.item} — <span className="text-slate-400">{item.note}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB: GEM SETUPS */}
      {activeSubTab === 'gems' && (
        <div className="space-y-6">
          <div className="frosted-glass p-6 border-l-4 border-l-amber-500">
            <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" /> Полный Набор Камней Умений и Связок
            </h2>
            <p className="text-xs text-slate-400 mt-1">Все 6 предметов и их сокетные связки.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentProfile.gemSetups.map((setup, sIdx) => (
              <div key={sIdx} className="brutal-card p-5 space-y-4 border-l-4 border-l-slate-700 hover:border-l-amber-500 transition">
                <div>
                  <span className="text-[10px] font-bold tech-font bg-amber-500 text-slate-950 px-2 py-0.5 rounded-xs">
                    {setup.slot}
                  </span>
                  <h3 className="text-lg font-extrabold text-slate-100 mt-2">{setup.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">{setup.description}</p>
                </div>

                <div className="space-y-2">
                  {setup.gems.map((g, gIdx) => (
                    <div key={gIdx} className="bg-slate-950 p-3 border border-slate-800 rounded-xs flex flex-col justify-between gap-1 text-xs tech-font">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-200">{g.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400">Ур. {g.level}</span>
                          <span
                            className={`px-2 py-0.5 rounded-xs font-bold text-[10px] ${
                              g.color === 'red'
                                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                                : g.color === 'blue'
                                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            }`}
                          >
                            {g.color.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="text-[11px] text-slate-400">{g.note}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB: CRAFTING */}
      {activeSubTab === 'crafting' && (
        <div className="space-y-6">
          {currentProfile.craftingGuides.map((guide) => (
            <div key={guide.id} className="frosted-glass p-6 border-l-4 border-l-cyan-500 space-y-4">
              <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
                <Hammer className="w-5 h-5 text-cyan-400" /> {guide.title}
              </h2>
              <p className="text-xs text-slate-400">{guide.description}</p>

              <div className="space-y-2 text-xs tech-font text-slate-300">
                {guide.steps.map((step, stepIdx) => (
                  <div key={stepIdx} className="bg-slate-950 p-3.5 border border-slate-800 rounded-xs">
                    {step}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUBTAB: BETTER TRADING */}
      {activeSubTab === 'trade' && (
        <div className="space-y-6">
          <div className="frosted-glass p-6 border-l-4 border-l-amber-500 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-amber-400" /> Better Trading & Быстрые Снайп-Ссылки
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Сохраняйте ссылки на Поиск Предметов в PoE Trade, фильтруйте по категориям и возвращайтесь к ним в 1 клик.
              </p>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold tech-font text-xs px-4 py-2.5 rounded-xs transition shadow-[0_0_12px_rgba(255,176,0,0.3)]"
            >
              <Plus className="w-4 h-4" /> Добавить Закладку Поиска
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {['ALL', 'Starter', 'Endgame', 'Jewels', 'Craft Bases', 'Clusters'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-bold tech-font rounded-xs transition ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                {cat === 'ALL' ? 'ВСЕ ЗАКЛАДКИ' : cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredBookmarks.map((bm) => (
              <div key={bm.id} className="brutal-card p-5 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold tech-font bg-slate-950 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-xs">
                      {bm.category}
                    </span>
                    <button
                      onClick={() => removeBookmark(bm.id)}
                      className="text-slate-500 hover:text-rose-400 transition p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-100 mt-2">{bm.title}</h3>
                  {bm.note && <p className="text-xs text-slate-400 mt-1">{bm.note}</p>}
                </div>

                <a
                  href={bm.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 bg-slate-950 hover:bg-slate-900 text-emerald-400 border border-emerald-500/40 text-xs font-bold tech-font py-2 rounded-xs transition"
                >
                  ОТКРЫТЬ В POE TRADE <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>

          {showAddModal && (
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center z-50 p-4">
              <div className="brutal-card p-6 max-w-lg w-full space-y-4 border border-amber-500/40">
                <h3 className="text-lg font-extrabold text-slate-100">Новая Закладка PoE Trade</h3>

                <div className="space-y-3 text-xs tech-font">
                  <div>
                    <label className="text-slate-400 block mb-1">Название Предмета/Поиска:</label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="Например: Large Cluster 8 Passives"
                      className="w-full bg-slate-950 border border-slate-800 p-2.5 text-slate-100 rounded-xs focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Ссылка PoE Trade:</label>
                    <input
                      type="text"
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      placeholder="https://www.pathofexile.com/trade/search/..."
                      className="w-full bg-slate-950 border border-slate-800 p-2.5 text-slate-100 rounded-xs focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Категория:</label>
                    <select
                      value={newCat}
                      onChange={(e) => setNewCat(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 p-2.5 text-slate-100 rounded-xs focus:border-amber-500 outline-none"
                    >
                      <option value="Starter">Starter</option>
                      <option value="Endgame">Endgame</option>
                      <option value="Jewels">Jewels</option>
                      <option value="Clusters">Clusters</option>
                      <option value="Craft Bases">Craft Bases</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Заметка/Комментарий:</label>
                    <input
                      type="text"
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Заметка к поиску..."
                      className="w-full bg-slate-950 border border-slate-800 p-2.5 text-slate-100 rounded-xs focus:border-amber-500 outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-xs tech-font text-slate-400 hover:text-slate-200"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={addBookmark}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold tech-font text-xs rounded-xs"
                  >
                    Сохранить
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB: SPECTRES & AG */}
      {activeSubTab === 'spectres_ag' && (
        <div className="space-y-6">
          <div className="brutal-card p-6 border-l-4 border-l-purple-500 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-lg font-extrabold text-slate-100 flex items-center gap-2">
                <Skull className="w-5 h-5 text-purple-400" /> Чат Некромантов (/global 6666)
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Скопируйте фразу на английском для получения Спектров от игроков в международном чате Некромантов:
              </p>
              <div className="mt-2 text-xs font-bold tech-font text-cyan-300 bg-slate-950 p-2 border border-slate-800 rounded-xs">
                "Does anyone have Demon Harpy / Pale Seraphim in hideout for desecrate?"
              </div>
            </div>

            <button
              onClick={copySpectrePrompt}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold tech-font text-xs px-4 py-2.5 rounded-xs transition shadow-[0_0_12px_rgba(168,85,247,0.4)] shrink-0"
            >
              {copiedChat ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copiedChat ? 'СКОПИРОВАНО!' : 'COPY ENGLISH CHAT PROMPT'}
            </button>
          </div>

          <div className="frosted-glass p-6 border-l-4 border-l-purple-500 space-y-4">
            <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
              <Skull className="w-5 h-5 text-purple-400" /> Гид по Поиску и Призыву Спектров
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {currentProfile.spectreCategories.map((cat, cIdx) => (
                <div
                  key={cIdx}
                  className={`brutal-card p-5 space-y-3 border-l-4 ${
                    cat.color === 'amber' ? 'border-l-amber-500' : cat.color === 'cyan' ? 'border-l-cyan-500' : 'border-l-purple-500'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-extrabold text-slate-100">{cat.title}</h3>
                    <span className="text-[9px] tech-font bg-slate-950 text-slate-300 px-1.5 py-0.5 rounded-xs">
                      {cat.subtitle}
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 space-y-2">
                    {cat.spectres.map((spec, specIdx) => (
                      <div key={specIdx} className="bg-slate-950 p-2.5 border border-slate-800 rounded-xs">
                        <strong className="text-amber-300">{spec.name}:</strong>
                        <div className="text-slate-400 text-[11px] mt-0.5">📍 <em>Локация:</em> {spec.location}</div>
                        <div className="text-emerald-400 text-[11px] mt-0.5">⚡ <em>Эффект:</em> {spec.effect}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AG SETS */}
          <div className="frosted-glass p-6 border-l-4 border-l-rose-500 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-rose-400" /> Анимированный Хранитель (Animate Guardian / AG)
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Благодаря 45% мгновенному отхилу в секунду (`Life from Death`) ваш Анимированный Хранитель <strong>бессмертен</strong>!
                </p>
              </div>
            </div>

            {currentProfile.agSets.map((set, setIdx) => (
              <div key={setIdx} className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {set.slots.map((slot, sIdx) => (
                  <div key={sIdx} className="bg-slate-950 border-2 border-amber-500/60 p-4 rounded-xs space-y-3 flex flex-col justify-between hover:shadow-[0_0_15px_rgba(255,176,0,0.2)] transition">
                    <div>
                      <div className="text-[10px] tech-font font-bold text-amber-400 uppercase tracking-wider">{slot.slotName}</div>
                      <h4 className="text-base font-extrabold text-amber-300 mt-1">{slot.itemName}</h4>
                      <p className="text-[11px] text-slate-400 tech-font mt-1">{slot.itemBase}</p>

                      <div className="mt-3 space-y-1.5 text-[11px] tech-font text-emerald-300 bg-slate-900 p-2.5 border border-slate-800 rounded-xs">
                        {slot.effects.map((eff, effIdx) => (
                          <div key={effIdx}>{eff}</div>
                        ))}
                      </div>
                    </div>

                    <a
                      href={slot.tradeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-1.5 bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/40 text-[11px] font-bold tech-font py-2 rounded-xs transition"
                    >
                      ПОИСК В POE TRADE <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB: TROUBLESHOOTING & CI */}
      {activeSubTab === 'troubleshooting_ci' && (
        <div className="space-y-6">
          <div className="frosted-glass p-6 border-l-4 border-l-rose-500 space-y-3">
            <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" /> Чек-Лист Перехода в Chaos Inoculation (1 HP)
            </h2>
            <p className="text-xs text-slate-400">Главные правила, чтобы не умереть при переходе на 1 HP.</p>
          </div>

          <div className="brutal-card p-6 border-l-4 border-l-rose-500 space-y-4">
            <div className="space-y-3 text-xs tech-font text-slate-300">
              {currentProfile.ciChecklist.map((item, idx) => (
                <div key={idx} className="bg-slate-950 p-3.5 border border-slate-800 rounded-xs flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>{item}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB: FARM STRATEGIES */}
      {activeSubTab === 'farm_strategies' && (
        <div className="space-y-6">
          <div className="frosted-glass p-6 border-l-4 border-l-emerald-500">
            <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
              <Coins className="w-5 h-5 text-emerald-400" /> Топовые Фарм-Стратегии
            </h2>
            <p className="text-xs text-slate-400 mt-1">Рекомендуемые стратегии под выбранный билд.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentProfile.farmStrategies.map((strat) => (
              <div key={strat.id} className="brutal-card p-5 space-y-3 border-l-4 border-l-emerald-500">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-extrabold text-emerald-400">{strat.title}</h3>
                  <span className="text-[10px] tech-font bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-xs font-bold">
                    {strat.stageTag}
                  </span>
                </div>
                <p className="text-xs text-slate-300">{strat.description}</p>
                <div className="bg-slate-950 p-2.5 border border-slate-800 rounded-xs text-[11px] tech-font text-emerald-400">
                  {strat.profitText}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
