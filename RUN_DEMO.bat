@echo off
echo ========================================
echo    ArbiterMobile App Demo Launcher
echo ========================================
echo.
echo Starting the demo application...
echo.
echo This will:
echo 1. Install dependencies (first time only)
echo 2. Launch the web version in your browser
echo.
echo Please wait...
echo.

REM Check if node_modules exists, if not run npm install
if not exist "node_modules" (
    echo Installing dependencies (this may take a few minutes)...
    npm install
    if errorlevel 1 (
        echo.
        echo ERROR: Failed to install dependencies.
        echo Please make sure Node.js is installed from https://nodejs.org/
        echo.
        pause
        exit /b 1
    )
    echo Dependencies installed successfully!
    echo.
)

echo Starting the web demo...
echo.
echo The app will open in your default browser shortly.
echo If it doesn't open automatically, go to: http://localhost:8081
echo.
echo To stop the demo, press Ctrl+C in this window.
echo.

npm run web

pause
