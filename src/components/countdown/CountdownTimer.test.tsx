import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CountdownTimer } from './CountdownTimer'

const mockReplace = vi.fn()

vi.mock('next/navigation', () => ({
	useRouter: () => ({ replace: mockReplace }),
}))

vi.mock('@/hooks/useCountdown', () => ({
	useCountdown: vi.fn(),
}))

vi.mock('@/components/countdown/CountdownUnit', () => ({
	CountdownUnit: ({ value, label }: { value: number; label: string }) => (
		<div data-testid="countdown-unit" data-value={value} data-label={label} />
	),
}))

import { useCountdown } from '@/hooks/useCountdown'

const mockUseCountdown = vi.mocked(useCountdown)

describe('CountdownTimer', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('does NOT call router.replace when isExpired=false', () => {
		mockUseCountdown.mockReturnValue({
			days: 3,
			hours: 5,
			minutes: 22,
			isExpired: false,
			isMounted: true,
		})
		render(<CountdownTimer eventDateStr="2025-12-31T18:00:00+07:00" />)
		expect(mockReplace).not.toHaveBeenCalled()
	})

	it('calls router.replace("/") when isExpired=true', () => {
		mockUseCountdown.mockReturnValue({
			days: 0,
			hours: 0,
			minutes: 0,
			isExpired: true,
			isMounted: true,
		})
		render(<CountdownTimer eventDateStr="2020-01-01T00:00:00Z" />)
		expect(mockReplace).toHaveBeenCalledWith('/')
	})

	it('calls router.replace exactly once on false→true transition', () => {
		mockUseCountdown.mockReturnValue({
			days: 1,
			hours: 0,
			minutes: 0,
			isExpired: false,
			isMounted: true,
		})
		const { rerender } = render(<CountdownTimer eventDateStr="2025-12-31T18:00:00+07:00" />)
		expect(mockReplace).not.toHaveBeenCalled()

		mockUseCountdown.mockReturnValue({
			days: 0,
			hours: 0,
			minutes: 0,
			isExpired: true,
			isMounted: true,
		})
		rerender(<CountdownTimer eventDateStr="2025-12-31T18:00:00+07:00" />)
		expect(mockReplace).toHaveBeenCalledTimes(1)
		expect(mockReplace).toHaveBeenCalledWith('/')
	})

	it('renders 3 CountdownUnit components with correct value and label props', () => {
		mockUseCountdown.mockReturnValue({
			days: 3,
			hours: 5,
			minutes: 22,
			isExpired: false,
			isMounted: true,
		})
		render(<CountdownTimer eventDateStr="2025-12-31T18:00:00+07:00" />)
		const units = screen.getAllByTestId('countdown-unit')
		expect(units).toHaveLength(3)
		expect(units[0]).toHaveAttribute('data-value', '3')
		expect(units[0]).toHaveAttribute('data-label', 'DAYS')
		expect(units[1]).toHaveAttribute('data-value', '5')
		expect(units[1]).toHaveAttribute('data-label', 'HOURS')
		expect(units[2]).toHaveAttribute('data-value', '22')
		expect(units[2]).toHaveAttribute('data-label', 'MINUTES')
	})

	it('wrapper div has aria-live="polite" and aria-atomic="true"', () => {
		mockUseCountdown.mockReturnValue({
			days: 0,
			hours: 0,
			minutes: 0,
			isExpired: false,
			isMounted: false,
		})
		render(<CountdownTimer eventDateStr={undefined} />)
		const live = screen.getByRole('timer')
		expect(live).toHaveAttribute('aria-live', 'polite')
		expect(live).toHaveAttribute('aria-atomic', 'true')
	})
})
