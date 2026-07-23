export const metadata = {
  title: 'TikTok Likes — BOASTLIB',
  description: 'Buy TikTok likes cheaply and increase your social proof fast with BOASTLIB. Instant service and low-cost delivery.',
}

export default function TikTokLikesPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-10 py-16 px-4">
      <div className="space-y-4 text-center">
        <p className="text-sm text-green-400 uppercase tracking-[0.3em]">TikTok</p>
        <h1 className="text-4xl sm:text-5xl font-black text-white">Buy TikTok Likes</h1>
        <p className="max-w-3xl mx-auto text-[#9CA3AF] text-base sm:text-lg">
          Grow your TikTok videos with affordable likes from BOASTLIB. Fast delivery and no-risk checkout for creators and marketers.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card border border-[#2D2D50] p-6">
          <h2 className="text-xl font-bold text-white mb-3">High Engagement</h2>
          <p className="text-[#9CA3AF] leading-relaxed">Boost your video visibility and social proof with quick TikTok like orders.</p>
        </div>
        <div className="card border border-[#2D2D50] p-6">
          <h2 className="text-xl font-bold text-white mb-3">Lowest Rates</h2>
          <p className="text-[#9CA3AF] leading-relaxed">Use BOASTLIB to buy TikTok likes at one of the lowest prices available in any SMM panel.</p>
        </div>
      </div>

      <div className="text-center">
        <a href="/auth/register" className="btn-primary px-8 py-3.5 text-base">Order TikTok Likes</a>
      </div>
    </div>
  )
}
