---
description: Work on the AI recommendation engine (Lali's scope)
argument-hint: [what to build or fix]
allowed-tools: Read, Edit, Write, Bash
---

You are working on the AI recommendation layer only.

## Scope

You may edit:
- `src/lib/ai.ts` — getRecommendations(ctx: UserContext): Promise<Recommendation[]>
- `src/lib/fallback.ts` — hardcoded recommendation bank
- `src/lib/prompt.ts` — prompt construction (create if needed)
- `supabase/functions/recommend/` — Edge Function proxying Gemini

Everything else is read-only. Read @src/types.ts before you start and treat
those types as fixed. If a change outside this scope seems necessary, say so
and stop — do not make it. Three other people are editing those files.

## Rules

- `getRecommendations()` must never throw and never hang. Timeout at 8s,
  fall back to `fallback.ts` silently, log to console only.
- Always return exactly 3 recommendations. The results UI assumes 3.
- Use Gemini's `responseSchema` for structured JSON. Never parse prose,
  never regex the response.
- The prompt must treat `environment` as a hard constraint: every suggestion
  must be physically possible there, and at least one must use that setting
  directly. No forest walks for coastal users.
- Suggestions must be specific and actionable in the stated time budget.
  Reject generic wellness filler.
- API key lives in Supabase secrets, never in client code or committed files.

## Safety

If the user's mood input suggests real distress rather than a low mood,
return crisis resources instead of an activity. Never remove or weaken
this path.

## Task

$ARGUMENTS

When done: state what changed, confirm the flow still runs end-to-end
against the fallback with the network off, and flag anything the rest of
the team needs to know.
