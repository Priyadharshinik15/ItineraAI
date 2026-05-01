import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

const API = 'http://localhost:8000'

const LANGUAGES = [
  'English','Tamil','Hindi','French','Spanish','German','Italian',
  'Portuguese','Japanese','Korean','Chinese','Arabic','Russian',
  'Turkish','Dutch','Polish','Swedish','Greek','Indonesian','Thai',
]
const BUDGETS = ['Low 💸', 'Medium 💰', 'High 💎']
const STYLES  = ['Adventure 🧗', 'Relaxation 🏖️', 'Culture 🏛️', 'Food 🍜', 'Mixed 🌈']
const TRAVELERS = ['1', '2', '3', '4', '5', '6+']

const CITY_IMAGES = {
  default: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
  rome:    'https://images.unsplash.com/photo-1552832230-c0197DD951b3?w=1920&q=80',
  paris:   'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=1920&q=80',
  tokyo:   'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1920&q=80',
  dubai:   'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&q=80',
  bali:    'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1920&q=80',
  london:  'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1920&q=80',
}

export default function InputPage() {
  const { user, authHeader } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    destination: '', from_city: 'India',
    date_from: '', date_to: '',
    travelers: '2', budget: 'Medium',
    style: 'Mixed', language: 'English',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const bgImg = CITY_IMAGES[form.destination.toLowerCase()] || CITY_IMAGES.default

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const submit = async (e) => {
    e.preventDefault()
    if (!form.destination || !form.date_from || !form.date_to) {
      setError('Please fill in destination and travel dates.'); return
    }
    setError(''); setLoading(true)
    try {
      const payload = {
        ...form,
        travelers: parseInt(form.travelers) || 2,
        budget:    form.budget.split(' ')[0],
        style:     form.style.split(' ')[0],
      }
      const r = await axios.post(`${API}/travel/generate`, payload, { headers: authHeader() })
      sessionStorage.setItem('itinera_report', JSON.stringify(r.data))
      navigate('/report')
    } catch (err) {
      setError(err.response?.data?.detail || 'Generation failed. Check backend & API keys.')
    } finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', paddingTop: 64 }}>
      {/* Hero banner */}
      <div style={{
        position: 'relative', height: 280, overflow: 'hidden',
        backgroundImage: `url(${bgImg})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        transition: 'background-image 0.8s ease',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom,rgba(0,0,0,0.4),rgba(10,10,10,1))' }} />
        <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: '0.68rem', letterSpacing: '5px', textTransform: 'uppercase', color: '#C9A84C', marginBottom: 12 }}>✦ Plan Your Journey</div>
          <h1 style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 300, color: '#F5EDD6' }}>
            Where would you like to <em style={{ color: '#E8C96A', fontStyle: 'italic' }}>go?</em>
          </h1>
        </div>
      </div>

      {/* Form */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px 80px' }}>
        <form onSubmit={submit}>
          {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', padding: '12px 16px', borderRadius: 6, marginBottom: 28, fontSize: '0.85rem' }}>{error}</div>}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

            {/* Destination */}
            <div style={{ gridColumn: '1/-1' }}>
              <SectionLabel>🌍 Destination</SectionLabel>
              <BigInput
                placeholder="e.g. Rome, Tokyo, Dubai, Paris…"
                value={form.destination}
                onChange={v => set('destination', v)}
              />
            </div>

            {/* From */}
            <div>
              <SectionLabel>📍 Traveling From</SectionLabel>
              <SmallInput value={form.from_city} onChange={v => set('from_city', v)} placeholder="India" />
            </div>

            {/* Travelers */}
            <div>
              <SectionLabel>👥 Number of Travelers</SectionLabel>
              <ChipSelect options={TRAVELERS} value={form.travelers} onChange={v => set('travelers', v)} />
            </div>

            {/* Dates */}
            <div>
              <SectionLabel>📅 Arrival Date</SectionLabel>
              <SmallInput type="date" value={form.date_from} onChange={v => set('date_from', v)} />
            </div>
            <div>
              <SectionLabel>📅 Departure Date</SectionLabel>
              <SmallInput type="date" value={form.date_to} onChange={v => set('date_to', v)} />
            </div>

            {/* Budget */}
            <div>
              <SectionLabel>💰 Budget Preference</SectionLabel>
              <ChipSelect options={BUDGETS} value={form.budget} onChange={v => set('budget', v)} fullMatch />
            </div>

            {/* Style */}
            <div>
              <SectionLabel>🎯 Travel Style</SectionLabel>
              <ChipSelect options={STYLES} value={form.style} onChange={v => set('style', v)} fullMatch />
            </div>

            {/* Language */}
            <div style={{ gridColumn: '1/-1' }}>
              <SectionLabel>🌐 Preferred Language (Report will be in this language)</SectionLabel>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
                {LANGUAGES.map(l => (
                  <button key={l} type="button" onClick={() => set('language', l)}
                    style={{
                      padding: '8px 16px', borderRadius: 20, fontSize: '0.78rem',
                      border: `1px solid ${form.language === l ? '#C9A84C' : 'rgba(255,255,255,0.12)'}`,
                      background: form.language === l ? 'rgba(201,168,76,0.15)' : 'transparent',
                      color: form.language === l ? '#C9A84C' : 'rgba(245,237,214,0.55)',
                      cursor: 'pointer', transition: 'all 0.2s',
                    }}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Submit */}
          <div style={{ marginTop: 48, textAlign: 'center' }}>
            <button type="submit" disabled={loading} style={{
              padding: '18px 64px', background: loading ? 'rgba(201,168,76,0.4)' : '#C9A84C',
              border: 'none', borderRadius: 4, color: '#0A0A0A',
              fontSize: '0.9rem', letterSpacing: '3px', textTransform: 'uppercase',
              fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s', boxShadow: '0 16px 40px rgba(201,168,76,0.3)',
            }}>
              {loading ? '🤖 AI Agents Working…' : '✦ Generate My Travel Plan →'}
            </button>
            {loading && (
              <div style={{ marginTop: 16, fontSize: '0.82rem', color: 'rgba(245,237,214,0.5)', letterSpacing: '1px' }}>
                ⏳ This takes 1–3 minutes. Three AI agents are researching your trip…
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

function SectionLabel({ children }) {
  return <div style={{ fontSize: '0.68rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(245,237,214,0.4)', marginBottom: 10 }}>{children}</div>
}
function BigInput({ value, onChange, placeholder }) {
  const [f, setF] = useState(false)
  return (
    <input value={value} placeholder={placeholder} required
      onChange={e => onChange(e.target.value)}
      onFocus={() => setF(true)} onBlur={() => setF(false)}
      style={{
        width: '100%', padding: '18px 20px',
        background: 'rgba(255,255,255,0.04)',
        border: `1px solid ${f ? '#C9A84C' : 'rgba(255,255,255,0.1)'}`,
        borderRadius: 6, color: '#F5EDD6',
        fontSize: '1.1rem', outline: 'none', transition: 'border-color 0.3s',
        fontFamily: '"Cormorant Garamond",serif', letterSpacing: '1px',
      }}
    />
  )
}
function SmallInput({ value, onChange, placeholder, type = 'text' }) {
  const [f, setF] = useState(false)
  return (
    <input type={type} value={value} placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      onFocus={() => setF(true)} onBlur={() => setF(false)}
      style={{
        width: '100%', padding: '13px 16px',
        background: 'rgba(255,255,255,0.04)',
        border: `1px solid ${f ? '#C9A84C' : 'rgba(255,255,255,0.1)'}`,
        borderRadius: 6, color: '#F5EDD6',
        fontSize: '0.9rem', outline: 'none', transition: 'border-color 0.3s',
      }}
    />
  )
}
function ChipSelect({ options, value, onChange, fullMatch }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 2 }}>
      {options.map(o => {
        const active = fullMatch ? value === o : value === o.split(' ')[0] || value === o
        return (
          <button key={o} type="button" onClick={() => onChange(o)}
            style={{
              padding: '9px 18px', borderRadius: 4, fontSize: '0.82rem',
              border: `1px solid ${active ? '#C9A84C' : 'rgba(255,255,255,0.12)'}`,
              background: active ? 'rgba(201,168,76,0.15)' : 'transparent',
              color: active ? '#C9A84C' : 'rgba(245,237,214,0.55)',
              cursor: 'pointer', transition: 'all 0.2s',
            }}>
            {o}
          </button>
        )
      })}
    </div>
  )
}
