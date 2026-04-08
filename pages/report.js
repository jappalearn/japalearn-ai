import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { FileText, MapPin, BookOpen, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react'
import Logo from '../lib/Logo'
import { getScoreFlag, normaliseSegment } from '../lib/quizData'

const PRIMARY = '#3b75ff'
const PRIMARY_DARK = '#2452cc'

const ROUTE_RECOMMENDATIONS = {
  Canada: {
    'Tech Professional':           { route: 'Express Entry — Federal Skilled Worker', cost: '₦8M – ₦14M', timeline: [['Preparation','Month 1–3'],['Testing & Docs','Month 3–6'],['Application','Month 6–12'],['Settlement','Month 12–18']] },
    'Career Professional':         { route: 'Express Entry — Federal Skilled Worker', cost: '₦8M – ₦14M', timeline: [['Preparation','Month 1–3'],['Testing & Docs','Month 3–6'],['Application','Month 6–12'],['Settlement','Month 12–18']] },
    'Healthcare Worker':           { route: 'Express Entry + Healthcare Streams',     cost: '₦9M – ₦16M', timeline: [['Preparation','Month 1–3'],['Testing & Docs','Month 3–6'],['Application','Month 6–12'],['Settlement','Month 12–18']] },
    'Student or Post-Grad':        { route: 'Study Permit → PGWP → PR',              cost: '₦12M – ₦25M', timeline: [['Preparation','Month 1–3'],['Testing & Docs','Month 3–6'],['Application','Month 6–12'],['Settlement','Month 12–18']] },
    'Freelancer or Remote Worker': { route: 'Express Entry — Federal Skilled Worker', cost: '₦8M – ₦14M', timeline: [['Preparation','Month 1–3'],['Testing & Docs','Month 3–6'],['Application','Month 6–12'],['Settlement','Month 12–18']] },
    default:                       { route: 'Express Entry — Federal Skilled Worker', cost: '₦8M – ₦14M', timeline: [['Preparation','Month 1–3'],['Testing & Docs','Month 3–6'],['Application','Month 6–12'],['Settlement','Month 12–18']] },
  },
  UK: {
    'Tech Professional':    { route: 'Global Talent Visa / Skilled Worker', cost: '₦5M – ₦10M', timeline: [['Preparation','Month 1–3'],['Testing & Docs','Month 3–6'],['Application','Month 6–9'],['Settlement','Month 9–12']] },
    'Healthcare Worker':    { route: 'Health & Care Worker Visa',           cost: '₦4M – ₦8M',  timeline: [['Preparation','Month 1–3'],['Testing & Docs','Month 3–6'],['Application','Month 6–9'],['Settlement','Month 9–12']] },
    'Student or Post-Grad': { route: 'UK Student Visa (Tier 4)',            cost: '₦4M – ₦12M', timeline: [['Preparation','Month 1–3'],['Testing & Docs','Month 3–6'],['Application','Month 6–12'],['Settlement','Month 12–18']] },
    'Career Professional':  { route: 'Skilled Worker Visa',                 cost: '₦5M – ₦10M', timeline: [['Preparation','Month 1–3'],['Testing & Docs','Month 3–6'],['Application','Month 6–9'],['Settlement','Month 9–12']] },
    default:                { route: 'Skilled Worker Visa',                 cost: '₦5M – ₦10M', timeline: [['Preparation','Month 1–3'],['Testing & Docs','Month 3–6'],['Application','Month 6–9'],['Settlement','Month 9–12']] },
  },
  Germany: {
    'Tech Professional':           { route: 'EU Blue Card / Skilled Immigration Act', cost: '₦7M – ₦12M', timeline: [['Preparation','Month 1–3'],['Testing & Docs','Month 3–6'],['Application','Month 6–12'],['Settlement','Month 12–18']] },
    'Career Professional':         { route: 'EU Blue Card',                           cost: '₦7M – ₦12M', timeline: [['Preparation','Month 1–3'],['Testing & Docs','Month 3–6'],['Application','Month 6–12'],['Settlement','Month 12–18']] },
    'Student or Post-Grad':        { route: 'Student Visa → Job Seeker',              cost: '₦8M – ₦15M', timeline: [['Preparation','Month 1–3'],['Testing & Docs','Month 3–6'],['Application','Month 6–12'],['Settlement','Month 12–18']] },
    'Freelancer or Remote Worker': { route: 'Germany Freelance Visa',                 cost: '₦5M – ₦9M',  timeline: [['Preparation','Month 1–3'],['Testing & Docs','Month 3–6'],['Application','Month 6–9'],['Settlement','Month 9–12']] },
    default:                       { route: 'EU Blue Card',                           cost: '₦7M – ₦12M', timeline: [['Preparation','Month 1–3'],['Testing & Docs','Month 3–6'],['Application','Month 6–12'],['Settlement','Month 12–18']] },
  },
  Australia: {
    'Student or Post-Grad': { route: 'Student Visa → Graduate Visa (485)', cost: '₦12M – ₦22M', timeline: [['Preparation','Month 1–3'],['Testing & Docs','Month 3–6'],['Application','Month 6–12'],['Settlement','Month 12–18']] },
    default:                { route: 'Skilled Nominated Visa (190)',        cost: '₦10M – ₦18M', timeline: [['Preparation','Month 1–3'],['Testing & Docs','Month 3–6'],['Application','Month 6–12'],['Settlement','Month 12–18']] },
  },
  Ireland: {
    'Student or Post-Grad': { route: 'Study → 2-Year Stay Back',         cost: '₦10M – ₦18M', timeline: [['Preparation','Month 1–3'],['Testing & Docs','Month 3–6'],['Application','Month 6–12'],['Settlement','Month 12–18']] },
    default:                { route: 'Critical Skills Employment Permit', cost: '₦6M – ₦11M',  timeline: [['Preparation','Month 1–3'],['Testing & Docs','Month 3–6'],['Application','Month 6–9'],['Settlement','Month 9–12']] },
  },
  Portugal: {
    'Freelancer or Remote Worker': { route: 'D8 Digital Nomad Visa', cost: '₦3M – ₦6M', timeline: [['Preparation','Month 1–2'],['Testing & Docs','Month 2–4'],['Application','Month 4–6'],['Settlement','Month 6–9']] },
    default:                       { route: 'Job Seeker Visa',       cost: '₦4M – ₦8M', timeline: [['Preparation','Month 1–3'],['Testing & Docs','Month 3–5'],['Application','Month 5–8'],['Settlement','Month 8–12']] },
  },
  UAE: { default: { route: 'Employment Visa / Freelance Permit', cost: '₦2M – ₦5M', timeline: [['Preparation','Month 1–2'],['Testing & Docs','Month 2–3'],['Application','Month 3–5'],['Settlement','Month 5–8']] } },
}

function getRecommendation(destination, segment) {
  const routes = ROUTE_RECOMMENDATIONS[destination]
  if (!routes) return { route: 'Skilled Worker / Employment Visa', cost: '₦5M – ₦12M', timeline: [['Preparation','Month 1–3'],['Testing & Docs','Month 3–6'],['Application','Month 6–12'],['Settlement','Month 12–18']] }
  return routes[segment] || routes['default'] || { route: 'Skilled Worker / Employment Visa', cost: '₦5M – ₦12M', timeline: [['Preparation','Month 1–3'],['Testing & Docs','Month 3–6'],['Application','Month 6–12'],['Settlement','Month 12–18']] }
}

function getScoreBreakdown(answers) {
  return [
    { label: 'Work Experience', score: ({'0–1':4,'2–3':10,'4–6':18,'7–10':25,'10+':30,'0 – 1 year':4,'2 – 3 years':10,'4 – 6 years':18,'7 – 10 years':25,'10+ years':30})[answers.experience]||0, max:30, note: 'Limited experience means you may benefit more from a study pathway first.' },
    { label: 'Education',       score: ({'High School':4,'Diploma':8,"Bachelor's":14,"Master's":18,'PhD':20,"Bachelor's Degree (BSc / BA / MBBS / BPharm / LLB etc.)":14,"Master's Degree (MSc / MBA / MA / LLM etc.)":18,'PhD / Doctorate':20,'High School / WAEC / NECO':4,'Diploma / OND / NCE':8})[answers.education]||0, max:20, note: 'Higher education levels unlock more immigration pathways.' },
    { label: 'Language Test',   score: ({'Not taken':0,'Scheduled':2,'IELTS <6.0':4,'IELTS 6.0–6.5':10,'IELTS 7.0–8.0':16,'IELTS 8.0+':20,'CELPIP':16,'TOEFL':14,'IELTS Academic — below 6.0':4,'IELTS Academic — 6.0 to 6.5':10,'IELTS Academic — 7.0 to 7.5':16,'IELTS Academic — 8.0+':20,'OET (Occupational English Test) — for healthcare':18,'CELPIP — for Canada':16,'Registered / scheduled':2})[answers.language]||0, max:20, note: 'IELTS 6.0–6.5 meets minimum thresholds but improving to 7.0+ significantly boosts eligibility.' },
    { label: 'Age Factor',      score: ({'Under 20':2,'20–24':6,'25–30':10,'31–35':10,'36–40':7,'41–45':4,'46+':2,'20 – 24':6,'25 – 30':10,'31 – 35':10,'36 – 40':7,'41 – 45':4})[answers.age]||0, max:10, note: 'Age factor is fixed based on your profile.' },
    { label: 'Financial Readiness', score: ({'< ₦1M':0,'₦1M–5M':3,'₦5M–10M':6,'₦10M–20M':8,'₦20M+':10,'Less than ₦1M':0,'₦1M – ₦5M':3,'₦5M – ₦10M':6,'₦10M – ₦20M':8,'₦20M+':10})[answers.savings]||0, max:10, note: '₦5M–10M covers some routes but you may need more depending on your destination.' },
    { label: 'Skills & Certs',  score: 0, max:10, note: 'Certifications, job offers, and licensing progress add valuable points.' },
  ]
}

function getStrengthsAndGaps(breakdown) {
  const strengths = breakdown.filter(b => b.score >= b.max * 0.6).map(b => b.label)
  const gaps = breakdown.filter(b => b.score < b.max * 0.4).map(b => b.label)
  return { strengths, gaps }
}

function getNextSteps(answers, score) {
  const steps = []
  const flag = getScoreFlag(score)
  if (!answers.language || answers.language === 'Not taken')
    steps.push('Book your IELTS test at an approved British Council centre — aim for 7.0+')
  if (answers.savings === '< ₦1M' || answers.savings === 'Less than ₦1M')
    steps.push('Start a dedicated migration savings plan. Most routes require minimum ₦3M–₦8M proof of funds.')
  steps.push('Request reference letters from current and past employers')
  steps.push('Gather all required documents: passport, transcripts, certificates')
  if (flag === 'green')
    steps.push('Your profile is strong. Start your application process now.')
  else
    steps.push('Create your JapaLearn account to access your personalised curriculum')
  return steps.slice(0, 4)
}

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

const LOADING_STEPS = [
  { text: 'Analysing your profile…',            sub: 'Reviewing your experience, education and background' },
  { text: 'Matching you with the best pathway…', sub: 'Comparing your profile against 40+ immigration routes' },
  { text: 'Calculating your readiness score…',   sub: 'Weighing language, savings, age and qualification factors' },
  { text: 'Building your action plan…',          sub: 'Identifying your strongest gaps and quick wins' },
  { text: 'Finalising your report…',             sub: 'Almost ready — pulling it all together for you' },
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
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-5" style={{ fontFamily: 'Inter, sans-serif' }}>
        <Link href="/" className="flex items-center gap-2.5 mb-16 hover:opacity-80 transition-opacity">
          <Logo size={32} />
          <span className="font-bold text-[#0f1720] text-base" style={{ fontFamily: 'DM Sans, sans-serif' }}>
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
            <span>Personalising your report</span>
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
  const recommendation = getRecommendation(answers.destination, normaliseSegment(answers.segment))
  const breakdown = getScoreBreakdown(answers)
  const { strengths, gaps } = getStrengthsAndGaps(breakdown)
  const nextSteps = getNextSteps(answers, score)

  const scoreColor = flag === 'green' ? '#22C55E' : flag === 'yellow' ? '#3b75ff' : '#3b75ff'
  const candidateLabel = flag === 'green' ? 'Strong Candidate' : flag === 'yellow' ? 'Moderate Candidate' : 'Early Stage Candidate'
  const flagBg = flag === 'green' ? '#dcfce7' : '#e6efff'
  const flagText = flag === 'green' ? '#15803d' : PRIMARY

  const eligibilityRows = [
    ['Language', answers.language && answers.language !== 'Not taken' ? answers.language : 'IELTS 6.5+ minimum (CLB 7 for Canada)'],
    ['Education', answers.education || "Bachelor's degree or equivalent (ECA required)"],
    ['Docs', '8 documents required'],
  ]

  return (
    <>
      <Head><title>Your Migration Report — JapaLearn AI</title></Head>
      <div className="min-h-screen bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>

        {/* Navbar */}
        <div className="px-3 sm:px-6 pt-4 sm:pt-6 sticky top-2 sm:top-4 z-50">
          <nav className="mx-auto h-14 sm:h-16 bg-white rounded-[16px] sm:rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.12)] flex items-center justify-between px-4 sm:px-8" style={{ border: '1px solid #e3e9f3' }}>
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0">
              <Logo size={28} />
              <span className="font-bold text-sm sm:text-base text-[#0f1720]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                JapaLearn <span style={{ color: PRIMARY }}>AI</span>
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-7">
              {['Features','Pricing','Learn','Blogs','FAQs'].map(item => (
                <button key={item} className="text-[#0f1720] font-medium text-sm hover:opacity-60 transition-opacity">{item}</button>
              ))}
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Link href="/login" className="text-[#0f1720] font-medium text-sm hover:opacity-60 transition-opacity">Sign in</Link>
              <Link href="/signup" className="hidden sm:inline-flex px-5 py-2 rounded-full text-sm font-medium text-white transition-all hover:opacity-90" style={{ background: PRIMARY }}>
                Get Started
              </Link>
            </div>
          </nav>
        </div>

        <div className="max-w-[800px] mx-auto px-4 sm:px-6 py-8 sm:py-12">

          {/* Page title */}
          <div className="text-center mb-10">
            <h1 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: 'clamp(28px, 4vw, 44px)', color: '#0f1720', marginBottom: '8px', letterSpacing: '-0.5px' }}>
              Your Migration Report Is Ready
            </h1>
            <p style={{ color: '#5f6776', fontSize: '16px' }}>Here&apos;s what our AI assessment found about your profile</p>
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
                <h2 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: 'clamp(20px, 3vw, 30px)', color: '#0f1720', marginBottom: '8px', letterSpacing: '-0.3px' }}>
                  {answers.destination} — {recommendation.route}
                </h2>
                <p style={{ color: '#5f6776', fontSize: '14px', lineHeight: '22px' }}>
                  Based on your quiz profile, this is your best-fit migration pathway.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-6 flex flex-col sm:flex-row gap-8" style={{ borderTop: '1px solid #e3e9f3' }}>
              <div>
                <p style={{ fontSize: '11px', fontWeight: 600, color: '#5f6776', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>STRENGTHS</p>
                <div className="flex flex-wrap gap-2">
                  {strengths.length > 0 ? strengths.map(s => (
                    <span key={s} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0' }}>
                      <CheckCircle size={11} /> {s}
                    </span>
                  )) : (
                    <span className="text-xs" style={{ color: '#5f6776' }}>Complete more steps to earn strengths</span>
                  )}
                </div>
              </div>
              <div>
                <p style={{ fontSize: '11px', fontWeight: 600, color: '#5f6776', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>AREAS TO IMPROVE</p>
                <div className="flex flex-wrap gap-2">
                  {gaps.map(g => (
                    <span key={g} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: '#e6efff', color: PRIMARY, border: '1px solid #c8d9ff' }}>
                      <AlertTriangle size={11} /> {g}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Eligibility + Cost + Timeline + Score Breakdown + Next Steps */}
          <>
              {/* Eligibility + Cost + Timeline */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {[
                  {
                    icon: FileText, label: 'Eligibility',
                    content: (
                      <div className="space-y-3">
                        {eligibilityRows.map(([l, v]) => (
                          <div key={l}>
                            <p style={{ fontSize: '11px', color: '#5f6776', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px' }}>{l}</p>
                            <p style={{ fontSize: '13px', fontWeight: 600, color: '#0f1720' }}>{v}</p>
                          </div>
                        ))}
                      </div>
                    ),
                  },
                  {
                    icon: MapPin, label: 'Estimated Cost',
                    content: (
                      <>
                        <p style={{ fontSize: '28px', fontWeight: 700, color: PRIMARY, marginBottom: '8px', fontFamily: 'DM Sans, sans-serif' }}>{recommendation.cost}</p>
                        <p style={{ fontSize: '12px', color: '#5f6776', lineHeight: '18px' }}>Includes visa fees, proof of funds, and first-year living costs.</p>
                      </>
                    ),
                  },
                  {
                    icon: BookOpen, label: 'Timeline',
                    content: (
                      <div className="space-y-2">
                        {recommendation.timeline.map(([phase, period]) => (
                          <div key={phase} className="flex justify-between items-center">
                            <span style={{ fontSize: '13px', color: '#0f1720' }}>{phase}</span>
                            <span style={{ fontSize: '12px', color: '#5f6776' }}>{period}</span>
                          </div>
                        ))}
                      </div>
                    ),
                  },
                ].map(({ icon: Icon, label, content }) => (
                  <div key={label} className="bg-white rounded-2xl p-5" style={{ border: '1px solid #e3e9f3', boxShadow: '0 2px 8px rgba(59,117,255,0.04)' }}>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#e6efff' }}>
                        <Icon size={15} style={{ color: PRIMARY }} />
                      </div>
                      <span style={{ fontWeight: 600, fontSize: '15px', color: '#0f1720' }}>{label}</span>
                    </div>
                    {content}
                  </div>
                ))}
              </div>

              {/* Full Score Breakdown */}
              <div className="bg-white rounded-2xl p-6 mb-4" style={{ border: '1px solid #e3e9f3', boxShadow: '0 2px 8px rgba(59,117,255,0.04)' }}>
                <h3 style={{ fontWeight: 700, fontSize: '18px', color: '#0f1720', marginBottom: '20px', fontFamily: 'DM Sans, sans-serif' }}>Full Score Breakdown</h3>
                <div className="space-y-5">
                  {breakdown.map(item => {
                    const pct = Math.round((item.score / item.max) * 100)
                    return (
                      <div key={item.label}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span style={{ fontWeight: 600, fontSize: '14px', color: '#0f1720' }}>{item.label}</span>
                          <span style={{ fontSize: '13px', color: '#5f6776' }}>{item.score}/{item.max}</span>
                        </div>
                        <div className="w-full rounded-full h-2 mb-1.5" style={{ background: '#e3e9f3' }}>
                          <div className="h-2 rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: pct >= 70 ? '#22c55e' : PRIMARY }} />
                        </div>
                        <p style={{ fontSize: '12px', color: '#5f6776' }}>{item.note}</p>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-white rounded-2xl p-6 mb-6" style={{ border: '1px solid #e3e9f3', boxShadow: '0 2px 8px rgba(59,117,255,0.04)' }}>
                <h3 style={{ fontWeight: 700, fontSize: '18px', color: '#0f1720', marginBottom: '20px', fontFamily: 'DM Sans, sans-serif' }}>Your Next Steps</h3>
                <div className="space-y-4">
                  {nextSteps.map((step, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: PRIMARY }}>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>{i + 1}</span>
                      </div>
                      <p style={{ fontSize: '14px', color: '#0f1720', lineHeight: '22px', paddingTop: '2px' }}>{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="flex justify-center">
                <button
                  onClick={() => router.push(`/signup?answers=${encodeURIComponent(JSON.stringify(answers))}&score=${score}`)}
                  className="transition-all hover:opacity-90 flex items-center justify-center gap-2"
                  style={{ padding: '16px 48px', borderRadius: '99px', background: PRIMARY, color: '#FFFFFF', fontSize: '16px', fontWeight: 600, fontFamily: 'DM Sans, sans-serif' }}
                >
                  Create my free account <ArrowRight size={16} />
                </button>
              </div>
            </>

          <p className="text-center text-xs mt-8 pb-4" style={{ color: '#5f6776' }}>
            Not legal advice · Not a visa agency · JapaLearn AI is an educational tool
          </p>
        </div>
      </div>
    </>
  )
}
