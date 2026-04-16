import { useState, useRef } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import Logo from '../lib/Logo'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { getAppUrl, getMainUrl } from '../lib/urls'

// ─── BRAND TOKENS ─────────────────────────────────────────────────────────────
const BLUE_PRIMARY = '#1E4DD7'
const BLUE_MID = '#3B75FF'
const BLUE_LIGHT = '#6094FF'
const BG_PAGE = '#F7F9FF'
const BG_CARD = '#FFFFFF'
const BG_FIELD = '#FAFBFF'
const BORDER_FIELD = '#E4E8FF'
const BORDER_CARD = '#ECEEFF'
const TEXT_HEADING = '#18181B'
const TEXT_BODY = '#4D4D56'
const TEXT_MUTED = '#82858A'
const TEXT_SUBTLE = '#B0B4C4'
const GREEN = '#21C474'
const RED = '#EF4369'

// ─── ANIMATIONS ───────────────────────────────────────────────────────────────
const panelVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: 'easeIn' } },
}
const leftVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.22, ease: 'easeIn' } },
}

// ─── BUTTON HOVER HELPERS ────────────────────────────────────────────────────
const ctaStyle = {
  width: '100%',
  padding: '15px',
  background: `linear-gradient(135deg, ${BLUE_PRIMARY} 0%, ${BLUE_MID} 100%)`,
  color: '#FFFFFF',
  border: 'none',
  borderRadius: '14px',
  fontSize: '15px',
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: '"Inter", sans-serif',
  letterSpacing: '-0.2px',
  boxShadow: '0px 8px 24px rgba(30,77,215,0.35)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  transition: 'all 0.18s ease',
}
function ctaHover(e) {
  e.currentTarget.style.boxShadow = '0px 12px 32px rgba(30,77,215,0.45)'
  e.currentTarget.style.transform = 'translateY(-1px)'
}
function ctaOut(e) {
  e.currentTarget.style.boxShadow = '0px 8px 24px rgba(30,77,215,0.35)'
  e.currentTarget.style.transform = 'translateY(0)'
}

// ─── ICONS ────────────────────────────────────────────────────────────────────
function JapaLearnLogo({ size = 36, white = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <circle cx="50" cy="50" r="47" stroke={white ? 'rgba(255,255,255,0.7)' : BLUE_PRIMARY} strokeWidth="3.5" fill={white ? 'rgba(255,255,255,0.08)' : 'white'} />
      <path d="M50 12 L82 30 L82 70 L50 88 L18 70 L18 30 Z" fill={white ? 'white' : BLUE_PRIMARY} />
      <path d="M50 22 C50 22 47 38 34 50 C47 62 50 78 50 78 C50 78 53 62 66 50 C53 38 50 22 50 22 Z" fill={white ? BLUE_PRIMARY : 'white'} />
      <path d="M50 58 C50 58 44 64 34 68 C40 72 50 78 50 78 C50 78 46 68 50 58 Z" fill={white ? BLUE_PRIMARY : 'white'} opacity="0.7" />
      <line x1="56" y1="70" x2="72" y2="66" stroke={white ? BLUE_PRIMARY : 'white'} strokeWidth="3.5" strokeLinecap="round" />
      <line x1="58" y1="76" x2="70" y2="73" stroke={white ? BLUE_PRIMARY : 'white'} strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}
function GoogleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M47.532 24.552c0-1.636-.132-3.196-.384-4.688H24.48v9.02h12.964c-.568 2.94-2.22 5.432-4.692 7.1v5.888h7.58c4.436-4.08 6.996-10.1 6.996-17.32z" fill="#4285F4" />
      <path d="M24.48 48c6.48 0 11.916-2.148 15.888-5.824l-7.58-5.888c-2.148 1.44-4.896 2.284-8.308 2.284-6.38 0-11.788-4.308-13.724-10.1H3.02v6.088C6.98 42.892 15.12 48 24.48 48z" fill="#34A853" />
      <path d="M10.756 28.472A14.46 14.46 0 0 1 9.952 24c0-1.552.272-3.06.804-4.472v-6.088H3.02A23.94 23.94 0 0 0 .48 24c0 3.864.924 7.52 2.54 10.56l7.736-6.088z" fill="#FBBC05" />
      <path d="M24.48 9.428c3.596 0 6.82 1.236 9.364 3.652l6.996-6.996C36.396 2.14 30.96 0 24.48 0 15.12 0 6.98 5.108 3.02 13.44l7.736 6.088c1.936-5.792 7.344-10.1 13.724-10.1z" fill="#EA4335" />
    </svg>
  )
}
function IconMail({ size = 15, color = 'currentColor' }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
}
function IconLock({ size = 15, color = 'currentColor' }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
}
function IconUser({ size = 15, color = 'currentColor' }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
}
function IconEye({ size = 15, color = 'currentColor' }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
}
function IconEyeOff({ size = 15, color = 'currentColor' }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" y1="2" x2="22" y2="22" /></svg>
}
function IconArrowRight({ size = 14, color = 'currentColor' }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
}
function IconAlert({ size = 14, color = 'currentColor' }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
}
function IconCheck({ size = 28, color = 'currentColor' }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
}
function IconSparkle({ size = 12, color = 'currentColor' }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></svg>
}
function IconTarget({ size = 12, color = 'currentColor' }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>
}
function IconBook({ size = 12, color = 'currentColor' }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
}
function IconShield({ size = 12, color = 'currentColor' }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
}
function IconFlag({ size = 12, color = 'currentColor' }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></svg>
}

// ─── DATA ─────────────────────────────────────────────────────────────────────
const FEATURES = [
  { id: 'f1', iconKey: 'target', text: 'Personalised AI curriculum for your exact profession' },
  { id: 'f2', iconKey: 'book',   text: 'Locked lesson progression — step by step' },
  { id: 'f3', iconKey: 'shield', text: 'Official government sources, cited' },
  { id: 'f4', iconKey: 'flag',   text: 'NGN cost estimates for every route' },
]
const STATS = [
  { id: 's1', value: '12K+', label: 'Professionals' },
  { id: 's2', value: '40+',  label: 'Countries' },
  { id: 's3', value: '98%',  label: 'Success rate' },
]

function FeatureIcon({ iconKey }) {
  const color = 'rgba(255,255,255,0.85)'
  if (iconKey === 'target') return <IconTarget size={12} color={color} />
  if (iconKey === 'book')   return <IconBook size={12} color={color} />
  if (iconKey === 'shield') return <IconShield size={12} color={color} />
  if (iconKey === 'flag')   return <IconFlag size={12} color={color} />
  return null
}

// ─── INPUT FIELD ──────────────────────────────────────────────────────────────
function InputField({ id, label, type, placeholder, value, onChange, onFocus, onBlur, focused, autoComplete, required, icon, rightSlot, error }) {
  return (
    <div>
      <label htmlFor={id} style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: TEXT_BODY, marginBottom: '6px', fontFamily: '"Inter", sans-serif' }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: error ? RED : focused ? BLUE_PRIMARY : TEXT_SUBTLE, pointerEvents: 'none', display: 'flex', alignItems: 'center' }}>
          {icon}
        </span>
        <input
          id={id} type={type} placeholder={placeholder} value={value} onChange={onChange}
          onFocus={onFocus} onBlur={onBlur} autoComplete={autoComplete} required={required}
          style={{
            width: '100%', padding: '13px 44px 13px 42px',
            border: `1.5px solid ${error ? RED + '88' : focused ? BLUE_MID : BORDER_FIELD}`,
            borderRadius: '12px', fontSize: '15px', color: TEXT_HEADING,
            background: focused ? BG_CARD : BG_FIELD, outline: 'none', boxSizing: 'border-box',
            fontFamily: '"Inter", sans-serif',
            boxShadow: focused ? '0 0 0 4px rgba(30,77,215,0.08)' : error ? '0 0 0 3px rgba(239,67,105,0.08)' : 'none',
            transition: 'all 0.18s ease',
          }}
        />
        {rightSlot && (
          <div style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center' }}>
            {rightSlot}
          </div>
        )}
      </div>
      {error && (
        <p style={{ margin: '6px 0 0', fontSize: '12px', fontWeight: 500, color: RED, display: 'flex', alignItems: 'center', gap: '4px', fontFamily: '"Inter", sans-serif' }}>
          <IconAlert size={12} color={RED} /><span>{error}</span>
        </p>
      )}
    </div>
  )
}

// ─── LEFT PANEL ───────────────────────────────────────────────────────────────
function LeftPanel({ view, quizScore }) {
  const isLogin = view === 'login'
  return (
    <aside
      style={{
        background: `linear-gradient(145deg, #0F2E99 0%, ${BLUE_PRIMARY} 45%, ${BLUE_MID} 80%, ${BLUE_LIGHT} 100%)`,
        width: '44%', minHeight: '100vh', display: 'none', flexDirection: 'column',
        position: 'relative', overflow: 'hidden', flexShrink: 0,
      }}
      className="lg-left-panel"
    >
      {/* Grid overlay */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      {/* Glows */}
      <div aria-hidden="true" style={{ position: 'absolute', bottom: '-100px', left: '-100px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,117,255,0.45) 0%, transparent 65%)', filter: 'blur(50px)', pointerEvents: 'none' }} />
      <div aria-hidden="true" style={{ position: 'absolute', top: '-80px', right: '-80px', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 65%)', filter: 'blur(40px)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', height: '100%', padding: '36px 40px' }}>
        <div style={{ flex: 1 }} />

        <AnimatePresence mode="wait">
          {isLogin ? (
            <motion.div key="lp-login" variants={leftVariants} initial="hidden" animate="visible" exit="exit" style={{ marginBottom: '32px' }}>
              <h1 style={{ margin: '0 0 14px', fontSize: 'clamp(28px, 2.8vw, 38px)', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.8px', lineHeight: 1.12, fontFamily: '"DM Sans", sans-serif' }}>
                Your migration journey<br />
                <em style={{ fontStyle: 'normal', color: 'rgba(255,255,255,0.55)' }}>continues here.</em>
              </h1>
              <p style={{ margin: '0 0 32px', fontSize: '14px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, maxWidth: '280px', fontFamily: '"Inter", sans-serif' }}>
                Welcome back. Pick up right where you left off on your relocation journey.
              </p>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {FEATURES.map(feat => (
                  <li key={feat.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <span style={{ width: '26px', height: '26px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                      <FeatureIcon iconKey={feat.iconKey} />
                    </span>
                    <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.80)', lineHeight: 1.55, fontFamily: '"Inter", sans-serif' }}>{feat.text}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ) : (
            <motion.div key="lp-signup" variants={leftVariants} initial="hidden" animate="visible" exit="exit" style={{ marginBottom: '32px' }}>
              <h1 style={{ margin: '0 0 14px', fontSize: 'clamp(28px, 2.8vw, 38px)', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.8px', lineHeight: 1.12, fontFamily: '"DM Sans", sans-serif' }}>
                Your migration<br />
                <em style={{ fontStyle: 'normal', color: 'rgba(255,255,255,0.55)' }}>starts here.</em>
              </h1>
              <p style={{ margin: '0 0 24px', fontSize: '14px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, maxWidth: '280px', fontFamily: '"Inter", sans-serif' }}>
                Join thousands of Nigerian professionals already navigating their relocation with confidence.
              </p>
              {quizScore && (
                <div style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: '18px', padding: '20px 22px', marginBottom: '24px', backdropFilter: 'blur(16px)' }}>
                  <p style={{ margin: '0 0 6px', fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: '"Inter", sans-serif' }}>YOUR READINESS SCORE</p>
                  <p style={{ margin: '0 0 4px', fontSize: '52px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-3px', lineHeight: 1, fontFamily: '"DM Sans", sans-serif' }}>{quizScore}</p>
                  <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.45)', fontFamily: '"Inter", sans-serif' }}>out of 100 — saved when you sign up</p>
                </div>
              )}
              <ul style={{ listStyle: 'none', margin: '0 0 24px', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {FEATURES.map(feat => (
                  <li key={feat.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <span style={{ width: '26px', height: '26px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                      <FeatureIcon iconKey={feat.iconKey} />
                    </span>
                    <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.80)', lineHeight: 1.55, fontFamily: '"Inter", sans-serif' }}>{feat.text}</span>
                  </li>
                ))}
              </ul>
              <div style={{ display: 'flex', alignItems: 'center', gap: 0, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px', padding: '16px 20px', backdropFilter: 'blur(16px)' }}>
                {STATS.map((stat, idx) => (
                  <div key={stat.id} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <div style={{ textAlign: 'center', flex: 1 }}>
                      <p style={{ margin: '0 0 2px', fontSize: '18px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.4px', lineHeight: 1, fontFamily: '"DM Sans", sans-serif' }}>{stat.value}</p>
                      <p style={{ margin: 0, fontSize: '10px', fontWeight: 600, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.05em', fontFamily: '"Inter", sans-serif' }}>{stat.label}</p>
                    </div>
                    {idx < STATS.length - 1 && <div style={{ width: '1px', height: '28px', background: 'rgba(255,255,255,0.15)' }} />}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <footer>
          <p style={{ margin: 0, fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontFamily: '"Inter", sans-serif' }}>
            {isLogin ? '© 2026 JapaLearn AI · Not a visa agency' : '© 2026 JapaLearn AI · NDPR Protected'}
          </p>
        </footer>
      </div>
    </aside>
  )
}

// ─── MAIN AUTH CARD COMPONENT ─────────────────────────────────────────────────
// defaultView: 'login' | 'signup'
export default function AuthCard({ defaultView = 'signup' }) {
  const router = useRouter()
  const { answers, score } = router.query

  const [view, setView] = useState(defaultView)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  // Signup fields
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [signupError, setSignupError] = useState('')
  const [nameFocused, setNameFocused] = useState(false)
  const [emailFocused, setEmailFocused] = useState(false)
  const [pwFocused, setPwFocused] = useState(false)

  // Login fields
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [showLoginPw, setShowLoginPw] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [loginEmailFocused, setLoginEmailFocused] = useState(false)
  const [loginPwFocused, setLoginPwFocused] = useState(false)

  // Done state (loading screen before redirect)
  const [done, setDone] = useState(false)

  function goToLogin() { setView('login'); setLoginError(''); setSignupError('') }
  function goToSignup() {
    if (!answers || !score) {
      window.location.href = getMainUrl('/quiz')
      return
    }
    setView('signup'); setPasswordError(''); setSignupError('')
  }

  const handleGoogle = async () => {
    setGoogleLoading(true)
    if (answers && score) {
      localStorage.setItem('pending_quiz_answers', answers)
      localStorage.setItem('pending_quiz_score', score)
    }
    if (view === 'signup') localStorage.setItem('just_signed_up', 'true')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    })
    if (error) { setLoginError(error.message); setGoogleLoading(false) }
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    if (password.length < 6) { setPasswordError('Password must be at least 6 characters'); return }
    setPasswordError(''); setSignupError(''); setLoading(true)
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: fullName } },
    })
    if (error) { setSignupError(error.message); setLoading(false); return }
    if (answers && score) {
      localStorage.setItem('pending_quiz_answers', answers)
      localStorage.setItem('pending_quiz_score', score)
    }
    if (fullName) localStorage.setItem('pending_full_name', fullName)
    localStorage.setItem('just_signed_up', 'true')
    setLoading(false)
    setDone(true)
    setTimeout(() => { window.location.href = getAppUrl('/dashboard') }, 2800)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!loginEmail || !loginPassword) { setLoginError('Please enter your email and password'); return }
    setLoginError(''); setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPassword })
    if (error) { setLoginError(error.message); setLoading(false); return }
    setLoading(false)
    setDone(true)
    setTimeout(() => { window.location.href = getAppUrl('/dashboard') }, 2800)
  }

  if (done) {
    return (
      <div style={{ minHeight: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: BG_PAGE, fontFamily: '"Inter", sans-serif' }}>
        <div style={{ textAlign: 'center', maxWidth: '320px', padding: '0 20px' }}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            style={{ width: '64px', height: '64px', borderRadius: '18px', background: 'linear-gradient(135deg, #EBF1FF, #D8E6FF)', border: '1.5px solid rgba(30,77,215,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0px 8px 24px rgba(30,77,215,0.15)' }}
          >
            <IconCheck size={28} color={BLUE_PRIMARY} />
          </motion.div>
          <h1 style={{ margin: '0 0 8px', fontSize: '24px', fontWeight: 700, color: TEXT_HEADING, letterSpacing: '-0.5px', fontFamily: '"DM Sans", sans-serif' }}>Setting up your dashboard</h1>
          <p style={{ margin: '0 0 32px', fontSize: '14px', color: TEXT_MUTED, lineHeight: 1.7, fontFamily: '"Inter", sans-serif' }}>Personalising your migration curriculum — this only takes a moment.</p>
          <div style={{ width: '100%', height: '4px', background: '#F0F2FF', borderRadius: '2px', overflow: 'hidden', marginBottom: '14px' }}>
            <motion.div
              style={{ height: '100%', background: `linear-gradient(90deg, ${BLUE_PRIMARY}, ${BLUE_MID})`, borderRadius: '2px' }}
              initial={{ width: '0%' }} animate={{ width: '100%' }}
              transition={{ duration: 2.8, ease: 'linear' }}
            />
          </div>
          <p style={{ margin: 0, fontSize: '13px', color: TEXT_MUTED, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontFamily: '"Inter", sans-serif' }}>
            <IconSparkle size={12} color={BLUE_PRIMARY} />
            <span>Launching your dashboard…</span>
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <style>{`
        @media (min-width: 1024px) {
          .lg-left-panel { display: flex !important; }
        }
      `}</style>

      <div style={{ minHeight: '100vh', width: '100%', display: 'flex', background: BG_PAGE }}>
        <LeftPanel view={view} quizScore={score} />

        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px', boxSizing: 'border-box' }}>

          {/* Card */}
          <div style={{ width: '100%', maxWidth: '440px' }}>
            <div style={{ background: BG_CARD, borderRadius: '28px', boxShadow: '0px 32px 80px rgba(30,77,215,0.12), 0px 0px 0px 1px rgba(30,77,215,0.06)', overflow: 'hidden' }}>

              {/* Tab bar */}
              <div style={{ padding: '28px 36px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px', justifyContent: 'center' }}>
                  <Logo size={40} />
                  <div>
                    <span style={{ fontSize: '18px', fontWeight: 700, color: '#000000', letterSpacing: '-0.4px', fontFamily: '"DM Sans", sans-serif' }}>JapaLearn </span>
                    <span style={{ fontSize: '15px', fontWeight: 800, color: BLUE_PRIMARY, marginLeft: '4px', fontFamily: '"DM Sans", sans-serif' }}>AI</span>
                  </div>
                </div>

                <div style={{ display: 'flex', background: '#F4F6FF', borderRadius: '14px', padding: '4px', marginBottom: '28px' }}>
                  {['login', 'signup'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => {
                        if (tab === 'signup' && (!answers || !score)) {
                          router.push('/quiz')
                          return
                        }
                        tab === 'login' ? goToLogin() : goToSignup()
                      }}
                      style={{
                        flex: 1, padding: '10px 16px', border: 'none', borderRadius: '10px',
                        fontSize: '14px', fontWeight: view === tab ? 600 : 400,
                        color: view === tab ? BLUE_PRIMARY : TEXT_MUTED,
                        background: view === tab ? BG_CARD : 'transparent',
                        boxShadow: view === tab ? '0px 2px 8px rgba(30,77,215,0.12)' : 'none',
                        cursor: 'pointer', transition: 'all 0.18s ease', fontFamily: '"Inter", sans-serif',
                      }}
                    >
                      {tab === 'login' ? 'Sign In' : 'Create Account'}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ padding: '0 36px 36px' }}>
                <AnimatePresence mode="wait" initial={false}>

                  {/* ── LOGIN VIEW ── */}
                  {view === 'login' && (
                    <motion.section key="login" variants={panelVariants} initial="hidden" animate="visible" exit="exit">
                      <h1 style={{ margin: '0 0 6px', fontSize: '26px', fontWeight: 700, color: TEXT_HEADING, letterSpacing: '-0.6px', fontFamily: '"DM Sans", sans-serif' }}>Welcome back</h1>
                      <p style={{ margin: '0 0 24px', fontSize: '14px', color: TEXT_MUTED, lineHeight: 1.5, fontFamily: '"Inter", sans-serif' }}>Sign in to continue your migration journey</p>

                      <button
                        type="button" onClick={handleGoogle} disabled={googleLoading}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '13px 16px', background: BG_CARD, border: `1.5px solid ${BORDER_FIELD}`, borderRadius: '12px', fontSize: '14px', fontWeight: 600, color: TEXT_BODY, cursor: 'pointer', fontFamily: '"Inter", sans-serif', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', marginBottom: '20px', transition: 'all 0.15s', opacity: googleLoading ? 0.6 : 1 }}
                      >
                        <GoogleIcon />
                        <span>{googleLoading ? 'Redirecting…' : 'Continue with Google'}</span>
                      </button>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                        <div style={{ flex: 1, height: '1px', background: '#F0F2FF' }} />
                        <span style={{ fontSize: '11px', fontWeight: 700, color: TEXT_SUBTLE, letterSpacing: '0.1em', fontFamily: '"Inter", sans-serif' }}>OR</span>
                        <div style={{ flex: 1, height: '1px', background: '#F0F2FF' }} />
                      </div>

                      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <InputField id="login-email" label="Email address" type="email" placeholder="you@example.com" value={loginEmail} onChange={e => { setLoginEmail(e.target.value); setLoginError('') }} onFocus={() => setLoginEmailFocused(true)} onBlur={() => setLoginEmailFocused(false)} focused={loginEmailFocused} autoComplete="email" required icon={<IconMail size={15} color={loginEmailFocused ? BLUE_PRIMARY : TEXT_SUBTLE} />} />
                        <InputField id="login-password" label="Password" type={showLoginPw ? 'text' : 'password'} placeholder="Your password" value={loginPassword} onChange={e => { setLoginPassword(e.target.value); setLoginError('') }} onFocus={() => setLoginPwFocused(true)} onBlur={() => setLoginPwFocused(false)} focused={loginPwFocused} autoComplete="current-password" required icon={<IconLock size={15} color={loginPwFocused ? BLUE_PRIMARY : TEXT_SUBTLE} />}
                          rightSlot={
                            <button type="button" onClick={() => setShowLoginPw(p => !p)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', color: TEXT_SUBTLE }}>
                              {showLoginPw ? <IconEyeOff size={15} /> : <IconEye size={15} />}
                            </button>
                          }
                        />

                        {loginError && (
                          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', background: 'rgba(239,67,105,0.06)', border: '1px solid rgba(239,67,105,0.18)', borderRadius: '10px', padding: '10px 14px' }}>
                            <IconAlert size={13} color={RED} />
                            <p style={{ margin: 0, fontSize: '12px', fontWeight: 500, color: RED, lineHeight: 1.5, fontFamily: '"Inter", sans-serif' }}>{loginError}</p>
                          </motion.div>
                        )}

                        <button type="submit" disabled={loading} style={{ ...ctaStyle, marginTop: '6px', opacity: loading ? 0.7 : 1 }} onMouseOver={ctaHover} onMouseOut={ctaOut}>
                          {loading ? <><span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} /> Signing in…</> : <><span>Sign In to JapaLearn AI</span><IconArrowRight size={14} color="#FFFFFF" /></>}
                        </button>
                      </form>

                      <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: TEXT_MUTED, fontFamily: '"Inter", sans-serif' }}>
                        Don&apos;t have an account?{' '}
                        <button type="button" onClick={goToSignup} style={{ background: 'none', border: 'none', color: BLUE_MID, fontWeight: 600, cursor: 'pointer', fontSize: '13px', padding: 0, fontFamily: '"Inter", sans-serif' }}>Take our free quiz</button>
                      </p>
                      <p style={{ textAlign: 'center', marginTop: '10px', fontSize: '11px', color: TEXT_SUBTLE, fontFamily: '"Inter", sans-serif' }}>Your data is protected under NDPR.</p>
                    </motion.section>
                  )}

                  {/* ── SIGNUP VIEW ── */}
                  {view === 'signup' && (
                    <motion.section key="signup" variants={panelVariants} initial="hidden" animate="visible" exit="exit">
                      <h1 style={{ margin: '0 0 6px', fontSize: '26px', fontWeight: 700, color: TEXT_HEADING, letterSpacing: '-0.6px', fontFamily: '"DM Sans", sans-serif' }}>Start your journey</h1>
                      <p style={{ margin: '0 0 24px', fontSize: '14px', color: TEXT_MUTED, lineHeight: 1.5, fontFamily: '"Inter", sans-serif' }}>Create your free account and unlock your migration report</p>

                      {score && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(30,77,215,0.05)', border: '1px solid rgba(30,77,215,0.12)', borderRadius: '12px', padding: '12px 16px', marginBottom: '20px' }}>
                          <p style={{ margin: 0, fontSize: '26px', fontWeight: 900, color: BLUE_PRIMARY, fontFamily: '"DM Sans", sans-serif', lineHeight: 1 }}>{score}</p>
                          <p style={{ margin: 0, fontSize: '13px', color: TEXT_BODY, fontFamily: '"Inter", sans-serif' }}>Your readiness score will be saved to your account</p>
                        </div>
                      )}

                      <button
                        type="button" onClick={handleGoogle} disabled={googleLoading}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '13px 16px', background: BG_CARD, border: `1.5px solid ${BORDER_FIELD}`, borderRadius: '12px', fontSize: '14px', fontWeight: 600, color: TEXT_BODY, cursor: 'pointer', fontFamily: '"Inter", sans-serif', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', marginBottom: '20px', transition: 'all 0.15s', opacity: googleLoading ? 0.6 : 1 }}
                      >
                        <GoogleIcon />
                        <span>{googleLoading ? 'Redirecting…' : 'Continue with Google'}</span>
                      </button>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                        <div style={{ flex: 1, height: '1px', background: '#F0F2FF' }} />
                        <span style={{ fontSize: '11px', fontWeight: 700, color: TEXT_SUBTLE, letterSpacing: '0.1em', fontFamily: '"Inter", sans-serif' }}>OR</span>
                        <div style={{ flex: 1, height: '1px', background: '#F0F2FF' }} />
                      </div>

                      <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <InputField id="signup-name" label="Full name" type="text" placeholder="Amara Okonkwo" value={fullName} onChange={e => setFullName(e.target.value)} onFocus={() => setNameFocused(true)} onBlur={() => setNameFocused(false)} focused={nameFocused} autoComplete="name" required icon={<IconUser size={15} color={nameFocused ? BLUE_PRIMARY : TEXT_SUBTLE} />} />
                        <InputField id="signup-email" label="Email address" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} onFocus={() => setEmailFocused(true)} onBlur={() => setEmailFocused(false)} focused={emailFocused} autoComplete="email" required icon={<IconMail size={15} color={emailFocused ? BLUE_PRIMARY : TEXT_SUBTLE} />} />
                        <InputField id="signup-password" label="Create password" type={showPassword ? 'text' : 'password'} placeholder="Min. 6 characters" value={password} onChange={e => { setPassword(e.target.value); if (passwordError) setPasswordError('') }} onFocus={() => setPwFocused(true)} onBlur={() => setPwFocused(false)} focused={pwFocused} autoComplete="new-password" required error={passwordError} icon={<IconLock size={15} color={pwFocused ? BLUE_PRIMARY : TEXT_SUBTLE} />}
                          rightSlot={
                            <button type="button" onClick={() => setShowPassword(p => !p)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', color: TEXT_SUBTLE }}>
                              {showPassword ? <IconEyeOff size={15} /> : <IconEye size={15} />}
                            </button>
                          }
                        />

                        {signupError && (
                          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', background: 'rgba(239,67,105,0.06)', border: '1px solid rgba(239,67,105,0.18)', borderRadius: '10px', padding: '10px 14px' }}>
                            <IconAlert size={13} color={RED} />
                            <p style={{ margin: 0, fontSize: '12px', fontWeight: 500, color: RED, lineHeight: 1.5, fontFamily: '"Inter", sans-serif' }}>{signupError}</p>
                          </motion.div>
                        )}

                        <button type="submit" disabled={loading} style={{ ...ctaStyle, marginTop: '4px', opacity: loading ? 0.7 : 1 }} onMouseOver={ctaHover} onMouseOut={ctaOut}>
                          {loading ? <><span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} /> Creating account…</> : <><span>Create Account &amp; View Report</span><IconArrowRight size={14} color="#FFFFFF" /></>}
                        </button>
                      </form>

                      <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: TEXT_MUTED, fontFamily: '"Inter", sans-serif' }}>
                        Already have an account?{' '}
                        <button type="button" onClick={goToLogin} style={{ background: 'none', border: 'none', color: BLUE_MID, fontWeight: 600, cursor: 'pointer', fontSize: '13px', padding: 0, fontFamily: '"Inter", sans-serif' }}>Sign in</button>
                      </p>
                      <p style={{ textAlign: 'center', marginTop: '12px', fontSize: '11px', color: TEXT_SUBTLE, lineHeight: 1.5, fontFamily: '"Inter", sans-serif' }}>
                        By creating an account, you agree to our <Link href="/terms" style={{ color: BLUE_MID, fontWeight: 500, textDecoration: 'underline' }}>Terms</Link> and <Link href="/privacy" style={{ color: BLUE_MID, fontWeight: 500, textDecoration: 'underline' }}>Privacy Policy</Link>.<br />
                        Your data is NDPR protected.
                      </p>
                    </motion.section>
                  )}

                </AnimatePresence>
              </div>
            </div>

            <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '11px', color: TEXT_SUBTLE, letterSpacing: '0.02em', fontFamily: '"Inter", sans-serif' }}>
              Secure · Encrypted · Trusted by 12,000+ professionals
            </p>
          </div>
        </main>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  )
}
