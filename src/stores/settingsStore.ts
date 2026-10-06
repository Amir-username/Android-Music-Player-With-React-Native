import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ThemeMode } from '@/theme';

export type { ThemeMode };

interface SettingsState {
  /** UI theme preference — persisted across launches */
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

/**
 * Global settings store (Zustand + Persist).
 * Phase 0: only theme. Later phases add scan folders, crossfade, sleep timer, etc.
 */
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      themeMode: 'dark',
      setThemeMode: (themeMode) => set({ themeMode }),
    }),
    {
      name: 'omp-settings',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
