import { useColorScheme } from 'react-native';
import { colorSchemes, type ColorScheme } from './colors';
import { elevation, fontSize, fontWeight, layout, radius, spacing } from './tokens';

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
 * Liefert das aktive Theme passend zum System-Farbschema.
 * Reagiert automatisch auf Wechsel Light/Dark.
 */
export function useTheme(): Theme {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  return {
    colors: isDark ? colorSchemes.dark : colorSchemes.light,
    spacing,
    radius,
    fontSize,
    fontWeight,
    elevation,
    layout,
    isDark,
  };
}
