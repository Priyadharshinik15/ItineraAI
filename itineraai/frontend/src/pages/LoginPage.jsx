import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const BG = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80'

function AuthLayout({ children, title, subtitle, bg }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#0A0A0A', paddingTop: 64 }}>
      {/* Left panel - image */}
      <div style={{
        flex: 1, display: 'none', position: 'relative',
        backgroundImage: `url(${bg || BG})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
      }} className="auth-panel">
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right,rgba(0,0,0,0.5),rgba(0,0,0,0.2))' }} />
        <div style={{ position: 'absolute', bottom: 60, left: 48, zIndex: 1 }}>
          <div style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '3rem', fontWeight: 300, color: '#F5EDD6' }}>
            Itinera<span style={{ color: '#C9A84C' }}>AI</span>
          </div>
          <div style={{ fontSize: '0.8rem', letterSpacing: '3px', color: 'rgba(245,237,214,0.6)', textTransform: 'uppercase', marginTop: 8 }}>
            Your AI Travel Companion
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <div style={{ marginBottom: 40, textAlign: 'center' }}>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <div style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '2rem', fontWeight: 300, letterSpacing: '3px', color: '#F5EDD6' }}>
                Itinera<span style={{ color: '#C9A84C' }}>AI</span>
              </div>
            </Link>
            <div style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '1.6rem', fontWeight: 300, color: '#F5EDD6', marginTop: 24 }}>{title}</div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(245,237,214,0.45)', letterSpacing: '1px', marginTop: 6 }}>{subtitle}</div>
          </div>
          {children}
        </div>
      </div>
      <style>{`@media(min-width:900px){.auth-panel{display:block!important;}}`}</style>
    </div>
  )
}

export function LoginPage() {
  const [email, setEmail]   = useState('')
  const [pass, setPass]     = useState('')
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate  = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      await login(email, pass)
      navigate('/plan')
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Check your credentials.')
    } finally { setLoading(false) }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to continue planning" bg="https://images.unsplash.com/photo-1552832230-c0197DD951b3?w=1200&q=80">
      <form onSubmit={submit}>
        {error && <div style={errStyle}>{error}</div>}
        <Field label="Email Address" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
        <Field label="Password" type="password" value={pass} onChange={setPass} placeholder="••••••••" />
        <button type="submit" style={submitBtn} disabled={loading}>
          {loading ? '✦ Signing in…' : '✦ Login to ItineraAI →'}
        </button>
        <div style={{ textAlign: 'center', marginTop: 24, fontSize: '0.82rem', color: 'rgba(245,237,214,0.45)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#C9A84C', textDecoration: 'none' }}>Register free</Link>
        </div>
      </form>
    </AuthLayout>
  )
}

export function RegisterPage() {
  const [name, setName]   = useState('')
  const [email, setEmail] = useState('')
  const [pass, setPass]   = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    if (pass.length < 6) { setError('Password must be at least 6 characters'); return }
    setError(''); setLoading(true)
    try {
      await register(name, email, pass)
      navigate('/plan')
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed.')
    } finally { setLoading(false) }
  }

  return (
    <AuthLayout title="Create your account" subtitle="Start planning smarter trips today" bg="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=80">
      <form onSubmit={submit}>
        {error && <div style={errStyle}>{error}</div>}
        <Field label="Full Name" type="text" value={name} onChange={setName} placeholder="Your name" />
        <Field label="Email Address" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
        <Field label="Password" type="password" value={pass} onChange={setPass} placeholder="Min 6 characters" />
        <button type="submit" style={submitBtn} disabled={loading}>
          {loading ? '✦ Creating account…' : '✦ Create Free Account →'}
        </button>
        <div style={{ textAlign: 'center', marginTop: 24, fontSize: '0.82rem', color: 'rgba(245,237,214,0.45)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#C9A84C', textDecoration: 'none' }}>Sign in</Link>
        </div>
      </form>
    </AuthLayout>
  )
}

function Field({ label, type, value, onChange, placeholder }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: 'block', fontSize: '0.68rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(245,237,214,0.4)', marginBottom: 8 }}>{label}</label>
      <input
        type={type} value={value} placeholder={placeholder} required
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: '100%', padding: '14px 16px',
          background: 'rgba(255,255,255,0.05)',
          border: `1px solid ${focused ? '#C9A84C' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: 4, color: '#F5EDD6',
          fontSize: '0.9rem', outline: 'none', transition: 'border-color 0.3s',
        }}
      />
    </div>
  )
}

const submitBtn = {
  width: '100%', padding: '16px',
  background: '#C9A84C', border: 'none', borderRadius: 4,
  color: '#0A0A0A', fontSize: '0.82rem',
  letterSpacing: '2px', textTransform: 'uppercase',
  fontWeight: 500, cursor: 'pointer',
  transition: 'all 0.3s', marginTop: 8,
}
const errStyle = {
  background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
  color: '#fca5a5', padding: '12px 16px', borderRadius: 4,
  fontSize: '0.85rem', marginBottom: 20,
}

export default LoginPage
