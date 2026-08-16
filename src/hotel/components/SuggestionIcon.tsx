import type { Recommendation } from '../../types';
import { NATURE_ICONS, type NatureCategory } from '../natureIcons';

interface SuggestionIconProps {
  recommendation: Recommendation;
}

// Rough keyword match against free-form AI text — good enough to pick a
// fitting nature scene without needing a fixed category from the model.
const KEYWORDS: [NatureCategory, string[]][] = [
  ['tree', ['walk', 'stroll', 'park', 'garden', 'tree']],
  ['sea', ['water', 'drink', 'tea', 'coffee', 'wave', 'ocean', 'rain', 'shower']],
  ['stones', ['breathe', 'breath', 'meditat', 'calm', 'still', 'ground']],
  ['mountain', ['stretch', 'move', 'dance', 'jump', 'exercise', 'climb']],
  ['sun', ['sun', 'morning', 'window', 'fresh air', 'outside']],
  ['moon', ['sleep', 'nap', 'night', 'cozy', 'rest', 'lie down']],
];

function detectCategory(rec: Recommendation): NatureCategory {
  const text = `${rec.title} ${rec.whyThisFits} ${rec.firstStep}`.toLowerCase();
  for (const [category, words] of KEYWORDS) {
    if (words.some((w) => text.includes(w))) return category;
  }
  return 'leaf';
}

export default function SuggestionIcon({ recommendation }: SuggestionIconProps) {
  const category = detectCategory(recommendation);
  return (
    <svg viewBox="0 0 24 24" className="h-10 w-10">
      {NATURE_ICONS[category]}
    </svg>
  );
}
