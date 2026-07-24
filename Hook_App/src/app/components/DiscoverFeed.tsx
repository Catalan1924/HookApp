import { useState, useRef, useEffect, useCallback } from "react";
import { Heart, MoreVertical, ChevronLeft, ChevronRight, Shield, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";
import { getPosts, likePost, unlikePost, type Post } from "../../lib/api/posts";

// ── Mock fallback data ──
const STORIES = [
  { name: "You", avatar: "https://images.unsplash.com/photo-1578866161340-b6c1b0070ac2?w=64&h=64&fit=crop&auto=format", isMe: true },
  { name: "Amara", avatar: "https://images.unsplash.com/photo-1770283553838-769c5f97d55c?w=64&h=64&fit=crop&auto=format", active: true },
  { name: "Brian", avatar: "https://images.unsplash.com/photo-1620829813573-7c9e1877706f?w=64&h=64&fit=crop&auto=format", active: true },
  { name: "Zawadi", avatar: "https://images.unsplash.com/photo-1606416132922-22ab37c1231e?w=64&h=64&fit=crop&auto=format", active: false },
  { name: "Kofi", avatar: "https://images.unsplash.com/photo-1694175271713-a6e2cc378980?w=64&h=64&fit=crop&auto=format", active: true },
  { name: "Nia", avatar: "https://images.unsplash.com/photo-1578866161340-b6c1b0070ac2?w=64&h=64&fit=crop&auto=format", active: false },
];

const MOCK_POSTS: Post[] = [
  {
    id: "1",
    user_id: "amara",
    user_name: "Amara",
    user_uni: "UoN",
    user_avatar: "https://images.unsplash.com/photo-1770283553838-769c5f97d55c?w=64&h=64&fit=crop&auto=format",
    media: [
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=390&h=500&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1565490129165-bd6a24996c25?w=390&h=500&fit=crop&auto=format",
    ],
    caption: "Finals week but we stay smiling 😊",
    mood: "✨",
    liked: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    user_id: "brian",
    user_name: "Brian",
    user_uni: "KU",
    user_avatar: "https://images.unsplash.com/photo-1620829813573-7c9e1877706f?w=64&h=64&fit=crop&auto=format",
    media: ["https://images.unsplash.com/photo-1655720348590-c739c860beed?w=390&h=500&fit=crop&auto=format"],
    caption: "Group project mode 💪🏾",
    mood: "🎯",
    liked: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    user_id: "zawadi",
    user_name: "Zawadi",
    user_uni: "JKUAT",
    user_avatar: "https://images.unsplash.com/photo-1606416132922-22ab37c1231e?w=64&h=64&fit=crop&auto=format",
    media: [
      "https://images.unsplash.com/photo-1755705152604-af6804fb8932?w=390&h=500&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1619512673224-91cfb2688284?w=390&h=500&fit=crop&auto=format",
    ],
    caption: "Weekend with my crew 💃",
    mood: "🔥",
    liked: false,
    created_at: new Date().toISOString(),
  },
];

interface PostCardProps {
  post: Post
  onViewProfile: (userId: string) => void
  onBlockReport?: (name: string, userId: string) => void
  currentUserId?: string
}

function PostCard({ post, onViewProfile, onBlockReport, currentUserId }: PostCardProps) {
  const [liked, setLiked] = useState(post.liked || false)
  const [showHeart, setShowHeart] = useState(false)
  const [carouselIdx, setCarouselIdx] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const lastTapRef = useRef(0)

  const doLike = () => {
    setLiked(true)
    setShowHeart(true)
    setTimeout(() => setShowHeart(false), 900)
    if (currentUserId) likePost(post.id, currentUserId).catch(() => {})
  }

  const doUnlike = () => {
    setLiked(false)
    if (currentUserId) unlikePost(post.id, currentUserId).catch(() => {})
  }

  const handleDoubleTap = () => {
    const now = Date.now()
    if (now - lastTapRef.current < 300) {
      if (!liked) doLike()
    }
    lastTapRef.current = now
  }

  const toggleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!liked) doLike()
    else doUnlike()
  }

  return (
    <div
      className="bg-card rounded-3xl overflow-hidden shadow-sm mb-5"
      style={{ border: "1.5px solid rgba(139,26,46,0.08)" }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-2">
        <button
          onClick={() => onViewProfile(post.user_id)}
          className="shrink-0 relative w-10 h-10"
          aria-label={`View ${post.user_name}'s profile`}
        >
          <img
            src={post.user_avatar}
            alt={post.user_name}
            className="w-10 h-10 rounded-full object-cover relative z-10"
            loading="lazy"
          />
          <div className="absolute -inset-0.5 rounded-full" style={{ background: "linear-gradient(135deg,#E86A8F,#8B1A2E)", padding: 1.5 }}>
            <div className="w-full h-full rounded-full bg-background" />
          </div>
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={() => onViewProfile(post.user_id)}>
              <span className="font-bold text-foreground text-[15px]" style={{ fontFamily: "Nunito, sans-serif" }}>
                {post.user_name}
              </span>
            </button>
            {post.user_uni && (
              <span
                className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black tracking-wide"
                style={{ background: "linear-gradient(120deg,#8B1A2E,#C0395A)", color: "white" }}
              >
                <Shield size={9} strokeWidth={3} />
                {post.user_uni}
              </span>
            )}
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="p-1.5 rounded-full hover:bg-secondary text-muted-foreground"
            aria-label="More options"
          >
            <MoreVertical size={18} />
          </button>
          {menuOpen && (
            <div
              className="absolute right-0 top-9 bg-card rounded-2xl shadow-xl z-20 min-w-32.5 py-2 overflow-hidden"
              style={{ border: "1px solid rgba(139,26,46,0.1)" }}
            >
              <button className="block w-full text-left px-4 py-2.5 text-sm font-semibold hover:bg-secondary" onClick={() => { setMenuOpen(false); onBlockReport?.(post.user_name || 'Unknown', post.user_id || '') }}>Report 🚩</button>
              <button className="block w-full text-left px-4 py-2.5 text-sm font-semibold text-destructive hover:bg-secondary" onClick={() => { setMenuOpen(false); onBlockReport?.(post.user_name || 'Unknown', post.user_id || '') }}>Block 🚫</button>
            </div>
          )}
        </div>
      </div>

      {/* Media */}
      <div
        className="relative overflow-hidden mx-2 rounded-2xl bg-gray-100"
        style={{ aspectRatio: "4/5" }}
        onClick={handleDoubleTap}
        role="button"
        tabIndex={0}
        aria-label={`${post.user_name}'s post${post.caption ? ': ' + post.caption : ''}`}
        onKeyDown={(e) => { if (e.key === 'Enter') handleDoubleTap() }}
      >
        <img
          src={post.media[carouselIdx]}
          alt={post.caption || post.user_name}
          className="w-full h-full object-cover select-none"
          draggable={false}
          loading="lazy"
        />
        <div className="absolute bottom-0 inset-x-0 h-24 pointer-events-none" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.45), transparent)" }} />

        {post.media.length > 1 && (
          <>
            {carouselIdx > 0 && (
              <button
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-sm rounded-full p-1.5 text-white"
                onClick={(e) => { e.stopPropagation(); setCarouselIdx((i) => i - 1) }}
                aria-label="Previous image"
              >
                <ChevronLeft size={18} />
              </button>
            )}
            {carouselIdx < post.media.length - 1 && (
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-sm rounded-full p-1.5 text-white"
                onClick={(e) => { e.stopPropagation(); setCarouselIdx((i) => i + 1) }}
                aria-label="Next image"
              >
                <ChevronRight size={18} />
              </button>
            )}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {post.media.map((_, i) => (
                <div
                  key={i}
                  className="h-1 rounded-full transition-all duration-300"
                  style={{ width: i === carouselIdx ? 20 : 6, background: i === carouselIdx ? "white" : "rgba(255,255,255,0.4)" }}
                />
              ))}
            </div>
          </>
        )}

        {/* Double-tap heart */}
        <AnimatePresence>
          {showHeart && (
            <motion.div
              initial={{ scale: 0.2, opacity: 1 }}
              animate={{ scale: 1.5, opacity: 1 }}
              exit={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="drop-shadow-2xl">
                <Heart size={90} fill="#E86A8F" color="#E86A8F" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div className="px-4 pt-3 pb-4">
        <div className="flex items-center justify-between mb-2">
          <motion.button
            onClick={toggleLike}
            whileTap={{ scale: 1.35 }}
            transition={{ type: "spring", stiffness: 500, damping: 12 }}
            className="flex items-center gap-2"
            aria-label={liked ? "Unlike" : "Like"}
          >
            <Heart
              size={26}
              fill={liked ? "#E86A8F" : "none"}
              color={liked ? "#E86A8F" : "#8a7a7e"}
              strokeWidth={2}
            />
            {liked && (
              <motion.span
                initial={{ opacity: 0, scale: 0.5, x: -4 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                className="text-[13px] font-black"
                style={{ color: "#E86A8F", fontFamily: "Nunito, sans-serif" }}
              >
                Liked
              </motion.span>
            )}
          </motion.button>
          <button
            onClick={() => onViewProfile(post.user_id)}
            className="text-xs font-semibold"
            style={{ color: "#8B1A2E" }}
            aria-label={`View ${post.user_name}'s profile`}
          >
            View profile →
          </button>
        </div>
        {post.caption && (
          <p className="text-sm text-foreground leading-snug">
            <span className="font-bold" style={{ fontFamily: "Nunito, sans-serif" }}>{post.user_name}</span>{" "}
            <span className="text-[#3a2a2e]">{post.caption}</span>
          </p>
        )}
      </div>
    </div>
  )
}

interface DiscoverFeedProps {
  onViewProfile: (userId: string) => void
  onSurprise: () => void
  onOpenStories?: (stories: any[], idx: number) => void
  onBlockReport?: (name: string, userId: string) => void
}

export function DiscoverFeed({ onViewProfile, onSurprise, onOpenStories, onBlockReport }: DiscoverFeedProps) {
  const { user } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const PAGE_SIZE = 10

  // Initial fetch
  useEffect(() => {
    getPosts(PAGE_SIZE, 0)
      .then((data) => {
        if (data.length > 0) {
          setPosts(data)
          setHasMore(data.length >= PAGE_SIZE)
        } else {
          setPosts(MOCK_POSTS as Post[])
          setHasMore(false)
        }
      })
      .catch(() => {
        setPosts(MOCK_POSTS as Post[])
        setHasMore(false)
      })
      .finally(() => setLoading(false))
  }, [])

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    if (!hasMore || loadingMore) return
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          setLoadingMore(true)
          const nextPage = page + 1
          getPosts(PAGE_SIZE, nextPage * PAGE_SIZE)
            .then((data) => {
              if (data.length > 0) {
                setPosts((prev) => [...prev, ...data])
                setPage(nextPage)
                setHasMore(data.length >= PAGE_SIZE)
              } else {
                setHasMore(false)
              }
            })
            .catch(() => setHasMore(false))
            .finally(() => setLoadingMore(false))
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, loadingMore, page])

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Top bar */}
      <div className="sticky top-0 z-20 px-4 pt-4 pb-3" style={{ background: "rgba(253,252,251,0.95)", backdropFilter: "blur(12px)" }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <span
              className="text-2xl font-black tracking-tight"
              style={{ fontFamily: "Nunito, sans-serif", background: "linear-gradient(120deg,#8B1A2E,#C0395A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
            >
              CampusMatch
            </span>
            <p className="text-[11px] text-muted-foreground -mt-0.5">Find your person on campus 💘</p>
          </div>
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={onSurprise}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-sm font-black text-white shadow-md"
            style={{ background: "linear-gradient(135deg,#8B1A2E,#C0395A)", boxShadow: "0 4px 16px rgba(139,26,46,0.35)" }}
            aria-label="Start Surprise Meetup"
          >
            <Sparkles size={14} />
            Surprise
          </motion.button>
        </div>

        {/* Stories row */}
        <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {STORIES.map((s, i) => (
            <button
              key={i}
              onClick={() => {
                if (s.isMe) return
                onOpenStories?.(
                  [{ id: s.name, user_id: s.name, user_full_name: s.name, user_avatar: s.avatar, media_url: s.avatar, type: 'photo', created_at: new Date().toISOString(), expires_at: '' }],
                  0
                )
              }}
              className="flex flex-col items-center gap-1.5 shrink-0"
              aria-label={s.isMe ? "Your story" : `${s.name}'s story`}
            >
              <div className="relative w-14 h-14">
                {s.isMe ? (
                  <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg,#8B1A2E,#C0395A)" }}>
                    <span className="text-white text-2xl font-black">+</span>
                  </div>
                ) : (
                  <>
                    <div
                      className="absolute -inset-0.5 rounded-full"
                      style={{ background: s.active ? "linear-gradient(135deg,#E86A8F,#8B1A2E,#E6B422)" : "#e0d4d6", padding: 2 }}
                    >
                      <div className="w-full h-full rounded-full" style={{ background: "#fdfcfb" }} />
                    </div>
                    <img src={s.avatar} alt={s.name} className="absolute inset-0.5 w-[calc(100%-4px)] h-[calc(100%-4px)] rounded-full object-cover z-10" loading="lazy" />
                    {s.active && (
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-green-400 border-2 border-background z-20" />
                    )}
                  </>
                )}
              </div>
              <span className="text-[10px] font-semibold text-muted-foreground" style={{ fontFamily: "Nunito, sans-serif" }}>
                {s.isMe ? "Your story" : s.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-3 pt-2">
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
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onViewProfile={onViewProfile}
                onBlockReport={onBlockReport}
                currentUserId={user?.id}
              />
            ))}

            {/* Infinite scroll sentinel */}
            {hasMore && (
              <div ref={sentinelRef} className="flex items-center justify-center py-6">
                {loadingMore ? (
                  <motion.div
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="w-5 h-5 rounded-full"
                    style={{ background: 'linear-gradient(135deg,#8B1A2E,#C0395A)' }}
                    aria-label="Loading more posts"
                  />
                ) : (
                  <div className="h-4" />
                )}
              </div>
            )}

            {/* End-of-feed nudge */}
            {!hasMore && posts.length > 0 && (
              <div className="flex flex-col items-center py-10 gap-2">
                <span className="text-3xl">🔮</span>
                <p className="text-sm font-bold text-muted-foreground" style={{ fontFamily: "Nunito, sans-serif" }}>You've seen everyone nearby</p>
                <p className="text-xs text-muted-foreground">Check back soon — new faces every day</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
