import { generateAIResponse } from '../../lib/ai'
import { SKILLS } from '../../lib/skills'
import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  try {
    const authHeader = req.headers.authorization
    const token = authHeader?.replace('Bearer ', '')
    if (!token) return res.status(401).end()

    const anonClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
    const { data: { user } } = await anonClient.auth.getUser(token)
    if (!user) return res.status(401).end()

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      { global: { headers: { Authorization: authHeader } } }
    )

    const { lessonTitle, moduleTitle, curriculumTitle, destination, segment, curriculumId, moduleIndex, lessonIndex } = req.body

    // Step 1 — Generate rich, structured lesson content following the persona rules
    // Build a targeted search query instead of using the full prompt as the search string
    const lessonSearchQuery = `${lessonTitle} ${destination} ${segment} requirements ${new Date().getFullYear()}`

    const content = await generateAIResponse(
      [
        {
          role: 'user',
          content: `Write a Master Migration Lesson on "${lessonTitle}" for a Nigerian ${segment} planning to move to ${destination}.

CONTEXT:
Part of Module: "${moduleTitle}"
Curriculum: "${curriculumTitle}"

MANDATORY STRUCTURE:
Exactly follow the SKILLS.LESSON_WRITER framework:
1. **Lesson Title**
2. **Lesson Purpose**
3. **Why it matters** (specific to a ${segment})
4. **Prerequisites**
5. **Main Explanation** (Rich markdown, bold key terms, official links)
6. **Step-by-step action** (Actionable list)
7. **Common mistakes** (Nigerian-specific context)
8. **Quick Check** (Readiness self-assessment)
9. **Next Action** (Immediate next step)

REAL DATA REQUIREMENTS:
- Use the KNOWLEDGE BASE CONTEXT for official document names, licensing bodies, and procedural rules.
- Use the REAL-TIME SEARCH RESULTS for current fees (NGN and foreign currency), timelines, salary thresholds, and verified URLs.
- NIGERIAN CONTEXT: NYSC, NIN, document notarisation in Lagos/Abuja, etc.
- If a fee or deadline is not in the search results, say "verify the current amount at [official site]" — never guess.`
        }
      ],
      SKILLS.LESSON_WRITER,
      { enrich: true, searchQuery: lessonSearchQuery }
    )

    // Step 2 — Generate metadata for the UI components
    const metaResponse = await generateAIResponse(
      [
        {
          role: 'user',
          content: `Extract structured metadata from this lesson about "${lessonTitle}".

LESSON CONTENT:
${content}

Return ONLY a JSON object with these exact fields:
{
  "key_takeaways": [
    "3 to 5 points — each must be 1-2 sentences with a specific fact, requirement, exam name, fee, timeline, or body name from the lesson. Someone who reads ONLY these points must understand what to do and what it involves. Never vague. Start each with an action word or clear fact.",
    "...",
    "..."
  ],
  "action_step": "The single most important next step — be specific. Include where to go, what to submit, or what to book.",
  "sources": [{"label": "Official body or website name", "url": "https://..."}]
}

IMPORTANT: key_takeaways must contain real specifics from the lesson (names, numbers, timelines). Do not write generic advice.`
        }
      ],
      'Return ONLY a valid JSON object. No markdown, no extra text.',
      { enrich: false }
    )

    const meta = JSON.parse(metaResponse.replace(/```json/g, '').replace(/```/g, '').trim())

    const lessonData = {
      title: lessonTitle,
      content,
      key_takeaways: meta.key_takeaways || [],
      action_step: meta.action_step || '',
      sources: meta.sources || [],
    }

    // Save to Supabase for persistence
    const { data: saved, error: saveError } = await supabase
      .from('lesson_content')
      .upsert({
        curriculum_id: curriculumId,
        module_index: moduleIndex,
        lesson_index: lessonIndex,
        title: lessonData.title,
        content: lessonData.content,
        key_takeaways: lessonData.key_takeaways,
        action_step: lessonData.action_step,
        sources: lessonData.sources,
      }, { onConflict: 'curriculum_id,module_index,lesson_index' })
      .select()
      .maybeSingle()

    if (saveError) console.error('Supabase save error:', saveError.message)

    return res.status(200).json({ lesson: saved || lessonData })
  } catch (error) {
    console.error('Lesson gen error:', error.message)
    return res.status(500).json({ error: error.message })
  }
}
