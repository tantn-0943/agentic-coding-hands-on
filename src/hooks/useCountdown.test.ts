import { renderHook, act } from '@testing-library/react'
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest'
import { useCountdown } from './useCountdown'

describe('useCountdown', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('returns SSR-safe initial state for undefined date, then isMounted=true after mount', () => {
		const { result } = renderHook(() => useCountdown(undefined))
		// renderHook flushes useEffect synchronously — isMounted=true after initial tick
		expect(result.current.isMounted).toBe(true)
		expect(result.current.isExpired).toBe(false)
		expect(result.current.days).toBe(0)
		expect(result.current.hours).toBe(0)
		expect(result.current.minutes).toBe(0)
	})

	it('handles invalid date string gracefully without throwing', () => {
		expect(() => {
			const { result } = renderHook(() => useCountdown('not-a-date'))
			expect(result.current.isExpired).toBe(false)
		}).not.toThrow()
	})

	it('returns isExpired=true for past date after mount', () => {
		const pastDate = new Date(Date.now() - 1000).toISOString()
		const { result } = renderHook(() => useCountdown(pastDate))
		expect(result.current.isExpired).toBe(true)
		expect(result.current.isMounted).toBe(true)
	})

	it('returns days=1 for future date +1 day', () => {
		const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 1000).toISOString()
		const { result } = renderHook(() => useCountdown(futureDate))
		expect(result.current.days).toBe(1)
		expect(result.current.isExpired).toBe(false)
	})

	it('returns hours=1, minutes=30 for exactly 90 minutes remaining', () => {
		const futureDate = new Date(Date.now() + 90 * 60 * 1000).toISOString()
		const { result } = renderHook(() => useCountdown(futureDate))
		expect(result.current.hours).toBe(1)
		expect(result.current.minutes).toBe(30)
	})

	it('returns isExpired=true when diff is exactly 0ms', () => {
		const nowDate = new Date(Date.now()).toISOString()
		const { result } = renderHook(() => useCountdown(nowDate))
		expect(result.current.isExpired).toBe(true)
	})

	it('clamps days to 99 when event is 100+ days away', () => {
		const farFuture = new Date(Date.now() + 100 * 24 * 60 * 60 * 1000 + 60 * 1000).toISOString()
		const { result } = renderHook(() => useCountdown(farFuture))
		expect(result.current.days).toBe(99)
	})

	it('decrements minutes after 60 seconds via setInterval', () => {
		const futureDate = new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 minutes
		const { result } = renderHook(() => useCountdown(futureDate))
		const initialMinutes = result.current.minutes
		act(() => {
			vi.advanceTimersByTime(60_000)
		})
		expect(result.current.minutes).toBe(initialMinutes - 1)
	})

	it('recalculates immediately when tab becomes visible after being hidden', () => {
		const futureDate = new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 minutes
		const { result } = renderHook(() => useCountdown(futureDate))
		const initialMinutes = result.current.minutes

		// Simulate tab hidden — setInterval may be throttled, simulate 2 minutes passing
		Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true })
		act(() => {
			vi.advanceTimersByTime(120_000)
		})

		// Tab becomes visible again — hook should recalculate immediately
		Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true })
		act(() => {
			document.dispatchEvent(new Event('visibilitychange'))
		})

		// After 2 minutes, minutes should be initialMinutes - 2
		expect(result.current.minutes).toBe(initialMinutes - 2)
	})
})
