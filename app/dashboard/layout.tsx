'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import DashboardSidebar from '@/components/DashboardSidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

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

  if (!isAuthenticated) return null

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#0B0B1A' }}>
      <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
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
    </div>
  )
}
