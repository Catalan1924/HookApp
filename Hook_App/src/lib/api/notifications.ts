import { supabase } from '../supabase'

export interface AppNotification {
  id: string
  user_id: string
  type: string
  payload: Record<string, any> | null
  read_at: string | null
  created_at: string
}

export async function getNotifications(userId: string, limit = 50): Promise<AppNotification[]> {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error || !data) return []
  return data as any[]
}

export async function getUnreadCount(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .is('read_at', null)
  if (error) return 0
  return count || 0
}

export async function markAsRead(notificationId: string): Promise<void> {
  await supabase.from('notifications').update({ read_at: new Date().toISOString() } as any).eq('id', notificationId)
}

export async function markAllAsRead(userId: string): Promise<void> {
  await supabase.from('notifications').update({ read_at: new Date().toISOString() } as any).eq('user_id', userId).is('read_at', null)
}
