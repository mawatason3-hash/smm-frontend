'use client'
import InstallPromptModal from './InstallPromptModal'
import { useInstallPrompt } from './useInstallPrompt'

interface PWAInstallButtonProps {
  variant?: 'nav' | 'sidebar'
}

export default function PWAInstallButton({ variant = 'sidebar' }: PWAInstallButtonProps) {
  const {
    deferredPrompt,
    isInstalled,
    isIOS,
    showManualInstructions,
    handlePromptInstall,
    openManualInstructions,
    closeManualInstructions,
  } = useInstallPrompt()

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await handlePromptInstall()
      return
    }

    openManualInstructions()
  }

  const handleModalInstall = async () => {
    if (deferredPrompt) {
      await handlePromptInstall()
    }
    closeManualInstructions()
  }

  if (isInstalled) {
    return (
      <div className={variant === 'nav' ? 'inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-2 text-sm text-green-300' : 'mx-3 mb-2 px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center gap-2'}>
        <span>✅</span>
        <span className="text-xs font-medium text-green-100">App Installed</span>
      </div>
    )
  }

  return (
    <>
      {variant === 'nav' ? (
        <button onClick={handleInstallClick} className="inline-flex items-center gap-2 rounded-full border border-[#3B82F6]/30 bg-[#0F172A] px-4 py-2 text-sm text-[#E5E7EB] hover:border-[#3B82F6] hover:text-white transition-all">
          <span>📲</span>
          <span>Install App</span>
        </button>
      ) : (
        <div className="mx-3 mb-2">
          <button
            onClick={handleInstallClick}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 transition-all group"
          >
            <span className="text-lg">📲</span>
            <div className="text-left">
              <div className="text-white text-xs font-semibold">Install App</div>
              <div className="text-[#6B7280] text-[10px]">Add BOASTLIB to home screen</div>
            </div>
            <span className="ml-auto text-blue-400 text-xs group-hover:translate-x-0.5 transition-transform">→</span>
          </button>
        </div>
      )}

      <InstallPromptModal
        isOpen={showManualInstructions}
        onClose={closeManualInstructions}
        isInstalled={isInstalled}
        isIOS={isIOS}
        deferredPrompt={deferredPrompt}
        onInstall={handleModalInstall}
      />
    </>
  )
}
