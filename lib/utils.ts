import { type ClassValue, clsx } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return inputs.filter(Boolean).join(' ')
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

export function formatDateTime(dateStr: string): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`
}

export function formatNumber(n: number): string {
  return n.toLocaleString()
}

export function truncateLink(link: string, max = 30): string {
  if (!link) return '—'
  return link.length > max ? link.slice(0, max) + '...' : link
}

export function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export function calculateCharge(ratePerK: number, quantity: number): number {
  return (ratePerK * quantity) / 1000
}

export function getPlatformIcon(platform: string): string {
  const icons: Record<string, string> = {
    instagram: '📷', tiktok: '🎵', youtube: '▶️',
    facebook: '👥', twitter: '𝕏', telegram: '✈️',
    spotify: '🎧', discord: '💬', linkedin: '💼', twitch: '🎮',
  }
  return icons[platform?.toLowerCase()] || '🌐'
}

export function getPlatformColor(platform: string): string {
  const colors: Record<string, string> = {
    instagram: 'from-pink-500 to-purple-600',
    tiktok: 'from-gray-900 to-pink-500',
    youtube: 'from-red-600 to-red-700',
    facebook: 'from-blue-600 to-blue-700',
    twitter: 'from-gray-700 to-gray-900',
    telegram: 'from-blue-400 to-blue-600',
    spotify: 'from-green-500 to-green-700',
    discord: 'from-indigo-500 to-purple-700',
  }
  return colors[platform?.toLowerCase()] || 'from-gray-600 to-gray-800'
}

export function debounce<T extends (...args: any[]) => void>(fn: T, delay: number): T {
  let timer: NodeJS.Timeout
  return ((...args: any[]) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }) as T
}
