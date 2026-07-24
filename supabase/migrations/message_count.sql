-- Trigger: after a message is inserted, update thread message_count
-- and auto-promote to 'matched' when both users have sent ≥ 5 messages.
create or replace function check_message_limit()
returns trigger as $$
declare
  v_user_a uuid;
  v_user_b uuid;
  v_a_sent int;
  v_b_sent int;
  v_status text;
begin
  -- Fetch thread participants
  select user_a, user_b, status
  into v_user_a, v_user_b, v_status
  from threads where id = new.thread_id;

  -- Count messages per user in this thread
  select
    count(*) filter (where sender_id = v_user_a),
    count(*) filter (where sender_id = v_user_b)
  into v_a_sent, v_b_sent
  from messages
  where thread_id = new.thread_id;

  -- Update thread metadata
  update threads
  set
    message_count = v_a_sent + v_b_sent,
    updated_at = now()
  where id = new.thread_id;

  -- Auto-promote to matched when both users have sent 5+ messages
  if v_a_sent >= 5 and v_b_sent >= 5 and v_status = 'pending' then
    update threads
    set status = 'matched', updated_at = now()
    where id = new.thread_id;

    -- Notify both users of the match promotion
    insert into notifications (user_id, type, payload)
    values
      (v_user_a, 'new_match', jsonb_build_object('thread_id', new.thread_id, 'matched_with', v_user_b)),
      (v_user_b, 'new_match', jsonb_build_object('thread_id', new.thread_id, 'matched_with', v_user_a));
  end if;

  return new;
end;
$$ language plpgsql security definer;

-- Only create the trigger if it doesn't already exist
do $$
begin
  if not exists (
    select 1 from pg_trigger where tgname = 'on_message_inserted'
  ) then
    create trigger on_message_inserted
    after insert on messages
    for each row execute function check_message_limit();
  end if;
end;
$$;
