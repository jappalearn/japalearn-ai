import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { content, title } = req.body

  try {
    const completion = await groq.chat.completions.create({
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
      model: 'llama-3.1-8b-instant',
      temperature: 0.3,
      max_tokens: 400,
      response_format: { type: 'json_object' },
    })

    const result = JSON.parse(completion.choices[0]?.message?.content)
    return res.status(200).json({ points: result.points || [] })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
