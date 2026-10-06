import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Icon } from './Icon';
import { Text } from './Text';

interface ListRowProps {
  icon?: Parameters<typeof Icon>[0]['name'];
  label: string;
  /** Static right-side value (e.g. version, current theme) */
  value?: string;
  /** Shows a chevron-right (navigable row) */
  chevron?: boolean;
  onPress?: () => void;
  /** Renders label in error color (destructive rows) */
  destructive?: boolean;
  /** Hairline separator at the bottom of the row */
  separated?: boolean;
}

/**
 * ListRow — settings/information row used inside Cards.
 * icon + label + optional value / chevron, hairline-separated.
 */
export function ListRow({ icon, label, value, chevron = false, onPress, destructive = false, separated = true }: ListRowProps) {
  const theme = useTheme();
  const { colors } = theme;
  const labelColor = destructive ? colors.error : colors.textPrimary;

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.row,
        separated && styles.separated,
        separated && { borderBottomColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
        { backgroundColor: pressed && onPress ? 'rgba(255,255,255,0.03)' : 'transparent' },
      ]}
    >
      {icon && <Icon name={icon} size={19} color={destructive ? colors.error : colors.textSecondary} />}
      <Text variant="bodyMedium" style={{ color: labelColor, flex: 1 }}>
        {label}
      </Text>
      {value ? (
        <Text variant="caption" color="secondary">
          {value}
        </Text>
      ) : null}
      {chevron && <Icon name="chevron-forward" size={17} color={colors.textTertiary} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 50,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  separated: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
