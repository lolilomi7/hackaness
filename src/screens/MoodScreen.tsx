import type { Mood } from '../types';
import Chip from '../components/Chip';

interface MoodScreenProps {
  onSelect: (mood: Mood) => void;
}

const MOODS: Mood[] = ['anxious', 'sad', 'angry', 'happy'];

export default function MoodScreen({ onSelect }: MoodScreenProps) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 text-center">
      <h1 className="text-2xl font-semibold text-white">How are you feeling?</h1>
      <div className="flex flex-wrap justify-center gap-3">
        {MOODS.map((mood) => (
          <Chip
            key={mood}
            label={mood}
            selected={false}
            onSelect={() => onSelect(mood)}
          />
        ))}
      </div>
    </div>
  );
}
