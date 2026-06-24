import { supabase } from '../supabase';

export async function getPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('*, profiles(name, avatar_url, university_id)')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function likePost(postId, userId) {
  const { error } = await supabase
    .from('posts_like')
    .insert({ post_id: postId, user_id: userId });
  
  if (error) throw error;
}

export async function unlikePost(postId, userId) {
  const { error } = await supabase
    .from('posts_like')
    .delete()
    .match({ post_id: postId, user_id: userId });
  
  if (error) throw error;
}
