create table blocks (
    blocker_id uuid references profiles(id) on delete cascade,
    blocked_id uuid references profiles(id) on delete cascade,
    created_at timestamptz default now(),

    primary key (blocker_id, blocked_id),

    constraint no_self_block
    check (blocker_id <> blocked_id)
);

alter table blocks enable row level security;
