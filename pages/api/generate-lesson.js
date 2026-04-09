import OpenAI from 'openai'
import { createClient } from '@supabase/supabase-js'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// Vary the opening style so no two lessons start the same way
const openingStyles = [
  'Start with a direct statement of what is at stake for this person right now.',
  'Start with a surprising or counterintuitive fact about this topic that most Nigerians get wrong.',
  'Start by describing a common scenario — paint a picture of what happens when someone does this wrong.',
  'Start with the single most important number, threshold, or deadline related to this topic.',
  'Start by explaining why this step is the one that trips up most applicants.',
]

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  try {
  const authHeader = req.headers.authorization
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    authHeader ? { global: { headers: { Authorization: authHeader } } } : {}
  )

  const { lessonTitle, moduleTitle, curriculumTitle, destination, segment, curriculumId, moduleIndex, lessonIndex } = req.body

  const mIdx = parseInt(moduleIndex) || 0
  const lIdx = parseInt(lessonIndex) || 0
  const openingStyle = openingStyles[(mIdx + lIdx) % openingStyles.length]

  // Step 1 — Generate rich formatted lesson content
    const contentCompletion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.6,
      max_tokens: 3000,
      messages: [{
        role: 'system',
        content: `You are a world-class migration education writer producing structured, source-backed lessons that translate immigration policy into clear actions for Nigerians relocating abroad.

STANDARDS YOU MUST MEET:
- PRACTICAL ONLY. No fluff, no filler, no motivational language. Every sentence must teach something actionable.
- SECOND-PERSON DIRECT. Write as "you" throughout. Clear, direct, no passive voice.
- EXPLAIN BEFORE INSTRUCTING. Define every immigration term, body, or concept the first time it appears — the reader may have zero prior knowledge.
- OFFICIAL SOURCES EMBEDDED. Real government URLs linked inline throughout the lesson.
- NIGERIAN CONTEXT ALWAYS. Nigerian passport, WAEC/NECO results, NYSC discharge letter, NIN, Lagos/Abuja notarisation, NGN cost equivalents — use these throughout.
- OUTCOME-LINKED. Every section must connect back to what completing this step unlocks.
- HIGHLIGHT FAILURE POINTS. Be specific about what Nigerians get wrong and why it kills applications.
- NO GENERIC CONTENT. This lesson is for THIS person (${segment} going to ${destination}). Every example, cost, and step must reflect their exact situation.`
      }, {
        role: 'user',
        content: `Write a comprehensive, structured lesson about "${lessonTitle}" for a Nigerian ${segment} planning to move to ${destination}.

Part of: "${moduleTitle}" in "${curriculumTitle}"

OPENING STYLE: ${openingStyle}

FORMAT — use rich markdown throughout:
- **Bold** every key term, fee, deadline, threshold, and document name on first appearance
- Bullet points (-) for lists of requirements, documents, criteria, or options
- Numbered steps (1.) for sequential processes
- Inline links [Official Source Name](https://real-url.gov) — at least 4–5 real official government links embedded naturally
- Headers (##) for each section
- Blockquotes (>) for critical warnings or must-know notes

STRUCTURE — include ALL sections in this order:

## What Is [Topic] and Why It Matters
What is this, in plain English? Why does it exist? What happens if you skip it or get it wrong? Link it to a specific migration outcome.

## Who Qualifies and Who Doesn't
Exact eligibility criteria. Real thresholds, scores, minimums. Bullet points. Be specific about what counts and what doesn't for a Nigerian applicant.

## Exactly What You Need (Documents & Requirements)
Every document, certificate, and piece of evidence required. For each: what it is, where a Nigerian gets it, how long it takes, approximate cost in GBP/USD and NGN.

## Step-by-Step: How the Process Works
Number every step. Include real timelines. Name the exact portal, website, or office. Link to official sources at each step.

## Costs and Timelines: The Full Picture
Complete cost breakdown: application fees, surcharges, biometrics, document costs, courier fees. NGN equivalents for all. Realistic total timeline.

## What Nigerians Get Wrong Here
The 4–5 most common mistakes Nigerian applicants make on this specific topic. Direct and specific — not generic advice.

## What Success Looks Like
What does completing this stage give you? What does it unlock? What is your next step immediately after?

REAL DATA REQUIREMENTS:
- Every fee in both GBP/USD and approximate NGN equivalent
- Every timeline from current official sources
- Every document by its exact official name
- Nigerian context: NYSC discharge, Nigerian passport, WAEC/NECO, NIN, notarisation in Lagos/Abuja

Write 900–1200 words. Be thorough. This is the definitive resource for this topic for this person.`
      }],
    })

    const content = contentCompletion.choices[0]?.message?.content?.trim()

    // Step 2 — Generate detailed takeaways, action step, and sources
    const metaCompletion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.2,
      max_tokens: 800,
      response_format: { type: 'json_object' },
      messages: [{
        role: 'user',
        content: `For this migration lesson titled "${lessonTitle}" for a Nigerian ${segment} moving to ${destination}, provide structured metadata.

Return a JSON object with exactly these fields:

"key_takeaways": array of EXACTLY 3 items — no more, no fewer. Each must be ONE concise sentence, maximum 15 words. Include a real number, fee, threshold, or deadline where possible. These are quick-scan reminders of the 3 most critical facts from this lesson.

"action_step": exactly ONE sentence. The single most important thing this person must do right now. Include a real URL or specific named resource if possible. Maximum 25 words. Tied to this person's exact situation as a ${segment} going to ${destination}.

"sources": array of 3–4 objects. Each has "label" (full official name of the source) and "url" (real, working government URL specific to ${destination} immigration and this lesson topic).`
      }],
    })

    const meta = JSON.parse(metaCompletion.choices[0]?.message?.content)

    const lessonData = {
      title: lessonTitle,
      content,
      key_takeaways: meta.key_takeaways || [],
      action_step: meta.action_step || '',
      sources: meta.sources || [],
    }

    // Save to Supabase
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
