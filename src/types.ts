export type Mood = 'anxious' | 'sad' | 'angry' | 'happy';

export type Energy = 'low' | 'medium' | 'high';

export type Environment =
  | 'urban'
  | 'suburban'
  | 'countryside'
  | 'coastal'
  | 'mountains';

export interface UserContext {
  mood: Mood;
  energy: Energy;
  minutesAvailable: 5 | 30 | 60;
  environment: Environment;
  canGoOutside: boolean;
}

export interface Recommendation {
  title: string;
  whyThisFits: string;
  firstStep: string;
  durationMinutes: number;
}
