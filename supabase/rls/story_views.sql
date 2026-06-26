drop policy if exists "story_views: insert" on story_views;
drop policy if exists "story_views: select own story" on story_views;
drop policy if exists "story_views: deny update" on story_views;
drop policy if exists "story_views: deny delete" on story_views;

-- Users can record their own views on stories
create policy "story_views: insert"
  on story_views for insert
  with check (auth.uid() = viewer_id);

-- Story owners can see who viewed their stories
create policy "story_views: select own story"
  on story_views for select
  using (
    exists (
      select 1 from stories
      where stories.id = story_views.story_id
      and stories.user_id = auth.uid()
    )
  );

-- Disallow updates and deletes (view tracking is append-only)
create policy "story_views: deny update"
  on story_views for update
  using (false);

create policy "story_views: deny delete"
  on story_views for delete
  using (false);
