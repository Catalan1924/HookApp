-- Active surprise meetup call sessions
create table surprise_sessions (
    id uuid primary key default gen_random_uuid(),
    user_a uuid references profiles(id) on delete cascade,
    user_b uuid references profiles(id) on delete cascade,
    signaling_channel text,
    started_at timestamptz default now(),
    ended_at timestamptz,

    constraint no_self_session
    check (user_a <> user_b)
);

create index idx_surprise_sessions_users on surprise_sessions(user_a, user_b);

alter table surprise_sessions enable row level security;
