import type { Recommendation } from '../types';
import Card from '../components/Card';

interface ResultsScreenProps {
  recommendations: Recommendation[];
  onRestart: () => void;
}

export default function ResultsScreen({ recommendations, onRestart }: ResultsScreenProps) {
  return (
    <div className="flex min-h-svh flex-col items-center gap-6 p-6">
      <h1 className="text-2xl font-semibold text-white">Here's what could help</h1>
      <div className="flex w-full max-w-md flex-col gap-4">
        {recommendations.map((rec) => (
          <Card key={rec.title}>
            <h2 className="text-lg font-medium">{rec.title}</h2>
            <p className="mt-1 text-sm text-white/80">{rec.whyThisFits}</p>
            <p className="mt-2 text-sm">
              <span className="font-medium">First step: </span>
              {rec.firstStep}
            </p>
            <p className="mt-1 text-xs text-white/60">{rec.durationMinutes} min</p>
          </Card>
        ))}
      </div>
      <button
        type="button"
        onClick={onRestart}
        className="rounded-full bg-white px-6 py-2 text-sm font-medium text-black"
      >
        Start over
      </button>
    </div>
  );
}
