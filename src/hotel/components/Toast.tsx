import { AnimatePresence, motion } from 'motion/react';
import { HOTEL_COLORS, HOTEL_SERIF } from '../theme';

interface ToastProps {
  message: string | null;
  tone?: 'good' | 'bad';
}

export default function Toast({ message, tone = 'good' }: ToastProps) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className={`${HOTEL_SERIF} rounded-full border px-4 py-2 text-sm shadow-sm`}
            style={{
              borderColor: tone === 'bad' ? '#a54848' : HOTEL_COLORS.brass,
              background: HOTEL_COLORS.panel,
              color: tone === 'bad' ? '#a54848' : HOTEL_COLORS.parchment,
            }}
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
