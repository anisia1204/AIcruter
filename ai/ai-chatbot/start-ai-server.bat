@echo off
echo Starting AIcruter AI Chatbot Server...
echo.

echo Navigating to ai-chatbot directory...
cd /d "%~dp0"

echo Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo.
    echo Error: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo Starting development server...
call npm run dev

pause
