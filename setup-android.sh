#!/bin/bash

# BillAxe Android Studio Setup Script
echo "🪓 Setting up BillAxe for Android Studio..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed. Please install Node.js first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm is required but not found."
    exit 1
fi

echo "✅ npm found: $(npm --version)"

# Install dependencies if not already installed
echo "📦 Installing dependencies..."
npm install

# Check if Capacitor CLI is available
if ! command -v npx cap &> /dev/null; then
    echo "📱 Installing Capacitor CLI..."
    npm install -g @capacitor/cli
fi

# Build the web application
echo "🔨 Building web application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please check for errors and try again."
    exit 1
fi

echo "✅ Web app built successfully"

# Initialize Capacitor if not already done
if [ ! -f "capacitor.config.ts" ]; then
    echo "⚡ Initializing Capacitor..."
    npx cap init BillAxe com.billaxe.invoicemaker --web-dir=dist/public
else
    echo "✅ Capacitor already initialized"
fi

# Add Android platform if not already added
if [ ! -d "android" ]; then
    echo "🤖 Adding Android platform..."
    npx cap add android
    
    if [ $? -ne 0 ]; then
        echo "❌ Failed to add Android platform. Make sure Android Studio is installed."
        echo "   Download from: https://developer.android.com/studio"
        exit 1
    fi
    
    echo "✅ Android platform added"
else
    echo "✅ Android platform already exists"
fi

# Sync web assets to native project
echo "🔄 Syncing web assets to Android project..."
npx cap sync android

if [ $? -ne 0 ]; then
    echo "❌ Failed to sync assets. Please check for errors."
    exit 1
fi

echo "✅ Assets synced successfully"

# Check if Android Studio is available
if command -v studio &> /dev/null || command -v "Android Studio" &> /dev/null; then
    echo "🎯 Opening in Android Studio..."
    npx cap open android
else
    echo "⚠️  Android Studio not found in PATH"
    echo "   You can manually open the android/ folder in Android Studio"
    echo "   Or run: npx cap open android"
fi

echo ""
echo "🎉 Setup complete! Next steps:"
echo "   1. Open Android Studio if not already opened"
echo "   2. Open the android/ folder as a project"
echo "   3. Wait for Gradle sync to complete"
echo "   4. Create/start an Android emulator"
echo "   5. Click the Run button (green triangle)"
echo ""
echo "📚 For detailed instructions, see: ANDROID_STUDIO_SETUP.md"
echo ""
echo "🔧 Development workflow:"
echo "   - Make changes to React/TypeScript code"
echo "   - Run: npm run build"
echo "   - Run: npx cap sync android"
echo "   - App will reload on device/emulator"
echo ""
echo "🪓 Happy coding with BillAxe!"