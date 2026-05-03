@echo off
echo ========================================
echo  Cloudflare Workers Redirect Deploy
echo ========================================

cd redirect_worker

rem Check if wrangler is available
call npx wrangler --version >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Wrangler (npx) is not working. Please check Node.js installation.
    pause
    exit /b
)

echo [INFO] Deploying redirect worker to Cloudflare...
call npx wrangler deploy

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Deploy failed. 
    echo Please make sure you are logged in to Cloudflare (npx wrangler login).
) else (
    echo.
    echo [SUCCESS] Redirect worker deployed successfully!
    echo Accessing seiza-official.hrk41ykr125.workers.dev will now redirect to Pages.
)

pause
