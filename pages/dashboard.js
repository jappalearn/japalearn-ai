import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import {
  LayoutDashboard, BookOpen, Map, FolderOpen, MessageSquare,
  Users, ShoppingBag, LogOut,
  Lock, ChevronRight, ChevronDown, ChevronUp, CheckCircle2,
  CircleCheck, PlayCircle, Sparkles, ArrowRight,
  Globe2, Briefcase, Clock, Wallet, TrendingUp,
  X, Star, Heart, AlertTriangle, XCircle, Calendar,
  Search, SlidersHorizontal, Play, ChevronLeft, Plus,
  Moon, Sun, User, Trash2, Camera, Save, Edit3,
  FileText, File, Download, Filter, FilesIcon, Upload, Flame,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { getScoreFlag, calculateScoreBreakdown } from '../lib/quizData'
import Logo from '../lib/Logo'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

// ── Mobile breakpoint hook ────────────────────────────────────────────────────
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return isMobile
}

// ── Referral code generator ───────────────────────────────────────────────────
function generateReferralCode(fullName) {
  const firstName = (fullName || 'user').split(' ')[0].toLowerCase().replace(/[^a-z]/g, '').slice(0, 8) || 'user'
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  const suffix = Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  return `${firstName}-${suffix}`
}

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


// ── Nav groups (new grouped design) ──────────────────────────────────────────
const NAV_GROUPS = [
  {
    label: 'Main',
    items: [
      { id: 'overview',  label: 'Home',       icon: LayoutDashboard },
      { id: 'learning',  label: 'Curriculum', icon: BookOpen },
      { id: 'roadmap',   label: 'My Roadmap', icon: Map },
      { id: 'resources', label: 'Resources',  icon: FolderOpen },
    ],
  },
  {
    label: 'Coming Soon',
    items: [
      { id: 'conversations', label: 'Conversations',   icon: MessageSquare },
      { id: 'documents',     label: 'Document Upload', icon: FilesIcon },
      { id: 'peers',         label: 'Peers',           icon: Users },
      { id: 'marketplace',   label: 'Marketplace',     icon: ShoppingBag },
    ],
  },
  {
    label: 'Account',
    items: [
      { id: 'plans',   label: 'Subscription Plans', icon: Star },
      { id: 'profile', label: 'My Profile',         icon: User },
    ],
  },
]
const LOCKED_IDS = new Set(['plans'])
const BOTTOM_NAV = [
  { id: 'overview', label: 'Home',      icon: LayoutDashboard },
  { id: 'learning', label: 'Learning',  icon: BookOpen },
  { id: 'roadmap',  label: 'Roadmap',   icon: Map },
  { id: 'resources',label: 'Resources', icon: FolderOpen },
  { id: 'credit',   label: 'Score',     icon: TrendingUp },
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
        "fixed top-0 left-0 h-full w-[260px] bg-white z-50 flex flex-col py-7 transition-transform duration-300 overflow-y-auto",
        "shadow-[0px_14px_42px_rgba(8,15,52,0.08)] border-r border-[#ECEEFF]",
        "lg:translate-x-0",
        isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-6 mb-4">
          <Logo size={32} />
          <span className="font-bold text-sm text-[#18181B]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            JapaLearn <span style={{ color: '#3b75ff' }}>AI</span>
          </span>
          <button className="ml-auto lg:hidden text-slate-400" onClick={onMobileClose}>
            <X size={16} />
          </button>
        </div>

        {/* Mobile-only: User card in sidebar */}
        <div className="lg:hidden mx-4 mb-4 px-3 py-2.5 rounded-[14px] flex items-center gap-2.5 cursor-pointer"
          style={{ background: 'linear-gradient(135deg, #F4F7FF 0%, #EBF1FF 100%)', border: '1px solid #E0E8FF' }}
          onClick={() => { setActiveTab('profile'); onMobileClose() }}>
          <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #1E4DD7, #3B75FF)' }}>
            <span className="text-white text-sm font-bold">{userInitials}</span>
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-bold text-[#18181B] leading-tight truncate">{userDisplayName}</p>
            <p className="text-[11px] font-medium" style={{ color: '#3B75FF' }}>View profile →</p>
          </div>
        </div>

        {/* Nav groups */}
        <div className="flex flex-col gap-6 px-4 flex-1">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <div className="flex items-center gap-2 px-2 mb-2">
                <p className="text-[10px] font-bold text-[#B0B4C4] uppercase tracking-widest">{group.label}</p>
              </div>
              <div className="flex flex-col gap-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon
                  const isActive = activeTab === item.id
                  const isLocked = LOCKED_IDS.has(item.id)
                  if (isLocked) {
                    return (
                      <div key={item.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm cursor-default">
                        <Icon size={16} className="shrink-0 text-[#D0D4E8]" />
                        <span className="font-medium text-[#D0D4E8] flex-1">{item.label}</span>
                        <Lock size={10} className="shrink-0 text-[#D0D4E8]" />
                      </div>
                    )
                  }
                  return (
                    <button
                      key={item.id}
                      onClick={() => { setActiveTab(item.id); onMobileClose() }}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left",
                        isActive
                          ? "bg-[#EBF1FF] text-[#1E4DD7]"
                          : "text-[#4D4D56] hover:bg-[#F7F9FF] hover:text-[#1E4DD7]"
                      )}
                    >
                      <Icon size={16} className="shrink-0" />
                      {item.label}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom: sign out only — avatar removed on desktop, My Profile is in nav */}
        <div className="flex flex-col gap-3 px-4 mt-6">
          <div className="h-px bg-[#ECEEFF]" />
          <button
            onClick={onSignOut}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#4D4D56] hover:bg-[#F7F9FF] hover:text-[#1E4DD7] transition-all text-left"
          >
            <LogOut size={16} className="shrink-0" />
            Sign out
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

// ── Quiz-required empty state ─────────────────────────────────────────────────
function QuizRequiredState({ icon: Icon, title, description, router }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center max-w-[480px] mx-auto">
      <div className="w-16 h-16 rounded-[20px] flex items-center justify-center mb-5" style={{ background: 'linear-gradient(135deg, #EBF1FF, #D4DCFF)' }}>
        <Icon size={28} style={{ color: '#1E4DD7' }} />
      </div>
      <h2 className="text-[20px] font-extrabold text-[#18181B] mb-2 leading-snug" style={{ fontFamily: 'DM Sans, sans-serif', letterSpacing: '-0.4px' }}>{title}</h2>
      <p className="text-[14px] text-[#82858A] leading-relaxed mb-7">{description}</p>
      <button
        onClick={() => router.push('/quiz')}
        className="flex items-center gap-2 px-7 py-3.5 rounded-[14px] text-[15px] font-bold text-white transition-all hover:opacity-90"
        style={{ background: 'linear-gradient(135deg, #1A42C2, #3B75FF)', boxShadow: '0px 8px 24px rgba(30,77,215,0.3)' }}
      >
        <Sparkles size={16} className="text-white" />
        Start with Quiz
      </button>
      <p className="text-[11px] text-[#B0B4C4] mt-3">Takes 2 minutes · Completely free</p>
    </div>
  )
}

// ── OVERVIEW TAB ─────────────────────────────────────────────────────────────
function OverviewTab({ answers, score, flag, displayName, isNewUser, router, quizResult, setActiveTab, curriculum, recentProgress }) {
  const visaRoute = answers.destination ? getVisaRoute(answers.destination, answers.segment) : null
  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
  const greetingHour = new Date().getHours()
  const greeting = greetingHour < 12 ? 'Good morning' : greetingHour < 17 ? 'Good afternoon' : 'Good evening'

  // Score area tags — derived from real quiz answers
  const scoreBreakdown = quizResult ? calculateScoreBreakdown(answers) : []
  const areaStatus = (pct) => pct >= 70 ? 'ok' : pct >= 40 ? 'warn' : 'bad'
  const heroTags = quizResult ? [
    { label: 'Language',     status: areaStatus(Math.round(((scoreBreakdown.find(s=>s.label==='Language')?.score||0) / 20)*100)) },
    { label: 'Work Exp.',    status: areaStatus(Math.round(((scoreBreakdown.find(s=>s.label==='Experience')?.score||0) / 30)*100)) },
    { label: 'Education',    status: areaStatus(Math.round(((scoreBreakdown.find(s=>s.label==='Education')?.score||0) / 20)*100)) },
    { label: 'Savings',      status: areaStatus(Math.round(((scoreBreakdown.find(s=>s.label==='Savings')?.score||0) / 10)*100)) },
  ] : []

  // Score categories for breakdown section
  const scoreLabelMap = { Experience: 'Work Experience', Language: 'Language Test', Age: 'Age Factor', Savings: 'Financial Readiness', Profile: 'Skills & Certs', Education: 'Education' }
  const scoreCategories = quizResult ? scoreBreakdown.map(item => {
    const pct = Math.round((item.score / item.max) * 100)
    const st = areaStatus(pct)
    return {
      label: scoreLabelMap[item.label] || item.label,
      score: pct,
      rawScore: item.score,
      max: item.max,
      color: st === 'ok' ? '#21C474' : st === 'warn' ? '#F59A0A' : '#EF4369',
      bg:    st === 'ok' ? '#E8F9EE' : st === 'warn' ? '#FFF7E6' : '#FDECEC',
      status: st,
    }
  }) : []

  // Priority actions — evolve based on real user state
  const hasStartedLessons = recentProgress.length > 0
  const actions = [
    // No quiz → take assessment first
    !quizResult && {
      icon: TrendingUp, title: 'Take Migration Assessment', desc: 'Understand your readiness score',
      color: '#EF4369', bg: '#FDECEC', urgent: true, onClick: () => router.push('/quiz'),
    },
    // Quiz done, no language test → urgent
    quizResult && (!answers.language || answers.language === 'Not taken') && {
      icon: Globe2, title: 'Register for Language Test', desc: 'IELTS / OET required for most visas',
      color: '#EF4369', bg: '#FDECEC', urgent: true, onClick: () => setActiveTab('resources'),
    },
    // Has curriculum and has started lessons → continue
    quizResult && curriculum && hasStartedLessons && {
      icon: BookOpen, title: 'Continue your module', desc: 'Pick up where you left off',
      color: '#1E4DD7', bg: '#EBF1FF', urgent: false, onClick: () => setActiveTab('learning'),
    },
    // Has quiz but no curriculum yet, or curriculum exists but no lessons started → start
    quizResult && !(curriculum && hasStartedLessons) && {
      icon: BookOpen, title: 'Start Your Curriculum', desc: `Personalised for ${answers.destination || 'your destination'}`,
      color: '#1E4DD7', bg: '#EBF1FF', urgent: false, onClick: () => setActiveTab('learning'),
    },
    // Low readiness → improve IELTS
    quizResult && score < 40 && {
      icon: Globe2, title: 'Improve your IELTS preparation', desc: 'Your language score needs a boost',
      color: '#F59A0A', bg: '#FFF7E6', urgent: false, onClick: () => setActiveTab('resources'),
    },
    // High readiness → documents
    quizResult && score >= 70 && {
      icon: FolderOpen, title: 'Prepare your documents', desc: "You're almost ready — get your docs in order",
      color: '#21C474', bg: '#E8F9EE', urgent: false, onClick: () => setActiveTab('resources'),
    },
    // Mid readiness → documents
    quizResult && score >= 40 && score < 70 && {
      icon: FolderOpen, title: 'Prepare Core Documents', desc: 'Passport, certificates & more',
      color: '#F59A0A', bg: '#FFF7E6', urgent: false, onClick: () => setActiveTab('resources'),
    },
    // Always show roadmap if quiz done
    quizResult && {
      icon: Map, title: 'Review Your Roadmap', desc: 'See your 12-month migration plan',
      color: '#21C474', bg: '#E8F9EE', urgent: false, onClick: () => setActiveTab('roadmap'),
    },
  ].filter(Boolean).slice(0, 4)

  const scoreLabel = score >= 70 ? 'Strong' : score >= 45 ? 'Moderate' : 'Developing'
  const isMobile = useIsMobile()

  return (
    <div className="flex flex-col gap-5 pb-10 max-w-[960px]">

      {/* ── Greeting Header ── */}
      <div>
        <p style={{ margin: '0 0 3px', fontSize: 11, color: '#A0A3AB', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', display: 'flex', alignItems: 'center', gap: 4 }}>
          <Calendar size={11} style={{ flexShrink: 0 }} />
          <span>{today}{answers.destination ? ` · ${answers.destination} Pathway` : ''}</span>
        </p>
        <h1 style={{ margin: '0 0 4px', fontSize: isMobile ? 22 : 30, fontWeight: 800, color: '#18181B', letterSpacing: '-0.6px', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.15 }}>
          {isNewUser ? `Welcome, ${displayName}! 🎉` : `${greeting}, ${displayName} 👋`}
        </h1>
        {quizResult ? (
          <p style={{ margin: 0, fontSize: 13, color: '#6B7280', lineHeight: 1.5 }}>
            You&apos;re <strong style={{ color: score >= 70 ? '#21C474' : score >= 45 ? '#F59A0A' : '#EF4369' }}>{score}% ready</strong> — keep building your profile.
          </p>
        ) : (
          <p style={{ margin: 0, fontSize: 13, color: '#6B7280' }}>Take the migration quiz to unlock your personalised roadmap.</p>
        )}
      </div>

      {isMobile ? (
        <>
          {/* ── MOBILE Hero Readiness Card ── */}
          <div style={{ background: 'linear-gradient(135deg, #0F2E99 0%, #1E4DD7 50%, #3B75FF 100%)', borderRadius: 20, padding: 20, boxShadow: '0px 12px 40px rgba(30,77,215,0.3)' }}>
            <p style={{ margin: '0 0 4px', fontSize: 10, color: 'rgba(255,255,255,0.6)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 4 }}>
              <TrendingUp size={10} style={{ flexShrink: 0 }} /> Migration Readiness
            </p>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginBottom: 10 }}>
              <p style={{ margin: 0, fontSize: 48, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-3px', fontFamily: 'DM Sans, sans-serif', lineHeight: 1 }}>
                {quizResult ? score : '—'}
              </p>
              {quizResult && (
                <div style={{ paddingBottom: 6 }}>
                  <span style={{ fontSize: 18, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>%</span>
                  <p style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,0.55)', fontWeight: 600 }}>{scoreLabel}</p>
                </div>
              )}
              <div style={{ marginLeft: 'auto', paddingBottom: 4 }}>
                <button
                  onClick={() => quizResult ? setActiveTab('learning') : router.push('/quiz')}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 16px', background: '#FFFFFF', border: 'none', borderRadius: 10, color: '#1E4DD7', fontSize: 12, fontWeight: 700, cursor: 'pointer', boxShadow: '0px 4px 14px rgba(0,0,0,0.18)', fontFamily: 'Inter, sans-serif' }}
                >
                  <span>{quizResult ? 'Continue' : 'Start'}</span>
                  <ArrowRight size={12} style={{ color: '#1E4DD7' }} />
                </button>
              </div>
            </div>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.15)', borderRadius: 3, overflow: 'hidden', marginBottom: 8 }}>
              <div style={{ width: `${quizResult ? Math.max(score, 5) : 0}%`, height: '100%', background: 'linear-gradient(90deg, rgba(255,255,255,0.6), #FFFFFF)', borderRadius: 3 }} />
            </div>
            {visaRoute && <p style={{ margin: '0 0 12px', fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{visaRoute}</p>}
            {heroTags.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                {heroTags.map(tag => (
                  <div key={tag.label} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 10px', background: 'rgba(255,255,255,0.1)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)' }}>
                    {tag.status === 'ok'   && <CheckCircle2 size={13} style={{ color: '#4ADE80', flexShrink: 0 }} />}
                    {tag.status === 'warn' && <AlertTriangle size={13} style={{ color: '#FCD34D', flexShrink: 0 }} />}
                    {tag.status === 'bad'  && <XCircle size={13} style={{ color: '#F87171', flexShrink: 0 }} />}
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', fontWeight: 500, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tag.label}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, flexShrink: 0, color: tag.status === 'ok' ? '#4ADE80' : tag.status === 'warn' ? '#FCD34D' : '#F87171' }}>
                      {tag.status === 'ok' ? '✓' : tag.status === 'warn' ? '!' : '✗'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── MOBILE 2×2 Stat Cards ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              { icon: TrendingUp, val: quizResult ? `${score}%` : '0', label: 'Readiness Score', color: '#F59A0A', bg: '#FFF7E6' },
              { icon: BookOpen,   val: curriculum ? String(Math.max(1, new Set(recentProgress.map(p => p.module_index)).size)) : '—', label: 'Modules Active', color: '#3B75FF', bg: '#EBF1FF' },
              { icon: Flame,      val: '—', label: 'Day Streak',   color: '#21C474', bg: '#E8F9EE' },
              { icon: FilesIcon,  val: '—', label: 'Docs Ready',   color: '#EF4369', bg: '#FDECEC' },
            ].map(card => {
              const Icon = card.icon
              return (
                <div key={card.label} style={{ background: '#FFFFFF', borderRadius: 16, padding: 14, border: '1px solid #F0F2FF', boxShadow: '0px 2px 8px rgba(30,77,215,0.04)' }}>
                  <div style={{ width: 30, height: 30, borderRadius: 9, background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                    <Icon size={14} style={{ color: card.color }} />
                  </div>
                  <p style={{ margin: '0 0 1px', fontSize: 20, fontWeight: 800, color: '#18181B', fontFamily: 'DM Sans, sans-serif', letterSpacing: '-0.5px', lineHeight: 1 }}>{card.val}</p>
                  <p style={{ margin: 0, fontSize: 10, color: '#82858A', fontWeight: 500, lineHeight: 1.3 }}>{card.label}</p>
                </div>
              )
            })}
          </div>
        </>
      ) : (
        /* ── DESKTOP Hero Readiness Banner ── */
        <div className="rounded-[24px] p-8 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0F2E99 0%, #1E4DD7 45%, #3B75FF 80%, #6094FF 100%)', boxShadow: '0px 20px 60px rgba(30,77,215,0.3)' }}>
          <div className="flex items-stretch gap-8 flex-wrap">
            {/* Score column */}
            <div className="flex-1 min-w-[160px]">
              <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-2 flex items-center gap-1">
                <TrendingUp size={10} className="shrink-0" /> Migration Readiness
              </p>
              {quizResult ? (
                <>
                  <div className="flex items-end gap-2 mb-3">
                    <p className="text-[56px] font-black text-white leading-none" style={{ fontFamily: 'DM Sans, sans-serif', letterSpacing: '-3px' }}>{score}</p>
                    <div className="pb-2">
                      <span className="text-xl font-bold text-white/70">%</span>
                      <p className="text-[11px] font-semibold text-white/55 leading-tight">{scoreLabel}</p>
                    </div>
                  </div>
                  <div className="h-2 rounded-full mb-3 max-w-[220px] overflow-hidden" style={{ background: 'rgba(255,255,255,0.15)' }}>
                    <div className="h-full rounded-full" style={{ width: `${score}%`, background: 'linear-gradient(90deg, rgba(255,255,255,0.6), #FFFFFF)' }} />
                  </div>
                  {visaRoute && <p className="text-[11px] text-white/50 mb-4">{visaRoute}</p>}
                </>
              ) : (
                <div className="mb-4">
                  <p className="text-white/70 text-sm mb-3">No assessment taken yet</p>
                </div>
              )}
              <button
                onClick={() => quizResult ? setActiveTab('learning') : router.push('/quiz')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all hover:shadow-lg"
                style={{ background: '#FFFFFF', color: '#1E4DD7', boxShadow: '0px 6px 20px rgba(0,0,0,0.18)' }}
              >
                <span>{quizResult ? 'Start Learning' : 'Start with Quiz'}</span>
                <ArrowRight size={14} style={{ color: '#1E4DD7' }} />
              </button>
            </div>
            {/* Divider */}
            {heroTags.length > 0 && <div className="w-px self-stretch" style={{ background: 'rgba(255,255,255,0.1)' }} />}
            {/* Score by Area */}
            {heroTags.length > 0 && (
              <div className="flex flex-col justify-center gap-2.5 min-w-[150px]">
                <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">Score by Area</p>
                {heroTags.map(tag => (
                  <div key={tag.label} className="flex items-center gap-2.5">
                    {tag.status === 'ok'   && <CheckCircle2 size={14} style={{ color: '#4ADE80' }} className="shrink-0" />}
                    {tag.status === 'warn' && <AlertTriangle size={14} style={{ color: '#FCD34D' }} className="shrink-0" />}
                    {tag.status === 'bad'  && <XCircle size={14} style={{ color: '#F87171' }} className="shrink-0" />}
                    <span className="text-[13px] text-white/85 font-medium flex-1">{tag.label}</span>
                    <span className="text-[11px] font-bold ml-auto" style={{ color: tag.status === 'ok' ? '#4ADE80' : tag.status === 'warn' ? '#FCD34D' : '#F87171' }}>
                      {tag.status === 'ok' ? 'Strong' : tag.status === 'warn' ? 'Improve' : 'Urgent'}
                    </span>
                  </div>
                ))}
              </div>
            )}
            {/* Divider */}
            <div className="w-px self-stretch" style={{ background: 'rgba(255,255,255,0.1)' }} />
            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-2.5 content-center">
              {[
                { icon: TrendingUp, val: quizResult ? `${score}%` : '0', label: 'Readiness Score', color: '#F59A0A' },
                { icon: BookOpen,   val: curriculum ? String(Math.max(1, new Set(recentProgress.map(p => p.module_index)).size)) : '—', label: 'Modules Active', color: '#3B75FF' },
                { icon: Flame,      val: '—', label: 'Day Streak',    color: '#21C474' },
                { icon: FilesIcon,  val: '—', label: 'Docs Ready',    color: '#EF4369' },
              ].map(s => {
                const Icon = s.icon
                return (
                  <div key={s.label} className="px-4 py-3 rounded-[14px]" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', minWidth: '90px' }}>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center mb-2" style={{ background: 'rgba(255,255,255,0.15)' }}>
                      <Icon size={14} style={{ color: 'rgba(255,255,255,0.85)' }} />
                    </div>
                    <p className="text-xl font-black text-white leading-none mb-0.5" style={{ fontFamily: 'DM Sans, sans-serif', letterSpacing: '-0.5px' }}>{s.val}</p>
                    <p className="text-[10px] text-white/55 font-medium leading-tight">{s.label}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Priority Actions ── */}
      <div className="bg-white rounded-[20px] p-5 sm:p-6" style={{ border: '1px solid #F0F2FF', boxShadow: '0px 2px 16px rgba(30,77,215,0.06)' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px] font-bold text-[#18181B] flex items-center gap-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            <span className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FF6B35, #FF8C42)' }}>
              <Flame size={13} className="text-white" />
            </span>
            Priority Actions
          </h2>
          {actions.some(a => a.urgent) && (
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ color: '#EF4369', background: '#FDECEC' }}>
              {actions.filter(a => a.urgent).length} urgent
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <button
                key={action.title}
                onClick={action.onClick}
                className="flex items-start gap-3 p-3.5 rounded-[14px] text-left w-full transition-all hover:-translate-y-[1px]"
                style={{ background: action.urgent ? `linear-gradient(135deg, ${action.bg}, #fff)` : '#FAFBFF', border: `1.5px solid ${action.urgent ? action.color + '44' : '#F0F2FF'}`, cursor: 'pointer' }}
              >
                <div className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0" style={{ background: action.bg }}>
                  <Icon size={16} style={{ color: action.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-[#18181B] mb-0.5 leading-snug">{action.title}</p>
                  <p className="text-[11px] text-[#82858A] leading-tight">{action.desc}</p>
                </div>
                {action.urgent && (
                  <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded shrink-0 mt-0.5" style={{ color: action.color, background: action.bg, letterSpacing: '0.05em' }}>Urgent</span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Two column ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">

        {/* Score Breakdown */}
        <div className="bg-white rounded-[20px] p-5 sm:p-6" style={{ border: '1px solid #F0F2FF', boxShadow: '0px 2px 12px rgba(30,77,215,0.05)' }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[15px] font-bold text-[#18181B]" style={{ fontFamily: 'DM Sans, sans-serif' }}>Readiness Score Breakdown</h2>
            <button onClick={() => setActiveTab('roadmap')} className="flex items-center gap-1 text-[12px] font-semibold transition-opacity hover:opacity-70" style={{ color: '#1E4DD7', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <span>View Roadmap</span>
              <ArrowRight size={12} style={{ color: '#1E4DD7' }} />
            </button>
          </div>
          {quizResult ? (
            <div className="flex flex-col gap-4">
              {scoreCategories.map(cat => (
                <div key={cat.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-[26px] h-[26px] rounded-[7px] flex items-center justify-center shrink-0" style={{ background: cat.bg }}>
                        {cat.status === 'ok'   && <CheckCircle2 size={13} style={{ color: cat.color }} />}
                        {cat.status === 'warn' && <AlertTriangle size={13} style={{ color: cat.color }} />}
                        {cat.status === 'bad'  && <XCircle size={13} style={{ color: cat.color }} />}
                      </div>
                      <span className="text-[13px] font-medium text-[#2D2D35]">{cat.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ color: cat.color, background: cat.bg }}>
                        {cat.status === 'ok' ? 'Strong' : cat.status === 'warn' ? 'Improve' : 'Urgent'}
                      </span>
                      <span className="text-[13px] font-black text-[#18181B] min-w-[36px] text-right">{cat.rawScore} / {cat.max}</span>
                    </div>
                  </div>
                  <div className="h-[7px] rounded-full overflow-hidden" style={{ background: '#F0F2FF' }}>
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${cat.score}%`, background: `linear-gradient(90deg, ${cat.color}cc, ${cat.color})` }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <TrendingUp size={28} style={{ color: '#E4E8FF' }} className="mx-auto mb-3" />
              <p className="text-[13px] text-[#82858A] mb-4">Take the migration assessment to see your score breakdown.</p>
              <button onClick={() => router.push('/quiz')} className="px-5 py-2.5 rounded-full text-sm font-semibold text-white" style={{ background: '#1E4DD7' }}>
                Take Assessment →
              </button>
            </div>
          )}
        </div>

        {/* Recent Activity (placeholder) */}
        <div className="bg-white rounded-[18px] p-5" style={{ border: '1px solid #F0F2FF', boxShadow: '0px 2px 12px rgba(30,77,215,0.05)' }}>
          <h2 className="text-[13px] font-bold text-[#18181B] mb-4" style={{ fontFamily: 'DM Sans, sans-serif' }}>Recent Activity</h2>
          {quizResult ? (() => {
            const quizActivity = { icon: CheckCircle2, title: 'Completed Migration Assessment', time: quizResult.created_at ? new Date(quizResult.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'Recently', color: '#21C474', bg: '#E8F9EE' }
            const lessonActivities = recentProgress.slice(0, 4).map(p => {
              const mod = curriculum?.modules?.[p.module_index]
              const lesson = mod?.lessons?.[p.lesson_index]
              const title = lesson?.title ? `Completed: ${lesson.title}` : `Completed Module ${p.module_index + 1} – Lesson ${p.lesson_index + 1}`
              const time = p.completed_at ? new Date(p.completed_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'Recently'
              return { icon: BookOpen, title, time, color: '#1E4DD7', bg: '#EBF1FF' }
            })
            const allActivities = [...lessonActivities, quizActivity].slice(0, 5)
            return (
              <ul className="flex flex-col divide-y divide-[#F4F6FF]">
                {allActivities.map((item, i) => {
                  const Icon = item.icon
                  return (
                    <li key={i} className="flex items-center gap-2.5 py-2.5">
                      <div className="w-8 h-8 rounded-[8px] flex items-center justify-center shrink-0" style={{ background: item.bg }}>
                        <Icon size={14} style={{ color: item.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-medium text-[#18181B] leading-snug truncate">{item.title}</p>
                        <p className="text-[10px] text-[#B0B4C4]">{item.time}</p>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )
          })() : (
            <div className="text-center py-6">
              <p className="text-[12px] text-[#B0B4C4]">Your activity will appear here once you get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── LEARNING TAB ───────────────────────────────────────────────────────────────
function LearningTab({ answers, userId, quizResult, router }) {
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
      <div className="flex flex-col gap-6 pb-10 max-w-[820px]">
        <div>
          <h1 className="text-2xl font-extrabold text-[#18181B] mb-1" style={{ fontFamily: 'DM Sans, sans-serif', letterSpacing: '-0.6px' }}>Your Curriculum</h1>
          <p className="text-[15px] text-[#82858A] leading-relaxed">{quizResult ? 'Personalised, structured and built specifically for your migration profile — generated in seconds.' : 'Take the quiz first so we know your destination, profession, and goals — then your curriculum is built around you.'}</p>
        </div>

        {/* Generate / quiz card */}
        <div className="rounded-[22px] p-8" style={{ background: 'linear-gradient(135deg, #1A42C2 0%, #2F67F8 55%, #5C8AFF 100%)', boxShadow: '0px 16px 48px rgba(30,77,215,0.3)' }}>
          <p className="text-[11px] font-bold text-white/65 uppercase tracking-widest mb-2">What you&apos;ll get</p>
          <h2 className="text-xl font-extrabold text-white mb-5 leading-snug" style={{ fontFamily: 'DM Sans, sans-serif', letterSpacing: '-0.4px' }}>
            {quizResult ? `A complete ${answers.destination} learning path, built around your profile` : 'A personalised learning path — built around your destination, profession, and goals'}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-7">
            {[
              { icon: BookOpen,     title: '5–8 modules',       desc: 'Covering visa, language, docs & finance' },
              { icon: TrendingUp,   title: 'Matches your gaps',  desc: 'Focused on what your profile needs most' },
              { icon: Sparkles,     title: 'Ready in seconds',   desc: 'Built instantly after your quiz' },
              { icon: CheckCircle2, title: 'Fully unlocked',     desc: 'Every lesson available to you' },
            ].map(item => {
              const Icon = item.icon
              return (
                <div key={item.title} className="rounded-[14px] p-4" style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}>
                  <div className="w-8 h-8 rounded-[9px] flex items-center justify-center mb-2.5" style={{ background: 'rgba(255,255,255,0.18)' }}>
                    <Icon size={16} className="text-white" />
                  </div>
                  <p className="text-[13px] font-bold text-white mb-1">{item.title}</p>
                  <p className="text-[11px] leading-snug" style={{ color: 'rgba(255,255,255,0.65)' }}>{item.desc}</p>
                </div>
              )
            })}
          </div>
          <button
            onClick={quizResult ? generateCurriculum : () => router.push('/quiz')}
            disabled={loading}
            className="flex items-center gap-2.5 px-8 py-4 rounded-[14px] text-[16px] font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: '#FFFFFF', color: '#1E4DD7', boxShadow: '0px 8px 24px rgba(0,0,0,0.2)' }}
          >
            {loading ? (
              <><span className="w-4 h-4 border-2 border-blue-200 border-t-[#1E4DD7] rounded-full animate-spin" /> Generating your curriculum…</>
            ) : quizResult ? (
              <><BookOpen size={18} style={{ color: '#1E4DD7' }} /><span>Start Learning</span><ArrowRight size={16} style={{ color: '#1E4DD7' }} /></>
            ) : (
              <><Sparkles size={18} style={{ color: '#1E4DD7' }} /><span>Start with Quiz</span><ArrowRight size={16} style={{ color: '#1E4DD7' }} /></>
            )}
          </button>
          {genError && <p className="text-rose-200 text-xs mt-4">{genError}</p>}
        </div>

        {/* Profile tags — only show post-quiz */}
        {answers.destination && (
          <div className="bg-white rounded-[18px] p-5 sm:p-6" style={{ border: '1px solid #F0F2FF', boxShadow: '0px 2px 12px rgba(30,77,215,0.05)' }}>
            <h3 className="text-[14px] font-bold text-[#18181B] mb-3" style={{ fontFamily: 'DM Sans, sans-serif' }}>Your curriculum will be based on</h3>
            <div className="flex flex-wrap gap-2">
              {[
                answers.destination,
                answers.segment,
                answers.language && answers.language !== 'Not taken' ? answers.language : 'Language Test Pending',
                answers.experience ? `${answers.experience} Experience` : null,
                answers.education || null,
              ].filter(Boolean).map(tag => (
                <span key={tag} className="px-3.5 py-1.5 rounded-full text-[13px] font-medium" style={{ background: '#F4F6FF', border: '1px solid #E0E8FF', color: '#1E4DD7' }}>{tag}</span>
              ))}
            </div>
            {!answers.destination && <p className="text-[#9E9E9E] text-xs mt-2">Complete the quiz first to generate a learning path.</p>}
          </div>
        )}
      </div>
    )
  }

  const totalLessons = curriculum.modules.reduce((a, m) => a + m.lessons.length, 0)
  const completedCount = Object.values(progress).filter(Boolean).length
  const progressPct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

  return (
    <div className="flex flex-col gap-5 pb-10 max-w-[820px]">

      {/* Curriculum header card */}
      <div className="rounded-[20px] p-6 sm:p-7" style={{ background: 'linear-gradient(135deg, #1A42C2 0%, #2F67F8 100%)', boxShadow: '0px 10px 36px rgba(30,77,215,0.28)' }}>
        <p className="text-[11px] font-bold text-white/65 uppercase tracking-widest mb-1">Your Learning Path</p>
        <h1 className="text-xl font-extrabold text-white mb-2 leading-snug" style={{ fontFamily: 'DM Sans, sans-serif', letterSpacing: '-0.4px' }}>{curriculum.title}</h1>
        <p className="text-[13px] text-white/70 mb-5 leading-relaxed max-w-lg">
          Complete this curriculum to confidently navigate your {answers.destination} migration — every module is built around your profile.
        </p>
        <div className="flex gap-3 flex-wrap">
          {[
            { label: 'Modules',   val: curriculum.modules.length },
            { label: 'Lessons',   val: totalLessons },
            { label: 'Progress',  val: `${progressPct}%` },
            { label: 'Complete',  val: `${completedCount}/${totalLessons}` },
          ].map(s => (
            <div key={s.label} className="px-3.5 py-2.5 rounded-[12px] bg-white" style={{ border: '1px solid #E0E8FF', boxShadow: '0px 2px 8px rgba(30,77,215,0.04)' }}>
              <p className="text-[11px] font-medium text-[#1E4DD7]">{s.label}</p>
              <p className="text-[18px] font-black text-[#18181B]">{s.val}</p>
            </div>
          ))}
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
        const modPct = module.lessons.length > 0 ? Math.round((completedInModule / module.lessons.length) * 100) : 0

        return (
          <div key={mi} className="bg-white rounded-[20px] overflow-hidden transition-all"
            style={{ border: '1px solid #E0E8FF', boxShadow: isOpen ? '0px 8px 28px rgba(30,77,215,0.10)' : '0px 2px 10px rgba(8,15,52,0.05)' }}>

            {/* Module header */}
            <button
              onClick={() => moduleUnlocked && setExpandedModule(isOpen ? -1 : mi)}
              className={cn("w-full px-5 py-4 flex items-start gap-4 text-left transition-colors", moduleUnlocked ? "hover:bg-[#F7F9FF] cursor-pointer" : "cursor-not-allowed")}
            >
              {/* Number badge */}
              <div className={cn(
                "w-9 h-9 rounded-[10px] flex items-center justify-center text-sm font-black shrink-0 mt-0.5",
                quizPassedForModule ? "bg-emerald-50 text-emerald-600" :
                !moduleUnlocked     ? "bg-[#F1F1F5] text-[#ADADBE]" :
                moduleStarted       ? "text-white" : "bg-[#EBF1FF] text-[#1E4DD7]"
              )} style={moduleStarted && !quizPassedForModule && moduleUnlocked ? { background: 'linear-gradient(135deg, #1E4DD7, #3B75FF)' } : {}}>
                {quizPassedForModule ? <CircleCheck size={15} /> : !moduleUnlocked ? <Lock size={13} /> : String(mi + 1).padStart(2, '0')}
              </div>

              {/* Title + meta */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className={cn("font-bold text-[14px] leading-snug", !moduleUnlocked ? "text-[#ADADBE]" : "text-[#18181B]")}>{module.title}</span>
                  {module.urgent && moduleUnlocked && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-rose-600" style={{ background: 'rgba(239,68,68,0.08)' }}>Urgent</span>
                  )}
                  {quizPassedForModule && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-emerald-600" style={{ background: 'rgba(16,185,129,0.08)' }}>Complete</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn("text-xs", !moduleUnlocked ? "text-[#ADADBE]" : "text-[#8C8C9D]")}>
                    {!moduleUnlocked ? 'Pass previous module quiz to unlock' : `${completedInModule} of ${module.lessons.length} lessons`}
                  </span>
                </div>
                {/* Progress bar */}
                {moduleUnlocked && module.lessons.length > 0 && (
                  <div className="mt-2.5 h-1.5 rounded-full bg-[#EBF1FF] overflow-hidden w-full max-w-[180px]">
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${modPct}%`, background: quizPassedForModule ? '#10b981' : 'linear-gradient(90deg, #1E4DD7, #3B75FF)' }} />
                  </div>
                )}
              </div>

              {/* Chevron */}
              {moduleUnlocked && (
                <div className="shrink-0 mt-1 text-[#ADADBE]">
                  {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              )}
            </button>

            {/* Expanded lesson list */}
            {isOpen && moduleUnlocked && (
              <div className="border-t divide-y" style={{ borderColor: '#F0F2FF', '--tw-divide-opacity': 1 }}>
                {module.lessons.map((lesson, li) => {
                  const done = progress[`${mi}-${li}`]
                  const unlocked = isLessonUnlocked(mi, li)
                  return (
                    <button
                      key={li}
                      onClick={() => openLesson(mi, li)}
                      disabled={!unlocked}
                      className={cn(
                        "w-full px-5 py-3.5 flex items-center gap-3.5 text-left transition-all",
                        unlocked && !done ? "hover:bg-[#F7F9FF] cursor-pointer" :
                        done             ? "hover:bg-[#F7F9FF] cursor-pointer" :
                                           "opacity-40 cursor-not-allowed"
                      )}
                    >
                      {/* Lesson icon */}
                      <div className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center shrink-0",
                        done     ? "bg-emerald-50" :
                        unlocked ? "bg-[#EBF1FF]" :
                                   "bg-[#F1F1F5]"
                      )}>
                        {done
                          ? <CircleCheck size={13} className="text-emerald-500" />
                          : unlocked
                            ? <PlayCircle size={13} style={{ color: '#1E4DD7' }} />
                            : <Lock size={11} className="text-[#ADADBE]" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className={cn("font-semibold text-[13px]",
                          done ? "text-[#ADADBE] line-through" : unlocked ? "text-[#18181B]" : "text-[#ADADBE]"
                        )}>{lesson.title}</div>
                        <p className="text-[11px] text-[#9E9E9E] mt-0.5 truncate">{lesson.summary}</p>
                      </div>

                      {done
                        ? <span className="text-[11px] font-bold text-emerald-500 shrink-0 bg-emerald-50 px-2 py-0.5 rounded-full">Done</span>
                        : unlocked
                          ? <ChevronRight size={14} className="text-[#ADADBE] shrink-0" />
                          : null}
                    </button>
                  )
                })}

                {/* Module Quiz row */}
                <div
                  onClick={canTakeQuiz ? () => openQuiz(mi) : undefined}
                  className={cn(
                    "px-5 py-3.5 flex items-center gap-3.5 transition-all",
                    canTakeQuiz ? "cursor-pointer hover:bg-[#EBF1FF]" : "opacity-60 cursor-default"
                  )}
                  style={canTakeQuiz ? { background: 'rgba(30,77,215,0.04)' } : {}}
                >
                  <div className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center shrink-0",
                    quizPassedForModule ? "bg-emerald-50" :
                    canTakeQuiz        ? "bg-[#EBF1FF]" :
                                         "bg-[#F1F1F5]"
                  )}>
                    {quizPassedForModule
                      ? <CircleCheck size={13} className="text-emerald-500" />
                      : <Sparkles size={12} style={{ color: canTakeQuiz ? '#1E4DD7' : '#ADADBE' }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={cn("font-bold text-[13px]",
                      quizPassedForModule ? "text-emerald-600" : canTakeQuiz ? "text-[#1E4DD7]" : "text-[#ADADBE]"
                    )}>
                      Module Quiz
                    </div>
                    <p className="text-[11px] text-[#9E9E9E] mt-0.5">
                      {quizPassedForModule ? 'Passed — next module unlocked' : canTakeQuiz ? '10 questions · Score 70%+ to continue' : 'Complete all lessons first'}
                    </p>
                  </div>
                  {quizPassedForModule
                    ? <span className="text-[11px] font-bold text-emerald-500 shrink-0 bg-emerald-50 px-2 py-0.5 rounded-full">Passed</span>
                    : canTakeQuiz
                      ? <ChevronRight size={14} style={{ color: '#1E4DD7' }} className="shrink-0" />
                      : <Lock size={11} className="text-[#ADADBE] shrink-0" />}
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
// ── Generate dynamic roadmap milestones ──────────────────────────────────────
// Helper: convert weeks to a friendly plan label
function planLabel(weeks) {
  if (weeks <= 13) return '3-Month Plan'
  if (weeks <= 26) return '6-Month Plan'
  if (weeks <= 52) return '12-Month Plan'
  return '24-Month Plan'
}

// Helper: compute proportional week ranges for 6 milestones
function getMilestoneWeeks(totalWeeks) {
  const w = (f) => Math.max(1, Math.round(totalWeeks * f))
  const w1end = w(0.10)
  const w2end = Math.max(w1end + 1, w(0.25))
  const w3end = Math.max(w2end + 1, w(0.50))
  const w4end = Math.max(w3end + 1, w(0.70))
  const w5end = Math.max(w4end + 1, w(0.85))
  const fmt   = (a, b) => a === b ? `Week ${a}` : `Week ${a}–${b}`
  return [
    fmt(1,          w1end),
    fmt(w1end + 1,  w2end),
    fmt(w2end + 1,  w3end),
    fmt(w3end + 1,  w4end),
    fmt(w4end + 1,  w5end),
    fmt(w5end + 1,  totalWeeks),
  ]
}

function generateMilestones(answers, score) {
  const dest = answers.destination || ''
  const seg  = answers.segment || ''
  const lang = answers.language || 'Not taken'
  const visaRoute = getVisaRoute(dest || 'your destination', seg)
  const destLabel = dest || 'your destination'

  const hasLangScore = lang !== 'Not taken' && lang !== 'Registered / scheduled'
  const hasGoodLang  = lang.includes('7.') || lang.includes('8.') ||
    lang.startsWith('OET') || lang.startsWith('CELPIP')

  const m1Done = false
  const m2Done = false
  const m3Done = false
  const m4Done = false; const m5Done = false; const m6Done = false

  const currentIdx = m1Done && m2Done && m3Done && m4Done && m5Done ? 5
    : m1Done && m2Done && m3Done && m4Done ? 4
    : m1Done && m2Done && m3Done ? 3
    : m1Done && m2Done ? 2
    : m1Done ? 1 : 0

  // Timeline drives duration — score is the fallback for older quiz results
  const TIMELINE_WEEKS = {
    '0–3 months — I need to move very soon':    13,
    '3–6 months — I have some time to prepare': 26,
    '6–12 months — I\'m planning well ahead':   52,
    '12–24 months — I\'m in the early stages':  96,
  }
  const totalWeeks = TIMELINE_WEEKS[answers.timeline]
    ?? (score >= 70 ? 16 : score >= 40 ? 20 : 24)

  const mWeeks = getMilestoneWeeks(totalWeeks)

  const completedCount = [m1Done, m2Done, m3Done, m4Done, m5Done, m6Done].filter(Boolean).length
  const pct = Math.round((completedCount / 6) * 100)

  // Destination-specific content
  const docEvalText =
    dest === 'Canada'    ? 'Get degree evaluation from WES (World Education Services)' :
    dest === 'UK'        ? 'Get degree evaluated by NARIC / ENIC UK' :
    dest === 'Australia' ? 'Get skills assessed (ACS for tech, AHPRA for healthcare)' :
    dest === 'Germany'   ? 'Get qualification recognised via anabin / KMK database' :
    dest === 'Ireland'   ? 'Get qualifications assessed by Quality and Qualifications Ireland' :
                           `Research qualification recognition requirements for ${destLabel}`

  const portalText =
    dest === 'Canada'    ? 'Create your Express Entry profile on the IRCC portal' :
    dest === 'UK'        ? 'Submit your application on the UK Visas & Immigration online portal' :
    dest === 'Australia' ? 'Lodge an Expression of Interest on SkillSelect' :
    dest === 'Germany'   ? 'Apply through the German Federal Employment Agency (BA) portal' :
    dest === 'Ireland'   ? 'Apply via the Employment Permits Online System (EPOS)' :
    dest === 'UAE'       ? 'Apply through the UAE GDRFA or ICP online portal' :
                           `Submit your visa application via the ${destLabel} immigration portal`

  const jobText =
    seg.includes('Tech')       ? `Apply to 10+ tech employers in ${destLabel} that offer visa sponsorship` :
    seg.includes('Healthcare') ? `Apply to hospitals / health trusts in ${destLabel} that sponsor overseas workers` :
    seg.includes('Student')    ? `Apply to accredited universities or colleges in ${destLabel}` :
    seg.includes('Freelance')  ? `Build a client base or remote work portfolio for ${destLabel}` :
                                  `Apply to sponsored roles on LinkedIn and ${destLabel}-specific job boards`

  const m4Phase =
    dest === 'UK'     ? 'Employment' :
    dest === 'Canada' ? 'Express Entry' :
                        'Preparation'

  const m4Title =
    dest === 'UK'     ? 'Obtain job offer & Certificate of Sponsorship' :
    dest === 'Canada' ? 'Build CRS score & receive Invitation to Apply' :
                        'Build your professional profile'

  const m4Desc =
    dest === 'UK'     ? 'Secure a licensed UK employer to sponsor your Skilled Worker Visa.' :
    dest === 'Canada' ? 'Improve your CRS score and wait for an ITA from the Express Entry pool.' :
                        'Strengthen your profile to meet destination-specific requirements.'

  const m4Actions =
    dest === 'UK' ? [
      docEvalText,
      'Search the GOV.UK licensed sponsor register for your sector',
      jobText,
      `Prepare a UK-format CV and Statement of Purpose (SOP)`,
    ] : dest === 'Canada' ? [
      docEvalText,
      'Complete your Provincial Nominee Programme (PNP) application if applicable',
      jobText,
      'Boost CRS score — additional language scores, provincial nomination, or job offer',
    ] : [
      docEvalText,
      jobText,
      seg.includes('Tech') ? 'Obtain a cloud certification (AWS / GCP / Azure)' :
      seg.includes('Healthcare') ? `Register with the relevant professional body in ${destLabel}` :
      'Update your LinkedIn and CV to international format',
      'Build savings to meet proof-of-funds threshold',
    ]

  const langTestName =
    seg.includes('Healthcare')                ? 'OET / IELTS Academic' :
    dest === 'Canada'                          ? 'IELTS General / CELPIP' :
    dest === 'Australia' || dest === 'Ireland' ? 'IELTS Academic' :
                                                 'IELTS Academic / General'

  const phases = [
    'Foundation',
    'Language',
    m4Phase,
    'Application',
    'Relocation',
  ]

  const milestones = [
    {
      id: 'mi1', week: mWeeks[0], phase: 'Foundation',
      title: 'Complete eligibility assessment',
      desc: `Understand exactly where you stand against ${visaRoute} criteria.`,
      actions: [
        `Reviewed your JapaLearn readiness score for ${destLabel}`,
        `Identified key requirements for the ${visaRoute}`,
        'Profile gaps and priorities documented',
      ],
      done: m1Done, current: currentIdx === 0,
    },
    {
      id: 'mi2', week: mWeeks[1], phase: 'Foundation',
      title: 'Gather your core documents',
      desc: 'Collect and organise the primary documents needed for your application.',
      actions: [
        'Obtain / renew your international passport (must be valid 6+ months beyond travel)',
        'Request degree certificate & certified transcripts from your institution',
        'Collect NYSC discharge certificate or exemption letter',
        'Gather employment reference letters (on letterhead, signed)',
      ],
      done: m2Done, current: currentIdx === 1,
    },
    {
      id: 'mi3', week: mWeeks[2], phase: 'Language',
      title: hasGoodLang
        ? `Language requirement met — ${lang.split('—')[0].trim()}`
        : hasLangScore
          ? `Improve your ${langTestName} score`
          : `Book ${langTestName} & begin preparation`,
      desc: hasGoodLang
        ? 'Your language score meets the requirement. Keep your certificate ready.'
        : `English language is your most time-sensitive requirement for ${destLabel} — start now.`,
      actions: hasGoodLang
        ? [
            'Request your official score report from the test body',
            `Send results directly to your ${destLabel} employer or visa body`,
            'Keep a copy certified for your visa application file',
          ]
        : [
            `Register with British Council, IDP, or CELPIP (for Canada)`,
            `Follow a 6-week ${langTestName} structured study plan`,
            'Target Band 7.0+ in all four skills (or OET Grade B for healthcare)',
            'Book your exam slot at least 4–6 weeks in advance',
          ],
      done: m3Done, current: currentIdx === 2,
    },
    {
      id: 'mi4', week: mWeeks[3], phase: m4Phase,
      title: m4Title,
      desc: m4Desc,
      actions: m4Actions,
      done: m4Done, current: currentIdx === 3,
    },
    {
      id: 'mi5', week: mWeeks[4], phase: 'Application',
      title: `Submit your ${visaRoute} application`,
      desc: `Compile every document and submit your formal application to ${dest || 'the immigration authority'}.`,
      actions: [
        portalText,
        dest === 'UK' ? 'Pay the Immigration Health Surcharge (IHS) — required for most UK visas' :
        dest === 'Canada' ? 'Pay IRCC application and biometrics fees' :
        'Pay the required application and processing fees',
        'Book and attend your biometrics appointment at a UKVCAS / VFS centre',
        'Engage a verified immigration consultant for a final application review',
      ],
      done: m5Done, current: currentIdx === 4,
    },
    {
      id: 'mi6', week: mWeeks[5], phase: 'Relocation',
      title: 'Await visa decision & prepare your move',
      desc: `Use this window to plan your arrival, accommodation, and first weeks in ${destLabel}.`,
      actions: [
        `Research housing and neighbourhoods in your target city in ${destLabel}`,
        'Open an international bank account (Wise, Monzo, or Revolut) before you travel',
        `Connect with Nigerian diaspora communities in ${destLabel} for on-ground support`,
        'Notify your Nigerian bank, FRSC, and relevant institutions of your move',
      ],
      done: m6Done, current: currentIdx === 5,
    },
  ]

  return { milestones, totalWeeks, completedCount, pct, visaRoute, destLabel, phases, timelinePlan: planLabel(totalWeeks) }
}

function RoadmapTab({ answers, score, quizResult, router }) {
  const [expandedMilestone, setExpandedMilestone] = useState('mi2')
  const [showReportModal, setShowReportModal] = useState(false)
  const [reportInterest, setReportInterest] = useState(false)
  const isMobile = useIsMobile()

  if (!quizResult?.answers?.destination || !quizResult?.answers?.segment) {
    if (isMobile) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 40 }}>
          {/* Mobile sub-header */}
          <div>
            <p style={{ margin: '0 0 3px', fontSize: 11, color: '#82858A', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Calendar size={11} style={{ color: '#82858A' }} />
              <span>Your personalised plan awaits</span>
            </p>
            <h1 style={{ margin: '0 0 3px', fontSize: 22, fontWeight: 700, color: '#18181B', letterSpacing: '-0.5px', fontFamily: 'DM Sans, sans-serif' }}>My Roadmap</h1>
            <p style={{ margin: 0, fontSize: 13, color: '#82858A' }}>You need to take the quiz to build a personalised roadmap.</p>
          </div>
          {/* Mobile blue banner — no quiz state */}
          <div style={{ background: 'linear-gradient(135deg, #1A42C2 0%, #2F67F8 60%, #5C8AFF 100%)', borderRadius: 18, padding: 18, boxShadow: '0px 10px 32px rgba(30,77,215,0.25)' }}>
            <p style={{ margin: '0 0 2px', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.09em', textTransform: 'uppercase' }}>Quiz Required</p>
            <p style={{ margin: '0 0 2px', fontSize: 20, fontWeight: 800, color: '#FFFFFF', fontFamily: 'DM Sans, sans-serif', letterSpacing: '-0.4px' }}>Not started yet</p>
            <p style={{ margin: '0 0 10px', fontSize: 12, color: 'rgba(255,255,255,0.65)' }}>Your destination, visa route &amp; timeline unlock after the quiz</p>
            <div style={{ height: 7, background: 'rgba(255,255,255,0.18)', borderRadius: 4, overflow: 'hidden', marginBottom: 6 }}>
              <div style={{ width: '5%', height: '100%', background: 'linear-gradient(90deg, rgba(255,255,255,0.8), #FFFFFF)', borderRadius: 4 }} />
            </div>
            <p style={{ margin: '0 0 14px', fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>0 of 6 milestones completed · 0% done</p>
            <div style={{ display: 'flex', gap: 8 }}>
              {[{ val: '—', label: 'Weeks left' }, { val: '0%', label: 'Complete' }, { val: '6', label: 'Ahead' }].map(s => (
                <div key={s.label} style={{ flex: 1, padding: '10px 8px', background: 'rgba(255,255,255,0.14)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)', textAlign: 'center' }}>
                  <p style={{ margin: '0 0 1px', fontSize: 16, fontWeight: 800, color: '#FFFFFF', fontFamily: 'DM Sans, sans-serif' }}>{s.val}</p>
                  <p style={{ margin: 0, fontSize: 9, fontWeight: 600, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    }
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingBottom: 40, maxWidth: 700 }}>
        {/* Desktop sub-header */}
        <div>
          <p style={{ margin: '0 0 4px', fontSize: 13, color: '#82858A', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 5 }}>
            <Calendar size={13} style={{ color: '#82858A' }} />
            <span>Your personalised plan awaits</span>
          </p>
          <h1 style={{ margin: '0 0 4px', fontSize: 26, fontWeight: 700, color: '#18181B', letterSpacing: '-0.6px', fontFamily: 'DM Sans, sans-serif' }}>My Roadmap</h1>
          <p style={{ margin: 0, fontSize: 14, color: '#82858A' }}>You need to take the quiz to build a personalised roadmap.</p>
        </div>
        {/* Desktop blue banner — no quiz state */}
        <div style={{ background: 'linear-gradient(135deg, #1A42C2 0%, #2F67F8 60%, #5C8AFF 100%)', borderRadius: 22, padding: '28px 28px 24px', boxShadow: '0px 16px 48px rgba(30,77,215,0.28)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap' }}>
            {/* Left */}
            <div style={{ flex: 1, minWidth: 160 }}>
              <p style={{ margin: '0 0 4px', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.09em', textTransform: 'uppercase' }}>Quiz Required</p>
              <p style={{ margin: '0 0 2px', fontSize: 22, fontWeight: 800, color: '#FFFFFF', fontFamily: 'DM Sans, sans-serif', letterSpacing: '-0.5px' }}>Not started yet</p>
              <p style={{ margin: '0 0 18px', fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>Your destination, visa route &amp; timeline unlock after the quiz</p>
              <div style={{ height: 8, background: 'rgba(255,255,255,0.18)', borderRadius: 4, overflow: 'hidden', marginBottom: 8, maxWidth: 280 }}>
                <div style={{ width: '5%', height: '100%', background: 'linear-gradient(90deg, rgba(255,255,255,0.8), #FFFFFF)', borderRadius: 4 }} />
              </div>
              <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>0 of 6 milestones completed · 0% done</p>
            </div>
            {/* Right: stat chips */}
            <div style={{ display: 'flex', gap: 10, flexShrink: 0, flexWrap: 'wrap' }}>
              {[{ val: '—', label: 'Weeks left' }, { val: '0%', label: 'Complete' }, { val: '6', label: 'Actions due' }].map(s => (
                <div key={s.label} style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.14)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.2)', textAlign: 'center', backdropFilter: 'blur(10px)', minWidth: 72 }}>
                  <p style={{ margin: '0 0 2px', fontSize: 22, fontWeight: 800, color: '#FFFFFF', fontFamily: 'DM Sans, sans-serif' }}>{s.val}</p>
                  <p style={{ margin: 0, fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const { milestones, totalWeeks, completedCount, pct, visaRoute, destLabel, phases, timelinePlan } = generateMilestones(answers, score)
  const currentMilestone = milestones.find(m => m.current) || milestones.find(m => !m.done) || milestones[milestones.length - 1]
  const weeksLeft = Math.round(totalWeeks * (1 - pct / 100))

  // Shared milestone timeline JSX (same for mobile + desktop)
  const MilestoneTimeline = (
    <div className="bg-white rounded-[18px]" style={{ padding: isMobile ? 16 : 24, boxShadow: '0px 2px 16px rgba(30,77,215,0.06)', border: '1px solid #F0F2FF' }}>
      <div className="flex flex-col gap-0">
        {milestones.map((milestone, idx) => {
          const isOpen = expandedMilestone === milestone.id
          return (
            <div key={milestone.id} className="flex gap-0">
              {/* Timeline spine */}
              <div className="flex flex-col items-center shrink-0" style={{ width: isMobile ? 36 : 44 }}>
                <div className="rounded-full flex items-center justify-center shrink-0 z-10"
                  style={{
                    width: isMobile ? 28 : 32, height: isMobile ? 28 : 32,
                    background: milestone.done ? 'linear-gradient(135deg, #1E4DD7, #3B75FF)' : milestone.current ? '#FFFFFF' : '#F4F6FF',
                    border: milestone.current ? '2.5px solid #1E4DD7' : milestone.done ? 'none' : '2px solid #E0E4F5',
                    boxShadow: milestone.current ? '0 0 0 4px rgba(30,77,215,0.1)' : 'none',
                  }}>
                  {milestone.done
                    ? <CheckCircle2 size={isMobile ? 12 : 14} className="text-white" />
                    : milestone.current
                      ? <div style={{ width: isMobile ? 9 : 10, height: isMobile ? 9 : 10, borderRadius: '50%', background: '#1E4DD7' }} />
                      : <span style={{ fontSize: 10, fontWeight: 700, color: '#C0C4D4' }}>{idx + 1}</span>}
                </div>
                {idx < milestones.length - 1 && (
                  <div className="w-0.5 flex-1 min-h-3 my-1" style={{ background: milestone.done ? 'linear-gradient(180deg, #3B75FF, #9BB3FF)' : milestone.current ? 'linear-gradient(180deg, #3B75FF 40%, #E8EBF8 100%)' : '#E8EBF8' }} />
                )}
              </div>

              {/* Milestone card */}
              <div className="flex-1 pl-3" style={{ paddingBottom: idx < milestones.length - 1 ? '14px' : '0' }}>
                <button
                  onClick={() => setExpandedMilestone(isOpen ? null : milestone.id)}
                  className="w-full text-left rounded-xl transition-all"
                  style={{
                    position: 'relative',
                    padding: isMobile ? '10px 12px' : '12px 14px',
                    background: milestone.done ? '#F8FFF9' : isOpen ? (milestone.current ? 'linear-gradient(135deg, #EBF1FF, #E4EEFF)' : '#FAFBFF') : 'transparent',
                    border: milestone.done ? '1.5px solid #D8F5E6' : isOpen ? '1.5px solid #D4DCFF' : '1.5px solid transparent',
                    opacity: milestone.done ? 0.8 : 1,
                  }}
                >
                  {milestone.done && (
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: 14,
                      right: 14,
                      height: 1.5,
                      background: 'linear-gradient(90deg, #21C474 0%, #10B981 100%)',
                      transform: 'translateY(-50%)',
                      pointerEvents: 'none',
                      borderRadius: 1,
                      opacity: 0.55,
                    }} />
                  )}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                        <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: milestone.done ? '#21C474' : milestone.current ? '#1E4DD7' : '#B0B4C4' }}>
                          {milestone.week}
                        </span>
                        <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 5, background: milestone.done ? '#E8F9EE' : milestone.current ? '#EBF1FF' : '#F4F4F6', color: milestone.done ? '#21C474' : milestone.current ? '#1E4DD7' : '#B0B4C4' }}>
                          {milestone.phase}
                        </span>
                        {milestone.current && (
                          <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 5, background: 'linear-gradient(135deg, #1E4DD7, #3B75FF)', color: '#FFFFFF' }}>▸ You are here</span>
                        )}
                        {milestone.done && (
                          <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 5, background: '#E8F9EE', color: '#21C474' }}>Done ✓</span>
                        )}
                      </div>
                      <p style={{ margin: '0 0 3px', fontSize: 13, fontWeight: milestone.current ? 700 : milestone.done ? 500 : 600, color: milestone.done ? '#82858A' : '#18181B', textDecoration: milestone.done ? 'line-through' : 'none', lineHeight: 1.35 }}>
                        {milestone.title}
                      </p>
                      <p style={{ margin: 0, fontSize: 12, color: '#82858A', lineHeight: 1.4 }}>{milestone.desc}</p>
                    </div>
                    <ChevronDown size={14} style={{ color: '#B0B4C4', flexShrink: 0, marginTop: 2, transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                  </div>

                  {isOpen && (
                    <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(30,77,215,0.1)' }}>
                      <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 700, color: '#82858A', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Action Steps</p>
                      <ul className="flex flex-col gap-1.5">
                        {milestone.actions.map((action, ai) => (
                          <li key={ai} className="flex items-start gap-2 rounded-lg"
                            style={{ padding: isMobile ? '8px 10px' : '9px 12px', background: milestone.done ? '#F8FFF9' : milestone.current ? '#F0F5FF' : '#FAFBFF', border: `1px solid ${milestone.done ? '#D8F5E6' : milestone.current ? '#D4DCFF' : '#ECEEFF'}` }}>
                            <div className="rounded-full flex items-center justify-center shrink-0 mt-0.5"
                              style={{ width: 18, height: 18, background: milestone.done ? 'linear-gradient(135deg, #21C474, #10B981)' : milestone.current ? '#EBF1FF' : '#F0F2FF' }}>
                              {milestone.done
                                ? <CheckCircle2 size={9} className="text-white" />
                                : <span style={{ fontSize: 8, fontWeight: 700, color: milestone.current ? '#1E4DD7' : '#B0B4C4' }}>{ai + 1}</span>}
                            </div>
                            <span style={{ fontSize: 12, lineHeight: 1.5, color: milestone.done ? '#6B7280' : '#2D2D35', textDecoration: milestone.done ? 'line-through' : 'none' }}>{action}</span>
                          </li>
                        ))}
                      </ul>
                      {milestone.current && (
                        <button className="w-full mt-3 py-2.5 rounded-[10px] text-white text-[12px] font-semibold flex items-center justify-center gap-1.5"
                          style={{ background: 'linear-gradient(135deg, #1E4DD7, #3B75FF)' }}>
                          <span>Work on this milestone</span>
                          <ArrowRight size={12} className="text-white" />
                        </button>
                      )}
                    </div>
                  )}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  const REPORT_INCLUDES = [
    'Your personalised step-by-step relocation plan',
    `Tailored to your ${answers.destination || 'destination'} ${answers.segment ? `(${answers.segment})` : ''} pathway`,
    'Week-by-week actionable milestones with specific deadlines',
    'Document checklist, financial planning & visa timeline',
    'Downloadable PDF you can share with family',
  ]

  const MigrationReportCard = (
    <div style={{ background: 'linear-gradient(135deg, #EBF1FF 0%, #F2EEFF 100%)', borderRadius: isMobile ? 14 : 16, padding: isMobile ? '14px 16px' : '18px 20px', border: '1px solid #D4DCFF', display: 'flex', alignItems: 'center', gap: isMobile ? 12 : 14 }}>
      <div style={{ width: isMobile ? 36 : 40, height: isMobile ? 36 : 40, borderRadius: isMobile ? 10 : 12, background: 'linear-gradient(135deg, #1E4DD7, #3B75FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <FileText size={isMobile ? 15 : 18} color="#FFFFFF" />
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ margin: '0 0 2px', fontSize: isMobile ? 12 : 13, fontWeight: 700, color: '#1E4DD7' }}>Your next priority action</p>
        <p style={{ margin: 0, fontSize: isMobile ? 12 : 13, color: '#4D4D56', lineHeight: 1.5 }}>Get a detailed, personalised Migration Report. This is the basic roadmap.</p>
      </div>
      <button
        onClick={() => setShowReportModal(true)}
        style={{ padding: isMobile ? '9px 14px' : '10px 18px', background: 'linear-gradient(135deg, #1E4DD7, #3B75FF)', color: '#FFFFFF', border: 'none', borderRadius: isMobile ? 9 : 10, fontSize: isMobile ? 12 : 13, fontWeight: 600, cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap', boxShadow: '0px 4px 14px rgba(30,77,215,0.25)' }}
      >
        Get Report
      </button>
    </div>
  )

  const ReportModal = (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: isMobile ? 0 : 24 }} onClick={() => { setShowReportModal(false); setReportInterest(false) }}>
      <div style={{ background: '#FFFFFF', borderRadius: isMobile ? '20px 20px 0 0' : 24, padding: isMobile ? '24px 20px 32px' : '32px 32px 36px', width: '100%', maxWidth: isMobile ? '100%' : 480, boxShadow: '0px -10px 60px rgba(30,77,215,0.18)' }} onClick={e => e.stopPropagation()}>
        {!reportInterest ? (
          <>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <p style={{ margin: '0 0 4px', fontSize: 11, fontWeight: 700, color: '#1E4DD7', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Full Migration Report</p>
                <h2 style={{ margin: 0, fontSize: isMobile ? 22 : 26, fontWeight: 800, color: '#18181B', letterSpacing: '-0.5px', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.2 }}>Your Personalised<br />Report is ₦5,000</h2>
              </div>
              <button onClick={() => setShowReportModal(false)} style={{ background: '#F4F6FF', border: 'none', borderRadius: 10, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                <X size={14} color="#82858A" />
              </button>
            </div>

            {/* What's included */}
            <p style={{ margin: '0 0 12px', fontSize: 12, fontWeight: 700, color: '#82858A', textTransform: 'uppercase', letterSpacing: '0.07em' }}>What&apos;s included</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
              {REPORT_INCLUDES.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px', background: '#F0F5FF', borderRadius: 10, border: '1px solid #D4DCFF' }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'linear-gradient(135deg, #1E4DD7, #3B75FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                    <CheckCircle2 size={9} color="#FFFFFF" />
                  </div>
                  <span style={{ fontSize: 13, color: '#2D2D35', lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>

            {/* vs basic */}
            <div style={{ background: '#FFF7E6', borderRadius: 10, padding: '10px 14px', marginBottom: 20, border: '1px solid #FDE68A' }}>
              <p style={{ margin: 0, fontSize: 12, color: '#92400E' }}><strong>vs your basic roadmap:</strong> The full report includes exact dates, financial projections, and a consultant-reviewed document checklist — not just milestone overviews.</p>
            </div>

            {/* CTA */}
            <button
              onClick={() => setReportInterest(true)}
              style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #1E4DD7, #3B75FF)', color: '#FFFFFF', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: '0px 6px 20px rgba(30,77,215,0.3)', letterSpacing: '-0.2px', fontFamily: 'DM Sans, sans-serif' }}
            >
              I&apos;m Interested — ₦5,000
            </button>
            <p style={{ margin: '10px 0 0', textAlign: 'center', fontSize: 11, color: '#9E9E9E' }}>Payments launching soon — we&apos;ll notify you first</p>
          </>
        ) : (
          <>
            <div style={{ textAlign: 'center', padding: '16px 0 8px' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #21C474, #10B981)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <CheckCircle2 size={26} color="#FFFFFF" />
              </div>
              <h2 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 800, color: '#18181B', letterSpacing: '-0.5px', fontFamily: 'DM Sans, sans-serif' }}>You&apos;re on the list!</h2>
              <p style={{ margin: '0 0 24px', fontSize: 14, color: '#82858A', lineHeight: 1.6 }}>We&apos;re setting up payments now. We&apos;ll email you the moment your personalised Migration Report is ready to order.</p>
              <button onClick={() => { setShowReportModal(false); setReportInterest(false) }} style={{ width: '100%', padding: '13px', background: '#F4F6FF', color: '#1E4DD7', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <div className="flex flex-col gap-4 pb-10 w-full">
        {/* Mobile sub-header */}
        <div>
          <p style={{ margin: '0 0 3px', fontSize: 11, color: '#82858A', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Calendar size={11} style={{ color: '#82858A' }} />
            <span>{visaRoute} · {timelinePlan}</span>
          </p>
          <h1 style={{ margin: '0 0 3px', fontSize: 22, fontWeight: 700, color: '#18181B', letterSpacing: '-0.5px', fontFamily: 'DM Sans, sans-serif' }}>My Roadmap</h1>
          <p style={{ margin: 0, fontSize: 13, color: '#82858A' }}>Tap any milestone to see action steps.</p>
        </div>

        {/* Mobile hero */}
        <div style={{ background: 'linear-gradient(135deg, #1A42C2 0%, #2F67F8 60%, #5C8AFF 100%)', borderRadius: 18, padding: 18, boxShadow: '0px 10px 32px rgba(30,77,215,0.25)' }}>
          <p style={{ margin: '0 0 2px', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.09em', textTransform: 'uppercase' }}>Current Phase</p>
          <p style={{ margin: '0 0 2px', fontSize: 20, fontWeight: 800, color: '#FFFFFF', fontFamily: 'DM Sans, sans-serif', letterSpacing: '-0.4px' }}>{currentMilestone.phase}</p>
          <p style={{ margin: '0 0 10px', fontSize: 12, color: 'rgba(255,255,255,0.65)' }}>{currentMilestone.week} · {currentMilestone.title}</p>
          <div style={{ height: 7, background: 'rgba(255,255,255,0.18)', borderRadius: 4, overflow: 'hidden', marginBottom: 6 }}>
            <div style={{ width: `${Math.max(pct, 5)}%`, height: '100%', background: 'linear-gradient(90deg, rgba(255,255,255,0.8), #FFFFFF)', borderRadius: 4 }} />
          </div>
          <p style={{ margin: '0 0 14px', fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>{completedCount} of 6 milestones completed · {pct}% done</p>
          <div style={{ display: 'flex', gap: 8 }}>
            {[{ val: `${weeksLeft}`, label: 'Weeks left' }, { val: `${pct}%`, label: 'Complete' }, { val: `${6 - completedCount}`, label: 'Actions due' }].map(s => (
              <div key={s.label} style={{ flex: 1, textAlign: 'center', padding: '10px 8px', background: 'rgba(255,255,255,0.14)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)' }}>
                <p style={{ margin: '0 0 1px', fontSize: 16, fontWeight: 800, color: '#FFFFFF', fontFamily: 'DM Sans, sans-serif' }}>{s.val}</p>
                <p style={{ margin: 0, fontSize: 9, fontWeight: 600, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {MilestoneTimeline}
        {MigrationReportCard}
        {showReportModal && ReportModal}
      </div>
    )
  }

  // ── DESKTOP ──
  return (
    <div className="flex flex-col gap-5 pb-10" style={{ maxWidth: 700 }}>
      {/* Desktop sub-header */}
      <div>
        <p className="text-[13px] text-[#82858A] font-medium flex items-center gap-1.5 mb-1">
          <Calendar size={13} className="text-[#82858A]" />
          <span>{visaRoute} · {timelinePlan}</span>
        </p>
        <h1 className="text-[26px] font-bold text-[#18181B] mb-1" style={{ letterSpacing: '-0.6px', fontFamily: 'DM Sans, sans-serif' }}>My Roadmap</h1>
        <p className="text-[14px] text-[#82858A]">Your personalised week-by-week migration plan. Click any milestone to see your action steps.</p>
      </div>

      {/* Desktop hero — left: phase info + right: stats + bottom: phase strip */}
      <div className="rounded-[22px] overflow-hidden" style={{ background: 'linear-gradient(135deg, #1A42C2 0%, #2F67F8 60%, #5C8AFF 100%)', boxShadow: '0px 16px 48px rgba(30,77,215,0.28)' }}>
        {/* Top section */}
        <div className="flex items-start gap-5 flex-wrap" style={{ padding: '28px 28px 24px' }}>
          {/* Left: Phase + progress */}
          <div className="flex-1 min-w-[160px]">
            <p style={{ margin: '0 0 4px', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.09em', textTransform: 'uppercase' }}>Current Phase</p>
            <p style={{ margin: '0 0 2px', fontSize: 22, fontWeight: 800, color: '#FFFFFF', fontFamily: 'DM Sans, sans-serif', letterSpacing: '-0.5px' }}>{currentMilestone.phase}</p>
            <p style={{ margin: '0 0 18px', fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>{currentMilestone.week} · {currentMilestone.title}</p>
            <div style={{ height: 8, background: 'rgba(255,255,255,0.18)', borderRadius: 4, overflow: 'hidden', marginBottom: 8, maxWidth: 280 }}>
              <div style={{ width: `${Math.max(pct, 5)}%`, height: '100%', background: 'linear-gradient(90deg, rgba(255,255,255,0.8), #FFFFFF)', borderRadius: 4 }} />
            </div>
            <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{completedCount} of 6 milestones completed · {pct}% done</p>
          </div>

          {/* Right: 3 stat chips */}
          <div className="flex gap-2.5 shrink-0 flex-wrap">
            {[{ val: `${weeksLeft}`, label: 'Weeks left' }, { val: `${pct}%`, label: 'Complete' }, { val: `${6 - completedCount}`, label: 'Actions due' }].map(s => (
              <div key={s.label} style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.14)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.2)', textAlign: 'center', backdropFilter: 'blur(10px)', minWidth: 72 }}>
                <p style={{ margin: '0 0 2px', fontSize: 22, fontWeight: 800, color: '#FFFFFF', fontFamily: 'DM Sans, sans-serif' }}>{s.val}</p>
                <p style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,0.6)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Phase strip */}
        <div style={{ display: 'flex', borderTop: '1px solid rgba(255,255,255,0.12)' }}>
          {phases.map((phase, pi) => {
            const isActive = phase === currentMilestone.phase
            const isDone = pi < milestones.findIndex(m => m.phase === currentMilestone.phase && !m.done && !m.done)
              && milestones.filter(m => m.phase === phase).every(m => m.done)
            return (
              <div key={phase} style={{ flex: 1, padding: '10px 8px', textAlign: 'center', borderRight: pi < phases.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none', background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent' }}>
                <p style={{ margin: 0, fontSize: 10, fontWeight: isActive ? 700 : 500, color: isDone ? 'rgba(255,255,255,0.9)' : isActive ? '#FFFFFF' : 'rgba(255,255,255,0.45)', letterSpacing: '0.04em' }}>{phase}</p>
                {isActive && <div style={{ width: 20, height: 3, background: '#FFFFFF', borderRadius: 2, margin: '4px auto 0' }} />}
                {isDone && <p style={{ margin: '2px 0 0', fontSize: 9, color: '#4ADE80', fontWeight: 700 }}>✓ Done</p>}
              </div>
            )
          })}
        </div>
      </div>

      {MilestoneTimeline}
      {MigrationReportCard}
      {showReportModal && ReportModal}
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
      <div className="rounded-[20px] p-6" style={{ background: 'linear-gradient(135deg, #0F2E99 0%, #1E4DD7 50%, #3B75FF 100%)', boxShadow: '0px 10px 36px rgba(30,77,215,0.28)' }}>
        <p className="text-[11px] font-bold text-white/60 uppercase tracking-widest mb-1">Resources</p>
        <h2 className="text-xl font-extrabold text-white mb-1">Learning Resources</h2>
        <p className="text-sm text-white/70 mb-4">
          {profileFiltered && answers.destination
            ? `Curated for ${answers.destination}${answers.segment ? ` · ${answers.segment}` : ''}`
            : 'All available resources'}
        </p>
        {answers.destination && (
          <button
            onClick={() => { setProfileFiltered(f => !f); setFallback(false) }}
            className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-full transition-all"
            style={profileFiltered
              ? { background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }
              : { background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.15)' }}
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
            className="px-3 py-1.5 rounded-full text-xs font-bold border transition-all"
            style={categoryFilter === cat.value
              ? { background: cat.color || '#1E4DD7', color: '#fff', borderColor: cat.color || '#1E4DD7' }
              : { background: '#F7F9FF', color: '#8C8C9D', borderColor: '#E0E8FF' }}
          >
            {cat.label}
          </button>
        ))}
        <div className="h-5 w-px bg-[#E0E8FF] mx-1" />
        {['all', 'pdf', 'docx', 'xlsx'].map(ft => (
          <button
            key={ft}
            onClick={() => setFileTypeFilter(ft)}
            className="px-3 py-1.5 rounded-full text-xs font-bold border transition-all"
            style={fileTypeFilter === ft
              ? { background: '#18181B', color: '#fff', borderColor: '#18181B' }
              : { background: '#F7F9FF', color: '#8C8C9D', borderColor: '#E0E8FF' }}
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
              : !answers.destination ? 'Take the quiz so we know your destination — resources are matched to your profile.' : 'Resources for your profile will appear here as they\'re added.'}
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
              <div key={r.id} className="bg-white rounded-[20px] p-5 flex flex-col gap-3 transition-all hover:shadow-[0px_8px_28px_rgba(30,77,215,0.12)]"
                style={{ border: '1px solid #E0E8FF', boxShadow: '0px 2px 10px rgba(8,15,52,0.05)' }}>
                {/* File type + category badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg" style={{ background: fi.bg }}>
                    <FileIcon size={11} style={{ color: fi.color }} />
                    <span className="text-[10px] font-bold" style={{ color: fi.color }}>{fi.label}</span>
                  </div>
                  {cat && cat.value !== 'all' && (
                    <span className="text-[10px] font-semibold px-2.5 py-1 rounded-lg" style={{ background: (cat.color || '#1E4DD7') + '1a', color: cat.color || '#1E4DD7' }}>
                      {cat.label}
                    </span>
                  )}
                  {r.country?.slice(0, 2).map(c => (
                    <span key={c} className="text-[10px] font-medium text-[#9E9E9E] bg-[#F7F9FF] px-2 py-0.5 rounded-full">{c}</span>
                  ))}
                </div>

                {/* Title + description */}
                <div className="flex-1">
                  <h4 className="font-bold text-[#18181B] text-[14px] leading-snug mb-1">{r.title}</h4>
                  {r.description && <p className="text-[#9E9E9E] text-xs leading-relaxed">{r.description}</p>}
                </div>

                {/* Download button */}
                <a
                  href={r.file_url}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #1E4DD7, #3B75FF)', color: '#fff' }}
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
// ── CONVERSATIONS TAB ──────────────────────────────────────────────────────────
function ConversationsTab({ user, profile, answers }) {
  const firstName = (profile?.full_name || user?.user_metadata?.full_name || 'there').split(' ')[0]
  const dest = answers.destination || 'your destination'
  const visaRoute = getVisaRoute(dest, answers.segment || '')

  const messages = [
    { id: 1, role: 'ai', text: `Hi ${firstName}! I'm your JapaLearn AI assistant. Ask me anything about your ${dest} migration journey — visa requirements, language tests, costs, documents and more.`, time: '9:01 AM' },
    { id: 2, role: 'user', text: `What documents do I need for a ${visaRoute}?`, time: '9:03 AM' },
    { id: 3, role: 'ai', text: `For a ${visaRoute} you'll typically need: a valid passport, proof of qualifications, language test results, financial evidence (proof of funds), employment references, and any professional registration certificates relevant to your field.`, time: '9:03 AM' },
    { id: 4, role: 'user', text: 'How much money do I need to show in my bank account?', time: '9:05 AM' },
    { id: 5, role: 'ai', text: `Proof of funds requirements vary by destination. For ${dest}, you'll need to demonstrate you can support yourself during the transition period. I'll help you calculate exactly how much based on your route once this feature is fully live.`, time: '9:05 AM' },
  ]

  const initials = firstName[0]?.toUpperCase() || 'U'

  return (
    <div className="flex flex-col gap-4 pb-10 max-w-2xl w-full">
      {/* Header */}
      <div className="flex items-center gap-2">
        <h1 className="text-[20px] font-bold text-[#18181B]" style={{ letterSpacing: '-0.4px', fontFamily: 'DM Sans, sans-serif' }}>AI Conversations</h1>
        <span className="text-[10px] font-bold text-[#7C6AF7] px-2 py-0.5 rounded-full" style={{ background: '#F0EEFF', border: '1px solid #DDD6FE' }}>Coming Soon</span>
      </div>

      {/* Chat window */}
      <div className="bg-white rounded-[18px] flex flex-col overflow-hidden" style={{ boxShadow: '0px 4px 20px rgba(30,77,215,0.08)', border: '1px solid #ECEEFF', height: 'calc(100vh - 220px)', minHeight: '400px' }}>
        {/* Chat header */}
        <div className="flex items-center gap-2.5 px-4 py-3" style={{ borderBottom: '1px solid #F0F2FF', background: 'linear-gradient(135deg, #FAFBFF, #F4F7FF)' }}>
          <div className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #1E4DD7, #3B75FF)' }}>
            <Logo size={20} />
          </div>
          <div>
            <p className="text-[13px] font-bold text-[#18181B] leading-none mb-0.5">JapaLearn AI Assistant</p>
            <p className="text-[11px] font-medium flex items-center gap-1" style={{ color: '#21C474' }}>
              <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: '#21C474' }} />
              Online · Migration specialist
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-3 p-3.5" style={{ background: '#FAFBFF' }}>
          {messages.map(msg => (
            <div key={msg.id} className="flex gap-2 items-end" style={{ flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
              {msg.role === 'ai' && (
                <div className="w-[26px] h-[26px] rounded-[8px] flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #1E4DD7, #3B75FF)' }}>
                  <Logo size={16} />
                </div>
              )}
              {msg.role === 'user' && (
                <div className="w-[26px] h-[26px] rounded-full flex items-center justify-center shrink-0 text-[11px] font-bold text-white" style={{ background: 'linear-gradient(135deg, #9BB3FF, #3B75FF)' }}>
                  {initials}
                </div>
              )}
              <div style={{ maxWidth: '75%' }}>
                <div className="px-3.5 py-2.5 text-[13px] leading-relaxed"
                  style={{
                    borderRadius: msg.role === 'ai' ? '4px 14px 14px 14px' : '14px 4px 14px 14px',
                    background: msg.role === 'ai' ? '#FFFFFF' : 'linear-gradient(135deg, #1E4DD7, #3B75FF)',
                    color: msg.role === 'ai' ? '#18181B' : '#FFFFFF',
                    boxShadow: msg.role === 'ai' ? '0px 2px 6px rgba(30,77,215,0.06)' : '0px 4px 12px rgba(30,77,215,0.3)',
                    border: msg.role === 'ai' ? '1px solid #ECEEFF' : 'none',
                  }}>
                  <p className="m-0">{msg.text}</p>
                </div>
                <p className="text-[10px] text-[#B0B4C4] mt-0.5" style={{ textAlign: msg.role === 'user' ? 'right' : 'left' }}>{msg.time}</p>
              </div>
            </div>
          ))}
          {/* Coming soon overlay */}
          <div className="mt-2 mx-auto text-center px-4 py-3 rounded-[12px] max-w-xs" style={{ background: 'rgba(124,106,247,0.07)', border: '1px solid #DDD6FE' }}>
            <p className="text-[11px] font-bold text-[#7C6AF7] mb-0.5">Full AI Chat — Coming Soon</p>
            <p className="text-[11px] text-[#82858A]">Two-way conversation, live answers, and personalised advice.</p>
          </div>
        </div>

        {/* Input area */}
        <div className="px-3.5 py-3" style={{ borderTop: '1px solid #F0F2FF', background: '#FFFFFF' }}>
          <div className="flex gap-2 items-center rounded-xl px-3 py-2.5" style={{ background: '#F4F6FF', border: '1.5px solid #E4E8FF' }}>
            <input
              type="text"
              disabled
              placeholder="Ask about visa, language tests, costs..."
              className="flex-1 border-none bg-transparent outline-none text-[13px] text-[#18181B] placeholder-[#B0B4C4]"
            />
            <button
              disabled
              className="w-8 h-8 rounded-[9px] flex items-center justify-center shrink-0 opacity-50 cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #1E4DD7, #3B75FF)' }}
            >
              <ArrowRight size={14} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── PEERS TAB ──────────────────────────────────────────────────────────────────
const PEER_PROFILES_DATA = [
  { id: 'p1', name: 'Chukwuemeka Obi',   initials: 'CO', city: 'Lagos → Manchester', score: 68, bg: 'linear-gradient(135deg, #6366F1, #8B5CF6)', mutual: 3 },
  { id: 'p2', name: 'Fatima Al-Hassan',  initials: 'FA', city: 'Abuja → Birmingham', score: 74, bg: 'linear-gradient(135deg, #EC4899, #F43F5E)', mutual: 5 },
  { id: 'p3', name: 'Tolu Adeyemi',      initials: 'TA', city: 'Lagos → London',     score: 81, bg: 'linear-gradient(135deg, #14B8A6, #0EA5E9)', mutual: 2 },
  { id: 'p4', name: 'Blessing Nwachukwu',initials: 'BN', city: 'Port Harcourt → Leeds', score: 65, bg: 'linear-gradient(135deg, #F59E0B, #EF4444)', mutual: 1 },
]
const PEER_THREADS = [
  { id: 'th1', initials: 'TA', name: 'Tolu Adeyemi',   bg: 'linear-gradient(135deg, #14B8A6, #0EA5E9)', title: "Just got my COS! Here's what actually helped me", replies: 14, likes: 31, tag: 'Success Story', tagColor: '#21C474', tagBg: '#E8F9EE', timeAgo: '2h ago' },
  { id: 'th2', initials: 'CO', name: 'Chukwuemeka Obi', bg: 'linear-gradient(135deg, #6366F1, #8B5CF6)', title: 'IELTS Academic vs General — which for Skilled Worker?', replies: 9, likes: 17, tag: 'Question', tagColor: '#3B75FF', tagBg: '#EBF1FF', timeAgo: '5h ago' },
  { id: 'th3', initials: 'FA', name: 'Fatima Al-Hassan', bg: 'linear-gradient(135deg, #EC4899, #F43F5E)', title: 'Bank statement — which bank accepted for ₦ to £ proof?', replies: 22, likes: 28, tag: 'Documents', tagColor: '#F59A0A', tagBg: '#FFF7E6', timeAgo: 'Yesterday' },
]

function PeersTab({ answers }) {
  const dest = answers.destination || 'your destination'
  const pathway = getVisaRoute(dest, answers.segment || '')

  return (
    <div className="flex flex-col gap-4 pb-10 max-w-2xl w-full">
      {/* Header */}
      <div className="flex items-center gap-2">
        <h1 className="text-[20px] font-bold text-[#18181B]" style={{ letterSpacing: '-0.4px', fontFamily: 'DM Sans, sans-serif' }}>Peer Network</h1>
        <span className="text-[10px] font-bold text-[#7C6AF7] px-2 py-0.5 rounded-full" style={{ background: '#F0EEFF', border: '1px solid #DDD6FE' }}>Coming Soon</span>
      </div>

      {/* Hero banner */}
      <div className="rounded-[18px] p-[18px]" style={{ background: 'linear-gradient(135deg, #1A42C2 0%, #2F67F8 55%, #5C8AFF 100%)', boxShadow: '0px 10px 30px rgba(30,77,215,0.25)' }}>
        <p className="text-[10px] font-bold text-white/65 uppercase tracking-widest mb-0.5">Your Community</p>
        <p className="text-[19px] font-black text-white mb-1 leading-snug" style={{ fontFamily: 'DM Sans, sans-serif', letterSpacing: '-0.4px' }}>
          2,847 Nigerians on the {dest} Pathway
        </p>
        <p className="text-[11px] text-white/65 mb-3">412 active this week · 38 got their visa this year</p>
        <div className="flex gap-2">
          {[{ val: '412', label: 'Active peers' }, { val: '38', label: 'Visas granted' }, { val: '94%', label: 'Support rate' }].map(s => (
            <div key={s.label} className="flex-1 text-center rounded-[10px] py-2.5" style={{ background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.18)' }}>
              <p className="text-[16px] font-black text-white mb-0" style={{ fontFamily: 'DM Sans, sans-serif' }}>{s.val}</p>
              <p className="text-[9px] text-white/65 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested connections */}
      <h2 className="text-[14px] font-bold text-[#18181B] mb-0" style={{ fontFamily: 'DM Sans, sans-serif' }}>Suggested Connections</h2>
      <div className="flex flex-col gap-2.5">
        {PEER_PROFILES_DATA.map(peer => (
          <div key={peer.id} className="bg-white rounded-[16px] p-4" style={{ border: '1px solid #F0F2FF', boxShadow: '0px 2px 8px rgba(30,77,215,0.05)' }}>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-[42px] h-[42px] rounded-full flex items-center justify-center shrink-0 text-[14px] font-black text-white" style={{ background: peer.bg, fontFamily: 'DM Sans, sans-serif' }}>
                {peer.initials}
              </div>
              <div className="flex-1">
                <p className="text-[13px] font-bold text-[#18181B] mb-0">{peer.name}</p>
                <p className="text-[11px] text-[#82858A] flex items-center gap-1">
                  <Globe2 size={10} className="text-[#82858A]" />
                  {peer.city}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[16px] font-black text-[#1E4DD7] mb-0" style={{ fontFamily: 'DM Sans, sans-serif' }}>{peer.score}%</p>
                <p className="text-[9px] text-[#82858A]">Readiness</p>
              </div>
            </div>
            <div className="flex gap-1.5">
              <button className="flex-1 py-2 rounded-[9px] text-[12px] font-semibold text-white cursor-default" style={{ background: 'linear-gradient(135deg, #1E4DD7, #3B75FF)' }}>Connect</button>
              <button className="px-3 py-2 rounded-[9px] text-[12px] font-semibold text-[#4D4D56] cursor-default" style={{ background: '#F4F6FF', border: '1px solid #E0E4F5' }}>View</button>
            </div>
          </div>
        ))}
      </div>

      {/* Community discussions */}
      <div className="flex items-center justify-between">
        <h2 className="text-[14px] font-bold text-[#18181B] m-0" style={{ fontFamily: 'DM Sans, sans-serif' }}>Community Discussions</h2>
        <button className="px-3 py-1.5 rounded-lg text-[11px] font-semibold text-white cursor-default" style={{ background: 'linear-gradient(135deg, #1E4DD7, #3B75FF)' }}>+ Thread</button>
      </div>
      <div className="flex flex-col gap-2.5">
        {PEER_THREADS.map(thread => (
          <div key={thread.id} className="bg-white rounded-[16px] px-4 py-3.5" style={{ border: '1px solid #F0F2FF', boxShadow: '0px 2px 8px rgba(30,77,215,0.05)' }}>
            <div className="flex items-start gap-2.5">
              <div className="w-[34px] h-[34px] rounded-full flex items-center justify-center shrink-0 text-[12px] font-black text-white" style={{ background: thread.bg, fontFamily: 'DM Sans, sans-serif' }}>
                {thread.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                  <span className="text-[12px] font-bold text-[#18181B]">{thread.name}</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-[5px]" style={{ background: thread.tagBg, color: thread.tagColor }}>{thread.tag}</span>
                  <span className="text-[10px] text-[#B0B4C4] ml-auto">{thread.timeAgo}</span>
                </div>
                <p className="text-[13px] font-bold text-[#18181B] leading-snug mb-1">{thread.title}</p>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-[#82858A]">{thread.replies} replies</span>
                  <span className="text-[11px] text-[#82858A]">{thread.likes} helpful</span>
                  <button className="ml-auto px-3 py-1.5 rounded-lg text-[11px] font-semibold text-[#3B75FF] cursor-default" style={{ background: '#F4F6FF', border: '1px solid #E0E4F5' }}>Read</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Coming Soon notice */}
      <div className="text-center py-4 px-4 rounded-[14px]" style={{ background: 'rgba(124,106,247,0.06)', border: '1px solid #DDD6FE' }}>
        <p className="text-[12px] font-bold text-[#7C6AF7] mb-0.5">Full Peer Network — Coming Soon</p>
        <p className="text-[11px] text-[#82858A]">Real profiles, DMs, and community threads for your exact migration route.</p>
      </div>
    </div>
  )
}

// ── MARKETPLACE TAB ────────────────────────────────────────────────────────────
const CONSULTANTS_DATA = [
  { id: 'mc1', name: 'Solicitor James Okafor', initials: 'JO', title: 'Immigration Barrister', org: "OISC Level 3 · Lincoln's Inn Chambers", rating: 4.9, reviews: 142, priceFrom: '₦120,000', tags: ['Skilled Worker', 'Family Visa', 'Appeals'], specialties: ['UK Skilled Worker', 'Visa Appeals', 'Judicial Review'], verified: true, bg: 'linear-gradient(135deg, #1E4DD7, #3B75FF)', successRate: '97%', casesHandled: 340, available: true, featured: true, badge: 'Top Rated', badgeColor: '#D97706', badgeBg: '#FFF7E6' },
  { id: 'mc2', name: 'Amaka Consulting Ltd', initials: 'AC', title: 'Senior Immigration Advisor', org: 'OISC Registered · 12 yrs experience', rating: 4.7, reviews: 98, priceFrom: '₦70,000', tags: ['Student Visa', 'Skilled Worker', 'NHS'], specialties: ['NHS Recruitment', 'Student Visa', 'Skilled Worker Visa'], verified: true, bg: 'linear-gradient(135deg, #059669, #10B981)', successRate: '94%', casesHandled: 210, available: true, featured: false, badge: 'NHS Specialist', badgeColor: '#059669', badgeBg: '#E8F9EE' },
  { id: 'mc3', name: 'UK Path Advisors', initials: 'UP', title: 'Principal Immigration Consultant', org: 'FCA Authorised · ILPA Member', rating: 4.8, reviews: 203, priceFrom: '₦90,000', tags: ['Entrepreneur Visa', 'Spouse Visa', 'EU Settlement'], specialties: ['Innovator Founder Visa', 'Spouse & Partner Visas'], verified: true, bg: 'linear-gradient(135deg, #7C3AED, #A855F7)', successRate: '96%', casesHandled: 415, available: false, featured: false, badge: 'ILPA Member', badgeColor: '#7C3AED', badgeBg: '#F0EEFF' },
  { id: 'mc4', name: 'Chioma Eze-Williams', initials: 'CE', title: 'Healthcare Immigration Specialist', org: 'OISC Level 2 · Registered Nurse (UK)', rating: 4.9, reviews: 67, priceFrom: '₦65,000', tags: ['Skilled Worker', 'NHS', 'Care Sector'], specialties: ['NMC Registration', 'Tier 2 Health & Care', 'UK Nurse Pathway'], verified: true, bg: 'linear-gradient(135deg, #EC4899, #F43F5E)', successRate: '99%', casesHandled: 89, available: true, featured: false, badge: 'Healthcare Pro', badgeColor: '#EC4899', badgeBg: '#FFF0F6' },
]
const MARKETPLACE_CATEGORIES = [
  { id: 'all', label: 'All' }, { id: 'skilled', label: 'Skilled Worker' }, { id: 'healthcare', label: 'Healthcare' }, { id: 'family', label: 'Family Visa' }, { id: 'student', label: 'Student Visa' },
]
const TRUST_STATS = [{ val: '100%', label: 'OISC Verified' }, { val: '96%', label: 'Avg. Success' }, { val: '1,200+', label: 'Visas Secured' }, { val: '< 3 hrs', label: 'Avg. Response' }]

function StarRating({ rating }) {
  return (
    <span className="inline-flex gap-px items-center">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={i <= Math.floor(rating) ? '#F59A0A' : '#E5E7EB'} stroke="none">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </span>
  )
}

function MarketplaceTab({ answers }) {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const dest = answers.destination || 'your destination'
  const visaRoute = getVisaRoute(dest, answers.segment || '')

  const filtered = CONSULTANTS_DATA.filter(c => {
    const matchSearch = searchQuery === '' || c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchCat = activeCategory === 'all'
      || (activeCategory === 'skilled' && c.tags.some(t => t.toLowerCase().includes('skilled')))
      || (activeCategory === 'healthcare' && c.tags.some(t => t.toLowerCase().includes('nhs') || t.toLowerCase().includes('health') || t.toLowerCase().includes('care')))
      || (activeCategory === 'family' && c.tags.some(t => t.toLowerCase().includes('family') || t.toLowerCase().includes('spouse')))
      || (activeCategory === 'student' && c.tags.some(t => t.toLowerCase().includes('student')))
    return matchSearch && matchCat
  })

  return (
    <div className="flex flex-col gap-4 pb-10 max-w-2xl w-full">
      {/* Header */}
      <div className="flex items-center gap-2">
        <h1 className="text-[20px] font-bold text-[#18181B]" style={{ letterSpacing: '-0.4px', fontFamily: 'DM Sans, sans-serif' }}>Marketplace</h1>
        <span className="text-[10px] font-bold text-[#7C6AF7] px-2 py-0.5 rounded-full" style={{ background: '#F0EEFF', border: '1px solid #DDD6FE' }}>Coming Soon</span>
      </div>

      {/* Hero banner — profile-tailored */}
      <div className="rounded-[20px] p-[18px]" style={{ background: 'linear-gradient(135deg, #0F2E99 0%, #1E4DD7 55%, #3B75FF 100%)', boxShadow: '0px 12px 40px rgba(30,77,215,0.3)' }}>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold text-white uppercase tracking-widest mb-2" style={{ background: 'rgba(255,255,255,0.18)' }}>
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.75}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
          OISC-Verified Only
        </span>
        <p className="text-[17px] font-black text-white leading-snug mb-1" style={{ fontFamily: 'DM Sans, sans-serif', letterSpacing: '-0.4px' }}>
          Find a trusted consultant for your {dest} journey
        </p>
        <p className="text-[12px] text-white/70 leading-relaxed mb-3">
          {visaRoute} specialists · Licence-checked, rated, and scam-protected.
        </p>
        <div className="grid grid-cols-2 gap-1.5">
          {TRUST_STATS.map(s => (
            <div key={s.val} className="px-2.5 py-2 rounded-[10px] text-center" style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)' }}>
              <p className="text-[14px] font-black text-white mb-0" style={{ fontFamily: 'DM Sans, sans-serif' }}>{s.val}</p>
              <p className="text-[9px] text-white/60 font-semibold uppercase tracking-wide">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Search bar */}
      <div className="flex items-center gap-2 rounded-xl px-3.5 py-2.5" style={{ background: '#FFFFFF', border: '1.5px solid #E4E8FF', boxShadow: '0px 2px 8px rgba(30,77,215,0.05)' }}>
        <Search size={15} className="text-[#ADADBE] shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search by name, visa type, or specialty..."
          className="flex-1 border-none bg-transparent outline-none text-[13px] text-[#18181B] placeholder-[#B0B4C4]"
        />
      </div>

      {/* Category filters */}
      <div className="flex gap-2 flex-wrap">
        {MARKETPLACE_CATEGORIES.map(cat => (
          <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
            className="px-3.5 py-1.5 rounded-full text-[12px] font-bold transition-all"
            style={activeCategory === cat.id
              ? { background: 'linear-gradient(135deg, #1E4DD7, #3B75FF)', color: '#fff', border: 'none' }
              : { background: '#FFFFFF', color: '#6B7280', border: '1.5px solid #E4E8FF' }}>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Consultant cards */}
      <div className="flex flex-col gap-3">
        {filtered.map(c => (
          <div key={c.id} className="bg-white rounded-[18px] p-4" style={{ border: c.featured ? '1.5px solid #B3C5FF' : '1px solid #F0F2FF', boxShadow: c.featured ? '0px 6px 24px rgba(30,77,215,0.12)' : '0px 2px 10px rgba(30,77,215,0.05)' }}>
            <div className="flex items-start gap-3 mb-3">
              <div className="w-[46px] h-[46px] rounded-[13px] flex items-center justify-center shrink-0 text-[15px] font-black text-white" style={{ background: c.bg, fontFamily: 'DM Sans, sans-serif' }}>
                {c.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                      <p className="text-[14px] font-bold text-[#18181B] m-0">{c.name}</p>
                      {c.verified && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#1E4DD7" stroke="none"><path d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                      )}
                    </div>
                    <p className="text-[11px] text-[#82858A] m-0">{c.title}</p>
                    <p className="text-[10px] text-[#B0B4C4] m-0">{c.org}</p>
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-[5px] shrink-0" style={{ background: c.badgeBg, color: c.badgeColor }}>{c.badge}</span>
                </div>
              </div>
            </div>

            {/* Rating + stats */}
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <div className="flex items-center gap-1">
                <StarRating rating={c.rating} />
                <span className="text-[11px] font-bold text-[#18181B]">{c.rating}</span>
                <span className="text-[11px] text-[#82858A]">({c.reviews})</span>
              </div>
              <span className="text-[11px] font-semibold text-[#21C474]">{c.successRate} success</span>
              <span className="text-[11px] text-[#82858A]">{c.casesHandled} cases</span>
              {c.available
                ? <span className="text-[9px] font-bold text-[#21C474] px-1.5 py-0.5 rounded-full ml-auto" style={{ background: '#E8F9EE' }}>Available now</span>
                : <span className="text-[9px] font-bold text-[#F59A0A] px-1.5 py-0.5 rounded-full ml-auto" style={{ background: '#FFF7E6' }}>Fully booked</span>}
            </div>

            {/* Tags */}
            <div className="flex gap-1.5 flex-wrap mb-3">
              {c.tags.map(tag => (
                <span key={tag} className="text-[10px] font-semibold px-2 py-0.5 rounded-full text-[#4D4D56]" style={{ background: '#F4F6FF', border: '1px solid #E4E8FF' }}>{tag}</span>
              ))}
            </div>

            {/* Price + CTA */}
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] text-[#82858A] m-0">Starting from</p>
                <p className="text-[16px] font-black text-[#18181B] m-0" style={{ fontFamily: 'DM Sans, sans-serif' }}>{c.priceFrom}</p>
              </div>
              <button className="px-4 py-2.5 rounded-[10px] text-[13px] font-bold text-white cursor-default flex items-center gap-1.5" style={{ background: c.available ? 'linear-gradient(135deg, #1E4DD7, #3B75FF)' : '#D1D5DB', cursor: 'default' }}>
                {c.available ? 'Book Session' : 'Fully Booked'}
                {c.available && <ArrowRight size={12} className="text-white" />}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Coming Soon notice */}
      <div className="text-center py-4 px-4 rounded-[14px]" style={{ background: 'rgba(124,106,247,0.06)', border: '1px solid #DDD6FE' }}>
        <p className="text-[12px] font-bold text-[#7C6AF7] mb-0.5">Live Booking — Coming Soon</p>
        <p className="text-[11px] text-[#82858A]">Real bookings, payments, and one-on-one consultant sessions will be live soon.</p>
      </div>
    </div>
  )
}

// ── DOCUMENTS TAB ─────────────────────────────────────────────────────────────
const DOCUMENT_LIST = [
  { id: 'd1', name: 'International Passport', category: 'Identity', status: 'uploaded' },
  { id: 'd2', name: 'National ID Card', category: 'Identity', status: 'uploaded' },
  { id: 'd3', name: 'Degree Certificate', category: 'Qualifications', status: 'missing' },
  { id: 'd4', name: 'NYSC Discharge Certificate', category: 'Qualifications', status: 'missing' },
  { id: 'd5', name: 'Language Test Result', category: 'Language', status: 'processing' },
  { id: 'd6', name: 'Employment Reference Letter', category: 'Employment', status: 'missing' },
  { id: 'd7', name: 'Bank Statements (3 months)', category: 'Finance', status: 'missing' },
  { id: 'd8', name: 'Police Clearance Certificate', category: 'Legal', status: 'missing' },
]

function DocumentsTab() {
  const [docFilter, setDocFilter] = useState('All')
  const uploaded = DOCUMENT_LIST.filter(d => d.status === 'uploaded').length
  const processing = DOCUMENT_LIST.filter(d => d.status === 'processing').length
  const missing = DOCUMENT_LIST.filter(d => d.status === 'missing').length
  const pct = Math.round((uploaded / DOCUMENT_LIST.length) * 100)
  const displayed = docFilter === 'All' ? DOCUMENT_LIST : DOCUMENT_LIST.filter(d => d.status === docFilter.toLowerCase())

  return (
    <div className="flex flex-col gap-4 pb-10 max-w-2xl w-full">
      {/* Header */}
      <div className="flex items-center gap-2">
        <h1 className="text-[20px] font-bold text-[#18181B]" style={{ letterSpacing: '-0.4px', fontFamily: 'DM Sans, sans-serif' }}>Document Vault</h1>
        <span className="text-[10px] font-bold text-[#7C6AF7] px-2 py-0.5 rounded-full" style={{ background: '#F0EEFF', border: '1px solid #DDD6FE' }}>Coming Soon</span>
      </div>

      {/* Hero banner */}
      <div className="rounded-[18px] p-[18px]" style={{ background: 'linear-gradient(135deg, #1A42C2 0%, #2F67F8 55%, #5C8AFF 100%)', boxShadow: '0px 10px 30px rgba(30,77,215,0.25)' }}>
        <p className="text-[10px] font-bold text-white/65 uppercase tracking-widest mb-0.5">Document Readiness</p>
        <p className="text-[36px] font-black text-white mb-2" style={{ fontFamily: 'DM Sans, sans-serif', letterSpacing: '-2px', lineHeight: 1 }}>{pct}%</p>
        <div className="h-[6px] rounded-full overflow-hidden mb-1.5" style={{ background: 'rgba(255,255,255,0.2)' }}>
          <div className="h-full rounded-full" style={{ width: `${Math.max(pct, 4)}%`, background: 'linear-gradient(90deg, rgba(255,255,255,0.8), #FFFFFF)' }} />
        </div>
        <p className="text-[11px] text-white/60 mb-3">{uploaded} of {DOCUMENT_LIST.length} required documents uploaded</p>
        <div className="flex gap-2">
          {[{ val: String(uploaded), label: 'Uploaded', color: '#4ADE80' }, { val: String(missing), label: 'Missing', color: '#F87171' }, { val: String(processing), label: 'Processing', color: '#FCD34D' }].map(s => (
            <div key={s.label} className="flex-1 text-center rounded-[10px] py-2.5" style={{ background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.18)' }}>
              <p className="text-[18px] font-black mb-0" style={{ color: s.color, fontFamily: 'DM Sans, sans-serif' }}>{s.val}</p>
              <p className="text-[10px] text-white/65 font-medium m-0">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Drop zone */}
      <div className="text-center rounded-[16px] py-6 px-4 cursor-default" style={{ background: 'linear-gradient(135deg, #F4F7FF, #EBF1FF)', border: '2px dashed #B3C5FF' }}>
        <div className="w-12 h-12 rounded-[14px] flex items-center justify-center mx-auto mb-3" style={{ background: 'linear-gradient(135deg, #EBF1FF, #D8E6FF)', boxShadow: '0px 4px 12px rgba(30,77,215,0.12)' }}>
          <Upload size={22} style={{ color: '#1E4DD7' }} />
        </div>
        <p className="text-[14px] font-bold text-[#18181B] mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>Drop your documents here</p>
        <p className="text-[12px] text-[#82858A] mb-3.5">PDF, JPG, PNG — up to 10MB per file</p>
        <button disabled className="flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-[13px] font-semibold cursor-not-allowed mx-auto" style={{ background: 'linear-gradient(135deg, #1E4DD7, #3B75FF)', color: '#FFFFFF', opacity: 0.5 }}>
          <Upload size={13} className="text-white" />
          Browse Files
        </button>
      </div>

      {/* Document list */}
      <div className="bg-white rounded-[18px] p-4" style={{ boxShadow: '0px 2px 10px rgba(30,77,215,0.05)', border: '1px solid #F0F2FF' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[14px] font-bold text-[#18181B] m-0" style={{ fontFamily: 'DM Sans, sans-serif' }}>Required Documents</h2>
          <div className="flex gap-1">
            {['All', 'Missing', 'Uploaded'].map(f => (
              <button key={f} onClick={() => setDocFilter(f)}
                className="px-2.5 py-1 rounded-lg text-[11px] transition-all"
                style={{ background: docFilter === f ? '#EBF1FF' : '#F4F6FF', border: `1px solid ${docFilter === f ? '#B3C5FF' : '#E4E8FF'}`, fontWeight: docFilter === f ? 700 : 500, color: docFilter === f ? '#1E4DD7' : '#82858A' }}>
                {f}
              </button>
            ))}
          </div>
        </div>
        <ul className="m-0 p-0 list-none flex flex-col">
          {displayed.map((doc, idx) => (
            <li key={doc.id} className="flex items-center gap-3 py-3" style={{ borderBottom: idx < displayed.length - 1 ? '1px solid #F4F6FF' : 'none' }}>
              <div className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center shrink-0"
                style={{ background: doc.status === 'uploaded' ? '#E8F9EE' : doc.status === 'processing' ? '#FFF7E6' : '#FDECEC', border: `1.5px solid ${doc.status === 'uploaded' ? '#A7F3C5' : doc.status === 'processing' ? '#FDE68A' : '#FBBCC8'}` }}>
                {doc.status === 'uploaded'   && <CheckCircle2 size={18} className="text-[#21C474]" />}
                {doc.status === 'processing' && <AlertTriangle size={18} className="text-[#F59A0A]" />}
                {doc.status === 'missing'    && <XCircle size={18} className="text-[#EF4369]" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-[#18181B] m-0 truncate">{doc.name}</p>
                <span className="text-[10px] font-semibold text-[#6B7280] px-1.5 py-0.5 rounded-[5px]" style={{ background: '#F4F6FF' }}>{doc.category}</span>
              </div>
              <div className="shrink-0">
                {doc.status === 'missing'
                  ? <button disabled className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-white cursor-not-allowed opacity-60" style={{ background: 'linear-gradient(135deg, #1E4DD7, #3B75FF)' }}>
                      <Upload size={11} className="text-white" /> Upload
                    </button>
                  : <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: doc.status === 'uploaded' ? '#E8F9EE' : '#FFF7E6', color: doc.status === 'uploaded' ? '#21C474' : '#F59A0A' }}>
                      {doc.status === 'uploaded' ? 'Done' : 'Processing'}
                    </span>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// ── PROFILE TAB ──────────────────────────────────────────────────────────────
function DarkToggle({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      aria-pressed={value}
      aria-label="Toggle dark mode"
      className="shrink-0 focus:outline-none"
      style={{ width: 44, height: 26, borderRadius: 13, background: value ? '#1E4DD7' : '#E5E7EB', border: 'none', cursor: 'pointer', padding: 2, display: 'flex', alignItems: 'center', justifyContent: value ? 'flex-end' : 'flex-start', transition: 'background 0.2s ease' }}
    >
      <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#FFFFFF', boxShadow: '0 1px 4px rgba(0,0,0,0.18)' }} />
    </button>
  )
}

// ── Score categories from quiz data ──────────────────────────────────────────
function buildScoreCategories(answers, score) {
  const areaStatus = (pct) => pct >= 70 ? 'ok' : pct >= 40 ? 'warn' : 'bad'
  const areaColor  = (pct) => pct >= 70 ? '#21C474' : pct >= 40 ? '#F59A0A' : '#EF4369'
  const labelMap   = { Experience: 'Work Experience', Language: 'Language Test', Savings: 'Financial Readiness', Profile: 'Skills & Certs', Education: 'Education', Age: 'Age Factor' }

  const cats = calculateScoreBreakdown(answers).map(item => {
    const pct = Math.round((item.score / item.max) * 100)
    return { id: item.label.toLowerCase(), label: labelMap[item.label] || item.label, pct, rawScore: item.score, max: item.max, status: areaStatus(pct), color: areaColor(pct) }
  })
  cats.push({ id: 'overall', label: 'Overall Readiness', pct: score, rawScore: score, max: 100, status: areaStatus(score), color: areaColor(score) })
  return cats
}

function ProfileTab({ user, profile, answers, score, quizResult, onSignOut, router }) {
  const fullName   = profile?.full_name || user?.user_metadata?.full_name || ''
  const email      = user?.email || ''
  const [name, setName]           = useState(fullName)
  const [editing, setEditing]     = useState(false)
  const [saving, setSaving]       = useState(false)
  const [saved, setSaved]         = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || null)
  const [uploading, setUploading] = useState(false)
  const [darkMode, setDarkMode]   = useState(false)
  const [copied, setCopied]       = useState(false)

  useEffect(() => { setDarkMode(document.documentElement.classList.contains('dark')) }, [])

  const [baseUrl, setBaseUrl] = useState('http://localhost:3000')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(window.location.origin)
    }
  }, [])

  const referralCode = profile?.referral_code || ''
  const profileUrl = referralCode
    ? `${baseUrl}/u/${referralCode}`
    : `${baseUrl}/u/${user?.id}`

  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  const initials    = (name || email).charAt(0).toUpperCase()
  const dest        = answers.destination || '—'
  const visaRoute   = getVisaRoute(dest, answers.segment || '')
  const flag        = COUNTRY_FLAGS[dest] || '🌍'
  const scoreCategories = score ? buildScoreCategories(answers, score) : null
  const timelineDisplay = answers.timeline
    ? answers.timeline.split(' — ')[0]  // e.g. "0–3 months"
    : score ? (score >= 70 ? '16 weeks' : score >= 40 ? '20 weeks' : '24 weeks') : '—'

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

  const toggleDarkMode = () => {
    const next = !darkMode
    setDarkMode(next)
    if (next) { document.documentElement.classList.add('dark'); localStorage.setItem('darkMode', 'true') }
    else      { document.documentElement.classList.remove('dark'); localStorage.setItem('darkMode', 'false') }
  }

  const deleteAccount = async () => { await supabase.auth.signOut(); router.push('/') }

  const isMobile = useIsMobile()

  return (
    <div className="flex flex-col gap-4 pb-16" style={{ maxWidth: 820 }}>

      {/* ── Blue hero header card ─────────────────────────────────────────── */}
      <div className="rounded-[22px] overflow-hidden" style={{ background: 'linear-gradient(135deg, #1A42C2 0%, #2F67F8 55%, #5C8AFF 100%)', boxShadow: '0px 12px 40px rgba(30,77,215,0.28)' }}>
        {/* Top section: avatar + name + buttons */}
        <div style={{ display: 'flex', alignItems: isMobile ? 'center' : 'flex-end', gap: isMobile ? 14 : 20, padding: isMobile ? '20px 20px 18px' : '32px 32px 28px', flexWrap: isMobile ? 'nowrap' : 'wrap' }}>
          {/* Avatar */}
          <div style={{ position: 'relative', width: isMobile ? 64 : 80, height: isMobile ? 64 : 80, flexShrink: 0 }}>
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" style={{ width: isMobile ? 64 : 80, height: isMobile ? 64 : 80, borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.3)' }} />
            ) : (
              <div style={{ width: isMobile ? 64 : 80, height: isMobile ? 64 : 80, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.2)', border: '3px solid rgba(255,255,255,0.3)' }}>
                <span style={{ fontSize: isMobile ? 24 : 28, fontWeight: 800, color: '#FFFFFF', fontFamily: 'DM Sans, sans-serif' }}>{initials}</span>
              </div>
            )}
            <label style={{ position: 'absolute', bottom: 1, right: 1, width: isMobile ? 20 : 24, height: isMobile ? 20 : 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: '#FFFFFF', border: '2px solid rgba(30,77,215,0.3)' }}>
              {uploading
                ? <span className="w-3 h-3 border-2 border-[#1E4DD7]/30 border-t-[#1E4DD7] rounded-full animate-spin" />
                : <Camera size={isMobile ? 10 : 12} style={{ color: '#1E4DD7' }} />}
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploading} />
            </label>
          </div>

          {/* Name + email + route */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 3 }}>
              <h1 style={{ margin: 0, fontSize: isMobile ? 20 : 24, fontWeight: 800, color: '#FFFFFF', fontFamily: 'DM Sans, sans-serif', letterSpacing: '-0.4px' }}>{fullName || 'Your Name'}</h1>
              {!isMobile && <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, color: '#FFFFFF', background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)' }}>Free Plan</span>}
            </div>
            <p style={{ margin: '0 0 2px', fontSize: isMobile ? 12 : 14, color: 'rgba(255,255,255,0.75)' }}>{email}</p>
            <p style={{ margin: 0, fontSize: isMobile ? 11 : 13, color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Globe2 size={isMobile ? 10 : 12} style={{ color: 'rgba(255,255,255,0.6)' }} />
              {quizResult ? `Nigeria → ${dest} ${flag} · ${visaRoute}` : 'Take the quiz to build your migration profile'}
            </p>
          </div>

          {/* Retake Quiz is the only way to update your profile */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end', flexShrink: 0 }}>
            <button onClick={() => router.push('/quiz')} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: isMobile ? '8px 12px' : '10px 16px', background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 10, color: '#FFFFFF', fontSize: isMobile ? 12 : 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
              {quizResult
                ? <svg width={isMobile ? 10 : 12} height={isMobile ? 10 : 12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-3.51" /></svg>
                : <Sparkles size={isMobile ? 10 : 12} style={{ color: '#FFFFFF' }} />}
              {quizResult ? 'Retake Quiz' : 'Take Quiz'}
            </button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex" style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}>
          {[
            { val: quizResult ? `${score}%` : '0', label: 'Readiness' },
            { val: '—',                            label: 'Day Streak' },
            { val: '—',                            label: 'Active Modules' },
            { val: '—',                            label: 'Docs Ready' },
          ].map((s, si) => (
            <div key={s.label} className="flex-1 text-center py-4" style={{ borderRight: si < 3 ? '1px solid rgba(255,255,255,0.12)' : 'none' }}>
              <p className="text-[20px] font-black text-white m-0" style={{ fontFamily: 'DM Sans, sans-serif' }}>{s.val}</p>
              <p className="text-[11px] text-white/60 m-0">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Two-column body ───────────────────────────────────────────────── */}
      <div className="grid sm:grid-cols-2 gap-4">

        {/* Score Breakdown */}
        <div className="bg-white rounded-[18px] p-5" style={{ border: '1px solid #F0F2FF', boxShadow: '0px 2px 12px rgba(30,77,215,0.05)' }}>
          <h2 className="text-[15px] font-bold text-[#18181B] mb-4" style={{ fontFamily: 'DM Sans, sans-serif' }}>Score Breakdown</h2>
          {quizResult && scoreCategories?.length > 0 ? (
            <div className="flex flex-col gap-3">
              {scoreCategories.map(cat => (
                <div key={cat.id}>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-1.5">
                      {cat.status === 'ok'   && <CheckCircle2 size={12} style={{ color: '#21C474' }} />}
                      {cat.status === 'warn' && <AlertTriangle size={12} style={{ color: '#F59A0A' }} />}
                      {cat.status === 'bad'  && <XCircle size={12} style={{ color: '#EF4369' }} />}
                      <span className="text-[12px] font-medium text-[#2D2D35]">{cat.label}</span>
                    </div>
                    <span className="text-[12px] font-bold" style={{ color: cat.color }}>{cat.rawScore} / {cat.max}</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#F0F2FF' }}>
                    <div className="h-full rounded-full" style={{ width: `${cat.pct}%`, background: `linear-gradient(90deg, ${cat.color}bb, ${cat.color})` }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <TrendingUp size={24} style={{ color: '#D4DCFF', marginBottom: 10 }} />
              <p className="text-[13px] text-[#82858A] mb-3 leading-relaxed">Your score breakdown shows where you're strong and where to focus. It unlocks after your quiz.</p>
              <button onClick={() => router.push('/quiz')} className="text-[12px] font-bold px-4 py-2 rounded-[8px] text-white" style={{ background: '#1E4DD7' }}>Start with Quiz</button>
            </div>
          )}
        </div>

        {/* Right column: Migration Profile + Share */}
        <div className="flex flex-col gap-3">
          {/* Migration Profile */}
          <div className="bg-white rounded-[18px] p-5" style={{ border: '1px solid #F0F2FF', boxShadow: '0px 2px 12px rgba(30,77,215,0.05)' }}>
            <h2 className="text-[15px] font-bold text-[#18181B] mb-4" style={{ fontFamily: 'DM Sans, sans-serif' }}>Migration Profile</h2>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Visa Type',           value: answers.destination ? visaRoute : '—' },
                { label: 'Target Destination',   value: `${flag} ${dest}` },
                { label: 'Profession',           value: answers.segment || '—' },
                { label: 'Language Test',        value: answers.language || 'Not taken' },
                { label: 'Savings Level',        value: answers.savings || '—' },
                { label: 'Est. Timeline',        value: timelineDisplay },
              ].map(field => (
                <div key={field.label} className="flex justify-between items-center pb-3" style={{ borderBottom: '1px solid #F4F6FF' }}>
                  <span className="text-[12px] text-[#82858A] font-medium">{field.label}</span>
                  <span className="text-[13px] text-[#18181B] font-semibold text-right max-w-[55%] truncate">{field.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Share Profile card */}
          <div className="rounded-[16px] p-4" style={{ background: 'linear-gradient(135deg, #EBF1FF 0%, #F2EEFF 100%)', border: '1px solid #D4DCFF' }}>
            <p className="text-[13px] font-bold text-[#1E4DD7] mb-0.5">Share Your Profile 🔗</p>
            <p className="text-[11px] text-[#6B7280] mb-1.5 leading-relaxed truncate">{profileUrl}</p>
            <p className="text-[12px] text-[#4D4D56] leading-relaxed mb-3">Your profile shows your readiness score, pathway &amp; progress. Share it with anyone.</p>
            <button
              onClick={handleCopyLink}
              className="w-full py-2.5 rounded-[10px] text-white text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-all"
              style={{ background: copied ? 'linear-gradient(135deg, #10B981, #059669)' : 'linear-gradient(135deg, #1E4DD7, #3B75FF)', boxShadow: '0px 4px 14px rgba(30,77,215,0.28)' }}
            >
              {copied ? (
                <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg> Link Copied!</>
              ) : (
                <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg> Share Your Profile</>
              )}
            </button>

          </div>
        </div>
      </div>

      {/* ── Account & Settings ────────────────────────────────────────────── */}
      <div className="bg-white rounded-[18px] p-5" style={{ border: '1px solid #F0F2FF', boxShadow: '0px 2px 12px rgba(30,77,215,0.05)' }}>
        <h2 className="text-[15px] font-bold text-[#18181B] mb-4" style={{ fontFamily: 'DM Sans, sans-serif' }}>Account &amp; Settings</h2>
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          {['Notification Preferences', 'Privacy Settings'].map((s, si) => (
            <button key={s} className="px-4 py-3 rounded-xl text-[13px] font-medium text-[#4D4D56] text-left" style={{ background: '#FAFBFF', border: '1px solid #F0F2FF' }}>{s}</button>
          ))}
        </div>
        {/* Dark mode */}
        <div className="flex items-center justify-between px-4 py-3 rounded-xl mb-2.5" style={{ background: '#FAFBFF', border: '1px solid #F0F2FF' }}>
          <div>
            <p className="text-[13px] font-bold text-[#18181B] m-0">Dark Mode</p>
            <p className="text-[11px] text-[#6B7280] m-0">{darkMode ? 'Dark mode active' : 'Switch to darker theme'}</p>
          </div>
          <DarkToggle value={darkMode} onChange={toggleDarkMode} />
        </div>
        {/* Sign out */}
        <button onClick={onSignOut} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-medium text-[#4D4D56] hover:bg-[#F7F9FF] transition-colors mb-2" style={{ border: '1px solid #F0F2FF', background: '#FAFBFF' }}>
          <LogOut size={15} className="text-[#5F5F6B] shrink-0" /> Sign out
        </button>
        {/* Delete account */}
        {!deleteConfirm ? (
          <button onClick={() => setDeleteConfirm(true)} className="w-full px-4 py-3 rounded-xl text-[13px] font-medium text-[#EF4369] text-left" style={{ background: '#FFF5F7', border: '1px solid #FDD' }}>
            Delete Account
          </button>
        ) : (
          <div className="rounded-xl p-4" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)' }}>
            <p className="text-[13px] font-bold text-rose-700 mb-1">Delete your account?</p>
            <p className="text-[12px] text-rose-500 mb-3 leading-relaxed">This will sign you out immediately. To fully delete your data, email <span className="font-semibold">hello@japalearn.ai</span>.</p>
            <div className="flex gap-2">
              <button onClick={deleteAccount} className="text-[12px] font-bold text-white px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 transition-colors">Yes, sign me out</button>
              <button onClick={() => setDeleteConfirm(false)} className="text-[12px] font-semibold text-[#5F5F6B] px-4 py-2 rounded-xl bg-white hover:bg-[#F7F9FF] transition-colors" style={{ border: '1px solid #E0E8FF' }}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── CREDIT SCORE TAB ────────────────────────────────────────────────────────────
function CreditScoreTab({ score, quizResult, answers }) {
  const isMobile = useIsMobile()

  const SCORE_FACTORS = [
    { label: 'Migration Readiness',  value: quizResult ? `${score}%` : '—', color: '#1E4DD7', done: !!quizResult },
    { label: 'Language Preparation', value: answers?.language && answers.language !== 'Not taken' ? 'In progress' : 'Not started', color: '#F59A0A', done: !!(answers?.language && answers.language !== 'Not taken') },
    { label: 'Document Status',      value: '—', color: '#82858A', done: false },
    { label: 'Financial Proof',      value: '—', color: '#82858A', done: false },
    { label: 'Visa Application',     value: '—', color: '#82858A', done: false },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 16 : 20, paddingBottom: 40 }}>
      {/* Header */}
      <div>
        <p style={{ margin: '0 0 3px', fontSize: isMobile ? 11 : 13, color: '#82858A', fontWeight: 500 }}>Your migration readiness at a glance</p>
        <h1 style={{ margin: 0, fontSize: isMobile ? 22 : 26, fontWeight: 700, color: '#18181B', letterSpacing: '-0.5px', fontFamily: 'DM Sans, sans-serif' }}>Migration Score</h1>
      </div>

      {/* Score card */}
      <div style={{ background: 'linear-gradient(135deg, #1A42C2 0%, #2F67F8 60%, #5C8AFF 100%)', borderRadius: isMobile ? 18 : 22, padding: isMobile ? '24px 20px' : '32px 32px', boxShadow: '0px 12px 40px rgba(30,77,215,0.28)', textAlign: 'center' }}>
        <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Overall Migration Score</p>
        <div style={{ fontSize: isMobile ? 72 : 88, fontWeight: 900, color: '#FFFFFF', fontFamily: 'DM Sans, sans-serif', lineHeight: 1, marginBottom: 8 }}>
          {quizResult ? score : '—'}
        </div>
        <p style={{ margin: '0 0 20px', fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
          {quizResult
            ? score >= 70 ? 'Strong profile — keep going'
              : score >= 45 ? 'Good start — a few gaps to close'
              : 'Early stage — let\'s build your profile'
            : 'Take the quiz to get your score'}
        </p>
        {quizResult && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.15)', borderRadius: 20, padding: '6px 14px', border: '1px solid rgba(255,255,255,0.25)' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ADE80' }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: '#FFFFFF' }}>Score updates as you progress</span>
          </div>
        )}
      </div>

      {/* Coming soon banner */}
      <div style={{ background: 'rgba(245,158,11,0.08)', borderRadius: isMobile ? 14 : 16, padding: isMobile ? '14px 16px' : '16px 20px', border: '1px solid rgba(245,158,11,0.25)', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(245,158,11,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Star size={14} color="#F59A0A" />
        </div>
        <div>
          <p style={{ margin: '0 0 2px', fontSize: 13, fontWeight: 700, color: '#92400E' }}>Full Credit Engine — Coming Soon</p>
          <p style={{ margin: 0, fontSize: 12, color: '#B45309', lineHeight: 1.55 }}>We&apos;re building a detailed credit scoring system that tracks each factor below — finances, documents, language, and visa readiness — to give you a live migration credit score.</p>
        </div>
      </div>

      {/* Score factors */}
      <div style={{ background: '#FFFFFF', borderRadius: isMobile ? 16 : 20, padding: isMobile ? 16 : 24, boxShadow: '0px 2px 12px rgba(30,77,215,0.06)', border: '1px solid #F0F2FF' }}>
        <p style={{ margin: '0 0 16px', fontSize: 13, fontWeight: 700, color: '#18181B', fontFamily: 'DM Sans, sans-serif' }}>Score Breakdown</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {SCORE_FACTORS.map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 10, background: '#FAFBFF', border: '1px solid #ECEEFF' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: f.done ? '#21C474' : '#D1D5DB', flexShrink: 0 }} />
              <span style={{ flex: 1, fontSize: 13, color: '#2D2D35', fontWeight: 500 }}>{f.label}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: f.done ? f.color : '#82858A', background: f.done ? `${f.color}15` : '#F4F4F6', padding: '3px 8px', borderRadius: 6 }}>{f.value}</span>
            </div>
          ))}
        </div>
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
  const [curriculum, setCurriculum] = useState(null)
  const [recentProgress, setRecentProgress] = useState([])

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
      // Always clear these keys immediately — prevents stale quiz data from
      // bleeding into a different Google account that logs in on the same browser
      localStorage.removeItem('pending_quiz_answers')
      localStorage.removeItem('pending_quiz_score')
      if (pendingAnswers && pendingScore) {
        try {
          const parsedAnswers = JSON.parse(pendingAnswers)
          if (parsedAnswers?.destination && parsedAnswers?.segment) {
            await supabase.from('quiz_results').insert({
              user_id: session.user.id,
              answers: parsedAnswers,
              score: parseInt(pendingScore),
              destination: parsedAnswers.destination,
              segment: parsedAnswers.segment,
            })
          }
        } catch (e) { console.error('Failed to save quiz result:', e) }
      }

      if (pendingName) localStorage.removeItem('pending_full_name')

      // Save referral if this user came via a referral link
      const referralFrom = localStorage.getItem('referral_from')
      if (referralFrom && justSignedUp && referralFrom !== session.user.id) {
        localStorage.removeItem('referral_from')
        await supabase.from('referrals').insert({
          referrer_id: referralFrom,
          referred_user_id: session.user.id,
          signed_up_at: new Date().toISOString(),
        })
      }

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
          .insert({ id: session.user.id, full_name: nameForProfile, referral_code: generateReferralCode(nameForProfile), updated_at: new Date().toISOString() })
          .select()
          .maybeSingle()
        profileData = newProfile
      } else if (!profileData.referral_code) {
        // Backfill existing users who don't have a code yet
        const code = generateReferralCode(profileData.full_name)
        await supabase.from('profiles').update({ referral_code: code }).eq('id', session.user.id)
        profileData = { ...profileData, referral_code: code }
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

      // Fetch curriculum + recent lesson progress for personalised dashboard
      if (quizData?.answers?.destination && quizData?.answers?.segment) {
        const { data: currData } = await supabase
          .from('curricula')
          .select('id, modules')
          .eq('user_id', session.user.id)
          .eq('destination', quizData.answers.destination)
          .eq('segment', quizData.answers.segment)
          .maybeSingle()
        if (currData) {
          setCurriculum(currData)
          const { data: progressData } = await supabase
            .from('lesson_progress')
            .select('module_index, lesson_index, completed, completed_at')
            .eq('user_id', session.user.id)
            .eq('curriculum_id', currData.id)
            .eq('completed', true)
            .order('completed_at', { ascending: false })
            .limit(10)
          setRecentProgress(progressData || [])
        }
      }

      setLoading(false)
    }
    load()
  }, [])

  const handleSignOut = async () => { await supabase.auth.signOut(); router.push('/') }


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F7F9FF' }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#1E4DD7', borderTopColor: 'transparent' }} />
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
      <div className="h-screen flex overflow-hidden" style={{ background: '#F7F9FF' }}>
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
        <main className="flex-1 lg:ml-[260px] overflow-y-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 pb-24 lg:pb-8" style={{ background: '#F7F9FF' }}>
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
            <span className="font-bold text-sm text-[#18181B]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
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
              {activeTab === 'overview'       && <OverviewTab answers={answers} score={score} flag={flag} displayName={displayName} isNewUser={isFirstVisit} router={router} quizResult={quizResult} setActiveTab={setActiveTab} curriculum={curriculum} recentProgress={recentProgress} />}
              {activeTab === 'learning'       && <LearningTab answers={answers} userId={user?.id} quizResult={quizResult} router={router} />}
              {activeTab === 'roadmap'        && <RoadmapTab answers={answers} score={score} quizResult={quizResult} router={router} />}
              {activeTab === 'resources'      && <ResourcesTab answers={answers} userId={user?.id} />}
              {activeTab === 'conversations'  && <ConversationsTab user={user} profile={profile} answers={answers} />}
              {activeTab === 'documents'      && <DocumentsTab />}
              {activeTab === 'peers'          && <PeersTab answers={answers} />}
              {activeTab === 'marketplace'    && <MarketplaceTab answers={answers} />}
              {activeTab === 'profile'        && <ProfileTab user={user} profile={profile} answers={answers} score={score} quizResult={quizResult} onSignOut={handleSignOut} router={router} />}
              {activeTab === 'credit'         && <CreditScoreTab score={score} quizResult={quizResult} answers={answers} />}
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
                  style={{ color: isActive ? '#1E4DD7' : '#9E9E9E' }}
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
