import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HOTEL_COLORS, HOTEL_SERIF } from '../theme';
import { TURNS, type Answers, type Turn } from '../conciergeTurns';
import ConciergeAvatar from '../components/ConciergeAvatar';

interface ConciergeProps {
  onComplete: (answers: Answers) => void;
}

export default function Concierge({ onComplete }: ConciergeProps) {
  const [turnIndex, setTurnIndex] = useState(0);
  const [transcript, setTranscript] = useState<{ prompt: string; reply: string }[]>([]);
  const [answers, setAnswers] = useState<Partial<Answers>>({});
  const turn = TURNS[turnIndex];

  const handleReply = (label: string, value: Turn['options'][number]['value']) => {
    const nextAnswers = { ...answers, [turn.key]: value } as Partial<Answers>;
    setAnswers(nextAnswers);
    setTranscript([...transcript, { prompt: turn.prompt, reply: label }]);

    if (turnIndex + 1 < TURNS.length) {
      setTurnIndex(turnIndex + 1);
    } else {
      onComplete(nextAnswers as Answers);
    }
  };

  return (
    <div
      className="flex min-h-svh flex-col items-center gap-4 p-6"
      style={{ background: `linear-gradient(180deg, ${HOTEL_COLORS.panelDeep}, ${HOTEL_COLORS.panel})` }}
    >
      {transcript.length > 0 && (
        <div className="flex w-full max-w-xs flex-col gap-2 pt-2">
          {transcript.map((t, i) => (
            <div key={i} className="flex items-baseline justify-between gap-3">
              <p className={`${HOTEL_SERIF} text-xs`} style={{ color: HOTEL_COLORS.parchmentDim }}>
                {t.prompt}
              </p>
              <span
                className="shrink-0 rounded-full px-2.5 py-0.5 text-xs"
                style={{ background: HOTEL_COLORS.brassDim, color: HOTEL_COLORS.parchment }}
              >
                {t.reply}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="flex w-full flex-1 flex-col items-center justify-center gap-4">
        {/* Persistent across turns — only nods per question, never fully exits */}
        <ConciergeAvatar bob={turn.key} />

        <div className="flex items-center gap-2">
          {TURNS.map((t, i) => (
            <span
              key={t.key}
              className="h-1.5 rounded-full transition-all"
              style={{
                width: i === turnIndex ? 18 : 6,
                background: i <= turnIndex ? HOTEL_COLORS.brass : HOTEL_COLORS.brassDim,
              }}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={turn.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex w-full flex-col items-center gap-4 text-center"
          >
            <p className={`${HOTEL_SERIF} text-lg`} style={{ color: HOTEL_COLORS.parchment }}>{turn.prompt}</p>
            <div className="flex flex-wrap justify-center gap-2.5">
              {turn.options.map((opt) => (
                <motion.button
                  key={opt.label}
                  type="button"
                  onClick={() => handleReply(opt.label, opt.value)}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-full border px-5 py-2.5 text-sm"
                  style={{ borderColor: HOTEL_COLORS.brass, color: HOTEL_COLORS.parchment }}
                >
                  {opt.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
