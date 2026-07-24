import { useState, useEffect, useCallback, useRef } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

interface Story {
  id: string
  user_id: string
  user_full_name: string
  user_avatar: string
  media_url: string
  type: string
  created_at: string
  expires_at: string
}

interface StoryViewerProps {
  stories: Story[]
  initialIndex?: number
  onClose: () => void
  onViewProfile?: (userId: string) => void
}

export function StoryViewer({ stories, initialIndex = 0, onClose, onViewProfile }: StoryViewerProps) {
  const [currentIdx, setCurrentIdx] = useState(initialIndex)
  const [progress, setProgress] = useState(0)
  const [paused, setPaused] = useState(false)
  const [direction, setDirection] = useState<'forward' | 'back'>('forward')
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const DURATION = 5000 // 5 seconds per story

  const current = stories[currentIdx]

  const advance = useCallback(() => {
    setDirection('forward')
    if (currentIdx < stories.length - 1) {
      setCurrentIdx((i) => i + 1)
      setProgress(0)
    } else {
      onClose()
    }
  }, [currentIdx, stories.length, onClose])

  const goBack = useCallback(() => {
    if (currentIdx > 0) {
      setDirection('back')
      setCurrentIdx((i) => i - 1)
      setProgress(0)
    }
  }, [currentIdx])

  // Progress bar timer
  useEffect(() => {
    if (paused) {
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }

    const startTime = Date.now()
    const initialProgress = progress

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime
      const newProgress = initialProgress + elapsed / DURATION * 100
      if (newProgress >= 100) {
        setProgress(100)
        advance()
      } else {
        setProgress(newProgress)
      }
    }, 50)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [currentIdx, paused, advance])

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') advance()
      if (e.key === 'ArrowLeft') goBack()
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [advance, goBack, onClose])

  if (!current) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
      style={{ maxWidth: 390, margin: '0 auto' }}
    >
      {/* Progress bars */}
      <div className="absolute top-0 inset-x-0 z-20 flex gap-1 px-2 pt-3 pb-1">
        {stories.map((_, i) => (
          <div key={i} className="flex-1 h-1 rounded-full bg-white/30 overflow-hidden">
            <div
              className="h-full rounded-full bg-white transition-all duration-75"
              style={{
                width: i < currentIdx ? '100%' : i === currentIdx ? `${progress}%` : '0%',
              }}
            />
          </div>
        ))}
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-3 z-30 bg-black/40 backdrop-blur-sm rounded-full p-2 text-white"
      >
        <X size={18} />
      </button>

      {/* Story content */}
      <div
        className="relative w-full h-full flex items-center justify-center"
        onMouseDown={() => setPaused(true)}
        onMouseUp={() => setPaused(false)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: direction === 'forward' ? 40 : -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction === 'forward' ? -40 : 40 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-full h-full"
          >
            {current.type === 'video' ? (
              <video src={current.media_url} autoPlay muted className="w-full h-full object-cover" />
            ) : (
              <img src={current.media_url} alt="" className="w-full h-full object-cover" />
            )}

            {/* User info overlay */}
            <div className="absolute bottom-6 left-4 right-4">
              <div className="flex items-center gap-3">
                <button onClick={() => onViewProfile?.(current.user_id)}>
                  <img
                    src={current.user_avatar}
                    alt={current.user_full_name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-white/60"
                  />
                </button>
                <div className="text-white">
                  <p className="font-black text-sm" style={{ fontFamily: 'Nunito, sans-serif' }}>
                    {current.user_full_name}
                  </p>
                  <p className="text-xs text-white/60">
                    {formatStoryTime(current.created_at)}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation arrows */}
      {currentIdx > 0 && (
        <button
          onClick={goBack}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/30 backdrop-blur-sm rounded-full p-2 text-white"
        >
          <ChevronLeft size={22} />
        </button>
      )}
      {currentIdx < stories.length - 1 && (
        <button
          onClick={advance}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/30 backdrop-blur-sm rounded-full p-2 text-white"
        >
          <ChevronRight size={22} />
        </button>
      )}

      {/* Tap zones */}
      <div className="absolute inset-0 z-10 flex" style={{ pointerEvents: 'none' }}>
        <div className="flex-1" style={{ pointerEvents: 'auto' }} onClick={goBack} />
        <div className="flex-1" style={{ pointerEvents: 'auto' }} onClick={advance} />
      </div>
    </div>
  )
}

function formatStoryTime(dateStr: string): string {
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
  } catch {
    return ''
  }
}
