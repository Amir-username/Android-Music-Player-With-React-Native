import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer, DarkTheme, DefaultTheme, type Theme as NavTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '@/hooks/useTheme';
import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import type { IconName } from '@/components/ui/Icon';
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

/** Tab icon with the showcase's soft violet pill behind the focused icon. */
function TabBarIcon({ name, focused, color }: { name: IconName; focused: boolean; color: string }) {
  return (
    <View
      style={[
        styles.tabPill,
        { backgroundColor: focused ? 'rgba(139,92,246,0.16)' : 'transparent' },
      ]}
    >
      <Icon name={name} size={21} color={color} />
    </View>
  );
}

function TabNavigator() {
  const theme = useTheme();
  const { colors } = theme;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopWidth: 1,
          borderTopColor: theme.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
          height: 64,
          paddingTop: 6,
        },
        tabBarIcon: ({ focused, color }) => {
          const config = TABS.find((t) => t.name === route.name);
          return (
            <TabBarIcon
              name={focused ? (config?.iconFocused ?? config?.icon ?? 'ellipse') : (config?.icon ?? 'ellipse-outline')}
              focused={focused}
              color={color}
            />
          );
        },
        tabBarLabel: ({ color }) => (
          <Text variant="tiny" style={{ color, fontSize: 10, fontFamily: theme.typography.fontFamily.semiBold }}>
            {route.name}
          </Text>
        ),
      })}
    >
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
  tabPill: {
    paddingHorizontal: 16,
    paddingVertical: 3,
    borderRadius: 9999,
  },
});
