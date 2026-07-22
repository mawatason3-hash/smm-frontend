'use client'
import { useEffect, useState } from 'react'
import api from '@/lib/api'
import Link from 'next/link'

export default function DashboardServicesPage() {
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/api/services?limit=200')
        setServices(res.data || [])
      } catch {} finally { setLoading(false) }
    }
    load()
  }, [])

  return (
    <div className="max-w-7xl mx-auto space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Services</h1>
          <p className="text-[#9CA3AF] text-sm">{services.length} services</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="text-[#6B7280]">Loading...</div>
        ) : services.length === 0 ? (
          <div className="text-[#6B7280]">No services available</div>
        ) : services.map(s => (
          <div key={s.id} className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-bold truncate">{s.name}</div>
                <div className="text-[#9CA3AF] text-xs capitalize">{s.platform}</div>
              </div>
              <div className="text-green-400 font-bold">${s.rate_per_1k}</div>
            </div>
            <div className="mt-3 flex gap-2">
              <Link href={`/dashboard/order?platform=${s.platform}`} className="btn-primary text-sm px-3 py-1.5">Order</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
