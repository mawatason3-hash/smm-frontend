export const metadata = {
  title: 'Instagram Followers — BOASTLIB',
  description: 'Buy Instagram followers at the cheapest prices with instant delivery and high retention from BOASTLIB.',
}

import PlatformCategoryFilter from '@/components/PlatformCategoryFilter'

export default function InstagramFollowersPage() {
  return (
    <div className="max-w-6xl mx-auto py-16 px-4">
      <PlatformCategoryFilter
        platform="instagram"
        title="Buy Instagram Followers & More"
        description="Tap the category buttons to filter Instagram services instantly. Find followers, likes, story views, and comments with a single click."
        ctaLabel="Start Instagram Order"
        ctaHref="/auth/register"
        categories={['All', 'Followers', 'Likes', 'Story Views', 'Comments']}
        services={[
          { name: 'Instagram Followers', category: 'Followers', desc: 'Fast, real followers with high retention for Instagram profiles.' },
          { name: 'Instagram Likes', category: 'Likes', desc: 'Add likes to Instagram posts to boost engagement and visibility.' },
          { name: 'Instagram Story Views', category: 'Story Views', desc: 'Affordable story views to keep your content active and visible.' },
          { name: 'Instagram Comments', category: 'Comments', desc: 'Generate real comments on Instagram posts to increase social proof.' },
        ]}
      />
    </div>
  )
}
