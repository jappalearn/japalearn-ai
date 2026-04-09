import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { supabase } from '../../lib/supabase'
import { Upload, Trash2, CheckCircle2, AlertCircle, FileText, File, Table, X, Plus, Eye, EyeOff } from 'lucide-react'

const COUNTRIES = ['UK', 'Canada', 'Germany', 'Australia', 'Ireland', 'Portugal', 'UAE', 'USA', 'Netherlands', 'New Zealand', 'Sweden', 'Norway', 'Singapore']

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

const CATEGORIES = [
  { value: 'template',     label: 'Template',       color: '#3b75ff' },
  { value: 'checklist',   label: 'Checklist',      color: '#10b981' },
  { value: 'guide',       label: 'Guide',           color: '#f59e0b' },
  { value: 'sop_sample',  label: 'SOP Sample',     color: '#8b5cf6' },
  { value: 'cv_guide',    label: 'CV Guide',        color: '#0ea5e9' },
  { value: 'official_doc',label: 'Official Doc',    color: '#6b7280' },
]

const FILE_ICONS = {
  pdf:  { icon: FileText, color: '#ef4444', bg: '#fef2f2' },
  docx: { icon: File,     color: '#3b75ff', bg: '#eff6ff' },
  xlsx: { icon: Table,    color: '#10b981', bg: '#ecfdf5' },
}

function TagSelector({ label, options, selected, onChange }) {
  const toggle = (val) => onChange(selected.includes(val) ? selected.filter(v => v !== val) : [...selected, val])
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <button
            key={opt} type="button"
            onClick={() => toggle(opt)}
            className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
            style={selected.includes(opt)
              ? { background: '#3b75ff', color: '#fff', borderColor: '#3b75ff' }
              : { background: '#f8fafc', color: '#64748b', borderColor: '#e2e8f0' }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function AdminResources() {
  const router = useRouter()
  const [authChecked, setAuthChecked] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  // Form state
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

  // Existing resources
  const [resources, setResources] = useState([])
  const [loadingResources, setLoadingResources] = useState(false)

  useEffect(() => {
    checkAdmin()
  }, [])

  const checkAdmin = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { router.replace('/login'); return }
    const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', session.user.id).maybeSingle()
    if (!profile?.is_admin) { router.replace('/dashboard'); return }
    setIsAdmin(true)
    setAuthChecked(true)
    loadResources()
  }

  const loadResources = async () => {
    setLoadingResources(true)
    const { data } = await supabase.from('resources').select('*').order('created_at', { ascending: false })
    setResources(data || [])
    setLoadingResources(false)
  }

  const handleFileChange = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    const ext = f.name.split('.').pop().toLowerCase()
    if (!['pdf', 'docx', 'xlsx'].includes(ext)) { setError('Only PDF, DOCX, and XLSX files are allowed.'); return }
    setFile(f)
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file || !title || !category) { setError('Title, category, and file are required.'); return }
    setUploading(true); setError(''); setSuccess('')

    try {
      const ext = file.name.split('.').pop().toLowerCase()
      const path = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`
      const { error: uploadError } = await supabase.storage.from('resources').upload(path, file, { upsert: false })
      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage.from('resources').getPublicUrl(path)

      const { error: insertError } = await supabase.from('resources').insert({
        title, description, file_url: publicUrl, file_type: ext,
        country: countries, visa_type: visaTypes, segment: segments,
        category, is_active: true,
      })
      if (insertError) throw insertError

      setSuccess('Resource uploaded successfully.')
      setTitle(''); setDescription(''); setCategory(''); setCountries([])
      setSegments([]); setVisaTypes([]); setFile(null)
      loadResources()
    } catch (err) {
      setError(err.message || 'Upload failed.')
    }
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

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#3b75ff', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  return (
    <>
      <Head><title>Admin — Resources · JapaLearn AI</title></Head>
      <div className="min-h-screen bg-slate-50" style={{ fontFamily: 'Inter, sans-serif' }}>

        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#3b75ff' }}>
              <Upload size={15} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 text-sm">JapaLearn AI — Admin</h1>
              <p className="text-xs text-slate-400">Resources Manager</p>
            </div>
          </div>
          <button onClick={() => router.push('/dashboard')} className="text-xs text-slate-400 hover:text-slate-600 transition-colors">← Back to Dashboard</button>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Upload form */}
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-5">Upload New Resource</h2>
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Title *</label>
                <input
                  value={title} onChange={e => setTitle(e.target.value)} required
                  placeholder="e.g. UK Skilled Worker Visa Document Checklist"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 outline-none transition-all"
                  onFocus={e => e.target.style.borderColor = '#3b75ff'}
                  onBlur={e => e.target.style.borderColor = ''}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Description</label>
                <textarea
                  value={description} onChange={e => setDescription(e.target.value)}
                  placeholder="Short description of what this resource contains..."
                  rows={2}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 outline-none transition-all resize-none"
                  onFocus={e => e.target.style.borderColor = '#3b75ff'}
                  onBlur={e => e.target.style.borderColor = ''}
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Category *</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.value} type="button"
                      onClick={() => setCategory(cat.value)}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
                      style={category === cat.value
                        ? { background: cat.color, color: '#fff', borderColor: cat.color }
                        : { background: '#f8fafc', color: '#64748b', borderColor: '#e2e8f0' }}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <TagSelector label="Countries" options={COUNTRIES} selected={countries} onChange={setCountries} />
              <TagSelector label="Segments" options={SEGMENTS} selected={segments} onChange={setSegments} />
              <TagSelector label="Visa Types" options={VISA_TYPES} selected={visaTypes} onChange={setVisaTypes} />

              {/* File */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">File * (PDF, DOCX, XLSX)</label>
                {file ? (
                  <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
                    <FileText size={16} className="text-[#3b75ff] shrink-0" />
                    <span className="flex-1 text-sm text-slate-700 truncate">{file.name}</span>
                    <button type="button" onClick={() => setFile(null)} className="text-slate-400 hover:text-slate-600">
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-200 rounded-xl p-6 cursor-pointer hover:border-[#3b75ff] hover:bg-blue-50/50 transition-all">
                    <Upload size={20} className="text-slate-400" />
                    <span className="text-sm text-slate-500">Click to select file</span>
                    <input type="file" accept=".pdf,.docx,.xlsx" className="hidden" onChange={handleFileChange} />
                  </label>
                )}
              </div>

              {error && (
                <div className="flex items-center gap-2 bg-rose-50 border border-rose-100 rounded-xl px-4 py-3">
                  <AlertCircle size={14} className="text-rose-500 shrink-0" />
                  <p className="text-rose-600 text-sm">{error}</p>
                </div>
              )}
              {success && (
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                  <p className="text-emerald-700 text-sm">{success}</p>
                </div>
              )}

              <button
                type="submit" disabled={uploading}
                className="w-full flex items-center justify-center gap-2 text-white font-semibold py-3 rounded-xl text-sm transition-all hover:opacity-90 disabled:opacity-50"
                style={{ background: '#3b75ff' }}
              >
                {uploading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Uploading...</> : <><Upload size={14} /> Publish Resource</>}
              </button>
            </form>
          </div>

          {/* Existing resources */}
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-5">Published Resources ({resources.length})</h2>
            {loadingResources ? (
              <div className="flex justify-center py-10">
                <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#3b75ff', borderTopColor: 'transparent' }} />
              </div>
            ) : resources.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
                <p className="text-slate-400 text-sm">No resources yet. Upload your first one.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {resources.map(r => {
                  const fi = FILE_ICONS[r.file_type] || FILE_ICONS.pdf
                  const FileIcon = fi.icon
                  const cat = CATEGORIES.find(c => c.value === r.category)
                  return (
                    <div key={r.id} className={`bg-white rounded-2xl border px-4 py-4 flex items-start gap-3 transition-all ${!r.is_active ? 'opacity-50' : 'border-slate-200'}`}>
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: fi.bg }}>
                        <FileIcon size={15} style={{ color: fi.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900 text-sm truncate">{r.title}</p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          {cat && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: cat.color + '1a', color: cat.color }}>
                              {cat.label}
                            </span>
                          )}
                          {r.country?.slice(0, 2).map(c => (
                            <span key={c} className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{c}</span>
                          ))}
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
      </div>
    </>
  )
}
