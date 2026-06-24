create table posts (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references profiles(id) on delete cascade,
    type post_type not null,
    media jsonb not null,
    caption text,
    audience post_audience default 'everyone',
    created_at timestamptz default now(),
    deleted_at timestamptz,

    constraint caption_length
    check (
        caption is null
        or length(caption) <= 100
    )
);