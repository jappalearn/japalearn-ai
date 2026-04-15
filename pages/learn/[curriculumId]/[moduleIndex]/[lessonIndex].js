import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  ChevronLeft, ChevronRight, Sparkles,
  CheckCircle2, ExternalLink, CircleAlert,
  Lock, AlertTriangle, Target, Play, ArrowRight,
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
    setLoading(true)
    setLesson(null)
    setCurriculum(null)
    setGenError('')
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
    if (lIdx + 1 < module.lessons.length) {
      router.push(`/learn/${curriculumId}/${mIdx}/${lIdx + 1}`)
    } else {
      router.push(`/learn/${curriculumId}/${mIdx}/quiz`)
    }
  }

  const goPrev = () => {
    const mIdx = parseInt(moduleIndex), lIdx = parseInt(lessonIndex)
    if (lIdx > 0) router.push(`/learn/${curriculumId}/${mIdx}/${lIdx - 1}`)
    else if (mIdx > 0) { const pm = curriculum.modules[mIdx - 1]; router.push(`/learn/${curriculumId}/${mIdx - 1}/${pm.lessons.length - 1}`) }
  }

  const isFirst = parseInt(moduleIndex) === 0 && parseInt(lessonIndex) === 0
  const mIdx = parseInt(moduleIndex || '0')
  const lIdx = parseInt(lessonIndex || '0')
  const currentModule = curriculum?.modules[mIdx]
  const moduleLessonCount = currentModule?.lessons.length || 1
  const modulePct = Math.round(((lIdx + 1) / moduleLessonCount) * 100)
  const isLastInModule = lIdx + 1 >= moduleLessonCount

  // ── Loading / generating ────────────────────────────────────────────────────
  if (loading || generating) {
    return (
      <div style={{ minHeight: '100vh', background: '#F7F9FF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, fontFamily: '"Inter", sans-serif' }}>
        <div style={{ position: 'relative', width: 48, height: 48 }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid #E4E8FF' }} />
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid transparent', borderTopColor: '#3B75FF', animation: 'spin 0.8s linear infinite' }} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 600, color: '#18181B' }}>{generating ? 'Generating lesson content…' : 'Loading…'}</p>
          {generating && <p style={{ margin: 0, fontSize: 12, color: '#B0B4C4' }}>Sourcing from official immigration documents</p>}
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  // ── Error ───────────────────────────────────────────────────────────────────
  if (genError) {
    return (
      <div style={{ minHeight: '100vh', background: '#F7F9FF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '0 20px', fontFamily: '"Inter", sans-serif' }}>
        <div style={{ width: 48, height: 48, borderRadius: 16, background: '#FFF0F3', border: '1px solid #FFC2CE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircleAlert size={22} color="#EF4369" />
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 700, color: '#18181B', fontFamily: '"DM Sans", sans-serif' }}>Failed to generate lesson</p>
          <p style={{ margin: 0, fontSize: 13, color: '#82858A', maxWidth: 300, lineHeight: 1.5 }}>{genError}</p>
        </div>
        <button onClick={() => { setGenError(''); loadLesson() }} style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #1E4DD7, #3B75FF)', color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: '"Inter", sans-serif' }}>
          Try Again
        </button>
        <button onClick={() => router.push('/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: '#B0B4C4', fontSize: 13, cursor: 'pointer', fontFamily: '"Inter", sans-serif' }}>
          <ChevronLeft size={14} /> Back to Dashboard
        </button>
      </div>
    )
  }

  if (!lesson) return (
    <div style={{ minHeight: '100vh', background: '#F7F9FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Inter", sans-serif' }}>
      <p style={{ color: '#B0B4C4', fontSize: 14 }}>Lesson not found.</p>
    </div>
  )

  const sources = typeof lesson.sources === 'string' ? JSON.parse(lesson.sources) : lesson.sources
  const takeaways = typeof lesson.key_takeaways === 'string' ? JSON.parse(lesson.key_takeaways) : lesson.key_takeaways
  const wordCount = (lesson.content || '').split(/\s+/).length
  const readMins = Math.max(1, Math.round(wordCount / 200))
  // Strip the leading heading (lesson title repeated) from generated content
  const processedContent = (lesson.content || '').replace(/^#{1,6}\s+[^\n]+\n?/, '')

  return (
    <>
      <Head><title>{lesson.title} — JapaLearn AI</title></Head>
      <div style={{ minHeight: '100vh', background: '#F7F9FF', fontFamily: '"Inter", sans-serif' }}>

        {/* ── Header ── */}
        <header style={{
          background: '#FFFFFF',
          borderBottom: '1px solid #ECEEFF',
          padding: '0 28px',
          height: 60,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          position: 'sticky',
          top: 0,
          zIndex: 30,
        }}>
          {/* Back */}
          <button
            onClick={() => router.push('/dashboard')}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', fontSize: 14, fontWeight: 500, padding: '8px 12px', borderRadius: 10, fontFamily: '"Inter", sans-serif', transition: 'background 0.15s, color 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#F4F6FF'; e.currentTarget.style.color = '#1E4DD7' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#6B7280' }}
          >
            <ChevronLeft size={16} />
            <span>Back</span>
          </button>

          {/* Breadcrumb — desktop only */}
          <div style={{ width: 1, height: 20, background: '#E4E8FF', flexShrink: 0 }} className="hidden sm:block" />
          <div className="hidden sm:flex" style={{ alignItems: 'center', gap: 8, overflow: 'hidden', flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: 13, color: '#82858A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 200 }}>{currentModule?.title}</span>
            <span style={{ color: '#D0D4E0', flexShrink: 0 }}>›</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#18181B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{lesson.title}</span>
          </div>

          {/* Right: read time + mark complete */}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <span className="hidden sm:block" style={{ fontSize: 12, color: '#82858A', background: '#F4F6FF', padding: '4px 10px', borderRadius: 20 }}>{readMins} min read</span>
            {completed ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#E8F9EE', border: '1px solid #A7F3C5', borderRadius: 10 }}>
                <CheckCircle2 size={14} color="#21C474" />
                <span style={{ fontSize: 13, fontWeight: 600, color: '#21C474', fontFamily: '"Inter", sans-serif' }}>Completed</span>
              </div>
            ) : (
              <button
                onClick={markComplete}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px', background: 'linear-gradient(135deg, #1E4DD7, #3B75FF)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: '"Inter", sans-serif', boxShadow: '0px 4px 14px rgba(30,77,215,0.28)' }}
              >
                <CheckCircle2 size={13} color="#fff" />
                <span>Mark Complete</span>
              </button>
            )}
          </div>
        </header>

        {/* ── Main ── */}
        <main style={{ maxWidth: 720, margin: '0 auto', padding: '48px 20px 80px', boxSizing: 'border-box' }}>

          {/* Lesson title + progress — outside the box */}
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ margin: '0 0 16px', fontSize: 32, fontWeight: 800, color: '#18181B', letterSpacing: '-0.8px', fontFamily: '"DM Sans", sans-serif', lineHeight: 1.2 }}>
              {lesson.title}
            </h1>
            <div style={{ height: 5, background: '#F0F2FF', borderRadius: 3, overflow: 'hidden', marginBottom: 8 }}>
              <div style={{ width: `${modulePct}%`, height: '100%', background: 'linear-gradient(90deg, #1E4DD7, #3B75FF)', borderRadius: 3, transition: 'width 0.5s' }} />
            </div>
            <p style={{ margin: 0, fontSize: 12, color: '#B0B4C4' }}>
              Lesson {lIdx + 1} of {moduleLessonCount} · {modulePct}% complete in this module
            </p>
          </div>

          {/* ── Protected content box ── */}
          <div style={{ background: '#F9FAFB', border: '1px solid #E8ECFF', borderRadius: 24, padding: '32px 32px 24px', boxShadow: '0 1px 16px rgba(30,77,215,0.05)', marginBottom: 32 }}>

            {/* AI Key Points */}
            <div style={{ background: 'linear-gradient(135deg, #EBF1FF 0%, #E4EEFF 100%)', borderRadius: 16, padding: 24, border: '1px solid #CDDAFF', marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: summary || summarising ? 14 : 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #1E4DD7, #3B75FF)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Sparkles size={13} color="#fff" />
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#1E4DD7', fontFamily: '"DM Sans", sans-serif' }}>AI Key Points</span>
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
                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: 'linear-gradient(135deg, #1E4DD7, #3B75FF)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: summarising ? 'not-allowed' : 'pointer', opacity: summarising ? 0.6 : 1, fontFamily: '"Inter", sans-serif' }}
                  >
                    {summarising
                      ? <><span style={{ width: 11, height: 11, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} /> Generating…</>
                      : <><Sparkles size={11} /> Generate</>}
                  </button>
                )}
              </div>
              {!summary && !summarising && (
                <p style={{ margin: 0, fontSize: 13, color: '#4D5EA8', lineHeight: 1.55 }}>Generate a quick AI summary of the key points in this lesson.</p>
              )}
              {summarising && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#4D5EA8', fontSize: 13 }}>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', border: '2px solid #9BB3FF', borderTopColor: '#1E4DD7', animation: 'spin 0.8s linear infinite' }} />
                  Analysing lesson…
                </div>
              )}
              {summary && summary.length > 0 && (
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {summary.map((point, i) => (
                    <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(30,77,215,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1, fontSize: 11, fontWeight: 700, color: '#1E4DD7' }}>{i + 1}</span>
                      <span style={{ fontSize: 14, color: '#2D3A6B', lineHeight: 1.6 }}>{point}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Lesson content */}
            <div style={{ marginBottom: 28 }}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ children }) => <p style={{ margin: '0 0 20px', fontSize: 16, color: '#2D2D35', lineHeight: 1.8, fontWeight: 400, textAlign: 'justify' }}>{children}</p>,
                  strong: ({ children }) => <strong style={{ color: '#18181B', fontWeight: 700 }}>{children}</strong>,
                  h2: ({ children }) => (
                    <div style={{ background: '#FFFFFF', borderRadius: 14, padding: '16px 20px', border: '1px solid #ECEEFF', boxShadow: '0px 1px 6px rgba(30,77,215,0.04)', margin: '8px 0 16px' }}>
                      <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#18181B', fontFamily: '"DM Sans", sans-serif' }}>{children}</h2>
                    </div>
                  ),
                  h3: ({ children }) => <h3 style={{ margin: '20px 0 8px', fontSize: 15, fontWeight: 700, color: '#18181B', fontFamily: '"DM Sans", sans-serif' }}>{children}</h3>,
                  ul: ({ children }) => <ul style={{ margin: '0 0 20px', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>{children}</ul>,
                  ol: ({ children }) => <ol style={{ margin: '0 0 20px', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, counterReset: 'list-counter' }}>{children}</ol>,
                  li: ({ children }) => (
                    <li style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <span style={{ width: 22, height: 22, borderRadius: '50%', background: '#EBF1FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#1E4DD7' }} />
                      </span>
                      <span style={{ fontSize: 15, color: '#2D2D35', lineHeight: 1.65 }}>{children}</span>
                    </li>
                  ),
                  blockquote: ({ children }) => (
                    <div style={{ background: 'linear-gradient(135deg, #FFF7E6, #FFF3CD)', borderRadius: 16, padding: 20, border: '1px solid #FDE68A', margin: '8px 0 20px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <AlertTriangle size={16} color="#D97706" style={{ flexShrink: 0, marginTop: 2 }} />
                      <div style={{ fontSize: 15, color: '#78350F', lineHeight: 1.65 }}>{children}</div>
                    </div>
                  ),
                  a: ({ href, children }) => (
                    <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: '#1E4DD7', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: 2 }}>{children}</a>
                  ),
                }}
              >
                {processedContent}
              </ReactMarkdown>
            </div>

            {/* Key Takeaways */}
            {takeaways?.length > 0 && (
              <div style={{ background: '#FFFFFF', borderRadius: 16, padding: 24, border: '1px solid #ECEEFF', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <CheckCircle2 size={18} color="#21C474" />
                  <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#18181B', fontFamily: '"DM Sans", sans-serif' }}>Key Takeaways</h3>
                </div>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {takeaways.map((t, i) => (
                    <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '10px 14px', background: '#F8FFF9', borderRadius: 10, border: '1px solid #D8F5E6' }}>
                      <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#E8F9EE', border: '2px solid #A7F3C5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#21C474' }} />
                      </div>
                      <span style={{ fontSize: 14, color: '#2D2D35', lineHeight: 1.6 }}>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Step */}
            {lesson.action_step && (
              <div style={{ background: 'linear-gradient(135deg, #EBF1FF 0%, #E4EEFF 100%)', borderRadius: 16, padding: 24, border: '1px solid #CDDAFF', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #1E4DD7, #3B75FF)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Target size={14} color="#fff" />
                  </div>
                  <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#1E4DD7', fontFamily: '"DM Sans", sans-serif' }}>Your Action Step</h3>
                </div>
                <p style={{ margin: 0, fontSize: 15, color: '#2D3A6B', lineHeight: 1.65 }}>{lesson.action_step}</p>
              </div>
            )}

            {/* Sources */}
            {sources?.length > 0 && (
              <div style={{ background: '#FFFFFF', borderRadius: 16, padding: 24, border: '1px solid #ECEEFF', marginBottom: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <ExternalLink size={15} color="#82858A" />
                  <h3 style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#82858A', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Official Sources</h3>
                </div>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {sources.map((s, i) => (
                    <li key={i}>
                      <a href={s.url || s} target="_blank" rel="noopener noreferrer"
                        style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#1E4DD7', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
                        <ExternalLink size={12} color="#9BB3FF" style={{ flexShrink: 0 }} />
                        {s.label || s.url || s}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>{/* end protected box */}

          {/* ── Bottom Navigation ── */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 28, borderTop: '1px solid #ECEEFF' }}>
            <button
              onClick={goPrev}
              disabled={isFirst}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', background: '#FFFFFF', border: '1.5px solid #E4E8FF', borderRadius: 12, fontSize: 14, fontWeight: 600, color: '#4D4D56', cursor: isFirst ? 'not-allowed' : 'pointer', opacity: isFirst ? 0.3 : 1, fontFamily: '"Inter", sans-serif', transition: 'border-color 0.15s' }}
            >
              <ChevronLeft size={14} />
              <span>Previous</span>
            </button>

            <button
              onClick={goNext}
              disabled={!completed}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px',
                background: completed ? 'linear-gradient(135deg, #1E4DD7, #3B75FF)' : '#F0F2FF',
                border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 600,
                color: completed ? '#FFFFFF' : '#B0B4C4',
                cursor: completed ? 'pointer' : 'not-allowed',
                fontFamily: '"Inter", sans-serif',
                boxShadow: completed ? '0px 6px 20px rgba(30,77,215,0.3)' : 'none',
                transition: 'all 0.15s',
              }}
            >
              {completed
                ? <>{isLastInModule ? 'Take Module Quiz' : 'Next Lesson'} <ArrowRight size={14} /></>
                : <><Lock size={13} /> Complete to continue</>}
            </button>
          </div>
        </main>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  )
}
