'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { PLATFORMS } from '@/types'

const LIVE_COUNT_START = 522

const FEATURES = [
  { icon: '⚡', title: 'Instant Delivery', desc: 'Most orders start within seconds of placing' },
  { icon: '💰', title: 'Cheapest Prices', desc: 'Starting from $0.001 per 1,000 — unbeatable' },
  { icon: '🔒', title: 'Safe & Secure', desc: 'Your accounts stay safe — no passwords needed' },
  { icon: '🔄', title: '30-Day Refill', desc: 'Free refill guarantee on most services' },
  { icon: '🌍', title: 'All Platforms', desc: 'Instagram, TikTok, YouTube, Facebook and more' },
  { icon: '🛠️', title: 'Developer API', desc: 'Standard API for integrating into your own panel' },
]

export default function LandingPage() {
  const [liveCount, setLiveCount] = useState(LIVE_COUNT_START)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount(prev => prev + Math.floor(Math.random() * 4) + 1)
    }, 1800)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen" style={{ background: '#0B0B1A' }}>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#2D2D50]/60 backdrop-blur-md" style={{ background: 'rgba(11,11,26,0.9)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-sm" style={{ background: 'linear-gradient(135deg, #3B82F6, #7C3AED)' }}>B</div>
            <span className="font-black text-white text-lg tracking-tight">BOASTLIB</span>
            <span className="text-[10px] text-[#6B7280] font-medium hidden sm:block">SMM Panel</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {['Home', 'Services', 'Pricing', 'FAQ'].map(item => (
              <Link key={item} href={item === 'Home' ? '/' : `/#${item.toLowerCase()}`} className="text-[#9CA3AF] hover:text-white text-sm font-medium transition-colors">{item}</Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="hidden sm:block text-[#9CA3AF] hover:text-white text-sm font-medium transition-colors px-4 py-2 rounded-lg border border-[#2D2D50] hover:border-[#3B82F6]">Login</Link>
            <Link href="/auth/register" className="btn-primary text-sm px-5 py-2.5">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: '#3B82F6' }} />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full opacity-8 blur-3xl" style={{ background: '#7C3AED' }} />
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-xs font-semibold mb-6">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-live" />
                Live Orders: {liveCount.toLocaleString()} and rising
              </div>

              <h1 className="text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
                Boost Your<br />
                <span className="gradient-text">Social Media.</span><br />
                Instantly.
              </h1>

              <p className="text-[#9CA3AF] text-lg leading-relaxed mb-8 max-w-lg">
                The cheapest SMM panel with real-time delivery. Instagram, TikTok, YouTube, Facebook and more. Starting from <span className="text-white font-semibold">$0.001 per 1K</span>.
              </p>

              <div className="flex flex-wrap gap-4 mb-10">
                <Link href="/auth/register" className="btn-primary text-base px-8 py-3.5">Get Started Free</Link>
                <Link href="#services" className="text-white border border-[#2D2D50] hover:border-[#3B82F6] px-8 py-3.5 rounded-xl font-semibold transition-all hover:bg-[#1F1F3A] text-sm">View Services</Link>
              </div>

              {/* Stats */}
            </div>

            {/* Right side — platform grid */}
            <div className="hidden lg:block relative">
              <div className="card p-6">
                <div className="text-xs text-[#6B7280] font-semibold mb-4 uppercase tracking-wider">Supported Platforms</div>
                <div className="grid grid-cols-4 gap-3">
                  {PLATFORMS.map(p => (
                    <div key={p.id} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-[#1F1F3A] hover:bg-[#2D2D50] transition-colors cursor-default">
                      <div className="w-14 h-14 rounded-3xl bg-[#101025] flex items-center justify-center">
                        <img src={p.logoUrl} alt={p.name} className="h-8 w-8 object-contain" />
                      </div>
                      <span className="text-[10px] text-[#9CA3AF] font-medium text-center leading-tight">{p.name}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 rounded-xl bg-[#1F1F3A] border border-green-500/20">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#9CA3AF]">Instagram Followers</span>
                    <span className="text-green-400 font-bold">$1.20/1K</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-[#9CA3AF]">TikTok Likes</span>
                    <span className="text-green-400 font-bold">$0.20/1K</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-[#9CA3AF]">YouTube Views</span>
                    <span className="text-green-400 font-bold">$1.50/1K</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platforms */}
      <section id="services" className="py-16 px-4 border-t border-[#2D2D50]/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-white mb-3">All Major Platforms</h2>
            <p className="text-[#9CA3AF]">1,049+ services across every major social media platform</p>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
            {PLATFORMS.map(p => (
              <div key={p.id} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-[#16162D] border border-[#2D2D50] hover:border-[#3B82F6]/50 transition-all hover:-translate-y-1 cursor-default">
                <div className="w-12 h-12 rounded-3xl bg-[#0F1124] flex items-center justify-center">
                  <img src={p.logoUrl} alt={p.name} className="h-7 w-7 object-contain" />
                </div>
                <span className="text-xs text-[#9CA3AF] font-medium text-center">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-white mb-3">How It Works</h2>
            <p className="text-[#9CA3AF]">Get more followers, likes, and views in 3 simple steps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: '1', title: 'Create Account', desc: 'Register free in 30 seconds. No credit card needed to sign up.', icon: '👤' },
              { step: '2', title: 'Add Funds', desc: 'Deposit using card (Paystack), mobile money, or crypto. Instant credit.', icon: '💳' },
              { step: '3', title: 'Place Order', desc: 'Select your service, paste your link, set quantity. Done — watch it grow.', icon: '🚀' },
            ].map((item) => (
              <div key={item.step} className="card relative">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-lg mb-4" style={{ background: 'linear-gradient(135deg, #3B82F6, #7C3AED)' }}>
                  {item.step}
                </div>
                <div className="text-2xl mb-3">{item.icon}</div>
                <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-[#9CA3AF] text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 border-t border-[#2D2D50]/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-white mb-3">Why Choose BOASTLIB</h2>
            <p className="text-[#9CA3AF]">Everything you need to grow your social media</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(f => (
              <div key={f.title} className="card group">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="text-white font-bold mb-2">{f.title}</h3>
                <p className="text-[#9CA3AF] text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-white mb-3">Transparent Pricing</h2>
            <p className="text-[#9CA3AF]">Sample prices — view all 1,049+ services after registering</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { platform: '📷 Instagram', service: 'Followers — High Retention', price: '$1.20', per: '1,000', speed: 'Instant', badge: 'High Quality' },
              { platform: '🎵 TikTok', service: 'Video Likes', price: '$0.20', per: '1,000', speed: 'Instant', badge: 'Best Seller' },
              { platform: '▶️ YouTube', service: 'Views — High Retention', price: '$1.50', per: '1,000', speed: 'Gradual', badge: 'High Quality' },
            ].map(item => (
              <div key={item.platform} className="card">
                <div className="text-sm text-[#9CA3AF] font-medium mb-1">{item.platform}</div>
                <div className="text-white font-semibold mb-3">{item.service}</div>
                <div className="text-3xl font-black text-white mb-1">{item.price}</div>
                <div className="text-[#6B7280] text-sm mb-4">per {item.per}</div>
                <div className="flex items-center gap-2">
                  <span className="badge bg-blue-500/20 text-blue-400">⚡ {item.speed}</span>
                  <span className="badge bg-purple-500/20 text-purple-400">⭐ {item.badge}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/auth/register" className="btn-primary text-base px-10 py-3.5">View All Services & Prices</Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="card" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(124,58,237,0.1))', borderColor: 'rgba(59,130,246,0.3)' }}>
            <div className="text-5xl mb-6">🚀</div>
            <h2 className="text-4xl font-black text-white mb-4">Ready to Boost?</h2>
            <p className="text-[#9CA3AF] mb-8 text-lg">Join thousands of creators and marketers growing their accounts with BOASTLIB.</p>
            <Link href="/auth/register" className="btn-primary text-lg px-12 py-4">Create Free Account</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#2D2D50] py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-black text-xs" style={{ background: 'linear-gradient(135deg, #3B82F6, #7C3AED)' }}>B</div>
                <span className="font-black text-white">BOASTLIB</span>
              </div>
              <p className="text-[#6B7280] text-sm leading-relaxed">The cheapest SMM panel with real-time delivery across all major platforms.</p>
            </div>
            {[
              { title: 'Links', links: ['Home', 'Services', 'Pricing', 'FAQ'] },
              { title: 'About', links: ['About Us', 'Blog', 'Contact'] },
              { title: 'Social', links: ['Telegram', 'WhatsApp', 'Twitter'] },
            ].map(col => (
              <div key={col.title}>
                <div className="text-white font-semibold mb-3 text-sm">{col.title}</div>
                {col.links.map(link => (
                  <div key={link} className="text-[#6B7280] hover:text-white text-sm mb-2 cursor-pointer transition-colors">{link}</div>
                ))}
              </div>
            ))}
          </div>
          <div className="border-t border-[#2D2D50] pt-6 text-center text-[#6B7280] text-sm">
            © 2026 BOASTLIB. All rights reserved. | Built by Solomon Kamara
          </div>
        </div>
      </footer>
    </div>
  )
}
