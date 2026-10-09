import { Platform, PermissionsAndroid } from 'react-native';
import type { ResourceObject } from 'react-native-track-player';
import { isExpoGo, loadRNTP } from './rntp';
import { PlaybackService } from './PlaybackService';

export { isExpoGo };

export type EngineStatus = 'ready' | 'expo-go' | 'error';

let enginePromise: Promise<EngineStatus> | null = null;

/**
 * Ensure the audio engine is initialized exactly once (singleton promise —
 * safe against React StrictMode double-effect invocation).
 *
 * - In Expo Go: react-native-track-player's native module is absent (and the
 *   package must never even be imported — see rntp.ts), so we short-circuit
 *   to 'expo-go' and the UI explains that a development build is needed
 *   (see README-DEV-BUILD.md).
 * - In a dev/production build: configures the player, media-notification
 *   capabilities (play / pause / next / previous / seek), the violet
 *   notification accent, and registers the remote-event PlaybackService.
 */
export function ensurePlaybackEngine(): Promise<EngineStatus> {
  enginePromise ??= setupEngine();
  return enginePromise;
}

async function setupEngine(): Promise<EngineStatus> {
  if (isExpoGo) {
    return 'expo-go';
  }
  const mod = loadRNTP();
  if (!mod) {
    return 'error';
  }
  const { default: TrackPlayer, AppKilledPlaybackBehavior, Capability } = mod;
  try {
    try {
      await TrackPlayer.setupPlayer({ autoHandleInterruptions: true });
    } catch (error) {
      // Concurrent init (StrictMode) or service restart can report
      // "already initialized" — that is fine, the player is usable.
      const code = (error as { code?: string })?.code ?? '';
      const message = String((error as Error)?.message ?? error);
      if (!/already/i.test(code) && !/already/i.test(message)) {
        throw error;
      }
    }

    await TrackPlayer.updateOptions({
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.SeekTo,
      ],
      compactCapabilities: [Capability.Play, Capability.Pause, Capability.SkipToNext],
      notificationCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
      ],
      progressUpdateEventInterval: 1,
      color: 0x8b5cf6,
      icon: require('../../../assets/icon.png') as ResourceObject,
      android: {
        appKilledPlaybackBehavior: AppKilledPlaybackBehavior.ContinuePlayback,
      },
    });

    TrackPlayer.registerPlaybackService(() => PlaybackService);

    // Android 13+ hides the media notification without the runtime
    // permission. Playback itself keeps working if the user declines.
    if (Platform.OS === 'android' && Number(Platform.Version) >= 33) {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS).catch(
        () => undefined,
      );
    }

    return 'ready';
  } catch (error) {
    console.error('[OfflineMusic] Playback engine init failed:', error);
    return 'error';
  }
}