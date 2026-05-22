import { useColorScheme } from 'react-native';
import { colorSchemes, type ColorScheme } from './colors';
import { accents } from './accents';
import { elevation, fontSize, fontWeight, layout, radius, spacing } from './tokens';
import { useProfile } from '@/features/profile/store';

export { colorSchemes, elevation, fontSize, fontWeight, layout, radius, spacing };
export type { ColorScheme };

export type Theme = {
  colors: ColorScheme;
  spacing: typeof spacing;
  radius: typeof radius;
  fontSize: typeof fontSize;
  fontWeight: typeof fontWeight;
  elevation: typeof elevation;
  layout: typeof layout;
  isDark: boolean;
};

/**
 * Liefert das aktive Theme passend zum System-Farbschema und der
 * vom Nutzer gewählten Akzentfarbe.
 */
export function useTheme(): Theme {
  const scheme = useColorScheme();
  const accentName = useProfile((s) => s.accent);
  const isDark = scheme === 'dark';
  const base = isDark ? colorSchemes.dark : colorSchemes.light;
  const accent = accents[accentName][isDark ? 'dark' : 'light'];

  return {
    colors: {
      ...base,
      accent: accent.accent,
      accentSoft: accent.accentSoft,
      accentText: accent.accentText,
    },
    spacing,
    radius,
    fontSize,
    fontWeight,
    elevation,
    layout,
    isDark,
  };
}
