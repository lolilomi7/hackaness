import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { Mood, Recommendation, UserContext } from './types';
import GradientBackground from './components/GradientBackground';
import StepScreen from './hotel/StepScreen';
import { HOTEL_COLORS } from './hotel/theme';
import { getRecommendations } from './lib/ai';

// Flip to preview the hotel reskin (falls back to classic per-step).
const HOTEL_UI = true;

type Step = 'mood' | 'questions' | 'loading' | 'results';
const fadeVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
};

export default function App() {
  const [step, setStep] = useState<Step>('mood');
  const [context, setContext] = useState<Partial<UserContext>>({});
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [arriving, setArriving] = useState(false);
  const arrivedResolverRef = useRef<(() => void) | null>(null);

  const handleMoodSelect = (mood: Mood) => {
    setContext((prev) => ({ ...prev, mood }));
    setStep('questions');
  };

  const handleQuestionsComplete = async (answers: Omit<UserContext, 'mood'>) => {
    const fullContext = { ...context, ...answers } as UserContext;
    setContext(fullContext);
    setStep('loading');
    setArriving(false);
    const results = await getRecommendations(fullContext);
    setRecommendations(results);
    if (HOTEL_UI) {
      // Wait for the elevator to actually finish its own arrival, rather
      // than guessing a fixed delay that could cut it short or run long.
      setArriving(true);
      await new Promise<void>((resolve) => {
        arrivedResolverRef.current = resolve;
      });
    }
    setStep('results');
  };

  const handleElevatorArrived = () => {
    arrivedResolverRef.current?.();
    arrivedResolverRef.current = null;
  };

  const handleRestart = () => {
    setContext({});
    setRecommendations([]);
    setStep('mood');
  };

  return (
    <div className="relative min-h-svh">
      {HOTEL_UI ? (
        <div className="fixed inset-0 -z-10" style={{ background: HOTEL_COLORS.panel }} />
      ) : (
        <GradientBackground mood={context.mood} environment={context.environment} />
      )}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          variants={fadeVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3 }}
        >
          <StepScreen
            hotelUI={HOTEL_UI}
            step={step}
            context={context}
            recommendations={recommendations}
            arriving={arriving}
            onMoodSelect={handleMoodSelect}
            onQuestionsComplete={handleQuestionsComplete}
            onRestart={handleRestart}
            onElevatorArrived={handleElevatorArrived}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
