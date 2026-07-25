"use client"
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PLATFORM_ICONS } from '@/lib/platformIcons'
import PWAInstallButton from '@/components/PWAInstallButton'
import InstallPromptModal from '@/components/InstallPromptModal'
import { useInstallPrompt } from '@/components/useInstallPrompt'
import { PLATFORMS } from '@/types'
import PlatformIcon from '@/lib/platformIcons'

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
  const [showHomeInstallModal, setShowHomeInstallModal] = useState(false)
  const { deferredPrompt, isInstalled, isIOS, handlePromptInstall } = useInstallPrompt()

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount(prev => prev + Math.floor(Math.random() * 4) + 1)
    }, 1800)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || isInstalled) return
    if (window.location.pathname !== '/') return

    const lastShown = Number(window.localStorage.getItem('install_prompt_last_shown') || '0')
    const now = Date.now()
    const delayMs = 10_000
    const retryWindowMs = 10 * 60 * 1000

    if (now - lastShown < retryWindowMs) return

    const timer = window.setTimeout(() => {
      window.localStorage.setItem('install_prompt_last_shown', String(Date.now()))
      setShowHomeInstallModal(true)
    }, delayMs)

    return () => window.clearTimeout(timer)
  }, [isInstalled])

  const handleHomeInstall = async () => {
    if (deferredPrompt) {
      await handlePromptInstall()
    }
    setShowHomeInstallModal(false)
  }

  return (
    <div className="min-h-screen" style={{ background: '#0B0B1A' }}>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#2D2D50]/60 backdrop-blur-md" style={{ background: 'rgba(11,11,26,0.9)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <img src="/logo.png" alt="BOASTLIB" className="w-10 h-10 object-contain" />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {[
              { label: 'Home', href: '/' },
              { label: 'Services', href: '/services' },
              { label: 'Pricing', href: '/services' },
              { label: 'Blog', href: '/blog' },
            ].map(item => (
              <Link key={item.label} href={item.href} className="text-[#9CA3AF] hover:text-white text-sm font-medium transition-colors">{item.label}</Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <PWAInstallButton variant="nav" />
            <Link href="/auth/login" className="text-[#9CA3AF] hover:text-white text-sm font-medium transition-colors px-4 py-2 rounded-lg border border-[#2D2D50] hover:border-[#3B82F6]">Login</Link>
            <Link href="/auth/register" className="btn-primary text-sm px-5 py-2.5">Get Started</Link>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white p-2"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden fixed top-16 left-0 right-0 z-40 border-b border-[#2D2D50]/60 backdrop-blur-md" style={{ background: 'rgba(11,11,26,0.98)' }}>
            <div className="flex flex-col px-4 py-4 gap-1">
              {[
                { label: 'Home', href: '/' },
                { label: 'Services', href: '/services' },
                { label: 'Pricing', href: '/services' },
                { label: 'Blog', href: '/blog' },
              ].map(item => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-[#9CA3AF] hover:text-white text-sm font-medium py-3 px-2 border-b border-[#2D2D50]/40"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/auth/login"
                onClick={() => setMenuOpen(false)}
                className="text-[#9CA3AF] hover:text-white text-sm font-medium py-3 px-2 border-b border-[#2D2D50]/40"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                onClick={() => setMenuOpen(false)}
                className="btn-primary text-sm px-5 py-3 text-center mt-2"
              >
                Get Started
              </Link>
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="text-[#9CA3AF] hover:text-white text-sm font-medium py-3 px-2 border-b border-[#2D2D50]/40"
              >
                Install App
              </Link>
            </div>
          </div>
        )}
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

              <div className="flex flex-wrap gap-4 mb-8">
                <Link href="/auth/register" className="btn-primary text-base px-8 py-3.5">Get Started Free</Link>
                <Link href="#services" className="text-white border border-[#2D2D50] hover:border-[#3B82F6] px-8 py-3.5 rounded-xl font-semibold transition-all hover:bg-[#1F1F3A] text-sm">View Services</Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                {[
                  { label: 'Instagram Followers', href: '/instagram-followers', platform: 'instagram' },
                  { label: 'TikTok Likes', href: '/tiktok-likes', platform: 'tiktok' },
                  { label: 'YouTube Views', href: '/youtube-views', platform: 'youtube' },
                ].map(item => (
                  <Link key={item.label} href={item.href} className="inline-flex items-center gap-2 rounded-full border border-[#2D2D50] bg-white/5 px-4 py-3 text-sm font-semibold text-[#E5E7EB] hover:border-[#3B82F6] hover:bg-[#111827] transition-all">
                    <span className="flex items-center justify-center w-5 h-5"><PlatformIcon platform={item.platform} size={16} /></span>
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>

              {/* Stats */}
            </div>

            {/* Right side — platform grid */}
            <div className="hidden lg:block relative">
              <div className="card p-6">
                <div className="text-xs text-[#6B7280] font-semibold mb-4 uppercase tracking-wider">Supported Platforms</div>
                <div className="grid grid-cols-4 gap-3">
                  {PLATFORMS.map(p => {
                    const cfg = (PLATFORM_ICONS as any)[p.id]
                    const Icon = cfg?.icon
                    return (
                      <div key={p.id} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-[#1F1F3A] hover:bg-[#2D2D50] transition-colors cursor-default">
                        <div className="w-14 h-14 rounded-3xl flex items-center justify-center" style={{ background: cfg?.bgGlow || '#101025' }}>
                          {Icon ? <Icon size={28} color={cfg.color} /> : <PlatformIcon platform={p.id} size={28} />}
                        </div>
                        <span className="text-[10px] text-[#9CA3AF] font-medium text-center leading-tight">{p.name}</span>
                      </div>
                    )
                  })}
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

      <InstallPromptModal
        isOpen={showHomeInstallModal}
        onClose={() => setShowHomeInstallModal(false)}
        isInstalled={isInstalled}
        isIOS={isIOS}
        deferredPrompt={deferredPrompt}
        onInstall={handleHomeInstall}
      />

      {/* Platforms */}
      <section id="services" className="py-16 px-4 border-t border-[#2D2D50]/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-white mb-3">All Major Platforms</h2>
            <p className="text-[#9CA3AF]">1,049+ services across every major social media platform</p>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
            {['instagram','tiktok','youtube','facebook','twitter','telegram','spotify','discord'].map((key, i) => {
              const cfg = (PLATFORM_ICONS as any)[key]
              const Icon = cfg?.icon
              const color = cfg?.color
              const bgGlow = cfg?.bgGlow
              const label = key === 'twitter' ? 'Twitter X' : key.charAt(0).toUpperCase() + key.slice(1)
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.36, delay: i * 0.06 }}
                  whileHover={{ scale: 1.06, y: -4 }}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-[#16162D] border border-[#2D2D50] hover:border-[#3B82F6]/50 transition-all cursor-default"
                >
                  <div className="w-12 h-12 rounded-3xl flex items-center justify-center" style={{ background: bgGlow }}>
                    {Icon ? <Icon size={20} color={color} /> : <PlatformIcon platform={key} size={20} />}
                  </div>
                  <span className="text-xs text-[#9CA3AF] font-medium text-center">{label}</span>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* SEO Landing Pages */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto text-center mb-10">
          <p className="text-sm uppercase tracking-[0.3em] text-green-400">Featured Offers</p>
          <h2 className="text-3xl font-black text-white mt-3">Popular Landing Pages</h2>
          <p className="text-[#9CA3AF] max-w-2xl mx-auto mt-3">Direct access to our highest-converting pages for Instagram, TikTok, and YouTube growth.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              title: 'Instagram Followers',
              description: 'Buy followers at the cheapest rate with fast delivery and high retention.',
              href: '/instagram-followers',
              badge: 'Best Seller',
            },
            {
              title: 'TikTok Likes',
              description: 'Boost your TikTok engagement quickly with affordable likes orders.',
              href: '/tiktok-likes',
              badge: 'Trending',
            },
            {
              title: 'YouTube Views',
              description: 'Grow your video visibility with reliable YouTube views delivery.',
              href: '/youtube-views',
              badge: 'High Value',
            },
          ].map(card => (
            <Link key={card.title} href={card.href} className="card group border border-[#2D2D50] p-6 hover:border-[#3B82F6] transition-all">
              <div className="flex items-center justify-between gap-3 mb-4">
                <h3 className="text-xl font-bold text-white">{card.title}</h3>
                <span className="rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold px-3 py-1">{card.badge}</span>
              </div>
              <p className="text-[#9CA3AF] mb-6">{card.description}</p>
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-white">
                <span>Explore</span>
                <span>→</span>
              </div>
            </Link>
          ))}
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
              { step: '2', title: 'Add Funds', desc: 'Deposit using card (DodoPay), mobile money, or crypto. Instant credit.', icon: '💳' },
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
              { title: 'Links', links: [{ label: 'Home', href: '/' }, { label: 'Services', href: '/services' }, { label: 'Blog', href: '/blog' }] },
              { title: 'SMM Pages', links: [{ label: 'Instagram Followers', href: '/instagram-followers' }, { label: 'TikTok Likes', href: '/tiktok-likes' }, { label: 'YouTube Views', href: '/youtube-views' }] },
              { title: 'Social', links: [{ label: 'Telegram', href: 'https://t.me/boastlib_support' }, { label: 'WhatsApp', href: 'https://wa.me/250792405593' }, { label: 'Twitter', href: 'https://twitter.com/boastlib' }] },
            ].map(col => (
              <div key={col.title}>
                <div className="text-white font-semibold mb-3 text-sm">{col.title}</div>
                {col.links.map(link => (
                  <a key={link.label} href={link.href} className="text-[#6B7280] hover:text-white text-sm mb-2 block transition-colors">{link.label}</a>
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
