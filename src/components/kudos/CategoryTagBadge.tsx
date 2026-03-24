interface CategoryTagBadgeProps {
  tag: string
  variant?: 'default' | 'highlight'
}

export function CategoryTagBadge({ tag, variant = 'default' }: CategoryTagBadgeProps) {
  const styleClass = variant === 'highlight'
    ? 'border-transparent text-[#00101A] font-bold'
    : 'border-[0.5px] border-[var(--color-primary-gold)] text-[var(--color-primary-gold)]'

  return (
    <span
      className={`inline-block rounded bg-transparent px-2.5 py-1 text-sm uppercase ${styleClass}`}
      style={{ fontFamily: 'var(--font-gotham)' }}
    >
      {tag}
    </span>
  )
}
