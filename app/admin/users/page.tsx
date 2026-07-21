'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import api from '@/lib/api'
import { useToast } from '@/contexts/ToastContext'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function AdminUsersPage() {
  const { showToast } = useToast()
  const [users, setUsers] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<any | null>(null)
  const [adjustAmount, setAdjustAmount] = useState('')
  const [adjustReason, setAdjustReason] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' })
      if (search) params.set('search', search)
      if (statusFilter) params.set('status', statusFilter)
      const res = await api.get(`/api/admin/users?${params}`)
      setUsers(res.data.items)
      setTotal(res.data.total)
    } catch {} finally { setLoading(false) }
  }

  useEffect(() => { load() }, [page, statusFilter])
  useEffect(() => { const t = setTimeout(load, 400); return () => clearTimeout(t) }, [search])

  const handleAdjustBalance = async () => {
    if (!selected || !adjustAmount || !adjustReason) { showToast('Fill amount and reason', 'error'); return }
    try {
      await api.post('/api/payments/admin/adjust-balance', {
        user_id: selected.id,
        amount: parseFloat(adjustAmount),
        reason: adjustReason
      })
      showToast(`Balance adjusted for ${selected.full_name}`, 'success')
      setAdjustAmount('')
      setAdjustReason('')
      load()
    } catch (err: any) { showToast(err?.response?.data?.detail || 'Failed', 'error') }
  }

  const handleSuspend = async (userId: string, action: 'suspend' | 'activate') => {
    try {
      await api.post(`/api/admin/users/${userId}/${action}`)
      showToast(`User ${action}d`, 'success')
      load()
    } catch (err: any) { showToast('Action failed', 'error') }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">User Management</h1>
          <p className="text-[#9CA3AF] text-sm">{total.toLocaleString()} total users</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          className="input max-w-xs" placeholder="Search email or name..." />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input max-w-[160px]" style={{ appearance: 'none' }}>
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="banned">Banned</option>
        </select>
        <button className="text-sm border border-[#2D2D50] text-[#9CA3AF] hover:text-white px-4 py-2 rounded-xl">📥 Export CSV</button>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2D2D50]">
                {['User', 'Balance', 'Total Orders', 'Total Spent', 'Joined', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left text-[#6B7280] font-semibold px-4 py-3 text-xs uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center text-[#6B7280] py-12">Loading...</td></tr>
              ) : users.map(u => (
                <tr key={u.id} className="table-row">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, #3B82F6, #7C3AED)' }}>
                        {u.full_name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-white font-medium">{u.full_name}</div>
                        <div className="text-[#6B7280] text-xs">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-green-400 font-bold">{formatCurrency(u.balance)}</td>
                  <td className="px-4 py-3 text-white">—</td>
                  <td className="px-4 py-3 text-white">—</td>
                  <td className="px-4 py-3 text-[#6B7280] text-xs">{formatDate(u.created_at)}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${u.status === 'active' ? 'bg-green-500/20 text-green-400' : u.status === 'suspended' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <Link href={`/admin/users/${u.id}`}
                        className="px-2.5 py-1.5 rounded-lg bg-[#1F1F3A] hover:bg-[#2D2D50] text-[#9CA3AF] hover:text-white text-xs transition-colors">
                        View
                      </Link>
                      <button onClick={() => setSelected(selected?.id === u.id ? null : u)}
                        className="px-2.5 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs transition-colors">
                        Adjust
                      </button>
                      <button onClick={() => handleSuspend(u.id, u.status === 'active' ? 'suspend' : 'activate')}
                        className={`px-2.5 py-1.5 rounded-lg text-xs transition-colors ${u.status === 'active' ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400' : 'bg-green-500/10 hover:bg-green-500/20 text-green-400'}`}>
                        {u.status === 'active' ? 'Suspend' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Balance adjust panel */}
      {selected && (
        <div className="card border-blue-500/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold">Adjust Balance — {selected.full_name}</h3>
            <button onClick={() => setSelected(null)} className="text-[#6B7280] hover:text-white text-xl">×</button>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-[#9CA3AF] mb-1.5">Amount (+ add / - deduct)</label>
              <input type="number" value={adjustAmount} onChange={e => setAdjustAmount(e.target.value)}
                className="input" placeholder="e.g. 10 or -5" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm text-[#9CA3AF] mb-1.5">Reason</label>
              <div className="flex gap-2">
                <input type="text" value={adjustReason} onChange={e => setAdjustReason(e.target.value)}
                  className="input" placeholder="Reason for adjustment..." />
                <button onClick={handleAdjustBalance} className="btn-primary px-4 text-sm whitespace-nowrap">Apply</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {total > 20 && (
        <div className="flex justify-center gap-2">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-4 py-2 rounded-xl bg-[#1F1F3A] border border-[#2D2D50] text-white disabled:opacity-40 text-sm">← Prev</button>
          <span className="px-4 py-2 text-[#9CA3AF] text-sm">Page {page} of {Math.ceil(total / 20)}</span>
          <button disabled={page >= Math.ceil(total / 20)} onClick={() => setPage(p => p + 1)} className="px-4 py-2 rounded-xl bg-[#1F1F3A] border border-[#2D2D50] text-white disabled:opacity-40 text-sm">Next →</button>
        </div>
      )}
    </div>
  )
}
