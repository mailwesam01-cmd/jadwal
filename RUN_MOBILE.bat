@echo off

title Jadwal Mobile App

cd /d "%~dp0"



echo ========================================================

echo   Cleaning previous sessions...

echo ========================================================

taskkill /F /IM dart.exe >nul 2>&1



netstat -ano | findstr /R ":3000\>" >nul

if errorlevel 1 goto start_api

goto start_mobile



:start_api

echo ========================================================

echo   Starting Jadwal Backend API (Port 3000)...

echo ========================================================

start "Jadwal API Server" cmd /k "npm run start:dev --workspace=api"

ping 127.0.0.1 -n 3 >nul



:start_mobile

echo ========================================================

echo   Starting Jadwal Mobile App on Chrome...

echo   URL: http://localhost:5000

echo ========================================================

cd /d "%~dp0apps\mobile"

call flutter run -d chrome --web-port=5000

pause