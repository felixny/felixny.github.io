@echo off
REM Cross-platform setup script for Windows

echo 🚀 Setting up Portfolio Project...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    echo    Visit: https://nodejs.org/
    pause
    exit /b 1
)

REM Check Node.js version
for /f "tokens=1 delims=v" %%i in ('node --version') do set NODE_VERSION=%%i
for /f "tokens=1 delims=." %%i in ("%NODE_VERSION%") do set NODE_MAJOR=%%i
if %NODE_MAJOR% lss 18 (
    echo ❌ Node.js version 18+ is required. Current version: 
    node --version
    pause
    exit /b 1
)

echo ✅ Node.js version: 
node --version

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ npm version: 
npm --version

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Copy environment file if it doesn't exist
if not exist .env.local (
    echo 📝 Creating environment file...
    copy env.example .env.local
    echo ✅ Environment file created. Please update .env.local with your settings.
)

REM Create necessary directories
echo 📁 Creating necessary directories...
if not exist out mkdir out
if not exist .next mkdir .next

echo ✅ Setup complete!
echo.
echo 🎯 Available commands:
echo   npm run dev      - Start development server
echo   npm run build    - Build for production
echo   npm run preview  - Preview production build
echo   npm run docker:dev - Run with Docker
echo.
echo 🌐 Open http://localhost:3000 to view your portfolio
pause
