import { supabase } from '../supabase'

export async function getMatchedProfiles(): Promise<any[]> {
  const { data, error } = await supabase.rpc('get_matched_profiles')
  if (error || !data) return []
  return data as any[]
}

export async function areMatched(userId1: string, userId2: string): Promise<boolean> {
  const { data } = await supabase
    .from('threads')
    .select('id, status')
    .or(`and(user_a.eq.${userId1},user_b.eq.${userId2}),and(user_a.eq.${userId2},user_b.eq.${userId1})`)
    .eq('status', 'matched')
    .maybeSingle()
  return !!data
}
