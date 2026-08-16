import type { ReactElement } from 'react';
import { HOTEL_COLORS } from './theme';

export type NatureCategory = 'tree' | 'sea' | 'stones' | 'mountain' | 'sun' | 'moon' | 'leaf';

const b = {
  stroke: HOTEL_COLORS.brass,
  fill: 'none',
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

// Layered strokes at varied weight/opacity give each drawing some depth
// instead of a single flat outline — still simple enough to read small.
export const NATURE_ICONS: Record<NatureCategory, ReactElement> = {
  tree: (
    <>
      <path d="M12 22v-6" strokeWidth={1.6} {...b} />
      <path d="M12 15c-3-.5-5-2-5-4" strokeWidth={1} opacity={0.5} {...b} />
      <path d="M9 8a4 4 0 0 1 8 0 3.2 3.2 0 0 1-.6 6.4H9.6A3.2 3.2 0 0 1 9 8z" strokeWidth={1.4} {...b} />
      <path d="M7.5 9.5a3 3 0 0 1 2-4.5M16.5 9.5a3 3 0 0 0-2-4.5" strokeWidth={1} opacity={0.5} {...b} />
    </>
  ),
  sea: (
    <>
      <path d="M2 8c2-2 4-2 6 0s4 2 6 0 4-2 6 0" strokeWidth={1} opacity={0.4} {...b} />
      <path d="M2 13c2-2 4-2 6 0s4 2 6 0 4-2 6 0" strokeWidth={1.3} opacity={0.7} {...b} />
      <path d="M2 18c2-2 4-2 6 0s4 2 6 0 4-2 6 0" strokeWidth={1.6} {...b} />
      <path d="M5 4c1-1 2-1 3 0M15 5c1-1 2-1 3 0" strokeWidth={1} opacity={0.6} {...b} />
    </>
  ),
  stones: (
    <>
      <ellipse cx="12" cy="21" rx="7" ry="1.4" fill={HOTEL_COLORS.parchmentDim} opacity={0.2} />
      <ellipse cx="12" cy="19" rx="7" ry="2.3" strokeWidth={1.4} {...b} />
      <path d="M8 18.5c1 .5 2 .5 3 0" strokeWidth={0.9} opacity={0.5} {...b} />
      <ellipse cx="12" cy="14" rx="5" ry="2" strokeWidth={1.4} {...b} />
      <ellipse cx="12" cy="9.5" rx="3.2" ry="1.7" strokeWidth={1.4} {...b} />
    </>
  ),
  mountain: (
    <>
      <path d="M1 20l4.5-8 3 4 1.5-2 3.5 6z" strokeWidth={1.1} opacity={0.45} {...b} />
      <path d="M6 20l6-11 4 6 4-3 3 8z" strokeWidth={1.5} {...b} />
      <path d="M12 9l1.3 1.3-1.3 1-1.3-1z" strokeWidth={1} {...b} />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="6.5" strokeWidth={1} opacity={0.3} {...b} />
      <circle cx="12" cy="12" r="4" strokeWidth={1.5} {...b} />
      <path
        d="M12 1.5v2.5M12 20v2.5M22.5 12H20M4 12H1.5M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8M19.1 19.1l-1.8-1.8M6.7 6.7 4.9 4.9"
        strokeWidth={1.4}
        {...b}
      />
    </>
  ),
  moon: (
    <>
      <path d="M15 3a9 9 0 1 0 6 15 7 7 0 0 1-6-15z" strokeWidth={1.5} {...b} />
      <circle cx="10" cy="9" r="0.9" strokeWidth={0.8} opacity={0.4} {...b} />
      <path d="M3 4l.6 1.4L5 6l-1.4.6L3 8l-.6-1.4L1 6l1.4-.6z" strokeWidth={1} {...b} />
      <path d="M19 20l.4 1 1 .4-1 .4-.4 1-.4-1-1-.4 1-.4z" strokeWidth={0.9} opacity={0.7} {...b} />
    </>
  ),
  leaf: (
    <>
      <path d="M5 19c8 0 14-6 14-14-8 0-14 6-14 14z" strokeWidth={1.5} {...b} />
      <path d="M5 19c2-4 5-7 9-9" strokeWidth={1.1} opacity={0.7} {...b} />
      <path d="M8.5 14.5c1-.3 1.8-.7 2.5-1.2M11 11.5c1-.3 1.8-.7 2.5-1.2" strokeWidth={0.8} opacity={0.5} {...b} />
    </>
  ),
};
