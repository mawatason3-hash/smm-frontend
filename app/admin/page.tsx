'use client'
import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import Link from 'next/link'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null)
  const [recentUsers, setRecentUsers] = useState<any[]>([])
  const [recentTx, setRecentTx] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/admin/dashboard').then(res => {
      setStats(res.data.stats)
      setRecentUsers(res.data.recent_users || [])
      setRecentTx(res.data.recent_transactions || [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const STAT_CARDS = stats ? [
    { label: 'Total Users', value: stats.total_users?.toLocaleString(), icon: '👥', color: 'text-blue-400', sub: `+${stats.new_today} today` },
    { label: 'Orders Today', value: stats.orders_today?.toLocaleString(), icon: '📦', color: 'text-purple-400', sub: `${stats.pending_orders} pending` },
    { label: 'Revenue Today', value: formatCurrency(stats.revenue_today), icon: '💰', color: 'text-green-400', sub: 'Deposits' },
    { label: 'Monthly Revenue', value: formatCurrency(stats.revenue_month), icon: '📈', color: 'text-yellow-400', sub: 'This month' },
    { label: 'All-Time Revenue', value: formatCurrency(stats.revenue_all_time), icon: '🏆', color: 'text-pink-400', sub: 'Total earned' },
    { label: 'Pending Orders', value: stats.pending_orders?.toLocaleString(), icon: '⏳', color: 'text-orange-400', sub: 'Needs attention' },
  ] : []

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Admin Dashboard</h1>
          <p className="text-[#9CA3AF] text-sm">Platform overview and analytics</p>
        </div>
        <Link href="/admin/power" className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm"
          style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(217,119,6,0.2))', border: '1px solid rgba(245,158,11,0.4)', color: '#F59E0B' }}>
          ⚡ ADMIN Power
        </Link>
      </div>

      {/* Stats grid */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="card h-24 animate-pulse bg-[#1F1F3A]" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {STAT_CARDS.map(card => (
            <div key={card.label} className="card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{card.icon}</span>
                <span className={`text-2xl font-black ${card.color}`}>{card.value}</span>
              </div>
              <div className="text-white font-semibold text-sm">{card.label}</div>
              <div className="text-[#6B7280] text-xs mt-0.5">{card.sub}</div>
            </div>
          ))}
        </div>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Manage Users', href: '/admin/users', icon: '👥' },
          { label: 'View Orders', href: '/admin/orders', icon: '📦' },
          { label: 'Manage Services', href: '/admin/services', icon: '🛠️' },
          { label: 'Site Settings', href: '/admin/settings', icon: '⚙️' },
        ].map(action => (
          <Link key={action.label} href={action.href}
            className="card flex items-center gap-3 hover:border-[#3B82F6]/50 hover:scale-[1.02] transition-all no-underline">
            <span className="text-xl">{action.icon}</span>
            <span className="text-white text-sm font-medium">{action.label}</span>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent users */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold">Recent Users</h2>
            <Link href="/admin/users" className="text-[#3B82F6] text-xs hover:underline">View all →</Link>
          </div>
          {recentUsers.length === 0 ? (
            <div className="text-[#6B7280] text-sm text-center py-6">No users yet</div>
          ) : (
            <div className="space-y-2">
              {recentUsers.map(u => (
                <Link key={u.id} href={`/admin/users/${u.id}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-[#1F1F3A] hover:bg-[#2D2D50] transition-colors no-underline block">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #3B82F6, #7C3AED)' }}>
                    {u.full_name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-medium truncate">{u.full_name}</div>
                    <div className="text-[#6B7280] text-xs truncate">{u.email}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-green-400 text-sm font-bold">{formatCurrency(u.balance)}</div>
                    <span className={`badge text-xs ${u.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{u.status}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent transactions */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold">Recent Transactions</h2>
            <Link href="/admin/transactions" className="text-[#3B82F6] text-xs hover:underline">View all →</Link>
          </div>
          {recentTx.length === 0 ? (
            <div className="text-[#6B7280] text-sm text-center py-6">No transactions yet</div>
          ) : (
            <div className="space-y-2">
              {recentTx.map((tx: any) => (
                <div key={tx.id} className="flex items-center gap-3 p-3 rounded-xl bg-[#1F1F3A]">
                  <span className="text-lg">{tx.amount >= 0 ? '💰' : '📤'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-medium truncate">{tx.user_name}</div>
                    <div className="text-[#6B7280] text-xs">{tx.type} · {formatDateTime(tx.created_at)}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className={`font-bold text-sm ${tx.amount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {tx.amount >= 0 ? '+' : ''}{formatCurrency(Math.abs(tx.amount))}
                    </div>
                    <span className={`badge text-xs ${tx.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{tx.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
