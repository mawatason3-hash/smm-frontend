'use client'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'

export default function ReferralsPage() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const referralLink = typeof window !== 'undefined' ? `${window.location.origin}/auth/register?ref=${user?.referral_code}` : ''

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    showToast(`${label} copied!`, 'success')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-white">Referral Program</h1>
        <p className="text-[#9CA3AF] text-sm mt-1">Invite friends and earn bonus credits</p>
      </div>

      {/* How it works */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(124,58,237,0.1))', borderColor: 'rgba(59,130,246,0.3)' }}>
        <div className="text-center">
          <div className="text-5xl mb-4">🎁</div>
          <h2 className="text-white font-black text-xl mb-2">Invite Friends, Earn Together</h2>
          <p className="text-[#9CA3AF] text-sm">Share your referral link. When a friend registers and makes their first deposit, you both benefit.</p>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-6">
          {[
            { icon: '🔗', title: 'Share Link', desc: 'Send your unique referral link to friends' },
            { icon: '👤', title: 'Friend Joins', desc: 'They register using your link' },
            { icon: '💰', title: 'You Earn', desc: 'Get bonus credits on their first deposit' },
          ].map(step => (
            <div key={step.title} className="text-center">
              <div className="text-2xl mb-2">{step.icon}</div>
              <div className="text-white text-sm font-semibold mb-1">{step.title}</div>
              <div className="text-[#6B7280] text-xs">{step.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Your referral code */}
      <div className="card">
        <h2 className="text-white font-bold mb-4">Your Referral Details</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-[#6B7280] font-semibold uppercase tracking-wide mb-1.5">Referral Code</label>
            <div className="flex gap-2">
              <input readOnly value={user?.referral_code || ''} className="input font-mono font-bold tracking-widest text-center text-white" />
              <button onClick={() => copy(user?.referral_code || '', 'Referral code')} className="btn-primary px-4 whitespace-nowrap text-sm">Copy</button>
            </div>
          </div>
          <div>
            <label className="block text-xs text-[#6B7280] font-semibold uppercase tracking-wide mb-1.5">Referral Link</label>
            <div className="flex gap-2">
              <input readOnly value={referralLink} className="input text-xs text-[#9CA3AF]" />
              <button onClick={() => copy(referralLink, 'Referral link')} className="btn-primary px-4 whitespace-nowrap text-sm">Copy</button>
            </div>
          </div>
        </div>

        {/* Share buttons */}
        <div className="mt-4 flex flex-wrap gap-2">
          <a href={`https://wa.me/?text=Join%20BOASTLIB%20-%20Cheapest%20SMM%20Panel!%20${encodeURIComponent(referralLink)}`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/20 text-green-400 text-sm font-medium hover:bg-green-500/30 transition-colors">
            📱 Share on WhatsApp
          </a>
          <a href={`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=Join%20BOASTLIB!`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/20 text-blue-400 text-sm font-medium hover:bg-blue-500/30 transition-colors">
            ✈️ Share on Telegram
          </a>
          <a href={`https://twitter.com/intent/tweet?text=Join%20BOASTLIB%20-%20Cheapest%20SMM%20Panel!%20${encodeURIComponent(referralLink)}`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-500/20 text-gray-400 text-sm font-medium hover:bg-gray-500/30 transition-colors">
            𝕏 Share on X
          </a>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card text-center">
          <div className="text-3xl font-black text-white mb-1">0</div>
          <div className="text-[#9CA3AF] text-sm">Total Referrals</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-black gradient-text mb-1">$0.00</div>
          <div className="text-[#9CA3AF] text-sm">Earnings from Referrals</div>
        </div>
      </div>
    </div>
  )
}
