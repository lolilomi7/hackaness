# Hackaness

Pick a mood, answer 3 quick questions, get 3 small things to do right now.

## Setup

```bash
npm install
cp .env.example .env   # fill in keys when you have them
npm run dev
```

The app runs end-to-end on first `npm run dev` using a stubbed AI response
(1.5s fake delay + hardcoded fallback recommendations) — no keys required to
start building.

```bash
npm run build   # type-check + production build
```

## Folder ownership

| Folder            | Owns                                                              |
| ------------------ | ------------------------------------------------------------------ |
| `src/screens/`      | One screen per file: `MoodScreen`, `QuestionsScreen`, `LoadingScreen`, `ResultsScreen`. Layout + interaction only. |
| `src/components/`   | Dumb, prop-driven pieces: `Chip`, `Card`, `GradientBackground`, `Loader`. |
| `src/lib/`          | `ai.ts` (recommendation fetch, stubbed), `fallback.ts` (hardcoded data), `supabase.ts` (client). |
| `src/theme.ts`      | Gradient color pairs per mood/environment. **Shared file** — coordinate before editing. |

## Shared files

`src/App.tsx` and `src/theme.ts` are shared: `App.tsx` owns all app state
(the `step` flow and the in-progress `UserContext`), and `theme.ts` feeds
color values every screen relies on. Changes to either affect everyone —
post in the group chat before editing them, and keep diffs small.

## Where the real work goes

- Swap the AI stub in `src/lib/ai.ts` for a real Gemini call (marked with a `TODO`).
- Add Supabase calls wherever needed — the client is ready in `src/lib/supabase.ts`.
- Style components/screens beyond the current minimal Tailwind classes.
