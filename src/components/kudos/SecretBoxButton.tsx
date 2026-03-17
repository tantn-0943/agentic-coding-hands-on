'use client'

import { Icon } from '@/components/ui/Icon'

interface SecretBoxButtonProps {
  unopenedCount: number
  onOpen?: () => void
}

export function SecretBoxButton({ unopenedCount, onOpen }: SecretBoxButtonProps) {
  const disabled = unopenedCount === 0

  return (
    <button
      type="button"
      onClick={onOpen}
      disabled={disabled}
      className={`flex w-full items-center justify-center gap-2 rounded-full px-6 py-2.5 text-base font-bold transition-colors ${
        disabled
          ? 'cursor-not-allowed bg-[var(--color-primary-gold)] text-[var(--color-bg-page)] opacity-50'
          : 'cursor-pointer bg-[var(--color-primary-gold)] text-[var(--color-bg-page)] hover:bg-[var(--color-gold-hover)]'
      }`}
      style={{ fontFamily: 'var(--font-gotham)' }}
    >
      Mo Secret Box
      <Icon name="gift" size={20} />
    </button>
  )
}
