interface CategoryTagBadgeProps {
  tag: string
  variant?: 'default' | 'highlight'
}

export function CategoryTagBadge({ tag, variant = 'default' }: CategoryTagBadgeProps) {
  const colorClass = variant === 'highlight'
    ? 'border-[#00101A]/30 text-[#00101A]'
    : 'border-[var(--color-primary-gold)] text-[var(--color-primary-gold)]'

  return (
    <span
      className={`inline-block rounded border-[0.5px] bg-transparent px-2.5 py-1 text-sm font-bold uppercase ${colorClass}`}
      style={{ fontFamily: 'var(--font-gotham)' }}
    >
      {tag}
    </span>
  )
}
