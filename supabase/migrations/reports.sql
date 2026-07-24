create table reports (
    id uuid primary key default gen_random_uuid(),
    reporter_id uuid references profiles(id) on delete cascade,
    reported_user_id uuid references profiles(id) on delete cascade,
    context_type report_context not null,
    context_id uuid,
    reason text not null,
    status report_status default 'open',
    created_at timestamptz default now(),

    constraint reason_not_empty check (length(reason) > 0)
);

alter table reports enable row level security;
