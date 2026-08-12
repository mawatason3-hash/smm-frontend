'use client'

import { useCallback, useEffect, useState } from 'react'
import api from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { formatCurrency } from '@/lib/utils'

export default function AdminGiveawaySubmissionsPage() {
  const { user, isLoading, isAuthenticated } = useAuth()
  const { showToast } = useToast()
  const [submissions, setSubmissions] = useState<any[]>([])
  const [status, setStatus] = useState('pending')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [counts, setCounts] = useState({ pending: 0, approved: 0, rejected: 0, all: 0 })
  const [loading, setLoading] = useState(true)
  const [approveModal, setApproveModal] = useState<any>(null)
  const [rejectModal, setRejectModal] = useState<any>(null)
  const [rewardAmount, setRewardAmount] = useState(1)
  const [adminNote, setAdminNote] = useState('')
  const [rejectReason, setRejectReason] = useState('')
  const [actioning, setActioning] = useState(false)

  const loadSubmissions = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get('/api/admin/giveaway-submissions', {
        params: { status: status === 'all' ? undefined : status, page, limit: 20 }
      })
      setSubmissions(res.data.items || [])
      setTotal(res.data.total || 0)
      setCounts(res.data.counts || { pending: 0, approved: 0, rejected: 0, all: 0 })
    } catch (err) {
      showToast('Failed to load giveaway submissions', 'error')
    } finally {
      setLoading(false)
    }
  }, [page, showToast, status])

  useEffect(() => {
    loadSubmissions()
  }, [loadSubmissions])

  const openApproveModal = (submission: any) => {
    setApproveModal(submission)
    setRewardAmount(1)
    setAdminNote('')
  }

  const openRejectModal = (submission: any) => {
    setRejectModal(submission)
    setRejectReason('')
  }

  const confirmApprove = async () => {
    if (!approveModal) return
    if (rewardAmount <= 0) {
      showToast('Reward amount must be greater than zero', 'error')
      return
    }

    setActioning(true)
    try {
      await api.post(`/api/admin/giveaway-submissions/${approveModal.id}/approve`, {
        amount: rewardAmount,
        admin_note: adminNote || undefined,
      })
      showToast('Giveaway submission approved', 'success')
      setApproveModal(null)
      loadSubmissions()
    } catch (err: any) {
      showToast(err?.response?.data?.detail || 'Failed to approve submission', 'error')
    } finally {
      setActioning(false)
    }
  }

  const confirmReject = async () => {
    if (!rejectModal) return
    if (!rejectReason.trim()) {
      showToast('Please provide a reason for rejection', 'error')
      return
    }

    setActioning(true)
    try {
      await api.post(`/api/admin/giveaway-submissions/${rejectModal.id}/reject`, {
        admin_note: rejectReason.trim(),
      })
      showToast('Giveaway submission rejected', 'success')
      setRejectModal(null)
      loadSubmissions()
    } catch (err: any) {
      showToast(err?.response?.data?.detail || 'Failed to reject submission', 'error')
    } finally {
      setActioning(false)
    }
  }

  if (isLoading) return <div className="p-6 text-[#9CA3AF]">Loading...</div>
  if (!isAuthenticated || !['admin', 'super_admin'].includes(user?.role || '')) return null

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-white">🎁 Giveaway Submissions</h1>
        <p className="text-[#9CA3AF] text-sm mt-1">Review proof links and approve or reject reward submissions.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        {['All', 'Pending', 'Approved', 'Rejected'].map((option) => (
          <button
            key={option}
            onClick={() => { setStatus(option.toLowerCase()); setPage(1) }}
            className={`rounded-2xl px-4 py-3 text-sm font-semibold transition-all ${
              status === option.toLowerCase() ? 'bg-[#3B82F6] text-white' : 'border border-[#2D2D50] text-[#9CA3AF] hover:border-[#3B82F6]'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card p-5">
          <div className="text-sm text-[#9CA3AF] uppercase tracking-[0.3em] font-semibold mb-2">Counts</div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-white"><span>Pending</span><span>{counts.pending}</span></div>
            <div className="flex justify-between text-emerald-400"><span>Approved</span><span>{counts.approved}</span></div>
            <div className="flex justify-between text-red-400"><span>Rejected</span><span>{counts.rejected}</span></div>
            <div className="flex justify-between text-[#9CA3AF]"><span>Total</span><span>{counts.all}</span></div>
          </div>
        </div>
        <div className="card p-5 lg:col-span-2">
          <div className="text-sm text-[#9CA3AF] uppercase tracking-[0.3em] font-semibold mb-2">Instructions</div>
          <p className="text-sm text-[#D1D5DB]">Approve submissions by reviewing the public proof URL and reward the user the agreed amount. Rejected submissions should include a clear reason.</p>
        </div>
      </div>

      <div className="card overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2D2D50] text-[#9CA3AF]">
              <th className="px-3 py-4 text-left">User</th>
              <th className="px-3 py-4 text-left">Giveaway</th>
              <th className="px-3 py-4 text-left">Proof URL</th>
              <th className="px-3 py-4 text-left">Details</th>
              <th className="px-3 py-4 text-left">Status</th>
              <th className="px-3 py-4 text-left">Submitted</th>
              <th className="px-3 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {submissions.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-[#9CA3AF]">No submissions found</td>
              </tr>
            ) : submissions.map((submission) => (
              <tr key={submission.id} className="border-b border-[#2D2D50] hover:bg-[#1F1F3A] transition-colors">
                <td className="px-3 py-4">
                  <div className="text-white font-semibold">{submission.user.full_name}</div>
                  <div className="text-[#9CA3AF] text-xs">{submission.user.email}</div>
                </td>
                <td className="px-3 py-4 text-white">{submission.giveaway_type}</td>
                <td className="px-3 py-4">
                  <a href={submission.proof_url} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline break-all">View proof</a>
                </td>
                <td className="px-3 py-4 text-[#9CA3AF] max-w-xs truncate">{submission.details || '—'}</td>
                <td className="px-3 py-4">
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
                    submission.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                    submission.status === 'approved' ? 'bg-green-500/20 text-green-300' :
                    'bg-red-500/20 text-red-300'
                  }`}>
                    {submission.status}
                  </span>
                </td>
                <td className="px-3 py-4 text-[#9CA3AF]">{new Date(submission.created_at).toLocaleString()}</td>
                <td className="px-3 py-4 text-center">
                  {submission.status === 'pending' ? (
                    <div className="flex flex-wrap justify-center gap-2">
                      <button
                        onClick={() => openApproveModal(submission)}
                        className="rounded-2xl bg-emerald-500/15 px-3 py-2 text-emerald-300 text-xs font-semibold hover:bg-emerald-500/25"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => openRejectModal(submission)}
                        className="rounded-2xl bg-red-500/15 px-3 py-2 text-red-300 text-xs font-semibold hover:bg-red-500/25"
                      >
                        Reject
                      </button>
                    </div>
                  ) : submission.status === 'approved' ? (
                    <div className="text-green-300 text-xs">Approved</div>
                  ) : (
                    <div className="text-red-300 text-xs">Rejected</div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-[#9CA3AF] text-sm">
        <div>Showing {Math.min((page - 1) * 20 + 1, total)} – {Math.min(page * 20, total)} of {total}</div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="rounded-2xl border border-[#2D2D50] px-3 py-2 disabled:opacity-50"
          >
            Prev
          </button>
          <span className="font-semibold">{page}</span>
          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={page * 20 >= total}
            className="rounded-2xl border border-[#2D2D50] px-3 py-2 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {approveModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl border border-[#2D2D50] bg-[#111827] p-6">
            <h2 className="text-xl font-bold text-white">Approve Giveaway Submission</h2>
            <p className="text-[#9CA3AF] text-sm mt-2">Reward this submission and optionally add a note for the user.</p>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm text-white font-semibold">Reward amount ($)</label>
                <input
                  type="number"
                  min={1}
                  step="0.01"
                  value={rewardAmount}
                  onChange={(event) => setRewardAmount(Number(event.target.value))}
                  className="mt-2 w-full rounded-2xl border border-[#2D2D50] bg-[#0F172A] p-3 text-white outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-white font-semibold">Admin note</label>
                <textarea
                  value={adminNote}
                  onChange={(event) => setAdminNote(event.target.value)}
                  rows={3}
                  className="mt-2 w-full rounded-2xl border border-[#2D2D50] bg-[#0F172A] p-3 text-white outline-none"
                  placeholder="Optional note for audit logs"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => setApproveModal(null)}
                className="rounded-2xl border border-[#2D2D50] px-4 py-3 text-sm text-[#9CA3AF] hover:border-white"
                disabled={actioning}
              >
                Cancel
              </button>
              <button
                onClick={confirmApprove}
                className="rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-400 disabled:opacity-50"
                disabled={actioning}
              >
                {actioning ? 'Approving…' : 'Approve submission'}
              </button>
            </div>
          </div>
        </div>
      )}

      {rejectModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl border border-[#2D2D50] bg-[#111827] p-6">
            <h2 className="text-xl font-bold text-white">Reject Giveaway Submission</h2>
            <p className="text-[#9CA3AF] text-sm mt-2">Please provide the reason why this submission is rejected.</p>

            <div className="mt-4">
              <label className="block text-sm text-white font-semibold">Rejection reason</label>
              <textarea
                value={rejectReason}
                onChange={(event) => setRejectReason(event.target.value)}
                rows={4}
                className="mt-2 w-full rounded-2xl border border-[#2D2D50] bg-[#0F172A] p-3 text-white outline-none"
                placeholder="Give a short reason for the user"
              />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => setRejectModal(null)}
                className="rounded-2xl border border-[#2D2D50] px-4 py-3 text-sm text-[#9CA3AF] hover:border-white"
                disabled={actioning}
              >
                Cancel
              </button>
              <button
                onClick={confirmReject}
                className="rounded-2xl bg-red-500 px-4 py-3 text-sm font-semibold text-white hover:bg-red-400 disabled:opacity-50"
                disabled={actioning}
              >
                {actioning ? 'Rejecting…' : 'Reject submission'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
