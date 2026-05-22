import { fetch as expoFetch } from 'expo/fetch';
import { supabase } from './supabase';
import { env } from './env';
import type { BreedDetail, ScanCategory, ScanResult } from '@/types';

/**
 * Typisierte Clients für die Claude-Edge-Functions.
 * Der Anthropic-Key liegt ausschließlich serverseitig — der Client ruft
 * nur die Supabase Edge Functions auf.
 */

const FUNCTIONS_BASE = `${env.supabaseUrl}/functions/v1`;

async function authHeader(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error('Nicht angemeldet.');
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

type StreamChatArgs = {
  sessionId: string;
  message: string;
  dogId?: string | null;
  locale: string;
  onToken: (text: string) => void;
  signal?: AbortSignal;
};

/**
 * Streamt eine Chat-Antwort token-weise über Server-Sent-Events.
 * Nutzt `expo/fetch` — Standard-RN-fetch kann Response-Bodies nicht streamen.
 */
export async function streamChat({
  sessionId,
  message,
  dogId,
  locale,
  onToken,
  signal,
}: StreamChatArgs): Promise<void> {
  const headers = await authHeader();
  const res = await expoFetch(`${FUNCTIONS_BASE}/chat`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ mode: 'chat', sessionId, message, dogId, locale }),
    signal,
  });

  if (!res.ok || !res.body) {
    throw new Error(`Chat fehlgeschlagen (${res.status})`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data:')) continue;
      const payload = trimmed.slice(5).trim();
      if (payload === '[DONE]') return;
      try {
        const evt = JSON.parse(payload) as { type: string; text?: string };
        if (evt.type === 'delta' && evt.text) onToken(evt.text);
      } catch {
        // unvollständiges JSON-Fragment — wird mit dem nächsten Chunk ergänzt
      }
    }
  }
}

/** Ruft die Vision-Function auf und liefert ein strukturiertes Scan-Ergebnis. */
export async function runVision(args: {
  scanId: string;
  storagePath: string;
  category: ScanCategory;
  locale: string;
}): Promise<ScanResult> {
  const { data, error } = await supabase.functions.invoke<ScanResult>('vision', {
    body: args,
  });
  if (error || !data) {
    throw new Error(error?.message ?? 'Bilderkennung fehlgeschlagen.');
  }
  return data;
}

/** Erzeugt die ausführlichen Rassen-Detailtexte per KI. */
export async function generateBreedDetail(
  breedId: string,
  locale: string,
): Promise<BreedDetail> {
  const { data, error } = await supabase.functions.invoke<BreedDetail>('chat', {
    body: { mode: 'breed', breedId, locale },
  });
  if (error || !data) {
    throw new Error(error?.message ?? 'Rassen-Details konnten nicht geladen werden.');
  }
  return data;
}
