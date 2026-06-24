alter table threads enable row level security;
create policy "threads: select own"
on threads for select
using (auth.uid() = user_a or auth.uid() = user_b);
create policy "threads: insert"
on threads for insert
with check (
auth.uid() = user_a
and not_blocked(user_a, user_b)