# Offline Music Player

A production-ready, offline-first music player built with **Expo (SDK 57)**, **React Native**, **TypeScript (strict)** and **Zustand**.

Fully local storage. No streaming. No accounts. Android + iOS.

> Roadmap: 0 → 100 · Current status: **Phase 0 — Foundation (0–15%) complete**

---

## Tech Stack

| Layer            | Technology                                            |
| ---------------- | ----------------------------------------------------- |
| Framework        | Expo SDK 57 (React Native 0.86, New Architecture)     |
| Language         | TypeScript 6 (strict + noUncheckedIndexedAccess)      |
| State            | Zustand v5 + persist (AsyncStorage)                   |
| Navigation       | React Navigation v7 (native-stack + bottom-tabs)      |
| UI               | Custom design system + Reanimated 4 + Gesture Handler |
| Icons            | @expo/vector-icons (Ionicons)                         |
| Fonts            | Inter (400–800) via @expo-google-fonts/inter          |
| Gradients / Blur | expo-linear-gradient / expo-blur                      |
| Haptics          | expo-haptics                                          |
| Audio (Phase 1)  | react-native-track-player (dev build, not Expo Go)    |
| Library (Ph. 2)  | expo-media-library + expo-file-system                 |

## Getting Started

```bash
npm install
npx expo start
```

Press `a` (Android) / `i` (iOS) or scan the QR code with **Expo Go**.

> Phase 0 runs fully inside **Expo Go**. Background playback (Phase 1) will
> require a development build: `npx expo run:android` / `npx expo run:ios`
> or an EAS dev client (`npx eas build --profile development`).

Type-check anytime:

```bash
npm run typecheck
```

## Design System

Dark-first, violet accent — tokens live in `src/theme/tokens.ts`
(mirror of the approved design showcase):

- **Colors** — primary `#8B5CF6`, background `#0F0F12`, surface `#1A1A1F`, card `#1E1E24`
- **Spacing** — 8pt grid (4 / 8 / 12 / 16 / 24 / 32 / 48)
- **Radius** — 6 / 10 / 16 / 24 / full
- **Shadows** — sm / md / lg + signature **violet glow**
- **Artwork fallbacks** — five 135° gradients picked deterministically per title
- **Typography** — Inter with typed text variants (`display` … `label`)

Primitives (`src/components/ui`): `Text`, `Button`, `IconButton`, `Icon`,
`Card`, `Artwork`, `ProgressBar`, `ListItem`, `SearchBar`, `EmptyState`,
`LoadingSpinner`, `Chip`, `ListRow`, `Screen`, `Toast` (+ `useToast`).

Single import surface: `@/design-system`.

## Folder Structure

```
src/
├── app/                    # (future) app-level composition
├── components/
│   ├── ui/                 # design system primitives
│   ├── player/             # (Phase 1) MiniPlayer, FullPlayer
│   └── library/            # (Phase 2) cards, lists
├── constants/              # token re-exports
├── design-system/          # barrel: import { ... } from '@/design-system'
├── hooks/                  # useTheme
├── navigation/             # RootNavigator (tabs + stack), route types
├── screens/                # Library, Playlists, Favorites, Settings
├── services/               # (Phase 1+) TrackPlayer, FileScanner, Metadata
├── stores/                 # settingsStore (Zustand + persist)
├── theme/                  # tokens, ThemeProvider (dark/light/system)
├── types/                  # Track, Album, Artist, Playlist, ...
└── utils/                  # formatDuration, gradient seeding
```

Path alias: `@/*` → `src/*` (Metro resolves tsconfig paths automatically).

## Roadmap Progress

- [x] **Phase 0 — Foundation (0–15%)**: Expo + TS strict bootstrap, design
      tokens + ThemeProvider (persisted dark/light/system), 16 UI primitives,
      bottom tabs + stack navigation, 4 screens with themed empty states,
      safe areas + status bar, `@/` path aliases, splash + app icons.
- [ ] **Phase 1 — Core Playback (15–35%)**: react-native-track-player setup,
      background + lock-screen controls, MiniPlayer, FullPlayer.
- [ ] **Phase 2 — Library & Metadata (35–55%)**: file scanning, ID3 tags,
      artwork caching, FlashList library, search/sort, album/artist screens.
- [ ] **Phase 3 — Playlists & Favorites (55–70%)**: playlist CRUD, reorder,
      favorites, smart playlists.
- [ ] **Phase 4 — Advanced Player (70–85%)**: queue sheet, shuffle/repeat,
      sleep timer, crossfade, equalizer.
- [ ] **Phase 5 — Polish (85–95%)**: skeletons, haptics, gestures, onboarding.
- [ ] **Phase 6 — Test & Release (95–100%)**: tests, signed AAB, TestFlight.
