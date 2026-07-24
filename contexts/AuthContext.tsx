'use client'
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  ReactNode
} from 'react'
import api from '@/lib/api'
import { User } from '@/types'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

interface RegisterData {
  full_name: string
  email: string
  password: string
  phone?: string
  country?: string
  referral_code?: string
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const isMounted = useRef(true)

  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  const clearAuthData = useCallback(() => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    delete api.defaults.headers.common['Authorization']
    if (isMounted.current) {
      setUser(null)
    }
  }, [])

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('access_token')

    if (!token) {
      if (isMounted.current) {
        setUser(null)
        setIsLoading(false)
      }
      return
    }

    try {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      const res = await api.get('/api/auth/me')
      if (isMounted.current) {
        setUser(res.data)
      }
    } catch (error: any) {
      if (error?.response?.status === 401) {
        clearAuthData()
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false)
      }
    }
  }, [clearAuthData])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const login = useCallback(async (email: string, password: string) => {
    clearAuthData()

    const res = await api.post('/api/auth/login', {
      email,
      password
    })

    const { access_token, refresh_token } = res.data

    localStorage.setItem('access_token', access_token)
    localStorage.setItem('refresh_token', refresh_token)
    api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`

    const userRes = await api.get('/api/auth/me')
    const userData = userRes.data

    if (isMounted.current) {
      setUser(userData)
    }

    if (userData.role === 'super_admin' || userData.role === 'admin') {
      window.location.href = '/admin'
    } else {
      window.location.href = '/dashboard'
    }
  }, [clearAuthData])

  const register = useCallback(async (data: RegisterData) => {
    clearAuthData()

    const res = await api.post('/api/auth/register', data)
    const { access_token, refresh_token } = res.data

    localStorage.setItem('access_token', access_token)
    localStorage.setItem('refresh_token', refresh_token)
    api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`

    const userRes = await api.get('/api/auth/me')
    if (isMounted.current) {
      setUser(userRes.data)
    }

    window.location.href = '/dashboard'
  }, [clearAuthData])

  const logout = useCallback(() => {
    const refreshToken = localStorage.getItem('refresh_token')
    if (refreshToken) {
      api.post('/api/auth/logout', {
        refresh_token: refreshToken
      }).catch(() => {})
    }

    clearAuthData()
    window.location.href = '/auth/login'
  }, [clearAuthData])

  const refreshUser = useCallback(async () => {
    await fetchUser()
  }, [fetchUser])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
