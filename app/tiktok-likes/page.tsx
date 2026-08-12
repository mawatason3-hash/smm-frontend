export const metadata = {
  title: 'TikTok Likes — BOASTLIB',
  description: 'Buy TikTok likes cheaply and increase your social proof fast with BOASTLIB. Instant service and low-cost delivery.',
}

import PlatformCategoryFilter from '@/components/PlatformCategoryFilter'

export default function TikTokLikesPage() {
  return (
    <div className="max-w-6xl mx-auto py-16 px-4">
      <PlatformCategoryFilter
        platform="tiktok"
        title="Buy TikTok Likes & Growth Services"
        description="Choose any TikTok engagement category to narrow service options quickly. Likes, followers, views, and comments are all easy to browse."
        ctaLabel="Start TikTok Order"
        ctaHref="/auth/register"
        categories={['All', 'Likes', 'Followers', 'Views', 'Comments']}
        services={[
          { name: 'TikTok Likes', category: 'Likes', desc: 'Instant TikTok likes to grow your engagement fast.' },
          { name: 'TikTok Followers', category: 'Followers', desc: 'Grow your TikTok audience with safe and affordable followers.' },
          { name: 'TikTok Views', category: 'Views', desc: 'Boost your video reach with low-cost TikTok views.' },
          { name: 'TikTok Comments', category: 'Comments', desc: 'Add authentic comments to your TikTok content for better exposure.' },
        ]}
      />
    </div>
  )
}
