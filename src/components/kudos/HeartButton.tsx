'use client'

import { Icon } from '@/components/ui/Icon'
import { useHeartToggle } from '@/hooks/useHeartToggle'

interface HeartButtonProps {
  kudosId: string
  initialHearted: boolean
  initialCount: number
  isOwnKudos: boolean
  variant?: 'default' | 'highlight'
}

export function HeartButton({ kudosId, initialHearted, initialCount, isOwnKudos, variant = 'default' }: HeartButtonProps) {
  const { hearted, count, toggle, disabled } = useHeartToggle({
    kudosId,
    initialHearted,
    initialCount,
    isOwnKudos,
  })

  // Figma highlight: count=24px/700/#00101A
  // Figma default: count=16px/500/white
  const countClass = variant === 'highlight'
    ? 'text-2xl font-normal text-[#00101A]'
    : 'text-base font-medium text-white'

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={disabled}
      className={`flex items-center gap-1.5 transition-transform duration-200 ${
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-105 active:scale-95'
      }`}
      aria-label={hearted ? 'Unlike this kudos' : 'Like this kudos'}
    >
      <Icon
        name={hearted ? 'heart-filled' : 'heart-outline'}
        size={20}
        className={hearted ? 'text-[var(--color-heart-red)]' : 'text-[var(--color-text-muted)]'}
      />
      <span
        className={countClass}
        style={{ fontFamily: 'var(--font-gotham)' }}
        aria-live="polite"
      >
        {count.toLocaleString()}
      </span>
    </button>
  )
}
