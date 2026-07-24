import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronRight, ChevronLeft, Camera, Search, Upload, X } from 'lucide-react'

interface OnboardingFlowProps {
  onComplete: () => void
}

interface University {
  id: string
  name: string
  email_domain: string
}

const KENYAN_UNIVERSITIES: University[] = [
  { id: 'uon', name: 'University of Nairobi', email_domain: 'uonbi.ac.ke' },
  { id: 'ku', name: 'Kenyatta University', email_domain: 'ku.ac.ke' },
  { id: 'jkuat', name: 'JKUAT', email_domain: 'jkuat.ac.ke' },
  { id: 'strathmore', name: 'Strathmore University', email_domain: 'strathmore.edu' },
  { id: 'usiu', name: 'USIU-Africa', email_domain: 'usiu.ac.ke' },
  { id: 'kca', name: 'KCA University', email_domain: 'kca.ac.ke' },
  { id: 'daystar', name: 'Daystar University', email_domain: 'daystar.ac.ke' },
  { id: 'catholic', name: 'Catholic University of Eastern Africa', email_domain: 'cuea.edu' },
]

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const { user, refreshProfile, uploadAvatar } = useAuth()
  const [step, setStep] = useState(0)
  const [fullName, setFullName] = useState('')
  const [age, setAge] = useState('')
  const [bio, setBio] = useState('')
  const [gender, setGender] = useState('')
  const [interests, setInterests] = useState('')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [universityId, setUniversityId] = useState('')
  const [universitySearch, setUniversitySearch] = useState('')
  const [showUniDropdown, setShowUniDropdown] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState('')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const uniDropdownRef = useRef<HTMLDivElement>(null)

  // Close university dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (uniDropdownRef.current && !uniDropdownRef.current.contains(e.target as Node)) {
        setShowUniDropdown(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const filteredUnis = KENYAN_UNIVERSITIES.filter((u) =>
    u.name.toLowerCase().includes(universitySearch.toLowerCase())
  )

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
      university_id: universityId || null,
      phone: phone || null,
    }
    if (avatarUrl) update.avatar_url = avatarUrl

    const { error: updateError } = await supabase
      .from('profiles')
      .update(update as any)
      .eq('id', user.id)

    if (updateError) {
      setError(String(updateError.message || updateError))
      setLoading(false)
      return
    }

    // Upload avatar if selected
    if (avatarFile) {
      const uploadedUrl = await uploadAvatar(avatarFile)
      if (uploadedUrl) update.avatar_url = uploadedUrl
    }

    await refreshProfile()
    setLoading(false)
    onComplete()
  }

  const handleSendOTP = async () => {
    setError('')
    const trimmed = phone.trim()
    if (trimmed.length < 10) {
      setError('Enter a valid phone number with country code')
      return
    }
    setLoading(true)
    const { data, error: otpErr } = await supabase.auth.signInWithOtp({ phone: trimmed })
    setLoading(false)
    if (otpErr) {
      setError(String(otpErr.message || otpErr))
    } else {
      setOtpSent(true)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
    setAvatarUrl('') // will be set after upload during completion
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
          aria-label="Your full name"
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
          aria-label="Your age"
        />
      ),
      canNext: age !== '' && parseInt(age) >= 18,
    },
    {
      title: 'Which university?',
      subtitle: 'Find your campus community',
      content: (
        <div className="relative" ref={uniDropdownRef}>
          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={universitySearch}
              onChange={(e) => { setUniversitySearch(e.target.value); setShowUniDropdown(true) }}
              onFocus={() => setShowUniDropdown(true)}
              placeholder="Search your university..."
              className="w-full rounded-2xl pl-10 pr-4 py-3.5 text-sm outline-none text-foreground"
              style={{ background: '#f4f0f1', fontFamily: 'Nunito Sans, sans-serif' }}
              autoFocus
              aria-label="Search university"
              aria-expanded={showUniDropdown}
            />
          </div>
          {showUniDropdown && (
            <div
              className="absolute left-0 right-0 top-full mt-1 rounded-2xl overflow-hidden shadow-xl z-30 max-h-52 overflow-y-auto"
              style={{ background: 'white', border: '1.5px solid rgba(139,26,46,0.1)' }}
            >
              {filteredUnis.length === 0 ? (
                <p className="px-4 py-3 text-sm text-muted-foreground">No universities found</p>
              ) : (
                filteredUnis.map((uni) => (
                  <button
                    key={uni.id}
                    onClick={() => {
                      setUniversityId(uni.id)
                      setUniversitySearch(uni.name)
                      setShowUniDropdown(false)
                    }}
                    className={`w-full text-left px-4 py-3 text-sm font-semibold hover:bg-secondary transition-colors ${
                      universityId === uni.id ? 'text-foreground font-black' : 'text-muted-foreground'
                    }`}
                    style={universityId === uni.id ? { background: '#f0e8ea', color: '#8B1A2E' } : {}}
                    aria-selected={universityId === uni.id}
                  >
                    {uni.name}
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      ),
      canNext: true,
    },
    {
      title: 'Phone number',
      subtitle: 'For account recovery & verification',
      content: (
        <div className="flex flex-col gap-3">
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+254 712 345 678"
            className="w-full rounded-2xl px-4 py-3.5 text-sm outline-none text-foreground text-center"
            style={{ background: '#f4f0f1', fontFamily: 'Nunito Sans, sans-serif' }}
            disabled={otpSent}
            autoFocus
            aria-label="Phone number with country code"
          />
          {otpSent && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
              <input
                type="text"
                inputMode="numeric"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="6-digit code"
                className="w-full rounded-2xl px-4 py-3 text-sm outline-none text-foreground text-center tracking-widest"
                style={{ background: '#f4f0f1', fontFamily: 'Nunito Sans, sans-serif' }}
                aria-label="6-digit verification code"
              />
            </motion.div>
          )}
          {!otpSent ? (
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={handleSendOTP}
              disabled={phone.trim().length < 10 || loading}
              className="w-full py-3 rounded-2xl font-black text-white text-sm disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg,#8B1A2E,#C0395A)' }}
              aria-label="Send verification code"
            >
              {loading ? 'Sending...' : 'Send Code 📱'}
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => setOtpSent(false)}
              className="w-full py-2 text-sm font-semibold text-muted-foreground"
              aria-label="Change phone number"
            >
              Change number
            </motion.button>
          )}
        </div>
      ),
      canNext: true,
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
          aria-label="Your bio"
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
          aria-label="Your interests, comma separated"
        />
      ),
      canNext: true,
    },
    {
      title: 'Add a profile photo',
      subtitle: 'Put a face to the name ✨',
      content: (
        <div className="flex flex-col items-center gap-4">
          {avatarPreview ? (
            <div className="relative">
              <img
                src={avatarPreview}
                alt="Profile preview"
                className="w-36 h-36 rounded-3xl object-cover shadow-lg"
                style={{ border: '3px solid rgba(139,26,46,0.3)' }}
              />
              <button
                onClick={() => { setAvatarFile(null); setAvatarPreview(''); fileInputRef.current!.value = '' }}
                className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center"
                aria-label="Remove photo"
              >
                <X size={14} style={{ color: '#EF4444' }} />
              </button>
            </div>
          ) : (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => fileInputRef.current?.click()}
              className="w-36 h-36 rounded-3xl flex flex-col items-center justify-center gap-2"
              style={{ background: '#f4f0f1', border: '2px dashed rgba(139,26,46,0.25)' }}
              aria-label="Upload profile photo"
            >
              <Upload size={24} style={{ color: '#8B1A2E' }} />
              <span className="text-xs font-bold" style={{ color: '#8B1A2E' }}>Choose photo</span>
            </motion.button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
            aria-hidden="true"
          />
          <p className="text-xs text-muted-foreground">You can skip this and add a photo later</p>
        </div>
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
            {universitySearch ? `${universitySearch} — ready to connect!` : "You're ready — let's go!"}
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
      <div className="flex gap-1.5 mb-8" role="progressbar" aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={steps.length}>
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
            <p className="text-sm text-destructive font-semibold mt-4" role="alert">{error}</p>
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
            aria-label="Go back"
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
          aria-label={currentStep.isLast ? 'Complete onboarding' : 'Next step'}
        >
          {loading ? 'Saving...' : currentStep.isLast ? 'Get Started 💫' : 'Next'}
          {!currentStep.isLast && !loading && <ChevronRight size={18} />}
        </motion.button>
      </div>
    </div>
  )
}
