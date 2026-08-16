import { motion } from 'motion/react';
import type { Mood, Environment, Recommendation } from '../../types';
import { HOTEL_COLORS, HOTEL_SERIF } from '../theme';
import { deriveFloor } from '../floor';
import RoomDoor from '../components/RoomDoor';
import RoomDetails from '../components/RoomDetails';
import HallwayBackdrop from '../components/HallwayBackdrop';

interface FloorProps {
  recommendations: Recommendation[];
  mood: Mood;
  environment: Environment;
  onRestart: () => void;
}

export default function Floor({ recommendations, mood, environment, onRestart }: FloorProps) {
  const floorNumber = deriveFloor(mood, environment);

  return (
    <div
      className="flex min-h-svh flex-col items-center gap-8 p-6"
      style={{ background: `linear-gradient(180deg, ${HOTEL_COLORS.panelDeep}, ${HOTEL_COLORS.panel})` }}
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center gap-1 text-center"
      >
        <p
          className={`${HOTEL_SERIF} text-xs uppercase tracking-[0.3em]`}
          style={{ color: HOTEL_COLORS.brass }}
        >
          Floor {floorNumber}
        </p>
        <h1 className={`${HOTEL_SERIF} text-2xl`} style={{ color: HOTEL_COLORS.parchment }}>
          Three rooms await
        </h1>
      </motion.div>

      <div className="relative flex w-full max-w-sm justify-center gap-8 px-4 pb-6 pt-8">
        <HallwayBackdrop />
        {recommendations.map((rec, i) => (
          <motion.div
            key={rec.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.15, duration: 0.4 }}
          >
            <RoomDoor roomNumber={floorNumber * 10 + i + 1} />
          </motion.div>
        ))}
      </div>

      {/* subgrid keeps each field (title/why/first-step/duration) aligned
          on the same row across all 3 columns, regardless of text length */}
      <div
        className="grid w-full max-w-2xl grid-cols-3 gap-x-6 gap-y-1"
        style={{ gridTemplateRows: 'repeat(5, auto)' }}
      >
        {recommendations.map((rec, i) => (
          <motion.div
            key={rec.title}
            className="grid"
            style={{
              gridRow: 'span 5',
              gridTemplateRows: 'subgrid',
              rowGap: 4,
              ...(i > 0
                ? { borderLeft: `1px solid ${HOTEL_COLORS.brassDim}`, paddingLeft: 24 }
                : {}),
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 + i * 0.15, duration: 0.4 }}
          >
            <RoomDetails roomNumber={floorNumber * 10 + i + 1} recommendation={rec} />
          </motion.div>
        ))}
      </div>

      <button
        type="button"
        onClick={onRestart}
        className="rounded-full border px-6 py-2 text-sm"
        style={{ borderColor: HOTEL_COLORS.brass, color: HOTEL_COLORS.parchment }}
      >
        Back to the lobby
      </button>
    </div>
  );
}
