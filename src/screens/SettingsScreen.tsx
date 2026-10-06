import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Screen } from '@/components/ui/Screen';
import { Card } from '@/components/ui/Card';
import { ListRow } from '@/components/ui/ListRow';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/hooks/useTheme';
import { useToast } from '@/components/ui/Toast';
import { useSettingsStore, type ThemeMode } from '@/stores/settingsStore';

const THEME_OPTIONS: { mode: ThemeMode; label: string; icon: Parameters<typeof ListRow>[0]['icon'] }[] = [
  { mode: 'dark', label: 'Dark', icon: 'moon' },
  { mode: 'light', label: 'Light', icon: 'sunny' },
  { mode: 'system', label: 'System', icon: 'phone-portrait' },
];

/**
 * Settings — app configuration.
 * Phase 0: working theme switcher (persisted) + placeholder rows for
 * Phase 2 (scan folders, cache) and Phase 4 (playback options).
 */
export function SettingsScreen() {
  const theme = useTheme();
  const toast = useToast();
  const themeMode = useSettingsStore((s) => s.themeMode);
  const setThemeMode = useSettingsStore((s) => s.setThemeMode);

  const comingSoon = (feature: string) => () =>
    toast.show({
      type: 'info',
      title: feature,
      message: 'This option unlocks in a later phase.',
    });

  return (
    <Screen title="Settings" scroll>
      <Text variant="label" style={styles.sectionLabel}>
        Appearance
      </Text>
      <Card style={styles.sectionCard}>
        {THEME_OPTIONS.map((option, index) => (
          <ListRow
            key={option.mode}
            icon={option.icon}
            label={option.label}
            value={themeMode === option.mode ? 'On' : undefined}
            chevron={themeMode !== option.mode}
            onPress={() => setThemeMode(option.mode)}
            separated={index < THEME_OPTIONS.length - 1}
          />
        ))}
      </Card>

      <Text variant="label" style={styles.sectionLabel}>
        Library
      </Text>
      <Card style={styles.sectionCard}>
        <ListRow icon="folder-open" label="Scan folders" chevron onPress={comingSoon('Scan folders')} />
        <ListRow icon="refresh" label="Rescan library" chevron onPress={comingSoon('Rescan library')} />
        <ListRow icon="trash" label="Clear artwork cache" destructive separated={false} onPress={comingSoon('Clear cache')} />
      </Card>

      <Text variant="label" style={styles.sectionLabel}>
        Playback
      </Text>
      <Card style={styles.sectionCard}>
        <ListRow icon="color-wand" label="Crossfade" chevron onPress={comingSoon('Crossfade')} />
        <ListRow icon="timer" label="Sleep timer" chevron onPress={comingSoon('Sleep timer')} />
        <ListRow icon="options-outline" label="Equalizer" chevron separated={false} onPress={comingSoon('Equalizer')} />
      </Card>

      <Text variant="label" style={styles.sectionLabel}>
        About
      </Text>
      <Card style={styles.sectionCard}>
        <ListRow icon="information-circle" label="Version" value="0.1.0 (Phase 0)" separated />
        <ListRow icon="map" label="Roadmap" value="0–15% complete" separated={false} onPress={comingSoon('Roadmap')} />
      </Card>

      <View style={styles.footer}>
        <Text variant="tiny" align="center">
          Offline-first · No accounts · Your files stay on your device
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  sectionLabel: {
    marginBottom: 8,
    marginTop: 4,
  },
  sectionCard: {
    marginBottom: 20,
    overflow: 'hidden',
  },
  footer: {
    marginTop: 8,
    paddingBottom: 24,
  },
});
