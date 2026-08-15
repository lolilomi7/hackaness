import type { Mood, Recommendation } from '../types';

export const FALLBACK: Record<Mood, Recommendation[]> = {
  anxious: [
    {
      title: 'Box breathing',
      whyThisFits: 'Slows your breath and gives your mind one simple thing to track.',
      firstStep: 'Breathe in for 4 counts, hold for 4, out for 4, hold for 4.',
      durationMinutes: 5,
    },
    {
      title: 'Write down the worry',
      whyThisFits: 'Getting it out of your head and onto paper makes it smaller.',
      firstStep: 'Grab any paper and write the first sentence of what is bothering you.',
      durationMinutes: 10,
    },
    {
      title: 'Cold water on your wrists',
      whyThisFits: 'A quick physical reset that interrupts a spiraling thought loop.',
      firstStep: 'Walk to a sink and run cold water over your wrists for 30 seconds.',
      durationMinutes: 5,
    },
  ],
  sad: [
    {
      title: 'Text one person',
      whyThisFits: 'Connection, even small, softens the edges of a heavy day.',
      firstStep: 'Open your messages and send "thinking of you" to someone.',
      durationMinutes: 5,
    },
    {
      title: 'Put on one favorite song',
      whyThisFits: 'Music you love can shift your state without asking much of you.',
      firstStep: 'Play a song that has made you feel good before.',
      durationMinutes: 5,
    },
    {
      title: 'Step outside for light',
      whyThisFits: 'Natural light and a change of scenery can lift low mood.',
      firstStep: 'Open a door or window and stand there for a minute.',
      durationMinutes: 10,
    },
  ],
  angry: [
    {
      title: 'Shake it out',
      whyThisFits: 'Physical release helps discharge the energy anger brings.',
      firstStep: 'Stand up and shake your hands and arms for 30 seconds.',
      durationMinutes: 5,
    },
    {
      title: 'Write an unsent letter',
      whyThisFits: 'Say everything you want without consequence, then let it sit.',
      firstStep: 'Start with "I am angry because..." and keep writing.',
      durationMinutes: 10,
    },
    {
      title: 'Fast walk',
      whyThisFits: 'A brisk pace burns off adrenaline and clears your head.',
      firstStep: 'Head out the door and walk as fast as feels good.',
      durationMinutes: 15,
    },
  ],
  happy: [
    {
      title: 'Share the moment',
      whyThisFits: 'Good feelings grow when you pass them along.',
      firstStep: 'Send a friend a message about what is making you happy.',
      durationMinutes: 5,
    },
    {
      title: 'Capture it',
      whyThisFits: 'A quick note or photo lets you revisit this later.',
      firstStep: 'Take a photo or jot one line about right now.',
      durationMinutes: 5,
    },
    {
      title: 'Do a small kind thing',
      whyThisFits: 'Riding the high into a kind act extends the glow.',
      firstStep: 'Think of one small favor you could do for someone nearby.',
      durationMinutes: 10,
    },
  ],
};
