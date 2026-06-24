create table notifications (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references profiles(id),
    type notification_type,
    payload jsonb,
    read_at timestamptz,
    created_at timestamptz default now()
);