import { useState, useEffect } from 'react'
import type { CountdownState } from '@/types/countdown'

function calculateCountdown(eventDateStr: string | undefined): Omit<CountdownState, 'isMounted'> {
	if (!eventDateStr) return { days: 0, hours: 0, minutes: 0, isExpired: false }
	const eventDate = new Date(eventDateStr)
	if (isNaN(eventDate.getTime())) return { days: 0, hours: 0, minutes: 0, isExpired: false }
	const diff = eventDate.getTime() - Date.now()
	if (diff <= 0) return { days: 0, hours: 0, minutes: 0, isExpired: true }
	const totalMinutes = Math.floor(diff / 60_000)
	const minutes = totalMinutes % 60
	const totalHours = Math.floor(totalMinutes / 60)
	const hours = totalHours % 24
	const days = Math.min(99, Math.floor(totalHours / 24))
	return { days, hours, minutes, isExpired: false }
}

export function useCountdown(eventDateStr: string | undefined): CountdownState {
	const [state, setState] = useState<CountdownState>({
		days: 0,
		hours: 0,
		minutes: 0,
		isExpired: false,
		isMounted: false,
	})

	useEffect(() => {
		const tick = () => setState({ ...calculateCountdown(eventDateStr), isMounted: true })
		tick()
		const interval = setInterval(tick, 1_000)
		const handleVisibility = () => {
			if (document.visibilityState === 'visible') tick()
		}
		document.addEventListener('visibilitychange', handleVisibility)
		return () => {
			clearInterval(interval)
			document.removeEventListener('visibilitychange', handleVisibility)
		}
	}, [eventDateStr])

	return state
}
