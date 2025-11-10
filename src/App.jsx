import { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Section({ title, subtitle, children }) {
  return (
    <section className="max-w-5xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-white">{title}</h2>
      {subtitle && <p className="text-slate-300 mt-2">{subtitle}</p>}
      <div className="mt-6">{children}</div>
    </section>
  )
}

function EmergencyForm() {
  const [form, setForm] = useState({ category: 'harassment', description: '', jurisdiction: 'IN' })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/emergency`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form }) })
      const data = await res.json()
      setResult(data)
    } catch (e) {
      setResult({ error: 'Unable to reach backend' })
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="bg-slate-800/60 rounded-xl p-6 border border-slate-700">
      <form onSubmit={submit} className="grid gap-4">
        <div>
          <label className="block text-slate-300 mb-1">Category</label>
          <select className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100" value={form.category} onChange={e=>setForm(f=>({...f, category:e.target.value}))}>
            <option value="accident">Accident</option>
            <option value="harassment">Harassment</option>
            <option value="fraud">Fraud</option>
            <option value="threat">Threat</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-slate-300 mb-1">Description</label>
          <textarea className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100" rows={3} value={form.description} onChange={e=>setForm(f=>({...f, description:e.target.value}))} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 mb-1">Jurisdiction</label>
            <select className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100" value={form.jurisdiction} onChange={e=>setForm(f=>({...f, jurisdiction:e.target.value}))}>
              <option value="IN">India (BNS)</option>
              <option value="AE">UAE (Penal Code)</option>
            </select>
          </div>
        </div>
        <button className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded px-4 py-2 transition" disabled={loading}>
          {loading ? 'Activating…' : 'Activate Emergency Guidance'}
        </button>
      </form>
      {result && (
        <div className="mt-6 bg-slate-900/50 border border-slate-700 rounded p-4">
          {result.error ? (
            <p className="text-rose-300">{result.error}</p>
          ) : (
            <>
              <h4 className="text-slate-100 font-semibold">Guidance</h4>
              <ul className="list-disc pl-5 text-slate-300 mt-2">
                {result.guidance?.map((g, i)=>(<li key={i}>{g}</li>))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  )
}

function LawForm() {
  const [form, setForm] = useState({ question: '', depth: 'normal', jurisdiction: 'IN' })
  const [answer, setAnswer] = useState(null)
  const [loading, setLoading] = useState(false)
  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/law`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form }) })
      const data = await res.json()
      setAnswer(data?.answer)
    } catch (e) {
      setAnswer({ summary: 'Unable to reach backend', citations: [] })
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="bg-slate-800/60 rounded-xl p-6 border border-slate-700">
      <form onSubmit={submit} className="grid gap-4">
        <div>
          <label className="block text-slate-300 mb-1">Your Question</label>
          <textarea className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100" rows={3} value={form.question} onChange={e=>setForm(f=>({...f, question:e.target.value}))} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 mb-1">Mode</label>
            <select className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100" value={form.depth} onChange={e=>setForm(f=>({...f, depth:e.target.value}))}>
              <option value="normal">Normal</option>
              <option value="deep">Deep</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-300 mb-1">Jurisdiction</label>
            <select className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100" value={form.jurisdiction} onChange={e=>setForm(f=>({...f, jurisdiction:e.target.value}))}>
              <option value="IN">India (BNS)</option>
              <option value="AE">UAE (Penal Code)</option>
            </select>
          </div>
        </div>
        <button className="bg-sky-500 hover:bg-sky-400 text-black font-semibold rounded px-4 py-2 transition" disabled={loading}>
          {loading ? 'Thinking…' : 'Ask ResQ'}
        </button>
      </form>
      {answer && (
        <div className="mt-6 bg-slate-900/50 border border-slate-700 rounded p-4 text-slate-100">
          <div className="font-semibold">Summary</div>
          <p className="text-slate-300 mt-1">{answer.summary}</p>
          {!!(answer.citations?.length) && (
            <>
              <div className="font-semibold mt-3">Citations</div>
              <ul className="list-disc pl-5 text-slate-300 mt-1">
                {answer.citations?.map((c, i)=>(<li key={i}>{c.source} – {c.relevance}</li>))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default function App() {
  const [healthy, setHealthy] = useState('')
  useEffect(()=>{
    fetch(`${API_BASE}/health`).then(r=>r.json()).then(()=>setHealthy('Online'))
      .catch(()=>setHealthy('Offline'))
  },[])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white">
      <header className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">ResQ AI</h1>
            <p className="text-slate-300">Legal Help, Reinvented. Status: <span className={healthy==='Online'? 'text-emerald-400':'text-rose-400'}>{healthy}</span></p>
          </div>
        </div>
      </header>

      <Section title="Emergency Mode" subtitle="Fast, guided legal response in critical moments.">
        <EmergencyForm />
      </Section>

      <Section title="Law Mode" subtitle="Everyday legal answers grounded in statutes and judgments.">
        <LawForm />
      </Section>

      <footer className="max-w-6xl mx-auto px-4 py-10 text-slate-400">
        Built under AIrealm Technologies Pvt. Ltd
      </footer>
    </div>
  )
}
