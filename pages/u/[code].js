import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { supabase } from '../../lib/supabase'
import { calculateScoreBreakdown, calculateScore } from '../../lib/quizData'

// ── Auto-generate insights per score category ─────────────────────────────────
function generateInsights(answers) {
  const edu = answers.education || ''
  const lang = answers.language || ''
  const age = answers.age || ''
  const savings = answers.savings || ''
  const exp = answers.experience || ''
  const dest = answers.destination || 'your destination'

  const eduInsight =
    edu.includes('PhD') ? `A doctoral qualification puts you in the strongest eligibility tier for most ${dest} immigration pathways.` :
    edu.includes("Master") ? `A master's degree opens Skilled Worker and Express Entry routes at the highest tier for ${dest}.` :
    edu.includes("Bachelor") ? `Your degree meets the core qualification requirement for most ${dest} skilled migration pathways.` :
    edu.includes('Diploma') ? `A diploma qualifies you for some routes. Upgrading to a degree significantly widens your options for ${dest}.` :
    `Your current education level may limit direct pathways. Consider a study route or professional certification.`

  const langInsight =
    lang.includes('8.0') ? `An exceptional language score — you exceed requirements for virtually every ${dest} skilled worker route.` :
    lang.includes('7.0') || lang.includes('7.5') ? `Your language score clears the bar for most ${dest} routes including Skilled Worker and Express Entry.` :
    lang.includes('6.0') || lang.includes('6.5') ? `Your score meets minimum thresholds. Moving to 7.0+ would significantly widen your ${dest} route options.` :
    lang.includes('below') || lang.includes('<6') ? `Your current score falls below most visa thresholds. Prioritise language preparation before applying.` :
    lang === 'Not taken' || !lang ? `A language test is required for most ${dest} migration routes. Booking it should be your first step.` :
    lang.includes('OET') ? `OET is accepted for healthcare pathways to the UK, Australia, and Ireland — a strong choice for your profession.` :
    `Your language qualification helps establish eligibility for ${dest} migration routes.`

  const ageInsight =
    (age.includes('25') || age.includes('31')) ? `You're in the optimal age band — full points and no immigration age deductions.` :
    (age.includes('20') || age.includes('24')) ? `Your age is a real asset. Starting your migration journey now maximises your long-term options.` :
    age.includes('36') || age.includes('40') ? `Still within strong territory for most pathways. Acting with focus now maximises your score.` :
    `Some points-based systems apply deductions above 40. Prioritise speed and focus on other high-scoring factors.`

  const savingsInsight =
    savings.includes('₦20M') ? `Your savings comfortably cover application fees, maintenance funds, and relocation costs for ${dest}.` :
    savings.includes('₦10M') ? `Strong financial standing — enough to clear the funds requirement for most ${dest} routes.` :
    savings.includes('₦5M') ? `Covers application fees for most routes. Building to ₦10M+ removes financial risk from your application.` :
    savings.includes('₦1M') ? `Your savings may cover basic fees but most ${dest} routes require ₦5M+ as proof of maintenance funds.` :
    `Building your savings is critical — most routes require a minimum financial threshold to prove you can support yourself.`

  const expInsight =
    exp.includes('10+') ? `Extensive experience places you in the top eligibility tier for senior-track sponsored roles in ${dest}.` :
    exp.includes('7') ? `Strong experience level — qualifies for senior roles and boosts your points across most ${dest} systems.` :
    exp.includes('4') ? `Solid experience that meets mid-tier requirements for most ${dest} Skilled Worker routes.` :
    exp.includes('2') ? `Meets minimum thresholds for most routes. Each additional year of experience adds meaningful points.` :
    `Limited experience may restrict some routes. Consider building experience or exploring a study pathway first.`

  const jobOffer = answers.job_offer || ''
  const certsInsight =
    jobOffer.includes('confirmed') ? `A confirmed job offer is one of the highest-impact factors — it dramatically accelerates your ${dest} timeline.` :
    jobOffer.includes('active') ? `An active job search is underway. Securing a confirmed offer will be your single biggest score boost.` :
    `Securing a job offer from a licensed ${dest} sponsor is your highest-leverage action right now.`

  return { edu: eduInsight, lang: langInsight, age: ageInsight, savings: savingsInsight, exp: expInsight, certs: certsInsight }
}

// ── Auto-generate next steps from quiz gaps ───────────────────────────────────
function generateNextSteps(answers, breakdown) {
  const steps = []
  const lang = answers.language || ''
  const savings = answers.savings || ''
  const exp = answers.experience || ''
  const dest = answers.destination || 'your destination'

  const langScore = breakdown.find(b => b.label === 'Language')?.score || 0
  const expScore = breakdown.find(b => b.label === 'Experience')?.score || 0
  const savScore = breakdown.find(b => b.label === 'Savings')?.score || 0

  if (!lang || lang === 'Not taken') {
    steps.push({ bold: 'Book your IELTS / OET test —', text: ' this is the first requirement for most migration routes. Aim for 7.0+.' })
  } else if (langScore < 10) {
    steps.push({ bold: `Retake your language test targeting a higher band —`, text: ` moving to 7.0+ unlocks significantly more ${dest} pathways.` })
  }

  if (expScore < 10) {
    steps.push({ bold: 'Build documented work experience —', text: ' each additional year in your field adds meaningful points to your profile.' })
  }

  if (savScore < 6) {
    steps.push({ bold: 'Start a dedicated migration savings plan —', text: ` aim for ₦5M–₦10M minimum to clear proof-of-funds requirements for ${dest}.` })
  }

  steps.push({ bold: 'Gather your core documents —', text: ' passport, transcripts, certificates, and employer reference letters are required for every route.' })
  steps.push({ bold: 'Create your JapaLearn account —', text: ' get a personalised week-by-week curriculum built specifically for your pathway to ' + dest + '.' })

  return steps.slice(0, 4)
}

// ── Flags ─────────────────────────────────────────────────────────────────────
const FLAGS = { Canada: '🇨🇦', UK: '🇬🇧', USA: '🇺🇸', Germany: '🇩🇪', Ireland: '🇮🇪', Australia: '🇦🇺', Netherlands: '🇳🇱', Portugal: '🇵🇹', UAE: '🇦🇪', Singapore: '🇸🇬' }

// ── Score ring SVG ────────────────────────────────────────────────────────────
function ScoreRing({ score }) {
  const size = 128, sw = 10, r = (size - sw * 2) / 2
  const circ = 2 * Math.PI * r
  const filled = (score / 100) * circ
  const cx = size / 2, cy = size / 2
  const color = score >= 70 ? '#10B981' : score >= 45 ? '#F59E0B' : '#EF4444'
  const label = score >= 70 ? 'Strong' : score >= 45 ? 'Moderate' : 'Early Stage'
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#EEF2FF" strokeWidth={sw} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"
        strokeDasharray={`${filled} ${circ}`} transform={`rotate(-90 ${cx} ${cy})`} />
      <text x={cx} y={cy - 8} textAnchor="middle" fill="#18181B" fontSize="26" fontWeight="900" fontFamily="DM Sans, sans-serif">{score}%</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill={color} fontSize="11" fontWeight="700" fontFamily="Inter, sans-serif">{label}</text>
    </svg>
  )
}

export default function PublicProfile() {
  const router = useRouter()
  const { code } = router.query
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [referrerId, setReferrerId] = useState(null)

  useEffect(() => {
    if (!router.isReady || !code) return

    const load = async () => {
      // Look up by referral_code — never expose the auth ID in the URL
      const { data: profileByCode } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .eq('referral_code', code)
        .maybeSingle()

      if (!profileByCode) { setNotFound(true); setLoading(false); return }

      const userId = profileByCode.id
      // Store the real user ID (not the code) for referral tracking
      localStorage.setItem('referral_from', userId)
      setReferrerId(userId)

      const { data: quiz } = await supabase
        .from('quiz_results')
        .select('score, answers, destination, segment')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      const answers = quiz?.answers || {}
      const score = quiz?.score || calculateScore(answers)
      const breakdown = calculateScoreBreakdown(answers)
      const insights = generateInsights(answers)
      const nextSteps = generateNextSteps(answers, breakdown)

      const firstName = (profileByCode?.full_name || 'This user').split(' ')[0]
      const initials = firstName.charAt(0).toUpperCase()

      setData({ profile: profileByCode, quiz, answers, score, breakdown, insights, nextSteps, firstName, initials })
      setLoading(false)
    }
    load()
  }, [router.isReady, code])

  const handleStartAssessment = () => {
    if (referrerId) localStorage.setItem('referral_from', referrerId)
    router.push('/quiz')
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#F7F9FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid #E4E8FF', borderTopColor: '#1E4DD7', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
        <p style={{ color: '#82858A', fontSize: 13 }}>Loading profile…</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  if (notFound) return (
    <div style={{ minHeight: '100vh', background: '#F7F9FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ textAlign: 'center', padding: 24 }}>
        <p style={{ fontSize: 18, fontWeight: 700, color: '#18181B', marginBottom: 8, fontFamily: 'DM Sans, sans-serif' }}>Profile not found</p>
        <p style={{ fontSize: 14, color: '#82858A', marginBottom: 24 }}>This profile link may be invalid or has been removed.</p>
        <button onClick={() => router.push('/')} style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #1E4DD7, #3B75FF)', color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Go to JapaLearn</button>
      </div>
    </div>
  )

  const { answers, score, breakdown, insights, nextSteps, firstName, initials } = data
  const dest = answers.destination || '—'
  const flag = FLAGS[dest] || '🌍'
  const segment = answers.segment || '—'
  const scoreColor = score >= 70 ? '#10B981' : score >= 45 ? '#F59E0B' : '#EF4444'

  const labelMap = { Experience: 'Work Experience', Language: 'Language Test', Age: 'Age Factor', Savings: 'Financial Readiness', Profile: 'Skills & Certs', Education: 'Education' }
  const insightMap = { Experience: insights.exp, Education: insights.edu, Language: insights.lang, Age: insights.age, Savings: insights.savings, Profile: insights.certs }
  const statusOf = (score, max) => score / max >= 0.7 ? 'strong' : score / max >= 0.4 ? 'moderate' : 'weak'
  const statusColor = (s) => s === 'strong' ? '#10B981' : s === 'moderate' ? '#F59E0B' : '#EF4444'
  const statusLabel = (s) => s === 'strong' ? 'Strong' : s === 'moderate' ? 'Moderate' : 'Needs work'

  const strengths = breakdown.filter(b => statusOf(b.score, b.max) === 'strong').map(b => ({ id: b.label, label: labelMap[b.label] || b.label }))
  const gaps = breakdown.filter(b => statusOf(b.score, b.max) !== 'strong').map(b => ({ id: b.label, label: labelMap[b.label] || b.label }))

  const eligibilityRows = [
    { label: 'Language', value: answers.language && answers.language !== 'Not taken' ? answers.language : 'Not yet taken' },
    { label: 'Education', value: answers.education || '—' },
    { label: 'Destination', value: `${flag} ${dest}` },
    { label: 'Pathway', value: segment },
  ]

  return (
    <>
      <Head>
        <title>{firstName}'s Migration Profile | JapaLearn AI</title>
        <meta name="description" content={`See ${firstName}'s UK migration readiness score and get your own personalised track on JapaLearn AI.`} />
      </Head>
      <div style={{ minHeight: '100vh', background: '#F7F9FF', fontFamily: 'Inter, sans-serif' }}>

        {/* ── Nav ── */}
        <nav style={{ background: '#FFFFFF', borderBottom: '1px solid #ECEEFF', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 30 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="26" height="26" viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="47" stroke="#1E4DD7" strokeWidth="3.5" fill="white" /><path d="M50 12 L82 30 L82 70 L50 88 L18 70 L18 30 Z" fill="#1E4DD7" /><path d="M50 22 C50 22 47 38 34 50 C47 62 50 78 50 78 C50 78 53 62 66 50 C53 38 50 22 50 22 Z" fill="white" opacity="0.75" /></svg>
            <span style={{ fontWeight: 800, fontSize: 15, color: '#18181B', fontFamily: 'DM Sans, sans-serif' }}>JapaLearn <span style={{ color: '#1E4DD7' }}>AI</span></span>
          </div>
          <button onClick={handleStartAssessment} style={{ padding: '8px 18px', background: 'linear-gradient(135deg, #1E4DD7, #3B75FF)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 14px rgba(30,77,215,0.28)' }}>
            Get My Score →
          </button>
        </nav>

        <main style={{ maxWidth: 720, margin: '0 auto', padding: '32px 20px 80px', boxSizing: 'border-box' }}>

          {/* ── Hero ── */}
          <div style={{ background: 'linear-gradient(135deg, #0F2E99 0%, #1E4DD7 50%, #3B75FF 100%)', borderRadius: 24, padding: '32px 28px', marginBottom: 24, boxShadow: '0 20px 60px rgba(30,77,215,0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
              {/* Avatar */}
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 28, fontWeight: 800, color: '#FFFFFF', fontFamily: 'DM Sans, sans-serif' }}>{initials}</span>
              </div>
              {/* Name + meta */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: '0 0 2px', fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Migration Profile</p>
                <h1 style={{ margin: '0 0 6px', fontSize: 26, fontWeight: 800, color: '#FFFFFF', fontFamily: 'DM Sans, sans-serif', letterSpacing: '-0.5px' }}>{firstName}</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>{flag} {dest}</span>
                  {segment !== '—' && <><span style={{ color: 'rgba(255,255,255,0.3)' }}>·</span><span style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>{segment}</span></>}
                </div>
              </div>
              {/* Score ring */}
              <div style={{ flexShrink: 0 }}>
                <ScoreRing score={score} />
              </div>
            </div>
          </div>

          {/* ── Score Breakdown ── */}
          <div style={{ background: '#FFFFFF', borderRadius: 18, padding: 24, marginBottom: 16, border: '1px solid #E8EEFF', boxShadow: '0 2px 12px rgba(30,77,215,0.06)' }}>
            <h2 style={{ margin: '0 0 20px', fontSize: 15, fontWeight: 700, color: '#18181B', fontFamily: 'DM Sans, sans-serif' }}>Readiness Breakdown</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {breakdown.map(item => {
                const status = statusOf(item.score, item.max)
                const color = statusColor(status)
                const pct = Math.round((item.score / item.max) * 100)
                const insight = insightMap[item.label]
                return (
                  <div key={item.label}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#18181B' }}>{labelMap[item.label] || item.label}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: color + '18', color }}>{statusLabel(status)}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#18181B' }}>{item.score} / {item.max}</span>
                      </div>
                    </div>
                    <div style={{ height: 6, background: '#F0F2FF', borderRadius: 3, overflow: 'hidden', marginBottom: 8 }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: `linear-gradient(90deg, ${color}99, ${color})`, borderRadius: 3 }} />
                    </div>
                    {insight && <p style={{ margin: 0, fontSize: 12, color: '#6B7280', lineHeight: 1.55 }}>{insight}</p>}
                  </div>
                )
              })}
            </div>
          </div>

          {/* ── Strengths + Gaps ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div style={{ background: '#FFFFFF', borderRadius: 16, padding: 20, border: '1px solid #E8EEFF', boxShadow: '0 2px 12px rgba(30,77,215,0.06)' }}>
              <h3 style={{ margin: '0 0 14px', fontSize: 13, fontWeight: 700, color: '#18181B', fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: '#10B981' }}>✓</span> Strengths
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {strengths.length > 0 ? strengths.map(s => (
                  <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', background: '#F0FDF8', borderRadius: 8, border: '1px solid #BBF7D0' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: '#065F46', fontWeight: 500 }}>{s.label}</span>
                  </div>
                )) : <p style={{ fontSize: 12, color: '#82858A', margin: 0 }}>Complete the quiz to see strengths.</p>}
              </div>
            </div>
            <div style={{ background: '#FFFFFF', borderRadius: 16, padding: 20, border: '1px solid #E8EEFF', boxShadow: '0 2px 12px rgba(30,77,215,0.06)' }}>
              <h3 style={{ margin: '0 0 14px', fontSize: 13, fontWeight: 700, color: '#18181B', fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: '#F59E0B' }}>↑</span> To Improve
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {gaps.length > 0 ? gaps.map(g => (
                  <div key={g.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', background: '#FFFBEB', borderRadius: 8, border: '1px solid #FDE68A' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#F59E0B', flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: '#78350F', fontWeight: 500 }}>{g.label}</span>
                  </div>
                )) : <p style={{ fontSize: 12, color: '#82858A', margin: 0 }}>All areas are strong!</p>}
              </div>
            </div>
          </div>

          {/* ── Eligibility ── */}
          <div style={{ background: '#FFFFFF', borderRadius: 18, padding: 24, marginBottom: 16, border: '1px solid #E8EEFF', boxShadow: '0 2px 12px rgba(30,77,215,0.06)' }}>
            <h2 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: '#18181B', fontFamily: 'DM Sans, sans-serif' }}>Profile Overview</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {eligibilityRows.map((row, i) => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < eligibilityRows.length - 1 ? '1px solid #F0F2FF' : 'none' }}>
                  <span style={{ fontSize: 13, color: '#82858A', fontWeight: 500 }}>{row.label}</span>
                  <span style={{ fontSize: 13, color: '#18181B', fontWeight: 600, textAlign: 'right', maxWidth: '60%' }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Next Steps ── */}
          <div style={{ background: 'linear-gradient(135deg, #EBF1FF 0%, #E4EEFF 100%)', borderRadius: 18, padding: 24, marginBottom: 24, border: '1px solid #CDDAFF' }}>
            <h2 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: '#1E4DD7', fontFamily: 'DM Sans, sans-serif' }}>Recommended Next Steps</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {nextSteps.map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'linear-gradient(135deg, #1E4DD7, #3B75FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 11, fontWeight: 700, color: '#fff' }}>{i + 1}</span>
                  <p style={{ margin: 0, fontSize: 14, color: '#2D3A6B', lineHeight: 1.6 }}>
                    <strong style={{ color: '#1E4DD7' }}>{step.bold}</strong>{step.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── CTA ── */}
          <div style={{ background: 'linear-gradient(135deg, #0F2E99, #1E4DD7, #3B75FF)', borderRadius: 20, padding: '32px 28px', textAlign: 'center', boxShadow: '0 20px 60px rgba(30,77,215,0.3)' }}>
            <p style={{ margin: '0 0 4px', fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Inspired by {firstName}'s journey?</p>
            <h2 style={{ margin: '0 0 8px', fontSize: 24, fontWeight: 800, color: '#FFFFFF', fontFamily: 'DM Sans, sans-serif', letterSpacing: '-0.4px' }}>Find out your score</h2>
            <p style={{ margin: '0 0 24px', fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>Take the free 5-minute migration assessment and get your personalised readiness score, pathway, and curriculum.</p>
            <button
              onClick={handleStartAssessment}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px', background: '#FFFFFF', color: '#1E4DD7', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: '0 8px 24px rgba(0,0,0,0.2)', fontFamily: 'Inter, sans-serif' }}
            >
              Start Free Assessment →
            </button>
            <p style={{ margin: '14px 0 0', fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>Free · No account needed to start</p>
          </div>
        </main>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  )
}
