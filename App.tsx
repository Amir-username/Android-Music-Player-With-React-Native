import React, { useCallback, useEffect, useMemo } from 'react';
import { View, Text as RNText, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { ThemeProvider, useTheme } from '@/theme';
import { RootNavigator } from '@/navigation/RootNavigator';
import { ToastProvider } from '@/components/ui/Toast';
import { ExpoGoNotice } from '@/components/player/ExpoGoNotice';
import { usePlayerStore } from '@/stores/playerStore';

SplashScreen.preventAutoHideAsync().catch(() => {});

function AppContent() {
  const theme = useTheme();
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    ...Ionicons.font,
  });

  const hideSplash = useCallback(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  useEffect(() => {
    if (fontError) {
      // Surface font failures loudly so they are diagnosable from the terminal.
      console.error('[OfflineMusic] Font loading failed:', fontError);
    }
    if (fontsLoaded || fontError) {
      hideSplash();
    }
  }, [fontsLoaded, fontError, hideSplash]);

  // Initialize the audio engine once (singletons inside guard StrictMode).
  useEffect(() => {
    void usePlayerStore.getState().initialize();
  }, []);

  const backgroundColorStyle = useMemo(
    () => ({ backgroundColor: theme.colors.background }),
    [theme.colors.background],
  );

  return (
    <View style={[styles.root, backgroundColorStyle]}>
      <StatusBar style={theme.isDark ? 'light' : 'dark'} />
      {fontsLoaded || fontError ? <RootNavigator /> : null}
      <ExpoGoNotice />
      {__DEV__ && fontError ? (
        <View style={styles.debugBanner}>
          <RNText style={styles.debugText}>
            FONT ERROR:{' '}
            {String(fontError instanceof Error ? fontError.message : fontError)}
          </RNText>
        </View>
      ) : null}
    </View>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={styles.flex}>
      <SafeAreaProvider>
        <ThemeProvider>
          <ToastProvider>
            <AppContent />
          </ToastProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  root: {
    flex: 1,
  },
  debugBanner: {
    position: 'absolute',
    top: 48,
    left: 12,
    right: 12,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  debugText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
});
