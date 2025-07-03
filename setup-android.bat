@echo off
REM BillAxe Android Studio Setup Script for Windows
echo 🪓 Setting up BillAxe for Android Studio...

REM Check if Node.js is installed
node --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is required but not installed. Please install Node.js first.
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js found
node --version

REM Check if npm is available
npm --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm is required but not found.
    pause
    exit /b 1
)

echo ✅ npm found
npm --version

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Build the web application
echo 🔨 Building web application...
npm run build

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Build failed. Please check for errors and try again.
    pause
    exit /b 1
)

echo ✅ Web app built successfully

REM Check if Capacitor config exists
if not exist "capacitor.config.ts" (
    echo ⚡ Initializing Capacitor...
    npx cap init BillAxe com.billaxe.invoicemaker --web-dir=dist/public
) else (
    echo ✅ Capacitor already initialized
)

REM Add Android platform if not exists
if not exist "android" (
    echo 🤖 Adding Android platform...
    npx cap add android
    
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Failed to add Android platform. Make sure Android Studio is installed.
        echo    Download from: https://developer.android.com/studio
        pause
        exit /b 1
    )
    
    echo ✅ Android platform added
) else (
    echo ✅ Android platform already exists
)

REM Sync web assets
echo 🔄 Syncing web assets to Android project...
npx cap sync android

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to sync assets. Please check for errors.
    pause
    exit /b 1
)

echo ✅ Assets synced successfully

REM Try to open Android Studio
echo 🎯 Opening in Android Studio...
npx cap open android

echo.
echo 🎉 Setup complete! Next steps:
echo    1. Open Android Studio if not already opened
echo    2. Open the android/ folder as a project
echo    3. Wait for Gradle sync to complete
echo    4. Create/start an Android emulator
echo    5. Click the Run button (green triangle)
echo.
echo 📚 For detailed instructions, see: ANDROID_STUDIO_SETUP.md
echo.
echo 🔧 Development workflow:
echo    - Make changes to React/TypeScript code
echo    - Run: npm run build
echo    - Run: npx cap sync android
echo    - App will reload on device/emulator
echo.
echo 🪓 Happy coding with BillAxe!
pause