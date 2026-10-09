import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Text } from '@/components/ui/Text';
import { Icon } from '@/components/ui/Icon';
import { usePlayerStore } from '@/stores/playerStore';

/**
 * Shown when the app runs inside Expo Go, where custom native modules
 * (react-native-track-player) cannot exist. UI stays browsable; playback
 * unlocks after a development build — see README-DEV-BUILD.md.
 */
export function ExpoGoNotice() {
  const theme = useTheme();
  const status = usePlayerStore((s) => s.status);

  if (status !== 'expo-go') return null;

  return (
    <View
      style={[
        styles.banner,
        {
          backgroundColor: theme.colors.surface,
          borderColor: 'rgba(245,158,11,0.35)',
        },
      ]}
      pointerEvents="none"
    >
      <Icon name="alert-circle" size={16} color="#F59E0B" />
      <Text variant="caption" color="secondary" style={styles.text}>
        Expo Go detected — playback needs a development build (README-DEV-BUILD.md).
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 48,
    left: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  text: {
    flex: 1,
  },
});
