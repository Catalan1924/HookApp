drop policy if exists "threads: select own" on threads;
drop policy if exists "threads: insert" on threads;
drop policy if exists "threads: update own" on threads;
drop policy if exists "threads: deny delete" on threads;

-- Participants can view their own threads
create policy "threads: select own"
  on threads for select
  using (auth.uid() = user_a or auth.uid() = user_b);

-- Users can create threads where they are user_a,
-- provided they haven't blocked the other user
create policy "threads: insert"
  on threads for insert
  with check (
    auth.uid() = user_a
    and not_blocked(user_a, user_b)
  );

-- Participants can update threads they're in (archiving, read status)
create policy "threads: update own"
  on threads for update
  using (auth.uid() = user_a or auth.uid() = user_b);

-- Disallow thread deletion by users (threads are permanent records)
create policy "threads: deny delete"
  on threads for delete
  using (false);
