import { createContext, useContext, useEffect, useState } from 'react'
import api from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      api.get('/auth/me')
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('token')
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const sendOtp = async (phone) => {
    const res = await api.post('/auth/send-otp', { phone })
    return res.data
  }

  const verifyOtp = async (phone, otp, fullName) => {
    const payload = { phone, otp }
    if (fullName) payload.full_name = fullName
    const res = await api.post('/auth/verify-otp', payload)
    localStorage.setItem('token', res.data.access_token)
    setUser(res.data.user)
    return res.data
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  const updateProfile = async (data) => {
    const res = await api.put('/auth/me', data)
    setUser(res.data)
    return res.data
  }

  return (
    <AuthContext.Provider value={{ user, loading, sendOtp, verifyOtp, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
