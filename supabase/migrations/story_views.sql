create table story_views (
    story_id uuid references stories(id) on delete cascade,
    viewer_id uuid references profiles(id) on delete cascade,
    viewed_at timestamptz default now(),

    primary key (story_id, viewer_id)
);