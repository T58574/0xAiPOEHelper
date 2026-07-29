package main

import (
	"bytes"
	"compress/zlib"
	"database/sql"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net"
	"net/http"
	"os"
	"path/filepath"
	"regexp"
	"strconv"
	"strings"
	"sync"
	"time"

	_ "modernc.org/sqlite"
)

type CurrencyItem struct {
	ID          string  `json:"id"`
	League      string  `json:"league"`
	Name        string  `json:"name"`
	Category    string  `json:"category"`
	ChaosValue  float64 `json:"chaosValue"`
	DivineValue float64 `json:"divineValue"`
	Icon        string  `json:"icon,omitempty"`
}

type UniqueItem struct {
	ID          string  `json:"id"`
	League      string  `json:"league"`
	Name        string  `json:"name"`
	BaseType    string  `json:"baseType,omitempty"`
	Category    string  `json:"category"`
	ChaosValue  float64 `json:"chaosValue"`
	DivineValue float64 `json:"divineValue"`
	Icon        string  `json:"icon,omitempty"`
	Links       int     `json:"links"`
}

type MarketRatio struct {
	Title      string  `json:"title"`
	RatioText  string  `json:"ratioText"`
	Value      float64 `json:"value"`
	Unit       string  `json:"unit"`
	Trend      string  `json:"trend"`
	Category   string  `json:"category"`
	Annotation string  `json:"annotation"`
}

type FarmStrategy struct {
	Name        string   `json:"name"`
	Category    string   `json:"category"`
	EstChaosHr  int      `json:"estChaosHr"`
	EstDivHr    float64  `json:"estDivHr"`
	KeyItems    []string `json:"keyItems"`
	Difficulty  string   `json:"difficulty"`
	Description string   `json:"description"`
}

type CraftRecipe struct {
	Name         string   `json:"name"`
	BaseItem     string   `json:"baseItem"`
	EstCostDiv   float64  `json:"estCostDiv"`
	EstSaleDiv   float64  `json:"estSaleDiv"`
	ProfitMargin float64  `json:"profitMargin"`
	Method       string   `json:"method"`
	Risk         string   `json:"risk"`
	Steps        []string `json:"steps"`
}

type DivCardProfit struct {
	Name         string  `json:"name"`
	StackSize    int     `json:"stackSize"`
	CardPriceC   float64 `json:"cardPriceC"`
	Reward       string  `json:"reward"`
	RewardValDiv float64 `json:"rewardValDiv"`
	ProfitDiv    float64 `json:"profitDiv"`
}

type MetaBuild struct {
	Name         string   `json:"name"`
	Author       string   `json:"author"`
	Class        string   `json:"class"`
	Tier         string   `json:"tier"`
	Playstyle    string   `json:"playstyle"`
	CoreSkill    string   `json:"coreSkill"`
	KeyUniques   []string `json:"keyUniques"`
	EstBudgetDiv int      `json:"estBudgetDiv"`
	PoBLink      string   `json:"pobLink"`
	Pros         []string `json:"pros"`
	Cons         []string `json:"cons"`
	AuthorNote   string   `json:"authorNote"`
}

type PoBMetrics struct {
	ClassName       string   `json:"className"`
	AscendancyName  string   `json:"ascendancyName"`
	Level           int      `json:"level"`
	Life            float64  `json:"life"`
	EnergyShield    float64  `json:"energyShield"`
	DPS             float64  `json:"dps"`
	EHP             float64  `json:"ehp"`
	FireResist      float64  `json:"fireResist"`
	ColdResist      float64  `json:"coldResist"`
	LightningResist float64  `json:"lightningResist"`
	ChaosResist     float64  `json:"chaosResist"`
	SuppressChance  float64  `json:"suppressChance"`
	Warnings        []string `json:"warnings"`
	Advice          []string `json:"advice"`
}

type PatchNote struct {
	GemName    string `json:"gemName"`
	ChangeType string `json:"changeType"`
	Summary    string `json:"summary"`
	FullText   string `json:"fullText"`
}

var (
	db       *sql.DB
	dbMutex  sync.Mutex
	dbPath   string
	gemsPath string
)

func init() {
	execDir, _ := os.Getwd()
	dbPath = filepath.Join(execDir, "database", "poe_market_329_go.sqlite")
	gemsPath = filepath.Join(execDir, "329patch", "gems.md")
}

func initDB() {
	os.MkdirAll(filepath.Dir(dbPath), 0755)
	var err error
	db, err = sql.Open("sqlite", dbPath)
	if err != nil {
		log.Fatalf("Failed opening SQLite DB: %v", err)
	}

	query := `
	CREATE TABLE IF NOT EXISTS currency_prices (
		id TEXT PRIMARY KEY,
		league TEXT NOT NULL,
		name TEXT NOT NULL,
		category TEXT NOT NULL,
		chaos_value REAL NOT NULL,
		divine_value REAL,
		icon TEXT,
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);

	CREATE TABLE IF NOT EXISTS unique_prices (
		id TEXT PRIMARY KEY,
		league TEXT NOT NULL,
		name TEXT NOT NULL,
		base_type TEXT,
		category TEXT NOT NULL,
		chaos_value REAL NOT NULL,
		divine_value REAL,
		icon TEXT,
		links INTEGER DEFAULT 0,
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);
	`
	_, err = db.Exec(query)
	if err != nil {
		log.Fatalf("Failed creating DB schema: %v", err)
	}
}

func enableCORS(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
}

func fetchAvailableLeagues() []string {
	client := http.Client{Timeout: 3 * time.Second}
	resp, err := client.Get("https://poe.ninja/api/data/indexstate")
	if err == nil && resp.StatusCode == 200 {
		var state struct {
			EconomyLeagues []struct {
				Name string `json:"name"`
			} `json:"economyLeagues"`
		}
		if json.NewDecoder(resp.Body).Decode(&state) == nil && len(state.EconomyLeagues) > 0 {
			var leagues []string
			for _, l := range state.EconomyLeagues {
				leagues = append(leagues, l.Name)
			}
			resp.Body.Close()
			return leagues
		}
		resp.Body.Close()
	}
	return []string{"3.29", "Mirage", "Hardcore Mirage", "Standard", "Hardcore"}
}

func fetchActiveLeague() string {
	leagues := fetchAvailableLeagues()
	if len(leagues) > 0 {
		return leagues[0]
	}
	return "Mirage"
}

func syncPoeNinja(league string) ([]CurrencyItem, []UniqueItem, error) {
	if league == "" {
		league = fetchActiveLeague()
	}

	client := http.Client{Timeout: 5 * time.Second}
	categories := []string{"Currency", "Fragment", "Scarab", "Essence"}
	var currencies []CurrencyItem
	divineChaos := 215.0

	for _, cat := range categories {
		url := fmt.Sprintf("https://poe.ninja/api/data/currencyoverview?league=%s&type=%s", league, cat)
		resp, err := client.Get(url)
		if err != nil {
			continue
		}

		var data struct {
			Lines []struct {
				CurrencyTypeName string  `json:"currencyTypeName"`
				ChaosEquivalent  float64 `json:"chaosEquivalent"`
			} `json:"lines"`
			CurrencyDetails []struct {
				Name string `json:"name"`
				Icon string `json:"icon"`
			} `json:"currencyDetails"`
		}

		json.NewDecoder(resp.Body).Decode(&data)
		resp.Body.Close()

		iconMap := make(map[string]string)
		for _, cd := range data.CurrencyDetails {
			iconMap[cd.Name] = cd.Icon
		}

		for _, item := range data.Lines {
			if item.CurrencyTypeName == "Divine Orb" && item.ChaosEquivalent > 0 {
				divineChaos = item.ChaosEquivalent
			}
			divVal := 0.0
			if divineChaos > 0 {
				divVal = item.ChaosEquivalent / divineChaos
			}
			currencies = append(currencies, CurrencyItem{
				ID:          fmt.Sprintf("%s_%s", league, item.CurrencyTypeName),
				League:      league,
				Name:        item.CurrencyTypeName,
				Category:    cat,
				ChaosValue:  item.ChaosEquivalent,
				DivineValue: divVal,
				Icon:        iconMap[item.CurrencyTypeName],
			})
		}
	}

	if len(currencies) == 0 {
		currencies = getFallbackCurrencies(league)
	}

	dbMutex.Lock()
	tx, _ := db.Begin()
	stmt, _ := tx.Prepare(`INSERT OR REPLACE INTO currency_prices (id, league, name, category, chaos_value, divine_value, icon) VALUES (?, ?, ?, ?, ?, ?, ?)`)
	for _, c := range currencies {
		stmt.Exec(c.ID, c.League, c.Name, c.Category, c.ChaosValue, c.DivineValue, c.Icon)
	}
	stmt.Close()
	tx.Commit()
	dbMutex.Unlock()

	return currencies, nil, nil
}

func getFallbackCurrencies(league string) []CurrencyItem {
	return []CurrencyItem{
		{ID: league + "_Divine Orb", League: league, Name: "Divine Orb", Category: "Currency", ChaosValue: 215.0, DivineValue: 1.0, Icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvQ3VycmVuY3lNb2RWYWx1ZSIsIndzIjoxLCJ0IjowfV0/d010777e4e/CurrencyModValue.png"},
		{ID: league + "_Mirror of Kalandra", League: league, Name: "Mirror of Kalandra", Category: "Currency", ChaosValue: 240700.0, DivineValue: 1120.0, Icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvQ3VycmVuY3lEdXBsaWNhdGUiLCJ3cyI6MSwidCI6MH1d/72224d3106/CurrencyDuplicate.png"},
		{ID: league + "_Mirror Shard", League: league, Name: "Mirror Shard", Category: "Currency", ChaosValue: 12035.0, DivineValue: 56.0, Icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvTWlycm9yU2hhcmQiLCJ3cyI6MSwidCI6MH1d/83d2c18d09/MirrorShard.png"},
		{ID: league + "_Exalted Orb", League: league, Name: "Exalted Orb", Category: "Currency", ChaosValue: 18.5, DivineValue: 0.086, Icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvQ3VycmVuY3lBZGRNb2RUb1JhcmUiLCJ3cyI6MSwidCI6MH1d/095c52c668/CurrencyAddModToRare.png"},
		{ID: league + "_Deafening Essence of Greed", League: league, Name: "Deafening Essence of Greed", Category: "Essence", ChaosValue: 7.2, DivineValue: 0.033, Icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvRXNzZW5jZS9HcmVlZDciLCJ3cyI6MSwidCI6MH1d/078d0674ed/Greed7.png"},
		{ID: league + "_Deafening Essence of Loathing", League: league, Name: "Deafening Essence of Loathing", Category: "Essence", ChaosValue: 14.5, DivineValue: 0.067, Icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvRXNzZW5jZS9Mb2F0aGluZzciLCJ3cyI6MSwidCI6MH1d/e60a3d463b/Loathing7.png"},
		{ID: league + "_Ambush Scarab of Containment", League: league, Name: "Ambush Scarab of Containment", Category: "Scarab", ChaosValue: 140.0, DivineValue: 0.65, Icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9HcmVhdGVyU2NhcmFiQW1idXNoIiwid3MiOjEsInQiOjB9XQ/0523ec3fb3/GreaterScarabAmbush.png"},
		{ID: league + "_Divination Scarab of Plenty", League: league, Name: "Divination Scarab of Plenty", Category: "Scarab", ChaosValue: 85.0, DivineValue: 0.39, Icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9HcmVhdGVyU2NhcmFiRGl2aW5hdGlvbiIsIndzIjoxLCJ0IjowfV0/01736636aa/GreaterScarabDivination.png"},
	}
}

func getCachedCurrencies(category string) []CurrencyItem {
	dbMutex.Lock()
	defer dbMutex.Unlock()

	query := "SELECT id, league, name, category, chaos_value, divine_value, COALESCE(icon, '') FROM currency_prices"
	var rows *sql.Rows
	var err error

	if category != "" {
		query += " WHERE category = ? ORDER BY chaos_value DESC"
		rows, err = db.Query(query, category)
	} else {
		query += " ORDER BY chaos_value DESC"
		rows, err = db.Query(query)
	}

	if err != nil {
		return []CurrencyItem{}
	}
	defer rows.Close()

	var result []CurrencyItem
	for rows.Next() {
		var c CurrencyItem
		rows.Scan(&c.ID, &c.League, &c.Name, &c.Category, &c.ChaosValue, &c.DivineValue, &c.Icon)
		result = append(result, c)
	}

	if len(result) == 0 {
		return getFallbackCurrencies("Mirage")
	}

	return result
}

func getCraftingRecipes() []CraftRecipe {
	return []CraftRecipe{
		{
			Name:         "Phys Wand / Claw Crafting (Tier 1 Phys + Attack Speed)",
			BaseItem:     "Imperial Claw (ilvl 86+) / Fractured Flat Phys",
			EstCostDiv:   12.5,
			EstSaleDiv:   35.0,
			ProfitMargin: 22.5,
			Method:       "Essence of Zeal (AS) + Harvest Add/Remove Physical + Veiled Orb",
			Risk:         "Средний",
			Steps: []string{
				"1. Купить базу с фрактурным Т1 Флэт Физом (10-15 Div).",
				"2. Спамить Essence of Zeal до Т1 Crit Multi или T1 Crit Chance.",
				"3. Заблокировать префиксы (Prefixes Cannot Be Changed).",
				"4. Harvest Реролл Physical за Желтую Жатву для Т1/Т2 %Phys Damage.",
				"5. Veiled Orb для %Phys + Bleed или %Phys + Impale.",
			},
		},
		{
			Name:         "Cluster Jewel 12-Passives Spell Damage (35% Inc Effect + T1 Int/ES)",
			BaseItem:     "Large Cluster Jewel (ilvl 84+, Spell Damage / Minion Damage)",
			EstCostDiv:   8.0,
			EstSaleDiv:   28.0,
			ProfitMargin: 20.0,
			Method:       "Deafening Essence of Spite (Int) + Resonators (Fossil Craft)",
			Risk:         "Низкий",
			Steps: []string{
				"1. Купить базу 12-passives ilvl 84+ с модом Spell Damage (2-3 Div).",
				"2. Спамить Essence of Spite (T1 Intelligence) до прока 35% Increased Effect.",
				"3. Выбить саффиксы T1 Flat ES или T1 All Attributes.",
				"4. Продать крафтерам Intelligence-stacker билдов.",
			},
		},
		{
			Name:         "CoC Bow (Cast on Critical Strike + +2 Socketed Gems)",
			BaseItem:     "Spine Bow (ilvl 86+, Fractured +1 Socketed Gems)",
			EstCostDiv:   18.0,
			EstSaleDiv:   55.0,
			ProfitMargin: 37.0,
			Method:       "Essence of Woe (+Spell Dmg) + Cannot Roll Attack Mods + Exalted Orb",
			Risk:         "Низкий",
			Steps: []string{
				"1. Взять Spine Bow с фрактурным +1 Socketed Gems.",
				"2. Спамить Essence of Woe до прока T1 Attack Speed.",
				"3. Крафт метки 'Cannot Roll Attack Mods' на верстаке (2 Div).",
				"4. Использовать Exalted Orb — гарантированно прокает +1 to Level of Socketed Bow Gems!",
			},
		},
	}
}

func getDivCardProfits() []DivCardProfit {
	return []DivCardProfit{
		{Name: "The Doctor", StackSize: 8, CardPriceC: 1850.0, Reward: "Headhunter", RewardValDiv: 85.0, ProfitDiv: 16.2},
		{Name: "The Fiend", StackSize: 8, CardPriceC: 2100.0, Reward: "Corrupted Headhunter", RewardValDiv: 95.0, ProfitDiv: 16.8},
		{Name: "The Apothecary", StackSize: 5, CardPriceC: 9800.0, Reward: "Mageblood", RewardValDiv: 260.0, ProfitDiv: 32.0},
		{Name: "House of Mirrors", StackSize: 9, CardPriceC: 24500.0, Reward: "Mirror of Kalandra", RewardValDiv: 1120.0, ProfitDiv: 94.0},
		{Name: "Unrequited Love", StackSize: 19, CardPriceC: 2900.0, Reward: "19x Mirror Shard", RewardValDiv: 250.0, ProfitDiv: 14.5},
	}
}

// OFFICIAL ACTIVE BUILD FOR 3.29 COTA
func getMetaBuilds329() []MetaBuild {
	return []MetaBuild{
		{
			Name:         "[3.29] MasterT's Physical Soulwrest Necromancer",
			Author:       "MasterT",
			Class:        "Necromancer",
			Tier:         "S+ Tier (Официальный Стартер)",
			Playstyle:    "22 Phantasms / Beyblade Cyclone CWC / CI Immortal Tank",
			CoreSkill:    "Soulwrest Summon Phantasm + Cyclone CWC Desecrate Spirit Offering",
			KeyUniques:   []string{"Soulwrest", "Ancient Skull", "Bonemeld", "Darkness Enthroned", "The Sorrow of the Divine"},
			EstBudgetDiv: 2,
			PoBLink:      "https://pobb.in/fIPc0Nk32nmZ",
			Pros:         []string{"22 фантома с двойным лимитом (Summon Phantasm 21/20 в посохе)", "Неубиваемый 9,182 ES CI танк с 45% мгновенным отхилом в секунду", "Dual Soulwrest X-Swap (Соло-цель 30M DPS / Зачистка с взрывами Annihilation)", "Не требует 6-линк (достаточно 6 сокетов на посохе)"},
			Cons:         []string{"Посох надевается только с 60 уровня (акты качаются через SRS)"},
			AuthorNote:   "🔥 ГЛАВНЫЙ БИЛД ЛИГИ 3.29: Идеальный баланс зачистки, выживаемости и соло-таргет урона за пару дивайнов.",
		},
	}
}

func calculateMarketAnalytics(currencies []CurrencyItem) ([]MarketRatio, []FarmStrategy) {
	divineChaos := 215.0
	mirrorChaos := 240700.0

	for _, c := range currencies {
		if c.Name == "Divine Orb" && c.ChaosValue > 0 {
			divineChaos = c.ChaosValue
		}
		if c.Name == "Mirror of Kalandra" && c.ChaosValue > 0 {
			mirrorChaos = c.ChaosValue
		}
	}

	ratios := []MarketRatio{
		{
			Title:      "Курс Divine Orb",
			RatioText:  fmt.Sprintf("1 Div = %.0f Chaos", divineChaos),
			Value:      divineChaos,
			Unit:       "Chaos",
			Trend:      "UP",
			Category:   "Базовый курс",
			Annotation: "Основа торговли. Высокий курс увеличивает ценность ценных предметов.",
		},
		{
			Title:      "Соотношение Mirror / Divine",
			RatioText:  fmt.Sprintf("1 Mirror = %.0f Divines", mirrorChaos/divineChaos),
			Value:      mirrorChaos / divineChaos,
			Unit:       "Divine",
			Trend:      "UP",
			Category:   "Апекс Экономика",
			Annotation: "Показывает накопление капитала топовыми игроками на поздних этапах лиги.",
		},
		{
			Title:      "Плотность Эссенций (Loathing/Greed)",
			RatioText:  fmt.Sprintf("1 Div = %.1f Эссенций Loathing", divineChaos/14.5),
			Value:      14.5,
			Unit:       "Chaos / шт",
			Trend:      "STABLE",
			Category:   "Крафт Ресурсы",
			Annotation: "Стабильный доход на старте лиги. Высокий спрос у крафтеров шлемов и тушек.",
		},
		{
			Title:      "Индекс Скарабеев (Ambush / Divination)",
			RatioText:  fmt.Sprintf("1 Div = %.1f Ambush Scarabs", divineChaos/140.0),
			Value:      140.0,
			Unit:       "Chaos / шт",
			Trend:      "UP",
			Category:   "Фарм Скорость",
			Annotation: "Высокая окупаемость со стратегиями фарма сундуков (Ambush) и карт.",
		},
	}

	farms := []FarmStrategy{
		{
			Name:        "Ambush + Strongbox Farm (Сундуки)",
			Category:    "Мэппинг",
			EstChaosHr:  3200,
			EstDivHr:    15.0,
			KeyItems:    []string{"Ambush Scarab of Containment", "Strongbox Corrupted Scarab"},
			Difficulty:  "Высокая",
			Description: "Максимальный выхлоп валюты и скарабеев. Требует высокий DPS и Headhunter / Mageblood.",
		},
		{
			Name:        "Essence + Beast Speed Rush (Белые карты)",
			Category:    "Старт Лиги",
			EstChaosHr:  1500,
			EstDivHr:    7.0,
			KeyItems:    []string{"Essences", "Remnant of Corruption", "T1-T5 Maps"},
			Difficulty:  "Низкая",
			Description: "Идеально для 1-3 дня лиги. Не требует дорогого экипа. Гарантированный сбыт в опт.",
		},
		{
			Name:        "Harvest Crop Rotation (Жатва)",
			Category:    "Жатва & Крафт",
			EstChaosHr:  2400,
			EstDivHr:    11.2,
			KeyItems:    []string{"Lifeforce (Yellow/Blue)", "Sacred Blossom"},
			Difficulty:  "Средняя",
			Description: "Стабильная продажа Vital Желтой Жатвы крафтерам для верстака и рероллов.",
		},
		{
			Name:        "Ueber Bossing & Catalyst Farm",
			Category:    "Боссинг",
			EstChaosHr:  4500,
			EstDivHr:    21.0,
			KeyItems:    []string{"Progenesis", "Nimis", "Sublime Vision", "Omniscience"},
			Difficulty:  "Апекс",
			Description: "Фарм Pinnacle Боссов (Uber Mavn / Uber Exarch). Требует Min-Max билд с 50M+ Single-Target DPS.",
		},
	}

	return ratios, farms
}

func decodePoB(pobInput string) PoBMetrics {
	pobInput = strings.TrimSpace(pobInput)
	var rawXml string

	if strings.Contains(pobInput, "pobb.in") {
		parts := strings.Split(pobInput, "/")
		code := parts[len(parts)-1]
		resp, err := http.Get(fmt.Sprintf("https://pobb.in/%s/raw", code))
		if err == nil {
			body, _ := io.ReadAll(resp.Body)
			resp.Body.Close()
			rawXml = inflateB64(string(body))
		}
	} else {
		rawXml = inflateB64(pobInput)
	}

	return parsePoBXml(rawXml)
}

func inflateB64(b64 string) string {
	b64 = strings.TrimSpace(b64)
	b64 = strings.ReplaceAll(b64, "-", "+")
	b64 = strings.ReplaceAll(b64, "_", "/")
	data, err := base64.StdEncoding.DecodeString(b64)
	if err != nil {
		return ""
	}
	r, err := zlib.NewReader(bytes.NewReader(data))
	if err != nil {
		return ""
	}
	defer r.Close()
	decompressed, _ := io.ReadAll(r)
	return string(decompressed)
}

func parsePoBXml(xmlStr string) PoBMetrics {
	getStat := func(name string) float64 {
		re := regexp.MustCompile(fmt.Sprintf(`(?i)<Stat stat="%s" value="([^"]+)"`, name))
		matches := re.FindStringSubmatch(xmlStr)
		if len(matches) > 1 {
			val, _ := strconv.ParseFloat(matches[1], 64)
			return val
		}
		return 0
	}

	getAttr := func(attr string) string {
		re := regexp.MustCompile(fmt.Sprintf(`(?i)%s="([^"]+)"`, attr))
		matches := re.FindStringSubmatch(xmlStr)
		if len(matches) > 1 {
			return matches[1]
		}
		return "Unknown"
	}

	fire := getStat("FireResist")
	cold := getStat("ColdResist")
	lightning := getStat("LightningResist")
	chaos := getStat("ChaosResist")
	suppress := getStat("SpellSuppressChance")
	ehp := getStat("TotalEHP")

	var warnings []string
	var advice []string

	if fire < 75 {
		warnings = append(warnings, fmt.Sprintf("⚠️ Огонь не в капе (%.0f%% / 75%%)! Необходим добор на кольцах/сапогах.", fire))
	}
	if cold < 75 {
		warnings = append(warnings, fmt.Sprintf("⚠️ Холод не в капе (%.0f%% / 75%%)! Опасность ваншотов от заморозки.", cold))
	}
	if lightning < 75 {
		warnings = append(warnings, fmt.Sprintf("⚠️ Молния не в капе (%.0f%% / 75%%)!", lightning))
	}
	if chaos < 0 {
		warnings = append(warnings, fmt.Sprintf("⚠️ Отрицательный Хаос резист (%.0f%%)! Смертельно против токсичных мобов.", chaos))
	}
	if suppress < 100 {
		advice = append(advice, fmt.Sprintf("💡 Подавление заклинаний %.0f%%. Доведите до 100%% для удваивания EHP против чар.", suppress))
	}
	if ehp < 30000 {
		advice = append(advice, "💡 EHP ниже 30,000. Добавьте флакон Progenesis или используйте масти с дополнительными резистами.")
	}

	return PoBMetrics{
		ClassName:       getAttr("className"),
		AscendancyName:  getAttr("ascendClassName"),
		Level:           int(getStat("Level")),
		Life:            getStat("Life"),
		EnergyShield:    getStat("EnergyShield"),
		DPS:             getStat("TotalDPS"),
		EHP:             getStat("TotalEHP"),
		FireResist:      fire,
		ColdResist:      cold,
		LightningResist: lightning,
		ChaosResist:     chaos,
		SuppressChance:  suppress,
		Warnings:        warnings,
		Advice:          advice,
	}
}

func loadPatchNotes(query string) []PatchNote {
	data, err := os.ReadFile(gemsPath)
	if err != nil {
		return getFallbackPatchNotes()
	}

	lines := strings.Split(string(data), "\n")
	var notes []PatchNote
	var currentGem string
	var currentText []string

	for _, line := range lines {
		if strings.HasPrefix(line, "### ") || strings.HasPrefix(line, "## ") {
			if currentGem != "" && len(currentText) > 0 {
				notes = append(notes, makePatchNote(currentGem, strings.Join(currentText, "\n")))
			}
			currentGem = strings.TrimSpace(regexp.MustCompile(`^[#]+\s*`).ReplaceAllString(line, ""))
			currentText = []string{}
		} else {
			currentText = append(currentText, line)
		}
	}
	if currentGem != "" && len(currentText) > 0 {
		notes = append(notes, makePatchNote(currentGem, strings.Join(currentText, "\n")))
	}

	if len(notes) == 0 {
		notes = getFallbackPatchNotes()
	}

	if query == "" {
		return notes
	}

	var filtered []PatchNote
	q := strings.ToLower(query)
	for _, n := range notes {
		if strings.Contains(strings.ToLower(n.GemName), q) || strings.Contains(strings.ToLower(n.FullText), q) {
			filtered = append(filtered, n)
		}
	}
	return filtered
}

func getFallbackPatchNotes() []PatchNote {
	return []PatchNote{
		{
			GemName:    "Spark of the Nova",
			ChangeType: "BUFF",
			Summary:    "Увеличен базовый урон молнией на 18% на 20 уровне. Скорость снаряда +15%.",
			FullText:   "Spark of the Nova теперь наносит 120-2200 базового урона молнией (было 100-1850). Скорость снарядов увеличена на 15% на всех уровнях гема.",
		},
		{
			GemName:    "Blade Vortex of Reaping",
			ChangeType: "BUFF",
			Summary:    "Базовый крит BV вырос с 6% до 10%! Урон вырос на +24%.",
			FullText:   "Вихрь клинков косы имеет шанс критического удара 10.00% (ранее 6.00%). Наносит от 1684 до 2526 физического урона. Радиус +2.2 м.",
		},
		{
			GemName:    "Hexblast of Contradiction",
			ChangeType: "NERF",
			Summary:    "Hexblast нерфнут. Урон по проклятым целям снижен.",
			FullText:   "Hexblast Miner сборка потеряла мета-статус.",
		},
	}
}

func makePatchNote(gemName, text string) PatchNote {
	lower := strings.ToLower(text)
	changeType := "NEUTRAL"

	if strings.Contains(lower, "more damage") || strings.Contains(lower, "increased damage") || strings.Contains(lower, "buff") || strings.Contains(lower, "увеличен") {
		changeType = "BUFF"
	} else if strings.Contains(lower, "less damage") || strings.Contains(lower, "nerf") || strings.Contains(lower, "уменьшен") {
		changeType = "NERF"
	} else if strings.Contains(lower, "reworked") || strings.Contains(lower, "redesigned") || strings.Contains(lower, "переработан") {
		changeType = "REWORK"
	} else if strings.Contains(lower, "new gem") || strings.Contains(lower, "новый") {
		changeType = "NEW"
	}

	return PatchNote{
		GemName:    gemName,
		ChangeType: changeType,
		Summary:    text[:min(120, len(text))],
		FullText:   strings.TrimSpace(text),
	}
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}

func getLocalIP() string {
	addrs, err := net.InterfaceAddrs()
	if err != nil {
		return "localhost"
	}
	for _, address := range addrs {
		if ipnet, ok := address.(*net.IPNet); ok && !ipnet.IP.IsLoopback() {
			if ipnet.IP.To4() != nil {
				return ipnet.IP.String()
			}
		}
	}
	return "localhost"
}

func main() {
	initDB()

	// 1. Dynamic Leagues
	http.HandleFunc("/api/leagues", func(w http.ResponseWriter, r *http.Request) {
		enableCORS(w)
		leagues := fetchAvailableLeagues()
		json.NewEncoder(w).Encode(map[string]interface{}{
			"leagues":      leagues,
			"activeLeague": leagues[0],
		})
	})

	http.HandleFunc("/api/league", func(w http.ResponseWriter, r *http.Request) {
		enableCORS(w)
		active := fetchActiveLeague()
		json.NewEncoder(w).Encode(map[string]interface{}{
			"activeLeague": active,
			"status":       "Go Backend Online - Лига " + active,
		})
	})

	// 2. Currencies & Market
	http.HandleFunc("/api/market/currency", func(w http.ResponseWriter, r *http.Request) {
		enableCORS(w)
		cat := r.URL.Query().Get("category")
		currencies := getCachedCurrencies(cat)
		json.NewEncoder(w).Encode(map[string]interface{}{"currencies": currencies})
	})

	// 3. Market Analytics & Farm Strategy
	http.HandleFunc("/api/market/analytics", func(w http.ResponseWriter, r *http.Request) {
		enableCORS(w)
		cat := r.URL.Query().Get("category")
		currencies := getCachedCurrencies(cat)
		ratios, farms := calculateMarketAnalytics(currencies)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"ratios":         ratios,
			"farmStrategies": farms,
		})
	})

	// 4. Profit Crafting Calculator API
	http.HandleFunc("/api/crafting/recipes", func(w http.ResponseWriter, r *http.Request) {
		enableCORS(w)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"recipes":   getCraftingRecipes(),
			"cardFlips": getDivCardProfits(),
		})
	})

	// 5. 3.29 Meta Builds Tier List API
	http.HandleFunc("/api/meta/builds", func(w http.ResponseWriter, r *http.Request) {
		enableCORS(w)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"builds": getMetaBuilds329(),
		})
	})

	// 6. Force Live Sync
	http.HandleFunc("/api/market/sync", func(w http.ResponseWriter, r *http.Request) {
		enableCORS(w)
		league := r.URL.Query().Get("league")
		currencies, uniques, _ := syncPoeNinja(league)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"message":       "Успешная синхронизация с poe.ninja",
			"currencyCount": len(currencies),
			"uniqueCount":   len(uniques),
		})
	})

	// 7. PoB Decode
	http.HandleFunc("/api/pob/decode", func(w http.ResponseWriter, r *http.Request) {
		enableCORS(w)
		if r.Method == "OPTIONS" {
			return
		}
		var body struct {
			PoBInput string `json:"pobInput"`
		}
		json.NewDecoder(r.Body).Decode(&body)
		metrics := decodePoB(body.PoBInput)
		json.NewEncoder(w).Encode(map[string]interface{}{"metrics": metrics})
	})

	// 8. Patch Notes
	http.HandleFunc("/api/patch-notes", func(w http.ResponseWriter, r *http.Request) {
		enableCORS(w)
		q := r.URL.Query().Get("q")
		notes := loadPatchNotes(q)
		json.NewEncoder(w).Encode(map[string]interface{}{"notes": notes})
	})

	port := "3000"
	if p := os.Getenv("PORT"); p != "" {
		port = p
	}

	localIP := getLocalIP()

	fmt.Printf("=====================================================\n")
	fmt.Printf(" [0xAiPOEHelper Go LAN Server] Работает!\n")
	fmt.Printf(" Сервер: http://localhost:%s\n", port)
	fmt.Printf(" Сеть LAN: http://%s:%s\n", localIP, port)
	fmt.Printf("=====================================================\n")

	log.Fatal(http.ListenAndServe("0.0.0.0:"+port, nil))
}
