import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Text } from './Text';

interface ChipProps {
  label: string;
  active?: boolean;
  /** Optional trailing count badge */
  count?: number;
  onPress?: () => void;
}

/**
 * Chip — filter/playlist pill (showcase `.chip`).
 * Active: violet background + white text. Inactive: elevated surface.
 */
export function Chip({ label, active = false, count, onPress }: ChipProps) {
  const theme = useTheme();
  const { colors } = theme;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: active
            ? colors.primary
            : pressed
              ? colors.surfaceElevated
              : colors.surface,
          borderColor: active ? colors.primary : theme.isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)',
          ...theme.shadow.glow,
          shadowOpacity: active ? 0.35 : 0,
          elevation: active ? 6 : 0,
        },
      ]}
    >
      <Text
        variant="captionMedium"
        style={{ color: active ? '#FFFFFF' : colors.textSecondary }}
      >
        {label}
      </Text>
      {typeof count === 'number' && (
        <View
          style={[
            styles.count,
            { backgroundColor: active ? 'rgba(255,255,255,0.20)' : colors.surfaceElevated },
          ]}
        >
          <Text
            variant="tiny"
            style={{ color: active ? 'rgba(255,255,255,0.85)' : colors.textTertiary, fontSize: 10 }}
          >
            {count}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 34,
    paddingHorizontal: 14,
    borderRadius: 9999,
    borderWidth: 1,
    gap: 6,
  },
  count: {
    minWidth: 18,
    height: 18,
    paddingHorizontal: 5,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
