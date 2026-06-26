import { useState, useEffect } from 'react'
import { Lock } from 'lucide-react'
import { motion } from 'motion/react'
import { useAuth } from '../../contexts/AuthContext'
import { getThreads, type ThreadWithPartner } from '../../lib/api/threads'
import { ChatScreen } from './ChatScreen'

// ── Mock fallback data ──
const MOCK_THREADS: ThreadWithPartner[] = [
  {
    id: 't-amara', status: 'active', message_count: 3,
    updated_at: new Date().toISOString(), created_at: new Date().toISOString(),
    partner_id: 'amara', partner_name: 'Amara',
    partner_avatar: 'https://images.unsplash.com/photo-1770283553838-769c5f97d55c?w=64&h=64&fit=crop&auto=format',
    partner_uni: 'UoN', last_message: 'Haha yes definitely! When are you free? 😊',
    last_message_time: '2m', last_sender_id: 'them', unread: true,
  },
  {
    id: 't-zawadi', status: 'pending', message_count: 1,
    updated_at: new Date(Date.now() - 3600000).toISOString(), created_at: new Date().toISOString(),
    partner_id: 'zawadi', partner_name: 'Zawadi',
    partner_avatar: 'https://images.unsplash.com/photo-1606416132922-22ab37c1231e?w=64&h=64&fit=crop&auto=format',
    partner_uni: 'JKUAT', last_message: 'You: Hey! Saw your post about engineering week 🚀',
    last_message_time: '1h', last_sender_id: 'me', unread: false,
  },
  {
    id: 't-kofi', status: 'pending', message_count: 5,
    updated_at: new Date(Date.now() - 10800000).toISOString(), created_at: new Date().toISOString(),
    partner_id: 'kofi', partner_name: 'Kofi',
    partner_avatar: 'https://images.unsplash.com/photo-1694175271713-a6e2cc378980?w=64&h=64&fit=crop&auto=format',
    partner_uni: 'Strathmore', last_message: 'You: Love the entrepreneurship mindset! Would love to chat',
    last_message_time: '3h', last_sender_id: 'me', unread: false,
  },
]

interface DMsTabProps {
  onViewProfile?: (userId: string) => void
}

export function DMsTab({ onViewProfile }: DMsTabProps) {
  const { user } = useAuth()
  const [threads, setThreads] = useState<ThreadWithPartner[]>([])
  const [activeThread, setActiveThread] = useState<ThreadWithPartner | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    getThreads(user.id)
      .then((data) => {
        if (data.length > 0) {
          setThreads(data)
        } else {
          setThreads(MOCK_THREADS)
        }
      })
      .catch(() => setThreads(MOCK_THREADS))
      .finally(() => setLoading(false))
  }, [user])

  // ── Render chat screen when a thread is active ──
  if (activeThread) {
    const msgsLeft = Math.max(0, 5 - activeThread.message_count)

    return (
      <ChatScreen
        threadId={activeThread.id}
        userId={activeThread.partner_id}
        partnerName={activeThread.partner_name || 'Unknown'}
        partnerAvatar={activeThread.partner_avatar || ''}
        threadStatus={activeThread.status === 'active' ? 'active' : 'pending'}
        messagesLeft={msgsLeft}
        onBack={() => setActiveThread(null)}
        onViewProfile={onViewProfile}
      />
    )
  }

  const activeThreads = threads.filter((t) => t.status === 'active')
  const pendingThreads = threads.filter((t) => t.status === 'pending')

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 pt-5 pb-3">
        <h2 className="font-black text-foreground text-xl" style={{ fontFamily: 'Nunito, sans-serif' }}>
          Messages 💬
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">Your convos with campus matches</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
            className="w-7 h-7 rounded-full"
            style={{ background: 'linear-gradient(135deg,#8B1A2E,#C0395A)' }}
          />
        </div>
      ) : (
        <>
          {activeThreads.length > 0 && (
            <div className="mb-2">
              <p className="px-4 pt-2 pb-2 text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                Matched 💚
              </p>
              {activeThreads.map((thread) => (
                <ThreadRow key={thread.id} thread={thread} onClick={() => setActiveThread(thread)} />
              ))}
            </div>
          )}

          {pendingThreads.length > 0 && (
            <div>
              <p className="px-4 pt-2 pb-2 text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                Waiting for reply
              </p>
              {pendingThreads.map((thread) => (
                <ThreadRow key={thread.id} thread={thread} onClick={() => setActiveThread(thread)} />
              ))}
            </div>
          )}

          {threads.length === 0 && !loading && (
            <EmptyDMs />
          )}
        </>
      )}
    </div>
  )
}

function ThreadRow({ thread, onClick }: { thread: ThreadWithPartner; onClick: () => void }) {
  const frozen = thread.status === 'pending' && thread.message_count >= 5
  const msgsLeft = Math.max(0, 5 - thread.message_count)

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-secondary active:bg-secondary transition-colors"
      aria-label={`Chat with ${thread.partner_name}`}
    >
      <div className="relative flex-shrink-0">
        {thread.partner_avatar ? (
          <img src={thread.partner_avatar} alt={thread.partner_name || ''} className="w-14 h-14 rounded-full object-cover" loading="lazy" />
        ) : (
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg" style={{ background: 'linear-gradient(135deg,#8B1A2E,#C0395A)' }}>
            {(thread.partner_name || '?').charAt(0)}
          </div>
        )}
        {thread.status === 'active' && (
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-green-400 border-2 border-background" />
        )}
        {frozen && (
          <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full flex items-center justify-center bg-background border border-border">
            <Lock size={10} className="text-muted-foreground" />
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center justify-between mb-0.5">
          <span className="font-black text-foreground" style={{ fontFamily: 'Nunito, sans-serif' }}>
            {thread.partner_name}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatTime(thread.last_message_time)}
          </span>
        </div>
        <p className="text-sm text-muted-foreground truncate">{thread.last_message || 'No messages yet'}</p>
        {thread.status === 'pending' && msgsLeft > 0 && msgsLeft < 5 && (
          <p className="text-xs font-bold mt-0.5" style={{ color: '#E6B422' }}>
            {msgsLeft} message{msgsLeft !== 1 ? 's' : ''} left
          </p>
        )}
        {frozen && (
          <p className="text-xs text-muted-foreground mt-0.5 italic">Waiting for reply…</p>
        )}
      </div>
      {thread.unread && (
        <span
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,#8B1A2E,#C0395A)' }}
        />
      )}
    </motion.button>
  )
}

function EmptyDMs() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center px-8 py-16 text-center"
    >
      <div className="text-6xl mb-5">💌</div>
      <h3 className="font-black text-foreground text-xl mb-2" style={{ fontFamily: 'Nunito, sans-serif' }}>
        No messages yet
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        Send a message to someone from Discover to start a conversation! When they reply, you match. 💕
      </p>
    </motion.div>
  )
}

function formatTime(timestamp: string | null): string {
  if (!timestamp) return ''
  // If it's a relative time string like "2m", "1h", return as-is
  if (/^\d+[mhd]$/.test(timestamp)) return timestamp
  // Otherwise format the date
  try {
    const d = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffMin = Math.floor(diffMs / 60000)
    if (diffMin < 60) return `${diffMin}m`
    const diffHr = Math.floor(diffMin / 60)
    if (diffHr < 24) return `${diffHr}h`
    const diffDay = Math.floor(diffHr / 24)
    return `${diffDay}d`
  } catch {
    return timestamp
  }
}
