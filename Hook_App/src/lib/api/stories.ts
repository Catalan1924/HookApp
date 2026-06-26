import { supabase } from '../supabase'

export async function getActiveStories(_currentUserId: string): Promise<any[]> {
  const { data: stories } = await supabase.from('active_stories_view').select('*')
  if (!stories) return []
  const rows = stories as any[]
  const userIds = [...new Set(rows.map((s: any) => s.user_id))]
  const { data: profiles } = await supabase.from('profiles').select('id, full_name, avatar_url').in('id', userIds)
  const profileMap = new Map((profiles || []).map((p: any) => [p.id, p]))
  return rows.map((s: any) => ({
    ...s,
    user_full_name: profileMap.get(s.user_id)?.full_name || 'Unknown',
    user_avatar: profileMap.get(s.user_id)?.avatar_url || null,
  }))
}

export async function viewStory(storyId: string, viewerId: string): Promise<void> {
  await supabase.from('story_views').insert({ story_id: storyId, viewer_id: viewerId } as any)
}
