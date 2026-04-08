import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { Globe2, Zap, BookOpen, ArrowRight, ChevronRight, Map, BarChart3, Sparkles, Users, ArrowLeft, TrendingUp } from 'lucide-react'
import { segmentQuestion, destinationQuestion, segmentSpecificQuestions, universalFollowUps, calculateScore, getScoreFlag } from '../lib/quizData'

const scoreColors = {
  green:  { text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  yellow: { text: 'text-amber-600',   bg: 'bg-amber-50',   border: 'border-amber-200'   },
  red:    { text: 'text-rose-600',    bg: 'bg-rose-50',    border: 'border-rose-200'     },
}

export default function Home() {
  const router = useRouter()
  const [started, setStarted] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [questions, setQuestions] = useState([segmentQuestion])
  const [liveScore, setLiveScore] = useState(0)
  const [animScore, setAnimScore] = useState(0)
  const [show, setShow] = useState(true)

  useEffect(() => {
    const newScore = calculateScore(answers)
    setLiveScore(newScore)
    let start = animScore
    const end = newScore
    if (start === end) return
    const step = end > start ? 1 : -1
    const timer = setInterval(() => {
      start += step
      setAnimScore(start)
      if (start === end) clearInterval(timer)
    }, 20)
    return () => clearInterval(timer)
  }, [answers])

  const currentQuestion = questions[currentIndex]
  const progress = Math.round((currentIndex / questions.length) * 100)
  const flag = getScoreFlag(liveScore)
  const sc = scoreColors[flag]

  const advance = (nextFn) => {
    setShow(false)
    setTimeout(() => { nextFn(); setShow(true) }, 180)
  }

  const handleAnswer = (option) => {
    const updatedAnswers = { ...answers, [currentQuestion.id]: option }
    setAnswers(updatedAnswers)

    if (currentQuestion.id === 'segment') {
      const segSpecific = segmentSpecificQuestions[option] || []
      const fullQuestions = [segmentQuestion, destinationQuestion, ...segSpecific, ...universalFollowUps]
      advance(() => { setQuestions(fullQuestions); setCurrentIndex(1) })
      return
    }

    if (currentIndex < questions.length - 1) {
      advance(() => setCurrentIndex(currentIndex + 1))
    } else {
      const finalScore = calculateScore(updatedAnswers)
      const params = new URLSearchParams({ score: finalScore, answers: JSON.stringify(updatedAnswers) })
      router.push(`/report?${params.toString()}`)
    }
  }

  const handleBack = () => advance(() => setCurrentIndex(currentIndex - 1))

  /* ── QUIZ VIEW ── */
  if (started) {
    return (
      <>
        <Head><title>JapaLearn AI — Migration Assessment</title></Head>
        <div className="min-h-screen bg-slate-50 flex flex-col">
          {/* Nav */}
          <div className="px-5 pt-5 flex items-center justify-between max-w-2xl w-full mx-auto">
            <button
              onClick={() => { setStarted(false); setCurrentIndex(0); setAnswers({}); setQuestions([segmentQuestion]) }}
              className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 text-sm transition-colors font-medium"
            >
              <ArrowLeft size={15} /> Back
            </button>
            {liveScore > 0 && (
              <div className={`flex items-center gap-2 border rounded-full px-3.5 py-1.5 text-sm font-bold ${sc.bg} ${sc.border} ${sc.text}`}>
                <TrendingUp size={13} />
                {animScore}/100
              </div>
            )}
          </div>

          {/* Progress bar */}
          <div className="px-5 pt-4 max-w-2xl w-full mx-auto">
            <div className="w-full bg-slate-200 rounded-full h-1.5">
              <div
                className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-slate-400 text-xs mt-2">Question {currentIndex + 1} of {questions.length}</p>
          </div>

          {/* Question */}
          <div className="flex-1 flex items-start px-5 pt-10 max-w-2xl w-full mx-auto">
            <div className={`w-full ${show ? 'q-enter' : 'q-exit'}`}>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 leading-snug tracking-tight">
                {currentQuestion.question}
              </h2>
              <div className="space-y-2.5">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleAnswer(option)}
                    className="w-full text-left group bg-white hover:bg-indigo-600 border border-slate-200 hover:border-indigo-600 text-slate-700 hover:text-white rounded-2xl px-5 py-4 transition-all duration-150 font-medium flex items-center justify-between shadow-card hover:shadow-card-md"
                  >
                    <span>{option}</span>
                    <ChevronRight size={16} className="text-slate-300 group-hover:text-white/70 transition-colors shrink-0" />
                  </button>
                ))}
              </div>
              {currentIndex > 0 && (
                <button
                  onClick={handleBack}
                  className="mt-7 flex items-center gap-1.5 text-slate-400 hover:text-slate-600 text-sm transition-colors font-medium"
                >
                  <ArrowLeft size={14} /> Previous question
                </button>
              )}
            </div>
          </div>
        </div>
      </>
    )
  }

  /* ── LANDING VIEW ── */
  return (
    <>
      <Head>
        <title>JapaLearn AI — Your migration roadmap, built by AI</title>
        <meta name="description" content="Get your free personalised Migration Readiness Report in 90 seconds." />
      </Head>
      <div className="min-h-screen bg-slate-50 text-slate-900">

        {/* Navbar */}
        <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
          <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
                <Globe2 size={16} className="text-white" />
              </div>
              <span className="font-bold text-base tracking-tight text-slate-900">
                JapaLearn <span className="text-indigo-600">AI</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => router.push('/login')}
                className="text-slate-600 hover:text-slate-900 text-sm font-medium px-4 py-2 rounded-xl hover:bg-slate-100 transition-all"
              >
                Sign in
              </button>
              <button
                onClick={() => setStarted(true)}
                className="text-sm font-semibold px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-btn"
              >
                Get started free
              </button>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section className="max-w-4xl mx-auto px-5 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-full px-4 py-1.5 text-indigo-600 text-sm font-medium mb-8">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
            Free · No account needed · 90 seconds
          </div>

          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 leading-[1.05] tracking-tight">
            From{' '}
            <span className="text-slate-400">'I want to japa'</span>
            <br />
            to{' '}
            <span className="gradient-text">'I've landed'</span>
          </h1>

          <p className="text-slate-500 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Get your personalised Migration Readiness Score, recommended visa route, NGN cost estimate, and a step-by-step AI curriculum — all free.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
            <button
              onClick={() => setStarted(true)}
              className="group inline-flex items-center gap-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base py-4 px-8 rounded-2xl transition-all shadow-card-md hover:shadow-card-lg hover:-translate-y-0.5"
            >
              Get My Free Report
              <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() => router.push('/login')}
              className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm font-medium px-6 py-4 rounded-2xl border border-slate-200 hover:border-slate-300 bg-white transition-all shadow-card"
            >
              Already have an account
              <ChevronRight size={15} />
            </button>
          </div>
          <p className="text-slate-400 text-sm mt-4">No credit card · No spam · Just your personalised plan</p>
        </section>

        {/* Stats strip */}
        <section className="border-y border-slate-200 bg-white">
          <div className="max-w-4xl mx-auto px-5 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { icon: Globe2,    value: '20+',  label: 'Countries Covered'  },
                { icon: Map,       value: '40+',  label: 'Visa Routes Mapped' },
                { icon: BarChart3, value: '100',  label: 'Point Scoring Model'},
                { icon: Zap,       value: 'Free', label: 'Forever'            },
              ].map(({ icon: Icon, value, label }) => (
                <div key={label}>
                  <div className="flex justify-center mb-2">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center">
                      <Icon size={17} className="text-indigo-600" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-slate-900">{value}</div>
                  <div className="text-slate-500 text-xs mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="max-w-5xl mx-auto px-5 py-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-indigo-600 text-sm font-semibold bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full mb-3">
              <Sparkles size={13} /> How it works
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              From quiz to curriculum in minutes
            </h2>
            <p className="text-slate-500 mt-3">Three steps to your personalised migration plan</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { num: '01', icon: Zap,      title: 'Take the Assessment', desc: '10 quick questions tailored to your profession and destination. No free text — just tap.' },
              { num: '02', icon: BarChart3, title: 'Get Your Report',     desc: 'Instant readiness score, recommended visa route, NGN cost estimate, and your personal action plan.' },
              { num: '03', icon: BookOpen,  title: 'Follow Your Curriculum', desc: 'AI-generated learning path built for your exact professional profile — cited from official government sources.' },
            ].map((s) => (
              <div key={s.num} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-card hover:shadow-card-md transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                    <s.icon size={19} className="text-indigo-600" />
                  </div>
                  <span className="text-3xl font-black text-slate-100">{s.num}</span>
                </div>
                <h3 className="text-slate-900 font-bold text-base mb-2">{s.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Countries */}
        <section className="max-w-5xl mx-auto px-5 pb-20">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Every major destination covered</h2>
            <p className="text-slate-500 mt-2 text-sm">Official routes · Real requirements · NGN cost estimates</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2.5">
            {[
              ['🇨🇦','Canada'],['🇬🇧','United Kingdom'],['🇩🇪','Germany'],
              ['🇮🇪','Ireland'],['🇦🇺','Australia'],['🇺🇸','USA'],
              ['🇵🇹','Portugal'],['🇳🇱','Netherlands'],['🇫🇷','France'],
              ['🇳🇴','Norway'],['🇸🇪','Sweden'],['🇦🇪','UAE'],
              ['🇸🇬','Singapore'],['🇳🇿','New Zealand'],
            ].map(([flag, name]) => (
              <div key={name} className="flex items-center gap-2 bg-white border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 text-sm px-3.5 py-2 rounded-xl transition-all shadow-card cursor-default font-medium">
                <span className="text-base leading-none">{flag}</span>
                {name}
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="max-w-4xl mx-auto px-5 pb-20">
          <div className="bg-indigo-600 rounded-3xl p-10 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/15 mb-5">
              <Users size={22} className="text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight">
              Ready to find out where you stand?
            </h2>
            <p className="text-indigo-200 text-sm mb-8 max-w-md mx-auto">
              Free. No account needed. Your personalised migration readiness report in 90 seconds.
            </p>
            <button
              onClick={() => setStarted(true)}
              className="group inline-flex items-center gap-2.5 bg-white hover:bg-slate-50 text-indigo-600 font-bold py-4 px-10 rounded-2xl transition-all shadow-card-md hover:-translate-y-0.5"
            >
              Get My Free Report
              <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white px-5 py-8">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center">
                <Globe2 size={12} className="text-white" />
              </div>
              <span className="text-slate-600 text-sm font-semibold">JapaLearn AI</span>
            </div>
            <div className="flex items-center gap-4 text-slate-400 text-xs">
              <span>© 2026 JapaLearn AI</span>
              <span>·</span>
              <span>Protected under NDPR</span>
              <span>·</span>
              <span>Not a visa agency · Not legal advice</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
