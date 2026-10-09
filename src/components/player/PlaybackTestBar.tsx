
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Text } from '@/components/ui/Text';
import { IconButton } from '@/components/ui/IconButton';
import { Artwork } from '@/components/ui/Artwork';
import { usePlayerStore } from '@/stores/playerStore';

/**
 * TEMPORARY (Phase 1 Step 1): minimal playback test bar docked above the
 * tab row. Proves the engine end-to-end — tap -> sound -> media notification
 * -> background. Step 2 replaces this with the designed MiniPlayer +
 * FullPlayer (violet glow, seek bar, 64px play circle per showcase.html).
 */
export function PlaybackTestBar() {
  const theme = useTheme();
  const activeTrack = usePlayerStore((s) => s.activeTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const position = usePlayerStore((s) => s.position);
  const duration = usePlayerStore((s) => s.duration);
  const togglePlayPause = usePlayerStore((s) => s.togglePlayPause);
  const next = usePlayerStore((s) => s.next);
  const previous = usePlayerStore((s) => s.previous);

  if (!activeTrack) return null;

  const progress =
    duration > 0 ? Math.min(1, Math.max(0, position / duration)) : 0;

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: '#18181B', // design token mini-player-bg
          borderBottomColor:
            theme.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
        },
      ]}
    >
      <Artwork
        size="sm"
        source={null}
        fallbackName={activeTrack.title}
        seed={activeTrack.id}
      />
      <View style={styles.meta}>
        <Text variant="title" numberOfLines={1}>
          {activeTrack.title}
        </Text>
        <Text variant="caption" color="secondary" numberOfLines={1}>
          {activeTrack.artist}
        </Text>
      </View>
      <IconButton
        name="play-skip-back"
        size="sm"
        onPress={() => void previous()}
        accessibilityLabel="Previous track"
      />
      <IconButton
        name={isPlaying ? 'pause' : 'play'}
        size="md"
        variant="primary"
        onPress={() => void togglePlayPause()}
        accessibilityLabel={isPlaying ? 'Pause' : 'Play'}
      />
      <IconButton
        name="play-skip-forward"
        size="sm"
        onPress={() => void next()}
        accessibilityLabel="Next track"
      />
      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            { width: `${progress * 100}%`, backgroundColor: theme.colors.primary },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  meta: {
    flex: 1,
    justifyContent: 'center',
    gap: 2,
  },
  progressTrack: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  progressFill: {
    height: 2,
  },
});
