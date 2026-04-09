import OpenAI from 'openai'
import { createClient } from '@supabase/supabase-js'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const authHeader = req.headers.authorization
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    authHeader ? { global: { headers: { Authorization: authHeader } } } : {}
  )

  const { curriculumId, moduleIndex } = req.body
  if (!curriculumId || moduleIndex === undefined) {
    return res.status(400).json({ error: 'Missing curriculumId or moduleIndex' })
  }

  // Load curriculum
  const { data: curriculum } = await supabase
    .from('curricula')
    .select('*')
    .eq('id', curriculumId)
    .maybeSingle()

  if (!curriculum) return res.status(404).json({ error: 'Curriculum not found' })

  const module = curriculum.modules[parseInt(moduleIndex)]
  if (!module) return res.status(404).json({ error: 'Module not found' })

  // Load all lesson content for this module
  const { data: lessons } = await supabase
    .from('lesson_content')
    .select('title, content, key_takeaways')
    .eq('curriculum_id', curriculumId)
    .eq('module_index', parseInt(moduleIndex))
    .order('lesson_index', { ascending: true })

  const lessonSummary = (lessons || []).map((l, i) => {
    const takeaways = typeof l.key_takeaways === 'string'
      ? JSON.parse(l.key_takeaways)
      : (l.key_takeaways || [])
    return `Lesson ${i + 1}: ${l.title}\nKey takeaways: ${takeaways.slice(0, 4).join(' | ')}`
  }).join('\n\n')

  const lessonTitles = module.lessons.map(l => l.title).join(', ')

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.5,
      max_tokens: 3000,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `You are an expert migration education assessor. You write clear, fair multiple-choice quiz questions that test genuine understanding — not trick questions. Questions should cover the most important practical knowledge from the lessons. Always write 4 answer options (A, B, C, D) with exactly one correct answer.`,
        },
        {
          role: 'user',
          content: `Generate exactly 10 multiple-choice questions for this module quiz.

CURRICULUM: ${curriculum.title}
DESTINATION: ${curriculum.destination}
SEGMENT: ${curriculum.segment}
MODULE: ${module.title}
LESSONS COVERED: ${lessonTitles}

LESSON CONTENT SUMMARY:
${lessonSummary || 'Use the lesson titles and module context to write relevant questions.'}

RULES:
- Questions must test practical, actionable knowledge relevant to migrating to ${curriculum.destination}
- Mix question difficulty: 4 easy, 4 medium, 2 harder
- No trick questions — test real understanding
- Keep each question concise (1-2 sentences max)
- Options should be plausible, not obviously wrong
- Write from the perspective of a Nigerian professional in the ${curriculum.segment} category

Return ONLY this JSON structure:
{
  "moduleTitle": "${module.title}",
  "questions": [
    {
      "id": 1,
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Brief explanation of why this is correct (1-2 sentences)."
    }
  ]
}`,
        },
      ],
    })

    const quiz = JSON.parse(completion.choices[0]?.message?.content)
    return res.status(200).json({ quiz })
  } catch (error) {
    console.error('Quiz generation error:', error.message)
    return res.status(500).json({ error: error.message })
  }
}
