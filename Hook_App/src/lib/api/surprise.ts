import { supabase } from '../supabase'

export async function getSurpriseProfile(currentUserId: string): Promise<any | null> {
  const { data } = await supabase.rpc('get_random_profile', { current_user_id: currentUserId } as any)
  if (!data || (data as any[]).length === 0) {
    const { data: fallback } = await supabase.from('suggested_matches').select('*').limit(1).single()
    return fallback
  }
  return (data as any[])[0]
}

export async function joinSurpriseQueue(userId: string): Promise<boolean> {
  const { error } = await supabase.from('surprise_queue').insert({ user_id: userId, status: 'waiting' } as any)
  return !error
}

export async function leaveSurpriseQueue(userId: string): Promise<void> {
  await supabase.from('surprise_queue').delete().eq('user_id', userId).eq('status', 'waiting')
}

export async function saveSurpriseProfile(userId: string, savedUserId: string, sessionId?: string | null): Promise<boolean> {
  const { error } = await supabase.from('surprise_saves').insert({ user_id: userId, saved_user_id: savedUserId, session_id: sessionId || null } as any)
  return !error
}

export async function getSavedSurprises(userId: string): Promise<any[]> {
  const { data: saves } = await supabase.from('surprise_saves').select('saved_user_id').eq('user_id', userId)
  if (!saves || saves.length === 0) return []
  const ids = (saves as any[]).map((s) => s.saved_user_id)
  const { data: profiles } = await supabase.from('profiles').select('id, full_name, avatar_url, university_id').in('id', ids)
  return (profiles || []).map((p: any) => ({
    id: p.id,
    full_name: p.full_name,
    avatar_url: p.avatar_url,
    university_name: p.university_id,
  }))
}
