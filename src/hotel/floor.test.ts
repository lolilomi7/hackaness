import { describe, it, expect } from 'vitest';
import { deriveFloor } from './floor';
import type { Mood, Environment } from '../types';

// deriveFloor doit être déterministe : (mood, environment) -> même étage,
// toujours, jamais de hasard. Formule observée dans le code :
// 2 + indexMood * 6 + indexEnvironment * 2
// Hypothèse (à confirmer via types.ts) : Mood et Environment sont des
// unions de chaînes correspondant exactement à MOOD_ORDER / ENV_ORDER
// définis dans floor.ts.

const MOODS: Mood[] = ['anxious', 'sad', 'angry', 'happy', 'calm', 'tired', 'excited', 'unsure'];
const ENVIRONMENTS: Environment[] = ['urban', 'suburban', 'countryside', 'coastal', 'mountains'];

describe('deriveFloor', () => {
  it('retourne 2 pour la première humeur et le premier environnement (anxious + urban)', () => {
    expect(deriveFloor('anxious', 'urban')).toBe(2);
  });

  it('retourne 52 pour la dernière humeur et le dernier environnement (unsure + mountains)', () => {
    expect(deriveFloor('unsure', 'mountains')).toBe(52);
  });

  it('est déterministe : deux appels identiques donnent le même résultat', () => {
    const first = deriveFloor('happy', 'coastal');
    const second = deriveFloor('happy', 'coastal');
    expect(first).toBe(second);
  });

  it("avance l'étage de 6 quand seule l'humeur change d'un cran", () => {
    const a = deriveFloor('anxious', 'urban');
    const b = deriveFloor('sad', 'urban');
    expect(b - a).toBe(6);
  });

  it("avance l'étage de 2 quand seul l'environnement change d'un cran", () => {
    const a = deriveFloor('calm', 'urban');
    const b = deriveFloor('calm', 'suburban');
    expect(b - a).toBe(2);
  });

  it('produit un étage différent pour chaque combinaison humeur/environnement', () => {
    const floors = new Set<number>();
    for (const mood of MOODS) {
      for (const environment of ENVIRONMENTS) {
        floors.add(deriveFloor(mood, environment));
      }
    }
    expect(floors.size).toBe(MOODS.length * ENVIRONMENTS.length);
  });

  // Cas limite : deriveFloor ne valide pas ses entrées. Une humeur ou un
  // environnement absent de la liste connue donne indexOf === -1, donc un
  // étage potentiellement négatif plutôt qu'une erreur explicite. Ce test
  // documente le comportement actuel — à surveiller si des données
  // corrompues (ex: mood mal orthographié) arrivent un jour jusqu'ici.
  it("ne lève pas d'erreur pour une humeur inconnue (comportement actuel, pas forcément voulu)", () => {
    expect(() => deriveFloor('not-a-real-mood' as Mood, 'urban')).not.toThrow();
    expect(deriveFloor('not-a-real-mood' as Mood, 'urban')).toBe(2 + -1 * 6 + 0 * 2);
  });
});
