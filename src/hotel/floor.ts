import type { Mood, Environment } from '../types';

const MOOD_ORDER: Mood[] = ['anxious', 'sad', 'angry', 'happy'];
const ENV_ORDER: Environment[] = ['urban', 'suburban', 'countryside', 'coastal', 'mountains'];

// Deterministic so the same mood + environment always arrive at the same
// floor — never random, so it can feel "earned" rather than arbitrary.
export function deriveFloor(mood: Mood, environment: Environment): number {
  const moodIndex = MOOD_ORDER.indexOf(mood);
  const envIndex = ENV_ORDER.indexOf(environment);
  return 2 + moodIndex * 6 + envIndex * 2;
}
