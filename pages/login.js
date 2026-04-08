import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { Mail, Lock, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react'
import Logo from '../lib/Logo'
import { supabase } from '../lib/supabase'

const GoogleSVG = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

const features = [
  'Personalised AI curriculum for your exact profession',
  'Locked lesson progression — step by step',
  'Official government sources, cited',
  'NGN cost estimates for every route',
]

export default function Login() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGoogle = async () => {
    setGoogleLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    })
    if (error) { setError(error.message); setGoogleLoading(false) }
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    const { error: loginError } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password })
    if (loginError) { setError(loginError.message); setLoading(false); return }
    router.push('/dashboard')
  }

  return (
    <>
      <Head><title>Sign In — JapaLearn AI</title></Head>
      <div className="min-h-screen flex" style={{ fontFamily: 'Inter, sans-serif' }}>

        {/* Left panel */}
        <div className="hidden lg:flex lg:w-[45%] flex-col justify-between p-12 relative overflow-hidden" style={{ background: '#3b75ff' }}>
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: 'linear-gradient(#ffffff18 1px, transparent 1px), linear-gradient(to right, #ffffff18 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }} />
          <div className="relative">
            <div className="flex items-center gap-2.5">
              <Logo size={32} />
              <span className="font-bold text-base text-white tracking-tight" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                JapaLearn <span className="text-white/80">AI</span>
              </span>
            </div>
          </div>
          <div className="relative space-y-6">
            <h2 className="text-3xl font-bold text-white leading-snug tracking-tight" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              Your migration journey<br />continues here
            </h2>
            <div className="space-y-3">
              {features.map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
                  <CheckCircle2 size={15} className="text-white/70 shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <p className="relative text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>© 2026 JapaLearn AI · Not a visa agency</p>
        </div>

        {/* Right panel */}
        <div className="flex-1 flex items-center justify-center px-5 py-12 bg-white">
          <div className="w-full max-w-sm">
            <div className="lg:hidden flex items-center gap-2.5 mb-10">
              <Logo size={32} />
              <span className="font-bold text-slate-900" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                JapaLearn <span style={{ color: '#3b75ff' }}>AI</span>
              </span>
            </div>

            <div className="mb-8">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight" style={{ fontFamily: 'DM Sans, sans-serif' }}>Welcome back</h1>
              <p className="text-slate-500 mt-1.5 text-sm">Sign in to continue your migration journey</p>
            </div>

            <button
              onClick={handleGoogle}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 disabled:opacity-60 text-slate-700 font-semibold py-3 px-5 rounded-xl transition-all text-sm mb-5 border border-slate-200 hover:shadow-sm"
            >
              <GoogleSVG />
              {googleLoading ? 'Redirecting...' : 'Continue with Google'}
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-slate-400 text-xs font-medium">or sign in with email</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-700 text-sm font-medium mb-1.5">Email address</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email" name="email" required
                    value={form.email} onChange={handleChange}
                    placeholder="amara@example.com"
                    className="w-full bg-white border border-slate-200 hover:border-slate-300 text-slate-900 rounded-xl pl-10 pr-4 py-3 text-sm outline-none transition-all placeholder-slate-400"
                    style={{ '--tw-ring-color': 'rgba(59,117,255,0.15)' }}
                    onFocus={e => e.target.style.borderColor = '#3b75ff'}
                    onBlur={e => e.target.style.borderColor = ''}
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-700 text-sm font-medium mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password" name="password" required
                    value={form.password} onChange={handleChange}
                    placeholder="Your password"
                    className="w-full bg-white border border-slate-200 hover:border-slate-300 text-slate-900 rounded-xl pl-10 pr-4 py-3 text-sm outline-none transition-all placeholder-slate-400"
                    onFocus={e => e.target.style.borderColor = '#3b75ff'}
                    onBlur={e => e.target.style.borderColor = ''}
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2.5 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3">
                  <AlertCircle size={15} className="text-rose-500 mt-0.5 shrink-0" />
                  <p className="text-rose-600 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit" disabled={loading}
                className="w-full disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-full transition-all text-sm flex items-center justify-center gap-2 hover:opacity-90"
                style={{ background: '#3b75ff' }}
              >
                {loading ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in...</>
                ) : (
                  <>Sign In <ArrowRight size={15} /></>
                )}
              </button>
            </form>

            <p className="text-center text-slate-500 text-sm mt-7">
              Don&apos;t have an account?{' '}
              <Link href="/" className="font-semibold transition-colors" style={{ color: '#3b75ff' }}>
                Take the free quiz
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
