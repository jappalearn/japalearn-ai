import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export default async function handler(req, res) {
  const client = createClient(supabaseUrl, serviceKey)

  // GET — validate invite token
  if (req.method === 'GET') {
    const { token } = req.query
    if (!token) return res.status(400).json({ error: 'Token required' })
    const { data: invite } = await client
      .from('admin_invites')
      .select('id, email, role, used_at')
      .eq('token', token)
      .maybeSingle()
    if (!invite) return res.status(404).json({ error: 'Invalid invite link' })
    if (invite.used_at) return res.status(400).json({ error: 'This invite link has already been used' })
    return res.json({ success: true, email: invite.email, role: invite.role })
  }

  // POST — create admin account from invite
  if (req.method === 'POST') {
    const { token, fullName, password } = req.body
    if (!token || !fullName || !password) {
      return res.status(400).json({ error: 'Token, name, and password are required' })
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' })
    }

    // Validate token
    const { data: invite } = await client
      .from('admin_invites')
      .select('id, email, role, used_at')
      .eq('token', token)
      .maybeSingle()
    if (!invite) return res.status(404).json({ error: 'Invalid invite link' })
    if (invite.used_at) return res.status(400).json({ error: 'This invite link has already been used' })

    // Create auth user (email auto-confirmed)
    const { data: { user }, error: createErr } = await client.auth.admin.createUser({
      email: invite.email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    })
    if (createErr) {
      if (createErr.message?.includes('already')) {
        return res.status(400).json({ error: 'An account with this email already exists. Contact the super admin.' })
      }
      return res.status(500).json({ error: createErr.message })
    }

    // Update profile with pending admin status
    await client.from('profiles').upsert({
      id: user.id,
      full_name: fullName,
      admin_role: invite.role,
      admin_status: 'pending',
      is_admin: true,
    })

    // Mark invite as used
    await client.from('admin_invites')
      .update({ used_at: new Date().toISOString(), used_by: user.id })
      .eq('id', invite.id)

    return res.json({ success: true })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
