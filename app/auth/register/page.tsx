'use client'
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'

const COUNTRIES = [
  'Rwanda', 'Liberia', 'Uganda', 'Kenya',
  'Tanzania', 'Ghana', 'Nigeria', 'Cameroon',
  'Ivory Coast', 'Senegal', 'Zambia',
  'Mozambique', 'Sierra Leone', 'South Africa',
  'United States', 'United Kingdom', 'Other'
]

function RegisterForm() {
  const searchParams = useSearchParams()
  const { register, isAuthenticated, isLoading, user } = useAuth()
  const { showToast } = useToast()

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    confirm_password: '',
    phone: '',
    country: '',
    referral_code: '',
  })
  const [showPass, setShowPass] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const ref = searchParams.get('ref')
    if (ref) {
      setForm(prev => ({ ...prev, referral_code: ref }))
    }
  }, [searchParams])

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      if (user.role === 'admin' || user.role === 'super_admin') {
        window.location.href = '/admin'
      } else {
        window.location.href = '/dashboard'
      }
    }
  }, [isAuthenticated, isLoading, user])

  const update = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (form.password !== form.confirm_password) {
      showToast('Passwords do not match', 'error')
      return
    }
    if (form.password.length < 8) {
      showToast('Password must be at least 8 characters', 'error')
      return
    }
    if (!agreed) {
      showToast('Please accept the terms of service', 'error')
      return
    }

    setLoading(true)
    try {
      await register({
        full_name: form.full_name,
        email: form.email,
        password: form.password,
        phone: form.phone || undefined,
        country: form.country || undefined,
        referral_code: form.referral_code || undefined,
      })
    } catch (err: any) {
      const message =
        err?.response?.data?.detail ||
        err?.message ||
        'Registration failed. Please try again.'
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
    <div className="min-h-screen flex items-center justify-center p-4 py-12" style={{ background: '#0B0B1A' }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full opacity-5 blur-3xl" style={{ background: '#7C3AED' }} />
      </div>

      <div className="w-full max-w-lg relative">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <Image src="/logo.png" alt="BOASTLIB" width={42} height={42} className="rounded-xl" />
            <span className="font-black text-white text-xl">BOASTLIB</span>
          </Link>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-black text-white">Create Account</h1>
              <p className="text-[#9CA3AF] text-sm mt-1">Join thousands of creators boosting their socials</p>
            </div>
            <div className="hidden sm:block text-right">
              <div className="text-2xl font-black gradient-text">Free</div>
              <div className="text-[#6B7280] text-xs">No card needed</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#9CA3AF] mb-1.5">Full Name *</label>
                <input type="text" required value={form.full_name} onChange={e => update('full_name', e.target.value)} className="input" placeholder="Your full name" disabled={loading} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#9CA3AF] mb-1.5">Email Address *</label>
                <input type="email" required value={form.email} onChange={e => update('email', e.target.value)} className="input" placeholder="you@example.com" autoComplete="email" disabled={loading} />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#9CA3AF] mb-1.5">Phone Number</label>
                <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} className="input" placeholder="+250 7XX XXX XXX" disabled={loading} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#9CA3AF] mb-1.5">Country</label>
                <select value={form.country} onChange={e => update('country', e.target.value)} className="input" style={{ appearance: 'none' }} disabled={loading}>
                  <option value="">Select country</option>
                  {COUNTRIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#9CA3AF] mb-1.5">Password *</label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} required value={form.password} onChange={e => update('password', e.target.value)} className="input pr-12" placeholder="Min. 8 characters" autoComplete="new-password" disabled={loading} />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] text-sm">
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#9CA3AF] mb-1.5">Confirm Password *</label>
                <input type="password" required value={form.confirm_password} onChange={e => update('confirm_password', e.target.value)} className="input" placeholder="Repeat password" autoComplete="new-password" disabled={loading} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] mb-1.5">🎁 Referral Code (optional)</label>
              <input type="text" value={form.referral_code} onChange={e => update('referral_code', e.target.value.toUpperCase())} className="input" placeholder="Enter referral code" disabled={loading} />
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <div className={`w-5 h-5 rounded-md border flex-shrink-0 flex items-center justify-center mt-0.5 transition-colors ${agreed ? 'bg-[#3B82F6] border-[#3B82F6]' : 'border-[#2D2D50] hover:border-[#3B82F6]'}`} onClick={() => setAgreed(!agreed)}>
                {agreed && <span className="text-white text-xs font-bold">✓</span>}
              </div>
              <span className="text-[#9CA3AF] text-sm leading-relaxed">
                I agree to the{' '}
                <Link href="/terms" target="_blank" className="text-[#3B82F6] hover:underline">Terms of Service</Link>{' '}
                and{' '}
                <Link href="/privacy" target="_blank" className="text-[#3B82F6] hover:underline">Privacy Policy</Link>
              </span>
            </label>

            <button type="submit" disabled={loading || !agreed} className="btn-primary w-full py-3.5 text-base">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                "Create Account — It's Free"
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-[#6B7280]">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-[#3B82F6] font-semibold hover:underline">Login</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0B0B1A' }}>
        <div className="w-10 h-10 rounded-xl animate-pulse" style={{ background: 'linear-gradient(135deg, #3B82F6, #7C3AED)' }} />
      </div>
    }>
      <RegisterForm />
    </Suspense>
  )
}
