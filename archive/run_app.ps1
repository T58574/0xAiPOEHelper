# 0xAiPOEHelper 1-Click Unified PowerShell Launcher
$ErrorActionPreference = "Stop"

$rootPath = $PSScriptRoot
if (-not $rootPath) {
    $rootPath = Get-Location
}

Write-Host "=========================================================" -ForegroundColor Yellow
Write-Host "   0xAiPOEHelper 3.29 -- Unified 1-Click Launch Engine" -ForegroundColor Cyan
Write-Host "=========================================================" -ForegroundColor Yellow
Write-Host ""

# 1. Start Go Backend in Background (Hidden Window)
Write-Host "[1/3] Starting High-Performance Go Backend (Port 3000)..." -ForegroundColor Yellow
$backendExe = Join-Path $rootPath "go_server\server.exe"
$goServerDir = Join-Path $rootPath "go_server"

if (Test-Path $backendExe) {
    $backendProc = Start-Process -FilePath $backendExe -WorkingDirectory $goServerDir -WindowStyle Hidden -PassThru
} else {
    Write-Host "Warning: server.exe not found, starting via go run main.go..." -ForegroundColor DarkYellow
    $backendProc = Start-Process -FilePath "powershell.exe" -ArgumentList "-Command cd '$goServerDir'; go run main.go" -WindowStyle Hidden -PassThru
}

# 2. Start Vite Frontend in Background (Hidden Window)
Write-Host "[2/3] Starting Web UI Server (Port 5173)..." -ForegroundColor Yellow
$frontendProc = Start-Process -FilePath "cmd.exe" -ArgumentList "/c npm --prefix web run dev -- --host" -WorkingDirectory $rootPath -WindowStyle Hidden -PassThru

# 3. Wait 2 seconds for Vite to initialize & Open Browser
Start-Sleep -Seconds 2
Write-Host "[3/3] Opening Web UI in Default Browser (http://localhost:5173)..." -ForegroundColor Green
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "=========================================================" -ForegroundColor Yellow
Write-Host " SUCCESS! 0xAiPOEHelper is active in 1-Console Mode!" -ForegroundColor Green
Write-Host " Web UI URL: http://localhost:5173" -ForegroundColor Cyan
Write-Host " Press [ENTER] or close this console to stop all servers." -ForegroundColor Gray
Write-Host "=========================================================" -ForegroundColor Yellow
Write-Host ""

[void][System.Console]::ReadLine()

# Graceful cleanup on exit
Write-Host "Stopping 0xAiPOEHelper background processes..." -ForegroundColor Yellow
if ($backendProc -and -not $backendProc.HasExited) {
    Stop-Process -Id $backendProc.Id -Force -ErrorAction SilentlyContinue
}
if ($frontendProc -and -not $frontendProc.HasExited) {
    Stop-Process -Id $frontendProc.Id -Force -ErrorAction SilentlyContinue
}
# Kill any lingering node/vite processes spawned by dev server
Get-Process node -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*vite*" } | Stop-Process -Force -ErrorAction SilentlyContinue

Write-Host "All servers stopped cleanly. Have a great PoE 3.29 League!" -ForegroundColor Green
