import type { Mood, Environment } from '../types';

export interface Stay {
  id: string;
  chosenAt: string;
  moodBefore: Mood;
  environment: Environment;
  minutesAvailable: number;
  recommendationTitle: string;
  recommendationFirstStep: string;
  moodAfter: Mood | null;
  wasHelpful: boolean | null;
  notes: string | null;
  photoPaths: string[];
}

export function mapRowToStay(row: Record<string, unknown>): Stay {
  return {
    id: row.id as string,
    chosenAt: row.chosen_at as string,
    moodBefore: row.mood_before as Mood,
    environment: row.environment as Environment,
    minutesAvailable: row.minutes_available as number,
    recommendationTitle: row.recommendation_title as string,
    recommendationFirstStep: row.recommendation_first_step as string,
    moodAfter: (row.mood_after as Mood | null) ?? null,
    wasHelpful: (row.was_helpful as boolean | null) ?? null,
    notes: (row.notes as string | null) ?? null,
    photoPaths: (row.photo_paths as string[] | null) ?? [],
  };
}
