create table universities (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    email_domain text unique not null,
    badge_label text,
    created_at timestamptz default now()
);

alter table universities enable row level security;
