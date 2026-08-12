'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import api from '@/lib/api'
import PWAInstallButton from '@/components/PWAInstallButton'

const ADMIN_NAV = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/power', label: 'ADMIN Power', icon: '⚡', gold: true },
  { href: '/admin/users', label: 'Users', icon: '👥' },
  { href: '/admin/orders', label: 'Orders', icon: '📦' },
  { href: '/admin/services', label: 'Services', icon: '🛠️' },
  { href: '/admin/transactions', label: 'Transactions', icon: '💰' },
  { href: '/admin/manual-payments', label: 'Manual Payments 🇱🇷', icon: '📱' },
  { href: '/admin/giveaway-submissions', label: 'Giveaway Reviews', icon: '🎁' },
  { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
  { href: '/admin/activity-log', label: 'Activity Log', icon: '📋' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [clock, setClock] = useState('')
  const [pendingCount, setPendingCount] = useState(0)

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !['admin', 'super_admin'].includes(user?.role || ''))) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, isLoading, user])

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await api.get('/api/admin/manual-payments', { params: { status: 'pending', limit: 1 } })
        setPendingCount(res.data.total || 0)
      } catch {
        setPendingCount(0)
      }
    }
    fetchPending()
  }, [])

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString())
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  if (isLoading) return <div className="min-h-screen flex items-center justify-center" style={{ background: '#0B0B1A' }}><div className="text-[#6B7280]">Loading...</div></div>
  if (!isAuthenticated) return null

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#0B0B1A' }}>
      {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside className={`fixed top-0 left-0 h-full z-50 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ width: 260, background: '#0F0F1F', borderRight: '1px solid #2D2D50' }}>

        <div className="p-5 border-b border-[#2D2D50]">
          <Link href="/" className="inline-flex items-center mb-3">
            <img src="/logo.png" alt="BOASTLIB" className="w-10 h-10 object-contain" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-lg text-xs font-bold" style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: 'white' }}>
              👑 Admin Panel
            </div>
          </div>
        </div>

        <div className="p-4 border-b border-[#2D2D50]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-sm" style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)' }}>
              {user?.full_name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="text-white text-sm font-semibold truncate">{user?.full_name}</div>
              <div className="text-yellow-400 text-xs">{user?.role === 'super_admin' ? 'Super Admin' : 'Admin'}</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {ADMIN_NAV.map(item => {
            const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
            return (
              <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                className={`sidebar-link ${active ? (item.gold ? 'admin-power active' : 'active') : (item.gold ? 'admin-power' : '')}`}>
                <span className="text-base w-5 text-center">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {item.href === '/admin/manual-payments' && pendingCount > 0 && (
                  <span className="inline-flex items-center justify-center rounded-full bg-orange-500 text-white text-[10px] font-semibold px-2 py-1 ml-auto">
                    {pendingCount}
                  </span>
                )}
              </Link>
            )
          })}

          <div className="pt-3 border-t border-[#2D2D50] mt-3">
            <Link href="/dashboard" className="sidebar-link">
              <span className="text-base w-5 text-center">👤</span>
              <span>Back to Dashboard</span>
            </Link>
          </div>
        </nav>

        <div className="p-3 border-t border-[#2D2D50]">
          <PWAInstallButton />
          <button onClick={logout} className="sidebar-link w-full text-left text-red-400 hover:text-red-300 hover:bg-red-500/10">
            <span className="w-5 text-center">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex items-center gap-4 px-4 sm:px-6 h-14 border-b border-[#2D2D50] flex-shrink-0" style={{ background: '#0F0F1F' }}>
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-[#9CA3AF] hover:text-white">☰</button>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <span className="text-[#9CA3AF] text-sm font-mono">{clock}</span>
            <span className="text-[#6B7280] text-sm">{user?.full_name}</span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  )
}
