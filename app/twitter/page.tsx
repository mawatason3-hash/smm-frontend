import PlatformCategoryFilter from '@/components/PlatformCategoryFilter'

export const metadata = {
  title: 'Twitter Growth — BOASTLIB',
  description: 'Buy Twitter followers, likes, retweets and engagement from BOASTLIB. Filter services by category to find the right boost fast.',
}

export default function TwitterPage() {
  return (
    <div className="max-w-6xl mx-auto py-16 px-4">
      <PlatformCategoryFilter
        platform="twitter"
        title="Buy Twitter Followers & Engagement"
        description="Select a category to instantly filter Twitter services for followers, likes, retweets, and comments."
        ctaLabel="Start Twitter Order"
        ctaHref="/auth/register"
        categories={['All', 'Followers', 'Likes', 'Retweets', 'Comments']}
        services={[
          { name: 'Twitter Followers', category: 'Followers', desc: 'Grow your Twitter account with real followers.' },
          { name: 'Twitter Likes', category: 'Likes', desc: 'Boost tweet engagement with likes from active accounts.' },
          { name: 'Twitter Retweets', category: 'Retweets', desc: 'Increase your tweet reach with retweets from genuine profiles.' },
          { name: 'Twitter Comments', category: 'Comments', desc: 'Add comments to your tweets for better conversations and social proof.' },
        ]}
      />
    </div>
  )
}
