@echo off
setlocal
title LAPTOP VE CHAI .COM - V4.78 CHAY PC
cd /d "%~dp0"

echo ==============================================
echo   LAPTOP VE CHAI .COM - V4.78 FIX SERVER + UI
echo ==============================================
echo.

where py >nul 2>nul
if errorlevel 1 (
  echo [LOI] Chua tim thay Python.
  echo Hay cai Python 3.10+ va thu lai.
  pause
  exit /b 1
)

if not exist "backend\requirements.txt" (
  echo [LOI] Khong tim thay backend\requirements.txt
  pause
  exit /b 1
)

echo [1/3] Kiem tra thu vien...
py -m pip install -r backend\requirements.txt

echo [2/3] Dong server cu tren cong 8000 (neu dang chay)...
for /f "tokens=5" %%P in ('netstat -ano ^| findstr :8000 ^| findstr LISTENING') do taskkill /PID %%P /F >nul 2>nul
timeout /t 1 /nobreak >nul
echo [2/3] Khoi dong may chu moi...
start "LAPTOP VE CHAI API V4.78" /min cmd /c "cd /d ""%~dp0backend"" && py -m uvicorn app:app --host 127.0.0.1 --port 8000"

timeout /t 2 /nobreak >nul

echo [3/3] Mo phan mem...
start "" "http://127.0.0.1:8000"

echo.
echo Phan mem dang chay tai:
echo http://127.0.0.1:8000
echo.
echo KHONG mo truc tiep file index.html.
echo Hay dung file CHAY_LAN.bat nay.
echo.
pause
