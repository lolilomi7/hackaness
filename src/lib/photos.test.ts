import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

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

import { uploadStayPhoto, resolvePhotoUrls, deleteStayPhoto } from './photos';

function makeFile(name: string, type = 'image/jpeg'): File {
  return new File(['fake-bytes'], name, { type });
}

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  getRealUserIdMock.mockReset();
  vi.stubGlobal('crypto', { randomUUID: () => 'fixed-uuid' });
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  mockSupabase = null;
});

describe('uploadStayPhoto', () => {
  it("retourne une erreur si supabase n'est pas initialisé", async () => {
    mockSupabase = null;
    const result = await uploadStayPhoto('stay-1', makeFile('photo.jpg'));
    expect(result).toEqual({ path: null, error: 'Photo uploads are unavailable right now.' });
  });

  it("retourne une erreur si personne n'est connecté", async () => {
    mockSupabase = { storage: { from: vi.fn() } };
    getRealUserIdMock.mockResolvedValue(null);
    const result = await uploadStayPhoto('stay-1', makeFile('photo.jpg'));
    expect(result).toEqual({ path: null, error: 'Sign in to add photos.' });
  });

  it('construit le chemin userId/stayId/uuid.ext et envoie au bucket "stay-photos"', async () => {
    getRealUserIdMock.mockResolvedValue('user-1');
    const upload = vi.fn().mockResolvedValue({ error: null });
    const from = vi.fn().mockReturnValue({ upload });
    mockSupabase = { storage: { from } };

    const result = await uploadStayPhoto('stay-1', makeFile('photo.JPG'));

    expect(from).toHaveBeenCalledWith('stay-photos');
    expect(upload).toHaveBeenCalledWith(
      'user-1/stay-1/fixed-uuid.jpg',
      expect.any(File),
      expect.objectContaining({ upsert: false }),
    );
    expect(result).toEqual({ path: 'user-1/stay-1/fixed-uuid.jpg', error: null });
  });

  it('retombe sur l\'extension "jpg" si le fichier n\'a pas d\'extension', async () => {
    getRealUserIdMock.mockResolvedValue('user-1');
    const upload = vi.fn().mockResolvedValue({ error: null });
    mockSupabase = { storage: { from: vi.fn().mockReturnValue({ upload }) } };

    const result = await uploadStayPhoto('stay-1', makeFile('photo-without-extension'));

    expect(result.path).toBe('user-1/stay-1/fixed-uuid.jpg');
  });

  it("retourne une erreur générique si l'upload échoue", async () => {
    getRealUserIdMock.mockResolvedValue('user-1');
    const upload = vi.fn().mockResolvedValue({ error: new Error('quota exceeded') });
    mockSupabase = { storage: { from: vi.fn().mockReturnValue({ upload }) } };

    const result = await uploadStayPhoto('stay-1', makeFile('photo.jpg'));
    expect(result).toEqual({ path: null, error: 'Could not upload that photo. Try again in a moment.' });
  });
});

describe('resolvePhotoUrls', () => {
  it('retourne un objet vide si la liste de chemins est vide', async () => {
    mockSupabase = { storage: { from: vi.fn() } };
    expect(await resolvePhotoUrls([])).toEqual({});
  });

  it("retourne un objet vide si supabase n'est pas initialisé", async () => {
    mockSupabase = null;
    expect(await resolvePhotoUrls(['a.jpg'])).toEqual({});
  });

  it('construit un dictionnaire path -> URL signée', async () => {
    const createSignedUrls = vi.fn().mockResolvedValue({
      data: [
        { path: 'a.jpg', signedUrl: 'https://signed/a' },
        { path: 'b.jpg', signedUrl: 'https://signed/b' },
      ],
      error: null,
    });
    mockSupabase = { storage: { from: vi.fn().mockReturnValue({ createSignedUrls }) } };

    const result = await resolvePhotoUrls(['a.jpg', 'b.jpg']);

    expect(createSignedUrls).toHaveBeenCalledWith(['a.jpg', 'b.jpg'], 60 * 60);
    expect(result).toEqual({ 'a.jpg': 'https://signed/a', 'b.jpg': 'https://signed/b' });
  });

  it('ignore les entrées sans signedUrl ou sans path', async () => {
    const createSignedUrls = vi.fn().mockResolvedValue({
      data: [
        { path: 'a.jpg', signedUrl: 'https://signed/a' },
        { path: null, signedUrl: 'https://x' },
      ],
      error: null,
    });
    mockSupabase = { storage: { from: vi.fn().mockReturnValue({ createSignedUrls }) } };

    const result = await resolvePhotoUrls(['a.jpg']);
    expect(result).toEqual({ 'a.jpg': 'https://signed/a' });
  });

  it('retourne un objet vide si la requête échoue', async () => {
    const createSignedUrls = vi.fn().mockResolvedValue({ data: null, error: new Error('boom') });
    mockSupabase = { storage: { from: vi.fn().mockReturnValue({ createSignedUrls }) } };
    expect(await resolvePhotoUrls(['a.jpg'])).toEqual({});
  });
});

describe('deleteStayPhoto', () => {
  it("retourne ok=false si supabase n'est pas initialisé", async () => {
    mockSupabase = null;
    expect(await deleteStayPhoto('a.jpg')).toEqual({ ok: false });
  });

  it('supprime le fichier du bucket et retourne ok=true', async () => {
    const remove = vi.fn().mockResolvedValue({ error: null });
    mockSupabase = { storage: { from: vi.fn().mockReturnValue({ remove }) } };

    const result = await deleteStayPhoto('a.jpg');

    expect(remove).toHaveBeenCalledWith(['a.jpg']);
    expect(result).toEqual({ ok: true });
  });

  it('retourne ok=false si la suppression échoue', async () => {
    const remove = vi.fn().mockResolvedValue({ error: new Error('not found') });
    mockSupabase = { storage: { from: vi.fn().mockReturnValue({ remove }) } };
    expect(await deleteStayPhoto('a.jpg')).toEqual({ ok: false });
  });
});
