@echo off
title Launch TeleSearch
echo ========================================================
echo   Launching Telegram Channel Finder (TeleSearch)
echo ========================================================
echo.

echo [1/2] Starting Backend API on http://localhost:5000 ...
start "TeleSearch Backend (Port 5000)" cmd /k "cd /d ""%~dp0backend"" && npm start"

timeout /t 2 /nobreak >nul

echo [2/2] Starting Frontend UI on http://localhost:5173 ...
start "TeleSearch Frontend (Port 5173)" cmd /k "cd /d ""%~dp0frontend"" && npm run dev"

echo.
echo ========================================================
echo   Both services are now running!
echo   Frontend:  http://localhost:5173
echo   Backend:   http://localhost:5000
echo   Admin:     silkroad2.o / silkroad3.o
echo ========================================================
echo.
pause
