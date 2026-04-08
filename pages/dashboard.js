import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import Logo from '../lib/Logo'
import {
  LayoutDashboard, BookOpen, Map, FolderOpen, MessageSquare,
  Upload, Users, ShoppingBag, CreditCard, Settings, LogOut,
  Lock, ChevronRight, ChevronDown, ChevronUp, CheckCircle2,
  Circle, CircleCheck, PlayCircle, Sparkles, ArrowRight,
  RotateCcw, Globe2, Briefcase, Clock, Wallet, TrendingUp,
  Menu, X, User, Shield, Star, AlertCircle,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { getScoreFlag } from '../lib/quizData'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

// ── Country flags ──────────────────────────────────────────────────────────────
const COUNTRY_FLAGS = {
  'Canada': '🇨🇦', 'UK': '🇬🇧', 'USA': '🇺🇸', 'Germany': '🇩🇪',
  'Ireland': '🇮🇪', 'Australia': '🇦🇺', 'Netherlands': '🇳🇱',
  'Portugal': '🇵🇹', 'France': '🇫🇷', 'New Zealand': '🇳🇿',
  'Sweden': '🇸🇪', 'Norway': '🇳🇴', 'UAE': '🇦🇪', 'Singapore': '🇸🇬',
}

// ── Score breakdown factors ────────────────────────────────────────────────────
function getScoreBreakdown(answers, score) {
  const expMap = { '0 – 1 year': 4, '2 – 3 years': 10, '4 – 6 years': 18, '7 – 10 years': 25, '10+ years': 30 }
  const eduMap = {
    'High School / WAEC / NECO': 4, 'Diploma / OND / NCE': 8,
    "Bachelor's Degree (BSc / BA / MBBS / BPharm / LLB etc.)": 14,
    "Master's Degree (MSc / MBA / MA / LLM etc.)": 18, 'PhD / Doctorate': 20,
  }
  const langMap = {
    'Not taken': 0, 'Registered / scheduled': 2,
    'IELTS Academic — below 6.0': 4, 'IELTS Academic — 6.0 to 6.5': 10,
    'IELTS Academic — 7.0 to 7.5': 16, 'IELTS Academic — 8.0+': 20,
    'OET (Occupational English Test) — for healthcare': 18,
    'TOEFL iBT': 14, 'CELPIP — for Canada': 16,
  }
  const ageMap = { 'Under 20': 2, '20 – 24': 6, '25 – 30': 10, '31 – 35': 10, '36 – 40': 7, '41 – 45': 4, '46+': 2 }
  const savMap = { 'Less than ₦1M': 0, '₦1M – ₦5M': 3, '₦5M – ₦10M': 6, '₦10M – ₦20M': 8, '₦20M+': 10 }

  const exp = expMap[answers.experience] || 0
  const edu = eduMap[answers.education] || 0
  const lang = langMap[answers.language] || 0
  const age = ageMap[answers.age] || 0
  const sav = savMap[answers.savings] || 0
  const bonus = score - exp - edu - lang - age - sav

  return [
    { label: 'Work Experience', score: exp, max: 30, tip: exp < 18 ? 'More years of experience significantly boost your score' : 'Strong work history' },
    { label: 'Education Level', score: edu, max: 20, tip: edu < 14 ? 'A degree or postgrad qualification will improve your eligibility' : 'Good academic background' },
    { label: 'Language Test', score: lang, max: 20, tip: lang < 10 ? 'Taking IELTS or OET is one of the highest-impact actions you can take' : 'Language requirement on track' },
    { label: 'Age Factor', score: age, max: 10, tip: 'Age factor is fixed based on your profile' },
    { label: 'Savings & Funds', score: sav, max: 10, tip: sav < 6 ? 'Building your savings fund is critical for visa eligibility' : 'Good financial preparation' },
    { label: 'Profile Strength', score: Math.max(0, Math.min(bonus, 10)), max: 10, tip: bonus < 5 ? 'Job offers, certifications, and licensing progress boost this score' : 'Strong profile indicators' },
  ]
}

// ── Nav items ─────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'overview',   label: 'Home',           icon: LayoutDashboard, locked: false },
  { id: 'learning',   label: 'Learning',       icon: BookOpen,        locked: false },
  { id: 'roadmap',    label: 'My Roadmap',     icon: Map,             locked: false },
  { id: 'resources',  label: 'Resources',      icon: FolderOpen,      locked: false },
  { id: 'conversations', label: 'Conversations', icon: MessageSquare, locked: true, comingSoon: 'AI migration Q&A chatbot — in testing' },
  { id: 'documents',  label: 'Document Upload', icon: Upload,         locked: true, comingSoon: 'CV parsing & credential upload — AI profile enrichment' },
  { id: 'peers',      label: 'Peers',          icon: Users,           locked: true, comingSoon: 'Connect with people sharing your migration profile' },
  { id: 'marketplace', label: 'Marketplace',   icon: ShoppingBag,    locked: true, comingSoon: 'Verified consultants — rated, licence-checked, scam-protected' },
  { id: 'subscription', label: 'Subscription', icon: CreditCard,     locked: true, comingSoon: 'Plan management and upgrade options' },
]

// ── Sidebar ────────────────────────────────────────────────────────────────────
function Sidebar({ activeTab, setActiveTab, onSignOut, isMobileOpen, onMobileClose }) {
  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-40 lg:hidden"
            onClick={onMobileClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar panel */}
      <aside className={cn(
        "fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-100 flex flex-col z-50 transition-transform duration-300",
        "lg:translate-x-0",
        isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-slate-100">
          <Logo size={30} />
          <span className="font-bold text-sm text-slate-900">JapaLearn <span className="text-primary">AI</span></span>
          <button className="ml-auto lg:hidden text-slate-400 hover:text-slate-600" onClick={onMobileClose}>
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id

            if (item.locked) {
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 cursor-default group relative"
                >
                  <Icon size={16} className="shrink-0" />
                  <span className="text-sm font-medium flex-1">{item.label}</span>
                  <span className="text-[9px] font-bold bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded-full uppercase tracking-wide">Soon</span>
                </div>
              )
            }

            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); onMobileClose() }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <Icon size={16} className="shrink-0" />
                {item.label}
              </button>
            )
          })}
        </nav>

        {/* Bottom: Settings + Sign out */}
        <div className="px-3 py-4 border-t border-slate-100 space-y-0.5">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all">
            <Settings size={16} />
            Settings
          </button>
          <button
            onClick={onSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>
    </>
  )
}

// ── Top Header ─────────────────────────────────────────────────────────────────
function Header({ user, profile, onMobileMenuOpen }) {
  const initials = ((profile?.full_name || user?.email || 'U').split(/[\s@]/)[0][0] || 'U').toUpperCase()

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-slate-100 px-5 py-3.5 flex items-center justify-between">
      <button className="lg:hidden text-slate-600 hover:text-slate-900" onClick={onMobileMenuOpen}>
        <Menu size={22} />
      </button>
      <div className="flex-1" />
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold cursor-pointer hover:bg-primary/90 transition-colors">
          {initials}
        </div>
      </div>
    </header>
  )
}

// ── Main Dashboard ─────────────────────────────────────────────────────────────
export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [quizResult, setQuizResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/'); return }
      setUser(session.user)

      const pendingAnswers = localStorage.getItem('pending_quiz_answers')
      const pendingScore = localStorage.getItem('pending_quiz_score')
      if (pendingAnswers && pendingScore) {
        localStorage.removeItem('pending_quiz_answers')
        localStorage.removeItem('pending_quiz_score')
        try {
          const parsedAnswers = JSON.parse(pendingAnswers)
          await supabase.from('quiz_results').insert({
            user_id: session.user.id,
            answers: parsedAnswers,
            score: parseInt(pendingScore),
            destination: parsedAnswers.destination,
            segment: parsedAnswers.segment,
          })
        } catch (e) { console.error('Failed to save quiz result:', e) }
      }

      const [{ data: profileData }, { data: quizData }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle(),
        supabase.from('quiz_results').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false }).limit(1).maybeSingle(),
      ])
      setProfile(profileData)
      setQuizResult(quizData)
      setLoading(false)
    }
    load()
  }, [])

  const handleSignOut = async () => { await supabase.auth.signOut(); router.push('/') }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-sm">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const score = quizResult?.score || 0
  const answers = quizResult?.answers || {}
  const flag = getScoreFlag(score)
  const fullName = profile?.full_name || user?.email || ''
  const firstName = fullName.split(/[\s@]/)[0]
  const displayName = firstName.charAt(0).toUpperCase() + firstName.slice(1)
  const isNewUser = !quizResult

  return (
    <>
      <Head><title>Dashboard — JapaLearn AI</title></Head>
      <div className="min-h-screen bg-[#f6f9ff] flex">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onSignOut={handleSignOut}
          isMobileOpen={isMobileOpen}
          onMobileClose={() => setIsMobileOpen(false)}
        />

        {/* Main content — offset by sidebar width on desktop */}
        <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
          <Header user={user} profile={profile} onMobileMenuOpen={() => setIsMobileOpen(true)} />

          <main className="flex-1 px-5 md:px-8 py-8 max-w-6xl mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'overview'  && <OverviewTab answers={answers} score={score} flag={flag} displayName={displayName} isNewUser={isNewUser} router={router} quizResult={quizResult} />}
                {activeTab === 'learning'  && <LearningTab answers={answers} userId={user?.id} />}
                {activeTab === 'roadmap'   && <RoadmapTab answers={answers} score={score} />}
                {activeTab === 'resources' && <ResourcesTab answers={answers} />}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </>
  )
}

// ── OVERVIEW TAB ───────────────────────────────────────────────────────────────
function OverviewTab({ answers, score, flag, displayName, isNewUser, router, quizResult }) {
  const flagConfig = {
    green:  { label: 'Strong Profile',      color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', bar: 'bg-emerald-500', ring: 'ring-emerald-200' },
    yellow: { label: 'Developing Profile',  color: 'text-blue-600',    bg: 'bg-blue-50',    border: 'border-blue-200',   bar: 'bg-blue-500',    ring: 'ring-blue-200'    },
    red:    { label: 'Needs Improvement',   color: 'text-rose-600',    bg: 'bg-rose-50',    border: 'border-rose-200',   bar: 'bg-rose-500',    ring: 'ring-rose-200'    },
  }
  const fc = flagConfig[flag]
  const destinationFlag = COUNTRY_FLAGS[answers.destination] || '🌍'
  const breakdown = quizResult ? getScoreBreakdown(answers, score) : []

  const aspirationalMessages = {
    green: `Your profile is strong. You're closer than you think — this is where preparation meets opportunity. Let's make it happen.`,
    yellow: `You're building something real. Every lesson completed, every document gathered, every step taken brings ${answers.destination || 'your destination'} closer.`,
    red: `Every great migration journey starts with a single step. You've taken yours. Now let's build the profile that gets you there.`,
  }

  const checklistItems = [
    { id: 'quiz', label: 'Complete migration assessment', done: !!quizResult, cta: () => router.push('/quiz') },
    { id: 'curriculum', label: 'Generate your learning path', done: false, cta: null },
    { id: 'module1', label: 'Complete Module 1 of your learning path', done: false, cta: null },
    { id: 'language', label: 'Register for language test (IELTS / OET / TOEFL)', done: !!(answers.language && answers.language !== 'Not taken'), cta: null },
    { id: 'documents', label: 'Gather core documents (passport, degree, NYSC)', done: false, cta: null },
    { id: 'savings', label: 'Build migration savings fund', done: !!(answers.savings && !answers.savings.startsWith('Less')), cta: null },
  ]
  const completedCount = checklistItems.filter(i => i.done).length

  const profileFields = [
    { label: 'Destination', value: answers.destination ? `${destinationFlag} ${answers.destination}` : '—' },
    { label: 'Profile Type', value: answers.segment || '—' },
    { label: 'Education', value: answers.education || '—' },
    { label: 'Experience', value: answers.experience || '—' },
    { label: 'Language Test', value: answers.language || '—' },
    { label: 'Savings', value: answers.savings || '—' },
    { label: 'Age Range', value: answers.age || '—' },
    { label: 'Relocating With', value: answers.family_situation || '—' },
  ]

  if (!quizResult) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome to JapaLearn AI, {displayName}! 👋</h1>
          <p className="text-slate-500 mt-1 text-sm">Let's get started by building your migration profile.</p>
        </div>
        <div className="bg-white border border-border rounded-2xl p-8 text-center shadow-card-md max-w-lg mx-auto">
          <div className="text-5xl mb-4">🌍</div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Take the Free AI Quiz</h2>
          <p className="text-slate-500 text-sm mb-6 leading-relaxed">Answer a few questions and get your personalised readiness score, visa route, and migration roadmap.</p>
          <button
            onClick={() => router.push('/quiz')}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-8 rounded-full transition-all text-sm shadow-sm"
          >
            Start Assessment <ArrowRight size={14} />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className={`rounded-2xl border ${fc.border} ${fc.bg} p-6`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{destinationFlag}</span>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{answers.destination || 'Migration Journey'}</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight mb-1">Welcome back, {displayName}!</h1>
            <p className="text-slate-600 text-sm leading-relaxed max-w-lg">{aspirationalMessages[flag]}</p>
          </div>
          <button
            onClick={() => router.push('/quiz')}
            className="flex items-center gap-1.5 text-slate-400 hover:text-slate-600 text-xs transition-colors font-medium shrink-0 self-start sm:self-center"
          >
            <RotateCcw size={12} /> Retake quiz
          </button>
        </div>
      </div>

      {/* Row 1: Score + Checklist */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Readiness Score Card */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-card">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-5">Readiness Score</p>
          <div className="flex items-center gap-6">
            <div className={`relative w-24 h-24 rounded-full ring-4 ${fc.ring} flex flex-col items-center justify-center shrink-0`}>
              <span className={`text-3xl font-black leading-none ${fc.color}`}>{score}</span>
              <span className="text-xs text-slate-400 font-medium">/100</span>
            </div>
            <div>
              <div className={`text-sm font-bold ${fc.color} mb-1`}>{fc.label}</div>
              <div className="flex items-center gap-2 text-slate-500 text-sm mb-0.5">
                <Globe2 size={13} /> {answers.destination || '—'}
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <Briefcase size={12} /> {answers.segment || '—'}
              </div>
            </div>
          </div>
          <div className="mt-5 w-full bg-slate-100 rounded-full h-2">
            <div className={`${fc.bar} h-2 rounded-full transition-all duration-700`} style={{ width: `${score}%` }} />
          </div>
          <p className="text-xs text-slate-400 mt-2">Score increases as you complete learning modules and checklist actions</p>
        </div>

        {/* Action Checklist */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Action Checklist</p>
            <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">{completedCount}/{checklistItems.length}</span>
          </div>
          <div className="space-y-3">
            {checklistItems.map((item) => (
              <div
                key={item.id}
                onClick={item.cta && !item.done ? item.cta : undefined}
                className={cn("flex items-center gap-3", item.cta && !item.done ? "cursor-pointer group" : "")}
              >
                <div className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                  item.done ? "bg-emerald-500 border-emerald-500" : "border-slate-300"
                )}>
                  {item.done && <CheckCircle2 size={11} className="text-white" />}
                </div>
                <span className={cn(
                  "text-sm flex-1",
                  item.done ? "text-slate-400 line-through" : "text-slate-700",
                  item.cta && !item.done ? "group-hover:text-primary" : ""
                )}>
                  {item.label}
                </span>
                {item.cta && !item.done && <ChevronRight size={13} className="text-slate-300 group-hover:text-primary transition-colors" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Destination Visual + Profile Card */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Destination Visualisation */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-card">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-5">Your Destination</p>
          <div className="flex flex-col items-center text-center py-4">
            <div className="text-7xl mb-4">{destinationFlag}</div>
            <h3 className="text-2xl font-bold text-slate-900 mb-1">{answers.destination || 'Not selected'}</h3>
            <p className="text-slate-500 text-sm">{answers.segment || ''}</p>
            {answers.destination && (
              <div className="mt-4 inline-flex items-center gap-2 bg-primary/5 text-primary text-xs font-semibold px-4 py-2 rounded-full">
                <Shield size={12} /> Migration pathway identified
              </div>
            )}
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-card">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-5">Your Profile</p>
          <div className="grid grid-cols-2 gap-2.5">
            {profileFields.map(field => (
              <div key={field.label} className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                <div className="text-slate-400 text-[10px] uppercase tracking-wide mb-1">{field.label}</div>
                <div className="text-slate-900 font-semibold text-xs leading-snug">{field.value}</div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-slate-400 mt-3 text-center">Profile is locked — retake quiz to update</p>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="bg-white border border-border rounded-2xl p-6 shadow-card">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-5">Score Breakdown</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {breakdown.map((factor) => {
            const pct = Math.round((factor.score / factor.max) * 100)
            const isStrength = pct >= 70
            const isWeak = pct < 40
            return (
              <div key={factor.label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">{factor.label}</span>
                  <span className="text-xs font-bold text-slate-500">{factor.score}/{factor.max}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div
                    className={cn("h-1.5 rounded-full transition-all duration-700", isStrength ? "bg-emerald-500" : isWeak ? "bg-rose-400" : "bg-blue-400")}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">{factor.tip}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── LEARNING TAB (was Curriculum) ──────────────────────────────────────────────
function LearningTab({ answers, userId }) {
  const router = useRouter()
  const [curriculum, setCurriculum] = useState(null)
  const [loading, setLoading] = useState(false)
  const [genError, setGenError] = useState('')
  const [progress, setProgress] = useState({})
  const [expandedModule, setExpandedModule] = useState(0)

  useEffect(() => { if (userId && answers.destination) loadExisting() }, [userId])

  const loadExisting = async () => {
    const { data } = await supabase.from('curricula').select('*')
      .eq('user_id', userId).eq('destination', answers.destination).eq('segment', answers.segment).maybeSingle()
    if (data) { setCurriculum(data); loadProgress(data.id) }
  }

  const loadProgress = async (curriculumId) => {
    const { data } = await supabase.from('lesson_progress').select('module_index, lesson_index, completed')
      .eq('user_id', userId).eq('curriculum_id', curriculumId)
    if (data) {
      const map = {}
      data.forEach(r => { map[`${r.module_index}-${r.lesson_index}`] = r.completed })
      setProgress(map)
    }
  }

  const generateCurriculum = async () => {
    if (!answers.destination || !answers.segment) return
    setLoading(true); setGenError('')
    try {
      const res = await fetch('/api/generate-curriculum', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Generation failed')
      const { data: saved } = await supabase.from('curricula').upsert({
        user_id: userId, destination: answers.destination, segment: answers.segment,
        title: data.curriculum.title, modules: data.curriculum.modules,
      }, { onConflict: 'user_id,destination,segment' }).select().maybeSingle()
      setCurriculum(saved || { ...data.curriculum, id: null })
    } catch (e) { setGenError(e.message || 'Something went wrong.') }
    setLoading(false)
  }

  const isLessonUnlocked = (mi, li) => {
    if (mi === 0 && li === 0) return true
    if (li > 0) return progress[`${mi}-${li - 1}`]
    return progress[`${mi - 1}-${curriculum.modules[mi - 1]?.lessons.length - 1}`]
  }

  const openLesson = (mi, li) => {
    if (!curriculum?.id || !isLessonUnlocked(mi, li)) return
    router.push(`/learn/${curriculum.id}/${mi}/${li}`)
  }

  if (!curriculum) {
    return (
      <div>
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-1">Learning</h2>
          <p className="text-slate-500 text-sm">Your AI-generated, structured learning path</p>
        </div>
        <div className="bg-white border border-border rounded-2xl p-10 text-center shadow-card">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto mb-5">
            <BookOpen size={24} className="text-primary" />
          </div>
          <h3 className="text-slate-900 font-bold text-xl mb-2 tracking-tight">Generate Your Learning Path</h3>
          <p className="text-slate-500 text-sm mb-7 max-w-sm mx-auto leading-relaxed">
            Get a personalised {answers.destination || ''} learning path — structured modules, detailed lessons, and official sources built for your exact profile.
          </p>
          <button
            onClick={generateCurriculum}
            disabled={loading || !answers.destination}
            className="inline-flex items-center gap-2.5 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 px-8 rounded-full transition-all text-sm shadow-sm"
          >
            {loading ? (
              <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating your curriculum...</>
            ) : (
              <><Sparkles size={15} /> Generate My Learning Path</>
            )}
          </button>
          {genError && <p className="text-rose-500 text-xs mt-4">{genError}</p>}
          {!answers.destination && <p className="text-slate-400 text-xs mt-4">Complete the quiz first to generate a learning path.</p>}
        </div>
      </div>
    )
  }

  const totalLessons = curriculum.modules.reduce((a, m) => a + m.lessons.length, 0)
  const completedCount = Object.values(progress).filter(Boolean).length
  const progressPct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

  return (
    <div className="space-y-5">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-slate-900 mb-1">Learning</h2>
        <p className="text-slate-500 text-sm">Your AI-generated learning path for {answers.destination}</p>
      </div>

      {/* Progress header */}
      <div className="bg-white border border-border rounded-2xl p-5 shadow-card">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-slate-400 text-xs uppercase tracking-widest mb-1">Your Learning Path</p>
            <h3 className="text-slate-900 font-bold text-base">{curriculum.title}</h3>
          </div>
          <div className="text-right shrink-0">
            <div className="text-2xl font-black text-primary">{progressPct}%</div>
            <div className="text-slate-400 text-xs">{completedCount}/{totalLessons} lessons</div>
          </div>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2">
          <div className="bg-primary h-2 rounded-full transition-all duration-700" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      {curriculum.modules.map((module, mi) => {
        const moduleDone = module.lessons.every((_, li) => progress[`${mi}-${li}`])
        const moduleStarted = module.lessons.some((_, li) => progress[`${mi}-${li}`])
        const isOpen = expandedModule === mi
        const completedInModule = module.lessons.filter((_, li) => progress[`${mi}-${li}`]).length

        return (
          <div key={mi} className="bg-white border border-border rounded-2xl overflow-hidden shadow-card">
            <button
              onClick={() => setExpandedModule(isOpen ? -1 : mi)}
              className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0",
                  moduleDone    ? "bg-emerald-100 text-emerald-600 border border-emerald-200" :
                  moduleStarted ? "bg-blue-100 text-primary border border-blue-200" :
                                  "bg-slate-100 text-slate-500 border border-slate-200"
                )}>
                  {moduleDone ? <CircleCheck size={16} /> : mi + 1}
                </div>
                <div className="text-left">
                  <div className="text-slate-900 font-semibold text-sm">{module.title}</div>
                  <div className="text-slate-400 text-xs mt-0.5">
                    {completedInModule}/{module.lessons.length} lessons
                    {moduleDone && <span className="text-emerald-600 ml-2">· Complete</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {module.urgent && (
                  <span className="bg-rose-50 text-rose-600 border border-rose-200 text-xs px-2 py-0.5 rounded-full font-semibold">Urgent</span>
                )}
                {isOpen ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
              </div>
            </button>

            {isOpen && (
              <div className="border-t border-slate-100 divide-y divide-slate-100">
                {module.lessons.map((lesson, li) => {
                  const done = progress[`${mi}-${li}`]
                  const unlocked = isLessonUnlocked(mi, li)
                  return (
                    <button
                      key={li}
                      onClick={() => openLesson(mi, li)}
                      disabled={!unlocked}
                      className={cn(
                        "w-full px-5 py-3.5 flex items-center gap-4 text-left transition-all",
                        unlocked && !done ? "hover:bg-blue-50 cursor-pointer" :
                        done             ? "hover:bg-slate-50 cursor-pointer" :
                                           "opacity-40 cursor-not-allowed"
                      )}
                    >
                      <div className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold border",
                        done     ? "bg-emerald-100 border-emerald-200 text-emerald-600" :
                        unlocked ? "bg-blue-100 border-blue-200 text-primary" :
                                   "bg-slate-100 border-slate-200 text-slate-400"
                      )}>
                        {done ? <CircleCheck size={14} /> : unlocked ? <PlayCircle size={14} /> : <Lock size={11} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={cn("font-medium text-sm", done ? "text-slate-400 line-through" : "text-slate-800")}>{lesson.title}</div>
                        <p className="text-slate-400 text-xs mt-0.5 truncate">{lesson.summary}</p>
                      </div>
                      {done && <span className="text-emerald-600 text-xs font-medium shrink-0">Done</span>}
                      {unlocked && !done && <ChevronRight size={14} className="text-slate-300 shrink-0" />}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── ROADMAP TAB (was My Plan) ──────────────────────────────────────────────────
function RoadmapTab({ answers, score }) {
  const destination = answers.destination || 'your destination'
  const months = score >= 70 ? 12 : score >= 40 ? 18 : 24

  const phases = [
    {
      icon: BookOpen, phase: 'Phase 1', title: 'Foundation', duration: 'Month 1–2',
      color: 'text-primary', bg: 'bg-blue-50', border: 'border-blue-200',
      tasks: [
        `Complete full JapaLearn learning path for ${destination}`,
        'Register for and pass language test (IELTS / OET / TOEFL)',
        'Begin document collection: passport, degree certificates, NYSC discharge',
        'Open a dedicated migration savings account',
      ],
    },
    {
      icon: Briefcase, phase: 'Phase 2', title: 'Preparation', duration: 'Month 3–6',
      color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200',
      tasks: [
        'Get degree evaluation (WES for Canada, NARIC for UK)',
        'Request employment reference letters from employers',
        'Build migration savings to meet proof-of-funds threshold',
        'Update LinkedIn and create an international-format CV',
        answers.segment?.includes('Tech') ? 'Obtain cloud certifications (AWS, GCP, Azure)' : 'Research specific eligibility requirements for your route',
      ],
    },
    {
      icon: Globe2, phase: 'Phase 3', title: 'Application', duration: 'Month 7–10',
      color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200',
      tasks: [
        `Create account on official immigration portal for ${destination}`,
        'Submit Expression of Interest / Initial Application',
        'Book and attend biometrics appointment',
        'Engage a verified consultant for document review',
        'Track application status weekly',
      ],
    },
    {
      icon: TrendingUp, phase: 'Phase 4', title: 'Pre-Departure', duration: `Month 11–${months}`,
      color: 'text-sky-600', bg: 'bg-sky-50', border: 'border-sky-200',
      tasks: [
        'Receive visa decision — appeal or proceed',
        'Book flights and arrange temporary accommodation',
        `Complete JapaLearn Arrival Pack for ${destination}`,
        'Notify bank, FRSC, and relevant Nigerian authorities',
        `Connect with Nigerian diaspora community in ${destination}`,
      ],
    },
  ]

  return (
    <div className="space-y-5">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-slate-900 mb-1">My Roadmap</h2>
        <p className="text-slate-500 text-sm">Your 12–24 month personalised migration roadmap</p>
      </div>

      <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
        <Clock size={15} className="text-primary shrink-0" />
        <p className="text-slate-700 text-sm">
          Estimated timeline to visa: <strong className="text-slate-900">{months} months</strong>
          <span className="text-slate-400"> · Based on your readiness score of {score}/100</span>
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {phases.map((p, i) => (
          <div key={i} className={`bg-white border ${p.border} rounded-2xl p-5 shadow-card`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl ${p.bg} border ${p.border} flex items-center justify-center`}>
                  <p.icon size={16} className={p.color} />
                </div>
                <div>
                  <div className={`text-xs font-bold ${p.color} uppercase tracking-widest`}>{p.phase}</div>
                  <div className="text-slate-900 font-semibold text-sm">{p.title}</div>
                </div>
              </div>
              <span className="text-slate-400 text-xs">{p.duration}</span>
            </div>
            <ul className="space-y-2">
              {p.tasks.map((task, ti) => (
                <li key={ti} className="flex items-start gap-2 text-slate-600 text-sm">
                  <ChevronRight size={13} className={`${p.color} mt-0.5 shrink-0`} />
                  {task}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── RESOURCES TAB ──────────────────────────────────────────────────────────────
function ResourcesTab({ answers }) {
  const destination = answers.destination || ''

  const resourceSections = [
    {
      title: 'Document Checklists',
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      items: [
        'Core Document Checklist — Passport, Degree, NYSC, ID',
        `${destination || 'UK'} Visa Application Document List`,
        'Police Clearance Certificate — How to Obtain',
        'Degree Certificate Apostille Guide',
        'Birth Certificate & Next of Kin Documents',
      ],
    },
    {
      title: 'CV & Career Templates',
      icon: Briefcase,
      color: 'text-primary',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      items: [
        'International CV Template (ATS-Optimised)',
        'Cover Letter Template — Skilled Worker Visa Jobs',
        'LinkedIn Profile Optimisation Guide',
        'References Request Email Template',
        'Skills Assessment Evidence Template',
      ],
    },
    {
      title: 'SOP & Personal Statement',
      icon: FolderOpen,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      items: [
        'Statement of Purpose (SOP) — Study Visa Template',
        'Personal Statement Guide — Skilled Worker',
        'Letter of Explanation — Financial History',
        'Sponsor Letter Template (Family Visa)',
        'Employment History Letter Template',
      ],
    },
    {
      title: 'Financial Planning',
      icon: Wallet,
      color: 'text-sky-600',
      bg: 'bg-sky-50',
      border: 'border-sky-200',
      items: [
        'Migration Budget Calculator — NGN to GBP/CAD/USD',
        `Proof of Funds Requirements — ${destination || 'UK / Canada / USA'}`,
        'Bank Statement Preparation Guide',
        'Migration Savings Plan Template',
        'Cost Breakdown: Visa Fees, Flights, Housing',
      ],
    },
  ]

  return (
    <div className="space-y-5">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-slate-900 mb-1">Resources</h2>
        <p className="text-slate-500 text-sm">Templates, checklists, and guides curated for your migration route</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        {resourceSections.map((section) => {
          const Icon = section.icon
          return (
            <div key={section.title} className={`bg-white border ${section.border} rounded-2xl p-5 shadow-card`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-9 h-9 rounded-xl ${section.bg} border ${section.border} flex items-center justify-center`}>
                  <Icon size={16} className={section.color} />
                </div>
                <h3 className="font-semibold text-slate-900 text-sm">{section.title}</h3>
              </div>
              <ul className="space-y-2.5">
                {section.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-2.5 group cursor-pointer">
                    <div className={`w-1.5 h-1.5 rounded-full ${section.bg} border ${section.border} shrink-0`} />
                    <span className="text-slate-600 text-sm group-hover:text-slate-900 transition-colors flex-1">{item}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full font-medium shrink-0">Coming soon</span>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 text-center">
        <Star size={20} className="text-primary mx-auto mb-3" />
        <h3 className="font-bold text-slate-900 mb-1">More resources being added weekly</h3>
        <p className="text-slate-500 text-sm">Country-specific templates, expert guides, and downloadable checklists are being curated for each migration route.</p>
      </div>
    </div>
  )
}
