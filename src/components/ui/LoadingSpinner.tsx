import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface LoadingSpinnerProps {
  /** When true, renders centered in a full-screen themed container */
  fullScreen?: boolean;
  size?: 'small' | 'large';
}

/** LoadingSpinner — violet accent (inline or full screen). */
export function LoadingSpinner({ fullScreen = false, size = 'small' }: LoadingSpinnerProps) {
  const theme = useTheme();
  const spinner = <ActivityIndicator color={theme.colors.primary} size={size} />;
  if (fullScreen) {
    return (
      <View style={[styles.fullScreen, { backgroundColor: theme.colors.background }]}>{spinner}</View>
    );
  }
  return spinner;
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
