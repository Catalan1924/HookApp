create table surprise_sessions (
    id uuid primary key default gen_random_uuid(),
    user_a uuid references profiles(id),
    user_b uuid references profiles(id),
    signaling_channel text,
    started_at timestamptz default now(),
    ended_at timestamptz
);