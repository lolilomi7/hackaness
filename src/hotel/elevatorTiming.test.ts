import { describe, it, expect } from 'vitest';
import { WELCOME_MS, DOOR_ANIM_S, TICK_MS, FAST_TICK_MS } from './elevatorTiming';

// Ce fichier n'exporte que des constantes de timing. Les tests ici sont
// surtout des garde-fous : si quelqu'un modifie une valeur par erreur
// (ex: 4500 au lieu de 450), on veut un échec de test explicite plutôt
// qu'une régression silencieuse dans l'animation de l'ascenseur.

describe('elevatorTiming constants', () => {
  it('a les valeurs attendues', () => {
    expect(WELCOME_MS).toBe(500);
    expect(DOOR_ANIM_S).toBe(0.6);
    expect(TICK_MS).toBe(450);
    expect(FAST_TICK_MS).toBe(180);
  });

  it('toutes les constantes sont des nombres strictement positifs', () => {
    for (const value of [WELCOME_MS, DOOR_ANIM_S, TICK_MS, FAST_TICK_MS]) {
      expect(value).toBeGreaterThan(0);
    }
  });

  it("FAST_TICK_MS est plus rapide que TICK_MS (c'est son rôle : rattraper le retard)", () => {
    expect(FAST_TICK_MS).toBeLessThan(TICK_MS);
  });
});
