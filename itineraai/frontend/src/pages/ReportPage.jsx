import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

const API = 'http://localhost:8000'

const TABS = [
  { key: 'city_report',  icon: '📋', label: 'City Report',   color: '#C9A84C' },
  { key: 'guide_report', icon: '🗺️', label: 'Guide Report',  color: '#7dd3b8' },
  { key: 'travel_plan',  icon: '📅', label: 'Travel Plan',   color: '#a78bfa' },
]

export default function ReportPage() {
  const { authHeader } = useAuth()
  const navigate = useNavigate()
  const [data, setData]     = useState(null)
  const [active, setActive] = useState('city_report')
  const [dlLoading, setDlLoading] = useState(false)

  useEffect(() => {
    const stored = sessionStorage.getItem('itinera_report')
    if (!stored) { navigate('/plan'); return }
    setData(JSON.parse(stored))
  }, [])

  if (!data) return null

  const downloadPDF = async () => {
    if (!data.id) { alert('Save feature requires backend. Download MD instead.'); return }
    setDlLoading(true)
    try {
      const r = await axios.get(`${API}/travel/pdf/${data.id}`, {
        headers: authHeader(), responseType: 'blob'
      })
      const url = URL.createObjectURL(r.data)
      const a = document.createElement('a')
      a.href = url; a.download = `ItineraAI_Report.pdf`; a.click()
      URL.revokeObjectURL(url)
    } catch { alert('PDF download failed.') }
    finally { setDlLoading(false) }
  }

  const downloadMD = (key, label) => {
    const content = data[key]
    const blob = new Blob([content], { type: 'text/markdown' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `ItineraAI_${label.replace(' ', '_')}.md`
    a.click()
  }

  const currentTab = TABS.find(t => t.key === active)

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', paddingTop: 64 }}>

      {/* Images strip */}
      {data.images?.length > 0 && (
        <div style={{ display: 'flex', height: 220, overflow: 'hidden', gap: 2 }}>
          {data.images.slice(0, 5).map((img, i) => (
            <div key={i} style={{
              flex: i === 0 ? 2 : 1, backgroundImage: `url(${img})`,
              backgroundSize: 'cover', backgroundPosition: 'center',
              filter: 'brightness(0.82)',
              transition: 'flex 0.5s ease',
            }}
              onMouseOver={e => e.currentTarget.style.flex = '2.5'}
              onMouseOut={e => e.currentTarget.style.flex = i === 0 ? '2' : '1'}
            />
          ))}
        </div>
      )}

      {/* Header */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
          <div>
            <div style={{ fontSize: '0.68rem', letterSpacing: '5px', textTransform: 'uppercase', color: '#C9A84C', marginBottom: 8 }}>✦ Your Travel Report</div>
            <h1 style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 300, color: '#F5EDD6' }}>
              AI Report Ready ✓
            </h1>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/plan')} style={outlineBtn}>+ New Trip</button>
            <button onClick={downloadPDF} disabled={dlLoading} style={goldBtn}>
              {dlLoading ? 'Preparing…' : '⬇️ Download PDF'}
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: 0 }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setActive(t.key)} style={{
              padding: '14px 28px', border: 'none', background: 'none',
              cursor: 'pointer', fontSize: '0.85rem',
              color: active === t.key ? t.color : 'rgba(245,237,214,0.4)',
              borderBottom: active === t.key ? `2px solid ${t.color}` : '2px solid transparent',
              transition: 'all 0.3s', letterSpacing: '0.5px', fontWeight: active === t.key ? 500 : 400,
            }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Report content */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
          borderTop: 'none', borderRadius: '0 0 8px 8px', padding: '40px',
          minHeight: 400,
        }}>

          {/* Tab actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, paddingBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: '1.2rem' }}>{currentTab.icon}</span>
              <span style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '1.3rem', color: currentTab.color }}>
                {currentTab.label}
              </span>
            </div>
            <button onClick={() => downloadMD(active, currentTab.label)}
              style={{ ...outlineBtn, fontSize: '0.75rem', padding: '8px 16px', color: currentTab.color, borderColor: `${currentTab.color}40` }}>
              ⬇️ Download .md
            </button>
          </div>

          {/* Markdown render */}
          <div className="report-content">
            <ReactMarkdown
              components={{
                a: ({ href, children }) => (
                  <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: '#C9A84C' }}>{children}</a>
                ),
                img: ({ src, alt }) => (
                  <img src={src} alt={alt} style={{ maxWidth: '100%', borderRadius: 6, margin: '12px 0' }} onError={e => e.target.style.display = 'none'} />
                ),
              }}
            >
              {data[active] || ''}
            </ReactMarkdown>
          </div>
        </div>

        {/* Bottom download all */}
        <div style={{ marginTop: 32, padding: 28, background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '1.2rem', color: '#F5EDD6' }}>Download All Reports</div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(245,237,214,0.45)', marginTop: 4 }}>Get all 3 reports as Markdown files</div>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {TABS.map(t => (
              <button key={t.key} onClick={() => downloadMD(t.key, t.label)}
                style={{ padding: '10px 20px', background: 'transparent', border: `1px solid ${t.color}40`, borderRadius: 4, color: t.color, fontSize: '0.78rem', cursor: 'pointer', letterSpacing: '1px' }}>
                {t.icon} {t.label}
              </button>
            ))}
            <button onClick={downloadPDF} style={{ ...goldBtn, fontSize: '0.78rem', padding: '10px 20px' }}>
              📄 Full PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const goldBtn = {
  padding: '12px 24px', background: '#C9A84C', border: 'none', borderRadius: 4,
  color: '#0A0A0A', fontSize: '0.82rem', letterSpacing: '1px',
  fontWeight: 500, cursor: 'pointer', transition: 'all 0.3s',
}
const outlineBtn = {
  padding: '12px 24px', background: 'transparent',
  border: '1px solid rgba(255,255,255,0.18)', borderRadius: 4,
  color: 'rgba(245,237,214,0.7)', fontSize: '0.82rem',
  cursor: 'pointer', transition: 'all 0.3s',
}
