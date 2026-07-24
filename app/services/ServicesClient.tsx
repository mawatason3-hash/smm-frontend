"use client"

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const services = [
  { name: 'Instagram Followers', desc: 'Fast, real followers with high retention for Instagram profiles.' },
  { name: 'TikTok Likes', desc: 'Instant TikTok video likes to grow your engagement fast.' },
  { name: 'YouTube Views', desc: 'High-quality YouTube views for videos and channels.' },
  { name: 'Facebook Likes', desc: 'Boost Facebook page and post likes with reliable delivery.' },
  { name: 'Instagram Story Views', desc: 'Affordable story views to increase social proof quickly.' },
  { name: 'TikTok Followers', desc: 'Grow your TikTok audience with safe and affordable followers.' },
]

const highlights = [
  {
    title: 'Lowest Prices',
    desc: 'Starting from $0.001 per 1,000, BOASTLIB is one of the cheapest SMM panels available.',
  },
  {
    title: 'Fast Delivery',
    desc: 'Most orders begin delivery within seconds, with progress updates available in your dashboard.',
  },
  {
    title: 'Secure Checkout',
    desc: 'Pay with card, mobile money, crypto, or manual deposit. Your payment and account stay safe.',
  },
]

export default function ServicesClient() {
  const [liveCount, setLiveCount] = useState(522)

  useEffect(() => {
    const id = setInterval(() => setLiveCount(v => v + Math.floor(Math.random() * 4) + 1), 1800)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="min-h-screen" style={{ background: '#0B0B1A' }}>
      <section className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-2xl p-8 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.06), rgba(124,58,237,0.06))' }}>
            <div className="absolute -left-24 -top-24 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: '#3B82F6' }} />
            <div className="absolute -right-24 -bottom-24 w-80 h-80 rounded-full opacity-8 blur-3xl" style={{ background: '#7C3AED' }} />
            <div className="text-center">
              <p className="text-sm text-green-400 uppercase tracking-[0.3em]">Services</p>
              <h1 className="text-4xl sm:text-5xl font-black text-white mt-3">Affordable SMM Services for Every Platform</h1>
              <p className="max-w-3xl mx-auto text-[#9CA3AF] text-base sm:text-lg mt-4">BOASTLIB offers over 1,000 social media marketing services across Instagram, TikTok, YouTube, Facebook and more. Choose the cheapest panel with instant delivery and reliable support.</p>
              <div className="inline-flex flex-col sm:flex-row items-center gap-3 mt-6 justify-center">
                <div className="px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 font-semibold">Live Orders: {liveCount.toLocaleString()}</div>
                <Link href="/auth/register" className="btn-primary px-5 py-2 text-sm">Get Started</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto space-y-10 py-8 px-4">
        <div className="grid gap-6 sm:grid-cols-2">
          {services.map((service, i) => (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              whileHover={{ scale: 1.03 }}
              className="card border border-[#2D2D50] p-6 transition-all"
              style={{ boxShadow: '0 6px 20px rgba(59,130,246,0.03)' }}
            >
              <h2 className="text-xl font-bold text-white mb-2">{service.name}</h2>
              <p className="text-[#9CA3AF] leading-relaxed">{service.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {highlights.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.36, delay: i * 0.06 }}
              className="card p-6 bg-[#11121F] border border-[#2D2D50]"
            >
              <h3 className="text-white font-bold text-lg mb-3">{card.title}</h3>
              <p className="text-[#9CA3AF] text-sm leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/auth/register" className="btn-primary px-8 py-3.5 text-base">Create Your Account</Link>
        </div>
      </main>
    </div>
  )
}
