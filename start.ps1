# PowerShell One-Click Launcher for Telegram Channel Finder
$baseDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Launching Telegram Channel Finder (TeleSearch)" -ForegroundColor White
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/2] Starting Backend API on http://localhost:5000 ..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$baseDir\backend'; Write-Host '--- TELESEARCH BACKEND API (PORT 5000) ---' -ForegroundColor Cyan; npm start"

Start-Sleep -Seconds 2

Write-Host "[2/2] Starting Frontend on http://localhost:5173 ..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$baseDir\frontend'; Write-Host '--- TELESEARCH FRONTEND UI (PORT 5173) ---' -ForegroundColor Cyan; npm run dev"

Write-Host ""
Write-Host "========================================================" -ForegroundColor Green
Write-Host "  Both services have been launched in separate windows!" -ForegroundColor Green
Write-Host "  Frontend URL: http://localhost:5173" -ForegroundColor White
Write-Host "  Backend API:  http://localhost:5000" -ForegroundColor White
Write-Host "  Admin Login:  silkroad2.o / silkroad3.o" -ForegroundColor White
Write-Host "========================================================" -ForegroundColor Green
