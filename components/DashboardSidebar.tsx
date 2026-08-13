'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { formatCurrency } from '@/lib/utils'
import PlatformIcon from '@/lib/platformIcons'
import PWAInstallButton from './PWAInstallButton'

const USER_NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { href: '/dashboard/order', label: 'New Order', icon: '➕' },
  { href: '/dashboard/orders', label: 'My Orders', icon: '📦' },
  { href: '/dashboard/tickets', label: 'Tickets', icon: '🎫' },
  { href: '/dashboard/funds', label: 'Add Funds', icon: '💳' },
  { href: '/dashboard/giveaway', label: 'Giveaway', icon: '🎁' },
  { href: '/dashboard/transactions', label: 'Transactions', icon: '📊' },
  { href: '/dashboard/services', label: 'Services', icon: '⚙️' },
  { href: '/dashboard/referrals', label: 'Referrals', icon: '🎁' },
  { href: '/dashboard/profile', label: 'Profile', icon: '👤' },
]

const DEVELOPER_NAV = [
  { href: '/developer', label: 'Developer API', icon: '🔑' },
]

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export default function DashboardSidebar({ open, onClose }: SidebarProps) {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin'

    const NavLink = ({ href, label, icon, className = '' }: { href: string; label: string; icon: string; className?: string }) => {
    const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
    return (
      <Link href={href} onClick={onClose}
        className={`sidebar-link ${active ? 'active' : ''} ${className}`}>
        <span className="text-base w-5 text-center">
          {typeof icon === 'string' && icon.length <= 2 ? icon : icon}
        </span>
        <span>{label}</span>
      </Link>
    )
  }

  return (
    <>
      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full z-50 flex flex-col transition-transform duration-300
        lg:translate-x-0 lg:static lg:z-auto
        ${open ? 'translate-x-0' : '-translate-x-full'}
      `} style={{ width: 260, background: '#111827', borderRight: '1px solid #2D2D50' }}>

        {/* Logo */}
        <div className="p-5 border-b border-[#2D2D50]">
          <Link href="/" className="flex items-center">
            <img src="/logo.png" alt="BOASTLIB" className="w-10 h-10 object-contain" />
          </Link>
        </div>

        {/* User info */}
        <div className="p-4 border-b border-[#2D2D50]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0" style={{ background: 'linear-gradient(135deg, #3B82F6, #7C3AED)' }}>
              {user?.full_name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="text-white text-sm font-semibold truncate">{user?.full_name}</div>
              {isAdmin ? (
                <div className="text-amber-400 text-xs font-bold">🌐 Platform Owner</div>
              ) : (
                <div className="text-green-400 text-xs font-bold">{formatCurrency(user?.balance || 0)}</div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {isAdmin && (
            <div className="mb-3">
              <div className="text-[10px] text-[#6B7280] font-semibold uppercase tracking-wider px-3 mb-1">Admin</div>
              <NavLink href="/admin" label="Admin Panel" icon="👑" />
              <NavLink href="/admin/power" label="⚡ ADMIN Power" icon="⚡" className="admin-power" />
            </div>
          )}

          <div className="text-[10px] text-[#6B7280] font-semibold uppercase tracking-wider px-3 mb-1">Menu</div>
          {USER_NAV.map(item => <NavLink key={item.href} {...item} />)}

          {user?.is_developer && (
            <div className="mt-3">
              <div className="text-[10px] text-[#6B7280] font-semibold uppercase tracking-wider px-3 mb-1">Developer</div>
              {DEVELOPER_NAV.map(item => <NavLink key={item.href} {...item} />)}
            </div>
          )}
        </nav>

        <div className="p-3 border-t border-[#2D2D50]">
          <PWAInstallButton />
          <button onClick={logout} className="sidebar-link w-full text-left text-red-400 hover:text-red-300 hover:bg-red-500/10">
            <span className="text-base w-5 text-center">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}
