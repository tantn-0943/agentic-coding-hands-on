'use client'

import { useCountdown } from '@/hooks/useCountdown'
import { CountdownUnit } from '@/components/countdown/CountdownUnit'

export function CountdownSection() {
  const eventDateStr = process.env.NEXT_PUBLIC_EVENT_START_DATE
  const { days, hours, minutes, isExpired, isMounted } = useCountdown(eventDateStr)

  // Show 0 before hydration to prevent SSR/client mismatch
  const displayDays = isMounted ? days : 0
  const displayHours = isMounted ? hours : 0
  const displayMinutes = isMounted ? minutes : 0

  return (
    <div className="flex flex-col items-start gap-4">
      {!isExpired && (
        <p className="font-[family-name:var(--font-montserrat)] font-bold text-[24px] text-white">
          Coming soon
        </p>
      )}

      <div
        role="timer"
        aria-live="polite"
        aria-atomic="true"
        className="flex flex-row gap-6 md:gap-8 lg:gap-10 items-start"
      >
        <CountdownUnit
          value={displayDays}
          label="DAYS"
          aria-label={`${displayDays} days remaining`}
        />
        <CountdownUnit
          value={displayHours}
          label="HOURS"
          aria-label={`${displayHours} hours remaining`}
        />
        <CountdownUnit
          value={displayMinutes}
          label="MINUTES"
          aria-label={`${displayMinutes} minutes remaining`}
        />
      </div>
    </div>
  )
}
