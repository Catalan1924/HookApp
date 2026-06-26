import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronRight, ChevronLeft, Camera } from 'lucide-react'

interface OnboardingFlowProps {
  onComplete: () => void
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const { user, refreshProfile } = useAuth()
  const [step, setStep] = useState(0)
  const [fullName, setFullName] = useState('')
  const [age, setAge] = useState('')
  const [bio, setBio] = useState('')
  const [gender, setGender] = useState('')
  const [interests, setInterests] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleComplete = async () => {
    if (!user) return
    setLoading(true)
    setError('')

    const interestArray = interests
      .split(',')
      .map((i) => i.trim())
      .filter(Boolean)

    const update: Record<string, unknown> = {
      full_name: fullName,
      age: age ? parseInt(age) : null,
      bio,
      gender: gender || null,
      interests: interestArray.length > 0 ? interestArray : null,
    }
    if (avatarUrl) update.avatar_url = avatarUrl

    const { error: updateError } = await supabase
      .from('profiles')
      .update(update as any)
      .eq('id', user.id)

    setLoading(false)

    if (updateError) {
      setError(updateError.message)
    } else {
      await refreshProfile()
      onComplete()
    }
  }

  const steps = [
    {
      title: "What's your name?",
      subtitle: 'How you want to appear on CampusMatch',
      content: (
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Your full name"
          className="w-full rounded-2xl px-4 py-3.5 text-lg outline-none text-foreground text-center"
          style={{ background: '#f4f0f1', fontFamily: 'Nunito Sans, sans-serif' }}
          autoFocus
        />
      ),
      canNext: fullName.trim().length > 0,
    },
    {
      title: 'How old are you?',
      subtitle: 'Must be 18 or older',
      content: (
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Your age"
          min="18"
          max="99"
          className="w-full rounded-2xl px-4 py-3.5 text-lg outline-none text-foreground text-center"
          style={{ background: '#f4f0f1', fontFamily: 'Nunito Sans, sans-serif' }}
          autoFocus
        />
      ),
      canNext: age !== '' && parseInt(age) >= 18,
    },
    {
      title: 'Tell us about yourself',
      subtitle: 'A short bio to help people get to know you',
      content: (
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="I'm a 3rd year student who loves..."
          maxLength={150}
          rows={3}
          className="w-full rounded-2xl px-4 py-3 text-sm outline-none resize-none text-foreground"
          style={{ background: '#f4f0f1', fontFamily: 'Nunito Sans, sans-serif' }}
          autoFocus
        />
      ),
      canNext: true,
    },
    {
      title: 'What are your interests?',
      subtitle: 'Comma-separated: Music, Tech, Sports...',
      content: (
        <input
          type="text"
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
          placeholder="Music, Tech, Travel, Food..."
          className="w-full rounded-2xl px-4 py-3.5 text-sm outline-none text-foreground text-center"
          style={{ background: '#f4f0f1', fontFamily: 'Nunito Sans, sans-serif' }}
          autoFocus
        />
      ),
      canNext: true,
    },
    {
      title: 'Almost done!',
      subtitle: "You're all set to join CampusMatch",
      content: (
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: [0, 10, -10, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
            className="text-6xl"
          >
            🎉
          </motion.div>
          <p className="text-sm text-muted-foreground text-center">
            You can add a profile photo later. Let's get you started!
          </p>
        </div>
      ),
      canNext: true,
      isLast: true,
    },
  ]

  const currentStep = steps[step]

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6" style={{ background: '#fdfcfb', fontFamily: 'Nunito Sans, sans-serif' }}>
      {/* Progress dots */}
      <div className="flex gap-2 mb-8">
        {steps.map((_, i) => (
          <div
            key={i}
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              width: i === step ? 32 : 8,
              background: i <= step ? 'linear-gradient(135deg,#8B1A2E,#C0395A)' : '#e0d4d6',
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-sm text-center"
        >
          <h2 className="text-2xl font-black text-foreground mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>
            {currentStep.title}
          </h2>
          <p className="text-sm text-muted-foreground mb-6">{currentStep.subtitle}</p>

          {currentStep.content}

          {error && (
            <p className="text-sm text-destructive font-semibold mt-4">{error}</p>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="w-full max-w-sm flex items-center gap-3 mt-8">
        {step > 0 && (
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={() => setStep(step - 1)}
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: '#f4f0f1' }}
          >
            <ChevronLeft size={20} color="#8B1A2E" />
          </motion.button>
        )}

        <motion.button
          whileTap={{ scale: 0.96 }}
          disabled={!currentStep.canNext || loading}
          onClick={() => {
            if (currentStep.isLast) {
              handleComplete()
            } else {
              setStep(step + 1)
            }
          }}
          className="flex-1 py-4 rounded-2xl font-black text-white text-base shadow-lg disabled:opacity-40 flex items-center justify-center gap-2"
          style={{
            background: 'linear-gradient(135deg,#8B1A2E,#C0395A)',
            boxShadow: '0 6px 24px rgba(139,26,46,0.35)',
          }}
        >
          {loading ? 'Saving...' : currentStep.isLast ? 'Get Started 💫' : 'Next'}
          {!currentStep.isLast && !loading && <ChevronRight size={18} />}
        </motion.button>
      </div>
    </div>
  )
}
