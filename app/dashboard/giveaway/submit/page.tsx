'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'

const GIVEAWAYS = [
  {
    id: 'instagram-post-promo',
    title: 'Instagram Post Promo',
    reward: '$1 Balance',
    description: 'Create a public Instagram promo post about BOASTLIB and submit the proof link for review.',
  },
  {
    id: 'facebook-post-share',
    title: 'Facebook Post & Share',
    reward: 'Up to $3 Balance',
    description: 'Share a public Facebook post that promotes BOASTLIB and send the public link for verification.',
  },
  {
    id: 'whatsapp-status-forward',
    title: 'WhatsApp Status Post & Forward',
    reward: 'Up to $2 Balance',
    description: 'Post a BOASTLIB status and forward it publicly so our team can verify it.',
  },
]

export default function GiveawaySubmitPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { showToast } = useToast()
  const [selectedType, setSelectedType] = useState(GIVEAWAYS[0].id)
  const [proofUrl, setProofUrl] = useState('')
  const [details, setDetails] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const selectedGiveaway = GIVEAWAYS.find((item) => item.id === selectedType)

  const handleSubmit = async () => {
    if (!proofUrl.trim()) {
      showToast('Please enter the public proof URL for your submission.', 'error')
      return
    }

    setIsSubmitting(true)

    try {
      const res = await api.post('/api/giveaway/submit', {
        giveaway_type: selectedGiveaway?.title || 'Giveaway',
        proof_url: proofUrl.trim(),
        details: details.trim() || undefined,
        honeypot: honeypot.trim() || undefined,
      })

      showToast(res.data.message || 'Submission received. Admin will review it shortly.', 'success')
      setSubmitted(true)
      setProofUrl('')
      setDetails('')
      setHoneypot('')
    } catch (err: any) {
      showToast(err?.response?.data?.detail || 'Failed to submit giveaway proof.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in space-y-6">
      <div className="rounded-3xl border border-[#2D2D50] bg-[#111827] p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-400 font-semibold">Giveaway submission</p>
            <h1 className="text-3xl font-black text-white mt-2">Submit your proof</h1>
            <p className="text-[#9CA3AF] mt-3 max-w-2xl">
              Choose the action you completed, paste the public post or video URL, and add any extra context to help us verify your reward.
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.push('/dashboard/giveaway')}
            className="btn-secondary px-4 py-3"
          >
            Back to giveaways
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6 rounded-3xl border border-[#2D2D50] bg-[#111827] p-6">
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-white">Giveaway type</label>
            <select
              value={selectedType}
              onChange={(event) => setSelectedType(event.target.value)}
              className="w-full rounded-2xl border border-[#2D2D50] bg-[#0F172A] p-4 text-white outline-none focus:border-emerald-400"
            >
              {GIVEAWAYS.map((item) => (
                <option key={item.id} value={item.id}>{item.title}</option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-semibold text-white">Public proof URL</label>
            <input
              type="url"
              value={proofUrl}
              onChange={(event) => setProofUrl(event.target.value)}
              placeholder="https://"
              className="w-full rounded-2xl border border-[#2D2D50] bg-[#0F172A] p-4 text-white outline-none focus:border-emerald-400"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-semibold text-white">Details / notes (optional)</label>
            <textarea
              value={details}
              onChange={(event) => setDetails(event.target.value)}
              rows={5}
              placeholder="Add any context that will help our team verify the content."
              className="w-full rounded-2xl border border-[#2D2D50] bg-[#0F172A] p-4 text-white outline-none focus:border-emerald-400"
            />
          </div>

          <div className="sr-only">
            <label htmlFor="website">Website</label>
            <input
              id="website"
              name="website"
              value={honeypot}
              onChange={(event) => setHoneypot(event.target.value)}
              autoComplete="off"
              tabIndex={-1}
            />
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="btn-primary w-full rounded-2xl px-6 py-4 text-lg font-semibold"
          >
            {isSubmitting ? 'Submitting…' : 'Submit proof for review'}
          </button>

          {submitted && (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-200">
              Your submission is pending review. You can check back in your account later for any updates.
            </div>
          )}
        </div>

        <div className="space-y-6 rounded-3xl border border-[#2D2D50] bg-[#111827] p-6">
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-white">Submission guide</h2>
            <p className="text-[#9CA3AF] text-sm">
              Use a public URL to the social action you completed. We verify entries manually, so keep your content visible and avoid private or expired links.
            </p>
          </div>

          <div className="space-y-3 rounded-2xl border border-[#2D2D50] bg-[#0F172A] p-4">
            <p className="text-sm text-[#9CA3AF]"><span className="font-semibold text-white">Ready for review?</span> Here’s what we need:</p>
            <ul className="space-y-2 text-sm text-[#D1D5DB]">
              <li>• A valid public URL for the content you created.</li>
              <li>• The content must be original and follow our giveaway rules.</li>
              <li>• Keep the submission link active while review is in progress.</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-[#2D2D50] bg-[#0F172A] p-4 text-sm text-[#9CA3AF]">
            <div className="font-semibold text-white">Important</div>
            <p className="mt-2">Submissions that use fake engagement, bots, or hidden content will be rejected. Your reward is added only after manual verification.</p>
          </div>

          {user?.country && (
            <div className="rounded-2xl border border-[#2D2D50] bg-[#0F172A] p-4 text-sm text-[#9CA3AF]">
              <div className="font-semibold text-white">Country</div>
              <p className="mt-2">{user.country}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
