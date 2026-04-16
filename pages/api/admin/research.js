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
  const { data: admin } = await client
    .from('admin_users')
    .select('role, status')
    .eq('id', user.id)
    .maybeSingle()
  return admin?.status === 'approved'
}

/**
 * GOV.UK Specialized Fetcher
 * Fetches all parts of a guide if applicable
 */
async function fetchGovUkContent(url) {
  const path = new URL(url).pathname
  const apiUrl = `https://www.gov.uk/api/content${path}`
  
  const res = await fetch(apiUrl)
  if (!res.ok) throw new Error('Failed to fetch from GOV.UK API')
  const data = await res.json()
  
  let fullText = ''
  const title = data.title || ''
  const updatedAt = data.public_updated_at || ''
  
  // High-density content extraction from GOV.UK structure
  if (data.details?.parts && data.details.parts.length > 0) {
    // It's a multi-part guide
    fullText = data.details.parts.map(p => `## ${p.title}\n${p.body}`).join('\n\n')
  } else if (data.details?.body) {
    // It's a single page
    fullText = data.details.body
  }
  
  // Remove HTML tags (simple version)
  fullText = fullText.replace(/<[^>]*>?/gm, '')
  
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
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch website')
  const html = await res.text()
  
  // Strip script and style tags
  const cleanHtml = html
    .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gm, '')
    .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gm, '')
    .replace(/<[^>]*>?/gm, ' ') // Strip remaining tags
    .replace(/\s+/g, ' ') // Collapse whitespace
    .trim()

  return {
    content: cleanHtml.substring(0, 15000), // Cap for AI safety
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

    // Use AI to Distill and Categorize
    const distillationPrompt = `
      Extract and summarize the EXACT migration facts from the text below. 
      
      RULES:
      1. Create a "Master Guide" in clean Markdown.
      2. Include: Requirements, Fees, Timelines, and Mandatory Documents.
      3. Tone: Factual and professional.
      4. Detect the COUNTRY and CATEGORY (e.g. visa, scholarship, banking, licensing).
      5. Detect the "Last Updated" date if visible in the text.
      6. Focus ONLY on migration facts for Nigerians.
      
      TEXT TO DISTILL:
      ${rawData.content}
    `

    const aiResponse = await generateAIResponse(
      [{ role: 'user', content: distillationPrompt }],
      'You are a Migration Data Scientist. Extract facts with 100% accuracy. Return ONLY JSON.',
      { enrich: false }
    )

    // Parse AI JSON response
    // AI might wrap in markdown blocks, clean it
    const cleanJson = aiResponse.replace(/```json/g, '').replace(/```/g, '').trim()
    const distilled = JSON.parse(cleanJson)

    return res.status(200).json({
      success: true,
      draft: {
        content: distilled.markdown_guide || distilled.content || rawData.content.substring(0, 500),
        country: distilled.country || '',
        category: distilled.category || '',
        last_updated: distilled.last_updated || rawData.date || new Date().toISOString(),
        source_url: url
      }
    })

  } catch (error) {
    console.error('Research error:', error)
    return res.status(500).json({ success: false, error: error.message })
  }
}
