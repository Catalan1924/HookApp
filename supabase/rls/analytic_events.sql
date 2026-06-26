drop policy if exists "events: insert own" on events;
drop policy if exists "events: select own" on events;
drop policy if exists "events: deny update" on events;
drop policy if exists "events: deny delete" on events;

-- Users can insert their own events
create policy "events: insert own"
  on events for insert
  with check (auth.uid() = user_id);

-- Users can only read their own events
create policy "events: select own"
  on events for select
  using (auth.uid() = user_id);

-- Disallow updates and deletes for regular users (analytics are append-only)
create policy "events: deny update"
  on events for update
  using (false);

create policy "events: deny delete"
  on events for delete
  using (false);
