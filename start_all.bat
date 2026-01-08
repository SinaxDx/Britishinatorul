@echo off
cd /d "%~dp0"

:: Ensure logs directory exists
if not exist "logs" mkdir logs

:: Check for node_modules and install if missing
if not exist "node_modules" (
    echo [Batch] node_modules not found. Installing dependencies...
    npm install
)

echo [Batch] Starting Britishinatorul...
echo [Batch] Output will be logged to logs folder.

:: Use PowerShell to run npm start causing all stdout/stderr to be logged to a file AND shown on screen.
powershell -NoProfile -ExecutionPolicy Bypass -Command "$ts = Get-Date -Format 'yyyy-MM-dd_HH-mm-ss'; $log = 'logs/console_' + $ts + '.log'; npm start 2>&1 | Tee-Object -FilePath $log"

pause
