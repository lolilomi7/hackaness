import { describe, it, expect } from 'vitest';
import { mapRowToStay } from './staysMapping';

describe('mapRowToStay', () => {
  it('convertit une ligne complète (snake_case) en objet Stay (camelCase)', () => {
    const row = {
      id: 'stay-1',
      chosen_at: '2026-08-16T10:00:00Z',
      mood_before: 'anxious',
      environment: 'urban',
      minutes_available: 15,
      recommendation_title: 'Box breathing',
      recommendation_first_step: 'Breathe in for 4 counts...',
      mood_after: 'calm',
      was_helpful: true,
      notes: 'Ça a aidé',
      photo_paths: ['a.jpg', 'b.jpg'],
    };

    expect(mapRowToStay(row)).toEqual({
      id: 'stay-1',
      chosenAt: '2026-08-16T10:00:00Z',
      moodBefore: 'anxious',
      environment: 'urban',
      minutesAvailable: 15,
      recommendationTitle: 'Box breathing',
      recommendationFirstStep: 'Breathe in for 4 counts...',
      moodAfter: 'calm',
      wasHelpful: true,
      notes: 'Ça a aidé',
      photoPaths: ['a.jpg', 'b.jpg'],
    });
  });

  it('remplace les champs optionnels null par des valeurs par défaut cohérentes', () => {
    const row = {
      id: 'stay-2',
      chosen_at: '2026-08-16T11:00:00Z',
      mood_before: 'sad',
      environment: 'coastal',
      minutes_available: 30,
      recommendation_title: 'Text one person',
      recommendation_first_step: 'Open your messages...',
      mood_after: null,
      was_helpful: null,
      notes: null,
      photo_paths: null,
    };

    const stay = mapRowToStay(row);
    expect(stay.moodAfter).toBeNull();
    expect(stay.wasHelpful).toBeNull();
    expect(stay.notes).toBeNull();
    expect(stay.photoPaths).toEqual([]);
  });

  it("remplace les champs optionnels absents (undefined) de la même façon que null", () => {
    const row = {
      id: 'stay-3',
      chosen_at: '2026-08-16T12:00:00Z',
      mood_before: 'happy',
      environment: 'mountains',
      minutes_available: 60,
      recommendation_title: 'Share the moment',
      recommendation_first_step: 'Send a friend a message...',
      // mood_after, was_helpful, notes, photo_paths absents de la ligne
    };

    const stay = mapRowToStay(row);
    expect(stay.moodAfter).toBeNull();
    expect(stay.wasHelpful).toBeNull();
    expect(stay.notes).toBeNull();
    expect(stay.photoPaths).toEqual([]);
  });

  it('préserve was_helpful=false (ne doit pas être confondu avec "absent")', () => {
    const row = {
      id: 'stay-4',
      chosen_at: '2026-08-16T13:00:00Z',
      mood_before: 'tired',
      environment: 'suburban',
      minutes_available: 5,
      recommendation_title: 'Have a glass of water',
      recommendation_first_step: 'Get a glass of water...',
      was_helpful: false,
    };

    expect(mapRowToStay(row).wasHelpful).toBe(false);
  });
});
