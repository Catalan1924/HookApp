-- Run in Supabase Dashboard → SQL Editor
-- Creates storage buckets and their access policies (idempotent)

-- Buckets
insert into storage.buckets (id, name, public)
values
  ('profile-pictures', 'profile-pictures', true),
  ('post-media',       'post-media',       true),
  ('story-media',      'story-media',      true)
on conflict (id) do nothing;

-- ─────────────────────────────────────────────
-- Profile pictures
-- ─────────────────────────────────────────────
drop policy if exists "profile-pictures: public read"   on storage.objects;
drop policy if exists "profile-pictures: user upload"   on storage.objects;

create policy "profile-pictures: public read"
  on storage.objects for select
  using (bucket_id = 'profile-pictures');

create policy "profile-pictures: user upload"
  on storage.objects for insert
  with check (
    bucket_id = 'profile-pictures'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- ─────────────────────────────────────────────
-- Post media
-- ─────────────────────────────────────────────
drop policy if exists "post-media: public read" on storage.objects;
drop policy if exists "post-media: user upload" on storage.objects;

create policy "post-media: public read"
  on storage.objects for select
  using (bucket_id = 'post-media');

create policy "post-media: user upload"
  on storage.objects for insert
  with check (
    bucket_id = 'post-media'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- ─────────────────────────────────────────────
-- Story media
-- ─────────────────────────────────────────────
drop policy if exists "story-media: public read" on storage.objects;
drop policy if exists "story-media: user upload" on storage.objects;

create policy "story-media: public read"
  on storage.objects for select
  using (bucket_id = 'story-media');

create policy "story-media: user upload"
  on storage.objects for insert
  with check (
    bucket_id = 'story-media'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
