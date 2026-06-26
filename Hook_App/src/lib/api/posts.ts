import { supabase } from '../supabase'

export async function createPost(userId: string, caption: string, media: { url: string; type: string }[], audience = 'everyone'): Promise<any | null> {
  const { data, error } = await supabase
    .from('posts')
    .insert({ user_id: userId, type: media.length > 1 ? 'gallery' : 'photo', media: media as any, caption: caption || null, audience } as any)
    .select()
    .single()
  if (error || !data) return null
  return data
}

export async function getPosts(currentUserId: string, limit = 20, offset = 0): Promise<any[]> {
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (!posts || posts.length === 0) return []

  const rows = posts as any[]
  const userIds = [...new Set(rows.map((p: any) => p.user_id))]
  const { data: profiles } = await supabase.from('profiles').select('id, full_name, avatar_url, university_id').in('id', userIds)
  const profileMap = new Map((profiles || []).map((p: any) => [p.id, p]))

  const postIds = rows.map((p: any) => p.id)
  const { data: myLikes } = await supabase.from('posts_like').select('post_id').eq('user_id', currentUserId).in('post_id', postIds)
  const likedSet = new Set((myLikes || []).map((l: any) => l.post_id))

  return rows.map((p: any) => {
    const profile = profileMap.get(p.user_id)
    return {
      ...p,
      user_full_name: profile?.full_name || 'Unknown',
      user_avatar: profile?.avatar_url || null,
      user_uni: profile?.university_id || null,
      liked: likedSet.has(p.id),
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
