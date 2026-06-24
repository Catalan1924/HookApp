create table reports (
    id uuid primary key default gen_random_uuid(),
    reporter_id uuid references profiles(id),
    reported_user_id uuid references profiles(id),
    context_type report_context,
    context_id uuid,
    reason text,
    status report_status default 'open',
    created_at timestamptz default now()
);