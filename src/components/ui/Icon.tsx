import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import type { ComponentProps } from 'react';

type IoniconsName = ComponentProps<typeof Ionicons>['name'];

/** App-wide icon name type (Ionicons via @expo/vector-icons). */
export type IconName = IoniconsName;

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
}

/** Thin Ionicons wrapper — keeps call sites clean and typed. */
export function Icon({ name, size = 22, color }: IconProps) {
  const theme = useTheme();
  return <Ionicons name={name} size={size} color={color ?? theme.colors.textPrimary} />;
}
