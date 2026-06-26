import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { motion } from 'motion/react'
import { Mail, Phone } from 'lucide-react'

interface AuthScreenProps {
  onComplete: () => void
}

type AuthMode = 'email' | 'phone'

export function AuthScreen({ onComplete }: AuthScreenProps) {
  const { signIn, signUp, signInWithPhone, verifyPhoneOTP } = useAuth()
  const [mode, setMode] = useState<AuthMode>('email')

  // Email fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)

  // Phone fields
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // ── Email submit ──
  const handleEmailSubmit = async (e: React.FormEvent) => {
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

  // ── Phone: send OTP ──
  const handleSendOTP = async () => {
    setError('')
    const cleaned = phone.replace(/\s+/g, '')
    if (cleaned.length < 10) {
      setError('Enter a valid phone number with country code (e.g. +254...)')
      return
    }
    setLoading(true)
    const result = await signInWithPhone(cleaned)
    setLoading(false)
    if (result.error) {
      setError(result.error)
    } else {
      setOtpSent(true)
    }
  }

  // ── Phone: verify OTP ──
  const handleVerifyOTP = async () => {
    setError('')
    if (otp.length < 4) {
      setError('Enter the verification code')
      return
    }
    setLoading(true)
    const cleaned = phone.replace(/\s+/g, '')
    const result = await verifyPhoneOTP(cleaned, otp)
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

        {/* Mode toggle */}
        <div className="flex rounded-2xl overflow-hidden mb-6" style={{ background: '#f4f0f1' }}>
          {([
            { id: 'email' as const, label: 'Email', icon: <Mail size={14} /> },
            { id: 'phone' as const, label: 'Phone', icon: <Phone size={14} /> },
          ]).map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => { setMode(id); setError(''); setOtpSent(false); setOtp('') }}
              className={`flex-1 py-2.5 text-sm font-black flex items-center justify-center gap-1.5 transition-all rounded-2xl`}
              style={mode === id
                ? { background: 'linear-gradient(135deg,#8B1A2E,#C0395A)', color: 'white' }
                : { color: '#8a7a7e' }
              }
              aria-label={`Sign in with ${label}`}
              aria-pressed={mode === id}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>

        {/* ── Email form ── */}
        {mode === 'email' && (
          <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-black text-muted-foreground uppercase tracking-widest mb-1.5" htmlFor="auth-email">Email</label>
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@university.edu"
                className="w-full rounded-2xl px-4 py-3 text-sm outline-none text-foreground"
                style={{ background: '#f4f0f1', fontFamily: 'Nunito Sans, sans-serif' }}
                autoComplete="email"
                aria-label="Email address"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-muted-foreground uppercase tracking-widest mb-1.5" htmlFor="auth-password">Password</label>
              <input
                id="auth-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full rounded-2xl px-4 py-3 text-sm outline-none text-foreground"
                style={{ background: '#f4f0f1', fontFamily: 'Nunito Sans, sans-serif' }}
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                aria-label="Password"
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-destructive font-semibold text-center"
                role="alert"
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
              aria-label={isSignUp ? 'Create Account' : 'Sign In'}
            >
              {loading ? 'Loading...' : isSignUp ? 'Create Account' : 'Sign In'}
            </motion.button>
          </form>
        )}

        {/* ── Phone form ── */}
        {mode === 'phone' && (
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-black text-muted-foreground uppercase tracking-widest mb-1.5" htmlFor="auth-phone">Phone Number</label>
              <input
                id="auth-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+254 712 345 678"
                className="w-full rounded-2xl px-4 py-3 text-sm outline-none text-foreground"
                style={{ background: '#f4f0f1', fontFamily: 'Nunito Sans, sans-serif' }}
                autoComplete="tel"
                disabled={otpSent}
                aria-label="Phone number with country code"
              />
            </div>

            {otpSent && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                <label className="block text-xs font-black text-muted-foreground uppercase tracking-widest mb-1.5" htmlFor="auth-otp">Verification Code</label>
                <input
                  id="auth-otp"
                  type="text"
                  inputMode="numeric"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456"
                  className="w-full rounded-2xl px-4 py-3 text-sm outline-none text-foreground text-center tracking-widest"
                  style={{ background: '#f4f0f1', fontFamily: 'Nunito Sans, sans-serif' }}
                  autoFocus
                  aria-label="6-digit verification code"
                />
              </motion.div>
            )}

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-destructive font-semibold text-center"
                role="alert"
              >
                {error}
              </motion.p>
            )}

            {!otpSent ? (
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handleSendOTP}
                disabled={loading}
                className="w-full py-4 rounded-2xl font-black text-white text-base mt-2 shadow-lg disabled:opacity-50"
                style={{
                  background: 'linear-gradient(135deg,#8B1A2E,#C0395A)',
                  boxShadow: '0 6px 24px rgba(139,26,46,0.35)',
                }}
                aria-label="Send verification code"
              >
                {loading ? 'Sending code...' : 'Send Code 📱'}
              </motion.button>
            ) : (
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handleVerifyOTP}
                disabled={loading}
                className="w-full py-4 rounded-2xl font-black text-white text-base mt-2 shadow-lg disabled:opacity-50"
                style={{
                  background: 'linear-gradient(135deg,#8B1A2E,#C0395A)',
                  boxShadow: '0 6px 24px rgba(139,26,46,0.35)',
                }}
                aria-label="Verify code"
              >
                {loading ? 'Verifying...' : 'Verify 🔐'}
              </motion.button>
            )}
          </div>
        )}

        {/* Toggle sign up / sign in (email mode only) */}
        {mode === 'email' && (
          <div className="text-center mt-6">
            <button
              onClick={() => { setIsSignUp(!isSignUp); setError('') }}
              className="text-sm font-semibold"
              style={{ color: '#8B1A2E' }}
              aria-label={isSignUp ? 'Switch to sign in' : 'Switch to sign up'}
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  )
}
