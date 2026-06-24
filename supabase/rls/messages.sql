alter table messages enable row level security;
create policy "messages: select in thread"
on messages for select
using (
exists (
select 1 from threads
where threads.id = messages.thread_id
and (threads.user_a = auth.uid() or threads.user_b = auth.uid())
)
);
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