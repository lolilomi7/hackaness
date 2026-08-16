import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { SaveStayInput } from './stays';

const saveStayMock = vi.fn();
vi.mock('./stays', () => ({
  saveStay: (...args: unknown[]) => saveStayMock(...args),
}));

import { queuePendingStay, hasPendingStays, flushPendingStays } from './pendingStays';

const STORAGE_KEY = 'hackaness_pending_stays';

const baseInput: SaveStayInput = {
  moodBefore: 'anxious',
  environment: 'urban',
  minutesAvailable: 15,
  recommendation: { title: 'Box breathing', whyThisFits: 'x', firstStep: 'y', durationMinutes: 5 },
};

let uuidCounter = 0;

beforeEach(() => {
  localStorage.clear();
  saveStayMock.mockReset();
  uuidCounter = 0;
  vi.stubGlobal('crypto', { randomUUID: () => `uuid-${++uuidCounter}` });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('queuePendingStay', () => {
  it('ajoute un stay en attente avec un localId généré et le retourne', () => {
    const result = queuePendingStay(baseInput);
    expect(result).toEqual({ ...baseInput, localId: 'uuid-1' });
  });

  it('persiste le stay dans localStorage sous la bonne clé', () => {
    queuePendingStay(baseInput);
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(stored).toEqual([{ ...baseInput, localId: 'uuid-1' }]);
  });

  it('empile plusieurs stays en attente sans écraser les précédents', () => {
    queuePendingStay(baseInput);
    queuePendingStay({ ...baseInput, minutesAvailable: 30 });
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(stored).toHaveLength(2);
    expect(stored[1].minutesAvailable).toBe(30);
  });
});

describe('hasPendingStays', () => {
  it("retourne false quand rien n'est en attente", () => {
    expect(hasPendingStays()).toBe(false);
  });

  it('retourne true après avoir mis en attente un stay', () => {
    queuePendingStay(baseInput);
    expect(hasPendingStays()).toBe(true);
  });

  it('retourne false si localStorage contient du JSON corrompu (ne plante pas)', () => {
    localStorage.setItem(STORAGE_KEY, '{not valid json');
    expect(hasPendingStays()).toBe(false);
  });
});

describe('flushPendingStays', () => {
  it("retourne un tableau vide s'il n'y a rien en attente, sans appeler saveStay", async () => {
    const result = await flushPendingStays();
    expect(result).toEqual([]);
    expect(saveStayMock).not.toHaveBeenCalled();
  });

  it('sauvegarde chaque stay en attente et vide la file en cas de succès', async () => {
    queuePendingStay(baseInput);
    saveStayMock.mockResolvedValue({ status: 'saved', id: 'stay-1' });

    const result = await flushPendingStays();

    expect(saveStayMock).toHaveBeenCalledWith(baseInput);
    expect(result).toEqual([{ localId: 'uuid-1', result: { status: 'saved', id: 'stay-1' } }]);
    expect(hasPendingStays()).toBe(false);
  });

  it('remet en file les stays dont la sauvegarde échoue, sans toucher aux autres', async () => {
    queuePendingStay(baseInput);
    queuePendingStay({ ...baseInput, minutesAvailable: 30 });
    saveStayMock
      .mockResolvedValueOnce({ status: 'error' })
      .mockResolvedValueOnce({ status: 'saved', id: 'stay-2' });

    await flushPendingStays();

    const stillPending = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(stillPending).toHaveLength(1);
    expect(stillPending[0].localId).toBe('uuid-1');
  });

  it("remet aussi en file un stay dont la sauvegarde demande une authentification", async () => {
    queuePendingStay(baseInput);
    saveStayMock.mockResolvedValue({ status: 'needs-auth' });

    await flushPendingStays();

    expect(hasPendingStays()).toBe(true);
  });
});
