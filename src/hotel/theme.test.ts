import { describe, it, expect } from 'vitest';
import { HOTEL_COLORS, HOTEL_SERIF } from './theme';

describe('HOTEL_COLORS', () => {
  const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

  it.each(Object.entries(HOTEL_COLORS))('%s est une couleur hexadécimale valide (%s)', (_key, value) => {
    expect(value).toMatch(HEX_COLOR);
  });

  it('contient les 6 clés attendues', () => {
    expect(Object.keys(HOTEL_COLORS).sort()).toEqual(
      ['brass', 'brassDim', 'panel', 'panelDeep', 'parchment', 'parchmentDim'].sort(),
    );
  });

  it('toutes les couleurs sont distinctes (pas de doublon copié-collé)', () => {
    const values = Object.values(HOTEL_COLORS);
    expect(new Set(values).size).toBe(values.length);
  });
});

describe('HOTEL_SERIF', () => {
  it('est la classe Tailwind attendue', () => {
    expect(HOTEL_SERIF).toBe('font-serif');
  });
});
