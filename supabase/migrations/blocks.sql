create table blocks (
    blocker_id uuid references profiles(id),
    blocked_id uuid references profiles(id),
    created_at timestamptz default now(),

    primary key (blocker_id, blocked_id),

    constraint no_self_block
    check (blocker_id <> blocked_id)
);