import React, { useCallback } from 'react';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/useTheme';
import { Text } from './Text';
import { Icon, type IconName } from './Icon';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Ionicons name rendered before the label */
  icon?: IconName;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

const sizeConfig: Record<ButtonSize, { height: number; paddingHorizontal: number; fontSize: number; iconSize: number; gap: number }> = {
  sm: { height: 36, paddingHorizontal: 16, fontSize: 13, iconSize: 15, gap: 6 },
  md: { height: 44, paddingHorizontal: 22, fontSize: 15, iconSize: 17, gap: 8 },
  lg: { height: 52, paddingHorizontal: 28, fontSize: 16, iconSize: 19, gap: 8 },
};

/**
 * Button — primary (violet + glow), secondary (surface + border), ghost.
 * Press animation: scale 0.96 (showcase:active), with light haptic feedback.
 */
export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  disabled = false,
  loading = false,
  fullWidth = false,
}: ButtonProps) {
  const theme = useTheme();
  const scale = useSharedValue(1);
  const cfg = sizeConfig[size];

  const onPressIn = useCallback(() => {
    scale.value = withTiming(0.96, { duration: 100 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  }, [scale]);

  const onPressOut = useCallback(() => {
    scale.value = withTiming(1, { duration: 120 });
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const { colors } = theme;

  const containerStyle: ViewStyle = {
    height: cfg.height,
    paddingHorizontal: cfg.paddingHorizontal,
    borderRadius: theme.radius.full,
    alignSelf: fullWidth ? 'stretch' : 'flex-start',
  };

  const isDisabled = disabled || loading;

  const variantStyle: ViewStyle =
    variant === 'primary'
      ? { backgroundColor: colors.primary, ...theme.shadow.glow }
      : variant === 'secondary'
        ? {
            backgroundColor: colors.card,
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.10)',
          }
        : { backgroundColor: 'transparent' };

  const labelColor =
    variant === 'primary' ? colors.textInverse : variant === 'secondary' ? colors.textPrimary : colors.textSecondary;

  const labelVariant = size === 'sm' ? 'captionMedium' : 'bodyMedium';

  return (
    <Animated.View style={[animatedStyle, isDisabled && styles.disabled]}>
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={isDisabled}
        style={({ pressed }) => [
          styles.row,
          containerStyle,
          variantStyle,
          variant === 'ghost' && pressed && { backgroundColor: 'rgba(255,255,255,0.06)' },
        ]}
        accessibilityRole="button"
        accessibilityLabel={label}
      >
        {loading ? (
          <View style={[styles.spinner, { borderColor: labelColor, borderTopColor: 'transparent' }]} />
        ) : (
          icon && <Icon name={icon} size={cfg.iconSize} color={labelColor} />
        )}
        <Text variant={labelVariant} style={{ color: labelColor }}>
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  spinner: {
    width: 14,
    height: 14,
    borderRadius: 9999,
    borderWidth: 2,
  },
  disabled: {
    opacity: 0.45,
  },
});
