create index idx_posts_user on posts(user_id);
create index idx_posts_created on posts(created_at desc);

create index idx_messages_thread on messages(thread_id);
create index idx_messages_created on messages(created_at);

create index idx_notifications_user on notifications(user_id);

create index idx_stories_user on stories(user_id);
create index idx_story_expires on stories(expires_at);

create index idx_profile_university on profiles(university_id);

create index idx_queue_status on surprise_queue(status);