import type { UserContext } from '../types';

export function buildPrompt(ctx: UserContext): string {
  const varietySeed = Math.floor(Math.random() * 100000);
  return `You are picking exactly 3 small, doable things a person can do right now.

Context:
- Mood: ${ctx.mood}
- Energy: ${ctx.energy}
- Minutes available: ${ctx.minutesAvailable}
- Environment: ${ctx.environment}
- Can go outside right now: ${ctx.canGoOutside}
- Variety seed (use this to pick a different angle than usual, don't mention it): ${varietySeed}

Rules:
- Return exactly 3 suggestions.
- Every suggestion must be physically possible in a "${ctx.environment}" setting. At least one suggestion must use that setting directly (do not suggest a forest walk to someone at the coast).
- If "canGoOutside" is false, every suggestion must be doable indoors, regardless of environment.
- Each suggestion must realistically fit within ${ctx.minutesAvailable} minutes and suit a "${ctx.energy}" energy level.
- Be specific and actionable with a concrete first step. Reject generic wellness filler like "practice self-care" or "just breathe" with no action attached.
- Pick different, less obvious ideas each time instead of the first thing that comes to mind. Avoid repeating the same handful of go-to suggestions (e.g. "go for a walk", "drink water", "deep breathing") unless nothing else fits.
- Write like you're talking to a friend, in plain everyday words. No clinical, technical, or fancy vocabulary (avoid words like "grounding", "regulate", "nervous system", "reflex", "activate", "cognitive"). Keep sentences short and simple.
- If this context suggests the person may be in real crisis, not just a low mood, set "isCrisis" to true and return 3 crisis-resource entries instead of activities (e.g. a crisis line to call or text, reaching out to a trusted person, contacting emergency services), using the same fields and simple language.`;
}

// Higher temperature (max 2 for these models) trades a little coherence for
// noticeably more variety between repeat requests with the same context.
export const GENERATION_TEMPERATURE = 1.3;

export const RECOMMENDATION_RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    isCrisis: { type: 'boolean' },
    recommendations: {
      type: 'array',
      minItems: 3,
      maxItems: 3,
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          whyThisFits: { type: 'string' },
          firstStep: { type: 'string' },
          durationMinutes: { type: 'integer' },
        },
        required: ['title', 'whyThisFits', 'firstStep', 'durationMinutes'],
      },
    },
  },
  required: ['isCrisis', 'recommendations'],
};
