import { Icon } from '@/components/ui/Icon'

interface ViewDetailLinkProps {
  href?: string
}

export function ViewDetailLink({ href = '#' }: ViewDetailLinkProps) {
  return (
    <a
      href={href}
      className="flex items-center gap-1 text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-primary-gold)]"
      style={{ fontFamily: 'var(--font-gotham)' }}
    >
      Xem chi tiet
      <Icon name="external" size={16} />
    </a>
  )
}
