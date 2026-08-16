// Shared timing so App.tsx's screen-swap delay stays in sync with the
// doors' own opening animation duration.
export const WELCOME_MS = 500;
export const DOOR_ANIM_S = 0.6;
export const TICK_MS = 450;
// Once the real answer is ready but the count hasn't caught up to the real
// floor yet, tick a bit faster instead of jumping straight there — fast
// enough to catch up, slow enough to still read as individual floors.
export const FAST_TICK_MS = 180;
