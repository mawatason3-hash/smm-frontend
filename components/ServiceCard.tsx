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
      className="group overflow-hidden rounded-xl border border-white/8 bg-slate-950/80 p-4 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(2,6,23,0.6)] transition"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-white line-clamp-2">{service.name}</h3>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-sm text-slate-400">{service.provider ?? 'JAP'}</span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${service.refill ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}>{service.refill ? 'Refill: Yes' : 'Refill: No'}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-400">Price</div>
          <div className="text-lg font-bold text-white">{formatCurrency(price)}/1K</div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-slate-400 px-2 py-0.5 rounded-full bg-white/2">{service.category ?? 'General'}</span>
        <Link href={`/dashboard/order?service=${service.id}`} className="btn-primary px-3 py-1 text-sm">Order</Link>
      </div>
    </motion.div>
  )
}
