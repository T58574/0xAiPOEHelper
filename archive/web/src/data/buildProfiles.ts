import { BuildProfile, TradeBookmark } from '../types/buildProfile';

export const DEFAULT_TRADE_BOOKMARKS: TradeBookmark[] = [
  {
    id: 'user-cluster-8pass',
    title: 'Large Cluster 8 Passives (Minion Dmg ilvl 83+)',
    category: 'Clusters',
    url: 'https://www.pathofexile.com/trade/search/Standard/8rKwDvkvcV',
    note: 'Идеальный кластер на 8 пассивок под крафт 35% inc effect + attack/cast speed'
  },
  {
    id: 'soulwrest-6s',
    title: 'Soulwrest Ezomyte Staff (6 Sockets)',
    category: 'Starter',
    url: 'https://www.pathofexile.com/trade/search/Standard?q={%22query%22:{%22name%22:%22Soulwrest%22}}',
    note: 'Ищите 6 сокетов (соединенные связи НЕ нужны!). Ролл flat phys 130+'
  },
  {
    id: 'ancient-skull',
    title: 'Ancient Skull (Bone Helmet)',
    category: 'Starter',
    url: 'https://www.pathofexile.com/trade/search/Standard?q={%22query%22:{%22name%22:%22Ancient%20Skull%22}}',
    note: 'Дает 50% minion crit chance per power charge'
  },
  {
    id: 'darkness-enthroned',
    title: 'Darkness Enthroned (95%+ Effect)',
    category: 'Starter',
    url: 'https://www.pathofexile.com/trade/search/Standard?q={%22query%22:{%22name%22:%22Darkness%20Enthroned%22}}',
    note: 'Высокий ролл эффекта самоцветов (95%+)'
  },
  {
    id: 'bonemeld',
    title: 'Bonemeld Unique Amulet (+2 Spectre)',
    category: 'Endgame',
    url: 'https://www.pathofexile.com/trade/search/Standard?q={%22query%22:{%22name%22:%22Bonemeld%22}}',
    note: '+116% Global Defences и +2 Spectre level'
  },
  {
    id: 'sorrow-divine',
    title: 'The Sorrow of the Divine (Sulphur Flask)',
    category: 'Starter',
    url: 'https://www.pathofexile.com/trade/search/Standard?q={%22query%22:{%22name%22:%22The%20Sorrow%20of%20the%20Divine%22}}',
    note: 'Превращает реген флаконов в мгновенный Energy Shield recovery'
  },
  {
    id: 'phantasm-21-20',
    title: 'Summon Phantasm Support (21/20)',
    category: 'Endgame',
    url: 'https://www.pathofexile.com/trade/search/Standard?q={%22query%22:{%22type%22:%22Summon%20Phantasm%20Support%22}}',
    note: 'Удваивает лимит фантомов до 22!'
  },
  {
    id: 'ghastly-eye-phys',
    title: 'Ghastly Eye Jewel (Flat Phys + ES)',
    category: 'Jewels',
    url: 'https://www.pathofexile.com/trade/search/Standard?q={%22query%22:{%22type%22:%22Ghastly%20Eye%20Jewel%22}}',
    note: 'Flat minion phys damage + Energy Shield + Cast speed'
  },
  {
    id: 'medium-cluster-life',
    title: 'Medium Cluster 4-5 Passives (Life from Death)',
    category: 'Clusters',
    url: 'https://www.pathofexile.com/trade/search/Standard?q={%22query%22:{%22type%22:%22Medium%20Cluster%20Jewel%22}}',
    note: 'Дает 4% minion life regen on minion death (45% мгновенный реген ES)'
  },
  {
    id: 'bone-ring-base',
    title: 'Bone Ring Base (Fractured Minion Speed/Dmg)',
    category: 'Craft Bases',
    url: 'https://www.pathofexile.com/trade/search/Standard?q={%22query%22:{%22type%22:%22Bone%20Ring%22}}',
    note: 'База под эндгейм крафт -7 mana cost'
  }
];

export const MASTER_T_SOULWREST_PROFILE: BuildProfile = {
  id: 'mastert-soulwrest-phys-necro',
  name: '[3.29] MasterT\'s Physical Soulwrest Necromancer',
  author: 'MasterT',
  patch: 'PoE 3.29 Champions of the Atlas',
  class: 'Witch',
  ascendancy: 'Necromancer (Catarina Bloodline)',
  archetype: '22 Phantasms / Cyclone CWC / Chaos Inoculation Tank',
  pobLink: 'https://pobb.in/fIPc0Nk32nmZ',
  defaultMapRegex: '!f ph|s rec|ur$|efe|reg|rch$',
  summary: 'Идеальный лигстартер и Т16 бластер. 22 Фантома с двойным лимитом, 9,182 ES, мгновенное восполнение энергии при поедании трупов и Dual Soulwrest X-Swap.',
  keyStats: [
    { label: 'АКТИВНЫХ ФАНТОМОВ', value: '22 Фантома', note: 'Double Cap Tech (11 + 11)', color: 'amber' },
    { label: 'ENERGY SHIELD', value: '9,182 ES', note: 'Chaos Inoculation (1 HP)', color: 'cyan' },
    { label: 'SOLO TARGET DPS', value: '30,000,000+', note: 'Pure Phys + Fresh Meat', color: 'emerald' },
    { label: 'ВЫЖИВАЕМОСТЬ (EHP)', value: '295,000 EHP', note: '26.3K Armour / 73% Block', color: 'rose' }
  ],
  levelingSteps: [
    {
      id: 'act1-1',
      act: 1,
      title: 'Акт 1: Старт и получение SRS',
      desc: 'Убейте Хиллока. Возьмите Raise Zombie у Нессы. На 4 уровне купите Summon Raging Spirit (SRS).',
      zoneTip: 'Локация The Coast -> Забегите в Tidal Island за Quicksilver Flask у Нессы.',
      recommendedGear: 'Редкий 3-линк Wand/Staff с комбинацией R-B-B сокетов, ботинки с 10% MS.',
      gemsToBuy: ['Summon Raging Spirit', 'Minion Damage Support', 'Melee Splash Support', 'Holy Flame Totem'],
      links: 'SRS + Minion Damage + Melee Splash (3-Link R-B-B)'
    },
    {
      id: 'act1-2',
      act: 1,
      title: 'Акт 1: Пещеры и Брутус',
      desc: 'Убейте Брутуса и Мервейл. Заберите Flame Dash и Clarity.',
      zoneTip: 'В Submerged Passage ищите путь к Ledge по правой/верхней стенке.',
      gemsToBuy: ['Flame Dash', 'Clarity', 'Flesh Offering']
    },
    {
      id: 'act2-1',
      act: 2,
      title: 'Акт 2: Разбойники и Спектры Кампании',
      desc: 'КВЕСТ РАЗБОЙНИКОВ (BANDITS): УБЕЙТЕ ВСЕХ РАЗБОЙНИКОВ (Kill All Bandits) для +1 Очка Пассивных навыков от Эрамира!',
      zoneTip: 'Призовите 1x Carnage Chieftain в The Old Fields или Broken Bridge для абилки Frenzy charges.',
      recommendedGear: 'Редкие кольца с Cold/Lightning Resistances (Two-Stone Rings).',
      gemsToBuy: ['Desecrate', 'Raise Spectre', 'Herald of Purity'],
      links: 'SRS + Minion Damage + Melee Splash + Melee Physical Damage'
    },
    {
      id: 'act3-1',
      act: 3,
      title: 'Акт 3: Библиотека и Первый Лабиринт',
      desc: 'Пройдите квест Сиосы в Библиотеке (The Library). Пройдите 1-й Лабиринт перед битвой с Доминусом.',
      zoneTip: 'В Библиотеке ищите 4 страницы. Сиоса продает ЛЮБЫЕ камни умений за сферы трансформации.',
      labNote: 'Лабиринт 1: Возьмите Mindless Aggression (или Bone Barrier для выживаемости).',
      gemsToBuy: ['Feeding Frenzy Support', 'Hatred', 'Convocation', 'Vulnerability']
    },
    {
      id: 'act4-1',
      act: 4,
      title: 'Акт 4: Переход на Absolution или продолжение SRS',
      desc: 'Убейте Малахая. Возьмите Carrion Golem у Петруса.',
      zoneTip: 'В Dried Lake нафармите 38-40 уровень перед входом в акведуки.',
      gemsToBuy: ['Summon Carrion Golem', 'Cast while Channelling Support', 'Cyclone']
    },
    {
      id: 'act5-7',
      act: 5,
      title: 'Акты 5-7: Второй Лабиринт и Резисты',
      desc: 'Заберите Quicksilver Flask в Акте 5. Закройте 2-й Лабиринт. Держите стихийные резисты на уровне 75%.',
      zoneTip: 'После Китавы в 5 Акте вы получаете -30% ко всем резистам. Обновите кольца с крафтом резистов!',
      labNote: 'Лабиринт 2: Возьмите Unnatural Strength (или Bone Barrier).'
    },
    {
      id: 'act8-10',
      act: 8,
      title: 'Акты 8-10: Третий Лабиринт и подготовка к 60 уровню',
      desc: 'Пройдите 3-й Лабиринт перед финальной битвой с Китавой в 10 Акте. Накопите 5-10 хаосов на покупку Soulwrest.',
      zoneTip: 'В 10 Акте перед Китавой фармите локацию Ravaged Square или Blood Aqueduct до 60-62 уровня.',
      labNote: 'Лабиринт 3: Возьмите Mistress of Sacrifice.'
    },
    {
      id: 'lvl60-swap',
      act: 11,
      title: '🔥 УРОВЕНЬ 60: СВИТЧ НА SOULWREST (КРИТИЧЕСКИЙ ЭТАП!)',
      desc: 'Купите 2 посоха Soulwrest (6 сокетов, соединенные связи НЕ НУЖНЫ!). Вставьте Summon Phantasm Support (21/20) для лимита в 22 фантома!',
      isMilestone: true,
      gemsToBuy: ['Summon Phantasm Support (21/20)', 'Fresh Meat Support', 'Brutality Support', 'Annihilation Support', 'GMP Support'],
      links: 'Посох 1 (Боссы): Summon Phantasm + Minion Damage + Fresh Meat + Predator + Brutality + Increased Crit. Посох 2 (Чистка): Summon Phantasm + Minion Damage + Fresh Meat + GMP + Faster Projectiles + Annihilation.'
    }
  ],
  gemSetups: [
    {
      slot: 'Оружие 1 (Soulwrest)',
      name: 'Посох 1: Связка на Соло-Цель / Боссов (30M DPS)',
      description: 'Вставляется в первый посох Soulwrest. Соединять сокеты связями НЕ требуется!',
      gems: [
        { name: 'Summon Phantasm Support', color: 'blue', level: '21/20', note: 'КРИТИЧЕСКИ ВАЖНО: Удваивает лимит фантомов с 11 до 22!' },
        { name: 'Minion Damage Support', color: 'blue', level: '20/20 (Awakened 5)', note: 'Огромный % More Damage множитель' },
        { name: 'Fresh Meat Support', color: 'red', level: '20/20', note: 'Дает +40% Крит-шанса и +50% Крит-мультипликатора при спавне' },
        { name: 'Predator Support', color: 'blue', level: '20/20', note: 'Дает абилку Signal Prey: Фокусирует всех 22 фантомов на босса' },
        { name: 'Brutality Support', color: 'red', level: '20/20 (Awakened 5)', note: 'Огромный физовый множитель (игнорирует Phys DR босса)' },
        { name: 'Increased Critical Strikes', color: 'blue', level: '20/20', note: 'Разгоняет крит фантомов до капа под Ancient Skull' }
      ]
    },
    {
      slot: 'Оружие 2 (Soulwrest Swap X)',
      name: 'Посох 2: Связка для Зачистки Карт (Кнопка X)',
      description: 'Переключение на кнопку X. Взрывает трупы врагов цепной реакцией на весь экран.',
      gems: [
        { name: 'Summon Phantasm Support', color: 'blue', level: '21/20', note: 'Сохраняет лимит в 22 активных фантома' },
        { name: 'Minion Damage Support', color: 'blue', level: '20/20', note: '% More урона миньонов' },
        { name: 'Fresh Meat Support', color: 'red', level: '20/20', note: 'Крит-шанс и Adrenaline при спавне' },
        { name: 'Greater Multiple Projectiles (GMP)', color: 'green', level: '20/20', note: '+4 снаряда за фантома (всего 88 снарядов на экране!)' },
        { name: 'Faster Projectiles Support', color: 'green', level: '20/20', note: 'Огромная скорость и дальность снарядов' },
        { name: 'Annihilation Support', color: 'red', level: '20/20', note: 'Критические уничтожающие удары ВЗРЫВАЮТ трупы врагов!' }
      ]
    },
    {
      slot: 'Нагрудник (6-Link)',
      name: 'Нагрудник: 6L Двигатель Поддержки Армии',
      description: 'Вставляется в Vaal Regalia. Разгоняет уровень Спектров и Анимированного Хранителя.',
      gems: [
        { name: 'Raise Spectre', color: 'blue', level: '21/20', note: 'Уровень 21 в сочетании с Empower дает +1 Макс. Спектра (Итого 4 Спектра!)' },
        { name: 'Animate Guardian (AG)', color: 'red', level: '20/20', note: 'Бессмертный Анимированный Хранитель с Kingmaker' },
        { name: 'Summon Stone Golem', color: 'red', level: '20/20', note: 'Дает регенерацию здоровья миньонам' },
        { name: 'Feeding Frenzy Support', color: 'blue', level: '20/20', note: 'Делает ИИ миньонов агрессивным и дает бафф Feeding Frenzy (+10% More Dmg)' },
        { name: 'Meat Shield Support', color: 'red', level: '20/20', note: 'Дает защитные свойства и снижение урона для Спектров и AG' },
        { name: 'Empower Support', color: 'red', level: '3 или 4', note: '+2..+3 к уровню гемов Спектра и Анимированного Хранителя' }
      ]
    },
    {
      slot: 'Шлем (4-Link)',
      name: 'Шлем: 4L Cyclone CWC Trigger Двигатель',
      description: 'Постоянно крутим Cyclone для бесконечного поедания трупов и триггера Soulwrest!',
      gems: [
        { name: 'Cyclone', color: 'green', level: '1', note: 'Уровень 1 для минимального расхода маны' },
        { name: 'Cast while Channelling (CWC)', color: 'blue', level: '20/20', note: 'Автоматически кастует Desecrate и Spirit Offering каждые 0.35 сек' },
        { name: 'Desecrate', color: 'green', level: '20/20', note: 'Создает 5 трупов под ног персонажа' },
        { name: 'Spirit Offering', color: 'blue', level: '20/20', note: 'Поедает 5 трупов непрерывно: триггерит спавн фантомов и 45% отхила HP/ES!' }
      ]
    },
    {
      slot: 'Перчатки (4-Link)',
      name: 'Перчатки: 4L Аура Двигатель',
      description: 'Обеспечивает выживаемость, оверкап резистов и физотсечение.',
      gems: [
        { name: 'Purity of Elements', color: 'blue', level: '20/20', note: 'Дает +34% ко всем элементальным резистам и иммунитет к состояниям' },
        { name: 'Flesh and Stone', color: 'red', level: '20/20', note: 'Держим в Blood Stance (Кровавой стойке) для физического дебаффа врагов' },
        { name: 'Vaal Haste', color: 'green', level: '20/20', note: 'Включаем Vaal-версию для всплеска скорости бега и атаки на боссах' },
        { name: 'Enlighten Support', color: 'blue', level: '3 или 4', note: 'Снижает удержание маны для аур' }
      ]
    },
    {
      slot: 'Ботинки (4-Link)',
      name: 'Ботинки: 4L Утилити & Проклятие',
      description: 'Перемещение, перемещение миньонов и автоматическое наложение проклятия.',
      gems: [
        { name: 'Frostblink', color: 'blue', level: '20/20', note: 'Мгновенный телепорт без задержки каста' },
        { name: 'Convocation', color: 'blue', level: '20/20', note: 'Телепортирует всех 22 фантомов и спектров прямо на ваш курсор' },
        { name: 'Sniper\'s Mark', color: 'blue', level: '20/20', note: 'Проклятие: Увеличивает физический урон снарядов и расщепляет их' },
        { name: 'Mark On Hit Support', color: 'red', level: '20/20', note: 'Автоматически навешивает Sniper\'s Mark при ударе по редким/уникальным мобам' }
      ]
    }
  ],
  gearStages: [
    {
      stage: 1,
      name: 'Стадия 1: Выход на Карты (60–75 Уровень)',
      levelRange: '60–75 Ур.',
      budget: '2–5 Chaos',
      color: 'emerald',
      items: [
        { slot: 'Оружие', item: 'Soulwrest Ezomyte Staff', note: '6 сокетов, связи не нужны. Вставьте Summon Phantasm (21/20).' },
        { slot: 'Пояс', item: 'Darkness Enthroned', note: 'С двумя Ghastly Eye самоцветами (+Flat Phys, +HP/ES).' },
        { slot: 'Амулет', item: 'The Jinxed Juju', note: '10% получаемого урона перенаправляется на Спектров.' },
        { slot: 'Шлем/Броня/Сапоги', item: 'Редкие Armour/ES', note: 'HP и стихийные сопротивления (75% cap).' }
      ]
    },
    {
      stage: 2,
      name: 'Стадия 2: Желтые и Красные Карты (75–90 Уровень)',
      levelRange: '75–90 Ур.',
      budget: '1–3 Divine',
      color: 'cyan',
      items: [
        { slot: 'Шлем', item: 'Ancient Skull (Bone Helmet)', note: '50% minion crit chance per power charge!' },
        { slot: 'Флакон', item: 'The Sorrow of the Divine', note: 'Превращает отхил флакона в мгновенный отхил ES.' },
        { slot: 'Eldritch свойства', item: 'Перчатки & Ботинки', note: 'Unnerve on hit (перчатки), Brittle Ground (ботинки).' },
        { slot: 'Пояс', item: 'Darkness Enthroned (75%+)', note: 'Топовые 4-мод Ghastly Eye самоцветы.' }
      ]
    },
    {
      stage: 3,
      name: 'Стадия 3: Финальный Эндгейм Сет (CI Свитч, 90+ Уровень)',
      levelRange: '90+ Ур.',
      budget: '5–10 Divine',
      color: 'amber',
      items: [
        { slot: 'Амулет & Keystone', item: 'Bonemeld + Chaos Inoculation', note: '+116% Global Defences, +2 Spectre level, 1 HP (100% Chaos immunity).' },
        { slot: 'Нагрудник', item: 'Vaal Regalia (1000–1150 ES)', note: 'Eldritch моды (+1% Max Res, Phys taken as Chaos/Ele).' },
        { slot: 'Кольца', item: '3.29 Bone Rings', note: 'Fractured Minion Speed/Damage, -7 Non-Channelling Mana Cost.' },
        { slot: 'Кластеры', item: 'Large 8-Passive + Medium Cluster', note: '35% inc effect + Life from Death (45% instant ES regen).' }
      ]
    }
  ],
  craftingGuides: [
    {
      id: 'regalia-craft',
      title: 'Гайд по Крафту Нагрудника 1100+ Energy Shield (Vaal Regalia)',
      description: 'Пошаговый алгоритм получения топовой Vaal Regalia на 1000–1150 ES без огромных затрат.',
      steps: [
        'ШАГ 1: Купите базу Vaal Regalia (ilvl 86+). Заточите качество до 20-30% с помощью Armourer\'s Scrap или Perfect Fossils.',
        'ШАГ 2: Спамьте 2-сокетный резонатор с Dense Fossil + Sanctified Fossil или Deafening Essence of Woe до прока Т1 % ES.',
        'ШАГ 3 (Рекомбинатор 3.29): Возьмите одну тушку с Т1 Flat ES (+100+ ES) и вторую с Т1 % ES (130%+ ES) и объедините префиксы через Рекомбинатор 3.29.',
        'ШАГ 4: Наложите Eldritch угольки: Greater Eldritch Ember (+1% max res) и Eldritch Ichor (Phys taken as Chaos).'
      ]
    },
    {
      id: 'ring-craft',
      title: 'Крафт 3.29 Колец (Bone Ring)',
      description: 'Крафт колец на урон миньонов и -7 Mana Cost.',
      steps: [
        '1. Купите Bone Ring с fractured модом (40% Minion Damage или 16% Attack/Cast Speed).',
        '2. Спамьте Deafening Essence of Fear (Minion Damage) до прока высокого ES и резистов.',
        '3. На верстаке накрафтите: -7 to Non-Channelling Skills Mana Cost.'
      ]
    },
    {
      id: 'jewel-craft',
      title: 'Крафт Ghastly Eye Самоцветов',
      description: 'Фоссильный крафт топовых самоцветов бездны.',
      steps: [
        '1. Купите базу Ghastly Eye Jewel (ilvl 84+).',
        '2. Используйте резонатор Bound Fossil + Lucent Fossil.',
        '3. Выбивает: Flat Minion Phys Damage + Energy Shield + Minion Cast Speed!'
      ]
    }
  ],
  tradeBookmarks: DEFAULT_TRADE_BOOKMARKS,
  spectreCategories: [
    {
      title: '1. Спектры Кампании',
      subtitle: 'АКТЫ 2 & 6',
      color: 'amber',
      spectres: [
        { name: 'Carnage Chieftain', location: 'Act 2 (The Old Fields / Broken Bridge) или Act 7', effect: 'Аура: Дает всем миньонам и игроку Frenzy Charges (+15% MS/Attack/Cast Speed).' },
        { name: 'Host Chieftain / Warcaller', location: 'Act 6 (The Ridge) или Act 7 (Ashen Fields)', effect: 'Аура: Дает Power Charges / Onslaught (+20% MS/Cast Speed).' }
      ]
    },
    {
      title: '2. Спектры Карт (Beyond)',
      subtitle: 'ИНОМИРИЕ',
      color: 'cyan',
      spectres: [
        { name: '2x Demon Harpy', location: 'В картах с модом Beyond / Scourge или через /global 6666', effect: 'Крик вешает 10 стаков по 5% (50% inc phys damage taken!).' },
        { name: '1x Pale Seraphim', location: 'В картах Beyond или через чат Некромантов', effect: 'Паутина вешает 15% inc damage и 15% замедления босса.' }
      ]
    },
    {
      title: '3. Топовые Спектры Ритуала',
      subtitle: 'RITUAL CORPSES',
      color: 'purple',
      spectres: [
        { name: 'Perfect Blood Demon', location: 'Ритуал или Торговля', effect: 'Дает ауру Pride (гигантский физовый множитель).' },
        { name: 'Perfect Forest Warrior', location: 'Ритуал или Торговля', effect: 'Аура Onslaught и Culling Strike (Добивание 10% HP).' },
        { name: 'Spectral Leader', location: 'Ритуал или Торговля', effect: 'Аура на +20% Action Speed ко всем действиям.' }
      ]
    }
  ],
  agSets: [
    {
      tier: 'tier3',
      tierTitle: 'Тир 3 (Endgame Best-in-Slot)',
      tierBudget: '5–10 Divine',
      slots: [
        { slotName: 'ОРУЖИЕ (WEAPON)', itemName: 'Kingmaker', itemBase: 'Despot Axe (Уникальный Топор)', tradeUrl: 'https://www.pathofexile.com/trade/search/Standard?q={%22query%22:{%22name%22:%22Kingmaker%22}}', effects: ['✨ Fortify (+20% снижение получаемого урона для вас и миньонов)', '⚡ +50% Crit Multi фантомов', '💀 Culling Strike (добивает врагов при <10% HP)'] },
        { slotName: 'ШЛЕМ (HELMET)', itemName: 'Leer Cast', itemBase: 'Festival Mask (Уникальный Шлем)', tradeUrl: 'https://www.pathofexile.com/trade/search/Standard?q={%22query%22:{%22name%22:%22Leer%20Cast%22}}', effects: ['✨ Аура 50% Inc Damage для всех союзников'] },
        { slotName: 'НАГРУДНИК (BODY)', itemName: 'Garb of Ephemeral', itemBase: 'Savagery Garb (Уникальный Нагрудник)', tradeUrl: 'https://www.pathofexile.com/trade/search/Standard?q={%22query%22:{%22name%22:%22Garb%22}}', effects: ['🛡️ Враги поблизости НЕ могут наносить критические удары', '🏃 Скорость действий не может быть снижена'] },
        { slotName: 'ПЕРЧАТКИ (GLOVES)', itemName: 'Surgebinders', itemBase: 'Dragonscale Gauntlets', tradeUrl: 'https://www.pathofexile.com/trade/search/Standard?q={%22query%22:{%22name%22:%22Surgebinders%22}}', effects: ['🔥 Elemental Damage Boost за заряды'] },
        { slotName: 'БОТИНКИ (BOOTS)', itemName: 'Windscream', itemBase: 'Reinforced Greaves', tradeUrl: 'https://www.pathofexile.com/trade/search/Standard?q={%22query%22:{%22name%22:%22Windscream%22}}', effects: ['🔮 +1 Maximum Curses (накладывает доп. проклятие)'] }
      ]
    }
  ],
  ciChecklist: [
    'Условие 1: Надет амулет Bonemeld. Амулет Bonemeld дает +116% Global Defences. Без него ваш Energy Shield будет слишком низким!',
    'Условие 2: Ваше Energy Shield (ES) не менее 4,000+. Переход на 1 HP с 2,000 ES приведёт к ваншотам от физы.',
    'Условие 3: Стихийные сопротивления (Fire/Cold/Light) ровно 75%+ (с запасом под curses).'
  ],
  farmStrategies: [
    {
      id: 'essence-farm',
      title: '1. Спидран Эссенций (Белые Карты Т1–Т5)',
      stageTag: 'СТАРТ 1-2 ДНЯ',
      description: 'Бегаем белые карты Т1-Т5 с атлас-деревом на Эссенции. 22 фантома стирают замороженных сущностей за 1 секунду.',
      profitText: '💰 Доход: 1,500+ Chaos / час. Продажа оптом крафтерам.',
      color: 'amber'
    },
    {
      id: 'blight-farm',
      title: '2. Фарм Скверны (Blight / Blighted Maps)',
      stageTag: 'АФК ФАРМ',
      description: 'Фантомы выпускают 88 снарядов на весь экран и сами закрывают дорожки Скверны, пока вы зажимаете Cyclone по центру.',
      profitText: '💰 Доход: Золотые масла, скарабеи и валюта из сундуков.',
      color: 'emerald'
    }
  ],
  atlasPresets: [
    {
      id: 'essence-blight',
      title: 'Пресет 1: Эссенции + Скверна (Day 1-3)',
      focus: 'Эссенции, Blight, Увеличение выпадания карт',
      description: 'Максимальный фарм валюты на белых и желтых картах без вложений.',
      url: 'https://www.pathofexile.com/fullscreen-atlas-skill-tree'
    },
    {
      id: 'harvest-altars',
      title: 'Пресет 2: Жатва + Алтари Пожирателя (Endgame)',
      focus: 'Harvest (Желтая жизненная сила) + Eldritch Altars',
      description: 'Фарм жизненной силы для крафта и оптовой продажи крафтерам.',
      url: 'https://www.pathofexile.com/fullscreen-atlas-skill-tree'
    }
  ]
};

export const WAVE_OF_CONVICTION_ELEMENTALIST_PROFILE: BuildProfile = {
  id: 'woc-ignite-elementalist-329',
  name: '[3.29] Wave of Conviction Ignite Elementalist',
  author: '0xAiPOE Core Team',
  patch: 'PoE 3.29 Champions of the Atlas',
  class: 'Witch',
  ascendancy: 'Elementalist (Shaper of Flames)',
  archetype: '1-Click Screen Explosion / Fire DoT / Tanky Golem Shield',
  pobLink: 'https://pobb.in/329-woc-ignite-starter',
  defaultMapRegex: '!f ph|s rec|efe|reg|rch$',
  summary: 'Самый простой, комфортный и дешевый Self-Cast кастер на Ведьму в 3.29! 1 нажатие кнопки поджигает весь экран цепной реакцией. На боссах навешивает 6-8M Ignite и позволяет спокойно бегать.',
  keyStats: [
    { label: 'IGNITE DPS ПО БОССАМ', value: '8,500,000+', note: 'Shaper of Flames + 50% Shock', color: 'emerald' },
    { label: 'ЗАЧИСТКА ЭКРАНА', value: '1 Клик (Screen Prolif)', note: 'Ignite Proliferation + Exposure', color: 'amber' },
    { label: 'ШОК НА БОССАХ', value: '50% Guaranteed Shock', note: 'Shaper of Storms (50% More Dmg)', color: 'cyan' },
    { label: 'БЮДЖЕТ ДЛЯ СТАРТА', value: '0 - 5 Chaos', note: 'Просто респек дерева и восхождения', color: 'rose' }
  ],
  levelingSteps: [
    {
      id: 'respec-step1',
      act: 11,
      title: '1. Смена Восхождения (Necromancer -> Elementalist)',
      desc: 'Пройдите 1-й (Обычный) Лабиринт за 3 минуты. Перебейте Иззаро, сбросьте 8 очков Некромантки через Алтарь Восхождения (Ascendancy Altar) и выберите Elementalist!',
      isMilestone: true,
      labNote: 'Порядок взятия нод Elementalist: 1) Shaper of Flames, 2) Mastermind of Discord, 3) Shaper of Storms, 4) Heart of Destruction (или Bastion of Elements).'
    },
    {
      id: 'respec-step2',
      act: 11,
      title: '2. Сброс Дерева Пассивок (Tree Respec)',
      desc: 'Сбросьте все миньонные ноды. Возьмите ноды Fire Damage, Damage over Time, Elemental Overload (EO), Maximum Life и Spell Damage.',
      recommendedGear: 'Крафтовый жезл на % Fire Damage / Spell Damage (Vendor recipe: Wand + Ruby Ring + Alt Orb).'
    },
    {
      id: 'respec-step3',
      act: 11,
      title: '3. Покупка Камней (0 Хаосов, у Вендоров)',
      desc: 'Купите Wave of Conviction, Ignite Proliferation, Deadly Ailments, Unbound Ailments, Burning Damage, Determination, Herald of Ash.',
      gemsToBuy: ['Wave of Conviction', 'Ignite Proliferation Support', 'Deadly Ailments Support', 'Unbound Ailments Support', 'Burning Damage Support', 'Determination', 'Herald of Ash', 'Frostblink', 'Arcanist Brand', 'Flame Surge', 'Elemental Weakness']
    }
  ],
  gemSetups: [
    {
      slot: 'Нагрудник (5-Link / 6-Link)',
      name: 'Основная Связка: Wave of Conviction Ignite Engine',
      description: 'Главная 1-кнопочная абилка зачистки и соло-урона.',
      gems: [
        { name: 'Wave of Conviction', color: 'blue', level: '20/20', note: 'Основная волна. Наносит физу/огонь и режет -40% Fire Exposure' },
        { name: 'Ignite Proliferation Support', color: 'blue', level: '20/20', note: 'Поджог мгновенно распространяется на весь экран' },
        { name: 'Deadly Ailments Support', color: 'green', level: '20/20', note: 'Огромный % More Damage для поджога (Ignite)' },
        { name: 'Unbound Ailments Support', color: 'blue', level: '20/20', note: 'Увеличивает длительность и силу поджога' },
        { name: 'Burning Damage Support', color: 'red', level: '20/20', note: '+35% More Fire Damage over Time' },
        { name: 'Cruelty Support', color: 'red', level: '20/20', note: '6-й Линк: дает бафф Cruelty на +40% DoT Damage' }
      ]
    },
    {
      slot: 'Оружие 1 (Wand 3-Link)',
      name: 'Оружие: 3L Двигатель Зачистки (Obliteration Wand)',
      description: 'Wand с роллом % Fire Damage / Spell Damage или Obliteration wand (взрывы физой).',
      gems: [
        { name: 'Frostblink', color: 'blue', level: '20/20', note: 'Мгновенный телепорт без задержки каста' },
        { name: 'Flame Dash', color: 'blue', level: '20/20', note: 'Дополнительное перемещение' },
        { name: 'Arcane Surge Support', color: 'blue', level: '1', note: 'Дает бафф на реген маны и кастспид' }
      ]
    },
    {
      slot: 'Щит (3-Link)',
      name: 'Щит: 3L Автоматический Дебафф Боссов (Arcanist Brand)',
      description: 'Бросаем Бренд на Экзарха/Босса. Он сам накладывает проклятие и озерцо горящей земли!',
      gems: [
        { name: 'Arcanist Brand', color: 'blue', level: '20/20', note: 'Автоматически кастует дебаффы на босса каждые 0.5 сек' },
        { name: 'Flame Surge', color: 'blue', level: '20/20', note: 'Создает озерцо горящей земли под боссом (+25% доп. урона Ignite)' },
        { name: 'Elemental Weakness', color: 'blue', level: '20/20', note: 'Режет резисты босса еще на -30%' }
      ]
    },
    {
      slot: 'Шлем (4-Link)',
      name: 'Шлем: 4L Аура Защиты и Урона',
      description: 'Обеспечивает броню и урон.',
      gems: [
        { name: 'Determination', color: 'red', level: '20/20', note: '+15,000 Armour для защиты от физических ваншотов' },
        { name: 'Herald of Ash', color: 'red', level: '20/20', note: '+15% More Fire Damage и взрывы горения' },
        { name: 'Defiance Banner', color: 'red', level: '20/20', note: 'Дополнительная броня и снижение критов мобов' },
        { name: 'Enlighten Support', color: 'blue', level: '3', note: 'Удержание маны' }
      ]
    }
  ],
  gearStages: [
    {
      stage: 1,
      name: 'Стадия 1: Полный Респек на Элементалистку (0-5 Chaos)',
      levelRange: '70-85 Ур.',
      budget: '0–5 Chaos',
      color: 'emerald',
      items: [
        { slot: 'Оружие', item: 'Rare Wand (Vendor recipe: Wand + Ruby Ring + Alt Orb)', note: '+% Fire Damage / Spell Damage / Fire DoT Multiplier.' },
        { slot: 'Щит', item: 'Rare Shield с HP и резистами', note: '+75 Life, 75% capped Fire/Cold/Light Resists.' },
        { slot: 'Нагрудник', item: '5-Link Rare Armour/ES Body', note: '5-линк под Wave of Conviction.' },
        { slot: 'Бижутерия', item: 'Rare Amulet / Rings с HP и Resists', note: 'Докапить резисты строго на 75%+!' }
      ]
    },
    {
      stage: 2,
      name: 'Стадия 2: Взрывы и Красные Карты Т16 (1-2 Divine)',
      levelRange: '85-92 Ур.',
      budget: '1–2 Divine',
      color: 'cyan',
      items: [
        { slot: 'Оружие', item: 'Obliteration Wand или Replica Cold Iron Point', note: 'Трупы мобов взрываются физой и передают поджог.' },
        { slot: 'Шлем', item: 'Vertex / Rare Helm с крафтом +1 Fire Gems', note: '+1 к уровню камней огня.' },
        { slot: 'Нагрудник', item: 'Skin of the Loyal / 6-Link Vaal Regalia', note: '6-линк под 8M+ Ignite DPS.' }
      ]
    }
  ],
  craftingGuides: [
    {
      id: 'woc-wand-craft',
      title: 'Крафт Оружия у Вендора (0 Хаосов!)',
      description: 'Рецепт вендора на получение оружия с % Fire Damage.',
      steps: [
        '1. Возьмите Magic Wand (синий жезл) любой базы.',
        '2. Продайте вендору: Magic Wand + Ruby Ring + 1x Orb of Alteration.',
        '3. Вы получите Wand с гарантированным роллом +20-30% Fire Damage!'
      ]
    }
  ],
  tradeBookmarks: [
    {
      id: 'woc-wand-trade',
      title: 'Wand (+1 Fire Spell Gems / Fire DoT Multi)',
      category: 'Starter',
      url: 'https://www.pathofexile.com/trade/search/Standard?q={%22query%22:{%22type%22:%22Wand%22}}',
      note: 'Жезл на урон огнем'
    }
  ],
  spectreCategories: [],
  agSets: [],
  ciChecklist: [],
  farmStrategies: [
    {
      id: 'woc-blight',
      title: '1. Скверна и Эссенции (Blight + Essences)',
      stageTag: 'АФК ОГОНЬ',
      description: 'Волна Осуждения поджигает всю волну Скверны за 1 клик.',
      profitText: '💰 Доход: Золотые масла и Эссенции на продажу.',
      color: 'emerald'
    }
  ],
  atlasPresets: [
    {
      id: 'woc-atlas-starter',
      title: 'Пресет WoC: Эссенции + Скверна (Day 1-3)',
      focus: 'Essences + Blight + Map Drop',
      description: 'Простой фарм валюты для кастера.',
      url: 'https://www.pathofexile.com/fullscreen-atlas-skill-tree'
    }
  ]
};

export const ALL_BUILD_PROFILES: BuildProfile[] = [
  MASTER_T_SOULWREST_PROFILE,
  WAVE_OF_CONVICTION_ELEMENTALIST_PROFILE
];
