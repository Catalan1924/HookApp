import { useState } from 'react'
import { Flag, Ban, X } from 'lucide-react'
import { motion } from 'motion/react'

interface BlockReportModalProps {
  open: boolean
  onClose: () => void
  targetName: string
  targetId: string
  onBlock: (userId: string) => void
  onReport: (userId: string, reason: string) => void
}

export function BlockReportModal({ open, onClose, targetName, targetId, onBlock, onReport }: BlockReportModalProps) {
  const [mode, setMode] = useState<'menu' | 'report'>('menu')
  const [reason, setReason] = useState('')
  const [customReason, setCustomReason] = useState('')

  const reasons = [
    'Spam or harassment',
    'Inappropriate content',
    'Fake profile',
    'Underage user',
    'Other',
  ]

  if (!open) return null

  const handleReport = () => {
    const final = reason === 'Other' ? customReason : reason
    if (!final.trim()) return
    onReport(targetId, final.trim())
    onClose()
    setMode('menu')
    setReason('')
    setCustomReason('')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ maxWidth: 390, margin: '0 auto' }}>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 400, damping: 34 }}
        className="relative z-10 w-full rounded-t-3xl overflow-hidden"
        style={{ background: '#fdfcfb', boxShadow: '0 -8px 40px rgba(0,0,0,0.12)' }}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b" style={{ borderColor: 'rgba(139,26,46,0.08)' }}>
          <h3 className="font-black text-foreground text-lg" style={{ fontFamily: 'Nunito, sans-serif' }}>
            {mode === 'menu' ? targetName : 'Report'}
          </h3>
          <button onClick={onClose} className="text-muted-foreground p-1">
            <X size={18} />
          </button>
        </div>

        {mode === 'menu' ? (
          <div className="p-4 space-y-2 pb-8">
            <button
              onClick={() => {
                onBlock(targetId)
                onClose()
              }}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left"
              style={{ background: '#fef2f2' }}
            >
              <Ban size={20} color="#EF4444" />
              <div>
                <p className="font-bold text-[#EF4444]">Block @{targetName}</p>
                <p className="text-xs text-muted-foreground">They won't be able to see your profile or contact you</p>
              </div>
            </button>

            <button
              onClick={() => setMode('report')}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left"
              style={{ background: '#fff8e8' }}
            >
              <Flag size={20} color="#E6B422" />
              <div>
                <p className="font-bold text-foreground">Report</p>
                <p className="text-xs text-muted-foreground">Flag inappropriate behavior or content</p>
              </div>
            </button>
          </div>
        ) : (
          <div className="p-4 pb-8 space-y-3">
            <p className="text-sm font-semibold text-muted-foreground">Why are you reporting {targetName}?</p>
            {reasons.map((r) => (
              <button
                key={r}
                onClick={() => setReason(r)}
                className="w-full text-left px-4 py-3 rounded-2xl text-sm font-semibold transition-colors"
                style={{
                  background: reason === r ? '#f0e8ea' : '#f4f0f1',
                  color: reason === r ? '#8B1A2E' : '#1A1A1A',
                }}
              >
                {r}
              </button>
            ))}
            {reason === 'Other' && (
              <textarea
                placeholder="Tell us more…"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                className="w-full rounded-2xl p-3 text-sm outline-none resize-none"
                style={{ background: '#f4f0f1', border: '1.5px solid rgba(139,26,46,0.1)' }}
                rows={3}
              />
            )}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setMode('menu')}
                className="flex-1 py-3 rounded-2xl text-sm font-bold"
                style={{ background: '#f4f0f1', color: '#8a7a7e' }}
              >
                Back
              </button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleReport}
                disabled={!reason || (reason === 'Other' && !customReason.trim())}
                className="flex-1 py-3 rounded-2xl text-sm font-bold text-white disabled:opacity-40"
                style={{ background: 'linear-gradient(135deg,#8B1A2E,#C0395A)' }}
              >
                Submit Report
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
