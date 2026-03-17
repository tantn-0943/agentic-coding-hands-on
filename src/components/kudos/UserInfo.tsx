import { Icon } from '@/components/ui/Icon'
import { computeStars } from '@/lib/utils/compute-stars'

interface UserInfoProps {
  name: string
  departmentName?: string
  kudosReceivedCount: number
  className?: string
}

export function UserInfo({ name, departmentName, kudosReceivedCount, className = '' }: UserInfoProps) {
  const starCount = computeStars(kudosReceivedCount)

  return (
    <div className={`flex flex-col gap-0.5 ${className}`}>
      <div className="flex items-center gap-1">
        <span
          className="cursor-pointer text-sm font-medium text-[var(--color-primary-gold)]"
          style={{ fontFamily: 'var(--font-gotham)' }}
        >
          {name}
        </span>
        {starCount > 0 && (
          <span className="flex items-center gap-0.5" title={`${starCount} star${starCount > 1 ? 's' : ''} (${kudosReceivedCount} kudos received)`}>
            {Array.from({ length: starCount }).map((_, i) => (
              <Icon key={i} name="star" size={14} className="text-[var(--color-primary-gold)]" />
            ))}
          </span>
        )}
      </div>
      {departmentName && (
        <span
          className="text-sm text-[var(--color-text-muted)]"
          style={{ fontFamily: 'var(--font-gotham)' }}
        >
          {departmentName}
        </span>
      )}
    </div>
  )
}
