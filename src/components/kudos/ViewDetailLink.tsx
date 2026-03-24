import { Icon } from '@/components/ui/Icon'

interface ViewDetailLinkProps {
  href?: string
  variant?: 'default' | 'highlight'
}

export function ViewDetailLink({ href = '#', variant = 'default' }: ViewDetailLinkProps) {
  // Figma highlight: 16px/700/#00101A, center
  // Figma default: 14px/500/#999, hover gold
  const colorClass = variant === 'highlight'
    ? 'text-base font-bold text-[#00101A] hover:text-[#00101A]/80'
    : 'text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-primary-gold)]'

  return (
    <a
      href={href}
      className={`flex items-center gap-1 transition-colors ${colorClass}`}
      style={{ fontFamily: 'var(--font-gotham)' }}
    >
      Xem chi tiet
      <Icon name="external" size={16} />
    </a>
  )
}
