import React from 'react';
import { ExternalLink, Wrench, ShieldAlert, DollarSign, Database, Code } from 'lucide-react';

export const PoeToolsBar: React.FC = () => {
  const tools = [
    {
      name: 'PoE Official Trade',
      url: 'https://www.pathofexile.com/trade/',
      desc: 'Официальный поиск предметов и покупка валюты',
      icon: <DollarSign className="w-4 h-4 text-emerald-400" />,
    },
    {
      name: 'Wealthy Exile',
      url: 'https://wealthyexile.com/stash',
      desc: 'Оценка общей стоимости вашего сундука в игре',
      icon: <Database className="w-4 h-4 text-amber-400" />,
    },
    {
      name: 'PoELab',
      url: 'https://www.poelab.com/',
      desc: 'Ежедневные карты Лабиринта и скрытые комнаты',
      icon: <Wrench className="w-4 h-4 text-cyan-400" />,
    },
    {
      name: 'poe.ninja',
      url: 'https://poe.ninja/',
      desc: 'Мета-статистика и исторические графики цен',
      icon: <ShieldAlert className="w-4 h-4 text-purple-400" />,
    },
    {
      name: 'pobb.in',
      url: 'https://pobb.in/',
      desc: 'Быстрый просмотр билдов Path of Building',
      icon: <Code className="w-4 h-4 text-rose-400" />,
    },
  ];

  return (
    <div className="frosted-glass p-4 my-4 border border-amber-500/20">
      <div className="tech-label text-amber-400 glow-amber mb-3 flex items-center gap-2">
        <Wrench className="w-4 h-4" /> ПОЛЕЗНЫЕ ИНСТРУМЕНТЫ ДЛЯ PATH OF EXILE
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {tools.map((t) => (
          <a
            key={t.name}
            href={t.url}
            target="_blank"
            rel="noreferrer"
            className="brutal-card p-3 flex flex-col justify-between hover:border-amber-400 transition group"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-200 group-hover:text-amber-400 transition">
                  {t.name}
                </span>
                {t.icon}
              </div>
              <p className="text-[10px] text-slate-400 tech-font mt-1 leading-tight">{t.desc}</p>
            </div>
            <div className="mt-2 text-[10px] tech-font text-slate-500 flex items-center gap-1 group-hover:text-slate-300">
              Открыть <ExternalLink className="w-3 h-3" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
