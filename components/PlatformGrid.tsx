"use client"

import { FaInstagram, FaTiktok, FaYoutube, FaFacebook, FaTwitter, FaTelegram, FaSpotify } from 'react-icons/fa'
import { SiDiscord } from 'react-icons/si'
import { cn } from '@/lib/utils'

export type PlatformKey = 'instagram'|'tiktok'|'youtube'|'facebook'|'twitter'|'telegram'|'spotify'|'discord'

const PLATFORM_META: { key: PlatformKey, label: string, Icon: any }[] = [
  { key: 'instagram', label: 'Instagram', Icon: FaInstagram },
  { key: 'tiktok', label: 'TikTok', Icon: FaTiktok },
  { key: 'youtube', label: 'YouTube', Icon: FaYoutube },
  { key: 'facebook', label: 'Facebook', Icon: FaFacebook },
  { key: 'twitter', label: 'Twitter X', Icon: FaTwitter },
  { key: 'telegram', label: 'Telegram', Icon: FaTelegram },
  { key: 'spotify', label: 'Spotify', Icon: FaSpotify },
  { key: 'discord', label: 'Discord', Icon: SiDiscord },
]

export default function PlatformGrid({ selected, onSelect }: { selected?: PlatformKey, onSelect: (p: PlatformKey) => void }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
      {PLATFORM_META.map((p) => {
        const active = selected === p.key
        return (
          <button
            key={p.key}
            onClick={() => onSelect(p.key)}
            className={cn(
              'rounded-2xl p-4 flex flex-col items-center justify-center gap-3 border text-left transition-all duration-200 bg-slate-950/90 shadow-sm',
              active
                ? 'border-blue-400 bg-gradient-to-br from-blue-500/10 to-slate-950 shadow-[0_20px_60px_rgba(59,130,246,0.16)]'
                : 'border-white/10 hover:border-blue-400/70 hover:bg-slate-900'
            )}
          >
            <div className={cn('flex h-12 w-12 items-center justify-center rounded-2xl', active ? 'bg-blue-500/15 text-blue-300' : 'bg-white/5 text-slate-300')}>
              <p.Icon className="text-xl" />
            </div>
            <div className="text-sm font-semibold text-slate-200">{p.label}</div>
          </button>
        )
      })}
    </div>
  )
}
