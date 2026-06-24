alter table profile_likes enable row level security;
create policy "profile_likes: select own"
on profile_likes for select
using (auth.uid() = liker_id or auth.uid() = liked_id);
create policy "profile_likes: insert"
on profile_likes for insert
with check (
auth.uid() = liker_id
and not_blocked(liker_id, liked_id)
);
create policy "profile_likes: delete own"
on profile_likes for delete
using (auth.uid() = liker_id);