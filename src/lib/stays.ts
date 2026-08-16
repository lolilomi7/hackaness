import { supabase } from './supabase';
import { getRealUserId } from './auth';
import { mapRowToStay } from './staysMapping';
import type { Mood, Environment, Recommendation } from '../types';
import type { Stay } from './staysMapping';

export type { Stay };

export interface SaveStayInput {
  moodBefore: Mood;
  environment: Environment;
  minutesAvailable: number;
  recommendation: Recommendation;
}

interface Reflection {
  moodAfter?: Mood;
  wasHelpful?: boolean;
  notes?: string;
  photoPaths?: string[];
}

export type SaveStayResult =
  | { status: 'saved'; id: string }
  | { status: 'needs-auth' }
  | { status: 'error' };

// Saving is gated on a real (non-anonymous) sign-in — browsing never
// touches auth at all, only this does, and only once someone chooses a room.
export async function saveStay(input: SaveStayInput): Promise<SaveStayResult> {
  if (!supabase) return { status: 'error' };
  try {
    const userId = await getRealUserId();
    if (!userId) return { status: 'needs-auth' };
    const { data, error } = await supabase
      .from('stays')
      .insert({
        user_id: userId,
        mood_before: input.moodBefore,
        environment: input.environment,
        minutes_available: input.minutesAvailable,
        recommendation_title: input.recommendation.title,
        recommendation_first_step: input.recommendation.firstStep,
      })
      .select('id')
      .single();
    if (error) throw error;
    const id = data?.id as string | undefined;
    return id ? { status: 'saved', id } : { status: 'error' };
  } catch (error) {
    console.error('stays: saveStay failed', error);
    return { status: 'error' };
  }
}

// Every field is independently optional — only the provided ones are
// written, so partial reflections never clobber what's already saved.
export async function updateReflection(
  stayId: string,
  reflection: Reflection,
): Promise<{ ok: boolean }> {
  const payload: Record<string, unknown> = {};
  if (reflection.moodAfter !== undefined) payload.mood_after = reflection.moodAfter;
  if (reflection.wasHelpful !== undefined) payload.was_helpful = reflection.wasHelpful;
  if (reflection.notes !== undefined) payload.notes = reflection.notes;
  if (reflection.photoPaths !== undefined) payload.photo_paths = reflection.photoPaths;
  if (Object.keys(payload).length === 0) return { ok: true };
  if (!supabase) return { ok: false };

  try {
    const { error } = await supabase.from('stays').update(payload).eq('id', stayId);
    if (error) throw error;
    return { ok: true };
  } catch (error) {
    console.error('stays: updateReflection failed', error);
    return { ok: false };
  }
}

export async function listStays(): Promise<{ stays: Stay[]; error: boolean }> {
  if (!supabase) return { stays: [], error: false };
  try {
    const userId = await getRealUserId();
    if (!userId) return { stays: [], error: false };
    const { data, error } = await supabase
      .from('stays')
      .select('*')
      .order('chosen_at', { ascending: false });
    if (error) throw error;
    return { stays: (data ?? []).map(mapRowToStay), error: false };
  } catch (error) {
    console.error('stays: listStays failed', error);
    return { stays: [], error: true };
  }
}
