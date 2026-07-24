export const metadata = {
  title: 'Instagram Followers — BOASTLIB',
  description: 'Buy Instagram followers at the cheapest prices with instant delivery and high retention from BOASTLIB.',
}

import PlatformIcon from '@/lib/platformIcons'

export default function InstagramFollowersPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-10 py-16 px-4">
      <div className="space-y-4 text-center">
        <p className="text-sm text-green-400 uppercase tracking-[0.3em]"><span className="inline-flex items-center gap-2"><PlatformIcon platform="instagram" size={18} />Instagram</span></p>
        <h1 className="text-4xl sm:text-5xl font-black text-white">Buy Instagram Followers</h1>
        <p className="max-w-3xl mx-auto text-[#9CA3AF] text-base sm:text-lg">
          Boost your Instagram credibility with affordable followers from BOASTLIB. Instant delivery, secure checkout, and proven service.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card border border-[#2D2D50] p-6">
          <h2 className="text-xl font-bold text-white mb-3">Fast Delivery</h2>
          <p className="text-[#9CA3AF] leading-relaxed">Orders typically start in seconds. Watch your follower count grow quickly with reliable delivery.</p>
        </div>
        <div className="card border border-[#2D2D50] p-6">
          <h2 className="text-xl font-bold text-white mb-3">Cheapest Prices</h2>
          <p className="text-[#9CA3AF] leading-relaxed">Get Instagram followers from as low as $0.001 per 1K on the cheapest SMM panel.</p>
        </div>
      </div>

      <div className="text-center">
        <a href="/auth/register" className="btn-primary px-8 py-3.5 text-base">Order Instagram Followers</a>
      </div>
    </div>
  )
}
