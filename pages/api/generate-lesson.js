import Groq from 'groq-sdk'
import { createClient } from '@supabase/supabase-js'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

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
    const contentCompletion = await groq.chat.completions.create({
      messages: [{
        role: 'system',
        content: `You are a world-class migration education writer. You write for Nigerians who are intelligent and motivated but may have zero prior knowledge of immigration systems. You never assume the reader knows what a visa category, government body, or immigration term means — you always explain it first. You write like a brilliant, patient friend who has been through the process and is sitting across the table walking someone through it. You use rich markdown formatting to make content easy to scan and navigate. You embed real hyperlinks to official government sources inline.`
      }, {
        role: 'user',
        content: `Write an extremely detailed, comprehensive lesson about "${lessonTitle}" for a Nigerian ${segment} planning to move to ${destination}.

Part of: "${moduleTitle}" in "${curriculumTitle}"

OPENING STYLE: ${openingStyle}

TONE: Write for someone intelligent who knows nothing about immigration. Explain every term the first time you use it. Be thorough — leave nothing out. This should feel like the most complete resource available on this topic for a Nigerian reader.

FORMAT — use rich markdown throughout:
- **Bold** every key term, fee, deadline, threshold, and document name on first appearance
- Bullet points (-) for lists of requirements, documents, criteria, or options
- Numbered steps (1.) for sequential processes
- Inline links [Official Source Name](https://real-url.gov) — include at least 4-5 real official government links embedded naturally in the text
- Use headers (##) to break the lesson into clear sections
- Blockquotes (>) for important warnings or critical notes

STRUCTURE — cover ALL of these sections with a header for each:
## What Is [Topic] and Why It Matters
Explain what this topic is in plain English. Why does it exist? Why does it matter at this stage of the journey? What happens if you skip it or get it wrong?

## Who Qualifies and Who Doesn't
Break down the exact eligibility criteria. Use bullet points. Include real thresholds, scores, minimums. Be specific about what counts and what doesn't.

## Exactly What You Need (Documents & Requirements)
Full list of every document, certificate, or piece of evidence required. For each one, explain what it is, where a Nigerian gets it, how long it takes, and approximate cost in both GBP/USD and NGN.

## Step-by-Step: How the Process Works
Number every step. Include real timelines for each step. Include the exact portal, website, or office where each step happens. Link to official sources.

## Costs and Timelines: The Full Picture
Complete cost breakdown including application fees, NHS surcharge, biometrics, document costs, courier fees — everything. Give NGN equivalents. Give realistic total timelines.

## What Nigerians Get Wrong Here
The 4-5 most common mistakes made by Nigerian applicants specifically on this topic. Be direct and specific.

## What Success Looks Like
What does completing this stage give you? What does it unlock? What is the next step?

REAL DATA REQUIREMENTS:
- Every fee must be in both GBP/USD and approximate NGN equivalent
- Every timeline must be the real current figure from official sources
- Every document name must be the exact official name
- Nigerian context throughout: NYSC discharge, Nigerian passport, WAEC/NECO, NIN, notarisation in Lagos/Abuja

Write 900-1200 words minimum. Be thorough. Leave nothing out. This is the definitive resource.`
      }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.6,
      max_tokens: 3000,
    })

    const content = contentCompletion.choices[0]?.message?.content?.trim()

    // Step 2 — Generate detailed takeaways, action step, and sources
    const metaCompletion = await groq.chat.completions.create({
      messages: [{
        role: 'user',
        content: `For this migration lesson titled "${lessonTitle}" for a Nigerian ${segment} moving to ${destination}, provide detailed metadata.

Return a JSON object with:

"key_takeaways": array of exactly 4 short bullet points. Each must be ONE concise sentence — maximum 15 words. Include a real number, fee, or threshold where possible. Think of these as quick-scan reminders of the most critical facts.

"action_step": exactly ONE sentence. The single most important thing to do right now. Include a real URL or specific place if possible. Keep it under 25 words.

"sources": array of 3-4 objects each with "label" (the full official name of the source) and "url" (a real, working official government URL relevant to ${destination} immigration for this specific topic).`
      }],
      model: 'llama-3.1-8b-instant',
      temperature: 0.2,
      max_tokens: 800,
      response_format: { type: 'json_object' },
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
