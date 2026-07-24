import type { Metadata, Viewport } from 'next'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { ToastProvider } from '@/contexts/ToastContext'

export const metadata: Metadata = {
  title: 'BOASTLIB — Cheapest SMM Panel | Buy Instagram, TikTok, YouTube Followers',
  description: 'Cheapest SMM panel with real-time delivery. Buy Instagram followers, TikTok likes, YouTube views, Facebook likes from $0.001. Instant delivery. 1,049+ services.',
  keywords: 'cheapest smm panel, buy instagram followers, buy tiktok likes, buy youtube views, smm panel cheap, instagram followers cheap, tiktok followers, social media marketing panel',
  metadataBase: new URL('https://boastlib.space'),
  openGraph: {
    title: 'BOASTLIB — Cheapest SMM Panel',
    description: 'Buy Instagram followers, TikTok likes, YouTube views from $0.001. Instant delivery.',
    url: 'https://boastlib.space',
    siteName: 'BOASTLIB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BOASTLIB — Cheapest SMM Panel',
    description: 'Cheapest SMM panel. Instant delivery. Starting from $0.001',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: 'https://boastlib.space',
  },
  icons: { icon: '/favicon.ico' },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'BoastLib',
  },
}

export const viewport: Viewport = {
  themeColor: '#3B82F6',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
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
