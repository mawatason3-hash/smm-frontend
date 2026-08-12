"use client"

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import PlatformIcon from '@/lib/platformIcons'

type ServiceItem = {
  name: string
  category: string
  desc: string
}

type PlatformCategoryFilterProps = {
  platform: 'instagram' | 'tiktok' | 'youtube' | 'facebook' | 'twitter' | 'discord' | 'spotify'
  title: string
  description: string
  ctaLabel: string
  ctaHref: string
  categories: string[]
  services: ServiceItem[]
}

const accentByPlatform: Record<string, string> = {
  instagram: 'from-pink-500 to-orange-400',
  tiktok: 'from-cyan-400 to-blue-600',
  youtube: 'from-red-500 to-orange-500',
  facebook: 'from-blue-600 to-indigo-500',
  twitter: 'from-sky-400 to-blue-500',
  discord: 'from-violet-500 to-fuchsia-500',
  spotify: 'from-emerald-500 to-lime-500',
}

export default function PlatformCategoryFilter({
  platform,
  title,
  description,
  ctaLabel,
  ctaHref,
  categories,
  services,
}: PlatformCategoryFilterProps) {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [pulseOn, setPulseOn] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setPulseOn(true), 400)
    return () => clearTimeout(timer)
  }, [])

  const filteredServices = useMemo(
    () => services.filter((service) => selectedCategory === 'All' || service.category === selectedCategory),
    [selectedCategory, services]
  )

  return (
    <div className="space-y-10">
      <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-white/5 via-white/5 to-white/10 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 shadow-lg shadow-slate-900/10">
              <PlatformIcon platform={platform} size={20} />
              <span className="font-semibold uppercase tracking-[0.28em]">{platform}</span>
            </div>
            <h1 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-5xl">{title}</h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">{description}</p>
          </div>

          <div className="space-y-4 text-right">
            <span className="inline-flex rounded-full bg-slate-900/80 px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300 ring-1 ring-emerald-300/20">
              Fast category discovery
            </span>
            <Link href={ctaHref} className={`inline-flex items-center justify-center rounded-full px-7 py-3 text-sm font-semibold text-white shadow-xl transition duration-200 ${pulseOn ? 'animate-pulse shadow-emerald-500/20' : ''} bg-gradient-to-r ${accentByPlatform[platform] ?? 'from-slate-700 to-slate-900'}`}>
              {ctaLabel}
            </Link>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-slate-950/80 p-4 shadow-inner shadow-slate-950/20">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${selectedCategory === category ? 'border-emerald-400 bg-emerald-500/15 text-emerald-200' : 'border-white/10 bg-slate-900/80 text-slate-300 hover:border-white/20 hover:bg-slate-900'}`}
              >
                {category}
              </button>
            ))}
          </div>
          <p className="mt-4 text-sm text-slate-400">Tap a category to instantly reduce the list and find the exact boost you want. The highlighted option shows what’s currently filtered.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {filteredServices.map((service, index) => (
          <motion.div
            key={service.name}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: index * 0.05 }}
            className="group overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/80 p-6 shadow-lg shadow-slate-950/20 transition hover:-translate-y-1 hover:border-emerald-400/30"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{service.category}</p>
                <h2 className="mt-3 text-xl font-bold text-white">{service.name}</h2>
              </div>
              <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
                {selectedCategory === 'All' ? service.category : selectedCategory}
              </div>
            </div>
            <p className="mt-5 text-sm leading-7 text-slate-300">{service.desc}</p>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <span className="rounded-full bg-slate-900/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-300">Instant access</span>
              <Link href={ctaHref} className="rounded-full bg-white/10 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/15">
                Order now
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
