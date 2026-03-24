import { Icon } from '@/components/ui/Icon'
import { computeStars } from '@/lib/utils/compute-stars'

interface UserInfoProps {
  name: string
  departmentName?: string
  kudosReceivedCount: number
  className?: string
  align?: 'left' | 'center'
  variant?: 'default' | 'highlight'
}

export function UserInfo({ name, departmentName, kudosReceivedCount, className = '', align = 'left', variant = 'default' }: UserInfoProps) {
  const starCount = computeStars(kudosReceivedCount)
  const isHighlight = variant === 'highlight'
  const alignClass = align === 'center' ? 'items-center text-center' : ''

  // Figma highlight: name=16px/700/#00101A center, dept=14px/700/#999 badge
  // Figma default: name=14px/500/gold, dept=14px/400/#999
  const nameClass = isHighlight
    ? 'text-base font-bold text-[#00101A]'
    : 'text-sm font-medium text-[var(--color-primary-gold)]'
  const starColor = isHighlight ? 'text-[#B8860B]' : 'text-[var(--color-primary-gold)]'

  return (
    <div className={`flex flex-col gap-1 ${alignClass} ${className}`}>
      <div className="flex items-center justify-center gap-1">
        <span
          className={`cursor-pointer ${nameClass}`}
          style={{ fontFamily: 'var(--font-gotham)' }}
        >
          {name}
        </span>
        {starCount > 0 && (
          <span className="flex items-center gap-0.5" title={`${starCount} star${starCount > 1 ? 's' : ''} (${kudosReceivedCount} kudos received)`}>
            {Array.from({ length: starCount }).map((_, i) => (
              <Icon key={i} name="star" size={14} className={starColor} />
            ))}
          </span>
        )}
      </div>
      {departmentName && (
        isHighlight ? (
          <span
            className="inline-block rounded bg-[#00101A]/10 px-2 py-0.5 text-sm font-bold text-[#999]"
            style={{ fontFamily: 'var(--font-gotham)' }}
          >
            {departmentName}
          </span>
        ) : (
          <span
            className="text-sm text-[var(--color-text-muted)]"
            style={{ fontFamily: 'var(--font-gotham)' }}
          >
            {departmentName}
          </span>
        )
      )}
    </div>
  )
}
