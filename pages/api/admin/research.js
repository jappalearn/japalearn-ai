import { createClient } from '@supabase/supabase-js'
import { generateAIResponse } from '../../../lib/ai'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

function adminClient() {
  return createClient(supabaseUrl, serviceKey)
}

async function verifyAdmin(req) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return false
  const client = adminClient()
  const { data: { user } } = await client.auth.getUser(token)
  if (!user) return false
  // Master Super Admin Override
  if (user.email === 'jappalearn@gmail.com') return true
  const { data: admin } = await client
    .from('admin_users')
    .select('role, status')
    .eq('id', user.id)
    .maybeSingle()
  return admin?.status === 'approved'
}

/**
 * Strip HTML tags cleanly, preserving whitespace structure
 */
function stripHtml(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gm, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gm, '')
    .replace(/<\/?(h[1-6]|p|li|dt|dd|tr|th|td|div|section|article|header|footer|blockquote)[^>]*>/gm, '\n')
    .replace(/<br\s*\/?>/gm, '\n')
    .replace(/<[^>]*>/gm, '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').replace(/&#39;/g, "'").replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

/**
 * GOV.UK Specialized Fetcher — handles both single-page and multi-part guides
 */
async function fetchGovUkContent(url) {
  const path = new URL(url).pathname.replace(/\/$/, '')
  const apiUrl = `https://www.gov.uk/api/content${path}`

  const res = await fetch(apiUrl, { headers: { 'Accept': 'application/json' } })
  if (!res.ok) throw new Error(`GOV.UK API returned ${res.status} for ${apiUrl}`)
  const data = await res.json()

  const title = data.title || ''
  const updatedAt = data.public_updated_at || ''
  let sections = []

  if (data.details?.parts?.length > 0) {
    // Multi-part guide — extract every section
    sections = data.details.parts.map(p => `## ${p.title}\n${stripHtml(p.body || '')}`)
  } else if (data.details?.body) {
    // Single-page guide
    sections = [stripHtml(data.details.body)]
  } else if (data.details?.introduction) {
    sections = [stripHtml(data.details.introduction)]
  }

  // Also grab any intro/overview text outside of parts
  if (data.details?.introduction && data.details?.parts?.length > 0) {
    sections.unshift(`## Overview\n${stripHtml(data.details.introduction)}`)
  }

  const fullText = `# ${title}\n\n${sections.join('\n\n')}`

  return {
    title,
    content: fullText,
    date: updatedAt,
    source_url: url
  }
}

/**
 * Generic Website Fetcher
 */
async function fetchGenericContent(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
  if (!res.ok) throw new Error(`Failed to fetch website (${res.status})`)
  const html = await res.text()
  return {
    content: stripHtml(html).substring(0, 20000),
    title: (html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] || '').trim(),
    source_url: url
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' })

  const isAdmin = await verifyAdmin(req)
  if (!isAdmin) return res.status(403).json({ error: 'Forbidden' })

  const { url } = req.body
  if (!url) return res.status(400).json({ error: 'URL is required' })

  try {
    let rawData
    const isGovUk = url.includes('gov.uk')

    if (isGovUk) {
      rawData = await fetchGovUkContent(url)
    } else {
      rawData = await fetchGenericContent(url)
    }

    // Truncate to 18k chars to stay within AI token limits
    const contentForAI = rawData.content.substring(0, 18000)

    const distillationPrompt = `You are a Migration Content Expert for JapaLearn AI, a platform helping Nigerians migrate abroad.

Analyse the following text from an official government or immigration website and extract ALL relevant migration facts into a detailed, structured Markdown guide.

INSTRUCTIONS:
- Cover EVERY section from the source: eligibility, requirements, fees, timelines, documents, endorsement bodies, application steps, and after-visa info.
- Write full sentences — do NOT just list bullet points. Aim for a comprehensive guide a Nigerian professional can act on.
- Detect: COUNTRY (e.g. "UK"), CATEGORY (one of: visa, scholarship, student-visa, medical-licensing, professional-licensing, post-study-work, proof-of-funds, cost-of-living, job-search, freelance-nomad, documents, banking).
- Detect the LAST UPDATED date from the text if present, otherwise leave blank.

RESPOND WITH VALID JSON ONLY using this exact structure:
{
  "country": "UK",
  "category": "visa",
  "last_updated": "2024-01-15",
  "markdown_guide": "# Global Talent Visa — UK\\n\\n## Overview\\n..."
}

SOURCE TEXT:
${contentForAI}`

    const aiResponse = await generateAIResponse(
      [{ role: 'user', content: distillationPrompt }],
      'You are a migration data extraction assistant. Always respond with valid JSON only — no markdown fences, no preamble.',
      { enrich: false }
    )

    // Robustly parse — strip any markdown fences the AI might still add
    let distilled
    try {
      const cleanJson = aiResponse
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```\s*$/i, '')
        .trim()
      distilled = JSON.parse(cleanJson)
    } catch (parseErr) {
      console.error('AI JSON parse failed, using raw content fallback', parseErr)
      // Return the raw extracted content so admin can still use it
      return res.status(200).json({
        success: true,
        draft: {
          content: rawData.content,
          country: url.includes('gov.uk') ? 'UK' : '',
          category: '',
          last_updated: rawData.date || '',
          source_url: url
        }
      })
    }

    return res.status(200).json({
      success: true,
      draft: {
        content: distilled.markdown_guide || distilled.content || rawData.content,
        country: distilled.country || (url.includes('gov.uk') ? 'UK' : ''),
        category: distilled.category || '',
        last_updated: distilled.last_updated || rawData.date || '',
        source_url: url
      }
    })

  } catch (error) {
    console.error('Research error:', error)
    return res.status(500).json({ success: false, error: error.message })
  }
}

