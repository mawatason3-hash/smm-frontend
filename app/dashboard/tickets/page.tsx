'use client'

import { useEffect, useMemo, useState } from 'react'
import api from '@/lib/api'
import { formatDateTime } from '@/lib/utils'
import { useToast } from '@/contexts/ToastContext'

type Ticket = {
  id: string
  order_id: string
  order_number: number
  issue_type: string
  description: string
  attachment_url?: string | null
  status: string
  created_at: string
  updated_at: string
}

type OrderSummary = {
  id: string
  order_number: number
  service_name: string
  status: string
}

const ISSUE_TYPES = [
  'Refund Request (Service Not Delivered)',
  'Refund Request (Partial Delivery)',
  'Wrong Service Delivered',
  'Technical Issue / Error',
  'Other',
]

const STATUS_STYLES: Record<string, string> = {
  open: 'bg-blue-500/20 text-blue-300',
  in_review: 'bg-yellow-500/20 text-yellow-300',
  resolved: 'bg-green-500/20 text-green-300',
  rejected: 'bg-red-500/20 text-red-300',
}

export default function DashboardTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [orders, setOrders] = useState<OrderSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [selectedOrderId, setSelectedOrderId] = useState('')
  const [issueType, setIssueType] = useState(ISSUE_TYPES[0])
  const [description, setDescription] = useState('')
  const { showToast } = useToast()

  const loadTickets = async () => {
    setLoading(true)
    try {
      const [ticketsRes, ordersRes] = await Promise.all([
        api.get(`/api/tickets/me?page=${page}&limit=10`),
        api.get('/api/orders?limit=20'),
      ])

      const orderItems = Array.isArray(ordersRes.data?.items) ? ordersRes.data.items : []
      setOrders(orderItems.map((order: any) => ({
        id: order.id,
        order_number: order.order_number,
        service_name: order.service_name,
        status: order.status,
      })))

      setTickets(ticketsRes.data.items || [])
      setTotal(ticketsRes.data.total || 0)
      if (!selectedOrderId && orderItems[0]?.id) {
        setSelectedOrderId(orderItems[0].id)
      }
    } catch (err) {
      console.error('Failed to load tickets', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadTickets()
  }, [page])

  const selectedOrder = useMemo(
    () => orders.find(order => order.id === selectedOrderId) || null,
    [orders, selectedOrderId],
  )

  const submitTicket = async () => {
    if (!selectedOrderId) {
      showToast('Please choose an order first.', 'warning')
      return
    }
    if (description.trim().length < 10) {
      showToast('Please describe the issue in at least 10 characters.', 'warning')
      return
    }

    setSubmitting(true)
    try {
      await api.post('/api/tickets', {
        order_id: selectedOrderId,
        issue_type: issueType,
        description,
      })
      showToast('Ticket submitted successfully. Admin will review it shortly.', 'success')
      setDescription('')
      setIssueType(ISSUE_TYPES[0])
      setPage(1)
      await loadTickets()
    } catch (err: any) {
      showToast(err?.response?.data?.detail || 'Failed to submit ticket', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-black text-white">Support Tickets</h1>
        <p className="text-[#9CA3AF] text-sm mt-1">Send a complaint or problem to the admin team.</p>
      </div>

      <div className="card">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Related order</label>
            <select
              value={selectedOrderId}
              onChange={(e) => setSelectedOrderId(e.target.value)}
              className="input w-full"
            >
              <option value="">Select an order</option>
              {orders.map((order) => (
                <option key={order.id} value={order.id}>#{order.order_number} · {order.service_name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Issue type</label>
            <select
              value={issueType}
              onChange={(e) => setIssueType(e.target.value)}
              className="input w-full"
            >
              {ISSUE_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-slate-300 mb-2">Describe the problem</label>
          <textarea
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input w-full min-h-[140px]"
            placeholder="Tell the admin what went wrong, what you expected, and any relevant order details."
          />
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={submitTicket}
            disabled={submitting || !selectedOrderId}
            className="btn-primary px-5 py-3 disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit complaint'}
          </button>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2D2D50] bg-[#1A1A2E]">
                <th className="text-left text-[#6B7280] font-semibold px-4 py-3 text-xs uppercase tracking-wide">Order</th>
                <th className="text-left text-[#6B7280] font-semibold px-4 py-3 text-xs uppercase tracking-wide">Issue</th>
                <th className="text-left text-[#6B7280] font-semibold px-4 py-3 text-xs uppercase tracking-wide">Status</th>
                <th className="text-left text-[#6B7280] font-semibold px-4 py-3 text-xs uppercase tracking-wide">Updated</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="text-center text-[#6B7280] py-12">Loading tickets...</td></tr>
              ) : tickets.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-16">
                  <div className="text-4xl mb-3">🎫</div>
                  <div className="text-[#9CA3AF]">No support tickets yet</div>
                </td></tr>
              ) : tickets.map((ticket) => (
                <tr key={ticket.id} className="table-row">
                  <td className="px-4 py-3 text-[#3B82F6] font-mono font-bold">#{ticket.order_number}</td>
                  <td className="px-4 py-3">
                    <div className="text-white font-medium">{ticket.issue_type}</div>
                    <div className="text-[#9CA3AF] text-xs mt-1 max-w-md">{ticket.description}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge ${STATUS_STYLES[ticket.status] || 'bg-slate-500/20 text-slate-300'}`}>
                      {ticket.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#6B7280] text-xs whitespace-nowrap">{formatDateTime(ticket.updated_at || ticket.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {total > 10 && (
        <div className="flex justify-center gap-2">
          <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 rounded-xl bg-[#1F1F3A] border border-[#2D2D50] text-white disabled:opacity-40 hover:bg-[#2D2D50] text-sm">← Prev</button>
          <span className="px-4 py-2 text-[#9CA3AF] text-sm">Page {page}</span>
          <button disabled={page >= Math.ceil(total / 10)} onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 rounded-xl bg-[#1F1F3A] border border-[#2D2D50] text-white disabled:opacity-40 hover:bg-[#2D2D50] text-sm">Next →</button>
        </div>
      )}
    </div>
  )
}
