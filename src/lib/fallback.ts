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
  calm: [
    {
      title: 'Notice five things',
      whyThisFits: 'A slow, easy scan of your surroundings keeps a calm mood settled.',
      firstStep: 'Look around and silently name five things you can see.',
      durationMinutes: 5,
    },
    {
      title: 'Stretch it out',
      whyThisFits: 'Gentle movement matches your current pace without disrupting it.',
      firstStep: 'Reach your arms overhead and hold a slow stretch for a few breaths.',
      durationMinutes: 5,
    },
    {
      title: 'Tidy one small spot',
      whyThisFits: 'A calm state is a good time for a small, satisfying reset.',
      firstStep: 'Pick one surface nearby and clear it off.',
      durationMinutes: 10,
    },
  ],
  tired: [
    {
      title: 'Close your eyes for a bit',
      whyThisFits: 'Sometimes the most useful thing is simply resting your eyes.',
      firstStep: 'Sit or lie back and close your eyes for a few minutes, no phone.',
      durationMinutes: 5,
    },
    {
      title: 'Have a glass of water',
      whyThisFits: 'A quick, low-effort reset that costs almost no energy.',
      firstStep: 'Get a glass of water and drink it slowly.',
      durationMinutes: 5,
    },
    {
      title: 'Lie down for a short rest',
      whyThisFits: 'Low energy deserves a real pause, not another task.',
      firstStep: 'Find a comfortable spot to lie down for a bit.',
      durationMinutes: 15,
    },
  ],
  excited: [
    {
      title: 'Move that energy',
      whyThisFits: 'Excitement wants somewhere to go, so give it a physical outlet.',
      firstStep: 'Put on a song and move however feels good for a few minutes.',
      durationMinutes: 5,
    },
    {
      title: 'Tell someone',
      whyThisFits: 'Sharing good energy with another person makes it land better.',
      firstStep: 'Call or message someone and tell them what has you excited.',
      durationMinutes: 5,
    },
    {
      title: 'Start the thing',
      whyThisFits: 'Riding this energy into action beats letting it fizzle out.',
      firstStep: 'Open whatever you have been wanting to work on and do the first step.',
      durationMinutes: 10,
    },
  ],
  unsure: [
    {
      title: 'Check in with your body',
      whyThisFits: 'When the feeling is hard to name, your body often knows before you do.',
      firstStep: 'Notice your shoulders, jaw, and stomach. Just notice, nothing to fix.',
      durationMinutes: 5,
    },
    {
      title: 'Name three things nearby',
      whyThisFits: 'A small, easy task to do while the mood sorts itself out.',
      firstStep: 'Look around and name three things you can see, hear, or touch.',
      durationMinutes: 5,
    },
    {
      title: 'Just sit with it',
      whyThisFits: 'Not every feeling needs a label right away, sitting with it is fine too.',
      firstStep: 'Find a quiet spot and just be there for a few minutes, no pressure to feel anything specific.',
      durationMinutes: 10,
    },
  ],
};
