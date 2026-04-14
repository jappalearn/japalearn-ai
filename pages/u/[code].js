import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { supabase } from '../../lib/supabase'
import { calculateScoreBreakdown, calculateScore } from '../../lib/quizData'
import ReferralProfile from '../../components/profile/ReferralProfile'

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
function generateNextSteps(answers, breakdown, firstName) {
  const steps = []
  const lang = answers.language || ''
  const savings = answers.savings || ''
  const exp = answers.experience || ''
  const dest = answers.destination || 'your destination'

  const langScore = breakdown.find(b => b.label === 'Language')?.score || 0
  const expScore = breakdown.find(b => b.label === 'Experience')?.score || 0
  const savScore = breakdown.find(b => b.label === 'Savings')?.score || 0

  if (!lang || lang === 'Not taken') {
    steps.push({ id: 'ns1', bold: 'Book your IELTS / OET test —', text: ' this is the first requirement for most migration routes. Aim for 7.0+.' })
  } else if (langScore < 10) {
    steps.push({ id: 'ns1', bold: `Retake your language test targeting a higher band —`, text: ` moving to 7.0+ unlocks significantly more ${dest} pathways.` })
  }

  if (expScore < 10) {
    steps.push({ id: 'ns2', bold: 'Build documented work experience —', text: ' each additional year in your field adds meaningful points to your profile.' })
  }

  if (savScore < 6) {
    steps.push({ id: 'ns3', bold: 'Start a dedicated migration savings plan —', text: ` aim for ₦5M–₦10M minimum to clear proof-of-funds requirements for ${dest}.` })
  }

  steps.push({ id: 'ns4', bold: 'Gather your core documents —', text: ' passport, transcripts, certificates, and employer reference letters are required for every route.' })
  steps.push({ id: 'ns5', bold: 'Start your Pathway Curriculum —', text: ` ${firstName} is ready to begin the week-by-week plan specifically for the ${dest} ${answers.segment || 'Skilled Worker'} pathway.` })

  return steps.slice(0, 4)
}

const FLAGS = { Canada: '🇨🇦', UK: '🇬🇧', USA: '🇺🇸', Germany: '🇩🇪', Ireland: '🇮🇪', Australia: '🇦🇺', Netherlands: '🇳🇱', Portugal: '🇵🇹', UAE: '🇦🇪', Singapore: '🇸🇬' }

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
      // 1. Try fetching by referral_code
      let { data: profile } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, referral_code')
        .eq('referral_code', code)
        .maybeSingle()

      // 2. Fallback to lookup by ID if code is a UUID
      if (!profile && code?.length > 30) {
        const { data: profileById } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url, referral_code')
          .eq('id', code)
          .maybeSingle()
        profile = profileById
      }

      if (!profile) { setNotFound(true); setLoading(false); return }

      const userId = profile.id
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
      const rawBreakdown = calculateScoreBreakdown(answers)
      const insights = generateInsights(answers)
      
      const firstName = (profile?.full_name || 'This user').split(' ')[0]
      const nextSteps = generateNextSteps(answers, rawBreakdown, firstName)

      // Map to ReferralProfile expectations
      const labelMap = { Experience: 'Work Experience', Language: 'Language Test', Age: 'Age Factor', Savings: 'Financial Readiness', Profile: 'Skills & Certs', Education: 'Education' }
      const insightMap = { Experience: insights.exp, Education: insights.edu, Language: insights.lang, Age: insights.age, Savings: insights.savings, Profile: insights.certs }
      
      const statusOf = (s, max) => s / max >= 0.7 ? 'Strong Candidate' : s / max >= 0.4 ? 'Moderate Candidate' : 'Early Stage'
      const statusColor = (s) => s.includes('Strong') ? '#10B981' : s.includes('Moderate') ? '#F59E0B' : '#EF4444'

      const dest = answers.destination || 'UK'
      const flag = FLAGS[dest] || '🌍'

      const breakdown = rawBreakdown.map(b => ({
        id: b.label.toLowerCase(),
        label: labelMap[b.label] || b.label,
        score: b.score,
        max: b.max,
        color: statusColor(statusOf(b.score, b.max)),
        insight: insightMap[b.label]
      }))

      const strengths = rawBreakdown.filter(b => b.score / b.max >= 0.7).map(b => ({ id: b.label, label: labelMap[b.label] || b.label }))
      const areasToImprove = rawBreakdown.filter(b => b.score / b.max < 0.7).map(b => ({ id: b.label, label: labelMap[b.label] || b.label }))

      const eligibility = [
        { id: 'lang', label: 'Language', value: answers.language && answers.language !== 'Not taken' ? answers.language : 'Not taken' },
        { id: 'edu', label: 'Education', value: answers.education || '—' },
        { id: 'dest', label: 'Destination', value: `${flag} ${dest}` },
        { id: 'path', label: 'Pathway', value: answers.segment || 'Skilled Migration' },
      ]

      const status = statusOf(score, 100)
      
      const costs = 
        answers.savings?.includes('₦20M') ? "₦2M – ₦5M" :
        answers.savings?.includes('₦10M') ? "₦5M – ₦8M" :
        "₦5M – ₦10M"

      const timeline = [
        { id: 't1', phase: 'Foundation & Language', period: 'Month 1–2', active: score < 40 },
        { id: 't2', phase: 'Skills & Assessment', period: 'Month 3–5', active: score >= 40 && score < 70 },
        { id: 't3', phase: 'Application & Visa', period: 'Month 6–8', active: score >= 70 && score < 90 },
        { id: 't4', phase: 'Relocation', period: 'Month 9–12', active: score >= 90 }
      ]

      const activePhase = timeline.find(t => t.active)?.phase || 'Foundation'

      const pathwayTitle = `${dest} Skilled Worker Visa`

      const profileData = {
        fullName: profile.full_name || 'JapaLearn User',
        avatar_url: profile.avatar_url,
        profession: answers.segment || 'Professional',
        education: answers.education || 'Graduate',
        status,
        statusColor: statusColor(status),
        score,
        destination: dest,
        pathwayTitle: pathwayTitle,
        pathwaySubtitle: '',
        summary: `${firstName} is looking to migrate to ${dest} via the ${pathwayTitle}. This report shows their migration readiness. ${score >= 70 ? 'They have cleared the primary relocation hurdles and are in a strong position to begin applications.' : score >= 40 ? 'They are well-positioned but need to finalize specific requirements like language tests or registrations.' : 'They are in the early stages and should focus on building their core credentials and relocation funds.'}`,
        strengths: strengths.length > 0 ? strengths : [{id: 'new', label: 'Migration Intent'}],
        areasToImprove: areasToImprove.length > 0 ? areasToImprove : [{id: 'new', label: 'Ready to Apply'}],
        eligibility,
        costRange: costs,
        costNote: dest === 'UK' ? "NHS sponsorship can offset visa costs significantly." : "Proof of funds is essential for this route.",
        timeline,
        phaseText: `${firstName} is currently in the ${activePhase} phase of their journey.`,
        breakdown,
        nextSteps
      }

      setData({ profileData, firstName })
      setLoading(false)
    }
    load()
  }, [router.isReady, code])

  const handleStartAssessment = () => {
    if (referrerId) localStorage.setItem('referral_from', referrerId)
    router.push('/signup?ref=' + (data?.profileData?.fullName || 'referral'))
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#F7F9FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid #E4E8FF', borderTopColor: '#1E4DD7', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
        <p style={{ color: '#82858A', fontSize: 13 }}>Loading {code?.slice(0, 8)}...</p>
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

  return (
    <>
      <Head>
        <title>{data.firstName}'s Migration Profile | JapaLearn AI</title>
        <meta name="description" content={`See ${data.firstName}'s UK migration readiness score and get your own personalised track on JapaLearn AI.`} />
      </Head>
      <ReferralProfile profileData={data.profileData} onSignUp={handleStartAssessment} />
    </>
  )
}
