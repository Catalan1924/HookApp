create table likes (
    post_id uuid references posts(id) on delete cascade,
    user_id uuid references profiles(id) on delete cascade,
    created_at timestamptz default now(),

    primary key (post_id, user_id)
);