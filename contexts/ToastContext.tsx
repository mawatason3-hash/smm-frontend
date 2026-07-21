'use client'
import { createContext, useContext, useState, ReactNode, useCallback } from 'react'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
  id: string
  message: string
  type: ToastType
}

interface ToastContextType {
  toasts: Toast[]
  showToast: (message: string, type?: ToastType) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`flex items-start gap-3 p-4 rounded-xl border shadow-2xl animate-slide-in backdrop-blur-sm
              ${toast.type === 'success' ? 'bg-green-900/90 border-green-500/50 text-green-100' : ''}
              ${toast.type === 'error' ? 'bg-red-900/90 border-red-500/50 text-red-100' : ''}
              ${toast.type === 'warning' ? 'bg-yellow-900/90 border-yellow-500/50 text-yellow-100' : ''}
              ${toast.type === 'info' ? 'bg-[#16162D]/90 border-[#3B82F6]/50 text-white' : ''}
            `}
          >
            <span className="text-lg flex-shrink-0">
              {toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : toast.type === 'warning' ? '⚠️' : 'ℹ️'}
            </span>
            <p className="text-sm flex-1 leading-relaxed">{toast.message}</p>
            <button onClick={() => removeToast(toast.id)} className="text-white/50 hover:text-white text-lg leading-none">×</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
