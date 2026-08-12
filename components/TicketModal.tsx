 'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { formatCurrency } from '@/lib/utils'
import { useToast } from '@/contexts/ToastContext'

const ISSUE_TYPES = [
  'Refund Request (Service Not Delivered)',
  'Refund Request (Partial Delivery)',
  'Wrong Service Delivered',
  'Technical Issue / Error',
  'Other',
]

type OrderSummary = {
  id: string
  order_number: number
  service_name: string
  quantity: number
  charge: number
}

type TicketModalProps = {
  order: OrderSummary
  onClose: () => void
  onTicketCreated: () => void
}

export default function TicketModal({ order, onClose, onTicketCreated }: TicketModalProps) {
  const { showToast } = useToast()
  const [issueType, setIssueType] = useState(ISSUE_TYPES[0])
  const [description, setDescription] = useState('')
  const [attachment, setAttachment] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const handleSubmit = async () => {
    if (description.trim().length < 10) {
      showToast('Please describe the issue in at least 10 characters.', 'warning')
      return
    }

    setSubmitting(true)
    let attachmentUrl: string | undefined

    try {
      if (attachment) {
        const formData = new FormData()
        formData.append('file', attachment)
        const uploadRes = await api.post('/api/tickets/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        attachmentUrl = uploadRes.data.url
      }

      const res = await api.post('/api/tickets', {
        order_id: order.id,
        issue_type: issueType,
        description,
        attachment_url: attachmentUrl,
      })

      onTicketCreated()
      showToast(`Ticket submitted (${res.data.id}). Support will follow up.`, 'success')
    } catch (err: any) {
      console.error(err)
      alert(err?.response?.data?.detail || 'Failed to submit ticket')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-2xl rounded-3xl border border-[#2D2D50] bg-[#0B0B16] p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <h2 className="text-xl font-bold text-white">Report Issue / Request Refund</h2>
            <p className="text-slate-400 text-sm mt-1">Submit a ticket for order #{order.order_number} and our support team will follow up.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl">×</button>
        </div>

        <div className="rounded-3xl bg-[#111827] border border-[#2D2D50] p-4 mb-6">
          <div className="flex flex-wrap gap-4 text-sm text-slate-400">
            <div className="space-y-1">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Service</div>
              <div className="text-white font-semibold">{order.service_name}</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Qty</div>
              <div className="text-white font-semibold">{order.quantity}</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Paid</div>
              <div className="text-white font-semibold">{formatCurrency(order.charge)}</div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Issue Type</label>
            <select value={issueType} onChange={(e) => setIssueType(e.target.value)}
              className="input w-full bg-[#111827] border-[#2D2D50] focus:border-blue-400">
              {ISSUE_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="input w-full min-h-[140px] bg-[#111827] border-[#2D2D50]"
              placeholder="Explain the issue and what happened. Provide as much detail as possible." />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Attachment (optional)</label>
            <input type="file" accept="image/*" onChange={(e) => setAttachment(e.target.files?.[0] ?? null)}
              className="w-full text-sm text-slate-200" />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button onClick={onClose} className="rounded-xl border border-[#2D2D50] px-5 py-3 text-sm text-slate-400 hover:text-white transition-colors">
              Cancel
            </button>
            <button onClick={handleSubmit} disabled={submitting}
              className="btn-primary px-5 py-3 text-sm disabled:opacity-50">
              {submitting ? 'Submitting…' : 'Submit Ticket'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
