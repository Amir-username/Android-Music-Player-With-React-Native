import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';

interface ProgressBarProps {
  /** 0..1 */
  progress: number;
  /** 0..1 buffered amount, rendered as a subtle layer behind the fill */
  buffered?: number;
  height?: number;
  /** Show the glowing violet thumb (full player). Hidden on mini player. */
  showThumb?: boolean;
}

/**
 * ProgressBar — track + buffered layer + animated violet fill + glow thumb
 * (showcase `.progress-track` / `.progress-fill` / `.progress-buffer`).
 */
export function ProgressBar({ progress, buffered = 0, height = 6, showThumb = true }: ProgressBarProps) {
  const theme = useTheme();
  const { colors } = theme;

  const [trackWidth, setTrackWidth] = useState(0);
  const animatedProgress = useSharedValue(progress);

  // Sync prop -> shared value (withTiming gives the fill a smooth glide)
  const targetRef = React.useRef(progress);
  if (Math.abs(targetRef.current - progress) > 0.0001) {
    targetRef.current = progress;
    animatedProgress.value = withTiming(progress, { duration: 180 });
  }

  const onLayout = useCallback(
    (e: { nativeEvent: { layout: { width: number } } }) => setTrackWidth(e.nativeEvent.layout.width),
    [],
  );

  const fillStyle = useAnimatedStyle(() => ({
    width: trackWidth * Math.min(Math.max(animatedProgress.value, 0), 1),
  }));

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX:
          trackWidth * Math.min(Math.max(animatedProgress.value, 0), 1) - THUMB_SIZE / 2,
      },
    ],
  }));

  const clampedBuffered = Math.min(Math.max(buffered, 0), 1);

  return (
    <View onLayout={onLayout} style={[styles.track, { height, borderRadius: height / 2, backgroundColor: colors.progressTrack }]}>
      {clampedBuffered > 0 && (
        <View
          style={[
            StyleSheet.absoluteFill,
            styles.buffer,
            {
              width: trackWidth * clampedBuffered,
              borderRadius: height / 2,
              backgroundColor: 'rgba(255,255,255,0.10)',
            },
          ]}
        />
      )}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          styles.fill,
          {
            borderRadius: height / 2,
            backgroundColor: colors.progress,
          },
          fillStyle,
        ]}
      />
      {showThumb && trackWidth > 0 && (
        <Animated.View style={[styles.thumb, thumbStyle]}>
          <View
            style={[
              styles.thumbDot,
              {
                backgroundColor: '#FFFFFF',
                shadowColor: colors.primary,
              },
            ]}
          />
        </Animated.View>
      )}
    </View>
  );
}

const THUMB_SIZE = 14;

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'visible',
  },
  buffer: {
    overflow: 'hidden',
  },
  fill: {
    overflow: 'hidden',
  },
  thumb: {
    position: 'absolute',
    top: '50%',
    marginTop: -THUMB_SIZE / 2,
    left: 0,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 3,
  },
});
