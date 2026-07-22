import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { ToastProvider } from '@/contexts/ToastContext'

export const metadata: Metadata = {
  title: 'BOASTLIB — Cheapest SMM Panel',
  description: 'Boastlib.space is the cheapest SMM panel for Instagram, TikTok, YouTube, Facebook and more. Fast delivery, low prices, and trusted service.',
  metadataBase: new URL('https://boastlib.space'),
  openGraph: {
    title: 'BOASTLIB — Cheapest SMM Panel',
    description: 'Boastlib.space is the cheapest SMM panel for Instagram, TikTok, YouTube, Facebook and more. Fast delivery, low prices, and trusted service.',
    url: 'https://boastlib.space',
    siteName: 'BOASTLIB',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
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
