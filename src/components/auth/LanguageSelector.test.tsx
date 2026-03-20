import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { LanguageSelector } from './LanguageSelector'

// Mock useLocale hook
vi.mock('@/hooks/useLocale', () => ({
  useLocale: () => ({ locale: 'vi' as const, setLocale: vi.fn() }),
}))

describe('LanguageSelector', () => {
  it('renders a button with current locale label', () => {
    render(<LanguageSelector />)
    expect(screen.getByRole('button', { name: /select language/i })).toBeInTheDocument()
    expect(screen.getByText('VN')).toBeInTheDocument()
  })

  it('has aria-haspopup="listbox" attribute', () => {
    render(<LanguageSelector />)
    expect(screen.getByRole('button', { name: /select language/i })).toHaveAttribute('aria-haspopup', 'listbox')
  })

  it('has aria-expanded="false" when closed', () => {
    render(<LanguageSelector />)
    expect(screen.getByRole('button', { name: /select language/i })).toHaveAttribute('aria-expanded', 'false')
  })

  it('toggles aria-expanded on click', () => {
    render(<LanguageSelector />)
    const button = screen.getByRole('button', { name: /select language/i })
    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'true')
  })

  it('renders flag image for current locale', () => {
    render(<LanguageSelector />)
    expect(screen.getByAltText('VN flag')).toBeInTheDocument()
  })

  it('renders chevron icon', () => {
    render(<LanguageSelector />)
    expect(document.querySelector('img[aria-hidden="true"][src*="chevron"]')).toBeTruthy()
  })

  it('shows dropdown when open', () => {
    render(<LanguageSelector />)
    fireEvent.click(screen.getByRole('button', { name: /select language/i }))
    expect(screen.getByRole('listbox')).toBeInTheDocument()
  })
})
