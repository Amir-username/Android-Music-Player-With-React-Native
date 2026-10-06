import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import type { ToastPayload } from '@/types';
import { Icon } from './Icon';
import { Text } from './Text';

interface ToastContextValue {
  show: (payload: ToastPayload) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = React.useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used inside <ToastProvider>');
  }
  return ctx;
}

const ICONS: Record<ToastPayload['type'], Parameters<typeof Icon>[0]['name']> = {
  success: 'checkmark-circle',
  error: 'close-circle',
  warning: 'warning',
  info: 'information-circle',
};

const AUTO_DISMISS_MS = 2600;
const ANIMATION_MS = 220;

/**
 * Toast — feedback surface (showcase `.toast`): accent-colored left border,
 * typed icon, title + optional message. Slides in from the top.
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastPayload | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const offsetY = useSharedValue(-90);
  const opacity = useSharedValue(0);

  const animateIn = useCallback(() => {
    offsetY.value = withTiming(0, { duration: ANIMATION_MS });
    opacity.value = withTiming(1, { duration: ANIMATION_MS });
  }, [offsetY, opacity]);

  const animateOut = useCallback(
    (onDone?: () => void) => {
      offsetY.value = withTiming(-90, { duration: ANIMATION_MS }, (finished) => {
        if (finished && onDone) {
          runOnJS(onDone)();
        }
      });
      opacity.value = withTiming(0, { duration: ANIMATION_MS });
    },
    [offsetY, opacity],
  );

  const show = useCallback(
    (payload: ToastPayload) => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
      setToast(payload);
      animateIn();
      hideTimer.current = setTimeout(() => {
        animateOut(() => setToast(null));
      }, AUTO_DISMISS_MS);
    },
    [animateIn, animateOut],
  );

  useEffect(() => {
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <ToastSurface toast={toast} offsetY={offsetY} opacity={opacity} />
    </ToastContext.Provider>
  );
}

function ToastSurface({
  toast,
  offsetY,
  opacity,
}: {
  toast: ToastPayload | null;
  offsetY: SharedValue<number>;
  opacity: SharedValue<number>;
}) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { colors } = theme;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: offsetY.value }],
    opacity: opacity.value,
  }));

  if (!toast) return null;

  const accent =
    toast.type === 'success'
      ? colors.success
      : toast.type === 'error'
        ? colors.error
        : toast.type === 'warning'
          ? colors.warning
          : colors.info;

  const iconColor = accent;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.host,
        { top: insets.top + 8 },
        animatedStyle,
      ]}
    >
      <View
        style={[
          styles.toast,
          {
            backgroundColor: colors.surface,
            borderLeftColor: accent,
            borderRadius: theme.radius.md,
          },
          theme.shadow.md,
        ]}
      >
        <View style={styles.iconWrap}>
          <Icon name={ICONS[toast.type]} size={20} color={iconColor} />
        </View>
        <View style={styles.body}>
          <Text variant="captionMedium" style={styles.title}>
            {toast.title}
          </Text>
          {toast.message ? (
            <Text variant="tiny" color="secondary" style={styles.message}>
              {toast.message}
            </Text>
          ) : null}
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 100,
    elevation: 100,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 3,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
  },
  iconWrap: {
    width: 24,
    alignItems: 'center',
  },
  body: {
    flex: 1,
  },
  title: {
    color: '#FFFFFF',
  },
  message: {
    marginTop: 1,
  },
});
