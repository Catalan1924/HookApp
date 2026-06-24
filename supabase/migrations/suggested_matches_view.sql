-- Suggested profiles for the Discover feed:
-- same university, not already in a thread, not blocked
create or replace view suggested_matches as
select
p.id,
p.username,
p.display_name,
p.avatar_url,
p.bio,
p.age,
p.gender,
p.interests,
u.name as university_name
from profiles p
left join universities u on u.id = p.university_id
where
p.is_banned = false
and p.verified = true;
-- NOTE: Filter by current user's university_id and
-- exclude existing threads at the query level
-- (RLS + client query), e.g.:
--
-- select * from suggested_matches
-- where
-- university_id = (select university_id from profiles where id = auth.uid())
-- and id <> auth.uid()
-- and not_blocked(auth.uid(), id)
-- and id not in (
-- select case when user_a = auth.uid() then user_b else user_a end
-- from threads
-- where user_a = auth.uid() or user_b = auth.uid()
-- )
-- order by random()
-- limit 20