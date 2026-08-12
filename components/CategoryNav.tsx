"use client"

import { cn } from '@/lib/utils'

export default function CategoryNav({ categories, active, onSelect }: { categories: string[], active?: string, onSelect: (c: string) => void }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/95 p-3 shadow-inner shadow-slate-950/30 overflow-x-auto">
      <div className="flex flex-wrap items-center gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={cn(
              'whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition',
              active === cat
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/20'
                : 'bg-slate-900/80 text-slate-300 border border-white/10 hover:border-blue-400/40 hover:bg-slate-900'
            )}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  )
}
