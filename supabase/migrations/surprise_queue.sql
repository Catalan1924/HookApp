-- Queue of users waiting for a random Surprise Meetup match
create table surprise_queue (
    id uuid primary key default gen_random_uuid(),
    user_id uuid unique references profiles(id) on delete cascade,
    status surprise_status default 'waiting',
    joined_at timestamptz default now()
);

create index idx_queue_status on surprise_queue(status);
create index idx_queue_joined on surprise_queue(joined_at);

alter table surprise_queue enable row level security;
