@echo off
REM CodeMentor-AI Setup Script for Windows

echo.
echo 🚀 CodeMentor-AI Setup Script
echo ====================================
echo.

REM Check Python version
echo 📦 Checking Python installation...
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.8 or higher.
    pause
    exit /b 1
)

for /f "tokens=2" %%i in ('python --version 2^>^&1') do set PYTHON_VERSION=%%i
echo ✓ Found Python %PYTHON_VERSION%
echo.

REM Create virtual environment
echo 🔧 Creating virtual environment...
if not exist "venv" (
    python -m venv venv
    call venv\Scripts\activate.bat
    echo ✓ Virtual environment created and activated
) else (
    call venv\Scripts\activate.bat
    echo ✓ Virtual environment already exists, activated
)
echo.

REM Install dependencies
echo 📥 Installing dependencies...
pip install -r requirements.txt
echo ✓ Dependencies installed
echo.

REM Check Ollama
echo 🤖 Checking Ollama installation...
where ollama >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Ollama is not installed or not in PATH
    echo 📥 Please install Ollama from: https://ollama.ai/
    echo    Then run: ollama pull tinyllama
) else (
    echo ✓ Ollama is installed
)
echo.

REM Summary
echo ====================================
echo ✅ Setup Complete!
echo.
echo 📖 Next steps:
echo 1. Make sure Ollama is running (it should start automatically)
echo 2. Run: python main.py
echo 3. Open http://localhost:8000 in your browser
echo.
echo 🎯 Ready to master DSA? Let's go! 🚀
echo.
pause
