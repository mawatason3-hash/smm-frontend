import PlatformCategoryFilter from '@/components/PlatformCategoryFilter'

export const metadata = {
  title: 'Discord Growth — BOASTLIB',
  description: 'Buy Discord server members, invites, boosts and engagement services. Filter by category to find the exact Discord boost you need.',
}

export default function DiscordPage() {
  return (
    <div className="max-w-6xl mx-auto py-16 px-4">
      <PlatformCategoryFilter
        platform="discord"
        title="Buy Discord Members & Server Boosts"
        description="Filter Discord services by category to choose members, invites, boosts, or reactions for your community."
        ctaLabel="Start Discord Order"
        ctaHref="/auth/register"
        categories={['All', 'Server Members', 'Invites', 'Boosts', 'Reactions']}
        services={[
          { name: 'Discord Server Members', category: 'Server Members', desc: 'Grow your Discord community quickly with member boosts.' },
          { name: 'Discord Invites', category: 'Invites', desc: 'Increase Discord invite acceptance with active members.' },
          { name: 'Discord Boosts', category: 'Boosts', desc: 'Add server boosts to unlock better Discord perks.' },
          { name: 'Discord Reactions', category: 'Reactions', desc: 'Improve message engagement using reactions from real accounts.' },
        ]}
      />
    </div>
  )
}
