# Development Build Guide (required for playback)

**Why:** Expo Go cannot include custom native modules. The audio engine
(`react-native-track-player`) is a custom native module, so playback only works
inside a **development build** (`expo-dev-client`). Everything else (UI,
navigation, theme) still runs in Expo Go — you will see a banner reminding you
of this.

Pick **one** path below:

- [Path A — EAS Build (cloud, recommended)](#path-a--eas-build-cloud-recommended)
- [Path B — Local build (Android Studio)](#path-b--local-build-android-studio)

---

## Path A — EAS Build (cloud, recommended)

No Android toolchain needed; Expo's servers compile the APK.

1. **Create a free Expo account** — https://expo.dev/signup
2. **Install EAS CLI** on your PC:
   ```bash
   npm install -g eas-cli
   ```
3. **Log in** (from the project folder):
   ```bash
   eas login
   ```
4. **Build the development APK:**
   ```bash
   eas build --profile development --platform android
   ```
   - First run asks a few questions — accept the defaults (it generates
     credentials automatically; the free tier covers this).
   - Takes ~10–20 minutes. The terminal prints a build page URL with logs.
5. **Install the APK on LDPlayer:**
   - Download the APK from the build page (or `eas build:list --platform android --limit 1`).
   - Drag the `.apk` file onto the LDPlayer window → it installs like any app.
6. **Start the dev server on your PC:**
   ```bash
   npx expo start
   ```
7. **Connect the dev client:**
   - Open the installed "Offline Music Player" app in LDPlayer.
   - If it does not auto-connect, press **Enter URL manually** and type:
     - `http://10.0.2.2:8081` (LDPlayer reaches your PC via `10.0.2.2`), **or**
     - `http://192.168.1.33:8081` (your PC's LAN IP — works because LDPlayer
       shares your PC's network).

> Your network blocked ngrok (`--tunnel`) — that's fine, you don't need it.
> The dev client connects over LAN/local NAT.

---

## Path B — Local build (Android Studio)

Faster iteration afterwards (no cloud round-trip), but needs a one-time toolchain setup.

1. **Install Android Studio** (includes JDK + SDK): https://developer.android.com/studio
   - During setup, install **Android SDK Platform** (latest) + **SDK Platform-Tools**.
2. **Set environment variables** (Windows):
   - `ANDROID_HOME` = `C:\Users\<you>\AppData\Local\Android\Sdk`
   - Add `%ANDROID_HOME%\platform-tools` to `PATH`.
3. **Connect adb to LDPlayer** (LDPlayer → Settings → Other → enable ADB):
   ```bash
   adb connect 127.0.0.1:5555
   adb devices        # should list the emulator
   ```
4. **Build + install + launch** (from the project folder):
   ```bash
   npx expo run:android
   ```
   This compiles a dev client, installs it on LDPlayer and starts Metro.

---

## Getting music onto LDPlayer

The emulator starts with no music. Two options:

**Option 1 — bundled test tracks (zero setup):**
The app ships 3 built-in test tracks ("Test tracks" section in Library).
Tap one — if audio plays and the notification appears, the engine works.

**Option 2 — your own MP3s:**
```bash
adb connect 127.0.0.1:5555
adb push "C:\path\to\song.mp3" /sdcard/Music/
```
- Restart LDPlayer (or wait a minute) so Android's media scanner indexes the files.
- In the app, tap the **scan icon** (top right of Library) → songs appear under
  "On this device".
- Tip: name files `Artist - Title.mp3` for clean labels until Phase 2 adds full
  ID3 metadata parsing.

---

## Verifying Step 1 (engine works)

1. Tap a test track → audio plays, the violet test bar appears above the tabs.
2. Play/pause/next from the bar → responds.
3. **Background the app** (Home) → audio keeps playing.
4. **Notification / lock screen** → media controls (play/pause/next/previous/seek) work.
5. Headset buttons (if supported by the emulator) → play/pause.

If something fails, check Metro logs for `[OfflineMusic]` errors and report the
exact message.

---

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| Dev client shows "Could not connect" | Check `npx expo start` is running; try both URLs above; ensure port 8081 isn't firewalled |
| `eas build` stuck / fails | Re-run with `--local` is Windows-unsupported; use Path B instead |
| No notification on Android 13+ | Allow notifications for the app in system settings |
| Scan finds nothing | Files must be indexed by MediaStore — push to `/sdcard/Music/` and reboot the emulator |
| Audio plays in Expo Go? | It doesn't — Expo Go cannot load the native engine; use the dev build |
