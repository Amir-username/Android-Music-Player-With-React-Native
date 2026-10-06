import { useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { ThemeContext, useThemeContext } from './theme-context';
import type { Theme, ThemeMode } from './theme-context';
import { colors as darkColors, lightColors, spacing, radius, typography, shadow } from './tokens';
import { useSettingsStore } from '@/stores/settingsStore';

export type { Theme, ThemeMode };

/**
 * Theme provider — dark (default) / light / system.
 * Mode is persisted via the settings store (Zustand + AsyncStorage).
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const mode = useSettingsStore((s) => s.themeMode);
  const setMode = useSettingsStore((s) => s.setThemeMode);
  const systemScheme = useColorScheme();

  const value = useMemo<Theme>(() => {
    const isDark = mode === 'system' ? systemScheme !== 'light' : mode === 'dark';
    return {
      mode,
      setMode,
      isDark,
      colors: isDark ? darkColors : lightColors,
      spacing,
      radius,
      typography,
      shadow,
    };
  }, [mode, setMode, systemScheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/** Convenience hook for consuming the theme in any component. */
export function useTheme(): Theme {
  return useThemeContext();
}
