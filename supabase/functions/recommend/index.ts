import {
  buildPrompt,
  RECOMMENDATION_RESPONSE_SCHEMA,
  GENERATION_TEMPERATURE,
} from '../../../src/lib/prompt.ts';

// Cheapest flash-tier model as of writing. Override with the GEMINI_MODEL
// secret if you need a different one.
const GEMINI_MODEL = Deno.env.get('GEMINI_MODEL') ?? 'gemini-3.1-flash-lite';
const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Kept in sync with the enums in src/types.ts for runtime validation.
const MOODS = ['anxious', 'sad', 'angry', 'happy', 'calm', 'tired', 'excited', 'unsure'];
const ENERGIES = ['low', 'medium', 'high'];
const ENVIRONMENTS = ['urban', 'suburban', 'countryside', 'coastal', 'mountains'];
const MINUTES = [5, 30, 60];

function isValidContext(value: unknown): value is Parameters<typeof buildPrompt>[0] {
  if (typeof value !== 'object' || value === null) return false;
  const ctx = value as Record<string, unknown>;
  return (
    MOODS.includes(ctx.mood as string) &&
    ENERGIES.includes(ctx.energy as string) &&
    MINUTES.includes(ctx.minutesAvailable as number) &&
    ENVIRONMENTS.includes(ctx.environment as string) &&
    typeof ctx.canGoOutside === 'boolean'
  );
}

// Gemini's flash tier occasionally 503s under load; absorb that here so a
// single transient blip doesn't fall all the way through to the fallback data.
const RETRY_DELAYS_MS = [300, 800];

async function callGemini(ctx: Parameters<typeof buildPrompt>[0]): Promise<string> {
  for (let attempt = 0; ; attempt++) {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: buildPrompt(ctx) }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            responseSchema: RECOMMENDATION_RESPONSE_SCHEMA,
            temperature: GENERATION_TEMPERATURE,
          },
        }),
      },
    );

    if (geminiRes.ok) {
      const geminiJson = await geminiRes.json();
      const text = geminiJson.candidates?.[0]?.content?.parts?.[0]?.text;
      if (typeof text === 'string') return text;
    }

    // Only server-side failures are worth retrying; bad requests won't fix themselves.
    const retryable = !geminiRes.ok && geminiRes.status >= 500;
    if (!retryable || attempt >= RETRY_DELAYS_MS.length) {
      throw new Error(`Gemini request failed: ${geminiRes.status}`);
    }
    await new Promise((resolve) => setTimeout(resolve, RETRY_DELAYS_MS[attempt]));
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS });
  }

  try {
    if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY not configured');

    const body = await req.json();
    if (!isValidContext(body)) {
      return new Response(JSON.stringify({ error: 'invalid context' }), {
        status: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    const text = await callGemini(body);

    return new Response(text, {
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('recommend function error:', error);
    return new Response(JSON.stringify({ error: 'recommendation generation failed' }), {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }
});
