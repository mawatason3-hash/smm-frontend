"use client"

import Link from 'next/link'
import { motion } from 'framer-motion'

import posts from './posts'

export default function BlogClient() {
  return (
    <div className="min-h-screen bg-[#070816] text-white px-4 py-24">
      <div className="max-w-6xl mx-auto">
        <section className="rounded-3xl border border-[#2A2A45] bg-[#0F1224]/80 p-10 shadow-[0_25px_80px_rgba(15,23,42,0.25)]">
          <p className="text-green-400 uppercase tracking-[0.35em] text-xs font-semibold">Insights</p>
          <h1 className="text-4xl sm:text-5xl font-black mt-4">Social Media Marketing Guides & News</h1>
          <p className="mt-4 text-[#A5B4FC] max-w-3xl">Stay ahead with quick tutorials, review breakdowns, and announcement updates for BOASTLIB’s social media services.</p>
        </section>

        <main className="mt-10 grid gap-6 sm:grid-cols-2">
          {posts.map((post, index) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.42, delay: index * 0.07 }}
              whileHover={{ y: -4 }}
              className="rounded-3xl border border-[#2A2A45] bg-[#11131F] p-8 shadow-xl"
            >
              <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
                <span className="uppercase tracking-[0.24em]">{post.category}</span>
                <span>{post.date}</span>
              </div>
              <h2 className="text-2xl font-semibold text-white mb-3">{post.title}</h2>
              <p className="text-[#94A3B8] leading-relaxed">{post.description}</p>
              <div className="mt-6">
                <Link href={`/blog/${post.slug}`} className="text-sky-400 hover:text-white font-semibold">Read article →</Link>
              </div>
            </motion.article>
          ))}
        </main>
      </div>
    </div>
  )
}
