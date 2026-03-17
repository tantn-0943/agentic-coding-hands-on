interface EmptyStateProps {
  message: string
  className?: string
}

export function EmptyState({ message, className = '' }: EmptyStateProps) {
  return (
    <div className={`py-12 text-center text-base text-[var(--color-text-muted)] ${className}`}>
      {message}
    </div>
  )
}
