import { motion } from 'motion/react';
import type { Recommendation } from '../../types';
import { HOTEL_COLORS } from '../theme';
import SuggestionIcon from './SuggestionIcon';

interface RoomDoorProps {
  roomNumber: number;
  recommendation: Recommendation;
  chosen?: boolean;
  onSelect?: () => void;
}

export default function RoomDoor({
  roomNumber,
  recommendation,
  chosen = false,
  onSelect,
}: RoomDoorProps) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      whileTap={{ scale: 0.96 }}
      className="relative flex h-28 w-24 shrink-0 flex-col items-center gap-1 pt-3"
      style={{
        background: 'linear-gradient(180deg, #c9a8f0, #9b6fd1)',
        borderTopLeftRadius: '50% 40px',
        borderTopRightRadius: '50% 40px',
        border: `2px solid ${chosen ? HOTEL_COLORS.parchment : HOTEL_COLORS.brass}`,
        boxShadow: chosen ? `0 0 0 3px ${HOTEL_COLORS.brass}` : undefined,
      }}
    >
      <span
        className="rounded px-2 py-0.5 text-xs"
        style={{ background: HOTEL_COLORS.brass, color: HOTEL_COLORS.parchment }}
      >
        {roomNumber}
      </span>
      <span
        className="flex h-10 w-10 items-center justify-center rounded-full"
        style={{ background: HOTEL_COLORS.panel }}
      >
        <SuggestionIcon recommendation={recommendation} />
      </span>
      <span
        className="absolute right-2 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full"
        style={{ background: HOTEL_COLORS.brass }}
      />
      {chosen && (
        <span
          className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full text-xs"
          style={{ background: HOTEL_COLORS.parchment, color: HOTEL_COLORS.panel }}
        >
          &#10003;
        </span>
      )}
    </motion.button>
  );
}
