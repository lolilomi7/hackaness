import { motion } from 'motion/react';
import type { Mood, Environment } from '../types';
import { MOOD_PALETTES, ENV_PALETTES } from '../theme';

interface GradientBackgroundProps {
  mood?: Mood;
  environment?: Environment;
}

export default function GradientBackground({
  mood,
  environment,
}: GradientBackgroundProps) {
  const palette = mood
    ? MOOD_PALETTES[mood]
    : environment
      ? ENV_PALETTES[environment]
      : { from: '#a5b4fc', to: '#6366f1' };

  return (
    <motion.div
      className="fixed inset-0 -z-10"
      animate={{
        background: `linear-gradient(160deg, ${palette.from}, ${palette.to})`,
      }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
    />
  );
}
