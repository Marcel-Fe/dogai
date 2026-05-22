/**
 * Zentrale Env-Zugriffe.
 * Nur EXPO_PUBLIC_*-Werte sind im Client verfügbar — Secrets gehören
 * ausschließlich in die Supabase Edge Function Secrets.
 *
 * Ist keine Supabase-URL gesetzt, läuft die App im DEMO-MODUS:
 * lokale Daten, kein Backend, KI-Funktionen deaktiviert.
 */

const url = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

/** true, solange kein echtes Supabase-Backend konfiguriert ist. */
export const isDemoMode = url.length === 0 || anonKey.length === 0;

export const env = {
  // Platzhalter im Demo-Modus — der Supabase-Client wird dann nie aufgerufen.
  supabaseUrl: url || 'http://demo.local',
  supabaseAnonKey: anonKey || 'demo-anon-key',
};
