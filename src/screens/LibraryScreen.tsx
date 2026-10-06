import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Screen } from '@/components/ui/Screen';
import { SearchBar } from '@/components/ui/SearchBar';
import { Chip } from '@/components/ui/Chip';
import { EmptyState } from '@/components/ui/EmptyState';
import { IconButton } from '@/components/ui/IconButton';
import { useTheme } from '@/hooks/useTheme';
import { useToast } from '@/components/ui/Toast';

type LibraryFilter = 'Songs' | 'Albums' | 'Artists';

const FILTERS: LibraryFilter[] = ['Songs', 'Albums', 'Artists'];

const FILTER_EMPTY_COPY: Record<LibraryFilter, { icon: Parameters<typeof EmptyState>[0]['icon']; title: string; description: string }> = {
  Songs: {
    icon: 'musical-notes',
    title: 'No music yet',
    description: 'Import your local audio files (MP3, FLAC, M4A, WAV, OGG) to build your library.',
  },
  Albums: {
    icon: 'disc',
    title: 'No albums yet',
    description: 'Albums appear here once your library has been scanned.',
  },
  Artists: {
    icon: 'people',
    title: 'No artists yet',
    description: 'Artists appear here once your library has been scanned.',
  },
};

/**
 * Library — the home tab.
 * Phase 0: header + search + filter chips + themed empty states.
 * Phase 2 will fill it with the FlashList song list, metadata scan,
 * pull-to-refresh and a scan progress indicator.
 */
export function LibraryScreen() {
  const theme = useTheme();
  const toast = useToast();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<LibraryFilter>('Songs');

  const emptyCopy = useMemo(() => {
    if (query.trim().length > 0) {
      return {
        icon: 'search' as const,
        title: 'No results found',
        description: `Nothing matches "${query.trim()}". Try a different search.`,
      };
    }
    return FILTER_EMPTY_COPY[filter];
  }, [query, filter]);

  const handleScan = () => {
    toast.show({
      type: 'info',
      title: 'Library scanning',
      message: 'File scanning arrives in Phase 2 — foundation is ready.',
    });
  };

  return (
    <Screen
      title="Library"
      headerRight={
        <IconButton
          name="scan-outline"
          size="sm"
          accessibilityLabel="Scan for music"
          onPress={handleScan}
        />
      }
    >
      <View style={styles.controls}>
        <SearchBar value={query} onChangeText={setQuery} placeholder={`Search ${filter.toLowerCase()}`} />
        <View style={styles.chips}>
          {FILTERS.map((f) => (
            <Chip key={f} label={f} active={filter === f} onPress={() => setFilter(f)} />
          ))}
        </View>
      </View>
      <View style={styles.body}>
        <EmptyState
          icon={emptyCopy.icon}
          title={emptyCopy.title}
          description={emptyCopy.description}
          action={{ label: 'Scan for Music', onPress: handleScan }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  controls: {
    gap: 12,
  },
  chips: {
    flexDirection: 'row',
    gap: 8,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
  },
});
