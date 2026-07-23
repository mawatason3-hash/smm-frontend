import Link from 'next/link'

export const metadata = {
  title: 'Services — BOASTLIB Cheapest SMM Panel',
  description: 'Explore 1,049+ social media marketing services for Instagram, TikTok, YouTube, Facebook and more. Fast delivery and lowest prices.',
}

const services = [
  { name: 'Instagram Followers', desc: 'Fast, real followers with high retention for Instagram profiles.' },
  { name: 'TikTok Likes', desc: 'Instant TikTok video likes to grow your engagement fast.' },
  { name: 'YouTube Views', desc: 'High-quality YouTube views for videos and channels.' },
  { name: 'Facebook Likes', desc: 'Boost Facebook page and post likes with reliable delivery.' },
  { name: 'Instagram Story Views', desc: 'Affordable story views to increase social proof quickly.' },
  { name: 'TikTok Followers', desc: 'Grow your TikTok audience with safe and affordable followers.' },
]

export default function ServicesPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-10 py-16 px-4">
      <div className="space-y-4 text-center">
        <p className="text-sm text-green-400 uppercase tracking-[0.3em]">Services</p>
        <h1 className="text-4xl sm:text-5xl font-black text-white">Affordable SMM Services for Every Platform</h1>
        <p className="max-w-3xl mx-auto text-[#9CA3AF] text-base sm:text-lg">
          BOASTLIB offers over 1,000 social media marketing services across Instagram, TikTok, YouTube, Facebook and more. Choose the cheapest panel with instant delivery and reliable support.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {services.map(service => (
          <div key={service.name} className="card border border-[#2D2D50] p-6 hover:border-[#3B82F6] transition-all">
            <h2 className="text-xl font-bold text-white mb-2">{service.name}</h2>
            <p className="text-[#9CA3AF] leading-relaxed">{service.desc}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card p-6 bg-[#11121F] border border-[#2D2D50]">
          <h3 className="text-white font-bold text-lg mb-3">Lowest Prices</h3>
          <p className="text-[#9CA3AF] text-sm leading-relaxed">Starting from $0.001 per 1,000, BOASTLIB is one of the cheapest SMM panels available.</p>
        </div>
        <div className="card p-6 bg-[#11121F] border border-[#2D2D50]">
          <h3 className="text-white font-bold text-lg mb-3">Fast Delivery</h3>
          <p className="text-[#9CA3AF] text-sm leading-relaxed">Most orders begin delivery within seconds, with progress updates available in your dashboard.</p>
        </div>
        <div className="card p-6 bg-[#11121F] border border-[#2D2D50]">
          <h3 className="text-white font-bold text-lg mb-3">Secure Checkout</h3>
          <p className="text-[#9CA3AF] text-sm leading-relaxed">Pay with card, mobile money, crypto, or manual deposit. Your payment and account stay safe.</p>
        </div>
      </div>

      <div className="text-center">
        <Link href="/auth/register" className="btn-primary px-8 py-3.5 text-base">Create Your Account</Link>
      </div>
    </div>
  )
}
