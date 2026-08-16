import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { SaveStayInput } from './stays';

let mockSupabase: any = null;
vi.mock('./supabase', () => ({
  get supabase() {
    return mockSupabase;
  },
}));

const getRealUserIdMock = vi.fn();
vi.mock('./auth', () => ({
  getRealUserId: (...args: unknown[]) => getRealUserIdMock(...args),
}));

import { saveStay, updateReflection, listStays } from './stays';

const baseInput: SaveStayInput = {
  moodBefore: 'anxious',
  environment: 'urban',
  minutesAvailable: 15,
  recommendation: { title: 'Box breathing', whyThisFits: 'x', firstStep: 'y', durationMinutes: 5 },
};

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  getRealUserIdMock.mockReset();
});

afterEach(() => {
  vi.restoreAllMocks();
  mockSupabase = null;
});

describe('saveStay', () => {
  it("retourne status 'error' si supabase n'est pas initialisé", async () => {
    mockSupabase = null;
    expect(await saveStay(baseInput)).toEqual({ status: 'error' });
  });

  it("retourne status 'needs-auth' si aucun utilisateur réel n'est connecté", async () => {
    mockSupabase = { from: vi.fn() };
    getRealUserIdMock.mockResolvedValue(null);
    expect(await saveStay(baseInput)).toEqual({ status: 'needs-auth' });
    expect(mockSupabase.from).not.toHaveBeenCalled();
  });

  it("insère la ligne avec les champs snake_case attendus et retourne l'id créé", async () => {
    getRealUserIdMock.mockResolvedValue('user-1');
    const single = vi.fn().mockResolvedValue({ data: { id: 'stay-1' }, error: null });
    const select = vi.fn().mockReturnValue({ single });
    const insert = vi.fn().mockReturnValue({ select });
    mockSupabase = { from: vi.fn().mockReturnValue({ insert }) };

    const result = await saveStay(baseInput);

    expect(mockSupabase.from).toHaveBeenCalledWith('stays');
    expect(insert).toHaveBeenCalledWith({
      user_id: 'user-1',
      mood_before: 'anxious',
      environment: 'urban',
      minutes_available: 15,
      recommendation_title: 'Box breathing',
      recommendation_first_step: 'y',
    });
    expect(result).toEqual({ status: 'saved', id: 'stay-1' });
  });

  it('retourne status "error" si la requête Supabase échoue', async () => {
    getRealUserIdMock.mockResolvedValue('user-1');
    const single = vi.fn().mockResolvedValue({ data: null, error: new Error('db down') });
    mockSupabase = {
      from: vi.fn().mockReturnValue({
        insert: vi.fn().mockReturnValue({ select: vi.fn().mockReturnValue({ single }) }),
      }),
    };
    expect(await saveStay(baseInput)).toEqual({ status: 'error' });
  });

  it("retourne status 'error' si aucun id n'est renvoyé malgré l'absence d'erreur", async () => {
    getRealUserIdMock.mockResolvedValue('user-1');
    const single = vi.fn().mockResolvedValue({ data: {}, error: null });
    mockSupabase = {
      from: vi.fn().mockReturnValue({
        insert: vi.fn().mockReturnValue({ select: vi.fn().mockReturnValue({ single }) }),
      }),
    };
    expect(await saveStay(baseInput)).toEqual({ status: 'error' });
  });
});

describe('updateReflection', () => {
  it("ne fait aucun appel réseau et retourne ok=true si rien n'est fourni", async () => {
    mockSupabase = { from: vi.fn() };
    const result = await updateReflection('stay-1', {});
    expect(result).toEqual({ ok: true });
    expect(mockSupabase.from).not.toHaveBeenCalled();
  });

  it("ne construit le payload qu'avec les champs explicitement fournis (partiel)", async () => {
    const eq = vi.fn().mockResolvedValue({ error: null });
    const update = vi.fn().mockReturnValue({ eq });
    mockSupabase = { from: vi.fn().mockReturnValue({ update }) };

    await updateReflection('stay-1', { notes: 'Ça a aidé' });

    expect(update).toHaveBeenCalledWith({ notes: 'Ça a aidé' });
    expect(eq).toHaveBeenCalledWith('id', 'stay-1');
  });

  it("inclut wasHelpful=false explicitement (ne doit pas être traité comme 'non fourni')", async () => {
    const eq = vi.fn().mockResolvedValue({ error: null });
    const update = vi.fn().mockReturnValue({ eq });
    mockSupabase = { from: vi.fn().mockReturnValue({ update }) };

    await updateReflection('stay-1', { wasHelpful: false });

    expect(update).toHaveBeenCalledWith({ was_helpful: false });
  });

  it("retourne ok=false si supabase n'est pas initialisé alors qu'il y a des données à écrire", async () => {
    mockSupabase = null;
    const result = await updateReflection('stay-1', { notes: 'x' });
    expect(result).toEqual({ ok: false });
  });

  it('retourne ok=false si la requête échoue', async () => {
    const eq = vi.fn().mockResolvedValue({ error: new Error('db down') });
    mockSupabase = { from: vi.fn().mockReturnValue({ update: vi.fn().mockReturnValue({ eq }) }) };
    expect(await updateReflection('stay-1', { notes: 'x' })).toEqual({ ok: false });
  });
});

describe('listStays', () => {
  it("retourne une liste vide sans erreur si supabase n'est pas initialisé", async () => {
    mockSupabase = null;
    expect(await listStays()).toEqual({ stays: [], error: false });
  });

  it("retourne une liste vide sans erreur si personne n'est connecté", async () => {
    mockSupabase = { from: vi.fn() };
    getRealUserIdMock.mockResolvedValue(null);
    const result = await listStays();
    expect(result).toEqual({ stays: [], error: false });
    expect(mockSupabase.from).not.toHaveBeenCalled();
  });

  it('mappe chaque ligne renvoyée via mapRowToStay et trie par chosen_at desc', async () => {
    getRealUserIdMock.mockResolvedValue('user-1');
    const order = vi.fn().mockResolvedValue({
      data: [
        {
          id: 's1',
          chosen_at: '2026-08-16T10:00:00Z',
          mood_before: 'anxious',
          environment: 'urban',
          minutes_available: 15,
          recommendation_title: 't',
          recommendation_first_step: 'f',
        },
      ],
      error: null,
    });
    const select = vi.fn().mockReturnValue({ order });
    mockSupabase = { from: vi.fn().mockReturnValue({ select }) };

    const result = await listStays();

    expect(select).toHaveBeenCalledWith('*');
    expect(order).toHaveBeenCalledWith('chosen_at', { ascending: false });
    expect(result.error).toBe(false);
    expect(result.stays).toHaveLength(1);
    expect(result.stays[0].id).toBe('s1');
  });

  it('retourne error=true si la requête échoue', async () => {
    getRealUserIdMock.mockResolvedValue('user-1');
    const order = vi.fn().mockResolvedValue({ data: null, error: new Error('db down') });
    mockSupabase = { from: vi.fn().mockReturnValue({ select: vi.fn().mockReturnValue({ order }) }) };
    const result = await listStays();
    expect(result).toEqual({ stays: [], error: true });
  });
});
