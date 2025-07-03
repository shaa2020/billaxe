# BillAxe Mobile Development Setup

## Overview
BillAxe is now configured for mobile development with Android Studio integration.

## App Configuration
- **App Name**: BillAxe
- **Package**: com.billaxe.invoicemaker
- **Bundle ID**: com.billaxe.invoicemaker
- **Primary Color**: #3B82F6 (Blue)
- **Logo**: Custom BillAxe logo with axe and invoice design

## For Android Studio Development

### Prerequisites
1. Install Node.js (latest LTS)
2. Install Android Studio
3. Install Capacitor CLI: `npm install -g @capacitor/cli`

### Setup Steps
```bash
# 1. Install Capacitor dependencies
npm install @capacitor/core @capacitor/android @capacitor/ios

# 2. Initialize Capacitor (if not already done)
npx cap init

# 3. Build the web app
npm run build

# 4. Add Android platform
npx cap add android

# 5. Sync web assets to native project
npx cap sync

# 6. Open in Android Studio
npx cap open android
```

### Mobile Optimizations Applied
- Responsive design with mobile-first approach
- Touch-friendly UI components
- Optimized PDF generation for mobile
- Dark mode support
- Proper viewport settings
- Mobile-friendly form inputs

### File Structure for Mobile
```
project/
├── capacitor.config.ts     # Capacitor configuration
├── mobile.config.json      # Mobile app metadata
├── android/               # Generated Android project
├── ios/                   # Generated iOS project (if added)
├── client/
│   ├── src/
│   │   ├── assets/
│   │   │   └── billaxe-logo.svg
│   │   └── ...
│   └── index.html         # Web app entry point
└── dist/public/           # Built web assets
```

### Key Features for Mobile
1. **Offline Capability**: Local storage for invoice data
2. **PDF Generation**: Client-side PDF creation
3. **Template Management**: Save and load invoice templates
4. **Responsive Design**: Works on all screen sizes
5. **Dark Mode**: System preference detection
6. **Touch Optimization**: Large touch targets

### Android Permissions
- Internet access for online features
- Storage access for PDF downloads
- Camera access for logo uploads (optional)

### Build Configuration
- Min SDK: 24 (Android 7.0)
- Target SDK: 34 (Android 14)
- Compile SDK: 34

### Next Steps for Android Studio
1. Open the generated `android/` folder in Android Studio
2. Configure signing keys for release builds
3. Test on Android emulator or device
4. Build APK/AAB for distribution

## Deployment Options
- **Play Store**: Build release AAB
- **Direct Install**: Build debug/release APK
- **Web App**: Already deployed as PWA-ready