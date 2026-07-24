create table threads (
    id uuid primary key default gen_random_uuid(),
    user_a uuid references profiles(id) on delete cascade,
    user_b uuid references profiles(id) on delete cascade,
    status thread_status default 'pending',
    initiator_id uuid references profiles(id),
    message_count int default 0,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),

    constraint no_self_thread
    check (user_a <> user_b),

    unique (user_a, user_b)
);

alter table threads enable row level security;
