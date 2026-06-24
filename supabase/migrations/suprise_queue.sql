create table surprise_queue (
    user_id uuid primary key references profiles(id),
    status surprise_status default 'waiting',
    joined_at timestamptz default now()
);