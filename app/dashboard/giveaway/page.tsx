'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { formatCurrency } from '@/lib/utils'

const GIVEAWAYS = [
  {
    title: 'Instagram Post Promo',
    reward: '$1 Balance',
    description: 'Create a public Instagram post promoting BOASTLIB and share the post link for verification.',
    requirements: [
      'Post must be public and visible to everyone',
      'Mention the BOASTLIB brand clearly in the caption',
      'Original promo content only',
    ],
    actionText: 'Submit Proof',
    href: '/dashboard/giveaway/submit',
  },
  {
    title: 'Facebook Post & Share',
    reward: 'Up to $3 Balance',
    description: 'Publish a Facebook promo post and share it publicly so the campaign can be checked.',
    requirements: [
      'Must be a public Facebook post',
      'Share or repost with visible public access',
      'No fake engagement or hidden post visibility',
    ],
    actionText: 'Submit Proof',
    href: '/dashboard/giveaway/submit',
  },
  {
    title: 'WhatsApp Status Post & Forward',
    reward: 'Up to $2 Balance',
    description: 'Upload a BOASTLIB promo status and forward it to others to help us verify the campaign.',
    requirements: [
      'Status must clearly promote BOASTLIB',
      'Forward or share into public chats where it remains visible',
      'Upload the public proof link for review',
    ],
    actionText: 'Submit Proof',
    href: '/dashboard/giveaway/submit',
  },
]

export default function DashboardGiveawayPage() {
  const [loading, setLoading] = useState(true)
  const [balance, setBalance] = useState<number | null>(null)

  useEffect(() => {
    const loadBalance = async () => {
      try {
        const userRes = await api.get('/api/auth/me')
        setBalance(userRes.data.balance)
      } catch {}
      finally { setLoading(false) }
    }
    loadBalance()
  }, [])

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div className="rounded-2xl p-6 bg-[#111827] border border-[#2D2D50]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div>
            <div className="text-sm uppercase tracking-[0.3em] text-emerald-400 font-semibold">Giveaway</div>
            <h1 className="text-3xl font-black text-white mt-2">Earn free platform credit</h1>
            <p className="text-[#9CA3AF] mt-3 max-w-2xl">
              Promote BOASTLIB through verified social actions like Instagram posts, Facebook promotions, and WhatsApp status sharing to earn reward credits on your balance.
            </p>
          </div>
          <div className="rounded-3xl bg-[#0F172A] border border-[#2D2D50] px-5 py-4 text-white">
            <div className="text-xs uppercase tracking-[0.3em] text-[#6EE7B7]">Your balance</div>
            <div className="text-3xl font-black mt-2">{loading ? '...' : formatCurrency(balance ?? 0)}</div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {GIVEAWAYS.map(item => (
          <div key={item.title} className="card p-5 border border-[#2D2D50] bg-[#111827] hover:border-emerald-400/40 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-xs text-[#6B7280] uppercase tracking-[0.3em] font-semibold">{item.reward}</div>
                <h2 className="text-xl font-bold text-white mt-2">{item.title}</h2>
              </div>
              <span className="text-2xl">🎁</span>
            </div>
            <p className="text-[#9CA3AF] text-sm mb-4">{item.description}</p>
            <ul className="space-y-2 mb-5 text-sm text-[#9CA3AF]">
              {item.requirements.map(req => (
                <li key={req} className="flex items-start gap-2">
                  <span className="text-emerald-400">•</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
            <Link href={item.href} className="btn-primary w-full text-center py-3">
              {item.actionText}
            </Link>
          </div>
        ))}
      </div>

      <div className="card p-5 border border-[#2D2D50] bg-[#111827]">
        <h2 className="text-white font-bold mb-3">How it works</h2>
        <ol className="list-decimal list-inside space-y-3 text-[#9CA3AF] text-sm">
          <li>Choose a giveaway reward and follow the instructions.</li>
          <li>Submit proof of your completed social action through the giveaway submission form.</li>
          <li>Our team verifies the submission and adds the reward credit to your balance.</li>
          <li>Keep the content public for the required review period.</li>
        </ol>
      </div>
    </div>
  )
}
