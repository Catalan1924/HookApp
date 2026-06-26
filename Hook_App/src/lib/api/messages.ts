import { supabase } from '../supabase'

export interface Message {
  id: string
  thread_id: string
  sender_id: string
  content: string
  created_at: string
  from: 'me' | 'them'
}

export async function getMessages(threadId: string, currentUserId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('thread_id', threadId)
    .order('created_at', { ascending: true })

  if (error || !data) return []

  return (data as any[]).map((m: any) => ({
    id: m.id,
    thread_id: m.thread_id,
    sender_id: m.sender_id,
    content: m.content,
    created_at: m.created_at,
    from: m.sender_id === currentUserId ? 'me' : 'them',
  }))
}

export async function sendMessage(threadId: string, senderId: string, content: string): Promise<Message | null> {
  const { data, error } = await supabase
    .from('messages')
    .insert({ thread_id: threadId, sender_id: senderId, content } as any)
    .select()
    .single()

  if (error || !data) return null

  const m = data as any
  return {
    id: m.id,
    thread_id: m.thread_id,
    sender_id: m.sender_id,
    content: m.content,
    created_at: m.created_at,
    from: 'me',
  }
}

export function subscribeToMessages(
  threadId: string,
  onMessage: (msg: Message, currentUserId: string) => void,
  currentUserId: string
): () => void {
  const channel = supabase
    .channel(`thread:${threadId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `thread_id=eq.${threadId}`,
      },
      (payload: any) => {
        const newMsg = payload.new
        if (newMsg.sender_id !== currentUserId) {
          onMessage(
            {
              id: newMsg.id,
              thread_id: newMsg.thread_id,
              sender_id: newMsg.sender_id,
              content: newMsg.content,
              created_at: newMsg.created_at,
              from: 'them',
            },
            currentUserId
          )
        }
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}
