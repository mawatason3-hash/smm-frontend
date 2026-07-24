"use client"

import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

export default function ArticleClient({ post }: { post: { title: string; description: string; content: string } }) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    function onScroll() {
      if (!ref.current) return
      const el = ref.current
      const rect = el.getBoundingClientRect()
      const height = Math.max(rect.height - window.innerHeight, 1)
      const scrolled = Math.min(Math.max(window.innerHeight - rect.top, 0), rect.height)
      const pct = Math.max(0, Math.min(100, (scrolled / (rect.height)) * 100))
      setProgress(pct)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <div className="fixed left-0 right-0 top-0 h-1 z-50" style={{ pointerEvents: 'none' }}>
        <div style={{ width: `${progress}%` }} className="h-1 bg-gradient-to-r from-blue-500 to-purple-600 transition-all" />
      </div>

      <motion.div ref={ref} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-green-400">Blog</p>
          <h1 className="text-4xl font-black text-white">{post.title}</h1>
          <p className="text-[#9CA3AF] text-lg leading-relaxed">{post.description}</p>
        </div>

        <div className="space-y-6 text-[#D1D5DB] text-base leading-relaxed mt-8">
          <p>{post.content}</p>
          <p>BOASTLIB gives you a fast, affordable way to grow your social profiles with services built for Instagram, TikTok, YouTube, and more.</p>
        </div>
      </motion.div>
    </div>
  )
}
