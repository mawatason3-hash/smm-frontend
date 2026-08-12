"use client"

import { cn, formatCurrency } from '@/lib/utils'

export default function CategoryNav({ categories, active, onSelect }: { categories: string[], active?: string, onSelect: (c: string) => void }) {
  return (
    <div className="flex items-center gap-3 overflow-x-auto py-2">
      {categories.map(cat => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={cn('whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition', active === cat ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' : 'bg-slate-900/70 text-slate-300 border border-white/6 hover:brightness-105')}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
