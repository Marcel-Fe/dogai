import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from 'react-native';
import { createClient } from '@supabase/supabase-js';
import { env } from './env';

/**
 * Supabase-Client für DogAI.
 * Session wird in AsyncStorage persistiert (offizielle Expo-Empfehlung —
 * JWTs überschreiten das Größenlimit von SecureStore).
 */
export const supabase = createClient(env.supabaseUrl, env.supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Token nur erneuern, solange die App im Vordergrund ist.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

/** Signierte URL für ein privates Storage-Objekt (z. B. Scan-Foto). */
export async function signedUrl(
  bucket: string,
  path: string,
  expiresInSeconds = 3600,
): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresInSeconds);
  if (error) return null;
  return data.signedUrl;
}

/** Öffentliche URL für ein Objekt in einem Public-Bucket (z. B. Avatare). */
export function publicUrl(bucket: string, path: string): string {
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}
