import MoodScreen from '../screens/MoodScreen';
import QuestionsScreen from '../screens/QuestionsScreen';
import LoadingScreen from '../screens/LoadingScreen';
import ResultsScreen from '../screens/ResultsScreen';
import HotelCheckIn from './screens/CheckIn';
import HotelConcierge from './screens/Concierge';
import HotelElevator from './screens/Elevator';
import HotelFloor from './screens/Floor';
import HotelPastStays from './screens/PastStays';
import { deriveFloor } from './floor';
import type { Mood, Recommendation, UserContext } from '../types';

type Step = 'mood' | 'questions' | 'loading' | 'results' | 'stays';

interface StepScreenProps {
  hotelUI: boolean;
  step: Step;
  context: Partial<UserContext>;
  recommendations: Recommendation[];
  arriving: boolean;
  onMoodSelect: (mood: Mood) => void;
  onQuestionsComplete: (answers: Omit<UserContext, 'mood'>) => void;
  onRestart: () => void;
  onBackToMood: () => void;
  onBackToQuestions: () => void;
  onElevatorArrived: () => void;
  onViewStays: () => void;
}

export default function StepScreen({
  hotelUI,
  step,
  context,
  recommendations,
  arriving,
  onMoodSelect,
  onQuestionsComplete,
  onRestart,
  onBackToMood,
  onBackToQuestions,
  onElevatorArrived,
  onViewStays,
}: StepScreenProps) {
  if (step === 'mood') {
    return hotelUI ? (
      <HotelCheckIn onSelect={onMoodSelect} onViewStays={onViewStays} />
    ) : (
      <MoodScreen onSelect={onMoodSelect} />
    );
  }
  if (step === 'stays') {
    return hotelUI ? <HotelPastStays onBack={onRestart} /> : null;
  }
  if (step === 'questions') {
    return hotelUI ? (
      <HotelConcierge onComplete={onQuestionsComplete} onBack={onBackToMood} />
    ) : (
      <QuestionsScreen onComplete={onQuestionsComplete} />
    );
  }
  if (step === 'loading') {
    const targetFloor =
      context.mood && context.environment ? deriveFloor(context.mood, context.environment) : 2;
    return hotelUI ? (
      <HotelElevator
        arriving={arriving}
        targetFloor={targetFloor}
        onArrived={onElevatorArrived}
      />
    ) : (
      <LoadingScreen />
    );
  }
  if (hotelUI && context.mood && context.environment && context.minutesAvailable) {
    return (
      <HotelFloor
        recommendations={recommendations}
        mood={context.mood}
        environment={context.environment}
        minutesAvailable={context.minutesAvailable}
        onRestart={onRestart}
        onAdjustAnswers={onBackToQuestions}
      />
    );
  }
  return <ResultsScreen recommendations={recommendations} onRestart={onRestart} />;
}
