import React from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface CardProps extends ViewProps {
  /** Renders as a pressable row with subtle feedback */
  children: React.ReactNode;
}

/**
 * Card — elevated surface (showcase `.card`): card background,
 * radius-lg, hairline border for depth on the dark theme.
 */
export function Card({ style, children, ...rest }: CardProps) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.card,
          borderRadius: theme.radius.lg,
          borderColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: StyleSheet.hairlineWidth,
  },
});
