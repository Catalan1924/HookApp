-- Performance indexes for CampusMatch

-- Posts: feed ordering & user filtering
create index if not exists idx_posts_user on posts(user_id);
create index if not exists idx_posts_created on posts(created_at desc);

-- Messages: thread lookup & ordering
create index if not exists idx_messages_thread on messages(thread_id);
create index if not exists idx_messages_created on messages(created_at);

-- Notifications: user inbox
create index if not exists idx_notifications_user on notifications(user_id);
create index if not exists idx_notifications_created on notifications(created_at desc);

-- Stories: user timeline & expiry cleanup
create index if not exists idx_stories_user on stories(user_id);
create index if not exists idx_story_expires on stories(expires_at);

-- Profiles: university filtering
create index if not exists idx_profile_university on profiles(university_id);

-- Profile likes: mutual match detection
create index if not exists idx_profile_likes_liker on profile_likes(liker_id);
create index if not exists idx_profile_likes_liked on profile_likes(liked_id);

-- Threads: user lookup
create index if not exists idx_threads_user_a on threads(user_a);
create index if not exists idx_threads_user_b on threads(user_b);

-- Blocks: fast block-check lookups
create index if not exists idx_blocks_blocker on blocks(blocker_id);
create index if not exists idx_blocks_blocked on blocks(blocked_id);

-- Reports: admin review
create index if not exists idx_reports_reporter on reports(reporter_id);
create index if not exists idx_reports_status on reports(status);

-- Surprise saves: profile tab
create index if not exists idx_surprise_saves_user on surprise_saves(user_id);

-- Analytics events
create index if not exists idx_events_user on events(user_id);
create index if not exists idx_events_name on events(event_name);
