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

export default function PlatformGrid({ selected, onSelect }: { selected?: string, onSelect: (p: PlatformKey) => void }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
      {PLATFORM_META.map((p) => {
        const active = selected === p.key
        return (
          <button
            key={p.key}
            onClick={() => onSelect(p.key)}
            className={cn(
              'rounded-xl p-4 flex flex-col items-center justify-center gap-2 border transition-shadow duration-150 bg-[#0B0B16]',
              active ? 'border-blue-400 shadow-[0_8px_30px_rgba(59,130,246,0.12)]' : 'border-white/6 hover:shadow-[0_6px_20px_rgba(0,0,0,0.24)]'
            )}
          >
            <div className={cn('text-2xl')}>
              {typeof p.Icon === 'function' ? <p.Icon /> : null}
            </div>
            <div className="text-sm text-slate-300">{p.label}</div>
          </button>
        )
      })}
    </div>
  )
}
