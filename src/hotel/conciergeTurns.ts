import type { UserContext } from '../types';

export type Answers = Omit<UserContext, 'mood'>;

export interface Turn {
  key: keyof Answers;
  prompt: string;
  options: { label: string; value: Answers[keyof Answers] }[];
}

export const TURNS: Turn[] = [
  {
    key: 'energy',
    prompt: 'How much energy do you have to work with?',
    options: [
      { label: 'Not much left', value: 'low' },
      { label: 'Some to spare', value: 'medium' },
      { label: 'Plenty', value: 'high' },
    ],
  },
  {
    key: 'minutesAvailable',
    prompt: 'How long can I have you for?',
    options: [
      { label: 'Five minutes', value: 5 },
      { label: 'Half an hour', value: 30 },
      { label: 'A full hour', value: 60 },
    ],
  },
  {
    key: 'environment',
    prompt: 'And where do I find you?',
    options: [
      { label: 'In the city', value: 'urban' },
      { label: 'Out in the suburbs', value: 'suburban' },
      { label: 'Deep in the countryside', value: 'countryside' },
      { label: 'By the coast', value: 'coastal' },
      { label: 'Up in the mountains', value: 'mountains' },
    ],
  },
  {
    key: 'canGoOutside',
    prompt: 'Can you step outside right now?',
    options: [
      { label: 'Yes', value: true },
      { label: 'Not right now', value: false },
    ],
  },
];
