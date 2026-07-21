'use client'
import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { formatCurrency, formatDateTime } from '@/lib/utils'

const TX_TYPES = ['deposit', 'order_charge', 'admin_adjustment', 'referral_bonus', 'admin_power', 'refund']

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [typeFilter, setTypeFilter] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' })
      if (typeFilter) params.set('type', typeFilter)
      const res = await api.get(`/api/transactions?${params}`)
      setTransactions(res.data.items || [])
      setTotal(res.data.total || 0)
    } catch {} finally { setLoading(false) }
  }

  useEffect(() => { load() }, [page, typeFilter])

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      deposit: '💰', order_charge: '📦', admin_adjustment: '⚙️',
      referral_bonus: '🎁', admin_power: '⚡', refund: '↩️'
    }
    return icons[type] || '💳'
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      deposit: 'Deposit', order_charge: 'Order Charge', admin_adjustment: 'Admin Adjustment',
      referral_bonus: 'Referral Bonus', admin_power: 'Admin Power', refund: 'Refund'
    }
    return labels[type] || type
  }

  return (
    <div className="max-w-5xl mx-auto space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Transactions</h1>
          <p className="text-[#9CA3AF] text-sm">{total} total transactions</p>
        </div>
        <button className="text-sm border border-[#2D2D50] text-[#9CA3AF] hover:text-white px-4 py-2 rounded-xl transition-colors">
          📥 Export CSV
        </button>
      </div>

      {/* Type filter */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setTypeFilter('')}
          className={`badge cursor-pointer ${!typeFilter ? 'bg-blue-500/20 text-blue-400' : 'bg-[#1F1F3A] text-[#9CA3AF]'}`}>
          All
        </button>
        {TX_TYPES.map(t => (
          <button key={t} onClick={() => setTypeFilter(typeFilter === t ? '' : t)}
            className={`badge cursor-pointer transition-all ${typeFilter === t ? 'bg-blue-500/20 text-blue-400' : 'bg-[#1F1F3A] text-[#9CA3AF] hover:text-white'}`}>
            {getTypeIcon(t)} {getTypeLabel(t)}
          </button>
        ))}
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2D2D50]">
                {['Date', 'Type', 'Description', 'Amount', 'Balance After', 'Method', 'Status'].map(h => (
                  <th key={h} className="text-left text-[#6B7280] font-semibold px-4 py-3 text-xs uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center text-[#6B7280] py-12">Loading...</td></tr>
              ) : transactions.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-16">
                  <div className="text-4xl mb-3">📊</div>
                  <div className="text-[#9CA3AF]">No transactions found</div>
                </td></tr>
              ) : transactions.map((tx: any) => (
                <tr key={tx.id} className="table-row">
                  <td className="px-4 py-3 text-[#6B7280] text-xs whitespace-nowrap">{formatDateTime(tx.created_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span>{getTypeIcon(tx.type)}</span>
                      <span className="text-white text-xs">{getTypeLabel(tx.type)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#9CA3AF] text-xs max-w-[200px] truncate">{tx.description || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`font-bold ${tx.amount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {tx.amount >= 0 ? '+' : ''}{formatCurrency(Math.abs(tx.amount))}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-white">{tx.balance_after != null ? formatCurrency(tx.balance_after) : '—'}</td>
                  <td className="px-4 py-3 text-[#9CA3AF] text-xs capitalize">{tx.payment_method || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${tx.status === 'completed' ? 'bg-green-500/20 text-green-400' : tx.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {total > 20 && (
        <div className="flex justify-center gap-2">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
            className="px-4 py-2 rounded-xl bg-[#1F1F3A] border border-[#2D2D50] text-white disabled:opacity-40 hover:bg-[#2D2D50] text-sm">← Prev</button>
          <span className="px-4 py-2 text-[#9CA3AF] text-sm">Page {page}</span>
          <button disabled={page >= Math.ceil(total / 20)} onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 rounded-xl bg-[#1F1F3A] border border-[#2D2D50] text-white disabled:opacity-40 hover:bg-[#2D2D50] text-sm">Next →</button>
        </div>
      )}
    </div>
  )
}
