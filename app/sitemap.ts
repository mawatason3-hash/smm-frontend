import type { MetadataRoute } from 'next'

const SITE_URL = 'https://boastlib.space'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${SITE_URL}/auth/login`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${SITE_URL}/auth/register`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${SITE_URL}/auth/forgot-password`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${SITE_URL}/auth/reset-password`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${SITE_URL}/developer`,
      lastModified: new Date().toISOString(),
    },
  ]
}
