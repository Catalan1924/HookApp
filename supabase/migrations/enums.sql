create type post_type as enum (
  'photo',
  'video',
  'gallery'
);

create type post_audience as enum (
  'everyone',
  'matches',
  'university'
);

create type story_type as enum (
  'photo',
  'video'
);

create type thread_status as enum (
  'pending',
  'matched'
);

create type surprise_status as enum (
  'waiting',
  'in_call'
);

create type report_context as enum (
  'post',
  'profile',
  'surprise_session',
  'message'
);

create type report_status as enum (
  'open',
  'reviewed',
  'actioned'
);

create type notification_type as enum (
  'new_match',
  'new_message',
  'story_view',
  'like',
  'profile_like'
);