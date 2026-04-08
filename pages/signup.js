import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { Globe2, Mail, Lock, User, ArrowRight, AlertCircle, Star } from 'lucide-react'
import { supabase } from '../lib/supabase'

const GoogleSVG = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

export default function Signup() {
  const router = useRouter()
  const { answers, score } = router.query
  const [form, setForm] = useState({ full_name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGoogle = async () => {
    setGoogleLoading(true)
    if (answers && score) {
      localStorage.setItem('pending_quiz_answers', answers)
      localStorage.setItem('pending_quiz_score', score)
    }
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
    const { data, error: signupError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.full_name } },
    })
    if (signupError) { setError(signupError.message); setLoading(false); return }
    if (answers && score && data.user) {
      await supabase.from('quiz_results').insert({
        user_id: data.user.id,
        answers: JSON.parse(answers),
        score: parseInt(score),
        destination: JSON.parse(answers).destination,
        segment: JSON.parse(answers).segment,
      })
    }
    router.push('/dashboard')
  }

  return (
    <>
      <Head><title>Create Account — JapaLearn AI</title></Head>
      <div className="min-h-screen bg-slate-50 flex">

        {/* Left panel */}
        <div className="hidden lg:flex lg:w-[45%] bg-indigo-600 flex-col justify-between p-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 70% 30%, white 0%, transparent 60%)' }} />
          <div className="relative">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <Globe2 size={17} className="text-white" />
              </div>
              <span className="font-bold text-base text-white tracking-tight">JapaLearn AI</span>
            </div>
          </div>

          {score && (
            <div className="relative bg-white/10 border border-white/20 rounded-2xl p-5">
              <div className="text-indigo-200 text-xs uppercase tracking-widest mb-1">Your Readiness Score</div>
              <div className="text-5xl font-black text-white mb-1">{score}</div>
              <div className="text-indigo-200 text-sm">out of 100 — saved when you sign up</div>
            </div>
          )}

          <div className="relative space-y-4">
            <h2 className="text-2xl font-bold text-white leading-snug tracking-tight">
              Your curriculum is<br />waiting for you
            </h2>
            <div className="space-y-3">
              {[
                'AI-personalised curriculum for your exact profile',
                'Track your progress lesson by lesson',
                'Access your report from any device',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-indigo-100 text-sm">
                  <Star size={12} className="text-white/60 shrink-0" fill="currentColor" />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <p className="relative text-indigo-300 text-xs">© 2026 JapaLearn AI · NDPR Protected</p>
        </div>

        {/* Right panel */}
        <div className="flex-1 flex items-center justify-center px-5 py-12 bg-white">
          <div className="w-full max-w-sm">
            <div className="lg:hidden flex items-center gap-2 mb-10">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
                <Globe2 size={15} className="text-white" />
              </div>
              <span className="font-bold text-slate-900">JapaLearn AI</span>
            </div>

            <div className="mb-8">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create your free account</h1>
              <p className="text-slate-500 mt-1.5 text-sm">Save your report and start your AI curriculum</p>
            </div>

            {score && (
              <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3 mb-5">
                <div className="text-2xl font-black text-indigo-600 shrink-0">{score}</div>
                <p className="text-slate-600 text-sm">Your readiness score will be saved to your account</p>
              </div>
            )}

            <button
              onClick={handleGoogle}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 disabled:opacity-60 text-slate-700 font-semibold py-3 px-5 rounded-xl transition-all text-sm mb-5 border border-slate-200 shadow-card hover:shadow-card-md"
            >
              <GoogleSVG />
              {googleLoading ? 'Redirecting...' : 'Continue with Google'}
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-slate-400 text-xs font-medium">or sign up with email</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-700 text-sm font-medium mb-1.5">Full Name</label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text" name="full_name" required
                    value={form.full_name} onChange={handleChange}
                    placeholder="Amara Okonkwo"
                    className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-slate-900 rounded-xl pl-10 pr-4 py-3 text-sm outline-none transition-all placeholder-slate-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-700 text-sm font-medium mb-1.5">Email address</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email" name="email" required
                    value={form.email} onChange={handleChange}
                    placeholder="amara@example.com"
                    className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-slate-900 rounded-xl pl-10 pr-4 py-3 text-sm outline-none transition-all placeholder-slate-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-700 text-sm font-medium mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password" name="password" required minLength={6}
                    value={form.password} onChange={handleChange}
                    placeholder="Minimum 6 characters"
                    className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-slate-900 rounded-xl pl-10 pr-4 py-3 text-sm outline-none transition-all placeholder-slate-400"
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
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all text-sm flex items-center justify-center gap-2 shadow-btn"
              >
                {loading ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating account...</>
                ) : (
                  <>Create Free Account <ArrowRight size={15} /></>
                )}
              </button>
            </form>

            <p className="text-center text-slate-500 text-sm mt-7">
              Already have an account?{' '}
              <button onClick={() => router.push('/login')} className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors">
                Sign in
              </button>
            </p>
            <p className="text-center text-slate-400 text-xs mt-3">
              By signing up you agree to our terms. Your data is protected under NDPR.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
