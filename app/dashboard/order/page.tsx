'use client'
import { Suspense, useEffect, useState, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import api from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { PLATFORMS, Service } from '@/types'
import { formatCurrency, calculateCharge, getPlatformIcon, debounce } from '@/lib/utils'

function OrderPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, refreshUser } = useAuth()
  const { showToast } = useToast()

  const [selectedPlatform, setSelectedPlatform] = useState(searchParams.get('platform') || '')
  const [services, setServices] = useState<Service[]>([])
  const [filteredServices, setFilteredServices] = useState<Service[]>([])
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [serviceSearch, setServiceSearch] = useState('')
  const [link, setLink] = useState('')
  const [quantity, setQuantity] = useState(100)
  const [placing, setPlacing] = useState(false)

  useEffect(() => {
    if (!selectedPlatform) return
    api.get(`/api/services?platform=${selectedPlatform}&limit=100`).then(res => {
      setServices(res.data)
      setFilteredServices(res.data)
      setSelectedService(null)
    })
  }, [selectedPlatform])

  const filterServices = useCallback(debounce((q: string) => {
    if (!q) { setFilteredServices(services); return }
    setFilteredServices(services.filter(s => s.name.toLowerCase().includes(q.toLowerCase())))
  }, 300), [services])

  useEffect(() => { filterServices(serviceSearch) }, [serviceSearch, services])

  const charge = selectedService ? calculateCharge(selectedService.rate_per_1k, quantity) : 0
  const canAfford = (user?.balance || 0) >= charge
  const validQty = selectedService ? (quantity >= selectedService.min_qty && quantity <= selectedService.max_qty) : false

  const placeOrder = async () => {
    if (!selectedService || !link || !validQty) return
    setPlacing(true)
    try {
      const res = await api.post('/api/orders', {
        service_id: selectedService.id,
        link,
        quantity,
      })
      showToast(`✅ Order #${res.data.order_number} placed! Remaining balance: ${formatCurrency(res.data.balance_remaining)}`, 'success')
      refreshUser()
      router.push('/dashboard/orders')
    } catch (err: any) {
      showToast(err?.response?.data?.detail || 'Failed to place order', 'error')
    } finally {
      setPlacing(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-white">New Order</h1>
        <p className="text-[#9CA3AF] text-sm mt-1">Select a platform and service to get started</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 text-sm">
        {['Select Platform', 'Select Service', 'Enter Details'].map((step, i) => {
          const done = (i === 0 && selectedPlatform) || (i === 1 && selectedService) || (i === 2 && link && validQty)
          const active = (i === 0 && !selectedPlatform) || (i === 1 && selectedPlatform && !selectedService) || (i === 2 && selectedService)
          return (
            <div key={step} className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors
                ${done ? 'bg-green-500/20 text-green-400' : active ? 'bg-blue-500/20 text-blue-400' : 'bg-[#1F1F3A] text-[#6B7280]'}`}>
                <span>{done ? '✓' : i + 1}</span>
                <span className="hidden sm:inline">{step}</span>
              </div>
              {i < 2 && <div className="w-6 h-px bg-[#2D2D50]" />}
            </div>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          {/* Platform selector */}
          <div className="card">
            <h2 className="text-white font-bold mb-4">1. Select Platform</h2>
            <div className="grid grid-cols-4 gap-3">
              {PLATFORMS.map(p => (
                <button key={p.id} onClick={() => setSelectedPlatform(p.id)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all
                    ${selectedPlatform === p.id
                      ? 'border-[#3B82F6] bg-blue-500/10'
                      : 'border-[#2D2D50] bg-[#1F1F3A] hover:border-[#3B82F6]/50'}`}>
                  <span className="text-2xl">{p.icon}</span>
                  <span className="text-xs text-[#9CA3AF] font-medium">{p.name}</span>
                  {selectedPlatform === p.id && <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Service selector */}
          {selectedPlatform && (
            <div className="card">
              <h2 className="text-white font-bold mb-4">2. Select Service</h2>
              <input type="text" value={serviceSearch} onChange={e => setServiceSearch(e.target.value)}
                className="input mb-3" placeholder="Search services..." />
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {filteredServices.length === 0 ? (
                  <div className="text-[#6B7280] text-sm text-center py-6">No services found</div>
                ) : filteredServices.map(svc => (
                  <div key={svc.id} onClick={() => { setSelectedService(svc); setQuantity(svc.min_qty) }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all
                      ${selectedService?.id === svc.id
                        ? 'border-[#3B82F6] bg-blue-500/10'
                        : 'border-[#2D2D50] bg-[#1F1F3A] hover:border-[#3B82F6]/30'}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-medium leading-tight">{svc.name}</div>
                        <div className="text-[#6B7280] text-xs mt-1">
                          Min: {svc.min_qty.toLocaleString()} · Max: {svc.max_qty.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-white font-bold text-sm">${svc.rate_per_1k}/1K</div>
                        {svc.is_instant && <span className="text-[10px] text-yellow-400">⚡ Instant</span>}
                      </div>
                    </div>
                    {svc.quality_badge && (
                      <div className="mt-2 flex gap-1.5">
                        <span className="badge bg-purple-500/20 text-purple-400">{svc.quality_badge}</span>
                        {svc.refill_enabled && <span className="badge bg-blue-500/20 text-blue-400">🔄 Refill</span>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Order details */}
          {selectedService && (
            <div className="card">
              <h2 className="text-white font-bold mb-4">3. Enter Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#9CA3AF] mb-1.5">Link / URL *</label>
                  <div className="relative">
                    <input type="text" value={link} onChange={e => setLink(e.target.value)}
                      className="input pr-12" placeholder="https://www.instagram.com/yourusername" />
                    <button onClick={() => navigator.clipboard.readText().then(setLink)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-white text-xs px-2 py-1 rounded bg-[#2D2D50]">
                      Paste
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-medium text-[#9CA3AF]">Quantity</label>
                    <span className="text-xs text-[#6B7280]">Min: {selectedService.min_qty.toLocaleString()} · Max: {selectedService.max_qty.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setQuantity(Math.max(selectedService.min_qty, quantity - 100))}
                      className="w-10 h-10 rounded-lg bg-[#1F1F3A] border border-[#2D2D50] text-white font-bold hover:bg-[#2D2D50] flex-shrink-0">−</button>
                    <input type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))}
                      min={selectedService.min_qty} max={selectedService.max_qty}
                      className="input text-center" />
                    <button onClick={() => setQuantity(Math.min(selectedService.max_qty, quantity + 100))}
                      className="w-10 h-10 rounded-lg bg-[#1F1F3A] border border-[#2D2D50] text-white font-bold hover:bg-[#2D2D50] flex-shrink-0">+</button>
                  </div>
                  <input type="range" min={selectedService.min_qty} max={Math.min(selectedService.max_qty, 10000)}
                    value={quantity} onChange={e => setQuantity(Number(e.target.value))}
                    className="w-full mt-2 accent-blue-500" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="space-y-4">
          <div className="card sticky top-4">
            <h2 className="text-white font-bold mb-4">Order Summary</h2>
            {!selectedService ? (
              <div className="text-[#6B7280] text-sm text-center py-8">Select a service to see pricing</div>
            ) : (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-[#1F1F3A]">
                  <div className="text-xs text-[#6B7280] mb-1">Service</div>
                  <div className="text-white text-sm font-medium">{selectedService.name}</div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#9CA3AF]">Rate</span>
                    <span className="text-white font-medium">${selectedService.rate_per_1k}/1K</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#9CA3AF]">Quantity</span>
                    <span className="text-white font-medium">{quantity.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#9CA3AF]">Speed</span>
                    <span className="text-yellow-400 font-medium">{selectedService.avg_speed || 'Variable'}</span>
                  </div>
                  <div className="border-t border-[#2D2D50] pt-2 flex justify-between">
                    <span className="text-white font-bold">Total</span>
                    <span className="text-white font-black text-lg">{formatCurrency(charge)}</span>
                  </div>
                </div>

                <div className={`p-3 rounded-xl text-sm ${canAfford ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                  <div className="flex justify-between">
                    <span className={canAfford ? 'text-green-400' : 'text-red-400'}>Your balance</span>
                    <span className={`font-bold ${canAfford ? 'text-green-400' : 'text-red-400'}`}>{formatCurrency(user?.balance || 0)}</span>
                  </div>
                  {!canAfford && (
                    <div className="text-red-400 text-xs mt-1">
                      Need {formatCurrency(charge - (user?.balance || 0))} more →{' '}
                      <a href="/dashboard/funds" className="underline">Add funds</a>
                    </div>
                  )}
                </div>

                <button onClick={placeOrder} disabled={!link || !validQty || !canAfford || placing}
                  className="btn-primary w-full py-3.5">
                  {placing ? 'Placing Order...' : 'Place Order'}
                </button>

                {!validQty && selectedService && (
                  <p className="text-red-400 text-xs text-center">
                    Quantity must be between {selectedService.min_qty.toLocaleString()} and {selectedService.max_qty.toLocaleString()}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function NewOrderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <OrderPageContent />
    </Suspense>
  )
}
