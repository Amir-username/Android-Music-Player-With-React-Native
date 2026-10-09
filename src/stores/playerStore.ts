import { create } from 'zustand';
import type { Track as PlayerTrack } from 'react-native-track-player';
import { ensurePlaybackEngine } from '@/services/playback/engine';
import { loadRNTP } from '@/services/playback/rntp';
import type { Track } from '@/types';

export type PlayerStatus = 'idle' | 'initializing' | 'ready' | 'expo-go' | 'error';

/**
 * Lazy TrackPlayer accessor — never statically import 'react-native-track-player'
 * (its constants crash Expo Go at import time; see services/playback/rntp.ts).
 */
function getTrackPlayer() {
  const mod = loadRNTP();
  return mod ? mod.default : null;
}

/** Map an app Track to a react-native-track-player queue item. */
function toPlayerTrack(track: Track): PlayerTrack {
  return {
    id: track.id,
    // Bundled sample tracks pass a Metro asset number; RNTP resolves it.
    url: track.uri as string,
    title: track.title,
    artist: track.artist,
    album: track.album || undefined,
    duration: track.durationMs > 0 ? track.durationMs / 1000 : undefined,
  };
}

interface PlayerState {
  /** Engine lifecycle: idle -> initializing -> ready | expo-go | error */
  status: PlayerStatus;
  statusMessage?: string;
  /** Mirror of the TrackPlayer queue (app-level Track metadata) */
  queue: Track[];
  activeIndex: number;
  activeTrack: Track | null;
  isPlaying: boolean;
  isBuffering: boolean;
  position: number;
  duration: number;
  buffered: number;
  playbackError?: string;
  initialize: () => Promise<void>;
  /** Replace the queue and start playing at startIndex. Returns success. */
  playQueue: (tracks: Track[], startIndex?: number) => Promise<boolean>;
  togglePlayPause: () => Promise<void>;
  next: () => Promise<void>;
  previous: () => Promise<void>;
  seekTo: (seconds: number) => Promise<void>;
}

let initOnce: Promise<void> | null = null;
let listenersAttached = false;

/**
 * Global playback store. Owns the engine lifecycle and mirrors
 * react-native-track-player state into React-friendly slices.
 * Persistence (last queue/track/position) lands in Step 3.
 */
export const usePlayerStore = create<PlayerState>()((set, get) => ({
  status: 'idle',
  queue: [],
  activeIndex: -1,
  activeTrack: null,
  isPlaying: false,
  isBuffering: false,
  position: 0,
  duration: 0,
  buffered: 0,

  initialize: async () => {
    if (get().status !== 'idle') return;
    initOnce ??= (async () => {
      set({ status: 'initializing' });
      const result = await ensurePlaybackEngine();
      if (result === 'ready') {
        attachEngineListeners(set);
      }
      set({
        status: result,
        statusMessage:
          result === 'error'
            ? 'The audio engine failed to start. Try restarting the app.'
            : undefined,
      });
    })();
    await initOnce;
  },

  playQueue: async (tracks, startIndex = 0) => {
    const trackPlayer = getTrackPlayer();
    if (get().status !== 'ready' || tracks.length === 0 || !trackPlayer) return false;
    const start = Math.max(0, Math.min(startIndex, tracks.length - 1));
    set({
      queue: tracks,
      position: 0,
      duration: tracks[start]?.durationMs ? (tracks[start]!.durationMs ?? 0) / 1000 : 0,
      buffered: 0,
      playbackError: undefined,
    });
    try {
      await trackPlayer.setQueue(tracks.map(toPlayerTrack));
      if (start > 0) {
        await trackPlayer.skip(start);
      }
      await trackPlayer.play();
      set({ activeIndex: start, activeTrack: tracks[start] ?? null });
      return true;
    } catch (error) {
      console.error('[OfflineMusic] playQueue failed:', error);
      set({ playbackError: String((error as Error)?.message ?? error) });
      return false;
    }
  },

  togglePlayPause: async () => {
    const trackPlayer = getTrackPlayer();
    if (get().status !== 'ready' || !trackPlayer) return;
    try {
      if (get().isPlaying) {
        await trackPlayer.pause();
      } else {
        await trackPlayer.play();
      }
    } catch (error) {
      console.error('[OfflineMusic] togglePlayPause failed:', error);
    }
  },

  next: async () => {
    const trackPlayer = getTrackPlayer();
    if (get().status !== 'ready' || !trackPlayer) return;
    try {
      await trackPlayer.skipToNext();
    } catch {
      // No next track in queue — silently ignore.
    }
  },

  previous: async () => {
    const trackPlayer = getTrackPlayer();
    if (get().status !== 'ready' || !trackPlayer) return;
    try {
      await trackPlayer.skipToPrevious();
    } catch {
      // No previous track in queue — silently ignore.
    }
  },

  seekTo: async (seconds) => {
    const trackPlayer = getTrackPlayer();
    if (get().status !== 'ready' || !trackPlayer) return;
    try {
      await trackPlayer.seekTo(Math.max(0, seconds));
      set({ position: Math.max(0, seconds) });
    } catch (error) {
      console.error('[OfflineMusic] seekTo failed:', error);
    }
  },
}));

type Setter = (partial: Partial<PlayerState>) => void;

/** Subscribe the store to engine events (called once, engine-ready only). */
function attachEngineListeners(set: Setter): void {
  if (listenersAttached) return;
  const mod = loadRNTP();
  if (!mod) return;
  listenersAttached = true;
  const { default: TrackPlayer, Event, State } = mod;

  TrackPlayer.addEventListener(Event.PlaybackState, (event) => {
    if (event.state === State.Error) {
      set({
        isPlaying: false,
        isBuffering: false,
        playbackError: `${event.error.code}: ${event.error.message}`,
      });
      return;
    }
    set({
      isPlaying: event.state === State.Playing,
      isBuffering: event.state === State.Buffering || event.state === State.Loading,
    });
  });

  TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, (event) => {
    const { queue } = usePlayerStore.getState();
    const index = event.index ?? -1;
    set({
      activeIndex: index,
      activeTrack: index >= 0 ? (queue[index] ?? null) : null,
      position: 0,
      buffered: 0,
    });
  });

  TrackPlayer.addEventListener(Event.PlaybackProgressUpdated, (event) => {
    set({
      position: event.position,
      duration: event.duration,
      buffered: event.buffered,
    });
  });

  TrackPlayer.addEventListener(Event.PlaybackQueueEnded, () => {
    set({ isPlaying: false });
  });

  TrackPlayer.addEventListener(Event.PlaybackError, (event) => {
    set({ playbackError: `${event.code}: ${event.message}` });
  });
}