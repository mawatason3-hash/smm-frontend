import { notFound } from 'next/navigation'

const posts = [
  {
    slug: 'grow-instagram-followers-fast',
    title: 'How to grow Instagram followers fast',
    description: 'Strategies to increase Instagram followers quickly with BOASTLIB’s cheapest SMM panel and instant delivery.',
    content: 'Use targeted engagement, reliable panel services, and consistent posting. BOASTLIB helps you buy followers safely while keeping your account secure.',
  },
  {
    slug: 'best-tiktok-growth-tips',
    title: 'Best TikTok growth tips for creators',
    description: 'Top TikTok growth tips for creators who want more likes and followers using smart SMM strategies.',
    content: 'Create viral content, use trending sounds, and boost initial engagement with affordable likes. BOASTLIB delivers fast TikTok growth services.',
  },
  {
    slug: 'why-cheapest-smm-panel-matters',
    title: 'Why the cheapest SMM panel matters',
    description: 'Learn why choosing an affordable SMM panel like BOASTLIB makes a difference for creators and marketers.',
    content: 'A cheap panel reduces costs while still delivering results. BOASTLIB combines low pricing with fast service and strong platform support.',
  },
]

export function generateStaticParams() {
  return posts.map(post => ({ slug: post.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const post = posts.find(item => item.slug === params.slug)
  if (!post) return {}
  return {
    title: `${post.title} — BOASTLIB`,
    description: post.description,
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = posts.find(item => item.slug === params.slug)
  if (!post) return notFound()

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-16 px-4">
      <div className="space-y-4">
        <p className="text-sm uppercase tracking-[0.3em] text-green-400">Blog</p>
        <h1 className="text-4xl font-black text-white">{post.title}</h1>
        <p className="text-[#9CA3AF] text-lg leading-relaxed">{post.description}</p>
      </div>
      <div className="space-y-6 text-[#D1D5DB] text-base leading-relaxed">
        <p>{post.content}</p>
        <p>BOASTLIB gives you a fast, affordable way to grow your social profiles with services built for Instagram, TikTok, YouTube, and more.</p>
      </div>
    </div>
  )
}
