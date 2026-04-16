import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { supabase } from '../../lib/supabase'
import { BookMarked, Mail, Lock, Loader2, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react'

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const [status, setStatus] = useState(null) // 'pending' | 'rejected' | 'not_admin'
  const [view, setView] = useState('login') // 'login' | 'forgot' | 'reset'
  const [resetEmail, setResetEmail] = useState('')
  const [resetPassword, setResetPassword] = useState('')
  const [resetDone, setResetDone] = useState(false)

  useEffect(() => {
    checkCurrentSession()
    // Detect Supabase password recovery redirect (URL contains #type=recovery)
    const hash = window.location.hash
    if (hash.includes('type=recovery')) {
      setView('reset')
    }
  }, [])

  const checkCurrentSession = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      await verifyAdminAccess(session.user.id)
    }
  }

  const verifyAdminAccess = async (userId) => {
    const { data: { user } } = await supabase.auth.getUser()
    const email = user?.email

    const { data: admin, error: adminErr } = await supabase
      .from('admin_users')
      .select('status, role')
      .eq('id', userId)
      .maybeSingle()

    if (adminErr) {
      setError('Error checking admin status. Please try again.')
      return
    }

    // Master Super Admin Override
    if (email === 'jappalearn@gmail.com') {
      router.push('/admin')
      return
    }

    if (!admin) {
      setStatus('not_admin')
      return
    }

    // Enforce provider restriction for non-super admins
    // (This assumes other admins should only use the method they signed up with)
    const provider = user?.app_metadata?.provider
    if (admin.role !== 'super_admin' && provider === 'google') {
      setError('This account is restricted to Email/Password login only.')
      await supabase.auth.signOut()
      return
    }

    if (admin.status === 'pending') {
      setStatus('pending')
      return
    }

    if (admin.status === 'approved') {
      router.push('/admin')
    } else {
      setStatus('rejected')
    }
  }

  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    setError('')
    const { error: googleErr } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/admin`
      }
    })
    if (googleErr) {
      setError(googleErr.message)
      setGoogleLoading(false)
    }
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error: resetErr } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/admin/login`,
    })
    setLoading(false)
    if (resetErr) {
      setError(resetErr.message)
    } else {
      setResetDone(true)
    }
  }

  const handleSetNewPassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error: updateErr } = await supabase.auth.updateUser({ password: resetPassword })
    setLoading(false)
    if (updateErr) {
      setError(updateErr.message)
    } else {
      setView('login')
      setError('')
      alert('Password updated successfully. Please sign in.')
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setStatus(null)

    try {
      const { data, error: loginErr } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (loginErr) {
        setError(loginErr.message)
        setLoading(false)
        return
      }

      await verifyAdminAccess(data.user.id)
    } catch (err) {
      setError('An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Admin Login — JapaLearn AI</title>
      </Head>
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full">
          
          {/* Logo Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600 text-white mb-4 shadow-lg shadow-blue-200">
              <BookMarked size={24} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Admin Control</h1>
            <p className="text-slate-500 mt-1">JapaLearn AI Management Portal</p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            {view === 'forgot' ? (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-1">Reset your password</h2>
                  <p className="text-sm text-slate-500">Enter your admin email and we'll send you a reset link.</p>
                </div>
                {resetDone ? (
                  <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-center gap-3">
                    <CheckCircle2 className="text-green-500 shrink-0" size={18} />
                    <p className="text-sm text-green-700">Reset link sent — check your email inbox.</p>
                  </div>
                ) : (
                  <form onSubmit={handleForgotPassword} className="space-y-5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Admin Email</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                          type="email"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          placeholder="admin@japalearn.com"
                          required
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                        />
                      </div>
                    </div>
                    {error && (
                      <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 flex items-center gap-3">
                        <AlertCircle className="text-rose-500 shrink-0" size={18} />
                        <p className="text-sm text-rose-600">{error}</p>
                      </div>
                    )}
                    <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-all">
                      {loading ? <><Loader2 className="animate-spin" size={18} /> Sending...</> : <>Send reset link <ArrowRight size={18} /></>}
                    </button>
                  </form>
                )}
                <button onClick={() => { setView('login'); setError(''); setResetDone(false) }} className="text-blue-600 font-semibold text-sm hover:underline block text-center">
                  Back to login
                </button>
              </div>
            ) : view === 'reset' ? (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-1">Set new password</h2>
                  <p className="text-sm text-slate-500">Choose a strong new password for your admin account.</p>
                </div>
                <form onSubmit={handleSetNewPassword} className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="password"
                        value={resetPassword}
                        onChange={(e) => setResetPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        minLength={8}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                      />
                    </div>
                  </div>
                  {error && (
                    <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 flex items-center gap-3">
                      <AlertCircle className="text-rose-500 shrink-0" size={18} />
                      <p className="text-sm text-rose-600">{error}</p>
                    </div>
                  )}
                  <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-all">
                    {loading ? <><Loader2 className="animate-spin" size={18} /> Updating...</> : <>Update password <ArrowRight size={18} /></>}
                  </button>
                </form>
              </div>
            ) : status === 'pending' ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Loader2 className="animate-spin text-amber-500" size={32} />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">Access Pending</h2>
                <p className="text-slate-500 mb-8">
                  Your account is awaiting approval from the Super Admin. You will be able to access the dashboard once activated.
                </p>
                <button 
                  onClick={() => setStatus(null)}
                  className="text-blue-600 font-semibold text-sm hover:underline"
                >
                  Back to Login
                </button>
              </div>
            ) : status === 'not_admin' ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="text-rose-500" size={32} />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">No Admin Access</h2>
                <p className="text-slate-500 mb-8">
                  You are logged into the JapaLearn app, but this account does not have admin privileges.
                </p>
                <button 
                  onClick={() => { supabase.auth.signOut(); setStatus(null); }}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold py-3 rounded-xl text-sm transition-all"
                >
                  Logout & Try Another Account
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={googleLoading}
                  className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold py-3.5 rounded-xl transition-all shadow-sm disabled:opacity-50"
                >
                  {googleLoading ? (
                    <Loader2 className="animate-spin text-slate-400" size={20} />
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                  )}
                  {googleLoading ? 'Connecting...' : 'Continue with Google'}
                </button>

                <div className="flex items-center gap-4 text-slate-400">
                  <div className="h-px bg-slate-200 flex-1"></div>
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-white px-2">OR</span>
                  <div className="h-px bg-slate-200 flex-1"></div>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Admin Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@japalearn.com"
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Password</label>
                    <button type="button" onClick={() => { setView('forgot'); setError('') }} className="text-xs text-blue-600 font-semibold hover:underline">
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 flex items-center gap-3">
                    <AlertCircle className="text-rose-500 shrink-0" size={18} />
                    <p className="text-sm text-rose-600">{error}</p>
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-4 rounded-xl shadow-lg shadow-blue-200 flex items-center justify-center gap-2 group transition-all"
                >
                  {loading ? (
                    <><Loader2 className="animate-spin" size={18} /> Authenticating...</>
                  ) : (
                    <>Sign in to Dashboard <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
                  )}
                </button>
              </form>
            </div>
          )}
          </div>

          <p className="text-center text-slate-400 text-sm mt-8">
            Return to the <a href="/" className="text-slate-600 hover:underline">Main Platform</a>
          </p>
        </div>
      </div>
    </>
  )
}
