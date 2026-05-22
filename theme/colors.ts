/**
 * Semantische Farbpalette mit Light- und Dark-Variante.
 * Komponenten greifen nur auf semantische Namen zu (bg, text, accent …),
 * nie auf Hex-Werte direkt — so bleibt Dark Mode konsistent.
 */

export type ColorScheme = {
  bg: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  textMuted: string;
  textInverse: string;
  border: string;
  accent: string;
  accentSoft: string;
  accentText: string;
  success: string;
  successSoft: string;
  warn: string;
  warnSoft: string;
  danger: string;
  dangerSoft: string;
  overlay: string;
};

const light: ColorScheme = {
  bg: '#FAF8F4',
  surface: '#FFFFFF',
  surfaceAlt: '#F1EEE8',
  text: '#0D1B2A',
  textMuted: '#5C6672',
  textInverse: '#FFFFFF',
  border: '#E7E2D9',
  accent: '#E8743B',
  accentSoft: '#FBE6DA',
  accentText: '#FFFFFF',
  success: '#2E9E5B',
  successSoft: '#DCF1E4',
  warn: '#C9852A',
  warnSoft: '#F8EAD2',
  danger: '#D7472F',
  dangerSoft: '#F8DDD8',
  overlay: 'rgba(13, 27, 42, 0.45)',
};

const dark: ColorScheme = {
  bg: '#0F1115',
  surface: '#1A1D24',
  surfaceAlt: '#232730',
  text: '#F2F4F8',
  textMuted: '#9AA3B0',
  textInverse: '#0D1B2A',
  border: '#2E333D',
  accent: '#F0894F',
  accentSoft: '#3A2A22',
  accentText: '#1A1209',
  success: '#4CB97A',
  successSoft: '#1E3328',
  warn: '#E0A23C',
  warnSoft: '#3A301C',
  danger: '#E8624B',
  dangerSoft: '#3A2420',
  overlay: 'rgba(0, 0, 0, 0.6)',
};

export const colorSchemes = { light, dark } as const;
