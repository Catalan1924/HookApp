import { supabase } from '../supabase'

export async function getProfile(userId: string): Promise<any> {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()
  if (error || !data) return null
  return data
}

export async function updateProfile(userId: string, updates: Record<string, unknown>): Promise<any> {
  const { data, error } = await supabase.from('profiles').update(updates as any).eq('id', userId).select().single()
  if (error || !data) return null
  return data
}

export async function uploadAvatar(userId: string, file: File): Promise<string | null> {
  const ext = file.name.split('.').pop() || 'jpg'
  const { error: uploadErr } = await supabase.storage.from('profile-pictures').upload(`${userId}/avatar.${ext}`, file, { upsert: true })
  if (uploadErr) return null
  const { data } = supabase.storage.from('profile-pictures').getPublicUrl(`${userId}/avatar.${ext}`)
  return data.publicUrl
}

export async function getSuggestedProfiles(): Promise<any[]> {
  const { data, error } = await supabase.from('suggested_matches').select('*').limit(20)
  if (error || !data) return []
  return data as any[]
}

export async function likeProfile(likerId: string, likedId: string): Promise<boolean> {
  const { error } = await supabase.from('profile_likes').insert({ liker_id: likerId, liked_id: likedId } as any)
  return !error
}
