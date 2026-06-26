import { useState, useEffect, useRef, useCallback } from 'react'
import { ArrowLeft, Send, Lock } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { useAuth } from '../../contexts/AuthContext'
import { getMessages, sendMessage, subscribeToMessages, type Message } from '../../lib/api/messages'
import { getPartnerProfile, getOrCreateThread } from '../../lib/api/threads'

// ── Mock fallback data (used when Supabase is not configured) ──
const MOCK_MESSAGES: Record<string, Message[]> = {
  amara: [
    { id: '1', thread_id: 't1', sender_id: 'me', content: 'Hey Amara! Your debate club post was amazing 💪', created_at: '10:30', from: 'me' },
    { id: '2', thread_id: 't1', sender_id: 'them', content: 'Thank you so much! Are you into debates too?', created_at: '10:32', from: 'them' },
    { id: '3', thread_id: 't1', sender_id: 'me', content: 'Kind of! I love a good argument 😄', created_at: '10:33', from: 'me' },
    { id: '4', thread_id: 't1', sender_id: 'them', content: 'Haha yes definitely! When are you free? 😊', created_at: '10:35', from: 'them' },
  ],
}

interface ChatScreenProps {
  /** If provided, opens chat for this specific thread */
  threadId?: string
  /** If provided (and no threadId), finds or creates a thread with this user */
  userId?: string
  /** The display name of the chat partner */
  partnerName?: string
  /** The avatar URL of the chat partner */
  partnerAvatar?: string
  /** Status of the thread */
  threadStatus?: 'active' | 'pending'
  /** Messages left for pending threads */
  messagesLeft?: number
  /** Close the chat and go back */
  onBack: () => void
  /** Called when user taps partner's name/avatar */
  onViewProfile?: (userId: string) => void
}

export function ChatScreen({
  threadId: initialThreadId,
  userId,
  partnerName: initialPartnerName,
  partnerAvatar: initialPartnerAvatar,
  threadStatus: initialThreadStatus,
  messagesLeft: initialMessagesLeft,
  onBack,
  onViewProfile,
}: ChatScreenProps) {
  const { user } = useAuth()
  const [threadId, setThreadId] = useState<string | null>(initialThreadId || null)
  const [partnerName, setPartnerName] = useState(initialPartnerName || 'Chat')
  const [partnerAvatar, setPartnerAvatar] = useState(initialPartnerAvatar || '')
  const [partnerId, setPartnerId] = useState<string | null>(userId || null)
  const [threadStatus, setThreadStatus] = useState<'active' | 'pending'>(
    initialThreadStatus === 'active' ? 'active' : 'pending'
  )
  const [messagesLeft, setMessagesLeft] = useState(initialMessagesLeft ?? 5)
  const [messages, setMessages] = useState<Message[]>([])
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // ── Initialize thread ──
  useEffect(() => {
    if (!user) return

    async function init() {
      setLoading(true)
      try {
        let tid = initialThreadId || null

        // If no threadId but we have a userId, find or create a thread
        if (!tid && userId && userId !== user!.id) {
          const thread = await getOrCreateThread(user!.id, userId)
          if (thread) {
            tid = thread.id
            setThreadId(tid)
            setThreadStatus(thread.status === 'matched' ? 'active' : 'pending')
            setMessagesLeft(5 - thread.message_count)
          }
        }

        if (tid) {
          setThreadId(tid)
          // Fetch partner info
          const profile = await getPartnerProfile(tid, user!.id)
          if (profile) {
            const p = profile as any
            setPartnerName(p.full_name || 'Unknown')
            setPartnerAvatar(p.avatar_url || '')
            setPartnerId(p.id)
          }
          // Fetch messages
          const msgs = await getMessages(tid, user!.id)
          if (msgs.length > 0) {
            setMessages(msgs)
          } else {
            // Fallback: use mock data
            const mockKey = (initialPartnerName || userId || '').toLowerCase()
            setMessages(MOCK_MESSAGES[mockKey] || [])
          }
        } else {
          // No thread yet — use mock data
          const mockKey = (initialPartnerName || userId || '').toLowerCase()
          setMessages(MOCK_MESSAGES[mockKey] || [])
        }
      } catch (err) {
        console.error('ChatScreen init error:', err)
        // Use mock data as fallback
        const mockKey = (initialPartnerName || userId || '').toLowerCase()
        setMessages(MOCK_MESSAGES[mockKey] || [])
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [user, initialThreadId, userId])

  // ── Realtime subscription ──
  useEffect(() => {
    if (!threadId || !user) return
    const unsub = subscribeToMessages(threadId, (newMsg) => {
      setMessages((prev) => [...prev, newMsg])
    }, user.id)
    return () => unsub()
  }, [threadId, user])

  // ── Auto-scroll to bottom ──
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // ── Send message ──
  const handleSend = useCallback(async () => {
    const trimmed = draft.trim()
    if (!trimmed) return
    if (!user) return

    // Check message limit for pending threads
    if (threadStatus === 'pending' && messagesLeft <= 0) return

    // Optimistic add
    const optimistic: Message = {
      id: `temp-${Date.now()}`,
      thread_id: threadId || 'temp',
      sender_id: user.id,
      content: trimmed,
      created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      from: 'me',
    }
    setMessages((prev) => [...prev, optimistic])
    setDraft('')
    if (threadStatus === 'pending') setMessagesLeft((m) => m - 1)

    // Actually send via API
    if (threadId) {
      await sendMessage(threadId, user.id, trimmed)
    }
  }, [draft, user, threadId, threadStatus, messagesLeft])

  const frozen = threadStatus === 'pending' && messagesLeft <= 0

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Chat header */}
      <div
        className="flex items-center gap-3 px-4 py-3 border-b shrink-0"
        style={{
          borderColor: 'rgba(139,26,46,0.08)',
          background: 'rgba(253,252,251,0.97)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <button onClick={onBack} className="text-muted-foreground p-1" aria-label="Go back">
          <ArrowLeft size={22} />
        </button>
        <button
          onClick={() => partnerId && onViewProfile?.(partnerId)}
          className="relative shrink-0"
        >
          {partnerAvatar ? (
            <img src={partnerAvatar} alt={partnerName} className="w-10 h-10 rounded-full object-cover" loading="lazy" />
          ) : (
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ background: 'linear-gradient(135deg,#8B1A2E,#C0395A)' }}>
              {partnerName.charAt(0)}
            </div>
          )}
          {threadStatus === 'active' && (
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-400 border-2 border-background" />
          )}
        </button>
        <div className="flex-1" onClick={() => partnerId && onViewProfile?.(partnerId)}>
          <p className="font-black text-foreground" style={{ fontFamily: 'Nunito, sans-serif' }}>
            {partnerName}
          </p>
          {threadStatus === 'active' && (
            <p className="text-xs text-green-500 font-semibold">Online now 💚</p>
          )}
          {threadStatus === 'pending' && (
            <p className="text-xs text-muted-foreground">Pending reply</p>
          )}
        </div>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2.5"
        style={{ background: '#fdfcfb' }}
      >
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
              className="w-8 h-8 rounded-full"
              style={{ background: 'linear-gradient(135deg,#8B1A2E,#C0395A)' }}
            />
          </div>
        ) : (
          <>
            <AnimatePresence>
              {messages.map((m, i) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.02, 0.3) }}
                  className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className="max-w-[75%] px-4 py-2.5 rounded-3xl text-sm"
                    style={
                      m.from === 'me'
                        ? {
                            background: 'linear-gradient(135deg,#8B1A2E,#C0395A)',
                            color: 'white',
                            borderBottomRightRadius: 6,
                          }
                        : {
                            background: '#f0e8ea',
                            color: '#1A1A1A',
                            borderBottomLeftRadius: 6,
                          }
                    }
                  >
                    <p>{m.content}</p>
                    <p className="text-[10px] mt-0.5 opacity-60">{m.created_at}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {frozen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl mt-2"
                style={{ background: '#f4f0f1' }}
              >
                <Lock size={13} className="text-muted-foreground" />
                <p className="text-xs text-muted-foreground text-center">
                  You've sent 5 messages. Waiting for their reply to unlock chat.
                </p>
              </motion.div>
            )}

            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div
        className="px-4 py-3 border-t shrink-0"
        style={{
          borderColor: 'rgba(139,26,46,0.08)',
          background: 'rgba(253,252,251,0.97)',
          paddingBottom: 'env(safe-area-inset-bottom, 12px)',
        }}
      >
        {frozen ? (
          <div className="py-3 text-center text-sm font-semibold text-muted-foreground flex items-center justify-center gap-2">
            <Lock size={14} />
            Waiting for {partnerName} to reply
          </div>
        ) : (
          <div className="flex gap-2 items-center">
            {threadStatus === 'pending' && messagesLeft > 0 && (
              <span
                className="text-xs font-bold whitespace-nowrap px-2 py-1 rounded-full"
                style={{ background: '#f0e8ea', color: '#8B1A2E' }}
              >
                {messagesLeft} left
              </span>
            )}
            <input
              ref={inputRef}
              className="flex-1 rounded-full px-4 py-2.5 text-sm outline-none text-foreground"
              style={{ background: '#f0e8ea' }}
              placeholder="Message…"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend()
              }}
            />
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={handleSend}
              disabled={!draft.trim()}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0 disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg,#8B1A2E,#C0395A)' }}
            >
              <Send size={15} />
            </motion.button>
          </div>
        )}
      </div>
    </div>
  )
}
