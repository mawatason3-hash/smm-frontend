'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import api from '@/lib/api'
import { formatCurrency, formatDateTime, getGreeting } from '@/lib/utils'
import PlatformIcon from '@/lib/platformIcons'
import { STATUS_CONFIG } from '@/types'

export default function DashboardPage() {
  const { user, refreshUser } = useAuth()
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [recentTx, setRecentTx] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [ordersRes, txRes] = await Promise.all([
          api.get('/api/orders?limit=5'),
          api.get('/api/transactions?limit=5'),
        ])
        setRecentOrders(ordersRes.data.items || [])
        setRecentTx(txRes.data.items || [])
      } catch {}
      finally { setLoading(false) }
    }
    load()
    refreshUser()
  }, [])

  const stats = [
    { label: 'Wallet Balance', value: formatCurrency(user?.balance || 0), icon: '💰', sub: 'Add funds', href: '/dashboard/funds', color: 'text-green-400' },
    { label: 'Total Orders', value: '—', icon: '📦', sub: 'View all', href: '/dashboard/orders', color: 'text-blue-400' },
    { label: 'Completed', value: '—', icon: '✅', sub: 'View history', href: '/dashboard/orders?status=completed', color: 'text-purple-400' },
    { label: 'Pending', value: '—', icon: '⏳', sub: 'Check status', href: '/dashboard/orders?status=pending', color: 'text-yellow-400' },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Welcome banner */}
      <div className="rounded-2xl p-6 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #7C3AED 100%)' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full" style={{ background: 'white', transform: 'translate(30%, -30%)' }} />
        </div>
        <div className="relative">
          <div className="text-white/70 text-sm font-medium">{getGreeting()},</div>
          <h1 className="text-white text-2xl font-black mt-1">{user?.full_name} 👋</h1>
          <p className="text-white/70 text-sm mt-2">Balance: <span className="text-white font-bold">{formatCurrency(user?.balance || 0)}</span></p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => (
          <Link key={stat.label} href={stat.href} className="card hover:scale-[1.02] cursor-pointer no-underline block">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{stat.icon}</span>
              <span className={`text-2xl font-black ${stat.color}`}>{stat.value}</span>
            </div>
            <div className="text-white font-semibold text-sm">{stat.label}</div>
            <div className="text-[#6B7280] text-xs mt-0.5">{stat.sub} →</div>
          </Link>
        ))}
      </div>

      {/* Quick Order Widget */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">🚀</span>
          <div>
            <h2 className="text-white font-bold">Quick Order</h2>
            <p className="text-[#6B7280] text-xs">Place a new order in seconds</p>
          </div>
          <Link href="/dashboard/order" className="ml-auto btn-primary text-sm px-5 py-2.5">New Order →</Link>
        </div>

        {/* Platform quick select */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {['instagram', 'tiktok', 'youtube', 'facebook', 'twitter', 'telegram', 'spotify', 'discord'].map(p => (
            <Link key={p} href={`/dashboard/order?platform=${p}`}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-[#1F1F3A] hover:bg-[#2D2D50] transition-colors">
              <span className="text-xl"><PlatformIcon platform={p} size={20} /></span>
              <span className="text-[9px] text-[#9CA3AF] capitalize">{p}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold">Recent Orders</h2>
            <Link href="/dashboard/orders" className="text-[#3B82F6] text-xs hover:underline">View all →</Link>
          </div>
          {loading ? (
            <div className="text-[#6B7280] text-sm">Loading...</div>
          ) : recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">📦</div>
              <div className="text-[#9CA3AF] text-sm">No orders yet</div>
              <Link href="/dashboard/order" className="text-[#3B82F6] text-sm hover:underline mt-2 block">Place your first order →</Link>
            </div>
          ) : (
            <div className="space-y-2">
              {recentOrders.map(order => (
                <div key={order.id} className="flex items-center gap-3 p-3 rounded-xl bg-[#1F1F3A]">
                  <span className="text-lg"><PlatformIcon platform={order.platform} size={18} /></span>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-medium truncate">{order.service_name}</div>
                    <div className="text-[#6B7280] text-xs">#{order.order_number} · {formatCurrency(order.charge)}</div>
                  </div>
                  <span className={`badge ${STATUS_CONFIG[order.status]?.color || ''}`}>
                    {STATUS_CONFIG[order.status]?.label || order.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold">Recent Transactions</h2>
            <Link href="/dashboard/transactions" className="text-[#3B82F6] text-xs hover:underline">View all →</Link>
          </div>
          {loading ? (
            <div className="text-[#6B7280] text-sm">Loading...</div>
          ) : recentTx.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">💳</div>
              <div className="text-[#9CA3AF] text-sm">No transactions yet</div>
              <Link href="/dashboard/funds" className="text-[#3B82F6] text-sm hover:underline mt-2 block">Add funds →</Link>
            </div>
          ) : (
            <div className="space-y-2">
              {recentTx.map((tx: any) => (
                <div key={tx.id} className="flex items-center gap-3 p-3 rounded-xl bg-[#1F1F3A]">
                  <span className="text-lg">{tx.amount > 0 ? '💰' : '📤'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-medium truncate">{tx.description || tx.type}</div>
                    <div className="text-[#6B7280] text-xs">{formatDateTime(tx.created_at)}</div>
                  </div>
                  <span className={`font-bold text-sm ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {tx.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(tx.amount))}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
