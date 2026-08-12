'use client'

import { useEffect, useMemo, useState } from 'react'
import api from '@/lib/api'
import { useToast } from '@/contexts/ToastContext'
import { formatDateTime } from '@/lib/utils'

type Ticket = {
  id: string
  order_id: string
  order_number: number
  service_name: string
  platform: string
  user_email: string
  user_name: string
  issue_type: string
  description: string
  attachment_url?: string | null
  status: string
  admin_comment?: string
  created_at: string
  updated_at: string
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'open', label: 'Open' },
  { value: 'in_review', label: 'In Review' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'rejected', label: 'Rejected' },
]

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')
  const { showToast } = useToast()

  const load = async (nextStatus = statusFilter) => {
    setLoading(true)
    try {
      const url = nextStatus === 'all' ? '/api/tickets/admin' : `/api/tickets/admin?status=${encodeURIComponent(nextStatus)}`
      const res = await api.get(url)
      setTickets(res.data.items)
    } catch (err: any) {
      showToast('Failed to load tickets', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/api/tickets/${id}`, { status })
      showToast('Ticket updated', 'success')
      load()
    } catch (err: any) {
      showToast('Failed to update ticket', 'error')
    }
  }

  const ticketCounts = useMemo(() => ({
    all: tickets.length,
    open: tickets.filter((ticket) => ticket.status === 'open').length,
    in_review: tickets.filter((ticket) => ticket.status === 'in_review').length,
    resolved: tickets.filter((ticket) => ticket.status === 'resolved').length,
    rejected: tickets.filter((ticket) => ticket.status === 'rejected').length,
  }), [tickets])

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-white">Support Tickets</h1>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {STATUS_OPTIONS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={async () => {
              setStatusFilter(value)
              await load(value)
            }}
            className={`px-3 py-2 rounded text-sm ${statusFilter === value ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            {label} {value === 'all' ? `(${ticketCounts.all})` : `(${ticketCounts[value as keyof typeof ticketCounts] || 0})`}
          </button>
        ))}
      </div>

      {loading ? <div className="text-slate-400">Loading…</div> : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 text-xs uppercase">
                <th className="p-3">ID</th>
                <th className="p-3">Order</th>
                <th className="p-3">User</th>
                <th className="p-3">Issue</th>
                <th className="p-3">Status</th>
                <th className="p-3">Updated</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-slate-400">No tickets found for this filter.</td>
                </tr>
              ) : tickets.map(t => (
                <tr key={t.id} className="border-t border-slate-800 align-top">
                  <td className="p-3 text-slate-300">{t.id.slice(0,8)}</td>
                  <td className="p-3 text-slate-200">#{t.order_number} — {t.service_name}<div className="text-xs text-slate-400">{t.platform}</div></td>
                  <td className="p-3 text-slate-200">{t.user_name}<div className="text-xs text-slate-400">{t.user_email}</div></td>
                  <td className="p-3 text-slate-200">{t.issue_type}<div className="text-xs text-slate-400 mt-1">{t.description.slice(0,80)}{t.description.length>80?'...':''}</div>{t.admin_comment ? <div className="mt-2 text-[11px] text-amber-300">Admin: {t.admin_comment.slice(0,80)}{t.admin_comment.length>80?'...':''}</div> : null}</td>
                  <td className="p-3 text-slate-200">{t.status}</td>
                  <td className="p-3 text-slate-400">{formatDateTime(t.updated_at || t.created_at)}</td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => updateStatus(t.id, 'in_review')} className="px-3 py-2 rounded bg-blue-600 text-white text-sm">In Review</button>
                      <button onClick={() => updateStatus(t.id, 'resolved')} className="px-3 py-2 rounded bg-green-600 text-white text-sm">Resolve</button>
                      <button onClick={() => updateStatus(t.id, 'rejected')} className="px-3 py-2 rounded bg-red-600 text-white text-sm">Reject</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
