alter table likes enable row level security;
create policy "likes: select"
on likes for select
using (auth.role() = 'authenticated');
create policy "likes: insert own"
on likes for insert
with check (auth.uid() = user_id);
create policy "likes: delete own"
on likes for delete
using (auth.uid() = user_id);