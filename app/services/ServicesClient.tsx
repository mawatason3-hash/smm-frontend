"use client"

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'

const platforms = [
  { key: 'all', label: 'All Platforms' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'tiktok', label: 'TikTok' },
  { key: 'youtube', label: 'YouTube' },
  { key: 'facebook', label: 'Facebook' },
  { key: 'discord', label: 'Discord' },
  { key: 'twitter', label: 'Twitter' },
  { key: 'spotify', label: 'Spotify' },
]

const categoriesByPlatform: Record<string, string[]> = {
  all: ['All', 'Followers', 'Likes', 'Views', 'Subscribers', 'Members', 'Shares', 'Comments'],
  instagram: ['All', 'Followers', 'Likes', 'Story Views', 'Comments'],
  tiktok: ['All', 'Likes', 'Followers', 'Views', 'Comments'],
  youtube: ['All', 'Views', 'Subscribers', 'Likes', 'Comments'],
  facebook: ['All', 'Page Likes', 'Post Likes', 'Followers', 'Video Views', 'Comments', 'Shares'],
  discord: ['All', 'Server Members', 'Invites', 'Boosts', 'Reactions'],
  twitter: ['All', 'Followers', 'Likes', 'Retweets', 'Comments'],
  spotify: ['All', 'Stream Plays', 'Followers', 'Saves', 'Playlist Adds'],
}

const services = [
  { name: 'Instagram Followers', platform: 'instagram', category: 'Followers', desc: 'Fast, real followers with high retention for Instagram profiles.' },
  { name: 'Instagram Likes', platform: 'instagram', category: 'Likes', desc: 'Add likes to Instagram posts to boost engagement and visibility.' },
  { name: 'Instagram Story Views', platform: 'instagram', category: 'Story Views', desc: 'Affordable story views to keep your content active and visible.' },
  { name: 'Instagram Comments', platform: 'instagram', category: 'Comments', desc: 'Generate real comments on Instagram posts to increase social proof.' },
  { name: 'TikTok Likes', platform: 'tiktok', category: 'Likes', desc: 'Instant TikTok likes to grow your engagement fast.' },
  { name: 'TikTok Followers', platform: 'tiktok', category: 'Followers', desc: 'Grow your TikTok audience with safe and affordable followers.' },
  { name: 'TikTok Views', platform: 'tiktok', category: 'Views', desc: 'Boost your video reach with low-cost TikTok views.' },
  { name: 'TikTok Comments', platform: 'tiktok', category: 'Comments', desc: 'Add authentic comments to your TikTok content for better exposure.' },
  { name: 'YouTube Views', platform: 'youtube', category: 'Views', desc: 'High-quality YouTube views for videos and channels.' },
  { name: 'YouTube Subscribers', platform: 'youtube', category: 'Subscribers', desc: 'Build your YouTube channel audience with affordable subscribers.' },
  { name: 'YouTube Likes', platform: 'youtube', category: 'Likes', desc: 'Get more likes on YouTube videos to improve ranking and credibility.' },
  { name: 'YouTube Comments', platform: 'youtube', category: 'Comments', desc: 'Add targeted comments to your videos for better engagement.' },
  { name: 'Facebook Page Likes', platform: 'facebook', category: 'Page Likes', desc: 'Increase Facebook page credibility with reliable likes.' },
  { name: 'Facebook Post Likes', platform: 'facebook', category: 'Post Likes', desc: 'Boost Facebook post engagement with likes from real accounts.' },
  { name: 'Facebook Video Views', platform: 'facebook', category: 'Video Views', desc: 'Get more views on Facebook videos to increase reach.' },
  { name: 'Facebook Shares', platform: 'facebook', category: 'Shares', desc: 'Improve content distribution with Facebook shares.' },
  { name: 'Discord Server Members', platform: 'discord', category: 'Server Members', desc: 'Grow your Discord community quickly with member boosts.' },
  { name: 'Discord Invites', platform: 'discord', category: 'Invites', desc: 'Increase Discord invite acceptance with active members.' },
  { name: 'Discord Boosts', platform: 'discord', category: 'Boosts', desc: 'Add server boosts to unlock better Discord perks.' },
  { name: 'Twitter Followers', platform: 'twitter', category: 'Followers', desc: 'Grow your Twitter account with real followers.' },
  { name: 'Twitter Likes', platform: 'twitter', category: 'Likes', desc: 'Boost your tweets with likes to increase engagement.' },
  { name: 'Twitter Retweets', platform: 'twitter', category: 'Retweets', desc: 'Get more retweets for wider Twitter distribution.' },
  { name: 'Spotify Stream Plays', platform: 'spotify', category: 'Stream Plays', desc: 'Increase Spotify play counts with affordable streams.' },
  { name: 'Spotify Followers', platform: 'spotify', category: 'Followers', desc: 'Grow your Spotify artist profile with followers.' },
]

const highlights = [
  {
    title: 'Quick search by category',
    desc: 'Click a platform, then choose a category to show only the services you need.',
  },
  {
    title: 'One-click discovery',
    desc: 'See services grouped by the type of boost you want — followers, likes, views, subscribers, and more.',
  },
  {
    title: 'All major platforms',
    desc: 'Find Facebook, YouTube, Discord, Instagram, TikTok, Twitter and Spotify boosts in one place.',
  },
]

export default function ServicesClient() {
  const [liveCount, setLiveCount] = useState(522)
  const [selectedPlatform, setSelectedPlatform] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('All')

  useEffect(() => {
    const id = setInterval(() => setLiveCount(v => v + Math.floor(Math.random() * 4) + 1), 1800)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    setSelectedCategory('All')
  }, [selectedPlatform])

  const categories = useMemo(
    () => categoriesByPlatform[selectedPlatform] || categoriesByPlatform.all,
    [selectedPlatform]
  )

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesPlatform = selectedPlatform === 'all' || service.platform === selectedPlatform
      const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory
      return matchesPlatform && matchesCategory
    })
  }, [selectedCategory, selectedPlatform])

  return (
    <div className="min-h-screen" style={{ background: '#0B0B1A' }}>
      <section className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-2xl p-8 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.06), rgba(124,58,237,0.06))' }}>
            <div className="absolute -left-24 -top-24 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: '#3B82F6' }} />
            <div className="absolute -right-24 -bottom-24 w-80 h-80 rounded-full opacity-8 blur-3xl" style={{ background: '#7C3AED' }} />
            <div className="text-center">
              <p className="text-sm text-green-400 uppercase tracking-[0.3em]">Services</p>
              <h1 className="text-4xl sm:text-5xl font-black text-white mt-3">Quickly find the boost you want</h1>
              <p className="max-w-3xl mx-auto text-[#9CA3AF] text-base sm:text-lg mt-4">Choose a platform, then select a category to instantly show the best services for that type of engagement. Facebook, YouTube, Discord and more are all organized for fast discovery.</p>
              <div className="inline-flex flex-col sm:flex-row items-center gap-3 mt-6 justify-center">
                <div className="px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 font-semibold">Live Orders: {liveCount.toLocaleString()}</div>
                <Link href="/auth/register" className="btn-primary px-5 py-2 text-sm">Create Account</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto space-y-10 py-8 px-4">
        <section className="rounded-3xl border border-[#2D2D50] bg-[#111827] p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Platform selector</h2>
              <p className="text-[#9CA3AF] text-sm mt-2">Start by choosing the social network you want to boost.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {platforms.map((platform) => (
                <button
                  key={platform.key}
                  onClick={() => setSelectedPlatform(platform.key)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${selectedPlatform === platform.key ? 'bg-blue-500 text-white' : 'border border-[#2D2D50] text-[#9CA3AF] hover:border-blue-400'}`}
                >
                  {platform.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-[#2D2D50] bg-[#111827] p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Category filters</h2>
              <p className="text-[#9CA3AF] text-sm mt-2">For quick and easy search, click the category you want to boast and see services for that section only.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${selectedCategory === category ? 'bg-emerald-500 text-white' : 'border border-[#2D2D50] text-[#9CA3AF] hover:border-emerald-400'}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          {highlights.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.36, delay: index * 0.06 }}
              className="card p-6 bg-[#11121F] border border-[#2D2D50]"
            >
              <h3 className="text-white font-bold text-lg mb-3">{card.title}</h3>
              <p className="text-[#9CA3AF] text-sm leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </section>

        <section className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-black text-white">Services</h2>
              <p className="text-[#9CA3AF] text-sm">Showing {filteredServices.length} services for {selectedPlatform === 'all' ? 'all platforms' : selectedPlatform} {selectedCategory !== 'All' ? `and ${selectedCategory}` : ''}.</p>
            </div>
            <Link href="/auth/register" className="btn-secondary px-5 py-2 text-sm">Start order</Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredServices.map((service) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.32 }}
                className="card border border-[#2D2D50] p-6"
              >
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-[#6B7280] font-semibold">{service.platform}</p>
                    <h3 className="text-xl font-bold text-white mt-2">{service.name}</h3>
                  </div>
                  <span className="text-sm rounded-full bg-blue-500/10 px-3 py-1 text-blue-300">{service.category}</span>
                </div>
                <p className="text-[#9CA3AF] text-sm leading-relaxed">{service.desc}</p>
                <div className="mt-6">
                  <Link href="/auth/register" className="btn-primary w-full text-center px-4 py-3 text-sm">Order now</Link>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
