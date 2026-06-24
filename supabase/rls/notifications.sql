alter table notifications enable row level security;
create policy "notifications: select own"
on notifications for select
using (auth.uid() = user_id);
create policy "notifications: update own (mark read)"
on notifications for update
using (auth.uid() = user_id);