alter table blocks enable row level security;
alter table reports enable row level security;
create policy "blocks: manage own"
on blocks for all
using (auth.uid() = blocker_id)
with check (auth.uid() = blocker_id);
create policy "blocks: select own"
on blocks for select
using (auth.uid() = blocker_id);
create policy "reports: insert"
on reports for insert
with check (auth.uid() = reporter_id);
create policy "reports: select own"
on reports for select
using (auth.uid() = reporter_id);