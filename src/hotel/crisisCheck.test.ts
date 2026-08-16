import { describe, it, expect } from 'vitest';
import { mentionsCrisis } from './crisisCheck';

// mentionsCrisis est un simple filtre par mots-clés (pas d'analyse), donc
// les tests couvrent : chaque phrase de la liste, l'insensibilité à la
// casse, la détection en tant que sous-chaîne dans un texte plus long, et
// l'absence de faux positifs sur du texte neutre.

const CRISIS_PHRASES = [
  'kill myself',
  'want to die',
  'end my life',
  'suicide',
  'self harm',
  'self-harm',
  'hurt myself',
  "can't go on",
  'no reason to live',
];

describe('mentionsCrisis', () => {
  it.each(CRISIS_PHRASES)('détecte la phrase "%s" isolée', (phrase) => {
    expect(mentionsCrisis(phrase)).toBe(true);
  });

  it.each(CRISIS_PHRASES)('détecte "%s" insensible à la casse', (phrase) => {
    expect(mentionsCrisis(phrase.toUpperCase())).toBe(true);
  });

  it.each(CRISIS_PHRASES)('détecte "%s" noyée dans une phrase plus longue', (phrase) => {
    expect(
      mentionsCrisis(`Aujourd'hui je me sens ${phrase} et je ne sais pas quoi faire`),
    ).toBe(true);
  });

  it('retourne false pour un texte neutre', () => {
    expect(mentionsCrisis('Je suis fatigué mais ça va, juste besoin de repos')).toBe(false);
  });

  it('retourne false pour une chaîne vide', () => {
    expect(mentionsCrisis('')).toBe(false);
  });

  it('ne fait pas de faux positif sur un mot proche mais différent', () => {
    // Aucune des phrases de la liste n'est un simple mot isolé comme "die",
    // donc un texte contenant un mot voisin sans la phrase complète ne doit
    // pas déclencher de faux positif.
    expect(mentionsCrisis('The dice landed on six')).toBe(false);
  });
});
