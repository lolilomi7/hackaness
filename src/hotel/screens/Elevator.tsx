import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { HOTEL_COLORS, HOTEL_SERIF } from '../theme';
import ElevatorInterior from '../components/ElevatorInterior';
import { WELCOME_MS, DOOR_ANIM_S, TICK_MS } from '../elevatorTiming';

interface ElevatorProps {
  arriving?: boolean;
}

type Phase = 'welcome' | 'ascend' | 'arrive';

const DOOR = '#241a12';

export default function Elevator({ arriving = false }: ElevatorProps) {
  const [phase, setPhase] = useState<Phase>('welcome');
  const [floor, setFloor] = useState(1);

  useEffect(() => {
    const id = setTimeout(() => setPhase('ascend'), WELCOME_MS);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (phase !== 'ascend') return;
    const id = setInterval(() => setFloor((f) => f + 1), TICK_MS);
    return () => clearInterval(id);
  }, [phase]);

  useEffect(() => {
    if (arriving && phase === 'ascend') setPhase('arrive');
  }, [arriving, phase]);

  const doorsClosed = phase === 'ascend';

  return (
    <div className="relative min-h-svh overflow-hidden">
      <ElevatorInterior />

      <motion.div
        className="absolute inset-y-0 left-0 w-1/2 border-r"
        style={{ background: DOOR, borderColor: HOTEL_COLORS.brass }}
        initial={{ x: 0 }}
        animate={{ x: doorsClosed ? 0 : '-100%' }}
        transition={{ duration: DOOR_ANIM_S, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute inset-y-0 right-0 w-1/2 border-l"
        style={{ background: DOOR, borderColor: HOTEL_COLORS.brass }}
        initial={{ x: 0 }}
        animate={{ x: doorsClosed ? 0 : '100%' }}
        transition={{ duration: DOOR_ANIM_S, ease: 'easeInOut' }}
      />

      {phase === 'ascend' && (
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center gap-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.span
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 0.9, repeat: Infinity }}
            className="text-2xl"
            style={{ color: HOTEL_COLORS.brass }}
          >
            &#9650;
          </motion.span>
          <div
            className="flex h-20 w-20 items-center justify-center rounded border-2"
            style={{ borderColor: HOTEL_COLORS.brass, background: HOTEL_COLORS.panelDeep }}
          >
            <span className={`${HOTEL_SERIF} text-4xl`} style={{ color: HOTEL_COLORS.parchment }}>
              {floor}
            </span>
          </div>
          <p className={`${HOTEL_SERIF} text-sm italic`} style={{ color: HOTEL_COLORS.parchmentDim }}>
            Ascending to your floor…
          </p>
        </motion.div>
      )}
    </div>
  );
}
