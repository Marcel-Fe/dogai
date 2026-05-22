/**
 * Wählbare Akzentfarben für die Personalisierung.
 * Jede Farbe hat eine Light- und Dark-Variante (accent, accentSoft, accentText).
 */

export type AccentName = 'orange' | 'blue' | 'green' | 'pink';

export type AccentPalette = {
  accent: string;
  accentSoft: string;
  accentText: string;
};

export const accents: Record<AccentName, { light: AccentPalette; dark: AccentPalette }> = {
  orange: {
    light: { accent: '#E8743B', accentSoft: '#FBE6DA', accentText: '#FFFFFF' },
    dark: { accent: '#F0894F', accentSoft: '#3A2A22', accentText: '#1A1209' },
  },
  blue: {
    light: { accent: '#2F6FED', accentSoft: '#DDE7FD', accentText: '#FFFFFF' },
    dark: { accent: '#5B8DF5', accentSoft: '#1E2A40', accentText: '#0A1426' },
  },
  green: {
    light: { accent: '#2E9E5B', accentSoft: '#DCF1E4', accentText: '#FFFFFF' },
    dark: { accent: '#4CB97A', accentSoft: '#1E3328', accentText: '#08160E' },
  },
  pink: {
    light: { accent: '#D6457E', accentSoft: '#FBDDE9', accentText: '#FFFFFF' },
    dark: { accent: '#E96FA0', accentSoft: '#3A2230', accentText: '#2A0A18' },
  },
};

/** Reihenfolge für die Auswahl-UI. */
export const accentOrder: AccentName[] = ['orange', 'blue', 'green', 'pink'];
