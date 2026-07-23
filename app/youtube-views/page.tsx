export const metadata = {
  title: 'YouTube Views — BOASTLIB',
  description: 'Buy YouTube views for your videos with BOASTLIB. Affordable, fast, and reliable delivery for YouTube growth.',
}

export default function YouTubeViewsPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-10 py-16 px-4">
      <div className="space-y-4 text-center">
        <p className="text-sm text-green-400 uppercase tracking-[0.3em]">YouTube</p>
        <h1 className="text-4xl sm:text-5xl font-black text-white">Buy YouTube Views</h1>
        <p className="max-w-3xl mx-auto text-[#9CA3AF] text-base sm:text-lg">
          Increase your YouTube video reach with cheap views, reliable delivery, and automatic progress tracking from BOASTLIB.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card border border-[#2D2D50] p-6">
          <h2 className="text-xl font-bold text-white mb-3">Reliable Delivery</h2>
          <p className="text-[#9CA3AF] leading-relaxed">Get real video views delivered directly to your YouTube content on time.</p>
        </div>
        <div className="card border border-[#2D2D50] p-6">
          <h2 className="text-xl font-bold text-white mb-3">Cheap Rates</h2>
          <p className="text-[#9CA3AF] leading-relaxed">Order YouTube views from a low-cost panel without sacrificing service quality.</p>
        </div>
      </div>

      <div className="text-center">
        <a href="/auth/register" className="btn-primary px-8 py-3.5 text-base">Order YouTube Views</a>
      </div>
    </div>
  )
}
