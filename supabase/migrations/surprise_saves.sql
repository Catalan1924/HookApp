-- Profiles saved from Surprise Meetup sessions
create table surprise_saves (
    user_id uuid references profiles(id) on delete cascade,
    saved_user_id uuid references profiles(id) on delete cascade,
    session_id uuid references surprise_sessions(id) on delete set null,
    created_at timestamptz default now(),

    primary key (user_id, saved_user_id),

    constraint no_self_save
    check (user_id <> saved_user_id)
);

alter table surprise_saves enable row level security;
