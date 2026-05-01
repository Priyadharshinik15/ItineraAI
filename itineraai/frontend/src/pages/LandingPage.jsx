import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const SLIDES = [
  { img: 'https://images.unsplash.com/photo-1552832230-c0197DD951b3?w=1920&q=80', city: 'Rome', country: 'Italy' },
  { img: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=1920&q=80', city: 'Santorini', country: 'Greece' },
  { img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1920&q=80', city: 'Tokyo', country: 'Japan' },
  { img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&q=80', city: 'Dubai', country: 'UAE' },
  { img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1920&q=80', city: 'Singapore', country: 'Singapore' },
]

const DESTINATIONS = [
  { img: 'https://images.unsplash.com/photo-1552832230-c0197DD951b3?w=600&q=80', city: 'Rome', country: 'Italy' },
  { img: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=600&q=80', city: 'Paris', country: 'France' },
  { img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80', city: 'Tokyo', country: 'Japan' },
  { img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80', city: 'Dubai', country: 'UAE' },
  { img: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600&q=80', city: 'Santorini', country: 'Greece' },
  { img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80', city: 'Singapore', country: 'Singapore' },
  { img: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=600&q=80', city: 'Mykonos', country: 'Greece' },
  { img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', city: 'New York', country: 'USA' },
  { img: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&q=80', city: 'Delhi', country: 'India' },
  { img: 'https://images.unsplash.com/photo-1538332576228-eb5b4c4de6f5?w=600&q=80', city: 'Amsterdam', country: 'Netherlands' },
]

const STEPS = [
  { icon: '🔐', title: 'Create Account', desc: 'Register for free in seconds. Your travel history is saved securely.' },
  { icon: '📝', title: 'Enter Trip Details', desc: 'Tell us your destination, dates, budget, travel style, and language preference.' },
  { icon: '🤖', title: 'AI Generates Plan', desc: 'Three specialized AI agents research and craft your personalized reports.' },
  { icon: '⬇️', title: 'Download & Go', desc: 'Get 3 detailed reports — City, Guide, and Itinerary — as beautiful PDFs.' },
]

export default function LandingPage() {
  const [current, setCurrent] = useState(0)
  const { user } = useAuth()

  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % SLIDES.length), 5000)
    return () => clearInterval(t)
  }, [])

  return (
    <div style={{ background: '#0A0A0A', minHeight: '100vh' }}>

      {/* ── HERO ── */}
      <div style={{ position: 'relative', height: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

        {/* Slideshow */}
        {SLIDES.map((s, i) => (
          <div key={i} style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${s.img})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            opacity: i === current ? 1 : 0,
            transition: 'opacity 1.8s ease-in-out',
            transform: 'scale(1.04)',
          }} />
        ))}

        {/* Overlay */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.6) 60%, rgba(0,0,0,0.9) 100%)',
        }} />

        {/* City label */}
        <div style={{
          position: 'absolute', bottom: 80, right: 48, zIndex: 3,
          textAlign: 'right',
        }}>
          <div style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '2rem', color: '#F5EDD6', fontWeight: 300 }}>
            {SLIDES[current].city}
          </div>
          <div style={{ fontSize: '0.7rem', letterSpacing: '3px', color: '#C9A84C', textTransform: 'uppercase' }}>
            {SLIDES[current].country}
          </div>
        </div>

        {/* Slide dots */}
        <div style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', zIndex: 3, display: 'flex', gap: 8 }}>
          {SLIDES.map((_, i) => (
            <div key={i} onClick={() => setCurrent(i)} style={{
              width: i === current ? 28 : 8, height: 8, borderRadius: 4,
              background: i === current ? '#C9A84C' : 'rgba(255,255,255,0.3)',
              cursor: 'pointer', transition: 'all 0.4s',
            }} />
          ))}
        </div>

        {/* Hero Content */}
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 24px', animation: 'fadeUp 1.2s ease forwards' }}>
          <div style={{
            display: 'inline-block', fontSize: '0.68rem', letterSpacing: '4px',
            textTransform: 'uppercase', color: '#C9A84C',
            border: '1px solid rgba(201,168,76,0.5)', padding: '6px 20px',
            marginBottom: 28, borderRadius: 1,
          }}>
            ✦ AI-Powered Travel Planning
          </div>

          <h1 style={{
            fontFamily: '"Cormorant Garamond",serif',
            fontSize: 'clamp(4.5rem,11vw,10rem)',
            fontWeight: 300, lineHeight: 0.92,
            letterSpacing: '-2px', marginBottom: 16,
            color: '#F5EDD6',
          }}>
            Itinera<em style={{ color: '#E8C96A', fontStyle: 'italic' }}>AI</em>
          </h1>

          <p style={{
            fontFamily: '"Cormorant Garamond",serif',
            fontSize: 'clamp(1rem,2.2vw,1.5rem)',
            fontStyle: 'italic', fontWeight: 300,
            color: 'rgba(245,237,214,0.65)',
            letterSpacing: '2px', marginBottom: 52,
          }}>
            Your intelligent journey begins here
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to={user ? '/plan' : '/register'} style={{
              display: 'inline-flex', alignItems: 'center', gap: 12,
              fontSize: '0.82rem', letterSpacing: '3px', textTransform: 'uppercase',
              color: '#0A0A0A', background: '#C9A84C',
              padding: '18px 52px', borderRadius: 2, textDecoration: 'none',
              fontWeight: 500, transition: 'all 0.4s',
              boxShadow: '0 16px 48px rgba(201,168,76,0.35)',
            }}>
              {user ? '✦ Start Planning' : '✦ Get Started Free'} →
            </Link>
            <a href="#about" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontSize: '0.82rem', letterSpacing: '3px', textTransform: 'uppercase',
              color: 'rgba(245,237,214,0.7)',
              border: '1px solid rgba(255,255,255,0.2)',
              padding: '18px 36px', borderRadius: 2, textDecoration: 'none',
              transition: 'all 0.3s',
            }}>
              Learn More
            </a>
          </div>
        </div>
      </div>

      {/* ── GOLD STRIP ── */}
      <div style={{ height: 2, background: 'linear-gradient(to right,transparent,#C9A84C,transparent)', opacity: 0.4 }} />

      {/* ── ABOUT SECTION ── */}
      <section id="about" style={{ padding: '100px 24px', maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: '0.68rem', letterSpacing: '5px', textTransform: 'uppercase', color: '#C9A84C', marginBottom: 20 }}>
          ✦ About ItineraAI
        </div>
        <h2 style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 300, color: '#F5EDD6', marginBottom: 24, lineHeight: 1.1 }}>
          Premium Travel Planning,<br /><em style={{ color: '#E8C96A', fontStyle: 'italic' }}>Powered by AI</em>
        </h2>
        <p style={{ fontSize: '1rem', lineHeight: 1.8, color: 'rgba(245,237,214,0.65)', maxWidth: 680, margin: '0 auto 60px', }}>
          ItineraAI uses three specialized AI agents — a Location Expert, a City Guide, and a Travel Planner — working together with real-time web search to generate a complete, personalized travel report in your language. From visa requirements to day-by-day itineraries, budget analysis to hotel recommendations.
        </p>

        {/* Feature cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 24 }}>
          {[
            { icon: '🤖', t: 'Multi-Agent AI', d: 'Three CrewAI agents each specialize in different aspects of your trip planning.' },
            { icon: '🌐', t: '20 Languages', d: 'Receive your entire travel plan in Tamil, Hindi, Arabic, Japanese — or any of 20 languages.' },
            { icon: '🖼️', t: 'Real City Images', d: 'Beautiful photos from Unsplash and Pexels for every destination and attraction.' },
            { icon: '📄', t: 'PDF Download', d: '3 downloadable reports: City Overview, Local Guide, and Day-by-Day Itinerary.' },
            { icon: '💰', t: 'Budget Analysis', d: 'Low / Medium / High budget breakdowns with total trip cost estimates.' },
            { icon: '🔐', t: 'Saved History', d: 'All your generated plans are saved to your account for future reference.' },
          ].map((f, i) => (
            <div key={i} style={{
              padding: '32px 24px', textAlign: 'left',
              border: '1px solid rgba(201,168,76,0.12)',
              borderRadius: 6, background: 'rgba(255,255,255,0.02)',
              transition: 'all 0.4s',
            }}>
              <div style={{ fontSize: '2rem', marginBottom: 14 }}>{f.icon}</div>
              <div style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '1.25rem', color: '#F5EDD6', marginBottom: 8 }}>{f.t}</div>
              <div style={{ fontSize: '0.85rem', color: 'rgba(245,237,214,0.55)', lineHeight: 1.6 }}>{f.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── DESTINATIONS ── */}
      <section style={{ padding: '0 0 100px' }}>
        <div style={{ textAlign: 'center', fontSize: '0.68rem', letterSpacing: '5px', textTransform: 'uppercase', color: '#C9A84C', marginBottom: 48 }}>
          ✦ Curated Destinations
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 2, maxWidth: 1600, margin: '0 auto', padding: '0 2px' }}>
          {DESTINATIONS.slice(0, 10).map((d, i) => (
            <div key={i} style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', cursor: 'pointer' }}
              onClick={() => window.location.href = '/plan'}>
              <img src={d.img} alt={d.city} style={{
                width: '100%', height: '100%', objectFit: 'cover',
                filter: 'brightness(0.72) saturate(0.9)',
                transition: 'all 0.6s ease',
              }}
                onMouseOver={e => { e.target.style.transform = 'scale(1.06)'; e.target.style.filter = 'brightness(0.9) saturate(1.1)' }}
                onMouseOut={e => { e.target.style.transform = 'scale(1)'; e.target.style.filter = 'brightness(0.72) saturate(0.9)' }}
              />
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                padding: '40px 16px 16px',
                background: 'linear-gradient(to top,rgba(0,0,0,0.88),transparent)',
              }}>
                <div style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '1.1rem' }}>{d.city}</div>
                <div style={{ fontSize: '0.65rem', letterSpacing: '2px', textTransform: 'uppercase', color: '#C9A84C', marginTop: 3 }}>{d.country}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" style={{ padding: '100px 24px', background: 'rgba(255,255,255,0.015)', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '0.68rem', letterSpacing: '5px', textTransform: 'uppercase', color: '#C9A84C', marginBottom: 20 }}>
            ✦ How It Works
          </div>
          <h2 style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 300, color: '#F5EDD6', marginBottom: 60 }}>
            Four steps to your <em style={{ color: '#E8C96A', fontStyle: 'italic' }}>perfect journey</em>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 32 }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '0 16px' }}>
                <div style={{
                  width: 64, height: 64, borderRadius: '50%', margin: '0 auto 20px',
                  background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.6rem',
                }}>{s.icon}</div>
                <div style={{
                  fontSize: '0.6rem', letterSpacing: '3px', textTransform: 'uppercase',
                  color: '#C9A84C', marginBottom: 8,
                }}>Step {i + 1}</div>
                <div style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '1.2rem', color: '#F5EDD6', marginBottom: 10 }}>{s.title}</div>
                <div style={{ fontSize: '0.83rem', color: 'rgba(245,237,214,0.55)', lineHeight: 1.6 }}>{s.desc}</div>
                {i < STEPS.length - 1 && (
                  <div style={{ display: 'none' }}>→</div>
                )}
              </div>
            ))}
          </div>

          <div style={{ marginTop: 64 }}>
            <Link to={user ? '/plan' : '/register'} style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              fontSize: '0.82rem', letterSpacing: '3px', textTransform: 'uppercase',
              color: '#0A0A0A', background: '#C9A84C',
              padding: '18px 52px', borderRadius: 2, textDecoration: 'none',
              fontWeight: 500, boxShadow: '0 16px 40px rgba(201,168,76,0.3)',
            }}>
              {user ? 'Plan Your Trip' : 'Start for Free'} →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding: '40px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '1.3rem', fontWeight: 300, letterSpacing: '3px' }}>
          Itinera<span style={{ color: '#C9A84C' }}>AI</span>
        </div>
        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)', letterSpacing: '1px' }}>
          © 2025 ItineraAI · Built with React + FastAPI + Groq LLaMA 3
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          <Link to="/login"    style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>Login</Link>
          <Link to="/register" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>Register</Link>
        </div>
      </footer>

      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  )
}
