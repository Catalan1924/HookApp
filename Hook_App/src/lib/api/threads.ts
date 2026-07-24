import { supabase } from '../supabase'
import type { Message } from './messages'

export interface ThreadWithPartner {
  id: string
  status: string
  message_count: number
  updated_at: string
  created_at: string
  partner_id: string
  partner_name: string | null
  partner_avatar: string | null
  partner_uni: string | null
  last_message: string | null
  last_message_time: string | null
  last_sender_id: string | null
  unread: boolean
}

export async function getThreads(userId: string): Promise<ThreadWithPartner[]> {
  const { data: threads, error } = await supabase
    .from('threads')
    .select('*')
    .or(`user_a.eq.${userId},user_b.eq.${userId}`)
    .order('updated_at', { ascending: false })

  if (error || !threads) return []

  const rows = threads as any[]
  const partnerIds = rows.map((t: any) => (t.user_a === userId ? t.user_b : t.user_a)).filter(Boolean)

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url, university_id')
    .in('id', partnerIds)

  const profileMap = new Map((profiles || []).map((p: any) => [p.id, p]))

  const threadIds = rows.map((t: any) => t.id)
  const { data: lastMessages } = await supabase
    .from('messages')
    .select('id, thread_id, sender_id, content, created_at')
    .in('thread_id', threadIds)

  const lastMsgMap = new Map<string, { content: string; created_at: string; sender_id: string }>()
  if (lastMessages) {
    const grouped: Record<string, { content: string; created_at: string; sender_id: string }[]> = {}
    for (const m of lastMessages as any[]) {
      if (!grouped[m.thread_id]) grouped[m.thread_id] = []
      grouped[m.thread_id].push(m)
    }
    for (const [tid, msgs] of Object.entries(grouped)) {
      msgs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      lastMsgMap.set(tid, msgs[0])
    }
  }

  return rows.map((t: any) => {
    const partnerId = t.user_a === userId ? t.user_b : t.user_a
    const profile = profileMap.get(partnerId)
    const lastMsg = lastMsgMap.get(t.id)
    return {
      id: t.id,
      status: t.status,
      message_count: t.message_count,
      updated_at: t.updated_at,
      created_at: t.created_at,
      partner_id: partnerId,
      partner_name: profile?.full_name || 'Unknown',
      partner_avatar: profile?.avatar_url || null,
      partner_uni: profile?.university_id || null,
      last_message: lastMsg?.content || null,
      last_message_time: lastMsg?.created_at || null,
      last_sender_id: lastMsg?.sender_id || null,
      unread: lastMsg ? lastMsg.sender_id !== userId : false,
    }
  })
}

export async function getOrCreateThread(currentUserId: string, otherUserId: string): Promise<any | null> {
  const { data: existing } = await supabase
    .from('threads')
    .select('*')
    .or(`and(user_a.eq.${currentUserId},user_b.eq.${otherUserId}),and(user_a.eq.${otherUserId},user_b.eq.${currentUserId})`)
    .maybeSingle()

  if (existing) return existing

  const { data: created, error: createErr } = await supabase
    .from('threads')
    .insert({ user_a: currentUserId, user_b: otherUserId, status: 'pending', message_count: 0 } as any)
    .select()
    .single()

  if (createErr) return null
  return created
}

export async function getPartnerProfile(threadId: string, currentUserId: string) {
  const { data: thread } = await supabase
    .from('threads')
    .select('user_a, user_b')
    .eq('id', threadId)
    .single()

  if (!thread) return null

  const t = thread as any
  const partnerId = t.user_a === currentUserId ? t.user_b : t.user_a

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url, university_id, bio, age, interests')
    .eq('id', partnerId)
    .single()

  return profile
}
