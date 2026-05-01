import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])
  useEffect(() => { setMenuOpen(false); setProfileOpen(false) }, [location])

  const isLanding = location.pathname === '/'

  return (
    <nav style={{
      position:'fixed',top:0,left:0,right:0,zIndex:50,
      transition:'all 0.4s ease',
      background: scrolled || !isLanding ? 'rgba(10,10,10,0.96)' : 'linear-gradient(to bottom,rgba(0,0,0,0.7),transparent)',
      backdropFilter: scrolled || !isLanding ? 'blur(12px)' : 'none',
      borderBottom: scrolled || !isLanding ? '1px solid rgba(201,168,76,0.12)' : 'none',
      padding: scrolled ? '12px 0' : '20px 0',
    }}>
      <div style={{maxWidth:1280,margin:'0 auto',padding:'0 24px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>

        {/* Logo */}
        <Link to="/" style={{textDecoration:'none',display:'flex',alignItems:'center',gap:8}}>
          <span style={{fontSize:'1.3rem'}}>✈️</span>
          <span style={{fontFamily:'"Cormorant Garamond",serif',fontSize:'1.6rem',fontWeight:300,letterSpacing:'3px',color:'#F5EDD6'}}>
            Itinera<span style={{color:'#C9A84C'}}>AI</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div style={{display:'flex',alignItems:'center',gap:8}} className="hidden-mobile">
          <a href="#about" style={linkStyle}>About</a>
          <a href="#how"   style={linkStyle}>How It Works</a>

          {user ? (
            <>
              <Link to="/plan" style={btnGold}>✦ Plan Trip</Link>
              <div style={{position:'relative'}}>
                <button onClick={() => setProfileOpen(!profileOpen)} style={btnGhost}>
                  👤 {user.name?.split(' ')[0]} ▾
                </button>
                {profileOpen && (
                  <div style={{position:'absolute',right:0,top:'100%',marginTop:8,width:180,background:'#141414',border:'1px solid rgba(201,168,76,0.2)',borderRadius:6,overflow:'hidden',boxShadow:'0 20px 60px rgba(0,0,0,0.6)'}}>
                    <Link to="/profile" style={dropItem}>⚙️ Profile Settings</Link>
                    <button onClick={() => { logout(); navigate('/') }} style={{...dropItem,color:'#f87171',width:'100%',textAlign:'left'}}>
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login"    style={btnGhost}>Login</Link>
              <Link to="/register" style={btnGold}>Register</Link>
            </>
          )}
        </div>
      </div>

      <style>{`
        .hidden-mobile { display:flex!important; }
        @media(max-width:768px){ .hidden-mobile{ display:none!important; } }
        a { text-decoration:none; }
      `}</style>
    </nav>
  )
}

const linkStyle = {
  fontSize:'0.72rem',letterSpacing:'2px',textTransform:'uppercase',
  color:'rgba(245,237,214,0.55)',padding:'8px 14px',
  transition:'color 0.2s',cursor:'pointer',textDecoration:'none',
  ':hover':{color:'#C9A84C'}
}
const btnGhost = {
  fontSize:'0.72rem',letterSpacing:'2px',textTransform:'uppercase',
  color:'rgba(245,237,214,0.7)',padding:'9px 20px',
  border:'1px solid rgba(255,255,255,0.18)',borderRadius:2,
  background:'transparent',cursor:'pointer',transition:'all 0.3s',
  textDecoration:'none', display:'inline-block',
}
const btnGold = {
  fontSize:'0.72rem',letterSpacing:'2px',textTransform:'uppercase',
  color:'#0A0A0A',padding:'9px 20px',
  background:'#C9A84C',border:'1px solid #C9A84C',borderRadius:2,
  cursor:'pointer',transition:'all 0.3s',fontWeight:500,
  textDecoration:'none', display:'inline-block',
}
const dropItem = {
  display:'block',padding:'12px 16px',fontSize:'0.82rem',
  color:'rgba(245,237,214,0.7)',cursor:'pointer',
  transition:'all 0.2s',background:'transparent',border:'none',
  textDecoration:'none',
}
