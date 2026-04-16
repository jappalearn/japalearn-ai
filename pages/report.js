import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { getAppUrl } from '../lib/urls'
import { ArrowRight } from 'lucide-react'
import Logo from '../lib/Logo'
import { getScoreFlag, calculateScoreBreakdown } from '../lib/quizData'

const PRIMARY = '#3b75ff'

const REPORT_LABEL_MAP = {
  Experience: 'Work Experience',
  Language: 'Language Test',
  Age: 'Age Factor',
  Savings: 'Financial Readiness',
  Profile: 'Skills & Certs',
  Education: 'Education',
  Academic: 'Academic Strength',
}

const LOADING_STEPS = [
  { text: 'Analysing your profile…',          sub: 'Reviewing your experience, education and background' },
  { text: 'Calculating your readiness score…', sub: 'Weighing language, savings, age and qualification factors' },
  { text: 'Finalising your report…',           sub: 'Almost ready — pulling it all together for you' },
]

function DonutChart({ score, color }) {
  const radius = 60
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  return (
    <svg width="160" height="160" viewBox="0 0 160 160">
      <circle cx="80" cy="80" r={radius} fill="none" stroke="#E3E9F3" strokeWidth="14" />
      <circle
        cx="80" cy="80" r={radius} fill="none"
        stroke={color} strokeWidth="14"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 80 80)"
        style={{ transition: 'stroke-dashoffset 1s ease' }}
      />
      <text x="80" y="74" textAnchor="middle" style={{ fontSize: '26px', fontWeight: 700, fill: '#0f1720', fontFamily: 'DM Sans, sans-serif' }}>{score}%</text>
      <text x="80" y="96" textAnchor="middle" style={{ fontSize: '12px', fill: color, fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
        {score >= 70 ? 'Strong' : score >= 45 ? 'Moderate' : 'Early Stage'}
      </text>
    </svg>
  )
}

export default function Report() {
  const router = useRouter()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [stepIndex, setStepIndex] = useState(0)
  const [barWidth, setBarWidth] = useState(0)

  useEffect(() => {
    if (!router.isReady) return
    const { score: queryScore, answers: queryAnswers } = router.query
    if (!queryScore || !queryAnswers) { router.push('/'); return }

    const stepMs = 1200
    let step = 0
    const stepTimer = setInterval(() => {
      step += 1
      if (step < LOADING_STEPS.length) setStepIndex(step)
      else clearInterval(stepTimer)
    }, stepMs)

    const barTimer = setInterval(() => {
      setBarWidth(w => { if (w >= 95) { clearInterval(barTimer); return 95 }; return w + 1.2 })
    }, 50)

    setTimeout(() => {
      setBarWidth(100)
      setTimeout(() => {
        setData({
          score: parseInt(queryScore),
          answers: JSON.parse(queryAnswers),
        })
        setLoading(false)
      }, 300)
    }, LOADING_STEPS.length * stepMs)

    return () => { clearInterval(stepTimer); clearInterval(barTimer) }
  }, [router.isReady])

  if (loading) {
    const step = LOADING_STEPS[stepIndex]
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-5" style={{ fontFamily: 'Inter, sans-serif' }}>
        <Link href="/" className="flex items-center gap-2.5 mb-16 hover:opacity-80 transition-opacity">
          <Logo size={32} />
          <span className="font-bold text-[#000000] text-base" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            JapaLearn <span style={{ color: PRIMARY }}>AI</span>
          </span>
        </Link>

        <div className="relative mb-10">
          <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{ border: `4px solid #e6efff` }}>
            <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ border: `2px solid #c8d9ff` }}>
              <div className="w-6 h-6 rounded-full" style={{ background: PRIMARY }} />
            </div>
          </div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent animate-spin" style={{ borderTopColor: PRIMARY }} />
        </div>

        <div className="text-center mb-10 max-w-sm">
          <p className="font-semibold text-lg text-[#0f1720] mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>{step.text}</p>
          <p className="text-[#5f6776] text-sm leading-relaxed">{step.sub}</p>
        </div>

        <div className="w-full max-w-xs">
          <div className="w-full rounded-full h-1.5 mb-3" style={{ background: '#e3e9f3' }}>
            <div className="h-1.5 rounded-full transition-all duration-300" style={{ width: `${barWidth}%`, background: PRIMARY }} />
          </div>
          <div className="flex justify-between text-xs text-[#5f6776]">
            <span>Calculating your score</span>
            <span>{Math.round(barWidth)}%</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-8">
          {LOADING_STEPS.map((_, i) => (
            <div key={i} className="rounded-full transition-all duration-300" style={{
              width: i === stepIndex ? '24px' : '6px', height: '6px',
              background: i === stepIndex ? PRIMARY : i < stepIndex ? '#c8d9ff' : '#e3e9f3',
            }} />
          ))}
        </div>
      </div>
    )
  }

  if (!data) return null

  const { score, answers } = data
  const flag = getScoreFlag(score)
  const scoreColor = flag === 'green' ? '#22C55E' : PRIMARY
  const candidateLabel = flag === 'green' ? 'Strong Candidate' : flag === 'yellow' ? 'Moderate Candidate' : 'Early Stage Candidate'
  const flagBg = flag === 'green' ? '#dcfce7' : '#e6efff'
  const flagText = flag === 'green' ? '#15803d' : PRIMARY

  const breakdown = calculateScoreBreakdown(answers).map(item => ({
    label: REPORT_LABEL_MAP[item.label] || item.label,
    score: item.score,
    max: item.max,
  }))

  return (
    <>
      <Head><title>Your Migration Report — JapaLearn AI</title></Head>
      <div className="min-h-screen bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>

        {/* Navbar */}
        <div className="px-3 sm:px-6 pt-4 sm:pt-6 sticky top-2 sm:top-4 z-50">
          <nav className="mx-auto h-14 sm:h-16 bg-white rounded-[16px] sm:rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.12)] flex items-center justify-between px-4 sm:px-8" style={{ border: '1px solid #e3e9f3' }}>
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0">
              <Logo size={28} />
              <span className="font-bold text-sm sm:text-base text-[#000000]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                JapaLearn <span style={{ color: PRIMARY }}>AI</span>
              </span>
            </Link>
            <button
              onClick={() => { window.location.href = getAppUrl('/signup') + `?answers=${encodeURIComponent(JSON.stringify(answers))}&score=${score}` }}
              className="inline-flex px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95 shadow-[0_4px_12px_rgba(59,117,255,0.25)]"
              style={{ background: PRIMARY }}
            >
              <span className="sm:hidden">Sign up free</span>
              <span className="hidden sm:inline">Create your free account</span>
            </button>
          </nav>
        </div>

        <div className="max-w-[800px] mx-auto px-4 sm:px-6 py-8 sm:py-12">

          {/* Page title */}
          <div className="text-center mb-10">
            <h1 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: 'clamp(28px, 4vw, 44px)', color: '#0f1720', marginBottom: '8px', letterSpacing: '-0.5px' }}>
              Your Migration Report Is Ready
            </h1>
            <p style={{ color: '#5f6776', fontSize: '16px' }}>Here&apos;s your readiness score based on your profile</p>
          </div>

          {/* Score card */}
          <div className="bg-white rounded-2xl p-5 sm:p-8 mb-4" style={{ border: '1px solid #e3e9f3', boxShadow: '0 2px 16px rgba(59,117,255,0.06)' }}>
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-start">
              <div className="shrink-0">
                <DonutChart score={score} color={scoreColor} />
              </div>
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-3 text-xs font-semibold" style={{ background: flagBg, color: flagText }}>
                  {candidateLabel}
                </div>
                <h2 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: 'clamp(20px, 3vw, 28px)', color: '#0f1720', marginBottom: '8px', letterSpacing: '-0.3px' }}>
                  {answers.destination} Migration Readiness
                </h2>
                <p style={{ color: '#5f6776', fontSize: '14px', lineHeight: '22px' }}>
                  Sign up to get your full AI analysis — personalised visa route, cost estimate, gaps, and step-by-step curriculum.
                </p>
              </div>
            </div>
          </div>

          {/* Score Breakdown */}
          <div className="bg-white rounded-2xl p-6 mb-6" style={{ border: '1px solid #e3e9f3', boxShadow: '0 2px 8px rgba(59,117,255,0.04)' }}>
            <h3 style={{ fontWeight: 700, fontSize: '18px', color: '#0f1720', marginBottom: '20px', fontFamily: 'DM Sans, sans-serif' }}>Score Breakdown</h3>
            <div className="space-y-5">
              {breakdown.map(item => {
                const pct = Math.round((item.score / item.max) * 100)
                return (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span style={{ fontWeight: 600, fontSize: '14px', color: '#0f1720' }}>{item.label}</span>
                      <span style={{ fontSize: '13px', color: '#5f6776' }}>{item.score}/{item.max}</span>
                    </div>
                    <div className="w-full rounded-full h-2" style={{ background: '#e3e9f3' }}>
                      <div className="h-2 rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: pct >= 70 ? '#22c55e' : PRIMARY }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* CTA */}
          <div className="flex justify-center">
            <button
              onClick={() => { window.location.href = getAppUrl('/signup') + `?answers=${encodeURIComponent(JSON.stringify(answers))}&score=${score}` }}
              className="transition-all hover:opacity-90 flex items-center justify-center gap-2"
              style={{ padding: '16px 48px', borderRadius: '99px', background: PRIMARY, color: '#FFFFFF', fontSize: '16px', fontWeight: 600, fontFamily: 'DM Sans, sans-serif' }}
            >
              See my full AI analysis <ArrowRight size={16} />
            </button>
          </div>

          <p className="text-center text-xs mt-8 pb-4" style={{ color: '#5f6776' }}>
            Not legal advice · Not a visa agency · JapaLearn AI is an educational tool
          </p>
        </div>
      </div>
    </>
  )
}
