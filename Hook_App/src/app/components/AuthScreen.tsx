import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { motion } from 'motion/react'

interface AuthScreenProps {
  onComplete: () => void
}

export function AuthScreen({ onComplete }: AuthScreenProps) {
  const { signIn, signUp } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!email || !password) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    const result = isSignUp ? await signUp(email, password) : await signIn(email, password)
    setLoading(false)

    if (result.error) {
      setError(result.error)
    } else {
      onComplete()
    }
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6" style={{ background: '#fdfcfb', fontFamily: 'Nunito Sans, sans-serif' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="text-6xl mb-4"
          >
            💘
          </motion.div>
          <h1
            className="text-3xl font-black tracking-tight"
            style={{
              fontFamily: 'Nunito, sans-serif',
              background: 'linear-gradient(120deg,#8B1A2E,#C0395A)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            CampusMatch
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Find your person on campus</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-black text-muted-foreground uppercase tracking-widest mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@university.edu"
              className="w-full rounded-2xl px-4 py-3 text-sm outline-none text-foreground"
              style={{ background: '#f4f0f1', fontFamily: 'Nunito Sans, sans-serif' }}
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-muted-foreground uppercase tracking-widest mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full rounded-2xl px-4 py-3 text-sm outline-none text-foreground"
              style={{ background: '#f4f0f1', fontFamily: 'Nunito Sans, sans-serif' }}
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-destructive font-semibold text-center"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            whileTap={{ scale: 0.96 }}
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl font-black text-white text-base mt-2 shadow-lg disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg,#8B1A2E,#C0395A)',
              boxShadow: '0 6px 24px rgba(139,26,46,0.35)',
            }}
          >
            {loading ? 'Loading...' : isSignUp ? 'Create Account' : 'Sign In'}
          </motion.button>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={() => { setIsSignUp(!isSignUp); setError('') }}
            className="text-sm font-semibold"
            style={{ color: '#8B1A2E' }}
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
