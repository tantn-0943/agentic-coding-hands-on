'use client'

interface HashtagBadgeProps {
  name: string
  onClick?: (name: string) => void
  variant?: 'default' | 'highlight'
}

export function HashtagBadge({ name, onClick, variant = 'default' }: HashtagBadgeProps) {
  const colorClass = variant === 'highlight'
    ? 'bg-[#FFEA9E]/20 text-[#00101A] hover:bg-[#FFEA9E]/40'
    : 'bg-[var(--color-secondary-btn)] text-[var(--color-primary-gold)] hover:bg-[var(--color-secondary-btn-hover)]'

  return (
    <button
      type="button"
      onClick={() => onClick?.(name)}
      className={`cursor-pointer rounded px-2 py-1 text-sm font-medium transition-colors ${colorClass}`}
      style={{ fontFamily: 'var(--font-gotham)' }}
    >
      #{name}
    </button>
  )
}
