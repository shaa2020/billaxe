# BillAxe - Android Development

## Quick Start

### Automated Setup (Recommended)
Run the setup script for your operating system:

**Linux/Mac:**
```bash
./setup-android.sh
```

**Windows:**
```batch
setup-android.bat
```

### Manual Setup
If you prefer manual setup:

```bash
# 1. Build the web app
npm run build

# 2. Initialize Capacitor
npx cap init BillAxe com.billaxe.invoicemaker --web-dir=dist/public

# 3. Add Android platform
npx cap add android

# 4. Sync assets
npx cap sync android

# 5. Open in Android Studio
npx cap open android
```

## Prerequisites
- **Node.js** (v18+): https://nodejs.org/
- **Android Studio**: https://developer.android.com/studio
- **Java JDK** (11+): Usually included with Android Studio

## What You Get
✅ Native Android app with BillAxe branding  
✅ Professional invoice generation  
✅ PDF export functionality  
✅ Template management  
✅ Offline capability  
✅ Dark/light theme support  
✅ Touch-optimized UI  

## App Configuration
- **App Name**: BillAxe
- **Package**: com.billaxe.invoicemaker
- **Min SDK**: Android 7.0 (API 24)
- **Target SDK**: Android 14 (API 34)

## Development Workflow
1. Make changes to React/TypeScript code
2. Run `npm run build`
3. Run `npx cap sync android`
4. App automatically reloads on device/emulator

## Documentation
📚 **Complete Guide**: See `ANDROID_STUDIO_SETUP.md` for detailed instructions

## Need Help?
- Check the complete setup guide in `ANDROID_STUDIO_SETUP.md`
- Ensure all prerequisites are installed
- Try the automated setup scripts first