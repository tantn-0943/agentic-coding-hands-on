'use client'

interface HashtagBadgeProps {
  name: string
  onClick?: (name: string) => void
}

export function HashtagBadge({ name, onClick }: HashtagBadgeProps) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(name)}
      className="cursor-pointer rounded bg-[var(--color-secondary-btn)] px-2 py-1 text-sm font-medium text-[var(--color-primary-gold)] transition-colors hover:bg-[var(--color-secondary-btn-hover)]"
      style={{ fontFamily: 'var(--font-gotham)' }}
    >
      #{name}
    </button>
  )
}
