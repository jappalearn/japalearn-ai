import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import {
  Globe2, TrendingUp, Map, BarChart3, CheckCircle2,
  AlertTriangle, ArrowRight, RotateCcw, ChevronRight,
  Briefcase, GraduationCap, Languages, Clock, Wallet, Award,
} from 'lucide-react'
import { getScoreFlag, normaliseSegment } from '../lib/quizData'

const ROUTE_RECOMMENDATIONS = {
  Canada: {
    'Tech Professional':          { route: 'Express Entry — Federal Skilled Worker', cost: '₦8M–₦14M' },
    'Career Professional':        { route: 'Express Entry — Federal Skilled Worker', cost: '₦8M–₦14M' },
    'Healthcare Worker':          { route: 'Express Entry + Healthcare Streams',     cost: '₦9M–₦16M' },
    'Student or Post-Grad':       { route: 'Study Permit → PGWP → PR',              cost: '₦12M–₦25M' },
    'Freelancer or Remote Worker':{ route: 'Express Entry — Federal Skilled Worker', cost: '₦8M–₦14M' },
    'Parent':                     { route: 'Express Entry — Family PR',              cost: '₦10M–₦18M' },
    default:                      { route: 'Express Entry — Federal Skilled Worker', cost: '₦8M–₦14M' },
  },
  UK: {
    'Tech Professional':    { route: 'Global Talent Visa / Skilled Worker', cost: '₦5M–₦10M' },
    'Healthcare Worker':    { route: 'Health & Care Worker Visa',           cost: '₦4M–₦8M'  },
    'Student or Post-Grad': { route: 'Student Visa → Graduate Route',       cost: '₦10M–₦20M' },
    'Career Professional':  { route: 'Skilled Worker Visa',                 cost: '₦5M–₦10M' },
    default:                { route: 'Skilled Worker Visa',                 cost: '₦5M–₦10M' },
  },
  Germany: {
    'Tech Professional':          { route: 'EU Blue Card / Skilled Immigration Act', cost: '₦7M–₦12M' },
    'Career Professional':        { route: 'EU Blue Card',                           cost: '₦7M–₦12M' },
    'Student or Post-Grad':       { route: 'Student Visa → Job Seeker',              cost: '₦8M–₦15M' },
    'Freelancer or Remote Worker':{ route: 'Germany Freelance Visa',                 cost: '₦5M–₦9M'  },
    default:                      { route: 'EU Blue Card',                           cost: '₦7M–₦12M' },
  },
  Australia: {
    default:                { route: 'Skilled Nominated Visa (190)',         cost: '₦10M–₦18M' },
    'Student or Post-Grad': { route: 'Student Visa → Graduate Visa (485)',   cost: '₦12M–₦22M' },
  },
  Ireland: {
    default:                { route: 'Critical Skills Employment Permit',    cost: '₦6M–₦11M' },
    'Student or Post-Grad': { route: 'Study → 2-Year Stay Back',             cost: '₦10M–₦18M' },
  },
  Portugal: {
    'Freelancer or Remote Worker': { route: 'D8 Digital Nomad Visa', cost: '₦3M–₦6M' },
    default:                       { route: 'Job Seeker Visa',       cost: '₦4M–₦8M' },
  },
  UAE: { default: { route: 'Employment Visa / Freelance Permit', cost: '₦2M–₦5M' } },
}

function getRecommendation(destination, segment) {
  const routes = ROUTE_RECOMMENDATIONS[destination]
  if (!routes) return { route: 'Skilled Worker / Employment Visa', cost: '₦5M–₦12M' }
  return routes[segment] || routes['default'] || { route: 'Skilled Worker / Employment Visa', cost: '₦5M–₦12M' }
}

function getNextSteps(answers, score) {
  const steps = []
  const flag = getScoreFlag(score)
  if (!answers.language || answers.language === 'Not taken') {
    steps.push({ priority: 'Urgent', text: `Register for an IELTS or relevant language test — this is your biggest gap (0/20 pts currently).` })
  }
  if (answers.savings === '< ₦1M' || answers.savings === 'Less than ₦1M') {
    steps.push({ priority: 'Urgent', text: `Start a dedicated migration savings plan. Most routes require minimum ₦3M–₦8M in proof of funds.` })
  }
  if (answers.experience === '0–1' || answers.experience === '0 – 1 year') {
    steps.push({ priority: 'High', text: `Focus on building 2+ years of documented work experience — the highest-weighted factor (30%).` })
  }
  if (flag === 'green') {
    steps.push({ priority: 'High', text: `Your profile is strong. Start gathering documents: passport, degree certificates, NYSC discharge, work references.` })
  }
  steps.push({ priority: 'Next', text: `Create your free JapaLearn account to access your personalised ${answers.destination} curriculum.` })
  steps.push({ priority: 'Next', text: `Bookmark the official immigration portal for ${answers.destination || 'your target country'} and check current processing times.` })
  return steps.slice(0, 5)
}

const priorityConfig = {
  Urgent: { color: 'text-rose-600',   bg: 'bg-rose-50',   border: 'border-rose-200',   icon: AlertTriangle },
  High:   { color: 'text-amber-600',  bg: 'bg-amber-50',  border: 'border-amber-200',  icon: TrendingUp    },
  Next:   { color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200', icon: ArrowRight    },
}

const breakdownIcons = [Briefcase, GraduationCap, Languages, Clock, Wallet, Award]

const LOADING_STEPS = [
  { text: 'Analysing your profile...',          sub: 'Reviewing your experience, education and background'               },
  { text: 'Checking visa route eligibility...',  sub: 'Matching your profile against 40+ immigration pathways'           },
  { text: 'Calculating your readiness score...', sub: 'Weighing language, savings, age and qualification factors'        },
  { text: 'Building your action plan...',        sub: 'Identifying your strongest gaps and quick wins'                   },
  { text: 'Finalising your report...',           sub: 'Almost ready — pulling it all together for you'                   },
]

export default function Report() {
  const router = useRouter()
  const [data, setData] = useState(null)
  const [generating, setGenerating] = useState(true)
  const [stepIndex, setStepIndex] = useState(0)
  const [barWidth, setBarWidth] = useState(0)

  useEffect(() => {
    if (!router.isReady) return
    const { score, answers } = router.query
    if (!score || !answers) { router.push('/'); return }
    try {
      const parsed = { score: parseInt(score), answers: JSON.parse(answers) }
      const totalMs = 30000
      const stepMs = totalMs / LOADING_STEPS.length
      let step = 0
      const stepTimer = setInterval(() => {
        step += 1
        if (step < LOADING_STEPS.length) setStepIndex(step)
        else clearInterval(stepTimer)
      }, stepMs)
      const barTimer = setInterval(() => {
        setBarWidth(w => { if (w >= 98) { clearInterval(barTimer); return 98 } return w + 0.17 })
      }, 50)
      const doneTimer = setTimeout(() => {
        setBarWidth(100)
        setTimeout(() => { setGenerating(false); setData(parsed) }, 300)
      }, totalMs)
      return () => { clearInterval(stepTimer); clearInterval(barTimer); clearTimeout(doneTimer) }
    } catch { router.push('/') }
  }, [router.isReady])

  /* ── Loading screen ── */
  if (generating) {
    const step = LOADING_STEPS[stepIndex]
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-5">
        <div className="flex items-center gap-2 mb-16">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
            <Globe2 size={15} className="text-white" />
          </div>
          <span className="font-bold text-slate-900 text-sm">JapaLearn <span className="text-indigo-600">AI</span></span>
        </div>

        <div className="relative mb-10">
          <div className="w-24 h-24 rounded-full bg-indigo-50 border-2 border-indigo-100 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-indigo-100 border-2 border-indigo-200 flex items-center justify-center">
              <div className="w-7 h-7 rounded-full bg-indigo-600" />
            </div>
          </div>
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-indigo-600 animate-spin" />
        </div>

        <div className="text-center mb-10 max-w-sm">
          <p className="text-slate-900 font-semibold text-lg mb-2">{step.text}</p>
          <p className="text-slate-500 text-sm leading-relaxed">{step.sub}</p>
        </div>

        <div className="w-full max-w-xs">
          <div className="w-full bg-slate-100 rounded-full h-1.5 mb-3">
            <div
              className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${barWidth}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-400">
            <span>Personalising your report</span>
            <span>{Math.round(barWidth)}%</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-8">
          {LOADING_STEPS.map((_, i) => (
            <div key={i} className={`rounded-full transition-all duration-300 ${
              i === stepIndex ? 'w-6 h-1.5 bg-indigo-600' : i < stepIndex ? 'w-1.5 h-1.5 bg-indigo-300' : 'w-1.5 h-1.5 bg-slate-200'
            }`} />
          ))}
        </div>
      </div>
    )
  }

  if (!data) return null

  const { score, answers } = data
  const flag = getScoreFlag(score)
  const recommendation = getRecommendation(answers.destination, normaliseSegment(answers.segment))
  const nextSteps = getNextSteps(answers, score)

  const flagConfig = {
    green:  { label: 'Strong Profile',   color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', bar: 'bg-emerald-500' },
    yellow: { label: 'Building Profile', color: 'text-amber-600',   bg: 'bg-amber-50',   border: 'border-amber-200',  bar: 'bg-amber-500'   },
    red:    { label: 'Early Stage',      color: 'text-rose-600',    bg: 'bg-rose-50',    border: 'border-rose-200',   bar: 'bg-rose-500'    },
  }
  const fc = flagConfig[flag]

  const scoreBreakdown = [
    { label: 'Work Experience',    score: ({ '0–1': 4, '2–3': 10, '4–6': 18, '7–10': 25, '10+': 30, '0 – 1 year': 4, '2 – 3 years': 10, '4 – 6 years': 18, '7 – 10 years': 25, '10+ years': 30 })[answers.experience] || 0, max: 30 },
    { label: 'Education',          score: ({ 'High School': 4, 'Diploma': 8, "Bachelor's": 14, "Master's": 18, 'PhD': 20, "Bachelor's Degree (BSc / BA / MBBS / BPharm / LLB etc.)": 14, "Master's Degree (MSc / MBA / MA / LLM etc.)": 18, 'PhD / Doctorate': 20 })[answers.education] || 0, max: 20 },
    { label: 'Language Test',      score: ({ 'Not taken': 0, 'Scheduled': 2, 'IELTS <6.0': 4, 'IELTS 6.0–6.5': 10, 'IELTS 7.0–8.0': 16, 'IELTS 8.0+': 20, 'CELPIP': 16, 'TOEFL': 14, 'IELTS Academic — below 6.0': 4, 'IELTS Academic — 6.0 to 6.5': 10, 'IELTS Academic — 7.0 to 7.5': 16, 'IELTS Academic — 8.0+': 20, 'OET (Occupational English Test) — for healthcare': 18, 'CELPIP — for Canada': 16 })[answers.language] || 0, max: 20 },
    { label: 'Age Factor',         score: ({ 'Under 20': 2, '20–24': 6, '25–30': 10, '31–35': 10, '36–40': 7, '41–45': 4, '46+': 2, '20 – 24': 6, '25 – 30': 10, '31 – 35': 10, '36 – 40': 7, '41 – 45': 4 })[answers.age] || 0, max: 10 },
    { label: 'Financial Readiness',score: ({ '< ₦1M': 0, '₦1M–5M': 3, '₦5M–10M': 6, '₦10M–20M': 8, '₦20M+': 10, 'Less than ₦1M': 0, '₦1M – ₦5M': 3, '₦5M – ₦10M': 6, '₦10M – ₦20M': 8 })[answers.savings] || 0, max: 10 },
    { label: 'Skills & Certs',     score: 0, max: 10 },
  ]

  return (
    <>
      <Head><title>Your Migration Report — JapaLearn AI</title></Head>
      <div className="min-h-screen bg-slate-50">

        {/* Top bar */}
        <div className="border-b border-slate-200 bg-white sticky top-0 z-10">
          <div className="max-w-2xl mx-auto px-5 h-14 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
                <Globe2 size={13} className="text-white" />
              </div>
              <span className="font-bold text-sm text-slate-900">JapaLearn AI</span>
            </div>
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 text-sm font-medium transition-colors"
            >
              <RotateCcw size={13} /> Retake quiz
            </button>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-5 py-10 space-y-4">

          <div>
            <p className="text-indigo-600 text-xs font-semibold uppercase tracking-widest mb-1">Migration Readiness Report</p>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Your personalised assessment</h1>
          </div>

          {/* Score card */}
          <div className={`rounded-2xl border ${fc.border} ${fc.bg} overflow-hidden shadow-card`}>
            <div className="px-6 py-6 flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-xs uppercase tracking-widest mb-2">Readiness Score</p>
                <div className={`text-6xl font-black ${fc.color} leading-none`}>{score}</div>
                <div className="text-slate-400 text-sm mt-1">out of 100</div>
              </div>
              <div className="text-right">
                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border ${fc.border} ${fc.bg} ${fc.color} mb-3`}>
                  <TrendingUp size={13} /> {fc.label}
                </div>
                <p className="text-slate-500 text-xs max-w-[160px] leading-relaxed">
                  {flag === 'green' && 'You meet the baseline for your target route.'}
                  {flag === 'yellow' && '1–2 key gaps to close before applying.'}
                  {flag === 'red' && 'Focus on urgent gaps — fixable in 12–18 months.'}
                </p>
              </div>
            </div>
            <div className="px-6 py-3 border-t border-slate-200 bg-white">
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className={`h-2 rounded-full transition-all duration-700 ${fc.bar}`} style={{ width: `${score}%` }} />
              </div>
            </div>
          </div>

          {/* Recommended Route */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-card">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
                <Map size={14} className="text-indigo-600" />
              </div>
              <span className="text-slate-500 text-xs font-semibold uppercase tracking-widest">Recommended Route</span>
            </div>
            <div className="text-slate-900 font-bold text-lg mb-1">{answers.destination} — {recommendation.route}</div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-indigo-600 font-semibold text-sm">Est. Cost: {recommendation.cost}</span>
              <span className="text-slate-300">·</span>
              <span className="text-slate-500 text-sm">{answers.segment}</span>
              {answers.education && <><span className="text-slate-300">·</span><span className="text-slate-500 text-sm">{answers.education}</span></>}
            </div>
          </div>

          {/* Score Breakdown */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
                <BarChart3 size={14} className="text-indigo-600" />
              </div>
              <span className="text-slate-500 text-xs font-semibold uppercase tracking-widest">Score Breakdown</span>
            </div>
            <div className="space-y-4">
              {scoreBreakdown.map((item, i) => {
                const Icon = breakdownIcons[i]
                const pct = Math.round((item.score / item.max) * 100)
                return (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <Icon size={13} className="text-slate-400 shrink-0" />
                        <span className="text-slate-700 text-sm font-medium">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold ${item.score === 0 ? 'text-rose-500' : 'text-slate-500'}`}>{item.score}/{item.max}</span>
                        {item.score === 0 && <span className="text-xs text-rose-600 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded font-semibold">Gap</span>}
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-500 ${item.score === 0 ? 'bg-rose-200' : fc.bar}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Action Plan */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
                <CheckCircle2 size={14} className="text-indigo-600" />
              </div>
              <span className="text-slate-500 text-xs font-semibold uppercase tracking-widest">Your Action Plan</span>
            </div>
            <div className="space-y-3">
              {nextSteps.map((step, i) => {
                const pc = priorityConfig[step.priority]
                const Icon = pc.icon
                return (
                  <div key={i} className={`flex items-start gap-3 rounded-xl p-3.5 border ${pc.bg} ${pc.border}`}>
                    <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                      <Icon size={12} className={pc.color} />
                      <span className={`text-xs font-bold ${pc.color}`}>{step.priority}</span>
                    </div>
                    <p className="text-slate-700 text-sm leading-relaxed">{step.text}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-indigo-600 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-1.5">Save your report. Start your curriculum.</h2>
            <p className="text-indigo-200 text-sm mb-5 leading-relaxed">
              Create a free account to access your personalised {answers.destination} step-by-step curriculum and track your progress.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => router.push(`/signup?answers=${encodeURIComponent(JSON.stringify(answers))}&score=${score}`)}
                className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-indigo-600 font-semibold py-3 px-5 rounded-xl transition-all text-sm shadow-card"
              >
                Create Free Account <ArrowRight size={15} />
              </button>
              <button
                onClick={() => router.push('/')}
                className="flex items-center justify-center gap-2 text-indigo-200 hover:text-white text-sm font-medium px-5 py-3 rounded-xl border border-white/20 hover:border-white/40 transition-all"
              >
                <RotateCcw size={13} /> Retake quiz
              </button>
            </div>
          </div>

          <p className="text-center text-slate-400 text-xs pb-4">
            Not legal advice · Not a visa agency · JapaLearn AI is an educational tool
          </p>
        </div>
      </div>
    </>
  )
}
