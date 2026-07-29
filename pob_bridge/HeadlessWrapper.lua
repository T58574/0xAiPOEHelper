-- Custom Headless Wrapper for Path of Building (0xAiPOEHelper)
-- Executes PoB calculation engine headlessly and outputs JSON stats

local args = { ... }
local command = args[1] or "calc"
local xmlFilePath = args[2]

-- Define mock environment for PoB GUI requirements
global = _G
RenderInit = function() end
SetWindowTitle = function() end
SetCursorPos = function() end
ShowCursor = function() end
SetCopyText = function() end
GetCopyText = function() return "" end
OpenURL = function() end
SetScreenMode = function() end
GetScreenSize = function() return 1920, 1080 end
SetClearColor = function() end
SetDrawLayer = function() end
SetDrawColor = function() end
DrawImage = function() end
DrawImageQuad = function() end
DrawString = function() end
DrawStringWidth = function() return 100 end
DrawStringCursorIndex = function() return 1 end
StripEscapes = function(str) return str:gsub("\127%d%d%d", ""):gsub("\127%x%x%x%x%x%x", "") end
GetTextWidth = function() return 100 end
GetTime = function() return 0 end
IsKeyDown = function() return false end
IsMouseDown = function() return false end

-- Load PoB Launch scripts if not already in global scope
if not launch then
    dofile("Launch.lua")
end

-- Initialize main PoB modules
dofile("Classes/ControlHost.lua")
dofile("Classes/Main.lua")

mainObject = main()
mainObject:Init()

-- Function to load build from XML content or file
local function loadBuild(xmlContent)
    local db = new("BuildDB")
    local build = new("Build")
    mainObject.main:SetMode("BUILD", build)
    build:Init(xmlContent)
    build:ProcessControls()
    build:BuildOutput()
    return build
end

-- Serialize output stats to JSON string format
local function jsonEscape(str)
    if not str then return '""' end
    str = tostring(str)
    str = str:gsub('\\', '\\\\'):gsub('"', '\\"'):gsub('\n', '\\n'):gsub('\r', '\\r'):gsub('\t', '\\t')
    return '"' .. str .. '"'
end

local function formatJSON(tbl)
    local parts = {}
    for k, v in pairs(tbl) do
        local keyStr = jsonEscape(tostring(k))
        local valStr = "null"
        if type(v) == "number" or type(v) == "boolean" then
            valStr = tostring(v)
        elseif type(v) == "string" then
            valStr = jsonEscape(v)
        elseif type(v) == "table" then
            valStr = formatJSON(v)
        end
        table.insert(parts, keyStr .. ":" .. valStr)
    end
    return "{" .. table.concat(parts, ",") .. "}"
end

-- Extract main output metrics
local function getBuildMetrics(build)
    local output = build.calcsTab.mainOutput
    local metrics = {
        className = build.spec.curClassName or "Unknown",
        ascendClassName = build.spec.curAscendClassName or "None",
        level = build.characterLevel or 1,
        
        -- Offense
        combinedDPS = output.CombinedDPS or output.TotalDPS or output.Dps or 0,
        totalDPS = output.TotalDPS or 0,
        hitDPS = output.TotalDot or output.TotalDPS or 0,
        dotDPS = output.TotalDot or 0,
        critChance = output.CritChance or 0,
        critMultiplier = output.CritMultiplier or 0,
        hitChance = output.HitChance or 0,
        attackRate = output.Speed or output.AttacksPerSecond or 0,
        castRate = output.CastsPerSecond or 0,
        
        -- Defense & EHP
        ehp = output.FullCollapsibleEHP or output.TotalEHP or output.EHP or 0,
        life = output.Life or 0,
        lifeUnreserved = output.LifeUnreserved or 0,
        energyShield = output.EnergyShield or 0,
        mana = output.Mana or 0,
        manaUnreserved = output.ManaUnreserved or 0,
        armour = output.Armour or 0,
        evasion = output.Evasion or 0,
        blockChance = output.BlockChance or 0,
        spellBlockChance = output.SpellBlockChance or 0,
        spellSuppression = output.SpellSuppressionChance or output.SpellSuppression or 0,
        
        -- Resistances
        fireRes = output.FireResist or 0,
        fireResOverCap = output.FireResistOverCap or 0,
        coldRes = output.ColdResist or 0,
        coldResOverCap = output.ColdResistOverCap or 0,
        lightningRes = output.LightningResist or 0,
        lightningResOverCap = output.LightningResistOverCap or 0,
        chaosRes = output.ChaosResist or 0,
        chaosResOverCap = output.ChaosResistOverCap or 0,
        
        -- Maximum Hits Taken
        physMaxHit = output.PhysicalMaximumHitTaken or 0,
        fireMaxHit = output.FireMaximumHitTaken or 0,
        coldMaxHit = output.ColdMaximumHitTaken or 0,
        lightningMaxHit = output.LightningMaximumHitTaken or 0,
        chaosMaxHit = output.ChaosMaximumHitTaken or 0,
        
        -- Active Skill Main Hand DPS
        mainSkillName = build.mainSocketGroup and build.skillsTab.socketGroupList[build.mainSocketGroup] and build.skillsTab.socketGroupList[build.mainSocketGroup].displaySkill and build.skillsTab.socketGroupList[build.mainSocketGroup].displaySkill.activeEffect.grantGive and build.skillsTab.socketGroupList[build.mainSocketGroup].displaySkill.activeEffect.grantGive.name or "Main Skill"
    }
    return metrics
end

-- Command Handlers
if xmlFilePath and io.open(xmlFilePath, "r") then
    local f = io.open(xmlFilePath, "r")
    local xmlContent = f:read("*a")
    f:close()
    
    local build = loadBuild(xmlContent)
    local metrics = getBuildMetrics(build)
    
    print("===RESULT_JSON_START===")
    print(formatJSON(metrics))
    print("===RESULT_JSON_END===")
else
    print("===RESULT_JSON_START===")
    print(formatJSON({ error = "XML file missing or unreadable" }))
    print("===RESULT_JSON_END===")
end
