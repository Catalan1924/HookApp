alter table story_views enable row level security;
create policy "story_views: insert"
on story_views for insert
with check (auth.uid() = viewer_id);
create policy "story_views: select own story"
on story_views for select
using (
exists (
select 1 from stories
where stories.id = story_views.story_id
and stories.user_id = auth.uid()
)
);