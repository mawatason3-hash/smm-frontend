'use client'
import { useEffect } from 'react'
import type { BeforeInstallPromptEvent } from './useInstallPrompt'

interface InstallPromptModalProps {
  isOpen: boolean
  onClose: () => void
  isInstalled: boolean
  isIOS: boolean
  deferredPrompt: BeforeInstallPromptEvent | null
  onInstall: () => Promise<void>
}

export default function InstallPromptModal({
  isOpen,
  onClose,
  isInstalled,
  isIOS,
  deferredPrompt,
  onInstall,
}: InstallPromptModalProps) {
  useEffect(() => {
    if (!isOpen) return
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen || isInstalled) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-3xl border border-[#2D2D50] bg-[#0B0B1A] p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-[#111827] flex items-center justify-center text-2xl">📲</div>
          <div>
            <h2 className="text-white text-xl font-bold">Install BoastLib App</h2>
            <p className="text-[#9CA3AF] text-sm mt-1">Get faster access and a native app experience — install BoastLib to your home screen.</p>
          </div>
        </div>

        <div className="space-y-3 mb-6 text-[#E5E7EB] text-sm leading-6">
          {deferredPrompt ? (
            <p>Tap install to get the BoastLib app on your device. If your browser supports it, we’ll show the native install prompt.</p>
          ) : isIOS ? (
            <p>Tap the Share icon, then select “Add to Home Screen” to install BoastLib on your iPhone or iPad.</p>
          ) : (
            <p>Look for the Install icon in your browser’s address bar, or choose “Add to Home Screen” from your browser menu.</p>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={onInstall}
            className="btn-primary w-full sm:w-auto px-5 py-3"
          >
            Install Now
          </button>
          <button
            onClick={onClose}
            className="w-full sm:w-auto rounded-xl border border-[#2D2D50] px-5 py-3 text-sm text-[#9CA3AF] hover:text-white transition-colors"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  )
}
