import { motion } from 'motion/react';
import type { Mood } from '../../types';
import { HOTEL_COLORS, HOTEL_SERIF } from '../theme';

interface CheckInProps {
  onSelect: (mood: Mood) => void;
  onViewStays: () => void;
}

const GUESTS: Array<{ mood: Mood; title: string; note: string }> = [
  { mood: 'anxious', title: 'The Restless Guest', note: 'Mind won’t settle' },
  { mood: 'sad', title: 'The Quiet Guest', note: 'Carrying something heavy' },
  { mood: 'angry', title: 'The Storm-Weathered Guest', note: 'Needs to let off steam' },
  { mood: 'happy', title: 'The Bright Guest', note: 'Riding a good moment' },
  { mood: 'calm', title: 'The Settled Guest', note: 'Easy and unhurried' },
  { mood: 'tired', title: 'The Worn-Out Guest', note: 'Running low' },
  { mood: 'excited', title: 'The Eager Guest', note: 'Buzzing with energy' },
  { mood: 'unsure', title: 'The Undecided Guest', note: "Not sure how you're feeling right now" },
];

export default function CheckIn({ onSelect, onViewStays }: CheckInProps) {
  return (
    <div
      className="flex min-h-svh flex-col items-center justify-center gap-4 p-4"
      style={{
        background: `radial-gradient(120% 100% at 50% 0%, ${HOTEL_COLORS.panel}, ${HOTEL_COLORS.panelDeep})`,
      }}
    >
      <div className="flex w-full max-w-lg flex-col items-center gap-1 text-center">
        <img src="/hackness-wordmark.png" alt="HackNess" className="h-16 w-auto sm:h-20" />
        <p
          className={`${HOTEL_SERIF} text-xs uppercase tracking-[0.3em]`}
          style={{ color: HOTEL_COLORS.parchmentDim }}
        >
          Front Desk
        </p>
        <p className="text-sm" style={{ color: HOTEL_COLORS.parchmentDim }}>
          How are you arriving today?
        </p>
      </div>

      <div className="flex w-full max-w-lg flex-wrap justify-center gap-2">
        {GUESTS.map((guest, i) => (
          <motion.button
            key={guest.mood}
            type="button"
            onClick={() => onSelect(guest.mood)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            whileTap={{ scale: 0.97 }}
            className="flex min-w-[230px] flex-1 basis-[45%] flex-col items-start gap-0.5 rounded-xl border px-4 py-2.5 text-left"
            style={{ borderColor: HOTEL_COLORS.brassDim, background: HOTEL_COLORS.panel }}
          >
            <span className={`${HOTEL_SERIF} text-sm`} style={{ color: HOTEL_COLORS.parchment }}>
              {guest.title}
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className="whitespace-nowrap rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wide"
                style={{ borderColor: HOTEL_COLORS.brass, color: HOTEL_COLORS.brass }}
              >
                {guest.mood}
              </span>
              <span className="text-xs" style={{ color: HOTEL_COLORS.parchmentDim }}>
                {guest.note}
              </span>
            </span>
          </motion.button>
        ))}
      </div>

      <button
        type="button"
        onClick={onViewStays}
        className="text-xs underline underline-offset-2"
        style={{ color: HOTEL_COLORS.parchmentDim }}
      >
        Past stays
      </button>
    </div>
  );
}
