import React, { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Icon } from './Icon';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
}

/**
 * SearchBar — pill search input (showcase `.search-bar`).
 * Focused state: violet border + glow shadow.
 */
export function SearchBar({ value, onChangeText, placeholder = 'Search songs, artists, albums', onSubmit }: SearchBarProps) {
  const theme = useTheme();
  const { colors } = theme;
  const [focused, setFocused] = useState(false);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surfaceElevated,
          borderColor: focused ? colors.primary : 'transparent',
          borderWidth: focused ? 1 : 0,
        },
        focused ? theme.shadow.glow : undefined,
      ]}
    >
      <Icon name="search" size={18} color={colors.textTertiary} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onSubmitEditing={onSubmit}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        style={[styles.input, { color: colors.textPrimary }]}
        returnKeyType="search"
        autoCorrect={false}
      />
      {value.length > 0 && (
        <Pressable
          onPress={() => onChangeText('')}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
        >
          <Icon name="close-circle" size={18} color={colors.textTertiary} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderRadius: 9999,
    paddingHorizontal: 16,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    padding: 0,
  },
});
