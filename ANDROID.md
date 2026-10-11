# ClassView Android (Capacitor)

GitHub Actions builds a debug APK with Capacitor and uploads it as the `classview-android-debug-apk` artifact. Pushing a tag such as `v1.0.0` also attaches the APK to a GitHub Release.

## Configure API URLs

In **GitHub → Settings → Secrets and variables → Actions → Variables**, add these repository variables:

- `VITE_API_URL` — public HTTPS API URL including `/api`, for example `https://api.example.com/api`.
- `VITE_API_URL_STREAMS` — public HTTPS backend base URL used by HLS stream URLs, for example `https://api.example.com`.

These must point to the deployed ClassView backend. Do not use `localhost` in a phone build: on Android, localhost refers to the phone itself.

Alternatively, use **Actions → Capacitor Android → Run workflow** and enter both URLs as workflow inputs.

## Download the APK

1. Open **GitHub → Actions → Capacitor Android**.
2. Open a successful run.
3. Download the `classview-android-debug-apk` artifact.
4. Extract the archive and install `app-debug.apk` on an Android test device. Android may ask you to allow installation from that source.

No Google Play account or store upload is needed. Install the downloaded APK directly on your Android phone. It is a debug APK for personal testing and manual installation.

## App icons and splash assets

The new ClassView mark is sourced from `public/favicon.png` for the web and adapted into the 1024 px icon sources under `assets/` for Capacitor. The source set includes an opaque `icon-only.png` for iOS, transparent `icon-foreground.png` plus `icon-background.png` for Android adaptive icons, and a 2732 px `splash.png`. The CI workflow installs `@capacitor/assets`, then regenerates Android and PWA resources from these files.

For local generation, install Capacitor and the asset generator, then run:

```bash
npm install --no-save --package-lock=false --no-audit --no-fund @capacitor/core@8 @capacitor/cli@8 @capacitor/android@8 @capacitor/assets
npm run build
npx cap add android # first time only
npx @capacitor/assets generate --iconBackgroundColor '#083048' --iconBackgroundColorDark '#083048' --splashBackgroundColor '#ffffff' --splashBackgroundColorDark '#ffffff'
npm run build
npx cap sync android
```

If `android/` already exists, skip `npx cap add android`. Keep the generated `android/` directory locally and use `npx cap sync android` whenever web assets or plugins change.
