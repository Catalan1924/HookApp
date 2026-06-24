-- Run in Supabase Dashboard → Storage, or paste here
insert into storage.buckets (id, name, public)
values
('avatars', 'avatars', true),
('post-media', 'post-media', true),
('story-media', 'story-media', true)
on conflict (id) do nothing;
-- Avatar storage policies
create policy "avatars: public read"
on storage.objects for select
using (bucket_id = 'avatars');
create policy "avatars: user upload"
on storage.objects for insert
with check (
bucket_id = 'avatars'
and auth.uid()::text = (storage.foldername(name))[1]
);
-- Post media policies
create policy "post-media: public read"
on storage.objects for select
using (bucket_id = 'post-media');
create policy "post-media: user upload"
on storage.objects for insert
with check (
bucket_id = 'post-media'
and auth.uid()::text = (storage.foldername(name))[1]
);
-- Story media policies
create policy "story-media: public read"
on storage.objects for select
using (bucket_id = 'story-media');
create policy "story-media: user upload"
on storage.objects for insert
with check (
bucket_id = 'story-media'
and auth.uid()::text = (storage.foldername(name))[1]
);