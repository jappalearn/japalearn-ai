import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { content, title } = req.body

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.3,
      max_tokens: 700,
      response_format: { type: 'json_object' },
      messages: [{
        role: 'user',
        content: `Summarise this migration lesson titled "${title}" into exactly 6 bullet points.

RULES — each bullet point must:
- Be 1–2 sentences. Not longer, not shorter than one complete thought.
- Contain enough information that someone who ONLY reads the bullets walks away knowing what to do, what it costs, what the deadline is, or what the requirement is — without needing to read the full lesson.
- Include specific details: exact names of exams, bodies, visa types, fees, timelines, minimum scores, or document names found in the lesson. Never be vague.
- Be written in plain English for a Nigerian professional preparing to relocate abroad.
- Start with an action word or a clear statement of fact — not "This lesson covers..." or "You will learn..."

BAD example: "You need to prepare your documents." (too vague — no one can act on this)
GOOD example: "You need a police clearance certificate from the Nigeria Police Force — apply at the Force CID Annex in Abuja or Lagos State CID, costs ₦15,000–₦25,000, and takes 2–4 weeks."

LESSON:
${content}

Return a JSON object with one field: "points" — array of exactly 6 strings.`
      }],
    })

    const result = JSON.parse(completion.choices[0]?.message?.content)
    return res.status(200).json({ points: result.points || [] })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
