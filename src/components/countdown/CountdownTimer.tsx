'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCountdown } from '@/hooks/useCountdown'
import { CountdownUnit } from '@/components/countdown/CountdownUnit'

type Props = {
	eventDateStr: string | undefined
}

export function CountdownTimer({ eventDateStr }: Props) {
	const { days, hours, minutes, isExpired } = useCountdown(eventDateStr)
	const router = useRouter()

	useEffect(() => {
		if (isExpired) router.replace('/')
	}, [isExpired, router])

	return (
		<div
			role="timer"
			aria-live="polite"
			aria-atomic="true"
			className="flex flex-row gap-6 md:gap-10 lg:gap-[60px] items-center justify-center"
		>
			<CountdownUnit value={days} label="DAYS" aria-label={`${days} days remaining`} />
			<CountdownUnit value={hours} label="HOURS" aria-label={`${hours} hours remaining`} />
			<CountdownUnit value={minutes} label="MINUTES" aria-label={`${minutes} minutes remaining`} />
		</div>
	)
}
