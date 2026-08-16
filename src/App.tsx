import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { Mood, Recommendation, UserContext } from './types';
import GradientBackground from './components/GradientBackground';
import StepScreen from './hotel/StepScreen';
import Toast from './hotel/components/Toast';
import { HOTEL_COLORS } from './hotel/theme';
import { getRecommendations } from './lib/ai';
import { onRealSignIn } from './lib/auth';
import { flushPendingStays } from './lib/pendingStays';

// Flip to preview the hotel reskin (falls back to classic per-step).
const HOTEL_UI = true;

type Step = 'mood' | 'questions' | 'loading' | 'results' | 'stays';
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
  const [toast, setToast] = useState<{ message: string; tone: 'good' | 'bad' } | null>(null);
  const arrivedResolverRef = useRef<(() => void) | null>(null);

  // A magic-link sign-in often lands here after a fresh page load (new tab,
  // or the Floor screen that queued the save is long gone) — this is what
  // finishes those saves and lets the guest know it worked.
  useEffect(() => {
    const unsubscribe = onRealSignIn(() => {
      flushPendingStays().then((outcomes) => {
        if (outcomes.length === 0) return;
        const saved = outcomes.filter((o) => o.result.status === 'saved').length;
        if (saved === outcomes.length) {
          setToast({
            message: saved === 1 ? 'Saved to your journal.' : `Saved ${saved} entries to your journal.`,
            tone: 'good',
          });
        } else if (saved > 0) {
          setToast({ message: `Saved ${saved} of ${outcomes.length}. The rest will retry later.`, tone: 'bad' });
        } else {
          setToast({ message: "Couldn't save to your journal. It'll retry later.", tone: 'bad' });
        }
      });
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

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

  const handleBackToMood = () => setStep('mood');

  // Keeps the chosen mood, but drops the recommendations tied to the old
  // answers so a fresh Concierge run always produces a fresh set.
  const handleBackToQuestions = () => {
    setRecommendations([]);
    setStep('questions');
  };

  const handleViewStays = () => setStep('stays');

  return (
    <div className="relative min-h-svh">
      <Toast message={toast?.message ?? null} tone={toast?.tone} />
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
            onBackToMood={handleBackToMood}
            onBackToQuestions={handleBackToQuestions}
            onElevatorArrived={handleElevatorArrived}
            onViewStays={handleViewStays}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
