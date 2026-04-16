import { getEmbedding } from '../../../lib/embeddings'
import { createClient } from '@supabase/supabase-js'

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

export default async function handler(req, res) {
  const isAdmin = await verifyAdmin(req)
  if (!isAdmin) return res.status(403).json({ success: false, error: 'Forbidden' })

  const client = adminClient()

  if (req.method === 'GET') {
    const { data, error } = await client
      .from('migration_documents')
      .select('id, country, category, source_url, content, last_updated')
      .order('last_updated', { ascending: false })
    if (error) return res.status(500).json({ success: false, error: error.message })
    return res.status(200).json({ success: true, documents: data })
  }

  if (req.method === 'POST') {
    const { content, country, category, source_url } = req.body
    if (!content || !country || !category) {
      return res.status(400).json({ success: false, error: 'content, country and category are required' })
    }
    try {
      const embedding = await getEmbedding(content)
      const { error } = await client.from('migration_documents').insert({
        content, embedding, country, category,
        source_url: source_url || null,
        metadata: { country, category, source_url },
      })
      if (error) throw new Error(error.message)
      return res.status(200).json({ success: true })
    } catch (err) {
      console.error('Add document error:', err)
      return res.status(500).json({ success: false, error: err.message })
    }
  }

  if (req.method === 'DELETE') {
    const { id } = req.body
    if (!id) return res.status(400).json({ success: false, error: 'id is required' })
    const { error } = await client.from('migration_documents').delete().eq('id', id)
    if (error) return res.status(500).json({ success: false, error: error.message })
    return res.status(200).json({ success: true })
  }

  return res.status(405).json({ message: 'Method not allowed' })
}
