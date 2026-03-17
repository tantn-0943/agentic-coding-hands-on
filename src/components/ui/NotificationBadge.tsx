export function NotificationBadge() {
  return (
    <span
      className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full border border-[var(--color-background)] bg-[var(--color-error)]"
      aria-label="New notifications"
    />
  )
}
