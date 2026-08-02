'use client'
import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { PLATFORMS, Service } from '@/types'
import { formatCurrency, calculateCharge } from '@/lib/utils'
import PlatformIcon from '@/lib/platformIcons'

export default function AdminPowerPage() {
  const { user, refreshUser } = useAuth()
  const { showToast } = useToast()
  const [selectedPlatform, setSelectedPlatform] = useState('')
  const [services, setServices] = useState<Service[]>([])
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [accountLink, setAccountLink] = useState('')
  const [quantity, setQuantity] = useState(1000)
  const [note, setNote] = useState('Personal account boost')
  const [placing, setPlacing] = useState(false)
  const [history, setHistory] = useState<any[]>([])

  useEffect(() => {
    if (!selectedPlatform) return  
    api.get(`/api/services/admin/all?platform=${selectedPlatform}&limit=50`).then(res => {
      setServices(res.data.items || [])
      setSelectedService(null)
    })
  }, [selectedPlatform])

  useEffect(() => {
    api.get('/api/orders?limit=10').then(res => {
      setHistory((res.data.items || []).filter((o: any) => o.is_admin_power))
    }).catch(() => {})
  }, [])

  const providerCost = selectedService ? calculateCharge(
    typeof selectedService.cost_per_1k === 'number'
      ? selectedService.cost_per_1k
      : typeof selectedService.rate_per_1k === 'number'
        ? selectedService.rate_per_1k * 0.7
        : 0,
    quantity
  ) : 0

  const handleBoost = async () => {
    if (!selectedService || !accountLink) { showToast('Please fill all fields', 'error'); return }
    setPlacing(true)
    try {
      const res = await api.post('/api/orders/admin-power', {
        service_id: selectedService.id,
        account_link: accountLink,
        quantity,
        note,
      })
      showToast(`⚡ ADMIN Power boost placed! Order #${res.data.order_number}`, 'success')
      refreshUser()
      const ordersRes = await api.get('/api/orders?limit=10')
      setHistory((ordersRes.data.items || []).filter((o: any) => o.is_admin_power))
      setAccountLink('')
    } catch (err: any) {
      showToast(err?.response?.data?.detail || 'Boost failed', 'error')
    } finally { setPlacing(false) }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="rounded-2xl p-6 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(217,119,6,0.1))', border: '1px solid rgba(245,158,11,0.3)' }}>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">👑</span>
          <span className="text-3xl">⚡</span>
          <h1 className="text-2xl font-black text-white">ADMIN Power</h1>
        </div>
        <p className="text-[#9CA3AF] text-sm">Your platform, your privilege. Boost your personal accounts for free — because you built this.</p>
      </div>

      {/* Gold quote banner */}
      <div className="p-4 rounded-2xl text-center" style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(217,119,6,0.15))', border: '1px solid rgba(245,158,11,0.3)' }}>
        <p className="text-yellow-300 text-sm font-medium italic">
          &quot;A cobbler&apos;s children should have the best shoes. A platform owner should have the best social media presence.&quot;
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Boosts Used', value: user?.admin_power_used || 0, icon: '⚡' },
          { label: 'Your Cost', value: '$0.00', icon: '💸' },
          { label: 'Platforms Covered', value: PLATFORMS.length, icon: '🌐' },
          { label: 'Status', value: 'Active', icon: '✅' },
        ].map(stat => (
          <div key={stat.label} className="card text-center" style={{ borderColor: 'rgba(245,158,11,0.2)' }}>
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="text-2xl font-black gold-text">{stat.value}</div>
            <div className="text-[#9CA3AF] text-xs mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          {/* Platform selector */}
          <div className="card" style={{ borderColor: 'rgba(245,158,11,0.2)' }}>
            <h2 className="text-white font-bold mb-4">Select Platform</h2>
            <div className="grid grid-cols-4 gap-3">
              {PLATFORMS.map(p => (
                <button key={p.id} onClick={() => setSelectedPlatform(p.id)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all
                    ${selectedPlatform === p.id
                      ? 'border-yellow-500 bg-yellow-500/10'
                      : 'border-[#2D2D50] bg-[#1F1F3A] hover:border-yellow-500/50'}`}>
                  <span className="text-2xl">{p.icon}</span>
                  <span className="text-xs text-[#9CA3AF] font-medium">{p.name}</span>
                  {selectedPlatform === p.id && <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Service + form */}
          {selectedPlatform && (
            <div className="card" style={{ borderColor: 'rgba(245,158,11,0.2)' }}>
              <h2 className="text-white font-bold mb-4">Boost Your Personal Account</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#9CA3AF] mb-1.5">Service</label>
                  <select value={selectedService?.id || ''} onChange={e => setSelectedService(services.find(s => s.id === e.target.value) || null)}
                    className="input" style={{ appearance: 'none' }}>
                    <option value="">Select a service</option>
                    {services.map(s => (
                      <option key={s.id} value={s.id}>{s.name} — ${s.rate_per_1k}/1K</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#9CA3AF] mb-1.5">Your Account Link / Username</label>
                  <input type="text" value={accountLink} onChange={e => setAccountLink(e.target.value)}
                    className="input" placeholder={`https://www.${selectedPlatform}.com/yourusername`} />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-medium text-[#9CA3AF]">Quantity</label>
                    {selectedService && <span className="text-xs text-[#6B7280]">Min: {selectedService.min_qty?.toLocaleString() ?? '0'}</span>}
                  </div>
                  <input type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))}
                    min={selectedService?.min_qty || 100} className="input" />
                  {selectedService && (
                    <p className="text-xs text-[#6B7280] mt-1">
                      {quantity.toLocaleString()} {selectedService.name.split(' ')[1]?.toLowerCase() || 'units'} will be added to your account
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#9CA3AF] mb-1.5">Note (optional)</label>
                  <input type="text" value={note} onChange={e => setNote(e.target.value)}
                    className="input" placeholder="Personal account boost" />
                </div>

                {selectedService && (
                  <div className="p-4 rounded-xl" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)' }}>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#9CA3AF]">Provider cost</span>
                      <span className="text-[#9CA3AF]">{formatCurrency(providerCost)}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-yellow-400 font-bold">Your cost (ADMIN privilege)</span>
                      <span className="text-yellow-400 font-black">$0.00 FREE</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right side summary */}
        <div className="space-y-4">
          <div className="card sticky top-4" style={{ borderColor: 'rgba(245,158,11,0.3)', background: 'rgba(245,158,11,0.05)' }}>
            <h2 className="text-white font-bold mb-4">Boost Summary</h2>
            {!selectedService ? (
              <div className="text-[#6B7280] text-sm text-center py-8">Select platform & service</div>
            ) : (
              <div className="space-y-3 text-sm mb-4">
                <div className="flex justify-between"><span className="text-[#9CA3AF]">Platform</span><span className="text-white capitalize">{selectedPlatform}</span></div>
                <div className="flex justify-between"><span className="text-[#9CA3AF]">Service</span><span className="text-white text-right max-w-[150px] leading-tight">{selectedService.name}</span></div>
                <div className="flex justify-between"><span className="text-[#9CA3AF]">Quantity</span><span className="text-white">{quantity.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-[#9CA3AF]">Provider cost</span><span className="text-[#9CA3AF]">{formatCurrency(providerCost)}</span></div>
                <div className="border-t border-[#2D2D50] pt-3 flex justify-between">
                  <span className="text-white font-bold">You Pay</span>
                  <span className="text-yellow-400 font-black text-xl">FREE</span>
                </div>
              </div>
            )}

            <button onClick={handleBoost} disabled={!selectedService || !accountLink || placing}
              className="btn-gold w-full py-3.5 text-base">
              {placing ? 'Boosting...' : '⚡ Boost Now — FREE'}
            </button>

            <div className="mt-4 p-3 rounded-xl bg-[#1F1F3A] border border-[#2D2D50]">
              <p className="text-[#6B7280] text-xs leading-relaxed">
                ⚠️ <span className="text-[#9CA3AF]">ADMIN Power is for your personal accounts only. All boosts are logged for transparency. Use responsibly.</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Boost history */}
      {history.length > 0 && (
        <div className="card">
          <h2 className="text-white font-bold mb-4">Boost History</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2D2D50]">
                  {['Date', 'Platform', 'Service', 'Account', 'Qty', 'Status', 'Note'].map(h => (
                    <th key={h} className="text-left text-[#6B7280] text-xs font-semibold px-3 py-2 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {history.map(order => (
                  <tr key={order.id} className="table-row">
                    <td className="px-3 py-3 text-[#6B7280] text-xs">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="px-3 py-3"><span className="text-lg"><PlatformIcon platform={order.platform} size={18} /></span></td>
                    <td className="px-3 py-3 text-white text-xs max-w-[120px] truncate">{order.service_name}</td>
                    <td className="px-3 py-3 text-[#9CA3AF] text-xs max-w-[120px] truncate">{order.link}</td>
                    <td className="px-3 py-3 text-white">{order.quantity.toLocaleString()}</td>
                    <td className="px-3 py-3">
                      <span className={`badge text-xs ${order.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-[#6B7280] text-xs">{order.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
