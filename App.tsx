import React, { useCallback, useEffect, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
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
    if (fontsLoaded || fontError) {
      hideSplash();
    }
  }, [fontsLoaded, fontError, hideSplash]);

  const backgroundColorStyle = useMemo(
    () => ({ backgroundColor: theme.colors.background }),
    [theme.colors.background],
  );

  return (
    <View style={[styles.root, backgroundColorStyle]}>
      <StatusBar style={theme.isDark ? 'light' : 'dark'} />
      {fontsLoaded || fontError ? <RootNavigator /> : null}
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
});
