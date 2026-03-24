'use client'

interface HashtagBadgeProps {
  name: string
  onClick?: (name: string) => void
  variant?: 'default' | 'highlight'
}

export function HashtagBadge({ name, onClick, variant = 'default' }: HashtagBadgeProps) {
  const isHighlight = variant === 'highlight'

  return (
    <button
      type="button"
      onClick={() => onClick?.(name)}
      className={`cursor-pointer rounded px-2 py-1 transition-colors ${
        isHighlight
          ? 'bg-transparent text-base font-normal'
          : 'bg-[var(--color-secondary-btn)] text-sm font-medium text-[var(--color-primary-gold)] hover:bg-[var(--color-secondary-btn-hover)]'
      }`}
      style={{
        fontFamily: 'var(--font-gotham)',
        ...(isHighlight ? { color: '#D4271D', fontWeight: 400 } : {}),
      }}
    >
      #{name}
    </button>
  )
}
