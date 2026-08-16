import { useState } from 'react';
import type { Mood } from '../../types';
import { HOTEL_COLORS, HOTEL_SERIF } from '../theme';
import { updateReflection } from '../../lib/stays';
import { mentionsCrisis } from '../crisisCheck';
import CrisisNotice from './CrisisNotice';
import PhotoUpload from './PhotoUpload';

interface ReflectionCardProps {
  stayId: string;
  roomTitle: string;
  onDismiss: () => void;
}

const MOODS: { value: Mood; label: string }[] = [
  { value: 'anxious', label: '😟 Anxious' },
  { value: 'sad', label: '😔 Sad' },
  { value: 'angry', label: '😤 Angry' },
  { value: 'happy', label: '😊 Happy' },
  { value: 'calm', label: '😌 Calm' },
  { value: 'tired', label: '😴 Tired' },
  { value: 'excited', label: '🤩 Excited' },
  { value: 'unsure', label: '😐 Not sure' },
];
const HELPFUL_OPTIONS: [boolean, string][] = [
  [true, '👍 Helpful'],
  [false, '🤷 Not quite'],
];

export default function ReflectionCard({ stayId, roomTitle, onDismiss }: ReflectionCardProps) {
  const [moodAfter, setMoodAfter] = useState<Mood | null>(null);
  const [helpful, setHelpful] = useState<boolean | null>(null);
  const [notes, setNotes] = useState('');
  const [savedNotes, setSavedNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [showCrisis, setShowCrisis] = useState(false);
  const [photoPaths, setPhotoPaths] = useState<string[]>([]);
  const [saveError, setSaveError] = useState(false);

  const notesDirty = notes.trim() !== savedNotes;

  const handleUpdate = async (payload: Parameters<typeof updateReflection>[1]) => {
    const { ok } = await updateReflection(stayId, payload);
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

  return (
    <div
      className="flex w-full max-w-sm flex-col gap-3 rounded-2xl border p-4"
      style={{ borderColor: HOTEL_COLORS.brassDim, background: HOTEL_COLORS.panel }}
    >
      <div className="flex items-start justify-between gap-2">
        <p className={`${HOTEL_SERIF} text-sm`} style={{ color: HOTEL_COLORS.parchment }}>
          How did{' '}
          <span style={{ color: HOTEL_COLORS.brass }}>"{roomTitle}"</span> treat you?
        </p>
        <button
          type="button"
          onClick={onDismiss}
          className="text-lg leading-none"
          style={{ color: HOTEL_COLORS.parchmentDim }}
        >
          &times;
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {MOODS.map((mood) => (
          <button
            key={mood.value}
            type="button"
            onClick={() => pickMood(mood.value)}
            className="rounded-full border px-3 py-1 text-xs"
            style={{
              borderColor: HOTEL_COLORS.brass,
              background: moodAfter === mood.value ? HOTEL_COLORS.brass : 'transparent',
              color: moodAfter === mood.value ? HOTEL_COLORS.panel : HOTEL_COLORS.parchment,
            }}
          >
            {mood.label}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        {HELPFUL_OPTIONS.map(([value, label]) => (
          <button
            key={label}
            type="button"
            onClick={() => pickHelpful(value)}
            className="rounded-full border px-3 py-1 text-xs"
            style={{
              borderColor: HOTEL_COLORS.brass,
              background: helpful === value ? HOTEL_COLORS.brass : 'transparent',
              color: helpful === value ? HOTEL_COLORS.panel : HOTEL_COLORS.parchment,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Any little notes? (optional)"
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
        stayId={stayId}
        paths={photoPaths}
        onChange={(paths) => {
          setPhotoPaths(paths);
          handleUpdate({ photoPaths: paths });
        }}
      />

      {saveError && (
        <p className="text-xs" style={{ color: '#a54848' }}>
          That last change didn't save. Check your connection, it'll retry next edit.
        </p>
      )}

      {showCrisis && <CrisisNotice />}
    </div>
  );
}
