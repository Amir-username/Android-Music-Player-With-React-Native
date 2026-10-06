import React from 'react';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Text } from './Text';
import { Artwork } from './Artwork';

interface ListItemProps {
  title: string;
  /** e.g. "Artist · Album" */
  subtitle?: string;
  /** Formatted duration string, right aligned */
  duration?: string;
  artwork?: { uri?: string | null; fallbackName: string; seed?: string };
  right?: React.ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
  style?: ViewStyle;
}

/**
 * ListItem — song row (showcase `.list-item`):
 * artwork + title + meta + duration + trailing slot, 4% white pressed state.
 */
export function ListItem({ title, subtitle, duration, artwork, right, onPress, onLongPress, style }: ListItemProps) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      disabled={!onPress && !onLongPress}
      style={({ pressed }) => [
        styles.row,
        { backgroundColor: pressed ? 'rgba(255,255,255,0.04)' : 'transparent' },
        style,
      ]}
    >
      {artwork && (
        <Artwork
          size="sm"
          source={artwork.uri ? { uri: artwork.uri } : null}
          fallbackName={artwork.fallbackName}
          seed={artwork.seed}
        />
      )}
      <View style={styles.body}>
        <Text variant="title" numberOfLines={1} style={styles.title}>
          {title}
        </Text>
        {subtitle ? (
          <Text variant="caption" color="secondary" numberOfLines={1} style={styles.subtitle}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {duration ? (
        <Text variant="tiny" style={styles.duration}>
          {duration}
        </Text>
      ) : null}
      {right}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
    minHeight: 64,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    gap: 2,
  },
  title: {
    fontSize: 14,
  },
  subtitle: {
    fontSize: 12,
  },
  duration: {
    marginLeft: 4,
  },
});
