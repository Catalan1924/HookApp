drop policy if exists "surprise_sessions: select own" on surprise_sessions;
drop policy if exists "surprise_sessions: insert" on surprise_sessions;
drop policy if exists "surprise_sessions: update own" on surprise_sessions;
drop policy if exists "surprise_queue: manage own" on surprise_queue;
drop policy if exists "surprise_saves: manage own" on surprise_saves;

-- Surprise sessions: participants can read, server/edge-function inserts
create policy "surprise_sessions: select own"
  on surprise_sessions for select
  using (auth.uid() = user_a or auth.uid() = user_b);

create policy "surprise_sessions: insert"
  on surprise_sessions for insert
  with check (
    auth.uid() = user_a
    and not_blocked(user_a, user_b)
  );

create policy "surprise_sessions: update own"
  on surprise_sessions for update
  using (auth.uid() = user_a or auth.uid() = user_b);

-- Surprise queue: users manage their own queue entry
create policy "surprise_queue: manage own"
  on surprise_queue for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Surprise saves: users manage their own saved list
create policy "surprise_saves: manage own"
  on surprise_saves for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
