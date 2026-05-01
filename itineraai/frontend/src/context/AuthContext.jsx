import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)
const API = 'http://localhost:8000'

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('itinera_token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      axios.get(`${API}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
        .then(r => setUser(r.data))
        .catch(() => { setToken(null); localStorage.removeItem('itinera_token') })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [token])

  const login = async (email, password) => {
    const form = new URLSearchParams({ username: email, password })
    const r = await axios.post(`${API}/auth/login`, form)
    const t = r.data.access_token
    localStorage.setItem('itinera_token', t)
    setToken(t)
    const me = await axios.get(`${API}/auth/me`, { headers: { Authorization: `Bearer ${t}` } })
    setUser(me.data)
    return me.data
  }

  const register = async (name, email, password) => {
    const r = await axios.post(`${API}/auth/register`, { name, email, password })
    const t = r.data.access_token
    localStorage.setItem('itinera_token', t)
    setToken(t)
    const me = await axios.get(`${API}/auth/me`, { headers: { Authorization: `Bearer ${t}` } })
    setUser(me.data)
    return me.data
  }

  const logout = () => {
    setUser(null); setToken(null)
    localStorage.removeItem('itinera_token')
  }

  const authHeader = () => ({ Authorization: `Bearer ${token}` })

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, authHeader }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
