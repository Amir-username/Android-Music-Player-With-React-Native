import React, { useCallback } from 'react';
import { Pressable, StyleSheet, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/useTheme';
import { Icon, type IconName } from './Icon';

type IconButtonVariant = 'default' | 'primary' | 'surface';
type IconButtonSize = 'sm' | 'md' | 'lg';

interface IconButtonProps {
  name: IconName;
  onPress: () => void;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  /** Marks the control as "on" (e.g. shuffle/repeat active) — tints it violet */
  active?: boolean;
  disabled?: boolean;
  accessibilityLabel?: string;
  style?: ViewStyle;
}

const sizeMap: Record<IconButtonSize, { box: number; icon: number }> = {
  sm: { box: 36, icon: 18 },
  md: { box: 44, icon: 22 },
  lg: { box: 56, icon: 26 },
};

/**
 * IconButton — circular icon-only button (showcase `.btn-icon`).
 * default: transparent, pressed shows 6% white circle.
 * primary: violet filled. surface: card filled.
 * `active` renders the icon violet (repeat/shuffle on state).
 */
export function IconButton({
  name,
  onPress,
  variant = 'default',
  size = 'md',
  active = false,
  disabled = false,
  accessibilityLabel,
  style,
}: IconButtonProps) {
  const theme = useTheme();
  const scale = useSharedValue(1);
  const { box, icon } = sizeMap[size];
  const { colors } = theme;

  const onPressIn = useCallback(() => {
    scale.value = withTiming(0.92, { duration: 100 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  }, [scale]);

  const onPressOut = useCallback(() => {
    scale.value = withTiming(1, { duration: 120 });
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const resolvedColor =
    variant === 'primary'
      ? colors.textInverse
      : active
        ? colors.primary
        : variant === 'surface'
          ? colors.textPrimary
          : colors.textSecondary;

  const backgroundColor =
    variant === 'primary'
      ? colors.primary
      : variant === 'surface'
        ? colors.card
        : 'transparent';

  return (
    <Animated.View style={[animatedStyle, disabled && styles.disabled, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        style={({ pressed }) => [
          styles.circle,
          {
            width: box,
            height: box,
            borderRadius: box / 2,
            backgroundColor,
          },
          variant === 'default' && pressed && { backgroundColor: 'rgba(255,255,255,0.08)' },
        ]}
      >
        <Icon name={name} size={icon} color={resolvedColor} />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.4,
  },
});
