#!/bin/bash

# Platform Cookie Extractor - Setup Verification Script
# Run this to verify everything is working before running the app

echo "🔍 Verifying Platform Cookie Extractor Setup..."
echo ""

# Check Node.js
echo "1️⃣  Checking Node.js version..."
NODE_VERSION=$(node --version 2>/dev/null)
if [ $? -eq 0 ]; then
    echo "   ✅ Node.js: $NODE_VERSION"
else
    echo "   ❌ Node.js not found! Install Node.js 18+ first."
    exit 1
fi

# Check npm
echo "2️⃣  Checking npm..."
NPM_VERSION=$(npm --version 2>/dev/null)
if [ $? -eq 0 ]; then
    echo "   ✅ npm: $NPM_VERSION"
else
    echo "   ❌ npm not found!"
    exit 1
fi

# Check node_modules
echo "3️⃣  Checking dependencies..."
if [ -d "node_modules" ]; then
    echo "   ✅ node_modules exists"
else
    echo "   ⚠️  node_modules not found. Running npm install..."
    npm install
fi

# Check critical files
echo "4️⃣  Checking project files..."
FILES=(
    "package.json"
    "src/main/index.js"
    "src/renderer/App.jsx"
    "src/automation/BrowserManager.js"
    "postcss.config.cjs"
    "tailwind.config.cjs"
)

ALL_GOOD=true
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "   ✅ $file"
    else
        echo "   ❌ $file NOT FOUND!"
        ALL_GOOD=false
    fi
done

if [ "$ALL_GOOD" = false ]; then
    echo ""
    echo "❌ Some files are missing! Check your git clone."
    exit 1
fi

# Check Playwright
echo "5️⃣  Checking Playwright browsers..."
if [ -d "$HOME/.cache/ms-playwright" ] || [ -d "$HOME/Library/Caches/ms-playwright" ]; then
    echo "   ✅ Playwright browsers installed"
else
    echo "   ⚠️  Playwright browsers not found. Installing..."
    npx playwright install chromium
fi

# Check available ports
echo "6️⃣  Checking available ports..."
PORTS=(5173 5174 5175 5176 5177)
AVAILABLE_PORT=""

for port in "${PORTS[@]}"; do
    if ! lsof -ti:$port >/dev/null 2>&1; then
        AVAILABLE_PORT=$port
        echo "   ✅ Port $port is available"
        break
    else
        echo "   ⚠️  Port $port is in use"
    fi
done

if [ -z "$AVAILABLE_PORT" ]; then
    echo "   ⚠️  All common ports are in use. Vite will auto-select another port."
else
    echo "   ✅ Vite will likely use port $AVAILABLE_PORT"
fi

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Verification Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🚀 Ready to run! Execute:"
echo ""
echo "   npm run dev"
echo ""
echo "📝 Expected behavior:"
echo "   - Vite dev server starts on port 5173-5177"
echo "   - Electron window opens in 3-5 seconds"
echo "   - UI displays with sidebar and platforms"
echo "   - DevTools opens automatically"
echo ""
echo "❓ If you see a blank screen:"
echo "   1. Check terminal for Vite port (e.g., 5175)"
echo "   2. Look for '✅ Connected to Vite dev server'"
echo "   3. See QUICK_START.md for troubleshooting"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
