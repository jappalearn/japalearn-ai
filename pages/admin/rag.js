import { useState, useEffect } from 'react'
import Head from 'next/head'
import { Trash2, Plus, CheckCircle2, AlertCircle, Loader2, ChevronDown, ChevronUp, Database, ExternalLink } from 'lucide-react'

const COUNTRIES = [
  'UK', 'Canada', 'Germany', 'Australia', 'Ireland',
  'Portugal', 'UAE', 'USA', 'Netherlands', 'New Zealand',
  'Sweden', 'Norway', 'Singapore', 'General',
]

const CATEGORIES = [
  { value: 'visa',                  label: 'Visa & Immigration',        desc: 'Visa types, eligibility, requirements, application process' },
  { value: 'scholarships',          label: 'Scholarships & Funding',    desc: 'Chevening, DAAD, Commonwealth, bursaries, eligibility' },
  { value: 'student-visa',          label: 'Student Visa',              desc: 'UK Student Visa, Canada Study Permit, Germany Student Visa' },
  { value: 'medical-licensing',     label: 'Medical Licensing',         desc: 'PLAB, NMC, GMC, AMC, MCCQE, AHPRA — per country' },
  { value: 'professional-licensing',label: 'Professional Licensing',    desc: 'Legal requalification (SQE), pharmacy, allied health' },
  { value: 'post-study-work',       label: 'Post-Study Work',           desc: 'Graduate Route (UK), PGWP (Canada), post-study options' },
  { value: 'proof-of-funds',        label: 'Proof of Funds',            desc: 'Required savings, IHS fees, financial thresholds per visa' },
  { value: 'cost-of-living',        label: 'Cost of Living',            desc: 'Housing, transport, food, utilities — monthly figures' },
  { value: 'job-search',            label: 'Job Search & Sponsorship',  desc: 'Employer sponsorship, job market, CV norms' },
  { value: 'freelance-nomad',       label: 'Freelance & Nomad',         desc: 'Digital nomad visas, freelance permits, remote worker tax' },
  { value: 'documents',             label: 'Nigerian Documents',        desc: 'MDCN, NYSC, police clearance, notarisation in Nigeria' },
  { value: 'banking',               label: 'Banking & Finance',         desc: 'Opening accounts abroad, money transfer, proof of address' },
]

function getAgeInfo(createdAt) {
  const now = new Date()
  const created = new Date(createdAt)
  const monthsOld = (now - created) / (1000 * 60 * 60 * 24 * 30)
  if (monthsOld < 6)  return { label: 'Up to date',     color: 'text-emerald-400', dot: 'bg-emerald-400', warn: false }
  if (monthsOld < 12) return { label: 'Needs checking', color: 'text-yellow-400',  dot: 'bg-yellow-400',  warn: true  }
  return               { label: 'Likely outdated',  color: 'text-red-400',     dot: 'bg-red-400',     warn: true  }
}

const EMPTY_FORM = { country: '', category: '', source_url: '', content: '' }

export default function RagAdmin() {
  const [form, setForm] = useState(EMPTY_FORM)
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

  const fetchDocuments = async () => {
    setFetching(true)
    try {
      const res = await fetch('/api/admin/add-document')
      const data = await res.json()
      if (data.success) setDocuments(data.documents || [])
    } catch {
      showToast('Failed to load documents', 'error')
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => { fetchDocuments() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.content.trim() || !form.country || !form.category) {
      showToast('Country, category, and content are required', 'error')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/admin/add-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error)
      showToast('Document added to RAG knowledge base!')
      setForm(EMPTY_FORM)
      fetchDocuments()
    } catch (err) {
      showToast(err.message || 'Failed to add document', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this document from the knowledge base?')) return
    setDeletingId(id)
    try {
      const res = await fetch('/api/admin/add-document', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error)
      showToast('Document deleted')
      setDocuments(prev => prev.filter(d => d.id !== id))
    } catch (err) {
      showToast(err.message || 'Failed to delete', 'error')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <>
      <Head>
        <title>RAG Knowledge Base — Admin</title>
      </Head>

      <div className="min-h-screen bg-slate-950 text-white px-4 py-10">
        <div className="max-w-3xl mx-auto space-y-8">

          {/* Header */}
          <div className="flex items-center gap-3">
            <Database className="text-blue-400" size={28} />
            <div>
              <h1 className="text-2xl font-bold">RAG Knowledge Base</h1>
              <p className="text-slate-400 text-sm mt-0.5">
                Upload migration documents for the AI to reference
              </p>
            </div>
          </div>

          {/* Toast */}
          {toast && (
            <div className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium ${
              toast.type === 'error'
                ? 'bg-red-900/60 border border-red-700 text-red-200'
                : 'bg-emerald-900/60 border border-emerald-700 text-emerald-200'
            }`}>
              {toast.type === 'error'
                ? <AlertCircle size={16} />
                : <CheckCircle2 size={16} />}
              {toast.message}
            </div>
          )}

          {/* Upload Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <Plus size={18} className="text-blue-400" />
              Add New Document
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-medium uppercase tracking-wide">
                    Country *
                  </label>
                  <select
                    value={form.country}
                    onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select country</option>
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-medium uppercase tracking-wide">
                    Category *
                  </label>
                  <select
                    value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select category</option>
                    {CATEGORIES.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                  {form.category && (
                    <p className="text-xs text-slate-500 mt-1.5">
                      {CATEGORIES.find(c => c.value === form.category)?.desc}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-medium uppercase tracking-wide">
                  Source URL
                </label>
                <input
                  type="url"
                  value={form.source_url}
                  onChange={e => setForm(f => ({ ...f, source_url: e.target.value }))}
                  placeholder="https://gov.uk/visa-info"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-medium uppercase tracking-wide">
                  Content *
                </label>
                <textarea
                  value={form.content}
                  onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                  placeholder="Paste the migration information here. Be specific and factual — the AI will use this directly when answering user questions."
                  rows={8}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-y"
                />
                <p className="text-xs text-slate-500 mt-1">
                  {form.content.length} characters
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><Loader2 size={16} className="animate-spin" /> Processing & uploading...</>
                ) : (
                  <><Plus size={16} /> Add to Knowledge Base</>
                )}
              </button>
            </form>
          </div>

          {/* Document List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">
                Current Documents
              </h2>
              <span className="text-xs bg-slate-800 text-slate-400 px-2.5 py-1 rounded-full font-medium">
                {fetching ? '...' : `${documents.length} total`}
              </span>
            </div>

            {fetching ? (
              <div className="flex items-center gap-2 text-slate-400 py-6 justify-center">
                <Loader2 size={18} className="animate-spin" />
                Loading documents...
              </div>
            ) : documents.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Database size={36} className="mx-auto mb-3 opacity-30" />
                <p>No documents yet. Add one above.</p>
              </div>
            ) : (
              documents.map(doc => {
                const age = getAgeInfo(doc.created_at)
                const categoryLabel = CATEGORIES.find(c => c.value === doc.category)?.label || doc.category
                return (
                  <div key={doc.id} className={`bg-slate-900 border rounded-xl overflow-hidden ${age.warn ? 'border-slate-700' : 'border-slate-800'}`}>
                    <div className="flex items-center justify-between px-4 py-3">
                      <div className="flex items-center gap-2 min-w-0 flex-wrap">
                        <span className="text-xs font-semibold bg-blue-900/50 text-blue-300 border border-blue-800 px-2 py-0.5 rounded-full shrink-0">
                          {doc.country}
                        </span>
                        <span className="text-xs font-medium bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full shrink-0">
                          {categoryLabel}
                        </span>
                        <span className={`flex items-center gap-1 text-xs font-medium shrink-0 ${age.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${age.dot}`} />
                          {age.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 ml-2 shrink-0">
                        {doc.source_url && (
                          <a
                            href={doc.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Check source for updates"
                            className="text-slate-400 hover:text-blue-400 p-1.5 rounded-lg hover:bg-slate-800 transition"
                          >
                            <ExternalLink size={15} />
                          </a>
                        )}
                        <button
                          onClick={() => setExpandedId(expandedId === doc.id ? null : doc.id)}
                          className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
                        >
                          {expandedId === doc.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                        <button
                          onClick={() => handleDelete(doc.id)}
                          disabled={deletingId === doc.id}
                          className="text-slate-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-slate-800 transition disabled:opacity-50"
                        >
                          {deletingId === doc.id
                            ? <Loader2 size={16} className="animate-spin" />
                            : <Trash2 size={16} />}
                        </button>
                      </div>
                    </div>
                    {expandedId === doc.id && (
                      <div className="px-4 pb-4 border-t border-slate-800 pt-3 space-y-2">
                        {doc.source_url && (
                          <a
                            href={doc.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-400 hover:underline flex items-center gap-1"
                          >
                            <ExternalLink size={12} /> {doc.source_url}
                          </a>
                        )}
                        <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                          {doc.content}
                        </p>
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </>
  )
}
