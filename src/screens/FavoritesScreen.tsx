import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Screen } from '@/components/ui/Screen';
import { EmptyState } from '@/components/ui/EmptyState';

/**
 * Favorites — hearted songs tab.
 * Phase 0: empty state. Phase 3 adds the favorites store + toggle UI.
 */
export function FavoritesScreen() {
  return (
    <Screen title="Favorites">
      <View style={styles.body}>
        <EmptyState
          icon="heart"
          title="No favorites yet"
          description="Tap the heart on any song and it will show up here for instant access."
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
