import { useEffect, useState, createContext, useContext, useCallback, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, Info, AlertTriangle, CheckCircle } from 'lucide-react'

type ToastType = 'info' | 'success' | 'warning' | 'error'

interface Toast {
  id: string
  type: ToastType
  message: string
  action?: { label: string; onClick: () => void }
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType, action?: Toast['action']) => void
}

const ToastContext = createContext<ToastContextValue>({ showToast: () => {} })

export function useToast() {
  return useContext(ToastContext)
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback(
    (message: string, type: ToastType = 'info', action?: Toast['action']) => {
      const id = Math.random().toString(36).substring(2, 9)
      setToasts((prev) => [...prev, { id, type, message, action }])
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, 4000)
    },
    []
  )

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        className="fixed bottom-20 inset-x-0 z-50 flex flex-col gap-2 px-4 pointer-events-none"
        style={{ maxWidth: 390, margin: '0 auto' }}
      >
        <AnimatePresence>
          {toasts.map((toast) => {
            const IconEl =
              toast.type === 'success' ? CheckCircle :
              toast.type === 'error' ? AlertTriangle :
              toast.type === 'warning' ? AlertTriangle :
              Info

            const bgColor =
              toast.type === 'success' ? 'linear-gradient(135deg,#166534,#15803d)' :
              toast.type === 'error' ? 'linear-gradient(135deg,#991b1b,#dc2626)' :
              toast.type === 'warning' ? 'linear-gradient(135deg,#92400e,#d97706)' :
              'linear-gradient(135deg,#8B1A2E,#C0395A)'

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl text-white shadow-xl text-sm"
                style={{ background: bgColor }}
              >
                <IconEl size={16} className="flex-shrink-0" />
                <span className="flex-1 font-semibold">{toast.message}</span>
                {toast.action && (
                  <button onClick={toast.action.onClick} className="font-bold text-white/80 text-xs underline flex-shrink-0">
                    {toast.action.label}
                  </button>
                )}
                <button
                  onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                  className="text-white/60 flex-shrink-0"
                >
                  <X size={14} />
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
