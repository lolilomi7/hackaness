import type { Mood, Environment } from './types';

export interface GradientPair {
  from: string;
  to: string;
}

export const MOOD_PALETTES: Record<Mood, GradientPair> = {
  anxious: { from: '#a5b4fc', to: '#6366f1' },
  sad: { from: '#93c5fd', to: '#3b82f6' },
  angry: { from: '#fca5a5', to: '#ef4444' },
  happy: { from: '#fde68a', to: '#f59e0b' },
  calm: { from: '#a7f3d0', to: '#10b981' },
  tired: { from: '#ddd6fe', to: '#8b5cf6' },
  excited: { from: '#fbcfe8', to: '#ec4899' },
  unsure: { from: '#e2e8f0', to: '#94a3b8' },
};

export const ENV_PALETTES: Record<Environment, GradientPair> = {
  urban: { from: '#c4b5fd', to: '#7c3aed' },
  suburban: { from: '#bef264', to: '#65a30d' },
  countryside: { from: '#bbf7d0', to: '#22c55e' },
  coastal: { from: '#67e8f9', to: '#0891b2' },
  mountains: { from: '#e5e7eb', to: '#6b7280' },
};
