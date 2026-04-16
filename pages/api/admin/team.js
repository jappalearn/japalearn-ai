import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

function adminClient() {
  return createClient(supabaseUrl, serviceKey)
}

async function getSuperAdmin(req) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return null
  const client = adminClient()
  const { data: { user } } = await client.auth.getUser(token)
  if (!user) return null
  const { data: profile } = await client
    .from('profiles')
    .select('id, admin_role, admin_status, is_admin')
    .eq('id', user.id)
    .maybeSingle()
  if (!profile?.is_admin || profile.admin_status !== 'approved' || profile.admin_role !== 'super_admin') return null
  return { id: user.id, email: user.email, ...profile }
}

export default async function handler(req, res) {
  const caller = await getSuperAdmin(req)
  if (!caller) return res.status(403).json({ error: 'Forbidden' })

  const client = adminClient()

  // GET — list team members + unused invites
  if (req.method === 'GET') {
    const [{ data: members }, { data: invites }] = await Promise.all([
      client.from('profiles')
        .select('id, full_name, admin_role, admin_status, created_at')
        .eq('is_admin', true)
        .order('created_at', { ascending: true }),
      client.from('admin_invites')
        .select('id, email, role, token, created_at')
        .is('used_at', null)
        .order('created_at', { ascending: false }),
    ])
    return res.json({ success: true, members: members || [], invites: invites || [] })
  }

  if (req.method === 'POST') {
    const { action } = req.body

    // Create an invite
    if (action === 'invite') {
      const { email, role } = req.body
      if (!email || !role) return res.status(400).json({ error: 'Email and role are required' })
      // Delete any previous unused invite for this email
      await client.from('admin_invites').delete().eq('email', email).is('used_at', null)
      const { data: invite, error } = await client
        .from('admin_invites')
        .insert({ email, role, invited_by: caller.id })
        .select()
        .single()
      if (error) return res.status(500).json({ error: error.message })
      return res.json({ success: true, invite })
    }

    // Approve a pending admin
    if (action === 'approve') {
      const { userId } = req.body
      if (!userId) return res.status(400).json({ error: 'userId required' })
      const { error } = await client.from('profiles')
        .update({ admin_status: 'approved', is_admin: true })
        .eq('id', userId)
      if (error) return res.status(500).json({ error: error.message })
      return res.json({ success: true })
    }

    // Reject a pending admin
    if (action === 'reject') {
      const { userId } = req.body
      if (!userId) return res.status(400).json({ error: 'userId required' })
      const { error } = await client.from('profiles')
        .update({ admin_status: 'rejected', is_admin: false })
        .eq('id', userId)
      if (error) return res.status(500).json({ error: error.message })
      return res.json({ success: true })
    }

    // Remove an admin's access
    if (action === 'remove') {
      const { userId } = req.body
      if (!userId) return res.status(400).json({ error: 'userId required' })
      const { data: profile } = await client.from('profiles')
        .select('admin_role').eq('id', userId).maybeSingle()
      if (profile?.admin_role === 'super_admin') {
        return res.status(400).json({ error: 'Cannot remove super admin' })
      }
      await client.from('profiles')
        .update({ admin_status: null, is_admin: false, admin_role: null })
        .eq('id', userId)
      return res.json({ success: true })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
