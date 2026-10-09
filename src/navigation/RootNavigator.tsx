import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
  CommonActions,
  type Theme as NavTheme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useTheme } from '@/hooks/useTheme';
import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import type { IconName } from '@/components/ui/Icon';
import { PlaybackTestBar } from '@/components/player/PlaybackTestBar';
import { usePlayerStore } from '@/stores/playerStore';
import { LibraryScreen } from '@/screens/LibraryScreen';
import { PlaylistsScreen } from '@/screens/PlaylistsScreen';
import { FavoritesScreen } from '@/screens/FavoritesScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';
import type { RootStackParamList, RootTabParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

interface TabConfig {
  name: keyof RootTabParamList;
  label: string;
  icon: IconName;
  iconFocused: IconName;
  component: React.ComponentType;
}

const TABS: TabConfig[] = [
  {
    name: 'Library',
    label: 'Library',
    icon: 'library-outline',
    iconFocused: 'library',
    component: LibraryScreen,
  },
  {
    name: 'Playlists',
    label: 'Playlists',
    icon: 'albums-outline',
    iconFocused: 'albums',
    component: PlaylistsScreen,
  },
  {
    name: 'Favorites',
    label: 'Favorites',
    icon: 'heart-outline',
    iconFocused: 'heart',
    component: FavoritesScreen,
  },
  {
    name: 'Settings',
    label: 'Settings',
    icon: 'settings-outline',
    iconFocused: 'settings',
    component: SettingsScreen,
  },
];

/**
 * Hand-rolled tab bar (no library layout internals).
 *
 * Why custom: @react-navigation/bottom-tabs v7 renders each tab icon as TWO
 * absolutely-positioned layers sized with percentages (`width/height: '100%'`)
 * inside a fixed wrapper, cross-fading their opacity. On emulators with a
 * nonstandard display stack (e.g. LDPlayer + Fabric), those percentage-sized
 * absolute layers collapse to zero size — labels (normal flow) keep rendering
 * while icons disappear. This bar uses plain flexbox only: icon and label are
 * normal-flow children, so they render identically everywhere.
 *
 * Column layout: [PlaybackTestBar (Step 1)] above [tab row]; Step 2 swaps the
 * test bar for the designed MiniPlayer without changing this container.
 */
function CustomTabBar({ state, navigation, insets }: BottomTabBarProps) {
  const theme = useTheme();
  const { colors } = theme;
  const hasActiveTrack = usePlayerStore((s) => s.activeTrack !== null);
  // Emulators can report large/bogus bottom insets; clamp to a sane max
  // (Android 3-button navigation is ~48dp).
  const bottomInset = Math.max(0, Math.min(insets.bottom, 48));

  return (
    <View
      style={[
        styles.tabBar,
        {
          backgroundColor: colors.background,
          borderTopColor: theme.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
          paddingBottom: bottomInset,
        },
      ]}
    >
      {hasActiveTrack ? <PlaybackTestBar /> : null}
      <View style={styles.tabRow}>
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const config = TABS.find((t) => t.name === route.name);
        const color = focused ? colors.primary : colors.textTertiary;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) {
            navigation.dispatch({ ...CommonActions.navigate(route.name), target: state.key });
          }
        };

        const onLongPress = () => {
          navigation.emit({ type: 'tabLongPress', target: route.key });
        };

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={focused ? { selected: true } : {}}
            accessibilityLabel={config?.label}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabItem}
          >
            <View style={[styles.pill, focused && { backgroundColor: 'rgba(139,92,246,0.16)' }]}>
              <Icon
                name={focused ? (config?.iconFocused ?? 'ellipse') : (config?.icon ?? 'ellipse-outline')}
                size={21}
                color={color}
              />
            </View>
            <Text
              variant="tiny"
              style={{
                color,
                fontSize: 10,
                fontFamily: theme.typography.fontFamily.semiBold,
                marginTop: 2,
              }}
            >
              {config?.label ?? route.name}
            </Text>
          </Pressable>
        );
      })}
      </View>
    </View>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator tabBar={(props) => <CustomTabBar {...props} />} screenOptions={{ headerShown: false }}>
      {TABS.map((tab) => (
        <Tab.Screen key={tab.name} name={tab.name} component={tab.component} />
      ))}
    </Tab.Navigator>
  );
}

/** Root navigator — Phase 1 mounts a NowPlaying modal next to Tabs. */
export function RootNavigator() {
  const theme = useTheme();

  const navTheme: NavTheme = {
    ...(theme.isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(theme.isDark ? DarkTheme : DefaultTheme).colors,
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.textPrimary,
      border: theme.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
      notification: theme.colors.primary,
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tabs" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 1,
  },
  tabRow: {
    flexDirection: 'row',
    paddingTop: 6,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 3,
    borderRadius: 9999,
  },
});
