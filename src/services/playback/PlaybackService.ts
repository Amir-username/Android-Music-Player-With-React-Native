import { rntp } from './rntp';

/**
 * PlaybackService — invoked once when the native media service starts.
 * It registers listeners that translate remote events (notification, lock
 * screen, headset buttons, assistants) into player commands.
 *
 * All react-native-track-player access goes through the lazy rntp() loader —
 * a static import here would crash Expo Go at startup (see rntp.ts).
 *
 * Note: audio-interruption (focus loss / ducking) is handled natively by
 * `TrackPlayer.setupPlayer({ autoHandleInterruptions: true })`; the
 * RemoteDuck case below is a belt-and-braces fallback for hard pauses.
 */
export async function PlaybackService(): Promise<void> {
  const { default: TrackPlayer, Event } = rntp();

  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    void TrackPlayer.play();
  });
  TrackPlayer.addEventListener(Event.RemotePause, () => {
    void TrackPlayer.pause();
  });
  TrackPlayer.addEventListener(Event.RemoteStop, () => {
    void TrackPlayer.stop();
  });
  TrackPlayer.addEventListener(Event.RemoteNext, () => {
    TrackPlayer.skipToNext().catch(() => undefined);
  });
  TrackPlayer.addEventListener(Event.RemotePrevious, () => {
    TrackPlayer.skipToPrevious().catch(() => undefined);
  });
  TrackPlayer.addEventListener(Event.RemoteSeek, (event) => {
    void TrackPlayer.seekTo(event.position);
  });
  TrackPlayer.addEventListener(Event.RemoteDuck, (event) => {
    if (event.paused) {
      void TrackPlayer.pause();
    }
  });
}