import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import type { Mood, Environment, Recommendation } from '../../types';
import { HOTEL_COLORS, HOTEL_SERIF } from '../theme';
import { deriveFloor } from '../floor';
import { saveStay } from '../../lib/stays';
import { queuePendingStay } from '../../lib/pendingStays';
import { onRealSignIn } from '../../lib/auth';
import RoomDoor from '../components/RoomDoor';
import RoomDetails from '../components/RoomDetails';
import HallwayBackdrop from '../components/HallwayBackdrop';
import ReflectionCard from '../components/ReflectionCard';
import SignInPrompt from '../components/SignInPrompt';

interface FloorProps {
  recommendations: Recommendation[];
  mood: Mood;
  environment: Environment;
  minutesAvailable: number;
  onRestart: () => void;
  onAdjustAnswers: () => void;
}

type ChoiceStatus = 'saving' | 'needs-auth' | 'sent-link' | 'saved' | 'error' | 'dismissed';

interface Choice {
  status: ChoiceStatus;
  stayId?: string;
}

export default function Floor({
  recommendations,
  mood,
  environment,
  minutesAvailable,
  onRestart,
  onAdjustAnswers,
}: FloorProps) {
  const floorNumber = deriveFloor(mood, environment);
  const [choices, setChoices] = useState<Record<number, Choice>>({});
  const choicesRef = useRef(choices);
  choicesRef.current = choices;

  const attemptSave = async (index: number) => {
    const result = await saveStay({
      moodBefore: mood,
      environment,
      minutesAvailable,
      recommendation: recommendations[index],
    });
    if (result.status === 'saved') {
      setChoices((prev) => ({ ...prev, [index]: { status: 'saved', stayId: result.id } }));
    } else if (result.status === 'needs-auth') {
      queuePendingStay({
        moodBefore: mood,
        environment,
        minutesAvailable,
        recommendation: recommendations[index],
      });
      setChoices((prev) => ({ ...prev, [index]: { status: 'needs-auth' } }));
    } else {
      setChoices((prev) => ({ ...prev, [index]: { status: 'error' } }));
    }
  };

  const handleChoose = (index: number) => {
    if (choices[index]) return;
    setChoices((prev) => ({ ...prev, [index]: { status: 'saving' } }));
    attemptSave(index);
  };

  const retryChoice = (index: number) => {
    setChoices((prev) => ({ ...prev, [index]: { status: 'saving' } }));
    attemptSave(index);
  };

  // One sign-in covers every room waiting on it — show a single prompt,
  // not one per door. Stays visible through "link sent" so the confirmation
  // doesn't vanish the moment the email goes out.
  const needsAuthIndices = Object.entries(choices)
    .filter(([, c]) => c.status === 'needs-auth')
    .map(([i]) => Number(i));
  const authVisibleIndices = Object.entries(choices)
    .filter(([, c]) => c.status === 'needs-auth' || c.status === 'sent-link')
    .map(([i]) => Number(i));

  // A magic-link sign-in can complete while this screen is still open (same
  // tab, link opened here) — once it does, anything waiting on auth retries.
  useEffect(() => {
    const unsubscribe = onRealSignIn(() => {
      const pendingIndices = Object.entries(choicesRef.current)
        .filter(([, c]) => c.status === 'needs-auth' || c.status === 'sent-link')
        .map(([i]) => Number(i));
      if (pendingIndices.length === 0) return;
      setChoices((prev) => {
        const next = { ...prev };
        pendingIndices.forEach((i) => {
          next[i] = { status: 'saving' };
        });
        return next;
      });
      pendingIndices.forEach((i) => attemptSave(i));
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        <p className="text-sm" style={{ color: HOTEL_COLORS.parchmentDim }}>
          Tap a door to choose it. Pick as many as you like.
        </p>
      </motion.div>

      <div className="relative flex w-full max-w-sm justify-center gap-8 px-4 pb-6 pt-6">
        <HallwayBackdrop />
        {recommendations.map((rec, i) => (
          <motion.div
            key={rec.title}
            className="flex flex-col items-center gap-2"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.15, duration: 0.4 }}
          >
            <RoomDoor
              roomNumber={floorNumber * 10 + i + 1}
              recommendation={rec}
              chosen={!!choices[i]}
              onSelect={() => handleChoose(i)}
            />
          </motion.div>
        ))}
      </div>

      <div
        className="grid w-full max-w-2xl grid-cols-3 gap-x-6 gap-y-1"
        style={{ gridTemplateRows: 'repeat(4, auto)' }}
      >
        {recommendations.map((rec, i) => (
          <motion.div
            key={rec.title}
            className="grid"
            style={{
              gridRow: 'span 4',
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

      {authVisibleIndices.length > 0 && (
        <SignInPrompt
          roomCount={authVisibleIndices.length}
          onSent={() =>
            setChoices((prev) => {
              const next = { ...prev };
              needsAuthIndices.forEach((i) => {
                next[i] = { status: 'sent-link' };
              });
              return next;
            })
          }
        />
      )}

      <div className="flex w-full max-w-sm flex-col gap-3">
        {Object.entries(choices).map(([indexStr, choice]) => {
          const index = Number(indexStr);
          if (choice.status === 'dismissed') return null;
          if (choice.status === 'needs-auth' || choice.status === 'sent-link') return null;
          if (choice.status === 'saving') {
            return (
              <p
                key={index}
                className="text-center text-xs"
                style={{ color: HOTEL_COLORS.parchmentDim }}
              >
                Saving {recommendations[index].title}…
              </p>
            );
          }
          if (choice.status === 'error') {
            return (
              <div
                key={index}
                className="flex w-full max-w-sm items-center justify-between gap-3 rounded-2xl border p-3 text-xs"
                style={{ borderColor: HOTEL_COLORS.brassDim, background: HOTEL_COLORS.panel }}
              >
                <span style={{ color: HOTEL_COLORS.parchmentDim }}>
                  Couldn't save "{recommendations[index].title}". Check your connection.
                </span>
                <button
                  type="button"
                  onClick={() => retryChoice(index)}
                  className="shrink-0 rounded-full border px-3 py-1"
                  style={{ borderColor: HOTEL_COLORS.brass, color: HOTEL_COLORS.parchment }}
                >
                  Retry
                </button>
              </div>
            );
          }
          if (choice.status === 'saved' && choice.stayId) {
            return (
              <ReflectionCard
                key={index}
                stayId={choice.stayId}
                roomTitle={recommendations[index].title}
                onDismiss={() =>
                  setChoices((prev) => ({ ...prev, [index]: { ...prev[index], status: 'dismissed' } }))
                }
              />
            );
          }
          return null;
        })}
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onAdjustAnswers}
          className="rounded-full border px-6 py-2 text-sm"
          style={{ borderColor: HOTEL_COLORS.brass, color: HOTEL_COLORS.parchment }}
        >
          Adjust your answers
        </button>
        <button
          type="button"
          onClick={onRestart}
          className="rounded-full border px-6 py-2 text-sm"
          style={{ borderColor: HOTEL_COLORS.brass, color: HOTEL_COLORS.parchment }}
        >
          Back to the lobby
        </button>
      </div>
    </div>
  );
}
