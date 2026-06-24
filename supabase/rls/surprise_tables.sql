alter table surprise_sessions enable row level security;
alter table surprise_saves enable row level security;
alter table surprise_queue enable row level security;
create policy "surprise_sessions: select own"
on surprise_sessions for select
using (auth.uid() = user_a or auth.uid() = user_b);
create policy "surprise_queue: manage own"
on surprise_queue for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
create policy "surprise_saves: manage own"
on surprise_saves for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);