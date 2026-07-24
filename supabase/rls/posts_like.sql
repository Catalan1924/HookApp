drop policy if exists "likes: select" on posts_like;
drop policy if exists "likes: insert own" on posts_like;
drop policy if exists "likes: delete own" on posts_like;
drop policy if exists "likes: deny update" on posts_like;

-- Anyone authenticated can view all likes
create policy "likes: select"
  on posts_like for select
  using (auth.role() = 'authenticated');

-- Users can like posts (insert their own)
create policy "likes: insert own"
  on posts_like for insert
  with check (auth.uid() = user_id);

-- Users can unlike posts (delete their own)
create policy "likes: delete own"
  on posts_like for delete
  using (auth.uid() = user_id);

-- Disallow updates (likes are atomic: create or delete only)
create policy "likes: deny update"
  on posts_like for update
  using (false);
