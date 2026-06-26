-- ── DB Trigger: auto-create profile on auth signup ──────────────
-- This is the FALLBACK. The preferred path is the Edge Function
-- "create-profile" which auto-matches university by email domain.
--
-- This trigger fires only if the Edge Function wasn't called
-- (e.g., signup via a non-web client, or Edge Function is down).
-- ─────────────────────────────────────────────────────────────────

create or replace function handle_new_user()
returns trigger as $$
begin
  -- Only create if the Edge Function didn't already do it
  if not exists (select 1 from profiles where id = new.id) then
    insert into profiles (id, username, display_name, phone)
    values (
      new.id,
      split_part(new.email, '@', 1),
      split_part(new.email, '@', 1),
      new.phone
    );
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
