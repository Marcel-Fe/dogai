import { createClient, type SupabaseClient } from 'npm:@supabase/supabase-js@2';
import Anthropic from 'npm:@anthropic-ai/sdk@0.69.0';

/**
 * Geteilte Clients & Auth-Helfer für die Edge Functions.
 * Secrets stammen aus den Supabase Function Secrets — niemals aus dem App-Bundle.
 */

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY')!;

/** Modell-IDs zentral — Chat schnell (Haiku), Vision sorgfältig (Opus). */
export const MODELS = {
  chat: 'claude-haiku-4-5',
  vision: 'claude-opus-4-7',
} as const;

export const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

/** Admin-Client (service_role) — umgeht RLS, nur serverseitig nutzen. */
export function adminClient(): SupabaseClient {
  return createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
}

/**
 * Verifiziert das JWT aus dem Authorization-Header und liefert die user_id.
 * Wirft bei fehlendem/ungültigem Token.
 */
export async function requireUser(req: Request): Promise<string> {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) throw new HttpError(401, 'Nicht angemeldet.');

  const client = createClient(SUPABASE_URL, ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
    auth: { persistSession: false },
  });
  const { data, error } = await client.auth.getUser();
  if (error || !data.user) throw new HttpError(401, 'Ungültige Sitzung.');
  return data.user.id;
}

/** Fehler mit HTTP-Status — wird im Function-Handler in eine Response übersetzt. */
export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}
