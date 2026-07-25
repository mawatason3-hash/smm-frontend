'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login, isAuthenticated, isLoading, user } = useAuth()
  const { showToast } = useToast()

  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        window.location.reload()
      }
    }

    window.addEventListener('pageshow', handlePageShow)
    return () => window.removeEventListener('pageshow', handlePageShow)
  }, [])

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      if (user.role === 'super_admin' || user.role === 'admin') {
        window.location.href = '/admin'
      } else {
        window.location.href = '/dashboard'
      }
    }
  }, [isAuthenticated, isLoading, user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      showToast('Please fill in all fields', 'error')
      return
    }

    setLoading(true)
    try {
      await login(email, password)
    } catch (err: any) {
      const message =
        err?.response?.data?.detail ||
        err?.message ||
        'Invalid email or password'
      showToast(message, 'error')
      setLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0B0B1A' }}>
        <div className="w-10 h-10 rounded-xl animate-pulse" style={{ background: 'linear-gradient(135deg, #3B82F6, #7C3AED)' }} />
      </div>
    )
  }

  if (isAuthenticated) return null

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#0B0B1A' }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-5 blur-3xl" style={{ background: '#3B82F6' }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-5 blur-3xl" style={{ background: '#7C3AED' }} />
      </div>

      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <Image src="/logo.png" alt="BOASTLIB" width={42} height={42} className="rounded-xl" />
            <span className="font-black text-white text-xl">BOASTLIB</span>
          </Link>
          <p className="text-[#6B7280] text-sm mt-2">SMM Panel — Cheapest prices, fastest delivery</p>
        </div>

        <div className="card">
          <h1 className="text-2xl font-black text-white mb-1">Welcome back</h1>
          <p className="text-[#9CA3AF] text-sm mb-8">Login to your BOASTLIB account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] mb-1.5">Email Address</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="input" placeholder="you@example.com" autoComplete="email" disabled={loading} />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-[#9CA3AF]">Password</label>
                <Link href="/auth/forgot-password" className="text-xs text-[#3B82F6] hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)} className="input pr-12" placeholder="••••••••" autoComplete="current-password" disabled={loading} />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-white text-sm">
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Logging in...
                </span>
              ) : (
                'Login'
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-[#6B7280]">
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="text-[#3B82F6] font-semibold hover:underline">Create account</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
