create or replace view matches_view as
select
t.id as thread_id,
t.user_a,
t.user_b,
t.status,
t.message_count,
t.created_at,
t.updated_at,
pa.username as user_a_username,
pa.avatar_url as user_a_avatar,
pb.username as user_b_username,
pb.avatar_url as user_b_avatar
from threads t
join profiles pa on pa.id = t.user_a
join profiles pb on pb.id = t.user_b
where t.status = 'matched';