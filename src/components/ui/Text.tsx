import React from 'react';
import { StyleSheet, Text as RNText, type TextProps as RNTextProps, type StyleProp, type TextStyle } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import type { Theme } from '@/theme';

export type TextVariant =
  | 'display' // 30 / extraBold
  | 'h1' // 24 / bold
  | 'h2' // 20 / bold
  | 'h3' // 17 / semiBold
  | 'title' // 15 / semiBold (card titles, list titles)
  | 'body' // 15 / regular
  | 'bodyMedium' // 15 / medium
  | 'caption' // 13 / regular (card body, list meta)
  | 'captionMedium' // 13 / medium
  | 'tiny' // 11 / medium (durations, times)
  | 'label'; // 11 / semiBold uppercase letterspaced ("PLAYING FROM ALBUM")

export type TextColor =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'inverse'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'accent';

interface ThemedTextProps extends RNTextProps {
  variant?: TextVariant;
  /** Text color role — resolves against the active theme palette */
  color?: TextColor;
  align?: 'left' | 'center' | 'right';
}

const variantStyles = (theme: Theme): Record<TextVariant, StyleProp<TextStyle>> => {
  const { typography, colors } = theme;
  return {
    display: {
      fontSize: typography.size['3xl'],
      fontFamily: typography.fontFamily.extraBold,
      color: colors.textPrimary,
    },
    h1: {
      fontSize: typography.size['2xl'],
      fontFamily: typography.fontFamily.bold,
      color: colors.textPrimary,
    },
    h2: {
      fontSize: typography.size.xl,
      fontFamily: typography.fontFamily.bold,
      color: colors.textPrimary,
    },
    h3: {
      fontSize: typography.size.lg,
      fontFamily: typography.fontFamily.semiBold,
      color: colors.textPrimary,
    },
    title: {
      fontSize: typography.size.base,
      fontFamily: typography.fontFamily.semiBold,
      color: colors.textPrimary,
    },
    body: {
      fontSize: typography.size.base,
      fontFamily: typography.fontFamily.regular,
      color: colors.textPrimary,
    },
    bodyMedium: {
      fontSize: typography.size.base,
      fontFamily: typography.fontFamily.medium,
      color: colors.textPrimary,
    },
    caption: {
      fontSize: typography.size.sm,
      fontFamily: typography.fontFamily.regular,
      color: colors.textSecondary,
    },
    captionMedium: {
      fontSize: typography.size.sm,
      fontFamily: typography.fontFamily.medium,
      color: colors.textSecondary,
    },
    tiny: {
      fontSize: typography.size.xs,
      fontFamily: typography.fontFamily.medium,
      color: colors.textTertiary,
    },
    label: {
      fontSize: typography.size.xs,
      fontFamily: typography.fontFamily.semiBold,
      color: colors.textTertiary,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
  };
};

const colorStyles = (theme: Theme): Record<TextColor, TextStyle> => ({
  primary: { color: theme.colors.textPrimary },
  secondary: { color: theme.colors.textSecondary },
  tertiary: { color: theme.colors.textTertiary },
  inverse: { color: theme.colors.textInverse },
  success: { color: theme.colors.success },
  warning: { color: theme.colors.warning },
  error: { color: theme.colors.error },
  info: { color: theme.colors.info },
  accent: { color: theme.colors.primary },
});

/**
 * Typed text primitive — every string in the app renders through this.
 *
 * @example
 * <Text variant="h1">Library</Text>
 * <Text variant="caption" color="secondary">M83 · Hurry Up, We're Dreaming</Text>
 */
export function Text({
  variant = 'body',
  color,
  align,
  style,
  ...rest
}: ThemedTextProps) {
  const theme = useTheme();
  const alignment = align ? { textAlign: align } : undefined;
  return (
    <RNText
      style={[
        variantStyles(theme)[variant],
        color ? colorStyles(theme)[color] : undefined,
        alignment,
        style,
      ]}
      {...rest}
    />
  );
}
