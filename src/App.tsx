import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { Mood, Recommendation, UserContext } from './types';
import GradientBackground from './components/GradientBackground';
import MoodScreen from './screens/MoodScreen';
import QuestionsScreen from './screens/QuestionsScreen';
import LoadingScreen from './screens/LoadingScreen';
import ResultsScreen from './screens/ResultsScreen';
import HotelCheckIn from './hotel/screens/CheckIn';
import HotelConcierge from './hotel/screens/Concierge';
import HotelElevator from './hotel/screens/Elevator';
import { ARRIVE_HOLD_MS } from './hotel/elevatorTiming';
import { getRecommendations } from './lib/ai';

// Flip to preview the hotel reskin. Screens not yet ported under src/hotel/
// still fall back to the classic UI for that step.
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
      // Let the elevator doors finish their "arrive" animation before we
      // swap screens, so they visibly open onto the results.
      setArriving(true);
      await new Promise((resolve) => setTimeout(resolve, ARRIVE_HOLD_MS));
    }
    setStep('results');
  };

  const handleRestart = () => {
    setContext({});
    setRecommendations([]);
    setStep('mood');
  };

  return (
    <div className="relative min-h-svh">
      <GradientBackground mood={context.mood} environment={context.environment} />
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          variants={fadeVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3 }}
        >
          {step === 'mood' &&
            (HOTEL_UI ? (
              <HotelCheckIn onSelect={handleMoodSelect} />
            ) : (
              <MoodScreen onSelect={handleMoodSelect} />
            ))}
          {step === 'questions' &&
            (HOTEL_UI ? (
              <HotelConcierge onComplete={handleQuestionsComplete} />
            ) : (
              <QuestionsScreen onComplete={handleQuestionsComplete} />
            ))}
          {step === 'loading' &&
            (HOTEL_UI ? <HotelElevator arriving={arriving} /> : <LoadingScreen />)}
          {step === 'results' && (
            <ResultsScreen recommendations={recommendations} onRestart={handleRestart} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
