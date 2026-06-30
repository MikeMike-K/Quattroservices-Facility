@echo off
cd /d "%~dp0website"
echo.
echo  Сайт: http://localhost:8080/
echo  Остановка: Ctrl+C
echo.
start http://localhost:8080/
python -m http.server 8080
