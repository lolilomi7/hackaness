-- RLS policies alone don't grant table access — Postgres also requires an
-- explicit GRANT before the policies are even consulted. Without this,
-- anon-authenticated guests hit "permission denied for table stays".
grant select, insert, update on public.stays to authenticated;
