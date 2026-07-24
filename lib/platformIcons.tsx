import React from 'react'
import {
  FaYoutube,
  FaInstagram,
  FaTiktok,
  FaFacebook,
  FaTwitter,
  FaTelegram,
  FaSpotify,
  FaDiscord,
  FaLinkedin,
} from 'react-icons/fa'
import { SiThreads } from 'react-icons/si'

export const PLATFORM_ICONS: Record<string, { icon: any; color: string; bgGlow: string }> = {
  instagram: { icon: FaInstagram, color: '#E4405F', bgGlow: 'rgba(228,64,95,0.14)' },
  tiktok:    { icon: FaTiktok,    color: '#FFFFFF', bgGlow: 'rgba(255,255,255,0.06)' },
  youtube:   { icon: FaYoutube,   color: '#FF0000', bgGlow: 'rgba(255,0,0,0.14)' },
  facebook:  { icon: FaFacebook,  color: '#1877F2', bgGlow: 'rgba(24,119,242,0.12)' },
  twitter:   { icon: FaTwitter,   color: '#1DA1F2', bgGlow: 'rgba(29,161,242,0.08)' },
  telegram:  { icon: FaTelegram,  color: '#26A5E4', bgGlow: 'rgba(38,165,228,0.12)' },
  spotify:   { icon: FaSpotify,   color: '#1DB954', bgGlow: 'rgba(29,185,84,0.12)' },
  discord:   { icon: FaDiscord,   color: '#5865F2', bgGlow: 'rgba(88,101,242,0.12)' },
  linkedin:  { icon: FaLinkedin,  color: '#0A66C2', bgGlow: 'rgba(10,102,194,0.12)' },
  threads:   { icon: SiThreads,   color: '#000000', bgGlow: 'rgba(0,0,0,0.06)' },
}

export default function PlatformIcon({ platform, size = 24 }: { platform?: string | null; size?: number }) {
  if (!platform) return null
  const entry = PLATFORM_ICONS[(platform || '').toLowerCase()]
  if (!entry) return null
  const Icon = entry.icon
  return <Icon size={size} color={entry.color} />
}
