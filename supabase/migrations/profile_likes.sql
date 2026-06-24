create table profile_likes (
    liker_id uuid references profiles(id) on delete cascade,
    liked_id uuid references profiles(id) on delete cascade,
    created_at timestamptz default now(),

    primary key (liker_id, liked_id),

    constraint no_self_profile_like
    check (liker_id <> liked_id)
);