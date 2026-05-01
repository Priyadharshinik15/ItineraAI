import { useState, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Download, ArrowLeft, Building2, Map, CalendarDays, Share2, ChevronRight } from 'lucide-react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const TABS = [
  { id: 'city', label: 'City Report', icon: <Building2 size={15} />, key: 'city_report' },
  { id: 'guide', label: 'Guide Report', icon: <Map size={15} />, key: 'guide_report' },
  { id: 'plan', label: 'Travel Plan', icon: <CalendarDays size={15} />, key: 'travel_plan' },
]

export default function ResultsPage() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('city')
  const [downloading, setDownloading] = useState(false)
  const contentRef = useRef(null)

  if (!state?.report) {
    navigate('/plan')
    return null
  }

  const { report } = state
  const images = report.images || []

  const downloadPDF = async (tabId) => {
    setDownloading(true)
    try {
      const el = contentRef.current
      const canvas = await html2canvas(el, { scale: 1.5, backgroundColor: '#0A0A0A', useCORS: true })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const w = pdf.internal.pageSize.getWidth()
      const h = (canvas.height * w) / canvas.width
      let yPos = 0
      const pageH = pdf.internal.pageSize.getHeight()
      while (yPos < h) {
        if (yPos > 0) pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, -yPos, w, h)
        yPos += pageH
      }
      const filename = `ItineraAI_${report.destination}_${TABS.find(t => t.id === tabId)?.label.replace(' ', '_')}.pdf`
      pdf.save(filename)
    } catch (e) {
      console.error(e)
    } finally {
      setDownloading(false)
    }
  }

  const downloadMD = (tabId) => {
    const tab = TABS.find(t => t.id === tabId)
    const content = report[tab.key] || report.full_report
    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ItineraAI_${report.destination}_${tab.label.replace(' ', '_')}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  const activeTabData = TABS.find(t => t.id === activeTab)
  const activeContent = report[activeTabData.key] || report.full_report

  return (
    <div className="min-h-screen pt-20" style={{ background: 'var(--dark)' }}>

      {/* Hero with images */}
      <div className="relative h-72 overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-3 gap-1">
          {[0, 1, 2].map(i => (
            <div key={i} className="relative overflow-hidden" style={{ height: '100%' }}>
              {images[i] ? (
                <img src={images[i]} alt={report.destination}
                  className="w-full h-full object-cover"
                  style={{ filter: 'brightness(0.6) saturate(0.8)' }} />
              ) : (
                <div className="w-full h-full skeleton" />
              )}
            </div>
          ))}
        </div>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 30%, rgba(10,10,10,0.95) 100%)' }} />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 px-6 text-center">
          <p className="text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--gold)' }}>✦ Your Travel Report</p>
          <h1 className="font-display text-5xl font-light text-cream">
            {report.destination}
          </h1>
        </div>
      </div>

      {/* Image gallery row */}
      {images.length > 3 && (
        <div className="flex gap-2 px-6 py-3 overflow-x-auto max-w-7xl mx-auto">
          {images.slice(3).map((img, i) => (
            <img key={i} src={img} alt={`${report.destination} ${i + 4}`}
              className="h-20 w-32 object-cover rounded-sm flex-shrink-0"
              style={{ filter: 'brightness(0.75)' }} />
          ))}
        </div>
      )}

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Back + actions */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate('/plan')}
            className="flex items-center gap-2 text-sm text-cream/40 hover:text-gold transition-colors">
            <ArrowLeft size={15} /> New Trip
          </button>
          <div className="flex gap-3">
            <button onClick={() => downloadMD(activeTab)}
              className="flex items-center gap-2 px-4 py-2 rounded-sm text-xs tracking-wider uppercase transition-all"
              style={{ border: '1px solid rgba(201,168,76,0.3)', color: 'var(--gold)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,168,76,0.08)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <Download size={13} /> MD
            </button>
            <button onClick={() => downloadPDF(activeTab)} disabled={downloading}
              className="flex items-center gap-2 px-4 py-2 rounded-sm text-xs tracking-wider uppercase font-medium transition-all"
              style={{ background: downloading ? 'rgba(201,168,76,0.5)' : 'var(--gold)', color: 'var(--dark)' }}>
              <Download size={13} /> {downloading ? 'Exporting...' : 'PDF'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 rounded-sm overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className="flex-1 flex items-center justify-center gap-2 py-4 text-xs tracking-widest uppercase transition-all duration-300"
              style={activeTab === t.id
                ? { background: 'var(--gold)', color: 'var(--dark)', fontWeight: 500 }
                : { color: 'rgba(245,237,214,0.4)', background: 'rgba(255,255,255,0.02)' }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div ref={contentRef} className="rounded-lg p-8 md:p-10"
          style={{ background: 'var(--dark3)', border: '1px solid rgba(201,168,76,0.1)', minHeight: '60vh' }}>
          <div className="markdown-body">
            <ReactMarkdown remarkPlugins={[remarkGfm]}
              components={{
                a: ({ href, children }) => (
                  <a href={href} target="_blank" rel="noreferrer"
                    className="transition-colors" style={{ color: 'var(--gold)' }}>
                    {children} <ChevronRight size={10} className="inline" />
                  </a>
                )
              }}>
              {activeContent || '*No content generated for this section.*'}
            </ReactMarkdown>
          </div>
        </div>

        {/* Download all 3 */}
        <div className="mt-8 p-6 rounded-lg" style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)' }}>
          <p className="text-xs tracking-widest uppercase text-cream/40 mb-4">⬇ Download All Reports</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {TABS.map(t => (
              <button key={t.id} onClick={() => downloadMD(t.id)}
                className="flex items-center justify-between px-4 py-3 rounded-sm text-sm transition-all"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)'; e.currentTarget.style.color = 'var(--gold)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '' }}>
                <span className="flex items-center gap-2">{t.icon} {t.label}</span>
                <Download size={13} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
