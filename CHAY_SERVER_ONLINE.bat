@echo off
cd /d "%~dp0backend"
where py >nul 2>nul || (echo Chua tim thay Python & pause & exit /b 1)
py -m pip install -r requirements.txt
echo Mo phan mem tai http://127.0.0.1:8000
start "" "http://127.0.0.1:8000"
py -m uvicorn app:app --host 0.0.0.0 --port 8000
pause
