-- Past Stays journal: one row per chosen recommendation, with an optional
-- reflection filled in afterwards. Guest-scoped via Supabase anonymous auth.

create table if not exists public.stays (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid not null references auth.users (id) on delete cascade,
  mood_before text not null,
  environment text not null,
  minutes_available integer not null,
  recommendation_title text not null,
  recommendation_first_step text not null,
  chosen_at timestamptz not null default now(),
  mood_after text,
  was_helpful boolean,
  notes text
);

alter table public.stays enable row level security;

create policy "stays_select_own"
  on public.stays for select
  using (auth.uid() = user_id);

create policy "stays_insert_own"
  on public.stays for insert
  with check (auth.uid() = user_id);

create policy "stays_update_own"
  on public.stays for update
  using (auth.uid() = user_id);
