import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { HOTEL_COLORS, HOTEL_SERIF } from '../theme';
import ElevatorInterior from '../components/ElevatorInterior';
import FloorDigit from '../components/FloorDigit';
import { WELCOME_MS, DOOR_ANIM_S, TICK_MS, FAST_TICK_MS } from '../elevatorTiming';

interface ElevatorProps {
  arriving?: boolean;
  targetFloor: number;
  onArrived?: () => void;
}

type Phase = 'welcome' | 'ascend' | 'arrive';

const DOOR = '#9b6fd1';

export default function Elevator({ arriving = false, targetFloor, onArrived }: ElevatorProps) {
  const [phase, setPhase] = useState<Phase>('welcome');
  const [floor, setFloor] = useState(1);

  useEffect(() => {
    const id = setTimeout(() => setPhase('ascend'), WELCOME_MS);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (phase !== 'ascend') return;
    // Once the real answer is ready, tick faster to catch up to the real
    // floor instead of jumping there — never skips numbers, just sprints.
    const id = setInterval(
      () => setFloor((f) => Math.min(f + 1, targetFloor)),
      arriving ? FAST_TICK_MS : TICK_MS,
    );
    return () => clearInterval(id);
  }, [phase, arriving, targetFloor]);

  useEffect(() => {
    if (arriving && phase === 'ascend' && floor >= targetFloor) setPhase('arrive');
  }, [arriving, phase, floor, targetFloor]);

  useEffect(() => {
    if (phase !== 'arrive') return;
    const id = setTimeout(() => onArrived?.(), DOOR_ANIM_S * 1000 + 100);
    return () => clearTimeout(id);
  }, [phase, onArrived]);

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

      {(phase === 'ascend' || phase === 'arrive') && (
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
          <FloorDigit floor={floor} />
          <p className={`${HOTEL_SERIF} text-sm italic`} style={{ color: HOTEL_COLORS.parchmentDim }}>
            {phase === 'ascend' ? 'Ascending to your floor…' : 'Here we are'}
          </p>
        </motion.div>
      )}
    </div>
  );
}
