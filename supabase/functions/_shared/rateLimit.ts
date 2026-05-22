import type { SupabaseClient } from 'npm:@supabase/supabase-js@2';
import { HttpError } from './clients.ts';

/**
 * Einfaches Fenster-basiertes Rate-Limiting über die Tabelle rate_limits.
 * Pro (user, kind) ein Zähler; nach Ablauf des Fensters wird zurückgesetzt.
 */
export async function enforceRateLimit(
  admin: SupabaseClient,
  userId: string,
  kind: string,
  limit: number,
  windowMs: number,
): Promise<void> {
  const now = Date.now();
  const { data } = await admin
    .from('rate_limits')
    .select('count, window_start')
    .eq('user_id', userId)
    .eq('kind', kind)
    .maybeSingle();

  if (!data) {
    await admin
      .from('rate_limits')
      .insert({ user_id: userId, kind, count: 1, window_start: new Date(now).toISOString() });
    return;
  }

  const windowStart = new Date(data.window_start).getTime();
  const expired = now - windowStart > windowMs;

  if (expired) {
    await admin
      .from('rate_limits')
      .update({ count: 1, window_start: new Date(now).toISOString() })
      .eq('user_id', userId)
      .eq('kind', kind);
    return;
  }

  if (data.count >= limit) {
    throw new HttpError(429, 'Limit erreicht. Bitte versuche es später erneut.');
  }

  await admin
    .from('rate_limits')
    .update({ count: data.count + 1 })
    .eq('user_id', userId)
    .eq('kind', kind);
}
