import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { UserContext } from '../types';

// ai.ts importe `supabase` depuis './supabase' — on mocke ce module pour
// contrôler ce que functions.invoke('recommend', ...) renvoie, sans jamais
// toucher au réseau ni à un vrai projet Supabase.
const invokeMock = vi.fn();
vi.mock('./supabase', () => ({
  supabase: {
    functions: { invoke: (...args: unknown[]) => invokeMock(...args) },
  },
}));

import { getRecommendations } from './ai';
import { FALLBACK } from './fallback';

const baseCtx: UserContext = {
  mood: 'anxious',
  energy: 'low',
  minutesAvailable: 30,
  environment: 'urban',
  canGoOutside: true,
};

const validRecommendations = [
  { title: 'A', whyThisFits: 'a', firstStep: 'do a', durationMinutes: 5 },
  { title: 'B', whyThisFits: 'b', firstStep: 'do b', durationMinutes: 5 },
  { title: 'C', whyThisFits: 'c', firstStep: 'do c', durationMinutes: 5 },
];

beforeEach(() => {
  invokeMock.mockReset();
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('getRecommendations', () => {
  it("retourne les recommandations de l'edge function quand la réponse est valide", async () => {
    invokeMock.mockResolvedValue({ data: { recommendations: validRecommendations }, error: null });
    const result = await getRecommendations(baseCtx);
    expect(result).toEqual(validRecommendations);
  });

  it('appelle bien la fonction "recommend" avec le contexte en body', async () => {
    invokeMock.mockResolvedValue({ data: { recommendations: validRecommendations }, error: null });
    await getRecommendations(baseCtx);
    expect(invokeMock).toHaveBeenCalledWith('recommend', { body: baseCtx });
  });

  it("retombe sur FALLBACK[mood] si l'edge function renvoie une erreur", async () => {
    invokeMock.mockResolvedValue({ data: null, error: new Error('boom') });
    const result = await getRecommendations(baseCtx);
    expect(result).toEqual(FALLBACK.anxious);
  });

  it('retombe sur FALLBACK[mood] si moins de 3 recommandations sont renvoyées', async () => {
    invokeMock.mockResolvedValue({ data: { recommendations: validRecommendations.slice(0, 2) }, error: null });
    const result = await getRecommendations(baseCtx);
    expect(result).toEqual(FALLBACK.anxious);
  });

  it('retombe sur FALLBACK[mood] si une recommandation a un champ manquant ou du mauvais type', async () => {
    const broken = [
      ...validRecommendations.slice(0, 2),
      { title: 'C', whyThisFits: 'c', firstStep: 'do c', durationMinutes: '5' as unknown as number },
    ];
    invokeMock.mockResolvedValue({ data: { recommendations: broken }, error: null });
    const result = await getRecommendations(baseCtx);
    expect(result).toEqual(FALLBACK.anxious);
  });

  it('retombe sur FALLBACK[mood] si data est absent', async () => {
    invokeMock.mockResolvedValue({ data: undefined, error: null });
    const result = await getRecommendations(baseCtx);
    expect(result).toEqual(FALLBACK.anxious);
  });

  it("utilise bien le fallback correspondant à l'humeur du contexte, pas toujours 'anxious'", async () => {
    invokeMock.mockResolvedValue({ data: null, error: new Error('boom') });
    const result = await getRecommendations({ ...baseCtx, mood: 'excited' });
    expect(result).toEqual(FALLBACK.excited);
  });
});

describe('getRecommendations — timeout', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("retombe sur le fallback si l'edge function ne répond pas sous 8 secondes", async () => {
    // invoke() ne se résout jamais dans ce test → seul le timeout interne
    // (Promise.race avec setTimeout(..., 8000)) doit trancher.
    invokeMock.mockReturnValue(new Promise(() => {}));
    const promise = getRecommendations(baseCtx);
    await vi.advanceTimersByTimeAsync(8000);
    const result = await promise;
    expect(result).toEqual(FALLBACK.anxious);
  });
});
