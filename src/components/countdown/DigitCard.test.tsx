import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { DigitCard } from './DigitCard'

describe('DigitCard', () => {
	it('renders the digit character inside a span', () => {
		render(<DigitCard digit="7" />)
		expect(screen.getByText('7')).toBeInTheDocument()
	})

	it('inner background div has aria-hidden', () => {
		const { container } = render(<DigitCard digit="3" />)
		const ariaHidden = container.querySelector('[aria-hidden="true"]')
		expect(ariaHidden).not.toBeNull()
	})

	it('digit span has relative and z-10 classes', () => {
		const { container } = render(<DigitCard digit="5" />)
		const span = container.querySelector('span')
		expect(span?.className).toContain('relative')
		expect(span?.className).toContain('z-10')
	})

	it('wrapper div has overflow-hidden and rounded-xl', () => {
		const { container } = render(<DigitCard digit="0" />)
		const wrapper = container.firstElementChild
		expect(wrapper?.className).toContain('overflow-hidden')
		expect(wrapper?.className).toContain('rounded-xl')
	})

	it('matches snapshot for full DOM structure', () => {
		const { container } = render(<DigitCard digit="9" />)
		expect(container.firstChild).toMatchSnapshot()
	})
})
