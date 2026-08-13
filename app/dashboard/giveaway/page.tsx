'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { formatCurrency } from '@/lib/utils'

const GIVEAWAYS = [
  {
    title: 'LinkedIn Post Giveaway',
    reward: '$1 Balance',
    description: 'Publish an original LinkedIn post with at least 250 words and keep it public for 1 year.',
    requirements: [
      'One post per user',
      'Must remain public and visible for at least 1 year',
      'No fake engagement, bots, or low-effort posts',
    ],
    actionText: 'Submit Your Proof',
    href: '/dashboard/giveaway/submit',
  },
  {
    title: 'YouTube Video Reward',
    reward: 'Up to $5 Balance',
    description: 'Create a genuine YouTube video and submit proof to earn reward credit.',
    requirements: [
      'Original content only',
      'No copied or AI-generated spam',
      'Must stay public for review',
    ],
    actionText: 'Learn more details',
    href: '/dashboard/giveaway/submit',
  },
  {
    title: 'Forum Post Bonus',
    reward: '$1 Balance',
    description: 'Post on a qualifying forum and submit proof to earn a reward.',
    requirements: [
      'One post per user',
      'Minimum 250 words required',
      'Must be professional and original',
    ],
    actionText: 'Learn more details',
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
              Complete verified social actions like LinkedIn posts, YouTube videos, or forum threads and get reward credits added directly to your BOASTLIB balance.
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
