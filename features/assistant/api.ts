import { supabase } from '@/lib/supabase';
import { isDemoMode } from '@/lib/env';
import type { ChatMessage } from '@/types';

/**
 * Datenzugriff für den KI-Chat. Das eigentliche Streaming läuft über
 * `streamChat` aus lib/claude; hier nur Session- und Verlaufsverwaltung.
 */

/** Liefert die jüngste Chat-Session des Nutzers oder legt eine neue an. */
export async function getOrCreateSession(dogId: string | null): Promise<string> {
  if (isDemoMode) return 'demo-session';
  const { data: existing } = await supabase
    .from('chat_sessions')
    .select('id')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (existing) return existing.id;

  const { data: auth } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from('chat_sessions')
    .insert({ user_id: auth.user!.id, dog_id: dogId })
    .select('id')
    .single();
  if (error) throw error;
  return data.id;
}

/** Lädt den Nachrichtenverlauf einer Session. */
export async function loadMessages(sessionId: string): Promise<ChatMessage[]> {
  if (isDemoMode) return [];
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return (data ?? []).map((r) => ({
    id: r.id,
    sessionId: r.session_id,
    role: r.role,
    content: r.content,
    createdAt: r.created_at,
  }));
}
