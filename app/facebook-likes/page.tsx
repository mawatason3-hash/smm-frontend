import PlatformCategoryFilter from '@/components/PlatformCategoryFilter'

export const metadata = {
  title: 'Facebook Engagement — BOASTLIB',
  description: 'Buy Facebook page likes, post likes, video views and more from BOASTLIB. Find the right Facebook service quickly with category filters.',
}

export default function FacebookLikesPage() {
  return (
    <div className="max-w-6xl mx-auto py-16 px-4">
      <PlatformCategoryFilter
        platform="facebook"
        title="Buy Facebook Likes & Engagement"
        description="Choose the Facebook category that matches your goal and instantly see the services for post likes, page likes, video views, shares, and comments."
        ctaLabel="Start Facebook Order"
        ctaHref="/auth/register"
        categories={['All', 'Page Likes', 'Post Likes', 'Followers', 'Video Views', 'Comments', 'Shares']}
        services={[
          { name: 'Facebook Page Likes', category: 'Page Likes', desc: 'Increase Facebook page credibility with reliable likes.' },
          { name: 'Facebook Post Likes', category: 'Post Likes', desc: 'Boost engagement on your Facebook post with likes from active accounts.' },
          { name: 'Facebook Followers', category: 'Followers', desc: 'Grow your Facebook audience with followers who help your page look more popular.' },
          { name: 'Facebook Video Views', category: 'Video Views', desc: 'Get more views on Facebook videos to increase visibility and watch time.' },
          { name: 'Facebook Shares', category: 'Shares', desc: 'Amplify your content reach with Facebook shares across real accounts.' },
          { name: 'Facebook Comments', category: 'Comments', desc: 'Add meaningful comments to your posts for better engagement signals.' },
        ]}
      />
    </div>
  )
}
