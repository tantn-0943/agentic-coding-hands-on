interface CategoryTagBadgeProps {
  tag: string
}

export function CategoryTagBadge({ tag }: CategoryTagBadgeProps) {
  return (
    <span
      className="inline-block rounded border-[0.5px] border-[var(--color-primary-gold)] bg-transparent px-2.5 py-1 text-sm font-bold uppercase text-[var(--color-primary-gold)]"
      style={{ fontFamily: 'var(--font-gotham)' }}
    >
      {tag}
    </span>
  )
}
