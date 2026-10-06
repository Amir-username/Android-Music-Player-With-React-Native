import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Screen } from '@/components/ui/Screen';
import { EmptyState } from '@/components/ui/EmptyState';
import { IconButton } from '@/components/ui/IconButton';
import { useToast } from '@/components/ui/Toast';

/**
 * Playlists — playlist collection tab.
 * Phase 0: empty state + create entry point.
 * Phase 3 will add the create-playlist bottom sheet, drag-to-reorder
 * detail screens and smart playlists.
 */
export function PlaylistsScreen() {
  const toast = useToast();

  const handleCreate = () => {
    toast.show({
      type: 'info',
      title: 'Create playlist',
      message: 'Playlists arrive in Phase 3 — store layer is coming.',
    });
  };

  return (
    <Screen
      title="Playlists"
      headerRight={<IconButton name="add" size="sm" accessibilityLabel="New playlist" onPress={handleCreate} />}
    >
      <View style={styles.body}>
        <EmptyState
          icon="file-tray-full"
          title="No playlists yet"
          description="Create your first playlist to organize your music exactly how you like it."
          action={{ label: 'New Playlist', onPress: handleCreate }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: 'center',
  },
});
