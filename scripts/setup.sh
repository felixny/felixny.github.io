#!/bin/bash

# Cross-platform setup script for Unix-like systems (macOS, Linux)

set -e

echo "🚀 Setting up Portfolio Project..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm version: $(npm -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Copy environment file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating environment file..."
    cp env.example .env.local
    echo "✅ Environment file created. Please update .env.local with your settings."
fi

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p out
mkdir -p .next

# Set up Git hooks (optional)
if [ -d .git ]; then
    echo "🔧 Setting up Git hooks..."
    # Add pre-commit hook for formatting
    cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
npm run format:check
EOF
    chmod +x .git/hooks/pre-commit
fi

echo "✅ Setup complete!"
echo ""
echo "🎯 Available commands:"
echo "  npm run dev      - Start development server"
echo "  npm run build    - Build for production"
echo "  npm run preview  - Preview production build"
echo "  npm run docker:dev - Run with Docker"
echo ""
echo "🌐 Open http://localhost:3000 to view your portfolio"
