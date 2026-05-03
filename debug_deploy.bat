@echo on
echo DEBUG START

cd /d "%~dp0"
cd redirect_worker
if %errorlevel% neq 0 (
    echo [ERROR] Cannot find redirect_worker folder.
    pause
    exit /b
)

echo [INFO] Checking Node.js version...
node -v
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH.
    pause
    exit /b
)

echo [INFO] Attempting to deploy with wrangler...
call npx wrangler deploy --dry-run
if %errorlevel% neq 0 (
    echo [ERROR] wrangler dry-run failed.
)

echo [INFO] Running final deploy command...
call npx wrangler deploy

echo.
echo DEBUG END. Window will stay open.
pause
