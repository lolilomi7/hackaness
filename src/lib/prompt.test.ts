import { describe, it, expect } from 'vitest';
import { buildPrompt, GENERATION_TEMPERATURE, RECOMMENDATION_RESPONSE_SCHEMA } from './prompt';
import type { UserContext } from '../types';

const baseCtx: UserContext = {
  mood: 'anxious',
  energy: 'low',
  minutesAvailable: 30,
  environment: 'urban',
  canGoOutside: true,
};

describe('buildPrompt', () => {
  it('injecte toutes les valeurs du contexte dans le prompt', () => {
    const prompt = buildPrompt(baseCtx);
    expect(prompt).toContain('Mood: anxious');
    expect(prompt).toContain('Energy: low');
    expect(prompt).toContain('Minutes available: 30');
    expect(prompt).toContain('Environment: urban');
    expect(prompt).toContain('Can go outside right now: true');
  });

  it('reflète canGoOutside=false correctement', () => {
    const prompt = buildPrompt({ ...baseCtx, canGoOutside: false });
    expect(prompt).toContain('Can go outside right now: false');
  });

  it('inclut un "variety seed" numérique entre 0 et 99999', () => {
    const prompt = buildPrompt(baseCtx);
    const match = prompt.match(/Variety seed[^:]*:\s*(\d+)/);
    expect(match).not.toBeNull();
    const seed = Number(match![1]);
    expect(seed).toBeGreaterThanOrEqual(0);
    expect(seed).toBeLessThan(100000);
  });

  it('génère un seed différent à chaque appel (au moins la plupart du temps)', () => {
    // Le seed vient de Math.random(), donc deux appels pourraient
    // théoriquement tomber sur la même valeur — extrêmement improbable
    // sur 100000 possibilités, donc on vérifie sur plusieurs tirages.
    const seeds = new Set<number>();
    for (let i = 0; i < 20; i++) {
      const match = buildPrompt(baseCtx).match(/Variety seed[^:]*:\s*(\d+)/);
      seeds.add(Number(match![1]));
    }
    expect(seeds.size).toBeGreaterThan(1);
  });

  it('mentionne bien la règle des 3 suggestions et la consigne de crise', () => {
    const prompt = buildPrompt(baseCtx);
    expect(prompt).toContain('Return exactly 3 suggestions');
    expect(prompt).toContain('isCrisis');
  });
});

describe('GENERATION_TEMPERATURE', () => {
  it('vaut 1.3', () => {
    expect(GENERATION_TEMPERATURE).toBe(1.3);
  });
});

describe('RECOMMENDATION_RESPONSE_SCHEMA', () => {
  it('exige isCrisis et recommendations en champs requis', () => {
    expect(RECOMMENDATION_RESPONSE_SCHEMA.required).toEqual(['isCrisis', 'recommendations']);
  });

  it('impose exactement 3 recommandations (min et max)', () => {
    expect(RECOMMENDATION_RESPONSE_SCHEMA.properties.recommendations.minItems).toBe(3);
    expect(RECOMMENDATION_RESPONSE_SCHEMA.properties.recommendations.maxItems).toBe(3);
  });

  it('chaque recommandation exige title, whyThisFits, firstStep, durationMinutes', () => {
    expect(RECOMMENDATION_RESPONSE_SCHEMA.properties.recommendations.items.required).toEqual([
      'title',
      'whyThisFits',
      'firstStep',
      'durationMinutes',
    ]);
  });
});
