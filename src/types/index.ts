/**
 * Core domain types — shared across the app.
 * These power Phase 1+ (playback, library, playlists).
 */

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  albumArtist?: string;
  /** Duration in milliseconds */
  durationMs: number;
  /**
   * Audio source. Device files use a `file://` URI string; bundled sample
   * tracks use a Metro asset module number (require('*.mp3')) which
   * react-native-track-player resolves at runtime.
   */
  uri: string | number;
  artworkUri?: string;
  /** 1-based track number within the album, when available */
  trackNumber?: number;
  /** ISO date string */
  addedAt: string;
  /** Where the track came from — drives UI badges and queue grouping */
  source: 'sample' | 'device';
}

export interface Album {
  id: string;
  name: string;
  artist: string;
  artworkUri?: string;
  trackIds: string[];
  year?: number;
}

export interface Artist {
  id: string;
  name: string;
  artworkUri?: string;
  albumIds: string[];
  trackIds: string[];
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  artworkUri?: string;
  trackIds: string[];
  createdAt: string;
  updatedAt: string;
}

export type RepeatMode = 'off' | 'one' | 'all';

export type SortField = 'title' | 'artist' | 'album' | 'addedAt';

export type SortDirection = 'asc' | 'desc';

export interface ToastPayload {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
}
