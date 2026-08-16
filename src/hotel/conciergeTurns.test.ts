import { describe, it, expect } from 'vitest';
import { TURNS } from './conciergeTurns';

// TURNS pilote le questionnaire du concierge : chaque question doit avoir
// une clé unique, des options non vides, et des valeurs cohérentes avec ce
// que le reste de l'app attend (energy: 'low'|'medium'|'high', etc.)
// Hypothèse : ces valeurs viennent de src/types.ts (UserContext) — à
// confirmer si besoin.

describe('TURNS', () => {
  it('contient exactement 4 questions', () => {
    expect(TURNS).toHaveLength(4);
  });

  it('a des clés toutes différentes', () => {
    const keys = TURNS.map((t) => t.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('couvre bien energy, minutesAvailable, environment et canGoOutside', () => {
    const keys = TURNS.map((t) => t.key).sort();
    expect(keys).toEqual(['canGoOutside', 'energy', 'environment', 'minutesAvailable'].sort());
  });

  it('chaque question a au moins 2 options', () => {
    for (const turn of TURNS) {
      expect(turn.options.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('chaque option a un label non vide et une value définie', () => {
    for (const turn of TURNS) {
      for (const option of turn.options) {
        expect(option.label.trim().length).toBeGreaterThan(0);
        expect(option.value).not.toBeUndefined();
      }
    }
  });

  it('les valeurs de la question "energy" sont low/medium/high', () => {
    const energyTurn = TURNS.find((t) => t.key === 'energy')!;
    expect(energyTurn.options.map((o) => o.value).sort()).toEqual(['high', 'low', 'medium'].sort());
  });

  it('les valeurs de la question "minutesAvailable" sont des nombres positifs', () => {
    const minutesTurn = TURNS.find((t) => t.key === 'minutesAvailable')!;
    for (const option of minutesTurn.options) {
      expect(typeof option.value).toBe('number');
      expect(option.value as number).toBeGreaterThan(0);
    }
  });

  it('les valeurs de la question "canGoOutside" sont bien true/false', () => {
    const outsideTurn = TURNS.find((t) => t.key === 'canGoOutside')!;
    expect(outsideTurn.options.map((o) => o.value).sort()).toEqual([false, true]);
  });

  it('la question "environment" propose les 5 environnements connus', () => {
    const envTurn = TURNS.find((t) => t.key === 'environment')!;
    expect(envTurn.options.map((o) => o.value).sort()).toEqual(
      ['coastal', 'countryside', 'mountains', 'suburban', 'urban'].sort(),
    );
  });
});
