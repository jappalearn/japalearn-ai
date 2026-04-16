import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { supabase } from '../../lib/supabase'
import {
  LayoutDashboard, Users, BookOpen, Database,
  Upload, Trash2, CheckCircle2, AlertCircle, FileText,
  File, Table, X, Plus, Eye, EyeOff, Loader2,
  ChevronDown, ChevronUp, ExternalLink, LogOut,
  TrendingUp, Globe, BookMarked, UserPlus, Shield,
  Copy, Check, UserX, UserCheck,
} from 'lucide-react'

// ─── Constants ────────────────────────────────────────────────────────────────

const COUNTRIES = ['UK', 'Canada', 'Germany', 'Australia', 'Ireland', 'Portugal', 'UAE', 'USA', 'Netherlands', 'New Zealand', 'Sweden', 'Norway', 'Singapore', 'General']

const SEGMENTS = [
  'Medical Doctor', 'Nurse / Midwife', 'Pharmacist',
  'Software Engineer / Developer', 'Finance / Accounting Professional',
  'Legal Professional', 'Freelancer / Remote Worker',
  'Student (seeking to study abroad)', 'Career Professional',
]

const VISA_TYPES = [
  'Skilled Worker Visa', 'Health & Care Worker Visa', 'Global Talent Visa',
  'Express Entry (Federal Skilled Worker)', 'Study Permit', 'Student Visa (Tier 4)',
  'EU Blue Card', 'Digital Nomad Visa (D8)', 'Employment Visa / Freelance Permit',
  'Graduate Route', 'Post-Graduate Work Permit (PGWP)',
]

const RESOURCE_CATEGORIES = [
  { value: 'template',      label: 'Template',     color: '#3b75ff' },
  { value: 'checklist',     label: 'Checklist',    color: '#10b981' },
  { value: 'guide',         label: 'Guide',        color: '#f59e0b' },
  { value: 'sop_sample',    label: 'SOP Sample',   color: '#8b5cf6' },
  { value: 'cv_guide',      label: 'CV Guide',     color: '#0ea5e9' },
  { value: 'official_doc',  label: 'Official Doc', color: '#6b7280' },
]

const FILE_ICONS = {
  pdf:  { icon: FileText, color: '#ef4444', bg: '#fef2f2' },
  docx: { icon: File,     color: '#3b75ff', bg: '#eff6ff' },
  xlsx: { icon: Table,    color: '#10b981', bg: '#ecfdf5' },
}

const RAG_CATEGORIES = [
  { value: 'visa',                   label: 'Visa & Immigration',       desc: 'Visa types, eligibility, requirements, application process' },
  { value: 'scholarships',           label: 'Scholarships & Funding',   desc: 'Chevening, DAAD, Commonwealth, bursaries, eligibility' },
  { value: 'student-visa',           label: 'Student Visa',             desc: 'UK Student Visa, Canada Study Permit, Germany Student Visa' },
  { value: 'medical-licensing',      label: 'Medical Licensing',        desc: 'PLAB, NMC, GMC, AMC, MCCQE, AHPRA — per country' },
  { value: 'professional-licensing', label: 'Professional Licensing',   desc: 'Legal requalification (SQE), pharmacy, allied health' },
  { value: 'post-study-work',        label: 'Post-Study Work',          desc: 'Graduate Route (UK), PGWP (Canada), post-study options' },
  { value: 'proof-of-funds',         label: 'Proof of Funds',           desc: 'Required savings, IHS fees, financial thresholds per visa' },
  { value: 'cost-of-living',         label: 'Cost of Living',           desc: 'Housing, transport, food, utilities — monthly figures' },
  { value: 'job-search',             label: 'Job Search & Sponsorship', desc: 'Employer sponsorship, job market, CV norms' },
  { value: 'freelance-nomad',        label: 'Freelance & Nomad',        desc: 'Digital nomad visas, freelance permits, remote worker tax' },
  { value: 'documents',              label: 'Nigerian Documents',       desc: 'MDCN, NYSC, police clearance, notarisation in Nigeria' },
  { value: 'banking',                label: 'Banking & Finance',        desc: 'Opening accounts abroad, money transfer, proof of address' },
]

// Role → which tabs they can access
const NAV = [
  { id: 'overview',   label: 'Overview',        icon: LayoutDashboard, roles: ['super_admin', 'content', 'users'] },
  { id: 'users',      label: 'Users',           icon: Users,           roles: ['super_admin', 'users'] },
  { id: 'resources',  label: 'Resources',       icon: BookOpen,        roles: ['super_admin', 'content'] },
  { id: 'knowledge',  label: 'Knowledge Base',  icon: Database,        roles: ['super_admin', 'content'] },
  { id: 'team',       label: 'Team',            icon: UserPlus,        roles: ['super_admin'] },
]

const ROLE_LABELS = { super_admin: 'Super Admin', content: 'Content Manager', users: 'User Manager' }
const ROLE_COLORS = { super_admin: '#3b75ff', content: '#8b5cf6', users: '#10b981' }

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getAgeInfo(ts) {
  const months = (Date.now() - new Date(ts)) / (1000 * 60 * 60 * 24 * 30)
  if (months < 6)  return { label: 'Up to date',     color: 'text-emerald-600', dot: 'bg-emerald-500' }
  if (months < 12) return { label: 'Needs checking', color: 'text-amber-600',   dot: 'bg-amber-500'   }
  return               { label: 'Likely outdated',  color: 'text-red-600',     dot: 'bg-red-500'     }
}

function getScoreColor(score) {
  if (score >= 70) return 'text-emerald-600 bg-emerald-50'
  if (score >= 40) return 'text-amber-600 bg-amber-50'
  return 'text-red-600 bg-red-50'
}

async function authFetch(url, options = {}) {
  const { data: { session } } = await supabase.auth.getSession()
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
      Authorization: `Bearer ${session?.access_token}`,
    },
  })
}

function RoleBadge({ role }) {
  const label = ROLE_LABELS[role] || role
  const color = ROLE_COLORS[role] || '#6b7280'
  return (
    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
      style={{ background: color + '18', color }}>
      {label}
    </span>
  )
}

function TagSelector({ label, options, selected, onChange }) {
  const toggle = v => onChange(selected.includes(v) ? selected.filter(x => x !== v) : [...selected, v])
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <button key={opt} type="button" onClick={() => toggle(opt)}
            className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
            style={selected.includes(opt)
              ? { background: '#3b75ff', color: '#fff', borderColor: '#3b75ff' }
              : { background: '#f8fafc', color: '#64748b', borderColor: '#e2e8f0' }}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, sub, color = '#3b75ff' }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</span>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: color + '18' }}>
          <Icon size={15} style={{ color }} />
        </div>
      </div>
      <p className="text-3xl font-bold text-slate-900">{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  )
}

// ─── Section: Overview ────────────────────────────────────────────────────────

function OverviewSection({ stats, recentUsers }) {
  return (
    <div className="space-y-6">
      <h2 className="text-base font-bold text-slate-900">Platform Overview</h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users}      label="Total Users"    value={stats.users}     sub="signed up" color="#3b75ff" />
        <StatCard icon={TrendingUp} label="Quiz Taken"     value={stats.quizTaken} sub={`${stats.users ? Math.round(stats.quizTaken / stats.users * 100) : 0}% of users`} color="#10b981" />
        <StatCard icon={BookOpen}   label="Resources"      value={stats.resources} sub="published" color="#f59e0b" />
        <StatCard icon={Database}   label="RAG Documents"  value={stats.ragDocs}   sub="in knowledge base" color="#8b5cf6" />
      </div>

      {stats.topDestinations?.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Globe size={15} className="text-blue-500" /> Top Destinations
          </h3>
          <div className="space-y-3">
            {stats.topDestinations.map(({ destination, count }) => (
              <div key={destination} className="flex items-center gap-3">
                <span className="text-sm text-slate-700 w-24 shrink-0 font-medium">{destination}</span>
                <div className="flex-1 bg-slate-100 rounded-full h-2">
                  <div className="h-2 rounded-full" style={{ width: `${Math.round(count / stats.quizTaken * 100)}%`, background: '#3b75ff' }} />
                </div>
                <span className="text-xs text-slate-400 w-8 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {recentUsers?.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Recent Signups</h3>
          <div className="space-y-3">
            {recentUsers.map(u => (
              <div key={u.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">
                    {(u.full_name || '?')[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{u.full_name || 'Unnamed user'}</p>
                    <p className="text-xs text-slate-400">{new Date(u.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Section: Users ───────────────────────────────────────────────────────────

function UsersSection({ users, loading }) {
  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-slate-400" size={24} /></div>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-900">All Users</h2>
        <span className="text-xs bg-slate-100 text-slate-500 px-3 py-1 rounded-full font-medium">{users.length} total</span>
      </div>

      {users.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">No users yet.</div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Destination</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Segment</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Score</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Curriculum</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u.id} className={`border-b border-slate-50 ${i % 2 === 0 ? '' : 'bg-slate-50/50'}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600 shrink-0">
                        {(u.full_name || '?')[0].toUpperCase()}
                      </div>
                      <span className="font-medium text-slate-800">{u.full_name || <span className="text-slate-400 italic">No name</span>}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{u.destination || <span className="text-slate-300">—</span>}</td>
                  <td className="px-4 py-3">
                    {u.segment
                      ? <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{u.segment}</span>
                      : <span className="text-slate-300">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    {u.score != null
                      ? <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getScoreColor(u.score)}`}>{u.score}%</span>
                      : <span className="text-xs text-slate-300 bg-slate-100 px-2 py-0.5 rounded-full">No quiz</span>}
                  </td>
                  <td className="px-4 py-3">
                    {u.hasCurriculum
                      ? <span className="flex items-center gap-1 text-xs text-emerald-600"><CheckCircle2 size={12} /> Built</span>
                      : <span className="text-xs text-slate-300">—</span>}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">
                    {new Date(u.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ─── Section: Resources ───────────────────────────────────────────────────────

function ResourcesSection() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [countries, setCountries] = useState([])
  const [segments, setSegments] = useState([])
  const [visaTypes, setVisaTypes] = useState([])
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [resources, setResources] = useState([])
  const [loadingRes, setLoadingRes] = useState(true)

  useEffect(() => { loadResources() }, [])

  const loadResources = async () => {
    setLoadingRes(true)
    const { data } = await supabase.from('resources').select('*').order('created_at', { ascending: false })
    setResources(data || [])
    setLoadingRes(false)
  }

  const handleFileChange = e => {
    const f = e.target.files?.[0]
    if (!f) return
    const ext = f.name.split('.').pop().toLowerCase()
    if (!['pdf', 'docx', 'xlsx'].includes(ext)) { setError('Only PDF, DOCX, and XLSX files are allowed.'); return }
    setFile(f); setError('')
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!file || !title || !category) { setError('Title, category, and file are required.'); return }
    setUploading(true); setError(''); setSuccess('')
    try {
      const path = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`
      const ext = file.name.split('.').pop().toLowerCase()
      const { error: upErr } = await supabase.storage.from('resources').upload(path, file, { upsert: false })
      if (upErr) throw upErr
      const { data: { publicUrl } } = supabase.storage.from('resources').getPublicUrl(path)
      const { error: insErr } = await supabase.from('resources').insert({
        title, description, file_url: publicUrl, file_type: ext,
        country: countries, visa_type: visaTypes, segment: segments,
        category, is_active: true,
      })
      if (insErr) throw insErr
      setSuccess('Resource published.')
      setTitle(''); setDescription(''); setCategory(''); setCountries([]); setSegments([]); setVisaTypes([]); setFile(null)
      loadResources()
    } catch (err) { setError(err.message || 'Upload failed.') }
    setUploading(false)
  }

  const toggleActive = async (id, current) => {
    await supabase.from('resources').update({ is_active: !current }).eq('id', id)
    setResources(prev => prev.map(r => r.id === id ? { ...r, is_active: !current } : r))
  }

  const deleteResource = async (id, fileUrl) => {
    if (!confirm('Delete this resource permanently?')) return
    const path = fileUrl.split('/resources/')[1]
    await supabase.storage.from('resources').remove([path])
    await supabase.from('resources').delete().eq('id', id)
    setResources(prev => prev.filter(r => r.id !== id))
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <h2 className="text-base font-bold text-slate-900 mb-5">Upload New Resource</h2>
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Title *</label>
            <input value={title} onChange={e => setTitle(e.target.value)} required
              placeholder="e.g. UK Skilled Worker Visa Document Checklist"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)}
              placeholder="Short description of what this resource contains..."
              rows={2} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 transition-colors resize-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Category *</label>
            <div className="flex flex-wrap gap-2">
              {RESOURCE_CATEGORIES.map(cat => (
                <button key={cat.value} type="button" onClick={() => setCategory(cat.value)}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
                  style={category === cat.value
                    ? { background: cat.color, color: '#fff', borderColor: cat.color }
                    : { background: '#f8fafc', color: '#64748b', borderColor: '#e2e8f0' }}>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
          <TagSelector label="Countries" options={COUNTRIES.filter(c => c !== 'General')} selected={countries} onChange={setCountries} />
          <TagSelector label="Segments" options={SEGMENTS} selected={segments} onChange={setSegments} />
          <TagSelector label="Visa Types" options={VISA_TYPES} selected={visaTypes} onChange={setVisaTypes} />
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">File * (PDF, DOCX, XLSX)</label>
            {file ? (
              <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
                <FileText size={16} className="text-blue-500 shrink-0" />
                <span className="flex-1 text-sm text-slate-700 truncate">{file.name}</span>
                <button type="button" onClick={() => setFile(null)} className="text-slate-400 hover:text-slate-600"><X size={14} /></button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-200 rounded-xl p-6 cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all">
                <Upload size={20} className="text-slate-400" />
                <span className="text-sm text-slate-500">Click to select file</span>
                <input type="file" accept=".pdf,.docx,.xlsx" className="hidden" onChange={handleFileChange} />
              </label>
            )}
          </div>
          {error && <div className="flex items-center gap-2 bg-rose-50 border border-rose-100 rounded-xl px-4 py-3"><AlertCircle size={14} className="text-rose-500 shrink-0" /><p className="text-rose-600 text-sm">{error}</p></div>}
          {success && <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3"><CheckCircle2 size={14} className="text-emerald-600 shrink-0" /><p className="text-emerald-700 text-sm">{success}</p></div>}
          <button type="submit" disabled={uploading}
            className="w-full flex items-center justify-center gap-2 text-white font-semibold py-3 rounded-xl text-sm bg-blue-600 hover:bg-blue-500 disabled:opacity-50 transition-colors">
            {uploading ? <><Loader2 size={14} className="animate-spin" /> Uploading...</> : <><Upload size={14} /> Publish Resource</>}
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-base font-bold text-slate-900 mb-5">Published Resources ({resources.length})</h2>
        {loadingRes ? (
          <div className="flex justify-center py-10"><Loader2 className="animate-spin text-slate-400" size={22} /></div>
        ) : resources.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-400 text-sm">No resources yet.</div>
        ) : (
          <div className="space-y-3">
            {resources.map(r => {
              const fi = FILE_ICONS[r.file_type] || FILE_ICONS.pdf
              const FileIcon = fi.icon
              const cat = RESOURCE_CATEGORIES.find(c => c.value === r.category)
              return (
                <div key={r.id} className={`bg-white rounded-2xl border px-4 py-4 flex items-start gap-3 transition-all ${!r.is_active ? 'opacity-50' : 'border-slate-200'}`}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: fi.bg }}>
                    <FileIcon size={15} style={{ color: fi.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 text-sm truncate">{r.title}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {cat && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: cat.color + '1a', color: cat.color }}>{cat.label}</span>}
                      {r.country?.slice(0, 2).map(c => <span key={c} className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{c}</span>)}
                      {r.country?.length > 2 && <span className="text-[10px] text-slate-400">+{r.country.length - 2}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button onClick={() => toggleActive(r.id, r.is_active)} className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all" title={r.is_active ? 'Unpublish' : 'Publish'}>
                      {r.is_active ? <Eye size={13} /> : <EyeOff size={13} />}
                    </button>
                    <button onClick={() => deleteResource(r.id, r.file_url)} className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all" title="Delete">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Section: Knowledge Base ──────────────────────────────────────────────────

const EMPTY_RAG_FORM = { country: '', category: '', source_url: '', content: '' }

function KnowledgeSection() {
  const [form, setForm] = useState(EMPTY_RAG_FORM)
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [toast, setToast] = useState(null)
  const [expandedId, setExpandedId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  const fetchDocs = async () => {
    setFetching(true)
    try {
      const res = await authFetch('/api/admin/add-document')
      const data = await res.json()
      if (data.success) setDocuments(data.documents || [])
    } catch { showToast('Failed to load documents', 'error') }
    finally { setFetching(false) }
  }

  useEffect(() => { fetchDocs() }, [])

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.content.trim() || !form.country || !form.category) { showToast('Country, category and content are required', 'error'); return }
    setLoading(true)
    try {
      const res = await authFetch('/api/admin/add-document', {
        method: 'POST',
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error)
      showToast('Document added to knowledge base!')
      setForm(EMPTY_RAG_FORM)
      fetchDocs()
    } catch (err) { showToast(err.message || 'Failed to add document', 'error') }
    finally { setLoading(false) }
  }

  const handleDelete = async id => {
    if (!confirm('Delete this document from the knowledge base?')) return
    setDeletingId(id)
    try {
      const res = await authFetch('/api/admin/add-document', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error)
      showToast('Document deleted')
      setDocuments(prev => prev.filter(d => d.id !== id))
    } catch (err) { showToast(err.message || 'Failed to delete', 'error') }
    finally { setDeletingId(null) }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <h2 className="text-base font-bold text-slate-900 mb-5">Add New Document</h2>
        {toast && (
          <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium mb-4 ${
            toast.type === 'error' ? 'bg-rose-50 border border-rose-100 text-rose-600' : 'bg-emerald-50 border border-emerald-100 text-emerald-700'
          }`}>
            {toast.type === 'error' ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />}
            {toast.message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Country *</label>
              <select value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 transition-colors bg-white">
                <option value="">Select country</option>
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Category *</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 transition-colors bg-white">
                <option value="">Select category</option>
                {RAG_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
          </div>
          {form.category && (
            <p className="text-xs text-slate-400">{RAG_CATEGORIES.find(c => c.value === form.category)?.desc}</p>
          )}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Source URL</label>
            <input type="url" value={form.source_url} onChange={e => setForm(f => ({ ...f, source_url: e.target.value }))}
              placeholder="https://gov.uk/visa-info"
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 transition-colors placeholder-slate-300" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Content *</label>
            <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              placeholder="Paste the migration information here. Be specific and factual — the AI uses this directly."
              rows={8} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 transition-colors resize-y placeholder-slate-300" />
            <p className="text-xs text-slate-400 mt-1">{form.content.length} characters</p>
          </div>
          <button type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 text-white font-semibold py-3 rounded-xl text-sm bg-blue-600 hover:bg-blue-500 disabled:opacity-50 transition-colors">
            {loading ? <><Loader2 size={14} className="animate-spin" /> Processing & uploading...</> : <><Plus size={14} /> Add to Knowledge Base</>}
          </button>
        </form>
      </div>

      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-slate-900">Current Documents</h2>
          <span className="text-xs bg-slate-100 text-slate-500 px-3 py-1 rounded-full font-medium">
            {fetching ? '...' : `${documents.length} total`}
          </span>
        </div>
        {fetching ? (
          <div className="flex justify-center py-10"><Loader2 className="animate-spin text-slate-400" size={22} /></div>
        ) : documents.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-400 text-sm">No documents yet.</div>
        ) : (
          <div className="space-y-2">
            {documents.map(doc => {
              const age = getAgeInfo(doc.last_updated)
              const catLabel = RAG_CATEGORIES.find(c => c.value === doc.category)?.label || doc.category
              return (
                <div key={doc.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-2 min-w-0 flex-wrap">
                      <span className="text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-full shrink-0">{doc.country}</span>
                      <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full shrink-0">{catLabel}</span>
                      <span className={`flex items-center gap-1 text-xs font-medium shrink-0 ${age.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${age.dot}`} />{age.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 ml-2 shrink-0">
                      {doc.source_url && (
                        <a href={doc.source_url} target="_blank" rel="noopener noreferrer" title="Check source"
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-blue-500 hover:bg-slate-100 transition-all">
                          <ExternalLink size={13} />
                        </a>
                      )}
                      <button onClick={() => setExpandedId(expandedId === doc.id ? null : doc.id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all">
                        {expandedId === doc.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                      <button onClick={() => handleDelete(doc.id)} disabled={deletingId === doc.id}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all disabled:opacity-50">
                        {deletingId === doc.id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                      </button>
                    </div>
                  </div>
                  {expandedId === doc.id && (
                    <div className="px-4 pb-4 border-t border-slate-100 pt-3 space-y-2">
                      {doc.source_url && (
                        <a href={doc.source_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline flex items-center gap-1">
                          <ExternalLink size={11} />{doc.source_url}
                        </a>
                      )}
                      <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">{doc.content}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Section: Team ────────────────────────────────────────────────────────────

function TeamSection() {
  const [members, setMembers] = useState([])
  const [invites, setInvites] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)

  // Invite form
  const [showInviteForm, setShowInviteForm] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('content')
  const [inviting, setInviting] = useState(false)
  const [newInviteLink, setNewInviteLink] = useState('')
  const [copied, setCopied] = useState(false)

  // Action states
  const [actionId, setActionId] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  const load = async () => {
    setLoading(true)
    try {
      const res = await authFetch('/api/admin/team')
      const data = await res.json()
      if (!data.success) throw new Error(data.error)
      setMembers(data.members || [])
      setInvites(data.invites || [])
    } catch (err) { showToast(err.message || 'Failed to load team', 'error') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const handleInvite = async e => {
    e.preventDefault()
    if (!inviteEmail.trim()) { showToast('Email is required', 'error'); return }
    setInviting(true)
    try {
      const res = await authFetch('/api/admin/team', {
        method: 'POST',
        body: JSON.stringify({ action: 'invite', email: inviteEmail.trim(), role: inviteRole }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error)
      const link = `${window.location.origin}/admin/join?token=${data.invite.token}`
      setNewInviteLink(link)
      setInviteEmail('')
      load()
    } catch (err) { showToast(err.message || 'Failed to create invite', 'error') }
    finally { setInviting(false) }
  }

  const copyLink = async link => {
    await navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const doAction = async (action, userId) => {
    setActionId(userId)
    try {
      const res = await authFetch('/api/admin/team', {
        method: 'POST',
        body: JSON.stringify({ action, userId }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error)
      showToast(action === 'approve' ? 'Admin approved!' : action === 'reject' ? 'Request rejected' : 'Access removed')
      load()
    } catch (err) { showToast(err.message || 'Action failed', 'error') }
    finally { setActionId(null) }
  }

  const pending = members.filter(m => m.admin_status === 'pending')
  const active = members.filter(m => m.admin_status === 'approved')

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-900">Admin Team</h2>
        <button onClick={() => { setShowInviteForm(v => !v); setNewInviteLink('') }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors">
          <UserPlus size={13} /> Invite Admin
        </button>
      </div>

      {toast && (
        <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium ${
          toast.type === 'error' ? 'bg-rose-50 border border-rose-100 text-rose-600' : 'bg-emerald-50 border border-emerald-100 text-emerald-700'
        }`}>
          {toast.type === 'error' ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />}
          {toast.message}
        </div>
      )}

      {/* Invite form */}
      {showInviteForm && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2"><UserPlus size={14} className="text-blue-500" /> New Invite</h3>
          <form onSubmit={handleInvite} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Email address *</label>
              <input type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} required
                placeholder="colleague@example.com"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Role *</label>
              <div className="flex gap-3">
                {[
                  { value: 'content', label: 'Content Manager', desc: 'Resources + Knowledge Base' },
                  { value: 'users',   label: 'User Manager',    desc: 'View users only' },
                ].map(r => (
                  <button key={r.value} type="button" onClick={() => setInviteRole(r.value)}
                    className={`flex-1 text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                      inviteRole === r.value ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'
                    }`}>
                    <p className="font-semibold text-slate-900">{r.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" disabled={inviting}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors">
              {inviting ? <><Loader2 size={13} className="animate-spin" /> Creating...</> : 'Generate Invite Link'}
            </button>
          </form>

          {newInviteLink && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Invite link — share this privately</p>
              <div className="flex items-center gap-2">
                <p className="flex-1 text-xs text-slate-700 font-mono truncate">{newInviteLink}</p>
                <button onClick={() => copyLink(newInviteLink)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-500 px-3 py-1.5 bg-white border border-slate-200 rounded-lg transition-colors shrink-0">
                  {copied ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy</>}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Pending approvals */}
      {pending.length > 0 && (
        <div className="bg-white rounded-2xl border border-amber-200 overflow-hidden">
          <div className="px-5 py-3 bg-amber-50 border-b border-amber-100">
            <h3 className="text-sm font-bold text-amber-800 flex items-center gap-2">
              <Shield size={13} /> Pending Approval ({pending.length})
            </h3>
          </div>
          <div className="divide-y divide-slate-100">
            {pending.map(m => (
              <div key={m.id} className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-xs font-bold text-amber-700">
                    {(m.full_name || '?')[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{m.full_name || 'Unknown'}</p>
                    <RoleBadge role={m.admin_role} />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => doAction('approve', m.id)} disabled={actionId === m.id}
                    className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50">
                    {actionId === m.id ? <Loader2 size={11} className="animate-spin" /> : <UserCheck size={12} />} Approve
                  </button>
                  <button onClick={() => doAction('reject', m.id)} disabled={actionId === m.id}
                    className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50">
                    <UserX size={12} /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Unused invites */}
      {invites.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-700">Pending Invites</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {invites.map(inv => {
              const link = typeof window !== 'undefined' ? `${window.location.origin}/admin/join?token=${inv.token}` : `/admin/join?token=${inv.token}`
              return (
                <div key={inv.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{inv.email}</p>
                    <RoleBadge role={inv.role} />
                  </div>
                  <button onClick={() => copyLink(link)}
                    className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-blue-200 transition-colors">
                    <Copy size={11} /> Copy link
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Active team */}
      {loading ? (
        <div className="flex justify-center py-8"><Loader2 className="animate-spin text-slate-400" size={22} /></div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-700">Active Admins ({active.length})</h3>
          </div>
          {active.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">No active admins yet.</p>
          ) : (
            <div className="divide-y divide-slate-50">
              {active.map(m => (
                <div key={m.id} className="flex items-center justify-between px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">
                      {(m.full_name || '?')[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{m.full_name || 'Unknown'}</p>
                      <RoleBadge role={m.admin_role} />
                    </div>
                  </div>
                  {m.admin_role !== 'super_admin' && (
                    <button onClick={() => doAction('remove', m.id)} disabled={actionId === m.id}
                      className="text-xs text-slate-400 hover:text-rose-500 px-3 py-1.5 rounded-lg hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors disabled:opacity-50">
                      {actionId === m.id ? <Loader2 size={11} className="animate-spin" /> : 'Remove'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const router = useRouter()
  const [authChecked, setAuthChecked] = useState(false)
  const [adminRole, setAdminRole] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState({ users: 0, quizTaken: 0, resources: 0, ragDocs: 0, topDestinations: [] })
  const [recentUsers, setRecentUsers] = useState([])
  const [users, setUsers] = useState([])
  const [usersLoading, setUsersLoading] = useState(false)

  useEffect(() => { checkAdmin() }, [])

  const checkAdmin = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { router.replace('/login'); return }
    const { data: profile } = await supabase.from('profiles')
      .select('is_admin, admin_role, admin_status')
      .eq('id', session.user.id)
      .maybeSingle()
    if (!profile?.is_admin || profile.admin_status !== 'approved') {
      router.replace('/dashboard')
      return
    }
    setAdminRole(profile.admin_role)
    setAuthChecked(true)
    loadOverview()
  }

  const allowedNav = NAV.filter(n => n.roles.includes(adminRole))

  const loadOverview = async () => {
    const [
      { count: userCount },
      { data: quizData },
      { count: resourceCount },
      { count: ragCount },
      { data: recentProfiles },
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('quiz_results').select('destination'),
      supabase.from('resources').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('migration_documents').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('id, full_name, created_at').order('created_at', { ascending: false }).limit(5),
    ])

    const destMap = {}
    quizData?.forEach(r => { if (r.destination) destMap[r.destination] = (destMap[r.destination] || 0) + 1 })
    const topDestinations = Object.entries(destMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([destination, count]) => ({ destination, count }))

    setStats({ users: userCount || 0, quizTaken: quizData?.length || 0, resources: resourceCount || 0, ragDocs: ragCount || 0, topDestinations })
    setRecentUsers(recentProfiles || [])
  }

  const loadUsers = async () => {
    setUsersLoading(true)
    const [{ data: profiles }, { data: quizResults }, { data: curricula }] = await Promise.all([
      supabase.from('profiles').select('id, full_name, created_at').order('created_at', { ascending: false }),
      supabase.from('quiz_results').select('user_id, score, destination, segment, created_at').order('created_at', { ascending: false }),
      supabase.from('curricula').select('user_id'),
    ])

    const quizMap = {}
    quizResults?.forEach(q => { if (!quizMap[q.user_id]) quizMap[q.user_id] = q })
    const curriculumSet = new Set(curricula?.map(c => c.user_id) || [])

    setUsers((profiles || []).map(p => ({ ...p, ...(quizMap[p.id] || {}), hasCurriculum: curriculumSet.has(p.id) })))
    setUsersLoading(false)
  }

  const handleTabChange = tab => {
    if (!allowedNav.find(n => n.id === tab)) return
    setActiveTab(tab)
    if (tab === 'users' && users.length === 0) loadUsers()
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-t-transparent border-blue-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <>
      <Head><title>Admin — JapaLearn AI</title></Head>
      <div className="min-h-screen bg-slate-50 flex" style={{ fontFamily: 'Inter, sans-serif' }}>

        {/* Sidebar */}
        <aside className="w-56 bg-white border-r border-slate-200 flex flex-col shrink-0">
          <div className="px-5 py-5 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
                <BookMarked size={13} className="text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">JapaLearn AI</p>
                <p className="text-[10px] text-slate-400">Admin Dashboard</p>
              </div>
            </div>
            <div className="mt-3">
              <RoleBadge role={adminRole} />
            </div>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1">
            {allowedNav.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => handleTabChange(id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === id ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}>
                <Icon size={15} />
                {label}
              </button>
            ))}
          </nav>

          <div className="px-3 py-4 border-t border-slate-100 space-y-1">
            <button onClick={() => router.push('/dashboard')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-100 transition-all">
              <LayoutDashboard size={15} /> App Dashboard
            </button>
            <button onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-rose-50 hover:text-rose-500 transition-all">
              <LogOut size={15} /> Sign Out
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-6xl mx-auto px-8 py-8">
            {activeTab === 'overview'  && <OverviewSection stats={stats} recentUsers={recentUsers} />}
            {activeTab === 'users'     && <UsersSection users={users} loading={usersLoading} />}
            {activeTab === 'resources' && <ResourcesSection />}
            {activeTab === 'knowledge' && <KnowledgeSection />}
            {activeTab === 'team'      && adminRole === 'super_admin' && <TeamSection />}
          </div>
        </main>
      </div>
    </>
  )
}
