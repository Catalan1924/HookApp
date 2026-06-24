alter table profiles enable row level security;
-- Anyone authenticated can view non-banned profiles
create policy "profiles: select"
on profiles for select
using (
auth.role() = 'authenticated'
and is_banned = false
);
-- Users can only update their own profile
create policy "profiles: update own"
on profiles for update
using (auth.uid() = id);