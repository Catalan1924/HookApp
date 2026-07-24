import { supabase } from '../supabase'

export interface Post {
  id: string
  user_id: string
  user_name?: string
  user_uni?: string
  user_avatar?: string
  media: string[]
  caption: string
  mood: string
  liked: boolean
  created_at: string
}

export async function createPost(userId: string, caption: string, media: { url: string; type: string }[], audience = 'everyone'): Promise<any | null> {
  const { data, error } = await supabase
    .from('posts')
    .insert({ user_id: userId, type: media.length > 1 ? 'gallery' : 'photo', media: media as any, caption: caption || null, audience } as any)
    .select()
    .single()
  if (error || !data) return null
  return data
}

export async function getPosts(limit = 20, offset = 0, currentUserId?: string): Promise<Post[]> {
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error || !posts || posts.length === 0) return []

  const rows = posts as any[]
  const userIds = [...new Set(rows.map((p: any) => p.user_id))]
  const { data: profiles } = await supabase.from('profiles').select('id, full_name, avatar_url, university_id').in('id', userIds)
  const profileMap = new Map((profiles || []).map((p: any) => [p.id, p]))

  // Likes only if we have a current user
  let likedSet = new Set<string>()
  if (currentUserId) {
    const postIds = rows.map((p: any) => p.id)
    const { data: myLikes } = await supabase
      .from('posts_like')
      .select('post_id')
      .eq('user_id', currentUserId)
      .in('post_id', postIds)
    likedSet = new Set((myLikes || []).map((l: any) => l.post_id))
  }

  return rows.map((p: any) => {
    const profile = profileMap.get(p.user_id)
    const mediaArray = Array.isArray(p.media) ? p.media.map((m: any) => (typeof m === 'string' ? m : m.url)) : []
    return {
      id: p.id,
      user_id: p.user_id,
      user_name: profile?.full_name || 'Unknown',
      user_avatar: profile?.avatar_url || null,
      user_uni: profile?.university_id || null,
      media: mediaArray,
      caption: p.caption || '',
      mood: p.mood || '',
      liked: likedSet.has(p.id),
      created_at: p.created_at,
    }
  })
}

export async function likePost(postId: string, userId: string): Promise<boolean> {
  const { error } = await supabase.from('posts_like').insert({ post_id: postId, user_id: userId } as any)
  return !error
}

export async function unlikePost(postId: string, userId: string): Promise<boolean> {
  const { error } = await supabase.from('posts_like').delete().eq('post_id', postId).eq('user_id', userId)
  return !error
}

export async function uploadPostMedia(userId: string, file: File): Promise<string | null> {
  const ext = file.name.split('.').pop() || 'jpg'
  const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`
  const { error } = await supabase.storage.from('post-media').upload(`${userId}/${filename}`, file)
  if (error) return null
  const { data } = supabase.storage.from('post-media').getPublicUrl(`${userId}/${filename}`)
  return data.publicUrl
}
