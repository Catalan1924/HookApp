import { useState, useEffect } from 'react'
import { MessageCircle, Shield, Heart } from 'lucide-react'
import { motion } from 'motion/react'
import { useAuth } from '../../contexts/AuthContext'
import { getMatchedProfiles } from '../../lib/api/matches'

// ── Mock data ──
const MOCK_MATCHES: any[] = [
  {
    user_id: 'amara',
    full_name: 'Amara',
    avatar_url: 'https://images.unsplash.com/photo-1770283553838-769c5f97d55c?w=120&h=120&fit=crop&auto=format',
    university_name: 'UoN',
    thread_id: 't-amara',
    lastSeen: 'Online now',
    matchNote: 'She replied to your message 💘',
  },
]

interface MatchesTabProps {
  onOpenChat: (userId: string, userName?: string, userAvatar?: string) => void
  onViewProfile: (userId: string) => void
}

export function MatchesTab({ onOpenChat, onViewProfile }: MatchesTabProps) {
  const { user } = useAuth()
  const [matches, setMatches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    getMatchedProfiles()
      .then((data) => {
        if (data.length > 0) {
          setMatches(data.map((m) => ({ ...m, lastSeen: 'Recently', matchNote: 'You matched!' })))
        } else {
          setMatches(MOCK_MATCHES)
        }
      })
      .catch(() => setMatches(MOCK_MATCHES))
      .finally(() => setLoading(false))
  }, [user])

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
          className="w-7 h-7 rounded-full"
          style={{ background: 'linear-gradient(135deg,#8B1A2E,#C0395A)' }}
        />
      </div>
    )
  }

  if (matches.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          className="text-6xl mb-5"
        >
          💔
        </motion.div>
        <h3 className="font-black text-foreground text-xl mb-2" style={{ fontFamily: 'Nunito, sans-serif' }}>
          No matches yet
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Send a DM to someone you like from Discover. When they reply — it's a match! 💃
        </p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <div className="px-4 pt-5 pb-3">
        <h2 className="font-black text-foreground text-xl" style={{ fontFamily: 'Nunito, sans-serif' }}>
          Your Matches 💑
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          {matches.length} match{matches.length !== 1 ? 'es' : ''} — it's getting real
        </p>
      </div>

      {/* New match highlight */}
      <div
        className="mx-4 mb-5 rounded-3xl overflow-hidden relative"
        style={{ background: 'linear-gradient(135deg,#8B1A2E,#C0395A,#E86A8F)' }}
      >
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full -translate-y-1/2 translate-x-1/4 opacity-20 bg-white" />
        <div className="relative z-10 p-5">
          <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-3">💫 New match</p>
          {matches.slice(0, 1).map((match) => (
            <div key={match.user_id} className="flex items-center gap-4">
              <div className="relative">
                {match.avatar_url ? (
                  <img
                    src={match.avatar_url}
                    alt={match.full_name || ''}
                    className="w-16 h-16 rounded-full object-cover"
                    style={{ border: '3px solid rgba(255,255,255,0.5)' }}
                    loading="lazy"
                  />
                ) : (
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl"
                    style={{ border: '3px solid rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.2)' }}
                  >
                    {(match.full_name || '?').charAt(0)}
                  </div>
                )}
                <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-green-400 border-2 border-white" />
              </div>
              <div className="flex-1 text-white">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-black text-lg" style={{ fontFamily: 'Nunito, sans-serif' }}>
                    {match.full_name}
                  </span>
                  {match.university_name && (
                    <span className="flex items-center gap-1 bg-white/20 rounded-full px-2 py-0.5 text-[10px] font-bold">
                      <Shield size={8} />
                      {match.university_name}
                    </span>
                  )}
                </div>
                <p className="text-white/70 text-xs">{match.matchNote}</p>
                <p className="text-white/50 text-xs">{match.lastSeen}</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={() => onOpenChat(match.user_id, match.full_name || '', match.avatar_url || '')}
                className="w-12 h-12 rounded-full flex items-center justify-center bg-white shadow-lg"
              >
                <MessageCircle size={20} style={{ color: '#8B1A2E' }} />
              </motion.button>
            </div>
          ))}
        </div>
      </div>

      {/* All matches grid */}
      {matches.length > 1 && (
        <div className="px-4 pb-8">
          <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-3">
            All matches
          </p>
          <div className="grid grid-cols-2 gap-3">
            {matches.map((match) => (
              <motion.button
                key={match.user_id}
                whileTap={{ scale: 0.95 }}
                onClick={() => onViewProfile(match.user_id)}
                className="rounded-2xl overflow-hidden relative aspect-[3/4] bg-gray-100"
              >
                {match.avatar_url ? (
                  <img
                    src={match.avatar_url}
                    alt={match.full_name || ''}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white font-bold text-3xl" style={{ background: 'linear-gradient(135deg,#8B1A2E,#C0395A)' }}>
                    {(match.full_name || '?').charAt(0)}
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 p-3" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }}>
                  <p className="text-white font-black text-sm" style={{ fontFamily: 'Nunito, sans-serif' }}>
                    {match.full_name}
                  </p>
                  {match.university_name && (
                    <p className="text-white/70 text-xs">{match.university_name}</p>
                  )}
                </div>
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    onOpenChat(match.user_id, match.full_name || '', match.avatar_url || '')
                  }}
                  className="absolute top-2 right-2 w-9 h-9 rounded-full flex items-center justify-center bg-white shadow-md"
                >
                  <MessageCircle size={15} style={{ color: '#8B1A2E' }} />
                </motion.button>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="mx-4 rounded-2xl p-4 flex gap-3 items-start mb-8" style={{ background: '#faf0f2' }}>
        <Heart size={18} fill="#E86A8F" color="#E86A8F" className="flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-sm text-foreground mb-0.5" style={{ fontFamily: 'Nunito, sans-serif' }}>
            How matching works
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Send up to 5 messages to anyone from Discover. If they reply, you match! Simple as that. No swiping — real conversations first. 💕
          </p>
        </div>
      </div>
    </div>
  )
}
