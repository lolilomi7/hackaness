import { motion, AnimatePresence } from 'motion/react';
import { HOTEL_COLORS, HOTEL_SERIF } from '../theme';

interface FloorDigitProps {
  floor: number;
}

export default function FloorDigit({ floor }: FloorDigitProps) {
  return (
    <div
      className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded border-2"
      style={{ borderColor: HOTEL_COLORS.brass, background: HOTEL_COLORS.panelDeep }}
    >
      <AnimatePresence mode="popLayout">
        <motion.span
          key={floor}
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -14, opacity: 0 }}
          transition={{ duration: 0.18 }}
          className={`${HOTEL_SERIF} text-4xl`}
          style={{ color: HOTEL_COLORS.parchment }}
        >
          {floor}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
