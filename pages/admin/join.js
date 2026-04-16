import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { BookMarked, Loader2, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react'

const ROLE_LABELS = {
  content: 'Content Manager',
  users: 'User Manager',
}

export default function AdminJoin() {
  const router = useRouter()
  const { token } = router.query

  const [invite, setInvite] = useState(null)       // { email, role }
  const [inviteError, setInviteError] = useState('')
  const [loading, setLoading] = useState(true)

  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!router.isReady) return
    if (!token) { setInviteError('No invite token found in this link.'); setLoading(false); return }
    fetch(`/api/admin/join?token=${token}`)
      .then(r => r.json())
      .then(data => {
        if (!data.success) setInviteError(data.error || 'Invalid invite')
        else setInvite({ email: data.email, role: data.role })
      })
      .catch(() => setInviteError('Failed to validate invite link'))
      .finally(() => setLoading(false))
  }, [router.isReady, token])

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    if (!fullName.trim()) { setError('Please enter your full name'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return }
    if (password !== confirmPw) { setError('Passwords do not match'); return }
    setSubmitting(true)
    try {
      const res = await fetch('/api/admin/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, fullName: fullName.trim(), password }),
      })
      const data = await res.json()
      if (!data.success) { setError(data.error || 'Something went wrong'); return }
      setDone(true)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Head><title>Join Admin — JapaLearn AI</title></Head>
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4" style={{ fontFamily: 'Inter, sans-serif' }}>
        <div className="w-full max-w-md">

          {/* Logo */}
          <div className="flex items-center justify-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
              <BookMarked size={16} className="text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900">JapaLearn AI</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">

            {/* Loading */}
            {loading && (
              <div className="flex flex-col items-center py-8 gap-3">
                <Loader2 size={28} className="animate-spin text-blue-500" />
                <p className="text-sm text-slate-500">Validating invite...</p>
              </div>
            )}

            {/* Invalid invite */}
            {!loading && inviteError && (
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center mx-auto mb-4">
                  <AlertCircle size={22} className="text-rose-500" />
                </div>
                <h1 className="text-lg font-bold text-slate-900 mb-2">Invalid Invite</h1>
                <p className="text-sm text-slate-500">{inviteError}</p>
              </div>
            )}

            {/* Done state */}
            {done && (
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={22} className="text-emerald-500" />
                </div>
                <h1 className="text-lg font-bold text-slate-900 mb-2">Account Created!</h1>
                <p className="text-sm text-slate-500 mb-6">
                  Your account is pending approval. The super admin will review and activate your access shortly.
                </p>
                <button onClick={() => router.push('/login')}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl text-sm transition-colors">
                  Go to Login
                </button>
              </div>
            )}

            {/* Form */}
            {!loading && invite && !done && (
              <>
                <div className="mb-6">
                  <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                    {ROLE_LABELS[invite.role] || invite.role}
                  </div>
                  <h1 className="text-xl font-bold text-slate-900">You&apos;ve been invited</h1>
                  <p className="text-sm text-slate-500 mt-1">Create your JapaLearn AI admin account below.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Email</label>
                    <div className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-400 bg-slate-50 select-none">
                      {invite.email}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Full Name *</label>
                    <input
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="Your full name"
                      required
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Password *</label>
                    <div className="relative">
                      <input
                        type={showPw ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="At least 8 characters"
                        required
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 pr-11 text-sm text-slate-900 outline-none focus:border-blue-500 transition-colors"
                      />
                      <button type="button" onClick={() => setShowPw(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                        {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Confirm Password *</label>
                    <input
                      type={showPw ? 'text' : 'password'}
                      value={confirmPw}
                      onChange={e => setConfirmPw(e.target.value)}
                      placeholder="Repeat your password"
                      required
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 bg-rose-50 border border-rose-100 rounded-xl px-4 py-3">
                      <AlertCircle size={13} className="text-rose-500 shrink-0" />
                      <p className="text-rose-600 text-sm">{error}</p>
                    </div>
                  )}

                  <button type="submit" disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl text-sm transition-colors">
                    {submitting ? <><Loader2 size={14} className="animate-spin" /> Creating account...</> : 'Create Admin Account'}
                  </button>
                </form>
              </>
            )}
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            Already have an account? <a href="/login" className="text-blue-500 hover:underline">Sign in</a>
          </p>
        </div>
      </div>
    </>
  )
}
