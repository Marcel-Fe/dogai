// DogAI Edge Function: delete-user
// DSGVO — vollständige Konto- und Datenlöschung.
// DB-Zeilen werden per ON DELETE CASCADE entfernt; Storage-Objekte hier explizit.

import { adminClient, HttpError, requireUser } from '../_shared/clients.ts';
import { corsHeaders, json } from '../_shared/cors.ts';

async function purgeBucket(
  admin: ReturnType<typeof adminClient>,
  bucket: string,
  userId: string,
): Promise<void> {
  const { data } = await admin.storage.from(bucket).list(userId);
  if (!data?.length) return;
  const paths = data.map((f) => `${userId}/${f.name}`);
  await admin.storage.from(bucket).remove(paths);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const userId = await requireUser(req);
    const admin = adminClient();

    // Eigene Storage-Objekte entfernen.
    await purgeBucket(admin, 'dog-avatars', userId);
    await purgeBucket(admin, 'scan-photos', userId);

    // Auth-Nutzer löschen — kaskadiert auf alle DB-Tabellen.
    const { error } = await admin.auth.admin.deleteUser(userId);
    if (error) throw new HttpError(500, error.message);

    return json({ ok: true });
  } catch (err) {
    const status = err instanceof HttpError ? err.status : 500;
    const message = err instanceof Error ? err.message : 'Unbekannter Fehler';
    return json({ error: message }, status);
  }
});
