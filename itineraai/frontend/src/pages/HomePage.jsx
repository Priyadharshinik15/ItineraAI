import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ArrowRight, Globe, FileText, Zap, Star } from 'lucide-react'

const SLIDES = [
  { url: 'https://images.unsplash.com/photo-1552832230-c0197DD951b3?w=1920&q=80', city: 'Rome', country: 'Italy' },
  { url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1920&q=80', city: 'Tokyo', country: 'Japan' },
  { url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&q=80', city: 'Dubai', country: 'UAE' },
  { url: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600&q=80', city: 'Santorini', country: 'Greece' },
  { url: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=1920&q=80', city: 'New York', country: 'USA' },
]

const DESTINATIONS = [
  { name: 'Rome', country: 'Italy', img: 'https://images.unsplash.com/photo-1552832230-c0197DD951b3?w=600&q=80' },
  { name: 'Paris', country: 'France', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80' },
  { name: 'Tokyo', country: 'Japan', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80' },
  { name: 'Dubai', country: 'UAE', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80' },
  { name: 'Santorini', country: 'Greece', img: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600&q=80' },
  { name: 'New York', country: 'USA', img: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=600&q=80' },
  { name: 'Bangkok', country: 'Thailand', img: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&q=80' },
  { name: 'Barcelona', country: 'Spain', img: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=600&q=80' },
]

const FEATURES = [
  { icon: <Zap size={24} />, title: 'AI Multi-Agent Planning', desc: '3 specialized AI agents work in parallel — Location Expert, City Guide & Travel Planner — each powered by LLaMA 3.3 70B.' },
  { icon: <Globe size={24} />, title: '20 Languages', desc: 'Receive your complete travel plan in your preferred language — Tamil, Hindi, Arabic, Japanese and 16 more.' },
  { icon: <FileText size={24} />, title: '3 Downloadable Reports', desc: 'City overview, local guide and day-by-day itinerary — all downloadable as beautifully formatted PDFs.' },
  { icon: <Star size={24} />, title: 'Premium Output Quality', desc: 'Hotel recommendations, budget analysis, visa info, weather forecast and local tips — all in one report.' },
]

const STEPS = [
  { n: '01', title: 'Create Account', desc: 'Register for free and enter your Groq API key for AI generation.' },
  { n: '02', title: 'Enter Trip Details', desc: 'Fill in destination, dates, budget, travel style and your interests.' },
  { n: '03', title: 'AI Generates Reports', desc: '3 AI agents research and craft your personalized travel plan.' },
  { n: '04', title: 'Download & Go', desc: 'Download all 3 reports as PDF and start packing!' },
]

export default function HomePage({ onLoginClick, onRegisterClick }) {
  const [slide, setSlide] = useState(0)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % SLIDES.length), 5000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="min-h-screen" style={{ background: 'var(--dark)' }}>

      {/* ── HERO ── */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">

        {/* Slideshow */}
        <div className="absolute inset-0">
          {SLIDES.map((s, i) => (
            <div key={i} className="absolute inset-0 transition-opacity duration-2000"
              style={{
                backgroundImage: `url(${s.url})`,
                backgroundSize: 'cover', backgroundPosition: 'center',
                opacity: slide === i ? 1 : 0,
                transform: 'scale(1.04)',
                transition: 'opacity 1.8s ease-in-out'
              }} />
          ))}
        </div>

        {/* Overlays */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.92) 100%)' }} />

        {/* Slide label */}
        <div className="absolute bottom-24 right-12 text-right z-10 animate-fadeIn" key={slide}>
          <p className="text-xs tracking-widest uppercase" style={{ color: 'var(--gold)' }}>{SLIDES[slide].country}</p>
          <p className="font-display text-3xl font-light text-cream">{SLIDES[slide].city}</p>
        </div>

        {/* Slide dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)}
              className="transition-all duration-300 rounded-full"
              style={{ width: slide === i ? 24 : 6, height: 6, background: slide === i ? 'var(--gold)' : 'rgba(255,255,255,0.3)' }} />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-6 animate-fadeUp">
          <div className="inline-block px-5 py-2 mb-8 rounded-sm text-xs tracking-widest uppercase"
            style={{ border: '1px solid rgba(201,168,76,0.4)', color: 'var(--gold)' }}>
            ✦ AI-Powered Travel Planning
          </div>

          <h1 className="font-display font-light leading-none mb-4"
            style={{ fontSize: 'clamp(4rem, 12vw, 10rem)', letterSpacing: '-3px' }}>
            Itinera<em style={{ color: 'var(--gold-light)', fontStyle: 'italic' }}>AI</em>
          </h1>

          <p className="font-display font-light italic text-cream/60 mb-12"
            style={{ fontSize: 'clamp(1rem, 2.5vw, 1.5rem)', letterSpacing: '2px' }}>
            Your intelligent journey begins here
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {user ? (
              <button onClick={() => navigate('/plan')}
                className="group flex items-center gap-3 px-10 py-4 rounded-sm text-xs tracking-widest uppercase font-medium transition-all duration-400"
                style={{ background: 'var(--gold)', color: 'var(--dark)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--gold-light)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--gold)'; e.currentTarget.style.transform = 'translateY(0)' }}>
                Start Planning <ArrowRight size={15} />
              </button>
            ) : (
              <>
                <button onClick={onRegisterClick}
                  className="group flex items-center gap-3 px-10 py-4 rounded-sm text-xs tracking-widest uppercase font-medium transition-all duration-300"
                  style={{ background: 'var(--gold)', color: 'var(--dark)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--gold-light)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 20px 60px rgba(201,168,76,0.4)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--gold)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}>
                  Get Started Free <ArrowRight size={15} />
                </button>
                <button onClick={onLoginClick}
                  className="px-8 py-4 rounded-sm text-xs tracking-widest uppercase text-cream/70 transition-all duration-300"
                  style={{ border: '1px solid rgba(255,255,255,0.2)' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'rgba(245,237,214,0.7)' }}>
                  Sign In
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section className="py-28 px-6" style={{ background: 'var(--dark2)' }}>
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs tracking-widest uppercase mb-5" style={{ color: 'var(--gold)' }}>✦ About ItineraAI</p>
          <h2 className="font-display text-5xl font-light text-cream mb-8">
            Plan smarter.<br /><em className="italic" style={{ color: 'var(--gold-light)' }}>Travel better.</em>
          </h2>
          <p className="text-base text-cream/55 leading-relaxed max-w-2xl mx-auto mb-16">
            ItineraAI uses cutting-edge AI models (LLaMA 3.3 via Groq) and a crew of 3 specialized travel agents
            to generate premium, personalized travel reports — complete with hotel recommendations, day-wise
            itineraries, budget breakdowns, visa info, and stunning destination imagery.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, i) => (
              <div key={i} className="p-6 rounded-md text-left transition-all duration-400 group cursor-default"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,168,76,0.1)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)'; e.currentTarget.style.transform = 'translateY(-8px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.1)'; e.currentTarget.style.transform = 'translateY(0)' }}>
                <div className="mb-4" style={{ color: 'var(--gold)' }}>{f.icon}</div>
                <h3 className="font-display text-xl font-light text-cream mb-2">{f.title}</h3>
                <p className="text-sm text-cream/45 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gold divider */}
      <div className="h-px" style={{ background: 'linear-gradient(to right, transparent, var(--gold), transparent)', opacity: 0.3 }} />

      {/* ── DESTINATIONS ── */}
      <section className="py-24 px-6" style={{ background: 'var(--dark)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs tracking-widest uppercase mb-3" style={{ color: 'var(--gold)' }}>✦ Explore</p>
            <h2 className="font-display text-5xl font-light text-cream">Popular Destinations</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {DESTINATIONS.map((d, i) => (
              <div key={i} className="group relative overflow-hidden rounded-md cursor-pointer"
                style={{ aspectRatio: i < 2 ? '4/5' : '3/4' }}
                onClick={() => user ? navigate(`/plan?city=${d.name}`) : onRegisterClick()}>
                <img src={d.img} alt={d.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  style={{ filter: 'brightness(0.7) saturate(0.9)' }}
                  onMouseEnter={e => e.target.style.filter = 'brightness(0.85) saturate(1.1)'}
                  onMouseLeave={e => e.target.style.filter = 'brightness(0.7) saturate(0.9)'}
                />
                <div className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)' }} />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="font-display text-lg font-light text-cream">{d.name}</p>
                  <p className="text-xs tracking-widest uppercase mt-1" style={{ color: 'var(--gold)' }}>{d.country}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW TO USE ── */}
      <section className="py-28 px-6" style={{ background: 'var(--dark2)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs tracking-widest uppercase mb-3" style={{ color: 'var(--gold)' }}>✦ How It Works</p>
            <h2 className="font-display text-5xl font-light text-cream">Four steps to your<br /><em className="italic" style={{ color: 'var(--gold-light)' }}>perfect trip</em></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((s, i) => (
              <div key={i} className="text-center">
                <div className="font-display text-6xl font-light mb-4" style={{ color: 'rgba(201,168,76,0.25)' }}>{s.n}</div>
                <div className="w-px h-12 mx-auto mb-4" style={{ background: 'var(--gold)', opacity: 0.3 }} />
                <h3 className="font-display text-xl font-light text-cream mb-2">{s.title}</h3>
                <p className="text-sm text-cream/45 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <button onClick={user ? () => navigate('/plan') : onRegisterClick}
              className="px-12 py-4 rounded-sm text-xs tracking-widest uppercase font-medium transition-all duration-300"
              style={{ background: 'var(--gold)', color: 'var(--dark)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--gold-light)'; e.currentTarget.style.boxShadow = '0 20px 50px rgba(201,168,76,0.35)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--gold)'; e.currentTarget.style.boxShadow = 'none' }}>
              {user ? 'Plan My Trip →' : 'Get Started Free →'}
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-10 px-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-display text-xl font-light tracking-widest">
            Itinera<span style={{ color: 'var(--gold)' }}>AI</span>
          </span>
          <p className="text-xs text-cream/25 tracking-wider">
            © 2025 ItineraAI · Built with React + FastAPI + Groq LLaMA 3.3
          </p>
          <div className="flex gap-6 text-xs text-cream/25">
            <a href="#" className="hover:text-gold transition-colors">Privacy</a>
            <a href="#" className="hover:text-gold transition-colors">Terms</a>
            <a href="#" className="hover:text-gold transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
