-- Photos attached to a stay's journal entry. Stores storage *paths*, not
-- public URLs — the bucket is private (journal photos are personal), so the
-- app resolves each path to a short-lived signed URL when displaying it.
alter table public.stays add column if not exists photo_paths text[] not null default '{}';

insert into storage.buckets (id, name, public)
values ('stay-photos', 'stay-photos', false)
on conflict (id) do nothing;

create policy "stay_photos_select_own"
  on storage.objects for select
  using (bucket_id = 'stay-photos' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "stay_photos_insert_own"
  on storage.objects for insert
  with check (bucket_id = 'stay-photos' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "stay_photos_delete_own"
  on storage.objects for delete
  using (bucket_id = 'stay-photos' and (storage.foldername(name))[1] = auth.uid()::text);
