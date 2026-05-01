import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

const API = 'http://localhost:8000'

export default function ProfilePage() {
  const { user, logout, authHeader } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState(user?.name || '')
  const [saved, setSaved] = useState(false)
  const [history, setHistory] = useState([])

  useEffect(() => {
    axios.get(`${API}/travel/history`, { headers: authHeader() })
      .then(r => setHistory(r.data)).catch(() => {})
  }, [])

  const saveProfile = async () => {
    await axios.put(`${API}/auth/profile?name=${encodeURIComponent(name)}`, {}, { headers: authHeader() })
    setSaved(true); setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div style={{ minHeight:'100vh', background:'#0A0A0A', paddingTop:64 }}>
      <div style={{ height:200, background:'linear-gradient(135deg,rgba(201,168,76,0.15),rgba(10,10,10,0.8))', borderBottom:'1px solid rgba(201,168,76,0.15)', display:'flex', alignItems:'flex-end', padding:'0 48px 32px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:20 }}>
          <div style={{ width:64, height:64, borderRadius:'50%', background:'linear-gradient(135deg,#C9A84C,#E8C96A)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.6rem', color:'#0A0A0A', fontFamily:'"Cormorant Garamond",serif' }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontFamily:'"Cormorant Garamond",serif', fontSize:'1.8rem', fontWeight:300, color:'#F5EDD6' }}>{user?.name}</div>
            <div style={{ fontSize:'0.8rem', color:'rgba(245,237,214,0.45)', marginTop:4 }}>{user?.email}</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:900, margin:'0 auto', padding:'48px 24px 80px', display:'grid', gridTemplateColumns:'1fr 1.4fr', gap:32 }}>
        <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:8, padding:28 }}>
          <div style={{ fontFamily:'"Cormorant Garamond",serif', fontSize:'1.3rem', color:'#C9A84C', marginBottom:24, paddingBottom:12, borderBottom:'1px solid rgba(255,255,255,0.06)' }}>⚙️ Profile Settings</div>
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:'0.68rem', letterSpacing:'2px', textTransform:'uppercase', color:'rgba(245,237,214,0.38)', marginBottom:8 }}>Display Name</div>
            <input value={name} onChange={e => setName(e.target.value)} style={{ width:'100%', padding:'12px 14px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:4, color:'#F5EDD6', fontSize:'0.9rem', outline:'none' }} />
          </div>
          <div style={{ marginBottom:24 }}>
            <div style={{ fontSize:'0.68rem', letterSpacing:'2px', textTransform:'uppercase', color:'rgba(245,237,214,0.38)', marginBottom:8 }}>Email Address</div>
            <input value={user?.email||''} disabled style={{ width:'100%', padding:'12px 14px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:4, color:'#F5EDD6', fontSize:'0.9rem', outline:'none', opacity:0.4 }} />
          </div>
          <button onClick={saveProfile} style={{ width:'100%', padding:13, background:'#C9A84C', border:'none', borderRadius:4, color:'#0A0A0A', fontSize:'0.82rem', fontWeight:500, cursor:'pointer' }}>
            {saved ? '✓ Saved!' : 'Save Changes'}
          </button>
          <div style={{ marginTop:20, paddingTop:20, borderTop:'1px solid rgba(255,255,255,0.06)' }}>
            <button onClick={() => { logout(); navigate('/') }} style={{ width:'100%', padding:13, background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:4, color:'#fca5a5', fontSize:'0.82rem', cursor:'pointer' }}>
              🚪 Logout
            </button>
          </div>
        </div>

        <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:8, padding:28 }}>
          <div style={{ fontFamily:'"Cormorant Garamond",serif', fontSize:'1.3rem', color:'#C9A84C', marginBottom:24, paddingBottom:12, borderBottom:'1px solid rgba(255,255,255,0.06)' }}>📜 Trip History</div>
          {history.length===0 ? (
            <div style={{ textAlign:'center', padding:'40px 0', color:'rgba(245,237,214,0.35)' }}>
              <div style={{ fontSize:'2rem', marginBottom:12 }}>✈️</div>
              <div>No trips yet. <a href="/plan" style={{ color:'#C9A84C' }}>Plan your first trip</a></div>
            </div>
          ) : history.map(t => (
            <div key={t.id} style={{ padding:'14px 16px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:6, marginBottom:10, cursor:'pointer' }}>
              <div style={{ fontFamily:'"Cormorant Garamond",serif', fontSize:'1.1rem', color:'#F5EDD6' }}>📍 {t.destination}</div>
              <div style={{ fontSize:'0.75rem', color:'rgba(245,237,214,0.4)', marginTop:4 }}>{t.date_from} → {t.date_to}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
