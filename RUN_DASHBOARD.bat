@echo off

title Jadwal Web Application

cd /d "%~dp0"



netstat -ano | findstr /R ":3000\>" >nul

if errorlevel 1 goto start_api

goto start_web



:start_api

echo ========================================================

echo   Starting Jadwal Backend API (Port 3000)...

echo ========================================================

start "Jadwal API Server" cmd /k "npm run start:dev --workspace=api"

ping 127.0.0.1 -n 3 >nul



:start_web

echo ========================================================

echo   Starting Jadwal Web Application...

echo   Opening Website: http://localhost:5173

echo ========================================================

cd /d "%~dp0apps\web"

call npm run dev -- --open

pause