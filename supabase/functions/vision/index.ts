// DogAI Edge Function: vision
// Analysiert ein Hunde-Foto und liefert eine strukturierte Ersteinschätzung.
// KEINE Diagnose — siehe System-Prompt und Disclaimer.

import Anthropic from 'npm:@anthropic-ai/sdk@0.69.0';
import { encodeBase64 } from 'jsr:@std/encoding@1/base64';
import { adminClient, anthropic, HttpError, MODELS, requireUser } from '../_shared/clients.ts';
import { corsHeaders, json } from '../_shared/cors.ts';
import { enforceRateLimit } from '../_shared/rateLimit.ts';
import { vetDisclaimer, visionSystemPrompt } from '../_shared/prompts.ts';

const DAY = 24 * 60 * 60 * 1000;

const VISION_TOOL: Anthropic.Tool = {
  name: 'scan_assessment',
  description: 'Strukturierte Ersteinschätzung eines Hunde-Fotos. KEINE Diagnose.',
  input_schema: {
    type: 'object',
    properties: {
      severity: {
        type: 'string',
        enum: ['info', 'low', 'medium', 'high'],
        description: "'info' wenn kein Befund/Bild unklar, sonst Dringlichkeit.",
      },
      findings: {
        type: 'array',
        description: 'Sichtbare Beobachtungen — keine Diagnosen.',
        items: {
          type: 'object',
          properties: {
            label: { type: 'string' },
            confidence: { type: 'string', enum: ['low', 'mid', 'high'] },
            note: { type: 'string' },
          },
          required: ['label', 'confidence', 'note'],
        },
      },
      recommendation: {
        type: 'string',
        description: 'Konkrete, vorsichtige Handlungsempfehlung für den Halter.',
      },
      vetRequired: {
        type: 'boolean',
        description: 'true, wenn ein Tierarztbesuch angeraten ist.',
      },
    },
    required: ['severity', 'findings', 'recommendation', 'vetRequired'],
  },
};

type VisionBody = {
  scanId: string;
  storagePath: string;
  category: string;
  locale: string;
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const userId = await requireUser(req);
    const body = (await req.json()) as VisionBody;
    if (!body.scanId || !body.storagePath) {
      throw new HttpError(400, 'scanId und storagePath sind erforderlich.');
    }

    const admin = adminClient();
    await enforceRateLimit(admin, userId, 'vision', 5, DAY);

    // Scan muss dem Nutzer gehören.
    const { data: scan } = await admin
      .from('scans')
      .select('id, user_id')
      .eq('id', body.scanId)
      .maybeSingle();
    if (!scan || scan.user_id !== userId) {
      throw new HttpError(403, 'Kein Zugriff auf diesen Scan.');
    }

    // Bild aus dem privaten Bucket laden.
    const dl = await admin.storage.from('scan-photos').download(body.storagePath);
    if (dl.error || !dl.data) throw new HttpError(404, 'Bild nicht gefunden.');
    const bytes = new Uint8Array(await dl.data.arrayBuffer());
    const mediaType = dl.data.type === 'image/png' ? 'image/png' : 'image/jpeg';

    const res = await anthropic.messages.create({
      model: MODELS.vision,
      max_tokens: 1200,
      system: [
        {
          type: 'text',
          text: visionSystemPrompt(body.locale),
          cache_control: { type: 'ephemeral' },
        },
      ],
      tools: [VISION_TOOL],
      tool_choice: { type: 'tool', name: 'scan_assessment' },
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: mediaType, data: encodeBase64(bytes) },
            },
            {
              type: 'text',
              text: `Kategorie der Prüfung: ${body.category}. Gib deine Ersteinschätzung über das Tool.`,
            },
          ],
        },
      ],
    });

    const toolUse = res.content.find(
      (b): b is Anthropic.ToolUseBlock => b.type === 'tool_use',
    );
    if (!toolUse) throw new HttpError(502, 'KI-Antwort ohne strukturiertes Ergebnis.');

    const result = {
      ...(toolUse.input as Record<string, unknown>),
      disclaimer: vetDisclaimer(body.locale),
    };

    // Ergebnis persistieren.
    await admin.from('scans').update({ result }).eq('id', body.scanId);

    return json(result);
  } catch (err) {
    const status = err instanceof HttpError ? err.status : 500;
    const message = err instanceof Error ? err.message : 'Unbekannter Fehler';
    return json({ error: message }, status);
  }
});
