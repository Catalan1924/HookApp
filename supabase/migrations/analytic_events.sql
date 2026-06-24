create table events (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references profiles(id),
    event_name text not null,
    metadata jsonb,
    created_at timestamptz default now()
);