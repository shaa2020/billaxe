# BillAxe Android Studio Setup Guide

## Overview
This guide will help you run BillAxe in Android Studio for mobile app development. BillAxe is built with React/TypeScript and uses Capacitor to create native Android apps.

## Prerequisites

### Required Software
1. **Node.js** (v18 or later)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **Android Studio** (latest version)
   - Download from: https://developer.android.com/studio
   - Install with Android SDK and emulator

3. **Java JDK** (JDK 11 or later)
   - Android Studio usually includes this
   - Verify: `java --version`

### Android Studio Setup
1. Open Android Studio
2. Go to **Tools → SDK Manager**
3. Install these components:
   - Android SDK Platform (API 34)
   - Android SDK Build-Tools
   - Android Emulator
   - Intel x86 Emulator Accelerator (if using Intel processor)

4. Set up environment variables:
   ```bash
   export ANDROID_SDK_ROOT=$HOME/Android/Sdk
   export PATH=$PATH:$ANDROID_SDK_ROOT/tools:$ANDROID_SDK_ROOT/platform-tools
   ```

## Step-by-Step Setup

### Step 1: Prepare the Web App
```bash
# 1. Install dependencies (if not already done)
npm install

# 2. Build the production web app
npm run build
```

### Step 2: Initialize Capacitor
```bash
# 3. Initialize Capacitor (creates native project structure)
npx cap init

# When prompted, use these values:
# App name: BillAxe
# App ID: com.billaxe.invoicemaker
# Web dir: dist/public
```

### Step 3: Add Android Platform
```bash
# 4. Add Android platform
npx cap add android

# This creates the android/ directory with native Android project
```

### Step 4: Sync Web Assets
```bash
# 5. Copy web assets to native project
npx cap sync android

# Run this command whenever you make changes to the web app
```

### Step 5: Open in Android Studio
```bash
# 6. Open the Android project in Android Studio
npx cap open android
```

## Android Studio Configuration

### Project Structure
After opening in Android Studio, you'll see:
```
android/
├── app/
│   ├── src/main/
│   │   ├── java/com/billaxe/invoicemaker/
│   │   ├── res/
│   │   └── AndroidManifest.xml
│   └── build.gradle
├── capacitor-cordova-android-plugins/
└── build.gradle
```

### Key Configuration Files

#### 1. `android/app/build.gradle`
```gradle
android {
    compileSdkVersion 34
    defaultConfig {
        applicationId "com.billaxe.invoicemaker"
        minSdkVersion 24
        targetSdkVersion 34
        versionCode 1
        versionName "1.0.0"
    }
}
```

#### 2. `android/app/src/main/AndroidManifest.xml`
Permissions are already configured for:
- Internet access
- File storage
- Camera (optional)

### App Icon and Splash Screen

#### Custom App Icon
1. Right-click `app/src/main/res` in Android Studio
2. Select **New → Image Asset**
3. Choose **Launcher Icons (Adaptive and Legacy)**
4. Upload the BillAxe logo from `client/src/assets/billaxe-logo.svg`
5. Click **Next** → **Finish**

#### Splash Screen
1. Place splash screen images in:
   - `android/app/src/main/res/drawable/splash.png`
   - `android/app/src/main/res/drawable-hdpi/splash.png`
   - `android/app/src/main/res/drawable-xhdpi/splash.png`
   - etc.

## Running the App

### Using Android Emulator
1. **Create Virtual Device:**
   - Open **AVD Manager** in Android Studio
   - Click **Create Virtual Device**
   - Choose a device (e.g., Pixel 6)
   - Select **API 34** system image
   - Click **Finish**

2. **Run the App:**
   - Click the **Run** button (green triangle) in Android Studio
   - Select your virtual device
   - Wait for the app to build and install

### Using Physical Device
1. **Enable Developer Options:**
   - Go to **Settings → About Phone**
   - Tap **Build Number** 7 times
   - Go back to **Settings → Developer Options**
   - Enable **USB Debugging**

2. **Connect Device:**
   - Connect via USB cable
   - Allow USB debugging when prompted
   - Device should appear in Android Studio

3. **Run the App:**
   - Click **Run** in Android Studio
   - Select your physical device

## Development Workflow

### Making Changes to the Web App
```bash
# 1. Make your changes to React/TypeScript code
# 2. Build the web app
npm run build

# 3. Sync changes to Android
npx cap sync android

# 4. The app will automatically reload on device/emulator
```

### Live Reload (Development)
For faster development, you can use live reload:

```bash
# 1. Start the web development server
npm run dev

# 2. Update capacitor.config.ts
# Add this to the config:
server: {
  url: 'http://localhost:5000',
  cleartext: true
}

# 3. Sync and run
npx cap sync android
npx cap run android
```

## Debugging

### Chrome DevTools
1. Open Chrome and go to: `chrome://inspect`
2. Your device should appear under **Remote Target**
3. Click **Inspect** to open DevTools
4. Debug JavaScript, view console logs, inspect elements

### Android Studio Logs
- View logs in **Logcat** window at the bottom
- Filter by your app name: `com.billaxe.invoicemaker`

### Common Issues and Solutions

#### Issue: "BUILD FAILED"
```bash
# Clean and rebuild
cd android
./gradlew clean
cd ..
npx cap sync android
```

#### Issue: "SDK not found"
- Ensure Android SDK is installed
- Check SDK path in Android Studio: **File → Project Structure → SDK Location**

#### Issue: "Device not detected"
- Enable USB debugging on device
- Install device drivers
- Try different USB cable/port

## Building for Release

### Generate Signed APK
1. **Create Keystore:**
   ```bash
   keytool -genkey -v -keystore billaxe-release.keystore -alias billaxe -keyalg RSA -keysize 2048 -validity 10000
   ```

2. **Configure Signing:**
   - In Android Studio: **Build → Generate Signed Bundle/APK**
   - Choose **APK**
   - Select your keystore file
   - Enter passwords and alias

3. **Build Release APK:**
   - Click **Build**
   - APK will be generated in `android/app/build/outputs/apk/release/`

### Publish to Google Play Store
1. **Create App Bundle (AAB):**
   - Choose **Android App Bundle** instead of APK
   - Upload to Google Play Console

2. **Store Listing:**
   - App name: **BillAxe**
   - Description: Professional invoice maker for freelancers and small businesses
   - Screenshots: Take from emulator/device
   - Icon: Use the BillAxe logo

## App Features on Mobile

### Core Functionality
- ✅ Create professional invoices
- ✅ Add line items with different unit types (hourly, daily, item)
- ✅ Automatic VAT and total calculations
- ✅ Save and load invoice templates
- ✅ Generate PDF invoices
- ✅ Company branding customization
- ✅ Dark/light theme support
- ✅ Offline capability with local storage

### Mobile Optimizations
- ✅ Responsive design for all screen sizes
- ✅ Touch-friendly UI elements
- ✅ Mobile-optimized forms and inputs
- ✅ Native Android navigation
- ✅ Proper keyboard handling
- ✅ Hardware back button support

## Support and Troubleshooting

### Capacitor Commands Reference
```bash
# View installed platforms
npx cap ls

# Update Capacitor
npm install @capacitor/core@latest @capacitor/cli@latest @capacitor/android@latest

# Copy web assets only
npx cap copy android

# Update native dependencies
npx cap update android

# Remove and re-add platform
npx cap remove android
npx cap add android
```

### Useful Resources
- **Capacitor Documentation:** https://capacitorjs.com/docs
- **Android Developer Guide:** https://developer.android.com/guide
- **React Mobile Best Practices:** https://reactnative.dev/docs/performance

### Getting Help
If you encounter issues:
1. Check the console logs in Chrome DevTools
2. Review Android Studio Logcat
3. Ensure all prerequisites are properly installed
4. Try cleaning and rebuilding the project

---

**Congratulations!** You now have BillAxe running as a native Android app. The app maintains all web functionality while providing a native mobile experience.