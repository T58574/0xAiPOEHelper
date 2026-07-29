import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Hammer, Calculator, Sparkles, DollarSign, Layers, CheckCircle2, ArrowRight } from 'lucide-react';

interface CraftRecipe {
  name: string;
  baseItem: string;
  estCostDiv: number;
  estSaleDiv: number;
  profitMargin: number;
  method: string;
  risk: string;
  steps: string[];
}

interface DivCardProfit {
  name: string;
  stackSize: number;
  cardPriceC: number;
  reward: string;
  rewardValDiv: number;
  profitDiv: number;
}

export const CraftingCalculator: React.FC = () => {
  const [recipes, setRecipes] = useState<CraftRecipe[]>([]);
  const [cardFlips, setCardFlips] = useState<DivCardProfit[]>([]);
  const [chaosAmount, setChaosAmount] = useState<number>(1000);
  const [divinePrice, setDivinePrice] = useState<number>(215);

  useEffect(() => {
    axios
      .get('/api/crafting/recipes')
      .then((res) => {
        setRecipes(res.data.recipes || []);
        setCardFlips(res.data.cardFlips || []);
      })
      .catch((err) => console.error('Failed loading crafting recipes:', err));
  }, []);

  const convertedDiv = (chaosAmount / divinePrice).toFixed(2);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="frosted-glass p-6 border-l-4 border-l-cyan-400">
        <div className="tech-label text-cyan-400 glow-cyan flex items-center gap-2">
          <Hammer className="w-4 h-4" /> КАЛЬКУЛЯТОР КРАФТА И МАРЖИНАЛЬНОГО ФЛИПА
        </div>
        <h2 className="text-2xl font-extrabold text-slate-100 mt-1">Оценка Доходности Крафта и Карт</h2>
        <p className="text-xs text-slate-400 mt-1">
          Расчет себестоимости материалов (эссенций, фоссилей, орбов) против рыночной цены готовых предметов.
        </p>
      </div>

      {/* Converter Widget */}
      <div className="frosted-glass p-5">
        <div className="tech-label text-amber-400 glow-amber mb-3 flex items-center gap-2">
          <Calculator className="w-4 h-4" /> БЫСТРЫЙ КОНВЕРТЕР ВАЛЮТЫ И ОПТОВОЙ МАРЖИ
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          <div>
            <label className="text-[10px] tech-font text-slate-400">СУММА B CHAOS ORB:</label>
            <input
              type="number"
              value={chaosAmount}
              onChange={(e) => setChaosAmount(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 text-amber-400 font-bold tech-font px-3 py-2 text-sm rounded-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-[10px] tech-font text-slate-400">КУРС DIVINE (C):</label>
            <input
              type="number"
              value={divinePrice}
              onChange={(e) => setDivinePrice(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 font-bold tech-font px-3 py-2 text-sm rounded-xs focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="bg-slate-950/80 p-3 border border-slate-800 rounded-xs text-center">
            <div className="text-[10px] tech-font text-slate-400">ЭКВИВАЛЕНТ B DIVINE ORB:</div>
            <div className="text-2xl font-extrabold tech-font text-cyan-400 glow-cyan">
              {convertedDiv} Div
            </div>
          </div>
        </div>
      </div>

      {/* Craft Recipes Cards */}
      <div className="frosted-glass p-6 space-y-4">
        <div className="tech-label text-slate-200">ПРОФИТНЫЕ РЕЦЕПТЫ КРАФТА ПРЕДМЕТОВ</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recipes.map((r, idx) => (
            <div key={idx} className="brutal-card p-5 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold tech-font text-cyan-400">{r.method}</span>
                  <span className="text-[10px] font-bold tech-font bg-amber-500/20 text-amber-400 px-2 py-0.5 border border-amber-500/40">
                    РИСК: {r.risk}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-100 mt-2">{r.name}</h3>
                <div className="text-xs text-slate-400 tech-font mt-1">База: {r.baseItem}</div>

                {/* Profit Box */}
                <div className="mt-3 bg-slate-950/80 p-3 border border-slate-800 rounded-xs space-y-1">
                  <div className="flex justify-between text-xs tech-font">
                    <span className="text-slate-400">Себестоимость:</span>
                    <span className="text-slate-200 font-bold">~{r.estCostDiv} Div</span>
                  </div>
                  <div className="flex justify-between text-xs tech-font">
                    <span className="text-slate-400">Цена продажи:</span>
                    <span className="text-emerald-400 font-bold">~{r.estSaleDiv} Div</span>
                  </div>
                  <div className="flex justify-between text-xs tech-font pt-1 border-t border-slate-800">
                    <span className="text-amber-400 font-bold">Чистый профит:</span>
                    <span className="text-amber-400 font-extrabold glow-amber">+{r.profitMargin} Div</span>
                  </div>
                </div>

                {/* Steps */}
                <div className="mt-3 space-y-1">
                  <div className="text-[10px] tech-font text-slate-400">ПОШАГОВЫЙ АЛГОРИТМ:</div>
                  {r.steps.map((step, sIdx) => (
                    <div key={sIdx} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Div Card Flip Profits */}
      <div className="frosted-glass p-6 space-y-4">
        <div className="tech-label text-slate-200">ФЛИП ГАДАЛЬНЫХ КАРТ (CБОРКА СТОПОК)</div>
        <div className="overflow-x-auto border border-slate-800 rounded-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/90 border-b border-slate-800 text-slate-400 tech-label">
                <th className="py-3 px-4">КАРТА</th>
                <th className="py-3 px-4 text-center">СТОПКА</th>
                <th className="py-3 px-4 text-right">ЦЕНА 1 КАРТЫ</th>
                <th className="py-3 px-4">НАГРАДА</th>
                <th className="py-3 px-4 text-right">НАГРАДА (DIV)</th>
                <th className="py-3 px-4 text-right">МАРЖА СБОРА (DIV)</th>
              </tr>
            </thead>
            <tbody>
              {cardFlips.map((card, idx) => (
                <tr key={idx} className="border-b border-slate-900/60 hover:bg-slate-800/30 transition text-sm">
                  <td className="py-3 px-4 font-bold text-amber-400 tech-font">{card.name}</td>
                  <td className="py-3 px-4 text-center tech-font font-bold text-slate-300">{card.stackSize} шт</td>
                  <td className="py-3 px-4 text-right tech-font text-slate-300">{card.cardPriceC.toLocaleString()} c</td>
                  <td className="py-3 px-4 font-bold text-cyan-400">{card.reward}</td>
                  <td className="py-3 px-4 text-right tech-font font-bold text-emerald-400">{card.rewardValDiv} Div</td>
                  <td className="py-3 px-4 text-right tech-font font-extrabold text-amber-400 glow-amber">
                    +{card.profitDiv.toFixed(1)} Div
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
