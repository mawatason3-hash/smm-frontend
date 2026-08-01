'use client'
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

interface InstallPromptContextValue {
  deferredPrompt: BeforeInstallPromptEvent | null
  isInstalled: boolean
  isIOS: boolean
  showManualInstructions: boolean
  browserSupportsInstall: boolean
  handlePromptInstall: () => Promise<void>
  openManualInstructions: () => void
  closeManualInstructions: () => void
}

const isAndroid = (userAgent: string) => /android/i.test(userAgent)
const isIOSDevice = (userAgent: string) => /iPad|iPhone|iPod/.test(userAgent)
const isSafariBrowser = (userAgent: string) => /^((?!chrome|android).)*safari/i.test(userAgent)

const InstallPromptContext = createContext<InstallPromptContextValue | undefined>(undefined)

export function InstallPromptProvider({ children }: { children: ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [showManualInstructions, setShowManualInstructions] = useState(false)
  const [browserSupportsInstall, setBrowserSupportsInstall] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const nav = window.navigator as Navigator & { standalone?: boolean; MSStream?: unknown }
    const installed = window.matchMedia('(display-mode: standalone)').matches || nav.standalone === true
    setIsInstalled(installed)

    const ios = isIOSDevice(nav.userAgent) && !(nav as any).MSStream
    setIsIOS(ios)

    const android = isAndroid(nav.userAgent)
    const safari = isSafariBrowser(navigator.userAgent)
    const supportsInstallPrompt = ios || android || !safari || nav.standalone === true
    setBrowserSupportsInstall(supportsInstallPrompt)

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }

    const installedHandler = () => {
      setIsInstalled(true)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handler)
    window.addEventListener('appinstalled', installedHandler)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      window.removeEventListener('appinstalled', installedHandler)
    }
  }, [])

  const openManualInstructions = useCallback(() => {
    setShowManualInstructions(true)
  }, [])

  const handlePromptInstall = useCallback(async () => {
    if (!deferredPrompt) {
      openManualInstructions()
      return
    }

    try {
      await deferredPrompt.prompt()
      const result = await deferredPrompt.userChoice
      if (result.outcome === 'accepted') {
        setIsInstalled(true)
      }
    } catch {
      openManualInstructions()
    } finally {
      setDeferredPrompt(null)
    }
  }, [deferredPrompt, openManualInstructions])

  const closeManualInstructions = useCallback(() => {
    setShowManualInstructions(false)
  }, [])

  const value = useMemo<InstallPromptContextValue>(() => ({
    deferredPrompt,
    isInstalled,
    isIOS,
    showManualInstructions,
    browserSupportsInstall,
    handlePromptInstall,
    openManualInstructions,
    closeManualInstructions,
  }), [deferredPrompt, isInstalled, isIOS, showManualInstructions, browserSupportsInstall, handlePromptInstall, openManualInstructions, closeManualInstructions])

  return <InstallPromptContext.Provider value={value}>{children}</InstallPromptContext.Provider>
}

export function useInstallPrompt() {
  const context = useContext(InstallPromptContext)
  if (!context) {
    throw new Error('useInstallPrompt must be used within an InstallPromptProvider')
  }
  return context
}
