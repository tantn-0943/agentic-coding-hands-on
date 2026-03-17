'use client'

import { useEffect } from 'react'

interface ToastProps {
  message: string
  visible: boolean
  onDismiss: () => void
  duration?: number
}

export function Toast({ message, visible, onDismiss, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (!visible) return
    const timer = setTimeout(onDismiss, duration)
    return () => clearTimeout(timer)
  }, [visible, onDismiss, duration])

  if (!visible) return null

  return (
    <div
      className="fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 rounded-lg border border-[var(--color-border-gold)] bg-[var(--color-card-bg)] px-6 py-3 text-sm text-white transition-all duration-300"
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  )
}
