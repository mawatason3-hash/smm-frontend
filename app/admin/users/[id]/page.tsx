'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import api from '@/lib/api'
import { useToast } from '@/contexts/ToastContext'
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils'
import { STATUS_CONFIG } from '@/types'
import Link from 'next/link'

export default function AdminUserDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { showToast } = useToast()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [adjustAmount, setAdjustAmount] = useState('')
  const [adjustReason, setAdjustReason] = useState('')
  const [saving, setSaving] = useState(false)

  const load = async () => {
    try {
      const res = await api.get(`/api/admin/users/${id}`)
      setData(res.data)
    } catch { router.push('/admin/users') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [id])

  const handleAdjust = async () => {
    if (!adjustAmount || !adjustReason) { showToast('Fill amount and reason', 'error'); return }
    setSaving(true)
    try {
      await api.post('/api/payments/admin/adjust-balance', {
        user_id: id,
        amount: parseFloat(adjustAmount),
        reason: adjustReason
      })
      showToast('Balance adjusted', 'success')
      setAdjustAmount('')
      setAdjustReason('')
      load()
    } catch (err: any) { showToast(err?.response?.data?.detail || 'Failed', 'error') }
    finally { setSaving(false) }
  }

  const handleStatusChange = async (action: string) => {
    try {
      await api.post(`/api/admin/users/${id}/${action}`)
      showToast(`User ${action}d`, 'success')
      load()
    } catch { showToast('Action failed', 'error') }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this user permanently?')) return
    try {
      await api.delete(`/api/admin/users/${id}`)
      showToast('User deleted', 'success')
      router.push('/admin/users')
    } catch (err: any) {
      showToast(err?.response?.data?.detail || 'Delete failed', 'error')
    }
  }

  if (loading) return <div className="text-[#6B7280] text-center py-20">Loading user...</div>
  if (!data) return null

  const { user, stats, recent_orders, recent_transactions } = data

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Link href="/admin/users" className="text-[#9CA3AF] hover:text-white text-sm">← Back to Users</Link>
      </div>

      {/* Profile card */}
      <div className="card">
        <div className="flex items-start gap-5 flex-wrap">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-2xl flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #3B82F6, #7C3AED)' }}>
            {user.full_name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-black text-white">{user.full_name}</h1>
              <span className={`badge ${user.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{user.status}</span>
              <span className={`badge ${user.role === 'super_admin' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'}`}>{user.role}</span>
            </div>
            <div className="text-[#9CA3AF] text-sm mt-1">{user.email}</div>
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-[#6B7280]">
              {user.phone && <span>📱 {user.phone}</span>}
              {user.country && <span>🌍 {user.country}</span>}
              <span>Joined {formatDate(user.created_at)}</span>
              {user.last_login_at && <span>Last login {formatDate(user.last_login_at)}</span>}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {user.status === 'active'
              ? <button onClick={() => handleStatusChange('suspend')} className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 text-sm transition-colors">Suspend User</button>
              : <button onClick={() => handleStatusChange('activate')} className="px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 text-sm transition-colors">Activate User</button>
            }
            <button onClick={handleDelete} className="px-4 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 text-white text-sm transition-colors">Delete User</button>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="card text-center">
          <div className="text-3xl font-black text-green-400">{formatCurrency(user.balance)}</div>
          <div className="text-[#9CA3AF] text-sm mt-1">Current Balance</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-black text-blue-400">{stats.total_orders}</div>
          <div className="text-[#9CA3AF] text-sm mt-1">Total Orders</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-black gradient-text">{formatCurrency(stats.total_spent)}</div>
          <div className="text-[#9CA3AF] text-sm mt-1">Total Deposited</div>
        </div>
      </div>

      {/* Balance adjustment */}
      <div className="card border-blue-500/30">
        <h2 className="text-white font-bold mb-4">💰 Adjust Balance</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-[#9CA3AF] mb-1.5">Amount (+ add / - deduct)</label>
            <input type="number" value={adjustAmount} onChange={e => setAdjustAmount(e.target.value)}
              className="input" placeholder="e.g. 10 or -5" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs text-[#9CA3AF] mb-1.5">Reason *</label>
            <div className="flex gap-2">
              <input type="text" value={adjustReason} onChange={e => setAdjustReason(e.target.value)}
                className="input" placeholder="Reason for adjustment..." />
              <button onClick={handleAdjust} disabled={saving} className="btn-primary px-5 text-sm whitespace-nowrap">
                {saving ? '...' : 'Apply'}
              </button>
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          {[5, 10, 25, 50].map(amt => (
            <button key={amt} onClick={() => setAdjustAmount(String(amt))}
              className="px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs hover:bg-green-500/20 transition-colors">
              +${amt}
            </button>
          ))}
          {[-5, -10].map(amt => (
            <button key={amt} onClick={() => setAdjustAmount(String(amt))}
              className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs hover:bg-red-500/20 transition-colors">
              {amt}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent orders */}
        <div className="card">
          <h2 className="text-white font-bold mb-4">Recent Orders</h2>
          {recent_orders.length === 0 ? (
            <div className="text-[#6B7280] text-sm text-center py-6">No orders yet</div>
          ) : (
            <div className="space-y-2">
              {recent_orders.map((order: any) => (
                <div key={order.order_number} className="flex items-center gap-3 p-3 rounded-xl bg-[#1F1F3A]">
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-medium truncate">#{order.order_number} — {order.service}</div>
                    <div className="text-[#6B7280] text-xs">{formatDate(order.created_at)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-white text-sm font-bold">{formatCurrency(order.charge)}</div>
                    <span className={`badge text-xs ${STATUS_CONFIG[order.status]?.color || ''}`}>
                      {STATUS_CONFIG[order.status]?.label || order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent transactions */}
        <div className="card">
          <h2 className="text-white font-bold mb-4">Recent Transactions</h2>
          {recent_transactions.length === 0 ? (
            <div className="text-[#6B7280] text-sm text-center py-6">No transactions yet</div>
          ) : (
            <div className="space-y-2">
              {recent_transactions.map((tx: any) => (
                <div key={tx.id} className="flex items-center gap-3 p-3 rounded-xl bg-[#1F1F3A]">
                  <span className="text-lg">{tx.amount >= 0 ? '💰' : '📤'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm truncate">{tx.description || tx.type}</div>
                    <div className="text-[#6B7280] text-xs">{formatDateTime(tx.created_at)}</div>
                  </div>
                  <span className={`font-bold text-sm ${tx.amount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {tx.amount >= 0 ? '+' : ''}{formatCurrency(Math.abs(tx.amount))}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
