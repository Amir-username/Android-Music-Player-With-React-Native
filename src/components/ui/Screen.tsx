import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { Text } from './Text';

interface ScreenProps {
  /** Large h1 header row, with optional trailing controls */
  title?: string;
  headerRight?: React.ReactNode;
  /** Wrap content in a ScrollView (default: plain flex view) */
  scroll?: boolean;
  children: React.ReactNode;
}

/**
 * Screen — safe-area page container with themed background,
 * standard h1 header and content padding.
 */
export function Screen({ title, headerRight, scroll = false, children }: ScreenProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { colors, spacing } = theme;

  const header = title ? (
    <View style={[styles.header, { marginBottom: spacing.lg }]}>
      <Text variant="h1">{title}</Text>
      {headerRight ? <View style={styles.headerRight}>{headerRight}</View> : null}
    </View>
  ) : null;

  return (
    <View style={[styles.root, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingHorizontal: spacing.lg, paddingBottom: spacing['3xl'] + 72 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {header}
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.content, styles.flex, { paddingHorizontal: spacing.lg }]}>
          {header}
          {children}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
