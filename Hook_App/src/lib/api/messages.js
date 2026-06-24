import { supabase } from '../supabase';

export async function getThreads(userId) {
  const { data, error } = await supabase
    .from('threads')
    .select(`
      *,
      profiles!threads_participant1_id_fkey(name, avatar_url),
      profiles!threads_participant2_id_fkey(name, avatar_url),
      messages(count)
    `)
    .or(`participant1_id.eq.${userId},participant2_id.eq.${userId}`)
    .order('updated_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function getMessages(threadId) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('thread_id', threadId)
    .order('created_at', { ascending: true });
  
  if (error) throw error;
  return data;
}

export async function sendMessage(threadId, senderId, content) {
  const { error } = await supabase
    .from('messages')
    .insert({
      thread_id: threadId,
      sender_id: senderId,
      content
    });
  
  if (error) throw error;
}

export async function createThread(participant1Id, participant2Id) {
  const { data, error } = await supabase
    .from('threads')
    .insert({
      participant1_id: participant1Id,
      participant2_id: participant2Id
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}
