'use client'
import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { formatCurrency, formatDateTime } from '@/lib/utils'

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: '25' })
      if (typeFilter) params.set('type', typeFilter)
      if (statusFilter) params.set('status', statusFilter)
      const res = await api.get(`/api/admin/transactions?${params}`)
      setTransactions(res.data.items || [])
      setTotal(res.data.total || 0)
    } catch {} finally { setLoading(false) }
  }

  useEffect(() => { load() }, [page, typeFilter, statusFilter])

  return (
    <div className="max-w-7xl mx-auto space-y-5 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-white">Transactions</h1>
        <p className="text-[#9CA3AF] text-sm">{total.toLocaleString()} total transactions</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="input max-w-[200px]" style={{ appearance: 'none' }}>
          <option value="">All Types</option>
          <option value="deposit">Deposits</option>
          <option value="order_charge">Order Charges</option>
          <option value="admin_adjustment">Admin Adjustments</option>
          <option value="referral_bonus">Referral Bonuses</option>
          <option value="admin_power">Admin Power</option>
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input max-w-[160px]" style={{ appearance: 'none' }}>
          <option value="">All Statuses</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
        <button className="text-sm border border-[#2D2D50] text-[#9CA3AF] hover:text-white px-4 py-2 rounded-xl">📥 Export CSV</button>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2D2D50]">
                {['Date', 'User', 'Type', 'Amount', 'Method', 'Status', 'Description'].map(h => (
                  <th key={h} className="text-left text-[#6B7280] font-semibold px-4 py-3 text-xs uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center text-[#6B7280] py-12">Loading...</td></tr>
              ) : transactions.map(tx => (
                <tr key={tx.id} className="table-row">
                  <td className="px-4 py-3 text-[#6B7280] text-xs whitespace-nowrap">{formatDateTime(tx.created_at)}</td>
                  <td className="px-4 py-3">
                    <div className="text-white text-sm font-medium">{tx.user_name}</div>
                    <div className="text-[#6B7280] text-xs">{tx.user_email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="badge bg-purple-500/20 text-purple-400 text-xs capitalize">{tx.type?.replace('_', ' ')}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-bold ${tx.amount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {tx.amount >= 0 ? '+' : ''}{formatCurrency(Math.abs(tx.amount))}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#9CA3AF] text-xs capitalize">{tx.payment_method || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${tx.status === 'completed' ? 'bg-green-500/20 text-green-400' : tx.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#9CA3AF] text-xs max-w-[200px] truncate">{tx.description || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {total > 25 && (
        <div className="flex justify-center gap-2">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-4 py-2 rounded-xl bg-[#1F1F3A] border border-[#2D2D50] text-white disabled:opacity-40 text-sm">← Prev</button>
          <span className="px-4 py-2 text-[#9CA3AF] text-sm">Page {page}</span>
          <button disabled={page >= Math.ceil(total / 25)} onClick={() => setPage(p => p + 1)} className="px-4 py-2 rounded-xl bg-[#1F1F3A] border border-[#2D2D50] text-white disabled:opacity-40 text-sm">Next →</button>
        </div>
      )}
    </div>
  )
}
