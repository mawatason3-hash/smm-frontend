import { notFound } from 'next/navigation'
import dynamic from 'next/dynamic'

import posts from '../posts'

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
  const ClientArticle = dynamic(() => import('./articleClient'), { ssr: false })

  return (
    <div className="min-h-screen" style={{ background: '#0B0B1A' }}>
      <ClientArticle post={post} />
    </div>
  )
}
