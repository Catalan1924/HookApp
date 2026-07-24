-- Returns true if neither user has blocked the other
create or replace function not_blocked(user_a uuid, user_b uuid)
returns boolean as $$
select not exists (
select 1 from blocks
where
(blocker_id = user_a and blocked_id = user_b)
or
(blocker_id = user_b and blocked_id = user_a)
);
$$ language sql security definer stable;