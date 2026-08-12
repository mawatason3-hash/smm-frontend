'use client'

import { useEffect, useMemo, useState } from 'react'
import api from '@/lib/api'
import PlatformGrid, { type PlatformKey } from '@/components/PlatformGrid'
import CategoryNav from '@/components/CategoryNav'
import ServiceCard from '@/components/ServiceCard'

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

function deriveCategoryFromName(name?: string) {
  if (!name) return 'General'
  const mapping: Array<[RegExp, string]> = [
    [/followers?/i, 'Followers'],
    [/likes?/i, 'Likes'],
    [/views?/i, 'Views'],
    [/comments?/i, 'Comments'],
    [/saves?/i, 'Saves'],
    [/impression/i, 'Impressions'],
    [/members?/i, 'Members'],
    [/plays?/i, 'Plays'],
    [/engagement/i, 'Engagement'],
    [/subscrib/i, 'Subscribers'],
    [/message/i, 'Messages'],
  ]
  for (const [re, cat] of mapping) if (re.test(name)) return cat
  return 'Other'
}

export default function DashboardServicesPage() {
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformKey | undefined>(undefined)
  const [services, setServices] = useState<Service[]>([])
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!selectedPlatform) return
    let mounted = true
    setIsLoading(true)
    api.get(`/api/services?platform=${selectedPlatform}&limit=500`).then(res => {
      if (!mounted) return
      const data: Service[] = (res.data || []).map((s: any) => ({
        ...s,
        category: s.category || deriveCategoryFromName(s.name),
      }))
      setServices(data)
    }).catch(() => setServices([])).finally(() => mounted && setIsLoading(false))
    return () => { mounted = false }
  }, [selectedPlatform])

  const categories = useMemo(() => {
    const set = new Set<string>()
    services.forEach(s => set.add(s.category || deriveCategoryFromName(s.name)))
    return ['All', ...Array.from(set).filter(Boolean)]
  }, [services])

  const filtered = useMemo(() => {
    if (!selectedPlatform) return []
    if (activeCategory === 'All') return services
    return services.filter(s => (s.category || '').toLowerCase() === activeCategory.toLowerCase())
  }, [services, activeCategory, selectedPlatform])

  return (
    <div className="max-w-7xl mx-auto space-y-6 py-6">
      <div>
        <h1 className="text-2xl font-black text-white">Services</h1>
        <p className="text-sm text-slate-400 mt-1">Choose a platform to browse available boosts and service categories.</p>
      </div>

      <section>
        <PlatformGrid selected={selectedPlatform} onSelect={(p) => { setSelectedPlatform(p); setActiveCategory('All') }} />
      </section>

      {selectedPlatform && (
        <section>
          <div className="mt-4">
            <CategoryNav categories={categories} active={activeCategory} onSelect={(c) => setActiveCategory(c)} />
          </div>

          <div className="mt-6">
            {isLoading ? (
              <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-40 rounded-xl bg-slate-900/60 animate-pulse" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="rounded-xl border border-white/8 p-8 text-slate-400">No services found for this platform/category.</div>
            ) : (
              <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
                {filtered.map(s => (
                  <ServiceCard key={s.id} service={s} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  )
}
