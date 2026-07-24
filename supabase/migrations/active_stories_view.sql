-- Only return stories that haven't expired yet
create or replace view active_stories_view as
select
s.id,
s.user_id,
s.media_url,
s.type,
s.created_at,
s.expires_at,
p.username,
p.avatar_url
from stories s
join profiles p on p.id = s.user_id
where s.expires_at > now()
and p.is_banned = false;