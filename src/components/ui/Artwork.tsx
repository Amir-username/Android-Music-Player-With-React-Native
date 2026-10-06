import React from 'react';
import { Image, StyleSheet, View, type ImageStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/hooks/useTheme';
import { gradientFor, initialOf } from '@/utils/format';
import { Text } from './Text';

type ArtworkSize = 'sm' | 'md' | 'lg' | 'xl';

interface ArtworkProps {
  size?: ArtworkSize;
  /** Remote or local URI. When absent, a gradient fallback is rendered. */
  source?: { uri: string } | null;
  /** Name used for the fallback initial + gradient seed */
  fallbackName: string;
  /** Optional explicit seed override (defaults to fallbackName) */
  seed?: string;
  /** Signature violet glow behind the artwork (full player) */
  glow?: boolean;
}

const sizeMap: Record<ArtworkSize, { box: number; radius: number; initial: number }> = {
  sm: { box: 48, radius: 10, initial: 14 },
  md: { box: 56, radius: 10, initial: 16 },
  lg: { box: 80, radius: 16, initial: 22 },
  xl: { box: 220, radius: 24, initial: 56 },
};

/**
 * Artwork — album art with deterministic gradient fallback (showcase `.artwork`).
 * When no image exists, renders a 135deg gradient picked by seed + the first
 * letter of the track/album name — every item keeps a distinct, stable look.
 */
export function Artwork({ size = 'md', source, fallbackName, seed, glow = false }: ArtworkProps) {
  const theme = useTheme();
  const { box, radius: r, initial } = sizeMap[size];
  const [from, to] = gradientFor(seed ?? fallbackName);

  return (
    <View>
      {glow && (
        <View
          pointerEvents="none"
          style={[
            styles.glow,
            {
              borderRadius: r,
              backgroundColor: theme.colors.primary,
              ...theme.shadow.glow,
            },
          ]}
        />
      )}
      <View
        style={[
          styles.frame,
          {
            width: box,
            height: box,
            borderRadius: r,
          },
          size === 'xl' ? theme.shadow.lg : undefined,
        ]}
      >
        {source?.uri ? (
          <Image source={source} style={[styles.image, { borderRadius: r }]} />
        ) : (
          <LinearGradient
            colors={[from, to]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[StyleSheet.absoluteFill, { borderRadius: r, alignItems: 'center', justifyContent: 'center' }]}
          >
            <Text
              style={{
                fontSize: initial,
                fontFamily: theme.typography.fontFamily.bold,
                color: '#FFFFFF',
              }}
            >
              {initialOf(fallbackName)}
            </Text>
          </LinearGradient>
        )}
      </View>
    </View>
  );
}

const ABS_FILL: ImageStyle = { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 };

const styles = StyleSheet.create({
  frame: {
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  image: ABS_FILL,
  glow: {
    position: 'absolute',
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
    opacity: 0.4,
  },
});
