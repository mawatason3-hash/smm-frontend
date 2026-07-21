'use client'
import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { formatCurrency, formatDateTime, getPlatformIcon, truncateLink } from '@/lib/utils'
import { STATUS_CONFIG, PLATFORMS } from '@/types'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [platformFilter, setPlatformFilter] = useState('')
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: '25' })
      if (statusFilter) params.set('status', statusFilter)
      if (platformFilter) params.set('platform', platformFilter)
      const res = await api.get(`/api/admin/orders?${params}`)
      setOrders(res.data.items || [])
      setTotal(res.data.total || 0)
    } catch {} finally { setLoading(false) }
  }

  useEffect(() => { load() }, [page, statusFilter, platformFilter])

  return (
    <div className="max-w-7xl mx-auto space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">All Orders</h1>
          <p className="text-[#9CA3AF] text-sm">{total.toLocaleString()} total orders</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input max-w-[180px]" style={{ appearance: 'none' }}>
          <option value="">All Statuses</option>
          {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <div className="flex gap-1 flex-wrap">
          {PLATFORMS.map(p => (
            <button key={p.id} onClick={() => setPlatformFilter(platformFilter === p.id ? '' : p.id)}
              className={`w-9 h-9 rounded-lg border flex items-center justify-center text-base transition-all
                ${platformFilter === p.id ? 'border-[#3B82F6] bg-blue-500/10' : 'border-[#2D2D50] bg-[#1F1F3A]'}`}
              title={p.name}>{p.icon}</button>
          ))}
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2D2D50]">
                {['Order', 'User', 'Service', 'Link', 'Qty', 'Charge', 'Status', 'Date', 'Type'].map(h => (
                  <th key={h} className="text-left text-[#6B7280] font-semibold px-4 py-3 text-xs uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} className="text-center text-[#6B7280] py-12">Loading...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={9} className="text-center py-16">
                  <div className="text-4xl mb-3">📦</div>
                  <div className="text-[#9CA3AF]">No orders found</div>
                </td></tr>
              ) : orders.map((order: any) => (
                <tr key={order.id} className="table-row">
                  <td className="px-4 py-3 text-[#3B82F6] font-mono font-bold">#{order.order_number}</td>
                  <td className="px-4 py-3">
                    <div className="text-white text-sm">{order.user_name || '—'}</div>
                    <div className="text-[#6B7280] text-xs">{order.user_email || ''}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span>{getPlatformIcon(order.platform)}</span>
                      <span className="text-white text-xs max-w-[120px] truncate">{order.service_name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#9CA3AF] text-xs font-mono">{truncateLink(order.link, 25)}</td>
                  <td className="px-4 py-3 text-white">{order.quantity?.toLocaleString()}</td>
                  <td className="px-4 py-3 text-white font-medium">{formatCurrency(order.charge)}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${STATUS_CONFIG[order.status]?.color || ''}`}>
                      {STATUS_CONFIG[order.status]?.label || order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#6B7280] text-xs whitespace-nowrap">{formatDateTime(order.created_at)}</td>
                  <td className="px-4 py-3">
                    {order.is_admin_power && <span className="badge bg-yellow-500/20 text-yellow-400 text-xs">⚡ Admin</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {total > 25 && (
        <div className="flex justify-center gap-2">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-4 py-2 rounded-xl bg-[#1F1F3A] border border-[#2D2D50] text-white disabled:opacity-40 text-sm">← Prev</button>
          <span className="px-4 py-2 text-[#9CA3AF] text-sm">Page {page} of {Math.ceil(total / 25)}</span>
          <button disabled={page >= Math.ceil(total / 25)} onClick={() => setPage(p => p + 1)} className="px-4 py-2 rounded-xl bg-[#1F1F3A] border border-[#2D2D50] text-white disabled:opacity-40 text-sm">Next →</button>
        </div>
      )}
    </div>
  )
}
