import type { NavigatorScreenParams } from '@react-navigation/native';

/** Bottom tab route names + params */
export type RootTabParamList = {
  Library: undefined;
  Playlists: undefined;
  Favorites: undefined;
  Settings: undefined;
};

/** Root stack — tabs live here; Phase 1 adds NowPlaying as a modal */
export type RootStackParamList = {
  Tabs: NavigatorScreenParams<RootTabParamList> | undefined;
  // NowPlaying: undefined;        // Phase 1 — full screen player
  // AlbumDetail: { id: string };  // Phase 2 — album view
  // ArtistDetail: { id: string }; // Phase 2 — artist view
  // Queue: undefined;             // Phase 4 — queue bottom sheet host
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
