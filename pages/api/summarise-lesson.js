import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { content, title } = req.body

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.3,
      max_tokens: 400,
      response_format: { type: 'json_object' },
      messages: [{
        role: 'user',
        content: `Summarise this migration lesson titled "${title}" into exactly 6 bullet points.

Each bullet point must be:
- ONE sentence maximum — short and scannable
- Capture one key fact, requirement, fee, or step from the lesson
- Include a real number, timeline, or specific detail where possible
- Written so someone who reads ONLY the bullets gets the essential picture fast

Think of these as the "if you read nothing else, read this" version of the lesson.

LESSON:
${content}

Return a JSON object with one field: "points" — array of exactly 6 short strings.`
      }],
    })

    const result = JSON.parse(completion.choices[0]?.message?.content)
    return res.status(200).json({ points: result.points || [] })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
