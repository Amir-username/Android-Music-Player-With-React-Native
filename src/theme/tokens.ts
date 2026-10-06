/**
 * Design tokens — Offline Music Player
 * Source of truth: design showcase (showcase.html) + roadmap §6.1
 * Dark-first premium theme with violet accent.
 */

/** Generalized palette shape — shared by dark and light themes */
export interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  background: string;
  surface: string;
  surfaceElevated: string;
  card: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  progress: string;
  progressTrack: string;
  miniPlayerBg: string;
}

export const colors: ThemeColors = {
  // Brand
  primary: '#8B5CF6',
  primaryLight: '#A78BFA',
  primaryDark: '#7C3AED',

  // Backgrounds
  background: '#0F0F12',
  surface: '#1A1A1F',
  surfaceElevated: '#24242B',
  card: '#1E1E24',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#A1A1AA',
  textTertiary: '#71717A',
  textInverse: '#0F0F12',

  // Semantic
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Player specific
  progress: '#8B5CF6',
  progressTrack: '#3F3F46',
  miniPlayerBg: '#18181B',
} as const;

export const lightColors: ThemeColors = {
  primary: '#8B5CF6',
  primaryLight: '#A78BFA',
  primaryDark: '#7C3AED',

  background: '#FAFAFC',
  surface: '#FFFFFF',
  surfaceElevated: '#F1F1F4',
  card: '#FFFFFF',

  textPrimary: '#18181B',
  textSecondary: '#52525B',
  textTertiary: '#A1A1AA',
  textInverse: '#FFFFFF',

  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  progress: '#8B5CF6',
  progressTrack: '#E4E4E7',
  miniPlayerBg: '#FFFFFF',
};

/** Spacing — 8pt grid */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
} as const;

/** Corner radius */
export const radius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

/** Typography — Inter (loaded via @expo-google-fonts/inter) */
export const typography = {
  fontFamily: {
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    semiBold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
    extraBold: 'Inter_800ExtraBold',
  },
  size: {
    xs: 11,
    sm: 13,
    base: 15,
    lg: 17,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
} as const;

/**
 * Elevation — showcase shadows translated to React Native.
 * iOS: shadow* props. Android: elevation (approximate).
 */
export const shadow = {
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 6,
  },
  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.6,
    shadowRadius: 32,
    elevation: 12,
  },
  /** Signature violet glow */
  glow: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 8,
  },
  /** Stronger violet glow (primary button press / focused search) */
  glowStrong: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 18,
    elevation: 10,
  },
} as const;

/** Artwork gradient fallbacks — 135deg pairs from the showcase */
export const artworkGradients: readonly [string, string][] = [
  ['#3B82F6', '#06B6D4'], // grad-2  blue -> cyan
  ['#F59E0B', '#EF4444'], // grad-3  amber -> red
  ['#10B981', '#06B6D4'], // grad-4  emerald -> cyan
  ['#EC4899', '#8B5CF6'], // grad-5  pink -> violet
  ['#6366F1', '#8B5CF6'], // grad-6  indigo -> violet
];

/** Ambient radial glow used as decorative background blobs */
export const ambientGlow = {
  topLeft: 'rgba(139, 92, 246, 0.08)',
  bottomRight: 'rgba(139, 92, 246, 0.05)',
} as const;

export type Spacing = typeof spacing;
export type Radius = typeof radius;
export type Typography = typeof typography;
