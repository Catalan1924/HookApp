interface LoadingSkeletonProps {
  type?: 'card' | 'list' | 'text' | 'avatar'
  count?: number
}

export function LoadingSkeleton({ type = 'card', count = 3 }: LoadingSkeletonProps) {
  if (type === 'list') {
    return (
      <div className="flex flex-col gap-1 px-4 py-2">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 py-3.5">
            <div className="w-14 h-14 rounded-full bg-gray-200 animate-pulse flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 rounded-full bg-gray-200 animate-pulse w-1/3" />
              <div className="h-3 rounded-full bg-gray-200 animate-pulse w-2/3" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (type === 'avatar') {
    return (
      <div className="flex gap-3 overflow-x-auto px-4 pb-1">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5 flex-shrink-0">
            <div className="w-14 h-14 rounded-full bg-gray-200 animate-pulse" />
            <div className="h-2.5 w-12 rounded-full bg-gray-200 animate-pulse" />
          </div>
        ))}
      </div>
    )
  }

  if (type === 'text') {
    return (
      <div className="space-y-2 px-4 py-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="h-4 rounded-full bg-gray-200 animate-pulse" style={{ width: `${80 - i * 10}%` }} />
        ))}
      </div>
    )
  }

  // Default: card skeleton
  return (
    <div className="flex flex-col gap-4 px-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-3xl overflow-hidden shadow-sm"
          style={{ border: '1.5px solid rgba(139,26,46,0.06)' }}
        >
          <div className="flex items-center gap-3 px-4 pt-4 pb-2">
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
            <div className="flex-1">
              <div className="h-4 rounded-full bg-gray-200 animate-pulse w-1/4 mb-1" />
              <div className="h-3 rounded-full bg-gray-200 animate-pulse w-1/6" />
            </div>
          </div>
          <div className="mx-2 rounded-2xl bg-gray-200 animate-pulse" style={{ aspectRatio: '4/5' }} />
          <div className="px-4 pt-3 pb-4 space-y-2">
            <div className="h-4 rounded-full bg-gray-200 animate-pulse w-1/6" />
            <div className="h-3.5 rounded-full bg-gray-200 animate-pulse w-3/4" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function LoadingSpinner({ text }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <div
        className="w-8 h-8 rounded-full animate-pulse"
        style={{ background: 'linear-gradient(135deg,#8B1A2E,#C0395A)' }}
        aria-label={text || 'Loading'}
      />
      {text && (
        <p className="text-sm font-semibold text-muted-foreground">{text}</p>
      )}
    </div>
  )
}
