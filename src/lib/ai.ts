import type { UserContext, Recommendation } from '../types';
import { FALLBACK } from './fallback';
import { supabase } from './supabase';

const TIMEOUT_MS = 8000;

function isValidRecommendation(value: unknown): value is Recommendation {
  if (typeof value !== 'object' || value === null) return false;
  const rec = value as Record<string, unknown>;
  return (
    typeof rec.title === 'string' &&
    typeof rec.whyThisFits === 'string' &&
    typeof rec.firstStep === 'string' &&
    typeof rec.durationMinutes === 'number'
  );
}

export async function getRecommendations(
  ctx: UserContext,
): Promise<Recommendation[]> {
  try {
    const result = await Promise.race([
      supabase.functions.invoke<{ recommendations: unknown[] }>('recommend', {
        body: ctx,
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('recommend timeout')), TIMEOUT_MS),
      ),
    ]);

    if (result.error) throw result.error;
    const recommendations = result.data?.recommendations;
    if (
      Array.isArray(recommendations) &&
      recommendations.length === 3 &&
      recommendations.every(isValidRecommendation)
    ) {
      return recommendations;
    }
    throw new Error('malformed recommend response');
  } catch (error) {
    console.error('getRecommendations falling back to local data:', error);
    return FALLBACK[ctx.mood];
  }
}
