import type { MetadataRoute } from 'next'

const SITE_URL = 'https://boastlib.space'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date().toISOString()

  return [
    { url: SITE_URL, lastModified },
    { url: `${SITE_URL}/services`, lastModified },
    { url: `${SITE_URL}/blog`, lastModified },
    { url: `${SITE_URL}/blog/grow-instagram-followers-fast`, lastModified },
    { url: `${SITE_URL}/blog/best-tiktok-growth-tips`, lastModified },
    { url: `${SITE_URL}/blog/why-cheapest-smm-panel-matters`, lastModified },
    { url: `${SITE_URL}/instagram-followers`, lastModified },
    { url: `${SITE_URL}/tiktok-likes`, lastModified },
    { url: `${SITE_URL}/youtube-views`, lastModified },
    { url: `${SITE_URL}/auth/login`, lastModified },
    { url: `${SITE_URL}/auth/register`, lastModified },
    { url: `${SITE_URL}/auth/forgot-password`, lastModified },
    { url: `${SITE_URL}/auth/reset-password`, lastModified },
    { url: `${SITE_URL}/developer`, lastModified },
  ]
}
