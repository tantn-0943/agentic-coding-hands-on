import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { CountdownUnit } from './CountdownUnit'

describe('CountdownUnit', () => {
	it('renders digits "0" and "5" for value=5', () => {
		render(<CountdownUnit value={5} label="DAYS" aria-label="5 days remaining" />)
		const digits = screen.getAllByText(/^[0-9]$/)
		expect(digits.map((d) => d.textContent)).toEqual(['0', '5'])
	})

	it('renders digits "1" and "5" for value=15', () => {
		render(<CountdownUnit value={15} label="HOURS" aria-label="15 hours remaining" />)
		const digits = screen.getAllByText(/^[0-9]$/)
		expect(digits.map((d) => d.textContent)).toEqual(['1', '5'])
	})

	it('renders digits "0" and "0" for value=0', () => {
		render(<CountdownUnit value={0} label="MINUTES" aria-label="0 minutes remaining" />)
		const digits = screen.getAllByText(/^[0-9]$/)
		expect(digits.map((d) => d.textContent)).toEqual(['0', '0'])
	})

	it('renders digits "9" and "9" for value=99', () => {
		render(<CountdownUnit value={99} label="DAYS" aria-label="99 days remaining" />)
		const digits = screen.getAllByText(/^[0-9]$/)
		expect(digits.map((d) => d.textContent)).toEqual(['9', '9'])
	})

	it('renders label text "DAYS"', () => {
		render(<CountdownUnit value={3} label="DAYS" aria-label="3 days remaining" />)
		expect(screen.getByText('DAYS')).toBeInTheDocument()
	})

	it('renders label text "MINUTES"', () => {
		render(<CountdownUnit value={45} label="MINUTES" aria-label="45 minutes remaining" />)
		expect(screen.getByText('MINUTES')).toBeInTheDocument()
	})

	it('outer div has role="group" and correct aria-label', () => {
		render(<CountdownUnit value={7} label="HOURS" aria-label="7 hours remaining" />)
		const group = screen.getByRole('group', { name: '7 hours remaining' })
		expect(group).toBeInTheDocument()
	})
})
