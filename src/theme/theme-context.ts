import { createContext, useContext } from 'react';
import type { ThemeColors, Spacing, Radius, Typography } from './tokens';

export type ThemeMode = 'dark' | 'light' | 'system';

export interface Theme {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  isDark: boolean;
  colors: ThemeColors;
  spacing: Spacing;
  radius: Radius;
  typography: Typography;
  shadow: typeof import('./tokens').shadow;
}

export const ThemeContext = createContext<Theme | null>(null);

/** Internal hook — components should use the public `useTheme` instead. */
export function useThemeContext(): Theme {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used inside <ThemeProvider>');
  }
  return ctx;
}
