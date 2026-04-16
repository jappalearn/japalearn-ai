import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabase'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()

      if (error || !session) {
        router.replace('/admin/login')
        return
      }

      // Super admin override — always send jappalearn@gmail.com to admin
      if (session.user.email === 'jappalearn@gmail.com') {
        router.replace('/admin')
        return
      }

      // Check admin_users table for other admins
      const { data: admin } = await supabase
        .from('admin_users')
        .select('status, role')
        .eq('id', session.user.id)
        .maybeSingle()

      if (admin?.status === 'approved') {
        router.replace('/admin')
      } else {
        router.replace('/admin/login')
      }
    }

    handleCallback()
  }, [])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
      <div style={{ width: 32, height: 32, border: '2px solid #3b75ff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
