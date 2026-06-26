import { motion } from 'motion/react'

interface EmptyStateProps {
  icon?: string
  title: string
  description: string
  action?: { label: string; onClick: () => void }
}

export function EmptyState({ icon = '💌', title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center px-8 py-16 text-center"
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        className="text-5xl mb-4"
      >
        {icon}
      </motion.div>
      <h3 className="font-black text-foreground text-lg mb-2" style={{ fontFamily: 'Nunito, sans-serif' }}>
        {title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">{description}</p>
      {action && (
        <motion.button
          whileTap={{ scale: 0.93 }}
          onClick={action.onClick}
          className="mt-5 px-6 py-3 rounded-2xl font-bold text-white shadow-lg text-sm"
          style={{ background: 'linear-gradient(135deg,#8B1A2E,#C0395A)', boxShadow: '0 4px 16px rgba(139,26,46,0.35)' }}
        >
          {action.label}
        </motion.button>
      )}
    </motion.div>
  )
}
