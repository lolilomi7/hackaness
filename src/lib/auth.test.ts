import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// auth.ts vérifie `if (!supabase) return ...` en tout début de chaque
// fonction, donc on doit pouvoir simuler à la fois le cas où supabase.ts
// n'a pas pu créer de client (variables d'env manquantes → supabase ===
// null) et le cas normal avec un client mocké. On passe par un getter pour
// pouvoir changer la valeur exportée entre les tests sans redéfinir le
// mock à chaque fois.
let mockSupabase: any = null;
vi.mock('./supabase', () => ({
  get supabase() {
    return mockSupabase;
  },
}));

import { getRealUserId, sendMagicLink, onRealSignIn } from './auth';

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
  mockSupabase = null;
});

describe('quand supabase est indisponible (client non initialisé)', () => {
  it('getRealUserId retourne null sans planter', async () => {
    expect(await getRealUserId()).toBeNull();
  });

  it("sendMagicLink retourne un message d'erreur explicite", async () => {
    const result = await sendMagicLink('gradie@example.com');
    expect(result.error).toBe('Sign-in is unavailable right now.');
  });

  it('onRealSignIn retourne un unsubscribe no-op qui ne plante pas', () => {
    const callback = vi.fn();
    const unsubscribe = onRealSignIn(callback);
    expect(() => unsubscribe()).not.toThrow();
    expect(callback).not.toHaveBeenCalled();
  });
});

describe('quand supabase est disponible', () => {
  beforeEach(() => {
    mockSupabase = {
      auth: {
        getSession: vi.fn(),
        signInWithOtp: vi.fn(),
        onAuthStateChange: vi.fn(),
      },
    };
  });

  it("getRealUserId retourne l'id pour une vraie session (non anonyme)", async () => {
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: { user: { id: 'user-1', is_anonymous: false } } },
    });
    expect(await getRealUserId()).toBe('user-1');
  });

  it('getRealUserId retourne null pour une session anonyme', async () => {
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: { user: { id: 'anon-1', is_anonymous: true } } },
    });
    expect(await getRealUserId()).toBeNull();
  });

  it("getRealUserId retourne null quand il n'y a aucune session", async () => {
    mockSupabase.auth.getSession.mockResolvedValue({ data: { session: null } });
    expect(await getRealUserId()).toBeNull();
  });

  it('getRealUserId retourne null si getSession lève une exception', async () => {
    mockSupabase.auth.getSession.mockRejectedValue(new Error('network down'));
    expect(await getRealUserId()).toBeNull();
  });

  it("sendMagicLink appelle signInWithOtp avec l'email et l'URL de redirection", async () => {
    mockSupabase.auth.signInWithOtp.mockResolvedValue({ error: null });
    const result = await sendMagicLink('gradie@example.com');
    expect(result.error).toBeNull();
    expect(mockSupabase.auth.signInWithOtp).toHaveBeenCalledWith({
      email: 'gradie@example.com',
      options: { emailRedirectTo: window.location.origin },
    });
  });

  it("sendMagicLink retourne un message d'erreur générique si signInWithOtp échoue", async () => {
    mockSupabase.auth.signInWithOtp.mockResolvedValue({ error: new Error('invalid email') });
    const result = await sendMagicLink('not-an-email');
    expect(result.error).toBe('Could not send that link. Check the address and try again.');
  });

  it('onRealSignIn déclenche le callback seulement pour un vrai utilisateur (non anonyme)', () => {
    let capturedHandler: (event: unknown, session: unknown) => void = () => {};
    mockSupabase.auth.onAuthStateChange.mockImplementation((handler: typeof capturedHandler) => {
      capturedHandler = handler;
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    });

    const callback = vi.fn();
    onRealSignIn(callback);

    capturedHandler('SIGNED_IN', { user: { id: 'anon-2', is_anonymous: true } });
    expect(callback).not.toHaveBeenCalled();

    capturedHandler('SIGNED_IN', { user: { id: 'user-2', is_anonymous: false } });
    expect(callback).toHaveBeenCalledWith('user-2');
  });

  it('onRealSignIn retourne une fonction qui appelle unsubscribe', () => {
    const unsubscribeSpy = vi.fn();
    mockSupabase.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: unsubscribeSpy } },
    });

    const unsubscribe = onRealSignIn(vi.fn());
    unsubscribe();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});
