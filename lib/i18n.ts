import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';
import de from '@/locales/de.json';
import en from '@/locales/en.json';

export const SUPPORTED_LANGUAGES = ['de', 'en'] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];

/** Geräte-Sprache, auf unterstützte Sprachen eingegrenzt. */
function deviceLanguage(): Language {
  const code = getLocales()[0]?.languageCode ?? 'de';
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(code)
    ? (code as Language)
    : 'de';
}

i18n.use(initReactI18next).init({
  resources: {
    de: { translation: de },
    en: { translation: en },
  },
  lng: deviceLanguage(),
  fallbackLng: 'de',
  interpolation: { escapeValue: false },
  returnNull: false,
});

export function changeLanguage(lang: Language): Promise<unknown> {
  return i18n.changeLanguage(lang);
}

export default i18n;
