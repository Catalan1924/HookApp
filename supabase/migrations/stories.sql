create table stories (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references profiles(id) on delete cascade,
    media_url text not null,
    type story_type not null,
    created_at timestamptz default now(),
    expires_at timestamptz default (now() + interval '24 hours')
);