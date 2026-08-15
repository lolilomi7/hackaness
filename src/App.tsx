import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { Mood, Recommendation, UserContext } from './types';
import GradientBackground from './components/GradientBackground';
import MoodScreen from './screens/MoodScreen';
import QuestionsScreen from './screens/QuestionsScreen';
import LoadingScreen from './screens/LoadingScreen';
import ResultsScreen from './screens/ResultsScreen';
import { getRecommendations } from './lib/ai';

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

  const handleMoodSelect = (mood: Mood) => {
    setContext((prev) => ({ ...prev, mood }));
    setStep('questions');
  };

  const handleQuestionsComplete = async (answers: Omit<UserContext, 'mood'>) => {
    const fullContext = { ...context, ...answers } as UserContext;
    setContext(fullContext);
    setStep('loading');
    const results = await getRecommendations(fullContext);
    setRecommendations(results);
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
          {step === 'mood' && <MoodScreen onSelect={handleMoodSelect} />}
          {step === 'questions' && (
            <QuestionsScreen onComplete={handleQuestionsComplete} />
          )}
          {step === 'loading' && <LoadingScreen />}
          {step === 'results' && (
            <ResultsScreen recommendations={recommendations} onRestart={handleRestart} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
