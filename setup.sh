#!/bin/bash

echo "🚀 CodeMentor-AI Setup Script"
echo "===================================="
echo ""

# Check Python version
echo "📦 Checking Python installation..."
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

PYTHON_VERSION=$(python3 --version 2>&1 | awk '{print $2}')
echo "✓ Found Python $PYTHON_VERSION"
echo ""

# Create virtual environment
echo "🔧 Creating virtual environment..."
if [ ! -d "venv" ]; then
    python3 -m venv venv
    source venv/bin/activate
    echo "✓ Virtual environment created and activated"
else
    source venv/bin/activate
    echo "✓ Virtual environment already exists, activated"
fi
echo ""

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt
echo "✓ Dependencies installed"
echo ""

# Check Ollama
echo "🤖 Checking Ollama installation..."
if ! command -v ollama &> /dev/null; then
    echo "⚠️  Ollama is not installed or not in PATH"
    echo "📥 Please install Ollama from: https://ollama.ai/"
    echo "   Then run: ollama pull tinyllama"
else
    echo "✓ Ollama is installed"
    
    # Check if ollama server is running
    if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
        echo "✓ Ollama server is running"
    else
        echo "⚠️  Ollama server is not running"
        echo "💡 Please run 'ollama serve' in another terminal"
    fi
fi
echo ""

# Summary
echo "===================================="
echo "✅  Setup Complete!"
echo ""
echo "📖 Next steps:"
echo "1. Make sure Ollama is running: ollama serve"
echo "2. In another terminal, run: python main.py"
echo "3. Open http://localhost:8000 in your browser"
echo ""
echo "🎯 Ready to master DSA? Let's go! 🚀"
