// A plain keyword safety net, not analysis — journal.md is explicit that
// notes are never scored or interpreted, only checked for a small set of
// phrases that warrant surfacing crisis resources instead of staying silent.
const CRISIS_PHRASES = [
  'kill myself',
  'want to die',
  'end my life',
  'suicide',
  'self harm',
  'self-harm',
  'hurt myself',
  "can't go on",
  'no reason to live',
];

export function mentionsCrisis(text: string): boolean {
  const lower = text.toLowerCase();
  return CRISIS_PHRASES.some((phrase) => lower.includes(phrase));
}
