'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import DashboardSidebar from '@/components/DashboardSidebar'
import { useInstallPrompt } from '@/components/useInstallPrompt'
import InstallPromptModal from '@/components/InstallPromptModal'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showLoginInstallModal, setShowLoginInstallModal] = useState(false)
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()
  const {
    deferredPrompt,
    isInstalled,
    isIOS,
    browserSupportsInstall,
    handlePromptInstall,
  } = useInstallPrompt()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push('/auth/login')
  }, [isAuthenticated, isLoading, router])

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0B0B1A' }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black" style={{ background: 'linear-gradient(135deg, #3B82F6, #7C3AED)' }}>B</div>
        <div className="text-[#6B7280] text-sm">Loading...</div>
      </div>
    </div>
  )

  const isAdmin = user?.role === 'super_admin' || user?.role === 'admin'

  useEffect(() => {
    if (typeof window === 'undefined') return
    const pending = localStorage.getItem('install_prompt_pending') === 'true'
    if (!pending) return

    localStorage.removeItem('install_prompt_pending')
    localStorage.setItem('install_prompt_shown', 'true')

    if (isInstalled || (!browserSupportsInstall && !isIOS)) return
    setShowLoginInstallModal(true)
  }, [isInstalled, browserSupportsInstall, isIOS])

  if (!isAuthenticated) return null

  const handleLoginInstall = async () => {
    if (deferredPrompt) {
      await handlePromptInstall()
    }
    setShowLoginInstallModal(false)
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#0B0B1A' }}>
      <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Admin Banner - Show when admin visits user dashboard */}
        {isAdmin && (
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-amber-500/20 border-b border-amber-500/50">
            <div className="flex items-center gap-3">
              <span className="text-lg">👑</span>
              <div>
                <div className="text-amber-300 font-bold text-sm">You are logged in as {user?.role === 'super_admin' ? 'Super Admin' : 'Admin'}</div>
                <div className="text-amber-200 text-xs">Your management panel is at /admin</div>
              </div>
            </div>
            <a href="/admin" className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-black font-bold text-sm whitespace-nowrap">
              Go to Admin Dashboard →
            </a>
          </div>
        )}

        {/* Top bar */}
        <header className="flex items-center gap-4 px-4 sm:px-6 h-14 border-b border-[#2D2D50] flex-shrink-0" style={{ background: '#111827' }}>
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-[#9CA3AF] hover:text-white p-1">
            <span className="text-xl">☰</span>
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <button className="text-[#6B7280] hover:text-white transition-colors text-lg">🔔</button>
            <button className="text-[#6B7280] hover:text-white transition-colors text-lg">⚙️</button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>

      <InstallPromptModal
        isOpen={showLoginInstallModal}
        onClose={() => setShowLoginInstallModal(false)}
        isInstalled={isInstalled}
        isIOS={isIOS}
        deferredPrompt={deferredPrompt}
        onInstall={handleLoginInstall}
      />
    </div>
  )
}
