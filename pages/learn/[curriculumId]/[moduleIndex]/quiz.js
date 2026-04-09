import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { ArrowLeft, CheckCircle2, XCircle, RotateCcw, ChevronRight, Sparkles, Trophy, AlertCircle } from 'lucide-react'
import { supabase } from '../../../../lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'

const PASS_THRESHOLD = 7 // out of 10

export default function ModuleQuiz() {
  const router = useRouter()
  const { curriculumId, moduleIndex } = router.query

  const [quiz, setQuiz] = useState(null)
  const [curriculum, setCurriculum] = useState(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')
  const [userId, setUserId] = useState(null)
  const [previousResult, setPreviousResult] = useState(null)

  // Quiz state
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answers, setAnswers] = useState([]) // array of selected indices
  const [showExplanation, setShowExplanation] = useState(false)
  const [phase, setPhase] = useState('quiz') // 'quiz' | 'results'
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!router.isReady) return
    load()
  }, [router.isReady, curriculumId, moduleIndex])

  const load = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { router.push('/'); return }
    setUserId(session.user.id)

    const { data: curr } = await supabase.from('curricula').select('*').eq('id', curriculumId).maybeSingle()
    if (!curr) { router.push('/dashboard'); return }
    setCurriculum(curr)

    // Check if already passed
    const { data: prevResult } = await supabase
      .from('module_quiz_results')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('curriculum_id', curriculumId)
      .eq('module_index', parseInt(moduleIndex))
      .maybeSingle()

    if (prevResult) setPreviousResult(prevResult)

    await generateQuiz(session.access_token)
    setLoading(false)
  }

  const generateQuiz = async (token) => {
    setGenerating(true)
    setError('')
    try {
      const res = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ curriculumId, moduleIndex: parseInt(moduleIndex) }),
      })
      const data = await res.json()
      if (data.quiz) setQuiz(data.quiz)
      else setError(data.error || 'Could not generate quiz. Please try again.')
    } catch (e) {
      setError(e.message || 'Something went wrong.')
    }
    setGenerating(false)
  }

  const handleSelect = (idx) => {
    if (showExplanation) return
    setSelected(idx)
  }

  const handleConfirm = () => {
    if (selected === null) return
    setShowExplanation(true)
  }

  const handleNext = () => {
    const newAnswers = [...answers, selected]
    setAnswers(newAnswers)
    setShowExplanation(false)
    setSelected(null)

    if (current + 1 < quiz.questions.length) {
      setCurrent(current + 1)
    } else {
      // Calculate score and show results
      const score = newAnswers.filter((ans, i) => ans === quiz.questions[i].correctIndex).length
      saveResult(score, newAnswers)
      setPhase('results')
    }
  }

  const saveResult = async (score, finalAnswers) => {
    setSaving(true)
    const passed = score >= PASS_THRESHOLD
    const mIdx = parseInt(moduleIndex)

    // Upsert — keep best result if already passed
    const { data: existing } = await supabase
      .from('module_quiz_results')
      .select('*')
      .eq('user_id', userId)
      .eq('curriculum_id', curriculumId)
      .eq('module_index', mIdx)
      .maybeSingle()

    if (existing) {
      await supabase.from('module_quiz_results').update({
        passed: existing.passed || passed,
        score: Math.max(existing.score, score),
        attempts: existing.attempts + 1,
        completed_at: new Date().toISOString(),
      }).eq('id', existing.id)
    } else {
      await supabase.from('module_quiz_results').insert({
        user_id: userId,
        curriculum_id: curriculumId,
        module_index: mIdx,
        passed,
        score,
        total: quiz.questions.length,
        attempts: 1,
      })
    }
    setSaving(false)
  }

  const retake = async () => {
    setCurrent(0)
    setSelected(null)
    setAnswers([])
    setShowExplanation(false)
    setPhase('quiz')
    setPreviousResult(null)
    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    await generateQuiz(session?.access_token)
    setLoading(false)
  }

  const goNext = () => {
    const mIdx = parseInt(moduleIndex)
    if (mIdx + 1 < curriculum.modules.length) {
      router.push(`/learn/${curriculumId}/${mIdx + 1}/0`)
    } else {
      router.push('/dashboard')
    }
  }

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading || generating) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 border-2 border-slate-200 rounded-full" />
          <div className="w-12 h-12 border-2 border-[#3b75ff] border-t-transparent rounded-full animate-spin absolute inset-0" />
        </div>
        <div className="text-center">
          <p className="text-slate-900 font-semibold text-sm">
            {generating ? 'Generating your module quiz…' : 'Loading…'}
          </p>
          {generating && <p className="text-slate-400 text-xs mt-1">Creating 10 questions from your lessons</p>}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4 px-5">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center">
          <AlertCircle size={22} className="text-rose-500" />
        </div>
        <div className="text-center">
          <p className="text-slate-900 font-semibold mb-1">Could not load quiz</p>
          <p className="text-slate-500 text-sm max-w-xs">{error}</p>
        </div>
        <button onClick={retake} className="bg-[#3b75ff] text-white font-semibold py-3 px-6 rounded-xl text-sm">
          Try Again
        </button>
        <button onClick={() => router.push('/dashboard')} className="flex items-center gap-1.5 text-slate-400 hover:text-slate-600 text-sm">
          <ArrowLeft size={14} /> Back to Dashboard
        </button>
      </div>
    )
  }

  if (!quiz) return null

  // ── Results screen ────────────────────────────────────────────────────────────
  if (phase === 'results') {
    const score = answers.filter((ans, i) => ans === quiz.questions[i].correctIndex).length
    const passed = score >= PASS_THRESHOLD
    const pct = Math.round((score / quiz.questions.length) * 100)
    const isLast = parseInt(moduleIndex) + 1 >= curriculum.modules.length

    return (
      <>
        <Head><title>Quiz Results — {quiz.moduleTitle}</title></Head>
        <div className="min-h-screen bg-slate-50 flex flex-col">
          <nav className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
            <div className="max-w-xl mx-auto px-5 h-14 flex items-center gap-3">
              <button onClick={() => router.push('/dashboard')} className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 text-sm font-medium">
                <ArrowLeft size={15} /> Dashboard
              </button>
            </div>
          </nav>

          <div className="flex-1 max-w-xl mx-auto w-full px-5 py-10">
            {/* Score card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-[24px] p-8 mb-6 text-center ${passed ? 'bg-[#3b75ff]' : 'bg-slate-800'}`}
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(255,255,255,0.15)' }}>
                {passed ? <Trophy size={30} className="text-white" /> : <RotateCcw size={28} className="text-white" />}
              </div>
              <p className="text-white/70 text-sm uppercase tracking-widest mb-1">
                {passed ? 'Module Complete' : 'Not quite there yet'}
              </p>
              <p className="text-white font-black text-6xl mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                {score}/{quiz.questions.length}
              </p>
              <p className="text-white/80 text-sm mb-4">{pct}% correct · Pass mark is 70%</p>
              <p className="text-white font-semibold text-lg">
                {passed
                  ? isLast ? '🎉 You have completed the full curriculum!' : `Great work! You can now unlock Module ${parseInt(moduleIndex) + 2}`
                  : `You need ${PASS_THRESHOLD - score} more correct answer${PASS_THRESHOLD - score === 1 ? '' : 's'} to pass.`}
              </p>
            </motion.div>

            {/* Answer breakdown */}
            <div className="bg-white rounded-[20px] shadow-sm border border-slate-100 p-5 mb-5">
              <h3 className="text-sm font-semibold text-slate-700 mb-4">Question Review</h3>
              <div className="space-y-3">
                {quiz.questions.map((q, i) => {
                  const userAns = answers[i]
                  const correct = userAns === q.correctIndex
                  return (
                    <div key={i} className={`rounded-xl p-3 ${correct ? 'bg-emerald-50' : 'bg-rose-50'}`}>
                      <div className="flex items-start gap-2 mb-1">
                        {correct
                          ? <CheckCircle2 size={15} className="text-emerald-500 mt-0.5 shrink-0" />
                          : <XCircle size={15} className="text-rose-400 mt-0.5 shrink-0" />}
                        <p className="text-sm font-medium text-slate-800">{q.question}</p>
                      </div>
                      {!correct && (
                        <p className="text-xs text-slate-500 ml-5 mt-1">
                          Correct: <span className="font-semibold text-emerald-600">{q.options[q.correctIndex]}</span>
                        </p>
                      )}
                      <p className="text-xs text-slate-500 ml-5 mt-1 italic">{q.explanation}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              {passed ? (
                <button
                  onClick={goNext}
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 text-white font-semibold py-4 rounded-2xl text-sm transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ background: '#3b75ff' }}
                >
                  {isLast ? 'Back to Dashboard' : `Continue to Module ${parseInt(moduleIndex) + 2}`}
                  <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  onClick={retake}
                  className="w-full flex items-center justify-center gap-2 font-semibold py-4 rounded-2xl text-sm bg-slate-800 text-white hover:opacity-90 transition-all"
                >
                  <RotateCcw size={15} /> Retake Quiz
                </button>
              )}
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full text-center text-slate-400 hover:text-slate-600 text-sm py-2 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </>
    )
  }

  // ── Quiz screen ───────────────────────────────────────────────────────────────
  const q = quiz.questions[current]
  const isCorrect = selected === q.correctIndex

  return (
    <>
      <Head><title>Module Quiz — {quiz.moduleTitle}</title></Head>
      <div className="min-h-screen bg-slate-50 flex flex-col">

        {/* Nav */}
        <nav className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
          <div className="max-w-xl mx-auto px-5 h-14 flex items-center gap-4">
            <button onClick={() => router.push('/dashboard')} className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 text-sm font-medium shrink-0">
              <ArrowLeft size={15} /> Dashboard
            </button>
            <div className="flex-1">
              <div className="w-full bg-slate-100 rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${((current + (showExplanation ? 1 : 0)) / quiz.questions.length) * 100}%`, background: '#3b75ff' }}
                />
              </div>
            </div>
            <span className="text-slate-400 text-xs font-medium shrink-0">{current + 1} / {quiz.questions.length}</span>
          </div>
        </nav>

        <div className="flex-1 max-w-xl mx-auto w-full px-5 py-8">

          {/* Module badge */}
          <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-100 rounded-full px-3 py-1 mb-5">
            <Sparkles size={11} className="text-[#3b75ff]" />
            <span className="text-[#3b75ff] text-xs font-semibold">Module Quiz · {quiz.moduleTitle}</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Question */}
              <div className="bg-white rounded-[20px] shadow-sm border border-slate-100 p-6 mb-4">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-3">
                  Question {current + 1} of {quiz.questions.length}
                </p>
                <h2 className="text-lg font-bold text-slate-900 leading-snug" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  {q.question}
                </h2>
              </div>

              {/* Options */}
              <div className="space-y-3 mb-4">
                {q.options.map((opt, i) => {
                  let style = 'bg-white border-slate-200 text-slate-700'
                  if (selected === i && !showExplanation) style = 'bg-blue-50 border-[#3b75ff] text-[#3b75ff]'
                  if (showExplanation && i === q.correctIndex) style = 'bg-emerald-50 border-emerald-400 text-emerald-700'
                  if (showExplanation && selected === i && i !== q.correctIndex) style = 'bg-rose-50 border-rose-400 text-rose-600'

                  return (
                    <button
                      key={i}
                      onClick={() => handleSelect(i)}
                      disabled={showExplanation}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all font-medium text-sm ${style} ${!showExplanation ? 'hover:border-[#3b75ff] hover:bg-blue-50 cursor-pointer' : 'cursor-default'}`}
                    >
                      <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 bg-slate-100 text-slate-500">
                        {String.fromCharCode(65 + i)}
                      </span>
                      {opt}
                      {showExplanation && i === q.correctIndex && <CheckCircle2 size={16} className="text-emerald-500 ml-auto shrink-0" />}
                      {showExplanation && selected === i && i !== q.correctIndex && <XCircle size={16} className="text-rose-400 ml-auto shrink-0" />}
                    </button>
                  )
                })}
              </div>

              {/* Explanation */}
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-xl p-4 mb-4 ${isCorrect ? 'bg-emerald-50 border border-emerald-100' : 'bg-amber-50 border border-amber-100'}`}
                >
                  <p className="text-xs font-semibold mb-1" style={{ color: isCorrect ? '#059669' : '#d97706' }}>
                    {isCorrect ? '✓ Correct!' : '✗ Not quite'}
                  </p>
                  <p className="text-sm text-slate-600">{q.explanation}</p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Action button */}
          {!showExplanation ? (
            <button
              onClick={handleConfirm}
              disabled={selected === null}
              className="w-full py-4 rounded-2xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: '#3b75ff' }}
            >
              Confirm Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="w-full py-4 rounded-2xl text-sm font-semibold text-white transition-all hover:opacity-90 flex items-center justify-center gap-2"
              style={{ background: '#3b75ff' }}
            >
              {current + 1 < quiz.questions.length ? 'Next Question' : 'See Results'}
              <ChevronRight size={16} />
            </button>
          )}

          {/* Previous result notice */}
          {previousResult?.passed && (
            <p className="text-center text-xs text-slate-400 mt-4">
              You already passed this quiz ({previousResult.score}/{previousResult.total}). This attempt is for practice.
            </p>
          )}
        </div>
      </div>
    </>
  )
}
