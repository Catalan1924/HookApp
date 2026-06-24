create table surprise_saves (
    user_id uuid references profiles(id),
    saved_user_id uuid references profiles(id),
    session_id uuid references surprise_sessions(id),
    created_at timestamptz default now(),

    primary key (user_id, saved_user_id)
);