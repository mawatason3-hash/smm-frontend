'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import api from '@/lib/api'
import { formatCurrency, formatDateTime, formatRelativeTime, truncateLink } from '@/lib/utils'
import PlatformIcon from '@/lib/platformIcons'
import TicketModal from '@/components/TicketModal'
import { STATUS_CONFIG, PLATFORMS } from '@/types'

type Order = {
  id: string
  order_number: number
  service_name: string
  platform: string
  link: string
  quantity: number
  charge: number
  status: string
  status_details?: string | null
  start_count: number
  remains: number
  created_at: string
  updated_at: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [platformFilter, setPlatformFilter] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [ticketOrder, setTicketOrder] = useState<Order | null>(null)
  const [isPolling, setIsPolling] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const REFRESHABLE_STATUSES = new Set(['pending', 'processing', 'in_progress', 'partial'])
  const REPORTABLE_STATUSES = new Set(['pending', 'processing', 'in_progress', 'partial', 'error'])

  const STATUS_COUNTS: Record<string, string> = {
    completed: 'text-[#00FF88]', processing: 'text-blue-400',
    pending: 'text-amber-300', cancelled: 'text-red-400', partial: 'text-violet-300', refunded: 'text-slate-400'
  }

  const loadOrders = async (options: { force?: boolean } = {}) => {
    if (!options.force) {
      setLoading(true)
    } else {
      setRefreshing(true)
    }

    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' })
      if (statusFilter) params.set('status', statusFilter)
      if (platformFilter) params.set('platform', platformFilter)
      const res = await api.get(`/api/orders?${params}`)
      setOrders(res.data.items)
      setTotal(res.data.total)
    } catch (err: any) {
      console.error('Failed to load orders', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [page, statusFilter, platformFilter, loadOrders])

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    intervalRef.current = setInterval(() => {
      const hasPendingOrders = orders.some(order => REFRESHABLE_STATUSES.has(order.status))
      if (hasPendingOrders) {
        ;(async () => {
          try {
            setIsPolling(true)
            await loadOrders({ force: true })
          } finally {
            setIsPolling(false)
          }
        })()
      }
    }, 30000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [orders, loadOrders])

  const statusCounts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="max-w-7xl mx-auto space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">My Orders</h1>
          <p className="text-[#9CA3AF] text-sm">{total} total orders</p>
        </div>
        <button onClick={() => {/* export */}} className="text-sm border border-[#2D2D50] text-[#9CA3AF] hover:text-white px-4 py-2 rounded-xl transition-colors">
          📥 Export CSV
        </button>
      </div>

      {/* Status chips */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(statusCounts).map(([status, count]) => (
          <button key={status} onClick={() => setStatusFilter(statusFilter === status ? '' : status)}
            className={`badge cursor-pointer transition-all ${statusFilter === status ? STATUS_CONFIG[status]?.color : 'bg-[#1F1F3A] text-[#9CA3AF]'}`}>
            {STATUS_CONFIG[status]?.label || status}: {String(count)}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="input max-w-[160px]" style={{ appearance: 'none' }}>
          <option value="">All Statuses</option>
          {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        {isPolling && <span className="text-xs text-slate-400 mr-2">Updating…</span>}
        <button onClick={() => loadOrders({ force: true })}
          className="btn-primary px-4 py-2 text-sm flex items-center gap-2"
          disabled={refreshing || isPolling}>
          {refreshing ? 'Refreshing…' : 'Refresh Orders'}
        </button>
      </div>
      <div className="flex gap-2 flex-wrap">
        {PLATFORMS.map(p => (
          <button key={p.id} onClick={() => setPlatformFilter(platformFilter === p.id ? '' : p.id)}
            className={`w-9 h-9 rounded-lg border flex items-center justify-center text-lg transition-all
              ${platformFilter === p.id ? 'border-[#3B82F6] bg-blue-500/10' : 'border-[#2D2D50] bg-[#1F1F3A] hover:border-[#3B82F6]/50'}`}
            title={p.name}>
            {p.icon}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2D2D50]">
                {['ID', 'Service', 'Link', 'Qty', 'Start', 'Remains', 'Charge', 'Status', 'Date', ''].map(h => (
                  <th key={h} className="text-left text-[#6B7280] font-semibold px-4 py-3 text-xs uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={10} className="text-center text-[#6B7280] py-12">Loading orders...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={10} className="text-center py-16">
                  <div className="text-4xl mb-3">📦</div>
                  <div className="text-[#9CA3AF]">No orders found</div>
                </td></tr>
              ) : orders.map(order => (
                <tr key={order.id} className="table-row cursor-pointer" onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}>
                  <td className="px-4 py-3 text-[#3B82F6] font-mono font-bold">#{order.order_number}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg"><PlatformIcon platform={order.platform} size={18} /></span>
                      <span className="text-white font-medium max-w-[140px] truncate">{order.service_name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#9CA3AF] font-mono text-xs">{truncateLink(order.link)}</td>
                  <td className="px-4 py-3 text-white">{order.quantity.toLocaleString()}</td>
                  <td className="px-4 py-3 text-[#9CA3AF]">{order.start_count.toLocaleString()}</td>
                  <td className="px-4 py-3 text-[#9CA3AF]">{order.remains.toLocaleString()}</td>
                  <td className="px-4 py-3 text-white font-medium">{formatCurrency(order.charge)}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${STATUS_CONFIG[order.status]?.color || ''} ${order.status === 'processing' || order.status === 'in_progress' ? 'animate-pulse-live' : ''}`}>
                      {STATUS_CONFIG[order.status]?.label || order.status}
                    </span>
                    <div className="text-[10px] text-slate-500 mt-1">{formatRelativeTime(order.updated_at)}</div>
                  </td>
                  <td className="px-4 py-3 text-[#6B7280] text-xs whitespace-nowrap">{formatDateTime(order.created_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="w-7 h-7 rounded-lg bg-[#1F1F3A] hover:bg-[#2D2D50] flex items-center justify-center text-xs" title="View">👁️</button>
                      {REPORTABLE_STATUSES.has(order.status) && (
                        <button onClick={(e) => { e.stopPropagation(); setTicketOrder(order) }}
                          className="w-7 h-7 rounded-lg bg-[#1F1F3A] hover:bg-[#2D2D50] flex items-center justify-center text-xs"
                          title="Report Issue">🎫</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order detail panel */}
      {selectedOrder && (
        <div className="card border-[#3B82F6]/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold">Order #{selectedOrder.order_number}</h3>
            <button onClick={() => setSelectedOrder(null)} className="text-[#6B7280] hover:text-white text-xl">×</button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between"><span className="text-[#9CA3AF]">Service</span><span className="text-white font-medium">{selectedOrder.service_name}</span></div>
              <div className="flex justify-between"><span className="text-[#9CA3AF]">Platform</span><span className="text-white capitalize">{selectedOrder.platform}</span></div>
              <div className="flex justify-between"><span className="text-[#9CA3AF]">Quantity</span><span className="text-white">{selectedOrder.quantity.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-[#9CA3AF]">Charge</span><span className="text-white font-bold">{formatCurrency(selectedOrder.charge)}</span></div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-[#6B7280] mb-2">
                <span>Start: {selectedOrder.start_count}</span>
                <span>Remains: {selectedOrder.remains}</span>
                <span>Target: {selectedOrder.quantity}</span>
              </div>
              <div className="w-full bg-[#1F1F3A] rounded-full h-2.5">
                <div className="h-2.5 rounded-full bg-gradient-to-r from-[#3B82F6] to-[#7C3AED] transition-all"
                  style={{ width: `${Math.min(100, ((selectedOrder.quantity - selectedOrder.remains) / selectedOrder.quantity) * 100)}%` }} />
              </div>
              <div className="text-center text-xs text-[#9CA3AF] mt-1">
                {Math.round(((selectedOrder.quantity - selectedOrder.remains) / selectedOrder.quantity) * 100)}% complete
              </div>
            </div>
          </div>
        </div>
      )}
      {ticketOrder && (
        <TicketModal
          order={ticketOrder}
          onClose={() => setTicketOrder(null)}
          onTicketCreated={() => { setTicketOrder(null); loadOrders({ force: true }) }}
        />
      )}

      {/* Pagination */}
      {total > 20 && (
        <div className="flex justify-center gap-2">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
            className="px-4 py-2 rounded-xl bg-[#1F1F3A] border border-[#2D2D50] text-white disabled:opacity-40 hover:bg-[#2D2D50] text-sm">← Prev</button>
          <span className="px-4 py-2 text-[#9CA3AF] text-sm">Page {page} of {Math.ceil(total / 20)}</span>
          <button disabled={page >= Math.ceil(total / 20)} onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 rounded-xl bg-[#1F1F3A] border border-[#2D2D50] text-white disabled:opacity-40 hover:bg-[#2D2D50] text-sm">Next →</button>
        </div>
      )}
    </div>
  )
}
