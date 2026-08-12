export const metadata = {
  title: 'YouTube Views — BOASTLIB',
  description: 'Buy YouTube views for your videos with BOASTLIB. Affordable, fast, and reliable delivery for YouTube growth.',
}

import PlatformCategoryFilter from '@/components/PlatformCategoryFilter'

export default function YouTubeViewsPage() {
  return (
    <div className="max-w-6xl mx-auto py-16 px-4">
      <PlatformCategoryFilter
        platform="youtube"
        title="Buy YouTube Views, Subscribers & More"
        description="Select a YouTube category to instantly see the best service options. Views, subscribers, likes, and comments are now shown in one clear list."
        ctaLabel="Start YouTube Order"
        ctaHref="/auth/register"
        categories={['All', 'Views', 'Subscribers', 'Likes', 'Comments']}
        services={[
          { name: 'YouTube Views', category: 'Views', desc: 'High-quality YouTube views for videos and channels.' },
          { name: 'YouTube Subscribers', category: 'Subscribers', desc: 'Build your YouTube channel audience with affordable subscribers.' },
          { name: 'YouTube Likes', category: 'Likes', desc: 'Get more likes on YouTube videos to improve ranking and credibility.' },
          { name: 'YouTube Comments', category: 'Comments', desc: 'Add targeted comments to your videos for better engagement.' },
        ]}
      />
    </div>
  )
}
