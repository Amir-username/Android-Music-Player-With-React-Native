import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Text } from './Text';
import { Icon, type IconName } from './Icon';
import { Button } from './Button';

interface EmptyStateProps {
  icon: IconName;
  title: string;
  description?: string;
  /** Optional call-to-action rendered under the description */
  action?: { label: string; onPress: () => void };
}

/**
 * EmptyState — icon inside a violet-tinted circle + title + description
 * (showcase `.empty-state`). Centered; drop into any flexible container.
 */
export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  const theme = useTheme();
  const { colors } = theme;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconWrap,
          {
            backgroundColor: theme.isDark ? 'rgba(139,92,246,0.12)' : 'rgba(139,92,246,0.10)',
            borderColor: theme.isDark ? 'rgba(139,92,246,0.20)' : 'rgba(139,92,246,0.16)',
          },
        ]}
      >
        <Icon name={icon} size={30} color={colors.primary} />
      </View>
      <Text variant="h3" align="center" style={styles.title}>
        {title}
      </Text>
      {description ? (
        <Text variant="caption" color="secondary" align="center" style={styles.description}>
          {description}
        </Text>
      ) : null}
      {action ? (
        <View style={styles.action}>
          <Button label={action.label} onPress={action.onPress} size="sm" />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginBottom: 16,
  },
  title: {
    marginBottom: 6,
  },
  description: {
    maxWidth: 280,
    lineHeight: 19,
  },
  action: {
    marginTop: 20,
  },
});
