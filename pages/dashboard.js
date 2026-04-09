import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import {
  LayoutDashboard, BookOpen, Map, FolderOpen, MessageSquare,
  Users, ShoppingBag, LogOut,
  Lock, ChevronRight, ChevronDown, ChevronUp, CheckCircle2,
  CircleCheck, PlayCircle, Sparkles, ArrowRight,
  Globe2, Briefcase, Clock, Wallet, TrendingUp,
  X, Star, Heart,
  Search, SlidersHorizontal, Play, ChevronLeft, Plus,
  Moon, Sun, User, Trash2, Camera, Save, Edit3,
  FileText, File, Download, Filter, FilesIcon, Upload,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { getScoreFlag } from '../lib/quizData'
import Logo from '../lib/Logo'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

// ── Visa route lookup ─────────────────────────────────────────────────────────
const VISA_ROUTES = {
  Canada:    { 'Tech Professional': 'Express Entry — Federal Skilled Worker', 'Healthcare Worker': 'Express Entry + Healthcare Streams', 'Student or Post-Grad': 'Study Permit → PGWP → PR', default: 'Express Entry — Federal Skilled Worker' },
  UK:        { 'Tech Professional': 'Global Talent Visa / Skilled Worker', 'Healthcare Worker': 'Health & Care Worker Visa', 'Student or Post-Grad': 'UK Student Visa (Tier 4)', default: 'Skilled Worker Visa' },
  Germany:   { 'Tech Professional': 'EU Blue Card / Skilled Immigration Act', 'Freelancer or Remote Worker': 'Germany Freelance Visa', default: 'EU Blue Card' },
  Australia: { 'Student or Post-Grad': 'Student Visa → Graduate Visa (485)', default: 'Skilled Nominated Visa (190)' },
  Ireland:   { 'Student or Post-Grad': 'Study → 2-Year Stay Back', default: 'Critical Skills Employment Permit' },
  Portugal:  { 'Freelancer or Remote Worker': 'D8 Digital Nomad Visa', default: 'Job Seeker Visa' },
  UAE:       { default: 'Employment Visa / Freelance Permit' },
}
function getVisaRoute(destination, segment) {
  const r = VISA_ROUTES[destination]
  if (!r) return 'Skilled Worker / Employment Visa'
  return r[segment] || r['default'] || 'Skilled Worker / Employment Visa'
}

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
    { label: 'Experience', score: exp, max: 30 },
    { label: 'Education', score: edu, max: 20 },
    { label: 'Language', score: lang, max: 20 },
    { label: 'Age', score: age, max: 10 },
    { label: 'Savings', score: sav, max: 10 },
    { label: 'Profile', score: Math.max(0, Math.min(bonus, 10)), max: 10 },
  ]
}

// ── Nav items ─────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'overview',      label: 'Home',           icon: LayoutDashboard, locked: false },
  { id: 'learning',      label: 'Learning',        icon: BookOpen,        locked: false },
  { id: 'roadmap',       label: 'My Roadmap',      icon: Map,             locked: false },
  { id: 'resources',     label: 'Resources',       icon: FolderOpen,      locked: false },
  { id: 'documents',     label: 'Documents',       icon: FilesIcon,       locked: false },
  { id: 'conversations', label: 'Conversations',   icon: MessageSquare,   locked: true },
  { id: 'peers',         label: 'Peers',           icon: Users,           locked: true },
  { id: 'marketplace',   label: 'Marketplace',     icon: ShoppingBag,     locked: true },
]
const BOTTOM_NAV = [
  { id: 'overview', label: 'Home',      icon: LayoutDashboard },
  { id: 'learning', label: 'Learning',  icon: BookOpen },
  { id: 'roadmap',  label: 'Roadmap',   icon: Map },
  { id: 'resources',label: 'Resources', icon: FolderOpen },
  { id: 'profile',  label: 'Profile',   icon: User },
]


// ── Sidebar ────────────────────────────────────────────────────────────────────
function Sidebar({ activeTab, setActiveTab, onSignOut, isMobileOpen, onMobileClose, userInitials, userDisplayName }) {
  return (
    <>
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-40 lg:hidden"
            onClick={onMobileClose}
          />
        )}
      </AnimatePresence>

      <aside className={cn(
        "fixed top-0 left-0 h-full w-[240px] bg-white z-50 flex flex-col justify-between py-8 transition-transform duration-300",
        "shadow-[0px_14px_42px_rgba(8,15,52,0.06)] rounded-r-[20px]",
        "lg:translate-x-0",
        isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Top section */}
        <div className="flex flex-col gap-12 px-8">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <Logo size={32} />
            <span className="font-bold text-sm text-[#202020]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              JapaLearn <span style={{ color: '#3b75ff' }}>AI</span>
            </span>
            <button className="ml-auto lg:hidden text-slate-400" onClick={onMobileClose}>
              <X size={16} />
            </button>
          </div>

          {/* Overview section */}
          <div className="flex flex-col gap-2.5">
            <p className="text-xs font-semibold text-[#3F3F3F] uppercase tracking-wider mb-2">Overview</p>
            {NAV_ITEMS.filter(i => !i.locked).map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); onMobileClose() }}
                  className={cn(
                    "w-full flex items-center gap-3 px-0 py-2 rounded-[40px] text-sm font-medium transition-all",
                    isActive ? "text-[#3b75ff]" : "text-[#202020] hover:text-[#3b75ff]"
                  )}
                >
                  <Icon size={16} className="shrink-0" />
                  {item.label}
                </button>
              )
            })}
          </div>

          {/* Coming soon */}
          <div className="flex flex-col gap-2.5">
            <p className="text-xs font-semibold text-[#3F3F3F] uppercase tracking-wider mb-2">Coming Soon</p>
            {NAV_ITEMS.filter(i => i.locked).map((item) => {
              const Icon = item.icon
              return (
                <div key={item.id} className="flex items-center gap-3 py-2 text-slate-300 cursor-default">
                  <Icon size={16} className="shrink-0" />
                  <span className="text-sm font-medium flex-1">{item.label}</span>
                  <Lock size={11} className="shrink-0" />
                </div>
              )
            })}
          </div>
        </div>

        {/* Bottom: user avatar + settings icon */}
        <div className="flex flex-col gap-3 px-8">
          <div className="h-px bg-slate-100" />
          <button
            onClick={() => { setActiveTab('profile'); onMobileClose() }}
            className="flex items-center gap-3 py-2 group"
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 transition-all group-hover:opacity-80" style={{ background: '#3b75ff' }}>
              {userInitials}
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-xs font-semibold text-[#202020] truncate">{userDisplayName}</p>
              <p className="text-[10px] text-[#9E9E9E]">View profile</p>
            </div>
          </button>
        </div>
      </aside>
    </>
  )
}

// ── SEARCH BAR ───────────────────────────────────────────────────────────────
function buildSearchIndex(answers) {
  const dest = answers.destination || 'your destination'
  const seg  = answers.segment || ''
  return [
    // Navigation
    { label: 'Home',        category: 'Navigation', tab: 'overview'  },
    { label: 'Learning',    category: 'Navigation', tab: 'learning'  },
    { label: 'My Roadmap',  category: 'Navigation', tab: 'roadmap'   },
    { label: 'Resources',   category: 'Navigation', tab: 'resources' },
    { label: 'Profile',     category: 'Navigation', tab: 'profile'   },

    // Learning
    { label: 'Immigration Pathways & Visa Routes',   category: 'Learning', tab: 'learning' },
    { label: 'Language Test Preparation Guide',      category: 'Learning', tab: 'learning' },
    { label: 'Document Collection & Verification',   category: 'Learning', tab: 'learning' },
    { label: 'Generate My Learning Path',            category: 'Learning', tab: 'learning' },
    { label: 'IELTS preparation',                    category: 'Learning', tab: 'learning' },
    { label: 'Visa application guide',               category: 'Learning', tab: 'learning' },
    { label: 'NYSC discharge letter',                category: 'Learning', tab: 'learning' },
    { label: 'Degree evaluation WES NARIC',          category: 'Learning', tab: 'learning' },

    // Roadmap
    { label: 'Phase 1 — Foundation',                 category: 'Roadmap', tab: 'roadmap' },
    { label: 'Phase 2 — Preparation',               category: 'Roadmap', tab: 'roadmap' },
    { label: 'Phase 3 — Application',               category: 'Roadmap', tab: 'roadmap' },
    { label: 'Phase 4 — Pre-Departure',             category: 'Roadmap', tab: 'roadmap' },
    { label: 'Language test IELTS OET TOEFL',        category: 'Roadmap', tab: 'roadmap' },
    { label: 'Passport and degree certificates',     category: 'Roadmap', tab: 'roadmap' },
    { label: 'Expression of Interest application',  category: 'Roadmap', tab: 'roadmap' },
    { label: 'Biometrics appointment',              category: 'Roadmap', tab: 'roadmap' },
    { label: 'Visa decision and appeal',            category: 'Roadmap', tab: 'roadmap' },
    { label: `${dest} migration timeline`,           category: 'Roadmap', tab: 'roadmap' },
    { label: 'Book flights accommodation',          category: 'Roadmap', tab: 'roadmap' },
    { label: 'Migration savings proof of funds',    category: 'Roadmap', tab: 'roadmap' },
    { label: 'LinkedIn CV international format',    category: 'Roadmap', tab: 'roadmap' },
    seg.includes('Tech') ? { label: 'Cloud certifications AWS GCP Azure', category: 'Roadmap', tab: 'roadmap' } : null,

    // Resources
    { label: 'Core Document Checklist',             category: 'Resources', tab: 'resources' },
    { label: `${dest} Visa Application Documents`,  category: 'Resources', tab: 'resources' },
    { label: 'Police Clearance Certificate',        category: 'Resources', tab: 'resources' },
    { label: 'Degree Certificate Apostille Guide',  category: 'Resources', tab: 'resources' },
    { label: 'International CV Template ATS',       category: 'Resources', tab: 'resources' },
    { label: 'Cover Letter Skilled Worker Visa',    category: 'Resources', tab: 'resources' },
    { label: 'LinkedIn Profile Optimisation',       category: 'Resources', tab: 'resources' },
    { label: 'Statement of Purpose SOP template',   category: 'Resources', tab: 'resources' },
    { label: 'Personal Statement guide',            category: 'Resources', tab: 'resources' },
    { label: 'Migration Budget Calculator NGN',     category: 'Resources', tab: 'resources' },
    { label: 'Proof of Funds Requirements',         category: 'Resources', tab: 'resources' },
    { label: 'Bank Statement Preparation',          category: 'Resources', tab: 'resources' },
    { label: 'Migration Savings Plan',              category: 'Resources', tab: 'resources' },

    // Profile / settings
    { label: 'Edit my profile',                     category: 'Profile', tab: 'profile' },
    { label: 'Upload profile picture',              category: 'Profile', tab: 'profile' },
    { label: 'Dark mode light mode theme',          category: 'Profile', tab: 'profile' },
    { label: 'Sign out',                            category: 'Profile', tab: 'profile' },
    { label: 'Delete account',                      category: 'Profile', tab: 'profile' },
    { label: 'Retake quiz migration assessment',    category: 'Profile', tab: 'profile' },
    { label: 'Notifications preferences',           category: 'Profile', tab: 'profile' },
  ].filter(Boolean)
}

const CATEGORY_COLORS = {
  Navigation: { bg: 'rgba(59,117,255,0.1)',  text: '#3b75ff'  },
  Learning:   { bg: 'rgba(16,185,129,0.1)',  text: '#10b981'  },
  Roadmap:    { bg: 'rgba(14,165,233,0.1)',  text: '#0ea5e9'  },
  Resources:  { bg: 'rgba(245,158,11,0.1)',  text: '#f59e0b'  },
  Profile:    { bg: 'rgba(139,92,246,0.1)',  text: '#8b5cf6'  },
}

const FILTER_CATEGORIES = ['All', 'Navigation', 'Learning', 'Roadmap', 'Resources', 'Profile']

function SearchBar({ answers, setActiveTab }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState('All')
  const [index] = useState(() => buildSearchIndex(answers))
  const ref = useRef(null)

  const filtered = index.filter(item =>
    activeFilter === 'All' || item.category === activeFilter
  )
  const results = query.trim().length < 2
    ? (activeFilter !== 'All' ? filtered.slice(0, 8) : [])
    : filtered.filter(item => item.label.toLowerCase().includes(query.toLowerCase())).slice(0, 8)

  const showResults = open && (results.length > 0 || query.trim().length >= 2)

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
        setFilterOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const go = (item) => {
    setActiveTab(item.tab)
    setQuery('')
    setOpen(false)
    setFilterOpen(false)
  }

  const selectFilter = (cat) => {
    setActiveFilter(cat)
    if (cat !== 'All') setOpen(true)
  }

  const cc_active = CATEGORY_COLORS[activeFilter] || { bg: 'rgba(59,117,255,0.1)', text: '#3b75ff' }

  return (
    <div ref={ref} className="flex flex-col gap-2">
      {/* Search row */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <div className="flex items-center gap-3 bg-white dark:bg-[#1e293b] border border-[rgba(204,204,204,0.8)] dark:border-slate-600 rounded-xl px-4 py-3.5">
            <Search size={16} className="text-[#9E9E9E] shrink-0" />
            <input
              type="text"
              value={query}
              onChange={e => { setQuery(e.target.value); setOpen(true) }}
              onFocus={() => setOpen(true)}
              placeholder="Search learning, roadmap, resources..."
              className="flex-1 text-xs font-medium text-[#202020] dark:text-[#f1f5f9] bg-transparent outline-none placeholder-[#9E9E9E]"
            />
            {query && (
              <button type="button" onClick={() => { setQuery(''); setOpen(false) }} className="text-[#9E9E9E] hover:text-[#202020] transition-colors shrink-0">
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Filter toggle button */}
        <button
          type="button"
          onClick={() => setFilterOpen(f => !f)}
          className="w-12 h-12 rounded-xl flex items-center justify-center transition-all shrink-0"
          style={{
            background: filterOpen || activeFilter !== 'All' ? cc_active.bg : 'rgba(0,0,0,0.04)',
            border: filterOpen || activeFilter !== 'All' ? `1.5px solid ${cc_active.text}` : '1.5px solid transparent',
            color: filterOpen || activeFilter !== 'All' ? cc_active.text : '#9E9E9E',
          }}
          title="Filter by category"
        >
          <SlidersHorizontal size={17} />
        </button>
      </div>

      {/* Inline filter chips — shown when filter is open */}
      {filterOpen && (
        <div className="flex flex-wrap gap-2 px-1 py-1">
          {FILTER_CATEGORIES.map(cat => {
            const cc = CATEGORY_COLORS[cat] || { bg: 'rgba(59,117,255,0.1)', text: '#3b75ff' }
            const isActive = activeFilter === cat
            return (
              <button
                key={cat}
                type="button"
                onClick={() => selectFilter(cat)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                style={{
                  background: isActive ? (cat === 'All' ? '#3b75ff' : cc.text) : (cat === 'All' ? 'rgba(59,117,255,0.1)' : cc.bg),
                  color: isActive ? '#fff' : (cat === 'All' ? '#3b75ff' : cc.text),
                  border: `1.5px solid ${isActive ? (cat === 'All' ? '#3b75ff' : cc.text) : 'transparent'}`,
                }}
              >
                {cat}
              </button>
            )
          })}
          {activeFilter !== 'All' && (
            <button
              type="button"
              onClick={() => { selectFilter('All'); setOpen(false) }}
              className="px-3 py-1.5 rounded-full text-xs font-medium text-slate-400 hover:text-slate-600 transition-all"
            >
              Clear ×
            </button>
          )}
        </div>
      )}

      {/* Search results — rendered inline, no absolute positioning */}
      {showResults && (
        <div className="bg-white dark:bg-[#1e293b] border border-slate-100 dark:border-slate-700 rounded-2xl shadow-[0px_8px_24px_rgba(8,15,52,0.10)] overflow-hidden">
          {activeFilter !== 'All' && query.trim().length < 2 && (
            <div className="px-4 py-2 border-b border-slate-50 dark:border-slate-700/50">
              <p className="text-[10px] font-semibold text-[#9E9E9E] uppercase tracking-wider">Showing: {activeFilter}</p>
            </div>
          )}
          {results.map((item, i) => {
            const cc = CATEGORY_COLORS[item.category] || CATEGORY_COLORS.Navigation
            return (
              <button
                key={i}
                type="button"
                onClick={() => go(item)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left border-b border-slate-50 dark:border-slate-700/50 last:border-0"
              >
                <Search size={13} className="text-[#9E9E9E] shrink-0" />
                <span className="flex-1 text-sm text-[#202020] dark:text-[#f1f5f9] truncate">{item.label}</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0" style={{ background: cc.bg, color: cc.text }}>
                  {item.category}
                </span>
              </button>
            )
          })}
          {query.trim().length >= 2 && results.length === 0 && (
            <div className="px-4 py-5 text-center">
              <p className="text-sm text-[#9E9E9E]">No results for &ldquo;<span className="text-[#202020] dark:text-[#f1f5f9] font-medium">{query}</span>&rdquo;
                {activeFilter !== 'All' && <span> in {activeFilter}</span>}
              </p>
              {activeFilter !== 'All' && (
                <button type="button" onClick={() => selectFilter('All')} className="text-xs mt-2 font-semibold" style={{ color: '#3b75ff' }}>
                  Search all categories
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── OVERVIEW TAB ─────────────────────────────────────────────────────────────
function OverviewTab({ answers, score, flag, displayName, isNewUser, router, quizResult, setActiveTab }) {
  const destinationFlag = COUNTRY_FLAGS[answers.destination] || '🌍'
  const visaRoute = answers.destination ? getVisaRoute(answers.destination, answers.segment) : null

  const flagConfig = {
    green:  { label: 'Strong Profile',    color: '#10b981', bg: 'rgba(16,185,129,0.12)'  },
    yellow: { label: 'Developing Profile', color: '#3b75ff', bg: 'rgba(59,117,255,0.12)' },
    red:    { label: 'Needs Improvement',  color: '#f43f5e', bg: 'rgba(244,63,94,0.12)'  },
  }
  const fc = flagConfig[flag] || flagConfig.yellow

  const aspirational = {
    green:  `Strong profile, ${displayName}. You're closer to ${answers.destination || 'your destination'} than you think — keep the momentum.`,
    yellow: `You're building something real, ${displayName}. Every lesson brings ${answers.destination || 'your destination'} closer.`,
    red:    `Great journeys start here, ${displayName}. Let's build the profile that gets you to ${answers.destination || 'your destination'}.`,
  }

  const milestones = [
    {
      icon: CheckCircle2,
      status: quizResult ? 'Completed' : 'Not started',
      label: 'Migration Assessment',
      done: !!quizResult,
      cta: !quizResult ? () => router.push('/quiz') : null,
    },
    {
      icon: Globe2,
      status: answers.language && answers.language !== 'Not taken' ? 'Registered' : 'Not started',
      label: 'Language Test',
      done: !!(answers.language && answers.language !== 'Not taken'),
      cta: null,
    },
    {
      icon: FolderOpen,
      status: 'Not started',
      label: 'Core Documents',
      done: false,
      cta: null,
    },
  ]

  const LEARNING_MODULES = [
    { title: 'Immigration Pathways & Visa Routes', category: 'Foundation', progress: quizResult ? 15 : 0 },
    { title: 'Language Test Preparation Guide',    category: 'Skills',     progress: 0 },
    { title: 'Document Collection & Verification', category: 'Documents',  progress: 0 },
  ]

  const moduleGradients = ['from-blue-100 to-blue-50', 'from-sky-100 to-blue-50', 'from-blue-50 to-sky-50']

  return (
    <div className="flex flex-col gap-6 pb-10">

      {/* Search + Filter */}
      <SearchBar answers={answers} setActiveTab={setActiveTab} />

      {/* Hero banner */}
      <div className="relative rounded-[20px] overflow-hidden px-6 py-5" style={{ background: '#3b75ff', minHeight: 181 }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.08) 1px,transparent 1px),linear-gradient(to right,rgba(255,255,255,0.08) 1px,transparent 1px)',
          backgroundSize: '28px 28px',
        }} />
        <div className="absolute right-[77px] top-[45px] w-20 h-20 bg-white opacity-20 rotate-45 rounded-lg pointer-events-none" />
        <div className="absolute right-2 top-[93px] w-20 h-20 bg-white opacity-10 rotate-12 rounded-lg pointer-events-none" />
        <div className="absolute right-[148px] top-[122px] w-20 h-20 bg-white opacity-10 -rotate-12 rounded-lg pointer-events-none" />
        <div className="absolute right-[26px] -top-[20px] w-16 h-16 bg-white opacity-10 rotate-6 rounded-lg pointer-events-none" />

        <div className="relative z-10 flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-white/60 text-[10px] uppercase tracking-widest mb-1">
              {isNewUser ? 'Welcome to JapaLearn AI' : 'Welcome back'}
            </p>
            <h2 className="text-white font-bold text-xl sm:text-2xl leading-snug mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              {isNewUser ? `Welcome, ${displayName}! 🎉` : `Welcome back, ${displayName}! 👋`}
            </h2>
            {answers.destination && (
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span>{destinationFlag}</span>
                <span className="text-white/90 text-sm font-medium">{answers.destination}</span>
                {visaRoute && <><span className="text-white/30">·</span><span className="text-white/60 text-xs truncate max-w-[160px]">{visaRoute}</span></>}
              </div>
            )}
            <p className="text-white/70 text-sm leading-relaxed max-w-xs">
              {aspirational[flag] || aspirational.yellow}
            </p>
          </div>
          {quizResult ? (
            <div className="bg-white/15 border border-white/20 rounded-2xl px-4 py-3 text-center shrink-0 min-w-[90px]">
              <p className="text-white/60 text-[9px] uppercase tracking-widest mb-0.5">Score</p>
              <p className="text-white font-black text-3xl leading-none mb-0.5" style={{ fontFamily: 'DM Sans, sans-serif' }}>{score}</p>
              <p className="text-[9px] font-bold" style={{ color: fc.bg === 'rgba(16,185,129,0.12)' ? '#86efac' : fc.bg === 'rgba(244,63,94,0.12)' ? '#fca5a5' : '#bfdbfe' }}>{fc.label}</p>
            </div>
          ) : (
            <button onClick={() => router.push('/quiz')} className="text-white text-xs font-semibold px-4 py-2.5 rounded-full shrink-0" style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)' }}>
              Take Quiz →
            </button>
          )}
        </div>
      </div>

      {/* Milestone cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {milestones.map((m) => {
          const Icon = m.icon
          return (
            <div
              key={m.label}
              onClick={!m.done && m.cta ? m.cta : undefined}
              className={cn(
                "bg-white shadow-[0px_14px_42px_rgba(8,15,52,0.06)] rounded-xl p-3 flex items-center gap-3",
                !m.done && m.cta ? "cursor-pointer hover:shadow-md transition-shadow" : ""
              )}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: m.done ? 'rgba(16,185,129,0.12)' : 'rgba(59,117,255,0.12)' }}>
                <Icon size={16} style={{ color: m.done ? '#10b981' : '#3b75ff' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-[#9E9E9E]">{m.status}</p>
                <p className="text-xs font-semibold text-[#202020] truncate">{m.label}</p>
              </div>
              {m.done && <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />}
              {!m.done && m.cta && <ChevronRight size={14} className="text-[#9E9E9E] shrink-0" />}
            </div>
          )
        })}
      </div>

      {/* Continue Learning */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold text-[#202020]">Continue Learning</h3>
          <button onClick={() => setActiveTab('learning')} className="text-xs font-medium hover:opacity-70 transition-opacity" style={{ color: '#3b75ff' }}>See all →</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {LEARNING_MODULES.map((mod, i) => (
            <div
              key={i}
              className="bg-white shadow-[0px_14px_42px_rgba(8,15,52,0.06)] rounded-[20px] p-3 relative cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setActiveTab('learning')}
            >
              <div className={`h-[100px] bg-gradient-to-br ${moduleGradients[i]} rounded-xl mb-3 flex items-center justify-center`}>
                <BookOpen size={26} className="text-blue-300" />
              </div>
              <span className="text-[8px] font-semibold uppercase px-2 py-1 rounded-lg" style={{ background: 'rgba(59,117,255,0.1)', color: '#3b75ff' }}>{mod.category}</span>
              <h4 className="text-sm font-medium text-[#202020] mt-2 mb-2 leading-snug">{mod.title}</h4>
              <div className="h-1.5 bg-[#F0F0F0] rounded-full mb-3">
                <div className="h-1.5 rounded-full transition-all duration-700" style={{ width: `${mod.progress}%`, background: '#3b75ff' }} />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold text-white shrink-0" style={{ background: '#3b75ff' }}>J</div>
                <div>
                  <p className="text-[10px] font-medium text-[#202020]">JapaLearn AI</p>
                  <p className="text-[8px] text-[#9E9E9E]">Migration Specialist</p>
                </div>
              </div>
              <button className="absolute top-5 right-5 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: 'rgba(59,117,255,0.15)' }}>
                <Heart size={8} style={{ color: '#3b75ff' }} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Readiness score breakdown row */}
      {quizResult && (
        <div className="bg-white shadow-[0px_14px_42px_rgba(8,15,52,0.06)] rounded-[20px] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[#202020]">Score Breakdown</h3>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: fc.bg, color: fc.color }}>{fc.label}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {getScoreBreakdown(answers, score).map((item) => {
              const pct = Math.round((item.score / item.max) * 100)
              const barColor = pct >= 70 ? '#10b981' : pct < 40 ? '#f43f5e' : '#3b75ff'
              return (
                <div key={item.label} className="bg-slate-50 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] font-semibold text-[#5F5F5F]">{item.label}</p>
                    <p className="text-[10px] font-bold" style={{ color: barColor }}>{item.score}/{item.max}</p>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#E8E8E8]">
                    <div className="h-1.5 rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: barColor }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ── LEARNING TAB ───────────────────────────────────────────────────────────────
function LearningTab({ answers, userId }) {
  const router = useRouter()
  const [curriculum, setCurriculum] = useState(null)
  const [loading, setLoading] = useState(false)
  const [genError, setGenError] = useState('')
  const [progress, setProgress] = useState({})
  const [quizPassed, setQuizPassed] = useState({}) // { moduleIndex: true/false }
  const [expandedModule, setExpandedModule] = useState(0)

  useEffect(() => { if (userId && answers.destination) loadExisting() }, [userId])

  const loadExisting = async () => {
    const { data } = await supabase.from('curricula').select('*')
      .eq('user_id', userId).eq('destination', answers.destination).eq('segment', answers.segment).maybeSingle()
    if (data) { setCurriculum(data); loadProgress(data.id) }
  }

  const loadProgress = async (curriculumId) => {
    const [{ data: lessonData }, { data: quizData }] = await Promise.all([
      supabase.from('lesson_progress').select('module_index, lesson_index, completed')
        .eq('user_id', userId).eq('curriculum_id', curriculumId),
      supabase.from('module_quiz_results').select('module_index, passed')
        .eq('user_id', userId).eq('curriculum_id', curriculumId),
    ])
    if (lessonData) {
      const map = {}
      lessonData.forEach(r => { map[`${r.module_index}-${r.lesson_index}`] = r.completed })
      setProgress(map)
    }
    if (quizData) {
      const qmap = {}
      quizData.forEach(r => { qmap[r.module_index] = r.passed })
      setQuizPassed(qmap)
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

  const isModuleUnlocked = (mi) => {
    if (mi === 0) return true
    // Previous module quiz must be passed
    return quizPassed[mi - 1] === true
  }

  const isLessonUnlocked = (mi, li) => {
    if (!isModuleUnlocked(mi)) return false
    if (mi === 0 && li === 0) return true
    if (li > 0) return progress[`${mi}-${li - 1}`]
    return progress[`${mi - 1}-${curriculum.modules[mi - 1]?.lessons.length - 1}`]
  }

  const openLesson = (mi, li) => {
    if (!curriculum?.id || !isLessonUnlocked(mi, li)) return
    router.push(`/learn/${curriculum.id}/${mi}/${li}`)
  }

  const openQuiz = (mi) => {
    if (!curriculum?.id || !isModuleUnlocked(mi)) return
    router.push(`/learn/${curriculum.id}/${mi}/quiz`)
  }

  if (!curriculum) {
    return (
      <div className="flex flex-col gap-6 pb-10">
        <div>
          <h2 className="text-xl font-bold text-[#202020] mb-1">Learning</h2>
          <p className="text-sm text-[#5F5F5F]">Your AI-generated, structured learning path</p>
        </div>
        <div className="bg-white shadow-[0px_14px_42px_rgba(8,15,52,0.06)] rounded-[20px] p-10 text-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: 'rgba(59,117,255,0.12)' }}>
            <BookOpen size={24} style={{ color: '#3b75ff' }} />
          </div>
          <h3 className="text-[#202020] font-bold text-xl mb-2">Generate Your Learning Path</h3>
          <p className="text-[#5F5F5F] text-sm mb-7 max-w-sm mx-auto leading-relaxed">
            Get a personalised {answers.destination || ''} learning path — structured modules, detailed lessons, and official sources built for your exact profile.
          </p>
          <button
            onClick={generateCurriculum}
            disabled={loading || !answers.destination}
            className="inline-flex items-center gap-2.5 text-white font-semibold py-3.5 px-8 rounded-full transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: '#3b75ff' }}
          >
            {loading ? (
              <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating your curriculum...</>
            ) : (
              <><Sparkles size={15} /> Generate My Learning Path</>
            )}
          </button>
          {genError && <p className="text-rose-500 text-xs mt-4">{genError}</p>}
          {!answers.destination && <p className="text-[#9E9E9E] text-xs mt-4">Complete the quiz first to generate a learning path.</p>}
        </div>
      </div>
    )
  }

  const totalLessons = curriculum.modules.reduce((a, m) => a + m.lessons.length, 0)
  const completedCount = Object.values(progress).filter(Boolean).length
  const progressPct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

  return (
    <div className="flex flex-col gap-5 pb-10">
      <div>
        <h2 className="text-xl font-bold text-[#202020] mb-1">Learning</h2>
        <p className="text-sm text-[#5F5F5F]">Your AI-generated learning path for {answers.destination}</p>
      </div>

      <div className="bg-white shadow-[0px_14px_42px_rgba(8,15,52,0.06)] rounded-[20px] p-5">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-[#9E9E9E] text-xs uppercase tracking-widest mb-1">Your Learning Path</p>
            <h3 className="text-[#202020] font-bold text-base">{curriculum.title}</h3>
          </div>
          <div className="text-right shrink-0">
            <div className="text-2xl font-black" style={{ color: '#3b75ff' }}>{progressPct}%</div>
            <div className="text-[#9E9E9E] text-xs">{completedCount}/{totalLessons} lessons</div>
          </div>
        </div>
        <div className="w-full bg-[#D9D9D9] rounded-full h-2">
          <div className="h-2 rounded-full transition-all duration-700" style={{ width: `${progressPct}%`, background: '#3b75ff' }} />
        </div>
      </div>

      {curriculum.modules.map((module, mi) => {
        const moduleDone = module.lessons.every((_, li) => progress[`${mi}-${li}`])
        const moduleStarted = module.lessons.some((_, li) => progress[`${mi}-${li}`])
        const moduleUnlocked = isModuleUnlocked(mi)
        const isOpen = expandedModule === mi
        const completedInModule = module.lessons.filter((_, li) => progress[`${mi}-${li}`]).length
        const quizPassedForModule = quizPassed[mi] === true
        const allLessonsDone = module.lessons.every((_, li) => progress[`${mi}-${li}`])
        const canTakeQuiz = moduleUnlocked && allLessonsDone && !quizPassedForModule

        return (
          <div key={mi} className="bg-white shadow-[0px_14px_42px_rgba(8,15,52,0.06)] rounded-[20px] overflow-hidden">
            <button
              onClick={() => moduleUnlocked && setExpandedModule(isOpen ? -1 : mi)}
              className={cn("w-full px-5 py-4 flex items-center justify-between transition-colors", moduleUnlocked ? "hover:bg-slate-50 cursor-pointer" : "cursor-not-allowed opacity-60")}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0",
                  quizPassedForModule ? "bg-emerald-100 text-emerald-600" :
                  !moduleUnlocked     ? "bg-slate-100 text-slate-400" :
                  moduleStarted       ? "text-white" : "bg-slate-100 text-slate-500"
                )} style={moduleStarted && !quizPassedForModule && moduleUnlocked ? { background: '#3b75ff' } : {}}>
                  {quizPassedForModule ? <CircleCheck size={16} /> : !moduleUnlocked ? <Lock size={14} /> : mi + 1}
                </div>
                <div className="text-left">
                  <div className="text-[#202020] font-semibold text-sm">{module.title}</div>
                  <div className="text-[#9E9E9E] text-xs mt-0.5">
                    {moduleUnlocked ? `${completedInModule}/${module.lessons.length} lessons` : 'Pass previous module quiz to unlock'}
                    {quizPassedForModule && <span className="text-emerald-600 ml-2">· Quiz passed ✓</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {module.urgent && moduleUnlocked && (
                  <span className="bg-rose-50 text-rose-600 text-xs px-2 py-0.5 rounded-full font-semibold">Urgent</span>
                )}
                {moduleUnlocked && (isOpen ? <ChevronUp size={16} className="text-[#9E9E9E]" /> : <ChevronDown size={16} className="text-[#9E9E9E]" />)}
              </div>
            </button>

            {isOpen && moduleUnlocked && (
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
                        unlocked ? "border-blue-200 text-white" :
                                   "bg-slate-100 border-slate-200 text-slate-400"
                      )} style={unlocked && !done ? { background: 'rgba(59,117,255,0.12)', borderColor: '#3b75ff' } : {}}>
                        {done ? <CircleCheck size={14} /> : unlocked ? <PlayCircle size={14} style={{ color: '#3b75ff' }} /> : <Lock size={11} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={cn("font-medium text-sm", done ? "text-[#9E9E9E] line-through" : "text-[#202020]")}>{lesson.title}</div>
                        <p className="text-[#9E9E9E] text-xs mt-0.5 truncate">{lesson.summary}</p>
                      </div>
                      {done && <span className="text-emerald-600 text-xs font-medium shrink-0">Done</span>}
                      {unlocked && !done && <ChevronRight size={14} className="text-[#9E9E9E] shrink-0" />}
                    </button>
                  )
                })}

                {/* Module Quiz row */}
                <div className={cn(
                  "px-5 py-3.5 flex items-center gap-4",
                  canTakeQuiz ? "bg-[#3b75ff]/5 cursor-pointer hover:bg-[#3b75ff]/10 transition-colors" : ""
                )}
                  onClick={canTakeQuiz ? () => openQuiz(mi) : undefined}
                >
                  <div className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center shrink-0 border",
                    quizPassedForModule ? "bg-emerald-100 border-emerald-200" :
                    canTakeQuiz        ? "border-[#3b75ff]" :
                                         "bg-slate-100 border-slate-200"
                  )} style={canTakeQuiz && !quizPassedForModule ? { background: 'rgba(59,117,255,0.12)' } : {}}>
                    {quizPassedForModule
                      ? <CircleCheck size={14} className="text-emerald-600" />
                      : <Sparkles size={12} style={{ color: canTakeQuiz ? '#3b75ff' : '#9E9E9E' }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={cn("font-semibold text-sm", quizPassedForModule ? "text-emerald-600" : canTakeQuiz ? "text-[#3b75ff]" : "text-[#9E9E9E]")}>
                      Module Quiz — {module.title}
                    </div>
                    <p className="text-[#9E9E9E] text-xs mt-0.5">
                      {quizPassedForModule ? 'Passed · Module unlocks next module' : canTakeQuiz ? '10 questions · Score 70%+ to continue' : 'Complete all lessons first'}
                    </p>
                  </div>
                  {quizPassedForModule && <span className="text-emerald-600 text-xs font-semibold shrink-0">Passed ✓</span>}
                  {canTakeQuiz && <ChevronRight size={14} style={{ color: '#3b75ff' }} className="shrink-0" />}
                  {!quizPassedForModule && !canTakeQuiz && <Lock size={12} className="text-[#9E9E9E] shrink-0" />}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── ROADMAP TAB ────────────────────────────────────────────────────────────────
function RoadmapTab({ answers, score }) {
  const destination = answers.destination || 'your destination'
  const months = score >= 70 ? 12 : score >= 40 ? 18 : 24

  const phases = [
    {
      icon: BookOpen, phase: 'Phase 1', title: 'Foundation', duration: 'Month 1–2',
      color: '#3b75ff', bg: 'rgba(59,117,255,0.08)', border: 'rgba(59,117,255,0.2)',
      tasks: [
        `Complete full JapaLearn learning path for ${destination}`,
        'Register for and pass language test (IELTS / OET / TOEFL)',
        'Begin document collection: passport, degree certificates, NYSC discharge',
        'Open a dedicated migration savings account',
      ],
    },
    {
      icon: Briefcase, phase: 'Phase 2', title: 'Preparation', duration: 'Month 3–6',
      color: '#3b82f6', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.2)',
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
      color: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)',
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
      color: '#0ea5e9', bg: 'rgba(14,165,233,0.08)', border: 'rgba(14,165,233,0.2)',
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
    <div className="flex flex-col gap-5 pb-10">
      <div>
        <h2 className="text-xl font-bold text-[#202020] mb-1">My Roadmap</h2>
        <p className="text-sm text-[#5F5F5F]">Your 12–24 month personalised migration roadmap</p>
      </div>

      <div className="flex items-center gap-3 rounded-xl px-4 py-3" style={{ background: 'rgba(59,117,255,0.08)', border: '1px solid rgba(59,117,255,0.2)' }}>
        <Clock size={15} style={{ color: '#3b75ff' }} className="shrink-0" />
        <p className="text-[#202020] text-sm">
          Estimated timeline to visa: <strong>{months} months</strong>
          <span className="text-[#9E9E9E]"> · Based on your readiness score of {score}/100</span>
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {phases.map((p, i) => (
          <div key={i} className="bg-white shadow-[0px_14px_42px_rgba(8,15,52,0.06)] rounded-[20px] p-5" style={{ border: `1px solid ${p.border}` }}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: p.bg, border: `1px solid ${p.border}` }}>
                  <p.icon size={16} style={{ color: p.color }} />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest" style={{ color: p.color }}>{p.phase}</div>
                  <div className="text-[#202020] font-semibold text-sm">{p.title}</div>
                </div>
              </div>
              <span className="text-[#9E9E9E] text-xs">{p.duration}</span>
            </div>
            <ul className="space-y-2">
              {p.tasks.map((task, ti) => (
                <li key={ti} className="flex items-start gap-2 text-[#5F5F5F] text-sm">
                  <ChevronRight size={13} style={{ color: p.color }} className="mt-0.5 shrink-0" />
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
const RESOURCE_CATEGORIES = [
  { value: 'all',         label: 'All' },
  { value: 'template',    label: 'Template',    color: '#3b75ff' },
  { value: 'checklist',   label: 'Checklist',   color: '#10b981' },
  { value: 'guide',       label: 'Guide',       color: '#f59e0b' },
  { value: 'sop_sample',  label: 'SOP Sample',  color: '#8b5cf6' },
  { value: 'cv_guide',    label: 'CV Guide',    color: '#0ea5e9' },
  { value: 'official_doc',label: 'Official Doc', color: '#6b7280' },
]
const FILE_TYPE_ICONS = {
  pdf:  { icon: FileText, color: '#ef4444', bg: '#fef2f2', label: 'PDF' },
  docx: { icon: File,     color: '#3b75ff', bg: '#eff6ff', label: 'DOCX' },
  xlsx: { icon: File,     color: '#10b981', bg: '#ecfdf5', label: 'XLSX' },
}

function ResourcesTab({ answers, userId }) {
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [fileTypeFilter, setFileTypeFilter] = useState('all')
  const [profileFiltered, setProfileFiltered] = useState(true)
  const [fallback, setFallback] = useState(false)

  useEffect(() => { loadResources() }, [profileFiltered])

  const loadResources = async () => {
    setLoading(true)
    const country = answers.destination
    const segment = answers.segment

    let query = supabase.from('resources').select('*').eq('is_active', true).order('created_at', { ascending: false })

    if (profileFiltered && country) {
      query = query.contains('country', [country])
    }

    const { data } = await query

    if (!data || (data.length === 0 && profileFiltered)) {
      // Fall back to all
      setFallback(true)
      setProfileFiltered(false)
      const { data: all } = await supabase.from('resources').select('*').eq('is_active', true).order('created_at', { ascending: false })
      setResources(all || [])
    } else {
      setFallback(profileFiltered && country ? data.length === 0 : false)
      setResources(data || [])
    }
    setLoading(false)
  }

  const displayed = resources.filter(r => {
    if (categoryFilter !== 'all' && r.category !== categoryFilter) return false
    if (fileTypeFilter !== 'all' && r.file_type !== fileTypeFilter) return false
    return true
  })

  return (
    <div className="flex flex-col gap-5 pb-10">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-[#202020] dark:text-[#f1f5f9] mb-1">Resources</h2>
          <p className="text-sm text-[#5F5F5F] dark:text-slate-400">
            {profileFiltered && answers.destination
              ? `Showing resources for ${answers.destination}${answers.segment ? ` · ${answers.segment}` : ''}`
              : 'All available resources'}
          </p>
        </div>
        {answers.destination && (
          <button
            onClick={() => { setProfileFiltered(f => !f); setFallback(false) }}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all"
            style={profileFiltered
              ? { background: 'rgba(59,117,255,0.1)', color: '#3b75ff', borderColor: 'rgba(59,117,255,0.3)' }
              : { background: '#f8fafc', color: '#64748b', borderColor: '#e2e8f0' }}
          >
            <Filter size={11} />
            {profileFiltered ? `My Profile (${answers.destination})` : 'All Resources'}
          </button>
        )}
      </div>

      {/* Fallback notice */}
      {fallback && (
        <div className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', color: '#b45309' }}>
          <Star size={13} className="shrink-0" />
          No resources matched your profile yet — showing all available.
        </div>
      )}

      {/* Filter bar */}
      <div className="flex items-center gap-2 flex-wrap">
        {RESOURCE_CATEGORIES.map(cat => (
          <button
            key={cat.value}
            onClick={() => setCategoryFilter(cat.value)}
            className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
            style={categoryFilter === cat.value
              ? { background: cat.color || '#3b75ff', color: '#fff', borderColor: cat.color || '#3b75ff' }
              : { background: '#f8fafc', color: '#64748b', borderColor: '#e2e8f0' }}
          >
            {cat.label}
          </button>
        ))}
        <div className="h-5 w-px bg-slate-200 mx-1" />
        {['all', 'pdf', 'docx', 'xlsx'].map(ft => (
          <button
            key={ft}
            onClick={() => setFileTypeFilter(ft)}
            className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
            style={fileTypeFilter === ft
              ? { background: '#1e293b', color: '#fff', borderColor: '#1e293b' }
              : { background: '#f8fafc', color: '#64748b', borderColor: '#e2e8f0' }}
          >
            {ft === 'all' ? 'All Types' : ft.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#3b75ff', borderTopColor: 'transparent' }} />
        </div>
      ) : displayed.length === 0 ? (
        <div className="bg-white dark:bg-[#1e293b] shadow-[0px_14px_42px_rgba(8,15,52,0.06)] rounded-[20px] p-12 text-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(59,117,255,0.1)' }}>
            <FolderOpen size={22} style={{ color: '#3b75ff' }} />
          </div>
          <h3 className="font-bold text-[#202020] dark:text-[#f1f5f9] mb-2">No resources found</h3>
          <p className="text-[#5F5F5F] dark:text-slate-400 text-sm mb-4">
            {categoryFilter !== 'all' || fileTypeFilter !== 'all'
              ? 'Try removing some filters to see more resources.'
              : 'Resources for your profile will appear here as they\'re added.'}
          </p>
          {(categoryFilter !== 'all' || fileTypeFilter !== 'all') && (
            <button onClick={() => { setCategoryFilter('all'); setFileTypeFilter('all') }} className="text-xs font-semibold px-4 py-2 rounded-full" style={{ background: 'rgba(59,117,255,0.1)', color: '#3b75ff' }}>
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {displayed.map(r => {
            const fi = FILE_TYPE_ICONS[r.file_type] || FILE_TYPE_ICONS.pdf
            const FileIcon = fi.icon
            const cat = RESOURCE_CATEGORIES.find(c => c.value === r.category)
            return (
              <div key={r.id} className="bg-white dark:bg-[#1e293b] shadow-[0px_14px_42px_rgba(8,15,52,0.06)] rounded-[20px] p-5 flex flex-col gap-3 hover:shadow-lg transition-shadow">
                {/* File type + category badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg" style={{ background: fi.bg }}>
                    <FileIcon size={11} style={{ color: fi.color }} />
                    <span className="text-[10px] font-bold" style={{ color: fi.color }}>{fi.label}</span>
                  </div>
                  {cat && cat.value !== 'all' && (
                    <span className="text-[10px] font-semibold px-2.5 py-1 rounded-lg" style={{ background: (cat.color || '#3b75ff') + '1a', color: cat.color || '#3b75ff' }}>
                      {cat.label}
                    </span>
                  )}
                  {r.country?.slice(0, 2).map(c => (
                    <span key={c} className="text-[10px] font-medium text-[#9E9E9E] bg-slate-100 dark:bg-slate-700 dark:text-slate-400 px-2 py-0.5 rounded-full">{c}</span>
                  ))}
                </div>

                {/* Title + description */}
                <div className="flex-1">
                  <h4 className="font-semibold text-[#202020] dark:text-[#f1f5f9] text-sm leading-snug mb-1">{r.title}</h4>
                  {r.description && <p className="text-[#9E9E9E] dark:text-slate-400 text-xs leading-relaxed">{r.description}</p>}
                </div>

                {/* Download button */}
                <a
                  href={r.file_url}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                  style={{ background: '#3b75ff', color: '#fff' }}
                >
                  <Download size={14} /> Download
                </a>
              </div>
            )
          })}
        </div>
      )}

      {!loading && resources.length > 0 && (
        <p className="text-center text-xs text-[#9E9E9E]">{displayed.length} resource{displayed.length !== 1 ? 's' : ''} shown · More added regularly</p>
      )}
    </div>
  )
}

// ── DOCUMENTS TAB ─────────────────────────────────────────────────────────────
function DocumentsTab() {
  return (
    <div className="flex flex-col gap-5 pb-10">
      <div>
        <h2 className="text-xl font-bold text-[#202020] dark:text-[#f1f5f9] mb-1">Documents</h2>
        <p className="text-sm text-[#5F5F5F] dark:text-slate-400">Your personal document vault</p>
      </div>

      <div className="bg-white dark:bg-[#1e293b] shadow-[0px_14px_42px_rgba(8,15,52,0.06)] rounded-[20px] p-10 sm:p-16 flex flex-col items-center text-center gap-5">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(59,117,255,0.08)', border: '1px solid rgba(59,117,255,0.15)' }}>
            <Upload size={28} style={{ color: '#3b75ff' }} />
          </div>
          <span className="absolute -top-2 -right-2 text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: '#3b75ff' }}>
            Coming Soon
          </span>
        </div>

        <div>
          <h3 className="font-bold text-[#202020] dark:text-[#f1f5f9] text-xl mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            Document Upload
          </h3>
          <p className="text-[#5F5F5F] dark:text-slate-400 text-sm max-w-sm leading-relaxed">
            Upload your CV, certificates, and supporting documents — our AI will analyse them to strengthen your profile and flag gaps in your application.
          </p>
        </div>

        <div className="w-full max-w-xs space-y-3">
          {['CV / Resume', 'Degree Certificate', 'Language Test Result', 'Professional Licence'].map((doc) => (
            <div key={doc} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600 opacity-50">
              <FileText size={15} className="text-[#9E9E9E] shrink-0" />
              <span className="text-sm text-[#5F5F5F] dark:text-slate-400 flex-1 text-left">{doc}</span>
              <span className="text-[10px] text-[#9E9E9E]">Not uploaded</span>
            </div>
          ))}
        </div>

        <button
          disabled
          className="flex items-center gap-2 px-8 py-3 rounded-full text-sm font-semibold text-slate-400 bg-slate-100 dark:bg-slate-700 dark:text-slate-500 cursor-not-allowed border border-slate-200 dark:border-slate-600"
        >
          <Upload size={14} /> Upload Documents
        </button>

        <p className="text-xs text-[#9E9E9E] dark:text-slate-500">We'll notify you when document upload is ready.</p>
      </div>
    </div>
  )
}

// ── PROFILE TAB ──────────────────────────────────────────────────────────────
function Toggle({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="relative w-12 h-6 rounded-full transition-all duration-300 shrink-0 focus:outline-none"
      style={{ background: value ? '#3b75ff' : '#CBD5E1' }}
    >
      <div
        className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-300"
        style={{ transform: value ? 'translateX(24px)' : 'translateX(0)' }}
      />
    </button>
  )
}

function ProfileTab({ user, profile, answers, onSignOut, router }) {
  const fullName = profile?.full_name || user?.user_metadata?.full_name || ''
  const email = user?.email || ''
  const [name, setName] = useState(fullName)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || null)
  const [uploading, setUploading] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [emailNotifs, setEmailNotifs] = useState(true)
  const [progressReminders, setProgressReminders] = useState(true)

  useEffect(() => {
    setDarkMode(document.documentElement.classList.contains('dark'))
  }, [])

  const initials = (name || email).charAt(0).toUpperCase()
  const destinationFlag = COUNTRY_FLAGS[answers.destination] || '🌍'

  const saveProfile = async () => {
    setSaving(true)
    await supabase.from('profiles').upsert({ id: user.id, full_name: name, updated_at: new Date().toISOString() })
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const ext = file.name.split('.').pop().toLowerCase()
    const path = `${user.id}/avatar.${ext}`
    const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
    if (!error) {
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path)
      await supabase.from('profiles').upsert({ id: user.id, avatar_url: publicUrl, updated_at: new Date().toISOString() })
      setAvatarUrl(publicUrl + '?t=' + Date.now())
    }
    setUploading(false)
  }

  const removeAvatar = async () => {
    const exts = ['jpg', 'jpeg', 'png', 'webp']
    await supabase.storage.from('avatars').remove(exts.map(e => `${user.id}/avatar.${e}`))
    await supabase.from('profiles').upsert({ id: user.id, avatar_url: null, updated_at: new Date().toISOString() })
    setAvatarUrl(null)
  }

  const toggleDarkMode = () => {
    const next = !darkMode
    setDarkMode(next)
    if (next) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('darkMode', 'true')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('darkMode', 'false')
    }
  }

  const deleteAccount = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  // card + text helper classes
  const card = "bg-white dark:bg-[#1e293b] shadow-[0px_14px_42px_rgba(8,15,52,0.06)] dark:shadow-[0px_14px_42px_rgba(0,0,0,0.35)] rounded-[20px]"
  const heading = "text-sm font-semibold text-[#202020] dark:text-[#f1f5f9]"
  const sub = "text-xs text-[#9E9E9E] dark:text-slate-400"
  const labelClass = "block text-xs font-semibold text-[#9E9E9E] dark:text-slate-500 uppercase tracking-wider mb-1.5"
  const inputClass = (active) => `w-full rounded-xl px-4 py-3 text-sm outline-none transition-all border ${
    active
      ? 'bg-white dark:bg-[#0f172a] border-[#3b75ff] text-[#202020] dark:text-[#f1f5f9]'
      : 'bg-slate-50 dark:bg-[#0f172a] border-transparent text-[#9E9E9E] dark:text-slate-500 cursor-not-allowed'
  }`

  return (
    <div className="flex flex-col gap-0 pb-16 max-w-2xl w-full">

      {/* Banner */}
      <div className="rounded-[20px] overflow-hidden mb-6" style={{
        background: darkMode
          ? 'linear-gradient(120deg, #1e3a6e 0%, #1e293b 50%, #2d3748 100%)'
          : 'linear-gradient(120deg, #3b75ff 0%, #93bbff 50%, #ffe4b5 100%)',
        height: 100,
      }} />

      {/* Profile header card */}
      <div className={`${card} px-6 py-5 mb-5`}>
        <div className="flex items-center gap-4 flex-wrap">
          {/* Avatar */}
          <div className="relative shrink-0">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-16 h-16 rounded-full object-cover ring-2 ring-white dark:ring-slate-700 shadow-md" />
            ) : (
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black text-white ring-2 ring-white dark:ring-slate-700 shadow-md" style={{ background: 'linear-gradient(135deg, #3b75ff, #2452cc)' }}>
                {initials}
              </div>
            )}
            <label className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer shadow-lg border-2 border-white dark:border-[#1e293b]" style={{ background: '#3b75ff' }}>
              {uploading
                ? <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <Camera size={12} className="text-white" />}
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploading} />
            </label>
          </div>

          {/* Name + email */}
          <div className="flex-1 min-w-0">
            <p className="font-bold text-[#202020] dark:text-[#f1f5f9] text-lg leading-tight" style={{ fontFamily: 'DM Sans, sans-serif' }}>{name || 'Your Name'}</p>
            <p className="text-sm text-[#9E9E9E] dark:text-slate-400 truncate">{email}</p>
            {avatarUrl && (
              <button onClick={removeAvatar} className="text-[10px] text-rose-400 hover:text-rose-500 mt-1 transition-colors">
                Remove photo
              </button>
            )}
          </div>

          {/* Edit / Save / Cancel */}
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="shrink-0 px-6 py-2 rounded-xl text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90"
              style={{ background: '#3b75ff' }}
            >
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => { setEditing(false); setName(fullName) }}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-[#5F5F5F] dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:opacity-80 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={async () => { await saveProfile(); setEditing(false) }}
                disabled={saving}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
                style={{ background: '#3b75ff' }}
              >
                {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Personal info grid */}
      <div className={`${card} px-6 py-6 mb-5`}>
        <h3 className={`${heading} mb-5`}>Personal Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Full Name',     value: name,                          onChange: e => setName(e.target.value), editable: true },
            { label: 'Email Address', value: email,                         onChange: null, editable: false },
            { label: 'Destination',   value: answers.destination || '—',    onChange: null, editable: false },
            { label: 'Occupation',    value: answers.segment || '—',        onChange: null, editable: false },
            { label: 'Language Test', value: answers.language || 'Not taken', onChange: null, editable: false },
            { label: 'Age Range',     value: answers.age || '—',            onChange: null, editable: false },
          ].map(({ label, value, onChange, editable }) => (
            <div key={label}>
              <label className={labelClass}>{label}</label>
              <input
                type="text"
                value={value}
                onChange={onChange || undefined}
                disabled={!editable || !editing}
                className={inputClass(editable && editing)}
                placeholder={label}
              />
            </div>
          ))}
        </div>
        {answers.destination && (
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700">
            <button
              onClick={() => router.push('/quiz')}
              className="text-xs font-semibold px-4 py-2 rounded-full transition-all hover:opacity-80"
              style={{ background: 'rgba(59,117,255,0.12)', color: '#3b75ff' }}
            >
              Retake Migration Assessment →
            </button>
          </div>
        )}
      </div>

      {/* Email address */}
      <div className={`${card} px-6 py-6 mb-5`}>
        <h3 className={`${heading} mb-4`}>My Email Address</h3>
        <div className="flex items-center gap-3 rounded-xl px-4 py-3" style={{ background: darkMode ? 'rgba(59,117,255,0.12)' : '#F0F4FF' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: '#3b75ff' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#202020] dark:text-[#f1f5f9]">{email}</p>
            <p className={sub}>Primary account email · verified</p>
          </div>
        </div>
      </div>

      {/* Appearance & Notifications */}
      <div className={`${card} px-6 py-6 mb-5`}>
        <h3 className={`${heading} mb-6`}>Preferences</h3>

        {/* Dark mode row */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: darkMode ? 'rgba(59,117,255,0.2)' : '#EEF4FF' }}>
              {darkMode
                ? <Moon size={18} style={{ color: '#93bbff' }} />
                : <Sun size={18} style={{ color: '#3b75ff' }} />}
            </div>
            <div>
              <p className="text-sm font-semibold text-[#202020] dark:text-[#f1f5f9]">{darkMode ? 'Dark Mode' : 'Light Mode'}</p>
              <p className={sub}>{darkMode ? 'Easier on the eyes at night' : 'Clean and bright interface'}</p>
            </div>
          </div>
          <Toggle value={darkMode} onChange={toggleDarkMode} />
        </div>

        <div className="h-px bg-slate-100 dark:bg-slate-700 mb-5" />

        {/* Notification rows */}
        {[
          { label: 'Email Updates',       sub2: 'New features and announcements', value: emailNotifs,        set: setEmailNotifs },
          { label: 'Progress Reminders',  sub2: 'Weekly learning check-ins',     value: progressReminders,  set: setProgressReminders },
        ].map(({ label, sub2, value, set }) => (
          <div key={label} className="flex items-center justify-between mb-4 last:mb-0">
            <div>
              <p className="text-sm font-medium text-[#202020] dark:text-[#f1f5f9]">{label}</p>
              <p className={sub}>{sub2}</p>
            </div>
            <Toggle value={value} onChange={set} />
          </div>
        ))}
      </div>

      {/* Account actions */}
      <div className={`${card} px-6 py-6`}>
        <h3 className={`${heading} mb-1`}>Account</h3>
        <p className={`${sub} mb-5`}>Manage your session and account</p>

        {/* Sign out */}
        <button
          onClick={onSignOut}
          className="w-full flex items-center gap-3 text-sm font-medium text-[#202020] dark:text-[#f1f5f9] hover:text-[#3b75ff] dark:hover:text-[#3b75ff] transition-colors py-3 px-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 mb-2"
        >
          <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center shrink-0">
            <LogOut size={15} className="text-[#5F5F5F] dark:text-slate-300" />
          </div>
          <span>Sign out</span>
        </button>

        {/* Delete account */}
        {!deleteConfirm ? (
          <button
            onClick={() => setDeleteConfirm(true)}
            className="w-full flex items-center gap-3 text-sm font-medium text-rose-500 hover:text-rose-600 transition-colors py-3 px-3 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/20"
          >
            <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-900/30 flex items-center justify-center shrink-0">
              <Trash2 size={15} className="text-rose-400" />
            </div>
            <span>Delete account</span>
          </button>
        ) : (
          <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 rounded-2xl p-5 mt-1">
            <p className="text-sm font-bold text-rose-700 dark:text-rose-400 mb-1">Delete your account?</p>
            <p className="text-xs text-rose-500 dark:text-rose-400 mb-4 leading-relaxed">
              This will sign you out immediately. To fully delete your data, email us at{' '}
              <span className="font-semibold">hello@japalearn.ai</span>.
            </p>
            <div className="flex gap-2">
              <button onClick={deleteAccount} className="text-xs font-semibold text-white px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 transition-colors">
                Yes, sign me out
              </button>
              <button onClick={() => setDeleteConfirm(false)} className="text-xs font-semibold text-[#5F5F5F] dark:text-slate-300 px-4 py-2 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
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
  const [isFirstVisit, setIsFirstVisit] = useState(false)

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/'); return }
      setUser(session.user)

      // Check if this is a fresh signup — validate against account creation time to avoid false Welcome messages
      const justSignedUp = localStorage.getItem('just_signed_up') === 'true'
      localStorage.removeItem('just_signed_up')
      if (justSignedUp) {
        const createdAt = session.user.created_at
        const accountAgeMs = createdAt ? Date.now() - new Date(createdAt).getTime() : Infinity
        const isNewAccount = accountAgeMs < 5 * 60 * 1000 // created within last 5 minutes
        if (isNewAccount) setIsFirstVisit(true)
      }

      const pendingAnswers = localStorage.getItem('pending_quiz_answers')
      const pendingScore = localStorage.getItem('pending_quiz_score')
      const pendingName = localStorage.getItem('pending_full_name')
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

      if (pendingName) localStorage.removeItem('pending_full_name')

      // Load profile — create row if it doesn't exist yet
      let { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle()

      if (!profileData) {
        const nameForProfile = pendingName || session.user.user_metadata?.full_name || ''
        const { data: newProfile } = await supabase
          .from('profiles')
          .insert({ id: session.user.id, full_name: nameForProfile, updated_at: new Date().toISOString() })
          .select()
          .maybeSingle()
        profileData = newProfile
      }

      const { data: quizData } = await supabase
        .from('quiz_results')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      setProfile(profileData)
      setQuizResult(quizData)
      setLoading(false)
    }
    load()
  }, [])

  const handleSignOut = async () => { await supabase.auth.signOut(); router.push('/') }

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0f172a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#3b75ff', borderTopColor: 'transparent' }} />
          <p className="text-[#9E9E9E] text-sm">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const score = quizResult?.score || 0
  const answers = quizResult?.answers || {}
  const flag = getScoreFlag(score)
  const fullName = profile?.full_name || user?.user_metadata?.full_name || user?.email || ''
  const firstName = fullName.split(/[\s@]/)[0]
  const displayName = firstName.charAt(0).toUpperCase() + firstName.slice(1)
  return (
    <>
      <Head><title>Dashboard — JapaLearn AI</title></Head>
      <div className="h-screen bg-white dark:bg-[#0f172a] flex overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onSignOut={handleSignOut}
          isMobileOpen={isMobileOpen}
          onMobileClose={() => setIsMobileOpen(false)}
          userInitials={displayName[0]?.toUpperCase() || 'U'}
          userDisplayName={displayName}
        />

        {/* Main content */}
        <main className="flex-1 lg:ml-[240px] overflow-y-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 pb-24 lg:pb-8 dark:bg-[#0f172a]">
          {/* Mobile header */}
          <div className="flex items-center justify-between lg:hidden mb-5">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="w-9 h-9 rounded-full flex items-center justify-center border border-slate-200 text-slate-500"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            </button>
            <span className="font-bold text-sm text-[#202020]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              JapaLearn <span style={{ color: '#3b75ff' }}>AI</span>
            </span>
            <div className="w-9 h-9" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              {activeTab === 'overview'  && <OverviewTab answers={answers} score={score} flag={flag} displayName={displayName} isNewUser={isFirstVisit} router={router} quizResult={quizResult} setActiveTab={setActiveTab} />}
              {activeTab === 'learning'  && <LearningTab answers={answers} userId={user?.id} />}
              {activeTab === 'roadmap'   && <RoadmapTab answers={answers} score={score} />}
              {activeTab === 'resources' && <ResourcesTab answers={answers} userId={user?.id} />}
              {activeTab === 'documents' && <DocumentsTab />}
              {activeTab === 'profile'   && <ProfileTab user={user} profile={profile} answers={answers} onSignOut={handleSignOut} router={router} />}
            </motion.div>
          </AnimatePresence>
        </main>



        {/* Mobile bottom navigation */}
        <nav className="fixed bottom-0 left-0 right-0 lg:hidden bg-white dark:bg-[#1e293b] border-t border-slate-100 dark:border-slate-700 z-40 px-2 py-2">
          <div className="flex items-center justify-around">
            {BOTTOM_NAV.map(item => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-all"
                  style={{ color: isActive ? '#3b75ff' : '#9E9E9E' }}
                >
                  <Icon size={19} />
                  <span style={{ fontSize: '9px', fontWeight: isActive ? 600 : 400 }}>{item.label}</span>
                </button>
              )
            })}
          </div>
        </nav>
      </div>
    </>
  )
}
