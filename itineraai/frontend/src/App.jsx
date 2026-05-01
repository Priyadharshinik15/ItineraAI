import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import LandingPage  from './pages/LandingPage'
import LoginPage    from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import InputPage    from './pages/InputPage'
import ReportPage   from './pages/ReportPage'
import ProfilePage  from './pages/ProfilePage'

function Protected({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="text-gold text-2xl font-display">Loading…</div></div>
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/"        element={<LandingPage />} />
        <Route path="/login"   element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/plan"    element={<Protected><InputPage /></Protected>} />
        <Route path="/report"  element={<Protected><ReportPage /></Protected>} />
        <Route path="/profile" element={<Protected><ProfilePage /></Protected>} />
        <Route path="*"        element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
