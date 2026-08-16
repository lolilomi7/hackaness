---
description: Build the hotel-concierge experimental UI (branch only)
argument-hint: [which screen or fix]
allowed-tools: Read, Edit, Write, Bash
---

Experimental UI reskin. This runs on a branch and may be thrown away.

## Before anything

Confirm we are NOT on `main`. If we are, stop and tell me to branch first.

## The concept

The app becomes a boutique hotel. Same flow, same data, new fiction:

- **Check-in** — replaces mood selection. "Welcome. How are you arriving
  today?" Four guest states: anxious / sad / angry / happy. Presented as
  a check-in desk, not a button grid.
- **The concierge** — replaces the questions screen. Asks the three
  questions one at a time, conversationally, as a person would. Energy,
  time available, where you are. Answers still map to the same enums.
- **The elevator** — replaces the loading screen. THIS IS THE CENTREPIECE.
  Doors close, floor numbers tick upward, the AI call runs during the ride.
  The ride length adapts to the real API latency: keep ascending until the
  promise resolves, then arrive. Never a spinner. Never a dead screen.
- **The floor** — replaces results. Doors open onto a floor themed to the
  guest's mood and environment. The three recommendations are presented as
  rooms or doors on that floor, not as cards in a list.

Floor number should feel earned, not random — derive it from mood and
environment so the same inputs always arrive at the same floor.

## Hard constraints

- **Do not modify `src/types.ts`, `src/lib/`, or the existing screens.**
  This is a presentation layer over the exact same state and the exact
  same `getRecommendations()`. If you find yourself changing logic,
  you have misunderstood the task.
- Build in `src/hotel/` only. New screens, new components, nothing else.
- Add a single flag in `App.tsx` to switch between classic and hotel UI,
  so the working version is always one boolean away.
- Everything must still work with the fallback bank and no network.
- Mobile portrait. Assume it's demoed on a phone held up to a room.
- Animation via `motion`. Elevator doors, floor counter, arrival.

## Taste

Warm, textured, slightly old-world. Think small European hotel, not
airport Hilton. Serif for the hotel's voice, restraint over spectacle.
The fiction should be committed to fully or dropped entirely — a
half-hotel reads as a bug.

## Task

$ARGUMENTS

When done, tell me exactly how to switch back to the classic UI.