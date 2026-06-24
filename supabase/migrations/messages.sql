create table messages (
    id uuid primary key default gen_random_uuid(),
    thread_id uuid references threads(id) on delete cascade,
    sender_id uuid references profiles(id) on delete cascade,
    content text not null,
    created_at timestamptz default now(),
    read_at timestamptz
);