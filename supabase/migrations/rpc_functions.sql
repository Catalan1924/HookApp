-- Returns matched profiles for the current user
-- (profiles where a mutual thread exists with status = 'matched')
create or replace function get_matched_profiles()
returns table (
  user_id uuid,
  full_name text,
  avatar_url text,
  university_name text,
  thread_id uuid
) as $$
begin
  return query
  select
    case when t.user_a = auth.uid() then t.user_b else t.user_a end as user_id,
    p.display_name as full_name,
    p.avatar_url,
    u.name as university_name,
    t.id as thread_id
  from threads t
  join profiles p on p.id = case when t.user_a = auth.uid() then t.user_b else t.user_a end
  left join universities u on u.id = p.university_id
  where t.status = 'matched'
    and (t.user_a = auth.uid() or t.user_b = auth.uid())
  order by t.updated_at desc;
end;
$$ language plpgsql security definer stable;


-- Returns a random profile suitable for Surprise Meetup
-- Excludes: self, already-threaded, blocked, banned, already in queue
create or replace function get_random_profile(current_user_id uuid)
returns table (
  id uuid,
  full_name text,
  avatar_url text,
  bio text,
  age int,
  university_name text
) as $$
begin
  return query
  select
    p.id,
    p.display_name as full_name,
    p.avatar_url,
    p.bio,
    p.age,
    u.name as university_name
  from profiles p
  left join universities u on u.id = p.university_id
  where p.id <> current_user_id
    and p.is_banned = false
    and not_blocked(current_user_id, p.id)
    -- exclude profiles already in a thread with the user
    and p.id not in (
      select case when t.user_a = current_user_id then t.user_b else t.user_a end
      from threads t
      where (t.user_a = current_user_id or t.user_b = current_user_id)
    )
    -- exclude profiles already in the surprise queue
    and p.id not in (
      select sq.user_id from surprise_queue sq
    )
  order by random()
  limit 1;
end;
$$ language plpgsql security definer stable;


-- Logs an analytics event (thin wrapper for convenience)
create or replace function log_event(
  event_name text,
  metadata jsonb default null
) returns uuid as $$
declare
  event_id uuid;
begin
  insert into events (user_id, event_name, metadata)
  values (auth.uid(), event_name, metadata)
  returning id into event_id;
  return event_id;
end;
$$ language plpgsql security definer;
