create or replace function touch_thread_updated_at()
returns trigger as $$
begin
update threads set updated_at = now() where id = new.thread_id;
return new;
end;
$$ language plpgsql;