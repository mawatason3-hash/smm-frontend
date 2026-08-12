'use client'
import { useEffect, useState, Fragment } from 'react'
import Link from 'next/link'
import api from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { formatCurrency, formatNumber, formatDateTime } from '@/lib/utils'

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<any>(null)
  const [pendingPayments, setPendingPayments] = useState<any[]>([])
  const [recentUsers, setRecentUsers] = useState<any[]>([])
  const [recentTx, setRecentTx] = useState<any[]>([])
  const [providers, setProviders] = useState<any>({})
  const [healthStatus, setHealthStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [approveId, setApproveId] = useState<string | null>(null)
  const [rejectId, setRejectId] = useState<string | null>(null)
  const [rejectNote, setRejectNote] = useState('')
  const refreshInterval = 30000 // 30 seconds

  const loadDashboard = async () => {
    try {
      const [dashRes, wizsmmRes, morethanRes, healthRes] = await Promise.all([
        api.get('/api/admin/dashboard'),
        api.get('/api/admin/provider-balance/wizsmm').catch(() => ({ data: null })),
        api.get('/api/admin/provider-balance/morethanpanel').catch(() => ({ data: null })),
        api.get('/api/admin/health-detail').catch(() => ({ data: null })),
      ])

      const dashData = dashRes.data || {}
      setStats(dashData.stats ?? null)
      setRecentUsers(dashData.recent_users || [])
      setRecentTx(dashData.recent_transactions || [])
      
      const pendingRes = await api.get('/api/admin/manual-payments', {
        params: { status: 'pending', limit: 100 }
      }).catch(() => ({ data: { items: [] } }))
      setPendingPayments(pendingRes.data?.items || [])

      setProviders({
        wizsmm: wizsmmRes.data ?? null,
        morethanpanel: morethanRes.data ?? null,
      })

      setHealthStatus(healthRes.data ?? null)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboard()
    const interval = setInterval(loadDashboard, refreshInterval)
    return () => clearInterval(interval)
  }, [])

  const handleApprove = async (payment: any) => {
    setActionLoading(true)
    try {
      await api.post(`/api/admin/manual-payments/${payment.id}/approve`)
      setApproveId(null)
      setPendingPayments(prev => prev.filter(p => p.id !== payment.id))
      await loadDashboard()
    } catch (err) {
      console.error(err)
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async (payment: any) => {
    if (!rejectNote.trim()) return
    setActionLoading(true)
    try {
      await api.post(`/api/admin/manual-payments/${payment.id}/reject`, {
        admin_note: rejectNote
      })
      setRejectId(null)
      setRejectNote('')
      setPendingPayments(prev => prev.filter(p => p.id !== payment.id))
      await loadDashboard()
    } catch (err) {
      console.error(err)
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card h-32 animate-pulse bg-[#1F1F3A]" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* SECTION 1: ADMIN HEADER */}
      <div className="rounded-2xl p-6 text-white overflow-hidden relative" 
        style={{ background: 'linear-gradient(135deg, #2D1B69 0%, #1a1340 100%)' }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Left side */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">👑</span>
              <h1 className="text-3xl font-black">Platform Management</h1>
            </div>
            <p className="text-lg font-semibold mb-1">Welcome back, {user?.full_name}</p>
            <div className="flex items-center gap-3 text-sm text-gray-300">
              <span>Super Admin · boastlib.space</span>
              {stats && <span>Last login: {new Date().toLocaleDateString()}</span>}
            </div>
          </div>

          {/* Right side buttons */}
          <div className="flex gap-3">
            <Link href="/admin/power"
              className="px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all hover:scale-105"
              style={{ background: '#F59E0B', color: '#000' }}>
              ⚡ ADMIN Power
            </Link>
            <a href="https://boastlib.space" target="_blank" rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl font-bold text-sm border border-white/30 hover:border-white/60 transition-all">
              🌐 View Site
            </a>
          </div>
        </div>
      </div>

      {/* SECTION 2: LIVE STATS (6 CARDS) */}
      {stats && (
        <div>
          <h2 className="text-white font-bold mb-4">📊 Platform Statistics</h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Total Users */}
            <div className="card border-l-2" style={{ borderLeftColor: '#3B82F6' }}>
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">👥</span>
                <span className="text-sm bg-green-500/20 text-green-400 px-2 py-1 rounded">
                  +{stats.new_today} today
                </span>
              </div>
              <div className="text-gray-400 text-xs font-semibold uppercase mb-1">Total Users</div>
              <div className="text-white text-3xl font-black">{formatNumber(stats.total_users)}</div>
            </div>

            {/* Orders Today */}
            <div className="card border-l-2" style={{ borderLeftColor: '#A78BFA' }}>
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">📦</span>
                {stats.pending_orders > 0 && (
                  <span className="text-sm bg-orange-500/20 text-orange-400 px-2 py-1 rounded">
                    {stats.pending_orders} pending
                  </span>
                )}
              </div>
              <div className="text-gray-400 text-xs font-semibold uppercase mb-1">Orders Today</div>
              <div className="text-white text-3xl font-black">{formatNumber(stats.orders_today)}</div>
            </div>

            {/* Today Revenue */}
            <div className="card border-l-2" style={{ borderLeftColor: '#10B981' }}>
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">💰</span>
              </div>
              <div className="text-gray-400 text-xs font-semibold uppercase mb-1">Revenue Today</div>
              <div className="text-green-400 text-3xl font-black">{formatCurrency(stats.revenue_today)}</div>
              <div className="text-gray-500 text-xs mt-1">Deposits received</div>
            </div>

            {/* This Month Revenue */}
            <div className="card border-l-2" style={{ borderLeftColor: '#FBBF24' }}>
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">📈</span>
              </div>
              <div className="text-gray-400 text-xs font-semibold uppercase mb-1">This Month</div>
              <div className="text-yellow-400 text-3xl font-black">{formatCurrency(stats.revenue_month)}</div>
              <div className="text-gray-500 text-xs mt-1">Monthly total</div>
            </div>

            {/* All Time Revenue */}
            <div className="card border-l-2" style={{ borderLeftColor: '#EC4899' }}>
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">🏆</span>
              </div>
              <div className="text-gray-400 text-xs font-semibold uppercase mb-1">All Time</div>
              <div className="text-pink-400 text-3xl font-black">{formatCurrency(stats.revenue_all_time)}</div>
              <div className="text-gray-500 text-xs mt-1">Since launch</div>
            </div>

            {/* Pending Orders */}
            <div className={`card border-l-2 ${stats.pending_orders > 5 ? 'animate-pulse' : ''}`}
              style={{ borderLeftColor: '#F97316' }}>
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">⏳</span>
                {stats.pending_orders > 0 && (
                  <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold ${
                    stats.pending_orders > 5 ? 'bg-red-500 text-white animate-pulse' : 'bg-orange-500 text-white'
                  }`}>●</span>
                )}
              </div>
              <div className="text-gray-400 text-xs font-semibold uppercase mb-1">Pending Orders</div>
              <div className="text-orange-400 text-3xl font-black">{formatNumber(stats.pending_orders)}</div>
              <div className="text-gray-500 text-xs mt-1">Need processing</div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: MANAGEMENT QUICK ACTIONS */}
      <div>
        <h2 className="text-white font-bold mb-4">🛠️ Management Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Users */}
          <Link href="/admin/users"
            className="card group hover:border-blue-400/50 hover:scale-[1.02] transition-all">
            <div className="text-4xl mb-3">👥</div>
            <h3 className="text-white font-bold mb-1">Users</h3>
            <p className="text-gray-400 text-xs mb-3">Manage all accounts</p>
            <div className="text-blue-400 text-lg font-black">{formatNumber(stats?.total_users || 0)}</div>
          </Link>

          {/* Orders */}
          <Link href="/admin/orders"
            className="card group hover:border-purple-400/50 hover:scale-[1.02] transition-all">
            <div className="text-4xl mb-3">📦</div>
            <h3 className="text-white font-bold mb-1">Orders</h3>
            <p className="text-gray-400 text-xs mb-3">Monitor & process</p>
            <div className="text-purple-400 text-lg font-black">{formatNumber(stats?.orders_today || 0)} today</div>
          </Link>

          {/* Services */}
          <Link href="/admin/services"
            className="card group hover:border-cyan-400/50 hover:scale-[1.02] transition-all">
            <div className="text-4xl mb-3">🛠️</div>
            <h3 className="text-white font-bold mb-1">Services</h3>
            <p className="text-gray-400 text-xs mb-3">Sync from provider panels</p>
            <div className="text-cyan-400 text-lg font-black">Live</div>
          </Link>

          {/* Transactions */}
          <Link href="/admin/transactions"
            className="card group hover:border-green-400/50 hover:scale-[1.02] transition-all">
            <div className="text-4xl mb-3">💰</div>
            <h3 className="text-white font-bold mb-1">Payments</h3>
            <p className="text-gray-400 text-xs mb-3">All transactions</p>
            <div className="text-green-400 text-lg font-black">View all</div>
          </Link>

          {/* Manual Payments */}
          <Link href="/admin/manual-payments"
            className={`card group ${pendingPayments.length > 0 ? 'border-orange-400/50' : ''} hover:border-orange-400/50 hover:scale-[1.02] transition-all`}>
            <div className="text-4xl mb-3">🇱🇷</div>
            <h3 className="text-white font-bold mb-1">Manual Payments</h3>
            <p className="text-gray-400 text-xs mb-3">Liberia approvals</p>
            {pendingPayments.length > 0 && (
              <div className={`text-lg font-black ${pendingPayments.length > 0 ? 'text-orange-400 animate-pulse' : 'text-orange-400'}`}>
                {pendingPayments.length} pending
              </div>
            )}
          </Link>

          {/* Settings */}
          <Link href="/admin/settings"
            className="card group hover:border-yellow-400/50 hover:scale-[1.02] transition-all">
            <div className="text-4xl mb-3">⚙️</div>
            <h3 className="text-white font-bold mb-1">Settings</h3>
            <p className="text-gray-400 text-xs mb-3">Configure platform</p>
            <div className="text-yellow-400 text-lg font-black">Configure</div>
          </Link>
        </div>
      </div>

      {/* SECTION 4: SMM PROVIDER STATUS */}
      <div>
        <h2 className="text-white font-bold mb-4">🔌 Provider Connection Status</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { key: 'morethanpanel', label: 'MorethanPanel', subtitle: 'MorethanPanel API' },
            { key: 'wizsmm', label: 'WIZSMM', subtitle: 'Wizsmm Panel' }
          ].map(provider => {
            const data = providers[provider.key]
            const balance = data?.balance
            return (
              <div key={provider.key} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-white font-bold text-lg">{provider.label}</div>
                    <div className="text-gray-400 text-xs">{provider.subtitle}</div>
                  </div>
                  <span className={`h-3 w-3 rounded-full ${balance ? 'bg-green-400' : 'bg-red-500'}`} />
                </div>
                {balance ? (
                  <div>
                    <div className="text-green-400 font-semibold mb-2">🟢 Connected</div>
                    <div className="text-white text-lg font-bold mb-1">
                      ${typeof balance === 'object' ? balance.balance : balance}
                    </div>
                    <div className="text-gray-400 text-xs">Ready to fulfill orders</div>
                  </div>
                ) : (
                  <div>
                    <div className="text-red-400 font-semibold mb-2">🔴 Not Configured</div>
                    <div className="text-gray-400 text-xs mb-3">Add {provider.label.toUpperCase()} API vars to env</div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* SECTION 5: PENDING MANUAL PAYMENTS */}
      {pendingPayments.length > 0 && (
        <div className="card border-l-4 border-orange-500">
          <div className="mb-4">
            <h2 className="text-white font-bold mb-2">🇱🇷 Pending Manual Payments</h2>
            <div className="rounded-lg bg-orange-500/10 border border-orange-500/30 p-3">
              <div className="text-orange-300 text-sm font-semibold">
                ⚠️ {pendingPayments.length} payment(s) waiting for approval
              </div>
              <div className="text-orange-200 text-xs mt-1">
                Verify on your phone and credit user balance
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2D2D50] text-gray-400">
                  <th className="text-left py-2 px-3">User</th>
                  <th className="text-left py-2 px-3">Amount</th>
                  <th className="text-left py-2 px-3">Network</th>
                  <th className="text-left py-2 px-3">Phone</th>
                  <th className="text-left py-2 px-3">Txn ID</th>
                  <th className="text-left py-2 px-3">Time</th>
                  <th className="text-left py-2 px-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2D2D50]">
                {pendingPayments.map(payment => (
                  <Fragment key={payment.id}>
                    <tr className="hover:bg-[#1F1F3A]">
                      <td className="py-3 px-3">
                        <div className="text-white font-medium text-sm">{payment.user?.full_name}</div>
                        <div className="text-gray-400 text-xs">{payment.user?.email}</div>
                      </td>
                      <td className="py-3 px-3 text-green-400 font-bold">{formatCurrency(payment.amount)}</td>
                      <td className="py-3 px-3 text-gray-300">{payment.network === 'MTN_LIBERIA' ? 'MTN' : 'Orange'}</td>
                      <td className="py-3 px-3 text-gray-400 font-mono text-xs">{payment.phone_used}</td>
                      <td className="py-3 px-3 text-gray-400 font-mono text-xs">{payment.transaction_id ? `${payment.transaction_id.slice(0, 8)}...` : '—'}</td>
                      <td className="py-3 px-3 text-gray-400 text-xs">{formatDateTime(payment.created_at)}</td>
                      <td className="py-3 px-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => { setApproveId(payment.id); setRejectId(null); setRejectNote('') }}
                            className="px-3 py-1 rounded text-xs font-semibold bg-green-500/20 text-green-400 hover:bg-green-500/30">
                            ✅ Approve
                          </button>
                          <button
                            onClick={() => { setRejectId(payment.id); setApproveId(null); setRejectNote('') }}
                            className="px-3 py-1 rounded text-xs font-semibold bg-red-500/20 text-red-400 hover:bg-red-500/30">
                            ❌ Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                    {(approveId === payment.id || rejectId === payment.id) && (
                      <tr>
                        <td colSpan={7} className="bg-[#16162D] p-4">
                          <div className="space-y-3">
                            <div className="text-white font-semibold">
                              {approveId === payment.id ? '✅ Confirm Approval' : '❌ Confirm Rejection'}
                            </div>
                            {rejectId === payment.id && (
                              <textarea
                                value={rejectNote}
                                onChange={e => setRejectNote(e.target.value)}
                                className="input w-full min-h-[80px]"
                                placeholder="Reason for rejection (required)"
                              />
                            )}
                            <div className="flex gap-2">
                              <button
                                onClick={() => { setApproveId(null); setRejectId(null); setRejectNote('') }}
                                className="px-4 py-2 border border-gray-600 text-gray-300 rounded hover:border-gray-400">
                                Cancel
                              </button>
                              <button
                                onClick={() => approveId === payment.id ? handleApprove(payment) : handleReject(payment)}
                                disabled={actionLoading || (rejectId === payment.id && !rejectNote.trim())}
                                className={`px-4 py-2 rounded font-semibold ${
                                  approveId === payment.id
                                    ? 'bg-green-500 text-black hover:bg-green-600'
                                    : 'bg-red-500 text-white hover:bg-red-600'
                                } ${actionLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                {actionLoading ? 'Processing...' : approveId === payment.id ? '✅ Confirm' : '❌ Confirm'}
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

      {/* SECTION 6: RECENT ACTIVITY */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold">👥 New Registrations</h2>
            <Link href="/admin/users" className="text-blue-400 text-xs hover:underline">
              View all →
            </Link>
          </div>
          {recentUsers.length === 0 ? (
            <div className="text-gray-400 text-sm text-center py-6">No users yet</div>
          ) : (
            <div className="space-y-2">
              {recentUsers.slice(0, 8).map(u => (
                <Link key={u.id} href={`/admin/users/${u.id}`}
                  className="flex items-center gap-3 p-3 rounded-lg bg-[#1F1F3A] hover:bg-[#2D2D50] transition-colors">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #3B82F6, #7C3AED)' }}>
                    {u.full_name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-medium">{u.full_name}</div>
                    <div className="text-gray-400 text-xs">{u.email}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-green-400 text-sm font-bold">{formatCurrency(u.balance)}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold">💳 Recent Payments</h2>
            <Link href="/admin/transactions" className="text-blue-400 text-xs hover:underline">
              View all →
            </Link>
          </div>
          {recentTx.length === 0 ? (
            <div className="text-gray-400 text-sm text-center py-6">No transactions yet</div>
          ) : (
            <div className="space-y-2">
              {recentTx.slice(0, 8).map((tx: any) => (
                <div key={tx.id} className="flex items-center gap-3 p-3 rounded-lg bg-[#1F1F3A]">
                  <span className="text-lg">{tx.type === 'deposit' ? '💰' : '📤'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-medium">{tx.user_name}</div>
                    <div className="text-gray-400 text-xs">{tx.type} · {formatDateTime(tx.created_at)}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className={`font-bold text-sm ${tx.amount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {tx.amount >= 0 ? '+' : '-'}{formatCurrency(Math.abs(tx.amount))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SECTION 7: PLATFORM HEALTH */}
      <div>
        <h2 className="text-white font-bold mb-4">🏥 Platform Health</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* API Status */}
          <div className="card">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🌐</span>
              <div className="flex-1">
                <div className="text-gray-400 text-xs">API Status</div>
                <div className="text-green-400 text-sm font-bold">🟢 Operational</div>
              </div>
            </div>
          </div>

          {/* Database */}
          <div className="card">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🗄️</span>
              <div className="flex-1">
                <div className="text-gray-400 text-xs">Database</div>
                <div className={`text-sm font-bold ${
                  healthStatus?.database === 'connected' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {healthStatus?.database === 'connected' ? '🟢 Connected' : '🔴 Error'}
                </div>
              </div>
            </div>
          </div>

          {/* Pending Orders Queue */}
          <div className="card">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">📦</span>
              <div className="flex-1">
                <div className="text-gray-400 text-xs">Pending Queue</div>
                <div className="text-white text-sm font-bold">{stats?.pending_orders || 0}</div>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="card">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">⚙️</span>
              <div className="flex-1">
                <div className="text-gray-400 text-xs">System</div>
                <div className="text-green-400 text-sm font-bold">🟢 OK</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
