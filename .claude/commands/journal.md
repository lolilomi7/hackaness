---
description: Build the Past Stays journal (branch only)
argument-hint: [which piece to build]
allowed-tools: Read, Edit, Write, Bash
---

Confirm we are NOT on `main`. If we are, stop and tell me to branch first.

## The feature

Guests can revisit what they tried and record how it went. In hotel terms:
a guest book of past stays.

Two entry points, built in this order:

1. **Selection** — on the floor/results screen, tapping a recommendation
   marks it as chosen and saves it. One tap, no dialog, no confirmation.
   The card should visibly acknowledge the choice.
2. **Reflection** — after selection, offer "How was your stay?" Optional,
   dismissible, never blocking. Captures: a mood-after selection (same four
   moods), a helpful/not-helpful toggle, and free-text notes. All three
   optional — a user who only taps a mood has still given us something.
3. **Past stays** — a quiet link on the check-in screen. Reverse-chronological
   list of previous stays: what they tried, when, how they felt before and
   after. Tapping an entry opens it and allows editing the notes.

## Data

Create a `stays` table in Supabase:

  id, created_at, user_id, mood_before, environment, minutes_available,
  recommendation_title, recommendation_first_step, chosen_at,
  mood_after (nullable), was_helpful (nullable), notes (nullable)

Use Supabase anonymous auth for `user_id` — one call, no sign-up screen,
stable per device. Enable RLS so a guest only reads their own rows.

Write `src/lib/stays.ts` with saveStay, updateReflection, listStays.
Keep all Supabase access in that file.

## Hard constraints

- **Do not modify `src/types.ts`, `src/lib/ai.ts`, or `src/lib/fallback.ts`.**
- The main flow must still work end-to-end if Supabase is unreachable.
  Every write is fire-and-forget: catch, log to console, never surface an
  error mid-flow and never block the user from continuing.
- If there are no past stays, show a warm empty state, not a blank screen.
- Nothing here goes into the AI prompt yet. Storage only.

## Tone and safety

Notes are private and low-pressure. Never use streaks, counters, or any
language implying the user has fallen behind. No "you haven't journaled in
3 days." This is a guest book, not a habit tracker.

If notes suggest real distress rather than a low mood, surface crisis
resources. Do not analyse, score, or interpret what the user wrote.

## Task

$ARGUMENTS

When done, confirm the main flow still runs with Supabase env vars removed.