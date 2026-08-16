import { describe, it, expect } from 'vitest';
import { FALLBACK } from './fallback';
import type { Mood } from '../types';

// FALLBACK est utilisé par ai.ts dès que l'edge function échoue ou renvoie
// une réponse invalide. Si sa structure est cassée, l'app plante en
// silence exactement au moment où elle est censée être la plus fiable —
// donc validation stricte ici.

const KNOWN_MOODS: Mood[] = ['anxious', 'sad', 'angry', 'happy', 'calm', 'tired', 'excited', 'unsure'];

describe('FALLBACK', () => {
  it('a une entrée pour chacune des 8 humeurs connues', () => {
    expect(Object.keys(FALLBACK).sort()).toEqual([...KNOWN_MOODS].sort());
  });

  it.each(KNOWN_MOODS)('l\'humeur "%s" a exactement 3 recommandations', (mood) => {
    expect(FALLBACK[mood]).toHaveLength(3);
  });

  it.each(KNOWN_MOODS)('chaque recommandation de "%s" a tous les champs requis, non vides', (mood) => {
    for (const rec of FALLBACK[mood]) {
      expect(rec.title.trim().length).toBeGreaterThan(0);
      expect(rec.whyThisFits.trim().length).toBeGreaterThan(0);
      expect(rec.firstStep.trim().length).toBeGreaterThan(0);
      expect(Number.isInteger(rec.durationMinutes)).toBe(true);
      expect(rec.durationMinutes).toBeGreaterThan(0);
    }
  });

  it("ne contient pas de titre dupliqué au sein d'une même humeur", () => {
    for (const mood of KNOWN_MOODS) {
      const titles = FALLBACK[mood].map((r) => r.title);
      expect(new Set(titles).size).toBe(titles.length);
    }
  });
});
