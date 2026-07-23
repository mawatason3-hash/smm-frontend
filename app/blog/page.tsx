import Link from 'next/link'

export const metadata = {
  title: 'Blog — BOASTLIB SMM Panel',
  description: 'Read news and growth strategies for social media marketing, SMM panels, Instagram, TikTok, and YouTube growth.',
}

const posts = [
  { title: 'How to grow Instagram followers fast', slug: 'grow-instagram-followers-fast' },
  { title: 'Best TikTok growth tips for creators', slug: 'best-tiktok-growth-tips' },
  { title: 'Why the cheapest SMM panel matters', slug: 'why-cheapest-smm-panel-matters' },
]

export default function BlogPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 py-16 px-4">
      <div className="text-center space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-green-400">Blog</p>
        <h1 className="text-4xl font-black text-white">Social Media Growth Tips & SMM Insights</h1>
        <p className="text-[#9CA3AF] max-w-3xl mx-auto">Follow the latest guides for Instagram, TikTok, YouTube, and social media marketing success.</p>
      </div>
      <div className="grid gap-4">
        {posts.map(post => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="card p-6 border border-[#2D2D50] hover:border-[#3B82F6] transition-all">
            <h2 className="text-2xl font-bold text-white mb-2">{post.title}</h2>
            <p className="text-[#9CA3AF] text-sm">Read the full article and learn how to scale your social profiles with BOASTLIB.</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
