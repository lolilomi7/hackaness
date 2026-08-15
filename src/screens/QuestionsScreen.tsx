import { useState } from 'react';
import type { ReactNode } from 'react';
import type { Energy, Environment, UserContext } from '../types';
import Chip from '../components/Chip';

type Answers = Omit<UserContext, 'mood'>;

interface QuestionsScreenProps {
  onComplete: (answers: Answers) => void;
}

const ENERGIES: Energy[] = ['low', 'medium', 'high'];
const MINUTES: Array<5 | 30 | 60> = [5, 30, 60];
const ENVIRONMENTS: Environment[] = [
  'urban',
  'suburban',
  'countryside',
  'coastal',
  'mountains',
];

export default function QuestionsScreen({ onComplete }: QuestionsScreenProps) {
  const [energy, setEnergy] = useState<Energy>('medium');
  const [minutesAvailable, setMinutesAvailable] = useState<5 | 30 | 60>(5);
  const [environment, setEnvironment] = useState<Environment>('urban');
  const [canGoOutside, setCanGoOutside] = useState(true);

  const submit = () => {
    onComplete({ energy, minutesAvailable, environment, canGoOutside });
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 text-white">
      <Question label="Energy level">
        {ENERGIES.map((e) => (
          <Chip key={e} label={e} selected={energy === e} onSelect={() => setEnergy(e)} />
        ))}
      </Question>

      <Question label="Minutes available">
        {MINUTES.map((m) => (
          <Chip
            key={m}
            label={String(m)}
            selected={minutesAvailable === m}
            onSelect={() => setMinutesAvailable(m)}
          />
        ))}
      </Question>

      <Question label="Environment">
        {ENVIRONMENTS.map((e) => (
          <Chip
            key={e}
            label={e}
            selected={environment === e}
            onSelect={() => setEnvironment(e)}
          />
        ))}
      </Question>

      <Question label="Can you go outside?">
        <Chip label="yes" selected={canGoOutside} onSelect={() => setCanGoOutside(true)} />
        <Chip label="no" selected={!canGoOutside} onSelect={() => setCanGoOutside(false)} />
      </Question>

      <button
        type="button"
        onClick={submit}
        className="rounded-full bg-white px-6 py-2 text-sm font-medium text-black"
      >
        Continue
      </button>
    </div>
  );
}

function Question({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-sm text-white/80">{label}</p>
      <div className="flex flex-wrap justify-center gap-2">{children}</div>
    </div>
  );
}
