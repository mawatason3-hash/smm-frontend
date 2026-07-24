'use client'
import { Suspense } from 'react'
import ResetPasswordContent from './reset-password-content'

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordLoading />}>
      <ResetPasswordContent />
    </Suspense>
  )
}

function ResetPasswordLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#0B0B1A' }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-xl animate-pulse" style={{ background: 'linear-gradient(135deg, #3B82F6, #7C3AED)' }} />
        <div className="text-[#6B7280] text-sm">Loading...</div>
      </div>
    </div>
  )
}
