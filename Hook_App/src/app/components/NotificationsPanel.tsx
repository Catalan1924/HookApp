import { useState, useEffect } from 'react'
import { Heart, MessageCircle, UserPlus, Sparkles, Bell, X } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { useAuth } from '../../contexts/AuthContext'
import { getNotifications, markAsRead, markAllAsRead, type AppNotification } from '../../lib/api/notifications'

// ── Mock notifications ──
const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1', user_id: 'me', type: 'match',
    payload: { from_name: 'Amara', from_id: 'amara', text: 'replied to your message' },
    read_at: null, created_at: new Date(Date.now() - 300000).toISOString(),
  },
  {
    id: 'n2', user_id: 'me', type: 'like',
    payload: { from_name: 'Brian', from_id: 'brian', text: 'liked your post' },
    read_at: null, created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'n3', user_id: 'me', type: 'message',
    payload: { from_name: 'Zawadi', from_id: 'zawadi', text: 'sent you a message' },
    read_at: new Date().toISOString(), created_at: new Date(Date.now() - 7200000).toISOString(),
  },
]

interface NotificationsPanelProps {
  open: boolean
  onClose: () => void
  onViewProfile?: (userId: string) => void
}

export function NotificationsPanel({ open, onClose, onViewProfile }: NotificationsPanelProps) {
  const { user } = useAuth()
  const [notifs, setNotifs] = useState<AppNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!user || !open) return
    getNotifications(user.id)
      .then((data) => {
        if (data.length > 0) {
          setNotifs(data)
          setUnreadCount(data.filter((n) => !n.read_at).length)
        } else {
          setNotifs(MOCK_NOTIFICATIONS)
          setUnreadCount(MOCK_NOTIFICATIONS.filter((n) => !n.read_at).length)
        }
      })
      .catch(() => {
        setNotifs(MOCK_NOTIFICATIONS)
        setUnreadCount(MOCK_NOTIFICATIONS.filter((n) => !n.read_at).length)
      })
  }, [user, open])

  const handleMarkAll = async () => {
    setNotifs((prev) => prev.map((n) => ({ ...n, read_at: n.read_at || new Date().toISOString() })))
    setUnreadCount(0)
    if (user) await markAllAsRead(user.id)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center" style={{ maxWidth: 390, margin: '0 auto' }}>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 360, damping: 32 }}
        className="relative z-10 w-full max-h-[70vh] rounded-t-3xl overflow-hidden flex flex-col"
        style={{ background: '#fdfcfb', boxShadow: '0 -8px 40px rgba(0,0,0,0.12)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b" style={{ borderColor: 'rgba(139,26,46,0.08)' }}>
          <div className="flex items-center gap-2">
            <Bell size={20} style={{ color: '#8B1A2E' }} />
            <h3 className="font-black text-foreground text-lg" style={{ fontFamily: 'Nunito, sans-serif' }}>
              Notifications
            </h3>
            {unreadCount > 0 && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background: 'linear-gradient(135deg,#8B1A2E,#C0395A)' }}>
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button onClick={handleMarkAll} className="text-xs font-bold" style={{ color: '#8B1A2E' }}>
                Mark all read
              </button>
            )}
            <button onClick={onClose} className="text-muted-foreground p-1">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {notifs.length === 0 ? (
            <div className="flex flex-col items-center py-16 px-8 text-center">
              <Bell size={40} className="text-muted-foreground mb-3 opacity-30" />
              <p className="text-sm font-bold text-muted-foreground" style={{ fontFamily: 'Nunito, sans-serif' }}>
                No notifications yet
              </p>
              <p className="text-xs text-muted-foreground mt-1">We'll let you know when something happens 💌</p>
            </div>
          ) : (
            <AnimatePresence>
              {notifs.map((n, i) => {
                const payload = n.payload as Record<string, any> | null
                const fromName = payload?.from_name || 'Someone'
                const fromId = payload?.from_id || ''
                const text = payload?.text || ''

                const IconEl =
                  n.type === 'match' ? UserPlus :
                  n.type === 'like' ? Heart :
                  n.type === 'message' ? MessageCircle :
                  Sparkles

                const iconColor =
                  n.type === 'match' ? '#8B1A2E' :
                  n.type === 'like' ? '#E86A8F' :
                  '#E6B422'

                return (
                  <motion.button
                    key={n.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => {
                      markAsRead(n.id)
                      setNotifs((prev) => prev.map((x) => x.id === n.id ? { ...x, read_at: new Date().toISOString() } : x))
                      if (fromId && onViewProfile) onViewProfile(fromId)
                    }}
                    className="w-full flex items-start gap-3 px-4 py-3.5 border-b hover:bg-secondary transition-colors text-left"
                    style={{
                      borderColor: 'rgba(139,26,46,0.05)',
                      background: n.read_at ? undefined : 'linear-gradient(90deg, rgba(139,26,46,0.04), transparent)',
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: `${iconColor}15` }}
                    >
                      <IconEl size={17} style={{ color: iconColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">
                        <span className="font-bold" style={{ fontFamily: 'Nunito, sans-serif' }}>{fromName}</span>{' '}
                        <span className="text-muted-foreground">{text}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatTime(n.created_at)}
                      </p>
                    </div>
                    {!n.read_at && (
                      <span className="w-2.5 h-2.5 rounded-full shrink-0 mt-2" style={{ background: 'linear-gradient(135deg,#8B1A2E,#C0395A)' }} />
                    )}
                  </motion.button>
                )
              })}
            </AnimatePresence>
          )}
        </div>
      </motion.div>
    </div>
  )
}

function formatTime(dateStr: string): string {
  try {
    const d = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffMin = Math.floor(diffMs / 60000)
    if (diffMin < 1) return 'Just now'
    if (diffMin < 60) return `${diffMin}m ago`
    const diffHr = Math.floor(diffMin / 60)
    if (diffHr < 24) return `${diffHr}h ago`
    return `${Math.floor(diffHr / 24)}d ago`
  } catch { return '' }
}
