import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Screen } from '@/components/ui/Screen';
import { SearchBar } from '@/components/ui/SearchBar';
import { Chip } from '@/components/ui/Chip';
import { EmptyState } from '@/components/ui/EmptyState';
import { IconButton } from '@/components/ui/IconButton';
import { ListItem } from '@/components/ui/ListItem';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/hooks/useTheme';
import { useToast } from '@/components/ui/Toast';
import { usePlayerStore } from '@/stores/playerStore';
import { SAMPLE_TRACKS } from '@/services/playback/sampleTracks';
import {
  checkLibraryPermission,
  isDeviceLibraryAvailable,
  requestLibraryPermission,
  scanDeviceAudio,
} from '@/services/library/deviceLibrary';
import { formatDuration } from '@/utils/format';
import type { Track } from '@/types';

type LibraryFilter = 'Songs' | 'Albums' | 'Artists';
type PermissionState = 'unknown' | 'granted' | 'denied' | 'unavailable';

const FILTERS: LibraryFilter[] = ['Songs', 'Albums', 'Artists'];

const FILTER_EMPTY_COPY: Record<
  'Albums' | 'Artists',
  { icon: Parameters<typeof EmptyState>[0]['icon']; title: string; description: string }
> = {
  Albums: {
    icon: 'disc',
    title: 'No albums yet',
    description: 'Albums arrive in Phase 2 with full metadata extraction.',
  },
  Artists: {
    icon: 'people',
    title: 'No artists yet',
    description: 'Artists arrive in Phase 2 with full metadata extraction.',
  },
};

/**
 * Library — the home tab.
 * Phase 1 Step 1: bundled test tracks + a minimal device scan
 * (expo-media-library) — tap any row to play. The full metadata-rich
 * library (FlashList, ID3/artwork, albums/artists, search) lands in Phase 2.
 */
export function LibraryScreen() {
  const theme = useTheme();
  const toast = useToast();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<LibraryFilter>('Songs');
  const [deviceTracks, setDeviceTracks] = useState<Track[]>([]);
  const [permission, setPermission] = useState<PermissionState>('unknown');
  const [scanning, setScanning] = useState(false);

  const playerStatus = usePlayerStore((s) => s.status);
  const playQueue = usePlayerStore((s) => s.playQueue);

  const runScan = useCallback(
    async (announce: boolean) => {
      setScanning(true);
      try {
        const tracks = await scanDeviceAudio();
        setDeviceTracks(tracks);
        if (announce) {
          toast.show({
            type: 'success',
            title: 'Scan complete',
            message:
              tracks.length > 0
                ? `Found ${tracks.length} song${tracks.length === 1 ? '' : 's'} on this device.`
                : 'No audio files found. Push MP3s to /sdcard/Music (see README-DEV-BUILD.md).',
          });
        }
      } catch (error) {
        if (announce) {
          toast.show({
            type: 'error',
            title: 'Scan failed',
            message: String((error as Error)?.message ?? error),
          });
        }
      } finally {
        setScanning(false);
      }
    },
    [toast],
  );

  // Silent auto-scan on launch when permission was already granted before.
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      if (!isDeviceLibraryAvailable()) {
        // No native media module (Expo Go without it / stale dev build):
        // degrade gracefully instead of crashing.
        setPermission('unavailable');
        return;
      }
      const granted = await checkLibraryPermission();
      if (cancelled) return;
      if (granted) {
        setPermission('granted');
        await runScan(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [runScan]);

  const handleScan = useCallback(async () => {
    if (!isDeviceLibraryAvailable()) {
      toast.show({
        type: 'warning',
        title: 'Scan unavailable',
        message: 'This runtime has no media library — build a development app (README-DEV-BUILD.md) to scan your device music.',
      });
      return;
    }
    const result = await requestLibraryPermission();
    setPermission(result);
    if (result === 'denied') {
      toast.show({
        type: 'warning',
        title: 'Permission denied',
        message: 'Allow "Music and audio" access in system settings to scan your songs.',
      });
      return;
    }
    await runScan(true);
  }, [runScan, toast]);

  const handlePlay = useCallback(
    async (list: Track[], index: number) => {
      if (playerStatus !== 'ready') {
        toast.show({
          type: 'warning',
          title: 'Playback unavailable',
          message:
            playerStatus === 'expo-go'
              ? 'Expo Go cannot play audio — build a development build (README-DEV-BUILD.md).'
              : 'The player is still starting up. Try again in a moment.',
        });
        return;
      }
      const ok = await playQueue(list, index);
      if (!ok) {
        toast.show({
          type: 'error',
          title: 'Playback failed',
          message: 'The audio engine could not start this queue. Check README-DEV-BUILD.md.',
        });
      }
    },
    [playQueue, playerStatus, toast],
  );

  const matches = useCallback((t: Track, q: string) => {
    const needle = q.trim().toLowerCase();
    if (!needle) return true;
    return (
      t.title.toLowerCase().includes(needle) || t.artist.toLowerCase().includes(needle)
    );
  }, []);

  const sampleTracks = useMemo(
    () => SAMPLE_TRACKS.filter((t) => matches(t, query)),
    [matches, query],
  );
  const filteredDeviceTracks = useMemo(
    () => deviceTracks.filter((t) => matches(t, query)),
    [deviceTracks, matches, query],
  );

  const renderTrackList = (tracks: Track[]) =>
    tracks.map((track, index) => (
      <ListItem
        key={track.id}
        title={track.title}
        subtitle={track.artist || (track.source === 'sample' ? 'Bundled sample' : 'Unknown artist')}
        duration={track.durationMs > 0 ? formatDuration(track.durationMs) : undefined}
        artwork={{ uri: track.artworkUri ?? null, fallbackName: track.title, seed: track.id }}
        onPress={() => void handlePlay(tracks, index)}
      />
    ));

  const searching = query.trim().length > 0;

  const songsBody = useMemo(() => {
    if (searching && sampleTracks.length === 0 && filteredDeviceTracks.length === 0) {
      return (
        <View style={styles.body}>
          <EmptyState
            icon="search"
            title="No results found"
            description={`Nothing matches "${query.trim()}". Try a different search.`}
          />
        </View>
      );
    }

    return (
      <View style={styles.songsBody}>
        {sampleTracks.length > 0 ? (
          <>
            <Text variant="label" color="tertiary" style={styles.sectionLabel}>
              Test tracks
            </Text>
            {renderTrackList(sampleTracks)}
          </>
        ) : null}

        <Text variant="label" color="tertiary" style={styles.sectionLabel}>
          On this device
        </Text>
        {scanning && deviceTracks.length === 0 ? (
          <View style={styles.scanRow}>
            <LoadingSpinner size="small" />
            <Text variant="caption" color="tertiary">
              Scanning device audio…
            </Text>
          </View>
        ) : filteredDeviceTracks.length > 0 ? (
          renderTrackList(filteredDeviceTracks)
        ) : permission === 'unavailable' ? (
          <EmptyState
            icon="headset-outline"
            title="Device scan unavailable"
            description="This runtime does not include the media library. A development build (see README-DEV-BUILD.md) unlocks scanning your own music."
          />
        ) : permission === 'denied' ? (
          <EmptyState
            icon="lock-closed-outline"
            title="Permission needed"
            description='Allow "Music and audio" access for Offline Music Player in system settings, then scan again.'
            action={{ label: 'Grant Permission', onPress: () => void handleScan() }}
          />
        ) : permission === 'unknown' ? (
          <EmptyState
            icon="musical-notes"
            title="Play your own music"
            description="Grant audio access to list the songs stored on this device. Bundled test tracks already work."
            action={{ label: 'Scan for Music', onPress: () => void handleScan() }}
          />
        ) : (
          <EmptyState
            icon="musical-notes"
            title="No songs on this device"
            description="Push a few MP3s to /sdcard/Music/ (see README-DEV-BUILD.md), then tap Scan."
            action={{ label: 'Rescan', onPress: () => void handleScan() }}
          />
        )}
      </View>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    searching,
    query,
    sampleTracks,
    filteredDeviceTracks,
    deviceTracks.length,
    permission,
    scanning,
    handleScan,
    handlePlay,
    theme,
  ]);

  return (
    <Screen
      title="Library"
      scroll
      headerRight={
        <IconButton
          name="scan-outline"
          size="sm"
          accessibilityLabel="Scan for music"
          onPress={() => void handleScan()}
        />
      }
    >
      <View style={styles.controls}>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder={`Search ${filter.toLowerCase()}`}
        />
        <View style={styles.chips}>
          {FILTERS.map((f) => (
            <Chip key={f} label={f} active={filter === f} onPress={() => setFilter(f)} />
          ))}
        </View>
      </View>

      {filter === 'Songs' ? (
        songsBody
      ) : (
        <View style={styles.body}>
          <EmptyState {...FILTER_EMPTY_COPY[filter as 'Albums' | 'Artists']} />
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  controls: {
    gap: 12,
    marginBottom: 16,
  },
  chips: {
    flexDirection: 'row',
    gap: 8,
  },
  body: {
    flex: 1,
    minHeight: 280,
    justifyContent: 'center',
  },
  songsBody: {
    gap: 2,
  },
  sectionLabel: {
    marginTop: 8,
    marginBottom: 6,
  },
  scanRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 16,
  },
});