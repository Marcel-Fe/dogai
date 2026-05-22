// DogAI Edge Function: chat
// mode 'chat'  -> streamt eine Assistenten-Antwort (SSE)
// mode 'breed' -> erzeugt strukturierte Rassen-Detailtexte (JSON)

import Anthropic from 'npm:@anthropic-ai/sdk@0.69.0';
import { adminClient, anthropic, HttpError, MODELS, requireUser } from '../_shared/clients.ts';
import { corsHeaders, json } from '../_shared/cors.ts';
import { enforceRateLimit } from '../_shared/rateLimit.ts';
import { breedSystemPrompt, chatSystemPrompt } from '../_shared/prompts.ts';

const HOUR = 60 * 60 * 1000;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const userId = await requireUser(req);
    const body = await req.json();
    const admin = adminClient();

    if (body.mode === 'breed') {
      return await handleBreed(admin, userId, body);
    }
    return await handleChat(admin, userId, body);
  } catch (err) {
    const status = err instanceof HttpError ? err.status : 500;
    const message = err instanceof Error ? err.message : 'Unbekannter Fehler';
    return json({ error: message }, status);
  }
});

// ---------------------------------------------------------------------------
// Chat-Modus (Streaming)
// ---------------------------------------------------------------------------

type ChatBody = {
  sessionId: string;
  message: string;
  dogId?: string | null;
  locale: string;
};

async function handleChat(
  admin: ReturnType<typeof adminClient>,
  userId: string,
  body: ChatBody,
): Promise<Response> {
  if (!body.sessionId || !body.message?.trim()) {
    throw new HttpError(400, 'sessionId und message sind erforderlich.');
  }
  await enforceRateLimit(admin, userId, 'chat', 30, HOUR);

  // Session muss dem Nutzer gehören.
  const { data: session } = await admin
    .from('chat_sessions')
    .select('id, user_id')
    .eq('id', body.sessionId)
    .maybeSingle();
  if (!session || session.user_id !== userId) {
    throw new HttpError(403, 'Kein Zugriff auf diese Unterhaltung.');
  }

  // Hundekontext laden (optional).
  let dogContext = '';
  if (body.dogId) {
    const { data: dog } = await admin
      .from('dogs')
      .select('name, breed_id, birth_date, weight_kg, sex, neutered')
      .eq('id', body.dogId)
      .eq('user_id', userId)
      .maybeSingle();
    if (dog) {
      dogContext = `Aktuelles Hundeprofil: ${JSON.stringify(dog)}`;
    }
  }

  // Letzte 10 Nachrichten als Verlauf.
  const { data: history } = await admin
    .from('chat_messages')
    .select('role, content')
    .eq('session_id', body.sessionId)
    .order('created_at', { ascending: true })
    .limit(20);

  const messages: Anthropic.MessageParam[] = (history ?? []).map((m) => ({
    role: m.role as 'user' | 'assistant',
    content: m.content,
  }));
  messages.push({ role: 'user', content: body.message });

  // Nutzer-Nachricht sofort speichern.
  await admin.from('chat_messages').insert({
    session_id: body.sessionId,
    role: 'user',
    content: body.message,
  });

  const system: Anthropic.TextBlockParam[] = [
    {
      type: 'text',
      text: chatSystemPrompt(body.locale),
      cache_control: { type: 'ephemeral' },
    },
  ];
  if (dogContext) system.push({ type: 'text', text: dogContext });

  const stream = anthropic.messages.stream({
    model: MODELS.chat,
    max_tokens: 1024,
    system,
    messages,
  });

  const encoder = new TextEncoder();
  const sse = new ReadableStream({
    async start(controller) {
      const send = (obj: unknown) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`));
      try {
        stream.on('text', (delta) => send({ type: 'delta', text: delta }));
        const final = await stream.finalMessage();
        const answer = final.content
          .filter((b): b is Anthropic.TextBlock => b.type === 'text')
          .map((b) => b.text)
          .join('');
        await admin.from('chat_messages').insert({
          session_id: body.sessionId,
          role: 'assistant',
          content: answer,
        });
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      } catch (e) {
        send({ type: 'error', message: e instanceof Error ? e.message : 'Fehler' });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(sse, {
    headers: {
      ...corsHeaders,
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}

// ---------------------------------------------------------------------------
// Breed-Modus (strukturiertes JSON via Tool)
// ---------------------------------------------------------------------------

const BREED_TOOL: Anthropic.Tool = {
  name: 'breed_detail',
  description: 'Liefert ausführliche Detailtexte zu einer Hunderasse.',
  input_schema: {
    type: 'object',
    properties: {
      care: { type: 'string', description: 'Pflege: Fell, Hygiene, Aufwand.' },
      training: { type: 'string', description: 'Training: Erziehbarkeit, Tipps.' },
      nutrition: { type: 'string', description: 'Ernährung: Bedarf, Besonderheiten.' },
      health: { type: 'string', description: 'Gesundheit: allgemein, Vorsorge.' },
      behavior: { type: 'string', description: 'Verhalten: Wesen, Familientauglichkeit.' },
    },
    required: ['care', 'training', 'nutrition', 'health', 'behavior'],
  },
};

async function handleBreed(
  admin: ReturnType<typeof adminClient>,
  userId: string,
  body: { breedId: string; locale: string },
): Promise<Response> {
  if (!body.breedId) throw new HttpError(400, 'breedId ist erforderlich.');
  await enforceRateLimit(admin, userId, 'breed', 120, HOUR);

  const { data: breed } = await admin
    .from('breeds')
    .select('name_de, name_en, fci_group_name, origin, size_class, temperament')
    .eq('id', body.breedId)
    .maybeSingle();
  if (!breed) throw new HttpError(404, 'Rasse nicht gefunden.');

  const name = body.locale === 'en' ? breed.name_en : breed.name_de;
  const facts = `Rasse: ${name}. FCI-Gruppe: ${breed.fci_group_name}. Herkunft: ${breed.origin}. Größenklasse: ${breed.size_class}. Wesensmerkmale: ${JSON.stringify(breed.temperament)}.`;

  const res = await anthropic.messages.create({
    model: MODELS.chat,
    max_tokens: 1500,
    system: [
      {
        type: 'text',
        text: breedSystemPrompt(body.locale),
        cache_control: { type: 'ephemeral' },
      },
    ],
    tools: [BREED_TOOL],
    tool_choice: { type: 'tool', name: 'breed_detail' },
    messages: [
      { role: 'user', content: `Erstelle die Detailtexte für diese Rasse.\n${facts}` },
    ],
  });

  const toolUse = res.content.find(
    (b): b is Anthropic.ToolUseBlock => b.type === 'tool_use',
  );
  if (!toolUse) throw new HttpError(502, 'KI-Antwort ohne strukturiertes Ergebnis.');

  const detail = toolUse.input as Record<string, string>;
  return json({ ...detail, generatedAt: new Date().toISOString() });
}
