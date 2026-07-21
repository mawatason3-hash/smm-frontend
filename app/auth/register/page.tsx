'use client'
import { Suspense, useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'

const COUNTRIES = ['Rwanda', 'Liberia', 'Uganda', 'Kenya', 'Tanzania', 'Ghana', 'Nigeria', 'Cameroon', 'Ivory Coast', 'Senegal', 'Zambia', 'Mozambique', 'South Africa', 'United States', 'United Kingdom', 'Other']

function RegisterForm() {
  const [form, setForm] = useState({ full_name: '', email: '', password: '', confirm_password: '', phone: '', country: '', referral_code: '' })
  const [showPass, setShowPass] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const { showToast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const ref = searchParams.get('ref')
    if (ref) setForm(prev => ({ ...prev, referral_code: ref }))
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirm_password) { showToast('Passwords do not match', 'error'); return }
    if (!agreed) { showToast('Please accept the terms', 'error'); return }
    setLoading(true)
    try {
      await register({ full_name: form.full_name, email: form.email, password: form.password, phone: form.phone || undefined, country: form.country || undefined, referral_code: form.referral_code || undefined })
      showToast('🎉 Account created! Welcome to BOASTLIB!', 'success')
      router.push('/dashboard')
    } catch (err: any) {
      showToast(err?.response?.data?.detail || 'Registration failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }))

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12" style={{ background: '#0B0B1A' }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full opacity-5 blur-3xl" style={{ background: '#7C3AED' }} />
      </div>

      <div className="w-full max-w-lg relative">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black" style={{ background: 'linear-gradient(135deg, #3B82F6, #7C3AED)' }}>B</div>
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
                <input type="text" required value={form.full_name} onChange={e => update('full_name', e.target.value)} className="input" placeholder="Solomon Kamara" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#9CA3AF] mb-1.5">Email Address *</label>
                <input type="email" required value={form.email} onChange={e => update('email', e.target.value)} className="input" placeholder="you@example.com" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#9CA3AF] mb-1.5">Phone Number</label>
                <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} className="input" placeholder="+250 7XX XXX XXX" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#9CA3AF] mb-1.5">Country</label>
                <select value={form.country} onChange={e => update('country', e.target.value)} className="input" style={{ appearance: 'none' }}>
                  <option value="">Select country</option>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#9CA3AF] mb-1.5">Password *</label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} required value={form.password} onChange={e => update('password', e.target.value)} className="input pr-12" placeholder="Min. 8 characters" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] text-sm">
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#9CA3AF] mb-1.5">Confirm Password *</label>
                <input type="password" required value={form.confirm_password} onChange={e => update('confirm_password', e.target.value)} className="input" placeholder="Repeat password" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] mb-1.5">🎁 Referral Code (optional)</label>
              <input type="text" value={form.referral_code} onChange={e => update('referral_code', e.target.value.toUpperCase())} className="input" placeholder="Enter referral code" />
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <div className={`w-5 h-5 rounded-md border flex-shrink-0 flex items-center justify-center mt-0.5 transition-colors ${agreed ? 'bg-[#3B82F6] border-[#3B82F6]' : 'border-[#2D2D50]'}`}
                onClick={() => setAgreed(!agreed)}>
                {agreed && <span className="text-white text-xs">✓</span>}
              </div>
              <span className="text-[#9CA3AF] text-sm leading-relaxed">
                I agree to the <Link href="/terms" className="text-[#3B82F6] hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-[#3B82F6] hover:underline">Privacy Policy</Link>
              </span>
            </label>

            <button type="submit" disabled={loading || !agreed} className="btn-primary w-full py-3.5 text-base">
              {loading ? 'Creating account...' : 'Create Account — It\'s Free'}
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  )
}
