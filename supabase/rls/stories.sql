alter table stories enable row level security;
create policy "stories: select active"
on stories for select
using (
expires_at > now()
and not_blocked(auth.uid(), user_id)
);
create policy "stories: insert own"
on stories for insert
with check (auth.uid() = user_id);
create policy "stories: delete own"
on stories for delete
using (auth.uid() = user_id);