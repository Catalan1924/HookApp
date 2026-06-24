import { supabase } from '../supabase';

export async function getMatches(userId) {
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function getMatchedProfiles(userId) {
  const { data, error } = await supabase
    .rpc('get_matched_profiles', { current_user_id: userId });
  
  if (error) throw error;
  return data;
}
