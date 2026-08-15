import type { UserContext, Recommendation } from '../types';
import { FALLBACK } from './fallback';

const STUB_DELAY_MS = 1500;

export async function getRecommendations(
  ctx: UserContext,
): Promise<Recommendation[]> {
  // TODO: replace with real Gemini API call using ctx to generate
  // 3 tailored Recommendation objects. Keep the same return shape.
  await new Promise((resolve) => setTimeout(resolve, STUB_DELAY_MS));
  return FALLBACK[ctx.mood];
}
