'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import api from '@/lib/api'
import { useToast } from '@/contexts/ToastContext'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('') 
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const { showToast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/api/auth/forgot-password', { email })
      setSent(true)
      showToast('Reset link sent! Check your email.', 'success')
    } catch (err: any) {
      showToast(err?.response?.data?.detail || 'Failed to send reset email', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#0B0B1A' }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-5 blur-3xl" style={{ background: '#3B82F6' }} />
      </div>

      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <Image src="/logo.png" alt="BOASTLIB" width={40} height={40} className="rounded-xl" />
            <span className="font-black text-white text-xl">BOASTLIB</span>
          </Link>
        </div>

        <div className="card">
          {!sent ? (
            <>
              <h1 className="text-2xl font-black text-white mb-1">Forgot Password</h1>
              <p className="text-[#9CA3AF] text-sm mb-8">
                Enter your email and we will send you a reset link.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#9CA3AF] mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input"
                    placeholder="you@example.com"
                  />
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base">
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="text-5xl mb-4">📧</div>
              <h2 className="text-xl font-black text-white mb-2">Check Your Email</h2>
              <p className="text-[#9CA3AF] text-sm mb-6">
                If <strong className="text-white">{email}</strong> is registered, you will receive a reset link shortly.
              </p>
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm mb-6">
                Check your spam folder if you don&apos;t see it.
              </div>
            </div>
          )}

          <div className="mt-6 text-center text-sm text-[#6B7280]">
            Remember your password?{' '}
            <Link href="/auth/login" className="text-[#3B82F6] font-semibold hover:underline">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
