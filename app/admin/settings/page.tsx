'use client'
import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { useToast } from '@/contexts/ToastContext'

export default function AdminSettingsPage() {
  const { showToast } = useToast()
  const [settings, setSettings] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.get('/api/admin/settings').then(res => setSettings(res.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const save = async () => {
    setSaving(true)
    try {
      await api.put('/api/admin/settings', settings)
      showToast('Settings saved successfully', 'success')
    } catch (err: any) {
      showToast(err?.response?.data?.detail || 'Save failed', 'error')
    } finally { setSaving(false) }
  }

  const update = (key: string, value: any) => setSettings((prev: any) => ({ ...prev, [key]: value }))

  if (loading) return <div className="text-[#6B7280] text-center py-20">Loading settings...</div>
  if (!settings) return null

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-white">Site Settings</h1>
        <p className="text-[#9CA3AF] text-sm mt-1">Configure your BOASTLIB platform</p>
      </div>

      {/* General */}
      <div className="card">
        <h2 className="text-white font-bold mb-4">General</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-[#9CA3AF] mb-1.5">Site Name</label>
            <input value={settings.site_name || ''} onChange={e => update('site_name', e.target.value)} className="input" />
          </div>
          <div>
            <label className="block text-sm text-[#9CA3AF] mb-1.5">Site Description</label>
            <textarea value={settings.site_description || ''} onChange={e => update('site_description', e.target.value)} className="input h-20 resize-none" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[#9CA3AF] mb-1.5">Support Email</label>
              <input type="email" value={settings.support_email || ''} onChange={e => update('support_email', e.target.value)} className="input" />
            </div>
            <div>
              <label className="block text-sm text-[#9CA3AF] mb-1.5">Default Provider</label>
              <select value={settings.default_provider || 'jap'} onChange={e => update('default_provider', e.target.value)} className="input" style={{ appearance: 'none' }}>
                <option value="jap">JustAnotherPanel (JAP)</option>
                <option value="peakerr">Peakerr</option>
                <option value="smmwiz">SMMWiz</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Social links */}
      <div className="card">
        <h2 className="text-white font-bold mb-4">Social & Support Links</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-[#9CA3AF] mb-1.5">✈️ Telegram Link</label>
            <input value={settings.telegram_link || ''} onChange={e => update('telegram_link', e.target.value)} className="input" placeholder="https://t.me/boastlib" />
          </div>
          <div>
            <label className="block text-sm text-[#9CA3AF] mb-1.5">📱 WhatsApp Link</label>
            <input value={settings.whatsapp_link || ''} onChange={e => update('whatsapp_link', e.target.value)} className="input" placeholder="https://wa.me/..." />
          </div>
        </div>
      </div>

      {/* Liberia Mobile Money */}
      <div className="card">
        <h2 className="text-white font-bold mb-4">🇱🇷 Liberia Mobile Money Numbers</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-[#9CA3AF] mb-1.5">MTN Lonestar Number</label>
            <input value={settings.liberia_mtn_number || ''} onChange={e => update('liberia_mtn_number', e.target.value)} className="input" placeholder="e.g., 0555166954" />
          </div>
          <div>
            <label className="block text-sm text-[#9CA3AF] mb-1.5">Orange Money Number</label>
            <input value={settings.liberia_orange_number || ''} onChange={e => update('liberia_orange_number', e.target.value)} className="input" placeholder="e.g., 0770 XXX XXX" />
          </div>
          <div>
            <label className="block text-sm text-[#9CA3AF] mb-1.5">WhatsApp Support Number</label>
            <input value={settings.whatsapp_support || ''} onChange={e => update('whatsapp_support', e.target.value)} className="input" placeholder="e.g., +250792405593" />
          </div>
          <div>
            <label className="block text-sm text-[#9CA3AF] mb-1.5">Telegram Support Link</label>
            <input value={settings.telegram_support || ''} onChange={e => update('telegram_support', e.target.value)} className="input" placeholder="e.g., https://t.me/boastlib_support" />
          </div>
          <div>
            <label className="block text-sm text-[#9CA3AF] mb-1.5">Manual Payment Instructions</label>
            <textarea value={settings.manual_payment_instructions || ''} onChange={e => update('manual_payment_instructions', e.target.value)} className="input h-24 resize-none" placeholder="Instructions shown to users..." />
          </div>
          <div>
            <label className="block text-sm text-[#9CA3AF] mb-1.5">Manual Payment Processing Time</label>
            <input value={settings.manual_payment_time || ''} onChange={e => update('manual_payment_time', e.target.value)} className="input" placeholder="e.g., 1-2 hours" />
          </div>
        </div>
      </div>

      {/* Toggles */}
      <div className="card">
        <h2 className="text-white font-bold mb-4">Platform Controls</h2>
        <div className="space-y-4">
          {[
            { key: 'maintenance_mode', label: 'Maintenance Mode', desc: 'Block all user access — show maintenance page', danger: true },
            { key: 'registration_open', label: 'Registration Open', desc: 'Allow new users to register', danger: false },
            { key: 'auto_sync_services', label: 'Auto-Sync Services', desc: 'Automatically sync services from providers', danger: false },
          ].map(toggle => (
            <div key={toggle.key} className={`flex items-center justify-between p-4 rounded-xl border ${toggle.danger && settings[toggle.key] ? 'border-red-500/40 bg-red-500/5' : 'border-[#2D2D50] bg-[#1F1F3A]'}`}>
              <div>
                <div className="text-white font-medium text-sm">{toggle.label}</div>
                <div className="text-[#6B7280] text-xs mt-0.5">{toggle.desc}</div>
              </div>
              <button onClick={() => update(toggle.key, !settings[toggle.key])}
                className={`w-12 h-6 rounded-full transition-all relative ${settings[toggle.key] ? (toggle.danger ? 'bg-red-500' : 'bg-[#3B82F6]') : 'bg-[#2D2D50]'}`}>
                <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${settings[toggle.key] ? 'left-6' : 'left-0.5'}`} />
              </button>
            </div>
          ))}
        </div>

        {settings.maintenance_mode && (
          <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
            <div className="text-red-400 font-bold text-sm">⚠️ Maintenance Mode is ON</div>
            <div className="text-red-300/70 text-xs mt-1">All users (except admins) will see a maintenance page. Turn this off when ready.</div>
          </div>
        )}
      </div>

      <button onClick={save} disabled={saving} className="btn-primary w-full py-3.5 text-base">
        {saving ? 'Saving...' : 'Save Settings'}
      </button>
    </div>
  )
}
