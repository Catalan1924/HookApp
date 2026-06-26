drop policy if exists "notifications: select own" on notifications;
drop policy if exists "notifications: update own (mark read)" on notifications;
drop policy if exists "notifications: deny insert" on notifications;
drop policy if exists "notifications: deny delete" on notifications;

-- Users can see their own notifications
create policy "notifications: select own"
  on notifications for select
  using (auth.uid() = user_id);

-- Users can mark their own notifications as read
create policy "notifications: update own (mark read)"
  on notifications for update
  using (auth.uid() = user_id);

-- Disallow user inserts — notifications are created by
-- DB triggers and Edge Functions (which use service_role)
create policy "notifications: deny insert"
  on notifications for insert
  with check (false);

-- Disallow deletion by users — cleanup is handled by
-- the cleanup-expired Edge Function
create policy "notifications: deny delete"
  on notifications for delete
  using (false);
