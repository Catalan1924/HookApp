create or replace function check_message_limit()
returns trigger as $$
declare
v_user_a uuid;
v_user_b uuid;
v_a_sent int;
v_b_sent int;
begin
select user_a, user_b into v_user_a, v_user_b
from threads where id = new.thread_id;
select
count(*) filter (where sender_id = v_user_a),
count(*) filter (where sender_id = v_user_b)
into v_a_sent, v_b_sent
from messages
where thread_id = new.thread_id;
update threads
set
message_count = v_a_sent + v_b_sent,
updated_at = now()
where id = new.thread_id;
if v_a_sent >= 5 and v_b_sent >= 5 then
update threads
set status = 'matched'
where id = new.thread_id and status = 'pending';
end if;
return new;
end;
$$ language plpgsql security definer;
create trigger on_message_inserted
after insert on messages
for each row execute function check_message_limit();