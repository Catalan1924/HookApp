drop policy if exists "messages: select in thread" on messages;
drop policy if exists "messages: insert in thread" on messages;
drop policy if exists "messages: update read receipt" on messages;
drop policy if exists "messages: deny delete" on messages;

-- Thread participants can view messages in their threads
create policy "messages: select in thread"
  on messages for select
  using (
    exists (
      select 1 from threads
      where threads.id = messages.thread_id
      and (threads.user_a = auth.uid() or threads.user_b = auth.uid())
    )
  );

-- Users can send messages in threads they belong to
create policy "messages: insert in thread"
  on messages for insert
  with check (
    auth.uid() = sender_id
    and exists (
      select 1 from threads
      where threads.id = messages.thread_id
      and (threads.user_a = auth.uid() or threads.user_b = auth.uid())
    )
  );

-- Only the recipient can mark a message as read
create policy "messages: update read receipt"
  on messages for update
  using (
    exists (
      select 1 from threads
      where threads.id = messages.thread_id
      and (threads.user_a = auth.uid() or threads.user_b = auth.uid())
    )
  );

-- Disallow deletion (messages are permanent)
create policy "messages: deny delete"
  on messages for delete
  using (false);
