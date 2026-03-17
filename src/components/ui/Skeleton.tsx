interface SkeletonProps {
  className?: string
  variant?: 'card' | 'text' | 'avatar' | 'custom'
}

const RADIUS_MAP = {
  card: 'rounded-lg',
  text: 'rounded',
  avatar: 'rounded-full',
  custom: '',
}

export function Skeleton({ className = '', variant = 'text' }: SkeletonProps) {
  return (
    <div
      className={`animate-shimmer ${RADIUS_MAP[variant]} ${className}`}
      role="status"
      aria-label="Loading"
    />
  )
}
