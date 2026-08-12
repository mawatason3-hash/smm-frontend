"use client"

import Link from 'next/link'
import { motion } from 'framer-motion'
import { formatCurrency } from '@/lib/utils'

type Service = {
  id: string | number
  name: string
  rate_per_1k?: number | null
  cost_per_1k?: number | null
  provider?: string | null
  min_qty?: number | null
  max_qty?: number | null
  category?: string | null
  refill?: boolean | null
}

export default function ServiceCard({ service }: { service: Service }) {
  const price = service.cost_per_1k ?? service.rate_per_1k ?? 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.28 }}
      className="group overflow-hidden rounded-3xl border border-white/10 bg-[#0B0B16] p-5 shadow-[0_30px_50px_rgba(0,0,0,0.35)] transition hover:-translate-y-1 hover:border-blue-400/40"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-white line-clamp-2">{service.name}</h3>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-400">
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1">{service.provider ?? 'JAP'}</span>
            <span className={`rounded-full px-2.5 py-1 font-semibold ${service.refill ? 'bg-emerald-600/15 text-emerald-300 border border-emerald-500/20' : 'bg-rose-600/15 text-rose-300 border border-rose-500/20'}`}>{service.refill ? 'Refill Yes' : 'Refill No'}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Price</div>
          <div className="mt-2 text-2xl font-bold text-white">{formatCurrency(price)}/1K</div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <span className="rounded-full bg-slate-900/80 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">{service.category ?? 'General'}</span>
        <Link href={`/dashboard/order?service=${service.id}`} className="inline-flex rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-400">
          Order
        </Link>
      </div>
    </motion.div>
  )
}
