'use client'
import { Fragment, useEffect, useMemo, useState } from 'react'
import api from '@/lib/api'
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils'
import Link from 'next/link'

const QUICK_ACTIONS = [
  { label: 'Manage Users', href: '/admin/users', icon: '👥' },
  { label: 'View Orders', href: '/admin/orders', icon: '📦' },
  { label: 'Services', href: '/admin/services', icon: '🛠️' },
  { label: 'Settings', href: '/admin/settings', icon: '⚙️' },
]

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null)
  const [pendingPayments, setPendingPayments] = useState<any[]>([])
  const [recentUsers, setRecentUsers] = useState<any[]>([])
  const [recentTx, setRecentTx] = useState<any[]>([])
  const [providerBalances, setProviderBalances] = useState<any>({ jap: null, peakerr: null, smmwiz: null })
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [approveId, setApproveId] = useState<string | null>(null)
  const [rejectId, setRejectId] = useState<string | null>(null)
  const [adminNote, setAdminNote] = useState('')
  const [rejectNote, setRejectNote] = useState('')

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    setLoading(true)
    try {
      const [dashboardRes, pendingRes, japRes, peakerrRes, smmwizRes] = await Promise.all([
        api.get('/api/admin/dashboard'),
        api.get('/api/admin/manual-payments', { params: { status: 'pending', limit: 5 } }),
        api.get('/api/admin/provider-balance/jap').catch(() => null),
        api.get('/api/admin/provider-balance/peakerr').catch(() => null),
        api.get('/api/admin/provider-balance/smmwiz').catch(() => null),
      ])

      setStats(dashboardRes.data.stats)
      setRecentUsers(dashboardRes.data.recent_users || [])
      setRecentTx(dashboardRes.data.recent_transactions || [])
      setPendingPayments(pendingRes.data.items || [])
      setProviderBalances({
        jap: japRes?.data || null,
        peakerr: peakerrRes?.data || null,
        smmwiz: smmwizRes?.data || null,
      })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (payment: any) => {
    setActionLoading(true)
    try {
      await api.post(`/api/admin/manual-payments/${payment.id}/approve`, { admin_note: adminNote })
      setApproveId(null)
      setAdminNote('')
      setPendingPayments(prev => prev.filter(item => item.id !== payment.id))
      await loadDashboard()
      return
    } catch (err: any) {
      console.error(err)
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async (payment: any) => {
    if (!rejectNote.trim()) return
    setActionLoading(true)
    try {
      await api.post(`/api/admin/manual-payments/${payment.id}/reject`, { admin_note: rejectNote })
      setRejectId(null)
      setRejectNote('')
      setPendingPayments(prev => prev.filter(item => item.id !== payment.id))
      await loadDashboard()
      return
    } catch (err: any) {
      console.error(err)
    } finally {
      setActionLoading(false)
    }
  }

  const STAT_CARDS = useMemo(() => stats ? [
    { label: 'Total Users', value: stats.total_users?.toLocaleString(), icon: '👥', color: 'text-blue-400', sub: `+${stats.new_today} joined today` },
    { label: 'Orders Today', value: stats.orders_today?.toLocaleString(), icon: '📦', color: 'text-purple-400', sub: `${stats.pending_orders} pending` },
    { label: 'Revenue Today', value: formatCurrency(stats.revenue_today), icon: '💰', color: 'text-green-400', sub: 'Deposits received' },
    { label: 'Monthly Revenue', value: formatCurrency(stats.revenue_month), icon: '📈', color: 'text-yellow-400', sub: 'This month total' },
    { label: 'All-Time Revenue', value: formatCurrency(stats.revenue_all_time), icon: '🏆', color: 'text-pink-400', sub: 'Since launch' },
    { label: 'Pending Orders', value: stats.pending_orders?.toLocaleString(), icon: '⏳', color: 'text-orange-400', sub: 'Needs attention' },
  ] : [], [stats])

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Admin Dashboard</h1>
          <p className="text-[#9CA3AF] text-sm">Platform management tools for BOASTLIB</p>
        </div>
        <Link href="/admin/power" className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm"
          style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(217,119,6,0.2))', border: '1px solid rgba(245,158,11,0.4)', color: '#F59E0B' }}>
          ⚡ ADMIN Power
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="card h-28 animate-pulse bg-[#1F1F3A]" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {STAT_CARDS.map(card => (
            <div key={card.label} className={`card ${card.label === 'Pending Orders' && stats.pending_orders > 10 ? 'border border-red-500' : ''}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{card.icon}</span>
                <span className={`text-2xl font-black ${card.color}`}>{card.value}</span>
              </div>
              <div className="text-white font-semibold text-sm">{card.label}</div>
              <div className="text-[#6B7280] text-xs mt-1">{card.sub}</div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {QUICK_ACTIONS.map(action => (
          <Link key={action.href} href={action.href}
            className="card flex flex-col gap-3 p-4 hover:border-[#3B82F6]/50 hover:scale-[1.02] transition-all no-underline">
            <span className="text-2xl">{action.icon}</span>
            <div className="text-white text-sm font-semibold">{action.label}</div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-white font-bold">🇱🇷 Pending Manual Payments</h2>
              <p className="text-[#9CA3AF] text-sm">Review and approve submitted mobile money payments.</p>
            </div>
            <Link href="/admin/manual-payments" className="text-[#3B82F6] text-xs hover:underline">View All</Link>
          </div>

          {pendingPayments.length === 0 ? (
            <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-6 text-green-200 text-sm font-semibold">
              ✅ No pending manual payments
            </div>
          ) : (
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 px-3 py-1 text-orange-300 text-xs font-semibold">
                {pendingPayments.length} Pending
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#2D2D50] text-[#9CA3AF] text-left">
                      <th className="py-3 px-3">User</th>
                      <th className="py-3 px-3">Amount</th>
                      <th className="py-3 px-3">Network</th>
                      <th className="py-3 px-3">Phone</th>
                      <th className="py-3 px-3">Transaction ID</th>
                      <th className="py-3 px-3">Submitted</th>
                      <th className="py-3 px-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2D2D50]">
                    {pendingPayments.map(payment => (
                      <Fragment key={payment.id}>
                        <tr className="hover:bg-[#1F1F3A] transition-colors">
                          <td className="py-3 px-3">
                            <div className="text-white font-semibold">{payment.user.full_name}</div>
                            <div className="text-[#9CA3AF] text-xs">{payment.user.email}</div>
                          </td>
                          <td className="py-3 px-3 text-green-400 font-semibold">{formatCurrency(payment.amount)}</td>
                          <td className="py-3 px-3">{payment.network === 'MTN_LIBERIA' ? 'MTN Lonestar' : 'Orange Money'}</td>
                          <td className="py-3 px-3 text-[#9CA3AF] font-mono text-xs">{payment.phone_used}</td>
                          <td className="py-3 px-3 text-[#9CA3AF] font-mono text-xs">{payment.transaction_id}</td>
                          <td className="py-3 px-3 text-[#9CA3AF] text-xs">{formatDate(payment.created_at)}</td>
                          <td className="py-3 px-3">
                            <div className="flex flex-col gap-2">
                              <button onClick={() => { setApproveId(payment.id); setRejectId(null); setAdminNote('') }}
                                className="text-xs rounded-xl bg-green-500/10 text-green-300 px-3 py-2 hover:bg-green-500/20">
                                ✅ Approve
                              </button>
                              <button onClick={() => { setRejectId(payment.id); setApproveId(null); setRejectNote('') }}
                                className="text-xs rounded-xl bg-red-500/10 text-red-300 px-3 py-2 hover:bg-red-500/20">
                                ❌ Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                        {(approveId === payment.id || rejectId === payment.id) && (
                          <tr>
                            <td colSpan={7} className="bg-[#16162D] p-4">
                              <div className="space-y-3">
                                <div className="text-white font-semibold">{approveId === payment.id ? 'Confirm approval' : 'Confirm rejection'}</div>
                                <textarea
                                  value={approveId === payment.id ? adminNote : rejectNote}
                                  onChange={e => approveId === payment.id ? setAdminNote(e.target.value) : setRejectNote(e.target.value)}
                                  className="input w-full min-h-[120px]"
                                  placeholder={approveId === payment.id ? 'Optional admin note' : 'Reason for rejection (required)'}
                                />
                                <div className="flex gap-2 flex-wrap">
                                  <button onClick={() => { setApproveId(null); setRejectId(null); setAdminNote(''); setRejectNote('') }}
                                    className="px-4 py-2 border border-[#2D2D50] text-[#9CA3AF] rounded-xl hover:border-[#3B82F6] transition-all">
                                    Cancel
                                  </button>
                                  <button onClick={() => approveId === payment.id ? handleApprove(payment) : handleReject(payment)}
                                    disabled={actionLoading || (rejectId === payment.id && !rejectNote.trim())}
                                    className={`px-4 py-2 rounded-xl font-semibold ${approveId === payment.id ? 'bg-green-500 text-black' : 'bg-red-500 text-white'} ${actionLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                    {actionLoading ? 'Processing...' : approveId === payment.id ? '✅ Confirm' : '❌ Confirm Reject'}
                                  </button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-white font-bold">SMM Provider Status</h2>
              <p className="text-[#9CA3AF] text-sm">Connection and balance for integrated providers.</p>
            </div>
          </div>
          <div className="space-y-3">
            {['jap', 'peakerr', 'smmwiz'].map(provider => {
              const info = providerBalances[provider]
              const label = provider === 'jap' ? 'JustAnotherPanel' : provider === 'peakerr' ? 'Peakerr' : 'SMMWiz'
              const connected = info?.balance != null || info?.status === 'connected'
              return (
                <div key={provider} className="rounded-2xl border border-[#2D2D50] p-4 bg-[#11121F]">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-white font-semibold">{label}</div>
                      <div className="text-[#9CA3AF] text-xs">{connected ? 'Connected' : 'Not configured'}</div>
                    </div>
                    <span className={`h-3 w-3 rounded-full ${connected ? 'bg-green-400' : 'bg-red-500'}`} />
                  </div>
                  {connected && info?.balance && (
                    <div className="mt-3 text-sm text-white">Balance: {info.balance} {info.currency || 'USD'}</div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
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
