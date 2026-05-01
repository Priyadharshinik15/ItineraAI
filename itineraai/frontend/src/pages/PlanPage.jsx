import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { MapPin, Calendar, Users, Wallet, Compass, Globe, Key, Sparkles } from 'lucide-react'

const LANGUAGES = [
  'English','Tamil','Hindi','French','Spanish','German','Italian','Portuguese',
  'Japanese','Korean','Chinese','Arabic','Russian','Turkish','Dutch',
  'Polish','Swedish','Greek','Indonesian','Thai'
]

const BUDGETS = ['Low', 'Medium', 'High']
const STYLES = ['Adventure', 'Relaxation', 'Culture', 'Food', 'Mixed']

const HERO_IMGS = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80',
  'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1920&q=80',
]

export default function PlanPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()

  const [form, setForm] = useState({
    destination: params.get('city') || '',
    from_city: '',
    date_from: '',
    date_to: '',
    travelers: 1,
    budget: 'Medium',
    travel_style: 'Mixed',
    language: 'English',
    interests: '',
    groq_api_key: localStorage.getItem('groq_key') || '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [bgIdx, setBgIdx] = useState(0)

  useEffect(() => {
    if (!user) navigate('/')
    const t = setInterval(() => setBgIdx(i => (i + 1) % HERO_IMGS.length), 6000)
    return () => clearInterval(t)
  }, [user, navigate])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleGenerate = async () => {
    if (!form.destination || !form.from_city || !form.date_from || !form.date_to || !form.groq_api_key) {
      setError('Please fill all required fields including your Groq API key.')
      return
    }
    setLoading(true); setError('')
    localStorage.setItem('groq_key', form.groq_api_key)

    try {
      const r = await fetch('http://localhost:8000/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, user_email: user.email })
      })
      const data = await r.json()
      if (!r.ok) throw new Error(data.detail || 'Generation failed')
      navigate('/results', { state: { report: data } })
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const Field = ({ label, icon, children }) => (
    <div>
      <label className="flex items-center gap-2 text-xs tracking-widest uppercase text-cream/40 mb-2">
        <span style={{ color: 'var(--gold)' }}>{icon}</span> {label}
      </label>
      {children}
    </div>
  )

  const inputClass = "w-full px-4 py-3 rounded-sm text-sm text-cream placeholder-cream/20 outline-none transition-all duration-200"
  const inputStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }
  const focusStyle = { borderColor: 'var(--gold)', background: 'rgba(201,168,76,0.04)' }

  return (
    <div className="min-h-screen pt-20" style={{ background: 'var(--dark)' }}>

      {/* Hero strip */}
      <div className="relative h-48 overflow-hidden">
        {HERO_IMGS.map((img, i) => (
          <div key={i} className="absolute inset-0 transition-opacity duration-2000"
            style={{ backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: bgIdx === i ? 1 : 0 }} />
        ))}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(10,10,10,1))' }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--gold)' }}>✦ Plan Your Journey</p>
            <h1 className="font-display text-4xl font-light text-cream">Where to next, <em className="italic" style={{ color: 'var(--gold-light)' }}>{user?.name}?</em></h1>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="rounded-lg overflow-hidden" style={{ background: 'var(--dark3)', border: '1px solid rgba(201,168,76,0.15)', boxShadow: '0 40px 120px rgba(0,0,0,0.5)' }}>
          <div className="h-1" style={{ background: 'linear-gradient(to right, var(--gold-dark, #A8873A), var(--gold), var(--gold-light))' }} />

          <div className="p-8 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

              <Field label="Destination City *" icon={<MapPin size={12} />}>
                <input value={form.destination} onChange={e => set('destination', e.target.value)}
                  placeholder="e.g. Rome, Tokyo, Dubai" className={inputClass} style={inputStyle}
                  onFocus={e => Object.assign(e.target.style, focusStyle)}
                  onBlur={e => Object.assign(e.target.style, inputStyle)} />
              </Field>

              <Field label="Traveling From *" icon={<MapPin size={12} />}>
                <input value={form.from_city} onChange={e => set('from_city', e.target.value)}
                  placeholder="e.g. India, Chennai" className={inputClass} style={inputStyle}
                  onFocus={e => Object.assign(e.target.style, focusStyle)}
                  onBlur={e => Object.assign(e.target.style, inputStyle)} />
              </Field>

              <Field label="Arrival Date *" icon={<Calendar size={12} />}>
                <input type="date" value={form.date_from} onChange={e => set('date_from', e.target.value)}
                  className={inputClass} style={{ ...inputStyle, colorScheme: 'dark' }}
                  onFocus={e => Object.assign(e.target.style, { ...focusStyle, colorScheme: 'dark' })}
                  onBlur={e => Object.assign(e.target.style, { ...inputStyle, colorScheme: 'dark' })} />
              </Field>

              <Field label="Departure Date *" icon={<Calendar size={12} />}>
                <input type="date" value={form.date_to} onChange={e => set('date_to', e.target.value)}
                  className={inputClass} style={{ ...inputStyle, colorScheme: 'dark' }}
                  onFocus={e => Object.assign(e.target.style, { ...focusStyle, colorScheme: 'dark' })}
                  onBlur={e => Object.assign(e.target.style, { ...inputStyle, colorScheme: 'dark' })} />
              </Field>

              <Field label="Number of Travelers" icon={<Users size={12} />}>
                <input type="number" min="1" max="20" value={form.travelers} onChange={e => set('travelers', e.target.value)}
                  className={inputClass} style={inputStyle}
                  onFocus={e => Object.assign(e.target.style, focusStyle)}
                  onBlur={e => Object.assign(e.target.style, inputStyle)} />
              </Field>

              <Field label="Preferred Language" icon={<Globe size={12} />}>
                <select value={form.language} onChange={e => set('language', e.target.value)}
                  className={inputClass} style={{ ...inputStyle, colorScheme: 'dark' }}>
                  {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </Field>
            </div>

            {/* Budget */}
            <Field label="Budget Preference" icon={<Wallet size={12} />}>
              <div className="flex gap-3 mt-2 mb-6">
                {BUDGETS.map(b => (
                  <button key={b} onClick={() => set('budget', b)}
                    className="flex-1 py-3 rounded-sm text-sm transition-all duration-200"
                    style={form.budget === b
                      ? { background: 'var(--gold)', color: 'var(--dark)', fontWeight: 500 }
                      : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(245,237,214,0.6)' }}>
                    {b === 'Low' ? '💸' : b === 'Medium' ? '💰' : '💎'} {b}
                  </button>
                ))}
              </div>
            </Field>

            {/* Travel Style */}
            <Field label="Travel Style" icon={<Compass size={12} />}>
              <div className="flex flex-wrap gap-3 mt-2 mb-6">
                {STYLES.map(s => (
                  <button key={s} onClick={() => set('travel_style', s)}
                    className="px-5 py-2 rounded-full text-sm transition-all duration-200"
                    style={form.travel_style === s
                      ? { background: 'rgba(201,168,76,0.2)', border: '1px solid var(--gold)', color: 'var(--gold)' }
                      : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(245,237,214,0.5)' }}>
                    {s}
                  </button>
                ))}
              </div>
            </Field>

            {/* Interests */}
            <Field label="Your Interests" icon={<Sparkles size={12} />}>
              <input value={form.interests} onChange={e => set('interests', e.target.value)}
                placeholder="e.g. sightseeing, street food, museums, beaches, nightlife"
                className={`${inputClass} mb-6`} style={inputStyle}
                onFocus={e => Object.assign(e.target.style, focusStyle)}
                onBlur={e => Object.assign(e.target.style, inputStyle)} />
            </Field>

            {/* API Key */}
            <div className="p-4 rounded-sm mb-6" style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.2)' }}>
              <Field label="Groq API Key *" icon={<Key size={12} />}>
                <input value={form.groq_api_key} onChange={e => set('groq_api_key', e.target.value)}
                  placeholder="gsk_..." type="password" className={inputClass} style={inputStyle}
                  onFocus={e => Object.assign(e.target.style, focusStyle)}
                  onBlur={e => Object.assign(e.target.style, inputStyle)} />
                <p className="text-xs text-cream/30 mt-2">
                  Free key at <a href="https://console.groq.com" target="_blank" rel="noreferrer" style={{ color: 'var(--gold)' }}>console.groq.com</a> · Saved locally, never sent to our servers
                </p>
              </Field>
            </div>

            {error && <div className="mb-4 p-3 rounded text-xs text-red-400 bg-red-400/10">{error}</div>}

            <button onClick={handleGenerate} disabled={loading}
              className="w-full py-5 rounded-sm text-sm tracking-widest uppercase font-medium transition-all duration-300 flex items-center justify-center gap-3"
              style={{ background: loading ? 'rgba(201,168,76,0.5)' : 'var(--gold)', color: 'var(--dark)' }}
              onMouseEnter={e => !loading && (e.currentTarget.style.boxShadow = '0 20px 60px rgba(201,168,76,0.4)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}>
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-dark/30 border-t-dark rounded-full animate-spin" />
                  AI Agents are Researching... (~60 seconds)
                </>
              ) : (
                <> <Sparkles size={16} /> Generate My Travel Plan </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
