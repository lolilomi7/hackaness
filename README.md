# HackNess

**[hackaness.vercel.app](https://hackaness.vercel.app)**

Pick a mood, answer a few quick questions, and get three small, doable
things to try right now — served up hotel-style: check in at the front
desk, talk to the bunny concierge, ride the elevator up, and choose a
room. Pick as many rooms as you like; each one becomes its own entry in
your **Past Stays** journal, with an optional reflection (how it went,
whether it helped, a note, a photo) that you can add or edit any time.

## Features

- **Mood-aware recommendations** — 8 moods (anxious, sad, angry, happy,
  calm, tired, excited, unsure), each combined with energy, time
  available, environment, and whether you can step outside, to derive a
  "floor" and drive an AI prompt for 3 concrete suggestions.
- **Multi-select rooms** — choose more than one door; each pick saves
  immediately and gets its own reflection prompt.
- **Past Stays journal** — a reverse-chronological guest book of what
  you tried, searchable once you have more than a handful of entries,
  with photos shown inline next to each entry and a tap-to-enlarge view.
- **Sign-in only when it matters** — browsing and getting recommendations
  never requires an account; saving a journal entry prompts a one-tap
  magic-link email sign-in, and anything picked before signing in is
  queued and saved automatically once you do.
- **Graceful degradation** — the core flow (mood → questions →
  recommendations) works even if Supabase is unreachable or unconfigured,
  falling back to local recommendation data.

## Tech stack

- [Vite](https://vite.dev) + React 19 + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com) for styling
- [Motion](https://motion.dev) for animation
- [Supabase](https://supabase.com) — Postgres (journal entries), Storage
  (photos), Auth (magic-link email), and an Edge Function that calls the
  Gemini API for recommendations
- Deployed on [Vercel](https://vercel.com)

## Getting started

```bash
npm install
cp .env.example .env
npm run dev
```

The app runs end-to-end with no keys at all: with `VITE_SUPABASE_URL`
and `VITE_SUPABASE_ANON_KEY` unset, recommendations fall back to local
data, and choosing a room simply won't have anywhere to save to. Fill in
the Supabase project details below to get the full journal experience.

```bash
npm run build   # type-check + production build
npm run lint    # oxlint
npm run preview # preview the production build locally
```

## Environment variables

| Variable | Where it's used |
| --- | --- |
| `VITE_SUPABASE_URL` | Client-side Supabase project URL (`src/lib/supabase.ts`) |
| `VITE_SUPABASE_ANON_KEY` | Client-side Supabase anon key |

The Gemini API key is a **server-side secret** on the `recommend` Edge
Function (`GEMINI_API_KEY`, set via `supabase secrets set`), not a client
env var — it's never exposed to the browser.

## Supabase setup

This project uses the Supabase CLI (`supabase/config.toml`,
`supabase/migrations/`, `supabase/functions/recommend/`). Against a
linked project:

```bash
supabase db push                        # create the stays table, RLS, grants, and storage bucket
supabase functions deploy recommend      # deploy the recommendation Edge Function
supabase config push                     # push auth settings (magic-link redirect URLs, etc.)
```

You'll also need a `stay-photos` private Storage bucket (created by the
`stay_photos` migration) and email/magic-link sign-in enabled in the
project's Auth settings — both come from the config and migrations above.

## Project structure

| Path | Owns |
| --- | --- |
| `src/hotel/screens/` | One screen per step: `CheckIn`, `Concierge`, `Elevator`, `Floor`, `PastStays`. |
| `src/hotel/components/` | Hotel-themed UI pieces — doors, the concierge avatar, reflection/photo/sign-in cards, toasts. |
| `src/lib/ai.ts` | Calls the `recommend` Edge Function, falls back to `fallback.ts` on any failure. |
| `src/lib/stays.ts`, `staysMapping.ts` | Journal CRUD against Supabase, gated on a real (non-anonymous) sign-in. |
| `src/lib/auth.ts`, `pendingStays.ts` | Magic-link sign-in and the local queue of saves waiting on it. |
| `src/lib/photos.ts` | Uploads and resolves signed URLs for journal photos. |
| `src/types.ts`, `src/theme.ts` | Shared types (`Mood`, `UserContext`, `Recommendation`) and the classic (non-hotel) UI's color palettes. |
| `src/screens/`, `src/components/` | The original, currently-unused classic UI — kept for reference; `HOTEL_UI` in `src/App.tsx` controls which one renders. |
| `supabase/` | Migrations, the `recommend` Edge Function, and CLI config. |
