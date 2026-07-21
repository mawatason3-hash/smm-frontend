import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { ToastProvider } from '@/contexts/ToastContext'

export const metadata: Metadata = {
  title: 'BOASTLIB — Cheapest SMM Panel',
  description: 'Boost your social media instantly. Cheapest SMM panel with real-time delivery. Instagram, TikTok, YouTube, Facebook and more.',
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
