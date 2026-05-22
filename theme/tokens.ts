import { Platform } from 'react-native';

/**
 * Design-Tokens für DogAI — 4pt-Grid, ein konsistentes Maßsystem.
 * Werte hier ändern sich App-weit; nie Pixelwerte hart in Komponenten schreiben.
 */

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  display: 36,
} as const;

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

/** Plattform-Schatten — iOS nutzt shadow*, Android elevation. */
export const elevation = {
  none: {},
  low: Platform.select({
    ios: {
      shadowColor: '#0D1B2A',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
    },
    android: { elevation: 2 },
    default: {},
  }),
  medium: Platform.select({
    ios: {
      shadowColor: '#0D1B2A',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.1,
      shadowRadius: 16,
    },
    android: { elevation: 6 },
    default: {},
  }),
} as const;

export const layout = {
  /** Tippfläche-Mindestgröße (Apple HIG / Material). */
  minTouch: 44,
  screenPadding: spacing.lg,
} as const;
