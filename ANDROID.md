# ClassView Android (Capacitor)

GitHub Actions builds a debug APK with Capacitor and uploads it as the `classview-android-debug-apk` artifact. Pushing a tag such as `v1.0.0` also attaches the APK to a GitHub Release.

## Configure API URLs

In **GitHub → Settings → Secrets and variables → Actions → Variables**, add these repository variables:

- `VITE_API_URL` — public HTTPS API URL including `/api`, for example `https://api.example.com/api`.
- `VITE_API_URL_STREAMS` — public HTTPS backend base URL used by HLS stream URLs, for example `https://api.example.com`.

These must point to the deployed ClassView backend. Do not use `localhost` in a phone build: on Android, localhost refers to the phone itself.

Alternatively, use **Actions → Capacitor Android → Run workflow** and enter both URLs as workflow inputs. For pull requests only, if those variables are missing, the workflow uses `example.invalid` URLs to check that Android compilation succeeds; that APK will not connect to a backend and is for CI validation only.

## Download the APK

1. Open **GitHub → Actions → Capacitor Android**.
2. Open a successful run.
3. Download the `classview-android-debug-apk` artifact.
4. Extract the archive and install `app-debug.apk` on an Android test device. Android may ask you to allow installation from that source.

For a tagged run, the APK is also attached to the GitHub Release. It is a debug APK for testing and manual installation, not a signed Play Store release.

## Local Android development

The Android platform is generated during CI so the repository does not need to commit generated Gradle files. To work on the native project locally, install Capacitor 8:

```bash
npm install @capacitor/core@^8 @capacitor/android@^8
npm install -D @capacitor/cli@^8
npm run build
npx cap add android
npx cap sync android
npx cap open android
```

After the initial `npx cap add android`, keep the generated `android/` directory locally and use `npx cap sync android` whenever web assets or plugins change.
