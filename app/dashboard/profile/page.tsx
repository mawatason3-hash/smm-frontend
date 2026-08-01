'use client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import api from '@/lib/api'
import { formatDate } from '@/lib/utils'

const COUNTRIES = [
  'Algeria', 'Angola', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi', 'Cameroon', 'Cape Verde',
  'Chad', 'Comoros', 'Congo', 'Côte d\'Ivoire', 'Djibouti', 'Egypt', 'Equatorial Guinea', 'Eritrea',
  'Eswatini', 'Ethiopia', 'Gabon', 'Gambia', 'Ghana', 'Guinea', 'Guinea-Bissau', 'Kenya', 'Lesotho',
  'Liberia', 'Libya', 'Madagascar', 'Malawi', 'Mali', 'Mauritania', 'Mauritius', 'Morocco', 'Mozambique',
  'Namibia', 'Niger', 'Nigeria', 'Rwanda', 'Sao Tome and Principe', 'Senegal', 'Seychelles', 'Sierra Leone',
  'Somalia', 'South Africa', 'South Sudan', 'Sudan', 'Tanzania', 'Togo', 'Tunisia', 'Uganda', 'Zambia', 'Zimbabwe',
  'United States', 'United Kingdom', 'Canada', 'France', 'Germany', 'Netherlands', 'Belgium', 'Spain', 'Italy', 'Portugal',
  'Switzerland', 'Australia', 'Other'
]

export default function ProfilePage() {
  const { user, refreshUser } = useAuth()
  const { showToast } = useToast()
  const [form, setForm] = useState({ full_name: user?.full_name || '', phone: user?.phone || '', country: user?.country || '' })
  const [passForm, setPassForm] = useState({ old_password: '', new_password: '', confirm: '' })
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPass, setSavingPass] = useState(false)

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingProfile(true)
    try {
      await api.put('/api/auth/me', form)
      await refreshUser()
      showToast('Profile updated successfully', 'success')
    } catch (err: any) {
      showToast(err?.response?.data?.detail || 'Update failed', 'error')
    } finally { setSavingProfile(false) }
  }

  const savePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passForm.new_password !== passForm.confirm) { showToast('Passwords do not match', 'error'); return }
    setSavingPass(true)
    try {
      await api.put('/api/auth/change-password', { old_password: passForm.old_password, new_password: passForm.new_password })
      showToast('Password changed successfully', 'success')
      setPassForm({ old_password: '', new_password: '', confirm: '' })
    } catch (err: any) {
      showToast(err?.response?.data?.detail || 'Password change failed', 'error')
    } finally { setSavingPass(false) }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-white">Profile</h1>
        <p className="text-[#9CA3AF] text-sm mt-1">Manage your account details</p>
      </div>

      {/* Avatar & info */}
      <div className="card flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-2xl flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #3B82F6, #7C3AED)' }}>
          {user?.full_name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="text-white font-bold text-lg">{user?.full_name}</div>
          <div className="text-[#9CA3AF] text-sm">{user?.email}</div>
          <div className="flex items-center gap-3 mt-2">
            <span className={`badge ${user?.role === 'super_admin' ? 'bg-yellow-500/20 text-yellow-400' : user?.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
              {user?.role?.replace('_', ' ')}
            </span>
            <span className="badge bg-green-500/20 text-green-400">{user?.status}</span>
            <span className="text-[#6B7280] text-xs">Member since {formatDate(user?.created_at || '')}</span>
          </div>
        </div>
      </div>

      {/* Referral code */}
      <div className="card">
        <h2 className="text-white font-bold mb-3">🎁 Your Referral Code</h2>
        <p className="text-[#9CA3AF] text-sm mb-3">Share this link and earn bonuses when friends join</p>
        <div className="flex gap-2">
          <input readOnly value={`${typeof window !== 'undefined' ? window.location.origin : ''}/auth/register?ref=${user?.referral_code}`}
            className="input text-sm" />
          <button onClick={() => {
            navigator.clipboard.writeText(`${window.location.origin}/auth/register?ref=${user?.referral_code}`)
            showToast('Referral link copied!', 'success')
          }} className="btn-primary px-4 py-2 text-sm whitespace-nowrap">Copy</button>
        </div>
      </div>

      {/* Edit profile */}
      <div className="card">
        <h2 className="text-white font-bold mb-4">Edit Profile</h2>
        <form onSubmit={saveProfile} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#9CA3AF] mb-1.5">Full Name</label>
            <input type="text" value={form.full_name} onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))} className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#9CA3AF] mb-1.5">Email Address</label>
            <input type="email" value={user?.email} disabled className="input opacity-50 cursor-not-allowed" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] mb-1.5">Phone Number</label>
              <input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="input" placeholder="+250 7XX XXX XXX" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] mb-1.5">Country</label>
              <select value={form.country} onChange={e => setForm(p => ({ ...p, country: e.target.value }))} className="input" style={{ appearance: 'none' }}>
                <option value="">Select country</option>
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <button type="submit" disabled={savingProfile} className="btn-primary px-8 py-2.5">
            {savingProfile ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Change password */}
      <div className="card">
        <h2 className="text-white font-bold mb-4">Change Password</h2>
        <form onSubmit={savePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#9CA3AF] mb-1.5">Current Password</label>
            <input type="password" value={passForm.old_password} onChange={e => setPassForm(p => ({ ...p, old_password: e.target.value }))} className="input" required />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] mb-1.5">New Password</label>
              <input type="password" value={passForm.new_password} onChange={e => setPassForm(p => ({ ...p, new_password: e.target.value }))} className="input" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] mb-1.5">Confirm New Password</label>
              <input type="password" value={passForm.confirm} onChange={e => setPassForm(p => ({ ...p, confirm: e.target.value }))} className="input" required />
            </div>
          </div>
          <button type="submit" disabled={savingPass} className="btn-primary px-8 py-2.5">
            {savingPass ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>

      {/* Account info */}
      <div className="card">
        <h2 className="text-white font-bold mb-4">Account Info</h2>
        <div className="space-y-3 text-sm">
          {[
            { label: 'Account ID', value: user?.id?.slice(0, 8) + '...' },
            { label: 'Member Since', value: formatDate(user?.created_at || '') },
            { label: 'Role', value: user?.role?.replace('_', ' ') },
            { label: 'Status', value: user?.status },
          ].map(item => (
            <div key={item.label} className="flex justify-between py-2 border-b border-[#2D2D50] last:border-0">
              <span className="text-[#9CA3AF]">{item.label}</span>
              <span className="text-white capitalize">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
