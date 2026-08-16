import { supabase } from './supabase';
import { getRealUserId } from './auth';

const BUCKET = 'stay-photos';
const SIGNED_URL_TTL_SECONDS = 60 * 60;

export interface PhotoUploadResult {
  path: string | null;
  error: string | null;
}

// Stored under the uploader's own user_id folder, matching the storage RLS
// policies (auth.uid() must equal the first path segment).
export async function uploadStayPhoto(stayId: string, file: File): Promise<PhotoUploadResult> {
  if (!supabase) return { path: null, error: 'Photo uploads are unavailable right now.' };
  try {
    const userId = await getRealUserId();
    if (!userId) return { path: null, error: 'Sign in to add photos.' };
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const path = `${userId}/${stayId}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
      contentType: file.type || undefined,
      upsert: false,
    });
    if (error) throw error;
    return { path, error: null };
  } catch (error) {
    console.error('photos: uploadStayPhoto failed', error);
    return { path: null, error: 'Could not upload that photo. Try again in a moment.' };
  }
}

// The bucket is private, so display needs a short-lived signed URL per path
// rather than a public one.
export async function resolvePhotoUrls(paths: string[]): Promise<Record<string, string>> {
  if (!supabase || paths.length === 0) return {};
  try {
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .createSignedUrls(paths, SIGNED_URL_TTL_SECONDS);
    if (error) throw error;
    const result: Record<string, string> = {};
    for (const entry of data ?? []) {
      if (entry.signedUrl && entry.path) result[entry.path] = entry.signedUrl;
    }
    return result;
  } catch (error) {
    console.error('photos: resolvePhotoUrls failed', error);
    return {};
  }
}

export async function deleteStayPhoto(path: string): Promise<{ ok: boolean }> {
  if (!supabase) return { ok: false };
  try {
    const { error } = await supabase.storage.from(BUCKET).remove([path]);
    if (error) throw error;
    return { ok: true };
  } catch (error) {
    console.error('photos: deleteStayPhoto failed', error);
    return { ok: false };
  }
}
