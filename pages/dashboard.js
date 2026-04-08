import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import {
  LayoutDashboard, BookOpen, Map, FolderOpen, MessageSquare,
  Upload, Users, ShoppingBag, CreditCard, Settings, LogOut,
  Lock, ChevronRight, ChevronDown, ChevronUp, CheckCircle2,
  CircleCheck, PlayCircle, Sparkles, ArrowRight,
  RotateCcw, Globe2, Briefcase, Clock, Wallet, TrendingUp,
  X, Shield, Star, AlertCircle, Bell, Bookmark, Heart,
  Search, SlidersHorizontal, Play, ChevronLeft, Plus,
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
  { id: 'conversations', label: 'Conversations',   icon: MessageSquare,   locked: true },
  { id: 'peers',         label: 'Peers',           icon: Users,           locked: true },
  { id: 'marketplace',   label: 'Marketplace',     icon: ShoppingBag,     locked: true },
]

// ── Score Bar Chart ────────────────────────────────────────────────────────────
function ScoreBarChart({ breakdown }) {
  if (!breakdown || breakdown.length === 0) return null
  const barColors = ['#702DFF', '#9b72ff', '#702DFF', '#c4a8ff', '#702DFF', '#9b72ff']
  return (
    <div className="flex items-end gap-1.5 h-20">
      {breakdown.map((factor, i) => {
        const pct = Math.max(8, Math.round((factor.score / factor.max) * 100))
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full rounded-t-md transition-all duration-700"
              style={{ height: `${pct}%`, backgroundColor: barColors[i] }}
            />
          </div>
        )
      })}
    </div>
  )
}

// ── Sidebar ────────────────────────────────────────────────────────────────────
function Sidebar({ activeTab, setActiveTab, onSignOut, isMobileOpen, onMobileClose }) {
  return (
    <>
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-40 xl:hidden"
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
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#702DFF' }}>
              <Sparkles size={18} className="text-white" />
            </div>
            <span
              className="font-extrabold text-base uppercase tracking-wide"
              style={{
                background: 'linear-gradient(90deg, #702DFF -3.24%, #7550FB 29.22%, #4A3AFF 101.79%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              JapaLearn AI
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
                    isActive ? "text-[#702DFF]" : "text-[#202020] hover:text-[#702DFF]"
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

        {/* Bottom: Settings + Sign out */}
        <div className="flex flex-col gap-2.5 px-8">
          <p className="text-xs font-semibold text-[#3F3F3F] uppercase tracking-wider mb-2">Settings</p>
          <button className="flex items-center gap-3 py-2 text-[#202020] hover:text-[#702DFF] text-sm font-medium transition-colors">
            <Settings size={16} />
            Settings
          </button>
          <button
            onClick={onSignOut}
            className="flex items-center gap-3 py-2 text-[#F13E3E] hover:text-red-700 text-sm font-medium transition-colors"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>
    </>
  )
}

// ── Right Panel ────────────────────────────────────────────────────────────────
function RightPanel({ user, profile, score, breakdown, answers, quizResult, router }) {
  const fullName = profile?.full_name || user?.email || ''
  const firstName = (fullName.split(/[\s@]/)[0] || 'You').charAt(0).toUpperCase() + (fullName.split(/[\s@]/)[0] || 'You').slice(1)
  const initials = firstName[0]?.toUpperCase() || 'U'

  const flag = getScoreFlag(score)
  const flagConfig = {
    green:  { label: 'Strong',      color: '#10b981' },
    yellow: { label: 'Developing',  color: '#702DFF' },
    red:    { label: 'Needs Work',  color: '#f43f5e' },
  }
  const fc = flagConfig[flag] || flagConfig.yellow

  const ADVISORS = [
    { name: 'Amara Nwosu', specialty: 'UK Skilled Worker Visa' },
    { name: 'Tunde Adeleke', specialty: 'Canada Express Entry' },
    { name: 'Chisom Eze', specialty: 'Germany Job Seeker' },
    { name: 'Kemi Fashola', specialty: 'Australia Skilled Migrant' },
  ]

  return (
    <aside className="hidden xl:flex flex-col gap-6 w-[280px] shrink-0 h-screen overflow-y-auto py-8 px-6 border-l border-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm text-[#202020]">Your Profile</h3>
        <button className="text-slate-400 hover:text-slate-600">
          <SlidersHorizontal size={16} />
        </button>
      </div>

      {/* Avatar + greeting */}
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center text-2xl font-bold text-slate-500 ring-4 ring-purple-100">
          {initials}
        </div>
        <div>
          <p className="text-sm font-semibold text-[#202020]">Good day, {firstName}</p>
          <p className="text-xs text-[#9E9E9E] mt-0.5 leading-tight max-w-[180px]">Continue Your Journey And Achieve Your Goal</p>
        </div>
        <div className="flex gap-3">
          {[Bell, MessageSquare, Bookmark].map((Icon, i) => (
            <button key={i} className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:border-purple-300 hover:text-purple-600 transition-colors">
              <Icon size={14} />
            </button>
          ))}
        </div>
      </div>

      {/* Score summary */}
      <div className="bg-slate-50 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Readiness Score</p>
          <span className="text-lg font-black" style={{ color: fc.color }}>{score}<span className="text-xs font-normal text-slate-400">/100</span></span>
        </div>
        {quizResult ? (
          <ScoreBarChart breakdown={breakdown} />
        ) : (
          <div className="text-center py-3">
            <p className="text-xs text-slate-400">Take the quiz to see your score breakdown</p>
          </div>
        )}
        {quizResult && (
          <div className="flex gap-1 mt-2 overflow-hidden">
            {breakdown.map((f, i) => (
              <p key={i} className="text-[8px] text-slate-400 flex-1 text-center truncate">{f.label}</p>
            ))}
          </div>
        )}
        {!quizResult && (
          <button
            onClick={() => router.push('/quiz')}
            className="mt-3 w-full text-xs font-semibold text-white py-2 rounded-full transition-all"
            style={{ background: '#702DFF' }}
          >
            Take Assessment
          </button>
        )}
      </div>

      {/* Advisors */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#202020]">Your Mentor</h3>
          <button className="w-6 h-6 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:border-purple-300 transition-colors">
            <Plus size={12} />
          </button>
        </div>

        {ADVISORS.map((advisor) => (
          <div key={advisor.name} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-200 to-purple-100 flex items-center justify-center text-xs font-bold text-purple-700 shrink-0">
              {advisor.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#202020] truncate">{advisor.name}</p>
              <p className="text-[10px] text-[#9E9E9E] truncate">{advisor.specialty}</p>
            </div>
            <button
              className="text-[10px] font-semibold text-white px-3 py-1 rounded-full shrink-0"
              style={{ background: '#702DFF' }}
            >
              Follow
            </button>
          </div>
        ))}

        <button className="w-full text-xs text-[#9E9E9E] bg-purple-50 hover:bg-purple-100 py-3 rounded-xl transition-colors mt-1">
          See All
        </button>
      </div>
    </aside>
  )
}

// ── OVERVIEW TAB ───────────────────────────────────────────────────────────────
function OverviewTab({ answers, score, flag, displayName, isNewUser, router, quizResult, setActiveTab }) {
  const destinationFlag = COUNTRY_FLAGS[answers.destination] || '🌍'
  const breakdown = quizResult ? getScoreBreakdown(answers, score) : []

  const flagConfig = {
    green:  { label: 'Strong Profile',    bar: 'bg-emerald-500' },
    yellow: { label: 'Developing',        bar: 'bg-purple-500'  },
    red:    { label: 'Needs Improvement', bar: 'bg-rose-400'    },
  }
  const fc = flagConfig[flag] || flagConfig.yellow

  const milestones = [
    {
      icon: CheckCircle2,
      status: quizResult ? 'Completed' : 'Pending',
      label: 'Migration Assessment',
      done: !!quizResult,
      cta: () => router.push('/quiz'),
    },
    {
      icon: Globe2,
      status: answers.language && answers.language !== 'Not taken' ? 'Registered' : 'Not yet',
      label: 'Language Test',
      done: !!(answers.language && answers.language !== 'Not taken'),
      cta: null,
    },
    {
      icon: FolderOpen,
      status: 'In progress',
      label: 'Core Documents',
      done: false,
      cta: null,
    },
  ]

  const LEARNING_MODULES = [
    { title: 'Immigration Pathways & Visa Routes', category: 'Foundation', progress: quizResult ? 51 : 0 },
    { title: 'Language Test Preparation Guide', category: 'Skills', progress: 0 },
    { title: 'Document Collection & Verification', category: 'Documents', progress: 0 },
  ]

  const ADVISORS_TABLE = [
    { name: 'Amara Nwosu', date: '12/3/2025', type: 'UK Route', focus: 'Skilled Worker Visa' },
    { name: 'Tunde Adeleke', date: '20/3/2025', type: 'Canada Route', focus: 'Express Entry' },
  ]

  const moduleGradients = [
    'from-purple-100 to-indigo-50',
    'from-blue-100 to-purple-50',
    'from-indigo-100 to-blue-50',
  ]

  return (
    <div className="flex flex-col gap-6 pb-10">
      {/* Search bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 flex items-center gap-3 bg-white border border-[rgba(204,204,204,0.8)] rounded-xl px-4 py-3.5">
          <Search size={16} className="text-[#9E9E9E] shrink-0" />
          <span className="text-xs font-medium text-[#9E9E9E] flex-1">Search your learning path...</span>
        </div>
        <button className="w-14 h-14 rounded-full flex items-center justify-center text-[#5F5F5F] hover:text-[#702DFF] transition-colors shrink-0">
          <SlidersHorizontal size={20} />
        </button>
      </div>

      {/* Hero banner */}
      <div
        className="relative rounded-[20px] overflow-hidden px-6 py-5"
        style={{ background: '#702DFF', minHeight: 181 }}
      >
        {/* Decorative sparkle shapes */}
        <div className="absolute right-[77px] top-[45px] w-20 h-20 bg-white opacity-25 rotate-45 rounded-lg pointer-events-none" />
        <div className="absolute right-2 top-[93px] w-20 h-20 bg-white opacity-10 rotate-12 rounded-lg pointer-events-none" />
        <div className="absolute right-[148px] top-[122px] w-20 h-20 bg-white opacity-10 -rotate-12 rounded-lg pointer-events-none" />
        <div className="absolute right-[26px] -top-[20px] w-16 h-16 bg-white opacity-10 rotate-6 rounded-lg pointer-events-none" />

        <div className="relative z-10">
          <p className="text-white/70 text-xs uppercase tracking-wider mb-2">Your Migration Journey</p>
          <h2 className="text-white font-semibold text-2xl leading-snug mb-5 max-w-xs">
            Prepare for Your Japa<br />with AI-Powered Learning
          </h2>
          <button
            onClick={() => router.push(quizResult ? undefined : '/quiz')}
            className="flex items-center gap-3 text-white text-xs font-medium px-3 py-2 rounded-full"
            style={{ background: '#202020', width: 'fit-content' }}
          >
            {quizResult ? `${destinationFlag} ${answers.destination || 'My Journey'}` : 'Start Assessment'}
            <span className="w-5 h-5 bg-white rounded-full flex items-center justify-center shrink-0">
              <Play size={7} fill="#202020" className="text-[#202020] ml-0.5" />
            </span>
          </button>
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
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(112,45,255,0.15)' }}>
                <Icon size={16} style={{ color: '#702DFF' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-[#5F5F5F]">{m.status}</p>
                <p className="text-xs font-semibold text-[#202020] truncate">{m.label}</p>
              </div>
              <button className="w-6 h-6 flex items-center justify-center text-[#7E7E7E] hover:text-[#702DFF] transition-colors shrink-0">
                <SlidersHorizontal size={14} />
              </button>
            </div>
          )
        })}
      </div>

      {/* Continue Learning */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-medium text-[#202020] capitalize">Continue Learning</h3>
          <div className="flex gap-3">
            <button className="w-6 h-6 rounded-full border border-[#9E9E9E] flex items-center justify-center text-[#9E9E9E] hover:border-[#702DFF] hover:text-[#702DFF] transition-colors">
              <ChevronLeft size={12} />
            </button>
            <button className="w-6 h-6 rounded-full border border-[#9E9E9E] flex items-center justify-center text-[#9E9E9E] hover:border-[#702DFF] hover:text-[#702DFF] transition-colors">
              <ChevronRight size={12} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {LEARNING_MODULES.map((mod, i) => (
            <div
              key={i}
              className="bg-white shadow-[0px_14px_42px_rgba(8,15,52,0.06)] rounded-[20px] p-3 relative cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setActiveTab('learning')}
            >
              {/* Thumbnail */}
              <div className={`h-[113px] bg-gradient-to-br ${moduleGradients[i]} rounded-xl mb-3 flex items-center justify-center`}>
                <BookOpen size={28} className="text-purple-300" />
              </div>

              {/* Category badge */}
              <span
                className="text-[8px] font-medium uppercase px-2 py-1 rounded-lg"
                style={{ background: 'rgba(112,45,255,0.15)', color: '#702DFF' }}
              >
                {mod.category}
              </span>

              {/* Title */}
              <h4 className="text-sm font-medium text-[#202020] mt-2 mb-2 leading-snug">{mod.title}</h4>

              {/* Progress bar */}
              <div className="h-1.5 bg-[#D9D9D9] rounded-full mb-3">
                <div
                  className="h-1.5 rounded-full transition-all duration-700"
                  style={{ width: `${mod.progress}%`, background: '#702DFF' }}
                />
              </div>

              {/* Author */}
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold text-white shrink-0" style={{ background: '#702DFF' }}>
                  J
                </div>
                <div>
                  <p className="text-[10px] font-medium text-[#202020]">JapaLearn AI</p>
                  <p className="text-[8px] text-[#9E9E9E]">Migration Specialist</p>
                </div>
              </div>

              {/* Heart */}
              <button className="absolute top-5 right-5 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: 'rgba(204,204,204,0.5)' }}>
                <Heart size={8} className="text-white" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Advisors table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-medium text-[#202020]">Your Mentor</h3>
          <button className="text-xs font-medium" style={{ color: '#702DFF' }}>See All</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left text-[9px] font-semibold uppercase text-[#9E9E9E] tracking-wider pb-3">Advisor Name & Date</th>
                <th className="text-left text-[9px] font-semibold uppercase text-[#9E9E9E] tracking-wider pb-3">Route Type</th>
                <th className="text-left text-[9px] font-semibold uppercase text-[#9E9E9E] tracking-wider pb-3">Focus Area</th>
                <th className="text-right text-[9px] font-semibold uppercase text-[#9E9E9E] tracking-wider pb-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ADVISORS_TABLE.map((a) => (
                <tr key={a.name}>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-purple-700 shrink-0" style={{ background: 'rgba(112,45,255,0.15)' }}>
                        {a.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#202020]">{a.name}</p>
                        <p className="text-[10px] text-[#9E9E9E]">{a.date}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="text-[8px] font-medium uppercase px-2 py-1 rounded-lg" style={{ background: 'rgba(112,45,255,0.15)', color: '#702DFF' }}>
                      {a.type}
                    </span>
                  </td>
                  <td className="text-sm text-[#5F5F5F]">{a.focus}</td>
                  <td className="text-right">
                    <button className="text-[10px] font-semibold px-3 py-1.5 rounded-lg" style={{ background: 'rgba(112,45,255,0.15)', color: '#702DFF' }}>
                      Show Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
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
      <div className="flex flex-col gap-6 pb-10">
        <div>
          <h2 className="text-xl font-bold text-[#202020] mb-1">Learning</h2>
          <p className="text-sm text-[#5F5F5F]">Your AI-generated, structured learning path</p>
        </div>
        <div className="bg-white shadow-[0px_14px_42px_rgba(8,15,52,0.06)] rounded-[20px] p-10 text-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: 'rgba(112,45,255,0.12)' }}>
            <BookOpen size={24} style={{ color: '#702DFF' }} />
          </div>
          <h3 className="text-[#202020] font-bold text-xl mb-2">Generate Your Learning Path</h3>
          <p className="text-[#5F5F5F] text-sm mb-7 max-w-sm mx-auto leading-relaxed">
            Get a personalised {answers.destination || ''} learning path — structured modules, detailed lessons, and official sources built for your exact profile.
          </p>
          <button
            onClick={generateCurriculum}
            disabled={loading || !answers.destination}
            className="inline-flex items-center gap-2.5 text-white font-semibold py-3.5 px-8 rounded-full transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: '#702DFF' }}
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
            <div className="text-2xl font-black" style={{ color: '#702DFF' }}>{progressPct}%</div>
            <div className="text-[#9E9E9E] text-xs">{completedCount}/{totalLessons} lessons</div>
          </div>
        </div>
        <div className="w-full bg-[#D9D9D9] rounded-full h-2">
          <div className="h-2 rounded-full transition-all duration-700" style={{ width: `${progressPct}%`, background: '#702DFF' }} />
        </div>
      </div>

      {curriculum.modules.map((module, mi) => {
        const moduleDone = module.lessons.every((_, li) => progress[`${mi}-${li}`])
        const moduleStarted = module.lessons.some((_, li) => progress[`${mi}-${li}`])
        const isOpen = expandedModule === mi
        const completedInModule = module.lessons.filter((_, li) => progress[`${mi}-${li}`]).length

        return (
          <div key={mi} className="bg-white shadow-[0px_14px_42px_rgba(8,15,52,0.06)] rounded-[20px] overflow-hidden">
            <button
              onClick={() => setExpandedModule(isOpen ? -1 : mi)}
              className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0",
                  moduleDone    ? "bg-emerald-100 text-emerald-600" :
                  moduleStarted ? "text-white" : "bg-slate-100 text-slate-500"
                )} style={moduleStarted && !moduleDone ? { background: '#702DFF' } : {}}>
                  {moduleDone ? <CircleCheck size={16} /> : mi + 1}
                </div>
                <div className="text-left">
                  <div className="text-[#202020] font-semibold text-sm">{module.title}</div>
                  <div className="text-[#9E9E9E] text-xs mt-0.5">
                    {completedInModule}/{module.lessons.length} lessons
                    {moduleDone && <span className="text-emerald-600 ml-2">· Complete</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {module.urgent && (
                  <span className="bg-rose-50 text-rose-600 text-xs px-2 py-0.5 rounded-full font-semibold">Urgent</span>
                )}
                {isOpen ? <ChevronUp size={16} className="text-[#9E9E9E]" /> : <ChevronDown size={16} className="text-[#9E9E9E]" />}
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
                        unlocked && !done ? "hover:bg-purple-50 cursor-pointer" :
                        done             ? "hover:bg-slate-50 cursor-pointer" :
                                           "opacity-40 cursor-not-allowed"
                      )}
                    >
                      <div className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold border",
                        done     ? "bg-emerald-100 border-emerald-200 text-emerald-600" :
                        unlocked ? "border-purple-200 text-white" :
                                   "bg-slate-100 border-slate-200 text-slate-400"
                      )} style={unlocked && !done ? { background: 'rgba(112,45,255,0.12)', borderColor: '#702DFF' } : {}}>
                        {done ? <CircleCheck size={14} /> : unlocked ? <PlayCircle size={14} style={{ color: '#702DFF' }} /> : <Lock size={11} />}
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
      color: '#702DFF', bg: 'rgba(112,45,255,0.08)', border: 'rgba(112,45,255,0.2)',
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

      <div className="flex items-center gap-3 rounded-xl px-4 py-3" style={{ background: 'rgba(112,45,255,0.08)', border: '1px solid rgba(112,45,255,0.2)' }}>
        <Clock size={15} style={{ color: '#702DFF' }} className="shrink-0" />
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
function ResourcesTab({ answers }) {
  const destination = answers.destination || ''

  const resourceSections = [
    {
      title: 'Document Checklists', icon: CheckCircle2,
      color: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)',
      items: [
        'Core Document Checklist — Passport, Degree, NYSC, ID',
        `${destination || 'UK'} Visa Application Document List`,
        'Police Clearance Certificate — How to Obtain',
        'Degree Certificate Apostille Guide',
        'Birth Certificate & Next of Kin Documents',
      ],
    },
    {
      title: 'CV & Career Templates', icon: Briefcase,
      color: '#702DFF', bg: 'rgba(112,45,255,0.08)', border: 'rgba(112,45,255,0.2)',
      items: [
        'International CV Template (ATS-Optimised)',
        'Cover Letter Template — Skilled Worker Visa Jobs',
        'LinkedIn Profile Optimisation Guide',
        'References Request Email Template',
        'Skills Assessment Evidence Template',
      ],
    },
    {
      title: 'SOP & Personal Statement', icon: FolderOpen,
      color: '#3b82f6', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.2)',
      items: [
        'Statement of Purpose (SOP) — Study Visa Template',
        'Personal Statement Guide — Skilled Worker',
        'Letter of Explanation — Financial History',
        'Sponsor Letter Template (Family Visa)',
        'Employment History Letter Template',
      ],
    },
    {
      title: 'Financial Planning', icon: Wallet,
      color: '#0ea5e9', bg: 'rgba(14,165,233,0.08)', border: 'rgba(14,165,233,0.2)',
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
    <div className="flex flex-col gap-5 pb-10">
      <div>
        <h2 className="text-xl font-bold text-[#202020] mb-1">Resources</h2>
        <p className="text-sm text-[#5F5F5F]">Templates, checklists, and guides curated for your migration route</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        {resourceSections.map((section) => {
          const Icon = section.icon
          return (
            <div key={section.title} className="bg-white shadow-[0px_14px_42px_rgba(8,15,52,0.06)] rounded-[20px] p-5" style={{ border: `1px solid ${section.border}` }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: section.bg, border: `1px solid ${section.border}` }}>
                  <Icon size={16} style={{ color: section.color }} />
                </div>
                <h3 className="font-semibold text-[#202020] text-sm">{section.title}</h3>
              </div>
              <ul className="space-y-2.5">
                {section.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-2.5 group cursor-pointer">
                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: section.color, opacity: 0.4 }} />
                    <span className="text-[#5F5F5F] text-sm group-hover:text-[#202020] transition-colors flex-1">{item}</span>
                    <span className="text-[10px] bg-slate-100 text-[#9E9E9E] px-2 py-0.5 rounded-full font-medium shrink-0">Soon</span>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>

      <div className="rounded-[20px] p-6 text-center" style={{ background: 'rgba(112,45,255,0.05)', border: '1px solid rgba(112,45,255,0.15)' }}>
        <Star size={20} style={{ color: '#702DFF' }} className="mx-auto mb-3" />
        <h3 className="font-bold text-[#202020] mb-1">More resources being added weekly</h3>
        <p className="text-[#5F5F5F] text-sm">Country-specific templates, expert guides, and downloadable checklists are being curated for each migration route.</p>
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#702DFF', borderTopColor: 'transparent' }} />
          <p className="text-[#9E9E9E] text-sm">Loading your dashboard...</p>
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
  const breakdown = quizResult ? getScoreBreakdown(answers, score) : []

  return (
    <>
      <Head><title>Dashboard — JapaLearn AI</title></Head>
      <div className="h-screen bg-white flex overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onSignOut={handleSignOut}
          isMobileOpen={isMobileOpen}
          onMobileClose={() => setIsMobileOpen(false)}
        />

        {/* Main content */}
        <main className="flex-1 lg:ml-[240px] overflow-y-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 pb-24 lg:pb-8">
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
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: '#3b75ff' }}>
              {displayName[0]}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              {activeTab === 'overview'  && <OverviewTab answers={answers} score={score} flag={flag} displayName={displayName} isNewUser={!quizResult} router={router} quizResult={quizResult} setActiveTab={setActiveTab} />}
              {activeTab === 'learning'  && <LearningTab answers={answers} userId={user?.id} />}
              {activeTab === 'roadmap'   && <RoadmapTab answers={answers} score={score} />}
              {activeTab === 'resources' && <ResourcesTab answers={answers} />}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Right panel — only on overview */}
        {activeTab === 'overview' && (
          <RightPanel
            user={user}
            profile={profile}
            score={score}
            breakdown={breakdown}
            answers={answers}
            quizResult={quizResult}
            router={router}
          />
        )}

        {/* Mobile bottom navigation */}
        <nav className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t border-slate-100 z-40 px-2 py-2">
          <div className="flex items-center justify-around">
            {NAV_ITEMS.filter(i => !i.locked).map(item => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all"
                  style={{ color: isActive ? '#3b75ff' : '#9E9E9E' }}
                >
                  <Icon size={20} />
                  <span style={{ fontSize: '10px', fontWeight: isActive ? 600 : 400 }}>{item.label}</span>
                </button>
              )
            })}
          </div>
        </nav>
      </div>
    </>
  )
}
