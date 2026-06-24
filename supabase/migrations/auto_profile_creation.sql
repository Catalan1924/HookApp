create or replace function handle_new_user()
returns trigger as $$
begin
insert into profiles (id, username, display_name)
values (
new.id,
split_part(new.email, '@', 1), 
split_part(new.email, '@', 1)
);
return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function handle_new_user();