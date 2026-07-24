drop policy if exists "stories: select active" on stories;
drop policy if exists "stories: insert own" on stories;
drop policy if exists "stories: update own" on stories;
drop policy if exists "stories: delete own" on stories;

-- Anyone authenticated can view active stories from non-blocked users
create policy "stories: select active"
  on stories for select
  using (
    expires_at > now()
    and not_blocked(auth.uid(), user_id)
  );

-- Users insert their own stories
create policy "stories: insert own"
  on stories for insert
  with check (auth.uid() = user_id);

-- Users can update their own stories (e.g. change media)
create policy "stories: update own"
  on stories for update
  using (auth.uid() = user_id);

-- Users can delete their own stories
create policy "stories: delete own"
  on stories for delete
  using (auth.uid() = user_id);
