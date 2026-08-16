import { motion } from 'motion/react';
import type { Mood } from '../../types';
import { HOTEL_COLORS, HOTEL_SERIF } from '../theme';

interface CheckInProps {
  onSelect: (mood: Mood) => void;
}

const GUESTS: Array<{ mood: Mood; title: string; note: string }> = [
  { mood: 'anxious', title: 'The Restless Guest', note: 'Mind won’t settle' },
  { mood: 'sad', title: 'The Quiet Guest', note: 'Carrying something heavy' },
  { mood: 'angry', title: 'The Storm-Weathered Guest', note: 'Needs to let off steam' },
  { mood: 'happy', title: 'The Bright Guest', note: 'Riding a good moment' },
];

export default function CheckIn({ onSelect }: CheckInProps) {
  return (
    <div
      className="flex min-h-svh flex-col items-center justify-center gap-10 p-6"
      style={{
        background: `radial-gradient(120% 100% at 50% 0%, ${HOTEL_COLORS.panel}, ${HOTEL_COLORS.panelDeep})`,
      }}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <p
          className={`${HOTEL_SERIF} text-xs uppercase tracking-[0.3em]`}
          style={{ color: HOTEL_COLORS.brass }}
        >
          Front Desk
        </p>
        <h1
          className={`${HOTEL_SERIF} text-3xl`}
          style={{ color: HOTEL_COLORS.parchment }}
        >
          Welcome.
        </h1>
        <p style={{ color: HOTEL_COLORS.parchmentDim }}>How are you arriving today?</p>
      </div>

      <div className="flex w-full max-w-sm flex-col">
        {GUESTS.map((guest, i) => (
          <motion.button
            key={guest.mood}
            type="button"
            onClick={() => onSelect(guest.mood)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            whileTap={{ scale: 0.98 }}
            className="flex flex-col items-start gap-0.5 border-b py-4 text-left"
            style={{ borderColor: HOTEL_COLORS.brassDim }}
          >
            <span className={`${HOTEL_SERIF} text-lg`} style={{ color: HOTEL_COLORS.parchment }}>
              {guest.title}
            </span>
            <span className="text-sm" style={{ color: HOTEL_COLORS.parchmentDim }}>
              {guest.note}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
