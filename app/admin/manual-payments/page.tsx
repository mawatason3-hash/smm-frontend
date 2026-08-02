'use client'
import { useCallback, useEffect, useState } from 'react'
import api from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { formatCurrency } from '@/lib/utils'

export default function AdminManualPaymentsPage() {
  const { user, isLoading, isAuthenticated } = useAuth()
  const { showToast } = useToast()
  const [payments, setPayments] = useState<any[]>([])
  const [status, setStatus] = useState('pending')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [counts, setCounts] = useState({ pending: 0, approved: 0, rejected: 0, all: 0 })
  const [loading, setLoading] = useState(true)
  const [approveModal, setApproveModal] = useState<any>(null)
  const [rejectModal, setRejectModal] = useState<any>(null)
  const [adminNote, setAdminNote] = useState('')
  const [rejectReason, setRejectReason] = useState('')
  const [actioning, setActioning] = useState(false)
  const [notifyLoading, setNotifyLoading] = useState(false)
  const [notifyingId, setNotifyingId] = useState<string | null>(null)

  const loadPayments = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get('/api/admin/manual-payments', {
        params: { status: status === 'all' ? 'all' : status, page, limit: 20 }
      })
      setPayments(res.data.items)
      setTotal(res.data.total)
      setCounts(res.data.counts || { pending: 0, approved: 0, rejected: 0, all: res.data.total || 0 })
    } catch (err) {
      showToast('Failed to load manual payments', 'error')
    } finally {
      setLoading(false)
    }
  }, [page, showToast, status])

  useEffect(() => {
    loadPayments()
  }, [loadPayments])

  const handleApproveClick = (payment: any) => {
    setApproveModal(payment)
    setAdminNote('')
  }

  const handleRejectClick = (payment: any) => {
    setRejectModal(payment)
    setRejectReason('')
  }

  const confirmApprove = async () => {
    if (!approveModal) return
    setActioning(true)
    try {
      await api.post(`/api/admin/manual-payments/${approveModal.id}/approve`, {
        admin_note: adminNote
      })
      showToast('✅ Payment approved and balance credited', 'success')
      setApproveModal(null)
      loadPayments()
    } catch (err: any) {
      showToast(err?.response?.data?.detail || 'Failed to approve payment', 'error')
    } finally {
      setActioning(false)
    }
  }

  const confirmReject = async () => {
    if (!rejectModal || !rejectReason) {
      showToast('Please provide a rejection reason', 'error')
      return
    }
    setActioning(true)
    try {
      await api.post(`/api/admin/manual-payments/${rejectModal.id}/reject`, {
        admin_note: rejectReason
      })
      showToast('❌ Payment rejected', 'success')
      setRejectModal(null)
      loadPayments()
    } catch (err: any) {
      showToast(err?.response?.data?.detail || 'Failed to reject payment', 'error')
    } finally {
      setActioning(false)
    }
  }

  const notifyPayment = async (payment: any) => {
    setNotifyingId(payment.id)
    try {
      await api.post(`/api/admin/manual-payments/${payment.id}/notify`)
      showToast('💬 Notification sent to support', 'success')
    } catch (err: any) {
      showToast(err?.response?.data?.detail || 'Failed to send notification', 'error')
    } finally {
      setNotifyingId(null)
    }
  }

  const statsData = [
    {
      label: 'Pending',
      value: counts.pending,
      color: 'yellow',
      icon: '⏳'
    },
    {
      label: 'Approved',
      value: counts.approved,
      color: 'green',
      icon: '✅'
    },
    {
      label: 'Rejected',
      value: counts.rejected,
      color: 'red',
      icon: '❌'
    }
  ]

  if (isLoading) return <div className="p-6 text-[#9CA3AF]">Loading...</div>
  if (!isAuthenticated || !['admin', 'super_admin'].includes(user?.role || '')) return null

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-white">🇱🇷 Manual Mobile Money Payments</h1>
        <p className="text-[#9CA3AF] text-sm mt-1">Liberia MTN Lonestar & Orange Money</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {statsData.map((stat, i) => (
          <div key={i} className="card">
            <div className="text-[#9CA3AF] text-xs font-semibold mb-1">{stat.label}</div>
            <div className="flex items-center gap-2">
              <div className="text-2xl">{stat.icon}</div>
              <div className={`text-2xl font-black ${
                stat.color === 'yellow' ? 'text-yellow-400' :
                stat.color === 'green' ? 'text-green-400' :
                'text-red-400'
              }`}>{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="flex gap-2 mb-4 flex-wrap">
          {['All', 'Pending', 'Approved', 'Rejected'].map(s => (
            <button key={s} onClick={() => { setStatus(s.toLowerCase()); setPage(1) }}
              className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all
                ${(s.toLowerCase() === status || (s === 'All' && status === 'all'))
                  ? 'bg-[#3B82F6] text-white'
                  : 'border border-[#2D2D50] text-[#9CA3AF] hover:border-[#3B82F6]'}`}>
              {s}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-8 text-[#9CA3AF]">Loading payments...</div>
        ) : payments.length === 0 ? (
          <div className="text-center py-8 text-[#9CA3AF]">No payments found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2D2D50] text-[#9CA3AF]">
                  <th className="text-left py-3 px-3 font-semibold">User</th>
                  <th className="text-left py-3 px-3 font-semibold">Country</th>
                  <th className="text-right py-3 px-3 font-semibold">Amount</th>
                  <th className="text-left py-3 px-3 font-semibold">Network</th>
                  <th className="text-left py-3 px-3 font-semibold">Phone</th>
                  <th className="text-left py-3 px-3 font-semibold">Tx ID</th>
                  <th className="text-left py-3 px-3 font-semibold">Note</th>
                  <th className="text-left py-3 px-3 font-semibold">Submitted</th>
                  <th className="text-left py-3 px-3 font-semibold">Status</th>
                  <th className="text-center py-3 px-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(payment => (
                  <tr key={payment.id} className="border-b border-[#2D2D50] hover:bg-[#1F1F3A] transition-colors">
                    <td className="py-3 px-3">
                      <div className="text-white font-semibold">{payment.user.full_name}</div>
                      <div className="text-[#9CA3AF] text-xs">{payment.user.email}</div>
                    </td>
                    <td className="py-3 px-3 text-white">{payment.user.country || 'Unknown'}</td>
                    <td className="py-3 px-3 text-right text-green-400 font-bold">{formatCurrency(payment.amount)}</td>
                    <td className="py-3 px-3 text-white">{payment.network === 'MTN_LIBERIA' ? 'MTN' : payment.network === 'ORANGE_LIBERIA' ? 'Orange' : payment.network || 'Other'}</td>
                    <td className="py-3 px-3 text-[#9CA3AF] font-mono text-xs">{payment.phone_used}</td>
                    <td className="py-3 px-3 text-[#9CA3AF] font-mono text-xs">{payment.transaction_id}</td>
                    <td className="py-3 px-3 text-[#9CA3AF] text-xs max-w-xs truncate">{payment.proof_note || '—'}</td>
                    <td className="py-3 px-3 text-[#9CA3AF] text-xs">{new Date(payment.created_at).toLocaleDateString()}</td>
                    <td className="py-3 px-3">
                      {payment.status === 'pending' && <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs font-semibold">⏳ Pending</span>}
                      {payment.status === 'approved' && <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-semibold">✅ Approved</span>}
                      {payment.status === 'rejected' && <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs font-semibold">❌ Rejected</span>}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {payment.status === 'pending' && (
                        <div className="flex gap-2 justify-center flex-wrap">
                          <button onClick={() => handleApproveClick(payment)}
                            className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-semibold hover:bg-green-500/30">
                            ✓
                          </button>
                          <button onClick={() => handleRejectClick(payment)}
                            className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs font-semibold hover:bg-red-500/30">
                            ✕
                          </button>
                          <button onClick={() => notifyPayment(payment)}
                            disabled={notifyingId === payment.id}
                            className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-semibold hover:bg-blue-500/30 disabled:opacity-50">
                            {notifyingId === payment.id ? 'Sending…' : 'Notify'}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {total > 20 && (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-[#9CA3AF] text-sm">
              Showing {(page - 1) * 20 + 1} - {Math.min(page * 20, total)} of {total}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1 border border-[#2D2D50] text-[#9CA3AF] rounded disabled:opacity-50">
                ← Prev
              </button>
              <div className="px-3 py-1 text-white">{page}</div>
              <button onClick={() => setPage(p => p + 1)} disabled={page * 20 >= total}
                className="px-3 py-1 border border-[#2D2D50] text-[#9CA3AF] rounded disabled:opacity-50">
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {approveModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="card max-w-sm space-y-4 animate-fade-in">
            <h2 className="text-white font-bold text-lg">Approve Payment?</h2>
            <div className="bg-[#1F1F3A] p-3 rounded-xl space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#9CA3AF]">Amount</span>
                <span className="text-white font-bold">{formatCurrency(approveModal.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9CA3AF]">User</span>
                <span className="text-white font-bold">{approveModal.user.full_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9CA3AF]">Network</span>
                <span className="text-white font-bold">{approveModal.network === 'MTN_LIBERIA' ? 'MTN' : 'Orange'}</span>
              </div>
            </div>

            <div>
              <label className="text-white text-xs font-semibold">Payment instructions / note to user (optional)</label>
              <textarea value={adminNote} onChange={e => setAdminNote(e.target.value)}
                className="input mt-1 text-sm" placeholder="E.g., Send to 0555166954 or use Orange Money in your country..." rows={2} />
            </div>

            <div className="flex gap-2">
              <button onClick={() => setApproveModal(null)} disabled={actioning}
                className="flex-1 px-4 py-2 border border-[#2D2D50] text-[#9CA3AF] rounded-xl hover:border-[#3B82F6] transition-all">
                Cancel
              </button>
              <button onClick={confirmApprove} disabled={actioning}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-all disabled:opacity-50">
                {actioning ? 'Approving...' : 'Confirm Approve'}
              </button>
            </div>
          </div>
        </div>
      )}

      {rejectModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="card max-w-sm space-y-4 animate-fade-in">
            <h2 className="text-white font-bold text-lg">Reject Payment?</h2>
            <div className="bg-[#1F1F3A] p-3 rounded-xl space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#9CA3AF]">Amount</span>
                <span className="text-white font-bold">{formatCurrency(rejectModal.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9CA3AF]">User</span>
                <span className="text-white font-bold">{rejectModal.user.full_name}</span>
              </div>
            </div>

            <div>
              <label className="text-white text-xs font-semibold">Rejection reason (required)</label>
              <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)}
                className="input mt-1 text-sm" placeholder="E.g., Transaction ID not found..." rows={2} />
            </div>

            <div className="flex gap-2">
              <button onClick={() => setRejectModal(null)} disabled={actioning}
                className="flex-1 px-4 py-2 border border-[#2D2D50] text-[#9CA3AF] rounded-xl hover:border-[#3B82F6] transition-all">
                Cancel
              </button>
              <button onClick={confirmReject} disabled={actioning || !rejectReason}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-all disabled:opacity-50">
                {actioning ? 'Rejecting...' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
