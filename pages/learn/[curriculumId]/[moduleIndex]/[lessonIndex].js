import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  ArrowLeft, ChevronLeft, ChevronRight, Sparkles,
  CheckCircle2, Lightbulb, ExternalLink, CircleAlert,
  Lock, Globe2, BookOpen,
} from 'lucide-react'
import { supabase } from '../../../../lib/supabase'

export default function LessonPage() {
  const router = useRouter()
  const { curriculumId, moduleIndex, lessonIndex } = router.query

  const [lesson, setLesson] = useState(null)
  const [curriculum, setCurriculum] = useState(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [genError, setGenError] = useState('')
  const [completed, setCompleted] = useState(false)
  const [userId, setUserId] = useState(null)
  const [summary, setSummary] = useState(null)
  const [summarising, setSummarising] = useState(false)

  useEffect(() => {
    if (!router.isReady) return
    loadLesson()
  }, [router.isReady, curriculumId, moduleIndex, lessonIndex])

  const loadLesson = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { router.push('/'); return }
    setUserId(session.user.id)
    const mIdx = parseInt(moduleIndex)
    const lIdx = parseInt(lessonIndex)

    const { data: currData } = await supabase.from('curricula').select('*').eq('id', curriculumId).maybeSingle()
    if (!currData) { router.push('/dashboard'); return }
    setCurriculum(currData)

    const { data: contentData } = await supabase.from('lesson_content').select('*')
      .eq('curriculum_id', curriculumId).eq('module_index', mIdx).eq('lesson_index', lIdx).maybeSingle()

    if (contentData) { setLesson(contentData) }
    else {
      const moduleData = currData.modules[mIdx]
      const lessonMeta = moduleData?.lessons[lIdx]
      if (lessonMeta) await generateLesson(currData, moduleData, lessonMeta, mIdx, lIdx)
    }

    const { data: progressData } = await supabase.from('lesson_progress').select('completed')
      .eq('user_id', session.user.id).eq('curriculum_id', curriculumId)
      .eq('module_index', mIdx).eq('lesson_index', lIdx).maybeSingle()

    if (progressData?.completed) setCompleted(true)
    setLoading(false)
  }

  const generateLesson = async (currData, moduleData, lessonMeta, mIdx, lIdx) => {
    setGenerating(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch('/api/generate-lesson', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({
          lessonTitle: lessonMeta.title, moduleTitle: moduleData.title,
          curriculumTitle: currData.title, destination: currData.destination,
          segment: currData.segment, curriculumId,
          moduleIndex: mIdx, lessonIndex: lIdx,
        }),
      })
      const data = await res.json()
      if (data.lesson) setLesson(data.lesson)
      else setGenError(data.error || 'Generation failed. Please try again.')
    } catch (e) { setGenError(e.message || 'Something went wrong.') }
    setGenerating(false)
  }

  const markComplete = async () => {
    if (completed) return
    setCompleted(true)
    await supabase.from('lesson_progress').upsert({
      user_id: userId, curriculum_id: curriculumId,
      module_index: parseInt(moduleIndex), lesson_index: parseInt(lessonIndex),
      completed: true, completed_at: new Date().toISOString(),
    }, { onConflict: 'user_id,curriculum_id,module_index,lesson_index' })
  }

  const goNext = () => {
    if (!curriculum) return
    const mIdx = parseInt(moduleIndex), lIdx = parseInt(lessonIndex)
    const module = curriculum.modules[mIdx]
    if (lIdx + 1 < module.lessons.length) router.push(`/learn/${curriculumId}/${mIdx}/${lIdx + 1}`)
    else if (mIdx + 1 < curriculum.modules.length) router.push(`/learn/${curriculumId}/${mIdx + 1}/0`)
    else router.push('/dashboard')
  }

  const goPrev = () => {
    const mIdx = parseInt(moduleIndex), lIdx = parseInt(lessonIndex)
    if (lIdx > 0) router.push(`/learn/${curriculumId}/${mIdx}/${lIdx - 1}`)
    else if (mIdx > 0) { const pm = curriculum.modules[mIdx - 1]; router.push(`/learn/${curriculumId}/${mIdx - 1}/${pm.lessons.length - 1}`) }
  }

  const isFirst = parseInt(moduleIndex) === 0 && parseInt(lessonIndex) === 0
  const currentModule = curriculum?.modules[parseInt(moduleIndex)]
  const totalLessons = curriculum?.modules.reduce((a, m) => a + m.lessons.length, 0) || 0
  const lessonNumber = (curriculum?.modules.slice(0, parseInt(moduleIndex)).reduce((a, m) => a + m.lessons.length, 0) || 0) + parseInt(lessonIndex) + 1

  if (loading || generating) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 border-2 border-slate-200 rounded-full" />
          <div className="w-12 h-12 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin absolute inset-0" />
        </div>
        <div className="text-center">
          <p className="text-slate-900 font-medium text-sm">{generating ? 'Generating lesson content...' : 'Loading...'}</p>
          {generating && <p className="text-slate-400 text-xs mt-1">Sourcing from official immigration documents</p>}
        </div>
      </div>
    )
  }

  if (genError) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4 px-5">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center">
          <CircleAlert size={22} className="text-rose-500" />
        </div>
        <div className="text-center">
          <p className="text-slate-900 font-semibold mb-1">Failed to generate lesson</p>
          <p className="text-slate-500 text-sm max-w-xs">{genError}</p>
        </div>
        <button onClick={() => { setGenError(''); loadLesson() }} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all text-sm shadow-btn">
          Try Again
        </button>
        <button onClick={() => router.push('/dashboard')} className="flex items-center gap-1.5 text-slate-400 hover:text-slate-600 text-sm transition-colors">
          <ArrowLeft size={14} /> Back to Dashboard
        </button>
      </div>
    )
  }

  if (!lesson) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><p className="text-slate-400">Lesson not found.</p></div>

  const sources = typeof lesson.sources === 'string' ? JSON.parse(lesson.sources) : lesson.sources
  const takeaways = typeof lesson.key_takeaways === 'string' ? JSON.parse(lesson.key_takeaways) : lesson.key_takeaways

  return (
    <>
      <Head><title>{lesson.title} — JapaLearn AI</title></Head>
      <div className="min-h-screen bg-slate-50">

        {/* Top nav */}
        <nav className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
          <div className="max-w-3xl mx-auto px-5 h-14 flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 text-sm transition-colors font-medium shrink-0"
            >
              <ArrowLeft size={15} /> <span className="hidden sm:block">Curriculum</span>
            </button>
            <div className="flex-1">
              <div className="w-full bg-slate-100 rounded-full h-1.5">
                <div
                  className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${(lessonNumber / totalLessons) * 100}%` }}
                />
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center">
                <Globe2 size={11} className="text-white" />
              </div>
              <span className="text-slate-400 text-xs font-medium">{lessonNumber} / {totalLessons}</span>
            </div>
          </div>
        </nav>

        <div className="max-w-3xl mx-auto px-5 py-10">

          {/* Module tag */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 rounded-full px-3 py-1">
              <BookOpen size={11} className="text-indigo-600" />
              <span className="text-indigo-600 text-xs font-semibold">{currentModule?.title}</span>
            </div>
            {currentModule?.urgent && (
              <span className="bg-rose-50 text-rose-600 border border-rose-200 text-xs px-2.5 py-1 rounded-full font-semibold">Urgent</span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-8 leading-tight tracking-tight">{lesson.title}</h1>

          {/* AI Summary */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-8 shadow-card">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <Sparkles size={13} className="text-indigo-600" />
                </div>
                <span className="text-slate-900 font-semibold text-sm">AI Key Points</span>
              </div>
              {!summary && (
                <button
                  onClick={async () => {
                    setSummarising(true)
                    try {
                      const r = await fetch('/api/summarise-lesson', {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ content: lesson.content, title: lesson.title }),
                      })
                      const d = await r.json()
                      setSummary(d.points || [])
                    } catch { setSummary([]) }
                    setSummarising(false)
                  }}
                  disabled={summarising}
                  className="flex items-center gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg transition-all font-medium shadow-btn"
                >
                  {summarising ? <><span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" /> Generating...</> : <><Sparkles size={11} /> Generate Summary</>}
                </button>
              )}
            </div>
            {!summary && !summarising && <p className="text-slate-400 text-xs">Click to generate a quick-scan AI summary of this lesson.</p>}
            {summarising && <div className="flex items-center gap-2 text-slate-500 text-sm"><div className="w-3 h-3 border border-indigo-400 border-t-transparent rounded-full animate-spin" /> Analysing lesson...</div>}
            {summary && summary.length > 0 && (
              <ul className="space-y-2.5">
                {summary.map((point, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-slate-700 text-sm">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold text-indigo-600">{i + 1}</span>
                    {point}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Lesson content */}
          <div className="prose-lesson mb-10">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p:          ({ children }) => <p>{children}</p>,
                strong:     ({ children }) => <strong>{children}</strong>,
                ul:         ({ children }) => <ul>{children}</ul>,
                ol:         ({ children }) => <ol>{children}</ol>,
                li:         ({ children }) => <li>{children}</li>,
                h2:         ({ children }) => <h2>{children}</h2>,
                h3:         ({ children }) => <h3>{children}</h3>,
                a:          ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>,
                blockquote: ({ children }) => <blockquote>{children}</blockquote>,
              }}
            >
              {lesson.content}
            </ReactMarkdown>
          </div>

          {/* Key takeaways */}
          {takeaways?.length > 0 && (
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 mb-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <Lightbulb size={14} className="text-indigo-600" />
                </div>
                <h3 className="text-slate-900 font-semibold text-sm">Key Takeaways</h3>
              </div>
              <ul className="space-y-3">
                {takeaways.map((t, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-700 text-sm">
                    <span className="w-5 h-5 rounded-full bg-indigo-200 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold text-indigo-700">{i + 1}</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action step */}
          {lesson.action_step && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                </div>
                <h3 className="text-slate-900 font-semibold text-sm">Your Action Step</h3>
              </div>
              <p className="text-slate-700 text-sm leading-relaxed">{lesson.action_step}</p>
            </div>
          )}

          {/* Sources */}
          {sources?.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-8 shadow-card">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center">
                  <ExternalLink size={13} className="text-slate-500" />
                </div>
                <h3 className="text-slate-500 text-xs font-semibold uppercase tracking-widest">Official Sources</h3>
              </div>
              <ul className="space-y-2">
                {sources.map((s, i) => (
                  <li key={i}>
                    <a href={s.url || s} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 text-sm transition-colors group font-medium">
                      <ExternalLink size={12} className="shrink-0 opacity-50 group-hover:opacity-100" />
                      {s.label || s.url || s}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Mark Complete */}
          {!completed ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-4 flex items-center justify-between gap-4 shadow-card">
              <div>
                <p className="text-slate-900 font-semibold text-sm">Done reading?</p>
                <p className="text-slate-400 text-xs mt-0.5">Mark complete to unlock the next lesson.</p>
              </div>
              <button
                onClick={markComplete}
                className="shrink-0 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-5 rounded-xl transition-all text-sm shadow-btn"
              >
                <CheckCircle2 size={15} /> Mark Complete
              </button>
            </div>
          ) : (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <CheckCircle2 size={16} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-emerald-700 font-semibold text-sm">Lesson completed</p>
                <p className="text-emerald-600/70 text-xs mt-0.5">Next lesson is now unlocked</p>
              </div>
            </div>
          )}

          {/* Prev / Next */}
          <div className="flex items-center gap-3 pb-12">
            <button
              onClick={goPrev} disabled={isFirst}
              className="flex items-center justify-center gap-2 flex-1 border border-slate-200 hover:border-slate-300 hover:bg-white disabled:opacity-25 disabled:cursor-not-allowed text-slate-600 hover:text-slate-900 font-semibold py-3.5 rounded-2xl transition-all text-sm shadow-card"
            >
              <ChevronLeft size={16} /> Previous
            </button>
            <button
              onClick={goNext} disabled={!completed}
              className={`flex items-center justify-center gap-2 flex-1 font-semibold py-3.5 rounded-2xl transition-all text-sm ${
                completed
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-card-md'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
              }`}
            >
              {completed ? <>Next Lesson <ChevronRight size={16} /></> : <><Lock size={14} /> Complete to continue</>}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
