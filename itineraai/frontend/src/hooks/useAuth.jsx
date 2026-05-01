import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('itinera_token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      axios.get('/api/me', { headers: { Authorization: `Bearer ${token}` } })
        .then(r => setUser(r.data.user))
        .catch(() => { localStorage.removeItem('itinera_token'); setToken(null) })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [token])

  const login = async (email, password) => {
    const r = await axios.post('/api/login', { email, password })
    localStorage.setItem('itinera_token', r.data.token)
    setToken(r.data.token)
    setUser(r.data.user)
    return r.data
  }

  const register = async (name, email, password) => {
    const r = await axios.post('/api/register', { name, email, password })
    localStorage.setItem('itinera_token', r.data.token)
    setToken(r.data.token)
    setUser(r.data.user)
    return r.data
  }

  const logout = async () => {
    try {
      await axios.post('/api/logout', {}, { headers: { Authorization: `Bearer ${token}` } })
    } catch (_) {}
    localStorage.removeItem('itinera_token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
