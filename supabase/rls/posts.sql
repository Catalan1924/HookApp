alter table posts enable row level security;
-- Discover: everyone can see 'everyone' audience posts (non-deleted)
create policy "posts: select everyone"
on posts for select
using (
deleted_at is null
and (
audience = 'everyone'
or user_id = auth.uid()
or (
audience = 'matches'
and exists (
select 1 from threads
where status = 'matched'
and (
(user_a = auth.uid() and user_b = posts.user_id)
or
(user_b = auth.uid() and user_a = posts.user_id)
)
)
)
or (
audience = 'university'
and exists (
select 1 from profiles me
join profiles them on them.id = posts.user_id
where me.id = auth.uid()
and me.university_id = them.university_id
)
)
)
);
-- Users insert their own posts
create policy "posts: insert own"
on posts for insert
with check (auth.uid() = user_id);
-- Users soft-delete their own posts
create policy "posts: update own"
on posts for update
using (auth.uid() = user_id);