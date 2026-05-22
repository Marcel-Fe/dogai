import { supabase } from './supabase';
import { isDemoMode } from './env';

/**
 * Lädt ein lokales Bild (expo-image-picker URI) in einen Storage-Bucket.
 * Der Pfad beginnt immer mit der user_id — so verlangen es die Storage-Policies.
 * Gibt den Storage-Pfad zurück.
 *
 * Im Demo-Modus wird die lokale URI unverändert zurückgegeben (kein Upload).
 */
export async function uploadImage(
  bucket: string,
  localUri: string,
): Promise<string> {
  if (isDemoMode) return localUri;

  const { data: auth } = await supabase.auth.getUser();
  const userId = auth.user?.id;
  if (!userId) throw new Error('Nicht angemeldet.');

  const res = await fetch(localUri);
  const arrayBuffer = await res.arrayBuffer();
  const contentType = res.headers.get('content-type') ?? 'image/jpeg';
  const ext = contentType.includes('png') ? 'png' : 'jpg';
  const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, arrayBuffer, { contentType, upsert: false });
  if (error) throw error;
  return path;
}
