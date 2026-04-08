import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import {
  Globe2, BookOpen, BarChart3, Map, CheckCircle2, LogOut,
  TrendingUp, ChevronDown, ChevronUp, Lock, PlayCircle,
  ArrowRight, Sparkles, CircleCheck, Clock, Wallet, Briefcase,
  RotateCcw, ChevronRight,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { getScoreFlag } from '../lib/quizData'

function Navbar({ user, onSignOut }) {
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
      <div className="max-w-5xl mx-auto px-5 h-15 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
            <Globe2 size={15} className="text-white" />
          </div>
          <span className="font-bold text-sm text-slate-900 tracking-tight">JapaLearn <span className="text-indigo-600">AI</span></span>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-full px-3 py-1.5">
            <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
              {(user?.email || 'U')[0].toUpperCase()}
            </div>
            <span className="text-slate-600 text-xs max-w-[140px] truncate">{user?.email}</span>
          </div>
          <button
            onClick={onSignOut}
            className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 text-sm transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-100 font-medium"
          >
            <LogOut size={14} /> <span className="hidden sm:block">Sign out</span>
          </button>
        </div>
      </div>
    </nav>
  )
}

function TabBtn({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
        active ? 'bg-indigo-600 text-white shadow-btn' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
      }`}
    >
      <Icon size={15} /> {label}
    </button>
  )
}

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [quizResult, setQuizResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

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
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-sm">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const score = quizResult?.score || 0
  const answers = quizResult?.answers || {}
  const flag = getScoreFlag(score)
  const firstName = (profile?.full_name || user?.email || '').split(/[\s@]/)[0]
  const displayName = firstName.charAt(0).toUpperCase() + firstName.slice(1)

  const flagConfig = {
    green:  { label: 'Strong Profile',   color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', bar: 'bg-emerald-500' },
    yellow: { label: 'Building Profile', color: 'text-amber-600',   bg: 'bg-amber-50',   border: 'border-amber-200',  bar: 'bg-amber-500'   },
    red:    { label: 'Early Stage',      color: 'text-rose-600',    bg: 'bg-rose-50',    border: 'border-rose-200',   bar: 'bg-rose-500'    },
  }
  const fc = flagConfig[flag]

  const tabs = [
    { id: 'overview',   label: 'Overview',   icon: BarChart3 },
    { id: 'curriculum', label: 'Curriculum', icon: BookOpen  },
    { id: 'plan',       label: 'My Plan',    icon: Map       },
  ]

  return (
    <>
      <Head><title>Dashboard — JapaLearn AI</title></Head>
      <div className="min-h-screen bg-slate-50">
        <Navbar user={user} onSignOut={handleSignOut} />

        <div className="max-w-5xl mx-auto px-5 py-8">
          <div className="mb-7">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome back, {displayName}</h1>
            <p className="text-slate-500 mt-1 text-sm">
              {answers.destination ? `Your migration to ${answers.destination} — let's keep moving.` : 'Start by taking the free migration quiz.'}
            </p>
          </div>

          {/* Score banner */}
          {quizResult ? (
            <div className={`rounded-2xl border ${fc.border} ${fc.bg} p-5 mb-7 shadow-card`}>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-slate-500 text-xs uppercase tracking-widest mb-1">Readiness Score</p>
                    <div className={`text-4xl font-black ${fc.color} leading-none`}>
                      {score}<span className="text-lg font-normal text-slate-400 ml-1">/100</span>
                    </div>
                    <div className={`text-xs font-semibold mt-1.5 ${fc.color}`}>{fc.label}</div>
                  </div>
                  <div className="hidden sm:block w-px h-12 bg-slate-200" />
                  <div className="hidden sm:block">
                    <div className="text-slate-400 text-xs mb-0.5">Destination</div>
                    <div className="text-slate-900 font-semibold text-sm">{answers.destination || '—'}</div>
                    <div className="text-slate-400 text-xs mt-1">{answers.segment || '—'}</div>
                  </div>
                </div>
                <button
                  onClick={() => router.push('/')}
                  className="flex items-center gap-1.5 text-slate-400 hover:text-slate-600 text-xs transition-colors font-medium"
                >
                  <RotateCcw size={12} /> Retake
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-7 shadow-card flex items-center justify-between">
              <div>
                <p className="text-slate-900 font-semibold mb-1">Take the assessment quiz</p>
                <p className="text-slate-500 text-sm">Get your personalised readiness score and curriculum.</p>
              </div>
              <button
                onClick={() => router.push('/')}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-5 rounded-xl transition-all text-sm shrink-0 shadow-btn"
              >
                Start Quiz <ArrowRight size={14} />
              </button>
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-white border border-slate-200 rounded-2xl mb-7 w-fit shadow-card">
            {tabs.map(t => (
              <TabBtn key={t.id} icon={t.icon} label={t.label} active={activeTab === t.id} onClick={() => setActiveTab(t.id)} />
            ))}
          </div>

          {activeTab === 'overview'   && <OverviewTab answers={answers} score={score} router={router} />}
          {activeTab === 'curriculum' && <CurriculumTab answers={answers} userId={user?.id} />}
          {activeTab === 'plan'       && <PlanTab answers={answers} score={score} />}
        </div>
      </div>
    </>
  )
}

function OverviewTab({ answers, score, router }) {
  const steps = [
    { done: score > 0,                                                      icon: BarChart3, label: 'Complete migration assessment',                    cta: () => router.push('/') },
    { done: !!(answers.language && answers.language !== 'Not taken'),       icon: Globe2,    label: 'Register for language test (IELTS/OET/TOEFL)'                                },
    { done: !!(answers.savings && answers.savings !== '< ₦1M' && answers.savings !== 'Less than ₦1M'), icon: Wallet, label: 'Build migration savings fund'                    },
    { done: false,                                                          icon: Briefcase, label: 'Gather core documents (passport, degree, NYSC)'                             },
    { done: false,                                                          icon: BookOpen,  label: 'Start curriculum Module 1'                                                   },
  ]
  const completedSteps = steps.filter(s => s.done).length
  const profileCards = [
    { icon: Globe2,    label: 'Destination',  value: answers.destination || '—' },
    { icon: Briefcase, label: 'Profile',      value: answers.segment    || '—'  },
    { icon: BookOpen,  label: 'Education',    value: answers.education  || '—'  },
    { icon: Clock,     label: 'Experience',   value: answers.experience ? `${answers.experience}` : '—' },
    { icon: Globe2,    label: 'Language',     value: answers.language   || '—'  },
    { icon: Wallet,    label: 'Savings',      value: answers.savings    || '—'  },
  ]

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
                <CheckCircle2 size={14} className="text-indigo-600" />
              </div>
              <span className="text-slate-900 font-semibold text-sm">Action Checklist</span>
            </div>
            <span className="text-slate-400 text-xs">{completedSteps}/{steps.length} done</span>
          </div>
          <div className="space-y-3">
            {steps.map((step, i) => (
              <div key={i} onClick={step.cta} className={`flex items-center gap-3 ${step.cta ? 'cursor-pointer group' : ''}`}>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${step.done ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'}`}>
                  {step.done && <CheckCircle2 size={11} className="text-white" />}
                </div>
                <span className={`text-sm flex-1 transition-colors ${step.done ? 'text-slate-400 line-through' : 'text-slate-700'} ${step.cta && !step.done ? 'group-hover:text-indigo-600' : ''}`}>
                  {step.label}
                </span>
                {step.cta && !step.done && <ChevronRight size={13} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
              <Briefcase size={14} className="text-indigo-600" />
            </div>
            <span className="text-slate-900 font-semibold text-sm">Your Profile</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {profileCards.map(card => (
              <div key={card.label} className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                <div className="text-slate-400 text-xs mb-1">{card.label}</div>
                <div className="text-slate-900 font-semibold text-sm truncate">{card.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function CurriculumTab({ answers, userId }) {
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
      <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center shadow-card">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto mb-5">
          <BookOpen size={24} className="text-indigo-600" />
        </div>
        <h3 className="text-slate-900 font-bold text-xl mb-2 tracking-tight">Your AI Curriculum</h3>
        <p className="text-slate-500 text-sm mb-7 max-w-sm mx-auto leading-relaxed">
          Get a personalised {answers.destination || ''} learning path — structured modules, detailed lessons, and official sources built for your exact profile.
        </p>
        <button
          onClick={generateCurriculum}
          disabled={loading || !answers.destination}
          className="inline-flex items-center gap-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 px-8 rounded-xl transition-all text-sm shadow-btn"
        >
          {loading ? (
            <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating your curriculum...</>
          ) : (
            <><Sparkles size={15} /> Generate My Curriculum</>
          )}
        </button>
        {genError && <p className="text-rose-500 text-xs mt-4">{genError}</p>}
        {!answers.destination && <p className="text-slate-400 text-xs mt-4">Complete the quiz first to generate a curriculum.</p>}
      </div>
    )
  }

  const totalLessons = curriculum.modules.reduce((a, m) => a + m.lessons.length, 0)
  const completedCount = Object.values(progress).filter(Boolean).length
  const progressPct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-card">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-slate-400 text-xs uppercase tracking-widest mb-1">Your Curriculum</p>
            <h3 className="text-slate-900 font-bold text-base">{curriculum.title}</h3>
          </div>
          <div className="text-right shrink-0">
            <div className="text-2xl font-black text-indigo-600">{progressPct}%</div>
            <div className="text-slate-400 text-xs">{completedCount}/{totalLessons} lessons</div>
          </div>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2">
          <div className="bg-indigo-600 h-2 rounded-full transition-all duration-700" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      {curriculum.modules.map((module, mi) => {
        const moduleDone = module.lessons.every((_, li) => progress[`${mi}-${li}`])
        const moduleStarted = module.lessons.some((_, li) => progress[`${mi}-${li}`])
        const isOpen = expandedModule === mi
        const completedInModule = module.lessons.filter((_, li) => progress[`${mi}-${li}`]).length

        return (
          <div key={mi} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-card">
            <button
              onClick={() => setExpandedModule(isOpen ? -1 : mi)}
              className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${
                  moduleDone    ? 'bg-emerald-100 text-emerald-600 border border-emerald-200' :
                  moduleStarted ? 'bg-indigo-100 text-indigo-600 border border-indigo-200'   :
                                  'bg-slate-100 text-slate-500 border border-slate-200'
                }`}>
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
                      className={`w-full px-5 py-3.5 flex items-center gap-4 text-left transition-all ${
                        unlocked && !done ? 'hover:bg-indigo-50 cursor-pointer' :
                        done             ? 'hover:bg-slate-50 cursor-pointer'   :
                                           'opacity-40 cursor-not-allowed'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold border ${
                        done     ? 'bg-emerald-100 border-emerald-200 text-emerald-600' :
                        unlocked ? 'bg-indigo-100 border-indigo-200 text-indigo-600'   :
                                   'bg-slate-100 border-slate-200 text-slate-400'
                      }`}>
                        {done ? <CircleCheck size={14} /> : unlocked ? <PlayCircle size={14} /> : <Lock size={11} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`font-medium text-sm ${done ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{lesson.title}</div>
                        <p className="text-slate-400 text-xs mt-0.5 truncate">{lesson.summary}</p>
                      </div>
                      <div className="shrink-0">
                        {done && <span className="text-emerald-600 text-xs font-medium">Done</span>}
                        {unlocked && !done && <ChevronRight size={14} className="text-slate-300" />}
                      </div>
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

function PlanTab({ answers, score }) {
  const destination = answers.destination || 'your destination'
  const months = score >= 70 ? 12 : score >= 40 ? 18 : 24

  const phases = [
    {
      icon: BookOpen, phase: 'Phase 1', title: 'Foundation', duration: 'Month 1–2',
      color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200',
      tasks: [`Complete full JapaLearn curriculum for ${destination}`, 'Register for and pass language test (IELTS/OET/TOEFL/German B1)', 'Begin document collection: passport, degree certificates, NYSC discharge', 'Open a dedicated migration savings account'],
    },
    {
      icon: Briefcase, phase: 'Phase 2', title: 'Preparation', duration: 'Month 3–6',
      color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-200',
      tasks: ['Get degree evaluation (WES for Canada, NARIC for UK)', 'Request employment reference letters from employers', 'Build migration savings to meet proof-of-funds threshold', 'Update LinkedIn profile and create an international-format CV', answers.segment?.includes('Tech') ? 'Obtain cloud certifications (AWS, GCP, Azure)' : 'Research specific eligibility requirements for your route'],
    },
    {
      icon: Globe2, phase: 'Phase 3', title: 'Application', duration: 'Month 7–10',
      color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200',
      tasks: [`Create account on official immigration portal for ${destination}`, 'Submit Expression of Interest / Initial Application', 'Book and attend biometrics appointment', 'Engage a verified consultant for document review', 'Track application status weekly'],
    },
    {
      icon: TrendingUp, phase: 'Phase 4', title: 'Pre-Departure', duration: `Month 11–${months}`,
      color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200',
      tasks: ['Receive visa decision — appeal or proceed', 'Book flights and arrange temporary accommodation', `Complete JapaLearn Arrival Pack for ${destination}`, 'Notify bank, FRSC, and relevant Nigerian authorities', 'Connect with Nigerian diaspora community in your target city'],
    },
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3">
        <Clock size={15} className="text-indigo-600 shrink-0" />
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
