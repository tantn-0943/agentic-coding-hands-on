export type CountdownState = {
	days: number // 0–99 (clamped)
	hours: number // 0–23
	minutes: number // 0–59
	isExpired: boolean
	isMounted: boolean
}

export type TimeUnit = 'DAYS' | 'HOURS' | 'MINUTES'
