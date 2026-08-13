'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { formatDateTime } from '@/lib/utils'

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

const STATUS_STYLES: Record<string, string> = {
  open: 'bg-blue-500/20 text-blue-300',
  in_review: 'bg-yellow-500/20 text-yellow-300',
  resolved: 'bg-green-500/20 text-green-300',
  rejected: 'bg-red-500/20 text-red-300',
}

export default function DashboardTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  const loadTickets = async () => {
    setLoading(true)
    try {
      const res = await api.get(`/api/tickets/me?page=${page}&limit=10`)
      setTickets(res.data.items || [])
      setTotal(res.data.total || 0)
    } catch (err) {
      console.error('Failed to load tickets', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTickets()
  }, [page])

  return (
    <div className="max-w-5xl mx-auto space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Support Tickets</h1>
          <p className="text-[#9CA3AF] text-sm">Track the status of your support requests</p>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2D2D50]">
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
                    <div className="text-[#9CA3AF] text-xs mt-1 max-w-md truncate">{ticket.description}</div>
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
