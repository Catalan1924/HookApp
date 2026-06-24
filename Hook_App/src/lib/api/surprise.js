import { supabase } from '../supabase';

export async function getSurpriseProfile(userId) {
  // Get a random profile that's not the current user
  const { data, error } = await supabase
    .rpc('get_random_profile', { exclude_user_id: userId })
    .single();
  
  if (error) throw error;
  return data;
}

export async function acceptSurprise(userId, matchedUserId) {
  const { error } = await supabase
    .from('surprise')
    .insert({ user_id: userId, matched_user_id: matchedUserId });
  
  if (error) throw error;
}

export async function skipSurprise(userId, skippedUserId) {
  const { error } = await supabase
    .from('surprise_queue')
    .insert({ user_id: userId, skipped_user_id: skippedUserId });
  
  if (error) throw error;
}
