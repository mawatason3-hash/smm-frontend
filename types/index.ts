export interface User {
  id: string
  email: string
  full_name: string
  phone?: string
  country?: string
  role: 'user' | 'admin' | 'super_admin'
  status: 'active' | 'suspended' | 'banned'
  balance: number
  referral_code?: string
  is_developer: boolean
  api_key?: string
  admin_power_used: number
  created_at: string
}

export interface Service {
  id: string
  platform: string
  name: string
  description?: string
  rate_per_1k: number
  min_qty: number
  max_qty: number
  avg_speed?: string
  is_instant: boolean
  quality_badge?: string
  refill_enabled: boolean
  cancel_enabled: boolean
}

export interface Order {
  id: string
  order_number: number
  service_name: string
  platform: string
  link: string
  quantity: number
  charge: number
  status: OrderStatus
  start_count: number
  remains: number
  is_admin_power: boolean
  created_at: string
  updated_at: string
}

export type OrderStatus = 'pending' | 'processing' | 'in_progress' | 'completed' | 'partial' | 'cancelled' | 'error'

export interface Transaction {
  id: string
  type: string
  amount: number
  balance_before?: number
  balance_after?: number
  payment_method?: string
  payment_reference?: string
  payment_country?: string
  status: string
  description?: string
  created_at: string
}

export interface PaymentMethod {
  id: string
  name: string
  description: string
  icon: string
  instant: boolean
  countries: string
  correspondent?: string
}

export interface AdminStats {
  total_users: number
  new_today: number
  orders_today: number
  pending_orders: number
  revenue_today: number
  revenue_month: number
  revenue_all_time: number
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  pages: number
}

export const PLATFORMS = [
  { id: 'instagram', name: 'Instagram', color: 'from-pink-500 to-purple-600', icon: '📷', logoUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/instagram.svg' },
  { id: 'tiktok', name: 'TikTok', color: 'from-black to-pink-500', icon: '🎵', logoUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/tiktok.svg' },
  { id: 'youtube', name: 'YouTube', color: 'from-red-600 to-red-700', icon: '▶️', logoUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/youtube.svg' },
  { id: 'facebook', name: 'Facebook', color: 'from-blue-600 to-blue-700', icon: '👥', logoUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/facebook.svg' },
  { id: 'twitter', name: 'Twitter X', color: 'from-gray-800 to-black', icon: '𝕏', logoUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/twitter.svg' },
  { id: 'telegram', name: 'Telegram', color: 'from-blue-400 to-blue-600', icon: '✈️', logoUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/telegram.svg' },
  { id: 'spotify', name: 'Spotify', color: 'from-green-500 to-green-600', icon: '🎧', logoUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/spotify.svg' },
  { id: 'discord', name: 'Discord', color: 'from-indigo-500 to-purple-600', icon: '💬', logoUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/discord.svg' },
]

export const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'bg-yellow-500/20 text-yellow-400' },
  processing: { label: 'Processing', color: 'bg-blue-500/20 text-blue-400' },
  in_progress: { label: 'In Progress', color: 'bg-blue-500/20 text-blue-400' },
  completed: { label: 'Completed', color: 'bg-green-500/20 text-green-400' },
  partial: { label: 'Partial', color: 'bg-orange-500/20 text-orange-400' },
  cancelled: { label: 'Cancelled', color: 'bg-red-500/20 text-red-400' },
  error: { label: 'Error', color: 'bg-red-500/20 text-red-400' },
}
