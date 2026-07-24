import { useState, useEffect } from 'react'
import { ArrowLeft, Shield, MessageCircle, Heart } from 'lucide-react'
import { motion } from 'motion/react'
import { getProfile, likeProfile } from '../../lib/api/profiles'

// ── Mock profiles fallback ──
const MOCK_PROFILES: Record<string, any> = {
  amara: {
    id: 'amara', full_name: 'Amara', university_id: 'UoN', age: 21,
    avatar_url: 'https://images.unsplash.com/photo-1770283553838-769c5f97d55c?w=180&h=180&fit=crop&auto=format',
    bio: '4th year Law. Coffee addict. Debate club champion. Looking for someone to explore Nairobi with 🌎',
    interests: ['Law', 'Coffee', 'Debate', 'Travel', 'Books'],
  },
  brian: {
    id: 'brian', full_name: 'Brian', university_id: 'KU', age: 22,
    avatar_url: 'https://images.unsplash.com/photo-1620829813573-7c9e1877706f?w=180&h=180&fit=crop&auto=format',
    bio: 'CS student by day, DJ by night. Building things that matter. Loves hiking Mt. Kenya 🏔️',
    interests: ['Tech', 'Music', 'Hiking', 'Gaming'],
  },
  zawadi: {
    id: 'zawadi', full_name: 'Zawadi', university_id: 'JKUAT', age: 20,
    avatar_url: 'https://images.unsplash.com/photo-1606416132922-22ab37c1231e?w=180&h=180&fit=crop&auto=format',
    bio: 'Engineering student. Loves Swahili poetry and weekend road trips.',
    interests: ['Engineering', 'Poetry', 'Road trips', 'Food'],
  },
  kofi: {
    id: 'kofi', full_name: 'Kofi', university_id: 'Strathmore', age: 23,
    avatar_url: 'https://images.unsplash.com/photo-1694175271713-a6e2cc378980?w=180&h=180&fit=crop&auto=format',
    bio: 'Business major. Entrepreneur. Side hustle in fashion. Always looking for the next big idea 💡',
    interests: ['Business', 'Fashion', 'Entrepreneurship', 'Football'],
  },
}

const MOCK_PHOTOS: Record<string, string[]> = {
  amara: [
    'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=200&h=240&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1565490129165-bd6a24996c25?w=200&h=240&fit=crop&auto=format',
  ],
  brian: [
    'https://images.unsplash.com/photo-1655720348590-c739c860beed?w=200&h=240&fit=crop&auto=format',
  ],
  zawadi: [
    'https://images.unsplash.com/photo-1755705152604-af6804fb8932?w=200&h=240&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1619512673224-91cfb2688284?w=200&h=240&fit=crop&auto=format',
  ],
  kofi: [
    'https://images.unsplash.com/photo-1685538362266-9f09f6b6cab5?w=200&h=240&fit=crop&auto=format',
  ],
}

const MOCK_PROMPTS: Record<string, string> = {
  amara: 'The one thing I\'d change about campus life is…',
  brian: 'My love language on campus is…',
  zawadi: 'I\'ll know we vibe if…',
  kofi: 'On a random Tuesday afternoon you\'ll find me…',
}

interface UserProfileProps {
  userId: string
  onBack: () => void
  onSendMessage: (userId: string) => void
  onOpenChat?: (userId: string, userName?: string, userAvatar?: string) => void
  onBlockReport?: (name: string, userId: string) => void
}

export function UserProfile({ userId, onBack, onSendMessage, onOpenChat, onBlockReport }: UserProfileProps) {
  const [profile, setProfile] = useState<any>(null)
  const [photos, setPhotos] = useState<string[]>([])
  const [liked, setLiked] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const key = userId.toLowerCase()
    getProfile(userId)
      .then((data) => {
        if (data) {
          setProfile(data)
          setPhotos(MOCK_PHOTOS[key] || [])
        } else {
          setProfile(MOCK_PROFILES[key] || { ...MOCK_PROFILES.amara, full_name: userId, id: userId })
          setPhotos(MOCK_PHOTOS[key] || [])
        }
      })
      .catch(() => {
        setProfile(MOCK_PROFILES[key] || { ...MOCK_PROFILES.amara, full_name: userId, id: userId })
        setPhotos(MOCK_PHOTOS[key] || [])
      })
      .finally(() => setLoading(false))
  }, [userId])

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

  if (!profile) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <p className="text-muted-foreground">User not found</p>
        <button onClick={onBack} className="mt-4 text-sm font-bold" style={{ color: '#8B1A2E' }}>Go back</button>
      </div>
    )
  }

  const name = profile.full_name || userId
  const avatar = profile.avatar_url || ''
  const uni = profile.university_id || 'University'
  const age = profile.age || 20
  const bio = profile.bio || 'CampusMatch student'
  const interests: string[] = profile.interests || []
  const prompt = MOCK_PROMPTS[userId.toLowerCase()] || ''

  const heroImage = photos[0] || avatar

  const handleHeart = () => {
    setLiked(true)
    likeProfile('me', userId).catch(() => {})
    setTimeout(() => setLiked(false), 1200)
  }

  return (
    <div className="flex-1 overflow-y-auto pb-28">
      {/* Hero image with overlay */}
      <div className="relative h-80 bg-gray-200">
        {heroImage ? (
          <img src={heroImage} alt={name} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white font-bold text-5xl" style={{ background: 'linear-gradient(160deg,#6A1B2A,#B5294A,#E86A8F)' }}>
            {name.charAt(0)}
          </div>
        )}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 30%, rgba(0,0,0,0.15) 70%, transparent)' }} />

        <button onClick={onBack} className="absolute top-5 left-4 bg-black/40 backdrop-blur-md rounded-full p-2.5 text-white" aria-label="Go back">
          <ArrowLeft size={18} />
        </button>

        {/* Name on image */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-black text-3xl leading-tight" style={{ fontFamily: 'Nunito, sans-serif' }}>
                {name}, {age}
              </h2>
              <div className="flex items-center gap-1.5 mt-1">
                <Shield size={13} className="opacity-80" />
                <span className="text-sm font-semibold opacity-80">{uni}</span>
                <span className="text-xs bg-white/20 backdrop-blur-sm rounded-full px-2 py-0.5 font-bold">Verified 💘</span>
              </div>
            </div>
            {avatar && (
              <img src={avatar} alt={name} className="w-16 h-16 rounded-2xl object-cover shadow-xl" style={{ border: '2px solid rgba(255,255,255,0.6)' }} loading="lazy" />
            )}
          </div>
        </div>
      </div>

      <div className="px-4 pt-5">
        {/* Bio */}
        <p className="text-[15px] text-foreground leading-relaxed mb-4">{bio}</p>

        {/* Prompt card */}
        {prompt && (
          <div className="rounded-2xl p-4 mb-5" style={{ background: 'linear-gradient(135deg,#faf0f2,#fff4e8)', border: '1.5px solid rgba(139,26,46,0.1)' }}>
            <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-2">💬 {name} says</p>
            <p className="text-sm font-semibold text-foreground italic">"{prompt}"</p>
          </div>
        )}

        {/* Interests */}
        {interests.length > 0 && (
          <div className="mb-5">
            <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-2.5">Interests</p>
            <div className="flex flex-wrap gap-2">
              {interests.map((tag: string) => (
                <span key={tag} className="px-3 py-1.5 rounded-full text-sm font-bold" style={{ background: '#f0e8ea', color: '#8B1A2E' }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Photos grid */}
        {photos.length > 1 && (
          <div className="mb-5">
            <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-2.5">More Photos</p>
            <div className="grid grid-cols-2 gap-2">
              {photos.slice(1).map((src, i) => (
                <img key={i} src={src} alt={`${name} photo`} className="w-full h-44 object-cover rounded-2xl" loading="lazy" />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 inset-x-0 px-4 pb-6 pt-4 flex gap-3" style={{ maxWidth: 390, margin: '0 auto', background: 'linear-gradient(to top, #fdfcfb 60%, transparent)' }}>
        <motion.button
          whileTap={{ scale: 0.93 }}
          className="flex-1 py-4 rounded-2xl font-black text-white flex items-center justify-center gap-2 shadow-lg"
          style={{ background: 'linear-gradient(135deg,#8B1A2E,#C0395A)', boxShadow: '0 6px 24px rgba(139,26,46,0.35)' }}
          onClick={() => {
            if (onOpenChat) {
              onOpenChat(userId, name, avatar)
            } else {
              onSendMessage(userId)
            }
          }}
        >
          <MessageCircle size={18} />
          Send Message
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.93 }}
          onClick={handleHeart}
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ background: '#f0e8ea' }}
        >
          <Heart size={22} color={liked ? '#EF4444' : '#8B1A2E'} fill={liked ? '#EF4444' : 'none'} />
        </motion.button>
      </div>
    </div>
  )
}
