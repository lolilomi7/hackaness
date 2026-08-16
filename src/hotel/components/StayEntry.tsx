import { useState } from 'react';
import { HOTEL_COLORS, HOTEL_SERIF } from '../theme';
import { updateReflection } from '../../lib/stays';
import type { Mood } from '../../types';
import type { Stay } from '../../lib/stays';
import { mentionsCrisis } from '../crisisCheck';
import CrisisNotice from './CrisisNotice';
import PhotoUpload from './PhotoUpload';
import PhotoGallery from './PhotoGallery';

interface StayEntryProps {
  stay: Stay;
}

const MOODS: { value: Mood; label: string }[] = [
  { value: 'anxious', label: '😟' },
  { value: 'sad', label: '😔' },
  { value: 'angry', label: '😤' },
  { value: 'happy', label: '😊' },
  { value: 'calm', label: '😌' },
  { value: 'tired', label: '😴' },
  { value: 'excited', label: '🤩' },
  { value: 'unsure', label: '😐' },
];

const MOOD_EMOJI: Record<Mood, string> = Object.fromEntries(
  MOODS.map((m) => [m.value, m.label]),
) as Record<Mood, string>;

export default function StayEntry({ stay }: StayEntryProps) {
  const [open, setOpen] = useState(false);
  const [moodAfter, setMoodAfter] = useState(stay.moodAfter);
  const [helpful, setHelpful] = useState(stay.wasHelpful);
  const [notes, setNotes] = useState(stay.notes ?? '');
  const [savedNotes, setSavedNotes] = useState(stay.notes ?? '');
  const [savingNotes, setSavingNotes] = useState(false);
  const [photoPaths, setPhotoPaths] = useState(stay.photoPaths);
  const [showCrisis, setShowCrisis] = useState(false);
  const [saveError, setSaveError] = useState(false);

  const notesDirty = notes.trim() !== savedNotes;

  const handleUpdate = async (payload: Parameters<typeof updateReflection>[1]) => {
    const { ok } = await updateReflection(stay.id, payload);
    setSaveError(!ok);
    return ok;
  };

  const pickMood = (mood: Mood) => {
    setMoodAfter(mood);
    handleUpdate({ moodAfter: mood });
  };

  const pickHelpful = (value: boolean) => {
    setHelpful(value);
    handleUpdate({ wasHelpful: value });
  };

  const saveNotes = async () => {
    const trimmed = notes.trim();
    if (trimmed === savedNotes) return;
    if (mentionsCrisis(trimmed)) setShowCrisis(true);
    setSavingNotes(true);
    const ok = await handleUpdate({ notes: trimmed });
    if (ok) setSavedNotes(trimmed);
    setSavingNotes(false);
  };

  const date = new Date(stay.chosenAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      className="rounded-2xl border p-3"
      style={{ borderColor: HOTEL_COLORS.brassDim, background: HOTEL_COLORS.panel }}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 text-left"
      >
        {photoPaths.length > 0 && <PhotoGallery paths={photoPaths} variant="lead" />}
        <span className="flex flex-1 items-center justify-between gap-2">
          <span>
            <span className={`${HOTEL_SERIF} text-sm`} style={{ color: HOTEL_COLORS.parchment }}>
              {stay.recommendationTitle}
            </span>
            <span className="block text-xs" style={{ color: HOTEL_COLORS.parchmentDim }}>
              {date} · felt {MOOD_EMOJI[stay.moodBefore]}
              {moodAfter ? ` → ${MOOD_EMOJI[moodAfter]}` : ''}
            </span>
          </span>
          <span style={{ color: HOTEL_COLORS.brass }}>{open ? '−' : '+'}</span>
        </span>
      </button>

      {open && (
        <div className="mt-3 flex flex-col gap-2.5">
          <p className="text-sm" style={{ color: HOTEL_COLORS.parchmentDim }}>
            {stay.recommendationFirstStep}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {MOODS.map((mood) => (
              <button
                key={mood.value}
                type="button"
                onClick={() => pickMood(mood.value)}
                className="rounded-full border px-2.5 py-1 text-sm"
                style={{
                  borderColor: HOTEL_COLORS.brass,
                  background: moodAfter === mood.value ? HOTEL_COLORS.brass : 'transparent',
                }}
              >
                {mood.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            {([[true, '👍 Helpful'], [false, '🤷 Not quite']] as [boolean, string][]).map(
              ([value, label]) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => pickHelpful(value)}
                  className="rounded-full border px-2.5 py-1 text-xs"
                  style={{
                    borderColor: HOTEL_COLORS.brass,
                    background: helpful === value ? HOTEL_COLORS.brass : 'transparent',
                    color: helpful === value ? HOTEL_COLORS.panel : HOTEL_COLORS.parchment,
                  }}
                >
                  {label}
                </button>
              ),
            )}
          </div>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes…"
            rows={2}
            className="rounded-lg border bg-transparent p-2 text-sm"
            style={{ borderColor: HOTEL_COLORS.brassDim, color: HOTEL_COLORS.parchment }}
          />
          <button
            type="button"
            onClick={saveNotes}
            disabled={!notesDirty || savingNotes}
            className="self-start rounded-full border px-3 py-1 text-xs"
            style={{
              borderColor: HOTEL_COLORS.brass,
              color: HOTEL_COLORS.parchment,
              opacity: !notesDirty || savingNotes ? 0.5 : 1,
            }}
          >
            {savingNotes ? 'Saving…' : notesDirty || !savedNotes ? 'Save note' : 'Saved ✓'}
          </button>

          <PhotoUpload
            stayId={stay.id}
            paths={photoPaths}
            onChange={(paths) => {
              setPhotoPaths(paths);
              handleUpdate({ photoPaths: paths });
            }}
          />

          {saveError && (
            <p className="text-xs" style={{ color: '#a54848' }}>
              That last change didn't save. Check your connection and try again.
            </p>
          )}

          {showCrisis && <CrisisNotice />}
        </div>
      )}
    </div>
  );
}
