create table profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    username text unique not null,
    display_name text,
    avatar_url text,
    bio text,
    university_id uuid references universities(id),
    verified boolean default false,
    age int check (age >= 18),
    gender text,
    interested_in text,
    interests text[] default '{}',
    is_banned boolean default false,
    created_at timestamptz default now()
);